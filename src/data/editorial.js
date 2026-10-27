// Editorial photography — mood and campaign imagery for the hero, Our Story
// page and lookbook. These are NOT catalogue products: they have no price or
// product page, and are never presented as purchasable items.
//
// Files live in /public/images/editorial/. Dimensions are the real pixel size
// of each file so the browser can reserve space and avoid layout shift.

export const EDITORIAL_BASE = '/images/editorial/';

const p = (n, slug, w, h, alt, pos = '50% 12%') => ({
  id: `editorial-${n}`,
  n,
  file: `editorial-${String(n).padStart(2, '0')}-${slug}.jpg`,
  src: `${EDITORIAL_BASE}editorial-${String(n).padStart(2, '0')}-${slug}.jpg`,
  w,
  h,
  alt,
  pos,
});

export const photos = [
  p(1, 'sky-blue-embroidered-suit', 736, 1104, 'Model in a powder-blue embroidered long suit with a sheer organza dupatta, holding a matching potli bag against a soft arched backdrop', '52% 14%'),
  p(2, 'lilac-grey-lace-suit', 735, 1080, 'Model in a grey-lilac suit with ivory cutwork lace, floral embroidery and a tasselled dupatta', '50% 10%'),
  p(3, 'taupe-embellished-formal', 736, 1275, 'Model in a taupe formal suit with pearl and gold embroidery and a scalloped net dupatta', '50% 12%'),
  p(4, 'mauve-beaded-cape', 736, 1104, 'Model in a mauve sheer cape with beaded latticework over a satin slip dress', '45% 10%'),
  p(5, 'blush-lace-gown-jacket', 736, 1308, 'Model in a blush lace-embroidered open jacket over a pleated tulle gown, holding a clutch', '50% 8%'),
  p(6, 'sage-embroidered-long-jacket', 736, 1104, 'Model in a sage-green embroidered long jacket with beaded cuffs, holding a matching potli bag', '50% 8%'),
  p(7, 'champagne-jacket-sage-sharara', 736, 1104, 'Model in a champagne embroidered jacket with flared sleeves over pale sage wide-leg sharara trousers', '50% 10%'),
  p(8, 'grey-organza-peach-trim-set', 735, 993, 'Model in a grey organza shirt with peach trim and floral embroidery, with silver flared trousers', '50% 10%'),
  p(9, 'gold-tissue-jacket-flared-trousers', 736, 1102, 'Model in a gold tissue embroidered jacket with a scalloped cutwork hem and flared trousers', '50% 10%'),
  p(10, 'beige-organza-gharara', 729, 1303, 'Model in a sheer beige embroidered tunic with a mirror-work clutch, standing against a red brick wall', '50% 10%'),
  p(11, 'gold-tissue-tunic-peach-dupatta', 736, 1308, 'Model in a gold tissue tunic with pearl embroidery, a pink geometric panel and a peach tissue dupatta', '50% 10%'),
  p(12, 'maroon-anarkali', 736, 987, 'Model in a maroon anarkali with gold embroidery and a green-bordered dupatta, mid-twirl', '50% 20%'),
  p(13, 'crimson-embellished-jacket', 536, 988, 'Model in a crimson embroidered open-front jacket with gold motifs against a red velvet curtain', '50% 10%'),
  p(14, 'ivory-angrakha-gold-sharara', 736, 1182, 'Model in an ivory angrakha with gold embroidery, a crushed-gold sharara and a sheer gold dupatta', '50% 10%'),
  p(15, 'copper-rose-gharara', 736, 1030, 'Model in a copper-rose embroidered short kurta with a tiered gharara and a tissue dupatta', '50% 10%'),
  p(16, 'patchwork-lehenga-sage-gold', 736, 1103, 'Model in a patchwork lehenga in sage, mustard and rose with a scalloped embroidered dupatta', '50% 10%'),
  p(17, 'rose-gold-lehenga', 599, 1015, 'Model in a rose-gold metallic lehenga with hanging embroidered motifs and an embroidered blouse', '50% 10%'),
  p(18, 'ivory-gold-chevron-lehenga', 736, 1104, 'Model in an ivory and gold chevron-embroidered lehenga posed before a rose backdrop with scattered petals', '50% 62%'),
  p(19, 'orange-mirror-work-lehenga', 735, 1105, 'Model in an orange lehenga with a mirror-work blouse and a silver-and-orange panelled skirt', '50% 18%'),
  p(20, 'sage-tassel-tunic-tulip-trousers', 735, 1101, 'Model in a sage tunic with a beaded tassel necklace and tulip-hem trousers', '50% 10%'),
  p(21, 'beige-floral-applique-jacket-set', 736, 1104, 'Model in a beige jacket with large white and clay floral appliqué, with wide-leg trousers', '50% 12%'),
  p(22, 'blush-tissue-floral-tunic', 736, 1104, 'Close view of a blush tissue tunic with pastel floral embroidery at the yoke and flared sleeves', '50% 25%'),
  p(23, 'cream-coord-silk-scarf', 735, 1183, 'Model in a cream oversized tunic and culottes styled with a floral silk scarf in a garden', '50% 14%'),
  p(24, 'pistachio-tunic-organza-sleeves', 600, 900, 'Model in a pistachio tunic with embroidered organza sleeves and matching trousers', '50% 12%'),
];

const byN = new Map(photos.map((x) => [x.n, x]));
export const photo = (n) => byN.get(n);

// Where each photograph is used (for reference when swapping images).
export const placements = {
  heroMain: 1,
  heroInset: 7,
  ourStoryTriptych: [6, 5, 4],
  ourStoryPhilosophy: 3,
  ourStoryDetail: 22,
  ourStoryQuote: 18,
  ourStoryMoodboard: [2, 10, 20, 23],
  brandStory: 22,
  occasions: [18, 14, 2, 21],
  lookbook: [4, 6, 9, 13, 15, 16, 17, 19],
};
