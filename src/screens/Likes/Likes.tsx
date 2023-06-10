import { FC } from 'react'
import { AppProvider } from '../../AppProvider'
import { AudioFeaturesPicker } from './AudioFeatures'
import { Header } from './Header'
import { LikesList } from './List'

export const Likes: FC = () => {
  return (
    <AppProvider>
      <>
        <Header />
        <AudioFeaturesPicker />
        <LikesList />
      </>
    </AppProvider>
  )
}
