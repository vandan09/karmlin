'use client';

import React, { useEffect, useState } from 'react';
import { SESSION_STAGES } from '@/lib/constants';

export function SessionFlow() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section
      id="sec5"
      style={{ position: 'relative', height: '420vh' }}
      aria-label="What a session feels like"
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'stretch' }}>
        {/* Canvas draws into this half */}
        <div id="sec5visual" className="sec5-visual" style={{ flex: 1, position: 'relative' }} aria-hidden="true" />

        <div
          className="sec5-text-col"
          style={{
            flex: 1, position: 'relative', display: 'flex',
            alignItems: isMobile ? 'flex-start' : 'center',
            padding: isMobile ? '88px 8vw 0' : '0 6vw 0 3vw',
          }}
        >
          <div style={{ maxWidth: isMobile ? '100%' : '26em' }}>
            <p style={{
              fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase',
              color: 'rgba(233,207,168,0.78)', margin: '0 0 40px',
            }}>
              What a session feels like
            </p>
            {SESSION_STAGES.map((stage, i) => (
              <div
                key={i}
                className="stageblock"
                style={{ opacity: 0.25, transition: 'opacity 1.2s ease-out', padding: '18px 0' }}
              >
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: isMobile ? 'clamp(24px, 6vw, 32px)' : 'clamp(26px, 3vw, 38px)',
                  fontWeight: 300, color: '#efe6d8', margin: '0 0 8px',
                }}>
                  {stage.label}
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(233,224,212,0.78)', margin: 0 }}>
                  {stage.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
