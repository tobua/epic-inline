import { afterEach, expect, test } from 'bun:test'
import { configure, ei, reset } from '../index'

afterEach(() => reset())

test('Case can be configured.', () => {
  expect(ei('button')).toEqual({ outline: 'none', border: 'none' })
  expect(ei('button link')).toEqual({ outline: 'none', border: 'none', textDecoration: 'none' })
  expect(ei('center')).toEqual({ justifyContent: 'center', alignItems: 'center' })
  expect(ei('link button')).toEqual(ei('button link'))

  configure({ shortcuts: { image: 'width-50 height-50' } })

  expect(ei('image')).toEqual({ width: 50, height: 50 })
})

test('Shortcut aliases are resolved properly.', () => {
  expect(ei('marginX')).toEqual({ marginLeft: 10, marginRight: 10 })
  expect(ei('marginX-[5]')).toEqual({ marginLeft: '5', marginRight: '5' })
  expect(ei('mx')).toEqual({ marginLeft: 10, marginRight: 10 })
  expect(ei('mx-[5]')).toEqual({ marginLeft: '5', marginRight: '5' })
  expect(ei('py-large')).toEqual({ paddingTop: 20, paddingBottom: 20 })
  expect(ei('borderTopRadius-huge')).toEqual({ borderTopLeftRadius: 40, borderTopRightRadius: 40 })
  expect(ei('code')).toEqual({
    fontFamily: 'monospace',
    background: 'lightgray',
    padding: 3,
    borderRadius: 3,
  })
  expect(ei('link')).toEqual({ textDecoration: 'none' })
  expect(ei('link-[underline]')).toEqual({ textDecoration: 'underline' })
  expect(ei('code-small')).toEqual({
    fontFamily: 'monospace',
    background: 'lightgray',
    padding: 3,
    borderRadius: 3,
  })
})
