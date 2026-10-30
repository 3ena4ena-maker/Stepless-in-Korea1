import React from 'react';
import { Language } from '../i18n/dictionary';

export interface NearbyPlaceExit {
  num: string;
  type: 'elevator' | 'escalator' | 'both';
}

export interface NearbyPlace {
  name: string;
  desc: string;
  exits?: NearbyPlaceExit[];
}

export const STATION_PLACES_DATA: Record<string, Record<'KR' | 'EN' | 'JA' | 'ZH_TW' | 'ZH_CN', NearbyPlace[]>> = {
  seomyeon: {
    KR: [
      { name: '✨ 서면 젊음의 거리', desc: '문화 행사, 맛집, 분위기 좋은 카페 등 즐길 거리가 가득한 중심가', exits: [{ num: '7', type: 'elevator' }] },
      { name: '🏢 삼정타워', desc: '다채로운 이색 맛집, 오락 시설, 영화관을 품은 복합 문화 몰', exits: [{ num: '1', type: 'escalator' }] }
    ],
    EN: [
      { name: '✨ Seomyeon Youth Street', desc: 'Vibrant center filled with various restaurants, cafes, and shopping spots', exits: [{ num: '7', type: 'elevator' }] },
      { name: '🏢 Samjung Tower', desc: 'A multi-complex lifestyle mall featuring dining, entertainment, and a cinema', exits: [{ num: '1', type: 'escalator' }] }
    ],
    JA: [
      { name: '✨ 西面（ソミョン）若者の街', desc: 'グルメ・おしゃれなカフェ・ショッピングが集まる釜山最大の繁華街', exits: [{ num: '7', type: 'elevator' }] },
      { name: '🏢 サムジョンタワー（Samjung Tower）', desc: '人気レストランやキャラクターショップ、カフェが入った複合商業ビル', exits: [{ num: '1', type: 'escalator' }] }
    ],
    ZH_TW: [
      { name: '✨ 西面青春街', desc: '匯聚釜山人氣美食、質感咖啡廳與逛街購物的最熱鬧商圈', exits: [{ num: '7', type: 'elevator' }] },
      { name: '🏢 三正塔（Samjung Tower）', desc: '結合特色餐廳、文創選物店與娛樂設施的大型複合商場', exits: [{ num: '1', type: 'escalator' }] }
    ],
    ZH_CN: [
      { name: '✨ 西面青春街', desc: '汇聚釜山人气美食、网红咖啡馆与潮流购物的核心商圈', exits: [{ num: '7', type: 'elevator' }] },
      { name: '🏢 三正塔（Samjung Tower）', desc: '集特色餐饮、潮玩文创店与娱乐设施于一体的大型综合商场', exits: [{ num: '1', type: 'escalator' }] }
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
    ],
    JA: [
      { name: '☕ 田浦（チョンポ）カフェ通り', desc: '個性豊かなロースタリーカフェやデザート店が並ぶ人気エリア', exits: [{ num: '7', type: 'escalator' }] },
      { name: '🎨 田浦サイッキル（雑貨・工房路地）', desc: 'かわいい雑貨店や独立系書店、ヴィンテージショップが集まる平坦な路地', exits: [{ num: '4', type: 'elevator' }, { num: '8', type: 'escalator' }] }
    ],
    ZH_TW: [
      { name: '☕ 田浦咖啡街', desc: '釜山最具代表性的質感手沖咖啡與甜點名店聚集地', exits: [{ num: '7', type: 'escalator' }] },
      { name: '🎨 田浦小巷（文創選物街）', desc: '充滿可愛雜貨鋪、獨立書店與復古選物店的平坦散步巷弄', exits: [{ num: '4', type: 'elevator' }, { num: '8', type: 'escalator' }] }
    ],
    ZH_CN: [
      { name: '☕ 田浦咖啡街', desc: '釜山最具代表性的精品手冲咖啡与甜品名店聚集地', exits: [{ num: '7', type: 'escalator' }] },
      { name: '🎨 田浦小巷（文创杂货街）', desc: '遍布可爱杂货铺、独立书店与复古买手店的平坦漫步巷弄', exits: [{ num: '4', type: 'elevator' }, { num: '8', type: 'escalator' }] }
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
    ],
    JA: [
      { name: '🥬 釜田（プジョン）伝統市場', desc: '高麗人参や新鮮な海産物、ローカルグルメが揃う釜山最大級の在来市場', exits: [{ num: '1', type: 'elevator' }, { num: '3', type: 'elevator' }] },
      { name: '🌳 宋象賢（ソン・サンヒョン）広場', desc: 'ベビーカーや車椅子でのんびり散策できる都心の広い芝生広場', exits: [{ num: '6', type: 'elevator' }] }
    ],
    ZH_TW: [
      { name: '🥬 釜田傳統市場', desc: '匯聚人蔘市場、新鮮水產與道地小吃的釜山最大規模傳統市場', exits: [{ num: '1', type: 'elevator' }, { num: '3', type: 'elevator' }] },
      { name: '🌳 宋象賢廣場', desc: '路面平坦寬敞、適合推嬰兒車散步休憩的市中心大型綠地廣場', exits: [{ num: '6', type: 'elevator' }] }
    ],
    ZH_CN: [
      { name: '🥬 釜田传统市场', desc: '汇聚人参市场、新鲜水产与地道小吃的釜山最大规模传统市场', exits: [{ num: '1', type: 'elevator' }, { num: '3', type: 'elevator' }] },
      { name: '🌳 宋象贤广场', desc: '路面平坦宽敞、适合推婴儿车散步休憩的市中心大型绿地广场', exits: [{ num: '6', type: 'elevator' }] }
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
    ],
    JA: [
      { name: '🏖️ 海雲台（ヘウンデ）海水浴場', desc: '亀南路（クナムロ）広場から海岸デッキまで段差なしでつながる釜山代表ビーチ', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] },
      { name: '🍢 海雲台伝統市場', desc: 'シアホットクや海鮮グルメ、屋台食べ歩きが楽しめる平坦な市場通り', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] }
    ],
    ZH_TW: [
      { name: '🏖️ 海雲台海水浴場', desc: '沿著龜南路廣場平地直通海濱木棧道的韓國代表性海灘', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] },
      { name: '🍢 海雲台傳統市場', desc: '聚集糖餅、盲鰻、辣炒年糕與海鮮小吃的平坦美食市場街', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] }
    ],
    ZH_CN: [
      { name: '🏖️ 海云台海水浴场', desc: '沿着龟南路广场平地直通海滨木栈道的韩国代表性海滩', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] },
      { name: '🍢 海云台传统市场', desc: '聚集坚果糖饼、盲鳗、辣炒年糕与海鲜小吃的平坦美食市场街', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] }
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
    ],
    JA: [
      { name: '🌉 広安里（クァンアンリ）海水浴場', desc: '広安大橋の夜景と週末のドローンショーが楽しめる海辺の平坦な遊歩道', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] },
      { name: '☕ オーシャンビュー・カフェ通り', desc: '広安里の海を一望できる絶景カフェ＆レストラン通り', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] }
    ],
    ZH_TW: [
      { name: '🌉 廣安里海水浴場', desc: '飽覽廣安大橋璀璨夜景與週末無人機燈光秀的平坦海濱步道', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] },
      { name: '☕ 廣安里海景咖啡街', desc: '整排面對蔚藍海景與跨海大橋的超人氣景觀咖啡廳', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] }
    ],
    ZH_CN: [
      { name: '🌉 广安里海水浴场', desc: '饱览广安大桥璀璨夜景与周末无人机灯光秀的平坦海滨步道', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] },
      { name: '☕ 广安里海景咖啡街', desc: '整排正对蔚蓝海景与跨海大桥的超人气景观咖啡馆', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] }
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
    ],
    JA: [
      { name: '🗼 龍頭山（ヨンドゥサン）公園・釜山タワー', desc: '釜山港と旧市街を一望できるランドマーク展望台（光復路エスカレーター連絡）', exits: [{ num: '7', type: 'elevator' }] },
      { name: '🌉 影島大橋（ヨンドデギョ）＆ロッテ百貨店光復店', desc: '韓国唯一の跳ね橋と屋上展望台が人気の百貨店（地下直結）', exits: [{ num: '6', type: 'escalator' }, { num: '8', type: 'both' }] }
    ],
    ZH_TW: [
      { name: '🗼 龍頭山公園＆釜山鑽石塔', desc: '俯瞰釜山港與南浦洞全景的經典地標公園', exits: [{ num: '7', type: 'elevator' }] },
      { name: '🌉 影島大橋＆樂天百貨光復店', desc: '每週六開橋的歷史名橋，百貨頂樓設有免費海景空中花園', exits: [{ num: '6', type: 'escalator' }, { num: '8', type: 'both' }] }
    ],
    ZH_CN: [
      { name: '🗼 龙头山公园＆釜山钻石塔', desc: '俯瞰釜山港与南浦洞全景的经典地标公园', exits: [{ num: '7', type: 'elevator' }] },
      { name: '🌉 影岛大桥＆乐天百货光复店', desc: '每周六开桥的历史名桥，商场顶楼设有免费海景空中花园', exits: [{ num: '6', type: 'escalator' }, { num: '8', type: 'both' }] }
    ]
  },
  busan: {
    KR: [
      { name: '🍕 이재모피자 & 🇨🇳 차이나타운', desc: '부산의 명물 이재모피자와 맛있는 중식 만두를 즐길 수 있는 이색 특화 거리', exits: [{ num: '5', type: 'elevator' }] }
    ],
    EN: [
      { name: '🍕 Lee Jae Mo Pizza & 🇨🇳 Chinatown', desc: "Enjoy Busan's legendary pizza alongside delicious authentic Chinese dumplings on this unique cultural street", exits: [{ num: '5', type: 'elevator' }] }
    ],
    JA: [
      { name: '🍕 イジェモピザ＆🇨🇳 チャイナタウン（上海街）', desc: '釜山名物の絶品チーズピザ名店と老舗の餃子が楽しめる異国情緒あふれる平坦な通り', exits: [{ num: '4', type: 'elevator' }] }
    ],
    ZH_TW: [
      { name: '🍕 李在模披薩＆🇨🇳 釜山中華街（上海街）', desc: '品嚐釜山傳奇起司披薩名店與手工煎餃的平坦異國風情街區', exits: [{ num: '4', type: 'elevator' }] }
    ],
    ZH_CN: [
      { name: '🍕 李在模披萨＆🇨🇳 釜山中华街（上海街）', desc: '品尝釜山传奇芝士披萨名店与手工煎饺的平坦异国风情街区', exits: [{ num: '4', type: 'elevator' }] }
    ]
  },
  suyeong: {
    KR: [
      { name: '🌾 수영사적공원', desc: '고즈넉한 역사 유적지와 오래된 거목 공원', exits: [{ num: '1', type: 'elevator' }] }
    ],
    EN: [
      { name: '🌾 Suyeong Sajeok Park', desc: 'Shaded historical site with giant ancient trees', exits: [{ num: '1', type: 'elevator' }] }
    ],
    JA: [
      { name: '🌾 水営（スヨン）史跡公園＆八道市場', desc: '樹齢数百年の巨木が茂る静かな歴史公園と活気あるローカル市場', exits: [{ num: '2', type: 'elevator' }] }
    ],
    ZH_TW: [
      { name: '🌾 水營史蹟公園＆水營八道市場', desc: '古木參天的寧靜歷史遺址公園與充滿人情味的在地傳統市場', exits: [{ num: '2', type: 'elevator' }] }
    ],
    ZH_CN: [
      { name: '🌾 水营史迹公园＆水营八道市场', desc: '古木参天的宁静历史遗址公园与充满烟火气的本地传统市场', exits: [{ num: '2', type: 'elevator' }] }
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
    ],
    JA: [
      { name: '🐟 チャガルチ市場＆屋上展望台', desc: '新鮮な海鮮料理と南港の海を一望できるバリアフリー屋上デッキ（8・10番間エレベーター）', exits: [{ num: '8·10', type: 'elevator' }] },
      { name: '🎬 BIFF広場・国際市場・富平カントン市場', desc: '元祖シアホットク屋台から夜市まで平坦に歩ける旧市街の中心スポット', exits: [{ num: '3·5', type: 'elevator' }] }
    ],
    ZH_TW: [
      { name: '🐟 札嘎其市場＆頂樓海景展望台', desc: '品嚐現撈海鮮並可搭電梯直達頂樓免費觀景台眺望南港海景', exits: [{ num: '8·10', type: 'elevator' }] },
      { name: '🎬 BIFF廣場・國際市場・富平罐頭夜市', desc: '品嚐元祖堅果糖餅與逛遍釜山最熱鬧傳統市場的平坦拱廊路線', exits: [{ num: '3·5', type: 'elevator' }] }
    ],
    ZH_CN: [
      { name: '🐟 札嘎其市场＆顶楼海景展望台', desc: '品尝现捞海鲜并可乘直梯直达顶楼免费观景台眺望南港海景', exits: [{ num: '8·10', type: 'elevator' }] },
      { name: '🎬 BIFF广场・国际市场・富平罐头夜市', desc: '品尝元祖坚果糖饼与逛遍釜山最热闹传统市场的平坦拱廊路线', exits: [{ num: '3·5', type: 'elevator' }] }
    ]
  },
  geumnyeonsan: {
    KR: [
      { name: '🏖️ 광안리 해수욕장 남측', desc: '조용한 해상 산책로 및 남천동 빵천동 디저트거리', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] }
    ],
    EN: [
      { name: '🏖️ South Gwangalli Beach & Namcheon Bakery Alley', desc: 'Tranquil southern beach area & famous dessert street', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] }
    ],
    JA: [
      { name: '🏖️ 広安里海水浴場（西側）＆デザート通り', desc: '広安駅よりも混雑が少なく、緩やかな歩道で海辺まで出られる穴場ルート', exits: [{ num: '3', type: 'elevator' }] }
    ],
    ZH_TW: [
      { name: '🏖️ 廣安里海水浴場（西側）＆甜點街', desc: '人潮較廣安站清幽，沿平緩步道即可輕鬆抵達廣安里海灘與海景咖啡廳', exits: [{ num: '3', type: 'elevator' }] }
    ],
    ZH_CN: [
      { name: '🏖️ 广安里海水浴场（西侧）＆甜品街', desc: '人流比广安站清幽，沿平缓步道即可轻松抵达广安里海滩与海景咖啡馆', exits: [{ num: '3', type: 'elevator' }] }
    ]
  },
  dongbaek: {
    KR: [
      { name: '🌺 동백섬 & 누리마루 APEC하우스', desc: '해안 산책로와 동백꽃이 어우러진 해운대 대표 명소', exits: [{ num: '1', type: 'elevator' }] }
    ],
    EN: [
      { name: '🌺 Dongbaekseom Island & Nurimaru APEC House', desc: 'Scenic coastal walking trails & APEC house', exits: [{ num: '1', type: 'elevator' }] }
    ],
    JA: [
      { name: '🌺 冬柏島（トンベクソム）＆ザ・ベイ101', desc: '海辺のウッドデッキ遊歩道と摩天楼の夜景が美しいバリアフリー散策スポット', exits: [{ num: '1', type: 'elevator' }] }
    ],
    ZH_TW: [
      { name: '🌺 冬柏島＆The Bay 101 夜景', desc: '結合海濱平坦木棧道、APEC世峰樓與摩天大樓璀璨倒影的代表景點', exits: [{ num: '1', type: 'elevator' }] }
    ],
    ZH_CN: [
      { name: '🌺 冬柏岛＆The Bay 101 夜景', desc: '结合海滨平坦木栈道、APEC世峰楼与摩天大楼璀璨倒影的代表景点', exits: [{ num: '1', type: 'elevator' }] }
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
    ],
    JA: [
      { name: '🏛️ BEXCO（釜山展示コンベンションセンター）', desc: '大型展示会やコンサートが開催される国際コンベンション施設', exits: [{ num: '1', type: 'elevator' }, { num: '7', type: 'elevator' }] },
      { name: '🖼️ 釜山市立美術館（イ・ウファン空間）', desc: 'バリアフリー設備が整った現代美術館と彫刻庭園', exits: [{ num: '1', type: 'elevator' }, { num: '3', type: 'elevator' }] }
    ],
    ZH_TW: [
      { name: '🏛️ BEXCO 釜山國際會展中心', desc: '舉辦國際展覽、釜山電玩展（G-STAR）與大型演唱會的會展地標', exits: [{ num: '1', type: 'elevator' }, { num: '7', type: 'elevator' }] },
      { name: '🖼️ 釜山市立美術館（李禹煥空間）', desc: '全館設有完善無障礙電梯與坡道的現代藝術美術館', exits: [{ num: '1', type: 'elevator' }, { num: '3', type: 'elevator' }] }
    ],
    ZH_CN: [
      { name: '🏛️ BEXCO 釜山国际会展中心', desc: '举办国际展览、釜山游戏展（G-STAR）与大型演唱会的会展地标', exits: [{ num: '1', type: 'elevator' }, { num: '7', type: 'elevator' }] },
      { name: '🖼️ 釜山市立美术馆（李禹焕空间）', desc: '全馆配备完善无障碍直梯与坡道的现代艺术美术馆', exits: [{ num: '1', type: 'elevator' }, { num: '3', type: 'elevator' }] }
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
    ],
    JA: [
      { name: '📜 40階段文化観光テーマ通り', desc: 'レトロな街並みと個性派カフェが集まる歴史文化ストリート', exits: [{ num: '12', type: 'elevator' }, { num: '14', type: 'elevator' }] },
      { name: '🏛️ 釜山近現代歴史館', desc: '旧韓国銀行釜山本部を活用した見ごたえ抜群の歴史文化ラウンジ', exits: [{ num: '12', type: 'elevator' }, { num: '14', type: 'elevator' }] }
    ],
    ZH_TW: [
      { name: '📜 40階梯文化觀光主題街', desc: '充滿懷舊復古氛圍與特色咖啡館的釜山近代歷史街區', exits: [{ num: '12', type: 'elevator' }, { num: '14', type: 'elevator' }] },
      { name: '🏛️ 釜山近現代歷史館', desc: '結合歷史展覽與金庫咖啡廳的免費無障礙文化空間', exits: [{ num: '12', type: 'elevator' }, { num: '14', type: 'elevator' }] }
    ],
    ZH_CN: [
      { name: '📜 40阶梯文化观光主题街', desc: '充满怀旧复古氛围与特色咖啡馆的釜山近代历史街区', exits: [{ num: '12', type: 'elevator' }, { num: '14', type: 'elevator' }] },
      { name: '🏛️ 釜山近现代历史馆', desc: '结合历史展览与金库咖啡馆的免费无障碍文化空间', exits: [{ num: '12', type: 'elevator' }, { num: '14', type: 'elevator' }] }
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
    ],
    JA: [
      { name: '🌅 多大浦（タデポ）海水浴場＆夢の落照噴水', desc: '幻想的な夕日と世界最大級の音楽噴水ショーが楽しめるバリアフリー海辺公園', exits: [{ num: '4', type: 'both' }] },
      { name: '🌾 ゴウニ生態探訪路（木道デッキ）', desc: '干潟と葦原の上をベビーカー・車椅子のまま散歩できる完全フラットな木道', exits: [{ num: '4', type: 'both' }, { num: '2', type: 'both' }] }
    ],
    ZH_TW: [
      { name: '🌅 多大浦海水浴場＆夢之夕陽噴泉', desc: '擁有絕美晚霞與世界最大規模地面音樂噴泉的平坦海濱公園', exits: [{ num: '4', type: 'both' }] },
      { name: '🌾 高友尼生態木棧道＆沒雲台', desc: '橫跨河口濕地與蘆葦叢的全平坦無障礙木棧道，嬰兒車與輪椅極致友善', exits: [{ num: '4', type: 'both' }, { num: '2', type: 'both' }] }
    ],
    ZH_CN: [
      { name: '🌅 多大浦海水浴场＆梦之夕阳喷泉', desc: '拥有绝美晚霞与世界最大规模地面音乐喷泉的平坦海滨公园', exits: [{ num: '4', type: 'both' }] },
      { name: '🌾 高友尼生态木栈道＆没云台', desc: '横跨河口湿地与芦苇丛的全平坦无障碍木栈道，婴儿车与轮椅极其友好', exits: [{ num: '4', type: 'both' }, { num: '2', type: 'both' }] }
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
    ],
    JA: [
      { name: '⛩️ 梵魚寺（ポモサ・金井山の千年古刹）', desc: '4・6番間エレベーター下車後、90番循環バス乗り換えで行く釜山代表の名刹', exits: [{ num: '4·6', type: 'elevator' }] },
      { name: '⛰️ 金井山（クムジョンサン）麓グルメ村', desc: '緑豊かな渓谷沿いに豆腐料理や韓国伝統グルメ店が並ぶエリア', exits: [{ num: '4·6', type: 'elevator' }] }
    ],
    ZH_TW: [
      { name: '⛩️ 梵魚寺（金井山千年古剎）', desc: '由 4・6號出口間電梯至地面後轉乘 90號公車直達的釜山代表性佛教古寺', exits: [{ num: '4·6', type: 'elevator' }] },
      { name: '⛰️ 金井山森林步道＆青龍洞美食村', desc: '匯聚山泉豆腐料理與傳統韓定食的清幽山麓街區', exits: [{ num: '4·6', type: 'elevator' }] }
    ],
    ZH_CN: [
      { name: '⛩️ 梵鱼寺（金井山千年古刹）', desc: '由 4・6号出口间直梯至地面后换乘 90路公交直达的釜山代表性佛教古寺', exits: [{ num: '4·6', type: 'elevator' }] },
      { name: '⛰️ 金井山森林步道＆青龙洞美食村', desc: '汇聚山泉豆腐料理与传统韩定食的清幽山麓街区', exits: [{ num: '4·6', type: 'elevator' }] }
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
    ],
    JA: [
      { name: '🏬 新世界百貨店センタムシティ店＆スパランド', desc: '地下1階改札階から段差なしで直結！10・12番出口間の地上エレベーターも完備', exits: [{ num: '10·12', type: 'elevator' }] },
      { name: '🎬 映画の殿堂＆🖼️ ミュージアムワン / 市立美術館', desc: '釜山国際映画祭のメイン会場とメディアアート美術館（1番出口から平坦連絡）', exits: [{ num: '1', type: 'elevator' }, { num: '3·5', type: 'elevator' }] }
    ],
    ZH_TW: [
      { name: '🏬 新世界百貨 Centum City店＆Spa Land 汗蒸幕', desc: '由 B1 穿堂層零階梯直通百貨內部，亦設有 10・12號出口間地面電梯', exits: [{ num: '10·12', type: 'elevator' }] },
      { name: '🎬 電影殿堂＆🖼️ Museum 1 / 釜山市立美術館', desc: '釜山國際影展主場館與沉浸式媒體藝術展館（全區平坦人行道連接）', exits: [{ num: '1', type: 'elevator' }, { num: '3·5', type: 'elevator' }] }
    ],
    ZH_CN: [
      { name: '🏬 新世界百货 Centum City店＆Spa Land 汗蒸幕', desc: '由 B1 站厅层无台阶直通商场内部，亦配备 10・12号出口间地面直梯', exits: [{ num: '10·12', type: 'elevator' }] },
      { name: '🎬 电影殿堂＆🖼️ Museum 1 / 釜山市立美术馆', desc: '釜山国际电影节主场馆与沉浸式媒体艺术展馆（全区平坦步道连接）', exits: [{ num: '1', type: 'elevator' }, { num: '3·5', type: 'elevator' }] }
    ]
  },
  sasang: {
    KR: [
      { name: '✈️ 김해국제공항 환승 & 부산서부버스터미널', desc: '실내 환승통로로 공항경전철 연결 및 3·4번 출구 엘리베이터로 버스터미널 평지 이동', exits: [{ num: '경전철 1', type: 'both' }, { num: '3', type: 'both' }, { num: '4', type: 'both' }] },
      { name: '🌸 삼락생태공원', desc: '낙동강변 광활한 평지 산책로와 계절 꽃단지 (경전철 2번 출구·르네시떼역 연계)', exits: [{ num: '경전철 2', type: 'both' }] }
    ],
    EN: [
      { name: '✈️ Gimhae Airport LRT & West Busan Bus Terminal', desc: 'Step-free transfer to Gimhae Airport Light Rail & Exits 3/4 elevators to Bus Terminal', exits: [{ num: 'LRT 1', type: 'both' }, { num: '3', type: 'both' }, { num: '4', type: 'both' }] },
      { name: '🌸 Samnak Ecological Park', desc: 'Expansive flat riverside park and seasonal flower trails along the Nakdong River', exits: [{ num: 'LRT 2', type: 'both' }] }
    ],
    JA: [
      { name: '✈️ 金海国際空港 軽電鉄乗換＆釜山西部バスターミナル', desc: '地下連絡通路で空港軽電鉄へ段差なし乗換・3番/4番出口からバスターミナルへ平坦直結', exits: [{ num: '軽電鉄 1', type: 'both' }, { num: '3', type: 'both' }, { num: '4', type: 'both' }] },
      { name: '🌸 三楽（サムナク）生態公園', desc: '洛東江沿いに広がる平坦な桜並木と季節の花畑散策コース', exits: [{ num: '軽電鉄 2', type: 'both' }] }
    ],
    ZH_TW: [
      { name: '✈️ 金海國際機場輕軌轉乘＆釜山西部巴士客運站', desc: '經室內轉乘通道直達機場輕軌，3號・4號出口電梯平地直通西部客運站與 Apple Outlet', exits: [{ num: '輕軌 1', type: 'both' }, { num: '3', type: 'both' }, { num: '4', type: 'both' }] },
      { name: '🌸 三樂生態公園', desc: '洛東江畔廣闊平坦的櫻花走廊與四季花海濕地公園', exits: [{ num: '輕軌 2', type: 'both' }] }
    ],
    ZH_CN: [
      { name: '✈️ 金海国际机场轻轨换乘＆釜山西部长途汽车站', desc: '经室内换乘通道直达机场轻轨，3号・4号出口直梯平地直通西部汽车站与 Apple Outlet', exits: [{ num: '轻轨 1', type: 'both' }, { num: '3', type: 'both' }, { num: '4', type: 'both' }] },
      { name: '🌸 三乐生态公园', desc: '洛东江畔广阔平坦的樱花长廊与四季花海湿地公园', exits: [{ num: '轻轨 2', type: 'both' }] }
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
    ],
    JA: [
      { name: '🎨 甘川（カムチョン）文化村（マウルバス乗換）', desc: '4・6番間エレベーターで地上へ → 平坦な歩道で6番出口前（釜山大病院前）バス停から西区2・2-2番乗車', exits: [{ num: '4·6', type: 'elevator' }] },
      { name: '🏛️ 臨時首都記念通り＆東亜大富民キャンパス', desc: '近代歴史建築と博物館が並ぶ落ち着いた文化散策ストリート', exits: [{ num: '5', type: 'elevator' }] }
    ],
    ZH_TW: [
      { name: '🎨 甘川文化村（社區巴士無障礙轉乘）', desc: '搭 4・6號間電梯至地面 → 平坦步行 1 分鐘至 6號出口釜山大醫院前搭乘西區2、2-2或沙下區1-1小巴', exits: [{ num: '4·6', type: 'elevator' }] },
      { name: '🏛️ 臨時首都紀念街＆東亞大學博物館', desc: '保存近代歷史建築與總統官邸庭園的文化散步街區', exits: [{ num: '5', type: 'elevator' }] }
    ],
    ZH_CN: [
      { name: '🎨 甘川文化村（社区小巴无障碍换乘）', desc: '乘 4・6号间直梯至地面 → 平坦步行 1 分钟至 6号出口釜山大医院前换乘西区2、2-2或沙下区1-1路小巴', exits: [{ num: '4·6', type: 'elevator' }] },
      { name: '🏛️ 临时首都纪念街＆东亚大学博物馆', desc: '保存近代历史建筑与总统官邸庭园的文化漫步街区', exits: [{ num: '5', type: 'elevator' }] }
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
    ],
    JA: [
      { name: '🎢 ロッテワールド・アドベンチャー釜山＆スカイライン・リュージュ', desc: '3番平坦出口前のエレベーター付き専用歩道橋で大通りを安全に渡って直結', exits: [{ num: '3番平坦出口＋歩道橋EV', type: 'elevator' }] },
      { name: '🔬 国立釜山科学館＆⛩️ 海東龍宮寺・ロッテアウトレット', desc: '家族向け科学館と海辺の絶景寺院・大型アウトレット（1番平坦出口広場から連絡）', exits: [{ num: '1番平坦出口', type: 'both' }] }
    ],
    ZH_TW: [
      { name: '🎢 釜山樂天世界＆Skyline Luge 斜坡滑車', desc: '由 3號平地出口前附設電梯的專用行人天橋安全跨越馬路直達園區', exits: [{ num: '3號平地出口＋天橋電梯', type: 'elevator' }] },
      { name: '🔬 國立釜山科學館＆⛩️ 海東龍宮寺・樂天Outlet', desc: '親子互動科學館、海岸絕景寺廟與東釜山樂天名牌折扣中心（1號平地出口轉乘）', exits: [{ num: '1號平地出口', type: 'both' }] }
    ],
    ZH_CN: [
      { name: '🎢 釜山乐天世界＆Skyline Luge 斜坡滑车', desc: '由 3号平地出口前配备直梯的专用过街天桥安全跨越马路直达园区', exits: [{ num: '3号平地出口＋天桥直梯', type: 'elevator' }] },
      { name: '🔬 国立釜山科学馆＆⛩️ 海东龙宫寺・乐天奥特莱斯', desc: '亲子互动科学馆、海岸绝景寺庙与东釜山乐天奥特莱斯（1号平地出口换乘）', exits: [{ num: '1号平地出口', type: 'both' }] }
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
    ],
    JA: [
      { name: '🚂 海雲台ブルーラインパーク 松亭停車場（海辺列車）', desc: '尾浦〜青沙浦〜松亭の海岸絶景を走るバリアフリー海辺列車の始発駅（2番平坦出口から徒歩約8分）', exits: [{ num: '2番平坦出口', type: 'both' }] },
      { name: '🏖️ 松亭（ソンジョン）海水浴場＆竹島公園', desc: '穏やかな砂浜の平坦な遊歩道とオーシャンビューカフェ通り', exits: [{ num: '1番平坦出口', type: 'both' }, { num: '2番平坦出口', type: 'both' }] }
    ],
    ZH_TW: [
      { name: '🚂 海雲台藍線公園 松亭站（海岸列車）', desc: '串聯尾浦～青沙浦～松亭的無障礙海景列車起點站（2號平地出口步行約 8 分鐘）', exits: [{ num: '2號平地出口', type: 'both' }] },
      { name: '🏖️ 松亭海水浴場＆竹島公園', desc: '坡度平緩的海濱散步步道、衝浪海灣與海景咖啡廳街', exits: [{ num: '1號平地出口', type: 'both' }, { num: '2號平地出口', type: 'both' }] }
    ],
    ZH_CN: [
      { name: '🚂 海云台蓝线公园 松亭站（海滨列车）', desc: '串联尾浦～青沙浦～松亭的无障碍海景列车起点站（2号平地出口步行约 8 分钟）', exits: [{ num: '2号平地出口', type: 'both' }] },
      { name: '🏖️ 松亭海水浴场＆竹岛公园', desc: '坡度平缓的海滨漫步步道、冲浪海湾与海景咖啡馆街', exits: [{ num: '1号平地出口', type: 'both' }, { num: '2号平地出口', type: 'both' }] }
    ]
  },
  namcheon: {
    KR: [
      { name: '🥐 남천동 빵천동 (베이커리 투어 거리)', desc: '부산 3대 빵집부터 개성 넘치는 로컬 베이커리·디저트 카페가 밀집한 평지 골목', exits: [{ num: '1', type: 'elevator' }] },
      { name: '🌸 광안리 해변 남단 & 삼익비치 산책로', desc: '남천해변시장과 광안대교를 가장 가까이서 마주하는 여유로운 해안 평지 산책길', exits: [{ num: '1', type: 'elevator' }] }
    ],
    EN: [
      { name: '🥐 Namcheon Bakery Street ("Ppangcheon-dong")', desc: "Flat neighborhood alleys famous for Busan's top artisan bakeries and dessert cafes", exits: [{ num: '1', type: 'elevator' }] },
      { name: '🌸 South Gwangalli Beach & Samik Beach Walk', desc: 'Peaceful coastal promenade right beside Gwangandaegyo Bridge', exits: [{ num: '1', type: 'elevator' }] }
    ],
    JA: [
      { name: '🥐 南川洞パンチョンドン（ベーカリー巡り通り）', desc: '釜山3大パン屋から人気のパティスリー・カフェが集まる平坦なベーカリー街', exits: [{ num: '1', type: 'elevator' }] },
      { name: '🌸 広安里ビーチ南端＆サムイクビーチ海岸散歩道', desc: '広安大橋を間近に望む穏やかな海辺の平坦な遊歩道と桜並木', exits: [{ num: '1', type: 'elevator' }] }
    ],
    ZH_TW: [
      { name: '🥐 南川洞麵包街（麵包川洞）', desc: '匯聚釜山三大麵包店與人氣甜點咖啡廳的平坦巷弄美食區', exits: [{ num: '1', type: 'elevator' }] },
      { name: '🌸 廣安里海灘南端＆三益海灘散步道', desc: '近距離仰望廣安大橋、春季賞櫻與海風漫步的平坦海岸步道', exits: [{ num: '1', type: 'elevator' }] }
    ],
    ZH_CN: [
      { name: '🥐 南川洞面包街（面包川洞）', desc: '汇聚釜山三大面包店与人气甜品咖啡馆的平坦巷弄美食区', exits: [{ num: '1', type: 'elevator' }] },
      { name: '🌸 广安里海滩南端＆三益海滩漫步道', desc: '近距离仰望广安大桥、春季赏樱与海风漫步的平坦海岸步道', exits: [{ num: '1', type: 'elevator' }] }
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
    ],
    JA: [
      { name: '♨️ 東莱温泉 露天足湯＆虚心庁（ホシムチョン）/ 金剛公園', desc: '歩道橋エレベーターで大通りを安全に渡って行く名湯スパとロープウェイ公園', exits: [{ num: '歩道橋EV', type: 'both' }, { num: '3·7', type: 'both' }] },
      { name: '🌸 温泉川（オンチョンチョン）水辺散策路', desc: '2番・4番出口の階段横スロープからそのまま出られる平坦な川沿い遊歩道', exits: [{ num: '3·7', type: 'both' }, { num: '2·4番（スロープ）', type: 'escalator' }] }
    ],
    ZH_TW: [
      { name: '♨️ 東萊溫泉露天足浴湯＆虛心廳 / 金剛公園', desc: '搭乘天橋電梯安全跨越馬路，造訪千年溫泉汗蒸幕與金剛公園纜車', exits: [{ num: '天橋電梯', type: 'both' }, { num: '3·7', type: 'both' }] },
      { name: '🌸 溫泉川水岸步道＆咖啡街', desc: '由 2號、4號出口階梯旁緩坡道即可免爬樓梯直達的平坦河濱步道', exits: [{ num: '3·7', type: 'both' }, { num: '2·4號（緩坡道）', type: 'escalator' }] }
    ],
    ZH_CN: [
      { name: '♨️ 东莱温泉露天足浴汤＆虚心厅 / 金刚公园', desc: '乘坐过街天桥直梯安全跨越马路，造访千年温泉汗蒸幕与金刚公园缆车', exits: [{ num: '天桥直梯', type: 'both' }, { num: '3·7', type: 'both' }] },
      { name: '🌸 温泉川水岸步道＆咖啡街', desc: '由 2号、4号出口楼梯旁缓坡道即可无台阶直达的平坦河滨步道', exits: [{ num: '3·7', type: 'both' }, { num: '2·4号（缓坡道）', type: 'escalator' }] }
    ]
  }
};

export const STATION_PLACES_DATA_ES_FR: Record<string, Record<'ES' | 'FR', NearbyPlace[]>> = {
  seomyeon: {
    ES: [
      { name: '✨ Calle de la Juventud de Seomyeon', desc: 'Vibrante zona peatonal repleta de restaurantes, cafeterías de diseño y tiendas de moda', exits: [{ num: '7', type: 'elevator' }] },
      { name: '🏢 Samjung Tower', desc: 'Centro comercial de estilo de vida con restaurantes temáticos, tiendas y cine', exits: [{ num: '1', type: 'escalator' }] }
    ],
    FR: [
      { name: '✨ Rue de la Jeunesse de Seomyeon', desc: 'Quartier animé regorgeant de restaurants populaires, cafés branchés et boutiques', exits: [{ num: '7', type: 'elevator' }] },
      { name: '🏢 Samjung Tower', desc: 'Centre commercial multi-loisirs réunissant restaurants, boutiques et cinéma', exits: [{ num: '1', type: 'escalator' }] }
    ]
  },
  jeonpo: {
    ES: [
      { name: '☕ Calle de Cafeterías de Jeonpo', desc: 'El barrio cafetero más famoso de Busan con tostadores artesanales y pastelerías', exits: [{ num: '7', type: 'escalator' }] },
      { name: '🎨 Callejón Creativo de Jeonpo (Saetgil)', desc: 'Encantadoras tiendas de diseño, papelerías y talleres independientes en calles llanas', exits: [{ num: '4', type: 'elevator' }, { num: '8', type: 'escalator' }] }
    ],
    FR: [
      { name: '☕ Rue des Cafés de Jeonpo', desc: 'Le quartier emblématique des cafés artisanaux, torréfacteurs et pâtisseries de Busan', exits: [{ num: '7', type: 'escalator' }] },
      { name: '🎨 Ruelles Créatives de Jeonpo (Saetgil)', desc: 'Boutiques de créateurs, papeteries et ateliers nichés dans des ruelles plates', exits: [{ num: '4', type: 'elevator' }, { num: '8', type: 'escalator' }] }
    ]
  },
  bujeon: {
    ES: [
      { name: '🥬 Mercado Tradicional de Bujeon', desc: 'El mayor mercado tradicional de Busan, famoso por productos frescos, ginseng y comida local', exits: [{ num: '1', type: 'elevator' }, { num: '3', type: 'elevator' }] },
      { name: '🌳 Plaza Song Sang-hyeon', desc: 'Amplio parque urbano completamente llano ideal para pasear con cochecito o silla de ruedas', exits: [{ num: '6', type: 'elevator' }] }
    ],
    FR: [
      { name: '🥬 Marché Traditionnel de Bujeon', desc: 'Le plus grand marché traditionnel de Busan, réputé pour ses produits frais et sa cuisine locale', exits: [{ num: '1', type: 'elevator' }, { num: '3', type: 'elevator' }] },
      { name: '🌳 Esplanade Song Sang-hyeon', desc: 'Vaste parc urbain plat et verdoyant, idéal pour une promenade en poussette ou fauteuil roulant', exits: [{ num: '6', type: 'elevator' }] }
    ]
  },
  haeundae: {
    ES: [
      { name: '🏖️ Playa de Haeundae', desc: 'La playa más icónica de Corea conectada sin escalones por la avenida peatonal Gunam-ro', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] },
      { name: '🍢 Mercado Tradicional de Haeundae', desc: 'Callejón gastronómico llano con mariscos, hotteok de semillas y comida callejera', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] }
    ],
    FR: [
      { name: '🏖️ Plage de Haeundae', desc: 'La plage la plus célèbre de Corée, accessible sans marche par la promenade piétonne Gunam-ro', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] },
      { name: '🍢 Marché Traditionnel de Haeundae', desc: 'Allée gourmande plate proposant fruits de mer, hotteok au miel et spécialités de rue', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] }
    ]
  },
  gwangan: {
    ES: [
      { name: '🌉 Playa de Gwangalli', desc: 'Paseo marítimo llano con vistas espectaculares al Puente Gwangan y show de drones nocturno', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] },
      { name: '☕ Calle de Cafeterías con Vista al Mar', desc: 'Cafeterías y restaurantes panorámicos frente al mar de Gwangalli', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] }
    ],
    FR: [
      { name: '🌉 Plage de Gwangalli', desc: 'Promenade de bord de mer offrant une vue imprenable sur le pont Gwangan et le spectacle de drones', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] },
      { name: '☕ Rue des Cafés Vue Mer', desc: 'Cafés et restaurants panoramiques faisant face à la baie de Gwangalli', exits: [{ num: '3', type: 'elevator' }, { num: '5', type: 'elevator' }] }
    ]
  },
  nampo: {
    ES: [
      { name: '🗼 Parque Yongdusan y Torre de Busan', desc: 'Mirador histórico con vistas panorámicas al puerto de Busan y al casco antiguo', exits: [{ num: '7', type: 'elevator' }] },
      { name: '🌉 Puente Yeongdodaegyo y Lotte Gwangbok', desc: 'Histórico puente levadizo y grandes almacenes con terraza mirador gratuita', exits: [{ num: '6', type: 'escalator' }, { num: '8', type: 'both' }] }
    ],
    FR: [
      { name: '🗼 Parc Yongdusan & Tour de Busan', desc: 'Belvédère emblématique offrant un panorama sur le port de Busan et la vieille ville', exits: [{ num: '7', type: 'elevator' }] },
      { name: '🌉 Pont Yeongdodaegyo & Lotte Gwangbok', desc: 'Pont levant historique et grand magasin doté d’un jardin-terrasse gratuit avec vue sur mer', exits: [{ num: '6', type: 'escalator' }, { num: '8', type: 'both' }] }
    ]
  },
  busan: {
    ES: [
      { name: '🍕 Pizza Lee Jae Mo y 🇨🇳 Barrio Chino (Chinatown)', desc: 'La legendaria pizzería de Busan y restaurantes tradicionales de empanadillas chinas en una calle llana', exits: [{ num: '5', type: 'elevator' }] }
    ],
    FR: [
      { name: '🍕 Pizza Lee Jae Mo & 🇨🇳 Quartier Chinois (Chinatown)', desc: 'Dégustez la pizza légendaire de Busan et d’authentiques raviolis chinois dans une rue plate', exits: [{ num: '5', type: 'elevator' }] }
    ]
  },
  suyeong: {
    ES: [
      { name: '🌾 Parque Histórico de Suyeong y Mercado Paldo', desc: 'Tranquilo parque arbolado con murallas históricas y animado mercado tradicional local', exits: [{ num: '1', type: 'elevator' }] }
    ],
    FR: [
      { name: '🌾 Parc Historique de Suyeong & Marché Paldo', desc: 'Parc paisible aux arbres centenaires bordé d’un marché traditionnel animé', exits: [{ num: '1', type: 'elevator' }] }
    ]
  },
  jagalchi: {
    ES: [
      { name: '🐟 Mercado de Pescado de Jagalchi y Mirador', desc: 'El mercado de mariscos más famoso de Corea con mirador gratuito accesible en ascensor', exits: [{ num: '10', type: 'elevator' }] },
      { name: '🎬 Plaza BIFF y Mercado Gukje', desc: 'Famosos puestos de hotteok de semillas y galerías comerciales tradicionales sin escalones', exits: [{ num: '7', type: 'elevator' }] }
    ],
    FR: [
      { name: '🐟 Marché aux Poissons de Jagalchi & Belvédère', desc: 'Le plus célèbre marché aux fruits de mer de Corée avec toit-terrasse accessible en ascenseur', exits: [{ num: '10', type: 'elevator' }] },
      { name: '🎬 Place BIFF & Marché Gukje', desc: 'Stands de hotteok aux graines et galeries marchandes historiques sur terrain plat', exits: [{ num: '7', type: 'elevator' }] }
    ]
  },
  geumnyeonsan: {
    ES: [
      { name: '🏖️ Playa de Gwangalli (Sector Oeste) y Calle de Postres', desc: 'Ruta tranquila y llana hacia la playa de Gwangalli y sus cafeterías de repostería', exits: [{ num: '2', type: 'elevator' }] }
    ],
    FR: [
      { name: '🏖️ Plage de Gwangalli (Secteur Ouest) & Rue des Desserts', desc: 'Accès calme et plat vers la plage de Gwangalli et ses salons de thé réputés', exits: [{ num: '2', type: 'elevator' }] }
    ]
  },
  dongbaek: {
    ES: [
      { name: '🌺 Isla Dongbaekseom y Casa APEC Nurimaru / The Bay 101', desc: 'Sendero costero escénico y mirador nocturno frente a los rascacielos de Marine City', exits: [{ num: '1', type: 'elevator' }] }
    ],
    FR: [
      { name: '🌺 Île de Dongbaekseom, Nurimaru APEC & The Bay 101', desc: 'Promenade côtière aménagée et vue nocturne spectaculaire sur les gratte-ciel de Marine City', exits: [{ num: '1', type: 'elevator' }] }
    ]
  },
  bexco: {
    ES: [
      { name: '🏛️ Centro de Convenciones BEXCO', desc: 'Recinto internacional de exposiciones, ferias y conciertos con accesibilidad total', exits: [{ num: '7', type: 'elevator' }, { num: '9', type: 'elevator' }] },
      { name: '🖼️ Museo de Arte de Busan (Espacio Lee Ufan)', desc: 'Museo de arte contemporáneo y jardín de esculturas totalmente accesible con rampas y ascensores', exits: [{ num: '5', type: 'elevator' }] }
    ],
    FR: [
      { name: '🏛️ Centre des Congrès et Expositions BEXCO', desc: 'Grand complexe international accueillant salons, expositions et concerts', exits: [{ num: '7', type: 'elevator' }, { num: '9', type: 'elevator' }] },
      { name: '🖼️ Musée d’Art de Busan (Espace Lee Ufan)', desc: 'Musée d’art contemporain et parc de sculptures entièrement accessibles', exits: [{ num: '5', type: 'elevator' }] }
    ]
  },
  jungang: {
    ES: [
      { name: '📜 Calle Cultural de los 40 Escalones', desc: 'Barrio histórico conmemorativo de la posguerra rodeado de cafeterías de autor en calles llanas', exits: [{ num: '14', type: 'elevator' }] },
      { name: '🏛️ Museo de Historia Moderna y Contemporánea de Busan', desc: 'Espacio cultural gratuito con exposiciones históricas y cafetería en el antiguo Banco de Corea', exits: [{ num: '12', type: 'elevator' }, { num: '14', type: 'elevator' }] }
    ],
    FR: [
      { name: '📜 Rue Culturelle des 40 Marches', desc: 'Quartier historique d’après-guerre entouré de cafés rétro sur des rues plates', exits: [{ num: '14', type: 'elevator' }] },
      { name: '🏛️ Musée d’Histoire Moderne et Contemporaine de Busan', desc: 'Espace culturel gratuit entièrement accessible installé dans l’ancienne Banque de Corée', exits: [{ num: '12', type: 'elevator' }, { num: '14', type: 'elevator' }] }
    ]
  },
  dadaepo: {
    ES: [
      { name: '🌅 Playa de Dadaepo y Fuente Musical del Atardecer', desc: 'Inmenso parque costero famoso por sus puestas de sol y la mayor fuente musical de suelo del mundo', exits: [{ num: '4', type: 'both' }] },
      { name: '🌾 Sendero Ecológico Gouni (Pasarela de Madera)', desc: 'Pasarela de madera 100 % sin escalones sobre el humedal costero, ideal para cochecitos y sillas de ruedas', exits: [{ num: '4', type: 'both' }] }
    ],
    FR: [
      { name: '🌅 Plage de Dadaepo & Fontaine Musicale du Coucher de Soleil', desc: 'Vaste parc côtier célèbre pour ses couchers de soleil et sa spectaculaire fontaine musicale', exits: [{ num: '4', type: 'both' }] },
      { name: '🌾 Sentier Écologique Gouni (Promenade sur Pilotis)', desc: 'Passerelle en bois 100 % plate au-dessus des marais côtiers, idéale pour poussettes et fauteuils roulants', exits: [{ num: '4', type: 'both' }] }
    ]
  },
  beomeosa: {
    ES: [
      { name: '⛩️ Templo Beomeosa (Templo Milenario del Monte Geumjeongsan)', desc: 'Emblemático templo budista accesible haciendo transbordo al autobús n.º 90 o en taxi', exits: [{ num: '4', type: 'elevator' }] },
      { name: '⛰️ Senderos de Geumjeongsan y Aldea Gastronómica de Cheongryong', desc: 'Restaurantes tradicionales de tofu y cocina coreana al pie de la montaña', exits: [{ num: '4', type: 'elevator' }] }
    ],
    FR: [
      { name: '⛩️ Temple Beomeosa (Temple Millénaire du Mont Geumjeongsan)', desc: 'Grand temple bouddhiste historique accessible via le bus n° 90 ou en taxi', exits: [{ num: '4', type: 'elevator' }] },
      { name: '⛰️ Piémont de Geumjeongsan & Village Gourmand', desc: 'Restaurants traditionnels de tofu et spécialités coréennes au pied de la montagne', exits: [{ num: '4', type: 'elevator' }] }
    ]
  },
  'centum-city': {
    ES: [
      { name: '🏬 Shinsegae Centum City y Spa Land', desc: 'El mayor complejo de grandes almacenes del mundo conectado sin escalones desde el vestíbulo B1', exits: [{ num: '2', type: 'elevator' }, { num: '4', type: 'elevator' }] },
      { name: '🎬 Busan Cinema Center y 🖼️ Museum 1', desc: 'Sede oficial del Festival Internacional de Cine de Busan y museo de arte inmersivo', exits: [{ num: '13', type: 'elevator' }] }
    ],
    FR: [
      { name: '🏬 Shinsegae Centum City & Spa Land', desc: 'Le plus grand complexe de grands magasins au monde, relié sans marche depuis le niveau B1', exits: [{ num: '2', type: 'elevator' }, { num: '4', type: 'elevator' }] },
      { name: '🎬 Busan Cinema Center & 🖼️ Museum 1', desc: 'Palais officiel du Festival International du Film de Busan et musée d’art numérique immersif', exits: [{ num: '13', type: 'elevator' }] }
    ]
  },
  sasang: {
    ES: [
      { name: '✈️ Tren Ligero al Aeropuerto de Gimhae y Terminal de Autobuses', desc: 'Transbordo cubierto al tren ligero del aeropuerto y acceso llano por Salidas 3 y 4 a la terminal', exits: [{ num: 'LRT 2', type: 'both' }, { num: '3', type: 'both' }, { num: '4', type: 'elevator' }] },
      { name: '🌸 Parque Ecológico Samnak', desc: 'Inmenso parque ribereño completamente llano junto al río Nakdong', exits: [{ num: 'LRT 2', type: 'both' }] }
    ],
    FR: [
      { name: '✈️ Métro Léger Aéroport de Gimhae & Terminal de Bus Ouest', desc: 'Correspondance couverte vers l’aéroport et accès plat au terminal de bus par les Sorties 3 et 4', exits: [{ num: 'LRT 2', type: 'both' }, { num: '3', type: 'both' }, { num: '4', type: 'elevator' }] },
      { name: '🌸 Parc Écologique de Samnak', desc: 'Immense parc fluvial entièrement plat le long du fleuve Nakdong', exits: [{ num: 'LRT 2', type: 'both' }] }
    ]
  },
  toseong: {
    ES: [
      { name: '🎨 Aldea Cultural de Gamcheon (Transbordo a microbús)', desc: 'Sal por el ascensor de la Salida 4 y camina 1 min por acera llana hasta la parada de autobús frente a la Salida 6', exits: [{ num: '4', type: 'elevator' }] },
      { name: '🏛️ Calle Conmemorativa de la Capital Provisional', desc: 'Barrio histórico con museos y jardines de la antigua residencia presidencial', exits: [{ num: '2', type: 'elevator' }] }
    ],
    FR: [
      { name: '🎨 Village Culturel de Gamcheon (Correspondance minibus)', desc: 'Prenez l’ascenseur de la Sortie 4 puis marchez 1 min à plat jusqu’à l’arrêt de bus devant la Sortie 6', exits: [{ num: '4', type: 'elevator' }] },
      { name: '🏛️ Rue Mémorielle de la Capitale Provisoire', desc: 'Quartier patrimonial abritant musées et jardins de l’ancienne résidence présidentielle', exits: [{ num: '2', type: 'elevator' }] }
    ]
  },
  osiria: {
    ES: [
      { name: '🎢 Lotte World Adventure Busan y Skyline Luge', desc: 'Gran parque temático conectado directamente mediante pasarela peatonal con ascensor', exits: [{ num: '1', type: 'elevator' }] },
      { name: '🔬 Museo Nacional de Ciencias de Busan y ⛩️ Templo Haedong Yonggungsa', desc: 'Museo interactivo familiar y famoso templo costero junto al complejo Lotte Premium Outlets', exits: [{ num: '1', type: 'elevator' }] }
    ],
    FR: [
      { name: '🎢 Lotte World Adventure Busan & Skyline Luge', desc: 'Grand parc d’attractions relié en toute sécurité par une passerelle piétonne avec ascenseur', exits: [{ num: '1', type: 'elevator' }] },
      { name: '🔬 Musée National des Sciences & ⛩️ Temple Haedong Yonggungsa', desc: 'Musée scientifique familial, temple côtier renommé et centre Lotte Premium Outlets', exits: [{ num: '1', type: 'elevator' }] }
    ]
  },
  songjeong: {
    ES: [
      { name: '🚂 Estación Songjeong del Tren Costero Haeundae Blueline Park', desc: 'Estación terminal del pintoresco tren costero sin escalones (a 8 min a pie llano desde la Salida 2)', exits: [{ num: '2', type: 'both' }] },
      { name: '🏖️ Playa de Songjeong y Parque Jukdo', desc: 'Paseo marítimo de arena suave y cafeterías frente al mar', exits: [{ num: '1', type: 'both' }, { num: '2', type: 'both' }] }
    ],
    FR: [
      { name: '🚂 Gare de Songjeong du Train Côtier Haeundae Blueline Park', desc: 'Terminus du train panoramique côtier accessible sans marche (8 min à pied à plat depuis la Sortie 2)', exits: [{ num: '2', type: 'both' }] },
      { name: '🏖️ Plage de Songjeong & Parc Jukdo', desc: 'Promenade de plage en pente douce et cafés avec vue sur l’océan', exits: [{ num: '1', type: 'both' }, { num: '2', type: 'both' }] }
    ]
  },
  namcheon: {
    ES: [
      { name: '🥐 Calle de Panaderías de Namcheon-dong ("Bbangcheon-dong")', desc: 'Callejones llanos famosos por reunir las mejores panaderías artesanales y pastelerías de Busan', exits: [{ num: '4', type: 'elevator' }] },
      { name: '🌸 Extremo Sur de la Playa de Gwangalli y Paseo Samik Beach', desc: 'Paseo marítimo llano y tranquilo con vistas cercanas al Puente Gwangan', exits: [{ num: '4', type: 'elevator' }] }
    ],
    FR: [
      { name: '🥐 Rue des Boulangeries de Namcheon-dong (« Bbangcheon-dong »)', desc: 'Quartier plat réputé pour ses boulangeries artisanales et pâtisseries parmi les meilleures de Busan', exits: [{ num: '4', type: 'elevator' }] },
      { name: '🌸 Sud de la Plage de Gwangalli & Promenade Samik Beach', desc: 'Promenade côtière plate et paisible au plus près du pont Gwangan', exits: [{ num: '4', type: 'elevator' }] }
    ]
  },
  oncheonjang: {
    ES: [
      { name: '♨️ Baño de Pies Termal de Dongnae y Spa Hurshimchung / Parque Geumgang', desc: 'Cruza con seguridad por el ascensor de la pasarela hacia las históricas aguas termales', exits: [{ num: '1', type: 'elevator' }, { num: '3', type: 'elevator' }] },
      { name: '🌸 Paseo Fluvial de Oncheoncheon y Calle de Cafeterías', desc: 'Sendero llano junto al arroyo accesible directamente por las rampas sin escalones de las Salidas 2 y 4', exits: [{ num: '2', type: 'escalator' }, { num: '4', type: 'escalator' }] }
    ],
    FR: [
      { name: '♨️ Bain de Pieds Thermal de Dongnae & Spa Hurshimchung / Parc Geumgang', desc: 'Traversez en toute sécurité vers les sources thermales historiques et le parc Geumgang', exits: [{ num: '1', type: 'elevator' }, { num: '3', type: 'elevator' }] },
      { name: '🌸 Promenade au Bord de l’Oncheoncheon & Rue des Cafés', desc: 'Sentier plat au bord de l’eau accessible sans marche grâce aux rampes des Sorties 2 et 4', exits: [{ num: '2', type: 'escalator' }, { num: '4', type: 'escalator' }] }
    ]
  }
};

export const getNearbyPlaces = (stationId: string, lang: Language): NearbyPlace[] => {
  if (lang === 'ES' || lang === 'FR') {
    return STATION_PLACES_DATA_ES_FR[stationId]?.[lang] || STATION_PLACES_DATA[stationId]?.EN || [];
  }
  return STATION_PLACES_DATA[stationId]?.[lang] || STATION_PLACES_DATA[stationId]?.EN || [];
};

export const NearbyExitBadge = ({ num, type, line, language }: { num: string; type: 'elevator' | 'escalator' | 'both'; line: string; language: Language; key?: React.Key }) => {
  let accentColor = '#F06A00';
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
  } else if (line === '김해' || num.includes('경전철') || num.includes('LRT') || num.includes('軽電鉄') || num.includes('輕軌') || num.includes('轻轨')) {
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

  const formatNumLabel = () => {
    const hasCustomSuffix = /출구|Exit|出口|경사로|Ramp|スロープ|坡道|EV|電梯|直梯/.test(num);
    if (hasCustomSuffix || !/\d/.test(num)) return num;
    if (language === 'KR') return `${num}번 출구`;
    if (language === 'JA') return `${num}番出口`;
    if (language === 'ZH_TW') return `${num}號出口`;
    if (language === 'ZH_CN') return `${num}号出口`;
    if (language === 'ES') return `Salida ${num}`;
    if (language === 'FR') return `Sortie ${num}`;
    return `Exit ${num}`;
  };

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10.5px] font-bold bg-white/90 shadow-2xs ${borderColorClass}`}>
      {iconSvg}
      <span>{formatNumLabel()}</span>
    </span>
  );
};
