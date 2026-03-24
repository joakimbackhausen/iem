import { Link } from 'wouter';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

const links = [
  { label: 'Maskiner til salg', href: '/maskiner' },
  { label: 'Om os', href: '/om-os' },
  { label: 'Kontakt', href: '/kontakt' },
];

export default function Footer() {
  return (
    <footer>
      {/* Main footer */}
      <div className="bg-[#3B404B]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
            {/* Col 1: Brand */}
            <div>
              <Link href="/" className="inline-block mb-5">
                <img
                  src="/rold-logo-white.png"
                  alt="Rold Maskinhandel"
                  className="h-10 w-auto"
                />
              </Link>
              <p className="text-white/40 text-[15px] leading-relaxed">
                Din maskinhandler i Nordjylland. Køb, salg, udlejning og
                reparation af brugte maskiner til fornuftige priser.
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h3 className="text-[15px] font-semibold text-white uppercase tracking-wider mb-5">
                Sider
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/40 hover:text-white text-[15px] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Contact */}
            <div>
              <h3 className="text-[15px] font-semibold text-white uppercase tracking-wider mb-5">
                Kontakt
              </h3>
              <div className="space-y-4 text-[15px]">
                <a href="tel:+4525159495" className="flex items-center gap-3 text-[#FFD942] font-semibold hover:text-[#f5cd2e] transition-colors">
                  <Phone className="w-4 h-4" />
                  +45 25 15 94 95
                </a>
                <a href="mailto:info@roldmaskinhandel.dk" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  info@roldmaskinhandel.dk
                </a>
                <div className="flex items-start gap-3 text-white/40">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Haverslevvej 12, Rold<br />9510 Arden</span>
                </div>
              </div>
            </div>

            {/* Col 4: CTA */}
            <div>
              <h3 className="text-[15px] font-semibold text-white uppercase tracking-wider mb-5">
                Find din maskine
              </h3>
              <p className="text-white/40 text-[15px] leading-relaxed mb-5">
                Se vores udvalg af brugte maskiner. Ring for fremvisning.
              </p>
              <Link
                href="/maskiner"
                className="inline-flex items-center gap-2 bg-[#FFD942] text-[#3B404B] text-[14px] font-semibold px-6 py-3 rounded-full hover:bg-[#f5cd2e] transition-colors"
              >
                Se maskiner <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#2d3139]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[13px] text-white/25">
            <p>&copy; {new Date().getFullYear()} Rold Maskinhandel — CVR 38742108</p>
            <p>Haverslevvej 12, Rold, 9510 Arden</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
