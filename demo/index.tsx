import { createRoot } from 'react-dom/client'
import { ei } from './node_modules/epic-inline'

createRoot(document.body).render(<div style={ei('flex jc')}>One-Line Inline Styled React App</div>)
