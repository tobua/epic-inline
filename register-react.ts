import React from 'react'
import _jsxdevruntime from 'react/jsx-dev-runtime'
import _jsxruntime from 'react/jsx-runtime'
import { ei } from './index'
import type { CssStyles } from './types'

// Workaround to avoid tree-shaking issue in Rspack.
const convert = ei

// biome-ignore lint/suspicious/noExplicitAny: Not relevant here.
function addStylesToProps(styles: string | CssStyles | undefined, props: any) {
  if (typeof styles === 'object') {
    props.style = { ...props.style, ...styles }
    props.className = undefined
  } else if (typeof styles === 'string') {
    props.className = styles
  }
}

// biome-ignore lint/complexity/noBannedTypes: Arrow won't work here.
// biome-ignore lint/suspicious/noExplicitAny: Types not relevant.
function jsxPolyfill(originalMethod: Function, ...args: any[]) {
  const props = args[1]

  // Works both with class and className.
  if (props?.className) {
    const styles = convert(props.className)

    // Keep regular classes intact.
    if (styles !== props.className) {
      addStylesToProps(styles, props)
    }
  }

  if (props?.class) {
    const styles = convert(props.class)

    // Keep regular classes intact.
    if (styles !== props.class) {
      addStylesToProps(styles, props)
    }
  }

  return originalMethod(...args)
}

const originalCreateElement = React.createElement

// biome-ignore lint/suspicious/noExplicitAny: Types not relevant here, same as React.createElement.
React.createElement = function ReactCreateElementInlineOverride(...args: any[]) {
  return jsxPolyfill(originalCreateElement, ...args)
}
const originalDevRuntime = _jsxdevruntime.jsxDEV
// biome-ignore lint/suspicious/noExplicitAny: Types not relevant here, same as React.createElement.
_jsxdevruntime.jsxDEV = function ReactDevRuntimeInlineOverride(...args: any[]) {
  return jsxPolyfill(originalDevRuntime, ...args)
}
const originalRuntime = _jsxruntime.jsx
// biome-ignore lint/suspicious/noExplicitAny: Types not relevant here, same as React.createElement.
_jsxruntime.jsx = function ReactRuntimeInlineOverride(...args: any[]) {
  return jsxPolyfill(originalRuntime, ...args)
}
const originalRuntimeS = _jsxruntime.jsxs
// biome-ignore lint/suspicious/noExplicitAny: Types not relevant here, same as React.createElement.
_jsxruntime.jsxs = function reactRuntimesInlineOverride(...args: any[]) {
  return jsxPolyfill(originalRuntimeS, ...args)
}

// biome-ignore lint/suspicious/noExplicitAny: React runtimes aren't typed.
export const register = (runtime: any) => {
  if (runtime.jsxDEV) {
    const originalDevRuntime = runtime.jsxDEV
    // biome-ignore lint/suspicious/noExplicitAny: Types not relevant here, same as React.createElement.
    runtime.jsxDEV = function ReactDevRuntimeInlineOverride(...args: any[]) {
      return jsxPolyfill(originalDevRuntime, ...args)
    }
  }
  if (runtime.jsx) {
    const originalRuntime = runtime.jsx
    // biome-ignore lint/suspicious/noExplicitAny: Types not relevant here, same as React.createElement.
    runtime.jsx = function ReactRuntimeInlineOverride(...args: any[]) {
      return jsxPolyfill(originalRuntime, ...args)
    }
  }
  if (runtime.jsxs) {
    const originalRuntimeS = runtime.jsxs
    // biome-ignore lint/suspicious/noExplicitAny: Types not relevant here, same as React.createElement.
    runtime.jsxs = function reactRuntimesInlineOverride(...args: any[]) {
      return jsxPolyfill(originalRuntimeS, ...args)
    }
  }
}
