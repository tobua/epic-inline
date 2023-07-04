/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import _jsxdevruntime from 'react/jsx-dev-runtime'
import _jsxruntime from 'react/jsx-runtime'
import { ei } from 'epic-inline'

// Workaround to avoid tree-shaking issue in Rspack.
const convert = ei

function JSXPolyfill(originalMethod: Function, ...args: any[]) {
  const props = args[1]

  // Works both with class and className.
  if (props && props.className) {
    const styles = convert(props.className)

    // Keep regular classes intact.
    if (styles !== props.className) {
      props.style = { ...props.style, ...styles }
      delete props.className
    }
  }

  if (props && props.class) {
    const styles = convert(props.class)

    // Keep regular classes intact.
    if (styles !== props.class) {
      props.style = { ...props.style, ...styles }
      delete props.class
    }
  }

  return originalMethod(...args)
}

const originalCreateElement = React.createElement

React.createElement = function ReactCreateElementInlineOverride(...args: any[]) {
  return JSXPolyfill(originalCreateElement, ...args)
}
// @ts-ignore
const originalDevRuntime = _jsxdevruntime.jsxDEV
// @ts-ignore
_jsxdevruntime.jsxDEV = function ReactDevRuntimeInlineOverride(...args: any[]) {
  return JSXPolyfill(originalDevRuntime, ...args)
}
// @ts-ignore
const originalRuntime = _jsxruntime.jsx
// @ts-ignore
_jsxruntime.jsx = function ReactRuntimeInlineOverride(...args: any[]) {
  return JSXPolyfill(originalRuntime, ...args)
}
// @ts-ignore
const originalRuntimeS = _jsxruntime.jsxs
// @ts-ignore
_jsxruntime.jsxs = function ReactRuntimeSInlineOverride(...args: any[]) {
  return JSXPolyfill(originalRuntimeS, ...args)
}
