import React from 'react';
import { 
  Accessibility, 
  Luggage, 
  Compass, 
  ShieldCheck, 
  Train, 
  ChevronRight,
  UtensilsCrossed,
  Building2,
  ArrowUpRight
} from 'lucide-react';
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
  onNavigateToGuide?: (subPage: 'transit' | 'child-free' | 'bus-qr' | 'taxi' | 'exploration' | 'schedule' | 'barrier-free') => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onNavigateToAbout?: () => void;
}

export function HomeOverviewSection({
  language = 'KR',
  onSelectStation,
  onNavigateToSearch,
  onNavigateToItinerary,
  onNavigateToGuide,
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
      href: '/tips/courses/day',
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
      href: '/tips/courses/subway',
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
      href: '/tips/courses/gourmet',
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
      href: '/tips/courses/experience',
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

        {/* Subway Station Links Grid: Mobile-optimized, compact, crawler-friendly <a> tags */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 sm:gap-2.5 pt-1">
          {filteredStations.map((st) => (
            <a
              key={st.id}
              href={`/station/${st.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectStation(st.id);
              }}
              aria-label={`${st.name} ${st.lines.join(', ')}호선 출구 안내`}
              className="group flex flex-col items-center justify-center bg-white hover:bg-[#F9F9F7] border border-slate-200/90 hover:border-[#8EA85E] rounded-xl py-2 px-1 sm:py-2.5 sm:px-2 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xs cursor-pointer text-center active:scale-95 min-h-[60px] sm:min-h-[68px] no-underline"
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
            </a>
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

        {/* 4 Pastel Soft Activity Cards (Crawler-friendly <a> tags with subtitle description) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5 pt-1">
          {recommendedCourses.map((course) => {
            const IconComponent = course.icon;
            return (
              <a 
                key={course.id}
                href={course.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateToItinerary) {
                    onNavigateToItinerary(course.id);
                  }
                }}
                className={`${course.bg} border ${course.border} rounded-2xl p-2.5 sm:p-3.5 flex items-center gap-2 sm:gap-2.5 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group shadow-2xs select-none active:scale-95 min-h-[58px] sm:min-h-[68px] no-underline`}
              >
                {/* Left: Icon */}
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${course.iconBg} ${course.iconColor} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs`}>
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Right: Title & Description next to Icon */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-[#11161B] text-xs sm:text-sm md:text-[15px] group-hover:text-[#0A2540] transition-colors leading-tight break-keep">
                    {course.title}
                  </h3>
                  <p className="hidden sm:block text-[11px] text-slate-500 mt-0.5 line-clamp-1 break-keep">
                    {course.desc}
                  </p>
                </div>

                {/* Far Right: Arrow */}
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/70 flex items-center justify-center text-slate-400 group-hover:text-[#11161B] group-hover:bg-white shadow-2xs transition-all shrink-0">
                  <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </section>


      {/* ==========================================
          4. COMPACT 3-PILLAR GUIDE (심플 2~3줄 요약 카드 · AdSense 본문 충족)
         ========================================== */}
      <section 
        className="space-y-3 pt-6 sm:pt-8 border-t border-[#E5E2DC]" 
        id="editorial-guide-section"
        aria-label={language === 'KR' ? '부산 무장애 여행 핵심 가이드' : 'Busan Step-Free Travel Core Guide'}
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <h2 className="text-base sm:text-lg font-black text-[#11161B] tracking-tight">
            {language === 'KR' 
              ? '계단 없는 부산여행 핵심 포인트' 
              : 'Key Points for Step-Free Busan Travel'}
          </h2>
          <p className="text-xs text-slate-500 break-keep">
            {language === 'KR'
              ? '휠체어·유모차·캐리어 여행객을 위한 부산 지하철 및 무장애 이동 기준입니다.'
              : 'Essential step-free transit and accessibility standards for Busan travelers.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3.5">
          {/* Card 1 */}
          <a
            href="/tips/courses/subway"
            onClick={(e) => {
              e.preventDefault();
              onNavigateToItinerary?.('SUBWAY');
            }}
            className="bg-white hover:bg-[#FAF9F6] border border-[#E5E2DC] hover:border-[#8EA85E] rounded-2xl p-3.5 sm:p-4 transition-all space-y-1.5 shadow-2xs no-underline group"
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#EDF4E3] text-[#5B7332] shrink-0">
                <Train className="w-3.5 h-3.5" />
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-[#11161B] group-hover:text-[#6B853E] transition-colors">
                {language === 'KR' ? '주요 환승역 1동선 엘리베이터' : 'Direct Station Elevators'}
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed break-keep">
              {language === 'KR'
                ? '서면역(7·11·12·13번), 부산역(4·6번), 해운대역(1·3번), 광안역(3·5번) 등 15개 주요 역사의 승강장부터 지상 보도까지 계단 없이 직결되는 엘리베이터 출구 번호를 안내합니다.'
                : 'Find direct platform-to-street elevator exits across 15 major stations including Seomyeon, Busan Station, Haeundae, and Gwangan.'}
            </p>
          </a>

          {/* Card 2 */}
          <a
            href="/barrier-free"
            onClick={(e) => {
              e.preventDefault();
              onNavigateToGuide?.('barrier-free');
            }}
            className="bg-white hover:bg-[#FAF9F6] border border-[#E5E2DC] hover:border-[#8EA85E] rounded-2xl p-3.5 sm:p-4 transition-all space-y-1.5 shadow-2xs no-underline group"
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#E8F2F8] text-[#2F668A] shrink-0">
                <Accessibility className="w-3.5 h-3.5" />
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-[#11161B] group-hover:text-[#2F668A] transition-colors">
                {language === 'KR' ? '유모차·휠체어 권역별 평지 동선' : 'Flat Regional Boardwalks'}
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed break-keep">
              {language === 'KR'
                ? '해운대·동백섬 우든 데크길과 다대포 생태탐방로, 자갈치·국제시장 평지 아케이드 및 국립해양박물관 등 단차 없이 쾌적하게 둘러볼 수 있는 열린관광지 코스를 선별했습니다.'
                : 'Explore step-free coastal boardwalks at Haeundae & Dadaepo, flat market arcades in Nampo, and barrier-free museums.'}
            </p>
          </a>

          {/* Card 3 */}
          <a
            href="/tips/transit"
            onClick={(e) => {
              e.preventDefault();
              onNavigateToGuide?.('transit');
            }}
            className="bg-white hover:bg-[#FAF9F6] border border-[#E5E2DC] hover:border-[#8EA85E] rounded-2xl p-3.5 sm:p-4 transition-all space-y-1.5 shadow-2xs no-underline group"
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#F7EFE6] text-[#855834] shrink-0">
                <Luggage className="w-3.5 h-3.5" />
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-[#11161B] group-hover:text-[#855834] transition-colors">
                {language === 'KR' ? '무료 환승·어린이 혜택 & 캐리어 팁' : 'Free Transfers & Luggage Tips'}
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed break-keep">
              {language === 'KR'
                ? '하차 후 30분 이내 도시철도·버스 무료 환승(최대 2회), 만 6~12세 어린이 요금 무료 혜택, 시내버스 QR 결제 및 28인치 이상 대형 캐리어 물품보관함(T-Luggage) 정보를 제공합니다.'
                : 'Learn about 30-minute free transit transfers, free fares for children aged 6–12, bus QR payment, and metro luggage lockers.'}
            </p>
          </a>
        </div>
      </section>


      {/* ==========================================
          5. COMPACT ABOUT & VERIFICATION BANNER
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

          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateToAbout) {
                onNavigateToAbout();
              }
            }}
            className="self-end sm:self-center shrink-0 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 hover:text-[#8EA85E] font-bold text-xs transition-colors shadow-2xs flex items-center gap-1 cursor-pointer no-underline"
          >
            <span>{language === 'KR' ? '자세히 보기' : 'Learn More'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

    </div>
  );
}
