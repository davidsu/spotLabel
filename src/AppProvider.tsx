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
import { getAuthorizationCode, getToken } from './tokenFlow'
import './api'
import { getPlaylists, getTrackForPlaylists, getTracks, getUser } from './api'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const PLITEMS = 'playlistItems'
const LABELS = 'labels'
const TRACKS = 'tracks'
type Context = {
  token: string | null
  tracks: any[]
  labels: any[]
  user: any
  playlistItems: Record<string, any>
  setSearch: React.Dispatch<React.SetStateAction<string>>
  search: string
}

const initialState = {
  token: '',
  user: {},
  labels: JSON.parse(localStorage.getItem(LABELS) || '[]'),
  tracks: JSON.parse(localStorage.getItem(TRACKS) || '[]'),
  playlistItems: JSON.parse(localStorage.getItem(PLITEMS) || '{}'),
  search: '',
  setSearch: () => {},
}
export const appContext = createContext<Context>(initialState)
const useWhaat = () =>
  useEffect(() => {
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
      })
    }
  }, [token, setLabels])

const useFetchTracks = (
  token: string | null,
  setTracks: React.Dispatch<React.SetStateAction<any[]>>
) =>
  useEffect(() => {
    if (token) {
      getTracks().then((items: any[]) => {
        setTracks(items)
        localStorage.setItem(TRACKS, JSON.stringify(items))
      })
    }
  }, [token, setTracks])

const useGetUser = () => {
  const { data } = useQuery('user', () => getUser())
  return data
}

const usePlaylistItems = (
  labels: any[],
) => {
  const { isLoading, error, data } = useQuery(PLITEMS, () => {
    getTrackForPlaylists(labels)
      .then((items: Record<string, any>) => {
        const mapped = Object.entries(items).reduce(
          (acc, [id, { labels, name }]) => ({
            ...acc,
            [id]: { labels, name },
          }),
          {}
        )
        localStorage.setItem(PLITEMS, JSON.stringify(mapped))
        return items
      })
      .catch(e => {
        console.log(e)
      })
  }, {cacheTime:9999, refetchOnWindowFocus: false} )
  return data 
}

export const AppProvider: FC<{ children: ReactElement }> = ({ children }) => {
  useWhaat()
  const [labels, setLabels] = useState<any[]>(initialState.labels)
  const [tracks, setTracks] = useState<any[]>(initialState.tracks)
  const [search, setSearch] = useState('')
  const user = useGetUser()
  const token = localStorage.getItem('access-token')
  usePlaylists(token, setLabels)
  useFetchTracks(token, setTracks)
  const playlistItems = usePlaylistItems(labels) || initialState.playlistItems

  const state = useMemo(
    () => ({
      user,
      search,
      setSearch,
      playlistItems,
      tracks,
      labels,
      token: localStorage.getItem('access-token'),
    }),
    [user, search, setSearch, playlistItems, tracks, labels]
  )
  console.log(state)
  return <appContext.Provider value={state}>{children}</appContext.Provider>
}
