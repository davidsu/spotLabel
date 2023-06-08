import {
  createContext,
  FC,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getAuthorizationCode, getToken, refreshToken } from './tokenFlow'
import './api'
import { setValue } from './cache'
import { getPlaylists, getTrackForPlaylists, getUser } from './api'
import { useQuery } from 'react-query'
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
  labels: any[]
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
  user: {},
  labels: [],
  tracks: [],
  playlistItems: {},
  audioFeaturesFilters: {},
  setAudioFeatureFilters: () => {},
  search: '',
  setSearch: () => {},
  isDrawerEnabled: false,
  enableDrawer: () => {},
}
export const appContext = createContext<Context>(initialState)
let firstLoad = true
const useWhaat = (setToken: React.Dispatch<React.SetStateAction<string>>) =>
  useEffect(() => {
    if (!firstLoad) return
    firstLoad = false
    if (localStorage.getItem('access-token')) return
    if (/accept/.test(window.location.pathname)) {
      getToken()
    } else {
      getAuthorizationCode()
    }
  }, [])

const usePlaylists = (
  token: string | null,
  setLabels: React.Dispatch<React.SetStateAction<any[]>>
) =>
  useEffect(() => {
    if (token) {
      getPlaylists().then((items: any[]) => {
        setLabels(items)
        localStorage.setItem(LABELS, JSON.stringify(items))
        setValue(LABELS, items)
      })
    }
  }, [token, setLabels])

let loaded = false
const useFetchTracks = (
  token: string | null,
  setTracks: React.Dispatch<React.SetStateAction<any[]>>
) =>
  useEffect(() => {
    if (token && !loaded) {
      loaded = true
      getTracks().then((items: any[]) => {
        //@ts-ignore
        window.setTracks(items)
        //@ts-ignore
        window.setValue(TRACKS, items)
      })
    }
  }, [token, setTracks])

const useGetUser = () => {
  const { data } = useQuery('user', () => getUser())
  return data
}

const usePlaylistItems = (labels: any[]) => {
  const { data } = useQuery(
    PLITEMS + labels.length,
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
          console.log(e)
        }),
    { cacheTime: 9999, refetchOnWindowFocus: false }
  )
  return data
}

export const AppProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [labels, setLabels] = useState<any[]>(initialState.labels)
  const [tracks, setTracks] = useState<any[]>(initialState.tracks)
  const [search, setSearch] = useState('')
  const [token, setToken] = useState(localStorage.getItem('access-token'))
  const [isDrawerEnabled, enableDrawer] = useState(true)
  const [audioFeaturesFilters, setAudioFeatureFilters] =
    useState<AudioFeaturesFilters>({})
  Object.assign(window, {setTracks, setValue})
  const user = useGetUser()
  useWhaat(setToken)
  usePlaylists(token, setLabels)
  useFetchTracks(token, setTracks)
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
      token,
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
      token,
      user,
    ]
  )
  console.log(state)
  return <appContext.Provider value={state}>{children}</appContext.Provider>
}
