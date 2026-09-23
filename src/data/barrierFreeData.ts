/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 무장애 관광 데이터 모델 및 여행자 맞춤형 코스/스팟 정의
 * 한국관광공사 무장애 관광 OpenAPI (KorWithAPI) 표준 스키마 및 연동 호환 구조
 */

export type UserType = 'wheelchair' | 'stroller' | 'luggage' | 'senior';

// 부산 여행 경험 타입 정의 (첫 방문 vs 다회차 재방문)
export type BusanExperienceType = 'first' | 'revisit';

export interface BusanExperienceMeta {
  id: BusanExperienceType;
  icon: string;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
}

export const BUSAN_EXPERIENCES: BusanExperienceMeta[] = [
  {
    id: 'first',
    icon: '🌊',
    titleKo: '부산이 처음이에요',
    titleEn: 'First Time in Busan',
    descKo: '부산 대표 랜드마크와 바다 필수 명소',
    descEn: 'Must-visit scenic ocean landmarks',
  },
  {
    id: 'revisit',
    icon: '✨',
    titleKo: '부산을 여러 번 방문했어요',
    titleEn: 'Visited Multiple Times',
    descKo: '골목과 감성, 여유로운 숨은 명소 탐방',
    descEn: 'Hidden gems and relaxed local spots',
  },
];

// 함께하는 여행 타입 정의 (혼자, 가족, 연인, 친구)
export type TravelCompanionType = 'solo' | 'family' | 'couple' | 'friends';

export interface TravelCompanionMeta {
  id: TravelCompanionType;
  icon: string;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
}

export const TRAVEL_COMPANIONS: TravelCompanionMeta[] = [
  {
    id: 'solo',
    icon: '🎒',
    titleKo: '혼자 여행',
    titleEn: 'Solo Travel',
    descKo: '나만의 속도로 여유롭게 즐기는 여행',
    descEn: 'Travel at your own pace',
  },
  {
    id: 'family',
    icon: '👨‍👩‍👧‍👦',
    titleKo: '가족과 함께',
    titleEn: 'With Family',
    descKo: '남녀노소 누구나 안전하고 편안한 이동',
    descEn: 'Safe and comfortable for all ages',
  },
  {
    id: 'couple',
    icon: '💑',
    titleKo: '연인과 함께',
    titleEn: 'With Partner',
    descKo: '로맨틱한 오션뷰와 분위기 있는 코스',
    descEn: 'Romantic ocean views and vibes',
  },
  {
    id: 'friends',
    icon: '👯',
    titleKo: '친구와 함께',
    titleEn: 'With Friends',
    descKo: '핫플레이스와 활기찬 문화 탐방',
    descEn: 'Hot spots and vibrant culture',
  },
];

export interface UserTypeMeta {
  id: UserType;
  icon: string;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  priorityKo: string[];
  priorityEn: string[];
  accentColor: string;
}

export const USER_TYPES: UserTypeMeta[] = [
  {
    id: 'wheelchair',
    icon: '♿',
    titleKo: '휠체어 이용자',
    titleEn: 'Wheelchair User',
    descKo: '계단과 급한 경사를 최대한 피하는 여행',
    descEn: 'Avoids stairs and steep inclines, prioritizing flat routes',
    priorityKo: ['계단 없는 무단차 이동', '엘리베이터 필수 연계', '완만한 경사로', '장애인 화장실 완비'],
    priorityEn: ['Step-free movement', 'Elevator connectivity', 'Gentle slope', 'Accessible restroom'],
    accentColor: 'border-blue-600 bg-blue-50/60 text-blue-900',
  },
  {
    id: 'stroller',
    icon: '👶',
    titleKo: '유아차와 함께',
    titleEn: 'With Stroller',
    descKo: '계단을 피하고 엘리베이터와 완만한 길을 우선하는 여행',
    descEn: 'Prioritizes elevators, wide sidewalks, and baby-friendly amenities',
    priorityKo: ['엘리베이터 연계 출구', '넓고 완만한 보행로', '유아차 진입 가능', '편의시설/수유실'],
    priorityEn: ['Elevator exits', 'Wide gentle walkways', 'Stroller accessibility', 'Restrooms & nursery'],
    accentColor: 'border-emerald-600 bg-emerald-50/60 text-emerald-900',
  },
  {
    id: 'luggage',
    icon: '🧳',
    titleKo: '캐리어와 함께',
    titleEn: 'With Luggage',
    descKo: '계단과 불편한 이동을 줄이고 캐리어를 끌기 편한 길을 우선하는 여행',
    descEn: 'Minimizes stairs and bumpy pavements, smooth transit connections',
    priorityKo: ['계단 없는 평탄 보행로', '지하철 직통 엘리베이터', '대중교통 최단 환승', '보행거리 최소화'],
    priorityEn: ['Smooth flat pavement', 'Subway direct elevator', 'Optimal transit transfer', 'Shorter walk'],
    accentColor: 'border-amber-600 bg-amber-50/60 text-amber-900',
  },
  {
    id: 'senior',
    icon: '👵',
    titleKo: '천천히 여행하기',
    titleEn: 'Slow & Gentle Travel',
    descKo: '걷는 거리를 줄이고 휴식 공간과 편안한 이동을 우선하는 여행',
    descEn: 'Shorter walking distances, plenty of rest areas, gentle slopes',
    priorityKo: ['보행거리 대폭 단축', '곳곳의 쉼터와 벤치', '계단 및 급경사 회피', '실내 완만 동선'],
    priorityEn: ['Short walking distance', 'Ample benches & rest areas', 'Avoid stairs & steep paths', 'Comfortable indoors'],
    accentColor: 'border-purple-600 bg-purple-50/60 text-purple-900',
  },
];

export interface AccessibilitySpec {
  wheelchair: boolean;
  stroller: boolean;
  elevator: boolean;
  accessibleRestroom: boolean;
  accessibleParking: boolean;
  stairs: boolean; // true = 계단 존재
  steepSlope: boolean; // true = 급경사 존재
  restAreas: boolean; // 쉼터/벤치 풍부 여부
  tactilePaving?: boolean; // 시각장애 점자블록
}

export interface TransitStep {
  stepNumber: number;
  title: string;
  desc: string;
  icon?: string;
}

export interface TransitGuide {
  subway: {
    stationId: string;
    stationNameKo: string;
    stationNameEn: string;
    line: string;
    exit: string;
    hasElevator: boolean;
    walkingDistanceMeters: number;
    walkingTimeMinutes: number;
    hasStairs: boolean;
    routeGuideKo: string;
    routeGuideEn: string;
    steps?: TransitStep[];
  };
  bus: {
    stopNameKo: string;
    stopNameEn: string;
    busNumbers: string[];
    hasLowFloorBus: boolean;
    walkingTimeMinutes: number;
    routeGuideKo: string;
    routeGuideEn: string;
    steps?: TransitStep[];
  };
}

export type AccessibilityGrade = 'COMFORTABLE' | 'CAUTION' | 'DIFFICULT';

export interface TouristPlace {
  id: string;
  contentId: string; // 한국관광공사 TourAPI 콘텐츠 ID
  contentid: string; // 호환용
  name: string;
  nameKo: string;
  nameEn: string;
  categoryKo: string;
  categoryEn: string;
  districtKo: string;
  districtEn: string;
  address: string;
  addressKo: string;
  addressEn: string;
  tel: string;
  description: string;
  descriptionKo: string;
  descriptionEn: string;
  image: string;
  latitude: number;
  longitude: number;
  accessibilityGrade: AccessibilityGrade;
  accessibility: AccessibilitySpec;
  transit: TransitGuide;
  recommendationReasons: Record<UserType, { ko: string; en: string }>;
  bestFor: UserType[];
  
  // 지하철 호선 정보 (예: '2호선', '1호선', '동해선' 등)
  subwayLine?: string;

  // 3가지 기준(여행자 유형, 부산 여행 경험, 함께하는 여행) 매칭 태그 및 성향 정보
  experienceTraits?: BusanExperienceType[]; // ['first', 'revisit']
  companionTraits?: TravelCompanionType[];  // ['solo', 'family', 'couple', 'friends']
  criteriaTags?: {
    userTypes: UserType[];
    experiences: BusanExperienceType[];
    companions: TravelCompanionType[];
  };
}

/**
 * 관광 장소 데이터 등록/수정 시 3가지 기준에 맞는 태그 및 성향 정보를 자동으로 추론 및 매칭 생성하는 함수
 * @param place 기본 관광지 정보 (필수 필드 + 접근성 및 위치 정보)
 * @returns 3가지 기준 태그와 성향 정보가 자동으로 포함된 TouristPlace 객체
 */
export function derivePlaceCriteriaTags(place: Partial<TouristPlace> & {
  categoryKo?: string;
  districtKo?: string;
  nameKo?: string;
  descriptionKo?: string;
  accessibility?: Partial<AccessibilitySpec>;
  bestFor?: UserType[];
  experienceTraits?: BusanExperienceType[];
  companionTraits?: TravelCompanionType[];
}): {
  userTypes: UserType[];
  experiences: BusanExperienceType[];
  companions: TravelCompanionType[];
} {
  // 1. 여행자 유형 자동 매칭 (bestFor 우선 또는 accessibility 기반 자동 추론)
  let userTypes: UserType[] = place.bestFor ? [...place.bestFor] : [];
  if (userTypes.length === 0) {
    const acc = place.accessibility;
    // 무단차 및 휠체어 가능 시 휠체어/유아차/캐리어 자동 추천
    if (!acc?.stairs && (acc?.wheelchair || acc?.elevator)) {
      userTypes.push('wheelchair', 'stroller', 'luggage');
    } else {
      if (acc?.wheelchair) userTypes.push('wheelchair');
      if (acc?.stroller) userTypes.push('stroller');
    }
    // 평지이거나 쉼터가 있으면 어르신(천천히 걷기) 자동 추가
    if (!acc?.steepSlope || acc?.restAreas) {
      userTypes.push('senior');
    }
    // 기본 안전값
    if (userTypes.length === 0) {
      userTypes = ['wheelchair', 'stroller', 'luggage', 'senior'];
    }
  }

  // 2. 부산 여행 경험 자동 매칭 (부산이 처음이에요 vs 여러 번 방문했어요)
  let experiences: BusanExperienceType[] = place.experienceTraits ? [...place.experienceTraits] : [];
  if (experiences.length === 0) {
    const name = place.nameKo || '';
    const desc = place.descriptionKo || '';
    const cat = place.categoryKo || '';

    // 부산 대표 필수 랜드마크 키워드
    const isMustVisitFirst =
      /해운대|광안리|자갈치|태종대|용두산|부산타워|감천|흰여울|송도|오륙도|해동용궁사|센텀|더베이|누리마루|남포동|서면/i.test(
        name + ' ' + desc
      ) || cat.includes('해변') || cat.includes('랜드마크');

    // 숨은 명소/감성/문화 골목 키워드
    const isRevisitGem =
      /문화|골목|역사|생태|공원|전시|미술관|산책로|숲|도서관|카페|전통/i.test(
        name + ' ' + desc
      );

    if (isMustVisitFirst) experiences.push('first');
    if (isRevisitGem || !isMustVisitFirst) experiences.push('revisit');

    // 최소 1개 이상 항상 매칭 보장
    if (experiences.length === 0) {
      experiences = ['first', 'revisit'];
    }
  }

  // 3. 함께하는 여행 자동 매칭 (혼자 여행, 가족과 함께, 연인과 함께, 친구와 함께)
  let companions: TravelCompanionType[] = place.companionTraits ? [...place.companionTraits] : [];
  if (companions.length === 0) {
    const name = place.nameKo || '';
    const desc = place.descriptionKo || '';
    const cat = place.categoryKo || '';

    // 연인: 바다, 야경, 오션뷰, 감성, 산책
    if (/바다|해변|야경|선셋|노을|카페|영화|요트|브릿지|데이트/i.test(name + ' ' + desc) || cat.includes('해변')) {
      companions.push('couple');
    }
    // 가족: 박물관, 공원, 수목원, 아쿠아리움, 안전, 수유실, 체험, 광장
    if (/박물관|공원|광장|수족관|체험|어린이|전통|생태|역사/i.test(name + ' ' + desc) || cat.includes('문화') || cat.includes('공원')) {
      companions.push('family');
    }
    // 친구: 핫플, 마켓, 시장, 쇼핑, 활기, 포토존, 액티비티
    if (/시장|거리|마켓|광장|포토|문화|축제|해수욕장|타운/i.test(name + ' ' + desc)) {
      companions.push('friends');
    }
    // 혼자: 조용, 힐링, 사색, 산책, 미술관, 도서관, 도보
    if (/힐링|산책|자연|생태|조용|사색|숲|둘레길|전망/i.test(name + ' ' + desc)) {
      companions.push('solo');
    }

    // 기본 매칭이 부족할 경우 관광 편의성 기준으로 고르게 자동 매칭
    if (companions.length === 0) {
      companions = ['solo', 'family', 'couple', 'friends'];
    }
  }

  return {
    userTypes,
    experiences,
    companions,
  };
}

/**
 * 신규 관광 장소 생성 또는 기존 장소 업데이트 시 3가지 기준 태그가 자동으로 포함되도록 빌드하는 함수
 * 장소를 등록하면서 동시에 3가지 기준(여행자 유형, 부산 여행 경험, 함께하는 여행) 태그가 자동으로 매칭됩니다.
 */
export function buildTouristPlaceWithCriteria(placeData: TouristPlace): TouristPlace {
  const derived = derivePlaceCriteriaTags(placeData);
  const subwayLine = placeData.subwayLine || placeData.transit?.subway?.line || '';
  return {
    ...placeData,
    subwayLine: subwayLine || undefined,
    bestFor: placeData.bestFor && placeData.bestFor.length > 0 ? placeData.bestFor : derived.userTypes,
    experienceTraits: placeData.experienceTraits || derived.experiences,
    companionTraits: placeData.companionTraits || derived.companions,
    criteriaTags: placeData.criteriaTags || {
      userTypes: derived.userTypes,
      experiences: derived.experiences,
      companions: derived.companions,
    },
  };
}

export interface TravelCourse {
  id: string;
  title: string;
  titleKo: string;
  titleEn: string;
  tagKo: string;
  tagEn: string;
  description: string;
  descriptionKo: string;
  descriptionEn: string;
  image: string;
  placeIds: string[]; // 관광지 ID 목록
  duration: string;   // 예: "약 3시간"
  durationKo: string;
  durationEn: string;
  distance: string;   // 예: "약 2.8km"
  distanceKm: number;
  distanceTextKo: string;
  distanceTextEn: string;
  accessibilityLevel: 'COMFORTABLE' | 'CAUTION' | 'MODERATE';
  difficulty: 'COMFORTABLE' | 'CAUTION' | 'MODERATE';
  difficultyTextKo: string;
  difficultyTextEn: string;
  places: {
    nameKo: string;
    nameEn: string;
    spotId?: string;
    contentId?: string;
    noteKo: string;
    noteEn: string;
  }[];
  recommendationReasons: Record<UserType, string[]>;
  accessibilityBadges: {
    textKo: string;
    textEn: string;
    type: 'positive' | 'warning' | 'neutral';
    icon: string;
  }[];
  baseScoreWeights: Record<UserType, number>;
}

// 1. 관광지 상세 데이터 (한국관광공사 TourAPI 표준 스키마 및 검증된 무장애 데이터)
const RAW_BARRIER_FREE_PLACES: TouristPlace[] = [
  {
    id: 'spot-101',
    contentId: 'tour-101',
    contentid: 'tour-101',
    name: '해운대 해수욕장',
    nameKo: '해운대 해수욕장',
    nameEn: 'Haeundae Beach',
    categoryKo: '해변/자연',
    categoryEn: 'Beach/Nature',
    districtKo: '해운대구',
    districtEn: 'Haeundae-gu',
    address: '부산광역시 해운대구 우동 해운대해변로 264',
    addressKo: '부산광역시 해운대구 우동 해운대해변로 264',
    addressEn: '264 Haeundaehaebyeon-ro, Haeundae-gu, Busan',
    tel: '051-749-5700',
    description: '백사장 위로 목재 데크가 길게 설치되어 휠체어와 유아차도 백사장 바로 앞 파도 소리를 들으며 산책할 수 있는 부산의 대표 힐링 관광지입니다.',
    descriptionKo: '백사장 위로 목재 데크가 길게 설치되어 휠체어와 유아차도 백사장 바로 앞 파도 소리를 들으며 산책할 수 있는 부산의 대표 힐링 관광지입니다.',
    descriptionEn: 'Featuring an extensive wooden boardwalk across the sandy shore, enabling wheelchairs and strollers to reach the waterfront directly.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80',
    latitude: 35.1587,
    longitude: 129.1604,
    accessibilityGrade: 'COMFORTABLE',
    accessibility: {
      wheelchair: true,
      stroller: true,
      elevator: true,
      accessibleRestroom: true,
      accessibleParking: true,
      stairs: false,
      steepSlope: false,
      restAreas: true,
      tactilePaving: true,
    },
    subwayLine: '2호선',
    transit: {
      subway: {
        stationId: '203',
        stationNameKo: '해운대역 (2호선)',
        stationNameEn: 'Haeundae Station (Line 2)',
        line: '2호선',
        exit: '5번 출구 엘리베이터',
        hasElevator: true,
        walkingDistanceMeters: 550,
        walkingTimeMinutes: 8,
        hasStairs: false,
        routeGuideKo: '2호선 해운대역 5번 출구 엘리베이터 이용 → 구남로 보행자 전용도로(평지) 직진 → 해변 진입로(경사로)',
        routeGuideEn: 'Line 2 Haeundae Stn Exit 5 elevator → Flat pedestrian street (Gunam-ro) → Beach gentle ramp',
        steps: [
          {
            stepNumber: 1,
            title: '해운대역 도착 (2호선)',
            desc: '지하철 승강장에서 대합실 방향 엘리베이터를 탑승하여 개찰구로 이동합니다.',
            icon: '🚇',
          },
          {
            stepNumber: 2,
            title: '5번 출구 엘리베이터 이용',
            desc: '5번 출구에 위치한 지상 연계 엘리베이터를 타고 지상 구남로 문화광장으로 나옵니다.',
            icon: '🛗',
          },
          {
            stepNumber: 3,
            title: '구남로 무단차 보행 (약 550m)',
            desc: '차량 통행이 없는 평탄한 보행자 전용거리 구남로를 따라 직진합니다. 턱이나 계단이 전혀 없습니다.',
            icon: '🚶',
          },
          {
            stepNumber: 4,
            title: '해운대해수욕장 백사장 데크 도착',
            desc: '해변 광장 진입 경사로를 통해 백사장 위 목재 무장애 데크로 바로 이어집니다.',
            icon: '🌊',
          },
        ],
      },
      bus: {
        stopNameKo: '해운대해수욕장 정류장',
        stopNameEn: 'Haeundae Beach Stop',
        busNumbers: ['1003번(급행)', '139번', '307번'],
        hasLowFloorBus: true,
        walkingTimeMinutes: 2,
        routeGuideKo: '정류장 하차 후 단차 없는 보도블록을 통해 해변 광장으로 바로 연결됩니다.',
        routeGuideEn: 'Step-free level walkway directly connecting bus stop to beach plaza.',
        steps: [
          {
            stepNumber: 1,
            title: '해운대해수욕장 정류장 하차',
            desc: '139번, 307번 저상버스 또는 1003번 급행버스에서 하차합니다.',
            icon: '🚌',
          },
          {
            stepNumber: 2,
            title: '평탄 보도블록 이동 (약 100m)',
            desc: '횡단보도 턱 낮춤 구역을 지나 해운대 이벤트 광장으로 안전하게 진입합니다.',
            icon: '🚶',
          },
          {
            stepNumber: 3,
            title: '해운대 해변 도착',
            desc: '해변 관광안내소 앞 경사로를 통해 해수욕장 데크로 진입합니다.',
            icon: '🏖️',
          },
        ],
      },
    },
    recommendationReasons: {
      wheelchair: {
        ko: '백사장 모래밭 깊숙이까지 목재 데크로 연결되어 휠체어로 바다를 가장 가까이 만날 수 있습니다.',
        en: 'Wooden deck laid across soft sand lets wheelchair users approach the shoreline with ease.',
      },
      stroller: {
        ko: '구남로 보행로와 해변 산책로가 평탄하여 유아차를 부드럽게 밀며 바다를 산책할 수 있습니다.',
        en: 'Smooth pedestrian avenue and beach trail offer hassle-free strolls for families with strollers.',
      },
      luggage: {
        ko: '해운대역에서 해변 호텔가까지 단차가 없고 보행로가 넓어 캐리어를 끌고 이동하기 매우 편리합니다.',
        en: 'Level walkways from station to beachfront hotels make luggage transit smooth.',
      },
      senior: {
        ko: '바다 전망을 따라 그늘 파고라와 편안한 벤치가 다수 마련되어 있어 쉬어가기 좋습니다.',
        en: 'Abundant shaded pergolas and resting benches along the coast accommodate leisurely travel.',
      },
    },
    bestFor: ['wheelchair', 'stroller', 'luggage', 'senior'],
  },
  {
    id: 'spot-108',
    contentId: 'tour-108',
    contentid: 'tour-108',
    name: '동백섬 해안산책로 & 누리마루 APEC하우스',
    nameKo: '동백섬 해안산책로 & 누리마루 APEC하우스',
    nameEn: 'Dongbaekseom Coastal Trail & Nurimaru APEC House',
    categoryKo: '해변/자연',
    categoryEn: 'Beach/Nature',
    districtKo: '해운대구',
    districtEn: 'Haeundae-gu',
    address: '부산광역시 해운대구 동백로 116',
    addressKo: '부산광역시 해운대구 동백로 116',
    addressEn: '116 Dongbaek-ro, Haeundae-gu, Busan',
    tel: '051-749-7621',
    description: '울창한 솔숲과 동백나무 사이로 잘 정비된 해안 목재 데크로드가 누리마루까지 무단차로 이어져 광안대교와 해운대 바다를 한눈에 조망할 수 있습니다.',
    descriptionKo: '울창한 솔숲과 동백나무 사이로 잘 정비된 해안 목재 데크로드가 누리마루까지 무단차로 이어져 광안대교와 해운대 바다를 한눈에 조망할 수 있습니다.',
    descriptionEn: 'Coastal pine and camellia boardwalk linking step-free up to Nurimaru APEC House with panoramic views of Gwangan Bridge.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80',
    latitude: 35.1528,
    longitude: 129.1518,
    accessibilityGrade: 'COMFORTABLE',
    accessibility: {
      wheelchair: true,
      stroller: true,
      elevator: true,
      accessibleRestroom: true,
      accessibleParking: true,
      stairs: false,
      steepSlope: false,
      restAreas: true,
      tactilePaving: true,
    },
    transit: {
      subway: {
        stationId: '204',
        stationNameKo: '동백역 (2호선)',
        stationNameEn: 'Dongbaek Station (Line 2)',
        line: '2호선',
        exit: '1번 출구 엘리베이터',
        hasElevator: true,
        walkingDistanceMeters: 750,
        walkingTimeMinutes: 10,
        hasStairs: false,
        routeGuideKo: '2호선 동백역 1번 출구 엘리베이터 → 평탄 보도 따라 부산웨스틴조선호텔/동백섬 입구 진입',
        routeGuideEn: 'Line 2 Dongbaek Stn Exit 1 elevator → flat walkway towards Dongbaekseom entrance',
        steps: [
          {
            stepNumber: 1,
            title: '동백역 도착 (2호선)',
            desc: '동백역 승강장 엘리베이터를 이용해 개찰구 층으로 올라옵니다.',
            icon: '🚇',
          },
          {
            stepNumber: 2,
            title: '1번 출구 엘리베이터 탑승',
            desc: '1번 출구 앞 엘리베이터로 지상 인도로 나옵니다.',
            icon: '🛗',
          },
          {
            stepNumber: 3,
            title: '동백로 평탄 산책로 보행 (약 750m)',
            desc: '요트경기장 방면 또는 해변 방면 평탄 보도를 따라 동백섬 공원 입구로 이동합니다.',
            icon: '🌲',
          },
          {
            stepNumber: 4,
            title: '누리마루 APEC하우스 관람',
            desc: '경사로와 내부 승강기를 통해 모든 층을 자유롭게 관람합니다.',
            icon: '🏛️',
          },
        ],
      },
      bus: {
        stopNameKo: '동백섬입구 정류장',
        stopNameEn: 'Dongbaekseom Entrance Stop',
        busNumbers: ['139번', '307번', '1003번'],
        hasLowFloorBus: true,
        walkingTimeMinutes: 4,
        routeGuideKo: '정류장에서 동백섬 둘레길 입구까지 턱 없는 평지 보행로로 이어집니다.',
        routeGuideEn: 'Step-free level walk from stop to Dongbaek trail entrance.',
      },
    },
    recommendationReasons: {
      wheelchair: {
        ko: '누리마루 실내에 전용 승강기가 운영되며, 야외 해안 데크길 경사가 완만합니다.',
        en: 'Nurimaru offers passenger elevators and gently-sloped coastal pine decks.',
      },
      stroller: {
        ko: '바닷바람을 맞으며 산책할 수 있는 넓고 평평한 데크길로 유아차 주행에 쾌적합니다.',
        en: 'Broad, even wooden decks sheltered by pines offer comfortable stroller strolling.',
      },
      luggage: {
        ko: '웨스틴조선 및 더베이101 인근에 짐을 맡기거나 휴식을 취하기 편리합니다.',
        en: 'Convenient bag storage and resting lounges nearby around The Bay 101.',
      },
      senior: {
        ko: '솔숲 향기와 시원한 바다 파도 소리를 들으며 천천히 걷기 좋은 부산 최고의 힐링 코스입니다.',
        en: 'Pleasant pine aroma and ocean sounds provide a tranquil, peaceful walk.',
      },
    },
    bestFor: ['wheelchair', 'stroller', 'luggage', 'senior'],
  },
  {
    id: 'spot-111',
    contentId: 'tour-111',
    contentid: 'tour-111',
    name: '더베이101 마린플라자',
    nameKo: '더베이101 마린플라자',
    nameEn: 'The Bay 101 Marine Plaza',
    categoryKo: '쇼핑/복합문화',
    categoryEn: 'Dining/Culture',
    districtKo: '해운대구',
    districtEn: 'Haeundae-gu',
    address: '부산광역시 해운대구 동백로 52',
    addressKo: '부산광역시 해운대구 동백로 52',
    addressEn: '52 Dongbaek-ro, Haeundae-gu, Busan',
    tel: '051-726-8888',
    description: '마린시티의 화려한 마천루 야경을 감상할 수 있는 복합 문화 공간으로, 넓은 평지 광장과 턱 없는 야외 테라스가 조성되어 있습니다.',
    descriptionKo: '마린시티의 화려한 마천루 야경을 감상할 수 있는 복합 문화 공간으로, 넓은 평지 광장과 턱 없는 야외 테라스가 조성되어 있습니다.',
    descriptionEn: 'Marine waterfront culture complex with step-free outdoor boardwalks offering iconic nightscapes of Marine City.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80',
    latitude: 35.1565,
    longitude: 129.1522,
    accessibilityGrade: 'COMFORTABLE',
    accessibility: {
      wheelchair: true,
      stroller: true,
      elevator: true,
      accessibleRestroom: true,
      accessibleParking: true,
      stairs: false,
      steepSlope: false,
      restAreas: true,
      tactilePaving: true,
    },
    transit: {
      subway: {
        stationId: '204',
        stationNameKo: '동백역 (2호선)',
        stationNameEn: 'Dongbaek Station (Line 2)',
        line: '2호선',
        exit: '1번 출구 엘리베이터',
        hasElevator: true,
        walkingDistanceMeters: 550,
        walkingTimeMinutes: 7,
        hasStairs: false,
        routeGuideKo: '동백역 1번 출구 엘리베이터 → 평지 보도 직진하여 더베이101 정문 무단차 진입',
        routeGuideEn: 'Line 2 Dongbaek Stn Exit 1 elevator → flat walkway into main entrance',
        steps: [
          {
            stepNumber: 1,
            title: '동백역 도착 (2호선)',
            desc: '2호선 승강장에서 대합실 방향 엘리베이터를 이용합니다.',
            icon: '🚇',
          },
          {
            stepNumber: 2,
            title: '1번 출구 엘리베이터 탑승',
            desc: '1번 출구 앞 엘리베이터를 타고 지상으로 나옵니다.',
            icon: '🛗',
          },
          {
            stepNumber: 3,
            title: '더베이101 수평 보행 (약 550m)',
            desc: '동백로를 따라 평탄한 보행로로 이동하면 턱 없는 수평 진입로가 나타납니다.',
            icon: '🚶',
          },
          {
            stepNumber: 4,
            title: '더베이101 야외 테라스 도착',
            desc: '턱이 없는 넓은 목재 데크에서 마린시티 야경과 차를 즐길 수 있습니다.',
            icon: '☕',
          },
        ],
      },
      bus: {
        stopNameKo: '동백섬입구 정류장',
        stopNameEn: 'Dongbaekseom Entrance Stop',
        busNumbers: ['139번', '307번', '1003번'],
        hasLowFloorBus: true,
        walkingTimeMinutes: 3,
        routeGuideKo: '정류장 하차 후 단차 없는 인도로 곧장 더베이101 광장으로 이어집니다.',
        routeGuideEn: 'Direct step-free walkway from bus stop to the open plaza.',
      },
    },
    recommendationReasons: {
      wheelchair: {
        ko: '실내 매장과 야외 광장 전 구역이 단차 없는 수평으로 연결되어 있어 휠체어 이용이 매우 편리합니다.',
        en: 'Seamless flat connections between indoor dining and outdoor plazas.',
      },
      stroller: {
        ko: '넓은 야외 데크에 유아차를 옆에 두고 편안하게 야경과 휴식을 즐길 수 있습니다.',
        en: 'Ample outdoor seating areas with space for strollers while enjoying scenic views.',
      },
      luggage: {
        ko: '지하철역 및 버스 정류장에서 평지로 이어져 무거운 짐을 끌고 접근하기 좋습니다.',
        en: 'Completely flat access route ideal for travelers carrying luggage.',
      },
      senior: {
        ko: '실내 엘리베이터와 넓은 좌석 공간이 마련되어 편안하게 휴식을 취할 수 있습니다.',
        en: 'Spacious café lounges and indoor elevators ensure effortless relaxation.',
      },
    },
    bestFor: ['wheelchair', 'stroller', 'luggage', 'senior'],
  },
  {
    id: 'spot-103',
    contentId: 'tour-103',
    contentid: 'tour-103',
    name: 'BEXCO 벡스코 & 복합전시관',
    nameKo: 'BEXCO 벡스코 & 복합전시관',
    nameEn: 'BEXCO Convention & Exhibition Center',
    categoryKo: '문화시설',
    categoryEn: 'Culture/Convention',
    districtKo: '해운대구',
    districtEn: 'Haeundae-gu',
    address: '부산광역시 해운대구 APEC로 55',
    addressKo: '부산광역시 해운대구 APEC로 55',
    addressEn: '55 APEC-ro, Haeundae-gu, Busan',
    tel: '051-740-7300',
    description: '부산 최대의 컨벤션 센터로, 센텀시티역 1번 출구와 지하 무단차 통로로 직결되어 비가 오거나 날씨가 궂어도 편리하게 전시와 문화를 관람할 수 있습니다.',
    descriptionKo: '부산 최대의 컨벤션 센터로, 센텀시티역 1번 출구와 지하 무단차 통로로 직결되어 비가 오거나 날씨가 궂어도 편리하게 전시와 문화를 관람할 수 있습니다.',
    descriptionEn: 'Busan premier international convention center directly connected to Centum City subway station via step-free underground concourse.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    latitude: 35.1691,
    longitude: 129.1362,
    accessibilityGrade: 'COMFORTABLE',
    accessibility: {
      wheelchair: true,
      stroller: true,
      elevator: true,
      accessibleRestroom: true,
      accessibleParking: true,
      stairs: false,
      steepSlope: false,
      restAreas: true,
      tactilePaving: true,
    },
    transit: {
      subway: {
        stationId: '206',
        stationNameKo: '센텀시티역 (2호선)',
        stationNameEn: 'Centum City Station (Line 2)',
        line: '2호선',
        exit: '1번 출구 (벡스코 직결 지하통로)',
        hasElevator: true,
        walkingDistanceMeters: 180,
        walkingTimeMinutes: 3,
        hasStairs: false,
        routeGuideKo: '센텀시티역 1번 출구 방향 지하 무단차 자동문 통로 → 벡스코 실내 본관 직통',
        routeGuideEn: 'Direct underground step-free concourse from Centum City Stn Exit 1 into BEXCO main lobby',
        steps: [
          {
            stepNumber: 1,
            title: '센텀시티역 도착 (2호선)',
            desc: '승강장 중앙 엘리베이터를 타고 지하 1층 대합실로 올라옵니다.',
            icon: '🚇',
          },
          {
            stepNumber: 2,
            title: '1번 출구 방면 이동',
            desc: '계단 없는 지하 평탄 통로를 따라 1번 출구 방향으로 이동합니다.',
            icon: '🚶',
          },
          {
            stepNumber: 3,
            title: '벡스코 지하 직결 통로 진입 (약 180m)',
            desc: '외부 날씨에 구애받지 않는 무단차 자동문 통로를 통과합니다.',
            icon: '🛗',
          },
          {
            stepNumber: 4,
            title: '벡스코 본관 1층 로비 도착',
            desc: '실내 안내소 및 휠체어/유아차 대여소, 대형 승강기 완비 구역에 도착합니다.',
            icon: '🏢',
          },
        ],
      },
      bus: {
        stopNameKo: '벡스코 정류장',
        stopNameEn: 'BEXCO Stop',
        busNumbers: ['115-1번', '31번', '100번', '1002번'],
        hasLowFloorBus: true,
        walkingTimeMinutes: 2,
        routeGuideKo: '정류장 하차 후 벡스코 야외 광장 경사로를 통해 본관 1층으로 연결',
        routeGuideEn: 'Ramp-connected entrance from bus stop into exhibition halls.',
      },
    },
    recommendationReasons: {
      wheelchair: {
        ko: '지하철역과 단차 없이 실내로 직결되며, 안내소에서 휠체어 무료 대여를 지원합니다.',
        en: 'Direct indoor step-free subway connection with complimentary wheelchair rental at reception.',
      },
      stroller: {
        ko: '넓은 복도와 수유실, 유아차 대여소가 갖춰져 있어 아이와 쾌적하게 관람할 수 있습니다.',
        en: 'Wide indoor concourses, nursing stations, and rental strollers available.',
      },
      luggage: {
        ko: '로비 내에 대형 캐리어 전용 코인락커와 수하물 보관 공간이 넉넉히 마련되어 있습니다.',
        en: 'Extensive oversized coin lockers and luggage holding facilities in the lobby.',
      },
      senior: {
        ko: '실내 전 층에 에스컬레이터와 대형 엘리베이터, 충분한 휴식용 소파가 배치되어 있습니다.',
        en: 'Climate-controlled indoors with ample sofas and multiple large elevators.',
      },
    },
    bestFor: ['wheelchair', 'stroller', 'luggage', 'senior'],
  },
  {
    id: 'spot-112',
    contentId: 'tour-112',
    contentid: 'tour-112',
    name: '부산시립미술관 & 어린이갤러리',
    nameKo: '부산시립미술관 & 어린이갤러리',
    nameEn: 'Busan Museum of Art',
    categoryKo: '문화시설',
    categoryEn: 'Art/Museum',
    districtKo: '해운대구',
    districtEn: 'Haeundae-gu',
    address: '부산광역시 해운대구 APEC로 58',
    addressKo: '부산광역시 해운대구 APEC로 58',
    addressEn: '58 APEC-ro, Haeundae-gu, Busan',
    tel: '051-744-2602',
    description: '현대미술 전시와 조각공원이 함께하는 문화공간으로, 미술관 전 층에 무단차 완만 경사로와 관람객용 대형 승강기가 운영됩니다.',
    descriptionKo: '현대미술 전시와 조각공원이 함께하는 문화공간으로, 미술관 전 층에 무단차 완만 경사로와 관람객용 대형 승강기가 운영됩니다.',
    descriptionEn: 'Contemporary art museum featuring barrier-free galleries, passenger lifts, and outdoor sculpture gardens.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80',
    latitude: 35.1668,
    longitude: 129.1375,
    accessibilityGrade: 'COMFORTABLE',
    accessibility: {
      wheelchair: true,
      stroller: true,
      elevator: true,
      accessibleRestroom: true,
      accessibleParking: true,
      stairs: false,
      steepSlope: false,
      restAreas: true,
      tactilePaving: true,
    },
    transit: {
      subway: {
        stationId: '205',
        stationNameKo: '시립미술관역 / 벡스코역 (2호선)',
        stationNameEn: 'BEXCO / Museum of Art Stn (Line 2)',
        line: '2호선',
        exit: '5번 출구 엘리베이터',
        hasElevator: true,
        walkingDistanceMeters: 150,
        walkingTimeMinutes: 2,
        hasStairs: false,
        routeGuideKo: '2호선 벡스코역 5번 출구 엘리베이터 하차 → 미술관 정문 무단차 진입로',
        routeGuideEn: 'Line 2 BEXCO Stn Exit 5 elevator → Flat pathway directly to museum entrance',
        steps: [
          {
            stepNumber: 1,
            title: '벡스코역 도착 (2호선)',
            desc: '승강장 엘리베이터를 이용해 개찰구로 이동합니다.',
            icon: '🚇',
          },
          {
            stepNumber: 2,
            title: '5번 출구 엘리베이터 이용',
            desc: '5번 출구 엘리베이터를 타고 지상으로 바로 나옵니다.',
            icon: '🛗',
          },
          {
            stepNumber: 3,
            title: '미술관 조각공원 무단차 진입 (약 150m)',
            desc: '턱이 없는 평탄 보도를 따라 미술관 정문으로 이동합니다.',
            icon: '🎨',
          },
          {
            stepNumber: 4,
            title: '미술관 전시실 관람',
            desc: '로비 승강기와 완만 경사로를 통해 모든 전시실을 안전하게 관람합니다.',
            icon: '🖼️',
          },
        ],
      },
      bus: {
        stopNameKo: '부산시립미술관 정류장',
        stopNameEn: 'Busan Museum of Art Stop',
        busNumbers: ['31번', '200번', '1002번'],
        hasLowFloorBus: true,
        walkingTimeMinutes: 2,
        routeGuideKo: '정류장 하차 후 단차 없이 미술관 정문으로 진입합니다.',
        routeGuideEn: 'Step-free walk from bus stop into the museum courtyard.',
      },
    },
    recommendationReasons: {
      wheelchair: {
        ko: '전시실 전 구역 문턱이 없고 대형 엘리베이터로 이동할 수 있습니다.',
        en: 'Completely threshold-free galleries serviced by spacious elevators.',
      },
      stroller: {
        ko: '어린이 갤러리와 쾌적한 실내 휴게공간이 있어 아이와 함께 방문하기 좋습니다.',
        en: 'Dedicated children gallery with family-friendly rest spaces.',
      },
      luggage: {
        ko: '벡스코역과 인접하며 전시관 내에 짐 보관 락커가 구비되어 있습니다.',
        en: 'Close to transit station with convenient museum storage lockers.',
      },
      senior: {
        ko: '작품마다 벤치가 마련되어 있어 편안한 자세로 예술을 감상할 수 있습니다.',
        en: 'Frequent benches placed throughout galleries allow restful appreciation.',
      },
    },
    bestFor: ['wheelchair', 'stroller', 'luggage', 'senior'],
  },
  {
    id: 'spot-106',
    contentId: 'tour-106',
    contentid: 'tour-106',
    name: '다대포 해수욕장',
    nameKo: '다대포 해수욕장',
    nameEn: 'Dadaepo Beach',
    categoryKo: '해변/자연',
    categoryEn: 'Beach/Nature',
    districtKo: '사하구',
    districtEn: 'Saha-gu',
    address: '부산광역시 사하구 다대동 몰운대1길 14',
    addressKo: '부산광역시 사하구 다대동 몰운대1길 14',
    addressEn: '14 Morundae 1-gil, Saha-gu, Busan',
    tel: '051-220-4161',
    description: '다대포해수욕장역에서 하차 즉시 평지로 공원과 백사장에 진입할 수 있으며, 갈대밭 사이로 넓고 완만한 목재 데크로드가 길게 이어져 황홀한 낙조를 편안하게 감상할 수 있습니다.',
    descriptionKo: '다대포해수욕장역에서 하차 즉시 평지로 공원과 백사장에 진입할 수 있으며, 갈대밭 사이로 넓고 완만한 목재 데크로드가 길게 이어져 황홀한 낙조를 편안하게 감상할 수 있습니다.',
    descriptionEn: 'Famous for flat coastal reed boardwalks and breathtaking golden sunsets, step-free directly from the subway station.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    latitude: 35.0483,
    longitude: 128.9664,
    accessibilityGrade: 'COMFORTABLE',
    accessibility: {
      wheelchair: true,
      stroller: true,
      elevator: true,
      accessibleRestroom: true,
      accessibleParking: true,
      stairs: false,
      steepSlope: false,
      restAreas: true,
      tactilePaving: true,
    },
    subwayLine: '1호선',
    transit: {
      subway: {
        stationId: '095',
        stationNameKo: '다대포해수욕장역 (1호선)',
        stationNameEn: 'Dadaepo Beach Station (Line 1)',
        line: '1호선',
        exit: '1번 또는 4번 출구 엘리베이터',
        hasElevator: true,
        walkingDistanceMeters: 80,
        walkingTimeMinutes: 1,
        hasStairs: false,
        routeGuideKo: '1호선 다대포해수욕장역 1번 출구 엘리베이터 하차 → 출구 직결 평지 해변공원 진입',
        routeGuideEn: 'Line 1 Dadaepo Beach Stn Exit 1 elevator → direct flat entry to beach park',
        steps: [
          {
            stepNumber: 1,
            title: '다대포해수욕장역 도착 (1호선 종점)',
            desc: '승강장 엘리베이터로 개찰구 층으로 올라옵니다.',
            icon: '🚇',
          },
          {
            stepNumber: 2,
            title: '1번 출구 엘리베이터 탑승',
            desc: '엘리베이터에서 내리면 바로 지상 다대포 해변공원 평지 광장입니다.',
            icon: '🛗',
          },
          {
            stepNumber: 3,
            title: '고우니 생태길 진입 (약 80m)',
            desc: '갈대밭 사이로 놓인 완만하고 넓은 목재 데크길을 따라 직진합니다.',
            icon: '🌾',
          },
          {
            stepNumber: 4,
            title: '낙조 전망대 및 분수 광장 도착',
            desc: '단차 없는 전망대에서 황금빛 일몰을 감상합니다.',
            icon: '🌅',
          },
        ],
      },
      bus: {
        stopNameKo: '다대포해수욕장역 정류장',
        stopNameEn: 'Dadaepo Beach Stn Stop',
        busNumbers: ['96번', '338번', '1000번(급행)'],
        hasLowFloorBus: true,
        walkingTimeMinutes: 2,
        routeGuideKo: '정류장 하차 후 도로 횡단 없이 평탄 인도로 해변 생태길 연결',
        routeGuideEn: 'Step-free sidewalk connection from stop to the reed wetland trail.',
      },
    },
    recommendationReasons: {
      wheelchair: {
        ko: '지하철 1호선 출구에서 불과 80m 평지로 연결되며 생태길 전 구간이 완만한 데크로 되어 있습니다.',
        en: 'Only 80m flat walk from subway exit with level wooden boardwalks across the wetlands.',
      },
      stroller: {
        ko: '넓은 해안 솔숲 공원과 완만한 산책로가 조성되어 유아차 나들이에 최고의 자연 명소입니다.',
        en: 'Expansive flat pine park and peaceful boardwalks ideal for family stroller outings.',
      },
      luggage: {
        ko: '역사 내 물품보관함이 구비되어 있으며 출구 바로 앞이 평지라 이동이 간편합니다.',
        en: 'Lockers inside the station with zero steps outside to the beach plaza.',
      },
      senior: {
        ko: '탁 트인 낙조 전망과 데크 곳곳의 쉼터 벤치에서 일몰을 앉아서 편안히 감상할 수 있습니다.',
        en: 'Splendid sunset vistas with frequent seated rest gazebos along the path.',
      },
    },
    bestFor: ['wheelchair', 'stroller', 'luggage', 'senior'],
  },
  {
    id: 'spot-107',
    contentId: 'tour-107',
    contentid: 'tour-107',
    name: '자갈치시장 현대화건물 & 친수공간',
    nameKo: '자갈치시장 현대화건물 & 친수공간',
    nameEn: 'Jagalchi Fish Market Modern Building & Waterfront',
    categoryKo: '쇼핑/복합문화',
    categoryEn: 'Market/Dining',
    districtKo: '중구',
    districtEn: 'Jung-gu',
    address: '부산광역시 중구 자갈치해안로 52',
    addressKo: '부산광역시 중구 자갈치해안로 52',
    addressEn: '52 Jagalchihaean-ro, Jung-gu, Busan',
    tel: '051-713-8000',
    description: '부산의 활기를 대표하는 수산시장으로, 현대화 신축 건물 전 층에 승강기가 운행되며 건물 뒤편 바다 친수공간은 턱 없는 평지로 조성되어 남항 바다를 조망할 수 있습니다.',
    descriptionKo: '부산의 활기를 대표하는 수산시장으로, 현대화 신축 건물 전 층에 승강기가 운행되며 건물 뒤편 바다 친수공간은 턱 없는 평지로 조성되어 남항 바다를 조망할 수 있습니다.',
    descriptionEn: 'Busan iconic fish market modern building with passenger elevators, accessible restrooms, and an open flat waterfront deck.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80',
    latitude: 35.0967,
    longitude: 129.0306,
    accessibilityGrade: 'COMFORTABLE',
    accessibility: {
      wheelchair: true,
      stroller: true,
      elevator: true,
      accessibleRestroom: true,
      accessibleParking: true,
      stairs: false,
      steepSlope: false,
      restAreas: true,
      tactilePaving: true,
    },
    transit: {
      subway: {
        stationId: '110',
        stationNameKo: '자갈치역 (1호선)',
        stationNameEn: 'Jagalchi Station (Line 1)',
        line: '1호선',
        exit: '10번 출구 엘리베이터',
        hasElevator: true,
        walkingDistanceMeters: 280,
        walkingTimeMinutes: 4,
        hasStairs: false,
        routeGuideKo: '1호선 자갈치역 10번 출구 엘리베이터 → 평지 보도 따라 자갈치시장 현대화 건물 진입',
        routeGuideEn: 'Line 1 Jagalchi Stn Exit 10 elevator → flat sidewalk directly to modernized market building',
        steps: [
          {
            stepNumber: 1,
            title: '자갈치역 도착 (1호선)',
            desc: '승강장에서 대합실로 엘리베이터를 탑승합니다.',
            icon: '🚇',
          },
          {
            stepNumber: 2,
            title: '10번 출구 엘리베이터 이용',
            desc: '10번 출구 엘리베이터로 지상 인도로 나옵니다.',
            icon: '🛗',
          },
          {
            stepNumber: 3,
            title: '평탄 보행로 직진 (약 280m)',
            desc: '보도블록 정비 구역을 따라 자갈치시장 신관 방향으로 이동합니다.',
            icon: '🚶',
          },
          {
            stepNumber: 4,
            title: '시장 신관 수평 자동문 진입',
            desc: '턱이 없는 자동문으로 진입해 실내 승강기로 식당가나 전망 테라스를 이용합니다.',
            icon: '🏢',
          },
        ],
      },
      bus: {
        stopNameKo: '자갈치시장 정류장',
        stopNameEn: 'Jagalchi Market Stop',
        busNumbers: ['26번', '27번', '41번', '87번'],
        hasLowFloorBus: true,
        walkingTimeMinutes: 3,
        routeGuideKo: '정류장 하차 후 신호등 횡단보도를 지나 시장 현대화 건물로 단차 없이 진입',
        routeGuideEn: 'Level crossing from bus stop to the main market entrance.',
      },
    },
    recommendationReasons: {
      wheelchair: {
        ko: '현대화 건물 내에 승강기와 장애인 화장실이 완비되어 있고 건물 뒤 수변 데크가 평탄합니다.',
        en: 'Modern building equipped with elevators, accessible restrooms, and a flat waterfront boardwalk.',
      },
      stroller: {
        ko: '재래시장 골목 대신 넓고 쾌적한 현대식 건물 내부를 유아차로 편리하게 관람할 수 있습니다.',
        en: 'Clean, wide interior aisles inside the modern building make stroller navigation easy.',
      },
      luggage: {
        ko: '부산역에서 3정거장 거리로 매우 가깝고 지하철역에서 시장까지 평지로 연결됩니다.',
        en: 'Only 3 subway stops from Busan Station with level pavement all the way.',
      },
      senior: {
        ko: '신선한 해산물 요리를 건물 내 승강기로 편하게 2층 회센터에서 식사할 수 있습니다.',
        en: 'Take indoor elevators straight to second-floor dining halls with harbor views.',
      },
    },
    bestFor: ['wheelchair', 'stroller', 'luggage', 'senior'],
  },
  {
    id: 'spot-104',
    contentId: 'tour-104',
    contentid: 'tour-104',
    name: '국립해양박물관',
    nameKo: '국립해양박물관',
    nameEn: 'National Maritime Museum',
    categoryKo: '문화시설',
    categoryEn: 'Museum',
    districtKo: '영도구',
    districtEn: 'Yeongdo-gu',
    address: '부산광역시 영도구 해양로301번길 45',
    addressKo: '부산광역시 영도구 해양로301번길 45',
    addressEn: '45 Haeyang-ro 301beon-gil, Yeongdo-gu, Busan',
    tel: '051-309-1900',
    description: '물방울을 형상화한 아름다운 외관의 국내 최대 해양박물관으로, 실내에 대형 수족관과 미디어 아트가 조성되어 있으며 전 구역이 완만한 나선형 슬로프와 승강기로 연결됩니다.',
    descriptionKo: '물방울을 형상화한 아름다운 외관의 국내 최대 해양박물관으로, 실내에 대형 수족관과 미디어 아트가 조성되어 있으며 전 구역이 완만한 나선형 슬로프와 승강기로 연결됩니다.',
    descriptionEn: 'Korea premier maritime museum with circular indoor slopes, panoramic ocean aquarium, and state-of-the-art barrier-free facilities.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80',
    latitude: 35.0789,
    longitude: 129.0803,
    accessibilityGrade: 'COMFORTABLE',
    accessibility: {
      wheelchair: true,
      stroller: true,
      elevator: true,
      accessibleRestroom: true,
      accessibleParking: true,
      stairs: false,
      steepSlope: false,
      restAreas: true,
      tactilePaving: true,
    },
    transit: {
      subway: {
        stationId: '111',
        stationNameKo: '남포역 (1호선)',
        stationNameEn: 'Nampo Station (Line 1)',
        line: '1호선',
        exit: '6번 출구 ↔ 66번 저상버스 환승',
        hasElevator: true,
        walkingDistanceMeters: 50,
        walkingTimeMinutes: 1,
        hasStairs: false,
        routeGuideKo: '1호선 남포역 6번 출구 엘리베이터 하차 → 66번 저상버스 탑승 → 국립해양박물관 정문 하차',
        routeGuideEn: 'Line 1 Nampo Stn Exit 6 elevator → Transfer to low-floor bus #66 dropping off right outside museum',
        steps: [
          {
            stepNumber: 1,
            title: '남포역 도착 (1호선)',
            desc: '남포역 승강장 엘리베이터로 개찰구 층으로 이동합니다.',
            icon: '🚇',
          },
          {
            stepNumber: 2,
            title: '6번 출구 엘리베이터 탑승',
            desc: '지상 버스 정류장 바로 앞 6번 출구 엘리베이터로 나옵니다.',
            icon: '🛗',
          },
          {
            stepNumber: 3,
            title: '66번 저상버스 탑승',
            desc: '휠체어 슬로프가 완비된 66번 저상버스를 타고 영도로 이동합니다.',
            icon: '🚌',
          },
          {
            stepNumber: 4,
            title: '국립해양박물관 정문 하차',
            desc: '정류장 바로 앞에서 박물관 1층 로비로 단차 없이 진입합니다.',
            icon: '🏛️',
          },
        ],
      },
      bus: {
        stopNameKo: '국립해양박물관 정류장',
        stopNameEn: 'National Maritime Museum Stop',
        busNumbers: ['66번(저상버스)', '186번'],
        hasLowFloorBus: true,
        walkingTimeMinutes: 1,
        routeGuideKo: '정류장에서 박물관 로비 입구까지 완만 경사로와 수평 자동문 직결',
        routeGuideEn: 'Direct ramp connection from bus stop into the museum grand lobby.',
      },
    },
    recommendationReasons: {
      wheelchair: {
        ko: '전 층이 완만한 원형 램프와 대형 투명 승강기로 연결되어 있어 휠체어로 모든 층을 편하게 관람할 수 있습니다.',
        en: 'Gentle circular ramps and glass elevators provide seamless movement throughout all exhibits.',
      },
      stroller: {
        ko: '유아 전용 어린이박물관과 아늑한 수유실, 유아차 대여 서비스가 잘 갖추어져 있습니다.',
        en: 'Dedicated children museum, nursing rooms, and complimentary stroller rentals.',
      },
      luggage: {
        ko: '안내데스크에 무료 물품보관함이 구비되어 있어 가볍게 관람할 수 있습니다.',
        en: 'Free storage lockers located right by the main entrance info desk.',
      },
      senior: {
        ko: '바다 전망 카페와 휴게 라운지에서 오륙도와 부산항 바다를 여유롭게 조망할 수 있습니다.',
        en: 'Seaside observation lounges offer tranquil panoramic views of Oryukdo and Busan Port.',
      },
    },
    bestFor: ['wheelchair', 'stroller', 'luggage', 'senior'],
  },
  {
    id: 'spot-aquarium',
    contentId: 'tour-aqua-101',
    contentid: 'tour-aqua-101',
    name: 'SEA LIFE 부산아쿠아리움',
    nameKo: 'SEA LIFE 부산아쿠아리움',
    nameEn: 'SEA LIFE Busan Aquarium',
    categoryKo: '문화/체험',
    categoryEn: 'Aquarium/Attraction',
    districtKo: '해운대구',
    districtEn: 'Haeundae-gu',
    address: '부산광역시 해운대구 해운대해변로 266',
    addressKo: '부산광역시 해운대구 해운대해변로 266',
    addressEn: '266 Haeundaehaebyeon-ro, Haeundae-gu, Busan',
    tel: '051-740-1700',
    description: '해운대 해변 바로 앞에 위치한 대형 아쿠아리움으로, 전 관람 동선이 완만한 슬로프와 대형 휠체어/유아차 전용 엘리베이터로 연결되어 누구나 안전하고 편안하게 해저 세계를 감상할 수 있습니다.',
    descriptionKo: '해운대 해변 바로 앞에 위치한 대형 아쿠아리움으로, 전 관람 동선이 완만한 슬로프와 대형 휠체어/유아차 전용 엘리베이터로 연결되어 누구나 안전하고 편안하게 해저 세계를 감상할 수 있습니다.',
    descriptionEn: 'Located right by Haeundae Beach, featuring gentle interior ramps and elevators with 250+ marine species for seamless step-free viewing.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    latitude: 35.1592,
    longitude: 129.1609,
    accessibilityGrade: 'COMFORTABLE',
    accessibility: {
      wheelchair: true,
      stroller: true,
      elevator: true,
      accessibleRestroom: true,
      accessibleParking: true,
      stairs: false,
      steepSlope: false,
      restAreas: true,
      tactilePaving: true,
    },
    subwayLine: '2호선',
    transit: {
      subway: {
        stationId: '203',
        stationNameKo: '해운대역 (2호선)',
        stationNameEn: 'Haeundae Station (Line 2)',
        line: '2호선',
        exit: '5번 출구 엘리베이터',
        hasElevator: true,
        walkingDistanceMeters: 560,
        walkingTimeMinutes: 8,
        hasStairs: false,
        routeGuideKo: '2호선 해운대역 5번 출구 엘리베이터 → 구남로 평지 보행로 직진 → 아쿠아리움 지상 정문 경사로 진입',
        routeGuideEn: 'Line 2 Haeundae Stn Exit 5 elevator → Gunam-ro pedestrian street → Aquarium entrance gentle ramp',
        steps: [
          {
            stepNumber: 1,
            title: '해운대역 5번 출구 엘리베이터 탑승',
            desc: '승강장 및 대합실 엘리베이터로 구남로 지상 광장으로 진입합니다.',
            icon: '🛗',
          },
          {
            stepNumber: 2,
            title: '구남로 평탄 보행로 (약 560m)',
            desc: '차량과 계단이 없는 평탄한 인도를 따라 해운대 바다 방향으로 이동합니다.',
            icon: '🚶',
          },
          {
            stepNumber: 3,
            title: '아쿠아리움 로비 엘리베이터 이용',
            desc: '지상 매표소에서 안내원 도움을 받아 지하 전시관 승강기로 내려갑니다.',
            icon: '🐠',
          },
        ],
      },
      bus: {
        stopNameKo: '해운대해수욕장 정류장',
        stopNameEn: 'Haeundae Beach Stop',
        busNumbers: ['1003번(급행)', '139번', '307번'],
        hasLowFloorBus: true,
        walkingTimeMinutes: 2,
        routeGuideKo: '정류장 하차 후 단차 없는 보도블록을 통해 아쿠아리움 건물로 직결',
        routeGuideEn: 'Direct step-free sidewalk connection from bus stop to entrance.',
      },
    },
    recommendationReasons: {
      wheelchair: {
        ko: '지하 3개 층의 수족관이 전용 승강기와 완만 경사로로 이어져 문턱 없이 모든 터널과 수조를 관람할 수 있습니다.',
        en: 'Dedicated elevators and smooth slopes enable barrier-free tours of all tunnels and tanks.',
      },
      stroller: {
        ko: '넓은 실내 복도와 수유실, 유아차 이동 동선이 완벽하게 구비되어 가족 여행객에게 가장 쾌적합니다.',
        en: 'Spacious corridors, clean nursing rooms, and step-free circulation ideal for families with strollers.',
      },
      luggage: {
        ko: '안내데스크에 캐리어 등 대형 수하물 보관 서비스가 제공됩니다.',
        en: 'Large luggage and baggage storage available right at the reception desk.',
      },
      senior: {
        ko: '날씨와 기온에 구애받지 않고 시원하고 아늑한 실내 벤치에 앉아 여유롭게 관람할 수 있습니다.',
        en: 'Climate-controlled indoors with frequent seating benches alongside main exhibits.',
      },
    },
    bestFor: ['wheelchair', 'stroller', 'luggage', 'senior'],
    experienceTraits: ['first', 'revisit'],
    companionTraits: ['family', 'couple', 'friends'],
    criteriaTags: {
      userTypes: ['wheelchair', 'stroller', 'luggage', 'senior'],
      experiences: ['first', 'revisit'],
      companions: ['family', 'couple', 'friends'],
    },
  },
  {
    id: 'spot-xthesky',
    contentId: 'tour-sky-102',
    contentid: 'tour-sky-102',
    name: '부산 엑스더스카이 전망대 (LCT 100층)',
    nameKo: '부산 엑스더스카이 전망대 (LCT 100층)',
    nameEn: 'BUSAN X the SKY Observatory',
    categoryKo: '랜드마크/전망대',
    categoryEn: 'Landmark/Observatory',
    districtKo: '해운대구',
    districtEn: 'Haeundae-gu',
    address: '부산광역시 해운대구 달맞이길 30 엘시티 랜드마크타워',
    addressKo: '부산광역시 해운대구 달맞이길 30 엘시티 랜드마크타워',
    addressEn: '30 Dalmaji-gil, Haeundae-gu, Busan (LCT Landmark Tower)',
    tel: '051-731-0098',
    description: '국내 2위 높이(411.6m)의 초고층 랜드마크 전망대로, 해운대 해변과 광안대교, 동백섬의 360도 파노라마 뷰를 휠체어와 유아차로 단차 없이 감상할 수 있습니다.',
    descriptionKo: '국내 2위 높이(411.6m)의 초고층 랜드마크 전망대로, 해운대 해변과 광안대교, 동백섬의 360도 파노라마 뷰를 휠체어와 유아차로 단차 없이 감상할 수 있습니다.',
    descriptionEn: 'Korea second tallest observatory offering a 360-degree panoramic ocean vista from the 100th floor with high-speed accessible elevators.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    latitude: 35.1598,
    longitude: 129.1685,
    accessibilityGrade: 'COMFORTABLE',
    accessibility: {
      wheelchair: true,
      stroller: true,
      elevator: true,
      accessibleRestroom: true,
      accessibleParking: true,
      stairs: false,
      steepSlope: false,
      restAreas: true,
      tactilePaving: true,
    },
    subwayLine: '2호선',
    transit: {
      subway: {
        stationId: '202',
        stationNameKo: '중동역 (2호선)',
        stationNameEn: 'Jung-dong Station (Line 2)',
        line: '2호선',
        exit: '7번 출구 엘리베이터',
        hasElevator: true,
        walkingDistanceMeters: 780,
        walkingTimeMinutes: 11,
        hasStairs: false,
        routeGuideKo: '2호선 중동역 7번 출구 엘리베이터 → 평탄 보도 따라 엘시티 랜드마크타워 1층 로비 무단차 진입',
        routeGuideEn: 'Line 2 Jung-dong Stn Exit 7 elevator → flat pavement to LCT Landmark Tower 1F entrance',
        steps: [
          {
            stepNumber: 1,
            title: '중동역 7번 출구 엘리베이터 이용',
            desc: '승강장 엘리베이터로 대합실을 거쳐 지상 7번 출구로 나옵니다.',
            icon: '🛗',
          },
          {
            stepNumber: 2,
            title: '엘시티 방면 평탄 보도 (약 780m)',
            desc: '인도 턱 낮춤 구역을 따라 달맞이길 입구 엘시티 광장으로 이동합니다.',
            icon: '🚶',
          },
          {
            stepNumber: 3,
            title: '초고속 스카이 크루즈 엘리베이터 탑승',
            desc: '1층 안내소의 휠체어 우선 통로를 통해 100층 전망대로 56초 만에 직행합니다.',
            icon: '🏙️',
          },
        ],
      },
      bus: {
        stopNameKo: '미포문탠로드입구 정류장',
        stopNameEn: 'Mipo Moontan Road Stop',
        busNumbers: ['139번', '141번', '1003번(급행)'],
        hasLowFloorBus: true,
        walkingTimeMinutes: 3,
        routeGuideKo: '정류장 하차 후 턱 없는 보도를 따라 엘시티 1층 전망대 입구로 바로 연결됩니다.',
        routeGuideEn: 'Level sidewalk connecting bus stop directly to the observatory ticket hall.',
      },
    },
    recommendationReasons: {
      wheelchair: {
        ko: '전 층이 완전 평면 무단차 설계이며, 100층 투명 유리다리(쇼킹브릿지)도 휠체어로 통과할 수 있습니다.',
        en: 'Threshold-free flat glass observation floors with full wheelchair access even across sky bridges.',
      },
      stroller: {
        ko: '1층 매표소부터 100층 전망 라운지까지 유아차 반입이 자유로우며 쾌적한 가족 휴게실이 있습니다.',
        en: 'Stroller friendly from ticket hall to 100th floor with spacious lounges.',
      },
      luggage: {
        ko: '1층 로비 컨시어지에서 캐리어 수하물 보관 서비스를 제공합니다.',
        en: 'Complimentary luggage storage available at the ground floor concierge.',
      },
      senior: {
        ko: '초고속 엘리베이터로 이동 피로가 없으며, 99층 라운지 카페에서 부산 전체를 편히 앉아 조망할 수 있습니다.',
        en: 'Zero walking fatigue with ultra-fast elevators and comfortable seating cafes on the 99th floor.',
      },
    },
    bestFor: ['wheelchair', 'stroller', 'luggage', 'senior'],
    experienceTraits: ['first', 'revisit'],
    companionTraits: ['couple', 'friends', 'family', 'solo'],
    criteriaTags: {
      userTypes: ['wheelchair', 'stroller', 'luggage', 'senior'],
      experiences: ['first', 'revisit'],
      companions: ['couple', 'friends', 'family', 'solo'],
    },
  },
  {
    id: 'spot-songjeong',
    contentId: 'tour-song-103',
    contentid: 'tour-song-103',
    name: '송정 해수욕장',
    nameKo: '송정 해수욕장',
    nameEn: 'Songjeong Beach',
    categoryKo: '해변/자연',
    categoryEn: 'Beach/Nature',
    districtKo: '해운대구',
    districtEn: 'Haeundae-gu',
    address: '부산광역시 해운대구 송정해변로 62',
    addressKo: '부산광역시 해운대구 송정해변로 62',
    addressEn: '62 Songjeonghaebyeon-ro, Haeundae-gu, Busan',
    tel: '051-749-7611',
    description: '완만한 백사장과 맑은 물빛이 특징인 해변으로, 해안도로를 따라 무단차 보행로와 죽도공원 완만 데크로드가 잘 정비되어 파도 소리와 함께 여유를 즐길 수 있습니다.',
    descriptionKo: '완만한 백사장과 맑은 물빛이 특징인 해변으로, 해안도로를 따라 무단차 보행로와 죽도공원 완만 데크로드가 잘 정비되어 파도 소리와 함께 여유를 즐길 수 있습니다.',
    descriptionEn: 'Known for gentle waves and white sands, offering seaside flat boardwalks and easy coastal access connecting to Jukdo Park.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    latitude: 35.1785,
    longitude: 129.1997,
    accessibilityGrade: 'COMFORTABLE',
    accessibility: {
      wheelchair: true,
      stroller: true,
      elevator: true,
      accessibleRestroom: true,
      accessibleParking: true,
      stairs: false,
      steepSlope: false,
      restAreas: true,
      tactilePaving: true,
    },
    subwayLine: '동해선',
    transit: {
      subway: {
        stationId: 'K121',
        stationNameKo: '송정역 (동해선)',
        stationNameEn: 'Songjeong Station (Donghae Line)',
        line: '동해선',
        exit: '1번 또는 2번 출구 엘리베이터',
        hasElevator: true,
        walkingDistanceMeters: 650,
        walkingTimeMinutes: 9,
        hasStairs: false,
        routeGuideKo: '동해선 송정역 1번 출구 엘리베이터 → 송정천 평지 보행로 직진 → 송정 해변 입구 진입',
        routeGuideEn: 'Donghae Line Songjeong Stn Exit 1 elevator → flat walkway along stream → beach entrance',
        steps: [
          {
            stepNumber: 1,
            title: '송정역 도착 (동해선)',
            desc: '광역전철 승강장 엘리베이터로 개찰구 층으로 이동합니다.',
            icon: '🚇',
          },
          {
            stepNumber: 2,
            title: '1번 출구 엘리베이터 탑승',
            desc: '엘리베이터를 타고 지상 턱 없는 보행로로 나옵니다.',
            icon: '🛗',
          },
          {
            stepNumber: 3,
            title: '송정 해안로 평지 이동 (약 650m)',
            desc: '경사가 없는 포장도로와 목재 데크를 따라 송정 해수욕장 백사장 앞으로 이동합니다.',
            icon: '🌊',
          },
        ],
      },
      bus: {
        stopNameKo: '송정해수욕장 입구 정류장',
        stopNameEn: 'Songjeong Beach Stop',
        busNumbers: ['139번', '185번', '1001번(급행)'],
        hasLowFloorBus: true,
        walkingTimeMinutes: 3,
        routeGuideKo: '정류장 하차 후 턱 낮은 건널목을 건너 해변 산책로로 바로 연결',
        routeGuideEn: 'Level crossing from bus stop directly onto the beach promenade.',
      },
    },
    recommendationReasons: {
      wheelchair: {
        ko: '해안가를 따라 넓고 평평한 보행 데크가 길게 뻗어 있어 바다를 옆에 두고 편안하게 휠체어를 탈 수 있습니다.',
        en: 'Broad flat wooden promenade stretching along the sandy beach for smooth wheelchair gliding.',
      },
      stroller: {
        ko: '붐비지 않고 한적한 분위기에서 파도 소리를 들으며 유아차를 산책시키기에 최적의 자연 해변입니다.',
        en: 'Peaceful, uncrowded beachfront ideal for calm stroller strolls by the ocean.',
      },
      luggage: {
        ko: '동해선 송정역 역사 내에 짐 보관 락커가 있으며 해변 진입로가 평지입니다.',
        en: 'Lockers available at Donghae Line Songjeong station with flat paved access.',
      },
      senior: {
        ko: '송정 해송 숲 그늘과 정자가 해변가에 배치되어 있어 솔바람을 쐬며 편안히 쉬어갈 수 있습니다.',
        en: 'Pine tree shade and ocean gazebos allow leisurely rest with gentle sea breezes.',
      },
    },
    bestFor: ['wheelchair', 'stroller', 'luggage', 'senior'],
    experienceTraits: ['revisit', 'first'],
    companionTraits: ['friends', 'couple', 'family', 'solo'],
    criteriaTags: {
      userTypes: ['wheelchair', 'stroller', 'luggage', 'senior'],
      experiences: ['revisit', 'first'],
      companions: ['friends', 'couple', 'family', 'solo'],
    },
  },
  {
    id: 'spot-jagalchi-rooftop',
    contentId: 'tour-jagalchi-roof',
    contentid: 'tour-jagalchi-roof',
    name: '자갈치시장 (루프탑 하늘전망대)',
    nameKo: '자갈치시장 (루프탑 하늘전망대)',
    nameEn: 'Jagalchi Market Rooftop Sky Observatory',
    categoryKo: '랜드마크/전망대',
    categoryEn: 'Landmark/Observatory',
    districtKo: '중구',
    districtEn: 'Jung-gu',
    address: '부산광역시 중구 자갈치해안로 52 신관 7층',
    addressKo: '부산광역시 중구 자갈치해안로 52 신관 7층',
    addressEn: '7F Modern Building, 52 Jagalchihaean-ro, Jung-gu, Busan',
    tel: '051-713-8000',
    description: '자갈치시장 신관 7층에 조성된 루프탑 전망대로, 대형 엘리베이터를 타고 올라가면 단차 없이 남항 바다와 영도대교 도개 행사, 용두산 부산타워를 360도로 감상할 수 있는 숨은 명소입니다.',
    descriptionKo: '자갈치시장 신관 7층에 조성된 루프탑 전망대로, 대형 엘리베이터를 타고 올라가면 단차 없이 남항 바다와 영도대교 도개 행사, 용두산 부산타워를 360도로 감상할 수 있는 숨은 명소입니다.',
    descriptionEn: 'Rooftop sky observatory on the 7th floor of Jagalchi Market modern building, featuring elevators, step-free wooden terraces, and panoramic harbor views.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80',
    latitude: 35.0969,
    longitude: 129.0308,
    accessibilityGrade: 'COMFORTABLE',
    accessibility: {
      wheelchair: true,
      stroller: true,
      elevator: true,
      accessibleRestroom: true,
      accessibleParking: true,
      stairs: false,
      steepSlope: false,
      restAreas: true,
      tactilePaving: true,
    },
    subwayLine: '1호선',
    transit: {
      subway: {
        stationId: '110',
        stationNameKo: '자갈치역 (1호선)',
        stationNameEn: 'Jagalchi Station (Line 1)',
        line: '1호선',
        exit: '10번 출구 엘리베이터',
        hasElevator: true,
        walkingDistanceMeters: 280,
        walkingTimeMinutes: 4,
        hasStairs: false,
        routeGuideKo: '1호선 자갈치역 10번 출구 엘리베이터 → 평지 보도 따라 신관 건물 진입 → 실내 엘리베이터 탑승하여 7층 루프탑 전망대 직통',
        routeGuideEn: 'Line 1 Jagalchi Stn Exit 10 elevator → flat walk to modern building → take indoor elevator to 7F Rooftop',
        steps: [
          {
            stepNumber: 1,
            title: '자갈치역 10번 출구 엘리베이터 이용',
            desc: '승강장에서 엘리베이터로 대합실을 거쳐 지상 인도로 나옵니다.',
            icon: '🛗',
          },
          {
            stepNumber: 2,
            title: '자갈치시장 신관 자동문 진입 (약 280m)',
            desc: '평탄한 보도를 따라 이동하여 턱 없는 자동문으로 본관 로비에 진입합니다.',
            icon: '🏢',
          },
          {
            stepNumber: 3,
            title: '7층 전망대 엘리베이터 탑승',
            desc: '중앙 승객용 엘리베이터를 타고 7층 루프탑 하늘공원으로 곧장 올라갑니다.',
            icon: '🌅',
          },
        ],
      },
      bus: {
        stopNameKo: '자갈치시장 정류장',
        stopNameEn: 'Jagalchi Market Stop',
        busNumbers: ['26번', '27번', '41번', '87번'],
        hasLowFloorBus: true,
        walkingTimeMinutes: 3,
        routeGuideKo: '정류장 하차 후 횡단보도를 지나 신관 1층 승강기로 루프탑 직결',
        routeGuideEn: 'Step-free level walk from bus stop to building elevators.',
      },
    },
    recommendationReasons: {
      wheelchair: {
        ko: '지하철역부터 건물 7층 루프탑 전망 데크까지 전 구간이 엘리베이터와 무단차로 직결됩니다.',
        en: 'Completely step-free from the subway station to the 7F rooftop deck via modern elevators.',
      },
      stroller: {
        ko: '복잡한 시장 골목을 피해 쾌적한 옥상 정원에서 영도 바다와 갈매기를 아이와 함께 조망할 수 있습니다.',
        en: 'A quiet, uncrowded garden terrace to safely enjoy port views with young children.',
      },
      luggage: {
        ko: '지하철 1호선 부산역에서 불과 3정거장이며, 건물 내 보관함이 있어 짐 보관이 편리합니다.',
        en: 'Only 3 stops from Busan Station with level access and lockers inside.',
      },
      senior: {
        ko: '탁 트인 남항 바다와 부산의 상징 영도대교를 벤치에 편히 앉아 시원한 바닷바람과 함께 감상할 수 있습니다.',
        en: 'Take in panoramic views of Yeongdo Bridge and ships while relaxing on shaded observation benches.',
      },
    },
    bestFor: ['wheelchair', 'stroller', 'luggage', 'senior'],
    experienceTraits: ['first', 'revisit'],
    companionTraits: ['family', 'couple', 'friends', 'solo'],
    criteriaTags: {
      userTypes: ['wheelchair', 'stroller', 'luggage', 'senior'],
      experiences: ['first', 'revisit'],
      companions: ['family', 'couple', 'friends', 'solo'],
    },
  },
  {
    id: 'spot-bupyeong-market',
    contentId: 'tour-bupyeong-104',
    contentid: 'tour-bupyeong-104',
    name: '부평 깡통 국제 시장',
    nameKo: '부평 깡통 국제 시장',
    nameEn: 'Bupyeong Kkangtong & Gukje Traditional Market',
    categoryKo: '쇼핑/전통시장',
    categoryEn: 'Traditional Market/Food',
    districtKo: '중구',
    districtEn: 'Jung-gu',
    address: '부산광역시 중구 부평1길 48',
    addressKo: '부산광역시 중구 부평1길 48',
    addressEn: '48 Bupyeong 1-gil, Jung-gu, Busan',
    tel: '051-243-1128',
    description: '부산의 역사와 정취가 살아 숨 쉬는 대표 전통시장으로, 아케이드 지붕이 완비되어 비가 와도 쾌적하며 주요 통로가 평탄하게 포장되어 휠체어와 유아차로 부산의 명물 먹거리를 즐길 수 있습니다.',
    descriptionKo: '부산의 역사와 정취가 살아 숨 쉬는 대표 전통시장으로, 아케이드 지붕이 완비되어 비가 와도 쾌적하며 주요 통로가 평탄하게 포장되어 휠체어와 유아차로 부산의 명물 먹거리를 즐길 수 있습니다.',
    descriptionEn: 'Busan historic covered traditional market famous for street delicacies, featuring flat paved covered arcades for accessible shopping.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80',
    latitude: 35.1018,
    longitude: 129.0264,
    accessibilityGrade: 'COMFORTABLE',
    accessibility: {
      wheelchair: true,
      stroller: true,
      elevator: true,
      accessibleRestroom: true,
      accessibleParking: true,
      stairs: false,
      steepSlope: false,
      restAreas: true,
      tactilePaving: true,
    },
    subwayLine: '1호선',
    transit: {
      subway: {
        stationId: '110',
        stationNameKo: '자갈치역 (1호선)',
        stationNameEn: 'Jagalchi Station (Line 1)',
        line: '1호선',
        exit: '7번 출구 엘리베이터',
        hasElevator: true,
        walkingDistanceMeters: 450,
        walkingTimeMinutes: 6,
        hasStairs: false,
        routeGuideKo: '1호선 자갈치역 7번 출구 엘리베이터 → 평탄한 비프광장 보행자 도로 직진 → 부평 깡통시장 아케이드 입구 진입',
        routeGuideEn: 'Line 1 Jagalchi Stn Exit 7 elevator → flat pedestrian path via BIFF Square → covered market entrance',
        steps: [
          {
            stepNumber: 1,
            title: '자갈치역 7번 출구 엘리베이터 이용',
            desc: '승강장 엘리베이터로 대합실을 거쳐 지상 BIFF 광장 방면으로 나옵니다.',
            icon: '🛗',
          },
          {
            stepNumber: 2,
            title: '평탄 보행로 이동 (약 450m)',
            desc: '턱 없는 보행자 전용도로를 따라 부평 깡통시장 입구로 이동합니다.',
            icon: '🚶',
          },
          {
            stepNumber: 3,
            title: '시장 아케이드 내부 진입',
            desc: '지붕 덮개가 완비된 평탄 바닥 통로에서 맛있는 어묵과 간식을 즐깁니다.',
            icon: '🍢',
          },
        ],
      },
      bus: {
        stopNameKo: '부평시장 정류장',
        stopNameEn: 'Bupyeong Market Stop',
        busNumbers: ['40번', '81번', '126번', '135번'],
        hasLowFloorBus: true,
        walkingTimeMinutes: 2,
        routeGuideKo: '정류장 하차 후 턱 없는 골목 입구로 시장 아케이드 직결',
        routeGuideEn: 'Step-free level walk from bus stop into the covered market aisles.',
      },
    },
    recommendationReasons: {
      wheelchair: {
        ko: '주요 중앙 아케이드 통로가 평탄하게 재포장되어 휠체어 주행이 편안하며 공영주차장 장애인 화장실이 가깝습니다.',
        en: 'Repaved smooth main arcade walkways with accessible restrooms near the public parking building.',
      },
      stroller: {
        ko: '날씨에 상관없이 아케이드 지붕 아래에서 유아차를 밀며 부산 어묵, 비빔당면 등 다양한 미식을 경험할 수 있습니다.',
        en: 'All-weather covered shopping aisles let families explore local culinary delights comfortably.',
      },
      luggage: {
        ko: '시장 고객지원센터에 물품보관함이 구비되어 있어 짐을 보관하고 홀가분하게 쇼핑할 수 있습니다.',
        en: 'Storage lockers at the market customer service center allow hands-free dining and shopping.',
      },
      senior: {
        ko: '정겨운 시장 풍경과 부산 고유의 먹거리를 단차 없이 편안하게 구경하고 식사할 수 있습니다.',
        en: 'Rich historical charm and traditional comfort food reachable without step obstacles.',
      },
    },
    bestFor: ['wheelchair', 'stroller', 'luggage', 'senior'],
    experienceTraits: ['first', 'revisit'],
    companionTraits: ['friends', 'family', 'couple', 'solo'],
    criteriaTags: {
      userTypes: ['wheelchair', 'stroller', 'luggage', 'senior'],
      experiences: ['first', 'revisit'],
      companions: ['friends', 'family', 'couple', 'solo'],
    },
  },
  {
    id: 'spot-city-tour-bus',
    contentId: 'tour-citybus-105',
    contentid: 'tour-citybus-105',
    name: '부산 시티투어버스 (BUTI 저상 리프트 버스)',
    nameKo: '부산 시티투어버스 (BUTI 저상 리프트 버스)',
    nameEn: 'Busan City Tour Bus (Accessible Low-Floor / Lift)',
    categoryKo: '교통/투어',
    categoryEn: 'Tour/Transit',
    districtKo: '동구',
    districtEn: 'Dong-gu',
    address: '부산광역시 동구 중앙대로 206 부산역 광장 승강장',
    addressKo: '부산광역시 동구 중앙대로 206 부산역 광장 승강장',
    addressEn: '206 Jungang-daero, Dong-gu, Busan (Busan Station Plaza)',
    tel: '051-466-2244',
    description: '부산역 광장에서 탑승하여 해운대, 광안리, 태종대 등 부산의 핵심 명소를 환승하며 여행할 수 있는 대표 투어버스로, 휠체어 휠체어 리프트 및 저상 버스가 정규 운행되어 계단 없이 부산 전체를 투어할 수 있습니다.',
    descriptionKo: '부산역 광장에서 탑승하여 해운대, 광안리, 태종대 등 부산의 핵심 명소를 환승하며 여행할 수 있는 대표 투어버스로, 휠체어 휠체어 리프트 및 저상 버스가 정규 운행되어 계단 없이 부산 전체를 투어할 수 있습니다.',
    descriptionEn: 'Official tourist loop bus starting from Busan Station Plaza, offering wheelchair lift equipped vehicles covering Busan major bridges and coastal attractions.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
    latitude: 35.1152,
    longitude: 129.0422,
    accessibilityGrade: 'COMFORTABLE',
    accessibility: {
      wheelchair: true,
      stroller: true,
      elevator: true,
      accessibleRestroom: true,
      accessibleParking: true,
      stairs: false,
      steepSlope: false,
      restAreas: true,
      tactilePaving: true,
    },
    subwayLine: '1호선 / KTX',
    transit: {
      subway: {
        stationId: '113',
        stationNameKo: '부산역 (1호선 / KTX)',
        stationNameEn: 'Busan Station (Line 1 / KTX)',
        line: '1호선',
        exit: '6번 출구 엘리베이터 (광장 직통)',
        hasElevator: true,
        walkingDistanceMeters: 60,
        walkingTimeMinutes: 1,
        hasStairs: false,
        routeGuideKo: '1호선 부산역 6번 출구 또는 KTX 부산역 2층 3번 출구 평지 무빙워크 → 부산역 광장 시티투어버스 전용 승강장 직결',
        routeGuideEn: 'Line 1 Busan Stn Exit 6 elevator or KTX Busan Station Exit 3 flat walkway → Directly at City Tour Bus boarding bay',
        steps: [
          {
            stepNumber: 1,
            title: '부산역 도착 (지하철 1호선 / KTX)',
            desc: '승강장 엘리베이터를 이용해 부산역 야외 광장으로 나옵니다.',
            icon: '🚆',
          },
          {
            stepNumber: 2,
            title: '시티투어버스 전용 승강장 이동 (약 60m)',
            desc: '부산역 광장 분수대 옆 단차가 전혀 없는 시티투어 안내소로 이동합니다.',
            icon: '🚏',
          },
          {
            stepNumber: 3,
            title: '저상 휠체어 리프트 탑승',
            desc: '기사님 안내에 따라 슬로프/리프트를 통해 안전하게 탑승하여 파노라마 투어를 즐깁니다.',
            icon: '🚌',
          },
        ],
      },
      bus: {
        stopNameKo: '부산역 시티투어버스 정류장',
        stopNameEn: 'Busan Stn City Tour Stop',
        busNumbers: ['레드라인(해운대)', '그린라인(오륙도)', '블루라인(기장)'],
        hasLowFloorBus: true,
        walkingTimeMinutes: 1,
        routeGuideKo: '부산역 광장 내 단차 없는 수평 보행로로 탑승구 직통',
        routeGuideEn: 'Direct step-free connection across the level station plaza.',
      },
    },
    recommendationReasons: {
      wheelchair: {
        ko: '전동 휠체어 리프트 및 고정 벨트가 완비되어 휠체어에서 내리지 않고 광안대교와 바다 풍경을 편안하게 즐길 수 있습니다.',
        en: 'Equipped with powered wheelchair lifts and safety belts for uninterrupted panoramic sightseeing.',
      },
      stroller: {
        ko: '유아차를 접지 않고 탑승할 수 있는 넓은 저상 공간이 마련되어 아이와 함께 도시 전체를 관람하기 좋습니다.',
        en: 'Low-floor boarding with ample designated floor space for strollers without folding.',
      },
      luggage: {
        ko: '부산역 KTX 도착 후 바로 탑승할 수 있으며 차량 내 수하물 적재 공간이 넉넉합니다.',
        en: 'Board directly from Busan KTX station with dedicated onboard luggage storage.',
      },
      senior: {
        ko: '걷는 피로 없이 버스 좌석에 편히 앉아 웅장한 광안대교와 부산항 바다를 시원하게 일주할 수 있습니다.',
        en: 'Zero walking effort while enjoying scenic loops across Gwangan Bridge and ocean ports.',
      },
    },
    bestFor: ['wheelchair', 'stroller', 'luggage', 'senior'],
    experienceTraits: ['first', 'revisit'],
    companionTraits: ['family', 'couple', 'friends', 'solo'],
    criteriaTags: {
      userTypes: ['wheelchair', 'stroller', 'luggage', 'senior'],
      experiences: ['first', 'revisit'],
      companions: ['family', 'couple', 'friends', 'solo'],
    },
  },
  {
    id: 'spot-blueline',
    contentId: '2684877',
    contentid: '2684877',
    name: '해운대 블루라인파크 (해변열차)',
    nameKo: '해운대 & 해변열차',
    nameEn: 'Haeundae & Beach Train',
    categoryKo: '해변/교통',
    categoryEn: 'Beach/Rail',
    districtKo: '해운대구',
    districtEn: 'Haeundae-gu',
    address: '부산광역시 해운대구 달맞이길62번길 13 (미포정거장)',
    addressKo: '부산광역시 해운대구 달맞이길62번길 13 (미포정거장)',
    addressEn: '13 Dalmaji-gil 62beon-gil, Haeundae-gu, Busan',
    tel: '051-701-5548',
    description: '해운대 미포에서 청사포를 거쳐 송정까지 이어지는 해안 절경 철도로, 전 정거장에 휠체어 휠체어 리프트와 무단차 데크로드가 완비되어 편안하게 바다를 조망할 수 있습니다.',
    descriptionKo: '해운대 미포에서 청사포를 거쳐 송정까지 이어지는 해안 절경 철도로, 전 정거장에 휠체어 휠체어 리프트와 무단차 데크로드가 완비되어 편안하게 바다를 조망할 수 있습니다.',
    descriptionEn: 'Scenic coastal train between Haeundae Mipo and Songjeong, equipped with wheelchair lifts and level boarding platforms.',
    image: 'https://tong.visitkorea.or.kr/cms/resource/77/2684877_image2_1.jpg',
    latitude: 35.1585,
    longitude: 129.1728,
    accessibilityGrade: 'COMFORTABLE',
    accessibility: {
      wheelchair: true,
      stroller: true,
      elevator: true,
      accessibleRestroom: true,
      accessibleParking: true,
      stairs: false,
      steepSlope: false,
      restAreas: true,
      tactilePaving: true,
    },
    subwayLine: '2호선 (중동역/해운대역 연계)',
    transit: {
      subway: {
        stationId: '202',
        stationNameKo: '중동역 (2호선)',
        stationNameEn: 'Jungdong Station (Line 2)',
        line: '2호선',
        exit: '7번 출구 엘리베이터',
        hasElevator: true,
        walkingDistanceMeters: 800,
        walkingTimeMinutes: 12,
        hasStairs: false,
        routeGuideKo: '중동역 7번 출구 엘리베이터 → 평탄 보도 따라 미포교차로 방면 도보 이동',
        routeGuideEn: 'Line 2 Jungdong Stn Exit 7 elevator → flat walkway toward Mipo Crossing',
      },
      bus: {
        stopNameKo: '미포문탠로드입구',
        stopNameEn: 'Mipo Moontan Road Entrance',
        busNumbers: ['100번', '141번', '200번'],
        hasLowFloorBus: true,
        walkingTimeMinutes: 5,
        routeGuideKo: '정류장 하차 후 완만한 내리막 보도를 따라 미포정거장 매표소로 이동',
        routeGuideEn: 'Follow gentle downhill walkway towards Mipo Station ticket office.',
      },
    },
    recommendationReasons: {
      wheelchair: {
        ko: '해변열차 객차 내 전동 휠체어 고정석과 탑승 리프트가 운영되어 안전하게 바다를 감상할 수 있습니다.',
        en: 'Designated wheelchair tie-downs and mechanical boarding lifts provide seamless ocean views.',
      },
      stroller: {
        ko: '미포정거장 전 구역이 평탄 데크로 연결되어 유아차를 접지 않고 쾌적하게 이동할 수 있습니다.',
        en: 'Step-free timber decks link stations allowing continuous travel without folding strollers.',
      },
      luggage: {
        ko: '정거장 내 캐리어 보관함이 갖추어져 있어 짐을 보관하고 가볍게 열차를 탑승할 수 있습니다.',
        en: 'Luggage storage lockers available at the station concourse.',
      },
      senior: {
        ko: '걷는 피로 없이 편안한 좌석에 앉아 파노라마 창밖으로 푸른 동해 바다를 만끽할 수 있습니다.',
        en: 'Relaxing seated panoramic ocean journey without any strenuous walking.',
      },
    },
    bestFor: ['wheelchair', 'stroller', 'luggage', 'senior'],
  },
  {
    id: 'spot-gwanganli',
    contentId: '126082',
    contentid: '126082',
    name: '광안리 해수욕장 & 해변 산책로',
    nameKo: '광안리',
    nameEn: 'Gwangalli Beach',
    categoryKo: '해변/자연',
    categoryEn: 'Beach/Nature',
    districtKo: '수영구',
    districtEn: 'Suyeong-gu',
    address: '부산광역시 수영구 광안해변로 219',
    addressKo: '부산광역시 수영구 광안해변로 219',
    addressEn: '219 Gwanganhaebyeon-ro, Suyeong-gu, Busan',
    tel: '051-610-4841',
    description: '광안대교를 가장 아름답게 조망할 수 있는 해변으로, 해안도로를 따라 단차 없는 광폭 보행로와 해변 테라스 쉼터가 이어져 있습니다.',
    descriptionKo: '광안대교를 가장 아름답게 조망할 수 있는 해변으로, 해안도로를 따라 단차 없는 광폭 보행로와 해변 테라스 쉼터가 이어져 있습니다.',
    descriptionEn: 'Famous beachfront offering panoramic views of Gwangandaegyo Bridge with wide, step-free coastal promenade.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80',
    latitude: 35.1532,
    longitude: 129.1186,
    accessibilityGrade: 'COMFORTABLE',
    accessibility: {
      wheelchair: true,
      stroller: true,
      elevator: true,
      accessibleRestroom: true,
      accessibleParking: true,
      stairs: false,
      steepSlope: false,
      restAreas: true,
      tactilePaving: true,
    },
    subwayLine: '2호선 (광안역/금련산역)',
    transit: {
      subway: {
        stationId: '209',
        stationNameKo: '광안역 (2호선)',
        stationNameEn: 'Gwangan Station (Line 2)',
        line: '2호선',
        exit: '3번 또는 5번 출구 엘리베이터',
        hasElevator: true,
        walkingDistanceMeters: 700,
        walkingTimeMinutes: 10,
        hasStairs: false,
        routeGuideKo: '광안역 엘리베이터 → 평탄한 광안로 보행로 따라 해변 방면 직진 (턱 낮춤 완료)',
        routeGuideEn: 'Line 2 Gwangan Stn elevator → straight along flat Gwangan-ro with lowered curb cuts.',
      },
      bus: {
        stopNameKo: '광안리해수욕장',
        stopNameEn: 'Gwangalli Beach',
        busNumbers: ['41번', '42번', '62번', '83번'],
        hasLowFloorBus: true,
        walkingTimeMinutes: 2,
        routeGuideKo: '버스정류장 하차 후 횡단보도 턱 낮춤 구역을 통해 해변 산책로로 직결',
        routeGuideEn: 'Direct step-free connection via level crosswalks to beach promenade.',
      },
    },
    recommendationReasons: {
      wheelchair: {
        ko: '해안도로 전 구간이 매끄러운 평탄 보도블록으로 정비되어 휠체어 이동이 수월합니다.',
        en: 'Completely flat and wide promenade suitable for smooth wheelchair gliding.',
      },
      stroller: {
        ko: '보도가 넓고 안전 펜스가 설치되어 있어 유아차와 함께 안심하고 산책할 수 있습니다.',
        en: 'Wide sidewalks with safety railings allow pleasant strolling with infants.',
      },
      luggage: {
        ko: '도로 턱이 낮추어져 있어 캐리어를 끌며 이동하기 편리하고 주변 카페 접근성이 우수합니다.',
        en: 'Low curbs facilitate easy rolling of suitcases with abundant roadside cafes.',
      },
      senior: {
        ko: '해변 곳곳에 그늘 쉼터와 전망 벤치가 넉넉하여 여유롭게 휴식할 수 있습니다.',
        en: 'Plenty of shaded pavilions and ocean benches for comfortable resting.',
      },
    },
    bestFor: ['wheelchair', 'stroller', 'luggage', 'senior'],
  },
  {
    id: 'spot-gamcheon',
    contentId: '1350616',
    contentid: '1350616',
    name: '감천문화마을',
    nameKo: '감천문화마을',
    nameEn: 'Gamcheon Culture Village',
    categoryKo: '문화/마을',
    categoryEn: 'Culture/Village',
    districtKo: '사하구',
    districtEn: 'Saha-gu',
    address: '부산광역시 사하구 감내2로 203',
    addressKo: '부산광역시 사하구 감내2로 203',
    addressEn: '203 Gamnae 2-ro, Saha-gu, Busan',
    tel: '051-204-1444',
    description: '알록달록한 계단식 주택과 예술 작품이 어우러진 한국의 마추픽추로, 마을 안내센터에서 진입하는 상부 큰길은 단차 없이 포토존을 감상할 수 있는 완만 추천 동선이 마련되어 있습니다.',
    descriptionKo: '알록달록한 계단식 주택과 예술 작품이 어우러진 한국의 마추픽추로, 마을 안내센터에서 진입하는 상부 큰길은 단차 없이 포토존을 감상할 수 있는 완만 추천 동선이 마련되어 있습니다.',
    descriptionEn: 'Busan iconic colorful hillside art village featuring accessible gentle upper walking trails from the tourist information center.',
    image: 'https://tong.visitkorea.or.kr/cms/resource/16/1350616_image2_1.jpg',
    latitude: 35.0975,
    longitude: 129.0106,
    accessibilityGrade: 'COMFORTABLE',
    accessibility: {
      wheelchair: true,
      stroller: true,
      elevator: true,
      accessibleRestroom: true,
      accessibleParking: true,
      stairs: false,
      steepSlope: false,
      restAreas: true,
      tactilePaving: true,
    },
    subwayLine: '1호선 (토성역 연계)',
    transit: {
      subway: {
        stationId: '111',
        stationNameKo: '토성역 (1호선)',
        stationNameEn: 'Toseong Station (Line 1)',
        line: '1호선',
        exit: '6번 출구 엘리베이터 (부산대병원 앞 버스환승)',
        hasElevator: true,
        walkingDistanceMeters: 50,
        walkingTimeMinutes: 1,
        hasStairs: false,
        routeGuideKo: '1호선 토성역 6번 출구 엘리베이터 → 마을버스 승차장(사하1-1, 서구2) 환승 → 감천문화마을 정류장 하차',
        routeGuideEn: 'Toseong Stn Exit 6 elevator → Transfer to local bus → Alight at Gamcheon Culture Village',
      },
      bus: {
        stopNameKo: '감천문화마을 정류장',
        stopNameEn: 'Gamcheon Culture Village Stop',
        busNumbers: ['사하1-1', '서구2', '서구2-2'],
        hasLowFloorBus: false,
        walkingTimeMinutes: 1,
        routeGuideKo: '정류장 바로 앞 마을 안내센터에서 완만 추천 동선 지도 수령 후 평탄 메인 로드로 진입',
        routeGuideEn: 'Receive gentle course map at tourist center and proceed on flat main road.',
      },
    },
    recommendationReasons: {
      wheelchair: {
        ko: '안내센터에서 시작하는 메인 메인스트리트는 계단 없이 완만하게 조성되어 포토존 관람이 가능합니다.',
        en: 'The main upper boulevard from the information center is step-free for pleasant viewing.',
      },
      stroller: {
        ko: '메인 관람로를 따라 카페와 포토존이 밀집되어 있어 유아차로 무리 없이 둘러볼 수 있습니다.',
        en: 'Abundant cafes and artistic photo points along the paved main street accommodate strollers.',
      },
      luggage: {
        ko: '안내센터에 물품보관소가 운영되어 무거운 짐을 맡기고 관람할 수 있습니다.',
        en: 'Luggage storage facility available at the visitor guidance center.',
      },
      senior: {
        ko: '골목 계단을 내려가지 않고 상부 평탄길 위주로 걸으며 탁 트인 마을 전경을 만끽할 수 있습니다.',
        en: 'Enjoy panoramic hillside views along the gentle upper trail without stair climbing.',
      },
    },
    bestFor: ['wheelchair', 'stroller', 'luggage', 'senior'],
  },
  {
    id: 'spot-biff',
    contentId: '2674675',
    contentid: '2674675',
    name: '비프광장 (BIFF 광장)',
    nameKo: '비프광장',
    nameEn: 'BIFF Square',
    categoryKo: '문화/거리',
    categoryEn: 'Culture/Street',
    districtKo: '중구',
    districtEn: 'Jung-gu',
    address: '부산광역시 중구 비프광장로 20',
    addressKo: '부산광역시 중구 비프광장로 20',
    addressEn: '20 BIFF gwangjang-ro, Jung-gu, Busan',
    tel: '051-240-4061',
    description: '부산국제영화제(BIFF)의 시작을 알린 문화 명소로 영화인 핸드프린팅 거리와 맛있는 길거리 음식이 모여 있으며, 차량 통행이 통제된 전 구간 무단차 보행자 전용거리입니다.',
    descriptionKo: '부산국제영화제(BIFF)의 시작을 알린 문화 명소로 영화인 핸드프린팅 거리와 맛있는 길거리 음식이 모여 있으며, 차량 통행이 통제된 전 구간 무단차 보행자 전용거리입니다.',
    descriptionEn: 'Historic movie plaza featuring cinema handprints and street food, set on fully pedestrian-only step-free flat streets.',
    image: 'https://tong.visitkorea.or.kr/cms/resource/54/2674654_image2_1.jpg',
    latitude: 35.0984,
    longitude: 129.0287,
    accessibilityGrade: 'COMFORTABLE',
    accessibility: {
      wheelchair: true,
      stroller: true,
      elevator: true,
      accessibleRestroom: true,
      accessibleParking: true,
      stairs: false,
      steepSlope: false,
      restAreas: true,
      tactilePaving: true,
    },
    subwayLine: '1호선 (자갈치역)',
    transit: {
      subway: {
        stationId: '110',
        stationNameKo: '자갈치역 (1호선)',
        stationNameEn: 'Jagalchi Station (Line 1)',
        line: '1호선',
        exit: '7번 출구 엘리베이터',
        hasElevator: true,
        walkingDistanceMeters: 120,
        walkingTimeMinutes: 2,
        hasStairs: false,
        routeGuideKo: '1호선 자갈치역 7번 출구 엘리베이터 → 횡단보도 턱 낮춤 구역 → 비프광장 보행자전용길 직결',
        routeGuideEn: 'Line 1 Jagalchi Stn Exit 7 elevator → level crosswalk → directly onto BIFF pedestrian zone',
      },
      bus: {
        stopNameKo: '남포동 정류장',
        stopNameEn: 'Nampo-dong Stop',
        busNumbers: ['8번', '15번', '17번', '26번', '27번', '87번'],
        hasLowFloorBus: true,
        walkingTimeMinutes: 3,
        routeGuideKo: '정류장 하차 후 평탄 보도를 따라 비프광장 입구로 진입',
        routeGuideEn: 'Flat walkway from bus stop directly to BIFF Square entrance.',
      },
    },
    recommendationReasons: {
      wheelchair: {
        ko: '보행자 전용거리로 턱이나 계단이 전혀 없어 휠체어 주행이 매우 쾌적합니다.',
        en: 'Zero curbs or stairs throughout the pedestrian area for seamless wheelchair access.',
      },
      stroller: {
        ko: '차가 다니지 않아 유아차와 함께 안전하게 거리 간식과 문화를 체험할 수 있습니다.',
        en: 'Vehicle-free zone ensures safe and relaxed exploration with baby strollers.',
      },
      luggage: {
        ko: '자갈치역 엘리베이터에서 단차 없이 바로 연결되어 캐리어를 끌기 매우 편리합니다.',
        en: 'Direct level link from subway elevator makes luggage pulling effortless.',
      },
      senior: {
        ko: '경사가 없는 완전 평지이며 인근 극장과 역사에 쉼터와 편의시설이 잘 갖추어져 있습니다.',
        en: 'Completely level terrain with nearby theater rest areas and amenities.',
      },
    },
    bestFor: ['wheelchair', 'stroller', 'luggage', 'senior'],
  },
];

// 모든 관광 장소에 대해 3가지 기준(여행자 유형, 부산 여행 경험, 함께하는 여행) 매칭 태그를 자동으로 부여하여 export
export const BARRIER_FREE_PLACES: TouristPlace[] = RAW_BARRIER_FREE_PLACES.map(buildTouristPlaceWithCriteria);

// 2. 맞춤형 여행 코스 데이터 (해변가 코스, 부산 문화 코스 2개 정의)
export const BARRIER_FREE_COURSES: TravelCourse[] = [
  {
    id: 'course-haeundae-ocean',
    title: '해변가 코스',
    titleKo: '🌊 해변가 코스',
    titleEn: 'Coastal Scenic Course',
    tagKo: '오션뷰 & 무단차 해변 산책',
    tagEn: 'Ocean View & Step-Free Coastal Walk',
    description: '해운대 해변열차에서 송정 해수욕장, 신세계 센텀시티, 광안리로 이어지는 부산 대표 해변가 무장애 여행 코스입니다.',
    descriptionKo: '해운대 해변열차에서 송정 해수욕장, 신세계 센텀시티, 광안리로 이어지는 부산 대표 해변가 무장애 여행 코스입니다.',
    descriptionEn: 'Busan scenic coastal barrier-free itinerary connecting Haeundae Beach Train, Songjeong Beach, Shinsegae Centum City, and Gwangalli.',
    image: 'https://tong.visitkorea.or.kr/cms/resource/77/2684877_image2_1.jpg',
    placeIds: ['spot-blueline', 'spot-songjeong', 'spot-103', 'spot-111'],
    places: [
      {
        nameKo: '해운대 & 해변열차',
        nameEn: 'Haeundae & Beach Train',
        spotId: 'spot-blueline',
        contentId: '2684877',
        noteKo: '휠체어 탑승 가능 해변열차와 미포~송정 해안 무단차 데크로드',
        noteEn: 'Wheelchair-accessible beach train & step-free coastal boardwalk',
      },
      {
        nameKo: '송정 해수욕장',
        nameEn: 'Songjeong Beach',
        spotId: 'spot-songjeong',
        contentId: '126080',
        noteKo: '완만한 백사장 산책로와 죽도공원 무단차 데크로드',
        noteEn: 'Gentle flat beach boardwalk and Jukdo Park step-free deck',
      },
      {
        nameKo: '신세계 센텀시티',
        nameEn: 'Shinsegae Centum City',
        spotId: 'spot-103',
        contentId: '126084',
        noteKo: '센텀시티역 지하 직결 및 전 층 대형 승강기 완비',
        noteEn: 'Direct underground metro access & elevators on all floors',
      },
      {
        nameKo: '광안리',
        nameEn: 'Gwangalli Beach',
        spotId: 'spot-111',
        contentId: '126082',
        noteKo: '광안대교 오션뷰를 따라 단차 없이 이어지는 해변 테라스 산책로',
        noteEn: 'Wide step-free beachfront promenade facing Gwangan Bridge',
      },
    ],
    duration: '약 4시간',
    durationKo: '약 4시간',
    durationEn: 'Approx. 4 hours',
    distance: '약 18.5km',
    distanceKm: 18.5,
    distanceTextKo: '약 18.5km (지하철·해변열차 연계)',
    distanceTextEn: 'Approx. 18.5km (Transit & Train)',
    accessibilityLevel: 'COMFORTABLE',
    difficulty: 'COMFORTABLE',
    difficultyTextKo: '🟢 편안한 이동',
    difficultyTextEn: '🟢 Comfortable',
    recommendationReasons: {
      wheelchair: [
        '해변열차 전용 리프트와 고정석이 갖추어져 있어 휠체어로 바다를 감상하기 가장 우수합니다.',
        '송정 백사장 및 광안리 해변 산책로 전 구간이 단차 없는 매끄러운 목재 데크로 조성되어 있습니다.',
        '센텀시티역과 신세계 센텀시티 전 층이 대형 승강기로 직통 연결되어 이동이 쾌적합니다.',
      ],
      stroller: [
        '미포정거장과 송정, 광안리 해변까지 턱이 없는 넓은 보행로로 유아차 주행이 부드럽습니다.',
        '신세계 센텀시티와 해운대 주요 거점에 쾌적한 아기쉼터 및 수유실이 완비되어 있습니다.',
        '해변을 따라 차량이 진입하지 않는 전용 보행 테라스가 안전하게 확보되어 있습니다.',
      ],
      luggage: [
        '지하철 2호선 센텀시티역, 해운대역 등 대중교통 환승 엘리베이터가 잘 갖추어져 있습니다.',
        '각 관광지 거점마다 캐리어 무인 보관함이 있어 짐 보관 후 가볍게 여행할 수 있습니다.',
        '평탄한 포장 인도가 연속되어 캐리어를 끌고 이동하기에 최적의 동선입니다.',
      ],
      senior: [
        '해변열차에 편안히 앉아 이동하므로 걷는 피로 없이 부산 대표 오션뷰를 만끽할 수 있습니다.',
        '송정과 광안리 해변가에 그늘 쉼터와 등받이 벤치가 풍부하여 언제든 쉬어갈 수 있습니다.',
        '급경사나 험한 계단 없이 완만한 평지로만 연결되어 무릎 부담이 적습니다.',
      ],
    },
    accessibilityBadges: [
      { textKo: '전 구간 무단차 보행', textEn: 'Zero stairs whole route', type: 'positive', icon: '🟢' },
      { textKo: '해변열차 리프트 완비', textEn: 'Beach train lift', type: 'positive', icon: '🚃' },
      { textKo: '지하철 승강기 직결', textEn: 'Metro elevator connected', type: 'positive', icon: '🛗' },
    ],
    baseScoreWeights: {
      wheelchair: 98,
      stroller: 96,
      luggage: 94,
      senior: 96,
    },
  },
  {
    id: 'course-busan-culture',
    title: '부산 문화 코스',
    titleKo: '🎨 부산 문화 코스',
    titleEn: 'Busan Culture & Heritage Course',
    tagKo: '원도심 역사와 거리 문화 & 평탄 동선',
    tagEn: 'History, Culture & Step-Free Market Walk',
    description: '감천문화마을에서 자갈치 시장, 활기찬 국제시장과 비프광장으로 이어지는 부산 원도심 문화 탐방 무장애 코스입니다.',
    descriptionKo: '감천문화마을에서 자갈치 시장, 활기찬 국제시장과 비프광장으로 이어지는 부산 원도심 문화 탐방 무장애 코스입니다.',
    descriptionEn: 'Cultural walking course through Gamcheon Culture Village, Jagalchi Market, Gukje Market, and BIFF Square.',
    image: 'https://tong.visitkorea.or.kr/cms/resource/16/1350616_image2_1.jpg',
    placeIds: ['spot-gamcheon', 'spot-107', 'spot-bupyeong-market', 'spot-biff'],
    places: [
      {
        nameKo: '감천문화마을',
        nameEn: 'Gamcheon Culture Village',
        spotId: 'spot-gamcheon',
        contentId: '1350616',
        noteKo: '마을 안내센터 완만 추천 관람로 및 파노라마 포토존',
        noteEn: 'Gentle access route and scenic viewpoints from visitor center',
      },
      {
        nameKo: '자갈치 시장',
        nameEn: 'Jagalchi Market',
        spotId: 'spot-107',
        contentId: '126087',
        noteKo: '현대화 건물 전 층 승강기 및 유라리광장 해안 수변 데크로드',
        noteEn: 'Modern facility with full elevator access and waterfront wooden deck',
      },
      {
        nameKo: '국제시장',
        nameEn: 'Gukje Market',
        spotId: 'spot-bupyeong-market',
        contentId: '1878218',
        noteKo: '비 가림 아케이드 지붕과 턱 없는 시장 골목 평탄 보행',
        noteEn: 'All-weather arcade canopy with step-free pavement through bustling alleys',
      },
      {
        nameKo: '비프광장',
        nameEn: 'BIFF Square',
        spotId: 'spot-biff',
        contentId: '2674675',
        noteKo: '차 없는 평탄 보행자 전용거리 및 자갈치역 7번 출구 평지 직결',
        noteEn: 'Pedestrian-only flat street with direct step-free link from Jagalchi Stn Exit 7',
      },
    ],
    duration: '약 3.5시간',
    durationKo: '약 3.5시간',
    durationEn: 'Approx. 3.5 hours',
    distance: '약 8.2km',
    distanceKm: 8.2,
    distanceTextKo: '약 8.2km (지하철 1호선 연계)',
    distanceTextEn: 'Approx. 8.2km (Line 1 Transit)',
    accessibilityLevel: 'COMFORTABLE',
    difficulty: 'COMFORTABLE',
    difficultyTextKo: '🟢 편안한 이동',
    difficultyTextEn: '🟢 Comfortable',
    recommendationReasons: {
      wheelchair: [
        '자갈치시장 건물 전 층에 대형 승강기와 장애인 전용 화장실이 완비되어 있습니다.',
        '국제시장과 비프광장은 차가 다니지 않는 평탄한 보행로로 휠체어 주행이 매끄럽습니다.',
        '자갈치역 7번 출구 엘리베이터에서 단차 없는 횡단보도를 통해 광장으로 직결됩니다.',
      ],
      stroller: [
        '비프광장과 자갈치 유라리광장은 보행자 전용 공간이라 아이와 함께 안전하게 산책할 수 있습니다.',
        '국제시장 아케이드 지붕 덕분에 날씨에 구애받지 않고 쾌적한 쇼핑과 관람이 가능합니다.',
        '각 거점마다 화장실과 휴식 공간이 잘 정비되어 유아차 동반 여행에 편리합니다.',
      ],
      luggage: [
        '지하철 1호선 자갈치역과 남포역에 대형 물품보관함이 넉넉하게 운영됩니다.',
        '인도 턱 낮춤 공사가 완벽하게 되어 있어 캐리어를 끌며 이동하기 수월합니다.',
        '자갈치시장, 국제시장, 비프광장이 모두 도보 5분 반경에 밀집되어 있어 동선이 짧습니다.',
      ],
      senior: [
        '도보 이동 거리가 짧고 평탄하여 관절에 무리 없이 원도심의 정취를 느낄 수 있습니다.',
        '자갈치 수변공원 데크와 비프광장에 앉아서 쉴 수 있는 벤치가 다수 마련되어 있습니다.',
        '볼거리와 먹거리가 인접해 있어 천천히 여유를 즐기며 둘러보기 좋습니다.',
      ],
    },
    accessibilityBadges: [
      { textKo: '보행자 전용 평탄 거리', textEn: 'Pedestrian-only flat street', type: 'positive', icon: '🟢' },
      { textKo: '전 층 엘리베이터 연계', textEn: 'Elevator connected', type: 'positive', icon: '🛗' },
      { textKo: '비 가림 아케이드', textEn: 'Covered arcade', type: 'positive', icon: '☂️' },
    ],
    baseScoreWeights: {
      wheelchair: 97,
      stroller: 96,
      luggage: 92,
      senior: 97,
    },
  },
];

