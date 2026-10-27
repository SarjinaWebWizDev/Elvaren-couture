import { useState } from 'react';
import { LogoMark } from './Logo';

// Editorial photograph with graceful failure. A missing file shows a branded
// placeholder (never an unrelated image) and logs the exact filename.
// `natural` renders at the photograph's own aspect ratio; otherwise it fills
// its (positioned, sized) parent with object-cover.
export default function Photo({ photo, eager = false, natural = false, position, className = '', fit = 'cover' }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label="Photograph unavailable"
        className={`flex items-center justify-center bg-sand text-espresso/60 ${natural ? 'w-full' : 'h-full w-full'}`}
        style={natural ? { aspectRatio: `${photo.w} / ${photo.h}` } : undefined}
      >
        <LogoMark className="size-10 text-burgundy" />
      </div>
    );
  }

  return (
    <img
      ref={(el) => {
        if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
      }}
      onLoad={() => setLoaded(true)}
      src={photo.src}
      alt={photo.alt}
      width={photo.w}
      height={photo.h}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      onError={() => {
        console.error(`[ÉLVARÉN] Missing editorial image: ${photo.file} (expected at ${photo.src})`);
        setFailed(true);
      }}
      className={`transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${natural ? 'h-auto w-full' : `h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`} ${className}`}
      style={natural ? undefined : { objectPosition: position || photo.pos }}
    />
  );
}
