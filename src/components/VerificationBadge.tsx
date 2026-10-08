import React from 'react';
import { CheckCircle2, UserCheck, Calendar } from 'lucide-react';

interface VerificationBadgeProps {
  language?: 'KR' | 'EN';
  className?: string;
  stationName?: string;
  variant?: 'card' | 'inline' | 'compact';
  onOpenReportModal?: () => void;
}

export function VerificationBadge({ 
  language = 'KR', 
  className = '', 
  variant = 'card'
}: VerificationBadgeProps) {
  // 점검기준은 매일 오늘 날짜로 자동 변경 (YYYY.MM.DD)
  const today = new Date();
  const todayStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs text-slate-500 ${className}`}>
        <span className="font-bold text-slate-700 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{language === 'KR' ? '현장 중심 안내' : 'Field-Oriented Guide'}</span>
        </span>
        <span className="text-slate-300">|</span>
        <span>{language === 'KR' ? '에디터:' : 'Editor:'} <strong className="text-slate-700 font-medium">{language === 'KR' ? '플로레르(Floreur)' : 'Floreur'}</strong></span>
        <span className="text-slate-300">|</span>
        <span>{language === 'KR' ? '점검 기준:' : 'Review Standard:'} <strong className="text-slate-700 font-medium">{todayStr}</strong></span>
        <span className="text-slate-300">|</span>
        <span>
          {language === 'KR' ? '공식 출처:' : 'Source:'}{' '}
          <strong className="text-slate-700 font-medium">
            {language === 'KR' ? '네이버지도, 구글맵, 한국관광공사openAPI' : 'Naver Map, Google Maps, Korea Tourism Org OpenAPI'}
          </strong>
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-emerald-50/90 via-slate-50 to-blue-50/80 border border-emerald-200/80 rounded-2xl p-3.5 sm:p-4 text-xs text-slate-700 shadow-xs ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 font-extrabold text-emerald-900 bg-emerald-100/90 px-3 py-1 rounded-xl border border-emerald-300/80 shadow-2xs text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{language === 'KR' ? '현장 중심 동선 가이드' : 'Field-Oriented Route Guide'}</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-slate-700">
          <span className="inline-flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{language === 'KR' ? '에디터:' : 'Editor:'} <strong className="text-slate-900 font-bold">{language === 'KR' ? '플로레르(Floreur)' : 'Floreur'}</strong></span>
          </span>
          <span className="text-slate-300">|</span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{language === 'KR' ? '점검 기준:' : 'Review Basis:'} <strong className="text-slate-900 font-bold">{todayStr}</strong></span>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            {language === 'KR' ? '공식 출처:' : 'Source:'}{' '}
            <strong className="text-slate-900 font-bold">
              {language === 'KR' ? '네이버지도, 구글맵, 한국관광공사openAPI' : 'Naver Map, Google Maps, Korea Tourism Org OpenAPI'}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
