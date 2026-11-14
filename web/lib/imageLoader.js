/**
 * Next/Image loader (a custom loader turns off Next's /_next/image optimizer).
 * - Uploads stored in MongoDB: resized to WebP by our /api/uploads route, cached by the CDN.
 * - Unsplash: resized by Unsplash's own CDN.
 * - Files in /public (logo, hero banners): served as they are; they are already small.
 */
export default function imageLoader({ src, width, quality }) {
  const q = quality || 75;
  if (src.startsWith('/api/uploads/')) return `${src}?w=${width}&q=${q}`;
  if (src.startsWith('https://images.unsplash.com/')) {
    const url = new URL(src);
    url.searchParams.set('w', String(width));
    url.searchParams.set('q', String(q));
    url.searchParams.set('auto', 'format');
    return url.toString();
  }
  return src;
}
