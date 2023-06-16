import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import {
  Box,
  Button,
  Chip,
  Collapse,
  List,
  ListItem,
  ListSubheader,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useAtom } from 'jotai'
import {
  audioFeaturesFiltersAtom,
  AudioFeaturesFiltersType,
  currentTracksList,
  genresAtom,
  selectedGenresAtom,
} from '../../state/state'
import { apiFetch, BASE_URL } from '../../api/utils'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getUser } from '../../api'

const useGetUser = () => {
  const queryResult = useQuery({
    queryKey: ['user_'],
    queryFn: getUser,
    cacheTime: Infinity,
  })
  //['user_'], () => getUser())
  console.log({ queryResult })
  return queryResult?.data || {}
}
const isDirty = (value: any, default_: any) =>
  JSON.stringify(value) !== JSON.stringify(default_)

function getAudioFeaturesParams(audioFeatures: AudioFeaturesFiltersType) {
  let result = ''
  if (isDirty(audioFeatures.energy, [0, 100])) {
    result += `&min_energy=${audioFeatures.energy[0] / 100}&max_energy=${
      audioFeatures.energy[1] / 100
    }`
  }
  if (isDirty(audioFeatures.valence, [0, 100])) {
    result += `&min_valence=${audioFeatures.valence[0] / 100}&max_valence=${
      audioFeatures.valence[1] / 100
    }`
  }
  return result
}

const usePlayCurrentItems = () => {
  const [tracks] = useAtom(currentTracksList)
  const user = useGetUser()
  return async () => {
    const playlist = await apiFetch(`${BASE_URL}/users/${user.id}/playlists`, {
      method: 'POST',
      body: JSON.stringify({
        name: 'tmp99',
        description: 'created by spotLabel',
      }),
    }).then(e => e.json())
    await apiFetch(`${BASE_URL}/playlists/${playlist.id}/tracks`, {
      method: 'POST',
      body: JSON.stringify({
        uris: tracks.map(track => track.uri),
      }),
    })
    // const playerState = await apiFetch(`${BASE_URL}/me/player`)
    apiFetch(`${BASE_URL}/me/player/play`, {
      method: 'PUT',
      body: JSON.stringify({ context_uri: playlist.uri }),
    })
  }
}

function RecommendationHeader() {
  const [audioFeatures] = useAtom(audioFeaturesFiltersAtom)
  const [, setTracksList] = useAtom(currentTracksList)
  const [selectedGenres] = useAtom(selectedGenresAtom)
  const play = usePlayCurrentItems()

  return (
    <ListSubheader>
      <Stack alignItems="center" direction={'column'}>
        <Box width="50%">
          <TextField
            size="small"
            fullWidth
            InputProps={{
              startAdornment: <SearchIcon color="disabled" />,
            }}
          />
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            size="small"
            variant="outlined"
            color="info"
            onClick={async () => {
              const res = await apiFetch(
                // `${BASE_URL}/recommendations?limit=50&seed_artists=&seed_genres=classical&seed_tracks=&${getAudioFeaturesParams(audioFeatures)}`
                `${BASE_URL}/recommendations?seed_artists=&seed_genres=${
                  selectedGenres?.join?.(',') || ''
                }&seed_tracks=&limit=50${getAudioFeaturesParams(audioFeatures)}`
              )
              const result = await res.json()
              window.result = result
              setTracksList(result?.tracks || [])
              console.log({ result })
            }}
          >
            <SearchIcon fontSize="small" color="info" />
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="success"
            onClick={play}
          >
            <PlayArrowIcon fontSize="small" color="success" />
          </Button>
        </Stack>
        <AudioFeaturesFilters />
        <Genres />
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
function Tracks() {
  const [tracks] = useAtom(currentTracksList)

  return (
    <>
      {tracks.map(t => (
        <ListItem
          style={{
            marginBottom: '4px',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingTop: '4px',
            paddingBottom: '4px',
            width: '95%',
            borderRadius: '10px',
            textAlign: 'start',
            background: '#0e0e0e',
            border: '1px solid #171717',
          }}
          key={t.id}
        >
          <Stack fontSize={'.8rem'} direction="column" width="400px">
            <Typography variant="body2">{t.name}</Typography>
            <Typography
              fontSize={'.6rem'}
              variant="caption"
              sx={{ color: '#b3b3b3' }}
              color="text.secondary"
            >
              {t.artists.map(({ name }) => name).join(',')}
            </Typography>
          </Stack>
        </ListItem>
      ))}
    </>
  )
}
function Genres() {
  const [genres] = useAtom(genresAtom)
  const [selectedGenres, setSelectedGenres] = useAtom(selectedGenresAtom)
  const [isOpen, setOpen] = useState(false)
  return (
    <>
      <Button
        onClick={() => {
          setOpen(!isOpen)
        }}
        variant="text"
        color="info"
      >
        Genres
      </Button>

      <Collapse in={isOpen}>
        <Stack direction="row" maxWidth="100%" flexWrap={'wrap'}>
          {genres?.map?.(g => (
            <Chip
              key={g}
              label={g}
              color={selectedGenres.includes(g) ? 'success' : 'default'}
              onClick={() => {
                selectedGenres.includes(g)
                  ? setSelectedGenres(
                      selectedGenres.filter(selected => selected !== g)
                    )
                  : setSelectedGenres([...selectedGenres, g])
              }}
            ></Chip>
          ))}
        </Stack>
      </Collapse>
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
    <Stack direction="column" spacing={0} alignItems="center">
      <Typography component={'h5'} margin={0}>
        Recommendation
      </Typography>
      <List>
        <RecommendationHeader />
        <Tracks />
      </List>
    </Stack>
  )
}
