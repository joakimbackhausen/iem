import * as cheerio from "cheerio";

const FEED_URL =
  "https://lister.maskinbladet.dk/eksterne/extListe_3.php?c_GUID=509b402d-8036-4e33-b966-006764ee4ab4&color=F7E00E&styleVer=std&CAT=_all_";

interface Machine {
  id: number;
  ad_id: number;
  sku: number;
  company_id: string;
  title: string;
  model: string;
  brand: string;
  year: string;
  price: string;
  currency: string;
  url: string;
  pictures: { url: string; date: string }[];
  category: { id: string; tid: string; name: string }[];
  description: string;
  contact: string;
  address: string;
  extra_parameters: Record<string, { name: string; value: string }>;
  printUrl: string;
}

// ── Cache ──
let cachedMachines: Machine[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 10 * 60 * 1000;
let isRefreshing = false;

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  return res.text();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseListPage(html: string): Machine[] {
  const $ = cheerio.load(html);
  const machines: Machine[] = [];
  let machineId = 1;

  // Top-level categories are <h5> elements like "Entreprenørmaskiner"
  // Under each category, subcategory groups are in .elementGuid
  // Each machine is a .container-fluid.bg-custom inside .sublinks

  let topCategory = "";

  // Walk through the DOM in order
  $("h5, .bg-custom").each((_, el) => {
    const $el = $(el);

    if ((el as cheerio.TagElement).name === "h5") {
      topCategory = $el.text().trim();
      return;
    }

    // This is a machine entry (.bg-custom)
    // Find subcategory from the parent .elementGuid's .list-group-item
    let subCategory = "";
    const parentElement = $el.closest(".elementGuid");
    if (parentElement.length) {
      subCategory = parentElement.find(".list-group-item").first().text().trim();
    }

    const categoryName = subCategory || topCategory || "Andet";

    // Extract image
    const img = $el.find("img").first();
    const imgSrc = img.attr("src") || "";
    // Request higher resolution thumbnail (800x600 instead of 200x150)
    const fullImg = imgSrc.replace(/\?w=\d+&h=\d+/, "?w=800&h=600");

    // Extract detail link
    const detailLink = $el.find('a.btn').attr("href") || $el.find('a[href*="extDetail"]').first().attr("href") || "";

    // Extract table data
    const tbody = $el.find("tbody tr").first();
    const tds = tbody.find("td");
    const brand = $(tds[0]).text().trim();
    const model = $(tds[1]).text().trim();
    const year = $(tds[2]).text().trim();
    const rawPrice = $(tds[3]).text().trim();

    // Clean price: "65.000,00" → "65000"
    const cleanPrice = rawPrice.replace(/\./g, "").replace(/,\d+$/, "");

    // Extract description
    let description = "";
    $el.find("p").each((_, p) => {
      const text = $(p).text().trim();
      if (text.startsWith("Info:")) {
        description = text.replace(/^Info:\s*/, "");
      }
    });

    const title = `${brand} ${model}`.trim();
    if (!title || title.length < 2) return;

    const catSlug = slugify(categoryName);

    machines.push({
      id: machineId,
      ad_id: machineId,
      sku: machineId,
      company_id: "iem",
      title,
      model: model || title,
      brand,
      year,
      price: cleanPrice || "0",
      currency: "DKK",
      url: detailLink,
      pictures: fullImg ? [{ url: fullImg, date: "" }] : [],
      category: [
        { id: slugify(topCategory || "andet"), tid: slugify(topCategory || "andet"), name: topCategory || "Andet" },
        ...(subCategory && subCategory !== topCategory
          ? [{ id: catSlug, tid: catSlug, name: subCategory }]
          : []),
      ],
      description,
      contact: "Peter Holm",
      address: "Vesterbro 73, DK-8970 Havndal",
      extra_parameters: {},
      printUrl: "",
    });
    machineId++;
  });

  return machines;
}

async function enrichWithDetails(machine: Machine): Promise<Machine> {
  if (!machine.url || !machine.url.includes("extDetail")) return machine;
  try {
    const html = await fetchPage(machine.url);
    const $ = cheerio.load(html);

    const pictures: { url: string; date: string }[] = [];
    $("img").each((_, el) => {
      const src = $(el).attr("src") || "";
      if (src.includes("maskinbladet.dk/maskiner/images") || src.includes("maskinbasen.dk")) {
        // Use high-res version: request 1200px wide
        const baseSrc = src.replace(/\?w=\d+&h=\d+/, "");
        const hiRes = baseSrc + "?w=1200&h=900";
        if (!pictures.some((p) => p.url === hiRes)) {
          pictures.push({ url: hiRes, date: "" });
        }
      }
    });
    if (pictures.length > 0) machine.pictures = pictures;

    // Extract print URL for PDF spec sheet
    const printLink = $("a[href*='extPrint']").attr("href") || "";
    if (printLink) {
      const base = new URL(machine.url);
      machine.printUrl = printLink.startsWith("http") ? printLink : `${base.origin}${printLink.startsWith("/") ? "" : "/eksterne/"}${printLink}`;
    }
  } catch {
    // Ignore
  }
  return machine;
}

async function refreshCache(): Promise<void> {
  if (isRefreshing) return;
  isRefreshing = true;

  try {
    console.log("[scraper] Fetching machine list from Maskinbladet...");
    const html = await fetchPage(FEED_URL);
    const machines = parseListPage(html);

    cachedMachines = machines;
    cacheTimestamp = Date.now();
    console.log(`[scraper] Quick cache ready: ${machines.length} machines`);

    // Enrich with detail pages
    const BATCH_SIZE = 10;
    for (let i = 0; i < machines.length; i += BATCH_SIZE) {
      const batch = machines.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map((m) => enrichWithDetails(m)));
    }

    cachedMachines = machines;
    cacheTimestamp = Date.now();
    console.log(`[scraper] Full cache ready: ${machines.length} machines (with details)`);
  } catch (err) {
    console.error("[scraper] Refresh failed:", err);
  } finally {
    isRefreshing = false;
  }
}

refreshCache();

setInterval(() => {
  const age = Date.now() - cacheTimestamp;
  if (age > CACHE_TTL - 2 * 60 * 1000) refreshCache();
}, 2 * 60 * 1000);

export async function fetchAllMachines(): Promise<Machine[]> {
  if (cachedMachines) {
    if (Date.now() - cacheTimestamp > CACHE_TTL) refreshCache();
    return cachedMachines;
  }
  await refreshCache();
  return cachedMachines || [];
}

export async function fetchMachineById(id: number): Promise<Machine | undefined> {
  const machines = await fetchAllMachines();
  return machines.find((m) => m.id === id);
}

export async function fetchCategories(): Promise<{ slug: string; name: string; count: number }[]> {
  const machines = await fetchAllMachines();
  const catMap = new Map<string, { name: string; count: number }>();
  machines.forEach((m) => {
    // Use top-level category (first in array)
    const cat = m.category[0];
    if (cat) {
      const existing = catMap.get(cat.id);
      if (existing) existing.count++;
      else catMap.set(cat.id, { name: cat.name, count: 1 });
    }
  });
  return Array.from(catMap.entries())
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count);
}
