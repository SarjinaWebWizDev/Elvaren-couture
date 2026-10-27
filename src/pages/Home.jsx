import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Headset, PackageCheck, RefreshCcw, WalletCards } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';
import ProductImage from '../components/ProductImage';
import Photo from '../components/Photo';
import Parallax from '../components/Parallax';
import Marquee from '../components/Marquee';
import { photo } from '../data/editorial';
import ProductGrid from '../components/ProductGrid';
import CollectionCard from '../components/CollectionCard';
import Newsletter from '../components/Newsletter';
import Reveal, { ImageReveal } from '../components/Reveal';
import { collections } from '../data/collections';
import { getProduct, newArrivals } from '../data/products';
import { campaign } from '../data/campaign';
import { site } from '../data/site';
import { formatINR } from '../utils/currency';
import { isOfferLive } from '../utils/pricing';

const EASE = [0.22, 0.61, 0.36, 1];
const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: EASE, delay },
});

function Hero() {
  const main = photo(1);
  const inset = photo(7);
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-gradient-to-b from-mist/45 via-blush/40 to-ivory">
      <div className="container-x grid items-center gap-10 pb-12 pt-8 lg:min-h-[min(820px,calc(100svh-var(--header-h)-44px))] lg:grid-cols-12 lg:gap-6 lg:py-0">
        <div className="order-2 lg:order-1 lg:col-span-5 lg:py-16 xl:pr-8">
          <motion.p {...rise(0.05)} className="eyebrow flex items-center gap-3">
            <span className="rule !w-8" /> The New Season Collection
          </motion.p>
          <motion.h1 {...rise(0.15)} id="hero-title" className="display-xl mt-5">
            Tradition,
            <br />
            <em className="font-normal italic text-burgundy">Reimagined.</em>
          </motion.h1>
          <motion.p {...rise(0.3)} className="lede mt-6 max-w-md">
            Discover thoughtfully designed silhouettes, intricate details, and modern expressions of timeless ethnic elegance.
          </motion.p>
          <motion.div {...rise(0.45)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/collections" className="btn btn-primary">
              Explore the Collection
            </Link>
            <Link to="/our-story" className="btn btn-outline">
              Discover Our Story
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: EASE }}
          className="relative order-1 mx-auto w-full max-w-[460px] lg:order-2 lg:col-span-7 lg:max-w-none lg:py-10"
        >
          <div className="relative mx-auto w-[82%] lg:ml-auto lg:mr-6 lg:w-[62%]">
            <div className="arch-outline pointer-events-none absolute -right-4 -top-4 h-full w-full" aria-hidden="true" />
            <div className="arch relative aspect-[3/4.2] overflow-hidden bg-sand lg:max-h-[min(700px,calc(100svh-var(--header-h)-110px))]">
              <Parallax distance={18}>
                <Photo photo={main} eager />
              </Parallax>
            </div>
          </div>
          <div
            className="absolute -bottom-2 left-0 aspect-[3/4] w-[34%] overflow-hidden border-[6px] border-ivory bg-sand shadow-[0_24px_50px_-28px_rgba(33,25,23,0.55)] sm:w-[30%] lg:bottom-6 lg:left-2 lg:w-[26%]"
            aria-hidden="true"
          >
            <Photo photo={inset} eager />
          </div>
          <div className="absolute right-0 top-10 hidden origin-top-right -rotate-90 translate-x-full text-[0.62rem] uppercase tracking-[0.34em] text-espresso/55 xl:block">
            Autumn · Winter · Festive
          </div>
        </motion.div>
      </div>
      <div className="gold-hairline" aria-hidden="true" />
    </section>
  );
}

function Ticker() {
  return (
    <section aria-label="Our collections" className="bg-ink py-6 text-ivory sm:py-8">
      <Marquee items={collections.map((c) => c.name)} />
    </section>
  );
}

function Moments() {
  const items = [
    { n: 18, label: 'Festive', cls: 'lg:mt-14' },
    { n: 14, label: 'Evening', cls: '' },
    { n: 21, label: 'Daytime', cls: 'lg:mt-14' },
  ];
  return (
    <section aria-labelledby="moments-title" className="section-y bg-gradient-to-b from-ivory via-blush/35 to-ivory">
      <div className="container-x">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <p className="eyebrow">The mood of the season</p>
          <h2 id="moments-title" className="display-lg mt-3">
            Soft tones, <em className="font-normal italic text-burgundy">considered</em> detail
          </h2>
        </Reveal>
        <ul className="grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">
          {items.map(({ n, label, cls }) => (
            <li key={n} className={cls}>
              <ImageReveal className="arch relative aspect-[3/4.4] overflow-hidden bg-sand">
                <Photo photo={photo(n)} />
              </ImageReveal>
              <p className="mt-4 text-center font-display text-2xl italic">{label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Collections() {
  const span = (i) =>
    [
      'lg:col-span-2',
      'lg:col-span-2',
      'lg:col-span-2',
      'lg:col-span-3',
      'sm:col-span-2 lg:col-span-3',
    ][i];
  const aspect = (i) =>
    [
      'aspect-[4/5] sm:aspect-[3/4]',
      'aspect-[4/5] sm:aspect-[3/4]',
      'aspect-[4/5] sm:aspect-[3/4]',
      'aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/3]',
      'aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/3]',
    ][i];
  return (
    <section aria-labelledby="coll-title" className="section-y">
      <div className="container-x">
        <Reveal className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Shop by collection</p>
            <h2 id="coll-title" className="display-lg mt-3">
              Five ways to dress the occasion
            </h2>
          </div>
          <Link to="/shop" className="link-arrow self-start sm:self-auto">
            Shop All <ArrowRight size={14} />
          </Link>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {collections.map((c, i) => (
            <CollectionCard key={c.id} collection={c} className={span(i)} aspect={aspect(i)} priority={i < 3} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NewArrivals() {
  const list = newArrivals().slice(0, 8);
  return (
    <section aria-labelledby="new-title" className="section-y bg-sand/45">
      <div className="container-x">
        <Reveal className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Just arrived</p>
            <h2 id="new-title" className="display-lg mt-3">
              New arrivals
            </h2>
          </div>
          <Link to="/shop?new=1&sort=newest" className="link-arrow self-start sm:self-auto">
            View all new arrivals <ArrowRight size={14} />
          </Link>
        </Reveal>
        <ProductGrid products={list} />
      </div>
    </section>
  );
}

function Campaign() {
  const live = isOfferLive(campaign.offer);
  const [a, b, c] = campaign.imageProductIds.map(getProduct);
  const o = campaign.offer;
  return (
    <section aria-labelledby="camp-title" className="relative overflow-hidden bg-[#E9ECE0]">
      <div className="container-x grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:py-28">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow !text-burgundy">Seasonal campaign</p>
          <h2 id="camp-title" className="display-lg mt-3">
            {campaign.name}
          </h2>
          <p className="mt-5 font-display text-2xl italic leading-snug text-espresso/85 sm:text-[1.75rem]">{campaign.copy}</p>

          {live ? (
            <div className="mt-8 border border-burgundy/30 bg-ivory/80 p-5 sm:p-6">
              <p className="font-display text-xl leading-snug">{o.headline}</p>
              <p className="mt-2 text-sm text-espresso/80">
                Enter <strong className="tracking-wider">{o.code}</strong> in your bag.
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-espresso/70">
                {o.terms.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <Link to="/shop?edit=festive" className="btn btn-burgundy mt-8">
            Shop the Festive Edit
          </Link>
        </Reveal>

        <div className="grid grid-cols-12 items-end gap-3 sm:gap-5 lg:col-span-7">
          <ImageReveal className="col-span-7 aspect-[3/4] overflow-hidden bg-sand">
            <ProductImage product={a} position="50% 12%" />
          </ImageReveal>
          <div className="col-span-5 grid gap-3 sm:gap-5">
            <ImageReveal delay={0.12} className="aspect-[3/4] overflow-hidden bg-sand">
              <ProductImage product={b} position="50% 8%" />
            </ImageReveal>
            <ImageReveal delay={0.24} className="aspect-[3/4] overflow-hidden bg-sand">
              <ProductImage product={c} position="50% 12%" />
            </ImageReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section aria-labelledby="story-title" className="section-y">
      <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <ImageReveal className="arch relative aspect-[4/5] overflow-hidden bg-sand lg:col-span-5">
          <Photo photo={photo(22)} />
        </ImageReveal>
        <Reveal className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow">Our philosophy</p>
          <h2 id="story-title" className="display-lg mt-3">
            Made for Moments That Matter.
          </h2>
          <div className="rule my-7" />
          <div className="lede space-y-5">
            <p>
              ÉLVARÉN is a contemporary ethnic-wear label shaped by Pakistani silhouettes, refined embroidery and the quiet confidence of
              modern tailoring. Every piece begins with proportion — the fall of a long kurta, the sweep of a lehenga, the swing of a
              gharara.
            </p>
            <p>
              We care about the details that are noticed up close: the placement of a motif, the finish of a hem, a border that frames
              the dupatta. Timeless shapes, thoughtfully worn, for the days you will want to remember.
            </p>
          </div>
          <Link to="/our-story" className="link-arrow mt-8">
            Read Our Story <ArrowRight size={14} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Lookbook() {
  const items = [
    { id: 'champagne-zardozi-formal', cls: 'lg:col-span-4 lg:row-span-2 aspect-[3/4] lg:aspect-auto', pos: '50% 10%', cap: 'Heirloom' },
    { id: 'teal-mirror-work-gharara', cls: 'lg:col-span-4 aspect-[4/5] lg:aspect-[5/4]', pos: '50% 32%', cap: 'Gharara' },
    { id: 'sand-beige-tailored-set', cls: 'lg:col-span-4 aspect-[4/5] lg:aspect-[5/4]', pos: '50% 12%', cap: 'Modern Form' },
    { id: 'emerald-embellished-suit', cls: 'lg:col-span-4 aspect-[4/5] lg:aspect-[5/4]', pos: '50% 10%', cap: 'Heirloom' },
    { id: 'blush-pink-lehenga', cls: 'lg:col-span-4 aspect-[4/5] lg:aspect-[5/4]', pos: '50% 12%', cap: 'Lehenga Atelier' },
  ];
  return (
    <section aria-labelledby="look-title" className="section-y bg-ink text-ivory">
      <div className="on-dark container-x">
        <Reveal className="mb-10 max-w-2xl sm:mb-14">
          <p className="eyebrow !text-ivory/65">The lookbook</p>
          <h2 id="look-title" className="display-lg mt-3">
            Long suits to lehengas, in one wardrobe
          </h2>
        </Reveal>
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:grid-rows-2">
          {items.map((it, i) => {
            const p = getProduct(it.id);
            return (
              <li key={it.id} className={`${it.cls} ${i === 0 ? 'col-span-2 lg:col-span-4' : ''}`}>
                <Link to={`/product/${p.id}`} className="group relative block h-full w-full overflow-hidden bg-sand/20">
                  <div className="absolute inset-0">
                    <ProductImage
                      product={p}
                      position={it.pos}
                      className="transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/75 to-transparent p-3 pt-10 sm:p-4 sm:pt-12">
                    <p className="text-[0.6rem] uppercase tracking-[0.22em] text-ivory/80">{it.cap}</p>
                    <p className="font-display text-lg leading-tight sm:text-xl">{p.name}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Trust() {
  const m = site.shipping.method;
  const items = [
    {
      icon: WalletCards,
      title: 'Simple checkout',
      text: 'Review your bag, choose a payment option and place your order. No card details are collected on this site.',
    },
    {
      icon: Headset,
      title: 'Customer care',
      text: 'Questions about sizing, care or an order? Write to us from the Contact page.',
      to: '/contact',
    },
    {
      icon: PackageCheck,
      title: 'Shipping',
      text: `${m.label} within ${site.shipping.regionsServed.join(', ')}: ${formatINR(m.flatRate)}, free on orders of ${formatINR(m.freeOver)} and above.`,
      to: '/shipping-returns',
    },
    {
      icon: RefreshCcw,
      title: 'Returns & exchange',
      text: `Request a return within ${site.returns.windowDays} days of delivery${site.returns.exchangeForSize ? ', with size exchanges subject to stock' : ''}.`,
      to: '/shipping-returns',
    },
  ];
  return (
    <section aria-label="Shopping with ÉLVARÉN" className="section-y">
      <div className="container-x">
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text, to }) => (
            <Reveal as="li" key={title} className="border-t border-espresso/25 pt-6">
              <Icon size={26} strokeWidth={1.3} className="text-burgundy" aria-hidden="true" />
              <h3 className="mt-4 font-display text-2xl">{title}</h3>
              <p className="mt-2 text-sm text-espresso/75">{text}</p>
              {to && (
                <Link to={to} className="link-quiet mt-3 inline-flex min-h-11 items-center text-sm">
                  Learn more
                </Link>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function NewsletterBand() {
  return (
    <section aria-labelledby="nl-title" className="bg-sand/55 py-16 sm:py-24">
      <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
        <Reveal>
          <p className="eyebrow">Stay in touch</p>
          <h2 id="nl-title" className="display-lg mt-3">
            Be first to see what is new
          </h2>
          <p className="lede mt-4 max-w-md">New collections and seasonal edits, shared occasionally and never more than we need to.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <Newsletter />
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  usePageTitle('');
  return (
    <>
      <Hero />
      <Ticker />
      <Collections />
      <Moments />
      <NewArrivals />
      <Campaign />
      <BrandStory />
      <Lookbook />
      <Trust />
      <NewsletterBand />
    </>
  );
}
