import { getProperties, getShortcuts } from './properties'
import { Options, Type, Configuration, Sizes } from './types'
import { isReactNative, properties as nativeProperties } from './native'

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

const defaultSizes: Sizes = {
  small: [5, 1],
  medium: [10, 2],
  large: [20, 4],
  huge: [40, 8],
}

const getSizes = (): Sizes => ({
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
})

const getSize = (value: number) => value
const getObject = (values: Object) => values

export const options: Options = {
  properties: getProperties(),
  type: Type.js,
  size: getSize,
  object: getObject,
  breakpoints: getBreakpoints(),
  sizes: getSizes(),
  shortcuts: getShortcuts(),
  classPrefix: 'css-',
  defaultSize: 'medium',
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
  classPrefix,
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
  if (classPrefix) {
    options.classPrefix = classPrefix
  }
  if (defaultSize) {
    options.defaultSize = defaultSize
  }

  if (properties) {
    Object.assign(options.properties, properties)
  }
}

export const reset = () => {
  options.properties = getProperties()
  options.type = Type.js
  options.sizes = getSizes()
  options.breakpoints = getBreakpoints()
  options.size = getSize
  options.object = getObject
  options.shortcuts = getShortcuts()

  if (isReactNative) {
    Object.assign(options.properties, nativeProperties)
  }
}
