export type Language = 'KR' | 'EN';

export const DICTIONARY = {
  KR: {
    brand: 'STEPLESS IN KOREA',
    nav: {
      home: '홈',
      search: '출구 정보 및 역 검색',
      tips: '여행 팁',
      about: '사이트 소개',
    },
    hero: {
      eyebrow: '부산 로컬 가이드',
      title: '나만의 부산 여행',
      subtitle: '계단과 턱 걱정 없이, 로컬이 추천하는 부산의 진짜 매력을 한눈에 느껴보세요.',
      primaryBtn: '여행 코스 살펴보기',
      secondaryBtn: '지하철 무장애 지도',
    },
    categories: {
      sectionTitle: '부산에서 어디로 떠나볼까요?',
      sectionSubtitle: '식도락 맛집부터 바다 산책, 무장애 명소와 편리한 대중교통 정보까지',
      eat: {
        title: '부산 맛집',
        desc: '원조 돼지국밥 노포부터 감성 카페, 해산물 전통시장까지 로컬 맛집',
        tag: '식도락',
      },
      explore: {
        title: '추천 여행 코스',
        desc: '원도심, 해운대, 기장 오시리아까지 알차게 즐기는 일정별 여행 지도',
        tag: '여행 코스',
      },
      walk: {
        title: '무장애 여행',
        desc: '턱 없이 평탄하고 휠체어·유모차로 편하게 이동 가능한 검증된 명소',
        tag: '무장애 명소',
      },
      transit: {
        title: '지하철 & 대중교통',
        desc: '도시철도 1·2호선 엘리베이터 출구, 수하물 보관, 편안한 이동 동선',
        tag: '대중교통 가이드',
      },
    },
    featured: {
      sectionTitle: '현지인이 추천하는 부산의 대표 코스',
      viewCourseBtn: '코스 보기',
    },
    utility: {
      sectionTitle: '편안한 이동을 위한 스마트 정보',
      stationSearchPlaceholder: '지하철역 이름 검색 (예: 서면, 해운대, 부산역)',
      elevatorExits: '엘리베이터 출구 완비',
      lockersAvailable: '수하물 보관함 이용 가능',
      todayWeather: '오늘의 부산 날씨 & 유용한 여행 팁',
    },
    accessibility: {
      stepFree: '계단 없이 출입 가능',
      elevator: '엘리베이터 이용 가능',
      stroller: '유모차·휠체어 이동 편리',
      luggage: '캐리어 이동 편리',
      stationWalk: (min: number) => `지하철역 도보 ${min}분`,
    },
    buttons: {
      viewRoute: '이동 경로 보기',
      seeAll: '전체 보기',
      detail: '상세 보기',
      search: '검색하기',
      close: '닫기',
    },
    footer: {
      description: '부산의 관광 명소, 맛집, 대중교통 무장애 이동 동선을 손쉽게 안내하는 로컬 여행 플랫폼입니다.',
      community: '커뮤니티 및 소식',
      operator: '운영자 정보 및 제휴 문의',
      terms: '이용약관',
      privacy: '개인정보처리방침',
      sources: '데이터 출처: 한국관광공사 TourAPI 및 부산교통공사',
    },
  },
  EN: {
    brand: 'STEPLESS IN KOREA',
    nav: {
      home: 'Home',
      search: 'Station & Exit Guide',
      tips: 'Travel Tips',
      about: 'About',
    },
    hero: {
      eyebrow: 'LOCAL SPECIALIST GUIDE',
      title: 'BUSAN, YOUR WAY.',
      subtitle: 'Discover a more comfortable way to explore Busan with curated step-free routes, local recommendations, and accessible travel insights.',
      primaryBtn: 'EXPLORE ITINERARIES →',
      secondaryBtn: 'METRO BARRIER-FREE MAP',
    },
    categories: {
      sectionTitle: 'WHERE DO YOU WANT TO GO?',
      sectionSubtitle: 'From authentic local culinary spots to scenic coastal walks and step-free metro navigation',
      eat: {
        title: 'FOOD GUIDE',
        desc: 'Authentic pork soups, oceanfront cafes, and vibrant seafood markets with flat entrances',
        tag: 'LOCAL EATS',
      },
      explore: {
        title: 'ITINERARIES',
        desc: 'Day trips and multi-day routes curated for Haeundae, Nampo, and Gijang Osiria',
        tag: 'TRAVEL ROUTES',
      },
      walk: {
        title: 'ACCESSIBLE SPOTS',
        desc: 'Step-free destinations verified for smooth stroller and wheelchair access',
        tag: 'STEP-FREE',
      },
      transit: {
        title: 'METRO & TRANSIT',
        desc: 'Elevator exit guide for Lines 1 & 2, station luggage lockers, and transfer tips',
        tag: 'TRANSIT GUIDE',
      },
    },
    featured: {
      sectionTitle: 'RECOMMENDED LOCAL EXPERIENCES',
      viewCourseBtn: 'VIEW ROUTE →',
    },
    utility: {
      sectionTitle: 'SMART TRANSIT & UTILITY GUIDE',
      stationSearchPlaceholder: 'Search metro station (e.g., Seomyeon, Haeundae, Busan)',
      elevatorExits: 'Elevator Exits Available',
      lockersAvailable: 'Luggage Storage Available',
      todayWeather: 'Busan Weather & Practical Travel Tips',
    },
    accessibility: {
      stepFree: 'Step-Free Access',
      elevator: 'Elevator Available',
      stroller: 'Stroller & Wheelchair Friendly',
      luggage: 'Luggage Friendly',
      stationWalk: (min: number) => `${min} min walk from station`,
    },
    buttons: {
      viewRoute: 'VIEW ROUTE →',
      seeAll: 'SEE ALL →',
      detail: 'SEE DETAILS',
      search: 'Search',
      close: 'Close',
    },
    footer: {
      description: 'A local travel platform providing curated step-free routes, local culinary spots, and accessible transit navigation for Busan.',
      community: 'Community & Links',
      operator: 'Operator & Contact',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      sources: 'Data Sources: Korea Tourism Organization TourAPI & Busan Transportation Corp.',
    },
  },
};
