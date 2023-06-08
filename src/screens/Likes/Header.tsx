import { Box as Stack, Button, TextField } from '@mui/material'
import { useContext } from 'react'
import { appContext } from '../../AppProvider'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useTracks } from '../../selectors'
import { apiFetch, BASE_URL } from '../../api/utils'

const usePlayCurrentItems = () => {
  const tracks = useTracks()
  const { user } = useContext(appContext)
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
        uris: tracks.map(track => track.uri)
      }),
    })
    console.log({playlist})
    // const playerState = await apiFetch(`${BASE_URL}/me/player`)
    apiFetch(`${BASE_URL}/me/player/play`, {
      method: 'PUT',
      body: JSON.stringify({context_uri: playlist.uri}),
    })
  }
}
export const Header = () => {
  const { search, setSearch } = useContext(appContext)

  const playCurrentItems = usePlayCurrentItems()
  return (
    <Stack textAlign="center" alignSelf={'center'}>
      <TextField
        size="small"
        sx={{ minWidth: '87%', marginRight: '6px' }}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <Button
        size="large"
        variant="outlined"
        color="success"
        sx={{ marginTop: '2px' }}
        onClick={playCurrentItems}
      >
        <PlayArrowIcon fontSize="small" color="success" />
      </Button>
    </Stack>
  )
}
