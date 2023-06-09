import { apiFetch, BASE_URL } from './utils'

export const skipNext = () =>
  apiFetch(`${BASE_URL}/me/player/next`, {
    method: 'POST',
    body: '{}',
  })

export const skipPrev = () =>
  apiFetch(`${BASE_URL}/me/player/previous`, {
    method: 'POST',
    body: '{}',
  })
