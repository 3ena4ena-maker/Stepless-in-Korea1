export interface TourApiBarrierFreeInfo {
  parking: {
    hasParking: boolean;
    descKo: string;
    descEn: string;
  };
  route: { // 주출입구 및 진입로
    hasRamp: boolean;
    hasNoStep: boolean;
    descKo: string;
    descEn: string;
  };
  elevator: {
    hasElevator: boolean;
    descKo: string;
    descEn: string;
  };
  toilet: {
    hasToilet: boolean;
    descKo: string;
    descEn: string;
  };
  wheelchair: {
    hasRental: boolean;
    descKo: string;
    descEn: string;
  };
  tactilePaving: {
    hasTactile: boolean;
    descKo: string;
    descEn: string;
  };
  stroller: {
    hasStroller: boolean;
    descKo: string;
    descEn: string;
  };
  handicapAudioSignage?: {
    hasAudio: boolean;
    descKo: string;
    descEn: string;
  };
}

export interface TourApiSpot {
  contentid: string;
  titleKo: string;
  titleEn: string;
  categoryKo: '관광지' | '문화시설' | '해변/자연' | '쇼핑/복합문화' | '미식/기타';
  categoryEn: 'Attraction' | 'Culture' | 'Beach/Nature' | 'Shopping' | 'Gourmet/Other';
  districtKo: string; // e.g. 해운대구, 수영구, 중구, 영도구, 사하구, 금정구, 부산진구
  districtEn: string;
  addr1Ko: string;
  addr1En: string;
  tel: string;
  firstimage: string;
  mapx: number; // longitude
  mapy: number; // latitude
  overviewKo: string;
  overviewEn: string;
  homepage?: string;
  useTimeKo?: string;
  useTimeEn?: string;
  restDateKo?: string;
  restDateEn?: string;
  feeKo?: string;
  feeEn?: string;

  // Synergy with Stepless Subway Database
  nearestStationId: string;
  nearestStationNameKo: string;
  nearestStationNameEn: string;
  recommendedElevatorExit: string;
  exitDistanceTextKo: string;
  exitDistanceTextEn: string;
  transitTipKo: string;
  transitTipEn: string;

  // Korea Tourism Organization (KorWithAPI) Barrier-Free Specs
  barrierFree: TourApiBarrierFreeInfo;
}

export const BUSAN_TOUR_API_SPOTS: TourApiSpot[] = [
  {
    contentid: 'tour-101',
    titleKo: '해운대 해수욕장 & 무장애 백사장 산책로',
    titleEn: 'Haeundae Beach & Barrier-Free Boardwalk',
    categoryKo: '해변/자연',
    categoryEn: 'Beach/Nature',
    districtKo: '해운대구',
    districtEn: 'Haeundae-gu',
    addr1Ko: '부산광역시 해운대구 우동 해운대해변로 264',
    addr1En: '264 Haeundaehaebyeon-ro, Haeundae-gu, Busan',
    tel: '051-749-5700',
    firstimage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80',
    mapx: 129.1604,
    mapy: 35.1587,
    overviewKo: '대한민국 대표 해변으로, 백사장 진입 구간에 경사로와 목재 무장애 데크로드가 구비되어 있어 휠체어와 유모차도 바다 바로 앞까지 안전하게 진입할 수 있습니다.',
    overviewEn: 'Korea’s premier urban beach equipped with wooden barrier-free ramps leading all the way to the shoreline for wheelchair and stroller accessibility.',
    useTimeKo: '24시간 오픈 (개장시 09:00~18:00)',
    useTimeEn: '24 Hours (Swimming season 09:00 - 18:00)',
    restDateKo: '연중무휴',
    restDateEn: 'Open year-round',
    feeKo: '무료',
    feeEn: 'Free',
    homepage: 'https://www.haeundae.go.kr',
    nearestStationId: 'haeundae',
    nearestStationNameKo: '해운대역 (2호선)',
    nearestStationNameEn: 'Haeundae Station (Line 2)',
    recommendedElevatorExit: '5번 출구 엘리베이터',
    exitDistanceTextKo: '도보 350m (약 5분) / 단차 없는 구남로 평탄 보도',
    exitDistanceTextEn: '350m (5 mins) via flat Gunam-ro pedestrian walkway',
    transitTipKo: '해운대역 5번 출구 엘리베이터 이용 후 구남로 보행자 전용 도로를 따라 곧장 직진하시면 해변 입구 무장애 데크로 연결됩니다.',
    transitTipEn: 'Take Line 2 Haeundae Station Exit 5 elevator and proceed down the step-free Gunam-ro path straight to the beach ramp.',
    barrierFree: {
      parking: {
        hasParking: true,
        descKo: '해운대 광장 공영주차장 내 장애인 전용 주차구역 8면 (주출입구 인접)',
        descEn: '8 dedicated accessible parking spaces at Haeundae Public Parking.'
      },
      route: {
        hasRamp: true,
        hasNoStep: true,
        descKo: '백사장 매트 및 목재 무장애 산책로 완비 (단차 0cm, 폭 2m 이상)',
        descEn: 'Wooden boardwalks and beach mats installed with zero threshold step.'
      },
      elevator: {
        hasElevator: true,
        descKo: '관광안내소 및 해운대 이벤트 광장 엘리베이터 가동',
        descEn: 'Elevators available at Tourist Information Center & Event Plaza.'
      },
      toilet: {
        hasToilet: true,
        descKo: '해변 이벤트 광장 및 공중화장실 장애인 전용 화장실 (자동문, 손잡이)',
        descEn: 'Accessible restrooms with automatic doors and safety grab bars.'
      },
      wheelchair: {
        hasRental: true,
        descKo: '해운대 관광안내소에서 수동/전동 휠체어 및 유모차 무료 대여',
        descEn: 'Free manual/electric wheelchair and stroller rentals at Info Center.'
      },
      tactilePaving: {
        hasTactile: true,
        descKo: '관광안내소 및 보행로 주요 지점 점자 블록 구비',
        descEn: 'Tactile paving installed along main access paths and info desks.'
      },
      stroller: {
        hasStroller: true,
        descKo: '유모차 전용 바퀴 보행 매트 및 대여 서비스 제공',
        descEn: 'Stroller mats and rental services available.'
      },
      handicapAudioSignage: {
        hasAudio: true,
        descKo: '시청각 장애인용 수어 영상 가이드 및 점자 안내판 설치',
        descEn: 'Sign language video guides and Braille maps provided.'
      }
    }
  },
  {
    contentid: 'tour-102',
    titleKo: '광안리 해수욕장 & 민락수변공원',
    titleEn: 'Gwangalli Beach & Millak Waterfront Park',
    categoryKo: '해변/자연',
    categoryEn: 'Beach/Nature',
    districtKo: '수영구',
    districtEn: 'Suyeong-gu',
    addr1Ko: '부산광역시 수영구 광안해변로 219',
    addr1En: '219 Gwanganhaebyeon-ro, Suyeong-gu, Busan',
    tel: '051-610-4216',
    firstimage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    mapx: 129.1189,
    mapy: 35.1532,
    overviewKo: '광안대교의 환상적인 야경과 매주 토요일 M 드론라이트쇼가 펼쳐지는 명소로, 해변도로 전체가 경사 없는 평지 보도로 정비되어 있습니다.',
    overviewEn: 'Famous for Gwangan Bridge views and Saturday night Drone Shows, featuring completely level seaside footpaths.',
    useTimeKo: '24시간 자유 관람 (드론쇼: 토요일 저녁 2회)',
    useTimeEn: '24 Hours (Drone Show: Saturday nights)',
    restDateKo: '연중무휴',
    restDateEn: 'Open year-round',
    feeKo: '무료',
    feeEn: 'Free',
    homepage: 'https://www.suyeong.go.kr/tour',
    nearestStationId: 'gwangan',
    nearestStationNameKo: '광안역 (2호선)',
    nearestStationNameEn: 'Gwangan Station (Line 2)',
    recommendedElevatorExit: '1번 출구 엘리베이터',
    exitDistanceTextKo: '도보 600m (약 8분) / 광안로 일직선 완만 보도',
    exitDistanceTextEn: '600m (8 mins) along flat Gwangan-ro sidewalk',
    transitTipKo: '광안역 1번 출구 엘리베이터 이용 후 삼거리에서 해변 방향으로 직선 이동 시 턱 없는 보행로로 진입합니다.',
    transitTipEn: 'Exit Line 2 Gwangan Station Exit 1 elevator and follow Gwangan-ro straight to the beach promenade.',
    barrierFree: {
      parking: {
        hasParking: true,
        descKo: '광안리 해변 공영주차장 장애인 주차 6면',
        descEn: '6 designated accessible parking spaces at public beach lot.'
      },
      route: {
        hasRamp: true,
        hasNoStep: true,
        descKo: '차도와 보도 단차 분리 평지 및 수변공원 무단차 데크',
        descEn: 'Step-free level promenade and flat wooden decking.'
      },
      elevator: {
        hasElevator: true,
        descKo: '수영구 생활문화센터 및 인근 공공건물 승강기 이용 가능',
        descEn: 'Elevators available at Suyeong Cultural Center.'
      },
      toilet: {
        hasToilet: true,
        descKo: '해변 중앙 및 만남의 광장 장애인 전용 화장실 3곳',
        descEn: '3 handicap accessible restrooms along the beachfront.'
      },
      wheelchair: {
        hasRental: true,
        descKo: '광안리 관광안내소 수동 휠체어 무료 대여',
        descEn: 'Manual wheelchairs available at Gwangalli Tourist Center.'
      },
      tactilePaving: {
        hasTactile: true,
        descKo: '주요 횡단보도 및 안심 보행로 점자 블록 완비',
        descEn: 'Tactile paving at crosswalks and main pedestrian zones.'
      },
      stroller: {
        hasStroller: true,
        descKo: '유모차 이동에 유리한 넓은 평지 인도',
        descEn: 'Wide, smooth walkways perfect for strollers.'
      }
    }
  },
  {
    contentid: 'tour-103',
    titleKo: 'BEXCO 벡스코 & 부산시립미술관',
    titleEn: 'BEXCO & Busan Museum of Art',
    categoryKo: '문화시설',
    categoryEn: 'Culture',
    districtKo: '해운대구 (센텀시티)',
    districtEn: 'Haeundae-gu (Centum City)',
    addr1Ko: '부산광역시 해운대구 APEC로 55',
    addr1En: '55 APEC-ro, Haeundae-gu, Busan',
    tel: '051-740-7300',
    firstimage: 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?auto=format&fit=crop&w=1000&q=80',
    mapx: 129.1360,
    mapy: 35.1690,
    overviewKo: '국제적인 전시 컨벤션 센터 및 시립미술관 단지로, 건물 전체가 100% 무장애 BF(Barrier-Free) 설계로 조성되어 이동 보약자 접근성이 최고 수준입니다.',
    overviewEn: 'World-class exhibition & art museum complex built with 100% Barrier-Free standards for seamless access.',
    useTimeKo: '09:00 ~ 18:00 (전시별 상이)',
    useTimeEn: '09:00 - 18:00 (Varies by exhibition)',
    restDateKo: '미술관: 매주 월요일 휴관',
    restDateEn: 'Museum closed on Mondays',
    feeKo: '전시별 상이 / 장애인 및 동반자 50%~100% 할인',
    feeEn: 'Free to 50% discount for disabled visitors',
    homepage: 'https://www.bexco.co.kr',
    nearestStationId: 'bexco',
    nearestStationNameKo: '벡스코역 (2호선·동해선)',
    nearestStationNameEn: 'BEXCO Station (Line 2 / Donghae)',
    recommendedElevatorExit: '7번 출구 엘리베이터 (벡스코 제1전시장) / 5번 출구 (미술관)',
    exitDistanceTextKo: '도보 120m (약 2분) / 지하철 엘리베이터 직결',
    exitDistanceTextEn: '120m (2 mins) directly connected from station elevator',
    transitTipKo: '벡스코역 7번 출구 엘리베이터로 나오시면 바로 앞에 벡스코 야외 광장과 무장애 주출입구가 연결됩니다.',
    transitTipEn: 'Exit Line 2 BEXCO Station Exit 7 elevator directly onto BEXCO Plaza and main barrier-free entrance.',
    barrierFree: {
      parking: {
        hasParking: true,
        descKo: '제1·2전시장 지하주차장 장애인 전용 주차구역 80면 (전용 엘리베이터 옆)',
        descEn: '80 dedicated accessible parking spaces adjacent to elevators.'
      },
      route: {
        hasRamp: true,
        hasNoStep: true,
        descKo: '주출입구 자동문, 넓은 완만 경사로 (기울기 1/18 이하)',
        descEn: 'Automatic doors with broad gentle slopes (under 1/18 incline).'
      },
      elevator: {
        hasElevator: true,
        descKo: '전 관 대형 승강기 12대 가동 (장애인 높이 낮춤 조작반 완비)',
        descEn: '12 large elevators with low-positioned accessibility control buttons.'
      },
      toilet: {
        hasToilet: true,
        descKo: '각 층별 남녀 구분 장애인 전용 화장실 (자동문, 등받이, 호출벨)',
        descEn: 'Gender-separated handicap restrooms on every floor with emergency call buttons.'
      },
      wheelchair: {
        hasRental: true,
        descKo: '안내데스크 수동/전동 휠체어 20대 무료 대여 및 전동충전기 구비',
        descEn: 'Free rental of 20 wheelchairs and electric wheelchair fast chargers.'
      },
      tactilePaving: {
        hasTactile: true,
        descKo: '실내외 주요 동선 점자 블록 및 음성 안내기 구비',
        descEn: 'Indoor/outdoor tactile paving and voice beacon guidance.'
      },
      stroller: {
        hasStroller: true,
        descKo: '유모차 15대 대여 및 수유실 보유',
        descEn: 'Stroller rentals and nursing room available.'
      }
    }
  },
  {
    contentid: 'tour-104',
    titleKo: '국립해양박물관 (영도)',
    titleEn: 'National Maritime Museum',
    categoryKo: '문화시설',
    categoryEn: 'Culture',
    districtKo: '영도구',
    districtEn: 'Yeongdo-gu',
    addr1Ko: '부산광역시 영도구 해양로301번길 45',
    addr1En: '45 Haeyang-ro 301beon-gil, Yeongdo-gu, Busan',
    tel: '051-309-1900',
    firstimage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
    mapx: 129.0801,
    mapy: 35.0789,
    overviewKo: '바다의 역사와 수족관, 해양 문화를 한눈에 감상하는 최첨단 박물관으로, 국토교통부 최고 등급 BF 인증을 받은 이동 무장애 복합 시설입니다.',
    overviewEn: 'Top-rated BF (Barrier-Free) certified museum featuring sea life, aquariums, and maritime history.',
    useTimeKo: '09:00 ~ 18:00 (토/일 19:00까지)',
    useTimeEn: '09:00 - 18:00 (Weekends until 19:00)',
    restDateKo: '매주 월요일 휴관',
    restDateEn: 'Closed on Mondays',
    feeKo: '무료 (기획전 일부 유료)',
    feeEn: 'Free admission',
    homepage: 'https://www.knmm.or.kr',
    nearestStationId: 'busan',
    nearestStationNameKo: '부산역 (1호선) / 남포역 (1호선)',
    nearestStationNameEn: 'Busan Station / Nampo Station (Line 1)',
    recommendedElevatorExit: '부산역 5번 출구 엘리베이터 ↔ 저상버스 66번 환승',
    exitDistanceTextKo: '저상버스 66번 승차 후 박물관 입구 바로 하차',
    exitDistanceTextEn: 'Take low-floor bus #66 to drop off directly outside museum',
    transitTipKo: '부산역 5번 출구 엘리베이터 이용 후 버스정류장에서 영도 방향 66번 저상버스를 타시면 박물관 주출입구에 정차합니다.',
    transitTipEn: 'From Busan Station Exit 5 elevator, take low-floor city bus #66 straight to the museum main gate.',
    barrierFree: {
      parking: {
        hasParking: true,
        descKo: '지상/지하 주차장 장애인 전용 16면 (박물관 주출입구 엘리베이터 직결)',
        descEn: '16 dedicated accessible parking spots with direct elevator access.'
      },
      route: {
        hasRamp: true,
        hasNoStep: true,
        descKo: '주출입구 넓은 경사로 및 자동문 (단차 0cm)',
        descEn: 'Broad ramp entrance with automatic zero-threshold doors.'
      },
      elevator: {
        hasElevator: true,
        descKo: '전 층 관람 가능한 대형 수평 승강기 4대',
        descEn: '4 spacious passenger elevators connecting all exhibit floors.'
      },
      toilet: {
        hasToilet: true,
        descKo: '각 층별 장애인 전용 화장실 및 유아 동반 화장실',
        descEn: 'Handicap accessible restrooms and family toilets on all floors.'
      },
      wheelchair: {
        hasRental: true,
        descKo: '안내데스크 수동 휠체어 무료 대여',
        descEn: 'Free manual wheelchair rentals at Information Desk.'
      },
      tactilePaving: {
        hasTactile: true,
        descKo: '점자 모형 체험관 및 전동선 점자 블록 구비',
        descEn: 'Tactile models and guiding tactile paving throughout exhibitions.'
      },
      stroller: {
        hasStroller: true,
        descKo: '유모차 대여 및 수유실, 유아휴게실 보유',
        descEn: 'Stroller rentals, nursing rooms, and infant lounge available.'
      }
    }
  },
  {
    contentid: 'tour-105',
    titleKo: '용두산공원 & 부산타워',
    titleEn: 'Yongdusan Park & Busan Tower',
    categoryKo: '관광지',
    categoryEn: 'Attraction',
    districtKo: '중구 (남포동)',
    districtEn: 'Jung-gu (Nampo-dong)',
    addr1Ko: '부산광역시 중구 용두산길 37-55',
    addr1En: '37-55 Yongdusan-gil, Jung-gu, Busan',
    tel: '051-661-4000',
    firstimage: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1000&q=80',
    mapx: 129.0326,
    mapy: 35.1006,
    overviewKo: '부산 항구와 원도심 풍경을 360도로 한눈에 조망하는 명소로, 에스컬레이터와 무장애 엘리베이터 시설이 잘 갖춰져 있습니다.',
    overviewEn: 'Historic park and landmark tower overlooking Busan Port, equipped with escalators and accessible elevators.',
    useTimeKo: '공원: 24시간 / 부산타워: 10:00 ~ 22:00',
    useTimeEn: 'Park: 24 Hours / Tower: 10:00 - 22:00',
    restDateKo: '연중무휴',
    restDateEn: 'Open year-round',
    feeKo: '공원 무료 / 타워 관람료 12,000원 (장애인 할인)',
    feeEn: 'Park free / Tower 12,000 KRW (Discount applied)',
    homepage: 'https://www.bisco.or.kr/yongdusanpark',
    nearestStationId: 'nampo',
    nearestStationNameKo: '남포역 (1호선)',
    nearestStationNameEn: 'Nampo Station (Line 1)',
    recommendedElevatorExit: '1번 출구 엘리베이터 (용두산 공원 진입로)',
    exitDistanceTextKo: '도보 250m (약 3분) / 무장애 에스컬레이터 & 엘리베이터 연결',
    exitDistanceTextEn: '250m (3 mins) via accessible escalator and elevator tower',
    transitTipKo: '남포역 1번 출구 엘리베이터로 나오셔서 광복로 쇼핑거리 완만 도로를 통해 용두산 이동 승강기로 손쉽게 올라가실 수 있습니다.',
    transitTipEn: 'Exit Line 1 Nampo Station Exit 1 elevator and take the gentle Gwangbok-ro path to the park elevator.',
    barrierFree: {
      parking: {
        hasParking: true,
        descKo: '용두산 공영주차장 장애인 전용 주차구역 5면',
        descEn: '5 dedicated accessible parking spaces.'
      },
      route: {
        hasRamp: true,
        hasNoStep: true,
        descKo: '광복로 상가 ↔ 공원 정상 연결 무장애 에스컬레이터 및 엘리베이터 탑 탑승',
        descEn: 'Step-free elevator tower connecting Gwangbok-ro to the park top.'
      },
      elevator: {
        hasElevator: true,
        descKo: '부산타워 전망대 관람 전용 고속 엘리베이터 가동',
        descEn: 'High-speed accessible elevators to the tower observation deck.'
      },
      toilet: {
        hasToilet: true,
        descKo: '공원 중앙광장 및 타워 로비 장애인 전용 화장실',
        descEn: 'Handicap accessible restrooms at main plaza and tower lobby.'
      },
      wheelchair: {
        hasRental: true,
        descKo: '공원 관리사무소 수동 휠체어 대여',
        descEn: 'Manual wheelchairs available at Park Office.'
      },
      tactilePaving: {
        hasTactile: true,
        descKo: '타워 진입로 점자 블록 완비',
        descEn: 'Tactile paving along tower entrance.'
      },
      stroller: {
        hasStroller: true,
        descKo: '유모차 이동 용이한 보행 산책로',
        descEn: 'Smooth pavement for strollers.'
      }
    }
  },
  {
    contentid: 'tour-106',
    titleKo: '다대포해수욕장 & 고우니 생태길',
    titleEn: 'Dadaepo Beach & Gouni Ecological Trail',
    categoryKo: '해변/자연',
    categoryEn: 'Beach/Nature',
    districtKo: '사하구',
    districtEn: 'Saha-gu',
    addr1Ko: '부산광역시 사하구 다대동 몰운대1길 14',
    addr1En: '14 Morundae 1-gil, Saha-gu, Busan',
    tel: '051-220-4000',
    firstimage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    mapx: 128.9660,
    mapy: 35.0470,
    overviewKo: '세계 최대 규모의 낙조분수쇼와 넓은 갈대 습지 위로 끝없이 이어지는 평탄한 목재 무장애 산책로가 매력적인 서부산 최고 노을 명소입니다.',
    overviewEn: 'Western Busan’s sunset paradise with flat wooden boardwalks extending over coastal wetlands.',
    useTimeKo: '24시간 (음악분수: 4월~10월 야간 야외공연)',
    useTimeEn: '24 Hours (Fountain show: Apr - Oct evenings)',
    restDateKo: '연중무휴',
    restDateEn: 'Open year-round',
    feeKo: '무료',
    feeEn: 'Free',
    homepage: 'https://www.saha.go.kr/tour',
    nearestStationId: 'dadaepo',
    nearestStationNameKo: '다대포해수욕장역 (1호선)',
    nearestStationNameEn: 'Dadaepo Beach Station (Line 1)',
    recommendedElevatorExit: '1번 출구 엘리베이터',
    exitDistanceTextKo: '도보 100m (약 1분) / 출구에서 해변 산책로 100% 무단차 연결',
    exitDistanceTextEn: '100m (1 min) step-free walk directly from subway exit',
    transitTipKo: '다대포해수욕장역 1번 출구 엘리베이터를 내리자마자 턱 없는 평탄 잔디광장과 고우니 생태길 데크로드가 곧바로 시작됩니다.',
    transitTipEn: 'Step out of Line 1 Dadaepo Beach Station Exit 1 elevator straight onto flat park grass and wooden wetland trails.',
    barrierFree: {
      parking: {
        hasParking: true,
        descKo: '다대포 몰운대 공영주차장 장애인 전용 주차구역 12면',
        descEn: '12 dedicated accessible parking spots.'
      },
      route: {
        hasRamp: true,
        hasNoStep: true,
        descKo: '고우니 생태길 전체 100% 목재 데크로 조성 (경사 1% 미만 완전 평지)',
        descEn: '100% flat wooden boardwalk over wetlands under 1% incline.'
      },
      elevator: {
        hasElevator: true,
        descKo: '지하철역 출구 엘리베이터 지상 직결',
        descEn: 'Subway station exit elevator directly connects to ground level.'
      },
      toilet: {
        hasToilet: true,
        descKo: '해변 입구 및 꿈의 낙조분수 인근 장애인 전용 화장실 2곳',
        descEn: '2 handicap accessible restrooms near fountain plaza and entrance.'
      },
      wheelchair: {
        hasRental: true,
        descKo: '다대포 해변 관리센터 휠체어 무료 대여',
        descEn: 'Free wheelchair rentals at Beach Management Center.'
      },
      tactilePaving: {
        hasTactile: true,
        descKo: '해상 데크 진입 구간 점자 블록 구비',
        descEn: 'Tactile paving at wetland trail entrances.'
      },
      stroller: {
        hasStroller: true,
        descKo: '유모차 보행 최적화 목재 수평로',
        descEn: 'Perfect level wooden path for strollers.'
      }
    }
  },
  {
    contentid: 'tour-107',
    titleKo: '자갈치시장 & 수변공원 전망데크',
    titleEn: 'Jagalchi Fish Market & Coastal Terrace',
    categoryKo: '쇼핑/복합문화',
    categoryEn: 'Shopping',
    districtKo: '중구 (남포동)',
    districtEn: 'Jung-gu (Nampo-dong)',
    addr1Ko: '부산광역시 중구 자갈치해안로 52',
    addr1En: '52 Jagalchihaean-ro, Jung-gu, Busan',
    tel: '051-713-8000',
    firstimage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80',
    mapx: 129.0306,
    mapy: 35.0967,
    overviewKo: '부산을 상징하는 국내 최대 수산시장이 현대식 현대화 건물로 재탄생하여 전 층 엘리베이터와 넓은 무장애 수변 전망데크를 갖추고 있습니다.',
    overviewEn: 'Korea’s iconic seafood market with a modernized building featuring elevators and a barrier-free coastal terrace.',
    useTimeKo: '05:00 ~ 22:00 (전망대 09:00~21:00)',
    useTimeEn: '05:00 - 22:00 (Terrace 09:00 - 21:00)',
    restDateKo: '매월 첫째, 셋째 화요일 휴무',
    restDateEn: 'Closed 1st and 3rd Tuesdays',
    feeKo: '무료 입장',
    feeEn: 'Free Entry',
    homepage: 'http://www.jagalchimarket.or.kr',
    nearestStationId: 'jagalchi',
    nearestStationNameKo: '자갈치역 (1호선)',
    nearestStationNameEn: 'Jagalchi Station (Line 1)',
    recommendedElevatorExit: '10번 출구 엘리베이터',
    exitDistanceTextKo: '도보 180m (약 3분) / 단차 없는 수평 도로',
    exitDistanceTextEn: '180m (3 mins) step-free straight walk',
    transitTipKo: '자갈치역 10번 출구 엘리베이터로 나오셔서 해안 방향으로 이동하시면 자갈치 현대식 건물 주출입구 수평 경사로로 접근 가능합니다.',
    transitTipEn: 'Exit Line 1 Jagalchi Station Exit 10 elevator and walk toward the harbor to enter the main modernized market hall via ramps.',
    barrierFree: {
      parking: {
        hasParking: true,
        descKo: '지하 주차장 장애인 전용 10면 (승강기 직결)',
        descEn: '10 accessible parking spots in basement with direct elevators.'
      },
      route: {
        hasRamp: true,
        hasNoStep: true,
        descKo: '주출입구 넓은 수평 자동문 및 바닥 단차 없음',
        descEn: 'Broad automatic entrance with zero step.'
      },
      elevator: {
        hasElevator: true,
        descKo: '옥상 전망대 및 식당가 연결 대형 엘리베이터 3대',
        descEn: '3 large elevators serving all market floors and rooftop observation deck.'
      },
      toilet: {
        hasToilet: true,
        descKo: '층별 장애인 전용 화장실 (손잡이, 호출벨)',
        descEn: 'Handicap accessible toilets on every floor.'
      },
      wheelchair: {
        hasRental: true,
        descKo: '시장 번영회 사무실 휠체어 대여 지원',
        descEn: 'Wheelchair rental support at Market Management Office.'
      },
      tactilePaving: {
        hasTactile: true,
        descKo: '주요 출입구 점자 블록 완비',
        descEn: 'Tactile paving at main entrances.'
      },
      stroller: {
        hasStroller: true,
        descKo: '넓은 실내 복도로 유모차 이동 편리',
        descEn: 'Spacious indoor corridors easily navigated with strollers.'
      }
    }
  },
  {
    contentid: 'tour-108',
    titleKo: '동백섬 데크 산책로 & 누리마루 APEC하우스',
    titleEn: 'Dongbaekseom Island & Nurimaru APEC House',
    categoryKo: '관광지',
    categoryEn: 'Attraction',
    districtKo: '해운대구',
    districtEn: 'Haeundae-gu',
    addr1Ko: '부산광역시 해운대구 동백로 116',
    addr1En: '116 Dongbaek-ro, Haeundae-gu, Busan',
    tel: '051-749-4000',
    firstimage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    mapx: 129.1519,
    mapy: 35.1531,
    overviewKo: '동백나무와 해안 절경이 어우러진 해운대 우동 산책 코스로, 누리마루 APEC 하우스 관람로 전체가 단차 없는 평탄 데크길로 이루어져 있습니다.',
    overviewEn: 'Scenic island trail surrounded by camellia trees and ocean vistas, featuring barrier-free wooden boardwalks and APEC House elevators.',
    useTimeKo: '산책로: 24시간 / 누리마루: 09:00 ~ 17:00',
    useTimeEn: 'Trail: 24 Hours / APEC House: 09:00 - 17:00',
    restDateKo: '누리마루: 매월 첫째 월요일 휴관',
    restDateEn: 'APEC House closed 1st Monday of each month',
    feeKo: '무료 입장',
    feeEn: 'Free',
    homepage: 'https://www.haeundae.go.kr',
    nearestStationId: 'dongbaek',
    nearestStationNameKo: '동백역 (2호선)',
    nearestStationNameEn: 'Dongbaek Station (Line 2)',
    recommendedElevatorExit: '1번 출구 엘리베이터',
    exitDistanceTextKo: '도보 800m (약 10분) / 수평 아스팔트 보행로',
    exitDistanceTextEn: '800m (10 mins) flat asphalt walk along Dongbaek-ro',
    transitTipKo: '동백역 1번 출구 엘리베이터에서 동백섬 입구까지 완전히 평평한 인도입니다. 동백섬 둘레길 우측 평탄 코스를 이용하시면 휠체어도 수월합니다.',
    transitTipEn: 'Line 2 Dongbaek Station Exit 1 elevator leads to a flat sidewalk. Follow the right-side flat coastal loop for smooth wheelchair roll.',
    barrierFree: {
      parking: {
        hasParking: true,
        descKo: '동백섬 입구 공영주차장 장애인 주차 8면',
        descEn: '8 dedicated accessible parking spaces at Dongbaekseom parking lot.'
      },
      route: {
        hasRamp: true,
        hasNoStep: true,
        descKo: '누리마루 APEC 하우스 진입 경사로 및 완만 목재 산책로',
        descEn: 'Gentle wooden boardwalk and smooth ramps at APEC House.'
      },
      elevator: {
        hasElevator: true,
        descKo: 'APEC 하우스 실내 전용 관람 엘리베이터 가동',
        descEn: 'Interior elevators connecting all conference hall floors.'
      },
      toilet: {
        hasToilet: true,
        descKo: '산책로 중간 및 APEC하우스 로비 장애인 화장실 2곳',
        descEn: '2 handicap accessible restrooms along the trail and inside lobby.'
      },
      wheelchair: {
        hasRental: true,
        descKo: '누리마루 안내소 휠체어 대여',
        descEn: 'Wheelchair rentals available at Nurimaru info desk.'
      },
      tactilePaving: {
        hasTactile: true,
        descKo: 'APEC하우스 진입로 점자 블록 구비',
        descEn: 'Tactile paving at main hall entrances.'
      },
      stroller: {
        hasStroller: true,
        descKo: '유모차 보행에 용이한 평탄 데크길',
        descEn: 'Smooth wooden trail ideal for strollers.'
      }
    }
  },
  {
    contentid: 'tour-109',
    titleKo: '40계단 문화관광테마거리 & 문화관',
    titleEn: '40 Steps Cultural Street & Memorial Museum',
    categoryKo: '관광지',
    categoryEn: 'Attraction',
    districtKo: '중구 (중앙동)',
    districtEn: 'Jung-gu (Jungang-dong)',
    addr1Ko: '부산광역시 중구 40계단길 80',
    addr1En: '80, 40gyedan-gil, Jung-gu, Busan',
    tel: '051-600-4041',
    firstimage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80',
    mapx: 129.0355,
    mapy: 35.1038,
    overviewKo: '한국전쟁 피란민들의 애환이 담긴 대표 역사 거리로, 테마 거리 전체가 차도와 완만 보도로 정비되어 있으며 40계단 문화관에는 엘리베이터가 설치되어 있어 편리합니다.',
    overviewEn: 'Historic street depicting Korean War refugee memories, featuring level theme streets and museum elevators.',
    useTimeKo: '거리: 24시간 / 문화관: 09:00 ~ 18:00',
    useTimeEn: 'Street: 24 Hours / Museum: 09:00 - 18:00',
    restDateKo: '문화관: 주말 및 공휴일 휴관',
    restDateEn: 'Museum closed on weekends and public holidays',
    feeKo: '무료',
    feeEn: 'Free',
    homepage: 'https://www.bsjunggu.go.kr',
    nearestStationId: 'jungang',
    nearestStationNameKo: '중앙역 (1호선)',
    nearestStationNameEn: 'Jung-ang Station (Line 1)',
    recommendedElevatorExit: '12번 출구 엘리베이터',
    exitDistanceTextKo: '도보 120m (약 2분) / 출구 직결 평지 거리',
    exitDistanceTextEn: '120m (2 mins) flat walk directly from elevator exit',
    transitTipKo: '중앙역 12번 출구 엘리베이터로 오르시면 도로 경사 없이 곧바로 40계단 문화거리 중심부로 진입할 수 있습니다.',
    transitTipEn: 'Take Line 1 Jung-ang Station Exit 12 elevator to reach the heart of the cultural street without encountering steps.',
    barrierFree: {
      parking: {
        hasParking: true,
        descKo: '중앙동 공영주차장 장애인 전용 2면',
        descEn: '2 accessible parking spots.'
      },
      route: {
        hasRamp: true,
        hasNoStep: true,
        descKo: '테마 보도 블록 단차 정비 및 40계단 문화관 무단차 출입구',
        descEn: 'Level theme street paving and step-free entrance to Memorial Hall.'
      },
      elevator: {
        hasElevator: true,
        descKo: '40계단 문화관 실내 엘리베이터 가동 (전시실 이동)',
        descEn: 'Interior elevator inside Memorial Museum.'
      },
      toilet: {
        hasToilet: true,
        descKo: '문화관 1층 장애인 화장실 구비',
        descEn: 'Handicap accessible restroom on 1st floor of Museum.'
      },
      wheelchair: {
        hasRental: false,
        descKo: '거리 중심 완만 평지로 수동/전동 휠체어 자가 주행 용이',
        descEn: 'Flat street profile easily navigated by personal wheelchairs.'
      },
      tactilePaving: {
        hasTactile: true,
        descKo: '문화관 입구 점자 블록',
        descEn: 'Tactile paving at museum entrance.'
      },
      stroller: {
        hasStroller: true,
        descKo: '유모차 산책하기 좋은 차도 분리 완만거리',
        descEn: 'Pedestrian-friendly flat sidewalk for strollers.'
      }
    }
  },
  {
    contentid: 'tour-110',
    titleKo: '범어사 천년고찰 & 성보박물관',
    titleEn: 'Beomeosa Temple & Seongbo Museum',
    categoryKo: '관광지',
    categoryEn: 'Attraction',
    districtKo: '금정구 (청룡동)',
    districtEn: 'Geumjeong-gu (Cheongryong-dong)',
    addr1Ko: '부산광역시 금정구 범어사로 250',
    addr1En: '250 Beomeosa-ro, Geumjeong-gu, Busan',
    tel: '051-508-3122',
    firstimage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80',
    mapx: 129.0681,
    mapy: 35.2842,
    overviewKo: '신라 문무왕 때 창건된 영남 3대 사찰로, 최신 범어사 성보박물관 건물에 승강기와 경사로 등 무장애 시설이 차원 높게 조성되어 있습니다.',
    overviewEn: 'Ancient thousand-year-old Buddhist temple with modern Seongbo Museum featuring fully accessible ramps and elevators.',
    useTimeKo: '사찰: 24시간 / 박물관: 09:00 ~ 17:00',
    useTimeEn: 'Temple: 24 Hours / Museum: 09:00 - 17:00',
    restDateKo: '박물관: 매주 월요일 휴관',
    restDateEn: 'Museum closed on Mondays',
    feeKo: '무료',
    feeEn: 'Free',
    homepage: 'https://www.beomeo.kr',
    nearestStationId: 'beomeosa',
    nearestStationNameKo: '범어사역 (1호선)',
    nearestStationNameEn: 'Beomeosa Station (Line 1)',
    recommendedElevatorExit: '5번 또는 7번 출구 엘리베이터 ↔ 90번 저상버스 환승',
    exitDistanceTextKo: '90번 저상버스 승차 후 범어사 입구/박물관 바로 하차',
    exitDistanceTextEn: 'Take low-floor bus #90 to drop off right outside Seongbo Museum',
    transitTipKo: '범어사역 5, 7번 출구 엘리베이터로 나오신 후 범어사행 90번 버스를 타시면 박물관 및 사찰 입구 평탄 구역까지 곧장 도달합니다.',
    transitTipEn: 'Take Line 1 Beomeosa Station Exit 5/7 elevator and transfer to low-floor bus #90 dropping off right at the museum entrance.',
    barrierFree: {
      parking: {
        hasParking: true,
        descKo: '범어사 상마주차장 및 박물관 전용 장애인 주차구역 10면',
        descEn: '10 dedicated accessible parking spots.'
      },
      route: {
        hasRamp: true,
        hasNoStep: true,
        descKo: '성보박물관 완만 진입 경사로 및 수평 자동문',
        descEn: 'Smooth access ramps and automatic doors at Seongbo Museum.'
      },
      elevator: {
        hasElevator: true,
        descKo: '성보박물관 전시실 관람 전용 대형 승강기 2대',
        descEn: '2 large passenger elevators inside Seongbo Museum.'
      },
      toilet: {
        hasToilet: true,
        descKo: '박물관 로비 및 범어사 매표소 인근 장애인 전용 화장실',
        descEn: 'Handicap accessible restrooms at museum lobby and main ticketing gate.'
      },
      wheelchair: {
        hasRental: true,
        descKo: '성보박물관 안내소 휠체어 대여 지원',
        descEn: 'Wheelchair rental support at museum information counter.'
      },
      tactilePaving: {
        hasTactile: true,
        descKo: '박물관 동선 점자 블록 및 안내판 설치',
        descEn: 'Tactile paving along museum paths.'
      },
      stroller: {
        hasStroller: true,
        descKo: '박물관 영역 유모차 진입 용이',
        descEn: 'Easy stroller navigation in museum and lower courtyard.'
      }
    }
  }
];
