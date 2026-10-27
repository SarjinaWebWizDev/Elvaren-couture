import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import SidePanel from './SidePanel';
import ProductImage from './ProductImage';
import SizeSelector from './SizeSelector';
import Price from './Price';
import WishlistButton from './WishlistButton';
import { useCart } from '../context/CartContext';
import { getCollection } from '../data/collections';
import { campaign } from '../data/campaign';
import { isProductEligible } from '../utils/pricing';

export default function QuickView({ product, onClose }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(null);
  const [error, setError] = useState('');
  const collection = getCollection(product.collectionId);
  const festive = isProductEligible(campaign.offer, product.id);

  const add = () => {
    const res = addItem(product.id, size, 1);
    if (!res.ok) {
      setError(res.message);
      document.querySelector('#qv-size-group input:not(:disabled)')?.focus();
      return;
    }
    onClose();
  };

  return (
    <SidePanel side="center" label={`Quick view: ${product.name}`} onClose={onClose}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close quick view"
        className="absolute right-2 top-2 z-10 grid size-11 place-items-center bg-ivory/90 hover:text-burgundy"
      >
        <X size={20} />
      </button>
      <div className="grid sm:grid-cols-[1fr_1.05fr]">
        <div className="relative aspect-[4/5] bg-sand sm:aspect-auto sm:min-h-[560px]">
          <div className="absolute inset-0">
            <ProductImage product={product} eager />
          </div>
        </div>
        <div className="flex flex-col gap-5 p-6 sm:p-9">
          <div>
            <p className="eyebrow">{collection.name}</p>
            <h2 className="display-md mt-2">{product.name}</h2>
            <p className="mt-3 text-lg">
              <Price product={product} />
            </p>
            {festive && (
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-burgundy">
                {campaign.offer.code} · {campaign.offer.shortLabel} at your bag
              </p>
            )}
          </div>
          <p className="text-[0.95rem] text-espresso/80">{product.description}</p>
          <SizeSelector
            product={product}
            value={size}
            onChange={(s) => {
              setSize(s);
              setError('');
            }}
            error={error}
            id="qv-size"
          />
          <div className="mt-1 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={add} className="btn btn-primary flex-1">
              Add to Bag
            </button>
            <WishlistButton productId={product.id} variant="button" showLabel />
          </div>
          <Link to={`/product/${product.id}`} onClick={onClose} className="link-arrow self-start">
            View full details
          </Link>
        </div>
      </div>
    </SidePanel>
  );
}
