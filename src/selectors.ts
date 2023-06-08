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
const applyAudioFeatureFilters = (tracks, audioFeaturesFilters) => {
  const { energy } = audioFeaturesFilters
  if (!energy) {
    return tracks
  }
  const result = tracks.filter(
    t =>
      t.audioFeatures?.energy >= energy[0] / 100 &&
      t.audioFeatures?.energy <= energy[1] / 100
  )
  debugger
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
      .map(t => {
        return {
          ...t,
          labels: playlistItems[t.id]?.labels || [],
        }
      })
      .value()
    setEnriched(result)
  }, [tracks, playlistItems, setEnriched, search, audioFeaturesFilters])
  return enriched
}
