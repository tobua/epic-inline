import { isReactNative, properties as nativeProperties } from './native'
import { getProperties, getShortcuts } from './properties'
import { type Configuration, type CssStyles, type Options, type Sizes, Type } from './types'

const getBreakpoints = () => ({
  s: 500,
  m: 1000,
  l: 1500,
  sm: 500,
  md: 1000,
  lg: 1500,
  // TODO rename default breakpoints to phone, tablet, desktop?
  small: 500,
  medium: 1000,
  large: 1500,
})

export const sizes = {
  small: 'small',
  medium: 'medium',
  large: 'large',
  huge: 'huge',
}

const defaultSizes: Sizes = {
  [sizes.small]: [5, 1],
  [sizes.medium]: [10, 2],
  [sizes.large]: [20, 4],
  [sizes.huge]: [40, 8],
}

// Names cannot collide with sizes, would require some parsing refactoring otherwise.
const defaultFontSizes: Sizes = {
  title: [40, 32],
  subtitle: [32, 24],
  lead: [26, 20],
  largeText: [20, 14],
  mediumText: [16, 10],
  smallText: [12, 8],
  tinyText: [10, 6],
}

const getSizes = () =>
  ({
    s: defaultSizes.small,
    m: defaultSizes.medium,
    l: defaultSizes.large,
    h: defaultSizes.huge,
    sm: defaultSizes.small,
    mg: defaultSizes.medium,
    lg: defaultSizes.large,
    hg: defaultSizes.huge,
    small: defaultSizes.small,
    medium: defaultSizes.medium,
    large: defaultSizes.large,
    huge: defaultSizes.huge,
  }) as Sizes

const getSize = (value: number) => value
const getObject = (values: object) => values as CssStyles

const defaultSize = 'medium'

export const options: Options = {
  properties: getProperties(),
  type: Type.Js,
  size: getSize,
  object: getObject,
  breakpoints: getBreakpoints(),
  sizes: getSizes(),
  fontSizes: defaultFontSizes,
  shortcuts: getShortcuts(),
  classPrefix: 'css-',
  defaultSize,
  colors: {},
}

if (isReactNative) {
  Object.assign(options.properties, nativeProperties)
}

export const configure = ({
  type,
  breakpoints,
  size,
  defaultSize,
  object,
  properties,
  shortcuts,
  sizes,
  fontSizes,
  classPrefix,
  colors,
}: Configuration) => {
  if (type) {
    options.type = type as Type
  }
  if (breakpoints) {
    options.breakpoints = breakpoints
  }
  if (size) {
    options.size = size
  }
  if (object) {
    options.object = object
  }
  if (shortcuts) {
    options.shortcuts = shortcuts
  }
  if (sizes) {
    options.sizes = sizes
  }
  if (fontSizes) {
    options.fontSizes = fontSizes
  }
  if (classPrefix) {
    options.classPrefix = classPrefix
  }
  if (defaultSize) {
    options.defaultSize = defaultSize
  }
  if (colors) {
    options.colors = colors
  }

  if (properties) {
    Object.assign(options.properties, properties)
  }
}

export const reset = () => {
  options.properties = getProperties()
  options.type = Type.Js
  options.sizes = getSizes()
  options.fontSizes = defaultFontSizes
  options.breakpoints = getBreakpoints()
  options.size = getSize
  options.object = getObject
  options.shortcuts = getShortcuts()
  options.defaultSize = defaultSize

  if (isReactNative) {
    Object.assign(options.properties, nativeProperties)
  }
}
