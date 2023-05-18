import { expect, test } from 'vitest'
import { configure, ei } from '../index'

test('Basic values are converted.', () => {
  expect(ei('jc')).toEqual({ justifyContent: 'center' })
})

test('Duplicates are ignored.', () => {
  expect(ei('jc js')).toEqual({ justifyContent: 'center' })
})

test('Aliases can be used.', () => {
  expect(ei('df')).toEqual({ display: 'flex' })
  expect(ei('flex')).toEqual({ display: 'flex' })
})

test('Case can be configured.', () => {
  configure('css')

  expect(ei('jc')).toEqual({ 'justify-content': 'center' })
})
