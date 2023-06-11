import { Stack, Avatar, Typography, IconButton } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useRecoilState, useRecoilValue } from 'recoil'
import { AudioFeaturesInfo } from '../../components/AudioFeatures'
import {
  apiWithCache,
  currPlayerState,
  getAlbum,
  getTracksAudioFeatures,
  syncDevtools,
} from '../../state/atoms'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import { skipNext, skipPrev } from '../../api/player'
import { useEffect, useMemo, useState } from 'react'
import { apiFetch, BASE_URL } from '../../api/utils'
import { useQuery, useQueryClient } from 'react-query'
import { getTracks, getTracksSlim } from '../../api/tracks'

function InfoChip({ albumName, image, name }) {
  return (
    <Stack direction="column" spacing={0} alignItems="center">
      <img style={{ width: '220px', height: '220px' }} src={image} />
      <Typography variant="caption">{albumName}</Typography>
      <Typography variant="caption">{name}</Typography>
    </Stack>
  )
}
function PlayingHeader({ playerState }) {
  const item = playerState?.item
  const album = item?.album || {}
  // const track = useRecoilValue(apiWithCache(item.href))
  const context = useRecoilValue(apiWithCache(playerState?.context?.href))
  return (
    <>
      <Stack direction="column" spacing={0} alignItems="center">
        <Typography component={'h5'} margin={0}>
          Playing
        </Typography>
        <Typography variant="caption" sx={{ textAlign: 'center', margin: '0' }}>
          {context?.name}
        </Typography>
      </Stack>
      <InfoChip
        name={item.name}
        albumName={album.name}
        image={(album.images || [])[0]?.url}
      />
    </>
  )
}

function PlayingFooter() {
  return (
    <Stack direction="row" spacing={5}>
      <IconButton
        onClick={() => {
          skipPrev()
        }}
      >
        <SkipPreviousIcon />
      </IconButton>
      <IconButton
        onClick={() => {
          skipNext()
        }}
      >
        <SkipNextIcon />
      </IconButton>
    </Stack>
  )
}
const useSyncDevTools = ({ album, tracks }) => {
  const [syncDevtools_, setSync] = useRecoilState(syncDevtools)
  useEffect(() => {
    setSync({ album, tracks })
  }, [album, tracks, setSync])
  console.log({ syncDevtools_ })
}

type PlayingItem = {
  id?: string
  album?: any
}

const usePlayerState = () =>
  useQuery(
    'playerState',
    () => apiFetch(`${BASE_URL}/me/player`).then(e => e.json()),
    { refetchInterval: 1000 }
  ).data || {}

const emptyArr = []
const useFetchTracks = () =>
  useQuery({
    queryKey: ['tracks'],
    queryFn: () => getTracksSlim(),
  }).data || emptyArr

const empty = {}
export function Playing() {
  const [localLiked, setLocalLiked] = useState([])
  const queryClient = useQueryClient()
  const playerState = usePlayerState()
  const item = useMemo(() => playerState.item || empty, [playerState.item?.id])
  const tracks = useRecoilValue(getTracksAudioFeatures([item.id]))
  const album = useRecoilValue(getAlbum(item?.album?.id))
  const likedList = useFetchTracks()
  const liked = useMemo(
    () =>
      !!likedList.find(i => item.id == i.id) || localLiked.includes(item.id),
    [item, likedList, localLiked]
  )
  Object.assign(window, { item, likedList, liked })

  if (!item.id) return <h1>Loading</h1>
  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <PlayingHeader playerState={playerState} />
      {!!tracks?.audio_features?.length && (
        <AudioFeaturesInfo
          track={{ audioFeatures: tracks.audio_features[0] }}
        />
      )}
      {!!album?.genres?.length &&
        album.genres.map(g => (
          <Typography variant="caption" key={g}>
            {g}
          </Typography>
        ))}
      <IconButton
        onClick={() => {
          apiFetch(`${BASE_URL}/me/tracks`, {
            method: liked ? 'DELETE' : 'PUT',
            body: JSON.stringify({
              ids: [item.id],
            }),
          })
          if (liked) {
            setLocalLiked(localLiked.filter(i => i !== item.id))
          } else {
            setLocalLiked([...localLiked, item.id])
          }
          queryClient.invalidateQueries({ queryKey: ['tracks'] })
        }}
      >
        {liked ? <FavoriteIcon color="success" /> : <FavoriteBorderIcon />}
      </IconButton>
      <PlayingFooter />
    </Stack>
  )
}
