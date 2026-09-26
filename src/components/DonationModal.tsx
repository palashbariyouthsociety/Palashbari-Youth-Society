'use client';

import { useState } from 'react';
import { useLang } from '@/context/LanguageContext';
import {
  X,
  Copy,
  Check,
  PhoneCall,
  Heart,
  ShieldCheck,
  Info,
  Sparkles,
} from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityTitle?: string;
}

export default function DonationModal({ isOpen, onClose, activityTitle }: DonationModalProps) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  const DONATION_NUMBER = '01740-280693';
  const RAW_NUMBER = '01740280693';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(RAW_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-scale-up">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-5 sm:p-6 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-semibold backdrop-blur-sm mb-2">
            <Heart className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>{t('মানবকল্যাণে অনুদান তহবিল', 'Welfare Donation Fund')}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            {t('পলাশবাড়ী ইয়াং সোসাইটি', 'Polashbari Young Society')}
          </h3>

          {activityTitle && (
            <div className="mt-2.5 text-xs text-blue-100 bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="line-clamp-1 font-medium">{activityTitle}</span>
            </div>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* 1. Official bKash & Nagad Logos Grid */}
          <div>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 text-center">
              {t('অনুমোদিত পেমেন্ট চ্যানেলসমূহ', 'Authorized Payment Channels')}
            </p>
            <div className="grid grid-cols-2 gap-3.5">
              {/* bKash Official Card */}
              <div className="bg-slate-50 hover:bg-white rounded-2xl p-3.5 sm:p-4 border-2 border-[#e2136e]/20 hover:border-[#e2136e]/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between text-center group">
                <div className="h-10 sm:h-12 w-full flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/bkash.svg"
                    alt="bKash Logo"
                    className="h-8 sm:h-9 max-w-[120px] object-contain"
                  />
                </div>
                <div className="w-full pt-1 border-t border-slate-200/80">
                  <span className="inline-block text-[11px] font-bold text-[#e2136e] bg-[#e2136e]/10 px-2.5 py-0.5 rounded-full">
                    {t('ব্যক্তিগত • সেন্ড মানি', 'Personal • Send Money')}
                  </span>
                </div>
              </div>

              {/* Nagad Official Card */}
              <div className="bg-slate-50 hover:bg-white rounded-2xl p-3.5 sm:p-4 border-2 border-[#f7941d]/20 hover:border-[#f7941d]/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between text-center group">
                <div className="h-10 sm:h-12 w-full flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/nagad.svg"
                    alt="Nagad Logo"
                    className="h-7 sm:h-8 max-w-[110px] object-contain"
                  />
                </div>
                <div className="w-full pt-1 border-t border-slate-200/80">
                  <span className="inline-block text-[11px] font-bold text-[#f7941d] bg-[#f7941d]/10 px-2.5 py-0.5 rounded-full">
                    {t('ব্যক্তিগত • সেন্ড মানি', 'Personal • Send Money')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Official Phone Number Card with 1-Click Copy */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t('নির্ধারিত অনুদান নম্বর', 'Official Donation Number')}</span>
              </span>
              <span className="text-amber-300 font-bold bg-white/10 px-2 py-0.5 rounded-full text-[10px]">
                {t('বিকাশ ও নগদ পার্সোনাল', 'bKash & Nagad Personal')}
              </span>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-xl p-2.5 sm:p-3.5 flex items-center justify-between gap-2 sm:gap-3 backdrop-blur-xs">
              <span className="text-base sm:text-xl font-extrabold text-amber-300 font-mono select-all whitespace-nowrap tracking-wide">
                {DONATION_NUMBER}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleCopy}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                    copied
                      ? 'bg-emerald-500 text-white scale-105'
                      : 'bg-white text-slate-900 hover:bg-slate-100 active:scale-95'
                  }`}
                  title="Copy Number"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('কপি হয়েছে!', 'Copied!')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-blue-600" />
                      <span>{t('কপি করুন', 'Copy')}</span>
                    </>
                  )}
                </button>

                <a
                  href={`tel:${RAW_NUMBER}`}
                  className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
                  title="Call"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* 3. Step-by-Step Payment Instructions */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/90 text-xs text-slate-700 space-y-2">
            <p className="font-bold text-blue-900 text-xs sm:text-sm flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{t('অনুদান পাঠানোর নিয়মাবলি:', 'How to send your donation:')}</span>
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed">
              <li>{t('আপনার বিকাশ অথবা নগদ অ্যাপে প্রবেশ করুন।', 'Open your bKash or Nagad mobile app.')}</li>
              <li>{t('“Send Money” (সেন্ড মানি) অপশন নির্বাচন করুন।', 'Select the "Send Money" option.')}</li>
              <li>
                {t('নম্বর ঘরে লিখুন: ', 'Enter recipient number: ')}
                <strong className="text-slate-900 font-mono font-bold">{DONATION_NUMBER}</strong>
              </li>
              <li>{t('আপনার ইচ্ছানুযায়ী যেকোনো পরিমাণ অনুদান প্রদান করুন।', 'Enter your desired donation amount.')}</li>
              <li>{t('রেফারেন্সে আপনার নাম বা কর্মসূচির নাম লিখতে পারেন।', 'In reference, you may mention the event or your name.')}</li>
            </ol>
          </div>

          <div className="text-center pt-1">
            <p className="text-[11px] text-slate-500 italic">
              {t(
                '“আপনার ক্ষুদ্র অনুদান মানবকল্যাণ ও যুব সমাজের অগ্রযাত্রায় বিরাট ভূমিকা রাখবে।”',
                '“Your small contribution plays a vital role in youth welfare and social development.”'
              )}
            </p>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm"
          >
            {t('ঠিক আছে, ধন্যবাদ', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
}
