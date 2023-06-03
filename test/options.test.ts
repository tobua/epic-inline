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

test('Prefixed classes are preserved and prefix can be changed.', () => {
  expect(ei('css-hello')).toEqual('css-hello')
  expect(ei('css-hello css-world')).toEqual('css-hello css-world')

  configure({ classPrefix: 'another-' })

  expect(ei('css-hello')).toEqual('css-hello')
  expect(ei('css-hello flex')).toEqual({ display: 'flex' })
  expect(ei('another-hello-again')).toEqual('another-hello-again')
  expect(ei('another-hello another-world')).toEqual('another-hello another-world')
})
