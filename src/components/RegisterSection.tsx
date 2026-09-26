'use client';

import { useState } from 'react';
import { useLang } from '@/context/LanguageContext';
import {
  UserPlus,
  Send,
  CheckCircle2,
  User,
  Phone,
  MapPin,
  Tag,
  HelpCircle,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

export default function RegisterSection() {
  const { t } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    memberType: '',
    reason: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="register" className="py-20 md:py-28 bg-[#f8fafc] relative border-t border-slate-200">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              {t('নিবন্ধন আবেদন গৃহীত হয়েছে!', 'Application Received!')}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              {t(
                'ধন্যবাদ! আপনার সদস্যপদ আবেদনটি সফলভাবে সিস্টেমে জমা হয়েছে। কার্যকরী পরিষদ তথ্য যাচাইপূর্বক দ্রুত আপনার সাথে যোগাযোগ করবে।',
                'Thank you! Your membership application has been submitted successfully. The Executive Council will contact you soon.'
              )}
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 mb-6 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{t('আবেদনকারী: ', 'Applicant: ')}<strong className="text-slate-900">{form.name}</strong> • {form.phone}</span>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({ name: '', phone: '', address: '', memberType: '', reason: '' });
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 hover:border-blue-500 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm"
            >
              <RefreshCw className="w-4 h-4 text-blue-600" />
              <span>{t('আরেকটি নতুন আবেদন করুন', 'Submit Another Application')}</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-20 md:py-28 bg-[#f8fafc] relative border-t border-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
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
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            {t(
              'পলাশবাড়ী ইয়াং সোসাইটির সমাজসেবামূলক পরিবারে যুক্ত হতে নিচের তথ্যগুলো দিয়ে ফরমটি পূরণ করুন।',
              'Join the humanitarian youth movement of Polashbari Young Society by filling out the form below.'
            )}
          </p>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl"
        >
          {/* Row 1: Name and Phone */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-1.5 text-slate-800 text-xs sm:text-sm font-semibold mb-2" htmlFor="reg-name">
                <User className="w-4 h-4 text-blue-600" />
                <span>{t('পূর্ণ নাম', 'Full Name')}</span>
                <span className="text-amber-500">*</span>
              </label>
              <input
                id="reg-name"
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder={t('আপনার পূর্ণ নাম লিখুন', 'Enter your full name')}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all text-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-slate-800 text-xs sm:text-sm font-semibold mb-2" htmlFor="reg-phone">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>{t('মোবাইল নম্বর', 'Mobile Number')}</span>
                <span className="text-amber-500">*</span>
              </label>
              <input
                id="reg-phone"
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder={t('০১XXXXXXXXX', '01XXXXXXXXX')}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all text-sm"
              />
            </div>
          </div>

          {/* Row 2: Address */}
          <div>
            <label className="flex items-center gap-1.5 text-slate-800 text-xs sm:text-sm font-semibold mb-2" htmlFor="reg-address">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>{t('বর্তমান ঠিকানা', 'Current Address')}</span>
              <span className="text-amber-500">*</span>
            </label>
            <input
              id="reg-address"
              type="text"
              name="address"
              required
              value={form.address}
              onChange={handleChange}
              placeholder={t('গ্রাম/মহল্লা, ইউনিয়ন, থানা, জেলা', 'Village, Union, Upazila, District')}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all text-sm"
            />
          </div>

          {/* Row 3: Member Category */}
          <div>
            <label className="flex items-center gap-1.5 text-slate-800 text-xs sm:text-sm font-semibold mb-2" htmlFor="reg-type">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>{t('আবেদিত সদস্য শ্রেণি', 'Desired Membership Category')}</span>
              <span className="text-amber-500">*</span>
            </label>
            <select
              id="reg-type"
              name="memberType"
              required
              value={form.memberType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all text-sm cursor-pointer"
            >
              <option value="" className="text-slate-400">
                {t('-- সদস্য শ্রেণি নির্বাচন করুন --', '-- Select Category --')}
              </option>
              <option value="general">{t('সাধারণ সদস্য (General Member)', 'General Member')}</option>
              <option value="active">{t('সক্রিয় সদস্য (Active Member)', 'Active Member')}</option>
              <option value="associate">{t('সহযোগী সদস্য (Associate Member)', 'Associate Member')}</option>
            </select>
          </div>

          {/* Row 4: Motivation / Reason */}
          <div>
            <label className="flex items-center gap-1.5 text-slate-800 text-xs sm:text-sm font-semibold mb-2" htmlFor="reg-reason">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>{t('সংগঠনে যুক্ত হওয়ার লক্ষ্য ও আগ্রহ', 'Reason & Motivation for Joining')}</span>
            </label>
            <textarea
              id="reg-reason"
              name="reason"
              rows={3}
              value={form.reason}
              onChange={handleChange}
              placeholder={t('মানবকল্যাণ বা সমাজসেবায় কীভাবে অবদান রাখতে চান?', 'How do you wish to contribute to social welfare?')}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all text-sm resize-none"
            />
          </div>

          {/* Pledge & Submit Button */}
          <div className="pt-2">
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              {t(
                'আবেদন জমা দেওয়ার মাধ্যমে আপনি সংগঠনের গঠনতন্ত্র ও নিয়ম-কানুন মেনে চলার সম্মতি জানাচ্ছেন।',
                'By submitting, you pledge to abide by the constitution and rules of the organization.'
              )}
            </p>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-500/25 border border-blue-400/30 transition-all duration-300 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2.5"
            >
              <Send className="w-4 h-4 text-amber-300" />
              <span>{t('আবেদনপত্র দাখিল করুন', 'Submit Membership Application')}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
