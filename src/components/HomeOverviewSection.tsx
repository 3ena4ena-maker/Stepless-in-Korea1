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
import { DICTIONARY, Language, pickLang } from '../i18n/dictionary';
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
                href={`/station/${st.id}`}
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
                href={course.href}
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
          <p className="text-xs text-slate-500 break-keep">
            {pickLang(language, {
              KR: '휠체어·유모차·캐리어 여행객을 위한 부산 지하철 및 무장애 이동 기준입니다.',
              EN: 'Essential step-free transit and accessibility standards for Busan travelers.',
              JA: 'ベビーカー・車椅子・大型スーツケース旅行者のための釜山地下鉄＆バリアフリー移動基準です。',
              ZH_TW: '專為嬰兒車家庭、輪椅族與大型行李箱旅客整理的釜山地鐵與無障礙移動標準。',
              ZH_CN: '专为婴儿车家庭、轮椅出行者与大件行李箱旅客整理的釜山地铁与无障碍出行标准。',
              ES: 'Estándares de movilidad accesible para viajeros con cochecito, silla de ruedas o equipaje en Busan.',
              FR: 'Repères de mobilité sans marche pour les voyageurs en poussette, fauteuil roulant ou avec bagages à Busan.',
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Card 1 */}
          <a
            href="/tips/courses/subway"
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
                  JA: '主要22駅の地上直結エレベーター案内',
                  ZH_TW: '22座主要車站地面直達電梯指南',
                  ZH_CN: '22座主要车站地面直达直梯指南',
                  ES: 'Ascensores directos en 22 estaciones clave',
                  FR: 'Ascenseurs directs dans 22 stations clés',
                })}
              </h3>
            </div>
            <p className="text-[11.5px] sm:text-xs text-slate-600 leading-relaxed break-keep">
              {pickLang(language, {
                KR: '서면역(7·11·12·13번), 부산역(4·6번), 해운대역(1·3번), 광안역(3·5번) 등 22개 주요 역사의 승강장부터 지상 보도까지 계단 없이 직결되는 엘리베이터 출구 번호를 안내합니다.',
                EN: 'Find direct platform-to-street elevator exits across 22 major stations including Seomyeon, Busan Station, Haeundae, Gwangan, and Centum City.',
                JA: '西面駅（7・11・12・13番）、釜山駅（4・6番）、海雲台駅（1・3番）、広安駅（3・5番）、センタムシティ駅など主要22駅のホームから地上歩道まで階段なしで直結するエレベーター出口を正確に案内します。',
                ZH_TW: '精準標示西面站（7・11・12・13號）、釜山站（4・6號）、海雲台站（1・3號）、廣安站（3・5號）、Centum City 站等 22 個主要車站從月台直達地面的無障礙電梯出口。',
                ZH_CN: '精准标示西面站（7・11・12・13号）、釜山站（4・6号）、海云台站（1・3号）、广安站（3・5号）、Centum City 站等 22 个主要车站从站台直达地面的无障碍直梯出口。',
                ES: 'Consulta las salidas exactas con ascensor desde el andén hasta la acera en las 22 estaciones principales, incluidas Seomyeon, Busan Station, Haeundae, Gwangan y Centum City.',
                FR: 'Retrouvez les numéros exacts des sorties avec ascenseur reliant les quais à la chaussée dans 22 grandes stations (Seomyeon, Gare de Busan, Haeundae, Gwangan, Centum City).',
              })}
            </p>
          </a>

          {/* Card 2 */}
          <a
            href="/barrier-free"
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
            href="/tips/transit"
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
          5. COMPACT ABOUT & VERIFICATION BANNER
         ========================================== */}
      <section className="pt-4" id="about-verification-banner">
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
            href="/about"
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
