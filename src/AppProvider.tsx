import {
  createContext,
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getAuthorizationCode, getToken } from './tokenFlow'
import './api'
import { setValue } from './cache'
import { getPlaylists, getTrackForPlaylists, getUser } from './api'
import { useQuery } from '@tanstack/react-query'
import { getTracks } from './api/tracks'

const PLITEMS = 'playlistItems'
const LABELS = 'labels'
const TRACKS = 'tracks'
type AudioFeaturesFilters = {
  energy?: [number, number]
  valence?: [number, number]
}
type Context = {
  token: string | null
  tracks: any[]
  user: any
  playlistItems: Record<string, any>
  setSearch: React.Dispatch<React.SetStateAction<string>>
  search: string
  isDrawerEnabled: boolean
  enableDrawer: React.Dispatch<React.SetStateAction<boolean>>
  audioFeaturesFilters: AudioFeaturesFilters
  setAudioFeatureFilters: React.Dispatch<
    React.SetStateAction<AudioFeaturesFilters>
  >
}

const initialState = {
  token: '',
  tracks: [],
  user: {},
  playlistItems: {},
  audioFeaturesFilters: {},
  setAudioFeatureFilters: () => {},
  search: '',
  setSearch: () => {},
  isDrawerEnabled: false,
  enableDrawer: () => {},
}
export const appContext = createContext<Context>(initialState)

const usePlaylists = () =>
  useQuery(['playlists'], () =>
    getPlaylists().then((items: any[]) => {
      setValue(LABELS, items)
      return items
    })
  ).data || []

const useFetchTracks = () =>
  useQuery(['tracks_full'], () =>
    getTracks().then((items: any[]) => {
      //@ts-ignore
      setValue(TRACKS, items)
      return items
    })
  ).data || []

const useGetUser = () => {
  const { data } = useQuery(['user'], () => getUser())
  return data
}

const usePlaylistItems = (labels: any[] = []) => {
  const { data } = useQuery(
    [PLITEMS + labels.length],
    () =>
      getTrackForPlaylists(labels)
        .then((items: Record<string, any>) => {
          const mapped = Object.entries(items).reduce(
            (acc, [id, { labels, name }]) => ({
              ...acc,
              [id]: { labels, name },
            }),
            {}
          )
          setValue(PLITEMS, mapped)
          return mapped
        })
        .catch(e => {
          console.error(e)
        }),
    { cacheTime: 9999, refetchOnWindowFocus: false }
  )
  return data
}

export const AppProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [search, setSearch] = useState('')
  const [isDrawerEnabled, enableDrawer] = useState(true)
  const [audioFeaturesFilters, setAudioFeatureFilters] =
    useState<AudioFeaturesFilters>({})
  const user = useGetUser()
  const labels = usePlaylists() || []
  const tracks = useFetchTracks() || []
  const playlistItems = usePlaylistItems(labels) || initialState.playlistItems

  const state = useMemo(
    () => ({
      audioFeaturesFilters,
      enableDrawer,
      isDrawerEnabled,
      labels,
      playlistItems,
      search,
      setAudioFeatureFilters,
      setSearch,
      tracks,
      user,
      token: localStorage.getItem('access-token'),
    }),
    [
      audioFeaturesFilters,
      enableDrawer,
      isDrawerEnabled,
      labels,
      playlistItems,
      search,
      setAudioFeatureFilters,
      setSearch,
      tracks,
      user,
    ]
  )
  // console.log(state)
  return state.token && <appContext.Provider value={state}>{children}</appContext.Provider>
}
