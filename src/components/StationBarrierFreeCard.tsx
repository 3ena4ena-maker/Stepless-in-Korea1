import React from 'react';
import { Station } from '../types';
import { Language, pickLang } from '../i18n/dictionary';
import {
  formatExitNumberI18n,
  formatLineLabelI18n,
  getLocalizedStationTitle,
  getStationLocalized,
} from '../i18n/stationTranslations';
import { VerificationBadge } from './VerificationBadge';
import { Train, Clock, MapPin, AlertTriangle, ArrowRightLeft, ShieldCheck, Box, Compass } from 'lucide-react';
import { renderLockerInfo } from '../data/lockers';
import { getNearbyPlaces, NearbyExitBadge } from '../data/nearbyPlaces';
import BusanAffiliateQuickBar from './BusanAffiliateQuickBar';

interface StationBarrierFreeCardProps {
  station: Station;
  language?: Language;
}

function translateRecommendedExits(text?: string): string {
  if (!text) return 'Level elevator exits';
  const nums = text.match(/\d+/g);
  if (!nums || nums.length === 0) return text;
  if (nums.length === 1) return `Exit ${nums[0]}`;
  if (nums.length === 2) return `Exits ${nums[0]} & ${nums[1]}`;
  return `Exits ${nums.slice(0, -1).join(', ')} & ${nums[nums.length - 1]}`;
}

const ElevatorIcon = ({ className = "w-4 h-4 shrink-0" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2.5" />
    <path d="M 7.5 10 L 9.5 7 L 11.5 10 Z" fill="currentColor" stroke="none" />
    <path d="M 7.5 14 L 9.5 17 L 11.5 14 Z" fill="currentColor" stroke="none" />
    <line x1="14.5" y1="3" x2="14.5" y2="21" strokeDasharray="2 2" strokeWidth="1.5" />
    <path d="M 14.5 12 L 17.5 12" />
    <path d="M 17.5 12 L 16 10.5" />
    <path d="M 17.5 12 L 16 13.5" />
  </svg>
);

const EscalatorIcon = ({ className = "w-4 h-4 shrink-0" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="10" cy="7.5" r="1.8" fill="currentColor" stroke="none" />
    <path d="M 10 10.2 L 10 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 3.5 19.5 L 7.5 19.5 C 9.5 19.5, 10.5 18, 12 15.5 L 15.5 10 C 17 8, 18 7, 20.5 7 L 22.5 7" />
  </svg>
);

function renderDirectionArrows(dir?: 'UP' | 'DOWN' | 'BOTH') {
  if (dir === 'UP') {
    return <span className="text-rose-500 font-black text-sm leading-none">↑</span>;
  }
  if (dir === 'DOWN') {
    return <span className="text-blue-500 font-black text-sm leading-none">↓</span>;
  }
  return (
    <span className="inline-flex items-center gap-0.5 leading-none">
      <span className="text-rose-500 font-black text-sm leading-none">↑</span>
      <span className="text-blue-500 font-black text-sm leading-none">↓</span>
    </span>
  );
}

export function StationBarrierFreeCard({ station, language = 'KR' }: StationBarrierFreeCardProps) {
  const displayName = getLocalizedStationTitle(station, language, false);
  const shortDisplayName = getLocalizedStationTitle(station, language, true);
  const lineLabels = station.lines.map(l => formatLineLabelI18n(l, language)).join(' · ');
  const nearbyPlaces = getNearbyPlaces(station.id, language);
  const localized = getStationLocalized(station, language);

  const bothExits = (station.exits || []).filter(e => e.hasElevator && e.hasEscalator);
  const elevatorOnlyExits = (station.exits || []).filter(e => e.hasElevator && !e.hasEscalator);
  const escalatorOnlyExits = (station.exits || []).filter(e => !e.hasElevator && e.hasEscalator);
  const rampOnlyExits = (station.exits || []).filter(e => !e.hasElevator && !e.hasEscalator && e.isAccessible);

  const recommendedExitsText = localized
    ? localized.recommendedExits
    : language === 'KR'
    ? station.recommendedExits
    : (station.recommendedExitsEn || translateRecommendedExits(station.recommendedExits));

  const avgMovementTimeText = localized
    ? localized.avgMovementTime
    : language === 'KR'
    ? station.avgMovementTime
    : (station.avgMovementTimeEn || station.avgMovementTime);

  const transferRouteText = localized
    ? localized.transferRouteDesc
    : language === 'KR'
    ? station.transferRouteDesc
    : (station.transferRouteDescEn || station.transferRouteDesc);

  const precautionsText = localized
    ? localized.precautions
    : language === 'KR'
    ? station.precautions
    : (station.precautionsEn || station.precautions);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md p-3.5 sm:p-7 space-y-5 sm:space-y-6 text-left my-4 sm:my-6" id={`station-summary-${station.id}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[#8EA85E] text-white shadow-xs">
            <Train className="w-5 h-5" />
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
            {displayName}{' '}
            {pickLang(language, {
              KR: '배리어프리 이동 정보',
              EN: 'Barrier-Free Route Guide',
              JA: 'バリアフリー移動案内',
              ZH_TW: '無障礙移動指南',
              ZH_CN: '无障碍出行指南',
              ES: 'Guía de Ruta Accesible',
              FR: 'Guide d’Itinéraire Accessible',
            })}
          </h2>
        </div>
      </div>

      {/* Summary Table & Step-by-Step Info */}
      <div className="space-y-4">
        <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#004481]" />
          <span>
            {pickLang(language, {
              KR: `${station.name} 핵심 배리어프리 요약표`,
              EN: `${shortDisplayName} Accessibility Summary`,
              JA: `${shortDisplayName} バリアフリー要点まとめ`,
              ZH_TW: `${shortDisplayName} 無障礙核心總覽表`,
              ZH_CN: `${shortDisplayName} 无障碍核心总览表`,
              ES: `Resumen de Accesibilidad — ${shortDisplayName}`,
              FR: `Résumé d’Accessibilité — ${shortDisplayName}`,
            })}
          </span>
        </h3>

        <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
          <table className="w-full text-xs sm:text-sm text-left border-collapse block sm:table">
            <tbody className="block sm:table-row-group">
              {/* 1. 역명 */}
              <tr className="block sm:table-row border-b border-slate-150 bg-slate-50/50">
                <th className="block sm:table-cell py-2 px-3 sm:py-3 sm:px-4 font-bold text-slate-800 bg-slate-100/90 sm:bg-slate-100/70 border-b sm:border-b-0 sm:border-r border-slate-200/80 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Train className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#004481] shrink-0" />
                    <span>
                      {pickLang(language, {
                        KR: '역명',
                        EN: 'Station',
                        JA: '駅名',
                        ZH_TW: '站名',
                        ZH_CN: '站名',
                        ES: 'Estación',
                        FR: 'Station',
                      })}
                    </span>
                  </div>
                </th>
                <td className="block sm:table-cell py-2.5 px-3 sm:py-3 sm:px-4 text-slate-800 font-extrabold text-xs sm:text-sm">
                  <p>
                    {displayName} ({lineLabels}{' '}
                    {station.isTransferStation
                      ? pickLang(language, { KR: '환승역', EN: 'Transfer Station', JA: '乗換駅', ZH_TW: '轉乘站', ZH_CN: '换乘站', ES: 'Estación de transbordo', FR: 'Correspondance' })
                      : pickLang(language, { KR: '단일노선', EN: 'Single Line', JA: '単一路線', ZH_TW: '單一路線', ZH_CN: '单一路线', ES: 'Línea única', FR: 'Ligne unique' })}
                    )
                  </p>
                </td>
              </tr>

              {/* 2. 출구 정보 */}
              <tr className="block sm:table-row border-b border-slate-150">
                <th className="block sm:table-cell py-2 px-3 sm:py-3 sm:px-4 font-bold text-slate-800 bg-slate-100/90 sm:bg-slate-100/70 border-b sm:border-b-0 sm:border-r border-slate-200/80 text-xs sm:text-sm align-top">
                  <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1.5">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8EA85E] shrink-0" />
                    <span>
                      {pickLang(language, {
                        KR: '출구 정보',
                        EN: 'Exit Info',
                        JA: '出口・昇降設備',
                        ZH_TW: '出口與電梯資訊',
                        ZH_CN: '出口与电梯信息',
                        ES: 'Salidas y Ascensores',
                        FR: 'Sorties & Ascenseurs',
                      })}
                    </span>
                  </div>
                </th>
                <td className="block sm:table-cell py-2.5 px-3 sm:py-3 sm:px-4 text-slate-800 text-xs sm:text-sm space-y-3">
                  {/* Recommended Exit */}
                  {recommendedExitsText && (
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm break-keep">
                      {recommendedExitsText}
                    </div>
                  )}
                  {/* Unified Exit Facilities Badges */}
                  {(bothExits.length > 0 || elevatorOnlyExits.length > 0 || escalatorOnlyExits.length > 0 || rampOnlyExits.length > 0) ? (
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      {/* 1. 둘 다 있는 출구 (Both EV + ES) */}
                      {bothExits.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          {bothExits.map((exit, idx) => (
                            <span
                              key={idx}
                              className="font-bold text-slate-800 bg-[#F2F7F2] hover:bg-[#EBF3EA] px-2.5 py-1.5 rounded-xl border border-[#D0E2CF] shadow-2xs inline-flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm max-w-full transition-colors"
                            >
                              <span className="text-slate-900 font-extrabold break-keep">{formatExitNumberI18n(exit.number, language)}</span>
                              <span className="w-px h-3.5 bg-slate-200/90 shrink-0 hidden sm:inline-block" />
                              <span className="inline-flex items-center gap-1.5 text-xs shrink-0">
                                <span className="inline-flex items-center gap-1 text-[#2E6B3E] font-bold">
                                  <ElevatorIcon className="w-3.5 h-3.5 text-[#2E6B3E]" />
                                  <span>EV</span>
                                </span>
                                <span className="text-slate-400 font-bold">+</span>
                                <span className="inline-flex items-center gap-1 text-[#2D5B88] font-bold">
                                  <EscalatorIcon className="w-3.5 h-3.5 text-[#2D5B88]" />
                                  <span>ES</span>
                                </span>
                                {renderDirectionArrows(exit.facilityDirection)}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 2. 엘리베이터만 있는 출구 (EV Only) */}
                      {elevatorOnlyExits.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          {elevatorOnlyExits.map((exit, idx) => (
                            <span
                              key={idx}
                              className="font-bold text-slate-800 bg-[#F8FAF7] hover:bg-[#F0F5EE] px-2.5 py-1.5 rounded-xl border border-[#DEE7D7] shadow-2xs inline-flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm max-w-full transition-colors"
                            >
                              <span className="text-slate-900 font-extrabold break-keep">{formatExitNumberI18n(exit.number, language)}</span>
                              <span className="w-px h-3.5 bg-slate-200/90 shrink-0 hidden sm:inline-block" />
                              <span className="inline-flex items-center gap-1 text-[#55702E] font-bold text-xs shrink-0">
                                <ElevatorIcon className="w-3.5 h-3.5 text-[#55702E]" />
                                <span>EV</span>
                              </span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 3. 에스컬레이터만 있는 출구 (ES Only) */}
                      {escalatorOnlyExits.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          {escalatorOnlyExits.map((exit, idx) => (
                            <span
                              key={idx}
                              className="font-bold text-slate-800 bg-[#F9FBFC] hover:bg-[#F0F4F8] px-2.5 py-1.5 rounded-xl border border-[#DEE5ED] shadow-2xs inline-flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm max-w-full transition-colors"
                            >
                              <span className="text-slate-900 font-extrabold break-keep">{formatExitNumberI18n(exit.number, language)}</span>
                              <span className="w-px h-3.5 bg-slate-200/90 shrink-0 hidden sm:inline-block" />
                              <span className="inline-flex items-center gap-1.5 text-xs shrink-0">
                                <span className="inline-flex items-center gap-1 text-[#3B668F] font-bold">
                                  <EscalatorIcon className="w-3.5 h-3.5 text-[#3B668F]" />
                                  <span>ES</span>
                                </span>
                                {renderDirectionArrows(exit.facilityDirection)}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 4. 무장애 경사로(슬로프)가 있는 출구 (Ramp Only) */}
                      {rampOnlyExits.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          {rampOnlyExits.map((exit, idx) => (
                            <span
                              key={idx}
                              className="font-bold text-slate-800 bg-amber-50/70 hover:bg-amber-100/70 px-2.5 py-1.5 rounded-xl border border-amber-200 shadow-2xs inline-flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm max-w-full transition-colors"
                            >
                              <span className="text-slate-900 font-extrabold break-keep">{formatExitNumberI18n(exit.number, language)}</span>
                              <span className="w-px h-3.5 bg-amber-200/90 shrink-0 hidden sm:inline-block" />
                              <span className="inline-flex items-center gap-1 text-amber-800 font-bold text-xs shrink-0">
                                <span>
                                  📐{' '}
                                  {pickLang(language, {
                                    KR: '계단 옆 완만한 경사로(슬로프)',
                                    EN: 'Step-Free Ramp (Slope)',
                                    JA: '階段横の緩やかなスロープ',
                                    ZH_TW: '階梯旁無障礙緩坡道',
                                    ZH_CN: '楼梯旁无障碍缓坡道',
                                    ES: 'Rampa accesible junto a escaleras',
                                    FR: 'Rampe d’accès douce sans marche',
                                  })}
                                </span>
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (station.id === 'osiria' || station.id === 'songjeong') ? (
                    <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 text-xs sm:text-sm font-semibold leading-relaxed">
                      {pickLang(language, {
                        KR: '✨ 1층 대합실-지상 보도 평지 직결 역사입니다. 2층 승강장 ↔ 1층 개찰구 구간만 역사 내부 엘리베이터·에스컬레이터를 이용하시면, 바깥 출구로 나갈 때는 별도의 엘리베이터나 에스컬레이터 없이 모든 출구가 계단 없는 1층 평지로 바로 이어집니다.',
                        EN: '✨ Ground-level flat concourse station. After taking the indoor elevator from the 2F platform to the 1F ticket gate, all exits open directly onto flat street-level sidewalks with no stairs or exterior lifts needed.',
                        JA: '✨ 1階改札階がそのまま地上歩道と平面直結している駅です。2階ホーム ↔ 1階改札のみ駅舎内のエレベーター・エスカレーターを利用すれば、外の出口へ出る際はすべての出口が段差ゼロの平地へそのままつながっています。',
                        ZH_TW: '✨ 此站為 1樓穿堂層與地面人行道完全平齊的車站。只需在「2樓月台 ↔ 1樓驗票口」搭乘站內電梯或電扶梯，出閘門後所有出口皆為免爬樓梯的 1樓平地，無需室外電梯即可直接出站。',
                        ZH_CN: '✨ 本站为 1层站厅与地面人行道完全平齐的车站。只需在“2层站台 ↔ 1层检票口”乘坐站内直梯或扶梯，出闸机后所有出口均为无台阶的 1层平地，无需室外电梯即可直接出站。',
                        ES: '✨ Estación con vestíbulo en planta baja (1F) a nivel de calle. Tras bajar del andén (2F) a los tornos (1F) en el ascensor interior, todas las salidas conectan directamente con la acera llana sin ningún escalón.',
                        FR: '✨ Station avec hall au rez-de-chaussée (1F) de plain-pied. Après avoir pris l’ascenseur intérieur du quai (2F) jusqu’aux portillons (1F), toutes les sorties donnent directement sur le trottoir plat sans aucune marche.',
                      })}
                    </div>
                  ) : (
                    <p className="text-2xs sm:text-xs text-slate-400 font-medium">
                      {pickLang(language, {
                        KR: '지상 연결 승강 설비 없음',
                        EN: 'No ground-level lifts or escalators',
                        JA: '地上連絡の昇降設備なし',
                        ZH_TW: '無地面連通升降設備',
                        ZH_CN: '无地面连通升降设备',
                        ES: 'Sin ascensores ni escaleras mecánicas en superficie',
                        FR: 'Aucun ascenseur ou escalator vers la surface',
                      })}
                    </p>
                  )}
                </td>
              </tr>

              {/* 5. 이동 시간 */}
              <tr className="block sm:table-row border-b border-slate-150 bg-slate-50/50">
                <th className="block sm:table-cell py-2 px-3 sm:py-3 sm:px-4 font-bold text-slate-800 bg-slate-100/90 sm:bg-slate-100/70 border-b sm:border-b-0 sm:border-r border-slate-200/80 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                    <span>
                      {pickLang(language, {
                        KR: '이동 시간',
                        EN: 'Walking Time',
                        JA: '移動所要時間',
                        ZH_TW: '移動時間',
                        ZH_CN: '移动时间',
                        ES: 'Tiempo de recorrido',
                        FR: 'Temps de parcours',
                      })}
                    </span>
                  </div>
                </th>
                <td className="block sm:table-cell py-2.5 px-3 sm:py-3 sm:px-4 text-slate-700 font-medium text-xs sm:text-sm">
                  <p>{avgMovementTimeText}</p>
                </td>
              </tr>

              {/* 6. 환승 동선 */}
              <tr className="block sm:table-row border-b border-slate-150">
                <th className="block sm:table-cell py-2 px-3 sm:py-3 sm:px-4 font-bold text-slate-800 bg-slate-100/90 sm:bg-slate-100/70 border-b sm:border-b-0 sm:border-r border-slate-200/80 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 shrink-0" />
                    <span>
                      {pickLang(language, {
                        KR: '환승 동선',
                        EN: 'Transfer Route',
                        JA: '移動・乗換ルート',
                        ZH_TW: '無障礙轉乘動線',
                        ZH_CN: '无障碍换乘路线',
                        ES: 'Ruta de transbordo',
                        FR: 'Correspondance',
                      })}
                    </span>
                  </div>
                </th>
                <td className="block sm:table-cell py-2.5 px-3 sm:py-3 sm:px-4 text-slate-700 font-medium text-xs sm:text-sm break-keep">
                  <p>{transferRouteText}</p>
                </td>
              </tr>

              {/* 7. 물품보관함 */}
              <tr className="block sm:table-row border-b border-slate-150 bg-slate-50/50">
                <th className="block sm:table-cell py-2 px-3 sm:py-3 sm:px-4 font-bold text-slate-800 bg-slate-100/90 sm:bg-slate-100/70 border-b sm:border-b-0 sm:border-r border-slate-200/80 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 shrink-0" />
                    <span>
                      {pickLang(language, {
                        KR: '물품보관함',
                        EN: 'Luggage Lockers',
                        JA: 'コインロッカー',
                        ZH_TW: '行李寄物櫃',
                        ZH_CN: '行李寄存柜',
                        ES: 'Consignas de equipaje',
                        FR: 'Consignes à bagages',
                      })}
                    </span>
                  </div>
                </th>
                <td className="block sm:table-cell py-2.5 px-3 sm:py-3 sm:px-4 text-slate-700 font-medium text-xs sm:text-sm">
                  {renderLockerInfo(station.id, language)}
                  <BusanAffiliateQuickBar language={language} variant="locker-inline" />
                </td>
              </tr>

              {/* 8. 주변 가볼 만한 곳 */}
              <tr className="block sm:table-row border-b border-slate-150 bg-slate-50/30">
                <th className="block sm:table-cell py-2 px-3 sm:py-3 sm:px-4 font-bold text-slate-800 bg-slate-100/90 sm:bg-slate-100/70 border-b sm:border-b-0 sm:border-r border-slate-200/80 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8EA85E] shrink-0" />
                    <span>
                      {pickLang(language, {
                        KR: '주변 가볼 만한 곳',
                        EN: 'Nearby Places',
                        JA: '周辺のおすすめスポット',
                        ZH_TW: '周邊推薦景點',
                        ZH_CN: '周边推荐景点',
                        ES: 'Lugares de interés',
                        FR: 'Lieux à proximité',
                      })}
                    </span>
                  </div>
                </th>
                <td className="block sm:table-cell py-2.5 px-3 sm:py-3 sm:px-4 text-slate-800 font-medium text-xs sm:text-sm">
                  {nearbyPlaces.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      {nearbyPlaces.map((place, idx) => (
                        <div 
                          key={idx} 
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2.5 bg-[#FAFBFD] p-2.5 sm:p-2 sm:px-3 rounded-xl border border-slate-200/70 shadow-2xs"
                        >
                          <div className="flex items-start sm:items-center gap-1.5 sm:gap-2 min-w-0 flex-wrap sm:flex-nowrap">
                            <span className="font-extrabold text-slate-900 text-xs sm:text-[13px] shrink-0">
                              {place.name}
                            </span>
                            <span className="text-slate-300 select-none hidden sm:inline">|</span>
                            <span className="text-slate-600 text-[11px] sm:text-xs break-keep">
                              {place.desc}
                            </span>
                          </div>
                          {place.exits && place.exits.length > 0 && (
                            <div className="flex items-center gap-1 shrink-0 flex-wrap sm:flex-nowrap mt-0.5 sm:mt-0 sm:ml-auto">
                              {place.exits.map((ex, exIdx) => (
                                <NearbyExitBadge
                                  key={exIdx}
                                  num={ex.num}
                                  type={ex.type}
                                  line={station.lines[0]}
                                  language={language}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs">
                      {pickLang(language, {
                        KR: '주변 주요 명소 정보 준비 중',
                        EN: 'Nearby places info coming soon',
                        JA: '周辺スポット情報を準備中です',
                        ZH_TW: '周邊景點資訊準備中',
                        ZH_CN: '周边景点信息准备中',
                        ES: 'Información de lugares cercanos próximamente',
                        FR: 'Informations sur les lieux à proximité bientôt disponibles',
                      })}
                    </span>
                  )}
                  <BusanAffiliateQuickBar language={language} variant="nearby-inline" />
                </td>
              </tr>

              {/* 9. 주의사항 */}
              <tr className="block sm:table-row bg-amber-50/40">
                <th className="block sm:table-cell py-2 px-3 sm:py-3 sm:px-4 font-bold text-amber-900 bg-amber-100/80 sm:bg-amber-100/60 border-b sm:border-b-0 sm:border-r border-amber-200/70 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      {pickLang(language, {
                        KR: '주의사항',
                        EN: 'Precautions',
                        JA: 'ご利用のポイント・注意事項',
                        ZH_TW: '貼心提醒與注意事項',
                        ZH_CN: '贴心提示与注意事项',
                        ES: 'Precauciones y consejos',
                        FR: 'Conseils & Précautions',
                      })}
                    </span>
                  </div>
                </th>
                <td className="block sm:table-cell py-2.5 px-3 sm:py-3 sm:px-4 text-amber-900 font-medium text-xs sm:text-sm break-keep">
                  <p>{precautionsText}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Dynamic Field Verification Badge right below Caution */}
        <VerificationBadge language={language} stationName={displayName} variant="compact" />
      </div>

      {/* Step-by-Step Movement Guidelines */}
      <div className="pt-2 space-y-3">
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <span>🚶‍♂️</span>
          <span>
            {pickLang(language, {
              KR: `${station.name} 단계별 이동 가이드`,
              EN: `${shortDisplayName} Step-by-Step Guide`,
              JA: `${shortDisplayName} ステップ別・段差なし移動ガイド`,
              ZH_TW: `${shortDisplayName} 分步無障礙乘車指南`,
              ZH_CN: `${shortDisplayName} 分步无障碍乘车指南`,
              ES: `Guía Paso a Paso — ${shortDisplayName}`,
              FR: `Guide Étape par Étape — ${shortDisplayName}`,
            })}
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1 text-xs">
            <div className="font-extrabold text-[#8EA85E] flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-[#8EA85E] text-white flex items-center justify-center text-2xs">1</span>
              <span>
                {pickLang(language, {
                  KR: '지상 출입구 접근',
                  EN: 'Street Level Access',
                  JA: '地上出口からのアプローチ',
                  ZH_TW: '地面出口無障礙進入',
                  ZH_CN: '地面出口无障碍进入',
                  ES: 'Acceso desde la calle',
                  FR: 'Accès depuis la rue',
                })}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              {pickLang(language, {
                KR: `${recommendedExitsText} 지상 엘리베이터를 이용해 횡단보도 단차 없이 인도에서 바로 승강기에 탑승합니다.`,
                EN: `Use the recommended elevator exit (${recommendedExitsText || 'Exit 1'}) directly from the flat sidewalk without steps.`,
                JA: `推奨ルート（${recommendedExitsText}）を利用して、歩道から段差なしでスムーズに駅構内へ入ります。`,
                ZH_TW: `利用推薦無障礙出口（${recommendedExitsText}），從平坦人行道免爬階梯直接進入車站。`,
                ZH_CN: `使用推荐无障碍出口（${recommendedExitsText}），从平坦人行道无台阶直接进入车站。`,
                ES: `Utiliza la salida recomendada (${recommendedExitsText || 'Salida 1'}) para entrar directamente desde la acera llana sin escalones.`,
                FR: `Empruntez la sortie recommandée (${recommendedExitsText || 'Sortie 1'}) pour entrer directement depuis le trottoir plat sans marche.`,
              })}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1 text-xs">
            <div className="font-extrabold text-[#8EA85E] flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-[#8EA85E] text-white flex items-center justify-center text-2xs">2</span>
              <span>
                {pickLang(language, {
                  KR: '대합실 및 게이트 이동',
                  EN: 'Concourse & Gate',
                  JA: '改札階（コンコース）・ワイド改札',
                  ZH_TW: '穿堂層與無障礙寬閘門',
                  ZH_CN: '站厅层与无障碍宽闸机',
                  ES: 'Vestíbulo y tornos anchos',
                  FR: 'Hall & portillons larges',
                })}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              {pickLang(language, {
                KR: '지하 1층 대합실 엘리베이터에서 내린 후 휠체어·유모차 전용 와이드 개찰구를 통과합니다.',
                EN: 'Exit the elevator at the concourse level and proceed through the wide accessible turnstile.',
                JA: '改札階（コンコース）でエレベーターを降りた後、ベビーカー・車椅子対応の幅広改札口（ワイドゲート）を通過します。',
                ZH_TW: '抵達穿堂層後，請通過專為嬰兒車、輪椅與大型行李箱設計的加寬驗票閘門。',
                ZH_CN: '抵达站厅层后，请通过专为婴儿车、轮椅与大件行李箱设计的加宽检票闸机。',
                ES: 'Sal del ascensor en el nivel del vestíbulo y pasa por el torno ancho especial para cochecitos, sillas de ruedas y maletas.',
                FR: 'Sortez de l’ascenseur au niveau de la mezzanine et franchissez le portillon large dédié aux poussettes, fauteuils roulants et valises.',
              })}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1 text-xs">
            <div className="font-extrabold text-[#8EA85E] flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-[#8EA85E] text-white flex items-center justify-center text-2xs">3</span>
              <span>
                {pickLang(language, {
                  KR: '승강장 탑승',
                  EN: 'Platform Boarding',
                  JA: 'ホーム移動・乗車',
                  ZH_TW: '月台電梯與乘車',
                  ZH_CN: '站台直梯与乘车',
                  ES: 'Andén y embarque',
                  FR: 'Quai & embarquement',
                })}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              {pickLang(language, {
                KR: '플랫폼 연결 승강기를 타고 지하 승강장으로 내려가 탑승 위치(교통약자 우대 구역)에서 안전하게 열차에 탑승합니다.',
                EN: 'Take the platform elevator to train level and board safely at the designated priority boarding area.',
                JA: 'ホーム直結エレベーターで乗り場へ移動し、車椅子・ベビーカー優先乗車スペースから安全に電車へ乗車します。',
                ZH_TW: '搭乘月台專用電梯前往乘車層，於輪椅與嬰兒車友善車廂位置安全上車。',
                ZH_CN: '乘坐站台专用直梯前往乘车层，在轮椅与婴儿车友好车厢位置安全上车。',
                ES: 'Toma el ascensor interno hasta el andén y sube al tren con seguridad en la zona prioritaria para sillas de ruedas y cochecitos.',
                FR: 'Prenez l’ascenseur interne jusqu’au quai et montez à bord en toute sécurité au niveau de l’espace prioritaire pour fauteuils roulants et poussettes.',
              })}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
