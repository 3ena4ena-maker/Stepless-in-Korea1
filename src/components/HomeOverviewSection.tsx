import React from 'react';
import { 
  Accessibility, 
  Luggage, 
  Compass, 
  ShieldCheck, 
  Train, 
  ChevronRight,
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
          bgLight: 'bg-[#FFF4EC]',
          border: 'border-[#F06A00]/30',
          text: 'text-[#F06A00]',
          badgeBg: 'bg-[#F06A00]',
          badgeText: 'text-white',
        };
      case '2':
        return {
          bg: 'bg-[#1b6d24]',
          bgLight: 'bg-[#EDF7EE]',
          border: 'border-[#1b6d24]/30',
          text: 'text-[#1b6d24]',
          badgeBg: 'bg-[#1b6d24]',
          badgeText: 'text-white',
        };
      case '3':
        return {
          bg: 'bg-[#906A3B]',
          bgLight: 'bg-[#F8F3EC]',
          border: 'border-[#906A3B]/30',
          text: 'text-[#906A3B]',
          badgeBg: 'bg-[#906A3B]',
          badgeText: 'text-white',
        };
      case '4':
        return {
          bg: 'bg-[#2B60BA]',
          bgLight: 'bg-[#EEF4FD]',
          border: 'border-[#2B60BA]/30',
          text: 'text-[#2B60BA]',
          badgeBg: 'bg-[#2B60BA]',
          badgeText: 'text-white',
        };
      case '동해':
        return {
          bg: 'bg-[#003DA5]',
          bgLight: 'bg-[#EBF1FA]',
          border: 'border-[#003DA5]/30',
          text: 'text-[#003DA5]',
          badgeBg: 'bg-[#003DA5]',
          badgeText: 'text-white',
        };
      case '김해':
        return {
          bg: 'bg-[#804796]',
          bgLight: 'bg-[#F5EEF8]',
          border: 'border-[#804796]/30',
          text: 'text-[#804796]',
          badgeBg: 'bg-[#804796]',
          badgeText: 'text-white',
        };
      default:
        return {
          bg: 'bg-[#8EA85E]',
          bgLight: 'bg-[#F1EFEC]',
          border: 'border-[#E5E2DC]',
          text: 'text-[#8EA85E]',
          badgeBg: 'bg-[#8EA85E]',
          badgeText: 'text-white',
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
      bg: 'bg-[#F3F8FB]',
      border: 'border-[#E1EDF5] hover:border-[#BED6E6]',
      iconBg: 'bg-[#E3EFF7]',
      iconColor: 'text-[#3B7291]',
      tagBg: 'bg-[#E3EFF7] text-[#3B7291]',
      btnBg: 'bg-white hover:bg-[#EAF3F8] border border-[#D5E5F0] text-[#2F5E78]',
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
      bg: 'bg-[#F4F8F3]',
      border: 'border-[#E1EEDF] hover:border-[#BFDBBB]',
      iconBg: 'bg-[#E5F1E2]',
      iconColor: 'text-[#4D7744]',
      tagBg: 'bg-[#E5F1E2] text-[#4D7744]',
      btnBg: 'bg-white hover:bg-[#ECF5E9] border border-[#D5E6CF] text-[#3C6134]',
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
      bg: 'bg-[#FAF6F3]',
      border: 'border-[#F1E8DF] hover:border-[#E0D0BF]',
      iconBg: 'bg-[#F5ECE2]',
      iconColor: 'text-[#885A3B]',
      tagBg: 'bg-[#F5ECE2] text-[#885A3B]',
      btnBg: 'bg-white hover:bg-[#F8F1EB] border border-[#E9DDD0] text-[#6E462A]',
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
      bg: 'bg-[#F8F6FA]',
      border: 'border-[#ECE4F0] hover:border-[#D6C7DE]',
      iconBg: 'bg-[#F1E8F5]',
      iconColor: 'text-[#745084]',
      tagBg: 'bg-[#F1E8F5] text-[#745084]',
      btnBg: 'bg-white hover:bg-[#F5EDF8] border border-[#E3D4E8] text-[#5C3B6C]',
      btnText: pickLang(language, { KR: '공간 둘러보기', EN: 'Discover', JA: 'スポットを見る', ZH_TW: '探索空間', ZH_CN: '探索空间', ES: 'Explorar', FR: 'Découvrir' }),
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 text-left font-sans text-[#11161B]" id="home-overview-section">
      
      {/* ==========================================
          1. 3-SECOND TEST HERO SECTION (Impeccable & Focused)
         ========================================== */}
      <section className="pt-8 pb-10 sm:pt-14 sm:pb-16 text-center max-w-2xl mx-auto px-4">
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

        <p className="text-base sm:text-lg md:text-xl text-slate-600 font-medium max-w-xl mx-auto mb-6 sm:mb-8 break-keep">
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
        <div className="w-full shadow-lg shadow-slate-200/60 rounded-2xl">
          <StationSearchBar
            language={language}
            searchQuery={searchQuery || ''}
            setSearchQuery={(q) => setSearchQuery?.(q)}
            onSelectStation={(stId) => onSelectStation(stId)}
            onNavigateToSearch={onNavigateToSearch}
            placeholder={d.utility.stationSearchPlaceholder}
          />
        </div>

        <div className="mt-4 sm:mt-5 flex items-center justify-center gap-1.5 text-xs font-bold text-[#6B853E] animate-bounce">
          <span>👇</span>
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
      <section className="space-y-4 pt-4 border-t border-[#E5E2DC]" id="all-stations-section" aria-label="지하철역 바로가기">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E2DC] pb-3">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-[#0A2540] uppercase">
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
            <h2 className="text-lg sm:text-2xl font-black text-[#11161B] tracking-tight mt-0.5">
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
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 shadow-2xs ${
                    isActive
                      ? 'bg-[#11161B] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
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
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 sm:gap-2.5 pt-1">
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
                className="group flex flex-col items-center justify-center bg-white hover:bg-[#F9F9F7] border border-slate-200/90 hover:border-[#8EA85E] rounded-xl py-2 px-1 sm:py-2.5 sm:px-2 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xs cursor-pointer text-center active:scale-95 min-h-[60px] sm:min-h-[68px] no-underline"
              >
                {/* Station Name */}
                <div className="font-extrabold text-[#11161B] text-xs sm:text-sm tracking-tight group-hover:text-[#8EA85E] transition-colors leading-tight truncate max-w-full">
                  {stationDisplayName}
                </div>

                {/* Line Badges */}
                <div className="flex items-center justify-center gap-1 mt-1 flex-wrap">
                  {st.lines.map((l) => {
                    const lineInfo = getLineTheme(l);
                    return (
                      <span 
                        key={l}
                        className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded text-white shadow-2xs ${lineInfo.bg}`}
                      >
                        {formatLineLabelI18n(l, language)}
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
      <section className="space-y-4 pt-6 sm:pt-8 border-t border-[#E5E2DC]" id="activity-explore-section">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#11161B] tracking-tight">
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5 pt-1">
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
                className={`${course.bg} border ${course.border} rounded-2xl p-2.5 sm:p-3.5 flex items-center gap-2 sm:gap-2.5 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group shadow-2xs select-none active:scale-95 min-h-[58px] sm:min-h-[68px] no-underline`}
              >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${course.iconBg} ${course.iconColor} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs`}>
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-[#11161B] text-xs sm:text-sm md:text-[15px] group-hover:text-[#0A2540] transition-colors leading-tight break-keep">
                    {course.title}
                  </h3>
                  <p className="hidden sm:block text-[11px] text-slate-500 mt-0.5 line-clamp-1 break-keep">
                    {course.desc}
                  </p>
                </div>

                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/70 flex items-center justify-center text-slate-400 group-hover:text-[#11161B] group-hover:bg-white shadow-2xs transition-all shrink-0">
                  <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
        className="space-y-3 pt-6 sm:pt-8 border-t border-[#E5E2DC]" 
        id="editorial-guide-section"
        aria-label="Busan Step-Free Travel Core Guide"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <h2 className="text-base sm:text-lg font-black text-[#11161B] tracking-tight">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3.5">
          {/* Card 1 */}
          <a
            href="/tips/courses/subway"
            onClick={(e) => {
              e.preventDefault();
              onNavigateToItinerary?.('SUBWAY');
            }}
            className="bg-white hover:bg-[#FAF9F6] border border-[#E5E2DC] hover:border-[#8EA85E] rounded-2xl p-3.5 sm:p-4 transition-all space-y-1.5 shadow-2xs no-underline group"
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#EDF4E3] text-[#5B7332] shrink-0">
                <Train className="w-3.5 h-3.5" />
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-[#11161B] group-hover:text-[#6B853E] transition-colors">
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
            <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed break-keep">
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
            className="bg-white hover:bg-[#FAF9F6] border border-[#E5E2DC] hover:border-[#8EA85E] rounded-2xl p-3.5 sm:p-4 transition-all space-y-1.5 shadow-2xs no-underline group"
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#E8F2F8] text-[#2F668A] shrink-0">
                <Accessibility className="w-3.5 h-3.5" />
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-[#11161B] group-hover:text-[#2F668A] transition-colors">
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
            <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed break-keep">
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
            className="bg-white hover:bg-[#FAF9F6] border border-[#E5E2DC] hover:border-[#8EA85E] rounded-2xl p-3.5 sm:p-4 transition-all space-y-1.5 shadow-2xs no-underline group"
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#F7EFE6] text-[#855834] shrink-0">
                <Luggage className="w-3.5 h-3.5" />
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-[#11161B] group-hover:text-[#855834] transition-colors">
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
            <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed break-keep">
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
      <section className="pt-4 border-t border-[#E5E2DC]" id="about-verification-banner">
        <div className="bg-[#FAF8F5] border border-[#EBE8E2] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-[#E5E2DC] text-[#6B853E] shadow-2xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#11161B]">
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
            className="self-end sm:self-center shrink-0 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 hover:text-[#8EA85E] font-bold text-xs transition-colors shadow-2xs flex items-center gap-1 cursor-pointer no-underline"
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
