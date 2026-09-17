/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 관광지 상세 페이지 (/barrier-free/place/:placeId)
 * - 상단: 사진, 이름, 주소, 소개
 * - 중앙: 무장애 정보 (확인된 실제 데이터만 표시)
 * - 하단: "어떻게 갈까요?" [ 🚇 지하철 ] [ 🚌 버스 ]
 * - 세로형 STEP UI로 직관적인 이동 경로 제공
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Train,
  Bus,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Compass,
  CornerDownRight,
  Sparkles,
} from 'lucide-react';
import {
  TouristPlace,
  UserType,
  BARRIER_FREE_PLACES,
  USER_TYPES,
  BUSAN_EXPERIENCES,
  TRAVEL_COMPANIONS,
} from '../data/barrierFreeData';
import { calculateAccessibleRoute } from '../utils/barrierFreeRecommendation';
import TourApiImage from './TourApiImage';

interface BarrierFreePlaceDetailViewProps {
  placeId: string;
  selectedUserType: UserType | null;
  language: 'KR' | 'EN';
  onBack: () => void;
  onSelectStation?: (stationId: string, exitNum?: string) => void;
  onSelectUserType?: (userType: UserType) => void;
}

export default function BarrierFreePlaceDetailView({
  placeId,
  selectedUserType,
  language,
  onBack,
  onSelectStation,
  onSelectUserType,
}: BarrierFreePlaceDetailViewProps) {
  const [transitTab, setTransitTab] = useState<'subway' | 'bus'>('subway');

  // 관광지 데이터 탐색 (id 또는 contentid 또는 contentId 기준)
  const place = BARRIER_FREE_PLACES.find(
    (p) =>
      p.id.toLowerCase() === placeId.toLowerCase() ||
      p.contentId.toLowerCase() === placeId.toLowerCase() ||
      p.contentid.toLowerCase() === placeId.toLowerCase()
  );

  if (!place) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <p className="text-base font-bold text-slate-700">
          {language === 'KR' ? '관광지 정보를 찾을 수 없습니다.' : 'Tourist place not found.'}
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#0A2540] text-white rounded-xl text-xs font-bold"
        >
          {language === 'KR' ? '← 이전 화면으로 돌아가기' : '← Back'}
        </button>
      </div>
    );
  }

  // 현재 사용자 유형 기준 경로 계산
  const effectiveUserType = selectedUserType || 'wheelchair';
  const routeResult = calculateAccessibleRoute(place, effectiveUserType, transitTab);
  const currentUserMeta = USER_TYPES.find((t) => t.id === effectiveUserType);

  // 확인된 무장애 편의시설 목록 (실제 확인된 데이터만 필터링)
  const verifiedAccessibilityItems: { label: string; verified: boolean; icon: string }[] = [];
  if (!place.accessibility.stairs) {
    verifiedAccessibilityItems.push({
      label: language === 'KR' ? '계단 없음 (무단차)' : 'Step-Free (Level Path)',
      verified: true,
      icon: '🟢',
    });
  }
  if (place.accessibility.wheelchair) {
    verifiedAccessibilityItems.push({
      label: language === 'KR' ? '휠체어 접근 가능' : 'Wheelchair Accessible',
      verified: true,
      icon: '🟢',
    });
  }
  if (place.accessibility.elevator) {
    verifiedAccessibilityItems.push({
      label: language === 'KR' ? '엘리베이터 설치' : 'Elevator Available',
      verified: true,
      icon: '🟢',
    });
  }
  if (place.accessibility.accessibleRestroom) {
    verifiedAccessibilityItems.push({
      label: language === 'KR' ? '장애인 전용 화장실' : 'Accessible Restroom',
      verified: true,
      icon: '🟢',
    });
  }
  if (place.accessibility.accessibleParking) {
    verifiedAccessibilityItems.push({
      label: language === 'KR' ? '장애인 전용 주차구역' : 'Accessible Parking',
      verified: true,
      icon: '🟢',
    });
  }
  if (place.accessibility.stroller) {
    verifiedAccessibilityItems.push({
      label: language === 'KR' ? '유아차 이용 가능' : 'Stroller Accessible',
      verified: true,
      icon: '🟢',
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6 sm:space-y-8 animate-fade-in text-left pb-20">
      {/* 1. 상단 내비게이션 바 */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#0A2540] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'KR' ? '이전 화면으로 돌아가기' : 'Back'}</span>
        </button>

        {selectedUserType && currentUserMeta && (
          <span className="text-xs font-bold text-[#0A2540] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            {currentUserMeta.icon} {language === 'KR' ? currentUserMeta.titleKo : currentUserMeta.titleEn} 이동 경로
          </span>
        )}
      </div>

      {/* 2. 관광지 헤더 & 대표 이미지 */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
        <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-slate-900">
          <TourApiImage
            contentId={place.contentId}
            src={place.image}
            alt={language === 'KR' ? place.nameKo : place.nameEn}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* 지역구 및 카테고리 */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-lg bg-[#0A2540] text-white text-xs font-bold shadow-xs">
              {language === 'KR' ? place.districtKo : place.districtEn}
            </span>
            <span className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold shadow-xs">
              {language === 'KR'
                ? (place.accessibilityGrade === 'COMFORTABLE' ? '🟢 편안한 이동' : '🟡 일부 주의')
                : (place.accessibilityGrade === 'COMFORTABLE' ? '🟢 Easy Step-Free' : '🟡 Caution Advised')}
            </span>
          </div>

          {/* 관광지 타이틀 */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm">
              {language === 'KR' ? place.nameKo : place.nameEn}
            </h1>
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <p className="text-xs sm:text-sm text-slate-200 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>{language === 'KR' ? place.addressKo : place.addressEn}</span>
              </p>
              {place.subwayLine && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-white/20 backdrop-blur-md text-white border border-white/30">
                  <Train className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{place.subwayLine}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 관광지 소개 */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* 3가지 맞춤 기준 매칭 성향 태그 (여행자 유형, 부산 여행 경험, 함께하는 여행) */}
          <div className="space-y-1.5 pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 block">
              {language === 'KR' ? '여행 맞춤 기준 매칭' : 'Matched Travel Preferences'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {place.bestFor?.map((typeId) => {
                const uMeta = USER_TYPES.find((u) => u.id === typeId);
                if (!uMeta) return null;
                return (
                  <span
                    key={typeId}
                    className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    {uMeta.icon} {language === 'KR' ? uMeta.titleKo : uMeta.titleEn}
                  </span>
                );
              })}
              {place.experienceTraits?.map((expId) => {
                const expMeta = BUSAN_EXPERIENCES.find((e) => e.id === expId);
                if (!expMeta) return null;
                return (
                  <span
                    key={expId}
                    className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200"
                  >
                    {expMeta.icon} {language === 'KR' ? expMeta.titleKo : expMeta.titleEn}
                  </span>
                );
              })}
              {place.companionTraits?.map((compId) => {
                const compMeta = TRAVEL_COMPANIONS.find((c) => c.id === compId);
                if (!compMeta) return null;
                return (
                  <span
                    key={compId}
                    className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200"
                  >
                    {compMeta.icon} {language === 'KR' ? compMeta.titleKo : compMeta.titleEn}
                  </span>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-black text-slate-900 mb-1">관광지 소개</h2>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              {language === 'KR' ? place.descriptionKo : place.descriptionEn}
            </p>
          </div>

          {/* 전화번호 & 지도 바로가기 */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs border-t border-slate-150">
            {place.tel && (
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>문의: {place.tel}</span>
              </span>
            )}
            <a
              href={`https://map.kakao.com/link/search/${encodeURIComponent(place.nameKo)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#0A2540] hover:underline font-bold ml-auto"
            >
              <span>카카오맵에서 위치 확인</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. 무장애 정보 (실제 확인된 데이터만 깔끔하게 표시) */}
      <section className="bg-white rounded-2xl border-2 border-slate-900 p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            {language === 'KR' ? '무장애 정보' : 'Accessibility Information'}
          </h2>
          <span className="text-[11px] font-bold text-slate-500">
            {language === 'KR' ? '현장 조사 및 공공데이터 검증' : 'Verified Public Data'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          {verifiedAccessibilityItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {place.accessibility.steepSlope && (
          <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium flex items-center gap-1.5 mt-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>일부 보행 구간에 완만한 경사가 있으니 보조자와 동행을 권장합니다.</span>
          </p>
        )}
      </section>

      {/* 4. 어떻게 갈까요? (대중교통 이동 방법) */}
      <section className="bg-white rounded-2xl border-2 border-slate-900 p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              {language === 'KR' ? '어떻게 갈까요?' : 'How to Get There'}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {language === 'KR'
                ? '계단 없이 이동할 수 있는 최적의 대중교통 경로를 안내합니다.'
                : 'Optimal step-free transit routes to the destination.'}
            </p>
          </div>

          {/* 지하철 / 버스 탭 버튼 */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTransitTab('subway')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                transitTab === 'subway'
                  ? 'bg-[#0A2540] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Train className="w-3.5 h-3.5" />
              <span>{language === 'KR' ? '지하철' : 'Subway'}</span>
            </button>
            <button
              type="button"
              onClick={() => setTransitTab('bus')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                transitTab === 'bus'
                  ? 'bg-[#0A2540] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bus className="w-3.5 h-3.5" />
              <span>{language === 'KR' ? '버스' : 'Bus'}</span>
            </button>
          </div>
        </div>

        {/* 맞춤형 이동 가이드 요약 배너 */}
        <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#0A2540]">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {currentUserMeta ? currentUserMeta.titleKo : '교통약자'} 맞춤 이동 팁
            </span>
          </div>
          <p className="font-medium text-slate-700 leading-relaxed">
            {routeResult.priorityTip}
          </p>
        </div>

        {/* 5. 세로형 STEP UI */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase">
            {language === 'KR' ? '단계별 이동 경로' : 'Step-by-Step Route'}
          </span>

          <div className="space-y-3">
            {routeResult.steps.map((step, idx) => (
              <div key={idx} className="relative">
                {/* 세로 화살표 */}
                {idx > 0 && (
                  <div className="flex items-center justify-center py-1">
                    <span className="text-slate-400 text-xs font-black">↓</span>
                  </div>
                )}

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-[#0A2540] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-2xs">
                    {step.stepNumber}
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                      {step.icon && <span>{step.icon}</span>}
                      <span>{step.title}</span>
                    </h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 지하철역 상세 안내 바로가기 버튼 */}
        {transitTab === 'subway' && place.transit.subway.stationId && onSelectStation && (
          <div className="pt-2 border-t border-slate-150">
            <button
              type="button"
              onClick={() => onSelectStation(place.transit.subway.stationId, place.transit.subway.exit)}
              className="w-full py-2.5 rounded-xl bg-[#FBFBF9] hover:bg-white border-2 border-slate-300 hover:border-[#0A2540] text-xs font-bold text-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Train className="w-4 h-4 text-[#0A2540]" />
              <span>
                {place.transit.subway.stationNameKo} 출구별 전체 승강기 상세 정보 확인
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
