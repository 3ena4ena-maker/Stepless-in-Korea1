/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * STEP 2-2: Stepless 여행자 관점 큐레이션 데이터 (10개 대표 관광지)
 * 기존 TourAPI 공공데이터(사실 정보)를 바탕으로,
 * "무단차 여행자에게 왜 좋은가?", "어떤 여행자에게 적합한가?", "어떻게 이동하는가?"를
 * 전문 여행자 시점으로 해석한 독창적 큐레이션 콘텐츠입니다.
 */

export interface TourTravelerType {
  id: 'carrier' | 'wheelchair' | 'stroller' | 'senior' | 'rainy';
  icon: string;
  nameKo: string;
  nameEn: string;
  reasonKo: string;
  reasonEn: string;
}

export interface MovementStep {
  step: number;
  typeKo: string;
  typeEn: string;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  icon: string;
}

export interface NearbyLink {
  spotNameKo: string;
  spotNameEn: string;
  distanceTextKo: string;
  distanceTextEn: string;
  whyPairKo: string;
  whyPairEn: string;
}

export interface TourTravelGuideItem {
  contentid: string;
  spotTitleKo: string;
  spotTitleEn: string;
  oneLineSummaryKo: string;
  oneLineSummaryEn: string;
  whyRecommendTitleKo: string;
  whyRecommendTitleEn: string;
  whyRecommendDescKo: string;
  whyRecommendDescEn: string;
  steplessKeyValuesKo: string[];
  steplessKeyValuesEn: string[];
  recommendedTravelers: TourTravelerType[];
  movementSteps: MovementStep[];
  preVisitChecklistKo: string[];
  preVisitChecklistEn: string[];
  nearbyLinks: NearbyLink[];
}

export const TOUR_TRAVEL_GUIDE_DATA: Record<string, TourTravelGuideItem> = {
  'tour-101': {
    contentid: 'tour-101',
    spotTitleKo: '해운대 해수욕장 & 무장애 백사장 산책로',
    spotTitleEn: 'Haeundae Beach & Barrier-Free Boardwalk',
    oneLineSummaryKo: '바다 바로 앞까지 휠체어와 유모차로 다가갈 수 있는 부산의 대표 해양 힐링 명소',
    oneLineSummaryEn: 'Busan’s premier beach where wheelchairs and strollers can roll right to the water’s edge.',
    whyRecommendTitleKo: 'Stepless가 해운대해수욕장을 추천하는 이유',
    whyRecommendTitleEn: 'Why Stepless Recommends Haeundae Beach',
    whyRecommendDescKo: '백사장은 일반적으로 바퀴가 빠져 이동이 불가능하지만, 해운대는 이벤트광장에서 해변 모래사장 안쪽까지 단차 0cm의 단단한 무장애 목재 데크와 특수 매트가 설치되어 있습니다. 지하철 해운대역 5번 출구 엘리베이터에서 하차 후 해변까지 이어지는 350m 구남로 보행자 전용도로 전체가 완전한 평지여서 바퀴 달린 짐을 끈 여행자에게 가장 쾌적한 보행 환경을 제공합니다.',
    whyRecommendDescEn: 'While sand beaches usually trap wheels, Haeundae features solid zero-threshold wooden boardwalks and beach mats extending deep into the shoreline. From Line 2 Haeundae Station Exit 5 elevator, the entire 350m Gunam-ro pedestrian street is completely flat, offering an exceptionally smooth stroll.',
    steplessKeyValuesKo: [
      '해운대역 5번 EV ➔ 구남로 보행자 도로 ➔ 해변 데크까지 100% 무단차 연결',
      '백사장 전용 무장애 매트 설치로 바다 5m 앞까지 안전 접근',
      '해운대 관광안내소 수동/전동 휠체어 및 유모차 무료 대여',
      '이벤트광장 공중화장실 장애인 전용 자동문 화장실 완비'
    ],
    steplessKeyValuesEn: [
      '100% step-free route from Haeundae Stn Exit 5 EV via Gunam-ro to the beach deck',
      'Beach mats installed over sand allowing safe access within 5m of the ocean',
      'Free manual/electric wheelchair and stroller rentals at Info Center',
      'Handicap accessible restrooms with automatic doors at Event Plaza'
    ],
    recommendedTravelers: [
      {
        id: 'wheelchair',
        icon: '♿',
        nameKo: '휠체어 이용자',
        nameEn: 'Wheelchair Users',
        reasonKo: '백사장 진입 매트와 목재 데크로 바다 바로 앞까지 턱 없이 이동 가능',
        reasonEn: 'Zero-step beach mats and wooden decks allow direct access to the sea.'
      },
      {
        id: 'stroller',
        icon: '👶',
        nameKo: '유모차 동반 가족',
        nameEn: 'Families with Strollers',
        reasonKo: '차량이 없는 넓은 구남로 보행자 도로와 평탄 해변 테라스 산책로',
        reasonEn: 'Car-free wide pedestrian street and smooth seaside terraces.'
      },
      {
        id: 'carrier',
        icon: '🧳',
        nameKo: '캐리어 여행자',
        nameEn: 'Luggage Travelers',
        reasonKo: '지하철역부터 해변 주요 호텔까지 턱 없는 인도와 평탄 도로망',
        reasonEn: 'Flat sidewalks connecting station to major beachfront hotels.'
      },
      {
        id: 'senior',
        icon: '👵',
        nameKo: '보행약자/어르신',
        nameEn: 'Seniors & Gentle Walkers',
        reasonKo: '경사로가 거의 없고 곳곳에 휴식 벤치 및 전용 화장실 밀집',
        reasonEn: 'Virtually zero slope with plentiful resting benches and accessible toilets.'
      }
    ],
    movementSteps: [
      {
        step: 1,
        typeKo: '지하철 하차',
        typeEn: 'Subway Exit',
        titleKo: '해운대역(2호선) 5번 출구 엘리베이터',
        titleEn: 'Haeundae Station (Line 2) Exit 5 Elevator',
        descKo: '승강장에서 개찰구 통과 후 5번 출구 방면 엘리베이터를 탑승하여 지상으로 올라옵니다.',
        descEn: 'Pass the wide gate and take Exit 5 elevator directly to ground level.',
        icon: 'Train'
      },
      {
        step: 2,
        typeKo: '지상 평탄 보행',
        typeEn: 'Pedestrian Walk',
        titleKo: '구남로 보행자 전용도로 직진 (350m)',
        titleEn: 'Straight along Gunam-ro Pedestrian Street (350m)',
        descKo: '차량이 통제된 넓은 보행자 도로로 턱이나 계단 없이 바다 방향으로 일직선 도보 이동합니다.',
        descEn: 'Walk straight along the wide, car-free flat pedestrian street toward the beach.',
        icon: 'Footprints'
      },
      {
        step: 3,
        typeKo: '해변 데크 진입',
        typeEn: 'Boardwalk Access',
        titleKo: '해운대 이벤트광장 무장애 목재 데크',
        titleEn: 'Haeundae Event Plaza Barrier-Free Boardwalk',
        descKo: '광장 횡단보도를 건너면 해변 백사장으로 연결되는 완만한 목재 데크로드가 시작됩니다.',
        descEn: 'Cross the flat pedestrian crossing to enter the gentle wooden boardwalk.',
        icon: 'Compass'
      },
      {
        step: 4,
        typeKo: '목적지 도착',
        typeEn: 'Destination',
        titleKo: '백사장 매트 & 바다 조망 힐링',
        titleEn: 'Beach Mats & Oceanfront Relaxation',
        descKo: '백사장 위에 깔린 매트를 따라 바다 5미터 앞까지 안전하게 파도와 바다를 감상합니다.',
        descEn: 'Roll safely over the beach mats right up to the shoreline to enjoy ocean views.',
        icon: 'Sunset'
      }
    ],
    preVisitChecklistKo: [
      '여름 성수기(7~8월) 및 주말 저녁에는 구남로 인파가 많으므로 중앙 완만 동선 이용 권장',
      '백사장 매트 설치 구간 외의 모래사장은 바퀴가 빠질 수 있으므로 데크/매트 위 유지',
      '해운대 관광안내소(광장 인근)에서 휠체어/유모차 무료 대여 서비스 운영',
      '바닷바람이 강한 날에는 모자나 얇은 외투 준비'
    ],
    preVisitChecklistEn: [
      'Use central smooth paths during peak summer evenings when crowds gather on Gunam-ro.',
      'Stay on wooden decks and mats, as uncovered dry sand will trap wheels.',
      'Free wheelchair/stroller rentals are available at the Tourist Information Center near the plaza.',
      'Strong sea breezes may occur; bring a light windbreaker.'
    ],
    nearbyLinks: [
      {
        spotNameKo: '동백섬 데크 산책로 & 누리마루',
        spotNameEn: 'Dongbaekseom Boardwalk & Nurimaru',
        distanceTextKo: '도보 15분 (해변 서쪽 평탄 데크길 연결)',
        distanceTextEn: '15 mins walk via flat seaside wooden trail',
        whyPairKo: '해운대 백사장 서쪽 끝 웨스틴조선호텔 옆에서 동백섬 무장애 데크로드가 곧바로 이어져, 계단 없이 해운대 해변과 동백섬 해안 절경을 하루 완벽한 코스로 즐길 수 있습니다.',
        whyPairEn: 'Connects seamlessly from the west end of Haeundae Beach to Dongbaekseom wooden trail with zero stairs.'
      }
    ]
  },

  'tour-102': {
    contentid: 'tour-102',
    spotTitleKo: '광안리 해수욕장 & 민락수변공원',
    spotTitleEn: 'Gwangalli Beach & Millak Waterfront Park',
    oneLineSummaryKo: '광안대교 오션뷰와 토요일 드론쇼를 턱 없는 해안 보도로 여유롭게 즐기는 힐링 스팟',
    oneLineSummaryEn: 'Enjoy Gwangan Bridge vistas and Saturday drone shows along flat coastal promenades.',
    whyRecommendTitleKo: 'Stepless가 광안리해수욕장을 추천하는 이유',
    whyRecommendTitleEn: 'Why Stepless Recommends Gwangalli Beach',
    whyRecommendDescKo: '광안리 해변 도로는 차도와 보도의 단차가 완전히 분리된 평지 보행로로 조성되어 있습니다. 해변을 따라 펼쳐진 수많은 오션뷰 카페와 레스토랑의 1층이 턱 없는 개방형 구조를 갖추고 있어 휠체어와 유모차도 손쉽게 테라스 좌석을 이용할 수 있습니다. 특히 매주 토요일 밤 펼쳐지는 광안리 M 드론라이트쇼를 해변 전 구역의 평탄 보도 어디서나 편안하게 관람할 수 있습니다.',
    whyRecommendDescEn: 'Gwangalli features completely level sidewalks separated from road traffic. Many ground-floor cafes along the promenade offer step-free terrace seating for wheelchairs and strollers. The Saturday night Drone Light Show can be viewed from anywhere along the flat boardwalk.',
    steplessKeyValuesKo: [
      '광안역 1번 EV ➔ 광안로 600m 완만 일직선 보도로 해변 진입',
      '해변 전체 1.2km 구간 단차 없는 수평 테라스 보행로',
      '해변 중앙 및 만남의 광장에 장애인 전용 화장실 3곳 밀집',
      '광안리 관광안내소 수동 휠체어 무료 대여 지원'
    ],
    steplessKeyValuesEn: [
      'Direct 600m gentle straight walk from Gwangan Stn Exit 1 EV to the beach',
      '1.2km step-free seaside promenade stretching across the entire shore',
      '3 accessible handicap restrooms located at central beach and Meeting Plaza',
      'Free manual wheelchair rentals at Gwangalli Tourist Information Desk'
    ],
    recommendedTravelers: [
      {
        id: 'wheelchair',
        icon: '♿',
        nameKo: '휠체어 이용자',
        nameEn: 'Wheelchair Users',
        reasonKo: '1.2km 해안도로 전체가 완벽한 평지로 수동/전동 휠체어 주행 최적',
        reasonEn: 'Entire 1.2km beachfront is completely flat, ideal for manual/electric wheelchairs.'
      },
      {
        id: 'stroller',
        icon: '👶',
        nameKo: '유모차 동반 가족',
        nameEn: 'Families with Strollers',
        reasonKo: '바퀴 걸림 없는 넓은 보도와 바다를 보며 쉴 수 있는 턱 없는 1층 카페 다수',
        reasonEn: 'Wide smooth walkways and numerous step-free oceanview cafes.'
      },
      {
        id: 'carrier',
        icon: '🧳',
        nameKo: '캐리어 여행자',
        nameEn: 'Luggage Travelers',
        reasonKo: '광안역에서 해변 호텔까지 직선 도로로 짐을 끌고 이동하기 수월함',
        reasonEn: 'Straightforward flat streets connecting subway station to beach hotels.'
      },
      {
        id: 'senior',
        icon: '👵',
        nameKo: '보행약자/어르신',
        nameEn: 'Seniors & Gentle Walkers',
        reasonKo: '계단 오르내림 없이 광안대교 전경과 파도 소리를 즐기며 걷는 코스',
        reasonEn: 'Enjoy Gwangan Bridge ocean views without climbing a single step.'
      }
    ],
    movementSteps: [
      {
        step: 1,
        typeKo: '지하철 하차',
        typeEn: 'Subway Exit',
        titleKo: '광안역(2호선) 1번 출구 엘리베이터',
        titleEn: 'Gwangan Station (Line 2) Exit 1 Elevator',
        descKo: '1번 출구 엘리베이터를 이용해 지상으로 올라와 바다 방향(남쪽)으로 돌아섭니다.',
        descEn: 'Take Line 2 Gwangan Station Exit 1 elevator to ground level and head south toward the sea.',
        icon: 'Train'
      },
      {
        step: 2,
        typeKo: '직선 보도 이동',
        typeEn: 'Straight Walk',
        titleKo: '광안로 직선 완만 보도 (600m, 도보 약 8분)',
        titleEn: 'Gentle Gwangan-ro Straight Sidewalk (600m, ~8 mins)',
        descKo: '횡단보도 턱 낮춤 구역을 따라 광안리 해변 삼거리까지 일직선으로 이동합니다.',
        descEn: 'Follow the curb-ramped sidewalk straight down Gwangan-ro to the beach intersection.',
        icon: 'Footprints'
      },
      {
        step: 3,
        typeKo: '해변 보행로 진입',
        typeEn: 'Promenade Access',
        titleKo: '광안해변로 수평 보도 & 테라스',
        titleEn: 'Gwangan Seaside Level Promenade & Terraces',
        descKo: '해변에 도착하면 좌우로 끝없이 펼쳐진 단차 없는 보행로와 광안대교 조망이 시작됩니다.',
        descEn: 'Arrive at the beach to enjoy panoramic bridge vistas along the vast level promenade.',
        icon: 'Sunset'
      }
    ],
    preVisitChecklistKo: [
      '토요일 저녁 드론쇼 관람 시(하절기 20시/22시, 동절기 19시/21시) 인파가 집중되므로 30분 전 도착 권장',
      '광안역 1번 출구에서 해변까지는 도보 약 8분이 소요되므로 날씨가 더운 날에는 양산/모자 지참',
      '해변 횡단보도 건널 때 유도블록과 턱 낮춤 경사로 위치 확인'
    ],
    preVisitChecklistEn: [
      'Arrive 30 mins early for Saturday night Drone Shows (Summer: 20:00/22:00, Winter: 19:00/21:00).',
      'The walk from Gwangan Station takes ~8 minutes; carry an umbrella or hat on hot days.',
      'Check curb ramp locations when crossing seaside crosswalks.'
    ],
    nearbyLinks: [
      {
        spotNameKo: '민락더마켓 (복합문화공간)',
        spotNameEn: 'Millac The Market Complex',
        distanceTextKo: '도보 10분 (해변 동쪽 수변공원 방면 평지)',
        distanceTextEn: '10 mins flat walk toward east waterfront park',
        whyPairKo: '광안리 해변 동쪽 끝에 위치한 대형 실내 복합문화공간으로, 엘리베이터와 넓은 무단차 실내 복도에서 광안대교 오션뷰와 다양한 미식을 쾌적하게 즐길 수 있습니다.',
        whyPairEn: 'Modern indoor oceanfront cultural complex with full elevator access and wide flat halls.'
      }
    ]
  },

  'tour-103': {
    contentid: 'tour-103',
    spotTitleKo: 'BEXCO 벡스코 & 부산시립미술관',
    spotTitleEn: 'BEXCO & Busan Museum of Art',
    oneLineSummaryKo: '비가 와도 전 층 100% 무장애 BF 시설로 전시와 예술을 완벽하게 즐기는 복합 문화공간',
    oneLineSummaryEn: 'An all-weather 100% Barrier-Free cultural complex with seamless exhibition and art halls.',
    whyRecommendTitleKo: 'Stepless가 벡스코 & 시립미술관을 추천하는 이유',
    whyRecommendTitleEn: 'Why Stepless Recommends BEXCO & Museum of Art',
    whyRecommendDescKo: '국제 컨벤션 센터인 벡스코와 부산시립미술관은 전 구역이 공공 BF(Barrier-Free) 최우수 설계를 갖추고 있습니다. 실내외 모든 경사로의 기울기가 1/18 이하로 매우 완만하며, 12대의 대형 승강기가 전 층을 연결합니다. 지하철 벡스코역 7번 출구 엘리베이터에서 하차하면 바로 야외 광장과 전시장 무단차 주출입구로 120m 안에 직결되어 날씨에 상관없이 가장 안전하고 쾌적하게 문화생활을 즐길 수 있습니다.',
    whyRecommendDescEn: 'BEXCO and Busan Museum of Art boast the highest Barrier-Free (BF) design standards. All slopes are under 1/18 incline, and 12 large elevators connect every floor. Exiting Line 2 BEXCO Station Exit 7 elevator brings you straight onto the plaza within 120m with zero threshold.',
    steplessKeyValuesKo: [
      '벡스코역 7번 EV ➔ 벡스코 제1전시장 120m 수평 직통',
      '벡스코역 5번 EV ➔ 부산시립미술관 무단차 진입 경사로 연계',
      '전시관 전 층 대형 승강기 12대 & 전동휠체어 급속충전기 구비',
      '각 층 남녀 분리 장애인 전용 자동문 화장실 및 수유실 완비'
    ],
    steplessKeyValuesEn: [
      'Direct 120m flat route from BEXCO Station Exit 7 EV to Exhibition Hall 1',
      'Direct ramp connection from Exit 5 EV to Busan Museum of Art',
      '12 large elevators across all floors & electric wheelchair fast chargers',
      'Accessible automatic restrooms and nursery rooms on every floor'
    ],
    recommendedTravelers: [
      {
        id: 'rainy',
        icon: '🌧️',
        nameKo: '우천 여행자',
        nameEn: 'Rainy Day Visitors',
        reasonKo: '비 오는 날에도 실내 대형 전시관과 미술관에서 쾌적한 문화 관람 가능',
        reasonEn: 'Spacious indoor climate-controlled halls perfect for rainy days.'
      },
      {
        id: 'wheelchair',
        icon: '♿',
        nameKo: '휠체어 이용자',
        nameEn: 'Wheelchair Users',
        reasonKo: '완만 경사로와 넓은 통로, 전동휠체어 충전기까지 완벽 구비',
        reasonEn: 'Gentle ramps, wide corridors, and electric wheelchair fast chargers.'
      },
      {
        id: 'stroller',
        icon: '👶',
        nameKo: '유모차 동반 가족',
        nameEn: 'Families with Strollers',
        reasonKo: '유모차 무료 대여와 쾌적한 수유실/유아휴게실 완비',
        reasonEn: 'Free stroller rentals and clean nursing/family lounges.'
      },
      {
        id: 'carrier',
        icon: '🧳',
        nameKo: '캐리어 여행자',
        nameEn: 'Luggage Travelers',
        reasonKo: '지하철 직결 및 벡스코 내 대형 캐리어 물품보관함 구비',
        reasonEn: 'Direct station link and large luggage locker facilities.'
      }
    ],
    movementSteps: [
      {
        step: 1,
        typeKo: '지하철 하차',
        typeEn: 'Subway Exit',
        titleKo: '벡스코역(2호선·동해선) 7번 출구 엘리베이터',
        titleEn: 'BEXCO Station Exit 7 Elevator',
        descKo: '승강장에서 개찰구를 지나 7번 출구 엘리베이터를 타고 지상 광장으로 올라옵니다.',
        descEn: 'Take Line 2/Donghae BEXCO Station Exit 7 elevator to the ground plaza.',
        icon: 'Train'
      },
      {
        step: 2,
        typeKo: '광장 진입',
        typeEn: 'Plaza Walk',
        titleKo: '벡스코 야외광장 무단차 보행로 (120m)',
        titleEn: 'BEXCO Plaza Step-Free Walkway (120m)',
        descKo: '턱 없는 광장 보도를 따라 제1전시장 주출입구 자동문으로 곧장 진입합니다.',
        descEn: 'Follow the level outdoor plaza straight to Exhibition Hall 1 automatic doors.',
        icon: 'Building2'
      },
      {
        step: 3,
        typeKo: '실내 관람',
        typeEn: 'Indoor Exhibit',
        titleKo: '대형 승강기 & 무단차 전시홀 관람',
        titleEn: 'Spacious Elevators & Flat Exhibit Halls',
        descKo: '1층 안내데스크에서 필요 시 휠체어/유모차를 대여하고 승강기로 전 층을 자유롭게 둘러봅니다.',
        descEn: 'Rent wheelchairs/strollers if needed at Info Desk and access all floors via elevators.',
        icon: 'Theater'
      }
    ],
    preVisitChecklistKo: [
      '부산시립미술관은 매주 월요일 정기 휴관이므로 관람 일정 확인 필요',
      '벡스코 대형 행사(모터쇼, 지스타 등) 개최 시 엘리베이터 대기 시간이 발생할 수 있음',
      '제1전시장 안내데스크에서 휠체어 20대, 유모차 15대 무료 대여 지원'
    ],
    preVisitChecklistEn: [
      'Busan Museum of Art is closed every Monday; please verify schedule before visiting.',
      'During major BEXCO events, extra elevator wait times may occur.',
      'Information Desk provides 20 wheelchairs and 15 strollers for free loan.'
    ],
    nearbyLinks: [
      {
        spotNameKo: '신세계백화점 센텀시티점 & 영화의전당',
        spotNameEn: 'Shinsegae Centum City & Busan Cinema Center',
        distanceTextKo: '도보 5분 (지하/지상 평탄 보도 직결)',
        distanceTextEn: '5 mins via underground/ground level flat walkways',
        whyPairKo: '세계 최대 규모 백화점인 신세계 센텀시티와 영화의전당이 평탄 보도로 연결되어 있어, 벡스코 관람 후 실내 쇼핑, 식사, 영화 관람까지 완벽한 무단차 원스톱 일정이 완성됩니다.',
        whyPairEn: 'Directly linked to Shinsegae Centum City for premier indoor dining, shopping, and Cinema Center.'
      }
    ]
  },

  'tour-104': {
    contentid: 'tour-104',
    spotTitleKo: '국립해양박물관 (영도)',
    spotTitleEn: 'National Maritime Museum',
    oneLineSummaryKo: '수족관과 바다 역사를 전 층 대형 승강기와 완만 경사로로 누리는 해양 복합 랜드마크',
    oneLineSummaryEn: 'A coastal landmark with grand aquariums and marine exhibits fully connected by spacious elevators.',
    whyRecommendTitleKo: 'Stepless가 국립해양박물관을 추천하는 이유',
    whyRecommendTitleEn: 'Why Stepless Recommends National Maritime Museum',
    whyRecommendDescKo: '국토교통부 최고 등급 BF(Barrier-Free) 인증을 받은 박물관으로, 바다 위를 떠 있는 듯한 웅장한 원통형 수족관과 해양 역사 전시실 전체가 단차 0cm의 광폭 슬로프와 4대의 대형 투명 승강기로 연결됩니다. 휠체어와 유모차 관람객을 위한 전용 휴게실과 층별 가족 화장실이 완벽하게 갖추어져 있어 가족 단위 여행자에게 최상의 편의를 제공합니다.',
    whyRecommendDescEn: 'Awarded top Barrier-Free certification, featuring a massive cylindrical aquarium and ocean history halls completely connected by 0cm threshold slopes and 4 large transparent elevators. Family restrooms and barrier-free lounges are available on all levels.',
    steplessKeyValuesKo: [
      '부산역 5번 EV ➔ 66번 저상버스로 박물관 정문 바로 하차',
      '전 층 0cm 단차와 4대의 대형 전망 승강기로 수족관/전시실 완벽 관람',
      '수동 휠체어 및 유모차 무료 대여와 쾌적한 수유실 구비',
      '남녀 구분 장애인 전용 화장실 및 유아 동반 가족 화장실 완비'
    ],
    steplessKeyValuesEn: [
      'Busan Station Exit 5 EV ➔ Low-floor bus #66 dropping off right outside museum gates',
      'Zero threshold across all floors with 4 panoramic elevators accessing aquariums',
      'Free wheelchair and stroller rentals, plus well-appointed nursing rooms',
      'Gender-separated accessible restrooms and family restrooms on every floor'
    ],
    recommendedTravelers: [
      {
        id: 'stroller',
        icon: '👶',
        nameKo: '유모차 동반 가족',
        nameEn: 'Families with Strollers',
        reasonKo: '수족관 먹이주기 체험, 어린이 박물관, 수유실 등 아이와 함께하기 최적',
        reasonEn: 'Aquarium feeding shows, Children’s Museum, and nursing rooms.'
      },
      {
        id: 'wheelchair',
        icon: '♿',
        nameKo: '휠체어 이용자',
        nameEn: 'Wheelchair Users',
        reasonKo: '광폭 전시 통로와 수족관 터널 100% 무단차 진입 가능',
        reasonEn: 'Extra-wide exhibit hallways and 100% step-free aquarium tunnels.'
      },
      {
        id: 'rainy',
        icon: '🌧️',
        nameKo: '우천 여행자',
        nameEn: 'Rainy Day Visitors',
        reasonKo: '비 오는 날에도 실내에서 2~3시간 동안 풍성한 해양 전시와 뷰 감상',
        reasonEn: 'Spend 2-3 hours indoors enjoying marine exhibits and panoramic sea views.'
      },
      {
        id: 'senior',
        icon: '👵',
        nameKo: '보행약자/어르신',
        nameEn: 'Seniors & Gentle Walkers',
        reasonKo: '오륙도와 부산항이 내려다보이는 4층 전망 라운지 승강기 직통',
        reasonEn: 'Direct elevator access to 4th floor observatory overlooking Oryukdo.'
      }
    ],
    movementSteps: [
      {
        step: 1,
        typeKo: '대중교통 이동',
        typeEn: 'Transit & Bus',
        titleKo: '부산역 5번 출구 EV ↔ 66번 저상버스',
        titleEn: 'Busan Stn Exit 5 EV ↔ Low-Floor Bus #66',
        descKo: '부산역 5번 출구 엘리베이터로 나와 버스정류장에서 영도행 66번 저상버스를 탑승합니다.',
        descEn: 'Take Busan Stn Exit 5 elevator and board low-floor bus #66 to Yeongdo.',
        icon: 'Train'
      },
      {
        step: 2,
        typeKo: '정문 하차 & 진입',
        typeEn: 'Arrival & Entry',
        titleKo: '국립해양박물관 정문 하차 및 완만 경사로',
        titleEn: 'Museum Main Entrance Drop-off & Gentle Ramp',
        descKo: '정류장에서 내리면 박물관 주출입구 수평 자동문까지 완만한 경사로로 곧장 연결됩니다.',
        descEn: 'Arrive at the stop and roll smoothly via gentle ramps into the main automatic entrance.',
        icon: 'Building2'
      },
      {
        step: 3,
        typeKo: '수족관 & 전시 관람',
        typeEn: 'Aquarium & Exhibits',
        titleKo: '대형 승강기 타고 2~4층 전시실 & 수족관 관람',
        titleEn: 'Large Elevators to 2F-4F Aquariums & Exhibits',
        descKo: '중앙 홀 4대의 대형 승강기로 원통형 수족관 터널과 미디어 전시실을 무단차로 관람합니다.',
        descEn: 'Access the cylindrical aquarium tunnel and media halls on upper floors via elevators.',
        icon: 'Compass'
      }
    ],
    preVisitChecklistKo: [
      '매주 월요일 정기 휴관 (월요일이 공휴일인 경우 다음 첫 번째 평일 휴관)',
      '관람료 무료 (기획 특별전 일부 유료 가능)',
      '주말 3층 수족관 피딩타임(물고기 먹이주기) 시간에는 승강기 주변이 붐빌 수 있음'
    ],
    preVisitChecklistEn: [
      'Closed every Monday (if Monday is a public holiday, closed on next business day).',
      'Free admission (some special exhibitions may charge fees).',
      'During weekend aquarium feeding shows on 3F, elevators may be busy.'
    ],
    nearbyLinks: [
      {
        spotNameKo: '영도 아미르공원 & 해양클러스터 수변로',
        spotNameEn: 'Amir Park & Marine Waterfront Trail',
        distanceTextKo: '도보 1분 (박물관 바로 앞 평탄 잔디광장)',
        distanceTextEn: '1 min flat walk outside museum plaza',
        whyPairKo: '박물관 바로 앞에 넓은 바다를 품은 아미르공원 잔디광장과 평탄 수변 산책로가 조성되어 있어, 실내 관람 후 시원한 바닷바람을 쐬며 산책하기에 매우 좋습니다.',
        whyPairEn: 'Directly adjacent to Amir Park with flat lawns and waterfront promenades.'
      }
    ]
  },

  'tour-105': {
    contentid: 'tour-105',
    spotTitleKo: '용두산공원 & 부산타워',
    spotTitleEn: 'Yongdusan Park & Busan Tower',
    oneLineSummaryKo: '수직 엘리베이터와 에스컬레이터로 원도심과 부산항 파노라마를 한눈에 담는 랜드마크',
    oneLineSummaryEn: 'A historic hilltop park and tower with vertical elevators overlooking Busan Port.',
    whyRecommendTitleKo: 'Stepless가 용두산공원을 추천하는 이유',
    whyRecommendTitleEn: 'Why Stepless Recommends Yongdusan Park',
    whyRecommendDescKo: '산 위에 위치한 공원이지만, 광복로 쇼핑거리에서 공원 정상 광장까지 연결되는 수직 엘리베이터 타워가 설치되어 있어 계단을 오를 필요가 전혀 없습니다. 공원 정상부는 완전히 평평한 광장으로 조성되어 있으며, 부산타워 120m 전망대까지 고속 승강기로 올라가 360도 부산 원도심과 영도, 부산항 대교의 파노라마를 감상할 수 있습니다.',
    whyRecommendDescEn: 'Though located on a hill, a vertical elevator tower links Gwangbok-ro shopping street directly to the park top, requiring zero hill climbing. The hilltop is a flat plaza, and Busan Tower high-speed elevators transport visitors up 120m for 360-degree port panoramas.',
    steplessKeyValuesKo: [
      '남포역 1번 EV ➔ 광복로 완만 보도 ➔ 용두산 수직 엘리베이터 타워 탑승',
      '공원 정상 광장 전체 100% 수평 보행로 조성',
      '부산타워 전망대 관람 전용 고속 승강기 가동',
      '공원 관리사무소 수동 휠체어 대여 및 장애인 화장실 완비'
    ],
    steplessKeyValuesEn: [
      'Nampo Stn Exit 1 EV ➔ Gwangbok-ro path ➔ Vertical park elevator tower to summit',
      '100% level ground across the entire summit plaza',
      'High-speed accessible elevators to Busan Tower observation deck',
      'Wheelchair rentals at park office and accessible restrooms on plaza'
    ],
    recommendedTravelers: [
      {
        id: 'wheelchair',
        icon: '♿',
        nameKo: '휠체어 이용자',
        nameEn: 'Wheelchair Users',
        reasonKo: '광복로 수직 엘리베이터 타워를 통해 언덕 없이 정상 광장 및 타워 진입',
        reasonEn: 'Vertical elevator tower allows seamless ascent without tackling steep slopes.'
      },
      {
        id: 'stroller',
        icon: '👶',
        nameKo: '유모차 동반 가족',
        nameEn: 'Families with Strollers',
        reasonKo: '도심 속 녹지 광장에서 계단 없이 부산의 상징 타워와 포토존 즐기기',
        reasonEn: 'Green plaza with photo spots and zero stairs.'
      },
      {
        id: 'carrier',
        icon: '🧳',
        nameKo: '캐리어 여행자',
        nameEn: 'Luggage Travelers',
        reasonKo: '남포역 및 롯데백화점 물품보관함 이용 후 가벼운 손으로 타워 야경 관람',
        reasonEn: 'Store luggage at Nampo Station lockers before ascending to the tower.'
      },
      {
        id: 'senior',
        icon: '👵',
        nameKo: '보행약자/어르신',
        nameEn: 'Seniors & Gentle Walkers',
        reasonKo: '무릎 부담 없이 승강기로 올라가 꽃시계와 팔각정 쉼터에서 휴식',
        reasonEn: 'Ascend comfortably via elevators to rest by the floral clock and pavilion.'
      }
    ],
    movementSteps: [
      {
        step: 1,
        typeKo: '지하철 하차',
        typeEn: 'Subway Exit',
        titleKo: '남포역(1호선) 1번 출구 엘리베이터',
        titleEn: 'Nampo Station Exit 1 Elevator',
        descKo: '1번 출구 엘리베이터로 지상에 나와 광복로 패션거리 방향으로 완만하게 직진합니다.',
        descEn: 'Take Exit 1 elevator to ground level and proceed along gentle Gwangbok-ro street.',
        icon: 'Train'
      },
      {
        step: 2,
        typeKo: '수직 승강기 탑승',
        typeEn: 'Vertical Elevator',
        titleKo: '용두산공원 수직 엘리베이터 타워 탑승',
        titleEn: 'Board Yongdusan Vertical Elevator Tower',
        descKo: '광복로 삼거리에서 에스컬레이터 옆 수직 엘리베이터를 탑승하여 정상 광장으로 직행합니다.',
        descEn: 'Board the vertical elevator tower next to the escalators to ascend to summit plaza.',
        icon: 'Building2'
      },
      {
        step: 3,
        typeKo: '타워 전망대',
        typeEn: 'Tower Observatory',
        titleKo: '부산타워 고속 승강기로 120m 전망대 이동',
        titleEn: 'High-Speed Elevator to 120m Tower Observatory',
        descKo: '평탄한 정상 광장을 지나 타워 로비에서 승강기를 타고 360도 원도심 파노라마를 감상합니다.',
        descEn: 'Cross the flat summit plaza and ride the elevator to the 360-degree observation deck.',
        icon: 'Sunset'
      }
    ],
    preVisitChecklistKo: [
      '광복로에서 올라가는 일반 에스컬레이터는 상행 전용이므로 휠체어/유모차는 반드시 "수직 엘리베이터 타워"를 이용하십시오.',
      '공원 입장은 무료이며, 부산타워 전망대 관람 시 복지카드 지참 시 장애인 할인 혜택 제공',
      '야경이 아름다운 장소로 해 질 녘(일몰 전후) 방문 시 부산항 대교 조명과 야경 감상 추천'
    ],
    preVisitChecklistEn: [
      'Escalators are stairs; wheelchair/stroller users MUST use the "Vertical Elevator Tower".',
      'Park admission is free; discount applied for tower observatory with disability cards.',
      'Best visited at sunset to capture panoramic illuminations of Busan Port Bridge.'
    ],
    nearbyLinks: [
      {
        spotNameKo: '광복로 패션거리 & 롯데백화점 광복점',
        spotNameEn: 'Gwangbok-ro Fashion Street & Lotte Dept Store',
        distanceTextKo: '도보 3분 (수직 엘리베이터 하차 지점)',
        distanceTextEn: '3 mins flat walk from elevator bottom',
        whyPairKo: '수직 엘리베이터로 내려오면 바로 턱 없는 광복로 쇼핑거리와 롯데백화점 아쿠아몰(세계 최대 실내 음악분수)로 연결되어 쇼핑과 미식을 함께 즐기기 좋습니다.',
        whyPairEn: 'Steps away from flat Gwangbok-ro shopping and Lotte Department Store Aquatique Show.'
      }
    ]
  },

  'tour-106': {
    contentid: 'tour-106',
    spotTitleKo: '다대포해수욕장 & 고우니 생태길',
    spotTitleEn: 'Dadaepo Beach & Gouni Ecological Trail',
    oneLineSummaryKo: '지하철역 출구에서 100% 무단차 목재 데크로 끝없이 펼쳐지는 황금빛 노을 생태길',
    oneLineSummaryEn: 'A magical sunset coastal wetland featuring 100% flat boardwalks right from the subway exit.',
    whyRecommendTitleKo: 'Stepless가 다대포해수욕장을 추천하는 이유',
    whyRecommendTitleEn: 'Why Stepless Recommends Dadaepo Beach',
    whyRecommendDescKo: '부산의 지하철 종착역 중 바다와 가장 완벽하게 맞닿아 있는 곳입니다. 다대포해수욕장역 1번 출구 엘리베이터를 나서자마자 단 1cm의 턱도 없이 고우니 생태길 목재 데크로드가 시작됩니다. 갈대 습지 위로 수 킬로미터 이어진 데크길 전체가 경사도 1% 미만의 완전한 수평 평지여서 휠체어와 유모차도 바다 한가운데까지 편안하게 나아가 대한민국 최고의 황금빛 낙조를 만끽할 수 있습니다.',
    whyRecommendDescEn: 'The most accessible coastal terminus in Busan. Exiting Line 1 Dadaepo Beach Station Exit 1 elevator leads directly to Gouni Wetland boardwalk with 0cm step. Kilometers of wooden decks over wetlands are under 1% slope, allowing effortless rolling to view Korea’s finest sunsets.',
    steplessKeyValuesKo: [
      '다대포해수욕장역 1번 EV ➔ 고우니 생태길 데크로드 100% 무단차 직결 (100m)',
      '갈대 습지 위 수 킬로미터 목재 데크로드 전체 완벽 평지',
      '해변 입구 및 세계 최대 꿈의 낙조분수 인근 장애인 전용 화장실 2곳',
      '다대포 해변 관리센터 휠체어 무료 대여 운영'
    ],
    steplessKeyValuesEn: [
      '100m step-free direct walk from Dadaepo Beach Stn Exit 1 EV onto Gouni trail',
      'Kilometers of level wooden boardwalks floating over scenic reed wetlands',
      '2 accessible handicap restrooms located near entrance and Sunset Fountain',
      'Free wheelchair loan services at Beach Management Center'
    ],
    recommendedTravelers: [
      {
        id: 'wheelchair',
        icon: '♿',
        nameKo: '휠체어 이용자',
        nameEn: 'Wheelchair Users',
        reasonKo: '지하철역 출구 직결 및 전 구간 턱 없는 목재 데크로 갈대밭 한가운데 진입',
        reasonEn: 'Direct step-free connection from subway exit onto flat boardwalks over wetlands.'
      },
      {
        id: 'stroller',
        icon: '👶',
        nameKo: '유모차 동반 가족',
        nameEn: 'Families with Strollers',
        reasonKo: '바퀴 굴림이 완벽한 데크길과 넓은 잔디광장, 화려한 음악분수쇼',
        reasonEn: 'Smooth boardwalks, expansive green lawns, and magical musical fountains.'
      },
      {
        id: 'carrier',
        icon: '🧳',
        nameKo: '캐리어 여행자',
        nameEn: 'Luggage Travelers',
        reasonKo: '지하철역 1분 거리로 캐리어를 끌고도 해변 공원 힐링 가능',
        reasonEn: 'Just 1 minute from the station; easily visit even with luggage.'
      },
      {
        id: 'senior',
        icon: '👵',
        nameKo: '보행약자/어르신',
        nameEn: 'Seniors & Gentle Walkers',
        reasonKo: '경사가 전무한 평탄 목재 데크로 관절에 무리 없이 해넘이 조망',
        reasonEn: 'Completely zero-incline wooden trail offering gentle walking to view sunsets.'
      }
    ],
    movementSteps: [
      {
        step: 1,
        typeKo: '지하철 하차',
        typeEn: 'Subway Exit',
        titleKo: '다대포해수욕장역(1호선) 1번 출구 엘리베이터',
        titleEn: 'Dadaepo Beach Station Exit 1 Elevator',
        descKo: '1호선 종점 다대포해수욕장역 1번 출구 엘리베이터를 타고 지상 공원으로 나옵니다.',
        descEn: 'Take Line 1 Dadaepo Beach Station Exit 1 elevator to arrive directly on the park grounds.',
        icon: 'Train'
      },
      {
        step: 2,
        typeKo: '공원 진입',
        typeEn: 'Park Walk',
        titleKo: '다대포 잔디광장 무단차 보도 (100m)',
        titleEn: 'Dadaepo Park Flat Walkway (100m)',
        descKo: '턱 없는 평탄 보도를 따라 바다 방향으로 1분간 직진하여 생태길 입구로 이동합니다.',
        descEn: 'Walk 1 minute straight along the flat sidewalk toward the ecological trail entrance.',
        icon: 'Footprints'
      },
      {
        step: 3,
        typeKo: '데크로드 산책',
        typeEn: 'Boardwalk Trail',
        titleKo: '고우니 생태길 수평 목재 데크 산책',
        titleEn: 'Gouni Wetland Step-Free Wooden Boardwalk',
        descKo: '갈대 습지와 바다 위로 펼쳐진 넓은 목재 데크를 따라 노을 전망대까지 편안하게 걷습니다.',
        descEn: 'Stroll along the broad wooden boardwalk through reed beds to the sunset observatory deck.',
        icon: 'Sunset'
      }
    ],
    preVisitChecklistKo: [
      '일몰 30분~1시간 전에 도착하면 황금빛으로 물드는 갯벌과 환상적인 낙조를 만끽할 수 있습니다.',
      '꿈의 낙조분수쇼는 4월~10월 야간에 운영되므로 방문 전 분수 공연 시간표 확인 권장',
      '바닷가 특성상 해가 지면 기온이 내려가므로 겉옷 준비'
    ],
    preVisitChecklistEn: [
      'Arrive 30-60 mins before sunset for breathtaking golden wetland reflections.',
      'Sunset Music Fountain operates Apr - Oct nights; verify showtimes beforehand.',
      'Temperatures drop after sunset along the shore; bring warm clothing.'
    ],
    nearbyLinks: [
      {
        spotNameKo: '몰운대 입구 수평 산책로 & 다대포 먹거리 골목',
        spotNameEn: 'Morundae Entrance Flat Trail & Dining Alley',
        distanceTextKo: '도보 5분 (해변 남쪽 평탄 도로)',
        distanceTextEn: '5 mins flat walk along southern beach road',
        whyPairKo: '해변 남쪽 끝 몰운대 공원 입구 평탄 산책로와 다대포 신선 해산물 식당가가 연결되어, 낙조 감상 후 맛있는 저녁 식사를 함께 계획하기 좋습니다.',
        whyPairEn: 'Connects to southern Morundae entrance and fresh seafood restaurants.'
      }
    ]
  },

  'tour-107': {
    contentid: 'tour-107',
    spotTitleKo: '자갈치시장 & 수변공원 전망데크',
    spotTitleEn: 'Jagalchi Fish Market & Coastal Terrace',
    oneLineSummaryKo: '현대화 신건물 엘리베이터로 비린내 없이 옥상 오션뷰와 활어회를 누리는 부산의 활력 명소',
    oneLineSummaryEn: 'A modernized seafood market hall with elevators and barrier-free rooftop harbor terraces.',
    whyRecommendTitleKo: 'Stepless가 자갈치시장을 추천하는 이유',
    whyRecommendTitleEn: 'Why Stepless Recommends Jagalchi Market',
    whyRecommendDescKo: '전통시장의 좁고 미끄러운 바닥에 대한 편견을 바꾸어 주는 곳입니다. 현대식으로 신축된 갈매기 모양의 자갈치 신건물은 전 출입구가 턱 없는 자동문으로 설계되어 있으며, 3대의 대형 승강기가 1층 수산물 시장부터 2층 식당가, 옥상 하늘공원 전망대까지 수직으로 연결합니다. 자갈치역 10번 출구 엘리베이터에서 하차하면 180m 평탄 도로로 곧장 연결되어 우천 시에도 실내에서 쾌적하게 수산물 쇼핑과 미식을 즐길 수 있습니다.',
    whyRecommendDescEn: 'Overcoming traditional slippery market hurdles, modernized Jagalchi Hall features zero-threshold automatic doors and 3 large elevators linking ground seafood stalls, 2F dining, and rooftop observation terraces. From Jagalchi Stn Exit 10 EV, it is a flat 180m walk.',
    steplessKeyValuesKo: [
      '자갈치역 10번 EV ➔ 자갈치 현대화 신건물 180m 평탄 보도 진입',
      '전 층 연결 대형 승강기 3대 가동 (옥상 수변 전망데크 직결)',
      '실내 광폭 복도로 휠체어/유모차 이동 시 미끄러짐 방지 마감',
      '층별 남녀 분리 장애인 전용 화장실 완비'
    ],
    steplessKeyValuesEn: [
      'Direct 180m flat sidewalk from Jagalchi Station Exit 10 EV to modernized Market Hall',
      '3 large elevators serving all floors and rooftop harbor view observatory',
      'Wide indoor non-slip corridors suitable for wheelchairs and strollers',
      'Gender-separated accessible restrooms on each floor'
    ],
    recommendedTravelers: [
      {
        id: 'rainy',
        icon: '🌧️',
        nameKo: '우천 여행자',
        nameEn: 'Rainy Day Visitors',
        reasonKo: '비 오는 날에도 현대식 실내 건물에서 쾌적하게 해산물 미식과 전망 즐기기',
        reasonEn: 'Modern covered hall with fresh dining and harbor vistas even on rainy days.'
      },
      {
        id: 'wheelchair',
        icon: '♿',
        nameKo: '휠체어 이용자',
        nameEn: 'Wheelchair Users',
        reasonKo: '주출입구 자동문과 대형 승강기로 옥상 하늘전망대까지 무단차 접근',
        reasonEn: 'Automatic main doors and spacious elevators reaching the rooftop deck.'
      },
      {
        id: 'carrier',
        icon: '🧳',
        nameKo: '캐리어 여행자',
        nameEn: 'Luggage Travelers',
        reasonKo: '자갈치역 인근 및 시장 건물 내 엘리베이터로 무거운 짐을 끌고도 식당가 이동 용이',
        reasonEn: 'Easily roll heavy luggage up to 2F restaurants via market elevators.'
      },
      {
        id: 'senior',
        icon: '👵',
        nameKo: '보행약자/어르신',
        nameEn: 'Seniors & Gentle Walkers',
        reasonKo: '계단 없이 편안하게 식당가 좌석과 옥상 벤치에서 영도 앞바다 조망',
        reasonEn: 'Step-free access to dining tables and rooftop benches overlooking Yeongdo Port.'
      }
    ],
    movementSteps: [
      {
        step: 1,
        typeKo: '지하철 하차',
        typeEn: 'Subway Exit',
        titleKo: '자갈치역(1호선) 10번 출구 엘리베이터',
        titleEn: 'Jagalchi Station Exit 10 Elevator',
        descKo: '1호선 자갈치역 10번 출구 엘리베이터를 이용해 지상으로 나옵니다.',
        descEn: 'Take Line 1 Jagalchi Station Exit 10 elevator to ground level.',
        icon: 'Train'
      },
      {
        step: 2,
        typeKo: '수평 보도 이동',
        typeEn: 'Straight Walk',
        titleKo: '자갈치해안로 평탄 보도 직진 (180m)',
        titleEn: 'Flat Jagalchihaean-ro Sidewalk (180m)',
        descKo: '해안 방향으로 턱 없는 인도를 따라 자갈치 현대화 신건물 정문으로 향합니다.',
        descEn: 'Walk straight along the flat seaside sidewalk toward the main modern market entrance.',
        icon: 'Footprints'
      },
      {
        step: 3,
        typeKo: '신건물 승강기 탑승',
        typeEn: 'Market Elevator',
        titleKo: '대형 승강기로 2층 식당가 & 옥상 전망데크 이동',
        titleEn: 'Ride Large Elevator to 2F Dining & Rooftop Deck',
        descKo: '수평 자동문으로 진입하여 승강기를 타고 옥상 전망대에서 영도 바다를 감상합니다.',
        descEn: 'Enter through automatic doors and ride the elevator to the rooftop harbor terrace.',
        icon: 'Building2'
      }
    ],
    preVisitChecklistKo: [
      '매월 첫째 주, 셋째 주 화요일은 자갈치시장 정기 휴무일입니다.',
      '구시장(야외 노점 골목)은 바닥 물기와 턱이 있을 수 있으므로 "자갈치 현대화 신건물" 동선 위주 이용 권장',
      '옥상 전망대는 09:00 ~ 21:00 무료 개방되며 영도대교와 남항대교 조망이 탁월합니다.'
    ],
    preVisitChecklistEn: [
      'Closed on the 1st and 3rd Tuesday of every month.',
      'The older open-air alleys may have wet spots; stick to the modernized Market Building.',
      'Rooftop observation deck is open free 09:00 - 21:00 with panoramic bridge views.'
    ],
    nearbyLinks: [
      {
        spotNameKo: '유라리광장 & 영도대교 도개 관람',
        spotNameEn: 'Yurari Plaza & Yeongdo Bridge Opening',
        distanceTextKo: '도보 3분 (자갈치시장 바로 옆 해안 데크)',
        distanceTextEn: '3 mins flat walk along adjacent seaside terrace',
        whyPairKo: '자갈치시장 건물 바로 옆 유라리광장은 바다와 맞닿은 완전 평지 광장으로, 매일 오후 2시 펼쳐지는 영도대교 도개 행사를 휠체어와 유모차도 가장 편안하게 관람할 수 있습니다.',
        whyPairEn: 'Flat seaside plaza right next to Jagalchi, perfect for watching the daily 2 PM Yeongdo Bridge lift.'
      }
    ]
  },

  'tour-108': {
    contentid: 'tour-108',
    spotTitleKo: '동백섬 데크 산책로 & 누리마루 APEC하우스',
    spotTitleEn: 'Dongbaekseom Boardwalk & Nurimaru',
    oneLineSummaryKo: '동백나무 숲과 푸른 바다 절경을 완만한 목재 데크로드로 걷는 해운대의 보석 같은 순환 코스',
    oneLineSummaryEn: 'A scenic coastal loop surrounded by camellias and sea cliffs on gentle wooden boardwalks.',
    whyRecommendTitleKo: 'Stepless가 동백섬 & 누리마루를 추천하는 이유',
    whyRecommendTitleEn: 'Why Stepless Recommends Dongbaekseom & Nurimaru',
    whyRecommendDescKo: '해운대 해변과 맞닿아 있는 동백섬은 섬 전체 둘레를 감싸는 해안 순환로가 100% 무단차 목재 데크로 조성되어 있습니다. 2005년 APEC 정상회의가 열린 누리마루 APEC하우스는 실내에 관람 전용 엘리베이터와 완만한 완충 경사로가 완비되어 있어 휠체어와 유모차도 정상회의장과 오션뷰 테라스를 자유롭게 관람할 수 있습니다.',
    whyRecommendDescEn: 'Dongbaekseom features a coastal loop with 100% barrier-free wooden boardwalks. Nurimaru APEC House is equipped with visitor elevators and smooth entry ramps, allowing wheelchairs and strollers to tour the historic summit hall and ocean terraces.',
    steplessKeyValuesKo: [
      '동백역 1번 EV ➔ 동백섬 입구까지 800m 평탄 인도 연결',
      '동백섬 우측 해안 순환로 100% 목재 수평 데크로 조성',
      '누리마루 APEC하우스 실내 전용 승강기 가동 및 무단차 진입',
      '동백섬 입구 공영주차장 장애인 주차 8면 및 휠체어 대여'
    ],
    steplessKeyValuesEn: [
      'Flat 800m sidewalk connecting Dongbaek Stn Exit 1 EV to island entrance',
      '100% wooden boardwalk along right coastal loop with zero steps',
      'Interior elevators and ramp access inside Nurimaru APEC House',
      '8 accessible parking slots and wheelchair loan services at island entrance'
    ],
    recommendedTravelers: [
      {
        id: 'wheelchair',
        icon: '♿',
        nameKo: '휠체어 이용자',
        nameEn: 'Wheelchair Users',
        reasonKo: '우측 평탄 순환 해안 데크로드를 통해 등대 전망대와 누리마루 무단차 완주',
        reasonEn: 'Right coastal loop boardwalk allows step-free access to Nurimaru and lighthouses.'
      },
      {
        id: 'stroller',
        icon: '👶',
        nameKo: '유모차 동반 가족',
        nameEn: 'Families with Strollers',
        reasonKo: '소나무 숲 피톤치드와 바다 향기를 맡으며 턱 없이 산책하기 최적의 코스',
        reasonEn: 'Pine forest breezes and fresh ocean air on smooth wooden paths.'
      },
      {
        id: 'senior',
        icon: '👵',
        nameKo: '보행약자/어르신',
        nameEn: 'Seniors & Gentle Walkers',
        reasonKo: '가파른 등산로 없이 완만한 바닷길을 따라 누리마루 테라스에서 오륙도 감상',
        reasonEn: 'Gentle seaside trail with rest benches overlooking Oryukdo and Gwangan Bridge.'
      }
    ],
    movementSteps: [
      {
        step: 1,
        typeKo: '지하철 하차',
        typeEn: 'Subway Exit',
        titleKo: '동백역(2호선) 1번 출구 엘리베이터',
        titleEn: 'Dongbaek Station Exit 1 Elevator',
        descKo: '2호선 동백역 1번 출구 엘리베이터를 나와 동백섬 입구 방향으로 평탄 보도를 걷습니다.',
        descEn: 'Exit Line 2 Dongbaek Station Exit 1 elevator and follow the flat sidewalk toward the island.',
        icon: 'Train'
      },
      {
        step: 2,
        typeKo: '동백섬 순환로 진입',
        typeEn: 'Loop Trail Entry',
        titleKo: '동백섬 입구 ➔ 우측 평탄 해안 데크로드 선택',
        titleEn: 'Island Entrance ➔ Right Flat Coastal Boardwalk',
        descKo: '등산 계단 코스를 피하고 우측 웨스틴조선 방면 평탄 해안 데크로드를 따라 진입합니다.',
        descEn: 'Bypass steep hill stairs and take the right-hand flat seaside boardwalk toward Westin.',
        icon: 'Footprints'
      },
      {
        step: 3,
        typeKo: '누리마루 관람',
        typeEn: 'Nurimaru Tour',
        titleKo: '누리마루 APEC하우스 무단차 경사로 & 실내 승강기',
        titleEn: 'Nurimaru APEC House Step-Free Ramps & Elevators',
        descKo: '완만한 경사로로 누리마루 3층에 진입한 후 내부 승강기로 1~3층 전시관을 감상합니다.',
        descEn: 'Enter through gentle ramps to 3F and use elevators to explore 1F-3F conference halls.',
        icon: 'Building2'
      }
    ],
    preVisitChecklistKo: [
      '동백섬 정상 등대 방면 등산 계단은 휠체어/유모차 진입이 어려우므로 반드시 "우측 평탄 해안 데크로"를 이용하십시오.',
      '누리마루 APEC하우스는 매월 첫째 주 월요일 정기 휴관입니다 (산책로는 24시간 연중무휴).',
      '동백섬 둘레길은 약 1.5km 코스로 40~50분 정도 여유로운 산책 시간을 잡으시길 권장합니다.'
    ],
    preVisitChecklistEn: [
      'Bypass the steep center summit stairs; always stay on the right-hand flat coastal boardwalk.',
      'Nurimaru APEC House is closed 1st Monday of each month (outdoor boardwalk open 24/7).',
      'The full loop is ~1.5km; allow 40-50 minutes for a relaxed stroll.'
    ],
    nearbyLinks: [
      {
        spotNameKo: '해운대 해수욕장 무장애 백사장',
        spotNameEn: 'Haeundae Beach Barrier-Free Boardwalk',
        distanceTextKo: '도보 5분 (웨스틴조선호텔 옆 해변 데크 직결)',
        distanceTextEn: '5 mins directly connected via seaside boardwalk',
        whyPairKo: '동백섬 산책로 출구가 해운대 백사장 무장애 데크로드와 곧바로 연결되어 있어, 하나의 연속된 평탄 코스로 해운대 전체를 완벽하게 둘러볼 수 있습니다.',
        whyPairEn: 'Exits directly onto Haeundae beach boardwalk for a continuous seamless walking tour.'
      }
    ]
  },

  'tour-109': {
    contentid: 'tour-109',
    spotTitleKo: '40계단 문화관광테마거리 & 문화관',
    spotTitleEn: '40 Steps Cultural Street & Memorial Hall',
    oneLineSummaryKo: '피란 시절의 역사와 예술 조형물을 턱 없는 평지 거리와 문화관 승강기로 둘러보는 원도심 코스',
    oneLineSummaryEn: 'A historic street depicting Korean War memories with flat streetscaping and museum elevators.',
    whyRecommendTitleKo: 'Stepless가 40계단 테마거리를 추천하는 이유',
    whyRecommendTitleEn: 'Why Stepless Recommends 40 Steps Street',
    whyRecommendDescKo: '이름은 "40계단"이지만, 테마거리 전체는 차도와 분리된 완만한 평지 보행자 거리로 잘 정비되어 있습니다. 뻥튀기 아저씨, 물지게를 진 아이 등 당시의 애환을 담은 실물 크기 조형물들이 모두 평탄 보도 위에 설치되어 있어 휠체어와 유모차도 가깝게 기념사진을 찍을 수 있습니다. 바로 옆 40계단 문화관 1층 출입구는 단차 0cm이며 엘리베이터를 통해 5층 전시실까지 편리하게 이동할 수 있습니다.',
    whyRecommendDescEn: 'Despite the name "40 Steps", the theme street is completely level and pedestrian-friendly. Lifesize nostalgic sculptures are placed right along flat pavements. The adjacent 40 Steps Memorial Museum features a zero-step entrance and elevator access to 5F.',
    steplessKeyValuesKo: [
      '중앙역 12번 EV ➔ 40계단 테마거리 120m 완벽 평지 진입',
      '테마거리 내 역사 조형물 전 구역 평탄 보도에 배치',
      '40계단 문화관 1층 무단차 출입구 및 실내 승강기 가동',
      '문화관 1층 장애인 전용 화장실 구비'
    ],
    steplessKeyValuesEn: [
      '120m step-free flat walk from Jungang Stn Exit 12 EV to theme street',
      'Historic bronze statues placed directly along level sidewalks',
      'Zero-threshold entrance and passenger elevators inside Memorial Hall',
      'Accessible restroom on 1st floor of Memorial Hall'
    ],
    recommendedTravelers: [
      {
        id: 'wheelchair',
        icon: '♿',
        nameKo: '휠체어 이용자',
        nameEn: 'Wheelchair Users',
        reasonKo: '실제 계단은 옆 평탄 골목으로 우회하고, 테마거리와 문화관 전시실을 무단차로 관람',
        reasonEn: 'Bypass actual stairs via flat side street to tour the street and museum.'
      },
      {
        id: 'carrier',
        icon: '🧳',
        nameKo: '캐리어 여행자',
        nameEn: 'Luggage Travelers',
        reasonKo: '부산역에서 1정거장 거리(중앙역)로 출구 직결 평지에서 가볍게 레트로 감성 투어',
        reasonEn: 'One stop from Busan Station; easily stroll level retro streets with rolling bags.'
      },
      {
        id: 'senior',
        icon: '👵',
        nameKo: '보행약자/어르신',
        nameEn: 'Seniors & Gentle Walkers',
        reasonKo: '옛 피란 시절의 추억을 계단 오르내림 없이 문화관 엘리베이터로 편안히 회상',
        reasonEn: 'Revisit historic memories without climbing stairs thanks to museum elevators.'
      }
    ],
    movementSteps: [
      {
        step: 1,
        typeKo: '지하철 하차',
        typeEn: 'Subway Exit',
        titleKo: '중앙역(1호선) 12번 출구 엘리베이터',
        titleEn: 'Jungang Station Exit 12 Elevator',
        descKo: '1호선 중앙역 12번 출구 엘리베이터를 이용해 지상으로 올라옵니다.',
        descEn: 'Take Line 1 Jungang Station Exit 12 elevator to ground level.',
        icon: 'Train'
      },
      {
        step: 2,
        typeKo: '테마거리 산책',
        typeEn: 'Street Walk',
        titleKo: '40계단 테마거리 평탄 보도 산책 (120m)',
        titleEn: '40 Steps Theme Street Flat Stroll (120m)',
        descKo: '턱 없는 평지 거리를 따라 레트로 조형물과 철길 기념물을 감상합니다.',
        descEn: 'Stroll along the level sidewalk to admire nostalgic bronze statues and vintage rails.',
        icon: 'Footprints'
      },
      {
        step: 3,
        typeKo: '문화관 관람',
        typeEn: 'Museum Visit',
        titleKo: '40계단 문화관 실내 승강기로 5층 전시실 이동',
        titleEn: 'Memorial Hall Elevator to 5F Exhibits',
        descKo: '문화관 1층 무단차 입구로 들어가 승강기를 타고 피란 시절 역사 유물을 관람합니다.',
        descEn: 'Enter through zero-step automatic doors and ride the elevator to 5F exhibit halls.',
        icon: 'Building2'
      }
    ],
    preVisitChecklistKo: [
      '"40계단" 상징 계단 자체는 실제 계단이므로 휠체어/유모차는 계단 옆 우회 평탄 도로를 이용하십시오.',
      '40계단 문화관은 주말 및 공휴일 휴관이므로 실내 전시 관람 시 평일(09:00~18:00) 방문 권장',
      '거리 일대에 아기자기한 레트로 카페들이 많아 도보 여행 중 휴식을 취하기 좋습니다.'
    ],
    preVisitChecklistEn: [
      'The memorial stairs are physical steps; wheelchair/stroller users should use the flat side road.',
      'Memorial Hall is closed on weekends and holidays; visit weekdays 09:00 - 18:00.',
      'Charming retro cafes line the flat street for cozy coffee breaks.'
    ],
    nearbyLinks: [
      {
        spotNameKo: '부산근현대역사관 & 용두산공원',
        spotNameEn: 'Busan Modern History Museum & Yongdusan Park',
        distanceTextKo: '도보 7분 (대청로 평탄 보도 연결)',
        distanceTextEn: '7 mins flat walk along Daecheong-ro',
        whyPairKo: '중앙동에서 대청로 평탄 보도를 따라 조금만 걸어가면 최신 리모델링된 부산근현대역사관(100% 무장애)과 용두산공원 수직 엘리베이터로 이어져 원도심 역사 투어의 완성도가 높아집니다.',
        whyPairEn: 'Connects smoothly along flat sidewalks to Busan Modern History Museum and Yongdusan Park.'
      }
    ]
  },

  'tour-110': {
    contentid: 'tour-110',
    spotTitleKo: '범어사 천년고찰 & 성보박물관',
    spotTitleEn: 'Beomeosa Temple & Seongbo Museum',
    oneLineSummaryKo: '금정산의 울창한 숲속에서 최신 성보박물관 승강기로 찬란한 불교 예술을 누리는 힐링 사찰',
    oneLineSummaryEn: 'A thousand-year-old mountain temple featuring modern museum elevators amidst peaceful forests.',
    whyRecommendTitleKo: 'Stepless가 범어사 & 성보박물관을 추천하는 이유',
    whyRecommendTitleEn: 'Why Stepless Recommends Beomeosa & Museum',
    whyRecommendDescKo: '산사(山寺)의 고건축 특성상 대웅전 상단부는 돌계단이 많지만, 최신 신축 개관한 범어사 성보박물관은 100% 완벽한 무장애 시설을 갖추고 있습니다. 박물관 입구에 완만한 무단차 진입로가 조성되어 있고, 실내 대형 승강기 2대가 전 층을 연결하여 국보급 불교 문화재와 괘불탱을 휠체어와 유모차도 편안하게 감상할 수 있습니다. 범어사역 5·7번 출구 엘리베이터에서 저상버스 90번을 타면 박물관 바로 앞까지 턱 없이 도달합니다.',
    whyRecommendDescEn: 'While upper temple grounds have ancient stone steps, the newly built Seongbo Museum is 100% barrier-free. Smooth ramps and 2 large passenger elevators provide effortless access to national treasure Buddhist artifacts. Low-floor bus #90 from Beomeosa Station Exit 5/7 EV drops visitors right at the museum gates.',
    steplessKeyValuesKo: [
      '범어사역 5·7번 EV ➔ 90번 저상버스로 성보박물관 앞 바로 하차',
      '신축 성보박물관 100% 무단차 진입 경사로 및 수평 자동문',
      '박물관 실내 대형 승강기 2대 가동으로 전 층 국보급 유물 관람',
      '박물관 로비 장애인 전용 화장실 및 휠체어 대여 지원'
    ],
    steplessKeyValuesEn: [
      'Beomeosa Stn Exit 5/7 EV ➔ Low-floor bus #90 dropping off directly at Seongbo Museum',
      '100% step-free ramp entrance and automatic doors at Seongbo Museum',
      '2 large interior passenger elevators connecting all artifact exhibition halls',
      'Accessible restrooms in museum lobby and wheelchair loan support'
    ],
    recommendedTravelers: [
      {
        id: 'wheelchair',
        icon: '♿',
        nameKo: '휠체어 이용자',
        nameEn: 'Wheelchair Users',
        reasonKo: '신축 성보박물관의 완만 경사로와 대형 승강기로 불교 문화재 무단차 관람',
        reasonEn: 'Modern Seongbo Museum features gentle ramps and large elevators for artifact viewing.'
      },
      {
        id: 'stroller',
        icon: '👶',
        nameKo: '유모차 동반 가족',
        nameEn: 'Families with Strollers',
        reasonKo: '금정산의 맑은 숲 공기를 마시며 박물관과 사찰 하단 마당을 산책',
        reasonEn: 'Stroll around the museum and lower temple courtyard amidst fresh mountain air.'
      },
      {
        id: 'senior',
        icon: '👵',
        nameKo: '보행약자/어르신',
        nameEn: 'Seniors & Gentle Walkers',
        reasonKo: '가파른 계단 등반 없이 90번 버스로 하차하여 박물관과 템플스테이 쉼터 휴식',
        reasonEn: 'Take bus #90 right to the gate without climbing steep slopes.'
      },
      {
        id: 'rainy',
        icon: '🌧️',
        nameKo: '우천 여행자',
        nameEn: 'Rainy Day Visitors',
        reasonKo: '비 오는 날 산사의 고즈넉한 빗소리와 함께 쾌적한 실내 박물관 전시 관람',
        reasonEn: 'Enjoy rainy forest ambience while exploring the indoor climate-controlled museum.'
      }
    ],
    movementSteps: [
      {
        step: 1,
        typeKo: '지하철 & 버스 환승',
        typeEn: 'Subway & Bus Transfer',
        titleKo: '범어사역(1호선) 5·7번 EV ↔ 90번 저상버스',
        titleEn: 'Beomeosa Stn Exit 5/7 EV ↔ Low-Floor Bus #90',
        descKo: '1호선 범어사역 엘리베이터로 나와 인근 정류장에서 90번 버스를 타고 사찰 입구로 이동합니다.',
        descEn: 'Take Beomeosa Station Exit 5/7 elevator and transfer to bus #90 up the scenic road.',
        icon: 'Train'
      },
      {
        step: 2,
        typeKo: '박물관 입구 진입',
        typeEn: 'Museum Entrance',
        titleKo: '범어사 성보박물관 무단차 완만 경사로',
        titleEn: 'Seongbo Museum Step-Free Gentle Ramp',
        descKo: '버스 정류장 하차 후 신축 성보박물관 정문으로 연결되는 수평 경사로를 이용합니다.',
        descEn: 'Drop off at the bus stop and roll along the gentle entrance ramp into the museum.',
        icon: 'Building2'
      },
      {
        step: 3,
        typeKo: '전시실 관람',
        typeEn: 'Exhibit Halls',
        titleKo: '대형 승강기로 1~2층 불교 유물 & 기획전 관람',
        titleEn: 'Large Elevators to 1F-2F Buddhist Exhibits',
        descKo: '로비 승강기를 타고 삼국시대 및 조선시대 불교 문화재와 괘불탱을 쾌적하게 관람합니다.',
        descEn: 'Take the lobby elevators to explore grand Buddhist paintings and national treasures.',
        icon: 'Theater'
      }
    ],
    preVisitChecklistKo: [
      '성보박물관은 매주 월요일 정기 휴관입니다 (사찰 경내는 24시간 연중무휴).',
      '대웅전 및 관음전 등 상단 구역은 문화재 보존상 계단이 있으므로 휠체어/유모차는 "성보박물관 및 하단 마당" 중심 관람을 권장합니다.',
      '사찰 입구 매표소 및 박물관 로비에 장애인 전용 화장실 구비'
    ],
    preVisitChecklistEn: [
      'Seongbo Museum is closed every Monday (temple grounds open year-round).',
      'Upper halls have historic stone steps; wheelchair/stroller visits are best focused on the Museum and lower plaza.',
      'Accessible restrooms located at the entrance ticketing area and museum lobby.'
    ],
    nearbyLinks: [
      {
        spotNameKo: '범어사 등나무 군락지 & 문화의 거리',
        spotNameEn: 'Beomeosa Wisteria Woods & Cultural Street',
        distanceTextKo: '도보 5분 (사찰 진입로 평탄 보도)',
        distanceTextEn: '5 mins along lower temple road',
        whyPairKo: '천연기념물로 지정된 등나무 군락지와 사찰 진입로의 울창한 소나무 숲길이 완만하게 이어져, 박물관 관람 후 자연 속 힐링 산책을 즐기기에 훌륭합니다.',
        whyPairEn: 'Scenic pine woods and natural wisteria trails along the gentle lower approach road.'
      }
    ]
  }
};
