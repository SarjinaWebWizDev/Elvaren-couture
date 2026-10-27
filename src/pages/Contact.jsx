import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import usePageTitle from '../hooks/usePageTitle';
import { site } from '../data/site';
import { isEmail } from '../utils/orders';

const SUBJECTS = ['General enquiry', 'Order enquiry', 'Sizing help', 'Returns & exchange', 'Something else'];

export default function Contact() {
  usePageTitle('Contact');
  const [v, setV] = useState({ name: '', email: '', subject: SUBJECTS[0], orderRef: '', message: '' });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ status: 'idle', message: '' });
  const { contact } = site;
  const hasAny = contact.email || contact.phone || contact.address || contact.hours;

  const set = (k) => (e) => {
    setV((x) => ({ ...x, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };
  const ia = (k) => ({ id: `ct-${k}`, 'aria-invalid': Boolean(errors[k]), 'aria-describedby': errors[k] ? `ct-${k}-err` : undefined });

  async function onSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (v.name.trim().length < 2) errs.name = 'Please enter your name.';
    if (!isEmail(v.email)) errs.email = 'Please enter a valid email address.';
    if (v.message.trim().length < 10) errs.message = 'Please write a message of at least 10 characters.';
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`ct-${first}`)?.focus();
      return;
    }

    if (!contact.endpoint) {
      setState({
        status: 'unsent',
        message: contact.email
          ? `Contact form delivery is not connected yet, so your message has not been sent. Please email us at ${contact.email} instead.`
          : 'Contact form delivery is not connected yet, so your message has NOT been sent to anyone. Customer-care contact details have also not been configured on this site yet.',
      });
      return;
    }

    setState({ status: 'sending', message: '' });
    try {
      const res = await fetch(contact.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...v, name: v.name.trim(), email: v.email.trim(), message: v.message.trim() }),
      });
      if (!res.ok) throw new Error('The message service could not accept your message. Please try again.');
      setState({ status: 'sent', message: 'Thank you — your message has been sent. We will reply by email.' });
      setV({ name: '', email: '', subject: SUBJECTS[0], orderRef: '', message: '' });
    } catch (err) {
      setState({ status: 'error', message: err.message || 'Something went wrong. Please try again.' });
    }
  }

  return (
    <>
      <PageHeader eyebrow="Customer care" title="Contact" crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}>
        Questions about sizing, care or an order? Send us a message.
      </PageHeader>
      <div className="container-x grid gap-12 pb-20 sm:pb-28 lg:grid-cols-12 lg:gap-16">
        <form onSubmit={onSubmit} noValidate className="space-y-5 lg:col-span-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="ct-name" className="field-label">Name</label>
              <input {...ia('name')} className="field" value={v.name} onChange={set('name')} autoComplete="name" />
              {errors.name && <p id="ct-name-err" role="alert" className="field-error">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="ct-email" className="field-label">Email</label>
              <input {...ia('email')} type="email" inputMode="email" className="field" value={v.email} onChange={set('email')} autoComplete="email" />
              {errors.email && <p id="ct-email-err" role="alert" className="field-error">{errors.email}</p>}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="ct-subject" className="field-label">Subject</label>
              <select id="ct-subject" className="field" value={v.subject} onChange={set('subject')}>
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            {v.subject === 'Order enquiry' && (
              <div>
                <label htmlFor="ct-orderRef" className="field-label">
                  Order reference <span className="font-normal normal-case tracking-normal text-espresso/60">(optional)</span>
                </label>
                <input id="ct-orderRef" className="field" value={v.orderRef} onChange={set('orderRef')} placeholder="ELV-…" />
              </div>
            )}
          </div>
          <div>
            <label htmlFor="ct-message" className="field-label">Message</label>
            <textarea {...ia('message')} className="field" value={v.message} onChange={set('message')} />
            {errors.message && <p id="ct-message-err" role="alert" className="field-error">{errors.message}</p>}
          </div>
          <button type="submit" disabled={state.status === 'sending'} className="btn btn-primary">
            {state.status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          <div aria-live="polite">
            {state.message && (
              <p
                role={state.status === 'error' || state.status === 'unsent' ? 'alert' : 'status'}
                className={`border p-4 text-sm ${
                  state.status === 'sent' ? 'border-sage bg-sage/15' : state.status === 'error' ? 'border-[#9b2c2c]/40 bg-[#fbeeee] text-[#7a1f1f]' : 'border-gold/60 bg-sand/50'
                }`}
              >
                {state.message}
              </p>
            )}
          </div>
        </form>

        <aside className="space-y-8 lg:col-span-4 lg:col-start-9">
          <section>
            <h2 className="display-md">Customer care</h2>
            {hasAny ? (
              <ul className="mt-4 space-y-2 text-espresso/85">
                {contact.email && <li><a className="link-quiet" href={`mailto:${contact.email}`}>{contact.email}</a></li>}
                {contact.phone && <li><a className="link-quiet" href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a></li>}
                {contact.hours && <li>{contact.hours}</li>}
                {contact.address && <li>{contact.address}</li>}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-espresso/75">
                Customer-care contact details have not been published on this site yet.
              </p>
            )}
          </section>
          <section>
            <h2 className="font-display text-2xl">Helpful links</h2>
            <ul className="mt-3 space-y-1">
              <li><Link to="/faq" className="link-quiet inline-flex min-h-11 items-center">Frequently asked questions</Link></li>
              <li><Link to="/shipping-returns" className="link-quiet inline-flex min-h-11 items-center">Shipping &amp; returns</Link></li>
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
}
