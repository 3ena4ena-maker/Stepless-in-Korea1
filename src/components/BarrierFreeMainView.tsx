/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 무장애 관광지 메인 페이지 (/barrier-free)
 * 1. 여행자 유형 선택 (휠체어, 유아차, 캐리어, 천천히 여행하기)
 * 2. 추천 여행 코스 (가로 스크롤 카드) -> 코스 자세히 보기 클릭 시 /barrier-free/course/:courseId
 * 3. 추천 무장애 관광지 (깔끔한 2열 카드 그리드) -> 상세 보기 클릭 시 /barrier-free/place/:placeId
 */

import React from 'react';
import {
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  UserType,
  USER_TYPES,
  TravelCourse,
  TouristPlace,
} from '../data/barrierFreeData';
import {
  getRecommendedCourses,
  getRecommendedPlaces,
} from '../utils/barrierFreeRecommendation';
import TourApiImage from './TourApiImage';

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
  // 현재 선택된 여행자 유형에 맞춘 코스 및 관광지 추천 목록
  const recommendedCourses = getRecommendedCourses(selectedUserType);
  const recommendedPlaces = getRecommendedPlaces(selectedUserType);
  const activeUserMeta = USER_TYPES.find((t) => t.id === selectedUserType);

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

      {/* 2. 여행자 유형 선택 섹션 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <span>{language === 'KR' ? '여행자 유형 선택' : 'Select Traveler Type'}</span>
            <span className="text-xs text-slate-500 font-medium">
              {language === 'KR'
                ? '(유형에 따라 코스와 관광지가 맞춤 정렬됩니다)'
                : '(Courses and attractions are sorted by your needs)'}
            </span>
          </h2>
        </div>

        {/* 4개 유형 선택 버튼 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {USER_TYPES.map((type) => {
            const isSelected = selectedUserType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onSelectUserType(type.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 cursor-pointer select-none ${
                  isSelected
                    ? 'border-[#0A2540] bg-blue-50/70 shadow-[3px_3px_0px_0px_rgba(10,37,64,1)]'
                    : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">{type.icon}</span>
                  <span
                    className={`text-xs sm:text-sm font-black ${
                      isSelected ? 'text-[#0A2540]' : 'text-slate-800'
                    }`}
                  >
                    {language === 'KR' ? type.titleKo : type.titleEn}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium line-clamp-1 hidden sm:block">
                  {language === 'KR' ? type.descKo : type.descEn}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. 추천 여행 코스 (가로 스크롤 카드 형태) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>{language === 'KR' ? '추천 여행 코스' : 'Recommended Travel Courses'}</span>
              {activeUserMeta && (
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
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
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {language === 'KR' ? '가로 스크롤 가능 ➔' : 'Scroll horizontally ➔'}
          </span>
        </div>

        {/* 가로 스크롤 컨테이너 */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-slate-200">
          {recommendedCourses.map((course) => {
            const placesSummary = course.places
              .map((p) => (language === 'KR' ? p.nameKo : p.nameEn))
              .join(' → ');

            return (
              <div
                key={course.id}
                className="w-72 sm:w-80 shrink-0 snap-start bg-white rounded-2xl border-2 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between"
              >
                <div>
                  {/* 대표 사진 */}
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <TourApiImage
                      src={course.image}
                      alt={language === 'KR' ? course.titleKo : course.titleEn}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#0A2540] text-white text-[10px] font-bold shadow-xs">
                        {language === 'KR' ? course.tagKo : course.tagEn}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                        {language === 'KR' ? course.difficultyTextKo : course.difficultyTextEn}
                      </span>
                    </div>
                  </div>

                  {/* 코스 본문 */}
                  <div className="p-4 space-y-2.5">
                    <h3 className="text-base font-black text-slate-900 leading-snug">
                      {language === 'KR' ? course.titleKo : course.titleEn}
                    </h3>

                    {/* 소요 시간 & 이동 거리 */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
                      <span className="flex items-center gap-1 text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{language === 'KR' ? course.durationKo : course.durationEn}</span>
                      </span>
                      <span>·</span>
                      <span>{language === 'KR' ? course.distanceTextKo : course.distanceTextEn}</span>
                    </div>

                    {/* 주요 장소 2~3개 (예: 해운대해수욕장 → 동백섬 → 더베이101) */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        {language === 'KR' ? '주요 코스 경로' : 'Key Route Spots'}
                      </span>
                      <p className="text-xs font-bold text-[#0A2540] leading-relaxed line-clamp-2">
                        {placesSummary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ‘코스 자세히 보기 →’ 버튼 */}
                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => onNavigateToCourse(course.id)}
                    className="w-full py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#11161B] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>{language === 'KR' ? '코스 자세히 보기' : 'View Course Details'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendedPlaces.map(({ place, score, highlightKo, highlightEn }) => (
            <div
              key={place.id}
              className="bg-white rounded-2xl border-2 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between"
            >
              <div>
                {/* 썸네일 */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  <TourApiImage
                    contentId={place.contentId}
                    src={place.image}
                    alt={language === 'KR' ? place.nameKo : place.nameEn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded-md bg-[#0A2540] text-white text-[10px] font-bold shadow-xs">
                      {language === 'KR' ? place.districtKo : place.districtEn}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                      {language === 'KR'
                        ? (place.accessibilityGrade === 'COMFORTABLE' ? '🟢 편안한 이동' : '🟡 일부 주의')
                        : (place.accessibilityGrade === 'COMFORTABLE' ? '🟢 Easy Step-Free' : '🟡 Caution Advised')}
                    </span>
                  </div>
                </div>

                {/* 관광지 정보 */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-black text-slate-900 leading-snug">
                      {language === 'KR' ? place.nameKo : place.nameEn}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="line-clamp-1">{language === 'KR' ? place.addressKo : place.addressEn}</span>
                  </p>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-2">
                    {language === 'KR' ? highlightKo : highlightEn}
                  </p>

                  {/* 핵심 무장애 정보 (실제 확인된 데이터) */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {!place.accessibility.stairs && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {language === 'KR' ? '🟢 계단 없음' : '🟢 Step-Free'}
                      </span>
                    )}
                    {place.accessibility.elevator && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                        {language === 'KR' ? '🛗 엘리베이터' : '🛗 Elevator'}
                      </span>
                    )}
                    {place.accessibility.accessibleRestroom && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                        {language === 'KR' ? '🚻 전용 화장실' : '🚻 Accessible WC'}
                      </span>
                    )}
                    {place.accessibility.wheelchair && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
                        {language === 'KR' ? '♿ 휠체어 가능' : '♿ Wheelchair'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ‘상세 보기 →’ 버튼 */}
              <div className="p-4 pt-0">
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
