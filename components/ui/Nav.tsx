'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookingModal } from './BookingModal';

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 22, left: '50%', transform: 'translateX(-50%)',
          zIndex: 7, display: 'flex', alignItems: 'center', gap: 40,
          padding: '12px 16px 12px 28px',
          background: 'rgba(255,248,240,0.045)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 40,
          border: '1px solid transparent',
          borderTop: '1px solid rgba(255,245,235,0.16)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        }}
        aria-label="Main navigation"
      >
        <Link
          href="/"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20, letterSpacing: '0.14em',
            color: '#efe6d8', textDecoration: 'none',
          }}
          aria-label="KARMLIN — home"
        >
          KARMLIN
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="nav-book-btn"
          style={{
            fontFamily: "'Karla', sans-serif",
            fontSize: 13, letterSpacing: '0.08em',
            color: '#1a1310',
            background: 'rgba(233,207,168,0.9)',
            border: 'none', padding: '11px 22px',
            borderRadius: 30, cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'background 0.9s ease-out, box-shadow 0.9s ease-out',
            outline: 'none',
          }}
          onFocus={e =>    { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(233,207,168,0.8)'; }}
          onBlur={e =>     { e.currentTarget.style.boxShadow = 'none'; }}
          onMouseEnter={e => {
            e.currentTarget.style.background  = 'rgba(242,227,196,1)';
            e.currentTarget.style.boxShadow   = '0 0 24px rgba(233,207,168,0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background  = 'rgba(233,207,168,0.9)';
            e.currentTarget.style.boxShadow   = 'none';
          }}
        >
          Book a session
        </button>
      </nav>
      <BookingModal open={open} onClose={() => setOpen(false)} carrying={[]} />
    </>
  );
}
