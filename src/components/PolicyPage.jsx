import PageHeader from './PageHeader';
import usePageTitle from '../hooks/usePageTitle';
import { site } from '../data/site';

export default function PolicyPage({ title, eyebrow = 'Policies', intro, sections }) {
  usePageTitle(title);
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} crumbs={[{ label: 'Home', to: '/' }, { label: title }]}>
        {intro}
      </PageHeader>
      <div className="container-x pb-20 sm:pb-28">
        {!site.policyReviewed && (
          <p role="note" className="mb-10 max-w-3xl border border-gold/60 bg-sand/50 p-4 text-sm">
            <strong>Draft notice:</strong> this page is a starting template written for the site as configured. It has not yet been
            reviewed by the business owner or a legal adviser. Review it, then set <code>policyReviewed: true</code> in{' '}
            <code>src/data/site.js</code> to remove this notice.
          </p>
        )}
        <div className="max-w-3xl space-y-10">
          {sections.map((s) => (
            <section key={s.heading} aria-labelledby={`h-${s.heading.replace(/\W+/g, '-')}`}>
              <h2 id={`h-${s.heading.replace(/\W+/g, '-')}`} className="display-md mb-3">
                {s.heading}
              </h2>
              <div className="space-y-3 text-[0.98rem] leading-relaxed text-espresso/85">
                {s.body.map((b, i) =>
                  Array.isArray(b) ? (
                    <ul key={i} className="list-disc space-y-1.5 pl-5">
                      {b.map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={i}>{b}</p>
                  ),
                )}
              </div>
            </section>
          ))}
          <p className="border-t pt-6 text-sm text-espresso/65">Last updated: {site.policyUpdated}</p>
        </div>
      </div>
    </>
  );
}
