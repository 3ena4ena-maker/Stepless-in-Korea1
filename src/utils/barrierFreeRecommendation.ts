/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 배리어프리 추천 알고리즘 및 경로 연산 유틸리티
 * 한국관광공사 무장애 관광 OpenAPI (KorWithAPI) 응답 객체와의 매핑 및 확장이 가능하도록 설계
 */

import { getKoreaTourApiPlaceDetail } from '../data/koreaTourApiPlaceDetails';
import {
  UserType,
  TouristPlace,
  TravelCourse,
  TransitStep,
  BARRIER_FREE_PLACES,
  BARRIER_FREE_COURSES,
  BusanExperienceType,
  TravelCompanionType,
} from '../data/barrierFreeData';

export interface PlaceRecommendationResult {
  place: TouristPlace;
  score: number;
  highlightKo: string;
  highlightEn: string;
}

export interface RouteRecommendationResult {
  transitType: 'subway' | 'bus';
  primaryTitle: string;
  subTitle: string;
  totalTimeMinutes: number;
  totalDistanceMeters: number;
  hasElevator: boolean;
  hasStairs: boolean;
  steps: TransitStep[];
  priorityTip: string;
}

/**
 * 1. 관광지의 접근성 점수를 여행자 유형별 가중치를 적용하여 계산
 * @param place 관광지 정보
 * @param userType 여행자 유형 ('wheelchair' | 'stroller' | 'luggage' | 'senior')
 * @returns 0 ~ 100 사이의 접근성 적합도 점수
 */
export function calculateAccessibilityScore(
  place: TouristPlace,
  userType: UserType
): number {
  const acc = place.accessibility;
  const transit = place.transit.subway;
  const dist = transit.walkingDistanceMeters;
  let score = 55;

  switch (userType) {
    case 'wheelchair': {
      // 휠체어: 계단 및 급경사 회피, 엘리베이터, 장애인화장실, 이동 거리
      if (acc.stairs) score -= 40;
      if (acc.steepSlope) score -= 25;
      if (acc.wheelchair) score += 15; else score -= 25;
      if (acc.elevator) score += 10; else score -= 15;
      if (acc.accessibleRestroom) score += 8;
      if (transit.hasElevator) score += 10; else score -= 20;
      if (transit.hasStairs) score -= 30;

      // 지하철역 출구 연계 이동 거리별 차등 점수
      if (dist <= 100) score += 12;
      else if (dist <= 300) score += 8;
      else if (dist <= 500) score += 2;
      else if (dist <= 650) score -= 6;
      else score -= 18;

      // 휠체어 리프트/저상 버스 및 실내 전용 슬로프 우수 시설
      if (place.id === 'spot-city-tour-bus') score += 5;
      if (place.id === 'spot-aquarium') score += 4;
      if (place.id === 'spot-108') score += 10; // 무단차 해안 목재 데크 및 누리마루 승강기 우수
      if (place.id === 'spot-104') score += 8;  // 실내 전 층 완만 슬로프 및 대형 승강기
      if (place.id === 'spot-112') score += 6;  // 영화의전당 빅루프 광장 무단차 데크 및 휠체어 전용석
      if (place.id === 'spot-f1963') score += 6; // 전 구역 단차 0cm 평면 및 중정 승강기
      break;
    }

    case 'stroller': {
      // 유아차: 엘리베이터, 무단차, 화장실/수유실, 쉼터, 혼잡도
      if (acc.stairs) score -= 35;
      if (acc.steepSlope) score -= 25;
      if (acc.stroller) score += 15; else score -= 20;
      if (acc.elevator) score += 10; else score -= 15;
      if (acc.accessibleRestroom) score += 8;
      if (transit.hasElevator) score += 10; else score -= 15;
      if (transit.hasStairs) score -= 20;
      if (acc.restAreas) score += 6;

      if (dist <= 100) score += 12;
      else if (dist <= 300) score += 7;
      else if (dist <= 500) score += 2;
      else if (dist <= 650) score -= 6;
      else score -= 16;

      // 유아차 및 아동 가족 친화 공간 (아쿠아리움 실내 관람 및 수유실)
      if (place.id === 'spot-aquarium') score += 7;
      if (place.id === 'spot-104') score += 9; // 어린이박물관, 수유실 및 완만 나선형 경사로
      if (place.id === 'spot-108') score += 6; // 솔숲 목재 데크로드
      if (place.id === 'spot-f1963') score += 5; // 소리길 대나무 숲 데크 및 넓은 서점
      if (place.id === 'spot-106') score += 4;
      // 좁은 골목과 인파로 유아차 통행이 불편한 전통시장
      if (place.id === 'spot-bupyeong-market') score -= 16;
      break;
    }

    case 'luggage': {
      // 캐리어: 계단 회피, 엘리베이터 필수, 이동 거리 최소화, 보행로 평탄성
      score = 50;
      if (acc.stairs) score -= 45;
      if (acc.steepSlope) score -= 25;
      if (acc.elevator) score += 10;
      if (transit.hasElevator) score += 15; else score -= 25;
      if (transit.hasStairs) score -= 30;

      // 캐리어 이동 시 도보 거리가 가장 치명적인 불편 요소
      if (dist <= 100) score += 22;
      else if (dist <= 300) score += 14;
      else if (dist <= 500) score -= 2;
      else if (dist <= 650) score -= 16;
      else score -= 28;

      // 부산역 KTX 직결 투어버스 (보관함 및 환승)
      if (place.id === 'spot-city-tour-bus') score += 12;
      // 신관 건물 내 물품보관함
      if (place.id === 'spot-jagalchi-rooftop') score += 5;
      if (place.id === 'spot-104') score += 6; // 입구 안내데스크 무료 대형 물품보관함
      if (place.id === 'spot-heosimcheong') score += 6; // 호텔 컨시어지 짐보관
      // 해변 모래사장은 캐리어 이동이 극히 불리함
      if (place.categoryKo.includes('해변')) score -= 12;
      break;
    }

    case 'senior': {
      // 천천히 여행하기: 쉼터/벤치 필수, 보행 거리 최소화, 계단/급경사 배제
      score = 50;
      if (acc.restAreas) score += 16; else score -= 25;
      if (acc.stairs) score -= 40;
      if (acc.steepSlope) score -= 30;
      if (acc.elevator) score += 10;
      if (transit.hasElevator) score += 10; else score -= 20;
      if (transit.hasStairs) score -= 25;

      // 도보 거리 및 보행 피로도
      if (dist <= 100) score += 20;
      else if (dist <= 300) score += 12;
      else if (dist <= 500) score -= 2;
      else if (dist <= 650) score -= 16;
      else score -= 28;

      // 시티투어버스는 착석형 관광으로 도보 피로 최소화
      if (place.id === 'spot-city-tour-bus') score += 12;
      if (place.id === 'spot-heosimcheong') score += 12; // 동양 최대 천연 온천 및 힐링 찜질시설
      if (place.id === 'spot-108') score += 8; // 솔숲 피톤치드와 바다 파도 소리 여유로운 산책로
      if (place.id === 'spot-104') score += 6; // 실내 바다 전망 휴게 라운지
      if (place.id === 'spot-106') score += 4;
      break;
    }
  }

  // 상한 100, 하한 30으로 정규화
  return Math.max(30, Math.min(100, score));
}

/**
 * 2. 여행자 유형별 최적 무장애 이동 경로 계산 (세로형 STEP UI 생성)
 * 향후 카카오/네이버/SKT 대중교통 길찾기 API 연계 시 대체 가능
 */
export function calculateAccessibleRoute(
  place: TouristPlace,
  userType: UserType,
  transitType: 'subway' | 'bus' = 'subway'
): RouteRecommendationResult {
  if (transitType === 'bus') {
    const bus = place.transit.bus;
    const defaultSteps: TransitStep[] = bus.steps || [
      {
        stepNumber: 1,
        title: `${bus.stopNameKo} 하차`,
        desc: `${bus.busNumbers.join(', ')} 저상버스 하차 (휠체어 리프트 가동)`,
        icon: '🚌',
      },
      {
        stepNumber: 2,
        title: '정류장 연계 평탄로 보행',
        desc: bus.routeGuideKo,
        icon: '🚶',
      },
      {
        stepNumber: 3,
        title: `${place.nameKo} 도착`,
        desc: '단차 없는 출입구 또는 완만 경사로로 진입합니다.',
        icon: '📍',
      },
    ];

    let priorityTip = '정류장에서 목적지까지 횡단보도 턱 낮춤 구간을 이용하세요.';
    if (userType === 'wheelchair') {
      priorityTip = '휠체어 슬로프가 구비된 저상버스 승하차 시 운전기사에게 탑승 의사를 표시하세요.';
    } else if (userType === 'stroller') {
      priorityTip = '저상버스 중앙 휠체어/유아차 전용 공간을 활용하시면 더욱 안전합니다.';
    } else if (userType === 'senior') {
      priorityTip = '도보 시간이 짧아 체력 소모를 최소화할 수 있는 추천 경로입니다.';
    }

    return {
      transitType: 'bus',
      primaryTitle: bus.stopNameKo,
      subTitle: `${bus.busNumbers.join(', ')} · 도보 약 ${bus.walkingTimeMinutes}분`,
      totalTimeMinutes: bus.walkingTimeMinutes,
      totalDistanceMeters: bus.walkingTimeMinutes * 60,
      hasElevator: true,
      hasStairs: false,
      steps: defaultSteps,
      priorityTip,
    };
  }

  // Subway
  const sub = place.transit.subway;
  const defaultSteps: TransitStep[] = sub.steps || [
    {
      stepNumber: 1,
      title: `${sub.stationNameKo} 도착`,
      desc: '승강장 중앙 엘리베이터를 이용해 대합실 개찰구로 이동합니다.',
      icon: '🚇',
    },
    {
      stepNumber: 2,
      title: `${sub.exit} 이용`,
      desc: '지상 연결 엘리베이터를 탑승하여 도로변 인도로 진입합니다.',
      icon: '🛗',
    },
    {
      stepNumber: 3,
      title: '무단차 보행 이동',
      desc: `약 ${sub.walkingDistanceMeters}m · 도보 약 ${sub.walkingTimeMinutes}분 (${sub.routeGuideKo})`,
      icon: '🚶',
    },
    {
      stepNumber: 4,
      title: `${place.nameKo} 도착`,
      desc: '계단 없는 수평 진입로로 안전하게 도착합니다.',
      icon: '📍',
    },
  ];

  let priorityTip = '출구 전용 승강기를 탑승하면 계단 없이 지상으로 올라갈 수 있습니다.';
  if (userType === 'wheelchair') {
    priorityTip = '계단을 100% 회피하는 엘리베이터 전용 동선으로, 전 구간 무단차 보행로를 안내합니다.';
  } else if (userType === 'stroller') {
    priorityTip = '넓은 엘리베이터와 턱 없는 보행로를 우선하여 유아차 주행이 매우 안정적입니다.';
  } else if (userType === 'luggage') {
    priorityTip = '울퉁불퉁한 요철 구간을 피하고 평탄 포장 보행로로 이동하여 캐리어를 끌기 수월합니다.';
  } else if (userType === 'senior') {
    priorityTip = '경사도가 완만하고 중간 횡단보도가 적어 여유롭게 걷기 좋은 경로입니다.';
  }

  return {
    transitType: 'subway',
    primaryTitle: `${sub.stationNameKo} ${sub.exit}`,
    subTitle: `약 ${sub.walkingDistanceMeters}m · 도보 약 ${sub.walkingTimeMinutes}분`,
    totalTimeMinutes: sub.walkingTimeMinutes,
    totalDistanceMeters: sub.walkingDistanceMeters,
    hasElevator: sub.hasElevator,
    hasStairs: sub.hasStairs,
    steps: defaultSteps,
    priorityTip,
  };
}

/**
 * 3. 여행자 유형에 맞는 추천 여행 코스 목록 (복수 유형 지원)
 */
export function getRecommendedCourses(userTypes: UserType | UserType[]): TravelCourse[] {
  const types: UserType[] = Array.isArray(userTypes) ? userTypes : [userTypes];
  return [...BARRIER_FREE_COURSES].sort((a, b) => {
    if (types.length === 0) return 0;
    const weightA = types.reduce((sum, t) => sum + (a.baseScoreWeights[t] || 80), 0) / types.length;
    const weightB = types.reduce((sum, t) => sum + (b.baseScoreWeights[t] || 80), 0) / types.length;
    return weightB - weightA;
  });
}

/**
 * 4. 여행자 유형(단일 또는 복수) 및 선택된 여행 성향에 맞게 정렬 및 필터링된 개별 추천 관광지 목록
 * - 실제 accessibility 데이터(wheelchair, stroller, elevator, accessibleRestroom, stairs, steepSlope, restAreas)와
 *   실제 환승 데이터(hasElevator, hasStairs, walkingDistanceMeters)를 정밀하게 반영
 * - 복수 유형 선택 시 모든 유형의 접근성 조건을 종합적으로 고려
 * - 실제 접근성이 현저히 낮은 장소는 추천 대상에서 자연스럽게 제외
 */
export function getRecommendedPlaces(
  userTypes: UserType | UserType[],
  selectedExperiences: BusanExperienceType[] = [],
  selectedCompanions: TravelCompanionType[] = [],
  candidateIds?: string[]
): PlaceRecommendationResult[] {
  const types: UserType[] = Array.isArray(userTypes) ? userTypes : [userTypes];
  const primaryType: UserType = types.length > 0 ? types[0] : 'wheelchair';

  const sourcePlaces = candidateIds && candidateIds.length > 0
    ? BARRIER_FREE_PLACES.filter((p) => candidateIds.includes(p.id))
    : BARRIER_FREE_PLACES;

  const results: PlaceRecommendationResult[] = [];

  for (const place of sourcePlaces) {
    // 1. 기본 물리적 접근성 점수 계산 (30 ~ 100점 범위)
    let physicalScore = 55;
    if (types.length === 0) {
      if (place.accessibility.elevator) physicalScore += 8;
      if (place.accessibility.accessibleRestroom) physicalScore += 8;
      if (place.accessibility.restAreas) physicalScore += 8;
      if (place.transit.subway.hasElevator) physicalScore += 8;
      if (place.transit.subway.walkingDistanceMeters <= 300) physicalScore += 8;
    } else {
      const typeScores = types.map((t) => calculateAccessibilityScore(place, t));
      const avgScore = typeScores.reduce((sum, s) => sum + s, 0) / typeScores.length;
      const minScore = Math.min(...typeScores);
      physicalScore = Math.round(0.6 * avgScore + 0.4 * minScore);

      if (!candidateIds && physicalScore < 68) {
        continue;
      }
    }

    // 물리적 접근성 점수를 가중치(40%)로 환산: 약 20 ~ 40점 기여
    let finalScore = Math.round(physicalScore * 0.4) + 15;

    // 2. 여행자 유형 적합도 (최대 18점)
    if (types.length > 0) {
      const isPrimaryType = types.some((t) => place.bestFor?.includes(t));
      if (isPrimaryType) {
        finalScore += 18;
      } else {
        finalScore += 8;
      }
    }

    // 3. 부산 여행 경험 매칭 (최대 16점)
    if (selectedExperiences.length > 0 && place.experienceTraits) {
      const isExpMatch = selectedExperiences.some((exp) => place.experienceTraits?.includes(exp));
      if (isExpMatch) {
        finalScore += 16;
      } else {
        finalScore -= 4;
      }
    }

    // 4. 함께하는 여행 동행인 매칭 (최대 18점)
    if (selectedCompanions.length > 0 && place.companionTraits) {
      const isTopTrait = place.companionTraits[0] && selectedCompanions.includes(place.companionTraits[0]);
      const isAnyTrait = selectedCompanions.some((comp) => place.companionTraits?.includes(comp));
      if (isTopTrait) {
        finalScore += 18;
      } else if (isAnyTrait) {
        finalScore += 11;
      } else {
        finalScore -= 6;
      }
    }

    // 5. 직관적이고 정확한 맞춤 시너지 보너스
    // 유아차 + 가족 동반 -> SEA LIFE 부산아쿠아리움 (수유실, 완만한 램프, 키즈 친화)
    if (types.includes('stroller') && selectedCompanions.includes('family') && place.id === 'spot-aquarium') {
      finalScore += 7;
    }
    // 유아차/가족 동반 -> 국립해양박물관 (어린이박물관, 실내 대형 수족관, 전 층 나선형 완만 슬로프)
    if (selectedCompanions.includes('family') && place.id === 'spot-104') {
      finalScore += (types.includes('stroller') ? 8 : 6);
    }
    // 연인 동반 -> 부산 엑스더스카이 전망대 (초고층 파노라마 오션뷰 야경)
    if (selectedCompanions.includes('couple') && place.id === 'spot-xthesky') {
      finalScore += 6;
    }
    // 휠체어 + 첫 부산 방문 -> 해운대 해수욕장 (무단차 백사장 매트 및 해안 데크)
    if (types.includes('wheelchair') && selectedExperiences.includes('first') && place.id === 'spot-101') {
      finalScore += 5;
    }
    // 연인/사색 산책 -> 동백섬 해안산책로 & 누리마루 APEC하우스 (솔숲 동백꽃, 광안대교 조망, 무단차 목재 데크)
    if ((selectedCompanions.includes('couple') || selectedCompanions.includes('solo')) && place.id === 'spot-108') {
      finalScore += 7;
    }
    if (types.includes('wheelchair') && place.id === 'spot-108') {
      finalScore += 5;
    }
    // 재방문 + 트렌디 문화/카페 -> F1963 복합문화공간 (테라로사 카페, 예술서점, 소리길 대나무숲)
    if (selectedExperiences.includes('revisit') && place.id === 'spot-f1963') {
      finalScore += 7;
    }
    if ((selectedCompanions.includes('couple') || selectedCompanions.includes('friends')) && place.id === 'spot-f1963') {
      finalScore += 5;
    }
    // 재방문 or 친구 동반 -> 부산 영화의전당 (센텀 핫플, BIFF 영상문화, 빅루프 야경)
    if ((selectedExperiences.includes('revisit') || selectedCompanions.includes('friends')) && place.id === 'spot-112') {
      finalScore += 7;
    }
    // 어르신 or 가족 동반 온천 힐링 -> 동래 온천 허심청 (호텔농심) (동양 최대 천연 온천, 피로 회복, 엘리베이터 완비)
    if (types.includes('senior') && place.id === 'spot-heosimcheong') {
      finalScore += 8;
    }
    if (selectedCompanions.includes('family') && place.id === 'spot-heosimcheong') {
      finalScore += 6;
    }
    // 어르신 or 무거운 짐 -> 부산 시티투어버스 (도보 피로 제로, 부산역 직결)
    if ((types.includes('senior') || types.includes('luggage')) && place.id === 'spot-city-tour-bus') {
      finalScore += 6;
    }
    // 어르신 + 가족 동반 -> 자갈치시장 하늘전망대 (엘리베이터 직행, 남항 바다 조망)
    if (types.includes('senior') && selectedCompanions.includes('family') && place.id === 'spot-jagalchi-rooftop') {
      finalScore += 5;
    }
    // 재방문 + 친구/연인 -> 송정 해수욕장 (서핑, 죽도공원, 한적한 오션뷰)
    if (selectedExperiences.includes('revisit') && selectedCompanions.includes('friends') && place.id === 'spot-songjeong') {
      finalScore += 7;
    }
    // 친구 + 먹거리 투어 -> 부평 깡통·국제 시장
    if (selectedCompanions.includes('friends') && place.id === 'spot-bupyeong-market') {
      finalScore += 7;
    }
    // 나홀로 사색 & 산책 -> 다대포 고우니 생태길
    if (selectedCompanions.includes('solo') && place.id === 'spot-106') {
      finalScore += 7;
    }

    const highlight = place.recommendationReasons[primaryType];
    results.push({
      place,
      score: finalScore, // 정렬을 위한 원시 적합도 점수
      highlightKo: highlight ? highlight.ko : place.descriptionKo,
      highlightEn: highlight ? highlight.en : place.descriptionEn,
    });
  }

  // 1차: 세부 매칭 및 시너지 가중치가 반영된 원시 점수 기준 내림차순 정렬
  results.sort((a, b) => b.score - a.score);

  // 2차: UI용 점수 분포 보정 (1위는 98~99점, 상위권 90점대, 하위권은 50~70점대로 자연스럽고 유려하게 차등 분포)
  if (results.length > 0) {
    const maxRaw = results[0].score;
    const minRaw = results[results.length - 1].score;
    const range = Math.max(1, maxRaw - minRaw);

    results.forEach((item, idx) => {
      const rankDeduction = idx * 1.5;
      const scoreRatio = (maxRaw - item.score) / range;
      const displayScore = Math.round(99 - rankDeduction - scoreRatio * 15);
      item.score = Math.max(48, Math.min(idx === 0 ? 99 : 98, displayScore));
    });
  }

  return results;
}

/**
 * 5. 한국관광공사 TourAPI 관광지 이미지 헬퍼
 */
export function getPlaceImageUrl(contentIdOrName: string, fallbackUrl?: string): string {
  if (!contentIdOrName) return fallbackUrl || '';

  const cleanKey = contentIdOrName.toLowerCase().replace(/[\s_\-·~()&/]+/g, '');

  // 1. 한국관광공사 TourAPI 공공데이터/OpenAPI 상세 데이터셋에서 먼저 조회 (최우선 공식 이미지)
  const detail = getKoreaTourApiPlaceDetail(contentIdOrName) || getKoreaTourApiPlaceDetail(cleanKey);
  if (detail && detail.firstImage) {
    return detail.firstImage;
  }

  // 2. BARRIER_FREE_PLACES에서 contentId, id, 또는 장소명(공백 및 특수기호 100% 무관 정규화) 매칭
  const found = BARRIER_FREE_PLACES.find((p) => {
    const pCleanKo = (p.nameKo || p.name || '').toLowerCase().replace(/[\s_\-·~()&/]+/g, '');
    const pCleanEn = (p.nameEn || '').toLowerCase().replace(/[\s_\-·~()&/]+/g, '');
    return (
      p.contentId === contentIdOrName ||
      p.contentid === contentIdOrName ||
      p.id === contentIdOrName ||
      (cleanKey.length >= 2 && (pCleanKo === cleanKey || pCleanEn === cleanKey || pCleanKo.includes(cleanKey) || cleanKey.includes(pCleanKo)))
    );
  });
  if (found && found.image) {
    return found.image;
  }

  return fallbackUrl || '';
}
