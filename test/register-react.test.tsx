// @vitest-environment happy-dom

import React from 'react'
import '../register-react'
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

test('className is converted to an inline style.', () => {
  render(
    <div data-testid="main" className="flex center">
      centered
    </div>
  )

  expect(screen.getByTestId('main')).toHaveAttribute(
    'style',
    'display: flex; justify-content: center;'
  )
})
