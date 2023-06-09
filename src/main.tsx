import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'
import RecoilizeDebugger from 'recoilize';
import { CssBaseline } from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './App'
import { refreshToken } from './tokenFlow'
import {RecoilRoot} from 'recoil'

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
      <RecoilRoot>
      <RecoilizeDebugger />
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </QueryClientProvider>
      </RecoilRoot>
    </React.StrictMode>
  )
}
if (localStorage.getItem('refresh-token')) {
  refreshToken().then(render)
} else render()
