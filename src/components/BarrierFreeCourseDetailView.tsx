import { Language } from '../i18n/dictionary';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 여행 코스 상세 페이지 (/barrier-free/course/:courseId)
 * - 좌측 (lg:col-span-7): 코스 요약 카드 + 추천 동선 요약 + 관광지 이동 순서 카드 (통일된 에디토리얼 박스 디자인)
 * - 우측 (lg:col-span-5 sticky): 코스 동선 지도 패널 (CourseStickyMapPanel)
 * - 각 관광지 클릭 시 관광지 상세 페이지(/barrier-free/place/:placeId)로 이동
 */

import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Clock,
  MapPin,
  ChevronRight,
  Award,
  Waves,
  Landmark,
  Compass,
  Train,
  Copy,
  Check,
  Star,
} from 'lucide-react';
import {
  TouristPlace,
  UserType,
  BARRIER_FREE_PLACES,
  BARRIER_FREE_COURSES,
  USER_TYPES,
} from '../data/barrierFreeData';
import { getKoreaTourApiPlaceDetail } from '../data/koreaTourApiPlaceDetails';
import { getPlaceImageUrl } from '../utils/barrierFreeRecommendation';
import { ItineraryCourse } from '../data/itineraries';
import { useMyRoute } from '../services/myRouteService';
import { SpotTicketBookingRow } from './BusanAffiliateQuickBar';
import { CourseStickyMapPanel } from './CourseStickyMapPanel';
import TourApiImage from './TourApiImage';

function CourseStepThumbnail({ contentId, src, alt }: { contentId?: string; src?: string; alt: string }) {
  const [error, setError] = React.useState(false);
  const initialUrl = src || (contentId ? getPlaceImageUrl(contentId) : undefined);

  React.useEffect(() => {
    setError(false);
  }, [initialUrl]);

  return (
    <div className="w-20 h-18 sm:w-24 sm:h-20 md:w-28 md:h-22 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-[#E5E2DC] shadow-2xs">
      {initialUrl && !error ? (
        <img
          src={initialUrl}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#FBFBF9] text-slate-400 p-1 text-center">
          <MapPin className="w-5 h-5 text-[#8EA85E]" />
        </div>
      )}
    </div>
  );
}

interface BarrierFreeCourseDetailViewProps {
  courseId: string;
  selectedUserType: UserType | null;
  language: Language;
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
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { isBookmarked, toggle } = useMyRoute();

  // 해당 코스 탐색
  const course = BARRIER_FREE_COURSES.find(
    (c) => c.id.toLowerCase() === courseId.toLowerCase()
  );

  // 코스 내 placeIds에 해당하는 관광지 목록 조회 및 TourAPI 연결
  const coursePlaces = useMemo(() => {
    if (!course) return [];
    return course.places.map((item, idx) => {
      let found: TouristPlace | null = null;
      if (item.spotId) {
        found = BARRIER_FREE_PLACES.find((p) => p.id === item.spotId) || null;
      }
      if (!found && course.placeIds && course.placeIds[idx]) {
        found = BARRIER_FREE_PLACES.find((p) => p.id === course.placeIds[idx]) || null;
      }
      const targetId = found ? found.id : (item.spotId || (course.placeIds ? course.placeIds[idx] : null));
      const ktoDetail = targetId ? getKoreaTourApiPlaceDetail(targetId) : null;
      const contentId = item.contentId || ktoDetail?.contentId || found?.contentId;

      return {
        place: found,
        ktoDetail,
        targetId,
        contentId,
        imageUrl: item.imageUrl,
        nameKo: item.nameKo,
        nameEn: item.nameEn,
        orderName: language === 'KR' ? item.nameKo : item.nameEn,
        noteKo: item.noteKo,
        noteEn: item.noteEn,
        note: language === 'KR' ? item.noteKo : item.noteEn,
        transitAccess: language === 'KR' ? item.transitAccessKo : item.transitAccessEn,
        transitRoutes: item.transitRoutes,
      };
    });
  }, [course, language]);

  // 우측 지도 패널용 ItineraryCourse 데이터 구성
  const mapCourse: ItineraryCourse | null = useMemo(() => {
    if (!course) return null;
    return {
      id: course.id,
      category: 'DAY',
      duration: 'DAY',
      titleKo: course.titleKo,
      titleEn: course.titleEn,
      subtitleKo: course.descriptionKo,
      subtitleEn: course.descriptionEn,
      badgeKo: course.tagKo,
      badgeEn: course.tagEn,
      summaryKo: course.descriptionKo,
      summaryEn: course.descriptionEn,
      totalTimeKo: course.durationKo,
      totalTimeEn: course.durationEn,
      steps: coursePlaces.map((item, idx) => ({
        id: item.targetId || `${course.id}-step-${idx + 1}`,
        contentId: item.contentId,
        titleKo: item.nameKo,
        titleEn: item.nameEn,
        shortTitleKo: item.nameKo,
        shortTitleEn: item.nameEn,
        descKo: item.noteKo,
        descEn: item.noteEn,
        addressRoadKo: item.ktoDetail?.addressRoadKo || item.place?.addressKo,
        addressRoadEn: item.ktoDetail?.addressRoadEn || item.place?.addressEn,
        latitude: item.ktoDetail?.latitude ?? item.place?.latitude,
        longitude: item.ktoDetail?.longitude ?? item.place?.longitude,
        stationInfoKo: item.ktoDetail?.nearestStationNameKo || item.place?.transit?.subway?.stationNameKo,
        stationInfoEn: item.ktoDetail?.nearestStationNameEn || item.place?.transit?.subway?.stationNameEn,
      })),
    };
  }, [course, coursePlaces]);

  if (!course || !mapCourse) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center space-y-4">
        <p className="text-base font-bold text-slate-700">
          {language === 'KR' ? '요청하신 여행 코스를 찾을 수 없습니다.' : 'Travel course not found.'}
        </p>
        <button
          onClick={onBackToCourseList}
          className="px-4 py-2 bg-[#8EA85E] text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          {language === 'KR' ? '← 추천 코스 목록으로 돌아가기' : '← Back to course list'}
        </button>
      </div>
    );
  }

  const currentUserMeta = USER_TYPES.find((t) => t.id === selectedUserType);

  const handleCopyAddress = (e: React.MouseEvent, text: string, idx: number) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in text-left pb-24">
      {/* 1. 상단 내비게이션 바 */}
      <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-3.5">
        <button
          type="button"
          onClick={onBackToCourseList}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#8EA85E] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'KR' ? '무장애 관광 목록으로 돌아가기' : 'Back to Barrier-Free Travel'}</span>
        </button>

        {selectedUserType && currentUserMeta && (
          <span className="text-xs font-bold text-slate-800 bg-[#FBFBF9] px-2.5 py-1 rounded-full border border-[#E5E2DC]">
            {currentUserMeta.icon} {language === 'KR' ? currentUserMeta.titleKo : currentUserMeta.titleEn}{' '}
            {language === 'KR' ? '맞춤 코스' : 'Course'}
          </span>
        )}
      </div>

      {/* 2. 좌측 코스 상세 + 우측 고정 지도 12열 그리드 (다른 여행코스 페이지와 동일 레이아웃) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 좌측: 코스 헤더 + 추천 동선 요약 + 관광지 이동 순서 카드 */}
        <div className="lg:col-span-7 min-w-0 space-y-5">
          {/* 코스 대표 사진 & 핵심 요약 카드 (통일된 에디토리얼 테이블 박스) */}
          <div className="bg-white rounded-xl border border-[#E5E2DC] overflow-hidden shadow-2xs">
            {/* 대표 이미지 */}
            <div className="relative h-52 sm:h-64 w-full overflow-hidden bg-slate-900">
              <TourApiImage
                src={course.image}
                alt={language === 'KR' ? course.titleKo : course.titleEn}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* 태그 & 난이도 */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#8EA85E] text-white text-[11px] font-bold shadow-2xs">
                  {language === 'KR' ? course.tagKo : course.tagEn}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600/95 text-white text-[11px] font-bold shadow-2xs">
                  {language === 'KR' ? course.difficultyTextKo : course.difficultyTextEn}
                </span>
              </div>

              {/* 타이틀 오버레이 */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug drop-shadow-xs flex items-center gap-2">
                  {course.id === 'course-haeundae-ocean' ? (
                    <Waves className="w-5 h-5 sm:w-6 sm:h-6 text-[#8EA85E] shrink-0 stroke-[2.2]" />
                  ) : (
                    <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-[#8EA85E] shrink-0 stroke-[2.2]" />
                  )}
                  <span>{language === 'KR' ? course.titleKo : course.titleEn}</span>
                </h1>
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-200 font-medium">
                  <span className="flex items-center gap-1 font-bold text-amber-300">
                    <Clock className="w-3.5 h-3.5" />
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

            {/* 코스 간결 소개 문구 & 접근성 배지 */}
            <div className="p-4 sm:p-5 bg-white border-t border-[#E5E2DC] space-y-3">
              <p className="text-xs sm:text-sm text-[#4A5568] font-medium leading-relaxed">
                {language === 'KR' ? course.descriptionKo : course.descriptionEn}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {course.accessibilityBadges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg font-bold bg-[#FBFBF9] text-slate-800 border border-[#E5E2DC] flex items-center gap-1"
                  >
                    <span>{badge.icon}</span>
                    <span>{language === 'KR' ? badge.textKo : badge.textEn}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 추천 동선 요약 플로우 (다른 여행코스 페이지와 동일한 스타일) */}
          <div className="bg-slate-50/80 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs font-bold text-slate-800">
            <span className="text-[10.5px] sm:text-[11px] font-bold text-[#8EA85E] bg-white px-2.5 py-1 rounded-lg sm:rounded-xl shadow-2xs uppercase tracking-wider shrink-0 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#8EA85E]" />
              <span>{language === 'KR' ? '추천 동선 요약' : 'Route Flow'}</span>
            </span>
            <div className="flex items-center flex-wrap gap-1 sm:gap-1.5 text-slate-800">
              {coursePlaces.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />}
                  <span className="bg-white px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs text-slate-800 shadow-2xs break-keep">
                    {item.orderName}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 관광지 이동 순서 및 무장애 요약 */}
          <section className="space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {language === 'KR' ? '관광지 이동 순서 및 무장애 요약' : 'Itinerary Sequence & Accessibility'}
              </h2>
              <span className="text-[11px] font-bold text-[#8EA85E] bg-[#FBFBF9] px-2.5 py-1 rounded-full border border-[#E5E2DC] self-start sm:self-auto flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>{language === 'KR' ? '한국관광공사 무장애 인증 연동' : 'TourAPI Certified'}</span>
              </span>
            </div>

            <div className="space-y-3.5">
              {coursePlaces.map((item, idx) => {
                const {
                  place,
                  ktoDetail,
                  targetId,
                  contentId,
                  imageUrl,
                  nameKo,
                  nameEn,
                  orderName,
                  noteKo,
                  noteEn,
                  note,
                  transitAccess,
                  transitRoutes,
                } = item;
                const placeImage = ktoDetail?.firstImage || imageUrl || place?.image || '';
                const stationGuide =
                  language === 'KR'
                    ? ktoDetail?.nearestStationNameKo || place?.transit?.subway?.stationNameKo
                    : ktoDetail?.nearestStationNameEn ||
                      place?.transit?.subway?.stationNameEn ||
                      ktoDetail?.nearestStationNameKo ||
                      place?.transit?.subway?.stationNameKo;
                const effectiveAddressKo = ktoDetail?.addressRoadKo || place?.addressKo || '';
                const effectiveAddressEn = ktoDetail?.addressRoadEn || place?.addressEn || effectiveAddressKo;
                const effectiveAddress = language === 'KR' ? effectiveAddressKo : effectiveAddressEn;
                const naverMapUrl = `https://map.naver.com/p/search/${encodeURIComponent(nameKo + ' 부산')}`;
                const googleMapUrl = `https://maps.google.com/?q=${encodeURIComponent(nameKo + ' 부산')}`;
                const bookmarkId = targetId || nameKo;
                const isSaved = isBookmarked(bookmarkId);

                return (
                  <div key={idx} className="relative group text-left space-y-1.5">
                    {/* 타임라인 인덱스 배지 (다른 코스 페이지 TourApiItineraryStepCard와 통일) */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#8EA85E]">
                        <span className="w-5 h-5 rounded-full bg-[#8EA85E] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-mono text-[11px] text-[#4A5568]">
                          STEP {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {language === 'KR' ? '🟢 편안한 이동' : '🟢 Comfortable'}
                      </span>
                    </div>

                    {/* 통일된 에디토리얼 카드 박스 */}
                    <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E5E2DC] space-y-2.5 text-left shadow-2xs hover:border-[#8EA85E] transition-all">
                      <div className="flex flex-row items-start gap-2.5 sm:gap-3">
                        <CourseStepThumbnail
                          contentId={contentId}
                          src={placeImage}
                          alt={orderName}
                        />

                        <div className="flex-1 min-w-0 space-y-1.5 text-left">
                          {/* 제목 & 액션 버튼 */}
                          <div className="flex items-start justify-between gap-1.5 flex-wrap">
                            <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 leading-snug break-keep">
                              {orderName}
                            </h3>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggle({
                                    id: bookmarkId,
                                    titleKo: nameKo,
                                    titleEn: nameEn,
                                    categoryKo: '무장애 추천코스',
                                    categoryEn: 'Barrier-Free Course',
                                    addressRoadKo: effectiveAddressKo,
                                    addressRoadEn: effectiveAddressEn,
                                    stationInfoKo: stationGuide,
                                    stationInfoEn: stationGuide,
                                    descKo: noteKo,
                                    descEn: noteEn,
                                    firstImage: placeImage,
                                    latitude: ktoDetail?.latitude ?? place?.latitude,
                                    longitude: ktoDetail?.longitude ?? place?.longitude,
                                  });
                                }}
                                className={`px-2 py-0.5 rounded-md border transition-all cursor-pointer flex items-center gap-1 text-[10.5px] sm:text-[11px] font-bold shrink-0 ${
                                  isSaved
                                    ? 'bg-amber-50 text-amber-600 border-amber-300 hover:bg-amber-100 shadow-2xs'
                                    : 'bg-white text-slate-400 border-slate-200 hover:text-amber-500 hover:border-amber-200 hover:bg-amber-50/40'
                                }`}
                              >
                                <Star className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isSaved ? 'fill-amber-400 text-amber-500' : ''}`} />
                                <span>
                                  {isSaved
                                    ? language === 'KR'
                                      ? '루트 담김'
                                      : 'In Route'
                                    : language === 'KR'
                                      ? '루트 추가'
                                      : 'Add'}
                                </span>
                              </button>

                              {targetId && (
                                <button
                                  type="button"
                                  onClick={() => onNavigateToPlace(targetId)}
                                  className="px-2.5 py-0.5 rounded-md bg-[#8EA85E] hover:bg-[#7b944f] text-white text-[10.5px] sm:text-[11px] font-bold transition-all flex items-center gap-0.5 shrink-0 cursor-pointer shadow-2xs"
                                >
                                  <span>{language === 'KR' ? '무장애 상세' : 'Details'}</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* 설명 요약 */}
                          <p className="text-[11px] sm:text-xs text-[#4A5568] leading-relaxed break-keep">
                            {note}
                          </p>

                          {/* 무장애 핵심 편의시설 태그 */}
                          <div className="flex flex-wrap items-center gap-1 pt-0.5">
                            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                              <span>♿</span>
                              <span>{language === 'KR' ? '무단차 보행로' : 'Step-free'}</span>
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 flex items-center gap-1">
                              <span>🛗</span>
                              <span>{language === 'KR' ? '엘리베이터 완비' : 'Elevator'}</span>
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 flex items-center gap-1">
                              <span>🚻</span>
                              <span>{language === 'KR' ? '장애인 화장실' : 'Accessible WC'}</span>
                            </span>
                            {stationGuide && (
                              <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 bg-[#FBFBF9] px-2 py-0.5 rounded-md border border-[#E5E2DC] flex items-center gap-1">
                                <Train className="w-3 h-3 text-[#8EA85E] shrink-0" />
                                <span>{stationGuide}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 대중교통 접근 방법 안내 (통일된 에디토리얼 서브 박스) */}
                      {transitRoutes && transitRoutes.length > 0 ? (
                        <div className="bg-[#FBFBF9] p-2.5 sm:p-3 rounded-lg border border-[#E5E2DC] space-y-1.5 text-[11px] sm:text-xs">
                          {transitRoutes.map((route, rIdx) => (
                            <div key={rIdx} className="space-y-0.5">
                              <span className="font-bold text-slate-800 block">
                                {language === 'KR' ? route.labelKo : route.labelEn}
                              </span>
                              <p className="text-[#4A5568] font-medium leading-relaxed">
                                {language === 'KR' ? route.routeKo : route.routeEn}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : transitAccess ? (
                        <div className="bg-[#FBFBF9] px-2.5 py-2 rounded-lg border border-[#E5E2DC] text-[11px] sm:text-xs text-[#4A5568] font-medium">
                          {transitAccess}
                        </div>
                      ) : null}

                      {/* 티켓 예매 연동 */}
                      <SpotTicketBookingRow spotTitleKo={place?.nameKo || nameKo} language={language} />

                      {/* 하단 주소 & 지도 연결 (TourApiItineraryStepCard와 동일) */}
                      {effectiveAddress && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 text-xs flex-wrap">
                          <div className="flex items-center gap-1 text-slate-600 min-w-0 flex-1">
                            <MapPin className="w-3 h-3 text-[#8EA85E] shrink-0" />
                            <span className="text-[10.5px] sm:text-[11px] font-medium leading-tight break-keep">
                              {effectiveAddress}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => handleCopyAddress(e, effectiveAddress, idx)}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 flex items-center gap-0.5 transition-colors cursor-pointer"
                              title={language === 'KR' ? '주소 복사' : 'Copy address'}
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Check className="w-2.5 h-2.5 text-emerald-600" />
                                  <span className="text-emerald-700 font-bold">
                                    {language === 'KR' ? '복사됨' : 'Copied'}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-2.5 h-2.5" />
                                  <span>{language === 'KR' ? '복사' : 'Copy'}</span>
                                </>
                              )}
                            </button>

                            <a
                              href={naverMapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-5.5 h-5.5 rounded-md bg-[#03C75A] hover:bg-[#02b350] flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
                              title={language === 'KR' ? `${nameKo} 네이버 지도에서 보기` : 'View on Naver Map'}
                              aria-label="Naver Map"
                            >
                              <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">
                                <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
                              </svg>
                            </a>

                            <a
                              href={googleMapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-5.5 h-5.5 rounded-md bg-white border border-slate-200 hover:border-[#4285F4]/40 flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
                              title={language === 'KR' ? `${nameKo} 구글 지도에서 보기` : 'View on Google Maps'}
                              aria-label="Google Maps"
                            >
                              <svg viewBox="0 0 92 135" className="w-2.5 h-2.5" fill="none">
                                <path d="M46 0C20.596 0 0 20.596 0 46c0 34.5 46 89 46 89s46-54.5 46-89C92 20.596 71.404 0 46 0z" fill="#4285F4" />
                                <path d="M46 0c-25.404 0-46 20.596-46 46 0 11.233 4.025 21.528 10.72 29.5L46 46V0z" fill="#EA4335" />
                                <path d="M46 46l35.28 29.5C87.975 67.528 92 57.233 92 46c0-25.404-20.596-46-46-46v46z" fill="#FBBC04" />
                                <path d="M46 46v89s24.62-29.215 37.8-57.5L46 46z" fill="#34A853" />
                                <circle cx="46" cy="46" r="18" fill="#FFFFFF" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* 우측: 고정 코스 지도 패널 (다른 여행코스 페이지와 동일) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <CourseStickyMapPanel
            course={mapCourse}
            language={language}
            hidePolyline={false}
            customHeaderTitleKo="무장애 추천 코스 지도"
            customHeaderTitleEn="Barrier-Free Course Map"
          />
        </div>
      </div>
    </div>
  );
}
