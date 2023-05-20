import { createRoot } from 'react-dom/client'
// TODO regular import leads to build error.
import { ei } from './node_modules/epic-inline'

createRoot(document.body).render(
  <div style={ei('flex jc font')}>
    <h1>One-Line Inline Styled React App</h1>
  </div>
)
