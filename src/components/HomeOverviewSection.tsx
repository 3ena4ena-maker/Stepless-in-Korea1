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
          2. FEATURED STATIONS (Station Guides)
         ========================================== */}
      <section className="space-y-6">
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
          3. CATEGORY INDEX (Where do you want to go?)
         ========================================== */}
      <section className="space-y-6 sm:space-y-8 pt-6 border-t border-[#E5E2DC]">
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
      <section className="pt-10 border-t border-[#E5E2DC] space-y-10">
        {/* Section Header */}
        <div className="space-y-1.5 border-b border-[#E5E2DC] pb-4">
          <div className="text-xs font-mono font-bold tracking-widest text-[#0A2540] uppercase">
            {language === 'KR' ? '서비스 안내 · 정보 검증' : 'SERVICE & RELIABILITY'}
          </div>
          <div className="flex items-center gap-2.5 text-[#0A2540]">
            <ShieldCheck className="w-6 h-6 text-[#0A2540] shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#11161B] tracking-tight">
              {language === 'KR' ? '스탭리스 안내 및 정보 검증' : 'About Stepless in Korea & Verification'}
            </h2>
          </div>
        </div>

        {/* 1. What is Stepless in Korea? */}
        <div className="bg-white border border-[#E5E2DC] rounded-lg p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-[#0A2540]">
            <Info className="w-5 h-5 text-[#0A2540] shrink-0" />
            <h3 className="text-lg sm:text-xl font-bold text-[#11161B]">
              {language === 'KR' ? '스탭리스 인 코리아는 어떤 서비스인가요?' : 'What is Stepless in Korea?'}
            </h3>
          </div>
          <div className="space-y-3 text-sm text-[#4A5568] leading-relaxed">
            <p>
              {language === 'KR'
                ? '스탭리스 인 코리아(STEPLESS IN KOREA)는 부산을 여행하는 누구나 보다 편하고 안전하게 이동할 수 있도록 여행지, 대중교통, 지하철역 출구, 엘리베이터 동선, 수하물 보관 및 여행 코스 등의 정보를 한곳에서 제공하는 종합 여행 안내 서비스입니다.'
                : 'STEPLESS IN KOREA is a comprehensive travel guide service that integrates information on destinations, public transit, subway station exits, elevator routes, luggage storage, and recommended itineraries into one unified platform for anyone traveling in Busan.'}
            </p>
            <p>
              {language === 'KR'
                ? '캐리어를 가지고 여행하는 방문객, 유모차를 이용하는 가족, 휠체어 이용자뿐만 아니라 가파른 계단이나 복잡한 이동 동선을 피하고 싶은 모든 여행자가 부산을 보다 쾌적하게 탐방할 수 있도록 실제 이동에 필요한 정보를 현장 중심으로 안내합니다.'
                : 'Designed not only for wheelchair users or families with strollers, but also for travelers with heavy luggage or anyone wishing to avoid steep staircases and complex detours, our service focuses on practical, movement-centered information to ensure a smoother Busan experience.'}
            </p>
          </div>

          <div className="pt-4 border-t border-[#E5E2DC] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-[#11161B]">
            <div className="flex items-start gap-2.5 p-3 rounded bg-[#FBFBF9] border border-[#E5E2DC]">
              <CheckCircle2 className="w-4 h-4 text-[#0A2540] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#11161B]">
                  {language === 'KR' ? '모두를 위한 무장애 이동' : 'Universal Barrier-Free Mobility'}
                </span>
                <span className="text-[#4A5568] text-[11px] leading-tight block mt-0.5">
                  {language === 'KR' ? '단차와 계단을 최소화한 이동 정보' : 'Minimizing steps, stairs, and steep obstacles'}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded bg-[#FBFBF9] border border-[#E5E2DC]">
              <CheckCircle2 className="w-4 h-4 text-[#0A2540] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#11161B]">
                  {language === 'KR' ? '현장 중심 동선 가이드' : 'On-Site Practical Focus'}
                </span>
                <span className="text-[#4A5568] text-[11px] leading-tight block mt-0.5">
                  {language === 'KR' ? '실제 출구 및 엘리베이터 동선 연계' : 'Connecting exit numbers directly to elevator paths'}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded bg-[#FBFBF9] border border-[#E5E2DC]">
              <CheckCircle2 className="w-4 h-4 text-[#0A2540] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#11161B]">
                  {language === 'KR' ? '통합 여행 네트워크' : 'Integrated Transit Network'}
                </span>
                <span className="text-[#4A5568] text-[11px] leading-tight block mt-0.5">
                  {language === 'KR' ? '교통, 수하물, 코스를 한곳에서' : 'Subway, luggage, and itineraries in one place'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Comprehensive Busan Travel Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#0A2540]">
            <Layers className="w-5 h-5 text-[#0A2540] shrink-0" />
            <h3 className="text-lg sm:text-xl font-bold text-[#11161B]">
              {language === 'KR' ? '부산 여행에 필요한 정보를 한곳에서' : 'Comprehensive Busan Travel Information'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* ① 지하철역 및 출구 정보 */}
            <div className="p-5 rounded-lg bg-white border border-[#E5E2DC] space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-[#11161B]">
                  <Train className="w-4 h-4 text-[#0A2540] shrink-0" />
                  <span>{language === 'KR' ? '지하철역 및 출구 정보' : 'Subway Stations & Exit Details'}</span>
                </div>
                <p className="text-[#4A5568] leading-relaxed">
                  {language === 'KR'
                    ? '부산 주요 도시철도 역의 주요 출구 위치, 엘리베이터 및 에스컬레이터 설치 현황, 캐리어 수하물 이동 동선 및 주변 관광지 연계 정보를 안내합니다.'
                    : 'Detailed elevator & escalator exit locations, luggage paths, and seamless connections to neighboring attractions across Busan subway lines.'}
                </p>
              </div>
            </div>

            {/* ② 무장애 여행 정보 */}
            <div className="p-5 rounded-lg bg-white border border-[#E5E2DC] space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-[#11161B]">
                  <Accessibility className="w-4 h-4 text-[#0A2540] shrink-0" />
                  <span>{language === 'KR' ? '무장애 여행 정보' : 'Barrier-Free Travel Insights'}</span>
                </div>
                <p className="text-[#4A5568] leading-relaxed">
                  {language === 'KR'
                    ? '계단 없이 진입할 수 있는 장소, 엘리베이터 이용 편의성, 유모차 및 휠체어 이용 시 사전 확인이 필요한 동선 특성을 체계적으로 제공합니다.'
                    : 'Step-free access venues, elevator availability, and crucial mobility notes tailored for strollers, wheelchairs, and senior travelers.'}
                </p>
              </div>
            </div>

            {/* ③ 여행 코스 및 지역 정보 */}
            <div className="p-5 rounded-lg bg-white border border-[#E5E2DC] space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-[#11161B]">
                  <Route className="w-4 h-4 text-[#0A2540] shrink-0" />
                  <span>{language === 'KR' ? '여행 코스 및 지역 정보' : 'Itineraries & Regional Guides'}</span>
                </div>
                <p className="text-[#4A5568] leading-relaxed">
                  {language === 'KR'
                    ? '부산 권역별 맞춤 추천 코스, 식도락·문화·바다 산책 등 다채로운 테마, 실제 이동 시간을 반영한 실용적인 동선 구성을 안내합니다.'
                    : 'Curated regional travel routes, gourmet and cultural themes, and realistic movement schedules considering physical walking comfort.'}
                </p>
              </div>
            </div>

            {/* ④ 대중교통 및 여행 팁 */}
            <div className="p-5 rounded-lg bg-white border border-[#E5E2DC] space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-[#11161B]">
                  <Compass className="w-4 h-4 text-[#0A2540] shrink-0" />
                  <span>{language === 'KR' ? '대중교통 및 여행 팁' : 'Transit & Practical Travel Tips'}</span>
                </div>
                <p className="text-[#4A5568] leading-relaxed">
                  {language === 'KR'
                    ? '부산 대중교통 이용 안내, 효율적인 환승 노하우, 역내 수하물 보관함 정보, 주요 행사 및 부산 여행 실시간 팁을 제공합니다.'
                    : 'Transit tips, transfer guides, station luggage storage locations, luggage delivery services, and season-specific Busan travel advice.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. How We Verify Information */}
        <div className="bg-[#FBFBF9] border border-[#E5E2DC] rounded-lg p-6 sm:p-8 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#0A2540]">
              <FileCheck className="w-5 h-5 text-[#0A2540] shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold text-[#11161B]">
                {language === 'KR' ? '정보는 어떻게 확인하나요?' : 'How We Verify Information'}
              </h3>
            </div>
            <p className="text-sm text-[#4A5568] leading-relaxed max-w-4xl">
              {language === 'KR'
                ? '스탭리스 인 코리아는 공공 관광 데이터와 교통 관련 정보를 활용하는 동시에, 여행자가 실제 현장에서 활용할 수 있는 이동 정보를 제공하기 위해 주요 장소와 지하철역의 정보를 지속적으로 확인하고 관리합니다.'
                : 'STEPLESS IN KOREA combines public open tourism data and transit records with continuous field verification and management to ensure reliable, movement-focused information for real-world travelers.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#4A5568] pt-2">
            {/* ① 공공 관광 데이터 활용 */}
            <div className="p-5 rounded bg-white border border-[#E5E2DC] space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-[#11161B]">
                <CheckCircle2 className="w-4 h-4 text-[#0A2540] shrink-0" />
                <span>{language === 'KR' ? '공공 관광 데이터 활용' : 'Public Tourism Data Integration'}</span>
              </div>
              <p className="leading-relaxed">
                {language === 'KR'
                  ? '한국관광공사 TourAPI 등 신뢰성 있는 공공 기관의 관광 데이터를 기반으로 부산 내 주요 관광지, 식당, 문화시설의 인프라 및 무장애 기본 정보를 수집 및 정리합니다.'
                  : 'We organize baseline destination details, dining spots, and cultural venues using official public APIs provided by Korea Tourism Organization (TourAPI).'}
              </p>
            </div>

            {/* ② 교통 정보 확인 */}
            <div className="p-5 rounded bg-white border border-[#E5E2DC] space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-[#11161B]">
                <Train className="w-4 h-4 text-[#0A2540] shrink-0" />
                <span>{language === 'KR' ? '교통 정보 확인' : 'Transit System Audit'}</span>
              </div>
              <p className="leading-relaxed">
                {language === 'KR'
                  ? '부산 도시철도 및 대중교통 관련 공식 데이터 자료를 기초로 주요 역별 출구 번호, 엘리베이터 및 에스컬레이터 운행 위치 등 이동 필수 정보를 체계화합니다.'
                  : 'Based on official Busan Transportation Corporation datasets, we index station exit numbers, elevator coordinates, and escalator operations.'}
              </p>
            </div>

            {/* ③ 현장 직접 확인 */}
            <div className="p-5 rounded bg-white border border-[#E5E2DC] space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-[#11161B]">
                <UserCheck className="w-4 h-4 text-[#0A2540] shrink-0" />
                <span>{language === 'KR' ? '현장 직접 확인' : 'On-Site Field Verification'}</span>
              </div>
              <p className="leading-relaxed">
                {language === 'KR'
                  ? '공공데이터에만 의존하지 않고 서면, 부산역, 해운대 등 이동량이 많은 주요 거점 지역의 출구 단차와 엘리베이터 실제 동선을 현장에서 확인하여 실질적인 정보를 보완합니다.'
                  : 'Beyond open datasets, our team conducts physical field audits at high-traffic hubs like Seomyeon, Busan Station, and Haeundae to double-check step heights and elevator pathways.'}
              </p>
            </div>

            {/* ④ 지속적인 업데이트 */}
            <div className="p-5 rounded bg-white border border-[#E5E2DC] space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-[#11161B]">
                <RefreshCw className="w-4 h-4 text-[#0A2540] shrink-0" />
                <span>{language === 'KR' ? '지속적인 정정 및 업데이트' : 'Continuous Updates'}</span>
              </div>
              <p className="leading-relaxed">
                {language === 'KR'
                  ? '엘리베이터 정기 점검, 역내 공사, 현장 환경 변경 등 가변적인 요소를 지속해서 모니터링하고 정정하여 현행화된 상태를 유지하도록 관리합니다.'
                  : 'We continuously monitor facility maintenance, station construction, and route adjustments to update our database and maintain data freshness.'}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Why Stepless in Korea */}
        <div className="bg-white border border-[#E5E2DC] rounded-lg p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-[#0A2540]">
            <Sparkles className="w-5 h-5 text-[#0A2540] shrink-0" />
            <h3 className="text-lg sm:text-xl font-bold text-[#11161B]">
              {language === 'KR' ? 'STEPLESS IN KOREA가 다른 여행 정보와 다른 점' : 'Why Stepless in Korea?'}
            </h3>
          </div>
          <div className="space-y-2 text-sm text-[#4A5568] leading-relaxed">
            <p className="font-semibold text-[#11161B]">
              {language === 'KR'
                ? "일반적인 여행 정보가 '어디에 갈 것인가'에 집중한다면, STEPLESS IN KOREA는 '어떻게 편하게 이동할 것인가'까지 함께 안내합니다."
                : "While standard travel portals focus strictly on 'where to go', STEPLESS IN KOREA guides you on 'how to get there comfortably'."}
            </p>
            <p>
              {language === 'KR'
                ? '여행지의 위치뿐만 아니라 지하철역 출구와 엘리베이터, 이동 동선, 수하물 보관, 대중교통 이용 방법, 여행 코스까지 연계하여 여행자가 실제 부산 여행을 계획하고 이동하는 과정에서 필요한 제반 정보를 한곳에서 손쉽게 확인할 수 있도록 통합 설계되었습니다.'
                : 'By connecting destination highlights directly with subway exit elevators, luggage storage, transit steps, and mobility-friendly itineraries, we empower travelers to plan and navigate Busan seamlessly from start to finish.'}
            </p>
          </div>
        </div>

        {/* 5. Field Conditions May Change & Issue Reporting */}
        <div className="p-6 rounded-lg bg-white border border-[#E5E2DC] space-y-4">
          <div className="flex items-center gap-2 text-[#0A2540]">
            <AlertTriangle className="w-5 h-5 text-[#0A2540] shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-[#11161B]">
              {language === 'KR' ? '현장 상황은 달라질 수 있습니다' : 'Field Conditions May Change'}
            </h3>
          </div>

          <div className="space-y-3 text-xs text-[#4A5568] leading-relaxed">
            <p>
              {language === 'KR'
                ? '지하철역과 관광지의 시설 및 이동 환경은 공사, 정기 점검, 현장 운영 상황 등에 따라 사전에 고지 없이 변경될 수 있습니다. 따라서 본 서비스에서 제공하는 정보는 여행 계획 수립을 돕는 안내 참고용 자료이며, 실제 방문 시 현장의 안내표지와 운영 상황을 함께 확인하시길 권장합니다.'
                : 'Facility access and transit equipment status may change due to unannounced construction, routine maintenance, or local operations. Information on this platform serves as a helpful reference guide, and travelers are advised to verify real-time site notices.'}
            </p>
            <p>
              {language === 'KR'
                ? '혹시 잘못된 정보나 공사 등으로 변경된 현장 시설을 발견하셨다면 이용자 제보를 통해 알려주세요. 제보해주신 내용은 즉시 확인을 거쳐 서비스 정보에 반영함으로써 더욱 신뢰도 높은 여행 정보를 유지하겠습니다.'
                : 'If you notice outdated information or temporary station closures, please inform us via user reporting. We rapidly verify field feedback to update our guide for the community.'}
            </p>
          </div>

          {onNavigateToReport && (
            <div className="pt-3 border-t border-[#E5E2DC]">
              <button
                type="button"
                onClick={onNavigateToReport}
                className="text-xs font-bold text-[#0A2540] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <AlertCircle className="w-4 h-4 text-[#0A2540]" />
                <span>{language === 'KR' ? '오류/고장 제보하기' : 'Report an Issue / Outage'}</span>
                <ChevronRight className="w-4 h-4 text-[#0A2540]" />
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
