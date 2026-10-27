import { Link, NavLink } from 'react-router-dom';
import { Heart, Search, ShoppingBag, X } from 'lucide-react';
import SidePanel from './SidePanel';
import { LogoMark } from './Logo';
import { collections } from '../data/collections';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const big = 'block py-2.5 font-display text-[1.7rem] leading-tight transition-colors hover:text-burgundy';

export default function MobileNav({ onClose, onSearch }) {
  const { itemCount, openDrawer } = useCart();
  const { count } = useWishlist();

  return (
    <SidePanel side="left" label="Menu" onClose={onClose}>
      <div className="flex items-center justify-between border-b px-5 py-3">
        <span className="inline-flex items-center gap-2.5 font-display text-lg tracking-[0.28em]">
          <LogoMark className="size-7 text-burgundy" /> ÉLVARÉN
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="-mr-2 grid size-11 place-items-center hover:text-burgundy"
        >
          <X size={22} />
        </button>
      </div>

      <nav aria-label="Mobile" className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <ul>
          <li><NavLink to="/" end onClick={onClose} className={big}>Home</NavLink></li>
          <li><Link to="/shop?new=1&sort=newest" onClick={onClose} className={big}>New Arrivals</Link></li>
          <li><Link to="/shop" onClick={onClose} className={big}>Shop</Link></li>
          <li>
            <Link to="/collections" onClick={onClose} className={big}>Collections</Link>
            <ul className="mb-2 ml-1 border-l border-gold/60 pl-4">
              {collections.map((c) => (
                <li key={c.id}>
                  <Link to={`/collections/${c.slug}`} onClick={onClose} className="block min-h-11 py-2.5 text-[0.95rem] text-espresso/85 hover:text-burgundy">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li><NavLink to="/our-story" onClick={onClose} className={big}>Our Story</NavLink></li>
          <li><NavLink to="/contact" onClick={onClose} className={big}>Contact</NavLink></li>
        </ul>

        <div className="mt-6 grid gap-2 border-t pt-5">
          <button type="button" onClick={onSearch} className="flex min-h-12 items-center gap-3 text-sm font-medium hover:text-burgundy">
            <Search size={18} /> Search
          </button>
          <Link to="/wishlist" onClick={onClose} className="flex min-h-12 items-center gap-3 text-sm font-medium hover:text-burgundy">
            <Heart size={18} /> Wishlist{count > 0 ? ` (${count})` : ''}
          </Link>
          <button
            type="button"
            onClick={() => {
              onClose();
              openDrawer();
            }}
            className="flex min-h-12 items-center gap-3 text-sm font-medium hover:text-burgundy"
          >
            <ShoppingBag size={18} /> Shopping Bag{itemCount > 0 ? ` (${itemCount})` : ''}
          </button>
        </div>

        <ul className="mt-5 grid gap-1 border-t pt-5 text-sm text-espresso/80">
          <li><Link to="/faq" onClick={onClose} className="block min-h-11 py-2.5 hover:text-burgundy">FAQs</Link></li>
          <li><Link to="/shipping-returns" onClick={onClose} className="block min-h-11 py-2.5 hover:text-burgundy">Shipping &amp; Returns</Link></li>
        </ul>
      </nav>
    </SidePanel>
  );
}
