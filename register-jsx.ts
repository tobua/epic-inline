import { addCreateElementPlugin } from 'epic-jsx'
import { ei } from './index'

addCreateElementPlugin((_type, props) => {
  if (props.class) {
    const result = ei(props.class)
    if (typeof result === 'string') {
      props.class = result
    } else {
      props.style = { ...props.style, ...result }
      props.class = undefined
    }
  } else if (props.className) {
    const result = ei(props.className)
    if (typeof result === 'string') {
      props.className = result
    } else {
      props.style = { ...props.style, ...result }
      props.className = undefined
    }
  }
})
