'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLang } from '@/context/LanguageContext';
import {
  MapPin,
  Calendar,
  Globe,
  Mail,
  ChevronRight,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';

export default function Footer() {
  const { t } = useLang();
  const officialEmail = 'palashbariyouthsociety@gmail.com';
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(officialEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-[#0a1226] via-[#070d1e] to-[#040814] border-t border-blue-900/40 pt-16 pb-8 relative overflow-hidden">
      {/* Soft Ambient Glow from Top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-28 bg-gradient-to-b from-blue-500/15 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 mb-12">
          {/* 1. Brand Info (5 cols) */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0a1226] shadow-md shadow-amber-500/20 shrink-0">
                <Image src="/logo.jpg" alt="PYS Logo" fill sizes="48px" className="object-cover" />
              </div>
              <div>
                <p className="text-white font-bold text-base leading-tight">
                  {t('পলাশবাড়ী ইয়াং সোসাইটি', 'Polashbari Young Society')}
                </p>
                <p className="text-blue-300/80 text-xs font-medium">
                  {t('বীরগঞ্জ, দিনাজপুর • স্থাপিতঃ ২০২২', 'Birganj, Dinajpur • Est. 2022')}
                </p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4 max-w-md">
              {t(
                'একটি অরাজনৈতিক, অলাভজনক, স্বেচ্ছাসেবী ও সামাজিক কল্যাণমুখী সংগঠন। তরুণদের ঐক্য ও মানবতার সেবায় নিবেদিত।',
                'A non-political, non-profit, voluntary and humanitarian organization dedicated to youth empowerment and social welfare.'
              )}
            </p>
            <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-blue-700/30 inline-block shadow-inner backdrop-blur-xs">
              <p className="text-amber-300 text-xs italic font-semibold">
                “ {t('এসো যুবক, কাজ করি— মানবতার সমাজ গড়ি।', "Come Youth, Let's Work — Build a Humane Society.")} ”
              </p>
            </div>
          </div>

          {/* 2. Quick Links (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>{t('ওয়েবসাইট নেভিগেশন', 'Quick Navigation')}</span>
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: '#about', label: t('সংগঠন পরিচিতি ও আদর্শ', 'About & Nature') },
                { href: '#mission', label: t('১৫টি লক্ষ্য ও উদ্দেশ্য', '15 Mission Objectives') },
                { href: '#activities', label: t('সাম্প্রতিক কার্যক্রম ও মাঠপর্যায়ের কাজ', 'Recent Field Activities') },
                { href: '#principles', label: t('৬টি মূলনীতি', '6 Core Principles') },
                { href: '#structure', label: t('সাংগঠনিক কাঠামো ও পদাবলি', 'Structure & Councils') },
                { href: '#membership', label: t('সদস্যপদ ও ক্যাটাগরি', 'Membership Guidelines') },
                { href: '#contact', label: t('যোগাযোগ ও ইমেইল', 'Contact & Email Us') },
                {
                  href: 'https://docs.google.com/forms/d/e/1FAIpQLSepz2DFB9DiUsPE60qgl3eiWEFAd9OP-n3jHXWtE4MQhinKiw/viewform',
                  label: t('সদস্যপদ আবেদন (গুগল ফরম)', 'Membership Form (Google)'),
                  isExternal: true,
                },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.isExternal ? '_blank' : undefined}
                    rel={link.isExternal ? 'noopener noreferrer' : undefined}
                    className="text-slate-300 hover:text-amber-300 text-sm transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-blue-400/60 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Official Location & Direct Email Contact (4 cols) */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{t('কার্যালয় ও যোগাযোগ', 'Office & Contact')}</span>
            </h4>
            <div className="space-y-3">
              {/* Email Entry */}
              <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-700/30 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('অফিসিয়াল ইমেইল', 'Official Email')}</span>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-amber-300 transition-colors bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-md"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">{t('কপি হয়েছে', 'Copied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>{t('কপি', 'Copy')}</span>
                      </>
                    )}
                  </button>
                </div>
                <a
                  href={`mailto:${officialEmail}`}
                  className="font-mono text-[11px] sm:text-xs font-medium text-amber-300 hover:text-amber-200 transition-colors break-all block tracking-tight"
                >
                  {officialEmail}
                </a>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3 text-slate-300 text-sm">
                <div className="p-2 rounded-xl bg-blue-950/60 border border-blue-800/40 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-xs sm:text-sm">
                    {t('স্থায়ী কার্যালয়', 'Permanent Office')}
                  </p>
                  <p className="text-slate-300 text-xs">
                    {t('পলাশবাড়ী, বীরগঞ্জ, দিনাজপুর, রংপুর বিভাগ', 'Polashbari, Birganj, Dinajpur, Rangpur')}
                  </p>
                </div>
              </div>

              {/* Founded */}
              <div className="flex items-start gap-3 text-slate-300 text-sm">
                <div className="p-2 rounded-xl bg-blue-950/60 border border-blue-800/40 shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-xs sm:text-sm">
                    {t('প্রতিষ্ঠাকাল', 'Founded')}
                  </p>
                  <p className="text-slate-300 text-xs">
                    {t('২০২২ খ্রিস্টাব্দ হতে জনসেবায় সক্রিয়', 'Active in public service since 2022')}
                  </p>
                </div>
              </div>

              {/* Scope */}
              <div className="flex items-start gap-3 text-slate-300 text-sm">
                <div className="p-2 rounded-xl bg-blue-950/60 border border-blue-800/40 shrink-0 mt-0.5">
                  <Globe className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-xs sm:text-sm">
                    {t('কার্যক্ষেত্র', 'Jurisdiction')}
                  </p>
                  <p className="text-slate-300 text-xs">
                    {t('বীরগঞ্জ, দিনাজপুর ও সমগ্র বাংলাদেশ', 'Birganj, Dinajpur & nationwide')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-900/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs text-center sm:text-left">
            © 2022–{new Date().getFullYear()} {t('পলাশবাড়ী ইয়াং সোসাইটি। সর্বস্বত্ব সংরক্ষিত।', 'Polashbari Young Society. All rights reserved.')}
          </p>
          <div className="flex items-center gap-2 text-xs text-blue-300/80">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('একটি অরাজনৈতিক স্বেচ্ছাসেবী সামাজিক উদ্যোগ', 'A Non-Political Voluntary Social Initiative')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
