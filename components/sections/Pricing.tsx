'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CONTACT, OFFER } from '@/lib/constants';
import { BookingModal } from '@/components/ui/BookingModal';

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
  background: 'rgba(255,248,240,0.045)',
  backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)',
  borderRadius: 26,
  border: '1px solid transparent',
  borderTop: '1px solid rgba(255,245,235,0.16)',
  boxShadow: '0 30px 80px rgba(0,0,0,0.36)',
};

const STEPS = [
  { n: '01', title: 'Send a message', body: `DM “HEAL” on Instagram${CONTACT.whatsapp ? ' or say hi on WhatsApp' : ''}.` },
  { n: '02', title: 'Free 15-minute chat', body: 'We talk about what you are carrying and pick a time in your time zone.' },
  { n: '03', title: 'Your session', body: 'Join from home on Google Meet. Lie down, breathe, and let go.' },
];

export function Pricing() {
  const ref = useReveal();
  const [open, setOpen] = useState(false);

  return (
    <>
      <section id="pricing" style={{ position: 'relative', padding: '13vh 8vw' }} aria-label="Price and booking">
        <div ref={ref} style={{ opacity: 0, transition: 'opacity 2s ease-out', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '6vh' }}>
            <p style={{ fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(233,207,168,0.78)', margin: '0 0 16px' }}>
              Online sessions
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(30px, 4.4vw, 52px)', margin: 0, color: '#efe6d8' }}>
              Healing from wherever you are.
            </h2>
          </div>

          <div style={{ ...GLASS, padding: 'clamp(30px, 5vw, 52px)', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(54px, 8vw, 84px)', color: '#f4ecdd', lineHeight: 1 }}>
              {OFFER.price}
            </div>
            <div style={{ fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(233,224,212,0.62)', margin: '10px 0 26px' }}>
              {OFFER.priceNote}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 34 }}>
              {[OFFER.where, OFFER.languages, OFFER.reach, 'Free 15-min chat first'].map(t => (
                <span key={t} style={{
                  padding: '8px 16px', borderRadius: 20, fontSize: 13.5,
                  background: 'rgba(233,207,168,0.1)', border: '1px solid rgba(233,207,168,0.22)', color: '#e9d6b4',
                }}>
                  {t}
                </span>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 22, textAlign: 'left', marginBottom: 36 }}>
              {STEPS.map(s => (
                <div key={s.n}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: 'rgba(233,207,168,0.7)', marginBottom: 6 }}>{s.n}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 23, color: '#efe6d8', marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(233,224,212,0.72)' }}>{s.body}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setOpen(true)}
              style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 22, letterSpacing: '0.04em',
                color: '#1a1310', background: 'rgba(233,207,168,0.9)',
                border: 'none', padding: '16px 46px', borderRadius: 40, cursor: 'pointer',
              }}
            >
              Book your free chat
            </button>
          </div>
        </div>
      </section>
      <BookingModal open={open} onClose={() => setOpen(false)} carrying={[]} />
    </>
  );
}
