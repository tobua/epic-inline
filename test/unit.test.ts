import { camelToDashCase } from '../helper'
import { parseNumber } from '../index'

test('Webkit values are prefixed with a dash.', () => {
  expect(camelToDashCase('WebkitMaskImage')).toBe('-webkit-mask-image')
})

test('Numbers are parsed properly.', () => {
  expect(parseNumber('5')).toBe(5)
  expect(parseNumber(5)).toBe(5)
  expect(parseNumber(5.55)).toBe(5.55)
  expect(parseNumber('abc')).toBe('abc')
})
