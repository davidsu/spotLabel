
import {
  Slider,
  Stack,
  Typography,
} from '@mui/material'
import {
  useTheme,
} from '@mui/material/styles'
import {useContext} from 'react'
import {appContext} from '../../AppProvider'

export const AudioFeaturesInfo = ({ track }: any) => {
  const t = useTheme()
  return (
    <Stack direction="row" spacing={1}>
      <Stack justifyContent="right">
        <Typography color={t.palette.secondary.main} fontSize={'10px'}>
          energy: {Number(track.audioFeatures.energy).toFixed(3)}
        </Typography>
        <Typography color="green" fontSize={'10px'}>
          valence: {Number(track.audioFeatures.valence).toFixed(3)}
        </Typography>
      </Stack>
      <Stack justifyContent="right">
        <Typography color="cyan" fontSize={'10px'}>
          loudness: {Number(track.audioFeatures.loudness).toFixed(3)}
        </Typography>
      </Stack>
    </Stack>
  )
}

export const AudioFeaturesPicker = () => {
  const theme = useTheme()
  const { audioFeaturesFilters, setAudioFeatureFilters } =
    useContext(appContext)

  const onChange = (event: Event, newValue: any) => {
    setAudioFeatureFilters({ energy: newValue as [number, number] })
  }

  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      justifyContent="center"
    >
      <Typography color={theme.palette.secondary.main} fontSize={'10px'}>
        energy:
      </Typography>

      <Stack width="200px" alignItems="center">
        <Slider
          color="secondary"
          size="small"
          onChange={onChange}
          value={audioFeaturesFilters.energy || [0, 100]}
        />
      </Stack>
    </Stack>
  )
}
