/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 내 여행 루트 (즐겨찾기 장소 관리 및 지도 연동 서비스)
 * 사용자가 추천 코스 및 각 카테고리에서 즐겨찾기(⭐)한 장소들을
 * localStorage에 보관하고, 대화형 전체 지도 위에 순서대로 연결하여 표시합니다.
 */

import { useState, useEffect } from 'react';
import { matchTourApiSpotId } from './tourApiCommon';
import { getKoreaTourApiPlaceDetail } from '../data/koreaTourApiPlaceDetails';

export interface MyRoutePlace {
  id: string; // 고유 키 (titleKo 기반 혹은 고유 ID)
  titleKo: string;
  titleEn: string;
  categoryKo?: string;
  categoryEn?: string;
  addressRoadKo?: string;
  addressRoadEn?: string;
  stationInfoKo?: string;
  stationInfoEn?: string;
  latitude: number;
  longitude: number;
  firstImage?: string;
  descKo?: string;
  descEn?: string;
  time?: string;
  addedAt: number;
}

const STORAGE_KEY = 'stepless_my_travel_route_v1';
const EVENT_NAME = 'stepless_my_route_changed';

// 부산 주요 명소 기본 정밀 좌표 사전 (TourAPI 미매칭 시 안정적 폴백)
export const KNOWN_COORDINATES: Record<string, { lat: number; lng: number; addressKo: string; categoryKo: string }> = {
  '부산역': { lat: 35.1154, lng: 129.0422, addressKo: '부산광역시 동구 중앙대로 206', categoryKo: '교통/명소' },
  '해운대': { lat: 35.1587, lng: 129.1604, addressKo: '부산광역시 해운대구 우동 해운대해변로 264', categoryKo: '해변/자연' },
  '해운대해수욕장': { lat: 35.1587, lng: 129.1604, addressKo: '부산광역시 해운대구 우동 해운대해변로 264', categoryKo: '해변/자연' },
  '해운대 해수욕장': { lat: 35.1587, lng: 129.1604, addressKo: '부산광역시 해운대구 우동 해운대해변로 264', categoryKo: '해변/자연' },
  '광안리': { lat: 35.1532, lng: 129.1186, addressKo: '부산광역시 수영구 광안해변로 219', categoryKo: '해변/자연' },
  '광안리해수욕장': { lat: 35.1532, lng: 129.1186, addressKo: '부산광역시 수영구 광안해변로 219', categoryKo: '해변/자연' },
  '광안리 해수욕장': { lat: 35.1532, lng: 129.1186, addressKo: '부산광역시 수영구 광안해변로 219', categoryKo: '해변/자연' },
  '자갈치시장': { lat: 35.0967, lng: 129.0306, addressKo: '부산광역시 중구 자갈치해안로 52', categoryKo: '전통시장' },
  '부평깡통시장': { lat: 35.1018, lng: 129.0264, addressKo: '부산광역시 중구 부평1길 48', categoryKo: '전통시장' },
  '국제시장': { lat: 35.1006, lng: 129.0285, addressKo: '부산광역시 중구 신창동4가', categoryKo: '전통시장' },
  '감천문화마을': { lat: 35.0975, lng: 129.0106, addressKo: '부산광역시 사하구 감내2로 203', categoryKo: '문화마을' },
  '흰여울문화마을': { lat: 35.0789, lng: 129.0452, addressKo: '부산광역시 영도구 영선동4가 1043', categoryKo: '문화마을' },
  '영도 흰여울문화마을': { lat: 35.0789, lng: 129.0452, addressKo: '부산광역시 영도구 영선동4가 1043', categoryKo: '문화마을' },
  '태종대': { lat: 35.0532, lng: 129.0825, addressKo: '부산광역시 영도구 전망로 24', categoryKo: '자연명소' },
  '용두산공원': { lat: 35.1006, lng: 129.0326, addressKo: '부산광역시 중구 용두산길 37-55', categoryKo: '공원/야경' },
  '부산타워': { lat: 35.1006, lng: 129.0326, addressKo: '부산광역시 중구 용두산길 37-55', categoryKo: '공원/야경' },
  '동백섬': { lat: 35.1528, lng: 129.1518, addressKo: '부산광역시 해운대구 우동 710-1', categoryKo: '해안산책' },
  '누리마루': { lat: 35.1528, lng: 129.1518, addressKo: '부산광역시 해운대구 동백로 116', categoryKo: '해안산책' },
  '해운대 블루라인파크': { lat: 35.1594, lng: 129.1725, addressKo: '부산광역시 해운대구 달맞이길62번길 13', categoryKo: '관광열차' },
  '청사포': { lat: 35.1611, lng: 129.1925, addressKo: '부산광역시 해운대구 중동 청사포로', categoryKo: '해안명소' },
  '해동용궁사': { lat: 35.1883, lng: 129.2234, addressKo: '부산광역시 기장군 기장읍 용궁길 86', categoryKo: '사찰/명소' },
  '송도해수욕장': { lat: 35.0784, lng: 129.0194, addressKo: '부산광역시 서구 송도해변로 100', categoryKo: '해변/자연' },
  '송정해수욕장': { lat: 35.1786, lng: 129.1994, addressKo: '부산광역시 해운대구 송정해변로 62', categoryKo: '해변/자연' },
  '다대포해수욕장': { lat: 35.0483, lng: 128.9664, addressKo: '부산광역시 사하구 다대낙동강변대로 80', categoryKo: '해변/생태' },
  '삼락생태공원': { lat: 35.1691, lng: 128.9732, addressKo: '부산광역시 사상구 삼락동 29-46', categoryKo: '생태공원' },
  '맥도생태공원': { lat: 35.1528, lng: 128.9482, addressKo: '부산광역시 강서구 대저2동 1200-33', categoryKo: '생태공원' },
  '대저생태공원': { lat: 35.2125, lng: 128.9814, addressKo: '부산광역시 강서구 대저1동 2314-11', categoryKo: '생태공원' },
  '전포카페거리': { lat: 35.1554, lng: 129.0654, addressKo: '부산광역시 부산진구 전포대로209번길 26', categoryKo: '카페거리' },
  '서면': { lat: 35.1552, lng: 129.0594, addressKo: '부산광역시 부산진구 중앙대로', categoryKo: '쇼핑/미식' },
  '벡스코': { lat: 35.1691, lng: 129.1362, addressKo: '부산광역시 해운대구 APEC로 55', categoryKo: '전시/문화' },
  '영화의전당': { lat: 35.1711, lng: 129.1278, addressKo: '부산광역시 해운대구 수영강변대로 120', categoryKo: '문화/예술' },
  '국립해양박물관': { lat: 35.0789, lng: 129.0805, addressKo: '부산광역시 영도구 해양로301번길 45', categoryKo: '박물관' },
  'F1963': { lat: 35.1764, lng: 129.1152, addressKo: '부산광역시 수영구 구락로123번길 20', categoryKo: '복합문화공간' },
  '이기대': { lat: 35.1275, lng: 129.1172, addressKo: '부산광역시 남구 이기대공원로 105-20', categoryKo: '해안산책' },
  '오시리아': { lat: 35.1952, lng: 129.2152, addressKo: '부산광역시 기장군 기장읍 동부산관광로 42', categoryKo: '관광단지' },
  '이재모피자': { lat: 35.1022, lng: 129.0305, addressKo: '부산광역시 중구 광복중앙로 31', categoryKo: '식도락/맛집' },
  '모모스커피': { lat: 35.2285, lng: 129.0875, addressKo: '부산광역시 금정구 오시게로 20', categoryKo: '식도락/카페' },
  '톤쇼우': { lat: 35.1578, lng: 129.1142, addressKo: '부산광역시 수영구 광안해변로279번길 13', categoryKo: '식도락/맛집' },
  '금수복국': { lat: 35.1618, lng: 129.1642, addressKo: '부산광역시 해운대구 중동2로10번길 23', categoryKo: '식도락/맛집' },
  '초량밀면': { lat: 35.1182, lng: 129.0415, addressKo: '부산광역시 동구 중앙대로 225', categoryKo: '식도락/맛집' },
  '본전돼지국밥': { lat: 35.1148, lng: 129.0412, addressKo: '부산광역시 동구 중앙대로214번길 3-8', categoryKo: '식도락/맛집' },
  '민락더마켓': { lat: 35.1545, lng: 129.1285, addressKo: '부산광역시 수영구 민락수변로17번길 56', categoryKo: '복합문화/마켓' },
  '밀락더마켓': { lat: 35.1545, lng: 129.1285, addressKo: '부산광역시 수영구 민락수변로17번길 56', categoryKo: '복합문화/마켓' },
  '부산영화체험박물관': { lat: 35.1017, lng: 129.0335, addressKo: '부산광역시 중구 대청로126번길 12', categoryKo: '체험/박물관' },
  '부산근현대역사관': { lat: 35.1025, lng: 129.0305, addressKo: '부산광역시 중구 대청로 104', categoryKo: '체험/박물관' },
  'BIFF광장': { lat: 35.0991, lng: 129.0289, addressKo: '부산광역시 중구 구덕로 58-1', categoryKo: '명소/거리' },
  '부전시장': { lat: 35.1630, lng: 129.0601, addressKo: '부산광역시 부산진구 중앙대로 786', categoryKo: '전통시장' },
  '구포시장': { lat: 35.2104, lng: 129.0049, addressKo: '부산광역시 북구 구포시장1길 17', categoryKo: '전통시장' },
  '온천천': { lat: 35.2078, lng: 129.0835, addressKo: '부산광역시 동래구 온천천로', categoryKo: '자연/산책' },
  '범어사': { lat: 35.2838, lng: 129.0682, addressKo: '부산광역시 금정구 범어사로 250', categoryKo: '사찰/명소' },
  '부산시립미술관': { lat: 35.1675, lng: 129.1378, addressKo: '부산광역시 해운대구 APEC로 58', categoryKo: '미술관' },
  '부산현대미술관': { lat: 35.1089, lng: 128.9419, addressKo: '부산광역시 사하구 낙동남로 1191', categoryKo: '미술관' },
  '국립부산과학관': { lat: 35.2052, lng: 129.2132, addressKo: '부산광역시 기장군 기장읍 동부산관광6로 59', categoryKo: '과학관' },
  '국립일제강제동원역사관': { lat: 35.1275, lng: 129.0898, addressKo: '부산광역시 남구 홍곡로 320-29', categoryKo: '역사관' },
  '유엔기념공원': { lat: 35.1278, lng: 129.0969, addressKo: '부산광역시 남구 유엔평화로 93', categoryKo: '역사/공원' },
  '아미산전망대': { lat: 35.0435, lng: 128.9602, addressKo: '부산광역시 사하구 다대낙동강변대로 19', categoryKo: '전망대' },
  '초량이바구길': { lat: 35.1165, lng: 129.0385, addressKo: '부산광역시 동구 초량상로', categoryKo: '문화마을' },
  '차이나타운': { lat: 35.1145, lng: 129.0395, addressKo: '부산광역시 동구 대영로243번길', categoryKo: '특화거리' },
  '임시수도기념관': { lat: 35.1052, lng: 129.0185, addressKo: '부산광역시 서구 임시수도기념로 45', categoryKo: '역사관' },
  '보수동책방골목': { lat: 35.1035, lng: 129.0255, addressKo: '부산광역시 중구 대청로 67-1', categoryKo: '문화거리' },
  '화명생태공원': { lat: 35.2285, lng: 129.0041, addressKo: '부산광역시 북구 화명동 1718-17', categoryKo: '생태공원' },
  '송도해상케이블카': { lat: 35.0760, lng: 129.0195, addressKo: '부산광역시 서구 송도해변로 171', categoryKo: '체험/관광' },
};

/**
 * 장소명으로부터 위도, 경도, 도로명주소 및 사진 정보를 자동으로 추론합니다.
 */
export function resolvePlaceLocationInfo(
  titleKo: string,
  rawAddress?: string
): { latitude: number; longitude: number; addressRoadKo: string; categoryKo?: string; firstImage?: string } {
  // 1. TourAPI 사전 매칭
  const spotId = matchTourApiSpotId(titleKo);
  if (spotId) {
    const detail = getKoreaTourApiPlaceDetail(spotId);
    if (detail && detail.latitude && detail.longitude) {
      return {
        latitude: detail.latitude,
        longitude: detail.longitude,
        addressRoadKo: detail.addressRoadKo || rawAddress || '부산광역시',
        categoryKo: detail.categoryKo,
        firstImage: detail.firstImage,
      };
    }
  }

  // 2. 알려진 부산 좌표 사전 검색
  for (const [key, val] of Object.entries(KNOWN_COORDINATES)) {
    if (titleKo.includes(key) || key.includes(titleKo)) {
      return {
        latitude: val.lat,
        longitude: val.lng,
        addressRoadKo: rawAddress || val.addressKo,
        categoryKo: val.categoryKo,
      };
    }
  }

  // 3. 부산 중심 기본 좌표
  return {
    latitude: 35.1796,
    longitude: 129.0756,
    addressRoadKo: rawAddress || '부산광역시',
  };
}

/**
 * 현재 저장된 모든 여행 루트 장소 목록 반환
 */
export function getMyRoutePlaces(): MyRoutePlace[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to load my route places from localStorage:', err);
    return [];
  }
}

function saveAndNotify(places: MyRoutePlace[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: places }));
  } catch (err) {
    console.error('Failed to save my route places:', err);
  }
}

/**
 * 장소가 즐겨찾기(내 여행 루트)에 포함되어 있는지 확인
 */
export function isPlaceInMyRoute(idOrTitle: string): boolean {
  if (!idOrTitle) return false;
  const places = getMyRoutePlaces();
  const clean = idOrTitle.trim().toLowerCase();
  return places.some(
    p => p.id.toLowerCase() === clean || p.titleKo.toLowerCase() === clean || clean.includes(p.titleKo.toLowerCase())
  );
}

/**
 * 장소를 내 여행 루트에 추가
 */
export function addPlaceToMyRoute(
  place: {
    id?: string;
    titleKo: string;
    titleEn?: string;
    categoryKo?: string;
    categoryEn?: string;
    addressRoadKo?: string;
    addressRoadEn?: string;
    stationInfoKo?: string;
    stationInfoEn?: string;
    descKo?: string;
    descEn?: string;
    firstImage?: string;
    time?: string;
    latitude?: number;
    longitude?: number;
  }
): boolean {
  const current = getMyRoutePlaces();
  const normalizedId = (place.id || place.titleKo).trim();

  if (current.some(p => p.id === normalizedId || p.titleKo === place.titleKo)) {
    return false; // Already present
  }

  const locInfo = (place.latitude && place.longitude)
    ? { latitude: place.latitude, longitude: place.longitude, addressRoadKo: place.addressRoadKo || '부산광역시', firstImage: place.firstImage }
    : resolvePlaceLocationInfo(place.titleKo, place.addressRoadKo);

  const newPlace: MyRoutePlace = {
    id: normalizedId,
    titleKo: place.titleKo,
    titleEn: place.titleEn || place.titleKo,
    categoryKo: place.categoryKo || locInfo.categoryKo || '추천명소',
    categoryEn: place.categoryEn || 'Attraction',
    addressRoadKo: place.addressRoadKo || locInfo.addressRoadKo,
    addressRoadEn: place.addressRoadEn || 'Busan, Republic of Korea',
    stationInfoKo: place.stationInfoKo,
    stationInfoEn: place.stationInfoEn,
    latitude: locInfo.latitude,
    longitude: locInfo.longitude,
    firstImage: place.firstImage || locInfo.firstImage,
    descKo: place.descKo,
    descEn: place.descEn,
    time: place.time,
    addedAt: Date.now(),
  };

  const updated = [...current, newPlace];
  saveAndNotify(updated);
  return true;
}

/**
 * 장소를 내 여행 루트에서 제거
 */
export function removePlaceFromMyRoute(idOrTitle: string): boolean {
  const current = getMyRoutePlaces();
  const clean = idOrTitle.trim().toLowerCase();
  const updated = current.filter(
    p => p.id.toLowerCase() !== clean && p.titleKo.toLowerCase() !== clean && !clean.includes(p.titleKo.toLowerCase())
  );
  if (updated.length !== current.length) {
    saveAndNotify(updated);
    return true;
  }
  return false;
}

/**
 * 토글 (추가되어 있으면 삭제, 없으면 추가)
 */
export function togglePlaceInMyRoute(
  place: {
    id?: string;
    titleKo: string;
    titleEn?: string;
    categoryKo?: string;
    categoryEn?: string;
    addressRoadKo?: string;
    addressRoadEn?: string;
    stationInfoKo?: string;
    stationInfoEn?: string;
    descKo?: string;
    descEn?: string;
    firstImage?: string;
    time?: string;
    latitude?: number;
    longitude?: number;
  }
): boolean {
  if (isPlaceInMyRoute(place.id || place.titleKo)) {
    removePlaceFromMyRoute(place.id || place.titleKo);
    return false; // Removed
  } else {
    addPlaceToMyRoute(place);
    return true; // Added
  }
}

/**
 * 순서 이동 (위로 또는 아래로)
 */
export function movePlaceOrder(index: number, direction: 'up' | 'down'): void {
  const current = getMyRoutePlaces();
  if (direction === 'up' && index > 0) {
    const updated = [...current];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    saveAndNotify(updated);
  } else if (direction === 'down' && index < current.length - 1) {
    const updated = [...current];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    saveAndNotify(updated);
  }
}

/**
 * 전체 목록 재정렬 저장
 */
export function reorderMyRoutePlaces(places: MyRoutePlace[]): void {
  saveAndNotify(places);
}

/**
 * 여행 루트 전체 비우기
 */
export function clearMyRoute(): void {
  saveAndNotify([]);
}

/**
 * React Hook: 실시간으로 내 여행 루트 상태를 구독
 */
export function useMyRoute() {
  const [places, setPlaces] = useState<MyRoutePlace[]>(() => getMyRoutePlaces());

  useEffect(() => {
    const handleUpdate = () => {
      setPlaces(getMyRoutePlaces());
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    places,
    count: places.length,
    isBookmarked: (idOrTitle: string) => isPlaceInMyRoute(idOrTitle),
    toggle: (place: any) => togglePlaceInMyRoute(place),
    remove: (idOrTitle: string) => removePlaceFromMyRoute(idOrTitle),
    add: (place: any) => addPlaceToMyRoute(place),
    move: (index: number, dir: 'up' | 'down') => movePlaceOrder(index, dir),
    clear: () => clearMyRoute(),
  };
}
