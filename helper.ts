export const camelToDashCase = (input: string) =>
  input.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)

export const hasUpperCase = (input: string) => /[A-Z]/.test(input)

export const splitByFirstDash = (input: string) => {
  const index = input.indexOf('-')
  if (index !== -1) {
    const firstPart = input.slice(0, index)
    const secondPart = input.slice(index + 1)
    return [firstPart, secondPart]
  }
  return [input, '']
}
