import { Drawer, IconButton, Stack } from '@mui/material'
import { AppProvider } from './AppProvider'
import { Likes } from './screens/Likes/Likes'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import HomeIcon from '@mui/icons-material/Home'
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil'
import { currScreenState } from './state/atoms'
import { SCREENS } from './consts'
import { Playing } from './screens/Playing/Playing'
import { Suspense } from 'react'
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
    default:
      return <Playing />
  }
}
function Bootstrap() {
  return (
    <AppProvider>
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
    </AppProvider>
  )
}

export default Bootstrap
