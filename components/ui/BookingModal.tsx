'use client';

import React, { useEffect, useRef, useState, useId } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  carrying: string[];
}

type Status = 'idle' | 'loading' | 'success' | 'error';

interface FormErrors {
  name?: string;
  contact?: string;
}

const GLASS: React.CSSProperties = {
  background: 'rgba(34,27,23,0.66)',
  backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
  border: '1px solid transparent',
  borderTop: '1px solid rgba(255,245,235,0.2)',
  boxShadow: '0 40px 110px rgba(0,0,0,0.5)',
};

export function BookingModal({ open, onClose, carrying }: Props) {
  const [name,    setName]    = useState('');
  const [contact, setContact] = useState('');
  const [errors,  setErrors]  = useState<FormErrors>({});
  const [status,  setStatus]  = useState<Status>('idle');

  const nameId    = useId();
  const contactId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstRef  = useRef<HTMLInputElement>(null);

  // Focus trap + restore focus on close
  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement;
    // defer so the dialog is in DOM
    const t = setTimeout(() => firstRef.current?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, input, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      prevFocus?.focus?.();
    };
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else      document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!name.trim()) e.name = 'Please enter your name.';
    if (!contact.trim()) {
      e.contact = 'Please enter an email or phone number.';
    } else if (contact.includes('@')) {
      // email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
        e.contact = 'Please enter a valid email address.';
      }
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setErrors({});
    setStatus('loading');
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), contact: contact.trim(), carrying }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '15px 18px',
    background: 'rgba(255,248,240,0.05)',
    border: '1px solid rgba(233,224,212,0.14)',
    borderRadius: 14,
    color: '#efe6d8',
    fontFamily: "'Karla', sans-serif", fontSize: 15,
    outline: 'none',
  };
  const errorStyle: React.CSSProperties = {
    fontSize: 12.5, color: 'rgba(255,160,130,0.9)', marginTop: 4,
  };

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
        style={{
          position: 'relative', width: 'min(480px, 100%)',
          padding: '44px 42px 38px',
          borderRadius: 28,
          ...GLASS,
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close booking form"
          style={{
            position: 'absolute', top: 22, right: 24,
            background: 'none', border: 'none',
            fontSize: 22, color: 'rgba(233,224,212,0.5)',
            cursor: 'pointer', lineHeight: 1,
            outline: 'none',
          }}
          onFocus={e =>  { e.currentTarget.style.color = 'rgba(233,224,212,0.9)'; }}
          onBlur={e =>   { e.currentTarget.style.color = 'rgba(233,224,212,0.5)'; }}
        >
          ×
        </button>

        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 34, color: '#f4ecdd', marginBottom: 8 }}>
          Begin.
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(233,224,212,0.62)', margin: '0 0 26px' }}>
          A free 15-minute conversation. We'll see if it's a fit. No commitment either way.
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
                  background: 'rgba(233,207,168,0.14)',
                  border: '1px solid rgba(233,207,168,0.25)',
                  fontFamily: "'Cormorant Garamond', serif", fontSize: 16,
                  color: '#e9d6b4', textTransform: 'capitalize',
                }}>
                  {w}
                </span>
              ))}
            </div>
          </div>
        )}

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: '#efe6d8', marginBottom: 12 }}>
              Sent, softly.
            </div>
            <p style={{ fontSize: 14, color: 'rgba(233,224,212,0.62)' }}>
              We'll be in touch within 24 hours to find a time that works.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label htmlFor={nameId} className="sr-only">Your name</label>
              <input
                id={nameId}
                ref={firstRef}
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
                style={{
                  ...inputStyle,
                  borderColor: errors.name ? 'rgba(255,160,130,0.5)' : 'rgba(233,224,212,0.14)',
                }}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `${nameId}-err` : undefined}
                onFocus={e =>  { e.currentTarget.style.borderColor = 'rgba(233,207,168,0.4)'; }}
                onBlur={e =>   { e.currentTarget.style.borderColor = errors.name ? 'rgba(255,160,130,0.5)' : 'rgba(233,224,212,0.14)'; }}
              />
              {errors.name && (
                <div id={`${nameId}-err`} role="alert" style={errorStyle}>{errors.name}</div>
              )}
            </div>

            <div>
              <label htmlFor={contactId} className="sr-only">Email or phone</label>
              <input
                id={contactId}
                type="text"
                placeholder="Email or phone"
                value={contact}
                onChange={e => { setContact(e.target.value); setErrors(prev => ({ ...prev, contact: undefined })); }}
                style={{
                  ...inputStyle,
                  borderColor: errors.contact ? 'rgba(255,160,130,0.5)' : 'rgba(233,224,212,0.14)',
                }}
                aria-invalid={!!errors.contact}
                aria-describedby={errors.contact ? `${contactId}-err` : undefined}
                onFocus={e =>  { e.currentTarget.style.borderColor = 'rgba(233,207,168,0.4)'; }}
                onBlur={e =>   { e.currentTarget.style.borderColor = errors.contact ? 'rgba(255,160,130,0.5)' : 'rgba(233,224,212,0.14)'; }}
              />
              {errors.contact && (
                <div id={`${contactId}-err`} role="alert" style={errorStyle}>{errors.contact}</div>
              )}
            </div>

            {status === 'error' && (
              <div role="alert" style={{ ...errorStyle, marginTop: 0 }}>
                Something went wrong. Please try again or email hello@karmlin.studio directly.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                marginTop: 6, width: '100%', padding: 16,
                border: 'none', borderRadius: 14,
                background: status === 'loading' ? 'rgba(233,207,168,0.5)' : 'rgba(233,207,168,0.9)',
                color: '#1a1310',
                fontFamily: "'Cormorant Garamond', serif", fontSize: 20,
                letterSpacing: '0.04em',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                transition: 'background 0.9s ease-out',
                outline: 'none',
              }}
              onFocus={e =>    { if (status !== 'loading') e.currentTarget.style.background = 'rgba(242,227,196,1)'; }}
              onBlur={e =>     { if (status !== 'loading') e.currentTarget.style.background = 'rgba(233,207,168,0.9)'; }}
              onMouseEnter={e => { if (status !== 'loading') e.currentTarget.style.background = 'rgba(242,227,196,1)'; }}
              onMouseLeave={e => { if (status !== 'loading') e.currentTarget.style.background = 'rgba(233,207,168,0.9)'; }}
            >
              {status === 'loading' ? 'Sending…' : 'Send, softly'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
