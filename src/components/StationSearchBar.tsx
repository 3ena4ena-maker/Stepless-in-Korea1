import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Train, ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';
import { STATIONS } from '../data';
import { Station } from '../types';

interface StationSearchBarProps {
  language?: 'KR' | 'EN';
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectStation: (stationId: string, exitNum?: string | null) => void;
  onNavigateToSearch?: (query?: string) => void;
  placeholder?: string;
  className?: string;
}

export function searchStations(query: string, stations: Station[]) {
  if (!query || !query.trim()) return [];
  const raw = query.trim().toLowerCase();
  
  // Clean query for Korean matching: e.g. "서면역" -> "서면", "부산역" -> "부산"
  const cleaned = raw.replace(/(역|station)$/i, '').trim();

  // Extract exit number if present (e.g., "7번", "7번 출구", "7")
  const exitMatch = raw.match(/(\d+)\s*(번|출구|exit)?/i);
  const exitNumStr = exitMatch ? exitMatch[1] : null;

  const results: { station: Station; matchedExit?: string }[] = [];

  for (const st of stations) {
    const nameClean = st.name.replace(/역$/, '').toLowerCase();
    
    // Check if name matches
    const isExactName = st.name.toLowerCase() === raw || nameClean === cleaned;
    const isPartialName = 
      st.name.toLowerCase().includes(raw) || 
      nameClean.includes(cleaned) ||
      st.englishName.toLowerCase().includes(raw) ||
      st.id.toLowerCase() === raw ||
      st.id.toLowerCase().includes(raw);

    const isLineMatch = st.lines.some(l => l.toLowerCase().includes(raw) || `${l}호선`.includes(raw));

    // Check matching exit
    let matchedExit: string | undefined = undefined;
    if (exitNumStr) {
      const foundExit = st.exits.find(e => e.number.includes(exitNumStr) || e.number === `${exitNumStr}번 출구`);
      if (foundExit) {
        matchedExit = foundExit.number;
      }
    }

    if (isExactName || isPartialName || isLineMatch || matchedExit) {
      results.push({
        station: st,
        matchedExit
      });
    }
  }

  // Sort exact matches to the top
  results.sort((a, b) => {
    const aClean = a.station.name.replace(/역$/, '').toLowerCase();
    const bClean = b.station.name.replace(/역$/, '').toLowerCase();
    const aExact = a.station.name.toLowerCase() === raw || aClean === cleaned;
    const bExact = b.station.name.toLowerCase() === raw || bClean === cleaned;
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
  className = ''
}: StationSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const matchedResults = searchStations(searchQuery, STATIONS);

  // Close dropdown on outside click
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
      
      // Scroll smoothly to target station view
      setTimeout(() => {
        const targetEl = document.getElementById('search-selected-station-details') || document.getElementById('search-tab-map-container');
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Fallback to navigate to search tab
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
            (language === 'KR'
              ? '역 이름이나 출구를 검색해보세요... (예: 서면역, 해운대, 7번)'
              : 'Search station or exit... (e.g., Seomyeon, Haeundae, 7)')
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
              title={language === 'KR' ? '초기화' : 'Clear'}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => handleExecuteSearch()}
            className="px-4 py-2 bg-[#004481] hover:bg-blue-900 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1"
          >
            <span>{language === 'KR' ? '검색' : 'Search'}</span>
          </button>
        </div>
      </div>

      {/* Auto-complete Dropdown Popup */}
      {isOpen && searchQuery.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-fade-in max-h-80 overflow-y-auto">
          {matchedResults.length > 0 ? (
            <div className="p-2 divide-y divide-slate-100">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>{language === 'KR' ? `검색된 지하철역 (${matchedResults.length}개)` : `Matched Stations (${matchedResults.length})`}</span>
                <span className="text-emerald-600 font-semibold">{language === 'KR' ? '선택 시 해당 역 이동 경로 바로 안내' : 'Click to jump to details'}</span>
              </div>
              {matchedResults.map(({ station, matchedExit }) => (
                <button
                  key={station.id}
                  type="button"
                  onClick={() => handleSelectResult(station.id, matchedExit, station.name)}
                  className="w-full px-3.5 py-3 text-left hover:bg-blue-50/70 transition-colors flex items-center justify-between group cursor-pointer rounded-xl my-0.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-100/70 text-[#004481] group-hover:bg-[#004481] group-hover:text-white transition-colors">
                      <Train className="w-4 h-4 shrink-0" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 group-hover:text-[#004481] text-sm font-heading">
                          {language === 'KR' ? station.name : station.englishName}
                        </span>
                        <div className="flex items-center gap-1">
                          {station.lines.map((part, idx) => {
                            const lineText = part.endsWith('호선') || part === '동해' ? (part === '동해' ? '동해선' : part) : `${part}호선`;
                            let badgeBg = 'bg-slate-100 text-slate-700';
                            if (part.includes('1')) badgeBg = 'bg-orange-100 text-orange-800 border-orange-200';
                            else if (part.includes('2')) badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                            else if (part.includes('3')) badgeBg = 'bg-amber-100 text-amber-800 border-amber-200';
                            else if (part.includes('동해')) badgeBg = 'bg-sky-100 text-sky-800 border-sky-200';
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
                        <span>출구 {station.exits.length}개</span>
                        {matchedExit && (
                          <span className="bg-blue-100 text-blue-800 font-bold text-[10px] px-1.5 py-0.5 rounded-md">
                            📍 {matchedExit}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-400 group-hover:text-[#004481] group-hover:translate-x-0.5 transition-all flex items-center gap-1 text-xs font-bold">
                    <span className="hidden sm:inline">{language === 'KR' ? '이동' : 'Go'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500">
              <p className="text-sm font-bold text-slate-700">
                {language === 'KR' ? `'${searchQuery}' 검색 결과가 없습니다.` : `No stations found for '${searchQuery}'.`}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'KR'
                  ? '서면역, 해운대역, 부산역, 전포역, 벡스코역 등 부산 주요 역명을 입력해보세요.'
                  : 'Try typing Seomyeon, Haeundae, Busan, Jeonpo, Bexco, etc.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
