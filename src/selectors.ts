import { useContext, useEffect, useState } from 'react'
import { appContext } from './AppProvider'

export const useTracks = () => {
  const { tracks, playlistItems, search } = useContext(appContext)
  const [enriched, setEnriched] = useState<any[]>([])
  useEffect(() => {
    // const unvisited = new Set(Object.keys(playlistItems))
    const testRegex = new RegExp(search, 'i')
    const result = tracks
      .filter(
        t =>
          testRegex.test(t.name) ||
          (playlistItems[t.id]?.labels || []).some((label: any) =>
            testRegex.test(label.name)
          )
      )
      .map(t => {
        // unvisited.delete(t.id)
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
  }, [tracks, playlistItems, setEnriched, search])
  return enriched
}
