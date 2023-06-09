import { atom, selector } from 'recoil'
import { apiFetch } from '../api'
import { BASE_URL } from '../api/utils'

export const currScreenState = atom({
  key: 'textState', // unique ID (with respect to other atoms/selectors)
  default: 'home', // default value (aka initial value)
})

export const currPlayerState = selector({
  key: 'playerState',
  get: () => apiFetch(`${BASE_URL}/me/player`).then(e => e.json()),
})
