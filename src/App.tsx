import {
  Avatar,
  Box,
  Chip,
  CssBaseline,
  List,
  ListItem,
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
import { FC, useContext } from 'react'
import { appContext, AppProvider } from './AppProvider'
import { useTracks } from './selectors'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()
const AppList = () => {
  const tracks = useTracks()
  const theme = useTheme()
  console.log({ theme })
  return (
    <List dense>
      {tracks.map((t, idx) => (
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
          key={idx}
        >
          <Stack fontSize={'.8rem'} direction="column">
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
          <Box margin="auto" />
          <Box>
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
const App: FC = () => {
  return (
    <>
      <AppHeader />
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
