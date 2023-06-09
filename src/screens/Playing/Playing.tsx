import { useRecoilValue } from 'recoil'
import { currPlayerState } from '../../state/atoms'

export function Playing() {
  const playerState = useRecoilValue(currPlayerState)
  console.log({playerState})
  return <h5 style={{ textAlign: 'center', margin: '0' }}>Playing</h5>
}
