const table = {
  jc: ['justifyContent', 'center', 'justify-content'],
  flex: ['display', 'flex'],
  df: 'flex',
}

const options = {
  type: 'javascript',
}

export const configure = (type: 'javascript' | 'css') => {
  options.type = type
}

export const ei = (input: string) => {
  const parts = input.split(' ')
  const styles: { [key: string]: string } = {}

  parts.forEach((part) => {
    let value = table[part]

    if (typeof value === 'string') {
      value = table[value]
    }

    if (value) {
      // eslint-disable-next-line prefer-destructuring
      styles[options.type === 'css' && value[2] ? value[2] : value[0]] = value[1]
    }
  })

  return styles
}
