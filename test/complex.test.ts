import { afterEach, beforeEach, expect, test } from 'bun:test'
import { ei, reset } from '../index'

beforeEach(reset)
afterEach(reset)

test('Complex values with sizes.', () => {
  expect(ei('boxShadowX')).toEqual({
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
  expect(ei('textShadowX')).toEqual({
    textShadow: '2px 2px 2px black',
  })
  expect(ei('textShadowX-large')).toEqual({
    textShadow: '4px 4px 4px black',
  })
  expect(ei('textShadowX-large-gray')).toEqual({
    textShadow: '4px 4px 4px gray',
  })
  expect(ei('textShadowX-gray-large')).toEqual({
    textShadow: '4px 4px 4px gray',
  })
})

test('Complex values with non-pixel sizes.', () => {
  expect(ei('scaleY-[1]')).toEqual({ transform: 'scaleY(1)' })
  expect(ei('scaleY-[0.5]')).toEqual({ transform: 'scaleY(0.5)' })
  expect(ei('scaleY-[2]')).toEqual({ transform: 'scaleY(2)' })
  expect(ei('scale-[2]')).toEqual({ transform: 'scale(2)' })
  expect(ei('flip')).toEqual({ transform: 'scale(-1,-1)' })
  expect(ei('flipHorizontal')).toEqual({ transform: 'scale(-1,1)' })
  expect(ei('flipVertical')).toEqual({ transform: 'scale(1,-1)' })
})

test('Various complex values work correctly.', () => {
  expect(ei('singleLineText')).toEqual({ display: 'initial', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })
  expect(ei('webKitEllipsis')).toEqual({
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
    display: '-webkit-box',
    overflow: 'hidden',
  })
})
