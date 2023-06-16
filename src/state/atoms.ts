import { atom, selectorFamily } from 'recoil'
import { apiFetchAlbum } from '../api/albums'
import { getTracksAudioFeatures as apiFetchAudioFeatures } from '../api/tracks'
import { fetchWithCache } from '../api/utils'
import { SCREENS } from '../consts'

export const currScreenState = atom({
  key: 'textState', // unique ID (with respect to other atoms/selectors)
  default: SCREENS.home, // default value (aka initial value)
})

export const apiWithCache = selectorFamily({
  key: 'apiWithCache',
  get: (url: string) => () => fetchWithCache(url).then(e => e.json()),
})

export const getTracksAudioFeatures = selectorFamily({
  key: 'getTracksAudioFeatures',
  get: (ids: string[]) => () => apiFetchAudioFeatures(ids),
})

export const syncDevtools = atom({ key: 'syncDevtools', default: {} })
export const getAlbum = selectorFamily({
  key: 'getTracksAudioFeatures',
  get: (id: string) => () => apiFetchAlbum(id).catch(e => {}),
})
