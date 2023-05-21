import { expect, test, vi } from 'vitest'
import { ei } from '../index'

const warnings = vi.spyOn(console, 'warn')

test('Basic values are converted.', () => {
  expect(ei('jc')).toEqual({ justifyContent: 'center' })
})

test('Duplicates are ignored.', () => {
  expect(ei('jc jc')).toEqual({ justifyContent: 'center' })
})

test('Combined properties use camelCase.', () => {
  expect(ei('fullWidth')).toEqual({ width: '100%' })
})

test('Various flex properties are supported.', () => {
  expect(ei('flexDirection')).toEqual({ flexDirection: 'row' })
  expect(ei('row')).toEqual({ flexDirection: 'row' })
  expect(ei('column')).toEqual({ flexDirection: 'column' })
  expect(ei('direction')).toEqual({ flexDirection: 'row' })
  expect(ei('flexWrap')).toEqual({ flexWrap: 'wrap' })
  expect(ei('wrap')).toEqual({ flexWrap: 'wrap' })
  expect(ei('flexWrap-nowrap')).toEqual({ flexWrap: 'nowrap' })
  expect(ei('flexWrap-wrap')).toEqual({ flexWrap: 'wrap' })
  expect(ei('flexWrap-initial')).toEqual({ flexWrap: 'initial' })
  expect(ei('flexWrap-inherit')).toEqual({ flexWrap: 'inherit' })
  expect(ei('flexWrap-wrap-reverse')).toEqual({ flexWrap: 'wrap-reverse' })
})

test('Various font properties are supported.', () => {
  expect(ei('fontWeight')).toEqual({ fontWeight: 'normal' })
  expect(ei('bold')).toEqual({ fontWeight: 'bold' })
  expect(ei('fontWeight-bolder')).toEqual({ fontWeight: 'bolder' })
  expect(ei('fontWeight-500')).toEqual({ fontWeight: 500 })
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
