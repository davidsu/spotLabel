import { Drawer, IconButton, Stack } from '@mui/material'
import { Likes } from './screens/Likes/Likes'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import HomeIcon from '@mui/icons-material/Home'
import {
  useRecoilState,
} from 'recoil'
import { currScreenState } from './state/atoms'
import { SCREENS } from './consts'
import { Playing } from './screens/Playing/Playing'
import { Suspense, useEffect } from 'react'
import { getAuthorizationCode, getToken } from './tokenFlow'
import { Recommendation } from './screens/Recommendation/Recommendation'
import SearchIcon from '@mui/icons-material/Search'
function Navigation() {
  const [_, setCurrentScreen] = useRecoilState(currScreenState)

  return (
    <Stack
      alignItems="center"
      direction="row"
      justifyContent="center"
      spacing={8}
    >
      <IconButton onClick={() => setCurrentScreen(SCREENS.home)}>
        <HomeIcon fontSize="small" />
      </IconButton>
      <IconButton onClick={() => setCurrentScreen(SCREENS.likes)}>
        <FavoriteIcon fontSize="small" />
      </IconButton>
      <IconButton onClick={() => setCurrentScreen(SCREENS.recommendation)}>
        <SearchIcon fontSize="small" />
      </IconButton>
      <IconButton onClick={() => setCurrentScreen(SCREENS.artists)}>
        <PeopleOutlineIcon fontSize="small" />
      </IconButton>
    </Stack>
  )
}
function Artists() {
  return <h1>Artists</h1>
}

function CurrentScreen() {
  const [currentScreen] = useRecoilState(currScreenState)
  switch (currentScreen) {
    case SCREENS.home:
      return <Playing />
    case SCREENS.likes:
      return <Likes />
    case SCREENS.artists:
      return <Artists />
    case SCREENS.recommendation:
      return <Recommendation />
    default:
      return <Playing />
  }
}
let firstLoad = true
const useWhaat = () =>
  useEffect(() => {
    if (!firstLoad) return
    firstLoad = false
    if (localStorage.getItem('access-token')) return
    if (/accept/.test(window.location.pathname)) {
      getToken()
    } else {
      getAuthorizationCode()
    }
  }, [])

function Bootstrap() {
  useWhaat()
  return (
    <>
      <Drawer
        open
        variant="permanent"
        anchor="bottom"
        sx={{
          '& .MuiDrawer-paper': {
            // width: '40px'
          },
        }}
      >
        <Navigation />
      </Drawer>
      <Suspense>
        <CurrentScreen />
      </Suspense>
    </>
  )
}

export default Bootstrap
