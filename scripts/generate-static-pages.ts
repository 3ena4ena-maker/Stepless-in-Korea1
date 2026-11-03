import fs from 'fs';
import path from 'path';
import { STATIONS } from '../src/data';
import { BUSAN_ITINERARIES, ItineraryCourse } from '../src/data/itineraries';
import { BUSAN_TOUR_API_SPOTS } from '../src/data/tourApiSpots';

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

function buildCommonHeader(h1: string, lead: string, breadcrumbLabel?: string, routePath?: string): string {
  return `
        <header style="border-bottom: 1px solid #E5E2DC; padding-bottom: 16px; margin-bottom: 24px;">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px;">
            <a href="/" style="font-size: 20px; font-weight: 900; color: #11161B; text-decoration: none;">STEPLESS IN BUSAN · 계단 없는 부산여행 스텝리스</a>
            <nav aria-label="주요 메뉴" style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 14px; font-weight: 700;">
              <a href="/" style="color: #5B7332; text-decoration: none;">홈</a>
              <a href="/search" style="color: #334155; text-decoration: none;">지하철역 검색</a>
              <a href="/tips/transit" style="color: #334155; text-decoration: none;">대중교통 이용 팁</a>
              <a href="/tips/courses" style="color: #334155; text-decoration: none;">여행코스 추천</a>
              <a href="/my-route" style="color: #334155; text-decoration: none;">내 여행 루트</a>
              <a href="/schedule" style="color: #334155; text-decoration: none;">축제·행사 일정</a>
              <a href="/tips/exploration" style="color: #334155; text-decoration: none;">부산 탐구생활</a>
              <a href="/barrier-free" style="color: #334155; text-decoration: none;">무장애 관광지</a>
              <a href="/about" style="color: #334155; text-decoration: none;">서비스 소개</a>
            </nav>
          </div>
          ${
            breadcrumbLabel && routePath && routePath !== '/'
              ? `<nav aria-label="Breadcrumb" style="margin-top: 12px; font-size: 13px; color: #64748B;">
                  <a href="/" style="color: #5B7332; text-decoration: none;">홈 (Home)</a> &rsaquo; <span>${escapeHtml(breadcrumbLabel)}</span>
                </nav>`
              : ''
          }
          <h1 style="font-size: 28px; font-weight: 900; margin: 16px 0 8px 0; color: #11161B;">${escapeHtml(h1)}</h1>
          <p style="margin: 0; font-size: 15px; color: #475569;">${escapeHtml(lead)}</p>
        </header>`;
}

function buildCommonFooter(): string {
  return `
        <footer style="border-top: 1px solid #E5E2DC; padding-top: 16px; margin-top: 32px; font-size: 13px; color: #475569;">
          <p style="margin: 0 0 8px 0;">운영: <strong>스텝레스 (Stepless)</strong> · 총괄 에디터: <strong>플로레르 (Floreur)</strong> · 문의: <a href="mailto:floreur88@gmail.com">floreur88@gmail.com</a></p>
          <p style="margin: 0 0 8px 0;">데이터 검증 기준: 부산교통공사 도시철도 편의시설 공공데이터, 한국관광공사 무장애 열린관광지(TourAPI KorWithService2), 현장 실사 검증</p>
          <p style="margin: 0; display: flex; flex-wrap: wrap; gap: 12px;">
            <a href="/about">서비스 및 운영자 소개</a>
            <a href="/about/privacy">개인정보처리방침 (Privacy Policy)</a>
            <a href="/about/terms">서비스 이용약관 (Terms of Service)</a>
            <a href="/about/contact">정보 오류 제보 및 제휴 문의</a>
            <a href="/about/data-source">공공데이터 출처 및 검증 안내</a>
            <a href="/sitemap.xml">사이트맵(XML)</a>
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
    title: '부산 무장애(배리어프리) 추천 여행 코스 | Accessible Busan Tour Itinerary | 스텝리스 Stepless'
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
            <p style="font-size: 14px; color: #334155;">부산 도시철도 1~4호선에서는 상대식 승강장(상행·하행 개찰구가 분리된 역사)에서 방향을 잘못 들어갔거나 화장실 이용 등을 위해 개찰구를 나갔다가 다시 들어올 때, <strong>최초 입장 태그 후 10분 이내에 동일 역에서 퇴장 태그 후 재입장 태그</strong>를 하면 추가 요금(기본운임)이 차감되지 않고 무료 환승(재진입)이1회 허용됩니다. 단, 선불·후불 교통카드 1매당 1인 탑승 시에만 적용되며, 10분이 초과되거나 다른 역으로 이동한 경우에는 일반 운임이 부과됩니다.</p>
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
            <p style="font-size: 14px; color: #334155; margin-bottom: 0;">현재 <a href="/station/bujeon">부전역</a>(1호선·동해선)에서 <a href="/station/sasang">사상역</a>(2호선·부산김해경전철)으로 이동하려면 서면역을 거쳐 도시철도 2호선으로 환승해야 하지만, 부전~마산 복선전철이 개통되면 부전~사상 구간이 직결되어 김해국제공항에서 기장 오시리아·해운대 송정까지 이어지는 동서 횡단 무장애 철도 축이 완성됩니다. 전 역사에 스크린도어와 대형 엘리베이터, 휠체어 전용 탑승 구역이 최신 기준으로 도입됩니다.</p>
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
            <p style="font-size: 14px; color: #334155; margin-bottom: 0;"><a href="/station/busan">부산역</a>(도시철도 1호선 4·6번 출구 엘리베이터)과 KTX 부산역 2층 대합실은 대형 승강기와 보행데크로 연결되어 있으며, 바다 방향으로 뻗은 북항 공중보행교를 따라 이동하면 횡단보도나 계단 하나 없이 북항 친수공원 해안 산책로로 진입할 수 있습니다. 넓은 수변 데크와 완만한 잔디 광장, 장애인 화장실이 잘 갖춰져 있어 기차 탑승 전후 유모차·휠체어 산책 코스로 강력히 추천합니다.</p>
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
            <ul style="font-size: 14px; color: #334155; padding-left: 20px; margin-bottom: 0;">
              <li><strong>이메일 문의 및 제보:</strong> <a href="mailto:floreur88@gmail.com">floreur88@gmail.com</a></li>
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

  return pages;
}

function generateRouteHtml(templateHtml: string, page: StaticRoutePage): string {
  const canonicalUrl = `https://stepless.kr${page.routePath === '/' ? '/' : page.routePath}`;
  let html = templateHtml;

  // 1. Replace <title>
  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(page.title)}</title>`
  );

  // 2. Replace <meta name="description" ...>
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(page.description)}" />`
  );

  // 3. Replace <link rel="canonical" ...>
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
  );

  // 4. Replace OpenGraph & Twitter URL/Title/Description
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
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`
  );

  // 5. Replace <div id="root">...</div> inner content AND <details id="seo-prerender-archive"> with route-specific visible semantic HTML
  const rootReplacement = `<div id="root">
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px 16px; background-color: #FBFBF9; color: #11161B;">
        <div style="font-size: 12px; font-weight: 800; letter-spacing: 0.08em; color: #5B7332; background: #F3F7EC; padding: 6px 14px; border-radius: 999px; margin-bottom: 16px;">STEPLESS IN BUSAN</div>
        <div style="font-size: 24px; font-weight: 900; line-height: 1.35; margin: 0 0 10px 0; color: #11161B; max-width: 680px;">${escapeHtml(page.h1)}</div>
        <p style="font-size: 14px; color: #64748B; margin: 0; max-width: 560px;">${escapeHtml(page.lead)}</p>
      </div>
      <div class="prerender-seo-shell" style="max-width: 1120px; margin: 0 auto; padding: 24px 16px; line-height: 1.65;">
        ${buildCommonHeader(page.h1, page.lead, page.h1, page.routePath)}
        <main>
          ${page.bodyHtml}
        </main>
        ${buildCommonFooter()}
      </div>
    </div>

    <details id="seo-prerender-archive" style="max-width: 1120px; margin: 0 auto; padding: 8px 16px 24px; font-size: 12px; color: #64748B; line-height: 1.65;">
      <summary style="cursor: pointer; font-weight: 600; color: #94A3B8; list-style: none; text-align: center;">${escapeHtml(page.h1)} — 텍스트 가이드 아카이브 (Text Reference Guide)</summary>
      <div style="margin-top: 12px;">
        ${page.bodyHtml}
      </div>
    </details>`;

  html = html.replace(
    /<div id="root">[\s\S]*?<\/details>/i,
    rootReplacement
  );

  return html;
}

function main() {
  const distDir = path.join(process.cwd(), 'dist');
  const templatePath = path.join(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error('[SSG] dist/index.html not found. Run vite build first.');
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(templatePath, 'utf-8');
  const pages = buildAllStaticPages();

  let generatedCount = 0;
  for (const page of pages) {
    const relPath = page.routePath.replace(/^\/+/, '').replace(/\/+$/, '');
    if (!relPath) continue;

    const outHtml = generateRouteHtml(templateHtml, page);

    // 1. Write dist/<relPath>/index.html
    const outDir = path.join(distDir, relPath);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), outHtml, 'utf-8');

    // 2. Also write dist/<relPath>.html (so Cloudflare Pages / GitHub Pages clean-URL resolution always gets the rich non-duplicated HTML)
    const flatFilePath = path.join(distDir, `${relPath}.html`);
    fs.mkdirSync(path.dirname(flatFilePath), { recursive: true });
    fs.writeFileSync(flatFilePath, outHtml, 'utf-8');

    if (page.routePath === '/about') {
      fs.writeFileSync(path.join(distDir, 'about.html'), outHtml, 'utf-8');
    } else if (page.routePath === '/about/privacy') {
      fs.writeFileSync(path.join(distDir, 'privacy.html'), outHtml, 'utf-8');
    } else if (page.routePath === '/about/terms') {
      fs.writeFileSync(path.join(distDir, 'terms.html'), outHtml, 'utf-8');
    }

    generatedCount++;
  }

  console.log(`[SSG] Successfully generated ${generatedCount} static route HTML files in dist/`);
}

main();
