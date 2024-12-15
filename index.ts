import { isColor, isTone, parseColor } from './color'
import {
  camelToDashCase,
  hasUpperCase,
  matchBreakpoint,
  splitByDashesKeepingArbitrary,
  splitByFirstDash,
  validateHtmlClass,
} from './helper'
import { configure, options, reset } from './options'
import { type ComplexValue, type CssStyles, type MultiSize, Type, type Values } from './types'
import { Preset } from './web'

export { Type, Preset }
export { reset, configure }
export type { CssStyles }

export const parseNumber = (value: string | number) => {
  let result: number

  try {
    result = Number(value)
  } catch (_error) {
    // Ignore
    return value
  }

  if (Number.isNaN(result)) {
    return value
  }

  return result
}

const parseSize = (value: MultiSize | string): MultiSize | string | undefined => {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'number') {
    return value
  }

  if (value in options.sizes) {
    return options.sizes[value]
  }

  const color = parseColor(value)
  if (color) {
    return color
  }

  return parseNumber(value)
}

// TODO use as types for default values.
// TODO far from including all values, should be distinct by property.
const arbitraryPropertyValues = new Set([
  'inherit',
  'initial',
  'auto',
  'center',
  'space-between',
  'space-around',
  'row',
  'column',
  'column-reverse',
  'wrap',
  'wrap-reverse',
  'nowrap',
  'start',
  'normal',
  'flex',
  'bold',
  'bolder',
  'relative',
  'sticky',
  'static',
  'none',
])

const isBracketed = (value: string) => value.startsWith('[') && value.endsWith(']')

const isArbitrary = (value: string) => {
  if (isBracketed(value)) {
    return true
  }

  if (arbitraryPropertyValues.has(value)) {
    return true
  }

  return false
}

function processValue(current: string, next: string | undefined, sizes: MultiSize[], colors: string[], arbitraryValues: string[]) {
  const isArbitraryWithNext = !isBracketed(current) && isArbitrary(`${current}-${next}`)

  if (isArbitraryWithNext) {
    arbitraryValues.push(`${current}-${next}`)
    return true
  }

  if (isArbitrary(current)) {
    arbitraryValues.push(current.replace('[', '').replace(']', '').replaceAll('_', ' '))
    return false
  }

  if (isColor(current)) {
    const nextIsTone = isTone(next ?? '')
    const color = parseColor(nextIsTone ? `${current}-${next}` : current)
    if (color) {
      colors.push(color)
    }
    return nextIsTone
  }

  const size = parseSize(current)
  if (size || size === 0) {
    sizes.push(Array.isArray(size) ? size : ([size, size] as MultiSize))
    return false
  }

  if (current) {
    arbitraryValues.push(current)
  }

  return false
}

export const extractValues = (value: string): Values => {
  const [property, valuesJoined] = splitByFirstDash(value)
  const values = splitByDashesKeepingArbitrary(valuesJoined)
  const sizes: MultiSize[] = []
  const colors: string[] = []
  const arbitraryValues: string[] = []
  let skipNext = false

  values.forEach((current, index) => {
    if (skipNext) {
      skipNext = false
      return null
    }

    const next = index + 1 < values.length ? values[index + 1] : undefined // Used for lookahead.

    if (processValue(current, next, sizes, colors, arbitraryValues)) {
      skipNext = true
    }
  })

  return { property, size: sizes, color: colors, arbitrary: arbitraryValues, complex: undefined }
}

const extractBreakpoint = (value: string) => {
  let [breakpoint, rest] = value.split(':')
  let match = true
  let matchUpwards = true

  if (breakpoint?.endsWith('-only')) {
    breakpoint = breakpoint.replace('-only', '')
    matchUpwards = false
  }

  const breakpointExists = (breakpoint ?? 0) in options.breakpoints

  if (process.env.NODE_ENV !== 'production' && !breakpointExists) {
    // biome-ignore lint/suspicious/noConsole: Only shown in development.
    console.warn(`Invalid breakpoint "${breakpoint}" used.`)
  }

  if (breakpointExists) {
    // TODO create matchers for all breakpoints initially and use listeners.
    match = matchBreakpoint(matchUpwards, options, breakpoint ?? '')
  }

  return [rest, match] as [string, boolean]
}

// Recursive function to resolve chain of shortcuts.
export const resolveShortcut = (value: string, first = true) => {
  if (typeof value !== 'string') {
    return ''
  }
  const [currentValue, values] = splitByFirstDash(value)

  if (!currentValue) {
    return
  }

  const hasShortcut = Object.hasOwn(options.shortcuts, currentValue)
  // If the property is a string, it's an alias, properties themselves have no values and will be resolved later.
  const hasAlias = Object.hasOwn(options.properties, currentValue) && typeof options.properties[currentValue] === 'string'

  if (!(hasShortcut || hasAlias)) {
    return values !== '' ? `${currentValue}-${values}` : currentValue
  }

  let shortcutOrAlias = options.shortcuts[currentValue]

  if (!shortcutOrAlias && hasAlias) {
    shortcutOrAlias = options.properties[currentValue] as string
  }

  if (!shortcutOrAlias) {
    return
  }

  let resolved: string = shortcutOrAlias
    .split(' ')
    .map((current) =>
      resolveShortcut(
        // If alias has no value insert current value here.
        values && hasAlias ? (current.includes('-') ? `${splitByFirstDash(current)[0]}-${values}` : `${current}-${values}`) : current,
        false,
      ),
    )
    .join(' ')

  // TODO distribute values if multiple values are supplied mx-[5]-[10] => left: 5, right: 10
  // Add initial values to shortcut values without any value.
  if (first && values) {
    resolved = resolved
      .split(' ')
      .map((shortcutValue: string) => (shortcutValue.includes('-') ? shortcutValue : `${shortcutValue}-${values}`))
      .join(' ')
  }

  return resolved
}

const resolveShortcuts = (value: string) => {
  let breakpoint = true
  let currentValue = value

  if (currentValue.includes(':')) {
    ;[currentValue, breakpoint] = extractBreakpoint(currentValue)
  }

  if (!breakpoint) {
    return undefined
  }

  // Resolve chain of shortcut aliases.
  return resolveShortcut(currentValue)
}

const mergeValues = (mainValues: Partial<Values>, fallbackValues: Values, fullyEmpty = false): Values => {
  // biome-ignore lint/style/useExplicitLengthCheck: This is not a regular JS property.
  const hasSizeValues = mainValues.size && mainValues.size.length > 0
  const hasColorValues = mainValues.color && mainValues.color.length > 0
  const hasArbitraryValues = mainValues.arbitrary && mainValues.arbitrary.length > 0

  const newValues = { ...fallbackValues }

  if (fullyEmpty && (hasSizeValues || hasColorValues || hasArbitraryValues)) {
    return {
      ...newValues,
      size: mainValues.size,
      color: mainValues.color,
      arbitrary: mainValues.arbitrary,
    } as Values
  }

  // Alias values have precedence when available.
  // biome-ignore lint/style/useExplicitLengthCheck: This is not a regular JS property.
  if (hasSizeValues && mainValues.size) {
    newValues.size = mainValues.size
  }

  if (hasColorValues && mainValues.color) {
    newValues.color = mainValues.color
  }

  if (hasArbitraryValues && mainValues.arbitrary) {
    newValues.arbitrary = mainValues.arbitrary
  }

  return newValues
}

export const lookupTable = (value: string) => {
  let link = options.properties[value]
  let values: Values = {
    property: undefined,
    size: [],
    color: [],
    arbitrary: [],
    complex: undefined,
  }
  let aliasValues: Partial<Values> = {}

  if (!link) {
    if (process.env.NODE_ENV !== 'production') {
      // biome-ignore lint/suspicious/noConsole: Only shown in development.
      console.warn(`Property "${value}" not found.`)
    }
    // TODO return nothing and handle that case outside?
    return values
  }

  // Resolve alias.
  if (typeof link === 'string') {
    aliasValues = extractValues(link)
    link = options.properties[aliasValues.property ?? '']
    values.property = aliasValues.property
  } else {
    values.property = link[0]
  }

  // Parse default property values.
  if (Array.isArray(link) && link.length > 1 && typeof link[1] !== 'function' && (link[1] || link[1] === 0)) {
    values = extractValues(`${link[0]}-${link[1]}`)
  }

  if (Array.isArray(link) && link.length > 1 && typeof link[1] === 'function') {
    values.complex = link[1]
  }

  return mergeValues(aliasValues, values)
}

export const parseValue = (value: string) => {
  let currentValue = value
  let breakpoint = true
  let values: ReturnType<typeof extractValues> = {
    property: undefined,
    size: [],
    color: [],
    arbitrary: [],
    complex: undefined,
  }

  if (currentValue.includes(':')) {
    ;[currentValue, breakpoint] = extractBreakpoint(value)
  }

  if (currentValue.includes('-')) {
    values = extractValues(currentValue)
  }

  const lookupResult = lookupTable(values.property ?? currentValue)

  // User values have precedence over lookup values.
  values = mergeValues(values, lookupResult, true)

  // Property name from lookup result is used and will override one in values.
  const property =
    options.type === Type.Css && hasUpperCase(lookupResult.property ?? '')
      ? camelToDashCase(lookupResult.property ?? '')
      : lookupResult.property

  return { ...values, breakpoint, property }
}

const calculateValue = (property: string, size: MultiSize[], color: string[], arbitrary: string[], complex?: ComplexValue) => {
  // Complex values.
  if (typeof complex === 'function') {
    // TODO multiple values passed to complex methods.
    return complex({
      size: size[0] ?? options.sizes[options.defaultSize],
      color: color[0],
      arbitrary: arbitrary[0],
    })
  }

  // biome-ignore lint/style/useExplicitLengthCheck: This is not a regular JS property.
  if (size.length > 0 && options.size && size[0] && Array.isArray(size[0])) {
    return options.size(size[0][0], property)
  }

  if (color.length > 0) {
    return color[0]
  }

  if (arbitrary.length > 0) {
    return arbitrary[0]
  }

  return 'inherit'
}

export const ei = (input: string) => {
  let parts = input.split(' ')
  const styles: CssStyles = {}

  // Keep regular classes intact.
  if (parts.every((part) => part.startsWith(options.classPrefix))) {
    return parts.join(' ')
  }

  parts = parts.map(resolveShortcuts).join(' ').split(' ')

  const partsBefore = parts.length
  parts = parts.filter((value) => !!value)

  let missed = partsBefore - parts.length

  for (const part of parts) {
    const { property, size, color, arbitrary, complex, breakpoint } = parseValue(part)

    if (property && breakpoint) {
      const value = calculateValue(property, size, color, arbitrary, complex)
      if (value !== undefined) {
        styles[property] = value
      }
    }

    if (!property && breakpoint) {
      validateHtmlClass(part) // Warn if invalid class characters used in development.
      missed += 1
    }
  }

  // No matches found, let regular classes pass through.
  if (missed === parts.length) {
    return input
  }

  if (options.object) {
    return options.object(styles)
  }
}
