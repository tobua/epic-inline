import { expect, test, spyOn, afterAll, beforeAll } from 'bun:test'
import { ei } from '../index'

const warnings = spyOn(console, 'warn')

beforeAll(() => {
  warnings.mockReset()
})

afterAll(() => {
  warnings.mockReset()
})

test('Basic values are converted.', () => {
  expect(ei('jc')).toEqual({ justifyContent: 'center' })
  expect(ei('centerHorizontal')).toEqual({ justifyContent: 'center' })
  expect(ei('justifyContent')).toEqual({ justifyContent: 'center' })
})

test('Duplicates are ignored.', () => {
  expect(ei('jc jc centerHorizontal justifyContent')).toEqual({ justifyContent: 'center' })
})

test('Combined properties use camelCase.', () => {
  expect(ei('fullWidth')).toEqual({ width: '100%' })
})

test('Various flex properties are supported.', () => {
  expect(ei('flexDirection')).toEqual({ flexDirection: 'row' })
  expect(ei('row')).toEqual({ flexDirection: 'row' })
  expect(ei('column')).toEqual({ flexDirection: 'column' })
  expect(ei('direction')).toEqual({ flexDirection: 'row' })
  expect(ei('direction-column-reverse')).toEqual({ flexDirection: 'column-reverse' })
  expect(ei('flexWrap')).toEqual({ flexWrap: 'wrap' })
  expect(ei('wrap')).toEqual({ flexWrap: 'wrap' })
  expect(ei('flexWrap-nowrap')).toEqual({ flexWrap: 'nowrap' })
  expect(ei('flexWrap-wrap')).toEqual({ flexWrap: 'wrap' })
  expect(ei('flexWrap-initial')).toEqual({ flexWrap: 'initial' })
  expect(ei('flexWrap-inherit')).toEqual({ flexWrap: 'inherit' })
  expect(ei('flexWrap-wrap-reverse')).toEqual({ flexWrap: 'wrap-reverse' })
  expect(ei('order-[5]')).toEqual({ order: '5' })
  expect(ei('flexGrow-[4]')).toEqual({ flexGrow: '4' })
  expect(ei('flexGrow')).toEqual({ flexGrow: '0' })
  expect(ei('grow-[4]')).toEqual({ flexGrow: '4' })
  expect(ei('flexShrink-[3]')).toEqual({ flexShrink: '3' })
  expect(ei('shrink-[3]')).toEqual({ flexShrink: '3' })
  expect(ei('flexBasis')).toEqual({ flexBasis: 'auto' })
  expect(ei('self')).toEqual({ alignSelf: 'auto' })
  expect(ei('alignContent-start')).toEqual({ alignContent: 'start' })

  expect(ei('flex centerHorizontal column wrap')).toEqual({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap',
  })
})

test('Various font properties are supported.', () => {
  expect(ei('font')).toEqual({ fontFamily: 'sans-serif' })
  expect(ei('fontWeight')).toEqual({ fontWeight: 'normal' })
  expect(ei('bold')).toEqual({ fontWeight: 'bold' })
  expect(ei('fontWeight-bolder')).toEqual({ fontWeight: 'bolder' })
  expect(ei('fontWeight-[500]')).toEqual({ fontWeight: '500' })
  expect(ei('aspectRatio')).toEqual({ aspectRatio: 'auto' })
  expect(ei('aspectRatio-[3]')).toEqual({ aspectRatio: '3' })
  expect(ei('square')).toEqual({ aspectRatio: '1' })
  expect(ei('ratio-[5]')).toEqual({ aspectRatio: '5' })
  expect(ei('position-relative')).toEqual({ position: 'relative' })
  expect(ei('sticky')).toEqual({ position: 'sticky' })
  expect(ei('top')).toEqual({ top: 0 })
  expect(ei('lt-6')).toEqual({ left: 6 })
})

test('Invalid values show warning.', () => {
  expect(warnings.mock.calls.length).toBe(0)
  expect(ei('jc js')).toEqual({ justifyContent: 'center' })
  expect(warnings.mock.calls.length).toBe(1)
  expect(warnings.mock.calls[0][0]).toContain('"js"')
  // Warning for invalid className characters.
  expect(ei('@invalid')).toEqual('@invalid')
  expect(warnings.mock.calls.length).toBe(3)
  expect(warnings.mock.calls[1][0]).toContain('Property "@invalid"')
  expect(warnings.mock.calls[2][0]).toContain('Class "@invalid"')
  expect(ei('display-v4l!d?')).toEqual({ display: 'v4l!d?' })
  expect(warnings.mock.calls.length).toBe(3)
})

test('Aliases can be used.', () => {
  expect(ei('df')).toEqual({ display: 'flex' })
  expect(ei('flex')).toEqual({ display: 'flex' })
})

test('Numeric values can be provided.', () => {
  expect(ei('w-10')).toEqual({ width: 10 })
  expect(ei('p-12')).toEqual({ padding: 12 })
})

test('Medium size is used as default for size based short properties.', () => {
  expect(ei('borderRadius-huge')).toEqual({ borderRadius: 40 })
  expect(ei('borderRadius')).toEqual({ borderRadius: 10 })
})

test('Named colors can be used as values.', () => {
  expect(ei('color-red')).toEqual({ color: 'red' })
  expect(ei('color-lemonchiffon')).toEqual({ color: 'lemonchiffon' })
  expect(ei('background-lavenderblush')).toEqual({ background: 'lavenderblush' })
})

test('Color tones can be added.', () => {
  expect(ei('color-blue-400')).toEqual({ color: '#0000FF' })
  expect(ei('color-blue-50')).toEqual({ color: '#5959FF' })
  expect(ei('color-lemonchiffon-400')).toEqual({ color: '#FFFACD' })
  expect(ei('color-lemonchiffon-200')).toEqual({ color: '#FFFFFF' })
  expect(ei('background-lavenderblush-900')).toEqual({ background: '#FF70A0' })
})

test('Regular classes are preserved.', () => {
  expect(ei('poiuytr')).toEqual('poiuytr')
  expect(ei('poiuytr flex')).toEqual({ display: 'flex' })
  expect(ei('flex poiuytr')).toEqual({ display: 'flex' })
  expect(ei('poiuytr-12345')).toEqual('poiuytr-12345')
  expect(ei('poiuytr-12345 css-in-js')).toEqual('poiuytr-12345 css-in-js')
})

test('Direction helper generates proper values.', () => {
  expect(ei('padding')).toEqual({ padding: 10 })
  expect(ei('paddingLeft')).toEqual({ paddingLeft: 10 })
  expect(ei('m')).toEqual({ margin: 10 })
  expect(ei('mr')).toEqual({ marginRight: 10 })
  expect(ei('borderTop')).toEqual({ borderTop: 'none' })
  expect(ei('bb-red')).toEqual({ borderBottom: 'red' }) // Should be a complex value.
})

test('Arbitrary values can be used.', () => {
  expect(ei('p-[inherit]')).toEqual({ padding: 'inherit' })
  expect(ei('p-[7/9]')).toEqual({ padding: '7/9' })
  expect(ei('aspect-[2/6]')).toEqual({ aspectRatio: '2/6' })
  expect(ei('gridRow-[1/3]')).toEqual({ gridRow: '1/3' })
  expect(ei('gridTemplateRows-[auto_auto_auto]')).toEqual({ gridTemplateRows: 'auto auto auto' })
  expect(ei('scaleY-[0.5]')).toEqual({ transform: 'scaleY(0.5)' })
  expect(ei('scale-[50%_50%]')).toEqual({ transform: 'scale(50% 50%)' })
  expect(ei('scaleY-[50/50]')).toEqual({ transform: 'scaleY(50/50)' })
})

test('Arbitrary values can also be used in complex values.', () => {
  expect(ei('textShadow-large-gray-[1/1]')).toEqual({
    textShadow: '4px 4px 4px gray',
  })
})
