import React, { useEffect, useRef, useState } from 'react';
import { Station, translateExitNumber } from '../types';
import { getStationCrosswalkPoints } from '../utils/crosswalkData';
import { createGoogleMapExitMarker, createGoogleMapCrosswalkMarker } from '../utils/googleMapsHelper';

export function CrosswalkIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block shrink-0 align-middle ${className}`}>
      <g fill="#2563eb">
        <polygon points="4.5,5 5.5,5 2.5,19 0.5,19" />
        <polygon points="6.5,5 7.5,5 5.5,19 3.7,19" />
        <polygon points="8.5,5 9.5,5 8.5,19 6.8,19" />
        <polygon points="10.5,5 11.5,5 11.3,19 9.8,19" />
        <polygon points="12.5,5 13.5,5 14.2,19 12.7,19" />
        <polygon points="14.5,5 15.5,5 17.2,19 15.5,19" />
        <polygon points="16.5,5 17.5,5 20.3,19 18.5,19" />
        <polygon points="18.5,5 19.5,5 23.5,19 21.5,19" />
      </g>
    </svg>
  );
}

interface SubwayStationMapProps {
  station: Station;
  language: 'KR' | 'EN';
  focusedExitCoords?: { latitude: number; longitude: number } | null;
  isAdminMode?: boolean;
}

declare global {
  interface Window {
    naver?: any;
    navermaps_auth_error?: () => void;
    google?: any;
    gm_authFailure?: () => void;
  }
}

export default function SubwayStationMap({ station, language, focusedExitCoords, isAdminMode = false }: SubwayStationMapProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);

  // Google Maps state & refs
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState<boolean>(false);
  const [googleMapsFailed, setGoogleMapsFailed] = useState<boolean>(false);
  const googleMapInstance = useRef<any>(null);
  const googleMarkersRef = useRef<any[]>([]);
  const googleTempMarkerRef = useRef<any>(null);

  // Naver Map custom client config
  const [naverClientId, setNaverClientId] = useState<string>(() => {
    return localStorage.getItem('custom_naver_client_id') || '';
  });
  const [naverAuthFailed, setNaverAuthFailed] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [tempClientId, setTempClientId] = useState<string>('');

  // Leaflet fallback states & refs
  // Helper to determine whether Google Maps is authorized on the current origin.
  // In Google Cloud Console, HTTP Referrer restriction is configured for:
  // - https://stepless.kr/*
  // - https://steplessinkorea.pages.dev/*
  // Development environments (*.run.app, localhost) are not registered in GCP Referrers
  // and will trigger RefererNotAllowedMapError from Google's servers.
  const isOriginAuthorizedForGoogleMaps = () => {
    if (typeof window === 'undefined') return false;
    if ((window as any).GOOGLE_MAPS_AUTH_FAILED) return false;
    const host = window.location.hostname.toLowerCase();
    
    // Explicitly registered production domains in GCP Console
    if (
      host === 'stepless.kr' ||
      host.endsWith('.stepless.kr') ||
      host === 'steplessinkorea.pages.dev' ||
      host.endsWith('.steplessinkorea.pages.dev')
    ) {
      return true;
    }
    
    // Cloud Run dev/preview sandboxes and local testing are not in GCP HTTP Referrers
    if (host.includes('.run.app') || host === 'localhost' || host === '127.0.0.1') {
      return false;
    }

    return true;
  };

  const [useLeaflet, setUseLeaflet] = useState<boolean>(() => {
    if (language === 'EN') {
      const env = (import.meta as any).env || {};
      const key = ((env.VITE_GOOGLE_MAPS_API_KEY || '') as string).trim();
      if (!key || (window as any).GOOGLE_MAPS_AUTH_FAILED || !isOriginAuthorizedForGoogleMaps()) {
        return true;
      }
    }
    return false;
  });
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);
  const leafletMapInstance = useRef<any>(null);
  const leafletMarkersRef = useRef<any[]>([]);

  // Auto fallback to Leaflet if switching to EN and no valid Google Maps API Key exists or domain is not authorized
  useEffect(() => {
    if (language === 'EN') {
      const env = (import.meta as any).env || {};
      const key = ((env.VITE_GOOGLE_MAPS_API_KEY || '') as string).trim();
      if (!key || !isOriginAuthorizedForGoogleMaps()) {
        setUseLeaflet(true);
      }
    }
  }, [language]);

  // Coordinate inspector mode state
  const [inspectMode, setInspectMode] = useState<boolean>(false);
  const [clickedCoord, setClickedCoord] = useState<{ lat: number; lng: number } | null>(null);
  const tempMarkerRef = useRef<any>(null);
  const leafletTempMarkerRef = useRef<any>(null);

  // Reset inspect mode if admin mode is disabled
  useEffect(() => {
    if (!isAdminMode) {
      setInspectMode(false);
      setClickedCoord(null);
      if (tempMarkerRef.current) tempMarkerRef.current.setMap(null);
      if (googleTempMarkerRef.current) googleTempMarkerRef.current.setMap(null);
      if (leafletTempMarkerRef.current && leafletMapInstance.current) {
        leafletMapInstance.current.removeLayer(leafletTempMarkerRef.current);
      }
    }
  }, [isAdminMode]);

  // Safe map cleanup helpers to prevent memory leaks and API error cascades
  const destroyGoogleMap = () => {
    if (googleMarkersRef.current && googleMarkersRef.current.length > 0) {
      googleMarkersRef.current.forEach(m => {
        try {
          if (m && typeof m.setMap === 'function') {
            m.setMap(null);
          }
        } catch (e) {
          // ignore
        }
      });
      googleMarkersRef.current = [];
    }
    if (googleTempMarkerRef.current) {
      try {
        googleTempMarkerRef.current.setMap(null);
      } catch (e) {
        // ignore
      }
      googleTempMarkerRef.current = null;
    }
    if (googleMapInstance.current) {
      try {
        if (window.google && window.google.maps && window.google.maps.event) {
          window.google.maps.event.clearInstanceListeners(googleMapInstance.current);
        }
      } catch (e) {
        // ignore
      }
      googleMapInstance.current = null;
      if (mapElement.current) {
        mapElement.current.innerHTML = '';
      }
    }
  };

  const destroyNaverMap = () => {
    if (markersRef.current && markersRef.current.length > 0) {
      markersRef.current.forEach(m => {
        try {
          if (m && typeof m.setMap === 'function') {
            m.setMap(null);
          }
        } catch (e) {
          // ignore Naver API internal auth errors
        }
      });
      markersRef.current = [];
    }
    if (mapInstance.current) {
      try {
        if (window.naver && window.naver.maps && window.naver.maps.Event) {
          window.naver.maps.Event.clearInstanceListeners(mapInstance.current);
        }
      } catch (e) {
        // ignore
      }
      mapInstance.current = null;
      if (mapElement.current) {
        mapElement.current.innerHTML = '';
      }
    }
  };

  const destroyLeafletMap = () => {
    if (leafletMarkersRef.current && leafletMarkersRef.current.length > 0) {
      leafletMarkersRef.current.forEach(m => {
        try {
          if (m && typeof m.remove === 'function') {
            m.remove();
          }
        } catch (e) {
          // ignore
        }
      });
      leafletMarkersRef.current = [];
    }
    if (leafletMapInstance.current) {
      try {
        leafletMapInstance.current.remove();
      } catch (e) {
        // ignore
      }
      leafletMapInstance.current = null;
      if (mapElement.current) {
        mapElement.current.innerHTML = '';
      }
    }
  };

  // 1. Asynchronously Load Naver Maps API script
  useEffect(() => {
    // Read client ID from state, or env with extensive fallbacks (defaulting to user-registered jig5o1hthp)
    const env = (import.meta as any).env || {};
    let clientId = naverClientId;

    if (!clientId) {
      clientId = env.VITE_NAVER_CLIENT_ID;

      // Detect if they saved client ID under VITE_NAVER_CLIENT_SECRET or any other custom naming pattern by accident
      const naverKeys = Object.keys(env).filter(key => key.startsWith('VITE_NAVER_CLIENT'));
      const customKey = naverKeys.find(key => 
        key !== 'VITE_NAVER_CLIENT_ID' && 
        key !== 'VITE_NAVER_CLIENT_SECRET' && 
        env[key] && 
        env[key] !== 'jig5o1hthp'
      );

      if (!clientId && customKey) {
        clientId = env[customKey];
      }

      if (!clientId) {
        clientId = 'jig5o1hthp';
      }
    }

    // Dynamic error hook in window to prevent default browser alert dialog
    window.navermaps_auth_error = () => {
      console.warn("Naver Maps API Authentication failed for origin:", window.location.origin);
      destroyNaverMap();
      setNaverAuthFailed(true);
      setUseLeaflet(true); // Automatically switch to Leaflet map when domain is not authorized in NCP
    };

    if (window.naver && window.naver.maps) {
      setScriptLoaded(true);
      setNaverAuthFailed(false);
      return () => {
        window.navermaps_auth_error = undefined;
      };
    }

    const scriptId = 'naver-maps-script';
    let existingScript = document.getElementById(scriptId) as HTMLScriptElement;

    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    // Pass both ncpClientId and ncpKeyId to support modern and legacy NCP API parameter specs
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&ncpKeyId=${clientId}&submodules=geocoder`;
    script.async = true;
    script.onload = () => {
      setTimeout(() => {
        if (window.naver && window.naver.maps) {
          setScriptLoaded(true);
          setNaverAuthFailed(false);
        } else {
          console.warn("Naver Maps script loaded but API not available. Auto switching to Leaflet.");
          setNaverAuthFailed(true);
          setUseLeaflet(true);
        }
      }, 500);
    };
    script.onerror = () => {
      console.warn("Naver Maps script failed to load. Auto switching to Leaflet.");
      setNaverAuthFailed(true);
      setUseLeaflet(true);
    };
    document.head.appendChild(script);

    return () => {
      window.navermaps_auth_error = undefined;
    };
  }, [naverClientId]);

  // 1-B. Asynchronously Load Google Maps API script when language === 'EN'
  useEffect(() => {
    if (language !== 'EN' || useLeaflet) {
      return;
    }

    // Check if Google Maps is already loaded and functioning
    if (window.google && window.google.maps) {
      setGoogleMapsLoaded(true);
      setGoogleMapsFailed(false);
      return;
    }

    const env = (import.meta as any).env || {};
    const apiKey = ((env.VITE_GOOGLE_MAPS_API_KEY || '') as string).trim();

    // 1. If VITE_GOOGLE_MAPS_API_KEY is missing, auth previously failed, or origin is not authorized for this API key,
    // fallback to Leaflet cleanly without requesting maps.googleapis.com
    if (!apiKey || (window as any).GOOGLE_MAPS_AUTH_FAILED || googleMapsFailed || !isOriginAuthorizedForGoogleMaps()) {
      destroyGoogleMap();
      setGoogleMapsFailed(true);
      setUseLeaflet(true);
      return;
    }

    const handleAuthFailure = () => {
      console.warn("[Stepless Map] Google Maps could not be initialized. Falling back to Leaflet.");
      (window as any).GOOGLE_MAPS_AUTH_FAILED = true;
      destroyGoogleMap();
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
      setGoogleMapsFailed(true);
      setUseLeaflet(true);
    };

    // 4 & 2. Handle gm_authFailure callback (invalid key or auth issue)
    window.gm_authFailure = handleAuthFailure;
    (window as any).onGoogleMapsAuthFailed = handleAuthFailure;

    // 3. Handle RefererNotAllowedMapError or other maps error events
    const handleErrorEvent = (event: ErrorEvent) => {
      if (
        event &&
        (event.message?.includes?.('Google Maps') ||
          event.message?.includes?.('RefererNotAllowed') ||
          event.filename?.includes?.('maps.googleapis.com'))
      ) {
        try {
          event.preventDefault();
          event.stopImmediatePropagation?.();
        } catch (e) {}
        handleAuthFailure();
      }
    };
    window.addEventListener('error', handleErrorEvent);

    const scriptId = 'google-maps-script';
    let existingScript = document.getElementById(scriptId) as HTMLScriptElement;
    if (existingScript) {
      const interval = setInterval(() => {
        if ((window as any).GOOGLE_MAPS_AUTH_FAILED) {
          handleAuthFailure();
          clearInterval(interval);
        } else if (window.google && window.google.maps) {
          setGoogleMapsLoaded(true);
          setGoogleMapsFailed(false);
          clearInterval(interval);
        }
      }, 100);
      return () => {
        clearInterval(interval);
        window.removeEventListener('error', handleErrorEvent);
      };
    }

    // 5. Script creation and load failure (onerror)
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&language=en`;
    script.async = true;
    script.onload = () => {
      setTimeout(() => {
        if (window.google && window.google.maps && !(window as any).GOOGLE_MAPS_AUTH_FAILED) {
          setGoogleMapsLoaded(true);
          setGoogleMapsFailed(false);
        } else {
          handleAuthFailure();
        }
      }, 300);
    };
    script.onerror = () => {
      // Script failed to load (network error, blocked, 404)
      handleAuthFailure();
    };
    document.head.appendChild(script);

    return () => {
      window.removeEventListener('error', handleErrorEvent);
    };
  }, [language, useLeaflet, googleMapsFailed]);

  // 2. Initialize or Update Map and Markers on Station / Script loaded changes
  useEffect(() => {
    if (language !== 'KR' || useLeaflet) {
      destroyNaverMap();
      return;
    }
    if (!scriptLoaded || !window.naver || !window.naver.maps || !mapElement.current) return;

    destroyLeafletMap();
    destroyGoogleMap();

    const exits = station.exits || [];
    if (exits.length === 0) return;

    // Calculate map focus center dynamically using mathematical average coordinate of all exits or focused override
    let centerLat = 0;
    let centerLng = 0;
    let currentZoom = 16;

    if (focusedExitCoords) {
      centerLat = focusedExitCoords.latitude;
      centerLng = focusedExitCoords.longitude;
      currentZoom = 18;
    } else {
      let totalLat = 0;
      let totalLng = 0;
      exits.forEach(exit => {
        totalLat += exit.latitude;
        totalLng += exit.longitude;
      });
      centerLat = totalLat / exits.length;
      centerLng = totalLng / exits.length;
      currentZoom = 16;
    }

    const mapCenter = new window.naver.maps.LatLng(centerLat, centerLng);

    // Initialise Naver Map instantiation if not built already or DOM container was emptied
    if (!mapInstance.current || !mapElement.current.childElementCount) {
      if (mapElement.current) {
        mapElement.current.innerHTML = '';
      }
      mapInstance.current = new window.naver.maps.Map(mapElement.current, {
        center: mapCenter,
        zoom: currentZoom,
        minZoom: 13,
        maxZoom: 19,
        mapTypeControl: false,
        zoomControl: true,
        logoControl: true,
        scaleControl: true,
        draggable: true,
        pinchZoom: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.RIGHT_CENTER
        }
      });
    } else {
      // Update central zoom dynamically and move center with pan animation
      mapInstance.current.setCenter(mapCenter);
      mapInstance.current.setZoom(currentZoom);
      if (window.naver && window.naver.maps && window.naver.maps.Event && window.naver.maps.Event.trigger) {
        window.naver.maps.Event.trigger(mapInstance.current, 'resize');
      }
    }

    // Reset previous loaded markers to avoid rendering duplication
    markersRef.current.forEach(m => {
      try {
        if (m && typeof m.setMap === 'function') {
          m.setMap(null);
        }
      } catch (e) {
        // ignore
      }
    });
    markersRef.current = [];

    // Map exits and build markers
    exits.forEach(exit => {
      const line = station.lines[0];
      let mapAccentColor = '#F06A00'; // default 주황
      if (line === '2') mapAccentColor = '#1b6d24'; // 초록
      else if (line === '3') mapAccentColor = '#906A3B'; // 브라운
      else if (line === '동해') mapAccentColor = '#004960'; // 동해 블루

      let iconHtml = '';
      if (exit.hasElevator && exit.hasEscalator) {
        iconHtml = `
          <div style="display: flex; align-items: center; gap: 3px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="${mapAccentColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; flex-shrink: 0; display: inline-block; vertical-align: middle;">
              <rect x="3" y="3" width="18" height="18" rx="2.5" />
              <path d="M 7.5 10 L 9.5 7 L 11.5 10 Z" fill="${mapAccentColor}" stroke="none" />
              <path d="M 7.5 14 L 9.5 17 L 11.5 14 Z" fill="${mapAccentColor}" stroke="none" />
              <line x1="14.5" y1="3" x2="14.5" y2="21" stroke-dasharray="2 2" stroke-width="1.5" />
              <path d="M 14.5 12 L 17.5 12" />
              <path d="M 17.5 12 L 16 10.5" />
              <path d="M 17.5 12 L 16 13.5" />
            </svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="${mapAccentColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; flex-shrink: 0; display: inline-block; vertical-align: middle;">
              <circle cx="10" cy="7.5" r="1.8" fill="${mapAccentColor}" stroke="none" />
              <path d="M 10 10.2 L 10 14" stroke="${mapAccentColor}" stroke-width="2.5" stroke-linecap="round" />
              <path d="M 3.5 19.5 L 7.5 19.5 C 9.5 19.5, 10.5 18, 12 15.5 L 15.5 10 C 17 8, 18 7, 20.5 7 L 22.5 7" />
            </svg>
          </div>
        `;
      } else if (exit.hasElevator) {
        iconHtml = `
          <svg viewBox="0 0 24 24" fill="none" stroke="${mapAccentColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; flex-shrink: 0; display: inline-block; vertical-align: middle;">
            <rect x="3" y="3" width="18" height="18" rx="2.5" />
            <path d="M 7.5 10 L 9.5 7 L 11.5 10 Z" fill="${mapAccentColor}" stroke="none" />
            <path d="M 7.5 14 L 9.5 17 L 11.5 14 Z" fill="${mapAccentColor}" stroke="none" />
            <line x1="14.5" y1="3" x2="14.5" y2="21" stroke-dasharray="2 2" stroke-width="1.5" />
            <path d="M 14.5 12 L 17.5 12" />
            <path d="M 17.5 12 L 16 10.5" />
            <path d="M 17.5 12 L 16 13.5" />
          </svg>
        `;
      } else if (exit.hasEscalator) {
        iconHtml = `
          <svg viewBox="0 0 24 24" fill="none" stroke="${mapAccentColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; flex-shrink: 0; display: inline-block; vertical-align: middle;">
            <circle cx="10" cy="7.5" r="1.8" fill="${mapAccentColor}" stroke="none" />
            <path d="M 10 10.2 L 10 14" stroke="${mapAccentColor}" stroke-width="2.5" stroke-linecap="round" />
            <path d="M 3.5 19.5 L 7.5 19.5 C 9.5 19.5, 10.5 18, 12 15.5 L 15.5 10 C 17 8, 18 7, 20.5 7 L 22.5 7" />
          </svg>
        `;
      } else {
        iconHtml = `
          <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; flex-shrink: 0; display: inline-block; vertical-align: middle;">
            <path d="M 3.5 19.5 L 7.5 19.5 L 7.5 15.5 L 11.5 15.5 L 11.5 11.5 L 15.5 11.5 L 15.5 7.5 L 20.5 7.5" />
          </svg>
        `;
      }

      // Precise pixel-perfect marker dimensions
      const markerWidth = 140;
      const markerHeight = 44;

      // Styled custom HTML content conforming to strict anchor constraints
      // Designed inside a fixed container of 140x44 pixels with bottom-center flex-alignment.
      // Even if the bubble text overflows wide, the align-items: center ensures symmetrical center-alignment.
      const markerContent = `
        <div style="width: ${markerWidth}px; height: ${markerHeight}px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; position: relative; pointer-events: none;">
          <!-- Premium bubble label containing exit name and its mobility SVG icon -->
          <div style="background-color: white; border: 2.5px solid ${mapAccentColor}; border-radius: 9999px; padding: 5px 12px; font-weight: 850; font-size: 11px; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.18); display: flex; align-items: center; gap: 4.5px; pointer-events: auto; position: relative; margin-bottom: 2px;">
            <div style="display: flex; align-items: center; justify-content: center; min-width: 16px; height: 16px;">${iconHtml}</div>
            <span style="color: #0f172a; font-family: system-ui, sans-serif; letter-spacing: -0.02em; font-weight: 900;">${translateExitNumber(exit.number, language)}</span>
          </div>
          <!-- Pin Arrow Indicator -->
          <div style="width: 0; height: 0; border-left: 6.5px solid transparent; border-right: 6.5px solid transparent; border-top: 7px solid ${mapAccentColor}; margin-top: -1px; pointer-events: none;"></div>
        </div>
      `;

      // Define anchor point precisely at (0.5 * Width, 1.0 * Height) i.e. bottom center
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(exit.latitude, exit.longitude),
        map: mapInstance.current,
        icon: {
          content: markerContent,
          size: new window.naver.maps.Size(markerWidth, markerHeight),
          anchor: new window.naver.maps.Point(markerWidth * 0.5, markerHeight)
        }
      });

      // Marker Interactivity listener
      window.naver.maps.Event.addListener(marker, 'click', () => {
        mapInstance.current.panTo(new window.naver.maps.LatLng(exit.latitude, exit.longitude));
        
        // Auto scroll list window viewport target layout to match user-focused exit details
        const el = document.getElementById(`exit-item-${exit.number}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const tabBtn = document.getElementById(`expand-exit-btn-${exit.number}`);
          if (tabBtn) {
            tabBtn.click();
          }
        }
      });

      markersRef.current.push(marker);
    });

    // Add custom crosswalk indicators
    const crosswalkPoints = getStationCrosswalkPoints(station.id);
    
    if (crosswalkPoints.length > 0) {
      const crosswalkMarkerWidth = 32;
      const crosswalkMarkerHeight = 32;
      
      crosswalkPoints.forEach(pt => {
        const titleText = language === 'KR' ? pt.nameKr : pt.nameEn;
        const crosswalkHtml = `
          <div style="width: ${crosswalkMarkerWidth}px; height: ${crosswalkMarkerHeight}px; display: flex; align-items: center; justify-content: center; background-color: #ffffff; border: 2.5px solid #2563eb; border-radius: 9999px; box-shadow: 0 3px 10px rgba(0,0,0,0.18); cursor: pointer;" title="${titleText}">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
              <g fill="#2563eb">
                <polygon points="4.5,5 5.5,5 2.5,19 0.5,19" />
                <polygon points="6.5,5 7.5,5 5.5,19 3.7,19" />
                <polygon points="8.5,5 9.5,5 8.5,19 6.8,19" />
                <polygon points="10.5,5 11.5,5 11.3,19 9.8,19" />
                <polygon points="12.5,5 13.5,5 14.2,19 12.7,19" />
                <polygon points="14.5,5 15.5,5 17.2,19 15.5,19" />
                <polygon points="16.5,5 17.5,5 20.3,19 18.5,19" />
                <polygon points="18.5,5 19.5,5 23.5,19 21.5,19" />
              </g>
            </svg>
          </div>
        `;
        
        const crosswalkMarker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(pt.lat, pt.lng),
          map: mapInstance.current,
          icon: {
            content: crosswalkHtml,
            size: new window.naver.maps.Size(crosswalkMarkerWidth, crosswalkMarkerHeight),
            anchor: new window.naver.maps.Point(crosswalkMarkerWidth * 0.5, crosswalkMarkerHeight * 0.5)
          }
        });
        
        markersRef.current.push(crosswalkMarker);
      });
    }

    // Map Click Listener for inspect mode / coordinate check
    if (mapInstance.current && window.naver && window.naver.maps) {
      window.naver.maps.Event.clearListeners(mapInstance.current, 'click');
      window.naver.maps.Event.addListener(mapInstance.current, 'click', (e: any) => {
        const lat = e.coord.lat();
        const lng = e.coord.lng();
        setClickedCoord({ lat, lng });

        if (tempMarkerRef.current) {
          tempMarkerRef.current.setMap(null);
        }

        tempMarkerRef.current = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(lat, lng),
          map: mapInstance.current,
          icon: {
            content: `
              <div style="background: #ef4444; color: white; border: 2px solid white; border-radius: 9999px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); animation: bounce 0.6s infinite alternate;">
                📍
              </div>
            `,
            anchor: new window.naver.maps.Point(11, 11)
          }
        });
      });
    }

  }, [station, scriptLoaded, focusedExitCoords, language, useLeaflet]);

  // 2-B. Initialize or Update Google Maps and Markers when language === 'EN'
  useEffect(() => {
    if (language !== 'EN' || useLeaflet) {
      destroyGoogleMap();
      return;
    }
    if (!googleMapsLoaded || !window.google || !window.google.maps || !mapElement.current) return;

    destroyNaverMap();
    destroyLeafletMap();

    const exits = station.exits || [];
    if (exits.length === 0) return;

    let centerLat = 0;
    let centerLng = 0;
    let currentZoom = 16;

    if (focusedExitCoords) {
      centerLat = focusedExitCoords.latitude;
      centerLng = focusedExitCoords.longitude;
      currentZoom = 18;
    } else {
      let totalLat = 0;
      let totalLng = 0;
      exits.forEach(exit => {
        totalLat += exit.latitude;
        totalLng += exit.longitude;
      });
      centerLat = totalLat / exits.length;
      centerLng = totalLng / exits.length;
      currentZoom = 16;
    }

    const mapCenter = new window.google.maps.LatLng(centerLat, centerLng);

    if (!googleMapInstance.current || !mapElement.current.childElementCount) {
      if (mapElement.current) {
        mapElement.current.innerHTML = '';
      }
      googleMapInstance.current = new window.google.maps.Map(mapElement.current, {
        center: mapCenter,
        zoom: currentZoom,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      });
    } else {
      googleMapInstance.current.setCenter(mapCenter);
      googleMapInstance.current.setZoom(currentZoom);
    }

    // Clear existing google markers
    if (googleMarkersRef.current && googleMarkersRef.current.length > 0) {
      googleMarkersRef.current.forEach(m => {
        try {
          if (m && typeof m.setMap === 'function') {
            m.setMap(null);
          }
        } catch (e) {
          // ignore
        }
      });
      googleMarkersRef.current = [];
    }

    // Determine line color accent
    const firstLine = station.lines[0];
    let mapAccentColor = '#F06A00'; // default Line 1 주황
    if (firstLine === '2') mapAccentColor = '#1b6d24'; // 초록
    else if (firstLine === '3') mapAccentColor = '#906A3B'; // 브라운
    else if (firstLine === '동해') mapAccentColor = '#004960'; // 동해 블루
    else if (firstLine === '4') mapAccentColor = '#3b82f6';
    else if (firstLine === '부산김해') mapAccentColor = '#8b5cf6';

    // Create exit markers
    exits.forEach(exit => {
      const marker = createGoogleMapExitMarker(
        googleMapInstance.current,
        exit,
        language,
        mapAccentColor
      );
      googleMarkersRef.current.push(marker);
    });

    // Add crosswalk points
    const crosswalkPoints = getStationCrosswalkPoints(station.id);
    crosswalkPoints.forEach(pt => {
      const marker = createGoogleMapCrosswalkMarker(
        googleMapInstance.current,
        pt,
        language
      );
      googleMarkersRef.current.push(marker);
    });

    // Inspect mode click listener
    if (googleMapInstance.current && window.google && window.google.maps) {
      window.google.maps.event.clearListeners(googleMapInstance.current, 'click');
      googleMapInstance.current.addListener('click', (e: any) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setClickedCoord({ lat, lng });

        if (googleTempMarkerRef.current) {
          googleTempMarkerRef.current.setMap(null);
        }

        googleTempMarkerRef.current = new window.google.maps.Marker({
          position: new window.google.maps.LatLng(lat, lng),
          map: googleMapInstance.current,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#ef4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 8
          }
        });
      });
    }
  }, [station, googleMapsLoaded, focusedExitCoords, language, useLeaflet]);

  // 3. Dynamic Leaflet CSS & Script loader
  useEffect(() => {
    if (!useLeaflet) return;

    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
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
        if ((window as any).L) {
          setLeafletLoaded(true);
        } else {
          setLoadError(true);
        }
      };
      script.onerror = () => {
        setLoadError(true);
      };
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if ((window as any).L) {
          setLeafletLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [useLeaflet]);

  // 4. Initialize or Update Leaflet Map and Markers
  useEffect(() => {
    if (!useLeaflet) {
      destroyLeafletMap();
      return;
    }
    if (!leafletLoaded || !mapElement.current) return;
    const L = (window as any).L;
    if (!L) return;

    destroyNaverMap();
    destroyGoogleMap();

    const exits = station.exits || [];
    if (exits.length === 0) return;

    // Calculate map focus center dynamically using mathematical average coordinate of all exits or focused override
    let centerLat = 0;
    let centerLng = 0;
    let currentZoom = 16;

    if (focusedExitCoords) {
      centerLat = focusedExitCoords.latitude;
      centerLng = focusedExitCoords.longitude;
      currentZoom = 18;
    } else {
      let totalLat = 0;
      let totalLng = 0;
      exits.forEach(exit => {
        totalLat += exit.latitude;
        totalLng += exit.longitude;
      });
      centerLat = totalLat / exits.length;
      centerLng = totalLng / exits.length;
      currentZoom = 16;
    }

    // Initialise Leaflet Map instantiation if not built already or DOM container was emptied
    if (!leafletMapInstance.current || !mapElement.current.childElementCount) {
      if (mapElement.current) {
        mapElement.current.innerHTML = '';
      }
      leafletMapInstance.current = L.map(mapElement.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([centerLat, centerLng], currentZoom);

      // Add Zoom Control on the top-right
      L.control.zoom({
        position: 'topright'
      }).addTo(leafletMapInstance.current);

      // Add standard clean OpenStreetMap tiles (100% free, no API key required, no watermarks)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(leafletMapInstance.current);
    } else {
      // Update central zoom dynamically and move center smoothly
      leafletMapInstance.current.setView([centerLat, centerLng], currentZoom);
      setTimeout(() => {
        if (leafletMapInstance.current) {
          leafletMapInstance.current.invalidateSize();
        }
      }, 50);
    }

    // Reset previous loaded markers to avoid rendering duplication
    leafletMarkersRef.current.forEach(m => m.remove());
    leafletMarkersRef.current = [];

    // Map exits and build markers
    exits.forEach(exit => {
      const line = station.lines[0];
      let mapAccentColor = '#F06A00'; // default 주황
      if (line === '2') mapAccentColor = '#1b6d24'; // 초록
      else if (line === '3') mapAccentColor = '#906A3B'; // 브라운
      else if (line === '동해') mapAccentColor = '#004960'; // 동해 블루

      let iconHtml = '';
      if (exit.hasElevator && exit.hasEscalator) {
        iconHtml = `
          <div style="display: flex; align-items: center; gap: 3px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="${mapAccentColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; flex-shrink: 0; display: inline-block; vertical-align: middle;">
              <rect x="3" y="3" width="18" height="18" rx="2.5" />
              <path d="M 7.5 10 L 9.5 7 L 11.5 10 Z" fill="${mapAccentColor}" stroke="none" />
              <path d="M 7.5 14 L 9.5 17 L 11.5 14 Z" fill="${mapAccentColor}" stroke="none" />
              <line x1="14.5" y1="3" x2="14.5" y2="21" stroke-dasharray="2 2" stroke-width="1.5" />
              <path d="M 14.5 12 L 17.5 12" />
              <path d="M 17.5 12 L 16 10.5" />
              <path d="M 17.5 12 L 16 13.5" />
            </svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="${mapAccentColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; flex-shrink: 0; display: inline-block; vertical-align: middle;">
              <circle cx="10" cy="7.5" r="1.8" fill="${mapAccentColor}" stroke="none" />
              <path d="M 10 10.2 L 10 14" stroke="${mapAccentColor}" stroke-width="2.5" stroke-linecap="round" />
              <path d="M 3.5 19.5 L 7.5 19.5 C 9.5 19.5, 10.5 18, 12 15.5 L 15.5 10 C 17 8, 18 7, 20.5 7 L 22.5 7" />
            </svg>
          </div>
        `;
      } else if (exit.hasElevator) {
        iconHtml = `
          <svg viewBox="0 0 24 24" fill="none" stroke="${mapAccentColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; flex-shrink: 0; display: inline-block; vertical-align: middle;">
            <rect x="3" y="3" width="18" height="18" rx="2.5" />
            <path d="M 7.5 10 L 9.5 7 L 11.5 10 Z" fill="${mapAccentColor}" stroke="none" />
            <path d="M 7.5 14 L 9.5 17 L 11.5 14 Z" fill="${mapAccentColor}" stroke="none" />
            <line x1="14.5" y1="3" x2="14.5" y2="21" stroke-dasharray="2 2" stroke-width="1.5" />
            <path d="M 14.5 12 L 17.5 12" />
            <path d="M 17.5 12 L 16 10.5" />
            <path d="M 17.5 12 L 16 13.5" />
          </svg>
        `;
      } else if (exit.hasEscalator) {
        iconHtml = `
          <svg viewBox="0 0 24 24" fill="none" stroke="${mapAccentColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; flex-shrink: 0; display: inline-block; vertical-align: middle;">
            <circle cx="10" cy="7.5" r="1.8" fill="${mapAccentColor}" stroke="none" />
            <path d="M 10 10.2 L 10 14" stroke="${mapAccentColor}" stroke-width="2.5" stroke-linecap="round" />
            <path d="M 3.5 19.5 L 7.5 19.5 C 9.5 19.5, 10.5 18, 12 15.5 L 15.5 10 C 17 8, 18 7, 20.5 7 L 22.5 7" />
          </svg>
        `;
      } else {
        iconHtml = `
          <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; flex-shrink: 0; display: inline-block; vertical-align: middle;">
            <path d="M 3.5 19.5 L 7.5 19.5 L 7.5 15.5 L 11.5 15.5 L 11.5 11.5 L 15.5 11.5 L 15.5 7.5 L 20.5 7.5" />
          </svg>
        `;
      }

      // Precise pixel-perfect marker dimensions
      const markerWidth = 140;
      const markerHeight = 44;

      const markerContent = `
        <div style="width: ${markerWidth}px; height: ${markerHeight}px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; position: relative;">
          <!-- Premium bubble label containing exit name and its mobility SVG icon -->
          <div style="background-color: white; border: 2.5px solid ${mapAccentColor}; border-radius: 9999px; padding: 5px 12px; font-weight: 850; font-size: 11px; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.18); display: flex; align-items: center; gap: 4.5px; position: relative; margin-bottom: 2px;">
            <div style="display: flex; align-items: center; justify-content: center; min-width: 16px; height: 16px;">${iconHtml}</div>
            <span style="color: #0f172a; font-family: system-ui, sans-serif; letter-spacing: -0.02em; font-weight: 900;">${translateExitNumber(exit.number, language)}</span>
          </div>
          <!-- Pin Arrow Indicator -->
          <div style="width: 0; height: 0; border-left: 6.5px solid transparent; border-right: 6.5px solid transparent; border-top: 7px solid ${mapAccentColor}; margin-top: -1px;"></div>
        </div>
      `;

      // Create Leaflet DivIcon
      const customIcon = L.divIcon({
        html: markerContent,
        className: 'leaflet-custom-marker-wrapper',
        iconSize: [markerWidth, markerHeight],
        iconAnchor: [markerWidth * 0.5, markerHeight]
      });

      const marker = L.marker([exit.latitude, exit.longitude], { icon: customIcon }).addTo(leafletMapInstance.current);

      // Marker click listener
      marker.on('click', () => {
        leafletMapInstance.current.panTo([exit.latitude, exit.longitude]);
        
        // Auto scroll list window viewport target layout to match user-focused exit details
        const el = document.getElementById(`exit-item-${exit.number}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const tabBtn = document.getElementById(`expand-exit-btn-${exit.number}`);
          if (tabBtn) {
            tabBtn.click();
          }
        }
      });

      leafletMarkersRef.current.push(marker);
    });

    // Add custom crosswalk indicators for Leaflet fallback
    const crosswalkPoints = getStationCrosswalkPoints(station.id);
    
    if (crosswalkPoints.length > 0) {
      const crosswalkMarkerWidth = 32;
      const crosswalkMarkerHeight = 32;
      
      crosswalkPoints.forEach(pt => {
        const titleText = language === 'KR' ? pt.nameKr : pt.nameEn;
        const crosswalkHtml = `
          <div style="width: ${crosswalkMarkerWidth}px; height: ${crosswalkMarkerHeight}px; display: flex; align-items: center; justify-content: center; background-color: #ffffff; border: 2.5px solid #2563eb; border-radius: 9999px; box-shadow: 0 3px 10px rgba(0,0,0,0.18); cursor: pointer;" title="${titleText}">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
              <g fill="#2563eb">
                <polygon points="4.5,5 5.5,5 2.5,19 0.5,19" />
                <polygon points="6.5,5 7.5,5 5.5,19 3.7,19" />
                <polygon points="8.5,5 9.5,5 8.5,19 6.8,19" />
                <polygon points="10.5,5 11.5,5 11.3,19 9.8,19" />
                <polygon points="12.5,5 13.5,5 14.2,19 12.7,19" />
                <polygon points="14.5,5 15.5,5 17.2,19 15.5,19" />
                <polygon points="16.5,5 17.5,5 20.3,19 18.5,19" />
                <polygon points="18.5,5 19.5,5 23.5,19 21.5,19" />
              </g>
            </svg>
          </div>
        `;

        const crosswalkIcon = L.divIcon({
          html: crosswalkHtml,
          className: 'leaflet-custom-marker-wrapper',
          iconSize: [crosswalkMarkerWidth, crosswalkMarkerHeight],
          iconAnchor: [crosswalkMarkerWidth * 0.5, crosswalkMarkerHeight * 0.5]
        });

        const crosswalkMarker = L.marker([pt.lat, pt.lng], { icon: crosswalkIcon, title: titleText }).addTo(leafletMapInstance.current);
        leafletMarkersRef.current.push(crosswalkMarker);
      });
    }

    // Leaflet Click Listener for inspect mode / coordinate check
    if (leafletMapInstance.current) {
      leafletMapInstance.current.off('click');
      leafletMapInstance.current.on('click', (e: any) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setClickedCoord({ lat, lng });

        if (leafletTempMarkerRef.current) {
          leafletMapInstance.current.removeLayer(leafletTempMarkerRef.current);
        }

        const tempIcon = L.divIcon({
          html: `
            <div style="background: #ef4444; color: white; border: 2px solid white; border-radius: 9999px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
              📍
            </div>
          `,
          className: 'leaflet-custom-marker-wrapper',
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        leafletTempMarkerRef.current = L.marker([lat, lng], { icon: tempIcon }).addTo(leafletMapInstance.current);
      });
    }

    // Force map size invalidation after render to ensure 100% full container rendering
    const timer = setTimeout(() => {
      try {
        leafletMapInstance.current?.invalidateSize();
      } catch (e) {
        // ignore
      }
    }, 150);

    return () => clearTimeout(timer);

  }, [station, leafletLoaded, useLeaflet, focusedExitCoords, language]);

  // Clean-up logic on unmount and window resize handler to ensure maps stay perfectly sized
  useEffect(() => {
    const handleResize = () => {
      try {
        if (leafletMapInstance.current) {
          leafletMapInstance.current.invalidateSize();
        }
        if (mapInstance.current && window.naver && window.naver.maps) {
          window.naver.maps.Event.trigger(mapInstance.current, 'resize');
        }
        if (googleMapInstance.current && window.google && window.google.maps) {
          window.google.maps.event.trigger(googleMapInstance.current, 'resize');
        }
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      destroyNaverMap();
      destroyLeafletMap();
      destroyGoogleMap();
    };
  }, []);

  return (
    <div className="flex flex-col w-full bg-white overflow-hidden rounded-3xl border border-slate-100/80 transition-all duration-300">
      {/* Naver Authentication Warning Banner */}
      {naverAuthFailed && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-3.5 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-amber-950 gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="shrink-0 text-sm">⚠️</span>
            <span className="font-semibold leading-tight text-[11.5px]">
              {language === 'KR' 
                ? '현재 접속 웹 주소가 네이버 지도 API에 등록되어 있지 않습니다. (대체 지도로 자동 전환됨)' 
                : 'Current domain is pending Naver Maps approval. Auto-switched to OpenStreetMap.'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin);
                alert(language === 'KR' 
                  ? `현재 주소가 복사되었습니다!\n\n${window.location.origin}\n\n네이버 클라우드 플랫폼 Web Service URL에 위 주소를 추가해 주세요.` 
                  : `Copied domain URL:\n${window.location.origin}`);
              }}
              className="px-2 py-1 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-lg font-bold text-[10.5px] transition cursor-pointer"
            >
              {language === 'KR' ? '주소 복사' : 'Copy Domain'}
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-[10.5px] transition cursor-pointer"
            >
              {language === 'KR' ? 'API 설정' : 'Settings'}
            </button>
          </div>
        </div>
      )}

      {/* Map display block */}
      <div className="w-full h-[320px] relative bg-slate-50 border-b border-slate-100 transition-all duration-300">
        
        {/* Floating Map Control Panel - ONLY show retry in fallback Leaflet mode */}
        <div className="absolute top-3 left-3 z-[1000] flex flex-wrap gap-2">
          {useLeaflet && (language === 'KR' || isOriginAuthorizedForGoogleMaps()) && (
            <button
              onClick={() => {
                setUseLeaflet(false);
                setNaverAuthFailed(false);
                setGoogleMapsFailed(false);
                (window as any).GOOGLE_MAPS_AUTH_FAILED = false;
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white shadow-md hover:bg-blue-700 rounded-full text-xs font-bold transition-all cursor-pointer"
            >
              🗺️ {language === 'KR' ? '네이버 지도로 다시 시도' : 'Retry Google Maps'}
            </button>
          )}

          {isAdminMode && (
            <button
              onClick={() => {
                setInspectMode(!inspectMode);
                if (inspectMode) {
                  setClickedCoord(null);
                  if (tempMarkerRef.current) tempMarkerRef.current.setMap(null);
                  if (leafletTempMarkerRef.current && leafletMapInstance.current) {
                    leafletMapInstance.current.removeLayer(leafletTempMarkerRef.current);
                  }
                }
              }}
              className={`flex items-center gap-1 px-3 py-1.5 shadow-md rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                inspectMode 
                  ? 'bg-rose-600 text-white ring-2 ring-rose-300 animate-pulse' 
                  : 'bg-slate-900/90 hover:bg-slate-900 text-white backdrop-blur-sm'
              }`}
            >
              {inspectMode ? '🎯 ' + (language === 'KR' ? '좌표 확인 감지 중 (클릭하세요)' : 'Inspecting Coordinates...') : '📍 ' + (language === 'KR' ? '좌표 확인 모드' : 'Inspect Coordinates')}
            </button>
          )}
        </div>

        {/* Clicked Coordinates Banner / Toast */}
        {clickedCoord && (
          <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 text-white shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 animate-slide-up">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-xl shrink-0">📍</span>
              <div className="space-y-0.5">
                <div className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider">
                  {language === 'KR' ? '선택한 지점 좌표' : 'Selected Location Coordinates'}
                </div>
                <div className="text-xs font-mono font-bold text-slate-100 selection:bg-blue-500">
                  latitude: {clickedCoord.lat.toFixed(6)}, longitude: {clickedCoord.lng.toFixed(6)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  const text = `latitude: ${clickedCoord.lat.toFixed(6)},\nlongitude: ${clickedCoord.lng.toFixed(6)}`;
                  navigator.clipboard.writeText(text);
                  alert(language === 'KR' ? `복사되었습니다!\n\n${text}` : `Copied!\n\n${text}`);
                }}
                className="flex-1 sm:flex-initial px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-black rounded-xl transition cursor-pointer shadow-sm"
              >
                📋 {language === 'KR' ? '좌표 복사' : 'Copy'}
              </button>
              <button
                onClick={() => {
                  setClickedCoord(null);
                  if (tempMarkerRef.current) tempMarkerRef.current.setMap(null);
                  if (leafletTempMarkerRef.current && leafletMapInstance.current) {
                    leafletMapInstance.current.removeLayer(leafletTempMarkerRef.current);
                  }
                }}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Settings & Authorization Overlay */}
        {(showSettings || (naverAuthFailed && !useLeaflet)) && (
          <div className="absolute inset-0 bg-slate-900/95 z-[1001] flex flex-col p-5 overflow-y-auto text-slate-100 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h4 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                🟢 {language === 'KR' ? '네이버 지도 API 설정' : 'Naver Maps API Settings'}
              </h4>
              <button
                onClick={() => {
                  setShowSettings(false);
                  setNaverAuthFailed(false);
                }}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition"
              >
                ✕ {language === 'KR' ? '닫기' : 'Close'}
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
              <p>
                {language === 'KR' ? (
                  <>
                    네이버 지도를 표시하려면 <strong>네이버 클라우드 플랫폼</strong>에 아래 웹 주소를 등록하셔야 합니다.
                  </>
                ) : (
                  <>
                    To display Naver Maps, you must register this app's Web Service URLs in your <strong>NAVER Cloud Platform</strong> settings.
                  </>
                )}
              </p>

              <div className="bg-slate-950 p-3 rounded-xl space-y-2 border border-slate-800">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-500 block">
                  {language === 'KR' ? '등록해야 할 웹 서비스 URL:' : 'Web Service URLs to register:'}
                </span>
                <div className="space-y-1.5 font-mono text-[11px] text-slate-400">
                  <div className="flex items-center justify-between gap-2 bg-slate-900 px-2 py-1 rounded">
                    <span>http://localhost:3000</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('http://localhost:3000');
                        alert(language === 'KR' ? '복사되었습니다!' : 'Copied!');
                      }}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-300 cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-slate-900 px-2 py-1 rounded">
                    <span className="truncate">{window.location.origin}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin);
                        alert(language === 'KR' ? '복사되었습니다!' : 'Copied!');
                      }}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-300 cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-black text-slate-200">
                  {language === 'KR' ? '네이버 Client ID 입력:' : 'Naver Client ID:'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempClientId}
                    onChange={(e) => setTempClientId(e.target.value)}
                    placeholder="jig5o1hthp"
                    className="flex-1 bg-slate-950 text-white border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => {
                      localStorage.setItem('custom_naver_client_id', tempClientId.trim());
                      setNaverClientId(tempClientId.trim());
                      setShowSettings(false);
                      setNaverAuthFailed(false);
                      setUseLeaflet(false);
                      window.location.reload();
                    }}
                    className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                  >
                    {language === 'KR' ? '저장 및 적용' : 'Save & Apply'}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-between gap-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setUseLeaflet(true);
                    setShowSettings(false);
                    setNaverAuthFailed(false);
                    setGoogleMapsFailed(true);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold py-2 px-3 rounded-xl transition text-center text-[11px] cursor-pointer"
                >
                  🌐 {language === 'KR' ? '대체 지도(Leaflet)로 계속 보기' : 'Use Fallback Leaflet Map'}
                </button>
                
                <button
                  onClick={() => {
                    localStorage.removeItem('custom_naver_client_id');
                    setNaverClientId('');
                    window.location.reload();
                  }}
                  className="text-slate-500 hover:text-slate-300 font-bold py-2 px-3 transition text-center text-[11px] cursor-pointer"
                >
                  🔄 {language === 'KR' ? '기본값 초기화' : 'Reset Default'}
                </button>
              </div>
            </div>
          </div>
        )}

        {loadError ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center space-y-2 bg-rose-50/20">
            <span className="text-3xl text-rose-500">🗺️</span>
            <p className="font-extrabold text-sm text-slate-800">
              {language === 'KR' ? '지도를 불러올 수 없습니다.' : 'Failed to initialize Map API.'}
            </p>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              {language === 'KR' 
                ? '지하철역 지도 정보를 표현하기 위한 자원 로드 중 문제가 발생했습니다.' 
                : 'Could not load interactive station map context.'}
            </p>
          </div>
        ) : useLeaflet && !leafletLoaded ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-3 bg-slate-50">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-400">
              {language === 'KR' ? '실시간 인터랙티브 지도 준비 중...' : 'Initializing fallback maps...'}
            </p>
          </div>
        ) : !useLeaflet && language === 'KR' && !scriptLoaded ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-3 bg-slate-50">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-400">
              실시간 지하철역 지도 데이터 로딩 중...
            </p>
          </div>
        ) : !useLeaflet && language === 'EN' && !googleMapsLoaded ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-3 bg-slate-50">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-400">
              Loading Google Maps...
            </p>
          </div>
        ) : null}

        {/* Permanent Map Container DOM Node */}
        <div className="w-full h-full" ref={mapElement} id="subway-map-container" />
      </div>

      {/* Information Tip Bar */}
      <div className="bg-slate-50/80 px-4 py-2.5 flex items-start gap-2.5 border-t border-slate-100">
        <span className="text-base sm:text-lg leading-none select-none mt-0.5">💡</span>
        <div className="text-[11.5px] sm:text-xs font-bold text-slate-600 leading-relaxed pt-0.5">
          {language === 'KR' ? (
            <span>
              지도의 <CrosswalkIcon size={16} className="mx-0.5 -mt-0.5" /> 아이콘은 해당 위치에 횡단보도가 설치되어 있음을 나타냅니다.
            </span>
          ) : (
            <span>
              The <CrosswalkIcon size={16} className="mx-0.5 -mt-0.5" /> icon on the map indicates that there is a pedestrian crosswalk located at that position.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
