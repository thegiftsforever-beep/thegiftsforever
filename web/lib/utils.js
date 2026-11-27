export function slugify(s = '') {
  return String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

export function money(n) {
  return 'Rs. ' + Number(n || 0).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** The entered price is what the customer pays. */
export function salePrice(price) {
  return Math.round(Number(price || 0));
}


/**
 * Fixes rich text pasted from Google Docs, where every line can arrive as <h1 aria-level="N">.
 * Each heading becomes the level it really is (h1-h6 from aria-level), so the page keeps one real H1.
 */
export function cleanHtml(html = '') {
  return String(html || '')
    // Google Docs adds inline font sizes, colours and a wrapper span that override the page styles
    .replace(/\s(?:style|dir)="[^"]*"/gi, '')
    .replace(/<span id="docs-internal-guid[^"]*">/gi, '<span>')
    // drop list items that hold nothing but spaces, <br> or empty paragraphs
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (li, inner) => (inner.replace(/<[^>]+>|&nbsp;|\s/g, '') ? li : ''))
    .replace(/<h([1-6])([^>]*?)\saria-level="([1-6])"([^>]*)>([\s\S]*?)<\/h\1>/gi, (_, _l, a, lvl, b, inner) => `<h${lvl}${a}${b}>${inner}</h${lvl}>`);
}

/** True when the HTML has its own H1, so the page title should not also be one. */
export const hasH1 = (html = '') => /<h1[\s>]/i.test(html || '');

export function pkr(n) {
  return 'PKR ' + Math.round(Number(n || 0)).toLocaleString('en-PK');
}

/** Image src safe for the storefront: legacy disk uploads (/uploads/...) don't exist on serverless. */
export function img(url) {
  if (!url || url.startsWith('/uploads/')) return '/placeholder.svg';
  return url;
}

export const PROVINCES = {
  Sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpur Khas', 'Other'],
  Punjab: ['Lahore', 'Rawalpindi', 'Faisalabad', 'Multan', 'Sialkot', 'Gujranwala', 'Bahawalpur', 'Sargodha', 'Other'],
  'Islamabad Capital Territory': ['Islamabad'],
  'Khyber Pakhtunkhwa': ['Peshawar', 'Abbottabad', 'Mardan', 'Swat', 'Other'],
  Balochistan: ['Quetta', 'Gwadar', 'Other'],
  'Azad Kashmir': ['Muzaffarabad', 'Mirpur', 'Other'],
  'Gilgit-Baltistan': ['Gilgit', 'Skardu', 'Other'],
};

/** Free when every item ships free, or the subtotal reaches the admin threshold (0 turns that off). */
export function deliveryFee(option, subtotal, freeOver, allFree = false) {
  if (allFree || (freeOver > 0 && subtotal >= freeOver)) return 0;
  return Number(option?.price || 0);
}
