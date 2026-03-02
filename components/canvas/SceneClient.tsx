'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { HoverBalloon } from '@/components/ui/HoverBalloon'
import { SplashScreen } from '@/components/ui/SplashScreen'
import { BackgroundMusicSource } from './BackgroundMusicSource'
import { useSolarStore } from '@/lib/store/useSolarStore'

const Scene = dynamic(
  () => import('./Scene').then((m) => m.Scene),
  { ssr: false }
)

export function SceneClient() {
  const splashDismissed = useSolarStore((s) => s.splashDismissed)
  const [texturesLoading, setTexturesLoading] = useState(false)

  useEffect(() => {
    const manager = THREE.DefaultLoadingManager
    const prevStart = manager.onStart
    const prevLoad = manager.onLoad
    const prevError = manager.onError

    manager.onStart = (...args) => {
      setTexturesLoading(true)
      prevStart?.(...args)
    }
    manager.onLoad = () => {
      setTexturesLoading(false)
      prevLoad?.()
    }
    manager.onError = (...args) => {
      setTexturesLoading(false)
      prevError?.(...args)
    }

    return () => {
      manager.onStart = prevStart
      manager.onLoad = prevLoad
      manager.onError = prevError
    }
  }, [])

  return (
    <>
      {splashDismissed && <Scene />}
      <BackgroundMusicSource />
      <HoverBalloon />
      {!splashDismissed && <SplashScreen texturesLoading={texturesLoading} />}
    </>
  )
}
