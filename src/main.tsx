import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './App'
import { refreshToken } from './tokenFlow'

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
const render = () => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  )
}
if (localStorage.getItem('refresh-token')) {
  refreshToken().then(render)
} else render()
