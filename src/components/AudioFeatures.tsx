import { Typography, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
export const AudioFeaturesInfo = ({ track }: any) => {
  const theme = useTheme()
  return (
    <Stack direction="row" spacing={1}>
      <Typography color={theme.palette.secondary.main} fontSize={'10px'}>
        energy: {Number(track.audioFeatures?.energy).toFixed(3)}
      </Typography>
      <Typography color={theme.palette.primary.main} fontSize={'10px'}>
        valence: {Number(track.audioFeatures?.valence).toFixed(3)}
      </Typography>
      <Typography color="cyan" fontSize={'10px'}>
        loudness: {Number(track.audioFeatures?.loudness).toFixed(3)}
      </Typography>
    </Stack>
  )
}
