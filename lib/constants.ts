// ─── Contact & offer (edit these — the whole site reads from here) ───────────
export const CONTACT = {
  practitioner: 'Disha Pandya',
  city: 'Vadodara',
  instagram: 'karmlin_',
  // WhatsApp number with country code, digits only, e.g. '919876543210'.
  // Leave '' to hide the WhatsApp and Call buttons.
  whatsapp: '',
  // Leave '' to hide the email link.
  email: '',
} as const;

export const OFFER = {
  price: '₹499',
  priceNote: 'per session',
  where: 'Live on Google Meet',
  languages: 'English or Hindi',
  reach: 'From anywhere in the world',
} as const;

// ─── Brand colours ───────────────────────────────────────────────────────────
export const COLORS = {
  // backgrounds
  bgDeep: '#100c0b',
  bgMid: '#161110',
  bgWarm: '#1c1613',
  // text
  cream: '#e9e0d4',
  creamBright: '#f4ecdd',
  creamMid: '#efe6d8',
  creamSoft: '#ece3d6',
  creamCard: '#e4d8c8',
  // accent
  gold: '#e6cfa8',
  goldBright: '#f2e3c4',
  goldModal: '#e9d6b4',
  // glass
  glassBg: 'rgba(255,248,240,0.045)',
  glassBgCard: 'rgba(255,248,240,0.05)',
  glassTop: 'rgba(255,245,235,0.16)',
  glassTopNav: 'rgba(255,245,235,0.22)',
  // particles
  particleBase: 'rgba(233,216,196,',
  particleGold: 'rgba(246,224,186,',
  particleWarm: 'rgba(244,220,180,',
  // aurora blob hues (rgb arrays)
  auroraBlobs: [
    { hue: [190, 170, 220], ox: 0.22, oy: 0.24, r: 0.5,  sx: 0.017, sy: 0.013 },
    { hue: [150, 180, 220], ox: 0.78, oy: 0.30, r: 0.55, sx: 0.011, sy: 0.019 },
    { hue: [235, 190, 150], ox: 0.30, oy: 0.74, r: 0.5,  sx: 0.015, sy: 0.012 },
    { hue: [232, 150, 165], ox: 0.72, oy: 0.70, r: 0.48, sx: 0.013, sy: 0.017 },
    { hue: [160, 205, 175], ox: 0.5,  oy: 0.5,  r: 0.42, sx: 0.009, sy: 0.014 },
  ] as const,
  // chakra spine (root → crown)
  chakra: [
    [217, 138, 138], [224, 168, 120], [230, 207, 138],
    [159, 199, 166], [143, 176, 214], [154, 149, 207], [183, 156, 207],
  ] as const,
} as const;

// ─── Motion / timing ─────────────────────────────────────────────────────────
export const TIMING = {
  // wave emission period (seconds between wave fronts)
  waveInterval: 7.5,
  // aurora intensity multiplier
  auroraIntensity: 1,
  // dot grid spacing divisor
  dotDensity: 1,
  // breath cycle total (s): 4s in, 6s out
  breathIn: 4,
  breathOut: 6,
  breathTotal: 10,
  // card reveal stagger (ms per card after 2s initial delay)
  cardStaggerMs: 340,
  cardRevealDelayMs: 2000,
  // wave lifetime (s)
  waveLife: 8,
  // particle max count on full display; scaled down for mobile
  particleHardCount: 46,
  particleSoftCount: 34,
  // orb drift speed multipliers
  orbDriftBase: 0.08,
  orbDriftStep: 0.011,
} as const;

// ─── Layout ──────────────────────────────────────────────────────────────────
export const LAYOUT = {
  // dot grid cell size at density=1 (px)
  dotSpacing: 42,
  // max DPR for canvas (capped at 2 for perf)
  maxDpr: 2,
  // card dissolve: every Nth wave pass causes a dissolve
  cardDissolveEvery: 3,
  // card respawn delay (s)
  cardRespawnDelay: 16,
  // hero icon row (fractional viewport height)
  iconRowY: 0.86,
  // wave max radius as fraction of diagonal
  waveMaxRadiusFraction: 0.62,
  // figure point count
  figurePointCount: 330,
  // session cloud point count
  sessionCloudCount: 190,
} as const;

// ─── Word cards (hero) ────────────────────────────────────────────────────────
export const WORD_CARDS = [
  { id: 0, word: 'anxiety',      left: '21%', top: '27%', fontSize: 33, padding: '18px 30px', radius: 20 },
  { id: 1, word: 'burnout',      left: '77%', top: '28%', fontSize: 30, padding: '17px 28px', radius: 20 },
  { id: 2, word: 'grief',        left: '25%', top: '66%', fontSize: 18, padding: '11px 19px', radius: 15 },
  { id: 3, word: 'restlessness', left: '76%', top: '64%', fontSize: 24, padding: '14px 23px', radius: 18 },
  { id: 4, word: 'overwhelm',    left: '50%', top: '17%', fontSize: 17, padding: '10px 18px', radius: 14 },
  { id: 5, word: 'worry',        left: '12%', top: '49%', fontSize: 23, padding: '14px 22px', radius: 18 },
  { id: 6, word: 'heaviness',    left: '88%', top: '54%', fontSize: 19, padding: '11px 19px', radius: 15 },
  { id: 7, word: 'tension',      left: '34%', top: '21%', fontSize: 22, padding: '13px 21px', radius: 17 },
  { id: 8, word: 'sleeplessness',left: '66%', top: '22%', fontSize: 16, padding: '10px 17px', radius: 14 },
] as const;

// ─── Offerings ───────────────────────────────────────────────────────────────
export const OFFERINGS = [
  {
    id: 'reiki',
    name: 'Reiki',
    duration: 'ONLINE · ₹499',
    desc: 'You lie down at home, on a Google Meet call. Disha works with your energy while you simply rest.',
    iconPath: 'reiki',
  },
  {
    id: 'distance',
    name: 'Distance Healing',
    duration: 'ONLINE · ₹499',
    desc: 'The same session, sent to you wherever you are — Vadodara, Mumbai, London or Toronto.',
    iconPath: 'distance',
  },
  {
    id: 'chakra',
    name: 'Chakra Balancing',
    duration: 'ONLINE · ₹499',
    desc: 'Attention moves through your seven energy centres, root to crown, until they align.',
    iconPath: 'chakra',
  },
  {
    id: 'meditation',
    name: 'Meditation',
    duration: 'ONLINE · ₹499',
    desc: 'Guided and unhurried — a calm place to set a busy mind down for a while.',
    iconPath: 'meditation',
  },
  {
    id: 'breathwork',
    name: 'Breathwork',
    duration: 'ONLINE · ₹499',
    desc: 'Simple guided breathing from a yoga coach, to slow you down and steady how you feel.',
    iconPath: 'breathwork',
  },
  {
    id: 'learn',
    name: 'Learn Reiki',
    duration: 'LEVEL 1 · 2 · 3',
    desc: 'Disha is a Reiki Master-Teacher. Learn to give Reiki to yourself and others, one level at a time.',
    iconPath: 'learn',
  },
] as const;

// ─── Session stages ───────────────────────────────────────────────────────────
export const SESSION_STAGES = [
  { label: 'Arrival',      body: 'You sit. Nothing is asked of you yet.' },
  { label: 'Grounding',    body: 'Breath slows. The room goes quiet.' },
  { label: 'Scan',         body: 'Where the weight is held becomes clear.' },
  { label: 'Transmission', body: 'Energy meets it. You may feel warmth, or nothing at all. Both are fine.' },
  { label: 'Integration',  body: 'You come back slowly. Water. No rush.' },
] as const;

// ─── Testimonials (voices) ────────────────────────────────────────────────────
// Real client words only. Add an entry after each session with the client's
// permission, e.g. { id: 'r1', name: 'Riya', service: 'Reiki', location: 'Pune',
// quote: '...', size: 150, pos: { left: '14%', top: '14%' } }.
// The section stays hidden while this list is empty.
export interface Voice {
  id: string; name: string; service: string; location: string; quote: string;
  size: number; pos: { left: string; top: string };
}
export const VOICES: Voice[] = [];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
export const FAQ_ITEMS = [
  {
    q: 'How does an online session work?',
    a: 'We meet on Google Meet. You find a quiet spot, lie down or sit comfortably, and keep the camera on or off — your choice. We talk for a few minutes, then you rest while I work. At the end we talk about what you noticed.',
  },
  {
    q: 'Can Reiki really work over a video call?',
    a: 'Distance Reiki is a standard part of Reiki training, taught at Level 2. Many people find it just as relaxing as being in the room. The easiest way to know is the free 15-minute chat, then one session.',
  },
  {
    q: 'How do I book and pay?',
    a: 'Message me on Instagram (send "HEAL") or WhatsApp. We pick a time that works in your time zone, and I share payment details — UPI in India, and an easy option if you are abroad. A session is ₹499.',
  },
  {
    q: 'Which language are sessions in?',
    a: 'English or Hindi — whichever you are more comfortable in.',
  },
  {
    q: 'What if I feel nothing?',
    a: 'That is common and completely fine. Some people feel warmth or tingling; some just feel like they had a long nap. Come as you are, doubts included.',
  },
  {
    q: 'Is this instead of medicine?',
    a: 'No. Alongside — never instead. Keep your doctor, your prescriptions, your therapist. This sits beside your care; it does not replace any of it. If anything sounds medical, I will ask you to see someone who can help.',
  },
] as const;
