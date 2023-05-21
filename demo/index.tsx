import { createRoot } from 'react-dom/client'
import { ei } from 'epic-inline'

createRoot(document.body).render(
  <div style={ei('flex jc font')}>
    <h1>One-Line Inline Styled React App</h1>
  </div>
)
