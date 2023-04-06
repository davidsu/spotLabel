import { useContext, useEffect, useState } from 'react'
import { appContext } from './AppProvider'

export const useTracks = () => {
  const { tracks, playlistItems } = useContext(appContext)
  const [enriched, setEnriched] = useState<any[]>([])
  useEffect(() => {
    const unvisited = new Set(Object.keys(playlistItems))
    const result = tracks.map((t) => {
      unvisited.delete(t.id)
      return {
        ...t,
        labels: playlistItems[t.id]?.labels || [],
      }
    })
    // for (const id of unvisited) {
    //   debugger
    //   result.push(playlistItems[id])
    // }
    setEnriched(result)
  }, [tracks, playlistItems, setEnriched])
  return enriched
}
