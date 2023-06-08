import { useContext, useEffect, useState } from 'react'
import { appContext } from './AppProvider'
import _ from 'lodash'

const applySearch = (tracks: any[], playlistItems, search) => {
  const testRegex = new RegExp(search, 'i')
  return tracks.filter(
    t =>
      testRegex.test(t.name) ||
      (playlistItems[t.id]?.labels || []).some((label: any) =>
        testRegex.test(label.name)
      )
  )
}
const filterEnergy = (track, energy) =>
  track.audioFeatures?.energy >= energy[0] / 100 &&
  track.audioFeatures?.energy <= energy[1] / 100

const filterValence = (track, valence) =>
  track.audioFeatures?.valence >= valence[0] / 100 &&
  track.audioFeatures?.valence <= valence[1] / 100

const applyAudioFeatureFilters = (tracks, audioFeaturesFilters) => {
  const { energy, valence } = audioFeaturesFilters
  const result = tracks
    .filter(track => !energy || filterEnergy(track, energy))
    .filter(track => !valence || filterValence(track, valence))
  return result
}

export const useTracks = () => {
  const { tracks, playlistItems, search, audioFeaturesFilters } =
    useContext(appContext)
  const [enriched, setEnriched] = useState<any[]>([])
  useEffect(() => {
    const result = _(tracks)
      .thru(t => applySearch(t, playlistItems, search))
      .thru(t => applyAudioFeatureFilters(t, audioFeaturesFilters))
      //@ts-ignore
      .map(t => {
        return {
          ...t,
          labels: playlistItems[t.id]?.labels || [],
        }
      })
      .value()
      .slice(0, 50)
    setEnriched(result)
  }, [tracks, playlistItems, setEnriched, search, audioFeaturesFilters])
  return enriched
}
