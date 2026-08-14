export interface RecommendedExitExplanation {
  exitNum: string;
  targetTitle: string;
  reason: string;
  hasElevator?: boolean;
  hasEscalator?: boolean;
}

export interface MovementStep {
  step: number;
  title: string;
  location: string;
  desc: string;
}

export interface TravelerTips {
  luggage: string;
  stroller: string;
  wheelchair: string;
  mobility: string;
}

export interface NearbyPlaceContext {
  name: string;
  tag: string;
  whyVisit: string;
  exitInfo: string;
}

export interface StationCurationData {
  introKo: string;
  introEn: string;
  stationRoleKo: string;
  stationRoleEn: string;
  recommendedExitsExplanationKo: RecommendedExitExplanation[];
  recommendedExitsExplanationEn: RecommendedExitExplanation[];
  movementStepsKo: MovementStep[];
  movementStepsEn: MovementStep[];
  travelerTipsKo: TravelerTips;
  travelerTipsEn: TravelerTips;
  nearbyPlacesWithContextKo: NearbyPlaceContext[];
  nearbyPlacesWithContextEn: NearbyPlaceContext[];
}

export const STATION_CURATIONS: Record<string, StationCurationData> = {
  // 1. 부산역 (Busan Station)
  busan: {
    introKo: '부산역은 전국에서 KTX/SRT 고속열차로 도착하는 모든 여행자의 첫 관문입니다. 지하철 1호선과 고속철도 역사 간의 계단 없는 보행 데크와 수직 엘리베이터 동선을 미리 파악하면, 무거운 캐리어를 들고 계단을 오르내리는 수고를 완전히 덜 수 있습니다.',
    introEn: 'Busan Station is the primary gateway for all travelers arriving via high-speed KTX and SRT trains. Understanding the step-free pedestrian deck and vertical elevators connecting Metro Line 1 directly eliminates the burden of carrying heavy luggage over stairs.',
    stationRoleKo: 'KTX/SRT 고속철도 환승 및 원도심(초량·영도·남포) 여행의 중심 출발점',
    stationRoleEn: 'High-speed rail transit hub & launchpad for historic downtown exploration',
    recommendedExitsExplanationKo: [
      {
        exitNum: '4번·5번 출구',
        targetTitle: '부산역 광장 & 텍사스·차이나타운 방면',
        reason: '지상 도로변 수직 승강기가 보도와 연결되어 있어 단차 부담을 줄일 수 있습니다. 휠체어와 유모차 이동 시 편리한 추천 출구입니다.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: '6번 출구',
        targetTitle: 'KTX/SRT 부산역 2층 대합실 직통 환승 데크',
        reason: '지하철 개찰구에서 나와 6번 출구 엘리베이터나 상하행 에스컬레이터를 타면 KTX 2층 대합실로 비나 계단 없이 곧바로 이동할 수 있습니다.',
        hasElevator: true,
        hasEscalator: true
      }
    ],
    recommendedExitsExplanationEn: [
      {
        exitNum: 'Exits 4 & 5',
        targetTitle: 'Busan Station Plaza & Chinatown',
        reason: 'Ground-level vertical elevators connect to the sidewalk with minimal curb obstruction, making it convenient for wheelchairs and strollers.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: 'Exit 6',
        targetTitle: 'KTX / SRT Rail Station 2F Concourse Deck',
        reason: 'Direct elevator and bidirectional escalators take you to the 2F high-speed rail concourse without walking through rain or stairs.',
        hasElevator: true,
        hasEscalator: true
      }
    ],
    movementStepsKo: [
      {
        step: 1,
        title: '지하 2층 승강장 하차',
        location: '1호선 승강장',
        desc: '열차에서 하차 후 승강장 중앙의 수직 승강기(교통약자 우선)를 타고 지하 1층 대합실로 올라갑니다.'
      },
      {
        step: 2,
        title: '와이드 개찰구 통과',
        location: '지하 1층 대합실',
        desc: '유모차와 휠체어가 여유롭게 통과할 수 있는 광폭 개찰구를 통과합니다.'
      },
      {
        step: 3,
        title: '목적지별 승강기 탑승',
        location: '출구 연결 통로',
        desc: 'KTX 환승은 6번 출구 엘리베이터로, 광장/시내 이동은 4·5번 출구 엘리베이터를 이용해 지상으로 올라갑니다.'
      },
      {
        step: 4,
        title: '평탄 보도 진입',
        location: '지상 광장 및 보행 데크',
        desc: '턱 없는 보도블록이나 보행 데크를 따라 캐리어를 끌고 안전하게 목적지로 이동합니다.'
      }
    ],
    movementStepsEn: [
      {
        step: 1,
        title: 'Platform Arrival (B2F)',
        location: 'Line 1 Platform',
        desc: 'Step off the train and take the central elevator up to the B1 concourse level.'
      },
      {
        step: 2,
        title: 'Wide Gate Passage',
        location: 'B1 Concourse',
        desc: 'Pass through the wide turnstile gate suitable for strollers, wheelchairs, and luggage.'
      },
      {
        step: 3,
        title: 'Exit Elevator Boarding',
        location: 'Exit Corridors',
        desc: 'Take Exit 6 elevator for KTX connection, or Exit 4/5 elevators for street level.'
      },
      {
        step: 4,
        title: 'Smooth Sidewalk Access',
        location: 'Station Plaza / Deck',
        desc: 'Proceed smoothly along the curb-free sidewalk or elevated pedestrian deck.'
      }
    ],
    travelerTipsKo: {
      luggage: 'KTX 환승 시 지하철 6번 출구 방면 연결 통로를 이용하면 야외로 나가지 않고 2층 대합실 및 짐 보관소로 바로 이어집니다.',
      stroller: '부산역 광장 분수대 및 차이나타운 방향은 4번 출구 엘리베이터를 이용하시면 도로 단차 없이 진입 가능합니다.',
      wheelchair: '승강장과 열차 사이 틈새가 좁은 교통약자 우선 탑승 구역(중앙 칸)을 이용하시면 승하차가 매우 수월합니다.',
      mobility: '계단 대신 6번 출구의 상하행 완비 에스컬레이터를 이용하시면 다리에 무리 없이 이동하실 수 있습니다.'
    },
    travelerTipsEn: {
      luggage: 'Use Exit 6 corridor to reach the KTX 2F concourse and luggage lockers directly without navigating outdoor weather.',
      stroller: 'Take Exit 4 elevator for step-free sidewalk access to the plaza and Chinatown food street.',
      wheelchair: 'Board at the central priority car where the gap between the platform and train door is minimal.',
      mobility: 'Take the bidirectional escalators at Exit 6 for a smooth, strain-free ascent.'
    },
    nearbyPlacesWithContextKo: [
      {
        name: '🍕 이재모피자 부산역점 & 차이나타운',
        tag: '도보 3분 · 5번 출구 엘리베이터',
        whyVisit: '부산 대표 명물 피자와 정통 중식 만두거리가 5번 출구 엘리베이터에서 평지 보도로 바로 연결됩니다.',
        exitInfo: '5번 출구 엘리베이터'
      },
      {
        name: '🚢 부산항 국제여객터미널 & 북항 친수공원',
        tag: '공중 보행데크 직결 · 6번 출구',
        whyVisit: '부산역 2층 대합실에서 연결되는 공중 보행 데크를 통해 휠체어와 유모차도 바다 공원까지 평탄하게 갈 수 있습니다.',
        exitInfo: '6번 출구 연계'
      },
      {
        name: '📜 초량 이바구길 & 168계단 모노레일',
        tag: '도보 8분 · 7번 출구',
        whyVisit: '부산 원도심 산복도로의 역사를 느낄 수 있는 대표 스토리텔링 거리입니다.',
        exitInfo: '7번 출구 방면'
      }
    ],
    nearbyPlacesWithContextEn: [
      {
        name: '🍕 Lee Jae Mo Pizza & Chinatown',
        tag: '3 min walk · Exit 5 Elevator',
        whyVisit: 'Famous local pizza and authentic dumpling alley accessible via flat sidewalk from Exit 5 elevator.',
        exitInfo: 'Exit 5 Elevator'
      },
      {
        name: '🚢 Busan Port Waterfront Park',
        tag: 'Connected via Skybridge · Exit 6',
        whyVisit: 'Step-free elevated walkway from Busan Station 2F leads directly to ocean breeze views and waterfront lawns.',
        exitInfo: 'Exit 6 Connection'
      },
      {
        name: '📜 Choryang Ibagu-gil History Trail',
        tag: '8 min walk · Exit 7',
        whyVisit: 'Historic hillside alley showcasing Busan refugee heritage and scenic panoramic overlooks.',
        exitInfo: 'Exit 7 Direction'
      }
    ]
  },

  // 2. 서면역 (Seomyeon Station)
  seomyeon: {
    introKo: '서면역은 부산 지하철 1호선과 2호선이 교차하는 최대의 환승 거점이자 상업 중심지입니다. 지하 1·2층의 거대한 지하상가 구조로 인해 자칫 출구를 헷갈리기 쉬우므로, 롯데백화점 방면 7번 출구 엘리베이터와 9·11번 출구 엘리베이터 위치를 숙지하는 것이 핵심입니다.',
    introEn: 'Seomyeon Station is the central transfer hub connecting Line 1 and Line 2, surrounded by Busan’s biggest shopping and dining quarters. Due to the expansive multi-level underground mall, knowing Exit 7 and Exit 9/11 elevator locations is essential.',
    stationRoleKo: '1·2호선 환승 중심지 & 젊음의 거리, 롯데백화점, 삼정타워 쇼핑의 메카',
    stationRoleEn: 'Core transfer intersection & hub for shopping malls, youth culture, and cafes',
    recommendedExitsExplanationKo: [
      {
        exitNum: '7번 출구',
        targetTitle: '롯데백화점 부산본점 & 서면시장 방면',
        reason: '지상 수직 엘리베이터가 백화점 정문 및 서면시장 먹자골목 바로 앞에 위치하여 쇼핑과 맛집 탐방에 가장 편리합니다.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: '9번·11번 사이 출구',
        targetTitle: '영광도서 & 부전동 오피스 상권 방면',
        reason: '도로 중앙 화단형 수직 엘리베이터로 서면 북측 방면을 단차 없이 이동할 수 있습니다.',
        hasElevator: true,
        hasEscalator: false
      }
    ],
    recommendedExitsExplanationEn: [
      {
        exitNum: 'Exit 7',
        targetTitle: 'Lotte Dept. Store & Seomyeon Food Market',
        reason: 'Vertical elevator sits right before the department store main entrance and local food alley.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: 'Exits 9 & 11',
        targetTitle: 'Yeonggwang Bookstore & Northern District',
        reason: 'Street median elevator offering seamless, step-free access to the northern business corridor.',
        hasElevator: true,
        hasEscalator: false
      }
    ],
    movementStepsKo: [
      {
        step: 1,
        title: '환승 승강장 하차',
        location: '1호선(B2F) 또는 2호선(B3F)',
        desc: '하차 후 승강장 내 수직 환승 엘리베이터를 이용해 지하 1층 대합실 중앙으로 이동합니다.'
      },
      {
        step: 2,
        title: '대합실 중앙 분수대 광장',
        location: '지하 1층 대합실',
        desc: '서면역 만남의 광장(중앙)에서 7번 출구(롯데백화점) 또는 9번 출구 표지판을 확인합니다.'
      },
      {
        step: 3,
        title: '지상 엘리베이터 탑승',
        location: '7번 출구 전용 승강기',
        desc: '지하상가 통로를 지나 7번 출구 수직 엘리베이터를 타고 지상 1층 보도로 올라옵니다.'
      }
    ],
    movementStepsEn: [
      {
        step: 1,
        title: 'Platform Exit',
        location: 'Line 1 (B2F) or Line 2 (B3F)',
        desc: 'Take the in-station elevator directly up to the B1 concourse level.'
      },
      {
        step: 2,
        title: 'Concourse Central Plaza',
        location: 'B1 Concourse',
        desc: 'Navigate to the main meeting plaza and follow green signs toward Exit 7 (Lotte) or Exit 9.'
      },
      {
        step: 3,
        title: 'Ground Elevator Ascent',
        location: 'Exit 7 Elevator',
        desc: 'Take the Exit 7 vertical elevator up to street level for immediate flat sidewalk access.'
      }
    ],
    travelerTipsKo: {
      luggage: '1호선과 2호선 간 환승 시 계단 통로 대신 역사 중앙의 휠체어/캐리어 겸용 환승 엘리베이터를 탑승하세요.',
      stroller: '서면 젊음의 거리와 전포 카페거리로 갈 때는 7번 출구 엘리베이터로 지상에 나온 뒤 횡단보도를 이용하는 것이 지하상가 계단보다 훨씬 편합니다.',
      wheelchair: '출퇴근 시간대(08~09시, 18~19시)에는 환승 유동인구가 매우 많으므로 엘리베이터 대기 시간을 감안하여 이동하세요.',
      mobility: '롯데백화점 지하 1층 연결 통로는 백화점 운영시간(10:30~20:00) 내에 완전 무단차로 실내 통행이 가능합니다.'
    },
    travelerTipsEn: {
      luggage: 'Use the central transfer elevator connecting Line 1 and 2 platforms to bypass multi-level staircases.',
      stroller: 'Exit via Exit 7 elevator to the surface before crossing street-level crosswalks toward Jeonpo Cafe Street.',
      wheelchair: 'During peak rush hours, allow extra waiting time due to heavy commuter passenger volumes.',
      mobility: 'The B1 direct connection to Lotte Department Store provides a fully flat indoor passage during opening hours.'
    },
    nearbyPlacesWithContextKo: [
      {
        name: '✨ 서면 젊음의 거리 & 쥬디스태화',
        tag: '도보 4분 · 7번 출구 엘리베이터',
        whyVisit: '부산 최고의 번화가로 트렌디한 패션, 잡화, 로컬 맛집이 밀집되어 있습니다.',
        exitInfo: '7번 출구'
      },
      {
        name: '☕ 전포 카페거리 & 전포 사잇길',
        tag: '도보 10분 · 7번 출구',
        whyVisit: '옛 공구골목을 개조한 감성 카페와 개성 넘치는 편집숍들이 줄지어 있는 명소입니다.',
        exitInfo: '7번 출구 방면'
      },
      {
        name: '🏢 삼정타워 복합문화몰',
        tag: '도보 6분 · 1번 출구 에스컬레이터',
        whyVisit: '쉑쉑버거, CGV, 다양한 엔터테인먼트 시설이 모여 있는 대형 쇼핑몰입니다.',
        exitInfo: '1번 출구 방면'
      }
    ],
    nearbyPlacesWithContextEn: [
      {
        name: '✨ Seomyeon Youth Street',
        tag: '4 min walk · Exit 7 Elevator',
        whyVisit: 'Vibrant heart of Busan packed with trendy fashion boutiques, cosmetics, and street eateries.',
        exitInfo: 'Exit 7'
      },
      {
        name: '☕ Jeonpo Cafe Street',
        tag: '10 min walk · Exit 7',
        whyVisit: 'Artisanal cafes and indie lifestyle boutiques transformed from historic tool repair workshops.',
        exitInfo: 'Exit 7 Direction'
      },
      {
        name: '🏢 Samjung Tower Complex',
        tag: '6 min walk · Exit 1 Escalator',
        whyVisit: 'Multi-level lifestyle center housing Shake Shack, CGV cinema, and experiential entertainment.',
        exitInfo: 'Exit 1 Direction'
      }
    ]
  },

  // 3. 해운대역 (Haeundae Station)
  haeundae: {
    introKo: '해운대역은 대한민국을 대표하는 해변인 해운대 해수욕장과 구남로 문화광장으로 이어지는 거점역입니다. 5번과 7번 출구 사이에 구남로 보행자 전용도로로 바로 이어지는 엘리베이터가 있어 유모차나 캐리어를 끌고 바다까지 편안하게 걸어갈 수 있습니다.',
    introEn: 'Haeundae Station is the gateway to Korea’s most famous beach and the pedestrian-only Gunam-ro cultural avenue. The elevator between Exits 5 and 7 leads directly into Gunam-ro for a scenic, step-free stroll to the ocean.',
    stationRoleKo: '해운대 해수욕장, 구남로 광장, 해운대 전통시장, 블루라인파크 관광의 출발점',
    stationRoleEn: 'Launchpad for Haeundae Beach, Gunam-ro street, traditional market, and coastal trains',
    recommendedExitsExplanationKo: [
      {
        exitNum: '5번·7번 사이 출구',
        targetTitle: '구남로 문화광장 & 해운대 해수욕장 방면',
        reason: '구남로 보행자 전용 도로로 곧장 연결되는 지상 수직 엘리베이터입니다. 바다까지 차도 단차 없이 넓은 보도로 직진할 수 있습니다.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: '3번 출구',
        targetTitle: '구 해운대역사 & 해리단길 카페거리 방면',
        reason: '에스컬레이터와 지상 횡단로를 통해 해운대 뒤편의 감성 골목인 해리단길로 접근하기 편리합니다.',
        hasElevator: false,
        hasEscalator: true
      }
    ],
    recommendedExitsExplanationEn: [
      {
        exitNum: 'Between Exits 5 & 7',
        targetTitle: 'Gunam-ro Cultural Plaza & Haeundae Beach',
        reason: 'Direct elevator to the pedestrian-only plaza. Wide flat sidewalks lead all the way to the sand.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: 'Exit 3',
        targetTitle: 'Old Haeundae Station & Haeridan-gil',
        reason: 'Escalator access toward the trendy boutique and cafe alleys behind the railway plaza.',
        hasElevator: false,
        hasEscalator: true
      }
    ],
    movementStepsKo: [
      {
        step: 1,
        title: '2호선 승강장 하차',
        location: '지하 2층 승강장',
        desc: '장산/양산 방면 승강장에서 하차 후 승강장 엘리베이터를 타고 지하 1층 대합실로 이동합니다.'
      },
      {
        step: 2,
        title: '5·7번 출구 방면 이동',
        location: '지하 1층 대합실',
        desc: '개찰구를 통과한 후 구남로/해수욕장 방향(5·7번 출구 사이) 지상 엘리베이터를 탑승합니다.'
      },
      {
        step: 3,
        title: '구남로 보행광장 직진',
        location: '지상 구남로 광장',
        desc: '차량이 통제된 넓은 보행자 전용 도로를 따라 약 500m 직진하면 해운대 백사장과 바다에 도착합니다.'
      }
    ],
    movementStepsEn: [
      {
        step: 1,
        title: 'Platform Exit (B2F)',
        location: 'Line 2 Platform',
        desc: 'Take the station platform elevator up to the B1 concourse gate area.'
      },
      {
        step: 2,
        title: 'Exit 5/7 Elevator Boarding',
        location: 'B1 Concourse',
        desc: 'Exit through turnstiles and take the ground elevator located between Exits 5 and 7.'
      },
      {
        step: 3,
        title: 'Gunam-ro Walk to Beach',
        location: 'Gunam-ro Street',
        desc: 'Stroll down the wide, vehicle-restricted pedestrian promenade 500m directly to the beach.'
      }
    ],
    travelerTipsKo: {
      luggage: '해운대역 지하 1층 대합실에 대형 캐리어가 들어가는 물품보관함이 마련되어 있어 호텔 체크인 전 짐을 맡기기 좋습니다.',
      stroller: '구남로는 턱이 없는 광폭 보도로 유모차 주행감이 부산에서 가장 우수한 구간 중 하나입니다.',
      wheelchair: '해수욕장 백사장 입구에는 휠체어 진입용 배리어프리 매트(나무 데크)가 설치되어 있어 바다 가까이 접근할 수 있습니다.',
      mobility: '해리단길 방면은 구 역사 철길 횡단로가 평탄하게 정비되어 있어 완만한 걸음으로 이동하기 좋습니다.'
    },
    travelerTipsEn: {
      luggage: 'Large luggage lockers are available at the B1 concourse, perfect for storing bags before hotel check-in.',
      stroller: 'Gunam-ro features broad, curb-free sidewalks offering one of the smoothest stroller experiences in Busan.',
      wheelchair: 'Haeundae Beach entrance provides accessible wooden beach boardwalks extending close to the shoreline.',
      mobility: 'The railway crossing to Haeridan-gil has been remodeled into a flat, accessible pedestrian walkway.'
    },
    nearbyPlacesWithContextKo: [
      {
        name: '🏖️ 해운대 해수욕장 & 호안도로 산책로',
        tag: '도보 7분 · 5번 출구 엘리베이터',
        whyVisit: '시원한 동해 바다와 동백섬으로 이어지는 완만한 해안 산책로가 일품입니다.',
        exitInfo: '5번 출구'
      },
      {
        name: '🍢 해운대 전통시장 (야식 & 꼼장어)',
        tag: '도보 5분 · 5번 출구',
        whyVisit: '구남로 중간에서 만나는 전통 먹거리 골목으로 떡볶이, 튀김, 곰장어 등을 즐길 수 있습니다.',
        exitInfo: '5번 출구 직진'
      },
      {
        name: '🚂 해운대 블루라인파크 미포정거장',
        tag: '도보 18분 또는 버스 연계',
        whyVisit: '해변열차와 스카이캡슐을 타고 동부산 해안 절경을 감상하는 최고 인기 체험 코스입니다.',
        exitInfo: '해운대온천사거리 방면'
      }
    ],
    nearbyPlacesWithContextEn: [
      {
        name: '🏖️ Haeundae Beach & Promenade',
        tag: '7 min walk · Exit 5 Elevator',
        whyVisit: 'Iconic wide sandy beach with scenic waterfront promenades connecting to Dongbaekseom Island.',
        exitInfo: 'Exit 5'
      },
      {
        name: '🍢 Haeundae Traditional Market',
        tag: '5 min walk · Exit 5',
        whyVisit: 'Traditional food street offering street snacks, hotteok, and grilled seafood.',
        exitInfo: 'Along Gunam-ro'
      },
      {
        name: '🚂 Haeundae Blue Line Park (Mipo)',
        tag: '18 min walk or quick taxi',
        whyVisit: 'Famous coastal sightseeing train and Sky Capsules running alongside ocean cliffs.',
        exitInfo: 'Toward Mipo Harbor'
      }
    ]
  },

  // 4. 광안역 (Gwangan Station)
  gwangan: {
    introKo: '광안역은 광안대교 오션뷰와 광안리 해변 테마거리로 연결되는 2호선 대표 해양 관광 거점역입니다. 3번과 5번 출구 엘리베이터를 통해 지상으로 올라오면 해수욕장 중앙 광장과 드론쇼 관람 구역까지 완만한 보도로 이어집니다.',
    introEn: 'Gwangan Station is the gateway to Gwangalli Beach, renowned for its panoramic Gwangan Bridge ocean view and weekend drone light shows. Exits 3 and 5 elevators provide smooth, step-free access to the beach center.',
    stationRoleKo: '광안리 해수욕장, 광안대교 야경 및 해변 카페·펍 테마거리 접근 거점',
    stationRoleEn: 'Access hub for Gwangalli Beach, Gwangan Bridge night views, and coastal cafes',
    recommendedExitsExplanationKo: [
      {
        exitNum: '3번·5번 사이 출구',
        targetTitle: '광안리 해변 테마거리 & 수영구 생활문화센터 방면',
        reason: '광안리 해변 중앙 도로로 직결되는 지상 엘리베이터입니다. 캐리어와 유모차 통행 시 계단 없이 안전하게 지상 보도로 나갈 수 있습니다.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: '1번 출구',
        targetTitle: '광안2동 행정복지센터 & 광안시장 방면',
        reason: '광안교차로 북측 주거·상가 방면으로 연결되며 상하행 에스컬레이터가 완비되어 있습니다.',
        hasElevator: false,
        hasEscalator: true
      }
    ],
    recommendedExitsExplanationEn: [
      {
        exitNum: 'Between Exits 3 & 5',
        targetTitle: 'Gwangalli Beach Theme Street & Center',
        reason: 'Direct elevator leading to the central beach access street with smooth sidewalks all the way to the water.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: 'Exit 1',
        targetTitle: 'Gwangan-dong Community Center & Market',
        reason: 'Bidirectional escalator access toward northern commercial and residential districts.',
        hasElevator: false,
        hasEscalator: true
      }
    ],
    movementStepsKo: [
      {
        step: 1,
        title: '2호선 승강장 하차',
        location: '지하 2층 승강장',
        desc: '승강장 중앙 엘리베이터를 탑승하여 지하 1층 대합실로 이동합니다.'
      },
      {
        step: 2,
        title: '대합실 와이드 게이트 통과',
        location: '지하 1층 대합실',
        desc: '광폭 개찰구를 통과한 후 3·5번 출구 방면 수직 엘리베이터로 이동합니다.'
      },
      {
        step: 3,
        title: '지상 엘리베이터 탑승',
        location: '3·5번 출구 승강기',
        desc: '엘리베이터를 타고 지상 1층 도로변 인도로 올라옵니다.'
      },
      {
        step: 4,
        title: '광안로 해변길 직진',
        location: '지상 광안로 보도',
        desc: '완만한 내리막 보도를 따라 바다 방향으로 약 700m 직진하면 광안리 해변에 도착합니다.'
      }
    ],
    movementStepsEn: [
      {
        step: 1,
        title: 'Platform Exit (B2F)',
        location: 'Line 2 Platform',
        desc: 'Take the station elevator up to the B1 concourse gate area.'
      },
      {
        step: 2,
        title: 'Wide Gate Passage',
        location: 'B1 Concourse',
        desc: 'Pass through the wide turnstiles toward Exits 3 and 5.'
      },
      {
        step: 3,
        title: 'Ground Elevator Ascent',
        location: 'Exit 3/5 Elevator',
        desc: 'Ride the elevator up to street level.'
      },
      {
        step: 4,
        title: 'Stroll down Gwangan-ro',
        location: 'Gwangan-ro Sidewalk',
        desc: 'Walk straight along the paved sidewalk approx. 700m down to Gwangalli Beach.'
      }
    ],
    travelerTipsKo: {
      luggage: '대합실에 소형 50개, 대형 20개, 특대 10개의 물품보관함이 구비되어 있어 바다 산책 전 캐리어를 맡기기 좋습니다.',
      stroller: '광안로 보도는 정비가 잘 되어 있어 유모차 주행이 무난하며, 해변 산책로도 평탄한 보행 데크로 구성되어 있습니다.',
      wheelchair: '광안리 해변로 진입 시 3·5번 출구 엘리베이터를 이용하시면 단차 없이 도로변으로 진입할 수 있습니다.',
      mobility: '주말 드론쇼 관람 시간대에는 인파가 몰리므로 엘리베이터 탑승에 약간의 여유 시간을 두시길 권장합니다.'
    },
    travelerTipsEn: {
      luggage: 'Lockers (50 S, 20 L, 10 XL) in the concourse let you store heavy bags before exploring the beach.',
      stroller: 'Gwangan-ro sidewalk and the beachfront promenade are paved and flat, suitable for strollers.',
      wheelchair: 'Take Exits 3/5 elevator to street level for a barrier-free route directly to the seaside.',
      mobility: 'Allow extra time for elevators on Saturday evenings when crowds gather for the drone shows.'
    },
    nearbyPlacesWithContextKo: [
      {
        name: '🌉 광안리 해수욕장 & 드론 라이트쇼',
        tag: '도보 10분 · 3번·5번 출구 엘리베이터',
        whyVisit: '광안대교의 다채로운 야경과 매주 토요일 밤 펼쳐지는 상설 드론쇼를 관람할 수 있습니다.',
        exitInfo: '3·5번 출구 방면'
      },
      {
        name: '☕ 광안리 해변 카페거리 & 펍',
        tag: '도보 10분 · 3번·5번 출구',
        whyVisit: '바다를 마주보며 커피와 수제맥주를 즐길 수 있는 오션뷰 테라스 매장들이 밀집해 있습니다.',
        exitInfo: '해변로 일대'
      },
      {
        name: '🐟 민락수변공원 & 밀락더마켓',
        tag: '도보 20분 또는 버스 연계',
        whyVisit: '트렌디한 복합문화공간 밀락더마켓과 바다 경관을 함께 즐길 수 있는 동남측 명소입니다.',
        exitInfo: '민락동 방면'
      }
    ],
    nearbyPlacesWithContextEn: [
      {
        name: '🌉 Gwangalli Beach & Drone Light Show',
        tag: '10 min walk · Exit 3/5 Elevator',
        whyVisit: 'Spectacular views of Gwangan Diamond Bridge and weekly Saturday evening drone displays.',
        exitInfo: 'Exits 3 & 5 Direction'
      },
      {
        name: '☕ Gwangalli Oceanfront Cafe & Pub Street',
        tag: '10 min walk · Exits 3 & 5',
        whyVisit: 'Scenic terraces offering specialty coffee, craft beer, and panoramic sunset beach views.',
        exitInfo: 'Along Beach Road'
      },
      {
        name: '🐟 Millac the Market & Waterfront Park',
        tag: '20 min walk or short bus ride',
        whyVisit: 'Trendy cultural complex featuring gourmet food halls, craft shops, and ocean seating.',
        exitInfo: 'Toward Millak-dong'
      }
    ]
  },

  // 5. 벡스코역 (Bexco Station)
  bexco: {
    introKo: '벡스코역은 부산 지하철 2호선과 동해선 광역전철이 만나는 환승역이자, 국제 컨벤션 센터인 벡스코(BEXCO)와 센텀시티 문화 상권으로 이어지는 핵심 관문입니다. 7번과 9번 출구의 대형 엘리베이터를 이용하면 박람회장과 미술관까지 무거운 짐이나 전시 물품을 편안하게 운반할 수 있습니다.',
    introEn: 'BEXCO Station is the major transfer interchange between Line 2 and the Donghae Line, serving the world-class BEXCO Exhibition Center and Centum City arts quarter. Exits 7 and 9 elevators provide direct step-free access to conventions and museums.',
    stationRoleKo: '국제 박람회/전시(BEXCO), 시립미술관, 동해선 광역전철 환승의 중심',
    stationRoleEn: 'International exhibition hub (BEXCO), arts district, and Donghae commuter rail junction',
    recommendedExitsExplanationKo: [
      {
        exitNum: '7번 출구',
        targetTitle: '벡스코 제1전시장 & 오디토리움 방면',
        reason: '벡스코 제1전시장 야외 광장으로 직통 연결되는 광폭 엘리베이터입니다. 대형 캐리어와 휠체어가 가장 쾌적하게 이동할 수 있습니다.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: '5번 출구',
        targetTitle: '부산시립미술관 & 이우환공간 방면',
        reason: '시립미술관 정문 및 조각 공원으로 연결되는 승강기로 문화 예술 관람객에게 최적입니다.',
        hasElevator: true,
        hasEscalator: false
      }
    ],
    recommendedExitsExplanationEn: [
      {
        exitNum: 'Exit 7',
        targetTitle: 'BEXCO Main Exhibition Hall 1 & Auditorium',
        reason: 'Direct spacious elevator opening directly onto the BEXCO open-air plaza. Ideal for luggage and wheelchairs.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: 'Exit 5',
        targetTitle: 'Busan Museum of Art & Space Lee Ufan',
        reason: 'Direct elevator leading to the museum entrance and sculpture garden.',
        hasElevator: true,
        hasEscalator: false
      }
    ],
    movementStepsKo: [
      {
        step: 1,
        title: '2호선 또는 동해선 하차',
        location: '승강장',
        desc: '승강장 엘리베이터를 타고 지하 1층 통합 대합실로 이동합니다.'
      },
      {
        step: 2,
        title: '7번 출구 벡스코 방향 이동',
        location: '지하 1층 대합실',
        desc: '넓은 직선형 대합실을 따라 7번 출구 지상 엘리베이터 탑승구로 이동합니다.'
      },
      {
        step: 3,
        title: '벡스코 야외 광장 진입',
        location: '지상 1층 광장',
        desc: '지상으로 나온 후 단차 없는 보도블록을 통해 전시장 로비로 바로 들어갑니다.'
      }
    ],
    movementStepsEn: [
      {
        step: 1,
        title: 'Train Arrival',
        location: 'Line 2 or Donghae Platform',
        desc: 'Ride the platform elevator up to the integrated concourse.'
      },
      {
        step: 2,
        title: 'Proceed toward Exit 7',
        location: 'B1 Concourse',
        desc: 'Follow the wide concourse corridor toward the Exit 7 elevator.'
      },
      {
        step: 3,
        title: 'BEXCO Plaza Entry',
        location: 'Ground Level Plaza',
        desc: 'Step out onto the flat paved plaza and walk directly into the exhibition lobby.'
      }
    ],
    travelerTipsKo: {
      luggage: '동해선(기장·오시리아 방면) 환승 시 환승 통로에 완만한 경사로와 수직 승강기가 설치되어 있어 캐리어 이동이 수월합니다.',
      stroller: '벡스코 제1전시장과 제2전시장 사이는 실내 무빙워크 및 경사로로 연결되어 있어 유모차로 날씨에 구애받지 않고 다닐 수 있습니다.',
      wheelchair: '벡스코 내부 전시장과 오디토리움은 넓은 통로와 완만한 경사로로 설계되어 단차 부담이 적습니다.',
      mobility: '시립미술관 야외 조각공원은 완만한 잔디 산책로가 조성되어 있어 휠체어와 어르신 산책에 훌륭합니다.'
    },
    travelerTipsEn: {
      luggage: 'The Donghae Line transfer walkway features gentle ramps and elevators, making luggage transit smooth.',
      stroller: 'Exhibition Hall 1 and Hall 2 are connected via an indoor climate-controlled bridge with moving walkways.',
      wheelchair: 'The BEXCO complex and auditorium are designed with wide accessible pathways and gentle ramps throughout.',
      mobility: 'The outdoor sculpture park at the Busan Museum of Art offers gentle grass trails suitable for restful walks.'
    },
    nearbyPlacesWithContextKo: [
      {
        name: '🏛️ 벡스코 (BEXCO) 컨벤션 센터',
        tag: '도보 2분 · 7번 출구 엘리베이터',
        whyVisit: '국제 모터쇼, 지스타, 대형 콘서트 및 다양한 글로벌 페어가 열리는 대표 전시 컨벤션 공간입니다.',
        exitInfo: '7번 출구'
      },
      {
        name: '🖼️ 부산시립미술관 & 이우환공간',
        tag: '도보 4분 · 5번 출구 엘리베이터',
        whyVisit: '한국 현대 미술의 정수를 감상할 수 있는 미술관과 세계적인 거장 이우환 화백의 전용 전시 공간입니다.',
        exitInfo: '5번 출구'
      },
      {
        name: '🏬 신세계백화점 센텀시티점 & 스파랜드',
        tag: '지하철 1정거장 (센텀시티역) 또는 도보 10분',
        whyVisit: '세계 최대 규모의 백화점 쇼핑몰과 고급 천연 탄산 온천 스파랜드를 즐길 수 있습니다.',
        exitInfo: '센텀시티역 연계'
      }
    ],
    nearbyPlacesWithContextEn: [
      {
        name: '🏛️ BEXCO Exhibition & Convention Center',
        tag: '2 min walk · Exit 7 Elevator',
        whyVisit: 'Flagship international venue hosting major world conventions, motor shows, and concerts.',
        exitInfo: 'Exit 7'
      },
      {
        name: '🖼️ Busan Museum of Art & Space Lee Ufan',
        tag: '4 min walk · Exit 5 Elevator',
        whyVisit: 'Renowned modern art exhibitions and the dedicated pavilion of master artist Lee Ufan.',
        exitInfo: 'Exit 5'
      },
      {
        name: '🏬 Shinsegae Centum City & Spa Land',
        tag: '1 stop or 10 min walk',
        whyVisit: 'World-record shopping complex and premium natural mineral hot spring Korean bathhouse.',
        exitInfo: 'Centum City connection'
      }
    ]
  },

  // 6. 전포역 (Jeonpo Station)
  jeonpo: {
    introKo: '전포역은 부산의 대표적인 트렌디 골목인 전포 카페거리와 전포사잇길 공방 거리로 직결되는 2호선 역입니다. 3번과 4번 출구의 지상 엘리베이터 및 7번·8번 출구의 상하행 에스컬레이터를 활용하면, 개성 넘치는 로스터리 카페와 베이커리 골목을 단차 없이 쾌적하게 둘러볼 수 있습니다.',
    introEn: 'Jeonpo Station directly connects to Busan’s vibrant Jeonpo Cafe Street and boutique craft workshops. Utilizing the elevators at Exits 3 and 4 or the bidirectional escalators at Exits 7 and 8 allows travelers to explore trendy roasteries and lifestyle shops with step-free convenience.',
    stationRoleKo: '전포 카페거리 & 전포사잇길 공방·디저트 골목 보행 접근 거점',
    stationRoleEn: 'Access hub for Jeonpo Cafe Street, artisanal roasteries, and indie craft alleys',
    recommendedExitsExplanationKo: [
      {
        exitNum: '4번 출구',
        targetTitle: '경남공고 & 전포사잇길 카페골목 방면',
        reason: '지상 수직 엘리베이터가 보도와 바로 연결되어 전포사잇길의 감성 상점과 카페 방면으로 계단 없이 이동할 수 있습니다.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: '7번 출구',
        targetTitle: '놀이마루 & 전포 카페거리 북측 방면',
        reason: '상하행 에스컬레이터가 모두 설치되어 있어 계단 보행 부담 없이 서면 젊음의 거리와 전포 카페거리 중심가로 이동하기 좋습니다.',
        hasElevator: false,
        hasEscalator: true
      },
      {
        exitNum: '3번 출구',
        targetTitle: '부산진소방서 & 전포1파출소 방면',
        reason: '도로 남측 방면으로 연결되는 수직 엘리베이터로 유모차 및 휠체어 지상 진출입에 적합합니다.',
        hasElevator: true,
        hasEscalator: false
      }
    ],
    recommendedExitsExplanationEn: [
      {
        exitNum: 'Exit 4',
        targetTitle: 'Gyeongnam Technical High & Jeonpo Saet-gil',
        reason: 'Ground vertical elevator connects directly to the sidewalk for step-free access toward boutique roasteries and craft stores.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: 'Exit 7',
        targetTitle: 'Norimaru Cultural Center & Cafe Street North',
        reason: 'Equipped with bidirectional escalators for effortless ascent toward the heart of the cafe street and central Seomyeon.',
        hasElevator: false,
        hasEscalator: true
      },
      {
        exitNum: 'Exit 3',
        targetTitle: 'Busanjin Fire Station & Jeonpo 1 Police Box',
        reason: 'Vertical elevator providing barrier-free pavement access on the southern side of the thoroughfare.',
        hasElevator: true,
        hasEscalator: false
      }
    ],
    movementStepsKo: [
      {
        step: 1,
        title: '2호선 승강장 하차',
        location: '지하 2층 승강장',
        desc: '열차 하차 후 승강장 중앙 교통약자 엘리베이터를 타고 지하 1층 대합실로 올라갑니다.'
      },
      {
        step: 2,
        title: '대합실 광폭 개찰구 통과',
        location: '지하 1층 대합실',
        desc: '캐리어 및 유모차가 원활하게 통과하는 와이드 개찰구를 통과합니다.'
      },
      {
        step: 3,
        title: '목적지별 승강 설비 이용',
        location: '출구 연결 구역',
        desc: '카페거리 골목 이동 시 4번 출구 엘리베이터 또는 7번 출구 에스컬레이터를 선택합니다.'
      },
      {
        step: 4,
        title: '지상 평탄 보도 진입',
        location: '지상 1층 보도',
        desc: '포장된 인도를 따라 완만하게 이동하며 전포동 골목 상권을 탐방합니다.'
      }
    ],
    movementStepsEn: [
      {
        step: 1,
        title: 'Platform Arrival (B2F)',
        location: 'Line 2 Platform',
        desc: 'Step off the train and take the central elevator up to the B1 concourse.'
      },
      {
        step: 2,
        title: 'Wide Gate Clearance',
        location: 'B1 Concourse',
        desc: 'Pass through the wide automated gate suitable for luggage and strollers.'
      },
      {
        step: 3,
        title: 'Choose Accessible Exit',
        location: 'Exit Corridors',
        desc: 'Take Exit 4 elevator or Exit 7 escalator depending on your cafe destination.'
      },
      {
        step: 4,
        title: 'Sidewalk Entry',
        location: 'Ground Level Sidewalk',
        desc: 'Proceed along paved sidewalks directly into the bustling cafe alleyways.'
      }
    ],
    travelerTipsKo: {
      luggage: '전포역 대합실에는 소형 32개, 대형 26개, 특대 14개의 물품보관함이 구비되어 있어 캐리어를 안전하게 보관하고 가볍게 카페 투어를 즐길 수 있습니다.',
      stroller: '전포사잇길 방면은 4번 출구 엘리베이터를 이용해 지상으로 나온 후 넓은 보도를 따라 진입하시는 것이 가장 수월합니다.',
      wheelchair: '3번과 4번 출구에 지상 직통 수직 엘리베이터가 운영 중이므로 계단 단차 없이 지상 도로변으로 이동할 수 있습니다.',
      mobility: '7번과 8번 출구에는 상행과 하행 에스컬레이터가 모두 완비되어 있어 다리 부담 없이 이동이 가능합니다.'
    },
    travelerTipsEn: {
      luggage: 'Concourse lockers (32 S, 26 L, 14 XL) provide ample space for heavy luggage before cafe hopping.',
      stroller: 'Take the Exit 4 elevator to reach ground sidewalks with smooth rolling surfaces toward Jeonpo Saet-gil.',
      wheelchair: 'Vertical elevators at Exits 3 and 4 ensure a complete step-free transit from platform to street.',
      mobility: 'Bidirectional escalators at Exits 7 and 8 offer effortless vertical transit without climbing stairs.'
    },
    nearbyPlacesWithContextKo: [
      {
        name: '☕ 전포 카페거리',
        tag: '도보 5분 · 7번 출구 에스컬레이터',
        whyVisit: '개성 있는 스페셜티 커피 전문점과 로컬 디저트 베이커리가 모여 있는 부산의 대표 감성 거리입니다.',
        exitInfo: '7번 출구 에스컬레이터'
      },
      {
        name: '🎨 전포 사잇길 공방 & 소품숍',
        tag: '도보 3분 · 4번 출구 엘리베이터',
        whyVisit: '아기자기한 핸드메이드 소품숍, 빈티지 의류점, 감각적인 브런치 카페가 골목골목 이어집니다.',
        exitInfo: '4번 출구 엘리베이터'
      },
      {
        name: '🍔 버거샵 전포본점 & 로컬 맛집',
        tag: '도보 4분 · 8번 출구 에스컬레이터',
        whyVisit: '수제버거 명소와 트렌디한 다이닝 공간들이 위치하여 젊은 여행자들의 인기를 끌고 있습니다.',
        exitInfo: '8번 출구 에스컬레이터'
      }
    ],
    nearbyPlacesWithContextEn: [
      {
        name: '☕ Jeonpo Cafe Street',
        tag: '5 min walk · Exit 7 Escalator',
        whyVisit: 'Busan’s renowned cafe quarter packed with specialty coffee roasters and artisanal bakeries.',
        exitInfo: 'Exit 7 Escalator'
      },
      {
        name: '🎨 Jeonpo Saet-gil Craft Alleys',
        tag: '3 min walk · Exit 4 Elevator',
        whyVisit: 'Charming lanes lined with handmade craft workshops, lifestyle boutiques, and cozy brunch spots.',
        exitInfo: 'Exit 4 Elevator'
      },
      {
        name: '🍔 Burger Shop & Local Eateries',
        tag: '4 min walk · Exit 8 Escalator',
        whyVisit: 'Famous gourmet burger joint and trendy dining venues popular among foodies.',
        exitInfo: 'Exit 8 Escalator'
      }
    ]
  },

  // 7. 부전역 (Bujeon Station)
  bujeon: {
    introKo: '부전역은 부산 최대 규모의 전통시장인 부전시장 상권과 동해선 광역전철(기장·오시리아·울산 태화강 방면) 및 일반철도 부전역을 잇는 교통 환승 거점입니다. 1호선 3번·6번 출구의 수직 엘리베이터와 부전몰 에스컬레이터를 활용하면 무거운 장바구니나 캐리어를 가지고도 효율적으로 이동할 수 있습니다.',
    introEn: 'Bujeon Station connects Busan’s largest traditional market (Bujeon Market) with the Donghae commuter rail line and national rail station. Using the vertical elevators at Exits 3 and 6 or the Bujeon Mall escalators ensures smooth movement with luggage or shopping bags.',
    stationRoleKo: '부전 전통시장 먹거리 상권 및 동해선 광역전철 환승 거점',
    stationRoleEn: 'Transit hub for Bujeon Traditional Market & Donghae commuter rail connection',
    recommendedExitsExplanationKo: [
      {
        exitNum: '6번 출구',
        targetTitle: '부전 기차역 (국철·동해선 환승) & 부전전통시장',
        reason: '지상 수직 엘리베이터가 설치되어 있어 기차역 및 시장 북측 진입로로 단차 없이 연결됩니다.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: '3번 출구',
        targetTitle: '부전지구대 & 부전1동 주민센터 방면',
        reason: '중앙대로 서측 보도로 바로 올라가는 수직 승강기로 휠체어와 유모차 이동에 안전합니다.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: '부전몰 3번·5번 출구',
        targetTitle: '부전인삼시장 & 부전상가 지하 직결',
        reason: '부전몰 지하상가 연결 상하행 에스컬레이터로 전통시장 내부 통로로 편안하게 접근할 수 있습니다.',
        hasElevator: false,
        hasEscalator: true
      }
    ],
    recommendedExitsExplanationEn: [
      {
        exitNum: 'Exit 6',
        targetTitle: 'Bujeon Rail Station (Donghae Line) & Traditional Market',
        reason: 'Equipped with a vertical elevator providing step-free access toward the national rail station and market north entrance.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: 'Exit 3',
        targetTitle: 'Bujeon Police Box & Community Center',
        reason: 'Vertical elevator leading directly to the western sidewalk of Jungang-daero boulevard.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: 'Bujeon Mall Exits 3 & 5',
        targetTitle: 'Bujeon Ginseng Market & Shopping Mall',
        reason: 'Bidirectional escalators connecting to the underground market arcade with sheltered transit.',
        hasElevator: false,
        hasEscalator: true
      }
    ],
    movementStepsKo: [
      {
        step: 1,
        title: '1호선 승강장 하차',
        location: '지하 2층 승강장',
        desc: '승강장 내 수직 승강기를 탑승하여 지하 1층 대합실로 이동합니다.'
      },
      {
        step: 2,
        title: '대합실 개찰구 통과',
        location: '지하 1층 대합실',
        desc: '넓은 통로의 광폭 개찰구를 통해 안전하게 통과합니다.'
      },
      {
        step: 3,
        title: '동해선/시장 방향 출구 선택',
        location: '출구 연결 통로',
        desc: '동해선 환승 및 시장은 6번 출구 엘리베이터를, 지하상가는 부전몰 에스컬레이터를 이용합니다.'
      },
      {
        step: 4,
        title: '지상 환승로 및 시장 진입',
        location: '지상 1층 보도',
        desc: '지상 평탄 보행로를 따라 부전 기차역(약 300m) 또는 전통시장 골목으로 이동합니다.'
      }
    ],
    movementStepsEn: [
      {
        step: 1,
        title: 'Platform Exit (B2F)',
        location: 'Line 1 Platform',
        desc: 'Take the platform elevator up to the B1 concourse level.'
      },
      {
        step: 2,
        title: 'Concourse Gate Clearance',
        location: 'B1 Concourse',
        desc: 'Proceed through the wide accessibility fare gates.'
      },
      {
        step: 3,
        title: 'Choose Exit Pathway',
        location: 'Exit Corridors',
        desc: 'Take Exit 6 elevator for Donghae rail station transfer or Bujeon Mall escalators for market arcade.'
      },
      {
        step: 4,
        title: 'Surface Connection',
        location: 'Ground Level Sidewalk',
        desc: 'Follow the flat street sidewalk approx. 300m toward Bujeon Railway Station or market lanes.'
      }
    ],
    travelerTipsKo: {
      luggage: '1호선 대합실에 물품보관함(소10, 중12, 특대4)이 운영 중이며, 동해선 기차 환승 시 6번 출구 엘리베이터로 지상에 올라오시면 수월합니다.',
      stroller: '부전시장 방문 시 6번 출구 엘리베이터를 이용하시면 계단 턱 없이 지상 인도로 바로 연결됩니다.',
      wheelchair: '1호선 지하철역과 동해선 부전역 간의 환승은 지상 옥외 보행로를 통과하므로 6번 출구 엘리베이터를 이용한 지상 이동을 권장합니다.',
      mobility: '부전몰 지하상가 이용 시 부전몰 3번 및 5번 출구의 상하행 에스컬레이터를 활용하시면 계단 보행을 피할 수 있습니다.'
    },
    travelerTipsEn: {
      luggage: 'Concourse lockers (10 S, 12 M, 4 XL) are available for luggage storage before visiting the busy market.',
      stroller: 'Take the Exit 6 elevator to avoid stairs and roll smoothly along the sidewalk toward the market.',
      wheelchair: 'Transfer between Metro Line 1 and Donghae Line involves an outdoor surface walk; Exit 6 elevator provides step-free street access.',
      mobility: 'Utilize Bujeon Mall Exits 3 & 5 bidirectional escalators for easy indoor underground shopping access.'
    },
    nearbyPlacesWithContextKo: [
      {
        name: '🥬 부전 전통시장 & 먹거리 타운',
        tag: '도보 3분 · 부전몰 3·5번 출구 / 6번 출구',
        whyVisit: '신선한 농수산물, 손칼국수, 수제어묵, 고래사어묵 본점 등 풍성한 먹거리가 가득한 대형 전통시장입니다.',
        exitInfo: '6번 출구 및 부전몰 에스컬레이터'
      },
      {
        name: '🚆 동해선 부전역 (기장·오시리아 방면)',
        tag: '도보 5분 · 6번 출구 엘리베이터 연계',
        whyVisit: '기장 롯데월드, 오시리아 관광단지, 일광해수욕장, 울산 태화강 방면 광역전철 환승역입니다.',
        exitInfo: '6번 출구 연계'
      },
      {
        name: '🌳 송상현광장 & 부산시민공원 연계',
        tag: '도보 7분 · 8번 출구 방면',
        whyVisit: '도심 속 잔디광장과 실개천이 흐르는 완만한 힐링 산책 명소입니다.',
        exitInfo: '8번 출구 방면'
      }
    ],
    nearbyPlacesWithContextEn: [
      {
        name: '🥬 Bujeon Traditional Market',
        tag: '3 min walk · Exit 6 / Bujeon Mall Exits 3 & 5',
        whyVisit: 'Busan’s largest traditional market packed with fresh seafood, hand-cut noodles, and local fishcake shops.',
        exitInfo: 'Exit 6 & Bujeon Mall Escalators'
      },
      {
        name: '🚆 Donghae Line Bujeon Station',
        tag: '5 min walk · Exit 6 Elevator Connection',
        whyVisit: 'Commuter rail terminus heading to Gijang, OSIRIA tourist complex, Lotte World, and Ulsan.',
        exitInfo: 'Exit 6 Connection'
      },
      {
        name: '🌳 Songsanghyeon Square & Citizens Park',
        tag: '7 min walk · Exit 8 Direction',
        whyVisit: 'Spacious urban lawn park and gentle waterside promenade ideal for peaceful walks.',
        exitInfo: 'Exit 8 Direction'
      }
    ]
  },

  // 8. 남포역 (Nampo Station)
  nampo: {
    introKo: '남포역은 자갈치시장, 영도대교, 용두산공원, 롯데백화점 광복점을 아우르는 부산 원도심의 심장입니다. 1호선 단일 노선이지만 지하상가와 백화점이 얽혀 있어, 4번 출구 수직 엘리베이터나 롯데백화점(8·10번 출구) 연결 통로를 기준점으로 잡는 것이 이동의 핵심입니다.',
    introEn: 'Nampo Station is the cultural pulse of Busan’s historic downtown, connecting Jagalchi Market, Yeongdo Bridge, Yongdusan Park, and Lotte Dept. Store Gwangbok. Using Exit 4 elevator or the department store (Exits 8/10) connections ensures seamless navigation.',
    stationRoleKo: '부산 원도심 항구 문화, 전통 어시장, 광복로 패션거리의 핵심 중심역',
    stationRoleEn: 'Heart of historic port culture, seafood markets, and Gwangbok-ro fashion avenue',
    recommendedExitsExplanationKo: [
      {
        exitNum: '4번 출구',
        targetTitle: '남포동 건어물시장 & 영도대교 입구 방면',
        reason: '지상 수직 엘리베이터가 도로변 보도와 직통 연결되어 단차 없이 건어물시장 및 영도대교로 이동할 수 있습니다.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: '8번·10번 출구 (롯데백화점 광복점)',
        targetTitle: '롯데백화점 실내 직결 & 영도대교 도개 관람로',
        reason: '백화점 지하 연결 통로로 실내 승강기를 이용할 수 있으며, 영도대교 보행로로 단차 없이 이어집니다.',
        hasElevator: true,
        hasEscalator: true
      },
      {
        exitNum: '6번·7번 출구',
        targetTitle: '광복로 패션거리 & 용두산공원 방면',
        reason: '상하행 에스컬레이터가 구비되어 있어 광복로 중심 상권 및 용두산공원 에스컬레이터 방면으로 편리하게 진입합니다.',
        hasElevator: false,
        hasEscalator: true
      }
    ],
    recommendedExitsExplanationEn: [
      {
        exitNum: 'Exit 4',
        targetTitle: 'Nampo Dried Seafood Market & Yeongdo Bridge Entrance',
        reason: 'Ground vertical elevator directly connecting to the street sidewalk for a step-free route toward seafood markets.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: 'Exits 8 & 10 (Lotte Mall)',
        targetTitle: 'Lotte Dept. Store Indoor Connection & Yeongdo Bridge',
        reason: 'Direct indoor connection to the mall elevators and step-free bridge walkway, optimal in all weather.',
        hasElevator: true,
        hasEscalator: true
      },
      {
        exitNum: 'Exits 6 & 7',
        targetTitle: 'Gwangbok-ro Fashion Street & Yongdusan Park',
        reason: 'Bidirectional escalators offering comfortable ascent toward Gwangbok-ro shopping and park escalators.',
        hasElevator: false,
        hasEscalator: true
      }
    ],
    movementStepsKo: [
      {
        step: 1,
        title: '1호선 승강장 하차',
        location: '지하 2층 승강장',
        desc: '승강장 내 수직 승강기를 타고 지하 1층 대합실로 올라갑니다.'
      },
      {
        step: 2,
        title: '대합실에서 목적지 확인',
        location: '지하 1층 대합실',
        desc: '광복로·용두산은 7번 출구 방향, 영도대교·백화점은 8·10번 연결로, 건어물시장은 4번 엘리베이터를 확인합니다.'
      },
      {
        step: 3,
        title: '승강기 또는 에스컬레이터 탑승',
        location: '출구 연결 구역',
        desc: '선택한 출구의 엘리베이터 또는 에스컬레이터를 타고 지상으로 올라옵니다.'
      },
      {
        step: 4,
        title: '원도심 보도 진입',
        location: '지상 1층 보도',
        desc: '턱 없는 보행로를 따라 광복로 패션거리나 영도대교 해안길로 이동합니다.'
      }
    ],
    movementStepsEn: [
      {
        step: 1,
        title: 'Platform Exit (B2F)',
        location: 'Line 1 Platform',
        desc: 'Ride the platform elevator up to the B1 main concourse.'
      },
      {
        step: 2,
        title: 'Check Destination Direction',
        location: 'B1 Concourse',
        desc: 'Follow signs for Exit 7 (Gwangbok-ro), Exits 8/10 (Lotte Mall), or Exit 4 (Seafood Market elevator).'
      },
      {
        step: 3,
        title: 'Ascend to Surface',
        location: 'Selected Exit Corridor',
        desc: 'Take the corresponding elevator or escalator up to ground level.'
      },
      {
        step: 4,
        title: 'Downtown Walk',
        location: 'Ground Level Sidewalk',
        desc: 'Proceed along flat pedestrian paths into Gwangbok-ro or toward the coastal promenade.'
      }
    ],
    travelerTipsKo: {
      luggage: '대합실 내 소형 33개, 중형 46개, 특대 42개 규모의 보관함이 갖추어져 있어 대형 캐리어를 안전하게 보관할 수 있습니다.',
      stroller: '롯데백화점 광복점 방면 8·10번 연결 통로는 턱이 없어 비나 더위를 피해 실내 승강기로 지상 진출입이 가능합니다.',
      wheelchair: '4번 출구 옥외 수직 엘리베이터를 이용하시면 영도대교 및 건어물시장 방면 인도로 바로 연결됩니다.',
      mobility: '6번 및 7번 출구의 상하행 에스컬레이터를 활용하시면 남포동 중심 상권과 용두산공원 방면으로 편하게 이동할 수 있습니다.'
    },
    travelerTipsEn: {
      luggage: 'Spacious lockers (33 S, 46 M, 42 XL) are available in the concourse, accommodating even extra-large suitcases.',
      stroller: 'Exits 8 and 10 indoor connection to Lotte Department Store provides a weather-sheltered, curb-free route.',
      wheelchair: 'Exit 4 outdoor vertical elevator connects smoothly to sidewalks heading toward Yeongdo Bridge and dried seafood markets.',
      mobility: 'Bidirectional escalators at Exits 6 and 7 ensure comfortable access to central downtown shopping.'
    },
    nearbyPlacesWithContextKo: [
      {
        name: '🌉 영도대교 (도개 행사 관람)',
        tag: '도보 3분 · 4번 출구 엘리베이터 / 8번 출구',
        whyVisit: '매주 토요일 오후 다리가 들어올려지는 장관을 감상할 수 있는 부산 유일의 도개교입니다.',
        exitInfo: '4번 출구 엘리베이터'
      },
      {
        name: '🗼 용두산공원 & 부산 다이아몬드타워',
        tag: '도보 6분 · 7번 출구 에스컬레이터',
        whyVisit: '광복로에서 야외 에스컬레이터를 타고 올라갈 수 있는 원도심의 상징 공원으로 도심 파노라마 뷰가 펼쳐집니다.',
        exitInfo: '7번 출구 에스컬레이터'
      },
      {
        name: '🏬 롯데백화점 광복점 옥상전망대',
        tag: '지하 직결 · 8·10번 출구',
        whyVisit: '13층 옥상정원에서 부산항, 영도대교, 남항 바다를 360도 무료로 조망할 수 있습니다.',
        exitInfo: '8·10번 출구 연계'
      }
    ],
    nearbyPlacesWithContextEn: [
      {
        name: '🌉 Yeongdodaegyo Bridge (Drawbridge Event)',
        tag: '3 min walk · Exit 4 Elevator / Exit 8',
        whyVisit: 'Historic bascule bridge that lifts dramatically over the sea every Saturday afternoon.',
        exitInfo: 'Exit 4 Elevator'
      },
      {
        name: '🗼 Yongdusan Park & Busan Diamond Tower',
        tag: '6 min walk · Exit 7 Escalator',
        whyVisit: 'Landmark hilltop park offering panoramic harbor vistas, reachable via covered escalators from Gwangbok-ro.',
        exitInfo: 'Exit 7 Escalator'
      },
      {
        name: '🏬 Lotte Mall Gwangbok Sky Park',
        tag: 'Direct Mall Connection · Exits 8 & 10',
        whyVisit: '13F rooftop observatory offering free 360-degree views over Busan Harbor and Yeongdo.',
        exitInfo: 'Exits 8 & 10 Connection'
      }
    ]
  },

  // 9. 수영역 (Suyeong Station)
  suyeong: {
    introKo: '수영역은 부산 지하철 2호선(해운대·서면 방면)과 3호선(대저·연산 방면)이 만나는 핵심 환승역이자 수영사적공원과 팔도시장으로 연결되는 역사문화 거점입니다. 2호선과 3호선 승강장 사이에 환승 엘리베이터가 설치되어 있어 노선 간 수평 이동이 수월하며, 1번·10번·11번 출구의 수직 승강기로 단차 없이 지상으로 진출입할 수 있습니다.',
    introEn: 'Suyeong Station is the major transfer interchange between Line 2 and Line 3, providing direct access to Suyeong Historical Park and Paldo Traditional Market. In-station elevators connect platforms seamlessly, while Exits 1, 10, and 11 feature ground elevators for step-free surface access.',
    stationRoleKo: '2·3호선 수평 환승 및 수영사적공원·팔도시장 연계 거점',
    stationRoleEn: 'Line 2/3 transfer hub & historic Suyeong Historical Park gateway',
    recommendedExitsExplanationKo: [
      {
        exitNum: '1번 출구',
        targetTitle: '수영사적공원 & 수영동우체국 방면',
        reason: '수영사적공원 산책로 방향으로 연결되는 지상 수직 엘리베이터로 유모차와 어르신 산책에 가장 적합합니다.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: '11번 출구',
        targetTitle: '팔도시장 입구 남측 방면',
        reason: '전통 먹거리 시장인 팔도시장 방면 수직 승강기로 장보기 및 로컬 맛집 탐방 시 단차 부담을 덜어줍니다.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: '15번 출구',
        targetTitle: '광안리 방면 수영교차로 남측',
        reason: '상하행 에스컬레이터가 완비되어 있어 교차로 남측 상가로 편리하게 이동할 수 있습니다.',
        hasElevator: false,
        hasEscalator: true
      }
    ],
    recommendedExitsExplanationEn: [
      {
        exitNum: 'Exit 1',
        targetTitle: 'Suyeong Historical Park & Post Office',
        reason: 'Ground elevator leading toward the park walking paths, ideal for strollers and senior travelers.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: 'Exit 11',
        targetTitle: 'Paldo Traditional Market South Entrance',
        reason: 'Vertical elevator heading toward the bustling local food market with smooth rolling surfaces.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: 'Exit 15',
        targetTitle: 'Suyeong Intersection South toward Gwangalli',
        reason: 'Equipped with bidirectional escalators for effortless ascent to street level.',
        hasElevator: false,
        hasEscalator: true
      }
    ],
    movementStepsKo: [
      {
        step: 1,
        title: '2호선(B2F) 또는 3호선(B3F) 하차',
        location: '각 호선 승강장',
        desc: '승강장 내 환승 수직 승강기를 탑승하여 지하 1층 대합실로 이동합니다.'
      },
      {
        step: 2,
        title: '대합실 중앙 와이드 게이트 통과',
        location: '지하 1층 대합실',
        desc: '교통약자 및 대형 짐 소지자를 위한 광폭 개찰구를 통과합니다.'
      },
      {
        step: 3,
        title: '목적지별 엘리베이터 탑승',
        location: '출구 통로',
        desc: '수영사적공원은 1번 출구 엘리베이터, 팔도시장은 11번 출구 엘리베이터를 탑승합니다.'
      },
      {
        step: 4,
        title: '지상 평탄 보도 진출',
        location: '지상 1층 인도',
        desc: '턱 없는 보도를 따라 목적지까지 안전하게 이동합니다.'
      }
    ],
    movementStepsEn: [
      {
        step: 1,
        title: 'Platform Arrival (B2F/B3F)',
        location: 'Line 2 or Line 3 Platform',
        desc: 'Ride the in-station platform elevator up to the B1 central concourse.'
      },
      {
        step: 2,
        title: 'Wide Gate Passage',
        location: 'B1 Concourse',
        desc: 'Pass through the wide automated gates suitable for mobility devices and luggage.'
      },
      {
        step: 3,
        title: 'Board Exit Elevator',
        location: 'Exit Corridors',
        desc: 'Take Exit 1 elevator for the park or Exit 11 elevator for Paldo Market.'
      },
      {
        step: 4,
        title: 'Street Level Walk',
        location: 'Ground Level Sidewalk',
        desc: 'Proceed smoothly along flat sidewalks toward your destination.'
      }
    ],
    travelerTipsKo: {
      luggage: '2호선(소10, 대4, 특대2)과 3호선(소10, 대6, 특대4) 대합실 양쪽에 각각 물품보관함이 구비되어 있어 환승 전후 짐을 맡기기 편리합니다.',
      stroller: '수영사적공원 방면 산책 시 1번 출구 엘리베이터를 이용하시면 지상 평탄 보도로 곧바로 연결됩니다.',
      wheelchair: '2호선 ↔ 3호선 환승 시 승강장 수직 승강기를 이용하면 계단 없이 수평 이동이 가능합니다.',
      mobility: '광안리 방면 수영교차로 이동 시 15번 출구 양방향 에스컬레이터를 이용하시면 다리에 무리 없이 이동할 수 있습니다.'
    },
    travelerTipsEn: {
      luggage: 'Both Line 2 and Line 3 concourses feature lockers (Line 2: 10 S, 4 L, 2 XL; Line 3: 10 S, 6 L, 4 XL) for convenient bag storage.',
      stroller: 'Exit 1 elevator connects directly to wide, level sidewalks heading to Suyeong Historical Park.',
      wheelchair: 'Platform elevators provide an entirely barrier-free transfer interchange between Line 2 and Line 3.',
      mobility: 'Take the bidirectional escalators at Exit 15 for a smooth ascent toward southern Suyeong intersection.'
    },
    nearbyPlacesWithContextKo: [
      {
        name: '🌾 수영사적공원 & 안용복장군 사당',
        tag: '도보 5분 · 1번 출구 엘리베이터',
        whyVisit: '조선시대 수군절도사영 터로 고즈넉한 숲길과 천연기념물 곰솔, 역사의 숨결을 느낄 수 있는 평탄한 공원입니다.',
        exitInfo: '1번 출구 엘리베이터'
      },
      {
        name: '🍲 수영 팔도시장 (전통 먹거리 골목)',
        tag: '도보 4분 · 11번 출구 엘리베이터',
        whyVisit: '돼지국밥, 족발, 수제 분식 등 로컬 주민들이 즐겨 찾는 활기찬 전통 먹거리 시장입니다.',
        exitInfo: '11번 출구 엘리베이터'
      },
      {
        name: '☕ 망미단길 & F1963 복합문화공간 연계',
        tag: '도보 15분 또는 마을버스 환승',
        whyVisit: '옛 와이어 공장을 리모델링한 복합문화공간(Yes24중고서점, 테라로사)으로 이어지는 문화 코스입니다.',
        exitInfo: '2번 출구 버스 연계'
      }
    ],
    nearbyPlacesWithContextEn: [
      {
        name: '🌾 Suyeong Historical Park',
        tag: '5 min walk · Exit 1 Elevator',
        whyVisit: 'Historic naval garrison grounds featuring centuries-old pine trees, shrines, and peaceful paved trails.',
        exitInfo: 'Exit 1 Elevator'
      },
      {
        name: '🍲 Suyeong Paldo Traditional Market',
        tag: '4 min walk · Exit 11 Elevator',
        whyVisit: 'Authentic local food market famous for pork soup (Dwaeji Gukbap), jokbal, and traditional Korean snacks.',
        exitInfo: 'Exit 11 Elevator'
      },
      {
        name: '☕ Mangmi-dan-gil & F1963 Cultural Factory',
        tag: '15 min walk or short shuttle bus',
        whyVisit: 'Wire factory transformed into a cultural hub featuring Terarosa coffee and Yes24 mega bookstore.',
        exitInfo: 'Exit 2 Bus Connection'
      }
    ]
  },

  // 10. 자갈치역 (Jagalchi Station)
  jagalchi: {
    introKo: '자갈치역은 부산을 상징하는 세계적인 어시장인 자갈치시장과 BIFF광장, 부평깡통시장(야시장)으로 이어지는 원도심 관광의 중심역입니다. 3번·6번 출구의 수직 엘리베이터와 10번 출구의 에스컬레이터를 활용하면, 활기찬 수산시장과 길거리 먹거리 골목을 단차 없이 안전하게 여행할 수 있습니다.',
    introEn: 'Jagalchi Station is the gateway to Busan’s world-renowned Jagalchi Seafood Market, BIFF Square, and Bupyeong Kkangtong Night Market. Utilizing vertical elevators at Exits 3 and 6 and escalators at Exit 10 guarantees step-free access to vibrant seafood halls and street food alleys.',
    stationRoleKo: '자갈치 수산시장 및 BIFF광장·부평깡통시장 진입 거점',
    stationRoleEn: 'Gateway to Jagalchi Seafood Market, BIFF Square, and Bupyeong Night Market',
    recommendedExitsExplanationKo: [
      {
        exitNum: '10번 출구',
        targetTitle: '자갈치시장 신축 건물 & 수산물 야외 노점',
        reason: '상하행 에스컬레이터가 설치되어 있어 자갈치시장 본관 및 바다 전망 데크 방면 도로 평지로 바로 진입할 수 있습니다.',
        hasElevator: false,
        hasEscalator: true
      },
      {
        exitNum: '3번 출구',
        targetTitle: '부평깡통시장 & 충무동 사거리 방면',
        reason: '지상 수직 엘리베이터가 보도와 바로 연결되어 부평시장 및 먹거리 골목으로 턱 없이 이동하기 좋습니다.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: '6번 출구',
        targetTitle: 'BIFF광장 & 남포동 극장가 방면',
        reason: '비프광장 씨앗호떡 골목과 영화의 거리로 진입하는 지상 수직 엘리베이터입니다.',
        hasElevator: true,
        hasEscalator: false
      }
    ],
    recommendedExitsExplanationEn: [
      {
        exitNum: 'Exit 10',
        targetTitle: 'Jagalchi Market Main Building & Harbor Walk',
        reason: 'Equipped with bidirectional escalators leading directly to the flat street toward the main seafood building.',
        hasElevator: false,
        hasEscalator: true
      },
      {
        exitNum: 'Exit 3',
        targetTitle: 'Bupyeong Kkangtong Market & Chungmu Intersection',
        reason: 'Ground vertical elevator connecting to the sidewalk for smooth transit to the night food market.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: 'Exit 6',
        targetTitle: 'BIFF Square & Nampo Movie Theater District',
        reason: 'Vertical elevator leading toward the seed hotteok street food stalls and cinema avenue.',
        hasElevator: true,
        hasEscalator: false
      }
    ],
    movementStepsKo: [
      {
        step: 1,
        title: '1호선 승강장 하차',
        location: '지하 2층 승강장',
        desc: '승강장 내 수직 엘리베이터를 타고 지하 1층 대합실로 상향 이동합니다.'
      },
      {
        step: 2,
        title: '와이드 케어 게이트 통과',
        location: '지하 1층 대합실',
        desc: '캐리어와 휠체어가 원활히 통과할 수 있는 넓은 개찰구를 통과합니다.'
      },
      {
        step: 3,
        title: '목적지별 출구 선택',
        location: '대합실 연결 통로',
        desc: '자갈치시장은 10번 에스컬레이터, BIFF광장은 6번 엘리베이터, 깡통시장은 3번 엘리베이터를 이용합니다.'
      },
      {
        step: 4,
        title: '지상 노면 보도 진출',
        location: '지상 1층 보도',
        desc: '평탄하게 포장된 보도를 따라 시장 골목으로 진입합니다.'
      }
    ],
    movementStepsEn: [
      {
        step: 1,
        title: 'Platform Arrival (B2F)',
        location: 'Line 1 Platform',
        desc: 'Ride the platform elevator up to the B1 concourse level.'
      },
      {
        step: 2,
        title: 'Wide Care Gate Clearance',
        location: 'B1 Concourse',
        desc: 'Pass through the wide automated gates designed for accessibility and luggage.'
      },
      {
        step: 3,
        title: 'Select Destination Exit',
        location: 'Concourse Corridors',
        desc: 'Take Exit 10 escalator for Jagalchi Market, Exit 6 elevator for BIFF Square, or Exit 3 for Bupyeong Market.'
      },
      {
        step: 4,
        title: 'Street Level Arrival',
        location: 'Ground Level Sidewalk',
        desc: 'Step out onto flat paved sidewalks leading into the vibrant market alleys.'
      }
    ],
    travelerTipsKo: {
      luggage: '대합실에 소형 34개, 중형 42개, 대형 4개, 특대 27개의 보관함이 마련되어 있어 시장 투어 전 캐리어를 맡기기 좋습니다.',
      stroller: '부평깡통시장이나 BIFF광장 방문 시 3번 및 6번 출구 엘리베이터를 이용하시면 안전하게 지상 인도로 나갈 수 있습니다.',
      wheelchair: '3번 및 6번 출구 엘리베이터로 지상 진출 후 완만한 보도를 따라 이동하시는 동선을 권장합니다.',
      mobility: '자갈치시장 방면은 10번 출구의 상하행 에스컬레이터를 이용하시면 계단 보행 없이 지상 평지로 진입 가능합니다.'
    },
    travelerTipsEn: {
      luggage: 'Generous lockers (34 S, 42 M, 4 L, 27 XL) are located in the concourse to store bags while exploring markets.',
      stroller: 'Exits 3 and 6 elevators provide stair-free street access toward BIFF Square and Bupyeong Market.',
      wheelchair: 'Vertical elevators at Exits 3 and 6 connect directly to sidewalks leading to the market areas.',
      mobility: 'Bidirectional escalators at Exit 10 eliminate stair climbing on the way to the seafood market.'
    },
    nearbyPlacesWithContextKo: [
      {
        name: '🐟 부산 자갈치시장 & 옥상 전망대',
        tag: '도보 4분 · 10번 출구 에스컬레이터',
        whyVisit: '대한민국 최대 수산물 어시장으로 싱싱한 회와 해산물을 맛보고 옥상에서 남항 바다를 조망할 수 있습니다.',
        exitInfo: '10번 출구 에스컬레이터'
      },
      {
        name: '🎬 BIFF광장 & 씨앗호떡 먹거리 골목',
        tag: '도보 3분 · 6번 출구 엘리베이터',
        whyVisit: '부산국제영화제의 발상지로 유명 영화인들의 핸드프린팅과 고소한 씨앗호떡을 즐길 수 있습니다.',
        exitInfo: '6번 출구 엘리베이터'
      },
      {
        name: '🍢 부평 깡통시장 & 야시장',
        tag: '도보 6분 · 3번 출구 엘리베이터',
        whyVisit: '유부전골, 비빔당면, 다국적 퓨전 야시장 먹거리가 밤마다 열리는 원도심 필수 코스입니다.',
        exitInfo: '3번 출구 엘리베이터'
      }
    ],
    nearbyPlacesWithContextEn: [
      {
        name: '🐟 Jagalchi Seafood Market & Sky Deck',
        tag: '4 min walk · Exit 10 Escalator',
        whyVisit: 'Korea’s premier fish market where you can savor fresh seafood and take in scenic views over the southern port.',
        exitInfo: 'Exit 10 Escalator'
      },
      {
        name: '🎬 BIFF Square & Seed Hotteok Street',
        tag: '3 min walk · Exit 6 Elevator',
        whyVisit: 'Birthplace of the Busan International Film Festival featuring movie star handprints and famous crispy hotteok.',
        exitInfo: 'Exit 6 Elevator'
      },
      {
        name: '🍢 Bupyeong Kkangtong Night Market',
        tag: '6 min walk · Exit 3 Elevator',
        whyVisit: 'Famous night market offering local specialties (Yubu pocket soup, bibim glass noodles) and global street food.',
        exitInfo: 'Exit 3 Elevator'
      }
    ]
  },

  // 11. 금련산역 (Geumnyeonsan Station)
  geumnyeonsan: {
    introKo: '금련산역은 광안리 해수욕장의 남측 조용한 해변 산책로와 남천동 ‘빵천동’ 베이커리 거리로 진입하는 2호선 역입니다. 광안역보다 혼잡도가 낮고 3번과 4번 출구에 수직 엘리베이터가 완비되어 있어, 유모차나 캐리어를 동반한 가족 여행자가 여유롭게 광안리 바다로 접근하기에 매우 이상적입니다.',
    introEn: 'Geumnyeonsan Station provides peaceful access to the southern end of Gwangalli Beach and the famous Namcheon-dong ‘Breadcheon-dong’ bakery alley. With less passenger congestion than Gwangan Station and elevators at Exits 3 and 4, it is ideal for family travelers with strollers.',
    stationRoleKo: '광안리 남측 해변 및 남천동 빵천동 디저트거리 접근 거점',
    stationRoleEn: 'Gateway to southern Gwangalli Beach & Namcheon-dong artisanal bakery district',
    recommendedExitsExplanationKo: [
      {
        exitNum: '3번 출구',
        targetTitle: '광안리 해수욕장 남측 & 수영구청 방면',
        reason: '지상 수직 엘리베이터가 설치되어 있어 광안리 남측 해변 및 남천동 방면 완만한 보도로 바로 이어집니다.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: '4번 출구',
        targetTitle: '남천1동 행정복지센터 & 대남교차로 평탄로',
        reason: '수영로 서측 보도로 바로 올라가는 수직 승강기로 단차 없는 보행 환경을 제공합니다.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: '5번·6번 출구',
        targetTitle: '광안리 해변로 초입 & 남천동 빵거리',
        reason: '보도 폭이 넓고 경사가 완만하여 보행이 매우 쾌적한 출구 구역입니다.',
        hasElevator: false,
        hasEscalator: true
      }
    ],
    recommendedExitsExplanationEn: [
      {
        exitNum: 'Exit 3',
        targetTitle: 'Southern Gwangalli Beach & Suyeong-gu Office',
        reason: 'Vertical elevator providing direct sidewalk connection toward the quiet southern beach promenade.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: 'Exit 4',
        targetTitle: 'Namcheon 1-dong Office & Daenam Intersection',
        reason: 'Ground vertical elevator offering barrier-free access along the western side of Suyeong-ro.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: 'Exits 5 & 6',
        targetTitle: 'Gwangalli Beach Entry & Bakery Street',
        reason: 'Features wide paved sidewalks with gentle gradients suitable for pleasant walking.',
        hasElevator: false,
        hasEscalator: true
      }
    ],
    movementStepsKo: [
      {
        step: 1,
        title: '2호선 승강장 하차',
        location: '지하 2층 승강장',
        desc: '승강장 중앙의 교통약자 엘리베이터를 타고 지하 1층 대합실로 올라옵니다.'
      },
      {
        step: 2,
        title: '대합실 안심 게이트 통과',
        location: '지하 1층 대합실',
        desc: '와이드 개찰구를 통과한 후 3번 또는 4번 출구 엘리베이터 탑승구로 이동합니다.'
      },
      {
        step: 3,
        title: '지상 엘리베이터 탑승',
        location: '3번/4번 출구 승강기',
        desc: '엘리베이터를 타고 지상 1층 도로변 인도로 진출합니다.'
      },
      {
        step: 4,
        title: '해변 및 빵천동 방면 이동',
        location: '지상 1층 보도',
        desc: '완만한 내리막 보도를 따라 약 500m 걸어가면 광안리 해변 남측 산책로에 도달합니다.'
      }
    ],
    movementStepsEn: [
      {
        step: 1,
        title: 'Platform Arrival (B2F)',
        location: 'Line 2 Platform',
        desc: 'Take the central platform elevator up to the B1 concourse level.'
      },
      {
        step: 2,
        title: 'Pass Accessible Gates',
        location: 'B1 Concourse',
        desc: 'Pass through the wide turnstile gates toward Exit 3 or Exit 4 elevator.'
      },
      {
        step: 3,
        title: 'Ground Elevator Boarding',
        location: 'Exit 3/4 Elevator',
        desc: 'Ride the elevator to ground level sidewalks.'
      },
      {
        step: 4,
        title: 'Walk to Beach & Bakeries',
        location: 'Ground Level Sidewalk',
        desc: 'Follow the gentle gradient approx. 500m directly toward the southern sandy beach.'
      }
    ],
    travelerTipsKo: {
      luggage: '대합실 보관함(소18, 대8, 특대4)에 짐을 맡기고 남천동 베이커리 골목이나 광안리 남측 해변을 편하게 산책할 수 있습니다.',
      stroller: '3번 출구 엘리베이터를 이용해 지상으로 나오면 광안리 해변 남측 산책로까지 완만한 보도로 이어집니다.',
      wheelchair: '승강장-대합실-지상 3·4번 출구까지 전 구간 엘리베이터가 완비되어 단차 없이 이동 가능합니다.',
      mobility: '광안역보다 비교적 덜 붐비는 금련산역 3번·4번 출구 엘리베이터를 이용하시면 여유롭게 광안리 바다로 진입할 수 있습니다.'
    },
    travelerTipsEn: {
      luggage: 'Lockers (18 S, 8 L, 4 XL) at the concourse allow luggage storage for a relaxing bakery tour.',
      stroller: 'Exit 3 elevator opens to a gentle paved sidewalk leading straight to the southern beach boardwalk.',
      wheelchair: 'Step-free vertical elevators seamlessly link platform, concourse, and street level at Exits 3 and 4.',
      mobility: 'Enjoy a much calmer station environment compared to Gwangan Station, ideal for stress-free movement.'
    },
    nearbyPlacesWithContextKo: [
      {
        name: '🥖 남천동 빵천동 (베이커리 특화거리)',
        tag: '도보 5분 · 3번·5번 출구',
        whyVisit: '오랜 역사를 지닌 팥빵 명가부터 트렌디한 유럽식 사워도우 베이커리까지 전국 빵 애호가들의 성지입니다.',
        exitInfo: '3번 출구 엘리베이터'
      },
      {
        name: '🏖️ 광안리 해수욕장 남측 쉼터 & 패들보드(SUP) 존',
        tag: '도보 7분 · 3번 출구',
        whyVisit: '북측 번화가에 비해 고즈넉하며 해변 잔디 쉼터와 SUP 해양 레포츠를 여유롭게 즐길 수 있습니다.',
        exitInfo: '3번 출구 직진'
      },
      {
        name: '🏛️ 수영구청 & 벚꽃거리 (남천 삼익비치)',
        tag: '도보 10분 · 3번 출구 방면',
        whyVisit: '봄철 부산 최고의 벚꽃 터널로 유명하며 바다와 맞닿은 해안 산책로가 조성되어 있습니다.',
        exitInfo: '수영구청 방면'
      }
    ],
    nearbyPlacesWithContextEn: [
      {
        name: '🥖 Namcheon-dong ‘Breadcheon-dong’ Bakery Street',
        tag: '5 min walk · Exit 3 / Exit 5',
        whyVisit: 'Korea’s famous artisan bakery haven featuring historic red bean bread masters and modern French boulangeries.',
        exitInfo: 'Exit 3 Elevator'
      },
      {
        name: '🏖️ Southern Gwangalli Beach & SUP Zone',
        tag: '7 min walk · Exit 3',
        whyVisit: 'Calmer coastal ambiance with green lawns and dedicated stand-up paddleboarding (SUP) zones.',
        exitInfo: 'Exit 3 Straight'
      },
      {
        name: '🏛️ Suyeong-gu Office & Namcheon Cherry Blossom Way',
        tag: '10 min walk · Exit 3 Direction',
        whyVisit: 'Renowned spring cherry blossom promenade overlooking the expansive coastal horizon.',
        exitInfo: 'Toward Suyeong-gu Office'
      }
    ]
  },

  // 12. 동백역 (Dongbaek Station)
  dongbaek: {
    introKo: '동백역은 부산의 럭셔리 워터프론트인 마린시티 해안산책로와 동백섬·누리마루 APEC하우스, 더베이101로 진입하는 2호선 역입니다. 4번 출구의 전용 수직 엘리베이터를 이용하면, 웅장한 마천루 오션뷰와 동백섬 산책로까지 무단차 평탄 보행로를 따라 편안하게 걸어갈 수 있습니다.',
    introEn: 'Dongbaek Station is the dedicated station for Marine City waterfront promenade, Dongbaekseom Island, Nurimaru APEC House, and The Bay 101. The vertical elevator at Exit 4 provides direct, step-free access to scenic ocean walks and panoramic skyscraper skylines.',
    stationRoleKo: '마린시티 해안산책로 및 동백섬·누리마루 보행 거점',
    stationRoleEn: 'Access hub for Marine City waterfront, Dongbaekseom Island, and The Bay 101',
    recommendedExitsExplanationKo: [
      {
        exitNum: '4번 출구',
        targetTitle: '마린시티, 동백섬, 더베이101 방면',
        reason: '지상 전용 수직 엘리베이터가 설치되어 있어 해운대해변로 보도로 바로 연결되며 단차 없이 마린시티와 동백섬으로 직진할 수 있습니다.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: '1번·3번 출구',
        targetTitle: '우동 주거 단지 & 올림픽공원 방면',
        reason: '동백사거리 북측 방면으로 연결되며 상하행 에스컬레이터가 구비되어 있습니다.',
        hasElevator: false,
        hasEscalator: true
      }
    ],
    recommendedExitsExplanationEn: [
      {
        exitNum: 'Exit 4',
        targetTitle: 'Marine City, Dongbaekseom Island & The Bay 101',
        reason: 'Dedicated ground vertical elevator connecting directly to Haeundaehaebyeon-ro sidewalk for a step-free walk to coastal sights.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: 'Exits 1 & 3',
        targetTitle: 'U-dong Residential Area & Olympic Park',
        reason: 'Equipped with bidirectional escalators toward northern commercial and park areas.',
        hasElevator: false,
        hasEscalator: true
      }
    ],
    movementStepsKo: [
      {
        step: 1,
        title: '2호선 승강장 하차',
        location: '지하 2층 승강장',
        desc: '승강장 중앙 교통약자 엘리베이터를 타고 지하 1층 대합실로 올라옵니다.'
      },
      {
        step: 2,
        title: '대합실 와이드 게이트 통과',
        location: '지하 1층 대합실',
        desc: '캐리어 및 유모차가 통과할 수 있는 넓은 개찰구를 통과합니다.'
      },
      {
        step: 3,
        title: '4번 출구 엘리베이터 탑승',
        location: '4번 출구 승강기',
        desc: '지상 1층 도로변 인도로 직통 연결되는 엘리베이터를 탑승합니다.'
      },
      {
        step: 4,
        title: '해안 산책로 진입',
        location: '지상 1층 보도',
        desc: '완만한 평탄 인도를 따라 동백섬 입구(약 600m) 또는 마린시티 방면으로 이동합니다.'
      }
    ],
    movementStepsEn: [
      {
        step: 1,
        title: 'Platform Arrival (B2F)',
        location: 'Line 2 Platform',
        desc: 'Ride the platform elevator up to the B1 concourse level.'
      },
      {
        step: 2,
        title: 'Pass Wide Turnstiles',
        location: 'B1 Concourse',
        desc: 'Clear the wide accessible fare gates.'
      },
      {
        step: 3,
        title: 'Board Exit 4 Elevator',
        location: 'Exit 4 Elevator',
        desc: 'Take the vertical elevator directly up to the ground-level sidewalk.'
      },
      {
        step: 4,
        title: 'Walk to Waterfront',
        location: 'Ground Level Sidewalk',
        desc: 'Follow the flat, paved pedestrian sidewalk approx. 600m toward Dongbaekseom Island entrance.'
      }
    ],
    travelerTipsKo: {
      luggage: '대합실 내 보관함(소12, 대6, 특대2)을 이용해 짐을 맡겨두고 동백섬 둘레길을 가볍게 둘러볼 수 있습니다.',
      stroller: '4번 출구 엘리베이터로 지상에 올라오면 동백섬 입구 및 마린시티 해안산책로까지 평탄한 인도로 이동할 수 있습니다.',
      wheelchair: '동백역 지상 직통 4번 출구 엘리베이터를 이용하시면 도로 단차 없이 안전하게 지상 인도에 진입합니다.',
      mobility: '해운대역보다 한 정거장 전인 동백역에서 하차하여 4번 출구 엘리베이터를 타면 더베이101과 동백섬을 더 가깝게 방문할 수 있습니다.'
    },
    travelerTipsEn: {
      luggage: 'Lockers (12 S, 6 L, 2 XL) at the station concourse let you store baggage while walking the island trails.',
      stroller: 'Exit 4 elevator connects to a flat, unobstructed sidewalk leading directly to Dongbaekseom Island.',
      wheelchair: 'The direct vertical elevator at Exit 4 guarantees a safe and seamless route to street level.',
      mobility: 'Getting off at Dongbaek Station (one stop before Haeundae) offers a shorter walk to The Bay 101 and Dongbaekseom.'
    },
    nearbyPlacesWithContextKo: [
      {
        name: '🌺 동백섬 & 누리마루 APEC 하우스',
        tag: '도보 10분 · 4번 출구 엘리베이터',
        whyVisit: '울창한 동백나무 숲과 기암괴석 바다 절경, 정상급 국제회의가 열렸던 누리마루를 둘러볼 수 있는 무장애 목재 산책로 코스입니다.',
        exitInfo: '4번 출구 엘리베이터'
      },
      {
        name: '🌃 더베이101 (요트클럽 & 야경 스팟)',
        tag: '도보 8분 · 4번 출구',
        whyVisit: '마린시티 마천루 반영 사진 명소이자 시원한 바닷바람과 함께 피시앤칩스를 즐길 수 있는 복합문화공간입니다.',
        exitInfo: '4번 출구 직진'
      },
      {
        name: '🏙️ 마린시티 영화의 거리 & 해안산책로',
        tag: '도보 10분 · 1번·4번 출구',
        whyVisit: '광안대교와 바다를 바라보며 걷는 이국적인 해안 방파제 산책로입니다.',
        exitInfo: '마린시티 방면'
      }
    ],
    nearbyPlacesWithContextEn: [
      {
        name: '🌺 Dongbaekseom Island & Nurimaru APEC House',
        tag: '10 min walk · Exit 4 Elevator',
        whyVisit: 'Lush camellia woods, ocean cliff panoramas, and the summit APEC house connected via accessible boardwalks.',
        exitInfo: 'Exit 4 Elevator'
      },
      {
        name: '🌃 The Bay 101 (Yacht Club & Night View)',
        tag: '8 min walk · Exit 4',
        whyVisit: 'Iconic spot for dramatic skyscraper water reflection photography, craft beer, and fish & chips.',
        exitInfo: 'Exit 4 Straight'
      },
      {
        name: '🏙️ Marine City Cinema Street & Promenade',
        tag: '10 min walk · Exits 1 & 4',
        whyVisit: 'Exotic coastal waterfront promenade overlooking Gwangan Bridge with movie-themed sculpture exhibits.',
        exitInfo: 'Toward Marine City'
      }
    ]
  },

  // 13. 중앙역 (Jungang Station)
  jungang: {
    introKo: '중앙역은 부산 원도심의 역사적 정취가 살아있는 40계단 문화관광테마거리와 인쇄골목, 중구 오피스 상권으로 이어지는 1호선 역입니다. 8번·12번·13번 출구의 수직 엘리베이터가 지상 평탄 보도와 바로 연결되어 있어, 계단 없이 원도심 골목 투어를 시작할 수 있습니다.',
    introEn: 'Jungang Station is the heritage gateway to the 40-Step Culture & Tourism Theme Street, historic printing press alleys, and central business district. Vertical elevators at Exits 8, 12, and 13 provide step-free access to sidewalk routes.',
    stationRoleKo: '40계단 문화관광테마거리 및 원도심 인쇄골목·중구 오피스 보행 거점',
    stationRoleEn: 'Heritage hub for 40-Step Culture Street & historic central downtown quarter',
    recommendedExitsExplanationKo: [
      {
        exitNum: '12번 출구',
        targetTitle: '40계단 문화관광테마거리 & 부산무역회관',
        reason: '지상 수직 엘리베이터가 설치되어 있어 40계단 테마거리와 골목 카페거리로 계단 없이 접근할 수 있습니다.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: '8번 출구',
        targetTitle: '중앙동 주민센터 & 중앙동 교차로 방면',
        reason: '중앙대로 동측 도로변으로 연결되는 수직 승강기로 휠체어와 유모차 이동에 안전합니다.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: '13번 출구',
        targetTitle: '중구청 & 대청로 방면',
        reason: '대청로 방면 완만한 오르막 초입으로 연결되는 수직 승강기입니다.',
        hasElevator: true,
        hasEscalator: false
      }
    ],
    recommendedExitsExplanationEn: [
      {
        exitNum: 'Exit 12',
        targetTitle: '40-Step Culture Theme Street & Busan Trade Building',
        reason: 'Vertical elevator providing direct, step-free access toward the historic 40-step theme street and cafe alleys.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: 'Exit 8',
        targetTitle: 'Jungang-dong Community Center & Intersection',
        reason: 'Vertical elevator connecting to the eastern sidewalk of Jungang-daero boulevard.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: 'Exit 13',
        targetTitle: 'Jung-gu Office & Daecheong-ro',
        reason: 'Vertical elevator providing barrier-free pavement access toward Daecheong-ro avenue.',
        hasElevator: true,
        hasEscalator: false
      }
    ],
    movementStepsKo: [
      {
        step: 1,
        title: '1호선 승강장 하차',
        location: '지하 2층 승강장',
        desc: '승강장 내 수직 승강기를 타고 지하 1층 대합실로 상향 이동합니다.'
      },
      {
        step: 2,
        title: '와이드 개찰구 통과',
        location: '지하 1층 대합실',
        desc: '휠체어 및 대형 짐 소지자 전용 광폭 개찰구를 통과합니다.'
      },
      {
        step: 3,
        title: '목적지별 엘리베이터 탑승',
        location: '출구 연결 통로',
        desc: '40계단 테마거리는 12번 출구 엘리베이터, 중구청 방면은 13번 출구 엘리베이터를 탑승합니다.'
      },
      {
        step: 4,
        title: '지상 노면 보도 진출',
        location: '지상 1층 보도',
        desc: '턱 없는 보행로를 따라 원도심 골목길로 이동합니다.'
      }
    ],
    movementStepsEn: [
      {
        step: 1,
        title: 'Platform Arrival (B2F)',
        location: 'Line 1 Platform',
        desc: 'Ride the in-station elevator up to the B1 concourse level.'
      },
      {
        step: 2,
        title: 'Pass Wide Gates',
        location: 'B1 Concourse',
        desc: 'Pass through the wide automated accessibility turnstiles.'
      },
      {
        step: 3,
        title: 'Board Exit Elevator',
        location: 'Exit Corridors',
        desc: 'Take Exit 12 elevator for 40-Step Street or Exit 13 elevator for Jung-gu Office.'
      },
      {
        step: 4,
        title: 'Walk Downtown',
        location: 'Ground Level Sidewalk',
        desc: 'Proceed smoothly along flat sidewalks into the historic alleys.'
      }
    ],
    travelerTipsKo: {
      luggage: '대합실에 소형 24개, 중형 30개, 대형 8개, 특대 16개의 물품보관함이 구비되어 있어 여유롭게 수하물을 보관할 수 있습니다.',
      stroller: '40계단 문화거리 및 주변 카페 탐방 시 12번 출구 엘리베이터를 이용하시면 단차 없이 보도로 진입할 수 있습니다.',
      wheelchair: '8번, 12번, 13번 출구 모두 수직 엘리베이터가 운영 중이므로 목적지 방향에 맞춰 선택하여 이용 가능합니다.',
      mobility: '에스컬레이터가 없는 역사이므로 계단 대신 반드시 승강장과 대합실, 출구의 수직 엘리베이터를 이용하시길 권장합니다.'
    },
    travelerTipsEn: {
      luggage: 'Concourse lockers (24 S, 30 M, 8 L, 16 XL) offer ample storage capacity for bags and luggage.',
      stroller: 'Exit 12 elevator provides a smooth, step-free sidewalk route leading into the 40-Step Culture Street area.',
      wheelchair: 'Exits 8, 12, and 13 all feature operational vertical elevators to accommodate wheelchair users.',
      mobility: 'As there are no escalators at this station, please make sure to use the vertical elevators instead of stairs.'
    },
    nearbyPlacesWithContextKo: [
      {
        name: '📜 40계단 문화관광테마거리 & 문화관',
        tag: '도보 4분 · 12번 출구 엘리베이터',
        whyVisit: '한국전쟁 피란민들의 애환과 역사가 깃든 기념 동상과 레트로 감성 카페들이 어우러진 거리입니다.',
        exitInfo: '12번 출구 엘리베이터'
      },
      {
        name: '☕ 중앙동 인쇄골목 & 로스터리 카페거리',
        tag: '도보 3분 · 12번 출구',
        whyVisit: '옛 인쇄소 건물들을 개조한 빈티지 카페와 핸드드립 전문점이 모여 있는 조용한 골목입니다.',
        exitInfo: '12번 출구 방면'
      },
      {
        name: '🚢 부산항 연안여객터미널 부지 & 친수공원',
        tag: '도보 8분 · 2번·8번 출구',
        whyVisit: '부산항 바다 풍경을 감상하며 걷기 좋은 수변 산책로가 조성되어 있습니다.',
        exitInfo: '8번 출구 엘리베이터'
      }
    ],
    nearbyPlacesWithContextEn: [
      {
        name: '📜 40-Step Culture & Tourism Theme Street',
        tag: '4 min walk · Exit 12 Elevator',
        whyVisit: 'Historic memorial site honoring Korean War refugee heritage, lined with retro cafes and sculptures.',
        exitInfo: 'Exit 12 Elevator'
      },
      {
        name: '☕ Jungang-dong Printing Press Alley & Cafes',
        tag: '3 min walk · Exit 12',
        whyVisit: 'Quiet streets of repurposed print shops turned into artisanal roasteries and vintage coffee houses.',
        exitInfo: 'Exit 12 Direction'
      },
      {
        name: '🚢 Busan Old Coastal Pier & Waterfront Park',
        tag: '8 min walk · Exits 2 & 8',
        whyVisit: 'Scenic waterside promenade ideal for harbor strolls with sea breezes.',
        exitInfo: 'Exit 8 Elevator'
      }
    ]
  },

  // 14. 다대포해수욕장역 (Dadaepo Beach Station)
  dadaepo: {
    introKo: '다대포해수욕장역은 부산 지하철 1호선의 남서측 종착역으로, 환상적인 일몰과 세계 최대 규모의 ‘꿈의 낙조분수’, 고우니 생태길 목재 데크로 직결되는 거점역입니다. 1호선 종착역 특성상 승강장 깊이가 얕고, 1번·2번 출구의 엘리베이터와 상하행 에스컬레이터를 통해 해변공원 평지로 바로 진입할 수 있어 이동 편의성이 매우 뛰어납니다.',
    introEn: 'Dadaepo Beach Station is the southwestern terminus of Metro Line 1, leading directly to golden sunsets, the Sunset Dream Fountain, and Gowuni Ecological Boardwalk. Due to its shallow depth, Exits 1 and 2 elevators and escalators offer immediate, barrier-free access to the beach park.',
    stationRoleKo: '다대포 해수욕장·꿈의 낙조분수 및 고우니 생태길 직결 거점',
    stationRoleEn: 'Terminus for Dadaepo Beach, Sunset Fountain & Gowuni Wetlands',
    recommendedExitsExplanationKo: [
      {
        exitNum: '1번 출구',
        targetTitle: '다대포 해수욕장 & 꿈의 낙조분수 광장',
        reason: '상하행 에스컬레이터가 완비되어 있어 다대포 해변공원 잔디광장과 낙조분수대로 바로 연결됩니다.',
        hasElevator: false,
        hasEscalator: true
      },
      {
        exitNum: '2번 출구',
        targetTitle: '고우니 생태길 & 다대포 해변공원 생태탐방로',
        reason: '지상 수직 엘리베이터와 에스컬레이터가 모두 설치되어 있어 갈대밭 목재 데크로 단차 없이 곧장 진입합니다.',
        hasElevator: true,
        hasEscalator: true
      },
      {
        exitNum: '4번 출구',
        targetTitle: '다대1동 행정복지센터 & 다대 푸르지오 방면',
        reason: '지상 엘리베이터와 에스컬레이터가 구비되어 주거 단지 방면으로 수월하게 이동할 수 있습니다.',
        hasElevator: true,
        hasEscalator: true
      }
    ],
    recommendedExitsExplanationEn: [
      {
        exitNum: 'Exit 1',
        targetTitle: 'Dadaepo Beach & Sunset Dream Fountain Plaza',
        reason: 'Equipped with bidirectional escalators leading straight to the beach park lawn and music fountain.',
        hasElevator: false,
        hasEscalator: true
      },
      {
        exitNum: 'Exit 2',
        targetTitle: 'Gowuni Ecological Boardwalk & Beach Park',
        reason: 'Features both a vertical elevator and escalators connecting directly to the barrier-free wetland boardwalk.',
        hasElevator: true,
        hasEscalator: true
      },
      {
        exitNum: 'Exit 4',
        targetTitle: 'Dadae 1-dong Community Center & Residential District',
        reason: 'Equipped with an elevator and escalators for comfortable neighborhood access.',
        hasElevator: true,
        hasEscalator: true
      }
    ],
    movementStepsKo: [
      {
        step: 1,
        title: '1호선 종착 승강장 하차',
        location: '지하 2층 승강장',
        desc: '열차 하차 후 승강장 엘리베이터 또는 에스컬레이터를 타고 B1F 대합실로 올라갑니다.'
      },
      {
        step: 2,
        title: '대합실 개찰구 통과',
        location: '지하 1층 대합실',
        desc: '넓은 평면 와이드 개찰구를 통과합니다. 깊이가 얕아 이동 거리가 짧습니다.'
      },
      {
        step: 3,
        title: '2번 출구 승강기/에스컬레이터 탑승',
        location: '2번 출구 구역',
        desc: '엘리베이터를 타고 지상 1층 공원 입구로 올라옵니다.'
      },
      {
        step: 4,
        title: '해변공원 및 생태데크 진입',
        location: '지상 다대포 해변공원',
        desc: '턱 없는 목재 데크와 평탄한 보도블록을 따라 바다와 낙조분수대로 산책합니다.'
      }
    ],
    movementStepsEn: [
      {
        step: 1,
        title: 'Terminus Arrival (B2F)',
        location: 'Line 1 Platform',
        desc: 'Take the platform elevator or escalator up to the shallow B1 concourse.'
      },
      {
        step: 2,
        title: 'Concourse Gate Clearance',
        location: 'B1 Concourse',
        desc: 'Pass through the wide turnstiles with short horizontal walking distances.'
      },
      {
        step: 3,
        title: 'Ascend at Exit 2',
        location: 'Exit 2 Area',
        desc: 'Take Exit 2 elevator or escalator directly to park ground level.'
      },
      {
        step: 4,
        title: 'Enter Beach Boardwalk',
        location: 'Dadaepo Beach Park',
        desc: 'Roll smoothly onto the barrier-free wooden boardwalk and paved lawns toward the ocean.'
      }
    ],
    travelerTipsKo: {
      luggage: '대합실 보관함(소30, 중20, 대12, 특대18)에 짐을 보관하고 다대포 일몰과 낙조분수 공연을 가볍게 관람할 수 있습니다.',
      stroller: '2번 출구 엘리베이터를 이용하면 다대포 해변공원과 고우니 생태길의 완만한 무장애 목재 데크로 바로 이어집니다.',
      wheelchair: '승강장-대합실-2번 출구 엘리베이터로 이어지는 동선이 짧고 평탄하여 휠체어 이동 편의성이 매우 우수합니다.',
      mobility: '1번 및 2번 출구에 상하행 에스컬레이터가 모두 완비되어 있어 계단 부담 없이 해변 광장으로 오갈 수 있습니다.'
    },
    travelerTipsEn: {
      luggage: 'Lockers (30 S, 20 M, 12 L, 18 XL) are available in the concourse to store bags while catching the sunset.',
      stroller: 'Exit 2 elevator leads directly onto the smooth, barrier-free wooden boardwalks across the wetlands.',
      wheelchair: 'The shallow station design and direct elevator at Exit 2 provide one of the most accessible beach transit routes.',
      mobility: 'Bidirectional escalators at Exits 1 & 2 provide effortless access to the open-air fountain plaza.'
    },
    nearbyPlacesWithContextKo: [
      {
        name: '🌅 다대포 꿈의 낙조분수 (음악분수쇼)',
        tag: '도보 2분 · 1번 출구 에스컬레이터',
        whyVisit: '기네스북에 등재된 세계 최대 규모의 바닥음악분수로 형형색색 조명과 음악이 어우러지는 야간 명소입니다.',
        exitInfo: '1번 출구 에스컬레이터'
      },
      {
        name: '🌾 고우니 생태길 (갈대밭 목재 데크)',
        tag: '도보 3분 · 2번 출구 엘리베이터',
        whyVisit: '낙동강과 남해가 만나는 드넓은 모래톱과 갈대밭 위로 조성된 무장애 생태 산책로입니다.',
        exitInfo: '2번 출구 엘리베이터'
      },
      {
        name: '🌲 몰운대 유원지 & 해안 자갈마당',
        tag: '도보 12분 · 1번 출구 방면',
        whyVisit: '울창한 해송 숲과 기암괴석 해안 절경을 감상할 수 있는 부산 대표 해안 유원지입니다.',
        exitInfo: '몰운대 방면'
      }
    ],
    nearbyPlacesWithContextEn: [
      {
        name: '🌅 Dadaepo Sunset Dream Fountain',
        tag: '2 min walk · Exit 1 Escalator',
        whyVisit: 'World-record ground musical fountain featuring spectacular evening water, music, and light choreography.',
        exitInfo: 'Exit 1 Escalator'
      },
      {
        name: '🌾 Gowuni Wetland Ecological Boardwalk',
        tag: '3 min walk · Exit 2 Elevator',
        whyVisit: 'Barrier-free wooden boardwalk stretching over golden reeds where the Nakdong River meets the sea.',
        exitInfo: 'Exit 2 Elevator'
      },
      {
        name: '🌲 Morundae Coastal Scenic Park',
        tag: '12 min walk · Exit 1 Direction',
        whyVisit: 'Pine forest coastal peninsula known for dramatic coastal rock formations and panoramic sea views.',
        exitInfo: 'Toward Morundae'
      }
    ]
  },

  // 15. 범어사역 (Beomeosa Station)
  beomeosa: {
    introKo: '범어사역은 영남 3대 사찰이자 천년고찰인 금정산 범어사(90번 순환버스 환승)와 금정산 등산로로 이어지는 1호선 역입니다. 3번과 4번 출구에 수직 엘리베이터가 설치되어 있어, 지상 인도로 단차 없이 올라온 후 3번 출구 인근 범어사행 환승 버스 정류장으로 편안하게 이동할 수 있습니다.',
    introEn: 'Beomeosa Station serves as the transit gateway to Beomeosa Temple (one of the three great temples in southeast Korea) and Mt. Geumjeongsan trails via Bus 90. Vertical elevators at Exits 3 and 4 provide step-free access toward the temple transfer bus stop.',
    stationRoleKo: '금정산 등산로 및 범어사 천년고찰(90번 버스 환승) 연계 거점',
    stationRoleEn: 'Gateway to historic Beomeosa Temple & Mt. Geumjeongsan hiking trails',
    recommendedExitsExplanationKo: [
      {
        exitNum: '3번 출구',
        targetTitle: '범어사 환승 버스 정류장 (90번 버스) & 청룡동 방면',
        reason: '지상 수직 엘리베이터가 도로변 보도와 연결되어 범어사행 90번 순환버스 정류장으로 계단 없이 이동할 수 있습니다.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: '4번 출구',
        targetTitle: '청룡동 주거지 & 남산동 방면',
        reason: '중앙대로 동측 보도로 연결되는 수직 승강기로 휠체어와 유모차 통행을 지원합니다.',
        hasElevator: true,
        hasEscalator: false
      }
    ],
    recommendedExitsExplanationEn: [
      {
        exitNum: 'Exit 3',
        targetTitle: 'Beomeosa Temple Transfer Bus Stop (Bus 90) & Cheongryong-dong',
        reason: 'Vertical elevator directly connecting to the sidewalk for a step-free walk to the Bus 90 stop for the temple.',
        hasElevator: true,
        hasEscalator: false
      },
      {
        exitNum: 'Exit 4',
        targetTitle: 'Cheongryong-dong & Namsan-dong Direction',
        reason: 'Vertical elevator offering barrier-free access along the eastern sidewalk of Jungang-daero.',
        hasElevator: true,
        hasEscalator: false
      }
    ],
    movementStepsKo: [
      {
        step: 1,
        title: '1호선 승강장 하차',
        location: '지하 2층 승강장',
        desc: '승강장 내 수직 승강기를 타고 지하 1층 대합실로 상향 이동합니다.'
      },
      {
        step: 2,
        title: '대합실 와이드 개찰구 통과',
        location: '지하 1층 대합실',
        desc: '교통약자 전용 광폭 개찰구를 통과합니다.'
      },
      {
        step: 3,
        title: '3번 출구 승강기 탑승',
        location: '3번 출구 구역',
        desc: '범어사 환승정류장 방향 3번 출구 지상 수직 엘리베이터를 탑승합니다.'
      },
      {
        step: 4,
        title: '90번 버스 정류장 이동',
        location: '지상 1층 인도',
        desc: '평탄한 인도를 따라 약 150m 이동하여 범어사행 90번 버스 정류장에 도착합니다.'
      }
    ],
    movementStepsEn: [
      {
        step: 1,
        title: 'Platform Arrival (B2F)',
        location: 'Line 1 Platform',
        desc: 'Ride the in-station elevator up to the B1 concourse.'
      },
      {
        step: 2,
        title: 'Pass Wide Gates',
        location: 'B1 Concourse',
        desc: 'Pass through the wide automated fare gates.'
      },
      {
        step: 3,
        title: 'Board Exit 3 Elevator',
        location: 'Exit 3 Area',
        desc: 'Take the Exit 3 ground vertical elevator up to street level.'
      },
      {
        step: 4,
        title: 'Walk to Bus 90 Stop',
        location: 'Ground Level Sidewalk',
        desc: 'Walk approx. 150m along the paved sidewalk to the Bus 90 transfer stop for Beomeosa Temple.'
      }
    ],
    travelerTipsKo: {
      luggage: '대합실에 소형 16개, 중형 12개, 특대 6개의 보관함이 운영되고 있어 등산이나 사찰 방문 전 무거운 짐을 보관하기 좋습니다.',
      stroller: '3번 출구 엘리베이터로 나오면 범어사 방면 90번 순환버스 정류장 방향 보도로 계단 없이 연결됩니다.',
      wheelchair: '3번 및 4번 출구 수직 엘리베이터를 이용해 지상 인도로 안전하게 진출입할 수 있습니다.',
      mobility: '에스컬레이터가 없는 역사이므로 계단 대신 3번 또는 4번 출구 수직 엘리베이터를 이용해 지상으로 이동하세요.'
    },
    travelerTipsEn: {
      luggage: 'Concourse lockers (16 S, 12 M, 6 XL) let travelers store heavy luggage before exploring the mountain temple.',
      stroller: 'Exit 3 elevator leads to flat sidewalks toward the Bus 90 temple shuttle stop.',
      wheelchair: 'Vertical elevators at Exits 3 and 4 ensure safe, step-free access to surface sidewalks.',
      mobility: 'Since this station has no escalators, please use the vertical elevators to avoid stairs.'
    },
    nearbyPlacesWithContextKo: [
      {
        name: '⛩️ 범어사 (금정산 천년고찰)',
        tag: '3번 출구 엘리베이터 → 90번 버스 환승',
        whyVisit: '신라 문무왕 때 창건된 영남 3대 사찰로 보물 대웅전과 울창한 등나무 군락지가 있는 대표 명승지입니다.',
        exitInfo: '3번 출구 엘리베이터 → 버스 환승'
      },
      {
        name: '⛰️ 금정산 등산로 & 청룡동 먹거리마을',
        tag: '도보 5분 · 3번·4번 출구',
        whyVisit: '금정산성 및 고당봉으로 이어지는 등산로 초입으로 오리불고기와 파전 등 로컬 산채 먹거리가 풍부합니다.',
        exitInfo: '3번·4번 출구'
      },
      {
        name: '🌲 범어사 문화광장 & 숲길 쉼터',
        tag: '도보 7분 · 3번 출구 방면',
        whyVisit: '청룡동 계곡물과 숲길이 어우러진 휴식 공간으로 맑은 공기를 마시며 힐링하기 좋습니다.',
        exitInfo: '청룡동 방면'
      }
    ],
    nearbyPlacesWithContextEn: [
      {
        name: '⛩️ Beomeosa Temple (Ancient Buddhist Complex)',
        tag: 'Exit 3 Elevator → Bus 90 Transfer',
        whyVisit: 'Historic 7th-century temple nestled on Mt. Geumjeongsan, featuring national treasures and serene wisteria groves.',
        exitInfo: 'Exit 3 Elevator → Bus 90'
      },
      {
        name: '⛰️ Mt. Geumjeongsan Trail & Cheongryong Food Village',
        tag: '5 min walk · Exits 3 & 4',
        whyVisit: 'Trailhead for Mt. Geumjeongsan hiking, lined with mountain restaurants serving savory pancakes and duck roast.',
        exitInfo: 'Exits 3 & 4'
      },
      {
        name: '🌲 Beomeosa Cultural Plaza & Forest Rest Area',
        tag: '7 min walk · Exit 3 Direction',
        whyVisit: 'Peaceful rest area surrounded by clean valley streams and refreshing mountain air.',
        exitInfo: 'Toward Cheongryong-dong'
      }
    ]
  }
};
