'use client'

import dynamic from 'next/dynamic'
import { Loader } from '@/components/ui/Loader'
import { HoverBalloon } from '@/components/ui/HoverBalloon'
import { BackgroundMusicSource } from './BackgroundMusicSource'

const Scene = dynamic(
  () => import('./Scene').then((m) => m.Scene),
  { ssr: false, loading: () => <Loader /> }
)

export function SceneClient() {
  return (
    <>
      <Scene />
      <BackgroundMusicSource />
      <HoverBalloon />
    </>
  )
}
