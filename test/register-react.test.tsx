// @vitest-environment happy-dom

import React from 'react'
import '../register-react' // NOTE will import from "exports" in /dist
import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

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
    'display: flex; justify-content: center; align-items: center;'
  )

  // Existing styles are merged.
  expect(screen.getByTestId('combined')).toHaveAttribute(
    'style',
    'position: relative; display: flex;'
  )
})
