import React from 'react';
import { CheckCircle2, UserCheck, Calendar } from 'lucide-react';
import { Language, pickLang } from '../i18n/dictionary';

interface VerificationBadgeProps {
  language?: Language;
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
  const today = new Date();
  const todayStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs text-slate-500 ${className}`}>
        <span className="font-bold text-slate-700 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            {pickLang(language, {
              KR: '현장 중심 안내',
              EN: 'Field-Oriented Guide',
              JA: '現地調査ベース案内',
              ZH_TW: '實地踏查驗證指南',
              ZH_CN: '实地踏勘核验指南',
              ES: 'Guía verificada en terreno',
              FR: 'Guide vérifié sur le terrain',
            })}
          </span>
        </span>
        <span className="text-slate-300">|</span>
        <span>
          {pickLang(language, { KR: '에디터:', EN: 'Editor:', JA: '監修:', ZH_TW: '編輯:', ZH_CN: '编辑:', ES: 'Editor:', FR: 'Éditeur :' })}{' '}
          <strong className="text-slate-700 font-medium">{language === 'KR' ? '플로레르(Floreur)' : 'Floreur'}</strong>
        </span>
        <span className="text-slate-300">|</span>
        <span>
          {pickLang(language, { KR: '점검 기준:', EN: 'Review Standard:', JA: '確認基準日:', ZH_TW: '檢核基準:', ZH_CN: '核验基准:', ES: 'Revisión:', FR: 'Mise à jour :' })}{' '}
          <strong className="text-slate-700 font-medium">{todayStr}</strong>
        </span>
        <span className="text-slate-300">|</span>
        <span>
          {pickLang(language, { KR: '공식 출처:', EN: 'Source:', JA: '出典:', ZH_TW: '官方來源:', ZH_CN: '官方来源:', ES: 'Fuentes:', FR: 'Sources :' })}{' '}
          <strong className="text-slate-700 font-medium">
            {pickLang(language, {
              KR: '네이버지도, 구글맵, 한국관광공사openAPI',
              EN: 'Naver Map, Google Maps, Korea Tourism Org OpenAPI',
              JA: 'NAVERマップ、Googleマップ、韓国観光公社OpenAPI',
              ZH_TW: 'Naver地圖、Google地圖、韓國觀光公社 OpenAPI',
              ZH_CN: 'Naver地图、Google地图、韩国观光公社 OpenAPI',
              ES: 'Naver Map, Google Maps, OpenAPI de la Organización de Turismo de Corea',
              FR: 'Naver Map, Google Maps, OpenAPI de l’Office du Tourisme Coréen',
            })}
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
            <span>
              {pickLang(language, {
                KR: '현장 중심 동선 가이드',
                EN: 'Field-Oriented Route Guide',
                JA: '現地調査ベースのバリアフリー案内',
                ZH_TW: '實地踏查無障礙動線指南',
                ZH_CN: '实地踏勘无障碍路线指南',
                ES: 'Guía de Rutas Verificada en Terreno',
                FR: 'Guide d’Itinéraires Vérifié sur le Terrain',
              })}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-slate-700">
          <span className="inline-flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>
              {pickLang(language, { KR: '에디터:', EN: 'Editor:', JA: '監修:', ZH_TW: '編輯:', ZH_CN: '编辑:', ES: 'Editor:', FR: 'Éditeur :' })}{' '}
              <strong className="text-slate-900 font-bold">{language === 'KR' ? '플로레르(Floreur)' : 'Floreur'}</strong>
            </span>
          </span>
          <span className="text-slate-300">|</span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>
              {pickLang(language, { KR: '점검 기준:', EN: 'Review Basis:', JA: '確認基準日:', ZH_TW: '檢核基準:', ZH_CN: '核验基准:', ES: 'Revisión:', FR: 'Mise à jour :' })}{' '}
              <strong className="text-slate-900 font-bold">{todayStr}</strong>
            </span>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            {pickLang(language, { KR: '공식 출처:', EN: 'Source:', JA: '出典:', ZH_TW: '官方來源:', ZH_CN: '官方来源:', ES: 'Fuentes:', FR: 'Sources :' })}{' '}
            <strong className="text-slate-900 font-bold">
              {pickLang(language, {
                KR: '네이버지도, 구글맵, 한국관광공사openAPI',
                EN: 'Naver Map, Google Maps, Korea Tourism Org OpenAPI',
                JA: 'NAVERマップ、Googleマップ、韓国観光公社OpenAPI',
                ZH_TW: 'Naver地圖、Google地圖、韓國觀光公社 OpenAPI',
                ZH_CN: 'Naver地图、Google地图、韩国观光公社 OpenAPI',
                ES: 'Naver Map, Google Maps, OpenAPI de la Organización de Turismo de Corea',
                FR: 'Naver Map, Google Maps, OpenAPI de l’Office du Tourisme Coréen',
              })}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
