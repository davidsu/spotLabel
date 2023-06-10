import _ from 'lodash'
import { setValue, getValue } from './cache'
const BASE_URL = 'https://api.spotify.com/v1'
const headers = () => ({
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('access-token')!,
  },
})

const apiFetch = (url: string, options = {}) =>
  fetch(url, _.merge(headers(), options))

let cachehit = 0
const fetchWithCache = async (
  url: string,
  useCache = true
): Promise<Pick<Response, 'ok' | 'json' | 'status'>> => {
  const cached = await getValue(url).catch(e => {})
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
  setValue(url, result).catch(e => {})
  return { ...result, json: () => Promise.resolve(result), ok: true }
}

const getTracksForPlaylist = (pl: any) =>
  fetchWithCache(`${BASE_URL}/playlists/${pl.id}/tracks`).then(e => {
    if (e.status === 429) {
      return new Promise(r =>
        setTimeout(() => r(getTracksForPlaylist(pl)), 2000)
      )
    }
    return e.json()
  })

export const getTrackForPlaylists = async (playlists: any[]) => {
  const result: Record<string, any> = {}
  await Promise.all(
    playlists?.map(pl =>
      getTracksForPlaylist(pl)
        .then(e => {
          e.items.forEach((item: any) => {
            const trackId = item.track.id
            result[trackId] = result[trackId] || { ...item.track, labels: [] }
            result[trackId].labels.push({
              id: pl.id,
              name: pl.name,
              images: pl.images,
            })
          })
        })
        .catch(() => {})
    )
  )
  return result
}
//@ts-ignore
export const getPlaylists = async (offset = 0) => {
  const result = await fetchWithCache(
    `${BASE_URL}/me/playlists?limit=50&offset=${offset}`
  )
  if (!result.ok) {
    localStorage.removeItem('access-token')
  }
  const json = await result.json()
  const items = json.items.filter(
    pl => pl.owner.id === '31k4oinyddoxtsqhdhpsmqztnq4y'
  )
  if (json.items.length === 50) {
    return [...items, ...(await getPlaylists(offset + 50))]
  }
  return items
}

const getGenres = async () => {
  const genres = await fetchWithCache(
    `${BASE_URL}/recommendations/available-genre-seeds`
  )
  console.log({ genres })
  return genres
}

//@ts-ignore
window.getGenres = getGenres

export const getUser = () =>
  fetch(`${BASE_URL}/me`, headers()).then(e => e.json())

//@ts-ignore
window.getPlaylists = getPlaylists
