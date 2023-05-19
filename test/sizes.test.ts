import { expect, test, vi } from 'vitest'
import { configure, ei } from '../index'

const warnings = vi.spyOn(console, 'warn')

test('Default sizes can be used to specify lengths.', () => {
  expect(ei('p-l')).toEqual({ padding: 20 })
})
