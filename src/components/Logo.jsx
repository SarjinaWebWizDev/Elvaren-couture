import { Link } from 'react-router-dom';

// E monogram with a gold accent — the same artwork as /favicon.svg.
export function LogoMark({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <circle cx="32" cy="34" r="29" fill="none" stroke="#B69A68" strokeWidth="1.4" />
      <g fill="currentColor">
        <rect x="21" y="19" width="4.6" height="30" />
        <rect x="21" y="19" width="22" height="4.2" />
        <rect x="21" y="32" width="16.5" height="3.6" />
        <rect x="21" y="44.8" width="22" height="4.2" />
      </g>
      <path d="M27.5 13.5 L36.5 9" stroke="#B69A68" strokeWidth="2.2" fill="none" strokeLinecap="square" />
    </svg>
  );
}

export default function Logo({ className = '', size = 'md', showMark = true, tagline = false, to = '/' }) {
  const word =
    size === 'lg'
      ? 'text-[2rem] sm:text-[2.4rem]'
      : size === 'sm'
        ? 'text-[1.02rem] min-[400px]:text-[1.2rem]'
        : 'text-[1.2rem] sm:text-[1.55rem]';
  return (
    <Link
      to={to}
      aria-label="ÉLVARÉN — home"
      className={`inline-flex flex-col items-center leading-none text-espresso ${className}`}
    >
      <span className="inline-flex items-center gap-2.5">
        {showMark && <LogoMark className={`${size === 'lg' ? 'size-10' : 'size-7'} hidden text-burgundy sm:block`} />}
        <span
          className={`font-display font-medium tracking-[0.3em] ${word} -mr-[0.3em]`}
          style={{ fontFeatureSettings: '"liga" 0' }}
        >
          ÉLVARÉN
        </span>
      </span>
      {tagline && (
        <span className="mt-2 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-espresso/65">
          Elegance, Woven Into Every Detail.
        </span>
      )}
    </Link>
  );
}
