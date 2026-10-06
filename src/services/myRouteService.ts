/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 내 여행 루트 (즐겨찾기 장소 관리 및 지도 연동 서비스)
 * 사용자가 추천 코스 및 각 카테고리에서 즐겨찾기(⭐)한 장소들을
 * localStorage에 보관하고, 대화형 전체 지도 위에 순서대로 연결하여 표시합니다.
 */

import { useState, useEffect } from 'react';
import { matchTourApiSpotId } from './tourApiCommon';
import { getKoreaTourApiPlaceDetail, KOREA_TOUR_API_PLACE_DETAILS } from '../data/koreaTourApiPlaceDetails';
import { BUSAN_TOUR_API_SPOTS } from '../data/tourApiSpots';

export interface MyRoutePlace {
  id: string; // 고유 키 (titleKo 기반 혹은 고유 ID)
  titleKo: string;
  titleEn: string;
  categoryKo?: string;
  categoryEn?: string;
  addressRoadKo?: string;
  addressRoadEn?: string;
  stationInfoKo?: string;
  stationInfoEn?: string;
  latitude: number;
  longitude: number;
  firstImage?: string;
  descKo?: string;
  descEn?: string;
  time?: string;
  addedAt: number;
}

const STORAGE_KEY = 'stepless_my_travel_route_v1';
const EVENT_NAME = 'stepless_my_route_changed';

// 부산 주요 권역별 대표 기준 정밀 좌표 사전 (검색어 부분 일치 매칭용)
const BUSAN_AREA_FALLBACKS: Record<string, { lat: number; lng: number; addressKo: string }> = {
  '해운대': { lat: 35.1587, lng: 129.1604, addressKo: '부산광역시 해운대구 해운대해변로 264' },
  '광안리': { lat: 35.1532, lng: 129.1186, addressKo: '부산광역시 수영구 광안해변로 219' },
  '광안대교': { lat: 35.1532, lng: 129.1186, addressKo: '부산광역시 수영구 광안해변로 219' },
  '영도': { lat: 35.0789, lng: 129.0452, addressKo: '부산광역시 영도구 영선동4가 1043' },
  '흰여울': { lat: 35.0789, lng: 129.0452, addressKo: '부산광역시 영도구 영선동4가 1043' },
  '태종대': { lat: 35.0532, lng: 129.0825, addressKo: '부산광역시 영도구 전망로 24' },
  '감천': { lat: 35.0975, lng: 129.0106, addressKo: '부산광역시 사하구 감내2로 203' },
  '남포동': { lat: 35.0967, lng: 129.0306, addressKo: '부산광역시 중구 자갈치해안로 52' },
  '자갈치': { lat: 35.0967, lng: 129.0306, addressKo: '부산광역시 중구 자갈치해안로 52' },
  '국제시장': { lat: 35.1006, lng: 129.0285, addressKo: '부산광역시 중구 신창동4가' },
  '깡통시장': { lat: 35.1018, lng: 129.0264, addressKo: '부산광역시 중구 부평1길 48' },
  '서면': { lat: 35.1554, lng: 129.0594, addressKo: '부산광역시 부산진구 중앙대로' },
  '전포': { lat: 35.1554, lng: 129.0654, addressKo: '부산광역시 부산진구 전포대로209번길 26' },
  '부산역': { lat: 35.1154, lng: 129.0422, addressKo: '부산광역시 동구 중앙대로 206' },
  '초량': { lat: 35.1182, lng: 129.0415, addressKo: '부산광역시 동구 중앙대로 225' },
  '동백섬': { lat: 35.1528, lng: 129.1518, addressKo: '부산광역시 해운대구 동백로 116' },
  '누리마루': { lat: 35.1528, lng: 129.1518, addressKo: '부산광역시 해운대구 동백로 116' },
  '청사포': { lat: 35.1611, lng: 129.1925, addressKo: '부산광역시 해운대구 청사포로' },
  '블루라인': { lat: 35.1594, lng: 129.1725, addressKo: '부산광역시 해운대구 달맞이길62번길 13' },
  '스카이캡슐': { lat: 35.1594, lng: 129.1725, addressKo: '부산광역시 해운대구 달맞이길62번길 13' },
  '기장': { lat: 35.1883, lng: 129.2234, addressKo: '부산광역시 기장군 기장읍 용궁길 86' },
  '용궁사': { lat: 35.1883, lng: 129.2234, addressKo: '부산광역시 기장군 기장읍 용궁길 86' },
  '오시리아': { lat: 35.1952, lng: 129.2152, addressKo: '부산광역시 기장군 기장읍 동부산관광로 42' },
  '송도': { lat: 35.0784, lng: 129.0194, addressKo: '부산광역시 서구 송도해변로 100' },
  '송정': { lat: 35.1786, lng: 129.1994, addressKo: '부산광역시 해운대구 송정해변로 62' },
  '다대포': { lat: 35.0483, lng: 128.9664, addressKo: '부산광역시 사하구 다대낙동강변대로 80' },
  '삼락': { lat: 35.1691, lng: 128.9732, addressKo: '부산광역시 사상구 삼락동 29-46' },
  '대저': { lat: 35.2125, lng: 128.9814, addressKo: '부산광역시 강서구 대저1동 2314-11' },
  '맥도': { lat: 35.1528, lng: 128.9482, addressKo: '부산광역시 강서구 대저2동 1200-33' },
  '용두산': { lat: 35.1006, lng: 129.0326, addressKo: '부산광역시 중구 용두산길 37-55' },
  '부산타워': { lat: 35.1006, lng: 129.0326, addressKo: '부산광역시 중구 용두산길 37-55' },
  '벡스코': { lat: 35.1691, lng: 129.1362, addressKo: '부산광역시 해운대구 APEC로 55' },
  '영화의전당': { lat: 35.1711, lng: 129.1278, addressKo: '부산광역시 해운대구 수영강변대로 120' },
  '해양박물관': { lat: 35.0789, lng: 129.0805, addressKo: '부산광역시 영도구 해양로301번길 45' },
  'F1963': { lat: 35.1764, lng: 129.1152, addressKo: '부산광역시 수영구 구락로123번길 20' },
  '이기대': { lat: 35.1275, lng: 129.1172, addressKo: '부산광역시 남구 이기대공원로 105-20' },
  '이재모피자': { lat: 35.1022, lng: 129.0305, addressKo: '부산광역시 중구 광복중앙로 31' },
  '모모스': { lat: 35.2285, lng: 129.0875, addressKo: '부산광역시 금정구 오시게로 20' },
  '톤쇼우': { lat: 35.1578, lng: 129.1142, addressKo: '부산광역시 수영구 광안해변로279번길 13' },
  '금수복국': { lat: 35.1618, lng: 129.1642, addressKo: '부산광역시 해운대구 중동2로10번길 23' },
  '밀락더마켓': { lat: 35.1545, lng: 129.1285, addressKo: '부산광역시 수영구 민락수변로17번길 56' },
  '민락더마켓': { lat: 35.1545, lng: 129.1285, addressKo: '부산광역시 수영구 민락수변로17번길 56' },
  '부전시장': { lat: 35.1630, lng: 129.0601, addressKo: '부산광역시 부산진구 중앙대로 786' },
  '구포시장': { lat: 35.2104, lng: 129.0049, addressKo: '부산광역시 북구 구포시장1길 17' },
  '범어사': { lat: 35.2838, lng: 129.0682, addressKo: '부산광역시 금정구 범어사로 250' },
  '토성역': { lat: 35.1006, lng: 129.0194, addressKo: '부산광역시 서구 구덕로' },
};

// 부산 주요 명소 기본 정밀 좌표 사전 (TourAPI 미매칭 시 안정적 폴백)
export const KNOWN_COORDINATES: Record<string, { lat: number; lng: number; addressKo: string; categoryKo: string }> = {
  '부산역': { lat: 35.1154, lng: 129.0422, addressKo: '부산광역시 동구 중앙대로 206', categoryKo: '교통/명소' },
  '해운대': { lat: 35.1587, lng: 129.1604, addressKo: '부산광역시 해운대구 우동 해운대해변로 264', categoryKo: '해변/자연' },
  '해운대해수욕장': { lat: 35.1587, lng: 129.1604, addressKo: '부산광역시 해운대구 우동 해운대해변로 264', categoryKo: '해변/자연' },
  '해운대 해수욕장': { lat: 35.1587, lng: 129.1604, addressKo: '부산광역시 해운대구 우동 해운대해변로 264', categoryKo: '해변/자연' },
  '광안리': { lat: 35.1532, lng: 129.1186, addressKo: '부산광역시 수영구 광안해변로 219', categoryKo: '해변/자연' },
  '광안리해수욕장': { lat: 35.1532, lng: 129.1186, addressKo: '부산광역시 수영구 광안해변로 219', categoryKo: '해변/자연' },
  '광안리 해수욕장': { lat: 35.1532, lng: 129.1186, addressKo: '부산광역시 수영구 광안해변로 219', categoryKo: '해변/자연' },
  '자갈치시장': { lat: 35.0967, lng: 129.0306, addressKo: '부산광역시 중구 자갈치해안로 52', categoryKo: '전통시장' },
  '부평깡통시장': { lat: 35.1018, lng: 129.0264, addressKo: '부산광역시 중구 부평1길 48', categoryKo: '전통시장' },
  '국제시장': { lat: 35.1006, lng: 129.0285, addressKo: '부산광역시 중구 신창동4가', categoryKo: '전통시장' },
  '감천문화마을': { lat: 35.0975, lng: 129.0106, addressKo: '부산광역시 사하구 감내2로 203', categoryKo: '문화마을' },
  '흰여울문화마을': { lat: 35.0789, lng: 129.0452, addressKo: '부산광역시 영도구 영선동4가 1043', categoryKo: '문화마을' },
  '영도 흰여울문화마을': { lat: 35.0789, lng: 129.0452, addressKo: '부산광역시 영도구 영선동4가 1043', categoryKo: '문화마을' },
  '태종대': { lat: 35.0532, lng: 129.0825, addressKo: '부산광역시 영도구 전망로 24', categoryKo: '자연명소' },
  '용두산공원': { lat: 35.1006, lng: 129.0326, addressKo: '부산광역시 중구 용두산길 37-55', categoryKo: '공원/야경' },
  '부산타워': { lat: 35.1006, lng: 129.0326, addressKo: '부산광역시 중구 용두산길 37-55', categoryKo: '공원/야경' },
  '동백섬': { lat: 35.1528, lng: 129.1518, addressKo: '부산광역시 해운대구 우동 710-1', categoryKo: '해안산책' },
  '누리마루': { lat: 35.1528, lng: 129.1518, addressKo: '부산광역시 해운대구 동백로 116', categoryKo: '해안산책' },
  '해운대 블루라인파크': { lat: 35.1594, lng: 129.1725, addressKo: '부산광역시 해운대구 달맞이길62번길 13', categoryKo: '관광열차' },
  '청사포': { lat: 35.1611, lng: 129.1925, addressKo: '부산광역시 해운대구 중동 청사포로', categoryKo: '해안명소' },
  '해동용궁사': { lat: 35.1883, lng: 129.2234, addressKo: '부산광역시 기장군 기장읍 용궁길 86', categoryKo: '사찰/명소' },
  '송도해수욕장': { lat: 35.0784, lng: 129.0194, addressKo: '부산광역시 서구 송도해변로 100', categoryKo: '해변/자연' },
  '송정해수욕장': { lat: 35.1786, lng: 129.1994, addressKo: '부산광역시 해운대구 송정해변로 62', categoryKo: '해변/자연' },
  '다대포해수욕장': { lat: 35.0483, lng: 128.9664, addressKo: '부산광역시 사하구 다대낙동강변대로 80', categoryKo: '해변/생태' },
  '삼락생태공원': { lat: 35.1691, lng: 128.9732, addressKo: '부산광역시 사상구 삼락동 29-46', categoryKo: '생태공원' },
  '맥도생태공원': { lat: 35.1528, lng: 128.9482, addressKo: '부산광역시 강서구 대저2동 1200-33', categoryKo: '생태공원' },
  '대저생태공원': { lat: 35.2125, lng: 128.9814, addressKo: '부산광역시 강서구 대저1동 2314-11', categoryKo: '생태공원' },
  '전포카페거리': { lat: 35.1554, lng: 129.0654, addressKo: '부산광역시 부산진구 전포대로209번길 26', categoryKo: '카페거리' },
  '서면': { lat: 35.1552, lng: 129.0594, addressKo: '부산광역시 부산진구 중앙대로', categoryKo: '쇼핑/미식' },
  '벡스코': { lat: 35.1691, lng: 129.1362, addressKo: '부산광역시 해운대구 APEC로 55', categoryKo: '전시/문화' },
  '영화의전당': { lat: 35.1711, lng: 129.1278, addressKo: '부산광역시 해운대구 수영강변대로 120', categoryKo: '문화/예술' },
  '국립해양박물관': { lat: 35.0789, lng: 129.0805, addressKo: '부산광역시 영도구 해양로301번길 45', categoryKo: '박물관' },
  'F1963': { lat: 35.1764, lng: 129.1152, addressKo: '부산광역시 수영구 구락로123번길 20', categoryKo: '복합문화공간' },
  '이기대': { lat: 35.1275, lng: 129.1172, addressKo: '부산광역시 남구 이기대공원로 105-20', categoryKo: '해안산책' },
  '오시리아': { lat: 35.1952, lng: 129.2152, addressKo: '부산광역시 기장군 기장읍 동부산관광로 42', categoryKo: '관광단지' },
  '이재모피자': { lat: 35.1022, lng: 129.0305, addressKo: '부산광역시 중구 광복중앙로 31', categoryKo: '식도락/맛집' },
  '모모스커피': { lat: 35.2285, lng: 129.0875, addressKo: '부산광역시 금정구 오시게로 20', categoryKo: '식도락/카페' },
  '톤쇼우': { lat: 35.1578, lng: 129.1142, addressKo: '부산광역시 수영구 광안해변로279번길 13', categoryKo: '식도락/맛집' },
  '금수복국': { lat: 35.1618, lng: 129.1642, addressKo: '부산광역시 해운대구 중동2로10번길 23', categoryKo: '식도락/맛집' },
  '초량밀면': { lat: 35.1182, lng: 129.0415, addressKo: '부산광역시 동구 중앙대로 225', categoryKo: '식도락/맛집' },
  '본전돼지국밥': { lat: 35.1148, lng: 129.0412, addressKo: '부산광역시 동구 중앙대로214번길 3-8', categoryKo: '식도락/맛집' },
  '민락더마켓': { lat: 35.1545, lng: 129.1285, addressKo: '부산광역시 수영구 민락수변로17번길 56', categoryKo: '복합문화/마켓' },
  '밀락더마켓': { lat: 35.1545, lng: 129.1285, addressKo: '부산광역시 수영구 민락수변로17번길 56', categoryKo: '복합문화/마켓' },
  '부산영화체험박물관': { lat: 35.1017, lng: 129.0335, addressKo: '부산광역시 중구 대청로126번길 12', categoryKo: '체험/박물관' },
  '부산근현대역사관': { lat: 35.1025, lng: 129.0305, addressKo: '부산광역시 중구 대청로 104', categoryKo: '체험/박물관' },
  'BIFF광장': { lat: 35.0991, lng: 129.0289, addressKo: '부산광역시 중구 구덕로 58-1', categoryKo: '명소/거리' },
  '부전시장': { lat: 35.1630, lng: 129.0601, addressKo: '부산광역시 부산진구 중앙대로 786', categoryKo: '전통시장' },
  '구포시장': { lat: 35.2104, lng: 129.0049, addressKo: '부산광역시 북구 구포시장1길 17', categoryKo: '전통시장' },
  '온천천': { lat: 35.2078, lng: 129.0835, addressKo: '부산광역시 동래구 온천천로', categoryKo: '자연/산책' },
  '범어사': { lat: 35.2838, lng: 129.0682, addressKo: '부산광역시 금정구 범어사로 250', categoryKo: '사찰/명소' },
  '부산시립미술관': { lat: 35.1675, lng: 129.1378, addressKo: '부산광역시 해운대구 APEC로 58', categoryKo: '미술관' },
  '부산현대미술관': { lat: 35.1089, lng: 128.9419, addressKo: '부산광역시 사하구 낙동남로 1191', categoryKo: '미술관' },
  '국립부산과학관': { lat: 35.2052, lng: 129.2132, addressKo: '부산광역시 기장군 기장읍 동부산관광6로 59', categoryKo: '과학관' },
  '국립일제강제동원역사관': { lat: 35.1275, lng: 129.0898, addressKo: '부산광역시 남구 홍곡로 320-29', categoryKo: '역사관' },
  '유엔기념공원': { lat: 35.1278, lng: 129.0969, addressKo: '부산광역시 남구 유엔평화로 93', categoryKo: '역사/공원' },
  '아미산전망대': { lat: 35.0435, lng: 128.9602, addressKo: '부산광역시 사하구 다대낙동강변대로 19', categoryKo: '전망대' },
  '초량이바구길': { lat: 35.1165, lng: 129.0385, addressKo: '부산광역시 동구 초량상로', categoryKo: '문화마을' },
  '차이나타운': { lat: 35.1145, lng: 129.0395, addressKo: '부산광역시 동구 대영로243번길', categoryKo: '특화거리' },
  '임시수도기념관': { lat: 35.1052, lng: 129.0185, addressKo: '부산광역시 서구 임시수도기념로 45', categoryKo: '역사관' },
  '보수동책방골목': { lat: 35.1035, lng: 129.0255, addressKo: '부산광역시 중구 대청로 67-1', categoryKo: '문화거리' },
  '화명생태공원': { lat: 35.2285, lng: 129.0041, addressKo: '부산광역시 북구 화명동 1718-17', categoryKo: '생태공원' },
  '송도해상케이블카': { lat: 35.0760, lng: 129.0195, addressKo: '부산광역시 서구 송도해변로 171', categoryKo: '체험/관광' },
  '오륙도': { lat: 35.1275, lng: 129.1235, addressKo: '부산광역시 남구 오륙도로 137', categoryKo: '자연/명소' },
  '오륙도스카이워크': { lat: 35.1275, lng: 129.1235, addressKo: '부산광역시 남구 오륙도로 137', categoryKo: '자연/명소' },
  '황령산': { lat: 35.1565, lng: 129.0825, addressKo: '부산광역시 부산진구 황령산로 391-39', categoryKo: '야경/전망' },
  '황령산봉수대': { lat: 35.1565, lng: 129.0825, addressKo: '부산광역시 부산진구 황령산로 391-39', categoryKo: '야경/전망' },
  '더베이101': { lat: 35.1565, lng: 129.1525, addressKo: '부산광역시 해운대구 동백로 52', categoryKo: '야경/복합공간' },
  'The Bay 101': { lat: 35.1565, lng: 129.1525, addressKo: '부산광역시 해운대구 동백로 52', categoryKo: '야경/복합공간' },
  '엑스더스카이': { lat: 35.1601, lng: 129.1695, addressKo: '부산광역시 해운대구 달맞이길 30 엘시티 랜드마크타워', categoryKo: '전망대' },
  '부산엑스더스카이': { lat: 35.1601, lng: 129.1695, addressKo: '부산광역시 해운대구 달맞이길 30 엘시티 랜드마크타워', categoryKo: '전망대' },
  '엘시티': { lat: 35.1601, lng: 129.1695, addressKo: '부산광역시 해운대구 달맞이길 30', categoryKo: '랜드마크' },
  '스카이캡슐': { lat: 35.1594, lng: 129.1725, addressKo: '부산광역시 해운대구 달맞이길62번길 13 (미포정거장)', categoryKo: '관광열차' },
  '미포정거장': { lat: 35.1594, lng: 129.1725, addressKo: '부산광역시 해운대구 달맞이길62번길 13', categoryKo: '관광열차' },
  '청사포정거장': { lat: 35.1611, lng: 129.1925, addressKo: '부산광역시 해운대구 청사포로 116', categoryKo: '관광열차' },
  '송정정거장': { lat: 35.1786, lng: 129.1994, addressKo: '부산광역시 해운대구 송정중앙로8번길 60', categoryKo: '관광열차' },
  '신발원': { lat: 35.1145, lng: 129.0398, addressKo: '부산광역시 동구 대영로243번길 62', categoryKo: '식도락/만두' },
  '이재모피자 서면': { lat: 35.1542, lng: 129.0588, addressKo: '부산광역시 부산진구 전포대로 209', categoryKo: '식도락/피자' },
  '이재모피자 서면점': { lat: 35.1542, lng: 129.0588, addressKo: '부산광역시 부산진구 전포대로 209', categoryKo: '식도락/피자' },
  '이재모피자 부산역': { lat: 35.1165, lng: 129.0410, addressKo: '부산광역시 동구 중앙대로 213', categoryKo: '식도락/피자' },
  '이재모피자 부산역점': { lat: 35.1165, lng: 129.0410, addressKo: '부산광역시 동구 중앙대로 213', categoryKo: '식도락/피자' },
  '모모스커피 본점': { lat: 35.2285, lng: 129.0875, addressKo: '부산광역시 금정구 오시게로 20', categoryKo: '식도락/카페' },
  '모모스 로스터리': { lat: 35.0935, lng: 129.0415, addressKo: '부산광역시 영도구 봉래나루로 160', categoryKo: '식도락/카페' },
  '피아크': { lat: 35.0885, lng: 129.0685, addressKo: '부산광역시 영도구 해양로 195번길 180', categoryKo: '복합문화/카페' },
  '신기산업': { lat: 35.0895, lng: 129.0555, addressKo: '부산광역시 영도구 와치로 51', categoryKo: '식도락/카페' },
  '흰여울해안터널': { lat: 35.0765, lng: 129.0435, addressKo: '부산광역시 영도구 절영로 206', categoryKo: '포토스팟' },
  '달맞이길': { lat: 35.1608, lng: 129.1765, addressKo: '부산광역시 해운대구 달맞이길', categoryKo: '산책/야경' },
  '신세계백화점 센텀시티': { lat: 35.1689, lng: 129.1298, addressKo: '부산광역시 해운대구 센텀남대로 35', categoryKo: '쇼핑/문화' },
  '스파랜드 센텀시티': { lat: 35.1689, lng: 129.1298, addressKo: '부산광역시 해운대구 센텀남대로 35', categoryKo: '휴양/온천' },
  '롯데월드 어드벤처 부산': { lat: 35.1952, lng: 129.2152, addressKo: '부산광역시 기장군 기장읍 동부산관광로 42', categoryKo: '테마파크' },
  '스카이라인 루지 부산': { lat: 35.1965, lng: 129.2165, addressKo: '부산광역시 기장군 기장읍 기장해안로 205', categoryKo: '레저/액티비티' },
  '아난티 앳 부산': { lat: 35.1985, lng: 129.2285, addressKo: '부산광역시 기장군 기장읍 기장해안로 268-31', categoryKo: '휴양/명소' },
  '아난티 코브': { lat: 35.1985, lng: 129.2285, addressKo: '부산광역시 기장군 기장읍 기장해안로 268-31', categoryKo: '휴양/명소' },
  '쌍둥이돼지국밥': { lat: 35.1332, lng: 129.0895, addressKo: '부산광역시 남구 유엔평화로 35-1', categoryKo: '식도락/국밥' },
  '다대포 꿈의 낙조분수': { lat: 35.0483, lng: 128.9664, addressKo: '부산광역시 사하구 몰운대1길 14', categoryKo: '야경/분수' },
  '몰운대': { lat: 35.0435, lng: 128.9625, addressKo: '부산광역시 사하구 다대동 산144', categoryKo: '자연/산책' },
  '을숙도': { lat: 35.1055, lng: 128.9425, addressKo: '부산광역시 사하구 을숙도', categoryKo: '생태공원' },
  '온천장 허심청': { lat: 35.2210, lng: 129.0825, addressKo: '부산광역시 동래구 온천장로107번길 32', categoryKo: '온천/휴양' },
  '동래읍성': { lat: 35.2085, lng: 129.0885, addressKo: '부산광역시 동래구 명륜동', categoryKo: '역사/명소' },
  '화명수목원': { lat: 35.2425, lng: 129.0345, addressKo: '부산광역시 북구 산성로 299', categoryKo: '자연/생태' },

/**
 * 장소명으로부터 위도, 경도, 도로명주소 및 사진 정보를 정밀하게 추론합니다.
 * (모바일 및 지도에서 위치가 부정확하게 표현되는 문제를 해결하기 위해 사전·지역·키워드 다중 매칭)
 */
export function resolvePlaceLocationInfo(
  titleKo: string,
  rawAddress?: string
): { latitude: number; longitude: number; addressRoadKo: string; categoryKo?: string; firstImage?: string } {
  if (!titleKo) {
    return { latitude: 35.1587, longitude: 129.1604, addressRoadKo: rawAddress || '부산광역시' };
  }

  // 0. 장소명 정제 (괄호, 부제 등 제거하여 핵심 고유명사 추출)
  const cleanTitle = titleKo
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/:.*$/g, '')
    .replace(/&.*$/g, '')
    .replace(/·.*$/g, '')
    .trim();

  // 1. KNOWN_COORDINATES 완전/부분 일치 매칭 (최우선)
  if (KNOWN_COORDINATES[titleKo]) {
    const val = KNOWN_COORDINATES[titleKo];
    return {
      latitude: val.lat,
      longitude: val.lng,
      addressRoadKo: rawAddress || val.addressKo,
      categoryKo: val.categoryKo,
    };
  }
  if (cleanTitle && KNOWN_COORDINATES[cleanTitle]) {
    const val = KNOWN_COORDINATES[cleanTitle];
    return {
      latitude: val.lat,
      longitude: val.lng,
      addressRoadKo: rawAddress || val.addressKo,
      categoryKo: val.categoryKo,
    };
  }
  for (const [key, val] of Object.entries(KNOWN_COORDINATES)) {
    if (titleKo.includes(key) || key.includes(cleanTitle) || (cleanTitle && cleanTitle.includes(key))) {
      return {
        latitude: val.lat,
        longitude: val.lng,
        addressRoadKo: rawAddress || val.addressKo,
        categoryKo: val.categoryKo,
      };
    }
  }

  // 2. BUSAN_TOUR_API_SPOTS 검색
  const matchedSpot = BUSAN_TOUR_API_SPOTS.find(s => 
    s.titleKo === titleKo || 
    s.titleKo.includes(cleanTitle) || 
    cleanTitle.includes(s.titleKo)
  );
  if (matchedSpot && matchedSpot.mapy && matchedSpot.mapx) {
    return {
      latitude: matchedSpot.mapy,
      longitude: matchedSpot.mapx,
      addressRoadKo: rawAddress || matchedSpot.addr1Ko || '부산광역시',
      categoryKo: matchedSpot.categoryKo,
      firstImage: matchedSpot.firstimage,
    };
  }

  // 3. KOREA_TOUR_API_PLACE_DETAILS 검색
  const matchedDetail = Object.values(KOREA_TOUR_API_PLACE_DETAILS).find(d =>
    d.nameKo === titleKo ||
    d.nameKo.includes(cleanTitle) ||
    cleanTitle.includes(d.nameKo)
  );
  if (matchedDetail && matchedDetail.latitude && matchedDetail.longitude) {
    return {
      latitude: matchedDetail.latitude,
      longitude: matchedDetail.longitude,
      addressRoadKo: rawAddress || matchedDetail.addressRoadKo || matchedDetail.addressLotKo || '부산광역시',
      categoryKo: matchedDetail.categoryKo,
      firstImage: matchedDetail.firstImage,
    };
  }

  // 4. TourAPI 사전 매칭 (spot-ID 기반)
  const spotId = matchTourApiSpotId(titleKo);
  if (spotId) {
    const detail = getKoreaTourApiPlaceDetail(spotId);
    if (detail && detail.latitude && detail.longitude) {
      return {
        latitude: detail.latitude,
        longitude: detail.longitude,
        addressRoadKo: detail.addressRoadKo || rawAddress || '부산광역시',
        categoryKo: detail.categoryKo,
        firstImage: detail.firstImage,
      };
    }
  }

  // 5. 부산 대표 권역별 폴백 (해운대, 광안리, 영도, 서면, 남포 등)
  for (const [kw, loc] of Object.entries(BUSAN_AREA_FALLBACKS)) {
    if (titleKo.includes(kw) || (rawAddress && rawAddress.includes(kw))) {
      return {
        latitude: loc.lat,
        longitude: loc.lng,
        addressRoadKo: rawAddress || loc.addressKo,
      };
    }
  }

  // 6. 부산 중심 기본 좌표 (해운대 해변)
  return {
    latitude: 35.1587,
    longitude: 129.1604,
    addressRoadKo: rawAddress || '부산광역시',
  };
}

/**
 * 현재 저장된 모든 여행 루트 장소 목록 반환
 * ※ 저장된 좌표가 부실하거나 이전 시청 기본 좌표(35.1796, 129.0756)인 경우 정확한 좌표로 자동 자가 치유(Self-Healing)
 */
export function getMyRoutePlaces(): MyRoutePlace[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    let hasHealed = false;
    const healedPlaces: MyRoutePlace[] = parsed.map(place => {
      // 기존 저장된 좌표가 비정상(0 또는 예전 기본 시청좌표)일 경우 정밀 좌표로 재보정
      const isSuspectCoord = 
        !place.latitude || 
        !place.longitude || 
        (Math.abs(place.latitude - 35.1796) < 0.001 && Math.abs(place.longitude - 129.0756) < 0.001);

      if (isSuspectCoord) {
        const correctInfo = resolvePlaceLocationInfo(place.titleKo, place.addressRoadKo);
        if (correctInfo.latitude && correctInfo.longitude) {
          hasHealed = true;
          return {
            ...place,
            latitude: correctInfo.latitude,
            longitude: correctInfo.longitude,
            addressRoadKo: place.addressRoadKo || correctInfo.addressRoadKo,
            firstImage: place.firstImage || correctInfo.firstImage,
          };
        }
      }
      return place;
    });

    if (hasHealed) {
      saveAndNotify(healedPlaces);
    }

    return healedPlaces;
  } catch (err) {
    console.warn('Failed to load my route places from localStorage:', err);
    return [];
  }
}

function saveAndNotify(places: MyRoutePlace[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: places }));
  } catch (err) {
    console.error('Failed to save my route places:', err);
  }
}

/**
 * 여행 루트를 URL 공유용 문자열로 안전하게 인코딩 (방안 A: URL 공유 링크)
 * URL-safe Base64 (+ -> -, / -> _, remove =) 적용으로 카카오톡/모바일 메신저 링크 깨짐 완전 방지
 */
export function exportRouteToShareData(places: MyRoutePlace[]): string {
  try {
    if (!places || places.length === 0) return '';
    const compact = places.map(p => ({
      id: p.id,
      t: p.titleKo,
      te: p.titleEn,
      c: p.categoryKo,
      ce: p.categoryEn,
      lat: Math.round(p.latitude * 1000000) / 1000000,
      lng: Math.round(p.longitude * 1000000) / 1000000,
      a: p.addressRoadKo,
      ae: p.addressRoadEn,
      img: p.firstImage,
      st: p.stationInfoKo,
      ste: p.stationInfoEn,
      d: p.descKo,
      de: p.descEn,
      tm: p.time,
    }));
    const rawB64 = btoa(encodeURIComponent(JSON.stringify(compact)));
    // URL-safe Base64 변환
    return rawB64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    console.error('Failed to export route to share data:', e);
    return '';
  }
}

/**
 * URL 공유용 문자열로부터 여행 루트 데이터 디코딩
 * 누락/오차 좌표가 있는 경우 부산 정밀 좌표 사전(resolvePlaceLocationInfo)으로 자동 보정
 */
export function importRouteFromShareData(encodedStr: string): MyRoutePlace[] | null {
  try {
    if (!encodedStr) return null;
    let clean = encodedStr.trim().replace(/\s+/g, '');
    // URL-safe Base64를 표준 Base64로 복원
    clean = clean.replace(/-/g, '+').replace(/_/g, '/');
    while (clean.length % 4 !== 0) {
      clean += '=';
    }
    const jsonStr = decodeURIComponent(atob(clean));
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;

    return parsed.map((item: any, idx: number) => {
      const title = item.t || '추천 여행지';
      const rawLat = Number(item.lat);
      const rawLng = Number(item.lng);
      
      let lat = rawLat;
      let lng = rawLng;
      let addr = item.a || '부산광역시';
      let img = item.img;
      let catKo = item.c || '추천명소';

      // 좌표가 비어있거나 부산 권역을 벗어난 경우 정밀 좌표로 자동 보정
      if (!lat || !lng || isNaN(lat) || isNaN(lng) || lat < 34.5 || lat > 35.6 || lng < 128.5 || lng > 129.5) {
        const resolved = resolvePlaceLocationInfo(title, addr);
        lat = resolved.latitude;
        lng = resolved.longitude;
        addr = resolved.addressRoadKo || addr;
        img = resolved.firstImage || img;
        catKo = resolved.categoryKo || catKo;
      }

      return {
        id: item.id || `shared-${idx}-${Date.now()}`,
        titleKo: title,
        titleEn: item.te || title || 'Busan Spot',
        categoryKo: catKo,
        categoryEn: item.ce || 'Attraction',
        latitude: lat,
        longitude: lng,
        addressRoadKo: addr,
        addressRoadEn: item.ae || 'Busan, South Korea',
        firstImage: img,
        stationInfoKo: item.st,
        stationInfoEn: item.ste,
        descKo: item.d,
        descEn: item.de,
        time: item.tm,
        addedAt: Date.now() + idx,
      };
    });
  } catch (err) {
    console.warn('Failed to import route from share data:', err);
    return null;
  }
}

/**
 * 공유받은 루트를 내 여행 루트로 복사/저장 (기존 루트를 대체하여 본인의 새 루트로 설정)
 */
export function saveImportedRouteAsMyRoute(places: MyRoutePlace[]): void {
  if (!Array.isArray(places)) return;
  saveAndNotify(places);
}

/**
 * 공유받은 루트를 기존 내 여행 루트에 합치기 (중복 제외하고 추가)
 */
export function mergeImportedRouteIntoMyRoute(places: MyRoutePlace[]): number {
  if (!Array.isArray(places) || places.length === 0) return 0;
  const current = getMyRoutePlaces();
  let addedCount = 0;
  const updated = [...current];

  places.forEach(p => {
    const isDup = updated.some(
      existing => existing.id === p.id || existing.titleKo.toLowerCase() === p.titleKo.toLowerCase()
    );
    if (!isDup) {
      updated.push({
        ...p,
        addedAt: Date.now() + addedCount,
      });
      addedCount++;
    }
  });

  if (addedCount > 0) {
    saveAndNotify(updated);
  }
  return addedCount;
}

/**
 * 내 여행 루트의 전체 텍스트 요약 (메신저/메모장 복사용)
 */
export function formatRouteSummaryText(places: MyRoutePlace[], language: 'KR' | 'EN' = 'KR'): string {
  if (!places || places.length === 0) return '';
  const shareCode = exportRouteToShareData(places);
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?route=${shareCode}#my-route`
    : '';

  if (language === 'EN') {
    const lines = places.map((p, idx) => `${idx + 1}. ${p.titleEn || p.titleKo} (${p.categoryEn || p.categoryKo || 'Spot'}) - ${p.addressRoadEn || p.addressRoadKo || 'Busan'}`);
    return `[My Busan Travel Route (${places.length} Spots)]\n${lines.join('\n')}\n\n📍 Interactive Route Map:\n${shareUrl}`;
  }

  const lines = places.map((p, idx) => `${idx + 1}. ${p.titleKo} (${p.categoryKo || '명소'}) - ${p.addressRoadKo || '부산'}`);
  return `[내 부산 여행 루트 (총 ${places.length}곳)]\n${lines.join('\n')}\n\n📍 맞춤 여행 루트 지도 확인하기:\n${shareUrl}`;
}

/**
 * 장소가 즐겨찾기(내 여행 루트)에 포함되어 있는지 확인
 */
export function isPlaceInMyRoute(idOrTitle: string): boolean {
  if (!idOrTitle) return false;
  const places = getMyRoutePlaces();
  const clean = idOrTitle.trim().toLowerCase();
  return places.some(
    p => p.id.toLowerCase() === clean || p.titleKo.toLowerCase() === clean || clean.includes(p.titleKo.toLowerCase())
  );
}

/**
 * 장소를 내 여행 루트에 추가
 */
export function addPlaceToMyRoute(
  place: {
    id?: string;
    titleKo: string;
    titleEn?: string;
    categoryKo?: string;
    categoryEn?: string;
    addressRoadKo?: string;
    addressRoadEn?: string;
    stationInfoKo?: string;
    stationInfoEn?: string;
    descKo?: string;
    descEn?: string;
    firstImage?: string;
    time?: string;
    latitude?: number;
    longitude?: number;
  }
): boolean {
  const current = getMyRoutePlaces();
  const normalizedId = (place.id || place.titleKo).trim();

  if (current.some(p => p.id === normalizedId || p.titleKo === place.titleKo)) {
    return false; // Already present
  }

  const locInfo = (place.latitude && place.longitude)
    ? { latitude: place.latitude, longitude: place.longitude, addressRoadKo: place.addressRoadKo || '부산광역시', firstImage: place.firstImage }
    : resolvePlaceLocationInfo(place.titleKo, place.addressRoadKo);

  const newPlace: MyRoutePlace = {
    id: normalizedId,
    titleKo: place.titleKo,
    titleEn: place.titleEn || place.titleKo,
    categoryKo: place.categoryKo || locInfo.categoryKo || '추천명소',
    categoryEn: place.categoryEn || 'Attraction',
    addressRoadKo: place.addressRoadKo || locInfo.addressRoadKo,
    addressRoadEn: place.addressRoadEn || 'Busan, Republic of Korea',
    stationInfoKo: place.stationInfoKo,
    stationInfoEn: place.stationInfoEn,
    latitude: locInfo.latitude,
    longitude: locInfo.longitude,
    firstImage: place.firstImage || locInfo.firstImage,
    descKo: place.descKo,
    descEn: place.descEn,
    time: place.time,
    addedAt: Date.now(),
  };

  const updated = [...current, newPlace];
  saveAndNotify(updated);
  return true;
}

/**
 * 장소를 내 여행 루트에서 제거
 */
export function removePlaceFromMyRoute(idOrTitle: string): boolean {
  const current = getMyRoutePlaces();
  const clean = idOrTitle.trim().toLowerCase();
  const updated = current.filter(
    p => p.id.toLowerCase() !== clean && p.titleKo.toLowerCase() !== clean && !clean.includes(p.titleKo.toLowerCase())
  );
  if (updated.length !== current.length) {
    saveAndNotify(updated);
    return true;
  }
  return false;
}

/**
 * 토글 (추가되어 있으면 삭제, 없으면 추가)
 */
export function togglePlaceInMyRoute(
  place: {
    id?: string;
    titleKo: string;
    titleEn?: string;
    categoryKo?: string;
    categoryEn?: string;
    addressRoadKo?: string;
    addressRoadEn?: string;
    stationInfoKo?: string;
    stationInfoEn?: string;
    descKo?: string;
    descEn?: string;
    firstImage?: string;
    time?: string;
    latitude?: number;
    longitude?: number;
  }
): boolean {
  if (isPlaceInMyRoute(place.id || place.titleKo)) {
    removePlaceFromMyRoute(place.id || place.titleKo);
    return false; // Removed
  } else {
    addPlaceToMyRoute(place);
    return true; // Added
  }
}

/**
 * 순서 이동 (위로 또는 아래로)
 */
export function movePlaceOrder(index: number, direction: 'up' | 'down'): void {
  const current = getMyRoutePlaces();
  if (direction === 'up' && index > 0) {
    const updated = [...current];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    saveAndNotify(updated);
  } else if (direction === 'down' && index < current.length - 1) {
    const updated = [...current];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    saveAndNotify(updated);
  }
}

/**
 * 전체 목록 재정렬 저장
 */
export function reorderMyRoutePlaces(places: MyRoutePlace[]): void {
  saveAndNotify(places);
}

/**
 * 여행 루트 전체 비우기
 */
export function clearMyRoute(): void {
  saveAndNotify([]);
}

/**
 * React Hook: 실시간으로 내 여행 루트 상태를 구독
 */
export function useMyRoute() {
  const [places, setPlaces] = useState<MyRoutePlace[]>(() => getMyRoutePlaces());

  useEffect(() => {
    const handleUpdate = () => {
      setPlaces(getMyRoutePlaces());
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    places,
    count: places.length,
    isBookmarked: (idOrTitle: string) => isPlaceInMyRoute(idOrTitle),
    toggle: (place: any) => togglePlaceInMyRoute(place),
    remove: (idOrTitle: string) => removePlaceFromMyRoute(idOrTitle),
    add: (place: any) => addPlaceToMyRoute(place),
    move: (index: number, dir: 'up' | 'down') => movePlaceOrder(index, dir),
    clear: () => clearMyRoute(),
  };
}
