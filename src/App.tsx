import { Drawer, IconButton, Stack } from '@mui/material'
import { AppProvider } from './AppProvider'
import { Likes } from './screens/Likes/Likes'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
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
          <Stack alignItems="center" direction="row" justifyContent="center" spacing={8}>
            <IconButton>
              <FavoriteIcon fontSize="small" />
            </IconButton>
            <IconButton>
              <PeopleOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Drawer>
        <Likes />
      </>
    </AppProvider>
  )
}

export default Bootstrap
