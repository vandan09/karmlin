import type { Metadata } from 'next';

export const metadata: Metadata = {
  title:       'Blog',
  description: 'Thoughts on energy healing, meditation practice, and the quiet work of feeling well.',
};

// Stub — replace with real post fetching when content is ready
export default function BlogIndex() {
  return (
    <main style={{ minHeight: '100vh', padding: '20vh 8vw', color: '#e9e0d4' }}>
      <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontSize: 'clamp(36px, 6vw, 72px)', marginBottom: '2vh' }}>
        Writing
      </h1>
      <p style={{ color: 'rgba(233,224,212,0.5)', fontSize: 16 }}>
        Posts coming soon.
      </p>
    </main>
  );
}
