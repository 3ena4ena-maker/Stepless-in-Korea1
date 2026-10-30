import React from 'react';
import { ExternalLink, Luggage, Ticket, Sparkles } from 'lucide-react';
import { Language, pickLang } from '../i18n/dictionary';

export const KLOOK_AFFILIATE_LINKS = {
  /** 부산 전체 티켓·투어·액티비티 모아보기 */
  BUSAN_ALL_ACTIVITIES: 'https://klook.tpo.lu/ubk63ni8',
  /** 비짓부산패스 (Visit Busan Pass) */
  VISIT_BUSAN_PASS: 'https://klook.tpo.lu/SiJULDdz',
  /** 부산역·김해공항 ↔ 호텔 캐리어 당일 짐배송/보관 */
  BUSAN_LUGGAGE_DELIVERY: 'https://klook.tpo.lu/uAtQqn4w',
} as const;

interface BusanAffiliateQuickBarProps {
  language: Language;
  variant?: 'full' | 'locker-inline' | 'nearby-inline';
}

export default function BusanAffiliateQuickBar({
  language,
  variant = 'full',
}: BusanAffiliateQuickBarProps) {
  if (variant === 'locker-inline') {
    return (
      <div className="mt-2.5 pt-2.5 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-indigo-50/50 px-3 py-2 rounded-xl border border-indigo-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
          <Luggage className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>
            {pickLang(language, {
              KR: '대형 보관함이 꽉 찼거나 빈손으로 바로 여행하고 싶다면?',
              EN: 'Large lockers full, or want to travel hands-free right away?',
              JA: '大型ロッカーが満杯、または手ぶらでそのまま観光したいなら？',
              ZH_TW: '大型置物櫃已滿，或想一下車就空手輕鬆觀光？',
              ZH_CN: '大型寄存柜已满，或想一下车就空手轻松游览？',
              ES: '¿Taquillas llenas o quieres viajar sin cargar maletas?',
              FR: 'Consignes complètes ou envie de visiter les mains libres ?',
            })}
          </span>
        </div>
        <a
          href={KLOOK_AFFILIATE_LINKS.BUSAN_LUGGAGE_DELIVERY}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] sm:text-xs transition-all shadow-2xs shrink-0 no-underline"
        >
          <span>
            {pickLang(language, {
              KR: '부산역·공항 ↔ 숙소 캐리어 배송 예약',
              EN: 'Book Same-Day Luggage Delivery',
              JA: '釜山駅・空港 ↔ ホテル荷物配送を予約',
              ZH_TW: '預約釜山站・機場 ↔ 飯店行李配送',
              ZH_CN: '预约釜山站・机场 ↔ 酒店行李配送',
              ES: 'Reservar entrega de equipaje',
              FR: 'Réserver livraison de bagages',
            })}
          </span>
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
      </div>
    );
  }

  if (variant === 'nearby-inline') {
    return (
      <div className="mt-2.5 pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 bg-[#F4F8EE] px-3 py-2 rounded-xl border border-[#DCE7CC]">
        <div className="flex items-center gap-1.5 text-xs text-slate-800 font-semibold">
          <Ticket className="w-3.5 h-3.5 text-[#5E7A31] shrink-0" />
          <span>
            {pickLang(language, {
              KR: '주변 유료 명소·투어를 현장 줄 서지 않고 할인받으려면?',
              EN: 'Skip ticket lines and save on Busan attractions & tours:',
              JA: '周辺の有料スポット・ツアーを並ばずお得に予約するなら：',
              ZH_TW: '想免排隊優惠預訂周邊熱門景點與一日遊？',
              ZH_CN: '想免排队优惠预订周边热门景点与一日游？',
              ES: 'Ahorra y evita colas en las atracciones y tours de Busan:',
              FR: 'Coupe-file et réductions sur les attractions de Busan :',
            })}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <a
            href={KLOOK_AFFILIATE_LINKS.VISIT_BUSAN_PASS}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#6B853E] hover:bg-[#586F31] text-white font-bold text-[11px] sm:text-xs transition-all shadow-2xs no-underline"
          >
            <span>
              {pickLang(language, {
                KR: '🎟️ 비짓부산패스 할인',
                EN: '🎟️ Visit Busan Pass',
                JA: '🎟️ ビジット釜山パス割引',
                ZH_TW: '🎟️ 釜山通行證 Visit Busan Pass',
                ZH_CN: '🎟️ 釜山通行证 Visit Busan Pass',
                ES: '🎟️ Visit Busan Pass',
                FR: '🎟️ Visit Busan Pass',
              })}
            </span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
          <a
            href={KLOOK_AFFILIATE_LINKS.BUSAN_ALL_ACTIVITIES}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#4D6328] border border-[#C6D8AE] font-bold text-[11px] sm:text-xs transition-all shadow-2xs no-underline"
          >
            <span>
              {pickLang(language, {
                KR: '🎡 부산 인기 입장권·투어 모아보기',
                EN: '🎡 All Busan Tickets & Tours',
                JA: '🎡 釜山の人気チケット・ツアー一覧',
                ZH_TW: '🎡 釜山熱門門票・一日遊總覽',
                ZH_CN: '🎡 釜山热门门票・一日游总览',
                ES: '🎡 Entradas y Tours en Busan',
                FR: '🎡 Billets & Excursions à Busan',
              })}
            </span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-label="Busan Travel Deals"
      className="bg-gradient-to-br from-[#F7FAF2] via-white to-[#F3F7EC] rounded-3xl p-5 sm:p-6 border border-[#D8E5C5] shadow-xs text-left"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-[#8EA85E]/15 text-[#5E7A31] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
              {pickLang(language, {
                KR: '부산 여행 필수 패스 & 빈손 여행(짐배송) 할인 예약',
                EN: 'Essential Busan Travel Pass & Hands-Free Luggage Delivery',
                JA: '釜山旅行の必須パス＆手ぶら観光（荷物配送）お得予約',
                ZH_TW: '釜山旅遊必備通行證 ＆ 空手觀光（行李配送）優惠預訂',
                ZH_CN: '釜山旅游必备通行证 ＆ 空手观光（行李配送）优惠预订',
                ES: 'Pase Esencial de Busan, Entradas y Entrega de Equipaje',
                FR: 'Pass Essentiel de Busan, Billets & Livraison de Bagages',
              })}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              {pickLang(language, {
                KR: '현장 매표소 대기 없이 모바일 QR로 바로 입장하고 무거운 캐리어는 숙소로 먼저 보내세요.',
                EN: 'Skip ticket lines with mobile QR entry and send heavy suitcases straight to your hotel.',
                JA: 'チケット売り場に並ばずスマホQRでそのまま入場！重いスーツケースはホテルへ先に送れます。',
                ZH_TW: '免排隊購票直接刷手機 QR 入場，並將沉重行李箱直接配送至下榻飯店。',
                ZH_CN: '免排队购票直接刷手机 QR 入场，并将沉重行李箱直接配送至下榻酒店。',
                ES: 'Entra directo con código QR móvil sin hacer cola y envía tus maletas pesadas al hotel.',
                FR: 'Accédez sans file d’attente avec QR mobile et faites livrer vos valises directement à l’hôtel.',
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1: Visit Busan Pass */}
        <a
          href={KLOOK_AFFILIATE_LINKS.VISIT_BUSAN_PASS}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group bg-white hover:bg-[#F9FBF6] p-4 rounded-2xl border border-[#DCE7CC] hover:border-[#8EA85E] transition-all flex flex-col justify-between gap-3 shadow-2xs hover:shadow-sm no-underline"
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-[#5E7A31] bg-[#EDF4E3] px-2 py-0.5 rounded-md">
                {pickLang(language, {
                  KR: '인기 1위 필수템',
                  EN: '#1 Best Seller',
                  JA: '人気No.1 必須パス',
                  ZH_TW: '人氣 No.1 必買',
                  ZH_CN: '人气 No.1 必买',
                  ES: 'N.º 1 Más vendido',
                  FR: 'N°1 Indispensable',
                })}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#6B853E] transition-colors shrink-0" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-[#4D6328] transition-colors pt-1">
              {pickLang(language, {
                KR: '🎟️ 비짓부산패스 (Visit Busan Pass)',
                EN: '🎟️ Visit Busan Pass (Official)',
                JA: '🎟️ ビジット釜山パス (Visit Busan Pass)',
                ZH_TW: '🎟️ 釜山通行證 (Visit Busan Pass)',
                ZH_CN: '🎟️ 釜山通行证 (Visit Busan Pass)',
                ES: '🎟️ Visit Busan Pass (Pase Oficial)',
                FR: '🎟️ Visit Busan Pass (Pass Officiel)',
              })}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {pickLang(language, {
                KR: '해운대 해변열차·스파랜드·엑스더스카이·롯데월드·시티투어버스 등 40곳+ 무료 프리패스',
                EN: 'Free access to 40+ top Busan attractions including Beach Train, Spaland, X the SKY & City Tour Bus',
                JA: '海雲台海辺列車・スパランド・X the SKY・ロッテワールド・シティツアーバスなど40ヶ所以上が無料',
                ZH_TW: '免費暢遊海雲台海岸列車、Spa Land、X the SKY、樂天世界與城市觀光巴士等 40+ 景點',
                ZH_CN: '免费畅游海云台海岸列车、Spa Land、X the SKY、乐天世界与城市观光巴士等 40+ 景点',
                ES: 'Acceso gratuito a más de 40 atracciones: Tren Costero de Haeundae, Spaland, X the SKY y Bus Turístico',
                FR: 'Accès gratuit à plus de 40 sites : Train côtier de Haeundae, Spaland, X the SKY et Bus Touristique',
              })}
            </p>
          </div>
          <div className="text-xs font-extrabold text-[#5E7A31] flex items-center gap-1 pt-1">
            <span>
              {pickLang(language, {
                KR: '할인가 확인 및 예약하기 →',
                EN: 'Check Discount & Book →',
                JA: '割引価格を確認・予約する →',
                ZH_TW: '查看優惠價並立即預訂 →',
                ZH_CN: '查看优惠价并立即预订 →',
                ES: 'Ver descuento y reservar →',
                FR: 'Voir le tarif réduit & réserver →',
              })}
            </span>
          </div>
        </a>

        {/* Card 2: Luggage Delivery */}
        <a
          href={KLOOK_AFFILIATE_LINKS.BUSAN_LUGGAGE_DELIVERY}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group bg-white hover:bg-indigo-50/40 p-4 rounded-2xl border border-slate-200/90 hover:border-indigo-400 transition-all flex flex-col justify-between gap-3 shadow-2xs hover:shadow-sm no-underline"
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                {pickLang(language, {
                  KR: '무거운 캐리어 해방',
                  EN: 'Hands-Free Travel',
                  JA: 'スーツケース配送',
                  ZH_TW: '空手輕鬆觀光',
                  ZH_CN: '空手轻松游览',
                  ES: 'Viaja sin maletas',
                  FR: 'Voyagez mains libres',
                })}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors pt-1">
              {pickLang(language, {
                KR: '🧳 부산역·김해공항 ↔ 호텔 짐배송',
                EN: '🧳 Busan Station / Airport ↔ Hotel Luggage',
                JA: '🧳 釜山駅・金海空港 ↔ ホテル当日荷物配送',
                ZH_TW: '🧳 釜山站・金海機場 ↔ 飯店當日行李配送',
                ZH_CN: '🧳 釜山站・金海机场 ↔ 酒店当日行李配送',
                ES: '🧳 Entrega de Equipaje: Estación/Aeropuerto ↔ Hotel',
                FR: '🧳 Livraison de Bagages : Gare/Aéroport ↔ Hôtel',
              })}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {pickLang(language, {
                KR: '지하철 보관함 빈자리 찾을 필요 없이 도착 즉시 짐을 맡기고 두 손 가볍게 부산 여행을 시작하세요',
                EN: 'Drop off your bags upon arrival at Busan Station or Gimhae Airport and pick them up at your hotel',
                JA: '駅のコインロッカーを探す手間なし！到着後すぐ荷物を預けて、手ぶらで釜山観光をスタート',
                ZH_TW: '不必在車站找空置物櫃！抵達釜山站或機場即可交寄行李，直接空手展開旅程',
                ZH_CN: '不必在车站找空寄存柜！抵达釜山站或机场即可交寄行李，直接空手开启旅程',
                ES: 'Olvídate de buscar taquillas vacías: deja tu maleta al llegar y recógela directamente en tu hotel',
                FR: 'Plus besoin de chercher une consigne libre : déposez vos valises à l’arrivée et récupérez-les à l’hôtel',
              })}
            </p>
          </div>
          <div className="text-xs font-extrabold text-indigo-600 flex items-center gap-1 pt-1">
            <span>
              {pickLang(language, {
                KR: '짐배송·보관 예약하기 →',
                EN: 'Book Luggage Delivery →',
                JA: '荷物配送・預かりを予約する →',
                ZH_TW: '預訂行李配送・寄存服務 →',
                ZH_CN: '预订行李配送・寄存服务 →',
                ES: 'Reservar entrega de equipaje →',
                FR: 'Réserver la livraison →',
              })}
            </span>
          </div>
        </a>

        {/* Card 3: All Busan Tickets & Tours */}
        <a
          href={KLOOK_AFFILIATE_LINKS.BUSAN_ALL_ACTIVITIES}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group bg-white hover:bg-amber-50/40 p-4 rounded-2xl border border-slate-200/90 hover:border-amber-400 transition-all flex flex-col justify-between gap-3 shadow-2xs hover:shadow-sm no-underline"
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                {pickLang(language, {
                  KR: '모바일 즉시 입장',
                  EN: 'Instant QR Tickets',
                  JA: 'スマホ即時入場',
                  ZH_TW: '手機即時憑證',
                  ZH_CN: '手机即时凭证',
                  ES: 'Entrada QR inmediata',
                  FR: 'Billet QR immédiat',
                })}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors pt-1">
              {pickLang(language, {
                KR: '🎡 부산 인기 티켓·요트·일일투어 특가',
                EN: '🎡 Top Busan Tickets, Yachts & Day Tours',
                JA: '🎡 釜山の人気チケット・ヨット・日帰りツアー',
                ZH_TW: '🎡 釜山熱門門票・遊艇・一日遊特價',
                ZH_CN: '🎡 釜山热门门票・游艇・一日游特价',
                ES: '🎡 Entradas, Yates y Excursiones en Busan',
                FR: '🎡 Billets, Croisières en Yacht & Excursions',
              })}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {pickLang(language, {
                KR: '해운대 스카이캡슐·광안리 요트투어·송도 해상케이블카·아쿠아리움 모바일 할인 티켓 총정리',
                EN: 'Discounted tickets for Sky Capsule, Gwangalli Yacht Tour, Songdo Marine Cable Car & SEA LIFE Aquarium',
                JA: '海雲台スカイカプセル・広安里ヨットツアー・松島海上ケーブルカー・アクアリウムの割引チケット',
                ZH_TW: '海雲台天空膠囊列車、廣安里遊艇、松島海上纜車、SEA LIFE 水族館優惠門票總整理',
                ZH_CN: '海云台天空胶囊列车、广安里游艇、松岛海上缆车、SEA LIFE 水族馆优惠门票全整理',
                ES: 'Entradas con descuento para Sky Capsule, paseo en yate por Gwangalli, teleférico de Songdo y Acuario',
                FR: 'Billets à prix réduit : Sky Capsule, yacht à Gwangalli, téléphérique de Songdo et Aquarium SEA LIFE',
              })}
            </p>
          </div>
          <div className="text-xs font-extrabold text-amber-700 flex items-center gap-1 pt-1">
            <span>
              {pickLang(language, {
                KR: '부산 전체 액티비티 보기 →',
                EN: 'Explore All Busan Deals →',
                JA: '釜山の全アクティビティを見る →',
                ZH_TW: '查看釜山所有熱門活動 →',
                ZH_CN: '查看釜山所有热门活动 →',
                ES: 'Ver todas las ofertas en Busan →',
                FR: 'Voir toutes les activités à Busan →',
              })}
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
