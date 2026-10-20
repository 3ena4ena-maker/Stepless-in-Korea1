import https from 'https';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export interface BusanEvent {
  id: string;
  titleKo: string;
  titleEn: string;
  category: 'festival' | 'culture' | 'performance' | 'drone';
  categoryKo: string;
  categoryEn: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  stationId: string;
  exitNumber: string;
  stationKo: string;
  stationEn: string;
  metroLine: string;
  accessibilityKo: string;
  accessibilityEn: string;
  exitTipKo?: string;
  exitTipEn?: string;
  descriptionKo: string;
  descriptionEn: string;
  locationKo: string;
  locationEn: string;
  colorClass: string;
  dotClass: string;
  isAutoSynced?: boolean;
}

const EVENTS_DB_FILE = path.join(process.cwd(), 'busan-events-db.json');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Subway station mapping dictionary for Busan venues and districts
const VENUE_STATION_MAP = [
  { 
    match: /벡스코|영화의전당|센텀|bexco|시립미술관/i, 
    stationId: 'bexco', 
    stationKo: '벡스코역 (2호선/동해선)', 
    stationEn: 'BEXCO Station (Line 2 / Donghae)',
    metroLine: 'Line 2 / Donghae',
    exitNumber: '7번 출구', 
    exitTipKo: '벡스코역 7번 출구 엘리베이터를 통해 지상 전시장 및 영화의전당으로 무단차 진입이 가능합니다.',
    exitTipEn: 'BEXCO Exit 7 elevator connects directly to exhibition halls without stairs.'
  },
  { 
    match: /광안리|수변공원|민락|남천/i, 
    stationId: 'gwangan', 
    stationKo: '광안역 (2호선)', 
    stationEn: 'Gwangan Station (Line 2)',
    metroLine: 'Line 2',
    exitNumber: '5번 출구', 
    exitTipKo: '광안역 5번 출구 엘리베이터 이용 후 해변 보행로로 수평 무단차 이동이 가능합니다.',
    exitTipEn: 'Gwangan Exit 5 elevator provides direct level access to Gwangalli Beach promenade.'
  },
  { 
    match: /해운대|구남로|동백|송정|기장/i, 
    stationId: 'haeundae', 
    stationKo: '해운대역 (2호선)', 
    stationEn: 'Haeundae Station (Line 2)',
    metroLine: 'Line 2',
    exitNumber: '3번 출구', 
    exitTipKo: '해운대역 3번 출구 엘리베이터로 구남로 문화광장 및 백사장까지 평탄 보도로 연결됩니다.',
    exitTipEn: 'Haeundae Exit 3 elevator offers direct flat walkway to the beach.'
  },
  { 
    match: /삼락|사상|르네시떼|낙동강|맥도|대저/i, 
    stationId: 'sasang', 
    stationKo: '사상역 (2호선) / 괘법르네시떼역', 
    stationEn: 'Sasang / Gwaebeop Renecite Station',
    metroLine: 'Line 2 & BGL',
    exitNumber: '3번 출구', 
    exitTipKo: '사상역 3번 출구 또는 괘법르네시떼역 1번 출구 육교 승강기로 삼락생태공원에 진입합니다.',
    exitTipEn: 'Sasang Exit 3 or Gwaebeop Renecite Exit 1 elevator bridge provides step-free access.'
  },
  { 
    match: /콘서트홀|시민공원|송상현|부전/i, 
    stationId: 'bujeon', 
    stationKo: '부전역 (1호선/동해선)', 
    stationEn: 'Bujeon Station (Line 1 / Donghae)',
    metroLine: 'Line 1',
    exitNumber: '1번 출구', 
    exitTipKo: '부전역 1번 출구 엘리베이터를 이용해 부산시민공원 및 부산콘서트홀 방면으로 평탄 이동합니다.',
    exitTipEn: 'Bujeon Exit 1 elevator leads to Busan Citizens Park flat walkway.'
  },
  { 
    match: /자갈치|남포|영도|용두산|광복/i, 
    stationId: 'jagalchi', 
    stationKo: '자갈치역 / 남포역 (1호선)', 
    stationEn: 'Jagalchi / Nampo Station (Line 1)',
    metroLine: 'Line 1',
    exitNumber: '10번 출구', 
    exitTipKo: '자갈치역 10번 출구 또는 남포역 1번 출구 엘리베이터를 이용해 수평 무단차 진입이 가능합니다.',
    exitTipEn: 'Jagalchi Exit 10 offers flat step-free access to the coastal plaza.'
  },
  { 
    match: /부산역|북항|초량|동구/i, 
    stationId: 'busan', 
    stationKo: '부산역 (1호선)', 
    stationEn: 'Busan Station (Line 1)',
    metroLine: 'Line 1',
    exitNumber: '4번 출구', 
    exitTipKo: '부산역 4번·6번 출구 승강기를 통해 북항 친수공원 및 문화광장으로 평지 이동이 가능합니다.',
    exitTipEn: 'Busan Station Exit 4 elevator connects to North Port Promenade.'
  },
  { 
    match: /다대포|몰운대|하단|을숙도|사하/i, 
    stationId: 'dadaepo', 
    stationKo: '다대포해수욕장역 (1호선)', 
    stationEn: 'Dadaepo Beach Station (Line 1)',
    metroLine: 'Line 1',
    exitNumber: '4번 출구', 
    exitTipKo: '다대포해수욕장역 4번 출구 또는 2·3번 출구 엘리베이터를 통해 바닷가 백사장 및 해변공원으로 수평 무단차 진입이 가능합니다.',
    exitTipEn: 'Dadaepo Beach Exit 4 elevator connects directly to the beach park and boardwalk.'
  },
  { 
    match: /수영|F1963|망미/i, 
    stationId: 'suyeong', 
    stationKo: '수영역 (2·3호선)', 
    stationEn: 'Suyeong Station (Line 2 & 3)',
    metroLine: 'Line 2 & 3',
    exitNumber: '2번 출구', 
    exitTipKo: '수영역 2번 출구 엘리베이터를 통해 수영강변 및 F1963 연계 버스로 무단차 환승이 가능합니다.',
    exitTipEn: 'Suyeong Exit 2 elevator provides seamless transit to riverside.'
  },
  { 
    match: /서면|전포|부산진구/i, 
    stationId: 'seomyeon', 
    stationKo: '서면역 (1·2호선)', 
    stationEn: 'Seomyeon Station (Line 1 & 2)',
    metroLine: 'Line 1 & 2',
    exitNumber: '7번 출구', 
    exitTipKo: '서면역 7번 출구 엘리베이터를 통해 젊음의거리 및 주요 문화공간으로 직결됩니다.',
    exitTipEn: 'Seomyeon Exit 7 elevator connects to central shopping and culture avenues.'
  },
  { 
    match: /동래|금정|온천천|범어사/i, 
    stationId: 'bujeon', 
    stationKo: '동래역 (1·4호선)', 
    stationEn: 'Dongnae Station (Line 1 & 4)',
    metroLine: 'Line 1',
    exitNumber: '1번 출구', 
    exitTipKo: '동래역 1번 출구 엘리베이터로 지상 문화시설까지 안전하게 이동할 수 있습니다.',
    exitTipEn: 'Dongnae Exit 1 elevator offers barrier-free access.'
  }
];

function findStationForVenue(venue = '', sigungu = '') {
  const text = `${venue} ${sigungu}`;
  for (const item of VENUE_STATION_MAP) {
    if (item.match.test(text)) {
      return item;
    }
  }
  return {
    stationId: 'seomyeon',
    stationKo: '서면역 (1·2호선)',
    stationEn: 'Seomyeon Station (Line 1 & 2)',
    metroLine: 'Line 1 & 2',
    exitNumber: '7번 출구',
    exitTipKo: '서면역 7번 출구 엘리베이터를 통해 지상으로 계단 없이 이동할 수 있습니다.',
    exitTipEn: 'Seomyeon Station Exit 7 provides step-free elevator access.'
  };
}

// Read raw events from Busan Cultural Portal Dabom (부산문화포털 다봄)
async function fetchDabomEvents(type: string): Promise<any[]> {
  const postData = JSON.stringify({
    type: type,
    prg_cds: ['110', '120', '130', '140', '150', '160', '170', '180', '190', '250', '260', '270', '271', '277']
  });

  return new Promise((resolve) => {
    const req = https.request('https://www.busandabom.net/bbs/chod/work_dt/uReslistJson.nm', {
      method: 'POST',
      agent: httpsAgent,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SteplessBusan/1.0'
      },
      timeout: 8000
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(Array.isArray(json.list) ? json.list : []);
        } catch {
          resolve([]);
        }
      });
    });

    req.on('error', (err) => {
      console.warn(`[BusanEventsSync] Dabom ${type} fetch error:`, err.message);
      resolve([]);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve([]);
    });

    req.write(postData);
    req.end();
  });
}

// Parse date range from Korean government festival string: e.g. "2026. 05. 22. ~ 05. 31." or "2026.10.16. ~ 2026.10.18."
function parseDateRange(raw: string): { startDate: string; endDate: string } | null {
  if (!raw) return null;
  const fullRange = raw.match(/(\d{4})[.\-년\s]+(\d{1,2})[.\-월\s]+(\d{1,2})[일\s.~까지\-]+(?:(\d{4})[.\-년\s]+)?(\d{1,2})[.\-월\s]+(\d{1,2})/);
  if (fullRange) {
    const y1 = fullRange[1];
    const m1 = fullRange[2].padStart(2, '0');
    const d1 = fullRange[3].padStart(2, '0');
    const y2 = fullRange[4] || y1;
    const m2 = fullRange[5].padStart(2, '0');
    const d2 = fullRange[6].padStart(2, '0');
    return { startDate: `${y1}-${m1}-${d1}`, endDate: `${y2}-${m2}-${d2}` };
  }
  const single = raw.match(/(\d{4})[.\-년\s]+(\d{1,2})[.\-월\s]+(\d{1,2})/);
  if (single) {
    const y = single[1];
    const m = single[2].padStart(2, '0');
    const d = single[3].padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    return { startDate: dateStr, endDate: dateStr };
  }
  return null;
}

// Fetch official festivals from data.go.kr (부산광역시_부산축제정보 서비스)
async function fetchBusanGovFestivals(): Promise<any[]> {
  const serviceKey = process.env.BUSAN_FESTIVAL_API_KEY || process.env.BUSAN_FESTIVAL_SERVICE_KEY || '';
  if (!serviceKey) {
    return [];
  }

  return new Promise((resolve) => {
    const url = `https://apis.data.go.kr/6260000/FestivalService/getFestivalKr?serviceKey=${serviceKey}&pageNo=1&numOfRows=100&resultType=json`;
    https.get(url, { timeout: 8000 }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          const items = parsed.getFestivalKr?.item || [];
          resolve(Array.isArray(items) ? items : []);
        } catch {
          resolve([]);
        }
      });
    }).on('error', (err) => {
      console.warn('[BusanEventsSync] FestivalService fetch error:', err.message);
      resolve([]);
    }).on('timeout', () => {
      resolve([]);
    });
  });
}

export function loadCachedBusanEvents(): BusanEvent[] {
  try {
    if (fs.existsSync(EVENTS_DB_FILE)) {
      const raw = fs.readFileSync(EVENTS_DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err: any) {
    console.warn('[BusanEventsSync] Failed to read cached events:', err.message);
  }
  return [];
}

export function saveCachedBusanEvents(events: BusanEvent[]): void {
  try {
    fs.writeFileSync(EVENTS_DB_FILE, JSON.stringify(events, null, 2), 'utf-8');
    console.log(`[BusanEventsSync] Successfully cached ${events.length} Busan events to busan-events-db.json`);
  } catch (err: any) {
    console.error('[BusanEventsSync] Error saving cached events:', err.message);
  }
}

/**
 * Core Automated Sync Function
 * Automatically pulls the latest events from Busan City cultural networks,
 * geo-maps each event to the nearest Busan subway station & elevator exit,
 * and saves the parsed events to local JSON database.
 */
export async function syncBusanEvents(): Promise<{
  success: boolean;
  totalSynced: number;
  events: BusanEvent[];
  lastSyncedAt: string;
}> {
  console.log('[BusanEventsSync] Starting automated event synchronization with Busan City Portal...');
  const now = new Date();

  try {
    // 1. Fetch performances/exhibitions from Dabom and official festivals from data.go.kr
    const [performList, displayList, govFestivalList] = await Promise.all([
      fetchDabomEvents('perform'),
      fetchDabomEvents('display'),
      fetchBusanGovFestivals()
    ]);

    const seenTitles = new Set<string>();
    const syncedEvents: BusanEvent[] = [];

    // 2. Process official Busan City government festivals (공공데이터포털 부산축제정보)
    for (const item of govFestivalList) {
      if (!item.MAIN_TITLE) continue;
      const cleanTitle = String(item.MAIN_TITLE).replace(/\(.*?\)/g, '').trim();
      const dates = parseDateRange(item.USAGE_DAY_WEEK_AND_TIME);
      if (!dates) continue;

      const dedupeKey = `${cleanTitle}_${dates.startDate}`;
      if (seenTitles.has(dedupeKey)) continue;
      seenTitles.add(dedupeKey);

      const venueText = `${item.MAIN_PLACE || ''} ${item.PLACE || ''} ${item.TRFC_INFO || ''} ${item.GUGUN_NM || ''}`;
      const stationInfo = findStationForVenue(venueText, item.GUGUN_NM);

      const barrierFreeExtra = item.MIDDLE_SIZE_RM1 ? ` [편의시설: ${item.MIDDLE_SIZE_RM1}]` : '';

      syncedEvents.push({
        id: `gov-fest-${item.UC_SEQ || Math.random().toString(36).substring(2, 9)}`,
        titleKo: cleanTitle,
        titleEn: cleanTitle,
        category: 'festival',
        categoryKo: '부산 대표 축제',
        categoryEn: 'Busan Festival',
        startDate: dates.startDate,
        endDate: dates.endDate,
        stationId: stationInfo.stationId,
        exitNumber: stationInfo.exitNumber,
        stationKo: stationInfo.stationKo,
        stationEn: stationInfo.stationEn,
        metroLine: stationInfo.metroLine,
        accessibilityKo: `${item.MAIN_PLACE || item.PLACE || '축제 행사장'}은(는) 보행 약자와 유모차·휠체어 이용객을 위한 접근로를 제공합니다.${barrierFreeExtra}`,
        accessibilityEn: `Accessible route for strollers and wheelchairs.${item.MIDDLE_SIZE_RM1 ? ` [Accessibility: ${item.MIDDLE_SIZE_RM1}]` : ''}`,
        exitTipKo: stationInfo.exitTipKo,
        exitTipEn: stationInfo.exitTipEn,
        descriptionKo: item.ITEMCNTNTS ? item.ITEMCNTNTS.trim() : `[공공데이터포털 부산광역시 공식 축제] ${cleanTitle}. 장소: ${item.MAIN_PLACE || item.PLACE || '부산 일원'}.`,
        descriptionEn: `Official Busan Festival: ${cleanTitle}.`,
        locationKo: item.MAIN_PLACE || item.PLACE || `${item.GUGUN_NM || '부산'} 일원`,
        locationEn: item.MAIN_PLACE || item.PLACE || 'Busan Venue',
        colorClass: 'bg-sky-50 text-sky-850 border-sky-100',
        dotClass: 'bg-sky-500',
        isAutoSynced: true
      });
    }

    // 3. Process Dabom cultural performances and exhibitions
    const rawList = [...performList, ...displayList];

    for (const item of rawList) {
      if (!item.title || !item.op_st_dt) continue;

      const cleanTitle = String(item.title).trim();
      const dedupeKey = `${cleanTitle}_${item.op_st_dt}`;
      if (seenTitles.has(dedupeKey)) continue;
      seenTitles.add(dedupeKey);

      const stationInfo = findStationForVenue(item.place_nm, item.sigungu);
      const isExhibition = (item.prg_nm || '').includes('전시') || (item.major_nm || '').includes('전시');
      const isFestival = (item.title || '').includes('축제') || (item.title || '').includes('페스티벌');

      const category: 'festival' | 'culture' | 'performance' | 'drone' = 
        isFestival ? 'festival' :
        isExhibition ? 'culture' : 'performance';

      const colorClass = 
        category === 'festival' ? 'bg-sky-50 text-sky-850 border-sky-100' :
        category === 'culture' ? 'bg-amber-50 text-amber-850 border-amber-100' :
        'bg-purple-50 text-purple-850 border-purple-100';

      const dotClass = 
        category === 'festival' ? 'bg-sky-500' :
        category === 'culture' ? 'bg-amber-500' :
        'bg-purple-500';

      syncedEvents.push({
        id: `auto-busan-${item.res_no || Math.random().toString(36).substring(2, 9)}`,
        titleKo: cleanTitle,
        titleEn: cleanTitle,
        category,
        categoryKo: item.prg_nm || (isFestival ? '지역 축제' : isExhibition ? '전시 / 예술' : '공연 / 콘서트'),
        categoryEn: isFestival ? 'Festival' : isExhibition ? 'Exhibition' : 'Performance',
        startDate: item.op_st_dt,
        endDate: item.op_ed_dt || item.op_st_dt,
        stationId: stationInfo.stationId,
        exitNumber: stationInfo.exitNumber,
        stationKo: stationInfo.stationKo,
        stationEn: stationInfo.stationEn,
        metroLine: stationInfo.metroLine,
        accessibilityKo: `${item.place_nm || '행사장'}은(는) 보행 약자를 위한 무단차 진입로와 승강기 편의시설이 마련되어 있어 휠체어와 유모차로 편리하게 관람하실 수 있습니다.`,
        accessibilityEn: 'Features step-free ramp entrance and elevator accessibility for wheelchair and stroller visitors.',
        exitTipKo: stationInfo.exitTipKo,
        exitTipEn: stationInfo.exitTipEn,
        descriptionKo: `[부산광역시 공식 등록 일정] ${cleanTitle}. ${item.prg_nm ? `분야: ${item.prg_nm}. ` : ''}장소: ${item.place_nmdetail || item.place_nm || '부산 일원'} (${item.sigungu || '부산시'}).`,
        descriptionEn: `Official Busan City Event: ${cleanTitle} at ${item.place_nm || 'Busan'}.`,
        locationKo: item.place_nmdetail || item.place_nm || '부산 시내 일원',
        locationEn: item.place_nm || 'Busan Venue',
        colorClass,
        dotClass,
        isAutoSynced: true
      });
    }

    if (syncedEvents.length > 0) {
      saveCachedBusanEvents(syncedEvents);
    }

    const lastSyncedAt = now.toISOString();
    console.log(`[BusanEventsSync] Auto-sync finished successfully. Total ${syncedEvents.length} active events registered.`);
    return {
      success: true,
      totalSynced: syncedEvents.length,
      events: syncedEvents.length > 0 ? syncedEvents : loadCachedBusanEvents(),
      lastSyncedAt
    };
  } catch (error: any) {
    console.error('[BusanEventsSync] Error in automated synchronization:', error.message);
    const cached = loadCachedBusanEvents();
    return {
      success: false,
      totalSynced: cached.length,
      events: cached,
      lastSyncedAt: now.toISOString()
    };
  }
}

/**
 * Start Background Scheduler
 * Runs immediately on server startup, and repeats automatically every intervalHours (default 12 hours)
 */
export function startAutomatedEventSync(intervalHours = 12): void {
  console.log(`[BusanEventsSync] Initializing background auto-sync scheduler (repeats every ${intervalHours} hours)...`);
  
  // Run first sync shortly after startup
  setTimeout(() => {
    syncBusanEvents().catch(err => {
      console.warn('[BusanEventsSync] Initial background sync error:', err.message);
    });
  }, 2500);

  // Set recurring interval
  const intervalMs = intervalHours * 60 * 60 * 1000;
  setInterval(() => {
    console.log('[BusanEventsSync] Running scheduled background event sync...');
    syncBusanEvents().catch(err => {
      console.warn('[BusanEventsSync] Scheduled background sync error:', err.message);
    });
  }, intervalMs);
}
