import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import FAQAccordion from '../components/FAQAccordion';
import usePageTitle from '../hooks/usePageTitle';
import { buildFaqs } from '../data/faq';

export default function FAQ() {
  usePageTitle('FAQs');
  const items = buildFaqs();
  return (
    <>
      <PageHeader eyebrow="Help" title="Frequently Asked Questions" crumbs={[{ label: 'Home', to: '/' }, { label: 'FAQs' }]}>
        Answers about ordering, sizing, care, shipping and returns.
      </PageHeader>
      <div className="container-x pb-20 sm:pb-28">
        <div className="max-w-3xl">
          <FAQAccordion items={items} />
          <p className="mt-10 text-sm text-espresso/75">
            Still need help? <Link to="/contact" className="link-quiet">Contact customer care</Link> or read{' '}
            <Link to="/shipping-returns" className="link-quiet">Shipping &amp; Returns</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
