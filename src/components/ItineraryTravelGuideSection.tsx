/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * STEP 2-3: Stepless 부산 여행 일정표 큐레이션 전용 컴포넌트
 * 기존 일정표를 100% 보존하면서, 여행자 관점의 '왜 이 순서인가',
 * '무단차 이동 전략', '여행자 맞춤 가이드'를 직관적으로 제공합니다.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  Train,
  CheckCircle2,
  Clock,
  MapPin,
  Footprints,
  Info,
  ChevronRight,
  Sun,
  Umbrella,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  Sunset,
  Utensils
} from 'lucide-react';
import { ITINERARY_TRAVEL_GUIDE_DATA, ItineraryTravelGuideItem } from '../data/itineraryTravelGuideData';
import { ItineraryCourse } from '../data/itineraries';

interface ItineraryTravelGuideSectionProps {
  language: 'KR' | 'EN';
  category: 'DAY' | '1NIGHT' | '2NIGHTS' | '3NIGHTS' | '4NIGHTS' | 'GOURMET' | 'EXPERIENCE' | 'SUBWAY';
  course?: ItineraryCourse;
  onSwitchToStandard?: () => void;
  onSelectStation?: (stationId: string, exitNum?: string) => void;
}

export default function ItineraryTravelGuideSection({
  language,
  category,
  course,
  onSwitchToStandard,
  onSelectStation
}: ItineraryTravelGuideSectionProps) {
  // For 'DAY' category, support toggling between course 1 (원도심) and course 2 (생태공원)
  const [selectedDayCourseId, setSelectedDayCourseId] = useState<string>('itinerary-day-first-time');

  // Determine active guide data item
  let activeGuideKey = '';
  if (category === 'DAY') {
    activeGuideKey = selectedDayCourseId;
  } else if (category === '1NIGHT') {
    activeGuideKey = 'itinerary-1night';
  } else if (category === '2NIGHTS') {
    activeGuideKey = 'itinerary-2nights';
  } else if (category === '3NIGHTS') {
    activeGuideKey = 'itinerary-3nights';
  } else if (category === '4NIGHTS') {
    activeGuideKey = 'itinerary-4nights';
  } else if (category === 'GOURMET') {
    activeGuideKey = 'itinerary-gourmet';
  } else if (category === 'EXPERIENCE') {
    activeGuideKey = 'itinerary-experience';
  } else if (category === 'SUBWAY') {
    activeGuideKey = 'subway-course-master';
  } else {
    activeGuideKey = 'itinerary-day-first-time';
  }

  const guide: ItineraryTravelGuideItem | undefined = ITINERARY_TRAVEL_GUIDE_DATA[activeGuideKey];

  if (!guide) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#E5E2DC] text-center text-[#4A5568]">
        <p>{language === 'KR' ? '선택한 코스의 여행안내를 준비 중입니다.' : 'Travel guide for this course is being prepared.'}</p>
      </div>
    );
  }

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Train': return <Train className="w-4 h-4" />;
      case 'MapPin': return <MapPin className="w-4 h-4" />;
      case 'Compass': return <Compass className="w-4 h-4" />;
      case 'Building2': return <Building2 className="w-4 h-4" />;
      case 'Sunset': return <Sunset className="w-4 h-4" />;
      case 'Utensils': return <Utensils className="w-4 h-4" />;
      case 'Footprints': return <Footprints className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-left font-sans">
      
      {/* 1. Header Banner */}
      <div className="bg-[#0A2540] text-white p-6 sm:p-8 rounded-xl border border-[#0A2540] relative overflow-hidden shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-400/20 text-amber-300 text-xs font-mono font-bold px-3 py-1 rounded-md border border-amber-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'KR' ? 'Stepless 큐레이션' : 'Stepless Curation'}</span>
            </span>
            <span className="text-[#E5E2DC] text-xs font-mono">
              {language === 'KR' ? guide.recommendedDurationKo : guide.recommendedDurationEn}
            </span>
          </div>

          {onSwitchToStandard && (
            <button
              onClick={onSwitchToStandard}
              className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md border border-white/20 transition-colors cursor-pointer shrink-0"
            >
              <span>{language === 'KR' ? '기본 일정표 보기' : 'View Standard Schedule'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* DAY category sub-selector */}
        {category === 'DAY' && (
          <div className="mb-4 inline-flex p-1 bg-white/10 rounded-lg border border-white/20 gap-1">
            <button
              onClick={() => setSelectedDayCourseId('itinerary-day-first-time')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                selectedDayCourseId === 'itinerary-day-first-time'
                  ? 'bg-white text-[#0A2540] shadow-2xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {language === 'KR' ? '① 원도심 정복 코스' : '① Historic Downtown'}
            </button>
            <button
              onClick={() => setSelectedDayCourseId('itinerary-day')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                selectedDayCourseId === 'itinerary-day'
                  ? 'bg-white text-[#0A2540] shadow-2xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {language === 'KR' ? '② 낙동강 생태 디톡스' : '② Nakdong Eco Detox'}
            </button>
          </div>
        )}

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-heading text-white tracking-tight leading-snug">
          {language === 'KR' ? guide.dayTitleKo : guide.dayTitleEn}
        </h2>
        <p className="text-xs sm:text-sm text-sky-100/90 mt-2.5 font-normal leading-relaxed max-w-3xl">
          {language === 'KR' ? guide.oneLineSummaryKo : guide.oneLineSummaryEn}
        </p>
      </div>

      {/* 2. Key Metrics Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: 소요 시간 */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E2DC] flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0A2540]/5 text-[#0A2540] flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <span className="text-[11px] font-bold text-[#4A5568] uppercase tracking-wider block">
              {language === 'KR' ? '추천 소요시간' : 'Duration'}
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#11161B] block truncate">
              {language === 'KR' ? guide.recommendedDurationKo : guide.recommendedDurationEn}
            </span>
          </div>
        </div>

        {/* Metric 2: 주요 권역 */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E2DC] flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0A2540]/5 text-[#0A2540] flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <span className="text-[11px] font-bold text-[#4A5568] uppercase tracking-wider block">
              {language === 'KR' ? '주요 이동 권역' : 'Regions'}
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#11161B] block truncate">
              {language === 'KR' ? guide.mainRegionsKo : guide.mainRegionsEn}
            </span>
          </div>
        </div>

        {/* Metric 3: 이동 수단 */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E2DC] flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0A2540]/5 text-[#0A2540] flex items-center justify-center shrink-0">
            <Train className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <span className="text-[11px] font-bold text-[#4A5568] uppercase tracking-wider block">
              {language === 'KR' ? '이동 및 환승' : 'Transit'}
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#11161B] block truncate">
              {language === 'KR' ? guide.transitMethodKo : guide.transitMethodEn}
            </span>
          </div>
        </div>

        {/* Metric 4: 보행 난이도 */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E2DC] flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0A2540]/5 text-[#0A2540] flex items-center justify-center shrink-0">
            <Footprints className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-[#4A5568] uppercase tracking-wider">
                {language === 'KR' ? '보행 난이도' : 'Difficulty'}
              </span>
              <div className="flex gap-0.5 ml-1">
                {[1, 2, 3].map(dot => (
                  <span
                    key={dot}
                    className={`w-2 h-2 rounded-full ${
                      dot <= guide.difficultyScore ? 'bg-amber-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#11161B] block truncate">
              {language === 'KR' ? guide.difficultyLabelKo : guide.difficultyLabelEn}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Recommended Travelers (이런 분께 딱 맞아요) */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E2DC] space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E5E2DC] pb-3">
          <ShieldCheck className="w-5 h-5 text-[#0A2540]" />
          <h3 className="text-base sm:text-lg font-bold text-[#11161B]">
            {language === 'KR' ? '이 코스를 추천하는 여행자' : 'Recommended For'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {guide.targetAudiences.map((target, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-[#FBFBF9] border border-[#E5E2DC] flex items-start gap-3.5"
            >
              <span className="text-2xl shrink-0">{target.icon}</span>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-[#11161B]">
                  {language === 'KR' ? target.labelKo : target.labelEn}
                </h4>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  {language === 'KR' ? target.reasonKo : target.reasonEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Why This Order? (왜 이 순서로 여행할까요?) */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E2DC] space-y-5">
        <div className="flex items-center gap-2 border-b border-[#E5E2DC] pb-3">
          <Compass className="w-5 h-5 text-[#0A2540]" />
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#11161B]">
              {language === 'KR' ? guide.whyThisOrderKo.titleKo : guide.whyThisOrderEn.titleEn}
            </h3>
            <p className="text-xs text-[#4A5568] mt-0.5">
              {language === 'KR' ? '동선 낭비를 없애는 Stepless 지리적 최적화 해석' : 'Stepless geographic route optimization'}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#333] leading-relaxed bg-[#FBFBF9] p-4 rounded-lg border border-[#E5E2DC]">
          {language === 'KR' ? guide.whyThisOrderKo.descriptionKo : guide.whyThisOrderEn.descriptionEn}
        </p>

        {/* Chronological Flow */}
        <div className="space-y-2.5 pt-1">
          <span className="text-xs font-bold font-mono text-[#0A2540] uppercase tracking-wider block">
            {language === 'KR' ? '⏱️ 시간대별 동선 흐름' : '⏱️ Chronological Flow'}
          </span>
          <div className="relative pl-6 sm:pl-8 space-y-3.5">
            <div className="absolute left-[11px] sm:left-[15px] top-2 bottom-2 w-0.5 bg-[#E5E2DC]" />
            {(language === 'KR' ? guide.whyThisOrderKo.flowStepsKo : guide.whyThisOrderEn.flowStepsEn).map((step, sidx) => (
              <div key={sidx} className="relative flex items-start gap-3">
                <div className="absolute -left-[24px] sm:-left-[28px] top-0.5 w-5 h-5 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-[10px] font-mono font-bold shrink-0 shadow-2xs">
                  {sidx + 1}
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#E5E2DC] text-xs sm:text-sm font-medium text-[#11161B] w-full">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Stepless Points (무단차 이동 포인트) */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E2DC] space-y-5">
        <div className="flex items-center gap-2 border-b border-[#E5E2DC] pb-3">
          <Footprints className="w-5 h-5 text-[#0A2540]" />
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#11161B]">
              {language === 'KR' ? 'Stepless 무단차 이동 핵심 포인트' : 'Stepless Barrier-Free Points'}
            </h3>
            <p className="text-xs text-[#4A5568] mt-0.5">
              {language === 'KR' ? '계단과 턱을 사전에 우회하는 현장 검증 가이드' : 'Field-verified bypasses for stairs and curbs'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guide.steplessPoints.map((point, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl bg-white border border-[#E5E2DC] hover:border-[#0A2540] transition-colors space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-[#0A2540]/10 text-[#0A2540]">
                  {renderIcon(point.icon)}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#11161B]">
                  {language === 'KR' ? point.titleKo : point.titleEn}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                {language === 'KR' ? point.descKo : point.descEn}
              </p>
              {point.stationInfo && (
                <div className="mt-2 text-xs font-semibold text-[#0A2540] bg-[#FBFBF9] px-2.5 py-1 rounded-md border border-[#E5E2DC] flex items-center gap-1.5 max-w-max">
                  <Train className="w-3.5 h-3.5" />
                  <span>{point.stationInfo}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 6. Highlights (이 코스에서 놓치지 마세요) */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E2DC] space-y-5">
        <div className="flex items-center gap-2 border-b border-[#E5E2DC] pb-3">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="text-base sm:text-lg font-bold text-[#11161B]">
            {language === 'KR' ? '이 코스에서 놓치지 마세요' : 'Course Highlights'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guide.highlights.map((h, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E2DC] space-y-1.5"
            >
              <h4 className="text-xs sm:text-sm font-bold text-[#11161B] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0A2540] shrink-0" />
                <span>{language === 'KR' ? h.titleKo : h.titleEn}</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed pl-5.5">
                {language === 'KR' ? h.descKo : h.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Short Course Option (시간이 부족하다면) */}
      {guide.shortCourse && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E2DC] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E5E2DC] pb-3">
            <Clock className="w-5 h-5 text-[#0A2540]" />
            <h3 className="text-base sm:text-lg font-bold text-[#11161B]">
              {language === 'KR' ? guide.shortCourse.titleKo : guide.shortCourse.titleEn}
            </h3>
          </div>

          <div className="bg-[#FBFBF9] p-4 rounded-lg border border-[#E5E2DC] space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0A2540]">
              <span className="px-2 py-0.5 rounded bg-white border border-[#E5E2DC] font-mono text-xs">
                {language === 'KR' ? '압축 경로' : 'Route'}
              </span>
              <span>{language === 'KR' ? guide.shortCourse.routeKo : guide.shortCourse.routeEn}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
              💡 {language === 'KR' ? guide.shortCourse.tipKo : guide.shortCourse.tipEn}
            </p>
          </div>
        </div>
      )}

      {/* 8. Rainy Day Option (☔ 비 오는 날 대안) */}
      {guide.rainyDayOption && (
        <div className="bg-sky-50/50 p-6 sm:p-8 rounded-xl border border-sky-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-sky-200 pb-3">
            <Umbrella className="w-5 h-5 text-sky-700" />
            <h3 className="text-base sm:text-lg font-bold text-sky-950">
              {language === 'KR' ? guide.rainyDayOption.titleKo : guide.rainyDayOption.titleEn}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-sky-900 leading-relaxed">
            {language === 'KR' ? guide.rainyDayOption.descKo : guide.rainyDayOption.descEn}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {(language === 'KR' ? guide.rainyDayOption.indoorSpotsKo : guide.rainyDayOption.indoorSpotsEn).map((spot, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-md bg-white border border-sky-200 text-xs font-semibold text-sky-900 flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-sky-600" />
                <span>{spot}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 9. Connected Places (함께 묶어가기 좋은 곳) */}
      {guide.connectedPlaces && guide.connectedPlaces.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E2DC] space-y-5">
          <div className="flex items-center gap-2 border-b border-[#E5E2DC] pb-3">
            <MapPin className="w-5 h-5 text-[#0A2540]" />
            <h3 className="text-base sm:text-lg font-bold text-[#11161B]">
              {language === 'KR' ? '함께 묶어가기 좋은 인접 명소' : 'Nearby Connections'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guide.connectedPlaces.map((conn, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-[#FBFBF9] border border-[#E5E2DC] space-y-2"
              >
                <h4 className="text-xs sm:text-sm font-bold text-[#11161B] flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#0A2540]" />
                  <span>{language === 'KR' ? conn.nameKo : conn.nameEn}</span>
                </h4>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  {language === 'KR' ? conn.connectionReasonKo : conn.connectionReasonEn}
                </p>
                <div className="text-xs font-medium text-[#0A2540] bg-white px-2.5 py-1 rounded-md border border-[#E5E2DC] flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5" />
                  <span>{language === 'KR' ? conn.transitTipKo : conn.transitTipEn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Switch to Standard Schedule */}
      {onSwitchToStandard && (
        <div className="bg-[#FBFBF9] p-5 rounded-xl border border-[#E5E2DC] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="text-xs font-bold text-[#11161B] block">
              {language === 'KR' ? '상세 단계별 시간표가 필요하신가요?' : 'Need detailed step-by-step timetables?'}
            </span>
            <span className="text-xs text-[#4A5568]">
              {language === 'KR' ? '기존 기본 일정표에서 1시간 단위 이동 경로와 지도를 확인할 수 있습니다.' : 'Check the standard schedule for 1-hour interval routes and map cards.'}
            </span>
          </div>
          <button
            onClick={onSwitchToStandard}
            className="px-4 py-2 rounded-lg bg-[#0A2540] hover:bg-[#11161B] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            {language === 'KR' ? '기본 일정표로 전환' : 'Switch to Standard Schedule'}
          </button>
        </div>
      )}

    </div>
  );
}
