'use client';

import Image from 'next/image';
import { useLang } from '@/context/LanguageContext';
import { Sparkles, ArrowRight, BookOpen, UserPlus, Calendar, Activity, Users } from 'lucide-react';

export default function HeroSection() {
  const { t } = useLang();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20 bg-gradient-to-b from-blue-50/50 via-slate-50 to-[#f8fafc]"
    >
      {/* Subtle modern dot-grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.7) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Soft Ambient Glows behind the emblem */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-gradient-to-tr from-amber-200/40 via-blue-200/40 to-emerald-200/30 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute w-[750px] h-[750px] bg-blue-100/30 rounded-full blur-[140px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-200/80 text-blue-800 text-xs sm:text-sm font-semibold mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{t('স্থাপিতঃ ২০২২ খ্রিঃ • পলাশবাড়ী, বীরগঞ্জ, দিনাজপুর', 'Est. 2022 • Polashbari, Birganj, Dinajpur')}</span>
        </div>

        {/* Center Logo Emblem */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            {/* Outer soft ambient shadow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/25 via-emerald-400/20 to-blue-500/25 rounded-full blur-lg opacity-80 transition-all duration-500" />

            {/* Inner Ring Frame */}
            <div className="relative p-1 rounded-full bg-gradient-to-b from-amber-400 via-emerald-500 to-blue-600 shadow-xl shadow-slate-300/60">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full overflow-hidden bg-white ring-4 ring-white">
                <Image
                  src="/logo.jpg"
                  alt="Polashbari Young Society Logo"
                  fill
                  priority
                  sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 176px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Headline with High-end Typography */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-[1.15]">
          <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 bg-clip-text text-transparent">
            {t('পলাশবাড়ী', 'Polashbari')}
          </span>{' '}
          <span className="text-slate-900">
            {t('ইয়াং সোসাইটি', 'Young Society')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-base sm:text-lg md:text-xl font-medium max-w-2xl mx-auto mb-4">
          {t('একটি অরাজনৈতিক, অলাভজনক ও স্বেচ্ছাসেবী সামাজিক সংগঠন', 'A Non-Political, Non-Profit & Voluntary Social Organization')}
        </p>

        {/* Slogan Banner with Clean White Card */}
        <div className="inline-flex items-center justify-center my-4 px-6 sm:px-8 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-amber-700 text-sm sm:text-base font-bold tracking-wide flex items-center gap-2">
            <span className="text-amber-500 text-lg">“</span>
            <span>{t('এসো যুবক, কাজ করি— মানবতার সমাজ গড়ি।', "Come Youth, Let's Work — Build a Humane Society.")}</span>
            <span className="text-amber-500 text-lg">”</span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 max-w-2xl mx-auto">
          <a
            href="#register"
            className="group w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base rounded-full shadow-lg shadow-blue-500/25 border border-blue-400/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2.5 whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="whitespace-nowrap">{t('সদস্য হিসেবে নিবন্ধন করুন', 'Register as Member')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
          </a>
          <a
            href="#about"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] shadow-sm flex items-center justify-center gap-2.5 whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="whitespace-nowrap">{t('গঠনতন্ত্র ও পরিচিতি', 'Constitution & About')}</span>
          </a>
        </div>

        {/* Highlights Bar */}
        <div className="mt-16 pt-8 border-t border-slate-200 grid grid-cols-3 gap-3 sm:gap-6 max-w-xl mx-auto">
          {[
            {
              icon: Calendar,
              num: '২০২২',
              numEn: '2022',
              label: t('স্থাপিত বছর', 'Founded Year'),
              color: 'text-amber-600',
              bg: 'bg-amber-50 text-amber-600',
            },
            {
              icon: Activity,
              num: '১৫+',
              numEn: '15+',
              label: t('সমাজকল্যাণমূলক লক্ষ্য', 'Social Welfare Goals'),
              color: 'text-blue-600',
              bg: 'bg-blue-50 text-blue-600',
            },
            {
              icon: Users,
              num: '১৫',
              numEn: '15',
              label: t('কার্যকরী পদ', 'Executive Roles'),
              color: 'text-emerald-600',
              bg: 'bg-emerald-50 text-emerald-600',
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-slate-300 transition-colors"
              >
                <div className="flex justify-center mb-1.5">
                  <span className={`p-1.5 rounded-lg ${stat.bg}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                </div>
                <p className={`text-xl sm:text-2xl font-extrabold tracking-tight ${stat.color}`}>
                  {t(stat.num, stat.numEn)}
                </p>
                <p className="text-slate-600 text-xs sm:text-sm mt-0.5 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
