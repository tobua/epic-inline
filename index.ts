import { Type } from './types'
import { camelToDashCase, hasUpperCase, splitByFirstDash } from './helper'
import { svelte, solid, vue } from './web'
import { options } from './options'

export { Type, svelte, solid, vue }
export { reset, configure } from './options'

const resolveShortcuts = (value: string) => {
  if (Object.hasOwn(options.shortcuts, value)) {
    return options.shortcuts[value]
  }

  return value
}

const extractSize = (value: string) => {
  const [rest, initialSize] = splitByFirstDash(value)
  let size: string | number = initialSize

  // Size shortcuts, like c for center, f for flex, l for left.

  if (initialSize in options.sizes) {
    size = options.sizes[initialSize]
  } else {
    try {
      size = Number(initialSize)
    } catch (error) {
      // Ignore
      size = initialSize
    }

    if (Number.isNaN(size)) {
      size = initialSize
    }
  }

  return [rest, size] as [string, string | number]
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

  parts = parts.map(resolveShortcuts).join(' ').split(' ')

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
  })

  return options.object(styles)
}
