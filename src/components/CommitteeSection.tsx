'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { CommitteeMember } from '@/types/committee';
import { FALLBACK_COMMITTEE } from '@/lib/committee';
import { toBengaliNumerals } from '@/lib/activities';
import {
  User,
  Users,
  Crown,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Search,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Eye,
  X,
  UserCheck,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface CommitteeSectionProps {
  isLandingPage?: boolean;
}

export default function CommitteeSection({ isLandingPage = true }: CommitteeSectionProps) {
  const { t } = useLang();
  const [members, setMembers] = useState<CommitteeMember[]>(FALLBACK_COMMITTEE);
  const [loading, setLoading] = useState(false);
  const [syncToast, setSyncToast] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  // 7-Member Showcase State: currentIndex is the MIDDLE member
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Directory Filter & Search
  const [activeCategory, setActiveCategory] = useState<'all' | 'leadership' | 'secretariat' | 'member'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch committee from Google Sheet live API
  const fetchCommittee = useCallback(async (isManual = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/committee?_t=${Date.now()}&_rand=${Math.random()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.members && data.members.length > 0) {
          setMembers(data.members);
          setLastUpdated(new Date().toLocaleTimeString());
          if (isManual) {
            setSyncToast(true);
            setTimeout(() => setSyncToast(false), 3500);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load committee:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCommittee(false);
  }, [fetchCommittee]);

  // Auto-play: Advance members so each member comes into the middle one by one
  useEffect(() => {
    if (!isPlaying || members.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % members.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [isPlaying, members.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + members.length) % members.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % members.length);
  };

  // Helper for brand-aligned role styling (strictly website brand palette: Amber, Blue, Emerald, Slate)
  const getRoleStyle = (role: string) => {
    if (role.includes('সভাপতি') && !role.includes('সহ')) {
      return {
        badgeBg: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs',
        ringColor: 'ring-amber-400',
        textColor: 'text-amber-700',
        borderActive: 'border-amber-400',
        icon: Crown,
      };
    }
    if (role.includes('সহ-সভাপতি') || role.includes('প্রতিষ্ঠাতা')) {
      return {
        badgeBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs',
        ringColor: 'ring-emerald-400',
        textColor: 'text-emerald-700',
        borderActive: 'border-emerald-400',
        icon: Award,
      };
    }
    if (role.includes('সাধারণ সম্পাদক')) {
      return {
        badgeBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs',
        ringColor: 'ring-blue-500',
        textColor: 'text-blue-700',
        borderActive: 'border-blue-400',
        icon: ShieldCheck,
      };
    }
    if (role.includes('সম্পাদক')) {
      return {
        badgeBg: 'bg-blue-50 text-blue-700 border border-blue-200',
        ringColor: 'ring-blue-300',
        textColor: 'text-blue-700',
        borderActive: 'border-blue-300',
        icon: UserCheck,
      };
    }
    return {
      badgeBg: 'bg-slate-100 text-slate-700 border border-slate-200',
      ringColor: 'ring-slate-200',
      textColor: 'text-slate-700',
      borderActive: 'border-slate-300',
      icon: User,
    };
  };

  // 7 Visible slots centered at currentIndex: [-3, -2, -1, 0, 1, 2, 3]
  const visibleOffsets = [-3, -2, -1, 0, 1, 2, 3];

  const visibleMembers = useMemo(() => {
    if (members.length === 0) return [];
    return visibleOffsets.map((offset) => {
      const idx = (currentIndex + offset + members.length) % members.length;
      return {
        offset,
        member: members[idx],
        originalIndex: idx,
      };
    });
  }, [currentIndex, members]);

  // Filtered members for directory list below
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (activeCategory !== 'all' && m.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = m.name.toLowerCase().includes(q);
        const matchRole = m.role.toLowerCase().includes(q);
        return matchName || matchRole;
      }
      return true;
    });
  }, [members, activeCategory, searchQuery]);

  const selectMemberToMiddle = (originalIndex: number) => {
    setCurrentIndex(originalIndex);
    const showcaseEl = document.getElementById('committee-showcase');
    if (showcaseEl) {
      showcaseEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <section id="committee" className="py-20 sm:py-24 bg-slate-50/70 relative overflow-hidden border-b border-slate-200/80">
      {/* Website Brand Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-gradient-to-tr from-blue-100/40 via-amber-50/30 to-emerald-50/20 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link if on Dedicated Committee Page */}
        {!isLandingPage && (
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 text-xs sm:text-sm font-semibold shadow-xs transition-all group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-blue-600" />
              <span>{t('মূল পাতায় ফিরে যান', 'Back to Home')}</span>
            </Link>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('সাংগঠনিক কার্যনির্বাহী টিম', 'Executive Council & Leadership')}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('কার্যকরী পরিষদ', 'Executive Committee')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-600">
              (২০২৪–২০২৬)
            </span>
          </h2>

          <p className="mt-2.5 text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t(
              'পলাশবাড়ী ইয়াং সোসাইটির গঠনতন্ত্র, আদর্শ ও লক্ষ্য বাস্তবায়নে নিবেদিতপ্রাণ তরুণ নেতৃত্বের কার্যনির্বাহী টিম।',
              'The dedicated executive leadership driving the mission, social welfare, and principles of Palashbari Youth Society.'
            )}
          </p>

          {/* Action Row: Member Count, Sheet Sync, Auto-Play status */}
          <div className="mt-5 flex items-center justify-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>{t(`সর্বমোট: ${toBengaliNumerals(members.length)} জন`, `Total: ${members.length} Members`)}</span>
            </span>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${
                isPlaying
                  ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                  : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
              }`}
              title={isPlaying ? t('অটো-স্ক্রোল থামান', 'Pause auto scroll') : t('অটো-স্ক্রোল চালু করুন', 'Resume auto scroll')}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 fill-amber-600 text-amber-600" />
                  <span>{t('স্বয়ংক্রিয় চলমান', 'Auto')}</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-blue-600 text-blue-600" />
                  <span>{t('স্থগিত', 'Paused')}</span>
                </>
              )}
            </button>

            <button
              onClick={() => fetchCommittee(true)}
              disabled={loading}
              title={t('গুগল শিট থেকে তথ্য সিঙ্ক করুন', 'Sync with Google Sheet')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-full shadow-xs text-xs text-slate-700 transition-all active:scale-95 disabled:opacity-60 group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-semibold text-slate-800">{t('শিট সিঙ্ক', 'Sheet Sync')}</span>
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 group-hover:rotate-180 transition-transform ${loading ? 'animate-spin' : ''}`} />
              {lastUpdated && <span className="text-slate-400 text-[11px] hidden sm:inline">• {lastUpdated}</span>}
            </button>
          </div>

          {/* Sync Success Toast */}
          {syncToast && (
            <div className="mt-3 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 inline-flex items-center gap-2 text-xs font-bold shadow-xs animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('কার্যকরী পরিষদের তথ্য সফলভাবে সিঙ্ক হয়েছে!', 'Committee data synced successfully!')}</span>
            </div>
          )}
        </div>

        {/* 1. 7-MEMBER ANIMATED SHOWCASE UI (7 members visible, 1 by 1 into middle) */}
        <div id="committee-showcase" className="relative mb-14 select-none">
          {/* Outer Stage Frame */}
          <div className="relative bg-gradient-to-b from-white/90 via-white/80 to-white/95 backdrop-blur-md rounded-3xl border border-slate-200 shadow-md p-4 sm:p-6 md:p-8 overflow-hidden">
            {/* Top Serial Banner */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-2">
              <span className="font-bold text-slate-700">
                {t('কেন্দ্রীয় প্রদর্শনী (৭ জন সদস্য দৃশ্যমান)', 'Showcase (7 Members in UI)')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[11px] border border-slate-200">
                #{toBengaliNumerals(currentIndex + 1)} / {toBengaliNumerals(members.length)}
              </span>
            </div>

            {/* 7 Members Horizontal Perspective Row */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 py-4 min-h-[340px] sm:min-h-[380px] overflow-hidden">
              {visibleMembers.map(({ offset, member, originalIndex }) => {
                const isCenter = offset === 0;
                const isImmediate = Math.abs(offset) === 1;
                const isSecondary = Math.abs(offset) === 2;
                const isOuter = Math.abs(offset) === 3;
                const roleStyle = getRoleStyle(member.role);

                // Responsive visibility:
                // offset 0: always visible (Mobile, Tablet, Desktop)
                // offset ±1: visible on mobile & above
                // offset ±2: visible on sm (tablet) & above (hidden on very narrow mobile)
                // offset ±3: visible on lg (desktop) & above
                const visibilityClass = isOuter
                  ? 'hidden lg:flex'
                  : isSecondary
                  ? 'hidden sm:flex'
                  : 'flex';

                return (
                  <div
                    key={`${member.id}-${offset}`}
                    onClick={() => selectMemberToMiddle(originalIndex)}
                    title={isCenter ? member.name : `${member.name} (${member.role}) — মাঝখানে দেখতে ক্লিক করুন`}
                    className={`flex-col items-center justify-center transition-all duration-500 rounded-3xl cursor-pointer ${visibilityClass} ${
                      isCenter
                        ? 'w-64 sm:w-72 md:w-80 p-5 sm:p-6 bg-white border-2 border-amber-400 shadow-2xl ring-4 ring-blue-500/10 z-30 scale-105 sm:scale-110'
                        : isImmediate
                        ? 'w-36 sm:w-44 md:w-48 p-3.5 bg-white/95 border border-slate-200 shadow-md z-20 scale-95 opacity-85 hover:opacity-100 hover:scale-100 hover:border-blue-400'
                        : isSecondary
                        ? 'w-28 sm:w-36 md:w-40 p-2.5 bg-white/80 border border-slate-200/80 shadow-xs z-10 scale-85 opacity-55 hover:opacity-90 hover:scale-90 hover:border-blue-300'
                        : 'w-24 sm:w-28 p-2 bg-white/60 border border-slate-200/60 shadow-xs z-0 scale-75 opacity-30 hover:opacity-75 hover:scale-80'
                    }`}
                  >
                    {/* Avatar Container */}
                    <div className="relative mb-3">
                      <div
                        className={`rounded-full overflow-hidden bg-slate-100 flex items-center justify-center transition-all ${
                          isCenter
                            ? 'w-24 h-24 sm:w-28 sm:h-28 ring-4 ring-amber-400 ring-offset-2 ring-offset-white shadow-lg'
                            : isImmediate
                            ? 'w-16 h-16 sm:w-18 sm:h-18 ring-2 ring-slate-200 shadow-sm'
                            : 'w-12 h-12 sm:w-14 sm:h-14 ring-1 ring-slate-200'
                        }`}
                      >
                        {member.photoUrl && !failedImages[member.id] ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            onError={() => setFailedImages((prev) => ({ ...prev, [member.id]: true }))}
                            className="w-full h-full object-cover object-center"
                          />
                        ) : (
                          /* Fallback Brand User Icon */
                          <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-800 flex items-center justify-center text-white">
                            <User
                              className={`${
                                isCenter ? 'w-12 h-12 text-white/95' : 'w-7 h-7 text-white/90'
                              }`}
                            />
                          </div>
                        )}
                      </div>

                      {/* Center Decorative Crown / Badge Icon */}
                      {isCenter && (
                        <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white shadow-md border border-slate-200">
                          {(() => {
                            const IconComp = roleStyle.icon;
                            return <IconComp className="w-4 h-4 text-amber-500" />;
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Role Designation Badge */}
                    <div className="mb-2 text-center max-w-full">
                      <span
                        className={`inline-block truncate rounded-full font-bold tracking-tight ${
                          isCenter
                            ? `px-3 py-1 text-xs ${roleStyle.badgeBg}`
                            : 'px-2 py-0.5 text-[10px] bg-slate-100 text-slate-700 border border-slate-200 max-w-[130px]'
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>

                    {/* Member Name */}
                    <h3
                      className={`text-center font-bold tracking-tight text-slate-900 max-w-full ${
                        isCenter
                          ? 'text-base sm:text-lg font-black leading-snug line-clamp-2'
                          : 'text-xs sm:text-sm line-clamp-1'
                      }`}
                    >
                      {member.name}
                    </h3>

                    {/* Center Card Subtitle / Organization Line */}
                    {isCenter && (
                      <p className="text-[11px] sm:text-xs text-slate-500 text-center mt-1.5 line-clamp-1 italic">
                        {t('পলাশবাড়ী ইয়াং সোসাইটি কার্যনির্বাহী সদস্য', 'PYS Executive Council Member')}
                      </p>
                    )}

                    {/* Side card click hint */}
                    {!isCenter && (
                      <span className="text-[10px] text-blue-600 font-semibold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {t('মাঝখানে আনুন', 'Show in Center')}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Left and Right Carousel Control Arrows */}
            <button
              onClick={handlePrev}
              aria-label={t('পূর্ববর্তী সদস্য', 'Previous member')}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/95 hover:bg-blue-600 hover:text-white border border-slate-200 text-slate-700 shadow-lg transition-all active:scale-95 z-40 group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={handleNext}
              aria-label={t('পরবর্তী সদস্য', 'Next member')}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/95 hover:bg-blue-600 hover:text-white border border-slate-200 text-slate-700 shadow-lg transition-all active:scale-95 z-40 group"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Stepper Dots (All 26 Members) */}
            <div className="mt-3 flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap max-w-md mx-auto pt-2 border-t border-slate-100">
              {members.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => setCurrentIndex(idx)}
                  title={`${m.name} (${m.role})`}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === idx
                      ? 'w-6 bg-blue-600'
                      : 'w-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* View All Button on Landing Page OR Full Directory on Dedicated /committee Page */}
        {isLandingPage ? (
          <div className="mt-8 text-center">
            <Link
              href="/committee"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 group"
            >
              <span>{t('সকল সদস্য ও পূর্ণাঙ্গ পরিষদ দেখুন', 'View All Committee Members')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <p className="mt-3 text-xs sm:text-sm text-slate-500">
              {t(
                `সর্বমোট ${toBengaliNumerals(members.length)} জন সদস্যের সম্পূর্ণ তালিকা, পদবী ও বিস্তারিত দেখতে এখানে ক্লিক করুন`,
                `Click here to browse the complete directory and roles of all ${members.length} executive committee members`
              )}
            </p>
          </div>
        ) : (
          /* 2. DIRECTORY & SEARCH ROSTER (Only on Dedicated /committee Page) */
          <div className="mt-12 pt-8 border-t border-slate-200/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {t('সকল সদস্য ও পদাবলি তালিকা', 'Complete Committee Roster')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {t(
                    'যেকোনো সদস্যের কার্ডে ক্লিক করলে তিনি স্বয়ংক্রিয়ভাবে উপরের সেন্ট্রাল ৭-মেম্বার ট্র্যাকে চলে আসবেন।',
                    'Click any member card below to center them in the 7-member carousel above.'
                  )}
                </p>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                {/* Category Pills in Brand Style */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-slate-200 shadow-xs overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', label: t('সকল (২৬)', 'All (26)') },
                    { id: 'leadership', label: t('শীর্ষ নেতৃত্ব', 'Leadership') },
                    { id: 'secretariat', label: t('সম্পাদকীয়', 'Secretariat') },
                    { id: 'member', label: t('কার্যকরী সদস্য', 'Members') },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategory(tab.id as typeof activeCategory)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        activeCategory === tab.id
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Quick Search Input */}
                <div className="relative min-w-[200px]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('সদস্য বা পদবী অনুসন্ধান...', 'Search name or role...')}
                    className="w-full pl-8 pr-7 py-1.5 h-9 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-xs"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Member Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMembers.map((member) => {
                const originalIndex = members.findIndex((m) => m.id === member.id);
                const isSelected = currentIndex === originalIndex;
                const roleStyle = getRoleStyle(member.role);

                return (
                  <div
                    key={member.id}
                    onClick={() => selectMemberToMiddle(originalIndex)}
                    className={`bg-white rounded-2xl border transition-all duration-300 p-4 flex items-center gap-3.5 cursor-pointer group hover:-translate-y-0.5 hover:shadow-md ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm bg-blue-50/20'
                        : 'border-slate-200 hover:border-blue-300 shadow-xs'
                    }`}
                  >
                    {/* Photo or User Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-slate-100 border border-slate-200 relative shadow-xs group-hover:scale-105 transition-transform">
                        {member.photoUrl && !failedImages[member.id] ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            onError={() => setFailedImages((prev) => ({ ...prev, [member.id]: true }))}
                            className="w-full h-full object-cover object-center"
                            loading="lazy"
                          />
                        ) : (
                          /* User Icon Fallback */
                          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white">
                            <User className="w-6 h-6 text-white/90" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold truncate ${roleStyle.badgeBg}`}>
                          {member.role}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {member.name}
                      </h4>

                      <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                        <Eye className="w-3 h-3" />
                        <span>{t('মাঝখানে দেখুন', 'Center')}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredMembers.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md mx-auto my-6 shadow-xs">
                <User className="w-9 h-9 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">{t('কোনো সদস্য পাওয়া যায়নি', 'No members found')}</p>
                <p className="text-xs text-slate-500 mt-1">{t('অনুসন্ধান শব্দ বা ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।', 'Try adjusting your search query or filter.')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
