import {
  Avatar,
  Box,
  Chip,
  CssBaseline,
  List,
  ListItem,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  createTheme,
  ThemeOptions,
  ThemeProvider,
  useTheme,
} from '@mui/material/styles'
import { FC, useContext, useState } from 'react'
import { appContext, AppProvider } from './AppProvider'
import { useTracks } from './selectors'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()
const AudioFeatures = ({ track }: any) => (
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
const AppList = () => {
  const tracks = useTracks()
  const theme = useTheme()
  return (
    <List dense>
      {tracks.slice(0,200).map((t, idx) => (
        <ListItem
          style={{
            marginBottom: '16px',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '95%',
            borderRadius: '10px',
            textAlign: 'start',
            background: '#292727',
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
          <AudioFeatures track={t} />
          <Box margin="auto" />
          <Box maxWidth="30%">
            {t.labels
              .filter(l => !!l)
              .map((i: any) => {
                return (
                  <Chip
                    avatar={
                      <Avatar variant="square" src={i.images?.[0]?.url} />
                    }
                    variant="outlined"
                    label={i.name}
                    size="small"
                    sx={{ margin: '5px', padding: '5px' }}
                  />
                )
              })}
          </Box>
        </ListItem>
      ))}
    </List>
  )
}

const AppHeader = () => {
  const { search, setSearch } = useContext(appContext)
  return (
    <Box width="100%" textAlign="center">
      <TextField
        sx={{ width: '80%', margin: 'auto' }}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
    </Box>
  )
}
// const AppHeader = () => {
//   const { labels } = useContext(appContext)
//   return (
//     <Autocomplete
//       multiple
//       open
//       renderInput={params => (
//         <TextField
//           {...params}
//           variant="standard"
//           label="Multiple values"
//           placeholder="Favorites"
//         />
//       )}
//       options={labels.map(l => ({...l, label: l.name}))}
//       renderOption={(props, t) => {
//         console.log(props)
//         return <Chip avatar={<Avatar  src={t.images[0].url}/>} label={t.name} sx={{marginRight:'10px'}} />}}
//     />
//   )
// }
const AudioFeaturesPicker = () => {
    const { audioFeaturesFilters, setAudioFeatureFilters } =
    useContext(appContext)


  const onChange = (event: Event, newValue: any) => {
    setAudioFeatureFilters({energy: newValue as [number, number]})
  }

  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      justifyContent="center"
    >
      <Typography color={t.palette.secondary.main} fontSize={'10px'}>
        energy:
      </Typography>

      <Stack width="200px" alignItems="center">
        <Slider color="secondary" size="small" onChange={onChange} value={audioFeaturesFilters.energy || [0,100]} />
      </Stack>
    </Stack>
  )
}

const App: FC = () => {
  return (
    <>
      <AppHeader />
      <AudioFeaturesPicker />
      <AppList />
    </>
  )
}

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
}

const t = createTheme(themeOptions)
function Bootstrap() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={t}>
        <CssBaseline />
        <AppProvider>
          <App />
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default Bootstrap
