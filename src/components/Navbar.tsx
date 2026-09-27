'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLang } from '@/context/LanguageContext';
import { Globe, UserPlus, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { lang, toggleLang, t } = useLang();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSolidNav = scrolled || (pathname && pathname !== '/');

  const navLinks = [
    { href: '/#about', label: t('পরিচিতি', 'About') },
    { href: '/#mission', label: t('লক্ষ্য ও উদ্দেশ্য', 'Mission') },
    { href: '/activities', label: t('কার্যক্রম', 'Activities') },
    { href: '/#structure', label: t('কাঠামো', 'Structure') },
    { href: '/#committee', label: t('কার্যকরী পরিষদ', 'Committee') },
    { href: '/finance', label: t('আয়-ব্যয়', 'Finance') },
    { href: '/#membership', label: t('সদস্যপদ', 'Membership') },
    { href: '/#contact', label: t('যোগাযোগ', 'Contact') },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolidNav
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo & Brand */}
          <a href="/#hero" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-amber-400 ring-offset-2 ring-offset-white group-hover:ring-amber-500 transition-all shadow-md shadow-amber-500/10 shrink-0">
              <Image src="/logo.jpg" alt="PYS Logo" fill sizes="48px" className="object-cover" />
            </div>
            <div>
              <p className="text-slate-900 font-bold text-sm md:text-base leading-tight tracking-wide group-hover:text-blue-600 transition-colors whitespace-nowrap">
                {t('পলাশবাড়ী ইয়াং সোসাইটি', 'Polashbari Young Society')}
              </p>
              <p className="text-slate-500 text-xs font-medium tracking-normal whitespace-nowrap">{t('বীরগঞ্জ, দিনাজপুর', 'Birganj, Dinajpur')}</p>
            </div>
          </a>

          {/* Desktop Nav Links (xl screens to prevent wrapping with 8 items) */}
          <div className="hidden xl:flex items-center gap-0.5 2xl:gap-1 bg-white/90 p-1.5 rounded-full border border-slate-200/90 shadow-sm backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 2xl:px-3.5 py-1.5 text-xs 2xl:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 hover:border-amber-400 bg-white hover:bg-slate-50 text-slate-700 hover:text-amber-600 text-xs font-semibold tracking-wider transition-all duration-200 shadow-sm"
              aria-label="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'bn' ? 'ENGLISH' : 'বাংলা'}</span>
            </button>

            {/* Registration CTA Button - Opens Google Form in new tab */}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSepz2DFB9DiUsPE60qgl3eiWEFAd9OP-n3jHXWtE4MQhinKiw/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-full shadow-md shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              <span>{t('নিবন্ধন করুন', 'Register Now')}</span>
            </a>

            {/* Mobile / Tablet menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Menu */}
        {menuOpen && (
          <div className="xl:hidden pb-5 animate-fade-in">
            <div className="bg-white rounded-2xl p-4 space-y-1 border border-slate-200 shadow-xl max-h-[80vh] overflow-y-auto">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <div className="pt-3 border-t border-slate-100">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSepz2DFB9DiUsPE60qgl3eiWEFAd9OP-n3jHXWtE4MQhinKiw/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/20"
                >
                  <UserPlus className="w-4 h-4 text-amber-300" />
                  <span>{t('নিবন্ধন করুন', 'Register Now')}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
