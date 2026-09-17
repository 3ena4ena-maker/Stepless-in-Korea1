import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Navigation } from 'lucide-react';

interface PlaceLocationMapProps {
  latitude: number;
  longitude: number;
  placeName: string;
  language: 'KR' | 'EN';
}

declare global {
  interface Window {
    naver?: any;
    navermaps_auth_error?: () => void;
    google?: any;
    gm_authFailure?: () => void;
    L?: any;
  }
}

export default function PlaceLocationMap({
  latitude,
  longitude,
  placeName,
  language,
}: PlaceLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const naverMapRef = useRef<any>(null);
  const naverMarkerRef = useRef<any>(null);
  const googleMapRef = useRef<any>(null);
  const googleMarkerRef = useRef<any>(null);
  const leafletMapRef = useRef<any>(null);
  const leafletMarkerRef = useRef<any>(null);

  const [useLeaflet, setUseLeaflet] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  // Helper to check if Google Maps origin is authorized
  const isGoogleOriginAuthorized = () => {
    if (typeof window === 'undefined') return false;
    if ((window as any).GOOGLE_MAPS_AUTH_FAILED) return false;
    const host = window.location.hostname.toLowerCase();
    if (
      host === 'stepless.kr' ||
      host.endsWith('.stepless.kr') ||
      host === 'steplessinkorea.pages.dev' ||
      host.endsWith('.steplessinkorea.pages.dev')
    ) {
      return true;
    }
    if (host.includes('.run.app') || host === 'localhost' || host === '127.0.0.1') {
      return false;
    }
    return true;
  };

  // Safe cleanup
  const cleanupMaps = () => {
    if (naverMarkerRef.current) {
      try { naverMarkerRef.current.setMap(null); } catch {}
      naverMarkerRef.current = null;
    }
    if (naverMapRef.current) {
      try {
        if (window.naver?.maps?.Event) {
          window.naver.maps.Event.clearInstanceListeners(naverMapRef.current);
        }
      } catch {}
      naverMapRef.current = null;
    }
    if (googleMarkerRef.current) {
      try { googleMarkerRef.current.setMap(null); } catch {}
      googleMarkerRef.current = null;
    }
    if (googleMapRef.current) {
      try {
        if (window.google?.maps?.event) {
          window.google.maps.event.clearInstanceListeners(googleMapRef.current);
        }
      } catch {}
      googleMapRef.current = null;
    }
    if (leafletMarkerRef.current) {
      try { leafletMarkerRef.current.remove(); } catch {}
      leafletMarkerRef.current = null;
    }
    if (leafletMapRef.current) {
      try { leafletMapRef.current.remove(); } catch {}
      leafletMapRef.current = null;
    }
    if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = '';
    }
  };

  // 1. 한국어 모드: 네이버 지도 로드 및 초기화
  useEffect(() => {
    if (language !== 'KR' || useLeaflet) return;

    let isMounted = true;
    const clientId = (import.meta.env.VITE_NAVER_CLIENT_ID || 'jig5o1hthp').trim();

    window.navermaps_auth_error = () => {
      console.warn('[PlaceLocationMap] Naver Maps auth failed, switching to Leaflet.');
      if (isMounted) {
        setUseLeaflet(true);
      }
    };

    const initNaverMap = () => {
      if (!isMounted || !mapContainerRef.current || !window.naver?.maps) return;

      cleanupMaps();

      const center = new window.naver.maps.LatLng(latitude, longitude);
      const map = new window.naver.maps.Map(mapContainerRef.current, {
        center,
        zoom: 16,
        minZoom: 11,
        maxZoom: 19,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
        mapTypeControl: false,
      });
      naverMapRef.current = map;

      // 마커 생성
      const markerContent = `
        <div style="display:flex; flex-direction:column; align-items:center; transform:translate(-50%, -100%);">
          <div style="background:#0A2540; color:#fff; font-size:11px; font-weight:700; padding:4px 9px; border-radius:8px; white-space:nowrap; box-shadow:0 2px 8px rgba(0,0,0,0.25); border:1.5px solid #ffffff;">
            ${placeName}
          </div>
          <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid #0A2540; margin-top:-1px;"></div>
        </div>
      `;

      naverMarkerRef.current = new window.naver.maps.Marker({
        position: center,
        map,
        icon: {
          content: markerContent,
          anchor: new window.naver.maps.Point(0, 0),
        },
      });

      setMapLoaded(true);
    };

    if (window.naver?.maps) {
      initNaverMap();
      return () => {
        isMounted = false;
        window.navermaps_auth_error = undefined;
      };
    }

    const scriptId = 'naver-maps-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&ncpKeyId=${clientId}&submodules=geocoder`;
      script.async = true;
      script.onload = () => {
        setTimeout(() => {
          if (window.naver?.maps) {
            initNaverMap();
          } else {
            setUseLeaflet(true);
          }
        }, 200);
      };
      script.onerror = () => {
        setUseLeaflet(true);
      };
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if (window.naver?.maps) {
          clearInterval(interval);
          initNaverMap();
        }
      }, 100);
      return () => {
        clearInterval(interval);
        isMounted = false;
      };
    }

    return () => {
      isMounted = false;
      window.navermaps_auth_error = undefined;
    };
  }, [language, latitude, longitude, placeName, useLeaflet]);

  // 2. 영어 모드: Google Maps 로드 및 초기화
  useEffect(() => {
    if (language !== 'EN' || useLeaflet) return;

    let isMounted = true;
    const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();

    if (!apiKey || (window as any).GOOGLE_MAPS_AUTH_FAILED || !isGoogleOriginAuthorized()) {
      setUseLeaflet(true);
      return;
    }

    const initGoogleMap = () => {
      if (!isMounted || !mapContainerRef.current || !window.google?.maps) return;

      cleanupMaps();

      const center = { lat: latitude, lng: longitude };
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center,
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
      });
      googleMapRef.current = map;

      googleMarkerRef.current = new window.google.maps.Marker({
        position: center,
        map,
        title: placeName,
      });

      setMapLoaded(true);
    };

    if (window.google?.maps) {
      initGoogleMap();
      return () => {
        isMounted = false;
      };
    }

    const scriptId = 'google-maps-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&language=en`;
      script.async = true;
      script.onload = () => {
        setTimeout(() => {
          if (window.google?.maps && !(window as any).GOOGLE_MAPS_AUTH_FAILED) {
            initGoogleMap();
          } else {
            setUseLeaflet(true);
          }
        }, 200);
      };
      script.onerror = () => {
        setUseLeaflet(true);
      };
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(interval);
          initGoogleMap();
        }
      }, 100);
      return () => {
        clearInterval(interval);
        isMounted = false;
      };
    }

    return () => {
      isMounted = false;
    };
  }, [language, latitude, longitude, placeName, useLeaflet]);

  // 3. Leaflet 폴백 렌더러 (OSM)
  useEffect(() => {
    if (!useLeaflet) return;

    let isMounted = true;

    const initLeaflet = () => {
      if (!isMounted || !mapContainerRef.current || !(window as any).L) return;
      const L = (window as any).L;

      cleanupMaps();

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([latitude, longitude], 16);
      leafletMapRef.current = map;

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Simple pin marker
      const markerHtml = `
        <div style="display:flex; flex-direction:column; align-items:center; transform:translate(-50%, -100%);">
          <div style="background:#0A2540; color:#fff; font-size:11px; font-weight:700; padding:4px 9px; border-radius:8px; white-space:nowrap; box-shadow:0 2px 8px rgba(0,0,0,0.25); border:1.5px solid #ffffff;">
            ${placeName}
          </div>
          <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid #0A2540; margin-top:-1px;"></div>
        </div>
      `;
      const icon = L.divIcon({
        html: markerHtml,
        className: 'place-pin-marker',
        iconSize: [0, 0],
      });

      leafletMarkerRef.current = L.marker([latitude, longitude], { icon }).addTo(map);
      setMapLoaded(true);
    };

    if ((window as any).L) {
      initLeaflet();
      return () => {
        isMounted = false;
      };
    }

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
        setTimeout(initLeaflet, 100);
      };
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if ((window as any).L) {
          clearInterval(interval);
          initLeaflet();
        }
      }, 100);
      return () => {
        clearInterval(interval);
        isMounted = false;
      };
    }

    return () => {
      isMounted = false;
    };
  }, [useLeaflet, latitude, longitude, placeName]);

  // 언어별 지도 외부 링크
  const mapLink = language === 'KR'
    ? `https://map.naver.com/v5/search/${encodeURIComponent(placeName)}`
    : `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  const mapLinkText = language === 'KR' ? '네이버지도에서 길찾기' : 'Open in Google Maps';

  return (
    <div className="space-y-1.5">
      <div className="relative w-full h-52 sm:h-64 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* 외부 지도 바로가기 버튼 */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 hover:bg-white text-slate-800 text-xs font-bold shadow-md border border-slate-200 backdrop-blur-sm transition-all"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span>{mapLinkText}</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
      <p className="text-[11px] text-slate-400 text-right">
        {language === 'KR'
          ? '좌표: 한국관광공사 TourAPI (mapx, mapy)'
          : 'Coordinates: Korea Tourism Organization TourAPI'}
      </p>
    </div>
  );
}
