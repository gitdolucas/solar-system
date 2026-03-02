import type { SunData } from '@/lib/types'

export const SUN: SunData = {
  id: 'sun',
  nome: 'Sol',
  apelido: 'A Estrela da Nossa Vida',
  diametro: '1.392.700 km',
  massa: '333.000× a Terra',
  temperatura: '5.500°C na superfície',
  idade: '4,6 bilhões de anos',
  cor: '#f5a623',
  audio: '/audio/audio-sol.mp3',
  curiosidades: [
    { texto: 'O Sol representa 99,86% de toda a massa do Sistema Solar!' },
    { texto: 'A luz do Sol leva 8 minutos e 20 segundos para chegar à Terra.' },
    { texto: 'O Sol é tão grande que cabem 1,3 milhão de Terras dentro dele.' },
    { texto: 'A temperatura no núcleo do Sol chega a 15 milhões de graus Celsius!' },
    { texto: 'O Sol está a meio caminho de sua vida — ainda vai brilhar por mais 5 bilhões de anos.' },
  ],
}
