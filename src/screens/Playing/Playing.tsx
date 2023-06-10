import { Stack, Avatar, Typography, IconButton } from '@mui/material'
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useRecoilValue,
} from 'recoil'
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
import { useEffect, useState } from 'react'
import { apiFetch, BASE_URL } from '../../api/utils'

function InfoChip({ albumName, image, name }) {
  return (
    <Stack direction="column" spacing={0} alignItems="center">
      <Avatar
        variant="square"
        sx={{ width: '220px', height: '220px' }}
        src={image}
      />
      <Typography variant="caption">{albumName}</Typography>
      <Typography variant="caption">{name}</Typography>
    </Stack>
  )
}
function PlayingHeader() {
  const playerState = useRecoilValue(currPlayerState)
  const item = playerState?.item
  const album = item?.album || {}
  // const track = useRecoilValue(apiWithCache(item.href))
  const context = useRecoilValue(apiWithCache(playerState?.context?.href))
  return (
    <>
      <Stack direction="column" spacing={0} alignItems="center">
        <h5 style={{ margin: 0 }}>Playing</h5>
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

const usePlayerState = () => {
  const [item, setItem] = useState<PlayingItem>({})
  useEffect(() => {
    const interval = setInterval(async () => {
      const playerState = await apiFetch(`${BASE_URL}/me/player`).then(e =>
        e.json()
      )
      if (playerState?.item?.id !== item?.id) {
        setItem(playerState.item)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return item
}
export function Playing() {
  const item = usePlayerState()
  const tracks = useRecoilValue(getTracksAudioFeatures([item.id]))
  const album = useRecoilValue(getAlbum(item?.album?.id))


  if (!item.id) return <h1>Loading</h1>
  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <PlayingHeader />
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
      <PlayingFooter />
    </Stack>
  )
}
