import { Language } from "./i18n/dictionary";
import { romanizeWord } from "./types";

const INITIALS = [
  'g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'
];
const VOWELS = [
  'a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'
];
const FINALS = [
  '', 'k', 'kk', 'ks', 'n', 'nj', 'nh', 'd', 'l', 'lg', 'lm', 'lb', 'ls', 'lt', 'lp', 'lh', 'm', 'b', 'bs', 's', 'ss', 'ng', 'j', 'ch', 'k', 't', 'p', 'h'
];

export function romanizeKoreanWord(word: string): string {
  let result = '';
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const codePoint = char.charCodeAt(0);
    if (codePoint >= 0xAC00 && codePoint <= 0xD7A3) {
      const sIndex = codePoint - 0xAC00;
      const lIndex = Math.floor(sIndex / 588);
      const vIndex = Math.floor((sIndex % 588) / 28);
      const tIndex = sIndex % 28;

      let initPart = INITIALS[lIndex] || '';
      const vowelPart = VOWELS[vIndex] || '';
      const finalPart = FINALS[tIndex] || '';

      // Capitalize first letter of words or after spacing
      if (result === '' || /\s$/.test(result)) {
        if (initPart) {
          initPart = initPart.charAt(0).toUpperCase() + initPart.slice(1);
        } else if (vowelPart) {
          result += vowelPart.charAt(0).toUpperCase() + vowelPart.slice(1) + finalPart;
          continue;
        }
      }

      result += initPart + vowelPart + finalPart;
    } else {
      result += char;
    }
  }
  return result;
}

// Full dictionary of common travel/eating words to translate traveler tips
const TRAVEL_WORDS_MAP: Record<string, string> = {
  '옥생관': 'Oksaenggwan',
  '바람': 'Wish (Baram)',
  '탕수육': 'Tangsuyuk (Sweet & Sour Pork)',
  '간짜장': 'Ganjajang',
  '안목': 'Anmok',
  '안목 돼지국밥': 'Anmok Pork Soup',
  '안목 수영본점': 'Anmok Suyeong Main Branch',
  '수영본점': 'Suyeong Main Branch',
  '이재모피자': 'Lee Jae Mo Pizza',
  '서면점': 'Seomyeon Branch',
  '부산역본점': 'Busan Station Main Branch',
  '부산역': 'Busan Station',
  '전포역': 'Jeonpo Station',
  '부전역': 'Bujeon Station',
  '해운대역': 'Haeundae Station',
  '광안역': 'Gwangan Station',
  '남포역': 'Nampo Station',
  '자갈치역': 'Jagalchi Station',
  '영도대교': 'Yeongdo Bridge',
  '영도': 'Yeongdo',
  '대교': 'Bridge',
  '피자': 'Pizza',
  '치즈': 'Cheese',
  '크러스트': 'Crust',
  '쫄깃': 'chewy',
  '전포 사잇길': 'Jeonpo Sait-gil',
  '소품샵': 'Prop Shop',
  '빈티지': 'Vintage',
  '카페': 'Cafe',
  '카페거리': 'Cafe Street',
  '골목': 'Alley',
  '아기자기한': 'cozy & cute',
  '공방': 'craft workshop',
  '독립 서점': 'independent bookstore',
  '편집숍': 'boutique shop',
  '계단없는': 'barrier-free',
  '산책': 'stroll',
  '최고': 'best / superb',
  '알뜰': 'Budget / Saving',
  '무제한': 'Unlimited',
  '정기승차권': 'Commuter Ticket',
  '지하철': 'subway',
  '지하철역': 'subway station',
  '발권기': 'vending machine',
  '지하철 1일 무제한 패스': 'Subway 1-Day Unlimited Pass',
  '1일권': '1-Day Ticket',
  '호선': 'Line',
  '어른': 'Adults',
  '청소년': 'Youths',
  '6,000원': '6,000 KRW',
  '4,000원': '4,000 KRW',
  '웨이팅': 'waiting queue',
  '테이블링': 'Tabling app',
  '이동': 'mobility/access',
  '휠체어': 'wheelchair',
  '유모차': 'stroller',
  '가능': 'possible / accessible',
  '추천': 'Recommend',
  '방문': 'visit',
  '비법': 'tip / secret',
  '부산 로컬': 'Busan locals',
  '여행객': 'travelers',
  '모두': 'all',
  '열광하는': 'enthusiastic / crazy-about',
  
  // Newly added verbs and adjectives to optimize natural language fallback
  '걸어가기': 'Walking across',
  '걸어가도': 'Even if walking',
  '걸어갈 수': 'can walk',
  '완전 강추': 'Highly recommended',
  '강추': 'Highly recommended',
  '몰랐어요': "didn't know",
  '좋았어요': 'it was excellent / loved it',
  '구경할 수 있어서': 'could sightsee',
  '배도 구경할': 'can also watch the boats',
  '배': 'boat/ship',
  '그리고': 'and',
  '있어서': 'because there is',
  '식당': 'restaurant',
  '맛집': 'famous hot place',
  '맛있음': 'delicious',
  '맛있어요': 'delicious',
  '정말': 'really',
  '진짜': 'really',
  '매우': 'very',
  '사람': 'people',
  '시간': 'time',
  '의': 'of',
  '으로': 'to',
  '에서': 'at/from',
  '까지': 'until',
  '과': 'and',
  '와': 'and',
};

// Fixed translation dictionary for the default recommendations to guarantee perfect output
export const FALLBACK_RECS_JA: Record<string, { topic: string; content: string; stationOrExit: string }> = {
  'rec-1': {
    topic: 'イジェモピザ（西面店＆釜山駅本店）',
    stationOrExit: '釜山駅5番出口／田浦駅7番出口付近',
    content: '釜山の地元民も旅行者も熱狂するローカルチーズピザの名店！もちもちのチーズクラストは唯一無二です。待ち時間が長いため、Tablingアプリで順番待ち状況を確認するのがおすすめです。'
  },
  'rec-2': {
    topic: '田浦サイトギル（路地裏）雑貨ショップ＆ヴィンテージカフェ通り',
    stationOrExit: '田浦駅4番・8番出口',
    content: '田浦カフェ通りのすぐ上にある「サイトギル」には、可愛い工房や独立系書店、個性豊かなセレクトショップが集まっています。平坦で歩きやすく、ベビーカーや車椅子での散策にもぴったりです。'
  },
  'rec-3': {
    topic: 'お得な釜山地下鉄1日乗り放題パス',
    stationOrExit: '釜山地下鉄全駅の券売機',
    content: '1日に地下鉄を4回以上利用するなら、1日乗車券が断然お得です！大人6,000ウォン・青少年4,000ウォンで、釜山都市鉄道1〜4号線が当日限り乗り放題になります。'
  }
};

export const FALLBACK_RECS_ZH_TW: Record<string, { topic: string; content: string; stationOrExit: string }> = {
  'rec-1': {
    topic: '李在模披薩（西面店＆釜山站總店）',
    stationOrExit: '釜山站 5號出口／田浦站 7號出口附近',
    content: '釜山在地人與旅客都瘋狂喜愛的起司披薩名店！Q彈濃郁的起司餅皮無可取代。現場候位時間較長，建議事先透過 Tabling App 確認候位狀況。'
  },
  'rec-2': {
    topic: '田浦小巷（Sait-gil）選物店＆復古咖啡街',
    stationOrExit: '田浦站 4號、8號出口',
    content: '位於田浦咖啡街稍往上走的巷弄間，聚集了精緻手作工坊、獨立書店與復古選物店！路面相當平坦好走，非常適合無障礙散步。'
  },
  'rec-3': {
    topic: '超值釜山地鐵一日無限搭乘券',
    stationOrExit: '釜山地鐵各站售票機',
    content: '若一天內預計搭乘地鐵 4 次以上，購買一日券最划算！成人 6,000 韓元、青少年 4,000 韓元，啟用當日可無限次搭乘釜山地鐵 1 至 4 號線。'
  }
};

export const FALLBACK_RECS_ZH_CN: Record<string, { topic: string; content: string; stationOrExit: string }> = {
  'rec-1': {
    topic: '李在模披萨（西面店＆釜山站总店）',
    stationOrExit: '釜山站 5号出口／田浦站 7号出口附近',
    content: '釜山本地人与游客都为之狂热的芝士披萨名店！筋道浓郁的芝士饼边无可替代。现场排队时间较长，建议提前通过 Tabling App 查看排队进度。'
  },
  'rec-2': {
    topic: '田浦小巷（Sait-gil）杂货店＆复古咖啡街',
    stationOrExit: '田浦站 4号、8号出口',
    content: '位于田浦咖啡街稍往上走的街巷里，汇集了精致手作工坊、独立书店与复古买手店！路面十分平坦舒适，非常适合无障碍漫步。'
  },
  'rec-3': {
    topic: '超值釜山地铁一日无限次乘车券',
    stationOrExit: '釜山地铁各站自动售票机',
    content: '如果一天内计划乘坐地铁 4 次以上，购买一日票划算得多！成人 6,000 韩元、青少年 4,000 韩元，启用当日可无限次乘坐釜山地铁 1 至 4 号线。'
  }
};

export const FALLBACK_RECS_EN: Record<string, { topic: string; content: string; stationOrExit: string }> = {
  'rec-1': {
    topic: 'Lee Jae Mo Pizza (Seomyeon & Busan Station Main Branches)',
    stationOrExit: 'Near Busan Station Exit 5 / Jeonpo Station Exit 7',
    content: 'Lee Jae Mo Pizza is the ultimate local cheese pizza shop that both Busan locals and travelers are crazy about! The chewy cheese crust is unmatched. Wait times can be very long, so make sure to check queue status on the Tabling app.'
  },
  'rec-2': {
    topic: 'Jeonpo Sait-gil Prop Shops & Vintage Cafe Alley',
    stationOrExit: 'Jeonpo Station Exits 4 and 8',
    content: 'Just slightly above the main Jeonpo Cafe Street, the Sait-gil (cozy alleyways) is packed with lovely craft shops, independent bookstores, and unique vintage boutiques! It is highly flat and comfortable to walk, making it perfect for custom barrier-free strolls.'
  },
  'rec-3': {
    topic: 'Budget Busan Subway 1-Day Unlimited Pass',
    stationOrExit: 'Ticket vending machines at all Busan subway stations',
    content: 'If you plan to ride the subway 4 or more times in a single day, buying a 1-day pass is much cheaper! It costs 6,000 KRW for adults and 4,000 KRW for youth. You get unlimited rides on Busan Subway lines 1 to 4 on the first day of use!'
  }
};

// Auto-translator fallback for user-submitted recommendations
export function translateTextFallback(text: string): string {
  if (!text) return "";

  let translated = text;

  // Replace terms from TRAVEL_WORDS_MAP
  Object.entries(TRAVEL_WORDS_MAP).forEach(([kr, en]) => {
    const regex = new RegExp(kr, 'g');
    translated = translated.replace(regex, en);
  });

  // Regular expression to replace station & exit name structures (e.g., "서면역 7번출구" -> "Seomyeon Station Exit 7")
  translated = translated.replace(/([가-힣a-zA-Z0-9]+역?)\s*(\d+)번\s*출구/g, (match, station, num) => {
    let englishStation = station;
    if (station.includes("서면")) englishStation = "Seomyeon Station";
    else if (station.includes("전포")) englishStation = "Jeonpo Station";
    else if (station.includes("부전")) englishStation = "Bujeon Station";
    else if (station.includes("해운대")) englishStation = "Haeundae Station";
    else if (station.includes("광안")) englishStation = "Gwangan Station";
    else if (station.includes("남포")) englishStation = "Nampo Station";
    else if (station.includes("자갈치")) englishStation = "Jagalchi Station";
    else if (station.includes("부산")) englishStation = "Busan Station";
    else englishStation = romanizeKoreanWord(station) + " Station";

    return `${englishStation} Exit ${num}`;
  });

  // Replace remaining "X번 출구" or "X번출구"
  translated = translated.replace(/(\d+)번\s*출구/g, "Exit $1");
  translated = translated.replace(/(\d+)번\s*출입/g, "Exit $1");

  // If there are still Hangeul Jamo or characters, clean up or romanize them gently (only for names/short stations)
  const hasHangeul = /[가-힣]/.test(translated);
  if (hasHangeul) {
    translated = romanizeKoreanWord(translated);
  }

  return translated;
}

// Fallback specifically for topics/titles and description content. 
// It replaces known travel words, but leaves other Korean characters as Hangeul.
// This prevents phonetic romanization (e.g., "Geoleogal Su") which native English speakers find completely unreadable and annoying.
export function translateTopicOrContentFallback(text: string): string {
  if (!text) return "";

  let translated = text;

  // Replace terms from TRAVEL_WORDS_MAP
  Object.entries(TRAVEL_WORDS_MAP).forEach(([kr, en]) => {
    const regex = new RegExp(kr, 'g');
    translated = translated.replace(regex, en);
  });

  // Replace explicit station patterns (e.g. "서면역" -> "Seomyeon Station")
  translated = translated.replace(/([가-힣a-zA-Z0-9]+역?)\s*(\d+)번\s*출구/g, (match, station, num) => {
    let englishStation = station;
    if (station.includes("서면")) englishStation = "Seomyeon Station";
    else if (station.includes("전포")) englishStation = "Jeonpo Station";
    else if (station.includes("부전")) englishStation = "Bujeon Station";
    else if (station.includes("해운대")) englishStation = "Haeundae Station";
    else if (station.includes("광안")) englishStation = "Gwangan Station";
    else if (station.includes("남포")) englishStation = "Nampo Station";
    else if (station.includes("자갈치")) englishStation = "Jagalchi Station";
    else if (station.includes("부산")) englishStation = "Busan Station";
    else englishStation = romanizeKoreanWord(station) + " Station";

    return `${englishStation} Exit ${num}`;
  });

  return translated;
}

export function getTodayDate(language: Language = 'KR'): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  if (language === 'EN') {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[month]} ${day}, ${year}`;
  }
  if (language === 'JA' || language === 'ZH_TW' || language === 'ZH_CN') {
    return `${year}年${month + 1}月${day}日`;
  }
  if (language === 'ES' || language === 'FR') {
    return `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;
  }
  return `${year}년 ${month + 1}월 ${day}일`;
}

export function getTodayDateKR(): string {
  return getTodayDate('KR');
}

export function translateRecommendation(
  rec: { id: string; topic: string; content: string; stationOrExit: string },
  language: Language,
  apiTranslated?: { topic: string; content: string; stationOrExit: string }
) {
  if (language === 'KR') {
    return {
      topic: rec.topic,
      content: rec.content,
      stationOrExit: rec.stationOrExit
    };
  }

  // 1. If we have highly accurate API translation, prioritize it
  if (apiTranslated) {
    return apiTranslated;
  }

  // 2. If it is one of the built-in default items, return localized representation
  if (language === 'JA' && FALLBACK_RECS_JA[rec.id]) return FALLBACK_RECS_JA[rec.id];
  if (language === 'ZH_TW' && FALLBACK_RECS_ZH_TW[rec.id]) return FALLBACK_RECS_ZH_TW[rec.id];
  if (language === 'ZH_CN' && FALLBACK_RECS_ZH_CN[rec.id]) return FALLBACK_RECS_ZH_CN[rec.id];
  if (language === 'ES') {
    const esMap: Record<string, { topic: string; content: string; stationOrExit: string }> = {
      'rec-1': {
        topic: 'Pizza Lee Jae Mo (Sucursales de Seomyeon y Estación de Busan)',
        stationOrExit: 'Cerca de Estación de Busan Salida 5 / Estación de Jeonpo Salida 7',
        content: '¡La legendaria pizzería local de queso que apasiona tanto a los habitantes de Busan como a los viajeros! Su borde relleno de queso es inigualable. Te recomendamos consultar la cola en la app Tabling.'
      },
      'rec-2': {
        topic: 'Callejón Sait-gil de Jeonpo: Tiendas de Diseño y Cafeterías Vintage',
        stationOrExit: 'Estación de Jeonpo Salidas 4 y 8',
        content: 'Justo encima de la calle principal de cafeterías de Jeonpo, el callejón Sait-gil reúne talleres artesanales, librerías independientes y tiendas vintage en calles llanas y muy cómodas para pasear sin escalones.'
      },
      'rec-3': {
        topic: 'Abono de 1 Día de Viajes Ilimitados en el Metro de Busan',
        stationOrExit: 'Máquinas expendedoras de todas las estaciones del Metro de Busan',
        content: 'Si planeas usar el metro 4 veces o más en un mismo día, ¡el pase de 1 día es mucho más económico! Cuesta 6.000 KRW para adultos y 4.000 KRW para jóvenes, con viajes ilimitados en las Líneas 1 a 4.'
      }
    };
    if (esMap[rec.id]) return esMap[rec.id];
  }
  if (language === 'FR') {
    const frMap: Record<string, { topic: string; content: string; stationOrExit: string }> = {
      'rec-1': {
        topic: 'Pizza Lee Jae Mo (Succursales de Seomyeon & Gare de Busan)',
        stationOrExit: 'Près de la Station Busan Sortie 5 / Station Jeonpo Sortie 7',
        content: 'La pizzeria au fromage légendaire de Busan adorée des habitants comme des voyageurs ! Sa pâte moelleuse garnie de fromage est unique. Pensez à vérifier la file d’attente sur l’application Tabling.'
      },
      'rec-2': {
        topic: 'Ruelles Sait-gil de Jeonpo : Boutiques de Créateurs & Cafés Vintage',
        stationOrExit: 'Station Jeonpo Sorties 4 et 8',
        content: 'Situées juste au-dessus de la rue des cafés de Jeonpo, les ruelles Sait-gil regorgent d’ateliers, de librairies indépendantes et de boutiques vintage sur un terrain plat idéal pour se promener sans marche.'
      },
      'rec-3': {
        topic: 'Forfait 1 Jour Illimité du Métro de Busan',
        stationOrExit: 'Distributeurs automatiques dans toutes les stations du métro de Busan',
        content: 'Si vous prenez le métro 4 fois ou plus dans la journée, le pass 1 jour est très avantageux ! Il coûte 6 000 KRW (adultes) et 4 000 KRW (jeunes) pour des trajets illimités sur les Lignes 1 à 4.'
      }
    };
    if (frMap[rec.id]) return frMap[rec.id];
  }
  if (FALLBACK_RECS_EN[rec.id]) {
    return FALLBACK_RECS_EN[rec.id];
  }

  // 3. Otherwise, use our smart auto-translator fallback for user elements
  return {
    topic: translateTopicOrContentFallback(rec.topic),
    content: translateTopicOrContentFallback(rec.content),
    stationOrExit: translateTextFallback(rec.stationOrExit)
  };
}

export function translateDirectionItem(text: string, language: Language = 'KR'): string {
  if (!text || language === 'KR') return text || "";

  let res = text.trim();
  res = res.replace(/방면$/g, "").replace(/\s*방면,/g, ",").trim();

  const termMap: Record<string, string> = {
    '행정복지센터': 'Community Service Center',
    '주민센터': 'Community Service Center',
    '초등학교': 'Elementary School',
    '중학교': 'Middle School',
    '고등학교': 'High School',
    '대학교': 'University',
    '부산진소방서': 'Busanjin Fire Station',
    '소방서': 'Fire Station',
    '파출소': 'Police Substation',
    '지구대': 'Police Station',
    '치안센터': 'Police Safety Center',
    '롯데백화점 부산본점': 'Lotte Department Store Main Branch',
    '롯데백화점 광복점': 'Lotte Department Store Gwangbok Branch',
    '롯데백화점': 'Lotte Dept. Store',
    '롯데마트': 'Lotte Mart',
    '부산진구청': 'Busanjin-gu Office',
    '수영구청': 'Suyeong-gu Office',
    '해운대구청': 'Haeundae-gu Office',
    '중구청': 'Jung-gu Office',
    '서구청': 'Seo-gu Office',
    '영광도서': 'Yeongkwang Bookstore',
    '시민공원': 'Citizen Park',
    '해수욕장': 'Beach',
    '광안리 해수욕장': 'Gwangalli Beach',
    '해운대해수욕장': 'Haeundae Beach',
    '신한은행': 'Shinhan Bank',
    '부전시장': 'Bujeon Market',
    '부전전통시장': 'Bujeon Traditional Market',
    '자갈치시장': 'Jagalchi Market',
    '팔도시장': 'Paldo Market',
    '부평깡통시장': 'Bupyeong Kkangtong Market',
    '지하상가': 'Underground Shopping Mall',
    '아파트': 'Apartments',
    '삼거리': 'Junction',
    '사거리': 'Crossroad',
    '교차로': 'Intersection',
  };

  Object.entries(termMap).forEach(([kr, en]) => {
    res = res.replace(new RegExp(kr, 'g'), en);
  });

  return res;
}

/**
 * SPA client-side navigation without full page reload.
 * Uses window.history.pushState and dispatches popstate so all SPA routing listeners
 * in App.tsx and subcomponents trigger seamlessly.
 */
export function navigateToSpa(url: string, state: any = {}): void {
  if (typeof window === 'undefined') return;
  const currentPath = window.location.pathname + window.location.search;
  if (currentPath !== url) {
    window.history.pushState(state, '', url);
  }
  // Dispatch popstate event to notify SPA routing handlers
  window.dispatchEvent(new PopStateEvent('popstate', { state }));
}

