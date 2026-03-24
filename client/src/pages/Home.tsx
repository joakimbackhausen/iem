import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Loader2, ArrowRight, Phone, ChevronRight, Recycle, Leaf, BadgePercent, Wrench, ShoppingCart, Truck, Quote } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MachineSlider from '@/components/MachineSlider';

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
  category: { id: string; name: string }[];
  description: string;
}

/* ── Services ──────────────────────────────────── */
const services = [
  {
    title: 'Vi sælger maskiner',
    desc: 'Stort udvalg af brugte kvalitetsmaskiner til fornuftige priser',
    icon: ShoppingCart,
    href: '/maskiner',
  },
  {
    title: 'Vi køber din maskine',
    desc: 'Vi køber brugte maskiner — kontakt os for et tilbud',
    icon: Truck,
    href: '/kontakt',
  },
  {
    title: 'Vi reparerer',
    desc: 'Service og reparation af maskiner i vores værksted',
    icon: Wrench,
    href: '/kontakt',
  },
];

/* ── Core values ──────────────────────────────── */
const values = [
  { title: 'Genbrug', desc: 'Vi giver maskiner nyt liv — godt for miljøet og din økonomi', icon: Recycle },
  { title: 'Bæredygtighed', desc: 'Genbrug af maskiner er en af de mest bæredygtige løsninger', icon: Leaf },
  { title: 'Fornuftige priser', desc: 'Kvalitet og pris hænger sammen — vi forhandler altid fair', icon: BadgePercent },
];

/* ── Testimonials ─────────────────────────────── */
const testimonials = [
  {
    name: 'Knud',
    role: 'Anlægsgartner',
    text: 'Fantastisk service og et godt udvalg af maskiner. Fandt præcis den minigraver jeg ledte efter til en fair pris.',
  },
  {
    name: 'Tom',
    role: 'Murer',
    text: 'Har handlet med Rold Maskinhandel flere gange. De finder altid det rigtige udstyr og er ærlige omkring maskinernes stand.',
  },
  {
    name: 'Andreas',
    role: 'Skovejer',
    text: 'God rådgivning og hurtig levering. Maskinerne var i bedre stand end forventet. Kan klart anbefales.',
  },
];

/* ══════════════════════════════════════════════════
   HOME
   ══════════════════════════════════════════════════ */
export default function Home() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Rold Maskinhandel — Køb, salg & udlejning af brugte maskiner i Nordjylland';
  }, []);

  useEffect(() => {
    async function fetchMachines() {
      try {
        const res = await fetch('/api/machines');
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        if (Array.isArray(data)) setMachines([...data].sort((a, b) => b.id - a.id));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchMachines();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* ─── HERO ─── */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        <img
          src="/hero-forest.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-hero-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3B404B]/90 via-[#3B404B]/70 to-[#3B404B]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3B404B]/80 via-transparent to-[#3B404B]/30" />

        <div className="relative z-10 max-w-[1360px] mx-auto px-5 sm:px-8 w-full">
          <div className="max-w-2xl">
            {/* Yellow accent line */}
            <div className="w-16 h-1 bg-[#FFD942] mb-8 animate-fade-in" />

            <p className="text-[#FFD942] text-[14px] sm:text-[15px] font-semibold tracking-[0.2em] uppercase mb-4 animate-fade-in">
              Din maskinhandler i Nordjylland
            </p>
            <h1 className="font-serif text-[48px] sm:text-[64px] lg:text-[84px] text-white leading-[0.95] mb-6 animate-fade-in-up">
              Køb, salg &amp;
              <br />
              <span className="text-[#FFD942]">udlejning</span>
            </h1>
            <p className="text-white/60 text-[17px] sm:text-[19px] leading-relaxed max-w-lg mb-10 animate-fade-in-up-delay">
              Brugte kvalitetsmaskiner til fornuftige priser. Genbrug og bæredygtighed i fokus.
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-16 animate-fade-in-up-delay">
              <Link
                href="/maskiner"
                className="inline-flex items-center gap-2 bg-[#FFD942] text-[#3B404B] text-[15px] font-bold px-8 py-4 rounded-full hover:bg-[#f5cd2e] hover:scale-105 transition-all duration-200 shadow-lg shadow-[#FFD942]/20"
              >
                Se maskiner
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+4525159495"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-[15px] font-semibold px-8 py-4 rounded-full border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-200"
              >
                <Phone className="w-4 h-4" />
                +45 25 15 94 95
              </a>
            </div>

            {/* USP cards */}
            <div className="grid grid-cols-3 gap-4 animate-fade-in-up-delay max-w-xl">
              {[
                { icon: Recycle, label: 'Genbrug', text: 'Bæredygtigt valg' },
                { icon: BadgePercent, label: 'Fair priser', text: 'Altid til forhandling' },
                { icon: Wrench, label: 'Værksted', text: 'Service & reparation' },
              ].map((usp) => (
                <div
                  key={usp.label}
                  className="group relative bg-white/[0.07] backdrop-blur-md border border-white/[0.08] rounded-2xl px-4 py-5 text-center hover:bg-white/[0.12] hover:border-[#FFD942]/30 transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#FFD942]/15 mb-3 group-hover:bg-[#FFD942]/25 transition-colors">
                    <usp.icon className="w-5 h-5 text-[#FFD942]" />
                  </div>
                  <p className="text-white font-semibold text-[14px] leading-tight">{usp.label}</p>
                  <p className="text-white/40 text-[12px] mt-0.5">{usp.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Diagonal cut bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0 80H1440V20L0 80Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-[#FFD942] text-[13px] font-semibold tracking-[0.15em] uppercase mb-2">
              Hvad vi tilbyder
            </p>
            <h2 className="font-serif text-[32px] lg:text-[40px] text-[#3B404B] leading-tight">
              Køb, salg &amp; udlejning
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((svc) => (
              <Link
                key={svc.title}
                href={svc.href}
                className="group relative bg-[#f8f8f8] rounded-2xl p-8 hover:bg-[#3B404B] transition-colors duration-300"
              >
                <svc.icon className="w-10 h-10 text-[#FFD942] mb-5" />
                <h3 className="text-[20px] font-semibold text-[#3B404B] group-hover:text-white mb-2 transition-colors">
                  {svc.title}
                </h3>
                <p className="text-[#666] group-hover:text-white/60 text-[15px] leading-relaxed transition-colors">
                  {svc.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MACHINES ─── */}
      <section className="py-16 lg:py-24 bg-[#f5f5f5]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#FFD942] text-[13px] font-semibold tracking-[0.15em] uppercase mb-2">
                På lager nu
              </p>
              <h2 className="font-serif text-[32px] lg:text-[40px] text-[#3B404B] leading-tight">
                Seneste maskiner
              </h2>
            </div>
            <Link
              href="/maskiner"
              className="hidden sm:inline-flex items-center gap-1.5 text-[#3B404B] text-[14px] font-semibold hover:underline"
            >
              Se alle <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#FFD942]" />
            </div>
          ) : (
            <MachineSlider machines={machines} />
          )}

          <div className="sm:hidden mt-8 text-center">
            <Link
              href="/maskiner"
              className="inline-flex items-center gap-1 text-[#3B404B] font-semibold text-[15px]"
            >
              Se alle maskiner <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── ABOUT PREVIEW ─── Image left, text right */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src="/hero-forest.jpg"
                  alt="Rold Maskinhandel i arbejde"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Accent block */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#FFD942] rounded-2xl -z-10 hidden lg:block" />
            </div>
            <div>
              <div className="w-12 h-1 bg-[#FFD942] mb-6" />
              <p className="text-[#FFD942] text-[13px] font-semibold tracking-[0.15em] uppercase mb-3">
                Om Rold Maskinhandel
              </p>
              <h2 className="font-serif text-[32px] lg:text-[40px] text-[#3B404B] leading-tight mb-6">
                Din maskinhandler i Nordjylland
              </h2>
              <p className="text-[#666] text-[16px] leading-relaxed mb-4">
                Rold Maskinhandel handler med brugte maskiner fra vores base i Rold ved Arden.
                Vi køber, sælger, udlejer og reparerer maskiner af alle typer — fra
                entreprenørmaskiner til landbrugsmaskiner og meget mere.
              </p>
              <p className="text-[#666] text-[16px] leading-relaxed mb-8">
                Kvalitet og pris hænger sammen hos os. Vi sælger kun maskiner vi kan stå inde
                for, og vi forhandler altid en fair pris. Genbrug og bæredygtighed er kernen
                i det vi laver.
              </p>

              {/* Team */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <img src="/mads.jpg" alt="Mads" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-[14px] text-[#3B404B]">Mads Kroon</p>
                    <p className="text-[12px] text-[#999]">Direktør</p>
                  </div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="flex items-center gap-3">
                  <img src="/thomas.jpg" alt="Thomas" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-[14px] text-[#3B404B]">Thomas Uldall</p>
                    <p className="text-[12px] text-[#999]">Direktør</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CORE VALUES ─── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-[#FFD942] text-[13px] font-semibold tracking-[0.15em] uppercase mb-2">
              Vores kerneværdier
            </p>
            <h2 className="font-serif text-[32px] lg:text-[40px] text-[#3B404B] leading-tight">
              Det vi tror på
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {values.map((val) => (
              <div key={val.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFD942]/10 mb-5">
                  <val.icon className="w-7 h-7 text-[#FFD942]" />
                </div>
                <h3 className="text-[20px] font-semibold text-[#3B404B] mb-2">{val.title}</h3>
                <p className="text-[#666] text-[15px] leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-16 lg:py-24 bg-[#f5f5f5]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-[#FFD942] text-[13px] font-semibold tracking-[0.15em] uppercase mb-2">
              Kundeudtalelser
            </p>
            <h2 className="font-serif text-[32px] lg:text-[40px] text-[#3B404B] leading-tight">
              Det siger kunderne
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-8">
                <Quote className="w-8 h-8 text-[#FFD942]/30 mb-4" />
                <p className="text-[#555] text-[15px] leading-relaxed mb-6">
                  {t.text}
                </p>
                <div>
                  <p className="font-semibold text-[#3B404B]">{t.name}</p>
                  <p className="text-[13px] text-[#999]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="bg-[#3B404B] py-16 lg:py-20">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 text-center">
          <h2 className="font-serif text-[32px] lg:text-[44px] text-white leading-tight mb-4">
            Klar til at finde din næste maskine?
          </h2>
          <p className="text-white/60 text-[16px] max-w-lg mx-auto mb-8">
            Kig forbi eller ring — vi hjælper gerne med at finde den rette maskine til dig
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/maskiner"
              className="inline-flex items-center gap-2 bg-[#FFD942] text-[#3B404B] text-[15px] font-semibold px-8 py-3.5 rounded-full hover:bg-[#f5cd2e] transition-colors"
            >
              Se maskiner <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+4525159495"
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white text-[15px] font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <Phone className="w-4 h-4" />
              +45 25 15 94 95
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
