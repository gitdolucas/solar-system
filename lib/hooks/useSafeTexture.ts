'use client'

import { useState, useEffect } from 'react'
import * as THREE from 'three'

const loader = new THREE.TextureLoader()
const cache = new Map<string, THREE.Texture | null>()

/**
 * Loads a texture without throwing on 404.
 * Returns the texture if loaded, or null if it fails.
 * Uses a module-level cache to avoid re-fetching.
 */
export function useSafeTexture(url: string): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(() => {
    return cache.get(url) ?? null
  })

  useEffect(() => {
    if (cache.has(url)) {
      queueMicrotask(() => setTexture(cache.get(url) ?? null))
      return
    }

    loader.load(
      url,
      (tex) => {
        cache.set(url, tex)
        setTexture(tex)
      },
      undefined,
      () => {
        // Silently fall back to null — no texture, use color instead
        cache.set(url, null)
        setTexture(null)
      }
    )
  }, [url])

  return texture
}
