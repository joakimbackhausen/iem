import { useState, useRef, useCallback } from 'react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  scaleOnWhitespace?: string;
}

/**
 * Image that auto-detects white borders via backend proxy and scales to crop them.
 * Checks /api/image-check?url=... which returns { hasWhitespace: boolean }.
 * Caches results in sessionStorage to avoid repeated checks.
 */

const checkedCache = new Map<string, boolean>();

export default function SmartImage({ src, alt, className = '', scaleOnWhitespace = 'scale-125' }: SmartImageProps) {
  const [hasWhitespace, setHasWhitespace] = useState(() => checkedCache.get(src) ?? false);
  const checked = useRef(checkedCache.has(src));

  const onLoad = useCallback(() => {
    if (checked.current) return;
    checked.current = true;

    // Only check external images (feed images from maskinbladet)
    if (!src.startsWith('http')) {
      checkedCache.set(src, false);
      return;
    }

    fetch(`/api/image-check?url=${encodeURIComponent(src)}`)
      .then(r => r.json())
      .then(data => {
        checkedCache.set(src, data.hasWhitespace);
        if (data.hasWhitespace) setHasWhitespace(true);
      })
      .catch(() => {
        checkedCache.set(src, false);
      });
  }, [src]);

  return (
    <img
      ref={undefined}
      src={src}
      alt={alt}
      onLoad={onLoad}
      className={`${className} ${hasWhitespace ? scaleOnWhitespace : ''}`}
      loading="lazy"
    />
  );
}
