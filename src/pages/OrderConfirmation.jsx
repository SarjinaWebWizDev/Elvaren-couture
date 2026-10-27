import { Link } from 'react-router-dom';
import { CheckCircle2, Info } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import usePageTitle from '../hooks/usePageTitle';
import { readLastOrder } from '../utils/orders';
import { formatINR } from '../utils/currency';
import { site } from '../data/site';

export default function OrderConfirmation() {
  usePageTitle('Order Confirmation');
  const order = readLastOrder();

  if (!order) {
    return (
      <EmptyState
        title="No recent order found"
        actions={<Link to="/shop" className="btn btn-primary">Continue shopping</Link>}
      >
        If you have just placed an order and see this, please check your details with customer care rather than ordering again.
      </EmptyState>
    );
  }

  const remote = order.mode === 'remote';
  const pay = site.payments.find((p) => p.id === order.payment.method);
  const c = order.customer;

  return (
    <>
      <PageHeader eyebrow="Order received" title="Thank you for your order" crumbs={[{ label: 'Home', to: '/' }, { label: 'Order confirmation' }]}>
        Your order reference is <strong className="tracking-wider text-espresso">{order.id}</strong>.
      </PageHeader>
      <div className="container-x grid gap-10 pb-20 sm:pb-28 lg:grid-cols-12 lg:gap-14">
        <div className="space-y-8 lg:col-span-7">
          <div
            role="status"
            className={`flex gap-3 border p-5 text-sm ${remote ? 'border-sage bg-sage/15' : 'border-gold/60 bg-sand/50'}`}
          >
            {remote ? <CheckCircle2 className="mt-0.5 shrink-0 text-burgundy" size={20} /> : <Info className="mt-0.5 shrink-0 text-burgundy" size={20} />}
            <div className="space-y-1.5">
              {remote ? (
                <p>Your order has been sent to the store. Keep your order reference for any questions.</p>
              ) : (
                <>
                  <p className="font-semibold">This order has not been sent to a store system.</p>
                  <p>
                    Order processing is not connected on this website yet, so your order details are saved on this device only. To
                    place a real order, please contact customer care with your order reference.
                  </p>
                </>
              )}
              <p>
                Payment: <strong>{pay?.label || order.payment.method}</strong> — nothing has been charged online.
              </p>
            </div>
          </div>

          <section aria-labelledby="oc-items">
            <h2 id="oc-items" className="display-md mb-4">Items</h2>
            <ul className="divide-y border-y">
              {order.items.map((i) => (
                <li key={`${i.productId}-${i.size}`} className="flex items-start justify-between gap-4 py-4 text-sm">
                  <div>
                    <Link to={`/product/${i.productId}`} className="font-display text-xl leading-tight hover:text-burgundy">{i.name}</Link>
                    <p className="text-espresso/70">{i.size ? `Size ${i.size}` : 'One size'} · Qty {i.qty}</p>
                  </div>
                  <p>{formatINR(i.lineTotal)}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="oc-ship">
            <h2 id="oc-ship" className="display-md mb-4">Delivering to</h2>
            <address className="not-italic leading-relaxed text-espresso/85">
              {c.name}<br />
              {c.address}{c.landmark ? `, ${c.landmark}` : ''}<br />
              {c.city}, {c.state} {c.pincode}<br />
              {c.phone} · {c.email}
            </address>
          </section>
        </div>

        <aside aria-label="Order totals" className="lg:col-span-5">
          <div className="space-y-3 border bg-white/40 p-5 text-sm sm:p-7">
            <h2 className="font-display text-2xl">Totals</h2>
            <dl className="space-y-2.5">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatINR(order.totals.subtotal)}</dd></div>
              {order.totals.discount > 0 && (
                <div className="flex justify-between text-burgundy"><dt>Discount · {order.totals.discountCode}</dt><dd>−{formatINR(order.totals.discount)}</dd></div>
              )}
              <div className="flex justify-between"><dt>{order.shippingMethod}</dt><dd>{order.totals.shipping === 0 ? 'Free' : formatINR(order.totals.shipping)}</dd></div>
              <div className="flex items-baseline justify-between border-t pt-3">
                <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.16em]">Total</dt>
                <dd className="font-display text-2xl">{formatINR(order.totals.total)}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-3 pt-4">
              <Link to="/shop" className="btn btn-primary">Continue shopping</Link>
              <Link to="/contact" className="btn btn-outline">Contact us</Link>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
