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

test('Complex values with size and color.', () => {
  expect(ei('textShadow')).toEqual({
    textShadow: '2px 2px 2px black',
  })
  expect(ei('textShadow-large')).toEqual({
    textShadow: '4px 4px 4px black',
  })
  expect(ei('textShadow-large-gray')).toEqual({
    textShadow: '4px 4px 4px gray',
  })
  expect(ei('textShadow-gray-large')).toEqual({
    textShadow: '4px 4px 4px gray',
  })
})

test('Complex values with non-pixel sizes.', () => {
  expect(ei('scaleY-1')).toEqual({ transform: 'scaleY(1)'})
  expect(ei('scaleY-0.5')).toEqual({ transform: 'scaleY(0.5)'})
  expect(ei('scaleY-2')).toEqual({ transform: 'scaleY(2)'})
})
