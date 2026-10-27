import PolicyPage from '../components/PolicyPage';
import { site } from '../data/site';
import { formatINR } from '../utils/currency';

export default function ShippingReturns() {
  const m = site.shipping.method;
  const r = site.returns;
  return (
    <PolicyPage
      title="Shipping & Returns"
      intro="How delivery, returns and exchanges work at ÉLVARÉN."
      sections={[
        {
          heading: 'Shipping',
          body: [
            `We ship within ${site.shipping.regionsServed.join(', ')}.`,
            `${m.label}: ${formatINR(m.flatRate)}. Shipping is free when your order total after any discounts is ${formatINR(m.freeOver)} or more. The exact amount is shown in your bag and at checkout before you place your order.`,
            site.shipping.timelineText || 'Estimated delivery timelines have not been published yet. If you need a delivery date for a specific occasion, please contact customer care before ordering.',
          ],
        },
        {
          heading: 'Returns',
          body: [
            `You may request a return within ${r.windowDays} days of delivery.`,
            r.conditions,
            'To start a return, contact customer care through the Contact page and include your order reference.',
          ],
        },
        {
          heading: 'Exchanges',
          body: [
            r.exchangeForSize
              ? 'Size exchanges are available subject to stock. Contact customer care with your order reference and the size you would like.'
              : 'Exchanges are not currently offered.',
          ],
        },
        {
          heading: 'Cancellations',
          body: [
            'To ask for a cancellation, contact customer care as soon as possible with your order reference. Whether an order can be cancelled depends on how far it has progressed.',
          ],
        },
        {
          heading: 'Payment',
          body: [
            `Payment options shown at checkout: ${site.payments.filter((p) => p.enabled).map((p) => p.label.toLowerCase()).join(', ') || 'none enabled yet'}.`,
          ],
        },
      ]}
    />
  );
}
