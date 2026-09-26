'use client';

import { useLang } from '@/context/LanguageContext';
import {
  Compass,
  ShieldCheck,
  Heart,
  Users2,
  Scale,
  HandHeart,
  Eye,
} from 'lucide-react';

export default function PrinciplesSection() {
  const { t } = useLang();

  const principles = [
    {
      icon: ShieldCheck,
      bn: 'সততা',
      en: 'Honesty & Integrity',
      descBn: 'সকল কার্যক্রম ও দায়িত্ব পালনে পরম নিষ্ঠা, সততা ও আর্থিক স্বচ্ছতা বজায় রাখা।',
      descEn: 'Maintaining utmost integrity, sincerity, and financial transparency in all duties.',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border-blue-200',
      cardBorder: 'hover:border-blue-400',
    },
    {
      icon: Heart,
      bn: 'মানবতা',
      en: 'Humanity & Empathy',
      descBn: 'জাতি, ধর্ম, বর্ণ নির্বিশেষে প্রতিটি মানুষের প্রতি অকৃত্রিম ভালোবাসা ও সহমর্মিতা প্রদর্শন।',
      descEn: 'Extending unconditional empathy and love to every human being regardless of caste or creed.',
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50 border-rose-200',
      cardBorder: 'hover:border-rose-400',
    },
    {
      icon: Users2,
      bn: 'ঐক্য',
      en: 'Unity & Solidarity',
      descBn: 'সংগঠনের সকল সদস্যের মধ্যে পারস্পরিক ভ্রাতৃত্ববোধ, ঐক্য ও দলগত চেতনা সমুন্নত রাখা।',
      descEn: 'Preserving solidarity, brotherhood, and team spirit among all members.',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 border-amber-200',
      cardBorder: 'hover:border-amber-400',
    },
    {
      icon: Scale,
      bn: 'শৃঙ্খলা',
      en: 'Discipline & Order',
      descBn: 'সংগঠনের গঠনতন্ত্র ও স্বীকৃত নিয়ম-কানুন অক্ষরে অক্ষরে মেনে সুশৃঙ্খলভাবে কাজ পরিচালনা।',
      descEn: 'Strictly abiding by the constitution and conducting affairs in an orderly manner.',
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50 border-indigo-200',
      cardBorder: 'hover:border-indigo-400',
    },
    {
      icon: HandHeart,
      bn: 'স্বেচ্ছাসেবা',
      en: 'Selfless Volunteerism',
      descBn: 'কোনো ব্যক্তিগত আর্থিক বা বৈষয়িক লাভের আশা না করে স্বতঃস্ফূর্তভাবে সমাজসেবায় আত্মনিয়োগ।',
      descEn: 'Voluntarily dedicating oneself to social work without any expectation of personal gain.',
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-200',
      cardBorder: 'hover:border-emerald-400',
    },
    {
      icon: Eye,
      bn: 'জবাবদিহিতা',
      en: 'Accountability & Audit',
      descBn: 'কার্যক্রম ও আর্থিক ব্যবস্থাপনার জন্য সংগঠনের সাধারণ পরিষদ ও সমাজের কাছে পূর্ণ জবাবদিহি থাকা।',
      descEn: 'Ensuring full accountability to the general assembly and community for all decisions.',
      iconColor: 'text-cyan-600',
      iconBg: 'bg-cyan-50 border-cyan-200',
      cardBorder: 'hover:border-cyan-400',
    },
  ];

  return (
    <section id="principles" className="py-20 md:py-28 bg-white relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('ধারা–৭ : সংগঠনের মূলনীতি', 'Article 7: Core Principles')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            {t('সংগঠনের ', 'Six Core ')}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              {t('মূলনীতি ও আদর্শ', 'Principles')}
            </span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t(
              'এই ছয়টি মূলস্তম্ভের ওপর প্রতিষ্ঠিত আমাদের সংগঠনের প্রতিটি কর্মকাণ্ড ও সিদ্ধান্ত।',
              'Every activity and decision of our organization is built upon these six pillars.'
            )}
          </p>
        </div>

        {/* 6 Principles Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className={`group p-6 sm:p-7 rounded-3xl bg-slate-50/80 border border-slate-200 ${p.cardBorder} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:bg-white flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-3 rounded-2xl ${p.iconBg} border transition-transform group-hover:scale-110`}>
                      <Icon className={`w-6 h-6 ${p.iconColor}`} />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2.5 group-hover:text-blue-600 transition-colors">
                    {t(p.bn, p.en)}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {t(p.descBn, p.descEn)}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center text-xs font-semibold text-slate-500">
                  <span>{t(`মূলনীতি #${idx + 1}`, `Principle #${idx + 1}`)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
