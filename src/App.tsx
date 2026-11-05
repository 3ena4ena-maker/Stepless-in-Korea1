/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Updated: 2026-08 August Busan Events & Calendar
 */

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { 
  Train,
  Bus, 
  Search, 
  MapPin, 
  Compass, 
  HelpCircle, 
  Info, 
  Heart,
  AlertTriangle, 
  Baby, 
  Luggage, 
  Check, 
  Camera, 
  Send, 
  X, 
  CheckCircle2, 
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  RefreshCw,
  Clock,
  ThumbsUp,
  Map,
  Accessibility,
  Trash2,
  Shield,
  Sparkles,
  Calendar,
  Landmark,
  UserCheck,
  ArrowRightLeft,
  ArrowLeft,
  Box,
  Layers
} from 'lucide-react';
import Header from './components/Header';
import { Language, pickLang, LANGUAGE_OPTIONS, parseLanguageFromPathname, buildLocalizedPath, getHreflangEntries } from './i18n/dictionary';
import { formatLineLabelI18n, getLocalizedStationTitle } from './i18n/stationTranslations';
import { useDomLocalizer } from './i18n/domLocalizer';
import BusanAffiliateQuickBar from './components/BusanAffiliateQuickBar';
import { HomeOverviewSection } from './components/HomeOverviewSection';
import { STATIONS, INITIAL_REPORTS } from './data';
import { Station, ExitInfo, FacilityReport, StatusType, getExitDisplayName, translateExitNumber, getTranslatedStationName } from './types';
import { translateRecommendation, navigateToSpa } from './utils';

// Robust normalization between URL slugs (e.g. 'gourmet', 'barrier-free') and CategoryType ('GOURMET', 'BARRIER_FREE')
export function normalizeCategorySlug(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const clean = raw.trim().toLowerCase().replace(/_/g, '-');
  const mapping: Record<string, string> = {
    'gourmet': 'GOURMET',
    'foodie': 'GOURMET',
    'experience': 'EXPERIENCE',
    'market': 'MARKET',
    'attraction': 'ATTRACTION',
    'attractions': 'ATTRACTION',
    'day': 'DAY',
    '1night': '1NIGHT',
    '2nights': '2NIGHTS',
    '3nights': '3NIGHTS',
    '4nights': '4NIGHTS',
    'schedule': 'DAY',
    'subway': 'SUBWAY',
    'barrier-free': 'BARRIER_FREE',
    'barrierfree': 'BARRIER_FREE',
    'my-route': 'MY_ROUTE',
    'myroute': 'MY_ROUTE',
    'history': 'HISTORY',
  };
  if (mapping[clean]) return mapping[clean];
  const upper = raw.trim().toUpperCase();
  const validList = ['DAY', '1NIGHT', '2NIGHTS', '3NIGHTS', '4NIGHTS', 'GOURMET', 'MARKET', 'SCHEDULE', 'EXPERIENCE', 'SUBWAY', 'BARRIER_FREE', 'HISTORY', 'ATTRACTION', 'MY_ROUTE'];
  if (validList.includes(upper)) return upper;
  return null;
}

export function categoryToUrlSlug(cat: string | null | undefined): string {
  if (!cat) return '';
  const map: Record<string, string> = {
    'GOURMET': 'gourmet',
    'EXPERIENCE': 'experience',
    'MARKET': 'market',
    'ATTRACTION': 'attraction',
    'DAY': 'day',
    '1NIGHT': '1night',
    '2NIGHTS': '2nights',
    '3NIGHTS': '3nights',
    '4NIGHTS': '4nights',
    'SCHEDULE': 'day',
    'SUBWAY': 'subway',
    'BARRIER_FREE': 'barrier-free',
    'MY_ROUTE': 'my-route',
  };
  return map[cat] || cat.toLowerCase().replace(/_/g, '-');
}

import StationSearchBar, { searchStations } from './components/StationSearchBar';
import { AdSenseUnit, AdEligibilityParams } from './components/AdSenseManager';
import BusanItinerariesView from './components/BusanItinerariesView';
import SiteIntroductionView from './components/SiteIntroductionView';
import SubwayStationMap from './components/SubwayStationMap';
import { StationBarrierFreeCard } from './components/StationBarrierFreeCard';

// Dynamic tab loading fallback component for code-split views
const TabLoadingFallback = ({ text = "정보를 신속하게 불러오는 중..." }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[360px] p-8 text-center space-y-3 animate-fade-in google-anno-skip" data-ad-exclude="true" data-loading-fallback="true">
    <div className="w-9 h-9 border-3 border-emerald-100 border-t-[#8EA85E] rounded-full animate-spin"></div>
    <p className="text-sm font-bold text-slate-600">{text}</p>
  </div>
);

// Custom icons based on premium vector styles for seamless accessibility display
const EscalatorIcon = ({ className = "w-5 h-5 text-slate-700 flex-shrink-0" }: { className?: string }) => (
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

const ElevatorIcon = ({ className = "w-5 h-5 text-slate-700 flex-shrink-0" }: { className?: string }) => (
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

const StairsIcon = ({ className = "w-5 h-5 text-slate-500 flex-shrink-0" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M 3.5 19.5 L 7.5 19.5 L 7.5 15.5 L 11.5 15.5 L 11.5 11.5 L 15.5 11.5 L 15.5 7.5 L 20.5 7.5" />
  </svg>
);

// Exit Display name helper is imported directly from Types.ts to ensure bilingual consistency across systems.

export interface TravelerRecommendation {
  id: string;
  author: string;
  topic: string;
  category: 'FOOD' | 'CAFE' | 'ATTRACTION' | 'TRANSIT' | 'OTHER';
  stationOrExit: string;
  content: string;
  upvotes: number;
  createdAt: string;
}

const DEFAULT_RECOMMENDATIONS: TravelerRecommendation[] = [
  {
    id: 'rec-1',
    author: 'BusanLover33',
    topic: '이재모피자 서면점 & 부산역본점',
    category: 'FOOD',
    stationOrExit: '부산역 5번출구 / 전포역 7번출구 근처',
    content: '이재모피자는 부산 로컬과 여행객 모두가 열광하는 최고의 치즈 피자 전문점입니다! 치즈 크러스트의 쫄깃함이 남달라요. 웨이팅이 기니 앱(테이블링 등)을 꼭 체크하세요.',
    upvotes: 42,
    createdAt: '2026-06-01T12:00:00Z'
  },
  {
    id: 'rec-2',
    author: 'NomadChris',
    topic: '전포 사잇길 소품샵 & 빈티지 카페 골목',
    category: 'CAFE',
    stationOrExit: '전포역 4번 및 8번출구',
    content: '전포 카페거리에서 조금만 위쪽으로 가면 나오는 사잇길에는 아기자기한 공방, 감성 넘치는 독립 서점, 개성 가득한 빈티지 편집숍들이 가득해요! 평탄하고 걸어 다니기 좋아 기분 좋게 느긋이 산책하기 최고입니다.',
    upvotes: 28,
    createdAt: '2026-06-03T15:30:00Z'
  },
  {
    id: 'rec-3',
    author: 'TransitPro',
    topic: '알뜰 부산 지하철 1일 무제한 패스',
    category: 'TRANSIT',
    stationOrExit: '모든 부산 지하철역 발권기',
    content: '하루 동안 지하철을 4회 이상 탈 계획이라면 1일권(정기승차권)을 사서 이용하는게 저렴해요! 어른 6,000원, 청소년 4,000원이고 1일권은 최초 사용 당일 부산 지하철 1 ~ 4호선에서 횟수 제한 없이 이용할 수 있어요!',
    upvotes: 35,
    createdAt: '2026-06-05T09:15:00Z'
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [visitedTabs, setVisitedTabs] = useState<Record<string, boolean>>({ home: true });

  useEffect(() => {
    setVisitedTabs(prev => ({ ...prev, [currentTab]: true }));
  }, [currentTab]);

  const [language, setLanguage] = useState<Language>(() => {
    try {
      if (typeof window !== 'undefined') {
        const { langFromUrl } = parseLanguageFromPathname(window.location.pathname, window.location.search);
        if (langFromUrl) {
          return langFromUrl;
        }
      }
    } catch {}
    return 'KR';
  });

  useEffect(() => {
    try {
      localStorage.setItem('stepless_language', language);
    } catch {}
  }, [language]);

  useDomLocalizer(language);
  const [selectedStationId, setSelectedStationId] = useState<string>('seomyeon');
  const [searchViewMode, setSearchViewMode] = useState<'INDEX' | 'DETAIL'>('INDEX');
  const [isHomeLanding, setIsHomeLanding] = useState<boolean>(true);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [activePathFilter, setActivePathFilter] = useState<'ALL' | 'ACCESSIBLE' | 'CARRY'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItineraryCategory, setSelectedItineraryCategory] = useState<string | null>(null);
  const [tipsSubPage, setTipsSubPage] = useState<'index' | 'courses' | 'transit' | 'child-free' | 'bus-qr' | 'transfer' | 'taxi' | 'schedule' | 'community' | 'exploration'>('index');
  const [explorationItemId, setExplorationItemId] = useState<string | null>(null);
  const [activeRegionPage, setActiveRegionPage] = useState<'LINE1' | 'LINE2' | null>(null);
  const [siteSubPage, setSiteSubPage] = useState<'about' | 'privacy' | 'terms' | 'contact' | 'data-source'>('about');
  const [barrierFreeCourseId, setBarrierFreeCourseId] = useState<string | null>(null);
  const [barrierFreePlaceId, setBarrierFreePlaceId] = useState<string | null>(null);
  
  // Geolocation states
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [geoResult, setGeoResult] = useState<{
    stationName: string;
    distance: number;
    exitNumber: string;
    details: string;
    lat: number;
    lng: number;
  } | null>(null);

  // Live reports state
  const [reports, setReports] = useState<FacilityReport[]>(INITIAL_REPORTS);
  
  // Create Report states
  const [reportStation, setReportStation] = useState<string>('seomyeon');
  const [reportExit, setReportExit] = useState<string>('7번 출구');
  const [reportFacility, setReportFacility] = useState<'ELEVATOR' | 'ESCALATOR' | 'RAMP' | 'TOILET' | 'OTHER'>('ELEVATOR');
  const [reportIssue, setReportIssue] = useState<'BROKEN' | 'MAINTENANCE' | 'CONSTRUCTION' | 'OTHER'>('BROKEN');
  const [reportText, setReportText] = useState<string>('');
  const [reportImage, setReportImage] = useState<string | null>(null);
  const [submittingReport, setSubmittingReport] = useState<boolean>(false);
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);

  // Active expanded exit details
  const [expandedExitNum, setExpandedExitNum] = useState<string | null>(null);


  // Traveler Recommendations states
  const [recommendations, setRecommendations] = useState<TravelerRecommendation[]>(() => {
    const saved = localStorage.getItem('busan_traveler_recs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved recommendations:", e);
      }
    }
    return DEFAULT_RECOMMENDATIONS;
  });

  // Synchronize traveler recommendations from backend on system start to ensure everyone shares the custom tips
  useEffect(() => {
    fetch("/api/recommendations")
      .then(res => {
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          return res.json();
        }
        throw new Error("API response is not JSON or server is unverified");
      })
      .then(data => {
        if (Array.isArray(data)) {
          setRecommendations(data);
          localStorage.setItem('busan_traveler_recs', JSON.stringify(data));
        }
      })
      .catch(err => {
        // Quiet fallback to local storage / default state if backend route returns HTML
        console.warn("Backend recommendations API unavailable, using local cache/defaults:", err.message);
      });
  }, []);

  const [newRecAuthor, setNewRecAuthor] = useState('');
  const [newRecTopic, setNewRecTopic] = useState('');
  const [newRecCategory, setNewRecCategory] = useState<'FOOD' | 'CAFE' | 'ATTRACTION' | 'TRANSIT' | 'OTHER'>('FOOD');
  const [newRecStation, setNewRecStation] = useState('');
  const [newRecContent, setNewRecContent] = useState('');
  // Auto remove initial HTML loading screen on React mount
  useEffect(() => {
    try {
      const loader = document.getElementById('app-loading-screen');
      if (loader) {
        loader.style.display = 'none';
        loader.remove();
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const isInitialRoutingCompleteRef = useRef<boolean>(false);

  const [hasUpvoted, setHasUpvoted] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('busan_traveler_upvotes');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // User's own written recommendation IDs
  const [myRecIds, setMyRecIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('busan_my_rec_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Operator (Admin) Mode states
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('isAdmin') === 'true' || 
               localStorage.getItem('isAdminMode') === 'true' ||
               sessionStorage.getItem('isAdmin') === 'true' ||
               sessionStorage.getItem('isAdminMode') === 'true';
      }
    } catch {}
    return false;
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [adminError, setAdminError] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Keep window global in sync for emergency access and map handlers
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).isAdmin = isAdminMode;
      (window as any).isAdminMode = isAdminMode;
    }
  }, [isAdminMode]);

  const toggleAdminMode = () => {
    setIsAdminMode(prev => {
      const next = !prev;
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('isAdmin', String(next));
          localStorage.setItem('isAdminMode', String(next));
          sessionStorage.setItem('isAdmin', String(next));
          sessionStorage.setItem('isAdminMode', String(next));
          (window as any).isAdmin = next;
          (window as any).isAdminMode = next;
        }
      } catch (e) {
        // ignore storage quota errors
      }
      const msg = next 
        ? (language === 'KR' ? '관리자/좌표 측정 모드가 활성화되었습니다' : 'Admin / Coordinate mode activated')
        : (language === 'KR' ? '관리자/좌표 측정 모드가 비활성화되었습니다' : 'Admin / Coordinate mode deactivated');
      setToastMessage(msg);
      setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return next;
    });
  };

  // Delete confirmation state to avoid window.confirm (iframe safety)
  const [deleteConfId, setDeleteConfId] = useState<string | null>(null);

  // Category filter state for traveler recommendations board
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Busan Travel Itinerary Curation States
  const [activeItineraryCategory, setActiveItineraryCategory] = useState<'ALL' | 'TRANSIT' | 'LINE1' | 'LINE2'>('ALL');
  const [expandedItineraries, setExpandedItineraries] = useState<Record<string, boolean>>({
    'transit-subway': true, // Auto-expand first item for instant engagement
  });

  const toggleItinerary = (id: string) => {
    setExpandedItineraries(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handling Path-based Client-side routing on mount and popstate
  useEffect(() => {
    const handleUrlRouting = () => {
      let pathname = window.location.pathname;
      
      // Parse SPA redirect query parameter from public/404.html if redirected by GitHub Pages
      const searchParams = new URLSearchParams(window.location.search);
      const redirectedPath = searchParams.get('p');
      if (redirectedPath) {
        pathname = redirectedPath;
        const cleanSearch = searchParams.get('q');
        const newUrl = redirectedPath + (cleanSearch ? '?' + cleanSearch : '') + window.location.hash;
        window.history.replaceState(null, '', newUrl);
      }

      const { langFromUrl, cleanPathname } = parseLanguageFromPathname(pathname, window.location.search);
      if (langFromUrl) {
        setLanguage(langFromUrl);
      } else {
        setLanguage('KR');
      }

      const parts = cleanPathname.split('/');
      
      // Look for shared route data or /my-route
      if (searchParams.has('r') || searchParams.has('route') || searchParams.has('route_data') || searchParams.has('shared_route') || parts[1] === 'my-route') {
        setSelectedItineraryCategory('MY_ROUTE');
        setCurrentTab('tips');
        setTipsSubPage('courses');
        setIsHomeLanding(false);
        return;
      }

      // Look for /itinerary-[category]
      if (parts[1] && parts[1].startsWith('itinerary-')) {
        const rawSuffix = parts[1].replace('itinerary-', '');
        const matchedCategory = normalizeCategorySlug(rawSuffix);
        if (matchedCategory) {
          setSelectedItineraryCategory(matchedCategory as any);
          setCurrentTab('tips');
          setTipsSubPage('courses');
          if (parts[2] && ['line1', 'line2', 'east', 'west', 'south', 'north'].includes(parts[2].toLowerCase())) {
            setActiveRegionPage(parts[2].toUpperCase() as any);
          } else {
            setActiveRegionPage(null);
          }
          setIsHomeLanding(false);
        } else {
          setCurrentTab('tips');
          setSelectedItineraryCategory(null);
          setTipsSubPage('index');
          setActiveRegionPage(null);
        }
      } else if (parts[1] && parts[1].startsWith('tips-')) {
        setCurrentTab('tips');
        setSelectedItineraryCategory(null);
        const sub = parts[1].replace('tips-', '');
        if (sub === 'courses' || sub === 'itinerary') {
          setTipsSubPage('courses');
          if (parts[2] && ['line1', 'line2', 'east', 'west', 'south', 'north'].includes(parts[2].toLowerCase())) {
            setActiveRegionPage(parts[2].toUpperCase() as any);
          } else {
            setActiveRegionPage(null);
          }
        } else if (sub === 'transit') {
          setTipsSubPage('transit');
          setActiveRegionPage(null);
        } else if (sub === 'child-free') {
          setTipsSubPage('child-free');
          setActiveRegionPage(null);
        } else if (sub === 'bus-qr' || sub === 'qr-pay' || sub === 'qr') {
          setTipsSubPage('bus-qr');
          setActiveRegionPage(null);
        } else if (sub === 'exploration' || sub === 'life-tips' || sub === 'hot-issues') {
          setTipsSubPage('exploration');
          setActiveRegionPage(null);
          if (parts[2]) {
            setExplorationItemId(parts[2].toLowerCase());
          } else {
            setExplorationItemId(null);
          }
        } else if (sub === 'transfer') {
          setTipsSubPage('transit');
          setActiveRegionPage(null);
        } else {
          setTipsSubPage('index');
          setActiveRegionPage(null);
        }
        setIsHomeLanding(false);
      } else if (parts[1] === 'barrier-free' || parts[1] === 'tourapi') {
        setCurrentTab('tourapi');
        setSelectedItineraryCategory('BARRIER_FREE');
        setIsHomeLanding(false);
        const searchParams = new URLSearchParams(window.location.search);
        const queryId = searchParams.get('id') || searchParams.get('contentId');
        if (queryId) {
          setBarrierFreePlaceId(queryId);
          setBarrierFreeCourseId(null);
        } else if (parts[2] === 'detail') {
          const detailId = searchParams.get('id') || searchParams.get('contentId') || parts[3];
          setBarrierFreePlaceId(detailId || null);
          setBarrierFreeCourseId(null);
        } else if (parts[2] === 'course' && parts[3]) {
          setBarrierFreeCourseId(parts[3]);
          setBarrierFreePlaceId(null);
        } else if (parts[2] === 'place' && parts[3]) {
          setBarrierFreePlaceId(parts[3]);
          setBarrierFreeCourseId(null);
        } else {
          setBarrierFreeCourseId(null);
          setBarrierFreePlaceId(null);
        }
      } else if (parts[1] === 'place' && parts[2]) {
        setCurrentTab('tourapi');
        setSelectedItineraryCategory('BARRIER_FREE');
        setIsHomeLanding(false);
        setBarrierFreePlaceId(parts[2]);
        setBarrierFreeCourseId(null);
      } else if (parts[1] === 'station' && parts[2]) {
        const stationId = parts[2].toLowerCase();
        const exists = STATIONS.some(s => s.id === stationId);
        if (exists) {
          setSelectedStationId(stationId);
          setSearchViewMode('DETAIL');
          setIsHomeLanding(false);
          setCurrentTab('search');
          setBarrierFreePlaceId(null);
          setBarrierFreeCourseId(null);
        }
      } else if (['home', 'search', 'schedule', 'tips', 'about', 'privacy', 'terms', 'contact', 'data-source', 'transit', 'courses', 'itineraries', 'exploration'].includes(parts[1])) {
        setBarrierFreePlaceId(null);
        setBarrierFreeCourseId(null);
        if (parts[1] === 'privacy') {
          setCurrentTab('about');
          setSiteSubPage('privacy');
          setIsHomeLanding(false);
        } else if (parts[1] === 'terms') {
          setCurrentTab('about');
          setSiteSubPage('terms');
          setIsHomeLanding(false);
        } else if (parts[1] === 'contact') {
          setCurrentTab('about');
          setSiteSubPage('contact');
          setIsHomeLanding(false);
        } else if (parts[1] === 'data-source' || parts[1] === 'data') {
          setCurrentTab('about');
          setSiteSubPage('data-source');
          setIsHomeLanding(false);
        } else if (parts[1] === 'about') {
          setCurrentTab('about');
          setIsHomeLanding(false);
          const sub = parts[2] ? parts[2].toLowerCase() : '';
          if (sub === 'privacy') {
            setSiteSubPage('privacy');
          } else if (sub === 'terms') {
            setSiteSubPage('terms');
          } else if (sub === 'contact') {
            setSiteSubPage('contact');
          } else if (sub === 'data-source' || sub === 'data') {
            setSiteSubPage('data-source');
          } else {
            setSiteSubPage('about');
          }
        } else if (parts[1] === 'transit') {
          setCurrentTab('transit');
          setTipsSubPage('transit');
          setIsHomeLanding(false);
        } else if (parts[1] === 'courses' || parts[1] === 'itineraries') {
          setCurrentTab('courses');
          setTipsSubPage('courses');
          setIsHomeLanding(false);
        } else if (parts[1] === 'exploration') {
          setCurrentTab('exploration');
          setTipsSubPage('exploration');
          setIsHomeLanding(false);
          if (parts[2]) {
            setExplorationItemId(parts[2].toLowerCase());
          } else {
            setExplorationItemId(null);
          }
        } else if (parts[1] === 'schedule') {
          setCurrentTab('schedule');
          setTipsSubPage('schedule');
          setSelectedItineraryCategory(null);
          setIsHomeLanding(false);
        } else {
          setCurrentTab(parts[1]);
          if (parts[1] === 'home') {
            setIsHomeLanding(true);
            setSelectedStationId('seomyeon');
          } else {
            setIsHomeLanding(false);
            if (parts[1] === 'search') {
              if (parts[2]) {
                const stationId = parts[2].toLowerCase();
                const exists = STATIONS.some(s => s.id === stationId);
                if (exists) {
                  setSelectedStationId(stationId);
                  setSearchViewMode('DETAIL');
                } else {
                  setSearchViewMode('INDEX');
                }
              } else {
                setSearchViewMode('INDEX');
              }
            } else if (parts[1] === 'tips') {
              if (parts[2] === 'courses' || parts[2] === 'itinerary') {
                setTipsSubPage('courses');
                if (parts[3] === 'subway' && parts[4] && ['line1', 'line2', 'east', 'west', 'south', 'north'].includes(parts[4].toLowerCase())) {
                  setSelectedItineraryCategory('SUBWAY');
                  setActiveRegionPage(parts[4].toUpperCase() as any);
                } else if (parts[3]) {
                  const matchedCat = normalizeCategorySlug(parts[3]);
                  if (matchedCat) {
                    setSelectedItineraryCategory(matchedCat as any);
                    setActiveRegionPage(null);
                  } else if (['line1', 'line2', 'east', 'west', 'south', 'north'].includes(parts[3].toLowerCase())) {
                    setSelectedItineraryCategory(null);
                    setActiveRegionPage(parts[3].toUpperCase() as any);
                  } else {
                    setSelectedItineraryCategory(null);
                    setActiveRegionPage(null);
                  }
                } else {
                  setSelectedItineraryCategory(null);
                  setActiveRegionPage(null);
                }
              } else if (parts[2]) {
                const matchedCat = normalizeCategorySlug(parts[2]);
                if (matchedCat) {
                  setSelectedItineraryCategory(matchedCat as any);
                  setTipsSubPage('courses');
                  setActiveRegionPage(null);
                } else if (parts[2] === 'transit' || parts[2] === 'transfer') {
                  setSelectedItineraryCategory(null);
                  setTipsSubPage('transit');
                  setActiveRegionPage(null);
                } else if (parts[2] === 'barrier-free' || parts[2] === 'tourapi') {
                  setSelectedItineraryCategory('BARRIER_FREE');
                  setActiveRegionPage(null);
                  if (parts[3] === 'course' && parts[4]) {
                    setBarrierFreeCourseId(parts[4]);
                    setBarrierFreePlaceId(null);
                  } else if (parts[3] === 'place' && parts[4]) {
                    setBarrierFreePlaceId(parts[4]);
                    setBarrierFreeCourseId(null);
                  } else {
                    setBarrierFreeCourseId(null);
                    setBarrierFreePlaceId(null);
                  }
                } else if (parts[2] === 'child-free') {
                  setSelectedItineraryCategory(null);
                  setTipsSubPage('child-free');
                  setActiveRegionPage(null);
                } else if (parts[2] === 'bus-qr' || parts[2] === 'qr-pay' || parts[2] === 'qr') {
                  setSelectedItineraryCategory(null);
                  setTipsSubPage('bus-qr');
                  setActiveRegionPage(null);
                } else if (parts[2] === 'taxi') {
                  setSelectedItineraryCategory(null);
                  setTipsSubPage('taxi');
                  setActiveRegionPage(null);
                } else if (parts[2] === 'exploration' || parts[2] === 'life-tips' || parts[2] === 'hot-issues') {
                  setSelectedItineraryCategory(null);
                  setTipsSubPage('exploration');
                  setActiveRegionPage(null);
                  if (parts[3]) {
                    setExplorationItemId(parts[3].toLowerCase());
                  } else {
                    setExplorationItemId(null);
                  }
                } else if (['bujeon-masan', 'opera-house', 'luggage', 'rental', 'korean-cheat-codes', 'metro-reentry'].includes(parts[2].toLowerCase())) {
                  setSelectedItineraryCategory(null);
                  setTipsSubPage('exploration');
                  setActiveRegionPage(null);
                  setExplorationItemId(parts[2].toLowerCase());
                } else if (['line1', 'line2', 'east', 'west', 'south', 'north'].includes(parts[2].toLowerCase())) {
                  setSelectedItineraryCategory(null);
                  setTipsSubPage('courses');
                  setActiveRegionPage(parts[2].toUpperCase() as any);
                } else {
                  setSelectedItineraryCategory(null);
                  setTipsSubPage('index');
                  setActiveRegionPage(null);
                }
              } else {
                setSelectedItineraryCategory(null);
                setTipsSubPage('index');
                setActiveRegionPage(null);
              }
            }
          }
        }
      } else if (parts[1]) {
        const stationId = parts[1].toLowerCase();
        const exists = STATIONS.some(s => s.id === stationId);
        if (exists) {
          setSelectedStationId(stationId);
          setIsHomeLanding(false);
          setCurrentTab('home');
        } else {
          setIsHomeLanding(true);
          setSelectedStationId('seomyeon');
          setCurrentTab('home');
        }
      } else {
        // Root path /
        setIsHomeLanding(true);
        setSelectedStationId('seomyeon');
        setCurrentTab('home');
      }
    };

    handleUrlRouting();
    isInitialRoutingCompleteRef.current = true;
    window.addEventListener('popstate', handleUrlRouting);
    return () => {
      window.removeEventListener('popstate', handleUrlRouting);
    };
  }, []);

  // Synchronize dynamic URL path, document headers metadata (SEO-friendly) and scroll to top on tab switch
  useEffect(() => {
    // Scroll window to top whenever tab or view changes to avoid blank space from previous scroll offset
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch (e) {
      try {
        window.scrollTo(0, 0);
      } catch (err) {
        // ignore
      }
    }

    // 1. Change URL path safely
    let cleanRoutePath = '/';
    try {
      if (currentTab === 'home') {
        if (isHomeLanding) {
          cleanRoutePath = '/';
        } else if (selectedStationId) {
          cleanRoutePath = `/station/${selectedStationId}`;
        }
      } else {
        let expectedPath = `/${currentTab}`;
        if (currentTab === 'search') {
          if (searchViewMode === 'DETAIL' && selectedStationId) {
            expectedPath = `/station/${selectedStationId}`;
          } else {
            expectedPath = '/search';
          }
        } else if (currentTab === 'transit') {
          if (tipsSubPage === 'child-free') expectedPath = '/tips/child-free';
          else if (tipsSubPage === 'bus-qr') expectedPath = '/tips/bus-qr';
          else if (tipsSubPage === 'taxi') expectedPath = '/tips/taxi';
          else expectedPath = '/tips/transit';
        } else if (currentTab === 'courses') {
          if (selectedItineraryCategory) {
            const catSlug = categoryToUrlSlug(selectedItineraryCategory);
            if (selectedItineraryCategory === 'SUBWAY' && activeRegionPage) {
              expectedPath = `/tips/courses/subway/${activeRegionPage.toLowerCase()}`;
            } else {
              expectedPath = `/tips/courses/${catSlug}`;
            }
          } else if (activeRegionPage) {
            expectedPath = `/tips/courses/${activeRegionPage.toLowerCase()}`;
          } else {
            expectedPath = '/tips/courses';
          }
        } else if (currentTab === 'schedule') {
          expectedPath = '/schedule';
        } else if (currentTab === 'exploration') {
          if (explorationItemId) {
            expectedPath = `/tips/exploration/${explorationItemId}`;
          } else {
            expectedPath = '/tips/exploration';
          }
        } else if (currentTab === 'tips' || currentTab === 'transit' || currentTab === 'courses' || currentTab === 'schedule' || currentTab === 'exploration') {
          if (tipsSubPage === 'courses') {
            if (selectedItineraryCategory) {
              const catSlug = categoryToUrlSlug(selectedItineraryCategory);
              if (selectedItineraryCategory === 'SUBWAY' && activeRegionPage) {
                expectedPath = `/tips/courses/subway/${activeRegionPage.toLowerCase()}`;
              } else {
                expectedPath = `/tips/courses/${catSlug}`;
              }
            } else if (activeRegionPage) {
              expectedPath = `/tips/courses/${activeRegionPage.toLowerCase()}`;
            } else {
              expectedPath = '/tips/courses';
            }
          } else if (selectedItineraryCategory) {
            const catSlug = categoryToUrlSlug(selectedItineraryCategory);
            expectedPath = `/tips/courses/${catSlug}`;
          } else if (tipsSubPage === 'transit') {
            expectedPath = '/tips/transit';
          } else if (tipsSubPage === 'child-free') {
            expectedPath = '/tips/child-free';
          } else if (tipsSubPage === 'bus-qr') {
            expectedPath = '/tips/bus-qr';
          } else if (tipsSubPage === 'taxi') {
            expectedPath = '/tips/taxi';
          } else if (tipsSubPage === 'exploration') {
            if (explorationItemId) {
              expectedPath = `/tips/exploration/${explorationItemId}`;
            } else {
              expectedPath = '/tips/exploration';
            }
          } else if (tipsSubPage === 'schedule') {
            expectedPath = '/schedule';
          } else {
            if (activeRegionPage) {
              expectedPath = `/tips/${activeRegionPage.toLowerCase()}`;
            } else {
              expectedPath = '/tips';
            }
          }
        } else if (currentTab === 'tourapi') {
          if (barrierFreePlaceId) {
            expectedPath = `/barrier-free/detail?id=${encodeURIComponent(barrierFreePlaceId)}`;
          } else if (barrierFreeCourseId) {
            expectedPath = `/barrier-free/course/${barrierFreeCourseId}`;
          } else {
            expectedPath = '/barrier-free';
          }
        } else if (currentTab === 'about') {
          if (siteSubPage === 'privacy') {
            expectedPath = '/about/privacy';
          } else if (siteSubPage === 'terms') {
            expectedPath = '/about/terms';
          } else if (siteSubPage === 'contact') {
            expectedPath = '/about/contact';
          } else if (siteSubPage === 'data-source') {
            expectedPath = '/about/data-source';
          } else {
            expectedPath = '/about';
          }
        }
        cleanRoutePath = expectedPath;
      }

      if (isInitialRoutingCompleteRef.current) {
        let localizedExpectedPath = buildLocalizedPath(cleanRoutePath, language);
        if (selectedItineraryCategory === 'MY_ROUTE' && (window.location.search.includes('r=') || window.location.search.includes('route='))) {
          localizedExpectedPath += window.location.search;
        }
        const currentUrlPath = window.location.pathname + window.location.search;
        if (currentUrlPath !== localizedExpectedPath && window.location.pathname !== localizedExpectedPath) {
          window.history.pushState(
            { tab: currentTab, category: selectedItineraryCategory, subPage: tipsSubPage, regionPage: activeRegionPage, siteSubPage, searchViewMode, stationId: selectedStationId, explorationItemId, language },
            '',
            localizedExpectedPath
          );
        }
      }
    } catch (e) {
      console.warn('URL pushState error ignored:', e);
    }

    // 2. Change metadata (Dynamic Title, Description, Keywords, and OpenGraph tags in all 7 languages)
    let pageTitle = pickLang(language, {
      KR: "부산 여행 코스 추천 & 지하철 무장애 가이드 | Busan Trip Plan & Step-Free Itinerary | 스탭리스 Stepless",
      EN: "Busan Trip Plan, 1-5 Day Itineraries & Step-Free Subway Guide | Stepless in Busan",
      JA: "釜山旅行おすすめモデルコース(日帰り〜4泊5日)＆地下鉄エレベーター完全ガイド | Stepless",
      ZH_TW: "釜山自由行攻略・推薦行程(一日遊～五天四夜)＆地鐵電梯無障礙指南 | Stepless",
      ZH_CN: "釜山旅游攻略・自由行路线推荐(一日游～五天四晚)＆地铁无障碍直梯指南 | Stepless",
      ES: "Guía de Viaje a Busan: Qué Ver, Itinerarios (1 a 5 Días) y Metro Sin Escalones | Stepless",
      FR: "Guide de Voyage à Busan : Que Voir, Itinéraires (1 à 5 Jours) et Métro Sans Marche | Stepless",
    });
    let pageDesc = pickLang(language, {
      KR: "부산 명소·맛집·전통시장 추천 여행 코스(당일치기~4박5일), 나만의 맞춤 여행 루트 플래너, 주요 46개 지하철역 엘리베이터 위치 및 유모차·휠체어 배리어프리 동선 가이드.",
      EN: "Plan your Busan trip with curated 1 to 5-day Busan itineraries, interactive custom travel route planner, and step-free elevator exits for 46 major Busan subway stations.",
      JA: "釜山の人気観光スポット・絶品グルメ・伝統市場モデルコース(日帰り〜4泊5日)、カスタム旅程プランナー、主要46駅の地下鉄エレベーター出口＆ベビーカー・車椅子バリアフリー案内。",
      ZH_TW: "釜山必訪景點、在地美食、傳統市場推薦行程(一日遊～五天四夜)、自訂旅遊路線規劃，以及 46 個主要地鐵站電梯出口與嬰兒車・輪椅無障礙動線指南。",
      ZH_CN: "釜山必去景点、地道美食、传统市场推荐路线(一日游～五天四晚)、自定义旅游行程规划，以及 46 个主要地铁站无障碍直梯出口与婴儿车・轮椅出行指南。",
      ES: "Planifica tu viaje a Busan con itinerarios recomendados de 1 a 5 días, gastronomía, mercados tradicionales, planificador de rutas y salidas con ascensor en 46 estaciones de metro.",
      FR: "Préparez votre voyage à Busan avec des itinéraires de 1 à 5 jours, gastronomie, marchés traditionnels, planificateur d’itinéraire et sorties avec ascenseur dans 46 stations de métro.",
    });

    if (currentTab === 'search' && searchViewMode === 'INDEX') {
      pageTitle = pickLang(language, {
        KR: "부산 지하철역 출구 정보 둘러보기 & 역 검색 | Busan Subway Elevator Guide | 스탭리스 Stepless",
        EN: "Busan Subway Station Elevator & Step-Free Exit Directory (46 Stations) | Stepless",
        JA: "釜山地下鉄46駅エレベーター出口一覧＆バリアフリー駅検索 | Stepless",
        ZH_TW: "釜山地鐵 46 站電梯出口總覽＆無障礙車站搜尋 | Stepless",
        ZH_CN: "釜山地铁 46 站直梯出口总览＆无障碍车站搜索 | Stepless",
        ES: "Directorio de Ascensores y Salidas del Metro de Busan (46 Estaciones) | Stepless",
        FR: "Répertoire des Ascenseurs et Sorties du Métro de Busan (46 Stations) | Stepless",
      });
      pageDesc = pickLang(language, {
        KR: "부산 지하철 1~4호선·동해선·경전철 주요 46개 역의 엘리베이터, 에스컬레이터 대수 및 출구별 무단차 이동 정보를 한눈에 비교하고 검색해 보세요.",
        EN: "Explore exact elevator exit numbers, escalator availability, and stroller/wheelchair step-free paths across 46 major Busan subway stations.",
        JA: "釜山地下鉄1〜4号線・東海線・軽電鉄の主要46駅のエレベーター・エスカレーター出口番号とバリアフリー乗換ルートを一目で比較・検索。",
        ZH_TW: "一覽並搜尋釜山地鐵 1～4 號線、東海線、輕軌共 46 個主要車站的電梯出口編號、電扶梯與嬰兒車無障礙轉乘動線。",
        ZH_CN: "一览并搜索釜山地铁 1～4 号线、东海线、轻轨共 46 个主要车站的直梯出口编号、扶梯与婴儿车无障碍换乘路线。",
        ES: "Consulta y compara los números exactos de salida con ascensor, escaleras mecánicas y rutas sin escalones en 46 estaciones del metro de Busan.",
        FR: "Consultez et comparez les numéros exacts de sortie avec ascenseur, escaliers mécaniques et itinéraires sans marches dans 46 stations du métro de Busan.",
      });
    } else if (((currentTab === 'home' && !isHomeLanding) || (currentTab === 'search' && searchViewMode === 'DETAIL')) && selectedStationId) {
      const activeST = STATIONS.find(s => s.id === selectedStationId);
      if (activeST) {
        const stLocalTitle = getLocalizedStationTitle(activeST, language, true);
        pageTitle = pickLang(language, {
          KR: `${activeST.name} (${activeST.englishName}) 엘리베이터 위치 & 유모차 무장애 동선 | 스탭리스 Stepless`,
          EN: `${stLocalTitle} Elevator Exits & Step-Free Busan Subway Guide | Stepless`,
          JA: `${stLocalTitle} エレベーター位置・出口案内＆バリアフリー乗換マップ | Stepless`,
          ZH_TW: `${stLocalTitle} 電梯位置・出口指南＆無障礙轉乘地圖 | Stepless`,
          ZH_CN: `${stLocalTitle} 电梯位置・出口指南＆无障碍换乘地图 | Stepless`,
          ES: `${stLocalTitle} — Ubicación de Ascensores, Salidas y Mapa Sin Escalones | Stepless`,
          FR: `${stLocalTitle} — Ascenseurs, Sorties et Plan d'Accès Sans Marche | Stepless`,
        });
        pageDesc = pickLang(language, {
          KR: `${activeST.name} (${activeST.englishName}) 지하철역의 지상 직결 엘리베이터 출구 번호와 유모차, 캐리어, 휠체어 이용자를 위한 계단 없는 추천 동선 정보를 안내합니다.`,
          EN: `Find exact street-level elevator exit numbers, escalator access, and step-free stroller & luggage routes at ${stLocalTitle} on the Busan Subway.`,
          JA: `釜山地下鉄 ${stLocalTitle} の地上直結エレベーター出口番号、エスカレーター、多目的トイレ、ベビーカー・スーツケース向け階段なし移動ルート案内。`,
          ZH_TW: `釜山地鐵 ${stLocalTitle} 地面直達電梯出口編號、電扶梯、無障礙廁所與嬰兒車・大型行李無階梯轉乘路線指南。`,
          ZH_CN: `釜山地铁 ${stLocalTitle} 地面直达电梯出口编号、扶梯、无障碍卫生间与婴儿车・大件行李无台阶换乘路线指南。`,
          ES: `Guía de salidas con ascensor a nivel de calle, escaleras mecánicas, baños accesibles y rutas sin escalones en ${stLocalTitle} del metro de Busan.`,
          FR: `Guide des sorties avec ascenseur au niveau de la rue, escaliers mécaniques, toilettes accessibles et itinéraires sans marches à ${stLocalTitle}.`,
        });
      }
    } else if (currentTab === 'about') {
      if (siteSubPage === 'privacy') {
        pageTitle = pickLang(language, {
          KR: "개인정보처리방침 | 스탭리스 Stepless",
          EN: "Privacy Policy | Stepless in Busan",
          JA: "プライバシーポリシー（個人情報保護方針） | Stepless in Busan",
          ZH_TW: "隱私權政策 (Privacy Policy) | Stepless in Busan",
          ZH_CN: "隐私政策 (Privacy Policy) | Stepless in Busan",
          ES: "Política de Privacidad | Stepless in Busan",
          FR: "Politique de Confidentialité | Stepless in Busan",
        });
      } else if (siteSubPage === 'terms') {
        pageTitle = pickLang(language, {
          KR: "서비스 이용약관 | 스탭리스 Stepless",
          EN: "Terms of Service | Stepless in Busan",
          JA: "利用規約 (Terms of Service) | Stepless in Busan",
          ZH_TW: "服務條款 (Terms of Service) | Stepless in Busan",
          ZH_CN: "服务条款 (Terms of Service) | Stepless in Busan",
          ES: "Términos de Servicio | Stepless in Busan",
          FR: "Conditions d'Utilisation | Stepless in Busan",
        });
      } else if (siteSubPage === 'contact') {
        pageTitle = pickLang(language, {
          KR: "문의 및 제휴 안내 | 스탭리스 Stepless",
          EN: "Contact & Partnership | Stepless in Busan",
          JA: "お問い合わせ・情報修正リクエスト | Stepless in Busan",
          ZH_TW: "聯絡我們・資料更正與合作洽詢 | Stepless in Busan",
          ZH_CN: "联系我们・信息更正与合作咨询 | Stepless in Busan",
          ES: "Contacto y Colaboraciones | Stepless in Busan",
          FR: "Contact et Partenariats | Stepless in Busan",
        });
      } else if (siteSubPage === 'data-source') {
        pageTitle = pickLang(language, {
          KR: "데이터 출처와 정정 요청 | 스탭리스 Stepless",
          EN: "Data Sources & Verification | Stepless in Busan",
          JA: "データ出典および現地検証基準 | Stepless in Busan",
          ZH_TW: "公共數據來源與實地驗證標準 | Stepless in Busan",
          ZH_CN: "公共数据来源与实地验证标准 | Stepless in Busan",
          ES: "Fuentes de Datos Oficiales y Verificación | Stepless in Busan",
          FR: "Sources de Données Officielles et Vérification | Stepless in Busan",
        });
      } else {
        pageTitle = pickLang(language, {
          KR: "운영자 소개 | 스탭리스 Stepless",
          EN: "About Stepless in Busan | Step-Free Busan Trip Guide",
          JA: "サービス紹介 | Stepless in Busan 釜山バリアフリー旅行ガイド",
          ZH_TW: "關於我們 | Stepless in Busan 釜山無障礙自由行指南",
          ZH_CN: "关于我们 | Stepless in Busan 釜山无障碍自由行指南",
          ES: "Sobre Nosotros | Stepless in Busan Guía de Viaje Accesible",
          FR: "À Propos | Stepless in Busan Guide de Voyage Accessible",
        });
      }
    } else if (['tips', 'transit', 'courses', 'schedule', 'exploration'].includes(currentTab)) {
      if (selectedItineraryCategory) {
        const catTitles: Record<string, Record<Language, string>> = {
          GOURMET: {
            KR: '부산 식도락 맛집 여행 코스 추천 | 스탭리스 Stepless',
            EN: 'Busan Food Tour & Best Local Restaurants Itinerary | Stepless',
            JA: '釜山グルメ・食べ歩きおすすめモデルコース（デジクッパ・ミルミョン・海鮮・カフェ） | Stepless',
            ZH_TW: '釜山美食必吃推薦行程（豬肉湯飯・小麥冷麵・札嘎其海鮮・田浦咖啡街） | Stepless',
            ZH_CN: '釜山美食必吃推荐路线（猪肉汤饭・小麦冷面・札嘎其海鲜・田浦咖啡街） | Stepless',
            ES: 'Ruta Gastronómica por Busan: Dónde Comer Platos Locales y Cafeterías | Stepless',
            FR: 'Itinéraire Gastronomique à Busan : Spécialités Locales, Fruits de Mer et Cafés | Stepless',
          },
          EXPERIENCE: {
            KR: '부산 체험 & 박물관 여행 코스 추천 | 스탭리스 Stepless',
            EN: 'Busan Museums, Art & Cultural Experience Itinerary | Stepless',
            JA: '釜山ミュージアム・文化体験おすすめコース（アルテミュージアム・F1963・国立海洋博物館） | Stepless',
            ZH_TW: '釜山博物館・文化體驗推薦行程（Arte Museum・F1963・國立海洋博物館） | Stepless',
            ZH_CN: '釜山博物馆・文化体验推荐路线（Arte Museum・F1963・国立海洋博物馆） | Stepless',
            ES: 'Museos y Experiencias Culturales en Busan (Arte Museum, F1963, Museo Marítimo) | Stepless',
            FR: 'Musées et Expériences Culturelles à Busan (Arte Museum, F1963, Musée Maritime) | Stepless',
          },
          MARKET: {
            KR: '부산 전통시장 투어 추천 코스 | 스탭리스 Stepless',
            EN: 'Busan Traditional Markets & Night Market Tour Itinerary | Stepless',
            JA: '釜山伝統市場・夜市めぐりモデルコース（チャガルチ市場・国際市場・富平カントン夜市） | Stepless',
            ZH_TW: '釜山傳統市場・夜市巡禮行程（札嘎其市場・國際市場・富平罐頭夜市） | Stepless',
            ZH_CN: '釜山传统市场・夜市巡礼路线（札嘎其市场・国际市场・富平罐头夜市） | Stepless',
            ES: 'Ruta por los Mercados Tradicionales y Nocturnos de Busan (Jagalchi, Gukje) | Stepless',
            FR: 'Visite des Marchés Traditionnels et de Nuit de Busan (Jagalchi, Gukje) | Stepless',
          },
          ATTRACTION: {
            KR: '부산 대표 핵심 명소 여행 코스 | 스탭리스 Stepless',
            EN: 'Top Busan Attractions & Must-Visit Landmarks Itinerary | Stepless',
            JA: '釜山定番観光スポット・名所モデルコース（海雲台・広安里・甘川文化村・海東龍宮寺） | Stepless',
            ZH_TW: '釜山必去代表景點行程（海雲台・廣安里・甘川洞文化村・白淺灘・海東龍宮寺） | Stepless',
            ZH_CN: '釜山必去代表景点路线（海云台・广安里・甘川文化村・白浅滩・海东龙宫寺） | Stepless',
            ES: 'Principales Atracciones Qué Ver en Busan (Haeundae, Gwangalli, Gamcheon) | Stepless',
            FR: 'Sites Incontournables à Visiter à Busan (Haeundae, Gwangalli, Gamcheon) | Stepless',
          },
          DAY: {
            KR: '부산 당일치기 여행 추천 코스 | 스탭리스 Stepless',
            EN: '1-Day Busan Itinerary & Day Trip Plan | Stepless',
            JA: '釜山日帰りモデルコース（東釜山・旧都心・カフェツアー完全ガイド） | Stepless',
            ZH_TW: '釜山一日遊精華行程推薦（東釜山海景・舊城區甘川洞・特色咖啡巡禮） | Stepless',
            ZH_CN: '釜山一日游精华路线推荐（东釜山海景・老城区甘川洞・特色咖啡巡礼） | Stepless',
            ES: 'Itinerario de 1 Día en Busan: Qué Ver en una Excursión de un Día | Stepless',
            FR: 'Itinéraire d’1 Jour à Busan : Que Voir en une Journée | Stepless',
          },
          '1NIGHT': {
            KR: '부산 1박 2일 여행 추천 코스 | 스탭리스 Stepless',
            EN: '2-Day 1-Night Busan Trip Itinerary & Weekend Plan | Stepless',
            JA: '釜山1泊2日おすすめモデルコース（王道スポット・夜景・グルメ満喫） | Stepless',
            ZH_TW: '釜山兩天一夜自由行推薦行程（經典海景・夜景・必吃美食攻略） | Stepless',
            ZH_CN: '釜山两天一夜自由行推荐路线（经典海景・夜景・必吃美食攻略） | Stepless',
            ES: 'Itinerario de 2 Días y 1 Noche en Busan: Playas, Mercados y Vistas Nocturnas | Stepless',
            FR: 'Itinéraire de 2 Jours et 1 Nuit à Busan : Plages, Marchés et Vues de Nuit | Stepless',
          },
          '2NIGHTS': {
            KR: '부산 2박 3일 여행 추천 코스 | 스탭리스 Stepless',
            EN: '3-Day 2-Night Busan Trip Plan & Complete Itinerary | Stepless',
            JA: '釜山2泊3日王道モデルコース（海雲台・広安里・甘川文化村・影島・機張） | Stepless',
            ZH_TW: '釜山三天兩夜自由行完整行程（海雲台・廣安里・甘川洞・影島・機張全攻略） | Stepless',
            ZH_CN: '釜山三天两夜自由行完整路线（海云台・广安里・甘川洞・影岛・机张全攻略） | Stepless',
            ES: 'Itinerario de 3 Días y 2 Noches en Busan: Ruta Completa por la Ciudad | Stepless',
            FR: 'Itinéraire de 3 Jours et 2 Nuits à Busan : Parcours Complet de la Ville | Stepless',
          },
          '3NIGHTS': {
            KR: '부산 3박 4일 여유로운 힐링 여행 추천 코스 | 스탭리스 Stepless',
            EN: '4-Day 3-Night Relaxed Busan Trip Plan & Slow Travel Itinerary | Stepless',
            JA: '釜山3泊4日ゆったり癒しモデルコース（海辺散策・美術館・温泉・伝統市場） | Stepless',
            ZH_TW: '釜山四天三夜慢活療癒自由行（海濱步道・美術館・溫泉・傳統市場） | Stepless',
            ZH_CN: '釜山四天三晚慢享疗愈自由行（海滨步道・美术馆・温泉・传统市场） | Stepless',
            ES: 'Itinerario de 4 Días y 3 Noches en Busan: Viaje Relajado por Playas y Cultura | Stepless',
            FR: 'Itinéraire de 4 Jours et 3 Nuits à Busan : Voyage Détente entre Plages et Culture | Stepless',
          },
          '4NIGHTS': {
            KR: '부산 4박 5일 전 지역 일주 여행 추천 코스 | 스탭리스 Stepless',
            EN: '5-Day 4-Night Grand Busan Trip Itinerary (All Regions) | Stepless',
            JA: '釜山4泊5日全エリア完全制覇モデルコース（旧都心・西釜山・西面・海雲台・機張） | Stepless',
            ZH_TW: '釜山五天四夜全區深度自由行（舊城區・多大浦・西面・海雲台・松亭・機張） | Stepless',
            ZH_CN: '釜山五天四晚全区深度自由行（老城区・多大浦・西面・海云台・松亭・机张） | Stepless',
            ES: 'Itinerario de 5 Días y 4 Noches en Busan: Gran Ruta por Todas las Regiones | Stepless',
            FR: 'Itinéraire de 5 Jours et 4 Nuits à Busan : Grand Tour de Toutes les Régions | Stepless',
          },
          SUBWAY: {
            KR: '부산도시철도 지하철 테마 여행 코스 | 스탭리스 Stepless',
            EN: 'Busan Subway Line 1 & 2 Step-Free Travel Itinerary | Stepless',
            JA: '釜山地下鉄1・2号線で行く駅近バリアフリー観光コース | Stepless',
            ZH_TW: '釜山地鐵 1・2 號線沿線無障礙景點推薦路線 | Stepless',
            ZH_CN: '釜山地铁 1・2 号线沿线无障碍景点推荐路线 | Stepless',
            ES: 'Ruta Turística en Metro por Busan (Líneas 1 y 2 Sin Escalones) | Stepless',
            FR: 'Itinéraire Touristique en Métro à Busan (Lignes 1 et 2 Sans Marche) | Stepless',
          },
          BARRIER_FREE: {
            KR: '부산 무장애(배리어프리) 열린관광지 코스 | 스탭리스 Stepless',
            EN: 'Wheelchair & Stroller Accessible Busan Trip Itinerary | Stepless',
            JA: '釜山バリアフリー観光スポット＆ベビーカー・車椅子おすすめコース | Stepless',
            ZH_TW: '釜山無障礙旅遊景點＆嬰兒車・輪椅推薦路線指南 | Stepless',
            ZH_CN: '釜山无障碍旅游景点＆婴儿车・轮椅推荐路线指南 | Stepless',
            ES: 'Turismo Accesible en Busan: Atracciones para Silla de Ruedas y Carritos | Stepless',
            FR: 'Tourisme Accessible à Busan : Sites pour Fauteuil Roulant et Poussette | Stepless',
          },
          MY_ROUTE: {
            KR: '나만의 맞춤 부산 여행 코스 만들기 | 스탭리스 Stepless',
            EN: 'Custom Busan Trip Route Planner & Itinerary Builder | Stepless',
            JA: 'マイ旅行ルートプランナー｜釜山カスタム旅程作成＆乗換案内 | Stepless',
            ZH_TW: '我的釜山旅遊路線規劃器｜自訂自由行行程＆地鐵公車導航 | Stepless',
            ZH_CN: '我的釜山旅游路线规划器｜自定义自由行行程＆地铁公交导航 | Stepless',
            ES: 'Planificador de Rutas Personalizadas en Busan y Direcciones de Transporte | Stepless',
            FR: 'Planificateur d’Itinéraire Personnalisé à Busan et Transports en Commun | Stepless',
          },
        };
        if (catTitles[selectedItineraryCategory]) {
          pageTitle = pickLang(language, catTitles[selectedItineraryCategory]);
        }
      } else if (tipsSubPage === 'transit' || tipsSubPage === 'transfer') {
        pageTitle = pickLang(language, {
          KR: "부산 대중교통 이용 팁 & 시내버스·지하철 환승 가이드 | 스탭리스 Stepless",
          EN: "Busan Public Transit Guide: Subway-Bus Transfers & Luggage Rules | Stepless",
          JA: "釜山公共交通ガイド：地下鉄・バス無料乗換＆大型スーツケース持込規定 | Stepless",
          ZH_TW: "釜山大眾運輸攻略：地鐵公車免費轉乘＆大型行李箱搭車規定 | Stepless",
          ZH_CN: "釜山公共交通攻略：地铁公交免费换乘＆大件行李箱乘车规定 | Stepless",
          ES: "Guía de Transporte Público en Busan: Transbordos Metro-Autobús y Equipaje | Stepless",
          FR: "Guide des Transports Publics à Busan : Correspondances Métro-Bus et Bagages | Stepless",
        });
      } else if (tipsSubPage === 'schedule' || currentTab === 'schedule') {
        pageTitle = pickLang(language, {
          KR: "부산 주요 축제·행사 월별 캘린더 & 무장애 관람 가이드 | 스탭리스 Stepless",
          EN: "Busan Festivals & Events Calendar (Gwangalli Drone Show, Fireworks) | Stepless",
          JA: "釜山祭り・イベント月別カレンダー（広安里ドローンショー・花火大会・映画祭） | Stepless",
          ZH_TW: "釜山慶典活動月曆（廣安里無人機秀・釜山煙火節・國際影展） | Stepless",
          ZH_CN: "釜山庆典活动月历（广安里无人机表演・釜山烟花节・国际电影节） | Stepless",
          ES: "Calendario de Festivales y Eventos de Busan (Show de Drones Gwangalli, Fuegos Artificiales) | Stepless",
          FR: "Calendrier des Festivals et Événements de Busan (Spectacle de Drones Gwangalli, Feux d'Artifice) | Stepless",
        });
      } else if (tipsSubPage === 'exploration' || currentTab === 'exploration') {
        pageTitle = pickLang(language, {
          KR: "부산 탐구생활 - 무료 짐 보관소·유모차 대여·지하철 꿀팁 | 스탭리스 Stepless",
          EN: "Local Busan Hacks: Free Luggage Storage, Stroller Rental & Subway Tips | Stepless",
          JA: "釜山ローカル裏ワザ集：無料荷物預かり所・ベビーカー貸出・地下鉄10分再入場 | Stepless",
          ZH_TW: "釜山在地實用秘笈：免費行李寄放・嬰兒車租借・地鐵免費重進閘門 | Stepless",
          ZH_CN: "釜山本地实用秘笈：免费行李寄存・婴儿车租借・地铁免费重进闸机 | Stepless",
          ES: "Trucos Locales de Busan: Consigna Gratuita, Alquiler de Carritos y Metro | Stepless",
          FR: "Astuces Locales à Busan : Consigne Gratuite, Location de Poussettes et Métro | Stepless",
        });
      } else {
        pageTitle = pickLang(language, {
          KR: "부산 테마별 & 일정별 추천 여행 코스 | Busan Trip Plan & Itineraries | 스탭리스 Stepless",
          EN: "Busan Trip Plan: 1 to 5-Day Itineraries & Theme Courses | Stepless",
          JA: "釜山旅行おすすめモデルコース一覧（日帰り・1泊2日・2泊3日・グルメ・市場・名所） | Stepless",
          ZH_TW: "釜山自由行推薦行程總覽（一日遊・三天兩夜・美食・傳統市場・熱門景點） | Stepless",
          ZH_CN: "釜山自由行推荐路线总览（一日游・三天两夜・美食・传统市场・热门景点） | Stepless",
          ES: "Itinerarios Recomendados en Busan: Rutas de 1 a 5 Días, Gastronomía y Mercados | Stepless",
          FR: "Itinéraires Recommandés à Busan : Circuits de 1 à 5 Jours, Gastronomie et Marchés | Stepless",
        });
      }
    } else if (currentTab === 'tourapi') {
      pageTitle = pickLang(language, {
        KR: "부산 무장애 관광지 & 배리어프리 열린관광지 | Accessible Busan Guide | 스탭리스 Stepless",
        EN: "Wheelchair & Stroller Accessible Attractions in Busan | Stepless",
        JA: "釜山バリアフリー観光スポット＆ベビーカー・車椅子おすすめコース | Stepless",
        ZH_TW: "釜山無障礙旅遊景點＆嬰兒車・輪椅推薦路線指南 | Stepless",
        ZH_CN: "釜山无障碍旅游景点＆婴儿车・轮椅推荐路线指南 | Stepless",
        ES: "Turismo Accesible en Busan: Atracciones para Silla de Ruedas y Carritos | Stepless",
        FR: "Tourisme Accessible à Busan : Sites pour Fauteuil Roulant et Poussette | Stepless",
      });
    }

    document.title = pageTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', pageDesc);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', pageDesc);
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', pageTitle);
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', pageDesc);

    // 3. Synchronize <html lang>, localized <link rel="canonical">, <meta property="og:url">, <meta property="og:locale">, and <link rel="alternate" hreflang="...">
    try {
      const langOpt = LANGUAGE_OPTIONS.find(o => o.code === language) || LANGUAGE_OPTIONS[0];
      document.documentElement.lang = langOpt.htmlLang;

      const localizedCanonicalPath = buildLocalizedPath(cleanRoutePath.split('?')[0], language);
      const fullLocalizedUrl = `https://stepless.kr${localizedCanonicalPath}`;

      const canonicalEl = document.querySelector('link[rel="canonical"]');
      if (canonicalEl) canonicalEl.setAttribute('href', fullLocalizedUrl);

      const ogUrlEl = document.querySelector('meta[property="og:url"]');
      if (ogUrlEl) ogUrlEl.setAttribute('content', fullLocalizedUrl);

      const ogLocaleEl = document.querySelector('meta[property="og:locale"]');
      if (ogLocaleEl) ogLocaleEl.setAttribute('content', langOpt.ogLocale);

      // Update or inject hreflang tags for all 7 languages
      const hreflangEntries = getHreflangEntries(cleanRoutePath.split('?')[0]);
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
      for (const entry of hreflangEntries) {
        const link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', entry.hreflang);
        link.setAttribute('href', entry.href);
        document.head.appendChild(link);
      }
    } catch (e) {
      // ignore head manipulation errors
    }
  }, [selectedStationId, currentTab, isHomeLanding, searchViewMode, selectedItineraryCategory, tipsSubPage, activeRegionPage, siteSubPage, language, explorationItemId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);

    return () => clearTimeout(timer);
  }, [currentTab, selectedStationId, isHomeLanding, selectedItineraryCategory, tipsSubPage, activeRegionPage, explorationItemId]);

  useEffect(() => {
    localStorage.setItem('busan_traveler_upvotes', JSON.stringify(hasUpvoted));
  }, [hasUpvoted]);

  useEffect(() => {
    localStorage.setItem('busan_traveler_recs', JSON.stringify(recommendations));
  }, [recommendations]);

  // Automatic Translation States using server-side Gemini 3.5 Flash
  const [translatedRecs, setTranslatedRecs] = useState<Record<string, { topic: string; content: string; stationOrExit: string }>>(() => {
    try {
      const saved = localStorage.getItem('busan_traveler_recs_en');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [translatingIds, setTranslatingIds] = useState<Record<string, boolean>>({});

  const translatedRecsRef = React.useRef(translatedRecs);
  const translatingIdsRef = React.useRef(translatingIds);

  useEffect(() => {
    translatedRecsRef.current = translatedRecs;
    localStorage.setItem('busan_traveler_recs_en', JSON.stringify(translatedRecs));
  }, [translatedRecs]);

  useEffect(() => {
    translatingIdsRef.current = translatingIds;
  }, [translatingIds]);

  useEffect(() => {
    if (language !== 'EN') return;

    // Use a local copy to prevent duplicate network calls in the exact same loop tick
    const currentFetching = { ...translatingIdsRef.current };

    recommendations.forEach((rec) => {
      if (translatedRecsRef.current[rec.id] || currentFetching[rec.id]) return;

      // Mark as fetching immediately in local tracker and ref synchronously
      currentFetching[rec.id] = true;
      translatingIdsRef.current[rec.id] = true;
      setTranslatingIds(prev => ({ ...prev, [rec.id]: true }));

      fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: rec.topic,
          content: rec.content,
          stationOrExit: rec.stationOrExit
        })
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Translation API failed");
      })
      .then(data => {
        setTranslatedRecs(prev => {
          const updated = {
            ...prev,
            [rec.id]: {
              topic: data.topic,
              content: data.content,
              stationOrExit: data.stationOrExit
            }
          };
          localStorage.setItem('busan_traveler_recs_en', JSON.stringify(updated));
          return updated;
        });
      })
      .catch(err => {
        console.warn("Translation API failed, using local offline fallback for ID:", rec.id, err);
        const fallback = translateRecommendation(rec, 'EN');
        setTranslatedRecs(prev => {
          const updated = {
            ...prev,
            [rec.id]: fallback
          };
          localStorage.setItem('busan_traveler_recs_en', JSON.stringify(updated));
          return updated;
        });
      })
      .finally(() => {
        setTranslatingIds(prev => ({ ...prev, [rec.id]: false }));
        translatingIdsRef.current[rec.id] = false;
      });
    });
  }, [language, recommendations]);

  const handleManualTranslate = (rec: TravelerRecommendation) => {
    if (translatingIds[rec.id]) return;

    setTranslatingIds(prev => ({ ...prev, [rec.id]: true }));
    translatingIdsRef.current[rec.id] = true;

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: rec.topic,
        content: rec.content,
        stationOrExit: rec.stationOrExit
      })
    })
    .then(res => {
      if (res.ok) return res.json();
      throw new Error("Translation failed");
    })
    .then(data => {
      setTranslatedRecs(prev => {
        const updated = {
          ...prev,
          [rec.id]: {
            topic: data.topic,
            content: data.content,
            stationOrExit: data.stationOrExit
          }
        };
        localStorage.setItem('busan_traveler_recs_en', JSON.stringify(updated));
        return updated;
      });
    })
    .catch(err => {
      console.warn("Manual translation API failed, using local offline fallback for ID:", rec.id, err);
      const fallback = translateRecommendation(rec, 'EN');
      setTranslatedRecs(prev => {
        const updated = {
          ...prev,
          [rec.id]: fallback
        };
        localStorage.setItem('busan_traveler_recs_en', JSON.stringify(updated));
        return updated;
      });
    })
    .finally(() => {
      setTranslatingIds(prev => ({ ...prev, [rec.id]: false }));
      translatingIdsRef.current[rec.id] = false;
    });
  };

  const handleAddRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecAuthor.trim() || !newRecTopic.trim() || !newRecContent.trim()) return;

    const newId = `rec-${Date.now()}`;
    const newRec: TravelerRecommendation = {
      id: newId,
      author: newRecAuthor.trim(),
      topic: newRecTopic.trim(),
      category: newRecCategory,
      stationOrExit: newRecStation.trim() || (language === 'KR' ? '모든 구역' : 'All Area'),
      content: newRecContent.trim(),
      upvotes: 0,
      createdAt: new Date().toISOString()
    };

    // 1. Optimistic UI Updates - renders on screen instantly
    setRecommendations(prev => {
      const updated = [newRec, ...prev];
      localStorage.setItem('busan_traveler_recs', JSON.stringify(updated));
      return updated;
    });
    setMyRecIds(prev => {
      const updated = [...prev, newId];
      localStorage.setItem('busan_my_rec_ids', JSON.stringify(updated));
      return updated;
    });

    // Reset inputs immediately
    setNewRecAuthor('');
    setNewRecTopic('');
    setNewRecCategory('FOOD');
    setNewRecStation('');
    setNewRecContent('');

    // 2. Synchronize with server-side JSON database in the background
    fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRec)
    })
    .then(res => {
      if (res.ok) return res.json();
      throw new Error("Failed to save recommendation on server");
    })
    .then((syncedRec: TravelerRecommendation) => {
      console.log("Successfully synchronized with server database:", syncedRec);
    })
    .catch(err => {
      console.error("Server sync failed, recommendation remains in local storage:", err);
    });

    // 3. Translate immediately in background so it's cached and ready instantly when switching language!
    setTranslatingIds(prev => ({ ...prev, [newId]: true }));
    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: newRec.topic,
        content: newRec.content,
        stationOrExit: newRec.stationOrExit
      })
    })
    .then(res => {
      if (res.ok) return res.json();
      throw new Error("Translation failed");
    })
    .then(data => {
      setTranslatedRecs(prev => {
        const updated = {
          ...prev,
          [newId]: {
            topic: data.topic,
            content: data.content,
            stationOrExit: data.stationOrExit
          }
        };
        localStorage.setItem('busan_traveler_recs_en', JSON.stringify(updated));
        return updated;
      });
    })
    .catch(err => {
      console.error("Instant translation failed:", err);
    })
    .finally(() => {
      setTranslatingIds(prev => ({ ...prev, [newId]: false }));
    });
  };

  const handleDeleteRecommendation = (id: string) => {
    // Delete from state immediately (Optimistic UI)
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
    setMyRecIds(prev => {
      const updated = prev.filter(item => item !== id);
      localStorage.setItem('busan_my_rec_ids', JSON.stringify(updated));
      return updated;
    });
    setDeleteConfId(null);

    // Call server to persist deletion
    fetch(`/api/recommendations/${id}`, {
      method: "DELETE"
    })
    .catch(err => {
      console.error("Failed to delete recommendation on server:", err);
    });
  };

  const handleUpvote = (id: string) => {
    const isUpvoting = !hasUpvoted[id];

    // Optimistic UI updates
    setHasUpvoted(prev => ({ ...prev, [id]: isUpvoting }));
    setRecommendations(prev => prev.map(rec => rec.id === id ? { ...rec, upvotes: Math.max(0, rec.upvotes + (isUpvoting ? 1 : -1)) } : rec));

    // Persist upvote count on server
    fetch(`/api/recommendations/${id}/upvote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ upvote: isUpvoting })
    })
    .then(res => {
      if (res.ok) return res.json();
      throw new Error("Upvote failed");
    })
    .then((updatedRec: TravelerRecommendation) => {
      // Re-synchronize with exact server count
      setRecommendations(prev => prev.map(rec => rec.id === id ? updatedRec : rec));
    })
    .catch(err => {
      console.error("Failed to update upvote on server:", err);
      // Rollback optimistic state transition
      setHasUpvoted(prev => ({ ...prev, [id]: !isUpvoting }));
      setRecommendations(prev => prev.map(rec => rec.id === id ? { ...rec, upvotes: Math.max(0, rec.upvotes + (isUpvoting ? -1 : 1)) } : rec));
    });
  };

  const toggleLanguage = () => {
    setLanguage(prev => {
      const idx = LANGUAGE_OPTIONS.findIndex(o => o.code === prev);
      const nextIdx = (idx + 1) % LANGUAGE_OPTIONS.length;
      return LANGUAGE_OPTIONS[nextIdx].code;
    });
  };

  const findNearestStepFreeExit = (lat: number, lng: number) => {
    const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const ky = 111132;
      const kx = Math.cos(lat1 * Math.PI / 180) * 111319;
      const dx = Math.abs(lon1 - lon2) * kx;
      const dy = Math.abs(lat1 - lat2) * ky;
      return Math.round(Math.sqrt(dx * dx + dy * dy));
    };

    const candidates: { station: Station; exit: ExitInfo; distance: number }[] = [];
    STATIONS.forEach(station => {
      station.exits.forEach(exit => {
        if (exit.hasElevator || exit.isAccessible) {
          const dist = getDistanceInMeters(lat, lng, exit.latitude, exit.longitude);
          candidates.push({ station, exit, distance: dist });
        }
      });
    });

    if (candidates.length > 0) {
      candidates.sort((a, b) => a.distance - b.distance);
      return candidates[0];
    }
    return null;
  };

  const requestNearbyGuide = () => {
    setGeoLoading(true);
    setGeoResult(null);

    const processPosition = (userLat: number, userLng: number, isSimulated: boolean) => {
      const nearest = findNearestStepFreeExit(userLat, userLng);
      if (nearest) {
        setSelectedStationId(nearest.station.id);
        
        const stationName = nearest.station.name;
        const exitNumber = nearest.exit.number;
        const distance = nearest.distance;
        
        setGeoResult({
          stationName,
          exitNumber,
          distance,
          details: '',
          lat: nearest.exit.latitude,
          lng: nearest.exit.longitude
        });

        // Smooth scroll to the Naver Map container
        setTimeout(() => {
          const mapEl = document.getElementById('station-map-container');
          if (mapEl) {
            mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 250);
      }
      setGeoLoading(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            processPosition(position.coords.latitude, position.coords.longitude, false);
          }, 800);
        },
        () => {
          // Simulation fallback for sandboxed iframe
          setTimeout(() => {
            // Seomyeon street fallback (near Judith Taehwa)
            const simulatedLat = 35.1584;
            const simulatedLng = 129.0595;
            processPosition(simulatedLat, simulatedLng, true);
          }, 800);
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      setTimeout(() => {
        const simulatedLat = 35.1584;
        const simulatedLng = 129.0595;
        processPosition(simulatedLat, simulatedLng, true);
      }, 800);
    }
  };

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    setSubmittingReport(true);

    setTimeout(() => {
      const selectedStation = STATIONS.find(s => s.id === reportStation);
      const newReport: FacilityReport = {
        id: `report-${Date.now()}`,
        stationId: reportStation,
        stationName: selectedStation ? selectedStation.name : '부산 지하철역',
        exitNumber: reportExit,
        facilityType: reportFacility,
        reportType: reportIssue,
        details: reportText,
        image: reportImage || undefined,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };

      setReports(prev => [newReport, ...prev]);
      setReportText('');
      setReportImage(null);
      setSubmittingReport(false);
      setReportSuccess(true);

      // Dismiss success alert automatically
      setTimeout(() => {
        setReportSuccess(false);
      }, 4000);
    }, 600);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get active station details based on selection or search
  const activeStation = STATIONS.find(s => s.id === selectedStationId) || STATIONS[0];

  const focusedExitCoords = (geoResult && activeStation.name === geoResult.stationName)
    ? { latitude: geoResult.lat, longitude: geoResult.lng }
    : null;

  // Helper for rendering status markers
  const getExitStatusText = (status: StatusType) => {
    switch(status) {
      case 'OPERATIONAL': 
        return language === 'KR' ? '운행 원활' : 'Normal';
      case 'MAINTENANCE': 
        return language === 'KR' ? '보수 점검' : 'Service';
      case 'BLOCKED': 
        return language === 'KR' ? '계단 진입만' : 'Stairs Only';
    }
  };



  // Filter exits of station by Stroller vs Carrier vs All
  const getFilteredExits = (station: Station) => {
    return station.exits.filter(exit => {
      if (activePathFilter === 'ACCESSIBLE') {
        return exit.hasElevator && exit.isAccessible;
      }
      if (activePathFilter === 'CARRY') {
        return exit.hasElevator || exit.hasEscalator;
      }
      return true;
    });
  };

  const adParams: AdEligibilityParams = {
    currentTab,
    tipsSubPage,
    siteSubPage,
    showPrivacyModal,
    showTermsModal,
    submittingReport,
    reportSuccess,
    geoLoading,
    isAdminMode,
    searchQuery
  };

  const handleMainTabSelect = (tab: string) => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const validTabs = ['home', 'search', 'transit', 'courses', 'schedule', 'exploration', 'about', 'tourapi', 'tips'];
    const targetTab = validTabs.includes(tab) ? tab : 'home';
    setCurrentTab(targetTab);

    if (targetTab === 'home') {
      setIsHomeLanding(true);
      setSelectedStationId('seomyeon');
      setExpandedExitNum(null);
    } else if (targetTab === 'search') {
      setIsHomeLanding(false);
      setSearchViewMode('INDEX');
      setExpandedExitNum(null);
      setSearchQuery('');
    } else {
      setIsHomeLanding(false);
    }

    if (targetTab === 'transit') {
      setSelectedItineraryCategory(null);
      setTipsSubPage('transit');
      setActiveRegionPage(null);
      setBarrierFreePlaceId(null);
      setBarrierFreeCourseId(null);
      navigateToSpa('/tips/transit', { tab: 'transit', subPage: 'transit' });
    } else if (targetTab === 'courses') {
      setSelectedItineraryCategory(null);
      setTipsSubPage('courses');
      setActiveRegionPage(null);
      setBarrierFreePlaceId(null);
      setBarrierFreeCourseId(null);
      navigateToSpa('/tips/courses', { tab: 'courses', subPage: 'courses', category: null });
    } else if (targetTab === 'schedule') {
      setSelectedItineraryCategory(null);
      setTipsSubPage('schedule');
      setActiveRegionPage(null);
      setBarrierFreePlaceId(null);
      setBarrierFreeCourseId(null);
      navigateToSpa('/schedule', { tab: 'schedule', subPage: 'schedule' });
    } else if (targetTab === 'exploration') {
      setSelectedItineraryCategory(null);
      setTipsSubPage('exploration');
      setExplorationItemId(null);
      setActiveRegionPage(null);
      setBarrierFreePlaceId(null);
      setBarrierFreeCourseId(null);
      navigateToSpa('/tips/exploration', { tab: 'exploration', subPage: 'exploration' });
    } else if (targetTab === 'tips') {
      setSelectedItineraryCategory(null);
      setTipsSubPage('courses');
      setActiveRegionPage(null);
      setBarrierFreePlaceId(null);
      setBarrierFreeCourseId(null);
    } else if (targetTab === 'about') {
      setSiteSubPage('about');
      navigateToSpa('/about', { tab: 'about' });
    } else if (targetTab === 'tourapi') {
      setSelectedItineraryCategory('BARRIER_FREE');
      setBarrierFreePlaceId(null);
      setBarrierFreeCourseId(null);
      navigateToSpa('/barrier-free');
    } else {
      setBarrierFreePlaceId(null);
      setBarrierFreeCourseId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#11161B] font-sans antialiased flex flex-col">
      <div>
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-[#11161B] text-white border border-slate-700/80 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fade-in transition-all">
            <span className="text-xl shrink-0">🛠️</span>
            <span className="text-xs sm:text-sm font-semibold tracking-tight">{toastMessage}</span>
          </div>
        )}

        {/* Navigation Header */}
        <Header 
          currentTab={currentTab} 
          tipsSubPage={tipsSubPage}
          setCurrentTab={(tab) => handleMainTabSelect(tab)} 
          language={language} 
          toggleLanguage={toggleLanguage} 
          onSelectLanguage={(lang) => setLanguage(lang)} 
          onToggleAdminMode={toggleAdminMode}
          isAdminMode={isAdminMode}
        />

        {/* Core Main Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-0 sm:pt-6 sm:pb-0 animate-fade-in">
          
          {/* Tab 1: HOME LANDING VIEW */}
          {(visitedTabs['home'] || currentTab === 'home') && (
            <div className={currentTab === 'home' ? 'space-y-4' : 'hidden'}>
              {/* Feature Hero banner removed as requested */}
              {isHomeLanding && (
                <>
                  {/* Dynamic Geolocation Finder Outcome Panel */}
                  {geoResult && (
                    <div className="bg-sky-50 border border-sky-100 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-left shadow-sm animate-fade-in" id="geo-result-container">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-sky-200/50 text-[#F06A00] rounded-2xl shrink-0 mt-1">
                          <MapPin className="w-6 h-6 fill-sky-200" />
                        </div>
                        <div>
                          <h4 className="text-xl font-extrabold font-heading text-slate-800">
                            {getExitDisplayName(geoResult.stationName, geoResult.exitNumber, language)}
                          </h4>
                          <p className="text-sm font-bold text-[#F06A00] mt-1">
                            {language === 'KR' 
                              ? `현재 위치에서 도보 약 ${geoResult.distance}m` 
                              : `Approx. ${geoResult.distance}m Away on Foot`}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center md:self-center self-end mt-2 md:mt-0">
                        <button
                          onClick={() => window.open(`https://map.naver.com/v5/search/${geoResult.stationName} ${geoResult.exitNumber}`)}
                          className="text-xs font-bold text-[#F06A00] bg-orange-50 hover:bg-orange-100/80 border border-orange-200/40 px-5 py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                        >
                          {language === 'KR' ? '네이버 지도 도보 길안내 시작' : 'Launch Naver Map Guide'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Home Overview Section */}
                  <HomeOverviewSection 
                    language={language}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSelectStation={(stId) => {
                      setSelectedStationId(stId);
                      setSearchViewMode('DETAIL');
                      setCurrentTab('search');
                      setIsHomeLanding(false);
                      navigateToSpa(`/station/${stId}`, { tab: 'search', stationId: stId });
                      try {
                        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                      } catch (e) {
                        window.scrollTo(0, 0);
                      }
                    }}
                    onNavigateToSearch={(q) => {
                      const queryToUse = q !== undefined ? q : searchQuery;
                      if (q !== undefined) {
                        setSearchQuery(q);
                      }
                      if (queryToUse && queryToUse.trim().length > 0) {
                        const matches = searchStations(queryToUse, STATIONS);
                        if (matches.length > 0) {
                          setSelectedStationId(matches[0].station.id);
                          setSearchViewMode('DETAIL');
                          if (matches[0].matchedExit) {
                            setExpandedExitNum(matches[0].matchedExit);
                          }
                        }
                      }
                      setCurrentTab('search');
                      setIsHomeLanding(false);
                      setTimeout(() => {
                        const targetEl = document.getElementById('search-station-detail-top') || document.getElementById('search-tab-map-container');
                        if (targetEl) {
                          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } else {
                          window.scrollTo(0, 0);
                        }
                      }, 100);
                    }}
                    onNavigateToReport={() => {
                      setCurrentTab('about');
                      navigateToSpa('/about', { tab: 'about' });
                    }}
                    onNavigateToAbout={() => {
                      setCurrentTab('about');
                      setSiteSubPage('about');
                      navigateToSpa('/about', { tab: 'about' });
                      window.scrollTo(0, 0);
                    }}
                    onNavigateToNearby={() => {
                      requestNearbyGuide();
                    }}
                    onNavigateToItinerary={(category) => {
                      if (category) {
                        setSelectedItineraryCategory(category);
                      }
                      setCurrentTab('courses');
                      setTipsSubPage('courses');
                      const catSlug = category ? categoryToUrlSlug(category) : '';
                      navigateToSpa(catSlug ? `/tips/courses/${catSlug}` : '/tips/courses', { tab: 'courses', subPage: 'courses', category: category || null });
                      try {
                        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                      } catch (e) {
                        window.scrollTo(0, 0);
                      }
                    }}
                    onNavigateToGuide={(subPage) => {
                      setIsHomeLanding(false);
                      if (subPage === 'barrier-free') {
                        setCurrentTab('tourapi');
                        setSelectedItineraryCategory('BARRIER_FREE');
                        navigateToSpa('/barrier-free', { tab: 'tourapi' });
                      } else if (subPage === 'schedule') {
                        setCurrentTab('schedule');
                        setTipsSubPage('schedule');
                        navigateToSpa('/schedule', { tab: 'schedule', subPage: 'schedule' });
                      } else if (subPage === 'exploration') {
                        setCurrentTab('exploration');
                        setTipsSubPage('exploration');
                        navigateToSpa('/tips/exploration', { tab: 'exploration', subPage: 'exploration' });
                      } else {
                        setCurrentTab('transit');
                        setTipsSubPage(subPage);
                        navigateToSpa(`/tips/${subPage}`, { tab: 'transit', subPage });
                      }
                      window.scrollTo(0, 0);
                    }}
                  />
                </>
              )}

            </div>
          )}

          {/* Tab 2: SEARCH / BENTO GRID VIEW */}
          {(visitedTabs['search'] || currentTab === 'search') && (
            <div className={currentTab === 'search' ? 'space-y-8 text-left' : 'hidden'}>
              {searchViewMode === 'INDEX' ? (
                /* === 전용 서치 허브 페이지 (검색창 + 원하는 지하철역 선택 박스만 노출) === */
                <div className="space-y-8 animate-fadeIn">
                  {/* Search Header */}
                  <div>
                    <h2 className="text-2xl font-extrabold font-heading text-slate-800">
                      {pickLang(language, {
                        KR: '부산 지하철역 출구 정보 둘러보기',
                        EN: 'Subway Exit Information Index',
                        JA: '釜山地下鉄 駅・出口バリアフリー案内',
                        ZH_TW: '釜山地鐵站出口無障礙資訊總覽',
                        ZH_CN: '釜山地铁站出口无障碍信息总览'
                      })}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {pickLang(language, {
                        KR: '부산 핵심 주요역의 총 엘리베이터 수, 에스컬레이터 대수를 한눈에 비교하고 탐색해보세요.',
                        EN: 'Analyze general escalators, elevator configurations across major transit sectors.',
                        JA: '釜山の主要22駅のエレベーター・エスカレーター・段差なし出口情報をひと目で比較・検索できます。',
                        ZH_TW: '一目了然比較並搜尋釜山 22 個主要地鐵站的電梯、電扶梯與無階梯出口資訊。',
                        ZH_CN: '一目了然比较并搜索釜山 22 个主要地铁站的直梯、扶梯与无台阶出口信息。'
                      })}
                    </p>

                    {/* Search Bar Input */}
                    <div className="mt-6 max-w-xl">
                      <StationSearchBar
                        language={language}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onSelectStation={(stId, matchedExit) => {
                          setSelectedStationId(stId);
                          if (matchedExit) {
                            setExpandedExitNum(matchedExit);
                          } else {
                            setExpandedExitNum(null);
                          }
                          setSearchViewMode('DETAIL');
                          setCurrentTab('search');
                          setIsHomeLanding(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        onNavigateToSearch={(q) => {
                          if (q !== undefined) {
                            setSearchQuery(q);
                          }
                          const queryToUse = q !== undefined ? q : searchQuery;
                          if (queryToUse && queryToUse.trim().length > 0) {
                            const matches = searchStations(queryToUse, STATIONS);
                            if (matches.length > 0) {
                              setSelectedStationId(matches[0].station.id);
                              if (matches[0].matchedExit) {
                                setExpandedExitNum(matches[0].matchedExit);
                              }
                              setSearchViewMode('DETAIL');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }
                          setCurrentTab('search');
                          setIsHomeLanding(false);
                        }}
                      />
                    </div>
                  </div>

                  {/* 원하는 지하철역 선택 박스 */}
                  <div id="search-selected-station-details" className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0"></span>
                      <span className="text-base leading-none">📍</span>
                      <h3 className="text-base sm:text-lg font-bold font-heading text-slate-800">
                        {pickLang(language, {
                          KR: '원하는 지하철역 선택',
                          EN: 'Select Subway Station',
                          JA: '地下鉄駅を選択',
                          ZH_TW: '選擇地鐵站',
                          ZH_CN: '选择地铁站'
                        })}
                      </h3>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-1.5 sm:gap-3">
                      {STATIONS.map((st) => {
                        const lineStr = st.lines.map(l => formatLineLabelI18n(l, language)).join('·');
                        const translatedName = getTranslatedStationName(st.name, language);
                        const mobileTitleClass =
                          translatedName.length > 13
                            ? 'text-[10px] sm:text-base leading-tight'
                            : translatedName.length > 8
                            ? 'text-[11px] sm:text-base leading-tight'
                            : 'text-xs sm:text-base leading-snug';
                        return (
                          <a
                            key={st.id}
                            href={`/station/${st.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedStationId(st.id);
                              setExpandedExitNum(null);
                              setSearchViewMode('DETAIL');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-1.5 py-2 sm:p-3 rounded-xl sm:rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-center items-center gap-0.5 active:scale-95 bg-white border-slate-300 hover:border-[#8EA85E] hover:bg-slate-50 text-slate-800 shadow-2xs hover:shadow-xs group min-w-0"
                          >
                            <span className={`font-bold ${mobileTitleClass} font-heading text-slate-800 group-hover:text-[#8EA85E] transition-colors break-keep w-full`}>
                              {translatedName}
                            </span>
                            <div className="text-[10px] sm:text-xs font-semibold inline-flex items-center justify-center flex-wrap gap-0.5 leading-tight">
                              {lineStr.split('·').map((part, idx) => {
                                let colorClass = 'text-blue-600 font-bold';
                                if (part.includes('1')) {
                                  colorClass = 'text-orange-600 font-bold';
                                } else if (part.includes('2')) {
                                  colorClass = 'text-emerald-600 font-bold';
                                } else if (part.includes('3')) {
                                  colorClass = 'text-amber-700 font-bold';
                                } else if (part.includes('동해')) {
                                  colorClass = 'text-sky-600 font-bold';
                                } else if (part.includes('김해')) {
                                  colorClass = 'text-purple-600 font-bold';
                                }

                                return (
                                  <React.Fragment key={idx}>
                                    {idx > 0 && (
                                      <span className="text-slate-300 font-normal">·</span>
                                    )}
                                    <span className={colorClass}>{part}</span>
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* === 지하철역 개별 상세 페이지 (DETAIL) === */
                <div className="space-y-8 animate-fadeIn">
                  {/* 상단 뒤로가기 바 & 빠른 역 검색 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchViewMode('INDEX');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 font-bold text-sm shadow-2xs transition-all cursor-pointer group w-fit active:scale-95"
                    >
                      <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-1 transition-transform" />
                      <span>{pickLang(language, { KR: '다른 지하철역 검색하기 (목록)', EN: 'Back to Station Search', JA: '他の地下鉄駅を検索（一覧へ）', ZH_TW: '搜尋其他地鐵站（返回列表）', ZH_CN: '搜索其他地铁站（返回列表）' })}</span>
                    </button>

                    <div className="w-full sm:w-72">
                      <StationSearchBar
                        language={language}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        placeholder={pickLang(language, { KR: '다른 역/출구 빠른 검색...', EN: 'Search station/exit...', JA: '他の駅・出口を検索...', ZH_TW: '快速搜尋其他車站／出口...', ZH_CN: '快速搜索其他车站／出口...' })}
                        onSelectStation={(stId, matchedExit) => {
                          setSelectedStationId(stId);
                          if (matchedExit) {
                            setExpandedExitNum(matchedExit);
                          } else {
                            setExpandedExitNum(null);
                          }
                          setSearchViewMode('DETAIL');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        onNavigateToSearch={(q) => {
                          if (q !== undefined) {
                            setSearchQuery(q);
                          }
                          const queryToUse = q !== undefined ? q : searchQuery;
                          if (queryToUse && queryToUse.trim().length > 0) {
                            const matches = searchStations(queryToUse, STATIONS);
                            if (matches.length > 0) {
                              setSelectedStationId(matches[0].station.id);
                              if (matches[0].matchedExit) {
                                setExpandedExitNum(matches[0].matchedExit);
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Station Map directly below back button */}
                  <div id="search-station-detail-top" className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <Suspense fallback={<div className="h-64 sm:h-96 flex items-center justify-center bg-slate-50 text-slate-400 font-bold text-sm">지도를 불러오는 중...</div>}>
                      <SubwayStationMap station={activeStation} language={language} focusedExitCoords={focusedExitCoords} isAdminMode={isAdminMode} />
                    </Suspense>
                  </div>

                  {/* 📋 Station Barrier-Free Movement Summary Table & Step-by-Step Info */}
                  <Suspense fallback={<div className="h-40 flex items-center justify-center bg-slate-50 rounded-3xl text-slate-400 font-bold text-sm">출구 및 편의시설 정보를 불러오는 중...</div>}>
                    <StationBarrierFreeCard station={activeStation} language={language} />
                  </Suspense>

              {/* Station Selection Banner (페이지 가장 아랫쪽으로 배치) */}
              <div id="search-selected-station-details" className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0"></span>
                  <span className="text-base leading-none">📍</span>
                  <h3 className="text-base sm:text-lg font-bold font-heading text-slate-800">
                    {pickLang(language, {
                      KR: '원하는 지하철역 선택',
                      EN: 'Select Subway Station',
                      JA: '地下鉄駅を選択',
                      ZH_TW: '選擇地鐵站',
                      ZH_CN: '选择地铁站'
                    })}
                  </h3>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-1.5 sm:gap-3">
                  {STATIONS.map((st) => {
                    const lineStr = st.lines.map(l => formatLineLabelI18n(l, language)).join('·');
                    const isSelected = selectedStationId === st.id;
                    const translatedName = getTranslatedStationName(st.name, language);
                    const mobileTitleClass =
                      translatedName.length > 13
                        ? 'text-[10px] sm:text-base leading-tight'
                        : translatedName.length > 8
                        ? 'text-[11px] sm:text-base leading-tight'
                        : 'text-xs sm:text-base leading-snug';
                    return (
                      <a
                        key={st.id}
                        href={`/search/${st.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedStationId(st.id);
                          setExpandedExitNum(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`px-1.5 py-2 sm:p-3 rounded-xl sm:rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-center items-center gap-0.5 active:scale-95 min-w-0 ${
                          isSelected
                            ? 'bg-[#8EA85E] border-[#8EA85E] text-white shadow-sm ring-2 ring-[#8EA85E]/20'
                            : 'bg-white border-slate-300 hover:border-[#8EA85E] hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <span className={`font-bold ${mobileTitleClass} font-heading break-keep w-full ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                          {translatedName}
                        </span>
                        <div className="text-[10px] sm:text-xs font-semibold inline-flex items-center justify-center flex-wrap gap-0.5 leading-tight">
                          {lineStr.split('·').map((part, idx) => {
                            let colorClass = isSelected ? 'text-white/90 font-bold' : 'text-blue-600 font-bold';
                            if (part.includes('1')) {
                              colorClass = isSelected ? 'text-amber-200 font-bold' : 'text-orange-600 font-bold';
                            } else if (part.includes('2')) {
                              colorClass = isSelected ? 'text-emerald-100 font-bold' : 'text-emerald-600 font-bold';
                            } else if (part.includes('3')) {
                              colorClass = isSelected ? 'text-amber-100 font-bold' : 'text-amber-700 font-bold';
                            } else if (part.includes('동해')) {
                              colorClass = isSelected ? 'text-sky-100 font-bold' : 'text-sky-600 font-bold';
                            } else if (part.includes('김해')) {
                              colorClass = isSelected ? 'text-purple-100 font-bold' : 'text-purple-600 font-bold';
                            }

                            return (
                              <React.Fragment key={idx}>
                                {idx > 0 && (
                                  <span className={isSelected ? 'text-white/60 font-normal' : 'text-slate-300 font-normal'}>·</span>
                                )}
                                <span className={colorClass}>{part}</span>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

          {/* Tab 3 & 4: TRAVEL TIPS & BUSAN MAJOR SCHEDULE VIEW & BARRIER FREE */}
          {(visitedTabs['tips'] || visitedTabs['schedule'] || visitedTabs['tourapi'] || visitedTabs['transit'] || visitedTabs['courses'] || visitedTabs['exploration'] || ['tips', 'schedule', 'tourapi', 'transit', 'courses', 'exploration'].includes(currentTab)) && (
            <div className={['tips', 'schedule', 'tourapi', 'transit', 'courses', 'exploration'].includes(currentTab) ? ((currentTab === 'tips' && tipsSubPage === 'index') || currentTab === 'schedule' ? 'space-y-1 sm:space-y-2' : 'space-y-6') : 'hidden'}>
              <Suspense fallback={<TabLoadingFallback text={language === 'KR' ? "여행 루트 및 추천 코스를 불러오는 중..." : "Loading travel routes and courses..."} />}>
                <BusanItinerariesView 
                  language={language}
                  initialCategory={currentTab === 'tourapi' ? 'BARRIER_FREE' : (selectedItineraryCategory as any)}
                  initialBarrierFreeCourseId={barrierFreeCourseId}
                  initialBarrierFreePlaceId={barrierFreePlaceId}
                  onBack={() => {
                    setSelectedItineraryCategory(null);
                    setBarrierFreeCourseId(null);
                    setBarrierFreePlaceId(null);
                    setExplorationItemId(null);
                    setTipsSubPage('index');
                    if (currentTab === 'schedule' || currentTab === 'tourapi' || currentTab === 'transit' || currentTab === 'exploration') {
                      setCurrentTab('courses');
                    }
                    navigateToSpa('/tips', { tab: 'tips', subPage: 'index', category: null });
                  }}
                  onSelectCategory={(category) => {
                    setSelectedItineraryCategory(category);
                    setBarrierFreeCourseId(null);
                    setBarrierFreePlaceId(null);
                    if (category === 'BARRIER_FREE') {
                      setCurrentTab('tourapi');
                      navigateToSpa('/barrier-free', { tab: 'tourapi' });
                    } else if (category) {
                      const catSlug = categoryToUrlSlug(category);
                      navigateToSpa(`/tips/courses/${catSlug}`, { tab: 'tips', subPage: 'courses', category });
                    } else {
                      if (tipsSubPage === 'courses') {
                        navigateToSpa('/tips/courses', { tab: 'tips', subPage: 'courses', category: null });
                      } else {
                        navigateToSpa('/tips', { tab: 'tips', subPage: 'index', category: null });
                      }
                    }
                  }}
                  onOpenBarrierFreeDetail={(placeId) => {
                    setBarrierFreePlaceId(placeId);
                    setBarrierFreeCourseId(null);
                    setCurrentTab('tourapi');
                    setSelectedItineraryCategory('BARRIER_FREE');
                    const targetUrl = `/barrier-free/detail?id=${encodeURIComponent(placeId)}`;
                    navigateToSpa(targetUrl, { tab: 'tourapi', placeId });
                  }}
                  onBackToBarrierFreeList={() => {
                    setBarrierFreePlaceId(null);
                    setBarrierFreeCourseId(null);
                    setCurrentTab('tourapi');
                    setSelectedItineraryCategory('BARRIER_FREE');
                    navigateToSpa('/barrier-free', { tab: 'tourapi' });
                  }}
                  tipsSubPage={
                    currentTab === 'schedule' ? 'schedule' :
                    currentTab === 'transit' ? (['transit', 'child-free', 'bus-qr', 'taxi', 'transfer'].includes(tipsSubPage) ? tipsSubPage : 'transit') :
                    currentTab === 'courses' ? 'courses' :
                    currentTab === 'exploration' ? 'exploration' :
                    tipsSubPage
                  }
                  initialExplorationItemId={explorationItemId}
                  onSelectExplorationItem={setExplorationItemId}
                  setTipsSubPage={(page) => {
                    if (page === 'schedule') {
                      setCurrentTab('schedule');
                    } else if (currentTab === 'schedule') {
                      setCurrentTab('tips');
                    }
                    if (page === 'index' || page === 'courses') {
                      setSelectedItineraryCategory(null);
                      setBarrierFreeCourseId(null);
                      setBarrierFreePlaceId(null);
                      if (currentTab === 'tourapi') {
                        setCurrentTab('tips');
                      }
                    }
                    setTipsSubPage(page);
                    if (page === 'index') {
                      navigateToSpa('/tips', { tab: 'tips', subPage: 'index', category: null });
                    } else if (page === 'courses') {
                      navigateToSpa('/tips/courses', { tab: 'tips', subPage: 'courses', category: null });
                    } else if (page === 'transit') {
                      navigateToSpa('/tips/transit', { tab: 'tips', subPage: 'transit' });
                    } else if (page === 'schedule') {
                      navigateToSpa('/schedule', { tab: 'schedule', subPage: 'schedule' });
                    } else if (page === 'child-free') {
                      navigateToSpa('/tips/child-free', { tab: 'tips', subPage: 'child-free' });
                    } else if (page === 'bus-qr') {
                      navigateToSpa('/tips/bus-qr', { tab: 'tips', subPage: 'bus-qr' });
                    } else if (page === 'taxi') {
                      navigateToSpa('/tips/taxi', { tab: 'tips', subPage: 'taxi' });
                    } else if (page === 'exploration') {
                      setExplorationItemId(null);
                      navigateToSpa('/tips/exploration', { tab: 'tips', subPage: 'exploration' });
                    }
                  }}
                  activeRegionPage={activeRegionPage}
                  setActiveRegionPage={setActiveRegionPage}
                  onSelectStation={(stationId, exitNum) => {
                    setSelectedStationId(stationId);
                    if (exitNum) {
                      setExpandedExitNum(exitNum);
                    }
                    setSearchViewMode('DETAIL');
                    setCurrentTab('search');
                    setIsHomeLanding(false);
                    setTimeout(() => {
                      const targetEl = document.getElementById('search-station-detail-top') || document.getElementById('search-tab-map-container');
                      if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      } else {
                        window.scrollTo(0, 0);
                      }
                    }, 100);
                  }}
                />
                {/* 🎟️ Busan Travel Pass & Hands-Free Luggage Delivery Quick Booking */}
                {currentTab !== 'schedule' &&
                  currentTab !== 'exploration' &&
                  tipsSubPage !== 'schedule' &&
                  tipsSubPage !== 'exploration' && (
                    <BusanAffiliateQuickBar
                      language={language}
                      variant={
                        currentTab === 'transit' ||
                        (currentTab === 'tips' && ['transit', 'child-free', 'bus-qr', 'taxi', 'transfer'].includes(tipsSubPage))
                          ? 'luggage-only'
                          : 'full'
                      }
                    />
                  )}
                {/* Google AdSense Unit rendered strictly INSIDE Suspense so it never fires on loading screens */}
                {(currentTab !== 'tips' || tipsSubPage !== 'index') && currentTab !== 'schedule' && (
                  <AdSenseUnit currentParams={adParams} />
                )}
              </Suspense>
            </div>
          )}

          {/* New Tab 5: ABOUT THE SITE */}
          {(visitedTabs['about'] || currentTab === 'about') && (
            <div className={currentTab === 'about' ? '' : 'hidden'}>
              <Suspense fallback={<TabLoadingFallback text={language === 'KR' ? "사이트 소개 페이지를 불러오는 중..." : "Loading about page..."} />}>
                <SiteIntroductionView 
                  language={language} 
                  initialPage={siteSubPage}
                  onSubTabChange={(sub) => setSiteSubPage(sub)}
                />
                {siteSubPage === 'about' && (
                  <AdSenseUnit currentParams={adParams} />
                )}
              </Suspense>
            </div>
          )}


        </main>
      </div>

      {/* Footer information section */}
      <footer className="mt-2 bg-[#8EA85E]/15 backdrop-blur-md text-slate-700 text-left border-t border-[#8EA85E]/30 pt-6 sm:pt-7 pb-10 sm:pb-12 md:pb-14 rounded-t-[2rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3" translate="no" data-no-localize="true">
              <div className="flex flex-col text-left leading-[0.92]">
                <span className="text-base font-black font-heading tracking-tight text-slate-900">
                  STEPLESS
                </span>
                <span className="text-base font-black font-heading tracking-tight text-slate-900">
                  IN BUSAN
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-sm font-medium">
              {language === 'KR' 
                ? '계단 없는 안전한 이동 경로와 로컬 팁을 전하는 부산 무장애 지하철 가이드.' 
                : 'Step-free transit exits and curated local travel tips for Busan.'}
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {language === 'KR' ? '관련 서비스 & 커뮤니티' : 'Agencies & Community'}
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="https://www.humetro.busan.kr" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-[#728b43] hover:underline flex items-center gap-1 transition-colors">
                  <span>부산교통공사 (Humetro)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.reddit.com/r/BusanTravelTips/" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 font-bold text-[#ff4500]">
                  <span>{language === 'KR' ? '레딧 커뮤니티 (Reddit)' : 'Reddit Community'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.data.go.kr" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-[#728b43] hover:underline flex items-center gap-1 transition-colors">
                  <span>공공데이터포털 연계</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.visitbusan.net" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-[#728b43] hover:underline flex items-center gap-1 transition-colors">
                  <span>비짓부산 배리어프리 투어</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading text-left flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#8EA85E]" />
              <span>{language === 'KR' ? '운영자 정보 및 제휴 문의' : 'Operator & Inquiries'}</span>
            </h4>
            <div className="text-xs font-sans text-slate-700 space-y-0.5">
              <p>운영: <strong className="text-slate-900">스텝레스 (Stepless)</strong> · 총괄: <strong className="text-slate-900">플로레르 (Floreur)</strong></p>
            </div>
            <p className="text-xs font-sans text-slate-600 leading-relaxed">
              {language === 'KR' 
                ? '데이터 오류 제보 및 제휴 문의는 언제든 편하게 연락해 주세요.' 
                : 'For comments or suggesting accessibility paths, contact the support team.'}
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="/about/contact"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentTab('about');
                  setSiteSubPage('contact');
                  navigateToSpa('/about/contact', { tab: 'about', subPage: 'contact' });
                  window.scrollTo(0, 0);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#8EA85E] hover:bg-[#7b944f] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs no-underline inline-flex items-center"
              >
                ✉️ {language === 'KR' ? '문의 보내기' : 'Contact Us'}
              </a>
              <a
                href="mailto:floreur88@gmail.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-800 font-mono text-xs font-bold transition-colors border border-[#8EA85E]/30 shadow-2xs backdrop-blur-sm"
              >
                <span>📧 floreur88@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* AdSense & Cookie Privacy Policy Notice */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-4 border-t border-[#8EA85E]/20">
          <p className="text-2xs sm:text-xs text-slate-600 leading-relaxed font-sans text-left">
            📢 <strong>안내:</strong> 구글 맞춤형 광고 및 쿠키 설정 안내는 <a href="/about/privacy" onClick={(e) => { e.preventDefault(); setCurrentTab('about'); setSiteSubPage('privacy'); navigateToSpa('/about/privacy', { tab: 'about', subPage: 'privacy' }); window.scrollTo(0, 0); }} className="text-[#6C8540] hover:text-[#526630] underline font-bold cursor-pointer">개인정보처리방침</a>에서 확인하실 수 있습니다.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#8EA85E]/20 mt-4 pt-4 text-xs text-slate-600 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="font-semibold text-slate-600">© 2026 floreur (스텝레스). All rights reserved.</span>
          
          {/* Prominent Legal Links Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center sm:justify-end">
            <a 
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                setCurrentTab('about');
                setSiteSubPage('about');
                navigateToSpa('/about', { tab: 'about', subPage: 'about' });
                window.scrollTo(0, 0);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white hover:text-[#8EA85E] border border-[#8EA85E]/30 text-slate-700 font-bold text-xs transition-colors shadow-2xs backdrop-blur-sm cursor-pointer no-underline"
            >
              {language === 'KR' ? '👤 운영자 소개' : 'Operator'}
            </a>
            <a 
              href="/about/contact"
              onClick={(e) => {
                e.preventDefault();
                setCurrentTab('about');
                setSiteSubPage('contact');
                navigateToSpa('/about/contact', { tab: 'about', subPage: 'contact' });
                window.scrollTo(0, 0);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white hover:text-[#8EA85E] border border-[#8EA85E]/30 text-slate-700 font-bold text-xs transition-colors shadow-2xs backdrop-blur-sm cursor-pointer no-underline"
            >
              {language === 'KR' ? '✉️ 정보 오류 요청 제보 및 문의' : 'Inquiries & Edits'}
            </a>
            <a 
              href="/about/privacy"
              onClick={(e) => {
                e.preventDefault();
                setCurrentTab('about');
                setSiteSubPage('privacy');
                navigateToSpa('/about/privacy', { tab: 'about', subPage: 'privacy' });
                window.scrollTo(0, 0);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white hover:text-[#8EA85E] border border-[#8EA85E]/30 text-slate-700 font-bold text-xs transition-colors shadow-2xs backdrop-blur-sm cursor-pointer no-underline"
            >
              {language === 'KR' ? '🔒 개인정보처리방침' : 'Privacy'}
            </a>
            <a 
              href="/about/terms"
              onClick={(e) => {
                e.preventDefault();
                setCurrentTab('about');
                setSiteSubPage('terms');
                navigateToSpa('/about/terms', { tab: 'about', subPage: 'terms' });
                window.scrollTo(0, 0);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white hover:text-[#8EA85E] border border-[#8EA85E]/30 text-slate-700 font-bold text-xs transition-colors shadow-2xs backdrop-blur-sm cursor-pointer no-underline"
            >
              {language === 'KR' ? '📄 이용약관' : 'Terms'}
            </a>
            <a 
              href="/about/data-source"
              onClick={(e) => {
                e.preventDefault();
                setCurrentTab('about');
                setSiteSubPage('data-source');
                navigateToSpa('/about/data-source', { tab: 'about', subPage: 'data-source' });
                window.scrollTo(0, 0);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white hover:text-[#8EA85E] border border-[#8EA85E]/30 text-slate-700 font-bold text-xs transition-colors shadow-2xs backdrop-blur-sm cursor-pointer no-underline"
            >
              {language === 'KR' ? '📊 데이터 출처' : 'Data Sources'}
            </a>
            <a 
              href="https://www.reddit.com/r/BusanTravelTips/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white hover:text-orange-600 border border-[#8EA85E]/30 text-slate-700 font-bold text-xs transition-colors shadow-2xs backdrop-blur-sm cursor-pointer inline-flex items-center gap-1"
            >
              <span>{language === 'KR' ? '레딧 커뮤니티' : 'Reddit'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in google-anno-skip" data-ad-exclude="true">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] animate-slide-up">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 font-heading">
                {language === 'KR' ? '📄 Stepless 서비스 이용약관' : '📄 Stepless Terms of Service'}
              </h3>
              <button 
                onClick={() => setShowTermsModal(false)}
                className="p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto text-left text-xs sm:text-sm text-slate-600 space-y-4">
              <p className="font-semibold text-slate-700">
                {language === 'KR' 
                  ? '본 약관은 Stepless(이하 "서비스")가 제공하는 부산 지하철 편리한 교통 경로 안내 서비스의 이용에 관한 조건 및 규정을 양 당사자 계약의 일환으로 정의합니다.' 
                  : 'This agreement governs your use of the Stepless easy-access transit pathways search engine and traveler guidelines.'}
              </p>

              <div>
                <h4 className="font-bold text-slate-850 text-sm mb-1">{language === 'KR' ? '제 1 조 (목적)' : 'Article 1 (Purpose)'}</h4>
                <p>
                  {language === 'KR' 
                    ? '본 서비스는 휠체어 이용자, 유모차 소지 보행자, 무거운 수하물(캐리어) 동반 관광객 등 이동약자 편의 경로를 제공하고 실증적 통로를 보존하는 공익적 안내 솔루션 제공을 목적으로 합니다.' 
                    : 'The service assists travelers of reduced mobility (including wheelchair, stroller, or bulky luggage holders) finding flat elevators/escalators.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-850 text-sm mb-1">{language === 'KR' ? '제 2 조 (정보 정합성의 면책성)' : 'Article 2 (Limitation of Liability)'}</h4>
                <p>
                  {language === 'KR'
                    ? '1. 본 플랫폼 내 노출되는 출구 정보, 엘리베이터 위치 정보, 및 편의시설 가동 상태는 공공데이터 자원 및 사용자 제보 항목을 상시 수동 정제한 결과물입니다. 실시간 기계 고장, 기상 악화, 또는 역사 보수 계획에 의한 일시중단 등 사정에 따라 현지와 일부 불일치 및 오차가 존재할 수 있으며 당사는 이에 대하여 법적 완전성을 보증하지 아니합니다.'
                    : '1. All accessibility statuses, lifts layout and geolocation marks are maintained based on general transit open-data and crowd-sourced validation. Physical or temporal differences can occur due to unannounced machine malfunctions or repair cycles.'}
                </p>
                <p className="mt-1">
                  {language === 'KR'
                    ? '2. 보행 및 횡단보도 이용 시 반드시 실제 거리 신호등의 안내 및 육안 확인 결과에 따르시길 바라며, 현장 사고와 관련된 물적·인적 귀책 사유를 전면 배제합니다.'
                    : '2. Pedestrians must prioritize local street signals and real-world conditions over navigation suggestions. Stepless disclaims all damages associated with physical incidents.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-850 text-sm mb-1">{language === 'KR' ? '제 3 조 (이용자의 권리와 의무)' : 'Article 3 (Visitor Reports)'}</h4>
                <p>
                  {language === 'KR'
                    ? '이용자는 맵 상 시설에 관한 의견을 자유롭게 제보할 수 있습니다. 다만, 악의적인 가짜 고장 신고, 특정 단체를 비방하는 내용을 리포트 란에 상습 도배 시에는 계정 차단 및 관련 정보가 사법 당국에 백업될 수 있음에 유의하십시오.'
                    : 'Users agree to file authentic information only. Fraudulent reports or spam will lead to instant termination of access.'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowTermsModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer shadow-sm transition-colors"
              >
                {language === 'KR' ? '동의 및 닫기' : 'Acknowledge & Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in google-anno-skip" data-ad-exclude="true">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] animate-slide-up">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 font-heading">
                {language === 'KR' ? '🔒 개인정보처리방침 (Privacy Policy)' : '🔒 Privacy Policy'}
              </h3>
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto text-left text-xs sm:text-sm text-slate-600 space-y-4">
              <div className="bg-blue-50/80 p-4 border border-blue-100 rounded-2xl text-blue-800 font-semibold text-xs sm:text-sm">
                {language === 'KR' 
                  ? '📢 구글 애드센스(Google AdSense) 광고 파트너십 구축에 따른 필수 투명성 준수 사항을 온전히 고지하는 개인정보 보호 규정입니다.'
                  : '📢 Important: Under GDPR & Google AdSense transparency mandates, this document contains detailed cookie disclosures about advertising targeting.'}
              </div>

              <div>
                <h4 className="font-bold text-slate-850 text-sm mb-1">{language === 'KR' ? '1. 개인인식 정보 및 위치 프라이버시 보호' : '1. Personal and Geolocation Data'}</h4>
                <p>
                  {language === 'KR'
                    ? 'Stepless 서비스는 주민등록번호, 휴대전화 등 식별 가능한 어떠한 형태의 직접적인 회원 개인정보도 수집, 가공, 또는 해외 전송하지 않는 프라이버시-퍼스트 환경입니다. 내 주변 출구 탐색 기능은 모바일 기기 내 "로컬 샌드박스 Geolocation API" 상에서만 일회적 거리 연산으로 작동하며 외부 서버로 결코 발송되지 않습니다.'
                    : 'Stepless strictly avoids gathering direct identifiable demographics (names or SSNs) or transmitting real-time coordinates. Your location is processed solely within your dynamic local browser session.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-850 text-sm mb-1 text-emerald-800">{language === 'KR' ? '2. 구글 제3자 타겟 광고 쿠키(Cookie) 명세 고지' : '2. Google Third-Party Cookie Policy'}</h4>
                <p className="font-medium">
                  {language === 'KR'
                    ? '1) 당사는 지속 가능한 이동 편의시설 정보 갱신 및 서비스 운영을 위하여 구글 애드센스(Google AdSense) 광고 시스템 기법을 웹사이트 내에 수용합니다.'
                    : '1) We allow Google AdSense on our web site to finance persistent field-testing and continuous updates to our map catalog.'}
                </p>
                <p className="font-medium mt-1">
                  {language === 'KR'
                    ? '2) 구글을 포함한 제3자 서비스 공급업체는 이용자가 본 서비스나 타사 인터넷 사이트에 과거에 가동 및 방문한 기록을 바탕으로 광고를 제공하기 위해 쿠키(Cookie) 기술을 적용합니다.'
                    : '2) Third-party vendors, including Google, utilize system cookies to construct contextual or personalized ads based on raw historic browser visit parameters.'}
                </p>
                <p className="font-medium mt-1">
                  {language === 'KR'
                    ? '3) 구글의 광고 쿠키 사용으로 인해 구글 및 제휴 네트워크는 이용자의 서비스 이용 양태에 맞는 전문적인 맞춤형 광고를 제공할 수 있게 됩니다.'
                    : '3) Googles usage of interest-advertising cookies allows safe presentation of appropriate target banners matching the users current preferences.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-850 text-sm mb-1">{language === 'KR' ? '3. 맞춤형 타겟 광고의 제한 및 거부 수칙 (Opt-out)' : '3. Targeted Ads Opt-out Instructions'}</h4>
                <p>
                  {language === 'KR'
                    ? '이용자는 자율적으로 타겟 광고 제공을 사전에 영구 거부하거나 해제할 수 있습니다. 브라우저 설정에서 쿠키를 전면 지우거나 거부할 수 있으며, 구글 공식 광고사 설정을 통해 제어 가능합니다.'
                    : 'Users can freely block tailored tracking by altering browser settings or custom vendors rules.'}
                </p>
                <ul className="list-disc pl-5 space-y-1.5 mt-2 font-semibold text-slate-800 text-xs sm:text-sm">
                  <li>
                    <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                      <span>{language === 'KR' ? '🔗 구글 개인 마케팅 광고 설정 관리' : '🔗 Google Personal Ads Setting Controller'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                      <span>{language === 'KR' ? '🔗 미국 디지털광고협회(DAA) 쿠키 수집 정지 리스트' : '🔗 Digital Advertising Alliance (DAA) Cookie Opt-Out Central'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-850 text-sm mb-1">{language === 'KR' ? '4. 문의 및 보안 의견 접수' : '4. Inquiries & User Rights'}</h4>
                <p>
                  {language === 'KR'
                    ? '구글 광고 정책 위반 의심 사례, 리포트 불충분 문의, 기타 개인정보 보호 정책에 관한 고견은 floreur88@gmail.com 으로 연락 주시면 신속하게 조처하겠습니다.'
                    : 'For privacy inquiries, cookie preferences, or data corrections, please contact us at floreur88@gmail.com.'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="px-5 py-2.5 bg-[#8EA85E] hover:bg-[#7b944f] text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer shadow-sm transition-colors"
              >
                {language === 'KR' ? '약관 동의 및 확인' : 'Accept & Complete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔍 Global Floating Bottom Search Bar (Always reachable on Mobile & PC) */}
      <div 
        id="global-floating-bottom-search"
        className="fixed bottom-[60px] md:bottom-5 left-1/2 -translate-x-1/2 z-[990] w-full max-w-xl px-3 sm:px-4 pointer-events-none animate-fade-in"
      >
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.16)] p-1 transition-all">
          <StationSearchBar
            language={language}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectStation={(stId, exitNum) => {
              setSelectedStationId(stId);
              if (exitNum) {
                setExpandedExitNum(exitNum);
              }
              setSearchViewMode('DETAIL');
              setCurrentTab('search');
              setIsHomeLanding(false);
              setTimeout(() => {
                const targetEl = document.getElementById('search-station-detail-top') || document.getElementById('search-tab-map-container');
                if (targetEl) {
                  targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  window.scrollTo(0, 0);
                }
              }, 100);
            }}
            onNavigateToSearch={(q) => {
              if (q !== undefined) {
                setSearchQuery(q);
              }
              const queryToUse = q !== undefined ? q : searchQuery;
              if (queryToUse && queryToUse.trim().length > 0) {
                const matches = searchStations(queryToUse, STATIONS);
                if (matches.length > 0) {
                  setSelectedStationId(matches[0].station.id);
                  if (matches[0].matchedExit) {
                    setExpandedExitNum(matches[0].matchedExit);
                  }
                  setSearchViewMode('DETAIL');
                }
              }
              setCurrentTab('search');
              setIsHomeLanding(false);
              setTimeout(() => {
                const targetEl = document.getElementById('search-station-detail-top') || document.getElementById('search-tab-map-container');
                if (targetEl) {
                  targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  window.scrollTo(0, 0);
                }
              }, 100);
            }}
            dropdownPosition="top"
            placeholder={pickLang(language, {
              KR: '어디로 가시나요? 역 이름 검색 (예: 서면, 해운대)',
              EN: 'Search any station... (e.g. Seomyeon, Haeundae)',
              JA: 'どちらへ行かれますか？駅名を検索（例：西面、海雲台）',
              ZH_TW: '請問您要去哪裡？搜尋站名（例：西面、海雲台）',
              ZH_CN: '请问您要去哪里？搜索站名（例：西面、海云台）'
            })}
          />
        </div>
      </div>

      {/* 📱 Sticky Mobile Bottom Navigation Bar (At-a-glance 1-tap switching) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 flex justify-around items-center"
        aria-label="Mobile Bottom Navigation"
      >
        {[
          { id: 'home', label: pickLang(language, { KR: '홈', EN: 'Home', JA: 'ホーム', ZH_TW: '首頁', ZH_CN: '首页' }), icon: Compass },
          { id: 'search', label: pickLang(language, { KR: '역 검색', EN: 'Stations', JA: '駅検索', ZH_TW: '車站搜尋', ZH_CN: '车站搜索' }), icon: Train },
          { id: 'transit', label: pickLang(language, { KR: '교통 팁', EN: 'Transit', JA: '交通ヒント', ZH_TW: '交通指南', ZH_CN: '交通指南' }), icon: Bus },
          { id: 'courses', label: pickLang(language, { KR: '추천 코스', EN: 'Courses', JA: 'コース', ZH_TW: '推薦路線', ZH_CN: '推荐路线' }), icon: Map },
          { id: 'schedule', label: pickLang(language, { KR: '일정표', EN: 'Schedule', JA: '日程表', ZH_TW: '行事曆', ZH_CN: '日程表' }), icon: Calendar },
          { id: 'exploration', label: pickLang(language, { KR: '탐구생활', EN: 'Explore', JA: '探求生活', ZH_TW: '探索生活', ZH_CN: '探索生活' }), icon: Sparkles },
        ].map(item => {
          const Icon = item.icon;
          const isActive = (item.id === currentTab) ||
            (item.id === 'transit' && (currentTab === 'transit' || (currentTab === 'tips' && ['transit', 'child-free', 'bus-qr', 'transfer', 'taxi'].includes(tipsSubPage)))) ||
            (item.id === 'courses' && (currentTab === 'courses' || currentTab === 'tourapi' || currentTab.startsWith('itinerary-') || (currentTab === 'tips' && ['courses', 'index'].includes(tipsSubPage)))) ||
            (item.id === 'schedule' && (currentTab === 'schedule' || (currentTab === 'tips' && tipsSubPage === 'schedule'))) ||
            (item.id === 'exploration' && (currentTab === 'exploration' || (currentTab === 'tips' && ['exploration', 'community'].includes(tipsSubPage))));
          return (
            <button
              key={item.id}
              id={`mobile-bottom-nav-${item.id}`}
              onClick={() => {
                handleMainTabSelect(item.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isActive 
                  ? 'text-[#8EA85E] font-black scale-105' 
                  : 'text-slate-400 font-medium hover:text-slate-600'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-[#8EA85E]/15 text-[#8EA85E]' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] leading-tight mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
