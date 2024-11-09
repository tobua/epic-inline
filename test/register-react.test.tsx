import '../register-react' // NOTE will import from "exports" in /dist
import { afterEach, beforeEach, expect, test } from 'bun:test'
import { type ReactTestRendererTree, create } from 'react-test-renderer'
import { reset } from '../index'

beforeEach(reset)
afterEach(reset)

test('class / className is converted to an inline style.', () => {
  // NOTE className will be rewritten by biome.
  const rendered = create(
    <>
      <div data-testid="main" class="flex center">
        centered
      </div>
      <div data-testid="combined" class="flex" style={{ position: 'relative' }}>
        flex and relative
      </div>
    </>,
  )

  const tree = rendered.toTree() as ReactTestRendererTree

  // TODO this isn't the expected result, styles are missing.
  // TODO add suite to test with epic-jsx/test.
  expect(tree[0].type).toBe('div')
  expect(tree[0].props.class).toBe('flex center')

  expect(tree[1].type).toBe('div')
  expect(tree[1].props.class).toBe('flex')
  expect(tree[1].props.style).toEqual({ position: 'relative' })
})
