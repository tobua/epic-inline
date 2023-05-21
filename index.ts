import { Options, Type, Configuration } from './types'
import { camelToDashCase, hasUpperCase, splitByFirstDash } from './helper'

export { Type }

const table = {
  jc: ['justifyContent', 'center'],
  center: 'jc',
  flex: ['display', 'flex'],
  df: 'flex',
  flexDirection: ['flexDirection', 'row'],
  row: 'flexDirection-row',
  column: 'flexDirection-column',
  direction: 'flexDirection',
  flexWrap: ['flexWrap', 'wrap'], // nowrap is the default.
  wrap: 'flexWrap',
  w: ['width'],
  fullWidth: ['width', '100%'],
  h: ['height'],
  fullHeight: ['height', '100%'],
  p: ['padding'],
  pt: ['paddingTop', null],
  pv: ['paddingVertical'],
  ph: ['paddingHorizontal'],
  m: ['margin'],
  mt: ['marginTop', null],
  mv: ['marginVertical'],
  mh: ['marginHorizontal'],
  bg: ['background'],
  text: ['textAlign', null],
  font: ['fontFamily', 'sans-serif'],
}

const options: Options = {
  type: Type.js,
  breakpoints: {
    s: 500,
    m: 1000,
    l: 1500,
    small: 500,
    medium: 1000,
    large: 1500,
  },
  sizes: {
    s: 5,
    m: 10,
    l: 20,
    h: 40,
    small: 5,
    medium: 10,
    large: 20,
    huge: 40,
  },
}

export const configure = ({ type, breakpoints }: Configuration) => {
  options.type = type as Type
  options.breakpoints = breakpoints
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
  let link = table[value]
  let linkSize: null | string | number = null

  if (process.env.NODE_ENV !== 'production' && !link) {
    console.warn(`Property "${value}" not found.`)
  }

  // Resolve alias.
  if (typeof link === 'string') {
    if (link.includes('-')) {
      ;[link, linkSize] = extractSize(link)
    }
    link = table[link]
  }

  return { property: link, size: linkSize }
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
  const parts = input.split(' ')
  const styles: { [key: string]: string } = {}

  parts.forEach((part) => {
    const [result, size, breakpoint] = parseValue(part)

    if (result && breakpoint) {
      // eslint-disable-next-line prefer-destructuring
      styles[
        options.type === Type.css && hasUpperCase(result[0])
          ? camelToDashCase(result[0])
          : result[0]
      ] = size ?? result[1]
    }
  })

  return styles
}
