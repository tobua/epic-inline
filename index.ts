import { ComplexValues, MultiSize, PropertyValue, Type } from './types'
import { camelToDashCase, hasUpperCase, splitByFirstDash, validateHtmlClass } from './helper'
import { Preset } from './web'
import { options } from './options'
import { parseColor } from './color'

export { Type, Preset }
export { reset, configure } from './options'


const parseNumber = (value: string | number) => {
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

const extractComplexValues = (
  values: [number, number] | number | string
): { size?: number | MultiSize; color?: string } => {
  if (Array.isArray(values)) {
    return { size: values }
  }

  // eslint-disable-next-line no-param-reassign
  values = parseNumber(values)

  if (typeof values === 'number') {
    return { size: values }
  }

  if (!values) {
    return {}
  }

  const parts = values.split('-')
  const results = { color: undefined, size: undefined }

  parts.forEach((part) => {
    if (part in options.sizes) {
      results.size = options.sizes[part]
      return
    }

    const color = parseColor(part)
    if (color) {
      results.color = color
    }
  })

  return results
}

const addComplexDefaultValues = (values: ComplexValues) => {
  values.size ??= options.sizes[options.defaultSize]
  return values
}

const parseSize = (
  value: [number, number] | number | string
): [number, number] | number | string => {
  if (Array.isArray(value)) {
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

const extractSize = (value: string) => {
  const [rest, initialSize] = splitByFirstDash(value)
  const parsedSize = parseSize(initialSize)
  // Size shortcuts, like c for center, f for flex, l for left.
  return [rest, parsedSize] as const
}

const extractBreakpoint = (value: string) => {
  const [breakpoint, rest] = value.split(':')
  let match = true
  const breakpointExists = breakpoint in options.breakpoints

  if (process.env.NODE_ENV !== 'production' && !breakpointExists) {
    console.warn(`Invalid breakpoint "${breakpoint}" used.`)
  }

  if (breakpointExists) {
    // TODO create matchers for all breakpoints initially and use listeners.
    match = window.matchMedia(`(max-width: ${options.breakpoints[breakpoint]}px)`).matches
  }

  return [rest, match] as [string, boolean]
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

  if (Object.hasOwn(options.shortcuts, currentValue)) {
    return options.shortcuts[currentValue]
  }

  return currentValue
}

const lookupTable = (value: string) => {
  let link = options.properties[value]
  let linkSize: undefined | [number, number] | number | string

  if (process.env.NODE_ENV !== 'production' && !link) {
    console.warn(`Property "${value}" not found.`)
  }

  // Resolve alias.
  if (typeof link === 'string') {
    if (link.includes('-')) {
      ;[link, linkSize] = extractSize(link)
    }
    link = options.properties[link]
  }

  // Parse Sizes values from user or properties default.
  if (Array.isArray(link) && link.length > 1 && typeof link[1] !== 'function') {
    link[1] = parseSize(link[1])
  }

  return {
    property: link,
    size: linkSize,
    value: link && link.length > 2 && link[2], // TODO why link[2] here???
  }
}

const parseValue = (value: string) => {
  let currentValue = value
  let breakpoint = true
  let size: number | [number, number] | string | undefined
  let complexValues: ComplexValues | undefined

  if (currentValue.includes(':')) {
    ;[currentValue, breakpoint] = extractBreakpoint(value)
  }

  if (currentValue.includes('-')) {
    ;[currentValue, size] = extractSize(currentValue)
  }

  const lookupResult = lookupTable(currentValue)

  if (Array.isArray(lookupResult.property) && typeof lookupResult.property[1] === 'function') {
    complexValues = extractComplexValues(size)
  }

  return [lookupResult.property, lookupResult.size ?? size, breakpoint, complexValues] as const
}

const calculateValue = (
  size: [number, number] | number | string | undefined,
  value: PropertyValue,
  property: string,
  complexValues: ComplexValues | undefined
) => {
  // Complex values.
  if (typeof value === 'function') {
    return value(addComplexDefaultValues(complexValues))
  }

  // Arbitrary values like center or space-between.
  if (typeof size === 'string') {
    return size
  }

  const regularSize = Array.isArray(size) ? size[0] : size

  if (typeof value === 'string') {
    if (value in options.sizes) {
      return options.size(regularSize ?? options.sizes[value][0], property)
    }
    return size ?? value
  }

  const regularValue = Array.isArray(value) ? value[0] : value

  return options.size(regularSize ?? regularValue, property)
}

export const ei = (input: string) => {
  let parts = input.split(' ')
  const styles: { [key: string]: string } = {}

  parts.forEach(validateHtmlClass) // Warn if invalid class characters used in development.

  // Keep regular classes intact.
  if (parts.every((part) => part.startsWith(options.classPrefix))) {
    return parts.join(' ')
  }

  parts = parts.map(resolveShortcuts).join(' ').split(' ')

  const partsBefore = parts.length
  parts = parts.filter((value) => !!value)

  let missed = partsBefore - parts.length

  parts.forEach((part) => {
    const [result, size, breakpoint, complexValues] = parseValue(part)

    if (result && breakpoint) {
      const property =
        options.type === Type.css && hasUpperCase(result[0])
          ? camelToDashCase(result[0])
          : result[0]

      styles[property] = calculateValue(size, result[1], property, complexValues)
    }

    if (!result && breakpoint) {
      missed += 1
    }
  })

  // No matches found, let regular classes pass through.
  if (missed === parts.length) {
    return input
  }

  return options.object(styles)
}
