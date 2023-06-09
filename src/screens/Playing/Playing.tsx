import { Stack, Avatar, Typography, IconButton } from '@mui/material'
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil'
import { AudioFeaturesInfo } from '../../components/AudioFeatures'
import {
  apiWithCache,
  currPlayerState,
  getTracksAudioFeatures,
} from '../../state/atoms'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import { skipNext, skipPrev } from '../../api/player'

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
  const refresh = useRecoilRefresher_UNSTABLE(currPlayerState)

  return (
    <Stack direction="row" spacing={5}>
      <IconButton
        onClick={() => {
          skipPrev()
          refresh()
        }}
      >
        <SkipPreviousIcon />
      </IconButton>
      <IconButton
        onClick={() => {
          skipNext()
          refresh()
        }}
      >
        <SkipNextIcon />
      </IconButton>
    </Stack>
  )
}
export function Playing() {
  const playerState = useRecoilValue(currPlayerState)
  const item = playerState?.item
  const tracks = useRecoilValue(getTracksAudioFeatures([item.id]))
  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <PlayingHeader />
      {!!tracks?.audio_features?.length && (
        <AudioFeaturesInfo
          track={{ audioFeatures: tracks.audio_features[0] }}
        />
      )}
      <PlayingFooter />
    </Stack>
  )
}
