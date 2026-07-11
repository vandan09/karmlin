'use client';

import React from 'react';

export function EnergyFlow() {
  return (
    <section
      id="sec3"
      style={{ position: 'relative', height: '260vh' }}
      aria-label="How energy moves"
    >
      <div
        id="sec3visual"
        style={{
          position: 'sticky', top: 0, height: '100vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-start',
          paddingTop: '8vh', boxSizing: 'border-box',
        }}
      >
        <div style={{ textAlign: 'center', flex: '0 0 auto', marginBottom: '1vh' }}>
          <p style={{
            fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'rgba(233,207,168,0.78)', marginBottom: 16, margin: '0 0 16px',
          }}>
            How energy moves
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300, fontSize: 'clamp(30px, 4.4vw, 52px)',
            margin: 0, color: '#efe6d8', letterSpacing: '0.01em',
          }}>
            It knows where to go.
          </h2>
        </div>

        <div style={{ position: 'relative', width: 'min(1100px, 90vw)', flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* The canvas in HeroField.tsx draws into this slot */}
          <div id="fig-slot" style={{ position: 'relative', width: 320, height: 'calc(100vh - 200px)' }} aria-hidden="true" />

          {[
            { top: '24%', text: 'Energy enters at the crown and flows down.' },
            { top: '47%', text: 'It meets the tension knotted in your chest.' },
            { top: '70%', text: 'It warms it, loosens it — and you settle.' },
          ].map(({ top, text }, i) => (
            <div key={i} className="figtext-wrap" style={{ position: 'absolute', left: '6%', top, maxWidth: '15em' }}>
              <p
                className="figline"
                style={{
                  opacity: 0, transition: 'opacity 1.1s ease-out',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(23px, 2.7vw, 35px)',
                  fontWeight: 300, lineHeight: 1.35,
                  color: '#eee4d6', margin: 0,
                }}
              >
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
