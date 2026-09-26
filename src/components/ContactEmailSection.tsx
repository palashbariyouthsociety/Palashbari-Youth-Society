'use client';

import { useState } from 'react';
import { useLang } from '@/context/LanguageContext';
import {
  Mail,
  Copy,
  Check,
  Send,
  ExternalLink,
  Clock,
  ShieldCheck,
  MapPin,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

export default function ContactEmailSection() {
  const { t } = useLang();
  const officialEmail = 'palashbariyouthsociety@gmail.com';

  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(officialEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const mailSubject = subject.trim()
      ? `[PYS যোগাযোগ] ${subject.trim()}`
      : `পলাশবাড়ী ইয়াং সোসাইটি - সাধারণ অনুসন্ধান`;

    const bodyContent = `নাম: ${name || 'অনুসন্ধানকারী'}
ইমেইল: ${senderEmail || 'দেওয়া হয়নি'}

বার্তা / বিবরণ:
${message}

---
প্রেরিত: পলাশবাড়ী ইয়াং সোসাইটি ওয়েবসাইট হতে`;

    const mailtoUrl = `mailto:${officialEmail}?subject=${encodeURIComponent(
      mailSubject
    )}&body=${encodeURIComponent(bodyContent)}`;

    window.open(mailtoUrl, '_blank');
  };

  const openGmailDirect = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${officialEmail}&su=${encodeURIComponent(
      'পলাশবাড়ী ইয়াং সোসাইটি যোগাযোগ ও অনুসন্ধান'
    )}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <section
      id="contact"
      className="py-20 sm:py-24 bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-100/80 relative overflow-hidden border-t border-slate-200/80"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-200/30 via-indigo-100/20 to-amber-100/20 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold mb-3.5 shadow-2xs">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('অফিসিয়াল যোগাযোগ • Email Us', 'Official Contact • Email Us')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('আমাদের সাথে সরাসরি ইমেইলে যোগাযোগ করুন', 'Get in Touch with Us via Email')}
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            {t(
              'পলাশবাড়ী ইয়াং সোসাইটির যেকোনো কার্যক্রম, পরামর্শ, সামাজিক উদ্যোগ, অনুদান বা সদস্যপদ সংক্রান্ত তথ্যের জন্য নির্দ্বিধায় আমাদের অফিসিয়াল ইমেইলে বার্তা পাঠান।',
              'Feel free to send us an email for any queries, suggestions, humanitarian collaborations, or membership information.'
            )}
          </p>
        </div>

        {/* 2-Column Balanced Level Grid (Equal Height on Both Sides) */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Official Email & Assurance Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col h-full justify-between bg-gradient-to-br from-[#0c1836] via-[#091228] to-[#050b1a] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-950/20 border border-blue-800/40 relative overflow-hidden group">
            {/* Card Ambient Glows */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              {/* Top: Email Address Box & Quick Actions */}
              <div>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-inner">
                    <Mail className="w-6 h-6 text-amber-300" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{t('সরাসরি সক্রিয়', 'Active Inbox')}</span>
                  </span>
                </div>

                <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
                  {t('অফিসিয়াল ইমেইল ঠিকানা', 'Official Email Address')}
                </p>
                <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-3.5 mb-5 select-all">
                  <p className="text-sm sm:text-base font-mono font-bold text-amber-300 break-all leading-relaxed">
                    {officialEmail}
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid sm:grid-cols-2 gap-2.5 mb-6">
                  <button
                    onClick={handleCopyEmail}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">{t('কপি হয়েছে!', 'Copied!')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-700" />
                        <span>{t('কপি করুন', 'Copy Email')}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={openGmailDirect}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
                  >
                    <span>{t('Gmail এ খুলুন', 'Open in Gmail')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bottom: 3 Official Assurance Items Integrated on Same Card */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">
                      {t('দ্রুত জবাবের নিশ্চয়তা', 'Prompt Response')}
                    </h4>
                    <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                      {t(
                        'কার্যকরী কমিটি সাধারণত ২৪ থেকে ৪৮ ঘণ্টার মধ্যে প্রতিটি ইমেইলের আনুষ্ঠানিক উত্তর প্রদান করে।',
                        'We usually respond to all genuine inquiries within 24-48 hours.'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-400/10 text-blue-400 border border-blue-400/20 shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">
                      {t('অফিসিয়াল ও নিরাপদ যোগাযোগ', 'Official & Secure Channel')}
                    </h4>
                    <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                      {t(
                        'অনুদান, আর্থিক প্রতিবেদন বা অফিশিয়াল যেকোনো তথ্যের জন্য এই ইমেইলটিই সংগঠনের একমাত্র ভেরিফাইড মাধ্যম।',
                        'This is our verified official channel for reports, funds, and correspondence.'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">
                      {t('স্থায়ী অবস্থান', 'Physical Presence')}
                    </h4>
                    <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                      {t('পলাশবাড়ী, বীরগঞ্জ, দিনাজপুর, রংপুর বিভাগ, বাংলাদেশ।', 'Polashbari, Birganj, Dinajpur, Rangpur, Bangladesh.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quick Message / Composer Form (7 cols) */}
          <div className="lg:col-span-7 flex flex-col h-full justify-between bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {t('দ্রুত বার্তা বা অনুসন্ধানের ফরম', 'Send Quick Message')}
                  </h3>
                  <p className="text-slate-500 text-xs">
                    {t('নিচের তথ্যগুলো পূরণ করে সরাসরি ইমেইল ক্লায়েন্টে পাঠিয়ে দিন', 'Fill in your inquiry to compose directly to our inbox')}
                  </p>
                </div>
              </div>

              <form id="emailForm" onSubmit={handleSendEmail} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('আপনার নাম', 'Your Name')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('যেমন: মো. কামরুল হাসান', 'e.g. John Doe')}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-100 text-slate-800 text-xs sm:text-sm transition-all outline-hidden"
                    />
                  </div>

                  {/* Sender Email Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('আপনার ইমেইল ঠিকানা', 'Your Email Address')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-100 text-slate-800 text-xs sm:text-sm transition-all outline-hidden"
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t('বার্তা বা যোগাযোগের বিষয়', 'Subject / Topic')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t('যেমন: রক্তদান কর্মসূচি / অনুদান / পরামর্শ', 'e.g. Activity query, donation, sponsorship')}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-100 text-slate-800 text-xs sm:text-sm transition-all outline-hidden"
                  />
                </div>

                {/* Message Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t('বিস্তারিত বার্তা', 'Your Message / Inquiry')} <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t(
                      'আপনার প্রশ্ন, মতামত বা সহযোগিতার বিষয়টি বিস্তারিত লিখুন...',
                      'Write your message, proposal, or feedback here in detail...'
                    )}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-100 text-slate-800 text-xs sm:text-sm transition-all outline-hidden resize-none"
                  />
                </div>
              </form>
            </div>

            {/* Bottom Form Actions Bar */}
            <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400 text-center sm:text-left">
                {t(
                  'বাটনে চাপলে আপনার ডিভাইসের ডিফল্ট ইমেইল অ্যাপ (বা Gmail) স্বয়ংক্রিয়ভাবে খুলে যাবে।',
                  'Clicking will compose the email directly in your default mail app or Gmail.'
                )}
              </p>

              <button
                type="submit"
                form="emailForm"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:brightness-105 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-102 active:scale-95 shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>{t('ইমেইল পাঠান', 'Send Email')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
