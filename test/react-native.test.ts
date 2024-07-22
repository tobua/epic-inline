import { afterEach, beforeEach, expect, test } from 'bun:test'
import { Type, configure, ei, reset } from '../index'

beforeEach(reset)
afterEach(reset)

test('Regular properties still work the same.', () => {
  configure({ type: Type.Native })
  expect(ei('p-l')).toEqual({ padding: 20 })
})

test('React Native specific properties can be used.', () => {
  expect(ei('pv-l')).toEqual({ paddingVertical: 20 })
  expect(ei('ph-l')).toEqual({ paddingHorizontal: 20 })
})
