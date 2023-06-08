import { FC } from 'react'
import {AudioFeaturesPicker} from './AudioFeatures'
import {Header} from './Header'
import {LikesList} from './List'


export const Likes: FC = () => {
  return (
    <>
      <Header />
      <AudioFeaturesPicker />
      <LikesList />
    </>
  )
}
