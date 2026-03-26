import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Loader2, ArrowRight, Phone, ChevronRight, ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmartImage from '@/components/SmartImage';

interface Machine {
  id: number; title: string; model: string; brand: string; year: string;
  price: string; currency: string; url: string;
  pictures: { url: string; date: string }[];
  category: { id: string; name: string }[];
  description: string;
}

function formatPrice(price: string): string {
  const num = parseInt(price, 10);
  if (isNaN(num) || num === 0) return 'Ring for pris';
  return num.toLocaleString('da-DK') + ' kr';
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

export default function Home() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { document.title = 'Ib E. Mortensen A/S — Maskinhandler siden 1967'; }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/machines');
        const data = await res.json();
        if (Array.isArray(data)) setMachines([...data].sort((a, b) => b.id - a.id));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const heroCategories = [
    { title: 'Entreprenørmaskiner', desc: 'Minigravere, hjullæssere og meget mere', image: '/images/minigraver.jpg', href: '/maskiner/entreprenoermaskiner' },
    { title: 'Brugte maskiner', desc: 'Over 50 maskiner på lager — klar til levering', image: machines[0]?.pictures?.[0]?.url || '/images/hero.jpg', href: '/maskiner' },
    { title: 'Reservedele & tilbehør', desc: 'Originale og universelle dele — levering 1-2 dage', image: '/images/hero.jpg', href: '/reservedele' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* ═══ HERO ═══ */}
      <section className="relative">
        <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <img src="/images/hero.jpg" alt="" className="absolute inset-0 w-full h-full object-cover scale-[1.01]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/15" />

          <div className="relative z-10 text-center max-w-4xl mx-auto px-6 pt-[100px] pb-32">
            <p className="text-[#FFF100] text-[14px] font-medium tracking-[0.25em] uppercase mb-6 animate-fade-in">
              Din maskinhandler i Kastbjerg
            </p>
            <h1 className="text-white text-[48px] sm:text-[64px] lg:text-[80px] font-bold leading-[1.05] mb-8 animate-fade-in-up">
              Nye & brugte
              <br />kvalitetsmaskiner
            </h1>
            <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up-delay">
              <Link href="/maskiner"
                className="group inline-flex items-center gap-2.5 bg-[#1B6B4A] text-white text-[16px] font-semibold px-10 py-4.5 rounded-lg hover:bg-[#155d3f] transition-all duration-300 shadow-[0_4px_20px_rgba(27,107,74,0.3)]">
                Se maskiner på lager <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <a href="tel:+4586470388"
                className="inline-flex items-center gap-2.5 bg-white/[0.08] backdrop-blur-md text-white text-[16px] font-semibold px-10 py-4.5 rounded-lg border border-white/[0.15] hover:bg-white/[0.15] transition-all duration-300">
                <Phone className="w-4.5 h-4.5" /> Ring til os
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-white via-white/90 to-transparent z-10" />
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="pt-6 pb-20 lg:pb-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6">
          <Reveal>
            <div className="mb-10">
              <p className="text-[#1B6B4A] text-[13px] font-semibold tracking-[0.2em] uppercase mb-2">Kategorier</p>
              <h2 className="text-[32px] lg:text-[40px] font-bold text-[#1a1a1a]">Udforsk vores sortiment</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {heroCategories.map((cat, i) => (
              <Reveal key={cat.title} delay={i * 100}>
                <Link href={cat.href} className="group relative aspect-[16/11] rounded-xl overflow-hidden block">
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[800ms] ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent group-hover:from-black/85 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white/40 text-[12px] font-medium tracking-[0.15em] uppercase mb-2">Kategori</p>
                    <p className="text-white font-bold text-[24px] leading-tight mb-1">{cat.title}</p>
                    <p className="text-white/40 text-[14px]">{cat.desc}</p>
                  </div>
                  <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight className="w-4.5 h-4.5 text-white" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SENESTE MASKINER ═══ */}
      <section className="py-20 lg:py-28 bg-[#F5F5F3]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6">
          <Reveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[#1B6B4A] text-[13px] font-semibold tracking-[0.2em] uppercase mb-2">På lager nu</p>
                <h2 className="text-[32px] lg:text-[40px] font-bold text-[#1a1a1a]">Seneste maskiner</h2>
              </div>
              <Link href="/maskiner" className="text-[15px] font-medium text-[#1B6B4A] hover:text-[#155d3f] flex items-center gap-1.5 transition-colors group">
                Se alle <ChevronRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Reveal>
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {machines.slice(0, 8).map((m, i) => (
                <Reveal key={m.id} delay={i * 50}>
                  <Link href={`/maskine/${m.id}`} className="group block">
                    <div className="bg-white rounded-xl overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500">
                      <div className="aspect-[4/3] relative overflow-hidden">
                        {m.pictures?.[0]?.url ? (
                          <SmartImage src={m.pictures[0].url} alt={m.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[800ms] ease-out" scaleOnWhitespace="scale-125 group-hover:scale-[1.3]" />
                        ) : <div className="w-full h-full bg-gray-100" />}
                      </div>
                      <div className="p-4">
                        <p className="text-[11px] text-[#1B6B4A] font-semibold tracking-[0.1em] uppercase mb-1.5">{m.brand}</p>
                        <h3 className="text-[16px] font-semibold text-[#1a1a1a] leading-snug mb-3 line-clamp-2">{m.title}</h3>
                        <div className="flex items-end justify-between pt-3 border-t border-gray-100">
                          <div>
                            <p className="text-[19px] font-bold text-[#1a1a1a] tracking-tight">{formatPrice(m.price)}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">ekskl. moms</p>
                          </div>
                          <span className="text-[13px] font-medium text-[#1B6B4A] opacity-0 group-hover:opacity-100 transition-opacity duration-300">Se mere →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6">
          <div className="flex flex-wrap justify-center gap-16 lg:gap-32">
            {[
              { value: `${machines.length || 57}+`, label: 'Maskiner på lager' },
              { value: '55+', label: 'Års erfaring' },
              { value: '100%', label: 'Finansiering muligt' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 120}>
                <div className="text-center">
                  <p className="text-[#1B6B4A] text-[56px] lg:text-[72px] font-bold leading-none">{s.value}</p>
                  <p className="text-gray-400 text-[14px] font-medium mt-3 tracking-wide">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OM OS ═══ */}
      <section className="py-20 lg:py-28 bg-[#F5F5F3]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal>
              <div className="aspect-[4/3] rounded-xl overflow-hidden">
                <img src="/images/hero.jpg" alt="IEM Kastbjerg" className="w-full h-full object-cover" />
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div>
                <p className="text-[#1B6B4A] text-[13px] font-semibold tracking-[0.2em] uppercase mb-3">Om Ib E. Mortensen A/S</p>
                <h2 className="text-[32px] lg:text-[40px] font-bold text-[#1a1a1a] mb-6 leading-tight">
                  Mere end 55 års erfaring<br />med maskiner
                </h2>
                <p className="text-[17px] text-gray-500 leading-[1.8] mb-4">
                  Vi har altid over 50 maskiner på lager klar til omgående levering. Udover brugte maskiner er vi autoriseret forhandler af Eurocomach, Neomach og Venieri.
                </p>
                <p className="text-[17px] text-gray-500 leading-[1.8] mb-10">
                  Vi tilbyder finansiering og leasing på alle vores maskiner i samarbejde med Spar Nord Leasing. Ring for fremvisning.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="tel:+4586470388"
                    className="inline-flex items-center gap-2.5 bg-[#1B6B4A] text-white text-[16px] font-semibold px-8 py-4 rounded-lg hover:bg-[#155d3f] transition-all duration-300">
                    <Phone className="w-4.5 h-4.5" /> Ring til os
                  </a>
                  <Link href="/maskiner"
                    className="inline-flex items-center gap-2.5 border border-gray-200 text-[#1a1a1a] text-[16px] font-semibold px-8 py-4 rounded-lg hover:bg-white hover:border-gray-300 transition-all duration-300">
                    Se maskiner <ArrowRight className="w-4.5 h-4.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 lg:py-28 bg-[#141414] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 text-center relative">
          <Reveal>
            <h2 className="text-[34px] lg:text-[48px] font-bold text-white mb-5 leading-tight">
              Klar til at finde din næste maskine?
            </h2>
            <p className="text-white/35 text-[16px] max-w-md mx-auto mb-10 leading-relaxed">
              Kig forbi eller ring — vi hjælper gerne med at finde den rette maskine til dig
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/maskiner"
                className="group inline-flex items-center gap-2.5 bg-[#1B6B4A] text-white text-[16px] font-semibold px-10 py-4.5 rounded-lg hover:bg-[#155d3f] transition-all duration-300 shadow-[0_4px_20px_rgba(27,107,74,0.3)]">
                Se maskiner <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <a href="tel:+4586470388"
                className="inline-flex items-center gap-2.5 border border-white/10 text-white text-[16px] font-semibold px-10 py-4.5 rounded-lg hover:bg-white/[0.06] transition-all duration-300">
                <Phone className="w-4.5 h-4.5" /> +45 86 47 03 88
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
