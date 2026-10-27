import { Link } from 'react-router-dom';
import ProductImage from '../components/ProductImage';
import Photo from '../components/Photo';
import Parallax from '../components/Parallax';
import { photo } from '../data/editorial';
import Reveal, { ImageReveal } from '../components/Reveal';
import usePageTitle from '../hooks/usePageTitle';
import { getProduct } from '../data/products';
import { collections } from '../data/collections';

const details = [
  ['Proportion first', 'Long kurtas that fall cleanly, lehenga skirts cut for movement, gharara panels that flare with each step.'],
  ['Embellishment with intent', 'Mirror work, pearl work, sequins and thread embroidery are placed to frame a neckline, trace a hem or border a dupatta.'],
  ['Colour with calm', 'Ivory, sage, rose, champagne and deep jewel tones sit beside crisp black and earthy neutrals.'],
  ['Everyday to occasion', 'Quietly tailored sets for ordinary days, richly worked formals for the evenings that deserve them.'],
];

export default function OurStory() {
  usePageTitle('Our Story');
  return (
    <>
      <section className="bg-gradient-to-b from-mist/40 via-blush/35 to-ivory pb-12 pt-10 sm:pt-16">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h1 className="display-xl mt-4 max-w-4xl">
              Elegance, <em className="font-normal italic text-burgundy">woven</em> into every detail.
            </h1>
          </Reveal>
          <div className="mt-10 grid grid-cols-3 items-end gap-3 sm:gap-6">
            {[6, 5, 4].map((n, i) => (
              <ImageReveal
                key={n}
                delay={i * 0.1}
                className={`arch relative overflow-hidden bg-sand ${i === 1 ? 'aspect-[3/5]' : 'aspect-[3/4.2]'}`}
              >
                <Photo photo={photo(n)} eager={i === 1} />
              </ImageReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x grid gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow">Philosophy</p>
          <h2 className="display-md mt-3">Contemporary luxury, rooted in ethnic dressing</h2>
        </Reveal>
        <Reveal className="lede space-y-5 lg:col-span-4 lg:col-start-5" delay={0.08}>
          <p>
            ÉLVARÉN is a contemporary ethnic-wear label inspired by Pakistani silhouettes, refined embroidery and elegant festive
            dressing — interpreted through modern, minimal tailoring.
          </p>
          <p>
            We design for women who want pieces that feel considered rather than loud: an everyday long suit that is easy to wear, a
            wedding-guest formal with depth of colour and detail, a lehenga that photographs beautifully and still feels like you.
          </p>
          <p>
            Every collection starts from the same question — what will she want to wear on the day that matters, and will she still love
            it years from now?
          </p>
        </Reveal>
        <ImageReveal className="relative aspect-[3/4] overflow-hidden bg-sand lg:col-span-3">
          <Photo photo={photo(3)} />
        </ImageReveal>
      </section>

      <section aria-label="Moodboard" className="bg-ink py-14 text-ivory sm:py-20">
        <div className="on-dark container-x grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow !text-ivory/65">In the frame</p>
            <p className="mt-4 font-display text-3xl italic leading-snug sm:text-4xl">
              Powder blue, blush and soft sage, set beside champagne gold.
            </p>
          </Reveal>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:col-span-8">
            {[2, 10, 20, 23].map((n, i) => (
              <li key={n} className={i % 2 ? 'sm:mt-8' : ''}>
                <div className="relative aspect-[3/4.2] overflow-hidden bg-sand/20">
                  <Photo photo={photo(n)} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="inspo" className="bg-blush/40 py-14 sm:py-20">
        <div className="container-x">
          <Reveal className="mb-10 max-w-2xl">
            <p className="eyebrow">Design details</p>
            <h2 id="inspo" className="display-lg mt-3">What we pay attention to</h2>
          </Reveal>
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {details.map(([t, d]) => (
              <Reveal key={t} className="border-t border-espresso/25 pt-5">
                <dt className="font-display text-2xl">{t}</dt>
                <dd className="mt-2 text-espresso/80">{d}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section aria-label="Closing note" className="relative isolate overflow-hidden bg-ink text-ivory">
        <div className="absolute inset-0 -z-10 opacity-45">
          <Parallax distance={30}>
            <Photo photo={photo(18)} />
          </Parallax>
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/30" aria-hidden="true" />
        <div className="on-dark container-x py-24 sm:py-32 lg:py-40">
          <Reveal className="max-w-2xl">
            <div className="rule" />
            <p className="mt-6 font-display text-3xl italic leading-snug sm:text-5xl">
              What will she want to wear on the day that matters, and will she still love it years from now?
            </p>
            <Link to="/collections" className="btn btn-light mt-10">Explore the Collection</Link>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="journey" className="section-y">
        <div className="container-x">
          <Reveal className="mb-12 max-w-2xl">
            <p className="eyebrow">A visual journey</p>
            <h2 id="journey" className="display-lg mt-3">Five collections, one point of view</h2>
          </Reveal>
          <div className="space-y-16 sm:space-y-24">
            {collections.map((c, i) => {
              const p = getProduct(c.imageProductId);
              const flip = i % 2 === 1;
              return (
                <div key={c.id} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                  <ImageReveal className={`relative aspect-[4/5] overflow-hidden bg-sand lg:col-span-5 ${flip ? 'lg:order-2 lg:col-start-8' : ''}`}>
                    {c.cover ? <Photo photo={c.cover} position={c.position} /> : <ProductImage product={p} position={c.position} />}
                  </ImageReveal>
                  <Reveal className={`lg:col-span-6 ${flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-7'}`}>
                    <p className="eyebrow">Collection {c.number}</p>
                    <h3 className="display-md mt-3">{c.name}</h3>
                    <p className="lede mt-4 max-w-lg">{c.description}</p>
                    <Link to={`/collections/${c.slug}`} className="link-arrow mt-6">Explore Collection</Link>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
