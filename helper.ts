import type { Options } from './types'

// Works with Webkit prefixes as it starts upper-case.
export const camelToDashCase = (input: string) => input.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)

export const hasUpperCase = (input: string) => /[A-Z]/.test(input)

// hello-world-again => ['hello', 'world-again']
export const splitByFirstDash = (input: string) => {
  const index = input.indexOf('-')
  if (index !== -1) {
    const firstPart = input.slice(0, index)
    const secondPart = input.slice(index + 1)
    return [firstPart, secondPart]
  }
  return [input, '']
}

export const splitByDashesKeepingArbitrary = (input: string) => {
  const placeholder = '__PLACEHOLDER__'
  const valuesWithPlaceholders = input.replace(/\[.*?\]/g, (match) => match.replace(/-/g, placeholder))
  const values = valuesWithPlaceholders.split('-')
  return values.map((value) => value.replace(new RegExp(placeholder, 'g'), '-'))
}

export const validateHtmlClass = (className: string) => {
  if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
    return
  }

  if (/^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/g.test(className)) {
    return
  }

  console.warn(`Class "${className}" isn't a valid HTML class!`)
}

export const matchBreakpoint = (matchUpwards: boolean, options: Options, breakpoint: string) => {
  if (matchUpwards) {
    return window.matchMedia(`(max-width: ${options.breakpoints[breakpoint]}px)`).matches
  }

  const breakpointKeys = Object.keys(options.breakpoints)
  const breakpointIndex = breakpointKeys.indexOf(breakpoint)
  const previousBreakpoint = breakpointKeys[breakpointIndex - 1] ?? 0

  if (
    breakpointIndex === 0 ||
    // Edge case, i.e. "lg" is before "small", expects ordered breakpoints in size.
    (previousBreakpoint && (options.breakpoints[previousBreakpoint] ?? 0) > (options.breakpoints[breakpoint] ?? 0))
  ) {
    // First breakpoint
    return window.matchMedia(`(max-width: ${options.breakpoints[breakpoint]}px)`).matches
  }
  // Intermediate breakpoint
  return window.matchMedia(
    `(min-width: ${options.breakpoints[previousBreakpoint]}px) and (max-width: ${options.breakpoints[breakpoint]}px)`,
  ).matches
}
