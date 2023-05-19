export enum Type {
  js = 'javascript',
  css = 'css',
}

export type Breakpoints = { [key: string]: number }

export type Sizes = { [key: string]: number }

export interface Options {
  type: Type
  breakpoints: Breakpoints
  sizes: Sizes
}

export interface Configuration {
  type?: Type | 'css' | 'javascript'
  breakpoints?: Breakpoints
}
