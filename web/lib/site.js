/**
 * Public address of the storefront, used for canonical URLs and schema.
 * The live site answers on https://thegiftsforever.com and redirects www to it, so a www address
 * is rewritten here: a canonical that points at a redirect is reported as broken by SEO tools.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace('://www.', '://').replace(/\/+$/, '');
