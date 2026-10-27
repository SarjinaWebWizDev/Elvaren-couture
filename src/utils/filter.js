// Pure filtering / sorting helpers for the catalogue. URL-driven (search params).
import { campaign } from '../data/campaign.js';
import { collections } from '../data/collections.js';
import { isOfferLive } from './pricing.js';

export const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

export const defaultFilters = {
  q: '',
  collections: [],
  colours: [],
  sizes: [],
  min: null,
  max: null,
  inStock: false,
  sort: 'featured',
  onlyNew: false,
  edit: '',
};

const list = (v) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : []);
const num = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export function parseFilters(sp) {
  const sort = sp.get('sort');
  return {
    q: sp.get('q') || '',
    collections: list(sp.get('collection')).filter((id) => collections.some((c) => c.id === id)),
    colours: list(sp.get('colour')),
    sizes: list(sp.get('size')),
    min: num(sp.get('min')),
    max: num(sp.get('max')),
    inStock: sp.get('instock') === '1',
    sort: SORTS.some((s) => s.value === sort) ? sort : 'featured',
    onlyNew: sp.get('new') === '1',
    edit: sp.get('edit') === 'festive' ? 'festive' : '',
  };
}

export function filtersToParams(f) {
  const p = new URLSearchParams();
  if (f.q) p.set('q', f.q);
  if (f.collections.length) p.set('collection', f.collections.join(','));
  if (f.colours.length) p.set('colour', f.colours.join(','));
  if (f.sizes.length) p.set('size', f.sizes.join(','));
  if (f.min != null) p.set('min', String(f.min));
  if (f.max != null) p.set('max', String(f.max));
  if (f.inStock) p.set('instock', '1');
  if (f.sort && f.sort !== 'featured') p.set('sort', f.sort);
  if (f.onlyNew) p.set('new', '1');
  if (f.edit) p.set('edit', f.edit);
  return p;
}

const sizeAvailable = (p, size) => p.sizes.includes(size) && !p.unavailableSizes.includes(size);
const hasStock = (p) => p.inStock !== false && p.sizes.some((s) => !p.unavailableSizes.includes(s));

export function applyFilters(all, f, now = new Date()) {
  const q = f.q.trim().toLowerCase();
  let out = all.filter((p) => {
    if (q && !`${p.name} ${p.colour}`.toLowerCase().includes(q)) return false;
    if (f.collections.length && !f.collections.includes(p.collectionId)) return false;
    if (f.colours.length && !p.colourFamily.some((c) => f.colours.includes(c))) return false;
    if (f.sizes.length && !f.sizes.some((s) => sizeAvailable(p, s))) return false;
    if (f.min != null && p.price < f.min) return false;
    if (f.max != null && p.price > f.max) return false;
    if (f.inStock && !hasStock(p)) return false;
    if (f.onlyNew && !p.isNewArrival) return false;
    if (f.edit === 'festive') {
      const offer = campaign.offer;
      if (!(isOfferLive(offer, now) && offer.eligibleProductIds.includes(p.id))) return false;
    }
    return true;
  });
  out = [...out];
  switch (f.sort) {
    case 'price-asc':
      out.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      out.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      out.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
      break;
    default:
      break; // catalogue order
  }
  return out;
}

export const priceBounds = (list_) => {
  if (!list_.length) return { min: 0, max: 0 };
  const prices = list_.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
};

export function activeCount(f, { ignoreCollections = false } = {}) {
  return (
    (f.q ? 1 : 0) +
    (ignoreCollections ? 0 : f.collections.length) +
    f.colours.length +
    f.sizes.length +
    (f.min != null ? 1 : 0) +
    (f.max != null ? 1 : 0) +
    (f.inStock ? 1 : 0) +
    (f.onlyNew ? 1 : 0) +
    (f.edit ? 1 : 0)
  );
}
