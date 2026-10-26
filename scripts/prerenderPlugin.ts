import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';
import { STATIONS } from '../src/data';

interface RouteMeta {
  path: string;
  title: string;
  description: string;
  heading: string;
  bodyHtml: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildRoutes(): RouteMeta[] {
  const routes: RouteMeta[] = [
    {
      path: '/search',
      title: '부산 지하철역 출구 정보 둘러보기 & 엘리베이터 검색 | 스텝레스 Stepless',
      description: '부산 도시철도 1~4호선 및 동해선 주요 15개 역의 엘리베이터, 에스컬레이터 위치와 유모차·휠체어·캐리어 무장애 이동 경로를 한눈에 비교하고 검색하세요.',
      heading: '부산 지하철역 출구 정보 & 무장애 이동 경로 검색',
      bodyHtml: `
        <p>스텝리스(Stepless) 지하철역 검색 페이지에서는 부산 도시철도 주요 15개 거점역의 출구별 엘리베이터 유무, 양방향 에스컬레이터, 계단 단차 정보 및 승강장-대합실-지상 보도 연결 동선을 상세히 제공합니다.</p>
        <h3>주요 검색 가능 지하철역 목록</h3>
        <ul>
          ${STATIONS.map(st => `<li><a href="/station/${st.id}"><strong>${escapeHtml(st.name)} (${escapeHtml(st.englishName)})</strong></a> - ${escapeHtml(st.lines.map(l => l.includes('선') ? l : l + '호선').join('·'))} | ${escapeHtml(st.exits.filter(e => e.hasElevator).map(e => e.number).join(', ') || '엘리베이터/에스컬레이터 상세 안내')}</li>`).join('\n          ')}
        </ul>
      `
    },
    {
      path: '/schedule',
      title: '부산 주요 축제·행사 월별 캘린더 & 무장애 관람 가이드 | 스텝레스 Stepless',
      description: '광안리 M 드론라이트쇼, 부산국제록페스티벌, 부산바다축제, 부산불꽃축제 등 월별 부산 대표 축제 일정과 대중교통·무장애 이동 팁을 확인하세요.',
      heading: '부산 주요 축제·행사 월별 일정 캘린더',
      bodyHtml: `
        <p>부산광역시 전역에서 개최되는 계절별·월별 대표 문화관광 축제와 주말 상설 공연 일정을 안내합니다. 축제장 인근 지하철역 엘리베이터 출구와 혼잡 시간대 우회 동선을 미리 확인하여 더욱 안전하고 쾌적한 여행을 계획해 보세요.</p>
        <h3>연간 주요 축제 및 상설 프로그램</h3>
        <ul>
          <li><strong>광안리 M 드론라이트쇼</strong>: 매주 토요일 저녁 광안리 해수욕장 상공에서 펼쳐지는 상설 메가 드론쇼 (2호선 광안역 3·5번 출구, 금련산역 1·3번 출구 평지 보도 이용)</li>
          <li><strong>부산바다축제 &amp; 해운대 모래축제</strong>: 해운대 해수욕장 구남로 문화광장 및 백사장 일원 (2호선 해운대역 1·3번 출구 인근 지상 엘리베이터 직결)</li>
          <li><strong>부산불꽃축제 &amp; 부산항축제</strong>: 광안대교 및 북항 친수공원 일원 (휠체어·유모차 관람 구역 및 대중교통 통제 시간 사전 확인 필수)</li>
          <li><strong>부산국제영화제(BIFF) &amp; 자갈치축제</strong>: 해운대 영화의전당(2호선 센텀시티·벡스코역) 및 남포동 비프광장·자갈치시장(1호선 자갈치역 3·6·10번 출구)</li>
        </ul>
      `
    },
    {
      path: '/barrier-free',
      title: '부산 무장애(배리어프리) 열린관광지 & 휠체어·유모차 추천 명소 | 스텝레스 Stepless',
      description: '한국관광공사 무장애 관광 데이터 기반 부산 전역의 휠체어·유모차 친화 열린관광지, 장애인 화장실, 경사로, 엘리베이터 편의시설 정보를 상세히 안내합니다.',
      heading: '부산 무장애(배리어프리) 열린관광지 가이드',
      bodyHtml: `
        <p>계단과 문턱 없이 휠체어 이용자, 유모차 동반 영유아 가족, 고령자 모두가 편안하게 둘러볼 수 있는 부산의 대표 무장애(Barrier-Free) 열린관광지와 편의시설 검증 정보를 제공합니다.</p>
        <h3>부산 대표 무장애 열린관광지</h3>
        <ul>
          <li><strong>해운대 해수욕장 &amp; 동백섬 APEC나루공원</strong>: 백사장 전면 호안도로 우든 데크길과 동백섬 순환 평지 산책로, 장애인 전용 화장실 및 경사로 완비</li>
          <li><strong>광안리 해수욕장 해변 테마거리</strong>: 광안역에서 해변까지 완만한 평지 보도 연결, 해변 산책로 단차 제거 구간 운영</li>
          <li><strong>다대포 해변공원 &amp; 고우니 생태길</strong>: 1호선 다대포해수욕장역 엘리베이터 직결, 무장애 나무 데크 생태탐방로와 꿈의 낙조분수 평지 관람석</li>
          <li><strong>국립해양박물관 &amp; 부산근현대역사관</strong>: 전 층 엘리베이터, 수유실, 휠체어·유모차 무료 대여소 및 장애인 화장실 구비</li>
        </ul>
      `
    },
    {
      path: '/my-route',
      title: '나만의 맞춤 부산 여행 루트 플래너 & 대중교통 길찾기 | 스텝레스 Stepless',
      description: '원하는 부산 여행 명소와 맛집을 담아 동선 거리를 계산하고, 네이버 지도 및 구글맵 실시간 대중교통 길찾기로 바로 연결하는 맞춤 여행 플래너입니다.',
      heading: '내 여행 루트 만들기 & 실시간 대중교통 길찾기',
      bodyHtml: `
        <p>스텝리스의 '내 여행 루트' 기능은 여행자가 방문하고 싶은 부산의 해변, 박물관, 전통시장, 맛집을 순서대로 담으면 장소 간 직선거리(km)를 자동으로 계산하고, 한국어 환경에서는 네이버 지도 대중교통 길찾기로, 영어 환경에서는 Google Maps Directions로 즉시 연결해 줍니다.</p>
      `
    },
    {
      path: '/tips',
      title: '부산 여행 코스 추천 & 대중교통 무장애 가이드 허브 | 스텝레스 Stepless',
      description: '부산 테마별·일정별 추천 여행 코스부터 시내버스·지하철 환승 팁, 어린이 요금 무료 혜택, 로컬 탐구생활 매거진까지 한곳에서 확인하세요.',
      heading: '부산 여행 코스 & 대중교통 로컬 가이드 허브',
      bodyHtml: `
        <p>부산 여행을 준비하는 분들을 위한 테마별·일정별 추천 코스와 대중교통 실전 이용 팁을 종합 안내합니다.</p>
        <ul>
          <li><a href="/tips/courses">부산 테마별·일정별 추천 여행 코스</a></li>
          <li><a href="/tips/transit">부산 대중교통 이용 팁 5선</a></li>
          <li><a href="/tips/exploration">부산 탐구생활 로컬 매거진</a></li>
          <li><a href="/schedule">부산 주요 축제·행사 일정</a></li>
        </ul>
      `
    },
    {
      path: '/tips/courses',
      title: '부산 테마별 & 일정별 추천 여행 코스 총정리 | 스텝레스 Stepless',
      description: '당일치기, 1박 2일, 2박 3일 일정별 코스와 식도락 맛집, 체험·박물관, 전통시장, 도시철도 무장애 테마 코스를 상세 동선과 함께 안내합니다.',
      heading: '부산 테마별 & 일정별 추천 여행 코스',
      bodyHtml: `
        <p>여행 일정과 동행자의 취향에 맞춰 선택할 수 있는 부산 대표 추천 여행 코스입니다. 각 코스는 지하철역 엘리베이터 출구 및 시내버스 환승 동선, 무장애 편의시설 정보를 함께 수록하고 있습니다.</p>
        <ul>
          <li><a href="/tips/courses/day"><strong>당일치기 추천 코스</strong></a>: 부산역 출발 원도심·영도·광안리·해운대 핵심 일주</li>
          <li><a href="/tips/courses/1night"><strong>1박 2일 추천 코스</strong></a>: 동부산 해변 휴양과 원도심 야경·미식 투어</li>
          <li><a href="/tips/courses/2nights"><strong>2박 3일 추천 코스</strong></a>: 해운대·기장·광안리·서면·남포·영도 완전정복</li>
          <li><a href="/tips/courses/subway"><strong>부산도시철도 무장애 코스</strong></a>: 1호선·2호선 엘리베이터 출구 중심 계단 없는 여행</li>
          <li><a href="/tips/courses/gourmet"><strong>식도락 (부산 맛집) 코스</strong></a>: 돼지국밥, 밀면, 씨앗호떡, 자갈치 활어회, 오션뷰 카페</li>
          <li><a href="/tips/courses/experience"><strong>체험 &amp; 문화 공간 코스</strong></a>: 국립해양박물관, 시립미술관, F1963, 아르떼뮤지엄</li>
          <li><a href="/tips/courses/market"><strong>전통시장 투어 코스</strong></a>: 자갈치시장, 부평깡통야시장, 국제시장, 부전시장</li>
          <li><a href="/tips/courses/attraction"><strong>부산 핵심 명소 코스</strong></a>: 해운대, 광안리, 감천문화마을, 흰여울문화마을, 해동용궁사</li>
        </ul>
      `
    },
    {
      path: '/tips/courses/gourmet',
      title: '부산 식도락 맛집 여행 코스 추천 (돼지국밥·밀면·해산물·카페) | 스텝레스 Stepless',
      description: '부산 현지인이 추천하는 원조 돼지국밥 노포, 밀면 명가, 자갈치시장 해산물, 부평깡통시장 야시장 먹거리와 전포·광안리·영도 오션뷰 카페 코스입니다.',
      heading: '부산 식도락 (로컬 맛집 & 오션뷰 카페) 추천 코스',
      bodyHtml: `
        <p>미식의 도시 부산에서 놓칠 수 없는 로컬 노포 맛집과 감성 카페를 권역별로 연결한 식도락 여행 코스입니다. 1층 평지 출입구 여부와 유모차·캐리어 동반 진입 팁을 함께 안내합니다.</p>
        <ul>
          <li><strong>서면·전포 미식 &amp; 카페 거리</strong>: 서면 시장 돼지국밥 골목(서면역 1·7번 출구)과 전포 카페거리·사잇길 디저트 투어(전포역 3·4·7번 출구)</li>
          <li><strong>남포·자갈치 원도심 노포 투어</strong>: 자갈치시장 현대화 건물 활어회·생선구이(엘리베이터 완비), 비프광장 씨앗호떡, 부평깡통야시장 먹거리 골목</li>
          <li><strong>광안리·민락·해운대 오션뷰 다이닝</strong>: 민락수변공원 인근 해산물 맛집과 광안대교 뷰 카페, 해운대 전통시장 및 구남로 미식 거리</li>
        </ul>
      `
    },
    {
      path: '/tips/courses/experience',
      title: '부산 체험 & 박물관·복합문화공간 여행 코스 추천 | 스텝레스 Stepless',
      description: '국립해양박물관, 국립부산과학관, 부산근현대역사관, 뮤지엄원, 아르떼뮤지엄 부산, F1963 등 실내외 무장애 문화·예술 체험 코스를 안내합니다.',
      heading: '부산 체험 & 박물관·복합문화공간 추천 코스',
      bodyHtml: `
        <p>비 오는 날이나 무더운 여름, 추운 겨울에도 아이와 가족, 연인이 쾌적하게 즐길 수 있는 부산의 대표 박물관·미술관·복합문화공간 코스입니다. 대부분의 국공립 박물관과 미술관은 전 층 엘리베이터와 휠체어·유모차 대여 서비스를 제공합니다.</p>
        <ul>
          <li><strong>영도 국립해양박물관 &amp; 아르떼뮤지엄 부산</strong>: 대형 수족관, 해양 도서관, 미디어아트 전시관까지 평지 및 엘리베이터로 연결</li>
          <li><strong>센텀시티·벡스코 문화벨트</strong>: 부산시립미술관, 영화의전당, 뮤지엄원, 신세계센텀시티 실내 문화 공간 (2호선·동해선 벡스코역 직결)</li>
          <li><strong>수영 F1963 복합문화공간 &amp; 원도심 부산근현대역사관</strong>: 와이어 공장을 재생한 문화 공간(예스24 중고서점, 국제갤러리, 카페)과 근현대 역사 전시관</li>
        </ul>
      `
    },
    {
      path: '/tips/courses/market',
      title: '부산 전통시장 투어 추천 코스 (자갈치·깡통·국제·부전시장) | 스텝레스 Stepless',
      description: '자갈치시장, 부평깡통시장 야시장, 국제시장, 부전마켓타운까지 부산 4대 전통시장의 먹거리와 무장애 평지 아케이드 이동 동선을 안내합니다.',
      heading: '부산 4대 전통시장 투어 무장애 코스',
      bodyHtml: `
        <p>부산의 활기찬 인심과 다채로운 길거리 음식을 만날 수 있는 전통시장 투어 코스입니다. 지붕 아케이드와 평탄한 포장도로가 정비된 주요 통로를 따라 유모차나 보행 보조기구로도 편리하게 이동할 수 있습니다.</p>
        <ul>
          <li><strong>자갈치시장 (1호선 자갈치역 10번 출구)</strong>: 현대식 신축 본관 건물 내 대형 엘리베이터와 장애인 화장실이 완비되어 1층 수산시장부터 2층 회센터, 7층 전망대까지 무장애 이동 가능</li>
          <li><strong>부평깡통시장 &amp; 국제시장 (자갈치역 3·7번 출구)</strong>: 비프광장을 지나 평지로 이어지는 아케이드 골목으로 유부주머니, 비빔당면, 씨앗호떡 등 대표 먹거리 밀집</li>
          <li><strong>부전마켓타운 (1호선·동해선 부전역)</strong>: 부산 최대 규모의 농수산물·인삼·어묵 재래시장으로 평지 보도와 바로 연결</li>
        </ul>
      `
    },
    {
      path: '/tips/courses/attraction',
      title: '부산 핵심 명소 여행 코스 (해운대·광안리·흰여울·해동용궁사·해광사 용왕단) | 스텝레스 Stepless',
      description: '부산 여행에서 꼭 가봐야 할 해운대 해수욕장, 광안리 해변, 감천문화마을, 영도 흰여울문화마을, 기장 해동용궁사와 해광사 용왕단 핵심 명소 동선과 무장애 포인트를 안내합니다.',
      heading: '부산 대표 핵심 명소 베스트 코스',
      bodyHtml: `
        <p>처음 부산을 방문하는 여행자부터 재방문객까지 가장 사랑받는 부산의 랜드마크 명소 코스입니다. 각 명소별 계단 유무와 엘리베이터·평지 전망대 우회 팁을 함께 제공합니다.</p>
        <ul>
          <li><strong>해운대 해수욕장 &amp; 블루라인파크 해변열차</strong>: 구남로 광장부터 백사장 우든 데크길, 미포~송정 해변열차까지 계단 없이 탁 트인 동해 바다 감상</li>
          <li><strong>광안리 해수욕장 &amp; 민락수변공원</strong>: 광안대교 야경과 해변 산책로가 전 구간 평지로 이어져 야간 산책에 최적</li>
          <li><strong>기장 해동용궁사 &amp; 해광사 용왕단 (기장군 기장해안로 340)</strong>: 해동용궁사에서 해안도로를 따라 조금만 내려오면 만날 수 있는 바다 위 비경 사찰 해광사 용왕단 연계 코스</li>
          <li><strong>감천문화마을 &amp; 영도 흰여울문화마을</strong>: 골목 안쪽은 계단이 많으므로 유모차·휠체어 이용 시 상단 공영주차장 앞 메인 전망 데크 및 해안도로 상부 보행 데크 구간 중심으로 관람 권장</li>
        </ul>
      `
    },
    {
      path: '/tips/courses/day',
      title: '부산 당일치기 여행 추천 코스 (부산역 출발 알짜 일주) | 스텝레스 Stepless',
      description: '하루 만에 부산역에서 출발해 원도심 자갈치·남포동, 광안리 해변, 해운대까지 계단 걱정 없이 알차게 돌아보는 당일치기 추천 여행 코스입니다.',
      heading: '부산 당일치기 알짜 추천 여행 코스',
      bodyHtml: `
        <p>KTX·SRT 부산역에 오전 도착하여 저녁 열차로 돌아가는 당일치기 여행자를 위해 이동 시간을 최소화하고 도시철도 1·2호선 엘리베이터 출구만으로도 핵심 바다와 미식을 모두 즐길 수 있도록 설계한 원데이 코스입니다.</p>
        <ol>
          <li><strong>오전 (부산역 → 남포·자갈치)</strong>: 1호선 부산역(4·6번 출구 엘리베이터) 탑승 후 자갈치역 하차 → 자갈치시장 &amp; 비프광장 브런치·산책</li>
          <li><strong>오후 (서면·전포 → 광안리)</strong>: 1·2호선 서면역 환승 후 전포 카페거리 티타임 → 2호선 광안역(3·5번 출구) 하차 후 광안리 해변 산책</li>
          <li><strong>저녁 (해운대 &amp; 동백섬)</strong>: 2호선 해운대역(1·3번 출구) 하차 → 해운대 해변 우든 데크길 일몰 감상 및 저녁 식사 후 부산역 복귀</li>
        </ol>
      `
    },
    {
      path: '/tips/courses/1night',
      title: '부산 1박 2일 여행 추천 코스 (바다·미식·야경 힐링) | 스텝레스 Stepless',
      description: '1일차 원도심·영도·광안리 야경 투어와 2일차 해운대·센텀·기장 오션뷰 코스로 구성된 부산 1박 2일 베스트 여행 일정을 확인하세요.',
      heading: '부산 1박 2일 추천 여행 코스',
      bodyHtml: `
        <p>주말을 활용해 부산의 서쪽(원도심·영도)과 동쪽(해운대·광안리·기장)을 균형 있게 둘러보는 1박 2일 표준 여행 코스입니다.</p>
        <ul>
          <li><strong>1일차 (원도심 &amp; 광안리 야경)</strong>: 부산역 도착 → 초량 차이나타운·남포동·자갈치시장 점심 → 영도 국립해양박물관 및 오션뷰 카페 → 광안리 해수욕장 야경 &amp; 저녁 식사</li>
          <li><strong>2일차 (해운대 &amp; 센텀시티)</strong>: 해운대 해수욕장 산책로 &amp; 동백섬 APEC나루공원 → 해운대 해변열차(미포~청사포) → 벡스코·부산시립미술관 또는 신세계센텀시티 관람 후 복귀</li>
        </ul>
      `
    },
    {
      path: '/tips/courses/2nights',
      title: '부산 2박 3일 여행 추천 코스 (동부산·원도심·서부산 완전정복) | 스텝레스 Stepless',
      description: '해운대·기장부터 광안리·서면·전포, 남포동·영도·다대포 일몰까지 2박 3일 동안 여유롭게 즐기는 부산 핵심 여행 코스를 안내합니다.',
      heading: '부산 2박 3일 완전정복 추천 여행 코스',
      bodyHtml: `
        <p>가족 여행이나 부모님·아이 동반 여행에서도 무리 없는 일정으로 부산의 3대 권역을 깊이 있게 체험하는 2박 3일 코스입니다.</p>
        <ul>
          <li><strong>1일차 (도심 &amp; 광안리)</strong>: 부산역 → 서면 돼지국밥 &amp; 전포 카페거리 → 수영 F1963 복합문화공간 → 광안리 해변 야경</li>
          <li><strong>2일차 (해운대 &amp; 기장 동부산)</strong>: 해운대 해수욕장·동백섬 → 블루라인파크 해변열차 → 기장 오시리아 관광단지(국립부산과학관·롯데월드·해동용궁사)</li>
          <li><strong>3일차 (원도심 &amp; 다대포)</strong>: 자갈치시장·부평깡통시장 → 영도 국립해양박물관 → 다대포 해변공원 무장애 생태탐방로 일몰 감상 후 부산역 이동</li>
        </ul>
      `
    },
    {
      path: '/tips/courses/3nights',
      title: '부산 3박 4일 여유로운 힐링 여행 추천 코스 | 스텝레스 Stepless',
      description: '바쁜 일정 대신 해변 산책로, 미술관, 온천, 전통시장을 느긋하게 둘러보는 3박 4일 부산 슬로우 트래블 코스를 소개합니다.',
      heading: '부산 3박 4일 여유로운 힐링 코스',
      bodyHtml: `
        <p>하루 2~3곳의 명소만 여유롭게 방문하며 부산의 바다와 온천, 미술관, 로컬 미식을 깊이 있게 즐기는 3박 4일 힐링 일정입니다. 보행 약자나 영유아 동반 가족에게 특히 추천합니다.</p>
      `
    },
    {
      path: '/tips/courses/4nights',
      title: '부산 4박 5일 전 지역 일주 여행 추천 코스 | 스텝레스 Stepless',
      description: '원도심, 서부산 다대포·을숙도, 도심 서면·동래, 동부산 해운대·송정·기장까지 부산 전역을 완벽하게 여행하는 4박 5일 코스입니다.',
      heading: '부산 4박 5일 전 지역 완전정복 코스',
      bodyHtml: `
        <p>부산의 숨은 생태 명소인 을숙도 생태공원·현대미술관부터 다대포 해변, 원도심 역사 길, 동래 온천장, 해운대·기장 해안선까지 4박 5일간 부산 전역을 아우르는 일주 코스입니다.</p>
      `
    },
    {
      path: '/tips/courses/subway',
      title: '부산도시철도(1·2호선) 무장애 지하철 테마 여행 코스 | 스텝레스 Stepless',
      description: '렌터카 없이 부산 지하철 1호선과 2호선 엘리베이터 출구만을 이용해 계단 걱정 없이 다녀올 수 있는 역세권 베스트 여행 코스입니다.',
      heading: '부산도시철도 1·2호선 무장애 테마 여행 코스',
      bodyHtml: `
        <p>운전과 주차 스트레스 없이 부산 도시철도 1일권(6,000원) 또는 교통카드 하나로 다닐 수 있는 지하철 역세권 무장애 여행 코스입니다.</p>
        <ul>
          <li><strong>1호선 역사·시장·일몰 라인</strong>: 부산역(4·6번 출구) → 중앙역(8·12번 출구, 40계단·근현대역사관) → 남포역·자갈치역(전통시장·용두산공원) → 다대포해수욕장역(2·3·4번 출구, 해변공원 생태탐방로)</li>
          <li><strong>2호선 카페·오션뷰·문화 라인</strong>: 전포역(3·4번 출구, 전포 카페거리) → 광안역(3·5번 출구, 광안리 해변) → 벡스코역(시립미술관·센텀시티) → 동백역·해운대역(1·3번 출구, 해운대 해변)</li>
        </ul>
      `
    },
    {
      path: '/tips/courses/barrier-free',
      title: '부산 무장애(배리어프리) 추천 여행 코스 | 스텝레스 Stepless',
      description: '휠체어 이용자, 유모차 동반 가족, 시니어 여행객을 위해 경사로와 엘리베이터, 장애인 화장실이 검증된 부산 무장애 여행 코스를 안내합니다.',
      heading: '부산 무장애(배리어프리) 테마 추천 코스',
      bodyHtml: `
        <p>승강장 엘리베이터부터 관광지 내부 보행 데크, 장애인 화장실, 저상버스 연계까지 전 구간의 물리적 장벽을 최소화한 배리어프리 전용 추천 코스입니다.</p>
      `
    },
    {
      path: '/tips/transit',
      title: '부산 대중교통 이용 팁 5선 (환승·어린이 무료·버스 QR·수하물) | 스텝레스 Stepless',
      description: '부산 지하철-시내버스 무료 환승 기준, 만 6~12세 어린이 요금 무료화, 시내버스 QR 결제, 대형 캐리어 반입 규정 및 콜택시 이용법을 총정리했습니다.',
      heading: '부산 대중교통 이용 팁 5대 핵심 가이드',
      bodyHtml: `
        <p>부산 여행 중 도시철도(1~4호선·동해선), 시내버스, 마을버스, 택시를 이용할 때 알아두면 교통비와 이동 시간을 아낄 수 있는 5가지 필수 대중교통 가이드입니다.</p>
        <ol>
          <li><strong>어린이 대중교통 요금 무료 (만 6세~12세)</strong>: 생년월일이 등록된 어린이 교통카드(티머니·이즐 등)를 태그하면 부산 시내버스·마을버스·도시철도 요금이 0원(무료)으로 처리됩니다.</li>
          <li><strong>시내버스 QR 간편결제 시스템</strong>: 실물 교통카드가 없거나 현금만 소지한 경우에도 버스 단말기에 부착된 QR코드를 스마트폰으로 스캔하여 간편하게 요금을 결제할 수 있습니다.</li>
          <li><strong>30분 이내 대중교통 무료 환승 (최대 2회)</strong>: 도시철도, 시내버스, 마을버스, 부산김해경전철, 동해선 간 하차 태그 후 30분(일부 외곽 노선 60분) 이내에 갈아타면 최대 2회까지 무료 환승(높은 교통수단 기본요금 차액만 부과)이 적용됩니다.</li>
          <li><strong>시내버스 대형 캐리어 반입 규격 제한 안내</strong>: 부산 시내버스 여객운송약관상 대형 수하물(통상 28인치 이상 대형 여행용 캐리어)은 차내 통로 안전을 위해 승차가 거부될 수 있으므로 도시철도나 택시, 역내 물품보관함(T-Luggage) 이용을 권장합니다.</li>
          <li><strong>부산 콜택시 &amp; 교통약자 이동지원(두리발·바우처 택시)</strong>: 부산시 공식 브랜드 택시인 동백택시와 보행상 장애인을 위한 특별교통수단 두리발·바우처 택시 이용 방법을 안내합니다.</li>
        </ol>
      `
    },
    {
      path: '/tips/child-free',
      title: '부산 영유아·어린이 대중교통 요금 무료 가이드 & 유모차 팁 | 스텝레스 Stepless',
      description: '만 6세 미만 영유아 및 만 6~12세 어린이의 부산 지하철·시내버스 무료 탑승 조건과 편의점 어린이 교통카드 등록 방법, 유모차 개찰구 통과 팁을 안내합니다.',
      heading: '부산 영유아·어린이 대중교통 요금 무료 이용 가이드',
      bodyHtml: `
        <p>부산광역시는 전국 최초로 어린이 대중교통 요금 전면 무료화를 시행하고 있습니다. 타 지역에서 부산으로 여행 온 어린이도 생년월일이 등록된 어린이용 교통카드(티머니, 이즐/캐시비 등)를 단말기에 태그하면 부산 시내버스, 마을버스, 도시철도(1~4호선)를 무료로 이용할 수 있습니다. 유모차 동반 시에는 각 지하철역 개찰구 양 끝의 광폭 배리어프리 게이트(비상게이트)를 이용하시면 걸림 없이 통과할 수 있습니다.</p>
      `
    },
    {
      path: '/tips/bus-qr',
      title: '부산 시내버스 모바일 QR 결제 이용 가이드 | 스텝레스 Stepless',
      description: '부산 시내버스의 현금 없는 버스 운영에 맞춰 교통카드 없이 스마트폰 카메라로 QR코드를 스캔해 버스 요금을 결제하는 방법을 단계별로 설명합니다.',
      heading: '부산 시내버스 QR 간편결제 이용 가이드',
      bodyHtml: `
        <p>부산 시내버스는 '현금 없는 버스'가 전면 확대 운영되고 있습니다. 교통카드를 깜빡했거나 외국인 관광객인 경우, 버스 운전석 옆에 부착된 QR코드를 스마트폰 카메라로 스캔하면 모바일 결제 페이지로 연결되어 신용카드나 간편결제로 즉시 탑승권을 결제할 수 있습니다. 단, 무료 환승 혜택을 받으려면 실물 또는 모바일 선·후불 교통카드 태그를 권장합니다.</p>
      `
    },
    {
      path: '/tips/taxi',
      title: '부산 콜택시(동백택시) & 교통약자 바우처 택시·두리발 안내 | 스텝레스 Stepless',
      description: '부산 대표 콜택시 전화번호와 호출 앱, 휠체어 탑승 설비가 장착된 특별교통수단 두리발 및 임산부 마미콜 이용 방법을 상세히 안내합니다.',
      heading: '부산 콜택시 & 교통약자 특별교통수단(두리발) 가이드',
      bodyHtml: `
        <p>대형 캐리어를 여러 개 소지했거나 가파른 언덕 명소(감천문화마을, 흰여울문화마을 상부 등)로 이동할 때는 택시를 적절히 병행하면 체력을 크게 아낄 수 있습니다. 부산 지역 브랜드 콜택시(등대콜, 부산콜 등)와 카카오T·우버(UT) 앱 호출이 모두 원활하며, 휠체어 이용 장애인을 위한 부산시설공단 '두리발' 특장차량도 사전 접수 후 이용할 수 있습니다.</p>
      `
    },
    {
      path: '/tips/exploration',
      title: '부산 탐구생활 로컬 매거진 - 무료 짐보관·휠체어 대여·꿀팁 | 스텝레스 Stepless',
      description: '부산 무료 짐 보관소 4곳, 유모차·휠체어 무료 대여소 위치, 지하철 반대편 승강장 무료 재진입 팁, 실전 부산 사투리 가이드까지 로컬 알짜 정보를 모았습니다.',
      heading: '부산 탐구생활 로컬 트래블 매거진',
      bodyHtml: `
        <p>부산 현지 에디터가 직접 확인하고 정리한 부산 여행 실전 치트키와 편의시설 꿀팁 모음입니다.</p>
        <ul>
          <li><a href="/tips/exploration/luggage"><strong>부산 무료 짐 보관소 &amp; 물품보관함 총정리</strong></a>: 부산역 트래블라운지, 백화점 무료 보관소, 주요 지하철역 T-Luggage 위치</li>
          <li><a href="/tips/exploration/rental"><strong>부산 유모차·휠체어 무료 대여소 안내</strong></a>: 광안리 관광안내소, 태종대, 백화점, 박물관 등 대여 장소 및 운영시간</li>
          <li><a href="/tips/exploration/metro-reentry"><strong>부산 지하철 승강장 방향 실수 시 10분 내 무료 재진입 제도</strong></a>: 반대편 개찰구로 잘못 들어갔을 때 추가 요금 없이 건너가는 방법</li>
          <li><a href="/tips/exploration/korean-cheat-codes"><strong>5초 만에 배우는 실전 한국어 &amp; 부산 사투리 가이드</strong></a>: 식당·시장·택시에서 바로 쓰는 친근한 표현</li>
          <li><a href="/tips/exploration/bootech"><strong>부산 북항 친수공원 산책 &amp; 이색 명소 가이드</strong></a>: 부산역 인근 북항 수변 산책로 및 흑백 영수증 사진기 명소</li>
          <li><a href="/tips/exploration/bujeon-masan"><strong>2027년 4월 1일 부전~마산 복선전철 부분 개통 예정 안내</strong></a>: 부산 부전~사상 및 강서금호~진례신호소 구간 우선 운영 소식</li>
          <li><a href="/tips/exploration/opera-house"><strong>북항의 새로운 문화 랜드마크! 부산오페라하우스 2027년 시범공연 예정</strong></a>: 부산항 북항 친수공원 연계 해양 문화 랜드마크 소식</li>
        </ul>
      `
    },
    {
      path: '/tips/exploration/bootech',
      title: '부산 북항 친수공원 산책 & 로컬 이색 명소 가이드 - 부산 탐구생활 | 스텝레스 Stepless',
      description: 'KTX 부산역과 보행 데크로 직결되는 부산항 북항 친수공원 평지 수변 산책로와 부산 로컬 영수증 사진기 명소 등 이색 볼거리를 안내합니다.',
      heading: '부산 북항 친수공원 & 로컬 이색 스팟 가이드',
      bodyHtml: `
        <p>KTX 부산역 2층 맞이방에서 출구로 나와 공중 보행 데크와 엘리베이터를 이용하면 부산항 북항 친수공원까지 계단 없이 평지로 이동할 수 있습니다. 탁 트인 바다 전망과 야간 조명 산책로가 조성되어 있어 기차 탑승 전후 캐리어나 유모차를 끌고 가볍게 산책하기 가장 좋은 코스입니다.</p>
      `
    },
    {
      path: '/tips/exploration/bujeon-masan',
      title: '2027년 4월 1일 부전~마산 복선전철 부분 개통 예정 안내 - 부산 탐구생활 | 스텝레스 Stepless',
      description: '2027년 4월 1일 부분 개통 예정인 부전~마산 복선전철의 우선 운영 구간(부산 부전~사상, 강서금호~진례신호소) 및 부산 광역철도 무장애 환승 기대 효과를 안내합니다.',
      heading: '2027년 4월 1일 부전~마산 복선전철 부분 개통 예정 안내',
      bodyHtml: `
        <p>부산 도심과 서부산·경남권을 잇는 핵심 광역철도인 부전~마산 복선전철이 2027년 4월 1일 부분 개통될 예정입니다. 부산 부전~사상 구간과 강서금호~진례신호소 구간이 먼저 운영되며, 동해선·중앙선 부전역과 도시철도 2호선·부산김해경전철 사상역 간 빠른 철도 환승 및 최신 무장애(배리어프리) 엘리베이터·승강장 편의시설을 이용할 수 있습니다.</p>
      `
    },
    {
      path: '/tips/exploration/opera-house',
      title: '북항의 새로운 문화 랜드마크! 부산오페라하우스 2027년 시범공연 예정 - 부산 탐구생활 | 스텝레스 Stepless',
      description: '부산항 북항 재개발지구 수변에 들어서는 새로운 해양 문화 랜드마크 부산오페라하우스의 2027년 시범공연 예정 소식과 북항 친수공원 무장애 연결 동선을 안내합니다.',
      heading: '북항의 새로운 문화 랜드마크! 부산오페라하우스 2027년 시범공연 예정',
      bodyHtml: `
        <p>부산항 북항 재개발지구 해양문화지구에 조성 중인 부산오페라하우스가 2027년 시범공연을 앞두고 있습니다. 대극장 1,800석과 소극장 300석을 갖춘 동남권 최초 전문 오페라 공연장이자 새로운 북항 문화 랜드마크로, KTX 부산역 보행 데크와 북항 친수공원 평지 산책로를 통해 계단 없이 이어집니다.</p>
      `
    },
    {
      path: '/tips/exploration/luggage',
      title: '부산 무료 짐 보관소 총정리 (부산역·서면·해운대·광안리) - 부산 탐구생활 | 스텝레스 Stepless',
      description: '무거운 캐리어를 맡기고 두 손 가볍게 여행할 수 있는 부산 무료 짐 보관소 4곳과 주요 지하철역 무인 물품보관함(T-Luggage) 요금·위치를 총정리했습니다.',
      heading: '부산 무료 짐 보관소 & 지하철 캐리어 보관함 총정리',
      bodyHtml: `
        <p>체크인 전이나 체크아웃 후 무거운 캐리어 때문에 이동이 불편할 때 활용할 수 있는 부산 지역 무료 수하물 보관소(부산역 인근 부산트레블라운지, 롯데백화점 부산본점·광복점·센텀시티점 고객서비스센터, 광안리 관광안내소 등)의 운영시간과 위치, 그리고 서면역·부산역·해운대역·광안역 역사 내 대형 물품보관함 위치를 안내합니다.</p>
      `
    },
    {
      path: '/tips/exploration/rental',
      title: '부산 유모차·휠체어 무료 대여소 위치 및 이용시간 총정리 - 부산 탐구생활 | 스텝레스 Stepless',
      description: '영유아 동반 가족과 보행 약자를 위해 부산 주요 관광지 안내소, 박물관, 백화점에서 운영하는 유모차 및 수동 휠체어 무료 대여소 정보를 안내합니다.',
      heading: '부산 유모차·휠체어 무료 대여소 안내',
      bodyHtml: `
        <p>여행 중 갑작스럽게 유모차나 휠체어가 필요할 때 신분증 지참 시 무료로 대여해 주는 주요 거점(광안리 해변 관광안내소, 국립해양박물관, 부산시립미술관, 벡스코, 주요 백화점 유모차 대여 데스크 등)의 위치와 대여 절차를 상세히 정리했습니다.</p>
      `
    },
    {
      path: '/tips/exploration/korean-cheat-codes',
      title: '실전 한국어 & 부산 여행 필수 표현 가이드 - 부산 탐구생활 | 스텝레스 Stepless',
      description: '부산 전통시장, 식당, 지하철, 택시에서 바로 활용할 수 있는 실전 한국어 발음 치트키와 친근한 부산 로컬 표현을 소개합니다.',
      heading: '실전 한국어 & 부산 로컬 여행 회화 치트키',
      bodyHtml: `
        <p>외국인 여행객과 타 지역 방문객이 부산의 전통시장, 돼지국밥집, 택시, 지하철역에서 현지인과 더욱 반갑고 정확하게 소통할 수 있는 필수 여행 표현과 발음 가이드를 제공합니다.</p>
      `
    },
    {
      path: '/tips/exploration/metro-reentry',
      title: '부산 지하철 반대편 승강장 실수 시 10분 내 무료 재진입 팁 - 부산 탐구생활 | 스텝레스 Stepless',
      description: '부산 도시철도 상대식 승강장에서 행선지 방향을 착각해 개찰구를 잘못 통과했을 때 추가 요금 없이 10분 이내 무료로 반대편 개찰구로 재진입하는 방법입니다.',
      heading: '부산 지하철 승강장 방향 실수 시 무료 재진입 가이드',
      bodyHtml: `
        <p>부산 도시철도 1·2호선에는 상행선과 하행선 개찰구가 분리된 상대식 승강장 역이 많습니다. 만약 반대 방향 개찰구로 잘못 들어갔더라도 당황할 필요 없이, 하차 태그 후 10분 이내에 동일 역의 반대편 개찰구(동일 교통카드 사용)에 다시 태그하면 기본요금이 이중 부과되지 않고 무료(0원)로 재진입이 허용됩니다(최초 1회).</p>
      `
    },
    {
      path: '/about',
      title: '스텝리스(Stepless) 서비스 소개 & 운영자 스토리 | 스텝레스 Stepless',
      description: '계단 없는 부산여행을 만드는 스텝리스(Stepless) 프로젝트의 탄생 배경, 운영자 플로레르(Floreur) 소개 및 공공데이터·현장 실사 검증 원칙을 안내합니다.',
      heading: '스텝리스(Stepless) 서비스 소개 및 운영 철학',
      bodyHtml: `
        <p>스텝리스(Stepless in Busan)는 휠체어 이용자, 유모차를 끄는 부모님, 무거운 캐리어를 가진 여행자, 그리고 계단 보행이 부담스러운 어르신 모두가 물리적 장벽 없이 부산의 바다와 문화를 온전히 누릴 수 있도록 돕는 배리어프리(무장애) 도시철도 및 여행 동선 가이드입니다.</p>
        <p>부산교통공사 공식 승강편의시설 데이터와 한국관광공사 무장애 열린관광지 데이터를 바탕으로, 실제 지하철역 출구의 경사와 지면 단차, 엘리베이터 연결 여부를 직접 검증하여 가장 안전하고 정확한 이동 경로를 제공합니다.</p>
      `
    },
    {
      path: '/about/privacy',
      title: '개인정보처리방침 (Privacy Policy) | 스텝레스 Stepless',
      description: '스텝리스(Stepless) 서비스의 개인정보처리방침, 쿠키(Cookie) 운용 정책 및 Google AdSense 맞춤형 광고 안내입니다.',
      heading: '스텝리스(Stepless) 개인정보처리방침',
      bodyHtml: `
        <p>스텝리스(Stepless, 이하 "서비스")는 이용자의 개인정보를 중요시하며 「개인정보 보호법」 및 관련 법령을 준수합니다. 본 서비스는 별도의 회원가입 없이 모든 지하철 무장애 경로 및 여행 코스 정보를 무료로 열람할 수 있도록 제공합니다.</p>
        <h3>1. 수집하는 개인정보 항목 및 목적</h3>
        <p>서비스 오류 제보 및 문의하기 양식을 통해 이용자가 자발적으로 입력한 이메일 주소 및 제보 내용은 문의 답변과 데이터 정정 목적으로만 활용되며, 목적 달성 후 지체 없이 파기됩니다. 내 주변 역 찾기 기능 이용 시 위치 정보(GPS)는 사용자 브라우저 내에서만 일시 계산되며 서버에 저장되지 않습니다.</p>
        <h3>2. 쿠키(Cookie) 및 Google AdSense 광고 안내</h3>
        <p>본 사이트는 Google AdSense 등 제3자 광고 서비스를 통해 광고를 게재할 수 있으며, Google을 포함한 제3자 공급업체는 쿠키를 사용하여 사용자의 이전 웹사이트 방문 기록을 기반으로 맞춤형 광고를 제공합니다. 이용자는 브라우저 설정 또는 Google 광고 설정(adssettings.google.com)에서 맞춤형 광고 쿠키를 언제든 거부할 수 있습니다.</p>
      `
    },
    {
      path: '/about/terms',
      title: '서비스 이용약관 (Terms of Service) | 스텝레스 Stepless',
      description: '스텝리스(Stepless) 부산 무장애 지하철 및 여행 가이드 서비스의 이용약관과 저작권, 면책 사항을 안내합니다.',
      heading: '스텝리스(Stepless) 서비스 이용약관',
      bodyHtml: `
        <p>본 약관은 스텝리스(Stepless)가 제공하는 부산 지하철 배리어프리 경로 안내 및 추천 여행 코스 서비스의 이용 조건과 책임 사항을 규정합니다. 본 서비스의 지하철 승강편의시설 정보는 부산교통공사 공공데이터 및 현장 조사를 바탕으로 제공되나, 역사 내 일시적인 엘리베이터 보수 점검이나 공사 상황에 따라 현장 상황과 차이가 발생할 수 있으므로 이동 전 역사 안내 표지를 함께 확인하시기 바랍니다.</p>
      `
    },
    {
      path: '/about/contact',
      title: '정보 오류 제보 및 제휴 문의 (Contact Us) | 스텝레스 Stepless',
      description: '부산 지하철 엘리베이터·출구 정보 정정 제보, 신규 무장애 코스 제안 및 제휴 문의 안내 페이지입니다.',
      heading: '정보 오류 제보 및 제휴 문의',
      bodyHtml: `
        <p>현장 엘리베이터 점검 소식이나 출구 정보 수정 요청, 무장애 여행 코스 제보 및 서비스 제휴 문의는 공식 이메일(<a href="mailto:floreur88@gmail.com">floreur88@gmail.com</a>)로 보내주시면 운영팀에서 신속히 확인 후 반영하겠습니다.</p>
      `
    },
    {
      path: '/about/data-source',
      title: '공공데이터 출처 및 현장 실사 검증 기준 | 스텝레스 Stepless',
      description: '스텝리스가 활용하는 부산교통공사 도시철도 편의시설 공공데이터, 한국관광공사 배리어프리 TourAPI 출처 및 현장 검증 기준을 투명하게 공개합니다.',
      heading: '공공데이터 출처 및 데이터 검증 프로세스',
      bodyHtml: `
        <p>스텝리스의 모든 지하철역 및 무장애 관광지 데이터는 아래의 공인 공공데이터와 현장 실사를 결합하여 정기적으로 갱신됩니다.</p>
        <ul>
          <li><strong>부산교통공사(Humetro)</strong>: 부산 도시철도 1~4호선 역사별 엘리베이터·에스컬레이터·휠체어리프트 설치 현황 및 출구 정보</li>
          <li><strong>한국관광공사(VisitKorea TourAPI 4.0)</strong>: 국문·영문 무장애(Barrier-Free) 열린관광지 편의시설 정보</li>
          <li><strong>부산광역시 공공데이터포털</strong>: 부산 주요 축제·문화행사 일정 및 교통약자 편의시설 현황</li>
        </ul>
      `
    },
  ];

  // Dynamically generate rich route metadata for all 15 stations from STATIONS
  for (const st of STATIONS) {
    const cleanEng = st.englishName.replace(/\s*Station$/i, '').trim();
    const linesText = st.lines.map(l => (l.includes('선') ? l : `${l}호선`)).join('·');
    const elevatorExits = st.exits.filter(e => e.hasElevator).map(e => e.number).join(', ');
    const escalatorExits = st.exits.filter(e => e.hasEscalator).map(e => e.number).join(', ');

    const exitsListHtml = st.exits
      .map(ex => {
        const badge = ex.hasElevator
          ? '엘리베이터 완비 (무단차)'
          : ex.hasEscalator
            ? '에스컬레이터 설치'
            : '계단 출구';
        const landmarks = ex.directionDesc ? ` — 방면 안내: ${ex.directionDesc}` : '';
        return `<li><strong>${escapeHtml(ex.number)}</strong> [${badge}]: ${escapeHtml(ex.tip || '')}${escapeHtml(landmarks)}</li>`;
      })
      .join('\n          ');

    routes.push({
      path: `/station/${st.id}`,
      title: `${st.name} 엘리베이터 위치 & 유모차·휠체어 무장애 출구 안내 | 스텝레스 Stepless`,
      description: `부산 지하철 ${linesText} ${st.name}(${cleanEng})의 지상 직결 엘리베이터 출구(${elevatorExits || '상세 안내'}), 에스컬레이터 위치, 유모차·휠체어·캐리어 무장애 이동 경로와 주변 명소를 확인하세요.`,
      heading: `${st.name} (${st.englishName}) 엘리베이터 & 무장애 출구 상세 가이드`,
      bodyHtml: `
        <p><strong>${escapeHtml(st.name)} (${escapeHtml(st.englishName)})</strong>은 부산 도시철도 <strong>${escapeHtml(linesText)}</strong>이 지나는 주요 역으로, 스텝리스에서 검증한 지상 연결 엘리베이터 및 에스컬레이터 출구별 무장애 이동 정보를 안내합니다.</p>
        <ul>
          <li><strong>운행 노선</strong>: ${escapeHtml(linesText)}</li>
          <li><strong>엘리베이터 보유 출구</strong>: ${escapeHtml(elevatorExits || '역사 내부 및 연계 엘리베이터 안내 참조')}</li>
          <li><strong>에스컬레이터 보유 출구</strong>: ${escapeHtml(escalatorExits || '출구별 상세 안내 참조')}</li>
        </ul>
        <h3>${escapeHtml(st.name)} 출구별 승강편의시설 및 주변 랜드마크 상세</h3>
        <ul>
          ${exitsListHtml}
        </ul>
        <p><a href="/search">← 전체 부산 지하철역 목록으로 돌아가기</a> | <a href="/tips/courses/subway">지하철 무장애 추천 여행 코스 보기 →</a></p>
      `
    });
  }

  return routes;
}

export function prerenderStaticRoutesPlugin(): Plugin {
  return {
    name: 'stepless-prerender-static-routes',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const baseIndexPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(baseIndexPath)) {
        return;
      }

      const templateHtml = fs.readFileSync(baseIndexPath, 'utf8');
      const routes = buildRoutes();

      for (const route of routes) {
        const canonicalUrl = `https://stepless.kr${route.path}`;
        let html = templateHtml;

        // 1. Replace <title>
        html = html.replace(
          /<title>[\s\S]*?<\/title>/,
          `<title>${escapeHtml(route.title)}</title>`
        );

        // 2. Replace <meta name="description">
        html = html.replace(
          /<meta name="description" content="[^"]*"\s*\/?>/,
          `<meta name="description" content="${escapeHtml(route.description)}" />`
        );

        // 3. Replace <link rel="canonical">
        html = html.replace(
          /<link rel="canonical" href="[^"]*"\s*\/?>/,
          `<link rel="canonical" href="${canonicalUrl}" />`
        );

        // 4. Replace Open Graph & Twitter tags
        html = html.replace(
          /<meta property="og:url" content="[^"]*"\s*\/?>/,
          `<meta property="og:url" content="${canonicalUrl}" />`
        );
        html = html.replace(
          /<meta property="og:title" content="[^"]*"\s*\/?>/,
          `<meta property="og:title" content="${escapeHtml(route.title)}" />`
        );
        html = html.replace(
          /<meta property="og:description" content="[^"]*"\s*\/?>/,
          `<meta property="og:description" content="${escapeHtml(route.description)}" />`
        );
        html = html.replace(
          /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
          `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`
        );
        html = html.replace(
          /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
          `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`
        );

        // 5. Inject route-specific primary article at the top of <main> inside #root
        const routeArticleHtml = `<main>
          <article aria-label="${escapeHtml(route.heading)}" style="background: #FFFFFF; border: 1px solid #E5E2DC; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 22px; font-weight: 800; margin-top: 0; color: #11161B;">${escapeHtml(route.heading)}</h2>
            ${route.bodyHtml}
          </article>`;

        html = html.replace('<main>', routeArticleHtml);

        // Write to dist/<route.path>.html so Cloudflare Pages serves /<route.path> with 200 OK (no trailing-slash 308 redirect)
        const relativeRoute = route.path.replace(/^\/+/, '').replace(/\/+$/, '');
        const htmlFilePath = path.join(distDir, `${relativeRoute}.html`);
        fs.mkdirSync(path.dirname(htmlFilePath), { recursive: true });
        fs.writeFileSync(htmlFilePath, html, 'utf8');

        // Also sync legacy root static HTML files in dist/
        if (route.path === '/about/privacy') {
          fs.writeFileSync(path.join(distDir, 'privacy.html'), html, 'utf8');
        } else if (route.path === '/about/terms') {
          fs.writeFileSync(path.join(distDir, 'terms.html'), html, 'utf8');
        }
      }

      console.log(`[stepless-prerender] Generated ${routes.length} static route HTML files in dist/`);
    }
  };
}
