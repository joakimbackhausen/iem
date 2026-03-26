import { Link } from 'wouter';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-gray-400">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <img src="/images/iem-logo.png" alt="IEM" className="h-10 w-auto brightness-0 invert mb-4 opacity-60" />
            <p className="text-[15px] leading-relaxed text-gray-500">
              Din professionelle partner inden for køb og salg af nye og brugte entreprenørmaskiner i Kastbjerg.
            </p>
          </div>

          <div>
            <h4 className="text-[14px] font-semibold text-gray-300 uppercase tracking-wider mb-4">Sider</h4>
            <div className="space-y-3">
              {[
                { label: 'Maskiner til salg', href: '/maskiner' },
                { label: 'Reservedele', href: '/reservedele' },
                { label: 'Nye maskiner', href: '/' },
                { label: 'Service', href: '/' },
                { label: 'Finansiering', href: '/' },
                { label: 'Om os', href: '/' },
                { label: 'Kontakt', href: '/' },
              ].map((l) => (
                <Link key={l.label} href={l.href} className="block text-[15px] text-gray-500 hover:text-white transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[14px] font-semibold text-gray-300 uppercase tracking-wider mb-4">Kontakt</h4>
            <div className="space-y-3 text-[15px]">
              <a href="tel:+4586470388" className="flex items-center gap-2 text-[#1B6B4A] font-medium hover:text-[#34D399] transition-colors">
                <Phone className="w-4 h-4" /> +45 86 47 03 88
              </a>
              <a href="mailto:mail@iem.dk" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4" /> mail@iem.dk
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Vesterbro 73<br />DK-8970 Havndal</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[14px] font-semibold text-gray-300 uppercase tracking-wider mb-4">Find din maskine</h4>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-5">
              Vi har altid over 50 maskiner på lager. Ring for fremvisning.
            </p>
            <Link
              href="/maskiner"
              className="inline-flex items-center gap-2 bg-[#1B6B4A] text-white text-[14px] font-semibold px-6 py-3 rounded-lg hover:bg-[#165a3e] transition-all"
            >
              Se maskiner <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 py-4">
          <p className="text-[13px] text-gray-600">&copy; {new Date().getFullYear()} Ib E. Mortensen A/S — Alle rettigheder forbeholdes</p>
        </div>
      </div>
    </footer>
  );
}
