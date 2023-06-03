import { expect, test, vi } from 'vitest'
import { ei } from '../index'

let windowWidth = 1250

global.window = {
  // @ts-ignore
  matchMedia: (matcher: string) => {
    const regex = /max-width:\s*(\d+)px/
    const width = Number((regex.exec(matcher) ?? '0')[1])
    return { matches: width > windowWidth }
  },
}

const warnings = vi.spyOn(console, 'warn')

test('Various breakpoints lead to styles conditionally being shown.', () => {
  expect(ei('s:flex')).toEqual({})
  expect(ei('m:flex')).toEqual({})
  expect(ei('l:flex')).toEqual({ display: 'flex' })
  expect(ei('flex')).toEqual({ display: 'flex' })
  expect(ei('small:flex')).toEqual({})
  expect(ei('medium:flex')).toEqual({})
  expect(ei('large:flex')).toEqual({ display: 'flex' })
  expect(ei('flex')).toEqual({ display: 'flex' })

  windowWidth = 250

  expect(ei('s:flex')).toEqual({ display: 'flex' })
  expect(ei('m:flex')).toEqual({ display: 'flex' })
  expect(ei('l:flex')).toEqual({ display: 'flex' })
  expect(ei('flex')).toEqual({ display: 'flex' })
  expect(ei('small:flex')).toEqual({ display: 'flex' })
  expect(ei('medium:flex')).toEqual({ display: 'flex' })
  expect(ei('large:flex')).toEqual({ display: 'flex' })
  expect(ei('flex')).toEqual({ display: 'flex' })

  windowWidth = 750

  expect(ei('s:flex')).toEqual({})
  expect(ei('m:flex')).toEqual({ display: 'flex' })
  expect(ei('l:flex')).toEqual({ display: 'flex' })
  expect(ei('flex')).toEqual({ display: 'flex' })
  expect(ei('small:flex')).toEqual({})
  expect(ei('medium:flex')).toEqual({ display: 'flex' })
  expect(ei('large:flex')).toEqual({ display: 'flex' })
  expect(ei('flex')).toEqual({ display: 'flex' })
})

test('The use of invalid breakpoints will show a warning.', () => {
  expect(warnings.mock.calls.length).toBe(0)
  expect(ei('missing:flex')).toEqual({ display: 'flex' })
  expect(ei('also-missing:flex')).toEqual({ display: 'flex' })
  expect(warnings.mock.calls.length).toBe(2)
  expect(warnings.mock.calls[1][0]).toContain('"also-missing"')
})
