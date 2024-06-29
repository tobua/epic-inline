import { expect, test, beforeEach, afterEach } from 'bun:test'
import { configure, reset, ei, Type, Preset } from '../index'

beforeEach(reset)
afterEach(reset)

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

test('Presets are available to configure popular frameworks.', () => {
  configure(Preset.vue)
  // <div :style="{ paddingLeft: '10px' }">content</div>
  expect(ei('paddingLeft-10')).toEqual({ paddingLeft: `10px` })
  expect(ei('p-medium jc')).toEqual({ padding: `10px`, justifyContent: 'center' })
  reset()
  configure(Preset.svelte)
  // <div style="padding-left: 10px;">content</div>
  expect(ei('paddingLeft-10')).toEqual('padding-left: 10px;')
  expect(ei('p-medium jc')).toEqual('padding: 10px; justify-content: center;')
  reset()
  configure(Preset.solid)
  // <div style={{ 'padding-left': '10px' }}>content</div> NOTE solid also supports strings
  expect(ei('paddingLeft-10')).toEqual({ 'padding-left': `10px` })
  expect(ei('p-medium jc')).toEqual({ padding: `10px`, 'justify-content': 'center' })
})
