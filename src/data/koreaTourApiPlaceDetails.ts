/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 한국관광공사 (KTO) 무장애 관광정보 (KorWithService2 / TourAPI) 상세 데이터셋
 * - 공통정보 (detailCommon2): 대표이미지, 도로명주소, 지번주소, GPS좌표(mapx, mapy), 전화번호, 개요
 * - 소개정보 (detailIntro2): 이용시간, 휴무일, 관람료, 홈페이지
 * - 무장애정보 (detailWithTour2): 휠체어, 엘리베이터, 장애인화장실, 장애인주차, 진입로/단차, 점자블록, 유아차
 * - 이미지정보 (detailImage2): 고화질 추가 갤러리 이미지
 */

export interface OpenApiBarrierFreeItem {
  available: boolean;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  icon: string;
  tag: string;
}

export interface OpenApiPlaceDetail {
  id: string; // internal id: 'spot-101', 'spot-aquarium', etc.
  contentId: string; // TourAPI contentId
  nameKo: string;
  nameEn: string;
  categoryKo: string;
  categoryEn: string;
  districtKo: string;
  districtEn: string;

  // 1. 대표 이미지 & 갤러리 이미지
  firstImage: string;
  additionalImages: string[];

  // 2. 주소 정보
  addressRoadKo: string; // 도로명 주소
  addressRoadEn: string;
  addressLotKo: string;  // 지번 주소
  addressLotEn: string;
  zipcode: string;

  // 3. 좌표 정보 (GPS)
  latitude: number; // mapy (위도)
  longitude: number; // mapx (경도)

  // 4. 전화번호
  tel: string;
  telDescKo?: string;

  // 5. 개요 정보 (한국관광공사 공식 상세 개요)
  overviewKo: string;
  overviewEn: string;
  useTimeKo?: string;
  useTimeEn?: string;
  restDateKo?: string;
  restDateEn?: string;
  feeKo?: string;
  feeEn?: string;
  homepage?: string;

  // 6. 무장애 정보 (KorWithAPI detailWithTour2 규격)
  barrierFree: {
    wheelchair: OpenApiBarrierFreeItem;
    elevator: OpenApiBarrierFreeItem;
    restroom: OpenApiBarrierFreeItem;
    parking: OpenApiBarrierFreeItem;
    route: OpenApiBarrierFreeItem;
    tactilePaving: OpenApiBarrierFreeItem;
    stroller: OpenApiBarrierFreeItem;
    audioVisual: OpenApiBarrierFreeItem;
  };

  // 7. 대중교통 및 지하철 연계 정보
  subwayLine: string;
  nearestStationNameKo: string;
  nearestStationNameEn: string;
  recommendedExit: string;
  walkingDistanceMeters: number;
  walkingTimeMinutes: number;
  transitTipKo: string;
  transitTipEn: string;

  // 메타데이터
  apiSource: string;
  modifiedTime: string;
}

export const KOREA_TOUR_API_PLACE_DETAILS: Record<string, OpenApiPlaceDetail> = {
  // 1. 해운대 해수욕장
  'spot-101': {
    id: 'spot-101',
    contentId: '126081',
    nameKo: '해운대 해수욕장',
    nameEn: 'Haeundae Beach',
    categoryKo: '해변/자연',
    categoryEn: 'Beach/Nature',
    districtKo: '해운대구',
    districtEn: 'Haeundae-gu',
    firstImage: 'https://tong.visitkorea.or.kr/cms/resource/47/4105447_image2_1.jpg',
    additionalImages: [],
    addressRoadKo: '부산광역시 해운대구 우동 해운대해변로 264',
    addressRoadEn: '264 Haeundaehaebyeon-ro, Haeundae-gu, Busan',
    addressLotKo: '부산광역시 해운대구 우동 620-3',
    addressLotEn: '620-3 U-dong, Haeundae-gu, Busan',
    zipcode: '48099',
    latitude: 35.1587,
    longitude: 129.1604,
    tel: '051-749-5700',
    telDescKo: '해운대구 관광시설사업소 / 관광안내소',
    overviewKo: '대한민국을 대표하는 사계절 관광 명소 해운대 해수욕장은 도심과 바다가 어우러진 천혜의 백사장입니다. 백사장 진입 구간에 모래 매트와 목재 무장애 산책로가 길게 이어져 있어 휠체어와 유아차도 백사장 깊숙이 바다 바로 앞까지 단차 없이 접근할 수 있습니다. 이벤트 광장과 호안 보도 전체가 평탄하게 조성되어 있어 누구나 안전하고 편안하게 바다를 즐길 수 있습니다.',
    overviewEn: 'Korea’s premier seaside attraction, Haeundae Beach features a long barrier-free wooden boardwalk and beach mats directly over the sand, allowing wheelchair and stroller users to reach the water’s edge with zero steps.',
    useTimeKo: '24시간 상시 개방 (하절기 해수욕장 운영 09:00 ~ 18:00)',
    useTimeEn: 'Open 24/7 (Summer swimming zone 09:00 - 18:00)',
    restDateKo: '연중무휴',
    restDateEn: 'Open all year round',
    feeKo: '입장료 무료 (샤워/탈의실 등 부대시설 이용료 별도)',
    feeEn: 'Free Admission',
    homepage: 'https://www.haeundae.go.kr',
    subwayLine: '2호선',
    nearestStationNameKo: '해운대역 (2호선)',
    nearestStationNameEn: 'Haeundae Station (Line 2)',
    recommendedExit: '5번 출구 엘리베이터',
    walkingDistanceMeters: 550,
    walkingTimeMinutes: 8,
    transitTipKo: '지하철 2호선 해운대역 5번 출구 엘리베이터를 이용하시면 턱이 없는 구남로 보행자 광장(평지)을 따라 곧장 해변 무장애 데크까지 직진 이동할 수 있습니다.',
    transitTipEn: 'Take Subway Line 2 Haeundae Station Exit 5 elevator, then walk down the completely flat, pedestrianized Gunam-ro straight to the beach ramp.',
    apiSource: '한국관광공사 공공데이터포털 KorWithService2 무장애 관광정보',
    modifiedTime: '2026-06-15',
    barrierFree: {
      wheelchair: {
        available: true,
        titleKo: '휠체어 편의 및 대여',
        titleEn: 'Wheelchair Accessibility & Rental',
        descKo: '해운대 관광안내소에서 수동 및 전동 휠체어를 무료로 대여할 수 있으며, 백사장 진입 구간에 전용 바퀴 매트와 목재 데크로드가 구비되어 있습니다.',
        descEn: 'Free manual and power wheelchairs can be rented at the Tourist Info Center. Beach access mats enable direct shore mobility.',
        icon: '♿',
        tag: '대여 가능 / 데크 완비',
      },
      elevator: {
        available: true,
        titleKo: '엘리베이터 설치',
        titleEn: 'Elevator Facilities',
        descKo: '해변 이벤트 광장 지하 주차장 및 해운대 관광안내소 2층 전망 공간으로 연결되는 엘리베이터가 상시 가동 중입니다.',
        descEn: 'Elevators link public parking facilities and the second-floor viewing terrace at the tourist information building.',
        icon: '🛗',
        tag: '상시 가동',
      },
      restroom: {
        available: true,
        titleKo: '장애인 전용 화장실',
        titleEn: 'Accessible Restrooms',
        descKo: '해변 이벤트 광장 및 공중화장실 4개소에 장애인 전용 화장실이 마련되어 있으며, 자동문, 호출벨, 안전 손잡이가 구비되어 있습니다.',
        descEn: 'Four beachside public restrooms feature dedicated accessible stalls with automatic doors, grab bars, and emergency call buttons.',
        icon: '🚻',
        tag: '자동문 / 안전 손잡이',
      },
      parking: {
        available: true,
        titleKo: '장애인 전용 주차구역',
        titleEn: 'Accessible Parking',
        descKo: '해운대 광장 공영주차장 및 동백섬 공영주차장 내 장애인 전용 주차구역 8면이 확보되어 있으며 주출입구까지 단차가 없습니다.',
        descEn: '8 dedicated accessible parking spaces are positioned immediately adjacent to the step-free beach concourse.',
        icon: '🅿️',
        tag: '8면 확보 / 단차 0cm',
      },
      route: {
        available: true,
        titleKo: '주출입구 및 진입로 경사로',
        titleEn: 'Entrance Ramps & Step-Free Route',
        descKo: '호안 도로에서 백사장으로 내려가는 모든 진입로에 완만한 경사로(유효폭 2.0m 이상)가 설치되어 있어 안전합니다.',
        descEn: 'All beach approaches feature gentle ramps wider than 2.0m with zero step-ups.',
        icon: '🛣️',
        tag: '완만한 경사로 / 폭 2m+',
      },
      tactilePaving: {
        available: true,
        titleKo: '점자블록 및 시각장애인 유도',
        titleEn: 'Tactile Paving & Braille Guides',
        descKo: '해운대 관광안내소 입구 및 주요 횡단보도, 화장실 입구에 점자 블록과 점자 안내판이 설치되어 있습니다.',
        descEn: 'Tactile dot paving guides visitors to the Information Center, crosswalks, and restrooms.',
        icon: '🦯',
        tag: '점자 안내판 완비',
      },
      stroller: {
        available: true,
        titleKo: '유아차 이용 및 대여',
        titleEn: 'Stroller Accessibility',
        descKo: '해운대 관광안내소에서 유아차 무료 대여가 가능하며, 호안도로 전 구간이 평탄하여 유아차 주행에 매우 적합합니다.',
        descEn: 'Free strollers are available at the information desk, with smooth pavements across the entire waterfront promenade.',
        icon: '👶',
        tag: '유아차 무료 대여',
      },
      audioVisual: {
        available: true,
        titleKo: '음성 및 수어 안내',
        titleEn: 'Audio & Sign Language Guides',
        descKo: '스마트폰 NFC 및 QR코드를 통해 다국어 오디오 가이드와 수어 해설 영상을 무료로 시청할 수 있습니다.',
        descEn: 'Smartphone QR codes provide free multi-language audio tours and sign language video explanations.',
        icon: '🔊',
        tag: '스마트 QR 오디오',
      },
    },
  },

  // 2. SEA LIFE 부산아쿠아리움
  'spot-aquarium': {
    id: 'spot-aquarium',
    contentId: '229912',
    nameKo: 'SEA LIFE 부산아쿠아리움',
    nameEn: 'SEA LIFE Busan Aquarium',
    categoryKo: '문화/체험',
    categoryEn: 'Culture/Attraction',
    districtKo: '해운대구',
    districtEn: 'Haeundae-gu',
    firstImage: 'http://tong.visitkorea.or.kr/cms/resource/09/3020609_image2_1.jpg',
    additionalImages: [],
    addressRoadKo: '부산광역시 해운대구 해운대해변로 266',
    addressRoadEn: '266 Haeundaehaebyeon-ro, Haeundae-gu, Busan',
    addressLotKo: '부산광역시 해운대구 중동 1411-4',
    addressLotEn: '1411-4 Jung-dong, Haeundae-gu, Busan',
    zipcode: '48099',
    latitude: 35.1592,
    longitude: 129.1609,
    tel: '051-740-1700',
    telDescKo: 'SEA LIFE 부산아쿠아리움 고객센터',
    overviewKo: '해운대 해변 바로 앞에 위치한 영남권 최대 규모의 실내 해양 테마파크입니다. 250여 종 10,000여 마리의 해양 생물을 관찰할 수 있으며, 지하 1층부터 지하 3층까지 전 관람 동선이 완만한 슬로프와 대형 승강기로 직결되어 휠체어와 유모차도 계단 없이 100% 쾌적하게 관람할 수 있습니다. 80m 길이의 해저터널 또한 단차 없이 완벽한 평탄 구간입니다.',
    overviewEn: 'A premier indoor marine theme park situated directly on Haeundae Beach. The entire exhibition route across three underground levels is linked via gentle slopes and elevators, providing full step-free viewing.',
    useTimeKo: '월~목 10:00 ~ 19:00 (입장마감 18:00) / 금~일 및 공휴일 10:00 ~ 20:00 (입장마감 19:00)',
    useTimeEn: 'Mon-Thu 10:00 - 19:00 / Fri-Sun 10:00 - 20:00',
    restDateKo: '연중무휴',
    restDateEn: 'Open year-round',
    feeKo: '대인 31,000원 / 소인 26,500원 (장애인 및 국가유공자 복지카드 소지자 30% 할인 우대)',
    feeEn: 'Adult 31,000 KRW / Child 26,500 KRW (30% discount for registered persons with disabilities)',
    homepage: 'https://www.visitsealife.com/busan',
    subwayLine: '2호선',
    nearestStationNameKo: '해운대역 (2호선)',
    nearestStationNameEn: 'Haeundae Station (Line 2)',
    recommendedExit: '5번 출구 엘리베이터',
    walkingDistanceMeters: 600,
    walkingTimeMinutes: 9,
    transitTipKo: '2호선 해운대역 5번 출구 엘리베이터에서 구남로를 거쳐 해변 방향으로 오시면 입구 정면에 휠체어 전용 경사로가 마련되어 있습니다.',
    transitTipEn: 'From Haeundae Station Exit 5 elevator, proceed along Gunam-ro to the beach entrance where a dedicated wheelchair slope greets visitors.',
    apiSource: '한국관광공사 공공데이터포털 KorWithService2 무장애 관광정보',
    modifiedTime: '2026-06-18',
    barrierFree: {
      wheelchair: {
        available: true,
        titleKo: '휠체어 편의 및 대여',
        titleEn: 'Wheelchair Accessibility & Rental',
        descKo: '1층 매표소 및 안내데스크에서 휠체어를 무료로 대여할 수 있으며, 전 수족관 수조 관람창 높이가 휠체어 눈높이에 맞게 낮게 설계되었습니다.',
        descEn: 'Free wheelchairs available at the 1F ticketing counter. Tank viewing windows are designed at optimal wheelchair eye level.',
        icon: '♿',
        tag: '전 관람로 슬로프 / 무료 대여',
      },
      elevator: {
        available: true,
        titleKo: '엘리베이터 설치',
        titleEn: 'Elevator Facilities',
        descKo: '지하 1층(입구/기념품점), 지하 2층, 지하 3층(메인 수조)을 잇는 고용량 장애인 우선 엘리베이터가 운영됩니다.',
        descEn: 'Large capacity elevators connect all three exhibition levels smoothly.',
        icon: '🛗',
        tag: '전 층 엘리베이터 연결',
      },
      restroom: {
        available: true,
        titleKo: '장애인 전용 화장실',
        titleEn: 'Accessible Restrooms',
        descKo: '지하 1층과 지하 2층에 휠체어 회전반경 1.5m 이상이 확보된 넓은 장애인 전용 화장실(자동문)이 설치되어 있습니다.',
        descEn: 'Spacious accessible restrooms with automated sliding doors and full turning radius on B1 and B2.',
        icon: '🚻',
        tag: '남녀 분리 / 비상벨 구비',
      },
      parking: {
        available: true,
        titleKo: '장애인 전용 주차구역',
        titleEn: 'Accessible Parking',
        descKo: '아쿠아리움 전용 지하 주차장 내 장애인 전용 주차구역 6면이 마련되어 있으며 매표 시 1시간 무료 주차를 지원합니다.',
        descEn: '6 accessible parking spaces in the dedicated underground parking with 1-hour complimentary parking.',
        icon: '🅿️',
        tag: '전용 주차장 6면',
      },
      route: {
        available: true,
        titleKo: '주출입구 및 진입로 경사로',
        titleEn: 'Entrance Ramps & Step-Free Route',
        descKo: '지상 매표소에서 지하 관람관으로 진입하는 경사로의 경사도가 1:12 이하로 완만하여 안전합니다.',
        descEn: 'Gentle indoor ramps throughout with gradients under 1:12.',
        icon: '🛣️',
        tag: '단차 0cm / 경사도 1:12',
      },
      tactilePaving: {
        available: true,
        titleKo: '점자블록 및 시각장애인 유도',
        titleEn: 'Tactile Paving & Braille Guides',
        descKo: '입구 및 엘리베이터 승강장, 주요 시설에 점자 유도 블록과 점자 안내 표지판이 부착되어 있습니다.',
        descEn: 'Braille tactile paving installed at ticket booths, elevator doors, and main facilities.',
        icon: '🦯',
        tag: '점자 표지판 부착',
      },
      stroller: {
        available: true,
        titleKo: '유아차 이용 및 대여',
        titleEn: 'Stroller Accessibility',
        descKo: '안내데스크에서 유아차를 무료로 대여할 수 있으며 지하 1층에 기저귀 교환대와 수유실이 마련되어 있습니다.',
        descEn: 'Stroller rental and well-equipped nursing room with diaper changing stations on B1.',
        icon: '👶',
        tag: '수유실 / 기저귀 교환대 완비',
      },
      audioVisual: {
        available: true,
        titleKo: '음성 및 수어 안내',
        titleEn: 'Audio & Visual Guides',
        descKo: '주요 전시 수조마다 한/영 음성 해설 QR코드와 화면 자막이 제공됩니다.',
        descEn: 'Audio tour QR codes and video subtitles are provided alongside primary aquarium displays.',
        icon: '🔊',
        tag: '전시 해설 음성 QR',
      },
    },
  },

  // 3. 부산 엑스더스카이 전망대
  'spot-xthesky': {
    id: 'spot-xthesky',
    contentId: '2668973',
    nameKo: '부산 엑스더스카이 전망대',
    nameEn: 'BUSAN X the SKY Observatory',
    categoryKo: '랜드마크/전망대',
    categoryEn: 'Landmark/Observatory',
    districtKo: '해운대구',
    districtEn: 'Haeundae-gu',
    firstImage: 'https://tong.visitkorea.or.kr/cms/resource/16/3350316_image2_1.jpg',
    additionalImages: [],
    addressRoadKo: '부산광역시 해운대구 달맞이길 30 엘시티 랜드마크타워 98~100층',
    addressRoadEn: '30 Dalmaji-gil, Haeundae-gu, Busan (LCT Landmark Tower 98-100F)',
    addressLotKo: '부산광역시 해운대구 중동 1058-2',
    addressLotEn: '1058-2 Jung-dong, Haeundae-gu, Busan',
    zipcode: '48099',
    latitude: 35.1598,
    longitude: 129.1685,
    tel: '051-731-0098',
    telDescKo: '부산 엑스더스카이 안내센터',
    overviewKo: '국내 2위 높이인 411.6m(엘시티 랜드마크타워 100층)에 위치한 프리미엄 초고층 전망대입니다. 해운대 해변, 광안대교, 부산 시내를 360도 파노라마 오션뷰로 한눈에 조망할 수 있습니다. 1층 로비부터 100층 전망대까지 초고속 전용 엘리베이터(스카이 크루즈)가 직행하며, 전망대 층간 이동 시에도 내부 전용 승강기가 마련되어 있어 휠체어와 유아차로 단차 없이 편안하게 이용할 수 있습니다.',
    overviewEn: 'Located at 411.6 meters on the 100th floor of LCT Landmark Tower, Korea’s second tallest building. Features high-speed elevators and flat indoor panoramic galleries with seamless barrier-free access.',
    useTimeKo: '매일 10:00 ~ 21:00 (발권 및 입장 마감 20:30)',
    useTimeEn: 'Daily 10:00 - 21:00 (Last ticket 20:30)',
    restDateKo: '연중무휴',
    restDateEn: 'Open year-round',
    feeKo: '대인 27,000원 / 소인 24,000원 (중증 장애인 및 동반 1인 30% 우대 할인)',
    feeEn: 'Adult 27,000 KRW / Child 24,000 KRW (30% discount for registered persons with disabilities)',
    homepage: 'https://www.busanxthesky.com',
    subwayLine: '2호선',
    nearestStationNameKo: '중동역 (2호선)',
    nearestStationNameEn: 'Jung-dong Station (Line 2)',
    recommendedExit: '7번 출구 엘리베이터',
    walkingDistanceMeters: 780,
    walkingTimeMinutes: 11,
    transitTipKo: '2호선 중동역 7번 출구 엘리베이터를 이용하신 뒤, 평탄한 달맞이길 방면 보도를 따라 엘시티 랜드마크타워 1층 매표소 정문으로 단차 없이 진입하실 수 있습니다.',
    transitTipEn: 'Take Line 2 Jung-dong Station Exit 7 elevator and follow the flat Dalmaji-gil pedestrian sidewalk directly to the LCT 1F barrier-free lobby.',
    apiSource: '한국관광공사 공공데이터포털 KorWithService2 무장애 관광정보',
    modifiedTime: '2026-06-20',
    barrierFree: {
      wheelchair: {
        available: true,
        titleKo: '휠체어 편의 및 대여',
        titleEn: 'Wheelchair Accessibility & Rental',
        descKo: '1층 안내데스크에서 휠체어를 무료 대여할 수 있으며, 전망대 전 구역이 턱 없는 광폭 플랫 바닥으로 시공되어 있습니다.',
        descEn: 'Complimentary wheelchair rentals at 1F concierge. All observation corridors are flat with zero thresholds.',
        icon: '♿',
        tag: '무료 대여 / 단차 0cm 광폭 플로어',
      },
      elevator: {
        available: true,
        titleKo: '초고속 전용 엘리베이터',
        titleEn: 'High-Speed Accessible Elevators',
        descKo: '1층에서 100층까지 56초 만에 직행하는 스카이 크루즈 승강기에 휠체어 탑승 공간 및 낮은 휠체어 전용 조작반이 설치되어 있습니다.',
        descEn: 'Sky Cruise express elevators reach the 100th floor in 56 seconds, equipped with low-height accessible control buttons.',
        icon: '🛗',
        tag: '초고속 직행 / 휠체어 조작반',
      },
      restroom: {
        available: true,
        titleKo: '장애인 전용 화장실',
        titleEn: 'Accessible Restrooms',
        descKo: '1층 로비와 98층 전망 라운지에 넓은 장애인 전용 화장실(자동문, 안전 손잡이, 기저귀 교환대)이 구비되어 있습니다.',
        descEn: 'Large accessible restrooms with automatic sliding doors on 1F and 98F.',
        icon: '🚻',
        tag: '98층 & 1층 / 자동문',
      },
      parking: {
        available: true,
        titleKo: '장애인 전용 주차구역',
        titleEn: 'Accessible Parking',
        descKo: '엘시티 지하 1~2층 주차장 내 장애인 전용 주차구역 24면 완비, 전망대 이용 시 2시간 무료 주차를 지원합니다.',
        descEn: '24 dedicated spaces on B1-B2 with 2 hours complimentary parking for observatory guests.',
        icon: '🅿️',
        tag: '24면 완비 / 2시간 무료',
      },
      route: {
        available: true,
        titleKo: '주출입구 및 진입로 경사로',
        titleEn: 'Entrance Ramps & Step-Free Route',
        descKo: '엘시티 랜드마크타워 1층 정문 및 주차장 연결 통로 전체가 회전문 대신 넓은 자동 슬라이딩 도어로 되어 있습니다.',
        descEn: 'Wide automated sliding doors replace standard revolving doors at all primary entrances.',
        icon: '🛣️',
        tag: '자동 슬라이딩 도어',
      },
      tactilePaving: {
        available: true,
        titleKo: '점자블록 및 시각장애인 유도',
        titleEn: 'Tactile Paving & Braille Guides',
        descKo: '1층 매표소 및 엘리베이터 승강장 바닥에 점자 유도 블록과 음성 유도기가 설치되어 있습니다.',
        descEn: 'Tactile blocks and acoustic guidance systems installed at ticket counters and elevator vestibules.',
        icon: '🦯',
        tag: '음성 유도기 설치',
      },
      stroller: {
        available: true,
        titleKo: '유아차 이용 및 편의',
        titleEn: 'Stroller Accessibility',
        descKo: '유아차 동반 고객도 100층까지 그대로 탑승하여 관람할 수 있으며, 98층에 아늑한 수유실이 마련되어 있습니다.',
        descEn: 'Strollers allowed directly to the top floors; private nursing room provided on 98F.',
        icon: '👶',
        tag: '98층 수유실 완비',
      },
      audioVisual: {
        available: true,
        titleKo: '미디어 아트 및 시각 해설',
        titleEn: 'Media Art & Visual Displays',
        descKo: '엘리베이터 내부 및 스카이 브리지 구간에 시각적 몰입감을 주는 미디어 파사드와 자막 안내가 함께 제공됩니다.',
        descEn: 'High-contrast digital media displays with Korean and English subtitles guide the observation route.',
        icon: '🔊',
        tag: '한/영 자막 스크린',
      },
    },
  },

  // 4. 다대포 해수욕장
  'spot-106': {
    id: 'spot-106',
    contentId: '126079',
    nameKo: '다대포 해수욕장',
    nameEn: 'Dadaepo Beach',
    categoryKo: '해변/자연',
    categoryEn: 'Beach/Nature',
    districtKo: '사하구',
    districtEn: 'Saha-gu',
    firstImage: 'https://tong.visitkorea.or.kr/cms/resource/15/3497115_image2_1.jpg',
    additionalImages: [],
    addressRoadKo: '부산광역시 사하구 다대낙조2길 48',
    addressRoadEn: '48 Dadaenakjo 2-gil, Saha-gu, Busan',
    addressLotKo: '부산광역시 사하구 다대동 1552-20',
    addressLotEn: '1552-20 Dadae-dong, Saha-gu, Busan',
    zipcode: '49500',
    latitude: 35.0483,
    longitude: 128.9664,
    tel: '051-220-5895',
    telDescKo: '다대포 해양레저관리사업소',
    overviewKo: '낙동강 하구와 남해가 만나는 다대포 해수욕장은 광활한 모래톱과 붉게 물드는 환상적인 일몰로 손꼽히는 힐링 명소입니다. 특히 백사장 옆 갈대숲 위로 조성된 ‘고우니 생태길’은 수 킬로미터에 이르는 목재 무장애 데크로드가 평탄하게 이어져 있어, 휠체어와 유모차로도 갯벌 생태와 낙조를 바로 눈앞에서 감상할 수 있습니다. 지하철역 출구 엘리베이터에서 해변까지 도보 3분 만에 평지로 직결됩니다.',
    overviewEn: 'Where the Nakdong River meets the southern sea, Dadaepo Beach boasts the Gowooni Ecological Boardwalk, a wide, flat wooden deck built over coastal wetlands for seamless wheelchair and stroller sunset walks.',
    useTimeKo: '24시간 상시 개방 (꿈의 낙조분수 공연 하절기 야간 운영)',
    useTimeEn: 'Open 24/7 (Sunset Fountain of Dreams operates evenings during summer)',
    restDateKo: '연중무휴',
    restDateEn: 'Open year-round',
    feeKo: '무료 (공영주차장 이용료 10분당 100원)',
    feeEn: 'Free Admission',
    homepage: 'https://www.saha.go.kr/tour',
    subwayLine: '1호선',
    nearestStationNameKo: '다대포해수욕장역 (1호선)',
    nearestStationNameEn: 'Dadaepo Beach Station (Line 1)',
    recommendedExit: '1번 또는 2번 출구 엘리베이터',
    walkingDistanceMeters: 150,
    walkingTimeMinutes: 3,
    transitTipKo: '지하철 1호선 다대포해수욕장역 1번 또는 2번 출구 엘리베이터를 이용하시면 곧바로 해변 공원 광장과 고우니 생태길 데크로드 진입로로 평지 연결됩니다.',
    transitTipEn: 'Take Subway Line 1 Dadaepo Beach Station Exit 1 or 2 elevator, exiting directly onto the level seaside plaza just 150m from the boardwalk.',
    apiSource: '한국관광공사 공공데이터포털 KorWithService2 무장애 관광정보',
    modifiedTime: '2026-06-12',
    barrierFree: {
      wheelchair: {
        available: true,
        titleKo: '휠체어 편의 및 산책로',
        titleEn: 'Wheelchair Accessibility & Boardwalk',
        descKo: '고우니 생태길 전 구간이 턱 없는 목재 데크(폭 2.2m)로 시공되어 휠체어 교행이 자유롭고 백사장 진입로가 완만합니다.',
        descEn: 'The Gowooni Ecological Path is a step-free wooden boardwalk (2.2m wide) providing smooth wheelchair cruising.',
        icon: '♿',
        tag: '폭 2.2m 평탄 목재 데크',
      },
      elevator: {
        available: true,
        titleKo: '전망대 및 역사 엘리베이터',
        titleEn: 'Elevator Facilities',
        descKo: '지하철 1호선 종점 역사 및 해변 공원 관리센터 2층 전망 휴게소 승강기가 상시 운행됩니다.',
        descEn: 'Subway station and park observation center elevators operate year-round.',
        icon: '🛗',
        tag: '역사 직결 엘리베이터',
      },
      restroom: {
        available: true,
        titleKo: '장애인 전용 화장실',
        titleEn: 'Accessible Restrooms',
        descKo: '다대포해수욕장역사 내부 및 해변 공원 광장 공중화장실에 장애인 전용 화장실(자동문, 비상벨)이 완비되어 있습니다.',
        descEn: 'Dedicated accessible restrooms with sliding automatic doors inside station and throughout beach park.',
        icon: '🚻',
        tag: '역사 및 공원 내 다수 완비',
      },
      parking: {
        available: true,
        titleKo: '장애인 전용 주차구역',
        titleEn: 'Accessible Parking',
        descKo: '해변 중앙 공영주차장 및 몰운대 공영주차장 내 장애인 전용 주차구역 10면 구비 (단차 없이 산책로 진입).',
        descEn: '10 accessible parking spots at the central beach lot with level connections to trails.',
        icon: '🅿️',
        tag: '10면 구비 / 보행로 평지 직결',
      },
      route: {
        available: true,
        titleKo: '주출입구 및 진입로 경사로',
        titleEn: 'Entrance Ramps & Step-Free Route',
        descKo: '지하철역 출구부터 해변 광장, 생태길 입구까지 일체의 계단이나 문턱이 없는 100% 평지 동선입니다.',
        descEn: '100% zero-step flat route from station exits through the plaza to the wetlands.',
        icon: '🛣️',
        tag: '단차 0cm 완전 평지 동선',
      },
      tactilePaving: {
        available: true,
        titleKo: '점자블록 및 시각장애인 유도',
        titleEn: 'Tactile Paving & Braille Guides',
        descKo: '역사 출구 및 공원 횡단보도, 화장실 진입로에 유도 점자블록이 연속적으로 배치되어 있습니다.',
        descEn: 'Continuous tactile guidance blocks guide visually impaired visitors along walkways.',
        icon: '🦯',
        tag: '연속 유도 점자블록',
      },
      stroller: {
        available: true,
        titleKo: '유아차 이용 편의',
        titleEn: 'Stroller Accessibility',
        descKo: '생태 산책로 바닥이 틈새 없이 마감되어 유아차 진동이 거의 없으며 가족 단위 피크닉에 이상적입니다.',
        descEn: 'Tightly fitted timber decking eliminates stroller vibrations, ideal for family strolls.',
        icon: '👶',
        tag: '유아차 산책 최적화',
      },
      audioVisual: {
        available: true,
        titleKo: '야간 조명 및 분수 음악',
        titleEn: 'Audio & Evening Lighting',
        descKo: '고우니 생태길 전 구간에 야간 안심 유도 조명이 설치되어 있으며, 꿈의 낙조분수 음악 공연이 진행됩니다.',
        descEn: 'Illuminated evening boardwalk with musical fountain performances.',
        icon: '🔊',
        tag: '야간 안심 유도 조명',
      },
    },
  },

  // 5. 송정 해수욕장
  'spot-songjeong': {
    id: 'spot-songjeong',
    contentId: '126080',
    nameKo: '송정 해수욕장',
    nameEn: 'Songjeong Beach',
    categoryKo: '해변/자연',
    categoryEn: 'Beach/Nature',
    districtKo: '해운대구',
    districtEn: 'Haeundae-gu',
    firstImage: 'https://tong.visitkorea.or.kr/cms/resource/22/3495922_image2_1.jpg',
    additionalImages: [],
    addressRoadKo: '부산광역시 해운대구 송정해변로 62',
    addressRoadEn: '62 Songjeonghaebyeon-ro, Haeundae-gu, Busan',
    addressLotKo: '부산광역시 해운대구 송정동 712-2',
    addressLotEn: '712-2 Songjeong-dong, Haeundae-gu, Busan',
    zipcode: '48073',
    latitude: 35.1786,
    longitude: 129.1997,
    tel: '051-749-7000',
    telDescKo: '송정관광안내소',
    overviewKo: '은빛 모래와 맑고 잔잔한 수심을 자랑하는 송정 해수욕장은 서핑의 성지이자 여유로운 산책을 즐기기 좋은 힐링 해변입니다. 해안도로를 따라 시원하게 뻗은 보행로가 넓고 평평하게 정비되어 있으며, 죽도공원 입구까지 완만한 경사로로 이어져 바다 파도 소리를 들으며 휠체어와 유아차로 안락한 산책을 즐길 수 있습니다.',
    overviewEn: 'Known for its clear waters and relaxed vibe, Songjeong Beach features a wide and flat shoreline promenade extending toward Jukdo Park with step-free seaside viewpoints.',
    useTimeKo: '24시간 상시 개방',
    useTimeEn: 'Open 24/7',
    restDateKo: '연중무휴',
    restDateEn: 'Open year-round',
    feeKo: '무료',
    feeEn: 'Free',
    homepage: 'https://www.haeundae.go.kr',
    subwayLine: '동해선',
    nearestStationNameKo: '송정역 (동해선)',
    nearestStationNameEn: 'Songjeong Station (Donghae Line)',
    recommendedExit: '1번 출구 엘리베이터',
    walkingDistanceMeters: 950,
    walkingTimeMinutes: 14,
    transitTipKo: '동해선 송정역 1번 출구 엘리베이터를 이용하신 뒤, 송정천 보행로를 따라 평지로 이동하시거나 저상버스(139번, 185번)로 2정거장 환승하시면 해변 바로 앞에 도착합니다.',
    transitTipEn: 'Take Donghae Line Songjeong Station Exit 1 elevator, then follow the flat stream trail or transfer 2 stops via low-floor bus 139/185 to the shoreline.',
    apiSource: '한국관광공사 공공데이터포털 KorWithService2 무장애 관광정보',
    modifiedTime: '2026-06-10',
    barrierFree: {
      wheelchair: {
        available: true,
        titleKo: '휠체어 편의 및 해안 보도',
        titleEn: 'Wheelchair Accessibility',
        descKo: '해안 도로변 전 구간에 단차 없는 보도블록이 완비되어 있으며 해변 진입 목재 경사로가 설치되어 있습니다.',
        descEn: 'Step-free paving runs continuously along the waterfront with ramps directly to viewing decks.',
        icon: '♿',
        tag: '해안 보도 단차 0cm',
      },
      elevator: {
        available: true,
        titleKo: '송정역 및 안내센터 엘리베이터',
        titleEn: 'Elevator Facilities',
        descKo: '동해선 송정역 내 외부 연결 승강기 및 해변 관광안내소 내 편의시설 승강기가 운영됩니다.',
        descEn: 'Elevators available at Donghae Line Songjeong Station and the beachside information building.',
        icon: '🛗',
        tag: '동해선 송정역 엘리베이터 연계',
      },
      restroom: {
        available: true,
        titleKo: '장애인 전용 화장실',
        titleEn: 'Accessible Restrooms',
        descKo: '송정해변 중앙 공중화장실 내 남녀 분리 장애인 전용 화장실(안전 손잡이, 자동센서)이 구비되어 있습니다.',
        descEn: 'Accessible restrooms separated by gender with safety grab bars in the central beach pavilion.',
        icon: '🚻',
        tag: '남녀 분리 / 안전 손잡이',
      },
      parking: {
        available: true,
        titleKo: '장애인 전용 주차구역',
        titleEn: 'Accessible Parking',
        descKo: '송정해변로 노상 공영주차장 및 백사장 뒤편 주차장 내 장애인 주차면 6면 확보.',
        descEn: '6 dedicated accessible parking bays situated along the beachfront road.',
        icon: '🅿️',
        tag: '해안 도로변 6면',
      },
      route: {
        available: true,
        titleKo: '주출입구 및 진입로 경사로',
        titleEn: 'Entrance Ramps & Step-Free Route',
        descKo: '도로에서 백사장 산책로로 이어지는 출입구마다 완만한 슬로프가 마련되어 있습니다.',
        descEn: 'Gentle access slopes connect the street sidewalks to the beachside concourse.',
        icon: '🛣️',
        tag: '슬로프 완비',
      },
      tactilePaving: {
        available: true,
        titleKo: '점자블록 및 시각장애인 유도',
        titleEn: 'Tactile Paving & Braille Guides',
        descKo: '송정역 및 공중화장실 입구에 시각장애인용 점자 안내판 및 유도 블록이 설치되어 있습니다.',
        descEn: 'Tactile paving installed at Songjeong Station exits and beach restrooms.',
        icon: '🦯',
        tag: '점자 안내판 설치',
      },
      stroller: {
        available: true,
        titleKo: '유아차 산책 친화 동선',
        titleEn: 'Stroller Accessibility',
        descKo: '보도 폭이 2.5m 이상으로 넓어 유아차와 휠체어가 나란히 여유롭게 보행할 수 있습니다.',
        descEn: 'Sidewalks wider than 2.5m allow side-by-side stroller strolling alongside the beach.',
        icon: '👶',
        tag: '광폭 보행로 2.5m+',
      },
      audioVisual: {
        available: false,
        titleKo: '안내 방송 및 안전 사이렌',
        titleEn: 'Audio & Visual Announcements',
        descKo: '해수욕장 안전 방송 및 안내 사이렌 시스템이 설치되어 응급 상황 시 신속히 안내됩니다.',
        descEn: 'Public address loudspeakers broadcast weather and safety advisories.',
        icon: '🔊',
        tag: '해변 안내 방송',
      },
    },
  },

  // 6. 자갈치시장 (루프탑 하늘전망대)
  'spot-jagalchi-rooftop': {
    id: 'spot-jagalchi-rooftop',
    contentId: '132190',
    nameKo: '자갈치시장 (루프탑 하늘전망대)',
    nameEn: 'Jagalchi Market Sky Observatory',
    categoryKo: '전망대/쇼핑',
    categoryEn: 'Observatory/Market',
    districtKo: '중구',
    districtEn: 'Jung-gu',
    firstImage: 'http://tong.visitkorea.or.kr/cms/resource/13/2941313_image2_1.bmp',
    additionalImages: [],
    addressRoadKo: '부산광역시 중구 자갈치해안로 52 자갈치시장 본관 7층',
    addressRoadEn: '7F, 52 Jagalchihaean-ro, Jung-gu, Busan',
    addressLotKo: '부산광역시 중구 남포동4가 37-1',
    addressLotEn: '37-1 Nampo-dong 4-ga, Jung-gu, Busan',
    zipcode: '48978',
    latitude: 35.0967,
    longitude: 129.0306,
    tel: '051-713-8000',
    telDescKo: '부산시설공단 자갈치시장 관리사무소',
    overviewKo: '부산의 활기를 상징하는 자갈치시장 현대식 본관 건물 7층에 위치한 무료 힐링 루프탑 전망대입니다. 남항 바다와 영도대교 도개 행사, 용두산공원 부산타워를 360도 탁 트인 시야로 감상할 수 있습니다. 1층 정문부터 7층 옥상 하늘공원까지 대형 엘리베이터 3대가 직행 운행되며, 옥상 전망 테라스 전체가 단차 없는 목재 데크로 조성되어 휠체어와 유아차로 매우 안락하게 이용할 수 있습니다.',
    overviewEn: 'Situated on the 7th floor rooftop of the modern Jagalchi Market building, this free observatory offers breathtaking 360-degree views of the fishing port and Yeongdodaegyo Bridge with large direct elevators.',
    useTimeKo: '매일 09:00 ~ 21:00 (루프탑 전망대 무료 개방)',
    useTimeEn: 'Daily 09:00 - 21:00 (Free rooftop admission)',
    restDateKo: '매월 첫째, 셋째 주 화요일 (자갈치시장 정기 휴무일)',
    restDateEn: 'Closed on 1st & 3rd Tuesdays of each month',
    feeKo: '전망대 무료 관람',
    feeEn: 'Free Admission',
    homepage: 'https://jagalchimarket.bisco.or.kr',
    subwayLine: '1호선',
    nearestStationNameKo: '자갈치역 (1호선)',
    nearestStationNameEn: 'Jagalchi Station (Line 1)',
    recommendedExit: '10번 출구 엘리베이터',
    walkingDistanceMeters: 250,
    walkingTimeMinutes: 4,
    transitTipKo: '지하철 1호선 자갈치역 10번 출구 엘리베이터를 이용하신 뒤, 횡단보도를 건너 자갈치시장 본관 1층 정문으로 진입하시면 7층 루프탑 직행 엘리베이터를 타실 수 있습니다.',
    transitTipEn: 'Take Line 1 Jagalchi Station Exit 10 elevator, cross the street to the 1F main market hall, and ride the express elevator directly to the 7F rooftop.',
    apiSource: '한국관광공사 공공데이터포털 KorWithService2 무장애 관광정보',
    modifiedTime: '2026-06-15',
    barrierFree: {
      wheelchair: {
        available: true,
        titleKo: '휠체어 편의 및 대여',
        titleEn: 'Wheelchair Accessibility & Rental',
        descKo: '1층 중앙 안내실에서 휠체어를 무료로 대여할 수 있으며, 7층 루프탑 전망 데크 전체가 문턱 없는 평탄 데크입니다.',
        descEn: 'Free wheelchair rentals at 1F info desk; entire 7F rooftop is flat timber decking with zero obstacles.',
        icon: '♿',
        tag: '루프탑 평탄 데크 / 휠체어 무료 대여',
      },
      elevator: {
        available: true,
        titleKo: '7층 직통 대형 엘리베이터',
        titleEn: 'High-Capacity Direct Elevators',
        descKo: '1층 정문 홀에서 7층 루프탑 하늘전망대로 직결되는 대형 엘리베이터 3대가 가동 중이며 휠체어 전용 조작반이 있습니다.',
        descEn: '3 high-capacity elevators operate directly from 1F to the 7F observatory deck with low button panels.',
        icon: '🛗',
        tag: '3대 직결 운행 / 휠체어 조작반',
      },
      restroom: {
        available: true,
        titleKo: '장애인 전용 화장실',
        titleEn: 'Accessible Restrooms',
        descKo: '본관 1층, 2층, 3층 및 7층 루프탑 전망대 바로 옆에 장애인 전용 화장실(자동문, 비상벨)이 설치되어 있습니다.',
        descEn: 'Dedicated accessible restrooms with sliding automatic doors located on 1F, 2F, 3F, and right by the 7F observatory.',
        icon: '🚻',
        tag: '각 층별 완비 / 7층 전망대 바로 옆',
      },
      parking: {
        available: true,
        titleKo: '장애인 전용 주차구역',
        titleEn: 'Accessible Parking',
        descKo: '자갈치시장 지하 1층 및 지하 2층 주차장 내 장애인 주차구역 12면 확보, 엘리베이터 홀과 직결됩니다.',
        descEn: '12 accessible spaces on B1 and B2 with step-free access straight into elevator lobbies.',
        icon: '🅿️',
        tag: '12면 완비 / 승강기 홀 직결',
      },
      route: {
        available: true,
        titleKo: '주출입구 및 진입로 경사로',
        titleEn: 'Entrance Ramps & Step-Free Route',
        descKo: '자갈치시장 지상 1층 정문 및 남항 수변 데크 방향 출입구 전체가 단차 0cm 자동문으로 시공되어 있습니다.',
        descEn: 'All ground entrances feature automatic doors and 0cm thresholds.',
        icon: '🛣️',
        tag: '단차 0cm 자동문 시공',
      },
      tactilePaving: {
        available: true,
        titleKo: '점자블록 및 시각장애인 유도',
        titleEn: 'Tactile Paving & Braille Guides',
        descKo: '1층 주출입구 바닥과 엘리베이터 승강장, 장애인 화장실 입구에 유도 점자 블록이 배치되어 있습니다.',
        descEn: 'Tactile dot paving guides visitors to main doors, elevators, and accessible restrooms.',
        icon: '🦯',
        tag: '승강장 및 입구 점자 블록',
      },
      stroller: {
        available: true,
        titleKo: '유아차 관람 편의',
        titleEn: 'Stroller Accessibility',
        descKo: '전망대 망원경 공간 및 포토존 보행 폭이 3m 이상으로 유아차 동반 시 탁 트인 바다 조망을 편안히 즐길 수 있습니다.',
        descEn: 'Spacious observation terrace exceeding 3m corridor width, highly suitable for strollers.',
        icon: '👶',
        tag: '테라스 광폭 보행로',
      },
      audioVisual: {
        available: true,
        titleKo: '영도대교 도개 음성 안내',
        titleEn: 'Port Audio Announcements',
        descKo: '매주 토요일 오후 2시 영도대교 도개 행사 시 루프탑 전망대에서 해설 안내 방송이 송출됩니다.',
        descEn: 'Audio commentary broadcasts during the Saturday Yeongdodaegyo bridge lift event.',
        icon: '🔊',
        tag: '도개 행사 해설 방송',
      },
    },
  },

  // 7. 부평 깡통 국제 시장
  'spot-bupyeong-market': {
    id: 'spot-bupyeong-market',
    contentId: '1878218',
    nameKo: '부평 깡통 국제 시장',
    nameEn: 'Bupyeong Kkangtong Market',
    categoryKo: '전통시장/미식',
    categoryEn: 'Market/Food',
    districtKo: '중구',
    districtEn: 'Jung-gu',
    firstImage: 'https://tong.visitkorea.or.kr/cms/resource/70/3561970_image2_1.jpg',
    additionalImages: [],
    addressRoadKo: '부산광역시 중구 부평1길 48',
    addressRoadEn: '48 Bupyeong 1-gil, Jung-gu, Busan',
    addressLotKo: '부산광역시 중구 부평동2가 11-15',
    addressLotEn: '11-15 Bupyeong-dong 2-ga, Jung-gu, Busan',
    zipcode: '48987',
    latitude: 35.1018,
    longitude: 129.0258,
    tel: '051-243-1128',
    telDescKo: '부평깡통시장 상인회 / 고객지원센터',
    overviewKo: '부산의 대표적인 전통시장인 부평 깡통시장은 어묵거리, 비빔당면, 유부전골, 씨앗호떡 등 부산 고유의 미식을 한자리에서 만날 수 있는 활기찬 명소입니다. 시장 전 구역에 높은 아케이드 지붕이 완비되어 있어 비나 눈이 와도 날씨에 구애받지 않으며, 메인 골목이 평탄하게 포장되어 있어 휠체어와 유모차로도 전통 시장의 정취를 안전하게 즐길 수 있습니다.',
    overviewEn: 'A vibrant historical market renowned for Busan street food like fish cakes and spicy glass noodles. Completely covered by high all-weather arcades with flat ground throughout.',
    useTimeKo: '일반 시장 08:00 ~ 20:00 / 야시장 19:30 ~ 23:30',
    useTimeEn: 'Daytime Market 08:00 - 20:00 / Night Market 19:30 - 23:30',
    restDateKo: '연중무휴 (일부 점포 매월 첫째, 셋째 일요일 휴무)',
    restDateEn: 'Open year-round',
    feeKo: '시장 무료 입장',
    feeEn: 'Free Admission',
    homepage: 'http://www.bupyeong-market.com',
    subwayLine: '1호선',
    nearestStationNameKo: '자갈치역 (1호선)',
    nearestStationNameEn: 'Jagalchi Station (Line 1)',
    recommendedExit: '3번 또는 7번 출구 엘리베이터',
    walkingDistanceMeters: 400,
    walkingTimeMinutes: 6,
    transitTipKo: '지하철 1호선 자갈치역 3번 또는 7번 출구 엘리베이터를 이용하신 뒤, BIFF광장을 통과하는 평탄한 보행로를 따라 400m 직진하시면 부평깡통시장 1번 아케이드 입구에 도착합니다.',
    transitTipEn: 'From Line 1 Jagalchi Station Exit 3 or 7 elevator, stroll down the flat pedestrian path through BIFF Square for 400m to Arcade Entrance #1.',
    apiSource: '한국관광공사 공공데이터포털 KorWithService2 무장애 관광정보',
    modifiedTime: '2026-06-16',
    barrierFree: {
      wheelchair: {
        available: true,
        titleKo: '휠체어 통행 환경',
        titleEn: 'Wheelchair Accessibility',
        descKo: '아케이드 주요 중앙 통로가 평탄하게 아스콘 및 블록 포장되어 단차가 최소화되어 있으며 휠체어 이동이 수월합니다.',
        descEn: 'Major central arcade lanes are paved flat with minimal steps, facilitating smooth wheelchair passage.',
        icon: '♿',
        tag: '아케이드 평탄 바닥 / 우천 시 안심',
      },
      elevator: {
        available: true,
        titleKo: '고객지원센터 엘리베이터',
        titleEn: 'Customer Center Elevator',
        descKo: '부평깡통시장 고객지원센터 3층 건물 내에 승강기가 설치되어 있어 안내실과 쉼터를 자유롭게 이용할 수 있습니다.',
        descEn: 'Customer Support Center is equipped with an elevator serving all three administrative and lounge floors.',
        icon: '🛗',
        tag: '고객지원센터 승강기 완비',
      },
      restroom: {
        available: true,
        titleKo: '장애인 전용 화장실',
        titleEn: 'Accessible Restrooms',
        descKo: '고객지원센터 1층 및 공영주차장 1층에 장애인 전용 화장실(자동문, 안전 손잡이)이 마련되어 있습니다.',
        descEn: 'Accessible restrooms with automatic doors located on 1F of Customer Center and Public Parking.',
        icon: '🚻',
        tag: '고객지원센터 & 주차장 1층',
      },
      parking: {
        available: true,
        titleKo: '장애인 전용 주차구역',
        titleEn: 'Accessible Parking',
        descKo: '부평공영주차장 1층 내 장애인 전용 주차면 4면 확보 (시장 진입로까지 단차 없는 평지 연결).',
        descEn: '4 dedicated accessible bays at Bupyeong Public Parking with level connection directly into the market.',
        icon: '🅿️',
        tag: '부평공영주차장 4면',
      },
      route: {
        available: true,
        titleKo: '주출입구 및 진입로 경사로',
        titleEn: 'Entrance Ramps & Step-Free Route',
        descKo: '주요 게이트 8개소 전체에 문턱이 없어 휠체어와 카트가 걸림 없이 매끄럽게 진입할 수 있습니다.',
        descEn: 'All 8 market gates have level thresholds allowing smooth roll-in for wheelchairs and carts.',
        icon: '🛣️',
        tag: '문턱 없는 개방형 게이트',
      },
      tactilePaving: {
        available: true,
        titleKo: '점자블록 및 시각장애인 유도',
        titleEn: 'Tactile Paving & Braille Guides',
        descKo: '고객지원센터 입구와 공중화장실 진입부에 시각장애인용 유도 점자 블록이 설치되어 있습니다.',
        descEn: 'Tactile blocks positioned at Customer Center doors and public restroom entrances.',
        icon: '🦯',
        tag: '고객센터 입구 점자 블록',
      },
      stroller: {
        available: true,
        titleKo: '유아차 이용 및 날씨 안심',
        titleEn: 'Stroller Accessibility',
        descKo: '높은 개폐형 아케이드 덕분에 눈이나 비가 와도 유아차가 젖지 않고 쾌적하게 쇼핑과 시식을 즐길 수 있습니다.',
        descEn: 'Covered canopy keeps strollers sheltered from rain, heat, and direct sunlight.',
        icon: '👶',
        tag: '전천후 아케이드 보호',
      },
      audioVisual: {
        available: false,
        titleKo: '시장 안내 방송',
        titleEn: 'Market Audio PA System',
        descKo: '상인회 안내 방송 시스템을 통해 미아 방지 및 안전 안내가 수시 방송됩니다.',
        descEn: 'Public speaker system for announcements and customer assistance.',
        icon: '🔊',
        tag: '상인회 공공 방송',
      },
    },
  },

  // 8. 부산 시티투어버스
  'spot-city-tour-bus': {
    id: 'spot-city-tour-bus',
    contentId: '',
    nameKo: '부산 시티투어버스 (BUTI)',
    nameEn: 'Busan City Tour Bus (BUTI)',
    categoryKo: '교통/투어',
    categoryEn: 'Transit/Tour',
    districtKo: '동구',
    districtEn: 'Dong-gu',
    firstImage: '',
    additionalImages: [],
    addressRoadKo: '부산광역시 동구 중앙대로 206 KTX 부산역 광장 시티투어 승차장',
    addressRoadEn: 'KTX Busan Station Plaza, 206 Jungang-daero, Dong-gu, Busan',
    addressLotKo: '부산광역시 동구 초량동 1205-1',
    addressLotEn: '1205-1 Choryang-dong, Dong-gu, Busan',
    zipcode: '48726',
    latitude: 35.1154,
    longitude: 129.0422,
    tel: '051-466-0775',
    telDescKo: '부산관광공사 시티투어 운영본부',
    overviewKo: '부산의 핵심 관광 명소(해운대, 광안리, 태종대, 송도, 오륙도 등)를 한 장의 티켓으로 자유롭게 환승하며 누빌 수 있는 부산 대표 순환형 관광버스입니다. 휠체어 승하차가 가능한 유압식 자동 슬로프 램프와 전용 고정석이 구비된 친환경 저상 버스가 정규 투어 라인에 정기 배차되어 있어, 교통약자도 안전하고 쾌적하게 부산 전역을 여행할 수 있습니다.',
    overviewEn: 'Hop-on hop-off sightseeing bus network covering Busan’s top sights with wheelchair-accessible low-floor buses equipped with automatic boarding ramps and secure wheelchair bays.',
    useTimeKo: '수~일 09:30 ~ 18:00 (월, 화요일 정기 휴무 / 40~50분 간격 순환 운행)',
    useTimeEn: 'Wed-Sun 09:30 - 18:00 (Closed Mon & Tue / Runs every 40-50 mins)',
    restDateKo: '매주 월요일, 화요일 (공휴일 정상 운행)',
    restDateEn: 'Closed every Monday & Tuesday',
    feeKo: '1일 이용권 성인 15,000원 / 청소년 및 장애인 복지카드 소지자 8,000원',
    feeEn: '1-Day Pass: Adult 15,000 KRW / Discount for persons with disabilities 8,000 KRW',
    homepage: 'http://www.citytourbusan.com',
    subwayLine: '1호선',
    nearestStationNameKo: '부산역 (1호선 / KTX)',
    nearestStationNameEn: 'Busan Station (Line 1 / KTX)',
    recommendedExit: '6번 또는 8번 출구 엘리베이터',
    walkingDistanceMeters: 120,
    walkingTimeMinutes: 2,
    transitTipKo: 'KTX 부산역 2층 맞이방에서 1층 광장으로 통하는 투명 엘리베이터를 타시거나, 지하철 1호선 부산역 6번/8번 출구 승강기를 이용하시면 100m 앞 광장 중앙 시티투어 매표소 및 승차장에 바로 도착합니다.',
    transitTipEn: 'Take the KTX Busan Station plaza glass elevator to 1F, or subway Line 1 Exit 6/8 elevator directly to the central square boarding kiosk 120m away.',
    apiSource: '한국관광공사 공공데이터포털 KorWithService2 무장애 관광정보',
    modifiedTime: '2026-06-18',
    barrierFree: {
      wheelchair: {
        available: true,
        titleKo: '휠체어 리프트 및 전용 고정석',
        titleEn: 'Wheelchair Ramp & Secure Bays',
        descKo: '휠체어 2대가 동시 탑승할 수 있는 자동 슬로프 램프와 안전벨트 고정석이 장착된 저상 버스가 운행되며 승하차 도우미가 지원합니다.',
        descEn: 'Low-floor buses equipped with automated hydraulic ramps and dual secured wheelchair bays with boarding staff assistance.',
        icon: '♿',
        tag: '저상 리프트 버스 / 휠체어 2대 동시 탑승',
      },
      elevator: {
        available: true,
        titleKo: '부산역 광장 연결 엘리베이터',
        titleEn: 'Station Plaza Elevators',
        descKo: 'KTX 역사 2층 맞이방과 1층 시티투어 승차장 광장을 잇는 투명 대형 엘리베이터가 상시 가동 중입니다.',
        descEn: 'High-visibility glass elevators link the 2F KTX waiting concourse directly to the 1F bus boarding plaza.',
        icon: '🛗',
        tag: 'KTX 맞이방 ↔ 승차장 직결 엘리베이터',
      },
      restroom: {
        available: true,
        titleKo: '장애인 전용 화장실',
        titleEn: 'Accessible Restrooms',
        descKo: '승차장 바로 뒤편 KTX 부산역사 1층 및 2층 내 남녀 분리 다목적 장애인 전용 화장실(자동문, 비상호출벨)이 완비되어 있습니다.',
        descEn: 'Clean, modern accessible restrooms with automated sliding doors located immediately inside Busan Station on 1F and 2F.',
        icon: '🚻',
        tag: '부산역사 1·2층 다목적 화장실 완비',
      },
      parking: {
        available: true,
        titleKo: '장애인 전용 주차구역',
        titleEn: 'Accessible Parking',
        descKo: 'KTX 부산역 광장 북측 및 남측 선상 공영주차장 내 장애인 전용 주차면 15면 확보 (승차장까지 평지 도보 2분).',
        descEn: '15 accessible parking spaces at the station parking decks within 2 minutes flat walk.',
        icon: '🅿️',
        tag: '부산역사 주차장 15면',
      },
      route: {
        available: true,
        titleKo: '승강장 진입로 무단차 데크',
        titleEn: 'Step-Free Boarding Concourse',
        descKo: '광장 바닥과 승차장 탑승 대기선 전체가 단차 0cm의 매끄러운 화강석 블록으로 시공되어 있어 휠체어 주행이 매우 쾌적합니다.',
        descEn: 'Zero threshold throughout the entire waiting concourse paving.',
        icon: '🛣️',
        tag: '단차 0cm 광장 승강장',
      },
      tactilePaving: {
        available: true,
        titleKo: '점자블록 및 시각장애인 유도',
        titleEn: 'Tactile Paving & Braille Guides',
        descKo: '부산역사 출구에서 시티투어버스 매표소까지 유도 점자블록이 연속적으로 포설되어 있습니다.',
        descEn: 'Tactile dot paving guides visitors continuously from station exits to the ticket booth.',
        icon: '🦯',
        tag: '매표소 직결 점자 블록',
      },
      stroller: {
        available: true,
        titleKo: '유아차 탑승 및 보관',
        titleEn: 'Stroller Boarding & Storage',
        descKo: '접이식 유아차를 버스 하부 적재함 또는 차내 전용 공간에 편리하게 보관 및 동반 탑승할 수 있습니다.',
        descEn: 'Foldable strollers can be carried onboard or stored in dedicated luggage areas.',
        icon: '👶',
        tag: '유아차 동반 탑승 가능',
      },
      audioVisual: {
        available: true,
        titleKo: '다국어 오디오 가이드 & 전면 LED',
        titleEn: 'Multilingual Audio Tour & Display',
        descKo: '좌석별 개인 이어폰 단자로 한국어, 영어, 일본어, 중국어 음성 관광 해설이 지원되며 차내 전면 LED 자막이 표출됩니다.',
        descEn: 'Personal seat earphone jacks provide 4-language audio tours, complemented by LED destination screens.',
        icon: '🔊',
        tag: '4개 국어 음성 해설 & LED 자막',
      },
    },
  },
};

/**
 * 관광지 ID 또는 contentId로 한국관광공사 OpenAPI 상세 정보 조회
 */
export function getKoreaTourApiPlaceDetail(targetId: string): OpenApiPlaceDetail | null {
  const normId = targetId.toLowerCase().trim();

  // 1. 직접 ID 일치
  if (KOREA_TOUR_API_PLACE_DETAILS[normId]) {
    return KOREA_TOUR_API_PLACE_DETAILS[normId];
  }

  // 2. contentId 또는 별칭 검색
  const values = Object.values(KOREA_TOUR_API_PLACE_DETAILS);
  const found = values.find(
    (item) =>
      item.id.toLowerCase() === normId ||
      item.contentId.toLowerCase() === normId ||
      item.nameKo.toLowerCase().includes(normId) ||
      normId.includes(item.id.toLowerCase())
  );

  return found || null;
}
