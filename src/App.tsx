import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Avatar,
  Box,
  Button,
  Chip,
  CssBaseline,
  List,
  ListItem,
  Stack,
  TextField,
} from '@mui/material'
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'
import { FC, ReactNode, useContext } from 'react'
import { appContext, AppProvider } from './AppProvider'
import { useTracks } from './selectors'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()
const AppList = () => {
  const tracks = useTracks()
  return (
    <List>
      {tracks.map((t, idx) => (
        <ListItem style={{ textAlign: 'start' }} key={idx}>
          <Box>{t.name}</Box>
          <Box margin="auto" />
          <Box>
            {t.labels.map((i: any) => (
              <Chip
                avatar={<Avatar src={i.images[0].url} />}
                label={i.name}
                sx={{ margin: '5px', padding:'5px' }}
              />
            ))}
          </Box>
        </ListItem>
      ))}
    </List>
  )
}
const AppHeader = () => {
  const { labels } = useContext(appContext)
  return (
    <Autocomplete
      multiple
      open
      renderInput={params => (
        <TextField
          {...params}
          variant="standard"
          label="Multiple values"
          placeholder="Favorites"
        />
      )}
      options={labels.map(l => ({...l, label: l.name}))}
      renderOption={(props, t) => {
        console.log(props)
        return <Chip avatar={<Avatar  src={t.images[0].url}/>} label={t.name} sx={{marginRight:'10px'}} />}}
    />
  )
}
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
