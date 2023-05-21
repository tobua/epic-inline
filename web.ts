import { Configuration, Type } from './types'

export const svelte: Configuration = {
  size: (value: number) => `${value}px`,
  type: Type.css,
  object: (values: Object) =>
    Object.entries(values)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' '),
}

export const solid: Configuration = {
  size: (value: number) => `${value}px`,
  type: Type.css,
}

export const vue: Configuration = {
  size: (value: number) => `${value}px`,
}
