<p align="center">
  <img src="https://github.com/tobua/epic-inline/raw/main/logo.png" alt="epic-inline" width="30%">
</p>

# epic-inline

Concise way to write runtime inline CSS styles.

## Usage

```jsx
import { ei } from 'epic-inline'

export const Button = () => <button style={ei('flex center')}>Click me!</button>
```

<img src="https://github.com/tobua/epic-inline/raw/main/schema.svg" alt="schema of property structure">

## Breakpoints

Breakpoints can be used to apply styles conditionally based on the current window width. By default they will match upwards, add `-only` to match only the specific breakpoint.

`small:flex medium-only:grid large:block inline` or shorter `s:flex m-only:grid l:block inline`.

## Sizes

Sizes serve as readable values.

```js
"width-small" => { width: 5 } // small medium large huge
"width-md" => { width: 10 }   // sm md lg hg
"width-l" => { width: 20 }    // s m l h
"width-huge" => { width: 40 }
```

## Colors

Lots of named colors are available and can be combined with a tone between 50 and 900, where 400 matches the exact color.

```js
"color-red-400" => { color: '#FF0000'}
"color-blue-200" => { color: '#3333FF'}
"background-lavenderblush-900" => { background: '#FF70A0'}
```

## Shortcuts

Shortcuts generate several properties and are thought to encapsulate often used patterns.

```js
"button" => { outline: 'none', border: 'none' }
"link" => { textDecoration: 'none' }
```

## Complex Values

Using methods it's possible to create more complex styles. The methods can receive both a size and a color.

```js
ei('shadow') => { boxShadow: '0 5px 5px 3px #000000AA' }
ei('boxShadowX-large') => { boxShadow: '0 10px 10px 5px #000000AA' }
ei('textShadowX') => { textShadow: '2px 2px 2px black' }
ei('textShadowX-large-gray') => { textShadow: '4px 4px 4px gray' }
```

## Configuration

Various behaviours and sizes can be configured.

```ts
import { configure, Type } from 'epic-inline'

configure({
  type: Type.Css | Type.Js | Type.Native,
  size: (value) => `${value / 10}rem`,
  object: (value) => JSON.stringify(value),
  classPrefix: 'another-',
  shortcuts: { image: 'width-50 height-50' },
  sizes: { '4xl': 80 },
  breakpoints: { phone: 500, tablet: 800, desktop: 1200 },
  properties: {
    // Additional CSS property.
    borderStroke: ['border-stroke', 'solid'],
    // Shortcut to existing property with value
    outlineFlex: 'display-outline-flex',
  },
})
```

## React `className` Polyfill

While generally considered criminal, for low-quality projects this plugin provides a JSX override that will automatically transform any `className` on a React component to matching inline styles.

```jsx
import 'epic-inline/register-react'

export const Button = () => <button className="flex center">Click me!</button>
```

If automatic registration doesn't work because the bundler isolates imports, try doing it manually:

```js
import _jsxdevruntime from 'react/jsx-dev-runtime'
import _jsxruntime from 'react/jsx-runtime'
import { register } from 'epic-inline/register-react'

register(_jsxdevruntime)
register(_jsxruntime)
```

## React Native

```tsx
import { View, Text } from 'react-native'
import { ei, configure, Type } from 'epic-inline'

configure({ type: Type.Native })

const MyView = (
  <View style={ei('pv-medium marginHorizontal-small center')}>
    <Text>Hello React Native</Text>
  </View>
)
```

Using the `className` polyfill with types declared below:

```tsx
import { View, Text } from 'react-native'
import 'epic-inline/register-react'
import { configure, Type } from 'epic-inline'

configure({ type: Type.Native })

const MyText = <Text className="color-red">Hello React Native</Text>

declare module 'react-native' {
  export interface TextProps {
    className?: string
  }
}
```

<p align="center">
  <img src="https://github.com/tobua/epic-inline/raw/main/chatgpt.png" alt="That's great!" width="500">
</p>

## Vue, Svelte and SolidJS

Inline styles can be configured to work with various frameworks using `Preset`s.

```jsx
import { ei, configure, Preset } from 'epic-inline'

configure(Preset.vue)
const MyVue = <div :style="ei('paddingLeft-10')">content</div>
// <div :style="{ paddingLeft: '10px' }">content</div>

configure(Preset.svelte)
const MySvelete = <div style={ei('paddingLeft-10')}>content</div>
// <div style="padding-left: 10px;">content</div>

configure(Preset.solid)
const MySolid = <div style={ei('paddingLeft-10')}>content</div>
// <div style={{ 'padding-left': '10px' }}>content</div>
```

## Credits

The approach to parse short form strings into complex CSS style sheets is inspired by [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) which parses `className` during build time and outputs stylesheets containing only the necessary properties.
