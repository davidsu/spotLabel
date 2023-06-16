import { Stack, Button, TextField } from '@mui/material'
import { useContext } from 'react'
import { appContext } from '../../AppProvider'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useTracks } from '../../selectors'
import { apiFetch, BASE_URL } from '../../api/utils'
import { home } from '../../tokenFlow'
import { clearCache } from '../../cache'
import { useQuery } from '@tanstack/react-query'
import { getUser } from '../../api'

const useGetUser = () => {
  const { data } = useQuery(['user_'], () => getUser())
  return data
}

const usePlayCurrentItems = () => {
  const tracks = useTracks()
  const { user } = useGetUser()
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
export const Header = () => {
  const { search, setSearch } = useContext(appContext)

  const playCurrentItems = usePlayCurrentItems()
  return (
    <>
      <h5 style={{ textAlign: 'center', margin: '0' }}>Likes</h5>
      <Stack
        paddingX={5}
        spacing={3}
        direction="row"
        justifyContent="space-around"
        alignSelf={'center'}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            localStorage.clear()
            //@ts-ignore
            clearCache()
            //@ts-ignore
            window.location = home
          }}
        >
          Restart
        </Button>
        <TextField
          fullWidth
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button
          size="small"
          variant="outlined"
          color="success"
          sx={{ marginTop: '2px' }}
          onClick={playCurrentItems}
        >
          <PlayArrowIcon fontSize="small" color="success" />
        </Button>
      </Stack>
    </>
  )
}
