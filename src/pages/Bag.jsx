import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import CartLine from '../components/CartLine';
import OrderSummary from '../components/OrderSummary';
import PromoCode from '../components/PromoCode';
import EmptyState from '../components/EmptyState';
import usePageTitle from '../hooks/usePageTitle';
import { useCart } from '../context/CartContext';

export default function Bag() {
  usePageTitle('Shopping Bag');
  const { pricing, itemCount } = useCart();

  if (pricing.items.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Your selection" title="Shopping Bag" crumbs={[{ label: 'Home', to: '/' }, { label: 'Bag' }]} />
        <EmptyState
          title="Your bag is empty"
          actions={
            <>
              <Link to="/collections" className="btn btn-primary">Explore collections</Link>
              <Link to="/wishlist" className="btn btn-outline">View wishlist</Link>
            </>
          }
        >
          Add a style to begin. Long suits, formals, lehengas and more are waiting.
        </EmptyState>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Your selection" title="Shopping Bag" crumbs={[{ label: 'Home', to: '/' }, { label: 'Bag' }]}>
        {itemCount} item{itemCount === 1 ? '' : 's'} in your bag.
      </PageHeader>
      <div className="container-x grid gap-10 pb-20 sm:pb-28 lg:grid-cols-12 lg:gap-14">
        <section aria-label="Items in your bag" className="lg:col-span-7">
          <ul className="border-t">
            {pricing.items.map((item) => (
              <CartLine key={item.key} item={item} large />
            ))}
          </ul>
          <Link to="/shop" className="link-arrow mt-8">Continue shopping</Link>
        </section>

        <aside aria-label="Order summary" className="lg:col-span-5">
          <div className="space-y-6 border bg-white/40 p-5 sm:p-7 lg:sticky lg:top-[calc(var(--header-h)+1.25rem)]">
            <h2 className="font-display text-2xl">Order summary</h2>
            <PromoCode />
            <OrderSummary pricing={pricing} />
            <Link to="/checkout" className="btn btn-primary w-full">
              <ShoppingBag size={16} /> Proceed to Checkout
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
