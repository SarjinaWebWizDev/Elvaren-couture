import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import OrderSummary from '../components/OrderSummary';
import EmptyState from '../components/EmptyState';
import ProductImage from '../components/ProductImage';
import usePageTitle from '../hooks/usePageTitle';
import { useCart } from '../context/CartContext';
import { site } from '../data/site';
import { formatINR } from '../utils/currency';
import { INDIAN_STATES, isEmail, isIndianMobile, isPincode, makeOrderId, submitOrder } from '../utils/orders';

const EMPTY = { name: '', email: '', phone: '', address: '', landmark: '', city: '', state: '', pincode: '' };

function Field({ id, label, error, optional, children }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="ml-1 font-normal normal-case tracking-normal text-espresso/60">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} role="alert" className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

function validate(v, payment) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.';
  if (!isEmail(v.email)) e.email = 'Please enter a valid email address.';
  if (!isIndianMobile(v.phone)) e.phone = 'Please enter a valid 10-digit Indian mobile number.';
  if (v.address.trim().length < 6) e.address = 'Please enter your delivery address.';
  if (v.city.trim().length < 2) e.city = 'Please enter your city.';
  if (!v.state) e.state = 'Please select your state.';
  if (!isPincode(v.pincode)) e.pincode = 'Please enter a valid 6-digit pincode.';
  if (!payment) e.payment = 'Please choose a payment option.';
  return e;
}

export default function Checkout() {
  usePageTitle('Checkout');
  const { pricing, clearCart, code } = useCart();
  const navigate = useNavigate();
  const [v, setV] = useState(EMPTY);
  const [payment, setPayment] = useState(site.payments.find((p) => p.enabled)?.id || '');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ sending: false, error: '' });
  const formRef = useRef(null);

  if (pricing.items.length === 0) {
    return (
      <EmptyState
        title="Your bag is empty"
        actions={<Link to="/collections" className="btn btn-primary">Explore collections</Link>}
      >
        Add a style to your bag before checking out.
      </EmptyState>
    );
  }

  const set = (k) => (e) => {
    setV((x) => ({ ...x, [k]: k === 'pincode' ? e.target.value.replace(/\D/g, '') : e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };
  const ia = (k) => ({ id: `co-${k}`, 'aria-invalid': Boolean(errors[k]), 'aria-describedby': errors[k] ? `co-${k}-err` : undefined });

  async function onSubmit(e) {
    e.preventDefault();
    if (status.sending) return;
    const errs = validate(v, payment);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      setStatus({ sending: false, error: '' });
      const el = formRef.current?.querySelector(`#co-${first}`) || formRef.current?.querySelector('[name="payment"]');
      el?.focus();
      return;
    }

    const order = {
      id: makeOrderId(),
      createdAt: new Date().toISOString(),
      customer: {
        name: v.name.trim(),
        email: v.email.trim(),
        phone: v.phone.trim(),
        address: v.address.trim(),
        landmark: v.landmark.trim(),
        city: v.city.trim(),
        state: v.state,
        pincode: v.pincode,
      },
      items: pricing.items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        size: i.size,
        qty: i.qty,
        unitPrice: i.unitPrice,
        lineTotal: i.lineTotal,
      })),
      totals: {
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        discountCode: pricing.discount > 0 ? code : null,
        shipping: pricing.shipping,
        total: pricing.total,
        currency: 'INR',
      },
      shippingMethod: site.shipping.method.label,
      payment: { method: payment, status: 'unpaid' },
    };

    setStatus({ sending: true, error: '' });
    try {
      await submitOrder(order);
      clearCart();
      navigate('/order-confirmation');
    } catch (err) {
      setStatus({ sending: false, error: err.message || 'We could not place your order. Please try again.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <>
      <PageHeader eyebrow="Almost there" title="Checkout" crumbs={[{ label: 'Home', to: '/' }, { label: 'Bag', to: '/bag' }, { label: 'Checkout' }]} />
      <div className="container-x pb-20 sm:pb-28">
        {status.error && (
          <div role="alert" className="mb-8 border border-[#9b2c2c]/40 bg-[#fbeeee] p-4 text-sm text-[#7a1f1f]">
            <strong>Your order was not placed.</strong> {status.error}
          </div>
        )}

        <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-10 lg:col-span-7">
            <fieldset className="space-y-5">
              <legend className="display-md mb-5">Contact</legend>
              <Field id="co-name" label="Full name" error={errors.name}>
                <input {...ia('name')} className="field" value={v.name} onChange={set('name')} autoComplete="name" />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="co-email" label="Email" error={errors.email}>
                  <input {...ia('email')} type="email" inputMode="email" className="field" value={v.email} onChange={set('email')} autoComplete="email" />
                </Field>
                <Field id="co-phone" label="Mobile number" error={errors.phone}>
                  <input {...ia('phone')} type="tel" inputMode="tel" className="field" value={v.phone} onChange={set('phone')} autoComplete="tel" placeholder="10-digit number" />
                </Field>
              </div>
            </fieldset>

            <fieldset className="space-y-5">
              <legend className="display-md mb-5">Delivery address</legend>
              <Field id="co-address" label="Address" error={errors.address}>
                <input {...ia('address')} className="field" value={v.address} onChange={set('address')} autoComplete="address-line1" placeholder="House / flat, street, area" />
              </Field>
              <Field id="co-landmark" label="Landmark" optional>
                <input id="co-landmark" className="field" value={v.landmark} onChange={set('landmark')} autoComplete="address-line2" />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="co-city" label="City" error={errors.city}>
                  <input {...ia('city')} className="field" value={v.city} onChange={set('city')} autoComplete="address-level2" />
                </Field>
                <Field id="co-state" label="State" error={errors.state}>
                  <select {...ia('state')} className="field" value={v.state} onChange={set('state')} autoComplete="address-level1">
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="sm:max-w-[16rem]">
                <Field id="co-pincode" label="Pincode" error={errors.pincode}>
                  <input {...ia('pincode')} className="field" inputMode="numeric" maxLength={6} value={v.pincode} onChange={set('pincode')} autoComplete="postal-code" />
                </Field>
              </div>
            </fieldset>

            <fieldset>
              <legend className="display-md mb-5">Shipping</legend>
              <div className="flex items-center justify-between gap-4 border border-espresso/30 p-4 text-sm">
                <span>
                  <strong>{site.shipping.method.label}</strong>
                  <br />
                  <span className="text-espresso/70">{site.shipping.timelineText || 'Delivery timeline not yet published.'}</span>
                </span>
                <span className="font-medium">{pricing.shipping === 0 ? 'Free' : formatINR(pricing.shipping)}</span>
              </div>
            </fieldset>

            <fieldset aria-describedby={errors.payment ? 'co-payment-err' : undefined}>
              <legend className="display-md mb-5">Payment</legend>
              <div className="space-y-3">
                {site.payments.map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-start gap-3 border p-4 text-sm ${
                      p.enabled ? 'cursor-pointer border-espresso/30 has-[:checked]:border-espresso has-[:checked]:bg-white/60' : 'cursor-not-allowed border-espresso/15 opacity-60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={p.id}
                      checked={payment === p.id}
                      disabled={!p.enabled}
                      onChange={() => setPayment(p.id)}
                      className="mt-1 size-5 accent-[#642F3D]"
                    />
                    <span>
                      <span className="block font-semibold">{p.label}</span>
                      <span className="text-espresso/70">{p.description}</span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.payment && <p id="co-payment-err" role="alert" className="field-error">{errors.payment}</p>}
              <p className="mt-4 text-xs text-espresso/65">No payment is taken on this website, and no card details are collected.</p>
            </fieldset>
          </div>

          <aside aria-label="Order summary" className="lg:col-span-5">
            <div className="space-y-6 border bg-white/40 p-5 sm:p-7 lg:sticky lg:top-[calc(var(--header-h)+1.25rem)]">
              <h2 className="font-display text-2xl">Your order</h2>
              <ul className="divide-y">
                {pricing.items.map((i) => (
                  <li key={i.key} className="flex gap-3 py-3 first:pt-0">
                    <div className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden bg-sand">
                      <div className="absolute inset-0"><ProductImage product={i.product} /></div>
                    </div>
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="font-display text-lg leading-tight">{i.product.name}</p>
                      <p className="text-xs text-espresso/70">
                        {i.size ? `Size ${i.size}` : 'One size'} · Qty {i.qty}
                      </p>
                    </div>
                    <p className="text-sm">{formatINR(i.lineTotal)}</p>
                  </li>
                ))}
              </ul>
              <OrderSummary pricing={pricing} />
              <button type="submit" disabled={status.sending} className="btn btn-primary w-full">
                {status.sending ? 'Placing order…' : 'Place Order'}
              </button>
              <p className="text-xs text-espresso/65">
                By placing your order you agree to our <Link to="/terms-and-conditions" className="link-quiet">Terms</Link> and{' '}
                <Link to="/privacy-policy" className="link-quiet">Privacy Policy</Link>.
              </p>
              <Link to="/bag" className="link-arrow">Edit bag</Link>
            </div>
          </aside>
        </form>
      </div>
    </>
  );
}
