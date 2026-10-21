/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 한국관광공사 (KTO) TourAPI 공통 연동 및 매칭 서비스
 * 여행 코스 추천 및 각 상세 페이지에서 관광지명/키워드로
 * 한국관광공사 OpenAPI 데이터 및 무장애 편의시설 정보를 공통 조회할 수 있도록 지원합니다.
 */

import { useState, useEffect } from 'react';
import { OpenApiPlaceDetail, getKoreaTourApiPlaceDetail, KOREA_TOUR_API_PLACE_DETAILS } from '../data/koreaTourApiPlaceDetails';
import { fetchTourApiPlaceDetail, TourApiDetailResponse } from './tourApiService';

/**
 * 인메모리 캐시: 동일 세션 내 중복 네트워크 호출 방지
 */
const tourApiDetailCache = new Map<string, TourApiDetailResponse>();

/**
 * 관광지명, 코스 스텝 제목 등 다양한 텍스트로부터 등록된 한국관광공사 스팟 ID를 매칭합니다.
 */
export function matchTourApiSpotId(titleOrText: string): string | null {
  if (!titleOrText) return null;
  const raw = titleOrText.trim();
  const t = raw.toLowerCase();

  // 1. 직접 ID 지정된 경우
  if (t.startsWith('spot-') || t.startsWith('tour-')) {
    if (getKoreaTourApiPlaceDetail(t)) return t;
  }

  // 띄어쓰기, 하이픈, 괄호, 특수기호를 제거하여 "해운대 해수욕장"과 "해운대해수욕장"을 완전히 동일하게 처리
  const clean = t.replace(/[\s_\-·~()&/]+/g, '');
  if (!clean) return null;

  // 1-2. KOREA_TOUR_API_PLACE_DETAILS의 nameKo와 공백 무시 일치 확인
  for (const [id, item] of Object.entries(KOREA_TOUR_API_PLACE_DETAILS)) {
    const itemClean = item.nameKo.toLowerCase().replace(/[\s_\-·~()&/]+/g, '');
    if (itemClean === clean) {
      return id;
    }
  }

  // 2. 키워드 기반 정밀 매칭 규칙 (우선순위 높은 구체적 단어부터)
  if (clean.includes('누리마루') || clean.includes('동백섬') || clean.includes('동백공원')) {
    return 'spot-108';
  }
  if (clean.includes('블루라인') || clean.includes('해변열차') || clean.includes('스카이캡슐') || clean.includes('미포정거장') || clean.includes('청사포')) {
    return 'spot-blueline';
  }
  if (clean.includes('아쿠아리움') || clean.includes('sealife')) {
    return 'spot-aquarium';
  }
  if (clean.includes('엑스더스카이') || clean.includes('xthesky') || clean.includes('엘시티전망대')) {
    return 'spot-xthesky';
  }
  if (clean.includes('해양박물관') || clean.includes('국립해양')) {
    return 'spot-104';
  }
  if (clean.includes('신세계') || (clean.includes('센텀') && !clean.includes('벡스코') && !clean.includes('시립미술관') && !clean.includes('영화의전당'))) {
    return 'spot-shinsegae-centum';
  }
  if (clean.includes('벡스코') || clean.includes('bexco') || clean.includes('시립미술관')) {
    return 'spot-103';
  }
  if (clean.includes('비프광장') || clean.includes('biff광장')) {
    return 'spot-biff';
  }
  if (clean.includes('영화의전당')) {
    return 'spot-112';
  }
  if (clean.includes('과학관') || clean.includes('부산과학관')) {
    return 'spot-sciencemuseum';
  }
  if (clean.includes('f1963') || clean.includes('키스와이어')) {
    return 'spot-f1963';
  }
  if (clean.includes('감천문화마을') || clean.includes('감천')) {
    return 'spot-gamcheon';
  }
  if (clean.includes('흰여울') || clean.includes('절영해안')) {
    return 'spot-huinnyeoul';
  }
  if (clean.includes('태종대') || clean.includes('다누비')) {
    return 'spot-taejongdae';
  }
  if (clean.includes('이기대') || clean.includes('동생말') || clean.includes('어울마당')) {
    return 'spot-igidae';
  }
  if (clean.includes('해동용궁사') || clean.includes('용궁사')) {
    return 'spot-yonggungsa';
  }
  if (clean.includes('용두산') || clean.includes('부산타워') || clean.includes('다이아몬드타워')) {
    return 'spot-105';
  }
  if (clean.includes('황령산')) {
    return 'spot-hwangnyeongsan';
  }
  if (clean.includes('영도대교')) {
    return 'spot-yeongdodaegyo';
  }
  if (clean.includes('국제시장')) {
    return 'spot-gukje-market';
  }
  if (clean.includes('부평깡통') || clean.includes('깡통시장') || clean.includes('부평시장')) {
    return 'spot-bupyeong-market';
  }
  if (clean.includes('서면종합시장') || clean.includes('서면시장')) {
    return 'spot-seomyeon-market';
  }
  if (clean.includes('해운대시장')) {
    return 'spot-haeundae-market';
  }
  if (clean.includes('부산진시장')) {
    return 'spot-busanjin-market';
  }
  if (clean.includes('자갈치') || clean.includes('남포동biff') || clean.includes('유라리광장')) {
    return 'spot-107';
  }
  if (clean.includes('광안리') || clean.includes('민락수변') || clean.includes('민락더마켓')) {
    return 'spot-111';
  }
  if (clean.includes('송정해수욕장') || clean.includes('송정')) {
    return 'spot-songjeong';
  }
  if (clean.includes('다대포') || clean.includes('고우니')) {
    return 'spot-106';
  }
  if (clean.includes('삼락생태공원') || clean.includes('삼락')) {
    return 'spot-samnak';
  }
  if (clean.includes('을숙도') || clean.includes('현대미술관')) {
    return 'spot-eulsukdo';
  }
  if (clean.includes('범어사') || clean.includes('금정산')) {
    return 'spot-110';
  }
  if (clean.includes('40계단') || clean.includes('사십계단')) {
    return 'spot-109';
  }
  if (clean.includes('해운대') || clean.includes('구남로')) {
    return 'spot-101';
  }
  if (clean.includes('시티투어') || clean.includes('buti')) {
    return 'spot-city-tour-bus';
  }
  if (clean.includes('부산역')) {
    return 'spot-busanstn';
  }
  if (clean.includes('부전시장') || clean.includes('부전마켓')) {
    return 'spot-bujeon-market';
  }
  if (clean.includes('기장시장')) {
    return 'spot-gijang-market';
  }
  if (clean.includes('동래시장')) {
    return 'spot-dongnae-market';
  }
  if (clean.includes('이재모') || clean.includes('leejaemo')) {
    return 'spot-leejaemo';
  }
  if (clean.includes('모모스') || clean.includes('momos')) {
    return 'spot-momos';
  }
  if (clean.includes('톤쇼우') || clean.includes('tonshou')) {
    return 'spot-tonshou';
  }
  if (clean.includes('초량밀면')) {
    return 'spot-choryang-milmyeon';
  }
  if (clean.includes('쌍둥이돼지국밥') || clean.includes('쌍둥이국밥')) {
    return 'spot-twin-pork';
  }
  if (clean.includes('본전돼지국밥') || clean.includes('본전국밥')) {
    return 'spot-bonjeon';
  }
  if (clean.includes('금수복국')) {
    return 'spot-gumsubokguk';
  }
  if (clean.includes('옵스') || clean.includes('ops')) {
    return 'spot-ops-bakery';
  }
  if (clean.includes('뮤지엄원') || clean.includes('museumone') || clean.includes('museum1')) {
    return 'spot-museum1';
  }
  if (clean.includes('부산과학체험관') || clean.includes('과학체험관')) {
    return 'spot-busan-science-center';
  }
  if (clean.includes('부산박물관') || clean.includes('유엔평화')) {
    return 'spot-busan-museum';
  }
  if (clean.includes('119안전체험') || clean.includes('119안전')) {
    return 'spot-busan-119-safety';
  }
  if (clean.includes('어촌민속관') || clean.includes('부산어촌')) {
    return 'spot-busan-fishing-folk';
  }
  if (clean.includes('해양자연사') || clean.includes('부산해양자연사')) {
    return 'spot-busan-marine-natural-history';
  }
  if (clean.includes('구포시장')) {
    return 'spot-gupo-market';
  }
  if (clean.includes('오시게') || clean.includes('노포동')) {
    return 'spot-osige-market';
  }
  if (clean.includes('다대씨파크') || clean.includes('다대포시장')) {
    return 'spot-dadaepo-market';
  }
  if (clean.includes('송정시장')) {
    return 'spot-songjeong-market';
  }
  if (clean.includes('월내시장') || clean.includes('월내')) {
    return 'spot-wolnae-market';
  }
  if (clean.includes('허심청') || clean.includes('동래온천')) {
    return 'spot-hurshimcheong';
  }
  if (clean.includes('온천천')) {
    return 'spot-oncheoncheon';
  }
  if (clean.includes('성보박물관')) {
    return 'spot-seongbo';
  }
  if (clean.includes('오시리아') || clean.includes('롯데월드')) {
    return 'spot-osiria';
  }

  // 3. getKoreaTourApiPlaceDetail를 통한 폴백 조회
  const found = getKoreaTourApiPlaceDetail(t) || getKoreaTourApiPlaceDetail(clean);
  if (found) return found.id;

  return null;
}

/**
 * 모든 카테고리(식도락, 전통시장, 체험, 지하철, 당일치기, N박N일 등)의 장소로부터
 * 무장애 상세 페이지 라우팅에 사용할 고유 target ID를 결정하는 통합 리졸버
 */
export function resolvePlaceTargetId(
  placeOrTitle:
    | {
        id?: string;
        contentId?: string;
        titleKo?: string;
        titleEn?: string;
        nameKo?: string;
      }
    | string
): string {
  if (!placeOrTitle) return 'spot-101';

  if (typeof placeOrTitle === 'string') {
    const raw = placeOrTitle.trim();
    if (!raw) return 'spot-101';
    if (raw.startsWith('spot-') || raw.startsWith('tour-') || /^\d+$/.test(raw)) {
      return raw;
    }
    const matched = matchTourApiSpotId(raw);
    if (matched) return matched;
    const clean = raw.split(':')[0].split('(')[0].trim().replace(/\s+/g, '-');
    return `place-${encodeURIComponent(clean)}`;
  }

  // 객체인 경우: 명시적 스팟 ID(spot- 또는 tour-)가 있으면 최우선 반환
  if (placeOrTitle.id && placeOrTitle.id.trim()) {
    const id = placeOrTitle.id.trim();
    if (id.startsWith('spot-') || id.startsWith('tour-')) {
      return id;
    }
  }
  if (placeOrTitle.contentId && placeOrTitle.contentId.trim()) {
    return placeOrTitle.contentId.trim();
  }
  if (placeOrTitle.id && placeOrTitle.id.trim()) {
    const id = placeOrTitle.id.trim();
    if (/^\d+$/.test(id)) {
      return id;
    }
  }

  const name = placeOrTitle.titleKo || placeOrTitle.nameKo || placeOrTitle.titleEn || '';
  if (name) {
    const matched = matchTourApiSpotId(name);
    if (matched) return matched;
    const clean = name.split(':')[0].split('(')[0].trim().replace(/\s+/g, '-');
    return `place-${encodeURIComponent(clean)}`;
  }

  return placeOrTitle.id || 'spot-101';
}

/**
 * 스팟 ID 또는 텍스트로 비동기 OpenAPI 상세 데이터를 조회하는 공통 함수
 */
export async function getUnifiedTourApiDetail(spotIdOrTitle: string): Promise<TourApiDetailResponse> {
  const resolvedId = matchTourApiSpotId(spotIdOrTitle) || spotIdOrTitle;
  if (!resolvedId) {
    return {
      success: false,
      isLiveApi: false,
      source: '미등록 장소',
      data: null,
      error: '한국관광공사 API 미등록 장소입니다.',
    };
  }

  if (tourApiDetailCache.has(resolvedId)) {
    return tourApiDetailCache.get(resolvedId)!;
  }

  try {
    const res = await fetchTourApiPlaceDetail(resolvedId);
    if (res.success && res.data) {
      tourApiDetailCache.set(resolvedId, res);
    }
    return res;
  } catch (err: any) {
    const fallback = getKoreaTourApiPlaceDetail(resolvedId);
    return {
      success: !!fallback,
      isLiveApi: false,
      source: '한국관광공사 공공데이터포털 KorWithService2 로컬 백업',
      data: fallback,
      error: err?.message,
    };
  }
}

/**
 * 리액트 컴포넌트에서 간편하게 한국관광공사 API 정보를 조회하는 커스텀 훅
 */
export function useTourApiSpot(spotIdOrTitle: string) {
  const resolvedId = matchTourApiSpotId(spotIdOrTitle);
  const [detail, setDetail] = useState<OpenApiPlaceDetail | null>(() =>
    resolvedId ? getKoreaTourApiPlaceDetail(resolvedId) : null
  );
  const [liveBarrierFree, setLiveBarrierFree] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);

  useEffect(() => {
    if (!resolvedId) {
      setDetail(null);
      setLiveBarrierFree(null);
      setLoading(false);
      return;
    }

    // 이미 캐시가 있으면 즉시 반영
    if (tourApiDetailCache.has(resolvedId)) {
      const cached = tourApiDetailCache.get(resolvedId)!;
      if (cached.data) {
        setDetail(cached.data);
        setLiveBarrierFree(cached.liveBarrierFree || null);
        setIsLiveApi(cached.isLiveApi);
        return;
      }
    }

    let isMounted = true;
    setLoading(true);

    getUnifiedTourApiDetail(resolvedId).then((res) => {
      if (!isMounted) return;
      setLoading(false);
      if (res.data) {
        setDetail(res.data);
      }
      if (res.liveBarrierFree) {
        setLiveBarrierFree(res.liveBarrierFree);
      }
      setIsLiveApi(res.isLiveApi);
    });

    return () => {
      isMounted = false;
    };
  }, [resolvedId]);

  return {
    matchedSpotId: resolvedId,
    hasKtoData: !!detail,
    detail,
    liveBarrierFree,
    loading,
    isLiveApi,
  };
}
