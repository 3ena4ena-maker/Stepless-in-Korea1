/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * STEP 2-2: Stepless 무장애 관광지 여행안내 전용 뷰 컴포넌트
 * 공공데이터(사실 정보)를 바탕으로 Stepless만의 무단차 여행자 관점 큐레이션을 제공합니다.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Train,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ExternalLink,
  Navigation,
  ChevronRight,
  Clock,
  DollarSign,
  Phone,
  ShieldCheck,
  X,
  Search,
  ArrowRight,
  Info,
  Footprints,
  Building2,
  Sunset,
  Theater,
  HelpCircle
} from 'lucide-react';
import { BUSAN_TOUR_API_SPOTS, TourApiSpot } from '../data/tourApiSpots';
import { TOUR_TRAVEL_GUIDE_DATA, TourTravelGuideItem } from '../data/tourTravelGuideData';

interface TourTravelGuideViewProps {
  language: 'KR' | 'EN';
  selectedSpotId?: string | null;
  onSelectSpot?: (spotId: string) => void;
  onSelectStation?: (stationId: string, exitNum?: string) => void;
  onSwitchToStandard?: () => void;
}

export default function TourTravelGuideView({
  language,
  selectedSpotId,
  onSelectSpot,
  onSelectStation,
  onSwitchToStandard
}: TourTravelGuideViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeModalSpot, setActiveModalSpot] = useState<TourApiSpot | null>(() => {
    if (selectedSpotId) {
      return BUSAN_TOUR_API_SPOTS.find(s => s.contentid === selectedSpotId) || null;
    }
    return null;
  });

  const categories = ['ALL', '해변/자연', '문화시설', '관광지', '쇼핑/복합문화'];

  // Filter spots that have Stepless travel guide data
  const curatedSpots = BUSAN_TOUR_API_SPOTS.filter(spot => {
    const hasGuide = !!TOUR_TRAVEL_GUIDE_DATA[spot.contentid];
    const matchesKw =
      searchQuery.trim() === '' ||
      spot.titleKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.districtKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.nearestStationNameKo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat =
      selectedCategory === 'ALL' || spot.categoryKo === selectedCategory;

    return hasGuide && matchesKw && matchesCat;
  });

  const handleOpenSpot = (spot: TourApiSpot) => {
    setActiveModalSpot(spot);
    if (onSelectSpot) {
      onSelectSpot(spot.contentid);
    }
  };

  const handleCloseModal = () => {
    setActiveModalSpot(null);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Train': return <Train className="w-4 h-4" />;
      case 'Footprints': return <Footprints className="w-4 h-4" />;
      case 'Building2': return <Building2 className="w-4 h-4" />;
      case 'Sunset': return <Sunset className="w-4 h-4" />;
      case 'Theater': return <Theater className="w-4 h-4" />;
      default: return <Compass className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-left">
      {/* 1. CURATED HERO BANNER */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white border-2 border-slate-900 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>{language === 'KR' ? 'Stepless 독점 큐레이션' : 'Stepless Exclusive Curation'}</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
            {language === 'KR'
              ? '무단차 여행자를 위한 맞춤 관광지 가이드'
              : 'Tailored Travel Guides for Step-Free Explorers'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-3xl">
            {language === 'KR'
              ? '단순한 시설 스펙 목록이 아닌, "왜 방문해야 하는지", "어떤 유형에 최적인지", "실제 단차 없는 이동 경로는 무엇인지"를 Stepless 여행자 관점에서 정밀 해석한 큐레이션입니다.'
              : 'Beyond standard facility specs: curated insights on why to visit, who it suits best, and how to navigate step-free from transit to entry.'}
          </p>

          {/* Quick value badges */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-slate-900 font-extrabold text-[11px] sm:text-xs">
            <div className="bg-white/95 p-2.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="block text-indigo-900 text-base font-black">4대 유형</span>
              <span className="text-slate-700">캐리어·휠체어·유모차·어르신</span>
            </div>
            <div className="bg-white/95 p-2.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="block text-indigo-900 text-base font-black">단계별 동선</span>
              <span className="text-slate-700">지하철 ➔ 평탄보도 ➔ 목적지</span>
            </div>
            <div className="bg-white/95 p-2.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="block text-indigo-900 text-base font-black">사전 체크</span>
              <span className="text-slate-700">우회로 & 휴관일 & 주의사항</span>
            </div>
            <div className="bg-white/95 p-2.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="block text-indigo-900 text-base font-black">여행 연계</span>
              <span className="text-slate-700">주변 무단차 코스 묶음 추천</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROL BAR */}
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
                  ? 'Stepless 큐레이션 관광지 검색 (해운대, 벡스코, 자갈치, 다대포 등)...'
                  : 'Search curated spots (Haeundae, BEXCO, Jagalchi, Dadaepo)...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-0 text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400"
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

          {/* Quick Switch to Standard Info */}
          {onSwitchToStandard && (
            <button
              onClick={onSwitchToStandard}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold border border-slate-300 transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
            >
              <span>{language === 'KR' ? '공공데이터 원문 보기' : 'View Raw Public Data'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-indigo-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/80'
              }`}
            >
              {cat === 'ALL' ? (language === 'KR' ? '전체 큐레이션' : 'All Curations') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CURATED SPOTS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-black text-slate-700">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>
              {language === 'KR'
                ? `Stepless 큐레이션 관광지 (${curatedSpots.length}곳)`
                : `Curated Barrier-Free Spots (${curatedSpots.length})`}
            </span>
          </span>
          <span className="text-slate-500 font-medium hidden sm:inline">
            {language === 'KR'
              ? '카드를 클릭하면 Stepless 여행자 심층 분석 리포트를 확인하실 수 있습니다.'
              : 'Click a card to view detailed Stepless analysis.'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {curatedSpots.map((spot) => {
            const guide = TOUR_TRAVEL_GUIDE_DATA[spot.contentid];
            if (!guide) return null;

            return (
              <div
                key={spot.contentid}
                onClick={() => handleOpenSpot(spot)}
                className="group bg-white rounded-3xl border-2 border-slate-900 p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3.5">
                  {/* Top Tags & District */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-900 text-white font-black text-[11px]">
                        {spot.districtKo}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 font-extrabold text-[11px] border border-indigo-200">
                        {spot.categoryKo}
                      </span>
                    </div>

                    <span className="text-[11px] font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Stepless 추천
                    </span>
                  </div>

                  {/* Spot Title & One-line Summary */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {language === 'KR' ? spot.titleKo : spot.titleEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-indigo-900 font-bold mt-1.5 leading-relaxed bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100">
                      💡 {language === 'KR' ? guide.oneLineSummaryKo : guide.oneLineSummaryEn}
                    </p>
                  </div>

                  {/* Recommended Traveler Chips */}
                  <div>
                    <span className="text-[11px] font-black text-slate-500 block mb-1.5">
                      {language === 'KR' ? '이런 여행자에게 추천:' : 'Best Suited For:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {guide.recommendedTravelers.map((traveler) => (
                        <span
                          key={traveler.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-extrabold text-[11px] border border-slate-200"
                        >
                          <span>{traveler.icon}</span>
                          <span>{language === 'KR' ? traveler.nameKo : traveler.nameEn}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Stepless Value Highlight (1-2 lines) */}
                  <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <span className="font-extrabold text-slate-900 block text-[11px] text-indigo-900">
                      🔑 {language === 'KR' ? '무단차 이동 핵심 포인트:' : 'Step-Free Highlights:'}
                    </span>
                    <ul className="space-y-1 text-[11.5px] font-medium text-slate-700">
                      {guide.steplessKeyValuesKo.slice(0, 2).map((val, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{language === 'KR' ? val : guide.steplessKeyValuesEn[idx]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Transit Link */}
                <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-between text-xs font-black text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Train className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="text-indigo-950 font-black">{spot.nearestStationNameKo}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-300 px-1.5 py-0.5 rounded-md font-mono">
                      {spot.recommendedElevatorExit}
                    </span>
                  </div>

                  <span className="text-indigo-600 flex items-center gap-0.5 text-xs font-black group-hover:translate-x-1 transition-transform">
                    {language === 'KR' ? '상세 가이드 보기' : 'Full Guide'}
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. DETAILED STEPLESS TRAVEL GUIDE MODAL */}
      {activeModalSpot && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-3xl border-2 border-slate-900 max-w-3xl w-full my-auto overflow-hidden shadow-2xl relative animate-scale-up text-left max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 text-white p-5 sm:p-6 border-b-2 border-slate-900 shrink-0">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 text-white border border-white/20 flex items-center justify-center hover:bg-slate-900 cursor-pointer shadow-md z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2.5 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-md uppercase">
                    {activeModalSpot.categoryKo}
                  </span>
                  <span className="bg-white/20 text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-md backdrop-blur-xs">
                    {activeModalSpot.districtKo}
                  </span>
                  <span className="bg-indigo-500/40 text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-md">
                    Stepless 심층 큐레이션
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl font-black leading-tight tracking-tight">
                  {language === 'KR' ? activeModalSpot.titleKo : activeModalSpot.titleEn}
                </h2>

                <p className="text-xs sm:text-sm text-amber-200 font-bold leading-relaxed">
                  💡 {language === 'KR' 
                    ? TOUR_TRAVEL_GUIDE_DATA[activeModalSpot.contentid]?.oneLineSummaryKo 
                    : TOUR_TRAVEL_GUIDE_DATA[activeModalSpot.contentid]?.oneLineSummaryEn}
                </p>
              </div>
            </div>

            {/* Modal Body - Scrollable Content */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 text-slate-800">
              {(() => {
                const guide = TOUR_TRAVEL_GUIDE_DATA[activeModalSpot.contentid];
                if (!guide) return null;

                return (
                  <>
                    {/* SECTION 1: WHY RECOMMEND */}
                    <div className="space-y-3 bg-indigo-50/50 p-4 sm:p-5 rounded-2xl border border-indigo-100">
                      <h3 className="text-sm sm:text-base font-black text-indigo-950 flex items-center gap-2 border-b border-indigo-200 pb-2">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        {language === 'KR' ? guide.whyRecommendTitleKo : guide.whyRecommendTitleEn}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                        {language === 'KR' ? guide.whyRecommendDescKo : guide.whyRecommendDescEn}
                      </p>

                      {/* 4 Core Value Points */}
                      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {guide.steplessKeyValuesKo.map((val, idx) => (
                          <div key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-indigo-100">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="font-bold text-slate-800">
                              {language === 'KR' ? val : guide.steplessKeyValuesEn[idx]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 2: RECOMMENDED TRAVELER TYPES */}
                    <div className="space-y-3">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                        <Compass className="w-4 h-4 text-indigo-600" />
                        {language === 'KR' ? '이런 여행자에게 적극 추천합니다' : 'Recommended Traveler Profiles'}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {guide.recommendedTravelers.map((traveler) => (
                          <div
                            key={traveler.id}
                            className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-start gap-3"
                          >
                            <span className="text-2xl p-2 rounded-xl bg-white border border-slate-200 shrink-0 shadow-2xs">
                              {traveler.icon}
                            </span>
                            <div className="space-y-1">
                              <h4 className="text-xs sm:text-sm font-black text-slate-900">
                                {language === 'KR' ? traveler.nameKo : traveler.nameEn}
                              </h4>
                              <p className="text-[11.5px] text-slate-600 font-medium leading-snug">
                                {language === 'KR' ? traveler.reasonKo : traveler.reasonEn}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 3: STEPLESS STEP-BY-STEP MOVEMENT GUIDE */}
                    <div className="space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border-2 border-slate-200">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                          <Footprints className="w-4 h-4 text-indigo-600" />
                          {language === 'KR' ? 'Stepless 실제 무단차 이동 경로' : 'Step-by-Step Step-Free Movement'}
                        </h3>
                        <span className="text-[11px] font-black text-indigo-900 bg-white px-2 py-0.5 rounded-md border border-slate-300">
                          {activeModalSpot.nearestStationNameKo}
                        </span>
                      </div>

                      <div className="space-y-3 pt-1">
                        {guide.movementSteps.map((stepItem) => (
                          <div key={stepItem.step} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="w-7 h-7 rounded-full bg-indigo-900 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                              {stepItem.step}
                            </div>
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                                  {language === 'KR' ? stepItem.typeKo : stepItem.typeEn}
                                </span>
                                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                                  {language === 'KR' ? stepItem.titleKo : stepItem.titleEn}
                                </h4>
                              </div>
                              <p className="text-[11.5px] text-slate-600 font-medium leading-relaxed">
                                {language === 'KR' ? stepItem.descKo : stepItem.descEn}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Station Link Action */}
                      {onSelectStation && (
                        <button
                          onClick={() => {
                            const stId = activeModalSpot.nearestStationId;
                            handleCloseModal();
                            onSelectStation(stId, activeModalSpot.recommendedElevatorExit);
                          }}
                          className="w-full py-2.5 bg-indigo-900 text-white rounded-xl text-xs font-black border border-slate-900 hover:bg-indigo-950 cursor-pointer shadow-xs flex items-center justify-center gap-1.5 transition-all mt-2"
                        >
                          <span>{activeModalSpot.nearestStationNameKo} 지하철 승강기·출구 상세 보기</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* SECTION 4: BARRIER-FREE AMENITIES CHECK (GROUNDED DATA) */}
                    <div className="space-y-3">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        {language === 'KR' ? '무단차 편의시설 체크 (공공데이터 검증)' : 'Barrier-Free Amenities Specs'}
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-black text-slate-500 block">주출입구 / 경사로</span>
                          <span className="font-extrabold text-slate-900 text-xs">
                            {activeModalSpot.barrierFree.route.hasNoStep ? '✅ 무단차(0cm)' : '경사로 구비'}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-black text-slate-500 block">승강기 / 엘리베이터</span>
                          <span className="font-extrabold text-slate-900 text-xs">
                            {activeModalSpot.barrierFree.elevator.hasElevator ? '✅ 운행중' : '해당없음'}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-black text-slate-500 block">장애인 화장실</span>
                          <span className="font-extrabold text-slate-900 text-xs">
                            {activeModalSpot.barrierFree.toilet.hasToilet ? '✅ 전용 완비' : '확인중'}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-black text-slate-500 block">전용 주차구역</span>
                          <span className="font-extrabold text-slate-900 text-xs">
                            {activeModalSpot.barrierFree.parking.hasParking ? '✅ 전용 주차면' : '없음'}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-black text-slate-500 block">휠체어 대여</span>
                          <span className="font-extrabold text-slate-900 text-xs">
                            {activeModalSpot.barrierFree.wheelchair.hasRental ? '✅ 무료 대여' : '미제공'}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-black text-slate-500 block">유모차 이동</span>
                          <span className="font-extrabold text-slate-900 text-xs">
                            {activeModalSpot.barrierFree.stroller.hasStroller ? '✅ 평탄 산책로' : '일부'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 5: PRE-VISIT CHECKLIST & PRECAUTIONS */}
                    <div className="space-y-3 bg-amber-50/70 p-4 sm:p-5 rounded-2xl border border-amber-200">
                      <h3 className="text-sm sm:text-base font-black text-amber-950 flex items-center gap-2 border-b border-amber-200/80 pb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        {language === 'KR' ? '방문 전 꼭 확인하세요 (체크포인트)' : 'Pre-Visit Key Checklist'}
                      </h3>

                      <ul className="space-y-2 text-xs font-medium text-amber-950">
                        {guide.preVisitChecklistKo.map((check, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold shrink-0">•</span>
                            <span>{language === 'KR' ? check : guide.preVisitChecklistEn[idx]}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* SECTION 6: NEARBY CONNECTED ITINERARY */}
                    <div className="space-y-3">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                        <Compass className="w-4 h-4 text-indigo-600" />
                        {language === 'KR' ? '함께 묶어가기 좋은 주변 무단차 코스' : 'Nearby Connected Itineraries'}
                      </h3>

                      <div className="space-y-2">
                        {guide.nearbyLinks.map((near, idx) => (
                          <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs sm:text-sm font-black text-slate-900">
                                {language === 'KR' ? near.spotNameKo : near.spotNameEn}
                              </h4>
                              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                                {language === 'KR' ? near.distanceTextKo : near.distanceTextEn}
                              </span>
                            </div>
                            <p className="text-[11.5px] text-slate-600 font-medium leading-relaxed">
                              {language === 'KR' ? near.whyPairKo : near.whyPairEn}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 7: LOCATION & MAP LAUNCHERS */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-red-500" />
                          {activeModalSpot.addr1Ko}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a
                          href={`https://map.naver.com/v5/search/${encodeURIComponent(activeModalSpot.titleKo)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black text-center flex items-center justify-center gap-1.5 hover:bg-emerald-700 transition-colors shadow-2xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          네이버 지도 길찾기
                        </a>
                        <a
                          href={`https://map.kakao.com/link/search/${encodeURIComponent(activeModalSpot.titleKo)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2.5 bg-amber-400 text-slate-900 rounded-xl text-xs font-black text-center flex items-center justify-center gap-1.5 hover:bg-amber-500 transition-colors shadow-2xs"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          카카오맵 길찾기
                        </a>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
