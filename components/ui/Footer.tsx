'use client';

import React, { useState, useEffect } from 'react';
import { BookingModal } from './BookingModal';
import { CONTACT } from '@/lib/constants';

export function Footer() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <>
      <footer
        style={{
          position: 'relative', zIndex: 2,
          padding: '6vh 8vw',
          display: 'flex', flexWrap: 'wrap', gap: 24,
          justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid rgba(233,224,212,0.08)',
        }}
      >
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 19, letterSpacing: '0.14em',
          color: 'rgba(239,230,216,0.8)',
        }}>
          KARMLIN
          <span style={{ display: 'block', fontFamily: "'Karla', sans-serif", fontSize: 11.5, letterSpacing: '0.08em', color: 'rgba(233,224,212,0.5)', marginTop: 6 }}>
            Reiki with {CONTACT.practitioner} · {CONTACT.city} &amp; online
          </span>
        </span>
        <div style={{ display: 'flex', flexWrap: isMobile ? 'wrap' : 'nowrap', gap: isMobile ? 14 : 26, alignItems: 'center', fontSize: 13, color: 'rgba(233,224,212,0.68)' }}>
          {CONTACT.whatsapp && (
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'rgba(233,224,212,0.68)', textDecoration: 'none' }}
            >
              WhatsApp
            </a>
          )}
          {CONTACT.email && (
            <a href={`mailto:${CONTACT.email}`} style={{ color: 'rgba(233,224,212,0.68)', textDecoration: 'none' }}>
              {CONTACT.email}
            </a>
          )}
          <a
            href={`https://instagram.com/${CONTACT.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(233,224,212,0.68)', textDecoration: 'none' }}
            aria-label="Karmlin on Instagram"
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f2e3c4'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(233,224,212,0.68)'; }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5.5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/>
            </svg>
            @{CONTACT.instagram}
          </a>
          <button
            onClick={() => setOpen(true)}
            style={{
              fontFamily: "'Karla', sans-serif",
              fontSize: 13, letterSpacing: '0.06em',
              color: '#1a1310',
              background: 'rgba(233,207,168,0.9)',
              border: 'none', padding: '10px 22px',
              borderRadius: 30, cursor: 'pointer',
              whiteSpace: 'nowrap',
              outline: 'none',
              ...(isMobile ? { flex: '1 1 100%', textAlign: 'center' } : {}),
            }}
            onFocus={e =>    { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(233,207,168,0.8)'; }}
            onBlur={e =>     { e.currentTarget.style.boxShadow = 'none'; }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(242,227,196,1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(233,207,168,0.9)'; }}
          >
            Book a session
          </button>
        </div>
      </footer>
      <BookingModal open={open} onClose={() => setOpen(false)} carrying={[]} />
    </>
  );
}
