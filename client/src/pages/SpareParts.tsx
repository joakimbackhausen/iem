import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useParams, useLocation } from 'wouter';
import { Search, X, ChevronDown, Phone, Mail, Truck, Headphones, ShieldCheck, ArrowRight, Package } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { spareParts, sparePartCategories, type SparePart } from '@/data/sparePartsData';

function formatPrice(price: number): string {
  return price.toLocaleString('da-DK') + ' kr';
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.08 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function SpareParts() {
  const params = useParams<{ kategori?: string }>();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [showBrandDrop, setShowBrandDrop] = useState(false);

  const selectedCategory = params.kategori || null;

  useEffect(() => {
    const cat = sparePartCategories.find(c => c.slug === selectedCategory);
    document.title = cat
      ? `${cat.name} — Reservedele — Ib E. Mortensen A/S`
      : 'Reservedele & tilbehør — Ib E. Mortensen A/S';
  }, [selectedCategory]);

  // Scroll to products when category changes (but not on first load without category)
  const productsRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  useEffect(() => {
    if (hasInteracted && productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedCategory, hasInteracted]);

  const categoriesWithCounts = useMemo(() =>
    sparePartCategories.map(c => ({
      ...c,
      count: spareParts.filter(p => p.categorySlug === c.slug).length,
    })),
    []
  );

  const brands = useMemo(() => {
    const map = new Map<string, number>();
    spareParts.forEach(p => map.set(p.brand, (map.get(p.brand) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).map(([b, c]) => ({ brand: b, count: c }));
  }, []);

  const filtered = useMemo(() => spareParts.filter(p => {
    if (selectedCategory && p.categorySlug !== selectedCategory) return false;
    if (selectedBrand && p.brand !== selectedBrand) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [selectedCategory, selectedBrand, searchQuery]);

  const selectedCatObj = categoriesWithCounts.find(c => c.slug === selectedCategory);
  const hasFilters = selectedCategory || selectedBrand || searchQuery;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* ═══ HERO ═══ */}
      <section className="relative bg-[#141414] pt-32 lg:pt-44 pb-20 lg:pb-28 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Yellow accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#FFF100]" />

        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 relative">
          <div className="max-w-3xl">
            <p className="text-[#FFF100] text-[14px] font-semibold tracking-[0.25em] uppercase mb-5">Reservedele & tilbehør</p>
            <h1 className="text-white text-[40px] sm:text-[52px] lg:text-[64px] font-bold leading-[1.08] mb-6">
              Alt til din<br />maskine
            </h1>
            <p className="text-white/40 text-[18px] leading-relaxed max-w-xl mb-10">
              Originale og universelle reservedele til entreprenørmaskiner. Hurtig levering — typisk 1-2 hverdage.
            </p>

            {/* Search bar */}
            <div className="relative max-w-lg">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                placeholder="Søg efter reservedele, varenummer..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setHasInteracted(true); }}
                className="w-full pl-14 pr-5 py-4.5 text-[16px] bg-white/[0.06] border border-white/[0.08] rounded-xl text-white placeholder-white/25 focus:bg-white/[0.1] focus:border-[#FFF100]/30 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Soft transition to white */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </section>

      {/* ═══ USP STRIP ═══ */}
      <section className="relative -mt-6 z-10">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Truck, title: 'Hurtig levering', desc: 'Typisk 1-2 hverdage' },
              { icon: Headphones, title: 'Teknisk rådgivning', desc: 'Ring og få hjælp til at finde den rette del' },
              { icon: ShieldCheck, title: 'Originale & universelle', desc: 'Kvalitetsdele til alle mærker' },
            ].map((u, i) => (
              <Reveal key={u.title} delay={i * 80}>
                <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-start gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow duration-300">
                  <div className="w-11 h-11 rounded-lg bg-[#FFF100]/10 flex items-center justify-center flex-shrink-0">
                    <u.icon className="w-5 h-5 text-[#C4A800]" />
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-[#1a1a1a] mb-0.5">{u.title}</p>
                    <p className="text-[14px] text-gray-400">{u.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES GRID ═══ */}
      <section className="pt-16 pb-12">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6">
          <Reveal>
            <div className="mb-10">
              <p className="text-[#1B6B4A] text-[13px] font-semibold tracking-[0.2em] uppercase mb-2">Kategorier</p>
              <h2 className="text-[32px] lg:text-[40px] font-bold text-[#1a1a1a]">Find den rette del</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoriesWithCounts.map((cat, i) => (
              <Reveal key={cat.slug} delay={i * 50}>
                <Link
                  href={selectedCategory === cat.slug ? '/reservedele' : `/reservedele/${cat.slug}`}
                  className="group block"
                  onClick={() => setHasInteracted(true)}
                >
                  <div className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedCategory === cat.slug
                      ? 'border-[#FFF100] shadow-lg shadow-[#FFF100]/10'
                      : 'border-transparent hover:border-[#FFF100]/30'
                  }`}>
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[800ms] ease-out" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/85 transition-all duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <p className="text-white font-bold text-[16px] sm:text-[18px] leading-tight mb-1">{cat.name}</p>
                      <p className="text-white/40 text-[13px]">{cat.count} produkter</p>
                    </div>
                    {selectedCategory === cat.slug && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#FFF100] flex items-center justify-center">
                        <span className="text-[#1a1a1a] text-[12px] font-bold">✓</span>
                      </div>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRODUCTS ═══ */}
      <section ref={productsRef} className="py-12 lg:py-16 bg-[#F5F5F3] scroll-mt-[124px]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <h2 className="text-[22px] font-bold text-[#1a1a1a] mr-3">
              {selectedCatObj?.name || 'Alle reservedele'}
            </h2>

            {/* Brand dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowBrandDrop(!showBrandDrop)}
                className="flex items-center gap-2 text-[14px] font-medium text-[#1A1A1A] border border-gray-200 rounded-lg px-4 py-2.5 bg-white hover:bg-gray-50 transition-colors"
              >
                Mærke
                {selectedBrand && <span className="bg-[#1B6B4A] text-white text-[12px] px-2 py-0.5 rounded">{selectedBrand}</span>}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showBrandDrop && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50 max-h-80 overflow-y-auto">
                  <div className="p-1.5">
                    <button onClick={() => { setSelectedBrand(null); setShowBrandDrop(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-md text-[14px] ${!selectedBrand ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}>
                      Alle mærker
                    </button>
                    {brands.map(b => (
                      <button key={b.brand} onClick={() => { setSelectedBrand(b.brand); setShowBrandDrop(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-md text-[14px] flex justify-between ${selectedBrand === b.brand ? 'bg-[#1B6B4A] text-white' : 'hover:bg-gray-50'}`}>
                        <span>{b.brand}</span>
                        <span className={`text-[12px] ${selectedBrand === b.brand ? 'text-white/60' : 'text-gray-400'}`}>{b.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {hasFilters && (
              <button onClick={() => { navigate('/reservedele'); setSelectedBrand(null); setSearchQuery(''); }}
                className="text-[14px] text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
                <X className="w-4 h-4" /> Ryd filtre
              </button>
            )}

            <span className="ml-auto text-[14px] text-gray-400">{filtered.length} produkter</span>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((part, i) => (
              <Reveal key={part.id} delay={Math.min(i, 8) * 40}>
                <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-[#FFF100]/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500">
                  <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                    <img src={part.image} alt={part.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[800ms] ease-out" loading="lazy" />
                    {!part.inStock && (
                      <div className="absolute top-3 left-3 bg-[#1a1a1a]/80 text-white text-[12px] font-medium px-3 py-1 rounded-lg backdrop-blur-sm">
                        Bestillingsvare
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 text-[#1a1a1a] text-[11px] font-mono px-2 py-1 rounded backdrop-blur-sm">
                      {part.sku}
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] text-[#C4A800] font-semibold tracking-[0.1em] uppercase mb-1.5">{part.brand}</p>
                    <h3 className="text-[16px] font-bold text-[#1a1a1a] leading-snug mb-1 line-clamp-2">{part.title}</h3>
                    <p className="text-[13px] text-gray-400 mb-4 line-clamp-1">{part.description}</p>

                    <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-[20px] font-bold text-[#1a1a1a] tracking-tight">{formatPrice(part.price)}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Inkl. moms: {formatPrice(part.priceInclMoms)}</p>
                      </div>
                      <a href="tel:+4586470388"
                        className="text-[13px] font-semibold text-[#1B6B4A] hover:text-[#155d3f] flex items-center gap-1 transition-colors">
                        <Phone className="w-3.5 h-3.5" /> Bestil
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-[16px] mb-2">Ingen produkter matcher din søgning.</p>
              <button onClick={() => { navigate('/reservedele'); setSelectedBrand(null); setSearchQuery(''); }}
                className="text-[#1B6B4A] hover:underline text-[15px] font-medium">Ryd alle filtre</button>
            </div>
          )}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 lg:py-28 bg-[#141414] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#FFF100]" />

        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 text-center relative">
          <Reveal>
            <p className="text-[#FFF100] text-[14px] font-semibold tracking-[0.25em] uppercase mb-5">Kan du ikke finde det du søger?</p>
            <h2 className="text-[34px] lg:text-[48px] font-bold text-white mb-5 leading-tight">
              Ring til os — vi finder delen
            </h2>
            <p className="text-white/35 text-[16px] max-w-md mx-auto mb-10 leading-relaxed">
              Vi har adgang til reservedelstegninger og kan skaffe de fleste dele inden for 1-2 hverdage
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="tel:+4586470388"
                className="group inline-flex items-center gap-2.5 bg-[#1B6B4A] text-white text-[16px] font-semibold px-10 py-4.5 rounded-lg hover:bg-[#155d3f] transition-all duration-300 shadow-[0_4px_20px_rgba(27,107,74,0.3)]">
                <Phone className="w-4.5 h-4.5" /> +45 86 47 03 88
              </a>
              <a href="mailto:mail@iem.dk"
                className="inline-flex items-center gap-2.5 border border-white/10 text-white text-[16px] font-semibold px-10 py-4.5 rounded-lg hover:bg-white/[0.06] transition-all duration-300">
                <Mail className="w-4.5 h-4.5" /> Send email
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
