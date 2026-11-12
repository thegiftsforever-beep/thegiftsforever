const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thegiftsforever.com';

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/cart', '/checkout', '/order-success/', '/search'] },
    sitemap: `${base}/sitemap.xml`,
  };
}
