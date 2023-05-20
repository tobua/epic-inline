import { Options, Type, Configuration } from './types'

export { Type }

const table = {
  jc: ['justifyContent', 'center', 'justify-content'],
  flex: ['display', 'flex'],
  df: 'flex',
  w: ['width'],
  h: ['height'],
  p: ['padding'],
  pt: ['paddingTop', null, 'padding-top'],
  pv: ['paddingVertical'],
  ph: ['paddingHorizontal'],
  m: ['margin'],
  mt: ['marginTop', null, 'margin-top'],
  mv: ['marginVertical'],
  mh: ['marginHorizontal'],
  bg: ['background'],
  text: ['textAlign', null, 'text-align'],
  font: ['fontFamily', 'sans-serif', 'font-family'],
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
  const [rest, initialSize] = value.split('-')
  let size: string | number = initialSize

  // Size shortcuts, like c for center, f for flex, l for left.

  if (initialSize in options.sizes) {
    size = options.sizes[initialSize]
  } else {
    try {
      size = Number(initialSize)
    } catch (error) {
      // Ignore
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

  if (process.env.NODE_ENV !== 'production' && !link) {
    console.warn(`Property "${value}" not found.`)
  }

  // Resolve alias.
  if (typeof link === 'string') {
    link = table[link]
  }

  return link
}

const parseValue = (value: string) => {
  let currentValue = value
  let breakpoint = true
  let size = null

  if (currentValue.includes(':')) {
    ;[currentValue, breakpoint] = extractBreakpoint(value)
  }

  if (currentValue.includes('-')) {
    ;[currentValue, size] = extractSize(value)
  }

  return [lookupTable(currentValue), size, breakpoint]
}

export const ei = (input: string) => {
  const parts = input.split(' ')
  const styles: { [key: string]: string } = {}

  parts.forEach((part) => {
    const [result, size, breakpoint] = parseValue(part)

    if (result && breakpoint) {
      // eslint-disable-next-line prefer-destructuring
      styles[options.type === Type.css && result[2] ? result[2] : result[0]] = size ?? result[1]
    }
  })

  return styles
}
