import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Search, 
  ThumbsUp, 
  Share2, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Navigation, 
  Train, 
  Umbrella, 
  Users, 
  Briefcase, 
  Check, 
  Info,
  ExternalLink
} from 'lucide-react';

export interface CommunityTravelGuideSectionProps {
  language: 'KR' | 'EN';
  onSelectStation?: (stationId: string) => void;
  onSwitchToStandard?: () => void;
}

interface CuratedTipItem {
  id: string;
  category: 'TRAVELER_TYPE' | 'REGIONAL_HACKS' | 'SITUATIONAL_ACTION' | 'FIELD_QNA';
  importance: 'MUST_KNOW' | 'LOCAL_SECRET' | 'SAFETY_FIRST' | 'TIME_SAVER';
  regionTagKo: string;
  regionTagEn: string;
  targetUserKo: string;
  targetUserEn: string;
  titleKo: string;
  titleEn: string;
  summaryKo: string;
  summaryEn: string;
  whyImportantKo: string;
  whyImportantEn: string;
  actionStepsKo: string[];
  actionStepsEn: string[];
  relatedStationId?: string;
  relatedStationNameKo?: string;
  relatedStationNameEn?: string;
  relatedExitKo?: string;
  relatedExitEn?: string;
  inspectorNoteKo: string;
  inspectorNoteEn: string;
  defaultHelpfulCount: number;
}

const CURATED_TIPS_DATA: CuratedTipItem[] = [
  // 1. TRAVELER TYPE TIPS
  {
    id: 'tip-family-stroller-subway',
    category: 'TRAVELER_TYPE',
    importance: 'MUST_KNOW',
    regionTagKo: '부산 전역 지하철',
    regionTagEn: 'Busan Transit Wide',
    targetUserKo: '👶 영유아 동반 & 유모차 가족',
    targetUserEn: '👶 Families with Strollers & Toddlers',
    titleKo: '유모차 동반 시 승강기 인근 탑승칸과 와이드 개찰구 최적 통과법',
    titleEn: 'Optimal Accessible Boarding & Wide Turnstile Entry for Strollers',
    summaryKo: '전동차 중앙 승강기 인근 탑승칸을 이용하면 환승 동선을 줄일 수 있습니다. 역별 승강기 위치가 다를 수 있으므로 현장 안내를 확인하세요. 비상 와이드 게이트 이용 요령도 함께 안내합니다.',
    summaryEn: 'Choosing a train car near the station elevator can help reduce transfer distance. Elevator locations vary by station, so check the station signs on site. Includes tips for wide barrier-free gates.',
    whyImportantKo: '일반 개찰구는 폭이 좁아 유모차 바퀴가 걸리거나 센서에 아이가 부딪힐 위험이 있습니다. 또한 승강장 양 끝 칸보다 중앙 승강기 인근 탑승칸을 이용하면 엘리베이터 이동 동선이 훨씬 짧아집니다.',
    whyImportantEn: 'Standard turnstiles are too narrow for standard strollers. Boarding near station elevators minimizes walking distance with baby carriages.',
    actionStepsKo: [
      '개찰구 진입 시 역무원 호출 버튼이 있는 가장 바깥쪽 "와이드(광폭) 개찰구"를 이용하세요.',
      '승강장 바닥의 휠체어/유모차 마크 및 승강기 연계 안내 표지판 인근 탑승 위치에서 대기합니다.',
      '하차 후 승강장 수직 엘리베이터를 이용해 대합실로 편리하게 이동하세요.'
    ],
    actionStepsEn: [
      'Use the outermost Wide Turnstile located near the station agent help booth.',
      'Queue at platform boarding marks designated with accessibility and elevator signs.',
      'Step out and take the platform elevator to reach the ticketing concourse effortlessly.'
    ],
    relatedStationId: 'seomyeon',
    relatedStationNameKo: '서면역',
    relatedStationNameEn: 'Seomyeon Station',
    relatedExitKo: '7번·11번 출구 엘리베이터',
    relatedExitEn: 'Exits 7 & 11 Elevators',
    inspectorNoteKo: '서면역과 남포역 환승 구간은 평일 17:30~19:00 사이 퇴근 혼잡도가 매우 높습니다. 이 시간대에는 승강기 탑승 대기가 2~3회 발생할 수 있으니 5분 정도 여유를 두고 이동하시길 권장합니다.',
    inspectorNoteEn: 'Seomyeon and Nampo transfer areas get heavily congested between 17:30-19:00 on weekdays. Expect 1-2 elevator wait cycles during rush hours.',
    defaultHelpfulCount: 142
  },
  {
    id: 'tip-luggage-ktx-transit',
    category: 'TRAVELER_TYPE',
    importance: 'TIME_SAVER',
    regionTagKo: '부산역 & 서면·해운대',
    regionTagEn: 'Busan Station & Downtown',
    targetUserKo: '🧳 대형 28인치 캐리어 여행자',
    targetUserEn: '🧳 28-inch Large Suitcase Travelers',
    titleKo: 'KTX 부산역 ↔ 지하철 1호선 캐리어 원스톱 환승 & 짐배송 서비스 요령',
    titleEn: 'KTX Busan Station ↔ Line 1 Suitcase Transit & Luggage Delivery Hacks',
    summaryKo: 'KTX 2층 대합실에서 지하 1호선 부산역까지 엘리베이터와 무빙워크로 이동할 수 있는 지하 연결 통로 동선 안내입니다.',
    summaryEn: 'Indoor step-free passageway linking KTX 2F concourse to Line 1 Subway with elevators and moving walkways.',
    whyImportantKo: '부산역 지상 광장 계단으로 나가면 경사로가 길고 비 오는 날 캐리어 바퀴가 미끄러질 수 있습니다. 지하 1층 직결 무빙워크 및 엘리베이터 통로를 통하면 날씨에 구애받지 않고 이동할 수 있습니다.',
    whyImportantEn: 'Walking across the outdoor plaza with heavy bags takes extra time and risks wheel slippage in rain. The underground direct passageway offers escalators and elevators.',
    actionStepsKo: [
      'KTX 열차 하차 후 2층 대합실 3번 출구 방향 "도시철도 타는 곳(지하 연결통로)" 표지판을 따라 이동합니다.',
      '엘리베이터 또는 무빙워크를 타고 지하 1층으로 내려가면 1호선 개찰구와 연결됩니다.',
      '숙소 체크인 전 몸만 가볍게 이동하고 싶다면 2층 부산역 대합실 내 짐배송 매장(짐캐리 등) 활용을 고려해 보세요 (운영조건 및 요금은 현장/공식 안내 확인 권장).'
    ],
    actionStepsEn: [
      'After getting off KTX, follow signs toward "Subway Direct Connection" near Exit 3 on 2F.',
      'Take the vertical elevator or moving walkway down to B1F to access Line 1 subway gates.',
      'Consider using luggage delivery services on 2F if you wish to forward bags to your hotel (check official hours and pricing).'
    ],
    relatedStationId: 'busan',
    relatedStationNameKo: '부산역',
    relatedStationNameEn: 'Busan Station',
    relatedExitKo: '지하 직결 통로 / 6번 출구 승강기',
    relatedExitEn: 'Direct B1 Passage / Exit 6 Elevator',
    inspectorNoteKo: '부산역 지하철 6번 출구 엘리베이터는 지상 택시 승강장 바로 앞과도 연결되어 있어, KTX 하차 후 택시로 갈아타실 때도 가장 편안합니다.',
    inspectorNoteEn: 'Subway Exit 6 elevator is right in front of the main taxi stand, making it ideal when switching between KTX and taxis.',
    defaultHelpfulCount: 128
  },
  {
    id: 'tip-wheelchair-bexco-centum',
    category: 'TRAVELER_TYPE',
    importance: 'SAFETY_FIRST',
    regionTagKo: '센텀시티 & 벡스코',
    regionTagEn: 'Centum City & BEXCO',
    targetUserKo: '♿ 휠체어 & 보행 약자 & 어르신',
    targetUserEn: '♿ Wheelchair & Senior Travelers',
    titleKo: '센텀시티역 지하철 ↔ 신세계백화점·영화의전당 단차 제로(Zero-Step) 경로',
    titleEn: 'Centum Station ↔ Shinsegae Mall & Cinema Center Zero-Step Route',
    summaryKo: '국내 최대 백화점과 벡스코, 영화의전당까지 턱이나 계단 없이 수평 이동할 수 있는 최적의 지하 연결 동선 안내입니다.',
    summaryEn: 'Comprehensive guide for zero-stair barrier-free transit between Centum Station, Department Store, and Busan Cinema Center.',
    whyImportantKo: '센텀시티 지상 도로는 교차로가 넓고 횡단보도 신호 대기 시간이 깁니다. 지하철 개찰구와 백화점 지하 2층이 수평으로 직통 연결되어 있어 날씨에 구애받지 않고 안전하게 이동할 수 있습니다.',
    whyImportantEn: 'Ground street crossings at Centum are huge with long waits. The direct underground connection to Shinsegae B2 provides comfortable climate-controlled accessibility.',
    actionStepsKo: [
      '2호선 센텀시티역 하차 후 지하 2층 신세계백화점 직통 연결 통로(개찰구 바로 앞)로 진입합니다.',
      '백화점 내부 엘리베이터를 이용해 1층 센텀광장 또는 지상 야외 보행로로 수평 진출합니다.',
      '영화의전당 방면은 지상 나루공원 연결 완만 경사 보행데크를 따라 이동하시면 휠체어도 수월합니다.'
    ],
    actionStepsEn: [
      'Alight at Centum City Station (Line 2) and enter Shinsegae B2 via the direct gate portal.',
      'Take the shopping mall internal elevator up to 1F for level ground access.',
      'Follow the APEC Naru Park gently sloped wooden walkway to reach Busan Cinema Center.'
    ],
    relatedStationId: 'centumcity',
    relatedStationNameKo: '센텀시티역',
    relatedStationNameEn: 'Centum City Station',
    relatedExitKo: '백화점 지하 직결구 / 6번·12번 출구',
    relatedExitEn: 'Direct Mall Portal / Exits 6 & 12',
    inspectorNoteKo: '신세계백화점 지하 2층 고객서비스센터 등에서 유모차/휠체어 대여 서비스를 지원할 수 있으니(보유 수량 및 운영 조건은 백화점 상황에 따라 상이), 필요 시 현장 안내데스크에 확인해 보세요.',
    inspectorNoteEn: 'Stroller/wheelchair rental may be available at Shinsegae B2 Customer Service Desk (subject to availability and store policy).',
    defaultHelpfulCount: 115
  },

  // 2. REGIONAL HACKS
  {
    id: 'tip-nampo-jagalchi-flat-walk',
    category: 'REGIONAL_HACKS',
    importance: 'LOCAL_SECRET',
    regionTagKo: '남포동 & 원도심',
    regionTagEn: 'Nampo & Old Town',
    targetUserKo: '👟 원도심 도보 & 미식 탐방객',
    targetUserEn: '👟 Old Downtown Food & Walking Tour',
    titleKo: '남포역 ↔ 자갈치시장 ↔ 용두산공원 에스컬레이터 무장애 연결 동선',
    titleEn: 'Nampo ↔ Jagalchi Market ↔ Yongdusan Park Escalator Level Walk',
    summaryKo: '남포동 광복로 패션거리의 완만한 평지와 용두산공원(부산타워) 직통 캐노피 에스컬레이터를 연계하여 계단 없이 원도심을 정복하는 꿀팁입니다.',
    summaryEn: 'Explore Nampo fashion street and ascend Yongdusan Park via the scenic covered outdoor escalator without climbing hills.',
    whyImportantKo: '용두산공원은 산 중턱에 위치해 있어 일반 보행로로 올라가면 경사가 매우 가파릅니다. 광복로 한가운데 설치된 무료 에스컬레이터를 타면 정상까지 힘들이지 않고 올라갈 수 있습니다.',
    whyImportantEn: 'Yongdusan Park sits on a hilltop. Using the Guangbok-ro covered outdoor escalator bypasses grueling steep stairs completely for free.',
    actionStepsKo: [
      '1호선 남포역 7번 출구(엘리베이터 완비)로 나와 광복로 패션거리 보행자 전용 도로로 진입합니다.',
      '광복로 중앙 삼거리의 "용두산공원 에스컬레이터 입구"에서 상행 에스컬레이터를 타고 부산타워 광장까지 이동합니다.',
      '하행 시에는 경사로 산책로(완만한 지그재그 휠체어 데크길)를 이용해 롯데백화점 광복점 방면으로 내려오시면 편리합니다.'
    ],
    actionStepsEn: [
      'Exit via Nampo Station Exit 7 (elevator equipped) and walk into Gwangbok-ro fashion lane.',
      'Ride the covered multi-stage escalator up to the Busan Diamond Tower plaza.',
      'Descent via the gently zig-zagged barrier-free deck towards Lotte Mall Gwangbok.'
    ],
    relatedStationId: 'nampo',
    relatedStationNameKo: '남포역',
    relatedStationNameEn: 'Nampo Station',
    relatedExitKo: '7번 출구 승강기 & 10번 출구',
    relatedExitEn: 'Exit 7 Elevator & Exit 10',
    inspectorNoteKo: '롯데백화점 광복점 아쿠아몰 11~13층 옥상 전망대는 엘리베이터로 바로 갈 수 있으며, 영도대교와 부산항 북항 바다가 360도로 파노라마처럼 내려다보이는 무료 뷰포인트입니다!',
    inspectorNoteEn: 'Lotte Mall Gwangbok 13F rooftop garden is free and wheelchair accessible, offering panoramic 360-degree views of Yeongdo Bridge and Busan Port.',
    defaultHelpfulCount: 98
  },
  {
    id: 'tip-haeundae-blueline-mipo',
    category: 'REGIONAL_HACKS',
    importance: 'MUST_KNOW',
    regionTagKo: '해운대 & 동부산',
    regionTagEn: 'Haeundae & East Coast',
    targetUserKo: '🌊 오션뷰 해변 & 캡슐열차 탑승객',
    targetUserEn: '🌊 Ocean View & Coastal Train Tourists',
    titleKo: '해운대 블루라인파크 미포정거장 계단 없는 완만 진입로와 해안 데크길',
    titleEn: 'Haeundae Blueline Park Mipo Station Step-Free Access & Deck Pathway',
    summaryKo: '해운대 해수욕장 백사장 끝 미포항에서 블루라인파크 매표소까지 턱 없이 이동할 수 있는 평탄 데크길 진입 방법입니다.',
    summaryEn: 'Step-free wooden boardwalk route from Haeundae Beach to Blueline Park Mipo boarding station.',
    whyImportantKo: '미포 입구 골목길은 차량 통행이 많고 인도가 좁습니다. 해변가 끝 "미포 바다전망 데크 보행로"를 이용하면 유모차나 휠체어도 안전하고 쾌적하게 탑승장 2층까지 승강기로 올라갈 수 있습니다.',
    whyImportantEn: 'Mipo car alleys are crowded with narrow sidewalks. Taking the ocean boardwalk provides flat wheelchair-friendly access with elevators up to the boarding platform.',
    actionStepsKo: [
      '2호선 해운대역 5번 출구 엘리베이터로 나와 해운대 해변 이벤트 광장으로 직진합니다.',
      '바다를 바라보고 좌측(동쪽) 끝 시그니엘 부산/엘시티 앞 해안 산책로를 따라 10분간 평탄하게 도보 이동합니다.',
      '미포정거장 1층 입구에서 전용 엘리베이터를 타고 2층 스카이캡슐 또는 해변열차 탑승장으로 진입하세요.'
    ],
    actionStepsEn: [
      'Take Haeundae Station Exit 5 elevator and walk toward Haeundae main beach plaza.',
      'Walk left along the flat ocean promenade past Signiel Busan/LCT for about 10 minutes.',
      'Take the Mipo Station internal elevator up to 2F for Sky Capsule or Beach Train boarding.'
    ],
    relatedStationId: 'haeundae',
    relatedStationNameKo: '해운대역',
    relatedStationNameEn: 'Haeundae Station',
    relatedExitKo: '3번·5번 출구 승강기',
    relatedExitEn: 'Exits 3 & 5 Elevators',
    inspectorNoteKo: '스카이캡슐은 주말 및 성수기 현장 대기가 길어질 수 있으므로, 방문 전 블루라인파크 공식 예매처에서 탑승 일정 및 잔여석 현황을 확인하시는 것을 권장합니다.',
    inspectorNoteEn: 'Sky Capsule can have long queues on weekends. Checking schedules and seat availability in advance on the official Blueline Park website is recommended.',
    defaultHelpfulCount: 167
  },
  {
    id: 'tip-sasang-riverside-park',
    category: 'REGIONAL_HACKS',
    importance: 'LOCAL_SECRET',
    regionTagKo: '사상 & 낙동강 서부산',
    regionTagEn: 'Sasang & West Nakdong River',
    targetUserKo: '🌿 힐링 산책 & 공항 환승객',
    targetUserEn: '🌿 Nature Walkers & Gimhae Airport Transits',
    titleKo: '사상역 ↔ 삼락생태공원 강변 휠체어·자전거 육교 평탄 연결로',
    titleEn: 'Sasang Station ↔ Samnak Eco-Park Wheelchair Overpass Connection',
    summaryKo: '사상역에서 삼락생태공원 연꽃단지와 벚꽃길까지 엘리베이터가 양방향 설치된 보행 육교를 통해 도로 횡단 없이 안전하게 건너가는 꿀팁입니다.',
    summaryEn: 'Cross wide highway roads safely via the elevator-equipped pedestrian overpass directly into Samnak Eco Park.',
    whyImportantKo: '사상역 앞 낙동대로는 대형 화물차와 차량 통행량이 많아 지상 횡단이 위험합니다. 르네시떼 앞 "강변나들교" 승강기를 이용하면 계단 없이 공원 잔디마당까지 안전하게 직행합니다.',
    whyImportantEn: 'Nakdong-daero highway is fast and hazardous for pedestrians. The Gangbyeon Nadeulgyo overpass has vertical elevators on both sides for safe crossings.',
    actionStepsKo: [
      '2호선 또는 김해경전철 사상역 하차 후 르네시떼 방면 3번 출구로 이동합니다.',
      '강변나들교 입구 엘리베이터를 탑승하여 보행 전용 육교 위로 올라갑니다.',
      '낙동강 전망을 조망하며 육교를 건넌 뒤 반대편 엘리베이터를 타고 삼락생태공원 평지 산책로로 내려갑니다.'
    ],
    actionStepsEn: [
      'Alight at Sasang Station (Line 2 or Gimhae LRT) and head toward Renecite Exit 3.',
      'Take the elevator at Gangbyeon Nadeulgyo bridge to reach the pedestrian deck.',
      'Cross the scenic bridge over the highway and take the opposite elevator down into the park.'
    ],
    relatedStationId: 'sasang',
    relatedStationNameKo: '사상역',
    relatedStationNameEn: 'Sasang Station',
    relatedExitKo: '3번 출구 & 경전철 1번 출구',
    relatedExitEn: 'Exit 3 & LRT Exit 1',
    inspectorNoteKo: '김해공항에서 경전철로 약 7분이면 사상역에 도착하므로, 비행기 탑승 전 여유가 있을 때 사상역 물품보관함 이용 후 공원을 산책하기에 좋습니다 (운영시간 및 시설 현황 사전 확인 권장).',
    inspectorNoteEn: 'Takes about 7 minutes from Gimhae Airport to Sasang via LRT. Ideal for a quick nature detour before flights while storing bags at Sasang station.',
    defaultHelpfulCount: 84
  },

  // 3. SITUATIONAL ACTION GUIDES
  {
    id: 'tip-rainy-day-indoor-route',
    category: 'SITUATIONAL_ACTION',
    importance: 'MUST_KNOW',
    regionTagKo: '부산 도심 실내 코스',
    regionTagEn: 'Busan Indoor Network',
    targetUserKo: '☔ 우천 & 악천후 여행자',
    targetUserEn: '☔ Rainy Day & Indoor Explorers',
    titleKo: '비 오는 날 우산 없이 즐기는 지하철 직결 3대 실내 무장애 코스',
    titleEn: 'Top 3 Indoor Step-Free Subway-Connected Rainy Day Routes',
    summaryKo: '비가 많이 올 때 지하철역에서 우산 없이 쇼핑, 식도락, 문화 전시를 즐길 수 있는 3대 직결 명소 안내입니다.',
    summaryEn: 'Stay dry on rainy days with these 3 underground subway-direct complex malls and cultural centers.',
    whyImportantKo: '바다 바람이 강한 부산에서는 비가 올 때 우산이 뒤집히기 쉽고 지상 이동이 불편할 수 있습니다. 지하철 직통 지하상가와 대형 복합몰을 연결하면 날씨에 구애받지 않고 이동하기 수월합니다.',
    whyImportantEn: 'Coastal winds make umbrellas difficult during storms. Subway-integrated malls provide indoor mobility with elevators.',
    actionStepsKo: [
      '코스 1 [센텀시티역]: 신세계백화점 B2F + 스파랜드 온천 + 벡스코 실내 전시장 직결 통로 활용',
      '코스 2 [서면역]: 롯데백화점 부산본점 B1F + 서면 지하상가(대현프리몰) 500m 실내 산책 & 식도락',
      '코스 3 [남포역]: 롯데백화점 광복점 아쿠아몰 분수쇼 + 실내 롯데마트 & 영풍문고 문화 쉼터'
    ],
    actionStepsEn: [
      'Course 1 [Centum Station]: Shinsegae B2 + Spa Land hot springs + BEXCO exhibition halls.',
      'Course 2 [Seomyeon Station]: Lotte Department Store B1 + Seomyeon Underground Mall promenade.',
      'Course 3 [Nampo Station]: Lotte Mall Aqua Mall indoor music fountain show & mega bookstore.'
    ],
    relatedStationId: 'centumcity',
    relatedStationNameKo: '센텀시티역·서면역·남포역',
    relatedStationNameEn: 'Centum, Seomyeon & Nampo',
    relatedExitKo: '각 역 지하 직통 연결구',
    relatedExitEn: 'Direct Underground Portals',
    inspectorNoteKo: '비 오는 날 실내 편의시설(스파랜드 등)을 방문할 경우 혼잡 시간대를 피해 방문하시면 보다 쾌적하게 이용하실 수 있습니다 (운영시간 및 요금 조건은 공식 안내 확인 권장).',
    inspectorNoteEn: 'When visiting indoor facilities like Centum Spa Land on rainy days, off-peak hours offer a more relaxed experience (check official operating hours and fees).',
    defaultHelpfulCount: 153
  },
  {
    id: 'tip-locker-luggage-hacks',
    category: 'SITUATIONAL_ACTION',
    importance: 'TIME_SAVER',
    regionTagKo: '부산 주요 환승역',
    regionTagEn: 'Major Transfer Hubs',
    targetUserKo: '🧳 캐리어 보관 & 얼리체크인',
    targetUserEn: '🧳 Luggage Storage & Early Birds',
    titleKo: '지하철 물품보관함(T-Locker) 만실 시 대체 짐 보관소 찾는 법',
    titleEn: 'Finding Alternative Luggage Storage When Subway T-Lockers Are Full',
    summaryKo: '서면역, 부산역, 해운대역 등 보관함이 가득 찼을 때 대안으로 고려할 수 있는 주변 민간/백화점 보관 서비스 안내입니다 (운영조건은 업체별 공식 안내 확인 권장).',
    summaryEn: 'Guide to alternative luggage storage options, department store cloakrooms, and private bag services (verify terms with operators).',
    whyImportantKo: '주말 오후 서면역과 부산역 지하철 물품보관함은 이용 수요가 집중될 수 있습니다. 주변 백화점 물품보관소나 짐보관 매장을 미리 알아두면 불필요한 이동 시간을 아낄 수 있습니다.',
    whyImportantEn: 'Subway lockers at key hubs frequently see high demand on weekends. Knowing alternative nearby storage options saves time.',
    actionStepsKo: [
      '서면역 만실 시: 롯데백화점 부산본점 안내데스크 옆 물품보관소(영업시간 내 당일 보관 조건 등 사전 확인 필요) 활용 고려',
      '부산역 만실 시: KTX 2층 대합실 짐배송/보관 매장(짐캐리 등) 또는 부산역 인근 민간 짐보관 서비스 확인',
      '해운대역 만실 시: 해운대 관광안내소(구남로 방면) 유료 코인라커 및 주변 편의시설 짐보관 서비스 확인'
    ],
    actionStepsEn: [
      'Seomyeon full: Consider Lotte Department Store customer luggage cloakroom (subject to store operating hours and conditions).',
      'Busan Station full: Check luggage counters (e.g. Zimcarry on KTX 2F) or private storage near the station.',
      'Haeundae full: Check Haeundae Tourist Information Center lockers or nearby partner storage facilities.'
    ],
    relatedStationId: 'seomyeon',
    relatedStationNameKo: '서면역 & 부산역',
    relatedStationNameEn: 'Seomyeon & Busan Stations',
    relatedExitKo: '개찰구 내외 T-라커 구역',
    relatedExitEn: 'T-Locker Concourses',
    inspectorNoteKo: '티머니 물품보관함(T-Locker)은 교통카드, 신용카드, 모바일 결제를 지원하며, 보관 후 영수증의 보관함 번호와 비밀번호를 스마트폰 카메라로 사진 찍어두시면 안전합니다.',
    inspectorNoteEn: 'Always snap a smartphone photo of your locker number and receipt PIN code right after locking.',
    defaultHelpfulCount: 139
  },

  // 4. FIELD Q&A INSIGHTS
  {
    id: 'qna-child-transit-foreigners',
    category: 'FIELD_QNA',
    importance: 'MUST_KNOW',
    regionTagKo: '부산 대중교통 전체',
    regionTagEn: 'Busan Citywide Transit',
    targetUserKo: '👨‍👩‍👧 외국인 & 가족 여행자',
    targetUserEn: '👨‍👩‍👧 Foreigners & Family Travelers',
    titleKo: 'Q. 외국인 또는 타 지역 거주 어린이도 부산 대중교통 무료 혜택을 받나요?',
    titleEn: 'Q. Do foreign or non-resident children get free public transit in Busan?',
    summaryKo: '만 6세~12세 어린이의 경우 등록된 교통카드 사용 시 부산 지하철 및 시내버스 요금 지원 혜택이 적용될 수 있습니다. 노선별 적용 기준 및 세부 조건은 부산시 및 교통공사 최신 공식 안내를 확인하세요.',
    summaryEn: 'Children aged 6-12 using registered transit cards may be eligible for zero-fare benefits on Busan subways and buses. Please check the latest official announcements from Busan City or Busan Transportation Corp for route-specific rules and conditions.',
    whyImportantKo: '어린이 동반 여행 시 교통비를 절약할 수 있는 부산시의 교통 복지 정책입니다. 단, 현금 탑승 시에는 할인이 적용되지 않으며 편의점에서 생년월일을 등록한 카드가 필요합니다. 요금 지원 범위와 세부 기준은 시기 및 노선별 운영 정책에 따라 변동될 수 있으므로 방문 전 공식 안내를 확인하시길 권장합니다.',
    whyImportantEn: 'Helps families save transit expenses. Registration with birthdate at convenience stores is required, and cash fares do not qualify. Fare support policies and applicable lines may be updated, so verifying official notices beforehand is recommended.',
    actionStepsKo: [
      '가까운 편의점(CU, GS25, 세븐일레븐 등)에서 어린이용 교통카드(티머니 또는 캐시비 등)를 구입합니다.',
      '계산대 직원에게 아이의 생년월일(여권 또는 신분증 생년월일)을 제시하며 "어린이 등록"을 요청합니다.',
      '전철 및 버스 탑승 시 단말기에 태그하면 어린이 요금 혜택(0원)이 적용됩니다 (광역급행 2000번 버스 및 동해선 등 제외 노선은 공식 기준 확인 필요).'
    ],
    actionStepsEn: [
      'Buy a transit card (T-Money, Cashbee, etc.) at any convenience store (CU, GS25, 7-Eleven).',
      'Ask the cashier to register the card with the child\'s birthdate (from passport or ID).',
      'Tap the card at subway turnstiles and bus readers to receive the child fare benefit (check excluded routes like intercity express lines).'
    ],
    relatedStationId: 'busan',
    relatedStationNameKo: '전체 지하철역 & 버스',
    relatedStationNameEn: 'All Metro Stations & Buses',
    inspectorNoteKo: '어린이용 카드를 성인이 부정 승차하면 관련 규정에 따라 높은 부가금이 징수되므로 보호자 카드는 별도로 성인 요금으로 태그하셔야 합니다.',
    inspectorNoteEn: 'Adults illegally tapping child cards face severe penalties up to 30x the base fare. Adults must tap separate adult cards.',
    defaultHelpfulCount: 176
  },
  {
    id: 'qna-taxi-stroller-luggage',
    category: 'FIELD_QNA',
    importance: 'LOCAL_SECRET',
    regionTagKo: '부산 택시 호출',
    regionTagEn: 'Busan Taxi Dispatch',
    targetUserKo: '🚕 택시 & 이동 편의',
    targetUserEn: '🚕 Taxi & Ride Hailing',
    titleKo: 'Q. 28인치 대형 캐리어 2개와 접이식 유모차를 일반 택시에 실을 수 있나요?',
    titleEn: 'Q. Can two 28-inch suitcases and a foldable stroller fit in a standard Busan taxi?',
    summaryKo: '28인치 캐리어 1~2개 적재 여부는 차종과 트렁크 구조(LPG 봄베 유무 등)에 따라 달라질 수 있습니다. 28인치 캐리어 2개와 접이식 유모차를 함께 운반한다면 차량별 적재 공간이 다를 수 있으므로 대형 차량(벤티)을 선택하거나 호출 전에 적재 가능 여부를 확인하는 것을 권장합니다.',
    summaryEn: 'Luggage fit for 1-2 large 28-inch suitcases depends on vehicle model and trunk structure (e.g. LPG tank presence). When traveling with two large suitcases and a stroller, choosing a large van (Venti) or checking trunk capacity before dispatch is recommended.',
    whyImportantKo: '공항이나 KTX역에서 택시 탑승 시 트렁크 공간 부족으로 곤란을 겪는 상황을 사전에 방지할 수 있습니다.',
    whyImportantEn: 'Prevents luggage fit issues and delays when dispatching taxis from Gimhae Airport or Busan Station.',
    actionStepsKo: [
      '카카오T 또는 k.ride(외국인 전용) 앱을 이용해 목적지를 지정하고 호출합니다.',
      '수하물이 28인치 2개 이상이거나 유모차가 큰 디럭스형일 경우 일반 세단 택시보다 대형 승합 택시(벤티 등) 선택을 고려하세요.',
      '하차 시 차량 번호와 기사 연락처가 적힌 영수증을 수령하여 분실물 발생에 대비하세요.'
    ],
    actionStepsEn: [
      'Call taxis via Kakao T or k.ride app with automatic GPS pickup.',
      'Select a large van option (such as Venti) if you have multiple large bags plus a bulky stroller.',
      'Collect the printed receipt upon arrival for driver and vehicle identification in case of lost items.'
    ],
    relatedStationId: 'busan',
    relatedStationNameKo: '부산역 & 김해공항',
    relatedStationNameEn: 'Busan Station & Airport',
    inspectorNoteKo: '부산 관내 일반 택시는 통상 트렁크 짐 적재에 대한 별도 추가 요금을 부과하지 않으나, 유료 도로 통행료(광안대교, 부산항대교 등)는 미터기 요금에 합산됩니다. 대형 짐이 많을 경우 기사님과 사전 소통을 권장합니다.',
    inspectorNoteEn: 'Busan taxis generally do not charge extra fees for trunk luggage, while bridge tolls are added directly to the fare. Communicating beforehand for bulky items is advised.',
    defaultHelpfulCount: 121
  }
];

export function CommunityTravelGuideSection({
  language,
  onSelectStation,
  onSwitchToStandard
}: CommunityTravelGuideSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'TRAVELER_TYPE' | 'REGIONAL_HACKS' | 'SITUATIONAL_ACTION' | 'FIELD_QNA'>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedImportance, setSelectedImportance] = useState<string>('ALL');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initialize helpful votes from localStorage or defaults
  useEffect(() => {
    try {
      const savedVotes = localStorage.getItem('stepless_tips_votes');
      const savedVoted = localStorage.getItem('stepless_tips_user_voted');
      if (savedVotes) {
        setHelpfulVotes(JSON.parse(savedVotes));
      } else {
        const initial: Record<string, number> = {};
        CURATED_TIPS_DATA.forEach(item => {
          initial[item.id] = item.defaultHelpfulCount;
        });
        setHelpfulVotes(initial);
      }
      if (savedVoted) {
        setVotedMap(JSON.parse(savedVoted));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  const handleVote = (tipId: string) => {
    if (votedMap[tipId]) return;

    const newVotes = {
      ...helpfulVotes,
      [tipId]: (helpfulVotes[tipId] || 0) + 1
    };
    const newVoted = {
      ...votedMap,
      [tipId]: true
    };

    setHelpfulVotes(newVotes);
    setVotedMap(newVoted);

    try {
      localStorage.setItem('stepless_tips_votes', JSON.stringify(newVotes));
      localStorage.setItem('stepless_tips_user_voted', JSON.stringify(newVoted));
    } catch (e) {
      // ignore
    }
  };

  const handleShareTip = (tip: CuratedTipItem) => {
    const textToCopy = `[Stepless Busan Tip] ${language === 'KR' ? tip.titleKo : tip.titleEn}\n${language === 'KR' ? tip.summaryKo : tip.summaryEn}\nhttps://steplessinkorea.com/tips`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(tip.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filteredTips = CURATED_TIPS_DATA.filter(tip => {
    if (selectedCategory !== 'ALL' && tip.category !== selectedCategory) {
      return false;
    }
    if (selectedImportance !== 'ALL' && tip.importance !== selectedImportance) {
      return false;
    }
    if (searchKeyword.trim().length > 0) {
      const q = searchKeyword.toLowerCase();
      const matchKo = tip.titleKo.toLowerCase().includes(q) ||
        tip.summaryKo.toLowerCase().includes(q) ||
        tip.regionTagKo.toLowerCase().includes(q) ||
        tip.targetUserKo.toLowerCase().includes(q) ||
        tip.actionStepsKo.some(s => s.toLowerCase().includes(q));
      const matchEn = tip.titleEn.toLowerCase().includes(q) ||
        tip.summaryEn.toLowerCase().includes(q) ||
        tip.regionTagEn.toLowerCase().includes(q) ||
        tip.targetUserEn.toLowerCase().includes(q) ||
        tip.actionStepsEn.some(s => s.toLowerCase().includes(q));
      return matchKo || matchEn;
    }
    return true;
  });

  const getImportanceBadge = (importance: CuratedTipItem['importance']) => {
    switch (importance) {
      case 'MUST_KNOW':
        return {
          label: language === 'KR' ? '필수 숙지' : 'Must Know',
          bg: 'bg-rose-50 text-rose-700 border-rose-200'
        };
      case 'LOCAL_SECRET':
        return {
          label: language === 'KR' ? '로컬 시크릿' : 'Local Secret',
          bg: 'bg-purple-50 text-purple-700 border-purple-200'
        };
      case 'SAFETY_FIRST':
        return {
          label: language === 'KR' ? '안전 최우선' : 'Safety First',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      case 'TIME_SAVER':
        return {
          label: language === 'KR' ? '시간 절약' : 'Time Saver',
          bg: 'bg-amber-50 text-amber-800 border-amber-200'
        };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left font-sans" id="community-travel-guide-container">
      
      {/* 1. HERO CURATION BANNER */}
      <div className="bg-gradient-to-br from-[#003366] via-[#004481] to-[#0A2540] text-white p-6 sm:p-8 rounded-3xl shadow-sm border border-blue-900/40 relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-300/30 rounded-full text-2xs sm:text-xs font-black tracking-wide flex items-center gap-1.5 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'KR' ? 'Stepless 독점 큐레이션' : 'Stepless Exclusive Curation'}</span>
            </span>
            <span className="px-2.5 py-0.5 bg-white/10 text-white/80 rounded-full text-2xs font-semibold">
              {language === 'KR' ? '현장 및 공식 정보 기반 가이드' : 'Field & Official Policy Guide'}
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
            {language === 'KR' 
              ? '여행자를 위한 실전 행동 수칙 & 현장 큐레이션' 
              : 'Actionable Field Hacks & Decision Curation'}
          </h2>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
            {language === 'KR'
              ? '단순한 단편 질문 나열을 넘어, 유모차·휠체어·대형 캐리어 여행자가 부산 현장에서 겪는 턱, 혼잡, 이동 문제를 즉각 해결할 수 있도록 현장 인프라와 공식 정보를 종합해 정리한 핵심 행동 수칙입니다.'
              : 'Moving beyond raw Q&A feeds into structured, actionable travel intelligence for strollers, wheelchairs, and heavy luggage navigators.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-2xs text-blue-200/80 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {language === 'KR' ? '현장 및 공식 정책 검증' : 'Field & Policy Verified'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              {language === 'KR' ? '지하철 직결 동선 검증' : 'Direct Subway Line Verified'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-sky-300" />
              {language === 'KR' ? '실시간 역 출구 연계' : 'Live Exit Integration'}
            </span>
          </div>
        </div>

        {/* Decorative Watermark Icon */}
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none hidden md:block">
          <Compass className="w-48 h-48 text-white" />
        </div>
      </div>

      {/* 2. FILTER CONTROLS & SEARCH */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        {/* Category Pill Switcher */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border min-h-[38px] ${
              selectedCategory === 'ALL'
                ? 'bg-[#004481] text-white border-[#004481] shadow-2xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {language === 'KR' ? '전체 큐레이션' : 'All Curations'} ({CURATED_TIPS_DATA.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('TRAVELER_TYPE')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border min-h-[38px] flex items-center gap-1.5 ${
              selectedCategory === 'TRAVELER_TYPE'
                ? 'bg-[#004481] text-white border-[#004481] shadow-2xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{language === 'KR' ? '👥 여행자 유형별' : '👥 By Traveler Type'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('REGIONAL_HACKS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border min-h-[38px] flex items-center gap-1.5 ${
              selectedCategory === 'REGIONAL_HACKS'
                ? 'bg-[#004481] text-white border-[#004481] shadow-2xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{language === 'KR' ? '📍 권역별 알짜 노하우' : '📍 Regional Hacks'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('SITUATIONAL_ACTION')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border min-h-[38px] flex items-center gap-1.5 ${
              selectedCategory === 'SITUATIONAL_ACTION'
                ? 'bg-[#004481] text-white border-[#004481] shadow-2xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Umbrella className="w-3.5 h-3.5" />
            <span>{language === 'KR' ? '💡 상황별 행동수칙' : '💡 Situational Rules'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('FIELD_QNA')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border min-h-[38px] flex items-center gap-1.5 ${
              selectedCategory === 'FIELD_QNA'
                ? 'bg-[#004481] text-white border-[#004481] shadow-2xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{language === 'KR' ? '❓ 현장 검증 Q&A' : '❓ Verified Q&A'}</span>
          </button>
        </div>

        {/* Search & Sub-Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-150">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder={language === 'KR' ? '키워드로 실전 팁 검색 (예: 유모차, 서면역, 비 오는 날, 캐리어...)' : 'Search tips (e.g., stroller, luggage, rain, taxi...)'}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004481]/20 focus:border-[#004481] transition-all font-medium"
            />
            {searchKeyword && (
              <button
                type="button"
                onClick={() => setSearchKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-2xs font-bold text-slate-400">
              {language === 'KR' ? '중요도:' : 'Level:'}
            </span>
            <select
              value={selectedImportance}
              onChange={(e) => setSelectedImportance(e.target.value)}
              className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#004481]/20"
            >
              <option value="ALL">{language === 'KR' ? '전체 등급' : 'All Levels'}</option>
              <option value="MUST_KNOW">{language === 'KR' ? '필수 숙지' : 'Must Know'}</option>
              <option value="LOCAL_SECRET">{language === 'KR' ? '로컬 시크릿' : 'Local Secret'}</option>
              <option value="SAFETY_FIRST">{language === 'KR' ? '안전 최우선' : 'Safety First'}</option>
              <option value="TIME_SAVER">{language === 'KR' ? '시간 절약' : 'Time Saver'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. CURATED TIPS LIST */}
      <div className="space-y-5">
        {filteredTips.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <div className="text-4xl">🔍</div>
            <h3 className="text-base font-extrabold text-slate-800">
              {language === 'KR' ? '검색 조건과 일치하는 팁이 없습니다' : 'No matching curated tips found'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'KR' ? '다른 검색어를 입력하시거나 필터를 초기화해 보세요.' : 'Try adjusting your search keyword or reset filters.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedImportance('ALL');
                setSearchKeyword('');
              }}
              className="px-4 py-2 bg-[#004481] text-white rounded-xl text-xs font-bold shadow-2xs hover:bg-[#003366] transition-all"
            >
              {language === 'KR' ? '필터 초기화' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          filteredTips.map((tip) => {
            const importanceBadge = getImportanceBadge(tip.importance);
            const votes = helpfulVotes[tip.id] || tip.defaultHelpfulCount;
            const hasVoted = votedMap[tip.id];

            return (
              <div
                key={tip.id}
                id={`curated-tip-card-${tip.id}`}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all p-5 sm:p-7 space-y-5"
              >
                {/* Card Top Badges & Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Importance Badge */}
                    <span className={`px-2.5 py-0.5 rounded-md text-2xs font-black border ${importanceBadge.bg}`}>
                      {importanceBadge.label}
                    </span>

                    {/* Target User Tag */}
                    <span className="px-2.5 py-0.5 rounded-md text-2xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {language === 'KR' ? tip.targetUserKo : tip.targetUserEn}
                    </span>

                    {/* Region Tag */}
                    <span className="px-2.5 py-0.5 rounded-md text-2xs font-bold bg-blue-50 text-[#004481] border border-blue-100 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#004481]" />
                      <span>{language === 'KR' ? tip.regionTagKo : tip.regionTagEn}</span>
                    </span>
                  </div>

                  {/* Share / Copy Button */}
                  <button
                    type="button"
                    onClick={() => handleShareTip(tip)}
                    className="text-2xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200"
                    title={language === 'KR' ? '이 팁 복사/공유' : 'Share / Copy Tip'}
                  >
                    {copiedId === tip.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">{language === 'KR' ? '복사됨!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3 h-3 text-slate-400" />
                        <span>{language === 'KR' ? '공유' : 'Share'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Title & Summary */}
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                    {language === 'KR' ? tip.titleKo : tip.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {language === 'KR' ? tip.summaryKo : tip.summaryEn}
                  </p>
                </div>

                {/* Why This is Important Callout */}
                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                    <Info className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{language === 'KR' ? '💡 왜 중요한가요? (여행자 핵심 포인트)' : '💡 Why is this crucial for travelers?'}</span>
                  </div>
                  <p className="text-xs text-amber-950/90 leading-relaxed font-normal pl-5">
                    {language === 'KR' ? tip.whyImportantKo : tip.whyImportantEn}
                  </p>
                </div>

                {/* Step-by-Step Action Guide */}
                <div className="space-y-2.5 pt-1">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#004481]"></span>
                    <span>{language === 'KR' ? '현장 실전 행동 수칙 3단계' : '3-Step Field Action Guide'}</span>
                  </h4>

                  <div className="grid grid-cols-1 gap-2">
                    {(language === 'KR' ? tip.actionStepsKo : tip.actionStepsEn).map((step, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-700"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#004481] text-white flex items-center justify-center text-2xs font-black shrink-0 mt-0.5 shadow-3xs">
                          {sIdx + 1}
                        </span>
                        <span className="font-semibold leading-relaxed pt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Station Link & Inspector Note Bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {/* Related Station Integration */}
                  {tip.relatedStationId && (
                    <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-2xs font-bold text-blue-600 block">
                          {language === 'KR' ? '연계 지하철역 및 출구' : 'Connected Station & Exit'}
                        </span>
                        <span className="text-xs font-black text-slate-900 block">
                          {language === 'KR' ? tip.relatedStationNameKo : tip.relatedStationNameEn}
                        </span>
                        <span className="text-2xs text-slate-500 font-medium">
                          {language === 'KR' ? tip.relatedExitKo : tip.relatedExitEn}
                        </span>
                      </div>

                      {onSelectStation && tip.relatedStationId && (
                        <button
                          type="button"
                          onClick={() => onSelectStation(tip.relatedStationId!)}
                          className="px-3 py-2 bg-[#004481] hover:bg-[#003366] text-white text-2xs font-black rounded-xl transition-all shadow-2xs flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <span>{language === 'KR' ? '역 출구 보기' : 'View Exits'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Inspector Memo */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-2.5">
                    <span className="text-base shrink-0 mt-0.5">📝</span>
                    <div className="space-y-0.5 text-2xs text-slate-600 leading-relaxed font-medium">
                      <span className="font-bold text-slate-800 block">
                        {language === 'KR' ? 'Stepless 로컬 현장 가이드 메모' : 'Stepless Local Field Notes'}
                      </span>
                      <p>{language === 'KR' ? tip.inspectorNoteKo : tip.inspectorNoteEn}</p>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Helpful Feedback Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
                  <span className="font-medium">
                    {language === 'KR' ? '이 정보가 실제 여행 계획에 도움이 되었나요?' : 'Was this curation helpful for your trip?'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleVote(tip.id)}
                    disabled={hasVoted}
                    className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      hasVoted
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 cursor-default'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-3xs'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'text-emerald-600 fill-emerald-600' : 'text-slate-400'}`} />
                    <span>{language === 'KR' ? '도움돼요' : 'Helpful'}</span>
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.2 rounded-md ml-0.5 text-2xs">
                      {votes}
                    </span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. FOOTER NOTE & SWITCH TO STANDARD VIEW */}
      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1 text-center sm:text-left">
          <p className="font-bold text-slate-800">
            {language === 'KR' ? '더 많은 현지 여행자와 자유롭게 이야기하고 싶으신가요?' : 'Want to chat with other travelers freely?'}
          </p>
          <p className="text-slate-500 text-2xs">
            {language === 'KR' 
              ? '기본 여행 팁 탭에서 Reddit 커뮤니티 링크와 현장 게시판을 확인하실 수 있습니다.' 
              : 'Switch to the Standard view to access our Reddit community and forum.'}
          </p>
        </div>

        {onSwitchToStandard && (
          <button
            type="button"
            onClick={onSwitchToStandard}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl border border-slate-200 transition-colors shadow-3xs whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            <span>{language === 'KR' ? '기본 여행 팁 탭으로 이동' : 'Switch to Standard Tab'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
