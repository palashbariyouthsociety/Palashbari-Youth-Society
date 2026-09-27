'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Calendar,
  CreditCard,
  User,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { Transaction } from '@/types/finance';
import {
  formatCurrencyBn,
  formatCurrencyEn,
  amountToBengaliWords,
  amountToEnglishWords,
} from '@/lib/finance';
import { useLang } from '@/context/LanguageContext';

interface ReceiptModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReceiptModal({ transaction, isOpen, onClose }: ReceiptModalProps) {
  const { lang, t } = useLang();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [downloadingImg, setDownloadingImg] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !transaction) return null;

  const isBn = lang === 'bn';
  const formattedAmount = isBn
    ? formatCurrencyBn(transaction.amount)
    : formatCurrencyEn(transaction.amount);
  const wordsAmount = isBn
    ? amountToBengaliWords(transaction.amount)
    : amountToEnglishWords(transaction.amount);

  // Native Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Canvas Image Download (Zero external dependencies, works across all browsers)
  const handleDownloadImage = async () => {
    try {
      setDownloadingImg(true);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 800;
      const height = 980;
      const scale = 2; // High-DPI 2x scale for crisp retina image

      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Outer Decorative Border
      ctx.strokeStyle = '#1e3a8a'; // Navy Blue
      ctx.lineWidth = 6;
      ctx.strokeRect(18, 18, width - 36, height - 36);

      // Inner Gold Border
      ctx.strokeStyle = '#f59e0b'; // Amber Gold
      ctx.lineWidth = 1.5;
      ctx.strokeRect(26, 26, width - 52, height - 52);

      // Header Banner Background
      const headerGrad = ctx.createLinearGradient(30, 30, width - 60, 160);
      headerGrad.addColorStop(0, '#0f172a');
      headerGrad.addColorStop(1, '#1e3a8a');
      ctx.fillStyle = headerGrad;
      ctx.fillRect(28, 28, width - 56, 130);

      // Header Texts
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('পলাশবাড়ী ইয়াং সোসাইটি', width / 2, 72);

      ctx.fillStyle = '#93c5fd';
      ctx.font = '14px sans-serif';
      ctx.fillText('Polashbari Young Society | বীরগঞ্জ, দিনাজপুর | স্থাপিতঃ ২০২২', width / 2, 100);

      ctx.fillStyle = '#fde68a';
      ctx.font = 'italic 12px sans-serif';
      ctx.fillText('“এসো যুবক, কাজ করি— মানবতার সমাজ গড়ি।”', width / 2, 124);

      // Receipt Title Ribbon
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(180, 142, width - 360, 34);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(180, 142, width - 360, 34);

      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('অফিসিয়াল অর্থপ্রাপ্তি ও অনুদান রসিদ (MONEY RECEIPT)', width / 2, 165);

      // Metadata Bar (Receipt No & Date)
      ctx.textAlign = 'left';
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`রশিদ নং / Receipt No:`, 50, 215);

      ctx.fillStyle = '#1e3a8a';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(transaction.id, 205, 215);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`তারিখ / Date:`, width - 210, 215);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(transaction.parsedDate.formattedBn, width - 50, 215);

      // Divider Line
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(50, 235);
      ctx.lineTo(width - 50, 235);
      ctx.stroke();

      // Info Table / Fields
      const drawRow = (y: number, label: string, value: string, isHighlight = false) => {
        ctx.fillStyle = isHighlight ? '#f0fdf4' : y % 70 === 0 ? '#f8fafc' : '#ffffff';
        ctx.fillRect(50, y - 20, width - 100, 36);
        ctx.strokeStyle = '#e2e8f0';
        ctx.strokeRect(50, y - 20, width - 100, 36);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(label, 65, y + 3);

        ctx.fillStyle = isHighlight ? '#047857' : '#0f172a';
        ctx.font = isHighlight ? 'bold 16px sans-serif' : '14px sans-serif';
        ctx.fillText(value, 260, y + 3);
      };

      drawRow(275, 'দাতা / গ্রহীতার নাম (Name):', transaction.donorOrRecipient || 'সম্মানিত সদস্য / শুভানুধ্যায়ী');
      drawRow(315, 'লেনদেনের ধরন / Type:', 'প্রাপ্ত অনুদান / সাধারণ তহবিলে জমা (Income)');
      drawRow(355, 'খাত ও ক্যাটাগরি / Category:', transaction.category || 'সদস্য চাঁদা ও সাধারণ অনুদান');
      drawRow(395, 'বিবরণ / Description:', transaction.description || 'সংগঠনের জনকল্যাণমূলক তহবিল');
      drawRow(435, 'পেমেন্ট মাধ্যম / Method:', transaction.method || 'নগদ / ডিজিটাল লেনদেন');
      drawRow(475, 'গৃহীত পরিমাণ / Amount:', `${formattedAmount} (${wordsAmount})`, true);

      // Seal / Verification Stamp
      ctx.textAlign = 'center';
      const sealX = width / 2;
      const sealY = 575;

      ctx.beginPath();
      ctx.arc(sealX, sealY, 48, 0, Math.PI * 2);
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sealX, sealY, 42, 0, Math.PI * 2);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#059669';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('★ VERIFIED & AUDITED ★', sealX, sealY - 14);
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('পলাশবাড়ী ইয়াং সোসাইটি', sealX, sealY + 4);
      ctx.font = '10px sans-serif';
      ctx.fillText('জমা সম্পন্ন', sealX, sealY + 20);

      // Note text
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText(
        'এই রসিদটি পলাশবাড়ী ইয়াং সোসাইটির কেন্দ্রীয় অনলাইন হিসাব সিস্টেম থেকে স্বয়ংক্রিয়ভাবে প্রস্তুতকৃত।',
        width / 2,
        660
      );

      // Signatures
      const sigY = 740;

      // Left Sig: Finance Secretary
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, sigY);
      ctx.lineTo(280, sigY);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('মো: ফাহিম ইসলাম', 190, sigY + 20);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText('অর্থ সম্পাদক', 190, sigY + 38);
      ctx.font = '11px sans-serif';
      ctx.fillText('(ডিজিটাল অনুমোদন সম্পন্ন)', 190, sigY + 54);

      // Right Sig: President
      ctx.beginPath();
      ctx.moveTo(width - 280, sigY);
      ctx.lineTo(width - 100, sigY);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('হাফেজ মাওঃ মোঃ রাশেদ কবির', width - 190, sigY + 20);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText('সভাপতি', width - 190, sigY + 38);
      ctx.font = '11px sans-serif';
      ctx.fillText('(অনুমোদিত)', width - 190, sigY + 54);

      // Footer bar
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(28, height - 70, width - 56, 42);
      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.fillText(
        'ওয়েবসাইট: pys.org.bd | বীরগঞ্জ, দিনাজপুর | স্বচ্ছতা ও জবাবদিহিতায় পলাশবাড়ী ইয়াং সোসাইটি',
        width / 2,
        height - 44
      );

      // Download trigger
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `PYS-Receipt-${transaction.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate receipt image:', err);
    } finally {
      setDownloadingImg(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('স্বীকৃত ও ভেরিফায়েড মানি রিসিট', 'Official Verified Money Receipt')}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              title={t('প্রিন্ট করুন বা PDF হিসেবে সংরক্ষণ করুন', 'Print or Save as PDF')}
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('প্রিন্ট / PDF', 'Print / PDF')}</span>
            </button>
            <button
              onClick={handleDownloadImage}
              disabled={downloadingImg}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors"
              title={t('রশিদের ইমেজ ডাউনলোড করুন', 'Download Receipt Image')}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadingImg ? t('তৈরি হচ্ছে...', 'Saving...') : t('ইমেজ ডাউনলোড', 'Download Image')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Canvas Area */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-50 flex-1">
          <div
            ref={receiptRef}
            id="printable-receipt"
            className="bg-white rounded-2xl p-5 sm:p-7 md:p-8 border-2 border-blue-900 shadow-lg relative text-slate-800 selection:bg-amber-100"
          >
            {/* Watermark in background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
              <span className="text-8xl font-black text-slate-900 rotate-[-30deg]">
                PYS OFFICIAL
              </span>
            </div>

            {/* Receipt Header */}
            <div className="text-center pb-5 border-b-2 border-slate-200 relative">
              <div className="inline-flex items-center justify-center gap-2 mb-1.5">
                <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-amber-400">
                  PYS
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-blue-950 tracking-tight">
                  {t('পলাশবাড়ী ইয়াং সোসাইটি', 'Polashbari Young Society')}
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {t('বীরগঞ্জ, দিনাজপুর • স্থাপিতঃ ২০২২ • অরাজনৈতিক ও সমাজকল্যাণমূলক স্বেচ্ছাসেবী সংস্থা', 'Birganj, Dinajpur • Est. 2022 • Non-political & Voluntary Social Organization')}
              </p>
              <p className="text-[11px] text-amber-700 italic font-semibold mt-0.5">
                “{t('এসো যুবক, কাজ করি— মানবতার সমাজ গড়ি।', "Come Youth, Let's Work — Build a Humane Society.")}”
              </p>

              {/* Receipt Title Badge */}
              <div className="mt-3.5 inline-block px-4 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm font-bold tracking-wide shadow-xs">
                {t('অফিসিয়াল অর্থপ্রাপ্তি ও অনুদান রসিদ', 'OFFICIAL MONEY RECEIPT & DONATION VOUCHER')}
              </div>
            </div>

            {/* Meta Row (Voucher / ID & Date) */}
            <div className="flex flex-wrap items-center justify-between gap-3 py-4 border-b border-dashed border-slate-200 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500">{t('রশিদ নং:', 'Receipt No:')}</span>
                <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {transaction.id}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-500">{t('তারিখ:', 'Date:')}</span>
                <span className="font-bold text-slate-800">
                  {isBn ? transaction.parsedDate.formattedBn : transaction.parsedDate.formattedEn}
                </span>
              </div>
            </div>

            {/* Receipt Details Body */}
            <div className="py-5 space-y-3.5 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  {transaction.type === 'income'
                    ? t('দাতা / অর্থপ্রদানকারীর নাম:', 'Donor / Payer Name:')
                    : t('গ্রহীতার নাম / প্রাপক:', 'Recipient / Payee Name:')}
                </span>
                <span className="font-bold text-slate-900 sm:text-right text-sm">
                  {transaction.donorOrRecipient ||
                    (transaction.type === 'income'
                      ? t('সম্মানিত সদস্য / শুভানুধ্যায়ী', 'Honorable Member / Well-wisher')
                      : t('পলাশবাড়ী ইয়াং সোসাইটি কার্যনির্বাহী', 'Palashbari Youth Society Executive'))}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {t('লেনদেনের খাত / ক্যাটাগরি:', 'Category / Head:')}
                </span>
                <span className="font-semibold text-slate-800 sm:text-right">
                  {transaction.category}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  {t('বিবরণ ও উদ্দেশ্য:', 'Description / Purpose:')}
                </span>
                <span className="font-medium text-slate-700 sm:text-right">
                  {transaction.description}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  {t('পেমেন্ট মাধ্যম:', 'Payment Method:')}
                </span>
                <span className="font-semibold text-slate-800 sm:text-right">
                  {transaction.method || t('নগদ / ডিজিটাল', 'Cash / Digital')}
                </span>
              </div>

              {/* Big Highlighted Amount Box */}
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">
                      {t('গৃহীত সর্বমোট পরিমাণ (টাকায়)', 'Total Received Amount')}
                    </p>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      <span className="font-bold text-slate-700">{t('কথায়:', 'In Words:')}</span>{' '}
                      {wordsAmount}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <span className="inline-block text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                      {formattedAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Seal & Audit Stamp */}
            <div className="flex items-center justify-center my-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-xs">
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
                <span>{t('জমা ও নিরীক্ষা সম্পন্ন • ভেরিফাইড রসিদ', 'Received & Audited • Official Verified')}</span>
              </div>
            </div>

            {/* Official Signatures Row */}
            <div className="pt-8 pb-2 border-t border-slate-200 mt-6 grid grid-cols-2 gap-6 text-center text-xs">
              <div>
                <div className="w-28 sm:w-36 h-0.5 bg-slate-400 mx-auto mb-2" />
                <p className="font-bold text-slate-900">{t('মো: ফাহিম ইসলাম', 'Md. Fahim Islam')}</p>
                <p className="text-slate-500 font-medium">{t('অর্থ সম্পাদক', 'Finance Secretary')}</p>
                <p className="text-[10px] text-emerald-700 font-semibold">{t('(ডিজিটাল সত্যায়ন)', '(Digitally Verified)')}</p>
              </div>
              <div>
                <div className="w-28 sm:w-36 h-0.5 bg-slate-400 mx-auto mb-2" />
                <p className="font-bold text-slate-900">{t('হাফেজ মাওঃ মোঃ রাশেদ কবির', 'Hafez Mawlana Md. Rashed Kabir')}</p>
                <p className="text-slate-500 font-medium">{t('সভাপতি', 'President')}</p>
                <p className="text-[10px] text-blue-700 font-semibold">{t('(অনুমোদিত)', '(Approved)')}</p>
              </div>
            </div>

            {/* Bottom Footer Note */}
            <div className="mt-5 pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400">
              {t(
                'এই রসিদটি পলাশবাড়ী ইয়াং সোসাইটির কেন্দ্রীয় অনলাইন হিসাব সিস্টেম থেকে সরাসরি প্রস্তুতকৃত। যেকোনো যাচাইয়ের জন্য আমাদের অফিশিয়াল ইমেইলে যোগাযোগ করুন।',
                'This receipt was automatically generated from Palashbari Youth Society central accounting system. For verification, contact our official email.'
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{t('রশিদটি সরাসরি প্রিন্ট অথবা ইমেজ আকারে সেভ করতে পারবেন।', 'You can print or download this receipt directly.')}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              {t('বন্ধ করুন', 'Close')}
            </button>
            <button
              onClick={handleDownloadImage}
              disabled={downloadingImg}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadingImg ? t('ডাউনলোড হচ্ছে...', 'Downloading...') : t('রশিদ ডাউনলোড করুন', 'Download Receipt')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Embedded CSS for Native Print - Targets strictly the receipt container */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt,
          #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            border: 2px solid #1e3a8a !important;
            box-shadow: none !important;
            background: #ffffff !important;
          }
        }
      `}</style>
    </div>
  );
}
