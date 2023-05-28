import { getProperties, getShortcuts } from './properties'
import { Options, Type, Configuration } from './types'
import { isReactNative, properties as nativeProperties } from './native'

const getBreakpoints = () => ({
  s: 500,
  m: 1000,
  l: 1500,
  sm: 500,
  md: 1000,
  lg: 1500,
  small: 500,
  medium: 1000,
  large: 1500,
})

const getSizes = () => ({
  s: 5,
  m: 10,
  l: 20,
  h: 40,
  sm: 5,
  mg: 10,
  lg: 20,
  hg: 40,
  small: 5,
  medium: 10,
  large: 20,
  huge: 40,
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
}

if (isReactNative) {
  Object.assign(options.properties, nativeProperties)
}

export const configure = ({
  type,
  breakpoints,
  size,
  object,
  properties,
  shortcuts,
  sizes,
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
