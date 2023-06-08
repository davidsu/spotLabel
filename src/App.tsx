import { CssBaseline } from '@mui/material'
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'
import { AppProvider } from './AppProvider'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Likes } from './screens/Likes/Likes'

const queryClient = new QueryClient()

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

const theme = createTheme(themeOptions)
function Bootstrap() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <h1>boo</h1>
        <AppProvider>
          <Likes />
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default Bootstrap
