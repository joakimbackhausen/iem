import { useState, useRef, useCallback } from 'react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  scaleOnWhitespace?: string; // e.g. 'scale-125'
}

/**
 * Image component that detects white borders/whitespace and
 * automatically scales up to crop them out.
 * Falls back to normal display if canvas pixel access is blocked (CORS).
 */
export default function SmartImage({ src, alt, className = '', scaleOnWhitespace = 'scale-125' }: SmartImageProps) {
  const [hasWhitespace, setHasWhitespace] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const detectWhitespace = useCallback(() => {
    const img = imgRef.current;
    if (!img || !img.naturalWidth) return;

    try {
      const canvas = document.createElement('canvas');
      const size = 40; // sample at small size for performance
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, size, size);

      let whitePixels = 0;
      let totalEdgePixels = 0;

      const data = ctx.getImageData(0, 0, size, size).data;

      // Check all 4 edges (2px deep)
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          const isEdge = x < 2 || x >= size - 2 || y < 2 || y >= size - 2;
          if (!isEdge) continue;

          totalEdgePixels++;
          const i = (y * size + x) * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2];

          // Consider near-white pixels (>240 on all channels)
          if (r > 240 && g > 240 && b > 240) {
            whitePixels++;
          }
        }
      }

      // If more than 40% of edge pixels are white, it has whitespace
      if (totalEdgePixels > 0 && whitePixels / totalEdgePixels > 0.4) {
        setHasWhitespace(true);
      }
    } catch {
      // CORS or other error — just show normally
    }
  }, []);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      crossOrigin="anonymous"
      onLoad={detectWhitespace}
      className={`${className} ${hasWhitespace ? scaleOnWhitespace : ''}`}
      loading="lazy"
    />
  );
}
