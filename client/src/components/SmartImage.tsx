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
 *
 * Uses a hidden proxy image with crossOrigin to test pixel data.
 * If CORS blocks access, falls back to aspect ratio heuristic.
 */
export default function SmartImage({ src, alt, className = '', scaleOnWhitespace = 'scale-125' }: SmartImageProps) {
  const [hasWhitespace, setHasWhitespace] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const detectWhitespace = useCallback(() => {
    const img = imgRef.current;
    if (!img || !img.naturalWidth) return;

    // Heuristic: if the image's natural aspect ratio is close to 4:3 or 16:9
    // it's likely a proper photo. If it's close to 1:1 or has unusual ratio,
    // it may have padding. Also check if dimensions suggest a padded/bordered image.
    const ratio = img.naturalWidth / img.naturalHeight;

    // Try canvas detection with a separate image element
    const testImg = new Image();
    testImg.crossOrigin = 'anonymous';
    testImg.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 40;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(testImg, 0, 0, size, size);

        let whitePixels = 0;
        let totalEdgePixels = 0;
        const data = ctx.getImageData(0, 0, size, size).data;

        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            const isEdge = x < 2 || x >= size - 2 || y < 2 || y >= size - 2;
            if (!isEdge) continue;
            totalEdgePixels++;
            const i = (y * size + x) * 4;
            if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) {
              whitePixels++;
            }
          }
        }

        if (totalEdgePixels > 0 && whitePixels / totalEdgePixels > 0.4) {
          setHasWhitespace(true);
        }
      } catch {
        // CORS blocked pixel access — use aspect ratio heuristic
        // Images very close to square from maskinbladet often have white padding
        if (ratio > 0.9 && ratio < 1.15) {
          setHasWhitespace(true);
        }
      }
    };
    testImg.onerror = () => {
      // CORS completely blocked — use aspect ratio heuristic
      if (ratio > 0.9 && ratio < 1.15) {
        setHasWhitespace(true);
      }
    };
    testImg.src = src;
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      onLoad={detectWhitespace}
      className={`${className} ${hasWhitespace ? scaleOnWhitespace : ''}`}
      loading="lazy"
    />
  );
}
