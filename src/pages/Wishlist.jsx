import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ProductGrid from '../components/ProductGrid';
import EmptyState from '../components/EmptyState';
import usePageTitle from '../hooks/usePageTitle';
import { useWishlist } from '../context/WishlistContext';
import { getProduct } from '../data/products';

export default function Wishlist() {
  usePageTitle('Wishlist');
  const { ids } = useWishlist();
  const items = ids.map(getProduct).filter(Boolean);
  return (
    <>
      <PageHeader eyebrow="Saved for later" title="Your Wishlist" crumbs={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]}>
        {items.length > 0 ? `${items.length} saved style${items.length === 1 ? '' : 's'}, kept on this device.` : null}
      </PageHeader>
      <div className="container-x pb-20 sm:pb-28">
        {items.length > 0 ? (
          <ProductGrid products={items} eagerCount={4} />
        ) : (
          <EmptyState
            title="Nothing saved yet"
            actions={
              <>
                <Link to="/collections" className="btn btn-primary">Shop collections</Link>
                <Link to="/shop?new=1&sort=newest" className="btn btn-outline">New arrivals</Link>
              </>
            }
          >
            Tap the heart on any style to save it here. Your wishlist is kept on this device.
          </EmptyState>
        )}
      </div>
    </>
  );
}
