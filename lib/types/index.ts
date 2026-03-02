export interface Curiosidade {
  texto: string
}

export interface PlanetData {
  id: string
  nome: string
  apelido: string
  distanciaDaSol: string
  tamanhoRelativo: string
  temperatura: string
  curiosidades: Curiosidade[]
  textura: string
  orbitRadius: number
  orbitSpeed: number
  selfRotationSpeed: number
  /** Orbital inclination relative to ecliptic plane, in radians. Used in Lúdico mode. */
  orbitInclination?: number
  size: number
  tilt: number
  hasRings: boolean
  ringTexture?: string
  ringInnerRadius?: number
  ringOuterRadius?: number
  /** Optional ring opacity (0–1). Used for subtler rings e.g. Uranus. */
  ringOpacity?: number
  /** Optional tint color (e.g. darker) applied to rings. */
  ringTint?: string
  moons: string[]
  cor: string
  /** Optional audio URL; when set, the audio player is shown when this body is selected. */
  audio?: string
}

export interface MoonData {
  id: string
  nome: string
  apelido: string
  parentId: string
  textura: string
  cor: string
  orbitRadius: number
  orbitSpeed: number
  size: number
  tilt: number
  temperatura: string
  curiosidades: Curiosidade[]
  /** Optional audio URL; when set, the audio player is shown when this body is selected. */
  audio?: string
}

export interface SunData {
  id: 'sun'
  nome: string
  apelido: string
  diametro: string
  massa: string
  temperatura: string
  idade: string
  cor: string
  curiosidades: Curiosidade[]
  /** Optional audio URL; when set, the audio player is shown when this body is selected. */
  audio?: string
}

export type SelectedBodyType = 'sun' | 'planet' | 'moon'

export interface SelectedBody {
  type: SelectedBodyType
  id: string
}

export type OrbitMode = 'real' | 'ludico'

export interface SolarStoreState {
  selectedBody: SelectedBody | null
  /** The body selected before the current one — used for back-navigation (e.g. moon → planet) */
  previousBody: SelectedBody | null
  /** Set by sidebar only; drives camera focus/zoom on menu hover */
  hoveredBody: SelectedBody | null
  /** Set by canvas and sidebar; drives hover balloon only (no camera focus) */
  tooltipBody: SelectedBody | null
  selectBody: (type: SelectedBodyType, id: string) => void
  setHoveredBody: (body: SelectedBody | null) => void
  setTooltipBody: (body: SelectedBody | null) => void
  clearSelection: () => void
  simulationSpeed: number
  setSimulationSpeed: (speed: number) => void
  orbitMode: OrbitMode
  setOrbitMode: (mode: OrbitMode) => void
  backgroundMusicPlaying: boolean
  backgroundMusicVolume: number
  setBackgroundMusicPlaying: (playing: boolean) => void
  setBackgroundMusicVolume: (volume: number) => void
  introComplete: boolean
  setIntroComplete: () => void
  splashDismissed: boolean
  dismissSplash: () => void
}
