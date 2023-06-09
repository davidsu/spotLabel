import { Stack, Avatar, Typography } from '@mui/material'
import { useRecoilValue } from 'recoil'
import { AudioFeaturesInfo } from '../../components/AudioFeatures'
import { apiWithCache, currPlayerState, getTracksAudioFeatures } from '../../state/atoms'

function InfoChip({ albumName, image, name }) {
  return (
    <Stack direction="column" spacing={0} alignItems="center">
      <Avatar sx={{ width: '80px', height: '80px' }} src={image} />
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
        image={(album.images || [])[2]?.url}
      />
    </>
  )
}

export function Playing() {
  const playerState = useRecoilValue(currPlayerState)
  const item = playerState?.item
  const tracks = useRecoilValue(getTracksAudioFeatures([item.id]))
  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <PlayingHeader />
      {!!tracks?.audio_features?.length && <AudioFeaturesInfo track={{audioFeatures: tracks.audio_features[0]}} />}
    </Stack>
  )
}
