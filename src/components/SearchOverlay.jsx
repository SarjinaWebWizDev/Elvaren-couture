import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import SidePanel from './SidePanel';
import ProductImage from './ProductImage';
import Price from './Price';
import { products } from '../data/products';
import { collections } from '../data/collections';
import { applyFilters, defaultFilters } from '../utils/filter';

export default function SearchOverlay({ onClose }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const term = q.trim();
  const matches = useMemo(
    () => (term ? applyFilters(products, { ...defaultFilters, q: term }) : []),
    [term],
  );

  const submit = (e) => {
    e.preventDefault();
    if (!term) return;
    navigate(`/shop?q=${encodeURIComponent(term)}`);
    onClose();
  };

  return (
    <SidePanel side="top" label="Search" onClose={onClose}>
      <div className="container-x py-6 sm:py-10">
        <form role="search" onSubmit={submit}>
          <label htmlFor="site-search" className="sr-only">
            Search ÉLVARÉN by product name
          </label>
          <div className="flex items-center gap-3 border-b border-espresso/40 pb-3 transition-colors focus-within:border-burgundy">
            <Search size={22} aria-hidden="true" />
            <input
              id="site-search"
              data-autofocus
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for a style…"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent font-display text-2xl placeholder:text-espresso/45 focus-visible:outline-none sm:text-3xl"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="-mr-2 grid size-11 place-items-center hover:text-burgundy"
            >
              <X size={22} />
            </button>
          </div>
        </form>

        <div className="mt-6 min-h-[8rem]" aria-live="polite">
          {term && matches.length > 0 && (
            <>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
                {matches.slice(0, 6).map((p) => (
                  <li key={p.id}>
                    <Link to={`/product/${p.id}`} onClick={onClose} className="group block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
                        <div className="absolute inset-0">
                          <ProductImage product={p} className="transition-transform duration-700 group-hover:scale-105" />
                        </div>
                      </div>
                      <p className="mt-2 line-clamp-2 font-display text-lg leading-tight group-hover:text-burgundy">{p.name}</p>
                      <p className="text-sm"><Price product={p} /></p>
                    </Link>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={submit} className="link-arrow mt-6">
                View all {matches.length} result{matches.length === 1 ? '' : 's'}
              </button>
            </>
          )}
          {term && matches.length === 0 && (
            <p className="py-6 text-espresso/75">
              No styles match “{term}”. Try a colour or style name, such as “ivory” or “lehenga”.
            </p>
          )}
          {!term && (
            <div>
              <p className="eyebrow mb-3">Explore</p>
              <ul className="flex flex-wrap gap-2">
                {collections.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/collections/${c.slug}`}
                      onClick={onClose}
                      className="inline-flex min-h-11 items-center border border-espresso/25 px-4 text-sm hover:border-espresso hover:bg-sand/60"
                    >
                      {c.short}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </SidePanel>
  );
}
