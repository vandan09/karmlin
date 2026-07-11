import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPractitioner(slug: string) {
  // Stub — wire to CMS/DB when ready
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title:       slug.replace(/-/g, ' '),
    description: 'Practitioner profile',
  };
}

export default async function PractitionerProfile({ params }: Props) {
  const { slug } = await params;
  const practitioner = await getPractitioner(slug);
  if (!practitioner) notFound();

  return (
    <main style={{ minHeight: '100vh', padding: '20vh 8vw', color: '#e9e0d4' }}>
      <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontSize: 'clamp(30px, 4vw, 56px)' }}>
        {slug}
      </h1>
    </main>
  );
}
