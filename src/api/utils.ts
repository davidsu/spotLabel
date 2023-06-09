import _ from 'lodash'
import { getValue, setValue } from '../cache'

export const BASE_URL = 'https://api.spotify.com/v1'
const headers = () => ({
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('access-token')!,
  },
})
export const apiFetch = (url: string, options: RequestInit = {}) =>
  fetch(url, _.merge(options, headers()))
let cachehit = 0
export const fetchWithCache = async (
  url: string,
  useCache = true
): Promise<Pick<Response, 'ok' | 'json' | 'status'>> => {
  const cached = await getValue(url)
  if (useCache && cached) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(cached),
    })
  }
  const response = await apiFetch(url)
  if (!response.ok) {
    return Promise.reject(response)
  }
  const result = await response.json()
  setValue(url, result)
  return { ...result, json: () => Promise.resolve(result), ok: true }
}
