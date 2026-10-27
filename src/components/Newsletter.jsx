import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../data/site';
import { isEmail } from '../utils/orders';
import { readJSON, writeJSON } from '../utils/storage';

const KEY = 'elvaren.newsletter.v1';

// Honest newsletter form: validates, and only claims "subscribed" when a real
// endpoint accepted the request. Without one, the email is kept on this device
// only and the message says exactly that.
export default function Newsletter({ tone = 'light', className = '' }) {
  const uid = useId();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ status: 'idle', message: '' });
  const dark = tone === 'dark';

  async function onSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (!isEmail(email)) errs.email = 'Please enter a valid email address.';
    if (!consent) errs.consent = 'Please confirm that you agree to receive emails.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setState({ status: 'sending', message: '' });
    try {
      if (site.newsletter.endpoint) {
        const res = await fetch(site.newsletter.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), consent: true, source: 'website' }),
        });
        if (!res.ok) throw new Error('The sign-up service could not process your request. Please try again.');
        setState({ status: 'sent', message: 'Thank you — you are on the list. We will write with news of new collections.' });
      } else {
        const list = readJSON(KEY, []);
        writeJSON(KEY, [...new Set([...list, email.trim().toLowerCase()])]);
        setState({
          status: 'local',
          message:
            'Thank you. Your email is saved on this device only — newsletter delivery is not connected on this site yet, so no emails will be sent.',
        });
      }
      setEmail('');
      setConsent(false);
    } catch (err) {
      setState({ status: 'error', message: err.message || 'Something went wrong. Please try again.' });
    }
  }

  const muted = dark ? 'text-ivory/75' : 'text-espresso/70';

  return (
    <form onSubmit={onSubmit} noValidate className={className} aria-label="Newsletter sign-up">
      <label htmlFor={`${uid}-email`} className="field-label">
        Email address
      </label>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="min-w-0 flex-1">
          <input
            id={`${uid}-email`}
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="field"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${uid}-email-err` : undefined}
          />
          {errors.email && (
            <p id={`${uid}-email-err`} role="alert" className={`field-error ${dark ? '!text-[#ffb4b4]' : ''}`}>
              {errors.email}
            </p>
          )}
        </div>
        <button type="submit" disabled={state.status === 'sending'} className={`btn shrink-0 ${dark ? 'btn-light' : 'btn-primary'}`}>
          {state.status === 'sending' ? 'Sending…' : 'Subscribe'}
        </button>
      </div>

      <div className="mt-3">
        <label className="flex cursor-pointer items-start gap-3 text-[0.78rem] leading-snug">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? `${uid}-consent-err` : undefined}
            className="mt-0.5 size-5 shrink-0 accent-[#B69A68]"
          />
          <span className={muted}>
            I agree to receive occasional emails from ÉLVARÉN about collections and offers, and to the{' '}
            <Link to="/privacy-policy" className="link-quiet">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p id={`${uid}-consent-err`} role="alert" className={`field-error ${dark ? '!text-[#ffb4b4]' : ''}`}>
            {errors.consent}
          </p>
        )}
      </div>

      <div aria-live="polite" className="min-h-0">
        {state.message && (
          <p className={`mt-3 text-sm ${state.status === 'error' ? (dark ? 'text-[#ffb4b4]' : 'text-[#9b2c2c]') : dark ? 'text-ivory' : 'text-espresso'}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
