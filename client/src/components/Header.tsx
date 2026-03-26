import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Phone, Mail, MapPin, Clock } from 'lucide-react';

const navLinks = [
  { label: 'Maskiner', href: '/maskiner' },
  { label: 'Reservedele', href: '/reservedele' },
  { label: 'Nye maskiner', href: '/' },
  { label: 'Service', href: '/' },
  { label: 'Finansiering', href: '/' },
  { label: 'Om os', href: '/' },
  { label: 'Kontakt', href: '/' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  return (
    <>
      {/* ── Top bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 hidden lg:block h-11">
        <div className="px-6 xl:px-10 h-full">
          <div className="flex items-center justify-between h-full text-[14px]">
            <div className="flex items-center gap-7">
              <a href="tel:+4586470388" className="flex items-center gap-2 text-[#1A1A1A] hover:text-[#1B6B4A] transition-colors">
                <Phone className="w-4 h-4" /> +45 86 47 03 88
              </a>
              <a href="mailto:mail@iem.dk" className="flex items-center gap-2 text-[#1A1A1A] hover:text-[#1B6B4A] transition-colors">
                <Mail className="w-4 h-4" /> mail@iem.dk
              </a>
              <span className="flex items-center gap-2 text-[#1A1A1A]/50">
                <MapPin className="w-4 h-4" /> Vesterbro 73, 8970 Havndal
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#1A1A1A]/50">
              <Clock className="w-4 h-4" /> Man-Fre 07:30-16:30
            </div>
          </div>
        </div>
      </div>

      {/* ── Main header ── */}
      <header className="fixed top-0 lg:top-[44px] left-0 right-0 z-50 bg-white border-b border-gray-100 h-[80px]">
        <div className="px-4 sm:px-6 xl:px-10 h-full">
          <div className="flex items-center justify-between h-full">
            <Link href="/" className="flex items-center">
              <img src="/images/iem-logo.png" alt="IEM" className="h-16 w-auto" />
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-5 py-2.5 text-[16px] font-medium rounded-lg transition-colors ${
                    location === link.href && link.href !== '/'
                      ? 'text-[#1A1A1A] bg-gray-100'
                      : 'text-[#1A1A1A] hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center">
              <Link href="/"
                className="text-[16px] font-semibold px-7 py-3.5 rounded-lg bg-[#1B6B4A] text-white hover:bg-[#155d3f] transition-all">
                Kontakt os
              </Link>
            </div>

            <button
              className="lg:hidden p-2 text-gray-700"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <nav className="px-5 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href}
                  className="block px-4 py-3 text-[17px] text-[#1A1A1A] hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 mt-3 border-t border-gray-100 space-y-1">
                <a href="tel:+4586470388" className="block px-4 py-3 text-[16px] text-gray-500">
                  <Phone className="w-4 h-4 inline mr-2" />+45 86 47 03 88
                </a>
                <a href="mailto:mail@iem.dk" className="block px-4 py-3 text-[16px] text-gray-500">
                  <Mail className="w-4 h-4 inline mr-2" />mail@iem.dk
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
