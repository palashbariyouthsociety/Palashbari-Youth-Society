'use client';

import { useLang } from '@/context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandHoldingHeart,
  faHouseUser,
  faUsers,
  faShieldHalved,
  faBullhorn,
  faBookOpen,
  faGraduationCap,
  faDroplet,
  faTree,
  faBroom,
  faLifeRing,
  faGift,
  faHandshake,
  faLightbulb,
  faScaleBalanced,
  faBullseye,
} from '@fortawesome/free-solid-svg-icons';

export default function MissionSection() {
  const { t, lang } = useLang();

  const toBengaliNumber = (num: number) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num
      .toString()
      .padStart(2, '0')
      .split('')
      .map((d) => bnDigits[parseInt(d, 10)] || d)
      .join('');
  };

  const goals = [
    {
      icon: faHandHoldingHeart,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200',
      bn: 'মানবতার সেবায় কাজ করা।',
      en: 'Working wholeheartedly in the service of humanity.',
    },
    {
      icon: faHouseUser,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
      bn: 'অসহায়, দরিদ্র ও সুবিধাবঞ্চিত মানুষের পাশে দাঁড়ানো।',
      en: 'Standing beside the helpless, poor, and underprivileged.',
    },
    {
      icon: faUsers,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
      bn: 'যুবসমাজকে সামাজিক কাজে সম্পৃক্ত করা।',
      en: 'Engaging the youth in meaningful social and development work.',
    },
    {
      icon: faShieldHalved,
      color: 'text-red-600',
      bg: 'bg-red-50 border-red-200',
      bn: 'মাদকমুক্ত সমাজ গঠনে কার্যকর ভূমিকা রাখা।',
      en: 'Playing an active role in building a drug-free society.',
    },
    {
      icon: faBullhorn,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50 border-cyan-200',
      bn: 'অপরাধ ও সামাজিক অবক্ষয়ের বিরুদ্ধে জনসচেতনতা সৃষ্টি করা।',
      en: 'Raising public awareness against crime and social decay.',
    },
    {
      icon: faBookOpen,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
      bn: 'শিক্ষা বিস্তারে আন্তরিক সহযোগিতা প্রদান করা।',
      en: 'Extending active cooperation in the promotion of education.',
    },
    {
      icon: faGraduationCap,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-200',
      bn: 'মেধাবী ও অসহায় শিক্ষার্থীদের পড়াশোনায় সহায়তা করা।',
      en: 'Assisting talented and needy students with educational resources.',
    },
    {
      icon: faDroplet,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200',
      bn: 'স্বেচ্ছায় রক্তদান এবং জরুরি রক্তের ব্যবস্থা করা।',
      en: 'Facilitating voluntary blood donation and emergency blood supply.',
    },
    {
      icon: faTree,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
      bn: 'ব্যাপক বৃক্ষরোপণ ও পরিবেশ সংরক্ষণে উদ্যোগ গ্রহণ।',
      en: 'Undertaking tree plantation and environmental conservation drives.',
    },
    {
      icon: faBroom,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
      bn: 'রাস্তা, মসজিদ, কবরস্থান ও জনসমাগম স্থানে পরিচ্ছন্নতা অভিযান।',
      en: 'Conducting cleanliness drives at public roads, mosques, and shared areas.',
    },
    {
      icon: faLifeRing,
      color: 'text-orange-600',
      bg: 'bg-orange-50 border-orange-200',
      bn: 'বন্যা, শীত বা যেকোনো দুর্যোগে ত্রাণ ও পুনর্বাসন সহায়তা।',
      en: 'Standing with disaster victims with immediate relief and rehabilitation.',
    },
    {
      icon: faGift,
      color: 'text-purple-600',
      bg: 'bg-purple-50 border-purple-200',
      bn: 'শীতবস্ত্র, খাদ্যসামগ্রী ও জরুরি নিত্যপ্রয়োজনীয় দ্রব্য বিতরণ।',
      en: 'Distributing warm winter clothes, relief food, and essential commodities.',
    },
    {
      icon: faHandshake,
      color: 'text-teal-600',
      bg: 'bg-teal-50 border-teal-200',
      bn: 'পারস্পরিক সামাজিক সম্প্রীতি ও ভ্রাতৃত্ববোধ বৃদ্ধি করা।',
      en: 'Strengthening community harmony, mutual empathy, and brotherhood.',
    },
    {
      icon: faLightbulb,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50 border-yellow-200',
      bn: 'তরুণদের পেশাগত দক্ষতা ও নেতৃত্বের গুণাবলি বিকাশে কর্মশালা।',
      en: 'Fostering practical skills, career development, and leadership qualities.',
    },
    {
      icon: faScaleBalanced,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
      bn: 'সমাজে ন্যায়পরায়ণতা, সততা, শৃঙ্খলা ও মানবিক মূল্যবোধ সুপ্রতিষ্ঠা।',
      en: 'Upholding justice, integrity, discipline, and moral values in society.',
    },
  ];

  return (
    <section id="mission" className="py-20 md:py-28 bg-[#f8fafc] relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <FontAwesomeIcon icon={faBullseye} className="text-xs text-amber-500" />
            <span>{t('ধারা–৬ : উদ্দেশ্য ও লক্ষ্য', 'Article 6: Purpose & Objectives')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            {t('সংগঠনের ', 'Organizational ')}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              {t('লক্ষ্য ও উদ্দেশ্য', 'Mission & Vision')}
            </span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t(
              'গঠনতন্ত্রের ধারা–৬ অনুযায়ী সমাজের সার্বিক উন্নয়নে আমাদের ১৫টি সুনির্দিষ্ট কর্মপরিকল্পনা।',
              'Our 15 dedicated action goals for comprehensive community welfare under Article 6.'
            )}
          </p>
        </div>

        {/* 15 Goals Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {goals.map((goal, idx) => {
            const goalBadge =
              lang === 'bn'
                ? `লক্ষ্য ${toBengaliNumber(idx + 1)}`
                : `Goal ${String(idx + 1).padStart(2, '0')}`;

            return (
              <div
                key={idx}
                className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-300 hover:-translate-y-1 shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Clean Top Bar: Font Awesome icon and matched height badge */}
                  <div className="flex items-center justify-between gap-3 mb-3.5">
                    <div
                      className={`w-7 h-7 rounded-lg ${goal.bg} border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
                    >
                      <FontAwesomeIcon
                        icon={goal.icon}
                        className={`text-xs ${goal.color}`}
                      />
                    </div>
                    <span className="h-7 inline-flex items-center text-[11px] font-semibold px-2.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 tracking-wider">
                      {goalBadge}
                    </span>
                  </div>

                  {/* Clean readable text popping out */}
                  <p className="text-slate-800 text-sm font-semibold leading-relaxed group-hover:text-blue-900 transition-colors">
                    {t(goal.bn, goal.en)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
