import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import ProductImage from '../components/ProductImage';
import SizeSelector from '../components/SizeSelector';
import QuantitySelector from '../components/QuantitySelector';
import WishlistButton from '../components/WishlistButton';
import ProductGrid from '../components/ProductGrid';
import EmptyState from '../components/EmptyState';
import Price from '../components/Price';
import Reveal from '../components/Reveal';
import usePageTitle from '../hooks/usePageTitle';
import { useCart } from '../context/CartContext';
import { getProduct, products } from '../data/products';
import { getCollection } from '../data/collections';
import { campaign } from '../data/campaign';
import { site } from '../data/site';
import { formatINR } from '../utils/currency';
import { isProductEligible } from '../utils/pricing';
import { isPincode } from '../utils/orders';

function Disclosure({ title, children, defaultOpen = false }) {
  return (
    <details open={defaultOpen} className="group border-b">
      <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-3 font-display text-xl [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown size={18} className="text-gold transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="space-y-2 pb-5 text-[0.95rem] leading-relaxed text-espresso/80">{children}</div>
    </details>
  );
}

function ProductView({ id }) {
  const product = getProduct(id);
  const { addItem, maxQty } = useCart();
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [pin, setPin] = useState('');
  const [pinMsg, setPinMsg] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);

  usePageTitle(product ? product.name : 'Product not found');

  if (!product) {
    return (
      <EmptyState
        title="We could not find that style"
        actions={<Link to="/shop" className="btn btn-primary">Shop all styles</Link>}
      >
        It may have been renamed or removed. Browse the full collection instead.
      </EmptyState>
    );
  }

  const collection = getCollection(product.collectionId);
  const festive = isProductEligible(campaign.offer, product.id);
  const related = products.filter((p) => p.collectionId === product.collectionId && p.id !== product.id).slice(0, 4);
  const m = site.shipping.method;

  const add = () => {
    const res = addItem(product.id, size, qty);
    if (!res.ok) {
      setError(res.message);
      document.querySelector('#pdp-size-group input:not(:disabled)')?.focus();
    }
  };

  const checkPin = (e) => {
    e.preventDefault();
    if (!isPincode(pin)) {
      setPinMsg({ ok: false, text: 'Please enter a valid 6-digit pincode.' });
      return;
    }
    setPinMsg({
      ok: true,
      text: `Pincode ${pin.trim()} looks valid. We ship within ${site.shipping.regionsServed.join(', ')}, but delivery availability and timing for specific pincodes are not checked online yet${
        site.shipping.timelineText ? `. ${site.shipping.timelineText}` : ''
      }. Contact us if you need confirmation before ordering.`,
    });
  };

  return (
    <article className="container-x pb-16 pt-6 sm:pb-24 sm:pt-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-espresso/70">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li><Link to="/" className="hover:text-burgundy hover:underline">Home</Link> /</li>
          <li><Link to={`/collections/${collection.slug}`} className="hover:text-burgundy hover:underline">{collection.short}</Link> /</li>
          <li aria-current="page" className="text-espresso">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.25rem)]">
            <div className="grid gap-3 sm:grid-cols-[1fr]">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[640px] overflow-hidden bg-sand lg:max-h-[calc(100dvh-var(--header-h)-3rem)] lg:max-w-none">
                <ProductImage product={product} index={imgIndex} eager />
              </div>
              {product.images.length > 1 && (
                <ul className="flex gap-2" aria-label="Product photographs">
                  {product.images.map((src, i) => (
                    <li key={src}>
                      <button
                        type="button"
                        onClick={() => setImgIndex(i)}
                        aria-label={`Show photograph ${i + 1}`}
                        aria-pressed={i === imgIndex}
                        className={`relative block aspect-[3/4] w-16 overflow-hidden border ${i === imgIndex ? 'border-espresso' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      >
                        <ProductImage product={product} index={i} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Reveal>
            <Link to={`/collections/${collection.slug}`} className="eyebrow hover:text-burgundy">
              {collection.name}
            </Link>
            <h1 className="display-lg mt-3 !text-[clamp(2rem,4.2vw,3.2rem)]">{product.name}</h1>
            <p className="mt-4 text-xl">
              <Price product={product} />
            </p>
            <p className="mt-1 text-xs text-espresso/65">Prices in INR. Shipping is calculated in your bag.</p>

            {festive && (
              <p className="mt-4 border border-burgundy/30 bg-burgundy/[0.05] p-3 text-sm">
                <strong>{campaign.offer.code}</strong> — {campaign.offer.value}% off this style when you enter the code in your bag.
              </p>
            )}

            <p className="mt-6 text-[0.98rem] leading-relaxed text-espresso/85">{product.description}</p>
            <p className="mt-3 text-sm text-espresso/70">
              <span className="font-semibold text-espresso">Colour:</span> {product.colour}
              {product.includes ? (
                <>
                  <br />
                  <span className="font-semibold text-espresso">Includes:</span> {product.includes}
                </>
              ) : null}
            </p>

            <div className="mt-7">
              <SizeSelector
                product={product}
                value={size}
                onChange={(s) => {
                  setSize(s);
                  setError('');
                }}
                error={error}
                id="pdp-size"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div>
                <span className="field-label">Quantity</span>
                <QuantitySelector value={qty} onChange={setQty} max={maxQty} />
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={add} className="btn btn-primary flex-1">
                Add to Bag
              </button>
              <WishlistButton productId={product.id} variant="button" showLabel />
            </div>

            <form onSubmit={checkPin} noValidate className="mt-8 border-t pt-6">
              <label htmlFor="pdp-pin" className="field-label">
                Delivery pincode
              </label>
              <div className="flex gap-2">
                <input
                  id="pdp-pin"
                  className="field"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="postal-code"
                  placeholder="6-digit pincode"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value.replace(/\D/g, ''));
                    setPinMsg(null);
                  }}
                  aria-invalid={pinMsg ? !pinMsg.ok : undefined}
                  aria-describedby="pdp-pin-msg"
                />
                <button type="submit" className="btn btn-outline shrink-0 px-5">
                  Check
                </button>
              </div>
              <p
                id="pdp-pin-msg"
                role={pinMsg && !pinMsg.ok ? 'alert' : 'status'}
                className={`mt-2 text-sm ${pinMsg && !pinMsg.ok ? 'text-[#9b2c2c]' : 'text-espresso/75'}`}
              >
                {pinMsg?.text}
              </p>
            </form>

            <div className="mt-6 border-t">
              <Disclosure title="Details" defaultOpen>
                <ul className="list-disc space-y-1 pl-5">
                  {product.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </Disclosure>
              <Disclosure title="Fabric & care">
                {product.fabric && <p><strong>Fabric:</strong> {product.fabric}</p>}
                <p>{product.care}</p>
              </Disclosure>
              <Disclosure title="Shipping">
                <p>
                  {m.label} within {site.shipping.regionsServed.join(', ')}: {formatINR(m.flatRate)}, or free when your order total after
                  discounts is {formatINR(m.freeOver)} or more.
                </p>
                <p>{site.shipping.timelineText || 'Estimated delivery timelines have not been published yet.'}</p>
              </Disclosure>
              <Disclosure title="Returns & exchange">
                <p>
                  Return requests are accepted within {site.returns.windowDays} days of delivery.
                  {site.returns.exchangeForSize ? ' Size exchanges are available, subject to stock.' : ''}
                </p>
                <p>
                  <Link to="/shipping-returns" className="link-quiet">Read the full policy</Link>
                </p>
              </Disclosure>
            </div>
          </Reveal>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-20 border-t pt-14 sm:mt-28 sm:pt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 id="related-title" className="display-md">
              More from {collection.name}
            </h2>
            <Link to={`/collections/${collection.slug}`} className="link-arrow hidden sm:inline-flex">
              View collection
            </Link>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </article>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  return <ProductView key={id} id={id} />;
}
