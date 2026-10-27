import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getProduct } from '../data/products';
import { site } from '../data/site';
import { campaign } from '../data/campaign';
import { priceCart, validateCode } from '../utils/pricing';
import { readJSON, writeJSON } from '../utils/storage';
import { useToast } from './ToastContext';

const KEY = 'elvaren.cart.v1';
const MAX = site.cart.maxQtyPerLine;

// A line is one product in one size: { key, productId, size, qty }.
export const lineKey = (productId, size) => `${productId}__${size || 'one-size'}`;

function sanitise(raw) {
  const lines = Array.isArray(raw?.lines) ? raw.lines : [];
  const out = [];
  for (const l of lines) {
    const p = getProduct(l?.productId);
    if (!p) continue;
    const qty = Math.floor(Number(l.qty));
    if (!Number.isFinite(qty) || qty < 1) continue;
    const size = p.sizes.length ? (p.sizes.includes(l.size) ? l.size : null) : null;
    if (p.sizes.length && !size) continue;
    const key = lineKey(p.id, size);
    const existing = out.find((o) => o.key === key);
    if (existing) existing.qty = Math.min(MAX, existing.qty + qty);
    else out.push({ key, productId: p.id, size, qty: Math.min(MAX, qty) });
  }
  return { lines: out, code: typeof raw?.code === 'string' ? raw.code : null };
}

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const { toast } = useToast();
  const [state, setState] = useState(() => sanitise(readJSON(KEY, null)));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    writeJSON(KEY, state);
  }, [state]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY) setState(sanitise(readJSON(KEY, null)));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const pricing = useMemo(
    () =>
      priceCart({
        lines: state.lines,
        getProduct,
        appliedCode: state.code,
        offer: campaign.offer,
        shippingMethod: site.shipping.method,
      }),
    [state],
  );

  const addItem = useCallback((productId, size, qty = 1) => {
    const p = getProduct(productId);
    if (!p) return { ok: false, message: 'This product is no longer available.' };
    if (p.sizes.length && !p.sizes.includes(size)) return { ok: false, message: 'Please select a size to continue.' };
    if (size && p.unavailableSizes.includes(size)) return { ok: false, message: 'That size is currently unavailable.' };

    const key = lineKey(p.id, p.sizes.length ? size : null);
    const want = Math.max(1, Math.floor(qty) || 1);
    const existing = stateRef.current.lines.find((l) => l.key === key);
    const nextQty = Math.min(MAX, (existing?.qty || 0) + want);
    const clamped = (existing?.qty || 0) + want > MAX;

    setState((s) => {
      const has = s.lines.some((l) => l.key === key);
      return {
        ...s,
        lines: has
          ? s.lines.map((l) => (l.key === key ? { ...l, qty: nextQty } : l))
          : [...s.lines, { key, productId: p.id, size: p.sizes.length ? size : null, qty: nextQty }],
      };
    });
    if (clamped) toast(`You can add up to ${MAX} of each style and size.`);
    setDrawerOpen(true);
    return { ok: true, clamped };
  }, [toast]);

  const setQty = useCallback((key, qty) => {
    const q = Math.max(1, Math.min(MAX, Math.floor(Number(qty)) || 1));
    setState((s) => ({ ...s, lines: s.lines.map((l) => (l.key === key ? { ...l, qty: q } : l)) }));
  }, []);

  const removeLine = useCallback((key) => {
    setState((s) => ({ ...s, lines: s.lines.filter((l) => l.key !== key) }));
  }, []);

  const applyCode = useCallback((input) => {
    const res = validateCode(input, { offer: campaign.offer, lines: stateRef.current.lines, getProduct });
    if (res.ok) setState((s) => ({ ...s, code: res.code }));
    return res;
  }, []);

  const removeCode = useCallback(() => setState((s) => ({ ...s, code: null })), []);
  const clearCart = useCallback(() => setState({ lines: [], code: null }), []);

  const value = useMemo(
    () => ({
      lines: state.lines,
      code: state.code,
      pricing,
      itemCount: pricing.itemCount,
      maxQty: MAX,
      addItem,
      setQty,
      removeLine,
      applyCode,
      removeCode,
      clearCart,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [state, pricing, addItem, setQty, removeLine, applyCode, removeCode, clearCart, drawerOpen],
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => useContext(CartCtx);
