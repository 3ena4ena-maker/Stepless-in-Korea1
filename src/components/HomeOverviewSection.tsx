import React from 'react';
import { 
  Baby, 
  Accessibility, 
  Luggage, 
  Compass, 
  ShieldCheck, 
  Train, 
  AlertCircle,
  FileCheck,
  ChevronRight,
  UtensilsCrossed,
  Building2,
  CheckCircle2,
  UserCheck,
  Calendar,
  AlertTriangle,
  Info,
  MapPin,
  Route,
  RefreshCw,
  Layers,
  Sparkles,
  HelpCircle,
  ArrowUpRight
} from 'lucide-react';
import { getTodayDateKR } from '../utils';
import StationSearchBar from './StationSearchBar';
import { DICTIONARY, Language } from '../i18n/dictionary';
import { STATIONS } from '../data';

interface HomeOverviewSectionProps {
  language?: Language;
  onSelectStation: (stationId: string) => void;
  onNavigateToSearch?: (query?: string) => void;
  onNavigateToReport?: () => void;
  onNavigateToNearby?: () => void;
  onNavigateToItinerary?: (category?: 'GOURMET' | 'EXPERIENCE' | 'DAY' | 'SUBWAY') => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onNavigateToAbout?: () => void;
}

export function HomeOverviewSection({
  language = 'KR',
  onSelectStation,
  onNavigateToSearch,
  onNavigateToReport,
  onNavigateToNearby,
  onNavigateToItinerary,
  onNavigateToAbout,
  searchQuery = '',
  setSearchQuery
}: HomeOverviewSectionProps) {
  
  const d = DICTIONARY[language];
  const [lineFilter, setLineFilter] = React.useState<string>('ALL');

  // Helper for metro line specific styles (supports line strings like '1', '2', '3', '4', '동해')
  const getLineTheme = (lineStr: string | number) => {
    const key = String(lineStr).trim();
    switch (key) {
      case '1':
        return {
          bg: 'bg-[#F06A00]',
          bgLight: 'bg-[#FFF4EC]',
          border: 'border-[#F06A00]/30',
          text: 'text-[#F06A00]',
          badgeBg: 'bg-[#F06A00]',
          badgeText: 'text-white',
        };
      case '2':
        return {
          bg: 'bg-[#1b6d24]',
          bgLight: 'bg-[#EDF7EE]',
          border: 'border-[#1b6d24]/30',
          text: 'text-[#1b6d24]',
          badgeBg: 'bg-[#1b6d24]',
          badgeText: 'text-white',
        };
      case '3':
        return {
          bg: 'bg-[#906A3B]',
          bgLight: 'bg-[#F8F3EC]',
          border: 'border-[#906A3B]/30',
          text: 'text-[#906A3B]',
          badgeBg: 'bg-[#906A3B]',
          badgeText: 'text-white',
        };
      case '4':
        return {
          bg: 'bg-[#2B60BA]',
          bgLight: 'bg-[#EEF4FD]',
          border: 'border-[#2B60BA]/30',
          text: 'text-[#2B60BA]',
          badgeBg: 'bg-[#2B60BA]',
          badgeText: 'text-white',
        };
      case '동해':
        return {
          bg: 'bg-[#003DA5]',
          bgLight: 'bg-[#EBF1FA]',
          border: 'border-[#003DA5]/30',
          text: 'text-[#003DA5]',
          badgeBg: 'bg-[#003DA5]',
          badgeText: 'text-white',
        };
      default:
        return {
          bg: 'bg-[#8EA85E]',
          bgLight: 'bg-[#F1EFEC]',
          border: 'border-[#E5E2DC]',
          text: 'text-[#8EA85E]',
          badgeBg: 'bg-[#8EA85E]',
          badgeText: 'text-white',
        };
    }
  };

  const filteredStations = STATIONS.filter(st => {
    if (lineFilter === 'ALL') return true;
    if (lineFilter === 'TRANSFER') return st.isTransferStation || st.lines.length > 1;
    return st.lines.includes(lineFilter);
  });


  // 4 Core Activity Courses (소프트 파스텔 톤 & 노-이모지 정갈한 디자인)
  const recommendedCourses = [
    {
      id: 'DAY' as const,
      icon: Compass,
      title: language === 'KR' ? '추천 여행 코스' : 'RECOMMENDED ITINERARY',
      tag: language === 'KR' ? '바다·투어' : 'OCEAN TRIP',
      desc: language === 'KR'
        ? '원도심·해운대·기장까지 알짜배기 힐링 명소 코스'
        : 'Curated itineraries for Haeundae, Nampo, and Gijang.',
      bg: 'bg-[#F3F8FB]',
      border: 'border-[#E1EDF5] hover:border-[#BED6E6]',
      iconBg: 'bg-[#E3EFF7]',
      iconColor: 'text-[#3B7291]',
      tagBg: 'bg-[#E3EFF7] text-[#3B7291]',
      btnBg: 'bg-white hover:bg-[#EAF3F8] border border-[#D5E5F0] text-[#2F5E78]',
      btnText: language === 'KR' ? '코스 보기' : 'Explore',
    },
    {
      id: 'SUBWAY' as const,
      icon: Train,
      title: language === 'KR' ? '지하철 무장애 코스' : 'STEP-FREE METRO ROUTE',
      tag: language === 'KR' ? '계단 ZERO' : 'STEP-FREE',
      desc: language === 'KR'
        ? '엘리베이터 출구로 턱 없이 편안하게 달리는 쾌속 동선'
        : 'Elevator exits and flat, step-free travel paths.',
      bg: 'bg-[#F4F8F3]',
      border: 'border-[#E1EEDF] hover:border-[#BFDBBB]',
      iconBg: 'bg-[#E5F1E2]',
      iconColor: 'text-[#4D7744]',
      tagBg: 'bg-[#E5F1E2] text-[#4D7744]',
      btnBg: 'bg-white hover:bg-[#ECF5E9] border border-[#D5E6CF] text-[#3C6134]',
      btnText: language === 'KR' ? '동선 확인' : 'Check Route',
    },
    {
      id: 'GOURMET' as const,
      icon: UtensilsCrossed,
      title: language === 'KR' ? '식도락 (부산 맛집)' : 'BUSAN FOOD GUIDE',
      tag: language === 'KR' ? '부산 미식' : 'FOODIE',
      desc: language === 'KR'
        ? '원조 돼지국밥 노포부터 감성 충만 오션뷰 카페까지'
        : 'Authentic pork soup eateries and oceanfront cafes.',
      bg: 'bg-[#FAF6F3]',
      border: 'border-[#F1E8DF] hover:border-[#E0D0BF]',
      iconBg: 'bg-[#F5ECE2]',
      iconColor: 'text-[#885A3B]',
      tagBg: 'bg-[#F5ECE2] text-[#885A3B]',
      btnBg: 'bg-white hover:bg-[#F8F1EB] border border-[#E9DDD0] text-[#6E462A]',
      btnText: language === 'KR' ? '맛집 보기' : 'View Eats',
    },
    {
      id: 'EXPERIENCE' as const,
      icon: Building2,
      title: language === 'KR' ? '체험 & 문화 공간' : 'CULTURE & MUSEUM',
      tag: language === 'KR' ? '문화·핫플' : 'HOT SPOTS',
      desc: language === 'KR'
        ? '국립해양박물관과 전시·예술 가득한 문화 명소'
        : 'Maritime museums, art galleries, and cultural centers.',
      bg: 'bg-[#F8F6FA]',
      border: 'border-[#ECE4F0] hover:border-[#D6C7DE]',
      iconBg: 'bg-[#F1E8F5]',
      iconColor: 'text-[#745084]',
      tagBg: 'bg-[#F1E8F5] text-[#745084]',
      btnBg: 'bg-white hover:bg-[#F5EDF8] border border-[#E3D4E8] text-[#5C3B6C]',
      btnText: language === 'KR' ? '공간 둘러보기' : 'Discover',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 text-left font-sans text-[#11161B]" id="home-overview-section">
      
      {/* ==========================================
          1. 3-SECOND TEST HERO SECTION (Impeccable & Focused)
         ========================================== */}
      <section className="pt-8 pb-10 sm:pt-14 sm:pb-16 text-center max-w-2xl mx-auto px-4">
        {/* Primary 3-Second Value Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-[#11161B] leading-tight break-keep mb-3 sm:mb-4">
          {language === 'KR' ? (
            <>
              계단 없는 부산여행<br />
              로컬 가이드 <span className="text-[#8EA85E]">스탭리스</span>와 함께
            </>
          ) : (
            <>
              Step-Free Busan Travel<br />
              With Local Guide <span className="text-[#8EA85E]">Stepless</span>
            </>
          )}
        </h1>

        {/* 1-Line Value Proposition (What's in it for me) */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 font-medium max-w-xl mx-auto mb-6 sm:mb-8 break-keep">
          {language === 'KR'
            ? '부산의 진짜 매력을 한눈에 느껴보세요!'
            : 'Experience the true charm of Busan at a glance!'}
        </p>

        {/* The Centerpiece Search Bar */}
        <div className="w-full shadow-lg shadow-slate-200/60 rounded-2xl">
          <StationSearchBar
            language={language}
            searchQuery={searchQuery || ''}
            setSearchQuery={(q) => setSearchQuery?.(q)}
            onSelectStation={(stId) => onSelectStation(stId)}
            onNavigateToSearch={onNavigateToSearch}
            placeholder={
              language === 'KR'
                ? '역 이름을 입력하세요 (예: 서면, 해운대, 부산역)'
                : 'Enter station name (e.g. Seomyeon, Haeundae, Busan)'
            }
          />
        </div>

        {/* Visual Bridge & Instant Call-to-Action to Station Buttons */}
        <div className="mt-4 sm:mt-5 flex items-center justify-center gap-1.5 text-xs font-bold text-[#6B853E] animate-bounce">
          <span>👇</span>
          <span>
            {language === 'KR' 
              ? '또는 아래 지하철역을 바로 눌러보세요' 
              : 'Or tap any metro station below'}
          </span>
        </div>
      </section>

      {/* ==========================================
          2. ALL STATIONS (COMPACT & CUTE SUBWAY TRAIN BUTTONS)
         ========================================== */}
      <section className="space-y-4 pt-4 border-t border-[#E5E2DC]" id="all-stations-section" aria-label="지하철역 바로가기">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E2DC] pb-3">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-[#0A2540] uppercase">
              {language === 'KR' ? '지하철역 바로가기' : 'METRO STATIONS'}
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-[#11161B] tracking-tight mt-0.5">
              {language === 'KR' ? '부산 지하철역 출구 & 이동 경로' : 'Accessible Busan Metro Stations'}
            </h2>
          </div>

          {/* Line Filter Chips */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 shrink-0" role="tablist" aria-label="호선 필터">
            {[
              { id: 'ALL', label: language === 'KR' ? `전체 (${STATIONS.length})` : `All (${STATIONS.length})` },
              { id: '1', label: language === 'KR' ? '1호선' : 'Line 1', color: 'bg-[#F06A00]' },
              { id: '2', label: language === 'KR' ? '2호선' : 'Line 2', color: 'bg-[#1b6d24]' },
              { id: '3', label: language === 'KR' ? '3호선' : 'Line 3', color: 'bg-[#906A3B]' },
              { id: '동해', label: language === 'KR' ? '동해선' : 'Donghae', color: 'bg-[#003DA5]' },
              { id: 'TRANSFER', label: language === 'KR' ? '환승역' : 'Transfer' },
            ].map(tab => {
              const isActive = lineFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setLineFilter(tab.id)}
                  role="tab"
                  aria-selected={isActive}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 shadow-2xs ${
                    isActive
                      ? 'bg-[#11161B] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {tab.color && (
                    <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${tab.color}`} />
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subway Station Buttons Grid: Mobile-optimized, compact, no color lines */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 sm:gap-2.5 pt-1">
          {filteredStations.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => onSelectStation(st.id)}
              aria-label={`${st.name} ${st.lines.join(', ')}호선 출구 안내`}
              className="group flex flex-col items-center justify-center bg-white hover:bg-[#F9F9F7] border border-slate-200/90 hover:border-[#8EA85E] rounded-xl py-2 px-1 sm:py-2.5 sm:px-2 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xs cursor-pointer text-center active:scale-95 min-h-[60px] sm:min-h-[68px]"
            >
              {/* Station Name */}
              <div className="font-extrabold text-[#11161B] text-xs sm:text-sm tracking-tight group-hover:text-[#8EA85E] transition-colors leading-tight truncate max-w-full">
                {st.name}
              </div>

              {/* Line Badges */}
              <div className="flex items-center justify-center gap-1 mt-1 flex-wrap">
                {st.lines.map((l) => {
                  const lineInfo = getLineTheme(l);
                  return (
                    <span 
                      key={l}
                      className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded text-white shadow-2xs ${lineInfo.bg}`}
                    >
                      {l === '동해' ? (language === 'KR' ? '동해선' : 'Donghae') : (language === 'KR' ? `${l}호선` : `Line ${l}`)}
                    </span>
                  );
                })}
              </div>
            </button>
          ))}
        </div>
      </section>


      {/* ==========================================
          3. ACTIVITY CATEGORY CARDS (부산에서 어디로 떠나볼까?)
         ========================================== */}
      <section className="space-y-4 pt-6 sm:pt-8 border-t border-[#E5E2DC]" id="activity-explore-section">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#11161B] tracking-tight">
            {language === 'KR' ? '부산에서 어디로 떠나볼까?' : 'Where Shall We Go in Busan?'}
          </h2>
        </div>

        {/* 4 Pastel Soft Activity Cards (모바일 2열 정사각형 박스) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-1">
          {recommendedCourses.map((course) => {
            const IconComponent = course.icon;
            return (
              <div 
                key={course.id}
                onClick={() => {
                  if (onNavigateToItinerary) {
                    onNavigateToItinerary(course.id);
                  }
                }}
                className={`${course.bg} border ${course.border} rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200 group shadow-2xs select-none aspect-square active:scale-95`}
              >
                {/* Top: Icon + Subtle Arrow */}
                <div className="flex items-start justify-between w-full">
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl ${course.iconBg} ${course.iconColor} flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs`}>
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/70 flex items-center justify-center text-slate-400 group-hover:text-[#11161B] group-hover:bg-white shadow-2xs transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                {/* Bottom: Title Only (부가설명 및 태그 삭제) */}
                <div>
                  <h3 className="font-extrabold text-[#11161B] text-xs sm:text-base group-hover:text-[#0A2540] transition-colors leading-snug break-keep">
                    {course.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* ==========================================
          4. COMPACT ABOUT & VERIFICATION BANNER
         ========================================== */}
      <section className="pt-4 border-t border-[#E5E2DC]" id="about-verification-banner">
        <div className="bg-[#FAF8F5] border border-[#EBE8E2] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-[#E5E2DC] text-[#6B853E] shadow-2xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#11161B]">
                {language === 'KR' ? '스텝리스 서비스 소개 및 공공데이터 검증' : 'About Stepless & Data Verification'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'KR'
                  ? '부산교통공사 공식 데이터 및 현장 실사를 기반으로 정기 검증됩니다.'
                  : 'Verified with Busan Transit Authority open data and regular on-site checks.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onNavigateToAbout) {
                onNavigateToAbout();
              }
            }}
            className="self-end sm:self-center shrink-0 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 hover:text-[#8EA85E] font-bold text-xs transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'KR' ? '자세히 보기' : 'Learn More'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

    </div>
  );
}
