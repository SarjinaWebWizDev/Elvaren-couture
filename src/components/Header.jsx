import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Heart, Menu, Search, ShoppingBag } from 'lucide-react';
import Logo from './Logo';
import Portal from './Portal';
import MobileNav from './MobileNav';
import SearchOverlay from './SearchOverlay';
import { collections } from '../data/collections';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const linkBase =
  'relative inline-flex min-h-11 items-center text-[0.7rem] font-semibold uppercase tracking-[0.2em] transition-colors hover:text-burgundy after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-burgundy after:transition-transform after:duration-500 hover:after:scale-x-100';

function Badge({ count }) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 520, damping: 22 }}
          className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center bg-burgundy px-1 text-[0.62rem] font-semibold leading-none text-ivory"
          aria-hidden="true"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default function Header() {
  const { pathname, search } = useLocation();
  const { itemCount, openDrawer } = useCart();
  const { count: wishCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    setNavOpen(false);
    setSearchOpen(false);
  }, [pathname, search]);

  const onShop = pathname === '/shop';
  const isNew = new URLSearchParams(search).get('new') === '1';
  const active = (on) => (on ? 'text-burgundy after:scale-x-100' : '');

  const iconBtn = 'relative grid size-11 place-items-center transition-colors hover:text-burgundy';

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-500 ${
        scrolled ? 'border-espresso/12 bg-ivory/95 shadow-[0_14px_30px_-26px_rgba(33,25,23,0.5)] backdrop-blur-md' : 'border-transparent bg-ivory'
      }`}
    >
      <div className="container-x grid h-[var(--header-h)] grid-cols-[auto_1fr_auto] items-center gap-2">
        <button
          type="button"
          onClick={() => setNavOpen(true)}
          aria-label="Open menu"
          aria-haspopup="dialog"
          className={`${iconBtn} -ml-2.5 lg:hidden`}
        >
          <Menu size={24} strokeWidth={1.5} />
        </button>

        <div className="justify-self-center lg:justify-self-start">
          <Logo size="sm" />
        </div>

        <nav aria-label="Primary" className="hidden justify-self-center lg:block">
          <ul className="flex items-center gap-8 xl:gap-10">
            <li>
              <NavLink to="/" end className={({ isActive }) => `${linkBase} ${active(isActive)}`}>
                Home
              </NavLink>
            </li>
            <li>
              <Link to="/shop?new=1&sort=newest" className={`${linkBase} ${active(onShop && isNew)}`}>
                New Arrivals
              </Link>
            </li>
            <li>
              <Link to="/shop" className={`${linkBase} ${active(onShop && !isNew)}`}>
                Shop
              </Link>
            </li>
            <li className="group relative">
              <NavLink
                to="/collections"
                className={`${linkBase} gap-1.5 ${active(pathname.startsWith('/collections'))}`}
              >
                Collections <ChevronDown size={13} aria-hidden="true" className="transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" />
              </NavLink>
              <div className="invisible absolute left-1/2 top-full z-50 w-[300px] -translate-x-1/2 pt-2 opacity-0 transition-[opacity,visibility] duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <ul className="border bg-ivory p-2 shadow-[0_24px_50px_-30px_rgba(48,36,31,0.45)]">
                  {collections.map((c) => (
                    <li key={c.id}>
                      <Link
                        to={`/collections/${c.slug}`}
                        className="flex min-h-11 items-baseline gap-3 px-4 py-2.5 text-sm hover:bg-sand/60 hover:text-burgundy"
                      >
                        <span className="text-[0.62rem] tracking-[0.2em] text-espresso/55">{c.number}</span>
                        <span className="font-display text-lg leading-none">{c.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li>
              <NavLink to="/our-story" className={({ isActive }) => `${linkBase} ${active(isActive)}`}>
                Our Story
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => `${linkBase} ${active(isActive)}`}>
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="-mr-2.5 flex items-center justify-self-end">
          <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search" aria-haspopup="dialog" className={iconBtn}>
            <Search size={21} strokeWidth={1.5} />
          </button>
          <Link
            to="/wishlist"
            aria-label={`Wishlist${wishCount ? `, ${wishCount} saved` : ''}`}
            className={`${iconBtn} hidden min-[400px]:grid`}
          >
            <Heart size={21} strokeWidth={1.5} />
            <Badge count={wishCount} />
          </Link>
          <button
            type="button"
            onClick={openDrawer}
            aria-label={`Shopping bag${itemCount ? `, ${itemCount} item${itemCount === 1 ? '' : 's'}` : ', empty'}`}
            aria-haspopup="dialog"
            className={iconBtn}
          >
            <ShoppingBag size={21} strokeWidth={1.5} />
            <Badge count={itemCount} />
          </button>
        </div>
      </div>

      <Portal>
        <AnimatePresence>
          {navOpen && (
            <MobileNav
              key="nav"
              onClose={() => setNavOpen(false)}
              onSearch={() => {
                setNavOpen(false);
                setSearchOpen(true);
              }}
            />
          )}
          {searchOpen && <SearchOverlay key="search" onClose={() => setSearchOpen(false)} />}
        </AnimatePresence>
      </Portal>
    </header>
  );
}
