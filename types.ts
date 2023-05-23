export enum Type {
  js = 'javascript',
  css = 'css',
  native = 'react-native',
}

export type Breakpoints = { [key: string]: number }

export type Sizes = { [key: string]: number }

export enum PropertyValue {
  numeric,
  string,
}

export type Property = string | [string, string?, PropertyValue?]

export interface Options {
  type: Type
  breakpoints: Breakpoints
  sizes: Sizes
  size?: (value: number, property: string) => any
  object?: (values: Object) => any
  properties: { [key: string]: Property }
  shortcuts: { [key: string]: string }
}

export interface Configuration {
  type?: Type | 'css' | 'javascript'
  breakpoints?: Breakpoints
  size?: (value: number, property: string) => any
  object?: (values: Object) => any
  properties?: { [key: string]: Property }
  shortcuts: { [key: string]: string }
}
