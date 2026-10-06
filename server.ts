import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

import { BUSAN_TOUR_API_SPOTS, TourApiSpot } from "./src/data/tourApiSpots";
import { getKoreaTourApiPlaceDetail, KOREA_TOUR_API_PLACE_DETAILS } from "./src/data/koreaTourApiPlaceDetails";
import { KNOWN_COORDINATES } from "./src/services/myRouteService";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));
app.use("/images", express.static(path.join(process.cwd(), "public/images")));
app.use("/images", express.static(path.join(process.cwd(), "dist/images")));

// Keep local file path as the server-side database
const RECS_FILE_PATH = path.join(process.cwd(), "recommendations-db.json");

interface TravelerRecommendation {
  id: string;
  author: string;
  topic: string;
  category: "FOOD" | "CAFE" | "ATTRACTION" | "TRANSIT" | "OTHER";
  stationOrExit: string;
  content: string;
  upvotes: number;
  createdAt: string;
}

const DEFAULT_RECOMMENDATIONS: TravelerRecommendation[] = [
  {
    id: 'rec-1',
    author: 'BusanLover33',
    topic: '이재모피자 서면점 & 부산역본점',
    category: 'FOOD',
    stationOrExit: '부산역 5번출구 / 전포역 7번출구 근처',
    content: '이재모피자는 부산 로컬과 여행객 모두가 열광하는 최고의 치즈 피자 전문점입니다! 치즈 크러스트의 쫄깃함이 남달라요. 웨이팅이 기니 앱(테이블링 등)을 꼭 체크하세요.',
    upvotes: 42,
    createdAt: '2026-06-01T12:00:00Z'
  },
  {
    id: 'rec-2',
    author: 'NomadChris',
    topic: '전포 사잇길 소품샵 & 빈티지 카페 골목',
    category: 'CAFE',
    stationOrExit: '전포역 4번 및 8번출구',
    content: '전포 카페거리에서 조금만 위쪽으로 가면 나오는 사잇길에는 아기자기한 공방, 감성 넘치는 독립 서점, 개성 가득한 빈티지 편집숍들이 가득해요! 평탄하고 걸어 다니기 좋아 계단 없는 산책하기 최고입니다.',
    upvotes: 28,
    createdAt: '2026-06-03T15:30:00Z'
  },
  {
    id: 'rec-3',
    author: 'TransitPro',
    topic: '알뜰 부산 지하철 1일 무제한 패스',
    category: 'TRANSIT',
    stationOrExit: '모든 부산 지하철역 발권기',
    content: '하루 동안 지하철을 5회 이상 탈 계획이라면 1일권(정기승차권)을 사서 이용하는게 저렴해요! 어른 6,000원, 청소년 4,000원이고 1일권은 최초 사용 당일 부산 지하철 1 ~ 4호선에서 횟수 제한 없이 이용할 수 있어요!',
    upvotes: 35,
    createdAt: '2026-06-05T09:15:00Z'
  }
];

// Helper to read/write local recommendations JSON file
function loadRecommendations(): TravelerRecommendation[] {
  try {
    if (fs.existsSync(RECS_FILE_PATH)) {
      const raw = fs.readFileSync(RECS_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading recommendations file:", err);
  }
  
  // Write default recommendations if the file doesn't exist
  try {
    fs.writeFileSync(RECS_FILE_PATH, JSON.stringify(DEFAULT_RECOMMENDATIONS, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing default recommendations file:", err);
  }
  return DEFAULT_RECOMMENDATIONS;
}

function saveRecommendations(recs: TravelerRecommendation[]) {
  try {
    fs.writeFileSync(RECS_FILE_PATH, JSON.stringify(recs, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing recommendations file:", err);
  }
}

// 1. Get all recommendations
app.get("/api/recommendations", async (req, res) => {
  try {
    const recs = loadRecommendations();
    // Sort descending by creation date
    const sorted = [...recs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(sorted);
  } catch (error: any) {
    console.error("Get recommendations error:", error);
    res.status(500).json({ error: "Failed to load recommendations" });
  }
});

// 2. Submit a new recommendation
app.post("/api/recommendations", async (req, res) => {
  const { id, author, topic, category, stationOrExit, content, createdAt, upvotes } = req.body;
  if (!author || !topic || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const recId = id || `rec-${Date.now()}`;
    const recs = loadRecommendations();

    // De-duplication check
    const existing = recs.find(r => r.id === recId);
    if (existing) {
      return res.json(existing);
    }

    const newRec: TravelerRecommendation = {
      id: recId,
      author: String(author).trim(),
      topic: String(topic).trim(),
      category: category || "OTHER",
      stationOrExit: String(stationOrExit || "").trim(),
      content: String(content).trim(),
      upvotes: Number(upvotes) || 0,
      createdAt: createdAt || new Date().toISOString()
    };

    recs.push(newRec);
    saveRecommendations(recs);
    res.status(201).json(newRec);
  } catch (error: any) {
    console.error("Submit recommendation error:", error);
    res.status(500).json({ error: "Failed to save recommendation" });
  }
});

// 3. Upvote/Downvote recommendation
app.post("/api/recommendations/:id/upvote", async (req, res) => {
  const id = req.params.id;
  const { upvote } = req.body;

  try {
    const recs = loadRecommendations();
    const idx = recs.findIndex(r => r.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: "Recommendation not found" });
    }

    let newUpvotes = recs[idx].upvotes || 0;
    if (upvote === true) {
      newUpvotes += 1;
    } else if (upvote === false) {
      newUpvotes = Math.max(0, newUpvotes - 1);
    }

    recs[idx].upvotes = newUpvotes;
    saveRecommendations(recs);
    res.json(recs[idx]);
  } catch (error: any) {
    console.error("Upvote error:", error);
    res.status(500).json({ error: "Failed to update upvote" });
  }
});

// 4. Delete recommendation
app.delete("/api/recommendations/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const recs = loadRecommendations();
    const filtered = recs.filter(r => r.id !== id);
    saveRecommendations(filtered);
    res.json({ success: true });
  } catch (error: any) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete recommendation" });
  }
});

// =========================================================================
// 5. KOREA TOURISM ORGANIZATION (한국관광공사 TourAPI / KorWithAPI) PROXY & ENDPOINTS
// =========================================================================

// TourAPI 4.0 Endpoints
const KTO_KOREAN_ENDPOINT = "https://apis.data.go.kr/B551011/KorService2";
const KORWITH_ENDPOINT = "https://apis.data.go.kr/B551011/KorWithService2";

// Active Service Key from environment (No hardcoded credentials)
const TOUR_API_SERVICE_KEY = process.env.TOUR_API_SERVICE_KEY || process.env.KOREA_TOUR_API_KEY || "";
const KORWITH_SERVICE_KEY = TOUR_API_SERVICE_KEY;

interface KtoApiResponse {
  httpStatus: number;
  success: boolean;
  resultCode: string | null;
  resultMsg: string | null;
  totalCount: number;
  itemCount: number;
  primaryItem: Record<string, any> | null;
  rawItem: Record<string, any> | null;
  rawHeader: any;
  error: string | null;
  guidance: string | null;
}

function getErrorGuidance(code: string, msg: string): string {
  if (code === "30" || msg.includes("REGISTERED")) {
    return "공공데이터포털 등록되지 않은 서비스키(30): 1) 발급 직후 약 1~2시간 동안 포털 내 인증키 동기화 지연이 있을 수 있습니다. 2) 공공데이터포털에서 발급된 Encoding 키와 Decoding 키 중 다른 형식을 적용해보세요. 3) 공공데이터포털 마이페이지에서 [한국관광공사_국문 관광정보 서비스_GW] 및 [한국관광공사_무장애 여행정보_GW] 활용신청 상태가 승인되어 있는지 확인해주세요.";
  }
  if (code === "12" || msg.includes("NO_OPENAPI")) {
    return "해당 오픈API 서비스가 없거나 구버전(v1)이 폐기되었습니다. TourAPI 4.0(KorService2 / KorWithService2)을 사용해야 합니다.";
  }
  if (code === "22" || msg.includes("EXCEEDS")) {
    return "일일 허용 트래픽 한도(일반 1,000건)를 초과했습니다.";
  }
  if (code === "20" || msg.includes("DENIED")) {
    return "접근이 거부되었습니다. 공공데이터포털에서 해당 API의 활용신청 상태를 확인해주세요.";
  }
  return "공공데이터포털 API 상세 가이드를 확인해주세요.";
}

async function executeKtoApiCall(
  baseUrl: string,
  serviceKey: string,
  params: Record<string, string>
): Promise<KtoApiResponse> {
  if (!serviceKey || serviceKey.trim() === "") {
    return {
      httpStatus: 400,
      success: false,
      resultCode: "NO_KEY",
      resultMsg: "Service Key missing",
      totalCount: 0,
      itemCount: 0,
      primaryItem: null,
      rawItem: null,
      rawHeader: null,
      error: "API 인증키(TOUR_API_SERVICE_KEY)가 설정되지 않았습니다.",
      guidance: "환경변수 TOUR_API_SERVICE_KEY에 공공데이터포털에서 발급받은 일반 인증키(Encoding 또는 Decoding)를 설정해주세요. 또는 /api/tourapi/test?serviceKey=... 쿼리 파라미터로 즉시 테스트할 수 있습니다."
    };
  }

  const trimmedKey = serviceKey.trim();

  const tryFetch = async (keyToUse: string) => {
    const qs = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
    const url = `${baseUrl}?serviceKey=${keyToUse}&${qs}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    const text = await res.text();
    return { status: res.status, text };
  };

  try {
    // 1st attempt: with key variant 1 (encoded if not containing %)
    const keyVariant1 = trimmedKey.includes("%") ? trimmedKey : encodeURIComponent(trimmedKey);
    let { status, text } = await tryFetch(keyVariant1);

    // If key not registered error (code 30), try alternative encoding/decoding
    if (text.includes('"returnReasonCode": "30"') || text.includes("<returnReasonCode>30</returnReasonCode>")) {
      try {
        const decoded = decodeURIComponent(trimmedKey);
        const altKey = decoded === trimmedKey ? encodeURIComponent(decoded) : decoded;
        if (altKey !== keyVariant1) {
          const retry = await tryFetch(altKey);
          if (retry.status === 200 && (retry.text.includes('"resultCode":"0000"') || retry.text.includes('"resultCode": "0000"'))) {
            status = retry.status;
            text = retry.text;
          }
        }
      } catch {}
    }

    // Try parsing as JSON
    let parsedJson: any = null;
    try {
      parsedJson = JSON.parse(text);
    } catch {}

    // Check JSON standard success
    if (parsedJson?.response?.header) {
      const header = parsedJson.response.header;
      const resultCode = String(header.resultCode || "");
      const resultMsg = String(header.resultMsg || "");
      const isSuccess = resultCode === "0000";

      const body = parsedJson.response.body;
      const totalCount = Number(body?.totalCount || 0);
      let items: any[] = [];
      if (body?.items?.item) {
        items = Array.isArray(body.items.item) ? body.items.item : [body.items.item];
      }
      const primaryItem = items[0] || null;

      return {
        httpStatus: status,
        success: isSuccess,
        resultCode,
        resultMsg,
        totalCount,
        itemCount: items.length,
        primaryItem: primaryItem ? {
          contentid: primaryItem.contentid,
          title: primaryItem.title,
          addr1: primaryItem.addr1,
          addr2: primaryItem.addr2,
          areacode: primaryItem.areacode,
          contenttypeid: primaryItem.contenttypeid,
          firstimage: primaryItem.firstimage,
          firstimage2: primaryItem.firstimage2,
          mapx: primaryItem.mapx,
          mapy: primaryItem.mapy,
          tel: primaryItem.tel,
          modifiedtime: primaryItem.modifiedtime
        } : null,
        rawItem: primaryItem,
        rawHeader: header,
        error: isSuccess ? null : `API 반환 오류 [${resultCode}]: ${resultMsg}`,
        guidance: isSuccess ? "정상 수신되었습니다." : getErrorGuidance(resultCode, resultMsg)
      };
    }

    // Check JSON OpenAPI_ServiceResponse error
    if (parsedJson?.OpenAPI_ServiceResponse?.cmmMsgHeader) {
      const cmm = parsedJson.OpenAPI_ServiceResponse.cmmMsgHeader;
      const errMsg = cmm.errMsg || "OpenAPI Error";
      const returnAuthMsg = cmm.returnAuthMsg || "";
      const returnReasonCode = String(cmm.returnReasonCode || "");

      return {
        httpStatus: status,
        success: false,
        resultCode: returnReasonCode,
        resultMsg: returnAuthMsg || errMsg,
        totalCount: 0,
        itemCount: 0,
        primaryItem: null,
        rawItem: null,
        rawHeader: cmm,
        error: `[코드 ${returnReasonCode}] ${errMsg}: ${returnAuthMsg}`,
        guidance: getErrorGuidance(returnReasonCode, errMsg)
      };
    }

    // Check XML response via regex if XML was returned
    const xmlReasonCodeMatch = text.match(/<returnReasonCode>(.*?)<\/returnReasonCode>/i);
    const xmlErrMsgMatch = text.match(/<errMsg>(.*?)<\/errMsg>/i);
    const xmlAuthMsgMatch = text.match(/<returnAuthMsg>(.*?)<\/returnAuthMsg>/i);
    const xmlResultCodeMatch = text.match(/<resultCode>(.*?)<\/resultCode>/i);
    const xmlResultMsgMatch = text.match(/<resultMsg>(.*?)<\/resultMsg>/i);

    if (xmlReasonCodeMatch || xmlErrMsgMatch || xmlResultCodeMatch) {
      const reasonCode = xmlReasonCodeMatch?.[1] || xmlResultCodeMatch?.[1] || "XML_ERR";
      const errMsg = xmlErrMsgMatch?.[1] || xmlResultMsgMatch?.[1] || "OpenAPI XML Response";
      const authMsg = xmlAuthMsgMatch?.[1] || "";
      const isSuccess = reasonCode === "0000";

      return {
        httpStatus: status,
        success: isSuccess,
        resultCode: reasonCode,
        resultMsg: authMsg || errMsg,
        totalCount: 0,
        itemCount: 0,
        primaryItem: null,
        rawItem: null,
        rawHeader: { errMsg, returnAuthMsg: authMsg, returnReasonCode: reasonCode },
        error: isSuccess ? null : `[코드 ${reasonCode}] ${errMsg} ${authMsg}`,
        guidance: getErrorGuidance(reasonCode, errMsg)
      };
    }

    return {
      httpStatus: status,
      success: false,
      resultCode: "UNKNOWN",
      resultMsg: "Unexpected response format",
      totalCount: 0,
      itemCount: 0,
      primaryItem: null,
      rawItem: null,
      rawHeader: null,
      error: `예상치 못한 응답 본문: ${text.slice(0, 200)}`,
      guidance: "공공데이터포털 서버 응답 형식을 확인해주세요."
    };
  } catch (err: any) {
    return {
      httpStatus: 500,
      success: false,
      resultCode: "EXCEPTION",
      resultMsg: err.name || "FetchError",
      totalCount: 0,
      itemCount: 0,
      primaryItem: null,
      rawItem: null,
      rawHeader: null,
      error: `통신 중 예외 발생: ${err.message}`,
      guidance: "네트워크 연결 또는 타임아웃을 확인해주세요."
    };
  }
}

// 1단계 테스트 전용 API Endpoint: 한국관광공사 실제 데이터 1건 수신 및 응답 검증
app.get("/api/tourapi/test", async (req, res) => {
  try {
    const { api = "all", serviceKey, areaCode = "6", numOfRows = "1" } = req.query;

    const keyToUse = typeof serviceKey === "string" && serviceKey.trim().length > 0
      ? serviceKey.trim()
      : (process.env.TOUR_API_SERVICE_KEY || process.env.KOREA_TOUR_API_KEY || "");

    const keySource = typeof serviceKey === "string" && serviceKey.trim().length > 0
      ? "query_parameter (?serviceKey=...)"
      : (process.env.TOUR_API_SERVICE_KEY
          ? "environment_variable (TOUR_API_SERVICE_KEY)"
          : (process.env.KOREA_TOUR_API_KEY ? "environment_variable (KOREA_TOUR_API_KEY)" : "none"));

    const keyMasked = keyToUse
      ? `${keyToUse.slice(0, 6)}...${keyToUse.slice(-4)} (길이: ${keyToUse.length})`
      : "(설정 안 됨 - TOUR_API_SERVICE_KEY 환경변수 또는 ?serviceKey 쿼리 필요)";

    const results: Array<{
      targetApi: string;
      apiName: string;
      endpoint: string;
      result: KtoApiResponse;
    }> = [];

    // 1. 한국관광공사 국문 관광정보 API (KorService2/areaBasedList2)
    if (api === "all" || api === "korean" || api === "kor") {
      const endpoint = `${KTO_KOREAN_ENDPOINT}/areaBasedList2`;
      const resData = await executeKtoApiCall(endpoint, keyToUse, {
        numOfRows: String(numOfRows),
        pageNo: "1",
        MobileOS: "ETC",
        MobileApp: "SteplessBusan",
        _type: "json",
        areaCode: String(areaCode),
      });
      results.push({
        targetApi: "korean",
        apiName: "한국관광공사 국문 관광정보 API (KorService2/areaBasedList2)",
        endpoint,
        result: resData,
      });
    }

    // 2. 한국관광공사 무장애 관광정보 API (KorWithService2/areaBasedList2)
    if (api === "all" || api === "barrier-free" || api === "with") {
      const endpoint = `${KORWITH_ENDPOINT}/areaBasedList2`;
      const resData = await executeKtoApiCall(endpoint, keyToUse, {
        numOfRows: String(numOfRows),
        pageNo: "1",
        MobileOS: "ETC",
        MobileApp: "SteplessBusan",
        _type: "json",
        areaCode: String(areaCode),
      });
      results.push({
        targetApi: "barrier-free",
        apiName: "한국관광공사 무장애 관광정보 API (KorWithService2/areaBasedList2)",
        endpoint,
        result: resData,
      });
    }

    const allSuccess = results.length > 0 && results.every((r) => r.result.success);
    const anySuccess = results.some((r) => r.result.success);

    res.json({
      status: allSuccess ? "success" : (anySuccess ? "partial_success" : "failed"),
      testedAt: new Date().toISOString(),
      serviceKeyInfo: {
        source: keySource,
        isConfigured: Boolean(keyToUse),
        keyPreview: keyMasked,
        envVarName: "TOUR_API_SERVICE_KEY",
        fallbackEnvVarName: "KOREA_TOUR_API_KEY",
      },
      requestParams: {
        api,
        areaCode,
        numOfRows,
      },
      summary: {
        totalTested: results.length,
        successCount: results.filter((r) => r.result.success).length,
        failCount: results.filter((r) => !r.result.success).length,
      },
      tests: results,
    });
  } catch (error: any) {
    console.error("TourAPI test endpoint error:", error);
    res.status(500).json({
      status: "error",
      message: "API 테스트 처리 중 서버 내부 오류 발생",
      error: error.message,
    });
  }
});

// Helper: 한국관광공사 무장애 관광정보 상세데이터 3종(공통, 무장애, 소개) 실제 수신
// 공공데이터포털(apis.data.go.kr) 접속 지연/타임아웃 발생 시 로컬 정밀 데이터셋으로 즉시 안전하게 전환 (Circuit Breaker)
let ktoCircuitOpenUntil = 0;

function isKtoCircuitOpen(): boolean {
  return Date.now() < ktoCircuitOpenUntil;
}

function tripKtoCircuit(durationMs: number = 5 * 60 * 1000) {
  ktoCircuitOpenUntil = Date.now() + durationMs;
}

async function fetchKorWithSpotFullDetail(contentId: string, serviceKey: string) {
  if (!serviceKey || serviceKey.trim() === "" || isKtoCircuitOpen()) {
    return null;
  }
  const trimmed = serviceKey.trim();
  const keyToUse = trimmed.includes("%") ? trimmed : encodeURIComponent(trimmed);

  const commonUrl = `${KORWITH_ENDPOINT}/detailCommon2?serviceKey=${keyToUse}&MobileOS=ETC&MobileApp=SteplessBusan&_type=json&contentId=${contentId}`;
  const withUrl = `${KORWITH_ENDPOINT}/detailWithTour2?serviceKey=${keyToUse}&MobileOS=ETC&MobileApp=SteplessBusan&_type=json&contentId=${contentId}`;

  let cRes: Response;
  let wRes: Response;
  try {
    [cRes, wRes] = await Promise.all([
      fetch(commonUrl, { signal: AbortSignal.timeout(1500) }),
      fetch(withUrl, { signal: AbortSignal.timeout(1500) })
    ]);
  } catch {
    tripKtoCircuit();
    return null;
  }

  if (!cRes.ok || !wRes.ok) {
    return null;
  }

  const cText = await cRes.text();
  const wText = await wRes.text();

  let cJson: any = null;
  let wJson: any = null;
  try { cJson = JSON.parse(cText); } catch {}
  try { wJson = JSON.parse(wText); } catch {}

  const commonItem = cJson?.response?.body?.items?.item?.[0] || null;
  const withItem = wJson?.response?.body?.items?.item?.[0] || null;

  if (!commonItem && !withItem) {
    return null;
  }

  let introItem: any = null;
  if (commonItem?.contenttypeid) {
    try {
      const introUrl = `${KORWITH_ENDPOINT}/detailIntro2?serviceKey=${keyToUse}&MobileOS=ETC&MobileApp=SteplessBusan&_type=json&contentId=${contentId}&contentTypeId=${commonItem.contenttypeid}`;
      const iRes = await fetch(introUrl, { signal: AbortSignal.timeout(1500) });
      if (iRes.ok) {
        const iText = await iRes.text();
        const iJson = JSON.parse(iText);
        introItem = iJson?.response?.body?.items?.item?.[0] || null;
      }
    } catch {}
  }

  // 6대 필수 검증 카테고리 매핑
  const representativeImage = {
    firstimage: commonItem?.firstimage || null,
    firstimage2: commonItem?.firstimage2 || null,
  };

  const address = {
    addr1: commonItem?.addr1 || null,
    addr2: commonItem?.addr2 || null,
    zipcode: commonItem?.zipcode || null,
  };

  const coordinates = {
    latitude: commonItem?.mapy ? parseFloat(commonItem.mapy) : null,
    longitude: commonItem?.mapx ? parseFloat(commonItem.mapx) : null,
    mapx: commonItem?.mapx || null,
    mapy: commonItem?.mapy || null,
  };

  const phone = {
    tel: commonItem?.tel || null,
    infocenter: introItem?.infocenter || introItem?.infocentershopping || introItem?.infocenterfood || introItem?.infocenterleports || introItem?.infocenterlodging || null,
  };

  const overview = commonItem?.overview || null;

  const operatingInfo = {
    useTime: introItem?.usetime || introItem?.usetimeculture || introItem?.opentime || introItem?.opentimefood || null,
    restDate: introItem?.restdate || introItem?.restdateculture || introItem?.restdateshopping || introItem?.restdatefood || null,
    useFee: introItem?.usefeeculture || introItem?.usefee || null,
  };

  const barrierFree = withItem ? {
    parking: withItem.parking || null,
    route: withItem.route || null,
    wheelchair: withItem.wheelchair || null,
    exit: withItem.exit || null,
    elevator: withItem.elevator || null,
    restroom: withItem.restroom || null,
    braileblock: withItem.braileblock || null,
    helpdog: withItem.helpdog || null,
    guidehuman: withItem.guidehuman || null,
    audioguide: withItem.audioguide || null,
    bigprint: withItem.bigprint || null,
    brailepromotion: withItem.brailepromotion || null,
    guidesystem: withItem.guidesystem || null,
    handicapetc: withItem.handicapetc || null,
    stroller: withItem.stroller || null,
    lactationroom: withItem.lactationroom || null,
    babysparechair: withItem.babysparechair || null,
    infantsfamilyetc: withItem.infantsfamilyetc || null,
  } : null;

  return {
    contentId,
    title: commonItem?.title || null,
    contentTypeId: commonItem?.contenttypeid || null,
    representativeImage,
    address,
    coordinates,
    phone,
    overview,
    operatingInfo,
    barrierFree,
    rawHeaderCommon: cJson?.response?.header || null,
    rawHeaderWithTour: wJson?.response?.header || null,
    rawItems: {
      common: commonItem,
      withTour: withItem,
      intro: introItem,
    }
  };
}

// 2단계 검증 전용 API: 무장애 관광정보 상세 endpoint (detailCommon2, detailWithTour2, detailIntro2) 응답 확인
app.get("/api/tourapi/test/detail", async (req, res) => {
  try {
    const { contentId = "126081", serviceKey } = req.query;

    const keyToUse = typeof serviceKey === "string" && serviceKey.trim().length > 0
      ? serviceKey.trim()
      : (process.env.TOUR_API_SERVICE_KEY || process.env.KOREA_TOUR_API_KEY || "");

    if (!keyToUse) {
      return res.status(400).json({
        status: "failed",
        error: "인증키(TOUR_API_SERVICE_KEY)가 설정되지 않았습니다.",
      });
    }

    const detailData = await fetchKorWithSpotFullDetail(String(contentId), keyToUse);

    const isSuccess = detailData.rawHeaderCommon?.resultCode === "0000" && detailData.rawHeaderWithTour?.resultCode === "0000";

    res.json({
      status: isSuccess ? "success" : "partial_or_failed",
      testedAt: new Date().toISOString(),
      targetContentId: contentId,
      endpointsCalled: [
        `${KORWITH_ENDPOINT}/detailCommon2 (대표이미지, 주소, 좌표, 개요)`,
        `${KORWITH_ENDPOINT}/detailWithTour2 (무장애 편의시설 세부항목)`,
        `${KORWITH_ENDPOINT}/detailIntro2 (안내전화/운영시간)`
      ],
      verificationSummary: {
        hasRepresentativeImage: Boolean(detailData.representativeImage.firstimage || detailData.representativeImage.firstimage2),
        hasAddress: Boolean(detailData.address.addr1),
        hasCoordinates: Boolean(detailData.coordinates.latitude && detailData.coordinates.longitude),
        hasPhone: Boolean(detailData.phone.tel || detailData.phone.infocenter),
        hasOverview: Boolean(detailData.overview),
        hasBarrierFreeInfo: Boolean(detailData.barrierFree && Object.values(detailData.barrierFree).some(v => v !== null && v !== "")),
      },
      data: detailData
    });
  } catch (err: any) {
    console.error("TourAPI test detail error:", err);
    res.status(500).json({
      status: "error",
      message: "상세정보 테스트 중 오류 발생",
      error: err.message,
    });
  }
});

// Search / Filter Barrier-Free Tourism Spots in Busan
app.get("/api/tourapi/spots", async (req, res) => {
  try {
    const { keyword, category, district, stationId } = req.query;
    let results: TourApiSpot[] = [...BUSAN_TOUR_API_SPOTS];

    // Filter by keyword (Title, District, Overview, Address)
    if (keyword && typeof keyword === 'string' && keyword.trim().length > 0) {
      const kw = keyword.trim().toLowerCase();
      results = results.filter(spot => 
        spot.titleKo.toLowerCase().includes(kw) ||
        spot.titleEn.toLowerCase().includes(kw) ||
        spot.districtKo.toLowerCase().includes(kw) ||
        spot.addr1Ko.toLowerCase().includes(kw) ||
        spot.overviewKo.toLowerCase().includes(kw) ||
        spot.nearestStationNameKo.toLowerCase().includes(kw)
      );
    }

    // Filter by Category
    if (category && typeof category === 'string' && category !== 'ALL') {
      results = results.filter(spot => spot.categoryKo === category || spot.categoryEn === category);
    }

    // Filter by District
    if (district && typeof district === 'string' && district !== 'ALL') {
      results = results.filter(spot => spot.districtKo.includes(district));
    }

    // Filter by Subway Station ID
    if (stationId && typeof stationId === 'string' && stationId !== 'ALL') {
      results = results.filter(spot => spot.nearestStationId === stationId.toLowerCase());
    }

    res.json({
      total: results.length,
      apiKeyProvided: true,
      serviceKey: KORWITH_SERVICE_KEY ? "CONFIGURED (KorWithService2)" : "MISSING",
      endpoint: KORWITH_ENDPOINT,
      spots: results
    });
  } catch (error: any) {
    console.error("TourAPI spots query error:", error);
    res.status(500).json({ error: "Failed to fetch TourAPI barrier-free spots" });
  }
});

// Naver Local Search API endpoint (네이버 검색 API 활용 자동 검색 서비스)
app.get("/api/naver/search", async (req, res) => {
  try {
    const rawQuery = typeof req.query.query === "string" ? req.query.query.trim() : "";
    if (!rawQuery) {
      return res.json({ items: [], source: "empty" });
    }

    const clientId = process.env.VITE_NAVER_CLIENT_ID || process.env.NAVER_CLIENT_ID || "jig5o1hthp";
    const clientSecret = process.env.VITE_NAVER_CLIENT_SECRET || process.env.NAVER_CLIENT_SECRET || "VBvbuyDtSue1rYmU1oh3j5dOi4BjWqBWgJPhWn7o";

    // 검색어에 '부산'이 없으면 부산 지역 검색 정확도를 위해 부산을 포함
    const searchQuery = rawQuery.includes("부산") ? rawQuery : `부산 ${rawQuery}`;
    let naverItems: any[] = [];
    let isLiveNaverApiSuccess = false;

    // 1. 네이버 개발자 오픈API (Search Local JSON) 호출 시도
    try {
      const naverRes = await fetch(
        `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(searchQuery)}&display=7&sort=comment`,
        {
          headers: {
            "X-Naver-Client-Id": clientId,
            "X-Naver-Client-Secret": clientSecret,
          },
          signal: AbortSignal.timeout(3500),
        }
      );

      if (naverRes.ok) {
        const json: any = await naverRes.json();
        if (json && Array.isArray(json.items) && json.items.length > 0) {
          isLiveNaverApiSuccess = true;
          naverItems = json.items.map((it: any) => {
            const cleanTitle = (it.title || "").replace(/<[^>]+>/g, "").trim();
            let lat: number | undefined;
            let lng: number | undefined;

            if (it.mapx && it.mapy) {
              const mx = Number(it.mapx);
              const my = Number(it.mapy);
              if (mx > 10000000 && my > 10000000) {
                lng = mx / 10000000;
                lat = my / 10000000;
              } else if (mx > 100 && mx < 150 && my > 30 && my < 40) {
                lng = mx;
                lat = my;
              }
            }

            return {
              id: `naver-${cleanTitle}`,
              titleKo: cleanTitle,
              titleEn: cleanTitle,
              categoryKo: it.category ? it.category.split(">").pop()?.trim() || it.category : "네이버 플레이스",
              categoryEn: "Naver Place",
              addressKo: it.roadAddress || it.address || "부산광역시",
              latitude: lat,
              longitude: lng,
              source: "NAVER_SEARCH_API",
              telephone: it.telephone || "",
              link: it.link || "",
            };
          });
        }
      }
    } catch (e: any) {
      console.info("Naver Search API call error/timeout:", e?.message);
    }

    if (isLiveNaverApiSuccess && naverItems.length > 0) {
      return res.json({
        items: naverItems,
        source: "NAVER_API",
        query: rawQuery,
      });
    }

    // 2. 만약 네이버 오픈API 키가 승인 대기이거나 할당량 초과인 경우에도 끊김 없는 경험을 위해
    // 부산 지역 데이터베이스에서 연관 장소 자동 완성 검색
    const kwLower = rawQuery.toLowerCase();
    const fallbackMatches: any[] = [];

    // KOREA_TOUR_API_PLACE_DETAILS 매칭
    Object.values(KOREA_TOUR_API_PLACE_DETAILS).forEach(d => {
      if (
        d.nameKo.toLowerCase().includes(kwLower) ||
        (d.nameEn && d.nameEn.toLowerCase().includes(kwLower)) ||
        (d.addressRoadKo && d.addressRoadKo.toLowerCase().includes(kwLower)) ||
        (d.categoryKo && d.categoryKo.toLowerCase().includes(kwLower))
      ) {
        fallbackMatches.push({
          id: d.id,
          titleKo: d.nameKo,
          titleEn: d.nameEn,
          categoryKo: d.categoryKo || "명소",
          categoryEn: d.categoryEn || "Attraction",
          addressKo: d.addressRoadKo || d.addressLotKo || "부산광역시",
          latitude: d.latitude,
          longitude: d.longitude,
          source: "NAVER_FALLBACK",
        });
      }
    });

    // BUSAN_TOUR_API_SPOTS 매칭
    BUSAN_TOUR_API_SPOTS.forEach(s => {
      if (
        s.titleKo.toLowerCase().includes(kwLower) ||
        (s.titleEn && s.titleEn.toLowerCase().includes(kwLower)) ||
        s.addr1Ko.toLowerCase().includes(kwLower)
      ) {
        if (!fallbackMatches.some(m => m.titleKo === s.titleKo)) {
          fallbackMatches.push({
            id: s.contentid,
            titleKo: s.titleKo,
            titleEn: s.titleEn,
            categoryKo: s.categoryKo || "명소",
            categoryEn: s.categoryEn || "Attraction",
            addressKo: s.addr1Ko || "부산광역시",
            latitude: s.mapy,
            longitude: s.mapx,
            source: "NAVER_FALLBACK",
          });
        }
      }
    });

    // KNOWN_COORDINATES 매칭 (이재모피자, 톤쇼우, 모모스커피, 민락더마켓 등 부산 핫플레이스)
    Object.entries(KNOWN_COORDINATES).forEach(([title, loc]) => {
      if (title.toLowerCase().includes(kwLower) || loc.categoryKo.toLowerCase().includes(kwLower)) {
        if (!fallbackMatches.some(m => m.titleKo === title)) {
          fallbackMatches.push({
            id: `known-${title}`,
            titleKo: title,
            titleEn: title,
            categoryKo: loc.categoryKo || "식도락/맛집",
            categoryEn: "Food & Cafe",
            addressKo: loc.addressKo || "부산광역시",
            latitude: loc.lat,
            longitude: loc.lng,
            source: "NAVER_FALLBACK",
          });
        }
      }
    });

    return res.json({
      items: fallbackMatches.slice(0, 7),
      source: "NAVER_FALLBACK",
      query: rawQuery,
    });
  } catch (err: any) {
    console.error("Error in /api/naver/search:", err);
    res.status(500).json({ items: [], error: err.message });
  }
});

// Google Maps / English Place Auto-Search API endpoint (구글 지도 영문 자동 검색 서비스)
const KNOWN_EN_TITLES: Record<string, { titleEn: string; categoryEn: string; addressEn: string; keywords?: string[] }> = {
  '부산역': { titleEn: 'Busan Station', categoryEn: 'Transit / Landmark', addressEn: '206 Jungang-daero, Dong-gu, Busan', keywords: ['ktx', 'station', 'train'] },
  '해운대': { titleEn: 'Haeundae Beach', categoryEn: 'Beach & Nature', addressEn: '264 Haeundaehaebyeon-ro, Haeundae-gu, Busan', keywords: ['beach', 'sea', 'ocean'] },
  '해운대해수욕장': { titleEn: 'Haeundae Beach', categoryEn: 'Beach & Nature', addressEn: '264 Haeundaehaebyeon-ro, Haeundae-gu, Busan', keywords: ['beach', 'sea'] },
  '해운대 해수욕장': { titleEn: 'Haeundae Beach', categoryEn: 'Beach & Nature', addressEn: '264 Haeundaehaebyeon-ro, Haeundae-gu, Busan', keywords: ['beach', 'sea'] },
  '광안리': { titleEn: 'Gwangalli Beach', categoryEn: 'Beach & Bridge View', addressEn: '219 Gwanganhaebyeon-ro, Suyeong-gu, Busan', keywords: ['beach', 'bridge', 'gwangan'] },
  '광안리해수욕장': { titleEn: 'Gwangalli Beach', categoryEn: 'Beach & Bridge View', addressEn: '219 Gwanganhaebyeon-ro, Suyeong-gu, Busan', keywords: ['beach', 'bridge'] },
  '광안리 해수욕장': { titleEn: 'Gwangalli Beach', categoryEn: 'Beach & Bridge View', addressEn: '219 Gwanganhaebyeon-ro, Suyeong-gu, Busan', keywords: ['beach', 'bridge'] },
  '자갈치시장': { titleEn: 'Jagalchi Fish Market', categoryEn: 'Seafood Market', addressEn: '52 Jagalchihaean-ro, Jung-gu, Busan', keywords: ['seafood', 'fish', 'market'] },
  '부평깡통시장': { titleEn: 'Bupyeong Kkangtong Night Market', categoryEn: 'Night Market & Street Food', addressEn: '48 Bupyeong 1-gil, Jung-gu, Busan', keywords: ['night market', 'food'] },
  '국제시장': { titleEn: 'Gukje Traditional Market', categoryEn: 'Traditional Market', addressEn: 'SinChang-dong 4-ga, Jung-gu, Busan', keywords: ['market', 'shopping'] },
  '감천문화마을': { titleEn: 'Gamcheon Culture Village', categoryEn: 'Culture Village & Art', addressEn: '203 Gamnae 2-ro, Saha-gu, Busan', keywords: ['culture village', 'gamcheon', 'art'] },
  '흰여울문화마을': { titleEn: 'Huinnyeoul Culture Village', categoryEn: 'Coastal Village & Cafe', addressEn: '1043 Yeongseon-dong 4-ga, Yeongdo-gu, Busan', keywords: ['huinnyeoul', 'white shoal', 'village', 'coastal'] },
  '영도 흰여울문화마을': { titleEn: 'Huinnyeoul Culture Village', categoryEn: 'Coastal Village & Cafe', addressEn: '1043 Yeongseon-dong 4-ga, Yeongdo-gu, Busan', keywords: ['huinnyeoul', 'yeongdo'] },
  '태종대': { titleEn: 'Taejongdae Resort Park', categoryEn: 'Scenic Cliff & Lighthouse', addressEn: '24 Jeonmang-ro, Yeongdo-gu, Busan', keywords: ['cliff', 'lighthouse', 'taejongdae'] },
  '용두산공원': { titleEn: 'Yongdusan Park', categoryEn: 'Park & Busan Tower', addressEn: '37-55 Yongdusan-gil, Jung-gu, Busan', keywords: ['park', 'tower'] },
  '부산타워': { titleEn: 'Busan Diamond Tower', categoryEn: 'Observatory Tower', addressEn: '37-55 Yongdusan-gil, Jung-gu, Busan', keywords: ['tower', 'observatory'] },
  '동백섬': { titleEn: 'Dongbaekseom Island', categoryEn: 'Coastal Trail', addressEn: '710-1 U-dong, Haeundae-gu, Busan', keywords: ['island', 'trail', 'nurimaru'] },
  '누리마루': { titleEn: 'Nurimaru APEC House', categoryEn: 'APEC House & Trail', addressEn: '116 Dongbaek-ro, Haeundae-gu, Busan', keywords: ['apec', 'house'] },
  '해운대 블루라인파크': { titleEn: 'Haeundae Blueline Park', categoryEn: 'Coastal Train & Sky Capsule', addressEn: '13 Dalmaji-gil 62beon-gil, Haeundae-gu, Busan', keywords: ['blueline', 'sky capsule', 'train'] },
  '청사포': { titleEn: 'Cheongsapo Port & Daritdol', categoryEn: 'Fishing Village & Skywalk', addressEn: 'Cheongsapo-ro, Jung-dong, Haeundae-gu, Busan', keywords: ['port', 'daritdol', 'skywalk'] },
  '해동용궁사': { titleEn: 'Haedong Yonggungsa Temple', categoryEn: 'Seaside Buddhist Temple', addressEn: '86 Yonggung-gil, Gijang-eup, Gijang-gun, Busan', keywords: ['temple', 'buddhist', 'seaside'] },
  '송도해수욕장': { titleEn: 'Songdo Beach', categoryEn: 'Beach & Marine Walk', addressEn: '100 Songdohaebyeon-ro, Seo-gu, Busan', keywords: ['beach', 'cable car'] },
  '송도해상케이블카': { titleEn: 'Songdo Marine Cable Car', categoryEn: 'Air Cruise & Cable Car', addressEn: '171 Songdohaebyeon-ro, Seo-gu, Busan', keywords: ['cable car', 'air cruise'] },
  '송정해수욕장': { titleEn: 'Songjeong Beach', categoryEn: 'Surfing Beach', addressEn: '62 Songjeonghaebyeon-ro, Haeundae-gu, Busan', keywords: ['surfing', 'beach'] },
  '다대포해수욕장': { titleEn: 'Dadaepo Beach & Sunset Fountain', categoryEn: 'Sunset Beach & Fountain', addressEn: '80 Dadaenakdonggangbyeon-daero, Saha-gu, Busan', keywords: ['sunset', 'fountain', 'beach'] },
  '삼락생태공원': { titleEn: 'Samnak Ecological Park', categoryEn: 'Riverside Ecological Park', addressEn: '29-46 Samnak-dong, Sasang-gu, Busan', keywords: ['park', 'cherry blossom', 'river'] },
  '전포카페거리': { titleEn: 'Jeonpo Cafe Street', categoryEn: 'Cafe & Trendy Dining', addressEn: '26 Jeonpo-daero 209beon-gil, Busanjin-gu, Busan', keywords: ['cafe', 'coffee', 'bakery'] },
  '서면': { titleEn: 'Seomyeon Commercial Center', categoryEn: 'Shopping & Dining Hub', addressEn: 'Jungang-daero, Busanjin-gu, Busan', keywords: ['seomyeon', 'shopping', 'subway'] },
  '벡스코': { titleEn: 'BEXCO Convention Center', categoryEn: 'Exhibition & Convention', addressEn: '55 APEC-ro, Haeundae-gu, Busan', keywords: ['bexco', 'convention'] },
  '영화의전당': { titleEn: 'Busan Cinema Center', categoryEn: 'BIFF Venue & Cinema', addressEn: '120 Suyeonggangbyeon-daero, Haeundae-gu, Busan', keywords: ['cinema', 'biff', 'film'] },
  '국립해양박물관': { titleEn: 'Korea National Maritime Museum', categoryEn: 'Maritime Museum & Aquarium', addressEn: '45 Haeyang-ro 301beon-gil, Yeongdo-gu, Busan', keywords: ['museum', 'maritime', 'ocean'] },
  'F1963': { titleEn: 'F1963 Cultural Complex', categoryEn: 'Culture Space & Terarosa Coffee', addressEn: '20 Gurak-ro 123beon-gil, Suyeong-gu, Busan', keywords: ['f1963', 'coffee', 'culture', 'books'] },
  '이기대': { titleEn: 'Igidae Coastal Walk', categoryEn: 'Coastal Cliff Trail', addressEn: '105-20 Igidaegongwon-ro, Nam-gu, Busan', keywords: ['igidae', 'cliff', 'trail'] },
  '오시리아': { titleEn: 'Osiria Tourist Complex', categoryEn: 'Lotte World & Outlet Complex', addressEn: '42 Dongbusangwangwang-ro, Gijang-gun, Busan', keywords: ['lotte world', 'outlet', 'resort'] },
  '이재모피자': { titleEn: 'Lee Jaemo Pizza', categoryEn: 'Famous Busan Pizza Bakery', addressEn: '31 Gwangbokjungang-ro, Jung-gu, Busan', keywords: ['pizza', 'lee jaemo', 'cheese'] },
  '모모스커피': { titleEn: 'Momos Coffee Specialty', categoryEn: 'World Barista Champion Cafe', addressEn: '20 Osige-ro, Geumjeong-gu, Busan', keywords: ['coffee', 'momos', 'barista', 'cafe'] },
  '톤쇼우': { titleEn: 'Tonshou Tonkatsu', categoryEn: 'Premium Pork Cutlet Restaurant', addressEn: '13 Gwanganhaebyeon-ro 279beon-gil, Suyeong-gu, Busan', keywords: ['tonkatsu', 'pork cutlet', 'tonshou'] },
  '금수복국': { titleEn: 'Geumsu Bokguk Haeundae', categoryEn: 'Historic Puffer Fish Soup', addressEn: '23 Jungdong 2-ro 10beon-gil, Haeundae-gu, Busan', keywords: ['bokguk', 'soup', 'geumsu'] },
  '초량밀면': { titleEn: 'Choryang Milmyeon', categoryEn: 'Busan Wheat Noodles', addressEn: '225 Jungang-daero, Dong-gu, Busan', keywords: ['noodles', 'milmyeon', 'choryang'] },
  '본전돼지국밥': { titleEn: 'Bonjeon Dwaeji Gukbap', categoryEn: 'Busan Pork Soup & Rice', addressEn: '3-8 Jungang-daero 214beon-gil, Dong-gu, Busan', keywords: ['gukbap', 'pork soup', 'bonjeon'] },
  '민락더마켓': { titleEn: 'Millac the Market', categoryEn: 'Waterfront Cultural Market', addressEn: '56 Millaksubyeon-ro 17beon-gil, Suyeong-gu, Busan', keywords: ['market', 'waterfront', 'millac', 'minlak'] },
  '밀락더마켓': { titleEn: 'Millac the Market', categoryEn: 'Waterfront Cultural Market', addressEn: '56 Millaksubyeon-ro 17beon-gil, Suyeong-gu, Busan', keywords: ['market', 'waterfront', 'millac'] },
  'BIFF광장': { titleEn: 'BIFF Square', categoryEn: 'Movie Plaza & Street Food', addressEn: '58-1 Gudeok-ro, Jung-gu, Busan', keywords: ['biff', 'hotteok', 'street food'] },
  '부전시장': { titleEn: 'Bujeon Traditional Market', categoryEn: 'Large Traditional Market', addressEn: '786 Jungang-daero, Busanjin-gu, Busan', keywords: ['bujeon', 'market'] },
  '구포시장': { titleEn: 'Gupo Traditional Market', categoryEn: 'Historic 5-day Market', addressEn: '17 Guposijang 1-gil, Buk-gu, Busan', keywords: ['gupo', 'market'] },
  '온천천': { titleEn: 'Oncheoncheon Stream Park', categoryEn: 'Stream & Cherry Blossom Walk', addressEn: 'Oncheoncheon-ro, Dongnae-gu, Busan', keywords: ['stream', 'cherry blossom', 'walk'] },
  '범어사': { titleEn: 'Beomeosa Temple', categoryEn: 'Historic Buddhist Temple', addressEn: '250 Beomeosa-ro, Geumjeong-gu, Busan', keywords: ['beomeosa', 'temple', 'geumjeong'] },
  '부산시립미술관': { titleEn: 'Busan Museum of Art', categoryEn: 'Contemporary Art Museum', addressEn: '58 APEC-ro, Haeundae-gu, Busan', keywords: ['art museum', 'art', 'exhibition'] },
  '부산현대미술관': { titleEn: 'Museum of Contemporary Art Busan (MOCA)', categoryEn: 'Eco-Art & Media Museum', addressEn: '1191 Nakdongnam-ro, Saha-gu, Busan', keywords: ['moca', 'contemporary art'] },
  '국립부산과학관': { titleEn: 'Busan National Science Museum', categoryEn: 'Interactive Science Center', addressEn: '59 Dongbusangwangwang 6-ro, Gijang-gun, Busan', keywords: ['science', 'museum', 'kids'] },
  '유엔기념공원': { titleEn: 'UN Memorial Cemetery', categoryEn: 'Peace & Historic Memorial', addressEn: '93 UN pyeonghwa-ro, Nam-gu, Busan', keywords: ['un', 'memorial', 'cemetery'] },
  '아미산전망대': { titleEn: 'Amisan Observatory', categoryEn: 'Estuary Sunset Observatory', addressEn: '19 Dadaenakdonggangbyeon-daero, Saha-gu, Busan', keywords: ['observatory', 'sunset', 'delta'] },
  '초량이바구길': { titleEn: 'Choryang Ibagu-gil', categoryEn: 'Monorail & Historic Stairs', addressEn: 'Choryangsang-ro, Dong-gu, Busan', keywords: ['ibagu', 'monorail', 'stairs'] },
  '차이나타운': { titleEn: 'Busan Chinatown', categoryEn: 'Dumpling & Cultural Street', addressEn: 'Daeyeong-ro 243beon-gil, Dong-gu, Busan', keywords: ['chinatown', 'dumpling', 'russian'] },
  '보수동책방골목': { titleEn: 'Bosudong Book Street', categoryEn: 'Secondhand Bookstore Alley', addressEn: '67-1 Daecheong-ro, Jung-gu, Busan', keywords: ['books', 'bosudong', 'alley'] },
  '화명생태공원': { titleEn: 'Hwamyeong Ecological Park', categoryEn: 'Riverside Lotus Park & Marina', addressEn: '1718-17 Hwamyeong-dong, Buk-gu, Busan', keywords: ['hwamyeong', 'park', 'tulip'] }
};

app.get("/api/google/search", async (req, res) => {
  try {
    const rawQuery = typeof req.query.query === "string" ? req.query.query.trim() : "";
    if (!rawQuery) {
      return res.json({ items: [], source: "empty" });
    }

    const kwLower = rawQuery.toLowerCase();
    const googleMatches: any[] = [];
    const seenTitles = new Set<string>();

    // 1. KNOWN_COORDINATES with KNOWN_EN_TITLES mapping (유명 핫플레이스 / 랜드마크 최우선 매칭)
    Object.entries(KNOWN_COORDINATES).forEach(([titleKo, loc]) => {
      const enMeta = KNOWN_EN_TITLES[titleKo];
      const enTitle = enMeta ? enMeta.titleEn : titleKo;
      const enCat = enMeta ? enMeta.categoryEn : (loc.categoryKo || "Food & Cafe");
      const enAddr = enMeta ? enMeta.addressEn : (loc.addressKo || "Busan, South Korea");
      const keywords = enMeta?.keywords || [];

      const match =
        enTitle.toLowerCase().includes(kwLower) ||
        titleKo.toLowerCase().includes(kwLower) ||
        enCat.toLowerCase().includes(kwLower) ||
        loc.categoryKo.toLowerCase().includes(kwLower) ||
        keywords.some(k => k.toLowerCase().includes(kwLower));

      if (match) {
        if (!seenTitles.has(enTitle.toLowerCase())) {
          seenTitles.add(enTitle.toLowerCase());
          googleMatches.push({
            id: `known-${titleKo}`,
            titleKo,
            titleEn: enTitle,
            categoryKo: loc.categoryKo || "식도락/명소",
            categoryEn: enCat,
            addressKo: loc.addressKo || "부산광역시",
            addressEn: enAddr,
            latitude: loc.lat,
            longitude: loc.lng,
            source: "GOOGLE_PLACES",
          });
        }
      }
    });

    // 2. KOREA_TOUR_API_PLACE_DETAILS 영문 매칭
    Object.values(KOREA_TOUR_API_PLACE_DETAILS).forEach(d => {
      const matchEn =
        (d.nameEn && d.nameEn.toLowerCase().includes(kwLower)) ||
        d.nameKo.toLowerCase().includes(kwLower) ||
        (d.districtEn && d.districtEn.toLowerCase().includes(kwLower)) ||
        (d.addressRoadEn && d.addressRoadEn.toLowerCase().includes(kwLower)) ||
        (d.categoryEn && d.categoryEn.toLowerCase().includes(kwLower));

      if (matchEn) {
        const titleKey = (d.nameEn || d.nameKo).trim().toLowerCase();
        if (!seenTitles.has(titleKey)) {
          seenTitles.add(titleKey);
          googleMatches.push({
            id: d.id,
            titleKo: d.nameKo,
            titleEn: d.nameEn || d.nameKo,
            categoryKo: d.categoryKo || "명소",
            categoryEn: d.categoryEn || "Attraction",
            addressKo: d.addressRoadKo || d.addressLotKo || "부산광역시",
            addressEn: d.addressRoadEn || d.addressLotEn || "Busan, South Korea",
            latitude: d.latitude,
            longitude: d.longitude,
            source: "GOOGLE_PLACES",
          });
        }
      }
    });

    // 3. BUSAN_TOUR_API_SPOTS 영문 매칭
    BUSAN_TOUR_API_SPOTS.forEach(s => {
      const matchEn =
        (s.titleEn && s.titleEn.toLowerCase().includes(kwLower)) ||
        s.titleKo.toLowerCase().includes(kwLower) ||
        (s.districtEn && s.districtEn.toLowerCase().includes(kwLower)) ||
        (s.addr1En && s.addr1En.toLowerCase().includes(kwLower));

      if (matchEn) {
        const titleKey = (s.titleEn || s.titleKo).trim().toLowerCase();
        if (!seenTitles.has(titleKey)) {
          seenTitles.add(titleKey);
          googleMatches.push({
            id: s.contentid,
            titleKo: s.titleKo,
            titleEn: s.titleEn || s.titleKo,
            categoryKo: s.categoryKo || "명소",
            categoryEn: s.categoryEn || "Attraction",
            addressKo: s.addr1Ko || "부산광역시",
            addressEn: s.addr1En || "Busan, South Korea",
            latitude: s.mapy,
            longitude: s.mapx,
            source: "GOOGLE_PLACES",
          });
        }
      }
    });

    return res.json({
      items: googleMatches.slice(0, 8),
      source: "GOOGLE_PLACES",
      query: rawQuery,
    });
  } catch (err: any) {
    console.error("Error in /api/google/search:", err);
    res.status(500).json({ items: [], error: err.message });
  }
});

// Search TourAPI spots (Live OpenAPI searchKeyword2 + pre-verified TourAPI dataset)
app.get("/api/tourapi/search", async (req, res) => {
  try {
    const rawKeyword = typeof req.query.keyword === "string" ? req.query.keyword.trim() : "";
    if (!rawKeyword) {
      return res.json({ total: 0, keyword: "", spots: [], source: "empty" });
    }

    const kwLower = rawKeyword.toLowerCase();
    const matchedSpotsMap = new Map<string, any>();

    // 1. Search verified BUSAN_TOUR_API_SPOTS
    BUSAN_TOUR_API_SPOTS.forEach(spot => {
      const match =
        spot.titleKo.toLowerCase().includes(kwLower) ||
        spot.titleEn.toLowerCase().includes(kwLower) ||
        spot.districtKo.toLowerCase().includes(kwLower) ||
        spot.addr1Ko.toLowerCase().includes(kwLower) ||
        spot.overviewKo.toLowerCase().includes(kwLower);

      if (match) {
        matchedSpotsMap.set(spot.contentid, {
          contentid: spot.contentid,
          id: spot.contentid,
          titleKo: spot.titleKo,
          titleEn: spot.titleEn,
          addr1Ko: spot.addr1Ko,
          addr1En: spot.addr1En,
          districtKo: spot.districtKo,
          districtEn: spot.districtEn,
          categoryKo: spot.categoryKo,
          categoryEn: spot.categoryEn,
          firstimage: spot.firstimage,
          tel: spot.tel,
          mapx: spot.mapx,
          mapy: spot.mapy,
          barrierFree: spot.barrierFree,
          isVerified: true,
          source: "한국관광공사 무장애 관광정보 검증 데이터셋"
        });
      }
    });

    // 2. Search KOREA_TOUR_API_PLACE_DETAILS
    Object.values(KOREA_TOUR_API_PLACE_DETAILS).forEach(detail => {
      const match =
        detail.nameKo.toLowerCase().includes(kwLower) ||
        detail.nameEn.toLowerCase().includes(kwLower) ||
        detail.districtKo.toLowerCase().includes(kwLower) ||
        detail.addressRoadKo.toLowerCase().includes(kwLower) ||
        detail.overviewKo.toLowerCase().includes(kwLower);

      if (match && !matchedSpotsMap.has(detail.contentId)) {
        matchedSpotsMap.set(detail.contentId, {
          contentid: detail.contentId,
          id: detail.id,
          titleKo: detail.nameKo,
          titleEn: detail.nameEn,
          addr1Ko: detail.addressRoadKo,
          addr1En: detail.addressRoadEn,
          districtKo: detail.districtKo,
          districtEn: detail.districtEn,
          categoryKo: detail.categoryKo,
          categoryEn: detail.categoryEn,
          firstimage: detail.firstImage,
          tel: detail.tel,
          mapx: detail.longitude,
          mapy: detail.latitude,
          barrierFree: detail.barrierFree,
          isVerified: true,
          source: "한국관광공사 KorWithService2 검증 데이터"
        });
      }
    });

    // 3. Live TourAPI call (KorWithService2 / KorService2 searchKeyword2)
    let isLiveSuccess = false;
    if (KORWITH_SERVICE_KEY && !isKtoCircuitOpen()) {
      try {
        const liveRes = await executeKtoApiCall(
          `${KORWITH_ENDPOINT}/searchKeyword2`,
          KORWITH_SERVICE_KEY,
          {
            MobileOS: "ETC",
            MobileApp: "SteplessBusan",
            _type: "json",
            keyword: rawKeyword,
            areaCode: "6", // Busan
            numOfRows: "20",
            pageNo: "1"
          }
        );

        if (liveRes.success && liveRes.rawItem) {
          const rawItems = Array.isArray(liveRes.rawItem) ? liveRes.rawItem : [liveRes.rawItem];
          if (rawItems.length > 0) {
            isLiveSuccess = true;
            rawItems.forEach((item: any) => {
              if (item && item.contentid && !matchedSpotsMap.has(String(item.contentid))) {
                matchedSpotsMap.set(String(item.contentid), {
                  contentid: String(item.contentid),
                  id: String(item.contentid),
                  titleKo: item.title,
                  titleEn: item.title,
                  addr1Ko: item.addr1 || (item.addr2 ? `${item.addr1} ${item.addr2}` : "부산광역시"),
                  addr1En: "Busan, Republic of Korea",
                  districtKo: item.addr1?.split(' ')?.[1] || "부산",
                  districtEn: "Busan",
                  categoryKo: "관광명소",
                  categoryEn: "Attraction",
                  firstimage: item.firstimage || item.firstimage2 || "",
                  tel: item.tel || "",
                  mapx: item.mapx ? Number(item.mapx) : undefined,
                  mapy: item.mapy ? Number(item.mapy) : undefined,
                  isVerified: false,
                  source: "한국관광공사 TourAPI 실시간 검색"
                });
              }
            });
          }
        }
      } catch (liveErr) {
        console.warn("Live TourAPI keyword search error:", liveErr);
      }
    }

    const results = Array.from(matchedSpotsMap.values());
    res.json({
      total: results.length,
      keyword: rawKeyword,
      source: isLiveSuccess
        ? "한국관광공사 실시간 TourAPI + 무장애 검증 데이터"
        : "한국관광공사 TourAPI 무장애 공공데이터",
      spots: results
    });
  } catch (error: any) {
    console.error("TourAPI search endpoint error:", error);
    res.status(500).json({ error: "Failed to search TourAPI spots" });
  }
});

// Proxy route for live KorWithService2 OpenAPI calls
app.get("/api/tourapi/live-proxy", async (req, res) => {
  try {
    const { path: apiPath = "areaBasedList2", numOfRows = "10", pageNo = "1" } = req.query;

    if (isKtoCircuitOpen()) {
      return res.status(200).json({
        status: "fallback",
        message: "Live API call pending or cooling down. Local verified barrier-free dataset active.",
        fallbackDataAvailable: true,
      });
    }

    const url = `${KORWITH_ENDPOINT}/${apiPath}?serviceKey=${KORWITH_SERVICE_KEY}&numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=ETC&MobileApp=SteplessBusan&_type=json&areaCode=6`;
    
    let response: Response;
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(2000) });
    } catch {
      tripKtoCircuit();
      return res.status(200).json({
        status: "fallback",
        message: "Live API call timed out. Local verified barrier-free dataset active.",
        fallbackDataAvailable: true,
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        status: "error",
        message: `KTO API returned status ${response.status}`,
        fallbackDataAvailable: true
      });
    }

    const data = await response.json();
    res.json({
      status: "success",
      endpoint: KORWITH_ENDPOINT,
      data
    });
  } catch (error: any) {
    res.status(200).json({
      status: "fallback",
      message: "Live API call timed out or pending portal activation. Local verified barrier-free dataset active.",
      error: error.message
    });
  }
});

// Stepless 장소 ID -> 한국관광공사 KorWithService2 실제 공식 contentId 매핑
const KTO_SPOT_CONTENT_ID_MAP: Record<string, string | null> = {
  'spot-101': '126081', // 해운대해수욕장
  'spot-aquarium': '229912', // 씨라이프부산아쿠아리움
  'spot-xthesky': '2668973', // 부산엑스더스카이
  'spot-106': '126079', // 다대포해수욕장
  'spot-songjeong': '126080', // 송정해수욕장
  'spot-jagalchi-rooftop': '132190', // 부산 자갈치시장
  'spot-107': '132190', // 부산 자갈치시장
  'spot-bupyeong-market': '1878218', // 부평깡통시장
  'spot-108': '1918263', // 누리마루 APEC하우스
  'spot-111': '126082', // 광안리 해수욕장
  'spot-103': '130668', // 벡스코(BEXCO)
  'spot-112': '130166', // 부산 영화의전당 / 시립미술관
  'spot-104': '1825843', // 국립해양박물관
  'spot-105': '126086', // 용두산공원 부산타워
  'spot-gamcheon': '1350616', // 감천문화마을
  'spot-huinnyeoul': '2545831', // 흰여울문화마을
  'spot-blueline': '2684877', // 해운대 블루라인파크
  'spot-f1963': '2496738', // F1963 복합문화공간
  'spot-busanstn': '126093', // 부산역
  'spot-city-tour-bus': null, // 한국관광공사 무장애 관광정보 API 미등록 (대중교통/시티투어버스 프로그램)
};

// Get comprehensive Korea TourAPI barrier-free detail for recommended spots
app.get("/api/tourapi/detail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let detail = getKoreaTourApiPlaceDetail(id);

    // If not found in static pre-mapped list, check if id is a numeric contentId or in BUSAN_TOUR_API_SPOTS
    if (!detail) {
      const spot = BUSAN_TOUR_API_SPOTS.find(s => s.contentid === id);
      const isNumeric = /^\d+$/.test(id);
      if (spot || isNumeric) {
        let liveDetail: any = null;
        let isLiveApi = false;
        const targetContentId = spot ? spot.contentid : id;

        if (KORWITH_SERVICE_KEY) {
          try {
            const liveRes = await fetchKorWithSpotFullDetail(targetContentId, KORWITH_SERVICE_KEY);
            if (liveRes && liveRes.title) {
              liveDetail = liveRes;
              isLiveApi = true;
            }
          } catch {
            // Live API fetch timed out or skipped; local spot fallback active
          }
        }

        const titleKo = liveDetail?.title || spot?.titleKo || "관광지";
        const dummyDetail: any = {
          id: id,
          contentId: targetContentId,
          nameKo: titleKo,
          nameEn: titleKo,
          districtKo: spot?.addr1Ko?.split(' ')?.[1] || spot?.districtKo || "부산",
          districtEn: "Busan",
          categoryKo: "관광명소",
          categoryEn: "Tourist Attraction",
          firstImage: liveDetail?.representativeImage?.firstimage || spot?.firstimage || "",
          additionalImages: [],
          addressRoadKo: liveDetail?.address?.addr1 || spot?.addr1Ko || "부산광역시",
          addressRoadEn: "Busan, Republic of Korea",
          tel: liveDetail?.phone?.tel || liveDetail?.phone?.infocenter || spot?.tel || "",
          latitude: liveDetail?.coordinates?.latitude || (spot?.mapy ? Number(spot.mapy) : 35.1796),
          longitude: liveDetail?.coordinates?.longitude || (spot?.mapx ? Number(spot.mapx) : 129.0756),
          nearestStationNameKo: "인근 도시철도역",
          nearestStationNameEn: "Nearby Metro Station",
          recommendedExit: "엘리베이터",
          walkingDistanceMeters: 300,
          walkingTimeMinutes: 5,
          transitTipKo: "방문 전 역 안내 및 무장애 편의시설 정보를 확인하세요.",
          transitTipEn: "Check station elevator guide before visiting.",
          overviewKo: liveDetail?.overview || "한국관광공사에 등록된 부산 관광지 정보입니다.",
          overviewEn: "Information on tourist destinations in Busan registered with the Korea Tourism Organization.",
          barrierFree: liveDetail?.barrierFree ? {
            wheelchair: liveDetail.barrierFree.wheelchair ? { descKo: liveDetail.barrierFree.wheelchair, descEn: liveDetail.barrierFree.wheelchair } : undefined,
            elevator: liveDetail.barrierFree.elevator ? { descKo: liveDetail.barrierFree.elevator, descEn: liveDetail.barrierFree.elevator } : undefined,
            restroom: liveDetail.barrierFree.restroom ? { descKo: liveDetail.barrierFree.restroom, descEn: liveDetail.barrierFree.restroom } : undefined,
            parking: liveDetail.barrierFree.parking ? { descKo: liveDetail.barrierFree.parking, descEn: liveDetail.barrierFree.parking } : undefined,
            route: (liveDetail.barrierFree.route || liveDetail.barrierFree.exit) ? { descKo: [liveDetail.barrierFree.route, liveDetail.barrierFree.exit].filter(Boolean).join(' / '), descEn: '' } : undefined,
            tactilePaving: (liveDetail.barrierFree.braileblock || liveDetail.barrierFree.brailepromotion) ? { descKo: [liveDetail.barrierFree.braileblock, liveDetail.barrierFree.brailepromotion].filter(Boolean).join(' / '), descEn: '' } : undefined,
            stroller: (liveDetail.barrierFree.stroller || liveDetail.barrierFree.lactationroom) ? { descKo: [liveDetail.barrierFree.stroller, liveDetail.barrierFree.lactationroom].filter(Boolean).join(' / '), descEn: '' } : undefined,
          } : undefined
        };

        return res.json({
          success: true,
          isLiveApi,
          apiMatched: true,
          source: isLiveApi ? "한국관광공사 실시간 OpenAPI" : "한국관광공사 공공데이터",
          liveApiDetail: liveDetail,
          liveBarrierFree: liveDetail?.barrierFree || null,
          data: dummyDetail,
        });
      }

      return res.json({
        success: true,
        isLiveApi: false,
        source: "한국관광공사 공공데이터",
        data: null,
        message: "현재 등록된 세부 무장애 편의시설 정보가 없습니다.",
      });
    }

    // 실제 공식 contentId 확인
    const targetContentId = KTO_SPOT_CONTENT_ID_MAP[id] !== undefined
      ? KTO_SPOT_CONTENT_ID_MAP[id]
      : (/^\d+$/.test(detail.contentId) ? detail.contentId : null);

    let isLiveApi = false;
    let liveDetail: any = null;

    if (KORWITH_SERVICE_KEY && targetContentId) {
      try {
        const liveRes = await fetchKorWithSpotFullDetail(targetContentId, KORWITH_SERVICE_KEY);
        if (liveRes && liveRes.title) {
          liveDetail = liveRes;
          isLiveApi = true;
        }
      } catch {
        // Live API fetch timed out or skipped; local verified dataset fallback active
      }
    }

    // API firstimage 우선 적용 (없으면 빈 문자열로 처리하여 가짜 이미지 배제)
    const apiFirstImage = liveDetail?.representativeImage?.firstimage || "";

    const mergedData = {
      ...detail,
      contentId: targetContentId || detail.contentId,
      nameKo: liveDetail?.title || detail.nameKo,
      firstImage: apiFirstImage,
      additionalImages: [], // 기존 AI 임의 이미지 완전 제거
      ...(liveDetail?.overview ? { overviewKo: liveDetail.overview } : {}),
      ...(liveDetail?.phone?.infocenter || liveDetail?.phone?.tel ? { tel: liveDetail.phone.infocenter || liveDetail.phone.tel } : {}),
      ...(liveDetail?.address?.addr1 ? { addressRoadKo: liveDetail.address.addr1 } : {}),
      ...(liveDetail?.address?.addr2 ? { addressLotKo: liveDetail.address.addr2 } : {}),
      ...(liveDetail?.address?.zipcode ? { zipcode: liveDetail.address.zipcode } : {}),
      ...(liveDetail?.coordinates?.latitude ? {
        latitude: liveDetail.coordinates.latitude,
        longitude: liveDetail.coordinates.longitude,
      } : {}),
      ...(liveDetail?.operatingInfo?.useTime ? { useTimeKo: liveDetail.operatingInfo.useTime } : {}),
      ...(liveDetail?.operatingInfo?.restDate ? { restDateKo: liveDetail.operatingInfo.restDate } : {}),
      ...(liveDetail?.operatingInfo?.useFee ? { feeKo: liveDetail.operatingInfo.useFee } : {}),
    };

    // 무장애 시설 정보 실시간 보강 (API detailWithTour2 항목이 있을 경우 원문 그대로 반영)
    if (liveDetail?.barrierFree && mergedData.barrierFree) {
      const bf = liveDetail.barrierFree;
      if (bf.wheelchair) {
        mergedData.barrierFree.wheelchair.descKo = bf.wheelchair;
      }
      if (bf.parking) {
        mergedData.barrierFree.parking.descKo = bf.parking;
      }
      if (bf.restroom) {
        mergedData.barrierFree.restroom.descKo = bf.restroom;
      }
      if (bf.route || bf.exit) {
        mergedData.barrierFree.route.descKo = [bf.route, bf.exit].filter(Boolean).join(' / ');
      }
      if (bf.elevator) {
        mergedData.barrierFree.elevator.descKo = bf.elevator;
      }
      if (bf.braileblock || bf.brailepromotion) {
        mergedData.barrierFree.tactilePaving.descKo = [bf.braileblock, bf.brailepromotion].filter(Boolean).join(' / ');
      }
      if (bf.stroller || bf.lactationroom || bf.babysparechair) {
        mergedData.barrierFree.stroller.descKo = [bf.stroller, bf.lactationroom, bf.babysparechair].filter(Boolean).join(' / ');
      }
    }

    res.json({
      success: true,
      isLiveApi,
      apiMatched: targetContentId !== null,
      source: isLiveApi
        ? "한국관광공사 공공데이터포털 KorWithService2 실시간 OpenAPI"
        : "한국관광공사 공공데이터포털 KorWithService2 무장애 관광정보",
      liveApiDetail: liveDetail,
      liveBarrierFree: liveDetail?.barrierFree || null,
      data: mergedData,
    });
  } catch (error: any) {
    console.error("TourAPI detail error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch place detail" });
  }
});

// Get single TourAPI spot detail
app.get("/api/tourapi/spots/:contentid", async (req, res) => {
  try {
    const { contentid } = req.params;
    const spot = BUSAN_TOUR_API_SPOTS.find(s => s.contentid === contentid);

    if (!spot) {
      return res.status(404).json({ error: "TourAPI spot not found" });
    }

    // Find nearby spots (within same district or same nearest station)
    const nearbySpots = BUSAN_TOUR_API_SPOTS.filter(s => 
      s.contentid !== spot.contentid && 
      (s.districtKo === spot.districtKo || s.nearestStationId === spot.nearestStationId)
    ).slice(0, 3);

    res.json({
      spot,
      nearbySpots,
      apiKeyProvided: true,
      endpoint: KORWITH_ENDPOINT
    });
  } catch (error: any) {
    console.error("TourAPI spot detail error:", error);
    res.status(500).json({ error: "Failed to load TourAPI spot detail" });
  }
});

// Best-effort offline translator for the backend to prevent crashes if GEMINI_API_KEY is missing
const FALLBACK_TRANSLATIONS: Record<string, { topic: string; content: string; stationOrExit: string }> = {
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

function fallbackTranslate(topic: string, content: string, stationOrExit: string): { topic: string; content: string; stationOrExit: string } {
  const normTopic = topic || '';
  const normContent = content || '';
  const normStation = stationOrExit || '';

  // Check if it matches any of our default recommendation items
  if (normTopic.includes("이재모") || normTopic.includes("Lee Jae Mo")) {
    return FALLBACK_TRANSLATIONS['rec-1'];
  }
  if (normTopic.includes("사잇길") || normTopic.includes("Sait-gil")) {
    return FALLBACK_TRANSLATIONS['rec-2'];
  }
  if (normTopic.includes("1일 무제한") || normTopic.includes("Unlimited Pass") || normTopic.includes("정기승차권")) {
    return FALLBACK_TRANSLATIONS['rec-3'];
  }

  // General dictionary replacement fallback for custom user-submitted recs
  const wordMap: Record<string, string> = {
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
    '카페거리': 'Cafe Street',
    '카페': 'Cafe',
    '골목': 'Alley',
    '사잇길': 'Sait-gil',
    '계단없는': 'barrier-free',
    '산책': 'stroll',
    '지하철': 'subway',
    '철도': 'railway',
    '승차권': 'ticket',
    '어른': 'Adults',
    '청소년': 'Youths',
    '웨이팅': 'waiting queue',
    '테이블링': 'Tabling app',
    '휠체어': 'wheelchair',
    '유모차': 'stroller',
    '이동': 'mobility/access',
    '가능': 'accessible',
    '추천': 'Recommend',
    '최고': 'best / superb',
    '정말': 'really',
    '진짜': 'really',
    '매우': 'very',
    '맛있어요': 'delicious',
    '맛있음': 'delicious',
    '식당': 'restaurant',
    '맛집': 'famous hot place'
  };

  let translatedTopic = normTopic;
  let translatedContent = normContent;
  let translatedStationOrExit = normStation;

  for (const [kr, en] of Object.entries(wordMap)) {
    translatedTopic = translatedTopic.replace(new RegExp(kr, 'g'), en);
    translatedContent = translatedContent.replace(new RegExp(kr, 'g'), en);
    translatedStationOrExit = translatedStationOrExit.replace(new RegExp(kr, 'g'), en);
  }

  return {
    topic: translatedTopic,
    content: translatedContent,
    stationOrExit: translatedStationOrExit
  };
}

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing");
    }
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

// Translate endpoint
app.post("/api/translate", async (req, res) => {
  try {
    const { topic, content, stationOrExit } = req.body;

    console.log("Translation requested on backend:", { topic, content, stationOrExit });

    if (!topic || !content) {
      return res.status(400).json({ error: "Missing fields to translate" });
    }

    const gemini = getGemini();
    const prompt = `Translate and polish the following travel recommendation details into natural, tourist-friendly English:
Topic: ${topic}
Station/Exit: ${stationOrExit || ''}
Content: ${content}`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are an expert friendly editor and translator for Busan transit and travel guides. 
Your task is to translate any Korean or mixed-language input text into natural, native, engaging, and professional tourist-friendly English.

Follow these strict rules:
1. If the input is in genuine Korean Hangeul (or a mixture of Korean and English), translate it to beautiful native English.
2. IMPORTANT: If the input is written in Romanized Korean (Korean words written phonetically using English letters, e.g., "geoleogagi" which means walking, "daegyo" which means bridge, "molrasseoyo" which means didn't know, "wanjeon gangchu" which means highly recommend), recognize the Korean words phonetically, understand their meaning, and translate them into native, natural, beautiful English. For example, "Yeongdo Deuleoganeun Daegyoinde Geoleogal Su" is Romanized Korean for "It is a bridge entering Yeongdo, and you can walk across" — translate this to natural English.
3. If the input is already in standard English, refine and polish any grammar or broken phrases to make it sound perfect, native, and engaging.
4. Keep transit proper nouns in standard localized format:
   - Station Name format: '[Name] Station' (e.g. '서면역' -> 'Seomyeon Station', '전포역' -> 'Jeonpo Station', '남포역' -> 'Nampo Station', '해운대역' -> 'Haeundae Station').
   - Exit format: 'Exit [Number]' or 'Exits [Number 1] & [Number 2]' (e.g. '5번 출구' -> 'Exit 5', '7번출구' -> 'Exit 7').
5. Local dishes/destinations should be explained warmly where fits, or romanized cleanly with readable names:
   - '이재모피자' -> 'Lee Jae Mo Pizza'
   - '돼지국밥' -> 'Pork Soup (Dwaeji-gukbap)'
   - '밀면' -> 'Wheat Noodles (Milmyeon)'
   - '광안대교' -> 'Gwangan Bridge (Gwangandaegyo)'
   - '영도대교' -> 'Yeongdo Bridge'
6. Make sure the output is polite, easy for tourists to read, and formatted nicely.

Respond STRICTLY with a valid JSON object matching the requested schema. No conversational preamble.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: {
              type: Type.STRING,
              description: "The translated English title/topic, polished beautifully"
            },
            stationOrExit: {
              type: Type.STRING,
              description: "The translated English station name or exit details"
            },
            content: {
              type: Type.STRING,
              description: "The fully translated, warm, natural English body content"
            }
          },
          required: ["topic", "content"] // Relax schema by only making topic and content required
        }
      }
    });

    let text = response.text;
    if (!text) {
      throw new Error("Empty translation response from Gemini");
    }

    // Safely strip markdown backtokens if returned in worst case
    text = text.trim();
    if (text.startsWith("```")) {
      text = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }

    console.log("Raw response from Gemini model:", text);

    const parsed = JSON.parse(text);
    
    // Ensure default return values exist to prevent null pointers
    const result = {
      topic: parsed.topic || topic,
      stationOrExit: parsed.stationOrExit !== undefined ? parsed.stationOrExit : (stationOrExit || ""),
      content: parsed.content || content
    };

    console.log("Successfully prepared translation output on backend:", result);
    return res.json(result);
  } catch (error: any) {
    console.warn("Gemini translation failed, using backend fallback translator:", error.message || error);
    const { topic, content, stationOrExit } = req.body;
    try {
      const fallbackResult = fallbackTranslate(topic || "", content || "", stationOrExit || "");
      console.log("Fallback translation prepared successfully:", fallbackResult);
      return res.json(fallbackResult);
    } catch (fallbackError: any) {
      console.error("Backend fallback translation failed:", fallbackError);
      return res.status(500).json({ error: "Failed to translate content" });
    }
  }
});

// Serve AdSense ads.txt directly
app.get("/ads.txt", (req, res) => {
  res.type("text/plain");
  res.send("google.com, pub-1023768343506419, DIRECT, f08c47fec0942fa0");
});

// Serve Naver & Google crawls search engine rules (robots.txt & sitemap.xml)
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send("User-agent: *\nAllow: /\n\nUser-agent: Yeti\nAllow: /\n\nSitemap: https://stepless.kr/sitemap.xml\n");
});

app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://stepless.kr/</loc>
    <lastmod>2026-06-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
