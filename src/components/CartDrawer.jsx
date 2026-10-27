import { Link } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { ShoppingBag, X } from 'lucide-react';
import Portal from './Portal';
import SidePanel from './SidePanel';
import CartLine from './CartLine';
import OrderSummary from './OrderSummary';
import { useCart } from '../context/CartContext';

function DrawerContent({ onClose }) {
  const { pricing, itemCount } = useCart();
  const empty = pricing.items.length === 0;

  return (
    <SidePanel side="right" label="Shopping bag" onClose={onClose}>
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h2 className="font-display text-2xl">
          Your Bag <span className="text-base text-espresso/60">({itemCount})</span>
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close bag"
          className="-mr-2 grid size-11 place-items-center hover:text-burgundy"
        >
          <X size={22} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5">
        {empty ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
            <ShoppingBag size={40} strokeWidth={1.2} className="text-burgundy/70" />
            <p className="font-display text-2xl">Your bag is empty</p>
            <p className="max-w-xs text-sm text-espresso/75">
              Discover long suits, heirloom formals, lehengas and more.
            </p>
            <Link to="/collections" onClick={onClose} className="btn btn-primary mt-2">
              Explore Collections
            </Link>
          </div>
        ) : (
          <ul>
            {pricing.items.map((item) => (
              <CartLine key={item.key} item={item} onNavigate={onClose} />
            ))}
          </ul>
        )}
      </div>

      {!empty && (
        <div className="space-y-4 border-t bg-ivory px-5 py-5">
          <OrderSummary pricing={pricing} />
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Link to="/bag" onClick={onClose} className="btn btn-outline">
              View Bag
            </Link>
            <Link to="/checkout" onClick={onClose} className="btn btn-primary">
              Checkout
            </Link>
          </div>
        </div>
      )}
    </SidePanel>
  );
}

export default function CartDrawer() {
  const { drawerOpen, closeDrawer } = useCart();
  return (
    <Portal>
      <AnimatePresence>{drawerOpen && <DrawerContent key="cart" onClose={closeDrawer} />}</AnimatePresence>
    </Portal>
  );
}
