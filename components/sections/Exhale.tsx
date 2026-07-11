'use client';

import React, { useEffect, useRef } from 'react';

export function Exhale() {
  const ref = useRef<HTMLParagraphElement>(null);

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

  return (
    <section
      style={{ minHeight: '78vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8vw' }}
      aria-label="Opening message"
    >
      <p
        ref={ref}
        style={{
          opacity: 0,
          transition: 'opacity 2.4s ease-out',
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: 'clamp(30px, 5vw, 62px)',
          lineHeight: 1.35,
          textAlign: 'center',
          color: '#ece3d6',
          maxWidth: '16em',
          letterSpacing: '0.01em',
          margin: 0,
          textWrap: 'balance',
        } as React.CSSProperties}
      >
        You weren't meant to carry all of it.
      </p>
    </section>
  );
}
