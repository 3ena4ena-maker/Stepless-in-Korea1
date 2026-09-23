/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 한국관광공사 (KTO) TourAPI 무장애 상세 정보 통합 모달
 * 추천 여행 코스, 일정 상세 페이지, 무장애 관광지 어디서든
 * 한국관광공사 공인 데이터 및 8대 무장애 편의시설 정보를 모달 팝업으로 상세 조회할 수 있습니다.
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Copy, 
  Check, 
  ExternalLink, 
  Train, 
  ShieldCheck, 
  Sparkles,
  Info,
  Clock,
  Calendar,
  CreditCard
} from 'lucide-react';
import { useTourApiSpot } from '../services/tourApiCommon';

interface TourApiPlaceDetailModalProps {
  placeId: string | null;
  language?: 'KR' | 'EN';
  onClose: () => void;
  onSelectStation?: (stationName: string) => void;
}

export const TourApiPlaceDetailModal: React.FC<TourApiPlaceDetailModalProps> = ({
  placeId,
  language = 'KR',
  onClose,
  onSelectStation,
}) => {
  const [copied, setCopied] = useState(false);
  const { detail, liveBarrierFree, loading, isLiveApi, hasKtoData } = useTourApiSpot(placeId || '');

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!placeId) return null;

  const handleCopyAddress = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const bf = detail?.barrierFree;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#E5E2DC] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 상단 헤더 */}
        <div className="bg-[#0A2540] text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div>
              {detail && (
                <div className="text-[11px] font-medium text-slate-300">
                  {language === 'KR' ? detail.categoryKo : detail.categoryEn} · {detail.districtKo}
                </div>
              )}
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                {language === 'KR' ? '무장애 편의시설 상세 정보' : 'Barrier-Free Accessibility Info'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
            title="닫기 (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 모달 스크롤 콘텐츠 본문 */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {loading && !detail ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#0A2540] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium text-[#4A5568]">
                {language === 'KR' ? '한국관광공사 OpenAPI 무장애 편의시설 정보를 불러오는 중입니다...' : 'Loading official TourAPI barrier-free specifications...'}
              </p>
            </div>
          ) : !detail ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto">
                <Info className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[#11161B]">
                {language === 'KR' ? '해당 장소의 공인 무장애 데이터를 찾을 수 없습니다.' : 'Official TourAPI details are not available for this place.'}
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#0A2540] text-white rounded-lg text-xs font-semibold hover:bg-[#07192C]"
              >
                {language === 'KR' ? '확인 및 닫기' : 'Close'}
              </button>
            </div>
          ) : (
            <>
              {/* 대표 이미지 및 기본 명칭 */}
              <div className="space-y-4">
                {detail.firstImage && (
                  <div className="relative rounded-xl overflow-hidden aspect-[16/9] max-h-64 sm:max-h-72 bg-slate-100 border border-[#E5E2DC]">
                    <img
                      src={detail.firstImage}
                      alt={language === 'KR' ? detail.nameKo : detail.nameEn}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div className="text-white space-y-0.5">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm border border-white/20">
                          {language === 'KR' ? detail.categoryKo : detail.categoryEn} · {detail.districtKo}
                        </span>
                        <h2 className="text-lg sm:text-xl font-extrabold text-white drop-shadow-md">
                          {language === 'KR' ? detail.nameKo : detail.nameEn}
                        </h2>
                      </div>
                      <span className="text-[10px] font-medium text-white/80 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                        TourAPI ID: {detail.contentId}
                      </span>
                    </div>
                  </div>
                )}

                {/* 기본 명칭(이미지 없을 때) 및 카테고리 태그 */}
                {!detail.firstImage && (
                  <div className="border-b border-[#E5E2DC] pb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#F4EBE1] text-[#0A2540] inline-block mb-2">
                      {language === 'KR' ? detail.categoryKo : detail.categoryEn} · {detail.districtKo}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#11161B]">
                      {language === 'KR' ? detail.nameKo : detail.nameEn}
                    </h2>
                  </div>
                )}

                {/* 주소 및 연락처 바 */}
                <div className="bg-[#FBFBF9] p-3.5 sm:p-4 rounded-xl border border-[#E5E2DC] space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 text-xs sm:text-sm text-[#11161B]">
                      <MapPin className="w-4 h-4 text-[#0A2540] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-[#0A2540]">도로명 주소: </span>
                        <span>{language === 'KR' ? detail.addressRoadKo : detail.addressRoadEn}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyAddress(detail.addressRoadKo)}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-[#E5E2DC] text-[#4A5568] hover:text-[#0A2540] hover:bg-[#F4EBE1] flex items-center gap-1 shrink-0 transition-colors"
                      title="주소 복사"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">복사됨</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>주소 복사</span>
                        </>
                      )}
                    </button>
                  </div>

                  {detail.tel && (
                    <div className="flex items-center gap-2 text-xs text-[#4A5568] pt-1 border-t border-[#E5E2DC]/60">
                      <Phone className="w-3.5 h-3.5 text-[#0A2540] shrink-0" />
                      <span className="font-medium text-[#11161B]">문의 전화: </span>
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

                {/* 운영시간 / 휴무일 / 이용요금 요약 */}
                {(detail.useTimeKo || detail.restDateKo || detail.feeKo) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#4A5568]">
                    {detail.useTimeKo && (
                      <div className="p-2.5 rounded-lg bg-[#FBFBF9] border border-[#E5E2DC] flex items-start gap-2">
                        <Clock className="w-4 h-4 text-[#0A2540] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[#11161B]">이용 시간</p>
                          <p className="text-[11px] leading-snug">{detail.useTimeKo}</p>
                        </div>
                      </div>
                    )}
                    {detail.restDateKo && (
                      <div className="p-2.5 rounded-lg bg-[#FBFBF9] border border-[#E5E2DC] flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-[#0A2540] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[#11161B]">휴무일</p>
                          <p className="text-[11px] leading-snug">{detail.restDateKo}</p>
                        </div>
                      </div>
                    )}
                    {detail.feeKo && (
                      <div className="p-2.5 rounded-lg bg-[#FBFBF9] border border-[#E5E2DC] flex items-start gap-2">
                        <CreditCard className="w-4 h-4 text-[#0A2540] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[#11161B]">이용 요금</p>
                          <p className="text-[11px] leading-snug">{detail.feeKo}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 공식 개요 (한국관광공사 등록 원문) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A2540] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#0A2540]" />
                  <span>한국관광공사 공식 상세 개요</span>
                </h4>
                <div className="p-4 rounded-xl bg-white border border-[#E5E2DC] text-xs sm:text-sm text-[#333333] leading-relaxed whitespace-pre-line shadow-xs">
                  {language === 'KR' ? detail.overviewKo : detail.overviewEn}
                </div>
              </div>

              {/* 8대 무장애 편의시설 (KorWithService2 표준 규격) */}
              {bf && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A2540] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#0A2540]" />
                      <span>8대 무장애 편의시설 세부 현황</span>
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      한국관광공사 KorWith 표준 규격
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* 1. 휠체어 */}
                    <div className="p-3.5 rounded-xl border border-[#E5E2DC] bg-[#FBFBF9] space-y-1.5 text-left">
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
                    <div className="p-3.5 rounded-xl border border-[#E5E2DC] bg-[#FBFBF9] space-y-1.5 text-left">
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
                    <div className="p-3.5 rounded-xl border border-[#E5E2DC] bg-[#FBFBF9] space-y-1.5 text-left">
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
                    <div className="p-3.5 rounded-xl border border-[#E5E2DC] bg-[#FBFBF9] space-y-1.5 text-left">
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
                    <div className="p-3.5 rounded-xl border border-[#E5E2DC] bg-[#FBFBF9] space-y-1.5 text-left">
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
                    <div className="p-3.5 rounded-xl border border-[#E5E2DC] bg-[#FBFBF9] space-y-1.5 text-left">
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
                    <div className="p-3.5 rounded-xl border border-[#E5E2DC] bg-[#FBFBF9] space-y-1.5 text-left">
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

                    {/* 8. 음성 및 수어 안내 */}
                    <div className="p-3.5 rounded-xl border border-[#E5E2DC] bg-[#FBFBF9] space-y-1.5 text-left">
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

              {/* 지하철 및 엘리베이터 출구 대중교통 길라잡이 */}
              {detail.nearestStationNameKo && (
                <div className="p-4 rounded-xl bg-[#F4EBE1]/70 border border-[#E5E2DC] space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0A2540] flex items-center gap-1.5">
                      <Train className="w-4 h-4 text-[#0A2540]" />
                      <span>지하철 엘리베이터 출구 및 이동 경로</span>
                    </span>
                    <span className="text-xs font-bold text-[#0A2540] bg-white px-2 py-0.5 rounded border border-[#E5E2DC]">
                      {detail.subwayLine} {detail.nearestStationNameKo}
                    </span>
                  </div>

                  <div className="text-xs text-[#11161B] space-y-1">
                    <p className="font-semibold text-[#0A2540]">
                      권장 출구: <span className="underline decoration-amber-500 font-bold">{detail.recommendedExit}</span> 
                      {detail.walkingDistanceMeters ? ` (도보 약 ${detail.walkingDistanceMeters}m, ${detail.walkingTimeMinutes}분)` : ''}
                    </p>
                    <p className="text-[#4A5568] leading-relaxed">
                      {language === 'KR' ? detail.transitTipKo : detail.transitTipEn}
                    </p>
                  </div>

                  {onSelectStation && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          const stName = detail.nearestStationNameKo.replace(/\(.*?\)/g, '').trim();
                          onSelectStation(stName);
                          onClose();
                        }}
                        className="text-xs font-bold text-[#0A2540] hover:text-[#07192C] flex items-center gap-1 hover:underline"
                      >
                        <span>해당 지하철역 무장애 정보 조회하기</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* 모달 하단 푸터 바 */}
        <div className="bg-[#FBFBF9] px-5 py-3.5 border-t border-[#E5E2DC] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#4A5568]">
            출처: 한국관광공사 공공데이터포털 (KorWithService2)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0A2540] hover:bg-[#07192C] text-white rounded-lg text-xs font-bold transition-colors"
          >
            {language === 'KR' ? '닫기' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
