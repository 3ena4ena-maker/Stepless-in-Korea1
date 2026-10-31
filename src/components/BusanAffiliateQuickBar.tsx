import React from 'react';
import { Luggage, Ticket, Compass } from 'lucide-react';
import { Language, pickLang } from '../i18n/dictionary';

export const KLOOK_AFFILIATE_LINKS = {
  /** 클룩 부산 전체 티켓·투어·액티비티 모아보기 */
  BUSAN_ALL_ACTIVITIES: 'https://klook.tpo.lu/ubk63ni8',
  /** 클룩 비짓부산패스 (Visit Busan Pass) */
  VISIT_BUSAN_PASS: 'https://klook.tpo.lu/SiJULDdz',
  /** 클룩 부산역·김해공항 ↔ 호텔 캐리어 당일 짐배송/보관 */
  BUSAN_LUGGAGE_DELIVERY: 'https://klook.tpo.lu/uAtQqn4w',
} as const;

export const KKDAY_AFFILIATE_LINKS = {
  /** KKday 부산 전체 티켓·투어·액티비티 모아보기 */
  BUSAN_ALL_ACTIVITIES: 'https://kkday.tpo.lu/uDIr24Q9',
  /** KKday 비짓부산패스 (Visit Busan Pass) */
  VISIT_BUSAN_PASS: 'https://kkday.tpo.lu/C2tJkhog',
  /** KKday 부산역·김해공항 ↔ 호텔 캐리어 당일 짐배송/보관 */
  BUSAN_LUGGAGE_DELIVERY: 'https://kkday.tpo.lu/zKPZdnv5',
} as const;

function buildKlookProductAffiliateUrl(productUrl: string): string {
  return `https://affiliate.klook.com/redirect?aid=api%7C13694%7C2cf368b8963a4303a1d379f54-797916%7Cpid%7C797916&k_site=${encodeURIComponent(productUrl)}`;
}

function buildKkdayProductAffiliateUrl(productUrl: string): string {
  return `https://invl.me/clndj1c?aff_sub=0b33b1e179804a3c9b03f5144-797916&url=${encodeURIComponent(productUrl)}`;
}

export interface SpotTicketBookingInfo {
  label: Record<Language, string>;
  klookUrl?: string;
  kkdayUrl?: string;
}

/**
 * 클룩(Klook) 또는 케이케이데이(KKday)에 실제 단독 예매 상품 페이지가 존재하는 장소만 매핑합니다.
 * (국립부산과학관, 부산과학체험관, 허심청, 태종대 등 단독 온라인 티켓 상품이 없는 곳은 제외)
 */
export function getSpotTicketBookingInfo(
  spotTitleKo: string,
  language: Language = 'KR'
): SpotTicketBookingInfo | null {
  const title = spotTitleKo || '';
  const isKr = language === 'KR';

  // 1. 부산 시티투어버스 (BUTI) - Klook & KKday 단독 상품 페이지 직결
  if (title.includes('시티투어')) {
    return {
      label: {
        KR: '부산 시티투어버스 티켓 바로 예매',
        EN: 'Book Busan City Tour Bus Ticket',
        JA: '釜山シティツアーバス乗車券を予約',
        ZH_TW: '立即預訂釜山觀光巴士車票',
        ZH_CN: '立即预订釜山观光巴士车票',
        ES: 'Reservar billete de Bus Turístico de Busan',
        FR: 'Réserver un billet Bus Touristique de Busan',
      },
      klookUrl: buildKlookProductAffiliateUrl(
        isKr
          ? 'https://www.klook.com/ko/activity/144435-busan-city-tour-bus/'
          : 'https://www.klook.com/activity/4128-buti-busan-city-tour-bus-busan/'
      ),
      kkdayUrl: buildKkdayProductAffiliateUrl(
        'https://www.kkday.com/ko/product/3021-busan-city-tour-pass-korea'
      ),
    };
  }

  // 2. 아르떼뮤지엄 부산 - Klook & KKday 단독 입장권 페이지 직결
  if (title.includes('아르떼뮤지엄')) {
    return {
      label: {
        KR: '아르떼뮤지엄 부산 입장권 바로 예매',
        EN: 'Book Arte Museum Busan Ticket',
        JA: 'アルテミュージアム釜山 入場券を予約',
        ZH_TW: '立即預訂釜山 ARTE MUSEUM 門票',
        ZH_CN: '立即预订釜山 ARTE MUSEUM 门票',
        ES: 'Reservar entrada a Arte Museum Busan',
        FR: 'Réserver un billet Arte Museum Busan',
      },
      klookUrl: buildKlookProductAffiliateUrl(
        'https://www.klook.com/ko/activity/122464-busan-artemuseum/'
      ),
      kkdayUrl: buildKkdayProductAffiliateUrl(
        'https://www.kkday.com/ko/product/184194'
      ),
    };
  }

  // 3. 뮤지엄원 (Museum 1) - Klook & KKday 단독 입장권 페이지 직결
  if (title.includes('뮤지엄원') || title.includes('뮤지엄 원')) {
    return {
      label: {
        KR: '뮤지엄원 입장권 바로 예매',
        EN: 'Book Museum 1 Ticket',
        JA: 'ミュージアムワン入場券を予約',
        ZH_TW: '立即預訂 Museum 1 門票',
        ZH_CN: '立即预订 Museum 1 门票',
        ES: 'Reservar entrada a Museum 1',
        FR: 'Réserver un billet Museum 1',
      },
      klookUrl: buildKlookProductAffiliateUrl(
        'https://www.klook.com/ko/activity/72587-museum-one-busan-ticket/'
      ),
      kkdayUrl: buildKkdayProductAffiliateUrl(
        'https://www.kkday.com/ko/product/35943'
      ),
    };
  }

  // 4. 부산영화체험박물관 - Klook 단독 입장권 페이지 직결
  if (title.includes('영화체험박물관')) {
    return {
      label: {
        KR: '부산영화체험박물관 입장권 바로 예매',
        EN: 'Book Busan Museum of Movies Ticket',
        JA: '釜山映画体験博物館 入場券を予約',
        ZH_TW: '立即預訂釜山電影體驗博物館門票',
        ZH_CN: '立即预订釜山电影体验博物馆门票',
        ES: 'Reservar entrada al Museo del Cine de Busan',
        FR: 'Réserver un billet Musée du Cinéma de Busan',
      },
      klookUrl: buildKlookProductAffiliateUrl(
        isKr
          ? 'https://www.klook.com/ko/destination/p60018950-busan-museum-of-movies/'
          : 'https://www.klook.com/activity/21770-museum-movies-trick-eye-ticket-busan/'
      ),
    };
  }

  // 5. 해운대 블루라인파크 (해변열차 · 스카이캡슐) - Klook & KKday 단독 탑승권 페이지 직결
  if (title.includes('블루라인파크') || title.includes('해변열차') || title.includes('스카이캡슐')) {
    return {
      label: {
        KR: '해변열차 · 스카이캡슐 탑승권 바로 예매',
        EN: 'Book Beach Train & Sky Capsule Ticket',
        JA: '海辺列車・スカイカプセル乗車券を予約',
        ZH_TW: '立即預訂海岸列車・天空膠囊車票',
        ZH_CN: '立即预订海岸列车・天空胶囊车票',
        ES: 'Reservar Tren Costero y Sky Capsule',
        FR: 'Réserver Train Côtier & Sky Capsule',
      },
      klookUrl: buildKlookProductAffiliateUrl(
        isKr
          ? 'https://www.klook.com/ko/activity/74132-busan-oneday-tour-busan/'
          : 'https://www.klook.com/activity/133293-haeundae-blueline-park-ticket-in-busan/'
      ),
      kkdayUrl: buildKkdayProductAffiliateUrl(
        'https://www.kkday.com/ko/product/123012-haeundae-blueline-park-sky-capsule-beach-train-ticket'
      ),
    };
  }

  // 6. 송도 해상케이블카 - Klook & KKday 단독 왕복 탑승권 페이지 직결
  if (title.includes('케이블카')) {
    return {
      label: {
        KR: '송도 해상케이블카 탑승권 바로 예매',
        EN: 'Book Songdo Marine Cable Car Ticket',
        JA: '松島海上ケーブルカー乗車券を予約',
        ZH_TW: '立即預訂松島海上纜車門票',
        ZH_CN: '立即预订松岛海上缆车门票',
        ES: 'Reservar Teleférico Marino de Songdo',
        FR: 'Réserver Téléphérique Marin de Songdo',
      },
      klookUrl: buildKlookProductAffiliateUrl(
        isKr
          ? 'https://www.klook.com/ko/activity/80742-busan-songdo-air-cruise-pass/'
          : 'https://www.klook.com/activity/17327-songdo-marine-cable-car-busan/'
      ),
      kkdayUrl: buildKkdayProductAffiliateUrl(
        'https://www.kkday.com/ko/product/111594'
      ),
    };
  }

  // 7. 용두산공원 부산타워 - Klook & KKday 단독 전망대 입장권 페이지 직결
  if (title.includes('용두산') || title.includes('부산타워') || title.includes('다이아몬드타워')) {
    return {
      label: {
        KR: '부산타워 전망대 입장권 바로 예매',
        EN: 'Book Busan Tower Observatory Ticket',
        JA: '釜山タワー展望台 入場券を予約',
        ZH_TW: '立即預訂釜山塔展望台門票',
        ZH_CN: '立即预订釜山塔展望台门票',
        ES: 'Reservar entrada a Busan Tower',
        FR: 'Réserver un billet Busan Tower',
      },
      klookUrl: buildKlookProductAffiliateUrl(
        'https://www.klook.com/ko/activity/106621-busan-tower/'
      ),
      kkdayUrl: buildKkdayProductAffiliateUrl(
        'https://www.kkday.com/ko/product/126890'
      ),
    };
  }

  // 8. 신세계 센텀시티 스파랜드 - Klook & KKday 단독 입장권 페이지 직결
  if (title.includes('센텀시티') || title.includes('스파랜드')) {
    return {
      label: {
        KR: '센텀 스파랜드 입장권 바로 예매',
        EN: 'Book Centum Spa Land Ticket',
        JA: '新世界スパランド入場券を予約',
        ZH_TW: '立即預訂新世界 Spa Land 門票',
        ZH_CN: '立即预订新世界 Spa Land 门票',
        ES: 'Reservar entrada a Centum Spa Land',
        FR: 'Réserver un billet Centum Spa Land',
      },
      klookUrl: buildKlookProductAffiliateUrl(
        isKr
          ? 'https://www.klook.com/ko/activity/68360-spa-land-ticket-busan/'
          : 'https://www.klook.com/activity/33180-spa-land-centum-city-ticket-busan/'
      ),
      kkdayUrl: buildKkdayProductAffiliateUrl(
        'https://www.kkday.com/ko/product/105110'
      ),
    };
  }

  // 9. 삼정타워 런닝맨 체험관 - Klook 단독 입장권 페이지 직결
  if (title.includes('삼정타워') || title.includes('런닝맨')) {
    return {
      label: {
        KR: '런닝맨 부산 체험관 입장권 바로 예매',
        EN: 'Book Running Man Busan Ticket',
        JA: 'ランニングマン釜山 体験館チケットを予約',
        ZH_TW: '立即預訂釜山 Running Man 體驗館門票',
        ZH_CN: '立即预订釜山 Running Man 体验馆门票',
        ES: 'Reservar entrada a Running Man Busan',
        FR: 'Réserver un billet Running Man Busan',
      },
      klookUrl: buildKlookProductAffiliateUrl(
        'https://www.klook.com/ko/activity/21862-running-man-experience-center-ticket-busan/'
      ),
    };
  }

  return null;
}

export function SpotTicketBookingRow({
  spotTitleKo,
  language,
}: {
  spotTitleKo: string;
  language: Language;
}) {
  const info = getSpotTicketBookingInfo(spotTitleKo, language);
  if (!info) return null;

  const isKkdayPreferred = language === 'ZH_TW' || language === 'JA';

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="pt-2.5 border-t border-[#E5E2DC]/80 space-y-1.5 text-left"
    >
      <div className="flex items-center gap-1.5 text-[11.5px] text-slate-700 font-semibold">
        <Ticket className="w-3.5 h-3.5 text-[#5E7A31] shrink-0" strokeWidth={1.75} />
        <span className="leading-snug">{pickLang(language, info.label)}</span>
      </div>
      <div className="pl-5">
        <PartnerIconPair
          klookHref={info.klookUrl}
          kkdayHref={info.kkdayUrl}
          isKkdayPreferred={isKkdayPreferred}
        />
      </div>
    </div>
  );
}

function KlookIconButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      title={label}
      aria-label={label}
      translate="no"
      data-no-localize="true"
      className="h-8 w-[72px] rounded-lg bg-white hover:bg-[#FFF5EF] border border-[#E5E2DC] hover:border-[#FF5B00]/60 flex items-center justify-center gap-1 shadow-2xs hover:scale-[1.03] active:scale-95 transition-all shrink-0 no-underline"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" aria-hidden="true">
        <path
          d="M12 2.5C13.1 2.5 14 3.4 14 4.5V8.2C14 9.3 13.1 10.2 12 10.2C10.9 10.2 10 9.3 10 8.2V4.5C10 3.4 10.9 2.5 12 2.5Z"
          fill="#FF5B00"
        />
        <path
          d="M20.2 7.2C20.8 8.1 20.5 9.4 19.5 10L16.3 11.8C15.3 12.4 14.1 12.1 13.5 11.1C12.9 10.1 13.3 8.9 14.3 8.3L17.5 6.5C18.4 5.9 19.7 6.2 20.2 7.2Z"
          fill="#FFB800"
        />
        <path
          d="M20.2 16.8C19.7 17.8 18.4 18.1 17.5 17.5L14.3 15.7C13.3 15.1 12.9 13.9 13.5 12.9C14.1 11.9 15.3 11.6 16.3 12.2L19.5 14C20.5 14.6 20.8 15.9 20.2 16.8Z"
          fill="#00C6B8"
        />
        <path
          d="M12 21.5C10.9 21.5 10 20.6 10 19.5V15.8C10 14.7 10.9 13.8 12 13.8C13.1 13.8 14 14.7 14 15.8V19.5C14 20.6 13.1 21.5 12 21.5Z"
          fill="#3B7DDD"
        />
        <path
          d="M3.8 16.8C3.2 15.9 3.5 14.6 4.5 14L7.7 12.2C8.7 11.6 9.9 11.9 10.5 12.9C11.1 13.9 10.7 15.1 9.7 15.7L6.5 17.5C5.6 18.1 4.3 17.8 3.8 16.8Z"
          fill="#FF5B00"
        />
        <path
          d="M3.8 7.2C4.3 6.2 5.6 5.9 6.5 6.5L9.7 8.3C10.7 8.9 11.1 10.1 10.5 11.1C9.9 12.1 8.7 12.4 7.7 11.8L4.5 10C3.5 9.4 3.2 8.1 3.8 7.2Z"
          fill="#FF385C"
        />
      </svg>
      <span className="text-[11px] font-extrabold tracking-tight text-[#FF5B00] leading-none">
        klook
      </span>
    </a>
  );
}

function KkdayIconButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      title={label}
      aria-label={label}
      translate="no"
      data-no-localize="true"
      className="h-8 w-[72px] rounded-lg bg-[#26BEC9] hover:bg-[#1FA8B2] border border-[#1FA8B2]/40 flex items-center justify-center shadow-2xs hover:scale-[1.03] active:scale-95 transition-all shrink-0 no-underline"
    >
      <span className="text-[12px] font-black tracking-tight text-white leading-none">
        kkday
      </span>
    </a>
  );
}

function PartnerIconPair({
  klookHref,
  kkdayHref,
  isKkdayPreferred,
}: {
  klookHref?: string;
  kkdayHref?: string;
  isKkdayPreferred: boolean;
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      {isKkdayPreferred ? (
        <>
          {kkdayHref && <KkdayIconButton href={kkdayHref} label="KKday" />}
          {klookHref && <KlookIconButton href={klookHref} label="Klook" />}
        </>
      ) : (
        <>
          {klookHref && <KlookIconButton href={klookHref} label="Klook" />}
          {kkdayHref && <KkdayIconButton href={kkdayHref} label="KKday" />}
        </>
      )}
    </div>
  );
}

interface BusanAffiliateQuickBarProps {
  language: Language;
  variant?: 'full' | 'luggage-only' | 'locker-inline' | 'nearby-inline';
}

export default function BusanAffiliateQuickBar({
  language,
  variant = 'full',
}: BusanAffiliateQuickBarProps) {
  const isKkdayPreferred = language === 'ZH_TW' || language === 'JA';

  if (variant === 'locker-inline') {
    return (
      <div className="mt-2.5 pt-2.5 border-t border-slate-200/70 space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <Luggage className="w-3.5 h-3.5 text-[#6B853E] shrink-0" strokeWidth={1.75} />
          <span>
            {pickLang(language, {
              KR: '보관함 만석 시 부산역·공항 ↔ 숙소 캐리어 당일 배송 예약',
              EN: 'Lockers full? Same-day luggage delivery (Station/Airport ↔ Hotel)',
              JA: 'ロッカー満杯時は手ぶら配送（釜山駅・空港 ↔ ホテル当日荷物配送）',
              ZH_TW: '置物櫃已滿？預約釜山站・機場 ↔ 飯店當日行李配送',
              ZH_CN: '寄存柜已满？预约釜山站・机场 ↔ 酒店当日行李配送',
              ES: '¿Taquillas llenas? Entrega de equipaje estación/aeropuerto ↔ hotel',
              FR: 'Consignes pleines ? Livraison de bagages gare/aéroport ↔ hôtel',
            })}
          </span>
        </div>
        <div className="pl-5">
          <PartnerIconPair
            klookHref={KLOOK_AFFILIATE_LINKS.BUSAN_LUGGAGE_DELIVERY}
            kkdayHref={KKDAY_AFFILIATE_LINKS.BUSAN_LUGGAGE_DELIVERY}
            isKkdayPreferred={isKkdayPreferred}
          />
        </div>
      </div>
    );
  }

  if (variant === 'nearby-inline') {
    return (
      <div className="mt-2.5 pt-2.5 border-t border-slate-200/70 space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <Ticket className="w-3.5 h-3.5 text-[#6B853E] shrink-0" strokeWidth={1.75} />
          <span>
            {pickLang(language, {
              KR: '주변 유료 명소 모바일 프리패스(비짓부산패스) 및 할인 티켓 예매',
              EN: 'Visit Busan Pass & discounted attraction mobile tickets',
              JA: '周辺スポットのビジット釜山パス・割引チケット予約',
              ZH_TW: '周邊景點釜山通行證 (Visit Busan Pass) 與優惠門票預訂',
              ZH_CN: '周边景点釜山通行证 (Visit Busan Pass) 与优惠门票预订',
              ES: 'Visit Busan Pass y entradas con descuento',
              FR: 'Visit Busan Pass et billets à tarif réduit',
            })}
          </span>
        </div>
        <div className="pl-5">
          <PartnerIconPair
            klookHref={KLOOK_AFFILIATE_LINKS.VISIT_BUSAN_PASS}
            kkdayHref={KKDAY_AFFILIATE_LINKS.VISIT_BUSAN_PASS}
            isKkdayPreferred={isKkdayPreferred}
          />
        </div>
      </div>
    );
  }

  const items = [
    {
      icon: Ticket,
      title: pickLang(language, {
        KR: '비짓부산패스 (Visit Busan Pass)',
        EN: 'Visit Busan Pass',
        JA: 'ビジット釜山パス (Visit Busan Pass)',
        ZH_TW: '釜山通行證 (Visit Busan Pass)',
        ZH_CN: '釜山通行证 (Visit Busan Pass)',
        ES: 'Visit Busan Pass',
        FR: 'Visit Busan Pass',
      }),
      desc: pickLang(language, {
        KR: '해변열차·스파랜드·엑스더스카이·시티투어 등 40곳+ 무료 입장',
        EN: 'Free entry to 40+ attractions including Beach Train & Spaland',
        JA: '海辺列車・スパランド・X the SKYなど40ヶ所以上が無料',
        ZH_TW: '免費暢遊海岸列車、Spa Land、X the SKY 等 40+ 景點',
        ZH_CN: '免费畅游海岸列车、Spa Land、X the SKY 等 40+ 景点',
        ES: 'Acceso gratuito a más de 40 atracciones en Busan',
        FR: 'Accès gratuit à plus de 40 attractions à Busan',
      }),
      klookUrl: KLOOK_AFFILIATE_LINKS.VISIT_BUSAN_PASS,
      kkdayUrl: KKDAY_AFFILIATE_LINKS.VISIT_BUSAN_PASS,
    },
    {
      icon: Luggage,
      title: pickLang(language, {
        KR: '부산역·김해공항 ↔ 호텔 짐배송',
        EN: 'Station / Airport ↔ Hotel Luggage Delivery',
        JA: '釜山駅・金海空港 ↔ ホテル当日荷物配送',
        ZH_TW: '釜山站・金海機場 ↔ 飯店當日行李配送',
        ZH_CN: '釜山站・金海机场 ↔ 酒店当日行李配送',
        ES: 'Entrega de equipaje: Estación/Aeropuerto ↔ Hotel',
        FR: 'Livraison de bagages : Gare/Aéroport ↔ Hôtel',
      }),
      desc: pickLang(language, {
        KR: '보관함 찾을 필요 없이 도착 즉시 숙소로 캐리어 당일 배송',
        EN: 'Drop off your suitcase on arrival and travel hands-free',
        JA: 'ロッカー不要、到着すぐ荷物を預けて手ぶらで釜山観光',
        ZH_TW: '免找置物櫃，抵達即交寄行李輕鬆空手觀光',
        ZH_CN: '免找寄存柜，抵達即交寄行李轻松空手游览',
        ES: 'Deja tu maleta al llegar y viaja con las manos libres',
        FR: 'Déposez vos valises à l’arrivée et visitez les mains libres',
      }),
      klookUrl: KLOOK_AFFILIATE_LINKS.BUSAN_LUGGAGE_DELIVERY,
      kkdayUrl: KKDAY_AFFILIATE_LINKS.BUSAN_LUGGAGE_DELIVERY,
    },
    {
      icon: Compass,
      title: pickLang(language, {
        KR: '부산 인기 티켓·요트·투어 예매',
        EN: 'Busan Tickets, Yachts & Day Tours',
        JA: '釜山の人気チケット・ヨット・日帰りツアー',
        ZH_TW: '釜山熱門門票・遊艇・一日遊預訂',
        ZH_CN: '釜山热门门票・游艇・一日游预订',
        ES: 'Entradas, Yates y Excursiones en Busan',
        FR: 'Billets, Yacht & Excursions à Busan',
      }),
      desc: pickLang(language, {
        KR: '스카이캡슐·광안리 요트·송도 케이블카·아쿠아리움 모바일권',
        EN: 'Sky Capsule, Gwangalli Yacht, Songdo Cable Car & Aquarium',
        JA: 'スカイカプセル・広安里ヨット・松島ケーブルカー割引券',
        ZH_TW: '天空膠囊列車、廣安里遊艇、松島纜車與水族館優惠券',
        ZH_CN: '天空胶囊列车、广安里游艇、松岛缆车与水族馆优惠券',
        ES: 'Sky Capsule, yate en Gwangalli, teleférico de Songdo y más',
        FR: 'Sky Capsule, yacht à Gwangalli, téléphérique de Songdo',
      }),
      klookUrl: KLOOK_AFFILIATE_LINKS.BUSAN_ALL_ACTIVITIES,
      kkdayUrl: KKDAY_AFFILIATE_LINKS.BUSAN_ALL_ACTIVITIES,
    },
  ];

  if (variant === 'luggage-only') {
    const luggageItem = items[1];
    const Icon = luggageItem.icon;
    return (
      <section aria-label="Busan Luggage Delivery" className="py-2 text-left">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#EDF4E3] border border-[#D5E3C3] flex items-center justify-center text-[#5E7A31] shrink-0 mt-0.5">
              <Icon className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-[13px] font-bold text-[#11161B] leading-snug">
                {luggageItem.title}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5 break-keep">
                {luggageItem.desc}
              </p>
            </div>
          </div>

          <div className="sm:pl-1 shrink-0">
            <PartnerIconPair
              klookHref={luggageItem.klookUrl}
              kkdayHref={luggageItem.kkdayUrl}
              isKkdayPreferred={isKkdayPreferred}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Busan Travel Deals" className="py-2 text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5E2DC]">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`flex flex-col justify-between gap-2.5 ${
                idx === 0 ? 'pb-3.5 md:pb-0 md:pr-5' : idx === 1 ? 'py-3.5 md:py-0 md:px-5' : 'pt-3.5 md:pt-0 md:pl-5'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#EDF4E3] border border-[#D5E3C3] flex items-center justify-center text-[#5E7A31] shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-[13px] font-bold text-[#11161B] leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5 break-keep">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="pl-10">
                <PartnerIconPair
                  klookHref={item.klookUrl}
                  kkdayHref={item.kkdayUrl}
                  isKkdayPreferred={isKkdayPreferred}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
