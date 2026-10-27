import { formatINR } from '../utils/currency';

// Shows the selling price. A struck-through comparison price appears ONLY when
// the product record has a real `comparePrice` higher than its price.
export default function Price({ product, className = '' }) {
  const hasCompare = typeof product.comparePrice === 'number' && product.comparePrice > product.price;
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="font-medium tracking-wide">{formatINR(product.price)}</span>
      {hasCompare && (
        <>
          <s className="text-[0.85em] text-espresso/55" aria-label={`Original price ${formatINR(product.comparePrice)}`}>
            {formatINR(product.comparePrice)}
          </s>
        </>
      )}
    </span>
  );
}
