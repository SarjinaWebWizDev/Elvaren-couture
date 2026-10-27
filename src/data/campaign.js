// Seasonal campaign configuration — adjust offers in one place.
// The discount code only works (and is only advertised) while `offer.enabled`
// is true and the current date is inside the optional startsAt/endsAt window.
// There are deliberately no countdown timers or scarcity messages.

export const campaign = {
  id: 'festive-florals',
  name: 'The Festive Florals Edit',
  announcement: 'Festive Season Edit — Discover Timeless Occasion Wear.',
  copy: 'Soft florals. Thoughtful details. Unforgettable celebrations.',
  imageProductIds: ['sage-floral-lehenga', 'sage-floral-long-suit', 'dusty-rose-long-suit'],

  offer: {
    enabled: true,
    code: 'FESTIVE10',
    type: 'percent',
    value: 10,
    headline: 'Celebrate the Season — Enjoy 10% Off Selected Styles.',
    shortLabel: '10% off',
    // Optional ISO dates, e.g. '2026-11-30T23:59:59+05:30'. null = no end date shown or enforced.
    startsAt: null,
    endsAt: null,
    // Minimum merchandise subtotal (₹) before the code applies. 0 = none.
    minSubtotal: 0,
    // Eligibility: ONLY these products receive the discount.
    eligibleProductIds: [
      'sage-floral-long-suit',
      'dusty-rose-long-suit',
      'ivory-pearl-long-suit',
      'sage-floral-lehenga',
      'blush-pink-lehenga',
      'rose-pink-gharara',
    ],
    terms: [
      'Applies to the selected styles marked FESTIVE10 only.',
      'Enter the code in your bag; the discount is calculated on eligible items.',
      'Shipping is calculated after the discount.',
    ],
  },
};
