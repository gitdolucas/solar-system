'use client'

import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Leva } from 'leva'
import * as THREE from 'three'
import { HoverBalloon } from '@/components/ui/HoverBalloon'
import { SplashScreen } from '@/components/ui/SplashScreen'
import { LandscapePrompt } from '@/components/ui/LandscapePrompt'
import { BackgroundMusicSource } from './BackgroundMusicSource'
import { useSolarStore } from '@/lib/store/useSolarStore'

const Scene = dynamic(
  () => import('./Scene').then((m) => m.Scene),
  { ssr: false }
)

export function SceneClient() {
  const pathname = usePathname()
  const router = useRouter()
  const isSimulationRoute = pathname === '/simulation'
  const [texturesLoading, setTexturesLoading] = useState(false)
  const dismissSplash = useSolarStore((s) => s.dismissSplash)

  useEffect(() => {
    if (isSimulationRoute) dismissSplash()
  }, [isSimulationRoute, dismissSplash])

  useEffect(() => {
    if (!isSimulationRoute) return
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
  }, [isSimulationRoute])

  if (isSimulationRoute) {
    return (
      <>
        <Leva collapsed />
        <Scene />
        <BackgroundMusicSource />
        <HoverBalloon />
        <LandscapePrompt />
      </>
    )
  }

  return (
    <>
      <Leva collapsed />
      <BackgroundMusicSource />
      <SplashScreen
        texturesLoading={texturesLoading}
        onDismiss={() => router.push('/simulation')}
      />
    </>
  )
}
