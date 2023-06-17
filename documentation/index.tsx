// Using JSX createElement override to automatically convert className.
import 'epic-inline/register-react'
import { createRoot } from 'react-dom/client'
import github from './asset/github.svg'
import npm from './asset/npm.svg'

createRoot(document.body).render(
  <div className="flex column font">
    <header className="flex between alignItems font">
      <h1>epic-inline</h1>
      <div className="flex gap-10">
        <a href="https://github.com/tobua/epic-inline">
          <img className="width-50 height-50" src={github} alt="epic-inline on GitHub" />
        </a>
        <a href="https://npmjs.com/epic-inline">
          <img className="width-50 height-50" src={npm} alt="epic-inline on npm" />
        </a>
      </div>
    </header>
    <main className="flex center column">
      <p>
        One-Line Inline Styled <span className="bold">React App</span>
      </p>
      <section>
        <h2>Colors</h2>
        <div className="flex gap-medium">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((tone) => (
            <div className={`bold color-white radius-medium p-medium background-blue-${tone}`}>
              blue-{tone}
            </div>
          ))}
        </div>
        <div className="flex gap-medium">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((tone) => (
            <p className={`bold color-salmon-${tone}`}>salmon-{tone}</p>
          ))}
        </div>
      </section>
    </main>
  </div>
)
