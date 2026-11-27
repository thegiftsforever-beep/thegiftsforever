/** Live storefront domain: the canonical address for every page, whatever Vercel URL serves it. */
export const LIVE_URL = 'https://thegiftsforever.com';

/**
 * Address used for canonical URLs and schema. On Vercel production it is always LIVE_URL, so a
 * *.vercel.app or www setting in NEXT_PUBLIC_SITE_URL cannot leak into canonicals.
 */
export const SITE_URL =
  process.env.VERCEL_ENV === 'production'
    ? LIVE_URL
    : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace('://www.', '://').replace(/\/+$/, '');
