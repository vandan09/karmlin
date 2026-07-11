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
    duration: '60 MIN',
    desc: 'Hands rest lightly on or just above you, and the body quietly unwinds.',
    iconPath: 'reiki',
  },
  {
    id: 'sound-bath',
    name: 'Sound Bath',
    duration: '50 MIN',
    desc: 'Singing bowls and gentle tones wash over you. You just lie still and listen.',
    iconPath: 'sound-bath',
  },
  {
    id: 'meditation',
    name: 'Meditation',
    duration: '45 MIN',
    desc: 'Guided and unhurried — a calm place to set a busy mind down for a while.',
    iconPath: 'meditation',
  },
  {
    id: 'breathwork',
    name: 'Breathwork',
    duration: '50 MIN',
    desc: 'Simple guided breathing that slows you down and steadies how you feel.',
    iconPath: 'breathwork',
  },
  {
    id: 'chakra',
    name: 'Chakra Balancing',
    duration: '60 MIN',
    desc: 'Attention moves through your seven energy centres, root to crown, until they align.',
    iconPath: 'chakra',
  },
  {
    id: 'distance',
    name: 'Distance Healing',
    duration: '45 MIN',
    desc: 'The same session, sent to you wherever you are. Distance makes no difference.',
    iconPath: 'distance',
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
export const VOICES = [
  {
    id: 'maya',
    name: 'Maya',
    service: 'Reiki',
    location: 'Portland, OR',
    quote: 'I slept through the night for the first time in two years.',
    size: 158,
    pos: { left: '14%', top: '14%' },
  },
  {
    id: 'daniel',
    name: 'Daniel',
    service: 'Sound Bath',
    location: 'Austin, TX',
    quote: 'I stopped bracing for a phone call that never comes.',
    size: 140,
    pos: { left: '62%', top: '9%' },
  },
  {
    id: 'priya',
    name: 'Priya',
    service: 'Chakra Balancing',
    location: 'Brooklyn, NY',
    quote: 'I cried for ten minutes and then felt lighter than I have in a year.',
    size: 168,
    pos: { left: '38%', top: '44%' },
  },
  {
    id: 'tomas',
    name: 'Tomás',
    service: 'Breathwork',
    location: 'Denver, CO',
    quote: 'My shoulders came down from my ears and stayed there.',
    size: 132,
    pos: { left: '76%', top: '52%' },
  },
  {
    id: 'ana',
    name: 'Ana',
    service: 'Distance',
    location: 'Chicago, IL',
    quote: 'I didn\'t have to explain myself. I just got to rest.',
    size: 128,
    pos: { left: '18%', top: '66%' },
  },
] as const;

// ─── FAQ ─────────────────────────────────────────────────────────────────────
export const FAQ_ITEMS = [
  {
    q: 'Do I have to believe in it for it to work?',
    a: 'No. You can be a complete skeptic and still feel your nervous system settle. Belief isn\'t the mechanism — rest is. Come as you are, doubts included.',
  },
  {
    q: 'Will you touch me?',
    a: 'Only if you want me to, and we agree on it first. Hands-off sessions work just as well. You stay fully clothed throughout, and you can change your mind at any point.',
  },
  {
    q: 'What if I feel nothing?',
    a: 'That\'s common and completely fine. Some people feel heat or tingling; some just feel like they had a long nap. The work isn\'t measured by sensation — it\'s measured by how you sleep that night.',
  },
  {
    q: 'Is this instead of medicine?',
    a: 'No. Alongside — never instead. Keep your doctor, your prescriptions, your therapist. This sits beside your care, it does not replace any of it. If anything feels medical, I\'ll tell you to go see someone who can help.',
  },
] as const;
