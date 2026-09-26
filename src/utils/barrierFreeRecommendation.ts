/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 배리어프리 추천 알고리즘 및 경로 연산 유틸리티
 * 한국관광공사 무장애 관광 OpenAPI (KorWithAPI) 응답 객체와의 매핑 및 확장이 가능하도록 설계
 */

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
    let accessibilityScore = 0;

    if (types.length === 0) {
      // 아무 유형도 선택되지 않은 경우 기본 종합 접근성 점수
      let base = 85;
      if (place.accessibility.elevator) base += 3;
      if (place.accessibility.accessibleRestroom) base += 3;
      if (place.accessibility.restAreas) base += 3;
      if (place.transit.subway.hasElevator) base += 3;
      if (place.transit.subway.walkingDistanceMeters <= 300) base += 3;
      accessibilityScore = Math.min(100, base);
    } else {
      // 선택된 모든 유형의 점수를 계산하여 종합
      const typeScores = types.map((t) => calculateAccessibilityScore(place, t));
      const avgScore = typeScores.reduce((sum, s) => sum + s, 0) / typeScores.length;
      const minScore = Math.min(...typeScores);

      // 평균 적합도 60% + 가장 제약이 큰 취약 항목 40% 반영하여 복수 조건 모두 엄격 검토
      accessibilityScore = Math.round(0.6 * avgScore + 0.4 * minScore);

      // 실제 접근성이 현저히 낮은 장소(적합도 점수 68점 미만)는 추천 대상에서 자연스럽게 제외
      if (accessibilityScore < 68) {
        continue;
      }
    }

    let finalScore = accessibilityScore;

    // 부산 여행 경험 매칭 가산점 (+12)
    if (selectedExperiences.length > 0 && place.experienceTraits) {
      const matchExp = selectedExperiences.some((exp) => place.experienceTraits?.includes(exp));
      if (matchExp) finalScore += 12;
    }

    // 함께하는 여행 매칭 가산점 (+12)
    if (selectedCompanions.length > 0 && place.companionTraits) {
      const matchComp = selectedCompanions.some((comp) => place.companionTraits?.includes(comp));
      if (matchComp) finalScore += 12;
    }

    // UI 표시용 점수 (최대 100점 상한)
    finalScore = Math.min(100, finalScore);

    const highlight = place.recommendationReasons[primaryType];
    results.push({
      place,
      score: finalScore,
      highlightKo: highlight ? highlight.ko : place.descriptionKo,
      highlightEn: highlight ? highlight.en : place.descriptionEn,
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

/**
 * 5. 한국관광공사 TourAPI 관광지 이미지 헬퍼
 * contentId 기반으로 이미지를 매핑하거나 fallback 처리
 */
export function getPlaceImageUrl(contentId: string, fallbackUrl?: string): string {
  // 등록된 contentId의 기본 이미지 조회
  const found = BARRIER_FREE_PLACES.find((p) => p.contentId === contentId || p.contentid === contentId);
  if (found && found.image) {
    return found.image;
  }
  return fallbackUrl || '';
}
