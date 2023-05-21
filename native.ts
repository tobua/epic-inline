export const properties = {
  pv: ['paddingVertical'],
  ph: ['paddingHorizontal'],
  mv: ['marginVertical'],
  mh: ['marginHorizontal'],
}

export const isReactNative =
  typeof document === 'undefined' &&
  typeof navigator !== 'undefined' &&
  navigator.product === 'ReactNative'
