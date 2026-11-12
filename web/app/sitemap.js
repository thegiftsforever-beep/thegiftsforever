import { dbConnect } from '@/lib/db';
import { Blog, Category, ContentPage, Product } from '@/lib/models';

export const dynamic = 'force-dynamic';

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thegiftsforever.com';
const visible = { active: true, hidden: { $ne: true } };

export default async function sitemap() {
  await dbConnect();
  const [products, categories, blogs, pages] = await Promise.all([
    Product.find(visible, 'slug updatedAt').lean(),
    Category.find(visible, 'slug updatedAt').lean(),
    Blog.find({ active: true }, 'slug updatedAt').lean(),
    ContentPage.find({ active: true }, 'slug updatedAt').lean(),
  ]);
  const entry = (path, lastModified, priority) => ({ url: `${base}${path}`, lastModified, priority });
  return [
    entry('/', new Date(), 1),
    ...['/categories', '/blogs', '/faq', '/about', '/contact'].map((p) => entry(p, new Date(), 0.5)),
    ...categories.map((c) => entry(`/category/${c.slug}`, c.updatedAt, 0.8)),
    ...products.map((p) => entry(`/product/${p.slug}`, p.updatedAt, 0.7)),
    ...blogs.map((b) => entry(`/blogs/${b.slug}`, b.updatedAt, 0.5)),
    ...pages.map((p) => entry(`/pages/${p.slug}`, p.updatedAt, 0.3)),
  ];
}
