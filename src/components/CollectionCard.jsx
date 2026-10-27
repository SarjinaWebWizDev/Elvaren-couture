import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductImage from './ProductImage';
import Photo from './Photo';
import { ImageReveal } from './Reveal';
import { getProduct } from '../data/products';

export default function CollectionCard({ collection, aspect = 'aspect-[3/4]', className = '', priority = false }) {
  const product = getProduct(collection.imageProductId);
  return (
    <Link
      to={`/collections/${collection.slug}`}
      className={`group relative block overflow-hidden bg-sand ${className}`}
      aria-label={`${collection.name} — Explore Collection`}
    >
      <div className={`relative w-full ${aspect}`}>
        <ImageReveal className="absolute inset-0">
          {collection.cover ? (
            <Photo
              photo={collection.cover}
              position={collection.position}
              eager={priority}
              className="transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.05] group-focus-visible:scale-[1.05]"
            />
          ) : (
            <ProductImage
              product={product}
              position={collection.position}
              eager={priority}
              className="transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.05] group-focus-visible:scale-[1.05]"
            />
          )}
        </ImageReveal>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-ivory/95 px-5 py-5 sm:inset-x-auto sm:bottom-0 sm:left-0 sm:max-w-[min(88%,380px)] sm:px-6 sm:py-6">
        <p className="eyebrow">Collection {collection.number}</p>
        <h3 className="mt-1.5 font-display text-[1.6rem] leading-[1.05] sm:text-[1.9rem]">{collection.name}</h3>
        <p className="mt-2 hidden text-sm text-espresso/75 sm:block">{collection.blurb}</p>
        <span className="mt-3 inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.2em] transition-[gap] duration-300 group-hover:gap-3.5">
          Explore Collection <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
