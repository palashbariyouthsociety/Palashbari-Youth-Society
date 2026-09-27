'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpDown,
  Search,
  Calendar,
  Filter,
  Download,
  RotateCcw,
  Receipt,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Building,
  RefreshCw,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Transaction, FinanceSummary } from '@/types/finance';
import {
  formatCurrencyBn,
  formatCurrencyEn,
  FALLBACK_TRANSACTIONS,
  calculateFinanceSummary,
} from '@/lib/finance';
import { toBengaliNumerals } from '@/lib/activities';
import { useLang } from '@/context/LanguageContext';
import ReceiptModal from '@/components/finance/ReceiptModal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FinancePage() {
  const { lang, t } = useLang();
  const isBn = lang === 'bn';

  // Data states
  const [transactions, setTransactions] = useState<Transaction[]>(FALLBACK_TRANSACTIONS);
  const [summary, setSummary] = useState<FinanceSummary>(
    calculateFinanceSummary(FALLBACK_TRANSACTIONS)
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('fallback');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Filter & Search states
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [datePreset, setDatePreset] = useState<'all' | 'month' | '30days' | 'year' | 'custom'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Receipt Modal state
  const [selectedReceiptTxn, setSelectedReceiptTxn] = useState<Transaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch transactions from /api/finance
  const fetchFinanceData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch(`/api/finance?_cb=${Date.now()}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.transactions && Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
        setSummary(data.summary || calculateFinanceSummary(data.transactions));
        setDataSource(data.source || 'live');
        setLastSyncTime(new Date().toLocaleTimeString(isBn ? 'bn-BD' : 'en-US'));
      }
    } catch (err) {
      console.error('Failed to load finance data:', err);
      setDataSource('fallback');
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  // Copy Transaction ID to clipboard
  const handleCopyTxnId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Receipt Modal
  const handleOpenReceipt = (txn: Transaction) => {
    setSelectedReceiptTxn(txn);
    setIsReceiptOpen(true);
  };

  // Filter logic
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return transactions
      .filter((txn) => {
        // 1. Type Filter
        if (typeFilter !== 'all' && txn.type !== typeFilter) {
          return false;
        }

        // 2. Date Preset Filter
        if (datePreset === 'month') {
          if (
            txn.parsedDate.year !== currentYear ||
            txn.parsedDate.month - 1 !== currentMonth
          ) {
            return false;
          }
        } else if (datePreset === '30days') {
          const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;
          if (txn.parsedDate.timestamp < thirtyDaysAgo) {
            return false;
          }
        } else if (datePreset === 'year') {
          if (txn.parsedDate.year !== currentYear) {
            return false;
          }
        } else if (datePreset === 'custom') {
          if (startDate) {
            const startTimestamp = new Date(startDate).getTime();
            if (txn.parsedDate.timestamp < startTimestamp) return false;
          }
          if (endDate) {
            const endTimestamp = new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1;
            if (txn.parsedDate.timestamp > endTimestamp) return false;
          }
        }

        // 3. Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesId = txn.id.toLowerCase().includes(q);
          const matchesDesc = txn.description.toLowerCase().includes(q);
          const matchesCat = txn.category.toLowerCase().includes(q);
          const matchesAmount = String(txn.amount).includes(q);
          const matchesDonor = (txn.donorOrRecipient || '').toLowerCase().includes(q);
          const matchesDate =
            txn.parsedDate.formattedBn.toLowerCase().includes(q) ||
            txn.parsedDate.formattedEn.toLowerCase().includes(q) ||
            txn.date.toLowerCase().includes(q);

          if (!matchesId && !matchesDesc && !matchesCat && !matchesAmount && !matchesDonor && !matchesDate) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return b.parsedDate.timestamp - a.parsedDate.timestamp;
        if (sortBy === 'date-asc') return a.parsedDate.timestamp - b.parsedDate.timestamp;
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
  }, [transactions, typeFilter, datePreset, startDate, endDate, searchQuery, sortBy]);

  // Dynamic summary of filtered results
  const filteredSummary = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of filteredTransactions) {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    }
    return {
      income,
      expense,
      balance: income - expense,
      count: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  const resetFilters = () => {
    setTypeFilter('all');
    setDatePreset('all');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
    setSortBy('date-desc');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Hero Header Section */}
      <header className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 bg-gradient-to-b from-[#0a1226] via-[#0d1b3e] to-[#122452] text-white overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-blue-200/80 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              {t('মূলপাতা', 'Home')}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-blue-400/60" />
            <span className="text-amber-400 font-medium">
              {t('আয়-ব্যয় ও আর্থিক হিসাব', 'Financial Accounts & Ledger')}
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              {/* Top pill badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-4 backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t('শতভাগ উন্মুক্ত, স্বচ্ছ ও নিরীক্ষিত হিসাব ব্যবস্থা', '100% Transparent, Open & Audited Accounts')}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
                {t('আয়-ব্যয় হিসাব ও অডিট বিবরণী', 'Income, Expense & Financial Ledger')}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                {t(
                  'পলাশবাড়ী ইয়াং সোসাইটির সকল অনুদান ও জনকল্যাণমূলক ব্যয়ের প্রতিটি পয়সার স্বচ্ছ বিবরণ। যেকোনো অনুদানের মানি রিসিট সরাসরি ডাউনলোড করুন।',
                  'A transparent, verifiable record of every donation received and public expenditure incurred by Palashbari Youth Society. Download verified money receipts anytime.'
                )}
              </p>
            </div>

            {/* Live Sync Badge & Actions */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-xs text-slate-200">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>
                  {dataSource === 'live'
                    ? t('গুগল শিট সরাসরি সিঙ্ক', 'Live Google Sheet Sync')
                    : t('সিস্টেম ব্যাকআপ ডাটা', 'System Cached Data')}
                </span>
                {lastSyncTime && (
                  <span className="text-[11px] text-blue-300/80 pl-1 border-l border-white/20">
                    {lastSyncTime}
                  </span>
                )}
              </div>

              <button
                onClick={() => fetchFinanceData(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold shadow-md transition-all duration-200"
                title={t('ডাটা রিফ্রেশ করুন', 'Refresh Data')}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? t('সিঙ্ক হচ্ছে...', 'Syncing...') : t('রিফ্রেশ', 'Refresh')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-8 relative z-20 flex-1 w-full">
        {/* TOP ANALYTICS CARDS (4 Columns) */}
        <section aria-label="Financial Summary Cards" className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* 1. Total Income Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-lg shadow-emerald-950/5 relative overflow-hidden group hover:border-emerald-300 transition-all duration-300">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    {t('সর্বমোট প্রাপ্ত আয়', 'Total Received Income')}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">
                  {isBn ? formatCurrencyBn(summary.totalIncome) : formatCurrencyEn(summary.totalIncome)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                    {isBn
                      ? `${toBengaliNumerals(summary.incomeCount)}টি প্রাপ্তি রসিদ`
                      : `${summary.incomeCount} Receipts`}
                  </span>
                  <span>{t('অনুদান ও চাঁদা', 'Donations')}</span>
                </div>
              </div>
            </div>

            {/* 2. Total Expense Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-lg shadow-rose-950/5 relative overflow-hidden group hover:border-rose-300 transition-all duration-300">
              <div className="absolute top-0 right-0 w-28 h-28 bg-rose-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    {t('সর্বমোট অনুমোদিত ব্যয়', 'Total Approved Expense')}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-xs">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">
                  {isBn ? formatCurrencyBn(summary.totalExpense) : formatCurrencyEn(summary.totalExpense)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[11px] border border-rose-200">
                    {isBn
                      ? `${toBengaliNumerals(summary.expenseCount)}টি ভাউচার`
                      : `${summary.expenseCount} Vouchers`}
                  </span>
                  <span>{t('মাঠপর্যায় ও অফিস', 'Operations')}</span>
                </div>
              </div>
            </div>

            {/* 3. Current Net Fund Balance Card */}
            <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-6 border border-blue-700/40 text-white shadow-xl shadow-blue-950/20 relative overflow-hidden group hover:border-amber-400/50 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-400/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    {t('বর্তমান তহবিলের স্থিতি', 'Current Net Balance')}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-white/10 text-amber-400 flex items-center justify-center shadow-xs border border-white/15">
                    <Wallet className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                  {isBn ? formatCurrencyBn(summary.netBalance) : formatCurrencyEn(summary.netBalance)}
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>
                    {summary.netBalance >= 0
                      ? t('তহবিল স্থিতিশীল ও সক্রিয়', 'Fund Healthy & Active')
                      : t('বকেয়া সমন্বয় প্রয়োজন', 'Deficit Adjustment Required')}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Transactions Health & Ratio Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-lg shadow-slate-900/5 relative overflow-hidden group hover:border-blue-300 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {t('মোট হিসাব ও ব্যয় অনুপাত', 'Ledger Records & Ratio')}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {isBn
                    ? `${toBengaliNumerals(summary.totalTransactions)}টি`
                    : `${summary.totalTransactions}`}
                </span>
                <span className="text-xs font-bold text-slate-600">
                  {isBn
                    ? `ব্যয় অনুপাত: ${toBengaliNumerals(summary.expenseRatio)}%`
                    : `Burn: ${summary.expenseRatio}%`}
                </span>
              </div>

              {/* Progress bar of Income vs Expense */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${Math.max(5, 100 - summary.expenseRatio)}%` }}
                  title={t('অবশিষ্ট ব্যালেন্স', 'Remaining')}
                />
                <div
                  className="bg-rose-500 h-full transition-all duration-500"
                  style={{ width: `${summary.expenseRatio}%` }}
                  title={t('ব্যয়িত অংশ', 'Spent')}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-semibold">
                <span className="text-emerald-700">● {t('সংরক্ষিত', 'Retained')}</span>
                <span className="text-rose-600">● {t('কার্যক্রমে ব্যয়', 'Expenses')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ADVANCED FILTER & SEARCH TOOLBAR */}
        <section aria-label="Filters and Search" className="mb-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              {/* Row 1: Search & Type Tabs */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                {/* Search Box */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t(
                      'ট্রানজেকশন আইডি, বিবরণ, খাত বা টাকার অঙ্ক খুঁজুন...',
                      'Search by ID, description, head or amount...'
                    )}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 focus:border-blue-600 focus:bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Transaction Type Filter Segmented Control */}
                <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0 self-start md:self-auto">
                  <button
                    onClick={() => setTypeFilter('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      typeFilter === 'all'
                        ? 'bg-white text-blue-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t('সকল লেনদেন', 'All')} ({isBn ? toBengaliNumerals(transactions.length) : transactions.length})
                  </button>
                  <button
                    onClick={() => setTypeFilter('income')}
                    className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      typeFilter === 'income'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{t('আয় / প্রাপ্তি', 'Income')}</span>
                  </button>
                  <button
                    onClick={() => setTypeFilter('expense')}
                    className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      typeFilter === 'expense'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-rose-700 hover:bg-rose-50'
                    }`}
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>{t('ব্যয় / খরচ', 'Expense')}</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Date Filters & Sort Options */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Date presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-500 font-bold flex items-center gap-1 mr-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t('তারিখ ফিল্টার:', 'Date Range:')}</span>
                  </span>
                  {[
                    { id: 'all', label: t('সব সময়', 'All Time') },
                    { id: 'month', label: t('চলতি মাস', 'This Month') },
                    { id: '30days', label: t('গত ৩০ দিন', 'Last 30 Days') },
                    { id: 'year', label: t('চলতি বছর', 'This Year') },
                    { id: 'custom', label: t('কাস্টম তারিখ', 'Custom Range') },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setDatePreset(preset.id as any)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                        datePreset === preset.id
                          ? 'bg-blue-600 text-white shadow-xs font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Sort Order Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('সাজান:', 'Sort:')}</span>
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    aria-label={t('সাজান', 'Sort by')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="date-desc">{t('তারিখ: নতুন আগে', 'Date: Newest First')}</option>
                    <option value="date-asc">{t('তারিখ: পুরাতন আগে', 'Date: Oldest First')}</option>
                    <option value="amount-desc">{t('টাকা: বেশি থেকে কম', 'Amount: High to Low')}</option>
                    <option value="amount-asc">{t('টাকা: কম থেকে বেশি', 'Amount: Low to High')}</option>
                  </select>
                </div>
              </div>

              {/* Custom Date Range Inputs Row (Conditional) */}
              {datePreset === 'custom' && (
                <div className="pt-2 flex flex-wrap items-center gap-3 bg-blue-50/60 p-3 rounded-2xl border border-blue-200/60 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <label className="text-slate-600 text-xs font-semibold">{t('শুরু:', 'From:')}</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-slate-600 text-xs font-semibold">{t('শেষ:', 'To:')}</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  {(startDate || endDate) && (
                    <button
                      onClick={() => {
                        setStartDate('');
                        setEndDate('');
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline ml-auto"
                    >
                      {t('তারিখ ক্লিয়ার করুন', 'Clear Dates')}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Filter Result Stats Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <span>
                  {t('প্রদর্শিত হচ্ছে:', 'Showing:')}{' '}
                  <strong className="text-slate-900 font-bold">
                    {isBn
                      ? `${toBengaliNumerals(filteredTransactions.length)}টি`
                      : `${filteredTransactions.length}`}
                  </strong>{' '}
                  {t('লেনদেন', 'records')}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-700 font-semibold">
                  {t('আয়:', 'Income:')}{' '}
                  {isBn ? formatCurrencyBn(filteredSummary.income) : formatCurrencyEn(filteredSummary.income)}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-rose-700 font-semibold">
                  {t('ব্যয়:', 'Expense:')}{' '}
                  {isBn ? formatCurrencyBn(filteredSummary.expense) : formatCurrencyEn(filteredSummary.expense)}
                </span>
              </div>

              {(typeFilter !== 'all' || datePreset !== 'all' || searchQuery.trim() || startDate || endDate) && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold transition-colors ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('সকল ফিল্টার রিসেট', 'Reset Filters')}</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ADVANCED INTERACTIVE TABLE & CARD DESIGN */}
        <section aria-label="Transactions Table">
          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-slate-600 font-medium text-sm">
                {t('আর্থিক হিসাব লোড হচ্ছে...', 'Loading financial transactions...')}
              </p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 shadow-sm">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">
                {t('কোনো লেনদেন পাওয়া যায়নি', 'No Transactions Found')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4">
                {t(
                  'আপনার ফিল্টার বা অনুসন্ধানের সাথে মেলানো কোনো হিসাব পাওয়া যায়নি। অনুগ্রহ করে ফিল্টার পরিবর্তন বা রিসেট করুন।',
                  'No transactions matched your selected filters or search terms. Try clearing or broadening your search.'
                )}
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                {t('ফিল্টার রিসেট করুন', 'Reset Filters')}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                      <th className="py-4 px-6 font-bold">{t('তারিখ', 'Date')}</th>
                      <th className="py-4 px-5 font-bold">{t('ট্রানজেকশন আইডি', 'Transaction ID')}</th>
                      <th className="py-4 px-5 font-bold">{t('খাত ও বিবরণ', 'Category & Description')}</th>
                      <th className="py-4 px-4 font-bold text-center">{t('ধরন', 'Type')}</th>
                      <th className="py-4 px-6 font-bold text-right">{t('টাকার পরিমাণ', 'Amount')}</th>
                      <th className="py-4 px-6 font-bold text-center">{t('রশিদ / অ্যাকশন', 'Receipt / Action')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {filteredTransactions.map((txn, idx) => {
                      const isIncome = txn.type === 'income';
                      return (
                        <tr
                          key={txn.id + idx}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          {/* 1. Date */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                              <div>
                                <p className="font-bold text-slate-900">
                                  {isBn ? txn.parsedDate.formattedBn : txn.parsedDate.formattedEn}
                                </p>
                                <p className="text-[11px] text-slate-400 font-mono">
                                  {txn.parsedDate.rawIso}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* 2. Transaction ID with copy button */}
                          <td className="py-4 px-5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-blue-900 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-200">
                                {txn.id}
                              </span>
                              <button
                                onClick={() => handleCopyTxnId(txn.id)}
                                className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                title={t('আইডি কপি করুন', 'Copy ID')}
                              >
                                {copiedId === txn.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* 3. Category & Description */}
                          <td className="py-4 px-5 max-w-xs">
                            <div className="mb-0.5">
                              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                {txn.category}
                              </span>
                            </div>
                            <p className="font-semibold text-slate-900 truncate" title={txn.description}>
                              {txn.description}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {t('মাধ্যম:', 'Method:')} {txn.method || t('নগদ', 'Cash')}
                            </p>
                          </td>

                          {/* 4. Type Badge */}
                          <td className="py-4 px-4 text-center whitespace-nowrap">
                            {isIncome ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <TrendingUp className="w-3 h-3" />
                                <span>{t('আয়', 'Income')}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                <TrendingDown className="w-3 h-3" />
                                <span>{t('ব্যয়', 'Expense')}</span>
                              </span>
                            )}
                          </td>

                          {/* 5. Amount */}
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <div
                              className={`text-base font-black ${
                                isIncome ? 'text-emerald-700' : 'text-rose-600'
                              }`}
                            >
                              {isIncome ? '+' : '–'}{' '}
                              {isBn ? formatCurrencyBn(txn.amount) : formatCurrencyEn(txn.amount)}
                            </div>
                          </td>

                          {/* 6. Action / Receipt Download */}
                          <td className="py-4 px-6 text-center whitespace-nowrap">
                            {isIncome ? (
                              <button
                                onClick={() => handleOpenReceipt(txn)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-xs hover:shadow-md shadow-emerald-500/20 transition-all duration-200"
                                title={t('মানি রিসিট ডাউনলোড ও প্রিন্ট করুন', 'Download or Print Money Receipt')}
                              >
                                <Receipt className="w-3.5 h-3.5" />
                                <span>{t('রশিদ ডাউনলোড', 'Receipt')}</span>
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                                <span>{t('অনুমোদিত ভাউচার', 'Audited Voucher')}</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Responsive Cards View */}
              <div className="md:hidden divide-y divide-slate-100">
                {filteredTransactions.map((txn, idx) => {
                  const isIncome = txn.type === 'income';
                  return (
                    <div key={txn.id + idx} className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors">
                      {/* Top Bar: Date, ID, Type */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {txn.id}
                          </span>
                          <button
                            onClick={() => handleCopyTxnId(txn.id)}
                            className="p-1 rounded text-slate-400 hover:text-blue-600"
                            title={t('আইডি কপি করুন', 'Copy ID')}
                          >
                            {copiedId === txn.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {isIncome ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <TrendingUp className="w-3 h-3" />
                            <span>{t('আয়', 'Income')}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            <TrendingDown className="w-3 h-3" />
                            <span>{t('ব্যয়', 'Expense')}</span>
                          </span>
                        )}
                      </div>

                      {/* Main Details: Category, Description, Amount */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 mb-1">
                            {txn.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {txn.description}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>
                              {isBn ? txn.parsedDate.formattedBn : txn.parsedDate.formattedEn}
                            </span>
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`text-lg font-black ${
                              isIncome ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {isIncome ? '+' : '–'}{' '}
                            {isBn ? formatCurrencyBn(txn.amount) : formatCurrencyEn(txn.amount)}
                          </span>
                        </div>
                      </div>

                      {/* Action CTA for Income (Receipt Download) */}
                      {isIncome ? (
                        <button
                          onClick={() => handleOpenReceipt(txn)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-98"
                        >
                          <Receipt className="w-4 h-4" />
                          <span>{t('মানি রিসিট ডাউনলোড ও প্রিন্ট করুন', 'Download Money Receipt')}</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                          <span>{t('পেমেন্ট মাধ্যম:', 'Method:')} {txn.method || t('নগদ', 'Cash')}</span>
                          <span className="text-blue-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            {t('অডিট যাচাইকৃত', 'Audited')}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Table Footer Summary Bar */}
              <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {t(
                      'সকল লেনদেন পলাশবাড়ী ইয়াং সোসাইটির সেন্ট্রাল অডিট কমিটির দ্বারা পরীক্ষিত ও স্বীকৃত।',
                      'All entries are verified and approved by Palashbari Youth Society Audit Committee.'
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold shrink-0">
                  <span className="text-emerald-400">
                    {t('আয়:', 'Income:')}{' '}
                    {isBn ? formatCurrencyBn(summary.totalIncome) : formatCurrencyEn(summary.totalIncome)}
                  </span>
                  <span className="text-rose-400">
                    {t('ব্যয়:', 'Expense:')}{' '}
                    {isBn ? formatCurrencyBn(summary.totalExpense) : formatCurrencyEn(summary.totalExpense)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* TRANSPARENCY & AUDIT PILLARS */}
        <section aria-label="Transparency Pillars" className="mt-12 sm:mt-16">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
              {t('আমাদের আর্থিক স্বচ্ছতা ও জবাবদিহিতা নীতিমালা', 'Our Financial Transparency & Accountability Principles')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              {t(
                'একটি স্বেচ্ছাসেবী সংগঠনের প্রাণ হলো মানুষের আস্থা ও বিশ্বাস। তাই প্রতিটি টাকার হিসাব জনগণের জন্য সদা উন্মুক্ত।',
                'Trust is the lifeblood of a voluntary organization. Hence every penny is transparent and accountable to the public.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {t('সরাসরি গুগল শিট সংযোগ', 'Live Google Sheet Sync')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t(
                  'আমাদের অর্থ বিভাগ যখনই কোনো এন্ট্রি করে, সাথে সাথে তা কোনো ম্যানুয়াল পরিবর্তন ছাড়াই স্বয়ংক্রিয়ভাবে ওয়েবসাইটে প্রকাশিত হয়।',
                  'As soon as our finance team enters a transaction in our central ledger, it reflects automatically on this website.'
                )}
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {t('ডিজিটাল ভেরিফায়েড মানি রিসিট', 'Digital Verified Receipts')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t(
                  'যেকোনো অনুদানের জন্য যে কেউ তাৎক্ষণিকভাবে অফিশিয়াল সিলযুক্ত রসিদ পিডিএফ বা ইমেজ আকারে ডাউনলোড ও প্রিন্ট করতে পারেন।',
                  'Anyone can generate and download officially sealed receipts in PDF or high-resolution PNG format for any donation.'
                )}
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {t('দ্বৈত নিরীক্ষা ও নিয়মিত অডিট', 'Dual Verification & Audits')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t(
                  'অর্থ সম্পাদক ও সভাপতির যৌথ অনুমোদন এবং উপদেষ্টা পরিষদের নিয়মিত অডিটের মাধ্যমে তহবিলের শতভাগ নিরাপত্তা নিশ্চিত করা হয়।',
                  'Funds are managed with joint approvals by the Finance Secretary and President, backed by regular advisory audits.'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* DONATE / JOIN CALL TO ACTION */}
        <section aria-label="Join Call to Action" className="mt-12 sm:mt-16">
          <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 rounded-3xl p-6 sm:p-10 text-white text-center relative overflow-hidden shadow-xl border border-blue-800/40">
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-block p-2 rounded-2xl bg-white/10 border border-white/20 mb-3">
                <Building className="w-6 h-6 text-amber-300" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                {t('মানবকল্যাণে আপনিও হতে পারেন অংশীদার', 'Partner With Us in Social Welfare')}
              </h2>
              <p className="text-xs sm:text-sm text-blue-200 mb-6 leading-relaxed">
                {t(
                  'পলাশবাড়ী ইয়াং সোসাইটির মাধ্যমে অসহায় মানুষের পাশে দাঁড়াতে ও সমাজসেবামূলক কাজে অনুদান দিতে আমাদের সাথে যোগাযোগ করুন।',
                  'Support our humanitarian activities and donate to stand beside underprivileged communities in Birganj.'
                )}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/#contact"
                  className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 shadow-md flex items-center gap-2"
                >
                  <span>{t('যোগাযোগ ও অনুদান তথ্য', 'Contact & Donation Info')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/activities"
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all hover:scale-105 active:scale-95"
                >
                  {t('আমাদের কার্যক্রমসমূহ দেখুন', 'View Our Activities')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Official Receipt Modal */}
      <ReceiptModal
        transaction={selectedReceiptTxn}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />

      <Footer />
    </div>
  );
}
