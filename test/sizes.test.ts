import { afterEach, beforeEach, expect, test } from 'bun:test'
import { configure, ei, reset } from '../index'

beforeEach(reset)
afterEach(reset)

test('Default sizes can be used to specify lengths.', () => {
  expect(ei('p-l')).toEqual({ padding: 20 })
  expect(ei('p-large')).toEqual({ padding: 20 })
  expect(ei('fontSize-medium')).toEqual({ fontSize: 10 })
  expect(ei('width-small')).toEqual({ width: 5 })
})

test('Custom font sizes can be used.', () => {
  expect(ei('fs-text')).toEqual({ fontSize: 16 })
  expect(ei('fontSize-title')).toEqual({ fontSize: 40 })
  expect(ei('fontSize-smallText')).toEqual({ fontSize: 12 })
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
