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

/** Percent off shown next to the price, from the optional original (before-sale) price. */
export function percentOff(price, comparePrice) {
  const p = Number(price || 0);
  const c = Number(comparePrice || 0);
  return c > p && p > 0 ? Math.round(((c - p) / c) * 100) : 0;
}
