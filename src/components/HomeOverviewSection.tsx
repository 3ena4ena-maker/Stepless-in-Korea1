import React from 'react';
import { 
  Accessibility, 
  Luggage, 
  Compass, 
  ShieldCheck, 
  Train, 
  ChevronRight,
  ChevronDown,
  UtensilsCrossed,
  Building2,
  ArrowUpRight
} from 'lucide-react';
import StationSearchBar from './StationSearchBar';
import { DICTIONARY, Language, pickLang, buildLocalizedPath } from '../i18n/dictionary';
import { formatLineLabelI18n, getLocalizedStationTitle } from '../i18n/stationTranslations';
import { STATIONS } from '../data';

interface HomeOverviewSectionProps {
  language?: Language;
  onSelectStation: (stationId: string) => void;
  onNavigateToSearch?: (query?: string) => void;
  onNavigateToReport?: () => void;
  onNavigateToNearby?: () => void;
  onNavigateToItinerary?: (category?: 'GOURMET' | 'EXPERIENCE' | 'DAY' | 'SUBWAY') => void;
  onNavigateToGuide?: (subPage: 'transit' | 'child-free' | 'bus-qr' | 'taxi' | 'exploration' | 'schedule' | 'barrier-free') => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onNavigateToAbout?: () => void;
}

export function HomeOverviewSection({
  language = 'KR',
  onSelectStation,
  onNavigateToSearch,
  onNavigateToItinerary,
  onNavigateToGuide,
  onNavigateToAbout,
  searchQuery = '',
  setSearchQuery
}: HomeOverviewSectionProps) {
  
  const d = DICTIONARY[language] || DICTIONARY.KR;
  const [lineFilter, setLineFilter] = React.useState<string>('ALL');

  const getLineTheme = (lineStr: string | number) => {
    const key = String(lineStr).trim();
    switch (key) {
      case '1':
        return {
          bg: 'bg-[#F06A00]',
          bgLight: 'bg-[#FFF5EE]',
          border: 'border-[#F06A00]/20',
          text: 'text-[#C85400]',
          badgeBg: 'bg-[#FFF5EE]',
          badgeText: 'text-[#C85400]',
          dot: 'bg-[#F06A00]',
        };
      case '2':
        return {
          bg: 'bg-[#1b6d24]',
          bgLight: 'bg-[#EFF8F0]',
          border: 'border-[#1b6d24]/20',
          text: 'text-[#186320]',
          badgeBg: 'bg-[#EFF8F0]',
          badgeText: 'text-[#186320]',
          dot: 'bg-[#1b6d24]',
        };
      case '3':
        return {
          bg: 'bg-[#906A3B]',
          bgLight: 'bg-[#F8F4EE]',
          border: 'border-[#906A3B]/20',
          text: 'text-[#7A572D]',
          badgeBg: 'bg-[#F8F4EE]',
          badgeText: 'text-[#7A572D]',
          dot: 'bg-[#906A3B]',
        };
      case '4':
        return {
          bg: 'bg-[#2B60BA]',
          bgLight: 'bg-[#EFF5FD]',
          border: 'border-[#2B60BA]/20',
          text: 'text-[#22509E]',
          badgeBg: 'bg-[#EFF5FD]',
          badgeText: 'text-[#22509E]',
          dot: 'bg-[#2B60BA]',
        };
      case '동해':
        return {
          bg: 'bg-[#003DA5]',
          bgLight: 'bg-[#EEF3FA]',
          border: 'border-[#003DA5]/20',
          text: 'text-[#00358E]',
          badgeBg: 'bg-[#EEF3FA]',
          badgeText: 'text-[#00358E]',
          dot: 'bg-[#003DA5]',
        };
      case '김해':
        return {
          bg: 'bg-[#804796]',
          bgLight: 'bg-[#F6F0F9]',
          border: 'border-[#804796]/20',
          text: 'text-[#6D3982]',
          badgeBg: 'bg-[#F6F0F9]',
          badgeText: 'text-[#6D3982]',
          dot: 'bg-[#804796]',
        };
      default:
        return {
          bg: 'bg-[#8EA85E]',
          bgLight: 'bg-[#F3F7EC]',
          border: 'border-[#8EA85E]/20',
          text: 'text-[#5B7332]',
          badgeBg: 'bg-[#F3F7EC]',
          badgeText: 'text-[#5B7332]',
          dot: 'bg-[#8EA85E]',
        };
    }
  };

  const filteredStations = STATIONS.filter(st => {
    if (lineFilter === 'ALL') return true;
    if (lineFilter === 'TRANSFER') return st.isTransferStation || st.lines.length > 1;
    return st.lines.includes(lineFilter);
  });

  // 4 Core Activity Courses
  const recommendedCourses = [
    {
      id: 'DAY' as const,
      href: '/tips/courses/day',
      icon: Compass,
      title: pickLang(language, {
        KR: '추천 여행 코스',
        EN: 'RECOMMENDED ITINERARY',
        JA: 'おすすめモデルコース',
        ZH_TW: '精選推薦行程',
        ZH_CN: '精选推荐行程',
        ES: 'ITINERARIOS RECOMENDADOS',
        FR: 'ITINÉRAIRES RECOMMANDÉS',
      }),
      tag: pickLang(language, {
        KR: '바다·투어',
        EN: 'OCEAN TRIP',
        JA: '海辺・観光',
        ZH_TW: '海景・巡禮',
        ZH_CN: '海景・巡礼',
        ES: 'MAR Y TURISMO',
        FR: 'MER & VISITES',
      }),
      desc: pickLang(language, {
        KR: '원도심·해운대·기장까지 알짜배기 힐링 명소 코스',
        EN: 'Curated itineraries for Haeundae, Nampo, and Gijang.',
        JA: '南浦洞・海雲台・機張まで釜山の名所を巡る定番コース',
        ZH_TW: '串聯南浦洞、海雲台與機張東釜山的療癒必訪路線',
        ZH_CN: '串联南浦洞、海云台与机张东釜山的治愈必访路线',
        ES: 'Rutas seleccionadas por Nampo-dong, Haeundae y Gijang.',
        FR: 'Parcours incontournables à Nampo-dong, Haeundae et Gijang.',
      }),
      bg: 'bg-white',
      border: 'border-black/[0.06] hover:border-[#8EA85E]/60',
      iconBg: 'bg-[#F3F7EC]',
      iconColor: 'text-[#5B7332]',
      tagBg: 'bg-[#F3F7EC] text-[#5B7332]',
      btnBg: 'bg-white hover:bg-[#F3F7EC] border border-black/[0.06] text-[#18181B]',
      btnText: pickLang(language, { KR: '코스 보기', EN: 'Explore', JA: 'コースを見る', ZH_TW: '查看行程', ZH_CN: '查看行程', ES: 'Ver rutas', FR: 'Voir les parcours' }),
    },
    {
      id: 'SUBWAY' as const,
      href: '/tips/courses/subway',
      icon: Train,
      title: pickLang(language, {
        KR: '지하철 무장애 코스',
        EN: 'STEP-FREE METRO ROUTE',
        JA: '地下鉄バリアフリーコース',
        ZH_TW: '地鐵無障礙路線',
        ZH_CN: '地铁无障碍路线',
        ES: 'RUTA DE METRO SIN ESCALONES',
        FR: 'PARCOURS MÉTRO SANS MARCHE',
      }),
      tag: pickLang(language, {
        KR: '계단 ZERO',
        EN: 'STEP-FREE',
        JA: '階段ゼロ',
        ZH_TW: '免爬樓梯',
        ZH_CN: '无台阶',
        ES: 'CERO ESCALONES',
        FR: 'ZÉRO MARCHE',
      }),
      desc: pickLang(language, {
        KR: '엘리베이터 출구로 턱 없이 편안하게 달리는 쾌속 동선',
        EN: 'Elevator exits and flat, step-free travel paths.',
        JA: 'エレベーター出口と平坦な歩道で巡る快適お出かけルート',
        ZH_TW: '透過地鐵電梯出口與平坦步道輕鬆暢遊的無障礙動線',
        ZH_CN: '通过地铁直梯出口与平坦步道轻松畅游的无障碍路线',
        ES: 'Salidas con ascensor y paseos llanos sin barreras.',
        FR: 'Sorties avec ascenseur et promenades plates sans obstacle.',
      }),
      bg: 'bg-white',
      border: 'border-black/[0.06] hover:border-[#8EA85E]/60',
      iconBg: 'bg-[#F3F7EC]',
      iconColor: 'text-[#5B7332]',
      tagBg: 'bg-[#F3F7EC] text-[#5B7332]',
      btnBg: 'bg-white hover:bg-[#F3F7EC] border border-black/[0.06] text-[#18181B]',
      btnText: pickLang(language, { KR: '동선 확인', EN: 'Check Route', JA: 'ルート確認', ZH_TW: '查看動線', ZH_CN: '查看路线', ES: 'Ver ruta', FR: 'Voir l’itinéraire' }),
    },
    {
      id: 'GOURMET' as const,
      href: '/tips/courses/gourmet',
      icon: UtensilsCrossed,
      title: pickLang(language, {
        KR: '식도락 (부산 맛집)',
        EN: 'BUSAN FOOD GUIDE',
        JA: '釜山グルメ＆カフェ',
        ZH_TW: '釜山美食＆海景咖啡',
        ZH_CN: '釜山美食＆海景咖啡',
        ES: 'GASTRONOMÍA Y CAFÉS',
        FR: 'GASTRONOMIE & CAFÉS',
      }),
      tag: pickLang(language, {
        KR: '부산 미식',
        EN: 'FOODIE',
        JA: '絶品グルメ',
        ZH_TW: '在地美食',
        ZH_CN: '地道美食',
        ES: 'SABORES LOCALES',
        FR: 'SAVEURS LOCALES',
      }),
      desc: pickLang(language, {
        KR: '원조 돼지국밥 노포부터 감성 충만 오션뷰 카페까지',
        EN: 'Authentic pork soup eateries and oceanfront cafes.',
        JA: '本場のデジクッパ老舗から絶景オーシャンビューカフェまで',
        ZH_TW: '從正宗豬肉湯飯老店、堅果糖餅到絕美海景咖啡廳',
        ZH_CN: '从正宗猪肉汤饭老字号、坚果糖饼到绝美海景咖啡馆',
        ES: 'Desde el auténtico Dwaeji-gukbap hasta cafeterías frente al mar.',
        FR: 'Du traditionnel Dwaeji-gukbap aux cafés avec vue sur l’océan.',
      }),
      bg: 'bg-white',
      border: 'border-black/[0.06] hover:border-[#8EA85E]/60',
      iconBg: 'bg-[#F3F7EC]',
      iconColor: 'text-[#5B7332]',
      tagBg: 'bg-[#F3F7EC] text-[#5B7332]',
      btnBg: 'bg-white hover:bg-[#F3F7EC] border border-black/[0.06] text-[#18181B]',
      btnText: pickLang(language, { KR: '맛집 보기', EN: 'View Eats', JA: 'グルメを見る', ZH_TW: '查看美食', ZH_CN: '查看美食', ES: 'Ver restaurantes', FR: 'Voir les adresses' }),
    },
    {
      id: 'EXPERIENCE' as const,
      href: '/tips/courses/experience',
      icon: Building2,
      title: pickLang(language, {
        KR: '체험 & 문화 공간',
        EN: 'CULTURE & MUSEUM',
        JA: '体験・ミュージアム',
        ZH_TW: '體驗＆文化展館',
        ZH_CN: '体验＆文化展馆',
        ES: 'CULTURA Y MUSEOS',
        FR: 'CULTURE & MUSÉES',
      }),
      tag: pickLang(language, {
        KR: '문화·핫플',
        EN: 'HOT SPOTS',
        JA: '文化・体験',
        ZH_TW: '文化・體驗',
        ZH_CN: '文化・体验',
        ES: 'CULTURA',
        FR: 'CULTURE',
      }),
      desc: pickLang(language, {
        KR: '국립해양박물관과 전시·예술 가득한 문화 명소',
        EN: 'Maritime museums, art galleries, and cultural centers.',
        JA: '国立海洋博物館やメディアアート美術館など雨の日も快適な名所',
        ZH_TW: '國立海洋博物館、沉浸式美術館與複合文化空間',
        ZH_CN: '国立海洋博物馆、沉浸式美术馆与复合文化空间',
        ES: 'Museo Marítimo Nacional, galerías de arte y espacios culturales.',
        FR: 'Musée Maritime National, galeries d’art et espaces culturels.',
      }),
      bg: 'bg-white',
      border: 'border-black/[0.06] hover:border-[#8EA85E]/60',
      iconBg: 'bg-[#F3F7EC]',
      iconColor: 'text-[#5B7332]',
      tagBg: 'bg-[#F3F7EC] text-[#5B7332]',
      btnBg: 'bg-white hover:bg-[#F3F7EC] border border-black/[0.06] text-[#18181B]',
      btnText: pickLang(language, { KR: '공간 둘러보기', EN: 'Discover', JA: 'スポットを見る', ZH_TW: '探索空間', ZH_CN: '探索空间', ES: 'Explorar', FR: 'Découvrir' }),
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 text-left font-sans text-[#11161B]" id="home-overview-section">
      
      {/* ==========================================
          1. 3-SECOND TEST HERO SECTION (Impeccable & Focused)
         ========================================== */}
      <section className="pt-6 pb-10 sm:pt-12 sm:pb-16 text-center max-w-2xl mx-auto px-4">
        {/* 부산 상징 파노라마 라인 일러스트 (감천·흰여울 마을 + 등대 + 광안대교 + 해운대 스카이캡슐 + 바다 물결 & 갈매기) */}
        <div className="w-full max-w-[340px] sm:max-w-[480px] mx-auto mb-3 sm:mb-5 select-none pointer-events-none">
          <svg viewBox="0 0 480 125" fill="none" className="w-full h-auto overflow-visible" aria-hidden="true">
            {/* 세이지 그린 태양 & 은은한 후광 */}
            <circle cx="240" cy="46" r="24" fill="#8EA85E" fillOpacity="0.16" />
            <circle cx="240" cy="46" r="17" stroke="#8EA85E" strokeWidth="1.4" strokeDasharray="2 2" />

            {/* 갈매기 3마리 */}
            <path d="M132 28C136 24 141 24 144 29C147 24 152 24 156 28" stroke="#1E1E1C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M164 19C167 16 171 16 173 20C175 16 179 16 182 19" stroke="#1E1E1C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M332 22C336 18 340 18 343 23C346 18 350 18 354 22" stroke="#1E1E1C" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />

            {/* 좌측: 감천·흰여울 해안 마을 & 등대 */}
            <path d="M18 92 C36 74, 68 72, 98 92" stroke="#1E1E1C" strokeWidth="1.3" fill="#FBFBF9" />
            {/* 계단식 미니 하우스들 */}
            <rect x="34" y="70" width="14" height="12" fill="#FBFBF9" stroke="#1E1E1C" strokeWidth="1.3" />
            <path d="M32 70 L41 63 L50 70" stroke="#1E1E1C" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="51" y="65" width="15" height="15" fill="#8EA85E" fillOpacity="0.22" stroke="#1E1E1C" strokeWidth="1.3" />
            <path d="M49 65 L58.5 58 L68 65" stroke="#1E1E1C" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="56" y="70" width="5" height="5" stroke="#1E1E1C" strokeWidth="1.1" />
            <rect x="69" y="73" width="13" height="11" fill="#FBFBF9" stroke="#1E1E1C" strokeWidth="1.3" />
            <path d="M67 73 L75.5 67 L84 73" stroke="#1E1E1C" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            {/* 해안 등대 */}
            <path d="M90 88 L92 64 L97 64 L99 88" fill="#FBFBF9" stroke="#1E1E1C" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M90 64 H99 M92 59 H97 V64 H92 Z" stroke="#1E1E1C" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M91 59 L94.5 55 L98 59" fill="#8EA85E" stroke="#1E1E1C" strokeWidth="1.3" strokeLinejoin="round" />

            {/* 중앙: 부산 광안대교 (Gwangan Diamond Bridge) */}
            {/* 좌·우 주탑 */}
            <path d="M168 94 V34 M175 94 V34 M165 34 H178 M168 48 H175 M168 64 H175 M168 78 H175" stroke="#1E1E1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M305 94 V34 M312 94 V34 M302 34 H315 M305 48 H312 M305 64 H312 M305 78 H312" stroke="#1E1E1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* 현수교 메인 케이블 */}
            <path d="M108 82 Q140 78 168 36" stroke="#1E1E1C" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M175 36 Q240 82 305 36" stroke="#1E1E1C" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M312 36 Q340 78 372 82" stroke="#1E1E1C" strokeWidth="1.5" strokeLinecap="round" />
            {/* 수직 행어 로프 */}
            <path d="M192 47 V82 M208 55 V82 M224 60 V82 M240 62 V82 M256 60 V82 M272 55 V82 M288 47 V82" stroke="#1E1E1C" strokeWidth="1.1" strokeOpacity="0.75" />
            <path d="M148 64 V82 M132 74 V82 M332 64 V82 M348 74 V82" stroke="#1E1E1C" strokeWidth="1.1" strokeOpacity="0.75" />
            {/* 복층 교량 상판 */}
            <line x1="102" y1="82" x2="378" y2="82" stroke="#1E1E1C" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="112" y1="86" x2="368" y2="86" stroke="#8EA85E" strokeWidth="1.5" strokeLinecap="round" />

            {/* 우측: 해운대 스카이캡슐 & 해변 레일 */}
            <line x1="382" y1="78" x2="462" y2="78" stroke="#1E1E1C" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M396 78 V92 M424 78 V92 M450 78 V92" stroke="#1E1E1C" strokeWidth="1.3" strokeLinecap="round" />
            {/* 스카이캡슐 열차 칸 */}
            <rect x="404" y="54" width="38" height="21" rx="7" fill="#8EA85E" fillOpacity="0.22" stroke="#1E1E1C" strokeWidth="1.5" />
            <rect x="409" y="59" width="8" height="8" rx="1.5" fill="#FBFBF9" stroke="#1E1E1C" strokeWidth="1.2" />
            <rect x="419" y="59" width="8" height="8" rx="1.5" fill="#FBFBF9" stroke="#1E1E1C" strokeWidth="1.2" />
            <rect x="429" y="59" width="8" height="8" rx="1.5" fill="#FBFBF9" stroke="#1E1E1C" strokeWidth="1.2" />
            <circle cx="413" cy="76.5" r="2" fill="#1E1E1C" />
            <circle cx="433" cy="76.5" r="2" fill="#1E1E1C" />

            {/* 하단: 부산 바다의 유려한 물결 라인 */}
            <path d="M12 95 Q45 89 78 95 T144 95 T210 95 T276 95 T342 95 T408 95 T468 95" stroke="#1E1E1C" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M48 104 Q82 99 116 104 T184 104 T252 104 T320 104 T388 104 T442 104" stroke="#8EA85E" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M140 112 Q190 108 240 112 T340 112" stroke="#1E1E1C" strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round" />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-[#11161B] leading-tight break-keep mb-3 sm:mb-4">
          {language === 'KR' ? (
            <>
              계단 없는 부산여행<br />
              로컬 가이드 <span className="text-[#8EA85E]">스탭리스</span>와 함께
            </>
          ) : language === 'JA' ? (
            <>
              階段のない快適な釜山旅<br />
              ローカルガイド <span className="text-[#8EA85E]">Stepless</span> と一緒に
            </>
          ) : language === 'ZH_TW' ? (
            <>
              免爬樓梯的無障礙釜山之旅<br />
              與在地指南 <span className="text-[#8EA85E]">Stepless</span> 同行
            </>
          ) : language === 'ZH_CN' ? (
            <>
              无需爬楼的无障碍釜山之旅<br />
              与本地指南 <span className="text-[#8EA85E]">Stepless</span> 同行
            </>
          ) : language === 'ES' ? (
            <>
              Viaja por Busan Sin Escalones<br />
              Con tu Guía Local <span className="text-[#8EA85E]">Stepless</span>
            </>
          ) : language === 'FR' ? (
            <>
              Visitez Busan Sans Marche<br />
              Avec le Guide Local <span className="text-[#8EA85E]">Stepless</span>
            </>
          ) : (
            <>
              Step-Free Busan Travel<br />
              With Local Guide <span className="text-[#8EA85E]">Stepless</span>
            </>
          )}
        </h1>

        <p className="relative z-10 text-base sm:text-lg md:text-xl text-slate-600 font-medium max-w-xl mx-auto mb-6 sm:mb-8 break-keep">
          {pickLang(language, {
            KR: '부산의 진짜 매력을 한눈에 느껴보세요!',
            EN: 'Experience the true charm of Busan at a glance!',
            JA: 'ベビーカー・車椅子・スーツケースでも安心！釜山の魅力を一目でチェック',
            ZH_TW: '推嬰兒車、輪椅或攜帶大件行李也能輕鬆感受釜山的真正魅力！',
            ZH_CN: '推婴儿车、轮椅或携带大件行李也能轻松感受釜山的真正魅力！',
            ES: '¡Descubre el encanto de Busan con cochecito, silla de ruedas o equipaje!',
            FR: 'Découvrez tout le charme de Busan en poussette, fauteuil roulant ou avec vos bagages !',
          })}
        </p>

        {/* The Centerpiece Search Bar */}
        <div className="relative z-10 w-full max-w-2xl mx-auto rounded-2xl">
          <StationSearchBar
            language={language}
            searchQuery={searchQuery || ''}
            setSearchQuery={(q) => setSearchQuery?.(q)}
            onSelectStation={(stId) => onSelectStation(stId)}
            onNavigateToSearch={onNavigateToSearch}
            placeholder={d.utility.stationSearchPlaceholder}
          />
        </div>

        <div className="mt-5 sm:mt-6 inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-black/[0.05] shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-xs font-bold text-[#5B7332] animate-bounce">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#8EA85E]/15 text-[#5B7332]">
            <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
          </span>
          <span>
            {pickLang(language, {
              KR: '또는 아래 지하철역을 바로 눌러보세요',
              EN: 'Or tap any metro station below',
              JA: 'または下の地下鉄駅ボタンをタップしてください',
              ZH_TW: '或直接點擊下方任一地鐵站查看出口地圖',
              ZH_CN: '或直接点击下方任一地铁站查看出口地图',
              ES: 'O toca cualquier estación de metro abajo',
              FR: 'Ou sélectionnez directement une station de métro ci-dessous',
            })}
          </span>
        </div>
      </section>

      {/* ==========================================
          2. ALL STATIONS (COMPACT & CUTE SUBWAY TRAIN BUTTONS)
         ========================================== */}
      <section className="space-y-4 pt-2" id="all-stations-section" aria-label="지하철역 바로가기">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-[#6B853E] uppercase">
              {pickLang(language, {
                KR: '지하철역 바로가기',
                EN: 'METRO STATIONS',
                JA: '地下鉄駅クイック案内',
                ZH_TW: '地鐵站快速導覽',
                ZH_CN: '地铁站快速导览',
                ES: 'ESTACIONES DE METRO',
                FR: 'STATIONS DE MÉTRO',
              })}
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-[#18181B] tracking-tight mt-0.5">
              {pickLang(language, {
                KR: '부산 지하철역 출구 & 이동 경로',
                EN: 'Accessible Busan Metro Stations',
                JA: '釜山地下鉄 出口エレベーター＆移動ルート',
                ZH_TW: '釜山地鐵站無障礙出口＆電梯地圖',
                ZH_CN: '釜山地铁站无障碍出口＆直梯地图',
                ES: 'Salidas Accesibles y Ascensores del Metro de Busan',
                FR: 'Sorties Accessibles et Ascenseurs du Métro de Busan',
              })}
            </h2>
          </div>

          {/* Line Filter Chips */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 shrink-0" role="tablist" aria-label="호선 필터">
            {[
              {
                id: 'ALL',
                label: pickLang(language, {
                  KR: `전체 (${STATIONS.length})`,
                  EN: `All (${STATIONS.length})`,
                  JA: `すべて (${STATIONS.length})`,
                  ZH_TW: `全部 (${STATIONS.length})`,
                  ZH_CN: `全部 (${STATIONS.length})`,
                  ES: `Todas (${STATIONS.length})`,
                  FR: `Toutes (${STATIONS.length})`,
                }),
              },
              { id: '1', label: formatLineLabelI18n('1', language), color: 'bg-[#F06A00]' },
              { id: '2', label: formatLineLabelI18n('2', language), color: 'bg-[#1b6d24]' },
              { id: '3', label: formatLineLabelI18n('3', language), color: 'bg-[#906A3B]' },
              { id: '동해', label: formatLineLabelI18n('동해', language), color: 'bg-[#003DA5]' },
              {
                id: 'TRANSFER',
                label: pickLang(language, {
                  KR: '환승역',
                  EN: 'Transfer',
                  JA: '乗換駅',
                  ZH_TW: '轉乘站',
                  ZH_CN: '换乘站',
                  ES: 'Transbordo',
                  FR: 'Correspondance',
                }),
              },
            ].map(tab => {
              const isActive = lineFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setLineFilter(tab.id)}
                  role="tab"
                  aria-selected={isActive}
                  className={`px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#18181B] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border border-black/[0.06]'
                  }`}
                >
                  {tab.color && (
                    <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${tab.color}`} />
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subway Station Links Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-2.5 pt-1">
          {filteredStations.map((st) => {
            const stationDisplayName = getLocalizedStationTitle(st, language, true);
            return (
              <a
                key={st.id}
                href={buildLocalizedPath(`/station/${st.id}`, language)}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectStation(st.id);
                }}
                aria-label={`${stationDisplayName} 출구 안내`}
                className="group flex flex-col items-center justify-center bg-white border border-black/[0.05] hover:border-[#8EA85E]/60 rounded-2xl py-2.5 px-1.5 sm:py-3 sm:px-2.5 transition-all duration-200 hover:-translate-y-0.5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-6px_rgba(142,168,94,0.18)] cursor-pointer text-center active:scale-95 min-h-[64px] sm:min-h-[72px] no-underline"
              >
                {/* Station Name */}
                <div className="font-bold text-[#18181B] text-xs sm:text-[14px] tracking-tight group-hover:text-[#6B853E] transition-colors leading-tight truncate max-w-full">
                  {stationDisplayName}
                </div>

                {/* Line Badges (Refined Dot + Soft Pill) */}
                <div className="flex items-center justify-center gap-1 mt-1.5 flex-wrap">
                  {st.lines.map((l) => {
                    const lineInfo = getLineTheme(l);
                    return (
                      <span 
                        key={l}
                        className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${lineInfo.badgeBg} ${lineInfo.badgeText}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${lineInfo.dot}`} />
                        <span>{formatLineLabelI18n(l, language)}</span>
                      </span>
                    );
                  })}
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ==========================================
          3. ACTIVITY CATEGORY CARDS
         ========================================== */}
      <section className="space-y-4 pt-6 sm:pt-8" id="activity-explore-section">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#18181B] tracking-tight">
            {pickLang(language, {
              KR: '부산에서 어디로 떠나볼까?',
              EN: 'Where Shall We Go in Busan?',
              JA: '釜山のどこへ出かけますか？',
              ZH_TW: '今天想去釜山哪裡走走？',
              ZH_CN: '今天想去釜山哪里逛逛？',
              ES: '¿Adónde vamos hoy en Busan?',
              FR: 'Où souhaitez-vous aller à Busan ?',
            })}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 pt-1">
          {recommendedCourses.map((course) => {
            const IconComponent = course.icon;
            return (
              <a 
                key={course.id}
                href={buildLocalizedPath(course.href, language)}
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateToItinerary) {
                    onNavigateToItinerary(course.id);
                  }
                }}
                className={`${course.bg} border ${course.border} rounded-2xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:-translate-y-0.5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_24px_-6px_rgba(142,168,94,0.18)] transition-all duration-200 group select-none active:scale-95 min-h-[62px] sm:min-h-[76px] no-underline`}
              >
                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${course.iconBg} ${course.iconColor} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#18181B] text-xs sm:text-sm md:text-[15px] group-hover:text-[#5B7332] transition-colors leading-tight break-keep">
                    {course.title}
                  </h3>
                  <p className="hidden sm:block text-[11.5px] text-slate-500 mt-0.5 line-clamp-1 break-keep">
                    {course.desc}
                  </p>
                </div>

                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-[#8EA85E] transition-all shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ==========================================
          4. COMPACT 3-PILLAR GUIDE
         ========================================== */}
      <section 
        className="space-y-3.5 pt-6 sm:pt-8" 
        id="editorial-guide-section"
        aria-label="Busan Step-Free Travel Core Guide"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <h2 className="text-base sm:text-lg font-black text-[#18181B] tracking-tight">
            {pickLang(language, {
              KR: '계단 없는 부산여행 핵심 포인트',
              EN: 'Key Points for Step-Free Busan Travel',
              JA: '階段なしで行く釜山バリアフリー旅行の3大ポイント',
              ZH_TW: '免爬樓梯暢遊釜山的 3 大無障礙重點',
              ZH_CN: '无需爬楼畅游釜山的 3 大无障碍重点',
              ES: '3 Claves para Viajar por Busan Sin Escalones',
              FR: '3 Points Clés pour Visiter Busan Sans Marche',
            })}
          </h2>
          <p className="text-xs text-slate-500 break-keep aeo-direct-answer">
            {pickLang(language, {
              KR: '스텝리스(Stepless in Busan)는 부산 도시철도 주요 46개 역의 지상 직결 엘리베이터 출구 번호, 휠체어·유모차·캐리어 무장애 환승 동선, 당일치기~4박5일 추천 여행 코스를 제공합니다.',
              EN: 'Stepless in Busan provides verified street-level elevator exit numbers across 46 major Busan subway stations, step-free stroller and wheelchair routes, and 1 to 5-day Busan travel itineraries.',
              JA: 'Stepless in Busanは釜山地下鉄主要46駅の地上直結エレベーター出口番号、ベビーカー・車椅子・大型スーツケース向けバリアフリー乗換ルート、日帰り〜4泊5日モデルコースを提供します。',
              ZH_TW: 'Stepless in Busan 提供釜山地鐵 46 個主要車站的地面直達電梯出口編號、嬰兒車・輪椅・大型行李箱無障礙轉乘動線，以及一日遊至五天四夜推薦行程。',
              ZH_CN: 'Stepless in Busan 提供釜山地铁 46 个主要车站的地面直达直梯出口编号、婴儿车・轮椅・大件行李箱无障碍换乘路线，以及一日游至五天四晚推荐路线。',
              ES: 'Stepless in Busan ofrece los números exactos de salida con ascensor en 46 estaciones del metro de Busan, rutas sin escalones para cochecitos y sillas de ruedas, e itinerarios de 1 a 5 días.',
              FR: 'Stepless in Busan fournit les numéros exacts de sortie avec ascenseur dans 46 stations du métro de Busan, des parcours sans marche pour poussettes et fauteuils roulants, et des itinéraires de 1 à 5 jours.',
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Card 1 */}
          <a
            href={buildLocalizedPath('/tips/courses/subway', language)}
            onClick={(e) => {
              e.preventDefault();
              onNavigateToItinerary?.('SUBWAY');
            }}
            className="bg-white border border-black/[0.05] hover:border-[#8EA85E]/60 rounded-2xl p-4 sm:p-5 transition-all space-y-2 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-6px_rgba(142,168,94,0.16)] no-underline group"
          >
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#F3F7EC] text-[#5B7332] shrink-0">
                <Train className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-[#18181B] group-hover:text-[#5B7332] transition-colors">
                {pickLang(language, {
                  KR: '주요 환승역 1동선 엘리베이터',
                  EN: 'Direct Station Elevators',
                  JA: '主要46駅の地上直結エレベーター案内',
                  ZH_TW: '46座主要車站地面直達電梯指南',
                  ZH_CN: '46座主要车站地面直达直梯指南',
                  ES: 'Ascensores directos en 46 estaciones clave',
                  FR: 'Ascenseurs directs dans 46 stations clés',
                })}
              </h3>
            </div>
            <p className="text-[11.5px] sm:text-xs text-slate-600 leading-relaxed break-keep">
              {pickLang(language, {
                KR: '서면역(7·11·12·13번), 부산역(4·6번), 해운대역(1·3번), 광안역(3·5번) 등 46개 주요 역사의 승강장부터 지상 보도까지 계단 없이 직결되는 엘리베이터 출구 번호를 안내합니다.',
                EN: 'Find direct platform-to-street elevator exits across 46 major stations including Seomyeon, Busan Station, Haeundae, Gwangan, and Centum City.',
                JA: '西面駅（7・11・12・13番）、釜山駅（4・6番）、海雲台駅（1・3番）、広安駅（3・5番）、センタムシティ駅など主要46駅のホームから地上歩道まで階段なしで直結するエレベーター出口を正確に案内します。',
                ZH_TW: '精準標示西面站（7・11・12・13號）、釜山站（4・6號）、海雲台站（1・3號）、廣安站（3・5號）、Centum City 站等 46 個主要車站從月台直達地面的無障礙電梯出口。',
                ZH_CN: '精准标示西面站（7・11・12・13号）、釜山站（4・6号）、海云台站（1・3号）、广安站（3・5号）、Centum City 站等 46 个主要车站从站台直达地面的无障碍直梯出口。',
                ES: 'Consulta las salidas exactas con ascensor desde el andén hasta la acera en las 46 estaciones principales, incluidas Seomyeon, Busan Station, Haeundae, Gwangan y Centum City.',
                FR: 'Retrouvez les numéros exacts des sorties avec ascenseur reliant les quais à la chaussée dans 46 grandes stations (Seomyeon, Gare de Busan, Haeundae, Gwangan, Centum City).',
              })}
            </p>
          </a>

          {/* Card 2 */}
          <a
            href={buildLocalizedPath('/barrier-free', language)}
            onClick={(e) => {
              e.preventDefault();
              onNavigateToGuide?.('barrier-free');
            }}
            className="bg-white border border-black/[0.05] hover:border-[#8EA85E]/60 rounded-2xl p-4 sm:p-5 transition-all space-y-2 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-6px_rgba(142,168,94,0.16)] no-underline group"
          >
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#F3F7EC] text-[#5B7332] shrink-0">
                <Accessibility className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-[#18181B] group-hover:text-[#5B7332] transition-colors">
                {pickLang(language, {
                  KR: '유모차·휠체어 권역별 평지 동선',
                  EN: 'Flat Regional Boardwalks',
                  JA: 'ベビーカー・車椅子に優しい平坦散策路',
                  ZH_TW: '嬰兒車・輪椅友善的平坦海濱步道',
                  ZH_CN: '婴儿车・轮椅友好的平坦海滨步道',
                  ES: 'Paseos marítimos llanos para cochecitos y sillas de ruedas',
                  FR: 'Promenades côtières plates pour poussettes et fauteuils',
                })}
              </h3>
            </div>
            <p className="text-[11.5px] sm:text-xs text-slate-600 leading-relaxed break-keep">
              {pickLang(language, {
                KR: '해운대·동백섬 우든 데크길과 다대포 생태탐방로, 자갈치·국제시장 평지 아케이드 및 국립해양박물관 등 단차 없이 쾌적하게 둘러볼 수 있는 열린관광지 코스를 선별했습니다.',
                EN: 'Explore step-free coastal boardwalks at Haeundae & Dadaepo, flat market arcades in Nampo, and barrier-free museums.',
                JA: '海雲台・冬柏島のウッドデッキ遊歩道や多大浦生態探訪路、チャガルチ・国際市場の平坦なアーケード、国立海洋博物館など段差なしで快適に楽しめるバリアフリー観光地を厳選しました。',
                ZH_TW: '嚴選海雲台與冬柏島海濱木棧道、多大浦生態步道、札嘎其與國際市場平坦拱廊及國立海洋博物館等零階梯無障礙景點。',
                ZH_CN: '严选海云台与冬柏岛海滨木栈道、多大浦生态步道、札嘎其与国际市场平坦拱廊及国立海洋博物馆等无台阶无障碍景点。',
                ES: 'Recorre las pasarelas costeras sin escalones de Haeundae y Dadaepo, las galerías llanas del Mercado de Jagalchi y Gukje, y museos 100 % accesibles.',
                FR: 'Parcourez les promenades en bois sans marche de Haeundae et Dadaepo, les allées plates des marchés Jagalchi et Gukje, ainsi que les musées accessibles.',
              })}
            </p>
          </a>

          {/* Card 3 */}
          <a
            href={buildLocalizedPath('/tips/transit', language)}
            onClick={(e) => {
              e.preventDefault();
              onNavigateToGuide?.('transit');
            }}
            className="bg-white border border-black/[0.05] hover:border-[#8EA85E]/60 rounded-2xl p-4 sm:p-5 transition-all space-y-2 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-6px_rgba(142,168,94,0.16)] no-underline group"
          >
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#F3F7EC] text-[#5B7332] shrink-0">
                <Luggage className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-[#18181B] group-hover:text-[#5B7332] transition-colors">
                {pickLang(language, {
                  KR: '무료 환승·어린이 혜택 & 캐리어 팁',
                  EN: 'Free Transfers & Luggage Tips',
                  JA: '乗換割引・子ども運賃無料＆コインロッカー案内',
                  ZH_TW: '免費轉乘・兒童免費＆大型行李寄物攻略',
                  ZH_CN: '免费换乘・儿童免费＆大件行李寄存攻略',
                  ES: 'Transbordo gratuito, niños gratis y consignas de equipaje',
                  FR: 'Correspondance gratuite, enfants gratuits & consignes',
                })}
              </h3>
            </div>
            <p className="text-[11.5px] sm:text-xs text-slate-600 leading-relaxed break-keep">
              {pickLang(language, {
                KR: '하차 후 30분 이내 도시철도·버스 무료 환승(최대 2회), 만 6~12세 어린이 요금 무료 혜택, 시내버스 QR 결제 및 28인치 이상 대형 캐리어 물품보관함(T-Luggage) 정보를 제공합니다.',
                EN: 'Learn about 30-minute free transit transfers, free fares for children aged 6–12, bus QR payment, and metro luggage lockers.',
                JA: '降車後30分以内の地下鉄・バス無料乗換（最大2回）、満6〜12歳のお子様運賃無料、市内バスQR決済、28インチ以上の大型スーツケースが入るコインロッカー情報をまとめています。',
                ZH_TW: '提供下車 30 分鐘內地鐵與公車免費轉乘（最多 2 次）、滿 6～12 歲兒童免費搭乘、公車 QR 付款及 28 吋以上特大行李寄物櫃位置資訊。',
                ZH_CN: '提供下车 30 分钟内地铁与公交免费换乘（最多 2 次）、满 6～12 岁儿童免费乘车、公交 QR 扫码乘车及 28 寸以上特大行李寄存柜位置信息。',
                ES: 'Infórmate sobre el transbordo gratuito en 30 minutos entre metro y autobús, transporte gratis para niños de 6 a 12 años y consignas para maletas grandes.',
                FR: 'Découvrez la correspondance gratuite dans les 30 minutes entre métro et bus, la gratuité pour les enfants de 6 à 12 ans et les consignes pour grandes valises.',
              })}
            </p>
          </a>
        </div>
      </section>

      {/* ==========================================
          5. IN-DEPTH BUSAN STEP-FREE TRAVEL & SUBWAY EDITORIAL GUIDE
         ========================================== */}
      <section
        className="bg-white border border-black/[0.05] rounded-2xl p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]"
        id="home-comprehensive-guide"
        aria-label={pickLang(language, {
          KR: '부산 무장애 지하철 및 배리어프리 여행 종합 가이드',
          EN: 'Busan Step-Free Subway & Barrier-Free Travel Comprehensive Guide',
          JA: '釜山バリアフリー地下鉄＆階段なし旅行総合ガイド',
          ZH_TW: '釜山無障礙地鐵＆免爬樓梯自由行綜合指南',
          ZH_CN: '釜山无障碍地铁＆无台阶自由行综合指南',
          ES: 'Guía Integral del Metro Accesible y Viajes Sin Escalones en Busan',
          FR: 'Guide Complet du Métro Accessible et du Voyage Sans Marche à Busan',
        })}
      >
        <div className="space-y-1.5">
          <h2 className="text-base sm:text-lg font-black text-[#18181B] tracking-tight">
            {pickLang(language, {
              KR: '부산 무장애(배리어프리) 지하철 & 권역별 여행 동선 종합 가이드',
              EN: 'Busan Step-Free Subway & Regional Itinerary Planning Guide',
              JA: '釜山バリアフリー地下鉄＆エリア別モデルコース設計ガイド',
              ZH_TW: '釜山無障礙地鐵＆分區旅遊路線規劃完整指南',
              ZH_CN: '釜山无障碍地铁＆分区旅游路线规划完整指南',
              ES: 'Guía de Planificación por Zonas y Metro Sin Escalones en Busan',
              FR: 'Guide de Planification par Quartier et Métro Sans Marche à Busan',
            })}
          </h2>
          <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed break-keep">
            {pickLang(language, {
              KR: '부산은 바다와 산이 맞닿은 입체적인 지형을 가진 해양 관광 도시로, 지하철역 출구 선택과 환승 동선에 따라 여행의 피로도가 크게 달라집니다. 스텝리스(Stepless)는 부산교통공사 공식 승강편의시설 데이터와 한국관광공사 열린관광지(TourAPI) 정보, 그리고 현지 실사를 결합하여 유모차 동반 가족, 휠체어 이용자, 부모님 효도여행 및 캐리어 여행객에게 가장 안전하고 평탄한 이동 경로를 안내합니다.',
              EN: 'Busan is a coastal city where mountains meet the sea, meaning the subway exit and transfer path you choose can make a major difference when traveling with a stroller, wheelchair, or heavy luggage. Stepless combines official Busan Transportation Corporation facility data with Korea Tourism Organization (TourAPI) accessibility records and on-site verification to help you travel across Busan without stairs.',
              JA: '釜山は海と山が隣接する立体的な地形を持つ港町であり、地下鉄の出口選びや乗換ルートによって移動の快適さが大きく変わります。Steplessは釜山交通公社の公式データと韓国観光公社(TourAPI)のバリアフリー情報、現地調査を組み合わせ、ベビーカーや車椅子、スーツケースでも階段なしで巡れる最適ルートを案内します。',
              ZH_TW: '釜山是山海相連的海港城市，地鐵站出口選擇與轉乘動線會直接影響推嬰兒車、輪椅或攜帶大型行李箱的舒適度。Stepless 結合釜山交通公社官方數據、韓國觀光公社(TourAPI)無障礙資料與實地踏查，為親子家庭、孝親遊與自由行旅客提供最平緩安全的無階梯路線。',
              ZH_CN: '釜山是山海相连的海滨城市，地铁站出口选择与换乘路线会直接影响推婴儿车、轮椅或携带大件行李箱的出行体验。Stepless 结合釜山交通公社官方数据、韩国观光公社(TourAPI)无障碍数据与实地勘查，为亲子家庭、父母出游与自由行游客提供最平缓安全的无台阶路线。',
              ES: 'Busan es una ciudad costera rodeada de montañas donde elegir la salida de metro correcta marca la diferencia al viajar con cochecito, silla de ruedas o maletas. Stepless combina datos oficiales de Busan Transportation Corporation y Korea Tourism Organization con verificaciones en terreno para ofrecer rutas 100 % sin escalones.',
              FR: 'Busan est une ville côtière vallonnée où le choix de la sortie de métro change tout lorsqu’on voyage avec une poussette, un fauteuil roulant ou des valises. Stepless combine les données officielles de Busan Transportation Corporation et de la Korea Tourism Organization avec des relevés sur le terrain pour garantir des trajets sans marche.',
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          <article className="bg-[#FAF9F6] border border-black/[0.04] rounded-xl p-4 space-y-1.5">
            <h3 className="font-bold text-xs sm:text-[13.5px] text-[#18181B]">
              {pickLang(language, {
                KR: '1. 도시철도 1~4호선·동해선·경전철 환승 및 지상 엘리베이터 기준',
                EN: '1. Metro Lines 1–4, Donghae Line & Airport LRT Elevator Standards',
                JA: '1. 地下鉄1〜4号線・東海線・空港軽電鉄のエレベーター＆乗換基準',
                ZH_TW: '1. 地鐵 1～4 號線・東海線・機場輕軌電梯與轉乘標準',
                ZH_CN: '1. 地铁 1～4 号线・东海线・机场轻轨直梯与换乘标准',
                ES: '1. Criterios de Ascensor y Transbordo en Líneas 1–4, Donghae y Tren Ligero',
                FR: '1. Normes d’Ascenseur et de Correspondance (Lignes 1–4, Donghae et LRT)',
              })}
            </h3>
            <p className="text-[11.5px] sm:text-xs text-slate-600 leading-relaxed break-keep">
              {pickLang(language, {
                KR: '1·2호선 최대 환승역인 서면역(7·11·12·13번 출구 엘리베이터)과 KTX 부산역(1호선 4·6번 출구 엘리베이터 및 2층 보행데크 직결), 김해국제공항 관문인 사상역(경전철-2호선 무장애 환승통로)은 승강장부터 대합실·지상 보도까지 끊김 없이 이어지는 1동선 엘리베이터 확인이 핵심입니다. 상대식 승강장 역사에서는 개찰구 진입 전 행선지 방향을 먼저 확인하시고, 실수로 반대편 개찰구에 진입하더라도 10분 이내 동일 역 재진입 시 추가 요금이 부과되지 않습니다.',
                EN: 'At major hubs like Seomyeon Station (Exits 7, 11, 12, 13 elevators), KTX Busan Station (Line 1 Exits 4 & 6 elevators linked to the 2F skywalk deck), and Sasang Station (Gimhae Airport LRT to Line 2 transfer), checking continuous platform-to-street elevators saves time. At side-platform stations, if you accidentally enter the wrong direction gate, tapping out and re-entering the opposite gate within 10 minutes at the same station is completely free.',
                JA: '1・2号線最大の乗換駅である西面駅（7・11・12・13番出口エレベーター）、KTX釜山駅（1号線4・6番出口エレベーター＆2階歩行デッキ直結）、金海空港玄関口の沙上駅ではホームから地上歩道まで直結するエレベーター確認が重要です。また相対式ホームの駅で反対方向の改札に誤入場しても、同じ駅で10分以内にタッチし直せば追加料金なしで再入場できます。',
                ZH_TW: '在 1・2 號線最大轉乘站西面站（7、11、12、13 號出口電梯）、KTX 釜山站（1 號線 4、6 號出口電梯直通 2 樓空中步道）與金海機場門戶沙上站，事先確認從月台直達地面的電梯最能節省體力。若在側式月台不小心進錯方向閘門，同站 10 分鐘內刷卡出站再進站享免費重進優惠。',
                ZH_CN: '在 1・2 号线最大换乘站西面站（7、11、12、13 号出口直梯）、KTX 釜山站（1 号线 4、6 号出口直梯连通 2 楼空中廊桥）与金海机场门户沙上站，提前确认从站台直达地面的电梯最省力。若在侧式站台误入反方向闸机，同站 10 分钟内刷卡出站再进站免收额外车费。',
                ES: 'En estaciones clave como Seomyeon (salidas 7, 11, 12 y 13 con ascensor), Estación KTX de Busan (salidas 4 y 6) y Sasang (enlace con el Aeropuerto de Gimhae), verificar los ascensores directos desde el andén evita rodeos. Si entras al andén equivocado, puedes salir y reingresar gratis en menos de 10 minutos.',
                FR: 'Dans les gares majeures comme Seomyeon (ascenseurs sorties 7, 11, 12, 13), Gare KTX de Busan (sorties 4 et 6) et Sasang (liaison aéroport de Gimhae), repérer les ascenseurs directs du quai à la rue est essentiel. En cas d’erreur de quai, la réentrée dans les 10 minutes à la même station est gratuite.',
              })}
            </p>
          </article>

          <article className="bg-[#FAF9F6] border border-black/[0.04] rounded-xl p-4 space-y-1.5">
            <h3 className="font-bold text-xs sm:text-[13.5px] text-[#18181B]">
              {pickLang(language, {
                KR: '2. 동부산(해운대·기장) & 원도심(남포·자갈치·영도) 권역별 추천 동선',
                EN: '2. East Busan (Haeundae & Gijang) vs. Old Town (Nampo & Jagalchi) Routes',
                JA: '2. 東釜山（海雲台・機張）＆旧都心（南浦・チャガルチ・影島）おすすめ動線',
                ZH_TW: '2. 東釜山（海雲台・機張）＆舊城區（南浦・札嘎其・影島）分區路線',
                ZH_CN: '2. 东釜山（海云台・机张）＆老城区（南浦・札嘎其・影岛）分区路线',
                ES: '2. Rutas por el Este de Busan (Haeundae y Gijang) y Casco Antiguo (Nampo)',
                FR: '2. Itinéraires Est de Busan (Haeundae & Gijang) et Vieille Ville (Nampo)',
              })}
            </h3>
            <p className="text-[11.5px] sm:text-xs text-slate-600 leading-relaxed break-keep">
              {pickLang(language, {
                KR: '동부산 권역은 해운대역(1·3번 출구 엘리베이터)에서 구남로 문화광장, 해운대 해수욕장 호안도로 우든 데크길, 동백섬 APEC나루공원 평지 산책로, 블루라인파크 미포정거장까지 단차 없이 이어지며, 센텀시티역·벡스코역·오시리아역(동해선)을 통해 신세계 센텀시티와 롯데월드·국립부산과학관으로 편리하게 이동할 수 있습니다. 원도심 권역은 자갈치역(3·6·10번 출구)과 남포역(1·7번 출구 및 백화점 엘리베이터)을 거점으로 자갈치시장 현대화 건물, BIFF광장, 부평깡통시장·국제시장 평지 아케이드와 영도 국립해양박물관을 묶어 여행하는 코스가 가장 효율적입니다.',
                EN: 'In East Busan, take Haeundae Station (Exit 1 or 3 elevator) to walk along flat Gunam-ro Plaza, Haeundae Beach Wooden Deck, Dongbaekseom APEC Park, and Blueline Park Mipo Station, or connect via Centum City, BEXCO, and Osiria Station to Shinsegae Centum City and Lotte World Busan. In Old Town, use Jagalchi Station (Exits 3/6/10) and Nampo Station (Exits 1/7) to explore the modern Jagalchi Fish Market building, BIFF Square, Gukje & Bupyeong Kkangtong Market flat arcades, and the National Maritime Museum in Yeongdo.',
                JA: '東釜山エリアは海雲台駅（1・3番出口エレベーター）から亀南路広場、海雲台ビーチの海辺ウッドデッキ、冬柏島APECナル公園、ブルーラインパーク尾浦停留場まで段差なしで繋がり、センタムシティ駅やオシリア駅経由で新世界百貨店やロッテワールドへ快適に移動できます。旧都心エリアはチャガルチ駅（3・6・10番出口）と南浦駅を拠点に、チャガルチ市場ビル、BIFF広場、国際市場・富平カントン夜市の平坦なアーケードや国立海洋博物館を巡るのが効率的です。',
                ZH_TW: '東釜山區域可由海雲台站（1・3 號出口電梯）沿平坦的龜南路廣場、海雲台海濱木棧道、冬柏島 APEC 公園一路漫步至藍線公園尾浦站，並可搭乘地鐵與東海線前往新世界百貨 Centum City 與 오시리아(Osiria) 樂天世界。舊城區則建議以札嘎其站（3・6・10 號出口）與南浦站為中心，串聯札嘎其市場大樓、BIFF 廣場、國際市場與富平罐頭夜市平坦拱廊及影島國立海洋博物館。',
                ZH_CN: '东釜山区域可由海云台站（1・3 号出口直梯）沿平坦的龟南路广场、海云台海滨木栈道、冬柏岛 APEC 公园漫步至蓝线公园尾浦站，并可乘地铁与东海线前往新世界百货 Centum City 与奥西利亚乐天世界。老城区建议以札嘎其站（3・6・10 号出口）与南浦站为中心，串联札嘎其市场大楼、BIFF 广场、国际市场与富平罐头夜市平坦拱廊及影岛国立海洋博物馆。',
                ES: 'En el Este de Busan, la estación Haeundae (ascensor salidas 1 y 3) conecta sin escalones con la plaza Gunam-ro, el paseo entarimado de Haeundae, la isla Dongbaekseom y Blueline Park, además de Centum City y Osiria. En el Casco Antiguo, las estaciones Jagalchi y Nampo permiten recorrer sin barreras el Mercado de Pescado Jagalchi, la plaza BIFF, el Mercado Gukje y el Museo Marítimo Nacional.',
                FR: 'À l’Est de Busan, la station Haeundae (ascenseur sorties 1 et 3) rejoint sans marche la place Gunam-ro, la promenade en bois de Haeundae, l’île de Dongbaekseom et le Blueline Park, ainsi que Centum City et Osiria. Dans la Vieille Ville, les stations Jagalchi et Nampo donnent un accès plat au marché aux poissons de Jagalchi, à la place BIFF, au marché Gukje et au Musée Maritime National.',
              })}
            </p>
          </article>

          <article className="bg-[#FAF9F6] border border-black/[0.04] rounded-xl p-4 space-y-1.5">
            <h3 className="font-bold text-xs sm:text-[13.5px] text-[#18181B]">
              {pickLang(language, {
                KR: '3. 대중교통 30분 무료 환승·어린이 요금 0원 및 무료 짐 보관소 활용',
                EN: '3. 30-Min Free Transfers, Free Child Fares & Free Luggage Lounges',
                JA: '3. 30分無料乗換・子供運賃0円＆4大無料荷物預かり所の活用術',
                ZH_TW: '3. 30分鐘免費轉乘・兒童車資0元＆4大免費行李寄放處活用法',
                ZH_CN: '3. 30分钟免费换乘・儿童车费0元＆4大免费行李寄存处活用法',
                ES: '3. Transbordos Gratis en 30 Min, Niños Gratis y Consignas Gratuitas',
                FR: '3. Correspondances Gratuites 30 Min, Enfants Gratuits & Consignes',
              })}
            </h3>
            <p className="text-[11.5px] sm:text-xs text-slate-600 leading-relaxed break-keep">
              {pickLang(language, {
                KR: '부산 도시철도와 시내버스·마을버스는 하차 단말기 태그 후 30분 이내 갈아타면 최대 2회까지 무료 환승이 적용됩니다. 만 6세 미만 영유아 및 생년월일이 등록된 어린이 교통카드(만 6~12세) 이용자는 부산 지하철과 시내버스를 무료(0원)로 탑승할 수 있습니다. 24~28인치 이상 대형 캐리어는 시내버스 반입이 제한될 수 있으므로 부산역(부산트래블라운지), 서면(롯데백화점), 해운대(해운대플랫폼), 광안리(관광안내소)의 무료 짐 보관소나 지하철 물품보관함(T-Luggage)을 적극 활용하세요.',
                EN: 'Tapping your T-money or EZL transit card when exiting grants up to 2 free transfers within 30 minutes between Busan subway lines and city/village buses. Children under 6 ride free, and children aged 6–12 enjoy 0 KRW fares on buses and subway lines with a registered child transit card. Since suitcases over 24–28 inches may be restricted on city buses, use subway elevators and the 4 free luggage lounges at Busan Station, Seomyeon, Haeundae, and Gwangalli.',
                JA: '釜山地下鉄と市内バス・マウルバスは降車タッチ後30分以内の乗換で最大2回まで無料乗換割引が適用されます。満6歳未満の乳幼児および生年月日登録済みの子供用交通カード（満6〜12歳）は釜山地下鉄・バス運賃が無料（0ウォン）です。大型スーツケースは市内バスへの持ち込みが制限される場合があるため、釜山駅・西面・海雲台・広安里の無料荷物預かり所や駅コインロッカーをご活用ください。',
                ZH_TW: '使用 T-money 等交通卡於下車刷卡後 30 分鐘內轉乘釜山地鐵與市區／社區巴士，可享最多 2 次免費轉乘。未滿 6 歲幼童及持登錄生日兒童卡的 6～12 歲兒童搭乘釜山地鐵與公車完全免費（0韓元）。由於 24～28 吋以上大行李箱可能無法帶上公車，建議善用釜山站、西面、海雲台與廣安里的 4 處免費行李寄放服務或地鐵寄物櫃。',
                ZH_CN: '使用 T-money 等交通卡在下车刷卡后 30 分钟内换乘釜山地铁与市区／社区公交，可享最多 2 次免费换乘。未满 6 岁幼童及持实名儿童卡的 6～12 岁儿童乘坐釜山地铁与公交完全免费（0韩元）。由于 24～28 寸以上大件行李箱可能受限上公交，建议善用釜山站、西面、海云台与广安里的 4 处免费行李寄存处或地铁寄存柜。',
                ES: 'Al validar tu tarjeta T-money al bajar, dispones de hasta 2 transbordos gratuitos en 30 minutos entre el metro y los autobuses de Busan. Los menores de 6 años y niños de 6 a 12 años con tarjeta infantil viajan gratis. Como las maletas grandes tienen restricciones en los autobuses urbanos, utiliza las consignas gratuitas en Busan Station, Seomyeon, Haeundae y Gwangalli.',
                FR: 'En badgeant votre carte T-money à la descente, vous bénéficiez de 2 correspondances gratuites dans les 30 minutes entre métro et bus à Busan. Les enfants de moins de 6 ans et de 6 à 12 ans (avec carte enfant) voyagent gratuitement. Les grandes valises étant limitées dans les bus, profitez des consignes gratuites à la gare de Busan, Seomyeon, Haeundae et Gwangalli.',
              })}
            </p>
          </article>
        </div>
      </section>

      {/* ==========================================
          6. VISIBLE FAQ SECTION (Matches FAQPage JSON-LD & Speakable)
         ========================================== */}
      <section
        id="aeo-qa-section"
        aria-label={pickLang(language, {
          KR: '부산 여행 코스 & 지하철 엘리베이터 자주 묻는 질문 (FAQ)',
          EN: 'Frequently Asked Questions: Busan Itinerary & Step-Free Subway Guide',
          JA: 'よくある質問（FAQ）：釜山モデルコース＆地下鉄エレベーター案内',
          ZH_TW: '常見問題（FAQ）：釜山自由行行程＆地鐵無障礙電梯指南',
          ZH_CN: '常见问题（FAQ）：釜山自由行路线＆地铁无障碍直梯指南',
          ES: 'Preguntas Frecuentes (FAQ): Itinerarios por Busan y Metro Sin Escalones',
          FR: 'Questions Fréquentes (FAQ) : Itinéraires à Busan et Métro Sans Marche',
        })}
        className="bg-white border border-black/[0.05] rounded-2xl p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]"
      >
        <h2 className="text-base sm:text-lg font-black text-[#18181B] tracking-tight">
          {pickLang(language, {
            KR: '부산 여행 코스 & 무장애 지하철 자주 묻는 질문 (FAQ)',
            EN: 'Frequently Asked Questions: Busan Travel & Step-Free Subway (FAQ)',
            JA: '釜山旅行コース＆地下鉄バリアフリー よくある質問（FAQ）',
            ZH_TW: '釜山自由行行程＆無障礙地鐵 常見問題（FAQ）',
            ZH_CN: '釜山自由行路线＆无障碍地铁 常见问题（FAQ）',
            ES: 'Preguntas Frecuentes sobre Viajes y Metro Accesible en Busan (FAQ)',
            FR: 'Questions Fréquentes sur le Voyage et le Métro Accessible à Busan (FAQ)',
          })}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {[
            {
              q: pickLang(language, {
                KR: 'Q1. 부산 1박 2일·2박 3일 여행 코스는 어떻게 짜는 것이 가장 효율적인가요?',
                EN: 'Q1. How should I plan a 2-day or 3-day Busan trip itinerary?',
                JA: 'Q1. 釜山1泊2日・2泊3日旅行のモデルコースはどう組むのが効率的ですか？',
                ZH_TW: 'Q1. 釜山兩天一夜、三天兩夜自由行行程怎麼安排最順路？',
                ZH_CN: 'Q1. 釜山两天一夜、三天两夜自由行路线怎么安排最顺路？',
                ES: 'Q1. ¿Cómo organizar un itinerario de 2 o 3 días en Busan?',
                FR: 'Q1. Comment organiser un itinéraire de 2 ou 3 jours à Busan ?',
              }),
              a: pickLang(language, {
                KR: '첫째 날은 동부산(해운대 해수욕장 데크길 · 블루라인파크 스카이캡슐 · 광안리 해변 야경 및 토요일 드론쇼), 둘째 날은 원도심과 영도(자갈치시장 · 국제시장 · 감천문화마을 · 흰여울문화마을 · 국립해양박물관), 셋째 날은 기장(해동용궁사 · 오시리아 루지 · 롯데월드) 또는 서면·전포카페거리를 묶어 이동하면 지하철 환승을 최소화하며 알차게 여행할 수 있습니다.',
                EN: 'Spend Day 1 in East Busan (Haeundae Beach boardwalk, Blueline Park Sky Capsule, and Gwangalli Beach night view & Saturday Drone Show), Day 2 in Old Town & Yeongdo (Jagalchi Fish Market, Gukje Market, Gamcheon Culture Village, and Huinnyeoul Culture Village), and Day 3 in Gijang (Haedong Yonggungsa Temple, Skyline Luge, Lotte World) or Seomyeon & Jeonpo Cafe Street.',
                JA: '1日目は東釜山（海雲台ビーチ・ブルーラインパークのスカイカプセル・広安里の夜景＆土曜ドローンショー）、2日目は旧都心と影島（チャガルチ市場・国際市場・甘川文化村・ヒニョウル文化村）、3日目は機張（海東龍宮寺・オシリアのリュージュやロッテワールド）または西面・田浦カフェ通りを巡ると乗換ロスなく回れます。',
                ZH_TW: '建議 Day 1 安排東釜山海景線（海雲台海濱步道、藍線公園膠囊列車、廣安里夜景與週六無人機秀），Day 2 走訪舊城區與影島（札嘎其市場、國際市場、甘川洞文化村、白淺灘文化村），Day 3 前往機張（海東龍宮寺、斜坡滑車、樂天世界）或西面田浦咖啡街。',
                ZH_CN: '建议 Day 1 安排东釜山海景线（海云台海滨步道、蓝线公园胶囊小火车、广安里夜景与周六无人机秀），Day 2 走访老城区与影岛（札嘎其市场、国际市场、甘川文化村、白浅滩文化村），Day 3 前往机张（海东龙宫寺、斜坡滑车、乐天世界）或西面田浦咖啡街。',
                ES: 'Dedica el Día 1 al Este (Playa Haeundae, Sky Capsule de Blueline Park y noche en Gwangalli), el Día 2 al Casco Antiguo y Yeongdo (Mercado Jagalchi, Mercado Gukje, Gamcheon y Huinnyeoul) y el Día 3 a Gijang (Templo Haedong Yonggungsa, Luge) o Seomyeon.',
                FR: 'Consacrez le Jour 1 à l’Est (Plage de Haeundae, Sky Capsule Blueline Park et soirée à Gwangalli), le Jour 2 à la Vieille Ville et Yeongdo (Marché de Jagalchi, Marché Gukje, Gamcheon et Huinnyeoul) et le Jour 3 à Gijang (Temple Haedong Yonggungsa, Luge) ou Seomyeon.',
              }),
            },
            {
              q: pickLang(language, {
                KR: 'Q2. 서면역과 KTX 부산역에서 유모차·캐리어로 갈 때 몇 번 출구 엘리베이터를 타야 하나요?',
                EN: 'Q2. Which elevator exits should I use at Seomyeon Station and KTX Busan Station?',
                JA: 'Q2. 西面駅とKTX釜山駅でベビーカーやスーツケース移動におすすめのエレベーター出口は？',
                ZH_TW: 'Q2. 在西面站與 KTX 釜山站推嬰兒車或拖行李箱，應該搭幾號出口的電梯？',
                ZH_CN: 'Q2. 在西面站与 KTX 釜山站推婴儿车或拖行李箱，应该乘几号出口的电梯？',
                ES: 'Q2. ¿Qué salidas con ascensor debo usar en la estación Seomyeon y en la estación KTX de Busan?',
                FR: 'Q2. Quelles sorties avec ascenseur utiliser à la station Seomyeon et à la gare KTX de Busan ?',
              }),
              a: pickLang(language, {
                KR: '1·2호선 환승역인 서면역은 지상 직결 엘리베이터가 설치된 7번·11번·12번·13번 출구 및 롯데백화점 지하 연결 통로를 이용하면 계단 없이 지상으로 나갈 수 있습니다. KTX 부산역은 지하철 1호선 부산역 4번·6번 출구 지상 엘리베이터와 KTX 역사 2층 보행 데크 엘리베이터가 평지로 연결되어 있습니다.',
                EN: 'At Seomyeon Station (Lines 1 & 2 transfer hub), Exits 7, 11, 12, and 13 have direct street-level elevators, alongside underground elevator access through Lotte Department Store. At Busan Station, Subway Line 1 Exits 4 and 6 provide street-level elevators that connect across a flat plaza directly to the KTX Busan Station elevators.',
                JA: '1・2号線乗換駅の西面駅では7番・11番・12番・13番出口に地上直結エレベーターがあり、ロッテ百貨店地下連絡通路も利用可能です。KTX釜山駅では地下鉄1号線・釜山駅の4番・6番出口エレベーターから平坦な広場を通ってKTX駅舎エレベーターへ直結しています。',
                ZH_TW: '在 1・2 號線交會的西面站，7 號、11 號、12 號與 13 號出口設有地面直達電梯，亦可連通樂天百貨地下電梯。在 KTX 釜山站，地鐵 1 號線釜山站 4 號與 6 號出口設有地面電梯，出站後經平坦廣場即可直達 KTX 車站大樓電梯。',
                ZH_CN: '在 1・2 号线换乘枢纽西面站，7 号、11 号、12 号与 13 号出口设有地面直达电梯，也可连通乐天百货地下电梯。在 KTX 釜山站，地铁 1 号线釜山站 4 号与 6 号出口设有地面直梯，出站后经平坦广场即可直达 KTX 车站大楼电梯。',
                ES: 'En la estación Seomyeon (transbordo Líneas 1 y 2), las salidas 7, 11, 12 y 13 cuentan con ascensores directos a la calle. En la estación de Busan, las salidas 4 y 6 de la Línea 1 tienen ascensores que conectan en llano con los ascensores de la terminal KTX.',
                FR: 'À la station Seomyeon (correspondance Lignes 1 et 2), les sorties 7, 11, 12 et 13 disposent d’ascenseurs directs vers la rue. À la gare de Busan, les sorties 4 et 6 de la Ligne 1 offrent des ascenseurs reliés à plat au hall de la gare KTX.',
              }),
            },
            {
              q: pickLang(language, {
                KR: 'Q3. 김해국제공항(PUS)에서 해운대·광안리·서면·남포동까지 계단 없이 어떻게 이동하나요?',
                EN: 'Q3. How do I travel step-free from Gimhae Airport (PUS) to Haeundae, Gwangalli, or Seomyeon?',
                JA: 'Q3. 金海国際空港（PUS）から海雲台・広安里・西面へ階段なしで行く方法は？',
                ZH_TW: 'Q3. 如何從金海國際機場（PUS）免爬樓梯前往海雲台、廣安里、西面或南浦洞？',
                ZH_CN: 'Q3. 如何从金海国际机场（PUS）无台阶前往海云台、广安里、西面或南浦洞？',
                ES: 'Q3. ¿Cómo ir sin escalones desde el Aeropuerto de Gimhae (PUS) a Haeundae, Gwangalli o Seomyeon?',
                FR: 'Q3. Comment aller sans marche de l’aéroport de Gimhae (PUS) à Haeundae, Gwangalli ou Seomyeon ?',
              }),
              a: pickLang(language, {
                KR: '김해공항역에서 부산김해경전철(전 역사 엘리베이터 완비)을 타고 3정거장 뒤인 사상역에서 하차한 뒤, 무장애 환승 통로 엘리베이터로 도시철도 2호선에 탑승하면 서면역(약 20분), 광안역·해운대역(약 50분)까지 환승 없이 한 번에 이동할 수 있습니다.',
                EN: 'Take the Busan-Gimhae Light Rail (equipped with large elevators at every station) 3 stops from Gimhae Airport to Sasang Station, then follow the step-free elevator transfer passage to Subway Line 2. Line 2 takes you directly to Seomyeon (20 mins), Gwangan (45 mins), and Haeundae (55 mins).',
                JA: '金海空港駅から釜山金海軽電鉄（全駅エレベーター完備）で3駅の沙上駅まで行き、バリアフリー乗換通路のエレベーターで地下鉄2号線に乗り換えると、西面駅（約20分）、広安駅・海雲台駅（約50分）まで1本で移動できます。',
                ZH_TW: '從金海機場站搭乘釜山金海輕軌（全線設有大型電梯）3 站至沙上站，經由無障礙電梯轉乘通道換乘地鐵 2 號線，即可免換車直達西面站（約 20 分鐘）、廣安站與海雲台站（約 50 分鐘）。',
                ZH_CN: '从金海机场站乘坐釜山金海轻轨（全线配备大型直梯）3 站至沙上站，通过无障碍电梯换乘通道换乘地铁 2 号线，即可一车直达西面站（约 20 分钟）、广安站与海云台站（约 50 分钟）。',
                ES: 'Toma el tren ligero Busan-Gimhae (con ascensores en todas las estaciones) 3 paradas desde el aeropuerto hasta Sasang y usa el pasillo accesible hacia la Línea 2 del metro, que te lleva directo a Seomyeon (20 min), Gwangan y Haeundae (50 min).',
                FR: 'Prenez le métro léger Busan-Gimhae (équipé d’ascenseurs) sur 3 stations jusqu’à Sasang, puis empruntez le couloir avec ascenseur vers la Ligne 2 du métro, directe pour Seomyeon (20 min), Gwangan et Haeundae (50 min).',
              }),
            },
            {
              q: pickLang(language, {
                KR: 'Q4. 광안리 드론쇼 시간과 해운대 블루라인파크 스카이캡슐 무장애 접근법은?',
                EN: 'Q4. When is the Gwangalli Drone Show and how do I reach Haeundae Sky Capsule step-free?',
                JA: 'Q4. 広安里ドローンショーの時間と海雲台スカイカプセルへのバリアフリーアクセスは？',
                ZH_TW: 'Q4. 廣安里無人機秀時間是幾點？如何無障礙前往海雲台膠囊列車？',
                ZH_CN: 'Q4. 广安里无人机表演是几点？如何无障碍前往海云台胶囊小火车？',
                ES: 'Q4. ¿A qué hora es el show de drones de Gwangalli y cómo llegar sin escalones al Sky Capsule?',
                FR: 'Q4. À quelle heure a lieu le spectacle de drones de Gwangalli et comment accéder à la Sky Capsule ?',
              }),
              a: pickLang(language, {
                KR: '광안리 M 드론라이트쇼는 매주 토요일 저녁 2회(4~9월 20:00·22:00 / 10~3월 19:00·21:00) 무료로 열리며 2호선 광안역 3·5번 출구 엘리베이터에서 평지로 도보 7분 거리입니다. 해운대 블루라인파크 미포정거장은 해운대역 1·3번 출구 엘리베이터에서 구남로와 해변 데크길을 따라 단차 없이 이동할 수 있으며, 탑승장 내 승강기가 설치되어 있습니다.',
                EN: 'The free Gwangalli M Drone Light Show runs every Saturday evening twice (20:00 & 22:00 Apr–Sep; 19:00 & 21:00 Oct–Mar)—take Line 2 Gwangan Station Exit 3 or 5 elevator for a flat 7-minute walk. For Haeundae Blueline Park Mipo Station, take Haeundae Station Exit 1 or 3 elevator and follow flat Gunam-ro and the beachfront wooden deck; Mipo Station has elevator access to the boarding platform.',
                JA: '広安里Mドローンライトショーは毎週土曜夜に2回（4〜9月は20:00・22:00、10〜3月は19:00・21:00）無料開催され、2号線広安駅3・5番出口エレベーターから平坦な道で徒歩7分です。海雲台ブルーラインパーク尾浦停留場は海雲台駅1・3番出口エレベーターから亀南路と海辺デッキ経由で段差なしでアクセスでき、乗り場にもエレベーターがあります。',
                ZH_TW: '廣安里 M 無人機秀每週六晚間免費演出兩場（4～9 月 20:00、22:00；10～3 月 19:00、21:00），從 2 號線廣安站 3・5 號出口電梯直走 7 分鐘即達。海雲台藍線公園尾浦站則可由海雲台站 1・3 號出口電梯沿龜南路與海濱木棧道平地前往，車站內設有電梯直達月台。',
                ZH_CN: '广安里 M 无人机秀每周六晚免费演出两场（4～9 月 20:00、22:00；10～3 月 19:00、21:00），从 2 号线广安站 3・5 号出口直梯直行 7 分钟即达。海云台蓝线公园尾浦站可由海云台站 1・3 号出口直梯沿龟南路与海滨木栈道平地前往，站内设有电梯直达乘车层。',
                ES: 'El show gratuito de drones en Gwangalli se realiza cada sábado por la noche (20:00 y 22:00 abr–sep; 19:00 y 21:00 oct–mar), a 7 minutos en llano desde el ascensor de la salida 3 o 5 de Gwangan. Para la estación Mipo del Sky Capsule, usa el ascensor de la salida 1 o 3 de Haeundae y camina por el paseo marítimo llano.',
                FR: 'Le spectacle gratuit de drones à Gwangalli a lieu chaque samedi soir (20h et 22h avr–sep ; 19h et 21h oct–mar), à 7 minutes à plat de l’ascenseur des sorties 3 ou 5 de Gwangan. Pour la gare Mipo de la Sky Capsule, prenez l’ascenseur des sorties 1 ou 3 de Haeundae puis la promenade côtière plate.',
              }),
            },
          ].map((item, idx) => (
            <article
              key={idx}
              className="bg-[#FAF9F6] border border-black/[0.04] rounded-xl p-4 space-y-1.5"
            >
              <h3 className="font-bold text-xs sm:text-[13.5px] text-[#18181B] leading-snug break-keep">
                {item.q}
              </h3>
              <p className="text-[11.5px] sm:text-xs text-slate-600 leading-relaxed break-keep">
                {item.a}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ==========================================
          7. COMPACT ABOUT & VERIFICATION BANNER
         ========================================== */}
      <section className="pt-2" id="about-verification-banner">
        <div className="bg-white border border-black/[0.05] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F3F7EC] text-[#5B7332] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#18181B]">
                {pickLang(language, {
                  KR: '스텝리스 서비스 소개 및 공공데이터 검증',
                  EN: 'About Stepless & Data Verification',
                  JA: 'Stepless サービス紹介＆公式データ検証基準',
                  ZH_TW: 'Stepless 服務介紹與官方公共數據驗證',
                  ZH_CN: 'Stepless 服务介绍与官方公共数据核验',
                  ES: 'Sobre Stepless y Verificación de Datos Oficiales',
                  FR: 'À propos de Stepless & Vérification des Données',
                })}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {pickLang(language, {
                  KR: '부산교통공사 공식 데이터 및 현장 실사를 기반으로 정기 검증됩니다.',
                  EN: 'Verified with Busan Transit Authority open data and regular on-site checks.',
                  JA: '釜山交通公社の公式データおよび現地調査に基づき定期検証されています。',
                  ZH_TW: '結合釜山交通公社官方數據、Naver 地圖與實地踏查定期更新驗證。',
                  ZH_CN: '结合釜山交通公社官方数据、Naver 地图与实地踏勘定期更新核验。',
                  ES: 'Verificado periódicamente con datos abiertos de Busan Transportation Corporation e inspecciones en terreno.',
                  FR: 'Vérifié régulièrement à partir des données officielles de Busan Transportation Corporation et de relevés sur le terrain.',
                })}
              </p>
            </div>
          </div>

          <a
            href={buildLocalizedPath('/about', language)}
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateToAbout) {
                onNavigateToAbout();
              }
            }}
            className="self-end sm:self-center shrink-0 px-4 py-2 rounded-xl bg-[#FAF9F6] hover:bg-[#F3F7EC] border border-black/[0.06] text-[#18181B] hover:text-[#5B7332] font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer no-underline"
          >
            <span>
              {pickLang(language, {
                KR: '자세히 보기',
                EN: 'Learn More',
                JA: '詳しく見る',
                ZH_TW: '了解更多',
                ZH_CN: '了解更多',
                ES: 'Más información',
                FR: 'En savoir plus',
              })}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

    </div>
  );
}
