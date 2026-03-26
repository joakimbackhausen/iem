import { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useLocation } from 'wouter';
import { Loader2, X, ChevronDown, Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmartImage from '@/components/SmartImage';
import { machineSlug } from '@/lib/machineSlug';

interface Category { id: string; tid: string; name: string; }
interface Machine {
  id: number;
  title: string;
  model: string;
  brand: string;
  year: string;
  price: string;
  currency: string;
  url: string;
  pictures: { url: string; date: string }[];
  category: Category[];
  description: string;
}

function formatPrice(price: string): string {
  const num = parseInt(price, 10);
  if (isNaN(num) || num === 0) return 'Ring for pris';
  return num.toLocaleString('da-DK') + ' kr';
}

export default function Machines() {
  const params = useParams<{ kategori?: string }>();
  const [, navigate] = useLocation();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCatDrop, setShowCatDrop] = useState(false);
  const [showBrandDrop, setShowBrandDrop] = useState(false);

  const selectedCategory = params.kategori || null;

  useEffect(() => {
    document.title = selectedCategory
      ? `${selectedCategory} — Ib E. Mortensen A/S`
      : 'Maskiner til salg — Ib E. Mortensen A/S';
  }, [selectedCategory]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/machines');
        const data = await res.json();
        if (Array.isArray(data)) setMachines(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>();
    machines.forEach(m => {
      const cat = m.category?.[0];
      if (cat) {
        const e = map.get(cat.id);
        if (e) e.count++; else map.set(cat.id, { name: cat.name, count: 1 });
      }
    });
    return Array.from(map.entries()).map(([slug, d]) => ({ slug, ...d })).sort((a, b) => b.count - a.count);
  }, [machines]);

  const brands = useMemo(() => {
    const map = new Map<string, number>();
    machines.forEach(m => { if (m.brand) map.set(m.brand, (map.get(m.brand) || 0) + 1); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).map(([b, c]) => ({ brand: b, count: c }));
  }, [machines]);

  const filtered = useMemo(() => machines.filter(m => {
    if (selectedCategory && !m.category?.some(c => c.id === selectedCategory)) return false;
    if (selectedBrand && m.brand !== selectedBrand) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!m.title.toLowerCase().includes(q) && !m.brand.toLowerCase().includes(q) && !m.model.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [machines, selectedCategory, selectedBrand, searchQuery]);

  const selectedCatName = categories.find(c => c.slug === selectedCategory)?.name;
  const topCategories = useMemo(() => {
    return categories.map(c => {
      const machine = machines.find(m => m.category?.some(cat => cat.id === c.slug) && m.pictures?.[0]?.url);
      return { id: c.slug, name: c.name, count: c.count, image: machine?.pictures?.[0]?.url || null };
    });
  }, [categories, machines]);

  const hasFilters = selectedCategory || selectedBrand || searchQuery;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 pt-[81px] lg:pt-[125px]">
        {/* Top bar - flush with header bottom */}
        <div className="bg-white border-b border-gray-100 sticky top-[80px] lg:top-[124px] z-[45]">
          <div className="max-w-[1260px] mx-auto px-5 sm:px-6 py-3.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[20px] font-bold text-gray-900 mr-2">
                {selectedCatName || 'Alle maskiner'}
              </h1>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Søg maskiner..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2.5 text-[14px] border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-gray-300 focus:outline-none w-52 transition-colors"
                />
              </div>

              {/* Category dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setShowCatDrop(!showCatDrop); setShowBrandDrop(false); }}
                  className="flex items-center gap-2 text-[14px] font-medium text-[#1A1A1A] border border-gray-200 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  Kategori
                  {selectedCatName && <span className="bg-[#1B6B4A] text-white text-[12px] px-2 py-0.5 rounded">{selectedCatName}</span>}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showCatDrop && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-50 max-h-80 overflow-y-auto">
                    <div className="p-1.5">
                      <button onClick={() => { navigate('/maskiner'); setShowCatDrop(false); }} className={`w-full text-left px-3 py-2.5 rounded-md text-[14px] ${!selectedCategory ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}>
                        Alle kategorier
                      </button>
                      {categories.map(c => (
                        <button key={c.slug} onClick={() => { navigate(`/maskiner/${c.slug}`); setShowCatDrop(false); }}
                          className={`w-full text-left px-3 py-2.5 rounded-md text-[14px] flex justify-between ${selectedCategory === c.slug ? 'bg-[#1B6B4A] text-white' : 'hover:bg-gray-50'}`}>
                          <span>{c.name}</span>
                          <span className={`text-[12px] ${selectedCategory === c.slug ? 'text-white/60' : 'text-gray-400'}`}>{c.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Brand dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setShowBrandDrop(!showBrandDrop); setShowCatDrop(false); }}
                  className="flex items-center gap-2 text-[14px] font-medium text-[#1A1A1A] border border-gray-200 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  Mærke
                  {selectedBrand && <span className="bg-[#1B6B4A] text-white text-[12px] px-2 py-0.5 rounded">{selectedBrand}</span>}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showBrandDrop && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50 max-h-80 overflow-y-auto">
                    <div className="p-1.5">
                      <button onClick={() => { setSelectedBrand(null); setShowBrandDrop(false); }} className={`w-full text-left px-3 py-2.5 rounded-md text-[14px] ${!selectedBrand ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}>
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
                <button onClick={() => { navigate('/maskiner'); setSelectedBrand(null); setSearchQuery(''); }}
                  className="text-[14px] text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
                  <X className="w-4 h-4" /> Ryd
                </button>
              )}

              <span className="ml-auto text-[14px] text-gray-400">{filtered.length} maskiner</span>
            </div>
          </div>
        </div>


        {/* Grid */}
        <div className="max-w-[1260px] mx-auto px-5 sm:px-6 py-8">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map(machine => (
                  <Link key={machine.id} href={`/maskine/${machineSlug(machine.id, machine.title)}`} className="group block">
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-[#FFF100]/30 hover:shadow-lg transition-all duration-300">
                      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                        {machine.pictures?.[0]?.url ? (
                          <SmartImage src={machine.pictures[0].url} alt={machine.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" scaleOnWhitespace="scale-125 group-hover:scale-130" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[14px]">Ingen billede</div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-[12px] text-[#C4A800] font-semibold uppercase tracking-wider mb-1">{machine.brand}</p>
                        <h3 className="text-[15px] font-semibold text-gray-900 leading-snug mb-3 line-clamp-2">{machine.title}</h3>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-[18px] font-bold text-gray-900">{formatPrice(machine.price)}</p>
                            <p className="text-[12px] text-gray-400">ekskl. moms</p>
                          </div>
                          <span className="text-[13px] font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                            Se mere →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                  <p className="text-[16px]">Ingen maskiner matcher din søgning.</p>
                  <button onClick={() => { navigate('/maskiner'); setSelectedBrand(null); setSearchQuery(''); }}
                    className="mt-2 text-gray-600 hover:underline text-[15px]">Ryd filtre</button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
