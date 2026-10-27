// A slow, pausable ticker of collection names. Static for reduced-motion users
// (the global reduced-motion rule stops the animation) and the duplicate copy
// is hidden from assistive technology.
const Diamond = () => (
  <svg viewBox="0 0 10 10" className="mx-6 size-2 shrink-0 text-gold sm:mx-10" aria-hidden="true">
    <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" />
  </svg>
);

export default function Marquee({ items, className = '' }) {
  const row = (hidden) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t} className="flex shrink-0 items-center whitespace-nowrap">
          <span className="font-display text-[1.6rem] italic leading-none sm:text-[2.2rem]">{t}</span>
          <Diamond />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`marquee overflow-hidden ${className}`}>
      <div className="marquee-track flex w-max items-center">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
