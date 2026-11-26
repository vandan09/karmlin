'use client';

import dynamic from 'next/dynamic';
import { Exhale }      from '@/components/sections/Exhale';
import { EnergyFlow }  from '@/components/sections/EnergyFlow';
import { SessionFlow } from '@/components/sections/SessionFlow';
import { FAQ }         from '@/components/sections/FAQ';
import { Pricing }     from '@/components/sections/Pricing';
import { VOICES }      from '@/lib/constants';

// Client-only lazy sections (canvas / intersection observers)
const Offerings    = dynamic(() => import('@/components/sections/Offerings').then(m => ({ default: m.Offerings })),       { ssr: false });
const Voices       = dynamic(() => import('@/components/sections/Voices').then(m => ({ default: m.Voices })),             { ssr: false });
const Practitioner = dynamic(() => import('@/components/sections/Practitioner').then(m => ({ default: m.Practitioner })), { ssr: false });
const HeroField    = dynamic(() => import('@/components/hero/HeroField').then(m => ({ default: m.HeroField })),           { ssr: false });

export function PageClient() {
  return (
    <>
      <HeroField />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Exhale />
        <EnergyFlow />
        <Offerings />
        <SessionFlow />
        <Practitioner />
        <Pricing />
        {VOICES.length > 0 && <Voices />}
        <FAQ />
      </main>
    </>
  );
}
