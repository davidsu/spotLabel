import { BASE_URL, fetchWithCache } from './utils'
import { keyBy } from 'lodash'

export const getTracksAudioFeatures = async (trackIds: string[]) => {
  const result = await fetchWithCache(
    `${BASE_URL}/audio-features?ids=${trackIds.join(',')}`
  )
  const json = await result.json()
  return json
}
window.getTrack = getTracksAudioFeatures

const toExtendedTracks = async (tracks: any[]) => {
  const extended = await getTracksAudioFeatures(tracks.map(({ id }) => id))
  const keyedExteded = keyBy(extended.audio_features, 'id')
  return tracks.map(track => {
    return {
      ...track,
      audioFeatures: keyedExteded[track.id],
    }
  })
}
export const getTracks = async (offset = 0) => {
  const result = await fetchWithCache(
    `${BASE_URL}/me/tracks?limit=50&offset=${offset}`
  )
  const json = await result.json()
  if (json.items.length === 50) {
    return [
      ...(await toExtendedTracks(json.items.map(i => i.track))),
      ...(await getTracks(offset + 50)),
    ]
  }
  return toExtendedTracks(json.items.map(i => i.track))
}
