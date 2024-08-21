import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export const rsbuild = defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './index.tsx',
    },
  },
  html: {
    title: 'epic-inline Documentation',
    favicon: '../logo.png',
  },
  output: {
    assetPrefix: '/epic-inline/',
  },
})

export const gitignore = 'bundle'
export const vscode = 'biome'
export const biome = {
  extends: 'recommended',
  linter: {
    rules: {
      suspicious: {
        noArrayIndexKey: 'off',
      },
    },
  },
  files: {
    ignore: ['rsbuild.config.ts'],
  },
}

export const typescript = {
  extends: 'web',
  files: ['index.tsx'],
}
