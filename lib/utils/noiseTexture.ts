import * as THREE from 'three'

/** Seeded RNG for deterministic permutation */
function createSeededRandom(seed: number) {
  return function next() {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

/** 2D Perlin noise: builds perm table from seed, returns noise in ~[-1, 1] */
function createPerlin2D(seed: number) {
  const rand = createSeededRandom(seed)
  const perm = new Uint8Array(512)
  for (let i = 0; i < 256; i++) perm[i] = i
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[perm[i], perm[j]] = [perm[j], perm[i]]
  }
  for (let i = 0; i < 256; i++) perm[256 + i] = perm[i]

  const grad = [
    [1, 1], [-1, 1], [1, -1], [-1, -1],
    [1, 0], [-1, 0], [0, 1], [0, -1],
  ]

  function fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  return function (x: number, y: number): number {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    const xf = x - Math.floor(x)
    const yf = y - Math.floor(y)
    const u = fade(xf)
    const v = fade(yf)
    const aa = perm[perm[X] + Y] % 8
    const ab = perm[perm[X] + Y + 1] % 8
    const ba = perm[perm[X + 1] + Y] % 8
    const bb = perm[perm[X + 1] + Y + 1] % 8
    const n00 = grad[aa][0] * xf + grad[aa][1] * yf
    const n10 = grad[ba][0] * (xf - 1) + grad[ba][1] * yf
    const n01 = grad[ab][0] * xf + grad[ab][1] * (yf - 1)
    const n11 = grad[bb][0] * (xf - 1) + grad[bb][1] * (yf - 1)
    const nx0 = (1 - u) * n00 + u * n10
    const nx1 = (1 - u) * n01 + u * n11
    return (1 - v) * nx0 + v * nx1
  }
}

let cached: THREE.DataTexture | null = null

/**
 * Returns a shared grayscale texture using 2D Perlin noise.
 * Use with meshStandardMaterial as map; set material color for tinting.
 */
export function getNoiseTexture(): THREE.DataTexture {
  if (cached) return cached

  const size = 256
  const data = new Uint8Array(size * size * 4)
  const perlin = createPerlin2D(12345)
  const scale = 10 // frequency: how many "hills" across the texture

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const x = (px / size) * scale
      const y = (py / size) * scale
      const n = perlin(x, y)
      // Perlin is ~[-1,1]; map to [0.5, 1] for subtle variation
      const t = (n + 1) * 0.5
      const v = Math.floor(128 + t * 127)
      const i = (py * size + px) * 4
      data[i] = v
      data[i + 1] = v
      data[i + 2] = v
      data[i + 3] = 255
    }
  }

  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  tex.needsUpdate = true
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  cached = tex
  return tex
}
