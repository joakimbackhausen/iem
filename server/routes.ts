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
