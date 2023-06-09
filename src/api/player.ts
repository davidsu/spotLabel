import { apiFetch, BASE_URL } from './utils'

export const skipNext = () =>
  apiFetch(`${BASE_URL}/me/player/next`, {
    method: 'POST',
    body: '{}',
  }).then(e => e.json())

export const skipPrev = () =>
  apiFetch(`${BASE_URL}/me/player/previous`, {
    method: 'POST',
    body: '{}',
  })
    .then(e => e.json())
    .catch(e => console.log(e))
