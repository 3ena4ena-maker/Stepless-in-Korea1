import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Train, ArrowRight } from 'lucide-react';
import { STATIONS } from '../data';
import { Station } from '../types';
import { Language, pickLang } from '../i18n/dictionary';
import {
  formatExitNumberI18n,
  formatLineLabelI18n,
  getLocalizedStationTitle,
  STATION_SEARCH_ALIASES,
} from '../i18n/stationTranslations';

interface StationSearchBarProps {
  language?: Language;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectStation: (stationId: string, exitNum?: string | null) => void;
  onNavigateToSearch?: (query?: string) => void;
  placeholder?: string;
  className?: string;
  dropdownPosition?: 'top' | 'bottom';
}

export function searchStations(query: string, stations: Station[]) {
  if (!query || !query.trim()) return [];
  const raw = query.trim().toLowerCase();
  
  const cleaned = raw.replace(/^(estación\s+de\s+|estacion\s+de\s+|station\s+|gare\s+de\s+)/i, '').replace(/(역|station|駅|站)$/i, '').trim();

  // Extract exit number if present (e.g., "7번", "7번 출구", "7番", "7號", "7号", "Salida 7", "Sortie 7", "7")
  const exitMatch = raw.match(/(?:salida|sortie|exit)?\s*(\d+)\s*(번|출구|exit|番|號|号|出口)?/i);
  const exitNumStr = exitMatch ? exitMatch[1] : null;

  const results: { station: Station; matchedExit?: string }[] = [];

  for (const st of stations) {
    const nameClean = st.name.replace(/역$/, '').toLowerCase();
    const aliases = STATION_SEARCH_ALIASES[st.id] || [];
    const isAliasMatch = aliases.some(a => a.toLowerCase().includes(cleaned) || cleaned.includes(a.toLowerCase()));

    const isExactName = st.name.toLowerCase() === raw || nameClean === cleaned || aliases.some(a => a.toLowerCase() === raw || a.toLowerCase() === cleaned);
    const isPartialName = 
      isAliasMatch ||
      st.name.toLowerCase().includes(raw) || 
      nameClean.includes(cleaned) ||
      st.englishName.toLowerCase().includes(raw) ||
      st.id.toLowerCase() === raw ||
      st.id.toLowerCase().includes(raw);

    const isLineMatch = st.lines.some(l => l.toLowerCase().includes(raw) || `${l}호선`.includes(raw) || `${l}号線`.includes(raw) || `${l}號線`.includes(raw) || `${l}号线`.includes(raw) || (l === '김해' && ('김해경전철'.includes(raw) || '軽電鉄'.includes(raw) || '輕軌'.includes(raw) || '轻轨'.includes(raw))) || (l === '동해' && ('동해선'.includes(raw) || '東海線'.includes(raw) || '东海线'.includes(raw))));
    const isLandmarkMatch = raw.length >= 2 && st.exits.some(e => (e.directionDesc && e.directionDesc.toLowerCase().includes(raw)) || (e.tip && e.tip.toLowerCase().includes(raw)));

    let matchedExit: string | undefined = undefined;
    if (exitNumStr) {
      const foundExit = st.exits.find(e => e.number.includes(exitNumStr) || e.number === `${exitNumStr}번 출구`);
      if (foundExit) {
        matchedExit = foundExit.number;
      }
    }

    if (isExactName || isPartialName || isLineMatch || isLandmarkMatch || matchedExit) {
      results.push({
        station: st,
        matchedExit
      });
    }
  }

  results.sort((a, b) => {
    const aClean = a.station.name.replace(/역$/, '').toLowerCase();
    const bClean = b.station.name.replace(/역$/, '').toLowerCase();
    const aAliases = STATION_SEARCH_ALIASES[a.station.id] || [];
    const bAliases = STATION_SEARCH_ALIASES[b.station.id] || [];
    const aExact = a.station.name.toLowerCase() === raw || aClean === cleaned || aAliases.some(al => al.toLowerCase() === cleaned);
    const bExact = b.station.name.toLowerCase() === raw || bClean === cleaned || bAliases.some(al => al.toLowerCase() === cleaned);
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    return 0;
  });

  return results;
}

export default function StationSearchBar({
  language = 'KR',
  searchQuery,
  setSearchQuery,
  onSelectStation,
  onNavigateToSearch,
  placeholder,
  className = '',
  dropdownPosition = 'bottom'
}: StationSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const matchedResults = searchStations(searchQuery, STATIONS);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExecuteSearch = (customQuery?: string) => {
    const q = (customQuery !== undefined ? customQuery : searchQuery).trim();
    if (!q) return;

    const matches = searchStations(q, STATIONS);
    if (matches.length > 0) {
      const topMatch = matches[0];
      onSelectStation(topMatch.station.id, topMatch.matchedExit || null);
      setIsOpen(false);
      
      setTimeout(() => {
        const targetEl = document.getElementById('search-selected-station-details') || document.getElementById('search-tab-map-container');
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      if (onNavigateToSearch) {
        onNavigateToSearch(q);
      }
      setIsOpen(false);
    }
  };

  const handleSelectResult = (stationId: string, matchedExit?: string, stationName?: string) => {
    if (stationName) {
      setSearchQuery(stationName);
    }
    onSelectStation(stationId, matchedExit || null);
    setIsOpen(false);

    setTimeout(() => {
      const targetEl = document.getElementById('search-selected-station-details') || document.getElementById('search-tab-map-container');
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-blue-800" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (searchQuery.trim().length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleExecuteSearch();
            } else if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          placeholder={
            placeholder ||
            pickLang(language, {
              KR: '역 이름이나 출구를 검색해보세요... (예: 서면역, 해운대, 7번)',
              EN: 'Search station or exit... (e.g., Seomyeon, Haeundae, 7)',
              JA: '駅名や出口番号を検索（例：西面、海雲台、釜山駅、7番）',
              ZH_TW: '輸入地鐵站名或出口搜尋（例：西面、海雲台、釜山站、7號）',
              ZH_CN: '输入地铁站名或出口搜索（例：西面、海云台、釜山站、7号）',
              ES: 'Busca estación o salida... (ej.: Seomyeon, Haeundae, Salida 7)',
              FR: 'Rechercher une station ou sortie... (ex. : Seomyeon, Haeundae, Sortie 7)',
            })
          }
          className="w-full pl-11 pr-24 py-3 sm:py-3.5 border border-slate-300 rounded-2xl bg-white text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#003466] focus:border-[#003466] text-sm font-medium transition-all"
        />
        <div className="absolute inset-y-0 right-1.5 flex items-center gap-1.5">
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setIsOpen(false);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
              title={pickLang(language, { KR: '초기화', EN: 'Clear', JA: 'クリア', ZH_TW: '清除', ZH_CN: '清除', ES: 'Borrar', FR: 'Effacer' })}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => handleExecuteSearch()}
            className="px-4 py-2 bg-[#8EA85E] hover:bg-[#7b944f] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1"
          >
            <span>{pickLang(language, { KR: '검색', EN: 'Search', JA: '検索', ZH_TW: '搜尋', ZH_CN: '搜索', ES: 'Buscar', FR: 'Rechercher' })}</span>
          </button>
        </div>
      </div>

      {/* Auto-complete Dropdown Popup */}
      {isOpen && searchQuery.trim().length > 0 && (
        <div className={`absolute left-0 right-0 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-fade-in max-h-80 overflow-y-auto ${
          dropdownPosition === 'top' ? 'bottom-full mb-2.5' : 'top-full mt-2'
        }`}>
          {matchedResults.length > 0 ? (
            <div className="p-2 divide-y divide-slate-100">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>
                  {pickLang(language, {
                    KR: `검색된 지하철역 (${matchedResults.length}개)`,
                    EN: `Matched Stations (${matchedResults.length})`,
                    JA: `一致した地下鉄駅 (${matchedResults.length}駅)`,
                    ZH_TW: `找到的地鐵站 (${matchedResults.length}站)`,
                    ZH_CN: `匹配的地铁站 (${matchedResults.length}站)`,
                    ES: `Estaciones encontradas (${matchedResults.length})`,
                    FR: `Stations trouvées (${matchedResults.length})`,
                  })}
                </span>
                <span className="text-emerald-600 font-semibold">
                  {pickLang(language, {
                    KR: '선택 시 해당 역 이동 경로 바로 안내',
                    EN: 'Click to jump to details',
                    JA: 'タップして駅のバリアフリー詳細へ',
                    ZH_TW: '點擊立即查看無障礙出口詳情',
                    ZH_CN: '点击立即查看无障碍出口详情',
                    ES: 'Toca para ver detalles de accesibilidad',
                    FR: 'Cliquez pour voir les détails d’accessibilité',
                  })}
                </span>
              </div>
              {matchedResults.map(({ station, matchedExit }) => {
                const displayStName = getLocalizedStationTitle(station, language, false);
                return (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() => handleSelectResult(station.id, matchedExit, displayStName)}
                    className="w-full px-3.5 py-3 text-left hover:bg-blue-50/70 transition-colors flex items-center justify-between group cursor-pointer rounded-xl my-0.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-[#8EA85E]/15 text-[#8EA85E] group-hover:bg-[#8EA85E] group-hover:text-white transition-colors">
                        <Train className="w-4 h-4 shrink-0" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-800 group-hover:text-[#8EA85E] text-sm font-heading">
                            {displayStName}
                          </span>
                          <div className="flex items-center gap-1">
                            {station.lines.map((part, idx) => {
                              const lineText = formatLineLabelI18n(part, language);
                              let badgeBg = 'bg-slate-100 text-slate-700';
                              if (part.includes('1')) badgeBg = 'bg-orange-100 text-orange-800 border-orange-200';
                              else if (part.includes('2')) badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                              else if (part.includes('3')) badgeBg = 'bg-amber-100 text-amber-800 border-amber-200';
                              else if (part.includes('동해')) badgeBg = 'bg-sky-100 text-sky-800 border-sky-200';
                              else if (part.includes('김해')) badgeBg = 'bg-purple-100 text-purple-800 border-purple-200';
                              return (
                                <span key={idx} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${badgeBg}`}>
                                  {lineText}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>{station.englishName}</span>
                          <span>•</span>
                          <span>
                            {pickLang(language, {
                              KR: `무장애 설비 ${station.exits.length}곳`,
                              EN: `${station.exits.length} Accessible Exits`,
                              JA: `バリアフリー設備 ${station.exits.length}箇所`,
                              ZH_TW: `無障礙設施 ${station.exits.length}處`,
                              ZH_CN: `无障碍设施 ${station.exits.length}处`,
                              ES: `${station.exits.length} salidas accesibles`,
                              FR: `${station.exits.length} sorties accessibles`,
                            })}
                          </span>
                          {matchedExit && (
                            <span className="bg-blue-100 text-blue-800 font-bold text-[10px] px-1.5 py-0.5 rounded-md">
                              📍 {formatExitNumberI18n(matchedExit, language)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-slate-400 group-hover:text-[#004481] group-hover:translate-x-0.5 transition-all flex items-center gap-1 text-xs font-bold">
                      <span className="hidden sm:inline">
                        {pickLang(language, { KR: '이동', EN: 'Go', JA: '詳細', ZH_TW: '查看', ZH_CN: '查看', ES: 'Ver', FR: 'Voir' })}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500">
              <p className="text-sm font-bold text-slate-700">
                {pickLang(language, {
                  KR: `'${searchQuery}' 검색 결과가 없습니다.`,
                  EN: `No stations found for '${searchQuery}'.`,
                  JA: `「${searchQuery}」に一致する駅が見つかりません。`,
                  ZH_TW: `找不到與「${searchQuery}」相符的車站。`,
                  ZH_CN: `未找到与“${searchQuery}”匹配的车站。`,
                  ES: `No se encontraron estaciones para '${searchQuery}'.`,
                  FR: `Aucune station trouvée pour « ${searchQuery} ».`,
                })}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {pickLang(language, {
                  KR: '서면역, 해운대역, 부산역, 전포역, 벡스코역 등 부산 주요 역명을 입력해보세요.',
                  EN: 'Try typing Seomyeon, Haeundae, Busan, Jeonpo, Bexco, etc.',
                  JA: '西面、海雲台、釜山駅、チャガルチ、センタムシティなどを入力してみてください。',
                  ZH_TW: '請試著輸入西面、海雲台、釜山站、札嘎其、Centum City 等站名。',
                  ZH_CN: '请尝试输入西面、海云台、釜山站、札嘎其、Centum City 等站名。',
                  ES: 'Prueba escribiendo Seomyeon, Haeundae, Busan, Jagalchi, Centum City, etc.',
                  FR: 'Essayez de saisir Seomyeon, Haeundae, Busan, Jagalchi, Centum City, etc.',
                })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
