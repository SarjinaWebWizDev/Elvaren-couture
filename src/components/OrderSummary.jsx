import { formatINR } from '../utils/currency';
import { site } from '../data/site';

export default function OrderSummary({ pricing, showFreeShippingHint = true }) {
  const method = site.shipping.method;
  return (
    <dl className="space-y-2.5 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-espresso/75">Subtotal</dt>
        <dd>{formatINR(pricing.subtotal)}</dd>
      </div>
      {pricing.discount > 0 && (
        <div className="flex justify-between gap-4 text-burgundy">
          <dt>Discount · {pricing.discountLabel}</dt>
          <dd className="shrink-0">−{formatINR(pricing.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between gap-4">
        <dt className="text-espresso/75">{method.label}</dt>
        <dd>{pricing.items.length === 0 ? '—' : pricing.shipping === 0 ? 'Free' : formatINR(pricing.shipping)}</dd>
      </div>
      {pricing.codeNote && <p className="text-xs text-espresso/70">{pricing.codeNote}</p>}
      {showFreeShippingHint && pricing.freeShippingGap > 0 && (
        <p className="text-xs text-espresso/70">
          Add {formatINR(pricing.freeShippingGap)} more for free shipping.
        </p>
      )}
      <div className="flex items-baseline justify-between gap-4 border-t pt-3.5">
        <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.16em]">Total</dt>
        <dd className="font-display text-2xl">{formatINR(pricing.total)}</dd>
      </div>
      <p className="text-xs text-espresso/60">All prices in INR.</p>
    </dl>
  );
}
