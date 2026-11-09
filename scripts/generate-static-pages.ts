import fs from 'fs';
import path from 'path';
import { STATIONS } from '../src/data';
import { BUSAN_ITINERARIES, ItineraryCourse } from '../src/data/itineraries';
import { BUSAN_TOUR_API_SPOTS } from '../src/data/tourApiSpots';
import { Language, LANGUAGE_OPTIONS, buildLocalizedPath, getHreflangEntries, DICTIONARY, pickLang } from '../src/i18n/dictionary';
import {
  getLocalizedStationTitle,
  getStationLocalized,
  formatLineLabelI18n,
  formatExitNumberI18n,
  translateExitDirectionI18n,
  translateExitTipI18n,
} from '../src/i18n/stationTranslations';

const staticPhraseCachePath = path.join(process.cwd(), 'src', 'i18n', 'staticPhraseCache.json');
const STATIC_PHRASE_CACHE: Record<string, Record<string, string>> = fs.existsSync(staticPhraseCachePath)
  ? JSON.parse(fs.readFileSync(staticPhraseCachePath, 'utf-8'))
  : {};

function trEn(enText: string | undefined | null, lang: Language): string {
  if (!enText) return '';
  if (lang === 'EN' || lang === 'KR') return enText;
  const trimmed = enText.trim();
  const dict = STATIC_PHRASE_CACHE[lang];
  if (dict && dict[trimmed]) {
    return dict[trimmed];
  }
  return enText;
}

const LANGUAGE_SEO_KEYWORDS: Record<Language, string> = {
  KR: '부산 여행, 부산 여행 코스, 부산 자유여행, 부산 여행 계획, 부산 일정 추천, 부산 가볼만한곳, 부산 관광지, 부산 핫플, 부산 당일치기, 부산 1박2일 코스, 부산 2박3일 코스, 부산 3박4일 코스, 부산 4박5일 코스, 부산 맛집, 부산 카페, 돼지국밥, 밀면, 씨앗호떡, 기장 대게, 해운대 해수욕장, 해운대 블루라인파크 해변열차 스카이캡슐, 광안리 해수욕장, 광안리 드론쇼, 서면, 전포카페거리, 남포동, 자갈치시장, 국제시장, 부평깡통야시장, 감천문화마을, 영도 흰여울문화마을, 태종대, 해동용궁사, 송도해상케이블카, 다대포 해수욕장, 기장 오시리아, 롯데월드 부산, 스카이라인 루지, 엑스더스카이, 부산아쿠아리움, 비짓부산패스, 부산 시티투어버스, 김해공항 경전철, KTX 부산역, 부산 지하철 노선도, 부산 지하철 엘리베이터, 서면역 엘리베이터, 부산역 엘리베이터, 해운대역 엘리베이터, 부산 아기랑 갈만한곳, 부산 유모차 여행, 부산 부모님 효도여행, 부산 가족여행, 부산 휠체어 여행, 부산 캐리어 보관, 부산 무장애 여행, 부산 배리어프리, 스탭리스, Stepless',
  EN: 'Busan travel, Busan travel guide, Busan trip plan, Busan itinerary, things to do in Busan, best places to visit in Busan, 1 day in Busan, 2 days in Busan, 3 days in Busan, 4 days in Busan, 5 days in Busan, where to eat in Busan, Busan food guide, Haeundae Beach, Haeundae Blueline Park Sky Capsule, Gwangalli Beach, Gwangalli Drone Show, Seomyeon, Jeonpo Cafe Street, Nampo-dong, Jagalchi Fish Market, Gukje Market, Bupyeong Kkangtong Night Market, Gamcheon Culture Village, Huinnyeoul Culture Village, Yeongdo, Taejongdae, Haedong Yonggungsa Temple, Songdo Cable Car, Dadaepo Beach, Gijang, Lotte World Busan, Skyline Luge Busan, BUSAN X the SKY, SEA LIFE Busan Aquarium, Visit Busan Pass, Busan City Tour Bus, Gimhae Airport to Busan, KTX Busan Station, Busan Metro map, Busan subway elevator map, step-free Busan, wheelchair accessible Busan, Busan with stroller, Busan with kids, Busan family trip, Busan luggage storage, Stepless in Busan',
  JA: '釜山旅行, 釜山 観光, 釜山 おすすめスポット, 釜山 モデルコース, 釜山 自由旅行, 釜山 日帰り, 釜山 1泊2日, 釜山 2泊3日, 釜山 3泊4日, 釜山 4泊5日, 釜山 グルメ, 釜山 カフェ, デジクッパ, ミルミョン, シアホットク, 機張カニ, 海雲台, 海雲台ブルーラインパーク スカイカプセル 海辺列車, 広安里, 広安里ドローンショー, 西面, 田浦カフェ通り, 南浦洞, チャガルチ市場, 国際市場, 富平カントン夜市, 甘川文化村, ヒニョウル文化村, 影島, 太宗台, 海東龍宮寺, 松島海上ケーブルカー, 多大浦, ロッテワールド釜山, スカイラインリュージュ, 釜山エックスザスカイ, ビジット釜山パス Visit Busan Pass, 金海空港 アクセス, KTX 釜山駅, 釜山 地下鉄 路線図, 釜山 地下鉄 エレベーター, 西面駅 エレベーター, 釜山駅 エレベーター, 海雲台駅 エレベーター, 子連れ釜山, 釜山 ベビーカー, 釜山 車椅子 観光, 釜山 親孝行旅行, 釜山 スーツケース コインロッカー, 釜山 バリアフリー, Stepless',
  ZH_TW: '釜山旅遊, 釜山自由行, 釜山景點, 釜山必去, 釜山行程推薦, 釜山攻略, 釜山一日遊, 釜山兩天一夜, 釜山三天兩夜, 釜山四天三夜, 釜山五天四夜, 釜山美食, 釜山咖啡廳, 豬肉湯飯, 小麥冷麵, 堅果糖餅, 機張長腳蟹, 海雲台, 海雲台藍線公園 膠囊列車 海岸列車, 廣安里, 廣安里無人機秀, 西面, 田浦咖啡街, 南浦洞, 札嘎其市場, 國際市場, 富平罐頭夜市, 甘川洞文化村, 白淺灘文化村, 影島, 太宗台, 海東龍宮寺, 松島海上纜車, 多大浦, 釜山樂天世界, 斜坡滑車, BUSAN X the SKY, 釜山水族館, Visit Busan Pass 釜山通行證, 金海機場交通, KTX 釜山站, 釜山地鐵圖, 釜山地鐵電梯, 西面站電梯, 釜山站電梯, 海雲台站電梯, 釜山親子遊, 釜山嬰兒車, 釜山孝親遊, 釜山帶長輩, 釜山輪椅無障礙旅遊, 釜山行李寄放, Stepless',
  ZH_CN: '釜山旅游, 釜山自由行, 釜山旅游攻略, 釜山必去景点, 釜山行程推荐, 釜山一日游, 釜山两天一夜, 釜山三天两夜, 釜山四天三晚, 釜山五天四晚, 釜山美食, 釜山咖啡店, 猪肉汤饭, 小麦冷面, 坚果糖饼, 机张雪蟹, 海云台, 海云台蓝线公园 胶囊小火车 海岸列车, 广安里, 广安里无人机表演, 西面, 田浦咖啡街, 南浦洞, 札嘎其市场, 国际市场, 富平罐头夜市, 甘川文化村, 白浅滩文化村, 影岛, 太宗台, 海东龙宫寺, 松岛海上缆车, 多大浦, 釜山乐天世界, 斜坡滑车, 釜山X the SKY, 釜山水族馆, Visit Busan Pass 釜山通行证, 金海机场交通, KTX 釜山站, 釜山地铁线路图, 釜山地铁电梯, 西面站电梯, 釜山站电梯, 海云台站电梯, 釜山亲子游, 釜山婴儿车, 釜山带父母旅游, 釜山无障碍旅游, 釜山行李寄存, Stepless',
  ES: 'Viajar a Busan, Qué ver en Busan, Qué hacer en Busan, Itinerario Busan, Guía de viaje Busan, Turismo en Busan Corea del Sur, Busan en 1 día, Busan en 2 días, Busan en 3 días, Busan en 4 días, Dónde comer en Busan, Gastronomía de Busan, Playa Haeundae, Tren costero Haeundae Blueline Park Sky Capsule, Playa Gwangalli, Show de drones Gwangalli, Seomyeon, Nampo-dong, Mercado de pescado Jagalchi, Mercado Gukje, Aldea Cultural de Gamcheon, Aldea Cultural Huinnyeoul, Yeongdo, Taejongdae, Templo Haedong Yonggungsa, Teleférico de Songdo, Visit Busan Pass, Aeropuerto de Gimhae a Busan, Estación KTX Busan, Mapa del metro de Busan, Metro de Busan ascensores, Busan sin escalones, Busan en silla de ruedas, Busan con niños y carrito de bebé, Turismo accesible en Busan, Stepless',
  FR: 'Voyage à Busan, Visiter Busan, Que faire à Busan, Que voir à Busan, Itinéraire Busan, Guide de voyage Busan Corée du Sud, Busan en 1 jour, Busan en 2 jours, Busan en 3 jours, Busan en 4 jours, Où manger à Busan, Gastronomie Busan, Plage de Haeundae, Train côtier Haeundae Blueline Park Sky Capsule, Plage de Gwangalli, Spectacle de drones Gwangalli, Seomyeon, Nampo-dong, Marché aux poissons de Jagalchi, Marché Gukje, Village culturel de Gamcheon, Village culturel de Huinnyeoul, Yeongdo, Taejongdae, Temple Haedong Yonggungsa, Téléphérique de Songdo, Visit Busan Pass, Aéroport de Gimhae vers Busan, Gare KTX de Busan, Plan du métro de Busan, Métro de Busan ascenseurs, Busan sans marche, Busan en fauteuil roulant, Busan en famille avec poussette, Tourisme accessible à Busan, Stepless',
};

interface LanguageGeoConfig {
  targetCountry: string;
  contentLanguage: string;
  geoPlacename: string;
  authorName: string;
  siteName: string;
  ogImageAlt: string;
  destName: string;
  destDesc: string;
  attractions: string[];
  faqs: { q: string; a: string }[];
}

const LANGUAGE_GEO_CONFIG: Record<Language, LanguageGeoConfig> = {
  KR: {
    targetCountry: 'KR',
    contentLanguage: 'ko-KR',
    geoPlacename: '부산광역시, 대한민국 (Busan, South Korea)',
    authorName: '스탭리스 (Stepless in Busan)',
    siteName: '스탭리스 Stepless in Busan | 부산 여행 코스 & 무장애 지하철 가이드',
    ogImageAlt: '계단 없는 부산여행, 로컬 가이드 스탭리스와 함께 (STEPLESS IN BUSAN)',
    destName: '부산광역시 (Busan Metropolitan City)',
    destDesc: '대한민국 대표 해양 관광 도시 부산 — 해운대, 광안리, 자갈치시장, 감천문화마을, 해동용궁사 등 핵심 명소와 일정별 여행 코스 및 무장애 지하철 엘리베이터 가이드',
    attractions: [
      '해운대 해수욕장 & 블루라인파크 (Haeundae Beach & Blueline Park)',
      '광안리 해수욕장 & 광안대교 (Gwangalli Beach)',
      '감천문화마을 (Gamcheon Culture Village)',
      '자갈치시장 & 남포동 (Jagalchi Market & Nampo-dong)',
      '영도 흰여울문화마을 & 태종대 (Huinnyeoul Culture Village & Taejongdae)',
      '기장 해동용궁사 & 오시리아 (Haedong Yonggungsa Temple)',
    ],
    faqs: [
      {
        q: '부산 여행 코스는 일정별(당일치기·1박2일·2박3일·3박4일)로 어떻게 짜는 것이 가장 좋나요?',
        a: '1박 2일·2박 3일 부산 여행은 첫째 날 동부산(해운대 해수욕장·블루라인파크 스카이캡슐·광안리 드론쇼 야경), 둘째 날 원도심(자갈치시장·국제시장·감천문화마을·영도 흰여울문화마을), 셋째 날 기장(해동용궁사·오시리아 루지·롯데월드) 또는 서면·전포카페거리 순서로 권역을 묶어 이동하는 것이 가장 효율적입니다.',
      },
      {
        q: '김해국제공항(PUS)에서 해운대·서면·남포동·부산역까지 대중교통으로 어떻게 가나요?',
        a: '김해공항역에서 부산김해경전철을 타고 사상역(2호선 환승)으로 이동하면 서면역까지 약 25분, 광안·해운대역까지 약 50~60분이 소요됩니다. 부산역·남포동·자갈치 방면은 사상역(2호선)에서 서면역(1호선)으로 환승하거나 대저역(3호선)을 경유하면 엘리베이터로 계단 없이 이동할 수 있습니다.',
      },
      {
        q: '해운대 블루라인파크(스카이캡슐·해변열차) 예약 방법과 타는 곳은 어디인가요?',
        a: '스카이캡슐은 미포정거장(해운대 해수욕장 끝단)과 청사포정거장 구간을 공중 레일로 왕복하며, 주말·성수기에는 사전 온라인 예매가 필수입니다. 지하철 2호선 해운대역 3번·5번 출구(엘리베이터 이용 후 구남로 평지 도보) 또는 중동역 7번 출구에서 미포정거장으로 접근할 수 있습니다.',
      },
      {
        q: '비짓부산패스(Visit Busan Pass) 혜택과 무료 입장 가능한 대표 명소는 어디인가요?',
        a: '비짓부산패스는 외국인 및 관광객 전용 자유이용권(24시간·48시간권 및 BIG3·BIG5)으로 해운대 해변열차, 부산 엑스더스카이 전망대, 롯데월드 어드벤처 부산, 스카이라인 루지, 송도 해상케이블카, 다이아몬드베이 요트, 부산타워, 신세계 스파랜드 등 30여 개 유료 명소를 무료로 이용할 수 있습니다.',
      },
      {
        q: '광안리 M 드론라이트쇼 공연 시간과 명당 위치는 어디인가요?',
        a: '광안리 M 드론라이트쇼는 매주 토요일 저녁 광안리 해변에서 무료로 2회 진행됩니다(하절기 4~9월 20시·22시, 동절기 10~3월 19시·21시). 지하철 2호선 광안역 3번·5번 출구 엘리베이터를 이용해 해변 중앙 백사장 보행 데크로 내려오면 가장 정면에서 관람할 수 있습니다.',
      },
      {
        q: '부산 여행에서 꼭 먹어야 할 대표 음식(돼지국밥·밀면·씨앗호떡·해산물) 맛집 거리는 어디인가요?',
        a: '부산 대표 향토 음식인 돼지국밥은 서면 시장 국밥골목과 부산역 초량 일대, 밀면은 초량·서면·해운대, 씨앗호떡과 유부주머니는 남포동 BIFF광장·부평깡통야시장, 신선한 활어회와 꼼장어는 자갈치시장과 민락수변공원, 대게는 기장시장에서 맛볼 수 있습니다.',
      },
      {
        q: '부산 지하철역에서 유모차·휠체어·캐리어 이동 시 엘리베이터 출구와 무료 환승 기준은 어떻게 되나요?',
        a: '서면역(7·11·12·13번), 부산역(4·6번), 해운대역(1·3번), 광안역(3·5번), 남포역(1·7번), 자갈치역(3·6·10번) 등 부산 46개 주요 역의 지상 직결 엘리베이터 출구를 스탭리스에서 확인할 수 있으며, 하차 태그 후 30분 이내 지하철-버스 간 최대 2회 무료 환승 및 만 6~12세 어린이 요금 무료 혜택이 적용됩니다.',
      },
      {
        q: '유모차·아이 동반 가족·부모님 효도여행·휠체어로 가기 좋은 부산 무장애(배리어프리) 명소는 어디인가요?',
        a: '해운대 해수욕장 호안도로 우든 데크길, 동백섬 APEC나루공원 평지 산책로, 광안리 해변 테마거리, 다대포 해변공원 무장애 생태탐방로, 국립해양박물관, 부산시립미술관, 신세계 센텀시티가 단차와 계단이 없어 보행 약자와 가족 여행객에게 가장 추천됩니다.',
      },
    ],
  },
  EN: {
    targetCountry: 'US, GB, AU, CA, SG',
    contentLanguage: 'en-US',
    geoPlacename: 'Busan Metropolitan City, South Korea',
    authorName: 'Stepless in Busan',
    siteName: 'Stepless in Busan | Busan Travel Guide, Itinerary & Subway Elevator Map',
    ogImageAlt: 'Stepless in Busan - Busan Travel Courses, Itineraries & Step-Free Subway Guide',
    destName: 'Busan Metropolitan City, South Korea',
    destDesc: 'South Korea premier coastal city — explore Haeundae Beach, Gwangalli, Gamcheon Culture Village, Jagalchi Market, Haedong Yonggungsa Temple, 1 to 5-day itineraries, and step-free subway elevator exits.',
    attractions: [
      'Haeundae Beach & Blueline Park Sky Capsule',
      'Gwangalli Beach & Gwangandaegyo Bridge',
      'Gamcheon Culture Village',
      'Jagalchi Seafood Market & Gukje Market',
      'Huinnyeoul Culture Village & Taejongdae',
      'Haedong Yonggungsa Seaside Temple',
    ],
    faqs: [
      {
        q: 'How should I plan a 2-day, 3-day, or 4-day Busan itinerary?',
        a: 'For an efficient 2 to 3-day Busan trip, spend Day 1 in East Busan (Haeundae Beach, Blueline Park Sky Capsule, and Gwangalli Beach night drone show), Day 2 in Old Town & Yeongdo (Gamcheon Culture Village, Jagalchi Fish Market, Gukje Market, and Huinnyeoul Culture Village), and Day 3 in Gijang (Haedong Yonggungsa Temple, Skyline Luge, Lotte World) or Seomyeon Jeonpo Cafe Street.',
      },
      {
        q: 'How do I get from Gimhae International Airport (PUS) to Haeundae, Seomyeon, or Busan Station?',
        a: 'Take the Busan-Gimhae Light Rail Transit (LRT) from Gimhae Airport Station 3 stops to Sasang Station and transfer via elevator to Subway Line 2. From Sasang, Seomyeon takes 20 minutes and Gwangalli/Haeundae takes 45–55 minutes directly on Line 2. For Busan Station or Nampo-dong, transfer from Line 2 to Line 1 at Seomyeon Station.',
      },
      {
        q: 'How do I book and ride the Haeundae Blueline Park Sky Capsule and Beach Train?',
        a: 'The Haeundae Sky Capsule runs on an elevated ocean track between Mipo Station (east end of Haeundae Beach) and Cheongsapo Station, while the Beach Train continues to Songjeong. Advance online booking is essential. Take Subway Line 2 to Haeundae Station (Exit 1 or 3 elevator) and walk along flat Gunam-ro to Mipo Station.',
      },
      {
        q: 'Is the Visit Busan Pass worth it and which attractions are included for free?',
        a: 'Yes, the Visit Busan Pass (available as 24h/48h unlimited or BIG3/BIG5 passes) grants free entry to over 30 top paid attractions including Busan X the Sky, Haeundae Beach Train, Lotte World Adventure Busan, Skyline Luge, Songdo Marine Cable Car, Shinsegae Spa Land, Busan Tower, and yacht tours.',
      },
      {
        q: 'When is the Gwangalli M Drone Light Show and where is the best place to watch?',
        a: 'The free Gwangalli M Drone Light Show takes place every Saturday evening over Gwangalli Beach with two shows: 8:00 PM & 10:00 PM (April–September) and 7:00 PM & 9:00 PM (October–March). Take Line 2 Gwangan Station Exit 3 or Exit 5 elevator for a flat 7-minute walk to the central beachfront promenade.',
      },
      {
        q: 'What local food is Busan famous for and where should I eat?',
        a: 'Must-eat Busan specialties include Dwaeji-gukbap (pork rice soup at Seomyeon Pork Soup Alley or Busan Station), Milmyeon (cold wheat noodles), Ssiat Hotteok (seed-stuffed sweet pancakes at BIFF Square), live seafood at Jagalchi Market, snow crab at Gijang Market, and specialty coffee at Jeonpo Cafe Street and Yeongdo ocean-view cafes.',
      },
      {
        q: 'How can I find elevator exits in Busan subway stations and how do free transit transfers work?',
        a: 'Stepless in Busan maps exact street-level elevator exit numbers across 46 major Busan Metro stations (including Seomyeon Exits 7/11/12/13, Busan Station Exits 4/6, Haeundae Exits 1/3, and Nampo Exits 1/7). Tapping a T-money or EZL card when exiting grants up to 2 free transfers within 30 minutes between subway lines and city buses.',
      },
      {
        q: 'What are the best stroller-friendly, wheelchair-accessible, and family attractions in Busan?',
        a: 'Top barrier-free attractions in Busan with flat boardwalks, elevators, and accessible restrooms include Haeundae Beach Wooden Deck, Dongbaekseom APEC Naru Park, Gwangalli Beach Promenade, Dadaepo Beach Eco-Trail, National Maritime Museum, Busan Museum of Art, and Shinsegae Centum City.',
      },
    ],
  },
  JA: {
    targetCountry: 'JP',
    contentLanguage: 'ja-JP',
    geoPlacename: '大韓民国 釜山広域市 (Busan, South Korea)',
    authorName: 'Stepless in Busan (ステップレス釜山)',
    siteName: 'Stepless in Busan | 釜山旅行おすすめモデルコース＆地下鉄エレベーター案内',
    ogImageAlt: '階段のない釜山旅行、ローカルガイド Stepless と一緒に (釜山観光・モデルコース・地下鉄エレベーター)',
    destName: '釜山広域市 (Busan, South Korea)',
    destDesc: '韓国を代表する港町・釜山（プサン）の観光ガイド。海雲台、広安里、甘川文化村、チャガルチ市場、海東龍宮寺のおすすめモデルコース（日帰り〜4泊5日）、グルメ、地下鉄46駅のエレベーター出口・バリアフリー情報。',
    attractions: [
      '海雲台ビーチ＆ブルーラインパーク（スカイカプセル）',
      '広安里ビーチ＆広安大橋ドローンショー',
      '甘川文化村（カムチョンムナマウル）',
      'チャガルチ市場・国際市場・富平カントン夜市',
      '影島 ヒニョウル文化村＆太宗台',
      '海東龍宮寺（ヘドンヨングンサ）',
    ],
    faqs: [
      {
        q: '釜山旅行のモデルコース（1泊2日・2泊3日・3泊4日）はどう回るのが効率的ですか？',
        a: '釜山旅行はエリア別に回るのが最も効率的です。1日目は東釜山（海雲台ビーチ・ブルーラインパークのスカイカプセル・広安里の夜景＆ドローンショー）、2日目は旧都心（甘川文化村・チャガルチ市場・国際市場・影島ヒニョウル文化村）、3日目は機張（海東龍宮寺・ロッテワールド・リュージュ）と西面・田浦カフェ通りを巡る2泊3日コースが王道です。',
      },
      {
        q: '金海国際空港（PUS）から西面・海雲台・南浦洞・釜山駅への行き方は？',
        a: '金海空港駅から釜山金海軽電鉄に乗り、3駅目の沙上駅で地下鉄2号線に乗り換えます（エレベーター完備）。沙上駅から西面駅まで約20分、広安駅・海雲台駅まで乗換なしで約45〜55分です。釜山駅や南浦洞・チャガルチへは西面駅で地下鉄1号線に乗り換えます。',
      },
      {
        q: '海雲台ブルーラインパーク（スカイカプセル・海辺列車）の予約方法と乗り場は？',
        a: 'スカイカプセルは尾浦（ミポ）停留場と青沙浦（チョンサポ）停留場の間を走る空中レールで、事前予約が必須です。地下鉄2号線・海雲台駅の1番・3番出口エレベーターから平坦な亀南路（クナムロ）と海辺デッキを通って尾浦乗り場へアクセスできます。',
      },
      {
        q: 'ビジット釜山パス（Visit Busan Pass）の対象施設とメリットは？',
        a: 'ビジット釜山パス（24時間・48時間フリーパスおよびBIG3・BIG5）は、海雲台海辺列車、釜山エックスザスカイ展望台、ロッテワールド釜山、スカイラインリュージュ、松島海上ケーブルカー、新世界スパランド、釜山タワーなど30以上の人気有料スポットに無料で入場できる外国人観光客向けお得パスです。',
      },
      {
        q: '広安里Mドローンライトショーの開催時間とおすすめ観覧場所は？',
        a: '広安里Mドローンライトショーは毎週土曜日の夜に広安里ビーチで無料開催されます（4〜9月は20:00・22:00、10〜3月は19:00・21:00の2回公演）。地下鉄2号線・広安駅の3番・5番出口エレベーターから海辺まで平坦な道を徒歩約7分で正面観覧エリアに到着します。',
      },
      {
        q: '釜山で絶対食べるべき名物グルメ（デジクッパ・ミルミョン・海鮮・ホットク）のおすすめエリアは？',
        a: '釜山名物のデジクッパ（豚クッパ）は西面市場のデジクッパ通りや釜山駅周辺、ミルミョン（小麦冷麺）は草梁・西面・海雲台、シアホットク（種入りホットク）は南浦洞BIFF広場と富平カントン夜市、新鮮な刺身・海鮮はチャガルチ市場、ズワイガニは機張市場が定番です。',
      },
      {
        q: '釜山の地下鉄でスーツケースやベビーカー・車椅子で移動する際のエレベーター出口と無料乗換ルールは？',
        a: 'Steplessでは西面駅（7・11・12・13番出口）、釜山駅（4・6番）、海雲台駅（1・3番）、南浦駅（1・7番）など主要46駅の地上直結エレベーター出口番号を案内しています。またT-money等の交通カードで降車時にタッチすると、地下鉄と市内バス間を30分以内に最大2回まで無料乗換できます。',
      },
      {
        q: '子連れ（ベビーカー）・親孝行旅行・車椅子におすすめの釜山バリアフリー観光地は？',
        a: '海雲台ビーチの海辺ウッドデッキ、冬柏島（APECナル公園）の平坦な散策路、広安里ビーチ遊歩道、多大浦海辺公園のバリアフリー生態探訪路、国立海洋博物館、新世界百貨店センタムシティ店が段差や階段がなく安心して楽しめます。',
      },
    ],
  },
  ZH_TW: {
    targetCountry: 'TW, HK, MO',
    contentLanguage: 'zh-TW, zh-HK, zh-Hant',
    geoPlacename: '大韓民國 釜山廣域市 (Busan, South Korea)',
    authorName: 'Stepless in Busan (釜山自由行無障礙指南)',
    siteName: 'Stepless in Busan | 釜山自由行景點行程推薦＆地鐵電梯指南',
    ogImageAlt: '無階梯釜山自由行，與在地指南 Stepless 同行 (釜山景點行程・地鐵電梯出口)',
    destName: '釜山廣域市 (Busan, South Korea)',
    destDesc: '韓國代表海港城市釜山自由行全攻略：海雲台、膠囊列車、廣安里、甘川洞文化村、白淺灘文化村、札嘎其市場、海東龍宮寺一日遊至五天四夜推薦行程，以及釜山地鐵46站電梯出口與親子嬰兒車、輪椅無障礙路線。',
    attractions: [
      '海雲台海水浴場＆藍線公園膠囊列車',
      '廣安里海水浴場＆廣安大橋無人機秀',
      '甘川洞文化村',
      '札嘎其市場・國際市場・富平罐頭夜市',
      '影島白淺灘文化村＆太宗台',
      '機張海東龍宮寺＆樂天世界',
    ],
    faqs: [
      {
        q: '釜山自由行三天兩夜、四天三夜或五天四夜行程怎麼安排最順路？',
        a: '最順路的釜山自由行建議分區規劃：Day 1 東釜山海景線（海雲台海水浴場、藍線公園膠囊列車、廣安里夜景與無人機秀）；Day 2 舊城區與影島線（甘川洞文化村、札嘎其市場、南浦洞國際市場、白淺灘文化村）；Day 3 機張與市中心（海東龍宮寺、斜坡滑車 Luge、釜山樂天世界、西面田浦咖啡街）。',
      },
      {
        q: '從金海國際機場（PUS）怎麼去西面、海雲台、南浦洞或釜山站最方便？',
        a: '從金海機場站搭乘釜山金海輕軌 3 站至「沙上站」，透過無障礙電梯轉乘地鐵 2 號線：前往西面站約 20 分鐘，前往廣安站與海雲台站免換車約 45～55 分鐘；前往釜山站、南浦洞與札嘎其則在西面站轉乘地鐵 1 號線即可直達。',
      },
      {
        q: '海雲台藍線公園（天空膠囊列車・海岸列車）如何預約與前往搭乘？',
        a: '天空膠囊列車行駛於「尾浦站」至「青沙浦站」高架海景軌道，熱門時段務必提前於 Klook、KKday 或官網預訂。可搭乘地鐵 2 號線至海雲台站（1 號或 3 號出口旁電梯），沿平坦的龜南路與海濱木棧道步行前往尾浦站。',
      },
      {
        q: '釜山通行證（Visit Busan Pass）包含哪些免費景點？值得買嗎？',
        a: '非常划算！Visit Busan Pass（分為 24/48 小時計時型與 BIG3/BIG5 計次型）可免費兌換超過 30 個釜山熱門付費景點，包含海雲台海岸列車、BUSAN X the SKY 展望台、釜山樂天世界、Skyline Luge 斜坡滑車、松島海上纜車、新世界 Spa Land 汗蒸幕與遊艇體驗。',
      },
      {
        q: '廣安里 M 無人機燈光秀演出時間是什麼時候？哪裡看最清楚？',
        a: '廣安里 M 無人機秀每週六晚間於廣安里海水浴場免費演出 2 場（4～9 月為 20:00、22:00；10～3 月為 19:00、21:00）。搭乘地鐵 2 號線至廣安站，由 3 號或 5 號出口電梯出站後直走約 7 分鐘抵達海灘中央步道，視野最正且完全平坦。',
      },
      {
        q: '釜山必吃美食（豬肉湯飯・小麥冷麵・堅果糖餅・海鮮螃蟹）推薦去哪裡吃？',
        a: '釜山代表美食：豬肉湯飯推薦「西面市場豬肉湯飯一條街」與釜山站草梁區；小麥冷麵推薦草梁、西面與海雲台；堅果糖餅必去「南浦洞 BIFF 廣場」與富平罐頭夜市；活海鮮推薦札嘎其市場，吃松葉蟹則推薦機張市場。',
      },
      {
        q: '帶嬰兒車、大件行李或長輩去釜山，哪裡查地鐵電梯出口與公車免費轉乘規則？',
        a: 'Stepless 完整整理西面站（7/11/12/13 號出口）、釜山站（4/6 號）、海雲台站（1/3 號）、南浦站（1/7 號）等 46 個地鐵站地面電梯出口。持 T-money 等交通卡下車刷卡後，30 分鐘內轉乘地鐵與公車享最多 2 次免費轉乘，且 6～12 歲兒童登錄兒童卡享車資免費。',
      },
      {
        q: '釜山親子旅遊（推嬰兒車）、帶父母孝親遊與輪椅族最推薦哪些無障礙景點？',
        a: '最推薦全程平坦無階梯的「海雲台海濱木棧道」、「冬柏島 APEC 世峰樓步道」、「廣安里海濱長廊」、「多大浦海濱公園生態步道」、「國立海洋博物館」與「新世界百貨 Centum City」，且廣安里觀光案內所與各大博物館皆提供免費租借嬰兒車與輪椅。',
      },
    ],
  },
  ZH_CN: {
    targetCountry: 'CN, SG, MY',
    contentLanguage: 'zh-CN, zh-Hans',
    geoPlacename: '大韩民国 釜山广域市 (Busan, South Korea)',
    authorName: 'Stepless in Busan (釜山自由行无障碍指南)',
    siteName: 'Stepless in Busan | 釜山自由行旅游攻略、景点行程＆地铁电梯指南',
    ogImageAlt: '无台阶釜山自由行，与本地指南 Stepless 同行 (釜山旅游攻略・地铁电梯出口)',
    destName: '釜山广域市 (Busan, South Korea)',
    destDesc: '韩国代表海滨旅游城市釜山自由行攻略：海云台、胶囊小火车、广安里、甘川文化村、白浅滩文化村、札嘎其市场、海东龙宫寺一日游至五天四晚推荐行程，以及釜山地铁46站电梯出口与婴儿车、轮椅无障碍路线。',
    attractions: [
      '海云台海水浴场＆蓝线公园胶囊小火车',
      '广安里海水浴场＆广安大桥无人机表演',
      '甘川文化村',
      '札嘎其市场・国际市场・富平罐头夜市',
      '影岛白浅滩文化村＆太宗台',
      '机张海东龙宫寺＆釜山乐天世界',
    ],
    faqs: [
      {
        q: '釜山自由行三天两夜、四天三晚行程怎么安排最合理？',
        a: '釜山自由行按区域串联最省时：Day 1 东釜山海景线（海云台海水浴场、蓝线公园胶囊小火车、广安里夜景与无人机表演）；Day 2 老城区与影岛线（甘川文化村、札嘎其市场、南浦洞国际市场、影岛白浅滩文化村）；Day 3 机张与市中心（海东龙宫寺、斜坡滑车 Luge、釜山乐天世界、西面田浦咖啡街）。',
      },
      {
        q: '从金海国际机场（PUS）怎么去西面、海云台、南浦洞或釜山站？',
        a: '从金海机场站乘坐釜山金海轻轨 3 站至“沙上站”，通过无障碍直梯换乘地铁 2 号线：前往西面站约 20 分钟，前往广安站和海云台站无需换乘约 45～55 分钟；前往釜山站、南浦洞、札嘎其只需在西面站换乘地铁 1 号线即可。',
      },
      {
        q: '海云台蓝线公园（天空胶囊小火车・海岸列车）怎么预约和乘车？',
        a: '天空胶囊小火车运行于“尾浦站”至“青沙浦站”空中海景轨道，旺季需提前在网上预订。可乘坐地铁 2 号线至海云台站（1 号或 3 号出口旁电梯），沿平坦的龟南路与海滨木栈道步行前往尾浦站。',
      },
      {
        q: '釜山通行证（Visit Busan Pass）包含哪些免费景点？划算吗？',
        a: '非常划算！Visit Busan Pass（24/48 小时卡及 BIG3/BIG5 次卡）可免费畅玩 30 多个釜山核心收费景点，包括海云台海岸列车、BUSAN X the SKY 观景台、釜山乐天世界、Skyline Luge 斜坡滑车、松岛海上缆车、新世界 Spa Land 汗蒸幕及游艇出海。',
      },
      {
        q: '广安里 M 无人机灯光秀演出时间是几点？最佳观赏位置在哪里？',
        a: '广安里 M 无人机表演每周六晚在广安里海滩免费举行两场（4～9 月为 20:00、22:00；10～3 月为 19:00、21:00）。乘坐地铁 2 号线至广安站，从 3 号或 5 号出口直梯出站直行约 7 分钟即可到达海滩正中央步道。',
      },
      {
        q: '釜山必吃美食（猪肉汤饭・小麦冷面・坚果糖饼・海鲜雪蟹）推荐去哪里吃？',
        a: '釜山代表美食：猪肉汤饭推荐“西面市场猪肉汤饭一条街”与釜山站草梁区；小麦冷面推荐草梁、西面与海云台；坚果糖饼必去“南浦洞 BIFF 广场”与富平罐头夜市；吃活海鲜去札嘎其市场，吃雪蟹推荐机张市场。',
      },
      {
        q: '带婴儿车、行李箱或父母去釜山旅游，如何查询釜山地铁电梯出口与免费换乘规则？',
        a: 'Stepless 详细整理了西面站（7/11/12/13 号出口）、釜山站（4/6 号）、海云台站（1/3 号）、南浦站（1/7 号）等 46 个地铁站地面直梯出口。使用 T-money 等交通卡下车刷卡后，30 分钟内换乘地铁与公交可享最多 2 次免费换乘。',
      },
      {
        q: '带孩子（婴儿车）、带父母长辈或轮椅出行，釜山有哪些无障碍推荐景点？',
        a: '最推荐全程平坦无台阶的“海云台海滨木栈道”、“冬柏岛 APEC 世峰楼步道”、“广安里海滨长廊”、“多大浦海滨公园生态步道”、“国立海洋博物馆”与“新世界百货 Centum City”，各大场馆均设有无障碍电梯并提供免费婴儿车与轮椅租借。',
      },
    ],
  },
  ES: {
    targetCountry: 'ES, MX, AR, CO, CL, PE',
    contentLanguage: 'es-ES, es-419',
    geoPlacename: 'Busán, Corea del Sur (Busan, South Korea)',
    authorName: 'Stepless in Busan (Guía de Viaje de Busán)',
    siteName: 'Stepless in Busan | Guía de Viaje a Busán, Itinerarios y Ascensores del Metro',
    ogImageAlt: 'Viaje a Busán sin escalones con la guía local Stepless (Qué ver en Busán y Metro accesible)',
    destName: 'Busán, Corea del Sur (Busan Metropolitan City)',
    destDesc: 'Guía completa para viajar a Busán, la capital marítima de Corea del Sur: Playa Haeundae, Gwangalli, Aldea Cultural de Gamcheon, Mercado Jagalchi, Templo Haedong Yonggungsa, itinerarios de 1 a 5 días y salidas con ascensor en 46 estaciones del metro de Busán.',
    attractions: [
      'Playa Haeundae y Tren Costero Blueline Park (Sky Capsule)',
      'Playa Gwangalli y Puente Gwangandaegyo',
      'Aldea Cultural de Gamcheon',
      'Mercado de Pescado Jagalchi y Mercado Gukje',
      'Aldea Cultural Huinnyeoul y Parque Taejongdae',
      'Templo Costero Haedong Yonggungsa',
    ],
    faqs: [
      {
        q: '¿Qué ver en Busán en 2, 3 o 4 días y cómo organizar el itinerario?',
        a: 'Para un viaje de 2 a 3 días en Busán, dedica el Día 1 al Este (Playa Haeundae, Blueline Park Sky Capsule y espectáculo nocturno de drones en Gwangalli), el Día 2 al Casco Antiguo y Yeongdo (Aldea Cultural de Gamcheon, Mercado Jagalchi, Mercado Gukje y Aldea Huinnyeoul) y el Día 3 a Gijang (Templo Haedong Yonggungsa, Skyline Luge) y Seomyeon.',
      },
      {
        q: '¿Cómo ir del Aeropuerto Internacional de Gimhae (PUS) a Haeundae, Seomyeon o la Estación de Busán?',
        a: 'Toma el tren ligero Busan-Gimhae (LRT) desde el aeropuerto durante 3 paradas hasta la estación Sasang y haz transbordo con ascensor a la Línea 2 del metro: llegarás a Seomyeon en 20 minutos y a Gwangalli/Haeundae en 50 minutos sin cambiar de tren. Para la Estación de Busán (KTX) o Nampo, cambia a la Línea 1 en Seomyeon.',
      },
      {
        q: '¿Cómo reservar y subir al Sky Capsule de Haeundae Blueline Park?',
        a: 'Las cápsulas panorámicas Sky Capsule circulan entre las estaciones de Mipo (al final de la Playa Haeundae) y Cheongsapo. Es imprescindible reservar en línea con antelación. Puedes llegar sin escalones tomando el ascensor de la salida 1 o 3 de la estación Haeundae (Línea 2) y caminando por el paseo marítimo llano.',
      },
      {
        q: '¿Merece la pena el Visit Busan Pass y qué atracciones incluye gratis?',
        a: 'Sí, el Visit Busan Pass (de 24h, 48h o BIG3/BIG5) ofrece acceso gratuito a más de 30 atracciones principales, incluyendo el tren costero de Haeundae, mirador Busan X the Sky, Lotte World Busán, Skyline Luge, teleférico marítimo de Songdo, Shinsegae Spa Land y paseos en yate.',
      },
      {
        q: '¿A qué hora es el espectáculo de drones en la Playa Gwangalli?',
        a: 'El espectáculo gratuito Gwangalli M Drone Light Show se celebra todos los sábados por la noche con dos pases: a las 20:00 y 22:00 (de abril a septiembre) y a las 19:00 y 21:00 (de octubre a marzo). Usa el ascensor de la salida 3 o 5 de la estación Gwangan (Línea 2) para llegar al paseo central.',
      },
      {
        q: '¿Qué platos típicos comer en Busán y en qué zonas probarlos?',
        a: 'Los platos imprescindibles de Busán son el Dwaeji-gukbap (sopa de cerdo con arroz en el callejón gastronómico de Seomyeon o Estación de Busán), Milmyeon (fideos fríos de trigo), Ssiat Hotteok (panqueque dulce relleno de semillas en la plaza BIFF de Nampo-dong), marisco fresco en el Mercado Jagalchi y cangrejo de las nieves en Gijang.',
      },
      {
        q: '¿Dónde encontrar ascensores en el metro de Busán y cómo funcionan los transbordos gratuitos?',
        a: 'Stepless muestra los números exactos de salida con ascensor en 46 estaciones del metro de Busán (como Seomyeon salidas 7/11/12/13, Estación de Busán 4/6 y Haeundae 1/3). Al validar tu tarjeta T-money al bajar, tienes hasta 2 transbordos gratuitos en 30 minutos entre metro y autobuses urbanos.',
      },
      {
        q: '¿Cuáles son los mejores lugares accesibles en Busán para ir con niños, carrito de bebé o silla de ruedas?',
        a: 'Los paseos más accesibles y sin escalones son el paseo entarimado de la Playa Haeundae, el parque APEC Naru en la isla Dongbaekseom, el paseo marítimo de Gwangalli, el sendero ecológico de Dadaepo, el Museo Marítimo Nacional y el centro comercial Shinsegae Centum City.',
      },
    ],
  },
  FR: {
    targetCountry: 'FR, BE, CH, CA',
    contentLanguage: 'fr-FR, fr-CA',
    geoPlacename: 'Busan, Corée du Sud (Busan, South Korea)',
    authorName: 'Stepless in Busan (Guide de Voyage de Busan)',
    siteName: 'Stepless in Busan | Guide de Voyage à Busan, Itinéraires et Ascenseurs du Métro',
    ogImageAlt: 'Voyage à Busan sans marches avec le guide local Stepless (Que faire à Busan et Métro accessible)',
    destName: 'Busan, Corée du Sud (Busan Metropolitan City)',
    destDesc: 'Guide complet pour visiter Busan, la capitale maritime de la Corée du Sud : Plage de Haeundae, Gwangalli, Village culturel de Gamcheon, Marché de Jagalchi, Temple Haedong Yonggungsa, itinéraires de 1 à 5 jours et sorties avec ascenseur dans 46 stations du métro de Busan.',
    attractions: [
      'Plage de Haeundae et Train côtier Blueline Park (Sky Capsule)',
      'Plage de Gwangalli et Pont Gwangandaegyo',
      'Village culturel de Gamcheon',
      'Marché aux poissons de Jagalchi et Marché Gukje',
      'Village culturel de Huinnyeoul et Parc Taejongdae',
      'Temple marin Haedong Yonggungsa',
    ],
    faqs: [
      {
        q: 'Que faire à Busan en 2, 3 ou 4 jours et comment organiser son itinéraire ?',
        a: 'Pour visiter Busan en 2 ou 3 jours efficacement, consacrez le Jour 1 à l’Est (Plage de Haeundae, Sky Capsule Blueline Park et spectacle de drones à Gwangalli), le Jour 2 à la Vieille Ville et Yeongdo (Village culturel de Gamcheon, Marché de Jagalchi, Marché Gukje et Village de Huinnyeoul) et le Jour 3 à Gijang (Temple Haedong Yonggungsa, Skyline Luge) et Seomyeon.',
      },
      {
        q: 'Comment aller de l’aéroport international de Gimhae (PUS) à Haeundae, Seomyeon ou la gare de Busan ?',
        a: 'Prenez le métro léger Busan-Gimhae (LRT) depuis l’aéroport sur 3 stations jusqu’à Sasang, puis prenez l’ascenseur vers la Ligne 2 du métro : comptez 20 minutes jusqu’à Seomyeon et 50 minutes en train direct jusqu’à Gwangalli et Haeundae. Pour la gare KTX de Busan ou Nampo-dong, changez pour la Ligne 1 à Seomyeon.',
      },
      {
        q: 'Comment réserver et prendre la Sky Capsule du Haeundae Blueline Park ?',
        a: 'Les capsules aériennes Sky Capsule circulent le long de la mer entre les gares de Mipo (extrémité est de la plage de Haeundae) et Cheongsapo. La réservation en ligne à l’avance est indispensable. Accédez-y sans marche via l’ascenseur des sorties 1 ou 3 de la station Haeundae (Ligne 2) puis par la promenade côtière plate.',
      },
      {
        q: 'Le Visit Busan Pass vaut-il le coup et quelles attractions sont incluses gratuitement ?',
        a: 'Oui, le Visit Busan Pass (24h, 48h ou formules BIG3/BIG5) donne accès gratuitement à plus de 30 attractions majeures dont le train côtier de Haeundae, l’observatoire Busan X the Sky, Lotte World Busan, Skyline Luge, le téléphérique maritime de Songdo, Shinsegae Spa Land et les croisières en yacht.',
      },
      {
        q: 'À quelle heure a lieu le spectacle de drones sur la plage de Gwangalli ?',
        a: 'Le spectacle gratuit Gwangalli M Drone Light Show a lieu tous les samedis soir au-dessus de la plage de Gwangalli avec deux séances : 20h00 et 22h00 (avril à septembre) et 19h00 et 21h00 (octobre à mars). Prenez l’ascenseur des sorties 3 ou 5 de la station Gwangan (Ligne 2) pour rejoindre le front de mer plat.',
      },
      {
        q: 'Quelles sont les spécialités culinaires incontournables de Busan et où les déguster ?',
        a: 'Ne manquez pas le Dwaeji-gukbap (soupe de porc au riz dans la ruelle dédiée de Seomyeon ou près de la gare de Busan), le Milmyeon (nouilles froides de blé), le Ssiat Hotteok (crêpe sucrée aux graines sur la place BIFF à Nampo-dong), les fruits de mer frais au marché de Jagalchi et le crabe des neiges à Gijang.',
      },
      {
        q: 'Comment trouver les sorties avec ascenseur dans le métro de Busan et profiter des correspondances gratuites ?',
        a: 'Stepless répertorie les numéros exacts des sorties avec ascenseur dans 46 stations du métro de Busan (dont Seomyeon sorties 7/11/12/13, Gare de Busan 4/6 et Haeundae 1/3). En badgeant votre carte T-money à la descente, vous bénéficiez de 2 correspondances gratuites dans les 30 minutes entre métro et bus.',
      },
      {
        q: 'Quels sont les meilleurs lieux accessibles à Busan en famille, avec une poussette ou en fauteuil roulant ?',
        a: 'Les sites les plus accessibles sans marches sont la promenade en bois de la plage de Haeundae, le parc APEC Naru sur l’île de Dongbaekseom, le front de mer de Gwangalli, le sentier écologique de Dadaepo, le Musée Maritime National et le complexe Shinsegae Centum City.',
      },
    ],
  },
};

function buildPageSpecificAeoFaqs(
  page: StaticRoutePage,
  lang: Language,
  cleanRoutePath: string
): Array<{ q: string; a: string }> {
  const geoCfg = LANGUAGE_GEO_CONFIG[lang] || LANGUAGE_GEO_CONFIG.KR;
  const dynamicFaqs: Array<{ q: string; a: string }> = [];

  // 1. Station-specific AEO Q&A (/station/:id or /search/:id)
  const stMatch = cleanRoutePath.match(/^\/(?:station|search)\/([^/]+)$/);
  if (stMatch) {
    const st = STATIONS.find(s => s.id === stMatch[1]);
    if (st) {
      const stTitle = getLocalizedStationTitle(st, lang);
      const loc = getStationLocalized(st, lang);
      const lineNames = st.lines.map(l => formatLineLabelI18n(l, lang)).join(' · ');
      const recExits = loc ? loc.recommendedExits : (st.recommendedExitsEn || st.recommendedExits);
      const elevDesc = loc ? loc.elevatorLocationDesc : (st.elevatorLocationDescEn || st.elevatorLocationDesc);
      const transferDesc = loc ? loc.transferRouteDesc : (st.transferRouteDescEn || st.transferRouteDesc);
      const precautions = loc ? loc.precautions : (st.precautionsEn || st.precautions);

      dynamicFaqs.push(
        {
          q: pickLang(lang, {
            KR: `${st.name}에서 유모차·휠체어·캐리어로 지상에 나가는 엘리베이터는 몇 번 출구에 있나요?`,
            EN: `Which exit has the street-level elevator at ${st.englishName} (${lineNames}) for strollers, wheelchairs, and luggage?`,
            JA: `${stTitle}（${lineNames}）でベビーカー・車椅子・スーツケースが使える地上エレベーターは何番出口ですか？`,
            ZH_TW: `${stTitle}（${lineNames}）適合嬰兒車、輪椅與大型行李箱搭乘的地面電梯在哪個出口？`,
            ZH_CN: `${stTitle}（${lineNames}）适合婴儿车、轮椅与大件行李箱乘坐的地面直梯在哪个出口？`,
            ES: `¿Qué salida tiene ascensor a nivel de calle en ${stTitle} (${lineNames}) para cochecitos, sillas de ruedas y maletas?`,
            FR: `Quelle sortie dispose d’un ascenseur vers la rue à ${stTitle} (${lineNames}) pour poussettes, fauteuils roulants et valises ?`,
          }),
          a: pickLang(lang, {
            KR: `${st.name}(${lineNames})의 추천 엘리베이터·무장애 출구는 ${recExits}입니다. ${elevDesc} (역 내 엘리베이터 ${st.elevatorCount}대, 에스컬레이터 ${st.escalatorCount}대 운영)`,
            EN: `At ${st.englishName} (${lineNames}), the recommended step-free elevator/escalator exits are ${recExits}. ${elevDesc} (Equipped with ${st.elevatorCount} elevators and ${st.escalatorCount} escalators.)`,
            JA: `${stTitle}（${lineNames}）の推奨エレベーター・バリアフリー出口は「${recExits}」です。${elevDesc}（構内エレベーター${st.elevatorCount}基・エスカレーター${st.escalatorCount}基完備）`,
            ZH_TW: `${stTitle}（${lineNames}）的推薦電梯與無障礙出口為「${recExits}」。${elevDesc}（站內設有 ${st.elevatorCount} 座電梯與 ${st.escalatorCount} 座電扶梯）`,
            ZH_CN: `${stTitle}（${lineNames}）的推荐直梯与无障碍出口为“${recExits}”。${elevDesc}（站内设有 ${st.elevatorCount} 部电梯与 ${st.escalatorCount} 部自动扶梯）`,
            ES: `En ${stTitle} (${lineNames}), las salidas recomendadas con ascensor son: ${recExits}. ${elevDesc} (Cuenta con ${st.elevatorCount} ascensores y ${st.escalatorCount} escaleras mecánicas).`,
            FR: `À ${stTitle} (${lineNames}), les sorties recommandées avec ascenseur sont : ${recExits}. ${elevDesc} (Équipée de ${st.elevatorCount} ascenseurs et ${st.escalatorCount} escalators).`,
          }),
        },
        {
          q: pickLang(lang, {
            KR: `${st.name} 환승 동선과 보행 약자·가족 여행객 이동 시 주의할 점은 무엇인가요?`,
            EN: `What is the step-free transfer route and traveler tip at ${st.englishName}?`,
            JA: `${stTitle}での階段なし乗換ルートと移動時の注意点は？`,
            ZH_TW: `${stTitle}的無階梯轉乘動線與無障礙通行注意事項是什麼？`,
            ZH_CN: `${stTitle}的无台阶换乘路线与无障碍出行注意事项是什么？`,
            ES: `¿Cuál es la ruta de transbordo sin escalones y qué consejos seguir en ${stTitle}?`,
            FR: `Quel est l’itinéraire de correspondance sans marche et les conseils pratiques à ${stTitle} ?`,
          }),
          a: `${transferDesc} ${precautions}`.trim(),
        }
      );
    }
  }

  // 2. Course-specific AEO Q&A (/tips/courses/:slug)
  const courseSlugMap: Record<string, ItineraryCourse['category']> = {
    '/tips/courses/gourmet': 'GOURMET',
    '/tips/courses/experience': 'EXPERIENCE',
    '/tips/courses/market': 'MARKET',
    '/tips/courses/attraction': 'ATTRACTION',
    '/tips/courses/day': 'DAY',
    '/tips/courses/1night': '1NIGHT',
    '/tips/courses/2nights': '2NIGHTS',
    '/tips/courses/3nights': '3NIGHTS',
    '/tips/courses/4nights': '4NIGHTS',
    '/tips/courses/subway': 'SUBWAY',
  };
  if (courseSlugMap[cleanRoutePath]) {
    const course = BUSAN_ITINERARIES.find(c => c.category === courseSlugMap[cleanRoutePath]);
    if (course) {
      const stopNames = course.steps
        .slice(0, 6)
        .map(s => (lang === 'KR' ? s.titleKo : trEn(s.titleEn, lang)))
        .join(' → ');
      const tipText = lang === 'KR' ? course.overallTipKo : trEn(course.overallTipEn, lang);

      dynamicFaqs.push({
        q: pickLang(lang, {
          KR: `${page.h1}의 핵심 방문 순서와 무장애 이동 팁은 무엇인가요?`,
          EN: `What is the best route and step-free transit tip for ${page.h1}?`,
          JA: `「${page.h1}」のおすすめ巡り順とバリアフリー移動のコツは？`,
          ZH_TW: `「${page.h1}」的推薦順遊路線與無障礙交通秘訣是什麼？`,
          ZH_CN: `“${page.h1}”的推荐顺游路线与无障碍交通秘诀是什么？`,
          ES: `¿Cuál es el recorrido recomendado y el consejo de transporte para ${page.h1}?`,
          FR: `Quel est le parcours recommandé et l’astuce transport pour ${page.h1} ?`,
        }),
        a: `${page.description} ${stopNames ? `(${stopNames})` : ''} ${tipText}`.trim(),
      });
    }
  } else if (!stMatch && cleanRoutePath !== '/') {
    // 3. Hub / Article specific AEO Q&A
    dynamicFaqs.push({
      q: pickLang(lang, {
        KR: `${page.h1} 핵심 요약 및 이용 방법은 무엇인가요?`,
        EN: `What are the key takeaways and practical rules for ${page.h1}?`,
        JA: `「${page.h1}」の要点と利用方法は？`,
        ZH_TW: `「${page.h1}」的重點整理與實用規則是什麼？`,
        ZH_CN: `“${page.h1}”的重点整理与实用规则是什么？`,
        ES: `¿Cuáles son los puntos clave y consejos prácticos sobre ${page.h1}?`,
        FR: `Quels sont les points clés et conseils pratiques concernant ${page.h1} ?`,
      }),
      a: page.description,
    });
  }

  return [...dynamicFaqs, ...geoCfg.faqs];
}

function buildAeoAnswerHubHtml(
  page: StaticRoutePage,
  lang: Language,
  cleanRoutePath: string
): string {
  const faqs = buildPageSpecificAeoFaqs(page, lang, cleanRoutePath);
  const directSummaryLabel = pickLang(lang, {
    KR: '핵심 요약 답변 (Quick Answer)',
    EN: 'Quick Direct Answer Summary',
    JA: '要点まとめ（クイックアンサー）',
    ZH_TW: '重點速覽（快速解答）',
    ZH_CN: '重点速览（快速解答）',
    ES: 'Resumen de Respuesta Rápida',
    FR: 'Résumé et Réponse Rapide',
  });
  const faqHeading = pickLang(lang, {
    KR: '자주 묻는 질문과 핵심 답변 (부산 여행 & 무장애 교통 Q&A)',
    EN: 'Frequently Asked Questions: Busan Travel, Itineraries & Step-Free Subway',
    JA: 'よくある質問（釜山旅行モデルコース・空港アクセス・地下鉄エレベーターQ&A）',
    ZH_TW: '釜山自由行常見問題 Q&A（行程規劃・機場交通・膠囊列車・地鐵電梯）',
    ZH_CN: '釜山自由行常见问题 Q&A（行程规划・机场交通・胶囊小火车・地铁直梯）',
    ES: 'Preguntas Frecuentes sobre Viajar a Busán (Itinerarios, Aeropuerto y Metro Accesible)',
    FR: 'Questions Fréquentes sur un Voyage à Busan (Itinéraires, Aéroport et Métro Accessible)',
  });

  const faqItemsHtml = faqs
    .map(
      item => `
            <article style="background: #FBFBF9; border: 1px solid #E5E2DC; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px;">
              <h3 style="font-size: 15px; font-weight: 800; color: #11161B; margin: 0 0 6px 0;">Q. ${escapeHtml(item.q)}</h3>
              <p style="font-size: 14px; color: #334155; margin: 0; line-height: 1.6;">${escapeHtml(item.a)}</p>
            </article>`
    )
    .join('\n');

  return `
          <aside class="aeo-direct-summary" aria-label="${escapeHtml(directSummaryLabel)}" style="background: #F3F7EC; border: 1px solid #CFE0B4; border-radius: 14px; padding: 16px 18px; margin-bottom: 20px;">
            <div style="font-size: 12px; font-weight: 800; color: #4D6328; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px;">${escapeHtml(directSummaryLabel)}</div>
            <p class="aeo-direct-answer" style="font-size: 14.5px; font-weight: 600; color: #1E293B; margin: 0; line-height: 1.6;">${escapeHtml(page.description)}</p>
          </aside>
          <section id="aeo-qa-section" aria-label="${escapeHtml(faqHeading)}" style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-top: 24px; margin-bottom: 24px;">
            <h2 style="font-size: 19px; font-weight: 800; margin: 0 0 14px 0; color: #11161B;">${escapeHtml(faqHeading)}</h2>
            ${faqItemsHtml}
          </section>`;
}

function buildLocalizedJsonLd(
  page: StaticRoutePage,
  lang: Language,
  cleanRoutePath: string,
  canonicalUrl: string,
  keywords: string
): string {
  const langOpt = LANGUAGE_OPTIONS.find(o => o.code === lang) || LANGUAGE_OPTIONS[0];
  const geoCfg = LANGUAGE_GEO_CONFIG[lang] || LANGUAGE_GEO_CONFIG.KR;
  const d = DICTIONARY[lang] || DICTIONARY.KR;
  const homeUrl = `https://stepless.kr${buildLocalizedPath('/', lang)}`;
  const searchUrl = `https://stepless.kr${buildLocalizedPath('/search', lang)}?q={search_term_string}`;
  const aeoFaqs = buildPageSpecificAeoFaqs(page, lang, cleanRoutePath);

  const breadcrumbItems: Record<string, unknown>[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: d.nav.home,
      item: homeUrl,
    },
  ];
  if (cleanRoutePath !== '/') {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: page.h1,
      item: canonicalUrl,
    });
  }

  const graphNodes: Record<string, unknown>[] = [
    {
      '@type': 'WebSite',
      '@id': `${homeUrl}#website`,
      url: homeUrl,
      name: geoCfg.siteName,
      alternateName: [
        'Stepless in Busan',
        'Stepless in Korea',
        '스탭리스 부산',
        'ステップレス釜山',
        '釜山自由行無障礙指南',
      ],
      description: page.description,
      inLanguage: langOpt.htmlLang,
      potentialAction: {
        '@type': 'SearchAction',
        target: searchUrl,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: page.title,
      headline: page.h1,
      description: page.description,
      keywords,
      inLanguage: langOpt.htmlLang,
      isPartOf: { '@id': `${homeUrl}#website` },
      about: { '@id': 'https://stepless.kr/#busan-destination' },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', '.aeo-direct-answer', '#aeo-qa-section h3', '#aeo-qa-section p'],
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: breadcrumbItems,
    },
    {
      '@type': 'TouristDestination',
      '@id': 'https://stepless.kr/#busan-destination',
      name: geoCfg.destName,
      alternateName: ['Busan', '부산광역시', '釜山広域市', '釜山廣域市', '釜山广域市', 'Busán'],
      description: geoCfg.destDesc,
      inLanguage: langOpt.htmlLang,
      sameAs: [
        'https://ko.wikipedia.org/wiki/%EB%B6%80%EC%82%B0%EA%B4%91%EC%97%AD%EC%8B%9C',
        'https://en.wikipedia.org/wiki/Busan',
        'https://ja.wikipedia.org/wiki/%E9%87%9C%E5%B1%B1%E5%BA%83%E5%9F%9F%E5%B8%82',
        'https://zh.wikipedia.org/wiki/%E9%87%9C%E5%B1%B1%E5%BB%A3%E5%9F%9F%E5%B8%82',
        'https://es.wikipedia.org/wiki/Busan',
        'https://fr.wikipedia.org/wiki/Busan',
        'https://www.wikidata.org/wiki/Q16520',
        'https://www.visitbusan.net/',
      ],
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 35.1796,
        longitude: 129.0756,
      },
      touristType: [
        'Sightseeing & Cultural Tourism',
        'Food & Culinary Tourism',
        'Family & Stroller Friendly Tourism',
        'Accessible & Step-Free Tourism',
      ],
      includesAttraction: geoCfg.attractions.map(name => ({
        '@type': 'TouristAttraction',
        name,
      })),
    },
    {
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      inLanguage: langOpt.htmlLang,
      mainEntity: aeoFaqs.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    },
  ];

  // Add ItemList schema for course pages so Answer Engines extract step-by-step ordered lists
  const courseSlugMap: Record<string, ItineraryCourse['category']> = {
    '/tips/courses/gourmet': 'GOURMET',
    '/tips/courses/experience': 'EXPERIENCE',
    '/tips/courses/market': 'MARKET',
    '/tips/courses/attraction': 'ATTRACTION',
    '/tips/courses/day': 'DAY',
    '/tips/courses/1night': '1NIGHT',
    '/tips/courses/2nights': '2NIGHTS',
    '/tips/courses/3nights': '3NIGHTS',
    '/tips/courses/4nights': '4NIGHTS',
    '/tips/courses/subway': 'SUBWAY',
  };
  if (courseSlugMap[cleanRoutePath]) {
    const course = BUSAN_ITINERARIES.find(c => c.category === courseSlugMap[cleanRoutePath]);
    if (course && course.steps.length > 0) {
      graphNodes.push({
        '@type': 'ItemList',
        '@id': `${canonicalUrl}#course-list`,
        name: page.h1,
        description: page.description,
        numberOfItems: course.steps.length,
        itemListElement: course.steps.map((step, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: lang === 'KR' ? step.titleKo : trEn(step.titleEn, lang),
          description: lang === 'KR' ? step.descKo : trEn(step.descEn, lang),
        })),
      });
    }
  }

  const schemaObj = {
    '@context': 'https://schema.org',
    '@graph': graphNodes,
  };

  return `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n    </script>`;
}

interface StaticRoutePage {
  routePath: string; // e.g. '/tips/courses/gourmet' (no trailing slash except '/')
  title: string;
  description: string;
  h1: string;
  lead: string;
  bodyHtml: string;
}

function escapeHtml(str: string | undefined | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildLanguageSwitcherHtml(cleanRoutePath: string, activeLang: Language): string {
  const links = LANGUAGE_OPTIONS.map(opt => {
    const href = buildLocalizedPath(cleanRoutePath, opt.code);
    const isCurrent = opt.code === activeLang;
    return `<a href="${escapeHtml(href)}" hreflang="${escapeHtml(opt.htmlLang)}" style="display: inline-block; padding: 3px 9px; border-radius: 999px; font-size: 12px; font-weight: ${isCurrent ? '800' : '600'}; background: ${isCurrent ? '#EDF4E3' : '#FFFFFF'}; color: ${isCurrent ? '#4D6328' : '#475569'}; border: 1px solid #E5E2DC; text-decoration: none;">${escapeHtml(opt.flag)} ${escapeHtml(opt.label)}</a>`;
  }).join(' ');
  return `<nav aria-label="Language Selector" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">${links}</nav>`;
}

function buildCommonHeader(h1: string, lead: string, breadcrumbLabel?: string, cleanRoutePath = '/', lang: Language = 'KR'): string {
  const d = DICTIONARY[lang] || DICTIONARY.KR;
  const loc = (p: string) => escapeHtml(buildLocalizedPath(p, lang));
  return `
        <header style="border-bottom: 1px solid #E5E2DC; padding-bottom: 16px; margin-bottom: 24px;">
          ${buildLanguageSwitcherHtml(cleanRoutePath, lang)}
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px;">
            <a href="${loc('/')}" style="font-size: 20px; font-weight: 900; color: #11161B; text-decoration: none;">STEPLESS IN BUSAN · ${escapeHtml(d.brand)}</a>
            <nav aria-label="Main Navigation" style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 14px; font-weight: 700;">
              <a href="${loc('/')}" style="color: #5B7332; text-decoration: none;">${escapeHtml(d.nav.home)}</a>
              <a href="${loc('/search')}" style="color: #334155; text-decoration: none;">${escapeHtml(d.nav.search)}</a>
              <a href="${loc('/tips/transit')}" style="color: #334155; text-decoration: none;">${escapeHtml(d.nav.transit)}</a>
              <a href="${loc('/tips/courses')}" style="color: #334155; text-decoration: none;">${escapeHtml(d.nav.courses)}</a>
              <a href="${loc('/my-route')}" style="color: #334155; text-decoration: none;">My Route</a>
              <a href="${loc('/schedule')}" style="color: #334155; text-decoration: none;">${escapeHtml(d.nav.schedule)}</a>
              <a href="${loc('/tips/exploration')}" style="color: #334155; text-decoration: none;">${escapeHtml(d.nav.exploration)}</a>
              <a href="${loc('/barrier-free')}" style="color: #334155; text-decoration: none;">Barrier-Free</a>
              <a href="${loc('/about')}" style="color: #334155; text-decoration: none;">${escapeHtml(d.nav.about)}</a>
            </nav>
          </div>
          ${
            breadcrumbLabel && cleanRoutePath && cleanRoutePath !== '/'
              ? `<nav aria-label="Breadcrumb" style="margin-top: 12px; font-size: 13px; color: #64748B;">
                  <a href="${loc('/')}" style="color: #5B7332; text-decoration: none;">${escapeHtml(d.nav.home)}</a> &rsaquo; <span>${escapeHtml(breadcrumbLabel)}</span>
                </nav>`
              : ''
          }
          <h1 style="font-size: 28px; font-weight: 900; margin: 16px 0 8px 0; color: #11161B;">${escapeHtml(h1)}</h1>
          <p style="margin: 0; font-size: 15px; color: #475569;">${escapeHtml(lead)}</p>
        </header>`;
}

function buildCommonFooter(lang: Language = 'KR'): string {
  const loc = (p: string) => escapeHtml(buildLocalizedPath(p, lang));
  const brandLabel = lang === 'KR' ? 'Stepless in Busan (스탭리스)' : 'Stepless in Busan';
  const editorLabel = lang === 'KR' ? 'Floreur (플로레르)' : 'Floreur';
  return `
        <footer style="border-top: 1px solid #E5E2DC; padding-top: 16px; margin-top: 32px; font-size: 13px; color: #475569;">
          <p style="margin: 0 0 8px 0;">Published by <strong>${brandLabel}</strong> · Chief Editor: <strong>${editorLabel}</strong> · Contact: <a href="mailto:floreur88@gmail.com">floreur88@gmail.com</a></p>
          <p style="margin: 0 0 8px 0;">Data Sources: Busan Transportation Corporation, Korea Tourism Organization (TourAPI KorWithService2), Field Verification</p>
          <p style="margin: 0; display: flex; flex-wrap: wrap; gap: 12px;">
            <a href="${loc('/about')}">About</a>
            <a href="${loc('/about/privacy')}">Privacy Policy</a>
            <a href="${loc('/about/terms')}">Terms of Service</a>
            <a href="${loc('/about/contact')}">Contact</a>
            <a href="${loc('/about/data-source')}">Data Sources</a>
            <a href="/sitemap.xml">Sitemap (XML)</a>
          </p>
        </footer>`;
}

function buildCourseArticleHtml(course: ItineraryCourse, slug: string): string {
  const stepsHtml = course.steps
    .map((step, idx) => {
      const addr = step.addressRoadKo || step.addressKo || '';
      const addrEn = step.addressRoadEn || step.addressEn || '';
      const station = step.stationInfoKo || '';
      const tip = step.tipKo || step.accessibilityDescKo || '';
      return `
            <article style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 14px; padding: 18px; margin-bottom: 16px;">
              <h3 style="font-size: 18px; font-weight: 800; color: #11161B; margin: 0 0 6px 0;">
                ${idx + 1}. ${escapeHtml(step.titleKo)} (${escapeHtml(step.titleEn)})
              </h3>
              ${
                station || addr
                  ? `<p style="font-size: 13px; color: #5B7332; font-weight: 700; margin: 0 0 8px 0;">
                      ${station ? `대중교통·지하철 연계: ${escapeHtml(station)}` : ''}
                      ${station && addr ? ' · ' : ''}
                      ${addr ? `주소: ${escapeHtml(addr)}${addrEn ? ` (${escapeHtml(addrEn)})` : ''}` : ''}
                    </p>`
                  : ''
              }
              <p style="font-size: 14px; color: #334155; margin: 0 0 8px 0;">${escapeHtml(step.descKo)}</p>
              ${step.descEn ? `<p lang="en" style="font-size: 13px; color: #475569; margin: 0 0 8px 0;">${escapeHtml(step.descEn)}</p>` : ''}
              ${
                tip
                  ? `<p style="font-size: 13px; color: #1E293B; background: #F4F6F0; padding: 10px 12px; border-radius: 8px; margin: 8px 0 0 0;">
                      <strong>배리어프리 &amp; 이동 팁:</strong> ${escapeHtml(tip)}
                    </p>`
                  : ''
              }
            </article>`;
    })
    .join('\n');

  return `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">${escapeHtml(course.titleKo)} (${escapeHtml(course.titleEn)})</h2>
            <p style="font-size: 14px; color: #475569;">${escapeHtml(course.subtitleKo)} — ${escapeHtml(course.overallTipKo)}</p>
            <p lang="en" style="font-size: 13.5px; color: #64748B;">${escapeHtml(course.subtitleEn)} — ${escapeHtml(course.overallTipEn)}</p>
            <p style="font-size: 13px; color: #5B7332; font-weight: 700; margin-bottom: 0;">
              권장 일정: ${escapeHtml(course.durationKo)} (${escapeHtml(course.durationEn)}) · 보행 난이도: ${escapeHtml(course.difficultyKo)} (${escapeHtml(course.difficultyEn)}) · 테마: ${escapeHtml(course.tagKo)}
            </p>
          </section>

          <section aria-label="${escapeHtml(course.titleKo)} 상세 경유지 및 가이드" style="margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; color: #11161B; margin-bottom: 14px;">코스 포함 장소 (${course.steps.length}곳) 상세 안내 및 무장애 이동 정보</h2>
            ${stepsHtml}
          </section>

          <section style="background: #F4F6F0; border: 1px solid #E5E2DC; border-radius: 14px; padding: 18px; margin-bottom: 24px;">
            <h2 style="font-size: 18px; font-weight: 800; margin-top: 0; color: #11161B;">다른 부산 추천 여행 코스 함께 보기</h2>
            <ul style="font-size: 14px; color: #334155; padding-left: 20px; margin-bottom: 0;">
              <li><a href="/tips/courses/gourmet">부산 식도락 맛집 투어 (돼지국밥·밀면·씨앗호떡·오션뷰 카페)</a></li>
              <li><a href="/tips/courses/experience">부산 체험 &amp; 박물관 코스 (국립해양박물관·뮤지엄원·아르떼뮤지엄·F1963)</a></li>
              <li><a href="/tips/courses/market">부산 전통시장 투어 (자갈치시장·국제시장·부평깡통야시장·부전시장)</a></li>
              <li><a href="/tips/courses/attraction">부산 핵심 명소 코스 (해운대·광안리·감천문화마을·흰여울문화마을·해동용궁사)</a></li>
              <li><a href="/tips/courses/day">일정별 추천 코스: 당일치기</a> · <a href="/tips/courses/1night">1박 2일</a> · <a href="/tips/courses/2nights">2박 3일</a> · <a href="/tips/courses/3nights">3박 4일</a> · <a href="/tips/courses/4nights">4박 5일</a></li>
              <li><a href="/tips/courses/subway">부산도시철도 1·2호선 엘리베이터 테마 여행</a></li>
              <li><a href="/barrier-free">부산 무장애(배리어프리) 열린관광지 상세 가이드</a></li>
              <li><a href="/my-route">내 여행 루트 플래너 (경유지 거리 계산 및 네이버·구글맵 대중교통 길찾기)</a></li>
            </ul>
          </section>`;
}

function buildStationArticleHtml(stationId: string): StaticRoutePage | null {
  const st = STATIONS.find(s => s.id === stationId);
  if (!st) return null;

  const lineNames = st.lines.map(l => (l === '동해' ? '동해선' : l === '김해' ? '부산김해경전철' : `${l}호선`)).join('·');
  const title = `${st.name} 엘리베이터 위치·출구 안내 & 무장애 환승 지도 (${st.englishName} Elevator Exits) | 스텝리스 Stepless`;
  const description = `부산 지하철 ${lineNames} ${st.name}(${st.englishName}) 지상 직결 엘리베이터 출구(${st.recommendedExits}), 에스컬레이터 위치, 장애인 화장실(${st.toiletLocation}), 환승 동선(${st.transferRouteDesc}) 및 주변 배리어프리 여행지 가이드.`;

  const exitsRowsHtml = st.exits
    .map(ex => {
      const fac = [
        ex.hasElevator ? '엘리베이터 운행' : '',
        ex.hasEscalator ? '에스컬레이터 운행' : '',
        ex.isAccessible ? '휠체어·유모차 단차 없음' : '계단 구간 유의'
      ]
        .filter(Boolean)
        .join(' / ');
      const timelineText = (ex.pathwayTimeline || [])
        .map(p => `${p.name}: ${p.tip}`)
        .join(' → ');
      return `
            <article style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 12px; padding: 16px; margin-bottom: 12px;">
              <h3 style="font-size: 16px; font-weight: 800; color: #11161B; margin: 0 0 6px 0;">
                ${escapeHtml(st.name)} ${escapeHtml(ex.number)} — ${escapeHtml(fac)}
              </h3>
              <p style="font-size: 14px; color: #334155; margin: 0 0 6px 0;"><strong>방면 및 연계 랜드마크:</strong> ${escapeHtml(ex.directionDesc)}</p>
              <p style="font-size: 13.5px; color: #475569; margin: 0 0 6px 0;"><strong>이동 팁:</strong> ${escapeHtml(ex.tip)}</p>
              ${timelineText ? `<p style="font-size: 13px; color: #5B7332; margin: 0;"><strong>층별 동선:</strong> ${escapeHtml(timelineText)}</p>` : ''}
            </article>`;
    })
    .join('\n');

  const otherStationsHtml = STATIONS.map(
    o => `<a href="/station/${o.id}" style="display: inline-block; margin: 4px 6px 4px 0; padding: 4px 10px; background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 999px; font-size: 13px; color: #334155; text-decoration: none;">${escapeHtml(o.name)} (${escapeHtml(o.englishName)})</a>`
  ).join('\n');

  const bodyHtml = `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">${escapeHtml(st.name)} (${escapeHtml(st.englishName)}) 무장애 엘리베이터 &amp; 환승 핵심 요약</h2>
            <ul style="font-size: 14px; color: #334155; padding-left: 20px; margin-bottom: 12px;">
              <li><strong>운행 노선:</strong> 부산 도시철도 ${escapeHtml(lineNames)} ${st.isTransferStation ? '(주요 환승역)' : ''}</li>
              <li><strong>추천 엘리베이터/에스컬레이터 출구:</strong> ${escapeHtml(st.recommendedExits)} (${escapeHtml(st.recommendedExitsEn)})</li>
              <li><strong>지상 엘리베이터 상세 위치:</strong> ${escapeHtml(st.elevatorLocationDesc)} (${escapeHtml(st.elevatorLocationDescEn)})</li>
              <li><strong>평균 이동 소요 시간:</strong> ${escapeHtml(st.avgMovementTime)} (${escapeHtml(st.avgMovementTimeEn)})</li>
              <li><strong>승강장 ↔ 대합실 무장애 환승 경로:</strong> ${escapeHtml(st.transferRouteDesc)} (${escapeHtml(st.transferRouteDescEn)})</li>
              <li><strong>역내 승강 편의시설 현황:</strong> 엘리베이터 총 ${st.elevatorCount}대 / 에스컬레이터 총 ${st.escalatorCount}대 / 장애인·교통약자 화장실(${escapeHtml(st.toiletLocation)})</li>
              <li><strong>이용 시 주의사항:</strong> ${escapeHtml(st.precautions)} (${escapeHtml(st.precautionsEn)})</li>
            </ul>
            ${st.alertNotice ? `<p style="font-size: 13px; color: #B45309; background: #FFFBEB; border: 1px solid #FDE68A; padding: 10px 12px; border-radius: 8px; margin: 0;"><strong>현장 점검 안내:</strong> ${escapeHtml(st.alertNotice)}</p>` : ''}
          </section>

          <section aria-label="${escapeHtml(st.name)} 출구별 엘리베이터·에스컬레이터 상세 안내" style="margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; color: #11161B; margin-bottom: 14px;">${escapeHtml(st.name)} 주요 출구별 보행 환경 및 층별 이동 타임라인</h2>
            ${exitsRowsHtml}
          </section>

          <section style="background: #F4F6F0; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 18px; font-weight: 800; margin-top: 0; color: #11161B;">부산 주요 22개 지하철역 무장애 출구 전체 바로가기</h2>
            <div>${otherStationsHtml}</div>
          </section>`;

  return {
    routePath: `/station/${st.id}`,
    title,
    description,
    h1: `${st.name} (${st.englishName}) 엘리베이터 출구 위치 & 계단 없는 이동 경로 가이드`,
    lead: `${lineNames} ${st.name}의 지상 직결 엘리베이터(${st.recommendedExits}), 에스컬레이터, 휠체어·유모차·캐리어 환승 동선 및 주변 명소 연결 안내입니다.`,
    bodyHtml
  };
}

function buildAllStaticPages(): StaticRoutePage[] {
  const pages: StaticRoutePage[] = [];

  // 1. All 22 stations (/station/:id AND /search/:id)
  for (const st of STATIONS) {
    const stPage = buildStationArticleHtml(st.id);
    if (stPage) {
      pages.push(stPage);
      pages.push({
        ...stPage,
        routePath: `/search/${st.id}`
      });
    }
  }

  // 2. Course pages (/tips/courses/:slug)
  const courseMap: { slug: string; cat: ItineraryCourse['category']; title: string; desc: string }[] = [
    {
      slug: 'gourmet',
      cat: 'GOURMET',
      title: '부산 식도락 맛집 여행 코스 추천 & 무장애 식당 가이드 | Busan Food Itinerary | 스텝리스 Stepless',
      desc: '부산 대표 돼지국밥, 밀면, 씨앗호떡, 자갈치 해산물 맛집 및 전포·영도·해운대 오션뷰 카페 추천 여행 코스와 유모차·휠체어 출입 정보를 안내합니다.'
    },
    {
      slug: 'experience',
      cat: 'EXPERIENCE',
      title: '부산 체험 & 박물관 여행 코스 추천 | Busan Museums & Cultural Spaces | 스텝리스 Stepless',
      desc: '국립해양박물관, 국립부산과학관, 뮤지엄원, 아르떼뮤지엄 부산, 부산근현대역사관, F1963 등 엘리베이터와 경사로가 완비된 부산 대표 체험·박물관 코스 안내.'
    },
    {
      slug: 'market',
      cat: 'MARKET',
      title: '부산 전통시장 투어 추천 코스 | Busan Traditional Markets Guide | 스텝리스 Stepless',
      desc: '자갈치시장, 국제시장, 부평깡통야시장, 부전시장, 구포시장 등 평지 아케이드와 엘리베이터로 둘러보는 부산 대표 전통시장 투어 코스 안내.'
    },
    {
      slug: 'attraction',
      cat: 'ATTRACTION',
      title: '부산 대표 핵심 명소 여행 코스 | Top Busan Attractions & Landmarks | 스텝리스 Stepless',
      desc: '해운대 해수욕장, 광안리 해변 드론쇼, 감천문화마을, 영도 흰여울문화마을, 기장 해동용궁사, 다대포 해변공원 등 부산 필수 명소 코스 안내.'
    },
    {
      slug: 'day',
      cat: 'DAY',
      title: '부산 당일치기 여행 추천 코스 | 1-Day Busan Trip Itinerary | 스텝리스 Stepless',
      desc: 'KTX 부산역 도착부터 남포·자갈치, 광안리, 해운대까지 하루 만에 부산의 핵심 바다와 미식을 계단 걱정 없이 둘러보는 당일치기 추천 여행 코스.'
    },
    {
      slug: '1night',
      cat: '1NIGHT',
      title: '부산 1박 2일 여행 추천 코스 | 2-Day 1-Night Busan Trip Plan | 스텝리스 Stepless',
      desc: '부산의 낮과 밤, 해운대·광안리 야경과 원도심 전통시장 미식을 모두 만끽하는 1박 2일 무장애 추천 여행 코스를 안내합니다.'
    },
    {
      slug: '2nights',
      cat: '2NIGHTS',
      title: '부산 2박 3일 여행 추천 코스 | 3-Day 2-Night Busan Itinerary | 스텝리스 Stepless',
      desc: '해운대·기장 동부산부터 서면·전포, 원도심 남포·영도까지 여유롭게 즐기는 2박 3일 부산 완전정복 여행 코스를 안내합니다.'
    },
    {
      slug: '3nights',
      cat: '3NIGHTS',
      title: '부산 3박 4일 여유로운 힐링 여행 추천 코스 | 4-Day Busan Itinerary | 스텝리스 Stepless',
      desc: '해변 우든 데크 산책로, 미술관, 온천, 전통시장을 느긋하게 둘러보는 가족·시니어·유모차 친화 3박 4일 부산 슬로우 트래블 코스.'
    },
    {
      slug: '4nights',
      cat: '4NIGHTS',
      title: '부산 4박 5일 전 지역 일주 여행 추천 코스 | 5-Day Busan Trip Plan | 스텝리스 Stepless',
      desc: '원도심, 서부산 다대포·을숙도, 도심 서면·동래, 동부산 해운대·송정·기장까지 부산 전역을 완벽하게 여행하는 4박 5일 일주 코스입니다.'
    },
    {
      slug: 'subway',
      cat: 'SUBWAY',
      title: '부산도시철도 지하철 1·2호선 무장애 테마 여행 코스 | Busan Subway Tour | 스텝리스 Stepless',
      desc: '부산 지하철 1호선·2호선 주요 역세권 명소를 지상 직결 엘리베이터 출구로 계단 없이 편리하게 이동하는 지하철 테마 여행 코스를 안내합니다.'
    }
  ];

  for (const item of courseMap) {
    const course = BUSAN_ITINERARIES.find(c => c.category === item.cat);
    if (course) {
      pages.push({
        routePath: `/tips/courses/${item.slug}`,
        title: item.title,
        description: item.desc,
        h1: `${course.titleKo} (${course.titleEn})`,
        lead: item.desc,
        bodyHtml: buildCourseArticleHtml(course, item.slug)
      });
    }
  }

  // 3. Barrier-Free open tourist spots (/barrier-free AND /tips/courses/barrier-free)
  const bfSpotsHtml = BUSAN_TOUR_API_SPOTS.map((spot, i) => {
    return `
            <article style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 14px; padding: 18px; margin-bottom: 16px;">
              <h3 style="font-size: 18px; font-weight: 800; color: #11161B; margin: 0 0 6px 0;">
                ${i + 1}. ${escapeHtml(spot.titleKo)} (${escapeHtml(spot.titleEn)}) — ${escapeHtml(spot.districtKo)}
              </h3>
              <p style="font-size: 13px; color: #5B7332; font-weight: 700; margin: 0 0 8px 0;">
                주소: ${escapeHtml(spot.addr1Ko)} · 연계 지하철역: <a href="/station/${escapeHtml(spot.nearestStationId)}">${escapeHtml(spot.nearestStationNameKo)}</a> (${escapeHtml(spot.recommendedElevatorExit)})
              </p>
              <p style="font-size: 14px; color: #334155; margin: 0 0 8px 0;">${escapeHtml(spot.overviewKo)}</p>
              <p lang="en" style="font-size: 13px; color: #475569; margin: 0 0 10px 0;">${escapeHtml(spot.overviewEn)}</p>
              <ul style="font-size: 13px; color: #1E293B; background: #F4F6F0; padding: 12px 16px 12px 32px; border-radius: 8px; margin: 0;">
                <li><strong>주출입구 및 보행로:</strong> ${escapeHtml(spot.barrierFree.route.descKo)}</li>
                <li><strong>엘리베이터·승강설비:</strong> ${escapeHtml(spot.barrierFree.elevator.descKo)}</li>
                <li><strong>장애인 화장실:</strong> ${escapeHtml(spot.barrierFree.toilet.descKo)}</li>
                <li><strong>휠체어·유모차 대여:</strong> ${escapeHtml(spot.barrierFree.wheelchair.descKo)} / ${escapeHtml(spot.barrierFree.stroller.descKo)}</li>
                <li><strong>장애인 전용 주차구역:</strong> ${escapeHtml(spot.barrierFree.parking.descKo)}</li>
                <li><strong>대중교통 이동 팁:</strong> ${escapeHtml(spot.transitTipKo)}</li>
              </ul>
            </article>`;
  }).join('\n');

  const bfPage: StaticRoutePage = {
    routePath: '/barrier-free',
    title: '부산 무장애(배리어프리) 열린관광지 종합 가이드 | Wheelchair & Stroller Accessible Busan | 스텝리스 Stepless',
    description: '한국관광공사 무장애 열린관광지(TourAPI) 데이터 및 현장 실사 기반 부산 대표 배리어프리 명소들의 경사로, 엘리베이터, 장애인 화장실, 휠체어·유모차 대여 정보를 상세 안내합니다.',
    h1: '부산 무장애(배리어프리) 열린관광지 & 계단 없는 여행 스팟 종합 가이드',
    lead: '휠체어 이용자, 유모차 동반 가족, 시니어 여행객이 단차와 계단 걱정 없이 방문할 수 있는 부산 주요 열린관광지의 출입구 경사로, 무장애 화장실, 수동·전동 휠체어 대여소 및 지하철 엘리베이터 연계 정보를 정리했습니다.',
    bodyHtml: `
          <section aria-label="부산 무장애 열린관광지 상세 목록" style="margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; color: #11161B; margin-bottom: 14px;">한국관광공사 TourAPI 검증 부산 배리어프리 관광 명소 (${BUSAN_TOUR_API_SPOTS.length}곳)</h2>
            ${bfSpotsHtml}
          </section>`
  };
  pages.push(bfPage);
  pages.push({
    ...bfPage,
    routePath: '/tips/courses/barrier-free',
    title: '부산 무장애(배리어프리) 추천 여행 코스 | Accessible Busan Tour Itinerary | 스텝리스 Stepless',
    description: '휠체어, 유모차, 시니어 여행객을 위한 부산 무장애 추천 여행 코스와 한국관광공사 열린관광지 22곳의 평지 데크길·지하철 엘리베이터 연계 일정을 안내합니다.',
    h1: '부산 무장애(배리어프리) 추천 여행 코스 & 열린관광지 일정 가이드',
  });

  // 4. Hub pages (/search, /tips, /tips/courses, /my-route, /schedule)
  pages.push({
    routePath: '/search',
    title: '부산 주요 22개 지하철역 엘리베이터·출구 검색 | Busan Subway Elevator Directory | 스텝리스 Stepless',
    description: '서면역, 부산역, 해운대역, 광안역, 센텀시티역, 남포역, 자갈치역 등 부산 22개 핵심 지하철역의 엘리베이터·에스컬레이터 출구 번호와 무장애 환승 경로를 한눈에 비교하고 검색하세요.',
    h1: '부산 주요 22개 지하철역 엘리베이터 & 무장애 출구 디렉토리',
    lead: '부산 도시철도 1~4호선, 동해선, 부산김해경전철 주요 22개 역사의 지상 직결 엘리베이터 출구 번호, 에스컬레이터 유무, 장애인 화장실 위치 및 층별 환승 동선을 제공합니다.',
    bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">부산 22개 거점 지하철역 무장애 시설 요약표</h2>
            <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; border-color: #E5E2DC; font-size: 14px; background: #FFFFFF;">
              <thead>
                <tr style="background: #F4F6F0; text-align: left;">
                  <th>역명 (Station)</th>
                  <th>노선</th>
                  <th>추천 엘리베이터/에스컬레이터 출구</th>
                  <th>엘리베이터 위치 및 환승 동선 요약</th>
                </tr>
              </thead>
              <tbody>
                ${STATIONS.map(
                  s => `<tr>
                    <td><a href="/station/${s.id}"><strong>${escapeHtml(s.name)} (${escapeHtml(s.englishName)})</strong></a></td>
                    <td>${escapeHtml(s.lines.join('·'))}</td>
                    <td>${escapeHtml(s.recommendedExits)}</td>
                    <td>${escapeHtml(s.elevatorLocationDesc)}</td>
                  </tr>`
                ).join('\n')}
              </tbody>
            </table>
          </section>`
  });

  pages.push({
    routePath: '/tips/courses',
    title: '부산 테마별 & 일정별 추천 여행 코스 총정리 | Busan Trip Plan & Itineraries | 스텝리스 Stepless',
    description: '식도락(맛집), 체험·박물관, 전통시장, 핵심 명소 및 당일치기·1박2일·2박3일·3박4일·4박5일 부산 추천 여행 코스와 무장애 지하철 연계 가이드를 확인하세요.',
    h1: '부산 8대 테마별 & 일정별(당일치기~4박5일) 추천 여행 코스 허브',
    lead: '부산 현지 에디터가 직접 검증한 식도락, 박물관·체험, 전통시장, 핵심 명소 코스와 당일치기부터 4박 5일까지의 일정별 동선, 그리고 1·2호선 지하철 엘리베이터 연계 코스를 한곳에서 탐색할 수 있습니다.',
    bodyHtml: `
          <section style="margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; color: #11161B;">부산 전체 추천 여행 코스 목록 (${BUSAN_ITINERARIES.length}개 대표 코스)</h2>
            ${BUSAN_ITINERARIES.map(
              c => `<article style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 14px; padding: 18px; margin-bottom: 14px;">
                <h3 style="font-size: 18px; font-weight: 800; margin: 0 0 6px 0;"><a href="/tips/courses/${c.category.toLowerCase().replace('_', '-')}">${escapeHtml(c.titleKo)} (${escapeHtml(c.titleEn)})</a></h3>
                <p style="font-size: 14px; color: #334155; margin: 0 0 8px 0;">${escapeHtml(c.subtitleKo)} — ${escapeHtml(c.overallTipKo)}</p>
                <p style="font-size: 13px; color: #5B7332; margin: 0;">포함 경유지(${c.steps.length}곳): ${escapeHtml(c.steps.slice(0, 8).map(s => s.titleKo).join(', '))}${c.steps.length > 8 ? ' 외' : ''}</p>
              </article>`
            ).join('\n')}
          </section>`
  });

  pages.push({
    routePath: '/tips',
    title: '부산 여행 가이드, 추천 코스 & 대중교통 이용 팁 허브 | Busan Travel Guide | 스텝리스 Stepless',
    description: '부산 여행 코스 추천, 지하철·시내버스 무료 환승 팁, 어린이 요금 무료 혜택, 무료 짐 보관소, 유모차·휠체어 대여소 등 부산 여행 필수 정보를 총정리했습니다.',
    h1: '부산 여행 종합 가이드: 추천 코스 · 대중교통 팁 · 부산 탐구생활 매거진',
    lead: '처음 부산을 방문하는 여행객부터 유모차·휠체어·캐리어를 동반한 가족 여행객까지 반드시 알아두어야 할 부산 대중교통 환승 규정, 테마별 추천 코스, 현지인 실전 꿀팁을 안내합니다.',
    bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">카테고리별 부산 여행 핵심 가이드 바로가기</h2>
            <ul style="font-size: 14px; color: #334155; padding-left: 20px;">
              <li><a href="/tips/courses"><strong>부산 추천 여행 코스 (테마별 &amp; 당일치기~4박5일 일정별)</strong></a>: 식도락, 박물관, 전통시장, 핵심 명소 및 일정별 맞춤 코스</li>
              <li><a href="/tips/transit"><strong>부산 대중교통 이용 팁 (환승·캐리어·물품보관함)</strong></a>: 지하철-버스 30분 무료 환승 및 대형 캐리어 버스 탑승 규정</li>
              <li><a href="/tips/child-free"><strong>어린이 대중교통 요금 무료 가이드</strong></a>: 만 6세~12세 어린이 교통카드 등록 및 무료 탑승 혜택</li>
              <li><a href="/tips/bus-qr"><strong>부산 시내버스 모바일 QR 결제 가이드</strong></a>: 실물 교통카드 없이 스마트폰 QR로 버스 요금 결제하는 법</li>
              <li><a href="/tips/taxi"><strong>부산 콜택시 &amp; 교통약자 바우처 택시(두리발·마카모디) 안내</strong></a>: 휠체어 특장차 두리발, 동백택시, 바우처 택시 호출 방법</li>
              <li><a href="/tips/exploration"><strong>부산 탐구생활 로컬 매거진</strong></a>: 무료 짐 보관소 4곳, 유모차·휠체어 무료 대여소, 지하철 10분 내 무료 재진입 팁</li>
              <li><a href="/schedule"><strong>부산 주요 축제·행사 월별 캘린더</strong></a>: 광안리 M 드론라이트쇼, 부산불꽃축제, 바다축제 일정 및 무장애 관람 명당</li>
              <li><a href="/barrier-free"><strong>부산 무장애(배리어프리) 열린관광지</strong></a>: 한국관광공사 공공데이터 기반 경사로·엘리베이터·장애인화장실 완비 명소</li>
            </ul>
          </section>`
  });

  pages.push({
    routePath: '/my-route',
    title: '내 여행 루트 만들기 (맞춤 부산 여행 코스 플래너) | Custom Busan Trip Route Planner | 스텝리스 Stepless',
    description: '부산 명소·맛집·전통시장을 내 여행 루트에 담아 경유지 순서를 조정하고, 직선거리 계산 및 네이버 지도·구글맵 실시간 대중교통 길찾기를 원클릭으로 실행하세요.',
    h1: '내 여행 루트 플래너 (Custom Busan Trip Route Builder & Transit Navigator)',
    lead: '스텝리스의 각 여행 코스에서 원하는 명소·식당·카페·시장을 담아 나만의 부산 여행 일정을 구성하고, 경유지 간 거리 확인과 네이버 지도(한국어) 및 구글맵(다국어) 실시간 대중교통 길찾기를 바로 연결할 수 있는 인터랙티브 플래너입니다.',
    bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">스텝리스 맞춤 부산 여행 루트 플래너 주요 기능 및 활용법</h2>
            <ol style="font-size: 14px; color: #334155; padding-left: 20px;">
              <li><strong>경유지 담기 및 순서 최적화:</strong> <a href="/tips/courses/gourmet">식도락</a>, <a href="/tips/courses/attraction">핵심 명소</a>, <a href="/tips/courses/market">전통시장</a>, <a href="/tips/courses/experience">체험·박물관</a> 카드에서 [루트 추가] 버튼을 누르면 내 루트 지도에 자동 저장됩니다.</li>
              <li><strong>구간별 거리 자동 계산:</strong> 담은 장소들의 위도·경도 정밀 좌표를 기반으로 이전 장소에서 다음 장소까지의 이동 거리를 자동으로 계산해 동선 낭비를 줄여줍니다.</li>
              <li><strong>네이버 지도 &amp; 구글맵 원클릭 대중교통 길찾기:</strong> 내국인 여행객에게는 실시간 시내버스·도시철도 도착 정보가 정확한 네이버 지도 대중교통 길찾기를, 외국인 여행객에게는 영문 Google Maps Transit 길찾기를 즉시 연결합니다.</li>
              <li><strong>배리어프리 지하철역 연계:</strong> 각 경유지에서 가장 가까운 <a href="/search">부산 지하철역 엘리베이터 출구</a> 정보를 함께 확인하여 캐리어·유모차·휠체어 이동 시 계단 없는 최적 경로를 계획할 수 있습니다.</li>
            </ol>
          </section>`
  });

  pages.push({
    routePath: '/schedule',
    title: '부산 주요 축제·행사 월별 캘린더 & 무장애 관람 가이드 | Busan Festivals & Events Schedule | 스텝리스 Stepless',
    description: '광안리 M 드론라이트쇼 상설 공연 시간, 부산항축제, 부산바다축제, 부산국제록페스티벌, 부산국제영화제(BIFF), 부산불꽃축제 등 월별 주요 행사 일정과 지하철 엘리베이터 이동 팁을 제공합니다.',
    h1: '부산 주요 축제·행사 월별 캘린더 & 배리어프리 관람 동선 가이드',
    lead: '매주 토요일 밤 광안리 밤바다를 수놓는 광안리 M 드론라이트쇼부터 봄·여름·가을·겨울 부산을 대표하는 메가 이벤트 일정과 인파 속에서도 유모차·휠체어로 안전하게 접근할 수 있는 지하철 엘리베이터 출구 및 평지 관람 포인트를 안내합니다.',
    bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">상설 및 계절별 부산 대표 축제·문화행사 핵심 가이드</h2>
            <article style="margin-bottom: 16px;">
              <h3 style="font-size: 16px; font-weight: 800; color: #11161B; margin-bottom: 4px;">1. 광안리 M 드론라이트쇼 (연중 매주 토요일 상설 공연)</h3>
              <p style="font-size: 14px; color: #334155; margin: 0;">광안리 해수욕장 일원에서 매주 토요일 저녁 2회(하절기 20:00 / 22:00, 동절기 19:00 / 21:00) 진행되는 국내 최대 규모의 상설 드론쇼입니다. 2호선 <a href="/station/gwangan">광안역</a> 3번·5번 출구 엘리베이터 또는 <a href="/station/geumnyeonsan">금련산역</a> 엘리베이터를 이용해 평지로 해변 보행로까지 이동할 수 있습니다.</p>
            </article>
            <article style="margin-bottom: 16px;">
              <h3 style="font-size: 16px; font-weight: 800; color: #11161B; margin-bottom: 4px;">2. 봄·여름 대표 축제 (낙동강 유채꽃축제 · 부산항축제 · 해운대 모래축제 · 부산바다축제)</h3>
              <p style="font-size: 14px; color: #334155; margin: 0;">5월 해운대 모래축제(<a href="/station/haeundae">해운대역</a> 1·3번 출구 엘리베이터, 구남로 평지 광장 직결)와 부산항축제, 7~8월 부산바다축제 및 다대포 해변공원 낙조분수 공연(<a href="/station/dadaepo">다대포해수욕장역</a> 2·3·4번 출구 무장애 탐방로) 등 해변 데크길을 따라 단차 없이 관람 가능한 여름 축제가 펼쳐집니다.</p>
            </article>
            <article style="margin-bottom: 0;">
              <h3 style="font-size: 16px; font-weight: 800; color: #11161B; margin-bottom: 4px;">3. 가을·겨울 대표 축제 (부산국제영화제 BIFF · 부산국제록페스티벌 · 부산불꽃축제 · 해운대 빛축제)</h3>
              <p style="font-size: 14px; color: #334155; margin: 0;">10월 영화의전당(<a href="/station/centum-city">센텀시티역</a> 엘리베이터)과 남포동 BIFF광장(<a href="/station/jagalchi">자갈치역</a> 엘리베이터)에서 열리는 부산국제영화제, 사상 삼락생태공원(<a href="/station/sasang">사상역</a>)에서 열리는 부산국제록페스티벌, 11월 광안리 부산불꽃축제, 12~1월 해운대 빛축제까지 계절별 축제 일정을 월별 캘린더로 확인하세요.</p>
            </article>
          </section>`
  });

  // 5. Public transit tips (/tips/transit, /tips/child-free, /tips/bus-qr, /tips/taxi)
  pages.push({
    routePath: '/tips/transit',
    title: '부산 대중교통 이용 팁 5대 핵심 가이드 (무료 환승·캐리어 규정·물품보관함) | 스텝리스 Stepless',
    description: '부산 도시철도·시내버스·마을버스 30분 이내 무료 환승 기준, 28인치 대형 캐리어 시내버스 반입 규정, 지하철 물품보관함(T-Luggage) 및 1일 무제한 승차권 활용법을 상세 안내합니다.',
    h1: '부산 대중교통 이용 팁 5대 핵심 가이드 (지하철·버스 환승 & 캐리어 규정)',
    lead: '부산 여행 중 지하철과 시내버스를 가장 알뜰하고 쾌적하게 이용하기 위한 무료 환승 시간 규정, 대형 수하물(캐리어) 버스 반입 제한 기준, 저상버스 확인법 및 주요 역사 물품보관함 정보를 정리했습니다.',
    bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">부산 여행자가 꼭 알아야 할 대중교통 이용 수칙</h2>
            <article style="margin-bottom: 16px;">
              <h3 style="font-size: 16px; font-weight: 800; color: #11161B;">1. 도시철도 ↔ 시내버스·마을버스 30분 이내 최대 2회 무료 환승</h3>
              <p style="font-size: 14px; color: #334155;">선불·후불 교통카드 사용 시 하차 단말기에 반드시 태그한 시점부터 30분 이내(일부 외곽 노선 60분)에 다른 교통수단(지하철↔시내버스↔마을버스, 동해선·김해경전철 포함)으로 갈아타면 최대 2회(총 3개 수단 탑승)까지 환승 할인이 적용됩니다. 단, 동일 노선 버스 재탑승이나 지하철 개찰구 퇴장 후 동일 역 재진입은 환승 혜택에서 제외됩니다.</p>
            </article>
            <article style="margin-bottom: 16px;">
              <h3 style="font-size: 16px; font-weight: 800; color: #11161B;">2. 대형 캐리어(수하물) 시내버스 반입 제한 및 대안</h3>
              <p style="font-size: 14px; color: #334155;">부산 시내버스 운송약관에 따라 통로를 막거나 승객 안전을 위협하는 대형 캐리어(통상 24~28인치 이상)는 시내버스 탑승이 거부될 수 있습니다. 큰 캐리어를 소지한 경우 <a href="/station/busan">부산역</a>, <a href="/station/seomyeon">서면역</a>, <a href="/station/haeundae">해운대역</a>, <a href="/station/gwangan">광안역</a> 등 도시철도 엘리베이터를 이용해 이동하거나, 역사 내 물품보관함(T-Luggage) 및 <a href="/tips/exploration/luggage">부산 무료 짐 보관소</a>에 짐을 맡긴 뒤 이동하는 것이 안전합니다.</p>
            </article>
            <article style="margin-bottom: 0;">
              <h3 style="font-size: 16px; font-weight: 800; color: #11161B;">3. 저상버스(Low-Floor Bus) 실시간 확인 및 휠체어·유모차 탑승</h3>
              <p style="font-size: 14px; color: #334155;">부산 시내 주요 간선 노선에는 계단 없는 저상버스가 확대 운행 중입니다. 네이버 지도 또는 카카오맵 버스 도착 정보에서 '저상' 표시를 사전에 확인할 수 있으며, 휠체어 이용자는 버스 중간문 전용 리프트(경사판)와 내부 고정 벨트를 이용해 안전하게 탑승할 수 있습니다.</p>
            </article>
          </section>`
  });

  pages.push({
    routePath: '/tips/child-free',
    title: '부산 어린이 대중교통 요금 전면 무료 가이드 & 유모차 이동 팁 | 스텝리스 Stepless',
    description: '만 6세~12세 어린이 부산 시내버스·마을버스·도시철도 요금 무료 혜택 적용 방법, 어린이 교통카드 등록 절차 및 영유아 유모차 동반 가족 여행 팁을 안내합니다.',
    h1: '부산 영유아·어린이 대중교통 요금 무료화 가이드 & 유모차 탑승 팁',
    lead: '부산광역시는 전국 최초로 어린이 대중교통 요금 무료화를 시행하고 있습니다. 만 6세 이상~만 12세 이하 어린이 교통카드 이용 방법과 영유아 유모차 동반 시 지하철 넓은 개찰구(장애인 게이트) 이용법을 확인하세요.',
    bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">어린이 무료 요금 적용 기준 및 교통카드 사용법</h2>
            <p style="font-size: 14px; color: #334155;">만 6세 미만 영유아는 보호자 동반 시 별도 카드 없이 무료로 탑승하며, 만 6세~만 12세(초등학생 연령) 어린이는 편의점 등에서 생년월일이 등록된 <strong>어린이 선불 교통카드(티머니·이즐 등)</strong>를 사용해 승하차 단말기에 태그하면 부산 시내버스, 마을버스, 도시철도(1~4호선) 요금이 0원(무료)으로 처리됩니다. 현금 승차 시에는 무료 혜택이 적용되지 않으므로 반드시 어린이 등록 교통카드를 지참하세요.</p>
            <h3 style="font-size: 16px; font-weight: 800; color: #11161B;">유모차 동반 가족을 위한 지하철 개찰구 통과 팁</h3>
            <p style="font-size: 14px; color: #334155; margin-bottom: 0;">모든 부산 지하철역 대합실에는 일반 삼각 게이트 옆에 폭이 넓은 <strong>교통약자·유모차 전용 플랩 게이트(슬라이딩 도어)</strong>가 설치되어 있습니다. 엘리베이터에서 내려 넓은 게이트에 카드를 태그하면 유모차를 접지 않고 그대로 승강장까지 안전하게 진입할 수 있습니다.</p>
          </section>`
  });

  pages.push({
    routePath: '/tips/bus-qr',
    title: '부산 시내버스 모바일 QR 결제 가이드 (교통카드 없이 버스 타기) | 스텝리스 Stepless',
    description: '실물 교통카드나 현금이 없을 때 스마트폰으로 부산 시내버스 요금을 결제하는 모바일 QR코드 탑승 방법과 외국인·여행객 이용 절차를 상세 안내합니다.',
    h1: '부산 시내버스 모바일 QR 간편 결제 이용 가이드',
    lead: '부산 시내버스는 현금 없는 버스로 운영되고 있습니다. 실물 교통카드를 깜빡했거나 외국인 친구와 함께 여행할 때 버스 내 QR 코드와 모바일 교통카드로 간편하게 탑승하는 방법을 안내합니다.',
    bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">교통카드 없이 부산 시내버스 탑승하는 2가지 방법</h2>
            <ol style="font-size: 14px; color: #334155; padding-left: 20px; margin-bottom: 0;">
              <li><strong>모바일 티머니 / 이즐(EZL) / 삼성페이 NFC 태그:</strong> 스마트폰에 모바일 교통카드 기능이 활성화되어 있다면 실물 카드와 동일하게 승·하차 단말기에 휴대폰 뒷면을 태그하여 즉시 탑승 및 30분 무료 환승 혜택을 받을 수 있습니다.</li>
              <li><strong>버스 출입문 부착 QR 코드 스캔 계좌이체/결제 안내:</strong> 현금 없는 시내버스에서 교통카드가 전혀 없는 경우, 운전석 인근에 비치된 요금 납부 안내문(또는 QR 코드)을 스마트폰 카메라로 스캔하여 안내된 전용 계좌로 요금을 이체하고 탑승할 수 있습니다. 단, 계좌이체 납부 시에는 지하철-버스 무료 환승 할인이 적용되지 않으므로 2회 이상 이동 시에는 편의점에서 선불 교통카드를 구매하는 것이 훨씬 경제적입니다.</li>
            </ol>
          </section>`
  });

  pages.push({
    routePath: '/tips/taxi',
    title: '부산 콜택시 & 교통약자 특별교통수단(두리발·자비콜·동백택시) 이용 가이드 | 스텝리스 Stepless',
    description: '부산 지역 대표 브랜드 콜택시(동백택시·등대콜·부산콜) 및 중증장애인·휠체어 이용자 특별교통수단 두리발, 바우처 택시(자비콜·마카모디) 신청 방법과 연락처를 총정리했습니다.',
    h1: '부산 콜택시 & 교통약자 특별교통수단(두리발·바우처 택시) 종합 안내',
    lead: '가파른 언덕 지형이나 우천 시, 또는 심야 시간대 보행 약자와 가족 여행객이 안전하고 편리하게 이동할 수 있는 부산 공식 콜택시 및 교통약자 전용 차량(두리발·자비콜·마카모디) 이용 정보입니다.',
    bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">부산 교통약자 이동지원센터 및 일반 콜택시 핵심 디렉토리</h2>
            <ul style="font-size: 14px; color: #334155; padding-left: 20px; margin-bottom: 0;">
              <li><strong>두리발 (부산시설공단 특별교통수단, 1555-1114):</strong> 휠체어 탑승 설비(리프트·슬로프)가 장착된 특장 차량으로, 중증 보행장애인 및 타 지역 등록 장애인 방문객도 사전 서류 등록을 통해 저렴한 대중교통 수준의 요금으로 이용할 수 있습니다.</li>
              <li><strong>임산부 콜택시 마카모디 &amp; 바우처 택시 자비콜 (051-500-8888):</strong> 부산시 등록 교통약자 및 임산부를 위한 바우처 할인 택시 서비스입니다.</li>
              <li><strong>부산 통합 브랜드 콜택시 (동백택시 / 등대콜 051-600-1000 / 부산콜 051-200-2000):</strong> 일반 중형·대형(벤티/점보) 택시 호출이 가능하며, 접이식 유모차나 대형 캐리어 2~3개 이상 동반 시에는 트렁크 공간이 넓은 대형 승합 택시 호출을 권장합니다.</li>
            </ul>
          </section>`
  });

  // 6. Exploration magazine (/tips/exploration and 6 sub-articles)
  const explorationArticles: StaticRoutePage[] = [
    {
      routePath: '/tips/exploration',
      title: '부산 탐구생활 로컬 매거진 (무료 짐 보관소·유모차 대여·지하철 꿀팁) | 스텝리스 Stepless',
      description: '부산 현지인만 아는 무료 캐리어 보관소 4곳, 유모차·휠체어 무료 대여소, 지하철 반대편 승강장 10분 무료 재진입 팁, 부전~마산 복선전철 및 부산오페라하우스 소식을 전합니다.',
      h1: '부산 탐구생활: 로컬 에디터가 전하는 실전 부산 여행 꿀팁 & 도시 매거진',
      lead: '무거운 캐리어와 유모차를 가볍게 해줄 무료 서비스부터 부산 도시철도 숨은 이용 팁, 새롭게 변모하는 부산 교통·문화 인프라 소식까지 심층 아티클로 만나보세요.',
      bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">부산 탐구생활 전체 아티클 목록</h2>
            <ul style="font-size: 14px; color: #334155; padding-left: 20px; margin-bottom: 0;">
              <li><a href="/tips/exploration/luggage"><strong>부산 무료 짐 보관소 총정리 (부산역·서면·해운대·광안리 4곳)</strong></a>: 운영시간, 정확한 주소 및 지도 위치 안내</li>
              <li><a href="/tips/exploration/rental"><strong>보행 약자 &amp; 가족을 위한 부산 유모차·휠체어 무료 대여소 안내</strong></a>: 주요 관광지·백화점·도시철도 대여소 총정리</li>
              <li><a href="/tips/exploration/metro-reentry"><strong>부산 지하철 반대편 승강장 실수 시 10분 내 무료 재진입 팁</strong></a>: 추가 요금 없이 반대 방향 개찰구로 건너가는 방법</li>
              <li><a href="/tips/exploration/korean-cheat-codes"><strong>외국인 여행자를 위한 5초 실전 한국어 &amp; 부산 사투리 치트키</strong></a>: 식당·시장·대중교통에서 바로 쓰는 필수 표현</li>
              <li><a href="/tips/exploration/bujeon-masan"><strong>부전~마산 복선전철 개통 전망 및 서부산 무장애 환승 가이드</strong></a>: 부전역·사상역 광역 철도망 연결 효과</li>
              <li><a href="/tips/exploration/opera-house"><strong>북항 재개발 랜드마크 부산오페라하우스 &amp; 친수공원 무장애 산책로</strong></a>: 부산역 보행데크와 이어지는 해양 문화 공간</li>
            </ul>
          </section>`
    },
    {
      routePath: '/tips/exploration/luggage',
      title: '부산 무료 짐 보관소 총정리 (부산역·서면·해운대·광안리) - 부산 탐구생활 | 스텝리스 Stepless',
      description: '부산에서 캐리어와 여행 가방을 무료로 보관할 수 있는 4곳(부산트래블라운지, 롯데백화점 부산본점, 해운대 아틀리에 칙칙폭폭, 광안리 관광안내소) 운영시간과 위치를 안내합니다.',
      h1: '부산 무료 짐 보관소 4곳 총정리 (부산역·서면·해운대·광안리)',
      lead: '호텔 체크인 전이나 체크아웃 후 무거운 캐리어를 끌고 다니지 않도록, 부산 주요 거점별로 무료로 운영되는 공식 여행자 짐 보관 서비스 4곳의 운영시간과 찾아가는 길을 정리했습니다.',
      bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">권역별 부산 무료 수하물 보관소 상세 안내</h2>
            <article style="margin-bottom: 14px;">
              <h3 style="font-size: 16px; font-weight: 800; color: #11161B;">1. 부산역 권역: 부산트래블라운지 (Busan Travel Lounge)</h3>
              <p style="font-size: 14px; color: #334155; margin: 0;">부산 동구 중앙대로196번길 12-3 (초량동, <a href="/station/busan">부산역</a> 1호선 2번·4번 출구 인근 차이나타운 방면 평지 도보 3분). 외국인 및 부산 방문 여행객을 위한 무료 수하물 보관 및 휴게·관광 안내 공간입니다.</p>
            </article>
            <article style="margin-bottom: 14px;">
              <h3 style="font-size: 16px; font-weight: 800; color: #11161B;">2. 서면 권역: 롯데백화점 부산본점 지하 1층 물품보관서비스</h3>
              <p style="font-size: 14px; color: #334155; margin: 0;">부산 부산진구 가야대로 772 (<a href="/station/seomyeon">서면역</a> 지하상가 및 엘리베이터와 지하 1층 직결). 백화점 영업시간 내 무인 사물함 및 안내데스크를 통해 캐리어 보관이 가능해 서면·전포 카페거리 여행 시 매우 편리합니다.</p>
            </article>
            <article style="margin-bottom: 14px;">
              <h3 style="font-size: 16px; font-weight: 800; color: #11161B;">3. 해운대 권역: 해운대 플랫폼 (구 해운대역사 아틀리에 칙칙폭폭)</h3>
              <p style="font-size: 14px; color: #334155; margin: 0;">부산 해운대구 해운대로 621 (<a href="/station/haeundae">해운대역</a> 4번 출구 팔각정 정거장 바로 앞). 구남로 광장과 해운대 해수욕장 산책 전 짐을 맡기기에 최적의 위치입니다.</p>
            </article>
            <article style="margin-bottom: 0;">
              <h3 style="font-size: 16px; font-weight: 800; color: #11161B;">4. 광안리 권역: 광안리 관광안내소 무거운 짐 보관 서비스</h3>
              <p style="font-size: 14px; color: #334155; margin: 0;">부산 수영구 광안해변로 219 (<a href="/station/gwangan">광안역</a> 3번·5번 출구에서 해변 방면 직진). 광안리 해변 산책로 중앙에 위치하여 단차 없이 캐리어를 끌고 방문할 수 있습니다.</p>
            </article>
          </section>`
    },
    {
      routePath: '/tips/exploration/rental',
      title: '보행 약자 & 가족을 위한 부산 유모차·휠체어 무료 대여소 총정리 | 스텝리스 Stepless',
      description: '광안리 관광안내소, 태종대유원지, 국립해양박물관, 벡스코, 신세계·롯데백화점 등 부산 주요 명소의 유모차·수동휠체어 무료 대여 장소와 이용 방법을 안내합니다.',
      h1: '부산 주요 관광지·문화시설 유모차 & 휠체어 무료 대여소 디렉토리',
      lead: '대중교통 이동 시 유모차를 직접 가져오지 못했거나 여행 중 일시적으로 휠체어가 필요한 어르신·보행 약자를 위해 부산 전역에서 신분증 지참 시 무료로 대여 가능한 시설 목록을 정리했습니다.',
      bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">부산 권역별 유모차·휠체어 무료 대여 가능 시설</h2>
            <ul style="font-size: 14px; color: #334155; padding-left: 20px; margin-bottom: 0;">
              <li><strong>광안리 관광안내소:</strong> 유모차 및 수동 휠체어 무료 대여 (신분증 지참, 당일 반납, <a href="/station/gwangan">광안역</a> 연계)</li>
              <li><strong>국립해양박물관 &amp; 국립부산과학관:</strong> 1층 안내데스크에서 유아용 유모차 및 수동 휠체어 무료 대여, 전 층 엘리베이터 및 완만한 경사로 완비</li>
              <li><strong>BEXCO(벡스코) &amp; 부산시립미술관:</strong> 전시관 안내데스크에서 휠체어·유모차 무료 대여 (<a href="/station/bexco">벡스코역</a>·<a href="/station/centum-city">센텀시티역</a> 연계)</li>
              <li><strong>신세계백화점 센텀시티점 &amp; 롯데백화점 광복점·부산본점:</strong> 1층 또는 지하 유모차 대여소에서 유모차·휠체어 무료 대여</li>
              <li><strong>다대포 해변공원 &amp; 태종대유원지 관광안내소:</strong> 수동 휠체어 및 유모차 대여 지원</li>
            </ul>
          </section>`
    },
    {
      routePath: '/tips/exploration/metro-reentry',
      title: '부산 지하철 반대편 승강장 실수 시 10분 내 무료 재진입 팁 | 스텝리스 Stepless',
      description: '부산 도시철도 상대식 승강장에서 행선지 방향을 착각해 개찰구를 잘못 통과했을 때 추가 요금 없이 10분 이내 무료로 반대편 개찰구로 재진입하는 제도 안내.',
      h1: '부산 지하철 반대편 승강장 개찰구 실수 시 10분 이내 무료 재진입 가이드',
      lead: '엘리베이터를 타고 내려갔는데 반대 방향 승강장이어서 당황하셨나요? 부산 도시철도에서는 동일 역 개찰구에서 10분 이내 하차 태그 후 반대편 개찰구로 재진입 시 기본요금이 추가 부과되지 않는 무료 재진입 제도를 운영하고 있습니다.',
      bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">10분 내 무료 재진입 적용 조건 및 주의사항</h2>
            <p style="font-size: 14px; color: #334155;">부산 도시철도 1~4호선에서는 상대식 승강장(상행·하행 개찰구가 분리된 역사)에서 방향을 잘못 들어갔거나 화장실 이용 등을 위해 개찰구를 나갔다가 다시 들어올 때, <strong>최초 입장 태그 후 10분 이내에 동일 역에서 퇴장 태그 후 재입장 태그</strong>를 하면 추가 요금(기본운임)이 차감되지 않고 무료 환승(재진입)이 1회 허용됩니다. 단, 선불·후불 교통카드 1매당 1인 탑승 시에만 적용되며, 10분이 초과되거나 다른 역으로 이동한 경우에는 일반 운임이 부과됩니다.</p>
            <p style="font-size: 14px; color: #334155; margin-bottom: 0;">특히 <a href="/station/busan">부산역</a>, <a href="/station/jagalchi">자갈치역</a>, <a href="/station/nampo">남포역</a>, <a href="/station/haeundae">해운대역</a>, <a href="/station/gwangan">광안역</a> 등 상대식 승강장 구조를 가진 역사에서는 대합실 엘리베이터 탑승 전 행선지 표지판(노포 방면 vs 다대포해수욕장 방면, 장산 방면 vs 양산 방면)을 미리 확인하면 더욱 편리하게 이동할 수 있습니다.</p>
          </section>`
    },
    {
      routePath: '/tips/exploration/korean-cheat-codes',
      title: '5초 만에 배우는 초간단 실전 한국어 & 부산 여행 필수 회화 치트키 | 스텝리스 Stepless',
      description: '외국인 여행객이 부산 식당, 전통시장, 지하철역, 택시에서 바로 써먹는 초간단 한국어 발음 가이드와 배리어프리 도움 요청 표현을 정리했습니다.',
      h1: '외국인 친구도 5초 만에 써먹는 실전 한국어 & 부산 여행 필수 회화 가이드 (Survival Korean for Busan Trip)',
      lead: '식당 주문, 전통시장 쇼핑, 그리고 지하철역에서 엘리베이터나 경사로 위치를 물어볼 때 바로 보여줄 수 있는 한·영 실전 의사소통 카드입니다.',
      bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">부산 여행 상황별 필수 한국어 표현 (Essential Korean Phrases)</h2>
            <ul style="font-size: 14px; color: #334155; padding-left: 20px; margin-bottom: 0;">
              <li><strong>엘리베이터가 어디에 있나요? (Where is the elevator?):</strong> "El-li-be-i-teo-ga eo-di-e it-na-yo?" — 지하철역이나 백화점에서 계단 대신 승강기를 찾을 때 사용하세요.</li>
              <li><strong>유모차/휠체어가 들어갈 수 있나요? (Is it stroller/wheelchair accessible?):</strong> "Yu-mo-cha / Hwil-che-eo-ga deul-eo-gal su it-na-yo?" — 식당이나 카페 입장 전 단차 여부를 확인할 때 유용합니다.</li>
              <li><strong>이거 주세요 / 안 맵게 해주세요 (This one, please / Not spicy, please):</strong> "I-geo ju-se-yo / An maep-ge hae-ju-se-yo."</li>
              <li><strong>계산해 주세요 / 카드 되나요? (Check, please / Do you take credit cards?):</strong> "Gye-san-hae ju-se-yo / Ka-deu doe-na-yo?"</li>
            </ul>
          </section>`
    },
    {
      routePath: '/tips/exploration/bujeon-masan',
      title: '2027년 부전~마산 복선전철 부분 개통 전망 & 서부산 무장애 철도망 가이드 | 스텝리스 Stepless',
      description: '부전역과 사상역(김해국제공항 경전철 환승), 서부산을 잇는 부전~마산 복선전철 개통 소식과 광역전철 무장애 엘리베이터 환승 동선 기대 효과를 분석합니다.',
      h1: '부전~마산 복선전철 개통 전망 및 부전역·사상역 광역 무장애 환승 가이드',
      lead: '동해선 광역전철 시종착역인 부전역과 김해국제공항 관문인 사상역을 빠르게 연결하는 부전~마산 복선전철의 추진 현황과 보행 약자 이동 편의성 변화를 살펴봅니다.',
      bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">부전역 ↔ 사상역 광역철도 연결과 배리어프리 여행 동선</h2>
            <p style="font-size: 14px; color: #334155;">현재 <a href="/station/bujeon">부전역</a>(1호선·동해선)에서 <a href="/station/sasang">사상역</a>(2호선·부산김해경전철)으로 이동하려면 서면역을 거쳐 도시철도 2호선으로 환승해야 하지만, 부전~마산 복선전철이 개통되면 부전~사상 구간이 직결되어 김해국제공항에서 기장 오시리아·해운대 송정까지 이어지는 동서 횡단 무장애 철도 축이 완성됩니다. 전 역사에 스크린도어와 대형 엘리베이터, 휠체어 전용 탑승 구역이 최신 기준으로 도입됩니다.</p>
            <p style="font-size: 14px; color: #334155; margin-bottom: 0;">개통 전 현재 시점에서는 김해국제공항 입국 후 부산김해경전철 엘리베이터를 이용해 사상역으로 이동한 뒤, 사상역 무장애 환승 통로를 통해 도시철도 2호선(서면·광안리·해운대 방면)으로 갈아타는 경로가 가장 빠르고 단차 없는 정석 루트입니다.</p>
          </section>`
    },
    {
      routePath: '/tips/exploration/opera-house',
      title: '부산항 북항 랜드마크 부산오페라하우스 & 친수공원 무장애 산책로 가이드 | 스텝리스 Stepless',
      description: 'KTX 부산역 공중보행데크와 직접 연결되는 부산항 북항 재개발지구 친수공원과 향후 개관할 해양 문화 랜드마크 부산오페라하우스의 무장애 보행 동선을 소개합니다.',
      h1: '부산항 북항 친수공원 & 부산오페라하우스 무장애 해안 산책로 가이드',
      lead: 'KTX 부산역 2층 맞이방에서 계단 없이 공중보행데크(엘리베이터·무빙워크 완비)를 건너면 펼쳐지는 부산항 북항 친수공원과 부산오페라하우스 건립 현장의 평지 산책 코스를 안내합니다.',
      bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">KTX 부산역에서 계단 ZERO로 이어지는 북항 워터프론트</h2>
            <p style="font-size: 14px; color: #334155;"><a href="/station/busan">부산역</a>(도시철도 1호선 4·6번 출구 엘리베이터)과 KTX 부산역 2층 대합실은 대형 승강기와 보행데크로 연결되어 있으며, 바다 방향으로 뻗은 북항 공중보행교를 따라 이동하면 횡단보도나 계단 하나 없이 북항 친수공원 해안 산책로로 진입할 수 있습니다. 넓은 수변 데크와 완만한 잔디 광장, 장애인 화장실이 잘 갖춰져 있어 기차 탑승 전후 유모차·휠체어 산책 코스로 강력히 추천합니다.</p>
            <p style="font-size: 14px; color: #334155; margin-bottom: 0;">공중보행교 내부에는 평지형 무빙워크와 전망 엘리베이터가 설치되어 있어 무거운 캐리어를 끌거나 유모차를 밀면서도 부산항대교의 파노라마 오션뷰와 야경을 안전하게 감상할 수 있습니다.</p>
          </section>`
    }
  ];
  pages.push(...explorationArticles);

  // 7. About / Policy / Compliance pages (/about, /about/privacy, /about/terms, /about/contact, /about/data-source)
  pages.push({
    routePath: '/about',
    title: '스텝리스(Stepless in Busan) 서비스 소개 및 에디토리얼 원칙 | 스텝리스 Stepless',
    description: '계단 없는 부산여행 스텝리스(Stepless)의 설립 배경, 보행 약자(휠체어·유모차·캐리어)를 위한 부산 지하철 엘리베이터 데이터 검증 기준 및 현지 에디터 소개.',
    h1: '계단 없는 부산여행, 스텝리스(Stepless in Busan) 서비스 및 운영진 소개',
    lead: '스텝리스는 휠체어 이용자, 유모차 동반 가족, 어르신, 그리고 무거운 캐리어를 든 국내외 여행객이 계단이라는 물리적 장벽 없이 부산의 바다와 골목, 미식을 온전히 누릴 수 있도록 돕는 로컬 배리어프리 여행 가이드 플랫폼입니다.',
    bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">스텝리스의 3대 핵심 가치와 콘텐츠 제작 원칙</h2>
            <p style="font-size: 14px; color: #334155;">부산은 바다와 산이 맞닿은 아름다운 도시이지만, 가파른 경사와 복잡한 지하철 환승 구조로 인해 보행 약자에게는 출구 하나를 잘못 선택하는 것만으로도 큰 불편이 발생합니다. 스텝리스(총괄 에디터: 플로레르 Floreur)는 단순 요약 정보가 아닌 실제 이동에 필요한 정밀 정보를 제공합니다.</p>
            <ul style="font-size: 14px; color: #334155; padding-left: 20px; margin-bottom: 0;">
              <li><strong>주요 22개 지하철역 1동선 엘리베이터 검증:</strong> 승강장(B2~B4)에서 대합실, 지상 보도까지 계단 없이 이어지는 진짜 엘리베이터 출구 번호와 층별 이동 타임라인을 안내합니다.</li>
              <li><strong>8대 테마 &amp; 일정별(당일~4박5일) 무장애 코스 설계:</strong> 현지 에디터가 직접 동선을 점검하여 휠체어·유모차 진입 가능 여부, 평지 해변 데크길, 엘리베이터 완비 문화시설을 중심으로 여행 코스를 큐레이션합니다.</li>
              <li><strong>6개 국어 글로벌 여행자 지원:</strong> 한국어, 영어(English), 일본어(日本語), 중국어 번체·간체, 스페인어·프랑스어 안내와 네이버 지도·구글맵 대중교통 길찾기 연동으로 전 세계 여행자의 이동권을 지원합니다.</li>
            </ul>
          </section>`
  });

  pages.push({
    routePath: '/about/privacy',
    title: '개인정보처리방침 (Privacy Policy) | 스텝리스 Stepless',
    description: '스텝리스(Stepless, https://stepless.kr)의 개인정보처리방침, 쿠키(Cookie) 및 Google AdSense·Google Analytics 데이터 처리 기준 안내.',
    h1: '개인정보처리방침 (Privacy Policy)',
    lead: '스텝리스(Stepless, 이하 "서비스")는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 및 관련 법령과 Google 게시자 정책을 준수합니다.',
    bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 18px; font-weight: 800; margin-top: 0; color: #11161B;">1. 수집하는 정보 및 이용 목적</h2>
            <p style="font-size: 14px; color: #334155;">본 서비스는 별도의 회원가입 없이 모든 지하철 엘리베이터 안내 및 여행 코스 정보를 무료로 이용할 수 있습니다. 이용자가 '내 주변 출구 찾기' 기능을 실행할 때에만 브라우저의 위치 정보(Geolocation API)를 단말기 내에서 일시적으로 계산하며 서버에 저장하지 않습니다. 이용자가 자발적으로 '정보 오류 제보' 또는 '추천글 작성'을 제출하는 경우 작성자 닉네임과 제보 내용만 서비스 개선 목적으로 보관됩니다.</p>
            <h2 style="font-size: 18px; font-weight: 800; color: #11161B;">2. 쿠키(Cookie) 및 Google 애드센스·애널리틱스 광고 안내</h2>
            <p style="font-size: 14px; color: #334155;">본 웹사이트는 서비스 방문 통계 분석을 위해 Google Analytics를 사용하며, 무료 서비스 운영 유지를 위해 Google AdSense 광고를 게재합니다. Google을 포함한 제3자 공급업체는 쿠키(Cookie)를 사용하여 사용자의 이전 웹사이트 방문 기록을 기반으로 맞춤형 광고를 게재할 수 있습니다. 이용자는 언제든지 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google 광고 설정</a> 페이지에서 맞춤형 광고를 비활성화하거나 브라우저 설정에서 쿠키 저장을 거부할 수 있습니다.</p>
            <h2 style="font-size: 18px; font-weight: 800; color: #11161B;">3. 개인정보 보호책임자 및 문의처</h2>
            <p style="font-size: 14px; color: #334155; margin-bottom: 0;">운영팀: 스텝레스 (Stepless) · 책임자: 플로레르 (Floreur) · 이메일: <a href="mailto:floreur88@gmail.com">floreur88@gmail.com</a></p>
          </section>`
  });

  pages.push({
    routePath: '/about/terms',
    title: '서비스 이용약관 (Terms of Service) | 스텝리스 Stepless',
    description: '스텝리스(Stepless, https://stepless.kr) 서비스 이용약관, 공공데이터 활용 면책 고지 및 저작권 안내.',
    h1: '서비스 이용약관 (Terms of Service)',
    lead: '본 약관은 스텝리스(Stepless)가 제공하는 부산 무장애 지하철 안내 및 여행 코스 추천 웹 서비스의 이용 조건과 책임 한계를 규정합니다.',
    bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 18px; font-weight: 800; margin-top: 0; color: #11161B;">제1조 (목적 및 서비스의 성격)</h2>
            <p style="font-size: 14px; color: #334155;">스텝리스는 부산광역시 도시철도 역사 내 승강 설비(엘리베이터·에스컬레이터) 위치와 무장애 여행 코스 정보를 제공하는 공익적 목적의 로컬 여행 가이드 서비스입니다.</p>
            <h2 style="font-size: 18px; font-weight: 800; color: #11161B;">제2조 (시설 운행 정보의 변동 및 확인 안내)</h2>
            <p style="font-size: 14px; color: #334155;">역사 내 엘리베이터 및 에스컬레이터는 부산교통공사의 긴급 보수 점검이나 기상 상황에 따라 예고 없이 일시 운행 중단될 수 있으며, 식당·관광지의 영업시간 및 요금 또한 현장 사정에 따라 변경될 수 있습니다. 중요한 일정의 경우 방문 전 공식 고객센터를 통해 최신 운행 여부를 함께 확인하시기 바랍니다.</p>
            <h2 style="font-size: 18px; font-weight: 800; color: #11161B;">제3조 (지식재산권 및 콘텐츠 보호)</h2>
            <p style="font-size: 14px; color: #334155; margin-bottom: 0;">본 사이트가 독자적으로 구축한 출구별 층별 동선 해설, 에디터 코스 큐레이션 텍스트 및 일러스트 디자인의 저작권은 스텝레스에 귀속되며 무단 복제 및 상업적 재배포를 금합니다.</p>
          </section>`
  });

  pages.push({
    routePath: '/about/contact',
    title: '정보 오류 제보 및 제휴 문의 (Contact Us) | 스텝리스 Stepless',
    description: '부산 지하철 엘리베이터 고장·점검 제보, 새로운 무장애 여행지·맛집 추천 및 파트너십 문의 안내.',
    h1: '정보 오류 제보 및 파트너십 문의 (Contact & Feedback)',
    lead: '현장에서 발견한 지하철 엘리베이터 점검 소식이나 보행 약자에게 추천하고 싶은 부산의 무장애 식당·명소가 있다면 언제든 제보해 주세요.',
    bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 18px; font-weight: 800; margin-top: 0; color: #11161B;">공식 소통 채널 및 제보 처리 절차</h2>
            <p style="font-size: 14px; color: #334155;">스텝리스(Stepless in Busan) 에디토리얼 팀은 부산을 여행하는 모든 분들의 생생한 현장 제보를 바탕으로 데이터를 수시 업데이트하고 있습니다. 엘리베이터 일시 보수 점검, 출구 공사 안내, 혹은 유모차·휠체어 이용객에게 널리 알리고 싶은 배리어프리 공간이 있다면 아래 채널로 연락해 주세요.</p>
            <ul style="font-size: 14px; color: #334155; padding-left: 20px; margin-bottom: 0;">
              <li><strong>이메일 문의 및 제보:</strong> <a href="mailto:floreur88@gmail.com">floreur88@gmail.com</a> (총괄 에디터: 플로레르 Floreur)</li>
              <li><strong>엘리베이터·출구 시설 제보:</strong> 역 이름, 출구 번호, 점검 현황 또는 사진과 함께 보내주시면 에디터 확인 후 24~48시간 이내에 역 상세 페이지에 반영됩니다.</li>
              <li><strong>무장애 관광지·식당·카페 추천:</strong> 유모차 및 휠체어 출입이 편리한 부산 로컬 공간을 알려주시면 현장 검증 후 테마 코스에 추가합니다.</li>
            </ul>
          </section>`
  });

  pages.push({
    routePath: '/about/data-source',
    title: '공공데이터 출처 및 배리어프리 검증 기준 안내 | 스텝리스 Stepless',
    description: '스텝리스가 활용하는 부산교통공사 도시철도 공공데이터, 한국관광공사 TourAPI 무장애 열린관광지(KorWithService2) 및 현장 실사 검증 프로세스를 공개합니다.',
    h1: '공공데이터 출처 및 배리어프리 현장 검증 기준 (Data Sources & Verification)',
    lead: '스텝리스의 모든 지하철 출구 안내와 무장애 여행 코스는 국가·지자체 공인 공공데이터와 로컬 에디터의 교차 검증을 거쳐 제공됩니다.',
    bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 18px; font-weight: 800; margin-top: 0; color: #11161B;">활용 공공데이터 및 교차 검증 출처</h2>
            <ol style="font-size: 14px; color: #334155; padding-left: 20px; margin-bottom: 0;">
              <li><strong>부산교통공사 (Busan Transportation Corporation):</strong> 부산 도시철도 1~4호선 역사별 승강편의시설(엘리베이터·에스컬레이터·휠체어리프트) 설치 현황 및 장애인 화장실 위치 데이터</li>
              <li><strong>한국관광공사 (Korea Tourism Organization - TourAPI 4.0 &amp; KorWithService2):</strong> 무장애 열린관광지 출입구 경사로, 주출입구 단차 유무, 장애인 전용 주차구역, 점자블록, 휠체어·유모차 대여 정보</li>
              <li><strong>부산광역시 공공데이터포털 &amp; Visit Busan:</strong> 월별 부산 공식 축제·문화행사 일정 및 시내버스·특별교통수단(두리발) 운영 정보</li>
              <li><strong>로컬 에디터 현장 실사 및 로드뷰 교차 검증:</strong> 지상 엘리베이터 출구 앞 보도 턱, 횡단보도 연결 상태, 상가·백화점 연결 통로 운영 시간을 정기적으로 점검합니다.</li>
            </ol>
          </section>`
  });

  // Root home page '/'
  pages.unshift({
    routePath: '/',
    title: '부산 여행 코스 추천 & 지하철 무장애 가이드 | Busan Trip Plan & Step-Free Itinerary | 스탭리스 Stepless',
    description: '부산 명소·맛집·전통시장 추천 여행 코스(당일치기~4박5일), 나만의 맞춤 여행 루트 플래너, 주요 22개 지하철역 엘리베이터 위치 및 유모차·휠체어 배리어프리 동선 가이드.',
    h1: '계단 없는 부산여행, 로컬 가이드 스탭리스와 함께 (Stepless in Busan)',
    lead: '부산 8대 테마·일정별 추천 여행 코스(당일치기~4박5일), 맞춤 여행 루트 플래너, 그리고 주요 22개 지하철역 엘리베이터·에스컬레이터 무장애 동선을 한눈에 확인하세요.',
    bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">부산 여행 코스 추천 &amp; 주요 22개 지하철역 무장애 출구 허브</h2>
            <p style="font-size: 14px; color: #334155;">스탭리스(Stepless in Busan)는 유모차 동반 가족, 휠체어 이용자, 어르신 및 캐리어 여행객이 계단 걱정 없이 부산을 여행할 수 있도록 설계된 다국어 로컬 여행 가이드입니다.</p>
            <ul style="font-size: 14px; color: #334155; padding-left: 20px;">
              <li><a href="/tips/courses"><strong>부산 추천 여행 코스 (당일치기~4박5일 &amp; 테마별)</strong></a> — <a href="/tips/courses/gourmet">식도락 맛집</a> · <a href="/tips/courses/attraction">핵심 명소</a> · <a href="/tips/courses/market">전통시장</a> · <a href="/tips/courses/experience">체험·박물관</a></li>
              <li><a href="/search"><strong>부산 주요 22개 지하철역 엘리베이터·에스컬레이터 출구 검색</strong></a> — 서면역, 부산역, 해운대역, 광안역, 남포역, 자갈치역, 센텀시티역 등</li>
              <li><a href="/barrier-free"><strong>한국관광공사 검증 부산 무장애 열린관광지 (${BUSAN_TOUR_API_SPOTS.length}곳)</strong></a></li>
              <li><a href="/my-route"><strong>내 여행 루트 만들기 (맞춤 일정 플래너 &amp; 대중교통 길찾기)</strong></a></li>
              <li><a href="/schedule"><strong>부산 월별 축제·행사 캘린더 (광안리 드론쇼·부산불꽃축제)</strong></a></li>
              <li><a href="/tips/exploration"><strong>부산 탐구생활 (무료 짐 보관소·유모차 대여소·지하철 꿀팁)</strong></a></li>
            </ul>
          </section>`
  });

  return pages;
}

function buildLocalizedStationPage(stationId: string, lang: Language): StaticRoutePage | null {
  const st = STATIONS.find(s => s.id === stationId);
  if (!st) return null;

  const stTitle = getLocalizedStationTitle(st, lang);
  const loc = getStationLocalized(st, lang);
  const lineNames = st.lines.map(l => formatLineLabelI18n(l, lang)).join(' · ');
  const recExits = loc ? loc.recommendedExits : (st.recommendedExitsEn || st.recommendedExits);
  const elevDesc = loc ? loc.elevatorLocationDesc : (st.elevatorLocationDescEn || st.elevatorLocationDesc);
  const moveTime = loc ? loc.avgMovementTime : (st.avgMovementTimeEn || st.avgMovementTime);
  const transferDesc = loc ? loc.transferRouteDesc : (st.transferRouteDescEn || st.transferRouteDesc);
  const precautions = loc ? loc.precautions : (st.precautionsEn || st.precautions);

  const title = pickLang(lang, {
    KR: `${st.name} 엘리베이터 위치·출구 안내 | 스탭리스 Stepless`,
    EN: `${st.englishName} Elevator Exits & Step-Free Busan Subway Guide | Stepless`,
    JA: `${stTitle} エレベーター出口・バリアフリー乗換案内（釜山地下鉄）| Stepless`,
    ZH_TW: `${stTitle} 電梯出口位置＆無障礙轉乘指南（釜山地鐵）| Stepless`,
    ZH_CN: `${stTitle} 无障碍直梯出口位置＆换乘指南（釜山地铁）| Stepless`,
    ES: `${stTitle}: Salidas con Ascensor y Guía Sin Escalones (Metro de Busan) | Stepless`,
    FR: `${stTitle} : Sorties avec Ascenseur et Guide Sans Marche (Métro de Busan) | Stepless`,
  });

  const description = pickLang(lang, {
    KR: `${st.name} 엘리베이터 출구(${recExits}) 및 무장애 동선 안내.`,
    EN: `Find exact elevator exit numbers (${recExits}), escalator locations, accessible restrooms, and step-free stroller & wheelchair routes at ${st.englishName} on the Busan Subway (${lineNames}).`,
    JA: `釜山地下鉄${lineNames}「${stTitle}」の地上直結エレベーター出口（${recExits}）、エスカレーター、多目的トイレ、ベビーカー・車椅子・スーツケース向け段差なし移動ルート完全ガイド。`,
    ZH_TW: `釜山地鐵${lineNames}「${stTitle}」地面直達電梯出口（${recExits}）、電扶梯、無障礙廁所，以及推嬰兒車、輪椅、大型行李箱免爬樓梯動線指南。`,
    ZH_CN: `釜山地铁${lineNames}“${stTitle}”地面直达电梯出口（${recExits}）、自动扶梯、无障碍卫生间，以及推婴儿车、轮椅、大件行李箱无台阶出行指南。`,
    ES: `Guía completa de salidas con ascensor (${recExits}), escaleras mecánicas y rutas sin escalones para cochecitos, sillas de ruedas y maletas en ${stTitle} (${lineNames}, Metro de Busan).`,
    FR: `Guide complet des sorties avec ascenseur (${recExits}), escalators et itinéraires sans marche pour poussettes, fauteuils roulants et valises à ${stTitle} (${lineNames}, Métro de Busan).`,
  });

  const exitsHtml = st.exits.map(ex => {
    const exNum = formatExitNumberI18n(ex.number, lang);
    const dir = translateExitDirectionI18n(ex, lang);
    const tip = translateExitTipI18n(ex, lang);
    return `
            <article style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 12px; padding: 16px; margin-bottom: 12px;">
              <h3 style="font-size: 16px; font-weight: 800; color: #11161B; margin: 0 0 6px 0;">${escapeHtml(stTitle)} — ${escapeHtml(exNum)}</h3>
              <p style="font-size: 14px; color: #334155; margin: 0 0 6px 0;"><strong>Direction / Landmarks:</strong> ${escapeHtml(dir)}</p>
              <p style="font-size: 13.5px; color: #475569; margin: 0;"><strong>Step-Free Tip:</strong> ${escapeHtml(tip)}</p>
            </article>`;
  }).join('\n');

  const otherStationsHtml = STATIONS.map(o => {
    const oTitle = getLocalizedStationTitle(o, lang, true);
    const href = buildLocalizedPath(`/station/${o.id}`, lang);
    return `<a href="${escapeHtml(href)}" style="display: inline-block; margin: 4px 6px 4px 0; padding: 4px 10px; background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 999px; font-size: 13px; color: #334155; text-decoration: none;">${escapeHtml(oTitle)}</a>`;
  }).join('\n');

  const bodyHtml = `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">${escapeHtml(stTitle)} (${escapeHtml(lineNames)}) — Step-Free &amp; Elevator Summary</h2>
            <ul style="font-size: 14px; color: #334155; padding-left: 20px; margin-bottom: 0;">
              <li><strong>Subway Lines:</strong> ${escapeHtml(lineNames)}</li>
              <li><strong>Recommended Elevator / Escalator Exits:</strong> ${escapeHtml(recExits)}</li>
              <li><strong>Elevator Location:</strong> ${escapeHtml(elevDesc)}</li>
              <li><strong>Average Transfer / Exit Time:</strong> ${escapeHtml(moveTime)}</li>
              <li><strong>Step-Free Transfer Route:</strong> ${escapeHtml(transferDesc)}</li>
              <li><strong>Facilities:</strong> ${st.elevatorCount} Elevators / ${st.escalatorCount} Escalators</li>
              <li><strong>Traveler Note:</strong> ${escapeHtml(precautions)}</li>
            </ul>
          </section>
          <section style="margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; color: #11161B; margin-bottom: 14px;">${escapeHtml(stTitle)} Exit-by-Exit Accessibility Guide</h2>
            ${exitsHtml}
          </section>
          <section style="background: #F4F6F0; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 18px; font-weight: 800; margin-top: 0; color: #11161B;">All 22 Busan Subway Stations</h2>
            <div>${otherStationsHtml}</div>
          </section>`;

  return {
    routePath: buildLocalizedPath(`/station/${st.id}`, lang),
    title,
    description,
    h1: title.replace(/\s*\|\s*Stepless.*$/i, ''),
    lead: description,
    bodyHtml,
  };
}

const COURSE_CATEGORY_SEO_META: Record<
  string,
  {
    title: Record<Language, string>;
    description: Record<Language, string>;
    h1: Record<Language, string>;
  }
> = {
  GOURMET: {
    title: {
      KR: '부산 식도락 맛집 여행 코스 추천 (돼지국밥·밀면·자갈치·카페) | 스탭리스 Stepless',
      EN: 'Busan Food Tour & Best Local Restaurants Guide (Pork Soup, Milmyeon, Seafood & Cafes) | Stepless',
      JA: '釜山グルメ・食べ歩きおすすめモデルコース（デジクッパ・ミルミョン・海鮮・カフェ） | Stepless',
      ZH_TW: '釜山美食必吃推薦行程（豬肉湯飯・小麥冷麵・札嘎其海鮮・田浦咖啡街） | Stepless',
      ZH_CN: '釜山美食必吃推荐路线（猪肉汤饭・小麦冷面・札嘎其海鲜・田浦咖啡街） | Stepless',
      ES: 'Ruta Gastronómica por Busán: Dónde Comer Platos Locales, Mariscos y Cafeterías | Stepless',
      FR: 'Itinéraire Gastronomique à Busan : Spécialités Locales, Fruits de Mer et Cafés | Stepless',
    },
    description: {
      KR: '부산 현지인이 검증한 식도락 맛집 코스: 서면·부산역 돼지국밥, 밀면, 남포동 씨앗호떡, 자갈치 활어회, 기장 대게, 전포카페거리 및 해운대·영도 오션뷰 카페 가이드.',
      EN: 'Local-verified Busan food guide: Dwaeji-gukbap (pork rice soup), Milmyeon wheat noodles, BIFF seed hotteok, Jagalchi seafood, Gijang snow crab, Jeonpo Cafe Street, and ocean-view bakeries.',
      JA: '釜山ローカル厳選の絶品グルメコース：西面・釜山駅のデジクッパ、ミルミョン、南浦洞シアホットク、チャガルチ市場の海鮮、機張カニ、田浦カフェ通り＆海雲台・影島オーシャンビューカフェ完全ガイド。',
      ZH_TW: '釜山在地人認證必吃美食攻略：西面・釜山站豬肉湯飯、草梁小麥冷麵、南浦洞堅果糖餅、札嘎其市場活海鮮、機張長腳蟹，以及田浦咖啡街與海雲台・影島海景咖啡廳推薦。',
      ZH_CN: '釜山本地人认证必吃美食攻略：西面・釜山站猪肉汤饭、草梁小麦冷面、南浦洞坚果糖饼、札嘎其市场活海鲜、机张雪蟹，以及田浦咖啡街与海云台・影岛海景咖啡店推荐。',
      ES: 'Guía gastronómica local de Busán: sopa de cerdo Dwaeji-gukbap, fideos Milmyeon, panqueques dulces de BIFF, mariscos de Jagalchi, cangrejo de Gijang y cafeterías con vista al mar.',
      FR: 'Guide gastronomique local de Busan : soupe de porc Dwaeji-gukbap, nouilles Milmyeon, crêpes sucrées BIFF, fruits de mer de Jagalchi, crabe de Gijang et cafés avec vue sur mer.',
    },
    h1: {
      KR: '부산 식도락 맛집 & 카페 추천 여행 코스',
      EN: 'Busan Local Food & Cafe Gourmet Guide',
      JA: '釜山グルメ・名物料理＆カフェおすすめコース',
      ZH_TW: '釜山必吃在地美食＆海景咖啡廳推薦行程',
      ZH_CN: '釜山必吃地道美食＆海景咖啡店推荐路线',
      ES: 'Guía Gastronómica de Busán: Restaurantes Locales y Cafeterías',
      FR: 'Guide Gastronomique de Busan : Restaurants Locaux et Cafés',
    },
  },
  EXPERIENCE: {
    title: {
      KR: '부산 체험 & 박물관 여행 코스 추천 (블루라인파크·루지·요트·아르떼뮤지엄) | 스탭리스 Stepless',
      EN: 'Best Things to Do in Busan: Experiences, Museums, Sky Capsule & Yacht Tour | Stepless',
      JA: '釜山体験・ミュージアムおすすめコース（スカイカプセル・リュージュ・ヨット・美術館） | Stepless',
      ZH_TW: '釜山體驗・博物館推薦行程（膠囊列車・斜坡滑車・遊艇・Arte Museum・汗蒸幕） | Stepless',
      ZH_CN: '釜山体验・博物馆推荐路线（胶囊小火车・斜坡滑车・游艇・Arte Museum・汗蒸幕） | Stepless',
      ES: 'Mejores Experiencias y Museos en Busán (Sky Capsule, Luge, Yate y Arte Museum) | Stepless',
      FR: 'Meilleures Expériences et Musées à Busan (Sky Capsule, Luge, Yacht et Arte Museum) | Stepless',
    },
    description: {
      KR: '해운대 블루라인파크 스카이캡슐·해변열차, 스카이라인 루지, 롯데월드 부산, 수영만 요트투어, 아르떼뮤지엄 부산, 뮤지엄원, 국립해양박물관, 신세계 스파랜드·허심청 온천 등 부산 대표 체험·박물관 총정리.',
      EN: 'Top Busan activities and indoor museums: Haeundae Blueline Park Sky Capsule, Skyline Luge, Lotte World Busan, Gwangalli Yacht Tour, Arte Museum, Museum 1, National Maritime Museum, and Spaland.',
      JA: '海雲台ブルーラインパーク（スカイカプセル・海辺列車）、スカイラインリュージュ、ロッテワールド釜山、ヨットツアー、アルテミュージアム釜山、国立海洋博物館、新世界スパランド・虚心庁温泉など釜山の人気体験＆博物館ガイド。',
      ZH_TW: '精選釜山必玩體驗與室內博物館：海雲台藍線公園膠囊列車、斜坡滑車 Luge、釜山樂天世界、廣安里遊艇夜間巡航、Arte Museum、國立海洋博物館、新世界 Spa Land 與虛心廳溫泉。',
      ZH_CN: '精选釜山必玩体验与室内博物馆：海云台蓝线公园胶囊小火车、斜坡滑车 Luge、釜山乐天世界、广安里游艇夜航、Arte Museum、国立海洋博物馆、新世界 Spa Land 与虚心厅温泉。',
      ES: 'Actividades imprescindibles y museos en Busán: cápsula costera Blueline Park, Skyline Luge, Lotte World Busán, paseo en yate, Arte Museum, Museo Marítimo Nacional y aguas termales.',
      FR: 'Activités incontournables et musées à Busan : Sky Capsule Blueline Park, Skyline Luge, Lotte World Busan, croisière en yacht, Arte Museum, Musée Maritime National et sources chaudes.',
    },
    h1: {
      KR: '부산 체험·액티비티 & 박물관 추천 코스',
      EN: 'Busan Experiences, Activities & Museums Guide',
      JA: '釜山アクティビティ体験＆ミュージアムおすすめコース',
      ZH_TW: '釜山熱門體驗活動＆博物館推薦行程',
      ZH_CN: '釜山热门体验活动＆博物馆推荐路线',
      ES: 'Experiencias, Actividades y Museos en Busán',
      FR: 'Expériences, Activités et Musées à Busan',
    },
  },
  MARKET: {
    title: {
      KR: '부산 전통시장 & 쇼핑 투어 추천 코스 (자갈치·국제시장·깡통야시장·백화점) | 스탭리스 Stepless',
      EN: 'Busan Traditional Markets, Night Markets & Shopping Guide (Jagalchi, Gukje, Centum) | Stepless',
      JA: '釜山伝統市場・夜市＆ショッピングおすすめコース（チャガルチ・国際市場・富平カントン夜市） | Stepless',
      ZH_TW: '釜山傳統市場・夜市＆購物推薦行程（札嘎其市場・國際市場・富平罐頭夜市・新世界百貨） | Stepless',
      ZH_CN: '釜山传统市场・夜市＆购物推荐路线（札嘎其市场・国际市场・富平罐头夜市・新世界百货） | Stepless',
      ES: 'Mercados Tradicionales, Mercados Nocturnos y Compras en Busán (Jagalchi, Gukje) | Stepless',
      FR: 'Marchés Traditionnels, Marchés de Nuit et Shopping à Busan (Jagalchi, Gukje) | Stepless',
    },
    description: {
      KR: '자갈치시장, 국제시장, 부평깡통야시장, 부전시장, 해운대시장 등 부산 대표 전통시장 먹거리와 신세계백화점 센텀시티점, 기장 프리미엄아울렛, 서면 지하상가 쇼핑 완벽 가이드.',
      EN: 'Explore Busan vibrant traditional markets and shopping hubs: Jagalchi Fish Market, Gukje Market, Bupyeong Kkangtong Night Market, Bujeon Market, Shinsegae Centum City, and Seomyeon Underground Mall.',
      JA: 'チャガルチ市場、国際市場、富平カントン夜市、釜田市場、海雲台市場の食べ歩きから、新世界百貨店センタムシティ店、西面地下街、機張プレミアムアウトレットまで釜山市場＆ショッピング完全ガイド。',
      ZH_TW: '一次逛遍釜山代表傳統市場與購物熱點：札嘎其市場、國際市場、富平罐頭夜市、釜田市場、海雲台市場必吃街頭美食，以及新世界百貨 Centum City、西面地下街與機張 Outlet。',
      ZH_CN: '一次逛遍釜山代表传统市场与购物热点：札嘎其市场、国际市场、富平罐头夜市、釜田市场、海云台市场必吃街头小吃，以及新世界百货 Centum City、西面地下街与机张奥特莱斯。',
      ES: 'Recorre los mercados tradicionales y centros de compras de Busán: Mercado de Pescado Jagalchi, Mercado Gukje, Mercado Nocturno Bupyeong Kkangtong, Bujeon y Shinsegae Centum City.',
      FR: 'Parcourez les marchés traditionnels et lieux de shopping de Busan : Marché aux poissons de Jagalchi, Marché Gukje, Marché de nuit Bupyeong Kkangtong, Bujeon et Shinsegae Centum City.',
    },
    h1: {
      KR: '부산 전통시장·야시장 & 쇼핑 추천 코스',
      EN: 'Busan Traditional Markets, Night Markets & Shopping Guide',
      JA: '釜山伝統市場・夜市＆ショッピングコース',
      ZH_TW: '釜山傳統市場・夜市＆購物推薦指南',
      ZH_CN: '釜山传统市场・夜市＆购物推荐指南',
      ES: 'Mercados Tradicionales, Nocturnos y Compras en Busán',
      FR: 'Marchés Traditionnels, Marchés de Nuit et Shopping à Busan',
    },
  },
  ATTRACTION: {
    title: {
      KR: '부산 대표 핵심 명소 & 관광지 추천 코스 (해운대·광안리·감천문화마을·해동용궁사) | 스탭리스 Stepless',
      EN: 'Top Busan Attractions & Must-Visit Landmarks Guide (Haeundae, Gwangalli, Gamcheon) | Stepless',
      JA: '釜山定番観光スポット・名所おすすめコース（海雲台・広安里・甘川文化村・海東龍宮寺） | Stepless',
      ZH_TW: '釜山必去代表景點全攻略（海雲台・廣安里・甘川洞文化村・白淺灘・海東龍宮寺） | Stepless',
      ZH_CN: '釜山必去代表景点全攻略（海云台・广安里・甘川文化村・白浅滩・海东龙宫寺） | Stepless',
      ES: 'Principales Atracciones Qué Ver en Busán (Haeundae, Gwangalli, Gamcheon, Yonggungsa) | Stepless',
      FR: 'Sites Incontournables à Visiter à Busan (Haeundae, Gwangalli, Gamcheon, Yonggungsa) | Stepless',
    },
    description: {
      KR: '해운대 해수욕장, 광안리 해변, 감천문화마을, 영도 흰여울문화마을, 태종대, 기장 해동용궁사, 용두산공원 부산타워, 송도 해상케이블카, 황령산 전망대 등 부산 필수 명소 총정리.',
      EN: 'Complete guide to must-visit Busan landmarks: Haeundae Beach, Gwangalli Beach, Gamcheon Culture Village, Huinnyeoul Culture Village, Taejongdae, Haedong Yonggungsa Temple, and Busan Tower.',
      JA: '海雲台ビーチ、広安里ビーチ、甘川文化村、影島ヒニョウル文化村、太宗台、海東龍宮寺、龍頭山公園（釜山タワー）、松島海上ケーブルカー、荒嶺山展望台など釜山の必見観光スポット一覧。',
      ZH_TW: '釜山自由行必去經典景點總整理：海雲台海水浴場、廣安里海灘、甘川洞文化村、影島白淺灘文化村、太宗台、海東龍宮寺、龍頭山公園釜山塔、松島海上纜車與荒嶺山夜景展望台。',
      ZH_CN: '釜山自由行必去经典景点总整理：海云台海水浴场、广安里海滩、甘川文化村、影岛白浅滩文化村、太宗台、海东龙宫寺、龙头山公园釜山塔、松岛海上缆车与荒岭山夜景展望台。',
      ES: 'Los lugares imprescindibles que ver en Busán: Playa Haeundae, Playa Gwangalli, Aldea Cultural de Gamcheon, Aldea Huinnyeoul, Taejongdae, Templo Haedong Yonggungsa y Torre de Busán.',
      FR: 'Les lieux incontournables à voir à Busan : Plage de Haeundae, Plage de Gwangalli, Village culturel de Gamcheon, Village de Huinnyeoul, Taejongdae, Temple Haedong Yonggungsa et Tour de Busan.',
    },
    h1: {
      KR: '부산 대표 명소 & 핵심 랜드마크 코스',
      EN: 'Top Busan Attractions & Landmarks Guide',
      JA: '釜山定番観光スポット・名所ガイド',
      ZH_TW: '釜山必去代表景點＆地標指南',
      ZH_CN: '釜山必去代表景点＆地标指南',
      ES: 'Principales Atracciones y Monumentos de Busán',
      FR: 'Principales Attractions et Sites de Busan',
    },
  },
  DAY: {
    title: {
      KR: '부산 당일치기 여행 추천 코스 (동부산·원도심·카페투어) | 스탭리스 Stepless',
      EN: '1-Day Busan Itinerary & Day Trip Course (East Busan, Old Town & Cafe Tour) | Stepless',
      JA: '釜山日帰りおすすめモデルコース（海雲台・広安里・甘川文化村・カフェツアー） | Stepless',
      ZH_TW: '釜山一日遊精華推薦行程（海雲台廣安里・甘川洞舊城區・特色咖啡巡禮） | Stepless',
      ZH_CN: '釜山一日游精华推荐路线（海云台广安里・甘川洞老城区・特色咖啡巡礼） | Stepless',
      ES: 'Itinerario de 1 Día en Busán: Qué Ver en una Excursión de un Día | Stepless',
      FR: 'Itinéraire d’1 Jour à Busan : Que Voir en une Journée | Stepless',
    },
    description: {
      KR: '하루 만에 부산의 핵심 바다와 명소, 미식을 알차게 둘러보는 당일치기 3대 테마 코스(동부산 해운대·광안리, 원도심 감천·영도·자갈치, 스페셜티 커피투어) 동선 가이드.',
      EN: 'Make the most of one day in Busan with 3 curated step-by-step day trip routes: East Busan Ocean Highlights, Old Town & Yeongdo Heritage, and Busan Specialty Coffee Tour.',
      JA: '1日で釜山の海・絶景・グルメを満喫する日帰りモデルコース3選：東釜山（海雲台・広安里）、旧都心（甘川文化村・影島・チャガルチ）、スペシャリティカフェツアー。',
      ZH_TW: '一天玩遍釜山精華的 3 條一日遊推薦路線：東釜山海景線（海雲台・廣安里）、舊城區歷史海港線（甘川洞・影島・札嘎其）與釜山精品咖啡巡禮。',
      ZH_CN: '一天玩遍釜山精华的 3 条一日游推荐路线：东釜山海景线（海云台・广安里）、老城区历史海港线（甘川洞・影岛・札嘎其）与釜山精品咖啡巡礼。',
      ES: 'Aprovecha al máximo 1 día en Busán con 3 rutas paso a paso: Costa Este (Haeundae y Gwangalli), Casco Antiguo (Gamcheon y Jagalchi) y Ruta de Cafés de Especialidad.',
      FR: 'Profitez au maximum d’une journée à Busan avec 3 circuits clés en main : Côte Est (Haeundae et Gwangalli), Vieille Ville (Gamcheon et Jagalchi) et Tour des Cafés de Spécialité.',
    },
    h1: {
      KR: '부산 당일치기 추천 여행 코스',
      EN: '1-Day Busan Day Trip Itinerary',
      JA: '釜山日帰りおすすめモデルコース',
      ZH_TW: '釜山一日遊推薦行程路線',
      ZH_CN: '釜山一日游推荐行程路线',
      ES: 'Itinerario de 1 Día en Busán',
      FR: 'Itinéraire d’1 Jour à Busan',
    },
  },
  '1NIGHT': {
    title: {
      KR: '부산 1박 2일 여행 추천 코스 (해운대·광안리 야경·남포동·영도) | 스탭리스 Stepless',
      EN: '2-Day 1-Night Busan Itinerary & Weekend Trip Plan | Stepless',
      JA: '釜山1泊2日おすすめモデルコース（海雲台・広安里夜景・南浦洞・影島） | Stepless',
      ZH_TW: '釜山兩天一夜自由行推薦行程（海雲台・廣安里夜景・南浦洞・影島精華路線） | Stepless',
      ZH_CN: '釜山两天一夜自由行推荐路线（海云台・广安里夜景・南浦洞・影岛精华攻略） | Stepless',
      ES: 'Itinerario de 2 Días y 1 Noche en Busán: Playas, Mercados y Vistas Nocturnas | Stepless',
      FR: 'Itinéraire de 2 Jours et 1 Nuit à Busan : Plages, Marchés et Vues de Nuit | Stepless',
    },
    description: {
      KR: '주말 1박 2일 동안 동부산(해운대·블루라인파크·광안리 야경)과 원도심(자갈치·국제시장·감천문화마을·영도 흰여울문화마을)을 가장 효율적으로 여행하는 추천 코스.',
      EN: 'The ultimate 2-day 1-night Busan weekend itinerary: Day 1 East Busan beaches, Sky Capsule & Gwangalli night view; Day 2 Gamcheon Culture Village, Jagalchi Market & Yeongdo.',
      JA: '週末で行ける釜山1泊2日の王道モデルコース：1日目は海雲台・スカイカプセル・広安里の夜景、2日目は甘川文化村・チャガルチ市場・国際市場・影島ヒニョウル文化村を効率よく巡ります。',
      ZH_TW: '最適合週末出發的釜山兩天一夜自由行路線：Day 1 海雲台藍線公園膠囊列車与廣安里大橋夜景；Day 2 甘川洞文化村、札嘎其市場、南浦洞與影島白淺灘文化村。',
      ZH_CN: '最适合周末出发的釜山两天一夜自由行路线：Day 1 海云台蓝线公园胶囊小火车与广安里大桥夜景；Day 2 甘川文化村、札嘎其市场、南浦洞与影岛白浅滩文化村。',
      ES: 'El mejor itinerario de 2 días en Busán: Día 1 en Playa Haeundae, Blueline Park y noche en Gwangalli; Día 2 en Gamcheon, Mercado Jagalchi y costa de Yeongdo.',
      FR: 'Le meilleur itinéraire de 2 jours à Busan : Jour 1 à Haeundae, Blueline Park et soirée à Gwangalli ; Jour 2 à Gamcheon, Marché de Jagalchi et île de Yeongdo.',
    },
    h1: {
      KR: '부산 1박 2일 알짜 추천 코스',
      EN: '2-Day 1-Night Busan Trip Itinerary',
      JA: '釜山1泊2日おすすめモデルコース',
      ZH_TW: '釜山兩天一夜自由行推薦行程',
      ZH_CN: '釜山两天一夜自由行推荐路线',
      ES: 'Itinerario de 2 Días y 1 Noche en Busán',
      FR: 'Itinéraire de 2 Jours et 1 Nuit à Busan',
    },
  },
  '2NIGHTS': {
    title: {
      KR: '부산 2박 3일 여행 추천 코스 (해운대·기장·광안리·서면·남포동·영도) | 스탭리스 Stepless',
      EN: '3-Day 2-Night Busan Trip Plan & Complete Itinerary | Stepless',
      JA: '釜山2泊3日王道モデルコース（海雲台・機張・広安里・西面・南浦洞・影島） | Stepless',
      ZH_TW: '釜山三天兩夜自由行完整行程推薦（海雲台・機張・廣安里・西面・南浦洞・影島） | Stepless',
      ZH_CN: '釜山三天两夜自由行完整路线推荐（海云台・机张・广安里・西面・南浦洞・影岛） | Stepless',
      ES: 'Itinerario de 3 Días y 2 Noches en Busán: Ruta Completa Día por Día | Stepless',
      FR: 'Itinéraire de 3 Jours et 2 Nuits à Busan : Parcours Complet Jour par Jour | Stepless',
    },
    description: {
      KR: '부산 여행자가 가장 많이 찾는 2박 3일 정석 코스! 해운대·기장 해동용궁사부터 광안리·센텀시티, 서면·전포카페거리, 남포동·자갈치·감천문화마을·영도까지 완벽 정복.',
      EN: 'Our most popular 3-day 2-night Busan itinerary covering Haeundae, Gijang Haedong Yonggungsa, Gwangalli, Centum City, Seomyeon Jeonpo Cafe Street, Nampo-dong, Gamcheon, and Yeongdo.',
      JA: '一番人気の釜山2泊3日王道モデルコース！海雲台・機張（海東龍宮寺）から広安里・センタムシティ、西面・田浦カフェ通り、南浦洞・チャガルチ・甘川文化村・影島まで3日間で完全網羅。',
      ZH_TW: '最受台灣與香港旅客歡迎的釜山三天兩夜經典行程！完整串聯海雲台、機張海東龍宮寺、廣安里、新世界 Centum City、西面田浦咖啡街、南浦洞、甘川洞文化村與影島。',
      ZH_CN: '最受欢迎的釜山三天两夜经典自由行路线！完整串联海云台、机张海东龙宫寺、广安里、新世界 Centum City、西面田浦咖啡街、南浦洞、甘川文化村与影岛。',
      ES: 'El itinerario de 3 días más completo por Busán: Haeundae, Templo Haedong Yonggungsa en Gijang, Gwangalli, Centum City, Seomyeon, Nampo-dong, Gamcheon y Yeongdo.',
      FR: 'L’itinéraire de 3 jours le plus complet à Busan : Haeundae, Temple Haedong Yonggungsa à Gijang, Gwangalli, Centum City, Seomyeon, Nampo-dong, Gamcheon et Yeongdo.',
    },
    h1: {
      KR: '부산 2박 3일 완전정복 추천 코스',
      EN: '3-Day 2-Night Complete Busan Itinerary',
      JA: '釜山2泊3日王道おすすめモデルコース',
      ZH_TW: '釜山三天兩夜自由行經典推薦行程',
      ZH_CN: '釜山三天两夜自由行经典推荐路线',
      ES: 'Itinerario Completo de 3 Días en Busán',
      FR: 'Itinéraire Complet de 3 Jours à Busan',
    },
  },
  '3NIGHTS': {
    title: {
      KR: '부산 3박 4일 여유로운 가족·효도 여행 추천 코스 | 스탭리스 Stepless',
      EN: '4-Day 3-Night Relaxed Busan Itinerary for Families, Couples & Seniors | Stepless',
      JA: '釜山3泊4日ゆったりモデルコース（家族旅行・親孝行・温泉・海辺散策） | Stepless',
      ZH_TW: '釜山四天三夜深度自由行推薦行程（親子家庭・帶長輩孝親遊・海景與溫泉） | Stepless',
      ZH_CN: '釜山四天三晚深度自由行推荐路线（亲子家庭・带父母旅游・海景与温泉） | Stepless',
      ES: 'Itinerario de 4 Días y 3 Noches en Busán: Viaje Relajado en Familia | Stepless',
      FR: 'Itinéraire de 4 Jours et 3 Nuits à Busan : Voyage Détente en Famille | Stepless',
    },
    description: {
      KR: '부모님 효도여행·아이 동반 가족여행에 최적화된 여유로운 3박 4일 부산 코스. 해변 산책로, 스카이캡슐, 유람선/요트, 온천·스파, 미술관과 전통시장을 무리 없이 둘러봅니다.',
      EN: 'A relaxed 4-day 3-night Busan trip itinerary ideal for families with kids or seniors: scenic coastal boardwalks, Sky Capsule, hot spring spas, museums, and seafood markets.',
      JA: '子連れ家族旅行や親孝行旅行に最適なゆったり巡る釜山3泊4日モデルコース。海辺の平坦な散策路、スカイカプセル、温泉・スパ、美術館、伝統市場を無理のないペースで楽しめます。',
      ZH_TW: '專為親子家庭與帶長輩孝親遊設計的釜山四天三夜輕鬆行程：結合平坦海濱步道、膠囊列車、遊艇、新世界 Spa Land 汗蒸幕、博物館與海鮮市場，步調從容不趕路。',
      ZH_CN: '专为亲子家庭与带父母出游设计的釜山四天三晚轻松路线：结合平坦海滨步道、胶囊小火车、游艇、新世界 Spa Land 汗蒸幕、博物馆与海鲜市场，节奏从容舒适。',
      ES: 'Itinerario relajado de 4 días en Busán ideal para familias con niños o personas mayores: paseos marítimos llanos, Sky Capsule, aguas termales, museos y mercados.',
      FR: 'Itinéraire détente de 4 jours à Busan idéal en famille avec enfants ou seniors : promenades côtières plates, Sky Capsule, spas thermaux, musées et marchés.',
    },
    h1: {
      KR: '부산 3박 4일 여유로운 힐링 코스',
      EN: '4-Day 3-Night Relaxed Busan Itinerary',
      JA: '釜山3泊4日ゆったり癒しモデルコース',
      ZH_TW: '釜山四天三夜深度慢活自由行行程',
      ZH_CN: '釜山四天三晚深度慢享自由行路线',
      ES: 'Itinerario de 4 Días y 3 Noches en Busán',
      FR: 'Itinéraire de 4 Jours et 3 Nuits à Busan',
    },
  },
  '4NIGHTS': {
    title: {
      KR: '부산 4박 5일 전 지역 일주 여행 추천 코스 (동부산·원도심·서부산 다대포) | 스탭리스 Stepless',
      EN: '5-Day 4-Night Grand Busan Trip Itinerary (All Regions & Hidden Gems) | Stepless',
      JA: '釜山4泊5日全エリア完全制覇モデルコース（機張・海雲台・広安里・西面・南浦・多大浦） | Stepless',
      ZH_TW: '釜山五天四夜全區深度自由行行程（機張・海雲台・廣安里・西面・南浦・松島・多大浦） | Stepless',
      ZH_CN: '釜山五天四晚全区深度自由行路线（机张・海云台・广安里・西面・南浦・松岛・多大浦） | Stepless',
      ES: 'Itinerario de 5 Días y 4 Noches en Busán: Gran Ruta por Todas las Regiones | Stepless',
      FR: 'Itinéraire de 5 Jours et 4 Nuits à Busan : Grand Tour de Toutes les Régions | Stepless',
    },
    description: {
      KR: '동부산(기장·송정·해운대·광안리), 도심(서면·전포·동래 온천), 원도심(남포·자갈치·영도·감천), 서부산(송도·다대포 낙조분수·을숙도)까지 부산 전역을 일주하는 4박 5일 코스.',
      EN: 'Explore every corner of Busan in 5 days and 4 nights: East Busan (Gijang, Songjeong, Haeundae, Gwangalli), Seomyeon & Dongnae, Old Town & Yeongdo, and West Busan (Songdo, Dadaepo Sunset).',
      JA: '東釜山（機張・松亭・海雲台・広安里）、都心（西面・田浦・東莱温泉）、旧都心（南浦・影島・甘川）、西釜山（松島・多大浦夕日噴水・乙淑島）まで釜山全域を巡る4泊5日完全ガイド。',
      ZH_TW: '五天四夜徹底玩遍釜山全區：涵蓋東釜山（機張・松亭・海雲台・廣安里）、市中心（西面・田浦・東萊溫泉）、舊城區（南浦・影島・甘川洞）與西釜山（松島纜車・多大浦夕陽噴泉・乙淑島）。',
      ZH_CN: '五天四晚彻底玩遍釜山全区：涵盖东釜山（机张・松亭・海云台・广安里）、市中心（西面・田浦・东莱温泉）、老城区（南浦・影岛・甘川洞）与西釜山（松岛缆车・多大浦夕阳喷泉・乙淑岛）。',
      ES: 'Recorre todas las regiones de Busán en 5 días y 4 noches: Este (Gijang, Haeundae, Gwangalli), Centro (Seomyeon, Dongnae), Casco Antiguo (Nampo, Yeongdo) y Oeste (Songdo, Dadaepo).',
      FR: 'Explorez toutes les régions de Busan en 5 jours et 4 nuits : Est (Gijang, Haeundae, Gwangalli), Centre (Seomyeon, Dongnae), Vieille Ville (Nampo, Yeongdo) et Ouest (Songdo, Dadaepo).',
    },
    h1: {
      KR: '부산 4박 5일 전 지역 일주 코스',
      EN: '5-Day 4-Night Grand Busan Itinerary',
      JA: '釜山4泊5日全エリア周遊モデルコース',
      ZH_TW: '釜山五天四夜全區深度自由行行程',
      ZH_CN: '釜山五天四晚全区深度自由行路线',
      ES: 'Gran Itinerario de 5 Días por Busán',
      FR: 'Grand Itinéraire de 5 Jours à Busan',
    },
  },
  SUBWAY: {
    title: {
      KR: '부산 지하철 1·2호선 역세권 무장애 여행 코스 | 스탭리스 Stepless',
      EN: 'Busan Subway Line 1 & 2 Step-Free Travel Course & Station Attractions | Stepless',
      JA: '釜山地下鉄1・2号線で巡る駅近観光モデルコース＆エレベーター出口案内 | Stepless',
      ZH_TW: '搭釜山地鐵 1・2 號線玩遍釜山：車站周邊景點＆無障礙電梯出口路線 | Stepless',
      ZH_CN: '坐釜山地铁 1・2 号线玩遍釜山：车站周边景点＆无障碍电梯出口路线 | Stepless',
      ES: 'Ruta Turística en el Metro de Busán (Líneas 1 y 2 Sin Escalones) | Stepless',
      FR: 'Circuit Touristique en Métro à Busan (Lignes 1 et 2 Sans Marche) | Stepless',
    },
    description: {
      KR: '렌터카 없이 부산 지하철 1호선(다대포~자갈치~남포~부산역~서면~동래~범어사)과 2호선(장산~해운대~센텀~광안~서면) 엘리베이터 출구만으로 여행하는 역세권 코스.',
      EN: 'Travel across Busan without a car using only step-free elevator exits along Busan Metro Line 1 (Dadaepo, Jagalchi, Nampo, Busan Stn, Seomyeon) and Line 2 (Haeundae, Centum, Gwangan).',
      JA: 'レンタカーやタクシーなしで釜山地下鉄1号線（多大浦〜チャガルチ〜南浦〜釜山駅〜西面〜梵魚寺）と2号線（海雲台〜センタム〜広安〜西面）のエレベーター出口だけで巡る駅近観光コース。',
      ZH_TW: '免租車！單靠釜山地鐵 1 號線（多大浦・札嘎其・南浦・釜山站・西面・梵魚寺）與 2 號線（海雲台・Centum City・廣安・西面）電梯出口就能輕鬆暢遊的車站周邊景點路線。',
      ZH_CN: '免租车！单靠釜山地铁 1 号线（多大浦・札嘎其・南浦・釜山站・西面・梵鱼寺）与 2 号线（海云台・Centum City・广安・西面）电梯出口就能轻松畅游的车站周边景点路线。',
      ES: 'Viaja por Busán sin coche utilizando únicamente las salidas con ascensor de la Línea 1 (Dadaepo, Jagalchi, Nampo, Estación de Busán, Seomyeon) y la Línea 2 (Haeundae, Gwangalli).',
      FR: 'Voyagez dans Busan sans voiture grâce aux sorties avec ascenseur de la Ligne 1 (Dadaepo, Jagalchi, Nampo, Gare de Busan, Seomyeon) et de la Ligne 2 (Haeundae, Gwangalli).',
    },
    h1: {
      KR: '부산 지하철 1·2호선 역세권 여행 코스',
      EN: 'Busan Subway Line 1 & 2 Step-Free Travel Course',
      JA: '釜山地下鉄1・2号線 駅近観光モデルコース',
      ZH_TW: '釜山地鐵 1・2 號線沿線景點旅遊路線',
      ZH_CN: '釜山地铁 1・2 号线沿线景点旅游路线',
      ES: 'Ruta Turística en Metro por Busán (Líneas 1 y 2)',
      FR: 'Circuit Touristique en Métro à Busan (Lignes 1 et 2)',
    },
  },
};

function buildLocalizedCoursePage(course: ItineraryCourse, cleanRoutePath: string, lang: Language): StaticRoutePage {
  const catMeta = COURSE_CATEGORY_SEO_META[course.category];
  const courseTitle = catMeta ? catMeta.h1[lang] : trEn(course.titleEn, lang);
  const courseSub = trEn(course.subtitleEn, lang);
  const courseTip = trEn(course.overallTipEn, lang);

  const title = catMeta
    ? catMeta.title[lang]
    : pickLang(lang, {
        KR: `${course.titleKo} | 스탭리스 Stepless`,
        EN: `${course.titleEn} — Busan Travel Itinerary & Step-Free Guide | Stepless`,
        JA: `${courseTitle}｜釜山旅行おすすめモデルコース＆バリアフリー観光ガイド | Stepless`,
        ZH_TW: `${courseTitle}｜釜山自由行推薦行程＆無障礙旅遊指南 | Stepless`,
        ZH_CN: `${courseTitle}｜釜山自由行推荐路线＆无障碍旅游攻略 | Stepless`,
        ES: `${courseTitle} — Itinerario de Viaje a Busan y Guía Sin Escalones | Stepless`,
        FR: `${courseTitle} — Itinéraire de Voyage à Busan et Guide Sans Marche | Stepless`,
      });

  const description = catMeta
    ? catMeta.description[lang]
    : pickLang(lang, {
        KR: `${course.subtitleKo} — ${course.overallTipKo}`,
        EN: `${course.titleEn}: ${courseSub} — ${courseTip}`,
        JA: `【釜山おすすめモデルコース】${courseTitle}：${courseSub} — ${courseTip}`,
        ZH_TW: `【釜山自由行推薦行程】${courseTitle}：${courseSub} — ${courseTip}`,
        ZH_CN: `【釜山自由行推荐路线】${courseTitle}：${courseSub} — ${courseTip}`,
        ES: `[Itinerario Recomendado en Busan] ${courseTitle}: ${courseSub} — ${courseTip}`,
        FR: `[Itinéraire Recommandé à Busan] ${courseTitle} : ${courseSub} — ${courseTip}`,
      });

  const stepsHtml = course.steps.length > 0
    ? course.steps.map((step, idx) => {
        const sTitle = trEn(step.titleEn, lang);
        const sDesc = trEn(step.descEn, lang);
        const sTip = trEn(step.tipEn || step.accessibilityDescEn, lang);
        const sAddr = trEn(step.addressRoadEn || step.addressEn, lang);
        const sStation = trEn(step.stationInfoEn, lang);
        return `
            <article style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 14px; padding: 18px; margin-bottom: 16px;">
              <h3 style="font-size: 18px; font-weight: 800; color: #11161B; margin: 0 0 6px 0;">${idx + 1}. ${escapeHtml(sTitle)}</h3>
              ${sStation || sAddr ? `<p style="font-size: 13px; color: #5B7332; font-weight: 700; margin: 0 0 8px 0;">${escapeHtml(sStation)} ${sAddr ? `· ${escapeHtml(sAddr)}` : ''}</p>` : ''}
              <p style="font-size: 14px; color: #334155; margin: 0 0 8px 0;">${escapeHtml(sDesc)}</p>
              ${sTip ? `<p style="font-size: 13px; color: #1E293B; background: #F4F6F0; padding: 10px 12px; border-radius: 8px; margin: 0;"><strong>Tip:</strong> ${escapeHtml(sTip)}</p>` : ''}
            </article>`;
      }).join('\n')
    : STATIONS.map((st, idx) => {
        const stTitle = getLocalizedStationTitle(st, lang);
        const loc = getStationLocalized(st, lang);
        const recExits = loc ? loc.recommendedExits : (st.recommendedExitsEn || '');
        const elevDesc = loc ? loc.elevatorLocationDesc : (st.elevatorLocationDescEn || '');
        const stHref = buildLocalizedPath(`/station/${st.id}`, lang);
        return `
            <article style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 14px; padding: 18px; margin-bottom: 16px;">
              <h3 style="font-size: 18px; font-weight: 800; color: #11161B; margin: 0 0 6px 0;">${idx + 1}. <a href="${escapeHtml(stHref)}">${escapeHtml(stTitle)}</a></h3>
              <p style="font-size: 13px; color: #5B7332; font-weight: 700; margin: 0 0 8px 0;">${escapeHtml(recExits)}</p>
              <p style="font-size: 14px; color: #334155; margin: 0;">${escapeHtml(elevDesc)}</p>
            </article>`;
      }).join('\n');

  return {
    routePath: buildLocalizedPath(cleanRoutePath, lang),
    title,
    description,
    h1: courseTitle,
    lead: description,
    bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">${escapeHtml(courseTitle)}</h2>
            <p style="font-size: 14px; color: #475569; margin-bottom: 0;">${escapeHtml(description)}</p>
          </section>
          <section style="margin-bottom: 24px;">
            ${stepsHtml}
          </section>`,
  };
}

function buildLocalizedBarrierFreePage(cleanRoutePath: string, lang: Language): StaticRoutePage {
  const isCourseAlias = cleanRoutePath === '/tips/courses/barrier-free';
  const title = isCourseAlias
    ? pickLang(lang, {
        KR: '부산 무장애 추천 여행 코스 | 스탭리스 Stepless',
        EN: 'Accessible Busan Travel Itinerary — Step-Free & Wheelchair Tour Course | Stepless',
        JA: '釜山バリアフリーモデルコース｜車椅子・ベビーカー向け段差なし観光日程 | Stepless',
        ZH_TW: '釜山無障礙推薦旅遊行程｜輪椅・嬰兒車免爬樓梯觀光路線 | Stepless',
        ZH_CN: '釜山无障碍推荐旅游路线｜轮椅・婴儿车免爬楼梯观光行程 | Stepless',
        ES: 'Itinerario Accesible por Busan — Ruta Turística en Silla de Ruedas y Cochecito | Stepless',
        FR: 'Itinéraire Accessible à Busan — Circuit Touristique Fauteuil Roulant et Poussette | Stepless',
      })
    : pickLang(lang, {
        KR: '부산 무장애 열린관광지 가이드 | 스탭리스 Stepless',
        EN: 'Wheelchair & Stroller Accessible Busan — 22 Verified Barrier-Free Attractions | Stepless',
        JA: '釜山バリアフリー観光スポット完全ガイド（全22ヶ所・韓国観光公社検証済）| Stepless',
        ZH_TW: '釜山無障礙觀光景點完整指南（22處韓國觀光公社認證景點）| Stepless',
        ZH_CN: '釜山无障碍旅游景点完整指南（22处韩国观光公社认证景点）| Stepless',
        ES: 'Guía de Atracciones Accesibles en Busan Sin Escalones (22 Lugares Verificados) | Stepless',
        FR: 'Guide des Attractions Accessibles Sans Marche à Busan (22 Sites Vérifiés) | Stepless',
      });

  const description = isCourseAlias
    ? pickLang(lang, {
        KR: '부산 무장애 추천 여행 코스 안내.',
        EN: 'Step-by-step wheelchair and stroller-friendly Busan travel itinerary connecting flat coastal boardwalks, accessible museums, and subway elevator exits.',
        JA: '車椅子利用者・ベビーカー同伴のご家族・シニア旅行者向けに、平坦な海辺ボードウォークや地下鉄エレベーター出口を結ぶ釜山バリアフリー旅行コースをご案内します。',
        ZH_TW: '專為輪椅使用者、推嬰兒車家庭與長輩設計的釜山無障礙推薦行程，串聯平坦海濱木棧道、無障礙博物館與地鐵電梯出口。',
        ZH_CN: '专为轮椅使用者、推婴儿车家庭与长辈设计的釜山无障碍推荐路线，串联平坦海滨木栈道、无障碍博物馆与地铁直梯出口。',
        ES: 'Itinerario paso a paso por Busan para sillas de ruedas y cochecitos, conectando paseos marítimos planos, museos accesibles y salidas de metro con ascensor.',
        FR: 'Itinéraire étape par étape à Busan pour fauteuils roulants et poussettes, reliant promenades côtières plates, musées accessibles et sorties de métro avec ascenseur.',
      })
    : pickLang(lang, {
        KR: '부산 무장애 열린관광지 상세 가이드.',
        EN: 'Official Korea Tourism Organization (TourAPI) verified guide to 22 barrier-free Busan attractions: step-free ramps, elevators, accessible restrooms, and wheelchair/stroller rentals.',
        JA: '韓国観光公社(TourAPI)データと現地調査に基づく釜山バリアフリー観光名所22選。スロープ、エレベーター、多目的トイレ、車椅子・ベビーカー貸出情報を網羅。',
        ZH_TW: '依據韓國觀光公社(TourAPI)與實地勘查整理的 22 處釜山無障礙景點指南：斜坡通道、電梯、無障礙廁所與輪椅・嬰兒車租借資訊。',
        ZH_CN: '依据韩国观光公社(TourAPI)与实地勘查整理的 22 处釜山无障碍景点指南：坡道、电梯、无障碍卫生间与轮椅・婴儿车租借信息。',
        ES: 'Guía verificada por la Organización de Turismo de Corea (TourAPI) de 22 atracciones sin barreras en Busan: rampas, ascensores, baños accesibles y alquiler de sillas de ruedas.',
        FR: 'Guide vérifié par l’Organisation du Tourisme de Corée (TourAPI) de 22 sites sans barrières à Busan : rampes, ascenseurs, toilettes accessibles et location de fauteuils roulants.',
      });

  const spotsHtml = BUSAN_TOUR_API_SPOTS.map((spot, i) => {
    const sTitle = trEn(spot.titleEn, lang);
    const sDistrict = trEn(spot.districtEn, lang);
    const sAddr = trEn(spot.addr1En, lang);
    const sOverview = trEn(spot.overviewEn, lang);
    const sStationHref = buildLocalizedPath(`/station/${spot.nearestStationId}`, lang);
    const sStationName = trEn(spot.nearestStationNameEn, lang);
    const sExit = trEn(spot.recommendedElevatorExitEn, lang);
    const rDesc = trEn(spot.barrierFree.route.descEn, lang);
    const eDesc = trEn(spot.barrierFree.elevator.descEn, lang);
    const tDesc = trEn(spot.barrierFree.toilet.descEn, lang);
    const wDesc = trEn(spot.barrierFree.wheelchair.descEn, lang);
    const stDesc = trEn(spot.barrierFree.stroller.descEn, lang);
    const pDesc = trEn(spot.barrierFree.parking.descEn, lang);
    const tipDesc = trEn(spot.transitTipEn, lang);

    return `
            <article style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 14px; padding: 18px; margin-bottom: 16px;">
              <h3 style="font-size: 18px; font-weight: 800; color: #11161B; margin: 0 0 6px 0;">
                ${i + 1}. ${escapeHtml(sTitle)} — ${escapeHtml(sDistrict)}
              </h3>
              <p style="font-size: 13px; color: #5B7332; font-weight: 700; margin: 0 0 8px 0;">
                ${escapeHtml(sAddr)} · Subway: <a href="${escapeHtml(sStationHref)}">${escapeHtml(sStationName)}</a> (${escapeHtml(sExit)})
              </p>
              <p style="font-size: 14px; color: #334155; margin: 0 0 10px 0;">${escapeHtml(sOverview)}</p>
              <ul style="font-size: 13px; color: #1E293B; background: #F4F6F0; padding: 12px 16px 12px 32px; border-radius: 8px; margin: 0;">
                <li><strong>Step-Free Route:</strong> ${escapeHtml(rDesc)}</li>
                <li><strong>Elevator:</strong> ${escapeHtml(eDesc)}</li>
                <li><strong>Accessible Restroom:</strong> ${escapeHtml(tDesc)}</li>
                <li><strong>Wheelchair / Stroller:</strong> ${escapeHtml(wDesc)} / ${escapeHtml(stDesc)}</li>
                <li><strong>Accessible Parking:</strong> ${escapeHtml(pDesc)}</li>
                <li><strong>Transit Tip:</strong> ${escapeHtml(tipDesc)}</li>
              </ul>
            </article>`;
  }).join('\n');

  const h1 = title.replace(/\s*\|\s*Stepless.*$/i, '');
  return {
    routePath: buildLocalizedPath(cleanRoutePath, lang),
    title,
    description,
    h1,
    lead: description,
    bodyHtml: `
          <section style="margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; color: #11161B; margin-bottom: 14px;">${escapeHtml(h1)} (${BUSAN_TOUR_API_SPOTS.length} Verified Spots)</h2>
            ${spotsHtml}
          </section>`,
  };
}

interface MultilingualRouteMeta {
  title: Record<Exclude<Language, 'KR'>, string>;
  description: Record<Exclude<Language, 'KR'>, string>;
  sections: Array<{
    headingEn: string;
    paragraphsEn: string[];
    bulletsEn?: string[];
  }>;
}

const HUB_AND_ARTICLE_META: Record<string, MultilingualRouteMeta> = {
  '/search': {
    title: {
      EN: 'Busan Subway Elevator Directory (22 Major Stations) & Step-Free Exit Map | Stepless',
      JA: '釜山地下鉄 主要22駅エレベーター出口＆バリアフリー乗換ディレクトリ | Stepless',
      ZH_TW: '釜山地鐵 22 個主要車站電梯出口＆無障礙轉乘總覽 | Stepless',
      ZH_CN: '釜山地铁 22 个主要车站无障碍直梯出口＆换乘名录 | Stepless',
      ES: 'Directorio de Ascensores del Metro de Busan (22 Estaciones Principales) | Stepless',
      FR: 'Répertoire des Ascenseurs du Métro de Busan (22 Stations Principales) | Stepless',
    },
    description: {
      EN: 'Compare elevator and escalator exit numbers, accessible restrooms, and step-free transfer pathways across all 22 major Busan subway stations including Seomyeon, Busan Station, Haeundae, Gwangan, and Nampo.',
      JA: '西面駅・釜山駅・海雲台駅・広安駅・南浦駅・チャガルチ駅など釜山地下鉄主要22駅の地上直結エレベーター出口番号、エスカレーター、多目的トイレ、乗換ルートを一覧比較。',
      ZH_TW: '一次比較西面站、釜山站、海雲台站、廣安站、南浦站、札嘎其站等釜山 22 個主要地鐵站的地面電梯出口編號、電扶梯、無障礙廁所與轉乘動線。',
      ZH_CN: '一览比较西面站、釜山站、海云台站、广安站、南浦站、札嘎其站等釜山 22 个主要地铁站的地面直梯出口编号、扶梯、无障碍卫生间与换乘路线。',
      ES: 'Compara los números de salida con ascensor, escaleras mecánicas, baños accesibles y rutas de transbordo sin escalones en las 22 principales estaciones del metro de Busan.',
      FR: 'Comparez les numéros de sortie avec ascenseur, escalators, toilettes accessibles et correspondances sans marche dans les 22 principales stations du métro de Busan.',
    },
    sections: [],
  },
  '/tips/courses': {
    title: {
      EN: 'Busan Travel Itineraries Hub: 8 Themes & 1 to 5-Day Trip Plans | Stepless',
      JA: '釜山おすすめモデルコース総まとめ（グルメ・観光・市場・日帰り〜4泊5日）| Stepless',
      ZH_TW: '釜山自由行推薦行程總整理（美食・景點・傳統市場・一日遊至五天四夜）| Stepless',
      ZH_CN: '釜山自由行推荐路线汇总（美食・景点・传统市场・一日游至五天四晚）| Stepless',
      ES: 'Itinerarios Recomendados por Busan: Gastronomía, Atracciones y Planes de 1 a 5 Días | Stepless',
      FR: 'Itinéraires Recommandés à Busan : Gastronomie, Sites et Circuits de 1 à 5 Jours | Stepless',
    },
    description: {
      EN: 'Explore all curated Busan travel courses: local food & ocean-view cafes, museums & cultural spaces, traditional markets, top attractions, and 1-day to 5-day step-free Busan itineraries.',
      JA: '現地エディターが検証した釜山グルメ、博物館・体験、伝統市場、定番観光スポット、日帰り・1泊2日・2泊3日・3泊4日・4泊5日の日程別モデルコース一覧。',
      ZH_TW: '探索釜山在地編輯實地驗證的美食餐廳、博物館體驗、傳統市場、必去景點，以及一日遊、兩天一夜、三天兩夜、四天三夜、五天四夜完整推薦行程。',
      ZH_CN: '探索釜山在地编辑实地验证的地道美食、博物馆体验、传统市场、必去景点，以及一日游、两天一夜、三天两夜、四天三晚、五天四晚完整推荐路线。',
      ES: 'Explora todos los itinerarios verificados por Busan: gastronomía local, museos, mercados tradicionales, atracciones imprescindibles y rutas de 1 a 5 días sin escalones.',
      FR: 'Découvrez tous nos itinéraires vérifiés à Busan : gastronomie locale, musées, marchés traditionnels, sites incontournables et circuits de 1 à 5 jours sans marche.',
    },
    sections: [],
  },
  '/tips': {
    title: {
      EN: 'Busan Travel Guide Hub: Subway Transfers, Child Fare Free & Local Tips | Stepless',
      JA: '釜山旅行総合ガイド：地下鉄・バス乗換、子供料金無料、現地お役立ち情報 | Stepless',
      ZH_TW: '釜山旅遊綜合指南：地鐵公車轉乘、兒童免費搭車與在地實用攻略 | Stepless',
      ZH_CN: '釜山旅游综合指南：地铁公交换乘、儿童免费乘车与本地实用攻略 | Stepless',
      ES: 'Guía General de Viaje a Busan: Transporte Público, Consejos Locales y Rutas | Stepless',
      FR: 'Guide Général de Voyage à Busan : Transports Publics, Conseils Locaux et Itinéraires | Stepless',
    },
    description: {
      EN: 'Essential Busan travel guide covering 30-minute free subway-bus transfers, oversized luggage bus rules, free transit fares for children, mobile QR bus payment, accessible taxis, and free luggage storage.',
      JA: '初めての釜山旅行からベビーカー・車椅子・スーツケース同伴の家族旅行まで必見の釜山公共交通乗換ルール、子供運賃無料制度、無料荷物預かり所、おすすめコース総合ハブ。',
      ZH_TW: '從首次造訪釜山的旅客到推嬰兒車、輪椅、攜帶大件行李的家庭必看：釜山大眾運輸免費轉乘規定、兒童免費搭車、免費寄放行李處與推薦行程總覽。',
      ZH_CN: '从首次造访釜山的游客到推婴儿车、轮椅、携带大件行李的家庭必看：釜山公共交通免费换乘规定、儿童免费乘车、免费行李寄存处与推荐路线总览。',
      ES: 'Guía esencial para viajar a Busan: transbordos gratuitos entre metro y autobús, normativa de maletas, transporte gratuito para niños, taxis accesibles y consignas gratuitas.',
      FR: 'Guide essentiel pour voyager à Busan : correspondances gratuites métro-bus, règles pour les bagages, gratuité pour les enfants, taxis accessibles et consignes gratuites.',
    },
    sections: [
      {
        headingEn: 'Essential Busan Travel Guides & Local Tips',
        paragraphsEn: [
          'Welcome to the Stepless in Busan Travel Guide Hub. Whether you are visiting Busan for the first time or traveling with a stroller, wheelchair, senior family members, or heavy suitcases, our field-verified guides help you navigate Busan smoothly without stairs or transit surprises.',
        ],
        bulletsEn: [
          'Busan Public Transit 5 Essential Rules: 30-minute free transfer between subway and buses, plus oversized suitcase restrictions on city buses.',
          'Free Public Transit for Children (Ages 6–12): How to register a children’s transit card for 0 KRW subway and bus rides across Busan.',
          'Busan City Bus Mobile QR Payment: How to pay bus fare without cash or a physical T-money card.',
          'Busan Taxis & Wheelchair Accessible Duribal Van Guide: Call taxis, jumbo vans for luggage, and special wheelchair transport.',
          'Busan Exploration Local Magazine: 4 free luggage storage lounges, free stroller & wheelchair rentals, and the 10-minute free subway platform re-entry rule.',
        ],
      },
    ],
  },
  '/my-route': {
    title: {
      EN: 'Custom Busan Trip Route Planner & One-Click Transit Navigator | Stepless',
      JA: 'マイルート作成（カスタム釜山旅行プランナー＆乗換ナビ連携）| Stepless',
      ZH_TW: '我的旅遊路線規劃器（自訂釜山自由行行程＆一鍵大眾運輸導航）| Stepless',
      ZH_CN: '我的旅游路线规划器（自定义釜山自由行行程＆一键公共交通导航）| Stepless',
      ES: 'Planificador Personalizado de Rutas por Busan y Navegador de Transporte | Stepless',
      FR: 'Planificateur d’Itinéraire Personnalisé à Busan et Navigateur de Transport | Stepless',
    },
    description: {
      EN: 'Build your own custom Busan travel itinerary by adding restaurants, landmarks, and markets, calculate stop-by-stop distances, and launch Google Maps or Naver Map transit directions in one click.',
      JA: '釜山の観光名所・グルメ・カフェ・伝統市場をマイルートに追加して順番を並び替え、スポット間の距離計算やGoogleマップ・NAVERマップのリアルタイム公共交通ルート検索をワンクリックで実行できます。',
      ZH_TW: '將釜山景點、美食餐廳、咖啡廳與傳統市場加入專屬旅遊路線，自由調整順序、計算各站直線距離，並一鍵開啟 Google Maps 或 Naver Map 大眾運輸路線導航。',
      ZH_CN: '将釜山景点、美食餐厅、咖啡厅与传统市场加入专属旅游路线，自由调整顺序、计算各站直线距离，并一键开启 Google Maps 或 Naver Map 公共交通路线导航。',
      ES: 'Crea tu propio itinerario por Busan añadiendo restaurantes, mercados y atracciones, calcula distancias entre paradas y abre rutas de transporte público en Google Maps con un clic.',
      FR: 'Créez votre propre itinéraire à Busan en ajoutant restaurants, marchés et sites touristiques, calculez les distances entre les étapes et lancez Google Maps en un clic.',
    },
    sections: [
      {
        headingEn: 'How to Use the Custom Busan Trip Route Planner',
        paragraphsEn: [
          'The Stepless Custom Route Planner lets you combine stops from any of our 8 curated Busan travel courses into a single personalized day-by-day route.',
        ],
        bulletsEn: [
          'Add & Reorder Stops: Click Add to Route on any restaurant, museum, market, or coastal landmark card to save it to your interactive map.',
          'Automatic Leg Distance Calculation: Instantly see the exact distance between consecutive stops based on verified GPS coordinates to avoid backtracking.',
          'One-Click Transit Navigation: Launch real-time bus and subway directions between any two stops in Google Maps (for international travelers) or Naver Map (for Korean transit timetables).',
          'Step-Free Subway Pairing: Check the nearest elevator exit number for every stop so stroller, wheelchair, and luggage travelers can move without stairs.',
        ],
      },
    ],
  },
  '/schedule': {
    title: {
      EN: 'Busan Festivals & Monthly Events Calendar (Gwangalli Drone Show & Fireworks) | Stepless',
      JA: '釜山イベント・祭り月別カレンダー（広安里Mドローンショー・花火大会・映画祭）| Stepless',
      ZH_TW: '釜山節慶活動月曆（廣安里無人機秀・釜山煙火節・國際電影節）＆無障礙觀賞指南 | Stepless',
      ZH_CN: '釜山节庆活动月历（广安里无人机秀・釜山烟花节・国际电影节）＆无障碍观赏指南 | Stepless',
      ES: 'Calendario Mensual de Festivales y Eventos en Busan (Show de Drones en Gwangalli) | Stepless',
      FR: 'Calendrier Mensuel des Festivals et Événements à Busan (Spectacle de Drones à Gwangalli) | Stepless',
    },
    description: {
      EN: 'Monthly schedule and wheelchair/stroller viewing guide for top Busan events: Saturday Gwangalli M Drone Light Show, Haeundae Sand Festival, Busan Sea Festival, BIFF, and Busan Fireworks Festival.',
      JA: '毎週土曜開催の広安里Mドローンライトショー公演時間から、海雲台砂祭り、釜山港祭り、釜山海祭り、釜山国際映画祭(BIFF)、釜山花火大会まで月別スケジュールと地下鉄エレベーター移動ルートを案内。',
      ZH_TW: '整理每週六常設廣安里 M 無人機燈光秀演出時間、海雲台沙雕節、釜山港節、釜山海洋節、釜山國際電影節(BIFF)、釜山煙火節等月別活動日程與無障礙觀賞動線。',
      ZH_CN: '整理每周六常设广安里 M 无人机灯光秀演出时间、海云台沙雕节、釜山港节、釜山海洋节、釜山国际电影节(BIFF)、釜山烟花节等月度活动日程与无障碍观赏路线。',
      ES: 'Calendario mensual y guía de acceso sin escalones para los grandes eventos de Busan: espectáculo semanal de drones en Gwangalli, Festival de Arena de Haeundae, BIFF y Festival de Fuegos Artificiales.',
      FR: 'Calendrier mensuel et accès sans marche aux grands événements de Busan : spectacle de drones du samedi à Gwangalli, Festival du Sable de Haeundae, BIFF et Festival Pyrotechnique.',
    },
    sections: [
      {
        headingEn: 'Year-Round & Seasonal Busan Festival Guide',
        paragraphsEn: [
          'Busan hosts iconic seaside festivals throughout the year. Use our step-free subway exit recommendations below to enjoy major events comfortably even during peak crowds.',
        ],
        bulletsEn: [
          'Gwangalli M Drone Light Show (Every Saturday Year-Round): Held twice every Saturday evening over Gwangalli Beach (20:00 & 22:00 Apr–Sep; 19:00 & 21:00 Oct–Mar). Take Line 2 Gwangan Station Exit 3 or Exit 5 elevator for a flat walk to the beachfront promenade.',
          'Spring & Summer Festivals (May–August): Haeundae Sand Festival (Haeundae Station Exit 1/3 elevator to Gunam-ro Plaza), Busan Port Festival, Busan Sea Festival, and Dadaepo Sunset Fountain of Dreams (Dadaepo Beach Station Exit 2/4 elevator).',
          'Autumn & Winter Festivals (September–January): Busan International Film Festival (BIFF at Centum City Station & Jagalchi Station), Busan International Rock Festival (Sasang Station), Busan Fireworks Festival (November at Gwangalli Beach), and Haeundae Light Festival (December–January).',
        ],
      },
    ],
  },
  '/tips/transit': {
    title: {
      EN: 'Busan Public Transit 5 Essential Rules: Free Transfers & Suitcase Policy | Stepless',
      JA: '釜山公共交通の重要ルール5選：地下鉄・バス30分無料乗換＆大型スーツケース規定 | Stepless',
      ZH_TW: '釜山大眾運輸 5 大必知規則：地鐵公車 30 分鐘免費轉乘＆大型行李箱上車規定 | Stepless',
      ZH_CN: '釜山公共交通 5 大必知规则：地铁公交 30 分钟免费换乘＆大件行李箱乘车规定 | Stepless',
      ES: '5 Reglas del Transporte Público en Busan: Transbordos Gratuitos y Normativa de Maletas | Stepless',
      FR: '5 Règles des Transports Publics à Busan : Correspondances Gratuites et Bagages | Stepless',
    },
    description: {
      EN: 'Everything you need to know about Busan public transit: 30-minute free transfers between subway and city buses, 24–28 inch suitcase restrictions on buses, low-floor buses, and subway luggage lockers.',
      JA: '釜山地下鉄と市内バス・マウルバスの30分以内無料乗換システム、大型スーツケースの市内バス持ち込み制限、ノンステップバスの確認方法、主要駅コインロッカー(T-Luggage)活用法を詳しく解説。',
      ZH_TW: '詳解釜山地鐵與市區公車・社區巴士 30 分鐘內免費轉乘規定、24～28 吋大型行李箱搭乘公車限制、低底盤公車查詢方式與地鐵站行李寄物櫃(T-Luggage)指南。',
      ZH_CN: '详解釜山地铁与市区公交・社区巴士 30 分钟内免费换乘规定、24～28 寸大件行李箱乘坐公交限制、低地板公交查询方式与地铁站行李寄存柜(T-Luggage)指南。',
      ES: 'Todo sobre el transporte público en Busan: transbordos gratuitos en 30 minutos entre metro y autobús, restricciones de maletas grandes en autobuses, autobuses de piso bajo y consignas.',
      FR: 'Tout savoir sur les transports à Busan : correspondances gratuites en 30 minutes entre métro et bus, restrictions pour les grandes valises dans les bus, bus à plancher bas et consignes.',
    },
    sections: [
      {
        headingEn: 'Busan Subway & City Bus Transfer and Luggage Rules',
        paragraphsEn: [
          'Understanding Busan’s transit card transfer system and luggage regulations saves both money and stress when traveling across the city.',
        ],
        bulletsEn: [
          'Up to 2 Free Transfers Within 30 Minutes: When using a T-money or EZL transit card, tap out when exiting the bus or subway gate. Transferring between Busan Subway (Lines 1–4, Donghae Line, Gimhae Light Rail) and city/village buses within 30 minutes grants up to 2 free transfers (3 rides total). Always tap off before alighting.',
          'Oversized Suitcase Restrictions on City Buses: Under Busan city bus safety regulations, drivers may refuse boarding with large suitcases (typically 24 inches or larger) that block the aisle. When traveling with large luggage, use the Busan Subway elevator network or store your bags at a free luggage lounge.',
          'Low-Floor Accessible Buses: Major Busan trunk bus routes operate step-free low-floor buses equipped with wheelchair ramps and stroller spaces. You can check real-time low-floor bus arrivals in Naver Map.',
        ],
      },
    ],
  },
  '/tips/child-free': {
    title: {
      EN: 'Busan Free Public Transit for Children (Ages 6–12) & Stroller Gate Guide | Stepless',
      JA: '釜山の子供（満6〜12歳）公共交通運賃無料ガイド＆ベビーカー改札通過のコツ | Stepless',
      ZH_TW: '釜山兒童（6～12歲）大眾運輸免費搭車指南＆嬰兒車寬敞閘門通行攻略 | Stepless',
      ZH_CN: '釜山儿童（6～12岁）公共交通免费乘车指南＆婴儿车宽敞闸机通行攻略 | Stepless',
      ES: 'Transporte Público Gratuito para Niños en Busan (6 a 12 Años) y Acceso con Cochecito | Stepless',
      FR: 'Transports Publics Gratuits pour les Enfants à Busan (6 à 12 Ans) et Accès Poussette | Stepless',
    },
    description: {
      EN: 'How families can enjoy free Busan subway and bus fares for children under 6 and registered children ages 6–12, plus tips for using wide accessible stroller gates in every subway station.',
      JA: '満6歳未満の乳幼児および子供用交通カード登録済みの満6〜12歳児童を対象とした釜山地下鉄・市内バス運賃無料特典の利用方法と、ベビーカーを畳まずに通れる幅広改札ゲート案内。',
      ZH_TW: '介紹未滿 6 歲幼童與 6～12 歲兒童使用記名兒童交通卡免費搭乘釜山地鐵與公車的方法，以及推嬰兒車免收折直接通過地鐵站加寬無障礙閘門的實用技巧。',
      ZH_CN: '介绍未满 6 岁幼童与 6～12 岁儿童使用实名儿童交通卡免费乘坐釜山地铁与公交的方法，以及推婴儿车免折叠直接通过地铁站加宽无障碍闸机的实用技巧。',
      ES: 'Cómo disfrutar de transporte público gratuito en Busan para niños menores de 6 años y de 6 a 12 años con tarjeta infantil, además de consejos para cruzar los torniquetes anchos con cochecito.',
      FR: 'Comment bénéficier des transports gratuits à Busan pour les enfants de moins de 6 ans et de 6 à 12 ans avec carte enfant, et utiliser les portillons larges pour poussettes.',
    },
    sections: [
      {
        headingEn: 'Child Fare Exemption & Family Stroller Tips in Busan',
        paragraphsEn: [
          'Busan Metropolitan City was the first city in Korea to introduce 0 KRW public transit fares for children to make family travel easier.',
        ],
        bulletsEn: [
          'Infants & Toddlers Under Age 6: Up to 3 children under age 6 ride free without a card when accompanied by a fare-paying adult.',
          'Children Ages 6–12 (Elementary School Age): Purchase a T-money or EZL card at any convenience store (CU, GS25, 7-Eleven, Emart24) and ask the staff to register the child’s date of birth. Tapping a registered child card charges 0 KRW on Busan city buses, village buses, and subway lines 1–4.',
          'Wide Stroller & Wheelchair Flap Gates: Every Busan subway station concourse features a wide automatic barrier-free gate next to the standard turnstiles so you never have to fold your stroller.',
        ],
      },
    ],
  },
  '/tips/bus-qr': {
    title: {
      EN: 'How to Ride Busan City Buses Without a Transit Card (Mobile QR & NFC Guide) | Stepless',
      JA: '交通カードなしで釜山バスに乗る方法：モバイルQR決済＆スマホタッチ案内 | Stepless',
      ZH_TW: '沒有交通卡也能搭釜山公車：手機行動交通卡＆車內 QR Code 付款指南 | Stepless',
      ZH_CN: '没有交通卡也能坐釜山公交：手机移动交通卡＆车内 QR 二维码付款指南 | Stepless',
      ES: 'Cómo Subir a los Autobuses de Busan Sin Tarjeta Física (Pago Móvil QR y NFC) | Stepless',
      FR: 'Comment Prendre le Bus à Busan Sans Carte Physique (Paiement Mobile QR et NFC) | Stepless',
    },
    description: {
      EN: 'Busan city buses are cashless. Learn how to board using mobile T-money/EZL NFC tap or the onboard QR code fare payment system when you do not have a physical transit card.',
      JA: 'キャッシュレス運行の釜山バスで実物の交通カードや現金がない場合でも、モバイル交通カード(NFC)や車内QRコードスキャンで運賃を支払って乗車する手順を解説します。',
      ZH_TW: '釜山市區公車全面實施無現金搭車。若忘記攜帶實體交通卡，可透過手機 NFC 行動交通卡或掃描車門旁 QR Code 支付車資，輕鬆搭乘公車。',
      ZH_CN: '釜山市区公交全面实施无现金乘车。若忘记携带实体交通卡，可通过手机 NFC 移动交通卡或扫描车门旁 QR 二维码支付车费，轻松搭乘公交。',
      ES: 'Los autobuses urbanos de Busan funcionan sin efectivo. Aprende a pagar con tarjeta móvil NFC o escaneando el código QR a bordo si no tienes tarjeta física T-money.',
      FR: 'Les bus de Busan fonctionnent sans espèces. Découvrez comment payer par NFC mobile ou via le QR code à bord si vous n’avez pas de carte T-money physique.',
    },
    sections: [
      {
        headingEn: '2 Ways to Board Cashless Busan City Buses',
        paragraphsEn: [
          'All city buses in Busan operate on a cashless system without coin boxes. If you do not have a physical T-money card in hand, use one of these two methods:',
        ],
        bulletsEn: [
          'Method 1 — Mobile Transit Card (NFC Tap): Activate Mobile T-money, EZL, Apple Pay T-money, or Samsung Pay transit card on your smartphone and tap the reader when boarding and alighting to enjoy full 30-minute free transfer discounts.',
          'Method 2 — Onboard QR Code Fare Notice: If you have no transit card at all, scan the QR code posted near the driver’s booth to pay the single-ride fare digitally. Because QR transfers do not include free subway-bus transfer discounts, purchasing a prepaid transit card at any convenience store is recommended for multi-stop trips.',
        ],
      },
    ],
  },
  '/tips/taxi': {
    title: {
      EN: 'Busan Accessible Taxis (Duribal Wheelchair Van, Dongbaek Call Taxi & Jumbo Vans) | Stepless',
      JA: '釜山タクシー＆福祉車両ガイド（車椅子対応ドリバル・椿コールタクシー・大型バン）| Stepless',
      ZH_TW: '釜山計程車＆無障礙福祉車指南（輪椅專用車 Duribal・冬柏叫車・大型休旅計程車）| Stepless',
      ZH_CN: '釜山出租车＆无障碍福祉车指南（轮椅专用车 Duribal・冬柏叫车・大型商务出租车）| Stepless',
      ES: 'Guía de Taxis Accesibles en Busan (Furgonetas con Rampa Duribal y Taxis Grandes) | Stepless',
      FR: 'Guide des Taxis Accessibles à Busan (Vans avec Rampe Duribal et Grands Taxis) | Stepless',
    },
    description: {
      EN: 'Complete directory of Busan call taxis, large jumbo vans for strollers and suitcases, and Duribal wheelchair-accessible lift vans operated by Busan Facilities Corporation.',
      JA: '坂道の多い場所や雨天・深夜の移動に便利な釜山公式ブランドタクシー（椿タクシー・灯台コール）と、車椅子スロープ付きの特別交通手段「ドリバル(Duribal)」の予約・利用案内。',
      ZH_TW: '整理釜山斜坡地形、雨天或深夜移動必備的官方計程車（冬柏計程車、燈塔叫車）、可放嬰兒車與多件行李的大型計程車，以及輪椅升降專用車「Duribal」預約電話與指南。',
      ZH_CN: '整理釜山坡道地形、雨天或深夜出行必备的官方出租车（冬柏出租车、灯塔叫车）、可放婴儿车与多件行李的大型出租车，以及轮椅升降专用车“Duribal”预约电话与指南。',
      ES: 'Directorio completo de taxis oficiales en Busan, taxis grandes (Jumbo/Venti) para cochecitos y maletas, y furgonetas adaptadas con rampa para sillas de ruedas (Duribal).',
      FR: 'Répertoire complet des taxis officiels à Busan, grands taxis (Jumbo/Venti) pour poussettes et valises, et véhicules adaptés avec rampe pour fauteuils roulants (Duribal).',
    },
    sections: [
      {
        headingEn: 'Official Busan Call Taxis & Wheelchair Accessible Transport',
        paragraphsEn: [
          'For steep hillside neighborhoods or rainy days, combining Busan’s subway elevators with accessible taxis makes barrier-free travel effortless.',
        ],
        bulletsEn: [
          'Duribal Wheelchair-Accessible Lift Vans (Busan Facilities Corporation, Tel: 1555-1114): Equipped with hydraulic wheelchair lifts/ramps and tie-down belts for travelers with severe mobility impairments.',
          'Makamodi & Jabi Call Voucher Taxis (Tel: 051-500-8888): Dedicated barrier-free and maternity support taxi dispatch in Busan.',
          'Official Brand Call Taxis & Jumbo Vans (Dongbaek Taxi / Deungdae Call 051-600-1000 / Busan Call 051-200-2000): Request a mid-size sedan or a large Jumbo/Venti van when traveling with foldable strollers or 3+ large suitcases.',
        ],
      },
    ],
  },
  '/tips/exploration': {
    title: {
      EN: 'Busan Exploration Local Magazine: Free Luggage Lounges, Stroller Rentals & Subway Hacks | Stepless',
      JA: '釜山探究生活ローカルマガジン：無料荷物預かり所・ベビーカー貸出・地下鉄裏ワザ | Stepless',
      ZH_TW: '釜山探究生活在地誌：4大免費寄放行李處、免費租借嬰兒車輪椅＆地鐵隱藏秘訣 | Stepless',
      ZH_CN: '釜山探究生活在地图志：4大免费行李寄存处、免费租借婴儿车轮椅＆地铁隐藏技巧 | Stepless',
      ES: 'Revista Local de Busan: Consignas Gratuitas, Alquiler de Cochecitos y Trucos de Metro | Stepless',
      FR: 'Magazine Local de Busan : Consignes Gratuites, Location de Poussettes et Astuces Métro | Stepless',
    },
    description: {
      EN: 'In-depth local editor features on Busan: 4 free luggage storage locations, free stroller and wheelchair rental spots, the 10-minute free subway gate re-entry rule, survival Korean phrases, and North Port Opera House boardwalk.',
      JA: '釜山の無料スーツケース預かり所4選、ベビーカー・車椅子の無料レンタル場所、地下鉄の反対ホーム誤入場10分以内無料再入場ルール、北港親水公園など深掘りコラム集。',
      ZH_TW: '深入整理釜山 4 處免費行李寄放服務、主要景點免費嬰兒車與輪椅租借處、地鐵進錯月台 10 分鐘內免費重進閘門規定、實用韓語會話與北港親水公園無障礙步道專題。',
      ZH_CN: '深入整理釜山 4 处免费行李寄存服务、主要景点免费婴儿车与轮椅租借处、地铁进错站台 10 分钟内免费重进闸机规定、实用韩语会话与北港亲水公园无障碍步道专题。',
      ES: 'Artículos locales en profundidad sobre Busan: 4 consignas gratuitas de equipaje, préstamo gratuito de sillas de ruedas y cochecitos, reingreso gratuito al metro en 10 minutos y frases útiles en coreano.',
      FR: 'Articles locaux approfondis sur Busan : 4 consignes à bagages gratuites, prêt gratuit de fauteuils roulants et poussettes, réentrée gratuite au métro en 10 minutes et phrases coréennes utiles.',
    },
    sections: [
      {
        headingEn: 'Featured Articles in Busan Exploration Magazine',
        paragraphsEn: [
          'Read our field-researched local articles designed to make your Busan trip lighter, smoother, and completely step-free:',
        ],
        bulletsEn: [
          '4 Free Luggage Storage Spots in Busan (Busan Station, Seomyeon, Haeundae, Gwangalli): Operating hours, exact addresses, and step-free access.',
          'Free Stroller & Wheelchair Rental Directory Across Busan: Tourist information centers, museums, and department stores offering free mobility rentals.',
          'Busan Subway 10-Minute Free Re-Entry Rule: How to cross to the opposite platform without paying an extra fare when you enter the wrong turnstile.',
          '5-Second Survival Korean & Busan Phrases for Travelers: Essential phrases for ordering food and asking for elevators or ramps.',
          'Bujeon–Masan Express Rail Outlook & West Busan Step-Free Transfer Guide: Connecting Gimhae Airport (Sasang) and downtown Bujeon.',
          'Busan North Port Waterfront Park & Busan Opera House Step-Free Pedestrian Deck: Walk directly from KTX Busan Station 2F to the harbor.',
        ],
      },
    ],
  },
  '/tips/exploration/luggage': {
    title: {
      EN: '4 Free Luggage Storage Locations in Busan (Busan Station, Seomyeon, Haeundae, Gwangalli) | Stepless',
      JA: '釜山の無料荷物・スーツケース預かり所4選（釜山駅・西面・海雲台・広安里）| Stepless',
      ZH_TW: '釜山 4 大免費行李寄放處總整理（釜山站・西面・海雲台・廣安里）| Stepless',
      ZH_CN: '釜山 4 大免费行李寄存处汇总（釜山站・西面・海云台・广安里）| Stepless',
      ES: '4 Lugares de Consigna de Equipaje Gratuita en Busan (Estación de Busan, Seomyeon, Haeundae, Gwangalli) | Stepless',
      FR: '4 Consignes à Bagages Gratuites à Busan (Gare de Busan, Seomyeon, Haeundae, Gwangalli) | Stepless',
    },
    description: {
      EN: 'Where to store your suitcases for free in Busan before hotel check-in or after check-out: Busan Travel Lounge, Lotte Department Store Seomyeon, Haeundae Platform, and Gwangalli Tourist Information Center.',
      JA: 'ホテルのチェックイン前やチェックアウト後に重いスーツケースを無料で預けられる釜山公式4スポット（釜山トラベルラウンジ、ロッテ百貨店西面本店の荷物預かり、海雲台プラットフォーム、広安里観光案内所）の営業時間とアクセス。',
      ZH_TW: '飯店入住前或退房後不想拖著沉重行李箱？整理釜山 4 處免費行李寄放處（釜山旅遊休息室、樂天百貨西面本店、海雲台 Platform、廣安里觀光案內所）地址與無障礙路線。',
      ZH_CN: '酒店入住前或退房后不想拖着沉重行李箱？整理釜山 4 处免费行李寄存处（釜山旅游休息室、乐天百货西面总店、海云台 Platform、广安里旅游咨询处）地址与无障碍路线。',
      ES: 'Dónde guardar tus maletas gratis en Busan antes del check-in o después del check-out: Busan Travel Lounge, Lotte Department Store Seomyeon, Haeundae Platform y Oficina de Turismo de Gwangalli.',
      FR: 'Où déposer gratuitement vos valises à Busan avant le check-in ou après le check-out : Busan Travel Lounge, Lotte Department Store Seomyeon, Haeundae Platform et Office de Tourisme de Gwangalli.',
    },
    sections: [
      {
        headingEn: '4 Verified Free Suitcase Storage Spots in Busan',
        paragraphsEn: [
          'Avoid carrying heavy suitcases on city buses or crowded streets by using these four free luggage storage services located right next to major Busan subway stations:',
        ],
        bulletsEn: [
          '1. Busan Station Area — Busan Travel Lounge: 12-3 Jungang-daero 196beon-gil, Dong-gu (3-minute flat walk from Line 1 Busan Station Exit 2 or Exit 4 elevator). Free luggage keeping and traveler lounge.',
          '2. Seomyeon Area — Lotte Department Store Busan Main Branch B1F Service Desk & Lockers: 772 Gaya-daero, Busanjin-gu (directly connected underground to Seomyeon Station concourse and elevators). Ideal while exploring Seomyeon and Jeonpo Cafe Street.',
          '3. Haeundae Area — Haeundae Platform (Former Haeundae Station Atelier): 621 Haeundaehaebyeon-ro, Haeundae-gu (directly in front of Line 2 Haeundae Station Exit 4). Store your bags before walking down Gunam-ro to Haeundae Beach.',
          '4. Gwangalli Area — Gwangalli Tourist Information Center: 219 Gwanganhaebyeon-ro, Suyeong-gu (straight down to the beach from Line 2 Gwangan Station Exit 3 or Exit 5 elevator). Free daytime luggage storage right on the flat beachfront promenade.',
        ],
      },
    ],
  },
  '/tips/exploration/rental': {
    title: {
      EN: 'Free Stroller & Wheelchair Rental Locations in Busan (Attractions & Museums) | Stepless',
      JA: '釜山のベビーカー・車椅子 無料レンタル場所一覧（観光案内所・博物館・百貨店）| Stepless',
      ZH_TW: '釜山免費租借嬰兒車＆輪椅地點總整理（主要景點・博物館・百貨公司）| Stepless',
      ZH_CN: '釜山免费租借婴儿车＆轮椅地点汇总（主要景点・博物馆・百货公司）| Stepless',
      ES: 'Lugares de Alquiler Gratuito de Cochecitos y Sillas de Ruedas en Busan | Stepless',
      FR: 'Lieux de Prêt Gratuit de Poussettes et Fauteuils Roulants à Busan | Stepless',
    },
    description: {
      EN: 'Directory of free baby stroller and manual wheelchair rental desks across Busan: Gwangalli Tourist Info, National Maritime Museum, Busan National Science Museum, BEXCO, and major department stores.',
      JA: '広安里観光案内所、国立海洋博物館、国立釜山科学館、BEXCO、釜山市立美術館、新世界・ロッテ百貨店など身分証提示でベビーカーや手動車椅子を無料レンタルできる施設ディレクトリ。',
      ZH_TW: '整理憑護照或證件即可免費借用嬰兒車與手動輪椅的釜山景點與設施：廣安里觀光案內所、國立海洋博物館、國立釜山科學館、BEXCO、新世界與樂天百貨。',
      ZH_CN: '整理凭护照或证件即可免费借用婴儿车与手动轮椅的釜山景点与设施：广安里旅游咨询处、国立海洋博物馆、国立釜山科学馆、BEXCO、新世界与乐天百货。',
      ES: 'Directorio de préstamo gratuito de cochecitos de bebé y sillas de ruedas manuales en Busan presentando tu pasaporte: Gwangalli, Museo Marítimo Nacional, BEXCO y grandes almacenes.',
      FR: 'Répertoire des prêts gratuits de poussettes et fauteuils roulants manuels à Busan sur présentation d’une pièce d’identité : Gwangalli, Musée Maritime National, BEXCO et grands magasins.',
    },
    sections: [
      {
        headingEn: 'Where to Borrow a Free Stroller or Wheelchair in Busan',
        paragraphsEn: [
          'If you did not bring a stroller on your flight or a family member needs a wheelchair at large venues, bring a valid ID or passport to borrow equipment free of charge at these locations:',
        ],
        bulletsEn: [
          'Gwangalli Beach Tourist Information Center: Free baby strollers and manual wheelchairs for same-day beachfront walks (accessible via Gwangan Station Exit 3/5 elevator).',
          'National Maritime Museum & Busan National Science Museum: 1F information desk provides complimentary strollers and manual wheelchairs; all exhibition halls have spacious elevators and ramps.',
          'BEXCO & Busan Museum of Art: Complimentary wheelchair and stroller loans at the main lobby desk (Centum City Station & BEXCO Station elevators).',
          'Shinsegae Centum City & Lotte Department Stores (Gwangbok & Seomyeon): Dedicated stroller/wheelchair rental lounges on 1F or B1F connected directly to subway concourses.',
          'Dadaepo Beach Park & Taejongdae Recreation Area Information Desks: Manual wheelchair and stroller loans available at the visitor center.',
        ],
      },
    ],
  },
  '/tips/exploration/metro-reentry': {
    title: {
      EN: 'Busan Subway 10-Minute Free Re-Entry Rule (Wrong Platform Direction Fix) | Stepless',
      JA: '釜山地下鉄の反対ホーム誤入場「10分以内・無料再入場」制度ガイド | Stepless',
      ZH_TW: '釜山地鐵進錯月台方向免驚！10 分鐘內免費重新進站轉乘規定 | Stepless',
      ZH_CN: '釜山地铁进错站台方向别慌！10 分钟内免费重新进站换乘规定 | Stepless',
      ES: 'Regla de Reingreso Gratuito en 10 Minutos del Metro de Busan (Cambio de Andén) | Stepless',
      FR: 'Règle de Réentrée Gratuite en 10 Minutes dans le Métro de Busan (Changement de Quai) | Stepless',
    },
    description: {
      EN: 'Entered the wrong side platform on the Busan Subway? Learn how to tap out and tap back into the opposite direction gate within 10 minutes at the same station for 0 KRW extra fare.',
      JA: 'エレベーターで降りたら反対方向のホームだった時も安心！釜山地下鉄1〜4号線で同じ駅の改札を10分以内にタッチして出入りすれば追加運賃0円で反対側ホームへ入り直せる公式ルールを解説。',
      ZH_TW: '搭電梯下樓才發現進錯方向月台？釜山地鐵 1～4 號線提供「同站 10 分鐘內感應出站再進站免扣基本車資」制度，推嬰兒車與輪椅也能安心換邊。',
      ZH_CN: '乘电梯下楼才发现进错方向站台？釜山地铁 1～4 号线提供“同站 10 分钟内刷卡出站再进站免扣基本车费”制度，推婴儿车与轮椅也能安心换边。',
      ES: '¿Entraste al andén equivocado en el metro de Busan? Aprende cómo salir y volver a entrar por el torniquete opuesto en menos de 10 minutos en la misma estación sin pagar tarifa adicional.',
      FR: 'Vous êtes descendu sur le mauvais quai du métro de Busan ? Découvrez comment sortir et rentrer sur le quai opposé dans les 10 minutes à la même station sans payer de supplément.',
    },
    sections: [
      {
        headingEn: 'How the 10-Minute Free Same-Station Re-Entry Works',
        paragraphsEn: [
          'Many Busan Subway Line 1 and Line 2 stations have side platforms where northbound and southbound turnstiles are separated before you board the platform elevator.',
        ],
        bulletsEn: [
          'Zero Extra Fare Within 10 Minutes: If you accidentally tap into the wrong direction gate or need to exit briefly to use the concourse accessible restroom, tap your transit card to exit and tap back into the correct gate at the SAME station within 10 minutes. The system recognizes it as a same-station transfer and charges 0 KRW.',
          'Conditions to Remember: This applies to prepaid and postpaid transit cards (1 person per card) on Busan Subway Lines 1–4, once per entry. If more than 10 minutes pass, standard base fare applies.',
        ],
      },
    ],
  },
  '/tips/exploration/korean-cheat-codes': {
    title: {
      EN: '5-Second Survival Korean & Busan Phrases for Accessible Travel | Stepless',
      JA: '5秒で使える！釜山旅行＆バリアフリー移動の必須韓国語フレーズ集 | Stepless',
      ZH_TW: '5 秒即學即用！釜山自由行點餐、問電梯與無障礙求助必備韓語會話卡 | Stepless',
      ZH_CN: '5 秒即学即用！釜山自由行点餐、问电梯与无障碍求助必备韩语会话卡 | Stepless',
      ES: 'Frases Esenciales en Coreano en 5 Segundos para Viajar por Busan Sin Barreras | Stepless',
      FR: 'Phrases Coréennes Essentielles en 5 Secondes pour Voyager à Busan Sans Marche | Stepless',
    },
    description: {
      EN: 'Practical romanized Korean phrases for international travelers in Busan: asking where the elevator is, checking stroller/wheelchair access at restaurants, ordering non-spicy food, and paying by card.',
      JA: '釜山の食堂や市場、地下鉄駅でそのまま使える簡単韓国語フレーズ集。「エレベーターはどこですか？」「ベビーカー・車椅子で入れますか？」「辛くしないでください」など発音付きで紹介。',
      ZH_TW: '專為外國旅客整理的釜山實戰韓語發音指南：「請問電梯在哪裡？」、「嬰兒車／輪椅可以進去嗎？」、「請做不辣的」、「可以用信用卡結帳嗎？」等必備表達。',
      ZH_CN: '专为外国游客整理的釜山实战韩语发音指南：“请问电梯在哪里？”、“婴儿车／轮椅可以进去吗？”、“请做不辣的”、“可以用信用卡结账吗？”等必备表达。',
      ES: 'Frases prácticas en coreano romanizado para viajeros en Busan: cómo preguntar dónde está el ascensor, si un restaurante es accesible con cochecito o silla de ruedas y cómo pedir comida sin picante.',
      FR: 'Phrases pratiques en coréen romanisé pour voyager à Busan : demander où se trouve l’ascenseur, vérifier l’accès poussette/fauteuil roulant au restaurant et commander non épicé.',
    },
    sections: [
      {
        headingEn: 'Essential Romanized Korean Phrases for Busan Travelers',
        paragraphsEn: [
          'Use these quick phonetic Korean phrases at subway stations, traditional markets, and local restaurants across Busan:',
        ],
        bulletsEn: [
          'Where is the elevator? — "El-li-be-i-teo-ga eo-di-e it-na-yo?" Use this at subway stations, department stores, and multi-story buildings to find step-free vertical access.',
          'Can I bring a stroller / wheelchair inside? — "Yu-mo-cha / Hwil-che-eo deul-eo-gal su it-na-yo?" Helpful before entering local restaurants or cafes.',
          'This one, please / Please make it not spicy — "I-geo ju-se-yo / An maep-ge hae-ju-se-yo." Great for ordering pork soup (Dwaeji-gukbap), noodles (Milmyeon), or seafood.',
          'Check, please / Do you accept credit cards? — "Gye-san-hae ju-se-yo / Ka-deu doe-na-yo?"',
        ],
      },
    ],
  },
  '/tips/exploration/bujeon-masan': {
    title: {
      EN: 'Bujeon–Masan Express Rail Outlook & West Busan Step-Free Transfer Guide | Stepless',
      JA: '釜田〜馬山複線電鉄の開通展望＆西釜山（沙上駅・釜田駅）バリアフリー乗換ガイド | Stepless',
      ZH_TW: '釜田～馬山複線電鐵開通展望＆西釜山（釜田站・沙上站）無障礙轉乘指南 | Stepless',
      ZH_CN: '釜田～马山复线电铁开通展望＆西釜山（釜田站・沙上站）无障碍换乘指南 | Stepless',
      ES: 'Perspectiva del Tren Bujeon–Masan y Guía de Transbordo Accesible en el Oeste de Busan | Stepless',
      FR: 'Ligne Ferroviaire Bujeon–Masan et Guide de Correspondance Sans Marche à l’Ouest de Busan | Stepless',
    },
    description: {
      EN: 'How the upcoming Bujeon–Masan double-track railway connects Gimhae Airport gateway Sasang Station with Bujeon Station and the Donghae Line for faster step-free travel across Busan.',
      JA: '東海線の起点・釜田駅と金海国際空港の玄関口・沙上駅を直結する「釜田〜馬山複線電鉄」の整備状況と、大型エレベーター・ホームドア完備によるバリアフリー移動のメリットを解説。',
      ZH_TW: '解析串聯東海線起點「釜田站」與金海國際機場門戶「沙上站」的釜田～馬山複線電鐵，以及全線大型電梯與無障礙月台對釜山東西向旅遊動線的提升。',
      ZH_CN: '解析串联东海线起点“釜田站”与金海国际机场门户“沙上站”的釜田～马山复线电铁，以及全线大型电梯与无障碍站台对釜山东西向旅游动线的提升。',
      ES: 'Cómo la línea ferroviaria Bujeon–Masan conectará la estación de Sasang (acceso al Aeropuerto de Gimhae) con la estación de Bujeon y la Línea Donghae mediante estaciones 100% accesibles.',
      FR: 'Comment la ligne ferroviaire Bujeon–Masan reliera la station Sasang (porte d’entrée de l’aéroport de Gimhae) à la station Bujeon et à la ligne Donghae avec des ascenseurs modernes.',
    },
    sections: [
      {
        headingEn: 'Direct East–West Barrier-Free Rail Link: Sasang to Bujeon',
        paragraphsEn: [
          'Connecting West Busan (Gimhae International Airport & Sasang Station) directly to central Bujeon Station and the Donghae Line transforms step-free regional transit.',
        ],
        bulletsEn: [
          'Faster Airport-to-East-Busan Access: Currently, traveling between Sasang Station (Line 2 & Gimhae Light Rail) and Bujeon Station (Line 1 & Donghae Line to Osiria/Gijang) requires transferring via Seomyeon. The Bujeon–Masan rail link connects Sasang and Bujeon directly.',
          'Modern Step-Free Station Standards: All new commuter rail platforms feature level boarding, wide safety screen doors, high-capacity elevators for wheelchairs and strollers, and accessible restrooms.',
        ],
      },
    ],
  },
  '/tips/exploration/opera-house': {
    title: {
      EN: 'Busan North Port Waterfront Park & Opera House Step-Free Pedestrian Deck Guide | Stepless',
      JA: '釜山港北港親水公園＆釜山オペラハウス バリアフリー空中歩行デッキ散歩ガイド | Stepless',
      ZH_TW: '釜山港北港親水公園＆釜山歌劇院：KTX 釜山站直結無障礙空中步道散步指南 | Stepless',
      ZH_CN: '釜山港北港亲水公园＆釜山歌剧院：KTX 釜山站直连无障碍空中步道散步指南 | Stepless',
      ES: 'Parque Costero del Puerto Norte de Busan y Ópera de Busan: Paseo Sin Escalones | Stepless',
      FR: 'Parc Maritime du Port Nord de Busan et Opéra de Busan : Promenade Sans Marche | Stepless',
    },
    description: {
      EN: 'Walk directly from KTX Busan Station 2F concourse to the North Port Waterfront Park and Busan Opera House site with zero stairs using the elevated pedestrian bridge, moving walkways, and elevators.',
      JA: 'KTX釜山駅2階コンコースからエレベーター・動く歩道完備の空中歩行デッキを渡り、階段ゼロで海辺の北港親水公園や釜山オペラハウス建設エリアへアクセスするバリアフリー散策コース。',
      ZH_TW: '從 KTX 釜山站 2 樓大廳透過設有大型電梯與電動步道的空中行人天橋，全程零階梯直達釜山港北港親水公園海濱木棧道與釜山歌劇院地標。',
      ZH_CN: '从 KTX 釜山站 2 楼大厅通过设有大型电梯与自动人行道的空中步行廊桥，全程零台阶直达釜山港北港亲水公园海滨木栈道与釜山歌剧院地标。',
      ES: 'Camina directamente desde el vestíbulo del 2.º piso de la estación KTX de Busan hasta el Parque Costero del Puerto Norte sin un solo escalón gracias a la pasarela peatonal elevada con ascensores.',
      FR: 'Marchez directement depuis le hall du 2e étage de la gare KTX de Busan jusqu’au Parc Maritime du Port Nord sans aucune marche grâce à la passerelle piétonne équipée d’ascenseurs.',
    },
    sections: [
      {
        headingEn: 'Zero-Stair Harbor Walk from KTX Busan Station',
        paragraphsEn: [
          'The Busan North Port Redevelopment Waterfront Park offers one of the flattest, most scenic harbor promenades in Korea right outside Busan Station.',
        ],
        bulletsEn: [
          'Direct Elevated Pedestrian Deck: Take the elevator from Subway Line 1 Busan Station (Exit 4 or Exit 6) up to KTX Busan Station 2F, then follow the harbourside skywalk equipped with moving walkways and large elevators down to the waterfront park.',
          'Wheelchair & Stroller Friendly Waterfront: Wide level wooden decks, gentle lawn plazas, waterfront viewing zones, and clean accessible restrooms make it an ideal 1-hour stroll before or after your KTX train.',
        ],
      },
    ],
  },
  '/about': {
    title: {
      EN: 'About Stepless in Busan — Editorial Mission & Step-Free Verification Standards | Stepless',
      JA: 'Stepless in Busan（ステップレス）について｜運営理念とバリアフリー検証基準 | Stepless',
      ZH_TW: '關於 Stepless in Busan（無階梯釜山）｜服務理念與無障礙實地驗證標準 | Stepless',
      ZH_CN: '关于 Stepless in Busan（无台阶釜山）｜服务理念与无障碍实地验证标准 | Stepless',
      ES: 'Sobre Stepless in Busan — Misión Editorial y Estándares de Verificación Accesible | Stepless',
      FR: 'À Propos de Stepless in Busan — Mission Éditoriale et Normes de Vérification | Stepless',
    },
    description: {
      EN: 'Learn about Stepless in Busan (Chief Editor: Floreur), our mission to empower wheelchair users, stroller families, seniors, and suitcase travelers with verified Busan subway elevator and itinerary guides.',
      JA: '車椅子利用者、ベビーカー同伴の家族、シニア、スーツケース旅行者が階段の壁なく釜山を楽しめるよう創設されたローカルバリアフリー旅行ガイド「Stepless in Busan」の運営方針と編集体制。',
      ZH_TW: '了解 Stepless in Busan（總編輯：Floreur）的創立初衷：為輪椅使用者、推嬰兒車家庭、長輩與行李箱旅客提供經過實地驗證的釜山地鐵電梯出口與無障礙旅遊行程。',
      ZH_CN: '了解 Stepless in Busan（总编辑：Floreur）的创立初衷：为轮椅使用者、推婴儿车家庭、长辈与行李箱游客提供经过实地验证的釜山地铁直梯出口与无障碍旅游路线。',
      ES: 'Conoce Stepless in Busan (Editora Jefe: Floreur), nuestra misión de ayudar a usuarios de sillas de ruedas, familias con cochecitos, mayores y viajeros con maletas a recorrer Busan sin escalones.',
      FR: 'Découvrez Stepless in Busan (Rédactrice en chef : Floreur) et notre mission : permettre aux utilisateurs de fauteuils roulants, familles avec poussette, seniors et voyageurs avec valises de visiter Busan sans marche.',
    },
    sections: [
      {
        headingEn: 'Our 3 Core Editorial Values at Stepless in Busan',
        paragraphsEn: [
          'Busan is a breathtaking coastal city where mountains meet the sea, but its steep terrain and multi-level subway stations mean that choosing the wrong exit can leave stroller, wheelchair, and luggage travelers facing long flights of stairs. Stepless in Busan (Chief Editor: Floreur) provides actionable, field-verified step-free routing.',
        ],
        bulletsEn: [
          '22 Major Subway Stations Verified Floor-by-Floor: We document continuous elevator pathways from underground platforms (B2–B4) to concourses and street-level sidewalks.',
          '8 Curated Themes & 1 to 5-Day Step-Free Itineraries: Every restaurant, museum, market, and coastal boardwalk is checked for ramp access, elevator availability, and stroller/wheelchair comfort.',
          '7-Language Global Accessibility: Available in Korean, English, Japanese, Traditional Chinese, Simplified Chinese, Spanish, and French with one-click Google Maps and Naver Map transit navigation.',
        ],
      },
    ],
  },
  '/about/privacy': {
    title: {
      EN: 'Privacy Policy & Cookie / Google AdSense Disclosure | Stepless in Busan',
      JA: 'プライバシーポリシー（個人情報保護方針・CookieおよびGoogle AdSense案内）| Stepless',
      ZH_TW: '隱私權政策（Privacy Policy・Cookie 與 Google AdSense 廣告說明）| Stepless',
      ZH_CN: '隐私政策（Privacy Policy・Cookie 与 Google AdSense 广告说明）| Stepless',
      ES: 'Política de Privacidad y Uso de Cookies / Google AdSense | Stepless in Busan',
      FR: 'Politique de Confidentialité et Utilisation des Cookies / Google AdSense | Stepless in Busan',
    },
    description: {
      EN: 'Official Privacy Policy for Stepless in Busan (https://stepless.kr), detailing geolocation handling, cookies, Google Analytics, and Google AdSense advertising data policies.',
      JA: 'Stepless in Busan (https://stepless.kr) のプライバシーポリシー。位置情報(Geolocation API)の端末内処理、Cookie、Google AnalyticsおよびGoogle AdSense広告配信に関する規定。',
      ZH_TW: 'Stepless in Busan (https://stepless.kr) 官方隱私權政策，說明瀏覽器位置資訊處理原則、Cookie 使用、Google Analytics 統計與 Google AdSense 廣告政策。',
      ZH_CN: 'Stepless in Busan (https://stepless.kr) 官方隐私政策，说明浏览器位置信息处理原则、Cookie 使用、Google Analytics 统计与 Google AdSense 广告政策。',
      ES: 'Política de privacidad oficial de Stepless in Busan (https://stepless.kr), detallando el tratamiento de geolocalización, cookies, Google Analytics y anuncios de Google AdSense.',
      FR: 'Politique de confidentialité officielle de Stepless in Busan (https://stepless.kr) détaillant la géolocalisation, les cookies, Google Analytics et la diffusion d’annonces Google AdSense.',
    },
    sections: [
      {
        headingEn: 'Privacy Policy & Cookie Disclosure',
        paragraphsEn: [
          'Stepless in Busan ("Service", https://stepless.kr) respects user privacy and complies with applicable data protection regulations and Google Publisher Policies.',
        ],
        bulletsEn: [
          '1. Information Collection & Geolocation: All subway elevator guides and travel itineraries are available free without registration. When you use the Nearest Exit feature, browser geolocation is calculated locally on your device and is never stored on our servers. If you voluntarily submit a facility report or recommendation, only the nickname and report text you provide are stored to improve accuracy.',
          '2. Cookies, Google Analytics & Google AdSense: This website uses Google Analytics for traffic analysis and Google AdSense to support free operations. Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits. Users may opt out of personalized advertising at any time by visiting Google Ads Settings (https://www.google.com/settings/ads) or disabling cookies in browser settings.',
          '3. Privacy Contact: Stepless in Busan Editorial Team · Chief Privacy Officer: Floreur · Email: floreur88@gmail.com',
        ],
      },
    ],
  },
  '/about/terms': {
    title: {
      EN: 'Terms of Service & Public Data Disclaimer | Stepless in Busan',
      JA: '利用規約（Terms of Service・免責事項および著作権について）| Stepless',
      ZH_TW: '服務條款（Terms of Service・設施營運變動免責聲明與著作權）| Stepless',
      ZH_CN: '服务条款（Terms of Service・设施运营变动免责声明与著作权）| Stepless',
      ES: 'Términos de Servicio y Aviso Legal sobre Datos Públicos | Stepless in Busan',
      FR: 'Conditions d’Utilisation et Mentions Légales | Stepless in Busan',
    },
    description: {
      EN: 'Terms of Service for Stepless in Busan (https://stepless.kr), including subway elevator maintenance disclaimers, restaurant operating hour notices, and intellectual property rights.',
      JA: 'Stepless in Busan (https://stepless.kr) のサービス利用規約。地下鉄エレベーターの緊急点検・運休に関する免責事項、店舗営業時間の変動、およびコンテンツ著作権について。',
      ZH_TW: 'Stepless in Busan (https://stepless.kr) 服務條款，包含地鐵電梯臨時維修免責聲明、景點餐廳營業時間變動提醒與原創內容著作權保護說明。',
      ZH_CN: 'Stepless in Busan (https://stepless.kr) 服务条款，包含地铁电梯临时维修免责声明、景点餐厅营业时间变动提醒与原创内容著作权保护说明。',
      ES: 'Términos de Servicio de Stepless in Busan (https://stepless.kr), incluyendo avisos sobre mantenimiento de ascensores, horarios comerciales y derechos de propiedad intelectual.',
      FR: 'Conditions d’utilisation de Stepless in Busan (https://stepless.kr), incluant les avertissements sur la maintenance des ascenseurs, les horaires d’ouverture et la propriété intellectuelle.',
    },
    sections: [
      {
        headingEn: 'Terms of Service & Facility Operation Disclaimer',
        paragraphsEn: [
          'These Terms govern your use of the Stepless in Busan web platform and its barrier-free Busan travel guides.',
        ],
        bulletsEn: [
          'Article 1 (Purpose of Service): Stepless in Busan is a public-interest local travel guide providing subway elevator/escalator locations and step-free travel itineraries across Busan Metropolitan City.',
          'Article 2 (Facility Maintenance & Schedule Changes): Subway elevators and escalators may be temporarily suspended without prior notice due to urgent maintenance by Busan Transportation Corporation or severe weather. Restaurant and attraction hours may also change; please verify critical schedules before departure.',
          'Article 3 (Intellectual Property): Original floor-by-floor pathway guides, curated itinerary descriptions, and custom design assets are the intellectual property of Stepless in Busan.',
        ],
      },
    ],
  },
  '/about/contact': {
    title: {
      EN: 'Contact Us — Report Subway Elevator Status & Partnership Inquiries | Stepless',
      JA: 'お問い合わせ・エレベーター点検情報提供・パートナーシップ窓口 | Stepless',
      ZH_TW: '聯絡我們・回報地鐵電梯維修資訊＆無障礙景點合作提案 | Stepless',
      ZH_CN: '联系我们・反馈地铁电梯维修信息＆无障碍景点合作提案 | Stepless',
      ES: 'Contacto — Reportar Estado de Ascensores y Consultas de Colaboración | Stepless',
      FR: 'Contactez-Nous — Signaler l’État d’un Ascenseur et Partenariats | Stepless',
    },
    description: {
      EN: 'Contact the Stepless in Busan editorial team (floreur88@gmail.com) to report subway elevator maintenance, suggest wheelchair/stroller-friendly Busan spots, or inquire about partnerships.',
      JA: '釜山地下鉄のエレベーター故障・点検情報の提供、車椅子・ベビーカーで入りやすいおすすめスポットの推薦、提携に関するお問い合わせ窓口（floreur88@gmail.com）。',
      ZH_TW: '歡迎聯絡 Stepless in Busan 編輯團隊（floreur88@gmail.com），回報釜山地鐵電梯臨時維修狀況、推薦對嬰兒車與輪椅友善的釜山店家，或洽談合作事宜。',
      ZH_CN: '欢迎联系 Stepless in Busan 编辑团队（floreur88@gmail.com），反馈釜山地铁电梯临时维修状况、推荐对婴儿车与轮椅友好的釜山店家，或洽谈合作事宜。',
      ES: 'Contacta al equipo editorial de Stepless in Busan (floreur88@gmail.com) para informar sobre ascensores en mantenimiento, recomendar lugares accesibles o proponer colaboraciones.',
      FR: 'Contactez l’équipe éditoriale de Stepless in Busan (floreur88@gmail.com) pour signaler un ascenseur en maintenance, suggérer un lieu accessible ou proposer un partenariat.',
    },
    sections: [
      {
        headingEn: 'Official Communication Channels & Feedback Process',
        paragraphsEn: [
          'We continuously update our Busan subway elevator directory and barrier-free courses with field reports from travelers and local residents.',
        ],
        bulletsEn: [
          'Editorial Email: floreur88@gmail.com (Chief Editor: Floreur)',
          'Subway Elevator & Exit Updates: Send us the station name, exit number, and current maintenance notice; verified updates are reflected within 24–48 hours.',
          'Accessible Spot Recommendations: Let us know about stroller-friendly and wheelchair-accessible restaurants, cafes, or attractions in Busan for inclusion in our curated courses.',
        ],
      },
    ],
  },
  '/about/data-source': {
    title: {
      EN: 'Public Data Sources & Barrier-Free Field Verification Methodology | Stepless',
      JA: '公共データ出典およびバリアフリー現地検証プロセスについて | Stepless',
      ZH_TW: '公共數據資料來源＆無障礙現場勘查驗證標準說明 | Stepless',
      ZH_CN: '公共数据资料来源＆无障碍现场勘查验证标准说明 | Stepless',
      ES: 'Fuentes de Datos Públicos y Metodología de Verificación Sin Barreras | Stepless',
      FR: 'Sources de Données Publiques et Méthodologie de Vérification sur le Terrain | Stepless',
    },
    description: {
      EN: 'How Stepless in Busan cross-verifies data from Busan Transportation Corporation, Korea Tourism Organization TourAPI 4.0 (KorWithService2), Visit Busan, and on-site pedestrian audits.',
      JA: '釜山交通公社の都市鉄道昇降設備データ、韓国観光公社TourAPI 4.0（バリアフリー観光情報KorWithService2）、釜山広域市公共データ、および現地実査による交差検証基準を公開。',
      ZH_TW: '公開 Stepless in Busan 所採用之釜山交通公社地鐵升降設施數據、韓國觀光公社 TourAPI 4.0（無障礙旅遊 KorWithService2）、釜山廣域市公開資料與編輯實地交叉驗證流程。',
      ZH_CN: '公开 Stepless in Busan 所采用之釜山交通公社地铁升降设施数据、韩国观光公社 TourAPI 4.0（无障碍旅游 KorWithService2）、釜山广域市公开数据与编辑实地交叉验证流程。',
      ES: 'Conoce cómo Stepless in Busan verifica los datos oficiales de la Corporación de Transporte de Busan, la API de Turismo Sin Barreras de Corea (TourAPI KorWithService2) y auditorías a pie.',
      FR: 'Découvrez comment Stepless in Busan recoupe les données officielles de la Busan Transportation Corporation, de l’API TourAPI KorWithService2 de l’Office du Tourisme de Corée et des audits terrain.',
    },
    sections: [
      {
        headingEn: 'Official Public Data Sources & 4-Step Verification',
        paragraphsEn: [
          'Every subway exit recommendation and accessible tourist spot on Stepless in Busan is built on official national/municipal datasets and verified through physical inspection:',
        ],
        bulletsEn: [
          '1. Busan Transportation Corporation: Official subway station elevator, escalator, wheelchair lift, and accessible restroom location datasets across Lines 1–4.',
          '2. Korea Tourism Organization (TourAPI 4.0 & KorWithService2): Official national barrier-free tourism database covering step-free entrances, ramps, accessible parking, braille blocks, and wheelchair/stroller loans.',
          '3. Busan Metropolitan City & Visit Busan: Monthly festival schedules, low-floor bus operations, and Duribal special transport guidelines.',
          '4. On-Site Curb & Crosswalk Verification: Local editors verify street-level curb cuts, crosswalk connections, and department store underground passage hours.',
        ],
      },
    ],
  },
};

function localizeStaticPage(basePage: StaticRoutePage, lang: Language): StaticRoutePage {
  if (lang === 'KR') return basePage;

  const cleanPath = basePage.routePath;
  const localizedRoutePath = buildLocalizedPath(cleanPath, lang);

  // 1. Station pages (/station/:id or /search/:id)
  const stMatch = cleanPath.match(/^\/(?:station|search)\/([^/]+)$/);
  if (stMatch) {
    const stPage = buildLocalizedStationPage(stMatch[1], lang);
    if (stPage) {
      return { ...stPage, routePath: localizedRoutePath };
    }
  }

  // 2. Course pages (/tips/courses/:slug)
  const courseSlugMap: Record<string, ItineraryCourse['category']> = {
    '/tips/courses/gourmet': 'GOURMET',
    '/tips/courses/experience': 'EXPERIENCE',
    '/tips/courses/market': 'MARKET',
    '/tips/courses/attraction': 'ATTRACTION',
    '/tips/courses/day': 'DAY',
    '/tips/courses/1night': '1NIGHT',
    '/tips/courses/2nights': '2NIGHTS',
    '/tips/courses/3nights': '3NIGHTS',
    '/tips/courses/4nights': '4NIGHTS',
    '/tips/courses/subway': 'SUBWAY',
  };
  if (courseSlugMap[cleanPath]) {
    const course = BUSAN_ITINERARIES.find(c => c.category === courseSlugMap[cleanPath]);
    if (course) {
      return buildLocalizedCoursePage(course, cleanPath, lang);
    }
  }

  // 2b. Barrier-Free pages (/barrier-free and /tips/courses/barrier-free)
  if (cleanPath === '/barrier-free' || cleanPath === '/tips/courses/barrier-free') {
    return buildLocalizedBarrierFreePage(cleanPath, lang);
  }

  // 3. Home page ('/')
  if (cleanPath === '/') {
    const d = DICTIONARY[lang] || DICTIONARY.EN;
    const title = pickLang(lang, {
      KR: basePage.title,
      EN: 'Busan Travel Guide, 1–5 Day Itineraries & Step-Free Subway Map | Stepless in Busan',
      JA: '釜山旅行おすすめモデルコース(日帰り〜4泊5日)＆地下鉄エレベーター完全ガイド | Stepless',
      ZH_TW: '釜山自由行攻略・推薦行程(一日遊～五天四夜)＆地鐵電梯無障礙指南 | Stepless',
      ZH_CN: '釜山旅游攻略・自由行路线推荐(一日游～五天四晚)＆地铁无障碍直梯指南 | Stepless',
      ES: 'Guía de Viaje a Busan: Qué Ver, Itinerarios (1 a 5 Días) y Metro Sin Escalones | Stepless',
      FR: 'Guide de Voyage à Busan : Que Voir, Itinéraires (1 à 5 Jours) et Métro Sans Marche | Stepless',
    });
    const description = pickLang(lang, {
      KR: basePage.description,
      EN: 'Plan your Busan trip with curated 1 to 5-day Busan itineraries, local food & market tours, custom travel route planner, and step-free elevator exits for 22 major Busan subway stations.',
      JA: '釜山の人気観光スポット・絶品グルメ・伝統市場モデルコース(日帰り〜4泊5日)、カスタム旅程プランナー、主要22駅の地下鉄エレベーター出口＆ベビーカー・車椅子バリアフリー案内。',
      ZH_TW: '釜山必訪景點、在地美食、傳統市場推薦行程(一日遊～五天四夜)、自訂旅遊路線規劃，以及 22 個主要地鐵站電梯出口與嬰兒車・輪椅無障礙動線指南。',
      ZH_CN: '釜山必去景点、地道美食、传统市场推荐路线(一日游～五天四晚)、自定义旅游行程规划，以及 22 个主要地铁站无障碍直梯出口与婴儿车・轮椅出行指南。',
      ES: 'Planifica tu viaje a Busan con itinerarios recomendados de 1 a 5 días, gastronomía, mercados tradicionales, planificador de rutas y salidas con ascensor en 22 estaciones de metro.',
      FR: 'Préparez votre voyage à Busan avec des itinéraires de 1 à 5 jours, gastronomie, marchés traditionnels, planificateur d’itinéraire et sorties avec ascenseur dans 22 stations de métro.',
    });
    const coursesListHtml = BUSAN_ITINERARIES.map(c => {
      const cTitle = trEn(c.titleEn, lang);
      const cSub = trEn(c.subtitleEn, lang);
      const href = buildLocalizedPath(`/tips/courses/${c.category.toLowerCase().replace('_', '-')}`, lang);
      return `<li><a href="${escapeHtml(href)}"><strong>${escapeHtml(cTitle)}</strong></a> — ${escapeHtml(cSub)}</li>`;
    }).join('\n');
    const stationsListHtml = STATIONS.map(s => {
      const sTitle = getLocalizedStationTitle(s, lang, true);
      const href = buildLocalizedPath(`/station/${s.id}`, lang);
      return `<a href="${escapeHtml(href)}" style="display: inline-block; margin: 4px 6px 4px 0; padding: 4px 10px; background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 999px; font-size: 13px; color: #334155; text-decoration: none;">${escapeHtml(sTitle)}</a>`;
    }).join('\n');

    return {
      routePath: localizedRoutePath,
      title,
      description,
      h1: d.hero.title.replace(/\n/g, ' '),
      lead: description,
      bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">${escapeHtml(d.categories.sectionTitle)}</h2>
            <p style="font-size: 14px; color: #334155;">${escapeHtml(description)}</p>
            <ul style="font-size: 14px; color: #334155; padding-left: 20px;">
              ${coursesListHtml}
            </ul>
          </section>
          <section style="background: #F4F6F0; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 18px; font-weight: 800; margin-top: 0; color: #11161B;">${escapeHtml(d.utility.sectionTitle)} (22 Busan Subway Stations)</h2>
            <div>${stationsListHtml}</div>
          </section>`,
    };
  }

  // 4. All other hub, transit, exploration & policy pages
  const meta = HUB_AND_ARTICLE_META[cleanPath];
  if (meta) {
    const title = meta.title[lang];
    const description = meta.description[lang];
    const h1 = title.replace(/\s*\|\s*Stepless.*$/i, '');

    if (cleanPath === '/search') {
      const rowsHtml = STATIONS.map(s => {
        const sTitle = getLocalizedStationTitle(s, lang);
        const sHref = buildLocalizedPath(`/station/${s.id}`, lang);
        const sLines = s.lines.map(l => formatLineLabelI18n(l, lang)).join(' · ');
        const loc = getStationLocalized(s, lang);
        const recExits = loc ? loc.recommendedExits : (s.recommendedExitsEn || '');
        const elevDesc = loc ? loc.elevatorLocationDesc : (s.elevatorLocationDescEn || '');
        return `<tr>
                    <td><a href="${escapeHtml(sHref)}"><strong>${escapeHtml(sTitle)}</strong></a></td>
                    <td>${escapeHtml(sLines)}</td>
                    <td>${escapeHtml(recExits)}</td>
                    <td>${escapeHtml(elevDesc)}</td>
                  </tr>`;
      }).join('\n');

      return {
        routePath: localizedRoutePath,
        title,
        description,
        h1,
        lead: description,
        bodyHtml: `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">${escapeHtml(h1)}</h2>
            <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; border-color: #E5E2DC; font-size: 14px; background: #FFFFFF;">
              <thead>
                <tr style="background: #F4F6F0; text-align: left;">
                  <th>Station</th>
                  <th>Lines</th>
                  <th>Elevator / Escalator Exits</th>
                  <th>Elevator Location &amp; Step-Free Route</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </section>`,
      };
    }

    if (cleanPath === '/tips/courses') {
      const coursesHtml = BUSAN_ITINERARIES.map(c => {
        const cTitle = trEn(c.titleEn, lang);
        const cSub = trEn(c.subtitleEn, lang);
        const cTip = trEn(c.overallTipEn, lang);
        const cHref = buildLocalizedPath(`/tips/courses/${c.category.toLowerCase().replace('_', '-')}`, lang);
        const stepNames = c.steps.slice(0, 8).map(s => trEn(s.titleEn, lang)).join(', ');
        return `<article style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 14px; padding: 18px; margin-bottom: 14px;">
                <h3 style="font-size: 18px; font-weight: 800; margin: 0 0 6px 0;"><a href="${escapeHtml(cHref)}">${escapeHtml(cTitle)}</a></h3>
                <p style="font-size: 14px; color: #334155; margin: 0 0 8px 0;">${escapeHtml(cSub)} — ${escapeHtml(cTip)}</p>
                <p style="font-size: 13px; color: #5B7332; margin: 0;">Stops (${c.steps.length}): ${escapeHtml(stepNames)}</p>
              </article>`;
      }).join('\n');

      return {
        routePath: localizedRoutePath,
        title,
        description,
        h1,
        lead: description,
        bodyHtml: `
          <section style="margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; color: #11161B;">${escapeHtml(h1)} (${BUSAN_ITINERARIES.length} Curated Itineraries)</h2>
            ${coursesHtml}
          </section>`,
      };
    }

    const d = DICTIONARY[lang] || DICTIONARY.EN;
    const coursesNavHtml = BUSAN_ITINERARIES.map(c => {
      const cTitle = trEn(c.titleEn, lang);
      const cSub = trEn(c.subtitleEn, lang);
      const href = buildLocalizedPath(`/tips/courses/${c.category.toLowerCase().replace('_', '-')}`, lang);
      return `<li><a href="${escapeHtml(href)}"><strong>${escapeHtml(cTitle)}</strong></a> — ${escapeHtml(cSub)}</li>`;
    }).join('\n            ');

    const stationsNavHtml = STATIONS.map(s => {
      const sTitle = getLocalizedStationTitle(s, lang, true);
      const href = buildLocalizedPath(`/station/${s.id}`, lang);
      return `<a href="${escapeHtml(href)}" style="display: inline-block; margin: 4px 6px 4px 0; padding: 4px 10px; background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 999px; font-size: 13px; color: #334155; text-decoration: none;">${escapeHtml(sTitle)}</a>`;
    }).join('\n            ');

    const sectionsHtml = meta.sections.map(sec => {
      const pHtml = sec.paragraphsEn.map(p => `<p style="font-size: 14px; color: #334155;">${escapeHtml(trEn(p, lang))}</p>`).join('\n');
      const bHtml = sec.bulletsEn && sec.bulletsEn.length > 0
        ? `<ul style="font-size: 14px; color: #334155; padding-left: 20px; margin-bottom: 0;">
            ${sec.bulletsEn.map(b => `<li>${escapeHtml(trEn(b, lang))}</li>`).join('\n            ')}
          </ul>`
        : '';
      return `
          <section style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #11161B;">${escapeHtml(h1)}</h2>
            <p style="font-size: 14px; color: #1E293B; font-weight: 600;">${escapeHtml(description)}</p>
            ${pHtml}
            ${bHtml}
          </section>
          <section style="background: #F4F6F0; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 18px; font-weight: 800; margin-top: 0; color: #11161B;">${escapeHtml(d.categories.sectionTitle)}</h2>
            <ul style="font-size: 14px; color: #334155; padding-left: 20px; margin-bottom: 16px;">
              ${coursesNavHtml}
            </ul>
            <h3 style="font-size: 16px; font-weight: 800; color: #11161B; margin: 0 0 8px 0;">${escapeHtml(d.utility.sectionTitle)}</h3>
            <div>${stationsNavHtml}</div>
          </section>`;
    }).join('\n');

    return {
      routePath: localizedRoutePath,
      title,
      description,
      h1,
      lead: description,
      bodyHtml: sectionsHtml,
    };
  }

  return basePage;
}

function generateRouteHtml(
  templateHtml: string,
  page: StaticRoutePage,
  lang: Language = 'KR',
  cleanRoutePath = '/'
): string {
  const langOpt = LANGUAGE_OPTIONS.find(o => o.code === lang) || LANGUAGE_OPTIONS[0];
  const geoCfg = LANGUAGE_GEO_CONFIG[lang] || LANGUAGE_GEO_CONFIG.KR;
  const isSearchAlias = cleanRoutePath.startsWith('/search/');
  const canonicalCleanPath = isSearchAlias
    ? cleanRoutePath.replace(/^\/search\//, '/station/')
    : cleanRoutePath;
  const canonicalRoutePath = buildLocalizedPath(canonicalCleanPath, lang);
  const canonicalUrl = `https://stepless.kr${canonicalRoutePath === '/' ? '/' : canonicalRoutePath}`;
  const hreflangLinksHtml = getHreflangEntries(canonicalCleanPath)
    .map(e => `<link rel="alternate" hreflang="${escapeHtml(e.hreflang)}" href="${escapeHtml(e.href)}" />`)
    .join('\n    ');
  const baseKeywords = LANGUAGE_SEO_KEYWORDS[lang] || LANGUAGE_SEO_KEYWORDS.KR;
  const cleanTopic = page.h1.replace(/\s*\|\s*.*$/, '').trim();
  const keywords = canonicalCleanPath === '/' ? baseKeywords : `${cleanTopic}, ${baseKeywords}`;
  const alternateOgLocalesHtml = LANGUAGE_OPTIONS.filter(o => o.code !== lang)
    .map(o => `<meta property="og:locale:alternate" content="${escapeHtml(o.ogLocale)}" />`)
    .join('\n    ');

  let html = templateHtml;

  // 0. Replace <html lang="...">
  html = html.replace(/<html\s+lang="[^"]*"/i, `<html lang="${escapeHtml(langOpt.htmlLang)}"`);

  // 1. Replace <title>
  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(page.title)}</title>`
  );

  // 2. Replace <meta name="description" ...> and <meta name="keywords" ...>
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(page.description)}" />`
  );
  html = html.replace(
    /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="keywords" content="${escapeHtml(keywords)}" />`
  );

  // 2.5. Replace Multi-Engine Bot Directives & Localized GEO / AI Search Meta Tags
  const robotsDirective = isSearchAlias
    ? 'noindex, follow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  html = html.replace(
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="robots" content="${robotsDirective}" />`
  );
  html = html.replace(
    /\s*<meta\s+name="(?:bingbot|yeti|baiduspider|slurp)"\s+content="[^"]*"\s*\/?>/gi,
    ''
  );
  html = html.replace(
    /<meta\s+name="googlebot"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="googlebot" content="${robotsDirective}" />\n    <meta name="bingbot" content="${robotsDirective}" />\n    <meta name="yeti" content="${isSearchAlias ? 'noindex, follow' : 'index, follow'}" />\n    <meta name="baiduspider" content="${isSearchAlias ? 'noindex, follow' : 'index, follow'}" />\n    <meta name="slurp" content="${isSearchAlias ? 'noindex, follow' : 'index, follow'}" />`
  );
  html = html.replace(
    /<meta\s+name="author"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="author" content="${escapeHtml(geoCfg.authorName)}" />`
  );
  html = html.replace(
    /<meta\s+name="geo\.placename"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="geo.placename" content="${escapeHtml(geoCfg.geoPlacename)}" />`
  );
  html = html.replace(
    /<meta\s+name="target-country"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="target-country" content="${escapeHtml(geoCfg.targetCountry)}" />`
  );
  html = html.replace(
    /<meta\s+name="content-language"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="content-language" content="${escapeHtml(geoCfg.contentLanguage)}" />`
  );
  html = html.replace(
    /<meta\s+name="citation_title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="citation_title" content="${escapeHtml(page.title)}" />`
  );
  html = html.replace(
    /<meta\s+name="citation_author"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="citation_author" content="${escapeHtml(geoCfg.authorName)}" />`
  );
  html = html.replace(
    /<meta\s+name="chatgpt:snippet"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="chatgpt:snippet" content="${escapeHtml(page.description)}" />`
  );
  html = html.replace(
    /\s*<meta\s+name="(?:ai:summary|aeo:primary-answer)"\s+content="[^"]*"\s*\/?>/gi,
    ''
  );
  html = html.replace(
    /<meta\s+name="perplexity:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="perplexity:description" content="${escapeHtml(page.description)}" />\n    <meta name="ai:summary" content="${escapeHtml(page.description)}" />\n    <meta name="aeo:primary-answer" content="${escapeHtml(page.description)}" />`
  );

  // 3. Replace <link rel="canonical" ...> and all <link rel="alternate" hreflang ...>
  html = html.replace(
    /\s*<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*\/?>/gi,
    ''
  );
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />\n    ${hreflangLinksHtml}`
  );

  // 4. Replace OpenGraph & Twitter URL/Title/Description/Locale/SiteName/Alt
  html = html.replace(
    /<meta\s+property="og:site_name"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:site_name" content="${escapeHtml(geoCfg.siteName)}" />`
  );
  html = html.replace(
    /\s*<meta\s+property="og:locale:alternate"\s+content="[^"]*"\s*\/?>/gi,
    ''
  );
  html = html.replace(
    /<meta\s+property="og:locale"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:locale" content="${escapeHtml(langOpt.ogLocale)}" />\n    ${alternateOgLocalesHtml}`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image:alt" content="${escapeHtml(geoCfg.ogImageAlt)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`
  );

  // 4.5. Replace Schema.org JSON-LD with Localized Graph
  html = html.replace(
    /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
    buildLocalizedJsonLd(page, lang, cleanRoutePath, canonicalUrl, keywords)
  );

  const archiveSummaryLabel = lang === 'KR'
    ? `${escapeHtml(page.h1)} — 텍스트 가이드 아카이브 (Text Reference Guide)`
    : `${escapeHtml(page.h1)} — Text Reference Guide`;

  const aeoHubHtml = buildAeoAnswerHubHtml(page, lang, cleanRoutePath);

  // 5. Replace <div id="root">...</div> inner content AND <details id="seo-prerender-archive"> with route-specific visible semantic HTML
  const rootReplacement = `<div id="root">
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px 16px; background-color: #FBFBF9; color: #11161B;">
        <div style="font-size: 12px; font-weight: 800; letter-spacing: 0.08em; color: #5B7332; background: #F3F7EC; padding: 6px 14px; border-radius: 999px; margin-bottom: 16px;">STEPLESS IN BUSAN</div>
        <div style="font-size: 24px; font-weight: 900; line-height: 1.35; margin: 0 0 10px 0; color: #11161B; max-width: 680px;">${escapeHtml(page.h1)}</div>
        <p style="font-size: 14px; color: #64748B; margin: 0; max-width: 560px;">${escapeHtml(page.lead)}</p>
      </div>
      <div class="prerender-seo-shell" style="max-width: 1120px; margin: 0 auto; padding: 24px 16px; line-height: 1.65;">
        ${buildCommonHeader(page.h1, page.lead, page.h1, cleanRoutePath, lang)}
        <main>
          ${page.bodyHtml}
          ${aeoHubHtml}
        </main>
        ${buildCommonFooter(lang)}
      </div>
    </div>

    <details id="seo-prerender-archive" style="max-width: 1120px; margin: 0 auto; padding: 8px 16px 24px; font-size: 12px; color: #64748B; line-height: 1.65;">
      <summary style="cursor: pointer; font-weight: 600; color: #94A3B8; list-style: none; text-align: center;">${archiveSummaryLabel}</summary>
      <div style="margin-top: 12px;">
        ${page.bodyHtml}
        ${aeoHubHtml}
      </div>
    </details>`;

  html = html.replace(
    /<div id="root">[\s\S]*?<\/details>/i,
    rootReplacement
  );

  return html;
}

function generateMultilingualSitemapXml(basePages: StaticRoutePage[]): string {
  const today = '2026-11-06';
  const allLangs: Language[] = ['KR', 'EN', 'JA', 'ZH_TW', 'ZH_CN', 'ES', 'FR'];
  const urlBlocks: string[] = [];

  // Deduplicate clean route paths (skip /search/:id aliases in sitemap so only canonical /station/:id is submitted)
  const canonicalBasePages = basePages.filter(p => !p.routePath.startsWith('/search/'));

  for (const basePage of canonicalBasePages) {
    const cleanPath = basePage.routePath;
    const xhtmlLinks = getHreflangEntries(cleanPath)
      .map(
        e =>
          `    <xhtml:link rel="alternate" hreflang="${escapeHtml(e.hreflang)}" href="${escapeHtml(e.href)}" />`
      )
      .join('\n');

    const priority = cleanPath === '/' ? '1.0' : cleanPath.startsWith('/tips/courses') || cleanPath.startsWith('/station/') ? '0.9' : '0.8';

    for (const lang of allLangs) {
      const locPath = buildLocalizedPath(cleanPath, lang);
      const fullLoc = `https://stepless.kr${locPath === '/' ? '/' : locPath}`;
      urlBlocks.push(`  <url>
    <loc>${escapeHtml(fullLoc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
${xhtmlLinks}
  </url>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks.join('\n')}
</urlset>
`;
}

function main() {
  const distDir = path.join(process.cwd(), 'dist');
  const templatePath = path.join(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error('[SSG] dist/index.html not found. Run vite build first.');
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(templatePath, 'utf-8');
  const basePages = buildAllStaticPages();
  const allLangs: Language[] = ['KR', 'EN', 'JA', 'ZH_TW', 'ZH_CN', 'ES', 'FR'];

  let generatedCount = 0;
  for (const basePage of basePages) {
    const cleanRoutePath = basePage.routePath;
    for (const lang of allLangs) {
      const localizedPage = localizeStaticPage(basePage, lang);
      const outHtml = generateRouteHtml(templateHtml, localizedPage, lang, cleanRoutePath);

      const relPath = localizedPage.routePath.replace(/^\/+/, '').replace(/\/+$/, '');
      if (!relPath) {
        // Root '/' (KR)
        fs.writeFileSync(templatePath, outHtml, 'utf-8');
        generatedCount++;
        continue;
      }

      // 1. Write dist/<relPath>/index.html
      const outDir = path.join(distDir, relPath);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'index.html'), outHtml, 'utf-8');

      // 2. Also write dist/<relPath>.html
      const flatFilePath = path.join(distDir, `${relPath}.html`);
      fs.mkdirSync(path.dirname(flatFilePath), { recursive: true });
      fs.writeFileSync(flatFilePath, outHtml, 'utf-8');

      if (lang === 'KR') {
        if (cleanRoutePath === '/about') {
          fs.writeFileSync(path.join(distDir, 'about.html'), outHtml, 'utf-8');
        } else if (cleanRoutePath === '/about/privacy') {
          fs.writeFileSync(path.join(distDir, 'privacy.html'), outHtml, 'utf-8');
        } else if (cleanRoutePath === '/about/terms') {
          fs.writeFileSync(path.join(distDir, 'terms.html'), outHtml, 'utf-8');
        }
      }

      generatedCount++;
    }
  }

  // Generate multilingual sitemap.xml with xhtml:link hreflang annotations
  const sitemapXml = generateMultilingualSitemapXml(basePages);
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemapXml, 'utf-8');

  console.log(`[SSG] Successfully generated ${generatedCount} multilingual static HTML pages across 7 languages and updated sitemap.xml!`);
}

main();
