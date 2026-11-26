'use client';

import React, { useEffect, useRef } from 'react';
import { CONTACT } from '@/lib/constants';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = '1'; io.disconnect(); } },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

const GLASS: React.CSSProperties = {
  padding: '44px 42px',
  background: 'rgba(255,248,240,0.045)',
  backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)',
  borderRadius: 26,
  border: '1px solid transparent',
  borderTop: '1px solid rgba(255,245,235,0.16)',
  boxShadow: '0 30px 80px rgba(0,0,0,0.36)',
};

export function Practitioner() {
  const headRef   = useReveal();
  const contentRef = useReveal();

  return (
    <section
      id="sec7"
      style={{ position: 'relative', padding: '13vh 8vw' }}
      aria-label="The practitioner"
    >
      <div
        ref={headRef}
        style={{ opacity: 0, transition: 'opacity 2s ease-out', textAlign: 'center', marginBottom: '6vh' }}
      >
        <p style={{ fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(233,207,168,0.78)', marginBottom: 16, margin: '0 0 16px' }}>
          The practitioner
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(28px, 4vw, 48px)', margin: 0, color: '#efe6d8' }}>
          Meet Disha.
        </h2>
      </div>

      <div
        ref={contentRef}
        style={{
          opacity: 0, transition: 'opacity 2s ease-out',
          maxWidth: 720, margin: '0 auto',
        }}
      >
        {/* Bio */}
        <div style={GLASS}>
          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(233,207,168,0.78)', margin: '0 0 14px' }}>
            {CONTACT.practitioner} · {CONTACT.city}
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(22px, 2.4vw, 30px)', lineHeight: 1.45, color: '#ece3d6', margin: '0 0 22px' }}>
            A space for tired souls to breathe again.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(233,224,212,0.78)', margin: '0 0 14px' }}>
            I&apos;m Disha, a Reiki Master-Teacher, dietitian and yoga coach. I bring all three into the room: energy work to help you let go, breath and movement to steady you, and a practical eye on how you look after your body day to day.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(233,224,212,0.78)', margin: '0 0 26px' }}>
            I&apos;m based in Vadodara and see people online from across India and around the world, in English or Hindi. You don&apos;t need to know anything about Reiki to begin. You just need to show up.
          </p>
          <div style={{
            fontSize: 12, letterSpacing: '0.06em',
            color: 'rgba(233,224,212,0.6)', lineHeight: 1.9,
            borderTop: '1px solid rgba(233,224,212,0.1)', paddingTop: 18,
          }}>
            Reiki Master-Teacher (Levels 1, 2, 3 &amp; Master) · Dietitian · Yoga Coach
          </div>
        </div>
      </div>
    </section>
  );
}
