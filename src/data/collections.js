// The five ÉLVARÉN collections. `imageProductId` picks the supplied photograph
// used as the collection's fallback. `cover` (added below) is the editorial
// photograph shown on collection cards; files live in /public/images/collections/.

export const collections = [
  {
    id: 'long-suit-edit',
    slug: 'long-suit-edit',
    number: '01',
    name: 'The Long Suit Edit',
    short: 'Long Suit Edit',
    description:
      'Fluid tunics, soft embroidery and everyday elegance — long suits made for gatherings, daytime celebrations and quietly polished dressing.',
    blurb: 'Everyday elegance in soft palettes and gentle embroidery.',
    imageProductId: 'ivory-pearl-long-suit',
    position: '50% 14%',
  },
  {
    id: 'heirloom-edit',
    slug: 'heirloom-edit',
    number: '02',
    name: 'The Heirloom Edit',
    short: 'Heirloom Edit',
    description:
      'Embroidered formals in velvet, gold and deep jewel tones — pieces designed to be worn to the evening’s most important moments.',
    blurb: 'Embroidered formals in velvet, gold and jewel tones.',
    imageProductId: 'champagne-zardozi-formal',
    position: '50% 12%',
  },
  {
    id: 'lehenga-atelier',
    slug: 'lehenga-atelier',
    number: '03',
    name: 'The Lehenga Atelier',
    short: 'Lehenga Atelier',
    description:
      'Full-circle skirts, pearl and mirror work, and richly worked blouses — lehengas for weddings, receptions and festive evenings.',
    blurb: 'Full skirts, pearl work and richly worked blouses.',
    imageProductId: 'ivory-pearl-work-lehenga',
    position: '50% 18%',
  },
  {
    id: 'gharara-edit',
    slug: 'gharara-edit',
    number: '04',
    name: 'The Gharara Edit',
    short: 'Gharara Edit',
    description:
      'Short shirts, gathered ghararas and sheer dupattas — a romantic, festive silhouette with embroidered hems and gentle movement.',
    blurb: 'Short shirts and gathered ghararas for festive evenings.',
    imageProductId: 'black-antique-gharara',
    position: '50% 14%',
  },
  {
    id: 'modern-form-edit',
    slug: 'modern-form-edit',
    number: '05',
    name: 'The Modern Form Edit',
    short: 'Modern Form Edit',
    description:
      'Clean lines, considered tailoring and minimal detail — contemporary sets and co-ords for work, travel and understated occasions.',
    blurb: 'Clean lines and minimal tailoring for modern wardrobes.',
    imageProductId: 'sand-beige-tailored-set',
    position: '50% 10%',
  },
];

export const getCollection = (idOrSlug) =>
  collections.find((c) => c.id === idOrSlug || c.slug === idOrSlug);

const cov = (n, slug, w, h, alt) => ({
  file: `collection-${n}-${slug}.jpg`,
  src: `/images/collections/collection-${n}-${slug}.jpg`,
  w,
  h,
  alt,
});

const COVERS = {
  'long-suit-edit': cov('01', 'long-suit-edit', 736, 1308, 'Model in an orange brocade long suit with gold embroidery and matching palazzo trousers, reflected in mirrors'),
  'heirloom-edit': cov('02', 'heirloom-edit', 736, 1030, 'Model in a blush organza suit with gold embroidery and a rose-pink dupatta'),
  'lehenga-atelier': cov('03', 'lehenga-atelier', 736, 1104, 'Model in a pink lehenga with rose appliqué, a gold embroidered blouse and a magenta net dupatta'),
  'gharara-edit': cov('04', 'gharara-edit', 736, 1349, 'Model in a sage-green embroidered peplum top with a gharara and net dupatta beneath chandeliers'),
  'modern-form-edit': cov('05', 'modern-form-edit', 736, 920, 'Model in an olive tunic with pearl embroidery and flared sleeves beside sheer curtains'),
};

collections.forEach((c) => {
  c.cover = COVERS[c.id];
});
