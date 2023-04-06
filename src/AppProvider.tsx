import { createContext, FC, ReactElement, ReactNode, useEffect, useState } from 'react'
import { getAuthorizationCode, getToken } from './tokenFlow'
import './api'
import { getPlaylists, getTrackForPlaylists, getTracks } from './api'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const PLITEMS = 'playlistItems'
const LABELS = 'labels'
const TRACKS = 'tracks'
type Context = {
  token: string | null
  tracks: any[]
  labels: any[]
  playlistItems: Record<string, any>
}

const initialState = {
  token: '',
  labels: JSON.parse(localStorage.getItem(LABELS) || '[]'),
  tracks: JSON.parse(localStorage.getItem(TRACKS) || '[]'),
  playlistItems: JSON.parse(localStorage.getItem(PLITEMS) || '{}'),
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

const usePlaylistItems = (
  labels: any[],
  playlistItems: Record<string, any>,
  setPlaylistItems: React.Dispatch<React.SetStateAction<Record<string, any>>>
) => {
  const { isLoading, error, data } = useQuery(PLITEMS, () => 
    getTrackForPlaylists(labels).then((items: Record<string, any>) => {
      setPlaylistItems(items)
      const mapped = Object.entries(items).reduce(
        (acc, [id, { labels, name }]) => ({
          ...acc,
          [id]: { labels, name },
        }),
        {}
      )

      localStorage.setItem(PLITEMS, JSON.stringify(mapped))
      // for(const [key,val] of Object.entries(items))
      //   localStorage.setItem(key, JSON.stringify(val))
    }))
  return data || playlistItems
}

export const AppProvider: FC<{ children: ReactElement }> = ({ children }) => {
  useWhaat()
  const [labels, setLabels] = useState<any[]>(initialState.labels)
  const [tracks, setTracks] = useState<any[]>(initialState.tracks)
  const [playlistItems, setPlaylistItems] = useState<Record<string, any>>(
    initialState.playlistItems
  )
  const token = localStorage.getItem('access-token')
  usePlaylists(token, setLabels)
  useFetchTracks(token, setTracks)
  usePlaylistItems(labels, playlistItems, setPlaylistItems)

  const state = (window.state = { tracks, labels, playlistItems })
  console.log(state)
  return (
    <appContext.Provider
      value={{
        playlistItems,
        tracks,
        labels,
        token: localStorage.getItem('access-token'),
      }}
    >
      {children}
    </appContext.Provider>
  )
}
