// Using JSX createElement override to automatically convert className.
import 'epic-inline/register-react'
import { createRoot } from 'react-dom/client'
import github from './asset/github.svg'
import npm from './asset/npm.svg'

createRoot(document.body).render(
  <div className="flex between alignItems">
    <div className="flex center column font">
      <h1>epic-inline</h1>
      <p>
        One-Line Inline Styled <span className="bold">React App</span>
      </p>
    </div>
    <div className="flex gap-10">
      <a href="https://github.com/tobua/epic-inline">
        <img className="width-50 height-50" src={github} alt="epic-inline on GitHub" />
      </a>
      <a href="https://npmjs.com/epic-inline">
        <img className="width-50 height-50" src={npm} alt="epic-inline on npm" />
      </a>
    </div>
  </div>
)
