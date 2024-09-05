import { expect, test } from 'bun:test'
import { isColor, isTone, parseColor } from '../color'
import { camelToDashCase } from '../helper'
import { extractValues, lookupTable, parseNumber, parseValue, resolveShortcut } from '../index'
import type { Values } from '../types'

const windowWidth = 750

global.window = {
  // @ts-ignore
  matchMedia: (matcher: string) => {
    const regex = /max-width:\s*(\d+)px/
    const width = Number((regex.exec(matcher) ?? '0')[1])
    return { matches: width > windowWidth }
  },
}

test('Webkit values are prefixed with a dash.', () => {
  expect(camelToDashCase('WebkitMaskImage')).toBe('-webkit-mask-image')
})

test('Numbers are parsed properly.', () => {
  expect(parseNumber('5')).toBe(5)
  expect(parseNumber(5)).toBe(5)
  expect(parseNumber(5.55)).toBe(5.55)
  expect(parseNumber('abc')).toBe('abc')
})

test('Color parsing and validation.', () => {
  expect(isColor('red')).toBe(true)
  expect(isColor('blue')).toBe(true)
  expect(isColor('whateverthisis')).toBe(false)
  expect(isColor('mediumspringgreen')).toBe(true)

  expect(isTone('900')).toBe(true)
  expect(isTone('150')).toBe(false)
  expect(isTone('80')).toBe(true)
  expect(isTone('1000')).toBe(false)
  expect(isTone('1100')).toBe(false)
  expect(isTone('-700')).toBe(false)
  expect(isTone('')).toBe(false)

  expect(parseColor('red-800')).toBe('#990000')
  expect(parseColor('blue')).toBe('blue')
  expect(parseColor('blue-400')).toBe('#0000FF')
  expect(parseColor('missing-200')).toBe(false)
})

// TODO property specific values / shortcuts
// TODO shortcut values like inh for inherit / ini for initial
// aspect-square	aspect-ratio: 1 / 1;
// aspect-video	aspect-ratio: 16 / 9;

const joinValues = ({ property, size, color, arbitrary }: Values) => {
  const joinedValues: string[] = []

  if (property) {
    joinedValues.push(property)
  }

  if (size.length > 0) {
    joinedValues.push(size.map((item) => `${item[0]}-${item[1]}`).join('_'))
  }

  if (color.length > 0) {
    joinedValues.push(color.join('_'))
  }

  if (arbitrary.length > 0) {
    joinedValues.push(arbitrary.join('_'))
  }

  return joinedValues.join('.')
}

test('Values are extracted properly.', () => {
  expect(joinValues(extractValues('margin-small'))).toEqual('margin.5-1')
  expect(joinValues(extractValues('padding-huge'))).toEqual('padding.40-8')
  expect(joinValues(extractValues('paddingTop-medium-small'))).toEqual('paddingTop.10-2_5-1')
  expect(joinValues(extractValues('color-red'))).toEqual('color.red')
  expect(joinValues(extractValues('color-blue-green-red'))).toEqual('color.blue_green_red')
  expect(joinValues(extractValues('color-red-200'))).toEqual('color.#FF3333')
  expect(joinValues(extractValues('color-red-200-blue-400'))).toEqual('color.#FF3333_#0000FF')
  expect(joinValues(extractValues('gridRow-[1/2]'))).toEqual('gridRow.1/2')
  expect(joinValues(extractValues('gridTemplateColumns-[auto_1fr]-[1/2]'))).toEqual('gridTemplateColumns.auto 1fr_1/2')
  expect(joinValues(extractValues('margin-small-red-[inherit]'))).toEqual('margin.5-1.red.inherit')
  expect(joinValues(extractValues('margin-large-huge-yellow-green-[auto]-[1fr]'))).toEqual('margin.20-4_40-8.yellow_green.auto_1fr')
  expect(joinValues(extractValues('scale-medium-large-red-blue-[2/3]-[4/5]'))).toEqual('scale.10-2_20-4.red_blue.2/3_4/5')
  expect(joinValues(extractValues('justifyContent-center'))).toEqual('justifyContent.center')
  expect(joinValues(extractValues('order-[5]'))).toEqual('order.5')
})

const addDefaults = (values: Partial<Values> & { breakpoint?: boolean }) =>
  ({
    size: [],
    color: [],
    arbitrary: [],
    complex: undefined,
    ...values,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  }) as any

test('Values on table can be looked up properly.', () => {
  // Properties without values.
  expect(lookupTable('order')).toEqual(addDefaults({ property: 'order' }))
  // Properties with default values.
  expect(lookupTable('gap')).toEqual(addDefaults({ property: 'gap', size: [[10, 2]] }))
  // Aliases.
  expect(lookupTable('w')).toEqual(addDefaults({ property: 'width' }))
  // With arbitrary values.
  expect(lookupTable('flip')).toEqual(
    addDefaults({
      property: 'transform',
      arbitrary: ['scale(-1,-1)'],
    }),
  )
  expect(lookupTable('justifyContent')).toEqual(addDefaults({ property: 'justifyContent', arbitrary: ['center'] }))
  // Complex values.
  expect(lookupTable('textShadow').property).toBe('textShadow')
  expect(typeof lookupTable('textShadow').complex).toBe('function')
  expect(lookupTable('scale').property).toBe('transform')
  expect(typeof lookupTable('scale').complex).toBe('function')
})

test('Full values are parsed properly.', () => {
  expect(parseValue('padding')).toEqual(
    addDefaults({
      property: 'padding',
      size: [[10, 2]],
      breakpoint: true,
    }),
  )
  expect(parseValue('small:w')).toEqual(
    addDefaults({
      property: 'width',
      breakpoint: false,
    }),
  )
  expect(parseValue('medium:rowGap-medium-small-red-500-[1/2]-[inherit]')).toEqual(
    addDefaults({
      property: 'rowGap',
      size: [
        [10, 2],
        [5, 1],
      ],
      color: ['#E60000'],
      arbitrary: ['1/2', 'inherit'],
      breakpoint: true,
    }),
  )
})

test('Shortcuts are resolved properly.', () => {
  expect(resolveShortcut('link')).toEqual('textDecoration color-inherit')
  expect(resolveShortcut('link-[underline]')).toEqual('textDecoration-[underline] color-inherit') // NOTE the idea of link is to remove the default underline and additional color.
  expect(resolveShortcut('paddingX')).toEqual('paddingLeft paddingRight')
  expect(resolveShortcut('paddingX-large')).toEqual('paddingLeft-large paddingRight-large')
  expect(resolveShortcut('py')).toBe('paddingTop paddingBottom')
  expect(resolveShortcut('py-[4]')).toBe('paddingTop-[4] paddingBottom-[4]')
  expect(resolveShortcut('code')).toBe('fontFamily-monospace background-lightgray padding-3 borderRadius-3')
})
