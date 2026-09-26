'use client';

import { useLang } from '@/context/LanguageContext';
import {
  UserPlus,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export default function RegisterSection() {
  const { t } = useLang();
  const googleFormDirectUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLSepz2DFB9DiUsPE60qgl3eiWEFAd9OP-n3jHXWtE4MQhinKiw/viewform';
  const googleFormEmbedUrl = `${googleFormDirectUrl}?embedded=true`;

  return (
    <section id="register" className="py-20 md:py-28 bg-[#f8fafc] relative border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <UserPlus className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('ধারা–১২ : সদস্যপদ গ্রহণ প্রক্রিয়া', 'Article 12: Application Process')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            {t('অনলাইন ', 'Online ')}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              {t('সদস্যপদ ফরম', 'Membership Form')}
            </span>
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            {t(
              'পলাশবাড়ী ইয়াং সোসাইটির পরিবারে যুক্ত হতে নিচের অফিসিয়াল গুগল ফরমটি যথাযথভাবে পূরণ করুন।',
              'To join Polashbari Young Society, please fill out the official Google Form below accurately.'
            )}
          </p>
        </div>

        {/* Embedded Google Form Card */}
        <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Top Control Bar */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-blue-50/30 to-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>{t('অফিসিয়াল সদস্যপদ আবেদন ফরম', 'Official Membership Application Form')}</span>
              </span>
            </div>

            {/* Direct Open in New Tab Button */}
            <a
              href={googleFormDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
            >
              <span>{t('নতুন ট্যাবে পূর্ণ স্ক্রিনে খুলুন', 'Open in New Tab')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Iframe wrapper */}
          <div className="relative w-full min-h-[850px] sm:min-h-[950px] bg-slate-50 flex justify-center items-center">
            <iframe
              src={googleFormEmbedUrl}
              width="100%"
              height="950"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              className="w-full min-h-[850px] sm:min-h-[950px] border-0"
              title={t('পলাশবাড়ী ইয়াং সোসাইটি সদস্যপদ নিবন্ধন ফরম', 'Polashbari Young Society Registration Form')}
            >
              {t('ফরম লোড হচ্ছে...', 'Loading form...')}
            </iframe>
          </div>

          {/* Bottom Card Footer */}
          <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('তথ্য সম্পূর্ণ সুরক্ষিত ও কার্যকরী পরিষদ কর্তৃক সংরক্ষিত।', 'Your information is secure and managed strictly by the Executive Council.')}</span>
            </div>
            <a
              href={googleFormDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
            >
              <span>{t('ফরমটি পৃথক পেজে খুলতে সমস্যা হলে এখানে চাপুন', 'Having trouble? Open directly in Google')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Benefits reminder chips */}
        <div className="mt-8 grid sm:grid-cols-3 gap-3">
          {[
            t('১০০% অরাজনৈতিক ও স্বেচ্ছাসেবী কার্যক্রম', '100% Non-political voluntary drive'),
            t('আবেদন যাচাইপূর্বক সদস্যপদ নিশ্চিতকরণ', 'Membership confirmed upon scrutiny'),
            t('সমাজ উন্নয়নে সক্রিয় নেতৃত্বের সুযোগ', 'Direct community leadership roles'),
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-2xs text-center"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
