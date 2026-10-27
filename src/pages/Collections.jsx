import PageHeader from '../components/PageHeader';
import CollectionCard from '../components/CollectionCard';
import usePageTitle from '../hooks/usePageTitle';
import { collections } from '../data/collections';

export default function Collections() {
  usePageTitle('Collections');
  return (
    <>
      <PageHeader
        eyebrow="Five collections"
        title="Collections"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Collections' }]}
      >
        From everyday long suits to heirloom formals, lehengas, ghararas and modern tailored sets.
      </PageHeader>
      <div className="container-x grid gap-4 pb-20 sm:grid-cols-2 sm:pb-28 lg:grid-cols-3 lg:gap-6">
        {collections.map((c, i) => (
          <CollectionCard key={c.id} collection={c} aspect="aspect-[4/5]" priority={i < 3} />
        ))}
      </div>
    </>
  );
}
