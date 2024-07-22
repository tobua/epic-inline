import React from 'react'
import _jsxdevruntime from 'react/jsx-dev-runtime'
import _jsxruntime from 'react/jsx-runtime'
import { ei } from './index'

// Workaround to avoid tree-shaking issue in Rspack.
const convert = ei

// biome-ignore lint/complexity/noBannedTypes: Arrow won't work here.
function jsxPolyfill(originalMethod: Function, ...args: any[]) {
  const props = args[1]

  // Works both with class and className.
  if (props?.className) {
    const styles = convert(props.className)

    // Keep regular classes intact.
    if (styles !== props.className) {
      props.style = { ...props.style, ...styles }
      props.className = undefined
    }
  }

  if (props?.class) {
    const styles = convert(props.class)

    // Keep regular classes intact.
    if (styles !== props.class) {
      props.style = { ...props.style, ...styles }
      props.class = undefined
    }
  }

  return originalMethod(...args)
}

const originalCreateElement = React.createElement

React.createElement = function ReactCreateElementInlineOverride(...args: any[]) {
  return jsxPolyfill(originalCreateElement, ...args)
}
// @ts-ignore
const originalDevRuntime = _jsxdevruntime.jsxDEV
// @ts-ignore
_jsxdevruntime.jsxDEV = function ReactDevRuntimeInlineOverride(...args: any[]) {
  return jsxPolyfill(originalDevRuntime, ...args)
}
// @ts-ignore
const originalRuntime = _jsxruntime.jsx
// @ts-ignore
_jsxruntime.jsx = function ReactRuntimeInlineOverride(...args: any[]) {
  return jsxPolyfill(originalRuntime, ...args)
}
// @ts-ignore
const originalRuntimeS = _jsxruntime.jsxs
// @ts-ignore
_jsxruntime.jsxs = function reactRuntimesInlineOverride(...args: any[]) {
  return jsxPolyfill(originalRuntimeS, ...args)
}
