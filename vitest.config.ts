import { configDefaults } from 'vitest/config'

export default {
  test: {
    globals: true,
    alias: {
      'epic-inline': '.',
    },
    exclude: [...configDefaults.exclude, 'app'],
  },
}
