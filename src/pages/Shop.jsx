import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ShopView from '../components/ShopView';
import usePageTitle from '../hooks/usePageTitle';

export default function Shop() {
  const [sp] = useSearchParams();
  const isNew = sp.get('new') === '1';
  const festive = sp.get('edit') === 'festive';
  const title = festive ? 'The Festive Florals Edit' : isNew ? 'New Arrivals' : 'Shop All';
  usePageTitle(title);
  return (
    <>
      <PageHeader
        eyebrow={festive ? 'Seasonal edit' : isNew ? 'Just arrived' : 'The full collection'}
        title={title}
        crumbs={[{ label: 'Home', to: '/' }, { label: title }]}
      >
        {festive
          ? 'Soft florals. Thoughtful details. Unforgettable celebrations.'
          : isNew
            ? 'The newest additions across all five collections.'
            : 'All 25 styles across long suits, heirloom formals, lehengas, ghararas and modern sets.'}
      </PageHeader>
      <ShopView />
    </>
  );
}
