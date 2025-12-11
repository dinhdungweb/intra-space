import { Be_Vietnam_Pro, IBM_Plex_Sans, Inter, Nunito, Poppins, Public_Sans, Roboto } from 'next/font/google'

export const beVietnamPro = Be_Vietnam_Pro({
  variable: '--ins-font-sans-serif',
  subsets: ['latin', 'vietnamese'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const publicSans = Public_Sans({
  subsets: ['latin', 'vietnamese', 'latin-ext'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-public-sans',
})

export const nunito = Nunito({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext', 'vietnamese', 'latin-ext', 'cyrillic-ext'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900', '1000'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-nunito',
})

export const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-ibm-plex-sans',
  subsets: ['latin', 'greek', 'cyrillic-ext', 'cyrillic', 'vietnamese', 'latin-ext'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})
