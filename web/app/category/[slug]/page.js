import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import ProductCard from '@/components/ProductCard';
import Reviews from '@/components/Reviews';
import Faqs from '@/components/Faqs';
import { getCategory, getCategoryProducts, getReviews } from '@/lib/data';
import { img } from '@/lib/utils';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = await getCategory(slug);
  if (!c) return {};
  return {
    title: c.metaTitle || c.name,
    description: c.metaDescription,
    keywords: c.metaKeywords,
    openGraph: { images: c.image?.startsWith('http') ? [c.image] : [] },
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const c = await getCategory(slug);
  if (!c) notFound();
  const page = Math.max(1, Number(sp.page) || 1);
  const [{ items, total, pages }, reviews, sections] = await Promise.all([
    getCategoryProducts(c._id, { page }),
    getReviews({ kind: 'category', category: c._id, limit: 6 }),
    // each sub category gets its own block of products, in sub category order
    Promise.all((c.children || []).map(async (k) => ({ k, ...(await getCategoryProducts(k._id, { limit: 8 })) }))),
  ]);
  const shown = sections.filter((x) => x.items.length);
  const href = (p) => `?${new URLSearchParams({ ...sp, page: String(p) })}`;

  return (
    <>
      <PageHeader title={c.name} eyebrow="Collection" crumbs={[['Categories', '/categories'], [c.name]]}>
        <p className="mt-3 text-muted">{total} gift{total === 1 ? '' : 's'} available</p>
      </PageHeader>

      <div className="container-x mt-10">
        {c.children?.length > 0 && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {c.children.map((k) => (
              <Link key={k._id} href={`/category/${k.slug}`} className="flex items-center gap-3 border border-ink/10 bg-white pr-3 text-sm font-medium transition hover:border-wine">
                <span className="relative h-20 w-20 shrink-0 bg-blush">
                  <Image src={img(k.image)} alt="" fill sizes="80px" unoptimized={k.image?.startsWith('/api/uploads/')} className="object-cover" />
                </span>
                {k.name}
              </Link>
            ))}
          </div>
        )}

        {shown.map(({ k, items: list, total: count }, idx) => (
          <section key={k._id} className={idx ? 'mt-16' : ''}>
            <h2 className="section-title mb-7">{k.name}</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
              {list.map((p, i) => <ProductCard key={p._id} p={p} priority={idx === 0 && i < 4} />)}
            </div>
            {count > list.length && (
              <div className="mt-8 text-center">
                <Link href={`/category/${k.slug}`} className="btn-wine">View more</Link>
              </div>
            )}
          </section>
        ))}

        {items.length > 0 && !shown.length && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {items.map((p, i) => <ProductCard key={p._id} p={p} priority={i < 4} />)}
          </div>
        )}
        {!items.length && !shown.length && (
          <div className="rounded-3xl bg-white p-16 text-center text-muted">No gifts here yet — check back soon.</div>
        )}

        {pages > 1 && !shown.length && (
          <nav className="mt-12 flex justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link key={n} href={href(n)} className={`flex h-10 w-10 items-center justify-center rounded-full text-sm ${n === page ? 'bg-wine text-white' : 'bg-white hover:bg-blush'}`}>{n}</Link>
            ))}
          </nav>
        )}

        {c.description && (
          <article className="prose-gift mx-auto mt-20 max-w-3xl rounded-3xl bg-white p-8 sm:p-12" dangerouslySetInnerHTML={{ __html: c.description }} />
        )}
      </div>

      <Faqs items={c.faqs} />

      <Reviews reviews={reviews} title={`What customers say about ${c.name}`} />
    </>
  );
}
