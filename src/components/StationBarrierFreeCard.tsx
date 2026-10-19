import React from 'react';
import { Station } from '../types';
import { VerificationBadge } from './VerificationBadge';
import { Train, Clock, MapPin, AlertTriangle, ArrowRightLeft, ShieldCheck, CheckCircle2, Box, Compass } from 'lucide-react';
import { renderLockerInfo } from '../data/lockers';
import { getNearbyPlaces, NearbyExitBadge } from '../data/nearbyPlaces';
import { translateDirectionItem } from '../utils';

interface StationBarrierFreeCardProps {
  station: Station;
  language?: 'KR' | 'EN';
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
    {/* Elevator Cabin Frame */}
    <rect x="3" y="3" width="18" height="18" rx="2.5" />
    {/* Up Arrow Inside */}
    <path d="M 7.5 10 L 9.5 7 L 11.5 10 Z" fill="currentColor" stroke="none" />
    {/* Down Arrow Inside */}
    <path d="M 7.5 14 L 9.5 17 L 11.5 14 Z" fill="currentColor" stroke="none" />
    {/* Center door line */}
    <line x1="14.5" y1="3" x2="14.5" y2="21" strokeDasharray="2 2" strokeWidth="1.5" />
    {/* Door indicator arrows */}
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
    {/* Passenger Circle Head */}
    <circle cx="10" cy="7.5" r="1.8" fill="currentColor" stroke="none" />
    {/* Passenger Body */}
    <path d="M 10 10.2 L 10 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    {/* Escalator Track Slope */}
    <path d="M 3.5 19.5 L 7.5 19.5 C 9.5 19.5, 10.5 18, 12 15.5 L 15.5 10 C 17 8, 18 7, 20.5 7 L 22.5 7" />
  </svg>
);

function formatExitNumber(rawNumber: string, lang: 'KR' | 'EN'): string {
  if (lang === 'KR') {
    return rawNumber.includes('출구') ? rawNumber : `${rawNumber} 출구`;
  }
  return `Exit ${rawNumber.replace(/번\s*출구/g, '')}`;
}

function renderDirectionArrows(dir?: 'UP' | 'DOWN' | 'BOTH') {
  if (dir === 'UP') {
    return <span className="text-rose-500 font-black text-sm leading-none">↑</span>;
  }
  if (dir === 'DOWN') {
    return <span className="text-blue-500 font-black text-sm leading-none">↓</span>;
  }
  // BOTH or undefined
  return (
    <span className="inline-flex items-center gap-0.5 leading-none">
      <span className="text-rose-500 font-black text-sm leading-none">↑</span>
      <span className="text-blue-500 font-black text-sm leading-none">↓</span>
    </span>
  );
}

export function StationBarrierFreeCard({ station, language = 'KR' }: StationBarrierFreeCardProps) {
  const displayName = language === 'KR' ? station.name : (station.englishName || station.name);
  const lineLabels = station.lines.map(l => language === 'KR' ? `${l}호선` : `Line ${l}`).join(' · ');
  const nearbyPlaces = getNearbyPlaces(station.id, language);

  const bothExits = (station.exits || []).filter(e => e.hasElevator && e.hasEscalator);
  const elevatorOnlyExits = (station.exits || []).filter(e => e.hasElevator && !e.hasEscalator);
  const escalatorOnlyExits = (station.exits || []).filter(e => !e.hasElevator && e.hasEscalator);

  const recommendedExitsText = language === 'KR'
    ? station.recommendedExits
    : (station.recommendedExitsEn || translateRecommendedExits(station.recommendedExits));

  const elevatorLocationText = language === 'KR'
    ? station.elevatorLocationDesc
    : (station.elevatorLocationDescEn || station.elevatorLocationDesc);

  const avgMovementTimeText = language === 'KR'
    ? station.avgMovementTime
    : (station.avgMovementTimeEn || station.avgMovementTime);

  const transferRouteText = language === 'KR'
    ? station.transferRouteDesc
    : (station.transferRouteDescEn || station.transferRouteDesc);

  const precautionsText = language === 'KR'
    ? station.precautions
    : (station.precautionsEn || station.precautions);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md p-3.5 sm:p-7 space-y-5 sm:space-y-6 text-left my-4 sm:my-6" id={`station-summary-${station.id}`}>
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#8EA85E] text-white shadow-xs">
              <Train className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
              {displayName} {language === 'KR' ? '배리어프리 이동 정보' : 'Barrier-Free Route Guide'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            {lineLabels} {station.isTransferStation ? (language === 'KR' ? '(환승역)' : '(Transfer Station)') : ''} — {language === 'KR' ? '계단 회피 및 엘리베이터 동선' : 'Step-free elevator pathways'}
          </p>
        </div>

        <a
          href={`https://map.naver.com/v5/search/${encodeURIComponent(station.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200/70 px-4 py-2 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <span>{language === 'KR' ? `네이버지도에서 ${station.name} 보기` : `View ${displayName} on Naver Map`}</span>
        </a>
      </div>

      {/* Summary Table & Step-by-Step Info */}
      <div className="space-y-4">
        <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#004481]" />
          <span>{language === 'KR' ? `${station.name} 핵심 배리어프리 요약표` : `${displayName} Accessibility Summary`}</span>
        </h3>

        <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
          <table className="w-full text-xs sm:text-sm text-left border-collapse block sm:table">
            <tbody className="block sm:table-row-group">
              {/* 1. 역명 */}
              <tr className="block sm:table-row border-b border-slate-150 bg-slate-50/50">
                <th className="block sm:table-cell py-2 px-3 sm:py-3 sm:px-4 font-bold text-slate-800 bg-slate-100/90 sm:bg-slate-100/70 border-b sm:border-b-0 sm:border-r border-slate-200/80 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Train className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#004481] shrink-0" />
                    <span>{language === 'KR' ? '역명' : 'Station'}</span>
                  </div>
                </th>
                <td className="block sm:table-cell py-2.5 px-3 sm:py-3 sm:px-4 text-slate-800 font-extrabold text-xs sm:text-sm">
                  <p>{displayName} ({lineLabels} {station.isTransferStation ? (language === 'KR' ? '환승역' : 'Transfer Station') : (language === 'KR' ? '단일노선' : 'Single Line')})</p>
                </td>
              </tr>

              {/* 2. 출구 정보 (추천 출구 및 승강기 설비 통합 현황) */}
              <tr className="block sm:table-row border-b border-slate-150">
                <th className="block sm:table-cell py-2 px-3 sm:py-3 sm:px-4 font-bold text-slate-800 bg-slate-100/90 sm:bg-slate-100/70 border-b sm:border-b-0 sm:border-r border-slate-200/80 text-xs sm:text-sm align-top">
                  <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1.5">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8EA85E] shrink-0" />
                    <span>{language === 'KR' ? '출구 정보' : 'Exit Info'}</span>
                  </div>
                </th>
                <td className="block sm:table-cell py-2.5 px-3 sm:py-3 sm:px-4 text-slate-800 text-xs sm:text-sm space-y-3">
                  {/* Top: Recommended Exit & Counts */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm break-keep">
                      {recommendedExitsText}
                    </span>
                    <span className="text-2xs sm:text-xs font-bold text-emerald-800 bg-[#F2F8F4] border border-[#D3E8D9] px-2 py-0.5 rounded-md inline-flex items-center gap-1 shrink-0">
                      <span>✓</span>
                      <span>{language === 'KR' ? '단차 없는 추천 출구' : 'Recommended Step-Free'}</span>
                    </span>
                    {station.exits && station.exits.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-2xs sm:text-xs text-slate-500 w-full sm:w-auto sm:ml-auto">
                        <span>
                          {language === 'KR' 
                            ? `총 ${station.exits.length}개 출구:` 
                            : `Total ${station.exits.length} exits:`}
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#F4F7EE] text-[#55702E] font-bold border border-[#DEE8CD]">
                          <ElevatorIcon className="w-3 h-3 text-[#55702E]" />
                          <span>{language === 'KR' ? `엘리베이터 ${station.elevatorCount || station.exits.filter(e => e.hasElevator).length}대` : `EV: ${station.elevatorCount || station.exits.filter(e => e.hasElevator).length}`}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#F0F5FA] text-[#3B668F] font-bold border border-[#D3E0EA]">
                          <EscalatorIcon className="w-3 h-3 text-[#3B668F]" />
                          <span>{language === 'KR' ? `에스컬레이터 ${station.escalatorCount || station.exits.filter(e => e.hasEscalator).length}대` : `ES: ${station.escalatorCount || station.exits.filter(e => e.hasEscalator).length}`}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Unified Exit Facilities Badges */}
                  {(bothExits.length > 0 || elevatorOnlyExits.length > 0 || escalatorOnlyExits.length > 0) ? (
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      {/* 1. 둘 다 있는 출구 (Both EV + ES) */}
                      {bothExits.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          {bothExits.map((exit, idx) => (
                            <span
                              key={idx}
                              className="font-bold text-slate-800 bg-[#F2F7F2] hover:bg-[#EBF3EA] px-2.5 py-1.5 rounded-xl border border-[#D0E2CF] shadow-2xs inline-flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm max-w-full transition-colors"
                            >
                              <span className="text-slate-900 font-extrabold break-keep">{formatExitNumber(exit.number, language)}</span>
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
                              <span className="text-slate-900 font-extrabold break-keep">{formatExitNumber(exit.number, language)}</span>
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
                              <span className="text-slate-900 font-extrabold break-keep">{formatExitNumber(exit.number, language)}</span>
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
                    </div>
                  ) : (
                    <p className="text-2xs sm:text-xs text-slate-400 font-medium">
                      {language === 'KR' ? '지상 연결 승강 설비 없음' : 'No ground-level lifts or escalators'}
                    </p>
                  )}
                </td>
              </tr>

              {/* 5. 이동 시간 */}
              <tr className="block sm:table-row border-b border-slate-150 bg-slate-50/50">
                <th className="block sm:table-cell py-2 px-3 sm:py-3 sm:px-4 font-bold text-slate-800 bg-slate-100/90 sm:bg-slate-100/70 border-b sm:border-b-0 sm:border-r border-slate-200/80 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                    <span>{language === 'KR' ? '이동 시간' : 'Walking Time'}</span>
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
                    <span>{language === 'KR' ? '환승 동선' : 'Transfer Route'}</span>
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
                    <span>{language === 'KR' ? '물품보관함' : 'Luggage Lockers'}</span>
                  </div>
                </th>
                <td className="block sm:table-cell py-2.5 px-3 sm:py-3 sm:px-4 text-slate-700 font-medium text-xs sm:text-sm">
                  {renderLockerInfo(station.id, language)}
                </td>
              </tr>

              {/* 8. 주변 가볼 만한 곳 */}
              <tr className="block sm:table-row border-b border-slate-150 bg-slate-50/30">
                <th className="block sm:table-cell py-2 px-3 sm:py-3 sm:px-4 font-bold text-slate-800 bg-slate-100/90 sm:bg-slate-100/70 border-b sm:border-b-0 sm:border-r border-slate-200/80 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8EA85E] shrink-0" />
                    <span>{language === 'KR' ? '주변 가볼 만한 곳' : 'Nearby Places'}</span>
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
                    <span className="text-slate-400 text-xs">{language === 'KR' ? '주변 주요 명소 정보 준비 중' : 'Nearby places info coming soon'}</span>
                  )}
                </td>
              </tr>

              {/* 9. 주의사항 */}
              <tr className="block sm:table-row bg-amber-50/40">
                <th className="block sm:table-cell py-2 px-3 sm:py-3 sm:px-4 font-bold text-amber-900 bg-amber-100/80 sm:bg-amber-100/60 border-b sm:border-b-0 sm:border-r border-amber-200/70 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{language === 'KR' ? '주의사항' : 'Precautions'}</span>
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

      {/* Step-by-Step Movement Guidelines (1 Paragraph per Step Requirement) */}
      <div className="pt-2 space-y-3">
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <span>🚶‍♂️</span>
          <span>{language === 'KR' ? `${station.name} 단계별 이동 가이드` : `${displayName} Step-by-Step Guide`}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1 text-xs">
            <div className="font-extrabold text-[#8EA85E] flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-[#8EA85E] text-white flex items-center justify-center text-2xs">1</span>
              <span>{language === 'KR' ? '지상 출입구 접근' : 'Street Level Access'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              {language === 'KR'
                ? `${station.recommendedExits} 지상 엘리베이터를 이용해 횡단보도 단차 없이 인도에서 바로 승강기에 탑승합니다.`
                : `Take the ground-level elevator at Exit ${station.recommendedExits || '1'} directly from the sidewalk without steps or curbs.`}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1 text-xs">
            <div className="font-extrabold text-[#8EA85E] flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-[#8EA85E] text-white flex items-center justify-center text-2xs">2</span>
              <span>{language === 'KR' ? '대합실 및 게이트 이동' : 'Concourse & Gate'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              {language === 'KR'
                ? '지하 1층 대합실 엘리베이터에서 내린 후 휠체어·유모차 전용 와이드 개찰구를 통과합니다.'
                : 'Exit the elevator at the B1 concourse level and proceed through the wide accessible turnstile.'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1 text-xs">
            <div className="font-extrabold text-[#8EA85E] flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-[#8EA85E] text-white flex items-center justify-center text-2xs">3</span>
              <span>{language === 'KR' ? '승강장 탑승' : 'Platform Boarding'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              {language === 'KR'
                ? '플랫폼 연결 승강기를 타고 지하 승강장으로 내려가 탑승 위치(교통약자 우대 구역)에서 안전하게 열차에 탑승합니다.'
                : 'Take the platform elevator down to train level and board safely at the designated priority boarding area.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
