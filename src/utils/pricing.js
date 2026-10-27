// Pure pricing logic: offers, discount codes, shipping, totals.
// No React in here so it can be unit-tested with plain Node (npm run test:logic).

export const normaliseCode = (c) => String(c ?? '').trim().toUpperCase();

export function isOfferLive(offer, now = new Date()) {
  if (!offer || offer.enabled === false) return false;
  if (offer.startsAt && now < new Date(offer.startsAt)) return false;
  if (offer.endsAt && now > new Date(offer.endsAt)) return false;
  return true;
}

export const isProductEligible = (offer, productId, now = new Date()) =>
  isOfferLive(offer, now) && offer.eligibleProductIds.includes(productId);

export function shippingFor(afterDiscountSubtotal, method, hasItems = true) {
  if (!hasItems || !method) return 0;
  if (method.freeOver != null && afterDiscountSubtotal >= method.freeOver) return 0;
  return method.flatRate ?? 0;
}

/**
 * lines: [{ key, productId, size, qty }]
 * returns subtotal, discount, shipping, total and per-line detail.
 */
export function priceCart({ lines, getProduct, appliedCode, offer, shippingMethod, now = new Date() }) {
  const items = [];
  for (const l of lines) {
    const product = getProduct(l.productId);
    if (!product) continue;
    items.push({
      ...l,
      product,
      unitPrice: product.price,
      lineTotal: product.price * l.qty,
      eligible: Boolean(offer?.eligibleProductIds?.includes(product.id)),
    });
  }

  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  const codeApplies =
    Boolean(appliedCode) && normaliseCode(appliedCode) === normaliseCode(offer?.code) && isOfferLive(offer, now);
  const eligibleSubtotal = codeApplies
    ? items.filter((i) => i.eligible).reduce((s, i) => s + i.lineTotal, 0)
    : 0;

  let discount = 0;
  let codeNote = null;
  if (codeApplies) {
    if (eligibleSubtotal === 0) {
      codeNote = 'None of the items in your bag are eligible for this code.';
    } else if (subtotal < (offer.minSubtotal || 0)) {
      codeNote = 'Your bag is below the minimum for this code.';
    } else {
      discount = Math.min(eligibleSubtotal, Math.round((eligibleSubtotal * offer.value) / 100));
    }
  } else if (appliedCode) {
    codeNote = 'This code is no longer active.';
  }

  const afterDiscount = subtotal - discount;
  const shipping = shippingFor(afterDiscount, shippingMethod, items.length > 0);
  const total = afterDiscount + shipping;

  return {
    items,
    itemCount,
    subtotal,
    eligibleSubtotal,
    discount,
    discountLabel: codeApplies && discount > 0 ? `${offer.code} (${offer.value}% off eligible styles)` : null,
    codeNote,
    shipping,
    freeShippingGap:
      shippingMethod?.freeOver != null && items.length > 0 && afterDiscount < shippingMethod.freeOver
        ? shippingMethod.freeOver - afterDiscount
        : 0,
    total,
  };
}

export function validateCode(input, { offer, lines, getProduct, now = new Date() }) {
  const code = normaliseCode(input);
  if (!code) return { ok: false, message: 'Enter a promotional code.' };
  if (!offer || code !== normaliseCode(offer.code)) return { ok: false, message: 'That code is not valid.' };
  if (!isOfferLive(offer, now)) return { ok: false, message: 'This offer is not currently active.' };
  const eligible = lines.filter((l) => offer.eligibleProductIds.includes(l.productId) && getProduct(l.productId));
  if (eligible.length === 0) {
    return { ok: false, message: 'This code applies to selected styles only, and none are in your bag yet.' };
  }
  const subtotal = lines.reduce((s, l) => s + (getProduct(l.productId)?.price ?? 0) * l.qty, 0);
  if (subtotal < (offer.minSubtotal || 0)) {
    return { ok: false, message: 'Your bag is below the minimum order value for this code.' };
  }
  return { ok: true, code: offer.code, message: `${offer.code} applied to eligible styles.` };
}
