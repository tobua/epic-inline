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

## Credits

The approach to parse short form strings into complex CSS style sheets is inspired by [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) which parses `className` during build time and outputs stylesheets containing only the necessary properties.
