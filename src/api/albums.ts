import { BASE_URL, fetchWithCache } from './utils'

export const apiFetchAlbum = async (albumId: string) => {
  const result = await fetchWithCache(`${BASE_URL}/albums/${albumId}`)
  const json = await result.json()
  return json
}
