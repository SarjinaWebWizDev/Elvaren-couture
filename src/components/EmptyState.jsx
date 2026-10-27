import { LogoMark } from './Logo';

export default function EmptyState({ title, children, actions, className = '' }) {
  return (
    <div className={`mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 ${className}`}>
      <LogoMark className="size-14 text-burgundy/80" />
      <div className="rule my-6" />
      <h2 className="display-md">{title}</h2>
      <p className="lede mt-3">{children}</p>
      {actions && <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{actions}</div>}
    </div>
  );
}
