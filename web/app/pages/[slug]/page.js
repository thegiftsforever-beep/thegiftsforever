import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { getPage } from '@/lib/data';
import { cleanHtml, hasH1 } from '@/lib/utils';

// Build each page on its first visit, then serve it from cache (revalidated with the layout, every 5 minutes).
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await getPage(slug);
  if (!p) return {};
  return { title: p.metaTitle || p.title, description: p.metaDescription, keywords: p.metaKeywords, alternates: { canonical: `/pages/${p.slug}` } };
}

export default async function ContentPage({ params }) {
  const { slug } = await params;
  const p = await getPage(slug);
  if (!p) notFound();
  return (
    <>
      <PageHeader title={p.title} titleAs={hasH1(cleanHtml(p.content)) ? 'p' : 'h1'} crumbs={[[p.title]]} />
      <div className="prose-gift container-x mt-12 max-w-3xl" dangerouslySetInnerHTML={{ __html: cleanHtml(p.content) }} />
    </>
  );
}
