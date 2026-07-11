'use client';

import React, { useEffect, useRef, useState } from 'react';
import { OFFERINGS } from '@/lib/constants';
import { BookingModal } from '@/components/ui/BookingModal';

// ─── Icon SVGs keyed by offering id ──────────────────────────────────────────
const OfferingIcons: Record<string, React.ReactElement> = {
  reiki: (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none"
         stroke="rgba(233,207,168,0.8)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 18.5C7 14 9.2 12.4 12 12.4C14.8 12.4 17 14 17 18.5"/>
      <path d="M12 9.8V6"/><path d="M8.9 10.3L7.2 7.4"/><path d="M15.1 10.3L16.8 7.4"/>
    </svg>
  ),
  'sound-bath': (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none"
         stroke="rgba(233,207,168,0.8)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 13C5 16.6 8.1 18.6 12 18.6C15.9 18.6 19 16.6 19 13"/>
      <path d="M4.2 13H19.8"/>
      <path d="M9 9.4C10.8 8.2 13.2 8.2 15 9.4"/>
      <path d="M7.4 6.7C10.2 4.9 13.8 4.9 16.6 6.7"/>
    </svg>
  ),
  meditation: (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none"
         stroke="rgba(233,207,168,0.8)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="6.2" r="2.3"/>
      <path d="M5.4 18.6C7 13.8 17 13.8 18.6 18.6"/>
      <path d="M7.8 12.8C9.6 15.2 14.4 15.2 16.2 12.8"/>
    </svg>
  ),
  breathwork: (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none"
         stroke="rgba(233,207,168,0.8)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="2.3"/>
      <path d="M12 9.7V4.4M12 9.7L10 6.4M12 9.7L14 6.4" opacity="0.9"/>
      <circle cx="12" cy="12" r="6" opacity="0.55"/>
      <circle cx="12" cy="12" r="9.4" opacity="0.28"/>
    </svg>
  ),
  chakra: (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="rgba(233,207,168,0.8)" stroke="none" aria-hidden="true">
      {[3.6,7.2,10.8,14.4,18,21.6].map(cy => <circle key={cy} cx="12" cy={cy} r="1.1"/>)}
      <circle cx="8.6" cy="12" r="1.1"/><circle cx="15.4" cy="12" r="1.1"/>
    </svg>
  ),
  distance: (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none"
         stroke="rgba(233,207,168,0.8)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7" cy="12" r="1.7" fill="rgba(233,207,168,0.8)" stroke="none"/>
      <path d="M11 8.3A5 5 0 0 1 11 15.7"/>
      <path d="M14 6.3A8 8 0 0 1 14 17.7" opacity="0.6"/>
      <path d="M17 4.5A11 11 0 0 1 17 19.5" opacity="0.32"/>
    </svg>
  ),
};

const CARD_STYLE: React.CSSProperties = {
  position: 'relative', padding: '34px 32px 30px',
  background: 'rgba(255,248,240,0.045)',
  backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)',
  borderRadius: 22,
  border: '1px solid transparent',
  borderTop: '1px solid rgba(255,245,235,0.16)',
  boxShadow: '0 24px 65px rgba(0,0,0,0.34)',
  willChange: 'transform',
  transition: 'box-shadow 1s ease-out',
  overflow: 'hidden',
};

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

export function Offerings() {
  const [open, setOpen] = useState(false);
  const headRef = useReveal();

  return (
    <>
      <section
        id="sec4"
        style={{ position: 'relative', padding: '13vh 8vw' }}
        aria-label="What we offer"
      >
        <div
          ref={headRef}
          style={{ opacity: 0, transition: 'opacity 2s ease-out', textAlign: 'center', marginBottom: '6vh' }}
        >
          <p style={{ fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(233,207,168,0.78)', marginBottom: 16, margin: '0 0 16px' }}>
            What we offer
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(30px, 4.4vw, 52px)', margin: 0, color: '#efe6d8', letterSpacing: '0.01em' }}>
            Ways in.
          </h2>
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 26, maxWidth: 1100, margin: '0 auto' }}
          role="list"
        >
          {OFFERINGS.map(o => (
            <article key={o.id} style={CARD_STYLE} role="listitem">
              <div style={{
                width: 54, height: 54, borderRadius: '50%',
                background: 'rgba(255,248,240,0.05)',
                border: '1px solid transparent',
                borderTop: '1px solid rgba(255,245,235,0.16)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 24,
              }}>
                {OfferingIcons[o.id]}
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 27, margin: '0 0 12px', color: '#efe6d8' }}>
                {o.name}
              </h3>
              <p style={{ margin: '0 0 20px', fontSize: 14.5, lineHeight: 1.65, color: 'rgba(233,224,212,0.78)' }}>
                {o.desc}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, letterSpacing: '0.1em', color: 'rgba(233,224,212,0.62)' }}>{o.duration}</span>
                <button
                  onClick={() => setOpen(true)}
                  style={{
                    background: 'none', border: 'none', padding: 0,
                    fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                    fontSize: 18, color: '#e6cfa8', cursor: 'pointer',
                    outline: 'none',
                  }}
                  onFocus={e =>    { e.currentTarget.style.color = '#f2e3c4'; }}
                  onBlur={e =>     { e.currentTarget.style.color = '#e6cfa8'; }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f2e3c4'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#e6cfa8'; }}
                  aria-label={`Begin ${o.name} — open booking form`}
                >
                  Begin
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <BookingModal open={open} onClose={() => setOpen(false)} carrying={[]} />
    </>
  );
}
