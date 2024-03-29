import { Type } from './types'
import {
  camelToDashCase,
  hasUpperCase,
  matchBreakpoint,
  splitByDashesKeepingArbitrary,
  splitByFirstDash,
  validateHtmlClass,
} from './helper'
import { Preset } from './web'
import { options } from './options'
import { isColor, isTone, parseColor } from './color'

export { Type, Preset }
export { reset, configure } from './options'

type Values = ReturnType<typeof extractValues>

export const parseNumber = (value: string | number) => {
  let result: number

  try {
    result = Number(value)
  } catch (error) {
    // Ignore
    return value
  }

  if (Number.isNaN(result)) {
    return value
  }

  return result
}

const parseSize = (
  value: [number, number] | number | string,
): [number, number] | number | string => {
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

export const extractValues = (value: string) => {
  const [property, valuesJoined] = splitByFirstDash(value)
  const values = splitByDashesKeepingArbitrary(valuesJoined)
  const sizes = []
  const colors = []
  const arbitraryValues = []
  let skipNext = false

  values.forEach((current, index) => {
    if (skipNext) {
      skipNext = false
      return null
    }

    const next = index + 1 < values.length ? values[index + 1] : undefined // Used for lookahead.

    const isArbitraryWithNext = !isBracketed(current) && isArbitrary(`${current}-${next}`)

    if (isArbitraryWithNext) {
      skipNext = true
      return arbitraryValues.push(`${current}-${next}`)
    }

    // Arbitrary value.
    if (isArbitrary(current)) {
      return arbitraryValues.push(current.replace('[', '').replace(']', '').replaceAll('_', ' '))
    }

    // Color.
    if (isColor(current)) {
      const nextIsTone = isTone(next)
      if (nextIsTone) {
        skipNext = true
      }
      return colors.push(parseColor(nextIsTone ? `${current}-${next}` : current))
    }

    if (!current) {
      return null
    }

    // Must be a size.
    const size = parseSize(current)

    if (size || size === 0) {
      return sizes.push(Array.isArray(size) ? size : [size, size])
    }

    // Assuming arbitrary value.
    if (current) {
      arbitraryValues.push(current)
    }

    return null
  })

  return { property, size: sizes, color: colors, arbitrary: arbitraryValues, complex: null }
}

const extractBreakpoint = (value: string) => {
  // eslint-disable-next-line prefer-const
  let [breakpoint, rest] = value.split(':')
  let match = true
  let matchUpwards = true

  if (breakpoint.endsWith('-only')) {
    breakpoint = breakpoint.replace('-only', '')
    matchUpwards = false
  }

  const breakpointExists = breakpoint in options.breakpoints

  if (process.env.NODE_ENV !== 'production' && !breakpointExists) {
    console.warn(`Invalid breakpoint "${breakpoint}" used.`)
  }

  if (breakpointExists) {
    // TODO create matchers for all breakpoints initially and use listeners.
    match = matchBreakpoint(matchUpwards, options, breakpoint)
  }

  return [rest, match] as [string, boolean]
}

// Recursive function to resolve chain of shortcuts.
export const resolveShortcut = (value: string, first = true) => {
  let values = ''

  if (typeof value !== 'string') {
    return ''
  }

  // eslint-disable-next-line no-param-reassign
  ;[value, values] = splitByFirstDash(value)

  const hasShortcut = Object.hasOwn(options.shortcuts, value)
  // If the property is a string, it's an alias, properties themselves have no values and will be resolved later.
  const hasAlias =
    Object.hasOwn(options.properties, value) && typeof options.properties[value] === 'string'

  if (!hasShortcut && !hasAlias) {
    return values !== '' ? `${value}-${values}` : value
  }

  let shortcutOrAlias = options.shortcuts[value]

  if (!shortcutOrAlias && hasAlias) {
    shortcutOrAlias = options.properties[value] as string
  }

  let resolved: string = shortcutOrAlias
    .split(' ')
    .map((current) =>
      resolveShortcut(
        // If alias has no value insert current value here.
        // eslint-disable-next-line no-nested-ternary
        values && hasAlias
          ? current.includes('-')
            ? `${splitByFirstDash(current)[0]}-${values}`
            : `${current}-${values}`
          : current,
        false,
      ),
    )
    .join(' ')

  // TODO distribute values if multiple values are supplied mx-[5]-[10] => left: 5, right: 10
  // Add initial values to shortcut values without any value.
  if (first && values) {
    resolved = resolved
      .split(' ')
      .map((shortcutValue: string) =>
        shortcutValue.includes('-') ? shortcutValue : `${shortcutValue}-${values}`,
      )
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

const mergeValues = (
  mainValues: Partial<Values>,
  fallbackValues: Values,
  fullyEmpty = false,
): Values => {
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
  if (hasSizeValues) {
    newValues.size = mainValues.size
  }

  if (hasColorValues) {
    newValues.color = mainValues.color
  }

  if (hasArbitraryValues) {
    newValues.arbitrary = mainValues.arbitrary
  }

  return newValues
}

export const lookupTable = (value: string) => {
  let link = options.properties[value]
  let values: Values = {
    property: null,
    size: [],
    color: [],
    arbitrary: [],
    complex: null,
  }
  let aliasValues: Partial<Values> = {}

  if (!link) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Property "${value}" not found.`)
    }
    // TODO return nothing and handle that case outside?
    return values
  }

  // Resolve alias.
  if (typeof link === 'string') {
    aliasValues = extractValues(link)
    link = options.properties[aliasValues.property]
    values.property = aliasValues.property
  } else {
    // eslint-disable-next-line prefer-destructuring
    values.property = link[0]
  }

  // Parse default property values.
  if (
    Array.isArray(link) &&
    link.length > 1 &&
    typeof link[1] !== 'function' &&
    (link[1] || link[1] === 0)
  ) {
    values = extractValues(`${link[0]}-${link[1]}`)
  }

  if (Array.isArray(link) && link.length > 1 && typeof link[1] === 'function') {
    // eslint-disable-next-line prefer-destructuring
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
    complex: null,
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
    options.type === Type.css && hasUpperCase(lookupResult.property)
      ? camelToDashCase(lookupResult.property)
      : lookupResult.property

  return { ...values, breakpoint, property }
}

const calculateValue = (
  property: string,
  size: [number, number][],
  color: string[],
  arbitrary: string[],
  complex: Function,
) => {
  // Complex values.
  if (typeof complex === 'function') {
    // TODO multiple values passed to complex methods.
    return complex({
      size: size[0] ?? options.sizes[options.defaultSize],
      color: color[0],
      arbitrary: arbitrary[0],
    })
  }

  if (size.length > 0) {
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
  const styles: { [key: string]: string } = {}

  // Keep regular classes intact.
  if (parts.every((part) => part.startsWith(options.classPrefix))) {
    return parts.join(' ')
  }

  parts = parts.map(resolveShortcuts).join(' ').split(' ')

  const partsBefore = parts.length
  parts = parts.filter((value) => !!value)

  let missed = partsBefore - parts.length

  parts.forEach((part) => {
    const { property, size, color, arbitrary, complex, breakpoint } = parseValue(part)

    if (property && breakpoint) {
      styles[property] = calculateValue(property, size, color, arbitrary, complex)
    }

    if (!property && breakpoint) {
      validateHtmlClass(part) // Warn if invalid class characters used in development.
      missed += 1
    }
  })

  // No matches found, let regular classes pass through.
  if (missed === parts.length) {
    return input
  }

  return options.object(styles)
}
