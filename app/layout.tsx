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
  title:       { default: 'Karmlin — Online Reiki with Disha Pandya', template: '%s | Karmlin' },
  description: 'Online Reiki and energy healing with Disha Pandya, Reiki Master-Teacher in Vadodara. Live on Google Meet in English or Hindi, ₹499 per session, for clients in India and worldwide. Free 15-minute chat to start.',
  keywords:    ['online reiki', 'reiki vadodara', 'distance reiki', 'reiki healing india', 'reiki master', 'learn reiki', 'chakra balancing', 'energy healing', 'reiki in hindi'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://karmlin.vercel.app'),
  openGraph: {
    type:        'website',
    locale:      'en_IN',
    siteName:    'Karmlin',
    title:       'Karmlin — Online Reiki with Disha Pandya',
    description: 'Online Reiki and energy healing with Disha Pandya, Reiki Master-Teacher in Vadodara. Live on Google Meet in English or Hindi, ₹499 per session, for clients in India and worldwide. Free 15-minute chat to start.',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Karmlin — Online Reiki with Disha Pandya',
    description: "Online Reiki and energy healing with Disha Pandya, Reiki Master-Teacher in Vadodara. Live on Google Meet in English or Hindi, ₹499 per session, for clients in India and worldwide. Free 15-minute chat to start.",
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
