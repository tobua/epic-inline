import swizzle from 'simple-swizzle'
import type { Options } from './types'

const upperCaseRegexAll = /[A-Z]/g
const upperCaseRegex = /[A-Z]/

// Works with Webkit prefixes as it starts upper-case.
export const camelToDashCase = (input: string) => input.replace(upperCaseRegexAll, (match) => `-${match.toLowerCase()}`)
export const webkitProperites = (property: string) => (property.startsWith('Webkit') ? property.replace('Webkit', '-webkit') : property)

export const hasUpperCase = (input: string) => upperCaseRegex.test(input)

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

export const splitByDashesKeepingArbitrary = (input?: string) => {
  if (!input) {
    return []
  }
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

  // biome-ignore lint/suspicious/noConsole: Only shown in development.
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

function hexDouble(value: number) {
  const str = Math.round(value).toString(16).toUpperCase()
  return str.length < 2 ? `0${str}` : str
}

// Taken from 'color-string' dependency which is missing a main or exports field and therefore erroring in metro.
export function toHex(...args: Array<number | number[]>): string {
  const rgba = swizzle(args)

  return `#${hexDouble(rgba[0] as number)}${hexDouble(rgba[1] as number)}${hexDouble(rgba[2] as number)}${(rgba[3] as number) < 1 ? hexDouble(Math.round((rgba[3] as number) * 255)) : ''}`
}

export const propertyValues = {
  inherit: 'inherit',
  auto: 'auto',
  none: 'none',
  normal: 'normal',
  initial: 'initial',
  unset: 'unset',
  // Flexbox & Grid
  flex: 'flex',
  inlineFlex: 'inline-flex',
  grid: 'grid',
  inlineGrid: 'inline-grid',
  row: 'row',
  rowReverse: 'row-reverse',
  column: 'column',
  columnReverse: 'column-reverse',
  nowrap: 'nowrap',
  wrap: 'wrap',
  wrapReverse: 'wrap-reverse',
  start: 'start',
  end: 'end',
  center: 'center',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
  spaceEvenly: 'space-evenly',
  stretch: 'stretch',
  // Positioning
  absolute: 'absolute',
  relative: 'relative',
  fixed: 'fixed',
  sticky: 'sticky',
  static: 'static',
  // Display
  block: 'block',
  inlineBlock: 'inline-block',
  inline: 'inline',
  table: 'table',
  tableRow: 'table-row',
  tableCell: 'table-cell',
  // Font & Text
  bold: 'bold',
  bolder: 'bolder',
  lighter: 'lighter',
  italic: 'italic',
  oblique: 'oblique',
  smallCaps: 'small-caps',
  sansSerif: 'sans-serif',
  serif: 'serif',
  monospace: 'monospace',
  cursive: 'cursive',
  fantasy: 'fantasy',
  systemUi: 'system-ui',
  // Box Model
  borderBox: 'border-box',
  contentBox: 'content-box',
  paddingBox: 'padding-box',
  // Backgrounds & Borders
  noRepeat: 'no-repeat',
  repeat: 'repeat',
  repeatX: 'repeat-x',
  repeatY: 'repeat-y',
  space: 'space',
  round: 'round',
  cover: 'cover',
  contain: 'contain',
  transparent: 'transparent',
  currentColor: 'currentColor',
  // Cursors
  pointer: 'pointer',
  default: 'default',
  grab: 'grab',
  grabbing: 'grabbing',
  notAllowed: 'not-allowed',
  crosshair: 'crosshair',
  text: 'text',
  // Visibility & Overflow
  visible: 'visible',
  hidden: 'hidden',
  clip: 'clip',
  scroll: 'scroll',
  // Miscellaneous
  ellipsis: 'ellipsis',
  webkitBox: 'webkit-box', // transformed later to -webkit-box.
}

export const arbitraryPropertyValues = new Set(Object.values(propertyValues))
