import type { Metadata } from 'next'
import { Pacifico, Ubuntu } from 'next/font/google'
import './globals.css'

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pacifico',
  display: 'swap',
})

const ubuntu = Ubuntu({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-ubuntu',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sistema Solar — Explore o Espaço',
  description: 'Explore os planetas do Sistema Solar em 3D de forma interativa e divertida!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${pacifico.variable} ${ubuntu.variable}`}>
      <body className="antialiased" style={{ fontFamily: 'var(--font-ubuntu), sans-serif' }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
