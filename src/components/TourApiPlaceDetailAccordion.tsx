/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 한국관광공사 (KTO) TourAPI 무장애 상세 정보 인라인 아코디언 컴포넌트
 * 기존 답답한 팝업 모달 대신 웹/모바일 모두에서 스크롤과 가독성이 쾌적하도록
 * 페이지 내부에서 자연스럽게 펼쳐지는 반응형 상세 레이아웃을 제공합니다.
 * 복잡하고 딱딱한 인증 텍스트('공인', '실시간 동기화')를 배제하고
 * 정갈한 여백과 명확한 무장애 편의시설 정보를 제공합니다.
 */

import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Copy, 
  Check, 
  ExternalLink, 
  Train, 
  Clock, 
  Calendar, 
  CreditCard,
  ChevronUp,
  Info,
  Accessibility
} from 'lucide-react';
import { useTourApiSpot } from '../services/tourApiCommon';

interface TourApiPlaceDetailAccordionProps {
  placeId: string;
  language?: 'KR' | 'EN';
  onSelectStation?: (stationName: string) => void;
  onCollapse?: () => void;
  className?: string;
}

export const TourApiPlaceDetailAccordion: React.FC<TourApiPlaceDetailAccordionProps> = ({
  placeId,
  language = 'KR',
  onSelectStation,
  onCollapse,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const { detail, loading } = useTourApiSpot(placeId || '');

  const handleCopyAddress = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const bf = detail?.barrierFree;

  if (loading && !detail) {
    return (
      <div className={`p-5 rounded-xl bg-[#F9F8F6] border border-[#E5E2DC] text-center space-y-2.5 my-3 ${className}`}>
        <div className="w-7 h-7 border-2 border-[#0A2540] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#4A5568]">
          {language === 'KR' ? '무장애 편의시설 정보를 불러오는 중입니다...' : 'Loading accessibility specifications...'}
        </p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className={`p-4 rounded-xl bg-[#F9F8F6] border border-[#E5E2DC] text-center space-y-2 my-3 ${className}`}>
        <p className="text-xs text-[#4A5568]">
          {language === 'KR' ? '상세 무장애 정보가 준비 중입니다.' : 'Detailed accessibility specifications are being prepared.'}
        </p>
        {onCollapse && (
          <button
            type="button"
            onClick={onCollapse}
            className="text-xs font-semibold text-[#0A2540] underline hover:text-[#07192C]"
          >
            {language === 'KR' ? '접기' : 'Close'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`mt-3 rounded-xl bg-[#F9F8F6] border border-[#E5E2DC] p-4 sm:p-5 space-y-5 text-left transition-all ${className}`}>
      {/* 1. 상단 타이틀 & 접기 버튼 (복잡한 공인/동기화 뱃지 완전 삭제 및 깔끔한 여백 정돈) */}
      <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0A2540] text-white flex items-center justify-center shrink-0">
            <Accessibility className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#718096]">
              {language === 'KR' ? detail.categoryKo : detail.categoryEn} · {detail.districtKo}
            </div>
            <h4 className="text-sm sm:text-base font-bold text-[#11161B] leading-tight">
              {language === 'KR' ? `${detail.nameKo} 무장애 편의 정보` : `${detail.nameEn} Accessibility Info`}
            </h4>
          </div>
        </div>

        {onCollapse && (
          <button
            type="button"
            onClick={onCollapse}
            className="text-xs font-bold text-[#4A5568] hover:text-[#0A2540] bg-white hover:bg-[#F1EFEC] px-3 py-1.5 rounded-lg border border-[#E5E2DC] transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            title={language === 'KR' ? '무장애 정보 접기' : 'Fold info'}
          >
            <span>{language === 'KR' ? '접기' : 'Close'}</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. 대표 이미지 (있을 경우) */}
      {detail.firstImage && (
        <div className="relative rounded-xl overflow-hidden aspect-[16/9] max-h-52 sm:max-h-64 bg-slate-100 border border-[#E5E2DC]">
          <img
            src={detail.firstImage}
            alt={language === 'KR' ? detail.nameKo : detail.nameEn}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
            <span className="text-xs font-bold drop-shadow-sm">
              {language === 'KR' ? detail.nameKo : detail.nameEn}
            </span>
            <span className="text-[11px] font-medium text-white/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
              {detail.districtKo}
            </span>
          </div>
        </div>
      )}

      {/* 3. 도로명 주소 및 연락처 */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E5E2DC] space-y-2 shadow-2xs">
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2 text-xs sm:text-sm text-[#11161B]">
            <MapPin className="w-4 h-4 text-[#0A2540] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#0A2540]">{language === 'KR' ? '도로명 주소: ' : 'Address: '}</span>
              <span>{language === 'KR' ? detail.addressRoadKo : detail.addressRoadEn}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleCopyAddress(detail.addressRoadKo)}
            className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#FBFBF9] border border-[#E5E2DC] text-[#4A5568] hover:text-[#0A2540] hover:bg-[#F4EBE1] flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
            title="주소 복사"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">{language === 'KR' ? '복사됨' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{language === 'KR' ? '주소 복사' : 'Copy'}</span>
              </>
            )}
          </button>
        </div>

        {detail.tel && (
          <div className="flex items-center gap-2 text-xs text-[#4A5568] pt-2 border-t border-[#E5E2DC]/60">
            <Phone className="w-3.5 h-3.5 text-[#0A2540] shrink-0" />
            <span className="font-medium text-[#11161B]">{language === 'KR' ? '문의 전화: ' : 'Contact: '}</span>
            <a 
              href={`tel:${detail.tel.replace(/[^0-9]/g, '')}`}
              className="text-[#0A2540] hover:underline font-semibold"
            >
              {detail.tel}
            </a>
            {detail.telDescKo && <span className="text-slate-400">({detail.telDescKo})</span>}
          </div>
        )}
      </div>

      {/* 4. 이용시간 / 휴무일 / 이용요금 (정보가 있는 경우) */}
      {(detail.useTimeKo || detail.restDateKo || detail.feeKo) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#4A5568]">
          {detail.useTimeKo && (
            <div className="p-3 rounded-lg bg-white border border-[#E5E2DC] flex items-start gap-2 shadow-2xs">
              <Clock className="w-4 h-4 text-[#0A2540] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#11161B]">{language === 'KR' ? '이용 시간' : 'Hours'}</p>
                <p className="text-[11px] leading-snug">{detail.useTimeKo}</p>
              </div>
            </div>
          )}
          {detail.restDateKo && (
            <div className="p-3 rounded-lg bg-white border border-[#E5E2DC] flex items-start gap-2 shadow-2xs">
              <Calendar className="w-4 h-4 text-[#0A2540] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#11161B]">{language === 'KR' ? '휴무일' : 'Closed'}</p>
                <p className="text-[11px] leading-snug">{detail.restDateKo}</p>
              </div>
            </div>
          )}
          {detail.feeKo && (
            <div className="p-3 rounded-lg bg-white border border-[#E5E2DC] flex items-start gap-2 shadow-2xs">
              <CreditCard className="w-4 h-4 text-[#0A2540] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#11161B]">{language === 'KR' ? '이용 요금' : 'Admission'}</p>
                <p className="text-[11px] leading-snug">{detail.feeKo}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. 상세 개요 소개 */}
      <div className="space-y-1.5">
        <h5 className="text-xs font-bold uppercase tracking-wider text-[#0A2540] flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#0A2540]" />
          <span>{language === 'KR' ? '관광지 상세 개요' : 'Place Overview'}</span>
        </h5>
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#E5E2DC] text-xs sm:text-sm text-[#333333] leading-relaxed whitespace-pre-line shadow-2xs">
          {language === 'KR' ? detail.overviewKo : detail.overviewEn}
        </div>
      </div>

      {/* 6. 8대 무장애 편의시설 현황 (웹/모바일 반응형 그리드) */}
      {bf && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#0A2540] flex items-center gap-1.5">
              <Accessibility className="w-4 h-4 text-[#0A2540]" />
              <span>{language === 'KR' ? '8대 무장애 편의시설 세부 현황' : 'Barrier-Free Amenities (8 Categories)'}</span>
            </h5>
            <span className="text-[11px] text-[#718096]">
              {language === 'KR' ? '편의시설 세부 안내' : 'Accessibility Features'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 1. 휠체어 */}
            <div className="p-3 sm:p-3.5 rounded-xl border border-[#E5E2DC] bg-white space-y-1 text-left shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#11161B] flex items-center gap-1.5">
                  <span className="text-base">{bf.wheelchair.icon}</span>
                  {language === 'KR' ? bf.wheelchair.titleKo : bf.wheelchair.titleEn}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {bf.wheelchair.tag}
                </span>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                {language === 'KR' ? bf.wheelchair.descKo : bf.wheelchair.descEn}
              </p>
            </div>

            {/* 2. 엘리베이터 */}
            <div className="p-3 sm:p-3.5 rounded-xl border border-[#E5E2DC] bg-white space-y-1 text-left shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#11161B] flex items-center gap-1.5">
                  <span className="text-base">{bf.elevator.icon}</span>
                  {language === 'KR' ? bf.elevator.titleKo : bf.elevator.titleEn}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {bf.elevator.tag}
                </span>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                {language === 'KR' ? bf.elevator.descKo : bf.elevator.descEn}
              </p>
            </div>

            {/* 3. 장애인 전용 화장실 */}
            <div className="p-3 sm:p-3.5 rounded-xl border border-[#E5E2DC] bg-white space-y-1 text-left shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#11161B] flex items-center gap-1.5">
                  <span className="text-base">{bf.restroom.icon}</span>
                  {language === 'KR' ? bf.restroom.titleKo : bf.restroom.titleEn}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {bf.restroom.tag}
                </span>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                {language === 'KR' ? bf.restroom.descKo : bf.restroom.descEn}
              </p>
            </div>

            {/* 4. 장애인 전용 주차구역 */}
            <div className="p-3 sm:p-3.5 rounded-xl border border-[#E5E2DC] bg-white space-y-1 text-left shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#11161B] flex items-center gap-1.5">
                  <span className="text-base">{bf.parking.icon}</span>
                  {language === 'KR' ? bf.parking.titleKo : bf.parking.titleEn}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                  {bf.parking.tag}
                </span>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                {language === 'KR' ? bf.parking.descKo : bf.parking.descEn}
              </p>
            </div>

            {/* 5. 진입로 및 무단차 경사로 */}
            <div className="p-3 sm:p-3.5 rounded-xl border border-[#E5E2DC] bg-white space-y-1 text-left shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#11161B] flex items-center gap-1.5">
                  <span className="text-base">{bf.route.icon}</span>
                  {language === 'KR' ? bf.route.titleKo : bf.route.titleEn}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {bf.route.tag}
                </span>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                {language === 'KR' ? bf.route.descKo : bf.route.descEn}
              </p>
            </div>

            {/* 6. 점자블록 및 유도안내 */}
            <div className="p-3 sm:p-3.5 rounded-xl border border-[#E5E2DC] bg-white space-y-1 text-left shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#11161B] flex items-center gap-1.5">
                  <span className="text-base">{bf.tactilePaving.icon}</span>
                  {language === 'KR' ? bf.tactilePaving.titleKo : bf.tactilePaving.titleEn}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-300">
                  {bf.tactilePaving.tag}
                </span>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                {language === 'KR' ? bf.tactilePaving.descKo : bf.tactilePaving.descEn}
              </p>
            </div>

            {/* 7. 유아차 편의 및 수유실 */}
            <div className="p-3 sm:p-3.5 rounded-xl border border-[#E5E2DC] bg-white space-y-1 text-left shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#11161B] flex items-center gap-1.5">
                  <span className="text-base">{bf.stroller.icon}</span>
                  {language === 'KR' ? bf.stroller.titleKo : bf.stroller.titleEn}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  {bf.stroller.tag}
                </span>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                {language === 'KR' ? bf.stroller.descKo : bf.stroller.descEn}
              </p>
            </div>

            {/* 8. 음성 및 시각 안내 */}
            <div className="p-3 sm:p-3.5 rounded-xl border border-[#E5E2DC] bg-white space-y-1 text-left shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#11161B] flex items-center gap-1.5">
                  <span className="text-base">{bf.audioVisual.icon}</span>
                  {language === 'KR' ? bf.audioVisual.titleKo : bf.audioVisual.titleEn}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  {bf.audioVisual.tag}
                </span>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                {language === 'KR' ? bf.audioVisual.descKo : bf.audioVisual.descEn}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. 지하철 및 엘리베이터 출구 대중교통 이동 동선 */}
      {detail.nearestStationNameKo && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#E5E2DC] space-y-2 text-left shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0A2540] flex items-center gap-1.5">
              <Train className="w-4 h-4 text-[#0A2540]" />
              <span>{language === 'KR' ? '지하철 엘리베이터 출구 및 이동 동선' : 'Subway Elevator Route'}</span>
            </span>
            <span className="text-xs font-bold text-[#0A2540] bg-[#F4EBE1] px-2 py-0.5 rounded border border-[#E5E2DC]">
              {detail.subwayLine} {detail.nearestStationNameKo}
            </span>
          </div>

          <div className="text-xs text-[#11161B] space-y-1">
            <p className="font-semibold text-[#0A2540]">
              {language === 'KR' ? '권장 엘리베이터 출구: ' : 'Recommended Elevator Exit: '}
              <span className="font-bold underline decoration-amber-500">{detail.recommendedExit}</span> 
              {detail.walkingDistanceMeters ? ` (${language === 'KR' ? `도보 약 ${detail.walkingDistanceMeters}m, ${detail.walkingTimeMinutes}분` : `approx. ${detail.walkingDistanceMeters}m, ${detail.walkingTimeMinutes} min`})` : ''}
            </p>
            <p className="text-[#4A5568] leading-relaxed">
              {language === 'KR' ? detail.transitTipKo : detail.transitTipEn}
            </p>
          </div>

          {onSelectStation && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const stName = detail.nearestStationNameKo.replace(/\(.*?\)/g, '').trim();
                  onSelectStation(stName);
                }}
                className="text-xs font-bold text-[#0A2540] hover:text-[#07192C] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>{language === 'KR' ? '해당 지하철역 무장애 정보 조회하기' : 'View Station Accessibility Info'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 8. 하단 닫기/접기 액션 바 */}
      {onCollapse && (
        <div className="pt-2 border-t border-[#E5E2DC] flex justify-end">
          <button
            type="button"
            onClick={onCollapse}
            className="px-3.5 py-1.5 rounded-lg bg-[#0A2540] hover:bg-[#07192C] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>{language === 'KR' ? '무장애 정보 접기' : 'Hide Accessibility Info'}</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
export default TourApiPlaceDetailAccordion;
