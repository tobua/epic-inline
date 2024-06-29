import { expect, test, spyOn, afterAll } from 'bun:test'
import { ei } from '../index'

let windowWidth = 1250

global.window = {
  // @ts-ignore
  matchMedia: (matcher: string) => {
    const regexMax = /max-width:\s*(\d+)px/
    const maxWidth = Number((regexMax.exec(matcher) ?? '0')[1])
    const regexMin = /min-width:\s*(\d+)px/
    const minRegexResult = regexMin.exec(matcher)
    if (minRegexResult) {
      const minWidth = Number(minRegexResult[1])
      return { matches: minWidth < windowWidth && maxWidth > windowWidth }
    }
    return { matches: maxWidth > windowWidth }
  },
}

const warnings = spyOn(console, 'warn')

afterAll(() => {
  warnings.mockReset()
})

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

test('Breakpoints also work with shortcuts.', () => {
  windowWidth = 1250

  expect(ei('s:link')).toEqual({})
  expect(ei('medium:button')).toEqual({})
  expect(ei('large:link')).toEqual({ textDecoration: 'none' })
})

test("It's possible to match only a specific breakpoint.", () => {
  windowWidth = 750 // Medium

  expect(ei('s-only:flex')).toEqual({})
  expect(ei('m-only:flex')).toEqual({ display: 'flex' })
  expect(ei('l-only:flex')).toEqual({})
  expect(ei('flex')).toEqual({ display: 'flex' })
  expect(ei('small-only:flex')).toEqual({})
  expect(ei('medium-only:flex')).toEqual({ display: 'flex' })
  expect(ei('large-only:flex')).toEqual({})
  expect(ei('flex')).toEqual({ display: 'flex' })

  windowWidth = 250 // Small

  expect(ei('s-only:flex')).toEqual({ display: 'flex' })
  expect(ei('m-only:flex')).toEqual({})
  expect(ei('l-only:flex')).toEqual({})
  expect(ei('flex')).toEqual({ display: 'flex' })
  expect(ei('small-only:flex')).toEqual({ display: 'flex' })
  expect(ei('medium-only:flex')).toEqual({})
  expect(ei('large-only:flex')).toEqual({})
  expect(ei('flex')).toEqual({ display: 'flex' })

  windowWidth = 1250 // Large

  expect(ei('s-only:flex')).toEqual({})
  expect(ei('m-only:flex')).toEqual({})
  expect(ei('l-only:flex')).toEqual({ display: 'flex' })
  expect(ei('flex')).toEqual({ display: 'flex' })
  expect(ei('small-only:flex')).toEqual({})
  expect(ei('medium-only:flex')).toEqual({})
  expect(ei('large-only:flex')).toEqual({ display: 'flex' })
  expect(ei('flex')).toEqual({ display: 'flex' })
})
