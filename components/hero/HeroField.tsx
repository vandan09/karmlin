'use client';

/**
 * HeroField — isolated canvas animation island.
 *
 * ALL animation state lives in plain JS refs mutated inside a single rAF loop.
 * Nothing here re-renders due to outside state changes; the component itself
 * never calls setState after mount (except for `isReady` on first paint).
 *
 * Architecture:
 *   - One rAF loop driving: aurora blobs, dot field, cursor trail, word-card
 *     orbiting, wave fronts, shatter particles, icon lighting, chakra spine.
 *   - IntersectionObserver pauses the loop when the hero is off-screen.
 *   - Page Visibility API pauses the loop when the tab is hidden.
 *   - Dot count is capped based on screen area and devicePixelRatio.
 *   - prefers-reduced-motion: full alternate rendering path — static aurora,
 *     no particles, no card orbiting, gentle opacity fade-in only.
 */

import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { COLORS, TIMING, LAYOUT, WORD_CARDS } from '@/lib/constants';
import { BookingModal } from '@/components/ui/BookingModal';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Dot   { x: number; y: number; ph: number }
interface Card  {
  el: HTMLDivElement | null;
  word: string;
  angle: number;
  orbit: number;
  spin: number;
  gone: boolean;
  pass: number;
  seen: Set<number>;
  respawnAt: number;
  soft: number;
  jitter: number;
}
interface Wave  { id: number; born: number }
interface Particle {
  x: number; y: number;
  tx: number; ty: number;
  hesitate: number;
  outAng: number; outSpeed: number;
  curl: number; curlPh: number;
  life: number; max: number;
  delay: number; size: number;
}
interface AuroraBlobCfg {
  hue: readonly [number, number, number];
  ox: number; oy: number; r: number; sx: number; sy: number;
}

// ─── Easing helpers ───────────────────────────────────────────────────────────
const ease  = (t: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

// ─── Body-figure point cloud (generated once) ─────────────────────────────────
function makeBody() {
  const pts: Array<{ x: number; y: number; ph: number; sz: number; chest: boolean; spine: boolean }> = [];
  const cx = 0.5;
  const inBody = (x: number, y: number) => {
    const dx = x - cx;
    if (Math.hypot(dx / 0.066, (y - 0.095) / 0.078) < 1) return true;
    if (y > 0.16 && y < 0.20 && Math.abs(dx) < 0.026) return true;
    if (y >= 0.20 && y < 0.52) {
      const w = y < 0.37
        ? 0.14 - (y - 0.20) * 0.32
        : 0.086 + (y - 0.37) * 0.11;
      if (Math.abs(dx) < w) return true;
    }
    if (y > 0.22 && y < 0.51) {
      const armC = 0.152 + Math.sin((y - 0.22) / 0.29 * Math.PI) * 0.028;
      if (Math.abs(Math.abs(dx) - armC) < 0.026) return true;
    }
    if (y >= 0.52 && y < 0.96) {
      const legW = Math.max(0.03, 0.05 - (y - 0.52) * 0.03);
      if (Math.abs(Math.abs(dx) - 0.05) < legW) return true;
    }
    return false;
  };
  let tries = 0;
  while (pts.length < LAYOUT.figurePointCount && tries < 60000) {
    tries++;
    const x = Math.random(), y = Math.random();
    if (inBody(x, y)) {
      pts.push({
        x, y,
        ph: Math.random() * 6.28,
        sz: 1.3 + Math.random() * 0.7,
        chest: y > 0.26 && y < 0.37 && Math.abs(x - 0.5) < 0.075,
        spine: Math.abs(x - 0.5) < 0.02,
      });
    }
  }
  return pts;
}

const BODY_PTS = makeBody();

// ─── Session cloud (generated once) ──────────────────────────────────────────
const SESSION_PTS = Array.from({ length: LAYOUT.sessionCloudCount }, () => {
  const a = Math.random() * 6.28, rr = Math.sqrt(Math.random());
  return {
    rx: Math.random() - 0.5,
    ry: Math.random() - 0.5,
    ox: Math.cos(a) * 0.34 * rr,
    oy: (Math.random() - 0.5) * 0.7,
    ph: Math.random() * 6.28,
  };
});

// ─── Icon SVGs ────────────────────────────────────────────────────────────────
const ICON_SVGS: Record<string, React.ReactElement> = {
  Meditation: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
         stroke="rgba(233,207,168,0.75)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="6.2" r="2.3"/>
      <path d="M5.4 18.6C7 13.8 17 13.8 18.6 18.6"/>
      <path d="M7.8 12.8C9.6 15.2 14.4 15.2 16.2 12.8"/>
    </svg>
  ),
  Chakra: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="rgba(233,207,168,0.75)" stroke="none">
      {[3.6,7.2,10.8,14.4,18,21.6].map(cy => <circle key={cy} cx="12" cy={cy} r="1.1"/>)}
      <circle cx="8.6" cy="12" r="1.1"/><circle cx="15.4" cy="12" r="1.1"/>
    </svg>
  ),
  Reiki: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
         stroke="rgba(233,207,168,0.75)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 18.5C7 14 9.2 12.4 12 12.4C14.8 12.4 17 14 17 18.5"/>
      <path d="M12 9.8V6"/><path d="M8.9 10.3L7.2 7.4"/><path d="M15.1 10.3L16.8 7.4"/>
    </svg>
  ),
  Distance: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
         stroke="rgba(233,207,168,0.75)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="12" r="1.7" fill="rgba(233,207,168,0.75)" stroke="none"/>
      <path d="M11 8.3A5 5 0 0 1 11 15.7"/>
      <path d="M14 6.3A8 8 0 0 1 14 17.7" opacity="0.6"/>
      <path d="M17 4.5A11 11 0 0 1 17 19.5" opacity="0.32"/>
    </svg>
  ),
  Breathwork: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
         stroke="rgba(233,207,168,0.75)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2.3"/>
      <path d="M12 9.7V4.4M12 9.7L10 6.4M12 9.7L14 6.4" opacity="0.9"/>
      <circle cx="12" cy="12" r="6" opacity="0.55"/>
      <circle cx="12" cy="12" r="9.4" opacity="0.28"/>
    </svg>
  ),
};
const ICON_LABELS = ['Meditation', 'Chakra', 'Reiki', 'Distance', 'Breathwork'] as const;

// ─── Component ────────────────────────────────────────────────────────────────
export function HeroField() {
  const [modalOpen, setModalOpen] = useState(false);
  const [carrying,  setCarrying]  = useState<string[]>([]);

  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const cardRefs     = useRef<Array<HTMLDivElement | null>>([]);
  const iconRefs     = useRef<Array<HTMLDivElement | null>>([]);
  const dotRefs      = useRef<Array<HTMLDivElement | null>>([]);   // chakra spine dots
  const heroRef      = useRef<HTMLElement>(null);

  // Animation state — plain refs, never triggers React renders
  const rafRef       = useRef<number>(0);
  const dotsRef      = useRef<Dot[]>([]);
  const cardsRef     = useRef<Card[]>([]);
  const wavesRef     = useRef<Wave[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef     = useRef({ x: 0, y: 0 });
  const trailRef     = useRef<Array<{ x: number; y: number; born: number }>>([]);
  const lastMoveRef  = useRef(0);
  const lastWaveRef  = useRef(-TIMING.waveInterval + 2);
  const waveIdRef    = useRef(0);
  const flareRef     = useRef(0);
  const nowRef       = useRef(0);
  const pausedRef    = useRef(false);
  const reducedRef   = useRef(false);
  const sizeRef      = useRef({ W: 0, H: 0, dpr: 1 });

  // Stable callbacks so animation loop never closes over stale react state
  const openModal  = useCallback(() => setModalOpen(true),  []);

  const addCarry   = useCallback((word: string) => {
    setCarrying(prev => prev.includes(word) ? prev : [...prev, word]);
  }, []);

  // Build canvas + init dots
  const initDots = useCallback((W: number, H: number, dpr: number, density: number) => {
    // Cap dot count for performance: limit to ~800 on small/high-dpr screens
    const sp = LAYOUT.dotSpacing / density;
    const raw: Dot[] = [];
    for (let y = sp / 2; y < H; y += sp)
      for (let x = sp / 2; x < W; x += sp)
        raw.push({ x, y, ph: Math.random() * 6.28 });
    // Hard cap scaled by screen area to maintain 60fps on mid-range phones
    const areaFactor = Math.min(1, (W * H) / (1440 * 900));
    const cap = Math.round(600 * areaFactor + 200);
    dotsRef.current = raw.length > cap
      ? raw.filter((_, i) => i % Math.ceil(raw.length / cap) === 0)
      : raw;
  }, []);

  // Shatter: spawn particles from a screen-space point, converging to hero centre
  const shatter = useCallback((sx: number, sy: number, hard: boolean) => {
    if (reducedRef.current) return;
    const { W, H } = sizeRef.current;
    const heroCY = heroRef.current
      ? heroRef.current.getBoundingClientRect().top + Math.min(heroRef.current.getBoundingClientRect().height, H) * 0.5
      : H * 0.5;
    const n = hard ? TIMING.particleHardCount : TIMING.particleSoftCount;
    for (let k = 0; k < n; k++) {
      const a = Math.random() * 6.28;
      const outSpeed = (hard ? 8 : 14) + Math.random() * 18;
      particlesRef.current.push({
        x: sx + (Math.random() - 0.5) * 40,
        y: sy + (Math.random() - 0.5) * 24,
        tx: W / 2, ty: heroCY,
        hesitate:  hard ? 0.1 + Math.random() * 0.25 : 0.4 + Math.random() * 0.9,
        outAng: a, outSpeed,
        curl: (Math.random() - 0.5) * 2.2, curlPh: Math.random() * 6.28,
        life: 0, max: (hard ? 3.2 : 5.5) + Math.random() * 2.5,
        delay: Math.random() * (hard ? 0.3 : 1.1),
        size: 1 + Math.random() * 1.6,
      });
    }
  }, []);

  // ─── Main rAF draw loop ────────────────────────────────────────────────────
  const startRef = useRef(0);

  const draw = useCallback((nowMs: number) => {
    if (pausedRef.current) {
      rafRef.current = requestAnimationFrame(draw);
      return;
    }
    try {
      const cv  = canvasRef.current;
      if (!cv) return;
      const ctx = cv.getContext('2d')!;
      if (!startRef.current) startRef.current = nowMs;
      const t   = (nowMs - startRef.current) / 1000;
      nowRef.current = t;

      const { W, H, dpr } = sizeRef.current;
      const cyc     = t % TIMING.breathTotal;
      let breath = cyc < TIMING.breathIn
        ? ease(cyc / TIMING.breathIn)
        : 1 - ease((cyc - TIMING.breathIn) / TIMING.breathOut);
      if (reducedRef.current) breath = 0.5 + 0.5 * Math.sin(t * 0.25) * 0.5;

      ctx.clearRect(0, 0, W, H);

      const heroEl   = heroRef.current;
      const hr       = heroEl?.getBoundingClientRect();
      const heroCY   = hr ? hr.top + Math.min(hr.height, H) * 0.5 : H * 0.5;
      const cx       = W / 2;
      const scrollP  = clamp(window.scrollY / Math.max(1, document.body.scrollHeight - H), 0, 1);

      // ── Aurora blobs (additive) ────────────────────────────────────────────
      ctx.globalCompositeOperation = 'lighter';
      for (const b of COLORS.auroraBlobs as readonly AuroraBlobCfg[]) {
        const dr  = reducedRef.current ? 0 : 1;
        const bx  = (b.ox + Math.sin(t * b.sx) * 0.05 * dr) * W;
        const by  = (b.oy + Math.cos(t * b.sy) * 0.05 * dr) * H;
        const rad = b.r * Math.min(W, H) * (0.9 + 0.1 * breath);
        const g   = ctx.createRadialGradient(bx, by, 0, bx, by, rad);
        const [r, gr, bl] = b.hue;
        const al  = 0.08 * TIMING.auroraIntensity * (0.85 + 0.3 * breath);
        g.addColorStop(0, `rgba(${r},${gr},${bl},${al})`);
        g.addColorStop(1, `rgba(${r},${gr},${bl},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.globalCompositeOperation = 'source-over';

      // ── Dot field ─────────────────────────────────────────────────────────
      for (const d of dotsRef.current) {
        let a = 0.14 + 0.05 * Math.sin(t * 0.4 + d.ph) * (reducedRef.current ? 0.3 : 1);
        if (heroCY > -H && heroCY < H * 1.5) {
          const dd = Math.hypot(d.x - cx, d.y - heroCY);
          a += Math.max(0, 1 - dd / 300) * 0.22 * (0.6 + 0.4 * breath);
        }
        ctx.fillStyle = `rgba(233,216,196,${a})`;
        ctx.fillRect(d.x - 0.9, d.y - 0.9, 1.8, 1.8);
      }

      // ── Cursor trail ──────────────────────────────────────────────────────
      if (!reducedRef.current) {
        trailRef.current = trailRef.current.filter(p => t - p.born < 1.2);
        for (const p of trailRef.current) {
          const a = (1 - (t - p.born) / 1.2) * 0.3;
          ctx.fillStyle = `rgba(233,207,168,${a})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 6.28); ctx.fill();
        }
      }

      // ── Hero section ───────────────────────────────────────────────────────
      const heroVis = hr && hr.bottom > 0 && hr.top < H;
      if (heroVis) {
        // Emit new wave fronts
        if (!reducedRef.current) {
          while (t - lastWaveRef.current >= TIMING.waveInterval) {
            lastWaveRef.current += TIMING.waveInterval;
            wavesRef.current.push({ id: ++waveIdRef.current, born: lastWaveRef.current });
          }
        }

        // Core hero light
        const baseR = 52 * (0.85 + 0.28 * breath) + flareRef.current * 30;
        const lb    = 0.24 + 0.13 * breath + flareRef.current * 0.16;
        const lg    = ctx.createRadialGradient(cx, heroCY, 0, cx, heroCY, baseR + 110);
        lg.addColorStop(0, `rgba(255,238,202,${Math.min(0.4, lb)})`);
        lg.addColorStop(0.5, `rgba(240,205,150,${lb * 0.28})`);
        lg.addColorStop(1, 'rgba(240,205,150,0)');
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = lg;
        ctx.beginPath(); ctx.arc(cx, heroCY, baseR + 110, 0, 6.28); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        flareRef.current *= 0.955;

        // Wave fronts — scattered organic ripple (see original design math)
        const life   = TIMING.waveLife;
        const maxR   = Math.hypot(W, H) * LAYOUT.waveMaxRadiusFraction;
        wavesRef.current = wavesRef.current.filter(w => t - w.born < life);
        ctx.globalCompositeOperation = 'lighter';
        for (const w of wavesRef.current) {
          const age  = t - w.born;
          if (age < 0) continue;
          const R       = maxR * ease(age / life);
          const baseAl  = Math.pow(1 - age / life, 1.4) * 0.34;
          const N = 168;
          for (let i = 0; i < N; i++) {
            const ang = (i / N) * 6.2832;
            // Stable per-wave organic displacement (not random per frame)
            const n =   Math.sin(ang * 3 + w.id * 1.7) * 0.55
                      + Math.sin(ang * 6 - w.id * 0.9) * 0.3
                      + Math.sin(ang * 11 + w.id * 2.3) * 0.15;
            const spread = 30 + R * 0.05;
            for (let b2 = 0; b2 < 2; b2++) {
              const rr  = R + n * spread - b2 * spread * (0.4 + 0.4 * Math.sin(ang * 7 + w.id));
              const px  = cx  + Math.cos(ang) * rr;
              const py  = heroCY + Math.sin(ang) * rr * 0.9;
              const al  = baseAl
                * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(ang * 5 + w.id * 2)))
                * (b2 === 0 ? 1 : 0.45);
              const sz  = 1 + (0.5 + 0.5 * Math.sin(ang * 4 - w.id)) * 1.1;
              ctx.fillStyle = `rgba(246,224,186,${al.toFixed(3)})`;
              ctx.beginPath(); ctx.arc(px, py, sz, 0, 6.28); ctx.fill();
            }
          }
        }
        ctx.globalCompositeOperation = 'source-over';

        // Word card interactions with waves + orbiting
        for (const c of cardsRef.current) {
          if (!c.el) continue;
          if (c.gone) {
            if (t >= c.respawnAt && c.respawnAt) {
              c.gone = false; c.pass = 0; c.seen = new Set();
              c.el.style.filter  = 'none';
              c.el.style.opacity = '1';
            }
            continue;
          }
          const r    = c.el.getBoundingClientRect();
          const dcx  = r.left + r.width  / 2;
          const dcy  = r.top  + r.height / 2;
          const dist = Math.hypot(dcx - cx, dcy - heroCY);

          for (const w of wavesRef.current) {
            const age    = t - w.born;
            const R      = maxR * ease(age / life);
            const prevR  = maxR * ease(Math.max(0, age - 0.05) / life);
            if (!c.seen.has(w.id) && prevR < dist && R >= dist) {
              c.seen.add(w.id); c.pass++; c.soft = 1;
              if (c.pass % LAYOUT.cardDissolveEvery === 0) {
                c.gone = true;
                c.respawnAt = t + LAYOUT.cardRespawnDelay;
                c.el.style.opacity = '0'; c.el.style.filter = 'blur(5px)';
                shatter(dcx, dcy, false);
                flareRef.current = Math.min(1.8, flareRef.current + 0.4);
              }
            }
          }

          if (!reducedRef.current && parseFloat(getComputedStyle(c.el).opacity) > 0.05) {
            c.angle += 0.0006;
            const jx = c.jitter * Math.sin(t * 9)  * 4;
            const jy = c.jitter * Math.cos(t * 11) * 4;
            const ox = Math.cos(c.angle * 10 * c.spin + c.orbit) * c.orbit + jx;
            const oy = Math.sin(c.angle * 10 * c.spin) * c.orbit + jy;
            c.el.style.transform = `translate(-50%,-50%) translate(${ox.toFixed(1)}px,${oy.toFixed(1)}px)`;
            c.soft  *= 0.97;
            const dim = 1 - c.jitter * 0.4 - c.soft * 0.2;
            c.el.style.filter  = c.soft > 0.05 ? `blur(${(c.soft * 2).toFixed(1)}px)` : 'none';
            c.el.style.opacity = String(clamp(dim, 0.35, 1));
            c.jitter *= 0.92;
          }
        }

        // Icon row lighting from passing waves
        iconRefs.current.forEach((ic, i) => {
          if (!ic) return;
          let glow = 0;
          for (const w of wavesRef.current) {
            const age   = t - w.born;
            const R     = maxR * ease(age / life);
            const irect = ic.getBoundingClientRect();
            const idist = Math.hypot(irect.left + irect.width / 2 - cx, irect.top + irect.height / 2 - heroCY);
            const target = idist + i * 26;
            glow = Math.max(glow, Math.exp(-Math.pow((R - target) / 60, 2)));
          }
          if (ic.dataset.hover) glow = 1;
          const dotEl = ic.querySelector<HTMLElement>('.hidot');
          const svg   = ic.querySelector<SVGElement>('svg');
          const lbl   = ic.querySelector<HTMLElement>('.hlabel');
          if (dotEl) {
            dotEl.style.boxShadow  = glow > 0.02
              ? `0 0 ${(glow*34)|0}px rgba(233,207,168,${(glow*0.55).toFixed(2)}), inset 0 0 ${(glow*20)|0}px rgba(255,236,196,${(glow*0.22).toFixed(2)})`
              : 'none';
            dotEl.style.transform  = `translateY(${(-glow*4).toFixed(1)}px) scale(${(1+glow*0.06).toFixed(3)})`;
            dotEl.style.borderTopColor = `rgba(255,245,235,${(0.2+glow*0.5).toFixed(2)})`;
          }
          if (svg) {
            const a = (0.75 + glow * 0.25).toFixed(2);
            if (svg.getAttribute('stroke') !== 'none') svg.style.stroke = `rgba(246,222,184,${a})`;
            else svg.style.fill = `rgba(246,222,184,${a})`;
          }
          if (lbl) {
            lbl.style.opacity = String(0.5 + glow * 0.5);
            lbl.style.color   = `rgba(${(233+glow*13)|0},${(207+glow*20)|0},${(168+glow*28)|0},${(0.5+glow*0.5).toFixed(2)})`;
          }
        });
      }

      // ── Particles ──────────────────────────────────────────────────────────
      if (particlesRef.current.length) {
        particlesRef.current = particlesRef.current.filter(p => p.life < p.max);
        for (const p of particlesRef.current) {
          p.life += 1 / 60;
          if (p.life < p.delay) continue;
          const prog = (p.life - p.delay) / (p.max - p.delay);
          if (prog < p.hesitate) {
            const o = prog / p.hesitate;
            p.x += Math.cos(p.outAng) * p.outSpeed * 0.016 * (1 - o);
            p.y += Math.sin(p.outAng) * p.outSpeed * 0.016 * (1 - o);
          } else {
            const ip   = (prog - p.hesitate) / (1 - p.hesitate);
            const e2   = ease(ip);
            const perp = Math.sin(t * 1.5 + p.curlPh) * p.curl * (1 - e2) * 14;
            const dx   = p.tx - p.x, dy = p.ty - p.y;
            const dl   = Math.hypot(dx, dy) || 1;
            const pull = 0.02 + e2 * 0.06;
            p.x += dx * pull + (-dy / dl) * perp * 0.02;
            p.y += dy * pull + ( dx / dl) * perp * 0.02;
          }
          const fade = prog < 0.15 ? prog / 0.15 : Math.pow(1 - (prog - 0.15) / 0.85, 1.8);
          ctx.fillStyle = `rgba(244,220,180,${(fade * 0.5).toFixed(3)})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 6.28); ctx.fill();
        }
      }

      // ── Figure section (Section 3) ─────────────────────────────────────────
      const fslot = document.getElementById('fig-slot');
      const sec3  = document.getElementById('sec3');
      if (fslot && sec3) {
        const fr = fslot.getBoundingClientRect();
        if (fr.bottom > 0 && fr.top < H) {
          const s3 = sec3.getBoundingClientRect();
          let p = clamp(-s3.top / (s3.height - H), 0, 1);
          if (reducedRef.current) p = 0.95;
          drawFigure(ctx, fr, p, t);
          document.querySelectorAll<HTMLElement>('.figline').forEach((el, i) => {
            el.style.opacity = p > [0.05, 0.28, 0.55][i] ? '1' : '0';
          });
        }
      }

      // ── Session section (Section 5) ────────────────────────────────────────
      const sv   = document.getElementById('sec5visual');
      const sec5 = document.getElementById('sec5');
      if (sv && sec5) {
        const vr = sv.getBoundingClientRect();
        if (vr.bottom > 0 && vr.top < H) {
          const s5    = sec5.getBoundingClientRect();
          let p = clamp(-s5.top / (s5.height - H), 0, 1);
          if (reducedRef.current) p = 0.9;
          const stage = p * 4;
          drawSession(ctx, vr, stage, t, breath);
          document.querySelectorAll<HTMLElement>('.stageblock').forEach((b, i) => {
            b.style.opacity = i === Math.round(clamp(stage, 0, 4)) ? '1' : '0.25';
          });
        }
      }

      // ── Orb drift (Voices section) ─────────────────────────────────────────
      if (!reducedRef.current) {
        document.querySelectorAll<HTMLElement>('#orbfield .orb').forEach((o, i) => {
          const ox = Math.sin(t * (TIMING.orbDriftBase + i * TIMING.orbDriftStep) + i) * 12;
          const oy = Math.cos(t * (0.06 + i * 0.009) + i * 2) * 12;
          o.style.transform = `translate(${ox.toFixed(1)}px,${oy.toFixed(1)}px)`;
        });
      }

      // ── Chakra spine ──────────────────────────────────────────────────────
      dotRefs.current.forEach((d, i) => {
        if (!d) return;
        const lit     = scrollP >= (i + 0.5) / 7;
        const [r, g, b] = COLORS.chakra[i];
        d.style.background = lit ? `rgb(${r},${g},${b})` : 'rgba(233,224,212,0.14)';
        d.style.boxShadow  = lit ? `0 0 12px rgba(${r},${g},${b},0.6)` : 'none';
      });
    } catch (_) { /* one bad frame must not kill the loop */ }

    rafRef.current = requestAnimationFrame(draw);
  }, [shatter]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Figure drawing ─────────────────────────────────────────────────────────
  function drawFigure(ctx: CanvasRenderingContext2D, rect: DOMRect, p: number, t: number) {
    const ex      = rect.left + rect.width / 2;
    const ox = rect.left, oy = rect.top;
    const energyY = ease(p);
    const knotOpen = ease(clamp((p - 0.40) / 0.30, 0, 1));
    const bright   = ease(clamp((p - 0.78) / 0.22, 0, 1));
    const chestY   = 0.315;

    if (bright > 0.02) {
      const ay = oy + rect.height * 0.42;
      const g  = ctx.createRadialGradient(ex, ay, 0, ex, ay, rect.height * 0.5);
      g.addColorStop(0, `rgba(255,232,188,${(bright * 0.16).toFixed(3)})`);
      g.addColorStop(1, 'rgba(255,232,188,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(ex, ay, rect.height * 0.5, 0, 6.28); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    for (const pt of BODY_PTS) {
      const px = ox + pt.x * rect.width;
      const py = oy + pt.y * rect.height;
      let a    = 0.09 + 0.04 * Math.sin(t * 0.5 + pt.ph);
      const near = Math.exp(-Math.pow((pt.y - energyY) / 0.075, 2));
      a += near * 0.62;
      if (pt.spine && pt.y < energyY + 0.02) a += 0.12;
      if (pt.chest) {
        const knotband = Math.exp(-Math.pow((energyY - chestY) / 0.12, 2));
        a = a * (0.22 + knotOpen * 0.78) + knotband * (1 - knotOpen) * 0.14;
      }
      a += bright * 0.42;
      const warm = near > 0.28 || bright > 0.18 || (pt.chest && knotOpen > 0.4);
      const jig  = pt.chest ? (1 - knotOpen) * Math.sin(t * 4 + pt.ph) * 2.2 : 0;
      const sz   = pt.sz * (1 + near * 0.5 + bright * 0.35);
      ctx.fillStyle = warm
        ? `rgba(251,224,178,${Math.min(0.96, a).toFixed(3)})`
        : `rgba(233,216,196,${Math.min(0.96, a).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(px + jig, py, sz, 0, 6.28); ctx.fill();
    }

    // Descending energy orb
    const orbP   = Math.min(energyY, 0.9);
    const orbY   = oy + orbP * rect.height;
    const orbGlow = (1 - bright) * (0.55 + 0.25 * Math.sin(t * 1.4));
    if (orbGlow > 0.02) {
      const r   = 34 + 10 * Math.sin(t * 1.4);
      const g   = ctx.createRadialGradient(ex, orbY, 0, ex, orbY, r + 22);
      g.addColorStop(0, `rgba(255,238,200,${(orbGlow * 0.85).toFixed(3)})`);
      g.addColorStop(0.5, `rgba(245,210,155,${(orbGlow * 0.35).toFixed(3)})`);
      g.addColorStop(1, 'rgba(245,210,155,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(ex, orbY, r + 22, 0, 6.28); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    // Motes rising when knot releases
    if (knotOpen > 0.15 && knotOpen < 0.95) {
      const kn = oy + chestY * rect.height;
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 7; i++) {
        const ph   = i * 0.9 + t * 0.6;
        const rise = (ph % 3) / 3;
        const mx   = ex + Math.sin(ph * 2.1) * 26 * rise;
        const my   = kn - rise * 90;
        const a    = (1 - rise) * knotOpen * (1 - knotOpen) * 4 * 0.5;
        if (a <= 0) continue;
        ctx.fillStyle = `rgba(251,226,182,${Math.min(0.5, a).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(mx, my, 1.6, 0, 6.28); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  function drawSession(
    ctx: CanvasRenderingContext2D, rect: DOMRect,
    stage: number, t: number, breath: number
  ) {
    const cx  = rect.left + rect.width  / 2;
    const cy  = rect.top  + rect.height / 2;
    const s   = clamp(stage / 4, 0, 1);
    const agit = 1 - s;
    const R   = Math.min(rect.width, rect.height) * 0.3;
    for (const pt of SESSION_PTS) {
      const scx = cx + pt.rx * rect.width  * 0.42;
      const scy = cy + pt.ry * rect.height * 0.42;
      const ocx = cx + pt.ox * R * 2;
      const ocy = cy + pt.oy * R * 1.6;
      const jit = agit * Math.sin(t * 3 + pt.ph) * 12;
      const x   = scx + (ocx - scx) * s + jit * (1 - s);
      const y   = scy + (ocy - scy) * s + Math.cos(t * 3 + pt.ph) * 10 * agit;
      const a   = 0.12 + s * 0.4 * (0.7 + 0.3 * breath) + 0.05 * Math.sin(t * 0.6 + pt.ph);
      ctx.fillStyle = s > 0.4
        ? `rgba(250,224,178,${a.toFixed(3)})`
        : `rgba(233,216,196,${a.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(x, y, 1.7, 0, 6.28); ctx.fill();
    }
    if (s > 0.5) {
      const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.8);
      const al = (s - 0.5) * 0.5 * (0.7 + 0.3 * breath);
      g.addColorStop(0, `rgba(255,232,188,${al})`);
      g.addColorStop(1, 'rgba(255,232,188,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.8, 0, 6.28); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  // ─── Mount / unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cv  = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;

    // Resize handler
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, LAYOUT.maxDpr);
      const W   = window.innerWidth;
      const H   = window.innerHeight;
      cv.width  = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { W, H, dpr };
      mouseRef.current = { x: W / 2, y: H / 2 };
      // Dot density reduced on small/high-dpr screens for perf
      const densityScale = dpr > 1.5 ? 0.7 : 1;
      initDots(W, H, dpr, densityScale);
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse / pointer
    const onMove = (e: MouseEvent | PointerEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      lastMoveRef.current = performance.now();
      if (!reducedRef.current && trailRef.current.length < 60) {
        trailRef.current.push({ x: e.clientX, y: e.clientY, born: nowRef.current });
      }
      cardsRef.current.forEach(c => {
        if (c.gone || !c.el) return;
        const r   = c.el.getBoundingClientRect();
        const d   = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        c.jitter  = d < 120 ? 1 - d / 120 : 0;
      });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('pointermove', onMove);

    // Pause when tab hidden
    const onVisibility = () => { pausedRef.current = document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    // Init card state
    cardsRef.current = cardRefs.current.map((el, i) => ({
      el,
      word: WORD_CARDS[i]?.word ?? '',
      angle: Math.random() * 6.28,
      orbit: 9 + Math.random() * 8,
      spin:  0.05 + Math.random() * 0.03,
      gone:  false, pass: 0, seen: new Set(),
      respawnAt: 0, soft: 0, jitter: 0,
    }));

    // Stagger card reveal
    if (reducedRef.current) {
      cardRefs.current.forEach(el => el && (el.style.opacity = '1'));
    } else {
      setTimeout(() => {
        cardRefs.current.forEach((el, i) =>
          setTimeout(() => el && (el.style.opacity = '1'), i * TIMING.cardStaggerMs)
        );
      }, TIMING.cardRevealDelayMs);
    }

    // Start rAF loop
    startRef.current = 0;
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [draw, initDots]);

  // ─── Render ────────────────────────────────────────────────────────────────
  const hasCarry = carrying.length > 0;

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      />

      {/* Chakra spine indicator */}
      <div
        style={{
          position: 'fixed', top: '50%', right: 26, transform: 'translateY(-50%)',
          zIndex: 6, display: 'flex', flexDirection: 'column', gap: 20,
          alignItems: 'center', pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <div style={{ width: 1, height: 44, background: 'linear-gradient(to bottom,transparent,rgba(233,224,212,0.18))' }} />
        {COLORS.chakra.map((_, i) => (
          <div
            key={i}
            ref={el => { dotRefs.current[i] = el; }}
            style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'rgba(233,224,212,0.14)',
              transition: 'background 1.6s ease-out, box-shadow 1.6s ease-out',
            }}
          />
        ))}
        <div style={{ width: 1, height: 44, background: 'linear-gradient(to top,transparent,rgba(233,224,212,0.18))' }} />
      </div>

      {/* Hero section */}
      <section
        id="hero"
        ref={heroRef}
        style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', zIndex: 1 }}
        aria-label="Hero"
      >
        {/* Floating word cards */}
        {WORD_CARDS.map((card, i) => (
          <div
            key={card.id}
            ref={el => { cardRefs.current[i] = el; }}
            role="button"
            tabIndex={0}
            aria-label={`I am carrying ${card.word}. Click to release it.`}
            className="wordcard"
            style={{
              position: 'absolute',
              left: card.left, top: card.top,
              transform: 'translate(-50%,-50%)',
              padding: card.padding,
              background: 'rgba(255,248,240,0.05)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              borderRadius: card.radius,
              border: '1px solid transparent',
              borderTop: '1px solid rgba(255,245,235,0.18)',
              boxShadow: '0 20px 55px rgba(0,0,0,0.32)',
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic', fontSize: card.fontSize,
              fontWeight: 300, letterSpacing: '0.02em',
              color: '#e4d8c8',
              cursor: 'pointer',
              opacity: 0,
              transition: 'opacity 2.4s ease-out, filter 1.8s ease-out',
              willChange: 'transform',
              userSelect: 'none',
              outline: 'none',
            }}
            onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(233,207,168,0.6), 0 20px 55px rgba(0,0,0,0.32)'; }}
            onBlur={e =>  { e.currentTarget.style.boxShadow = '0 20px 55px rgba(0,0,0,0.32)'; }}
            onClick={() => {
              const c   = cardsRef.current[i];
              const el  = cardRefs.current[i];
              if (!c || !el || c.gone) return;
              addCarry(card.word);
              const r = el.getBoundingClientRect();
              shatter(r.left + r.width / 2, r.top + r.height / 2, true);
              flareRef.current = Math.min(2.4, flareRef.current + 1.6);
              c.gone = true; c.respawnAt = nowRef.current + LAYOUT.cardRespawnDelay;
              el.style.opacity = '0'; el.style.filter = 'blur(6px)';
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const c   = cardsRef.current[i];
                const el  = cardRefs.current[i];
                if (!c || !el || c.gone) return;
                addCarry(card.word);
                c.gone = true; c.respawnAt = nowRef.current + LAYOUT.cardRespawnDelay;
                el.style.opacity = '0';
              }
            }}
          >
            {card.word.charAt(0).toUpperCase() + card.word.slice(1)}
          </div>
        ))}

        {/* Centre CTA */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 3, display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center', gap: 18,
        }}>
          {hasCarry && (
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: 19, color: 'rgba(233,207,168,0.85)',
              letterSpacing: '0.02em', transition: 'opacity 1.4s ease-out',
            }}>
              Carrying: {carrying.join(', ')}
            </div>
          )}
          <button
            onClick={openModal}
            aria-label="Begin — open booking form"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 30, fontWeight: 300, letterSpacing: '0.06em',
              color: '#f4ecdd',
              background: 'rgba(255,248,240,0.06)',
              backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid transparent',
              borderTop: '1px solid rgba(255,245,235,0.22)',
              padding: '20px 56px', borderRadius: 50,
              cursor: 'pointer',
              transition: 'color 1s ease-out, background 1s ease-out',
              outline: 'none',
            }}
            onFocus={e =>  { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(233,207,168,0.6)'; }}
            onBlur={e =>   { e.currentTarget.style.boxShadow = 'none'; }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,248,240,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,248,240,0.06)'; }}
          >
            Begin
          </button>
          <div style={{ fontSize: 12.5, letterSpacing: '0.05em', color: 'rgba(233,224,212,0.68)', maxWidth: 280 }}>
            Online Reiki on Google Meet · ₹499 · Free 15-min chat first
          </div>
        </div>

        {/* Service icons row */}
        <div
          className="service-icons"
          style={{
            position: 'absolute', left: '50%', bottom: '5.5%',
            transform: 'translateX(-50%)',
            zIndex: 3, display: 'flex', gap: 34, alignItems: 'flex-start',
          }}
          role="list"
          aria-label="Services offered"
        >
          {ICON_LABELS.map((label, i) => (
            <div
              key={label}
              ref={el => { iconRefs.current[i] = el; }}
              role="listitem"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 13, cursor: 'pointer' }}
              data-hover=""
              onMouseEnter={e => { (e.currentTarget as HTMLElement).dataset.hover = '1'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).dataset.hover = ''; }}
            >
              <div
                className="hidot service-icon-bg"
                style={{
                  width: 62, height: 62, borderRadius: '50%',
                  background: 'rgba(255,248,240,0.05)',
                  backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid transparent',
                  borderTop: '1px solid rgba(255,245,235,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'box-shadow 1s ease-out, transform 1s ease-out, border-color 1s ease-out',
                }}
                aria-hidden="true"
              >
                {ICON_SVGS[label]}
              </div>
              <span
                className="hlabel"
                style={{
                  fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(233,224,212,0.68)',
                  transition: 'opacity 0.9s ease-out, color 0.9s ease-out',
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Booking modal */}
      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        carrying={carrying}
      />
    </>
  );
}
