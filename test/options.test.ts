import { expect, test, afterEach } from 'vitest'
import { configure, ei, reset } from '../index'

afterEach(reset)

test('Sizing method can be configured.', () => {
  expect(ei('h-50')).toEqual({ height: 50 })

  configure({ size: (value) => `${value / 10}rem` })

  expect(ei('h-50')).toEqual({ height: '5rem' })
})

test('Object method can be configured.', () => {
  expect(ei('w-10')).toEqual({ width: 10 })

  configure({ object: (value) => JSON.stringify(value) })

  expect(ei('w-10')).toEqual(JSON.stringify({ width: 10 }))
})
