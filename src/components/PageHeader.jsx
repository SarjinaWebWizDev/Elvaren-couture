import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Reveal from './Reveal';

export default function PageHeader({ eyebrow, title, children, crumbs = [], className = '' }) {
  return (
    <header className={`container-x pb-8 pt-10 sm:pb-12 sm:pt-16 ${className}`}>
      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-espresso/70">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-1">
                {c.to ? (
                  <Link to={c.to} className="hover:text-burgundy hover:underline">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-espresso">{c.label}</span>
                )}
                {i < crumbs.length - 1 && <ChevronRight size={12} aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <Reveal>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="display-lg mt-3 max-w-4xl">{title}</h1>
        {children && <div className="lede mt-5 max-w-2xl">{children}</div>}
        <div className="rule mt-8" />
      </Reveal>
    </header>
  );
}
