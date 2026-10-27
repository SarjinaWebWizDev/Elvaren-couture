import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ShopView from '../components/ShopView';
import EmptyState from '../components/EmptyState';
import usePageTitle from '../hooks/usePageTitle';
import { collections, getCollection } from '../data/collections';

export default function CollectionPage() {
  const { slug } = useParams();
  const collection = getCollection(slug);
  usePageTitle(collection ? collection.name : 'Collection not found');

  if (!collection) {
    return (
      <EmptyState
        title="We could not find that collection"
        actions={<Link to="/collections" className="btn btn-primary">View all collections</Link>}
      >
        The link may be out of date. Browse our five collections instead.
      </EmptyState>
    );
  }

  const others = collections.filter((c) => c.id !== collection.id);
  return (
    <>
      <PageHeader
        eyebrow={`Collection ${collection.number}`}
        title={collection.name}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Collections', to: '/collections' }, { label: collection.short }]}
      >
        {collection.description}
      </PageHeader>
      <ShopView key={collection.id} fixedCollectionId={collection.id} />
      <nav aria-label="Other collections" className="border-t bg-sand/40">
        <div className="container-x py-10">
          <p className="eyebrow mb-4">Continue exploring</p>
          <ul className="flex flex-wrap gap-2">
            {others.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/collections/${c.slug}`}
                  className="inline-flex min-h-11 items-center border border-espresso/30 px-4 text-sm transition-colors hover:border-espresso hover:bg-ivory"
                >
                  {c.short}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
