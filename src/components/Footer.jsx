import { Link } from 'react-router-dom';
import Logo from './Logo';
import Newsletter from './Newsletter';
import { collections } from '../data/collections';
import { site } from '../data/site';

const colHead = 'eyebrow !text-ivory/60 mb-4';
const link = 'block min-h-9 py-1.5 text-[0.92rem] text-ivory/85 transition-colors hover:text-gold';

export default function Footer() {
  const { contact, social } = site;
  return (
    <footer className="on-dark mt-auto bg-ink text-ivory">
      <div className="container-x grid gap-12 pb-10 pt-16 sm:pt-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="text-ivory [&_a]:text-ivory">
            <Logo size="md" tagline to="/" />
          </div>
          <p className="mt-6 max-w-sm text-sm text-ivory/75">{site.description}</p>
          {social.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1">
              {social.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-quiet inline-flex min-h-11 items-center text-sm">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Shop collections" className="lg:col-span-2">
          <h2 className={colHead}>Shop</h2>
          <ul>
            <li><Link className={link} to="/shop">Shop All</Link></li>
            {collections.map((c) => (
              <li key={c.id}>
                <Link className={link} to={`/collections/${c.slug}`}>{c.short}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Customer care" className="lg:col-span-3">
          <h2 className={colHead}>Customer Care</h2>
          <ul>
            <li><Link className={link} to="/shipping-returns">Shipping &amp; Returns</Link></li>
            <li><Link className={link} to="/faq">FAQs</Link></li>
            <li><Link className={link} to="/contact">Contact</Link></li>
            <li><Link className={link} to="/our-story">Our Story</Link></li>
            <li><Link className={link} to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link className={link} to="/terms-and-conditions">Terms &amp; Conditions</Link></li>
          </ul>
          {(contact.email || contact.phone) && (
            <ul className="mt-4 space-y-1 text-sm text-ivory/80">
              {contact.email && <li><a className="link-quiet" href={`mailto:${contact.email}`}>{contact.email}</a></li>}
              {contact.phone && <li><a className="link-quiet" href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a></li>}
            </ul>
          )}
        </nav>

        <div className="lg:col-span-3">
          <h2 className={colHead}>Newsletter</h2>
          <p className="mb-4 text-sm text-ivory/75">New collections and seasonal edits, delivered occasionally.</p>
          <Newsletter tone="dark" />
        </div>
      </div>

      <div className="border-t border-ivory/15">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-ivory/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ÉLVARÉN. All rights reserved.</p>
          <p>{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
