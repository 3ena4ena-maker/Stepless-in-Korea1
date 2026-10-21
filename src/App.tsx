/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Updated: 2026-08 August Busan Events & Calendar
 */

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { 
  Train, 
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
import TimelineVisualizer from './components/TimelineVisualizer';
import { StationBarrierFreeCard } from './components/StationBarrierFreeCard';
import { HomeOverviewSection } from './components/HomeOverviewSection';
import { getLockerInfoText, renderLockerInfo } from './data/lockers';
import { getNearbyPlaces, NearbyExitBadge, NearbyPlace } from './data/nearbyPlaces';
import { STATIONS, INITIAL_REPORTS } from './data';
import { Station, ExitInfo, FacilityReport, StatusType, getExitDisplayName, translateExitNumber, getTranslatedStationName } from './types';
import { translateRecommendation, navigateToSpa } from './utils';
import { BUSAN_ITINERARIES } from './data/itineraries';

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
import { lazyWithRetry } from './utils/lazyWithRetry';

// Code-split heavy views with auto-retry to prevent "Failed to fetch dynamically imported module" errors
const BusanItinerariesView = lazyWithRetry(() => import('./components/BusanItinerariesView'));
const SiteIntroductionView = lazyWithRetry(() => import('./components/SiteIntroductionView'));
const SubwayStationMap = lazyWithRetry(() => import('./components/SubwayStationMap'));

// Dynamic tab loading fallback component for code-split views
const TabLoadingFallback = ({ text = "정보를 신속하게 불러오는 중..." }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[360px] p-8 text-center space-y-3 animate-fade-in">
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

  // Immediately preload all code-split views in background for instant transitions
  useEffect(() => {
    import('./components/BusanItinerariesView');
    import('./components/SiteIntroductionView');
    import('./components/SubwayStationMap');
  }, []);
  const [language, setLanguage] = useState<'KR' | 'EN'>('KR');
  const [selectedStationId, setSelectedStationId] = useState<string>('seomyeon');
  const [searchViewMode, setSearchViewMode] = useState<'INDEX' | 'DETAIL'>('INDEX');
  const [isHomeLanding, setIsHomeLanding] = useState<boolean>(true);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [activePathFilter, setActivePathFilter] = useState<'ALL' | 'ACCESSIBLE' | 'CARRY'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItineraryCategory, setSelectedItineraryCategory] = useState<string | null>(null);
  const [tipsSubPage, setTipsSubPage] = useState<'index' | 'courses' | 'transit' | 'child-free' | 'bus-qr' | 'transfer' | 'taxi' | 'schedule' | 'community' | 'exploration'>('index');
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

      const parts = pathname.split('/');
      
      // Look for shared route data or /my-route
      if (searchParams.has('route') || searchParams.has('route_data') || searchParams.has('shared_route') || parts[1] === 'my-route') {
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
      } else if (['home', 'search', 'schedule', 'tips', 'about', 'privacy', 'terms', 'contact', 'data-source'].includes(parts[1])) {
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
    try {
      if (!isInitialRoutingCompleteRef.current) {
        return;
      }
      if (currentTab === 'home') {
        if (isHomeLanding) {
          const expectedPath = '/';
          if (window.location.pathname !== expectedPath && window.location.pathname !== '/home') {
            window.history.pushState({ tab: 'home', isHomeLanding: true }, '', expectedPath);
          }
        } else if (selectedStationId) {
          const expectedPath = `/station/${selectedStationId}`;
          if (window.location.pathname !== expectedPath) {
            window.history.pushState({ stationId: selectedStationId, tab: 'home', isHomeLanding: false }, '', expectedPath);
          }
        }
      } else if (currentTab !== 'home') {
        let expectedPath = `/${currentTab}`;
        if (currentTab === 'search') {
          if (searchViewMode === 'DETAIL' && selectedStationId) {
            expectedPath = `/search/${selectedStationId}`;
          } else {
            expectedPath = '/search';
          }
        } else if (currentTab === 'tips') {
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
            expectedPath = '/tips/exploration';
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
            expectedPath = '/about/operator';
          }
        }
        const currentUrlPath = window.location.pathname + window.location.search;
        if (currentUrlPath !== expectedPath && window.location.pathname !== expectedPath) {
          window.history.pushState({ tab: currentTab, category: selectedItineraryCategory, subPage: tipsSubPage, regionPage: activeRegionPage, siteSubPage, searchViewMode, stationId: selectedStationId }, '', expectedPath);
        }
      }
    } catch (e) {
      console.warn('URL pushState error ignored:', e);
    }

    // 2. Change metadata (Dynamic Title, Description, and OpenGraph tags)
    if (currentTab === 'search' && searchViewMode === 'INDEX') {
      const searchTitle = language === 'KR' 
        ? "부산 지하철역 출구 정보 둘러보기 & 역 검색 | 스텝레스 Stepless" 
        : "Busan Subway Station & Exit Directory | Stepless";
      const searchDesc = language === 'KR'
        ? "부산 지하철 1~4호선 주요 역의 엘리베이터, 에스컬레이터 대수 및 출구별 무단차 이동 정보를 한눈에 비교하고 검색해 보세요."
        : "Explore elevator and escalator availability across major Busan transit hubs.";
      document.title = searchTitle;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', searchDesc);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', searchTitle);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', searchDesc);

      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', 'https://stepless.kr/search');
    } else if (((currentTab === 'home' && !isHomeLanding) || (currentTab === 'search' && searchViewMode === 'DETAIL')) && selectedStationId) {
      const activeST = STATIONS.find(s => s.id === selectedStationId);
      if (activeST) {
        const titleText = `${activeST.name} 엘리베이터 위치 & 유모차 동선 안내 | 스텝레스 Stepless`;
        document.title = titleText;

        const cleanEngName = activeST.englishName.replace(/\s*Station$/i, '').trim();
        const descText = `${activeST.name} (${cleanEngName}) 지하철역의 엘리베이터 최단 위치와 유모차, 캐리어 소지자를 위한 계단 회피 추천 동선 정보를 정밀히 안내해 드립니다.`;
        
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', descText);

        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', titleText);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', descText);

        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.setAttribute('href', `https://stepless.kr/search/${selectedStationId}`);
      }
    } else if (currentTab === 'about') {
      let pageTitle = "운영자 소개 | 스텝레스 Stepless";
      let pageDesc = "부산 지하철 배리어프리 플랫폼 운영자 플로레르 소개";
      if (siteSubPage === 'privacy') {
        pageTitle = "개인정보처리방침 | 스텝레스 Stepless";
        pageDesc = "Stepless 개인정보처리방침 및 구글 맞춤형 광고 쿠키 정책";
      } else if (siteSubPage === 'terms') {
        pageTitle = "서비스 이용약관 | 스텝레스 Stepless";
        pageDesc = "Stepless 서비스 이용약관 및 면책사항";
      } else if (siteSubPage === 'contact') {
        pageTitle = "문의 및 제휴 안내 | 스텝레스 Stepless";
        pageDesc = "Stepless 제휴 문의, 개선 의견 및 대표 이메일 안내";
      } else if (siteSubPage === 'data-source') {
        pageTitle = "데이터 출처와 정정 요청 | 스텝레스 Stepless";
        pageDesc = "공식 데이터 출처 명시 및 역별 정보 오류 정정 제보 양식";
      }
      document.title = pageTitle;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', pageDesc);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', pageTitle);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', pageDesc);
    } else if (currentTab === 'tips') {
      let pageTitle = "부산 여행 코스 추천 & 실시간 여행 팁 | 스텝레스 Stepless";
      let pageDesc = "부산 식도락, 명소, 전통시장, 무장애 여행 코스 추천 및 나만의 맞춤 루트 만들기, 실시간 대중교통 길찾기 가이드.";
      let canonicalUrl = "https://stepless.kr/tips";

      if (selectedItineraryCategory) {
        const catSlug = categoryToUrlSlug(selectedItineraryCategory);
        const categoryLabels: Record<string, { title: string; desc: string }> = {
          'GOURMET': {
            title: '부산 식도락 맛집 여행 코스 추천',
            desc: '부산 대표 돼지국밥, 밀면, 씨앗호떡, 자갈치 해산물 맛집 및 전포 카페거리 식도락 추천 여행 코스를 안내합니다.'
          },
          'EXPERIENCE': {
            title: '부산 체험 & 박물관 여행 코스 추천',
            desc: '국립해양박물관, 국립부산과학관, 뮤지엄원, 아르떼뮤지엄 부산, 증권박물관, F1963 등 부산 대표 체험·박물관 코스 안내.'
          },
          'MARKET': {
            title: '부산 전통시장 투어 추천 코스',
            desc: '부평깡통시장 야시장, 국제시장, 자갈치시장, 부전시장 등 활기 넘치는 부산 대표 전통시장 추천 코스 안내.'
          },
          'ATTRACTION': {
            title: '부산 대표 핵심 명소 여행 코스',
            desc: '해운대 해수욕장, 광안리 해변 드론쇼, 영도 흰여울문화마을, 기장 해동용궁사 등 부산 필수 명소 코스 안내.'
          },
          'DAY': {
            title: '부산 당일치기 여행 추천 코스',
            desc: '하루 만에 부산의 핵심 바다와 명소, 미식을 알차게 둘러보는 당일치기 추천 여행 코스를 안내합니다.'
          },
          '1NIGHT': {
            title: '부산 1박 2일 여행 추천 코스',
            desc: '부산의 낮과 밤, 야경과 바다 감성을 모두 만끽하는 1박 2일 추천 여행 코스를 안내합니다.'
          },
          '2NIGHTS': {
            title: '부산 2박 3일 여행 추천 코스',
            desc: '해운대부터 원도심, 영도, 기장까지 여유롭게 즐기는 2박 3일 부산 완전정복 여행 코스를 안내합니다.'
          },
          'SUBWAY': {
            title: '부산도시철도 지하철 테마 여행 코스',
            desc: '부산 지하철 1·2호선 역세권 명소를 계단 없이 편리하게 이동하는 지하철 테마 코스를 안내합니다.'
          },
          'BARRIER_FREE': {
            title: '부산 무장애(배리어프리) 열린관광지 코스',
            desc: '계단과 보도 턱이 없어 휠체어와 유모차로 편리하게 이동할 수 있는 부산 배리어프리 추천 코스를 안내합니다.'
          },
          'MY_ROUTE': {
            title: '나만의 맞춤 부산 여행 코스 만들기',
            desc: '원하는 장소를 담아 순서대로 나열하고, 실시간 네이버 지도·구글맵 대중교통 길찾기를 연결하는 맞춤 루트 플래너.'
          }
        };

        const currentMeta = categoryLabels[selectedItineraryCategory] || {
          title: `부산 ${selectedItineraryCategory} 여행 코스 추천`,
          desc: '부산 추천 여행 코스, 대표 명소와 맛집, 무장애 관광지 및 나만의 맞춤 여행 코스 지도 만들기.'
        };

        pageTitle = `${currentMeta.title} | 스텝레스 Stepless`;
        pageDesc = currentMeta.desc;
        canonicalUrl = `https://stepless.kr/tips/courses/${catSlug}`;
      } else if (tipsSubPage === 'transit' || tipsSubPage === 'transfer') {
        pageTitle = "부산 대중교통 이용 팁 & 시내버스·지하철 환승 가이드 | 스텝레스 Stepless";
        pageDesc = "부산 시내버스 노선, 지하철 환승 팁, 캐리어 보관함 및 유모차·휠체어 배리어프리 대중교통 이용 가이드.";
        canonicalUrl = "https://stepless.kr/tips/transit";
      } else if (tipsSubPage === 'child-free') {
        pageTitle = "부산 영유아·어린이 대중교통 이용 팁 & 무료 요금 가이드 | 스텝레스 Stepless";
        pageDesc = "부산 어린이 대중교통 요금 전면 무료화 혜택 및 유모차 동반 지하철·버스 이용 팁 안내.";
        canonicalUrl = "https://stepless.kr/tips/child-free";
      } else if (tipsSubPage === 'bus-qr') {
        pageTitle = "부산 시내버스 모바일 QR 결제 가이드 | 스텝레스 Stepless";
        pageDesc = "교통카드 없이 스마트폰 QR코드로 간편하게 탑승하는 부산 시내버스 모바일 결제 가이드.";
        canonicalUrl = "https://stepless.kr/tips/bus-qr";
      } else if (tipsSubPage === 'taxi') {
        pageTitle = "부산 콜택시 & 교통약자 바우처 택시 이용 안내 | 스텝레스 Stepless";
        pageDesc = "부산 주요 콜택시 전화번호 및 임산부·교통약자를 위한 바우처 택시, 안심 귀가 서비스 안내.";
        canonicalUrl = "https://stepless.kr/tips/taxi";
      } else if (tipsSubPage === 'exploration') {
        pageTitle = "부산 탐구생활 - 핫이슈 & 실전 여행 꿀팁 | 스텝레스 Stepless";
        pageDesc = "로컬만이 아는 꿀팁부터 요즘 핫한 부산 소식까지! 부캉이 포토존과 캐리어 짐 보관 가이드.";
        canonicalUrl = "https://stepless.kr/tips/exploration";
      } else if (tipsSubPage === 'courses') {
        pageTitle = "부산 테마별 & 일정별 추천 여행 코스 | 스텝레스 Stepless";
        pageDesc = "식도락, 체험, 전통시장, 명소 및 당일치기부터 2박 3일까지 부산 추천 여행 코스 안내.";
        canonicalUrl = "https://stepless.kr/tips/courses";
      } else if (tipsSubPage === 'schedule') {
        pageTitle = "부산 일정별 여행 코스 추천 (당일치기·1박2일·2박3일) | 스텝레스 Stepless";
        pageDesc = "부산 당일치기, 1박2일, 2박3일 알짜 일정별 추천 여행 코스 및 무단차 동선 안내.";
        canonicalUrl = "https://stepless.kr/schedule";
      }

      document.title = pageTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', pageDesc);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', pageTitle);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', pageDesc);
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', canonicalUrl);
    } else if (currentTab === 'tourapi') {
      const pageTitle = "부산 무장애 관광지 & 배리어프리 열린관광지 | 스텝레스 Stepless";
      const pageDesc = "한국관광공사 열린관광지 데이터 기반 부산 전역 무장애 여행 스팟, 단차 없는 평탄 보도 및 편의시설 가이드.";
      document.title = pageTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', pageDesc);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', pageTitle);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', pageDesc);
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', "https://stepless.kr/barrier-free");
    } else {
      const defaultTitle = "부산 여행 코스 추천 & 지하철 배리어프리 무장애 가이드 | 스탭리스 Stepless";
      const defaultDesc = "부산 명소·맛집·전통시장 추천 여행 코스부터 주요 지하철역 엘리베이터 위치, 유모차·휠체어 배리어프리 무단차 동선, 맞춤 내 여행 루트 및 실시간 대중교통 길찾기까지 한 번에 안내합니다.";
      
      document.title = defaultTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', defaultDesc);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', defaultTitle);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', defaultDesc);

      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', "https://stepless.kr/");
    }
  }, [selectedStationId, currentTab, isHomeLanding, searchViewMode, selectedItineraryCategory, tipsSubPage, activeRegionPage, siteSubPage, language]);

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
  }, [currentTab, selectedStationId, isHomeLanding, selectedItineraryCategory, tipsSubPage, activeRegionPage]);

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
    setLanguage(prev => prev === 'KR' ? 'EN' : 'KR');
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
          setCurrentTab={(tab) => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            const validTabs = ['home', 'search', 'schedule', 'tourapi', 'tips', 'about'];
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
            if (targetTab === 'tips') {
              setSelectedItineraryCategory(null);
              setTipsSubPage('index');
              setActiveRegionPage(null);
              setBarrierFreePlaceId(null);
              setBarrierFreeCourseId(null);
            } else if (targetTab === 'tourapi') {
              setSelectedItineraryCategory('BARRIER_FREE');
              setBarrierFreePlaceId(null);
              setBarrierFreeCourseId(null);
              navigateToSpa('/barrier-free');
            } else {
              setBarrierFreePlaceId(null);
              setBarrierFreeCourseId(null);
            }
          }} 
          language={language} 
          toggleLanguage={toggleLanguage} 
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
                    }}
                    onNavigateToAbout={() => {
                      setCurrentTab('about');
                      window.scrollTo(0, 0);
                    }}
                    onNavigateToNearby={() => {
                      requestNearbyGuide();
                    }}
                    onNavigateToItinerary={(category) => {
                      if (category) {
                        setSelectedItineraryCategory(category);
                      }
                      setCurrentTab('tips');
                      setTipsSubPage('courses');
                      try {
                        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                      } catch (e) {
                        window.scrollTo(0, 0);
                      }
                    }}
                  />
                </>
              )}

            </div>
          )}

          {/* Tab 2: SEARCH / BENTO GRID VIEW */}
          {(visitedTabs['search'] || currentTab === 'search') && (
            <div className={currentTab === 'search' ? 'space-y-8 text-left google-anno-skip' : 'hidden'} data-ad-exclude="true">
              {searchViewMode === 'INDEX' ? (
                /* === 전용 서치 허브 페이지 (검색창 + 원하는 지하철역 선택 박스만 노출) === */
                <div className="space-y-8 animate-fadeIn">
                  {/* Search Header */}
                  <div>
                    <h2 className="text-2xl font-extrabold font-heading text-slate-800">
                      {language === 'KR' ? '부산 지하철역 출구 정보 둘러보기' : 'Subway Exit Information Index'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {language === 'KR' 
                        ? '부산 핵심 주요역의 총 엘리베이터 수, 에스컬레이터 대수를 한눈에 비교하고 탐색해보세요.' 
                        : 'Analyze general escalators, elevator configurations across major transit sectors.'}
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
                        {language === 'KR' ? '원하는 지하철역 선택' : 'Select Subway Station'}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
                      {STATIONS.map((st) => {
                        const lineStr = st.lines.map(l => l.includes('선') ? l : l + '호선').join('·');
                        return (
                          <a
                            key={st.id}
                            href={`/search/${st.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedStationId(st.id);
                              setExpandedExitNum(null);
                              setSearchViewMode('DETAIL');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-center items-center gap-0.5 active:scale-95 bg-white border-slate-300 hover:border-[#8EA85E] hover:bg-slate-50 text-slate-800 shadow-2xs hover:shadow-xs group"
                          >
                            <span className="font-bold text-sm sm:text-base font-heading text-slate-800 group-hover:text-[#8EA85E] transition-colors">
                              {getTranslatedStationName(st.name, language)}
                            </span>
                            <div className="text-[11px] sm:text-xs font-semibold inline-flex items-center gap-0.5">
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
                            <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider text-slate-400">
                              {st.englishName}
                            </span>
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
                      <span>{language === 'KR' ? '다른 지하철역 검색하기 (목록)' : 'Back to Station Search'}</span>
                    </button>

                    <div className="w-full sm:w-72">
                      <StationSearchBar
                        language={language}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        placeholder={language === 'KR' ? '다른 역/출구 빠른 검색...' : 'Search station/exit...'}
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
                  <StationBarrierFreeCard station={activeStation} language={language} />



              {/* Station Selection Banner (페이지 가장 아랫쪽으로 배치) */}
              <div id="search-selected-station-details" className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0"></span>
                  <span className="text-base leading-none">📍</span>
                  <h3 className="text-base sm:text-lg font-bold font-heading text-slate-800">
                    {language === 'KR' ? '원하는 지하철역 선택' : 'Select Subway Station'}
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
                  {STATIONS.map((st) => {
                    const lineStr = st.lines.map(l => l.includes('선') ? l : l + '호선').join('·');
                    const isSelected = selectedStationId === st.id;
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
                        className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-center items-center gap-0.5 active:scale-95 ${
                          isSelected
                            ? 'bg-[#8EA85E] border-[#8EA85E] text-white shadow-sm ring-2 ring-[#8EA85E]/20'
                            : 'bg-white border-slate-300 hover:border-[#8EA85E] hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <span className={`font-bold text-sm sm:text-base font-heading ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                          {getTranslatedStationName(st.name, language)}
                        </span>
                        <div className="text-[11px] sm:text-xs font-semibold inline-flex items-center gap-0.5">
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
                        <span className={`text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {st.englishName}
                        </span>
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
          {(visitedTabs['tips'] || visitedTabs['schedule'] || visitedTabs['tourapi'] || currentTab === 'tips' || currentTab === 'schedule' || currentTab === 'tourapi') && (
            <div className={(currentTab === 'tips' || currentTab === 'schedule' || currentTab === 'tourapi') ? ((currentTab === 'tips' && tipsSubPage === 'index') || currentTab === 'schedule' ? 'space-y-1 sm:space-y-2' : 'space-y-6') : 'hidden'}>
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
                    setTipsSubPage('index');
                    if (currentTab === 'schedule' || currentTab === 'tourapi') {
                      setCurrentTab('tips');
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
                  tipsSubPage={currentTab === 'schedule' ? 'schedule' : tipsSubPage}
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
              </Suspense>
              {/* Google AdSense Unit for Verified Guides / Magazine / Content Hub */}
              {(currentTab !== 'tips' || tipsSubPage !== 'index') && currentTab !== 'schedule' && (
                <AdSenseUnit currentParams={adParams} />
              )}
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
              </Suspense>
            </div>
          )}


        </main>
      </div>

      {/* Footer information section */}
      <footer className="mt-3 sm:mt-4 bg-[#8EA85E]/15 backdrop-blur-md text-slate-700 text-left border-t border-[#8EA85E]/30 pt-6 sm:pt-7 pb-10 sm:pb-12 md:pb-14 rounded-t-[2rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-black font-heading tracking-tight text-slate-900">
                STEPLESS IN KOREA
              </span>
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
              <button
                onClick={() => {
                  setCurrentTab('about');
                  setSiteSubPage('contact');
                  window.scrollTo(0, 0);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#8EA85E] hover:bg-[#7b944f] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                ✉️ {language === 'KR' ? '문의 보내기' : 'Contact Us'}
              </button>
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
            📢 <strong>안내:</strong> 구글 맞춤형 광고 및 쿠키 설정 안내는 <button onClick={() => { setCurrentTab('about'); setSiteSubPage('privacy'); window.scrollTo(0, 0); }} className="text-[#6C8540] hover:text-[#526630] underline font-bold cursor-pointer">개인정보처리방침</button>에서 확인하실 수 있습니다.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#8EA85E]/20 mt-4 pt-4 text-xs text-slate-600 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="font-semibold text-slate-600">© 2026 floreur (스텝레스). All rights reserved.</span>
          
          {/* Prominent Legal Links Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center sm:justify-end">
            <button 
              onClick={() => {
                setCurrentTab('about');
                setSiteSubPage('about');
                window.scrollTo(0, 0);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white hover:text-[#8EA85E] border border-[#8EA85E]/30 text-slate-700 font-bold text-xs transition-colors shadow-2xs backdrop-blur-sm cursor-pointer"
            >
              {language === 'KR' ? '👤 운영자 소개' : 'Operator'}
            </button>
            <button 
              onClick={() => {
                setCurrentTab('about');
                setSiteSubPage('contact');
                window.scrollTo(0, 0);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white hover:text-[#8EA85E] border border-[#8EA85E]/30 text-slate-700 font-bold text-xs transition-colors shadow-2xs backdrop-blur-sm cursor-pointer"
            >
              {language === 'KR' ? '✉️ 정보 오류 요청 제보 및 문의' : 'Inquiries & Edits'}
            </button>
            <button 
              onClick={() => {
                setCurrentTab('about');
                setSiteSubPage('privacy');
                window.scrollTo(0, 0);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white hover:text-[#8EA85E] border border-[#8EA85E]/30 text-slate-700 font-bold text-xs transition-colors shadow-2xs backdrop-blur-sm cursor-pointer"
            >
              {language === 'KR' ? '🔒 개인정보처리방침' : 'Privacy'}
            </button>
            <button 
              onClick={() => {
                setCurrentTab('about');
                setSiteSubPage('terms');
                window.scrollTo(0, 0);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white hover:text-[#8EA85E] border border-[#8EA85E]/30 text-slate-700 font-bold text-xs transition-colors shadow-2xs backdrop-blur-sm cursor-pointer"
            >
              {language === 'KR' ? '📄 이용약관' : 'Terms'}
            </button>
            <button 
              onClick={() => {
                setCurrentTab('about');
                setSiteSubPage('data-source');
                window.scrollTo(0, 0);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white hover:text-[#8EA85E] border border-[#8EA85E]/30 text-slate-700 font-bold text-xs transition-colors shadow-2xs backdrop-blur-sm cursor-pointer"
            >
              {language === 'KR' ? '📊 데이터 출처' : 'Data Sources'}
            </button>
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
            placeholder={
              language === 'KR'
                ? '어디로 가시나요? 역 이름 검색 (예: 서면, 해운대)'
                : 'Search any station... (e.g. Seomyeon, Haeundae)'
            }
          />
        </div>
      </div>

      {/* 📱 Sticky Mobile Bottom Navigation Bar (At-a-glance 1-tap switching) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 flex justify-around items-center"
        aria-label="Mobile Bottom Navigation"
      >
        {[
          { id: 'home', label: language === 'KR' ? '홈' : 'Home', icon: Compass },
          { id: 'search', label: language === 'KR' ? '역 검색' : 'Stations', icon: Train },
          { id: 'tips', label: language === 'KR' ? '여행 팁' : 'Tips', icon: HelpCircle },
          { id: 'about', label: language === 'KR' ? '소개' : 'About', icon: Info },
        ].map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || (item.id === 'tips' && currentTab.startsWith('itinerary-'));
          return (
            <button
              key={item.id}
              id={`mobile-bottom-nav-${item.id}`}
              onClick={() => {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;

                const validTabs = ['home', 'search', 'schedule', 'tourapi', 'tips', 'about'];
                const targetTab = validTabs.includes(item.id) ? item.id : 'home';
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
                if (targetTab === 'tips') {
                  setSelectedItineraryCategory(null);
                  setTipsSubPage('index');
                  setActiveRegionPage(null);
                  setBarrierFreePlaceId(null);
                  setBarrierFreeCourseId(null);
                } else if (targetTab === 'tourapi') {
                  setSelectedItineraryCategory('BARRIER_FREE');
                  setBarrierFreePlaceId(null);
                  setBarrierFreeCourseId(null);
                  navigateToSpa('/barrier-free');
                } else {
                  setBarrierFreePlaceId(null);
                  setBarrierFreeCourseId(null);
                }
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
