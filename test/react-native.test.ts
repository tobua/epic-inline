import { expect, test } from 'vitest'
import { configure, ei, Type } from '../index'

test('Regular properties still work the same.', () => {
  configure({ type: Type.native })
  expect(ei('p-l')).toEqual({ padding: 20 })
})

test('React Native specific properties can be used.', () => {
  expect(ei('pv-l')).toEqual({ paddingVertical: 20 })
  expect(ei('ph-l')).toEqual({ paddingHorizontal: 20 })
})
