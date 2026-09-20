/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 여행 코스 스텝 전용 한국관광공사 TourAPI 통합 카드 컴포넌트
 * 한국관광공사 API에 등록된 장소인 경우 실시간/공식 상세 정보(이미지, 도로명 주소, 
 * 8대 무장애 편의시설 배지, 지하철 엘리베이터 출구)를 동시 노출하고 상세 팝업을 지원합니다.
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Train, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';
import { ItineraryStep } from '../data/itineraries';
import { useTourApiSpot } from '../services/tourApiCommon';
import ElegantIllustration from './ElegantIllustration';

interface TourApiItineraryStepCardProps {
  stepNumber: number;
  step: ItineraryStep;
  language: 'KR' | 'EN';
  onOpenDetail: (placeId: string) => void;
  onSelectStation?: (stationName: string) => void;
}

function getIllustrationType(title: string): 'temple' | 'park' | 'food' | 'cafe' | 'sea' | 'transit' | 'village' | 'history' | 'culture' | 'default' {
  if (title.includes('해수욕장') || title.includes('바다') || title.includes('비치') || title.includes('광안리') || title.includes('해운대') || title.includes('송도') || title.includes('다대포')) return 'sea';
  if (title.includes('사') || title.includes('용궁사') || title.includes('범어사')) return 'temple';
  if (title.includes('공원') || title.includes('수목원') || title.includes('숲') || title.includes('온천천')) return 'park';
  if (title.includes('시장') || title.includes('식당') || title.includes('갈비') || title.includes('밀면') || title.includes('국밥')) return 'food';
  if (title.includes('카페') || title.includes('커피')) return 'cafe';
  if (title.includes('마을') || title.includes('문화마을') || title.includes('흰여울')) return 'village';
  if (title.includes('박물관') || title.includes('역사') || title.includes('기념관')) return 'history';
  if (title.includes('미술관') || title.includes('아트') || title.includes('영화') || title.includes('문화')) return 'culture';
  if (title.includes('역') || title.includes('터미널') || title.includes('공항')) return 'transit';
  return 'default';
}

export const TourApiItineraryStepCard: React.FC<TourApiItineraryStepCardProps> = ({
  stepNumber,
  step,
  language,
  onOpenDetail,
  onSelectStation,
}) => {
  const [copied, setCopied] = useState(false);
  const { matchedSpotId, hasKtoData, detail, isLiveApi } = useTourApiSpot(step.titleKo);

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const bf = detail?.barrierFree;

  return (
    <div className="relative group text-left space-y-2">
      {/* 타임라인 인덱스 및 시간 */}
      <div className="flex items-center gap-2 text-xs font-bold text-[#0A2540]">
        <span className="w-5 h-5 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-[10px] shrink-0">
          {stepNumber}
        </span>
        <span className="font-mono text-[11px] text-[#4A5568]">{step.time}</span>
        {hasKtoData && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3 text-amber-600" />
            <span>한국관광공사 TourAPI 공인</span>
            {isLiveApi && <Sparkles className="w-2.5 h-2.5 text-emerald-600 ml-0.5" />}
          </span>
        )}
      </div>

      {/* 카드 본체 */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E5E2DC] space-y-3 text-left shadow-xs hover:border-[#0A2540]/40 transition-all">
        {/* 제목 & 아이콘 헤더 */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h5 className="text-sm sm:text-base font-bold text-[#11161B] leading-snug">
              {language === 'KR' ? step.titleKo : step.titleEn}
            </h5>
            {hasKtoData && detail && (
              <p className="text-[11px] text-[#0A2540] font-medium">
                {language === 'KR' ? detail.nameKo : detail.nameEn} · {detail.categoryKo}
              </p>
            )}
          </div>

          <div className="p-1.5 rounded-lg bg-[#FBFBF9] border border-[#E5E2DC] shrink-0 text-[#4A5568]">
            <ElegantIllustration type={getIllustrationType(step.titleKo)} size="sm" className="w-5 h-5 stroke-[1.8]" />
          </div>
        </div>

        {/* 한국관광공사 API 데이터 연동 영역 (등록 장소일 때) */}
        {hasKtoData && detail && (
          <div className="space-y-3 pt-1">
            {/* 사진 & 주소 복합 정보 */}
            <div className="flex flex-col sm:flex-row gap-3 bg-[#FBFBF9] p-3 rounded-lg border border-[#E5E2DC]">
              {detail.firstImage && (
                <div className="w-full sm:w-28 sm:h-20 rounded-md overflow-hidden bg-slate-100 shrink-0 border border-[#E5E2DC]">
                  <img
                    src={detail.firstImage}
                    alt={detail.nameKo}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              
              <div className="flex-1 space-y-1.5 text-xs">
                {detail.addressRoadKo && (
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-1.5 text-[#4A5568]">
                      <MapPin className="w-3.5 h-3.5 text-[#0A2540] shrink-0 mt-0.5" />
                      <span className="line-clamp-2 leading-relaxed">
                        {language === 'KR' ? detail.addressRoadKo : detail.addressRoadEn}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(e, detail.addressRoadKo)}
                      className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E5E2DC] text-[#0A2540] hover:bg-[#F4EBE1] shrink-0 flex items-center gap-1 transition-colors"
                      title="주소 복사"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">복사됨</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>복사</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* 무장애 편의시설 주요 뱃지 노출 */}
                {bf && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {bf.wheelchair?.available && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span>♿</span>
                        <span>{bf.wheelchair.tag || '휠체어 접근 가능'}</span>
                      </span>
                    )}
                    {bf.elevator?.available && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                        <span>🛗</span>
                        <span>{bf.elevator.tag || '엘리베이터 완비'}</span>
                      </span>
                    )}
                    {bf.restroom?.available && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                        <span>🚻</span>
                        <span>장애인화장실</span>
                      </span>
                    )}
                    {bf.route?.available && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        <span>🛣️</span>
                        <span>{bf.route.tag || '무단차 경사로'}</span>
                      </span>
                    )}
                    {bf.stroller?.available && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                        <span>👶</span>
                        <span>유아차 동반</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 기본 코스 설명 */}
        <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed whitespace-pre-line">
          {language === 'KR' ? step.descKo : step.descEn}
        </p>

        {/* 대중교통 및 지하철 연계 정보 */}
        {step.stationInfoKo && (
          <div className="mt-2 text-xs font-medium text-[#0A2540] bg-[#FBFBF9] px-2.5 py-1.5 rounded-lg border border-[#E5E2DC] flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Train className="w-3.5 h-3.5 text-[#0A2540] shrink-0" />
              <span>{language === 'KR' ? step.stationInfoKo : step.stationInfoEn}</span>
            </div>
            {onSelectStation && step.stationInfoKo.includes('역') && (
              <button
                type="button"
                onClick={() => {
                  const match = step.stationInfoKo.match(/([가-힣]+역)/);
                  if (match) onSelectStation(match[1]);
                }}
                className="text-[10px] font-bold text-[#0A2540] hover:underline flex items-center gap-0.5"
              >
                <span>역사 무장애 정보</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* 무장애 상세 정보 팝업 모달 열기 버튼 (KTO 매칭 시) */}
        {hasKtoData && matchedSpotId && (
          <div className="pt-1 flex items-center justify-between border-t border-[#E5E2DC]/80">
            <span className="text-[11px] text-[#4A5568] flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#0A2540]" />
              <span>8대 무장애 편의정보 확인 가능</span>
            </span>
            <button
              type="button"
              onClick={() => onOpenDetail(matchedSpotId)}
              className="text-xs font-bold text-[#0A2540] hover:text-white bg-[#F4EBE1] hover:bg-[#0A2540] px-3 py-1.5 rounded-lg border border-[#E5E2DC] transition-all flex items-center gap-1.5"
            >
              <span>무장애 상세 정보 보기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
