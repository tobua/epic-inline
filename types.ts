export enum Type {
  Js = 'javascript',
  Css = 'css',
  Native = 'react-native',
}

export type DoubleSize = [number, number]
export type MultiSize = [number, number] | number
export type PropertySize = string | number
export type ComplexValues = Partial<{ size: MultiSize | number; color: string; arbitrary: string }>
export type ComplexValue = (properties: ComplexValues) => string
export type PropertyValue = string | number | MultiSize | ComplexValue
export type Property = string | [string, PropertyValue?, Complex?]
export type Breakpoints = { [key: string]: number }
export type Colors = { [key: string]: string }
export type Sizes = { [key: string]: MultiSize }
export type Shortcuts = { [key: string]: string }
export type Properties = { [key: string]: Property }
export type Size = (value: number, property: string) => string | number
export type CssStyles = { [key: string]: string | number } // Partial<CSSStyleDeclaration> will not work as styles are exported for different frameworks, some taking regular css properties.
// NOTE this is relevant to infer the types returned by the main "ei" export.
export type GetObject = (values: object) => CssStyles | string

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
  colors: Colors
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
  colors?: Colors
}

export enum Complex {
  Single = 0,
  Multiple = 1,
}

export type Values = {
  property: string | undefined
  size: MultiSize[]
  color: string[]
  arbitrary: string[]
  complex: ComplexValue | undefined
}
