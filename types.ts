export enum Type {
  js = 'javascript',
  css = 'css',
  native = 'react-native',
}

export enum PropertyValue {
  numeric,
  string,
}

export type Property = string | [string, (string | number)?, PropertyValue?]

export type Breakpoints = { [key: string]: number }
export type Sizes = { [key: string]: number | string }
export type Shortcuts = { [key: string]: string }
export type Properties = { [key: string]: Property }
export type Size = (value: number, property: string) => any
export type GetObject = (values: Object) => any

export interface Options {
  type: Type
  breakpoints: Breakpoints
  sizes: Sizes
  size?: Size
  object?: GetObject
  properties: Properties
  shortcuts: Shortcuts
  classPrefix: string
}

export interface Configuration {
  type?: Type | 'css' | 'javascript'
  breakpoints?: Breakpoints
  size?: Size
  object?: GetObject
  properties?: Properties
  shortcuts?: Shortcuts
  sizes?: Sizes
  classPrefix?: string
}
