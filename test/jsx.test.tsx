import './setup-dom'
import '../register-jsx'
import { afterEach, beforeEach, expect, test } from 'bun:test'
import { render } from 'epic-jsx/test'
import { reset } from '../index'

beforeEach(reset)
afterEach(reset)

test('class / className is converted to an inline style.', () => {
  // NOTE className will be rewritten by biome.
  const { tree, serialized } = render(
    <>
      <div id="main" class="flex center">
        centered
      </div>
      <div id="combined" class="flex" style={{ position: 'relative' }}>
        flex and relative
      </div>
      <div id="name" className="absolute">
        absolute
      </div>
    </>,
  )

  expect(serialized).toBeDefined()
  expect(tree).toBeDefined()
  expect(tree.children[0]?.tag).toBe('div')
  expect(tree.children[0]?.props?.style).toEqual({ alignItems: 'center', display: 'flex', justifyContent: 'center' })
  expect(tree.children[1]?.tag).toBe('div')
  expect(tree.children[1]?.props?.class).not.toBeDefined()
  expect(tree.children[1]?.props?.className).not.toBeDefined()
  expect(tree.children[1]?.props?.style).toEqual({ display: 'flex', position: 'relative' })
  expect(tree.children[2]?.tag).toBe('div')
  expect(tree.children[2]?.props?.class).not.toBeDefined()
  expect(tree.children[2]?.props?.className).not.toBeDefined()
  expect(tree.children[2]?.props?.style).toEqual({ position: 'absolute' })
})
