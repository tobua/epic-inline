import { createRoot } from 'react-dom/client'
import { ei } from 'epic-inline'
import github from './asset/github.svg'
import npm from './asset/npm.svg'

createRoot(document.body).render(
  <div style={ei('flex between alignItems')}>
    <div style={ei('flex center column font')}>
      <h1>epic-inline</h1>
      <p>One-Line Inline Styled React App</p>
    </div>
    <div style={ei('flex gap-10')}>
      <a href="https://github.com/tobua/epic-inline">
        <img style={ei('width-50 height-50')} src={github} alt="epic-inline on GitHub" />
      </a>
      <a href="https://npmjs.com/epic-inline">
        <img style={ei('width-50 height-50')} src={npm} alt="epic-inline on npm" />
      </a>
    </div>
  </div>
)
