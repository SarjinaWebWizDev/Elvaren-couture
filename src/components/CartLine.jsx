import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import ProductImage from './ProductImage';
import QuantitySelector from './QuantitySelector';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/currency';
import { campaign } from '../data/campaign';

export default function CartLine({ item, onNavigate, large = false }) {
  const { setQty, removeLine, maxQty, code } = useCart();
  const { product } = item;
  const eligibleCodeApplied = code && item.eligible;

  return (
    <li className="flex gap-4 border-b py-5 last:border-b-0">
      <Link
        to={`/product/${product.id}`}
        onClick={onNavigate}
        tabIndex={-1}
        aria-hidden="true"
        className={`relative block shrink-0 overflow-hidden bg-sand ${large ? 'w-28 sm:w-32' : 'w-20'} aspect-[3/4]`}
      >
        <div className="absolute inset-0">
          <ProductImage product={product} />
        </div>
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg leading-tight sm:text-xl">
              <Link to={`/product/${product.id}`} onClick={onNavigate} className="hover:text-burgundy">
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-espresso/70">
              {item.size ? `Size ${item.size}` : 'One size'} · {formatINR(item.unitPrice)}
            </p>
            {eligibleCodeApplied && (
              <p className="mt-1 text-xs font-medium text-burgundy">{campaign.offer.code} applies to this style</p>
            )}
          </div>
          <p className="shrink-0 text-sm font-medium">{formatINR(item.lineTotal)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantitySelector
            size="sm"
            value={item.qty}
            max={maxQty}
            label={`Quantity for ${product.name}, size ${item.size || 'one size'}`}
            onChange={(q) => setQty(item.key, q)}
          />
          <button
            type="button"
            onClick={() => removeLine(item.key)}
            aria-label={`Remove ${product.name}, size ${item.size || 'one size'}, from bag`}
            className="inline-flex min-h-11 items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-[0.14em] text-espresso/75 hover:text-burgundy"
          >
            <Trash2 size={15} /> Remove
          </button>
        </div>
      </div>
    </li>
  );
}
