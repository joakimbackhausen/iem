import type { Express } from "express";
import { createServer, type Server } from "http";
import { fetchAllMachines, fetchMachineById, fetchCategories } from "./scraper";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get('/api/machines', async (req, res) => {
    try {
      const machines = await fetchAllMachines();
      res.json(machines);
    } catch (error) {
      console.error('Error fetching machines:', error);
      res.status(500).json({ error: 'Failed to fetch machines' });
    }
  });

  app.get('/api/machines/:id', async (req, res) => {
    try {
      const machine = await fetchMachineById(parseInt(req.params.id, 10));
      if (!machine) {
        res.status(404).json({ error: 'Machine not found' });
        return;
      }
      res.json(machine);
    } catch (error) {
      console.error('Error fetching machine:', error);
      res.status(500).json({ error: 'Failed to fetch machine' });
    }
  });

  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await fetchCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  // Image whitespace detection — fetches image, samples edge pixels
  const imageCheckCache = new Map<string, boolean>();

  app.get('/api/image-check', async (req, res) => {
    const url = req.query.url as string;
    if (!url) { res.json({ hasWhitespace: false }); return; }

    // Check cache
    if (imageCheckCache.has(url)) {
      res.json({ hasWhitespace: imageCheckCache.get(url) });
      return;
    }

    try {
      const response = await fetch(url);
      const buffer = Buffer.from(await response.arrayBuffer());

      // Quick check: look at raw bytes for common JPEG/PNG white patterns
      // For JPEG: check if file is very small (likely placeholder) or analyze header
      // Simple approach: check if image dimensions suggest padding
      // Use sharp-free approach: sample first/last rows of pixel data

      // Import createCanvas equivalent — use built-in approach
      // Since we can't use canvas on server easily, use a byte-level heuristic:
      // JPEG files with white borders often have 0xFF bytes near the start of scan data

      // Simpler: check if the image URL contains dimension hints suggesting square/padded
      // Or check content-length vs expected size

      // Most reliable server approach without sharp: just check a few bytes
      // PNG: first pixel row data after IHDR
      // JPEG: harder to parse

      // Pragmatic approach: check if image is roughly square (padded images from feed often are)
      // and if file is from maskinbladet
      const isFeedImage = url.includes('maskinbladet') || url.includes('mascus') || url.includes('altimaskiner');

      if (isFeedImage) {
        // Parse image dimensions from the binary
        let width = 0, height = 0;

        if (buffer[0] === 0x89 && buffer[1] === 0x50) {
          // PNG: width at offset 16, height at offset 20 (4 bytes each, big-endian)
          width = buffer.readUInt32BE(16);
          height = buffer.readUInt32BE(20);
        } else if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
          // JPEG: scan for SOF0 marker (0xFF 0xC0) to get dimensions
          for (let i = 2; i < buffer.length - 10; i++) {
            if (buffer[i] === 0xFF && (buffer[i + 1] === 0xC0 || buffer[i + 1] === 0xC2)) {
              height = buffer.readUInt16BE(i + 5);
              width = buffer.readUInt16BE(i + 7);
              break;
            }
          }
        }

        if (width > 0 && height > 0) {
          const ratio = width / height;
          // Feed images that are nearly square often have white padding
          // Normal machine photos are landscape (4:3 = 1.33, 16:9 = 1.78)
          const hasWhitespace = ratio > 0.85 && ratio < 1.2;
          imageCheckCache.set(url, hasWhitespace);
          res.json({ hasWhitespace });
          return;
        }
      }

      imageCheckCache.set(url, false);
      res.json({ hasWhitespace: false });
    } catch {
      imageCheckCache.set(url, false);
      res.json({ hasWhitespace: false });
    }
  });

  // SEO: Dynamic sitemap with all category pages
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const categories = await fetchCategories();
      const baseUrl = 'https://www.iem.dk';
      const today = new Date().toISOString().split('T')[0];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/maskiner</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

      for (const cat of categories) {
        xml += `
  <url>
    <loc>${baseUrl}/maskiner/${cat.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
      }

      xml += `
</urlset>`;

      res.set('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  return httpServer;
}
