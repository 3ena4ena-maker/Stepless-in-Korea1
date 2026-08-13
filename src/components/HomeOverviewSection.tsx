import React from 'react';
import { 
  Baby, 
  Accessibility, 
  Luggage, 
  Compass, 
  ShieldCheck, 
  Train, 
  ArrowRight, 
  AlertCircle,
  FileCheck,
  ChevronRight,
  UtensilsCrossed,
  Building2,
  CheckCircle2,
  UserCheck,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { getTodayDateKR } from '../utils';
import StationSearchBar from './StationSearchBar';
import { DICTIONARY, Language } from '../i18n/dictionary';

interface HomeOverviewSectionProps {
  language?: Language;
  onSelectStation: (stationId: string) => void;
  onNavigateToSearch?: (query?: string) => void;
  onNavigateToReport?: () => void;
  onNavigateToNearby?: () => void;
  onNavigateToItinerary?: (category?: 'GOURMET' | 'EXPERIENCE' | 'DAY' | 'SUBWAY') => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export function HomeOverviewSection({
  language = 'KR',
  onSelectStation,
  onNavigateToSearch,
  onNavigateToReport,
  onNavigateToNearby,
  onNavigateToItinerary,
  searchQuery = '',
  setSearchQuery
}: HomeOverviewSectionProps) {
  
  const d = DICTIONARY[language];

  // Featured major stations
  const featuredStations = [
    { 
      id: 'seomyeon', 
      name: language === 'KR' ? '서면역' : 'Seomyeon Station', 
      lines: [1, 2], 
      desc: language === 'KR' 
        ? '1·2호선 환승 중심역, 승강기 직통 출구 및 와이드 개찰구 연계 가이드' 
        : 'Major transfer hub for Lines 1 & 2 with direct elevator exits and wide barrier-free turnstiles.' 
    },
    { 
      id: 'busan-stn', 
      name: language === 'KR' ? '부산역' : 'Busan Station', 
      lines: [1], 
      desc: language === 'KR' 
        ? 'KTX·SRT 연계 핵심역, 대형 캐리어 및 유모차 이동에 최적화된 동선' 
        : 'Main KTX/SRT high-speed rail hub with optimized step-free routes for strollers and heavy luggage.' 
    },
    { 
      id: 'haeundae', 
      name: language === 'KR' ? '해운대역' : 'Haeundae Station', 
      lines: [2], 
      desc: language === 'KR' 
        ? '구남로 및 해수욕장 방향 엘리베이터 출구 및 휠체어 단차 없는 경로' 
        : 'Elevator exit directly connecting Gunam-ro beach main street with level wheelchair pathways.' 
    },
  ];

  // 4 Core Recommended Courses
  const recommendedCourses = [
    {
      id: 'GOURMET' as const,
      title: language === 'KR' ? '부산 맛집' : 'BUSAN FOOD GUIDE',
      tag: d.categories.eat.tag,
      desc: d.categories.eat.desc,
      icon: <UtensilsCrossed className="w-6 h-6 text-[#0A2540]" />,
    },
    {
      id: 'EXPERIENCE' as const,
      title: language === 'KR' ? '체험 & 문화 공간' : 'CULTURE & MUSEUM',
      tag: language === 'KR' ? '문화 체험' : 'CULTURE',
      desc: language === 'KR'
        ? '국립해양박물관부터 부산시립미술관까지 날씨 상관없이 엘리베이터로 편하게 즐기는 문화 공간'
        : 'Explore national maritime museums, art galleries, and cultural centers with step-free elevators.',
      icon: <Building2 className="w-6 h-6 text-[#0A2540]" />,
    },
    {
      id: 'DAY' as const,
      title: language === 'KR' ? '추천 여행 코스' : 'RECOMMENDED ITINERARY',
      tag: d.categories.explore.tag,
      desc: d.categories.explore.desc,
      icon: <Compass className="w-6 h-6 text-[#0A2540]" />,
    },
    {
      id: 'SUBWAY' as const,
      title: language === 'KR' ? '지하철 무장애 코스' : 'METRO STEP-FREE ROUTE',
      tag: d.categories.transit.tag,
      desc: d.categories.transit.desc,
      icon: <Train className="w-6 h-6 text-[#0A2540]" />,
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 text-left font-sans text-[#11161B]" id="home-overview-section">
      
      {/* ==========================================
          1. HERO SECTION (Editorial Layout)
         ========================================== */}
      <section className="relative pt-6 sm:pt-10 pb-10 sm:pb-16 border-b border-[#E5E2DC]">
        <div className="max-w-4xl space-y-4 sm:space-y-6">
          
          {/* Eyebrow caption */}
          <div className="inline-block text-xs font-mono font-bold tracking-widest text-[#0A2540] uppercase">
            {d.hero.eyebrow}
          </div>

          {/* Main Title - Language Specific Typography Scale */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-[#11161B] leading-[1.15]">
            {d.hero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-[#4A5568] font-normal leading-relaxed max-w-3xl pt-1 break-keep">
            {d.hero.subtitle}
          </p>

          {/* Call to action buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (onNavigateToItinerary) {
                  onNavigateToItinerary('GOURMET');
                }
              }}
              className="bg-[#11161B] hover:bg-[#0A2540] text-white px-6 py-3.5 rounded-lg font-semibold text-xs sm:text-sm tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>{d.hero.primaryBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (onNavigateToSearch) {
                  onNavigateToSearch();
                } else {
                  onSelectStation('');
                }
              }}
              className="border border-[#11161B] text-[#11161B] hover:bg-[#F1EFEC] px-6 py-3.5 rounded-lg font-semibold text-xs sm:text-sm tracking-wider transition-colors cursor-pointer"
            >
              <span>{d.hero.secondaryBtn}</span>
            </button>
          </div>
        </div>

        {/* 4 Feature Key Highlights (Minimalist 4-Column Grid) */}
        <div className="pt-10 sm:pt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 border-t border-[#E5E2DC] mt-10">
          <div className="space-y-1.5 p-4 rounded-lg bg-white border border-[#E5E2DC]">
            <div className="flex items-center gap-2 text-[#0A2540]">
              <Baby className="w-4 h-4" />
              <span className="font-bold text-xs sm:text-sm text-[#11161B]">
                {language === 'KR' ? '유모차 동반 승객' : 'Strollers & Families'}
              </span>
            </div>
            <p className="text-xs text-[#4A5568] leading-snug">
              {language === 'KR' ? '경사로와 엘리베이터 직통 출구' : 'Ramp & elevator direct exits'}
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-lg bg-white border border-[#E5E2DC]">
            <div className="flex items-center gap-2 text-[#0A2540]">
              <Accessibility className="w-4 h-4" />
              <span className="font-bold text-xs sm:text-sm text-[#11161B]">
                {language === 'KR' ? '휠체어·교통약자' : 'Wheelchair Friendly'}
              </span>
            </div>
            <p className="text-xs text-[#4A5568] leading-snug">
              {language === 'KR' ? '와이드 개찰구 및 단차 없는 경로' : 'Wide turnstiles & level routes'}
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-lg bg-white border border-[#E5E2DC]">
            <div className="flex items-center gap-2 text-[#0A2540]">
              <Luggage className="w-4 h-4" />
              <span className="font-bold text-xs sm:text-sm text-[#11161B]">
                {language === 'KR' ? '대형 캐리어 소지자' : 'Heavy Luggage'}
              </span>
            </div>
            <p className="text-xs text-[#4A5568] leading-snug">
              {language === 'KR' ? '계단 없이 엘리베이터 이용 출구' : 'Step-free elevator exit guide'}
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-lg bg-white border border-[#E5E2DC]">
            <div className="flex items-center gap-2 text-[#0A2540]">
              <FileCheck className="w-4 h-4" />
              <span className="font-bold text-xs sm:text-sm text-[#11161B]">
                {language === 'KR' ? '현장 직접 검증' : 'Field Verified'}
              </span>
            </div>
            <p className="text-xs text-[#4A5568] leading-snug">
              {language === 'KR' ? '직접 이동 실측 및 정기 검증' : 'Directly audited on-site'}
            </p>
          </div>
        </div>
      </section>


      {/* ==========================================
          2. CATEGORY INDEX (Where do you want to go?)
         ========================================== */}
      <section className="space-y-6 sm:space-y-8">
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold tracking-widest text-[#0A2540] uppercase">
            {language === 'KR' ? '카테고리 안내' : 'CATEGORY INDEX'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#11161B] tracking-tight">
            {d.categories.sectionTitle}
          </h2>
          <p className="text-sm text-[#4A5568]">
            {d.categories.sectionSubtitle}
          </p>
        </div>

        {/* 4 Category Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {recommendedCourses.map((course) => (
            <div 
              key={course.id}
              className="bg-white border border-[#E5E2DC] rounded-lg p-6 hover:border-[#0A2540] transition-colors flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-md bg-[#F1EFEC] text-[#0A2540]">
                    {course.icon}
                  </div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0A2540] bg-[#F1EFEC] px-2.5 py-1 rounded-md border border-[#E5E2DC]">
                    {course.tag}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-[#11161B] text-base group-hover:text-[#0A2540] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed line-clamp-3">
                    {course.desc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onNavigateToItinerary) {
                    onNavigateToItinerary(course.id);
                  }
                }}
                className="w-full py-2.5 px-4 rounded-md border border-[#11161B] hover:bg-[#11161B] hover:text-white text-[#11161B] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <span>{d.buttons.seeAll}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>


      {/* ==========================================
          3. FEATURED STATIONS (Station Guides)
         ========================================== */}
      <section className="space-y-6 pt-6 border-t border-[#E5E2DC]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E2DC] pb-4">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-[#0A2540] uppercase">
              {language === 'KR' ? '주요역 안내' : 'FEATURED STATIONS'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#11161B] tracking-tight mt-1">
              {language === 'KR' ? '부산 주요역 출구 & 이동 경로' : 'Major Accessible Metro Hubs'}
            </h2>
          </div>
          
          <button
            onClick={() => {
              if (onNavigateToSearch) {
                onNavigateToSearch();
              } else {
                onSelectStation('');
              }
            }}
            className="text-xs font-bold text-[#0A2540] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{d.buttons.seeAll}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Featured Station Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {featuredStations.map((st) => (
            <div 
              key={st.id}
              className="bg-white border border-[#E5E2DC] hover:border-[#0A2540] rounded-lg p-5 transition-colors flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-3">
                  <div className="flex items-center gap-2">
                    <Train className="w-5 h-5 text-[#0A2540]" />
                    <span className="font-bold text-[#11161B] text-base">{st.name}</span>
                  </div>
                  <div className="flex gap-1">
                    {st.lines.map((l) => (
                      <span key={l} className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F1EFEC] text-[#0A2540]">
                        {language === 'KR' ? `${l}호선` : `Line ${l}`}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#4A5568] leading-relaxed">
                  {st.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectStation(st.id)}
                className="w-full py-2.5 px-3 rounded-md bg-[#11161B] hover:bg-[#0A2540] text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{d.buttons.viewRoute}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>


      {/* ==========================================
          4. UTILITY & SEARCH BAR SECTION
         ========================================== */}
      <section className="bg-white border border-[#E5E2DC] rounded-lg p-6 sm:p-8 space-y-4">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold tracking-widest text-[#0A2540] uppercase">
            {language === 'KR' ? '스마트 검색' : 'SMART TRANSIT SEARCH'}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#11161B]">
            {d.utility.sectionTitle}
          </h2>
        </div>

        <div className="max-w-xl space-y-3">
          <StationSearchBar
            language={language}
            searchQuery={searchQuery || ''}
            setSearchQuery={(q) => setSearchQuery?.(q)}
            onSelectStation={(stId) => onSelectStation(stId)}
            onNavigateToSearch={onNavigateToSearch}
          />

          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="font-mono text-[#0A2540] font-bold shrink-0">
              {language === 'KR' ? '주요역 바로가기:' : 'Quick Select:'}
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {featuredStations.map((st) => (
                <button
                  key={`quick-${st.id}`}
                  type="button"
                  onClick={() => onSelectStation(st.id)}
                  className="px-2.5 py-1 rounded bg-[#F1EFEC] hover:bg-[#E5E2DC] text-[#11161B] font-semibold text-xs transition-colors whitespace-nowrap"
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ==========================================
          5. SERVICE INFORMATION & VERIFICATION CENTER
         ========================================== */}
      <section className="pt-8 border-t border-[#E5E2DC] space-y-6">
        <div className="flex items-center gap-2 text-[#0A2540]">
          <ShieldCheck className="w-5 h-5" />
          <h2 className="text-lg font-bold text-[#11161B]">
            {language === 'KR' ? '정보 신뢰성 및 검증 안내' : 'Information Reliability & Verification'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#4A5568]">
          <div className="p-5 rounded-lg bg-white border border-[#E5E2DC] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#11161B]">
              <UserCheck className="w-4 h-4 text-[#0A2540]" />
              <span>{language === 'KR' ? '현장 직접 실측 조사' : 'Direct Field Audits'}</span>
            </div>
            <p className="leading-relaxed">
              {language === 'KR'
                ? '공공데이터에 그치지 않고 서면, 부산역, 해운대 등 주요역의 출구 단차와 엘리베이터 동선을 현장에서 직접 계측하여 제공합니다.'
                : 'Beyond open data, our team physically measures platform gaps, elevator pathways, and exit steps at major stations.'}
            </p>
          </div>

          <div className="p-5 rounded-lg bg-white border border-[#E5E2DC] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#11161B]">
              <AlertTriangle className="w-4 h-4 text-[#0A2540]" />
              <span>{language === 'KR' ? '오류 제보 및 현행화' : 'Issue Reporting & Updates'}</span>
            </div>
            <p className="leading-relaxed">
              {language === 'KR'
                ? '엘리베이터 보수 점검이나 공사로 인한 단차가 발생할 경우 유저 제보를 반영하여 매일 정정하고 업데이트합니다.'
                : 'Station elevator maintenance or route changes are updated daily based on user field reports.'}
            </p>
            {onNavigateToReport && (
              <button
                onClick={onNavigateToReport}
                className="mt-2 text-xs font-bold text-[#0A2540] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{language === 'KR' ? '오류/고장 제보하기' : 'Report an Issue'}</span>
              </button>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
