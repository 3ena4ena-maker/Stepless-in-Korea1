export type Language = 'KR' | 'EN' | 'JA' | 'ZH_TW' | 'ZH_CN' | 'ES' | 'FR';

export const LANGUAGE_OPTIONS: { code: Language; label: string; shortLabel: string; flag: string; htmlLang: string }[] = [
  { code: 'KR', label: '한국어', shortLabel: '한국어', flag: '🇰🇷', htmlLang: 'ko' },
  { code: 'EN', label: 'English', shortLabel: 'EN', flag: '🇺🇸', htmlLang: 'en' },
  { code: 'JA', label: '日本語', shortLabel: '日本語', flag: '🇯🇵', htmlLang: 'ja' },
  { code: 'ZH_TW', label: '繁體中文', shortLabel: '繁體', flag: '🇹🇼', htmlLang: 'zh-Hant' },
  { code: 'ZH_CN', label: '简体中文', shortLabel: '简体', flag: '🇨🇳', htmlLang: 'zh-Hans' },
  { code: 'ES', label: 'Español', shortLabel: 'ES', flag: '🇪🇸', htmlLang: 'es' },
  { code: 'FR', label: 'Français', shortLabel: 'FR', flag: '🇫🇷', htmlLang: 'fr' },
];

export function pickLang<T>(
  lang: Language | undefined,
  map: { KR: T; EN: T; JA?: T; ZH_TW?: T; ZH_CN?: T; ES?: T; FR?: T }
): T {
  const l = lang || 'KR';
  if (l === 'KR') return map.KR;
  if (l === 'JA') return map.JA !== undefined ? map.JA : map.EN;
  if (l === 'ZH_TW') return map.ZH_TW !== undefined ? map.ZH_TW : map.EN;
  if (l === 'ZH_CN') return map.ZH_CN !== undefined ? map.ZH_CN : (map.ZH_TW !== undefined ? map.ZH_TW : map.EN);
  if (l === 'ES') return map.ES !== undefined ? map.ES : map.EN;
  if (l === 'FR') return map.FR !== undefined ? map.FR : map.EN;
  return map.EN;
}

export const DICTIONARY: Record<Language, {
  brand: string;
  nav: {
    home: string;
    search: string;
    transit: string;
    courses: string;
    schedule: string;
    exploration: string;
    about: string;
    tips: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryBtn: string;
    secondaryBtn: string;
  };
  categories: {
    sectionTitle: string;
    sectionSubtitle: string;
    eat: { title: string; desc: string; tag: string };
    explore: { title: string; desc: string; tag: string };
    walk: { title: string; desc: string; tag: string };
    transit: { title: string; desc: string; tag: string };
  };
  featured: {
    sectionTitle: string;
    viewCourseBtn: string;
  };
  utility: {
    sectionTitle: string;
    stationSearchPlaceholder: string;
    elevatorExits: string;
    lockersAvailable: string;
    todayWeather: string;
  };
  accessibility: {
    stepFree: string;
    elevator: string;
    stroller: string;
    luggage: string;
    stationWalk: (min: number) => string;
  };
  buttons: {
    viewRoute: string;
    seeAll: string;
    detail: string;
    search: string;
    close: string;
  };
  footer: {
    description: string;
    community: string;
    operator: string;
    terms: string;
    privacy: string;
    sources: string;
  };
}> = {
  KR: {
    brand: 'STEPLESS IN BUSAN',
    nav: {
      home: '홈',
      search: '출구 정보 및 역 검색',
      transit: '대중교통 이용 팁',
      courses: '여행코스 추천',
      schedule: '부산 주요 일정표',
      exploration: '부산 탐구생활',
      about: '사이트 소개',
      tips: '여행 팁',
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
    brand: 'STEPLESS IN BUSAN',
    nav: {
      home: 'Home',
      search: 'Station & Exit Guide',
      transit: 'Transit Tips',
      courses: 'Recommended Courses',
      schedule: 'Schedule & Events',
      exploration: 'Busan Exploration',
      about: 'About',
      tips: 'Travel Tips',
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
  JA: {
    brand: 'STEPLESS IN BUSAN',
    nav: {
      home: 'ホーム',
      search: '駅・出口バリアフリー案内',
      transit: '交通機関の乗り方・コツ',
      courses: 'おすすめ旅行コース',
      schedule: '釜山イベント・祭り日程',
      exploration: '釜山ディープ探訪',
      about: 'サイト紹介',
      tips: '旅行のヒント',
    },
    hero: {
      eyebrow: '釜山ローカル・バリアフリーガイド',
      title: '階段なしで巡る、やさしい釜山旅',
      subtitle: 'ベビーカー・車椅子・大型スーツケースでも安心！地下鉄エレベーター出口から平坦なお散歩コースまで一目でわかります。',
      primaryBtn: 'おすすめコースを見る →',
      secondaryBtn: '地下鉄バリアフリーマップ',
    },
    categories: {
      sectionTitle: '釜山のどこへ出かけますか？',
      sectionSubtitle: '地元グルメから海辺の平坦な遊歩道、地下鉄エレベーター出口案内まで',
      eat: {
        title: '釜山グルメガイド',
        desc: '老舗のデジクッパからオーシャンビューカフェ、段差なしで楽しめる伝統市場まで',
        tag: '絶品グルメ',
      },
      explore: {
        title: 'おすすめモデルコース',
        desc: '旧市街・南浦洞から海雲台、機張（オシリア）まで日程別モデルコース',
        tag: '旅行コース',
      },
      walk: {
        title: 'バリアフリー観光地',
        desc: '段差がなくベビーカーや車椅子で快適に散策できる厳選スポット',
        tag: '段差なし',
      },
      transit: {
        title: '地下鉄・公共交通ガイド',
        desc: '地下鉄1〜4号線・東海線のエレベーター出口、コインロッカー、乗り換え案内',
        tag: '交通ガイド',
      },
    },
    featured: {
      sectionTitle: '地元エディター厳選！釜山代表コース',
      viewCourseBtn: 'コースを見る →',
    },
    utility: {
      sectionTitle: '快適な移動のためのスマート案内',
      stationSearchPlaceholder: '地下鉄の駅名を検索（例：西面、海雲台、釜山駅）',
      elevatorExits: 'エレベーター出口完備',
      lockersAvailable: 'コインロッカー利用可能',
      todayWeather: '今日の釜山の天気＆旅のお役立ち情報',
    },
    accessibility: {
      stepFree: '段差なしで出入り可能',
      elevator: 'エレベーター完備',
      stroller: 'ベビーカー・車椅子対応',
      luggage: 'スーツケース移動快適',
      stationWalk: (min: number) => `駅から徒歩約${min}分`,
    },
    buttons: {
      viewRoute: '移動ルートを見る →',
      seeAll: 'すべて見る →',
      detail: '詳細を見る',
      search: '検索',
      close: '閉じる',
    },
    footer: {
      description: '釜山の観光名所、ローカルグルメ、地下鉄・公共交通機関の段差なし（バリアフリー）ルートをわかりやすく案内するローカル旅行プラットフォームです。',
      community: '関連機関＆コミュニティ',
      operator: '運営者情報・お問い合わせ',
      terms: '利用規約',
      privacy: 'プライバシーポリシー',
      sources: 'データ出典：韓国観光公社 TourAPI・釜山交通公社',
    },
  },
  ZH_TW: {
    brand: 'STEPLESS IN BUSAN',
    nav: {
      home: '首頁',
      search: '地鐵站＆無障礙出口指南',
      transit: '大眾運輸實用攻略',
      courses: '推薦旅遊路線',
      schedule: '釜山慶典與活動日曆',
      exploration: '釜山深度探索',
      about: '網站介紹',
      tips: '旅遊攻略',
    },
    hero: {
      eyebrow: '釜山在地無障礙旅遊指南',
      title: '免爬樓梯，輕鬆暢遊釜山',
      subtitle: '推嬰兒車、輪椅或攜帶大型行李箱也不必擔心！一眼掌握釜山地鐵電梯出口與平坦海濱散步路線。',
      primaryBtn: '查看推薦路線 →',
      secondaryBtn: '地鐵無障礙地圖',
    },
    categories: {
      sectionTitle: '今天想去釜山哪裡走走？',
      sectionSubtitle: '從道地美食、平坦海景步道到地鐵電梯出口與寄物櫃資訊',
      eat: {
        title: '釜山美食指南',
        desc: '從正宗豬肉湯飯老店、海景咖啡廳到出入口平坦的海鮮傳統市場',
        tag: '在地美食',
      },
      explore: {
        title: '精選推薦行程',
        desc: '涵蓋南浦洞舊城區、海雲台、廣安里與機張東釜山的單日及多日路線',
        tag: '旅遊路線',
      },
      walk: {
        title: '無障礙友善景點',
        desc: '無階梯、路面平坦，經過實地驗證適合嬰兒車與輪椅同行的景點',
        tag: '無障礙景點',
      },
      transit: {
        title: '地鐵＆大眾運輸指南',
        desc: '釜山地鐵各線電梯出口位置、大型行李置物櫃與免費轉乘攻略',
        tag: '交通攻略',
      },
    },
    featured: {
      sectionTitle: '在地人推薦的釜山代表路線',
      viewCourseBtn: '查看路線 →',
    },
    utility: {
      sectionTitle: '讓旅途更輕鬆的智慧交通資訊',
      stationSearchPlaceholder: '輸入地鐵站名稱搜尋（例：西面、海雲台、釜山站）',
      elevatorExits: '設有地面直達電梯出口',
      lockersAvailable: '設有行李寄物櫃',
      todayWeather: '今日釜山天氣＆實用旅遊貼士',
    },
    accessibility: {
      stepFree: '免爬樓梯・平坦進出',
      elevator: '設有電梯',
      stroller: '嬰兒車・輪椅友善',
      luggage: '大型行李箱移動便利',
      stationWalk: (min: number) => `距地鐵站步行約 ${min} 分鐘`,
    },
    buttons: {
      viewRoute: '查看動線 →',
      seeAll: '查看全部 →',
      detail: '查看詳情',
      search: '搜尋',
      close: '關閉',
    },
    footer: {
      description: '專為嬰兒車家庭、輪椅族與攜帶行李旅客打造的釜山在地無障礙地鐵出口與平坦旅遊動線指南平台。',
      community: '相關機構與社群',
      operator: '營運者資訊與合作洽詢',
      terms: '服務條款',
      privacy: '隱私權政策',
      sources: '資料來源：韓國觀光公社 TourAPI 及釜山交通公社',
    },
  },
  ZH_CN: {
    brand: 'STEPLESS IN BUSAN',
    nav: {
      home: '首页',
      search: '地铁站＆无障碍出口指南',
      transit: '公共交通实用攻略',
      courses: '推荐旅游路线',
      schedule: '釜山庆典与活动日历',
      exploration: '釜山深度探索',
      about: '网站介绍',
      tips: '旅游攻略',
    },
    hero: {
      eyebrow: '釜山本地无障碍旅行指南',
      title: '无需爬楼，轻松畅游釜山',
      subtitle: '推婴儿车、轮椅或携带大件行李箱也毫无压力！一图掌握釜山地铁直梯出口与平坦海滨漫步路线。',
      primaryBtn: '查看推荐路线 →',
      secondaryBtn: '地铁无障碍地图',
    },
    categories: {
      sectionTitle: '今天想去釜山哪里逛逛？',
      sectionSubtitle: '从地道美食、平坦海景步道到地铁无障碍直梯出口与寄存柜指南',
      eat: {
        title: '釜山美食指南',
        desc: '从正宗猪肉汤饭老字号、海景咖啡馆到平地进出的海鲜传统市场',
        tag: '地道美食',
      },
      explore: {
        title: '精选推荐行程',
        desc: '涵盖南浦洞老城区、海云台、广安里与机张东釜山的一日及多日路线',
        tag: '旅游路线',
      },
      walk: {
        title: '无障碍友好景点',
        desc: '无台阶、路面平坦，经过实地核验适合婴儿车与轮椅出行的景点',
        tag: '无障碍景点',
      },
      transit: {
        title: '地铁＆公共交通指南',
        desc: '釜山地铁各线直梯/扶梯出口、大件行李寄存柜与免费换乘攻略',
        tag: '交通攻略',
      },
    },
    featured: {
      sectionTitle: '本地人推荐的釜山代表路线',
      viewCourseBtn: '查看路线 →',
    },
    utility: {
      sectionTitle: '让出行更轻松的智慧交通信息',
      stationSearchPlaceholder: '输入地铁站名称搜索（例：西面、海云台、釜山站）',
      elevatorExits: '配备地面直达电梯出口',
      lockersAvailable: '配备行李寄存柜',
      todayWeather: '今日釜山天气＆实用出行贴士',
    },
    accessibility: {
      stepFree: '无台阶平坦进出',
      elevator: '配备无障碍直梯',
      stroller: '婴儿车・轮椅友好',
      luggage: '大件行李箱推行便利',
      stationWalk: (min: number) => `距地铁站步行约 ${min} 分钟`,
    },
    buttons: {
      viewRoute: '查看路线 →',
      seeAll: '查看全部 →',
      detail: '查看详情',
      search: '搜索',
      close: '关闭',
    },
    footer: {
      description: '专为婴儿车家庭、轮椅出行者与携带大件行李旅客打造的釜山无障碍地铁出口与平坦旅行路线指南平台。',
      community: '相关机构与社区',
      operator: '运营者信息与合作咨询',
      terms: '服务条款',
      privacy: '隐私政策',
      sources: '数据来源：韩国观光公社 TourAPI 及釜山交通公社',
    },
  },
  ES: {
    brand: 'STEPLESS IN BUSAN',
    nav: {
      home: 'Inicio',
      search: 'Estaciones y Salidas',
      transit: 'Guía de Transporte',
      courses: 'Rutas Recomendadas',
      schedule: 'Agenda y Eventos',
      exploration: 'Explorar Busan',
      about: 'Acerca de',
      tips: 'Consejos de Viaje',
    },
    hero: {
      eyebrow: 'GUÍA LOCAL DE ACCESIBILIDAD',
      title: 'BUSAN SIN ESCALONES.',
      subtitle: 'Viaja con total comodidad con cochecito de bebé, silla de ruedas o maletas: salidas de metro con ascensor y rutas llanas verificadas.',
      primaryBtn: 'VER RUTAS RECOMENDADAS →',
      secondaryBtn: 'MAPA DE METRO ACCESIBLE',
    },
    categories: {
      sectionTitle: '¿ADÓNDE QUIERES IR EN BUSAN?',
      sectionSubtitle: 'Desde gastronomía local y paseos costeros sin escalones hasta salidas de metro con ascensor y consignas',
      eat: {
        title: 'GUÍA GASTRONÓMICA',
        desc: 'Restaurantes tradicionales de sopa de cerdo, cafeterías frente al mar y mercados con acceso llano',
        tag: 'GASTRONOMÍA',
      },
      explore: {
        title: 'ITINERARIOS',
        desc: 'Rutas de 1 a 5 días por Haeundae, Gwangalli, Nampo y Gijang Osiria',
        tag: 'RUTAS',
      },
      walk: {
        title: 'LUGARES ACCESIBLES',
        desc: 'Destinos sin escalones verificados para cochecitos de bebé y sillas de ruedas',
        tag: 'SIN ESCALONES',
      },
      transit: {
        title: 'METRO Y TRANSPORTE',
        desc: 'Salidas con ascensor en Líneas 1–4, consignas de equipaje y guía de transbordo',
        tag: 'TRANSPORTE',
      },
    },
    featured: {
      sectionTitle: 'RUTAS RECOMENDADAS POR LOCALES',
      viewCourseBtn: 'VER RUTA →',
    },
    utility: {
      sectionTitle: 'INFORMACIÓN PRÁCTICA DE MOVILIDAD',
      stationSearchPlaceholder: 'Buscar estación de metro (ej. Seomyeon, Haeundae, Busan)',
      elevatorExits: 'Salidas con ascensor disponibles',
      lockersAvailable: 'Consignas de equipaje disponibles',
      todayWeather: 'Clima en Busan y consejos prácticos de viaje',
    },
    accessibility: {
      stepFree: 'Acceso sin escalones',
      elevator: 'Ascensor disponible',
      stroller: 'Apto para cochecitos y sillas de ruedas',
      luggage: 'Cómodo con maletas',
      stationWalk: (min: number) => `A ${min} min a pie de la estación`,
    },
    buttons: {
      viewRoute: 'VER RUTA →',
      seeAll: 'VER TODO →',
      detail: 'VER DETALLES',
      search: 'Buscar',
      close: 'Cerrar',
    },
    footer: {
      description: 'Plataforma local que ofrece rutas sin escalones, recomendaciones gastronómicas y guía de salidas de metro con ascensor en Busan.',
      community: 'Comunidad y Enlaces',
      operator: 'Operador y Contacto',
      terms: 'Términos de Servicio',
      privacy: 'Política de Privacidad',
      sources: 'Fuentes de datos: Korea Tourism Organization TourAPI y Busan Transportation Corp.',
    },
  },
  FR: {
    brand: 'STEPLESS IN BUSAN',
    nav: {
      home: 'Accueil',
      search: 'Stations & Sorties',
      transit: 'Transports & Astuces',
      courses: 'Itinéraires Conseillés',
      schedule: 'Agenda & Festivals',
      exploration: 'Explorer Busan',
      about: 'À propos',
      tips: 'Conseils Voyage',
    },
    hero: {
      eyebrow: 'GUIDE LOCAL D’ACCESSIBILITÉ',
      title: 'BUSAN SANS MARCHES.',
      subtitle: 'Voyagez l’esprit léger avec une poussette, un fauteuil roulant ou des valises : sorties de métro avec ascenseur et parcours plats vérifiés.',
      primaryBtn: 'VOIR LES ITINÉRAIRES →',
      secondaryBtn: 'CARTE MÉTRO ACCESSIBLE',
    },
    categories: {
      sectionTitle: 'OÙ SOUHAITEZ-VOUS ALLER À BUSAN ?',
      sectionSubtitle: 'Spécialités locales, promenades côtières sans marches, sorties de métro avec ascenseur et consignes à bagages',
      eat: {
        title: 'GUIDE GOURMAND',
        desc: 'Restaurants authentiques, cafés vue mer et marchés traditionnels accessibles de plain-pied',
        tag: 'GASTRONOMIE',
      },
      explore: {
        title: 'ITINÉRAIRES',
        desc: 'Parcours d’un ou plusieurs jours à Haeundae, Gwangalli, Nampo et Gijang Osiria',
        tag: 'PARCOURS',
      },
      walk: {
        title: 'SITES ACCESSIBLES',
        desc: 'Lieux sans marches vérifiés sur le terrain pour poussettes et fauteuils roulants',
        tag: 'SANS MARCHE',
      },
      transit: {
        title: 'MÉTRO & TRANSPORTS',
        desc: 'Sorties avec ascenseur (Lignes 1–4), consignes automatiques et correspondances',
        tag: 'TRANSPORTS',
      },
    },
    featured: {
      sectionTitle: 'EXPÉRIENCES LOCALES RECOMMANDÉES',
      viewCourseBtn: 'VOIR LE PARCOURS →',
    },
    utility: {
      sectionTitle: 'INFOS PRATIQUES DE MOBILITÉ',
      stationSearchPlaceholder: 'Rechercher une station (ex. Seomyeon, Haeundae, Busan)',
      elevatorExits: 'Sorties avec ascenseur disponibles',
      lockersAvailable: 'Consignes à bagages disponibles',
      todayWeather: 'Météo à Busan & conseils pratiques',
    },
    accessibility: {
      stepFree: 'Accès de plain-pied (sans marche)',
      elevator: 'Ascenseur disponible',
      stroller: 'Adapté poussettes & fauteuils roulants',
      luggage: 'Pratique avec bagages',
      stationWalk: (min: number) => `À ${min} min à pied de la station`,
    },
    buttons: {
      viewRoute: 'VOIR L’ITINÉRAIRE →',
      seeAll: 'TOUT VOIR →',
      detail: 'VOIR LES DÉTAILS',
      search: 'Rechercher',
      close: 'Fermer',
    },
    footer: {
      description: 'Plateforme locale proposant des itinéraires sans marches, de bonnes adresses et le guide des sorties de métro avec ascenseur à Busan.',
      community: 'Communauté & Liens',
      operator: 'Opérateur & Contact',
      terms: 'Conditions d’utilisation',
      privacy: 'Politique de confidentialité',
      sources: 'Sources : Korea Tourism Organization TourAPI & Busan Transportation Corp.',
    },
  },
};
