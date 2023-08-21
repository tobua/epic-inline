import { configDefaults } from 'vitest/config'

export default {
  test: {
    globals: true, // Required for @testing-library/react in register-react.test
    alias: {
      'epic-inline': '.',
    },
    exclude: [...configDefaults.exclude, 'app'],
  },
}
