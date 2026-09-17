/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 한국관광공사 (KTO) TourAPI 무장애 관광정보 통신 클라이언트 서비스
 */

import {
  OpenApiPlaceDetail,
  getKoreaTourApiPlaceDetail,
} from '../data/koreaTourApiPlaceDetails';

export interface TourApiDetailResponse {
  success: boolean;
  isLiveApi: boolean;
  source: string;
  data: OpenApiPlaceDetail | null;
  error?: string;
}

/**
 * 관광지 상세 정보를 한국관광공사 OpenAPI 프록시를 통해 비동기로 가져옵니다.
 * 서버 프록시 실패 시 사전 매핑된 정밀 OpenAPI 데이터셋을 즉각 반환합니다.
 */
export async function fetchTourApiPlaceDetail(placeId: string): Promise<TourApiDetailResponse> {
  const localFallback = getKoreaTourApiPlaceDetail(placeId);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`/api/tourapi/detail/${encodeURIComponent(placeId)}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        return {
          success: true,
          isLiveApi: !!json.isLiveApi,
          source: json.source || '한국관광공사 공공데이터포털 KorWithService2 OpenAPI',
          data: json.data,
        };
      }
    }
  } catch (e: any) {
    // Failover silently to pre-mapped OpenAPI dataset
    console.info('Using local verified Korea TourAPI dataset fallback for:', placeId, e?.message);
  }

  if (localFallback) {
    return {
      success: true,
      isLiveApi: false,
      source: '한국관광공사 공공데이터포털 KorWithService2 무장애 관광정보',
      data: localFallback,
    };
  }

  return {
    success: false,
    isLiveApi: false,
    source: '데이터를 찾을 수 없음',
    data: null,
    error: '해당 관광지의 무장애 상세 정보를 불러올 수 없습니다.',
  };
}
