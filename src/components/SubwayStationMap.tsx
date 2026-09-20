import React, { useEffect, useRef, useState } from 'react';
import { Station, ExitInfo, translateExitNumber } from '../types';
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
    return true;
  };

  // Do NOT preemptively set useLeaflet to true in EN mode.
  // We allow the Google Maps loading effect to execute and attempt loading first.
  const [useLeaflet, setUseLeaflet] = useState<boolean>(() => {
    if (language === 'EN') {
      if ((window as any).GOOGLE_MAPS_AUTH_FAILED) {
        return true;
      }
      if (!isOriginAuthorizedForGoogleMaps()) {
        console.warn('[Stepless Map] Current origin is not an authorized Google Maps domain. Using Leaflet fallback.');
        return true;
      }
    }
    return false;
  });
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);
  const leafletMapInstance = useRef<any>(null);
  const leafletMarkersRef = useRef<any[]>([]);

  // When switching to EN, if auth previously failed or origin is unauthorized, switch to Leaflet.
  // Otherwise, keep useLeaflet false so Google Maps script loading can proceed.
  useEffect(() => {
    if (language === 'EN') {
      if ((window as any).GOOGLE_MAPS_AUTH_FAILED) {
        setUseLeaflet(true);
      } else if (!isOriginAuthorizedForGoogleMaps()) {
        console.warn('[Stepless Map] Current origin is not an authorized Google Maps domain. Using Leaflet fallback.');
        setUseLeaflet(true);
      }
    }
  }, [language]);

  // Coordinate inspector & Admin mode detection (props, localStorage, sessionStorage, or window global)
  const [sessionAdmin, setSessionAdmin] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('isAdmin') === 'true' ||
               localStorage.getItem('isAdminMode') === 'true' ||
               sessionStorage.getItem('isAdmin') === 'true' ||
               sessionStorage.getItem('isAdminMode') === 'true' ||
               (window as any).isAdmin === true ||
               (window as any).isAdminMode === true;
      }
    } catch {}
    return false;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const val = localStorage.getItem('isAdmin') === 'true' ||
                    localStorage.getItem('isAdminMode') === 'true' ||
                    sessionStorage.getItem('isAdmin') === 'true' ||
                    sessionStorage.getItem('isAdminMode') === 'true' ||
                    (window as any).isAdmin === true ||
                    (window as any).isAdminMode === true;
        setSessionAdmin(val);
      } catch {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const effectiveAdmin = Boolean(isAdminMode || sessionAdmin);

  // Editable station exits state for admin live modification & marker moving
  const [stationExits, setStationExits] = useState<ExitInfo[]>(() => {
    try {
      const saved = localStorage.getItem(`admin_station_override_${station.id}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return station.exits || [];
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`admin_station_override_${station.id}`);
      if (saved) {
        setStationExits(JSON.parse(saved));
        return;
      }
    } catch {}
    setStationExits(station.exits || []);
  }, [station.id]);

  // Coordinate inspector mode state
  const [inspectMode, setInspectMode] = useState<boolean>(false);
  const [clickedCoord, setClickedCoord] = useState<{ lat: number; lng: number } | null>(null);
  const tempMarkerRef = useRef<any>(null);
  const leafletTempMarkerRef = useRef<any>(null);

  // Admin location edit form states
  const [isEditPanelOpen, setIsEditPanelOpen] = useState<boolean>(false);
  const [selectedExitForEdit, setSelectedExitForEdit] = useState<string>('');
  const [editLat, setEditLat] = useState<string>('');
  const [editLng, setEditLng] = useState<string>('');
  const [editExitNumber, setEditExitNumber] = useState<string>('');
  const [editDirectionDesc, setEditDirectionDesc] = useState<string>('');
  const [editHasElevator, setEditHasElevator] = useState<boolean>(false);
  const [editHasEscalator, setEditHasEscalator] = useState<boolean>(false);
  const [editIsAccessible, setEditIsAccessible] = useState<boolean>(true);
  const [adminToast, setAdminToast] = useState<string | null>(null);

  // Reset inspect mode and markers if admin mode is disabled
  useEffect(() => {
    if (!effectiveAdmin) {
      setInspectMode(false);
      setClickedCoord(null);
      setIsEditPanelOpen(false);
      if (tempMarkerRef.current) {
        try { tempMarkerRef.current.setMap(null); } catch {}
        tempMarkerRef.current = null;
      }
      if (googleTempMarkerRef.current) {
        try { googleTempMarkerRef.current.setMap(null); } catch {}
        googleTempMarkerRef.current = null;
      }
      if (leafletTempMarkerRef.current && leafletMapInstance.current) {
        try { leafletMapInstance.current.removeLayer(leafletTempMarkerRef.current); } catch {}
        leafletTempMarkerRef.current = null;
      }
    }
  }, [effectiveAdmin]);

  // Helper to place/move the admin coordinate marker and populate edit form
  const handleMapCoordinateClick = (lat: number, lng: number, mapType: 'naver' | 'google' | 'leaflet') => {
    if (!effectiveAdmin) return;

    setClickedCoord({ lat, lng });
    setEditLat(lat.toFixed(6));
    setEditLng(lng.toFixed(6));

    if (mapType === 'naver' && mapInstance.current && window.naver?.maps) {
      if (tempMarkerRef.current) {
        tempMarkerRef.current.setPosition(new window.naver.maps.LatLng(lat, lng));
      } else {
        tempMarkerRef.current = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(lat, lng),
          map: mapInstance.current,
          draggable: true,
          icon: {
            content: `
              <div style="background: #ef4444; color: white; border: 2.5px solid white; border-radius: 9999px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; box-shadow: 0 4px 14px rgba(239,68,68,0.6); cursor: grab; user-select: none;">
                📍
              </div>
            `,
            anchor: new window.naver.maps.Point(14, 14)
          }
        });
        window.naver.maps.Event.addListener(tempMarkerRef.current, 'dragend', (e: any) => {
          const dLat = e.coord.lat();
          const dLng = e.coord.lng();
          handleMapCoordinateClick(dLat, dLng, 'naver');
        });
      }
    } else if (mapType === 'google' && googleMapInstance.current && window.google?.maps) {
      if (googleTempMarkerRef.current) {
        googleTempMarkerRef.current.setPosition(new window.google.maps.LatLng(lat, lng));
      } else {
        googleTempMarkerRef.current = new window.google.maps.Marker({
          position: new window.google.maps.LatLng(lat, lng),
          map: googleMapInstance.current,
          draggable: true,
          title: language === 'KR' ? '관리자 지정 위치 (드래그 가능)' : 'Admin Location (Draggable)',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#ef4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2.5,
            scale: 9
          }
        });
        googleTempMarkerRef.current.addListener('dragend', (e: any) => {
          const dLat = e.latLng.lat();
          const dLng = e.latLng.lng();
          handleMapCoordinateClick(dLat, dLng, 'google');
        });
      }
    } else if (mapType === 'leaflet' && leafletMapInstance.current && (window as any).L) {
      const L = (window as any).L;
      if (leafletTempMarkerRef.current) {
        leafletTempMarkerRef.current.setLatLng([lat, lng]);
      } else {
        const tempIcon = L.divIcon({
          html: `
            <div style="background: #ef4444; color: white; border: 2.5px solid white; border-radius: 9999px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; box-shadow: 0 4px 14px rgba(239,68,68,0.6); cursor: grab;">
              📍
            </div>
          `,
          className: 'leaflet-custom-marker-wrapper',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        leafletTempMarkerRef.current = L.marker([lat, lng], { icon: tempIcon, draggable: true }).addTo(leafletMapInstance.current);
        leafletTempMarkerRef.current.on('dragend', (e: any) => {
          const pos = e.target.getLatLng();
          handleMapCoordinateClick(pos.lat, pos.lng, 'leaflet');
        });
      }
    }
  };

  // Pre-fill exit info when dropdown selects an exit
  const handleSelectExitForEdit = (exitNumber: string) => {
    setSelectedExitForEdit(exitNumber);
    if (!exitNumber || exitNumber === '__NEW__') {
      setEditExitNumber('');
      setEditDirectionDesc('');
      setEditHasElevator(false);
      setEditHasEscalator(false);
      setEditIsAccessible(true);
      return;
    }
    const target = stationExits.find(e => e.number === exitNumber);
    if (target) {
      setEditExitNumber(target.number);
      setEditDirectionDesc(target.directionDesc || '');
      setEditHasElevator(Boolean(target.hasElevator));
      setEditHasEscalator(Boolean(target.hasEscalator));
      setEditIsAccessible(Boolean(target.isAccessible));
    }
  };

  // Apply coordinates to the selected exit and refresh map
  const handleApplyCoordinatesToExit = () => {
    const lat = parseFloat(editLat);
    const lng = parseFloat(editLng);
    if (isNaN(lat) || isNaN(lng)) {
      alert(language === 'KR' ? '유효한 위도와 경도를 입력해 주세요.' : 'Please enter valid coordinates.');
      return;
    }

    if (!selectedExitForEdit || selectedExitForEdit === '__NEW__') {
      const newExitNum = editExitNumber.trim() || `${stationExits.length + 1}`;
      const newExit: ExitInfo = {
        number: newExitNum,
        isAccessible: editIsAccessible,
        hasElevator: editHasElevator,
        hasEscalator: editHasEscalator,
        isStrollerFriendly: editIsAccessible,
        tip: `${station.name} ${newExitNum}번 출구`,
        tipEn: `${station.englishName} Exit ${newExitNum}`,
        status: 'OPERATIONAL',
        directionDesc: editDirectionDesc.trim() || `${station.name} 방면`,
        directionDescEn: `${station.englishName} area`,
        latitude: lat,
        longitude: lng,
        kakaoMapUrl: `https://map.kakao.com/link/map/${encodeURIComponent(station.name + ' ' + newExitNum + '번 출구')},${lat},${lng}`,
        naverMapUrl: `https://map.naver.com/v5/search/${encodeURIComponent(station.name + ' ' + newExitNum + '번 출구')}`,
        pathwayTimeline: []
      };
      const updated = [...stationExits, newExit];
      setStationExits(updated);
      try {
        localStorage.setItem(`admin_station_override_${station.id}`, JSON.stringify(updated));
      } catch {}
      setAdminToast(language === 'KR' ? `새로운 [${newExitNum}번 출구] 마커가 등록되었습니다.` : `New Exit ${newExitNum} marker registered.`);
      setSelectedExitForEdit(newExitNum);
    } else {
      const updated = stationExits.map(ex => {
        if (ex.number === selectedExitForEdit) {
          return {
            ...ex,
            latitude: lat,
            longitude: lng,
            directionDesc: editDirectionDesc.trim() || ex.directionDesc,
            hasElevator: editHasElevator,
            hasEscalator: editHasEscalator,
            isAccessible: editIsAccessible,
          };
        }
        return ex;
      });
      setStationExits(updated);
      try {
        localStorage.setItem(`admin_station_override_${station.id}`, JSON.stringify(updated));
      } catch {}
      setAdminToast(language === 'KR' ? `[${selectedExitForEdit}번 출구] 좌표가 성공적으로 수정되었습니다.` : `Exit ${selectedExitForEdit} coordinates updated.`);
    }

    setTimeout(() => setAdminToast(null), 3500);
  };

  // Reset station exits to default data
  const handleResetExits = () => {
    try {
      localStorage.removeItem(`admin_station_override_${station.id}`);
    } catch {}
    setStationExits(station.exits || []);
    setSelectedExitForEdit('');
    setAdminToast(language === 'KR' ? '출구 데이터가 기본 데이터로 초기화되었습니다.' : 'Restored to default station exits.');
    setTimeout(() => setAdminToast(null), 3500);
  };

  // Pan and center map to coordinates
  const handleCenterOnCoord = () => {
    const lat = parseFloat(editLat);
    const lng = parseFloat(editLng);
    if (isNaN(lat) || isNaN(lng)) return;

    if (mapInstance.current && window.naver?.maps) {
      mapInstance.current.panTo(new window.naver.maps.LatLng(lat, lng));
    } else if (googleMapInstance.current && window.google?.maps) {
      googleMapInstance.current.panTo(new window.google.maps.LatLng(lat, lng));
    } else if (leafletMapInstance.current) {
      leafletMapInstance.current.panTo([lat, lng]);
    }
  };

  // Manually move admin marker to coordinates in editLat/editLng inputs
  const handleManualMoveMarker = () => {
    const lat = parseFloat(editLat);
    const lng = parseFloat(editLng);
    if (isNaN(lat) || isNaN(lng)) {
      alert(language === 'KR' ? '유효한 위도와 경도를 입력해 주세요.' : 'Please enter valid coordinates.');
      return;
    }
    const currentEngine = language === 'EN' && !useLeaflet ? 'google' : useLeaflet ? 'leaflet' : 'naver';
    handleMapCoordinateClick(lat, lng, currentEngine);
    handleCenterOnCoord();
  };

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

    const defaultKey = 'AIzaSyDEKgT4EZLHN5agdtkadl7q8NHaeO_g4DE';
    const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || defaultKey).trim();

    // 1. Check prerequisites before attempting Google Maps script loading
    if (!apiKey) {
      console.warn('[Stepless Map] Google Maps API key missing (import.meta.env.VITE_GOOGLE_MAPS_API_KEY is empty). Falling back to Leaflet.');
      destroyGoogleMap();
      setGoogleMapsFailed(true);
      setUseLeaflet(true);
      return;
    }

    if ((window as any).GOOGLE_MAPS_AUTH_FAILED) {
      console.warn('[Stepless Map] Google Maps authentication previously failed on this session. Using Leaflet fallback.');
      destroyGoogleMap();
      setGoogleMapsFailed(true);
      setUseLeaflet(true);
      return;
    }

    if (!isOriginAuthorizedForGoogleMaps()) {
      console.warn('[Stepless Map] Current origin is unauthorized for Google Maps. Falling back to Leaflet.');
      destroyGoogleMap();
      setGoogleMapsFailed(true);
      setUseLeaflet(true);
      return;
    }

    if (googleMapsFailed) {
      destroyGoogleMap();
      setUseLeaflet(true);
      return;
    }

    const handleAuthFailure = (reason?: string) => {
      console.warn(`[Stepless Map] Google Maps authentication failure (${reason || 'unspecified'}). Falling back to Leaflet.`);
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
    window.gm_authFailure = () => handleAuthFailure('gm_authFailure');
    (window as any).onGoogleMapsAuthFailed = () => handleAuthFailure('onGoogleMapsAuthFailed');

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
        handleAuthFailure('RefererNotAllowed or script error event');
      }
    };
    window.addEventListener('error', handleErrorEvent);

    const scriptId = 'google-maps-script';
    let existingScript = document.getElementById(scriptId) as HTMLScriptElement;
    if (existingScript) {
      console.info('[Stepless Map] Reusing existing Google Maps script tag...');
      const interval = setInterval(() => {
        if ((window as any).GOOGLE_MAPS_AUTH_FAILED) {
          handleAuthFailure('existing script auth failed');
          clearInterval(interval);
        } else if (window.google && window.google.maps) {
          console.info('[Stepless Map] Google Maps script loaded successfully.');
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
    console.info('[Stepless Map] Google Maps script loading initiated for EN mode.');
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&hl=en&language=en`;
    script.async = true;
    script.onload = () => {
      setTimeout(() => {
        if (window.google && window.google.maps && !(window as any).GOOGLE_MAPS_AUTH_FAILED) {
          console.info('[Stepless Map] Google Maps script loaded and initialized successfully.');
          setGoogleMapsLoaded(true);
          setGoogleMapsFailed(false);
        } else {
          handleAuthFailure('loaded but window.google.maps missing or auth failed');
        }
      }, 300);
    };
    script.onerror = () => {
      // Script failed to load (network error, blocked, 404)
      console.warn('[Stepless Map] Google Maps script load error (network error or blocked). Falling back to Leaflet.');
      handleAuthFailure('script.onerror');
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

    const exits = stationExits;
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

    // Map Click Listener for admin inspect mode / coordinate check
    if (mapInstance.current && window.naver && window.naver.maps) {
      window.naver.maps.Event.clearListeners(mapInstance.current, 'click');
      window.naver.maps.Event.addListener(mapInstance.current, 'click', (e: any) => {
        if (!effectiveAdmin) return;
        const lat = e.coord.lat();
        const lng = e.coord.lng();
        handleMapCoordinateClick(lat, lng, 'naver');
      });
    }

  }, [station, scriptLoaded, focusedExitCoords, language, useLeaflet, stationExits, effectiveAdmin]);

  // 2-B. Initialize or Update Google Maps and Markers when language === 'EN'
  useEffect(() => {
    if (language !== 'EN' || useLeaflet) {
      destroyGoogleMap();
      return;
    }
    if (!googleMapsLoaded || !window.google || !window.google.maps || !mapElement.current) return;

    destroyNaverMap();
    destroyLeafletMap();

    const exits = stationExits;
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
        gestureHandling: 'greedy',
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
        if (!effectiveAdmin) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        handleMapCoordinateClick(lat, lng, 'google');
      });
    }
  }, [station, googleMapsLoaded, focusedExitCoords, language, useLeaflet, stationExits, effectiveAdmin]);

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

    const exits = stationExits;
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
        if (!effectiveAdmin) return;
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        handleMapCoordinateClick(lat, lng, 'leaflet');
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

  }, [station, leafletLoaded, useLeaflet, focusedExitCoords, language, stationExits, effectiveAdmin]);

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

          {effectiveAdmin && (
            <button
              onClick={() => {
                setInspectMode(!inspectMode);
                if (inspectMode) {
                  setClickedCoord(null);
                  setIsEditPanelOpen(false);
                  if (tempMarkerRef.current) {
                    try { tempMarkerRef.current.setMap(null); } catch {}
                    tempMarkerRef.current = null;
                  }
                  if (googleTempMarkerRef.current) {
                    try { googleTempMarkerRef.current.setMap(null); } catch {}
                    googleTempMarkerRef.current = null;
                  }
                  if (leafletTempMarkerRef.current && leafletMapInstance.current) {
                    try { leafletMapInstance.current.removeLayer(leafletTempMarkerRef.current); } catch {}
                    leafletTempMarkerRef.current = null;
                  }
                }
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 shadow-md rounded-full text-xs font-black transition-all cursor-pointer ${
                inspectMode 
                  ? 'bg-rose-600 text-white ring-2 ring-rose-300 animate-pulse' 
                  : 'bg-slate-900/90 hover:bg-slate-900 text-white backdrop-blur-sm'
              }`}
            >
              {inspectMode ? '🎯 ' + (language === 'KR' ? '좌표 측정/수정 모드 (지도 클릭)' : 'Inspect/Edit Mode Active') : '🛠️ ' + (language === 'KR' ? '관리자 좌표/위치 수정' : 'Admin Coordinates')}
            </button>
          )}
        </div>

        {/* Admin Coordinate Inspector & Location Edit Panel - Strictly rendered for Admins only */}
        {effectiveAdmin && clickedCoord && (
          <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-slate-900/95 backdrop-blur-md border border-slate-700/90 rounded-2xl p-3.5 text-white shadow-2xl flex flex-col gap-3 animate-slide-up max-h-[82vh] overflow-y-auto">
            {/* Header & Quick Action Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="text-xl shrink-0 p-1.5 bg-rose-600/30 border border-rose-500/50 rounded-xl">📍</span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider">
                      {language === 'KR' ? '선택한 지점 좌표 (관리자)' : 'Selected Coordinates (Admin)'}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/40">
                      {language === 'KR' ? '드래그 가능' : 'Draggable'}
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-100 selection:bg-blue-500">
                    Lat: <span className="text-emerald-400">{clickedCoord.lat.toFixed(6)}</span> | Lng: <span className="text-emerald-400">{clickedCoord.lng.toFixed(6)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    const text = `latitude: ${clickedCoord.lat.toFixed(6)},\nlongitude: ${clickedCoord.lng.toFixed(6)}`;
                    navigator.clipboard.writeText(text);
                    setAdminToast(language === 'KR' ? '좌표가 클립보드에 복사되었습니다.' : 'Coordinates copied to clipboard.');
                    setTimeout(() => setAdminToast(null), 3000);
                  }}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-xl transition cursor-pointer border border-slate-700"
                >
                  📋 {language === 'KR' ? '좌표 복사' : 'Copy'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditPanelOpen(prev => !prev)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer border shadow-sm ${
                    isEditPanelOpen 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400'
                  }`}
                >
                  ✏️ {isEditPanelOpen ? (language === 'KR' ? '수정 폼 접기' : 'Hide Form') : (language === 'KR' ? '출구 위치 연동 수정' : 'Edit Station Exit')}
                </button>

                <button
                  type="button"
                  onClick={handleCenterOnCoord}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-xl transition cursor-pointer border border-slate-700"
                  title={language === 'KR' ? '해당 좌표를 지도의 중심으로 이동합니다.' : 'Center map on coordinates'}
                >
                  🎯 {language === 'KR' ? '중심 이동' : 'Center'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setClickedCoord(null);
                    setIsEditPanelOpen(false);
                    if (tempMarkerRef.current) {
                      try { tempMarkerRef.current.setMap(null); } catch {}
                      tempMarkerRef.current = null;
                    }
                    if (googleTempMarkerRef.current) {
                      try { googleTempMarkerRef.current.setMap(null); } catch {}
                      googleTempMarkerRef.current = null;
                    }
                    if (leafletTempMarkerRef.current && leafletMapInstance.current) {
                      try { leafletMapInstance.current.removeLayer(leafletTempMarkerRef.current); } catch {}
                      leafletTempMarkerRef.current = null;
                    }
                  }}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition cursor-pointer border border-slate-700"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Admin Toast Feedback */}
            {adminToast && (
              <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between animate-fade-in">
                <span>✅ {adminToast}</span>
                <button type="button" onClick={() => setAdminToast(null)} className="text-emerald-300 hover:text-white font-bold ml-2">✕</button>
              </div>
            )}

            {/* Expanded Location Info Edit Form */}
            {isEditPanelOpen && (
              <div className="space-y-3 pt-1 text-slate-200 text-xs">
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="font-extrabold text-slate-100 flex items-center justify-between">
                    <span>⚙️ {language === 'KR' ? '출구 위치 및 시설 정보 수정 / 등록' : 'Edit / Register Station Exit Info'}</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {station.name} ({stationExits.length} {language === 'KR' ? '개 출구 등록됨' : 'exits registered'})
                    </span>
                  </div>

                  {/* 1. Target Exit Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      {language === 'KR' ? '1. 수정할 출구 선택 (선택 시 해당 정보가 자동 로드됩니다)' : '1. Select Target Exit'}
                    </label>
                    <select
                      value={selectedExitForEdit}
                      onChange={e => handleSelectExitForEdit(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                    >
                      <option value="">-- {language === 'KR' ? '기존 출구 선택' : 'Select existing exit'} --</option>
                      {stationExits.map(ex => (
                        <option key={ex.number} value={ex.number}>
                          {ex.number}번 출구 ({ex.latitude.toFixed(5)}, {ex.longitude.toFixed(5)}) {ex.hasElevator ? '🛗' : ''} {ex.hasEscalator ? '⚡' : ''} - {ex.directionDesc || '방면 안내'}
                        </option>
                      ))}
                      <option value="__NEW__">➕ {language === 'KR' ? '새로운 출구/시설 신규 추가' : 'Register as new exit'}</option>
                    </select>
                  </div>

                  {/* 2. Coordinate Adjustment Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-0.5">
                        {language === 'KR' ? '위도 (Latitude)' : 'Latitude'}
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={editLat}
                        onChange={e => setEditLat(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-0.5">
                        {language === 'KR' ? '경도 (Longitude)' : 'Longitude'}
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={editLng}
                        onChange={e => setEditLng(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Manual Coordinate Apply Button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleManualMoveMarker}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border border-slate-700"
                    >
                      📍 {language === 'KR' ? '직접 수정한 좌표로 핀 이동' : 'Move Pin to Inputs'}
                    </button>
                  </div>

                  {/* 3. Exit Metadata Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-0.5">
                        {language === 'KR' ? '출구 번호 / 시설 명칭' : 'Exit Number / Name'}
                      </label>
                      <input
                        type="text"
                        value={editExitNumber}
                        onChange={e => setEditExitNumber(e.target.value)}
                        placeholder={language === 'KR' ? '예: 7 또는 엘리베이터 1호기' : 'e.g. 7 or Elevator 1'}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-0.5">
                        {language === 'KR' ? '방면 안내 (주요 시설)' : 'Direction / Landmark'}
                      </label>
                      <input
                        type="text"
                        value={editDirectionDesc}
                        onChange={e => setEditDirectionDesc(e.target.value)}
                        placeholder={language === 'KR' ? '예: 롯데백화점, 서면지하상가 방면' : 'e.g. Lotte Dept Store'}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* 4. Accessibility Options */}
                  <div className="flex items-center gap-4 flex-wrap pt-1">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={editHasElevator}
                        onChange={e => setEditHasElevator(e.target.checked)}
                        className="rounded border-slate-700 text-blue-600 focus:ring-0 bg-slate-900 w-4 h-4 cursor-pointer"
                      />
                      <span>🛗 {language === 'KR' ? '엘리베이터 있음' : 'Elevator'}</span>
                    </label>

                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={editHasEscalator}
                        onChange={e => setEditHasEscalator(e.target.checked)}
                        className="rounded border-slate-700 text-blue-600 focus:ring-0 bg-slate-900 w-4 h-4 cursor-pointer"
                      />
                      <span>⚡ {language === 'KR' ? '에스컬레이터 있음' : 'Escalator'}</span>
                    </label>

                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={editIsAccessible}
                        onChange={e => setEditIsAccessible(e.target.checked)}
                        className="rounded border-slate-700 text-blue-600 focus:ring-0 bg-slate-900 w-4 h-4 cursor-pointer"
                      />
                      <span>♿ {language === 'KR' ? '유모차/휠체어 이동 가능' : 'Accessible'}</span>
                    </label>
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                  <button
                    type="button"
                    onClick={handleResetExits}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition cursor-pointer border border-slate-700"
                  >
                    ↺ {language === 'KR' ? '기본 데이터로 초기화' : 'Reset to Default'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditPanelOpen(false)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition cursor-pointer border border-slate-700"
                    >
                      {language === 'KR' ? '취소' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyCoordinatesToExit}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-black rounded-xl transition cursor-pointer shadow-md flex items-center gap-1.5"
                    >
                      💾 {selectedExitForEdit && selectedExitForEdit !== '__NEW__' 
                        ? (language === 'KR' ? `[${selectedExitForEdit}번 출구]에 이 좌표 적용 및 지도 반영` : `Apply Coordinates to Exit ${selectedExitForEdit}`) 
                        : (language === 'KR' ? '신규 출구로 마커 등록 및 지도 반영' : 'Save as New Exit Marker')}
                    </button>
                  </div>
                </div>
              </div>
            )}
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
