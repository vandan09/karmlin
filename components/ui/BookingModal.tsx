'use client';

import React, { useEffect, useRef } from 'react';
import { CONTACT, OFFER } from '@/lib/constants';

interface Props {
  open: boolean;
  onClose: () => void;
  carrying: string[];
  /** Optional service the visitor clicked on, e.g. "Reiki". */
  topic?: string;
}

const GLASS: React.CSSProperties = {
  background: 'rgba(34,27,23,0.66)',
  backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
  border: '1px solid transparent',
  borderTop: '1px solid rgba(255,245,235,0.2)',
  boxShadow: '0 40px 110px rgba(0,0,0,0.5)',
};

export function buildMessage(topic?: string, carrying: string[] = []) {
  let msg = `Hi Disha, I found Karmlin and would like to book a free 15-min chat`;
  if (topic) msg += ` about ${topic}`;
  msg += '.';
  if (carrying.length) msg += ` Lately I'm carrying: ${carrying.join(', ')}.`;
  return msg;
}

export function contactLinks(topic?: string, carrying: string[] = []) {
  const msg = buildMessage(topic, carrying);
  return {
    instagram: `https://ig.me/m/${CONTACT.instagram}`,
    instagramProfile: `https://instagram.com/${CONTACT.instagram}`,
    whatsapp: CONTACT.whatsapp ? `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}` : '',
    call: CONTACT.whatsapp ? `tel:+${CONTACT.whatsapp}` : '',
    email: CONTACT.email ? `mailto:${CONTACT.email}?subject=${encodeURIComponent('Karmlin session')}&body=${encodeURIComponent(msg)}` : '',
  };
}

function prettyPhone(n: string) {
  if (n.startsWith('91') && n.length === 12) return `+91 ${n.slice(2, 7)} ${n.slice(7)}`;
  return `+${n}`;
}

const btnBase: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  width: '100%', boxSizing: 'border-box', padding: '15px 18px',
  borderRadius: 14, textDecoration: 'none',
  fontFamily: "'Karla', sans-serif", fontSize: 15, letterSpacing: '0.02em',
  transition: 'background 0.6s ease-out',
};
const primary: React.CSSProperties = { ...btnBase, background: 'rgba(233,207,168,0.9)', color: '#1a1310' };
const secondary: React.CSSProperties = {
  ...btnBase, background: 'rgba(255,248,240,0.05)', color: '#efe6d8',
  border: '1px solid rgba(233,224,212,0.14)',
};

export function BookingModal({ open, onClose, carrying, topic }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstRef  = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement;
    const t = setTimeout(() => firstRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>('a, button');
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); prevFocus?.focus?.(); };
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const links = contactLinks(topic, carrying);
  const hasPhone = !!CONTACT.whatsapp;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        background: 'rgba(16,12,11,0.55)',
        backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Book a session"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        style={{ position: 'relative', width: 'min(480px, 100%)', padding: '44px 38px 34px', borderRadius: 28, ...GLASS }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 22, right: 24, background: 'none', border: 'none',
            fontSize: 22, color: 'rgba(233,224,212,0.5)', cursor: 'pointer', lineHeight: 1,
          }}
        >
          ×
        </button>

        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 34, color: '#f4ecdd', marginBottom: 8 }}>
          Begin{topic ? ` with ${topic}` : ''}.
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(233,224,212,0.7)', margin: '0 0 6px' }}>
          Message {CONTACT.practitioner.split(' ')[0]} directly. Start with a free 15-minute chat. No commitment either way.
        </p>
        <p style={{ fontSize: 12.5, letterSpacing: '0.04em', color: 'rgba(233,207,168,0.8)', margin: '0 0 24px' }}>
          {OFFER.price} {OFFER.priceNote} · {OFFER.where} · {OFFER.languages}
        </p>

        {carrying.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(233,207,168,0.6)', marginBottom: 12 }}>
              You're carrying
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
              {carrying.map(w => (
                <span key={w} style={{
                  padding: '7px 15px', borderRadius: 20,
                  background: 'rgba(233,207,168,0.14)', border: '1px solid rgba(233,207,168,0.25)',
                  fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: '#e9d6b4', textTransform: 'capitalize',
                }}>
                  {w}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {hasPhone && (
            <a ref={firstRef} href={links.whatsapp} target="_blank" rel="noopener noreferrer" style={primary}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/>
              </svg>
              Chat on WhatsApp
            </a>
          )}
          <a
            ref={hasPhone ? undefined : firstRef}
            href={links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            style={hasPhone ? secondary : primary}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4"/>
              <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/>
            </svg>
            DM “HEAL” on Instagram
          </a>
          {hasPhone && (
            <a href={links.call} style={secondary}>
              Call {prettyPhone(CONTACT.whatsapp)}
            </a>
          )}
          {links.email && (
            <a href={links.email} style={{ ...secondary, fontSize: 14 }}>
              {CONTACT.email}
            </a>
          )}
        </div>

        <p style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(233,224,212,0.5)', margin: '20px 0 0', textAlign: 'center' }}>
          Disha replies personally · India &amp; worldwide
        </p>
      </div>
    </div>
  );
}
