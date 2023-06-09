import { atom } from 'recoil'

export const currScreenState = atom({
  key: 'textState', // unique ID (with respect to other atoms/selectors)
  default: 'home', // default value (aka initial value)
})
