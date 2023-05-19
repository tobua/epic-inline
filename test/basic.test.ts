import { expect, test, vi } from 'vitest'
import { configure, ei, Type } from '../index'

const warnings = vi.spyOn(console, 'warn')

test('Basic values are converted.', () => {
  expect(ei('jc')).toEqual({ justifyContent: 'center' })
})

test('Duplicates are ignored.', () => {
  expect(ei('jc jc')).toEqual({ justifyContent: 'center' })
})

test('Invalid values show warning.', () => {
  expect(warnings.mock.calls.length).toBe(0)
  expect(ei('jc js')).toEqual({ justifyContent: 'center' })
  expect(warnings.mock.calls.length).toBe(1)
  expect(warnings.mock.calls[0][0]).toContain('"js"')
})

test('Aliases can be used.', () => {
  expect(ei('df')).toEqual({ display: 'flex' })
  expect(ei('flex')).toEqual({ display: 'flex' })
})

test('Numeric values can be provided.', () => {
  expect(ei('w-10')).toEqual({ width: 10 })
  expect(ei('p-12')).toEqual({ padding: 12 })
})
