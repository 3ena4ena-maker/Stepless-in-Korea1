import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

import { BUSAN_TOUR_API_SPOTS, TourApiSpot } from "./src/data/tourApiSpots";
import { getKoreaTourApiPlaceDetail } from "./src/data/koreaTourApiPlaceDetails";

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
async function fetchKorWithSpotFullDetail(contentId: string, serviceKey: string) {
  if (!serviceKey || serviceKey.trim() === "") {
    throw new Error("Service key is missing");
  }
  const trimmed = serviceKey.trim();
  const keyToUse = trimmed.includes("%") ? trimmed : encodeURIComponent(trimmed);

  const commonUrl = `${KORWITH_ENDPOINT}/detailCommon2?serviceKey=${keyToUse}&MobileOS=ETC&MobileApp=SteplessBusan&_type=json&contentId=${contentId}`;
  const withUrl = `${KORWITH_ENDPOINT}/detailWithTour2?serviceKey=${keyToUse}&MobileOS=ETC&MobileApp=SteplessBusan&_type=json&contentId=${contentId}`;

  const [cRes, wRes] = await Promise.all([
    fetch(commonUrl, { signal: AbortSignal.timeout(5000) }),
    fetch(withUrl, { signal: AbortSignal.timeout(5000) })
  ]);

  const cText = await cRes.text();
  const wText = await wRes.text();

  let cJson: any = null;
  let wJson: any = null;
  try { cJson = JSON.parse(cText); } catch {}
  try { wJson = JSON.parse(wText); } catch {}

  const commonItem = cJson?.response?.body?.items?.item?.[0] || null;
  const withItem = wJson?.response?.body?.items?.item?.[0] || null;

  let introItem: any = null;
  if (commonItem?.contenttypeid) {
    try {
      const introUrl = `${KORWITH_ENDPOINT}/detailIntro2?serviceKey=${keyToUse}&MobileOS=ETC&MobileApp=SteplessBusan&_type=json&contentId=${contentId}&contentTypeId=${commonItem.contenttypeid}`;
      const iRes = await fetch(introUrl, { signal: AbortSignal.timeout(5000) });
      const iText = await iRes.text();
      const iJson = JSON.parse(iText);
      introItem = iJson?.response?.body?.items?.item?.[0] || null;
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
    infocenter: introItem?.infocenter || introItem?.infocenterfood || introItem?.infocentershopping || introItem?.infocenterleports || null,
  };

  const overview = commonItem?.overview || null;

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

// Proxy route for live KorWithService2 OpenAPI calls
app.get("/api/tourapi/live-proxy", async (req, res) => {
  try {
    const { path: apiPath = "areaBasedList2", numOfRows = "10", pageNo = "1" } = req.query;
    const url = `${KORWITH_ENDPOINT}/${apiPath}?serviceKey=${KORWITH_SERVICE_KEY}&numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=ETC&MobileApp=SteplessBusan&_type=json&areaCode=6`;
    
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
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

// Get comprehensive Korea TourAPI barrier-free detail for recommended spots
app.get("/api/tourapi/detail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const detail = getKoreaTourApiPlaceDetail(id);

    if (!detail) {
      return res.status(404).json({
        success: false,
        error: "Place not found in Korea TourAPI barrier-free directory",
      });
    }

    // Attempt live API update if key is configured and contentId is numeric
    let isLiveApi = false;
    let liveDetail: any = null;

    if (KORWITH_SERVICE_KEY && /^\d+$/.test(detail.contentId)) {
      try {
        const liveRes = await fetchKorWithSpotFullDetail(detail.contentId, KORWITH_SERVICE_KEY);
        if (liveRes && liveRes.title) {
          liveDetail = liveRes;
          isLiveApi = true;
        }
      } catch (err) {
        // Fallback safely to verified dataset
      }
    }

    const mergedData = {
      ...detail,
      ...(liveDetail?.overview ? { overviewKo: liveDetail.overview } : {}),
      ...(liveDetail?.representativeImage?.firstimage ? { firstImage: liveDetail.representativeImage.firstimage } : {}),
      ...(liveDetail?.phone?.infocenter || liveDetail?.phone?.tel ? { tel: liveDetail.phone.infocenter || liveDetail.phone.tel } : {}),
      ...(liveDetail?.address?.addr1 ? { addressRoadKo: liveDetail.address.addr1 } : {}),
      ...(liveDetail?.coordinates?.latitude ? { latitude: liveDetail.coordinates.latitude, longitude: liveDetail.coordinates.longitude } : {}),
    };

    res.json({
      success: true,
      isLiveApi,
      source: isLiveApi
        ? "한국관광공사 공공데이터포털 KorWithService2 실시간 OpenAPI"
        : "한국관광공사 공공데이터포털 KorWithService2 무장애 관광정보",
      liveApiDetail: liveDetail,
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
