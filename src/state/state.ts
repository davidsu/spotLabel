import { atom, useAtom } from 'jotai'
import { atomsWithQuery } from 'jotai-tanstack-query'

// Create your atoms and derivatives
export const audioFeaturesFiltersAtom = atom({ energy: [0, 100], valence: [0, 100] })

const uppercaseAtom = atom(get => get(audioFeaturesFiltersAtom).toUpperCase())

type AudioFeaturesFiltersType = {
  energy: [number, number]
  valence: [number, number]
}

const idAtom = atom(1)
const [userAtom] = atomsWithQuery(get => ({
  queryKey: ['users', get(idAtom)],
  queryFn: async ({ queryKey: [, id] }) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    return res.json() as AudioFeaturesFiltersType
  },
}))
