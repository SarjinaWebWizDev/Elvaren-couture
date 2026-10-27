// ─────────────────────────────────────────────────────────────────────────────
// ÉLVARÉN — central site configuration.
// Everything the storefront says about shipping, returns, payments and contact
// is read from here, so policy pages, FAQs, cart maths and checkout stay
// consistent. Edit this one file to change them.
//
// IMPORTANT: values marked "DEFAULT" are sensible starting points, not
// confirmed business decisions. Review them before launch and set
// `policyReviewed: true` once you have.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  name: 'ÉLVARÉN',
  tagline: 'Elegance, Woven Into Every Detail.',
  description:
    'Contemporary luxury ethnic wear — long suits, heirloom formals, lehengas, ghararas and modern tailored sets.',

  // Set to true after you have reviewed the policy values and the Privacy /
  // Terms text. While false, policy pages show a small "draft" notice.
  policyReviewed: false,
  policyUpdated: '25 October 2026',

  // Customer-care details. Leave null until they really exist; the site then
  // says honestly that they are not configured instead of inventing them.
  contact: {
    email: null, // e.g. 'care@your-domain.com'
    phone: null, // e.g. '+91 00000 00000'
    address: null, // e.g. 'Studio address'
    hours: null, // e.g. 'Mon–Sat, 10:00–18:00 IST'
    // Optional JSON endpoint (POST) that receives the contact form.
    // Leave null to keep the form local-only (the site says so honestly).
    endpoint: null,
  },

  // Only configured, real accounts are rendered. Example:
  // { label: 'Instagram', url: 'https://instagram.com/your-handle' }
  social: [],

  // Optional JSON endpoints (POST). null = nothing is transmitted anywhere.
  newsletter: { endpoint: null },
  orders: { endpoint: null },

  cart: { maxQtyPerLine: 10 },

  // DEFAULT shipping policy used by the bag, checkout, FAQ and policy pages.
  shipping: {
    regionsServed: ['India'],
    method: {
      id: 'standard',
      label: 'Standard shipping',
      flatRate: 149, // ₹ charged when the order is below the free-shipping threshold
      freeOver: 3000, // ₹, compared against the subtotal AFTER discounts
    },
    // Set a real sentence here once timelines are known, e.g.
    // 'Orders are dispatched within 3 working days and delivered in 5–8 working days.'
    timelineText: null,
  },

  // DEFAULT returns & exchange policy.
  returns: {
    windowDays: 7,
    exchangeForSize: true,
    conditions: [
      'Items must be unworn, unwashed and unaltered, with all original tags attached.',
      'Embellished and made-to-order pieces are inspected on return.',
      'Please keep your order number handy when you contact customer care.',
    ],
  },

  // Payment options shown at checkout. Only enabled entries can be chosen.
  // No payment provider is connected, so online payment is shown as unavailable.
  payments: [
    {
      id: 'cod',
      label: 'Cash on delivery',
      description: 'Pay when your order arrives. Nothing is charged online.',
      enabled: true,
    },
    {
      id: 'online',
      label: 'Card, UPI or net banking',
      description: 'Online payment is not connected yet.',
      enabled: false,
    },
  ],
};

export const hasContact = () =>
  Boolean(site.contact.email || site.contact.phone || site.contact.address);
