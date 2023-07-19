export enum Type {
  js = 'javascript',
  css = 'css',
  native = 'react-native',
}

export type MultiSize = [number, number]
export type PropertySize = string | number
export type ComplexValues = Partial<{ size: MultiSize | number; color: string }>
export type ComplexValue = (properties: ComplexValues) => string
export type PropertyValue = string | number | MultiSize | ComplexValue
export type Property = string | [string, PropertyValue?]
export type Breakpoints = { [key: string]: number }
export type Sizes = { [key: string]: MultiSize }
export type Shortcuts = { [key: string]: string }
export type Properties = { [key: string]: Property }
export type Size = (value: number, property: string) => any
export type GetObject = (values: Object) => any

export interface Options {
  type: Type
  breakpoints: Breakpoints
  sizes: Sizes
  size?: Size
  defaultSize: keyof Sizes
  object?: GetObject
  properties: Properties
  shortcuts: Shortcuts
  classPrefix: string
}

export interface Configuration {
  type?: Type | 'css' | 'javascript'
  breakpoints?: Breakpoints
  size?: Size
  defaultSize?: keyof Sizes
  object?: GetObject
  properties?: Properties
  shortcuts?: Shortcuts
  sizes?: Sizes
  classPrefix?: string
}
