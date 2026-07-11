'use client';

import React, { useEffect, useRef, useState } from 'react';
import { VOICES } from '@/lib/constants';

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

export function Voices() {
  const headRef = useReveal();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section
      id="sec6"
      style={{ position: 'relative', padding: '13vh 8vw', overflow: 'hidden' }}
      aria-label="Testimonials"
    >
      <div
        ref={headRef}
        style={{ opacity: 0, transition: 'opacity 2s ease-out', textAlign: 'center', marginBottom: 18 }}
      >
        <p style={{ fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(233,207,168,0.78)', marginBottom: 16, margin: '0 0 16px' }}>
          Voices
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(28px, 4vw, 48px)', margin: 0, color: '#efe6d8' }}>
          Move close to listen.
        </h2>
      </div>
      {!isMobile && (
        <p style={{ textAlign: 'center', margin: '0 auto 6vh', fontSize: 13, color: 'rgba(233,224,212,0.62)', letterSpacing: '0.04em' }}>
          Hover a light to hear from the person inside it.
        </p>
      )}

      {isMobile ? (
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 480, margin: '0 auto' }}
          role="list"
          aria-label="Testimonials"
        >
          {VOICES.map((v) => (
            <div
              key={v.id}
              role="listitem"
              style={{
                background: 'rgba(255,248,240,0.045)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 20,
                border: '1px solid transparent',
                borderTop: '1px solid rgba(255,245,235,0.15)',
                padding: '22px 24px',
              }}
            >
              <blockquote style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 21, lineHeight: 1.45, fontWeight: 300, color: '#efe6d8',
                margin: '0 0 14px',
              }}>
                "{v.quote}"
              </blockquote>
              <cite style={{
                fontStyle: 'normal',
                fontSize: 11, letterSpacing: '0.13em', textTransform: 'uppercase',
                color: 'rgba(233,207,168,0.72)',
              }}>
                {v.name} · {v.service}
              </cite>
            </div>
          ))}
        </div>
      ) : (
        <div
          id="orbfield"
          style={{ position: 'relative', height: '62vh', maxWidth: 1100, margin: '0 auto' }}
          role="list"
          aria-label="Testimonials"
        >
          {VOICES.map((v) => (
            <OrbTestimonial key={v.id} voice={v} />
          ))}
        </div>
      )}
    </section>
  );
}

type Voice = typeof VOICES[number];

function OrbTestimonial({ voice: v }: { voice: Voice }) {
  const orbRef  = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  const show = () => {
    if (!coreRef.current || !quoteRef.current || !orbRef.current) return;
    coreRef.current.style.opacity   = '0';
    coreRef.current.style.transform = 'scale(1.6)';
    quoteRef.current.style.opacity  = '1';
    orbRef.current.style.zIndex     = '5';
  };
  const hide = () => {
    if (!coreRef.current || !quoteRef.current || !orbRef.current) return;
    coreRef.current.style.opacity   = '1';
    coreRef.current.style.transform = 'scale(1)';
    quoteRef.current.style.opacity  = '0';
    orbRef.current.style.zIndex     = '1';
  };

  return (
    <div
      ref={orbRef}
      className="orb"
      role="listitem"
      style={{
        position: 'absolute',
        left: v.pos.left, top: v.pos.top,
        width: v.size, height: v.size,
        willChange: 'transform',
        zIndex: 1,
      }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <div
        ref={coreRef}
        className="orbcore"
        tabIndex={0}
        aria-label={`${v.name} — ${v.service}`}
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 35%, rgba(255,248,240,0.09), rgba(233,207,168,0.04) 55%, transparent 72%)',
          border: '1px solid rgba(255,245,235,0.14)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
          transition: 'opacity 1.2s ease-out, transform 1.4s ease-out',
          cursor: 'pointer', outline: 'none',
        }}
        onFocus={show}
        onBlur={hide}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') show(); }}
      >
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 18, color: 'rgba(233,224,212,0.82)' }}>{v.name}</span>
        <span style={{ fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(233,207,168,0.78)' }}>{v.service}</span>
      </div>

      <div
        ref={quoteRef}
        className="orbquote"
        aria-live="polite"
        style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%,-50%)',
          width: 300, opacity: 0,
          transition: 'opacity 1.4s ease-out',
          pointerEvents: 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          textAlign: 'center',
        }}
      >
        <blockquote style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 23, lineHeight: 1.4, fontWeight: 300, color: '#efe6d8',
          margin: 0,
        }}>
          "{v.quote}"
        </blockquote>
        <cite style={{
          fontStyle: 'normal',
          fontSize: 11, letterSpacing: '0.13em', textTransform: 'uppercase',
          color: 'rgba(233,207,168,0.72)',
        }}>
          {v.name} · {v.service} · {v.location}
        </cite>
      </div>
    </div>
  );
}
