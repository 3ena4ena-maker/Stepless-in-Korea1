/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * STEP 2-3: Stepless 부산 여행 일정표 큐레이션 데이터
 * 기존 BUSAN_ITINERARIES 및 도시철도/관광지 데이터를 바탕으로
 * '왜 이 순서로 여행하는가', '무단차 이동 전략', '여행자 맞춤 가이드'를 해석한 큐레이션입니다.
 */

export interface ItineraryTravelGuideItem {
  courseId: string;
  category: 'DAY' | '1NIGHT' | '2NIGHTS' | '3NIGHTS' | '4NIGHTS' | 'GOURMET' | 'EXPERIENCE' | 'SUBWAY';
  dayTitleKo: string;
  dayTitleEn: string;
  oneLineSummaryKo: string;
  oneLineSummaryEn: string;
  recommendedDurationKo: string;
  recommendedDurationEn: string;
  mainRegionsKo: string;
  mainRegionsEn: string;
  transitMethodKo: string;
  transitMethodEn: string;
  difficultyLevel: 'EASY' | 'MODERATE' | 'CHALLENGING';
  difficultyLabelKo: string;
  difficultyLabelEn: string;
  difficultyScore: number; // 1 to 3 dots
  difficultyDescKo: string;
  difficultyDescEn: string;
  
  // 추천 여행자 유형
  targetAudiences: {
    type: 'CARRIER' | 'STROLLER' | 'WHEELCHAIR' | 'SENIOR' | 'RAIN' | 'MIN_WALK';
    labelKo: string;
    labelEn: string;
    icon: string;
    reasonKo: string;
    reasonEn: string;
  }[];

  // 왜 이 순서인가요? (동선 해석)
  whyThisOrderKo: {
    titleKo: string;
    descriptionKo: string;
    flowStepsKo: string[];
  };
  whyThisOrderEn: {
    titleEn: string;
    descriptionEn: string;
    flowStepsEn: string[];
  };

  // Stepless 무단차 이동 포인트
  steplessPoints: {
    icon: string;
    titleKo: string;
    titleEn: string;
    descKo: string;
    descEn: string;
    stationInfo?: string;
  }[];

  // 이 코스에서 놓치지 마세요
  highlights: {
    titleKo: string;
    titleEn: string;
    descKo: string;
    descEn: string;
  }[];

  // 시간이 부족하다면 (축약 코스)
  shortCourse?: {
    titleKo: string;
    titleEn: string;
    routeKo: string;
    routeEn: string;
    tipKo: string;
    tipEn: string;
  };

  // ☔ 비 오는 날에는 (실내/지하 대안)
  rainyDayOption?: {
    titleKo: string;
    titleEn: string;
    descKo: string;
    descEn: string;
    indoorSpotsKo: string[];
    indoorSpotsEn: string[];
  };

  // 함께 묶어가기 좋은 곳
  connectedPlaces: {
    nameKo: string;
    nameEn: string;
    connectionReasonKo: string;
    connectionReasonEn: string;
    transitTipKo: string;
    transitTipEn: string;
  }[];
}

export const ITINERARY_TRAVEL_GUIDE_DATA: Record<string, ItineraryTravelGuideItem> = {
  // ---------------------------------------------------------------------------
  // 1. DAY TRIP 1 (당일치기 원도심 코스)
  // ---------------------------------------------------------------------------
  'itinerary-day-first-time': {
    courseId: 'itinerary-day-first-time',
    category: 'DAY',
    dayTitleKo: '당일치기 · 부산의 첫인상과 원도심 알짜 정복',
    dayTitleEn: '1-Day · First Impressions & Essential Historic Downtown',
    oneLineSummaryKo: '부산역에서 시작해 남포동·자갈치, 영도 절벽 바다, 광안리 야경까지 불필요한 환승 없이 하루에 완전 정복하는 동선',
    oneLineSummaryEn: 'A seamless day route from Busan Stn through Nampo/Jagalchi, Yeongdo cliffs, to Gwangalli nightscape without redundant transfers.',
    recommendedDurationKo: '약 10~12시간 (당일치기)',
    recommendedDurationEn: 'Approx. 10–12 Hours (1 Day)',
    mainRegionsKo: '부산역 · 감천 · 남포동 · 영도 · 광안리',
    mainRegionsEn: 'Busan Stn · Gamcheon · Nampo-dong · Yeongdo · Gwangalli',
    transitMethodKo: '지하철 1호선 + 2호선 + 시내버스 1회 (환승 최소화)',
    transitMethodEn: 'Subway Line 1 + Line 2 + Local Bus 1 time (Minimized transfers)',
    difficultyLevel: 'MODERATE',
    difficultyLabelKo: '보통 (평지 위주 & 대중교통 직결)',
    difficultyLabelEn: 'Moderate (Flat pavements & Direct transit)',
    difficultyScore: 2,
    difficultyDescKo: '원도심 시장과 광안리 해변은 0cm 평타 보도이며, 감천과 영도는 상부 전망로를 활용하여 가파른 계단을 전면 우회합니다.',
    difficultyDescEn: 'Market arcades and beach promenades are step-free; steep hills in Gamcheon and Yeongdo are bypassed via flat upper ridge roads.',
    
    targetAudiences: [
      {
        type: 'CARRIER',
        labelKo: '캐리어 여행자',
        labelEn: 'Luggage Traveler',
        icon: '🧳',
        reasonKo: '부산역 KTX/SRT 하차 후 역사 내 물품보관함이나 숙소 배송 서비스를 이용해 짐을 맡기고 가볍게 여행을 시작할 수 있습니다.',
        reasonEn: 'Drop heavy bags at Busan Station luggage lockers or hotel delivery services right after getting off KTX.'
      },
      {
        type: 'STROLLER',
        labelKo: '유모차 동반 가족',
        labelEn: 'Family with Stroller',
        icon: '👶',
        reasonKo: '부평깡통시장과 국제시장은 현대식 비가림 아케이드와 평탄한 바닥으로 유모차 주행이 부드럽습니다.',
        reasonEn: 'Bupyeong and Gukje Market arcades offer wide paved flat walkways with rainproof roofs for strollers.'
      },
      {
        type: 'WHEELCHAIR',
        labelKo: '휠체어 / 보행약자',
        labelEn: 'Wheelchair / Accessible',
        icon: '♿',
        reasonKo: '자갈치역 10번, 남포역 1번/7번 승강기 출구를 활용하면 원도심 주요 거리로 단차 없이 진입합니다.',
        reasonEn: 'Utilize Jagalchi Station Exit 10 and Nampo Station Exits 1/7 elevators for seamless ground entrance.'
      },
      {
        type: 'MIN_WALK',
        labelKo: '이동 피로 최소화',
        labelEn: 'Minimal Foot Fatigue',
        icon: '🚶',
        reasonKo: '남포동-자갈치-용두산공원이 500m 이내에 인접해 있어 지하철을 다시 타지 않고 도보로 연속 탐방이 가능합니다.',
        reasonEn: 'Nampo, Jagalchi, and Yongdusan are clustered within 500m, allowing connected strolls without re-entering subways.'
      }
    ],

    whyThisOrderKo: {
      titleKo: '왜 이 순서로 여행할까요?',
      descriptionKo: '부산역(도착) ➔ 감천(오전 채광) ➔ 남포·자갈치(점심 미식) ➔ 영도(오후 티타임) ➔ 광안리(일몰&야경)로 이어지는 지리적 직진 코스입니다. 같은 1호선 라인 안에서 남포·자갈치를 연속해서 묶어 불필요한 왕복 이동을 원천 차단했습니다.',
      flowStepsKo: [
        '09:00 부산역 도착: 짐 보관 후 1호선 탑승',
        '10:00 감천문화마을: 오전 맑은 자연광에서 인생샷 촬영',
        '12:30 부평깡통·국제시장: 평탄 아케이드에서 점심 로컬 미식',
        '15:30 영도 흰여울문화마을: 상부 해안 카페에서 오후 바다 전망',
        '19:30 광안리해수욕장: 2호선 이동 후 광안대교 오색 야경으로 하루 마무리'
      ]
    },
    whyThisOrderEn: {
      titleEn: 'Why Travel in This Order?',
      descriptionEn: 'A geographically continuous route from Busan Stn (arrival) ➔ Gamcheon (morning light) ➔ Nampo/Jagalchi (lunch) ➔ Yeongdo (afternoon tea) ➔ Gwangalli (sunset & nightscape). Grouping Nampo and Jagalchi prevents any zigzag movement.',
      flowStepsEn: [
        '09:00 Arrive at Busan Stn: Store luggage & ride Line 1',
        '10:00 Gamcheon Village: Photo ops under crisp morning light',
        '12:30 Bupyeong & Gukje Markets: Local street delicacies on flat aisles',
        '15:30 Yeongdo Huinnyeoul: Afternoon ocean view at ridge cafes',
        '19:30 Gwangalli Beach: Wrap up day with dazzling Gwangan Bridge lights'
      ]
    },

    steplessPoints: [
      {
        icon: 'Train',
        titleKo: '부산역 6번 출구 방향 EV',
        titleEn: 'Busan Station Exit 6 Direction EV',
        descKo: 'KTX 대합실 2층에서 1층 및 지하철 1호선 지하 통로까지 단차 없이 엘리베이터로 직결됩니다.',
        descEn: 'Step-free elevator connection from KTX 2F concourse to Line 1 underground walkway.',
        stationInfo: '부산역 6번 출구'
      },
      {
        icon: 'MapPin',
        titleKo: '감천문화마을 상부 전망로 공략',
        titleEn: 'Gamcheon Upper Ridge Walkway',
        descKo: '마을 아랫길 계단 대신, 버스정류장 앞 상부 메인 도로를 따라 수평 이동하면 어린왕자 포토존까지 턱 없이 접근 가능합니다.',
        descEn: 'Follow the flat upper main street from the bus stop directly to the Little Prince photo zone avoiding all stairs.'
      },
      {
        icon: 'Utensils',
        titleKo: '부평깡통시장 바닥 턱 0cm 평탄로',
        titleEn: 'Bupyeong Market 0cm Flat Aisles',
        descKo: '시장 전체가 아스팔트/타일 평지로 포장되어 캐리어와 휠체어가 부드럽게 주행합니다.',
        descEn: 'The entire market is paved with flat tiles, allowing smooth rolling for luggage and strollers.'
      },
      {
        icon: 'Sunset',
        titleKo: '광안역 3번 출구 엘리베이터',
        titleEn: 'Gwangan Station Exit 3 Elevator',
        descKo: '3번 출구 승강기로 지상 진입 후 해변 방향으로 600m 완만한 인도를 따라 내려가면 광안대교 수평선이 바로 나타납니다.',
        descEn: 'Take Exit 3 elevator to the surface and follow the 600m level sidewalk down to the beachfront.'
      }
    ],

    highlights: [
      {
        titleKo: '부산역 첫 풍경과 환영 인사',
        titleEn: 'Busan Station Historic Gateway',
        descKo: '유라시아 대륙철도의 시종점인 부산역 유라시아 플랫폼에서 부산 바다 바람을 맞이하세요.',
        descEn: 'Step onto the Eurasia Platform at Busan Station to welcome the fresh marine breeze.'
      },
      {
        titleKo: '부평깡통시장 삼총사 (비빔당면·씨앗호떡·물떡)',
        titleEn: 'Traditional Bupyeong Market Trio',
        descKo: '부산에서만 맛볼 수 있는 따뜻한 멸치 육수 물떡과 매콤달콤 비빔당면을 맛보세요.',
        descEn: 'Taste authentic hot-broth water rice cakes and sweet spicy glass noodles.'
      },
      {
        titleKo: '광안대교 다이내믹 오색 LED 야경',
        titleEn: 'Dynamic Gwangan Bridge Light Show',
        descKo: '백사장 뒤편 넓은 보행 테라스에 앉아 시원한 바닷바람과 함께 부산의 대표 야경을 감상하세요.',
        descEn: 'Sit on the wide beachfront terrace watching vibrant light reflections over gentle waves.'
      }
    ],

    shortCourse: {
      titleKo: '시간이 부족하다면? (반나절 6시간 압축 코스)',
      titleEn: 'Short on Time? (6-Hour Express Course)',
      routeKo: '부산역 ➔ 부평깡통시장/남포동 ➔ 영도 흰여울문화마을 ➔ 부산역 귀가',
      routeEn: 'Busan Station ➔ Bupyeong Market / Nampo ➔ Yeongdo Huinnyeoul ➔ Busan Station Departure',
      tipKo: '광안리를 생략하고 1호선 원도심(남포/영도)에만 집중하면 이동 시간을 1시간 이상 절약할 수 있습니다.',
      tipEn: 'By focusing exclusively on Line 1 downtown (Nampo & Yeongdo) and omitting Gwangalli, save over 1 hour of transit time.'
    },

    rainyDayOption: {
      titleKo: '☔ 비 오는 날에는 이렇게 변경하세요',
      titleEn: '☔ Rainy Day Indoor Adaptation',
      descKo: '야외인 감천과 영도 대신, 비를 완전히 피할 수 있는 자갈치시장 신건물 옥상전망대와 롯데백화점 광복점 아쿠아몰(실내 분수쇼)로 대체하세요.',
      descEn: 'Replace outdoor hills with Jagalchi Market 7F rooftop observatory and Lotte Mall Gwangbok Indoor Aqua Fountain.',
      indoorSpotsKo: ['부평깡통시장 비가림 아케이드', '자갈치시장 현대식 수산몰 (EV 3대)', '롯데백화점 광복점 아쿠아몰'],
      indoorSpotsEn: ['Bupyeong Covered Market Arcade', 'Jagalchi Modern Seafood Mall (3 EVs)', 'Lotte Department Store Gwangbok Aqua Mall']
    },

    connectedPlaces: [
      {
        nameKo: '용두산공원 & 부산타워',
        nameEn: 'Yongdusan Park & Busan Tower',
        connectionReasonKo: '남포동 광복로와 연결되어 있으며, 광복로에서 에스컬레이터로 올라가 원도심 파노라마 뷰를 볼 수 있습니다.',
        connectionReasonEn: 'Directly linked to Gwangbok-ro, accessible via escalators for panoramic downtown vistas.',
        transitTipKo: '남포역 1번 출구에서 광복로 진입 후 수직 엘리베이터 타워 이용 권장',
        transitTipEn: 'From Nampo Station Exit 1, use the vertical elevator tower inside the park.'
      },
      {
        nameKo: '보수동 책방골목',
        nameEn: 'Bosudong Book Alley',
        connectionReasonKo: '부평깡통시장 북측 횡단보도를 건너면 바로 연결되는 70년 전통의 평탄한 고서점 골목입니다.',
        connectionReasonEn: 'Located right across the northern crosswalk of Bupyeong Market, a 70-year historic bookstore alley on flat stone paths.',
        transitTipKo: '부평시장 북문에서 도보 2분 (횡단보도 턱 0cm)',
        transitTipEn: '2 mins walk from Bupyeong Market north gate (0cm curb ramps).'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 2. DAY TRIP 2 (초록 디톡스 생태 코스)
  // ---------------------------------------------------------------------------
  'itinerary-day': {
    courseId: 'itinerary-day',
    category: 'DAY',
    dayTitleKo: '당일치기 · 낙동강 초록빛 생태 힐링 디톡스 투어',
    dayTitleEn: '1-Day · Nakdong River Eco Green Detox Healing Tour',
    oneLineSummaryKo: '삼락·맥도·대저생태공원을 따라 계단과 경사가 0%인 완벽한 평탄 수변 데크길을 여유롭게 거니는 자연 힐링 코스',
    oneLineSummaryEn: 'A completely stair-free natural healing walk along Samnak, Maekdo, and Daejeo Eco Parks on flat riverside boardwalks.',
    recommendedDurationKo: '약 5~6시간 (반나절~당일치기)',
    recommendedDurationEn: 'Approx. 5–6 Hours (Half to 1 Day)',
    mainRegionsKo: '사상 삼락생태공원 · 강서 맥도생태공원 · 대저생태공원',
    mainRegionsEn: 'Sasang Samnak Park · Gangseo Maekdo Park · Daejeo Eco Park',
    transitMethodKo: '부산김해경전철(괘법르네시떼역) + 지하철 3호선(강서구청역)',
    transitMethodEn: 'Light Rail (Gwaebeop Renecite Stn) + Line 3 (Gangseo-gu Office Stn)',
    difficultyLevel: 'EASY',
    difficultyLabelKo: '쉬움 (전 구간 완전 평지 0cm)',
    difficultyLabelEn: 'Easy (100% Zero-Step Level Walkways)',
    difficultyScore: 1,
    difficultyDescKo: '낙동강 하구 둔치에 조성되어 오르막길이나 계단이 전혀 없으며, 휠체어와 유모차가 가장 안전하게 굴러갈 수 있는 최적의 무단차 지형입니다.',
    difficultyDescEn: 'Constructed on river plains with zero inclines or stairs, offering the safest smooth rolling terrain for strollers and wheelchairs.',
    
    targetAudiences: [
      {
        type: 'STROLLER',
        labelKo: '유모차 동반 가족',
        labelEn: 'Family with Stroller',
        icon: '👶',
        reasonKo: '폭 2.5m 이상의 넓고 매끄러운 목재 데크와 버드나무 그늘 쉼터가 이어져 아이와 함께 편안히 산책할 수 있습니다.',
        reasonEn: 'Over 2.5m wide smooth boardwalks shaded by weeping willows allow peaceful strolling with children.'
      },
      {
        type: 'WHEELCHAIR',
        labelKo: '휠체어 이용자',
        labelEn: 'Wheelchair User',
        icon: '♿',
        reasonKo: '괘법르네시떼역 육교 승강기 및 강서구청역 무단차 통로가 공원 산책로와 수평으로 직결됩니다.',
        reasonEn: 'Elevators at Gwaebeop Renecite and Line 3 Gangseo-gu Office connect horizontally straight to park walkways.'
      },
      {
        type: 'SENIOR',
        labelKo: '보행약자 / 어르신',
        labelEn: 'Seniors & Gentle Walk',
        icon: '👵',
        reasonKo: '경사도 1도 미만의 수평 평지라 무릎 관절에 무리 없이 사계절 꽃밭과 강바람을 만끽할 수 있습니다.',
        reasonEn: 'Level terrain under 1-degree slope protects joints while enjoying seasonal flower fields and river breezes.'
      }
    ],

    whyThisOrderKo: {
      titleKo: '왜 이 순서로 여행할까요?',
      descriptionKo: '괘법르네시떼역(삼락공원) ➔ 사상역 주변 점심 ➔ 대저생태공원(3호선 강서구청역)으로 이어집니다. 경전철과 3호선의 편리한 역사 승강기 인프라를 활용하여 이동 피로를 없앴습니다.',
      flowStepsKo: [
        '10:00 괘법르네시떼역 도착: 강변 보행 육교 엘리베이터로 삼락생태공원 진입',
        '11:30 삼락 연꽃 단지 & 버드나무 숲길 힐링 산책',
        '13:00 사상역 인근 무단차 식당에서 점심 식사',
        '14:30 3호선 강서구청역 이동 ➔ 대저생태공원 대나무 숲길 및 갈대밭 산책'
      ]
    },
    whyThisOrderEn: {
      titleEn: 'Why Travel in This Order?',
      descriptionEn: 'Gwaebeop Renecite (Samnak Park) ➔ Sasang Station Lunch ➔ Daejeo Eco Park (Line 3 Gangseo-gu Office). Leverages direct elevator bridges to eliminate all transit stress.',
      flowStepsEn: [
        '10:00 Arrive Gwaebeop Renecite: Take elevator bridge into Samnak Eco Park',
        '11:30 Stroll Samnak lotus pond and willow forest boardwalk',
        '13:00 Lunch at barrier-free diners near Sasang Station',
        '14:30 Take Line 3 to Gangseo-gu Office ➔ Stroll Daejeo Bamboo Grove & reeds'
      ]
    },

    steplessPoints: [
      {
        icon: 'Train',
        titleKo: '괘법르네시떼역 1번 출구 전용 육교 EV',
        titleEn: 'Gwaebeop Renecite Exit 1 Bridge EV',
        descKo: '역사에서 삼락공원으로 넘어가는 강변나들교에 양방향 대형 엘리베이터가 설치되어 있어 도로를 건너지 않고 바로 공원에 닿습니다.',
        descEn: 'Two-way elevators on the Gangbyeon Nadeulgyo bridge lead directly from station into the park without road crossings.',
        stationInfo: '부산김해경전철 괘법르네시떼역 1번 출구'
      },
      {
        icon: 'Compass',
        titleKo: '대저생태공원 강서구청역 1번 출구',
        titleEn: 'Daejeo Park Gangseo-gu Office Exit 1',
        descKo: '1번 출구 엘리베이터에서 나와 둑길 아래로 연결되는 완만 슬로프(경사도 1/18 이하)를 통해 공원 내부로 진입합니다.',
        descEn: 'Exit 1 elevator connects via a gentle slope (under 1/18) down to park paths.'
      }
    ],

    highlights: [
      {
        titleKo: '삼락공원 드넓은 연꽃 단지와 버드나무 숲',
        titleEn: 'Samnak Vast Lotus Marsh & Willow Canopy',
        descKo: '여름철 만개하는 연꽃과 시원한 버드나무 그늘 아래서 책을 읽거나 물소리를 듣기 좋습니다.',
        descEn: 'Enjoy blooming lotus flowers and calming willow shadows with peaceful river breezes.'
      },
      {
        titleKo: '대저생태공원 사계절 꽃밭과 대나무 숲',
        titleEn: 'Daejeo Seasonal Blooms & Bamboo Grove',
        descKo: '봄에는 유채꽃, 가을에는 핑크뮬리가 대지를 덮으며, 대나무 숲길은 야자매트가 깔려 있어 걷기 편안합니다.',
        descEn: 'Yellow canola in spring, pink muhly in autumn, with soft coconut fiber mats along the bamboo trails.'
      }
    ],

    connectedPlaces: [
      {
        nameKo: '사상 애플아울렛 & 롯데시네마',
        nameEn: 'Sasang Apple Outlet & Lotte Cinema',
        connectionReasonKo: '사상역 지하철과 직결되어 있어 산책 후 시원한 실내 쇼핑과 식사를 즐기기 좋습니다.',
        connectionReasonEn: 'Directly linked underground to Sasang Station for indoor shopping and dining after the walk.',
        transitTipKo: '사상역 3번·5번 출구 지하 직결 통로 이용',
        transitTipEn: 'Use Sasang Station Exits 3/5 direct indoor passages.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 3. 1NIGHT 2DAYS (1박 2일 코스)
  // ---------------------------------------------------------------------------
  'itinerary-1night': {
    courseId: 'itinerary-1night',
    category: '1NIGHT',
    dayTitleKo: '1박 2일 · 동선 최적화 부산 핵심 정복 코스',
    dayTitleEn: '1N2D · Geographically Optimized Core Route',
    oneLineSummaryKo: 'Day 1은 1호선 원도심과 영도, Day 2는 2호선 광안리·해운대·청사포로 나누어 이동 시간을 절반으로 줄인 완벽한 동선',
    oneLineSummaryEn: 'Day 1 focuses on Line 1 Historic Downtown/Yeongdo, and Day 2 follows Line 2 Gwangalli/Haeundae/Cheongsapo, cutting transit fatigue in half.',
    recommendedDurationKo: '1박 2일 (추천)',
    recommendedDurationEn: '1 Night 2 Days (Recommended)',
    mainRegionsKo: 'Day 1: 원도심·영도 / Day 2: 광안리·해운대·청사포',
    mainRegionsEn: 'Day 1: Old Downtown & Yeongdo / Day 2: Gwangalli, Haeundae & Cheongsapo',
    transitMethodKo: 'Day 1: 지하철 1호선 중심 / Day 2: 지하철 2호선 + 해변열차',
    transitMethodEn: 'Day 1: Line 1 focus / Day 2: Line 2 + Haeundae Beach Train',
    difficultyLevel: 'MODERATE',
    difficultyLabelKo: '보통 (권역별 분리 동선)',
    difficultyLabelEn: 'Moderate (Zonal Separation)',
    difficultyScore: 2,
    difficultyDescKo: '동서로 긴 부산의 지형을 고려하여 첫날은 서남부(원도심), 둘째 날은 동남부(해변)로 집중 배치하여 지하철 노선 갈아타기를 최소화했습니다.',
    difficultyDescEn: 'Grouped into Southwest (Day 1) and Southeast (Day 2) zones, avoiding endless line transfers.',
    
    targetAudiences: [
      {
        type: 'CARRIER',
        labelKo: '캐리어 여행자',
        labelEn: 'Luggage Traveler',
        icon: '🧳',
        reasonKo: 'Day 1 남포/서면 숙소에 짐을 체크인하고, Day 2에는 해운대역/부산역 짐 보관소를 활용하여 캐리어 부담 없이 이동합니다.',
        reasonEn: 'Check luggage into Nampo/Seomyeon hotel on Day 1, and use station lockers on Day 2 for hands-free travels.'
      },
      {
        type: 'WHEELCHAIR',
        labelKo: '휠체어 / 유모차',
        labelEn: 'Wheelchair / Stroller',
        icon: '♿',
        reasonKo: '해운대 해변열차(블루라인파크) 미포 승강장은 전동 휠체어 리프트와 무단차 탑승 게이트가 완비되어 있습니다.',
        reasonEn: 'Haeundae Beach Train at Mipo features level-boarding platforms and powered wheelchair lifts.'
      },
      {
        type: 'MIN_WALK',
        labelKo: '짧은 일정 알짜 여행',
        labelEn: 'Efficient Short Stay',
        icon: '🚶',
        reasonKo: '1박 2일이라는 짧은 시간 동안 부산의 산·바다·시장·야경을 모두 경험할 수 있는 가장 압축적인 최적 동선입니다.',
        reasonEn: 'The most condensed route experiencing mountains, oceans, markets, and night lights within 2 days.'
      }
    ],

    whyThisOrderKo: {
      titleKo: '왜 이 순서로 여행할까요?',
      descriptionKo: '첫날 부산역 도착 후 1호선 권역(남포·자갈치·영도)에 집중하여 체크인과 식사를 해결하고, 둘째 날은 2호선을 타고 동쪽 바다(광안리 ➔ 해운대 ➔ 청사포 ➔ 기장)로 순차 이동하면 지그재그 이동이 전혀 발생하지 않습니다.',
      flowStepsKo: [
        'Day 1 오전: 부산역 ➔ 감천문화마을 (상부 전망로)',
        'Day 1 점심: 부평깡통시장 & 국제시장 로컬 미식 투어',
        'Day 1 오후: 영도 흰여울문화마을 해안 카페 티타임 & 태종대 다누비열차',
        'Day 1 저녁: 용두산공원 부산타워 야경 & 원도심/서면 숙박',
        'Day 2 오전: 광안리 해수욕장 & 광안대교 모래사장 데크 산책',
        'Day 2 점심: 해운대 구남로 맛집 & 동백섬 누리마루 수평 데크',
        'Day 2 오후: 해운대 블루라인파크 해변열차 탑승 (미포 ➔ 청사포 쌍둥이등대)',
        'Day 2 저녁: 해동용궁사 평탄 진입로 관람 ➔ 부산역/공항 귀가'
      ]
    },
    whyThisOrderEn: {
      titleEn: 'Why Travel in This Order?',
      descriptionEn: 'Focus on Line 1 (Nampo/Yeongdo) on Day 1 for check-in and dining, then travel east along Line 2 on Day 2 (Gwangalli ➔ Haeundae ➔ Cheongsapo ➔ Gijang), eliminating all backtracking.',
      flowStepsEn: [
        'Day 1 Morning: Busan Stn ➔ Gamcheon Village (Upper flat path)',
        'Day 1 Lunch: Bupyeong Kkangtong & Gukje Market Food Tour',
        'Day 1 Afternoon: Yeongdo Huinnyeoul Cafes & Taejongdae Danubi Train',
        'Day 1 Evening: Yongdusan Park Busan Tower Night View & Hotel Check-in',
        'Day 2 Morning: Gwangalli Beach & Gwangan Bridge Promenade',
        'Day 2 Lunch: Haeundae Gunam-ro Dining & Dongbaekseom Boardwalk',
        'Day 2 Afternoon: Haeundae Blue Line Beach Train (Mipo ➔ Cheongsapo)',
        'Day 2 Evening: Haedong Yonggungsa flat bypass ➔ Departure'
      ]
    },

    steplessPoints: [
      {
        icon: 'Train',
        titleKo: '동백역 1번 출구 ➔ 동백섬 무단차 직결',
        titleEn: 'Dongbaek Station Exit 1 to Island',
        descKo: '동백역 1번 출구 승강기를 이용해 웨스틴조선 방면으로 수평 보도를 따라가면 계단 없이 동백섬 순환 목재 데크로 연결됩니다.',
        descEn: 'Take Dongbaek Exit 1 elevator down the level road toward Westin Chosun to join the flat circular boardwalk.'
      },
      {
        icon: 'Compass',
        titleKo: '해운대 해변열차 미포정거장 무단차 경사로',
        titleEn: 'Mipo Station Barrier-Free Ramp',
        descKo: '매표소부터 승강장까지 턱이 없으며, 휠체어/유모차 전용 탑승 구역이 열차 1열에 배정되어 있습니다.',
        descEn: 'Step-free ramps from ticket counter to platform, with dedicated wheelchair spaces in carriage 1.'
      }
    ],

    highlights: [
      {
        titleKo: '영도 흰여울문화마을 깎아지른 절벽 오션뷰',
        titleEn: 'Yeongdo Huinnyeoul Cliffside Ocean Vistas',
        descKo: '푸른 바다 위로 배들이 닻을 내린 묘박지 풍경을 바라보며 시원한 음료를 즐기세요.',
        descEn: 'Gaze out at cargo ships anchored in peaceful blue waters while sipping coffee.'
      },
      {
        titleKo: '해운대 해변열차에서 바라보는 동해안 절경',
        titleEn: 'Haeundae Beach Train Panoramic Waves',
        descKo: '바다를 정면으로 바라보는 좌석에 앉아 미포에서 청사포까지 청량한 파도를 감상하세요.',
        descEn: 'Sit in front-facing panoramic seats viewing rolling waves from Mipo to Cheongsapo.'
      }
    ],

    connectedPlaces: [
      {
        nameKo: '신세계백화점 센텀시티',
        nameEn: 'Shinsegae Centum City',
        connectionReasonKo: '2호선 센텀시티역 지하와 직결되어 있어 해운대 이동 중 실내 쇼핑과 스파를 즐기기 좋습니다.',
        connectionReasonEn: 'Directly connected underground to Centum City Station for indoor luxury shopping and spas.',
        transitTipKo: '센텀시티역 1번·2번 출구 지하 직결',
        transitTipEn: 'Direct underground access from Centum City Exits 1/2.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 4. 2NIGHTS 3DAYS (2박 3일 코스)
  // ---------------------------------------------------------------------------
  'itinerary-2nights': {
    courseId: 'itinerary-2nights',
    category: '2NIGHTS',
    dayTitleKo: '2박 3일 · 권역별 핵심 완파! 동선 깔끔 낭만 코스',
    dayTitleEn: '2N3D · Zonal Perfection! Clean Transit Romantic Course',
    oneLineSummaryKo: 'Day 1 원도심·영도, Day 2 서면·광안리, Day 3 해운대·기장으로 하루 1개 핵심 권역만 깊이 있게 누리는 낭비 없는 3일',
    oneLineSummaryEn: 'Day 1 Old Downtown/Yeongdo, Day 2 Seomyeon/Gwangalli, Day 3 Haeundae/Gijang—deep exploration of 1 distinct zone per day.',
    recommendedDurationKo: '2박 3일 (가장 인기 있는 일정)',
    recommendedDurationEn: '2 Nights 3 Days (Most Popular Itinerary)',
    mainRegionsKo: 'Day 1: 부산역·남포·영도 / Day 2: 서면·전포·광안리 / Day 3: 해운대·청사포·기장',
    mainRegionsEn: 'Day 1: Busan Stn, Nampo, Yeongdo / Day 2: Seomyeon, Jeonpo, Gwangalli / Day 3: Haeundae, Cheongsapo, Gijang',
    transitMethodKo: '지하철 1호선 ➔ 2호선 ➔ 동해선 (순차적 동쪽 이동)',
    transitMethodEn: 'Subway Line 1 ➔ Line 2 ➔ Donghae Line (Sequential eastward progression)',
    difficultyLevel: 'MODERATE',
    difficultyLabelKo: '보통 (하루 1개 권역 집중)',
    difficultyLabelEn: 'Moderate (1 Zone per Day)',
    difficultyScore: 2,
    difficultyDescKo: '숙소를 서면(1·2호선 환승역)이나 해운대에 잡으면 짐 이동 없이 대중교통만으로 매일 편안하게 출퇴근하듯 여행할 수 있습니다.',
    difficultyDescEn: 'Lodging in Seomyeon (transfer hub) or Haeundae enables effortless daily transit without luggage repositioning.',
    
    targetAudiences: [
      {
        type: 'CARRIER',
        labelKo: '캐리어 여행자',
        labelEn: 'Luggage Traveler',
        icon: '🧳',
        reasonKo: '서면역에 거점 숙소를 정하면 1·2호선을 모두 환승 없이 이용할 수 있어 캐리어를 방에 두고 가볍게 다닐 수 있습니다.',
        reasonEn: 'Base your stay in Seomyeon to access Lines 1 & 2 directly, leaving heavy baggage safely in your room.'
      },
      {
        type: 'STROLLER',
        labelKo: '유모차 동반 가족',
        labelEn: 'Family with Stroller',
        icon: '👶',
        reasonKo: '광안리 민락더마켓과 해운대 송림공원 산책로는 단차가 전혀 없고 수유실 및 가족 화장실이 완비되어 있습니다.',
        reasonEn: 'Millak the Market and Haeundae Pine Grove feature zero stairs with modern nursing rooms and family restrooms.'
      },
      {
        type: 'SENIOR',
        labelKo: '어르신 & 가족 여행',
        labelEn: 'Seniors & Family Trip',
        icon: '👵',
        reasonKo: '오전 1곳, 오후 1곳으로 여유롭게 일정을 분배하여 체력 소모를 방지하고 식사와 카페 시간을 넉넉히 가집니다.',
        reasonEn: 'Paced at 1 spot in the morning and 1 in the afternoon to prevent fatigue and allow relaxing dining.'
      }
    ],

    whyThisOrderKo: {
      titleKo: '왜 이 순서로 여행할까요?',
      descriptionKo: '부산의 서쪽(원도심 역사)에서 시작하여 중심(서면 도심 문화)을 거쳐 동쪽(해운대·기장 바다 휴양)으로 물 흐르듯 순차 이동하는 코스입니다. 지하철 환승 노선을 순서대로 밟아가기 때문에 이동 경로가 완벽한 일직선을 이룹니다.',
      flowStepsKo: [
        'Day 1 (원도심 & 영도): 부산역 도착 ➔ 부평깡통시장 점심 ➔ 영도 흰여울문화마을 ➔ 용두산공원 부산타워 야경',
        'Day 2 (서면 & 광안리): 전포카페거리 브런치 ➔ 광안리 해수욕장 바다 산책 ➔ 민락더마켓 & 광안대교 야경 점등',
        'Day 3 (해운대 & 기장): 해운대 블루라인파크 해변열차 ➔ 청사포 쌍둥이등대 & 조개구이 점심 ➔ 해동용궁사 ➔ 귀가'
      ]
    },
    whyThisOrderEn: {
      titleEn: 'Why Travel in This Order?',
      descriptionEn: 'Flows naturally from West (historic downtown) through Center (Seomyeon urban culture) to East (Haeundae & Gijang coastal leisure). Moving along subway lines in sequence creates a clean linear progression.',
      flowStepsEn: [
        'Day 1 (Downtown & Yeongdo): Busan Stn ➔ Bupyeong Market Lunch ➔ Huinnyeoul Village ➔ Yongdusan Park Night View',
        'Day 2 (Seomyeon & Gwangalli): Jeonpo Cafe Brunch ➔ Gwangalli Beach Ocean Walk ➔ Millak the Market & Bridge Lights',
        'Day 3 (Haeundae & Gijang): Haeundae Blue Line Beach Train ➔ Cheongsapo Clam Lunch ➔ Haedong Yonggungsa ➔ Departure'
      ]
    },

    steplessPoints: [
      {
        icon: 'Train',
        titleKo: '서면역 환승 엘리베이터 (1호선 ↔ 2호선)',
        titleEn: 'Seomyeon Transfer EV (Line 1 ↔ 2)',
        descKo: '서면역 승강장 중앙의 수직 승강기를 이용하면 계단 없이 1호선과 2호선 사이를 2분 만에 환승할 수 있습니다.',
        descEn: 'Use the platform center elevators for a seamless 2-minute step-free transfer between Lines 1 & 2.',
        stationInfo: '서면역 환승 승강기'
      },
      {
        icon: 'Building2',
        titleKo: '민락더마켓 실내 복합 문화공간 승강기',
        titleEn: 'Millak the Market Indoor EVs',
        descKo: '1층 주차장 및 해변 진입로에서 2층 오션뷰 광장까지 대형 승강기가 연결되어 있어 휠체어와 유모차 이동이 쾌적합니다.',
        descEn: 'Large elevators link ground entrances to the 2F ocean-view food hall without stairs.'
      }
    ],

    highlights: [
      {
        titleKo: '전포카페거리 감성 브런치와 스페셜티 커피',
        titleEn: 'Jeonpo Cafe Street Artisan Coffee & Brunch',
        descKo: '뉴욕타임스가 선정한 전포카페거리의 아기자기한 골목에서 향긋한 커피 한 잔을 즐기세요.',
        descEn: 'Enjoy freshly brewed specialty coffee in charming indie cafes highlighted by The New York Times.'
      },
      {
        titleKo: '민락더마켓 대형 유리창 너머 광안대교 뷰',
        titleEn: 'Millak the Market Giant Glass Bridge Panorama',
        descKo: '계단식 오션뷰 스탠드와 넓은 실내 테이블에서 맛있는 음식과 함께 야경을 만끽하세요.',
        descEn: 'Savor gourmet dishes with front-row stadium-style seats looking out at the illuminated bridge.'
      }
    ],

    connectedPlaces: [
      {
        nameKo: '부산시립미술관 & 영화의전당',
        nameEn: 'Busan Museum of Art & Cinema Center',
        connectionReasonKo: '센텀시티역에서 광안리로 이동하는 중간에 위치하며 실내 전시장 전체가 100% 무단차입니다.',
        connectionReasonEn: 'Located between Centum City and Gwangalli, featuring 100% barrier-free indoor exhibition halls.',
        transitTipKo: '센텀시티역 6번 출구 또는 벡스코역 7번 출구 이용',
        transitTipEn: 'Use Centum City Exit 6 or BEXCO Exit 7.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 5. 3NIGHTS 4DAYS (3박 4일 코스)
  // ---------------------------------------------------------------------------
  'itinerary-3nights': {
    courseId: 'itinerary-3nights',
    category: '3NIGHTS',
    dayTitleKo: '3박 4일 · 부산 전역 완전 정복! 여유로운 완벽 휴식 코스',
    dayTitleEn: '3N4D · Full Busan Mastery! Relaxed Ultimate Route',
    oneLineSummaryKo: 'Day 1 원도심·영도, Day 2 서면·센텀·해운대, Day 3 기장·광안리, Day 4 송도·다대포까지 부산의 4대 핵심 축을 완벽하게 완주',
    oneLineSummaryEn: 'Day 1 Downtown/Yeongdo, Day 2 Seomyeon/Centum/Haeundae, Day 3 Gijang/Gwangalli, Day 4 Songdo/Dadaepo across 4 distinct days.',
    recommendedDurationKo: '3박 4일 (부산 완전 마스터)',
    recommendedDurationEn: '3 Nights 4 Days (Full Busan Master)',
    mainRegionsKo: 'Day 1: 원도심·영도 / Day 2: 센텀·해운대 / Day 3: 동부산·광안리 / Day 4: 송도·다대포',
    mainRegionsEn: 'Day 1: Downtown/Yeongdo / Day 2: Centum/Haeundae / Day 3: East Busan/Gwangalli / Day 4: Songdo/Dadaepo',
    transitMethodKo: '지하철 1·2·3호선 + 동해선 + 해상케이블카',
    transitMethodEn: 'Subway Lines 1, 2, 3 + Donghae Line + Marine Cable Car',
    difficultyLevel: 'MODERATE',
    difficultyLabelKo: '보통 (일정별 여유로운 배치)',
    difficultyLabelEn: 'Moderate (Spacious Daily Pace)',
    difficultyScore: 2,
    difficultyDescKo: '시간적 여유가 충분하여 서두르지 않고 각 관광지의 무단차 쉼터와 카페에서 충분히 쉬어가며 완주할 수 있습니다.',
    difficultyDescEn: 'Ample time allows relaxing stops at accessible cafe lounges without rushing.',
    
    targetAudiences: [
      {
        type: 'SENIOR',
        labelKo: '느긋한 힐링 여행자',
        labelEn: 'Leisurely Healing Traveler',
        icon: '👵',
        reasonKo: '하루에 방문하는 장소를 2~3곳으로 적정 분배하여 체력 고갈 없이 풍경을 감상할 수 있습니다.',
        reasonEn: 'Capped at 2–3 spots per day to preserve stamina while absorbing breathtaking scenery.'
      },
      {
        type: 'CARRIER',
        labelKo: '장기 여행자',
        labelEn: 'Multi-Day Traveler',
        icon: '🧳',
        reasonKo: '동서남북 4대 권역을 체계적으로 돌며 지하철 주요 역사의 짐보관함 인프라를 최적으로 활용합니다.',
        reasonEn: 'Systematically covers all 4 quadrants using subway lockers at major transfer stations.'
      },
      {
        type: 'WHEELCHAIR',
        labelKo: '휠체어 / 보행약자',
        labelEn: 'Wheelchair / Accessible',
        icon: '♿',
        reasonKo: '다대포 생태데크길과 송도 케이블카 등 전 구간에 휠체어 탑승 편의시설이 완비되어 있습니다.',
        reasonEn: 'Dadaepo eco-boardwalk and Songdo Cable Car are 100% barrier-free with roll-on cabins.'
      }
    ],

    whyThisOrderKo: {
      titleKo: '왜 이 순서로 여행할까요?',
      descriptionKo: '부산의 역사적 뿌리인 원도심(Day 1)에서 시작해 현대 문화의 중심 센텀·해운대(Day 2), 동해안 기장과 광안리 야경(Day 3), 그리고 서부산의 낙동강 생태와 일몰(Day 4)로 끝맺는 드라마틱한 완성형 동선입니다.',
      flowStepsKo: [
        'Day 1 (원도심 역사): 부산역 ➔ 감천문화마을 ➔ 부평깡통/자갈치시장 ➔ 영도 흰여울 ➔ 용두산공원',
        'Day 2 (도심 & 해운대): 전포카페거리 ➔ 센텀 영화의전당 ➔ 해운대 해변열차 ➔ 동백섬 산책로',
        'Day 3 (동부산 & 낭만 바다): 기장 해동용궁사 ➔ 오시리아 해안길 ➔ 광안리 해변 ➔ 드론라이트쇼',
        'Day 4 (서부산 생태 & 일몰): 송도 해상케이블카 ➔ 다대포 몰운대 갈대데크길 ➔ 부산역/공항 귀가'
      ]
    },
    whyThisOrderEn: {
      titleEn: 'Why Travel in This Order?',
      descriptionEn: 'A dramatic narrative route starting at historic roots (Day 1), modern coastal glamor (Day 2), eastern ocean romance (Day 3), and grand western estuary sunsets (Day 4).',
      flowStepsEn: [
        'Day 1 (Historic Downtown): Busan Stn ➔ Gamcheon ➔ Jagalchi Market ➔ Yeongdo ➔ Yongdusan',
        'Day 2 (Urban & Haeundae): Jeonpo Cafe ➔ Centum Cinema Center ➔ Beach Train ➔ Dongbaekseom',
        'Day 3 (East Busan Ocean): Haedong Yonggungsa ➔ Osiria Walk ➔ Gwangalli ➔ Drone Show',
        'Day 4 (West Busan Sunset): Songdo Marine Cable Car ➔ Dadaepo Eco Boardwalk ➔ Departure'
      ]
    },

    steplessPoints: [
      {
        icon: 'Train',
        titleKo: '다대포해수욕장역 1번 출구 ➔ 백사장 데크 직결',
        titleEn: 'Dadaepo Exit 1 Direct Boardwalk Link',
        descKo: '1번 출구 엘리베이터에서 나오면 도로 턱 없이 곧바로 2km 길이의 평탄 목재 산책로가 펼쳐집니다.',
        descEn: 'Exit 1 elevator opens directly onto the 2km flat eco-wood boardwalk without street crossings.',
        stationInfo: '다대포해수욕장역 1번 출구'
      },
      {
        icon: 'Compass',
        titleKo: '송도 해상케이블카 탑승 승강기',
        titleEn: 'Songdo Cable Car Platform Lift',
        descKo: '케이블카 캐빈 바닥과 승강장 사이 턱이 0cm로 정밀 맞춤되어 휠체어가 바로 탑승합니다.',
        descEn: 'Zero-step alignment between platform and cabin enables seamless roll-on boarding.'
      }
    ],

    highlights: [
      {
        titleKo: '다대포 몰운대 낙조 분수와 황금빛 일몰',
        titleEn: 'Dadaepo Sunset & Dream Fountain',
        descKo: '대한민국에서 가장 넓은 백사장 위로 지는 환상적인 붉은 노을을 단차 없는 데크에서 감상하세요.',
        descEn: 'Watch glorious golden sunsets over vast tidal flats from perfectly level wooden lookouts.'
      },
      {
        titleKo: '광안리 토요일 밤 드론 라이트쇼',
        titleEn: 'Gwangalli Saturday Night Drone Show',
        descKo: '수백 대의 드론이 바다 위 밤하늘을 수놓는 환상적인 공연을 모래사장 뒤편 평탄 보도에서 관람하세요.',
        descEn: 'Hundreds of illuminated drones form dynamic 3D shapes over the glittering night ocean.'
      }
    ],

    connectedPlaces: [
      {
        nameKo: '을숙도 철새도래지 & 부산현대미술관',
        nameEn: 'Eulsukdo Bird Sanctuary & MOCA Busan',
        connectionReasonKo: '서부산 다대포로 이동하는 길목인 하단역 인근에 위치하며 미술관 전체가 무단차입니다.',
        connectionReasonEn: 'Located near Hadan Station en route to Dadaepo; the modern museum is 100% barrier-free.',
        transitTipKo: '하단역 1번 출구에서 저상버스 55번/58-2번 탑승 (10분 소요)',
        transitTipEn: 'Take low-floor bus 55 or 58-2 from Hadan Station Exit 1.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 6. 4NIGHTS 5DAYS (4박 5일 코스)
  // ---------------------------------------------------------------------------
  'itinerary-4nights': {
    courseId: 'itinerary-4nights',
    category: '4NIGHTS',
    dayTitleKo: '4박 5일 · 부산 완벽 정복! 여유 만점 대장정',
    dayTitleEn: '4N5D · Ultimate Busan Mastery! Grand Barrier-Free Tour',
    oneLineSummaryKo: '원도심 역사부터 동부산 오시리아, 서부산 낙동강 생태까지 부산 16개 구군의 매력을 남김없이 섭렵하는 웰니스 여행',
    oneLineSummaryEn: 'A wellness grand tour exploring historic roots, East Busan ocean resorts, and West Busan wetlands over 5 rewarding days.',
    recommendedDurationKo: '4박 5일 (장기 체류형 완주)',
    recommendedDurationEn: '4 Nights 5 Days (Grand Staycation)',
    mainRegionsKo: 'Day 1: 영도 / Day 2: 원도심 / Day 3: 해운대·송정 / Day 4: 다대포·을숙도 / Day 5: 센텀·서면',
    mainRegionsEn: 'Day 1: Yeongdo / Day 2: Old Downtown / Day 3: Haeundae/Songjeong / Day 4: Dadaepo/Eulsukdo / Day 5: Centum/Seomyeon',
    transitMethodKo: '부산 지하철 전 노선 + 저상버스 + 관광열차',
    transitMethodEn: 'All Busan Subway Lines + Low-Floor Buses + Tourist Trains',
    difficultyLevel: 'EASY',
    difficultyLabelKo: '쉬움 (체력 분배 최적화)',
    difficultyLabelEn: 'Easy (Optimized Physical Pacing)',
    difficultyScore: 1,
    difficultyDescKo: '하루에 방문하는 주요 명소를 2~3개로 제한하여 보행 약자도 피로감 없이 즐길 수 있도록 설계되었습니다.',
    difficultyDescEn: 'Limits major spots to 2–3 per day so that even slow walkers enjoy the journey without fatigue.',
    
    targetAudiences: [
      {
        type: 'SENIOR',
        labelKo: '시니어 & 실버 힐링',
        labelEn: 'Senior & Silver Healing',
        icon: '👵',
        reasonKo: '촉박한 이동 없이 매일 오후 3~4시경 카페와 숙소에서 충분히 휴식하는 여유로운 템포입니다.',
        reasonEn: 'Spacious pacing allowing daily afternoon tea and hotel relaxation around 3–4 PM.'
      },
      {
        type: 'STROLLER',
        labelKo: '영유아 동반 장기 여행',
        labelEn: 'Long Stay with Infants',
        icon: '👶',
        reasonKo: '수유실과 기저귀 교환대가 완비된 대형 백화점, 복합몰, 국립 박물관이 동선마다 배치되어 있습니다.',
        reasonEn: 'Major malls and national museums equipped with nursing rooms are integrated into every daily leg.'
      }
    ],

    whyThisOrderKo: {
      titleKo: '왜 이 순서로 여행할까요?',
      descriptionKo: '부산을 5개의 명확한 생활 권역으로 쪼개어 하루에 한 권역씩만 꼼꼼히 탐방합니다. 부산의 동서남북을 고루 경험하며 피로를 전혀 느끼지 않는 무결점 동선입니다.',
      flowStepsKo: [
        'Day 1 (영도 바다마을): 영도 흰여울마을 상부 산책 ➔ 국립해양박물관 ➔ 아르떼뮤지엄',
        'Day 2 (원도심 골목 투어): BIFF광장 ➔ 국제시장 & 부평깡통시장 ➔ 보수동책방골목 ➔ 용두산공원',
        'Day 3 (동부산 해변열차): 해운대 미포 ➔ 청사포 쌍둥이등대 ➔ 송정해변 ➔ 광안리 드론쇼',
        'Day 4 (서부산 생태 힐링): 다대포 고우니 생태길 ➔ 을숙도 에코센터 ➔ 강변 노을 산책',
        'Day 5 (도심 쇼핑 & 문화): 신세계 센텀시티 ➔ 영화의전당 ➔ 전포카페거리 ➔ 부산역 귀가'
      ]
    },
    whyThisOrderEn: {
      titleEn: 'Why Travel in This Order?',
      descriptionEn: 'Segments Busan into 5 distinct zones, dedicating a full unhurried day to each without long transfers.',
      flowStepsEn: [
        'Day 1 (Yeongdo Island): Huinnyeoul Upper Path ➔ Maritime Museum ➔ ARTE Museum',
        'Day 2 (Old Downtown): BIFF Square ➔ Gukje & Bupyeong Market ➔ Bosudong ➔ Yongdusan',
        'Day 3 (East Coast Train): Haeundae Mipo ➔ Cheongsapo ➔ Songjeong ➔ Gwangalli Drone Show',
        'Day 4 (West Eco Trails): Dadaepo Gouni Boardwalk ➔ Eulsukdo Eco Center ➔ Sunset Stroll',
        'Day 5 (Urban Malls): Shinsegae Centum ➔ Cinema Center ➔ Jeonpo Cafe ➔ Departure'
      ]
    },

    steplessPoints: [
      {
        icon: 'Building2',
        titleKo: '국립해양박물관 전 층 완만 경사로 & 승강기 4대',
        titleEn: 'Maritime Museum 4 Elevators & Ramps',
        descKo: '계단 없이 나선형 슬로프와 대형 승강기로 1층부터 4층 수조 및 전망대까지 자유롭게 이동합니다.',
        descEn: 'Spiral continuous ramps and 4 high-capacity elevators link floors 1 to 4 smoothly.'
      }
    ],

    highlights: [
      {
        titleKo: '신세계 센텀시티 기네스 등재 세계 최대 백화점',
        titleEn: 'Shinsegae Centum City World Record Mall',
        descKo: '단차 없는 쾌적한 실내 대리석 바닥을 거닐며 쇼핑, 미식, 스파, 아이스링크를 즐기세요.',
        descEn: 'Enjoy world-class indoor dining, luxury boutiques, and spas on pristine level marble floors.'
      }
    ],

    connectedPlaces: [
      {
        nameKo: '송정해수욕장 죽도공원 데크길',
        nameEn: 'Songjeong Beach Jukdo Park Boardwalk',
        connectionReasonKo: '해변열차 종점인 송정정거장에서 도보 3분 거리에 있는 완만한 해송 숲 산책로입니다.',
        connectionReasonEn: 'A gentle pine-tree coastal path just 3 mins walk from Songjeong Beach Train Station.',
        transitTipKo: '동해선 송정역 또는 해변열차 송정정거장 이용',
        transitTipEn: 'Use Donghae Line Songjeong Station or Beach Train.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 7. GOURMET FOODIE COURSE (식도락 투어)
  // ---------------------------------------------------------------------------
  'itinerary-gourmet': {
    courseId: 'itinerary-gourmet',
    category: 'GOURMET',
    dayTitleKo: '식도락 투어 · 현지인 인정 부산 원조 로컬 미식 가이드',
    dayTitleEn: 'Gourmet Tour · Local-Approved Authentic Foodie Guide',
    oneLineSummaryKo: '이재모피자, 톤쇼우, 모모스커피, 금수복국, 부평시장 먹거리 등 부산 대표 미식을 권역별·지하철역별 무단차 진입 정보와 함께 총망라',
    oneLineSummaryEn: 'A complete food map of iconic venues (Lee Jae Mo, Tonshou, Momos, Geumsu) categorized by metro station with step-free entry notes.',
    recommendedDurationKo: '상시 활용 가이드 (여행 중 식사 매칭)',
    recommendedDurationEn: 'Evergreen Food Guide (Match meals to routes)',
    mainRegionsKo: '서면·전포 · 해운대·기장 · 광안리·센텀 · 남포·영도 · 동래·금정',
    mainRegionsEn: 'Seomyeon/Jeonpo · Haeundae/Gijang · Gwangalli/Centum · Nampo/Yeongdo · Dongnae/Geumjeong',
    transitMethodKo: '지하철 역세권 도보 1~5분 미식 직결',
    transitMethodEn: '1–5 min walk from subway elevator exits',
    difficultyLevel: 'EASY',
    difficultyLabelKo: '쉬움 (역세권 무단차 식당 중심)',
    difficultyLabelEn: 'Easy (Station Elevator Accessible)',
    difficultyScore: 1,
    difficultyDescKo: '각 식당마다 출입구 턱 유무와 엘리베이터 출구를 명시하여 휠체어와 유모차도 안심하고 방문할 수 있도록 선별했습니다.',
    difficultyDescEn: 'Explicit step notices and elevator exits provided for every eatery for confident visits.',
    
    targetAudiences: [
      {
        type: 'MIN_WALK',
        labelKo: '미식 탐험가',
        labelEn: 'Foodie Enthusiast',
        icon: '🍕',
        reasonKo: '부산 로컬들이 줄 서서 먹는 진짜 원조 맛집들을 실패 없이 찾아갈 수 있습니다.',
        reasonEn: 'Discover authentic, local-approved legendary eateries across every Busan neighborhood.'
      },
      {
        type: 'WHEELCHAIR',
        labelKo: '단차 없는 식당 찾는 여행자',
        labelEn: 'Step-Free Dining Searcher',
        icon: '♿',
        reasonKo: '출입구 경사로 구비 여부와 턱 정보를 사전에 파악하여 헛걸음을 방지합니다.',
        reasonEn: 'Check entrance steps and ramps in advance to avoid inaccessible surprises.'
      }
    ],

    whyThisOrderKo: {
      titleKo: '어떻게 활용하면 좋을까요?',
      descriptionKo: '일정에 맞춰 각 지역을 여행할 때, 해당 권역의 추천 식당(음식점, 카페, 베이커리, 전통시장)을 클릭하여 지하철 출구와 무단차 정보를 확인하고 최적의 식사 코스를 매칭하세요.',
      flowStepsKo: [
        '아침/브런치: 전포카페거리 감성 브런치 (롱드라이버스) 또는 모모스커피 온천장 본점',
        '점심 미식: 남포동 이재모피자, 광안리 톤쇼우, 또는 해운대 금수복국',
        '오후 디저트: 비엔씨(B&C) 파이만주 또는 영도 모모스 로스터리 오션뷰 라운지',
        '저녁 식사: 민락더마켓 푸드홀 또는 사직동 소문난주문진막국수'
      ]
    },
    whyThisOrderEn: {
      titleEn: 'How to Best Use This Guide?',
      descriptionEn: 'When touring each regional zone, check the curated dining list to pair your day with step-free verified restaurants and cafes.',
      flowStepsEn: [
        'Breakfast/Brunch: Jeonpo Long Drivers or Momos Coffee Oncheonjang Main',
        'Lunch: Lee Jae Mo Pizza (Nampo/Seomyeon), Tonshou (Gwangalli), or Geumsu Bokguk',
        'Afternoon Tea: B&C Bakery Pie Manju or Momos Roastery Yeongdo Harbor View',
        'Dinner: Millak the Market Food Hall or Sajik Jumunjin Makguksu'
      ]
    },

    steplessPoints: [
      {
        icon: 'Utensils',
        titleKo: '이재모피자 부산역점 0cm 무단차 진입',
        titleEn: 'Lee Jae Mo Busan Station Step-Free Access',
        descKo: '부산역 6번 출구 앞 건물 1층에 위치하여 캐리어를 끌고도 턱 없이 바로 입장 가능합니다.',
        descEn: 'Ground-floor entry right outside Busan Station Exit 6 allows effortless entry with luggage.'
      },
      {
        icon: 'Coffee',
        titleKo: '모모스커피 온천장역 2번 출구 바로 앞',
        titleEn: 'Momos Coffee Oncheonjang Exit 2 Front',
        descKo: '온천장역 2번 출구 엘리베이터에서 도보 30m 평지에 위치해 이동이 매우 편리합니다.',
        descEn: '30m level walk from Oncheonjang Station Exit 2 elevator.'
      }
    ],

    highlights: [
      {
        titleKo: '100% 임실 자연 치즈를 듬뿍 넣은 이재모피자',
        titleEn: 'Legendary 100% Imsil Cheese Lee Jae Mo Pizza',
        descKo: '바삭 쫄깃한 도우와 치즈 폭탄의 풍미로 부산 여행객 필수 코스로 꼽힙니다.',
        descEn: 'A mandatory culinary pilgrimage famous for rich stringy cheese crusts.'
      }
    ],

    connectedPlaces: [
      {
        nameKo: '부전시장 먹거리 골목',
        nameEn: 'Bujeon Market Food Alley',
        connectionReasonKo: '서면역 다음 정거장인 부전역 1번 출구에 위치한 동남권 최대 전통시장으로 곰장어와 죽 골목이 유명합니다.',
        connectionReasonEn: 'One station from Seomyeon, famous for fresh seafood snacks and porridge.',
        transitTipKo: '1호선 부전역 1번 출구 엘리베이터 직결',
        transitTipEn: 'Line 1 Bujeon Station Exit 1 elevator direct link.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 8. EXPERIENCE & MUSEUM COURSE (체험 & 박물관)
  // ---------------------------------------------------------------------------
  'itinerary-experience': {
    courseId: 'itinerary-experience',
    category: 'EXPERIENCE',
    dayTitleKo: '체험 & 문화 · 오감만족 부산! 박물관 & 인터랙티브 탐방',
    dayTitleEn: 'Culture & Museum · Hands-on Interactive Experience Guide',
    oneLineSummaryKo: '국립해양박물관, 부산시립미술관, 뮤지엄원, F1963, 영화체험박물관 등 날씨 걱정 없는 100% 무단차 실내 문화 공간 모음',
    oneLineSummaryEn: 'A complete collection of 100% barrier-free indoor cultural venues (Maritime Museum, Museum 1, F1963, Cinema Center).',
    recommendedDurationKo: '반나절 ~ 하루 (실내 집중)',
    recommendedDurationEn: 'Half to 1 Day (Indoor Focus)',
    mainRegionsKo: '영도 해양클러스터 · 센텀시티 · 남포 원도심 · 기장 오시리아',
    mainRegionsEn: 'Yeongdo Maritime · Centum City · Nampo Downtown · Gijang Osiria',
    transitMethodKo: '지하철 역세권 + 저상버스 연계',
    transitMethodEn: 'Subway Hubs + Low-Floor Bus links',
    difficultyLevel: 'EASY',
    difficultyLabelKo: '쉬움 (100% 실내 무단차 엘리베이터)',
    difficultyLabelEn: 'Easy (100% Indoor Elevators & Ramps)',
    difficultyScore: 1,
    difficultyDescKo: '모든 전시관이 대형 승강기, 완만한 슬로프, 장애인 전용 화장실을 갖추고 있어 비가 오거나 더운 날에도 완벽한 쾌적함을 보장합니다.',
    difficultyDescEn: 'All exhibition centers feature spacious elevators, gentle ramps, and accessible restrooms.',
    
    targetAudiences: [
      {
        type: 'RAIN',
        labelKo: '우천 / 폭염 대비',
        labelEn: 'Rain & Heat Refuge',
        icon: '☔',
        reasonKo: '날씨에 구애받지 않고 냉난방이 완벽한 넓은 실내 공간에서 예술과 과학을 편안히 체험합니다.',
        reasonEn: 'Enjoy art and science in climate-controlled indoor spaces regardless of rain or heat.'
      },
      {
        type: 'STROLLER',
        labelKo: '어린이 & 가족 동반',
        labelEn: 'Family & Children',
        icon: '👶',
        reasonKo: '국립부산과학관과 어린이창의교육관 등 만지고 조작하는 인터랙티브 전시가 가득합니다.',
        reasonEn: 'Packed with touch-and-play interactive exhibits at National Science Museum.'
      }
    ],

    whyThisOrderKo: {
      titleKo: '어떻게 둘러보면 좋을까요?',
      descriptionKo: '센텀시티 권역(뮤지엄원 ➔ 영화의전당 ➔ F1963)이나 영도 권역(국립해양박물관 ➔ 아르떼뮤지엄)으로 묶어 하루에 2곳씩 여유롭게 방문하면 최상의 관람 효과를 얻습니다.',
      flowStepsKo: [
        '센텀 권역: 센텀시티역 ➔ 뮤지엄원 미디어아트 관람 ➔ 영화의전당 라이브러리 ➔ F1963 서점 & 카페',
        '영도 권역: 남포역 ➔ 국립해양박물관 (대형 수조 & 전망대) ➔ 아르떼뮤지엄 몰입형 전시'
      ]
    },
    whyThisOrderEn: {
      titleEn: 'How to Structure Your Visit?',
      descriptionEn: 'Group venues into Centum Cluster (Museum 1 ➔ Cinema Center ➔ F1963) or Yeongdo Cluster (Maritime Museum ➔ ARTE Museum) for seamless 2-stop days.',
      flowStepsEn: [
        'Centum Cluster: Centum Station ➔ Museum 1 Media Art ➔ Cinema Library ➔ F1963 Books & Cafe',
        'Yeongdo Cluster: Nampo Station ➔ National Maritime Museum ➔ ARTE Museum Digital Experience'
      ]
    },

    steplessPoints: [
      {
        icon: 'Building2',
        titleKo: '영화의전당 비프힐 수직 승강기',
        titleEn: 'Cinema Center BIFF Hill Elevator',
        descKo: '1층 로비에서 4층 시네마테크 라이브러리까지 대형 승강기로 계단 없이 이동합니다.',
        descEn: 'Large elevators provide direct step-free access from 1F lobby to 4F cinema library.'
      }
    ],

    highlights: [
      {
        titleKo: '뮤지엄원 8,000만 개 LED 미디어아트',
        titleEn: 'Museum 1 80-Million LED Media Showcase',
        descKo: '바닥부터 천장까지 빛으로 둘러싸인 화려한 디지털 예술 세계를 경험하세요.',
        descEn: 'Immerse in a giant digital spectacle surrounded by LED floors and high ceilings.'
      }
    ],

    connectedPlaces: [
      {
        nameKo: '신세계 센텀시티 CGV & 영화관',
        nameEn: 'Shinsegae Centum CGV & Theaters',
        connectionReasonKo: '영화의전당 바로 건너편에 위치하여 영화 관람과 쇼핑을 연속으로 즐길 수 있습니다.',
        connectionReasonEn: 'Located right across from Cinema Center for movies and dining.',
        transitTipKo: '센텀시티역 지하 통로 이용',
        transitTipEn: 'Use Centum City subway underground concourse.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 9. SUBWAY METRO COURSE (도시철도 코스)
  // ---------------------------------------------------------------------------
  'subway-course-master': {
    courseId: 'subway-course-master',
    category: 'SUBWAY',
    dayTitleKo: '도시철도 코스 · 부산 1·2호선 노선축 환승 없는 완벽 여행',
    dayTitleEn: 'Metro Course · Busan Lines 1 & 2 Direct Transit Routes',
    oneLineSummaryKo: '1호선(역사·문화·시장 축)과 2호선(해변·카페·야경 축)을 따라 역 출구 엘리베이터에서 100m 이내로 연결되는 초간편 명소 모음',
    oneLineSummaryEn: 'A zero-confusion subway course following Line 1 (history & markets) and Line 2 (beaches & cafes) within 100m of elevator exits.',
    recommendedDurationKo: '일정별 자유 활용',
    recommendedDurationEn: 'Flexible Daily Integration',
    mainRegionsKo: '1호선 축 (다대포~부산역~남포~서면~동래) · 2호선 축 (사상~서면~센텀~광안~해운대~장산)',
    mainRegionsEn: 'Line 1 Axis (Dadaepo-Busan Stn-Nampo-Seomyeon-Dongnae) · Line 2 Axis (Sasang-Seomyeon-Centum-Gwangan-Haeundae)',
    transitMethodKo: '부산 지하철 1·2호선 1일권 (6,000원 무제한 탑승 추천)',
    transitMethodEn: 'Busan Metro 1-Day Pass (6,000 KRW Unlimited Rides recommended)',
    difficultyLevel: 'EASY',
    difficultyLabelKo: '쉬움 (지하철 승강기 100% 직결)',
    difficultyLabelEn: 'Easy (100% Subway Elevator Linked)',
    difficultyScore: 1,
    difficultyDescKo: '지하철 역사 출구와 엘리베이터 번호를 사전에 확인하고 이동하여 지상 이동 거리를 획기적으로 단축했습니다.',
    difficultyDescEn: 'Drastically shortens ground walk distances by pre-identifying exact exit elevator numbers.',
    
    targetAudiences: [
      {
        type: 'MIN_WALK',
        labelKo: '대중교통 뚜벅이 여행자',
        labelEn: 'Transit Backpackers',
        icon: '🚇',
        reasonKo: '복잡한 길 찾기 없이 지하철역에서 내리자마자 바로 명소로 연결됩니다.',
        reasonEn: 'Step off the train straight into attractions without navigational hurdles.'
      },
      {
        type: 'WHEELCHAIR',
        labelKo: '휠체어 & 유모차 이용객',
        labelEn: 'Wheelchairs & Strollers',
        icon: '♿',
        reasonKo: '부산교통공사 검증 엘리베이터 출구만 엄선하여 안내합니다.',
        reasonEn: 'Features verified Busan Metro elevator exits only.'
      }
    ],

    whyThisOrderKo: {
      titleKo: '노선축별 특징 안내',
      descriptionKo: '1호선은 부산의 뿌리 깊은 역사와 활기찬 전통시장, 다대포의 자연을 잇는 남북축이며, 2호선은 서면의 도심 트렌드와 광안리·해운대 동해 바다를 잇는 동서축입니다. 서면역에서 단 한 번의 환승으로 두 축을 자유롭게 넘나들 수 있습니다.',
      flowStepsKo: [
        '1호선 라인 추천: 다대포해수욕장역(노을) ➔ 자갈치역(수산시장) ➔ 남포역(용두산타워) ➔ 부산역(차이나타운) ➔ 온천장역(온천&모모스)',
        '2호선 라인 추천: 사상역(삼락공원) ➔ 서면역(도심) ➔ 전포역(카페거리) ➔ 광안역(해변) ➔ 센텀시티역(백화점) ➔ 해운대역(바다)'
      ]
    },
    whyThisOrderEn: {
      titleEn: 'Line Characteristics Overview',
      descriptionEn: 'Line 1 connects historic roots, markets, and Dadaepo wetlands; Line 2 links urban shopping with the famous beaches. Seomyeon serves as the central hub connecting both.',
      flowStepsEn: [
        'Line 1 Highlights: Dadaepo (sunset) ➔ Jagalchi (market) ➔ Nampo (tower) ➔ Busan Stn ➔ Oncheonjang (Momos Coffee)',
        'Line 2 Highlights: Sasang (park) ➔ Seomyeon (downtown) ➔ Jeonpo (cafes) ➔ Gwangan (beach) ➔ Centum (mall) ➔ Haeundae'
      ]
    },

    steplessPoints: [
      {
        icon: 'Train',
        titleKo: '1호선 ↔ 2호선 서면역 중앙 환승 EV',
        titleEn: 'Seomyeon Center Platform Transfer EV',
        descKo: '서면역 1호선 승강장에서 2호선 승강장으로 이어지는 수직 승강기를 타면 계단 없이 2분 만에 환승 완료됩니다.',
        descEn: 'Central vertical elevators enable effortless 2-minute step-free transfers between Lines 1 & 2.'
      }
    ],

    highlights: [
      {
        titleKo: '부산 지하철 1일 무제한 패스 (6,000원)',
        titleEn: 'Busan Metro 1-Day Pass (6,000 KRW)',
        descKo: '하루 4회 이상 승하차 시 1일권을 구매하면 훨씬 저렴하고 편리하게 이용할 수 있습니다.',
        descEn: 'Save transit costs with the 6,000 KRW unlimited daily pass when making 4+ trips.'
      }
    ],

    connectedPlaces: [
      {
        nameKo: '동해선 광역전철 환승 (교대역 / 벡스코역 / 거제역)',
        nameEn: 'Donghae Line Metro Transfer (Kyodae / BEXCO)',
        connectionReasonKo: '1호선 교대역, 2호선 벡스코역, 3호선 거제역에서 동해선으로 환승하면 기장 오시리아와 송정으로 빠르게 이동합니다.',
        connectionReasonEn: 'Transfer to Donghae Line at Kyodae (Line 1) or BEXCO (Line 2) for rapid access to Osiria & Songjeong.',
        transitTipKo: '환승 통로에 휠체어 리프트 및 무단차 통로 완비',
        transitTipEn: 'Step-free transfer corridors available at all transfer hubs.'
      }
    ]
  }
};
