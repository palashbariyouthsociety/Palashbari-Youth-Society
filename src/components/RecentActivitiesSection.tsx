'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { ActivityItem, ActivityImage } from '@/types/activity';
import { FALLBACK_ACTIVITIES, toBengaliNumerals } from '@/lib/activities';
import {
  Calendar,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon,
  FolderOpen,
  Eye,
  Trees,
  Hammer,
  HeartHandshake,
  Layers,
  CheckCircle,
  CheckCircle2,
  FileText,
  Heart,
  Users,
  GraduationCap,
  ArrowUpDown,
  Search,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import DonationModal from '@/components/DonationModal';

const BN_MONTH_NAMES: Record<number, string> = {
  1: 'জানুয়ারি',
  2: 'ফেব্রুয়ারি',
  3: 'মার্চ',
  4: 'এপ্রিল',
  5: 'মে',
  6: 'জুন',
  7: 'জুলাই',
  8: 'আগস্ট',
  9: 'সেপ্টেম্বর',
  10: 'অক্টোবর',
  11: 'নভেম্বর',
  12: 'ডিসেম্বর',
};

const EN_MONTH_NAMES: Record<number, string> = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

interface RecentActivitiesSectionProps {
  isLandingPage?: boolean;
}

export default function RecentActivitiesSection({ isLandingPage = true }: RecentActivitiesSectionProps) {
  const { t } = useLang();
  const [activities, setActivities] = useState<ActivityItem[]>(FALLBACK_ACTIVITIES);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [syncToast, setSyncToast] = useState(false);

  // Filters State
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'completed'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // 'desc' = Newest first, 'asc' = Oldest first

  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Donation Modal State
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [donationActivityTitle, setDonationActivityTitle] = useState('');

  // Lightbox Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<ActivityImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxTitle, setLightboxTitle] = useState('');
  const [lightboxDate, setLightboxDate] = useState('');
  const [useIframeMode, setUseIframeMode] = useState(false);

  // Track failed direct images to switch to Drive Previewer / fallback
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});


  const fetchActivities = useCallback(async (isManual = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/activities?_t=${Date.now()}&_rand=${Math.random()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.activities && data.activities.length > 0) {
          setActivities(data.activities);
          setLastUpdated(new Date().toLocaleTimeString());
          if (isManual) {
            setSyncToast(true);
            setTimeout(() => setSyncToast(false), 3500);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load activities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchActivities(false);
    })();

    // Auto-sync polling every 20 seconds to catch sheet changes promptly
    const interval = setInterval(() => {
      fetchActivities(false);
    }, 20000);

    // Auto-sync immediately when tab/window becomes active
    const handleFocus = () => fetchActivities(false);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchActivities(false);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchActivities]);

  const openLightbox = (activity: ActivityItem, initialIndex = 0) => {
    if (!activity.images || activity.images.length === 0) return;
    setLightboxImages(activity.images);
    setCurrentImageIndex(initialIndex);
    setLightboxTitle(activity.title);
    setLightboxDate(activity.formattedDateBn);
    const currImgId = activity.images[initialIndex]?.id;
    setUseIframeMode(Boolean(failedImages[currImgId]));
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImages([]);
    setCurrentImageIndex(0);
    setUseIframeMode(false);
  };

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => {
      const nextIdx = (prev + 1) % lightboxImages.length;
      const nextImgId = lightboxImages[nextIdx]?.id;
      setUseIframeMode(Boolean(failedImages[nextImgId]));
      return nextIdx;
    });
  }, [lightboxImages, failedImages]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => {
      const nextIdx = (prev - 1 + lightboxImages.length) % lightboxImages.length;
      const nextImgId = lightboxImages[nextIdx]?.id;
      setUseIframeMode(Boolean(failedImages[nextImgId]));
      return nextIdx;
    });
  }, [lightboxImages, failedImages]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextImage, prevImage]);

  // Handle direct image load error
  const handleImageError = (imageId: string) => {
    setFailedImages((prev) => ({ ...prev, [imageId]: true }));
  };

  // Dynamic Category Metadata (Icon + Theme Styling)
  const getCategoryMeta = (catBn = '', catEn = '') => {
    const text = `${catBn} ${catEn}`.toLowerCase();

    if (text.includes('পরিবেশ') || text.includes('বৃক্ষ') || text.includes('environment')) {
      return {
        icon: <Trees className="w-3.5 h-3.5 text-emerald-600" />,
        badgeClass: 'bg-emerald-50/90 border-emerald-200/90 text-emerald-800',
      };
    }
    if (text.includes('অবকাঠামো') || text.includes('সংস্কার') || text.includes('উন্নয়ন') || text.includes('infrastructure')) {
      return {
        icon: <Hammer className="w-3.5 h-3.5 text-amber-600" />,
        badgeClass: 'bg-amber-50/90 border-amber-200/90 text-amber-800',
      };
    }
    if (text.includes('সভা') || text.includes('বৈঠক') || text.includes('সাংগঠনিক') || text.includes('meeting') || text.includes('assembly')) {
      return {
        icon: <Users className="w-3.5 h-3.5 text-indigo-600" />,
        badgeClass: 'bg-indigo-50/90 border-indigo-200/90 text-indigo-800',
      };
    }
    if (text.includes('রক্ত') || text.includes('চিকিৎসা') || text.includes('স্বাস্থ্য') || text.includes('health') || text.includes('blood')) {
      return {
        icon: <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />,
        badgeClass: 'bg-rose-50/90 border-rose-200/90 text-rose-800',
      };
    }
    if (text.includes('শিক্ষা') || text.includes('মেধা') || text.includes('বই') || text.includes('education')) {
      return {
        icon: <GraduationCap className="w-3.5 h-3.5 text-sky-600" />,
        badgeClass: 'bg-sky-50/90 border-sky-200/90 text-sky-800',
      };
    }
    if (text.includes('ত্রাণ') || text.includes('শীতবস্ত্র') || text.includes('মানবিক') || text.includes('relief')) {
      return {
        icon: <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />,
        badgeClass: 'bg-teal-50/90 border-teal-200/90 text-teal-800',
      };
    }

    return {
      icon: <Sparkles className="w-3.5 h-3.5 text-blue-600" />,
      badgeClass: 'bg-blue-50/90 border-blue-200/90 text-blue-800',
    };
  };

  // Distinct Available Years for Date Filter
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(activities.map((a) => a.year).filter(Boolean)));
    return years.sort((a, b) => b - a);
  }, [activities]);

  // Distinct Available Months for Date Filter
  const availableMonths = useMemo(() => {
    let base = activities;
    if (selectedYear !== 'all') {
      base = base.filter((a) => a.year === Number(selectedYear));
    }
    const months = Array.from(new Set(base.map((a) => a.month).filter(Boolean)));
    return months.sort((a, b) => a - b);
  }, [activities, selectedYear]);

  // Counts for Status Tabs
  const ongoingCount = useMemo(
    () => activities.filter((a) => a.status === 'ongoing').length,
    [activities]
  );
  const completedCount = useMemo(
    () => activities.filter((a) => a.status === 'completed').length,
    [activities]
  );

  // Available categories
  const categories = useMemo(() => {
    return [
      { id: 'all', labelBn: 'সকল কার্যক্রম', labelEn: 'All Activities' },
      ...Array.from(new Set(activities.map((a) => a.categoryBn))).map((catBn) => {
        const act = activities.find((a) => a.categoryBn === catBn);
        return {
          id: act?.category || catBn,
          labelBn: catBn,
          labelEn: act?.category || catBn,
        };
      }),
    ];
  }, [activities]);

  // Filter & Sort activities based on Date, Status, Year, Month, Category, Search
  const filteredActivities = useMemo(() => {
    return activities
      .filter((act) => {
        // 1. Status Filter: চলমান (ongoing) vs সম্পন্ন (completed)
        if (statusFilter === 'ongoing' && act.status !== 'ongoing') return false;
        if (statusFilter === 'completed' && act.status !== 'completed') return false;

        // 2. Year Filter
        if (selectedYear !== 'all' && act.year !== Number(selectedYear)) return false;

        // 3. Month Filter
        if (selectedMonth !== 'all' && act.month !== Number(selectedMonth)) return false;

        // 4. Category Filter
        if (activeCategory !== 'all') {
          if (act.category !== activeCategory && act.categoryBn !== activeCategory) {
            return false;
          }
        }

        // 5. Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = act.title.toLowerCase().includes(q);
          const matchDesc = act.description.toLowerCase().includes(q);
          const matchCat = (act.categoryBn + ' ' + act.category).toLowerCase().includes(q);
          const matchDate = (act.formattedDateBn + ' ' + act.formattedDateEn + ' ' + act.date).toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat && !matchDate) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Date Ordering: Newest first (desc) or Oldest first (asc)
        if (sortOrder === 'asc') {
          return a.eventDateTimestamp - b.eventDateTimestamp;
        }
        return b.eventDateTimestamp - a.eventDateTimestamp;
      });
  }, [activities, statusFilter, selectedYear, selectedMonth, activeCategory, searchQuery, sortOrder]);

  // Max 6 activities on Landing Page, all activities on dedicated /activities page
  const displayedActivities = useMemo(() => {
    return isLandingPage ? filteredActivities.slice(0, 6) : filteredActivities;
  }, [filteredActivities, isLandingPage]);

  const hasActiveFilters =
    statusFilter !== 'all' ||
    selectedYear !== 'all' ||
    selectedMonth !== 'all' ||
    activeCategory !== 'all' ||
    searchQuery.trim() !== '';

  const resetAllFilters = () => {
    setStatusFilter('all');
    setSelectedYear('all');
    setSelectedMonth('all');
    setActiveCategory('all');
    setSearchQuery('');
  };

  return (
    <section id="activities" className="py-20 sm:py-24 bg-slate-50/70 relative overflow-hidden border-b border-slate-200/80">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-blue-100/40 via-indigo-50/30 to-amber-50/20 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Link if on Dedicated Activities Page */}
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('বাস্তব কর্মসূচি ও সমাজসেবা', 'Real Field Work & Activities')}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t('সাম্প্রতিক কার্যক্রম ও মাঠপর্যায়ের প্রতিবেদন', 'Recent Activities & Field Reports')}
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
              {t(
                'পলাশবাড়ী ইয়াং সোসাইটির তরুণদের প্রত্যক্ষ অংশগ্রহণে পরিচালিত বিভিন্ন জনকল্যাণমূলক ও সমাজ উন্নয়ন কাজের সরাসরি হালনাগাদ।',
                'Live updates of community welfare and development works conducted with active participation of youth.'
              )}
            </p>
          </div>

          {/* Action buttons: Live Sync + General Donate (Drive Photo Guide completely removed) */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-end">
            {/* General Donate Button */}
            <button
              onClick={() => {
                setDonationActivityTitle('পলাশবাড়ী ইয়াং সোসাইটি সাধারণ মানবকল্যাণ তহবিল');
                setDonationModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#e2136e] to-[#f7941d] hover:brightness-105 text-white rounded-full text-xs font-bold transition-all shadow-sm shadow-pink-500/20 active:scale-95"
            >
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
              <span>{t('অনুদান পাঠান', 'Donate')}</span>
            </button>

            {/* Direct Google Sheet Live Sync Button with Live Indicator */}
            <button
              onClick={() => fetchActivities(true)}
              disabled={loading}
              title={t('গুগল শিট থেকে সরাসরি তাজা তথ্য সিঙ্ক করুন', 'Direct live sync from Google Sheet')}
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
        </div>

        {/* Sync Success Toast Notification */}
        {syncToast && (
          <div className="mb-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-xs animate-fade-in">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('গুগল শিট থেকে সর্বশেষ তথ্য সফলভাবে সিঙ্ক হয়েছে!', 'Live data successfully synced from Google Sheet!')}</span>
            </div>
            <button
              onClick={() => setSyncToast(false)}
              className="text-emerald-700 hover:text-emerald-950 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Compact, Modern Filter Hub (Ultra-Responsive for Mobile & Sleek on Desktop) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3 sm:p-4 mb-8 space-y-3">
          {/* Row 1: Status Filter Tabs (3-column grid on mobile, inline-flex on desktop) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* 3 Status Buttons with responsive labels & counts */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
              {/* All */}
              <button
                onClick={() => setStatusFilter('all')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{t('সকল', 'All')}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black ${
                    statusFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {activities.length}
                </span>
              </button>

              {/* Ongoing (চলমান) */}
              <button
                onClick={() => setStatusFilter('ongoing')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'ongoing'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="truncate">{t('চলমান', 'Ongoing')}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black ${
                    statusFilter === 'ongoing' ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {ongoingCount}
                </span>
              </button>

              {/* Completed (সম্পন্ন) */}
              <button
                onClick={() => setStatusFilter('completed')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'completed'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t('সম্পন্ন', 'Done')}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black ${
                    statusFilter === 'completed' ? 'bg-white/25 text-white' : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {completedCount}
                </span>
              </button>
            </div>

            {/* Total Results Counter & Reset Button */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 px-1">
              <span className="font-semibold text-slate-700">
                {t(
                  `প্রদর্শিত: ${toBengaliNumerals(displayedActivities.length)}টি`,
                  `Showing: ${displayedActivities.length}`
                )}
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t('রিসেট', 'Reset')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Search, Year, Month, Sort in a tightly packed responsive bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
            {/* Search Input (spans full width on mobile, 5 cols on sm, 6 cols on md) */}
            <div className="sm:col-span-6 md:col-span-6 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('কার্যক্রম বা স্থান অনুসন্ধান...', 'Search activities...')}
                className="w-full pl-8 pr-7 py-1.5 h-9 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
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

            {/* Mobile: 3 controls in 1 row (Year, Month, Sort) / Desktop: sm:col-span-6 md:col-span-6 */}
            <div className="grid grid-cols-3 gap-2 sm:col-span-6 md:col-span-6">
              {/* Year Select */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setSelectedMonth('all');
                  }}
                  className="w-full px-2 py-1.5 h-9 rounded-xl bg-slate-50 border border-slate-200 text-[11px] sm:text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors truncate"
                >
                  <option value="all">{t('বছর (সব)', 'All Years')}</option>
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {toBengaliNumerals(yr)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Select */}
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-2 py-1.5 h-9 rounded-xl bg-slate-50 border border-slate-200 text-[11px] sm:text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors truncate"
                >
                  <option value="all">{t('মাস (সব)', 'All Months')}</option>
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {BN_MONTH_NAMES[m]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order Toggle */}
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                title={t('তারিখের ক্রম পরিবর্তন করুন', 'Toggle date sorting')}
                className="w-full px-2 py-1.5 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] sm:text-xs font-bold text-slate-700 flex items-center justify-center gap-1 transition-all active:scale-95 truncate"
              >
                <ArrowUpDown className="w-3 h-3 text-blue-600 shrink-0" />
                <span className="truncate">
                  {sortOrder === 'desc' ? t('নতুন', 'Newest') : t('পুরাতন', 'Oldest')}
                </span>
              </button>
            </div>
          </div>

          {/* Row 3: Swipeable Category Pills */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t(cat.labelBn, cat.labelEn)}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {displayedActivities.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-14 text-center max-w-lg mx-auto shadow-sm my-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1.5">
              {t('কোনো কার্যক্রম পাওয়া যায়নি', 'No Activities Found')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
              {t(
                'আপনার নির্বাচিত তারিখ বা ফিল্টারের সাথে মিলে এমন কোনো ফলাফল নেই। অন্য ফিল্টার বা তারিখ নির্বাচন করুন।',
                'No activities matched your selected date or filters. Try adjusting your selection.'
              )}
            </p>
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('ফিল্টার রিসেট করুন', 'Reset All Filters')}</span>
            </button>
          </div>
        ) : (
          /* Activities Grid - Equal Height Cards on Same Level */
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {displayedActivities.map((act) => {
              const isExpanded = expandedId === act.id;

              return (
                <div
                  key={act.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden flex flex-col h-full justify-between"
                >
                  {/* 1. Multi-Image Media Gallery Section */}
                  <div className="p-4 sm:p-5 pb-0 shrink-0">
                    {act.images && act.images.length > 0 ? (
                      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80">
                        {/* Case A: Single Image */}
                        {act.images.length === 1 && (
                          <div
                            onClick={() => openLightbox(act, 0)}
                            className="relative h-64 sm:h-72 w-full cursor-pointer group overflow-hidden bg-slate-900"
                          >
                            {failedImages[act.images[0].id] ? (
                              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white group-hover:brightness-110 transition-all">
                                <div className="p-3.5 rounded-2xl bg-white/10 mb-3 border border-white/15">
                                  <ImageIcon className="w-8 h-8 text-amber-300" />
                                </div>
                                <p className="text-sm font-bold max-w-sm line-clamp-1">{act.title}</p>
                                <span className="mt-2.5 px-3 py-1 rounded-full bg-blue-600/80 hover:bg-blue-600 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors">
                                  <Eye className="w-3.5 h-3.5" />
                                  {t('ছবি প্রিভিউ করুন', 'View Photo Preview')}
                                </span>
                              </div>
                            ) : (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={act.images[0].directUrl}
                                  alt={act.title}
                                  onError={() => handleImageError(act.images[0].id)}
                                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-slate-900 text-xs font-bold backdrop-blur-sm shadow-md">
                                    <Maximize2 className="w-3 h-3 text-blue-600" />
                                    <span>{t('বড় আকারে দেখুন', 'View Full Screen')}</span>
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {/* Case B: Two Images (Split Grid) */}
                        {act.images.length === 2 && (
                          <div className="grid grid-cols-2 gap-1.5 h-64 sm:h-72 bg-slate-900">
                            {act.images.map((img, i) => (
                              <div
                                key={img.id}
                                onClick={() => openLightbox(act, i)}
                                className="relative h-full w-full cursor-pointer group overflow-hidden bg-slate-900"
                              >
                                {failedImages[img.id] ? (
                                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-blue-950 to-slate-900 text-white group-hover:brightness-110 transition-all">
                                    <ImageIcon className="w-6 h-6 text-amber-300 mb-1.5" />
                                    <p className="text-xs font-semibold">{t(`স্থিরচিত্র ${i + 1}`, `Photo ${i + 1}`)}</p>
                                    <span className="text-[10px] text-blue-300 mt-1 flex items-center gap-1">
                                      <Eye className="w-3 h-3" />
                                      {t('প্রিভিউ', 'Preview')}
                                    </span>
                                  </div>
                                ) : (
                                  <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={img.directUrl}
                                      alt={`${act.title} - ${i + 1}`}
                                      onError={() => handleImageError(img.id)}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <Maximize2 className="w-5 h-5 text-white drop-shadow" />
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Case C: Three or More Images (Professional Collage) */}
                        {act.images.length >= 3 && (
                          <div className="grid grid-cols-3 gap-1.5 h-64 sm:h-80 bg-slate-900">
                            {/* Main Featured Photo (2 cols) */}
                            <div
                              onClick={() => openLightbox(act, 0)}
                              className="col-span-2 relative h-full cursor-pointer group overflow-hidden bg-slate-900"
                            >
                              {failedImages[act.images[0].id] ? (
                                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white group-hover:brightness-110 transition-all">
                                  <ImageIcon className="w-8 h-8 text-amber-300 mb-2" />
                                  <p className="text-xs font-bold line-clamp-2">{act.title}</p>
                                  <span className="text-xs text-white bg-blue-600/80 px-3 py-1 rounded-full mt-2 flex items-center gap-1.5">
                                    <Eye className="w-3.5 h-3.5" />
                                    {t('গ্যালারি প্রিভিউ দেখুন', 'View Gallery Preview')}
                                  </span>
                                </div>
                              ) : (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={act.images[0].directUrl}
                                  alt={`${act.title} - Featured`}
                                  onError={() => handleImageError(act.images[0].id)}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 text-white text-[11px] font-medium backdrop-blur-sm">
                                    <Maximize2 className="w-3 h-3 text-amber-300" />
                                    <span>{t('বড় আকারে দেখুন', 'View Full Screen')}</span>
                                  </span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Secondary Thumbnails Column (1 col split in 2) */}
                          <div className="col-span-1 grid grid-rows-2 gap-1.5 h-full">
                            {/* Image 2 */}
                            <div
                              onClick={() => openLightbox(act, 1)}
                              className="relative h-full cursor-pointer group overflow-hidden bg-slate-900"
                            >
                              {failedImages[act.images[1].id] ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-2 text-center group-hover:bg-slate-750 transition-colors">
                                  <ImageIcon className="w-5 h-5 text-amber-300 mb-1" />
                                  <span className="text-[10px] text-slate-300 font-medium">#{2}</span>
                                </div>
                              ) : (
                                <>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={act.images[1].directUrl}
                                    alt={`${act.title} - 2`}
                                    onError={() => handleImageError(act.images[1].id)}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                  />
                                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Maximize2 className="w-4 h-4 text-white" />
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Image 3 with More Badge if > 3 */}
                            <div
                              onClick={() => openLightbox(act, 2)}
                              className="relative h-full cursor-pointer group overflow-hidden bg-slate-900"
                            >
                              {failedImages[act.images[2].id] ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-2 text-center group-hover:bg-slate-750 transition-colors">
                                  <ImageIcon className="w-5 h-5 text-amber-300 mb-1" />
                                  <span className="text-[10px] text-slate-300 font-medium">#{3}</span>
                                </div>
                              ) : (
                                <>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={act.images[2].directUrl}
                                    alt={`${act.title} - 3`}
                                    onError={() => handleImageError(act.images[2].id)}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                  />
                                </>
                              )}

                              {/* More overlay badge */}
                              {act.images.length > 3 ? (
                                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white backdrop-blur-xs group-hover:bg-black/60 transition-colors">
                                  <span className="text-base sm:text-lg font-extrabold tracking-tight text-amber-300">
                                    +{act.images.length - 2}
                                  </span>
                                  <span className="text-[10px] uppercase font-semibold text-slate-200">
                                    {t('আরও ছবি', 'More Photos')}
                                  </span>
                                </div>
                              ) : (
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Maximize2 className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Photo Count Pill Overlay */}
                      <div className="absolute top-3 right-3 z-10">
                        <button
                          onClick={() => openLightbox(act, 0)}
                          className="px-2.5 py-1 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md border border-white/20 shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
                        >
                          <Layers className="w-3.5 h-3.5 text-amber-400" />
                          <span>
                            {t(
                              `${act.images.length}টি স্থিরচিত্র`,
                              `${act.images.length} Photos`
                            )}
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Fallback when no images provided */
                    <div className="h-48 rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-6 flex flex-col justify-between text-white border border-slate-200">
                      <div className="inline-flex p-3 rounded-2xl bg-white/10 w-fit">
                        {getCategoryMeta(act.categoryBn, act.category).icon}
                      </div>
                      <p className="text-sm font-semibold text-blue-200">{t(act.categoryBn || 'মাঠপর্যায়ের কার্যক্রম', act.category || 'Field Action')}</p>
                    </div>
                  )}
                </div>

                {/* 2. Text Content & Details (Flex-1 ensures equal card height) */}
                <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between">
                  <div className="flex-1">
                    {/* Date and Status and Category Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-3.5">
                      {/* Event Date Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{t(act.formattedDateBn, act.formattedDateEn)}</span>
                      </span>

                      {/* Status Badge: Ongoing (চলমান) vs Completed (সম্পন্ন) */}
                      {act.status === 'ongoing' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                          </span>
                          <span>{t('চলমান কার্যক্রম', 'Ongoing Event')}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>{t('সম্পন্ন কার্যক্রম', 'Completed')}</span>
                        </span>
                      )}

                      {/* Category Badge */}
                      {(() => {
                        const catMeta = getCategoryMeta(act.categoryBn, act.category);
                        return (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold shadow-2xs ${catMeta.badgeClass}`}>
                            {catMeta.icon}
                            <span>{t(act.categoryBn, act.category)}</span>
                          </span>
                        );
                      })()}
                    </div>

                    {/* Headline */}
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 leading-snug hover:text-blue-600 transition-colors">
                      {act.title}
                    </h3>

                    {/* Description */}
                    <div
                      className={`text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                        !isExpanded ? 'line-clamp-3 sm:line-clamp-4' : ''
                      }`}
                    >
                      {act.description}
                    </div>

                    {/* Read More / Less Toggle */}
                    {(act.description.length > 160 || act.description.split('\n').length > 3) && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : act.id)}
                        className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
                      >
                        <span>{isExpanded ? t('সংক্ষিপ্ত করুন ▲', 'Read Less ▲') : t('সম্পূর্ণ বিবরণ পড়ুন ▼', 'Read More ▼')}</span>
                      </button>
                    )}
                  </div>

                  {/* 3. Action Buttons & Links - Unified Row Keeping Cards at the Same Exact Level */}
                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openLightbox(act, 0)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors shadow-xs active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>{t('গ্যালারিতে দেখুন', 'View Gallery')}</span>
                      </button>

                      {act.images && act.images.length > 0 && (
                        <a
                          href={act.images[0].driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
                          <span>{t('ড্রাইভ', 'Drive')}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      )}
                    </div>

                    {/* Right Action: Donate button if ongoing/future, else Completed Status */}
                    {act.status === 'ongoing' ? (
                      <button
                        onClick={() => {
                          setDonationActivityTitle(act.title);
                          setDonationModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#e2136e] via-pink-600 to-[#f7941d] hover:brightness-105 text-white font-bold text-xs shadow-md shadow-pink-500/20 transition-all hover:scale-105 active:scale-95 group"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white text-white group-hover:scale-125 transition-transform" />
                        <span>{t('সহযোগিতা / অনুদান দিন', 'Donate / Support')}</span>
                        <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded text-white font-medium">
                          বিকাশ/নগদ/রকেট
                        </span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t('সম্পন্ন কর্মসূচি', 'Completed')}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View All Button on Landing Page */}
      {isLandingPage && (
        <div className="mt-12 text-center">
          <Link
            href="/activities"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 group"
          >
            <span>{t('সকল কার্যক্রম ও মাঠপর্যায়ের প্রতিবেদন দেখুন', 'View All Activities & Reports')}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </Link>
          <p className="mt-3 text-xs sm:text-sm text-slate-500">
            {t(
              `সর্বমোট ${toBengaliNumerals(activities.length)}টি কার্যক্রমের পূর্ণাঙ্গ আর্কাইভ এবং ফিল্টার দেখতে এখানে ক্লিক করুন`,
              `Click here to browse our complete archive of all ${activities.length} field activities and reports`
            )}
          </p>
        </div>
      )}

      </div>

      {/* 4. Full-Screen Interactive Lightbox Modal */}
      {lightboxOpen && lightboxImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-fade-in">
          {/* Top Bar */}
          <div className="p-4 sm:p-5 flex items-center justify-between text-white border-b border-white/10 bg-black/40">
            <div>
              <p className="text-sm sm:text-base font-bold text-white line-clamp-1">{lightboxTitle}</p>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{lightboxDate}</span>
                <span>•</span>
                <span className="text-amber-300 font-semibold">
                  {currentImageIndex + 1} / {lightboxImages.length}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Toggle View Mode Button */}
              <button
                onClick={() => setUseIframeMode(!useIframeMode)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                  useIframeMode
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300 border-white/20'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{useIframeMode ? t('ড্রাইভ প্রিভিউ সক্রিয়', 'Drive Mode Active') : t('ড্রাইভ প্রিভিউ মোড', 'Switch to Drive Mode')}</span>
              </button>

              <a
                href={lightboxImages[currentImageIndex]?.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/15"
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-300" />
                <span>{t('ড্রাইভে আসল ফাইল', 'Drive File')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={closeLightbox}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Image Display with Arrows */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 select-none">
            {/* Prev Arrow */}
            {lightboxImages.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-2xl"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Current Media (Iframe mode or Direct Image) */}
            <div className="w-full max-w-5xl h-[70vh] sm:h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl">
              {useIframeMode ? (
                /* Google Drive Embedded Official File Previewer */
                <div className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
                  <iframe
                    src={lightboxImages[currentImageIndex]?.previewUrl}
                    title={`${lightboxTitle} - Preview ${currentImageIndex + 1}`}
                    className="w-full h-full border-0"
                    allow="autoplay"
                  />
                </div>
              ) : failedImages[lightboxImages[currentImageIndex]?.id] ? (
                /* If direct image failed, show clear options to switch to Drive Previewer or open link */
                <div className="p-8 sm:p-10 text-center text-white bg-slate-900/95 border border-slate-800 rounded-3xl max-w-lg shadow-2xl">
                  <div className="p-4 rounded-full bg-blue-500/20 text-amber-300 inline-flex mb-4">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">{lightboxTitle}</h4>
                  <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
                    {t(
                      'গুগল ড্রাইভে ছবিটির শেয়ারিং পারমিশন "Anyone with the link" করা থাকলে সরাসরি লোড হবে। আপনি চাইলে নিচের বাটনে ড্রাইভ প্রিভিউয়ার চালু করতে পারেন।',
                      'Direct image preview is available once Drive sharing is set to "Anyone with the link". You can also switch to embedded Drive Preview mode.'
                    )}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => setUseIframeMode(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg transition-transform active:scale-95"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{t('ড্রাইভ প্রিভিউয়ারে খুলুন', 'Open in Drive Previewer')}</span>
                    </button>
                    <a
                      href={lightboxImages[currentImageIndex]?.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/20 transition-colors"
                    >
                      <FolderOpen className="w-4 h-4 text-amber-300" />
                      <span>{t('গুগল ড্রাইভে দেখুন', 'Open in Google Drive')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                /* Direct Image Rendering */
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={lightboxImages[currentImageIndex]?.directUrl}
                  alt={`${lightboxTitle} - Image ${currentImageIndex + 1}`}
                  onError={() => handleImageError(lightboxImages[currentImageIndex]?.id)}
                  className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-xl shadow-2xl"
                />
              )}
            </div>

            {/* Next Arrow */}
            {lightboxImages.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-2xl"
                aria-label="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip - NO BROKEN IMAGES */}
          {lightboxImages.length > 1 && (
            <div className="p-3.5 border-t border-white/10 bg-black/40 flex items-center justify-center gap-2.5 overflow-x-auto">
              {lightboxImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => {
                    setCurrentImageIndex(idx);
                    setUseIframeMode(Boolean(failedImages[img.id]));
                  }}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    currentImageIndex === idx
                      ? 'border-amber-400 scale-105 shadow-lg shadow-amber-400/20'
                      : 'border-white/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  {failedImages[img.id] ? (
                    <div className="w-full h-full bg-slate-800 text-amber-300 flex flex-col items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span className="text-[10px] font-bold text-slate-300 mt-0.5">#{idx + 1}</span>
                    </div>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={img.directUrl}
                      alt={`Thumb ${idx + 1}`}
                      onError={() => handleImageError(img.id)}
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Donation Modal with bKash and Nagad Branding */}
      <DonationModal
        isOpen={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
        activityTitle={donationActivityTitle}
      />
    </section>
  );
}
