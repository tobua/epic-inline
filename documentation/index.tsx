/// <reference types="@rsbuild/core/types" />
import _jsxdevruntime from 'react/jsx-dev-runtime'
import _jsxruntime from 'react/jsx-runtime'
import { register } from 'epic-inline/register-react'
import { createRoot } from 'react-dom/client'
import github from './asset/github.svg'
import npm from './asset/npm.svg'

// Using JSX createElement override to automatically convert className.
register(_jsxdevruntime)
register(_jsxruntime)

const Flexboxes = ({
  classes,
  title,
  count = 3,
}: {
  classes?: string
  title: string
  count: number
}) => (
  <div className="flex bg-lightgray column">
    <span className="flex alignSelf-center p-small mono">{title}</span>
    <div className={`flex gap-small p-medium ${classes}`}>
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} className="bg-azure w-medium square" />
      ))}
    </div>
  </div>
)

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
    <main className="flex column">
      <p>
        One-Line Inline Styled <span className="bold">React App</span>
      </p>
      <section>
        <h2>Colors</h2>
        <div className="flex gap-medium">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((tone) => (
            <div key={tone} className={`bold color-white radius-medium p-medium background-blue-${tone}`}>
              blue-{tone}
            </div>
          ))}
        </div>
        <div className="flex gap-medium">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((tone) => (
            <p key={tone} className={`bold color-salmon-${tone}`}>
              salmon-{tone}
            </p>
          ))}
        </div>
        <h2>Shadows</h2>
        <div className="flex gap-large">
          <div className="shadow bg-gray p-medium">
            <span className="color-white">shadow</span>
          </div>
          <div className="shadow-small bg-white radius p-medium">
            <span>shadow-small</span>
          </div>
          <div className="shadow-large bg-white radius p-medium">
            <span>shadow-large</span>
          </div>
        </div>
        <h2>Flexbox</h2>
        <div className="flex gap-large alignItems-start">
          <Flexboxes title="flex" count={3} />
          <Flexboxes title="column" classes="column" count={3} />
          <Flexboxes title="center" classes="center width-100" count={3} />
          <Flexboxes title="between" classes="width-100 between" count={3} />
          <Flexboxes title="wrap" classes="width-50 wrap" count={5} />
        </div>
        <h2>Complex Values</h2>
        <div className="flex gap-large column alignItems-start">
          <span className="code">innerRadius</span>
          <div className="flex alignItems-end">
            <div className="innerRadius bg-blue w-large square" />
            <div className="bg-blue w-100 h-huge borderTopRadius flex center color-white">Fancy Tab</div>
            <div className="innerRadius bg-blue w-large square flipHorizontal" />
          </div>
        </div>
        <h2>Shortcuts</h2>
        <div className="flex gap-large alignItems wrap bg-lightgray radius p-medium">
        <button className="button">Button</button>
          <button className="button bold color-white radius p background-blue-300">Button Styled</button>
          <input className="input" placeholder="Input" />
          <input className="input bold color-white radius p background-blue-300" placeholder="Input Styled" />
        </div>
      </section>
    </main>
  </div>,
)
