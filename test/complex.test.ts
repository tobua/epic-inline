import { expect, test } from 'vitest'
import { ei } from '../index'

test('Complex values with sizes.', () => {
  expect(ei('boxShadow')).toEqual({
    boxShadow: '0 5px 5px 3px #000000AA',
  })
  expect(ei('shadow')).toEqual({
    boxShadow: '0 5px 5px 3px #000000AA',
  })
  expect(ei('shadow-large')).toEqual({
    boxShadow: '0 10px 10px 5px #000000AA',
  })
  expect(ei('shadow-medium')).toEqual({
    boxShadow: '0 5px 5px 3px #000000AA',
  })
  expect(ei('shadow-sm')).toEqual({
    boxShadow: '0 3px 3px 1px #000000AA',
  })
})
