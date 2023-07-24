import { expect, test } from 'vitest'
import { configure, ei, reset } from '../index'

afterEach(() => reset())

test('Case can be configured.', () => {
  expect(ei('button')).toEqual({ outline: 'none', border: 'none' })
  expect(ei('button link')).toEqual({ outline: 'none', border: 'none', textDecoration: 'none' })
  expect(ei('link button')).toEqual(ei('button link'))

  configure({ shortcuts: { image: 'width-50 height-50' } })

  expect(ei('image')).toEqual({ width: 50, height: 50 })
})

test('Shortcut aliases are resolved properly.', () => {
  expect(ei('marginX')).toEqual({ marginLeft: 'auto', marginRight: 'auto' })
  expect(ei('mx')).toEqual({ marginLeft: 'auto', marginRight: 'auto' })
})
