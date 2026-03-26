import { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useLocation } from 'wouter';
import { Search, X, Phone, Package, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { spareParts, sparePartCategories } from '@/data/sparePartsData';

function formatPrice(price: number): string {
  return price.toLocaleString('da-DK') + ' kr';
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

function CollapsibleSection({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-2 group"
      >
        <h3 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider group-hover:text-gray-600 transition-colors">{title}</h3>
        {open ? <ChevronUp className="w-4 h-4 text-gray-300" /> : <ChevronDown className="w-4 h-4 text-gray-300" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
}

export default function SpareParts() {
  const params = useParams<{ kategori?: string }>();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showSortDrop, setShowSortDrop] = useState(false);

  const selectedCategory = params.kategori || null;

  useEffect(() => {
    const cat = sparePartCategories.find(c => c.slug === selectedCategory);
    document.title = cat
      ? `${cat.name} — Reservedele — Ib E. Mortensen A/S`
      : 'Reservedele & tilbehør — Ib E. Mortensen A/S';
  }, [selectedCategory]);

  const categoriesWithCounts = useMemo(() =>
    sparePartCategories.map(c => ({
      ...c,
      count: spareParts.filter(p => p.categorySlug === c.slug).length,
    })),
    []
  );

  const brands = useMemo(() => {
    let pool = spareParts;
    if (selectedCategory) pool = pool.filter(p => p.categorySlug === selectedCategory);
    const map = new Map<string, number>();
    pool.forEach(p => map.set(p.brand, (map.get(p.brand) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).map(([b, c]) => ({ brand: b, count: c }));
  }, [selectedCategory]);

  const filtered = useMemo(() => {
    let results = spareParts.filter(p => {
      if (selectedCategory && p.categorySlug !== selectedCategory) return false;
      if (selectedBrand && p.brand !== selectedBrand) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    // Sort
    switch (sortBy) {
      case 'price-asc': results = [...results].sort((a, b) => a.price - b.price); break;
      case 'price-desc': results = [...results].sort((a, b) => b.price - a.price); break;
      case 'name-asc': results = [...results].sort((a, b) => a.title.localeCompare(b.title, 'da')); break;
      case 'name-desc': results = [...results].sort((a, b) => b.title.localeCompare(a.title, 'da')); break;
    }
    return results;
  }, [selectedCategory, selectedBrand, searchQuery, sortBy]);

  const selectedCatObj = categoriesWithCounts.find(c => c.slug === selectedCategory);
  const hasFilters = selectedCategory || selectedBrand || searchQuery;

  const clearAll = () => { navigate('/reservedele'); setSelectedBrand(null); setSearchQuery(''); setSortBy('default'); };

  const sortLabels: Record<SortOption, string> = {
    'default': 'Standard',
    'price-asc': 'Pris: lav → høj',
    'price-desc': 'Pris: høj → lav',
    'name-asc': 'Navn: A → Å',
    'name-desc': 'Navn: Å → A',
  };

  // Sidebar content (reused for mobile + desktop)
  const sidebarContent = (
    <>
      {/* Search */}
      <div className="mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Søg reservedele..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-[14px] border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-gray-300 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Categories */}
      <CollapsibleSection title="Kategorier" defaultOpen={true}>
        <div className="space-y-0.5">
          <button
            onClick={() => { navigate('/reservedele'); setMobileSidebar(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
              !selectedCategory ? 'bg-[#FFF100]/10 text-[#1a1a1a] font-semibold' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="flex justify-between items-center">
              Alle reservedele
              <span className="text-[12px] text-gray-400">{spareParts.length}</span>
            </span>
          </button>
          {categoriesWithCounts.map(cat => (
            <button
              key={cat.slug}
              onClick={() => { navigate(selectedCategory === cat.slug ? '/reservedele' : `/reservedele/${cat.slug}`); setMobileSidebar(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                selectedCategory === cat.slug ? 'bg-[#FFF100]/10 text-[#1a1a1a] font-semibold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex justify-between items-center">
                {cat.name}
                <span className="text-[12px] text-gray-400">{cat.count}</span>
              </span>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Brands */}
      <CollapsibleSection title="Mærke" defaultOpen={false}>
        <div className="space-y-0.5">
          <button
            onClick={() => { setSelectedBrand(null); setMobileSidebar(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
              !selectedBrand ? 'bg-[#FFF100]/10 text-[#1a1a1a] font-semibold' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Alle mærker
          </button>
          {brands.map(b => (
            <button
              key={b.brand}
              onClick={() => { setSelectedBrand(selectedBrand === b.brand ? null : b.brand); setMobileSidebar(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                selectedBrand === b.brand ? 'bg-[#FFF100]/10 text-[#1a1a1a] font-semibold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex justify-between items-center">
                {b.brand}
                <span className="text-[12px] text-gray-400">{b.count}</span>
              </span>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Sort */}
      <CollapsibleSection title="Sortering" defaultOpen={false}>
        <div className="space-y-0.5">
          {(Object.keys(sortLabels) as SortOption[]).map(key => (
            <button
              key={key}
              onClick={() => { setSortBy(key); setMobileSidebar(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                sortBy === key ? 'bg-[#FFF100]/10 text-[#1a1a1a] font-semibold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {sortLabels[key]}
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {hasFilters && (
        <button onClick={() => { clearAll(); setMobileSidebar(false); }}
          className="w-full text-[14px] text-gray-500 hover:text-gray-900 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <X className="w-4 h-4" /> Ryd alle filtre
        </button>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 pt-16 lg:pt-[124px]">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 sticky top-16 lg:top-[124px] z-40">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 py-3.5">
            <div className="flex items-center gap-3">
              <h1 className="text-[20px] font-bold text-gray-900">
                {selectedCatObj?.name || 'Reservedele & tilbehør'}
              </h1>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileSidebar(!mobileSidebar)}
                className="lg:hidden flex items-center gap-2 text-[14px] font-medium text-[#1A1A1A] border border-gray-200 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors"
              >
                Filtrer <ChevronDown className="w-4 h-4" />
              </button>

              {/* Sort dropdown (top bar, for quick access) */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setShowSortDrop(!showSortDrop)}
                  className="flex items-center gap-2 text-[14px] font-medium text-[#1A1A1A] border border-gray-200 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  {sortLabels[sortBy]}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showSortDrop && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                    <div className="p-1.5">
                      {(Object.keys(sortLabels) as SortOption[]).map(key => (
                        <button key={key} onClick={() => { setSortBy(key); setShowSortDrop(false); }}
                          className={`w-full text-left px-3 py-2.5 rounded-md text-[14px] ${sortBy === key ? 'bg-[#FFF100]/10 font-semibold text-[#1a1a1a]' : 'hover:bg-gray-50 text-gray-600'}`}>
                          {sortLabels[key]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {hasFilters && (
                <button onClick={clearAll}
                  className="text-[14px] text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
                  <X className="w-4 h-4" /> Ryd
                </button>
              )}

              <span className="ml-auto text-[14px] text-gray-400">{filtered.length} produkter</span>
            </div>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {mobileSidebar && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/30" onClick={() => setMobileSidebar(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-white shadow-xl overflow-y-auto p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[18px] font-bold text-[#1a1a1a]">Filtre</h2>
                <button onClick={() => setMobileSidebar(false)} className="p-1 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {sidebarContent}
            </div>
          </div>
        )}

        {/* Layout: sidebar + grid */}
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 py-6">
          <div className="flex gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-[260px] flex-shrink-0">
              <div className="sticky top-[180px] bg-white rounded-xl border border-gray-100 p-5">
                {sidebarContent}
              </div>
            </aside>

            {/* Product grid */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(part => (
                  <div key={part.id} className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
                    {/* Placeholder image */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-white flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-200 group-hover:text-gray-300 transition-colors" />
                      {!part.inStock && (
                        <div className="absolute top-3 left-3 bg-[#1a1a1a]/80 text-white text-[12px] font-medium px-3 py-1 rounded-lg backdrop-blur-sm">
                          Bestillingsvare
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 text-[#1a1a1a] text-[11px] font-mono px-2 py-1 rounded backdrop-blur-sm">
                        {part.sku}
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="text-[11px] text-[#C4A800] font-semibold tracking-[0.1em] uppercase mb-1.5">{part.brand}</p>
                      <h3 className="text-[15px] font-semibold text-[#1a1a1a] leading-snug mb-1 line-clamp-2">{part.title}</h3>
                      <p className="text-[13px] text-gray-400 mb-3 line-clamp-1">{part.description}</p>

                      <div className="flex items-end justify-between pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-[18px] font-bold text-[#1a1a1a] tracking-tight">{formatPrice(part.price)}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">Inkl. moms: {formatPrice(part.priceInclMoms)}</p>
                        </div>
                        <a href="tel:+4586470388"
                          className="text-[13px] font-semibold text-[#1B6B4A] hover:text-[#155d3f] flex items-center gap-1 transition-colors">
                          <Phone className="w-3.5 h-3.5" /> Bestil
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-[16px] mb-2">Ingen produkter matcher din søgning.</p>
                  <button onClick={clearAll}
                    className="text-[#1B6B4A] hover:underline text-[15px] font-medium">Ryd alle filtre</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
