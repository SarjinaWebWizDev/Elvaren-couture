import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Eye } from 'lucide-react';
import ProductImage from './ProductImage';
import WishlistButton from './WishlistButton';
import Price from './Price';
import QuickView from './QuickView';
import Portal from './Portal';
import { getCollection } from '../data/collections';
import { campaign } from '../data/campaign';
import { isProductEligible } from '../utils/pricing';

export default function ProductCard({ product, priority = false }) {
  const [quick, setQuick] = useState(false);
  const collection = getCollection(product.collectionId);
  const festive = isProductEligible(campaign.offer, product.id);

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
        {/* Decorative duplicate of the title link, so only one link per card is announced. */}
        <Link to={`/product/${product.id}`} tabIndex={-1} aria-hidden="true" className="absolute inset-0 block">
          <ProductImage
            product={product}
            eager={priority}
            className="transition-transform duration-[1100ms] ease-luxe group-hover:scale-[1.045] group-focus-within:scale-[1.045]"
          />
        </Link>

        <div className="pointer-events-none absolute left-0 top-0 flex max-w-[78%] flex-col items-start gap-1.5 p-2 sm:p-3">
          <span className="bg-ivory/95 px-2 py-1 text-[0.56rem] font-semibold uppercase leading-none tracking-[0.16em] sm:text-[0.6rem]">
            {collection.short}
          </span>
          {festive && (
            <span className="bg-burgundy px-2 py-1 text-[0.56rem] font-semibold uppercase leading-none tracking-[0.14em] text-ivory sm:text-[0.6rem]">
              {campaign.offer.code} · {campaign.offer.shortLabel}
            </span>
          )}
        </div>

        <WishlistButton productId={product.id} className="absolute right-0.5 top-0.5 bg-ivory/0" />

        <button
          type="button"
          onClick={() => setQuick(true)}
          aria-label={`Quick view ${product.name}`}
          className="absolute inset-x-0 bottom-0 z-10 flex min-h-[44px] translate-y-full items-center justify-center gap-2 bg-ivory/95 text-[0.64rem] font-semibold uppercase tracking-[0.2em] transition-transform duration-500 ease-luxe hover:bg-ivory group-hover:translate-y-0 group-focus-within:translate-y-0 [@media(hover:none)]:translate-y-0"
        >
          <Eye size={15} /> Quick view
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-3.5">
        <h3 className="line-clamp-2 min-h-[2.3em] font-display text-[1.12rem] leading-[1.15] sm:text-[1.3rem]">
          <Link to={`/product/${product.id}`} className="hover:text-burgundy">
            {product.name}
          </Link>
        </h3>
        <p className="mt-auto pt-2 text-sm">
          <Price product={product} />
        </p>
      </div>

      <Portal>
        <AnimatePresence>
          {quick && <QuickView key={`qv-${product.id}`} product={product} onClose={() => setQuick(false)} />}
        </AnimatePresence>
      </Portal>
    </article>
  );
}
