'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FAQ_ITEMS } from '@/lib/constants';

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

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const ref = useReveal();

  const toggle = (i: number) => setOpenIdx(prev => prev === i ? null : i);

  return (
    <section
      id="sec8"
      style={{ position: 'relative', padding: '13vh 8vw' }}
      aria-label="Frequently asked questions"
    >
      <div
        ref={ref}
        style={{ opacity: 0, transition: 'opacity 2s ease-out', maxWidth: 760, margin: '0 auto' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '6vh' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(233,207,168,0.78)', marginBottom: 16, margin: '0 0 16px' }}>
            Questions
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(28px, 4vw, 48px)', margin: 0, color: '#efe6d8' }}>
            The ones people actually ask.
          </h2>
        </div>

        <div id="faqlist" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} role="list">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen  = openIdx === i;
            const panelId = `faq-panel-${i}`;
            const btnId   = `faq-btn-${i}`;

            return (
              <div
                key={i}
                role="listitem"
                style={{
                  background: 'rgba(255,248,240,0.04)',
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: 18,
                  border: '1px solid transparent',
                  borderTop: '1px solid rgba(255,245,235,0.14)',
                  overflow: 'hidden',
                }}
              >
                <button
                  id={btnId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                  style={{
                    width: '100%',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20,
                    padding: '24px 28px',
                    cursor: 'pointer',
                    background: 'none', border: 'none',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 22, fontWeight: 300, color: '#efe6d8',
                    textAlign: 'left',
                    outline: 'none',
                  }}
                  onFocus={e =>    { e.currentTarget.style.outline = '2px solid rgba(233,207,168,0.4)'; e.currentTarget.style.outlineOffset = '-2px'; }}
                  onBlur={e =>     { e.currentTarget.style.outline = 'none'; }}
                >
                  <span>{item.q}</span>
                  <span
                    aria-hidden="true"
                    style={{
                      fontSize: 22, color: 'rgba(233,207,168,0.7)',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 0.9s ease-out',
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  style={{
                    maxHeight: isOpen ? 300 : 0,
                    opacity: isOpen ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 1s ease-out, opacity 1s ease-out',
                  }}
                >
                  <p style={{ margin: 0, padding: '0 28px 26px', fontSize: 15, lineHeight: 1.75, color: 'rgba(233,224,212,0.82)' }}>
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
