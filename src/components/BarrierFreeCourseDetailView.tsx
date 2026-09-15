/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 여행 코스 상세 페이지 (/barrier-free/course/:courseId)
 * - 상단: 대표 사진 크게, 코스 이름, 소요시간 · 이동거리, 접근성 수준
 * - 하단: 관광지 이동 순서 (01, 02, 03) 세로형 카드
 * - 각 관광지 클릭 시 관광지 상세 페이지(/barrier-free/place/:placeId)로 이동
 */

import React from 'react';
import {
  ArrowLeft,
  Clock,
  MapPin,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Navigation,
} from 'lucide-react';
import {
  TravelCourse,
  TouristPlace,
  UserType,
  BARRIER_FREE_PLACES,
  BARRIER_FREE_COURSES,
  USER_TYPES,
} from '../data/barrierFreeData';
import TourApiImage from './TourApiImage';

interface BarrierFreeCourseDetailViewProps {
  courseId: string;
  selectedUserType: UserType | null;
  language: 'KR' | 'EN';
  onNavigateToPlace: (placeId: string) => void;
  onBackToCourseList: () => void;
}

export default function BarrierFreeCourseDetailView({
  courseId,
  selectedUserType,
  language,
  onNavigateToPlace,
  onBackToCourseList,
}: BarrierFreeCourseDetailViewProps) {
  // 해당 코스 탐색
  const course = BARRIER_FREE_COURSES.find(
    (c) => c.id.toLowerCase() === courseId.toLowerCase()
  );

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <p className="text-base font-bold text-slate-700">
          {language === 'KR' ? '요청하신 여행 코스를 찾을 수 없습니다.' : 'Travel course not found.'}
        </p>
        <button
          onClick={onBackToCourseList}
          className="px-4 py-2 bg-[#0A2540] text-white rounded-xl text-xs font-bold"
        >
          {language === 'KR' ? '← 추천 코스 목록으로 돌아가기' : '← Back to course list'}
        </button>
      </div>
    );
  }

  // 코스 내 placeIds에 해당하는 관광지 목록 조회
  const coursePlaces: { place: TouristPlace | null; orderName: string; note: string }[] =
    course.places.map((item, idx) => {
      let found: TouristPlace | null = null;
      if (item.spotId) {
        found = BARRIER_FREE_PLACES.find((p) => p.id === item.spotId) || null;
      }
      if (!found && course.placeIds && course.placeIds[idx]) {
        found = BARRIER_FREE_PLACES.find((p) => p.id === course.placeIds[idx]) || null;
      }
      return {
        place: found,
        orderName: language === 'KR' ? item.nameKo : item.nameEn,
        note: language === 'KR' ? item.noteKo : item.noteEn,
      };
    });

  const currentUserMeta = USER_TYPES.find((t) => t.id === selectedUserType);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6 sm:space-y-8 animate-fade-in text-left pb-20">
      {/* 1. 상단 내비게이션 바 */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={onBackToCourseList}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#0A2540] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'KR' ? '추천 코스 목록으로 돌아가기' : 'Back to courses'}</span>
        </button>

        {selectedUserType && currentUserMeta && (
          <span className="text-xs font-bold text-[#0A2540] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            {currentUserMeta.icon} {language === 'KR' ? currentUserMeta.titleKo : currentUserMeta.titleEn} 맞춤 코스
          </span>
        )}
      </div>

      {/* 2. 코스 대표 사진 & 핵심 헤더 */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
        {/* 대형 대표 이미지 */}
        <div className="relative h-60 sm:h-80 w-full overflow-hidden bg-slate-900">
          <TourApiImage
            src={course.image}
            alt={language === 'KR' ? course.titleKo : course.titleEn}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* 태그 & 난이도 */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-lg bg-[#0A2540] text-white text-xs font-bold shadow-xs">
              {language === 'KR' ? course.tagKo : course.tagEn}
            </span>
            <span className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold shadow-xs">
              {language === 'KR' ? course.difficultyTextKo : course.difficultyTextEn}
            </span>
          </div>

          {/* 타이틀 오버레이 */}
          <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug drop-shadow-sm">
              {language === 'KR' ? course.titleKo : course.titleEn}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-200 font-medium">
              <span className="flex items-center gap-1 font-bold text-amber-300">
                <Clock className="w-4 h-4" />
                <span>{language === 'KR' ? course.durationKo : course.durationEn}</span>
              </span>
              <span>•</span>
              <span className="font-bold">
                {language === 'KR' ? course.distanceTextKo : course.distanceTextEn}
              </span>
              <span>•</span>
              <span>
                {language === 'KR'
                  ? `총 ${course.places.length}개 관광지`
                  : `${course.places.length} stops`}
              </span>
            </div>
          </div>
        </div>

        {/* 코스 간결 소개 문구 */}
        <div className="p-5 sm:p-6 bg-slate-50/50 border-t border-slate-200 space-y-3">
          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
            {language === 'KR' ? course.descriptionKo : course.descriptionEn}
          </p>

          {/* 접근성 핵심 배지 */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {course.accessibilityBadges.map((badge, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg font-bold bg-white text-slate-800 border border-slate-300 shadow-2xs flex items-center gap-1"
              >
                <span>{badge.icon}</span>
                <span>{language === 'KR' ? badge.textKo : badge.textEn}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 관광지 이동 순서 (세로형 순서 및 카드) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {language === 'KR' ? '관광지 이동 순서' : 'Itinerary Sequence'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {language === 'KR'
              ? '아래 순서대로 방문하시면 계단과 턱 없이 편안하게 이동하실 수 있습니다.'
              : 'Follow the step-free order below for a smooth, barrier-free trip.'}
          </p>
        </div>

        <div className="space-y-4 relative">
          {coursePlaces.map((item, idx) => {
            const place = item.place;
            const targetId = place ? place.id : (course.placeIds ? course.placeIds[idx] : null);

            return (
              <div key={idx} className="relative">
                {/* 화살표 구분자 (마지막 요소 제외) */}
                {idx > 0 && (
                  <div className="flex items-center justify-center py-2">
                    <div className="flex flex-col items-center">
                      <div className="w-0.5 h-4 bg-slate-300" />
                      <span className="text-slate-400 text-xs font-black">↓</span>
                    </div>
                  </div>
                )}

                {/* 관광지 카드 */}
                <div className="bg-white rounded-2xl border-2 border-slate-900 p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* 순서 넘버 배지 */}
                    <div className="w-10 h-10 rounded-2xl bg-[#0A2540] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    {/* 썸네일 (장소가 있을 때) */}
                    {place && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 hidden sm:block">
                        <TourApiImage
                          contentId={place.contentId}
                          src={place.image}
                          alt={place.nameKo}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* 정보 요약 */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-900">
                          {place ? (language === 'KR' ? place.nameKo : place.nameEn) : item.orderName}
                        </h3>
                        {place && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {place.accessibilityGrade === 'COMFORTABLE' ? '🟢 편안한 이동' : '🟡 주의'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 font-medium">
                        {place
                          ? (language === 'KR' ? place.descriptionKo : place.descriptionEn)
                          : item.note}
                      </p>

                      {/* 핵심 접근성 배지 1~2개 */}
                      {place && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {!place.accessibility.stairs && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              🟢 계단 없음
                            </span>
                          )}
                          {place.accessibility.elevator && (
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                              🛗 엘리베이터
                            </span>
                          )}
                          {place.accessibility.wheelchair && (
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                              ♿ 휠체어 가능
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 상세 보기 버튼 */}
                  {targetId ? (
                    <button
                      type="button"
                      onClick={() => onNavigateToPlace(targetId)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#11161B] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                    >
                      <span>{language === 'KR' ? '상세 보기' : 'View Details'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">
                      {language === 'KR' ? '코스 연계 쉼터' : 'Route Landmark'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
