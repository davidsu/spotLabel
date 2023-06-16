import { atom } from 'jotai'
import { atomsWithQuery } from 'jotai-tanstack-query'
import { apiFetch, BASE_URL } from '../api/utils'

export type AudioFeaturesFiltersType = {
  energy: [number, number]
  valence: [number, number]
}
// Create your atoms and derivatives
export const audioFeaturesFiltersAtom = atom<AudioFeaturesFiltersType>({
  energy: [0, 100],
  valence: [0, 100],
})
export const selectedGenresAtom = atom<string[]>([])
export const currentTracksList = atom<any[]>([])

const idAtom = atom(1)
export const [genresAtom] = atomsWithQuery(get => ({
  queryKey: ['genres', get(idAtom)],
  queryFn: async ({ queryKey: [, id] }) => {
    const res = await apiFetch(
      `${BASE_URL}/recommendations/available-genre-seeds`
    )
    const result = await res.json()
    console.log({ result })
    return result.genres
  },
}))
