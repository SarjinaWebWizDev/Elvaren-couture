// Accessible size picker built on real radio inputs (arrow keys + screen readers work natively).
export default function SizeSelector({ product, value, onChange, error, id = 'size' }) {
  if (!product.sizes.length) return null;
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined} id={`${id}-group`}>
      <legend className="field-label">
        Size{value ? <span className="ml-2 font-normal normal-case tracking-normal text-espresso/70">{value}</span> : null}
      </legend>
      <div className="flex flex-wrap gap-2">
        {product.sizes.map((s) => {
          const unavailable = product.unavailableSizes.includes(s);
          return (
            <label key={s} className="cursor-pointer">
              <input
                type="radio"
                name={id}
                value={s}
                checked={value === s}
                disabled={unavailable}
                onChange={() => onChange(s)}
                className="peer sr-only"
              />
              <span
                className={`grid h-12 min-w-12 place-items-center border px-3 text-sm font-medium transition-colors peer-checked:border-espresso peer-checked:bg-espresso peer-checked:text-ivory peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-burgundy peer-disabled:cursor-not-allowed peer-disabled:text-espresso/40 peer-disabled:line-through hover:border-espresso ${
                  error ? 'border-[#9b2c2c]' : 'border-espresso/30'
                }`}
              >
                {s}
                {unavailable && <span className="sr-only"> (unavailable)</span>}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="field-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
