import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useWishlist } from '../context/WishlistContext';
import { getProduct } from '../data/products';

export default function WishlistButton({ productId, className = '', variant = 'overlay', showLabel = false }) {
  const { has, toggle } = useWishlist();
  const active = has(productId);
  const name = getProduct(productId)?.name || 'this item';
  const base =
    variant === 'overlay'
      ? 'grid size-11 place-items-center text-espresso transition-colors hover:text-burgundy'
      : 'inline-flex min-h-[48px] items-center justify-center gap-2 border border-espresso/30 px-5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] transition-colors hover:border-espresso';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      className={`${base} ${className}`}
    >
      <motion.span
        key={String(active)}
        initial={false}
        animate={active ? { scale: [0.7, 1.25, 1] } : { scale: 1 }}
        transition={{ duration: 0.45 }}
        className="grid place-items-center"
      >
        <Heart size={19} strokeWidth={1.5} className={active ? 'fill-burgundy text-burgundy' : ''} />
      </motion.span>
      {showLabel && <span>{active ? 'Saved' : 'Save'}</span>}
    </button>
  );
}
