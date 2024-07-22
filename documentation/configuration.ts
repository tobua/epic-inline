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

export const gitignore = 'recommended'

export const typescript = {
  extends: 'web',
  files: ['index.tsx'],
}
