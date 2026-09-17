/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 무장애 관광지 메인 페이지 (/barrier-free)
 * 1. 여행자 유형 선택 (휠체어, 유아차, 캐리어, 천천히 여행하기)
 * 2. 추천 여행 코스 (가로 스크롤 카드) -> 코스 자세히 보기 클릭 시 /barrier-free/course/:courseId
 * 3. 추천 무장애 관광지 (깔끔한 2열 카드 그리드) -> 상세 보기 클릭 시 /barrier-free/place/:placeId
 */

import React, { useState, useMemo } from 'react';
import {
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Train,
} from 'lucide-react';
import {
  UserType,
  USER_TYPES,
  TravelCourse,
  TouristPlace,
  BusanExperienceType,
  BUSAN_EXPERIENCES,
  TravelCompanionType,
  TRAVEL_COMPANIONS,
} from '../data/barrierFreeData';
import {
  getRecommendedCourses,
  getRecommendedPlaces,
} from '../utils/barrierFreeRecommendation';

interface BarrierFreeMainViewProps {
  selectedUserType: UserType;
  onSelectUserType: (type: UserType) => void;
  language: 'KR' | 'EN';
  onNavigateToCourse: (courseId: string) => void;
  onNavigateToPlace: (placeId: string) => void;
}

export default function BarrierFreeMainView({
  selectedUserType,
  onSelectUserType,
  language,
  onNavigateToCourse,
  onNavigateToPlace,
}: BarrierFreeMainViewProps) {
  // 1. 여행자 유형 다중 선택 상태 (복수 선택 및 토글 해제 허용)
  const [selectedUserTypes, setSelectedUserTypes] = useState<UserType[]>([selectedUserType]);

  // 2. 부산 여행 경험 다중 선택 상태 (초기 상태: 미선택/선택 해제 허용)
  const [selectedExperiences, setSelectedExperiences] = useState<BusanExperienceType[]>([]);

  // 3. 함께하는 여행 다중 선택 상태 (초기 상태: 미선택/선택 해제 허용)
  const [selectedCompanions, setSelectedCompanions] = useState<TravelCompanionType[]>([]);

  // 여행자 유형 토글 핸들러 (기존 단일 선택 콜백 연동 유지로 추천/정렬 기능 완벽 보존)
  const handleToggleUserType = (typeId: UserType) => {
    setSelectedUserTypes((prev) => {
      const exists = prev.includes(typeId);
      const updated = exists ? prev.filter((id) => id !== typeId) : [...prev, typeId];
      
      // 기존 추천 정렬 로직과의 호환성 유지:
      // 선택된 항목이 남아있으면 가장 마지막에 선택된 항목(또는 첫번째 항목)을 기존 정렬 기준으로 동기화
      if (updated.length > 0) {
        const nextActive = exists ? updated[updated.length - 1] : typeId;
        onSelectUserType(nextActive);
      }
      return updated;
    });
  };

  // 부산 여행 경험 토글 핸들러
  const handleToggleExperience = (expId: BusanExperienceType) => {
    setSelectedExperiences((prev) =>
      prev.includes(expId) ? prev.filter((id) => id !== expId) : [...prev, expId]
    );
  };

  // 함께하는 여행 토글 핸들러
  const handleToggleCompanion = (compId: TravelCompanionType) => {
    setSelectedCompanions((prev) =>
      prev.includes(compId) ? prev.filter((id) => id !== compId) : [...prev, compId]
    );
  };

  // 기존 추천/정렬 로직 완벽 유지
  // (아무것도 선택되지 않은 경우 기본 wheelchair 기준으로 안전하게 정렬 fallback)
  const activeSortUserType: UserType =
    selectedUserTypes.length > 0 ? selectedUserTypes[selectedUserTypes.length - 1] : selectedUserType;

  const recommendedCourses = getRecommendedCourses(activeSortUserType);

  // 신규 8개 무장애 관광지 ID 목록
  // (해운대 해수욕장, SEA LIFE 부산아쿠아리움, 부산 엑스더스카이 전망대, 다대포 해수욕장, 송정 해수욕장, 자갈치시장, 부평 깡통 국제 시장, 부산 시티투어버스)
  const TARGET_PLACE_IDS = useMemo(
    () => [
      'spot-101',
      'spot-aquarium',
      'spot-xthesky',
      'spot-106',
      'spot-songjeong',
      'spot-jagalchi-rooftop',
      'spot-bupyeong-market',
      'spot-city-tour-bus',
    ],
    []
  );

  // 8개 신규 관광지만 정확히 선별하되, 여행자 유형/경험/동행자 기준 점수 계산 및 정렬 로직은 100% 온전히 유지
  const recommendedPlaces = useMemo(() => {
    const allSorted = getRecommendedPlaces(activeSortUserType, selectedExperiences, selectedCompanions);
    return allSorted.filter(({ place }) => TARGET_PLACE_IDS.includes(place.id));
  }, [activeSortUserType, selectedExperiences, selectedCompanions, TARGET_PLACE_IDS]);

  const activeUserMeta = USER_TYPES.find((t) => t.id === activeSortUserType);

  // 부산 지하철/전철 공식 노선별 고유 컬러 뱃지 렌더러
  const renderSubwayBadge = (line?: string) => {
    if (!line) return null;
    const parts = line.split('/').map((s) => s.trim());
    return (
      <div className="flex flex-wrap items-center gap-1 shrink-0">
        {parts.map((part) => {
          let badgeBg = '#0A2540';
          let badgeBorder = '#071A2E';

          if (part.includes('1호선')) {
            badgeBg = '#F06A00';
            badgeBorder = '#D85F00';
          } else if (part.includes('2호선')) {
            badgeBg = '#8DBF41';
            badgeBorder = '#7AA837';
          } else if (part.includes('3호선')) {
            badgeBg = '#BB8C4B';
            badgeBorder = '#A3783E';
          } else if (part.includes('4호선')) {
            badgeBg = '#2471A3';
            badgeBorder = '#1C5982';
          } else if (part.includes('동해선')) {
            badgeBg = '#003DA5';
            badgeBorder = '#002D7A';
          } else if (part.includes('김해') || part.includes('경전철')) {
            badgeBg = '#782F84';
            badgeBorder = '#61246B';
          } else if (part.includes('KTX')) {
            badgeBg = '#034EA2';
            badgeBorder = '#023877';
          }

          return (
            <span
              key={part}
              style={{ backgroundColor: badgeBg, borderColor: badgeBorder }}
              className="text-[11px] font-black px-2.5 py-0.5 rounded-full text-white shadow-xs border flex items-center gap-1"
            >
              <Train className="w-3 h-3 text-white shrink-0" />
              <span>{part}</span>
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-10 text-left pb-24">
      {/* 1. 페이지 소개 헤더 */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {language === 'KR' ? '부산 무장애 관광' : 'Busan Barrier-Free Travel'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
          {language === 'KR'
            ? '누구나 편안하게 즐길 수 있는 맞춤형 여행 코스와 관광지를 만나보세요.'
            : 'Explore tailored step-free travel courses and accessible attractions for everyone.'}
        </p>
      </div>

      {/* 2. 여행 맞춤 기준 선택 섹션 (모던하고 컴팩트한 칩/토글 레이아웃) */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <span>{language === 'KR' ? '여행 맞춤 기준 선택' : 'Travel Preference Filters'}</span>
            <span className="text-xs text-slate-500 font-medium">
              {language === 'KR'
                ? '(복수 선택 가능 · 선택값에 따라 맞춤 정렬)'
                : '(Multi-select · Instant personalized sorting)'}
            </span>
          </h2>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          {/* 기준 1: 여행자 유형 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-[#0A2540] rounded-xs inline-block"></span>
                <span>{language === 'KR' ? '여행자 유형' : 'Traveler Type'}</span>
                {selectedUserTypes.length > 0 && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full border border-blue-200">
                    {selectedUserTypes.length}
                  </span>
                )}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {language === 'KR' ? '다중 선택 및 해제 가능' : 'Multi-select & toggleable'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {USER_TYPES.map((type) => {
                const isSelected = selectedUserTypes.includes(type.id);
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleToggleUserType(type.id)}
                    className={`px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center text-center cursor-pointer select-none border ${
                      isSelected
                        ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="truncate">{language === 'KR' ? type.titleKo : type.titleEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 기준 2: 부산 여행 경험 */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-blue-600 rounded-xs inline-block"></span>
                <span>{language === 'KR' ? '부산 여행 경험' : 'Busan Travel Experience'}</span>
                {selectedExperiences.length > 0 && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full border border-blue-200">
                    {selectedExperiences.length}
                  </span>
                )}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {language === 'KR' ? '선택 해제 가능' : 'Optional'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {BUSAN_EXPERIENCES.map((exp) => {
                const isSelected = selectedExperiences.includes(exp.id);
                return (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => handleToggleExperience(exp.id)}
                    className={`px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center text-center cursor-pointer select-none border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="truncate">{language === 'KR' ? exp.titleKo : exp.titleEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 기준 3: 함께하는 여행 */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-emerald-600 rounded-xs inline-block"></span>
                <span>{language === 'KR' ? '함께하는 여행' : 'Travel Companions'}</span>
                {selectedCompanions.length > 0 && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                    {selectedCompanions.length}
                  </span>
                )}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {language === 'KR' ? '다중 선택 가능' : 'Multi-select available'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TRAVEL_COMPANIONS.map((comp) => {
                const isSelected = selectedCompanions.includes(comp.id);
                return (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => handleToggleCompanion(comp.id)}
                    className={`px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center text-center cursor-pointer select-none border ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="truncate">{language === 'KR' ? comp.titleKo : comp.titleEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. 추천 여행 코스 (컴팩트 반응형 리스트/그리드) */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{language === 'KR' ? '추천 여행 코스' : 'Recommended Travel Courses'}</span>
              {activeUserMeta && (
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  {language === 'KR'
                    ? `${activeUserMeta.titleKo} 맞춤 순`
                    : `Tailored for ${activeUserMeta.titleEn}`}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {language === 'KR'
                ? '계단 없는 최적 동선으로 연결된 부산 무장애 대표 코스입니다.'
                : 'Curated step-free itineraries through Busan top scenic sights.'}
            </p>
          </div>
        </div>

        {/* 세로형 반응형 그리드 리스트 (모바일 1열, 태블릿/데스크톱 2열 또는 3열) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recommendedCourses.map((course) => {
            const placesSummary = course.places
              .map((p) => (language === 'KR' ? p.nameKo : p.nameEn))
              .join(' → ');

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-3.5 sm:p-4 flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  {/* 상단 태그 & 난이도 뱃지 */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#0A2540] text-white text-[10px] font-bold">
                      {language === 'KR' ? course.tagKo : course.tagEn}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      {language === 'KR' ? course.difficultyTextKo : course.difficultyTextEn}
                    </span>
                  </div>

                  {/* 코스 타이틀 */}
                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                    {language === 'KR' ? course.titleKo : course.titleEn}
                  </h3>

                  {/* 소요 시간 & 이동 거리 */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-bold text-slate-800">
                      {language === 'KR' ? course.durationKo : course.durationEn}
                    </span>
                    <span>·</span>
                    <span>{language === 'KR' ? course.distanceTextKo : course.distanceTextEn}</span>
                  </div>

                  {/* 주요 코스 경로 */}
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                      {language === 'KR' ? '주요 코스 경로' : 'Key Route Spots'}
                    </span>
                    <p className="font-bold text-[#0A2540] line-clamp-2 leading-relaxed">
                      {placesSummary}
                    </p>
                  </div>
                </div>

                {/* ‘코스 자세히 보기’ 버튼 */}
                <button
                  type="button"
                  onClick={() => onNavigateToCourse(course.id)}
                  className="w-full py-2 rounded-lg bg-[#0A2540] hover:bg-[#11161B] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>{language === 'KR' ? '코스 자세히 보기' : 'View Course Details'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. 추천 무장애 관광지 (깔끔한 2열 카드 그리드) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <span>{language === 'KR' ? '추천 무장애 관광지' : 'Recommended Barrier-Free Spots'}</span>
            <span className="text-xs text-slate-500 font-medium">
              {language === 'KR' ? `(총 ${recommendedPlaces.length}곳)` : `(${recommendedPlaces.length} spots)`}
            </span>
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            {language === 'KR'
              ? '계단 없는 이동과 엘리베이터가 검증된 부산의 대표 무장애 명소입니다.'
              : 'Verified step-free and elevator-accessible destinations in Busan.'}
          </p>
        </div>

        {/* 2열 카드 그리드 (모바일 1열, 태블릿 이상 2열) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {recommendedPlaces.map(({ place }) => (
            <div
              key={place.id}
              className="bg-white rounded-2xl border-2 border-slate-900 p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between hover:translate-y-[-2px] transition-all"
            >
              <div className="space-y-2">
                {/* 상단: 구/지역 배지 + 지하철 호선 */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#0A2540] text-white text-[11px] font-bold shadow-xs">
                    {language === 'KR' ? place.districtKo : place.districtEn}
                  </span>
                  {renderSubwayBadge(place.subwayLine)}
                </div>

                {/* 관광지 타이틀 */}
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {language === 'KR' ? place.nameKo : place.nameEn}
                </h3>

                {/* 주소 정보 */}
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="line-clamp-1">{language === 'KR' ? place.addressKo : place.addressEn}</span>
                </p>
              </div>

              {/* ‘상세 보기 →’ 버튼 */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => onNavigateToPlace(place.id)}
                  className="w-full py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#11161B] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                >
                  <span>{language === 'KR' ? '상세 보기' : 'View Details'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
