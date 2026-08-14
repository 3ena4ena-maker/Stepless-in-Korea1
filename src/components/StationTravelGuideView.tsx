import React from 'react';
import { Station } from '../types';
import { VerificationBadge } from './VerificationBadge';
import { 
  Train, 
  Compass, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Luggage, 
  Baby, 
  Accessibility, 
  HeartHandshake, 
  ExternalLink, 
  AlertTriangle, 
  Clock, 
  Sparkles,
  Info,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { getNearbyPlaces, NearbyExitBadge } from '../data/nearbyPlaces';
import { renderLockerInfo } from '../data/lockers';
import { STATION_CURATIONS, StationCurationData } from '../data/stationTravelCurations';

interface StationTravelGuideViewProps {
  station: Station;
  language?: 'KR' | 'EN';
  onSwitchToStandard?: () => void;
}

export function StationTravelGuideView({ station, language = 'KR', onSwitchToStandard }: StationTravelGuideViewProps) {
  const curation = STATION_CURATIONS[station.id];
  const displayName = language === 'KR' ? station.name : (station.englishName || station.name);
  const lineLabels = station.lines.map(l => language === 'KR' ? `${l}호선` : `Line ${l}`).join(' · ');
  const nearbyPlaces = getNearbyPlaces(station.id, language);

  // If station is not in the 5 pilot set, generate clean contextual curation from existing station metadata
  const introText = curation
    ? (language === 'KR' ? curation.introKo : curation.introEn)
    : (language === 'KR'
        ? `${station.name}은 ${lineLabels}이 통과하는 역으로, ${station.elevatorCount > 0 ? `지상 엘리베이터 ${station.elevatorCount}대와 에스컬레이터 ${station.escalatorCount}대` : '이동 편의 시설'}가 운영 중입니다. 계단 없이 평탄하게 이동할 수 있는 출구를 미리 확인하시면 보다 쾌적하게 여행하실 수 있습니다.`
        : `${displayName} is served by ${lineLabels}, equipped with ${station.elevatorCount} elevator(s) and ${station.escalatorCount} escalator(s). Planning your step-free exit pathway in advance ensures a comfortable journey with luggage or strollers.`);

  const stationRole = curation
    ? (language === 'KR' ? curation.stationRoleKo : curation.stationRoleEn)
    : (language === 'KR' ? `${lineLabels} 배리어프리 거점` : `${lineLabels} Accessible Station Hub`);

  const recommendedExits = curation
    ? (language === 'KR' ? curation.recommendedExitsExplanationKo : curation.recommendedExitsExplanationEn)
    : (station.exits.filter(e => e.hasElevator).length > 0
        ? station.exits.filter(e => e.hasElevator).map(e => ({
            exitNum: language === 'KR' ? `${e.number}` : `Exit ${e.number.replace(/\D/g, '')}`,
            targetTitle: language === 'KR' ? (e.directionDesc || '지상 방면') : (e.directionDescEn || 'Street Level'),
            reason: language === 'KR' ? (e.tip || '지상 수직 승강기가 보도와 직결되어 계단 없이 편리하게 이동할 수 있습니다.') : (e.tipEn || 'Direct vertical elevator connecting to street level without stairs.'),
            hasElevator: e.hasElevator,
            hasEscalator: e.hasEscalator
          }))
        : [{
            exitNum: station.recommendedExits || (language === 'KR' ? '주요 출구' : 'Main Exit'),
            targetTitle: language === 'KR' ? '지상 연결 출구' : 'Street Connection',
            reason: station.elevatorLocationDesc || (language === 'KR' ? '현장 안내 표지판 및 엘리베이터를 이용하여 지상으로 이동하세요.' : 'Follow on-site elevator signage to reach street level.'),
            hasElevator: true,
            hasEscalator: false
          }]);

  const movementSteps = curation
    ? (language === 'KR' ? curation.movementStepsKo : curation.movementStepsEn)
    : [
        {
          step: 1,
          title: language === 'KR' ? '승강장 하차 및 승강기 탑승' : 'Platform Exit & Elevator',
          location: language === 'KR' ? `${lineLabels} 승강장` : `${lineLabels} Platform`,
          desc: language === 'KR' ? '열차에서 내린 후 플랫폼 내 엘리베이터를 타고 대합실로 이동합니다.' : 'Take the platform elevator up to the concourse.'
        },
        {
          step: 2,
          title: language === 'KR' ? '광폭 개찰구 통과' : 'Wide Gate Passage',
          location: language === 'KR' ? '대합실 개찰구' : 'Concourse Gate',
          desc: language === 'KR' ? '휠체어와 유모차가 원활하게 통과할 수 있는 와이드 게이트를 통과합니다.' : 'Pass through the wide turnstile gate.'
        },
        {
          step: 3,
          title: language === 'KR' ? '추천 출구 엘리베이터 탑승' : 'Exit Elevator Ascent',
          location: language === 'KR' ? (station.recommendedExits || '지정 출구') : 'Recommended Exit',
          desc: language === 'KR' ? (station.elevatorLocationDesc || '지상 연결 엘리베이터를 타고 도로변으로 이동합니다.') : 'Take the street elevator to reach sidewalk level.'
        }
      ];

  const travelerTips = curation
    ? (language === 'KR' ? curation.travelerTipsKo : curation.travelerTipsEn)
    : {
        luggage: language === 'KR' ? `물품보관함은 ${station.toiletLocation || '대합실 중앙'} 인근에 위치하고 있습니다.` : 'Luggage lockers are available around the main concourse area.',
        stroller: language === 'KR' ? `${station.recommendedExits || '추천 출구'} 엘리베이터를 이용하시면 턱 없이 지상 보도로 진입할 수 있습니다.` : 'Use the recommended exit elevator for smooth stroller access.',
        wheelchair: language === 'KR' ? '승강장과 열차 사이 틈새를 주의하시고, 광폭 개찰구를 이용해 주세요.' : 'Mind the platform gap and use the designated wide turnstile gate.',
        mobility: language === 'KR' ? (station.precautions || '역 내부 이동 시 안전 손잡이를 잡고 이동하시기 바랍니다.') : (station.precautionsEn || 'Please hold handrails and take elevators for a comfortable walk.')
      };

  const nearbyCurations = curation
    ? (language === 'KR' ? curation.nearbyPlacesWithContextKo : curation.nearbyPlacesWithContextEn)
    : (nearbyPlaces.map(p => ({
        name: p.name,
        tag: language === 'KR' ? '역 인근 추천 명소' : 'Nearby Attraction',
        whyVisit: p.desc,
        exitInfo: p.exits && p.exits.length > 0 ? `${p.exits.map(e => `${e.num}번`).join(', ')} 출구` : (station.recommendedExits || '인근 출구')
      })));

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-7 space-y-7 text-left my-6 animate-fade-in" id={`stepless-travel-guide-${station.id}`}>
      
      {/* 1. Header & Station Role Badge */}
      <div className="border-b border-slate-150 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-1 rounded-lg bg-[#004481] text-white text-xs font-black tracking-wide flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Stepless Travel Guide</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-[#004481] border border-sky-100 text-xs font-bold">
              {stationRole}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            {displayName} {language === 'KR' ? 'Stepless 여행안내' : 'Traveler Guide'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            {lineLabels} — {language === 'KR' ? '여행자 관점의 맞춤 출구·무단차 이동 큐레이션' : 'Curated exit pathways and step-free travel logistics'}
          </p>
        </div>

        {/* Action Link: Naver Map & View Standard Info */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <a
            href={`https://map.naver.com/v5/search/${encodeURIComponent(station.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200/70 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{language === 'KR' ? '네이버지도 길찾기' : 'Naver Map'}</span>
            <ExternalLink className="w-3 h-3 text-blue-400" />
          </a>

          {onSwitchToStandard && (
            <button
              type="button"
              onClick={onSwitchToStandard}
              className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'KR' ? '기본 역정보 보기' : 'Standard Info'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ① 이 역을 처음 이용한다면 (First Time at This Station) */}
      <section className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-2">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{language === 'KR' ? '💡 이 역을 처음 이용한다면' : '💡 First Time at This Station?'}</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          {introText}
        </p>
      </section>

      {/* ② 어떤 출구를 이용하면 좋을까요? (Exit Recommendations for Travelers) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{language === 'KR' ? '🚪 어떤 출구를 이용하면 좋을까요?' : '🚪 Recommended Accessible Exits'}</span>
          </h3>
          <span className="text-2xs sm:text-xs text-slate-400 font-medium">
            {language === 'KR' ? '공식 엘리베이터 데이터 기반' : 'Official Elevator Data'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {recommendedExits.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between gap-2.5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-blue-50 text-[#004481] border border-blue-200/60 rounded-lg text-xs font-black">
                    📍 {item.exitNum}
                  </span>
                  <div className="flex items-center gap-1.5 text-2xs font-bold text-slate-500">
                    {item.hasElevator && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>엘리베이터</span>
                      </span>
                    )}
                    {item.hasEscalator && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                        <span>에스컬레이터</span>
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-sm font-black text-slate-900 mb-1">
                  {item.targetTitle}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {item.reason}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-2xs font-bold text-slate-400">
                <span>Stepless Curation</span>
                <span className="text-emerald-700">✓ 무단차 평탄 진입</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ③ 이렇게 이동하세요 (Step-by-Step Practical Movement) */}
      <section className="space-y-3 pt-2">
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Train className="w-4 h-4 text-[#004481] shrink-0" />
          <span>{language === 'KR' ? '🚶 이렇게 이동하세요 (단계별 이동 동선)' : '🚶 Step-by-Step Navigation'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {movementSteps.map((stepItem, idx) => (
            <div 
              key={idx}
              className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 font-black text-[#004481] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#004481] text-white flex items-center justify-center text-2xs font-black shrink-0">
                    {stepItem.step}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">{stepItem.title}</span>
                </div>
                <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  📍 {stepItem.location}
                </span>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {stepItem.desc}
                </p>
              </div>

              {idx < movementSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                  <span className="p-1 rounded-full bg-white border border-slate-200 shadow-2xs inline-block text-slate-400">
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ④ 여행자별 맞춤 이용 팁 (Traveler-Specific Tips) */}
      <section className="space-y-3 pt-2">
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{language === 'KR' ? '👥 여행자 유형별 이용 팁' : '👥 Tailored Tips by Traveler Profile'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* 🧳 Luggage */}
          <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs sm:text-sm">
              <Luggage className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{language === 'KR' ? '🧳 캐리어 여행자' : '🧳 Luggage Travelers'}</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              {travelerTips.luggage}
            </p>
          </div>

          {/* 👶 Stroller */}
          <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs sm:text-sm">
              <Baby className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{language === 'KR' ? '👶 유모차 이용 가족' : '👶 Stroller Families'}</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              {travelerTips.stroller}
            </p>
          </div>

          {/* ♿ Wheelchair */}
          <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200/60 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs sm:text-sm">
              <Accessibility className="w-4 h-4 text-[#004481] shrink-0" />
              <span>{language === 'KR' ? '♿ 휠체어 이용자' : '♿ Wheelchair Users'}</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              {travelerTips.wheelchair}
            </p>
          </div>

          {/* 👵 Senior / Mobility */}
          <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-200/60 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-purple-900 text-xs sm:text-sm">
              <HeartHandshake className="w-4 h-4 text-purple-600 shrink-0" />
              <span>{language === 'KR' ? '👵 보행이 불편한 여행자' : '👵 Reduced Mobility'}</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              {travelerTips.mobility}
            </p>
          </div>
        </div>
      </section>

      {/* ⑤ Stepless 확인 정보 & 검증 배지 */}
      <section className="pt-2">
        <VerificationBadge language={language} stationName={displayName} variant="compact" />
      </section>

      {/* ⑥ 이 역에서 함께 가기 좋은 곳 (Curated Nearby Attractions & Why Visit) */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{language === 'KR' ? '🌟 이 역에서 함께 가기 좋은 곳' : '🌟 Nearby Highlights with Context'}</span>
          </h3>
          <span className="text-2xs text-slate-400 font-medium">
            {language === 'KR' ? '추천 이유 및 최단 출구' : 'Curated context & optimal exits'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {nearbyCurations.slice(0, 3).map((place, idx) => (
            <div 
              key={idx}
              className="bg-sky-50/30 p-4 rounded-2xl border border-sky-100/80 space-y-1.5 flex flex-col justify-between text-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-black text-slate-900 text-xs sm:text-sm line-clamp-1">
                    {place.name}
                  </span>
                </div>
                <span className="inline-block px-2 py-0.5 bg-white text-sky-800 border border-sky-200/80 rounded-md text-2xs font-bold mb-1.5">
                  {place.tag}
                </span>
                <p className="text-slate-600 leading-relaxed font-medium line-clamp-3">
                  {place.whyVisit}
                </p>
              </div>

              <div className="pt-2 border-t border-sky-100/60 flex items-center justify-between text-2xs font-bold text-sky-900">
                <span>📍 추천 출구:</span>
                <span className="text-[#004481]">{place.exitInfo}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
