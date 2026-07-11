import type { Metadata } from 'next';
import { Cormorant_Garamond, Karla } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['300', '400', '500'],
  style:    ['normal', 'italic'],
  variable: '--font-cormorant',
  display:  'swap',
});

const karla = Karla({
  subsets:  ['latin'],
  weight:   ['300', '400', '500'],
  variable: '--font-karla',
  display:  'swap',
});

export const metadata: Metadata = {
  title:       { default: 'Karmlin — Energy Healing & Meditation', template: '%s | Karmlin' },
  description: 'Reiki, sound bath, chakra balancing, breathwork and distance healing sessions. A free 15-minute conversation to start.',
  keywords:    ['reiki', 'sound bath', 'chakra balancing', 'breathwork', 'meditation', 'energy healing'],
  openGraph: {
    type:        'website',
    locale:      'en_US',
    siteName:    'Karmlin',
    title:       'Karmlin — Energy Healing & Meditation',
    description: 'Reiki, sound bath, chakra balancing, breathwork and distance healing sessions. A free 15-minute conversation to start.',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Karmlin — Energy Healing & Meditation',
    description: 'Reiki, sound bath, chakra balancing, breathwork and distance healing sessions.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${karla.variable}`}>
      <body>{children}</body>
    </html>
  );
}
