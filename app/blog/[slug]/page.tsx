import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

// Stub — swap with real CMS fetch when content is ready
async function getPost(slug: string) {
  // e.g. return fetch(`https://your-cms.io/posts/${slug}`).then(r => r.json())
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // const post = await getPost(slug);
  return {
    title:       slug.replace(/-/g, ' '),
    description: '',
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main style={{ minHeight: '100vh', padding: '20vh 8vw', color: '#e9e0d4' }}>
      <article>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontSize: 'clamp(30px, 4vw, 56px)', marginBottom: '4vh' }}>
          {slug}
        </h1>
        <p style={{ color: 'rgba(233,224,212,0.5)' }}>Post content coming soon.</p>
      </article>
    </main>
  );
}
