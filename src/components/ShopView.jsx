import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductGrid from './ProductGrid';
import FilterPanel from './FilterPanel';
import EmptyState from './EmptyState';
import Portal from './Portal';
import SidePanel from './SidePanel';
import { products } from '../data/products';
import { campaign } from '../data/campaign';
import { SORTS, activeCount, applyFilters, defaultFilters, filtersToParams, parseFilters } from '../utils/filter';

function FilterDrawer({ initial, fixedCollectionId, onApply, onClose, resetTo }) {
  const [draft, setDraft] = useState(initial);
  return (
    <SidePanel side="right" label="Filters" onClose={onClose}>
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h2 className="font-display text-2xl">Filters</h2>
        <button type="button" onClick={onClose} aria-label="Close filters" className="-mr-2 grid size-11 place-items-center hover:text-burgundy">
          <X size={22} />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <FilterPanel value={draft} onChange={setDraft} idPrefix="m" showCollections={!fixedCollectionId} />
      </div>
      <div className="grid grid-cols-2 gap-3 border-t bg-ivory px-5 py-4">
        <button type="button" className="btn btn-outline" onClick={() => setDraft(resetTo)}>
          Reset
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            onApply(draft);
            onClose();
          }}
        >
          Apply
        </button>
      </div>
    </SidePanel>
  );
}

/**
 * Filterable, sortable product listing. State lives in the URL so filtered
 * views are shareable and survive refresh. `fixedCollectionId` locks it to one
 * collection (collection pages).
 */
export default function ShopView({ fixedCollectionId = null }) {
  const [sp, setSp] = useSearchParams();
  const [drawer, setDrawer] = useState(false);

  const parsed = useMemo(() => parseFilters(sp), [sp]);
  const filters = useMemo(
    () => (fixedCollectionId ? { ...parsed, collections: [fixedCollectionId] } : parsed),
    [parsed, fixedCollectionId],
  );
  const pool = useMemo(
    () => (fixedCollectionId ? products.filter((p) => p.collectionId === fixedCollectionId) : products),
    [fixedCollectionId],
  );
  const results = useMemo(() => applyFilters(pool, filters), [pool, filters]);

  const commit = (next) => {
    const clean = fixedCollectionId ? { ...next, collections: [] } : next;
    setSp(filtersToParams(clean), { replace: true });
  };
  const resetTo = fixedCollectionId ? { ...defaultFilters, collections: [fixedCollectionId] } : defaultFilters;
  const active = activeCount(filters, { ignoreCollections: Boolean(fixedCollectionId) });

  return (
    <div className="container-x pb-20 sm:pb-28">
      {filters.edit === 'festive' && (
        <div className="mb-8 border border-burgundy/30 bg-burgundy/[0.05] p-4 text-sm sm:p-5">
          <p className="font-display text-xl">{campaign.name}</p>
          <p className="mt-1 text-espresso/80">
            Showing the styles eligible for <strong>{campaign.offer.code}</strong> ({campaign.offer.value}% off). Enter the code in your bag
            to apply it.
          </p>
        </div>
      )}

      <div className="grid gap-x-10 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[270px_minmax(0,1fr)]">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-h)+1.25rem)] max-h-[calc(100dvh-var(--header-h)-2.5rem)] overflow-y-auto pr-3">
            <FilterPanel value={filters} onChange={commit} showCollections={!fixedCollectionId} />
            {active > 0 && (
              <button type="button" onClick={() => commit(resetTo)} className="btn btn-outline mt-5 w-full">
                Reset filters
              </button>
            )}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 sm:max-w-sm sm:flex-1">
              <label htmlFor="shop-search" className="sr-only">
                Search products by name
              </label>
              <div className="relative">
                <Search size={17} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso/60" />
                <input
                  id="shop-search"
                  type="search"
                  value={filters.q}
                  onChange={(e) => commit({ ...filters, q: e.target.value })}
                  placeholder="Search by name or colour"
                  className="field pl-10"
                />
              </div>
            </div>

            <div className="flex items-end gap-3">
              <button
                type="button"
                onClick={() => setDrawer(true)}
                aria-haspopup="dialog"
                className="btn btn-outline flex-1 lg:hidden"
              >
                <SlidersHorizontal size={16} /> Filters{active > 0 ? ` (${active})` : ''}
              </button>
              <div className="flex-1 sm:flex-none">
                <label htmlFor="shop-sort" className="sr-only">
                  Sort products
                </label>
                <select
                  id="shop-sort"
                  value={filters.sort}
                  onChange={(e) => commit({ ...filters, sort: e.target.value })}
                  className="field w-full sm:w-[210px]"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <p className="mb-6 flex flex-wrap items-center justify-between gap-2 text-sm text-espresso/75" aria-live="polite">
            <span>
              {results.length === pool.length
                ? `${results.length} styles`
                : `Showing ${results.length} of ${pool.length} styles`}
            </span>
            {active > 0 && (
              <button type="button" onClick={() => commit(resetTo)} className="link-quiet inline-flex min-h-11 items-center px-1">
                Reset filters
              </button>
            )}
          </p>

          {results.length > 0 ? (
            <ProductGrid products={results} eagerCount={4} />
          ) : (
            <EmptyState
              title="No styles match your search"
              actions={
                <button type="button" className="btn btn-primary" onClick={() => commit(resetTo)}>
                  Reset filters
                </button>
              }
            >
              Try a different colour, size or price range, or clear your filters to see the full collection.
            </EmptyState>
          )}
        </div>
      </div>

      <Portal>
        <AnimatePresence>
          {drawer && (
            <FilterDrawer
              key="filters"
              initial={filters}
              fixedCollectionId={fixedCollectionId}
              resetTo={resetTo}
              onApply={commit}
              onClose={() => setDrawer(false)}
            />
          )}
        </AnimatePresence>
      </Portal>
    </div>
  );
}
