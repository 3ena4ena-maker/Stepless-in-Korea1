/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 한국관광공사 (KTO) TourAPI 공통 연동 및 매칭 서비스
 * 여행 코스 추천 및 각 상세 페이지에서 관광지명/키워드로
 * 한국관광공사 OpenAPI 데이터 및 무장애 편의시설 정보를 공통 조회할 수 있도록 지원합니다.
 */

import { useState, useEffect } from 'react';
import { OpenApiPlaceDetail, getKoreaTourApiPlaceDetail } from '../data/koreaTourApiPlaceDetails';
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
  const t = titleOrText.toLowerCase().trim();

  // 1. 직접 ID 지정된 경우
  if (t.startsWith('spot-') || t.startsWith('tour-')) {
    if (getKoreaTourApiPlaceDetail(t)) return t;
  }

  // 2. 키워드 기반 정밀 매칭 규칙 (우선순위 높은 구체적 단어부터)
  if (t.includes('누리마루') || t.includes('동백섬') || t.includes('동백공원')) {
    return 'spot-108';
  }
  if (t.includes('블루라인') || t.includes('해변열차') || t.includes('스카이캡슐') || t.includes('미포정거장') || t.includes('청사포')) {
    return 'spot-blueline';
  }
  if (t.includes('아쿠아리움') || t.includes('sea life') || t.includes('sealife')) {
    return 'spot-aquarium';
  }
  if (t.includes('엑스더스카이') || t.includes('x the sky') || t.includes('xthesky') || t.includes('엘시티 전망대')) {
    return 'spot-xthesky';
  }
  if (t.includes('해양박물관') || t.includes('국립해양')) {
    return 'spot-104';
  }
  if (t.includes('벡스코') || t.includes('bexco') || t.includes('센텀') || t.includes('시립미술관')) {
    return 'spot-103';
  }
  if (t.includes('비프광장') || t.includes('biff광장') || t.includes('biff 광장') || t.includes('비프 광장')) {
    return 'spot-biff';
  }
  if (t.includes('영화의전당')) {
    return 'spot-112';
  }
  if (t.includes('과학관') || t.includes('부산과학관')) {
    return 'spot-sciencemuseum';
  }
  if (t.includes('f1963') || t.includes('키스와이어')) {
    return 'spot-f1963';
  }
  if (t.includes('감천문화마을') || t.includes('감천')) {
    return 'spot-gamcheon';
  }
  if (t.includes('흰여울') || t.includes('흰여울문화마을') || t.includes('절영해안')) {
    return 'spot-huinnyeoul';
  }
  if (t.includes('태종대') || t.includes('다누비')) {
    return 'spot-taejongdae';
  }
  if (t.includes('해동용궁사') || t.includes('용궁사')) {
    return 'spot-yonggungsa';
  }
  if (t.includes('용두산') || t.includes('부산타워') || t.includes('다이아몬드타워')) {
    return 'spot-105';
  }
  if (t.includes('부평깡통') || t.includes('깡통시장') || t.includes('부평시장') || t.includes('국제시장')) {
    return 'spot-bupyeong-market';
  }
  if (t.includes('자갈치') || t.includes('남포동 biff') || t.includes('유라리광장')) {
    return 'spot-107';
  }
  if (t.includes('광안리') || t.includes('민락수변') || t.includes('민락더마켓')) {
    return 'spot-111';
  }
  if (t.includes('송정해수욕장') || t.includes('송정 해수욕장') || t.includes('송정')) {
    return 'spot-songjeong';
  }
  if (t.includes('다대포') || t.includes('고우니')) {
    return 'spot-106';
  }
  if (t.includes('삼락생태공원') || t.includes('삼락')) {
    return 'spot-samnak';
  }
  if (t.includes('을숙도') || t.includes('현대미술관')) {
    return 'spot-eulsukdo';
  }
  if (t.includes('범어사') || t.includes('금정산')) {
    return 'spot-110';
  }
  if (t.includes('40계단') || t.includes('사십계단')) {
    return 'spot-109';
  }
  if (t.includes('해운대') || t.includes('구남로')) {
    return 'spot-101';
  }
  if (t.includes('시티투어') || t.includes('buti')) {
    return 'spot-city-tour-bus';
  }
  if (t.includes('부산역')) {
    return 'spot-busanstn';
  }
  if (t.includes('부전시장') || t.includes('부전마켓')) {
    return 'spot-bujeon-market';
  }
  if (t.includes('국제시장')) {
    return 'spot-bupyeong-market';
  }
  if (t.includes('기장시장')) {
    return 'spot-gijang-market';
  }
  if (t.includes('동래시장')) {
    return 'spot-dongnae-market';
  }
  if (t.includes('이재모') || t.includes('leejaemo')) {
    return 'spot-leejaemo';
  }
  if (t.includes('모모스') || t.includes('momos')) {
    return 'spot-momos';
  }
  if (t.includes('톤쇼우') || t.includes('tonshou')) {
    return 'spot-tonshou';
  }
  if (t.includes('초량밀면')) {
    return 'spot-choryang-milmyeon';
  }
  if (t.includes('쌍둥이돼지국밥') || t.includes('쌍둥이 국밥')) {
    return 'spot-twin-pork';
  }
  if (t.includes('본전돼지국밥') || t.includes('본전국밥')) {
    return 'spot-bonjeon';
  }
  if (t.includes('금수복국')) {
    return 'spot-gumsubokguk';
  }
  if (t.includes('옵스') || t.includes('ops')) {
    return 'spot-ops-bakery';
  }
  if (t.includes('뮤지엄원') || t.includes('museum one') || t.includes('museum1')) {
    return 'spot-museum1';
  }
  if (t.includes('부산박물관') || t.includes('유엔평화')) {
    return 'spot-busan-museum';
  }
  if (t.includes('허심청') || t.includes('동래온천')) {
    return 'spot-hurshimcheong';
  }
  if (t.includes('온천천')) {
    return 'spot-oncheoncheon';
  }
  if (t.includes('성보박물관')) {
    return 'spot-seongbo';
  }
  if (t.includes('오시리아') || t.includes('롯데월드')) {
    return 'spot-osiria';
  }

  // 3. getKoreaTourApiPlaceDetail를 통한 폴백 조회
  const found = getKoreaTourApiPlaceDetail(t);
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

  // 객체인 경우
  if (placeOrTitle.contentId && placeOrTitle.contentId.trim()) {
    return placeOrTitle.contentId.trim();
  }
  if (placeOrTitle.id && placeOrTitle.id.trim()) {
    const id = placeOrTitle.id.trim();
    if (id.startsWith('spot-') || id.startsWith('tour-') || /^\d+$/.test(id)) {
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
