import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Compass, MapPin, RotateCcw, ExternalLink } from 'lucide-react';
import { Language } from '../i18n/dictionary';
import { ItineraryCourse } from '../data/itineraries';
import { resolvePlaceLocationInfo } from '../services/myRouteService';

interface CourseStickyMapPanelProps {
  course: ItineraryCourse;
  language: Language;
  hidePolyline?: boolean;
  customHeaderTitleKo?: string;
  customHeaderTitleEn?: string;
  stepColors?: string[];
}

type MapProvider = 'NAVER' | 'GOOGLE' | 'LEAFLET';

interface ResolvedStepStop {
  index: number;
  stepNum: number;
  dayTag: string | null;
  titleKo: string;
  titleEn: string;
  shortTitleKo: string;
  shortTitleEn: string;
  addressKo: string;
  addressEn: string;
  latitude: number;
  longitude: number;
  naverMapUrl: string;
  googleMapUrl: string;
  markerColor?: string;
}

export const CourseStickyMapPanel: React.FC<CourseStickyMapPanelProps> = ({
  course,
  language,
  hidePolyline = false,
  customHeaderTitleKo,
  customHeaderTitleEn,
  stepColors,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('ALL');
  const [selectedStopIndex, setSelectedStopIndex] = useState<number | null>(null);

  // Reset day filter & selected stop when course changes
  useEffect(() => {
    setSelectedDayFilter('ALL');
    setSelectedStopIndex(null);
  }, [course.id]);

  // Detect available Day tags (Day 1, Day 2, etc.)
  const availableDays = useMemo(() => {
    const days = new Set<string>();
    course.steps.forEach((st) => {
      const m = st.time?.match(/Day\s*(\d+)/i);
      if (m) {
        days.add(`Day ${m[1]}`);
      }
    });
    return Array.from(days);
  }, [course]);

  // Resolve coordinates for each step
  const resolvedStops: ResolvedStepStop[] = useMemo(() => {
    const filteredSteps =
      selectedDayFilter === 'ALL'
        ? course.steps
        : course.steps.filter((st) => st.time?.includes(selectedDayFilter));

    return filteredSteps.map((st, idx) => {
      const loc = resolvePlaceLocationInfo(
        st.shortTitleKo || st.titleKo,
        st.addressRoadKo || st.stationInfoKo || st.branches?.[0]?.addressKo
      );
      const dayMatch = st.time?.match(/Day\s*(\d+)/i);
      const shortKo =
        st.shortTitleKo ||
        st.titleKo.replace(/\s*\(.*?\)/g, '').split('&')[0].trim();
      const shortEn =
        st.shortTitleEn ||
        st.titleEn.replace(/\s*\(.*?\)/g, '').split('&')[0].trim();

      return {
        index: idx,
        stepNum: idx + 1,
        dayTag: dayMatch ? `Day ${dayMatch[1]}` : null,
        titleKo: st.titleKo,
        titleEn: st.titleEn || st.titleKo,
        shortTitleKo: shortKo,
        shortTitleEn: shortEn,
        addressKo: st.addressRoadKo || loc.addressRoadKo || '부산광역시',
        addressEn: st.addressRoadEn || st.stationInfoEn || loc.addressRoadKo || 'Busan',
        latitude: loc.latitude,
        longitude: loc.longitude,
        naverMapUrl:
          st.naverMapUrl ||
          `https://map.naver.com/p/search/${encodeURIComponent(shortKo + ' 부산')}`,
        googleMapUrl:
          st.googleMapUrl ||
          `https://maps.google.com/?q=${encodeURIComponent(shortKo + ' 부산')}`,
        markerColor: stepColors?.[idx],
      };
    });
  }, [course, selectedDayFilter, stepColors]);

  const [naverAuthFailed, setNaverAuthFailed] = useState<boolean>(() =>
    typeof window !== 'undefined' ? Boolean(window.NAVER_MAPS_AUTH_FAILED) : false
  );
  const [googleAuthFailed, setGoogleAuthFailed] = useState<boolean>(() =>
    typeof window !== 'undefined' ? Boolean(window.GOOGLE_MAPS_AUTH_FAILED) : false
  );

  const [provider, setProvider] = useState<MapProvider>(() => {
    if (language === 'KR') {
      return typeof window !== 'undefined' && window.NAVER_MAPS_AUTH_FAILED
        ? 'LEAFLET'
        : 'NAVER';
    }
    return typeof window !== 'undefined' && window.GOOGLE_MAPS_AUTH_FAILED
      ? 'LEAFLET'
      : 'GOOGLE';
  });

  useEffect(() => {
    if (language === 'KR') {
      setProvider(window.NAVER_MAPS_AUTH_FAILED || naverAuthFailed ? 'LEAFLET' : 'NAVER');
    } else {
      setProvider(window.GOOGLE_MAPS_AUTH_FAILED || googleAuthFailed ? 'LEAFLET' : 'GOOGLE');
    }
  }, [language, naverAuthFailed, googleAuthFailed]);

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

  const cleanupAllMaps = () => {
    if (naverInfoWindowRef.current) {
      try { naverInfoWindowRef.current.close(); } catch {}
      naverInfoWindowRef.current = null;
    }
    naverMarkersRef.current.forEach((m) => {
      try { m.setMap(null); } catch {}
    });
    naverMarkersRef.current = [];
    if (naverPolylineRef.current) {
      try { naverPolylineRef.current.setMap(null); } catch {}
      naverPolylineRef.current = null;
    }
    if (naverMapRef.current) {
      try { naverMapRef.current.destroy?.(); } catch {}
      naverMapRef.current = null;
    }

    if (googleInfoWindowRef.current) {
      try { googleInfoWindowRef.current.close(); } catch {}
      googleInfoWindowRef.current = null;
    }
    googleMarkersRef.current.forEach((m) => {
      try { m.setMap(null); } catch {}
    });
    googleMarkersRef.current = [];
    if (googlePolylineRef.current) {
      try { googlePolylineRef.current.setMap(null); } catch {}
      googlePolylineRef.current = null;
    }
    googleMapRef.current = null;

    if (leafletMapRef.current) {
      try { leafletMapRef.current.remove(); } catch {}
      leafletMapRef.current = null;
    }
    leafletMarkersRef.current = [];
    leafletPolylineRef.current = null;

    if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = '';
    }
  };

  const handleFitAllStops = () => {
    if (resolvedStops.length === 0) return;

    if (provider === 'NAVER' && naverMapRef.current && window.naver?.maps) {
      if (resolvedStops.length === 1) {
        naverMapRef.current.setCenter(
          new window.naver.maps.LatLng(resolvedStops[0].latitude, resolvedStops[0].longitude)
        );
        naverMapRef.current.setZoom(15);
      } else {
        const bounds = new window.naver.maps.LatLngBounds();
        resolvedStops.forEach((s) =>
          bounds.extend(new window.naver.maps.LatLng(s.latitude, s.longitude))
        );
        naverMapRef.current.fitBounds(bounds, { top: 45, right: 35, bottom: 45, left: 35 });
      }
    } else if (provider === 'GOOGLE' && googleMapRef.current && window.google?.maps) {
      if (resolvedStops.length === 1) {
        googleMapRef.current.setCenter({
          lat: resolvedStops[0].latitude,
          lng: resolvedStops[0].longitude,
        });
        googleMapRef.current.setZoom(15);
      } else {
        const bounds = new window.google.maps.LatLngBounds();
        resolvedStops.forEach((s) => bounds.extend({ lat: s.latitude, lng: s.longitude }));
        googleMapRef.current.fitBounds(bounds, 40);
      }
    } else if (provider === 'LEAFLET' && leafletMapRef.current && window.L) {
      if (resolvedStops.length === 1) {
        leafletMapRef.current.setView(
          [resolvedStops[0].latitude, resolvedStops[0].longitude],
          15
        );
      } else {
        const latLngs = resolvedStops.map((s) => [s.latitude, s.longitude] as [number, number]);
        const bounds = window.L.latLngBounds(latLngs);
        leafletMapRef.current.fitBounds(bounds, { padding: [38, 38], maxZoom: 15 });
      }
    }
    setSelectedStopIndex(null);
  };

  const handleFocusStop = (idx: number) => {
    const stop = resolvedStops[idx];
    if (!stop) return;
    setSelectedStopIndex(idx);

    if (provider === 'NAVER' && naverMapRef.current && window.naver?.maps) {
      const pos = new window.naver.maps.LatLng(stop.latitude, stop.longitude);
      naverMapRef.current.setCenter(pos);
      naverMapRef.current.setZoom(15);
    } else if (provider === 'GOOGLE' && googleMapRef.current && window.google?.maps) {
      googleMapRef.current.panTo({ lat: stop.latitude, lng: stop.longitude });
      googleMapRef.current.setZoom(15);
    } else if (provider === 'LEAFLET' && leafletMapRef.current) {
      leafletMapRef.current.setView([stop.latitude, stop.longitude], 15, { animate: true });
      const marker = leafletMarkersRef.current[idx];
      if (marker) {
        try { marker.openPopup(); } catch {}
      }
    }
  };

  // Render Naver Map
  const renderNaverMap = () => {
    if (!mapContainerRef.current || !window.naver?.maps) return;
    cleanupAllMaps();

    try {
      const centerLat = resolvedStops[0]?.latitude || 35.1587;
      const centerLng = resolvedStops[0]?.longitude || 129.1186;

      const map = new window.naver.maps.Map(mapContainerRef.current, {
        center: new window.naver.maps.LatLng(centerLat, centerLng),
        zoom: 12,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
        mapDataControl: false,
        scaleControl: false,
      });
      naverMapRef.current = map;

      const naverLatLngs: any[] = [];
      const bounds = new window.naver.maps.LatLngBounds();

      resolvedStops.forEach((stop, idx) => {
        const latLng = new window.naver.maps.LatLng(stop.latitude, stop.longitude);
        naverLatLngs.push(latLng);
        bounds.extend(latLng);

        const isSelected = selectedStopIndex === idx;
        const bgColor = isSelected ? 'rgba(24, 24, 27, 0.92)' : (stop.markerColor || 'rgba(142, 168, 94, 0.86)');
        const sizePx = isSelected ? 28 : 24;
        const labelText = language === 'KR' ? stop.shortTitleKo : stop.shortTitleEn;

        const markerContent = `
          <div title="${labelText}" style="display:flex; align-items:center; justify-content:center; width:${sizePx}px; height:${sizePx}px; border-radius:50%; background:${bgColor}; backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); color:#ffffff; font-size:11px; font-weight:800; box-shadow:0 2px 6px rgba(0,0,0,0.18); border:2px solid rgba(255,255,255,0.92); transform:translate(-50%, -50%); cursor:pointer; transition:all 0.15s ease;">
            ${stop.stepNum}
          </div>
        `;

        const marker = new window.naver.maps.Marker({
          position: latLng,
          map,
          icon: {
            content: markerContent,
            anchor: new window.naver.maps.Point(0, 0),
          },
          zIndex: isSelected ? 200 : 100 - idx,
        });

        window.naver.maps.Event.addListener(marker, 'click', () => {
          setSelectedStopIndex(idx);
          map.panTo(latLng);
        });

        naverMarkersRef.current.push(marker);
      });

      if (!hidePolyline && naverLatLngs.length > 1) {
        naverPolylineRef.current = new window.naver.maps.Polyline({
          map,
          path: naverLatLngs,
          strokeColor: '#8EA85E',
          strokeWeight: 2,
          strokeOpacity: 0.78,
          strokeStyle: 'solid',
        });
      }

      if (naverLatLngs.length === 1) {
        map.setCenter(naverLatLngs[0]);
        map.setZoom(15);
      } else if (naverLatLngs.length > 1) {
        map.fitBounds(bounds, { top: 45, right: 35, bottom: 45, left: 35 });
      }
    } catch (err) {
      console.warn('Naver map error in CourseStickyMapPanel, falling back to Leaflet:', err);
      setNaverAuthFailed(true);
      setProvider('LEAFLET');
    }
  };

  // Render Google Map
  const renderGoogleMap = () => {
    if (!mapContainerRef.current || !window.google?.maps) return;
    cleanupAllMaps();

    try {
      const centerLat = resolvedStops[0]?.latitude || 35.1587;
      const centerLng = resolvedStops[0]?.longitude || 129.1186;

      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        gestureHandling: 'greedy',
      });
      googleMapRef.current = map;

      const googleCoords: any[] = [];
      const bounds = new window.google.maps.LatLngBounds();

      resolvedStops.forEach((stop, idx) => {
        const coord = { lat: stop.latitude, lng: stop.longitude };
        googleCoords.push(coord);
        bounds.extend(coord);

        const isSelected = selectedStopIndex === idx;
        const marker = new window.google.maps.Marker({
          position: coord,
          map,
          title: stop.titleEn,
          label: {
            text: `${stop.stepNum}`,
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '11px',
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: isSelected ? '#18181B' : (stop.markerColor || '#3F4E26'),
            fillOpacity: 0.78,
            strokeColor: '#FFFFFF',
            strokeWeight: 1.5,
          },
        });

        marker.addListener('click', () => {
          setSelectedStopIndex(idx);
          map.panTo(coord);
        });

        googleMarkersRef.current.push(marker);
      });

      if (!hidePolyline && googleCoords.length > 1) {
        googlePolylineRef.current = new window.google.maps.Polyline({
          map,
          path: googleCoords,
          strokeColor: '#8EA85E',
          strokeOpacity: 0.78,
          strokeWeight: 2,
        });
      }

      if (googleCoords.length === 1) {
        map.setCenter(googleCoords[0]);
        map.setZoom(15);
      } else if (googleCoords.length > 1) {
        map.fitBounds(bounds, 40);
      }
    } catch (err) {
      console.warn('Google map error in CourseStickyMapPanel, falling back to Leaflet:', err);
      setGoogleAuthFailed(true);
      setProvider('LEAFLET');
    }
  };

  // Render Leaflet Map
  const renderLeafletMap = () => {
    if (!mapContainerRef.current || !window.L) return;
    cleanupAllMaps();
    const L = window.L;

    try {
      const centerLat = resolvedStops[0]?.latitude || 35.1587;
      const centerLng = resolvedStops[0]?.longitude || 129.1186;

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([centerLat, centerLng], 12);
      leafletMapRef.current = map;

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      const latLngs: [number, number][] = [];

      resolvedStops.forEach((stop, idx) => {
        const latLng: [number, number] = [stop.latitude, stop.longitude];
        latLngs.push(latLng);

        const isSelected = selectedStopIndex === idx;
        const bgColor = isSelected ? 'rgba(24, 24, 27, 0.92)' : (stop.markerColor || 'rgba(142, 168, 94, 0.86)');
        const sizePx = isSelected ? 28 : 24;
        const labelText = language === 'KR' ? stop.shortTitleKo : stop.shortTitleEn;

        const markerHtml = `
          <div title="${labelText}" style="display:flex; align-items:center; justify-content:center; width:${sizePx}px; height:${sizePx}px; border-radius:50%; background:${bgColor}; backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); color:#ffffff; font-size:11px; font-weight:800; box-shadow:0 2px 6px rgba(0,0,0,0.18); border:2px solid rgba(255,255,255,0.92); transform:translate(-50%, -50%); cursor:pointer; transition:all 0.15s ease;">
            ${stop.stepNum}
          </div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: 'custom-my-route-marker',
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker(latLng, { icon }).addTo(map);
        marker.on('click', () => {
          setSelectedStopIndex(idx);
        });
        leafletMarkersRef.current.push(marker);
      });

      if (!hidePolyline && latLngs.length > 1) {
        leafletPolylineRef.current = L.polyline(latLngs, {
          color: '#8EA85E',
          weight: 2,
          opacity: 0.78,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);
      }

      if (latLngs.length === 1) {
        map.setView(latLngs[0], 15);
      } else if (latLngs.length > 1) {
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, { padding: [38, 38], maxZoom: 15 });
      }

      setTimeout(() => {
        if (leafletMapRef.current) {
          leafletMapRef.current.invalidateSize();
          if (latLngs.length > 1) {
            leafletMapRef.current.fitBounds(L.latLngBounds(latLngs), {
              padding: [38, 38],
              maxZoom: 15,
            });
          }
        }
      }, 200);
    } catch (err) {
      console.error('Leaflet map error in CourseStickyMapPanel:', err);
    }
  };

  // Load map scripts and render
  useEffect(() => {
    let isMounted = true;

    if (provider === 'NAVER') {
      const activeClientId = (
        localStorage.getItem('custom_naver_client_id') ||
        import.meta.env.VITE_NAVER_CLIENT_ID ||
        'jig5o1hthp'
      ).trim();

      if (window.naver?.maps) {
        renderNaverMap();
      } else {
        const scriptId = 'naver-maps-script';
        let script = document.getElementById(scriptId) as HTMLScriptElement | null;
        if (!script) {
          script = document.createElement('script');
          script.id = scriptId;
          script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${activeClientId}`;
          script.async = true;
          document.head.appendChild(script);
        }
        const onLoad = () => {
          if (!isMounted) return;
          if (window.NAVER_MAPS_AUTH_FAILED || !window.naver?.maps) {
            setNaverAuthFailed(true);
            setProvider('LEAFLET');
          } else {
            renderNaverMap();
          }
        };
        const onError = () => {
          if (!isMounted) return;
          setNaverAuthFailed(true);
          setProvider('LEAFLET');
        };
        script.addEventListener('load', onLoad);
        script.addEventListener('error', onError);
        return () => {
          isMounted = false;
          script?.removeEventListener('load', onLoad);
          script?.removeEventListener('error', onError);
        };
      }
    } else if (provider === 'GOOGLE') {
      if (window.google?.maps) {
        renderGoogleMap();
      } else {
        setGoogleAuthFailed(true);
        setProvider('LEAFLET');
      }
    } else {
      // LEAFLET
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
        const scriptId = 'leaflet-js';
        let script = document.getElementById(scriptId) as HTMLScriptElement | null;
        if (!script) {
          script = document.createElement('script');
          script.id = scriptId;
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.async = true;
          document.head.appendChild(script);
        }
        const onLoad = () => {
          if (isMounted && window.L) renderLeafletMap();
        };
        script.addEventListener('load', onLoad);
        return () => {
          isMounted = false;
          script?.removeEventListener('load', onLoad);
        };
      }
    }

    return () => {
      isMounted = false;
    };
  }, [provider, resolvedStops, language, hidePolyline]);

  const activeStop =
    selectedStopIndex !== null && resolvedStops[selectedStopIndex]
      ? resolvedStops[selectedStopIndex]
      : null;

  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] overflow-hidden space-y-3 p-3.5 sm:p-4 text-left">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="p-1.5 rounded-lg bg-[#F3F7EC] text-[#5B7332] shrink-0">
            <Compass className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-[#18181B] truncate">
              {language === 'KR' ? (customHeaderTitleKo || '코스 전체 동선 지도') : (customHeaderTitleEn || 'Course Route Map')}
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFitAllStops}
          className="px-2.5 py-1.5 rounded-lg bg-[#FAF9F6] hover:bg-[#F3F7EC] border border-black/[0.06] text-[11px] font-bold text-slate-700 hover:text-[#5B7332] flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
          title={language === 'KR' ? '전체 경로 한눈에 보기' : 'Fit all stops'}
        >
          <RotateCcw className="w-3 h-3" />
          <span>{language === 'KR' ? '전체 보기' : 'Reset'}</span>
        </button>
      </div>

      {/* Multi-day filter pills (for 1N2D, 2N3D, 3N4D, 4N5D) */}
      {availableDays.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <button
            type="button"
            onClick={() => {
              setSelectedDayFilter('ALL');
              setSelectedStopIndex(null);
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 cursor-pointer transition-all ${
              selectedDayFilter === 'ALL'
                ? 'bg-[#18181B] text-white'
                : 'bg-[#FAF9F6] hover:bg-slate-100 text-slate-600 border border-black/[0.06]'
            }`}
          >
            {language === 'KR' ? '전체 일정' : 'All Days'}
          </button>
          {availableDays.map((dayStr) => {
            const isActive = selectedDayFilter === dayStr;
            return (
              <button
                key={dayStr}
                type="button"
                onClick={() => {
                  setSelectedDayFilter(dayStr);
                  setSelectedStopIndex(null);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#8EA85E] text-white'
                    : 'bg-[#FAF9F6] hover:bg-slate-100 text-slate-600 border border-black/[0.06]'
                }`}
              >
                {dayStr}
              </button>
            );
          })}
        </div>
      )}

      {/* Interactive Map Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-black/[0.06] bg-slate-100">
        <div
          ref={mapContainerRef}
          className="w-full h-[280px] sm:h-[340px] lg:h-[400px] route-map-canvas"
        />
      </div>

      {/* Selected Stop Detail Bar (when a stop is clicked) */}
      {activeStop && (
        <div className="p-2.5 rounded-xl bg-[#F3F7EC]/70 border border-[#8EA85E]/30 flex items-center justify-between gap-2 text-xs animate-fade-in">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#8EA85E] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                {activeStop.stepNum}
              </span>
              <span className="font-bold text-[#18181B] truncate">
                {language === 'KR' ? activeStop.titleKo : activeStop.titleEn}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 truncate mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#8EA85E] shrink-0" />
              <span className="truncate">
                {language === 'KR' ? activeStop.addressKo : activeStop.addressEn}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <a
              href={activeStop.naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded-md bg-[#03C75A] hover:bg-[#02b350] flex items-center justify-center text-white font-black text-[10px] shadow-2xs"
              title={language === 'KR' ? '네이버지도 열기' : 'Open Naver Map'}
            >
              N
            </a>
            <a
              href={activeStop.googleMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded-md bg-white border border-slate-200 hover:border-blue-400 flex items-center justify-center text-blue-600 font-black text-[10px] shadow-2xs"
              title={language === 'KR' ? '구글맵 열기' : 'Open Google Maps'}
            >
              G
            </a>
          </div>
        </div>
      )}

      {/* Quick Numbered Stop Selector Chips */}
      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
        {resolvedStops.map((stop, idx) => {
          const isSelected = selectedStopIndex === idx;
          return (
            <button
              key={`${stop.titleKo}-${idx}`}
              type="button"
              onClick={() => handleFocusStop(idx)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs'
                  : 'bg-[#FAF9F6] hover:bg-slate-100 text-slate-700 border-black/[0.06]'
              }`}
            >
              <span
                style={!isSelected && stop.markerColor ? { backgroundColor: stop.markerColor } : undefined}
                className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-white text-[#5B7332]' : 'bg-[#18181B] text-white'
                }`}
              >
                {stop.stepNum}
              </span>
              <span className="truncate max-w-[130px]">
                {language === 'KR' ? stop.shortTitleKo : stop.shortTitleEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
