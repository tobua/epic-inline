import { Configuration, Type } from './types'

const svelte: Configuration = {
  size: (value: number) => `${value}px`,
  type: Type.css,
  object: (values: Object) =>
    Object.entries(values)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' '),
}

const solid: Configuration = {
  size: (value: number) => `${value}px`,
  type: Type.css,
}

const vue: Configuration = {
  size: (value: number) => `${value}px`,
}

export const Preset = { svelte, solid, vue }
