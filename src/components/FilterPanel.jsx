import { Check } from 'lucide-react';
import { products } from '../data/products';
import { collections } from '../data/collections';
import { swatches } from '../data/colours';
import { formatINR } from '../utils/currency';
import { priceBounds } from '../utils/filter';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLOURS = [...new Set(products.flatMap((p) => p.colourFamily))].sort();
const BOUNDS = priceBounds(products);
const toggle = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

function Group({ title, children }) {
  return (
    <fieldset className="border-b py-5 first:pt-0 last:border-b-0">
      <legend className="eyebrow float-left mb-3 w-full !text-espresso">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

const check = (checked) =>
  `grid size-5 shrink-0 place-items-center border transition-colors ${
    checked ? 'border-espresso bg-espresso text-ivory' : 'border-espresso/40 bg-white/60'
  }`;

export default function FilterPanel({ value, onChange, idPrefix = 'f', showCollections = true }) {
  const set = (patch) => onChange({ ...value, ...patch });
  const numChange = (key) => (e) => {
    const n = parseInt(e.target.value, 10);
    set({ [key]: Number.isFinite(n) && n >= 0 ? n : null });
  };

  return (
    <div>
      {showCollections && (
        <Group title="Collection">
          <ul className="space-y-0.5">
            {collections.map((c) => {
              const on = value.collections.includes(c.id);
              return (
                <li key={c.id}>
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={on}
                      onChange={() => set({ collections: toggle(value.collections, c.id) })}
                    />
                    <span className={`${check(on)} peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-burgundy`}>
                      {on && <Check size={13} strokeWidth={3} />}
                    </span>
                    {c.short}
                  </label>
                </li>
              );
            })}
          </ul>
        </Group>
      )}

      <Group title="Price">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${idPrefix}-min`} className="mb-1 block text-xs text-espresso/70">
              From (₹)
            </label>
            <input
              id={`${idPrefix}-min`}
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              placeholder={String(BOUNDS.min)}
              value={value.min ?? ''}
              onChange={numChange('min')}
              className="field"
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-max`} className="mb-1 block text-xs text-espresso/70">
              To (₹)
            </label>
            <input
              id={`${idPrefix}-max`}
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              placeholder={String(BOUNDS.max)}
              value={value.max ?? ''}
              onChange={numChange('max')}
              className="field"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-espresso/65">
          Catalogue range {formatINR(BOUNDS.min)} – {formatINR(BOUNDS.max)}
        </p>
      </Group>

      <Group title="Colour">
        <ul className="grid grid-cols-2 gap-x-2">
          {COLOURS.map((c) => {
            const on = value.colours.includes(c);
            return (
              <li key={c}>
                <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={on}
                    onChange={() => set({ colours: toggle(value.colours, c) })}
                  />
                  <span
                    aria-hidden="true"
                    style={{ background: swatches[c] || '#ccc' }}
                    className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                      on ? 'ring-2 ring-espresso ring-offset-2 ring-offset-ivory' : 'border-espresso/25'
                    } peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-burgundy`}
                  />
                  <span>{c}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </Group>

      <Group title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => {
            const on = value.sizes.includes(s);
            return (
              <label key={s} className="cursor-pointer">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={on}
                  onChange={() => set({ sizes: toggle(value.sizes, s) })}
                />
                <span className="grid h-11 min-w-11 place-items-center border border-espresso/30 px-3 text-sm transition-colors peer-checked:border-espresso peer-checked:bg-espresso peer-checked:text-ivory peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-burgundy hover:border-espresso">
                  {s}
                </span>
              </label>
            );
          })}
        </div>
      </Group>

      <Group title="Availability">
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={value.inStock}
            onChange={(e) => set({ inStock: e.target.checked })}
          />
          <span className={`${check(value.inStock)} peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-burgundy`}>
            {value.inStock && <Check size={13} strokeWidth={3} />}
          </span>
          In stock only
        </label>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={value.onlyNew}
            onChange={(e) => set({ onlyNew: e.target.checked })}
          />
          <span className={`${check(value.onlyNew)} peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-burgundy`}>
            {value.onlyNew && <Check size={13} strokeWidth={3} />}
          </span>
          New arrivals only
        </label>
      </Group>
    </div>
  );
}
