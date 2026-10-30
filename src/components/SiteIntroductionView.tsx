import React, { useState, useRef, useEffect } from 'react';
import { UserCheck, Shield, FileText, Mail, Database, ExternalLink, CheckCircle2, Send, ChevronDown } from 'lucide-react';
import { AdSenseUnit } from './AdSenseManager';
import { Language, pickLang } from '../i18n/dictionary';

interface SiteIntroductionViewProps {
  language?: Language;
  initialPage?: 'about' | 'privacy' | 'terms' | 'contact' | 'data-source';
  onSubTabChange?: (subTab: 'about' | 'privacy' | 'terms' | 'contact' | 'data-source') => void;
}

export function SiteIntroductionView({ 
  language = 'KR', 
  initialPage = 'about',
  onSubTabChange
}: SiteIntroductionViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'about' | 'privacy' | 'terms' | 'contact' | 'data-source'>(initialPage);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setActiveSubTab(initialPage);
    if (initialPage !== 'about') {
      setTimeout(() => {
        const navEl = document.getElementById('site-intro-nav');
        if (navEl) {
          navEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [initialPage]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMobileMoreOpen(false);
      }
    };
    if (isMobileMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMoreOpen]);

  // Copy feedback state
  const [copiedEmail, setCopiedEmail] = useState(false);

  const officialEmail = 'floreur88@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(officialEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const subTabs = [
    {
      id: 'about',
      label: pickLang(language, {
        KR: '운영자 소개',
        EN: 'About Operator',
        JA: '運営者紹介',
        ZH_TW: '營運者介紹',
        ZH_CN: '运营者介绍',
        ES: 'Sobre el creador',
        FR: 'À propos de l’auteur',
      }),
      icon: UserCheck
    },
    {
      id: 'contact',
      label: pickLang(language, {
        KR: '정보 제보 및 문의',
        EN: 'Contact & Feedback',
        JA: '情報提供・お問い合わせ',
        ZH_TW: '資訊回報與聯絡',
        ZH_CN: '信息反馈与联系',
        ES: 'Contacto y sugerencias',
        FR: 'Contact & signalements',
      }),
      icon: Mail
    },
    {
      id: 'privacy',
      label: pickLang(language, {
        KR: '개인정보처리방침',
        EN: 'Privacy Policy',
        JA: 'プライバシーポリシー',
        ZH_TW: '隱私權政策',
        ZH_CN: '隐私政策',
        ES: 'Política de Privacidad',
        FR: 'Politique de Confidentialité',
      }),
      icon: Shield
    },
    {
      id: 'terms',
      label: pickLang(language, {
        KR: '이용약관',
        EN: 'Terms of Service',
        JA: '利用規約',
        ZH_TW: '服務條款',
        ZH_CN: '服务条款',
        ES: 'Términos de Uso',
        FR: 'Conditions d’Utilisation',
      }),
      icon: FileText
    },
    {
      id: 'data-source',
      label: pickLang(language, {
        KR: '데이터 출처',
        EN: 'Data Sources',
        JA: 'データ出典',
        ZH_TW: '資料來源',
        ZH_CN: '数据来源',
        ES: 'Fuentes de Datos',
        FR: 'Sources des Données',
      }),
      icon: Database
    },
  ];

  const handleSelectTab = (tabId: 'about' | 'privacy' | 'terms' | 'contact' | 'data-source') => {
    setActiveSubTab(tabId);
    onSubTabChange?.(tabId);
    setIsMobileMoreOpen(false);
    if (tabId !== 'about') {
      const navEl = document.getElementById('site-intro-nav');
      if (navEl) {
        navEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Find currently active secondary tab label if not 'about'
  const currentSecondaryTab = subTabs.find(t => t.id === activeSubTab && t.id !== 'about');

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 py-3 sm:py-6 text-left animate-fade-in" id="site-intro-container">
      
      {/* 1. 소개글 (Site Introduction & Operator Story - Always at Top) */}
      <section className="space-y-6 sm:space-y-8 animate-fade-in text-left" aria-label="Stepless 소개 및 운영자 이야기">
        <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-8">
          <div className="flex-1 space-y-4 text-left">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {pickLang(language, {
                  KR: '모두를 위한 문턱 없는 여행',
                  EN: 'Barrier-Free Travel for Everyone',
                  JA: 'すべての人のための、段差のない釜山旅',
                  ZH_TW: '為每個人打造的釜山無障礙之旅',
                  ZH_CN: '为每一个人打造的釜山无障碍之旅',
                  ES: 'Un Viaje por Busan Sin Barreras para Todos',
                  FR: 'Un Voyage à Busan Sans Obstacle pour Tous',
                })}
              </h2>
              <p className="text-sm sm:text-base font-bold text-[#8EA85E] leading-relaxed">
                {pickLang(language, {
                  KR: '계단과 턱 앞에서 누구도 망설이지 않도록, 발로 뛰며 만든 무장애 보행 지도입니다.',
                  EN: 'A step-free transit navigation created on foot so no traveler hesitates before stairs.',
                  JA: '階段や段差の前で誰もためらわないように、自分の足で歩いて作ったバリアフリー歩行マップです。',
                  ZH_TW: '為了讓任何人在樓梯與門檻前不再猶豫，親自實地走訪製作的無障礙步行地圖。',
                  ZH_CN: '为了让任何人在楼梯与台阶前不再犹豫，亲自实地走访制作的无障碍步行地图。',
                  ES: 'Un mapa peatonal sin escalones verificado a pie para que ningún viajero se detenga ante una escalera.',
                  FR: 'Une carte piétonne sans marche vérifiée sur le terrain pour qu’aucun voyageur n’hésite devant un escalier.',
                })}
              </p>
            </div>

            {/* Mobile Hero Image */}
            <div className="md:hidden w-full my-2">
              <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <img 
                  src="/images/busan_travelers_about_1782566089566.jpg" 
                  alt="Stepless Busan Walk"
                  className="w-full aspect-[16/10] object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white text-[11px] font-semibold text-center">
                  {pickLang(language, {
                    KR: '부산 전역 엘리베이터 및 무단차 동선 현장 점검',
                    EN: 'Direct Field Inspection Across Busan Metro',
                    JA: '釜山全域のエレベーターおよび段差なし動線を現地調査',
                    ZH_TW: '釜山全境電梯與無階梯動線實地勘查',
                    ZH_CN: '釜山全境直梯与无台阶动线实地勘查',
                    ES: 'Inspección directa en terreno de ascensores y rutas sin escalones en Busan',
                    FR: 'Inspection directe sur le terrain des ascenseurs et itinéraires sans marche à Busan',
                  })}
                </div>
              </div>
            </div>

            {/* Unified Narrative */}
            <div className="space-y-3 text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
              <p>
                {pickLang(language, {
                  KR: '매일 걷던 출퇴근길, 무거운 캐리어와 유모차를 들고 가파른 지하철 계단 앞에서 막막해하던 여행자들을 마주했습니다. 바로 옆에 편리한 엘리베이터가 있어도 안내가 부족해 땀 흘리는 모습을 보며, 현장 보행 동선을 직접 발로 확인하는 지도를 시작했습니다.',
                  EN: 'During daily commutes across Busan, I often witnessed travelers with heavy luggage and baby strollers struggling before steep subway stairs—unaware that a convenient elevator was already located right at the adjacent exit.',
                  JA: '毎日の通勤路で、重いスーツケースやベビーカーを抱え、急な地下鉄の階段の前で途方に暮れる旅行者を何度も目にしました。すぐ隣の出口に便利なエレベーターがあるのに案内が足りず苦労している姿を見て、現地の歩行ルートを自分の足で確かめるマップ作りを始めました。',
                  ZH_TW: '在每天上下班的路上，我常看到推著沉重行李箱與嬰兒車的旅客，在陡峭的地鐵樓梯前不知所措。明明旁邊出口就有方便的電梯，卻因為指引不足而滿頭大汗——這讓我決定開始親自走訪現場，製作這份無障礙動線地圖。',
                  ZH_CN: '在每天上下班的路上，我常看到推着沉重行李箱与婴儿车的旅客，在陡峭的地铁楼梯前不知所措。明明旁边出口就有方便的直梯，却因为指引不足而满头大汗——这让我决定开始亲自走访现场，制作这份无障碍动线地图。',
                  ES: 'En mis trayectos diarios por Busan, veía con frecuencia a viajeros con maletas pesadas y cochecitos de bebé detenidos frente a empinadas escaleras de metro, sin saber que en la salida contigua había un ascensor directo.',
                  FR: 'Lors de mes trajets quotidiens à Busan, j’ai souvent vu des voyageurs avec de lourdes valises ou une poussette démunis devant des escaliers de métro abrupts, sans savoir qu’un ascenseur pratique se trouvait juste à la sortie voisine.',
                })}
              </p>
              <p>
                {pickLang(language, {
                  KR: '저는 부산에서 나고 자란 부산 사람입니다. 휠체어를 탄 분도, 아이와 함께 온 부모님도 계단이나 턱 때문에 발길을 돌리지 않고 부산의 푸른 바다와 맛있는 골목을 마음껏 누리셨으면 좋겠습니다.',
                  EN: 'Born and raised in Busan, I wanted wheelchair users, parents with strollers, seniors, and travelers to explore this city freely without being stopped by steps.',
                  JA: '私は釜山で生まれ育った釜山っ子です。車椅子の方も、お子様連れのご家族も、階段や段差のせいで足を止めることなく、釜山の青い海と美味しい路地を存分に楽しんでいただきたいと願っています。',
                  ZH_TW: '我是在釜山土生土長的釜山人。希望無論是輪椅使用者、帶著孩子出遊的父母，還是長輩與推行李的旅客，都不會因為樓梯或門檻而卻步，能盡情享受釜山蔚藍的大海與美味巷弄。',
                  ZH_CN: '我是在釜山土生土长的釜山人。希望无论是轮椅使用者、带着孩子出游的父母，还是长辈与推行李的旅客，都不会因为楼梯或台阶而却步，能尽情享受釜山蔚蓝的大海与美味巷弄。',
                  ES: 'Nacido y criado en Busan, quería que las personas en silla de ruedas, las familias con cochecito, las personas mayores y los viajeros disfrutaran libremente del mar azul y la gastronomía de Busan sin que los escalones fueran un obstáculo.',
                  FR: 'Né et ayant grandi à Busan, je souhaitais que les personnes en fauteuil roulant, les familles avec poussette, les seniors et les voyageurs puissent profiter librement de la mer et des ruelles gourmandes de Busan sans être freinés par des marches.',
                })}
              </p>
              <p>
                {pickLang(language, {
                  KR: 'Stepless는 어떠한 대가나 상업적 광고 없이 100% 무료로 운영되는 순수 공익 지도입니다. 부산을 찾는 모든 분들이 지치지 않고 즐거운 추억만 안고 돌아가시길, 그리고 “참 정 많고 따뜻한 부산이었다”는 기억으로 다시 찾아주시길 바라는 진심 하나로 만듭니다.',
                  EN: 'Stepless is a 100% free public guide with zero commercial bias. My only hope is that everyone visiting Busan enjoys a joyful, comfortable trip and remembers Busan as a warm and hospitable city they want to visit again.',
                  JA: 'Steplessは商業的な広告や対価を一切受け取らず、100%無料で運営している公益ガイドです。釜山を訪れるすべての方が疲れずに楽しい思い出だけを持ち帰り、「本当に温かくて優しい街・釜山だった」とまた訪れてくださることを心から願っています。',
                  ZH_TW: 'Stepless 是不收取任何商業贊助、100% 免費營運的純公益指南。我只有一個心願：願每位來到釜山的旅人都能輕鬆寫意地帶走美好回憶，並懷著「釜山真是個溫暖又有人情味的城市」的記憶再次造訪。',
                  ZH_CN: 'Stepless 是不收取任何商业赞助、100% 免费运营的纯公益指南。我只有一个心愿：愿每位来到釜山的旅人都能轻松惬意地带走美好回忆，并怀着“釜山真是个温暖又有人情味的城市”的记忆再次造访。',
                  ES: 'Stepless es una guía pública 100 % gratuita y sin sesgo comercial. Mi único deseo es que todos los que visiten Busan se lleven recuerdos felices y recuerden a Busan como una ciudad cálida y acogedora a la que siempre quieran volver.',
                  FR: 'Stepless est un guide citoyen 100 % gratuit et sans parti pris commercial. Mon seul souhait est que chaque visiteur reparte avec de merveilleux souvenirs et garde l’image d’une ville de Busan chaleureuse et accueillante.',
                })}
              </p>
            </div>

            {/* Core Principles - Clean list without boxes */}
            <div className="pt-3 border-t border-slate-200/80 space-y-2">
              <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                <span className="text-[#8EA85E] font-bold shrink-0 mt-0.5">✓</span>
                <div>
                  <strong className="text-slate-900 font-bold">
                    {pickLang(language, {
                      KR: '발로 뛴 실질적 무단차 동선: ',
                      EN: 'Verified Step-Free Paths: ',
                      JA: '自分の足で確かめた段差なし動線：',
                      ZH_TW: '親自走訪驗證的無階梯動線：',
                      ZH_CN: '亲自走访验证的无台阶动线：',
                      ES: 'Rutas sin escalones verificadas a pie: ',
                      FR: 'Itinéraires sans marche vérifiés à pied : ',
                    })}
                  </strong>
                  <span>
                    {pickLang(language, {
                      KR: '엘리베이터와 경사로를 현장에서 직접 걸으며 검증한 경로만 안내합니다.',
                      EN: 'Directly walking and verifying elevators and ramps on site.',
                      JA: 'エレベーターやスロープを現地で実際に歩いて確認したルートのみをご案内します。',
                      ZH_TW: '僅提供在現場親自步行確認過的電梯與斜坡路線。',
                      ZH_CN: '仅提供在现场亲自步行确认过的直梯与坡道线路。',
                      ES: 'Solo recomendamos ascensores y rampas comprobados personalmente en el lugar.',
                      FR: 'Nous n’indiquons que les ascenseurs et rampes vérifiés directement sur place.',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                <span className="text-[#8EA85E] font-bold shrink-0 mt-0.5">✓</span>
                <div>
                  <strong className="text-slate-900 font-bold">
                    {pickLang(language, {
                      KR: '100% 무료 열린 공익 가이드: ',
                      EN: '100% Free Public Guide: ',
                      JA: '100%無料のオープン公益ガイド：',
                      ZH_TW: '100% 免費公開的公益指南：',
                      ZH_CN: '100% 免费公开的公益指南：',
                      ES: 'Guía pública 100 % gratuita: ',
                      FR: 'Guide citoyen 100 % gratuit : ',
                    })}
                  </strong>
                  <span>
                    {pickLang(language, {
                      KR: '상업적 대가나 차별 없이 누구나 자유롭게 이용할 수 있습니다.',
                      EN: 'Accessible to all travelers without commercial bias or fees.',
                      JA: '商業的な偏りなく、どなたでも無料で自由にご利用いただけます。',
                      ZH_TW: '無任何商業偏頗或收費，任何人都能自由使用。',
                      ZH_CN: '无任何商业偏颇或收费，任何人都能自由使用。',
                      ES: 'Abierta a todos los viajeros sin tarifas ni intereses comerciales.',
                      FR: 'Accessible gratuitement à tous les voyageurs, sans frais ni publicité trompeuse.',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                <span className="text-[#8EA85E] font-bold shrink-0 mt-0.5">✓</span>
                <div>
                  <strong className="text-slate-900 font-bold">
                    {pickLang(language, {
                      KR: '정이 넘치는 부산 로컬 큐레이션: ',
                      EN: 'Warm Local Curation: ',
                      JA: '地元釜山ならではの温かいキュレーション：',
                      ZH_TW: '充滿人情味的釜山在地精選：',
                      ZH_CN: '充满人情味的釜山本地精选：',
                      ES: 'Recomendaciones auténticas de un local de Busan: ',
                      FR: 'Sélection locale chaleureuse d’un habitant de Busan : ',
                    })}
                  </strong>
                  <span>
                    {pickLang(language, {
                      KR: '부산 토박이만이 아는 입구 평평한 맛집, 바다 산책로, 축제 정보를 전합니다.',
                      EN: 'Authentic local curation with barrier-free spots, seaside paths, and festivals.',
                      JA: '地元民だからこそ知る段差のない名店、海辺の散歩道、祭り情報をお届けします。',
                      ZH_TW: '分享只有在地人才知道的平坦入口美食、海濱步道與慶典資訊。',
                      ZH_CN: '分享只有本地人才知道的平坦入口美食、海滨步道与庆典资讯。',
                      ES: 'Compartimos restaurantes con entrada llana, paseos marítimos y festivales que solo un local conoce.',
                      FR: 'Restaurants de plain-pied, promenades en bord de mer et festivals sélectionnés par un natif de Busan.',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Side Hero Image */}
          <div className="hidden md:block md:w-80 shrink-0 sticky top-24">
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-100">
              <img 
                src="/images/busan_travelers_about_1782566089566.jpg" 
                alt="Stepless Busan Walk"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white text-xs font-semibold text-center">
                {pickLang(language, {
                  KR: '부산 보행 동선 현장 직접 점검',
                  EN: 'Verified On-Site in Busan',
                  JA: '釜山の歩行ルートを現地で直接調査',
                  ZH_TW: '釜山步行路線現場親自勘查',
                  ZH_CN: '釜山步行路线现场亲自勘查',
                  ES: 'Verificado directamente en terreno en Busan',
                  FR: 'Vérifié directement sur le terrain à Busan',
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 카테고리 네비게이션 (소개글 바로 아래 위치) */}
      <div id="site-intro-nav" className="pt-2 sm:pt-4">
        {/* DESKTOP (md+): Minimalist flat horizontal nav matching home screen */}
        <div className="hidden md:block border-b border-[#E5E2DC]">
          <nav className="flex items-center space-x-1 sm:space-x-2 min-w-max pb-px" aria-label="사이트 소개 카테고리">
            {subTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`site-intro-tab-${tab.id}`}
                  onClick={() => handleSelectTab(tab.id as 'about' | 'privacy' | 'terms' | 'contact' | 'data-source')}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-[#0A2540] bg-[#F1EFEC] font-bold'
                      : 'text-[#4A5568] hover:text-[#11161B] hover:bg-[#F1EFEC]/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#8EA85E]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* MOBILE (< md): Optimized with Operator tab first + "More" dropdown for one-glance clarity */}
        <div className="md:hidden border-b border-[#E5E2DC] pb-2 relative" ref={moreMenuRef}>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {/* 운영자 소개 (Always First) */}
              <button
                id="site-intro-mobile-tab-about"
                onClick={() => handleSelectTab('about')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  activeSubTab === 'about'
                    ? 'text-[#0A2540] bg-[#F1EFEC]'
                    : 'text-[#4A5568] hover:bg-[#F1EFEC]/60'
                }`}
              >
                <UserCheck className={`w-3.5 h-3.5 shrink-0 ${activeSubTab === 'about' ? 'text-[#8EA85E]' : 'text-slate-400'}`} />
                <span>{subTabs[0].label}</span>
              </button>

              {/* If a secondary tab is active, display it next to About */}
              {currentSecondaryTab && (
                <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-bold text-[#0A2540] bg-[#F1EFEC] truncate shrink-0 max-w-[150px]">
                  <currentSecondaryTab.icon className="w-3.5 h-3.5 text-[#0A2540] shrink-0" />
                  <span className="truncate">{currentSecondaryTab.label}</span>
                </div>
              )}
            </div>

            {/* 더보기 (More) Button */}
            <div className="relative shrink-0">
              <button
                type="button"
                id="site-intro-mobile-more-btn"
                onClick={() => setIsMobileMoreOpen(prev => !prev)}
                aria-expanded={isMobileMoreOpen}
                className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isMobileMoreOpen || (activeSubTab !== 'about')
                    ? 'text-[#8EA85E] bg-[#8EA85E]/10 border border-[#8EA85E]/30'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80'
                }`}
              >
                <span>{pickLang(language, { KR: '더보기', EN: 'More', JA: 'その他', ZH_TW: '更多', ZH_CN: '更多', ES: 'Más', FR: 'Plus' })}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMobileMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* More Dropdown Menu */}
              {isMobileMoreOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-fade-in"
                  role="menu"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    {pickLang(language, { KR: '전체 카테고리', EN: 'All Categories', JA: 'すべてのカテゴリー', ZH_TW: '所有分類', ZH_CN: '所有分类', ES: 'Todas las categorías', FR: 'Toutes les catégories' })}
                  </div>
                  {subTabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeSubTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        role="menuitem"
                        onClick={() => handleSelectTab(tab.id as 'about' | 'privacy' | 'terms' | 'contact' | 'data-source')}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors cursor-pointer ${
                          isActive 
                            ? 'bg-[#8EA85E]/15 text-[#2D6A4F] font-bold' 
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#8EA85E]' : 'text-slate-400'}`} />
                          <span>{tab.label}</span>
                        </div>
                        {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-[#8EA85E]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. 하단 탭별 상세 내용 */}
      {/* PAGE 1: 운영자 소개 활성화 시 (에디터 프로필 & 미니 Q&A) */}
      {activeSubTab === 'about' && (
        <div className="space-y-6 animate-fade-in text-left pt-1 sm:pt-2">
          {/* Editor Header */}
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#8EA85E] shrink-0" />
              <span>
                {pickLang(language, {
                  KR: '에디터 : 플로레르',
                  EN: 'Editor : Floreur',
                  JA: 'エディター：フロレール (Floreur)',
                  ZH_TW: '編輯：Floreur',
                  ZH_CN: '编辑：Floreur',
                  ES: 'Editor : Floreur',
                  FR: 'Éditeur : Floreur',
                })}
              </span>
            </h3>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              {pickLang(language, {
                KR: '“부산에서 나고 자라 매일 걷는 길, 여행자분들의 가벼운 발걸음을 위해 발로 뜁니다.”',
                EN: '“Born and raised in Busan, walking these streets every day to ensure light, joyful steps for all travelers.”',
                JA: '「釜山で生まれ育ち毎日歩くこの街を、旅行者の皆様が軽やかな足取りで歩けるよう自分の足で調査しています。」',
                ZH_TW: '「在釜山土生土長、每天行走的街道，為了讓旅人們擁有輕快的步伐而親自奔走。」',
                ZH_CN: '“在釜山土生土长、每天行走的街道，为了让旅人们拥有轻快的步伐而亲自奔走。”',
                ES: '«Nacido y criado en Busan, recorro estas calles cada día para que todos los viajeros disfruten de un paseo cómodo y sin barreras.»',
                FR: '« Né et ayant grandi à Busan, je parcours ces rues chaque jour pour offrir à tous les voyageurs des déplacements fluides et sans obstacle. »',
              })}
            </p>
          </div>

          {/* Q&A List */}
          <div className="space-y-4 pt-2 border-t border-slate-200/80">
            <div className="space-y-1.5">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-[#8EA85E] font-black">Q.</span>
                <span>
                  {pickLang(language, {
                    KR: '혼자서 이 넓은 부산을 어떻게 점검하나요?',
                    EN: 'How do you inspect such a vast city alone?',
                    JA: '一人でこの広い釜山をどうやって調査しているのですか？',
                    ZH_TW: '一個人如何勘查這麼廣大的釜山？',
                    ZH_CN: '一个人如何勘查这么广大的釜山？',
                    ES: '¿Cómo inspeccionas una ciudad tan grande tú solo?',
                    FR: 'Comment inspectez-vous une ville aussi vaste à vous seul ?',
                  })}
                </span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pl-4 sm:pl-5 border-l-2 border-[#8EA85E]/30">
                {pickLang(language, {
                  KR: '“퇴근길이나 평소에 카페나 공공 장소를 직접 걸어보고, 여행명소를 방문한 여행자분들의 따뜻한 제보 메일로 지도를 함께 다듬어가고 있습니다.”',
                  EN: '“I walk on foot during commutes, visits to cafes, and public spots, and refine the guide together with warm feedback emails from travelers.”',
                  JA: '「仕事帰りや休日にカフェや公共スポットを実際に歩いて確認し、観光地を訪れた旅行者の皆様からの温かい情報提供メールと共にマップを磨いています。」',
                  ZH_TW: '「利用下班路途或平時親自走訪咖啡廳與公共場所，並結合造訪景點的旅客們寄來的溫暖回報信件，一起完善這份地圖。」',
                  ZH_CN: '“利用下班路途或平时亲自走访咖啡厅与公共场所，并结合造访景点的旅客们发来的温暖反馈邮件，一起完善这份地图。”',
                  ES: '«Reviso personalmente las estaciones, cafeterías y espacios públicos en mis desplazamientos diarios, y actualizo el mapa junto con los amables correos de viajeros que visitan Busan.»',
                  FR: '« Je vérifie les stations, cafés et lieux publics à pied au quotidien, et j’affine la carte grâce aux précieux retours envoyés par les voyageurs. »',
                })}
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-[#8EA85E] font-black">Q.</span>
                <span>
                  {pickLang(language, {
                    KR: '운영하면서 가장 기뻤던 순간은?',
                    EN: 'What has been the most rewarding moment?',
                    JA: '運営していて一番嬉しかった瞬間は？',
                    ZH_TW: '營運過程中最開心的時刻是？',
                    ZH_CN: '运营过程中最开心的时刻是？',
                    ES: '¿Cuál ha sido el momento más gratificante?',
                    FR: 'Quel a été votre moment le plus gratifiant ?',
                  })}
                </span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pl-4 sm:pl-5 border-l-2 border-[#8EA85E]/30">
                {pickLang(language, {
                  KR: '“‘아기 유모차를 끌고 부산에 왔는데, 지하철 출구를 편안하게 이용하며 여행했다’는 메일을 받았을 때 가장 큰 보람을 느낍니다.”',
                  EN: '“The greatest reward is receiving emails like: ‘I visited Busan with a baby stroller and traveled comfortably thanks to the station exit guide.’”',
                  JA: '「『ベビーカーを押して釜山に来ましたが、地下鉄の出口案内のおかげで快適に旅ができました』というメールをいただいた時が一番のやりがいです。」',
                  ZH_TW: '「收到『推著嬰兒車來到釜山，多虧有地鐵出口指南才能輕鬆舒適地旅行』這樣的來信時，讓我感到最有成就感。」',
                  ZH_CN: '“收到‘推着婴儿车来到釜山，多亏有地铁出口指南才能轻松舒适地旅行’这样的来信时，让我感到最有成就感。”',
                  ES: '«La mayor satisfacción es recibir mensajes como: "Vinimos a Busan con el cochecito del bebé y pudimos viajar cómodamente gracias a la guía de salidas del metro".»',
                  FR: '« Ma plus grande fierté est de recevoir des messages tels que : "Nous sommes venus à Busan avec une poussette et avons pu voyager sereinement grâce au guide des sorties de métro." »',
                })}
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-[#8EA85E] font-black">Q.</span>
                <span>
                  {pickLang(language, {
                    KR: '앞으로 Stepless가 꿈꾸는 바람은?',
                    EN: 'What is your future hope for Stepless?',
                    JA: 'これからSteplessが目指す願いは？',
                    ZH_TW: 'Stepless 未來期許的願景是什麼？',
                    ZH_CN: 'Stepless 未来期许的愿景是什么？',
                    ES: '¿Cuál es tu deseo para el futuro de Stepless?',
                    FR: 'Quel est votre souhait pour l’avenir de Stepless ?',
                  })}
                </span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pl-4 sm:pl-5 border-l-2 border-[#8EA85E]/30">
                {pickLang(language, {
                  KR: '“계단이나 턱 때문에 누군가의 발걸음이 멈추지 않는 것, 그리고 부산을 다녀간 모든 분들이 ‘참 따뜻하고 다정했던 부산’으로 기억하며 언제든 다시 찾아주시는 것입니다.”',
                  EN: '“That no one has to stop their journey because of steps or curbs, and that everyone remembers Busan as a warm, hospitable city they want to visit again.”',
                  JA: '「階段や段差のせいで誰かの足取りが止まらないこと、そして釜山を訪れたすべての方が『本当に温かくて優しい街・釜山』として記憶し、いつでもまた訪れてくださることです。」',
                  ZH_TW: '「希望沒有任何人的腳步因為樓梯或門檻而停下，也希望每位來過釜山的朋友都能記住『既溫暖又親切的釜山』，隨時再次造訪。」',
                  ZH_CN: '“希望没有任何人的脚步因为楼梯或台阶而停下，也希望每位来过釜山的朋友都能记住‘既温暖又亲切的釜山’，随时再次造访。”',
                  ES: '«Que nadie tenga que detener su viaje por culpa de escalones o bordillos, y que todos recuerden a Busan como una ciudad cálida y amable a la que siempre quieran regresar.»',
                  FR: '« Que personne ne soit arrêté dans son voyage par des marches ou des trottoirs, et que chacun garde le souvenir d’une ville de Busan chaleureuse et bienveillante. »',
                })}
              </p>
            </div>
          </div>

          {/* AdSense Unit */}
          <div className="pt-2">
            <AdSenseUnit currentParams={{ currentTab: 'about', siteSubPage: 'about' }} />
          </div>
        </div>
      )}

      {/* PAGE 2: 정보 오류 요청 제보 및 문의 (Inquiry & Data Corrections) */}
      {activeSubTab === 'contact' && (
        <div className="space-y-4 sm:space-y-5 animate-fade-in text-left pt-1 sm:pt-2 google-anno-skip" data-ad-exclude="true">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#8EA85E] shrink-0" />
              <span>
                {pickLang(language, {
                  KR: '정보 오류 요청 제보 및 공식 문의',
                  EN: 'Inquiries & Field Feedback',
                  JA: '情報修正のご連絡・公式お問い合わせ',
                  ZH_TW: '資訊勘誤回報與官方聯絡',
                  ZH_CN: '信息勘误反馈与官方联系'
                })}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {pickLang(language, {
                KR: '부산 지하철역 엘리베이터 위치, 출구 정정, 시설 공사 정보 제보 및 서비스 공식 문의 창구',
                EN: 'Official contact channel for elevator maintenance feedback, exit corrections, and service inquiries.',
                JA: '釜山地下鉄駅のエレベーター位置、出口情報の修正、工事情報の提供および公式お問い合わせ窓口',
                ZH_TW: '釜山地鐵站電梯位置、出口更正、設施施工回報及服務官方聯絡窗口',
                ZH_CN: '釜山地铁站直梯位置、出口更正、设施施工反馈及服务官方联系窗口'
              })}
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            {pickLang(language, {
              KR: '부산 지하철 배리어프리 정보 정정 요청, 공사 제보 및 제휴·광고 정책 문의는 아래 공식 이메일로 보내주시면 운영자 플로레르가 신속히 확인 후 답변 드립니다.',
              EN: 'For transit corrections, out-of-order elevator alerts, or privacy inquiries, contact the operator directly via our verified email below.',
              JA: '釜山地下鉄のバリアフリー情報の修正リクエスト、点検・工事の通報、お問い合わせは下記の公式メールまでお送りください。運営者が確認の上、迅速にご返信いたします。',
              ZH_TW: '若需更正釜山地鐵無障礙資訊、回報電梯施工或洽詢服務事宜，請寄信至下方官方信箱，營運者確認後將儘速回覆。',
              ZH_CN: '若需更正釜山地铁无障碍信息、反馈直梯施工或洽询服务事宜，请发送邮件至下方官方邮箱，运营者确认后将尽快回复。'
            })}
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-3 text-sm">
            <a 
              href={`mailto:${officialEmail}?subject=${encodeURIComponent(language === 'KR' ? '[스탭리스] 정보 오류 제보 및 문의' : '[Stepless] Inquiry & Feedback')}`}
              className="text-base sm:text-lg font-black text-[#2D6A4F] hover:underline font-mono mr-1"
            >
              {officialEmail}
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
            >
              {copiedEmail ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">
                    {pickLang(language, { KR: '복사됨!', EN: 'Copied!', JA: 'コピー完了！', ZH_TW: '已複製！', ZH_CN: '已复制！' })}
                  </span>
                </>
              ) : (
                <span>
                  {pickLang(language, { KR: '주소 복사', EN: 'Copy', JA: 'アドレスをコピー', ZH_TW: '複製信箱', ZH_CN: '复制邮箱' })}
                </span>
              )}
            </button>

            <a
              href={`mailto:${officialEmail}?subject=${encodeURIComponent(language === 'KR' ? '[스탭리스] 정보 오류 제보 및 문의' : '[Stepless] Feedback & Inquiry')}&body=${encodeURIComponent(language === 'KR' ? '[스탭리스 정보 오류 제보 및 문의]\n\n- 역명/출구:\n- 오류/의견 내용:\n\n* 플로레르 대표 이메일(floreur88@gmail.com)로 발송됩니다.' : '[Stepless Inquiry & Report]\n\n- Station / Exit:\n- Details:\n\n* Directly routed to publisher (floreur88@gmail.com).')}`}
              className="px-3.5 py-1.5 bg-[#8EA85E] hover:bg-[#7b944f] text-white font-bold text-xs rounded-xl transition-all shadow-2xs active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {pickLang(language, { KR: '메일 보내기', EN: 'Send Mail', JA: 'メールを送る', ZH_TW: '發送郵件', ZH_CN: '发送邮件' })}
              </span>
            </a>
          </div>
        </div>
      )}

      {/* PAGE 3: 개인정보처리방침 (Privacy Policy) */}
      {activeSubTab === 'privacy' && (
        <div className="space-y-6 animate-fade-in text-left pt-1 sm:pt-2 text-xs sm:text-sm text-slate-700 leading-relaxed google-anno-skip" data-ad-exclude="true">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#8EA85E] shrink-0" />
              <span>{pickLang(language, { KR: '개인정보처리방침', EN: 'Privacy Policy', JA: 'プライバシーポリシー', ZH_TW: '隱私權政策', ZH_CN: '隐私政策' })}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {pickLang(language, {
                KR: '쿠키·광고·분석·위치·제보 데이터 처리 수칙 및 프라이버시 보호 안내',
                EN: 'Cookie disclosure, personalized advertising, geolocation data, and privacy protection guidelines.',
                JA: 'Cookie・広告・分析・位置情報・お問い合わせデータの取り扱いおよびプライバシー保護に関するご案内',
                ZH_TW: 'Cookie、廣告、分析、位置資訊與回報資料處理原則及隱私保護說明',
                ZH_CN: 'Cookie、广告、分析、位置信息与反馈数据处理原则及隐私保护说明'
              })}
            </p>
          </div>

          <div className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed border-l-2 border-[#8EA85E] pl-3 sm:pl-4 py-1">
            {pickLang(language, {
              KR: 'Stepless는 회원가입, 로그인, 주민등록번호 수집 등 직접 식별이 가능한 개인정보를 일절 저장하거나 요구하지 않는 프라이버시 보호 중심 서비스입니다.',
              EN: 'Stepless is a privacy-first service that does not collect, store, or require personal identifiers like logins, phone numbers, or national identification numbers.',
              JA: 'Steplessは会員登録やログイン、個人識別情報の収集を一切行わないプライバシー重視のサービスです。',
              ZH_TW: 'Stepless 是以隱私保護為核心的服務，完全不要求會員註冊、登入，亦不收集或儲存任何可識別個人身分的資料。',
              ZH_CN: 'Stepless 是以隐私保护为核心的服务，完全不要求会员注册、登录，亦不收集或存储任何可识别个人身份的信息。'
            })}
          </div>

          <div className="space-y-5 pt-2 border-t border-slate-200/80">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EA85E]"></span>
                <span>{pickLang(language, { KR: '1. 위치정보(Geolocation) 처리 안내', EN: '1. Geolocation Data Handling', JA: '1. 位置情報（Geolocation）の取り扱い', ZH_TW: '1. 位置資訊（Geolocation）處理說明', ZH_CN: '1. 位置信息（Geolocation）处理说明' })}</span>
              </h3>
              <p className="font-medium text-slate-600 leading-relaxed pl-3 sm:pl-3.5">
                {pickLang(language, {
                  KR: "'내 주변 역 및 출구 검색' 기능을 사용할 때 이용자의 위치 정보(GPS 및 네트워크 좌표)는 사용자의 브라우저 동의 하에 단말기 내부에서 일회성 거리 계산 용도로만 활용됩니다. 해당 위치 데이터는 외부 서버로 전송되거나 저장되지 않으며 연산 즉시 파기됩니다.",
                  EN: 'When using nearby station search, your GPS/network coordinates are processed strictly inside your device browser session for one-time distance calculation. No location history is transmitted to or stored on remote servers.',
                  JA: '周辺駅検索機能を利用する際の位置情報（GPS座標）は、ブラウザの許可のもと端末内での一時的な距離計算にのみ使用され、外部サーバーへの送信や保存は一切行われません。',
                  ZH_TW: '使用附近車站搜尋功能時，您的位置資訊（GPS 座標）僅在瀏覽器授權下於裝置內部進行單次距離計算，不會傳送或儲存至外部伺服器。',
                  ZH_CN: '使用附近车站搜索功能时，您的位置信息（GPS 坐标）仅在浏览器授权下于设备内部进行单次距离计算，不会传输或存储至外部服务器。'
                })}
              </p>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EA85E]"></span>
                <span>{pickLang(language, { KR: '2. 쿠키(Cookie) 수집 및 이용 목적', EN: '2. Cookies & Purpose of Collection', JA: '2. Cookieの利用目的', ZH_TW: '2. Cookie 收集與使用目的', ZH_CN: '2. Cookie 收集与使用目的' })}</span>
              </h3>
              <p className="font-medium text-slate-600 leading-relaxed pl-3 sm:pl-3.5">
                {pickLang(language, {
                  KR: '쿠키는 웹사이트 이용 시 이용자의 브라우저에 저장되는 소규모 텍스트 파일입니다. 본 서비스는 사용자 환경설정(언어 선택 등) 유지, 접속 품질 향상, 그리고 서비스의 지속적인 데이터 업데이트 운영을 위한 타사 서비스 연동 시 쿠키를 활용할 수 있습니다.',
                  EN: 'Cookies are small text files stored in your browser. We use cookies to remember preferences (such as language), optimize performance, and support third-party integrations essential for maintaining data updates.',
                  JA: '当サービスでは、言語設定などのユーザー設定の保持、表示品質の向上、およびサービス運営を支える外部連携のためにCookieを使用する場合があります。',
                  ZH_TW: '本服務可能會使用 Cookie 以保存您的語言偏好設定、提升連線品質，並支援維持資料更新所需的第三方服務整合。',
                  ZH_CN: '本服务可能会使用 Cookie 以保存您的语言偏好设置、提升访问品质，并支持维持数据更新所需的第三方服务集成。'
                })}
              </p>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EA85E]"></span>
                <span>{pickLang(language, { KR: '3. 웹/앱 서비스 사용 분석(Analytics)', EN: '3. Anonymous Web Analytics', JA: '3. 匿名アクセス解析（Analytics）', ZH_TW: '3. 匿名網站使用分析（Analytics）', ZH_CN: '3. 匿名网站使用分析（Analytics）' })}</span>
              </h3>
              <p className="font-medium text-slate-600 leading-relaxed pl-3 sm:pl-3.5">
                {pickLang(language, {
                  KR: '본 웹사이트는 이용자의 방문 패턴, 검색 빈도가 높은 주요 역, 접속 기기 유형 등 익명의 통계성 데이터(Analytics)를 수집 및 분석할 수 있습니다. 수집된 통계 데이터는 오직 서비스 기능 개선 및 보행자 동선 가이드 품질 향상 목적으로만 활용되며 개인을 식별하지 않습니다.',
                  EN: 'We may process anonymous analytics regarding aggregate visit frequency and device types. This anonymous statistical data is used solely to improve navigation guide quality and does not identify individuals.',
                  JA: '当サイトでは、訪問傾向やよく検索される駅などの匿名統計データを分析する場合があります。これらは歩行ガイドの品質向上のみに使用され、個人を特定することはありません。',
                  ZH_TW: '本網站可能會分析熱門搜尋車站與裝置類型等匿名統計資料，僅用於提升無障礙動線指南品質，不會識別個人身分。',
                  ZH_CN: '本网站可能会分析热门搜索车站与设备类型等匿名统计数据，仅用于提升无障碍动线指南品质，不会识别个人身份。'
                })}
              </p>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EA85E]"></span>
                <span>{pickLang(language, { KR: '4. 구글 맞춤형 광고 및 쿠키 거부(Opt-out) 수칙', EN: '4. Google Personalized Advertising & Opt-out', JA: '4. Googleパーソナライズド広告およびオプトアウト', ZH_TW: '4. Google 個人化廣告與停用（Opt-out）說明', ZH_CN: '4. Google 个性化广告与停用（Opt-out）说明' })}</span>
              </h3>
              <div className="pl-3 sm:pl-3.5 space-y-2 text-slate-600 font-medium">
                <p>
                  {pickLang(language, {
                    KR: '1) 본 서비스는 공익적인 무료 데이터 서비스 유지 및 지속 관리를 위해 구글 애드센스(Google AdSense) 등 제3자 광고 사업자의 광고를 게재할 수 있습니다.',
                    EN: '1) To maintain continuous free field audits and service availability, we may display third-party advertisements via Google AdSense.',
                    JA: '1) 無料の現地調査およびサービス運営を維持するため、Google AdSense等の第三者配信広告を掲載する場合があります。',
                    ZH_TW: '1) 為維持免費實地勘查與服務營運，本網站可能會刊登 Google AdSense 等第三方廣告。',
                    ZH_CN: '1) 为维持免费实地勘查与服务运营，本网站可能会刊登 Google AdSense 等第三方广告。'
                  })}
                </p>
                <ul className="list-disc pl-5 space-y-1.5 font-bold text-blue-600 pt-1">
                  <li>
                    <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center gap-1">
                      <span>{pickLang(language, { KR: '구글 개인 맞춤형 광고 설정 관리', EN: 'Google Ads Settings', JA: 'Google 広告設定の管理', ZH_TW: 'Google 廣告設定管理', ZH_CN: 'Google 广告设置管理' })}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center gap-1">
                      <span>{pickLang(language, { KR: '디지털광고협회(DAA) 맞춤형 광고 차단 센터', EN: 'Digital Advertising Alliance (aboutads.info)', JA: 'Digital Advertising Alliance (aboutads.info)', ZH_TW: 'Digital Advertising Alliance (aboutads.info)', ZH_CN: 'Digital Advertising Alliance (aboutads.info)' })}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EA85E]"></span>
                <span>{pickLang(language, { KR: '5. 정보 오류 제보 및 문의 데이터 처리 방침', EN: '5. Handling of Inquiries & Feedback', JA: '5. お問い合わせ・情報提供データの取り扱い', ZH_TW: '5. 勘誤回報與聯絡資料處理原則', ZH_CN: '5. 勘误反馈与联系数据处理原则' })}</span>
              </h3>
              <p className="font-medium text-slate-600 leading-relaxed pl-3 sm:pl-3.5">
                {pickLang(language, {
                  KR: `이용자가 대표 이메일(${officialEmail})을 통해 정보 오류 제보, 정정 요청, 일반 문의를 전송하는 경우, 수신된 작성 내용 및 이메일 주소는 오직 제보 내용의 현장 검증, 데이터 정정, 문의 답변 목적으로만 한정하여 이용됩니다. 해당 문의 처리 및 검증 목적이 달성된 후에는 수신된 이메일 데이터를 즉시 파기하거나 안전하게 관리합니다.`,
                  EN: `When users submit feedback or inquiries to ${officialEmail}, the provided message and sender email address are used strictly for auditing transit data and replying to user requests, after which they are securely managed or discarded.`,
                  JA: `公式メール（${officialEmail}）宛にお送りいただいた内容およびメールアドレスは、現地確認・データ修正・返信の目的のみに使用され、目的達成後は安全に管理または破棄されます。`,
                  ZH_TW: `當您透過官方信箱（${officialEmail}）寄送回報或詢問時，信件內容與電子郵件地址僅用於現場查核、資料更正與回覆，完成後將安全管理或刪除。`,
                  ZH_CN: `当您通过官方邮箱（${officialEmail}）发送反馈或咨询时，邮件内容与电子邮箱地址仅用于现场核实、数据更正与回复，完成后将安全管理或删除。`
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 4: 이용약관 (Terms of Service) */}
      {activeSubTab === 'terms' && (
        <div className="space-y-6 animate-fade-in text-left pt-1 sm:pt-2 text-xs sm:text-sm text-slate-700 leading-relaxed google-anno-skip" data-ad-exclude="true">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#8EA85E] shrink-0" />
              <span>{pickLang(language, { KR: '서비스 이용약관 및 면책사항', EN: 'Terms of Service & Disclaimer', JA: '利用規約および免責事項', ZH_TW: '服務條款與免責聲明', ZH_CN: '服务条款与免责声明' })}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {pickLang(language, {
                KR: '실시간 시설 변동 가능성, 안전 가이드라인 및 면책 기준',
                EN: 'Facility variability, safety guidelines, and limitation of liability.',
                JA: '施設のリアルタイム変動の可能性、安全ガイドラインおよび免責基準',
                ZH_TW: '設施即時變動可能性、安全指引與免責基準',
                ZH_CN: '设施实时变动可能性、安全指引与免责基准'
              })}
            </p>
          </div>

          <div className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed border-l-2 border-[#8EA85E] pl-3 sm:pl-4 py-1">
            {pickLang(language, {
              KR: '본 서비스는 부산 지하철 이용자의 편의를 돕기 위한 보행 가이드 플랫폼입니다. 이동 시 현장의 실시간 안내 표지판과 안전 규정을 항상 최우선으로 준수해 주시기 바랍니다.',
              EN: 'Stepless is an informational pedestrian guide. Please prioritize on-site transit station signs, staff directions, and local street safety regulations at all times.',
              JA: '当サービスは釜山地下鉄利用者の利便性を支援する歩行ガイドです。移動時は現地の案内標識や駅係員の指示、安全規則を常に最優先してください。',
              ZH_TW: '本服務為協助釜山地鐵旅客之步行指南平台。移動時請務必優先遵守現場即時指示牌、站務人員引導與安全規定。',
              ZH_CN: '本服务为协助釜山地铁旅客的步行指南平台。出行时请务必优先遵守现场实时指示牌、站务人员引导与安全规定。'
            })}
          </div>

          <div className="space-y-5 pt-2 border-t border-slate-200/80">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EA85E]"></span>
                <span>{pickLang(language, { KR: '제 1 조 (목적)', EN: 'Article 1 (Purpose)', JA: '第1条（目的）', ZH_TW: '第 1 條（目的）', ZH_CN: '第 1 条（目的）' })}</span>
              </h3>
              <p className="font-medium text-slate-600 leading-relaxed pl-3 sm:pl-3.5">
                {pickLang(language, {
                  KR: '본 약관은 Stepless(이하 "서비스")가 제공하는 부산 지하철 배리어프리, 엘리베이터 위치, 출구 안내 및 관련 정보 서비스의 이용 조건과 절차, 이용자의 주의사항을 규정함을 목적으로 합니다.',
                  EN: 'These Terms govern the use of the Stepless barrier-free transit navigation and accessibility guide for Busan metro stations and tourist itineraries.',
                  JA: '本規約は、Steplessが提供する釜山地下鉄バリアフリー案内、エレベーター位置、出口情報および関連サービスの利用条件と注意事項を定めるものです。',
                  ZH_TW: '本條款旨在規範使用 Stepless 所提供之釜山地鐵無障礙動線、電梯位置、出口指南及相關旅遊資訊服務之條件與注意事項。',
                  ZH_CN: '本条款旨在规范使用 Stepless 所提供的釜山地铁无障碍动线、直梯位置、出口指南及相关旅游信息服务的条件与注意事项。'
                })}
              </p>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EA85E]"></span>
                <span>{pickLang(language, { KR: '제 2 조 (실시간 시설 변동 가능성 및 정보의 한계)', EN: 'Article 2 (Facility Variability & Disclaimer)', JA: '第2条（施設の変動可能性および免責事項）', ZH_TW: '第 2 條（設施即時變動與免責聲明）', ZH_CN: '第 2 条（设施实时变动与免责声明）' })}</span>
              </h3>
              <div className="space-y-2 font-medium text-slate-600 leading-relaxed pl-3 sm:pl-3.5">
                <p>
                  {pickLang(language, {
                    KR: '1. 본 서비스에서 제공하는 승강기(엘리베이터 및 에스컬레이터) 위치, 출구 번호, 휠체어 리프트 및 노선 가이드는 현장 조사, 공식 공공데이터 및 이용자 제보를 바탕으로 정기 수집·검증됩니다.',
                    EN: '1. Station elevator locations, exit numbers, and barrier-free routes are compiled via physical site audits, public open data, and verified user feedback.',
                    JA: '1. 当サービスが提供するエレベーター・エスカレーター位置や出口案内は、現地調査・公共データ・利用者からの情報提供に基づき定期的に検証されています。',
                    ZH_TW: '1. 本服務提供之電梯、電扶梯位置與出口指南，係透過實地勘查、官方開放資料與使用者回報定期收集與驗證。',
                    ZH_CN: '1. 本服务提供的直梯、扶梯位置与出口指南，均通过实地勘查、官方开放数据与用户反馈定期收集与验证。'
                  })}
                </p>
                <p>
                  {pickLang(language, {
                    KR: '2. 실시간 변동성 안내: 부산교통공사, 한국철도공사 등 역사를 관리하는 기관의 긴급 시설 점검, 갑작스러운 기계 고장, 보수 공사, 기상 악화, 임시 출구 통제 등에 의해 현장의 실시간 시설 상태와 서비스 안내 내용 간 일시적 불일치가 발생할 수 있습니다.',
                    EN: '2. Unannounced maintenance, sudden machinery failure, construction, or bad weather managed by transit authorities may cause temporary discrepancies.',
                    JA: '2. 鉄道運営機関による緊急点検や突発的な故障、改修工事、悪天候等により、現地のリアルタイム状況と案内内容に一時的な差異が生じる場合があります。',
                    ZH_TW: '2. 因營運機構之緊急檢修、突發故障、施工或天候因素，現場即時狀況可能與指南內容產生暫時性差異，敬請作為出行參考。',
                    ZH_CN: '2. 因运营机构的紧急检修、突发故障、施工或天气因素，现场实时状况可能与指南内容产生暂时性差异，敬请作为出行参考。'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 5: 데이터 출처 (Data Sources) */}
      {activeSubTab === 'data-source' && (
        <div className="space-y-6 animate-fade-in text-left pt-1 sm:pt-2 google-anno-skip" data-ad-exclude="true">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 sm:w-6 sm:h-6 text-[#8EA85E] shrink-0" />
              <span>{pickLang(language, { KR: '데이터 출처', EN: 'Data Sources', JA: 'データ出典', ZH_TW: '資料來源', ZH_CN: '数据来源' })}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {pickLang(language, {
                KR: '공식 지도, 공공데이터 및 대중교통 데이터 출처 명시',
                EN: 'Official transit authorities and open government data credentials.',
                JA: '公式マップ、公共データおよび公共交通データの出典明記',
                ZH_TW: '官方地圖、開放資料與大眾運輸資料來源說明',
                ZH_CN: '官方地图、开放数据与公共交通数据来源说明'
              })}
            </p>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-200/80">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {pickLang(language, { KR: '공식 연계 데이터 제공처', EN: 'Official Data Providers', JA: '公式連携データ提供元', ZH_TW: '官方串聯資料提供機構', ZH_CN: '官方关联数据提供机构' })}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="space-y-1 border-l-2 border-[#8EA85E]/40 pl-3.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm sm:text-base">
                  <span>네이버지도 (Naver Map)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-slate-500 text-xs font-medium">
                  {pickLang(language, { KR: '실시간 위치 및 역별 공식 출처 연계', EN: 'Real-time location & exit reference', JA: 'リアルタイム位置および駅別公式マップ連携', ZH_TW: '即時位置與各站官方出口地圖串聯', ZH_CN: '实时位置与各站官方出口地图关联' })}
                </p>
              </div>

              <div className="space-y-1 border-l-2 border-[#8EA85E]/40 pl-3.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm sm:text-base">
                  <span>부산교통공사 (Humetro)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-slate-500 text-xs font-medium">
                  {pickLang(language, { KR: '도시철도 역 구조도 및 출구 규격', EN: 'Subway blueprints & exit specifications', JA: '都市鉄道駅構内図および出口・昇降機情報', ZH_TW: '都市鐵道車站結構圖與出口升降設備規格', ZH_CN: '城市铁道车站结构图与出口升降设备规格' })}
                </p>
              </div>

              <div className="space-y-1 border-l-2 border-[#8EA85E]/40 pl-3.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm sm:text-base">
                  <span>공공데이터포털 / TourAPI</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-slate-500 text-xs font-medium">
                  {pickLang(language, { KR: '전국 도시철도 승강기 및 무장애 관광 정보', EN: 'Korea Tourism Organization Barrier-Free TourAPI', JA: '韓国観光公社バリアフリー観光情報（TourAPI）', ZH_TW: '韓國觀光公社無障礙旅遊資訊（TourAPI）', ZH_CN: '韩国观光公社无障碍旅游信息（TourAPI）' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default SiteIntroductionView;
