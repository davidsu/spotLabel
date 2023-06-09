import { apiFetch, BASE_URL } from './utils'

export const skipNext = () =>
  apiFetch(`${BASE_URL}/me/player/next`).then(e => e.json())

export const skipPrev = () =>
  apiFetch(`${BASE_URL}/me/player/previous`).then(e => e.json())
