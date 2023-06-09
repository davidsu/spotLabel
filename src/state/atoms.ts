import { atom, selector, selectorFamily } from 'recoil'
import { getTracksAudioFeatures as apiFetchAudioFeatures } from '../api/tracks'
import { apiFetch, BASE_URL, fetchWithCache } from '../api/utils'

export const currScreenState = atom({
  key: 'textState', // unique ID (with respect to other atoms/selectors)
  default: 'home', // default value (aka initial value)
})

export const currPlayerState = selector({
  key: 'playerState',
  get: () => apiFetch(`${BASE_URL}/me/player`).then(e => e.json()),
})

export const apiWithCache = selectorFamily({
  key: 'apiWithCache',
  get: (url: string) => () => fetchWithCache(url).then(e => e.json()),
})

export const getTracksAudioFeatures = selectorFamily({
  key: 'getTracksAudioFeatures',
  get: (ids: string[]) => () => apiFetchAudioFeatures(ids),
})
