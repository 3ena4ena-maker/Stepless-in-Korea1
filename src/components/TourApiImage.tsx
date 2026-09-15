/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 한국관광공사 TourAPI 이미지 연동 컴포넌트
 * contentId 기반 이미지 처리 및 로드 실패 시 부산 풍경 기본 플레이스홀더 제공
 */

import React, { useState } from 'react';
import { Camera, MapPin, ImageOff } from 'lucide-react';
import { getPlaceImageUrl } from '../utils/barrierFreeRecommendation';

interface TourApiImageProps {
  contentId?: string;
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export default function TourApiImage({
  contentId,
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackTitle,
}: TourApiImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // contentId가 있으면 해당 이미지 우선, 없거나 실패 시 제공된 src 또는 기본 이미지
  const initialUrl = contentId ? getPlaceImageUrl(contentId, src) : src;

  if (error || !initialUrl) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 p-4 select-none ${className}`}
        aria-label={alt}
      >
        <div className="w-10 h-10 rounded-full bg-white/80 border border-slate-300 flex items-center justify-center mb-1.5 shadow-2xs">
          <Camera className="w-5 h-5 text-slate-500" />
        </div>
        <span className="text-[11px] font-bold text-slate-600 text-center line-clamp-1">
          {fallbackTitle || alt}
        </span>
        <span className="text-[10px] text-slate-400 font-medium">
          한국관광공사 TourAPI 이미지 준비 중
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900">
      {!loaded && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
          <Camera className="w-6 h-6 text-slate-300" />
        </div>
      )}
      <img
        src={initialUrl}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
