import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Compass,
  Building2,
  Train,
  ExternalLink,
  Info,
  CheckCircle2,
  X,
  Phone,
  Clock,
  DollarSign,
  Share2,
  Navigation,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { BUSAN_TOUR_API_SPOTS, TourApiSpot } from '../data/tourApiSpots';

interface BarrierFreeTourApiViewProps {
  language: 'KR' | 'EN';
  initialSpotId?: string | null;
  onSelectStation?: (stationId: string, exitNum?: string) => void;
}

export default function BarrierFreeTourApiView({
  language,
  initialSpotId,
  onSelectStation
}: BarrierFreeTourApiViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedSpot, setSelectedSpot] = useState<TourApiSpot | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Synchronize state with browser URL path /tourapi/:contentid on mount & popstate
  useEffect(() => {
    const parseUrlSpot = () => {
      const pathname = window.location.pathname;
      const parts = pathname.split('/');
      let spotIdFromUrl: string | null = null;
      if (parts[1] === 'tourapi' && parts[2]) {
        spotIdFromUrl = parts[2];
      } else {
        const searchParams = new URLSearchParams(window.location.search);
        spotIdFromUrl = searchParams.get('spot');
      }

      const targetId = spotIdFromUrl || initialSpotId;
      if (targetId) {
        const found = BUSAN_TOUR_API_SPOTS.find(
          (s) => s.contentid.toLowerCase() === targetId.toLowerCase()
        );
        if (found) {
          setSelectedSpot(found);
          return;
        }
      }
    };

    parseUrlSpot();

    const handlePopState = () => parseUrlSpot();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [initialSpotId]);

  // Open spot detail
  const handleOpenSpot = (spot: TourApiSpot) => {
    setSelectedSpot(spot);
    const newUrl = `/tourapi/${spot.contentid}`;
    if (window.location.pathname !== newUrl) {
      window.history.pushState(null, '', newUrl);
    }
  };

  // Close spot detail
  const handleCloseSpot = () => {
    setSelectedSpot(null);
    if (window.location.pathname !== '/tourapi') {
      window.history.pushState(null, '', '/tourapi');
    }
  };

  // Filter spots based on search query, category, and district
  const filteredSpots = BUSAN_TOUR_API_SPOTS.filter((spot) => {
    const matchesKw =
      searchQuery.trim() === '' ||
      spot.titleKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.districtKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.addr1Ko.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.nearestStationNameKo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat =
      selectedCategory === 'ALL' || spot.categoryKo === selectedCategory;

    const matchesDistrict =
      selectedDistrict === 'ALL' || spot.districtKo === selectedDistrict;

    return matchesKw && matchesCat && matchesDistrict;
  });

  const categories = ['ALL', '해변/자연', '문화시설', '관광지', '쇼핑/복합문화'];
  const districts = ['ALL', '해운대구', '수영구', '중구', '영도구', '사하구', '금정구'];

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto px-4 sm:px-6 animate-fade-in text-left">
      {/* HERO HEADER BANNER */}
      <div className="bg-gradient-to-br from-[#003366] via-[#004481] to-[#0066b2] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden border-2 border-slate-900">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
            {language === 'KR'
              ? '부산 편리한 무장애 관광지'
              : 'Busan Convenient Barrier-Free Tourist Spots'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-100/90 font-medium leading-relaxed">
            {language === 'KR'
              ? '모든 여행 코스에서 휠체어·유모차 이용이 편리한 무장애 관광 스팟만 엄선하여 모아둔 카테고리입니다.'
              : 'A curated collection of accessible spots from all travel itineraries, optimized for wheelchairs and strollers.'}
          </p>

          {/* QUICK SUMMARY BADGES */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-slate-900 font-black text-[11px] sm:text-xs">
            <div className="bg-white/95 p-2 rounded-xl border border-slate-200 shadow-xs">
              <span className="block text-[#004481] text-base font-black">100%</span>
              <span>무단차/경사로 검증</span>
            </div>
            <div className="bg-white/95 p-2 rounded-xl border border-slate-200 shadow-xs">
              <span className="block text-[#004481] text-base font-black">장애인전용</span>
              <span>화장실 & 주차구역</span>
            </div>
            <div className="bg-white/95 p-2 rounded-xl border border-slate-200 shadow-xs">
              <span className="block text-[#004481] text-base font-black">지하철 승강기</span>
              <span>최단 출구 연계</span>
            </div>
            <div className="bg-white/95 p-2 rounded-xl border border-slate-200 shadow-xs">
              <span className="block text-[#004481] text-base font-black">무료 대여</span>
              <span>휠체어 & 유모차</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'KR'
                  ? '관광지명, 지역구(해운대, 수영, 중구 등), 지하철역 검색...'
                  : 'Search by spot name, district, or subway station...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-[#004481] focus:ring-0 text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* District Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-black text-slate-600 shrink-0">
              {language === 'KR' ? '지역구:' : 'District:'}
            </span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-50 font-bold border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-[#004481] cursor-pointer"
            >
              <option value="ALL">{language === 'KR' ? '전체 구/군' : 'All Districts'}</option>
              {districts.filter((d) => d !== 'ALL').map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#004481] text-white border-slate-900 shadow-xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/80'
              }`}
            >
              {cat === 'ALL' ? (language === 'KR' ? '전체 카테고리' : 'All') : cat}
            </button>
          ))}
        </div>

        {/* Source Citation */}
        <div className="text-[11px] sm:text-xs text-slate-500 font-bold pt-2 border-t border-slate-150 flex items-center gap-1">
          <span>출처: ⓒ한국관광공사</span>
        </div>
      </div>

      {/* RESULTS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-black text-slate-700">
          <span>
            {language === 'KR'
              ? `검색 결과 ${filteredSpots.length}곳`
              : `Found ${filteredSpots.length} barrier-free spots`}
          </span>
          <span className="text-slate-500 font-medium">
            {language === 'KR'
              ? '카드를 클릭하면 상세 정보를 확인할 수 있습니다.'
              : 'Click a card to view detailed information.'}
          </span>
        </div>

        {filteredSpots.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-slate-300 text-center space-y-3">
            <Info className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-black text-slate-700">
              {language === 'KR'
                ? '검색 조건에 일치하는 무장애 관광지가 없습니다.'
                : 'No barrier-free spots match your criteria.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedDistrict('ALL');
              }}
              className="text-xs font-black text-[#004481] underline cursor-pointer"
            >
              {language === 'KR' ? '검색 필터 초기화' : 'Reset filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredSpots.map((spot) => (
              <div
                key={spot.contentid}
                onClick={() => handleOpenSpot(spot)}
                className="group bg-white rounded-2xl border-2 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Clean Location & Category Header Bar (Simple, No Image) */}
                  <div className="bg-slate-50 p-3.5 border-b-2 border-slate-900 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <MapPin className="w-4 h-4 text-[#004481] shrink-0" />
                      <span className="bg-slate-900 text-white font-black text-xs px-2.5 py-0.5 rounded-md">
                        {spot.districtKo}
                      </span>
                    </div>
                    <span className="bg-[#004481] text-white font-black text-[10px] px-2.5 py-0.5 rounded-md shadow-2xs">
                      {spot.categoryKo}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug group-hover:text-[#004481] transition-colors">
                        {language === 'KR' ? spot.titleKo : spot.titleEn}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-bold mt-1 line-clamp-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                        {spot.addr1Ko}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                      {language === 'KR' ? spot.overviewKo : spot.overviewEn}
                    </p>

                    {/* BARRIER-FREE QUICK BADGES */}
                    <div className="pt-1 flex flex-wrap gap-1 text-[10px] font-black">
                      {spot.barrierFree.route.hasNoStep && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                          ♿ 주출입구 무단차
                        </span>
                      )}
                      {spot.barrierFree.toilet.hasToilet && (
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-md">
                          🚻 장애인화장실
                        </span>
                      )}
                      {spot.barrierFree.elevator.hasElevator && (
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded-md">
                          엘리베이터
                        </span>
                      )}
                      {spot.barrierFree.wheelchair.hasRental && (
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded-md">
                          ♿ 휠체어대여
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* STEPLESS SUBWAY CONNECTION FOOTER */}
                <div className="bg-slate-50 p-3 border-t-2 border-slate-100 flex items-center justify-between text-xs font-black text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Train className="w-4 h-4 text-[#004481] shrink-0" />
                    <span className="text-[#004481] font-black">{spot.nearestStationNameKo}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-md font-mono">
                      {spot.recommendedElevatorExit}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL MODAL / DEDICATED SPOT PAGE FOR SELECTED SPOT */}
      {selectedSpot && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={handleCloseSpot}
        >
          <div
            className="bg-white rounded-3xl border-2 border-slate-900 max-w-2xl w-full my-auto overflow-hidden shadow-2xl relative animate-scale-up text-left max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header (Simple Header, No Image) */}
            <div className="relative bg-gradient-to-br from-[#003366] via-[#004481] to-[#0066b2] text-white p-5 sm:p-6 border-b-2 border-slate-900 shrink-0">
              <button
                onClick={handleCloseSpot}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 text-white border border-white/20 flex items-center justify-center hover:bg-slate-900 cursor-pointer shadow-md z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-3 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-amber-400 text-slate-900 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-md uppercase">
                    {selectedSpot.categoryKo}
                  </span>
                  <span className="bg-white/20 text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-md backdrop-blur-xs">
                    {selectedSpot.districtKo}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                  {language === 'KR' ? selectedSpot.titleKo : selectedSpot.titleEn}
                </h2>

                <p className="text-xs text-slate-200 font-medium flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  {selectedSpot.addr1Ko}
                </p>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
              {/* 1. OVERVIEW & CONTACT */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5 border-b-2 border-slate-100 pb-2">
                  <Info className="w-4 h-4 text-[#004481]" />
                  {language === 'KR' ? '관광지 개요 및 기본 정보' : 'Overview & Basic Info'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  {language === 'KR' ? selectedSpot.overviewKo : selectedSpot.overviewEn}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>전화번호: {selectedSpot.tel || '안내소 참조'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>이용시간: {selectedSpot.useTimeKo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>입장료: {selectedSpot.feeKo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>휴무일: {selectedSpot.restDateKo}</span>
                  </div>
                </div>
              </div>

              {/* 2. KORWITHAPI BARRIER-FREE CHECKLIST */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5 border-b-2 border-slate-100 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  {language === 'KR'
                    ? '무장애 편의시설 상세 데이터 (KorWithAPI)'
                    : 'Barrier-Free Accessibility Data'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                      <span>♿ 주출입구 / 경사로</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                          selectedSpot.barrierFree.route.hasRamp
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {selectedSpot.barrierFree.route.hasRamp ? '확인됨' : '미구비'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {selectedSpot.barrierFree.route.descKo}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                      <span>승강기 / 엘리베이터</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                          selectedSpot.barrierFree.elevator.hasElevator
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {selectedSpot.barrierFree.elevator.hasElevator ? '운행중' : '해당없음'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {selectedSpot.barrierFree.elevator.descKo}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                      <span>🚻 장애인 전용 화장실</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                          selectedSpot.barrierFree.toilet.hasToilet
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {selectedSpot.barrierFree.toilet.hasToilet ? '완비' : '확인중'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {selectedSpot.barrierFree.toilet.descKo}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                      <span>🅿️ 전용 주차구역</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                          selectedSpot.barrierFree.parking.hasParking
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {selectedSpot.barrierFree.parking.hasParking ? '있음' : '없음'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {selectedSpot.barrierFree.parking.descKo}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                      <span>♿ 휠체어 대여 서비스</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                          selectedSpot.barrierFree.wheelchair.hasRental
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {selectedSpot.barrierFree.wheelchair.hasRental ? '무료 대여' : '미제공'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {selectedSpot.barrierFree.wheelchair.descKo}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                      <span>👁️ 점자 블록 / 시각 지원</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                          selectedSpot.barrierFree.tactilePaving.hasTactile
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {selectedSpot.barrierFree.tactilePaving.hasTactile ? '설치됨' : '일부'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {selectedSpot.barrierFree.tactilePaving.descKo}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. STEPLESS SUBWAY ROUTE RECOMMENDATION */}
              <div className="bg-[#004481]/5 p-4 rounded-2xl border-2 border-[#004481]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#004481] text-white flex items-center justify-center font-black">
                      <Train className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#004481] block">
                        STEPLESS 추천 경로
                      </span>
                      <h4 className="text-sm font-black text-slate-900">
                        {selectedSpot.nearestStationNameKo} 연계 이동 경로
                      </h4>
                    </div>
                  </div>

                  <span className="bg-white text-[#004481] border border-[#004481]/30 text-xs font-black px-2.5 py-1 rounded-xl shadow-2xs">
                    {selectedSpot.recommendedElevatorExit}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 text-xs font-medium text-slate-800">
                  <div className="flex items-start gap-2">
                    <span className="bg-[#004481] text-white font-black text-[10px] px-1.5 py-0.2 rounded-md shrink-0 mt-0.5">
                      STEP 1
                    </span>
                    <p>
                      <strong>지하철 하차 & 승강기 출구:</strong> {selectedSpot.nearestStationNameKo}{' '}
                      <strong>{selectedSpot.recommendedElevatorExit}</strong>를 이용하여 지상으로 출차합니다.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="bg-[#004481] text-white font-black text-[10px] px-1.5 py-0.2 rounded-md shrink-0 mt-0.5">
                      STEP 2
                    </span>
                    <p>
                      <strong>보도 이동 / 저상버스:</strong> {selectedSpot.exitDistanceTextKo}
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="bg-[#004481] text-white font-black text-[10px] px-1.5 py-0.2 rounded-md shrink-0 mt-0.5">
                      STEP 3
                    </span>
                    <p>
                      <strong>목적지 진입:</strong> {selectedSpot.transitTipKo}
                    </p>
                  </div>
                </div>

                {/* STATION LINK BUTTON */}
                {onSelectStation && (
                  <button
                    onClick={() => {
                      const stId = selectedSpot.nearestStationId;
                      handleCloseSpot();
                      onSelectStation(stId, selectedSpot.recommendedElevatorExit);
                    }}
                    className="w-full py-2.5 bg-[#004481] text-white rounded-xl text-xs font-black border border-slate-900 hover:bg-[#003366] cursor-pointer shadow-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>{selectedSpot.nearestStationNameKo} 출구 지도 & 승강기 정보 바로보기</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* 4. LOCATION & MAP BUTTONS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-red-500" />
                    주소: {selectedSpot.addr1Ko}
                  </span>
                  <button
                    onClick={() => handleCopyAddress(selectedSpot.addr1Ko)}
                    className="text-[#004481] hover:underline font-black cursor-pointer"
                  >
                    {copiedAddress ? '복사됨!' : '주소 복사'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`https://map.naver.com/v5/search/${encodeURIComponent(selectedSpot.titleKo)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black text-center flex items-center justify-center gap-1.5 hover:bg-emerald-700 transition-colors shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    네이버 지도 길찾기
                  </a>
                  <a
                    href={`https://map.kakao.com/link/search/${encodeURIComponent(selectedSpot.titleKo)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 bg-amber-400 text-slate-900 rounded-xl text-xs font-black text-center flex items-center justify-center gap-1.5 hover:bg-amber-500 transition-colors shadow-2xs"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    카카오맵 길찾기
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
