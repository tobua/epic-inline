import { Type } from './types'
import { camelToDashCase, hasUpperCase, splitByFirstDash } from './helper'
import { svelte, solid, vue } from './web'
import { options } from './options'
import { colors } from './color'

export { Type, svelte, solid, vue }
export { reset, configure } from './options'

const resolveShortcuts = (value: string) => {
  if (Object.hasOwn(options.shortcuts, value)) {
    return options.shortcuts[value]
  }

  return value
}

const parseSize = (value: string | number) => {
  if (value in options.sizes) {
    return options.sizes[value]
  }
  if (value in colors) {
    return value
  }

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

const extractSize = (value: string) => {
  const [rest, initialSize] = splitByFirstDash(value)
  // Size shortcuts, like c for center, f for flex, l for left.
  return [rest, parseSize(initialSize)] as [string, string | number]
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

const lookupTable = (value: string) => {
  let link = options.properties[value]
  let linkSize: null | string | number = null

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

  if (Array.isArray(link) && link.length > 1) {
    link[1] = parseSize(link[1])
  }

  return { property: link, size: linkSize, value: link && link.length > 2 && link[2] }
}

const parseValue = (value: string) => {
  let currentValue = value
  let breakpoint = true
  let size = null

  if (currentValue.includes(':')) {
    ;[currentValue, breakpoint] = extractBreakpoint(value)
  }

  if (currentValue.includes('-')) {
    ;[currentValue, size] = extractSize(currentValue)
  }

  const lookupResult = lookupTable(currentValue)

  return [lookupResult.property, lookupResult.size ?? size, breakpoint]
}

export const ei = (input: string) => {
  let parts = input.split(' ')
  const styles: { [key: string]: string } = {}

  // Keep regular classes intact.
  if (parts.every((part) => part.startsWith(options.classPrefix))) {
    return parts.join(' ')
  }

  parts = parts.map(resolveShortcuts).join(' ').split(' ')

  let missed = 0

  parts.forEach((part) => {
    const [result, size, breakpoint] = parseValue(part)

    if (result && breakpoint) {
      const property =
        options.type === Type.css && hasUpperCase(result[0])
          ? camelToDashCase(result[0])
          : result[0]
      // eslint-disable-next-line prefer-destructuring
      styles[property] = options.size(size ?? result[1], property)
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
