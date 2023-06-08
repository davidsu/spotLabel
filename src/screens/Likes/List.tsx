import { List, ListItem, Stack, Typography, Box, Tooltip } from '@mui/material'
import { useTracks } from '../../selectors'
import { AudioFeaturesInfo } from './AudioFeatures'

export const LikesList = () => {
  const tracks = useTracks()
  return (
    <List dense>
      {tracks.map(t => (
        <ListItem
          style={{
            marginBottom: '4px',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingTop: '4px',
            paddingBottom: '4px',
            width: '95%',
            borderRadius: '10px',
            textAlign: 'start',
            background: '#0e0e0e',
            border: '1px solid #171717'
          }}
          key={t.id}
        >
          <Stack fontSize={'.8rem'} direction="column" width="400px">
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
          <AudioFeaturesInfo track={t} />
          <Box margin="auto" />
          <Box maxWidth="30%">
            {t.labels
              .filter(l => !!l)
              .map((i: any) => {
                return (
                  <Tooltip title={i.name || 'boo'} placement="top">
                    <img
                      style={{ height: '20px', width: '20px' }}
                      src={i.images?.[0]?.url}
                    />
                  </Tooltip>
                )
              })}
          </Box>
        </ListItem>
      ))}
    </List>
  )
}
