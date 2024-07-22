import '../register-react' // NOTE will import from "exports" in /dist
import { expect, test } from 'bun:test'
import { type ReactTestRendererTree, create } from 'react-test-renderer'

test('className is converted to an inline style.', () => {
  const rendered = create(
    <>
      <div data-testid="main" className="flex center">
        centered
      </div>
      <div data-testid="combined" className="flex" style={{ position: 'relative' }}>
        flex and relative
      </div>
    </>,
  )

  const tree = rendered.toTree() as ReactTestRendererTree

  // TODO this isn't the expected result, styles are missing.
  // TODO add suite to test with epic-jsx/test.
  expect(tree[0].type).toBe('div')
  expect(tree[0].props.className).toBe('flex center')

  expect(tree[1].type).toBe('div')
  expect(tree[1].props.className).toBe('flex')
  expect(tree[1].props.style).toEqual({ position: 'relative' })
})
