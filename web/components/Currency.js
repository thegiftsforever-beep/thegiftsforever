'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { IconChevronDown, IconGlobe } from './Icons';

const KEY = 'tgf_currency';
const CurrencyCtx = createContext({ code: 'PKR', setCode: () => {}, format: (n) => String(n), codes: ['PKR'] });

/** Display-only conversion: orders are always placed and stored in PKR. */
export function CurrencyProvider({ rates, children }) {
  const [code, setCode] = useState('PKR');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved && rates[saved]) setCode(saved);
    } catch {}
  }, [rates]);

  const value = useMemo(
    () => ({
      code,
      codes: Object.keys(rates),
      setCode: (c) => {
        setCode(c);
        try { localStorage.setItem(KEY, c); } catch {}
      },
      format: (n) => {
        const v = Number(n || 0) * (rates[code] || 1);
        return code === 'PKR'
          ? 'PKR ' + Math.round(v).toLocaleString('en-PK')
          : `${code} ${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      },
    }),
    [code, rates]
  );

  return <CurrencyCtx.Provider value={value}>{children}</CurrencyCtx.Provider>;
}

export const useCurrency = () => useContext(CurrencyCtx);

export function Price({ value }) {
  return <>{useCurrency().format(value)}</>;
}

export function CurrencySelect({ className = '' }) {
  const { code, codes, setCode } = useCurrency();
  const [open, setOpen] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!box.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div ref={box} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg bg-wine py-2.5 pl-3 pr-2.5 text-sm font-bold text-ink transition hover:bg-wine-dark"
      >
        <IconGlobe width={20} height={20} />
        {code}
        <IconChevronDown width={16} height={16} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul role="listbox" className="absolute right-0 top-full z-50 mt-1 max-h-80 w-32 overflow-y-auto rounded-lg bg-white py-1 shadow-xl ring-1 ring-ink/10">
          {codes.map((c) => (
            <li key={c}>
              <button
                type="button"
                role="option"
                aria-selected={c === code}
                onClick={() => { setCode(c); setOpen(false); }}
                className={`block w-full border-l-2 px-4 py-2 text-left text-sm font-semibold hover:bg-blush ${c === code ? 'border-ink' : 'border-transparent'}`}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
