import { Dancing_Script, Inter, Poppins } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import { CurrencyProvider } from '@/components/Currency';
import HeaderClient from '@/components/HeaderClient';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import { getAllCategories, getFooterPages, getMenuCategories, getRates, getSite } from '@/lib/data';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const dancing = Dancing_Script({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-dancing' });
const poppins = Poppins({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-poppins' });

export const dynamic = 'force-dynamic';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Send Gifts to Pakistan Online | Same Day Delivery - TheGiftsForever',
    template: '%s | TheGiftsForever',
  },
  description:
    'Send flowers, cakes, chocolates, gift hampers and personalised gifts to Pakistan. Same-day delivery in Karachi and fast nationwide delivery.',
  alternates: { canonical: '/' },
  openGraph: { siteName: 'TheGiftsForever', type: 'website', images: [{ url: '/og.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

export default async function RootLayout({ children }) {
  const [site, menu, categories, pages, rates] = await Promise.all([getSite(), getMenuCategories(), getAllCategories(), getFooterPages(), getRates()]);
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${dancing.variable}`}>
      <body className="font-sans antialiased">
        <CurrencyProvider rates={rates}>
          <CartProvider>
            <HeaderClient menu={menu} site={site} />
            <main className="min-h-[60vh]">{children}</main>
            <CartDrawer />
            <Footer site={site} categories={categories.filter((c) => !c.parent)} pages={pages} />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
