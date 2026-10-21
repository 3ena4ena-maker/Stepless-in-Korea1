/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 여행 코스 스텝 전용 한국관광공사 TourAPI 통합 카드 컴포넌트
 * 한국관광공사 API에 등록된 장소인 경우 실시간/공식 상세 정보(이미지, 도로명 주소, 
 * 8대 무장애 편의시설 배지, 지하철 엘리베이터 출구)를 동시 노출하고 상세 팝업을 지원합니다.
 */

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Train, 
  ExternalLink, 
  Copy, 
  Check, 
  Info,
  Star,
  Compass
} from 'lucide-react';
import { ItineraryStep } from '../data/itineraries';
import { useTourApiSpot, resolvePlaceTargetId } from '../services/tourApiCommon';
import { useMyRoute } from '../services/myRouteService';
import ElegantIllustration from './ElegantIllustration';

interface TourApiItineraryStepCardProps {
  stepNumber: number;
  step: ItineraryStep;
  language: 'KR' | 'EN';
  onOpenDetail?: (placeId: string) => void;
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
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { matchedSpotId, hasKtoData, detail } = useTourApiSpot(step.titleKo);
  const effectiveTargetId = resolvePlaceTargetId({
    id: step.id,
    contentId: step.contentId,
    titleKo: step.titleKo,
    titleEn: step.titleEn,
  }) || matchedSpotId || 'spot-101';

  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [detail?.firstImage]);

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const { isBookmarked, toggle } = useMyRoute();
  const isSaved = isBookmarked(step.id || step.titleKo);

  const bf = detail?.barrierFree;
  const effectiveImage = (!imageError && (step.firstImage || detail?.firstImage)) ? (step.firstImage || detail?.firstImage) : '';
  const effectiveAddressKo = detail?.addressRoadKo || step.addressRoadKo || step.addressKo || '';
  const effectiveAddressEn = detail?.addressRoadEn || step.addressRoadEn || step.addressEn || effectiveAddressKo;
  const effectiveAddress = language === 'KR' ? effectiveAddressKo : effectiveAddressEn;
  const naverMapUrl = step.naverMapUrl || `https://map.naver.com/p/search/${encodeURIComponent(step.titleKo)}`;
  const googleMapUrl = step.googleMapUrl || `https://maps.google.com/?q=${encodeURIComponent(step.titleKo + ' 부산')}`;

  return (
    <div className="relative group text-left space-y-1.5">
      {/* 타임라인 인덱스 및 시간 */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-[#8EA85E]">
        <span className="w-5 h-5 rounded-full bg-[#8EA85E] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
          {stepNumber}
        </span>
        {step.time ? <span className="font-mono text-[11px] text-[#4A5568]">{step.time}</span> : null}
      </div>

      {/* 카드 본체 (불필요한 공백 최소화 & 컴팩트 레이아웃) */}
      <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 space-y-2.5 text-left shadow-2xs hover:border-[#8EA85E] transition-all">
        <div className="flex flex-row items-start gap-3">
          {/* 축소된 컴팩트 사진 (TourAPI 뱃지 삭제) */}
          {effectiveImage ? (
            <div className="w-24 h-20 sm:w-28 sm:h-22 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-[#E5E2DC] shadow-2xs">
              <img
                src={effectiveImage}
                alt={language === 'KR' ? step.titleKo : step.titleEn}
                className={`w-full h-full object-cover transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                referrerPolicy="no-referrer"
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </div>
          ) : null}

          {/* 본문 정보 영역 */}
          <div className="flex-1 min-w-0 space-y-1.5 text-left">
            {/* 제목 & 루트 추가 버튼 */}
            <div className="flex items-center justify-between gap-2">
              <h5 className="text-sm sm:text-base font-bold text-slate-900 leading-snug truncate">
                {language === 'KR' ? step.titleKo : step.titleEn}
              </h5>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle({
                    id: step.id || step.titleKo,
                    titleKo: step.titleKo,
                    titleEn: step.titleEn,
                    categoryKo: detail?.categoryKo || '추천코스',
                    categoryEn: detail?.categoryEn || 'Course',
                    addressRoadKo: detail?.addressRoadKo,
                    addressRoadEn: detail?.addressRoadEn,
                    stationInfoKo: step.stationInfoKo,
                    stationInfoEn: step.stationInfoEn,
                    descKo: step.descKo,
                    descEn: step.descEn,
                    firstImage: effectiveImage,
                    time: step.time,
                    latitude: detail?.latitude,
                    longitude: detail?.longitude,
                  });
                }}
                className={`px-2 py-0.5 rounded-md border transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold shrink-0 ${
                  isSaved
                    ? 'bg-amber-50 text-amber-600 border-amber-300 hover:bg-amber-100 shadow-2xs'
                    : 'bg-white text-slate-400 border-slate-200 hover:text-amber-500 hover:border-amber-200 hover:bg-amber-50/40'
                }`}
                title={
                  isSaved
                    ? (language === 'KR' ? '내 여행 루트에서 제거' : 'Remove from My Route')
                    : (language === 'KR' ? '내 여행 루트(지도)에 추가' : 'Add to My Route')
                }
              >
                <Star className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-500' : ''}`} />
                <span className="text-[10.5px] sm:text-[11px] font-bold">
                  {isSaved
                    ? (language === 'KR' ? '루트 담김' : 'In Route')
                    : (language === 'KR' ? '루트 추가' : 'Add')}
                </span>
              </button>
            </div>

            {/* 설명 (간결하고 공백 없는 2줄) */}
            <p className="text-[11.5px] sm:text-xs text-[#4A5568] leading-relaxed line-clamp-2">
              {language === 'KR' ? step.descKo : step.descEn}
            </p>

            {/* 대중교통/지하철 정보 */}
            {step.stationInfoKo && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <Train className="w-3 h-3 text-[#8EA85E] shrink-0" />
                <span className="truncate leading-tight font-medium">
                  {language === 'KR' ? step.stationInfoKo : (step.stationInfoEn || step.stationInfoKo)}
                </span>
                {onSelectStation && step.stationInfoKo.includes('역') && (
                  <button
                    type="button"
                    onClick={() => {
                      const match = step.stationInfoKo?.match(/([가-힣]+역)/);
                      if (match) onSelectStation(match[1]);
                    }}
                    className="text-[10px] font-bold text-[#8EA85E] hover:underline flex items-center gap-0.5 shrink-0 ml-auto cursor-pointer"
                  >
                    <span>역사 정보</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 하단 주소 & 지도 연결 (공백 최소화) */}
        {effectiveAddress && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1 text-slate-600 min-w-0 flex-1">
              <MapPin className="w-3 h-3 text-[#8EA85E] shrink-0" />
              <span className="truncate text-[11px] font-medium leading-tight">
                {effectiveAddress}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={(e) => handleCopy(e, effectiveAddress)}
                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 flex items-center gap-0.5 transition-colors cursor-pointer"
                title={language === 'KR' ? '주소 복사' : 'Copy address'}
              >
                {copied ? (
                  <>
                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-2.5 h-2.5" />
                    <span>복사</span>
                  </>
                )}
              </button>

              {/* 네이버 지도 바로 연결 */}
              <a
                href={naverMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-5.5 h-5.5 rounded-md bg-[#03C75A] hover:bg-[#02b350] flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
                title={language === 'KR' ? `${step.titleKo} 네이버 지도에서 보기` : 'View on Naver Map'}
                aria-label="Naver Map"
              >
                <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">
                  <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
                </svg>
              </a>

              {/* 구글 지도 바로 연결 */}
              <a
                href={googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-5.5 h-5.5 rounded-md bg-white border border-slate-200 hover:border-[#4285F4]/40 flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
                title={language === 'KR' ? `${step.titleKo} 구글 지도에서 보기` : 'View on Google Maps'}
                aria-label="Google Maps"
              >
                <svg viewBox="0 0 92 135" className="w-2.5 h-2.5" fill="none">
                  <path d="M46 0C20.596 0 0 20.596 0 46c0 34.5 46 89 46 89s46-54.5 46-89C92 20.596 71.404 0 46 0z" fill="#4285F4"/>
                  <path d="M46 0c-25.404 0-46 20.596-46 46 0 11.233 4.025 21.528 10.72 29.5L46 46V0z" fill="#EA4335"/>
                  <path d="M46 46l35.28 29.5C87.975 67.528 92 57.233 92 46c0-25.404-20.596-46-46-46v46z" fill="#FBBC04"/>
                  <path d="M46 46v89s24.62-29.215 37.8-57.5L46 46z" fill="#34A853"/>
                  <circle cx="46" cy="46" r="18" fill="#FFFFFF"/>
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* 다수 매장/프랜차이즈 지점별 주소 목록 & 네이버지도 / 구글맵 버튼 */}
        {step.branches && step.branches.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#E5E2DC] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#11161B] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0A2540]" />
                <span>{language === 'KR' ? '지점별 매장 안내 & 지도' : 'Branch Locations & Maps'}</span>
              </span>
              <span className="text-[10px] font-mono text-[#0A2540] bg-[#FBFBF9] px-2 py-0.5 rounded border border-[#E5E2DC]">
                {step.branches.length} {language === 'KR' ? '개 매장' : 'branches'}
              </span>
            </div>

            <div className="space-y-2">
              {step.branches.map((branch, bIdx) => {
                const rawAddress = language === 'KR' ? branch.addressKo : (branch.addressEn || branch.addressKo);
                const cleanAddress = (rawAddress || '').replace(/\s*\([^)]*\)/g, '').trim();

                return (
                  <div 
                    key={bIdx}
                    className="bg-[#FBFBF9] hover:bg-[#F4EBE1]/40 p-2.5 rounded-lg border border-[#E5E2DC] transition-colors flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-[#11161B] block">
                        {language === 'KR' ? branch.nameKo : (branch.nameEn || branch.nameKo)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] text-[#4A5568] flex items-start gap-1 leading-relaxed min-w-0 flex-1">
                        <span className="shrink-0 text-slate-400">📍</span>
                        <span className="break-all">{cleanAddress}</span>
                      </p>

                      <div className="flex items-center gap-1 shrink-0">
                        {branch.naverMapUrl && (
                          <a
                            href={branch.naverMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-6 h-6 rounded-md bg-[#03C75A] hover:bg-[#02b350] flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
                            title={language === 'KR' ? `${branch.nameKo} 네이버 지도에서 위치 보기` : `View on Naver Map`}
                            aria-label="Naver Map"
                          >
                            <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">
                              <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
                            </svg>
                          </a>
                        )}
                        {branch.googleMapUrl && (
                          <a
                            href={branch.googleMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-6 h-6 rounded-md bg-white border border-[#E5E2DC] hover:border-[#4285F4]/40 flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
                            title={language === 'KR' ? `${branch.nameKo} 구글맵에서 위치 보기` : `View on Google Maps`}
                            aria-label="Google Maps"
                          >
                            <svg viewBox="0 0 92 135" className="w-3 h-3" fill="none">
                              <path d="M46 0C20.596 0 0 20.596 0 46c0 34.5 46 89 46 89s46-54.5 46-89C92 20.596 71.404 0 46 0z" fill="#4285F4"/>
                              <path d="M46 0c-25.404 0-46 20.596-46 46 0 11.233 4.025 21.528 10.72 29.5L46 46V0z" fill="#EA4335"/>
                              <path d="M46 46l35.28 29.5C87.975 67.528 92 57.233 92 46c0-25.404-20.596-46-46-46v46z" fill="#FBBC04"/>
                              <path d="M46 46v89s24.62-29.215 37.8-57.5L46 46z" fill="#34A853"/>
                              <circle cx="46" cy="46" r="18" fill="#FFFFFF"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 대중교통 및 지하철 연계 정보 (상단 카드 미노출 시에만 폴백) */}
        {!hasAnyCardInfo && step.stationInfoKo && (
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
      </div>
    </div>
  );
};
