import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ value, onChange, min = 1, max = 10, label = 'Quantity', size = 'md' }) {
  const box = size === 'sm' ? 'size-10' : 'size-12';
  return (
    <div role="group" aria-label={label} className="inline-flex items-stretch border border-espresso/30">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={`${box} grid place-items-center transition-colors hover:bg-sand/70 disabled:opacity-35 disabled:hover:bg-transparent`}
      >
        <Minus size={15} />
      </button>
      <output aria-live="polite" className="grid min-w-10 place-items-center px-1 text-sm font-medium">
        {value}
      </output>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={`${box} grid place-items-center transition-colors hover:bg-sand/70 disabled:opacity-35 disabled:hover:bg-transparent`}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
