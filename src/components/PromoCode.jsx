import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { campaign } from '../data/campaign';
import { isOfferLive } from '../utils/pricing';

export default function PromoCode() {
  const { code, applyCode, removeCode, pricing } = useCart();
  const [value, setValue] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const live = isOfferLive(campaign.offer);

  const submit = (e) => {
    e.preventDefault();
    const res = applyCode(value);
    setMessage({ type: res.ok ? 'ok' : 'error', text: res.message });
    if (res.ok) setValue('');
  };

  if (code) {
    return (
      <div className="border border-burgundy/30 bg-burgundy/[0.04] p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Check size={16} className="text-burgundy" /> {code} applied
          </p>
          <button
            type="button"
            onClick={() => {
              removeCode();
              setMessage({ type: '', text: '' });
            }}
            className="inline-flex min-h-11 items-center gap-1 px-2 text-xs font-semibold uppercase tracking-[0.14em] hover:text-burgundy"
            aria-label={`Remove code ${code}`}
          >
            <X size={14} /> Remove
          </button>
        </div>
        <p className="text-xs text-espresso/75">
          {pricing.discount > 0
            ? `Your discount is shown in the totals below.`
            : pricing.codeNote || 'The discount applies to eligible styles only.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="promo-code" className="field-label">
        Promotional code
      </label>
      <div className="flex gap-2">
        <input
          id="promo-code"
          className="field uppercase"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          autoCapitalize="characters"
          placeholder="Enter code"
          aria-describedby="promo-help"
          aria-invalid={message.type === 'error'}
        />
        <button type="submit" className="btn btn-outline shrink-0 px-5">
          Apply
        </button>
      </div>
      <p id="promo-help" role={message.type === 'error' ? 'alert' : 'status'} className={`mt-2 text-xs ${message.type === 'error' ? 'text-[#9b2c2c]' : 'text-espresso/70'}`}>
        {message.text ||
          (live ? `${campaign.offer.code} applies to selected styles only.` : 'No promotional code is active right now.')}
      </p>
    </form>
  );
}
