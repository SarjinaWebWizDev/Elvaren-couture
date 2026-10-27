// Plain-Node tests for catalogue data, pricing, discounts, shipping and filters.
// Usage: npm run test:logic
import assert from 'node:assert/strict';
import { products, getProduct } from '../src/data/products.js';
import { collections } from '../src/data/collections.js';
import { campaign } from '../src/data/campaign.js';
import { site } from '../src/data/site.js';
import { priceCart, validateCode, isOfferLive } from '../src/utils/pricing.js';
import { applyFilters, defaultFilters, parseFilters, filtersToParams } from '../src/utils/filter.js';
import { formatINR } from '../src/utils/currency.js';

let passed = 0;
const t = (name, fn) => {
  try {
    fn();
    passed++;
    console.log('  ✓', name);
  } catch (e) {
    console.error('  ✗', name, '\n    ', e.message);
    process.exitCode = 1;
  }
};

const EXPECTED = {
  'ivory-pearl-long-suit': ['product-ivory-pearl-long-suit.jpg', 2799],
  'sage-floral-long-suit': ['product-sage-floral-long-suit.jpg', 2299],
  'dusty-rose-long-suit': ['product-dusty-rose-long-suit.jpg', 2499],
  'midnight-black-long-suit': ['product-midnight-black-long-suit.jpg', 2999],
  'powder-blue-printed-suit': ['product-powder-blue-printed-suit.jpg', 1999],
  'champagne-zardozi-formal': ['product-champagne-zardozi-formal.jpg', 5499],
  'burgundy-velvet-formal': ['product-burgundy-velvet-formal.jpg', 5999],
  'antique-gold-chiffon-suit': ['product-antique-gold-chiffon-suit.jpg', 4999],
  'emerald-embellished-suit': ['product-emerald-embellished-suit.jpg', 5299],
  'black-antique-gold-suit': ['product-black-antique-gold-suit.jpg', 4799],
  'blush-pink-lehenga': ['product-blush-pink-lehenga.jpg', 7999],
  'ivory-pearl-work-lehenga': ['product-ivory-pearl-work-lehenga.jpg', 8499],
  'ruby-red-lehenga': ['product-ruby-red-lehenga.jpg', 9499],
  'sage-floral-lehenga': ['product-sage-floral-lehenga.jpg', 7499],
  'champagne-gold-lehenga': ['product-champagne-gold-lehenga.jpg', 8999],
  'ivory-short-shirt-gharara': ['product-ivory-short-shirt-gharara.jpg', 3499],
  'rose-pink-gharara': ['product-rose-pink-gharara.jpg', 3799],
  'mustard-festive-gharara': ['product-mustard-festive-gharara.jpg', 3299],
  'teal-mirror-work-gharara': ['product-teal-mirror-work-gharara.jpg', 4299],
  'black-antique-gharara': ['product-black-antique-gharara.jpg', 4499],
  'sand-beige-tailored-set': ['product-sand-beige-tailored-set.jpg', 2499],
  'ivory-straight-kurta-set': ['product-ivory-straight-kurta-set.jpg', 2299],
  'chocolate-minimal-suit': ['product-chocolate-minimal-suit.jpg', 2199],
  'olive-structured-set': ['product-olive-structured-set.jpg', 2399],
  'black-clean-cut-coord': ['product-black-clean-cut-coord.jpg', 2599],
};

console.log('Catalogue');
t('25 products, unique ids', () => {
  assert.equal(products.length, 25);
  assert.equal(new Set(products.map((p) => p.id)).size, 25);
});
t('every filename and price matches the brief exactly', () => {
  for (const [id, [file, price]] of Object.entries(EXPECTED)) {
    const p = getProduct(id);
    assert.ok(p, `missing ${id}`);
    assert.equal(p.image, `/images/products/${file}`, id);
    assert.equal(p.price, price, id);
  }
});
t('5 products in each of 5 collections', () => {
  assert.equal(collections.length, 5);
  for (const c of collections) assert.equal(products.filter((p) => p.collectionId === c.id).length, 5, c.id);
});
t('no invented sale prices', () => {
  for (const p of products) assert.ok(!('salePrice' in p) && !('comparePrice' in p));
});
t('eligible product ids all exist', () => {
  for (const id of campaign.offer.eligibleProductIds) assert.ok(getProduct(id), id);
});

console.log('Currency');
t('formats INR', () => {
  assert.equal(formatINR(2799), '₹2,799');
  assert.equal(formatINR(100000), '₹1,00,000');
});

console.log('Pricing');
const method = site.shipping.method;
const price = (lines, code = null, now) =>
  priceCart({ lines, getProduct, appliedCode: code, offer: campaign.offer, shippingMethod: method, now });
const L = (productId, qty, size = 'M') => ({ key: `${productId}__${size}`, productId, size, qty });

t('empty bag costs nothing', () => {
  const r = price([]);
  assert.equal(r.total, 0);
  assert.equal(r.shipping, 0);
});
t('below threshold pays flat shipping', () => {
  const r = price([L('powder-blue-printed-suit', 1)]); // 1999
  assert.equal(r.subtotal, 1999);
  assert.equal(r.shipping, method.flatRate);
  assert.equal(r.total, 1999 + method.flatRate);
});
t('at/above threshold ships free', () => {
  const r = price([L('powder-blue-printed-suit', 1), L('olive-structured-set', 1)]); // 1999+2399=4398
  assert.equal(r.shipping, 0);
  assert.equal(r.total, 4398);
});
t('quantities multiply into line totals', () => {
  const r = price([L('ivory-pearl-long-suit', 3)]);
  assert.equal(r.items[0].lineTotal, 8397);
});
t('same product in two sizes stays two lines', () => {
  const r = price([L('sage-floral-long-suit', 1, 'S'), L('sage-floral-long-suit', 1, 'L')]);
  assert.equal(r.items.length, 2);
  assert.equal(r.itemCount, 2);
});
t('FESTIVE10 discounts ONLY eligible items', () => {
  // eligible: sage-floral-long-suit 2299 ; not eligible: ruby-red-lehenga 9499
  const r = price([L('sage-floral-long-suit', 1), L('ruby-red-lehenga', 1)], 'FESTIVE10');
  assert.equal(r.subtotal, 2299 + 9499);
  assert.equal(r.discount, Math.round(2299 * 0.1)); // 230
  assert.equal(r.total, 2299 + 9499 - 230);
});
t('code is case-insensitive and trimmed', () => {
  const r = price([L('sage-floral-long-suit', 2)], '  festive10 ');
  assert.equal(r.discount, Math.round(4598 * 0.1));
});
t('discount applied before the free-shipping check', () => {
  // 3 x sage floral long suit = 6897 -> discount 690 -> 6207 (still above 3000)
  const r = price([L('sage-floral-long-suit', 3)], 'FESTIVE10');
  assert.equal(r.shipping, 0);
  // Just under threshold only because of the discount: 1 x dusty rose = 2499 + 1 x powder blue 1999 = 4498 -> disc 250 -> 4248 (free)
  const r2 = price([L('dusty-rose-long-suit', 1)], 'FESTIVE10'); // 2499 - 250 = 2249 -> pays shipping
  assert.equal(r2.discount, 250);
  assert.equal(r2.shipping, method.flatRate);
});
t('no discount without an applied code', () => {
  assert.equal(price([L('sage-floral-long-suit', 1)]).discount, 0);
});
t('code with no eligible items yields 0 and a note', () => {
  const r = price([L('ruby-red-lehenga', 1)], 'FESTIVE10');
  assert.equal(r.discount, 0);
  assert.ok(r.codeNote);
});
t('expired offer disables the code', () => {
  const offer = { ...campaign.offer, endsAt: '2020-01-01T00:00:00Z' };
  assert.equal(isOfferLive(offer, new Date('2026-10-25')), false);
  const r = priceCart({
    lines: [L('sage-floral-long-suit', 1)], getProduct, appliedCode: 'FESTIVE10',
    offer, shippingMethod: method, now: new Date('2026-10-25'),
  });
  assert.equal(r.discount, 0);
});

console.log('Code validation');
const v = (code, lines) => validateCode(code, { offer: campaign.offer, lines, getProduct });
t('rejects empty / wrong codes', () => {
  assert.equal(v('', []).ok, false);
  assert.equal(v('NOPE', [L('sage-floral-long-suit', 1)]).ok, false);
});
t('rejects when nothing eligible is in the bag', () => {
  assert.equal(v('FESTIVE10', [L('ruby-red-lehenga', 1)]).ok, false);
});
t('accepts with an eligible item', () => {
  const r = v('festive10', [L('rose-pink-gharara', 1)]);
  assert.equal(r.ok, true);
  assert.equal(r.code, 'FESTIVE10');
});

console.log('Filters');
t('search by name', () => {
  const r = applyFilters(products, { ...defaultFilters, q: 'lehenga' });
  assert.equal(r.length, 5);
});
t('collection + price range', () => {
  const r = applyFilters(products, { ...defaultFilters, collections: ['lehenga-atelier'], max: 8000 });
  assert.deepEqual(r.map((p) => p.id).sort(), ['blush-pink-lehenga', 'sage-floral-lehenga']);
});
t('sorting', () => {
  const asc = applyFilters(products, { ...defaultFilters, sort: 'price-asc' });
  const desc = applyFilters(products, { ...defaultFilters, sort: 'price-desc' });
  assert.equal(asc[0].price, 1999);
  assert.equal(desc[0].price, 9499);
  for (let i = 1; i < asc.length; i++) assert.ok(asc[i].price >= asc[i - 1].price);
  const newest = applyFilters(products, { ...defaultFilters, sort: 'newest' });
  for (let i = 1; i < newest.length; i++) assert.ok(newest[i].addedAt <= newest[i - 1].addedAt);
});
t('colour and size filters', () => {
  const black = applyFilters(products, { ...defaultFilters, colours: ['Black'] });
  assert.ok(black.length >= 4 && black.every((p) => p.colourFamily.includes('Black')));
  assert.equal(applyFilters(products, { ...defaultFilters, sizes: ['M'] }).length, 25);
});
t('festive edit shows exactly the eligible styles', () => {
  const r = applyFilters(products, { ...defaultFilters, edit: 'festive' });
  assert.equal(r.length, campaign.offer.eligibleProductIds.length);
});
t('URL params round-trip', () => {
  const f = { ...defaultFilters, q: 'rose', collections: ['gharara-edit'], colours: ['Pink'], min: 2000, max: 5000, sort: 'price-asc' };
  const back = parseFilters(filtersToParams(f));
  assert.deepEqual(back, f);
});

console.log(`\n${passed} checks passed${process.exitCode ? ' — WITH FAILURES' : ''}`);
