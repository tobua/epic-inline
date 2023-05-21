export const camelToDashCase = (input: string) =>
  input.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)

export const hasUpperCase = (input: string) => /[A-Z]/.test(input)

export const splitByFirstDash = (str) => {
  const index = str.indexOf('-')
  if (index !== -1) {
    const firstPart = str.slice(0, index)
    const secondPart = str.slice(index + 1)
    return [firstPart, secondPart]
  }
  return [str, '']
}
