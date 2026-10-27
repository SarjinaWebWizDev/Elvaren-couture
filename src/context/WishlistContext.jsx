import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProduct } from '../data/products';
import { readJSON, writeJSON } from '../utils/storage';
import { useToast } from './ToastContext';

const KEY = 'elvaren.wishlist.v1';
const WishCtx = createContext(null);

const load = () => {
  const raw = readJSON(KEY, []);
  return Array.isArray(raw) ? [...new Set(raw)].filter((id) => getProduct(id)) : [];
};

export function WishlistProvider({ children }) {
  const { toast } = useToast();
  const [ids, setIds] = useState(load);

  useEffect(() => {
    writeJSON(KEY, ids);
  }, [ids]);

  // Keep tabs in sync.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY) setIds(load());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const has = useCallback((id) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (id) => {
      const p = getProduct(id);
      if (!p) return false;
      const adding = !ids.includes(id);
      setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur]));
      toast(adding ? `${p.name} saved to your wishlist.` : `${p.name} removed from your wishlist.`);
      return adding;
    },
    [ids, toast],
  );

  const value = useMemo(() => ({ ids, count: ids.length, has, toggle }), [ids, has, toggle]);
  return <WishCtx.Provider value={value}>{children}</WishCtx.Provider>;
}

export const useWishlist = () => useContext(WishCtx);
