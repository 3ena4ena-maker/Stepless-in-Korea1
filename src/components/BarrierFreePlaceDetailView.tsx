/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 관광지 상세 페이지 (/place/:placeId 또는 /barrier-free/place/:placeId)
 * 모바일 우선 간결한 레이아웃:
 * 1. 대표 이미지 (한국관광공사 TourAPI detailCommon2.firstimage)
 *    - 관광지명
 * 2. 주소 (한국관광공사 API 실제 주소)
 * 3. 전화번호 (한국관광공사 API 실제 전화번호 / infocenter)
 * 4. 지도 (한국어: 네이버지도, 영어: Google Maps)
 * 5. 개요 정보 (한국관광공사 API detailCommon2.overview, 4~6줄 더보기/접기)
 * 6. 무장애 정보 (한국관광공사 무장애 관광 API 실제 데이터)
 * 7. 부산인의 팁! (Stepless 자체 제작 현장 조사 팁)
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Share2,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Train,
  Info,
} from 'lucide-react';
import {
  OpenApiPlaceDetail,
  getKoreaTourApiPlaceDetail,
} from '../data/koreaTourApiPlaceDetails';
import { fetchTourApiPlaceDetail } from '../services/tourApiService';
import { UserType } from '../data/barrierFreeData';
import PlaceLocationMap from './PlaceLocationMap';

interface BarrierFreePlaceDetailViewProps {
  placeId: string;
  selectedUserType?: UserType | null;
  language: 'KR' | 'EN';
  onBack: () => void;
  onSelectStation?: (stationId: string, exitNum?: string) => void;
  onSelectUserType?: (userType: UserType) => void;
}

export default function BarrierFreePlaceDetailView({
  placeId,
  language,
  onBack,
  onSelectStation,
}: BarrierFreePlaceDetailViewProps) {
  const [detail, setDetail] = useState<OpenApiPlaceDetail | null>(() =>
    getKoreaTourApiPlaceDetail(placeId)
  );
  const [liveBarrierFree, setLiveBarrierFree] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  // 비동기 OpenAPI 데이터 연동
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setImageLoadError(false);
    setDetail(getKoreaTourApiPlaceDetail(placeId));
    setLiveBarrierFree(null);

    fetchTourApiPlaceDetail(placeId).then((res) => {
      if (!isMounted) return;
      setLoading(false);
      if (res.data) {
        setDetail(res.data);
      }
      if (res.liveBarrierFree) {
        setLiveBarrierFree(res.liveBarrierFree);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [placeId]);

  // 주소 클립보드 복사
  const handleCopyAddress = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    });
  };

  // 링크 공유
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: detail ? (language === 'KR' ? detail.nameKo : detail.nameEn) : '부산 무장애 관광',
          text: detail
            ? `${language === 'KR' ? detail.nameKo : detail.nameEn} - 한국관광공사 무장애 관광 정보`
            : '부산 무장애 관광',
          url,
        })
        .catch(() => {
          navigator.clipboard.writeText(url);
          setShareToast(true);
          setTimeout(() => setShareToast(false), 2000);
        });
    } else {
      navigator.clipboard.writeText(url);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    }
  };

  if (!detail && !loading) {
    return (
      <article className="max-w-2xl mx-auto px-4 py-6 space-y-6 text-left pb-16 text-slate-900 animate-fade-in">
        <header className="flex items-center justify-between gap-2 pb-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            aria-label="이전으로 돌아가기"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'KR' ? '이전으로' : 'Back'}</span>
          </button>
        </header>

        <section className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>{language === 'KR' ? '부산' : 'Busan'}</span>
            <span>·</span>
            <span>{language === 'KR' ? '무장애 관광지' : 'Barrier-Free Spot'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {language === 'KR' ? '무장애 관광 정보' : 'Barrier-Free Information'}
          </h1>
        </section>

        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Info className="w-6 h-6" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {language === 'KR' ? '현재 등록된 세부 무장애 편의시설 정보가 없습니다.' : 'No barrier-free accessibility info registered'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            {language === 'KR'
              ? '한국관광공사(TourAPI) 공공데이터에 해당 장소의 세부 무장애 편의 정보가 아직 등록되지 않았습니다. 현장 상황에 따라 단차나 턱이 있을 수 있으니 방문 전 확인하시기 바랍니다.'
              : 'Detailed barrier-free accessibility info has not been registered in the Korea Tourism Organization database for this spot.'}
          </p>
          <div className="pt-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0A2540] text-white rounded-lg text-xs font-bold hover:bg-[#11161B] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'KR' ? '이전 화면으로 돌아가기' : 'Back to previous page'}</span>
            </button>
          </div>
        </div>
      </article>
    );
  }

  const currentPlace = detail!;
  const rawFirstImage = currentPlace.firstImage;
  const hasValidImage = Boolean(rawFirstImage) && !imageLoadError;

  const currentOverview = language === 'KR' ? currentPlace.overviewKo : currentPlace.overviewEn;
  const isOverviewLong = (currentOverview?.length || 0) > 160;

  // 한국관광공사 KorWithService2 API 실제 데이터 기반 무장애 정보 파싱 및 정제
  interface ParsedBarrierFreeItem {
    id: string;
    title: string;
    status: '이용 가능' | '이용 불가' | null;
    statusNote?: string;
    desc?: string;
  }

  const parseItem = (
    id: string,
    titleKo: string,
    titleEn: string,
    rawDescKo?: string | null,
    rawDescEn?: string | null
  ): ParsedBarrierFreeItem | null => {
    const rawKo = rawDescKo ? rawDescKo.replace(/\[한국관광공사\]\s*/g, '').trim() : '';
    const rawEn = rawDescEn ? rawDescEn.replace(/\[한국관광공사\]\s*/g, '').trim() : '';
    const textKo = rawKo;
    const textEn = rawEn || rawKo;

    // 실제 데이터가 없거나 비어 있는 경우 항목 생성 금지
    if (!textKo) return null;

    // 1. 상태 판정 (KorWithService2 API 실제 텍스트 기준)
    // '단차 없음', '턱 없음' 등은 긍정적이므로 '없음'으로 인한 오판정 방지
    const safeText = textKo.replace(/단차\s*없음|턱이?\s*없음|계단\s*없음|무단차/g, '단차안전');
    const negativeRegex = /없음|불가|미설치|미운영|미구비|진입\s*불가|이용\s*불가|대여\s*불가|동반\s*불가|입장\s*불가|계단만\s*있음/;
    const positiveRegex = /있음|가능|설치|구비|완비|운행|가동|완만|단차안전|무단차|슬로프|경사로|제공|이용\s*가능|입장\s*가능|동반\s*가능|대여\s*가능/;

    let status: '이용 가능' | '이용 불가' | null = null;
    if (negativeRegex.test(safeText)) {
      status = '이용 불가';
    } else if (positiveRegex.test(textKo)) {
      status = '이용 가능';
    }

    // 2. 상태 부가 괄호 추출 (예: "1층 대여 가능", "무료 대여" 등)
    let statusNoteKo: string | undefined = undefined;
    let statusNoteEn: string | undefined = undefined;
    const parenMatch = textKo.match(/\(([^)]*(?:대여|무료|상시|전망|운행|1층|2층|3층|지하)[^)]*)\)/);
    if (parenMatch) {
      statusNoteKo = parenMatch[1].trim();
    } else if (textKo.includes('1층 대여') || textKo.includes('무료 대여')) {
      statusNoteKo = textKo.includes('1층') ? '1층 대여 가능' : '무료 대여';
    }

    // 3. 항목명과 상세 내용의 중복 최소화
    // "엘리베이터 있음", "있음", "설치됨" 같은 단순 중복 텍스트는 상세 내용에서 생략
    let cleanDescKo = textKo;
    const isRedundantKo = [
      '있음', '설치', '설치됨', '구비', '완비', '운행', '운행 중',
      '엘리베이터 있음', '승강기 있음', '장애인 화장실 있음', '장애인 전용 화장실 있음',
      '장애인 주차구역 있음', '장애인 주차장 있음', '주차 가능', '대여 가능', '휠체어 대여 가능',
      '유아차 대여 가능', '점자블록 있음', '점자블록 설치', '단차 없음', '턱 없음',
      '없음', '이용 불가', '미설치', '대여 불가', '불가'
    ].some((w) => cleanDescKo.replace(/\s+/g, '') === w.replace(/\s+/g, ''));

    let finalDesc: string | undefined = undefined;
    if (!isRedundantKo) {
      // 괄호 내용이 이미 statusNote에 포함되어 있다면 상세 내용에서 중복 제거
      if (statusNoteKo && cleanDescKo.includes(`(${statusNoteKo})`)) {
        cleanDescKo = cleanDescKo.replace(`(${statusNoteKo})`, '').trim();
      }
      if (cleanDescKo.length > 2) {
        finalDesc = language === 'KR' ? cleanDescKo : textEn;
      }
    }

    return {
      id,
      title: language === 'KR' ? titleKo : titleEn,
      status,
      statusNote: language === 'KR' ? statusNoteKo : statusNoteEn,
      desc: finalDesc,
    };
  };

  // 8개 기준 카테고리 매핑 (실제 데이터가 있는 항목만 생성)
  const bfLive = (liveBarrierFree || {}) as any;
  const bfFallback = currentPlace.barrierFree || ({} as any);

  const barrierFreeDisplayItems: ParsedBarrierFreeItem[] = [
    // 1. 휠체어 편의 및 대여
    parseItem(
      'wheelchair',
      '휠체어 편의 및 대여',
      'Wheelchair Accessibility & Rental',
      bfLive.wheelchair || bfFallback.wheelchair?.descKo,
      bfFallback.wheelchair?.descEn
    ),
    // 2. 엘리베이터
    parseItem(
      'elevator',
      '초고속 전용 엘리베이터',
      'Elevator',
      bfLive.elevator || bfFallback.elevator?.descKo,
      bfFallback.elevator?.descEn
    ),
    // 3. 장애인 화장실
    parseItem(
      'restroom',
      '장애인 전용 화장실',
      'Accessible Restroom',
      bfLive.restroom || bfFallback.restroom?.descKo,
      bfFallback.restroom?.descEn
    ),
    // 4. 장애인 주차
    parseItem(
      'parking',
      '장애인 전용 주차구역',
      'Accessible Parking',
      bfLive.parking || bfFallback.parking?.descKo,
      bfFallback.parking?.descEn
    ),
    // 5. 출입구 및 진입로
    parseItem(
      'route',
      '출입구 및 진입로',
      'Entrance & Approach Route',
      [bfLive.route, bfLive.exit].filter(Boolean).join(' / ') || bfFallback.route?.descKo,
      bfFallback.route?.descEn
    ),
    // 6. 점자블록 및 시각장애인 유도
    parseItem(
      'braille',
      '점자블록 및 시각장애인 유도',
      'Tactile Paving & Braille Guide',
      [bfLive.braileblock, bfLive.brailepromotion, bfLive.audioguide, bfLive.guidesystem].filter(Boolean).join(' / ') || bfFallback.tactilePaving?.descKo,
      bfFallback.tactilePaving?.descEn
    ),
    // 7. 유아차 이용 및 편의
    parseItem(
      'stroller',
      '유아차 이용 및 편의',
      'Stroller Accessibility & Nursery',
      [bfLive.stroller, bfLive.lactationroom, bfLive.babysparechair].filter(Boolean).join(' / ') || bfFallback.stroller?.descKo,
      bfFallback.stroller?.descEn
    ),
    // 8. 기타 무장애 편의시설
    parseItem(
      'etc',
      '기타 무장애 편의시설',
      'Other Barrier-Free Facilities',
      [bfLive.helpdog, bfLive.handicapetc, bfLive.infantsfamilyetc, bfLive.blindhandicapetc, bfLive.hearinghandicapetc].filter(Boolean).join(' / ') || (bfFallback.audioVisual?.descKo?.includes('오디오') ? null : bfFallback.audioVisual?.descKo),
      bfFallback.audioVisual?.descEn
    ),
  ].filter((item): item is ParsedBarrierFreeItem => item !== null);

  return (
    <article className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-6 text-left pb-16 text-slate-900">
      {/* 상단 내비게이션 바 */}
      <header className="flex items-center justify-between gap-2 pb-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          aria-label="이전으로 돌아가기"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'KR' ? '이전으로' : 'Back'}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          title="공유하기"
          aria-label="공유하기"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </header>

      {/* 공유 완료 토스트 알림 */}
      {shareToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{language === 'KR' ? '페이지 링크가 복사되었습니다.' : 'Link copied to clipboard.'}</span>
        </div>
      )}

      {/* 1. 대표 이미지 */}
      {/* 한국관광공사 무장애 관광 API detailCommon2.firstimage 만 사용, 없을 시 임의 이미지 사용 금지 */}
      {hasValidImage ? (
        <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
          <img
            src={rawFirstImage}
            alt={language === 'KR' ? currentPlace.nameKo : currentPlace.nameEn}
            className="w-full h-full object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
            onError={() => setImageLoadError(true)}
          />
        </div>
      ) : null}

      {/* 관광지명 & 지역구 */}
      <section className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>{language === 'KR' ? currentPlace.districtKo : currentPlace.districtEn}</span>
          <span>·</span>
          <span>{language === 'KR' ? currentPlace.categoryKo : currentPlace.categoryEn}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {language === 'KR' ? currentPlace.nameKo : currentPlace.nameEn}
        </h1>
      </section>

      {/* 2. 주소 */}
      {/* 한국관광공사 API 실제 주소 정보 */}
      <section className="space-y-1">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {language === 'KR' ? '주소' : 'Address'}
        </h2>
        <div className="flex items-start justify-between gap-3 text-sm text-slate-800">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium leading-relaxed">
                {language === 'KR' ? currentPlace.addressRoadKo : currentPlace.addressRoadEn}
              </p>
              {currentPlace.addressLotKo && (
                <p className="text-xs text-slate-400 mt-0.5">
                  ({language === 'KR' ? currentPlace.addressLotKo : currentPlace.addressLotEn})
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleCopyAddress(currentPlace.addressRoadKo)}
            className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors"
          >
            {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedAddress ? (language === 'KR' ? '복사됨' : 'Copied') : (language === 'KR' ? '복사' : 'Copy')}</span>
          </button>
        </div>
      </section>

      {/* 3. 전화번호 */}
      {/* 한국관광공사 API 실제 문의 및 안내 전화번호 */}
      {currentPlace.tel ? (
        <section className="space-y-1">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {language === 'KR' ? '문의 및 안내' : 'Contact'}
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-slate-500 shrink-0" />
            <a
              href={`tel:${currentPlace.tel.replace(/[^0-9]/g, '')}`}
              className="font-medium text-[#0A2540] hover:underline"
            >
              {currentPlace.tel}
            </a>
            {currentPlace.telDescKo && (
              <span className="text-xs text-slate-400">
                ({currentPlace.telDescKo})
              </span>
            )}
          </div>
        </section>
      ) : null}

      {/* 4. 지도 */}
      {/* 한국어: 네이버지도, 영어: Google Maps (실제 mapx, mapy 좌표 사용) */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {language === 'KR' ? '위치 지도' : 'Map'}
        </h2>
        <PlaceLocationMap
          latitude={currentPlace.latitude}
          longitude={currentPlace.longitude}
          placeName={language === 'KR' ? currentPlace.nameKo : currentPlace.nameEn}
          language={language}
        />
      </section>

      {/* 5. 개요 정보 */}
      {/* 한국관광공사 API detailCommon2.overview, 4~6줄 더보기/접기 지원 */}
      {currentOverview ? (
        <section className="space-y-2">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {language === 'KR' ? '개요' : 'Overview'}
          </h2>
          <div className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal whitespace-pre-line">
            <p className={!isOverviewExpanded && isOverviewLong ? 'line-clamp-5' : ''}>
              {currentOverview}
            </p>
          </div>
          {isOverviewLong && (
            <button
              type="button"
              onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0A2540] hover:underline pt-1 cursor-pointer"
            >
              <span>{isOverviewExpanded ? (language === 'KR' ? '접기' : 'Show less') : (language === 'KR' ? '더보기' : 'Read more')}</span>
              {isOverviewExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </section>
      ) : null}

      {/* 6. 무장애 정보 */}
      {/* 한국관광공사 무장애 관광 API (KorWithService2) 실제 데이터 */}
      <section className="space-y-3 pt-2">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {language === 'KR' ? '무장애 편의 정보' : 'Barrier-Free Accessibility'}
        </h2>

        {barrierFreeDisplayItems.length > 0 ? (
          <>
            <div className="border-t border-slate-200 divide-y divide-slate-100">
              {barrierFreeDisplayItems.map((item) => (
                <div key={item.id} className="py-3 space-y-1">
                  {/* 상단: 항목명 (왼쪽) / 상태 (오른쪽) */}
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-bold text-slate-900">
                      {item.title}
                    </span>
                    {item.status ? (
                      <span
                        className={`shrink-0 text-xs sm:text-sm font-bold ${
                          item.status === '이용 가능' ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {item.status}
                        {item.statusNote ? ` (${item.statusNote})` : ''}
                      </span>
                    ) : null}
                  </div>

                  {/* 하단: 상세 내용 (다음 줄) */}
                  {item.desc ? (
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>

            {/* 섹션 맨 마지막에 단 한 번만 표시 */}
            <p className="text-xs text-slate-400 pt-1 text-right">
              출처: ⓒ한국관광공사
            </p>
          </>
        ) : (
          <div className="p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2.5">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {language === 'KR' ? '현재 등록된 세부 무장애 편의시설 정보가 없습니다.' : 'No barrier-free accessibility info registered'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {language === 'KR'
                ? '해당 장소는 한국관광공사 공공데이터에 세부 무장애 편의시설(경사로, 휠체어 리프트, 장애인 화장실 등) 정보가 아직 등록되지 않았습니다. 방문 전 관리사무소로 사전 확인을 권장합니다.'
                : 'Detailed barrier-free facility data is not yet registered for this spot in the official database.'}
            </p>
            {currentPlace.tel && (
              <div className="pt-1.5">
                <a
                  href={`tel:${currentPlace.tel.replace(/[^0-9]/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0A2540] text-white text-xs font-bold hover:bg-[#11161B] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{language === 'KR' ? `문의 전화: ${currentPlace.tel}` : `Call: ${currentPlace.tel}`}</span>
                </a>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 7. 부산인의 팁! */}
      {/* Stepless 자체 현장 조사 콘텐츠 및 대중교통 무단차 이동 경로 */}
      <section className="space-y-3 pt-3 border-t border-slate-200">
        <h2 className="text-base sm:text-lg font-black text-[#0A2540]">
          {language === 'KR' ? '부산인의 팁!' : "Busan Local's Tip!"}
        </h2>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          {/* 지하철역 & 추천 엘리베이터 출구 */}
          <div className="flex items-center justify-between gap-2 text-xs font-bold">
            <span className="text-slate-900">
              {language === 'KR' ? currentPlace.nearestStationNameKo : currentPlace.nearestStationNameEn}
            </span>
            <span className="text-[#0A2540] bg-white px-2 py-0.5 rounded border border-slate-200">
              {currentPlace.recommendedExit}
            </span>
          </div>

          {/* 도보 거리 및 이동 시간 */}
          <p className="text-xs text-slate-500 font-medium">
            {language === 'KR'
              ? `도보 약 ${currentPlace.walkingDistanceMeters}m (약 ${currentPlace.walkingTimeMinutes}분)`
              : `Approx. ${currentPlace.walkingDistanceMeters}m (about ${currentPlace.walkingTimeMinutes} min)`}
          </p>

          {/* Stepless 자체 작성 무단차 이동 팁 */}
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            {language === 'KR' ? currentPlace.transitTipKo : currentPlace.transitTipEn}
          </p>

          {/* 지하철역 상세 안내로 이동 (있는 경우) */}
          {onSelectStation && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  const stationQuery = currentPlace.nearestStationNameKo.split(' ')[0].replace(/역$/, '');
                  onSelectStation(stationQuery);
                }}
                className="w-full py-2 rounded-lg bg-[#0A2540] hover:bg-[#11161B] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Train className="w-3.5 h-3.5" />
                <span>
                  {language === 'KR'
                    ? `${currentPlace.nearestStationNameKo} 엘리베이터 위치 확인`
                    : 'View Station Elevator Information'}
                </span>
              </button>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
