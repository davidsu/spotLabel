import { Stack, Typography, IconButton, Slider, Box } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useRecoilValue } from 'recoil'
import { AudioFeaturesInfo } from '../../components/AudioFeatures'
import { apiWithCache, getAlbum } from '../../state/atoms'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import { skipNext, skipPrev } from '../../api/player'
import { useEffect, useMemo, useState } from 'react'
import { apiFetch, BASE_URL } from '../../api/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getTracksAudioFeatures, getTracksSlim } from '../../api/tracks'

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

const usePlayerState = () =>
  useQuery(
    ['playerState'],
    () => apiFetch(`${BASE_URL}/me/player`).then(e => e.json()),
    { refetchInterval: 2000 }
  ).data || {}

const useAudioFeatures = (id: string) =>
  useQuery([`audio-features-${id}`], () => getTracksAudioFeatures([id]), {
    cacheTime: Infinity,
  }).data || {}

const emptyArr = []
const useFetchTracks = () =>
  useQuery({
    queryKey: ['tracks'],
    queryFn: () => getTracksSlim(),
    cacheTime: 1000 ** 2,
  }).data || emptyArr

const empty = {}
function AutoAdvanceSlider({ playerState, item }: any) {
  const [progress_ms, setProgress_ms] = useState(0)
  const queryClient = useQueryClient()
  useMemo(() => setProgress_ms(playerState?.progress_ms || 0), [playerState])
  const duration = playerState.duration_ms
  useEffect(() => {
    const interval = setTimeout(() => {
      if (!item) return
      if (progress_ms > duration) {
        queryClient.invalidateQueries({ queryKey: ['playerState'] })
      }
      setProgress_ms(progress_ms + 100)
    }, 100)
    return () => clearTimeout(interval)
  }, [progress_ms, setProgress_ms, duration])
  return (
    <Slider size="small" min={0} max={item.duration_ms} value={progress_ms} />
  )
}
export function Playing() {
  const [localLiked, setLocalLiked] = useState([])
  const queryClient = useQueryClient()
  const playerState = usePlayerState()
  const item = useMemo(() => playerState.item || empty, [playerState.item?.id])
  const tracks = useAudioFeatures(item.id)
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
      <Box width="30%">
        <AutoAdvanceSlider {...{ playerState, item }} />
      </Box>
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
