import React from 'react';

export interface NearbyPlaceExit {
  num: string;
  type: 'elevator' | 'escalator' | 'both';
}

export interface NearbyPlace {
  name: string;
  desc: string;
  exits?: NearbyPlaceExit[];
}

export const STATION_PLACES_DATA: Record<string, Record<'KR' | 'EN', NearbyPlace[]>> = {
  seomyeon: {
    KR: [
      { name: '✨ 서면 젊음의 거리', desc: '문화 행사, 맛집, 분위기 좋은 카페 등 즐길 거리가 가득한 중심가', exits: [{ num: '7', type: 'elevator' }] },
      { name: '🏢 삼정타워', desc: '다채로운 이색 맛집, 오락 시설, 영화관을 품은 복합 문화 몰', exits: [{ num: '1', type: 'escalator' }] }
    ],
    EN: [
      { name: '✨ Seomyeon Youth Street', desc: 'Vibrant center filled with various restaurants, cafes, and shopping spots', exits: [{ num: '7', type: 'elevator' }] },
      { name: '🏢 Samjung Tower', desc: 'A multi-complex lifestyle mall featuring dining, entertainment, and a cinema', exits: [{ num: '1', type: 'escalator' }] }
    ]
  },
  jeonpo: {
    KR: [
      { name: '☕ 전포 카페거리', desc: '감성 가득한 도심형 카페 밀집 거리', exits: [{ num: '7', type: 'escalator' }] },
      { name: '🎨 전포 사잇길', desc: '유니크한 골목 편집숍과 공방 가득', exits: [{ num: '4', type: 'elevator' }, { num: '8', type: 'escalator' }] }
    ],
    EN: [
      { name: '☕ Jeonpo Cafe Street', desc: 'Cozy, design-first artisanal coffee shops', exits: [{ num: '7', type: 'escalator' }] },
      { name: '🎨 Jeonpo Goods Alley (Saetgil)', desc: 'Charming boutiques & stationery shops', exits: [{ num: '4', type: 'elevator' }, { num: '8', type: 'escalator' }] }
    ]
  },
  bujeon: {
    KR: [
      { name: '🥬 부전 전통시장', desc: '전통 먹거리와 제철 농수산물이 가득한 대표 시장', exits: [{ num: '부전몰 3', type: 'escalator' }, { num: '부전몰 5', type: 'escalator' }] },
      { name: '🌳 송상현광장', desc: '산책과 휴식을 즐길 수 있는 도심 속 대표 잔디 광장', exits: [{ num: '6', type: 'elevator' }] }
    ],
    EN: [
      { name: '🥬 Bujeon Traditional Market', desc: 'Bustling local traditional market full of local food & produce', exits: [{ num: 'bujeon 3', type: 'escalator' }, { num: 'bujeon 5', type: 'escalator' }] },
      { name: '🌳 Songsanghyeon Square', desc: 'A spacious, beautiful public plaza for relaxation', exits: [{ num: '6', type: 'elevator' }] }
    ]
  },
  haeundae: {
    KR: [
      { name: '🏖️ 해운대 해수욕장', desc: '인기 해변과 화려한 도심의 조화', exits: [{ num: '5', type: 'elevator' }, { num: '7', type: 'elevator' }] },
      { name: '🍢 해운대 전통시장', desc: '각종 꼼장어, 떡볶이 등 길거리 야식골목', exits: [{ num: '5', type: 'elevator' }, { num: '7', type: 'elevator' }] }
    ],
    EN: [
      { name: '🏖️ Haeundae Beach', desc: 'Nationally famous sandy oceanfront', exits: [{ num: '5', type: 'elevator' }, { num: '7', type: 'elevator' }] },
      { name: '🍢 Haeundae Market', desc: 'Street snacks, seafood & vibrant local food', exits: [{ num: '5', type: 'elevator' }, { num: '7', type: 'elevator' }] }
    ]
  },
  gwangan: {
    KR: [
      { name: '🌉 광안리 해수욕장', desc: '밤바다 광안대교 야경 산책 코스', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] },
      { name: '☕ 오션뷰 카페거리', desc: '푸른 해안 통창을 마주 보는 인기 카페들', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] }
    ],
    EN: [
      { name: '🌉 Gwangalli Beach', desc: 'Beautiful waves with the iconic bridge view', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] },
      { name: '☕ Ocean View Cafe Street', desc: 'High-front cafes facing Gwangalli waters', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] }
    ]
  },
  nampo: {
    KR: [
      { name: '🗼 용두산공원', desc: '부산타워 전망대에서 만나는 도심과 항구', exits: [{ num: '7', type: 'elevator' }] },
      { name: '🌉 영도대교 걷기', desc: '지상 평탄 보도길 연계', exits: [{ num: '6', type: 'escalator' }, { num: '8', type: 'both' }] }
    ],
    EN: [
      { name: '🗼 Yongdusan Park', desc: 'Scenic hilltop with Busan Diamond Tower', exits: [{ num: '7', type: 'elevator' }] },
      { name: '🌉 Yeongdodaegyo Bridge Walk', desc: 'Scenic coastal path overlooking the harbor', exits: [{ num: '6', type: 'escalator' }, { num: '8', type: 'both' }] }
    ]
  },
  busan: {
    KR: [
      { name: '🍕 이재모피자 & 🇨🇳 차이나타운', desc: '부산의 명물 이재모피자와 맛있는 중식 만두를 즐길 수 있는 이색 특화 거리', exits: [{ num: '5', type: 'elevator' }] }
    ],
    EN: [
      { name: '🍕 Lee Jae Mo Pizza & 🇨🇳 Chinatown', desc: "Enjoy Busan's legendary pizza alongside delicious authentic Chinese dumplings on this unique cultural street", exits: [{ num: '5', type: 'elevator' }] }
    ]
  },
  suyeong: {
    KR: [
      { name: '🌾 수영사적공원', desc: '고즈넉한 역사 유적지와 오래된 거목 공원', exits: [{ num: '1', type: 'elevator' }] }
    ],
    EN: [
      { name: '🌾 Suyeong Sajeok Park', desc: 'Shaded historical site with giant ancient trees', exits: [{ num: '1', type: 'elevator' }] }
    ]
  },
  jagalchi: {
    KR: [
      { name: '🗼 부산자갈치시장 전망대', desc: '남포지하쇼핑센터 6번 출구 및 남포역 2번출구로 갈 수 있는 탁 트인 오션뷰 야외 전망대', exits: [{ num: '남포지하 6', type: 'escalator' }, { num: '남포역 2', type: 'escalator' }] },
      { name: '🎬 국제시장 & BIFF광장', desc: '먹거리 씨앗호떡과 생활 잡화 미로 정취', exits: [{ num: '3', type: 'elevator' }] }
    ],
    EN: [
      { name: '🗼 Busan Jagalchi Market Observatory', desc: 'An open outdoor rooftop observatory overlooking the port, accessible via Nampo Shopping Mall Exit 6 and Nampo Station Exit 2', exits: [{ num: 'nampomall 6', type: 'escalator' }, { num: 'nampostn 2', type: 'escalator' }] },
      { name: '🎬 Gukje Market & BIFF Sq.', desc: 'Sweet Hotteok stalls & classic alleys', exits: [{ num: '3', type: 'elevator' }] }
    ]
  },
  geumnyeonsan: {
    KR: [
      { name: '🏖️ 광안리 해수욕장 남측', desc: '조용한 해상 산책로 및 남천동 빵천동 디저트거리', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] }
    ],
    EN: [
      { name: '🏖️ South Gwangalli Beach & Namcheon Bakery Alley', desc: 'Tranquil southern beach area & famous dessert street', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] }
    ]
  },
  dongbaek: {
    KR: [
      { name: '🌺 동백섬 & 누리마루 APEC하우스', desc: '해안 산책로와 동백꽃이 어우러진 해운대 대표 명소', exits: [{ num: '1', type: 'elevator' }] }
    ],
    EN: [
      { name: '🌺 Dongbaekseom Island & Nurimaru APEC House', desc: 'Scenic coastal walking trails & APEC house', exits: [{ num: '1', type: 'elevator' }] }
    ]
  },
  bexco: {
    KR: [
      { name: '🏛️ 벡스코 (BEXCO)', desc: '전시, 박람회, 대형 공연이 열리는 종합 컨벤션 공간', exits: [{ num: '7', type: 'elevator' }, { num: '9', type: 'elevator' }] },
      { name: '🖼️ 부산시립미술관', desc: '다채로운 현대 미술 전시와 조각 공원', exits: [{ num: '5', type: 'elevator' }] }
    ],
    EN: [
      { name: '🏛️ BEXCO Exhibition & Convention Center', desc: 'Major international exhibition & event space', exits: [{ num: '7', type: 'elevator' }, { num: '9', type: 'elevator' }] },
      { name: '🖼️ Busan Museum of Art', desc: 'Contemporary art exhibitions & outdoor park', exits: [{ num: '5', type: 'elevator' }] }
    ]
  },
  jungang: {
    KR: [
      { name: '📜 40계단 문화관광테마거리', desc: '한국전쟁 피란민의 삶과 아련한 추억이 서린 역사 문화거리', exits: [{ num: '14', type: 'elevator' }] },
      { name: '🏢 부산무역회관 & 중앙동 인쇄골목', desc: '고즈넉한 오피스 상권과 맛깔난 로컬 백반집 골목', exits: [{ num: '14', type: 'elevator' }, { num: '10', type: 'elevator' }] }
    ],
    EN: [
      { name: '📜 40 Steps Cultural Street', desc: 'Historic street depicting Korean War refugee memories and cultural spots', exits: [{ num: '14', type: 'elevator' }] },
      { name: '🏢 Busan Trade Center & Printing Alley', desc: 'Local office district with rich food alleys & historic print shops', exits: [{ num: '14', type: 'elevator' }, { num: '10', type: 'elevator' }] }
    ]
  },
  dadaepo: {
    KR: [
      { name: '🌅 다대포해수욕장 & 꿈의 낙조분수', desc: '노을이 환상적인 백사장과 세계 최대 규모 음악 분수쇼', exits: [{ num: '1', type: 'elevator' }] },
      { name: '🌾 고우니 생태길 & 몰운대', desc: '단차 없는 평탄 데크길 산책로와 원형 보존된 해안 산책길', exits: [{ num: '1', type: 'elevator' }, { num: '2', type: 'elevator' }] }
    ],
    EN: [
      { name: '🌅 Dadaepo Beach & Sunset Fountain', desc: 'Breathtaking sunset views & world-renowned musical fountain show', exits: [{ num: '1', type: 'elevator' }] },
      { name: '🌾 Gouni Ecological Trail & Morundae', desc: 'Barrier-free wooden boardwalks over coastal wetlands', exits: [{ num: '1', type: 'elevator' }, { num: '2', type: 'elevator' }] }
    ]
  },
  beomeosa: {
    KR: [
      { name: '⛩️ 범어사 (금정산 천년고찰)', desc: '90번 버스 환승 연계로 이어지는 부산 대표 역사 사찰', exits: [{ num: '5', type: 'elevator' }, { num: '7', type: 'elevator' }] },
      { name: '⛰️ 금정산 등산로 & 청룡동 먹거리마을', desc: '산뜻한 숲길 보도와 힐링 백숙 맛집 골목', exits: [{ num: '5', type: 'elevator' }] }
    ],
    EN: [
      { name: '⛩️ Beomeosa Temple', desc: 'Ancient Thousand-Year Temple nestled in Mt. Geumjeongsan (Bus 90 Transfer)', exits: [{ num: '5', type: 'elevator' }, { num: '7', type: 'elevator' }] },
      { name: '⛰️ Mt. Geumjeongsan Trails & Cheongryong Village', desc: 'Scenic mountain trails and traditional dining spots', exits: [{ num: '5', type: 'elevator' }] }
    ]
  },
  'centum-city': {
    KR: [
      { name: '🏬 신세계백화점 센텀시티점 & 스파랜드', desc: '지하 1층 대합실 연결통로 직결 및 10·12번 출구 지상 엘리베이터 완비', exits: [{ num: '10·12', type: 'elevator' }] },
      { name: '🎬 영화의전당 & 🖼️ 뮤지엄원 / 부산시립미술관', desc: '부산국제영화제 야외극장과 미디어아트 전시관 (벡스코·시립미술관은 1번 출구 평지 연계)', exits: [{ num: '1', type: 'elevator' }, { num: '3·5', type: 'elevator' }] }
    ],
    EN: [
      { name: '🏬 Shinsegae Centum City & Spa Land', desc: 'Connected directly underground + street elevator between Exits 10 & 12', exits: [{ num: '10·12', type: 'elevator' }] },
      { name: '🎬 Busan Cinema Center & 🖼️ Museum 1 / Museum of Art', desc: 'BIFF landmark theater & media art museum (flat walk from Exit 1 to BEXCO & Museum of Art)', exits: [{ num: '1', type: 'elevator' }, { num: '3·5', type: 'elevator' }] }
    ]
  },
  sasang: {
    KR: [
      { name: '✈️ 김해국제공항 환승 & 부산서부버스터미널', desc: '실내 환승통로로 공항경전철 연결 및 3·4번 출구 엘리베이터로 버스터미널 평지 이동', exits: [{ num: '경전철 1', type: 'both' }, { num: '3', type: 'elevator' }, { num: '4', type: 'elevator' }] },
      { name: '🌸 삼락생태공원', desc: '낙동강변 광활한 평지 산책로와 계절 꽃단지 (경전철 2번 출구·르네시떼역 연계)', exits: [{ num: '경전철 2', type: 'both' }] }
    ],
    EN: [
      { name: '✈️ Gimhae Airport LRT & West Busan Bus Terminal', desc: 'Step-free transfer to Gimhae Airport Light Rail & Exits 3/4 elevators to Bus Terminal', exits: [{ num: 'LRT 1', type: 'both' }, { num: '3', type: 'elevator' }, { num: '4', type: 'elevator' }] },
      { name: '🌸 Samnak Ecological Park', desc: 'Expansive flat riverside park and seasonal flower trails along the Nakdong River', exits: [{ num: 'LRT 2', type: 'both' }] }
    ]
  },
  toseong: {
    KR: [
      { name: '🎨 감천문화마을 (마을버스 환승)', desc: '4·6번 사이 엘리베이터 하차 후 평지 이동 → 부산대병원 앞(6번 출구) 서구2·서구2-2·사하구1-1 탑승', exits: [{ num: '4·6', type: 'elevator' }] },
      { name: '🏛️ 임시수도기념거리 & 동아대 부민캠퍼스', desc: '한국전쟁 당시 대통령 관저(임시수도기념관)와 원도심 역사 문화거리', exits: [{ num: '5', type: 'elevator' }] }
    ],
    EN: [
      { name: '🎨 Gamcheon Culture Village (Bus Transfer)', desc: 'Take Exit 4·6 elevator to street level → walk 1 min flat to Exit 6 Hospital bus stop for Bus Seo-gu 2 / 2-2', exits: [{ num: '4·6', type: 'elevator' }] },
      { name: '🏛️ Provisional Capital Memorial Street', desc: 'Historic Korean War presidential residence and heritage neighborhood', exits: [{ num: '5', type: 'elevator' }] }
    ]
  },
  osiria: {
    KR: [
      { name: '🎢 롯데월드 어드벤처 부산 & 스카이라인 루지', desc: '3번 출구 앞 전용 보행육교(엘리베이터 완비)로 도로 횡단 없이 안전하게 직결되는 테마파크', exits: [{ num: '3번 평지출구 + 육교EV', type: 'elevator' }] },
      { name: '🔬 국립부산과학관 & ⛩️ 해동용궁사·해광사 용왕단', desc: '가족 체험 과학관 및 기장 해안 절경 사찰 (1번 출구 버스·택시 환승 광장 연계)', exits: [{ num: '1번 평지출구', type: 'both' }] }
    ],
    EN: [
      { name: '🎢 Lotte World Adventure Busan & Skyline Luge', desc: 'Major theme park connected safely via Exit 3 pedestrian bridge with elevators', exits: [{ num: 'Exit 3 Flat + Overpass EV', type: 'elevator' }] },
      { name: '🔬 National Science Museum & ⛩️ Haedong Yonggungsa', desc: 'Interactive family science museum and seaside temples (Exit 1 bus/taxi plaza)', exits: [{ num: 'Exit 1 (Flat)', type: 'both' }] }
    ]
  },
  songjeong: {
    KR: [
      { name: '🚂 해운대 블루라인파크 송정정거장 (해변열차)', desc: '미포~청사포~송정을 잇는 무장애 해변열차 출발역 (2번 출구 평지 도보 약 8분)', exits: [{ num: '2', type: 'both' }] },
      { name: '🏖️ 송정해수욕장 & 죽도공원', desc: '완만한 백사장 평지 산책로와 서핑 해변, 바다 전망 카페거리', exits: [{ num: '1', type: 'both' }, { num: '2', type: 'both' }] }
    ],
    EN: [
      { name: '🚂 Haeundae Blueline Park Songjeong Stn (Beach Train)', desc: 'Terminal station of the coastal Beach Train (8-min flat walk from Exit 2)', exits: [{ num: '2', type: 'both' }] },
      { name: '🏖️ Songjeong Beach & Jukdo Park', desc: 'Gentle sandy beachfront promenade, surfing bay & oceanfront cafes', exits: [{ num: '1', type: 'both' }, { num: '2', type: 'both' }] }
    ]
  },
  namcheon: {
    KR: [
      { name: '🥐 남천동 빵천동 (베이커리 투어 거리)', desc: '부산 3대 빵집부터 개성 넘치는 로컬 베이커리·디저트 카페가 밀집한 평지 골목', exits: [{ num: '1·3', type: 'elevator' }] },
      { name: '🌸 광안리 해변 남단 & 삼익비치 산책로', desc: '남천해변시장과 광안대교를 가장 가까이서 마주하는 여유로운 해안 평지 산책길', exits: [{ num: '1·3', type: 'elevator' }] }
    ],
    EN: [
      { name: '🥐 Namcheon Bakery Street ("Ppangcheon-dong")', desc: "Flat neighborhood alleys famous for Busan's top artisan bakeries and dessert cafes", exits: [{ num: '1·3', type: 'elevator' }] },
      { name: '🌸 South Gwangalli Beach & Samik Beach Walk', desc: 'Peaceful coastal promenade right beside Gwangandaegyo Bridge', exits: [{ num: '1·3', type: 'elevator' }] }
    ]
  },
  oncheonjang: {
    KR: [
      { name: '♨️ 동래온천 노천족욕탕 & 허심청 / 금강공원', desc: '보행육교 엘리베이터로 큰 길을 안전하게 건너 만나는 천년 온천 스파와 케이블카 공원', exits: [{ num: '보행육교', type: 'both' }, { num: '3·7', type: 'both' }] },
      { name: '🌸 온천천 수변 산책로 & 카페거리', desc: '사계절 평탄하게 걷기 좋은 온천천 산책길 (3·7번 엘리베이터 및 2·4번 출구 연계)', exits: [{ num: '3·7', type: 'both' }, { num: '2·4번 (경사로)', type: 'escalator' }] }
    ],
    EN: [
      { name: '♨️ Dongnae Hot Spring Footbath & Hurshimchung / Geumgang Park', desc: 'Cross safely via the station overpass elevator to historic mineral hot springs and cable car park', exits: [{ num: 'Overpass', type: 'both' }, { num: '3·7', type: 'both' }] },
      { name: '🌸 Oncheoncheon Stream Trail & Cafe Street', desc: 'Flat riverside walking trail right beside Exits 2, 3, 4 & 7', exits: [{ num: '3·7', type: 'both' }, { num: 'Exits 2·4 (Ramp)', type: 'escalator' }] }
    ]
  }
};


export const getNearbyPlaces = (stationId: string, lang: 'KR' | 'EN'): NearbyPlace[] => {
  return STATION_PLACES_DATA[stationId]?.[lang] || [];
};

export const NearbyExitBadge = ({ num, type, line, language }: { num: string; type: 'elevator' | 'escalator' | 'both'; line: string; language: 'KR' | 'EN'; key?: any }) => {
  let accentColor = '#F06A00'; // default 1 line (orange)
  let borderColorClass = 'border-[#F06A00]/70 text-[#F06A00]';

  if (line === '2') {
    accentColor = '#1b6d24';
    borderColorClass = 'border-[#1b6d24]/70 text-[#1b6d24]';
  } else if (line === '3') {
    accentColor = '#906A3B';
    borderColorClass = 'border-[#906A3B]/70 text-[#906A3B]';
  } else if (line === '동해') {
    accentColor = '#004960';
    borderColorClass = 'border-[#004960]/70 text-[#004960]';
  } else if (line === '김해' || num.includes('경전철') || num.includes('LRT')) {
    accentColor = '#804796';
    borderColorClass = 'border-[#804796]/70 text-[#804796]';
  }

  let iconSvg = null;
  if (type === 'elevator') {
    iconSvg = (
      <svg viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[11px] h-[11px] flex-shrink-0">
        <rect x="3" y="3" width="18" height="18" rx="2.5" />
        <path d="M 7.5 10 L 9.5 7 L 11.5 10 Z" fill={accentColor} stroke="none" />
        <path d="M 7.5 14 L 9.5 17 L 11.5 14 Z" fill={accentColor} stroke="none" />
        <line x1="14.5" y1="3" x2="14.5" y2="21" strokeDasharray="2 2" strokeWidth="1.5" />
        <path d="M 14.5 12 L 17.5 12" />
        <path d="M 17.5 12 L 16 10.5" />
        <path d="M 17.5 12 L 16 13.5" />
      </svg>
    );
  } else if (type === 'escalator') {
    iconSvg = (
      <svg viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="w-[11px] h-[11px] flex-shrink-0">
        <circle cx="10" cy="7.5" r="1.8" fill={accentColor} stroke="none" />
        <path d="M 10 10.2 L 10 14" stroke={accentColor} strokeWidth="2.5" />
        <path d="M 3.5 19.5 L 7.5 19.5 C 9.5 19.5, 10.5 18, 12 15.5 L 15.5 10 C 17 8, 18 7, 20.5 7 L 22.5 7" />
      </svg>
    );
  } else if (type === 'both') {
    iconSvg = (
      <div className="flex items-center gap-[1px] flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[11px] h-[11px]">
          <rect x="3" y="3" width="18" height="18" rx="2.5" />
          <path d="M 7.5 10 L 9.5 7 L 11.5 10 Z" fill={accentColor} stroke="none" />
          <line x1="14.5" y1="3" x2="14.5" y2="21" strokeDasharray="2 2" strokeWidth="1.5" />
          <path d="M 14.5 12 L 17.5 12" />
        </svg>
        <svg viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="w-[11px] h-[11px]">
          <path d="M 3.5 19.5 L 7.5 19.5 L 7.5 15.5 L 11.5 15.5 L 11.5 11.5 L 15.5 11.5 L 15.5 7.5 L 20.5 7.5" />
        </svg>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10.5px] font-bold bg-white/90 shadow-2xs ${borderColorClass}`}>
      {iconSvg}
      <span>{(/\d/.test(num) && !num.includes('출구') && !num.includes('Exit') && !num.includes('경사로')) ? `${num}${language === 'KR' ? '번 출구' : ' Exit'}` : num}</span>
    </span>
  );
};
