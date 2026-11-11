'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useCart } from './CartProvider';
import { Price } from './Currency';
import { IconArrowRight, IconMinus, IconPlus, IconTrash, IconX } from './Icons';
import { img, salePrice } from '@/lib/utils';

const direct = (src) => src?.startsWith('/api/uploads/');

/** Slide-in cart from the right, plus a "View Cart" bar at the bottom that reopens it. */
export default function CartDrawer() {
  const { items, ready, count, subtotal, add, setQty, remove, drawer, openCart, closeCart } = useCart();
  const pathname = usePathname();
  const { open, suggestions } = drawer;

  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === 'Escape' && closeCart();
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open, closeCart]);

  const extras = suggestions.filter((s) => !items.some((i) => i.productId === s._id)).slice(0, 4);
  const hideBar = !ready || !count || open || pathname === '/cart' || pathname === '/checkout';

  return (
    <>
      {!hideBar && (
        <button
          onClick={() => openCart()}
          className="fixed bottom-4 left-4 right-24 z-40 flex animate-rise items-center gap-3 rounded-xl bg-wine px-4 py-3 text-white shadow-2xl sm:left-1/2 sm:right-auto sm:w-[420px] sm:-translate-x-1/2"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white text-sm font-bold">{count}</span>
          <span className="flex-1 text-center font-bold">View Cart</span>
          <span className="font-bold"><Price value={subtotal} /></span>
        </button>
      )}

      <div className={`fixed inset-0 z-[60] transition ${open ? 'visible' : 'invisible'}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-ink/50 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={closeCart} />
        <aside
          role="dialog"
          aria-label="Your cart"
          className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
            <h2 className="font-display text-xl font-semibold">Your Cart</h2>
            <button onClick={closeCart} aria-label="Close cart" className="rounded border border-ink/20 p-1"><IconX width={18} height={18} /></button>
          </div>

          <div className="flex-1 overflow-y-auto px-5">
            {!items.length && <p className="py-10 text-center text-muted">Your cart is empty.</p>}
            <ul className="divide-y divide-ink/5">
              {items.map((it) => (
                <li key={it.key} className="flex gap-3 py-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-blush">
                    <Image src={it.image || '/placeholder.svg'} alt="" fill sizes="64px" unoptimized={direct(it.image)} className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium">{it.name}</p>
                    <p className="mt-1 text-sm font-semibold text-wine"><Price value={it.price * it.qty} /></p>
                  </div>
                  <div className="flex h-fit items-center rounded-lg border border-ink/15">
                    {it.qty > 1 ? (
                      <button onClick={() => setQty(it.key, it.qty - 1)} className="p-2" aria-label="Decrease"><IconMinus width={14} height={14} /></button>
                    ) : (
                      <button onClick={() => remove(it.key)} className="p-2 text-red-600" aria-label="Remove"><IconTrash width={14} height={14} /></button>
                    )}
                    <span className="w-6 text-center text-sm">{it.qty}</span>
                    <button onClick={() => setQty(it.key, it.qty + 1)} className="p-2" aria-label="Increase"><IconPlus width={14} height={14} /></button>
                  </div>
                </li>
              ))}
            </ul>

            {extras.length > 0 && (
              <div className="border-t border-ink/10 py-4">
                <h3 className="mb-3 text-sm font-semibold">Add something extra</h3>
                <ul className="space-y-2">
                  {extras.map((s) => (
                    <li key={s._id} className="flex items-center gap-3 rounded-xl border border-ink/5 p-2">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-blush">
                        <Image src={img(s.coverImage)} alt="" fill sizes="48px" unoptimized={direct(s.coverImage)} className="object-cover" />
                      </div>
                      <span className="line-clamp-1 flex-1 text-sm">{s.name}</span>
                      <span className="text-sm font-semibold text-wine"><Price value={salePrice(s.price)} /></span>
                      <button
                        onClick={() => add({ productId: s._id, slug: s.slug, name: s.name, image: img(s.coverImage), price: salePrice(s.price), qty: 1, variations: {}, freeDelivery: !!s.freeDelivery, options: {} }, { silent: true })}
                        className="rounded-full bg-wine p-1.5 text-white"
                        aria-label={`Add ${s.name}`}
                      >
                        <IconPlus width={14} height={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link href="/categories" onClick={closeCart} className="block border-t border-ink/10 py-4 text-sm text-muted hover:text-wine">+ Add more items</Link>
          </div>

          <div className="border-t border-ink/10 p-5">
            <div className="mb-4 flex justify-between text-base font-semibold"><span>Total</span><span><Price value={subtotal} /></span></div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className={`btn-wine w-full rounded-lg py-3.5 ${items.length ? '' : 'pointer-events-none opacity-50'}`}
            >
              Check Out <IconArrowRight width={18} height={18} />
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
