import { type Configuration, Type } from './types'

const svelte: Configuration = {
  size: (value: number) => `${value}px`,
  type: Type.Css,
  object: (values: object) =>
    Object.entries(values)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' '),
}

const solid: Configuration = {
  size: (value: number) => `${value}px`,
  type: Type.Css,
}

const vue: Configuration = {
  size: (value: number) => `${value}px`,
}

export const Preset = { svelte, solid, vue }
