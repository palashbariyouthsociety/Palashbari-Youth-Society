'use client';

import { useLang } from '@/context/LanguageContext';
import {
  FileText,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export default function AboutSection() {
  const { t } = useLang();

  const nature = [
    t('অরাজনৈতিক সংগঠন', 'Non-Political Organization'),
    t('অলাভজনক প্রতিষ্ঠান', 'Non-Profit Institution'),
    t('স্বেচ্ছাসেবী প্রতিষ্ঠান', 'Voluntary Organization'),
    t('সামাজিক সংগঠন', 'Social Organization'),
  ];

  const infoItems = [
    {
      icon: FileText,
      title: t('সংগঠনের নাম', 'Organization Name'),
      value: t('পলাশবাড়ী ইয়াং সোসাইটি', 'Polashbari Young Society'),
      sub: t('Polashbari Young Society (ধারা–১)', 'Article 1'),
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
    },
    {
      icon: MapPin,
      title: t('প্রধান কার্যালয়', 'Head Office'),
      value: t('পলাশবাড়ী, বীরগঞ্জ, দিনাজপুর', 'Polashbari, Birganj, Dinajpur'),
      sub: t('ধারা–৩ অনুসারে স্থায়ী কার্যালয়', 'Permanent Office under Article 3'),
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
    },
    {
      icon: Calendar,
      title: t('প্রতিষ্ঠাকাল', 'Founded'),
      value: t('২০২২ খ্রিস্টাব্দ', '2022 CE'),
      sub: t('যুব সমাজের সমন্বয়ে গঠিত', 'Formed by youth collective'),
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
    },
    {
      icon: Sparkles,
      title: t('সংগঠনের মূলমন্ত্র', 'Organization Motto'),
      value: t(
        'এসো যুবক, কাজ করি— মানবতার সমাজ গড়ি।',
        "Come Youth, Let's Work — Build a Humane Society."
      ),
      sub: t('ধারা–৪ অনুসারে পথপ্রদর্শক আদর্শ', 'Guiding Ideal under Article 4'),
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200',
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-white relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('ধারা–১ থেকে ৪ : প্রারম্ভিক বিধান', 'Articles 1–4: Preliminary Provisions')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            {t('সংগঠন ', 'About the ')}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              {t('পরিচিতি ও প্রকৃতি', 'Organization & Nature')}
            </span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t(
              'পলাশবাড়ী ইয়াং সোসাইটি দিনাজপুরের বীরগঞ্জে প্রতিষ্ঠিত একটি যুবভিত্তিক মানবকল্যাণমূলক স্বেচ্ছাসেবী সংগঠন।',
              'Polashbari Young Society is a youth-led humanitarian voluntary organization established in Birganj, Dinajpur.'
            )}
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Organization Details */}
          <div className="space-y-4 flex flex-col justify-between">
            {infoItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-blue-400 hover:bg-white transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <div className={`p-3 rounded-xl ${item.bg} border shrink-0 transition-transform group-hover:scale-105`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-0.5">
                      {item.title}
                    </p>
                    <p className="text-slate-900 font-bold text-base sm:text-lg leading-snug">
                      {item.value}
                    </p>
                    {item.sub && (
                      <p className="text-slate-500 text-xs mt-1 font-medium">{item.sub}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Organization Nature (Article 2) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border border-slate-200 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {t('সংগঠনের প্রকৃতি ও আদর্শ', 'Nature & Ideals of Organization')}
                  </h3>
                  <p className="text-slate-500 text-xs">{t('ধারা–২ : মূল চরিত্র', 'Article 2: Core Character')}</p>
                </div>
              </div>

              {/* Nature Tags */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {nature.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-semibold shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs sm:text-sm">{item}</span>
                  </div>
                ))}
              </div>

              {/* Guiding Principles Bulletins */}
              <div className="space-y-3.5 pt-4 border-t border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {t(
                      'সংগঠনের সকল কার্যক্রম মানবকল্যাণ, সামাজিক উন্নয়ন ও নিঃস্বার্থ জনসেবামূলক উদ্দেশ্যে পরিচালিত হবে।',
                      'All organizational activities will be conducted strictly for human welfare, social development, and selfless public service.'
                    )}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {t(
                      'সংগঠনের কোনো তহবিল বা সম্পত্তি ব্যক্তিগত স্বার্থে ব্যবহারের সুযোগ নেই— সকল অর্থ জনস্বার্থে ব্যয় হবে।',
                      'No funds or assets of the organization may be used for personal interest— all resources are dedicated to public welfare.'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom quote note */}
            <div className="mt-8 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-center">
              <p className="text-xs text-blue-900 font-semibold">
                {t('একতাই শক্তি — সততা, নিষ্ঠা ও সহযোগিতাই আমাদের অগ্রযাত্রার চালিকাশক্তি।', 'Unity is Strength — Honesty, dedication and collaboration are our driving force.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
