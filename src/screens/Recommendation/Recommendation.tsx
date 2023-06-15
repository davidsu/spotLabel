import {
  List,
  ListItem,
  ListSubheader,
  Slider,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import {
  createContext,
  FC,
  ReactElement,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useAtom } from 'jotai'
import { audioFeaturesFiltersAtom } from '../../state/state'

function RecommendationHeader() {
  return (
    <ListSubheader>
      <Stack alignItems="center" direction={'column'}>
        <TextField
          size="small"
          fullWidth
          InputProps={{
            startAdornment: <SearchIcon color="disabled" />,
          }}
        />
        <AudioFeaturesFilters />
      </Stack>
    </ListSubheader>
  )
}

type SlideFilterProps = {
  label: string
  value: number | number[]
  onChange: (_: any, value: any) => any
  color: string
}
function SliderFilter({ label, color, ...props }: SlideFilterProps) {
  return (
    <>
      <Typography color={color} fontSize={'10px'}>
        {label}:
      </Typography>

      <Stack width="100px" alignItems="center">
        {/*
        //@ts-ignore*/}
        <Slider color={color} size="small" {...props} />
      </Stack>
    </>
  )
}
function AudioFeaturesFilters() {
  const [audioFeaturesFilters, setAudioFeatureFilters] = useAtom(
    audioFeaturesFiltersAtom
  )

  const onChangeValue = (key: string) => (_: any, newValue: any) => {
    setAudioFeatureFilters({
      ...audioFeaturesFilters,
      [key]: newValue,
    })
  }

  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      justifyContent="center"
    >
      <SliderFilter
        color="secondary"
        onChange={onChangeValue('energy')}
        label="energy"
        value={audioFeaturesFilters.energy || [0, 100]}
      />
      <SliderFilter
        color="primary"
        onChange={onChangeValue('valence')}
        label="valence"
        value={audioFeaturesFilters.valence || [0, 100]}
      />
    </Stack>
  )
}
export function Recommendation() {
  return (
    <List>
      <RecommendationHeader />

      <ListItem>boo</ListItem>
    </List>
  )
}
