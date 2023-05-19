import { expect, test } from 'vitest'
import { configure, ei, Type } from '../index'

test('Case can be configured.', () => {
  configure({ type: Type.css })

  expect(ei('jc')).toEqual({ 'justify-content': 'center' })

  configure({ type: 'css' })

  expect(ei('jc')).toEqual({ 'justify-content': 'center' })

  configure({ type: 'javascript' })

  expect(ei('jc')).toEqual({ justifyContent: 'center' })

  configure({ type: Type.js })

  expect(ei('jc')).toEqual({ justifyContent: 'center' })
})
