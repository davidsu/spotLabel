
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
  const theme = useTheme()
  return (
    <Stack direction="row" spacing={1}>
        <Typography color={theme.palette.secondary.main} fontSize={'10px'}>
          energy: {Number(track.audioFeatures.energy).toFixed(3)}
        </Typography>
        <Typography color={theme.palette.primary.main} fontSize={'10px'}>
          valence: {Number(track.audioFeatures.valence).toFixed(3)}
        </Typography>
        <Typography color="cyan" fontSize={'10px'}>
          loudness: {Number(track.audioFeatures.loudness).toFixed(3)}
        </Typography>
    </Stack>
  )
}

export const AudioFeaturesPicker = () => {
  const theme = useTheme()
  const { audioFeaturesFilters, setAudioFeatureFilters } =
    useContext(appContext)

  const onChangeEnergy = (event: Event, newValue: any) => {
    setAudioFeatureFilters({ ...audioFeaturesFilters, energy: newValue as [number, number] })
  }

  const onChangeValence = (event: Event, newValue: any) => {
    setAudioFeatureFilters({ ...audioFeaturesFilters, valence: newValue as [number, number] })
  }

  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      justifyContent="center"
    >
      <Typography color={theme.palette.secondary.main} fontSize={'10px'}>
        energy:
      </Typography>

      <Stack width="100px" alignItems="center">
        <Slider
          color="secondary"
          size="small"
          onChange={onChangeEnergy}
          value={audioFeaturesFilters.energy || [0, 100]}
        />
      </Stack>

      <Typography color={theme.palette.primary.main} fontSize={'10px'} paddingLeft="8px">
        valence:
      </Typography>

      <Stack width="100px" alignItems="center">
        <Slider
          color="primary"
          size="small"
          onChange={onChangeValence}
          value={audioFeaturesFilters.valence || [0, 100]}
        />
      </Stack>
    </Stack>
  )
}
