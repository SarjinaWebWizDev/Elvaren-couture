// Order submission. With no backend configured (site.orders.endpoint === null)
// the order is recorded on THIS device only and the UI says so plainly.
import { site } from '../data/site.js';
import { readJSON, writeJSON } from './storage.js';

const HISTORY_KEY = 'elvaren.orders.v1';
const LAST_KEY = 'elvaren.lastOrder.v1';

export const makeOrderId = () =>
  `ELV-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

export async function submitOrder(order) {
  const endpoint = site.orders.endpoint;
  let mode = 'local';

  if (endpoint) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`The order service responded with status ${res.status}.`);
      mode = 'remote';
    } catch (err) {
      if (err.name === 'AbortError') throw new Error('The order service took too long to respond. Please try again.');
      throw new Error(err.message || 'We could not reach the order service. Please try again.');
    } finally {
      clearTimeout(timer);
    }
  }

  const saved = { ...order, mode };
  const history = readJSON(HISTORY_KEY, []);
  writeJSON(HISTORY_KEY, [saved, ...history].slice(0, 20));
  writeJSON(LAST_KEY, saved, 'session');
  return saved;
}

export const readLastOrder = () => readJSON(LAST_KEY, null, 'session');

// ── Validation ───────────────────────────────────────────────────────────────
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());
export const isPincode = (v) => /^[1-9][0-9]{5}$/.test(String(v).trim());
export const isIndianMobile = (v) => /^(?:\+?91|0)?[6-9]\d{9}$/.test(String(v).replace(/[\s-]/g, ''));

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal',
];
