import { useState } from 'react';
import { LogoMark } from './Logo';

// Renders a supplied product photograph. If the file is missing the page does
// NOT break and no unrelated image is substituted: a branded placeholder is
// shown and the exact missing filename is logged to the console.
export default function ProductImage({ product, index = 0, eager = false, className = '', position, fit }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const src = product.images[index] || product.image;
  const [w, h] = product.imageSize || [800, 1200];
  const useContain = (fit || product.fit) === 'contain';

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`${product.name} — photograph unavailable`}
        className="flex h-full w-full flex-col items-center justify-center gap-3 bg-sand px-4 text-center text-espresso/70"
      >
        <LogoMark className="size-10 text-burgundy" />
        <span className="font-display text-lg leading-tight">{product.name}</span>
        <span className="text-[0.62rem] uppercase tracking-[0.2em]">Photograph unavailable</span>
      </div>
    );
  }

  return (
    <img
      ref={(el) => {
        if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
      }}
      onLoad={() => setLoaded(true)}
      src={src}
      alt={product.alt}
      width={w}
      height={h}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      onError={() => {
        console.error(`[ÉLVARÉN] Missing product image: ${src.split('/').pop()} (expected at ${src})`);
        setFailed(true);
      }}
      className={`h-full w-full ${useContain ? 'object-contain' : 'object-cover'} transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ objectPosition: position || product.objectPosition }}
    />
  );
}
