import { expect, test } from 'vitest'
import { configure, ei } from '../index'

test('Case can be configured.', () => {
  expect(ei('button')).toEqual({ outline: 'none', border: 'none' })
  expect(ei('button link')).toEqual({ outline: 'none', border: 'none', textDecoration: 'none' })
  expect(ei('link button')).toEqual(ei('button link'))

  configure({ shortcuts: { image: 'width-50 height-50' } })

  expect(ei('image')).toEqual({ width: 50, height: 50 })
})
