import { expect, test } from 'vitest'
import { configure, ei } from '../index'

test('Default sizes can be used to specify lengths.', () => {
  expect(ei('p-l')).toEqual({ padding: 20 })
  expect(ei('p-large')).toEqual({ padding: 20 })
})

test('Sizes can be configured.', () => {
  configure({
    sizes: {
      xl: 60,
      xtraLarge: 60,
      '4xl': 80,
      small: 5,
    },
  })

  expect(ei('p-xl')).toEqual({ padding: 60 })
  expect(ei('p-xtraLarge')).toEqual({ padding: 60 })
  expect(ei('p-4xl')).toEqual({ padding: 80 })

  // Default sizes are removed, unless listed.
  expect(ei('p-medium')).toEqual({ padding: 'medium' })
  expect(ei('p-small')).toEqual({ padding: 5 })
})
