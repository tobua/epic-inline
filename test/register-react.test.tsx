// @vitest-environment happy-dom

import React from 'react'
import '../register-react' // NOTE will import from "exports" in /dist
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

test('className is converted to an inline style.', () => {
  render(
    <>
      <div data-testid="main" className="flex center">
        centered
      </div>
      <div data-testid="combined" className="flex" style={{ position: 'relative' }}>
        flex and relative
      </div>
    </>
  )

  expect(screen.getByTestId('main')).toHaveAttribute(
    'style',
    'display: flex; justify-content: center;'
  )

  // Existing styles are merged.
  expect(screen.getByTestId('combined')).toHaveAttribute(
    'style',
    'position: relative; display: flex;'
  )
})
