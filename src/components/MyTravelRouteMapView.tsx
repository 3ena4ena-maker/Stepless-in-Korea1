/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 내 여행 루트 전용 대화형 지도 및 동선 뷰 컴포넌트
 * - 한국어 모드(KR): 네이버 지도 (Naver Maps) 엔진 렌더링 시도
 *   * NCP(네이버 클라우드 플랫폼) 도메인 인증 미등록 시: 안내 배너 및 무중단 고해상도 지도 자동 전환
 *   * 사용자 고유 Client ID 입력 및 도메인 복사 지원
 * - 영어 모드(EN): 구글 지도 (Google Maps) 엔진 렌더링
 * - 즐겨찾기(⭐)한 모든 장소를 번호 마커(①, ②, ③...)와 경로선(Polyline)으로 연결하여 표시
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  MapPin,
  Train,
  ArrowUp,
  ArrowDown,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Navigation,
  Compass,
  PlusCircle,
  AlertTriangle,
  Settings,
  X,
  Layers,
  Search,
  Plus,
  Share2,
  Download,
  Send,
  Locate,
  Maximize2,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import {
  useMyRoute,
  MyRoutePlace,
  addPlaceToMyRoute,
  KNOWN_COORDINATES,
  isPlaceInMyRoute,
  exportRouteToShareData,
  importRouteFromShareData,
  saveImportedRouteAsMyRoute,
  mergeImportedRouteIntoMyRoute,
  formatRouteSummaryText,
} from '../services/myRouteService';
import { BUSAN_TOUR_API_SPOTS } from '../data/tourApiSpots';
import { KOREA_TOUR_API_PLACE_DETAILS } from '../data/koreaTourApiPlaceDetails';

interface MyTravelRouteMapViewProps {
  language: 'KR' | 'EN';
  onNavigateToCategory?: (category: string) => void;
  onSelectStation?: (stationName: string) => void;
  onOpenBarrierFreeDetail?: (placeId: string) => void;
}

type MapProvider = 'NAVER' | 'GOOGLE' | 'LEAFLET';

declare global {
  interface Window {
    naver?: any;
    navermaps_auth_error?: () => void;
    NAVER_MAPS_AUTH_FAILED?: boolean;
    google?: any;
    gm_authFailure?: () => void;
    GOOGLE_MAPS_AUTH_FAILED?: boolean;
    L?: any;
  }
}

// 원클릭 추천 장소 (빈 상태일 때 쉽게 시작할 수 있도록 제공)
const QUICK_SUGGESTED_SPOTS = [
  { titleKo: '부산역 (설레는 부산 여행의 시작)', titleEn: 'Busan Station', categoryKo: '교통/명소', stationInfoKo: '부산역 1호선' },
  { titleKo: '감천문화마을', titleEn: 'Gamcheon Culture Village', categoryKo: '문화마을', stationInfoKo: '토성역 6번 출구' },
  { titleKo: '부평깡통시장 & 국제시장', titleEn: 'Bupyeong Kkangtong Market', categoryKo: '전통시장', stationInfoKo: '자갈치역 7번 출구' },
  { titleKo: '영도 흰여울문화마을', titleEn: 'Huinnyeoul Culture Village', categoryKo: '해안명소', stationInfoKo: '남포역 6번 출구 버스' },
  { titleKo: '광안리 해수욕장', titleEn: 'Gwangalli Beach', categoryKo: '해변/야경', stationInfoKo: '광안역 3·5번 출구' },
  { titleKo: '해운대 해수욕장', titleEn: 'Haeundae Beach', categoryKo: '해변/자연', stationInfoKo: '해운대역 3·5번 출구' },
  { titleKo: '해동용궁사', titleEn: 'Haedong Yonggungsa', categoryKo: '사찰/명소', stationInfoKo: '오시리아역 버스' },
];

interface SearchablePlace {
  id: string;
  titleKo: string;
  titleEn: string;
  categoryKo: string;
  categoryEn?: string;
  addressKo?: string;
  addressEn?: string;
  latitude?: number;
  longitude?: number;
  firstImage?: string;
  districtKo?: string;
  districtEn?: string;
  stationInfoKo?: string;
}

// 부산 전역 통합 검색 사전 (추천 관광지, 문화시설, 명소, 맛집, 카페 등)
const SEARCHABLE_RECOMMENDED_PLACES: SearchablePlace[] = (() => {
  const map = new Map<string, SearchablePlace>();

  // 1. Korea Tour API 상세 장소
  Object.values(KOREA_TOUR_API_PLACE_DETAILS).forEach(d => {
    if (d && d.nameKo) {
      const cleanKey = d.nameKo.trim().toLowerCase();
      if (!map.has(cleanKey)) {
        map.set(cleanKey, {
          id: d.id || d.nameKo,
          titleKo: d.nameKo,
          titleEn: d.nameEn || d.nameKo,
          categoryKo: d.categoryKo || '추천명소',
          categoryEn: d.categoryEn || 'Attraction',
          addressKo: d.addressRoadKo || d.addressLotKo || '',
          addressEn: d.addressRoadEn || d.addressLotEn || '',
          latitude: d.latitude,
          longitude: d.longitude,
          firstImage: d.firstImage,
          districtKo: d.districtKo,
          districtEn: d.districtEn,
          stationInfoKo: d.nearestStationNameKo,
        });
      }
    }
  });

  // 2. Busan Tour API 스팟
  BUSAN_TOUR_API_SPOTS.forEach(s => {
    if (s && s.titleKo) {
      const cleanKey = s.titleKo.trim().toLowerCase();
      if (!map.has(cleanKey)) {
        map.set(cleanKey, {
          id: s.contentid || s.titleKo,
          titleKo: s.titleKo,
          titleEn: s.titleEn || s.titleKo,
          categoryKo: s.categoryKo || '추천명소',
          categoryEn: s.categoryEn || 'Attraction',
          addressKo: s.addr1Ko || '',
          addressEn: s.addr1En || '',
          latitude: s.mapy,
          longitude: s.mapx,
          firstImage: s.firstimage,
          districtKo: s.districtKo,
          districtEn: s.districtEn,
          stationInfoKo: s.nearestStationNameKo,
        });
      }
    }
  });

  // 3. 알려진 유명 맛집/카페/명소 (KNOWN_COORDINATES)
  Object.entries(KNOWN_COORDINATES).forEach(([name, info]) => {
    const cleanKey = name.trim().toLowerCase();
    if (!map.has(cleanKey)) {
      map.set(cleanKey, {
        id: name,
        titleKo: name,
        titleEn: name,
        categoryKo: info.categoryKo || '식도락/명소',
        categoryEn: 'Food/Spot',
        addressKo: info.addressKo || '',
        addressEn: '',
        latitude: info.lat,
        longitude: info.lng,
      });
    }
  });

  return Array.from(map.values());
})();

export default function MyTravelRouteMapView({
  language,
  onNavigateToCategory,
  onSelectStation,
  onOpenBarrierFreeDetail,
}: MyTravelRouteMapViewProps) {
  const { places, count, move, remove, clear } = useMyRoute();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Client ID from LocalStorage or Env
  const [customClientId, setCustomClientId] = useState<string>(() => {
    return typeof window !== 'undefined' ? (localStorage.getItem('custom_naver_client_id') || '') : '';
  });
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [tempClientIdInput, setTempClientIdInput] = useState<string>('');
  const [domainCopied, setDomainCopied] = useState<boolean>(false);

  // Authentication error states
  const [naverAuthFailed, setNaverAuthFailed] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? Boolean(window.NAVER_MAPS_AUTH_FAILED) : false;
  });
  const [googleAuthFailed, setGoogleAuthFailed] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? Boolean(window.GOOGLE_MAPS_AUTH_FAILED) : false;
  });

  // Active Map Provider: KR -> NAVER (fallback to LEAFLET), EN -> GOOGLE (fallback to LEAFLET)
  const [provider, setProvider] = useState<MapProvider>(() => {
    if (language === 'KR') {
      return (typeof window !== 'undefined' && window.NAVER_MAPS_AUTH_FAILED) ? 'LEAFLET' : 'NAVER';
    }
    return (typeof window !== 'undefined' && window.GOOGLE_MAPS_AUTH_FAILED) ? 'LEAFLET' : 'GOOGLE';
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  // 방안 A: URL 공유 링크 및 내 루트 복사 관련 상태
  const [sharedRoutePlaces, setSharedRoutePlaces] = useState<MyRoutePlace[] | null>(null);
  const [isViewingSharedRoute, setIsViewingSharedRoute] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [shareUrlCopied, setShareUrlCopied] = useState<boolean>(false);
  const [summaryTextCopied, setSummaryTextCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 모바일 GPS 위치 상태
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const userGpsMarkerRef = useRef<any>(null);

  // 현재 화면 및 지도에 표시할 장소 목록 (공유받은 루트 조회 중이면 sharedRoutePlaces, 아니면 본인 루트 places)
  const displayPlaces = useMemo(() => {
    if (isViewingSharedRoute && sharedRoutePlaces && sharedRoutePlaces.length > 0) {
      return sharedRoutePlaces;
    }
    return places;
  }, [isViewingSharedRoute, sharedRoutePlaces, places]);

  // URL에서 공유 루트 감지 (?route=... 또는 ?shared_route=... 또는 hash #route=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      const rawRoute = params.get('route') || params.get('shared_route') || params.get('route_data');
      
      let hashRoute = '';
      if (hash && hash.includes('route=')) {
        const match = hash.match(/route=([A-Za-z0-9_-]+)/);
        if (match) hashRoute = match[1];
      }

      const routeStr = rawRoute || hashRoute;
      if (routeStr) {
        const imported = importRouteFromShareData(routeStr);
        if (imported && imported.length > 0) {
          setSharedRoutePlaces(imported);
          setIsViewingSharedRoute(true);
        }
      }
    } catch (e) {
      console.warn('Failed to parse route from URL:', e);
    }
  }, []);

  // 구글(EN) / 네이버(KR) 실시간 자동 완성 검색 상태
  const isGoogleMode = language === 'EN' || provider === 'GOOGLE';
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [addFeedback, setAddFeedback] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // 검색창 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 언어/지도 모드에 따른 실시간 자동 완성 검색 (EN: Google Maps, KR: Naver Maps)
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      setIsSearchOpen(false);
      return;
    }

    setIsSearching(true);
    setIsSearchOpen(true);

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const endpoint = isGoogleMode
          ? `/api/google/search?query=${encodeURIComponent(trimmed)}`
          : `/api/naver/search?query=${encodeURIComponent(trimmed)}`;

        const res = await fetch(endpoint, {
          signal: controller.signal,
        });

        if (res.ok) {
          const json = await res.json();
          if (json && Array.isArray(json.items)) {
            const formatted = json.items.map((it: any) => ({
              id: it.id || it.titleEn || it.titleKo,
              titleKo: it.titleKo,
              titleEn: it.titleEn || it.titleKo,
              categoryKo: it.categoryKo || (isGoogleMode ? '구글 명소' : '네이버 플레이스'),
              categoryEn: it.categoryEn || (isGoogleMode ? 'Google Place' : 'Naver Place'),
              addressKo: it.addressKo || '',
              addressEn: it.addressEn || it.addressKo || '',
              latitude: it.latitude,
              longitude: it.longitude,
              source: it.source || (isGoogleMode ? 'GOOGLE_PLACES' : 'NAVER_API'),
            }));
            setSearchResults(formatted);
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Place search fetch error:', err);
        }
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, isGoogleMode]);

  // 검색 결과 목록: 실시간 API(구글/네이버) 자동 검색 결과 + 데이터베이스 연관 검색어
  // ※ 사용자의 요청에 따라 기본 '추천 인기 명소'는 완전 삭제하고, 검색어 입력 시에만 실시간 자동 검색되도록 구성
  const activeSearchResults = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return []; // 추천 인기 명소 삭제: 검색어가 없을 때는 표시하지 않음
    }

    const list: any[] = [];
    const seenTitles = new Set<string>();

    // 1. 실시간 API (구글/네이버) 검색 결과 우선 추가
    searchResults.forEach(item => {
      const cleanKey = (isGoogleMode ? (item.titleEn || item.titleKo) : item.titleKo).trim().toLowerCase();
      if (!seenTitles.has(cleanKey)) {
        seenTitles.add(cleanKey);
        list.push(item);
      }
    });

    // 2. 앱 내 부산 검증 명소 DB 중 검색어와 일치하는 항목 보강 (중복 제거)
    SEARCHABLE_RECOMMENDED_PLACES.forEach(p => {
      const cleanKey = (isGoogleMode ? (p.titleEn || p.titleKo) : p.titleKo).trim().toLowerCase();
      if (!seenTitles.has(cleanKey)) {
        if (
          p.titleKo.toLowerCase().includes(query) ||
          p.titleEn.toLowerCase().includes(query) ||
          (p.categoryKo && p.categoryKo.toLowerCase().includes(query)) ||
          (p.categoryEn && p.categoryEn.toLowerCase().includes(query)) ||
          (p.districtKo && p.districtKo.toLowerCase().includes(query)) ||
          (p.districtEn && p.districtEn.toLowerCase().includes(query)) ||
          (p.addressKo && p.addressKo.toLowerCase().includes(query))
        ) {
          seenTitles.add(cleanKey);
          list.push({
            id: p.id,
            titleKo: p.titleKo,
            titleEn: p.titleEn,
            categoryKo: p.categoryKo,
            categoryEn: p.categoryEn,
            addressKo: p.addressKo,
            addressEn: p.addressEn || p.addressKo,
            latitude: p.latitude,
            longitude: p.longitude,
            districtKo: p.districtKo,
            source: isGoogleMode ? 'GOOGLE_PLACES' : 'VERIFIED_DB',
          });
        }
      }
    });

    return list.slice(0, 8);
  }, [searchQuery, searchResults, isGoogleMode]);

  const handleAddSearchResult = (spot: {
    id?: string;
    titleKo: string;
    titleEn?: string;
    categoryKo?: string;
    categoryEn?: string;
    addressKo?: string;
    latitude?: number;
    longitude?: number;
    firstImage?: string;
    stationInfoKo?: string;
  }) => {
    const success = addPlaceToMyRoute({
      id: spot.id,
      titleKo: spot.titleKo,
      titleEn: spot.titleEn,
      categoryKo: spot.categoryKo,
      categoryEn: spot.categoryEn,
      addressRoadKo: spot.addressKo,
      latitude: spot.latitude,
      longitude: spot.longitude,
      firstImage: spot.firstImage,
      stationInfoKo: spot.stationInfoKo,
    });

    if (success) {
      const displayTitle = isGoogleMode ? (spot.titleEn || spot.titleKo) : spot.titleKo;
      setAddFeedback(displayTitle);
      setSelectedPlaceId(spot.id || spot.titleKo);
      setTimeout(() => setAddFeedback(null), 3500);
      setSearchQuery('');
      setIsSearchOpen(false);
    } else {
      setAddFeedback(isGoogleMode ? 'Already in your route' : '이미 루트에 추가된 장소입니다');
      setTimeout(() => setAddFeedback(null), 2500);
    }
  };

  const handleQuickAdd = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    const exactMatch = activeSearchResults.find(
      p => p.titleKo.toLowerCase() === trimmed.toLowerCase() || p.titleEn.toLowerCase() === trimmed.toLowerCase()
    );

    if (exactMatch) {
      handleAddSearchResult(exactMatch);
    } else {
      handleAddSearchResult({
        id: trimmed,
        titleKo: trimmed,
        titleEn: trimmed,
        categoryKo: '내가 등록한 장소',
        categoryEn: 'My Custom Spot',
      });
    }
  };

  // 공유받은 루트를 내 여행 루트로 복사 및 영구 저장 (방안 A 핵심 기능)
  const handleSaveSharedRouteAsMine = () => {
    if (!sharedRoutePlaces || sharedRoutePlaces.length === 0) return;
    saveImportedRouteAsMyRoute(sharedRoutePlaces);
    setIsViewingSharedRoute(false);
    
    // URL에서 공유 파라미터 깔끔하게 제거
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.delete('route');
      url.searchParams.delete('shared_route');
      url.searchParams.delete('route_data');
      window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
    }

    setToastMessage(language === 'KR' 
      ? '🎉 공유받은 여행 루트가 내 루트로 복사 및 저장되었습니다!' 
      : '🎉 Shared route successfully copied and saved to your route!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 공유받은 루트를 기존 내 여행 루트에 합치기
  const handleMergeSharedRouteWithMine = () => {
    if (!sharedRoutePlaces || sharedRoutePlaces.length === 0) return;
    const addedCount = mergeImportedRouteIntoMyRoute(sharedRoutePlaces);
    setIsViewingSharedRoute(false);

    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.delete('route');
      url.searchParams.delete('shared_route');
      url.searchParams.delete('route_data');
      window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
    }

    setToastMessage(language === 'KR' 
      ? `➕ ${addedCount}개의 신규 장소가 내 기존 루트에 추가되었습니다!` 
      : `➕ Added ${addedCount} new spots to your existing route!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 공유 미리보기 닫고 내 원래 루트로 복귀
  const handleDismissSharedRoute = () => {
    setIsViewingSharedRoute(false);
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.delete('route');
      url.searchParams.delete('shared_route');
      url.searchParams.delete('route_data');
      window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
    }
  };

  // 현재 루트 공유 링크 생성 (URL-safe base64)
  const getCurrentShareUrl = () => {
    if (typeof window === 'undefined') return '';
    const code = exportRouteToShareData(displayPlaces);
    return `${window.location.origin}${window.location.pathname}?route=${code}#my-route`;
  };

  // 링크 복사
  const handleCopyShareLink = () => {
    const url = getCurrentShareUrl();
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setShareUrlCopied(true);
      setTimeout(() => setShareUrlCopied(false), 2500);
      setToastMessage(language === 'KR' ? '🔗 내 여행 루트 공유 링크가 복사되었습니다!' : '🔗 Route share link copied!');
      setTimeout(() => setToastMessage(null), 3000);
    });
  };

  // 모바일 Native Web Share API (카카오톡, 메시지 등으로 바로 전송)
  const handleNativeShare = async () => {
    const url = getCurrentShareUrl();
    if (!url) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: language === 'KR' ? `내 부산 여행 루트 (총 ${displayPlaces.length}곳)` : `My Busan Route (${displayPlaces.length} Spots)`,
          text: language === 'KR' 
            ? `제가 계획한 부산 여행 루트(${displayPlaces.length}개 장소)입니다. 지도에서 최적 이동 동선을 확인해보세요!`
            : `Check out my custom Busan travel route with ${displayPlaces.length} spots!`,
          url: url,
        });
        return;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopyShareLink();
        }
      }
    } else {
      handleCopyShareLink();
    }
  };

  // 일정 텍스트 복사
  const handleCopySummaryText = () => {
    const text = formatRouteSummaryText(displayPlaces, language);
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setSummaryTextCopied(true);
      setTimeout(() => setSummaryTextCopied(false), 2500);
      setToastMessage(language === 'KR' ? '📋 일정표 텍스트가 클립보드에 복사되었습니다!' : '📋 Itinerary text copied!');
      setTimeout(() => setToastMessage(null), 3000);
    });
  };

  // 모바일 지도 최적화: 전체 동선 한눈에 맞춤 (Fit All Stops)
  const handleFitAllStops = () => {
    if (displayPlaces.length === 0) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    if (provider === 'NAVER' && naverMapRef.current && window.naver?.maps) {
      if (displayPlaces.length === 1) {
        naverMapRef.current.setCenter(new window.naver.maps.LatLng(displayPlaces[0].latitude, displayPlaces[0].longitude));
        naverMapRef.current.setZoom(15);
      } else {
        const bounds = new window.naver.maps.LatLngBounds();
        displayPlaces.forEach(p => bounds.extend(new window.naver.maps.LatLng(p.latitude, p.longitude)));
        naverMapRef.current.fitBounds(bounds, isMobile ? { top: 35, right: 25, bottom: 35, left: 25 } : { top: 50, right: 50, bottom: 50, left: 50 });
      }
    } else if (provider === 'GOOGLE' && googleMapRef.current && window.google?.maps) {
      if (displayPlaces.length === 1) {
        googleMapRef.current.setCenter({ lat: displayPlaces[0].latitude, lng: displayPlaces[0].longitude });
        googleMapRef.current.setZoom(15);
      } else {
        const bounds = new window.google.maps.LatLngBounds();
        displayPlaces.forEach(p => bounds.extend({ lat: p.latitude, lng: p.longitude }));
        googleMapRef.current.fitBounds(bounds, isMobile ? 30 : 50);
      }
    } else if (provider === 'LEAFLET' && leafletMapRef.current && window.L) {
      if (displayPlaces.length === 1) {
        leafletMapRef.current.setView([displayPlaces[0].latitude, displayPlaces[0].longitude], 15);
      } else {
        const latLngs = displayPlaces.map(p => [p.latitude, p.longitude] as [number, number]);
        const bounds = window.L.latLngBounds(latLngs);
        leafletMapRef.current.fitBounds(bounds, { padding: isMobile ? [30, 20] : [45, 45], maxZoom: 16 });
      }
    }
  };

  // 모바일 지도 최적화: GPS 내 현재 위치 확인
  const handleLocateUser = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setToastMessage(language === 'KR' ? '사용 중인 브라우저에서 위치 서비스를 지원하지 않습니다.' : 'Geolocation is not supported by your browser.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setGpsLocation({ lat: latitude, lng: longitude });

        if (provider === 'NAVER' && naverMapRef.current && window.naver?.maps) {
          const latLng = new window.naver.maps.LatLng(latitude, longitude);
          naverMapRef.current.panTo(latLng);
          if (userGpsMarkerRef.current) userGpsMarkerRef.current.setMap(null);
          userGpsMarkerRef.current = new window.naver.maps.Marker({
            position: latLng,
            map: naverMapRef.current,
            icon: {
              content: `<div style="display:flex; flex-direction:column; align-items:center; transform:translate(-50%, -50%);">
                <div style="width:16px; height:16px; background:#2563EB; border:3px solid #FFFFFF; border-radius:50%; box-shadow:0 0 0 6px rgba(37,99,235,0.25);"></div>
                <span style="font-size:10px; font-weight:bold; background:#2563EB; color:#fff; padding:1px 5px; border-radius:8px; margin-top:2px;">내 위치</span>
              </div>`,
              anchor: new window.naver.maps.Point(0, 0),
            },
          });
        } else if (provider === 'GOOGLE' && googleMapRef.current && window.google?.maps) {
          const pos = { lat: latitude, lng: longitude };
          googleMapRef.current.panTo(pos);
          googleMapRef.current.setZoom(15);
          if (userGpsMarkerRef.current) userGpsMarkerRef.current.setMap(null);
          userGpsMarkerRef.current = new window.google.maps.Marker({
            position: pos,
            map: googleMapRef.current,
            title: language === 'KR' ? '내 현재 위치' : 'My Location',
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#2563EB',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 3,
            },
          });
        } else if (provider === 'LEAFLET' && leafletMapRef.current && window.L) {
          leafletMapRef.current.setView([latitude, longitude], 15);
          if (userGpsMarkerRef.current) userGpsMarkerRef.current.remove();
          const L = window.L;
          const gpsIcon = L.divIcon({
            html: `<div style="display:flex; flex-direction:column; align-items:center; transform:translate(-50%, -50%);">
              <div style="width:16px; height:16px; background:#2563EB; border:3px solid #FFFFFF; border-radius:50%; box-shadow:0 0 0 6px rgba(37,99,235,0.25);"></div>
              <span style="font-size:10px; font-weight:bold; background:#2563EB; color:#fff; padding:1px 5px; border-radius:8px; margin-top:2px;">내 위치</span>
            </div>`,
            className: 'custom-my-route-marker',
            iconSize: [0, 0],
          });
          userGpsMarkerRef.current = L.marker([latitude, longitude], { icon: gpsIcon }).addTo(leafletMapRef.current);
        }

        setToastMessage(language === 'KR' ? '📍 현재 GPS 위치를 지도에 표시했습니다.' : '📍 Located your current position on the map.');
        setTimeout(() => setToastMessage(null), 3000);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        setToastMessage(language === 'KR' ? '위치 권한을 허용하시면 내 위치를 지도에서 확인할 수 있습니다.' : 'Please allow location permission to view your position.');
        setTimeout(() => setToastMessage(null), 3000);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Map Instance Refs
  const naverMapRef = useRef<any>(null);
  const naverMarkersRef = useRef<any[]>([]);
  const naverPolylineRef = useRef<any>(null);
  const naverInfoWindowRef = useRef<any>(null);

  const googleMapRef = useRef<any>(null);
  const googleMarkersRef = useRef<any[]>([]);
  const googlePolylineRef = useRef<any>(null);
  const googleInfoWindowRef = useRef<any>(null);

  const leafletMapRef = useRef<any>(null);
  const leafletMarkersRef = useRef<any[]>([]);
  const leafletPolylineRef = useRef<any>(null);

  // Synchronize preferred engine with current language
  useEffect(() => {
    if (language === 'KR') {
      if (window.NAVER_MAPS_AUTH_FAILED || naverAuthFailed) {
        setProvider('LEAFLET');
      } else {
        setProvider('NAVER');
      }
    } else {
      if (window.GOOGLE_MAPS_AUTH_FAILED || googleAuthFailed) {
        setProvider('LEAFLET');
      } else {
        setProvider('GOOGLE');
      }
    }
  }, [language, naverAuthFailed, googleAuthFailed]);

  // Clean all map instances and clear container
  const cleanupAllMaps = () => {
    // 0. Clean User GPS marker
    if (userGpsMarkerRef.current) {
      try {
        if (userGpsMarkerRef.current.setMap) userGpsMarkerRef.current.setMap(null);
        if (userGpsMarkerRef.current.remove) userGpsMarkerRef.current.remove();
      } catch {}
      userGpsMarkerRef.current = null;
    }

    // 1. Naver Maps
    if (naverInfoWindowRef.current) {
      try { naverInfoWindowRef.current.close(); } catch {}
      naverInfoWindowRef.current = null;
    }
    naverMarkersRef.current.forEach(m => {
      try { m.setMap(null); } catch {}
    });
    naverMarkersRef.current = [];
    if (naverPolylineRef.current) {
      try { naverPolylineRef.current.setMap(null); } catch {}
      naverPolylineRef.current = null;
    }
    if (naverMapRef.current) {
      try {
        if (window.naver?.maps?.Event) {
          window.naver.maps.Event.clearInstanceListeners(naverMapRef.current);
        }
      } catch {}
      naverMapRef.current = null;
    }

    // 2. Google Maps
    if (googleInfoWindowRef.current) {
      try { googleInfoWindowRef.current.close(); } catch {}
      googleInfoWindowRef.current = null;
    }
    googleMarkersRef.current.forEach(m => {
      try { m.setMap(null); } catch {}
    });
    googleMarkersRef.current = [];
    if (googlePolylineRef.current) {
      try { googlePolylineRef.current.setMap(null); } catch {}
      googlePolylineRef.current = null;
    }
    if (googleMapRef.current) {
      try {
        if (window.google?.maps?.event) {
          window.google.maps.event.clearInstanceListeners(googleMapRef.current);
        }
      } catch {}
      googleMapRef.current = null;
    }

    // 3. Leaflet
    leafletMarkersRef.current.forEach(m => {
      try { m.remove(); } catch {}
    });
    leafletMarkersRef.current = [];
    if (leafletPolylineRef.current) {
      try { leafletPolylineRef.current.remove(); } catch {}
      leafletPolylineRef.current = null;
    }
    if (leafletMapRef.current) {
      try { leafletMapRef.current.remove(); } catch {}
      leafletMapRef.current = null;
    }

    // Reset container DOM and leaflet ID
    if (mapContainerRef.current) {
      try {
        delete (mapContainerRef.current as any)._leaflet_id;
      } catch {}
      mapContainerRef.current.innerHTML = '';
    }
  };

  // 주소 복사 핸들러
  const handleCopy = (e: React.MouseEvent, id: string, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // --------------------------------------------------------------------------
  // 1. NAVER MAPS RENDERER (모바일 정밀 좌표 및 핀포인트 닷 최적화)
  // --------------------------------------------------------------------------
  const renderNaverMap = () => {
    if (!mapContainerRef.current || !window.naver?.maps) return;

    cleanupAllMaps();

    try {
      const centerLat = displayPlaces.length > 0 ? displayPlaces[0].latitude : 35.1587;
      const centerLng = displayPlaces.length > 0 ? displayPlaces[0].longitude : 129.1186;

      const map = new window.naver.maps.Map(mapContainerRef.current, {
        center: new window.naver.maps.LatLng(centerLat, centerLng),
        zoom: displayPlaces.length === 1 ? 15 : 12,
        minZoom: 9,
        maxZoom: 19,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
        mapTypeControl: false,
        draggable: true,
        pinchZoom: true,
      });
      naverMapRef.current = map;

      if (displayPlaces.length === 0) return;

      const naverLatLngs: any[] = [];
      const bounds = new window.naver.maps.LatLngBounds();
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      const mobilePadding = isMobile ? { top: 35, right: 25, bottom: 35, left: 25 } : { top: 50, right: 50, bottom: 50, left: 50 };

      displayPlaces.forEach((place, index) => {
        const stepNum = index + 1;
        const latLng = new window.naver.maps.LatLng(place.latitude, place.longitude);
        naverLatLngs.push(latLng);
        bounds.extend(latLng);

        const isSelected = selectedPlaceId === place.id;
        const markerBgColor = isSelected ? '#D95338' : '#0A2540';
        const markerBorderColor = isSelected ? '#FBBF24' : '#FFFFFF';

        // 정밀 좌표 핀포인트 닷(Pinpoint Dot) 포함 마커 HTML
        const markerContent = `
          <div style="display:flex; flex-direction:column; align-items:center; transform:translate(-50%, -100%); cursor:pointer;">
            <div style="background:${markerBgColor}; color:#ffffff; font-size:11px; font-weight:800; padding:4px 9px; border-radius:12px; white-space:nowrap; box-shadow:0 3px 10px rgba(0,0,0,0.3); border:2px solid ${markerBorderColor}; display:flex; align-items:center; gap:5px;">
              <span style="background:#F59E0B; color:#0A2540; font-size:10px; font-weight:900; width:16px; height:16px; border-radius:50%; display:flex; align-items:center; justify-content:center;">${stepNum}</span>
              <span>${place.titleKo}</span>
            </div>
            <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid ${markerBgColor}; margin-top:-1px;"></div>
            <div style="width:8px; height:8px; background:${isSelected ? '#EF4444' : '#0A2540'}; border:2px solid #FFFFFF; border-radius:50%; box-shadow:0 1px 4px rgba(0,0,0,0.4); margin-top:-1px;"></div>
          </div>
        `;

        const marker = new window.naver.maps.Marker({
          position: latLng,
          map,
          icon: {
            content: markerContent,
            anchor: new window.naver.maps.Point(0, 0),
          },
        });

        const infoContent = `
          <div style="padding:10px 12px; font-family:sans-serif; text-align:left; min-width:210px; max-width:270px;">
            <div style="font-size:10px; font-weight:bold; color:#F59E0B; margin-bottom:2px;">루트 순서: ${stepNum}번째 경유지</div>
            <div style="font-size:13px; font-weight:bold; color:#0A2540; margin-bottom:4px;">${place.titleKo}</div>
            <div style="font-size:11px; color:#64748B; margin-bottom:8px; line-height:1.3;">${place.addressRoadKo || '부산광역시'}</div>
            <div style="display:flex; flex-wrap:wrap; gap:5px;">
              <a href="https://map.naver.com/v5/search/${encodeURIComponent(place.titleKo)}" target="_blank" rel="noopener noreferrer" style="display:inline-block; font-size:10px; font-weight:bold; background:#03C75A; color:#ffffff; padding:4px 8px; border-radius:4px; text-decoration:none;">네이버지도 길찾기</a>
              <a href="https://map.kakao.com/link/search/${encodeURIComponent(place.titleKo)}" target="_blank" rel="noopener noreferrer" style="display:inline-block; font-size:10px; font-weight:bold; background:#FEE500; color:#191919; padding:4px 8px; border-radius:4px; text-decoration:none;">카카오맵</a>
            </div>
          </div>
        `;

        const infoWindow = new window.naver.maps.InfoWindow({
          content: infoContent,
          borderColor: '#E5E2DC',
          borderWidth: 1,
          disableAnchor: true,
          pixelOffset: new window.naver.maps.Point(0, -38),
        });

        window.naver.maps.Event.addListener(marker, 'click', () => {
          setSelectedPlaceId(place.id);
          if (naverInfoWindowRef.current) {
            naverInfoWindowRef.current.close();
          }
          infoWindow.open(map, marker);
          naverInfoWindowRef.current = infoWindow;
        });

        naverMarkersRef.current.push(marker);
      });

      // 경로선 (Polyline)
      if (naverLatLngs.length > 1) {
        naverPolylineRef.current = new window.naver.maps.Polyline({
          map,
          path: naverLatLngs,
          strokeColor: '#0A2540',
          strokeWeight: 4,
          strokeOpacity: 0.85,
          strokeStyle: 'shortdash',
        });
      }

      // 영역 자동 맞춤 (단일 장소일 땐 적정 확대율 유지)
      if (naverLatLngs.length === 1) {
        map.setCenter(naverLatLngs[0]);
        map.setZoom(15);
      } else if (naverLatLngs.length > 1) {
        map.fitBounds(bounds, mobilePadding);
      }

      // 모바일 렌더링 지연 및 화면 크기 변화 대응 재맞춤
      setTimeout(() => {
        if (naverMapRef.current && window.naver?.maps?.Event) {
          window.naver.maps.Event.trigger(naverMapRef.current, 'resize');
          if (naverLatLngs.length === 1) {
            naverMapRef.current.setCenter(naverLatLngs[0]);
            naverMapRef.current.setZoom(15);
          } else if (naverLatLngs.length > 1) {
            naverMapRef.current.fitBounds(bounds, mobilePadding);
          }
        }
      }, 200);
    } catch (err) {
      console.warn('Naver map initialization failed, falling back to Leaflet:', err);
      setNaverAuthFailed(true);
      setProvider('LEAFLET');
    }
  };

  // --------------------------------------------------------------------------
  // 2. GOOGLE MAPS RENDERER (모바일 정밀 좌표 및 화면 맞춤 최적화)
  // --------------------------------------------------------------------------
  const renderGoogleMap = () => {
    if (!mapContainerRef.current || !window.google?.maps) return;

    cleanupAllMaps();

    try {
      const centerLat = displayPlaces.length > 0 ? displayPlaces[0].latitude : 35.1587;
      const centerLng = displayPlaces.length > 0 ? displayPlaces[0].longitude : 129.1186;

      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom: displayPlaces.length === 1 ? 15 : 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        gestureHandling: 'greedy',
      });
      googleMapRef.current = map;

      if (displayPlaces.length === 0) return;

      const googleCoords: any[] = [];
      const bounds = new window.google.maps.LatLngBounds();
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      const paddingVal = isMobile ? 30 : 50;

      displayPlaces.forEach((place, index) => {
        const stepNum = index + 1;
        const coord = { lat: place.latitude, lng: place.longitude };
        googleCoords.push(coord);
        bounds.extend(coord);

        const isSelected = selectedPlaceId === place.id;
        const markerColor = isSelected ? '#D95338' : '#0A2540';

        const marker = new window.google.maps.Marker({
          position: coord,
          map,
          title: place.titleEn || place.titleKo,
          label: {
            text: `${stepNum}`,
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '11px',
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 13,
            fillColor: markerColor,
            fillOpacity: 1,
            strokeColor: isSelected ? '#FBBF24' : '#FFFFFF',
            strokeWeight: 2.5,
          },
        });

        const infoContent = `
          <div style="padding:8px 10px; font-family:sans-serif; text-align:left; min-width:200px;">
            <div style="font-size:10px; font-weight:bold; color:#F59E0B; margin-bottom:2px;">Stop #${stepNum} in Route</div>
            <div style="font-size:13px; font-weight:bold; color:#0A2540; margin-bottom:3px;">${place.titleEn || place.titleKo}</div>
            <div style="font-size:11px; color:#64748B; margin-bottom:6px;">${place.addressRoadKo || 'Busan, South Korea'}</div>
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((place.titleEn || place.titleKo) + ' Busan')}" target="_blank" rel="noopener noreferrer" style="display:inline-block; font-size:10px; font-weight:bold; background:#1A73E8; color:#ffffff; padding:4px 8px; border-radius:4px; text-decoration:none;">View in Google Maps</a>
          </div>
        `;

        const infoWindow = new window.google.maps.InfoWindow({
          content: infoContent,
        });

        marker.addListener('click', () => {
          setSelectedPlaceId(place.id);
          if (googleInfoWindowRef.current) {
            googleInfoWindowRef.current.close();
          }
          infoWindow.open(map, marker);
          googleInfoWindowRef.current = infoWindow;
        });

        googleMarkersRef.current.push(marker);
      });

      // 경로선 (Polyline)
      if (googleCoords.length > 1) {
        googlePolylineRef.current = new window.google.maps.Polyline({
          map,
          path: googleCoords,
          strokeColor: '#0A2540',
          strokeOpacity: 0.85,
          strokeWeight: 4,
        });
      }

      // 영역 맞춤
      if (googleCoords.length === 1) {
        map.setCenter(googleCoords[0]);
        map.setZoom(15);
      } else if (googleCoords.length > 1) {
        map.fitBounds(bounds, paddingVal);
      }

      setTimeout(() => {
        if (googleMapRef.current && window.google?.maps?.event) {
          window.google.maps.event.trigger(googleMapRef.current, 'resize');
          if (googleCoords.length === 1) {
            googleMapRef.current.setCenter(googleCoords[0]);
            googleMapRef.current.setZoom(15);
          } else if (googleCoords.length > 1) {
            googleMapRef.current.fitBounds(bounds, paddingVal);
          }
        }
      }, 200);
    } catch (err) {
      console.warn('Google Maps initialization failed, falling back to Leaflet:', err);
      setGoogleAuthFailed(true);
      setProvider('LEAFLET');
    }
  };

  // --------------------------------------------------------------------------
  // 3. LEAFLET MAPS RENDERER (Universal Fallback, 모바일 핀포인트 닷 최적화)
  // --------------------------------------------------------------------------
  const renderLeafletMap = () => {
    if (!mapContainerRef.current || !window.L) return;

    cleanupAllMaps();
    const L = window.L;

    try {
      const centerLat = displayPlaces.length > 0 ? displayPlaces[0].latitude : 35.1587;
      const centerLng = displayPlaces.length > 0 ? displayPlaces[0].longitude : 129.1186;

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([centerLat, centerLng], displayPlaces.length === 1 ? 15 : 12);
      leafletMapRef.current = map;

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      if (displayPlaces.length === 0) return;

      const latLngs: [number, number][] = [];
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

      displayPlaces.forEach((place, index) => {
        const stepNum = index + 1;
        const latLng: [number, number] = [place.latitude, place.longitude];
        latLngs.push(latLng);

        const isSelected = selectedPlaceId === place.id;
        const markerBgColor = isSelected ? '#D95338' : '#0A2540';
        const markerBorderColor = isSelected ? '#FBBF24' : '#FFFFFF';

        // 정밀 좌표 핀포인트 닷(Pinpoint Dot) 포함
        const markerHtml = `
          <div style="display:flex; flex-direction:column; align-items:center; transform:translate(-50%, -100%); cursor:pointer; pointer-events:auto;">
            <div style="background:${markerBgColor}; color:#ffffff; font-size:11px; font-weight:800; padding:4px 9px; border-radius:12px; white-space:nowrap; box-shadow:0 3px 10px rgba(0,0,0,0.3); border:2px solid ${markerBorderColor}; display:flex; align-items:center; gap:5px;">
              <span style="background:#F59E0B; color:#0A2540; font-size:10px; font-weight:900; width:16px; height:16px; border-radius:50%; display:flex; align-items:center; justify-content:center;">${stepNum}</span>
              <span>${language === 'KR' ? place.titleKo : (place.titleEn || place.titleKo)}</span>
            </div>
            <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid ${markerBgColor}; margin-top:-1px;"></div>
            <div style="width:8px; height:8px; background:${isSelected ? '#EF4444' : '#0A2540'}; border:2px solid #FFFFFF; border-radius:50%; box-shadow:0 1px 4px rgba(0,0,0,0.4); margin-top:-1px;"></div>
          </div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: 'custom-my-route-marker',
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker(latLng, { icon }).addTo(map);

        const popupContent = document.createElement('div');
        popupContent.style.textAlign = 'left';
        popupContent.style.padding = '4px';
        popupContent.style.minWidth = '190px';
        popupContent.innerHTML = `
          <div style="font-size:10px; font-weight:bold; color:#F59E0B; margin-bottom:2px;">
            ${language === 'KR' ? `루트 순서: ${stepNum}번째 장소` : `Route Stop #${stepNum}`}
          </div>
          <div style="font-size:13px; font-weight:bold; color:#0A2540; margin-bottom:4px;">
            ${language === 'KR' ? place.titleKo : (place.titleEn || place.titleKo)}
          </div>
          <div style="font-size:11px; color:#64748B; margin-bottom:6px;">
            ${place.addressRoadKo || '부산광역시'}
          </div>
          <div style="display:flex; gap:4px;">
            <a href="https://map.naver.com/v5/search/${encodeURIComponent(place.titleKo)}" target="_blank" rel="noopener noreferrer" style="display:inline-block; font-size:10px; font-weight:bold; background:#03C75A; color:#ffffff; padding:3px 7px; border-radius:4px; text-decoration:none;">네이버지도</a>
            <a href="https://map.kakao.com/link/search/${encodeURIComponent(place.titleKo)}" target="_blank" rel="noopener noreferrer" style="display:inline-block; font-size:10px; font-weight:bold; background:#FEE500; color:#191919; padding:3px 7px; border-radius:4px; text-decoration:none;">카카오맵</a>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          setSelectedPlaceId(place.id);
        });

        leafletMarkersRef.current.push(marker);
      });

      if (latLngs.length > 1) {
        leafletPolylineRef.current = L.polyline(latLngs, {
          color: '#0A2540',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 8',
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);
      }

      if (latLngs.length === 1) {
        map.setView(latLngs[0], 15);
      } else if (latLngs.length > 1) {
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, {
          padding: isMobile ? [30, 20] : [45, 45],
          maxZoom: 16,
        });
      }

      setTimeout(() => {
        if (leafletMapRef.current) {
          leafletMapRef.current.invalidateSize();
          if (latLngs.length === 1) {
            leafletMapRef.current.setView(latLngs[0], 15);
          } else if (latLngs.length > 1) {
            const bounds = L.latLngBounds(latLngs);
            leafletMapRef.current.fitBounds(bounds, {
              padding: isMobile ? [30, 20] : [45, 45],
              maxZoom: 16,
            });
          }
        }
      }, 200);
    } catch (err) {
      console.error('Leaflet map error:', err);
    }
  };

  // --------------------------------------------------------------------------
  // Map Script & Lifecycle Loader
  // --------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    // Handle Naver Maps Auth Error
    window.navermaps_auth_error = () => {
      console.warn('[MyTravelRouteMap] Naver Maps auth error on origin:', window.location.origin);
      if (isMounted) {
        setNaverAuthFailed(true);
        window.NAVER_MAPS_AUTH_FAILED = true;
        setProvider('LEAFLET');
      }
    };

    // Handle Google Maps Auth Error
    window.gm_authFailure = () => {
      console.warn('[MyTravelRouteMap] Google Maps auth failure on origin:', window.location.origin);
      if (isMounted) {
        setGoogleAuthFailed(true);
        window.GOOGLE_MAPS_AUTH_FAILED = true;
        setProvider('LEAFLET');
      }
    };

    // 1. NAVER MAPS
    if (provider === 'NAVER') {
      const activeClientId = (customClientId || import.meta.env.VITE_NAVER_CLIENT_ID || 'jig5o1hthp').trim();

      if (window.naver?.maps) {
        renderNaverMap();
      } else {
        const scriptId = 'naver-maps-script';
        let script = document.getElementById(scriptId) as HTMLScriptElement;

        if (script && !script.src.includes(`ncpClientId=${activeClientId}`)) {
          script.remove();
          script = null as any;
        }

        if (!script) {
          script = document.createElement('script');
          script.id = scriptId;
          script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${activeClientId}&ncpKeyId=${activeClientId}&submodules=geocoder`;
          script.async = true;
          script.onload = () => {
            setTimeout(() => {
              if (isMounted) {
                if (window.naver?.maps) {
                  renderNaverMap();
                } else {
                  setNaverAuthFailed(true);
                  setProvider('LEAFLET');
                }
              }
            }, 200);
          };
          script.onerror = () => {
            if (isMounted) {
              setNaverAuthFailed(true);
              setProvider('LEAFLET');
            }
          };
          document.head.appendChild(script);
        } else {
          const timer = setInterval(() => {
            if (window.naver?.maps) {
              clearInterval(timer);
              if (isMounted) renderNaverMap();
            }
          }, 100);
          setTimeout(() => clearInterval(timer), 3000);
        }
      }
    }

    // 2. GOOGLE MAPS
    if (provider === 'GOOGLE') {
      const defaultKey = 'AIzaSyDEKgT4EZLHN5agdtkadl7q8NHaeO_g4DE';
      const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || defaultKey).trim();

      if (window.google?.maps) {
        renderGoogleMap();
      } else {
        const scriptId = 'google-maps-script';
        let script = document.getElementById(scriptId) as HTMLScriptElement;
        if (!script) {
          script = document.createElement('script');
          script.id = scriptId;
          script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&hl=en&language=en&libraries=places`;
          script.async = true;
          script.onload = () => {
            setTimeout(() => {
              if (isMounted) {
                if (window.google?.maps && !window.GOOGLE_MAPS_AUTH_FAILED) {
                  renderGoogleMap();
                } else {
                  setGoogleAuthFailed(true);
                  setProvider('LEAFLET');
                }
              }
            }, 200);
          };
          script.onerror = () => {
            if (isMounted) {
              setGoogleAuthFailed(true);
              setProvider('LEAFLET');
            }
          };
          document.head.appendChild(script);
        } else {
          const timer = setInterval(() => {
            if (window.google?.maps) {
              clearInterval(timer);
              if (isMounted) renderGoogleMap();
            }
          }, 100);
          setTimeout(() => clearInterval(timer), 3000);
        }
      }
    }

    // 3. LEAFLET
    if (provider === 'LEAFLET') {
      if (window.L) {
        renderLeafletMap();
      } else {
        const cssId = 'leaflet-css';
        if (!document.getElementById(cssId)) {
          const link = document.createElement('link');
          link.id = cssId;
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        const scriptId = 'leaflet-script';
        let script = document.getElementById(scriptId) as HTMLScriptElement;
        if (!script) {
          script = document.createElement('script');
          script.id = scriptId;
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.async = true;
          script.onload = () => {
            setTimeout(() => {
              if (isMounted) renderLeafletMap();
            }, 100);
          };
          document.head.appendChild(script);
        } else {
          const timer = setInterval(() => {
            if (window.L) {
              clearInterval(timer);
              if (isMounted) renderLeafletMap();
            }
          }, 100);
          setTimeout(() => clearInterval(timer), 3000);
        }
      }
    }

    return () => {
      isMounted = false;
      cleanupAllMaps();
    };
  }, [provider, displayPlaces, customClientId]);

  // 컨테이너 크기 변화 시 모바일 맵 리사이즈 옵저버
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (provider === 'NAVER' && naverMapRef.current && window.naver?.maps?.Event) {
        window.naver.maps.Event.trigger(naverMapRef.current, 'resize');
      } else if (provider === 'GOOGLE' && googleMapRef.current && window.google?.maps?.event) {
        window.google.maps.event.trigger(googleMapRef.current, 'resize');
      } else if (provider === 'LEAFLET' && leafletMapRef.current) {
        leafletMapRef.current.invalidateSize();
      }
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, [provider]);

  // 특정 장소 카드 클릭 시 지도에서 해당 위치로 포커스 이동 (모바일 부드러운 스크롤 연동)
  const handleFocusPlace = (place: MyRoutePlace) => {
    setSelectedPlaceId(place.id);

    if (typeof window !== 'undefined' && window.innerWidth < 768 && mapContainerRef.current) {
      mapContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (provider === 'NAVER' && naverMapRef.current && window.naver?.maps) {
      naverMapRef.current.panTo(new window.naver.maps.LatLng(place.latitude, place.longitude));
      const idx = displayPlaces.findIndex(p => p.id === place.id);
      if (idx !== -1 && naverMarkersRef.current[idx]) {
        window.naver.maps.Event.trigger(naverMarkersRef.current[idx], 'click');
      }
    } else if (provider === 'GOOGLE' && googleMapRef.current && window.google?.maps) {
      googleMapRef.current.panTo({ lat: place.latitude, lng: place.longitude });
      googleMapRef.current.setZoom(15);
      const idx = displayPlaces.findIndex(p => p.id === place.id);
      if (idx !== -1 && googleMarkersRef.current[idx]) {
        window.google.maps.event.trigger(googleMarkersRef.current[idx], 'click');
      }
    } else if (provider === 'LEAFLET' && leafletMapRef.current) {
      leafletMapRef.current.setView([place.latitude, place.longitude], 15, { animate: true });
      const idx = displayPlaces.findIndex(p => p.id === place.id);
      if (idx !== -1 && leafletMarkersRef.current[idx]) {
        leafletMarkersRef.current[idx].openPopup();
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left font-sans">
      {/* 1. Header (Clean Text) & Route Actions */}
      <div className="space-y-3 border-b border-slate-200 pb-5 text-left">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{language === 'KR' ? '내 여행 루트 (맞춤 지도)' : 'My Travel Route (Custom Map)'}</span>
                <span className="text-xs sm:text-sm font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {displayPlaces.length}{language === 'KR' ? '곳 저장' : ' spots'}
                </span>
              </h2>
            </div>
          </div>

          {displayPlaces.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {/* 공유하기 버튼 (방안 A: URL 공유 링크 & 내 루트 복사) */}
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title={language === 'KR' ? '친구에게 내 여행 루트 공유 링크 보내기' : 'Share Route Link with Friends'}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{language === 'KR' ? '루트 공유하기' : 'Share Route'}</span>
              </button>

              {/* 일정 텍스트 복사 버튼 */}
              <button
                type="button"
                onClick={handleCopySummaryText}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title={language === 'KR' ? '일정표 텍스트 클립보드 복사' : 'Copy Itinerary Text'}
              >
                {summaryTextCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{summaryTextCopied ? (language === 'KR' ? '복사됨!' : 'Copied!') : (language === 'KR' ? '일정 복사' : 'Copy Text')}</span>
              </button>

              {!isViewingSharedRoute && (
                <button
                  type="button"
                  onClick={clear}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'KR' ? '루트 비우기' : 'Clear All'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
          {language === 'KR'
            ? '내가 즐겨찾기(⭐)한 장소들을 지도 위에 순서대로 연결하여 최적의 이동 동선을 한눈에 보여줍니다. 순서를 변경하거나 장소를 추가하여 나만의 여행 코스를 완성하세요.'
            : 'View your bookmarked destinations connected on an interactive map. Reorder stops and plan your personalized Busan itinerary.'}
        </p>

        {/* 공유받은 루트 확인 배너 (방안 A: 친구가 보낸 루트를 내 루트로 저장/복사) */}
        {isViewingSharedRoute && sharedRoutePlaces && (
          <div className="p-4 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 rounded-xl border-2 border-amber-400/50 shadow-xs space-y-3 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Share2 className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2 flex-wrap">
                    <span>{language === 'KR' ? '🔗 친구가 공유한 여행 루트를 보고 계십니다' : '🔗 Viewing a Shared Travel Route'}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-white font-mono font-bold">
                      {sharedRoutePlaces.length}{language === 'KR' ? '곳 연결' : ' stops'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {language === 'KR'
                      ? '이 루트를 내 여행 루트로 복사하여 저장하면, 자유롭게 순서를 바꾸거나 나만의 여행지를 추가할 수 있습니다.'
                      : 'Save this route to your own customized travel itinerary to edit stops or add custom places.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button
                  type="button"
                  onClick={handleSaveSharedRouteAsMine}
                  className="flex-1 sm:flex-initial px-3.5 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-lg font-extrabold text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'KR' ? '내 루트로 저장 (복사하기)' : 'Save as My Route'}</span>
                </button>

                {places.length > 0 && (
                  <button
                    type="button"
                    onClick={handleMergeSharedRouteWithMine}
                    className="px-3 py-2 bg-white hover:bg-slate-50 border border-amber-300 text-amber-900 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'KR' ? '기존 내 루트에 추가' : 'Merge to My Route'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDismissSharedRoute}
                  className="px-2.5 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
                  title={language === 'KR' ? '내 원래 루트로 돌아가기' : 'Return to my original route'}
                >
                  {language === 'KR' ? '내 원래 루트 보기' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. 대화형 지도 영역 (Numbered Markers & Polyline Route) */}
      <div className="bg-white rounded-xl border border-[#E5E2DC] overflow-hidden shadow-xs relative">
        
        {/* Naver Cloud Domain Notice Banner (shown if Naver Maps API has not whitelisted this domain) */}
        {language === 'KR' && naverAuthFailed && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-3.5 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-amber-950 gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="shrink-0 text-sm">⚠️</span>
              <span className="font-semibold leading-tight text-[11.5px]">
                현재 접속 주소가 네이버 클라우드 플랫폼(NCP)에 등록되어 있지 않아 <strong>대체 고해상도 지도로 안전하게 자동 전환</strong>되었습니다.
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin);
                  setDomainCopied(true);
                  setTimeout(() => setDomainCopied(false), 2000);
                }}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-md font-bold text-[10.5px] transition cursor-pointer flex items-center gap-1"
                title="네이버 콘솔에 등록할 현재 도메인 주소 복사"
              >
                {domainCopied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3 text-white" />}
                <span>{domainCopied ? '복사 완료' : '현재 도메인 복사'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTempClientIdInput(customClientId);
                  setShowSettingsModal(true);
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-md font-bold text-[10.5px] transition cursor-pointer flex items-center gap-1"
              >
                <Settings className="w-3 h-3 text-white" />
                <span>NCP 설정</span>
              </button>
            </div>
          </div>
        )}

        {/* Map Header Bar */}
        <div className="p-3 bg-[#FBFBF9] border-b border-[#E5E2DC] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-[#0A2540]">
            <Navigation className="w-4 h-4 text-amber-500" />
            <span>{language === 'KR' ? '전체 루트 동선 지도' : 'Full Route Map'}</span>
            
            {/* Map Engine Indicator Badge */}
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded-md font-bold bg-white border border-[#E5E2DC] text-[#0A2540]">
              <span className={`w-2 h-2 rounded-full ${provider === 'NAVER' ? 'bg-[#03C75A]' : provider === 'GOOGLE' ? 'bg-[#1A73E8]' : 'bg-[#F59E0B]'}`} />
              <span>
                {provider === 'NAVER'
                  ? '네이버 지도 (Naver Maps)'
                  : provider === 'GOOGLE'
                  ? '구글 지도 (Google Maps)'
                  : (language === 'KR' ? '대체 고해상도 지도 (OpenStreetMap)' : 'OpenStreetMap')}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {displayPlaces.length > 1 && (
              <span className="text-[11px] font-mono text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                {language === 'KR' ? `총 ${displayPlaces.length}개 지점 연결됨` : `${displayPlaces.length} connected`}
              </span>
            )}

            {/* 모바일 최적화: 전체 맞춤 버튼 */}
            {displayPlaces.length > 0 && (
              <button
                type="button"
                onClick={handleFitAllStops}
                className="px-2 py-1 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 rounded-md border border-[#E5E2DC] text-[11px] font-bold flex items-center gap-1 cursor-pointer transition shadow-2xs"
                title={language === 'KR' ? '전체 루트 동선을 화면 중앙에 맞춤' : 'Fit all route stops in view'}
              >
                <Maximize2 className="w-3 h-3 text-[#0A2540]" />
                <span className="hidden xs:inline">{language === 'KR' ? '전체 맞춤' : 'Fit View'}</span>
              </button>
            )}

            {/* 모바일 최적화: GPS 내 현재 위치 확인 버튼 */}
            <button
              type="button"
              onClick={handleLocateUser}
              disabled={isLocating}
              className="px-2 py-1 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 rounded-md border border-[#E5E2DC] text-[11px] font-bold flex items-center gap-1 cursor-pointer transition shadow-2xs disabled:opacity-50"
              title={language === 'KR' ? '모바일 GPS로 내 현재 위치 확인' : 'Locate my position via GPS'}
            >
              <Locate className={`w-3 h-3 text-blue-600 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">{language === 'KR' ? '내 위치' : 'GPS'}</span>
            </button>

            {/* Optional Map Switcher Toggle */}
            <div className="flex items-center bg-[#F1EFEC] p-0.5 rounded-md border border-[#E5E2DC] text-[10px] font-bold">
              <button
                type="button"
                onClick={() => {
                  setProvider('NAVER');
                  setNaverAuthFailed(false);
                }}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  provider === 'NAVER' ? 'bg-white text-[#03C75A] shadow-2xs font-extrabold' : 'text-[#718096] hover:text-[#11161B]'
                }`}
                title="네이버 지도 엔진으로 보기"
              >
                네이버
              </button>
              <button
                type="button"
                onClick={() => {
                  setProvider('GOOGLE');
                  setGoogleAuthFailed(false);
                }}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  provider === 'GOOGLE' ? 'bg-white text-[#1A73E8] shadow-2xs font-extrabold' : 'text-[#718096] hover:text-[#11161B]'
                }`}
                title="Google Maps 엔진으로 보기"
              >
                Google
              </button>
              <button
                type="button"
                onClick={() => setProvider('LEAFLET')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  provider === 'LEAFLET' ? 'bg-white text-[#0A2540] shadow-2xs font-extrabold' : 'text-[#718096] hover:text-[#11161B]'
                }`}
                title="대체 지도(OSM)로 보기"
              >
                OSM
              </button>
            </div>
          </div>
        </div>

        {/* Map Canvas Container */}
        <div
          ref={mapContainerRef}
          className="w-full h-[340px] sm:h-[420px] lg:h-[460px] bg-slate-100 relative z-0 route-map-canvas"
        />

        {/* 모바일 최적화: 가로 스크롤 경유지 퀵 네비게이션 스트립 */}
        {displayPlaces.length > 0 && (
          <div className="bg-[#FBFBF9] border-t border-[#E5E2DC] p-2 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold text-slate-400 shrink-0 uppercase tracking-wider pl-1">
              {language === 'KR' ? '동선 순서:' : 'Route:'}
            </span>
            {displayPlaces.map((p, idx) => {
              const stepNum = idx + 1;
              const isSelected = selectedPlaceId === p.id;
              return (
                <button
                  key={`quick-${p.id || idx}`}
                  type="button"
                  onClick={() => handleFocusPlace(p)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-xs ring-2 ring-amber-400/40'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9.5px] font-black ${
                    isSelected ? 'bg-amber-400 text-[#0A2540]' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {stepNum}
                  </span>
                  <span className="truncate max-w-[110px] sm:max-w-[150px]">
                    {language === 'KR' ? p.titleKo : (p.titleEn || p.titleKo)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {displayPlaces.length === 0 && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'KR' ? '아직 즐겨찾기한 장소가 없습니다' : 'No places added to your route yet'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {language === 'KR'
                  ? '각 코스 추천 및 관광지 목록에서 [⭐ 루트 추가] 버튼을 누르면 이곳 지도 위에 나만의 여행 동선이 자동으로 생성됩니다.'
                  : 'Click the [⭐ Add Route] button next to any spot or course item to build your custom map route.'}
              </p>
            </div>

            <div className="pt-2 text-xs text-slate-500 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200">
              {language === 'KR'
                ? '아래 검색창에 원하시는 장소를 입력하시면 네이버 자동 검색을 통해 나만의 여행 루트에 즉시 추가할 수 있습니다.'
                : 'Type any destination or food spot in the search bar below to add it directly to your route.'}
            </div>
          </div>
        )}
      </div>

      {/* Naver Cloud Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#03C75A]"></span>
                <h3 className="font-extrabold text-base text-slate-900">
                  {language === 'KR' ? '네이버 지도(NCP) 설정' : 'Naver Maps API Settings'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                네이버 지도 Web Dynamic Map API는 <strong>네이버 클라우드 플랫폼(NCP)</strong> 콘솔에서 접속 도메인이 승인되어야 정상 작동합니다.
              </p>

              <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 border border-slate-200">
                <span className="font-bold text-slate-800 block text-[11px]">
                  📌 NCP 콘솔 [Web 서비스 URL]에 추가할 현재 도메인:
                </span>
                <div className="flex items-center justify-between gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-[11px] text-slate-800">
                  <span className="truncate">{window.location.origin}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.origin);
                      setDomainCopied(true);
                      setTimeout(() => setDomainCopied(false), 2000);
                    }}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-[10px] font-bold cursor-pointer shrink-0"
                  >
                    {domainCopied ? '복사됨' : '복사'}
                  </button>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="font-bold text-slate-800 block text-[11px]">
                  네이버 Client ID 직접 입력:
                </label>
                <input
                  type="text"
                  value={tempClientIdInput}
                  onChange={(e) => setTempClientIdInput(e.target.value)}
                  placeholder="예: jig5o1hthp"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-[#03C75A]"
                />
                <span className="text-[10px] text-slate-400 block">
                  비워두면 기본 키(jig5o1hthp)로 자동 재설정됩니다.
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('custom_naver_client_id');
                  setCustomClientId('');
                  setShowSettingsModal(false);
                  setNaverAuthFailed(false);
                  setProvider('NAVER');
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
              >
                기본값 리셋
              </button>
              <button
                type="button"
                onClick={() => {
                  const cleaned = tempClientIdInput.trim();
                  if (cleaned) {
                    localStorage.setItem('custom_naver_client_id', cleaned);
                    setCustomClientId(cleaned);
                  } else {
                    localStorage.removeItem('custom_naver_client_id');
                    setCustomClientId('');
                  }
                  setShowSettingsModal(false);
                  setNaverAuthFailed(false);
                  setProvider('NAVER');
                }}
                className="px-4 py-1.5 rounded-lg bg-[#03C75A] hover:bg-[#02B350] text-white text-xs font-extrabold transition cursor-pointer shadow-xs"
              >
                저장 및 적용
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2.5 최소한의 크기로 배치된 장소 검색 및 루트 추가 바 (Minimal Place Search Bar) */}
      <div ref={searchContainerRef} className="relative z-30 pt-1">
        <div className="flex items-center justify-between pb-1.5 px-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Search className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'KR' ? '여행지 검색 및 직접 추가' : 'Search & Add Places'}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {language === 'KR' ? '추천지 검색 또는 알고 있는 장소명을 입력해 루트에 추가' : 'Search recommended spots or enter custom location'}
          </span>
        </div>

        {/* Search Input Bar (최소한의 크기) */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleQuickAdd();
                } else if (e.key === 'Escape') {
                  setIsSearchOpen(false);
                }
              }}
              placeholder={
                isGoogleMode
                  ? 'Search places on Google Maps (e.g. Haeundae Beach, Lee Jaemo Pizza, Busan Station)'
                  : (language === 'KR'
                    ? '추천 여행지 또는 알고 계신 장소명을 검색하세요 (예: 해운대, 이재모피자, 흰여울문화마을)'
                    : 'Search recommended spots or enter a place name (e.g. Haeundae, Lee Jaemo Pizza)')
              }
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!searchQuery.trim()}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs shrink-0"
            title={language === 'KR' ? '루트에 추가' : 'Add to Route'}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'KR' ? '루트 추가' : 'Add to Route'}</span>
          </button>
        </div>

        {/* Feedback alert if recently added */}
        {addFeedback && (
          <div className="mt-2 flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg animate-fade-in font-medium">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {addFeedback.includes('이미') || addFeedback.includes('Already')
                ? addFeedback
                : language === 'KR'
                ? `"${addFeedback}" 장소가 내 여행 루트에 추가되었습니다.`
                : `"${addFeedback}" has been added to your route.`}
            </span>
          </div>
        )}

        {/* Search Results Dropdown (구글 Maps / 네이버 API 실시간 자동 검색) */}
        {isSearchOpen && searchQuery.trim() && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-40 max-h-80 flex flex-col animate-fade-in">
            {/* Header */}
            <div className="px-3 py-2 text-[11px] font-bold text-slate-700 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                {isGoogleMode ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-xs bg-[#1A73E8] text-white flex items-center justify-center font-black text-[9px] shadow-2xs">
                      G
                    </span>
                    <span>Google Maps Place Auto-Search</span>
                  </>
                ) : (
                  <>
                    <span className="w-3.5 h-3.5 rounded-xs bg-[#03C75A] text-white flex items-center justify-center font-black text-[9px] shadow-2xs">
                      N
                    </span>
                    <span>네이버 장소 자동 검색 결과</span>
                  </>
                )}
              </span>
              {isSearching ? (
                <span className="text-[10px] text-slate-400 font-normal animate-pulse">
                  {isGoogleMode ? 'Searching Google Places...' : '네이버 검색 중...'}
                </span>
              ) : (
                <span className="font-normal text-slate-400 text-[10px]">
                  {isGoogleMode ? 'Click to add to route' : '클릭 시 루트 즉시 추가'}
                </span>
              )}
            </div>

            {/* List */}
            <div className="overflow-y-auto divide-y divide-slate-100 max-h-60">
              {isSearching && activeSearchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isGoogleMode ? 'bg-[#1A73E8]' : 'bg-[#03C75A]'} animate-ping`} />
                  <span>{isGoogleMode ? 'Searching places on Google Maps...' : '네이버 실시간 장소 검색 중...'}</span>
                </div>
              ) : activeSearchResults.length > 0 ? (
                activeSearchResults.map((spot) => {
                  const isSaved = isPlaceInMyRoute(spot.titleKo);
                  return (
                    <div
                      key={spot.id || spot.titleEn || spot.titleKo}
                      onClick={() => handleAddSearchResult(spot)}
                      className={`p-2.5 ${isGoogleMode ? 'hover:bg-blue-50/50' : 'hover:bg-emerald-50/50'} flex items-center justify-between gap-3 cursor-pointer transition text-left`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">
                            {isGoogleMode ? (spot.titleEn || spot.titleKo) : spot.titleKo}
                          </span>
                          {isGoogleMode && spot.titleKo && spot.titleKo !== spot.titleEn && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({spot.titleKo})
                            </span>
                          )}
                          {isGoogleMode ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1A73E8]/10 text-[#1A73E8] border border-[#1A73E8]/25 shrink-0 font-bold flex items-center gap-0.5">
                              <span className="font-mono text-[9px]">G</span>
                              <span>{spot.categoryEn || spot.categoryKo || 'Place'}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#03C75A]/10 text-[#029B46] border border-[#03C75A]/25 shrink-0 font-bold flex items-center gap-0.5">
                              <span className="font-mono text-[9px]">N</span>
                              <span>{language === 'KR' ? spot.categoryKo : (spot.categoryEn || 'Place')}</span>
                            </span>
                          )}
                          {spot.districtKo && (
                            <span className="text-[10px] text-slate-400">
                              {isGoogleMode ? (spot.districtEn || spot.districtKo) : spot.districtKo}
                            </span>
                          )}
                        </div>
                        {(isGoogleMode ? (spot.addressEn || spot.addressKo) : spot.addressKo) && (
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {isGoogleMode ? (spot.addressEn || spot.addressKo) : spot.addressKo}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0">
                        {isSaved ? (
                          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                            <Check className="w-3 h-3" />
                            <span>{isGoogleMode ? 'Added' : '추가됨'}</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddSearchResult(spot);
                            }}
                            className={`text-[11px] font-bold ${
                              isGoogleMode
                                ? 'text-blue-900 bg-blue-100 hover:bg-blue-200 border-blue-300'
                                : 'text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border-emerald-300'
                            } px-2.5 py-1 rounded-md border flex items-center gap-1 transition cursor-pointer`}
                          >
                            <Plus className={`w-3 h-3 ${isGoogleMode ? 'text-blue-700' : 'text-emerald-700'}`} />
                            <span>{isGoogleMode ? 'Add' : '추가'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  {isGoogleMode
                    ? 'No matched places found on Google Maps.'
                    : (language === 'KR' ? '일치하는 네이버 검색 결과가 없습니다.' : 'No matched places found.')}
                </div>
              )}
            </div>

            {/* Custom Add Row for any known place typed by user */}
            {searchQuery.trim() && (
              <div
                onClick={handleQuickAdd}
                className="p-2.5 bg-amber-50/90 hover:bg-amber-100 border-t border-amber-200 flex items-center justify-between gap-2 cursor-pointer transition text-left shrink-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-amber-950 truncate">
                      {language === 'KR' ? `"${searchQuery.trim()}" 장소를 직접 추가` : `Add "${searchQuery.trim()}" directly`}
                    </p>
                    <p className="text-[10px] text-amber-700 truncate">
                      {language === 'KR' ? '알고 계신 장소를 좌표 매칭하여 내 여행 루트에 즉시 등록합니다.' : 'Register custom known place into your custom route.'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 px-2.5 py-1 rounded-md shadow-2xs shrink-0 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'KR' ? '직접 추가' : 'Add'}</span>
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. 루트 상세 목록 및 동선 관리 (Step List & Reordering) */}
      {places.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-slate-900">
                {language === 'KR' ? '루트 순서 및 경유지 목록' : 'Route Sequence & Stop Details'}
              </span>
              <span className="text-xs text-slate-500">
                ({language === 'KR' ? '위/아래 화살표로 순서를 바꿀 수 있습니다' : 'Use arrows to reorder stops'})
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {places.map((place, index) => {
              const stepNumber = index + 1;
              const isSelected = selectedPlaceId === place.id;

              return (
                <React.Fragment key={place.id}>
                  {/* 경유지 간 이동 연결선 */}
                  {index > 0 && (
                    <div className="flex items-center gap-3 pl-4 sm:pl-6 py-1">
                      <div className="w-0.5 h-6 bg-slate-300 ml-3"></div>
                      <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                        <Train className="w-3.5 h-3.5 text-[#0A2540]" />
                        <span>
                          {language === 'KR'
                            ? `경유지 ${index} ➔ 경유지 ${stepNumber} 이동 구간`
                            : `Transfer between Stop ${index} and ${stepNumber}`}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 장소 카드 */}
                  <div
                    onClick={() => handleFocusPlace(place)}
                    className={`bg-white rounded-xl border p-4 sm:p-5 transition-all text-left flex flex-col justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 shadow-md ring-2 ring-amber-400/20'
                        : 'border-slate-200 hover:border-slate-400 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Step Number Badge */}
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-xs sm:text-sm font-extrabold shrink-0 shadow-2xs">
                          {stepNumber}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {place.categoryKo && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                {language === 'KR' ? place.categoryKo : (place.categoryEn || place.categoryKo)}
                              </span>
                            )}
                            {place.time && (
                              <span className="text-[10px] font-mono text-slate-500">
                                {place.time}
                              </span>
                            )}
                          </div>

                          <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug truncate">
                            {language === 'KR' ? place.titleKo : (place.titleEn || place.titleKo)}
                          </h4>

                          {place.addressRoadKo && (
                            <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                              <span>{language === 'KR' ? place.addressRoadKo : (place.addressRoadEn || place.addressRoadKo)}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Controls: Up, Down, Delete */}
                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => move(index, 'up')}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                          title={language === 'KR' ? '위로 이동' : 'Move Up'}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === places.length - 1}
                          onClick={() => move(index, 'down')}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                          title={language === 'KR' ? '아래로 이동' : 'Move Down'}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(place.id)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer ml-1"
                          title={language === 'KR' ? '루트에서 삭제' : 'Remove from Route'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Action Links */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        {place.stationInfoKo && (
                          <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                            <Train className="w-3 h-3 text-[#0A2540]" />
                            <span>{language === 'KR' ? place.stationInfoKo : (place.stationInfoEn || place.stationInfoKo)}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {place.addressRoadKo && (
                          <button
                            type="button"
                            onClick={(e) => handleCopy(e, place.id, place.addressRoadKo!)}
                            className="px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                          >
                            {copiedId === place.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">{language === 'KR' ? '복사됨' : 'Copied'}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>{language === 'KR' ? '주소 복사' : 'Copy'}</span>
                              </>
                            )}
                          </button>
                        )}

                        {language === 'KR' ? (
                          <>
                            <a
                              href={`https://map.naver.com/v5/search/${encodeURIComponent(place.titleKo)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 rounded bg-[#03C75A] hover:bg-[#02B350] text-white text-[11px] font-bold flex items-center gap-1"
                            >
                              <span>네이버 지도</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            <a
                              href={`https://map.kakao.com/link/search/${encodeURIComponent(place.titleKo)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 rounded bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] text-[11px] font-bold flex items-center gap-1"
                            >
                              <span>카카오 길찾기</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </>
                        ) : (
                          <>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((place.titleEn || place.titleKo) + ' Busan')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 rounded bg-[#1A73E8] hover:bg-[#1557B0] text-white text-[11px] font-bold flex items-center gap-1"
                            >
                              <span>Google Maps</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            <a
                              href={`https://map.naver.com/v5/search/${encodeURIComponent(place.titleKo)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 rounded bg-[#03C75A] hover:bg-[#02B350] text-white text-[11px] font-bold flex items-center gap-1"
                            >
                              <span>Naver Map</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* 방안 A: 내 여행 루트 공유 및 복사 모달 (Share Route Modal) */}
      {showShareModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in text-left font-sans">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Share2 className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 leading-snug">
                    {language === 'KR' ? '내 여행 루트 공유하기' : 'Share My Travel Route'}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {language === 'KR' ? `총 ${displayPlaces.length}개 장소가 연결된 여행 루트` : `${displayPlaces.length} stops connected in route`}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs text-slate-700">
              {/* Option 1: URL 공유 링크 복사 */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <span>🔗</span>
                    <span>{language === 'KR' ? '방안 A: URL 공유 링크' : 'Route Sharing URL'}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {language === 'KR' ? '모바일·PC 어디서든 열람 가능' : 'Accessible on Mobile & PC'}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-300 font-mono text-[11px] text-slate-700">
                  <span className="truncate flex-1 select-all">{getCurrentShareUrl()}</span>
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-md text-[11px] font-bold cursor-pointer shrink-0 transition flex items-center gap-1 shadow-2xs"
                  >
                    {shareUrlCopied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3 text-white" />}
                    <span>{shareUrlCopied ? (language === 'KR' ? '복사됨!' : 'Copied!') : (language === 'KR' ? '링크 복사' : 'Copy')}</span>
                  </button>
                </div>
              </div>

              {/* Option 2: 모바일 메신저 전송 & 텍스트 일정표 복사 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="p-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-xl font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'KR' ? '카카오톡 / 메시지로 보내기' : 'Send via Mobile Messenger'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySummaryText}
                  className="p-3 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 text-slate-800 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                >
                  {summaryTextCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                  <span>{summaryTextCopied ? (language === 'KR' ? '일정표 복사완료!' : 'Text Copied!') : (language === 'KR' ? '일정표 텍스트 복사' : 'Copy Itinerary Text')}</span>
                </button>
              </div>

              {/* Route Summary Preview */}
              <div className="bg-[#FBFBF9] p-3 rounded-xl border border-slate-200 space-y-1.5 max-h-36 overflow-y-auto">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                  {language === 'KR' ? '공유되는 장소 목록:' : 'Stops Included in Link:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {displayPlaces.map((p, idx) => (
                    <span key={idx} className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[11px] font-semibold text-slate-800 flex items-center gap-1">
                      <span className="text-amber-600 font-bold font-mono text-[9.5px]">#{idx + 1}</span>
                      <span>{language === 'KR' ? p.titleKo : (p.titleEn || p.titleKo)}</span>
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed break-keep">
                💡 {language === 'KR'
                  ? '링크를 받은 친구는 이 루트를 그대로 보거나, [내 루트로 저장] 버튼을 눌러 자신의 루트로 복사하여 수정할 수 있습니다.'
                  : 'Friends opening this link can view your itinerary and click "Save as My Route" to customize it.'}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer transition"
              >
                {language === 'KR' ? '닫기' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 bg-slate-900/95 text-white text-xs sm:text-sm font-bold rounded-full shadow-2xl backdrop-blur-sm border border-slate-700/60 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
