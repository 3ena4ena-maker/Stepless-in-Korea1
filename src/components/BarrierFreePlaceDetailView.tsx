/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 관광지 상세 페이지 (/place/:placeId 또는 /barrier-free/place/:placeId)
 * - 한국관광공사 (KTO) TourAPI 무장애 관광정보 (KorWithService2) 데이터 풀 연동
 * 1. 대표 고화질 이미지 & 갤러리
 * 2. 주소: 도로명 주소, 지번 주소
 * 3. 좌표: 위도(Lat), 경도(Lng) GPS 좌표 및 카카오/네이버/구글 지도 길찾기
 * 4. 전화번호: 문의처 및 원터치 전화 걸기
 * 5. 개요 정보: 한국관광공사 공식 상세 설명, 이용시간, 휴무일, 요금
 * 6. 무장애 정보: 휠체어, 엘리베이터, 장애인 화장실, 장애인 주차, 진입로/단차, 점자블록, 유아차
 * 7. 대중교통 무단차 이동 경로 안내
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Train,
  Phone,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  Navigation,
  Globe,
  Clock,
  Calendar,
  CreditCard,
  Building2,
  Share2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  OpenApiPlaceDetail,
  getKoreaTourApiPlaceDetail,
} from '../data/koreaTourApiPlaceDetails';
import { fetchTourApiPlaceDetail } from '../services/tourApiService';
import { UserType } from '../data/barrierFreeData';

interface BarrierFreePlaceDetailViewProps {
  placeId: string;
  selectedUserType?: UserType | null;
  language: 'KR' | 'EN';
  onBack: () => void;
  onSelectStation?: (stationId: string, exitNum?: string) => void;
  onSelectUserType?: (userType: UserType) => void;
}

// 부산 지하철 호선별 공식 고유 색상
const SUBWAY_LINE_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  '1호선': { bg: 'bg-[#F26B21]', text: 'text-white', border: 'border-[#F26B21]', label: '1호선' },
  '2호선': { bg: 'bg-[#3BB143]', text: 'text-white', border: 'border-[#3BB143]', label: '2호선' },
  '3호선': { bg: 'bg-[#B58500]', text: 'text-white', border: 'border-[#B58500]', label: '3호선' },
  '4호선': { bg: 'bg-[#2C64B4]', text: 'text-white', border: 'border-[#2C64B4]', label: '4호선' },
  '동해선': { bg: 'bg-[#003DA5]', text: 'text-white', border: 'border-[#003DA5]', label: '동해선' },
  '부산김해': { bg: 'bg-[#782F8F]', text: 'text-white', border: 'border-[#782F8F]', label: '부산김해' },
};

function getSubwayStyle(lineName: string) {
  for (const [key, val] of Object.entries(SUBWAY_LINE_COLORS)) {
    if (lineName.includes(key)) return val;
  }
  return { bg: 'bg-[#0A2540]', text: 'text-white', border: 'border-[#0A2540]', label: lineName };
}

export default function BarrierFreePlaceDetailView({
  placeId,
  language,
  onBack,
  onSelectStation,
}: BarrierFreePlaceDetailViewProps) {
  const [detail, setDetail] = useState<OpenApiPlaceDetail | null>(() => getKoreaTourApiPlaceDetail(placeId));
  const [loading, setLoading] = useState(false);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [apiSource, setApiSource] = useState('한국관광공사 KorWithService2 무장애 관광정보');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState(false);

  // 비동기 OpenAPI 데이터 동기화
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchTourApiPlaceDetail(placeId).then((res) => {
      if (!isMounted) return;
      setLoading(false);
      if (res.data) {
        setDetail(res.data);
        setIsLiveApi(res.isLiveApi);
        setApiSource(res.source);
        if (!selectedImage) {
          setSelectedImage(res.data.firstImage);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [placeId]);

  // 클립보드 복사 유틸
  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  // 링크 공유
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: detail ? detail.nameKo : '부산 무장애 관광지',
        text: detail ? `${detail.nameKo} - 한국관광공사 무장애 관광 정보` : '부산 무장애 관광',
        url,
      }).catch(() => {
        copyToClipboard(url, 'share');
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2500);
      });
    } else {
      copyToClipboard(url, 'share');
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  if (!detail && !loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl">
          🔍
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-black text-slate-800">
            {language === 'KR' ? '관광지 정보를 찾을 수 없습니다.' : 'Place not found.'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'KR'
              ? '요청하신 관광지 ID에 해당하는 한국관광공사 데이터가 존재하지 않습니다.'
              : 'No matching Korea Tourism Organization data for this place ID.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A2540] hover:bg-[#11161B] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'KR' ? '추천 관광지 목록으로 돌아가기' : 'Return to Tourist Spots List'}</span>
        </button>
      </div>
    );
  }

  const currentPlace = detail!;
  const displayImage = selectedImage || currentPlace.firstImage;
  const subwayStyle = getSubwayStyle(currentPlace.subwayLine || '1호선');

  // 갤러리 이미지 통합 목록 (대표 이미지 + 추가 이미지)
  const allImages = [currentPlace.firstImage, ...(currentPlace.additionalImages || [])].filter(Boolean);

  return (
    <article className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-7 animate-fade-in text-left pb-28">
      {/* 1. 상단 내비게이션 바 (뒤로 가기 & OpenAPI 상태) */}
      <header className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3.5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all cursor-pointer"
          aria-label="이전 목록으로 돌아가기"
        >
          <ArrowLeft className="w-4 h-4 text-slate-700" />
          <span>{language === 'KR' ? '추천 관광지 목록으로' : 'Back to Spots List'}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* 한국관광공사 OpenAPI 연동 뱃지 */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">한국관광공사</span>
            <span>OpenAPI 연동</span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="상세 페이지 링크 복사"
            aria-label="공유하기"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 공유 토스트 알림 */}
      {shareToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{language === 'KR' ? '상세 페이지 링크가 클립보드에 복사되었습니다!' : 'Link copied to clipboard!'}</span>
        </div>
      )}

      {/* 2. 대표 이미지 & 헤더 카드 */}
      <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="relative w-full h-64 sm:h-80 md:h-96 bg-slate-900 overflow-hidden">
          <img
            src={displayImage}
            alt={language === 'KR' ? currentPlace.nameKo : currentPlace.nameEn}
            className="w-full h-full object-cover transition-all duration-300"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

          {/* 상단 뱃지 그룹: 지역구, 카테고리, 지하철 호선 고유 색상 */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                {language === 'KR' ? currentPlace.districtKo : currentPlace.districtEn}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold shadow-2xs">
                {language === 'KR' ? currentPlace.categoryKo : currentPlace.categoryEn}
              </span>
            </div>

            {/* 부산 지하철 공식 노선 고유 색상 뱃지 */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-black shadow-sm flex items-center gap-1.5 ${subwayStyle.bg} ${subwayStyle.text}`}
            >
              <Train className="w-3.5 h-3.5" />
              <span>{subwayStyle.label}</span>
            </span>
          </div>

          {/* 하단 장소명 타이틀 */}
          <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 text-white space-y-1">
            <span className="text-[11px] font-bold text-emerald-300 tracking-wider uppercase block">
              Korea Tourism Organization · Barrier-Free Spot
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight drop-shadow-md">
              {language === 'KR' ? currentPlace.nameKo : currentPlace.nameEn}
            </h1>
          </div>
        </div>

        {/* 추가 갤러리 이미지 썸네일 (한국관광공사 detailImage2 정보) */}
        {allImages.length > 1 && (
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-slate-500 shrink-0 ml-1">
              {language === 'KR' ? '사진 갤러리' : 'Photos'}:
            </span>
            {allImages.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(imgUrl)}
                className={`relative w-14 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  displayImage === imgUrl ? 'border-[#0A2540] ring-2 ring-blue-300' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`갤러리 사진 ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 3. 주소, 좌표(GPS), 전화번호 핵심 정보 카드 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#0A2540]" />
          <span>{language === 'KR' ? '기본 위치 및 안내 정보' : 'Location & Contact Details'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          {/* 도로명 주소 & 지번 주소 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>{language === 'KR' ? '주소' : 'Address'}</span>
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(currentPlace.addressRoadKo, 'address')}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-300 text-[11px] font-bold text-slate-700 cursor-pointer"
              >
                {copiedField === 'address' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                <span>{copiedField === 'address' ? '복사됨' : '주소 복사'}</span>
              </button>
            </div>

            <div className="space-y-1 pl-5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0">도로명</span>
                <span className="text-slate-800 font-bold leading-relaxed">
                  {language === 'KR' ? currentPlace.addressRoadKo : currentPlace.addressRoadEn}
                </span>
              </div>
              {currentPlace.addressLotKo && (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 shrink-0">지번</span>
                  <span className="text-slate-600 font-medium">
                    {language === 'KR' ? currentPlace.addressLotKo : currentPlace.addressLotEn}
                  </span>
                </div>
              )}
              {currentPlace.zipcode && (
                <p className="text-[11px] text-slate-400 font-medium">
                  우편번호: {currentPlace.zipcode}
                </p>
              )}
            </div>
          </div>

          {/* GPS 좌표 및 길찾기 지도 바로가기 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-600 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{language === 'KR' ? 'GPS 좌표' : 'Coordinates'}</span>
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(`${currentPlace.latitude}, ${currentPlace.longitude}`, 'coords')}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-300 text-[11px] font-bold text-slate-700 cursor-pointer"
              >
                {copiedField === 'coords' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                <span>{copiedField === 'coords' ? '복사됨' : '좌표 복사'}</span>
              </button>
            </div>

            <div className="pl-5 space-y-1 text-slate-700 font-medium">
              <p>
                <span className="font-bold text-slate-900">위도(Lat):</span> {currentPlace.latitude.toFixed(6)}
              </p>
              <p>
                <span className="font-bold text-slate-900">경도(Lng):</span> {currentPlace.longitude.toFixed(6)}
              </p>
            </div>

            {/* 지도 연동 버튼 그룹 */}
            <div className="pt-2 pl-5 flex flex-wrap gap-1.5">
              <a
                href={`https://map.kakao.com/link/map/${encodeURIComponent(currentPlace.nameKo)},${currentPlace.latitude},${currentPlace.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FEE500] hover:bg-[#FDD800] text-[#191919] text-xs font-bold shadow-2xs"
              >
                <span>카카오맵</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={`https://map.naver.com/v5/search/${encodeURIComponent(currentPlace.nameKo)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#03C75A] hover:bg-[#02b350] text-white text-xs font-bold shadow-2xs"
              >
                <span>네이버지도</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${currentPlace.latitude},${currentPlace.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs"
              >
                <span>구글지도</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 문의처 및 전화번호 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 md:col-span-2">
            <span className="font-bold text-slate-600 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{language === 'KR' ? '문의 및 안내 전화' : 'Contact & Inquiries'}</span>
            </span>

            <div className="pl-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <a
                  href={`tel:${currentPlace.tel.replace(/[^0-9]/g, '')}`}
                  className="text-base sm:text-lg font-black text-[#0A2540] hover:underline"
                >
                  {currentPlace.tel}
                </a>
                {currentPlace.telDescKo && (
                  <p className="text-xs text-slate-500 font-medium">{currentPlace.telDescKo}</p>
                )}
              </div>

              <a
                href={`tel:${currentPlace.tel.replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{language === 'KR' ? '전화 바로 걸기' : 'Call Now'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 개요 정보 (한국관광공사 공통정보 및 이용안내) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>{language === 'KR' ? '관광지 개요 (Overview)' : 'Overview & Information'}</span>
        </h2>

        {/* 상세 개요 문장 */}
        <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed sm:leading-loose whitespace-pre-line bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-100">
          {language === 'KR' ? currentPlace.overviewKo : currentPlace.overviewEn}
        </p>

        {/* 상세 운영 정보 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {currentPlace.useTimeKo && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>이용 시간</span>
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                {language === 'KR' ? currentPlace.useTimeKo : currentPlace.useTimeEn}
              </p>
            </div>
          )}

          {currentPlace.restDateKo && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                <span>쉬는 날 (휴무)</span>
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                {language === 'KR' ? currentPlace.restDateKo : currentPlace.restDateEn}
              </p>
            </div>
          )}

          {currentPlace.feeKo && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>이용요금 / 관람료</span>
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                {language === 'KR' ? currentPlace.feeKo : currentPlace.feeEn}
              </p>
            </div>
          )}

          {currentPlace.homepage && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2 lg:col-span-3">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-purple-600" />
                <span>공식 웹사이트</span>
              </span>
              <a
                href={currentPlace.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-bold text-[#0A2540] hover:underline flex items-center gap-1 truncate"
              >
                <span>{currentPlace.homepage}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* 5. 무장애 정보 풀 (한국관광공사 KorWithService2 detailWithTour2 규격) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="text-xl">♿</span>
              <span>{language === 'KR' ? '무장애 편의시설 상세 정보' : 'Barrier-Free Accessibility Data'}</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              한국관광공사 공공데이터포털(KorWithService2) 무장애 항목별 검증 정보
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>검증 완료 데이터</span>
          </span>
        </div>

        {/* 8대 무장애 편의시설 세부 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {Object.entries(currentPlace.barrierFree).map(([key, item]) => (
            <div
              key={key}
              className={`p-4 rounded-xl border transition-all ${
                item.available
                  ? 'bg-slate-50/90 border-slate-200 hover:border-slate-300'
                  : 'bg-slate-50/50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900">
                      {language === 'KR' ? item.titleKo : item.titleEn}
                    </h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-100">
                      {item.tag}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                    item.available
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {item.available ? (language === 'KR' ? '완비' : 'Available') : (language === 'KR' ? '미구비' : 'N/A')}
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed pl-8">
                {language === 'KR' ? item.descKo : item.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. 대중교통 및 무단차 이동 경로 안내 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
          <Train className="w-5 h-5 text-blue-600" />
          <span>{language === 'KR' ? '대중교통 & 지하철 무단차 이동 경로' : 'Transit & Stepless Route Guide'}</span>
        </h2>

        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${subwayStyle.bg} ${subwayStyle.text}`}>
                {currentPlace.subwayLine}
              </span>
              <span className="text-sm sm:text-base font-black text-slate-900">
                {language === 'KR' ? currentPlace.nearestStationNameKo : currentPlace.nearestStationNameEn}
              </span>
            </div>

            <span className="text-xs font-bold text-blue-950 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs">
              🛗 {currentPlace.recommendedExit}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 font-bold pl-1">
            <span>도보 약 {currentPlace.walkingDistanceMeters}m</span>
            <span>•</span>
            <span>소요 시간: 약 {currentPlace.walkingTimeMinutes}분</span>
            <span>•</span>
            <span className="text-emerald-700">단차 0cm 평탄 이동</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-blue-100">
            💡 {language === 'KR' ? currentPlace.transitTipKo : currentPlace.transitTipEn}
          </p>

          {onSelectStation && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  const stationQuery = currentPlace.nearestStationNameKo.split(' ')[0].replace(/역$/, '');
                  onSelectStation(stationQuery);
                }}
                className="w-full py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#11161B] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Train className="w-3.5 h-3.5" />
                <span>
                  {language === 'KR'
                    ? `${currentPlace.nearestStationNameKo} 엘리베이터 위치 및 출구 정보 확인`
                    : 'View Subway Station Elevator Details'}
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 7. 데이터 출처 안내 배너 */}
      <footer className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 text-xs text-center space-y-1">
        <p className="font-bold text-slate-700">
          데이터 출처: {apiSource}
        </p>
        <p className="text-[11px]">
          본 정보는 한국관광공사 공공데이터포털 TourAPI 4.0 및 KorWithService2를 기반으로 제공되며, 현장 사정에 따라 변동될 수 있습니다.
        </p>
      </footer>

      {/* 8. 모바일 하단 고정 바 (목록으로 가기 / 전화 걸기 / 지도 보기) */}
      <nav aria-label="모바일 하단 빠른 실행" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:hidden shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center justify-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>목록으로</span>
          </button>

          <a
            href={`https://map.kakao.com/link/map/${encodeURIComponent(currentPlace.nameKo)},${currentPlace.latitude},${currentPlace.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 rounded-xl bg-[#FEE500] text-[#191919] text-xs font-black flex items-center justify-center gap-1"
          >
            <Navigation className="w-4 h-4" />
            <span>지도 보기</span>
          </a>

          <a
            href={`tel:${currentPlace.tel.replace(/[^0-9]/g, '')}`}
            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1"
          >
            <Phone className="w-4 h-4" />
            <span>전화 걸기</span>
          </a>
        </div>
      </nav>
    </article>
  );
}
