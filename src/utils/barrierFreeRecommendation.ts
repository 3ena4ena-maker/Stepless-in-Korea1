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
  let baseScore = 60;
  const acc = place.accessibility;
  const transit = place.transit;

  switch (userType) {
    case 'wheelchair': {
      // 휠체어: 계단(stairs) 회피 최우선, 급경사 회피, 엘리베이터/무단차/장애인화장실 최고 가중치
      if (acc.stairs) baseScore -= 45;
      if (acc.steepSlope) baseScore -= 25;
      if (acc.elevator) baseScore += 20;
      if (acc.wheelchair) baseScore += 20;
      if (acc.accessibleRestroom) baseScore += 15;
      if (acc.accessibleParking) baseScore += 10;
      if (transit.subway.hasElevator && !transit.subway.hasStairs) baseScore += 15;
      break;
    }

    case 'stroller': {
      // 유아차: 계단 회피, 엘리베이터 우선, 완만한 길 우선
      if (acc.stairs) baseScore -= 35;
      if (acc.steepSlope) baseScore -= 20;
      if (acc.elevator) baseScore += 20;
      if (acc.stroller) baseScore += 20;
      if (acc.accessibleRestroom) baseScore += 15;
      if (transit.subway.hasElevator) baseScore += 15;
      break;
    }

    case 'luggage': {
      // 캐리어: 계단 회피, 엘리베이터 우선, 평탄한 보행로 우선, 대중교통 직통성
      if (acc.stairs) baseScore -= 40;
      if (acc.steepSlope) baseScore -= 20;
      if (transit.subway.hasElevator) baseScore += 20;
      if (!transit.subway.hasStairs) baseScore += 15;
      if (transit.subway.walkingDistanceMeters <= 300) baseScore += 15;
      break;
    }

    case 'senior': {
      // 천천히 여행하기: 보행거리 단축, 쉼터/휴식 공간, 계단/경사 완만
      if (transit.subway.walkingDistanceMeters > 500) baseScore -= 20;
      if (acc.stairs) baseScore -= 25;
      if (acc.steepSlope) baseScore -= 25;
      if (acc.restAreas) baseScore += 25;
      if (acc.elevator) baseScore += 15;
      if (transit.subway.hasElevator) baseScore += 10;
      break;
    }
  }

  // 상한 100, 하한 30으로 정규화
  return Math.max(30, Math.min(100, baseScore));
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
 * 3. 여행자 유형에 맞는 추천 여행 코스 목록
 */
export function getRecommendedCourses(userType: UserType): TravelCourse[] {
  return [...BARRIER_FREE_COURSES].sort((a, b) => {
    const weightA = a.baseScoreWeights[userType] || 80;
    const weightB = b.baseScoreWeights[userType] || 80;
    return weightB - weightA;
  });
}

/**
 * 4. 여행자 유형에 맞게 정렬된 개별 추천 관광지 목록
 */
export function getRecommendedPlaces(
  userType: UserType
): PlaceRecommendationResult[] {
  return BARRIER_FREE_PLACES.map((place) => {
    const score = calculateAccessibilityScore(place, userType);
    const highlight = place.recommendationReasons[userType];
    return {
      place,
      score,
      highlightKo: highlight ? highlight.ko : place.descriptionKo,
      highlightEn: highlight ? highlight.en : place.descriptionEn,
    };
  }).sort((a, b) => b.score - a.score);
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
  return (
    fallbackUrl ||
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80'
  );
}
