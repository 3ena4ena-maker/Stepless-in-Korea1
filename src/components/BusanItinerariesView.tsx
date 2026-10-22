/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  Info, 
  HelpCircle, 
  Compass, 
  ExternalLink,
  Bus,
  MapPin,
  Map,
  Train,
  Sunset,
  Coffee,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  Home,
  Utensils,
  BookOpen,
  MessageSquare,
  Music,
  Theater,
  Copy,
  Check,
  Users,
  Footprints,
  Building2,
  X,
  Star,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Landmark,
  Bike,
  Lightbulb,
  Store,
  Luggage,
  Phone
} from 'lucide-react';
import ElegantIllustration from './ElegantIllustration';
import { BUSAN_ITINERARIES, ItineraryCourse, ItineraryStep, getStepFoodCategories } from '../data/itineraries';
import { CHILD_TRANSPORT_INFOGRAPHIC_BASE64 } from '../childtransport_base64';
import { getTodayDate, navigateToSpa } from '../utils';
import { TourApiItineraryStepCard } from './TourApiItineraryStepCard';
import { matchTourApiSpotId, resolvePlaceTargetId } from '../services/tourApiCommon';
import { getKoreaTourApiPlaceDetail } from '../data/koreaTourApiPlaceDetails';
import { useMyRoute } from '../services/myRouteService';
import { lazyWithRetry } from '../utils/lazyWithRetry';

// Code-split heavy sub-views with auto-retry to prevent dynamic import failures
const BusanEventsCalendarView = lazyWithRetry(() => import('./BusanEventsCalendarView'));
const BarrierFreeTourApiView = lazyWithRetry(() => import('./BarrierFreeTourApiView'));
const CommunityTravelGuideSection = lazyWithRetry(() => import('./CommunityTravelGuideSection'));
const MyTravelRouteMapView = lazyWithRetry(() => import('./MyTravelRouteMapView'));

export const getStepIllustrationType = (titleKo: string, cat: string): 'temple' | 'park' | 'food' | 'cafe' | 'sea' | 'transit' | 'village' | 'history' | 'culture' | 'default' => {
  const normalized = titleKo.toLowerCase();
  if (normalized.includes('절') || normalized.includes('범어사') || normalized.includes('석불사') || normalized.includes('사찰') || normalized.includes('용궁사')) return 'temple';
  if (normalized.includes('공원') || normalized.includes('대숲') || normalized.includes('생태') || normalized.includes('유원지') || normalized.includes('수목원') || normalized.includes('숲')) return 'park';
  if (normalized.includes('식당') || normalized.includes('음식') || normalized.includes('국밥') || normalized.includes('파전') || normalized.includes('불고기') || normalized.includes('시장') || normalized.includes('먹거리') || normalized.includes('식도락') || normalized.includes('밀면') || normalized.includes('갈비') || normalized.includes('미식') || normalized.includes('낙지') || normalized.includes('안목') || normalized.includes('옥생관')) return 'food';
  if (normalized.includes('카페') || normalized.includes('커피') || normalized.includes('디저트')) return 'cafe';
  if (normalized.includes('바다') || normalized.includes('해변') || normalized.includes('해운대') || normalized.includes('광안리') || normalized.includes('송도') || normalized.includes('해상') || normalized.includes('수변') || normalized.includes('스카이워크') || normalized.includes('전망대') || normalized.includes('포구') || normalized.includes('선착장')) return 'sea';
  if (normalized.includes('열차') || normalized.includes('철도') || normalized.includes('모노레일') || normalized.includes('지하철') || normalized.includes('정거장') || normalized.includes('리프트') || normalized.includes('케이블카') || normalized.includes('패스')) return 'transit';
  if (normalized.includes('마을') || normalized.includes('레고') || normalized.includes('감천') || normalized.includes('동네') || normalized.includes('주택') || normalized.includes('흰여울')) return 'village';
  if (normalized.includes('역사') || normalized.includes('기념관') || normalized.includes('박물관') || normalized.includes('피난') || normalized.includes('임시수도') || normalized.includes('문화재')) return 'history';
  if (normalized.includes('문화') || normalized.includes('회관') || normalized.includes('전시') || normalized.includes('미술관') || normalized.includes('공연')) return 'culture';
  
  if (cat === 'GOURMET') return 'food';
  if (cat === 'HISTORY') return 'history';
  if (cat === '1NIGHT') return 'sea';
  if (cat === '2NIGHTS') return 'sea';
  if (cat === '3NIGHTS') return 'park';
  return 'default';
};

export const MapAppIcons: React.FC<{ naverUrl?: string; googleUrl?: string; title?: string }> = ({ naverUrl, googleUrl, title }) => (
  <div className="inline-flex items-center gap-1.5 shrink-0 align-middle">
    {naverUrl && (
      <a
        href={naverUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="w-6 h-6 rounded-[7px] bg-[#03C75A] hover:bg-[#02b350] flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
        title={title ? `${title} 네이버지도에서 위치 보기` : '네이버지도에서 위치 보기'}
        aria-label="Naver Map"
      >
        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
          <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
        </svg>
      </a>
    )}
    {googleUrl && (
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="w-6 h-6 rounded-[7px] bg-white border border-[#E2DFD8] hover:border-[#4285F4]/50 flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
        title={title ? `${title} 구글맵에서 위치 보기` : '구글맵에서 위치 보기'}
        aria-label="Google Maps"
      >
        <svg viewBox="0 0 92 135" className="w-2.5 h-3.5" fill="none">
          <path d="M46 0C20.596 0 0 20.596 0 46c0 34.5 46 89 46 89s46-54.5 46-89C92 20.596 71.404 0 46 0z" fill="#4285F4"/>
          <path d="M46 0c-25.404 0-46 20.596-46 46 0 11.233 4.025 21.528 10.72 29.5L46 46V0z" fill="#EA4335"/>
          <path d="M46 46l35.28 29.5C87.975 67.528 92 57.233 92 46c0-25.404-20.596-46-46-46v46z" fill="#FBBC04"/>
          <path d="M46 46v89s24.62-29.215 37.8-57.5L46 46z" fill="#34A853"/>
          <circle cx="46" cy="46" r="18" fill="#FFFFFF"/>
        </svg>
      </a>
    )}
  </div>
);




export const KOREAN_CHEAT_CODES = [
  { kr: '안녕하세요', en: 'Hello', sound: 'Onion Hot Sale', action: 'really fast' },
  { kr: '감사합니다', en: 'Thank you', sound: 'Come Some Duh', action: 'really fast' },
  { kr: '죄송해요', en: 'Sorry', sound: 'Joy Song Hey Yo', action: 'really fast' },
  { kr: '지나갈게요', en: 'Excuse me, coming through', sound: 'Jams Man Yo~', action: 'with a little bow' },
  { kr: '주세요', en: 'Please / Give me', sound: 'Juicy Yo!', action: 'with your hand out' },
  { kr: '어디예요?', en: 'Where is it?', sound: 'Oh, D.E. Yo?', action: 'while looking around' },
  { kr: '얼마예요?', en: 'How much is it?', sound: 'All My Yo?', action: 'while counting money' },
  { kr: '물 주세요', en: 'Water, please', sound: 'More, Juicy Yo!', action: 'while pretending to drink' },
  { kr: '도와주세요', en: 'Help me', sound: 'Do I Juicy Yo?', action: 'with both hands reaching out' },
  { kr: '진짜요?', en: 'Really?', sound: 'Jean, Cha Yo?', action: 'with a surprised face' },
  { kr: '대박!', en: 'Amazing! / No way!', sound: 'Day Back!', action: 'while stepping back dramatically' },
  { kr: '좋아요', en: 'I like it / Sounds good', sound: 'Joe Are Yo', action: 'with a thumbs-up' },
];

type CategoryType = 'DAY' | '1NIGHT' | '2NIGHTS' | '3NIGHTS' | '4NIGHTS' | 'GOURMET' | 'MARKET' | 'SCHEDULE' | 'EXPERIENCE' | 'SUBWAY' | 'BARRIER_FREE' | 'ATTRACTION' | 'MY_ROUTE';

export type TopCategoryType = 'GOURMET' | 'MARKET' | 'SCHEDULE' | 'EXPERIENCE' | 'SUBWAY' | 'BARRIER_FREE' | 'ATTRACTION';
export type ScheduleDurationType = 'DAY' | '1NIGHT' | '2NIGHTS' | '3NIGHTS' | '4NIGHTS';

interface BusanItinerariesViewProps {
  language: 'KR' | 'EN';
  initialCategory?: CategoryType | null;
  onBack?: () => void;
  onSelectCategory?: (category: CategoryType | null) => void;
  tipsSubPage?: 'index' | 'courses' | 'transit' | 'child-free' | 'bus-qr' | 'transfer' | 'taxi' | 'schedule' | 'community' | 'exploration';
  setTipsSubPage?: (page: 'index' | 'courses' | 'transit' | 'child-free' | 'bus-qr' | 'transfer' | 'taxi' | 'schedule' | 'community' | 'exploration') => void;
  activeRegionPage?: 'LINE1' | 'LINE2' | null;
  setActiveRegionPage?: (region: 'LINE1' | 'LINE2' | null) => void;
  onSelectStation?: (stationId: string, exitNum?: string) => void;
  initialBarrierFreeCourseId?: string | null;
  initialBarrierFreePlaceId?: string | null;
  onOpenBarrierFreeDetail?: (placeId: string) => void;
  onBackToBarrierFreeList?: () => void;
  initialExplorationItemId?: string | null;
  onSelectExplorationItem?: (itemId: string | null) => void;
}

interface CategoryConfig {
  id: CategoryType;
  icon: string;
  tagKo: string;
  tagEn: string;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

interface QuizQuestion {
  questionKo: string;
  questionEn: string;
  options: {
    type: 'A' | 'B';
    textKo: string;
    textEn: string;
    icon: string;
  }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    questionKo: "Q1. 부산에 도착하자마자 가장 먼저 보고 싶은 풍경은? 🌊",
    questionEn: "Q1. What is the first scenery you want to see when you arrive in Busan? 🌊",
    options: [
      {
        type: 'A',
        textKo: "탁 트인 끝없는 바다와 세련된 해안선, 모래사장",
        textEn: "Vast, endless blue sea, sophisticated coastlines, and sandy beaches",
        icon: "🌊"
      },
      {
        type: 'B',
        textKo: "아기자기하고 알록달록한 골목길이나 활기 넘치는 전통시장",
        textEn: "Charming, colorful alleys or lively traditional markets",
        icon: "🏡"
      }
    ]
  },
  {
    questionKo: "Q2. 여행 중 '음식'을 선택할 때 나의 기준은? 🍲",
    questionEn: "Q2. What is your standard for choosing food during the trip? 🍲",
    options: [
      {
        type: 'A',
        textKo: "멋진 바다 뷰가 펼쳐지는 통창 레스토랑이나 인스타 감성 브런치 카페",
        textEn: "Open ocean view glass restaurants or Instagram-worthy brunch cafes",
        icon: "🍽️"
      },
      {
        type: 'B',
        textKo: "줄을 서서 기다리더라도 현지인들이 적극 추천하는 노포나 시장 맛집",
        textEn: "Traditional local diners or busy street market eateries even with short wait times",
        icon: "🍲"
      }
    ]
  },
  {
    questionKo: "Q3. 내가 선호하는 여행의 '속도'는? ☕",
    questionEn: "Q3. What is your preferred speed of travel? ☕",
    options: [
      {
        type: 'A',
        textKo: "오션뷰 카페에 오래 앉아 바다를 멍하니 바라보거나 해변을 거니는 여유로운 휴식",
        textEn: "Relaxing in an ocean-view cafe staring blankly at waves or leisurely strolling the sands",
        icon: "☕"
      },
      {
        type: 'B',
        textKo: "“여기까지 왔는데 다 가봐야지!” 유명 명소들을 알차게 도는 부지런한 관광",
        textEn: "Active sightseeing packing all popular hotspots since we are already here!",
        icon: "🏃"
      }
    ]
  },
  {
    questionKo: "Q4. 하루를 마무리할 숙소를 정한다면 어디가 좋을까? 🏨",
    questionEn: "Q4. Where is your perfect lodging to wrap up the day? 🏨",
    options: [
      {
        type: 'A',
        textKo: "화려한 도시 야경과 세련된 스파 시설을 갖춘 고층 호텔/레지던스",
        textEn: "A high-rise luxury hotel or residence with stellar city night views and fancy spa facilities",
        icon: "🏨"
      },
      {
        type: 'B',
        textKo: "부산 특유의 감성이 묻어나는 아기자기한 골목이나 바다 바로 앞 에어비앤비",
        textEn: "A cozy Airbnb in traditional alleys or right in front of the local sea reflecting Busan vibes",
        icon: "🏠"
      }
    ]
  },
  {
    questionKo: "Q5. 이번 여행에서 꼭 남기고 싶은 '인생샷'의 느낌은? 📸",
    questionEn: "Q5. What vibe do you want for your best photo memories? 📸",
    options: [
      {
        type: 'A',
        textKo: "세련된 마천루를 배경으로 한 도회적이고 고급스러운 분위기",
        textEn: "A sophisticated, high-class urban look backed by dazzling high-rise skyscrapers",
        icon: "✨"
      },
      {
        type: 'B',
        textKo: "부산만의 따뜻한 아날로그 감성과 자연스러움이 가득한 정겨운 분위기",
        textEn: "A warm, heartwarming retro look filled with Busan's unique analog feelings",
        icon: "📷"
      }
    ]
  },
  {
    questionKo: "Q6. 여행지에서 가장 선호하는 이동 수단은? 🚗",
    questionEn: "Q6. What is your preferred method of transportation? 🚗",
    options: [
      {
        type: 'A',
        textKo: "무더위나 피로 없이 시원하고 편리하게 이동할 수 있는 택시나 렌터카",
        textEn: "A comfortable taxi or rental car to move around easily without heat or leg fatigue",
        icon: "🚗"
      },
      {
        type: 'B',
        textKo: "버스나 지하철을 타고 현지 분위기를 느끼며 걷는 도보 여행",
        textEn: "A walking tour utilizing local buses and subways to immerse in local atmosphere",
        icon: "👟"
      }
    ]
  },
  {
    questionKo: "Q7. 부산에서 꼭 해보고 싶은 대표 체험은? ⛵",
    questionEn: "Q7. What signature experience is a must-do in Busan? ⛵",
    options: [
      {
        type: 'A',
        textKo: "화려한 요트 투어나 백화점 쇼핑, 프라이빗 스파/호캉스",
        textEn: "Glamorous sunset yacht cruises, department store shopping, or a private hotel staycation",
        icon: "⛵"
      },
      {
        type: 'B',
        textKo: "해변 열차(캡슐 열차) 탑승, 가파른 해안 산책로 트레킹, 야시장 투어",
        textEn: "Riding coastal beach trains/capsules, coast trail walks, or traditional night market foodie tours",
        icon: "🚂"
      }
    ]
  }
];

interface RegionDetail {
  id: 'LINE1' | 'LINE2';
  nameKo: string;
  nameEn: string;
  color: string;
  badgeColor: string;
  descKo: string;
  descEn: string;
  landmarks: {
    nameKo: string;
    nameEn: string;
    descKo: string;
    descEn: string;
    category?: 'LANDMARK' | 'FOOD' | 'CAFE' | 'CULTURE';
    stationGroup: string;
    stationGroupNameKo: string;
    stationGroupNameEn: string;
    tagKo: string;
    tagEn: string;
    addressKo?: string;
    addressEn?: string;
    tipKo?: string;
    tipEn?: string;
    imageUrl?: string;
    isTourApi?: boolean;
  }[];
}

const REGION_RECOMMENDATIONS: RegionDetail[] = [
  {
    id: 'LINE1',
    nameKo: '1호선 라인 (노포역 ↔ 다대포해수욕장역)',
    nameEn: 'Line 1 Line (Nopo Stn ↔ Dadaepo Beach Stn)',
    color: 'bg-orange-500',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-200',
    descKo: '1호선(노포역 ↔ 다대포해수욕장역, 총 40개 역 39.9km 축)을 따라 펼쳐지는 부산 대표 여행 스팟 (다대포 해수욕장, 자갈치시장, 흰여울문화마을, 허심청, 온천천, 범어사, 부전시장 등).',
    descEn: 'Connecting Busan north-to-south along Line 1 (40 stations, 39.9km): Dadaepo Beach, Jagalchi Market, Huinnyeoul Village, Heosimcheong Spa, Oncheoncheon Stream, Beomeosa, Bujeon Market, etc.',
    landmarks: [
      {
        nameKo: '흰여울문화마을',
        nameEn: 'Huinnyeoul Culture Village',
        descKo: '영도 해안 절벽을 마주한 파스텔톤 가옥과 예쁜 카페들이 늘어서 산책하며 푸른 바다를 내려다볼 수 있습니다. (남포역 또는 자갈치역에서 시내버스로 환승)',
        descEn: 'A gorgeous cliffside alleyway on Yeongdo Island overlooking beautiful blue oceanic channels. (Transfer to bus from Nampo or Jagalchi Stn).',
        category: 'LANDMARK',
        stationGroup: 'LINE1_JUNGANG_NAMPO_JAGALCHI',
        stationGroupNameKo: '중앙역 · 남포역 · 자갈치역',
        stationGroupNameEn: 'Jungang · Nampo · Jagalchi',
        tagKo: '남포/자갈치역 → 버스 환승',
        tagEn: 'Bus Transfer via Nampo/Jagalchi',
        addressKo: '부산 영도구 영선동4가',
        addressEn: 'Yeongseon-dong 4-ga, Yeongdo-gu, Busan',
        tipKo: '남포역 7번 출구 또는 자갈치역 3번 출구 정류장에서 영도 방향 시내버스(7, 71, 508번 등)로 환승하세요.',
        tipEn: 'Transfer to city bus (#7, #71, or #508) heading to Yeongdo from Nampo Station Exit 7 or Jagalchi Station Exit 3.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/23/4111423_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '부산영화체험박물관',
        nameEn: 'Busan Museum of Movies',
        descKo: '영화의 도시 부산에 세워진 국내 최초의 체험형 영화 박물관으로 영화 원리와 제작 체험, 영화 트릭아트를 흥미롭게 관람할 수 있습니다.',
        descEn: 'Korea’s first interactive film museum featuring hands-on movie production tricks, green screen dubbing, and exhibits.',
        category: 'CULTURE',
        stationGroup: 'LINE1_JUNGANG_NAMPO_JAGALCHI',
        stationGroupNameKo: '중앙역 · 남포역 · 자갈치역',
        stationGroupNameEn: 'Jungang · Nampo · Jagalchi',
        tagKo: '중앙역 5번출구 : 계단',
        tagEn: 'Jungang Stn Exit 5 (Stairs)',
        addressKo: '부산 중구 대청로126번길 12',
        addressEn: '12, Daecheong-ro 126beon-gil, Jung-gu, Busan',
        tipKo: '중앙역 5번 출구(계단)에서 도보 약 5분 거리에 위치하고 있으며 트릭아이 뮤지엄과 함께 관람하기 좋습니다.',
        tipEn: '5-minute walk from Jungang Station Exit 5 (stairs).',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/19/3539019_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '부산근현대역사관',
        nameEn: 'Busan Museum of Modern History',
        descKo: '근대 및 현대 부산의 일상 문화와 역사적 흐름을 감각적인 전시와 라운지 도서관 형식으로 살려낸 복합 문화 공간입니다.',
        descEn: 'A dynamic cultural venue housed in a historical building displaying Busan’s modern history and lifestyle.',
        category: 'CULTURE',
        stationGroup: 'LINE1_JUNGANG_NAMPO_JAGALCHI',
        stationGroupNameKo: '중앙역 · 남포역 · 자갈치역',
        stationGroupNameEn: 'Jungang · Nampo · Jagalchi',
        tagKo: '중앙역 5번출구 : 계단',
        tagEn: 'Jungang Stn Exit 5 (Stairs)',
        addressKo: '부산 중구 대청로 104',
        addressEn: '104, Daecheong-ro, Jung-gu, Busan',
        tipKo: '중앙역 5번 출구(계단)에서 직진하여 대청로 사거리 방향으로 올라오시면 편리하게 방문 가능합니다.',
        tipEn: 'Accessible straight from Jungang Station Exit 5 (stairs).',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/02/4113502_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '용두산공원',
        nameEn: 'Yongdusan Park',
        descKo: '부산 도심 중심부에 우뚝 솟은 산상 공원으로, 부산타워와 함께 남포동 및 부산항 전경을 한눈에 내려다볼 수 있습니다.',
        descEn: 'An iconic hill park centering Busan Tower with sweeping views of Busan Port and Nampo district.',
        category: 'LANDMARK',
        stationGroup: 'LINE1_JUNGANG_NAMPO_JAGALCHI',
        stationGroupNameKo: '중앙역 · 남포역 · 자갈치역',
        stationGroupNameEn: 'Jungang · Nampo · Jagalchi',
        tagKo: '중앙역 5번출구 / 남포역 7번출구',
        tagEn: 'Jungang Exit 5 / Nampo Exit 7',
        addressKo: '부산 중구 용두산길 37',
        addressEn: '37, Yongdusan-gil, Jung-gu, Busan',
        tipKo: '중앙역 5번 출구 이용 시 계단 산책로로 올라가며, 남포역 7번 출구 이용 시 광복로 에스컬레이터/엘리베이터로 편하게 진입 가능합니다.',
        tipEn: 'Use Jungang Stn Exit 5 for stairs, or Nampo Stn Exit 7 for the Gwangbok-ro covered escalator & elevator.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/34/3494834_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: 'BIFF광장 길거리음식',
        nameEn: 'BIFF Square Street Food',
        descKo: '부산 국제영화제의 모태이자 명물 씨앗호떡, 비빔당면, 물떡 등 다채로운 로컬 길거리 음식이 가득한 거리입니다.',
        descEn: 'The birthplace of Busan International Film Festival, world-famous for seed hotteok and street food stalls.',
        category: 'FOOD',
        stationGroup: 'LINE1_JUNGANG_NAMPO_JAGALCHI',
        stationGroupNameKo: '중앙역 · 남포역 · 자갈치역',
        stationGroupNameEn: 'Jungang · Nampo · Jagalchi',
        tagKo: '자갈치역 3번출구',
        tagEn: 'Jagalchi Stn Exit 3',
        addressKo: '부산 중구 구덕로 58-1',
        addressEn: '58-1, Gudeok-ro, Jung-gu, Busan',
        tipKo: '자갈치역 3번 출구로 나오면 도보 1분 거리에서 따끈한 씨앗호떡과 다양한 핑거 푸드를 바로 만나볼 수 있습니다.',
        tipEn: 'Located 1 minute walk from Jagalchi Station Exit 3.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/19/3493419_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '국제시장 & 부평깡통시장',
        nameEn: 'Gukje Market & Bupyeong Market',
        descKo: '한국전쟁의 역사를 품은 전통 대형 시장으로 아기자기한 수입 잡화 및 밤마다 열리는 부평깡통야시장 먹거리가 유명합니다.',
        descEn: 'Historic sprawling market precinct brimming with vintage goods, local clothing, and night market food stalls.',
        category: 'LANDMARK',
        stationGroup: 'LINE1_JUNGANG_NAMPO_JAGALCHI',
        stationGroupNameKo: '중앙역 · 남포역 · 자갈치역',
        stationGroupNameEn: 'Jungang · Nampo · Jagalchi',
        tagKo: '자갈치역 3번출구',
        tagEn: 'Jagalchi Stn Exit 3',
        addressKo: '부산 중구 중구로 36',
        addressEn: '36, Junggu-ro, Jung-gu, Busan',
        tipKo: '자갈치역 3번 출구에서 진입 가능하며, 저녁 시간대 부평깡통야시장의 이색 먹거리를 꼭 맛보세요.',
        tipEn: 'Accessible via Jagalchi Stn Exit 3. Night market opens every evening.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/70/3561970_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '자갈치시장',
        nameEn: 'Jagalchi Traditional Market',
        descKo: '대한민국 최대 규모의 수산시장으로 활기찬 부산 어민들의 삶과 갓 잡은 싱싱한 수산물을 만날 수 있는 곳입니다.',
        descEn: 'Korea’s largest seafood market, showcasing bustling traditional stalls and delicious fresh fish.',
        category: 'LANDMARK',
        stationGroup: 'LINE1_JUNGANG_NAMPO_JAGALCHI',
        stationGroupNameKo: '중앙역 · 남포역 · 자갈치역',
        stationGroupNameEn: 'Jungang · Nampo · Jagalchi',
        tagKo: '자갈치역 3번출구',
        tagEn: 'Jagalchi Stn Exit 3',
        addressKo: '부산 중구 자갈치해안로 52',
        addressEn: '52, Jagalchihaean-ro, Jung-gu, Busan',
        tipKo: '자갈치역 3번 출구에서 해안가 방향으로 도보 3분. 현대식 본관 7층 테라스 오션뷰도 무료로 관람해 보세요.',
        tipEn: '3 mins walk towards the harbor from Jagalchi Stn Exit 3. Visit 7F observatory deck for free.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource_photo/05/4108305_image2_1.JPG',
        isTourApi: true
      },
      {
        nameKo: '광복로 차없는 거리',
        nameEn: 'Gwangbok-ro Pedestrian Street',
        descKo: '남포동의 대표 패션, 쇼핑, 이색 카페 및 트렌디한 브랜드 상점들이 한곳에 모여 있는 활기찬 문화 거리입니다.',
        descEn: 'Vibrant main shopping avenue packed with fashion boutiques, flagship stores, and cafes.',
        category: 'LANDMARK',
        stationGroup: 'LINE1_JUNGANG_NAMPO_JAGALCHI',
        stationGroupNameKo: '중앙역 · 남포역 · 자갈치역',
        stationGroupNameEn: 'Jungang · Nampo · Jagalchi',
        tagKo: '남포역 7번출구',
        tagEn: 'Nampo Stn Exit 7',
        addressKo: '부산 중구 광복로',
        addressEn: 'Gwangbok-ro, Jung-gu, Busan',
        tipKo: '남포역 7번 출구로 나오면 바로 연결되며, 주말 및 공휴일에는 차없는 거리로 여유롭게 도보 쇼핑을 즐길 수 있습니다.',
        tipEn: 'Directly outside Nampo Station Exit 7. Car-free pedestrian street on weekends.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/11/3049611_image2_1.JPG',
        isTourApi: true
      },
      {
        nameKo: '허심청 (호텔농심)',
        nameEn: 'Heosimcheong Spa (Hotel Nongshim)',
        descKo: '호텔농심 내에 위치한 동양 최대 규모의 천연 온천 건강랜드로, 40여 종의 다양한 효능별 온천탕과 대형 찜질시설을 갖춘 힐링 온천 체험 명소입니다.',
        descEn: 'Asia’s largest natural hot spring spa located inside Hotel Nongshim, featuring over 40 therapeutic mineral baths, cave baths, and expansive sauna facilities.',
        category: 'LANDMARK',
        stationGroup: 'LINE1_ONCHEONJANG',
        stationGroupNameKo: '온천장역',
        stationGroupNameEn: 'Oncheonjang Stn',
        tagKo: '호텔농심 내 도심 온천',
        tagEn: 'Hot Spring Spa in Hotel Nongshim',
        addressKo: '부산 동래구 온천장로107번길 32 호텔농심',
        addressEn: 'Hotel Nongshim, 32, Oncheonjang-ro 107beon-gil, Dongnae-gu, Busan',
        tipKo: '온천장역 1번 출구에서 육교 엘리베이터를 이용해 평지로 도보 약 5분 이동 가능하며 농심호텔 단지 내에 위치해 있습니다.',
        tipEn: '5 mins walk from Oncheonjang Stn Exit 1 elevator, located inside Hotel Nongshim complex.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/37/4090237_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '온천천 (벚꽃시즌)',
        nameEn: 'Oncheoncheon Stream (Cherry Blossom)',
        descKo: '도심 속을 길게 관통하는 생태 수변 산책로로, 봄철 벚꽃 터널과 아기자기한 동네 카페 거리가 늘어서 사계절 산책하기 좋습니다.',
        descEn: 'A beautiful riverside path winding through Dongnae, lined with charming local cafes and cherry blossom trees.',
        category: 'LANDMARK',
        stationGroup: 'LINE1_ONCHEONJANG',
        stationGroupNameKo: '온천장역',
        stationGroupNameEn: 'Oncheonjang Stn',
        tagKo: '벚꽃시즌 수변 산책',
        tagEn: 'Cherry Blossom Stream',
        addressKo: '부산 동래구 온천천로',
        addressEn: 'Oncheoncheon-ro, Dongnae-gu, Busan',
        tipKo: '봄철 벚꽃 산책로는 완전 평지로 포장되어 여유롭게 도보 산책이나 자전거 라이딩을 즐기기에 최고입니다.',
        tipEn: 'Flat and easily walkable paved boardwalk ideal for cherry blossom strolls.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/33/2822333_image2_1.png',
        isTourApi: true
      },
      {
        nameKo: '범어사',
        nameEn: 'Beomeosa Temple',
        descKo: '계곡물 소리와 피톤치드 향이 가득한 힐링 천년 고찰로, 금정산 자락 울창한 소나무 숲속에서 맑은 기운을 만끽할 수 있습니다.',
        descEn: 'A tranquil thousand-year-old Buddhist sanctuary cradled in a dense pine forest with peaceful mountain streams.',
        category: 'LANDMARK',
        stationGroup: 'LINE1_BEOMEOSA',
        stationGroupNameKo: '범어사역',
        stationGroupNameEn: 'Beomeosa Stn',
        tagKo: '범어사역 5번출구 → 버스 90번',
        tagEn: 'Beomeosa Stn Exit 5 → Bus #90',
        addressKo: '부산 금정구 범어사로 250',
        addressEn: '250, Beomeosa-ro, Geumjeong-gu, Busan',
        tipKo: '범어사역 5번 출구로 나와 90번 버스로 환승하면 범어사 입구까지 편리하게 올라갈 수 있습니다.',
        tipEn: 'Take Bus #90 from Beomeosa Station Exit 5 directly to the temple entrance.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/92/3561492_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '범어사 성보박물관',
        nameEn: 'Beomeosa Seongbo Museum',
        descKo: '범어사가 소장한 국보 및 보물급 불교 문화재와 역사 유물을 보존 및 전시하는 전문 불교 박물관입니다.',
        descEn: 'A Buddhist museum displaying precious national treasures, buddhist paintings, and relics.',
        category: 'CULTURE',
        stationGroup: 'LINE1_BEOMEOSA',
        stationGroupNameKo: '범어사역',
        stationGroupNameEn: 'Beomeosa Stn',
        tagKo: '범어사역 5번출구 → 버스 90번',
        tagEn: 'Beomeosa Stn Exit 5 → Bus #90',
        addressKo: '부산 금정구 범어사로 250',
        addressEn: '250, Beomeosa-ro, Geumjeong-gu, Busan',
        tipKo: '범어사 진입로에 위치하여 90번 버스 이용 시 범어사 참배와 함께 함께 둘러보기 좋습니다.',
        tipEn: 'Located along the main approach road to Beomeosa Temple.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/18/3342818_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '금정문화회관',
        nameEn: 'Geumjeong Cultural Center',
        descKo: '금정구 지역 예술 문화의 거점으로 국내외 우수 연주단체의 클래식 오케스트라와 지역 작가들의 시각 미술 전시가 다채롭게 펼쳐집니다.',
        descEn: 'The cultural heartbeat of Geumjeong, staging world-class classic concerts and monthly local art exhibitions.',
        category: 'CULTURE',
        stationGroup: 'LINE1_BEOMEOSA',
        stationGroupNameKo: '범어사역',
        stationGroupNameEn: 'Beomeosa Stn',
        tagKo: '오케스트라·미술전',
        tagEn: 'Fine Art Gallery',
        addressKo: '부산 금정구 체육공원로 7',
        addressEn: '7, Cheyukgongwon-ro, Geumjeong-gu, Busan',
        tipKo: '차량 이용 시 주차 정산 시스템이 잘 되어 있고, 금정구청 바로 옆이라 대중교통 노선 연계성도 아주 양호합니다.',
        tipEn: 'Conveniently located near Geumjeong-gu Office with superb accessibility by city buses.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/52/3336552_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '다대포 해수욕장 & 고우니 생태길',
        nameEn: 'Dadaepo Beach & Gouny Eco Trail',
        descKo: '끝없는 모래사장과 완벽한 평지 데크 보도가 어우러진 해질녘 최고의 노을 명소입니다.',
        descEn: 'One of Koreas absolute best sunset spots featuring barrier-free wooden wetland boardwalks.',
        category: 'LANDMARK',
        stationGroup: 'LINE1_DADAEPO',
        stationGroupNameKo: '다대포해수욕장역',
        stationGroupNameEn: 'Dadaepo Beach Stn',
        tagKo: '일몰·낙조',
        tagEn: 'Sunset',
        addressKo: '부산 사하구 다대동 (다대포해수욕장역 1번 출구)',
        addressEn: 'Dadae-dong, Saha-gu, Busan (Exit 1)',
        tipKo: '해 질 무렵 생태길 중간 전망대에 서면 바다와 억새가 노을에 붉게 물드는 장관을 찍을 수 있습니다.',
        tipEn: 'Arrive 30 minutes before sunset to capture the reeds turning crimson red.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/15/3497115_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '다대포 꿈의 낙조분수',
        nameEn: 'Dadaepo Sunset Fountain of Dreams',
        descKo: '지름 60m에 달하는 초대형 원형 바닥 음악 분수로, 밤마다 화려한 레이저 조명과 고압 물줄기가 음악에 맞춰 춤을 춥니다.',
        descEn: 'The world-famous massive musical fountain dancing to dynamic lasers and water pressure under night skies.',
        category: 'CULTURE',
        stationGroup: 'LINE1_DADAEPO',
        stationGroupNameKo: '다대포해수욕장역',
        stationGroupNameEn: 'Dadaepo Beach Stn',
        tagKo: '화려한 분수 쇼',
        tagEn: 'Music Fountain',
        addressKo: '부산 사하구 다대강변대로 14 (다대포해수욕장역 1,2번 출구)',
        addressEn: '14, Dadaegangbyun-daero, Saha-gu, Busan',
        tipKo: '봄부터 가을까지 매일 저녁 상설 무료 분수 공연이 펼쳐지니 정확한 회차 시간을 확인하세요.',
        tipEn: 'Shows run nightly from spring to autumn for free. Check weekly show schedules online.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/08/3506208_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '초량 이바구길 & 168계단 모노레일',
        nameEn: 'Choryang Ibagu-gil & 168 Stairs Monorail',
        descKo: '부산 원도심의 근현대 역사와 피란민의 삶을 품은 골목길로, 168계단을 편안하게 오를 수 있는 무료 모노레일과 전망대가 조성되어 있습니다.',
        descEn: 'A historic hillside trail showcasing Busan’s modern history, featuring a free monorail up the steep 168 stairs with panoramic harbor views.',
        category: 'LANDMARK',
        stationGroup: 'LINE1_BUSAN_STN',
        stationGroupNameKo: '부산역',
        stationGroupNameEn: 'Busan Station',
        tagKo: '부산역 7번출구 도보 7분',
        tagEn: 'Busan Stn Exit 7 (7-min walk)',
        addressKo: '부산 동구 초량상로 49',
        addressEn: '49, Choryangsang-ro, Dong-gu, Busan',
        tipKo: '168계단 무료 모노레일을 탑승하면 계단 없이 전망대까지 오를 수 있으며, 부산항과 부산역 전경이 한눈에 펼쳐집니다.',
        tipEn: 'Ride the free monorail to bypass the stairs and take in sweeping views of Busan Port.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/42/3496842_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '국립해양박물관',
        nameEn: 'National Maritime Museum',
        descKo: '영도 해안가에 세워진 거대한 물방울 모양의 국립 박물관으로, 해양 역사 전시와 원통형 대형 아쿠아리움을 무료 관람합니다.',
        descEn: 'A free-entry iconic maritime museum shaped like a water droplet, complete with a beautiful cylindrical fish tank.',
        category: 'CULTURE',
        stationGroup: 'LINE1_BUSAN_STN',
        stationGroupNameKo: '부산역',
        stationGroupNameEn: 'Busan Station',
        tagKo: '부산역 7번출구 → 버스 66번',
        tagEn: 'Busan Stn Exit 7 → Bus #66',
        addressKo: '부산 영도구 해양로301번길 45',
        addressEn: '45, Haeyang-ro 301beon-gil, Yeongdo-gu, Busan',
        tipKo: '부산역 7번 출구 정류장에서 66번 버스를 타시면 박물관 정문 바로 앞까지 이동하며, 휠체어와 유모차 전 구역 평탄 진입이 가능합니다.',
        tipEn: 'Take Bus #66 from Busan Station Exit 7 directly to the museum gate. Completely step-free.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/50/4111450_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '부전시장',
        nameEn: 'Bujeon Traditional Market',
        descKo: '부산 최대 규모의 종합 전통시장으로, 신선한 수산물과 청과, 건어물 및 줄 서서 먹는 즉석 명란김밥과 수제 어묵 등 서민 미식이 가득합니다.',
        descEn: 'Busan’s largest traditional market complex packed with fresh produce, dried seafood, and famous local street foods like pollack roe gimbap.',
        category: 'FOOD',
        stationGroup: 'LINE1_SEOMYEON_BUJEON',
        stationGroupNameKo: '서면역 · 부전역',
        stationGroupNameEn: 'Seomyeon · Bujeon',
        tagKo: '부전역 1번출구 바로 앞',
        tagEn: 'Bujeon Stn Exit 1 (Immediate)',
        addressKo: '부산 부산진구 중앙대로783번길 23',
        addressEn: '23, Jungang-daero 783beon-gil, Busanjin-gu, Busan',
        tipKo: '부전역 1번 출구에서 평지로 곧장 연결되며, 따끈한 수제 어묵과 푸짐한 명란김밥은 필수 코스입니다.',
        tipEn: 'Direct flat connection from Bujeon Station Exit 1. Try handmade fish cakes and gimbap.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/04/3070904_image2_1.JPG',
        isTourApi: true
      },
      {
        nameKo: '서면 젊음의 거리 & 1번가',
        nameEn: 'Seomyeon Youth Street & 1st Street',
        descKo: '부산 최대의 중심 번화가로 최신 패션 로드샵, 감성 카페, 길거리 먹거리와 버스킹 공연이 활발한 청춘의 거리입니다.',
        descEn: 'The beating downtown heart of Busan lined with fashion shops, cozy cafes, street stalls, and lively weekend street buskers.',
        category: 'LANDMARK',
        stationGroup: 'LINE1_SEOMYEON_BUJEON',
        stationGroupNameKo: '서면역 · 부전역',
        stationGroupNameEn: 'Seomyeon · Bujeon',
        tagKo: '서면역 1·2번출구',
        tagEn: 'Seomyeon Stn Exits 1/2',
        addressKo: '부산 부산진구 신천대로62번길 61',
        addressEn: '61, Sincheon-daero 62beon-gil, Busanjin-gu, Busan',
        tipKo: '서면 지하상가와 연결되어 날씨에 관계없이 쇼핑하기 좋으며, 주말 저녁에는 활기찬 버스킹 공연이 펼쳐집니다.',
        tipEn: 'Directly linked to the vast Seomyeon Underground Mall for all-weather strolls.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/33/3496933_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '삼정타워 (Samjung Tower)',
        nameEn: 'Samjung Tower Lifestyle Mall',
        descKo: '런닝맨 체험관, 건담베이스, 대형 멀티플렉스 영화관 및 트렌디한 F&B 브랜드가 집결된 서면의 대표 복합문화 라이프스타일 몰입니다.',
        descEn: 'A premier lifestyle complex in Seomyeon housing the Running Man Experience Center, Gundam Base, cinema, and dining.',
        category: 'CULTURE',
        stationGroup: 'LINE1_SEOMYEON_BUJEON',
        stationGroupNameKo: '서면역 · 부전역',
        stationGroupNameEn: 'Seomyeon · Bujeon',
        tagKo: '서면역 2번출구 도보 5분',
        tagEn: 'Seomyeon Stn Exit 2 (5-min walk)',
        addressKo: '부산 부산진구 중앙대로 672',
        addressEn: '672, Jungang-daero, Busanjin-gu, Busan',
        tipKo: '전 층 엘리베이터 및 완벽한 무장애 편의시설이 갖추어져 있어 유모차와 보행 약자도 편안하게 즐길 수 있습니다.',
        tipEn: 'Features excellent elevator coverage and barrier-free amenities on every level.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/31/3014331_image2_1.JPG',
        isTourApi: true
      }
    ]
  },
  {
    id: 'LINE2',
    nameKo: '2호선 라인 (장산역 ↔ 양산역)',
    nameEn: 'Line 2 Line (Jangsan Stn ↔ Yangsan Stn)',
    color: 'bg-emerald-600',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    descKo: '2호선(장산역 ↔ 양산역, 총 43개 역 45.2km 축)을 따라 펼쳐지는 부산 대표 여행 스팟 (화명생태공원, 해운대 블루라인파크, 해동용궁사, 밀락더마켓, 뮤지엄 원, 부산현대미술관, 감천문화마을 등).',
    descEn: 'Connecting Busan east-to-west along Line 2 (43 stations, 45.2km): Haeundae Blue Line Park, Haedong Yonggungsa, Millac the Market, Museum 1, Museum of Contemporary Art Busan, Gamcheon Culture Village, etc.',
    landmarks: [
      {
        nameKo: '화명생태공원',
        nameEn: 'Hwamyeong Ecological Park',
        descKo: '낙동강 강변을 따라 드넓게 펼쳐진 친환경 수변 생태공원으로, 봄 벚꽃과 튤립, 여름 연꽃습지, 가을 코스모스 초원과 메타세쿼이아 산책로가 턱 없이 평탄하게 이어집니다.',
        descEn: 'A vast riverside ecological park along the Nakdong River featuring flat wooden boardwalks, seasonal flower gardens, lotus wetlands, and scenic metasequoia trails.',
        category: 'LANDMARK',
        stationGroup: 'LINE2_HWAMYEONG',
        stationGroupNameKo: '화명역',
        stationGroupNameEn: 'Hwamyeong Stn',
        tagKo: '화명역 2번 출구 도보 7분 · 연꽃단지',
        tagEn: 'Hwamyeong Stn Exit 2 (7-min walk)',
        addressKo: '부산 북구 강변대로 1629 (화명동 1718-17)',
        addressEn: '1629 Gangbyeon-daero, Buk-gu, Busan',
        tipKo: '공원 전 구역이 계단 없는 평탄한 흙길과 목재 데크로 조성되어 있어 휠체어와 유아차 산책에 최적이며, 화명역 2번 출구 엘리베이터를 이용해 진입로로 연결됩니다.',
        tipEn: 'Features flat dirt paths and wooden boardwalks without steps, ideal for wheelchairs and strollers. Exit 2 has elevator access.',
        imageUrl: 'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=54c84f31-742f-46f5-b0a8-ace5b3d853e6',
        isTourApi: true
      },
      {
        nameKo: '부산현대미술관',
        nameEn: 'Museum of Contemporary Art Busan',
        descKo: '을숙도 철새 도래지 한가운데 세워진 공공 미술관으로 외벽이 온통 초록 식물로 뒤덮인 아름다운 에코 미술관입니다.',
        descEn: 'A state-of-the-art public museum on Eulsukdo Island featuring an eye-catching living plant facade.',
        category: 'CULTURE',
        stationGroup: 'LINE2_HWAMYEONG',
        stationGroupNameKo: '화명역',
        stationGroupNameEn: 'Hwamyeong Stn',
        tagKo: '에코 미디어 아트',
        tagEn: 'Contemporary Art',
        addressKo: '부산 강서구 낙동남로 1191',
        addressEn: '1191, Nakdongnam-ro, Gangseo-gu, Busan',
        tipKo: '장애인 및 노약자를 위해 입구와 전시실 전체에 계단 없는 이동용 슬로프와 휠체어 대여가 완비되어 있습니다.',
        tipEn: 'Equipped with barrier-free slopes, automatic doors, and free wheelchair rentals.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/95/3506195_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '감천문화마을',
        nameEn: 'Gamcheon Culture Village',
        descKo: '부산의 산토리니로 불리는 알록달록한 계단식 마을로, 입구 전망대 평지 구역에서 경관을 한눈에 담을 수 있습니다.',
        descEn: 'The Santorini of Busan, showcasing whimsical pastel-colored houses with magnificent viewpoint terraces.',
        category: 'LANDMARK',
        stationGroup: 'LINE2_DEOKCHEON',
        stationGroupNameKo: '덕천역',
        stationGroupNameEn: 'Deokcheon Stn',
        tagKo: '예술 마을',
        tagEn: 'Art Village',
        addressKo: '부산 사하구 감내2로 203',
        addressEn: '203, Gamnae 2-ro, Saha-gu, Busan',
        tipKo: '마을 안쪽은 가파른 경사가 많으므로, 입구 안내소 부근 평지 전망대에서 경관을 즐기는 편이 좋습니다.',
        tipEn: 'The village core has steep hills; enjoy the sweeping views from the flat entrance observatory.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/91/3365491_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '전포 카페거리 & 전포 사잇길',
        nameEn: 'Jeonpo Cafe Street & Alley',
        descKo: '세계적으로 주목받는 감성 문화거리로, 개성 넘치는 감성 골목과 아기자기한 소품샵, 디자인 편집숍이 골목마다 이어집니다.',
        descEn: 'A world-famous trendy cultural street lined with boutique craft shops, lifestyle goods, and vibrant alleys.',
        category: 'CULTURE',
        stationGroup: 'LINE2_JEONPO',
        stationGroupNameKo: '전포역',
        stationGroupNameEn: 'Jeonpo Stn',
        tagKo: '감성 문화거리 · 소품샵',
        tagEn: 'Boutique Culture Street',
        addressKo: '부산 부산진구 전포대로 210 (전포역 7번 출구)',
        addressEn: '210 Jeonpo-daero, Busanjin-gu, Busan (Exit 7)',
        tipKo: '전포역 7번 출구로 나오면 평지 골목을 따라 감성 소품샵과 디자인 공방들이 펼쳐져 편안하게 도보 투어를 즐길 수 있습니다.',
        tipEn: 'Step directly out from Jeonpo Station Exit 7 for convenient flat alleyway walking.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/60/3496960_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '밀락더마켓',
        nameEn: 'Millac the Market',
        descKo: '민락동에 세워진 거대한 복합문화공간으로, 중앙 계단 광장에서 버스킹 공연과 푸드홀을 동시에 즐길 수 있습니다.',
        descEn: 'An incredibly popular cultural complex in Millak-dong, hosting trendy pop-ups and live busking.',
        category: 'CULTURE',
        stationGroup: 'LINE2_GEUMRYEONSAN_GWANGALLI',
        stationGroupNameKo: '금련산역 · 광안리역',
        stationGroupNameEn: 'Geumryeonsan · Gwangalli',
        tagKo: '문화 복합공간',
        tagEn: 'Art Complex',
        addressKo: '부산 수영구 민락수변로 17번길 56',
        addressEn: '56, Millaksubyeon-ro 17beon-gil, Suyeong-gu, Busan',
        tipKo: '주말 저녁에는 바다 전망 계단 광장에서 로컬 뮤지션들의 생생한 인디 밴드 공연이 자주 열립니다.',
        tipEn: 'Catch weekend evening live acoustic bands sitting on the grand sea-view stairs.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/36/3495536_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '뮤지엄 원',
        nameEn: 'Museum 1',
        descKo: '해운대 센텀시티에 펼쳐진 초대형 LED 미디어 아트 현대미술관으로 바닥과 벽면 전체가 살아 움직이는 빛의 세계입니다.',
        descEn: 'A vast immersive LED media art playground in Haeundae Centum City where floor and wall panels shift dynamically.',
        category: 'CULTURE',
        stationGroup: 'LINE2_CENTUM_CITY',
        stationGroupNameKo: '센텀시티역',
        stationGroupNameEn: 'Centum City Stn',
        tagKo: '미디어 아트',
        tagEn: 'Media Art',
        addressKo: '부산 해운대구 센텀서로 20 (센텀시티역 6번 출구)',
        addressEn: '20, Centumseo-ro, Haeundae-gu, Busan',
        tipKo: '내부가 평탄하여 유모차나 휠체어도 수월하게 관람 가능합니다. 편안하게 앉아 빛의 흐름을 즐기세요.',
        tipEn: 'The entire layout is flat and barrier-free, allowing comfortable strollers or wheelchair visits.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/01/3493601_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '해운대 블루라인파크 & 그린레일웨이',
        nameEn: 'Haeundae Blue Line Park & Green Railway',
        descKo: '폐선된 동해남부선 철로를 리모델링하여 해안 절경을 감상하며 걷거나 열차를 탈 수 있는 바다 도보길입니다.',
        descEn: 'A scenic coastline walk and sightseeing train utilizing the recycled historic seaside railway.',
        category: 'LANDMARK',
        stationGroup: 'LINE2_HAEUNDAE_DONGBAEK',
        stationGroupNameKo: '해운대역 · 동백역',
        stationGroupNameEn: 'Haeundae · Dongbaek',
        tagKo: '바다 도보·기차',
        tagEn: 'Ocean Railway',
        addressKo: '부산 해운대구 청사포로 116 (해운대역 3번 출구 / 동백역)',
        addressEn: '116, Cheongsapo-ro, Haeundae-gu, Busan',
        tipKo: '휠체어/유모차 전 구간 진입 가능한 나무 데크 산책로가 조성되어 있습니다.',
        tipEn: 'All sections are equipped with barrier-free flat boardwalks.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/99/3546099_image2_1.jpg',
        isTourApi: true
      },
      {
        nameKo: '해동용궁사',
        nameEn: 'Haedong Yonggungsa Temple',
        descKo: '바다 절벽 바로 위에 세워진 사찰로, 파도가 불상 발밑에 부서지는 이색적이고 웅장한 사찰입니다.',
        descEn: 'A beautiful temple built right on the coastal cliffs, offering serene ocean waves crashing under your feet.',
        category: 'LANDMARK',
        stationGroup: 'LINE2_HAEUNDAE_DONGBAEK',
        stationGroupNameKo: '해운대역 · 동백역',
        stationGroupNameEn: 'Haeundae · Dongbaek',
        tagKo: '해안 사찰',
        tagEn: 'Cliffside Temple',
        addressKo: '부산 기장군 기장읍 용궁사로 86 (해운대역 7번 출구 버스 연계)',
        addressEn: '86, Yonggungsa-ro, Gijang-eup, Gijang-gun, Busan',
        tipKo: '메인 계단 대신 완만 우회로(교통약자 진입로)를 이용하시면 편하게 참배할 수 있습니다.',
        tipEn: 'Use the gentle bypass ramp to access the temple grounds easily.',
        imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/35/3499335_image2_1.jpg',
        isTourApi: true
      }
    ]
  }
];


const BoogiSeagullSVG = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" aria-label="Boogi Mascot">
    {/* Body */}
    <ellipse cx="50" cy="55" rx="25" ry="20" fill="white" stroke="#cbd5e1" strokeWidth="2" />
    {/* Wings */}
    <path d="M 25 55 Q 10 40 20 35 Q 25 45 30 50" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
    <path d="M 75 55 Q 90 40 80 35 Q 75 45 70 50" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
    {/* Head */}
    <circle cx="50" cy="35" r="16" fill="white" stroke="#cbd5e1" strokeWidth="2" />
    {/* Red glasses */}
    {/* Left ring */}
    <circle cx="42" cy="32" r="7" fill="none" stroke="#e11d48" strokeWidth="2.5" />
    {/* Right ring */}
    <circle cx="58" cy="32" r="7" fill="none" stroke="#e11d48" strokeWidth="2.5" />
    {/* Glasses bridge */}
    <path d="M 49 32 L 51 32" stroke="#e11d48" strokeWidth="2.5" />
    {/* Glasses temple left & right */}
    <path d="M 35 32 Q 32 30 30 35" stroke="#e11d48" strokeWidth="1.5" fill="none" />
    <path d="M 65 32 Q 68 30 70 35" stroke="#e11d48" strokeWidth="1.5" fill="none" />
    {/* Eyes - Left is winking, Right is open */}
    <path d="M 39 32 Q 42 29 45 32" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
    <circle cx="58" cy="32" r="2.5" fill="#0f172a" />
    {/* Cheeks */}
    <circle cx="38" cy="38" r="2.5" fill="#fda4af" opacity="0.6" />
    <circle cx="62" cy="38" r="2.5" fill="#fda4af" opacity="0.6" />
    {/* Beak */}
    <path d="M 50 36 L 47 43 L 53 43 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

function CategoryIllustration({ type }: { type: string }) {
  switch (type) {
    case 'GOURMET':
      return (
        <div className="w-full h-44 bg-gradient-to-br from-amber-100 via-orange-50 to-red-100 relative overflow-hidden flex items-center justify-center">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-amber-200/40 blur-xs" />
          <div className="absolute -left-6 -top-6 w-28 h-28 rounded-full bg-red-200/30 blur-xs" />
          <svg className="w-28 h-28 z-10 drop-shadow-md" viewBox="0 0 120 120" fill="none">
            <path d="M20 55 C20 85, 100 85, 100 55 Z" fill="#f97316" />
            <ellipse cx="60" cy="55" rx="40" ry="10" fill="#fb923c" />
            <ellipse cx="60" cy="55" rx="36" ry="7" fill="#fef08a" />
            <path d="M45 42 C42 34 48 28 45 20" stroke="#f97316" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
            <path d="M60 40 C57 32 63 26 60 18" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.9" />
            <path d="M75 42 C72 34 78 28 75 20" stroke="#f97316" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
            <line x1="25" y1="20" x2="85" y2="60" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="30" y1="16" x2="90" y2="56" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M82 72 C90 68, 98 75, 98 80 C98 85, 90 92, 82 88 C78 86, 78 74, 82 72 Z" fill="#0284c7" />
            <polygon points="98,80 106,73 106,87" fill="#0284c7" />
          </svg>
        </div>
      );
    case 'GAMCHEON':
      return (
        <div className="w-full h-44 bg-gradient-to-br from-sky-100 via-amber-50 to-teal-100 relative overflow-hidden flex items-center justify-center">
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-amber-200/50" />
          <svg className="w-32 h-32 z-10 drop-shadow-md" viewBox="0 0 120 120" fill="none">
            <circle cx="95" cy="25" r="12" fill="#fbbf24" opacity="0.9" />
            <rect x="15" y="65" width="22" height="30" rx="2" fill="#38bdf8" />
            <polygon points="13,65 26,52 39,65" fill="#ef4444" />
            <rect x="20" y="73" width="5" height="7" fill="#ffffff" />
            <rect x="29" y="73" width="5" height="7" fill="#ffffff" />

            <rect x="35" y="55" width="24" height="40" rx="2" fill="#facc15" />
            <polygon points="33,55 47,42 61,55" fill="#3b82f6" />
            <rect x="42" y="63" width="10" height="10" fill="#ffffff" />

            <rect x="57" y="60" width="26" height="35" rx="2" fill="#f43f5e" />
            <polygon points="55,60 70,46 85,60" fill="#10b981" />
            <rect x="64" y="68" width="12" height="10" fill="#ffffff" />

            <rect x="81" y="70" width="24" height="25" rx="2" fill="#a855f7" />
            <polygon points="79,70 93,58 107,70" fill="#f97316" />

            <path d="M5 95 Q 60 85, 115 95 L 115 105 L 5 105 Z" fill="#4d7c0f" opacity="0.3" />
          </svg>
        </div>
      );
    case 'HAEUNDAE':
      return (
        <div className="w-full h-44 bg-gradient-to-br from-cyan-100 via-sky-100 to-blue-200 relative overflow-hidden flex items-center justify-center">
          <div className="absolute top-3 left-4 w-12 h-12 rounded-full bg-amber-300/60 blur-xs" />
          <svg className="w-32 h-32 z-10 drop-shadow-md" viewBox="0 0 120 120" fill="none">
            <path d="M10 70 Q 35 45, 60 70 Q 85 45, 110 70" stroke="#0284c7" strokeWidth="2.5" fill="none" opacity="0.6" />
            <line x1="35" y1="57" x2="35" y2="70" stroke="#0284c7" strokeWidth="2" opacity="0.6" />
            <line x1="85" y1="57" x2="85" y2="70" stroke="#0284c7" strokeWidth="2" opacity="0.6" />
            <line x1="5" y1="70" x2="115" y2="70" stroke="#0369a1" strokeWidth="4" strokeLinecap="round" />
            
            <path d="M5 85 C25 80, 35 90, 60 85 C85 80, 95 90, 115 85" stroke="#0284c7" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M5 95 C25 90, 35 100, 60 95 C85 90, 95 100, 115 95" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round" />

            <path d="M25 45 C25 32, 55 32, 55 45 Z" fill="#ef4444" />
            <path d="M35 45 C35 32, 45 32, 45 45 Z" fill="#ffffff" />
            <line x1="40" y1="45" x2="40" y2="65" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'MUSEUM':
      return (
        <div className="w-full h-44 bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 relative overflow-hidden flex items-center justify-center">
          <svg className="w-28 h-28 z-10 drop-shadow-md" viewBox="0 0 120 120" fill="none">
            <polygon points="20,45 60,20 100,45" fill="#b45309" />
            <rect x="18" y="45" width="84" height="6" fill="#78350f" />
            <rect x="25" y="51" width="8" height="32" rx="1" fill="#d97706" />
            <rect x="42" y="51" width="8" height="32" rx="1" fill="#d97706" />
            <rect x="59" y="51" width="8" height="32" rx="1" fill="#d97706" />
            <rect x="76" y="51" width="8" height="32" rx="1" fill="#d97706" />
            <rect x="91" y="51" width="8" height="32" rx="1" fill="#d97706" />
            <rect x="15" y="83" width="90" height="5" fill="#78350f" />
            <rect x="10" y="88" width="100" height="6" fill="#b45309" />

            <circle cx="85" cy="30" r="14" fill="#fef08a" stroke="#d97706" strokeWidth="2" />
            <circle cx="80" cy="26" r="2.5" fill="#ef4444" />
            <circle cx="88" cy="24" r="2.5" fill="#3b82f6" />
            <circle cx="92" cy="31" r="2.5" fill="#10b981" />
          </svg>
        </div>
      );
    case 'SEOMYEON':
      return (
        <div className="w-full h-44 bg-gradient-to-br from-[#f3e8ff] via-[#fae8ff] to-[#e0e7ff] relative overflow-hidden flex items-center justify-center">
          <svg className="w-28 h-28 z-10 drop-shadow-md" viewBox="0 0 120 120" fill="none">
            <path d="M35 50 L40 85 C41 90, 79 90, 80 85 L85 50 Z" fill="#9333ea" />
            <ellipse cx="60" cy="50" rx="25" ry="6" fill="#c084fc" />
            <ellipse cx="60" cy="50" rx="21" ry="4" fill="#581c87" />
            <path d="M83 55 C95 55, 95 75, 78 77" stroke="#9333ea" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            <path d="M50 38 C47 30, 53 24, 50 16" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M60 36 C57 28, 63 22, 60 14" stroke="#a855f7" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M70 38 C67 30, 73 24, 70 16" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="28" cy="30" r="4" fill="#a855f7" />
            <path d="M25 70 L30 65 L35 70 Z" fill="#a855f7" />
          </svg>
        </div>
      );
    case 'YEONGDO':
      return (
        <div className="w-full h-44 bg-gradient-to-br from-indigo-100 via-sky-100 to-slate-200 relative overflow-hidden flex items-center justify-center">
          <svg className="w-28 h-28 z-10 drop-shadow-md" viewBox="0 0 120 120" fill="none">
            <polygon points="45,30 115,10 115,70" fill="#fef08a" opacity="0.6" />
            <polygon points="38,30 52,30 57,85 33,85" fill="#475569" />
            <polygon points="38,45 52,45 54,58 36,58" fill="#ef4444" />
            <rect x="40" y="20" width="10" height="10" fill="#f59e0b" />
            <polygon points="37,20 45,10 53,20" fill="#1e293b" />

            <path d="M10 85 C30 80, 40 90, 65 85 C90 80, 100 90, 115 85 L115 105 L10 105 Z" fill="#1e40af" opacity="0.8" />
            <path d="M5 93 C25 88, 35 98, 60 93 C85 88, 95 98, 115 93" stroke="#60a5fa" strokeWidth="3" fill="none" />
          </svg>
        </div>
      );
    case 'GIJANG':
    default:
      return (
        <div className="w-full h-44 bg-gradient-to-br from-teal-100 via-cyan-100 to-sky-200 relative overflow-hidden flex items-center justify-center">
          <svg className="w-28 h-28 z-10 drop-shadow-md" viewBox="0 0 120 120" fill="none">
            <ellipse cx="60" cy="55" rx="38" ry="14" stroke="#0d9488" strokeWidth="2.5" transform="rotate(-30 60 55)" fill="none" />
            <ellipse cx="60" cy="55" rx="38" ry="14" stroke="#0284c7" strokeWidth="2.5" transform="rotate(30 60 55)" fill="none" />
            <circle cx="60" cy="55" r="9" fill="#0f766e" />
            <circle cx="60" cy="55" r="5" fill="#ccfbf1" />
            <circle cx="30" cy="40" r="4" fill="#f59e0b" />
            <circle cx="90" cy="70" r="4" fill="#3b82f6" />
            <circle cx="85" cy="35" r="4" fill="#ec4899" />
            <path d="M10 90 C30 85, 40 95, 65 90 C90 85, 100 95, 115 90" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      );
  }
}

const RECOMMENDATION_OVERVIEW_CARDS = [
  {
    id: 'GOURMET',
    titleKo: '자갈치 & 남포동 식도락 미식 탐방',
    titleEn: 'Jagalchi & Nampo Seafood Gourmet Trail',
    theme: 'GOURMET',
    duration: '1NIGHT',
    durationLabelKo: '1박 2일 추천',
    durationLabelEn: '1 Night 2 Days',
    rating: '4.9',
    badgeText: 'Trending',
    badgeBg: 'bg-[#ffde43]',
    badgeTextCol: 'text-slate-900',
    themeBadgeKo: '식도락',
    themeBadgeEn: 'Gourmet',
    descKo: '부산 대표 수산시장 자갈치, 국제시장, 전포 카페거리의 별미를 엘리베이터와 단차 없는 평지 동선으로 안전하고 맛있게 즐기는 핵심 미식 코스.',
    descEn: 'Feast on fresh seafood and local delicacies at Jagalchi Market and Jeonpo Cafe Street with step-free flat walking paths.',
    illustrationType: 'GOURMET'
  },
  {
    id: 'DAY',
    titleKo: '감천문화마을 & 남포동 당일치기 코스',
    titleEn: 'Gamcheon Village & Nampo Day Trip',
    theme: 'EXPERIENCE',
    duration: 'DAY',
    durationLabelKo: '당일치기 추천',
    durationLabelEn: '1-Day Tour',
    rating: '4.8',
    badgeText: 'POPULAR',
    badgeBg: 'bg-emerald-600',
    badgeTextCol: 'text-white',
    themeBadgeKo: '체험&박물관',
    themeBadgeEn: 'Experience',
    descKo: '알록달록 감천문화마을 완만 데크길부터 용두산공원 경사로와 자갈치 시장까지 당일로 알차게 탐방하는 무장애 필수 코스.',
    descEn: 'Explore the vibrant Gamcheon Village and Yongdusan Park via smooth wooden decks and accessible ramps in a single day.',
    illustrationType: 'GAMCHEON'
  },
  {
    id: '1NIGHT',
    titleKo: '해운대 & 광안리 바다 야경 1박 2일 힐링',
    titleEn: 'Haeundae & Gwangalli Beach 1-Night Trip',
    theme: 'EXPERIENCE',
    duration: '1NIGHT',
    durationLabelKo: '1박 2일 추천',
    durationLabelEn: '1 Night 2 Days',
    rating: '4.9',
    badgeText: 'BEST',
    badgeBg: 'bg-sky-600',
    badgeTextCol: 'text-white',
    themeBadgeKo: '식도락&체험',
    themeBadgeEn: 'Ocean Trail',
    descKo: '동백섬 데크 산책로, 해운대 수평 백사장, 광안대교 야경을 엘리베이터와 저상버스로 여유롭고 안락하게 누리는 바다 힐링 코스.',
    descEn: 'Enjoy step-free ocean view boardwalks, Dongbaek Island decks, and Gwangalli Bridge night lights with accessible transit.',
    illustrationType: 'HAEUNDAE'
  },
  {
    id: 'EXPERIENCE',
    titleKo: '국립해양박물관 & 국립부산과학관 체험 특선',
    titleEn: 'National Museums & Science Hands-on Trail',
    theme: 'EXPERIENCE',
    duration: 'DAY',
    durationLabelKo: '체험&박물관 추천',
    durationLabelEn: 'Museum Trail',
    rating: '4.9',
    badgeText: 'HOT',
    badgeBg: 'bg-amber-600',
    badgeTextCol: 'text-white',
    themeBadgeKo: '체험&박물관',
    themeBadgeEn: 'Museums',
    descKo: '날씨 상관없이 완벽한 실내 에스컬레이터·엘리베이터 동선! 아쿠아리움 원통 수조, 인터랙티브 과학관, 미술관을 한눈에.',
    descEn: 'Indoor barrier-free cultural venues featuring giant cylindrical aquariums, interactive science zones, and media art halls.',
    illustrationType: 'MUSEUM'
  },
  {
    id: '2NIGHTS',
    titleKo: '센텀시티 & 서면 2박 3일 복합문화 도심 투어',
    titleEn: 'Centum City & Seomyeon 2-Nights Urban Tour',
    theme: 'EXPERIENCE',
    duration: '2NIGHTS',
    durationLabelKo: '2박 3일 추천',
    durationLabelEn: '2 Nights 3 Days',
    rating: '4.8',
    badgeText: 'RECOMMENDED',
    badgeBg: 'bg-indigo-600',
    badgeTextCol: 'text-white',
    themeBadgeKo: '도심&문화',
    themeBadgeEn: 'Urban Culture',
    descKo: '영화의전당, 뮤지엄원 미디어아트, F1963 문화공간과 서면 전포거리까지 부산 도심의 현대적 매력을 품은 3일 코스.',
    descEn: 'Discover Busan Cinema Center, Museum 1 digital art, and F1963 wire-factory culture space with flat elevators.',
    illustrationType: 'SEOMYEON'
  },
  {
    id: '3NIGHTS',
    titleKo: '영도 & 태종대 3박 4일 해안 절경 투어',
    titleEn: 'Yeongdo & Taejongdae 3-Nights Coastal Tour',
    theme: 'EXPERIENCE',
    duration: '3NIGHTS',
    durationLabelKo: '3박 4일 추천',
    durationLabelEn: '3 Nights 4 Days',
    rating: '4.7',
    badgeText: 'FEATURED',
    badgeBg: 'bg-teal-600',
    badgeTextCol: 'text-white',
    themeBadgeKo: '해안&역사',
    themeBadgeEn: 'Seaside',
    descKo: '아르떼뮤지엄 미디어아트, 영도 피아크 오션뷰 라운지, 부산 근현대역사관까지 영도와 남포 일대를 깊이 있게 탐방.',
    descEn: 'Immerse in ARTE Museum digital art, Yeongdo oceanview lounges, and modern history venues across 4 rewarding days.',
    illustrationType: 'YEONGDO'
  },
  {
    id: '4NIGHTS',
    titleKo: '기장 & 동부산 4박 5일 여유 만점 완벽 완주',
    titleEn: 'Gijang & East Busan 4-Nights Grand Tour',
    theme: 'EXPERIENCE',
    duration: '4NIGHTS',
    durationLabelKo: '4박 5일 추천',
    durationLabelEn: '4 Nights 5 Days',
    rating: '4.9',
    badgeText: 'GRAND TOUR',
    badgeBg: 'bg-[#8EA85E]',
    badgeTextCol: 'text-white',
    themeBadgeKo: '완주코스',
    themeBadgeEn: 'Full Tour',
    descKo: '동부산 오시리아, 해동용궁사 입구 완만 데크, 부산박물관, 낙동강하구에코센터까지 부산 전역의 매력을 여유롭게 완주.',
    descEn: 'The ultimate 5-day barrier-free Busan journey covering East Busan Osiria, Busan Museum, and Eulsukdo Eco Park.',
    illustrationType: 'GIJANG'
  }
];

const FoodieIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 140" className={className || "w-full h-24 sm:h-28 max-w-[150px] mx-auto"} fill="none">
    {/* Outer bowl */}
    <path d="M 40 65 C 40 115, 160 115, 160 65 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
    <ellipse cx="100" cy="65" rx="60" ry="12" fill="#f8fafc" stroke="#1e293b" strokeWidth="3" />
    
    {/* Bowl decorative arcs */}
    <path d="M 55 80 Q 70 92 85 80" stroke="#1e293b" strokeWidth="2" fill="none" />
    <path d="M 85 80 Q 100 92 115 80" stroke="#1e293b" strokeWidth="2" fill="none" />
    <path d="M 115 80 Q 130 92 145 80" stroke="#1e293b" strokeWidth="2" fill="none" />

    {/* Skewers / Eomuk */}
    <line x1="125" y1="20" x2="65" y2="72" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="135" y1="25" x2="75" y2="77" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
    {/* Fishcake folds */}
    <path d="M 102 32 L 120 45 L 110 53 L 92 40 Z" fill="#d97706" opacity="0.4" stroke="#1e293b" strokeWidth="2" />
    <path d="M 112 40 L 130 53 L 120 61 L 102 48 Z" fill="#d97706" opacity="0.4" stroke="#1e293b" strokeWidth="2" />

    {/* Food item / Egg in bowl */}
    <ellipse cx="120" cy="68" rx="14" ry="9" fill="#d97706" opacity="0.3" stroke="#1e293b" strokeWidth="2" />
    
    {/* Anchor accent on the right */}
    <path d="M 154 95 C 154 107, 170 107, 170 95" stroke="#1e293b" strokeWidth="2" fill="none" />
    <line x1="162" y1="87" x2="162" y2="105" stroke="#1e293b" strokeWidth="2" />
    <line x1="157" y1="91" x2="167" y2="91" stroke="#1e293b" strokeWidth="2" />
    <circle cx="162" cy="85" r="2.5" stroke="#1e293b" strokeWidth="1.5" />
  </svg>
);

const ExperienceIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 140" className={className || "w-full h-24 sm:h-28 max-w-[150px] mx-auto"} fill="none">
    {/* Background Mountain / Sea contours */}
    <path d="M 15 80 L 40 55 L 70 80 Z" fill="#d97706" opacity="0.25" stroke="#1e293b" strokeWidth="2" strokeLinejoin="round" />
    <path d="M 50 80 Q 100 42 150 80" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2" strokeLinejoin="round" />

    {/* Museum / Traditional Building Roof */}
    <polygon points="45,58 80,40 115,58" fill="#1e293b" />
    <rect x="47" y="58" width="66" height="5" fill="#d97706" opacity="0.5" stroke="#1e293b" strokeWidth="1.5" />
    <rect x="51" y="63" width="58" height="17" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
    <line x1="63" y1="63" x2="63" y2="80" stroke="#1e293b" strokeWidth="1.5" />
    <line x1="80" y1="63" x2="80" y2="80" stroke="#1e293b" strokeWidth="1.5" />
    <line x1="97" y1="63" x2="97" y2="80" stroke="#1e293b" strokeWidth="1.5" />

    {/* Tower / Sculpture Pillar */}
    <rect x="135" y="35" width="18" height="45" rx="3" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
    <line x1="144" y1="35" x2="144" y2="25" stroke="#1e293b" strokeWidth="2.5" />
    <circle cx="144" cy="22" r="3" fill="#d97706" />

    {/* Sea waves at base */}
    <path d="M 10 80 C 30 75, 40 85, 60 80 C 80 75, 90 85, 110 80 C 130 75, 140 85, 160 80 C 180 75, 190 85, 200 80" stroke="#1e293b" strokeWidth="2.5" fill="none" />
  </svg>
);

const ItineraryIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 140" className={className || "w-full h-24 sm:h-28 max-w-[150px] mx-auto"} fill="none">
    {/* Suitcase */}
    <rect x="30" y="38" width="80" height="58" rx="8" fill="#1e293b" />
    {/* Suitcase corners */}
    <rect x="30" y="38" width="16" height="16" rx="4" fill="#d97706" opacity="0.8" />
    <rect x="94" y="38" width="16" height="16" rx="4" fill="#d97706" opacity="0.8" />
    <rect x="30" y="80" width="16" height="16" rx="4" fill="#d97706" opacity="0.8" />
    <rect x="94" y="80" width="16" height="16" rx="4" fill="#d97706" opacity="0.8" />
    {/* Handle */}
    <path d="M 55 38 V 26 C 55 22, 85 22, 85 26 V 38" stroke="#d97706" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    {/* Center latch */}
    <rect x="65" y="58" width="10" height="18" rx="2" fill="#d97706" />

    {/* Clock */}
    <circle cx="125" cy="62" r="26" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
    <circle cx="125" cy="62" r="22" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
    {/* Clock Hands */}
    <line x1="125" y1="62" x2="125" y2="48" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
    <line x1="125" y1="62" x2="136" y2="62" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
    <circle cx="125" cy="62" r="2.5" fill="#1e293b" />

    {/* BUSAN with umbrella */}
    <text x="68" y="114" fontFamily="sans-serif" fontWeight="900" fontSize="13" fill="#1e293b" letterSpacing="2">BUSAN</text>
    {/* Umbrella icon */}
    <path d="M 126 108 C 126 103, 138 103, 138 108 Z" fill="#d97706" />
    <line x1="132" y1="108" x2="132" y2="116" stroke="#1e293b" strokeWidth="1.5" />
  </svg>
);

const SubwayCourseIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 140" className={className || "w-full h-24 sm:h-28 max-w-[150px] mx-auto"} fill="none">
    {/* Metro Train body */}
    <rect x="35" y="38" width="130" height="52" rx="10" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
    <path d="M 35 60 H 165" stroke="#f97316" strokeWidth="3" />
    {/* Windows */}
    <rect x="48" y="46" width="22" height="12" rx="3" fill="#10b981" opacity="0.3" stroke="#1e293b" strokeWidth="1.5" />
    <rect x="76" y="46" width="22" height="12" rx="3" fill="#10b981" opacity="0.3" stroke="#1e293b" strokeWidth="1.5" />
    <rect x="104" y="46" width="22" height="12" rx="3" fill="#10b981" opacity="0.3" stroke="#1e293b" strokeWidth="1.5" />
    <rect x="132" y="46" width="20" height="12" rx="3" fill="#10b981" opacity="0.3" stroke="#1e293b" strokeWidth="1.5" />
    {/* Headlights */}
    <circle cx="48" cy="74" r="4" fill="#f59e0b" stroke="#1e293b" strokeWidth="1.5" />
    <circle cx="152" cy="74" r="4" fill="#f59e0b" stroke="#1e293b" strokeWidth="1.5" />
    {/* Wheels / Base */}
    <rect x="52" y="90" width="18" height="6" rx="2" fill="#1e293b" />
    <rect x="130" y="90" width="18" height="6" rx="2" fill="#1e293b" />
    {/* Tracks */}
    <line x1="20" y1="96" x2="180" y2="96" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
    {/* Line badge pills */}
    <rect x="35" y="106" width="55" height="20" rx="10" fill="#f97316" />
    <text x="62.5" y="120" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">1호선</text>
    <rect x="110" y="106" width="55" height="20" rx="10" fill="#10b981" />
    <text x="137.5" y="120" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">2호선</text>
  </svg>
);

const BarrierFreeIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 140" className={className || "w-full h-24 sm:h-28 max-w-[150px] mx-auto"} fill="none">
    {/* Base platform / Ramp */}
    <path d="M 20 100 L 180 100" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
    <path d="M 20 100 L 80 70 L 170 70" stroke="#004481" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Landmark/Building structure */}
    <rect x="100" y="25" width="60" height="45" rx="4" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
    <path d="M 95 25 L 130 10 L 165 25 Z" fill="#004481" stroke="#1e293b" strokeWidth="2" strokeLinejoin="round" />
    <rect x="112" y="38" width="12" height="18" fill="#d97706" opacity="0.3" stroke="#1e293b" strokeWidth="1.5" />
    <rect x="134" y="38" width="12" height="18" fill="#d97706" opacity="0.3" stroke="#1e293b" strokeWidth="1.5" />

    {/* Wheelchair / Accessibility Symbol */}
    <circle cx="50" cy="42" r="5" fill="#004481" stroke="#1e293b" strokeWidth="1.5" />
    <path d="M 50 47 V 60 L 62 60" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="48" cy="62" r="8" stroke="#1e293b" strokeWidth="2.5" fill="none" />
    <path d="M 50 52 L 60 52" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

    {/* Checkmark Badge */}
    <circle cx="168" cy="40" r="12" fill="#10b981" stroke="#1e293b" strokeWidth="2" />
    <path d="M 162 40 L 166 44 L 174 36" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const TraditionalMarketIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 140" className={className || "w-full h-24 sm:h-28 max-w-[150px] mx-auto"} fill="none">
    {/* Market Stall Canopy / Awning */}
    <path d="M 25 45 L 175 45 L 165 72 L 35 72 Z" fill="#0A2540" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Striped Canopy segments */}
    <path d="M 45 45 L 52 72 L 72 72 L 65 45 Z" fill="#d97706" opacity="0.8" />
    <path d="M 85 45 L 92 72 L 112 72 L 105 45 Z" fill="#d97706" opacity="0.8" />
    <path d="M 125 45 L 132 72 L 152 72 L 145 45 Z" fill="#d97706" opacity="0.8" />
    {/* Stall counter table */}
    <rect x="35" y="72" width="130" height="36" rx="3" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
    {/* Market Produce / Crates */}
    <rect x="45" y="80" width="32" height="20" rx="2" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.5" />
    <circle cx="55" cy="88" r="4" fill="#ef4444" />
    <circle cx="67" cy="88" r="4" fill="#ef4444" />
    <rect x="85" y="80" width="32" height="20" rx="2" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.5" />
    <ellipse cx="101" cy="90" rx="10" ry="5" fill="#0284c7" />
    {/* Traditional Lantern */}
    <line x1="160" y1="20" x2="160" y2="45" stroke="#1e293b" strokeWidth="2" />
    <rect x="152" y="30" width="16" height="20" rx="4" fill="#dc2626" stroke="#1e293b" strokeWidth="1.5" />
    <line x1="160" y1="50" x2="160" y2="58" stroke="#dc2626" strokeWidth="2" />
    {/* Signboard */}
    <rect x="70" y="24" width="60" height="18" rx="3" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
    <text x="100" y="37" textAnchor="middle" fill="#0A2540" fontSize="10" fontWeight="bold" fontFamily="sans-serif">전통시장</text>
  </svg>
);

const AttractionIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 140" className={className || "w-full h-24 sm:h-28 max-w-[150px] mx-auto"} fill="none">
    {/* Ground wave / sea horizon */}
    <path d="M 20 108 Q 60 102 100 108 T 180 108" stroke="#004481" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 25 116 Q 65 110 105 116 T 175 116" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Busan Diamond Tower / Landmark Tower */}
    <rect x="94" y="32" width="12" height="66" rx="2" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
    <ellipse cx="100" cy="42" rx="18" ry="7" fill="#0A2540" stroke="#1e293b" strokeWidth="2" />
    <rect x="91" y="38" width="18" height="8" fill="#d97706" opacity="0.8" rx="1" />
    <path d="M 100 32 L 100 16" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
    <circle cx="100" cy="14" r="3" fill="#ef4444" />
    
    {/* Haeundae Beach Parasol & Sun */}
    <circle cx="152" cy="28" r="10" fill="#f59e0b" opacity="0.9" />
    <path d="M 140 85 Q 155 70 170 85 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="1.8" />
    <path d="M 155 85 L 155 106" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
    
    {/* Gamcheon pastel houses silhouette on left */}
    <rect x="36" y="80" width="18" height="24" rx="2" fill="#60a5fa" stroke="#1e293b" strokeWidth="1.8" />
    <polygon points="34,80 45,70 56,80" fill="#f87171" stroke="#1e293b" strokeWidth="1.8" />
    <rect x="56" y="86" width="16" height="18" rx="2" fill="#fef08a" stroke="#1e293b" strokeWidth="1.8" />
    <polygon points="54,86 64,78 74,86" fill="#34d399" stroke="#1e293b" strokeWidth="1.8" />
  </svg>
);

const MyRouteIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 140" className={className || "w-full h-24 sm:h-28 max-w-[150px] mx-auto"} fill="none">
    {/* Folded Map base plate */}
    <polygon points="28,40 75,25 125,40 172,25 172,100 125,115 75,100 28,115" fill="#fef3c7" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
    <line x1="75" y1="25" x2="75" y2="100" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 3" />
    <line x1="125" y1="40" x2="125" y2="115" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 3" />
    {/* Route Polyline */}
    <path d="M 48 85 Q 85 55 110 75 T 150 48" stroke="#0A2540" strokeWidth="3" fill="none" strokeDasharray="4 4" strokeLinecap="round" />
    {/* Waypoint Pins */}
    <circle cx="48" cy="85" r="4.5" fill="#0A2540" stroke="#ffffff" strokeWidth="1.5" />
    <circle cx="110" cy="75" r="4.5" fill="#0A2540" stroke="#ffffff" strokeWidth="1.5" />
    {/* Star Destination Pin */}
    <path d="M 150 28 C 142 28, 136 34, 136 42 C 136 52, 150 64, 150 64 C 150 64, 164 52, 164 42 C 164 34, 158 28, 150 28 Z" fill="#f59e0b" stroke="#1e293b" strokeWidth="2" />
    <polygon points="150,33 152,38 157,38 153,41 155,46 150,43 145,46 147,41 143,38 148,38" fill="#ffffff" />
  </svg>
);

function AttractionPhotoThumbnail({ 
  src, 
  alt, 
  className = "w-full h-36 sm:h-44" 
}: { 
  src?: string; 
  alt?: string; 
  className?: string; 
}) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error || !src) {
    return null;
  }

  return (
    <div className={`${className} rounded-md overflow-hidden bg-slate-100 border border-[#E5E2DC] relative`}>
      <img
        src={src}
        alt={alt || '부산 명소'}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
        onError={() => setError(true)}
      />
    </div>
  );
}

export default function BusanItinerariesView({ 
  language, 
  initialCategory = null, 
  onBack, 
  onSelectCategory,
  tipsSubPage,
  setTipsSubPage,
  activeRegionPage: propActiveRegionPage,
  setActiveRegionPage: propSetActiveRegionPage,
  onSelectStation,
  initialBarrierFreeCourseId,
  initialBarrierFreePlaceId,
  onOpenBarrierFreeDetail,
  onBackToBarrierFreeList,
  initialExplorationItemId,
  onSelectExplorationItem,
}: BusanItinerariesViewProps) {
  // Navigation Section: 'SELECTION' (Travel Tips Hub) | 'TRANSIT_TIPS' (transit guide) | 'RECOMMENDATIONS' (itineraries list) | 'SCHEDULE' (events) | 'COMMUNITY' (live tips) | 'EXPLORATION' (busan exploration)
  const [activeSection, setActiveSection] = useState<'SELECTION' | 'TRANSIT_TIPS' | 'RECOMMENDATIONS' | 'SCHEDULE' | 'COMMUNITY' | 'EXPLORATION'>(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      if (sp.has('route') || sp.has('route_data') || sp.has('shared_route')) {
        return 'RECOMMENDATIONS';
      }
    }
    return tipsSubPage === 'courses' ? 'RECOMMENDATIONS' :
      tipsSubPage === 'schedule' ? 'SCHEDULE' :
      tipsSubPage === 'community' ? 'COMMUNITY' :
      tipsSubPage === 'exploration' ? 'EXPLORATION' :
      (tipsSubPage === 'transit' || tipsSubPage === 'child-free' || tipsSubPage === 'taxi' || tipsSubPage === 'transfer') ? 'TRANSIT_TIPS' :
      (initialCategory ? 'RECOMMENDATIONS' : 'SELECTION');
  });

  // Exploration detailed item selection state: null (overview 2 columns) | 'bootech' | 'drone-show' | 'jeonpo' | 'luggage' | 'rental' | 'korean-cheat-codes'
  const [selectedExplorationItem, setSelectedExplorationItem] = useState<string | null>(() => {
    if (initialExplorationItemId) return initialExplorationItemId;
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/');
      if (parts[1] === 'tips' && parts[2] === 'exploration' && parts[3]) {
        return parts[3].toLowerCase();
      }
      if (parts[1] === 'tips' && ['bootech', 'luggage', 'rental', 'korean-cheat-codes', 'metro-reentry'].includes(parts[2]?.toLowerCase())) {
        return parts[2].toLowerCase();
      }
    }
    return null;
  });

  React.useEffect(() => {
    if (initialExplorationItemId !== undefined) {
      setSelectedExplorationItem(initialExplorationItemId);
    }
  }, [initialExplorationItemId]);

  const handleSelectExplorationItem = (itemId: string | null) => {
    setSelectedExplorationItem(itemId);
    if (onSelectExplorationItem) {
      onSelectExplorationItem(itemId);
    }
    if (itemId) {
      navigateToSpa(`/tips/exploration/${itemId}`, { tab: 'tips', subPage: 'exploration', explorationItemId: itemId });
    } else {
      navigateToSpa('/tips/exploration', { tab: 'tips', subPage: 'exploration', explorationItemId: null });
    }
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  // Initially activeCategory defaults to initialCategory or null (Category Overview)
  const [activeCategory, setActiveCategory] = useState<CategoryType | null>(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      if (sp.has('route') || sp.has('route_data') || sp.has('shared_route')) {
        return 'MY_ROUTE';
      }
    }
    return initialCategory || null;
  });
  const [selectedScheduleDuration, setSelectedScheduleDuration] = useState<'DAY' | '1NIGHT' | '2NIGHTS' | '3NIGHTS' | '4NIGHTS'>(() => {
    if (initialCategory === '1NIGHT' || initialCategory === '2NIGHTS' || initialCategory === '3NIGHTS' || initialCategory === '4NIGHTS') {
      return initialCategory;
    }
    return 'DAY';
  });
  const [selectedDayCourseId, setSelectedDayCourseId] = useState<string>('itinerary-day-first-time-1');

  const [selectedThemeFilter, setSelectedThemeFilter] = useState<'ALL' | 'GOURMET' | 'EXPERIENCE'>('ALL');
  const [selectedDurationFilter, setSelectedDurationFilter] = useState<'ALL' | 'DAY' | '1NIGHT' | '2NIGHTS' | '3NIGHTS' | '4NIGHTS'>('ALL');
  const [overviewSearchQuery, setOverviewSearchQuery] = useState<string>('');
  const { isBookmarked, toggle: toggleMyRoute, count: myRouteCount } = useMyRoute();

  const navigateToSubPage = (page: 'index' | 'courses' | 'transit' | 'child-free' | 'bus-qr' | 'transfer' | 'taxi' | 'schedule' | 'community' | 'exploration') => {
    if (setTipsSubPage) {
      if (page === 'transfer') {
        setTipsSubPage('transit');
      } else {
        setTipsSubPage(page);
      }
    }
    
    if (page === 'index') {
      setActiveSection('SELECTION');
      setActiveCategory(null);
      setInternalBarrierFreePlaceId(null);
      navigateToSpa('/tips', { tab: 'tips', subPage: 'index', category: null });
    } else if (page === 'courses') {
      setActiveSection('RECOMMENDATIONS');
      setActiveCategory(null);
      setInternalBarrierFreePlaceId(null);
      navigateToSpa('/tips/courses', { tab: 'tips', subPage: 'courses', category: null });
    } else if (page === 'transit' || page === 'transfer') {
      setActiveSection('TRANSIT_TIPS');
      setTransitSection('SUBMENU');
      navigateToSpa('/tips/transit', { tab: 'tips', subPage: 'transit' });
    } else if (page === 'child-free') {
      setActiveSection('TRANSIT_TIPS');
      setTransitSection('CHILD_FREE');
      navigateToSpa('/tips/child-free', { tab: 'tips', subPage: 'child-free' });
    } else if (page === 'bus-qr') {
      setActiveSection('TRANSIT_TIPS');
      setTransitSection('BUS_QR');
      navigateToSpa('/tips/bus-qr', { tab: 'tips', subPage: 'bus-qr' });
    } else if (page === 'taxi') {
      setActiveSection('TRANSIT_TIPS');
      setTransitSection('TAXI');
      navigateToSpa('/tips/taxi', { tab: 'tips', subPage: 'taxi' });
    } else if (page === 'schedule') {
      setActiveSection('SCHEDULE');
      navigateToSpa('/schedule', { tab: 'schedule', subPage: 'schedule' });
    } else if (page === 'community') {
      setActiveSection('COMMUNITY');
    } else if (page === 'exploration') {
      setActiveSection('EXPLORATION');
      setSelectedExplorationItem(null);
      navigateToSpa('/tips/exploration', { tab: 'tips', subPage: 'exploration' });
    }
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  // Synchronize internal activeCategory and section state with changes in initialCategory & tipsSubPage props
  React.useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
      if (initialCategory === 'DAY' || initialCategory === '1NIGHT' || initialCategory === '2NIGHTS' || initialCategory === '3NIGHTS' || initialCategory === '4NIGHTS') {
        setSelectedScheduleDuration(initialCategory);
      }
      setActiveSection('RECOMMENDATIONS');
    } else if (tipsSubPage === 'index') {
      setActiveSection('SELECTION');
      setActiveCategory(null);
      setInternalBarrierFreePlaceId(null);
    } else if (tipsSubPage === 'courses') {
      setActiveSection('RECOMMENDATIONS');
      setActiveCategory(null);
      setInternalBarrierFreePlaceId(null);
    } else if (tipsSubPage === 'transit' || tipsSubPage === 'transfer') {
      setActiveSection('TRANSIT_TIPS');
      setTransitSection('SUBMENU');
    } else if (tipsSubPage === 'child-free') {
      setActiveSection('TRANSIT_TIPS');
      setTransitSection('CHILD_FREE');
    } else if (tipsSubPage === 'bus-qr') {
      setActiveSection('TRANSIT_TIPS');
      setTransitSection('BUS_QR');
    } else if (tipsSubPage === 'taxi') {
      setActiveSection('TRANSIT_TIPS');
      setTransitSection('TAXI');
    } else if (tipsSubPage === 'schedule') {
      setActiveSection('SCHEDULE');
    } else if (tipsSubPage === 'community') {
      setActiveSection('COMMUNITY');
    } else if (tipsSubPage === 'exploration') {
      setActiveSection('EXPLORATION');
    }
  }, [initialCategory, tipsSubPage]);

  const overviewGridRef = useRef<HTMLDivElement>(null);
  const quickPillsRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'itinerary-day': true, // Keep day itinerary open by default for immediate preview when selected
  });
  const [activeTab2Nights, setActiveTab2Nights] = useState<number>(0);
  const [activeTab4Nights, setActiveTab4Nights] = useState<number>(0);
  const [activeDayCourseIndex, setActiveDayCourseIndex] = useState<number>(0);
    const [communityTab, setCommunityTab] = useState<'STANDARD' | 'STEPLESS_GUIDE'>('STANDARD');

  const [selectedGourmetCat, setSelectedGourmetCat] = useState<string>('ALL');
  const [isGourmetSubcatMoreOpen, setIsGourmetSubcatMoreOpen] = useState<boolean>(false);
  const [selectedMarketCat, setSelectedMarketCat] = useState<'ALL' | 'FIVE_DAY'>('ALL');
  const [expandedBranches, setExpandedBranches] = useState<Record<string, boolean>>({});

  // Transit page states
  const [activeTransitCategory, setActiveTransitCategory] = useState<'LINES' | 'BOARDING' | 'EMERGENCY' | 'TRANSITS'>('LINES');
  const [checkedRules, setCheckedRules] = useState<Record<number, boolean>>({});
  const [transitSection, setTransitSection] = useState<'SUBMENU' | 'CHILD_FREE' | 'BUS_QR' | 'TRANSFERS' | 'TAXI'>('SUBMENU');

  // Quiz States
  const [quizActive, setQuizActive] = useState(false);
  const [quizStep, setQuizStep] = useState(0); // 0: Landing inside card, 1~7: Questions 1~7, 8: Result
  const [answers, setAnswers] = useState<('A' | 'B')[]>([]);
  const [internalBarrierFreePlaceId, setInternalBarrierFreePlaceId] = useState<string | null>(initialBarrierFreePlaceId || null);
  const [isCategoryMoreOpen, setIsCategoryMoreOpen] = useState(false);
  const categoryMoreRef = useRef<HTMLDivElement>(null);

  const handleSelectCategory = (category: CategoryType | null) => {
    setActiveCategory(category);
    setIsCategoryMoreOpen(false);
    if (category === 'DAY' || category === '1NIGHT' || category === '2NIGHTS' || category === '3NIGHTS' || category === '4NIGHTS') {
      setSelectedScheduleDuration(category);
    }
    if (category === 'BARRIER_FREE') {
      setInternalBarrierFreePlaceId(null);
      if (onSelectCategory) {
        onSelectCategory('BARRIER_FREE');
      } else {
        navigateToSpa('/barrier-free');
      }
    } else if (category === 'MY_ROUTE') {
      setInternalBarrierFreePlaceId(null);
      if (onSelectCategory) {
        onSelectCategory('MY_ROUTE');
      }
    } else {
      setInternalBarrierFreePlaceId(null);
      if (onSelectCategory) {
        onSelectCategory(category);
      }
    }
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (categoryMoreRef.current && !categoryMoreRef.current.contains(target)) {
        setIsCategoryMoreOpen(false);
      }
    };
    if (isCategoryMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isCategoryMoreOpen]);

  React.useEffect(() => {
    setInternalBarrierFreePlaceId(initialBarrierFreePlaceId || null);
  }, [initialBarrierFreePlaceId]);

  const handleOpenBarrierFreeDetail = (placeId: string) => {
    if (onOpenBarrierFreeDetail) {
      onOpenBarrierFreeDetail(placeId);
      return;
    }
    const targetUrl = `/barrier-free/detail?id=${encodeURIComponent(placeId)}`;
    if (onSelectCategory) {
      onSelectCategory('BARRIER_FREE');
    }
    setActiveCategory('BARRIER_FREE');
    setInternalBarrierFreePlaceId(placeId);
    navigateToSpa(targetUrl, { placeId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [selectedRegion, setSelectedRegion] = useState<'LINE1' | 'LINE2'>('LINE1');
  
  const [localActiveRegionPage, setLocalActiveRegionPage] = useState<'LINE1' | 'LINE2' | null>(null);
  const activeRegionPage = propActiveRegionPage !== undefined ? propActiveRegionPage : localActiveRegionPage;
  const setActiveRegionPage = propSetActiveRegionPage !== undefined ? propSetActiveRegionPage : setLocalActiveRegionPage;

  // Scroll to simulated top of the view/page when the category changes to make it feel like navigating to a new page.
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeCategory, activeSection, transitSection, activeRegionPage, propActiveRegionPage]);

  React.useEffect(() => {
    if (activeRegionPage === 'LINE1' || activeRegionPage === 'LINE2') {
      setSelectedRegion(activeRegionPage);
    }
  }, [activeRegionPage]);

  const [selectedExperienceRegion, setSelectedExperienceRegion] = useState<string>('ALL');
  const [selectedExperienceTheme, setSelectedExperienceTheme] = useState<string>('ALL');
  const [selectedMarketRegion, setSelectedMarketRegion] = useState<string>('ALL');
  const [selectedAttractionRegion, setSelectedAttractionRegion] = useState<string>('ALL');

  const EXPERIENCE_THEME_TABS = [
    { id: 'ALL', nameKo: '전체 카테고리', nameEn: 'All Categories' },
    { id: 'MUSEUM', nameKo: '박물관', nameEn: 'Museums' },
    { id: 'ART', nameKo: '미술관', nameEn: 'Art Galleries' },
    { id: 'SCIENCE_ECO', nameKo: '과학·생태', nameEn: 'Science & Eco' },
    { id: 'CULTURE', nameKo: '복합문화', nameEn: 'Cultural Spaces' },
    { id: 'WORKSHOP', nameKo: '체험관', nameEn: 'Experience Centers' }
  ];

    const GOURMET_CATEGORY_TABS = [
    { id: 'ALL', nameKo: '전체 카테고리', nameEn: 'All Categories' },
    { id: 'famous', nameKo: '부산 대표 유명 맛집', nameEn: 'Famous Eateries' },
    { id: 'restaurant', nameKo: '음식점', nameEn: 'Restaurants' },
    { id: 'cafe', nameKo: '카페', nameEn: 'Cafes' },
    { id: 'bakery', nameKo: '베이커리', nameEn: 'Bakery' },
    { id: 'brunch', nameKo: '브런치', nameEn: 'Brunch' },
    { id: 'market', nameKo: '전통시장', nameEn: 'Traditional Market' },
    { id: 'dessert', nameKo: '디저트', nameEn: 'Dessert' },
    { id: 'other', nameKo: '기타', nameEn: 'Other' },
  ];

  const GOURMET_CATEGORY_MAP: Record<string, { nameKo: string; nameEn: string; icon: string }> = {
    famous: { nameKo: '부산 대표 유명 맛집', nameEn: 'Famous Eateries', icon: '🔥' },
    restaurant: { nameKo: '음식점', nameEn: 'Restaurants', icon: '🍲' },
    cafe: { nameKo: '카페', nameEn: 'Cafes', icon: '☕' },
    bakery: { nameKo: '베이커리', nameEn: 'Bakery', icon: '🥐' },
    brunch: { nameKo: '브런치', nameEn: 'Brunch', icon: '🍳' },
    market: { nameKo: '전통시장', nameEn: 'Traditional Market', icon: '🏬' },
    dessert: { nameKo: '디저트', nameEn: 'Dessert', icon: '🍧' },
    other: { nameKo: '기타', nameEn: 'Other', icon: '✨' },
  };

  const REGION_FILTER_TABS = [
    { id: 'ALL', nameKo: '전체 카테고리', nameEn: 'All Categories', icon: '📍' },
    { id: 'famous', nameKo: '부산 대표 유명 맛집', nameEn: 'Famous Cuisines', icon: '🔥' },
    { id: 'haeundae_gijang', nameKo: '해운대 · 기장', nameEn: 'Haeundae & Gijang', icon: '🌊' },
    { id: 'gwangalli_centum', nameKo: '광안리 · 센텀', nameEn: 'Gwangalli & Centum', icon: '🖼️' },
    { id: 'seomyeon_jeonpo', nameKo: '서면 · 전포', nameEn: 'Seomyeon & Jeonpo', icon: '☕' },
    { id: 'nampo_yeongdo', nameKo: '남포동 · 영도', nameEn: 'Nampo & Yeongdo', icon: '🏙️' },
    { id: 'others', nameKo: '그 외 지역', nameEn: 'Other Regions', icon: '🌿' }
  ];

  const [activeRegionCategory, setActiveRegionCategory] = useState<'LANDMARK' | 'FOOD' | 'CAFE' | 'CULTURE'>('LANDMARK');
  const [selectedStationGroup, setSelectedStationGroup] = useState<string>('ALL');
  const [selectedLine, setSelectedLine] = useState<'LINE1' | 'LINE2'>('LINE1');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [showRealPoster, setShowRealPoster] = useState(false);

  const LINE1_STATION_TABS = [
    { id: 'ALL', nameKo: '전체 역 보기', nameEn: 'All Stations', englishName: 'ALL STATIONS' },
    { id: 'LINE1_BEOMEOSA', nameKo: '범어사역', nameEn: 'Beomeosa Stn', englishName: 'BEOMEOSA' },
    { id: 'LINE1_ONCHEONJANG', nameKo: '온천장역', nameEn: 'Oncheonjang Stn', englishName: 'ONCHEONJANG' },
    { id: 'LINE1_SEOMYEON_BUJEON', nameKo: '서면 · 부전역', nameEn: 'Seomyeon · Bujeon', englishName: 'SEOMYEON · BUJEON' },
    { id: 'LINE1_BUSAN_STN', nameKo: '부산역', nameEn: 'Busan Station', englishName: 'BUSAN STN' },
    { id: 'LINE1_JUNGANG_NAMPO_JAGALCHI', nameKo: '중앙 · 남포 · 자갈치역', nameEn: 'Jungang · Nampo · Jagalchi', englishName: 'JUNGANG · NAMPO · JAGALCHI' },
    { id: 'LINE1_DADAEPO', nameKo: '다대포해수욕장역', nameEn: 'Dadaepo Beach Stn', englishName: 'DADAEPO BEACH' },
  ];

  const LINE2_STATION_TABS = [
    { id: 'ALL', nameKo: '전체 역 보기', nameEn: 'All Stations', englishName: 'ALL STATIONS' },
    { id: 'LINE2_HWAMYEONG', nameKo: '화명역', nameEn: 'Hwamyeong Stn', englishName: 'HWAMYEONG' },
    { id: 'LINE2_DEOKCHEON', nameKo: '덕천역', nameEn: 'Deokcheon Stn', englishName: 'DEOKCHEON' },
    { id: 'LINE2_JEONPO', nameKo: '전포역', nameEn: 'Jeonpo Stn', englishName: 'JEONPO' },
    { id: 'LINE2_GEUMRYEONSAN_GWANGALLI', nameKo: '금련산 · 광안리역', nameEn: 'Geumryeonsan · Gwangalli', englishName: 'GEUMRYEONSAN · GWANGALLI' },
    { id: 'LINE2_CENTUM_CITY', nameKo: '센텀시티역', nameEn: 'Centum City Stn', englishName: 'CENTUM CITY' },
    { id: 'LINE2_HAEUNDAE_DONGBAEK', nameKo: '해운대 · 동백역', nameEn: 'Haeundae · Dongbaek', englishName: 'HAEUNDAE · DONGBAEK' },
  ];

  const handleAnswerSelect = (optionType: 'A' | 'B') => {
    const nextAnswers = [...answers, optionType];
    setAnswers(nextAnswers);
    if (quizStep < quizQuestions.length) {
      setQuizStep(prev => prev + 1);
    } else {
      setQuizStep(8);
    }
  };

  const resetQuiz = () => {
    setAnswers([]);
    setQuizStep(0);
    setQuizActive(false);
  };

  const getQuizResultType = () => {
    const countA = answers.filter(a => a === 'A').length;
    const countB = answers.filter(a => a === 'B').length;
    if (countA >= 5) return 'type1';
    if (countB >= 5) return 'type2';
    return 'type3';
  };

  const getResultDetails = (type: 'type1' | 'type2' | 'type3') => {
    switch (type) {
      case 'type1':
        return {
          titleKo: '💎 화려한 시티 & 럭셔리 힐링형',
          titleEn: '💎 Glamorous City & Luxury Healing',
          subTitleKo: '“해운대의 세련미와 광안리의 눈부신 야경을 온전히 누리는 호캉스 코스”',
          subTitleEn: '"A staycation course fully enjoying Haeundae\'s sophistication and Gwangalli\'s dazzling night views"',
          courseKo: [
            '1일차: 해운대 해수욕장 가벼운 산책 ➔ 마린시티 오션뷰 브런치 ➔ 스파랜드 센텀시티에서 피로 회복 ➔ 수영만 요트경기장에서 노을&야경 요트 투어',
            '2일차: 광안리 해변 뷰 카페 ➔ 더베이 101에서 마천루 인생샷 남기기 ➔ 민락수변공원 복합문화공간 \'밀락더마켓\' 구경'
          ],
          courseEn: [
            'Day 1: Haeundae beach light stroll ➔ Marine City ocean-view brunch ➔ Recover at Spaland Centum City ➔ Sunset & night yacht tour from Suyeongman Yachting Center',
            'Day 2: Gwangalli beachfront cafe ➔ Skyscraper landscape photos at The Bay 101 ➔ Browse Millac the Market cultural hub'
          ],
          hotspotsKo: '해운대 해수욕장, 신세계 센텀시티, 엘시티 엑스더스카이 전망대, 마린시티 영화의 거리',
          hotspotsEn: 'Haeundae Beach, Shinsegae Centum City, LCT X the SKY observatory, Marine City Cinema Street',
          foodKo: '해운대 미포 오션뷰 다이닝(일식/양식), 고급 디저트 카페, 광안리 와인바',
          foodEn: 'Haeundae Mipo ocean-view dining (Japanese/Western), luxury dessert cafes, Gwangalli wine bars',
          tipKo: '요트 투어는 해가 지기 직전인 \'일몰 30분 전(골든타임)\'으로 예약해 보세요! 바다 너머로 지는 노을과 화려하게 불이 켜지는 광안대교를 동시에 감상할 수 있습니다.',
          tipEn: 'Reserve the Yacht Tour for exactly 30 minutes before sunset (Golden hour)! You can enjoy both the glowing red sun and the beautifully lit Gwangan Bridge.',
          bgClass: 'from-orange-50/60 to-orange-100/30 border-orange-200 text-orange-950',
          badgeColor: 'bg-orange-100 text-orange-850'
        };
      case 'type2':
        return {
          titleKo: '📸 레트로 감성 & 로컬 탐험가형',
          titleEn: '📸 Retro Vibe & Local Explorer',
          subTitleKo: '“부산 고유의 정취와 골목길 뒤에 숨겨진 보물을 찾아 나서는 진짜 부산 여행”',
          subTitleEn: '"A true Busan adventure uncovering unique heritage and hidden alleyway treasures"',
          courseKo: [
            '1일차: 감천문화마을 알록달록한 골목 스탬프 투어 ➔ 남포동 BIFF광장 주전부리(씨앗호떡) ➔ 자갈치시장 구경 ➔ 영도 흰여울문화마을 해안 골목길 산책 및 노을 감상',
            '2일차: 영도 깡깡이예술마을 투어 ➔ 영도 빨간등대 ➔ 밤에는 영도대교 밑 포장마차 거리에서 뜨끈한 우동과 꼼장어 구이에 소주 한잔!'
          ],
          courseEn: [
            'Day 1: Gamcheon Culture Village colorful alley stamp tour ➔ Nampodong BIFF Square street food (Seed Hotteok) ➔ Jagalchi Fish Market ➔ Yeongdo Huinnyeoul Culture Village seaside alley stroll & sunset',
            'Day 2: Yeongdo Kangkangee Arts Village tour ➔ Yeongdo Red Lighthouse ➔ Warm udon, grilled eel & local clear spirits under Yeongdo Bridge food carts!'
          ],
          hotspotsKo: '감천문화마을, 흰여울문화마을, 남포동 국제시장&부평깡통시장, 영도 포장마차 거리',
          hotspotsEn: 'Gamcheon Culture Village, Huinnyeoul Culture Village, Nampodong Gukje & Bupyeong Kkangtong Markets, Yeongdo Food Cart Street',
          foodKo: '부산 원조 돼지국밥, 밀면, 비빔당면, 씨앗호떡, 꼼장어 석쇠구이',
          foodEn: 'Original Busan Pork Soup, Milmyeon wheat noodles, spicy glass noodles, Seed Hotteok, fire-grilled sea eel',
          tipKo: '산복도로와 가파른 계단, 골목길 언덕이 많은 코스이므로 구두보다는 꼭 발이 편한 운동화를 신으세요. 골목 구석구석 숨겨진 예쁜 빈티지 소품숍이나 독립서점을 찾는 재미가 쏠쏠합니다.',
          tipEn: 'This route has steep hillside roads, stairs, and slopes, so comfortable sneakers are essential over dress shoes! Enjoy searching for beautiful vintage prop shops or indie bookstores.',
          bgClass: 'from-violet-50/60 to-violet-100/30 border-violet-200 text-violet-950',
          badgeColor: 'bg-violet-100 text-violet-800'
        };
      case 'type3':
        return {
          titleKo: '🌊 트렌디 & 알짜배기 하이브리드형',
          titleEn: '🌊 Trendy & Smart Hybrid',
          subTitleKo: '“현지의 레트로한 감성도, 바다의 트렌디함도 모두 포기할 수 없는 알찬 코스”',
          subTitleEn: '"A packed dynamic itinerary that misses neither retro local warmth nor fashionable sea trends"',
          courseKo: [
            '1일차: 해운대 블루라인파크 (미포 ➔ 청사포 해변열차 또는 캡슐열차) ➔ 청사포 바닷가 조개구이 점심 ➔ 송정 해변에서 서핑 구경 ➔ 저녁에는 힙한 전포 카페거리 골목 탐방',
            '2일차: 영도 피아크(초대형 복합문화공간) ➔ 광안대교가 한눈에 들어오는 루프탑 카페 ➔ 토요일 저녁 광안리 해변 드론쇼 감상'
          ],
          courseEn: [
            'Day 1: Haeundae Blue Line Park (Mipo to Cheongsapo beach trains/capsules) ➔ Seafront grilled clams lunch at Cheongsapo ➔ Watch surfers at Songjeong beach ➔ Explore hip Jeonpo Cafe Street in the evening',
            'Day 2: Yeongdo P.ARK mega cultural hub ➔ Rooftop cafe with open views of Gwangan Bridge ➔ Gwangan Beach Drone Light Show on Saturday night'
          ],
          hotspotsKo: '해운대 블루라인파크, 전포 사잇길(카페거리), 민락더마켓, 청사포 다릿돌전망대',
          hotspotsEn: 'Haeundae Blue Line Park, Jeonpo Cafe Street, Millac the Market, Cheongsapo Daritdol Skywalk',
          foodKo: '청사포 조개구이, 전포동 아기자기한 퓨전 양식, 송정 물회, 비주얼이 뛰어난 디저트류',
          foodEn: 'Cheongsapo grilled clams, cozy Jeonpo-dong fusion cuisines, Songjeong raw fish cold soup, visually stunning desserts',
          tipKo: '매주 토요일 저녁 광안리 해수욕장에서 열리는 \'광안리 M 드론 라이트쇼\' 시간을 미리 확인하여 동선을 짜보세요. 해변가 카페 창가 자리를 미리 예약하는 것도 좋은 방법입니다!',
          tipEn: 'Check the schedule of the weekly "Gwanganri M Drone Light Show" (every Saturday evening) in advance to coordinate your routes. Booking a window seat at a seafront cafe is a great hack!',
          bgClass: 'from-amber-50/60 to-amber-100/30 border-amber-200 text-amber-950',
          badgeColor: 'bg-amber-100 text-amber-850'
        };
    }
  };

  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStepIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Platform':
        return <Train className="w-3.5 h-3.5 text-[#004481]" />;
      case 'Gate':
        return <Compass className="w-3.5 h-3.5 text-[#004481]" />;
      case 'Help':
        return <HelpCircle className="w-3.5 h-3.5 text-[#004481]" />;
      case 'Bus':
        return <Compass className="w-3.5 h-3.5 text-[#004481]" />;
      case 'Taxi':
        return <MapPin className="w-3.5 h-3.5 text-[#004481]" />;
      case 'Walk':
        return <Compass className="w-3.5 h-3.5 text-[#004481]" />;
      case 'Camera':
        return <Compass className="w-3.5 h-3.5 text-[#004481]" />;
      case 'Sunset':
        return <Sunset className="w-3.5 h-3.5 text-[#004481]" />;
      case 'Coffee':
        return <Coffee className="w-3.5 h-3.5 text-[#004481]" />;
      default:
        return <MapPin className="w-3.5 h-3.5 text-[#004481]" />;
    }
  };

  const getCategoryLucideIcon = (id: CategoryType, className: string = "w-5 h-5") => {
    switch (id) {
      case 'DAY':
        return <Sun className={className} />;
      case '1NIGHT':
        return <Moon className={className} />;
      case '2NIGHTS':
        return <Compass className={className} />;
      case '3NIGHTS':
        return <Sunset className={className} />;
      case '4NIGHTS':
        return <Home className={className} />;
      case 'GOURMET':
        return <Utensils className={className} />;
      case 'EXPERIENCE':
        return <Building2 className={className} />;
      case 'SUBWAY':
        return <Train className={className} />;
      case 'ATTRACTION':
        return <Landmark className={className} />;
      default:
        return <MapPin className={className} />;
    }
  };

  const categoriesConfig: CategoryConfig[] = [
    {
      id: 'GOURMET',
      icon: '',
      tagKo: '침샘 가득',
      tagEn: 'Delicious',
      titleKo: '식도락',
      titleEn: 'Gourmet',
      descKo: '마음이 보들보들해지는 원조 돼지국밥 노포 맛집부터 예쁜 카페, 씨앗호떡까지 입구가 평평하고 여유로운 부산 로컬 미식 지도예요.',
      descEn: 'Savor traditional pork soup and hot sweet pancakes on fully flat pedestrian walkways.',
      bgClass: 'bg-rose-50/70 hover:bg-rose-50',
      borderClass: 'border-rose-100 hover:border-rose-200',
      textClass: 'text-rose-950'
    },
    {
      id: 'EXPERIENCE',
      icon: '',
      tagKo: '다채로운 체험',
      tagEn: 'Interactive',
      titleKo: '체험&박물관',
      titleEn: 'Experience & Museum',
      descKo: '국립해양박물관부터 부산시립미술관, F1963 복합문화공간까지 온 가족이 날씨 상관없이 편리한 엘리베이터 동선으로 즐기는 다채로운 체험&박물관 코스예요.',
      descEn: 'Enjoy hands-on exhibitions, maritime museums, and art centers with step-free elevators and wide ramps.',
      bgClass: 'bg-amber-50/70 hover:bg-amber-50',
      borderClass: 'border-amber-100 hover:border-amber-200',
      textClass: 'text-amber-950'
    },
    {
      id: 'MARKET',
      icon: '',
      tagKo: '정겨운 장터',
      tagEn: 'Local Market',
      titleKo: '전통시장',
      titleEn: 'Traditional Market',
      descKo: '부전시장, 자갈치시장, 부평깡통시장, 국제시장 등 지하철역과 바로 이어지는 정겨운 부산 대표 전통시장과 명물 야시장 탐방 코스예요.',
      descEn: 'Explore vibrant local markets including Bujeon, Jagalchi, Bupyeong Kkangtong, and Gukje Market.',
      bgClass: 'bg-amber-50/70 hover:bg-amber-50',
      borderClass: 'border-amber-100 hover:border-amber-200',
      textClass: 'text-amber-950'
    },
    {
      id: 'ATTRACTION',
      icon: '',
      tagKo: '핵심 랜드마크',
      tagEn: 'Landmarks',
      titleKo: '명소',
      titleEn: 'Attractions',
      descKo: '해동 용궁사, 이기대 해안산책로, 태종대 등 부산을 대표하는 명소들을 편안한 동선과 함께 추천해 드려요.',
      descEn: 'Explore Busan’s iconic scenic attractions including Haedong Yonggungsa, Igidae Coastal Walk, and Taejongdae.',
      bgClass: 'bg-sky-50/70 hover:bg-sky-50',
      borderClass: 'border-sky-100 hover:border-sky-200',
      textClass: 'text-sky-950'
    },
    {
      id: 'SUBWAY',
      icon: '',
      tagKo: '1·2호선 노선축',
      tagEn: 'Subway Route',
      titleKo: '부산 도시철도 코스',
      titleEn: 'Busan Metro Course',
      descKo: '부산 지하철 1호선과 2호선 노선축을 따라 편리하게 이동할 수 있는 명소, 맛집, 카페, 문화공간 코스예요.',
      descEn: 'Discover scenic spots, restaurants, cafes, and cultural venues conveniently connected along Busan Metro Lines 1 & 2.',
      bgClass: 'bg-orange-50/70 hover:bg-orange-50',
      borderClass: 'border-orange-100 hover:border-orange-200',
      textClass: 'text-orange-950'
    },
    {
      id: 'BARRIER_FREE',
      icon: '',
      tagKo: '검증된 편의 시설',
      tagEn: 'TourAPI 4.0',
      titleKo: '무장애 관광지',
      titleEn: 'Barrier-Free Spots',
      descKo: '한국관광공사 TourAPI 4.0 및 지자체 데이터 연동! 휠체어, 유모차, 보행 약자를 위한 경사로, 장애인 화장실, 엘리베이터 완비 관광지 정보예요.',
      descEn: 'Accessible tourist spots with ramp details, wheelchair access, and step-free exit links.',
      bgClass: 'bg-blue-50/70 hover:bg-blue-50',
      borderClass: 'border-blue-100 hover:border-blue-200',
      textClass: 'text-blue-950'
    },
    {
      id: 'DAY',
      icon: '',
      tagKo: '싱그러운 디톡스',
      tagEn: 'Eco Detox',
      titleKo: '당일치기',
      titleEn: 'Day Trip',
      descKo: '낙동강 물줄기를 따스하게 감싸 안는 삼락, 맥도, 대저생태공원의 싱그러운 초록 물결 속에서 피로 가득한 몸과 마음에 온전한 쉼을 채우는 하루 힐링 여행 코스예요.',
      descEn: 'A tranquil, barrier-free eco detour through Samnak, Maekdo, and Daejeo Eco Parks along the scenic Nakdong River.',
      bgClass: 'bg-emerald-50/70 hover:bg-emerald-50',
      borderClass: 'border-emerald-100 hover:border-emerald-200',
      textClass: 'text-emerald-900'
    },
    {
      id: '1NIGHT',
      icon: '',
      tagKo: '로맨틱 야경',
      tagEn: 'Night Out',
      titleKo: '1박',
      titleEn: '1 Night',
      descKo: '눈부신 광안대교 야경과 화려한 미디어파사드를 감상하고, 트렌디한 민락더마켓에서 여유로운 밤바다 정취를 나누는 완만한 1박 코스예요.',
      descEn: 'Gaze at the sparkling bridge LED shows and dine at accessible waterfront markets.',
      bgClass: 'bg-violet-50/70 hover:bg-violet-50',
      borderClass: 'border-violet-100 hover:border-violet-200',
      textClass: 'text-violet-900'
    },
    {
      id: '2NIGHTS',
      icon: '',
      tagKo: '감성 골목 & 바다',
      tagEn: 'Art & Marine',
      titleKo: '2박',
      titleEn: '2 Nights',
      descKo: '전포·서면 감성 골목과 바위 절벽의 해동용궁사, 그리고 고즈넉한 수영의 명소들을 완만하게 엮어 이동 편의를 만끽하는 매력적인 2박 코스예요.',
      descEn: 'Enjoy trendy Jeonpo lanes, stunning seaside Haedong Yonggungsa Shrine, and historical Suyeong alleys.',
      bgClass: 'bg-amber-50/70 hover:bg-amber-50',
      borderClass: 'border-amber-100 hover:border-amber-200',
      textClass: 'text-amber-900'
    },
    {
      id: '3NIGHTS',
      icon: '',
      tagKo: '에코 에코',
      tagEn: 'Eco Rest',
      titleKo: '3박',
      titleEn: '3 Nights',
      descKo: '영도 푸른 바다의 영롱한 수평선 뷰와, 졸졸 시냇물 소리가 매력적인 예쁜 꽃밭 산책로인 온천천 수변공원을 함께 여행하는 힐링 코스예요.',
      descEn: 'Traverse scenic clifftops of Yeongdo and scenic bamboo waterway paths with modern ramps.',
      bgClass: 'bg-emerald-50/70 hover:bg-emerald-50',
      borderClass: 'border-emerald-100 hover:border-emerald-200',
      textClass: 'text-emerald-950'
    },
    {
      id: '4NIGHTS',
      icon: '',
      tagKo: '내 집처럼',
      tagEn: 'Deep Stay',
      titleKo: '4박',
      titleEn: '4 Nights',
      descKo: '지하철 역의 편안한 동선 안내와 쾌적한 실내 복합 쇼핑몰 센텀시티를 중심으로 아늑하고 다정한 시간을 누리는 부산 장기 체류 마스터 코스예요.',
      descEn: 'The absolute travel guide exploring deep scenic corners and spacious air-conditioned mega malls.',
      bgClass: 'bg-sky-50/70 hover:bg-sky-50',
      borderClass: 'border-sky-100 hover:border-sky-200',
      textClass: 'text-sky-950'
    }
  ];

  const isScheduleActive = 
    activeCategory === 'SCHEDULE' || 
    activeCategory === 'DAY' || 
    activeCategory === '1NIGHT' || 
    activeCategory === '2NIGHTS' || 
    activeCategory === '3NIGHTS' || 
    activeCategory === '4NIGHTS';

  const filteredCourses = activeCategory 
    ? BUSAN_ITINERARIES.filter((course) => {
        if (activeCategory === 'ATTRACTION') {
          return course.category === 'ATTRACTION';
        }
        if (activeCategory === 'MARKET') {
          return course.category === 'MARKET';
        }
        if (activeCategory === '2NIGHTS') {
          return course.category === '2NIGHTS';
        }
        if (activeCategory === '3NIGHTS') {
          return course.category === '3NIGHTS';
        }
        if (activeCategory === 'SCHEDULE') {
          if (selectedScheduleDuration === '2NIGHTS') {
            return course.category === '2NIGHTS';
          }
          if (selectedScheduleDuration === '3NIGHTS') {
            return course.category === '3NIGHTS';
          }
          return course.category === (selectedScheduleDuration || 'DAY');
        }
        return course.category === activeCategory;
      })
    : [];

  const activeCategoryConfig = categoriesConfig.find(c => c.id === activeCategory);

  return (
    <div className={`${activeSection === 'SELECTION' || activeSection === 'SCHEDULE' ? 'space-y-1 sm:space-y-2' : 'space-y-6 sm:space-y-8'} text-left animate-fade-in max-w-5xl mx-auto`} id="busan-itineraries-container">
      {/* Dynamic Seagull & Sea Styles Injector */}
      <style>{`
        @keyframes subtle-boat {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-wing {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }
        @keyframes custom-ripple {
          0% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.08); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.15; }
        }
        .animate-boat {
          animation: subtle-boat 4.5s ease-in-out infinite;
        }
        .animate-seagull {
          animation: float-wing 3.2s ease-in-out infinite;
        }
        .animate-pulse-ring {
          animation: custom-ripple 3s ease-in-out infinite;
        }
      `}</style>

      {/* Top Breadcrumb & Back Bar for Detailed Views */}
      {activeSection !== 'SELECTION' && (
        <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-[#E5E2DC] font-sans text-left">
          <button
            type="button"
            onClick={() => {
              if (selectedExplorationItem && activeSection === 'EXPLORATION') {
                handleSelectExplorationItem(null);
              } else if (activeSection === 'TRANSIT_TIPS' && transitSection !== 'SUBMENU') {
                navigateToSubPage('transit');
              } else {
                navigateToSubPage('index');
              }
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#F1EFEC] hover:bg-[#E5E2DC] text-[#0A2540] font-bold text-xs sm:text-sm transition-all cursor-pointer border border-[#E5E2DC]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              {selectedExplorationItem && activeSection === 'EXPLORATION'
                ? (language === 'KR' ? '탐구생활 목록으로 돌아가기' : 'Back to Exploration List')
                : (activeSection === 'TRANSIT_TIPS' && transitSection !== 'SUBMENU'
                  ? (language === 'KR' ? '대중교통 이용 팁으로 돌아가기' : 'Back to Public Transit Tips')
                  : (language === 'KR' ? '여행 팁 허브로 돌아가기' : 'Back to Travel Tips Hub'))}
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#4A5568]">
            <button
              type="button"
              onClick={() => navigateToSubPage('index')}
              className="hover:underline text-[#4A5568] cursor-pointer"
            >
              {language === 'KR' ? '여행 팁' : 'Travel Tips'}
            </button>
            <span>/</span>
            {activeSection === 'TRANSIT_TIPS' && transitSection !== 'SUBMENU' ? (
              <>
                <button
                  type="button"
                  onClick={() => navigateToSubPage('transit')}
                  className="hover:underline text-[#4A5568] cursor-pointer"
                >
                  {language === 'KR' ? '대중교통 이용 팁' : 'Public Transit Tips'}
                </button>
                <span>/</span>
                <span className="font-bold text-[#11161B]">
                  {transitSection === 'CHILD_FREE' && (language === 'KR' ? '어린이 요금 무료 안내' : 'Child Free Fare Guide')}
                  {transitSection === 'BUS_QR' && (language === 'KR' ? '부산 버스 QR 간편결제 가이드' : 'Busan Bus QR Pay Guide')}
                  {transitSection === 'TAXI' && (language === 'KR' ? '부산 택시 이용 팁' : 'Busan Taxi Tips')}
                </span>
              </>
            ) : (
              <span className="font-bold text-[#11161B]">
                {activeSection === 'TRANSIT_TIPS' && (language === 'KR' ? '대중교통 이용 팁' : 'Public Transit Tips')}
                {activeSection === 'RECOMMENDATIONS' && (
                  activeCategory ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCategory(null);
                          navigateToSubPage('courses');
                        }}
                        className="hover:underline text-[#4A5568] cursor-pointer font-normal"
                      >
                        {language === 'KR' ? '여행 코스 추천' : 'Recommended Itineraries'}
                      </button>
                      <span className="mx-1 font-normal text-[#4A5568]">/</span>
                      <span className="font-bold text-[#11161B]">
                        {activeCategoryConfig ? (language === 'KR' ? activeCategoryConfig.titleKo : activeCategoryConfig.titleEn) : activeCategory}
                      </span>
                    </>
                  ) : (language === 'KR' ? '여행 코스 추천' : 'Recommended Itineraries')
                )}
                {activeSection === 'SCHEDULE' && (language === 'KR' ? '부산 주요 일정표' : 'Busan Events & Schedule')}
                {activeSection === 'COMMUNITY' && (language === 'KR' ? '실시간 부산 여행 팁 커뮤니티' : 'Live Busan Travel Tips')}
                {activeSection === 'EXPLORATION' && (
                  selectedExplorationItem ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSelectExplorationItem(null)}
                        className="hover:underline text-[#4A5568] cursor-pointer font-normal"
                      >
                        {language === 'KR' ? '부산 탐구생활' : 'Busan Exploration'}
                      </button>
                      <span className="mx-1 font-normal text-[#4A5568]">/</span>
                      <span className="font-bold text-[#11161B]">
                        {selectedExplorationItem === 'bootech' && (language === 'KR' ? "북항 상어 '부캉이'" : 'North Port Shark Bukangi')}
                        {selectedExplorationItem === 'luggage' && (language === 'KR' ? '부산 무료 짐보관소' : 'Free Luggage Storage')}
                        {selectedExplorationItem === 'rental' && (language === 'KR' ? '유모차·휠체어 대여' : 'Stroller & Wheelchair')}
                        {(selectedExplorationItem === 'korean-cheat-codes' || selectedExplorationItem === 'metro-reentry') && (language === 'KR' ? '5초 한국어 발음 치트키' : 'Korean Cheat Codes')}
                      </span>
                    </>
                  ) : (language === 'KR' ? '부산 탐구생활' : 'Busan Exploration')
                )}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: TRAVEL TIPS HUB OVERVIEW (부산 여행에 대한 모든 것)                 */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* VIEW 1: TRAVEL TIPS HUB OVERVIEW (부산 여행에 대한 모든 것)                 */}
      {/* ========================================================================= */}
      {activeSection === 'SELECTION' && (
        <div className="font-sans">
          {/* [모바일 전용] 컴팩트 뷰: 스크롤 최소화, 부가설명 최소화, 박스 전체 클릭 즉시 이동, 하단 버튼 제거 */}
          <div className="md:hidden space-y-2.5 animate-fade-in text-left">
            {/* Header Banner (모바일 최소화) */}
            <div className="space-y-0.5 pt-0.5 pb-0.5 text-left">
              <h2 className="text-lg font-black text-[#11161B] tracking-tight">
                {language === 'KR' ? '부산 여행 팁 허브' : 'Busan Travel Tips Hub'}
              </h2>
              <p className="text-xs text-[#4A5568]">
                {language === 'KR' 
                  ? '대중교통 이용 팁, 추천 여행 코스, 축제 일정을 확인하세요.' 
                  : 'Essential public transit tips, recommended courses, and event schedules.'}
              </p>
            </div>

            {/* 4 Compact Category Cards (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {/* Card 1: 대중교통 이용 팁 */}
              <div
                onClick={() => navigateToSubPage('transit')}
                className="group bg-white p-3 rounded-xl border border-[#E5E2DC] hover:border-[#8EA85E] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between text-left relative"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#8EA85E] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                      <Train className="w-4 h-4" />
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#718096] group-hover:text-[#0A2540] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#11161B] group-hover:text-[#0A2540] transition-colors leading-snug">
                      {language === 'KR' ? '대중교통 이용 팁' : 'Transit Tips'}
                    </h3>
                    <span className="text-[10px] text-[#4A5568] font-medium mt-0.5 block truncate">
                      {language === 'KR' ? '지하철·무료환승 요령' : 'Subway & Transfer'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: 여행 코스 추천 */}
              <div
                onClick={() => navigateToSubPage('courses')}
                className="group bg-white p-3 rounded-xl border border-[#E5E2DC] hover:border-[#8EA85E] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between text-left relative"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#8EA85E] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                      <Compass className="w-4 h-4" />
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#718096] group-hover:text-[#0A2540] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#11161B] group-hover:text-[#0A2540] transition-colors leading-snug">
                      {language === 'KR' ? '여행 코스 추천' : 'Itineraries'}
                    </h3>
                    <span className="text-[10px] text-[#4A5568] font-medium mt-0.5 block truncate">
                      {language === 'KR' ? '테마별·일정별 코스' : 'Themes & Duration'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: 부산 주요 일정표 */}
              <div
                onClick={() => navigateToSubPage('schedule')}
                className="group bg-white p-3 rounded-xl border border-[#E5E2DC] hover:border-[#8EA85E] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between text-left relative"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#8EA85E] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#718096] group-hover:text-[#0A2540] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#11161B] group-hover:text-[#0A2540] transition-colors leading-snug">
                      {language === 'KR' ? '부산 주요 일정표' : 'Event Schedule'}
                    </h3>
                    <span className="text-[10px] text-[#4A5568] font-medium mt-0.5 block truncate">
                      {language === 'KR' ? '축제·드론쇼·행사' : 'Festivals & Events'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 4: 부산 탐구생활 (실시간 커뮤니티 위치에 배치) */}
              <div
                onClick={() => navigateToSubPage('exploration')}
                className="group bg-white p-3 rounded-xl border border-[#E5E2DC] hover:border-[#8EA85E] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between text-left relative"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#8EA85E] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                      <Compass className="w-4 h-4" />
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#718096] group-hover:text-[#0A2540] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#11161B] group-hover:text-[#0A2540] transition-colors leading-snug">
                      {language === 'KR' ? '부산 탐구생활' : 'Busan Life & Tips'}
                    </h3>
                    <span className="text-[10px] text-[#4A5568] font-medium mt-0.5 block truncate">
                      {language === 'KR' ? '로컬만이 아는 꿀팁부터 요즘 핫한 부산 소식까지!' : 'Local hacks & trending Busan news'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 5: 실시간 커뮤니티 (부산 주요 일정표 아래로 이동) */}
              <a
                href="https://www.reddit.com/r/BusanTravelTips/"
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 group bg-white p-3 rounded-xl border border-[#E5E2DC] hover:border-[#8EA85E] hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between text-left relative"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#8EA85E] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#11161B] group-hover:text-[#0A2540] transition-colors leading-snug truncate">
                      {language === 'KR' ? '실시간 부산 여행 팁 커뮤니티' : 'Live Community'}
                    </h3>
                    <span className="text-[10px] text-[#4A5568] font-medium block truncate">
                      {language === 'KR' ? '레딧 실시간 Q&A 및 현장 정보' : 'Reddit Real-time Q&A'}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#718096] group-hover:text-[#0A2540] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </a>
            </div>
          </div>

          {/* [웹/데스크톱 전용] Image 2 원본 화면 100% 동일 복구 */}
          <div className="hidden md:block space-y-4 sm:space-y-5 animate-fade-in text-left">
            {/* Header Banner */}
            <div className="space-y-2 pt-1 text-left">
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                {language === 'KR' ? '부산 여행을 더 편하게' : 'Make Your Busan Trip Easier'}
              </h1>
              <p className="text-sm text-slate-500 max-w-3xl leading-relaxed">
                {language === 'KR' 
                  ? '부산을 여행하기 전에 알아두면 좋은 정보부터 현지인이 추천하는 여행 코스까지 한곳에서 확인하세요.' 
                  : 'Everything you need before visiting Busan—from essential transit tips to curated local itineraries.'}
              </p>
            </div>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {/* Card 1: TRANSIT GUIDE - 대중교통 이용 팁 */}
              <div
                onClick={() => navigateToSubPage('transit')}
                className="group bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-slate-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#8EA85E] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Train className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">
                          TRANSIT GUIDE
                        </span>
                        <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#0A2540] transition-colors">
                          {language === 'KR' ? '대중교통 이용 팁' : 'Transit Tips'}
                        </h2>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-3 mb-4">
                    {language === 'KR'
                      ? '부산 지하철 노선 요약부터 어린이 무료 대중교통 이용 방법, 30분 무료 환승 요령 등 여행에 필요한 교통 정보를 제공합니다.'
                      : 'Essential transit information covering Metro summaries, free child transit, 30-min transfer tricks, and key logistics.'}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-[#0A2540]">
                  <span>{language === 'KR' ? '교통가이드 보기' : 'View Transit Guide'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2: RECOMMENDED ITINERARIES - 여행 코스 추천 */}
              <div
                onClick={() => navigateToSubPage('courses')}
                className="group bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-slate-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#8EA85E] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Compass className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">
                          RECOMMENDED ITINERARIES
                        </span>
                        <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#0A2540] transition-colors">
                          {language === 'KR' ? '여행 코스 추천' : 'Recommended Itineraries'}
                        </h2>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-3 mb-4">
                    {language === 'KR'
                      ? '현지인이 직접 확인하고 설계한 힐링 및 테마 코스를 추천합니다.'
                      : 'Carefully verified healing and theme-based travel routes curated by local experts.'}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-[#0A2540]">
                  <span>{language === 'KR' ? '추천 코스 탐색하기' : 'Explore Itineraries'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 3: EVENTS & FESTIVALS - 부산 주요 일정표 */}
              <div
                onClick={() => navigateToSubPage('schedule')}
                className="group bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-slate-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#8EA85E] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">
                          EVENTS & FESTIVALS
                        </span>
                        <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#0A2540] transition-colors">
                          {language === 'KR' ? '부산 주요 일정표' : 'Events & Festivals'}
                        </h2>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-3 mb-4">
                    {language === 'KR'
                      ? '부산의 주요 축제, 드론쇼, 불꽃축제 등 여행 일정과 연계할 수 있는 주요 행사를 안내합니다.'
                      : 'Key festival and cultural event schedules such as Gwangalli drone shows and Fireworks Festival.'}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-[#0A2540]">
                  <span>{language === 'KR' ? '일정표 확인하기' : 'Check Schedule'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 4: BUSAN LIFE & TIPS - 부산 탐구생활 (실시간 커뮤니티 위치) */}
              <div
                onClick={() => navigateToSubPage('exploration')}
                className="group bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-slate-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#8EA85E] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Compass className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">
                          BUSAN LIFE & TIPS
                        </span>
                        <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#0A2540] transition-colors">
                          {language === 'KR' ? '부산 탐구생활' : 'Busan Life & Tips'}
                        </h2>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-3 mb-4">
                    {language === 'KR'
                      ? '로컬만이 아는 꿀팁부터 요즘 핫한 부산 소식까지!'
                      : 'From local insider hacks to the hottest trending Busan news!'}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-[#0A2540]">
                  <span>{language === 'KR' ? '탐구생활 보러가기' : 'Explore Busan Life & Tips'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 5: COMMUNITY & REDDIT - 실시간 부산 여행 팁 커뮤니티 (부산 주요 일정표 아래로 이동) */}
              <a
                href="https://www.reddit.com/r/BusanTravelTips/"
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 group bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-slate-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left block"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#8EA85E] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">
                      COMMUNITY & REDDIT
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#0A2540] transition-colors">
                      {language === 'KR' ? '실시간 부산 여행 팁 커뮤니티' : 'Live Community'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                      {language === 'KR'
                        ? '레딧에서 부산 현지 여행자와 주민들이 실시간으로 주고받는 질문과 답변, 이동 꿀팁 및 현장 상황을 확인해 보세요.'
                        : 'Ask questions and check real-time traveler discussions, local recommendations, and tips on Reddit.'}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2 text-xs font-bold text-slate-800 group-hover:text-[#0A2540]">
                  <span>{language === 'KR' ? '커뮤니티 이동하기' : 'Go to Community'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'RECOMMENDATIONS' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Top Primary Category Navigation Bar: Only visible inside sub-categories to eliminate duplicate lists on main screen */}
          {activeCategory !== null && (
            <div className="bg-white p-2.5 sm:p-3.5 rounded-xl border border-[#E5E2DC] shadow-[0_1px_4px_rgba(0,0,0,0.03)] space-y-2.5 animate-fade-in text-left">
              {/* DESKTOP (md+): Full horizontal category nav bar */}
              <div 
                ref={quickPillsRef}
                className="hidden md:flex items-center gap-1.5 sm:gap-2 w-full overflow-x-auto no-scrollbar scrollbar-none whitespace-nowrap flex-nowrap py-0.5"
                id="main-categories-nav-bar"
              >
                {/* 1. 전체 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCategory(null);
                  }}
                  className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border whitespace-nowrap shrink-0 text-center ${
                    activeCategory === null
                      ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs'
                      : 'bg-white hover:bg-[#FBFBF9] text-[#11161B] border-[#E5E2DC]'
                  }`}
                >
                  {language === 'KR' ? '전체' : 'All'}
                </button>

                {/* 2. 식도락 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCategory('GOURMET');
                  }}
                  className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border whitespace-nowrap shrink-0 text-center ${
                    activeCategory === 'GOURMET'
                      ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs'
                      : 'bg-white hover:bg-[#FBFBF9] text-[#11161B] border-[#E5E2DC]'
                  }`}
                >
                  {language === 'KR' ? '식도락' : 'Gourmet'}
                </button>

                {/* 3. 체험&박물관 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCategory('EXPERIENCE');
                  }}
                  className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border whitespace-nowrap shrink-0 text-center ${
                    activeCategory === 'EXPERIENCE'
                      ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs'
                      : 'bg-white hover:bg-[#FBFBF9] text-[#11161B] border-[#E5E2DC]'
                  }`}
                >
                  {language === 'KR' ? '체험&박물관' : 'Experience & Museum'}
                </button>

                {/* 4. 전통시장 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCategory('MARKET');
                  }}
                  className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border whitespace-nowrap shrink-0 text-center ${
                    activeCategory === 'MARKET'
                      ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs'
                      : 'bg-white hover:bg-[#FBFBF9] text-[#11161B] border-[#E5E2DC]'
                  }`}
                >
                  {language === 'KR' ? '전통시장' : 'Traditional Market'}
                </button>

                {/* 5. 명소 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCategory('ATTRACTION');
                  }}
                  className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border whitespace-nowrap shrink-0 text-center ${
                    activeCategory === 'ATTRACTION'
                      ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs'
                      : 'bg-white hover:bg-[#FBFBF9] text-[#11161B] border-[#E5E2DC]'
                  }`}
                >
                  {language === 'KR' ? '명소' : 'Attractions'}
                </button>

                {/* 6. 일정별 여행 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const targetDuration = selectedScheduleDuration || 'DAY';
                    handleSelectCategory(targetDuration);
                  }}
                  className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border whitespace-nowrap shrink-0 text-center ${
                    isScheduleActive
                      ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs'
                      : 'bg-white hover:bg-[#FBFBF9] text-[#11161B] border-[#E5E2DC]'
                  }`}
                >
                  {language === 'KR' ? '일정별 여행' : 'Itinerary by Duration'}
                </button>

                {/* 7. 부산 도시철도 코스 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCategory('SUBWAY');
                  }}
                  className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border whitespace-nowrap shrink-0 text-center ${
                    activeCategory === 'SUBWAY'
                      ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs'
                      : 'bg-white hover:bg-[#FBFBF9] text-[#11161B] border-[#E5E2DC]'
                  }`}
                >
                  {language === 'KR' ? '부산 도시철도 코스' : 'Subway Course'}
                </button>

                {/* 8. 무장애 관광지 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCategory('BARRIER_FREE');
                  }}
                  className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border whitespace-nowrap shrink-0 text-center ${
                    activeCategory === 'BARRIER_FREE'
                      ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs'
                      : 'bg-white hover:bg-[#FBFBF9] text-[#11161B] border-[#E5E2DC]'
                  }`}
                >
                  {language === 'KR' ? '무장애 관광지' : 'Barrier-Free Spots'}
                </button>

                {/* 9. 내 여행 루트 (지도) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCategory('MY_ROUTE');
                  }}
                  className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border whitespace-nowrap shrink-0 text-center flex items-center gap-1.5 ${
                    activeCategory === 'MY_ROUTE'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                      : 'bg-amber-50/70 hover:bg-amber-100 text-amber-950 border-amber-300'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${myRouteCount > 0 ? 'fill-amber-400 text-amber-500' : ''}`} />
                  <span>{language === 'KR' ? '내 여행 루트' : 'My Route'}</span>
                  {myRouteCount > 0 && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      activeCategory === 'MY_ROUTE' ? 'bg-white text-amber-700' : 'bg-amber-200 text-amber-900'
                    }`}>
                      {myRouteCount}
                    </span>
                  )}
                </button>
              </div>

              {/* MOBILE (< md): '전체' + '현재 카테고리' + '더보기 ▾' dropdown */}
              <div className="md:hidden relative" ref={categoryMoreRef}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
                    {/* 전체 버튼 */}
                    <button
                      type="button"
                      id="itinerary-mobile-tab-all"
                      onClick={() => {
                        if (onSelectCategory) {
                          onSelectCategory(null);
                        }
                        setActiveCategory(null);
                        setIsCategoryMoreOpen(false);
                      }}
                      className={`px-3 py-2 rounded-md text-xs font-bold transition-all duration-200 cursor-pointer border shrink-0 ${
                        activeCategory === null
                          ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs'
                          : 'bg-white text-[#11161B] border-[#E5E2DC] hover:bg-slate-50'
                      }`}
                    >
                      {language === 'KR' ? '전체' : 'All'}
                    </button>

                    {/* 현재 선택된 카테고리 뱃지 */}
                    {activeCategory !== null && (
                      <button
                        type="button"
                        onClick={() => setIsCategoryMoreOpen(prev => !prev)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold bg-[#8EA85E] text-white border border-[#8EA85E] truncate max-w-[170px] shadow-2xs cursor-pointer text-left"
                        title={language === 'KR' ? '카테고리 목록 열기' : 'View all categories'}
                      >
                        <span className="truncate">
                          {activeCategory === 'GOURMET' && (language === 'KR' ? '식도락' : 'Gourmet')}
                          {activeCategory === 'EXPERIENCE' && (language === 'KR' ? '체험&박물관' : 'Experience')}
                          {activeCategory === 'MARKET' && (language === 'KR' ? '전통시장' : 'Market')}
                          {activeCategory === 'ATTRACTION' && (language === 'KR' ? '명소' : 'Attraction')}
                          {isScheduleActive && (language === 'KR' ? '일정별 여행' : 'Itinerary')}
                          {activeCategory === 'SUBWAY' && (language === 'KR' ? '부산 도시철도' : 'Subway')}
                          {activeCategory === 'BARRIER_FREE' && (language === 'KR' ? '무장애 관광지' : 'Barrier-Free')}
                          {activeCategory === 'MY_ROUTE' && (language === 'KR' ? '내 여행 루트' : 'My Route')}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* 더보기 버튼 */}
                  <div className="shrink-0">
                    <button
                      type="button"
                      id="itinerary-mobile-more-btn"
                      onClick={() => setIsCategoryMoreOpen(prev => !prev)}
                      aria-expanded={isCategoryMoreOpen}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all cursor-pointer border ${
                        isCategoryMoreOpen
                          ? 'bg-[#8EA85E]/15 text-[#8EA85E] border-[#8EA85E] ring-2 ring-[#8EA85E]/20'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-[#E5E2DC]'
                      }`}
                    >
                      <span>{language === 'KR' ? '더보기' : 'More'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryMoreOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* 더보기 카테고리 전체 목록 (모바일 화면 전체 너비로 깔끔하고 시원하게 표시) */}
                {isCategoryMoreOpen && (
                  <div 
                    className="mt-2.5 pt-2.5 border-t border-slate-100 animate-fade-in space-y-2 text-left"
                    role="region"
                    aria-label="All Itinerary Categories"
                  >
                    <div className="flex items-center justify-between px-0.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {language === 'KR' ? '여행 코스 전체 카테고리' : 'All Itinerary Categories'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {language === 'KR' ? '탭하여 이동' : 'Tap to select'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                      {[
                        { id: null, labelKR: '전체 (목록 보기)', labelEN: 'All Categories', icon: Compass },
                        { id: 'GOURMET', labelKR: '식도락', labelEN: 'Gourmet', icon: Utensils },
                        { id: 'EXPERIENCE', labelKR: '체험&박물관', labelEN: 'Experience', icon: Sparkles },
                        { id: 'MARKET', labelKR: '전통시장', labelEN: 'Traditional Market', icon: Store },
                        { id: 'ATTRACTION', labelKR: '명소', labelEN: 'Attractions', icon: MapPin },
                        { id: 'DAY', labelKR: '일정별 여행', labelEN: 'Itinerary Course', icon: Calendar },
                        { id: 'SUBWAY', labelKR: '부산 도시철도', labelEN: 'Subway Course', icon: Train },
                        { id: 'BARRIER_FREE', labelKR: '무장애 관광지', labelEN: 'Barrier-Free', icon: Footprints },
                        { id: 'MY_ROUTE', labelKR: '내 여행 루트', labelEN: 'My Route', icon: Star },
                      ].map((catItem) => {
                        const isCatActive = catItem.id === null 
                          ? activeCategory === null 
                          : (catItem.id === 'DAY' ? isScheduleActive : activeCategory === catItem.id);
                        const IconComponent = catItem.icon;
                        const isMyRoute = catItem.id === 'MY_ROUTE';

                        return (
                          <button
                            key={String(catItem.id)}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (catItem.id === null) {
                                handleSelectCategory(null);
                              } else if (catItem.id === 'DAY') {
                                const targetDuration = selectedScheduleDuration || 'DAY';
                                handleSelectCategory(targetDuration);
                              } else {
                                handleSelectCategory(catItem.id as any);
                              }
                            }}
                            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border text-left ${
                              isMyRoute
                                ? (isCatActive 
                                    ? 'bg-amber-500 text-white border-amber-500 shadow-2xs' 
                                    : 'bg-amber-50/70 hover:bg-amber-100 text-amber-950 border-amber-300')
                                : (isCatActive 
                                    ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs' 
                                    : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border-slate-200/80')
                            }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <IconComponent className={`w-3.5 h-3.5 shrink-0 ${
                                isCatActive 
                                  ? 'text-white' 
                                  : (isMyRoute ? 'text-amber-600' : 'text-[#8EA85E]')
                              }`} />
                              <span className="truncate">{language === 'KR' ? catItem.labelKR : catItem.labelEN}</span>
                            </div>
                            {isMyRoute && myRouteCount > 0 && (
                              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                                isCatActive ? 'bg-white text-amber-700' : 'bg-amber-200 text-amber-900'
                              }`}>
                                {myRouteCount}
                              </span>
                            )}
                            {isCatActive && !isMyRoute && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 ml-1" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>


            </div>
          )}

          {/* Main Container: Mobile Compact View (ㅁㅁㅁㅁ / ㅁㅁㅁㅁ) VS Web Rich Cards with Full Explanations */}
          {activeCategory === null && (
            <div className="animate-fade-in py-1">
              {/* [모바일 전용] 4열 2행 (ㅁㅁㅁㅁ / ㅁㅁㅁㅁ) 컴팩트 그리드: 부가설명 없이 한 화면에 전체 표시 */}
              <div className="md:hidden space-y-3 py-1">
                <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full mx-auto">
                  {/* 1. 식도락 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCategory('GOURMET');
                    }}
                    className="bg-white rounded-xl border border-[#E5E2DC] hover:border-[#8EA85E] hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer group p-2 text-center min-h-[95px] w-full focus:outline-none focus:ring-2 focus:ring-[#8EA85E]/30 active:scale-[0.98]"
                  >
                    <div className="bg-[#FBFBF9] rounded-lg p-1 flex items-center justify-center group-hover:bg-[#F1EFEC] transition-colors border border-[#E5E2DC] h-14 w-full overflow-hidden pointer-events-none">
                      <FoodieIllustration className="w-full h-11 max-w-[85px] mx-auto object-contain" />
                    </div>
                    <div className="pt-1.5 pointer-events-none w-full">
                      <h3 className="text-[11px] font-bold text-[#11161B] group-hover:text-[#0A2540] transition-colors tracking-tight whitespace-nowrap text-center">
                        {language === 'KR' ? '식도락' : 'Foodie'}
                      </h3>
                    </div>
                  </button>

                  {/* 2. 체험&박물관 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCategory('EXPERIENCE');
                    }}
                    className="bg-white rounded-xl border border-[#E5E2DC] hover:border-[#8EA85E] hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer group p-2 text-center min-h-[95px] w-full focus:outline-none focus:ring-2 focus:ring-[#8EA85E]/30 active:scale-[0.98]"
                  >
                    <div className="bg-[#FBFBF9] rounded-lg p-1 flex items-center justify-center group-hover:bg-[#F1EFEC] transition-colors border border-[#E5E2DC] h-14 w-full overflow-hidden pointer-events-none">
                      <ExperienceIllustration className="w-full h-11 max-w-[85px] mx-auto object-contain" />
                    </div>
                    <div className="pt-1.5 pointer-events-none w-full">
                      <h3 className="text-[11px] font-bold text-[#11161B] group-hover:text-[#0A2540] transition-colors tracking-tight whitespace-nowrap text-center">
                        {language === 'KR' ? '체험&박물관' : 'Experience'}
                      </h3>
                    </div>
                  </button>

                  {/* 3. 전통시장 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCategory('MARKET');
                    }}
                    className="bg-white rounded-xl border border-[#E5E2DC] hover:border-[#8EA85E] hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer group p-2 text-center min-h-[95px] w-full focus:outline-none focus:ring-2 focus:ring-[#8EA85E]/30 active:scale-[0.98]"
                  >
                    <div className="bg-[#FBFBF9] rounded-lg p-1 flex items-center justify-center group-hover:bg-[#F1EFEC] transition-colors border border-[#E5E2DC] h-14 w-full overflow-hidden pointer-events-none">
                      <TraditionalMarketIllustration className="w-full h-11 max-w-[85px] mx-auto object-contain" />
                    </div>
                    <div className="pt-1.5 pointer-events-none w-full">
                      <h3 className="text-[11px] font-bold text-[#11161B] group-hover:text-[#0A2540] transition-colors tracking-tight whitespace-nowrap text-center">
                        {language === 'KR' ? '전통시장' : 'Market'}
                      </h3>
                    </div>
                  </button>

                  {/* 4. 명소 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCategory('ATTRACTION');
                    }}
                    className="bg-white rounded-xl border border-[#E5E2DC] hover:border-[#8EA85E] hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer group p-2 text-center min-h-[95px] w-full focus:outline-none focus:ring-2 focus:ring-[#8EA85E]/30 active:scale-[0.98]"
                  >
                    <div className="bg-[#FBFBF9] rounded-lg p-1 flex items-center justify-center group-hover:bg-[#F1EFEC] transition-colors border border-[#E5E2DC] h-14 w-full overflow-hidden pointer-events-none">
                      <AttractionIllustration className="w-full h-11 max-w-[85px] mx-auto object-contain" />
                    </div>
                    <div className="pt-1.5 pointer-events-none w-full">
                      <h3 className="text-[11px] font-bold text-[#11161B] group-hover:text-[#0A2540] transition-colors tracking-tight whitespace-nowrap text-center">
                        {language === 'KR' ? '명소' : 'Attractions'}
                      </h3>
                    </div>
                  </button>

                  {/* 5. 일정별 여행 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const targetDuration = selectedScheduleDuration || 'DAY';
                      handleSelectCategory(targetDuration);
                    }}
                    className="bg-white rounded-xl border border-[#E5E2DC] hover:border-[#8EA85E] hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer group p-2 text-center min-h-[95px] w-full focus:outline-none focus:ring-2 focus:ring-[#8EA85E]/30 active:scale-[0.98]"
                  >
                    <div className="bg-[#FBFBF9] rounded-lg p-1 flex items-center justify-center group-hover:bg-[#F1EFEC] transition-colors border border-[#E5E2DC] h-14 w-full overflow-hidden pointer-events-none">
                      <ItineraryIllustration className="w-full h-11 max-w-[85px] mx-auto object-contain" />
                    </div>
                    <div className="pt-1.5 pointer-events-none w-full">
                      <h3 className="text-[11px] font-bold text-[#11161B] group-hover:text-[#0A2540] transition-colors tracking-tight whitespace-nowrap text-center">
                        {language === 'KR' ? '일정별 여행' : 'Itinerary'}
                      </h3>
                    </div>
                  </button>

                  {/* 6. 부산 도시철도 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCategory('SUBWAY');
                    }}
                    className="bg-white rounded-xl border border-[#E5E2DC] hover:border-[#8EA85E] hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer group p-2 text-center min-h-[95px] w-full focus:outline-none focus:ring-2 focus:ring-[#8EA85E]/30 active:scale-[0.98]"
                  >
                    <div className="bg-[#FBFBF9] rounded-lg p-1 flex items-center justify-center group-hover:bg-[#F1EFEC] transition-colors border border-[#E5E2DC] h-14 w-full overflow-hidden pointer-events-none">
                      <SubwayCourseIllustration className="w-full h-11 max-w-[85px] mx-auto object-contain" />
                    </div>
                    <div className="pt-1.5 pointer-events-none w-full">
                      <h3 className="text-[11px] font-bold text-[#11161B] group-hover:text-[#0A2540] transition-colors tracking-tight whitespace-nowrap text-center">
                        {language === 'KR' ? '부산 도시철도' : 'Subway'}
                      </h3>
                    </div>
                  </button>

                  {/* 7. 무장애 관광지 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCategory('BARRIER_FREE');
                    }}
                    className="bg-white rounded-xl border border-[#E5E2DC] hover:border-[#8EA85E] hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer group p-2 text-center min-h-[95px] w-full focus:outline-none focus:ring-2 focus:ring-[#8EA85E]/30 active:scale-[0.98]"
                  >
                    <div className="bg-[#FBFBF9] rounded-lg p-1 flex items-center justify-center group-hover:bg-[#F1EFEC] transition-colors border border-[#E5E2DC] h-14 w-full overflow-hidden pointer-events-none">
                      <BarrierFreeIllustration className="w-full h-11 max-w-[85px] mx-auto object-contain" />
                    </div>
                    <div className="pt-1.5 pointer-events-none w-full">
                      <h3 className="text-[11px] font-bold text-[#11161B] group-hover:text-[#0A2540] transition-colors tracking-tight whitespace-nowrap text-center">
                        {language === 'KR' ? '무장애 관광지' : 'Barrier-Free'}
                      </h3>
                    </div>
                  </button>

                  {/* 8. 내 여행 루트 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCategory('MY_ROUTE');
                    }}
                    className="bg-white rounded-xl border border-amber-300 hover:border-amber-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer group p-2 text-center min-h-[95px] relative w-full focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-[0.98]"
                  >
                    <div className="bg-amber-50/60 rounded-lg p-1 flex items-center justify-center group-hover:bg-amber-100/60 transition-colors border border-amber-200 h-14 w-full overflow-hidden pointer-events-none">
                      <MyRouteIllustration className="w-full h-11 max-w-[85px] mx-auto object-contain" />
                    </div>
                    <div className="pt-1.5 flex items-center justify-center gap-1 pointer-events-none w-full">
                      <h3 className="text-[11px] font-bold text-[#11161B] group-hover:text-amber-800 transition-colors tracking-tight whitespace-nowrap text-center">
                        {language === 'KR' ? '내 여행 루트' : 'My Route'}
                      </h3>
                      {myRouteCount > 0 && (
                        <span className="text-[9px] px-1 py-0.2 rounded-full bg-amber-500 text-white font-mono font-bold leading-none">
                          {myRouteCount}
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* [웹/데스크톱 전용] Image 1 원본 화면 100% 동일 복구 (3열 그리드, 원본 텍스트 및 링크) */}
              <div className="hidden md:block space-y-6 py-2">
                <div className="grid grid-cols-3 gap-6">
                  {/* Card 1: 식도락 */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCategory('GOURMET');
                    }}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group text-left"
                  >
                    <div>
                      <div className="bg-[#f8f9fa] rounded-xl border border-slate-100 h-44 flex items-center justify-center p-4 mb-5 group-hover:bg-[#f1f3f5] transition-colors">
                        <FoodieIllustration className="w-full h-32 max-w-[170px] mx-auto object-contain" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-[#0A2540] transition-colors">
                          {language === 'KR' ? '식도락' : 'Gourmet'}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                          {language === 'KR' ? '부산의 진정한 맛을 찾아 떠나는 미식 여행' : 'A culinary journey to discover the authentic tastes of Busan'}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end items-center text-sm font-semibold text-slate-700 group-hover:text-[#0A2540] transition-colors">
                      <span>{language === 'KR' ? '자세히 보기 >' : 'View Details >'}</span>
                    </div>
                  </div>

                  {/* Card 2: 체험 & 박물관 */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCategory('EXPERIENCE');
                    }}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group text-left"
                  >
                    <div>
                      <div className="bg-[#f8f9fa] rounded-xl border border-slate-100 h-44 flex items-center justify-center p-4 mb-5 group-hover:bg-[#f1f3f5] transition-colors">
                        <ExperienceIllustration className="w-full h-32 max-w-[170px] mx-auto object-contain" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-[#0A2540] transition-colors">
                          {language === 'KR' ? '체험 & 박물관' : 'Experience & Museum'}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                          {language === 'KR' ? '역사와 문화가 살아있는 부산의 다양한 체험 활동' : 'Diverse hands-on cultural and historical activities in Busan'}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end items-center text-sm font-semibold text-slate-700 group-hover:text-[#0A2540] transition-colors">
                      <span>{language === 'KR' ? '자세히 보기 >' : 'View Details >'}</span>
                    </div>
                  </div>

                  {/* Card 3: 전통시장 */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCategory('MARKET');
                    }}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group text-left"
                  >
                    <div>
                      <div className="bg-[#f8f9fa] rounded-xl border border-slate-100 h-44 flex items-center justify-center p-4 mb-5 group-hover:bg-[#f1f3f5] transition-colors">
                        <TraditionalMarketIllustration className="w-full h-32 max-w-[170px] mx-auto object-contain" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-[#0A2540] transition-colors">
                          {language === 'KR' ? '전통시장' : 'Traditional Market'}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                          {language === 'KR' ? '부전·자갈치·깡통·국제시장 등 정겨운 장터와 먹거리 투어' : 'Explore warm local markets: Bujeon, Jagalchi, Kkangtong, and Gukje'}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end items-center text-sm font-semibold text-slate-700 group-hover:text-[#0A2540] transition-colors">
                      <span>{language === 'KR' ? '자세히 보기 >' : 'View Details >'}</span>
                    </div>
                  </div>

                  {/* Card 4: 명소 */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCategory('ATTRACTION');
                    }}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group text-left"
                  >
                    <div>
                      <div className="bg-[#f8f9fa] rounded-xl border border-slate-100 h-44 flex items-center justify-center p-4 mb-5 group-hover:bg-[#f1f3f5] transition-colors">
                        <AttractionIllustration className="w-full h-32 max-w-[170px] mx-auto object-contain" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-[#0A2540] transition-colors">
                          {language === 'KR' ? '명소' : 'Attractions'}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                          {language === 'KR' ? '해동 용궁사 · 이기대 해안산책로 · 태종대 등 부산을 대표하는 명소 가이드' : 'Guide to iconic Busan sights: Haedong Yonggungsa, Igidae, Taejongdae'}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end items-center text-sm font-semibold text-slate-700 group-hover:text-[#0A2540] transition-colors">
                      <span>{language === 'KR' ? '자세히 보기 >' : 'View Details >'}</span>
                    </div>
                  </div>

                  {/* Card 5: 일정별 여행 */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      const targetDuration = selectedScheduleDuration || 'DAY';
                      handleSelectCategory(targetDuration);
                    }}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group text-left"
                  >
                    <div>
                      <div className="bg-[#f8f9fa] rounded-xl border border-slate-100 h-44 flex items-center justify-center p-4 mb-5 group-hover:bg-[#f1f3f5] transition-colors">
                        <ItineraryIllustration className="w-full h-32 max-w-[170px] mx-auto object-contain" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-[#0A2540] transition-colors">
                          {language === 'KR' ? '일정별 여행' : 'Itinerary by Duration'}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                          {language === 'KR' ? '당일치기부터 4박까지, 당신의 일정에 딱 맞는 부산 여행' : 'From day trips to 4 nights, tailored itineraries for your schedule'}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end items-center text-sm font-semibold text-slate-700 group-hover:text-[#0A2540] transition-colors">
                      <span>{language === 'KR' ? '자세히 보기 >' : 'View Details >'}</span>
                    </div>
                  </div>

                  {/* Card 6: 부산 도시철도 코스 */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCategory('SUBWAY');
                    }}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group text-left"
                  >
                    <div>
                      <div className="bg-[#f8f9fa] rounded-xl border border-slate-100 h-44 flex items-center justify-center p-4 mb-5 group-hover:bg-[#f1f3f5] transition-colors">
                        <SubwayCourseIllustration className="w-full h-32 max-w-[170px] mx-auto object-contain" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-[#0A2540] transition-colors">
                          {language === 'KR' ? '부산 도시철도 코스' : 'Busan Metro Course'}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                          {language === 'KR' ? '부산 지하철 1·2호선 노선축을 따라 편리하게 즐기는 코스' : 'Convenient travel courses along Busan Metro Lines 1 & 2'}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end items-center text-sm font-semibold text-slate-700 group-hover:text-[#0A2540] transition-colors">
                      <span>{language === 'KR' ? '자세히 보기 >' : 'View Details >'}</span>
                    </div>
                  </div>

                  {/* Card 7: 무장애 관광지 */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCategory('BARRIER_FREE');
                    }}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group text-left"
                  >
                    <div>
                      <div className="bg-[#f8f9fa] rounded-xl border border-slate-100 h-44 flex items-center justify-center p-4 mb-5 group-hover:bg-[#f1f3f5] transition-colors">
                        <BarrierFreeIllustration className="w-full h-32 max-w-[170px] mx-auto object-contain" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-[#0A2540] transition-colors">
                          {language === 'KR' ? '무장애 관광지' : 'Barrier-Free Spots'}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                          {language === 'KR' ? '모든 여행 코스에서 무장애 관광 스팟만 엄선하여 모아보는 카테고리' : 'Curated accessible spots with step-free pathways and facilities'}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end items-center text-sm font-semibold text-slate-700 group-hover:text-[#0A2540] transition-colors">
                      <span>{language === 'KR' ? '자세히 보기 >' : 'View Details >'}</span>
                    </div>
                  </div>

                  {/* Card 8: 내 여행 루트 (Image 1과 100% 동일) */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCategory('MY_ROUTE');
                    }}
                    className="bg-white rounded-2xl border border-amber-300 p-6 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group text-left"
                  >
                    <div>
                      <div className="bg-[#fefce8] rounded-xl border border-amber-200/60 h-44 flex items-center justify-center p-4 mb-5 group-hover:bg-[#fef9c3] transition-colors">
                        <div className="w-14 h-14 rounded-xl bg-[#d97706] flex items-center justify-center text-white shadow-xs">
                          <Compass className="w-8 h-8" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-amber-500 text-lg">⭐</span>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                              {language === 'KR' ? '내 여행 루트' : 'My Travel Route'}
                            </h3>
                          </div>
                          <span className="text-xs px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-medium shrink-0">
                            {language === 'KR' ? '맞춤 지도' : 'Custom Map'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                          {language === 'KR' 
                            ? '내가 즐겨찾기한 장소들을 지도 위에서 한눈에 확인하고 나만의 맞춤 여행 코스 만들기'
                            : 'View your bookmarked places on the map and build your personalized itinerary'}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end items-center text-sm font-semibold text-amber-700 group-hover:text-amber-900 transition-colors">
                      <span>{language === 'KR' ? '지도 보기 >' : 'View Map >'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCategory !== null && (
            <div className="space-y-6">
              {activeCategory === 'MY_ROUTE' ? (
                <div className="space-y-6 animate-fade-in text-left">
                  <React.Suspense fallback={<div className="h-64 flex items-center justify-center text-slate-400 font-bold text-sm">내 여행 루트를 불러오는 중...</div>}>
                    <MyTravelRouteMapView 
                      language={language}
                      onNavigateToCategory={(cat) => {
                        if (onSelectCategory) {
                          onSelectCategory(cat as any);
                        }
                        setActiveCategory(cat as any);
                      }}
                      onSelectStation={onSelectStation}
                      onOpenBarrierFreeDetail={(id) => {
                        setInternalBarrierFreePlaceId(id);
                        if (onSelectCategory) {
                          onSelectCategory('BARRIER_FREE');
                        }
                        setActiveCategory('BARRIER_FREE');
                      }}
                    />
                  </React.Suspense>
                </div>
              ) : activeCategory === 'BARRIER_FREE' ? (
                <div className="space-y-6 animate-fade-in text-left">
                  <React.Suspense fallback={<div className="h-64 flex items-center justify-center text-slate-400 font-bold text-sm">무장애 관광 정보를 불러오는 중...</div>}>
                    <BarrierFreeTourApiView 
                      language={language}
                      initialCourseId={initialBarrierFreeCourseId}
                      initialPlaceId={initialBarrierFreePlaceId !== undefined && initialBarrierFreePlaceId !== null ? initialBarrierFreePlaceId : internalBarrierFreePlaceId}
                      onSelectStation={onSelectStation}
                      onBackToPlaceList={() => {
                        setInternalBarrierFreePlaceId(null);
                        if (onBackToBarrierFreeList) {
                          onBackToBarrierFreeList();
                        } else {
                          navigateToSpa('/barrier-free');
                        }
                      }}
                      onNavigateHome={() => {
                        setActiveCategory(null);
                        setInternalBarrierFreePlaceId(null);
                        if (onBack) onBack();
                        navigateToSpa('/tips');
                      }}
                    />
                  </React.Suspense>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in text-left">
                  {/* 일정별 여행 Main Header & Category Filter Pills */}
                  {isScheduleActive && (
                    <div className="space-y-5 animate-fade-in text-left">
                      {/* Main Header with line icon */}
                      <div className="space-y-2 border-b border-slate-200 pb-5 text-left">
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                          <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-[#8EA85E] shrink-0" />
                          <span>{language === 'KR' ? '일정별 여행' : 'Itinerary Travel'}</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                          {language === 'KR'
                            ? '여행 일정과 스타일에 맞춰 부산의 핵심 명소와 미식을 알차게 즐기는 맞춤 추천 코스를 만나보세요.'
                            : 'Explore curated Busan travel itineraries tailored to your schedule and travel pace.'}
                        </p>
                      </div>

                      {/* Category Filter Pills: 당일치기 | 1박 | 2박 | 3박 */}
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        {/* 당일치기 */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedScheduleDuration('DAY');
                            handleSelectCategory('DAY');
                          }}
                          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                            activeCategory === 'DAY'
                              ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs'
                              : 'bg-[#FBFBF9] hover:bg-[#F1EFEC] text-[#11161B] border-[#E5E2DC]'
                          }`}
                        >
                          <span>{language === 'KR' ? '당일치기' : 'Day Trip'}</span>
                        </button>

                        {/* 1박 */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedScheduleDuration('1NIGHT');
                            handleSelectCategory('1NIGHT');
                          }}
                          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                            activeCategory === '1NIGHT'
                              ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs'
                              : 'bg-[#FBFBF9] hover:bg-[#F1EFEC] text-[#11161B] border-[#E5E2DC]'
                          }`}
                        >
                          <span>{language === 'KR' ? '1박' : '1 Night'}</span>
                        </button>

                        {/* 2박 */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedScheduleDuration('2NIGHTS');
                            handleSelectCategory('2NIGHTS');
                          }}
                          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                            activeCategory === '2NIGHTS'
                              ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs'
                              : 'bg-[#FBFBF9] hover:bg-[#F1EFEC] text-[#11161B] border-[#E5E2DC]'
                          }`}
                        >
                          <span>{language === 'KR' ? '2박' : '2 Nights'}</span>
                        </button>

                        {/* 3박 */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedScheduleDuration('3NIGHTS');
                            handleSelectCategory('3NIGHTS');
                          }}
                          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                            activeCategory === '3NIGHTS'
                              ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs'
                              : 'bg-[#FBFBF9] hover:bg-[#F1EFEC] text-[#11161B] border-[#E5E2DC]'
                          }`}
                        >
                          <span>{language === 'KR' ? '3박' : '3 Nights'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {(() => {
                    const course = filteredCourses[0];
                    if (!course) return null;

                    const effectiveCategory = activeCategory === 'SCHEDULE' 
                      ? (selectedScheduleDuration || 'DAY') 
                      : activeCategory;

                    switch (effectiveCategory) {
                case 'DAY': {
                  const dayCourses = filteredCourses.filter(c => c.category === 'DAY');
                  const currentCourse = dayCourses.find(c => c.id === selectedDayCourseId) || dayCourses[0] || course;

                  return (
                    <div className="space-y-6 animate-fade-in text-left">
                      {/* Sub-course Title with line icon & course tabs */}
                      <div className="space-y-3 text-left pt-1">
                        <div className="space-y-1 text-left">
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-[#8EA85E] shrink-0" />
                            <span>{language === 'KR' ? '당일치기 코스 (부산 처음 방문)' : '1-Day Course (First Time in Busan)'}</span>
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                            {language === 'KR'
                              ? '부산을 처음 방문하는 여행자를 위해 꼭 둘러봐야 할 핵심 명소만 엄선한 2가지 당일치기 추천 코스입니다.'
                              : 'Curated 1-day itineraries featuring essential highlights for first-time visitors.'}
                          </p>
                        </div>

                        {/* 2개 추천 코스 선택 탭 버튼 (통일된 브랜드 초록색 & 모바일 최적화) */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {dayCourses.map((c, idx) => {
                            const isSelected = currentCourse.id === c.id;
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => setSelectedDayCourseId(c.id)}
                                className={`w-full sm:w-auto flex-1 min-w-[200px] justify-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs text-center ${
                                  isSelected
                                    ? 'bg-[#8EA85E] text-white shadow-sm ring-2 ring-[#8EA85E]/20'
                                    : 'bg-white hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <span>
                                  {idx === 0
                                    ? (language === 'KR' ? '코스 1: 해운대 · 광안리 (동부산)' : 'Course 1: Haeundae & Gwangalli')
                                    : (language === 'KR' ? '코스 2: 감천 · 원도심 · 태종대' : 'Course 2: Gamcheon & Yeongdo')}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Day Trip Route Flow & Steps */}
                      <div className="space-y-3 sm:space-y-3.5 text-left">
                        {/* 추천 동선 요약 플로우 (박스 테두리 제거, 모바일 최적화) */}
                        <div className="bg-slate-50/80 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs font-bold text-slate-800">
                          <span className="text-[10.5px] sm:text-[11px] font-bold text-[#8EA85E] bg-white px-2.5 py-1 rounded-lg sm:rounded-xl shadow-2xs uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-[#8EA85E]" />
                            <span>{language === 'KR' ? '추천 동선 요약' : 'Route Flow'}</span>
                          </span>
                          <div className="flex items-center flex-wrap gap-1 sm:gap-1.5 text-slate-800">
                            {currentCourse.steps.map((s, idx) => (
                              <React.Fragment key={idx}>
                                {idx > 0 && <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />}
                                <span className="bg-white px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs text-slate-800 shadow-2xs break-keep">
                                  {language === 'KR' ? (s.shortTitleKo || s.titleKo) : (s.shortTitleEn || s.titleEn)}
                                </span>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        {/* Steps Timeline (세로선 제거 & 컴팩트한 간격) */}
                        <div className="space-y-3 sm:space-y-3.5 text-left">
                          {currentCourse.steps.map((st, sidx) => (
                            <TourApiItineraryStepCard
                              key={sidx}
                              stepNumber={sidx + 1}
                              step={st}
                              language={language}
                              onSelectStation={onSelectStation}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Overall Tip */}
                      <div className="bg-emerald-50/50 p-5 sm:p-6 text-left flex items-start gap-3.5 rounded-2xl border border-emerald-100">
                        <div className="p-2 rounded-xl bg-[#8EA85E] text-white shrink-0 mt-0.5">
                          <Info className="w-4 h-4" />
                        </div>
                        <div className="space-y-1 text-left">
                          <span className="text-[11px] font-bold text-[#8EA85E] uppercase tracking-wider block">
                            {language === 'KR' ? `${currentCourse.titleKo} 여행 팁` : 'DAY TRIP TIP'}
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                            {language === 'KR' ? currentCourse.overallTipKo : currentCourse.overallTipEn}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

              // -------------------------------------------------------------
              // PAGE 2: 1 NIGHT (1박)
              // -------------------------------------------------------------
              case '1NIGHT':
                return (
                  <div className="space-y-6 animate-fade-in text-left">
                    {/* Sub-course Title with line icon */}
                    <div className="space-y-1 text-left pt-1">
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-[#8EA85E] shrink-0" />
                        <span>{language === 'KR' ? '1박 2일 코스' : '1 Night 2 Days Course'}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                        {language === 'KR'
                          ? '광안리 밤바다와 도심 속 힐링을 여유롭게 만끽하는 1박 2일 일정입니다.'
                          : 'A relaxing 2-day journey enjoying Gwangalli ocean waves and city culture.'}
                      </p>
                    </div>

                    {/* Timeline Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Day 1 Section */}
                      <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#E5E2DC] space-y-5 text-left">
                        <div className="border-b border-[#E5E2DC] pb-3.5 space-y-3">
                          <h4 className="text-base font-bold text-[#11161B] flex items-center gap-2">
                            <span className="flex items-center justify-center px-2 py-0.5 rounded-md bg-[#8EA85E] text-white font-mono font-bold text-xs">
                              DAY 1
                            </span>
                            <span>{language === 'KR' ? 'Day 1 동선 안내' : 'Day 1 Itinerary'}</span>
                          </h4>

                          <div className="bg-[#FBFBF9] p-3 rounded-lg border border-[#E5E2DC] flex items-center flex-wrap gap-2 text-xs font-bold text-[#11161B]">
                            <span className="text-[10px] font-mono font-bold text-[#0A2540] bg-white px-2 py-0.5 rounded-md border border-[#E5E2DC] uppercase tracking-wider shrink-0 flex items-center gap-1">
                              <Compass className="w-3.5 h-3.5" />
                              <span>{language === 'KR' ? '추천 동선' : 'Route Flow'}</span>
                            </span>
                            <div className="flex items-center flex-wrap gap-1.5 text-[#11161B]">
                              {course.steps
                                .filter(st => st.time?.includes('Day 1'))
                                .map((s, idx) => (
                                  <React.Fragment key={idx}>
                                    {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#4A5568]" />}
                                    <span className="bg-white px-2 py-0.5 rounded-md border border-[#E5E2DC] font-medium text-xs text-[#11161B]">
                                      {language === 'KR' ? s.titleKo.split(' ')[0] : s.titleEn.split(' ')[0]}
                                    </span>
                                  </React.Fragment>
                                ))}
                            </div>
                          </div>
                        </div>

                        <div className="relative pl-7 sm:pl-9 space-y-6 text-left">
                          <div className="absolute left-[13px] sm:left-[17px] top-3 bottom-3 w-px bg-[#E5E2DC]"></div>

                          {course.steps
                            .filter(st => st.time?.includes('Day 1'))
                            .map((st, sidx) => (
                              <TourApiItineraryStepCard
                                key={sidx}
                                stepNumber={sidx + 1}
                                step={st}
                                language={language}
                                onSelectStation={onSelectStation}
                              />
                            ))}
                        </div>
                      </div>

                      {/* Day 2 Section */}
                      <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#E5E2DC] space-y-5 text-left">
                        <div className="border-b border-[#E5E2DC] pb-3.5 space-y-3">
                          <h4 className="text-base font-bold text-[#11161B] flex items-center gap-2">
                            <span className="flex items-center justify-center px-2 py-0.5 rounded-md bg-[#8EA85E] text-white font-mono font-bold text-xs">
                              DAY 2
                            </span>
                            <span>{language === 'KR' ? 'Day 2 동선 안내' : 'Day 2 Itinerary'}</span>
                          </h4>

                          <div className="bg-[#FBFBF9] p-3 rounded-lg border border-[#E5E2DC] flex items-center flex-wrap gap-2 text-xs font-bold text-[#11161B]">
                            <span className="text-[10px] font-mono font-bold text-[#0A2540] bg-white px-2 py-0.5 rounded-md border border-[#E5E2DC] uppercase tracking-wider shrink-0 flex items-center gap-1">
                              <Compass className="w-3.5 h-3.5" />
                              <span>{language === 'KR' ? '추천 동선' : 'Route Flow'}</span>
                            </span>
                            <div className="flex items-center flex-wrap gap-1.5 text-[#11161B]">
                              {course.steps
                                .filter(st => st.time?.includes('Day 2'))
                                .map((s, idx) => (
                                  <React.Fragment key={idx}>
                                    {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#4A5568]" />}
                                    <span className="bg-white px-2 py-0.5 rounded-md border border-[#E5E2DC] font-medium text-xs text-[#11161B]">
                                      {language === 'KR' ? s.titleKo.split(' ')[0] : s.titleEn.split(' ')[0]}
                                    </span>
                                  </React.Fragment>
                                ))}
                            </div>
                          </div>
                        </div>

                        <div className="relative pl-7 sm:pl-9 space-y-6 text-left">
                          <div className="absolute left-[13px] sm:left-[17px] top-3 bottom-3 w-px bg-[#E5E2DC]"></div>

                          {course.steps
                            .filter(st => st.time?.includes('Day 2'))
                            .map((st, sidx) => (
                              <TourApiItineraryStepCard
                                key={sidx}
                                stepNumber={sidx + 1}
                                step={st}
                                language={language}
                                onSelectStation={onSelectStation}
                              />
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Overall tip banner */}
                    <div className="bg-[#FBFBF9] p-5 sm:p-6 text-left flex items-start gap-3.5 rounded-lg border border-[#E5E2DC]">
                      <div className="p-2 rounded-md bg-[#8EA85E] text-white shrink-0 mt-0.5">
                        <Info className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 text-left">
                        <span className="text-[11px] font-mono font-bold text-[#0A2540] uppercase tracking-wider block">
                          {language === 'KR' ? '1박 2일 여행 팁' : '1 NIGHT TRAVEL TIP'}
                        </span>
                        <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                          {language === 'KR' ? course.overallTipKo : course.overallTipEn}
                        </p>
                      </div>
                    </div>
                  </div>
                );

              // -------------------------------------------------------------
              // PAGE 3: 2 NIGHTS (2박)
              // -------------------------------------------------------------
              case '2NIGHTS':
                return (
                  <div className="space-y-6 animate-fade-in text-left">
                    {/* Sub-course Title with line icon */}
                    <div className="space-y-1 text-left pt-1">
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-[#8EA85E] shrink-0" />
                        <span>{language === 'KR' ? '2박 3일 코스' : '2 Nights 3 Days Course'}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                        {language === 'KR'
                          ? '감성 카페거리부터 푸른 바다 비경까지 부산 전역을 일주하는 2박 3일 일정입니다.'
                          : 'A 3-day route from trendy cafe alleys to breathtaking coastal scenery.'}
                      </p>
                    </div>

                    {/* Vertical Day-by-Day Journey List */}
                    <div className="space-y-6">
                      {[1, 2, 3].map((dayNum) => {
                        const daySteps = course.steps.filter(st => st.time?.includes(`Day ${dayNum}`));
                        if (daySteps.length === 0) return null;

                        const dayTitlesKo = [
                          'Day 1 (원도심 & 영도 권역)',
                          'Day 2 (서면 & 광안리 권역)',
                          'Day 3 (해운대 & 기장 오시리아 권역)'
                        ];
                        const dayTitlesEn = [
                          'Day 1 (Historic Downtown & Yeongdo)',
                          'Day 2 (Seomyeon & Gwangalli Beach)',
                          'Day 3 (Haeundae & Gijang Osiria)'
                        ];

                        return (
                          <div key={dayNum} className="bg-white p-6 sm:p-8 rounded-lg border border-[#E5E2DC] space-y-5 text-left">
                            <div className="border-b border-[#E5E2DC] pb-3.5 space-y-3">
                              <h4 className="text-base font-bold text-[#11161B] flex items-center gap-2">
                                <span className="flex items-center justify-center px-2 py-0.5 rounded-md bg-[#8EA85E] text-white font-mono font-bold text-xs">
                                  DAY {dayNum}
                                </span>
                                <span>{language === 'KR' ? dayTitlesKo[dayNum - 1] : dayTitlesEn[dayNum - 1]}</span>
                              </h4>

                              <div className="bg-[#FBFBF9] p-3 rounded-lg border border-[#E5E2DC] flex items-center flex-wrap gap-2 text-xs font-bold text-[#11161B]">
                                <span className="text-[10px] font-mono font-bold text-[#0A2540] bg-white px-2 py-0.5 rounded-md border border-[#E5E2DC] uppercase tracking-wider shrink-0 flex items-center gap-1">
                                  <Compass className="w-3.5 h-3.5" />
                                  <span>{language === 'KR' ? '추천 동선' : 'Route Flow'}</span>
                                </span>
                                <div className="flex items-center flex-wrap gap-1.5 text-[#11161B]">
                                  {daySteps.map((s, idx) => (
                                    <React.Fragment key={idx}>
                                      {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#4A5568]" />}
                                      <span className="bg-white px-2 py-0.5 rounded-md border border-[#E5E2DC] font-medium text-xs text-[#11161B]">
                                        {language === 'KR' ? s.titleKo.split(' ')[0] : s.titleEn.split(' ')[0]}
                                      </span>
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="relative pl-7 sm:pl-9 space-y-6 text-left">
                              <div className="absolute left-[13px] sm:left-[17px] top-3 bottom-3 w-px bg-[#E5E2DC]"></div>

                              {daySteps.map((st, sidx) => (
                                <TourApiItineraryStepCard
                                  key={sidx}
                                  stepNumber={sidx + 1}
                                  step={st}
                                  language={language}
                                  onSelectStation={onSelectStation}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Overall tip banner */}
                    <div className="bg-[#FBFBF9] p-5 sm:p-6 text-left flex items-start gap-3.5 rounded-lg border border-[#E5E2DC]">
                      <div className="p-2 rounded-md bg-[#8EA85E] text-white shrink-0 mt-0.5">
                        <Info className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 text-left">
                        <span className="text-[11px] font-mono font-bold text-[#0A2540] uppercase tracking-wider block">
                          {language === 'KR' ? '2박 3일 여행 팁' : '2 NIGHTS TRAVEL TIP'}
                        </span>
                        <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                          {language === 'KR' ? course.overallTipKo : course.overallTipEn}
                        </p>
                      </div>
                    </div>
                  </div>
                );

              // -------------------------------------------------------------
              // PAGE 4: 3 NIGHTS (3박)
              // -------------------------------------------------------------
              case '3NIGHTS':
                return (
                  <div className="space-y-6 animate-fade-in text-left">
                    {/* Sub-course Title with line icon */}
                    <div className="space-y-1 text-left pt-1">
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-[#8EA85E] shrink-0" />
                        <span>{language === 'KR' ? '3박 4일 코스' : '3 Nights 4 Days Course'}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                        {language === 'KR'
                          ? '자연 힐링과 강변 수변 공원을 벗하며 사색과 여유를 즐기는 3박 4일 일정입니다.'
                          : 'A 4-day peaceful journey along scenic waterways and nature parks.'}
                      </p>
                    </div>

                    {/* Vertically connected list of Days */}
                    <div className="space-y-6">
                      {[1, 2, 3, 4].map((dayNum) => {
                        const daySteps = course.steps.filter(st => st.time?.includes(`Day ${dayNum}`));
                        if (daySteps.length === 0) return null;

                        return (
                          <div key={dayNum} className="bg-white p-6 sm:p-8 rounded-lg border border-[#E5E2DC] space-y-5 text-left">
                            <div className="border-b border-[#E5E2DC] pb-3.5 space-y-3">
                              <h4 className="text-base font-bold text-[#11161B] flex items-center gap-2">
                                <span className="flex items-center justify-center px-2 py-0.5 rounded-md bg-[#8EA85E] text-white font-mono font-bold text-xs">
                                  DAY {dayNum}
                                </span>
                                <span>{language === 'KR' ? `Day ${dayNum} 일정` : `Day ${dayNum} Itinerary`}</span>
                              </h4>

                              <div className="bg-[#FBFBF9] p-3 rounded-lg border border-[#E5E2DC] flex items-center flex-wrap gap-2 text-xs font-bold text-[#11161B]">
                                <span className="text-[10px] font-mono font-bold text-[#0A2540] bg-white px-2 py-0.5 rounded-md border border-[#E5E2DC] uppercase tracking-wider shrink-0 flex items-center gap-1">
                                  <Compass className="w-3.5 h-3.5" />
                                  <span>{language === 'KR' ? '추천 동선' : 'Route Flow'}</span>
                                </span>
                                <div className="flex items-center flex-wrap gap-1.5 text-[#11161B]">
                                  {daySteps.map((s, idx) => (
                                    <React.Fragment key={idx}>
                                      {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#4A5568]" />}
                                      <span className="bg-white px-2 py-0.5 rounded-md border border-[#E5E2DC] font-medium text-xs text-[#11161B]">
                                        {language === 'KR' ? s.titleKo.split(' ')[0] : s.titleEn.split(' ')[0]}
                                      </span>
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="relative pl-7 sm:pl-9 space-y-6 text-left">
                              <div className="absolute left-[13px] sm:left-[17px] top-3 bottom-3 w-px bg-[#E5E2DC]"></div>

                              {daySteps.map((st, sidx) => (
                                <TourApiItineraryStepCard
                                  key={sidx}
                                  stepNumber={sidx + 1}
                                  step={st}
                                  language={language}
                                  onSelectStation={onSelectStation}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Overall tip */}
                    <div className="bg-[#FBFBF9] p-5 sm:p-6 text-left flex items-start gap-3.5 rounded-lg border border-[#E5E2DC]">
                      <div className="p-2 rounded-md bg-[#8EA85E] text-white shrink-0 mt-0.5">
                        <Info className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 text-left">
                        <span className="text-[11px] font-mono font-bold text-[#0A2540] uppercase tracking-wider block">
                          {language === 'KR' ? '3박 4일 여행 팁' : '3 NIGHTS TRAVEL TIP'}
                        </span>
                        <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                          {language === 'KR' ? course.overallTipKo : course.overallTipEn}
                        </p>
                      </div>
                    </div>
                  </div>
                );

              // -------------------------------------------------------------
              // PAGE 5: 4 NIGHTS (4박)
              // -------------------------------------------------------------
              case '4NIGHTS':
                return (
                  <div className="space-y-6 animate-fade-in text-left">
                    {/* Header */}
                    <div className="space-y-2 border-b border-slate-200 pb-5 text-left">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {language === 'KR' ? '4박 5일 코스' : '4 Nights 5 Days Course'}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                        {language === 'KR'
                          ? '부산의 바다, 역사, 미식, 쇼핑을 모두 아우르는 완전 정복 4박 5일 마스터 일정입니다.'
                          : 'A comprehensive 5-day master course covering ocean views, history, and dining.'}
                      </p>
                    </div>

                    {/* Vertical Day-by-Day Journey List */}
                    <div className="space-y-6">
                      {[1, 2, 3, 4, 5].map((dayNum) => {
                        const daySteps = course.steps.filter(st => st.time?.includes(`Day ${dayNum}`));
                        if (daySteps.length === 0) return null;

                        const dayTitlesKo = [
                          '해운대·기장 오션 시닉 벨트',
                          '원도심 역사 컬처 루트',
                          '트렌디 영 스트리트 & 화려한 광안리 밤바다',
                          '낙동강 에코 & 명품 일몰 투어',
                          '하이테크 하이엔드 센텀 & 마린시티'
                        ];
                        const dayTitlesEn = [
                          'Haeundae & Gijang Ocean Scenic Belt',
                          'Old Downtown History & Culture',
                          'Trendy Alleys & Gwangalli Waves',
                          'Nakdong River Eco & Golden Sunset',
                          'Hi-Tech Centum & Marine City'
                        ];

                        return (
                          <div key={dayNum} className="bg-white p-6 sm:p-8 rounded-lg border border-[#E5E2DC] space-y-5 text-left">
                            <h4 className="text-base font-bold text-[#11161B] border-b border-[#E5E2DC] pb-3 flex items-center gap-2">
                              <span className="flex items-center justify-center px-2 py-0.5 rounded-md bg-[#8EA85E] text-white font-mono font-bold text-xs">
                                DAY {dayNum}
                              </span>
                              <span>
                                {language === 'KR' 
                                  ? `${dayTitlesKo[dayNum - 1]}` 
                                  : `${dayTitlesEn[dayNum - 1]}`}
                              </span>
                            </h4>

                            <div className="relative pl-7 sm:pl-9 space-y-6 text-left">
                              <div className="absolute left-[13px] sm:left-[17px] top-3 bottom-3 w-px bg-[#E5E2DC]"></div>

                              {daySteps.map((st, sidx) => (
                                <TourApiItineraryStepCard
                                  key={sidx}
                                  stepNumber={sidx + 1}
                                  step={st}
                                  language={language}
                                  onSelectStation={onSelectStation}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Overall tip banner */}
                    <div className="bg-[#FBFBF9] p-5 sm:p-6 text-left flex items-start gap-3.5 rounded-lg border border-[#E5E2DC]">
                      <div className="p-2 rounded-md bg-[#8EA85E] text-white shrink-0 mt-0.5">
                        <Info className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 text-left">
                        <span className="text-[11px] font-mono font-bold text-[#0A2540] uppercase tracking-wider block">
                          {language === 'KR' ? '4박 5일 여행 팁' : '4 NIGHTS TRAVEL TIP'}
                        </span>
                        <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                          {language === 'KR' ? course.overallTipKo : course.overallTipEn}
                        </p>
                      </div>
                    </div>
                  </div>
                );

              // -------------------------------------------------------------
              // PAGE 6: GOURMET (식도락) - Editorial Travel Magazine Layout
              // -------------------------------------------------------------
              case 'GOURMET': {
                const getStepCats = (s: ItineraryStep): string[] => {
                  return getStepFoodCategories(s);
                };

                const filteredGourmetSteps = course.steps
                  .filter((s) => {
                    if (selectedGourmetCat === 'ALL') return true;
                    return getStepCats(s).includes(selectedGourmetCat);
                  })
                  .slice()
                  .sort((a, b) => {
                    const nameA = language === 'KR' ? a.titleKo : (a.titleEn || a.titleKo);
                    const nameB = language === 'KR' ? b.titleKo : (b.titleEn || b.titleKo);
                    return nameA.localeCompare(nameB, language === 'KR' ? 'ko' : 'en');
                  });

                const getCategoryCount = (catId: string): number => {
                  if (catId === 'ALL') return course.steps.length;
                  return course.steps.filter(s => getStepCats(s).includes(catId)).length;
                };

                return (
                  <div className="space-y-6 animate-fade-in text-left">
                    {/* Header */}
                    <div className="space-y-2 border-b border-slate-200 pb-5 text-left">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Utensils className="w-7 h-7 sm:w-8 sm:h-8 text-[#8EA85E] shrink-0" />
                        <span>{language === 'KR' ? '식도락 여행' : 'Gourmet Tour'}</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                        {language === 'KR'
                          ? '현지인이 검증한 대표 맛집부터 감성 카페, 전통시장 및 명물 디저트까지 만나보세요.'
                          : 'Explore authentic local restaurants, cafes, traditional markets, and iconic desserts across Busan.'}
                      </p>
                    </div>

                    {/* Category Pills directly without box wrapper */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      {GOURMET_CATEGORY_TABS.map((tab, idx) => {
                        const isSelected = selectedGourmetCat === tab.id;
                        const count = getCategoryCount(tab.id);
                        const isHiddenOnMobile = !isGourmetSubcatMoreOpen && idx >= 4 && !isSelected;

                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedGourmetCat(tab.id);
                            }}
                            className={`${isHiddenOnMobile ? 'hidden sm:flex' : 'flex'} items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                              isSelected
                                ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs'
                                : 'bg-[#FBFBF9] hover:bg-[#F1EFEC] text-[#11161B] border-[#E5E2DC]'
                            }`}
                          >
                            <span>{language === 'KR' ? tab.nameKo : tab.nameEn}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-[#E5E2DC] text-[#4A5568]'
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}

                      {/* 모바일 전용 더보기 / 접기 토글 버튼 */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsGourmetSubcatMoreOpen(prev => !prev);
                        }}
                        className="sm:hidden flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 border bg-[#F1EFEC] hover:bg-[#E5E2DC] text-[#0A2540] border-[#D5D2CC]"
                        aria-expanded={isGourmetSubcatMoreOpen}
                      >
                        <span>
                          {isGourmetSubcatMoreOpen
                            ? (language === 'KR' ? '접기' : 'Collapse')
                            : (language === 'KR' ? '더보기' : 'More')}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isGourmetSubcatMoreOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Gourmet Catalog Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3" id="gourmet-catalog">
                      {filteredGourmetSteps.map((step, idx) => {
                        const matchedSpotId = matchTourApiSpotId(step.titleKo);
                        const effectiveSpotId = resolvePlaceTargetId({
                          id: step.id,
                          contentId: step.contentId,
                          titleKo: step.titleKo,
                          titleEn: step.titleEn,
                        }) || matchedSpotId;
                        const ktoDetail = effectiveSpotId ? getKoreaTourApiPlaceDetail(effectiveSpotId) : null;
                        const isSaved = isBookmarked(step.id || step.titleKo);

                        return (
                          <div 
                            key={idx} 
                            className="bg-white rounded-lg border border-[#E5E2DC] hover:border-[#8EA85E] transition-colors p-3.5 sm:p-4 flex flex-col justify-between text-left space-y-2"
                          >
                            <div className="space-y-1.5 text-left">
                              {/* Header: Title & Route Button on the SAME line (No star rating) */}
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-[15px] sm:text-base font-bold text-[#11161B] leading-snug">
                                  {language === 'KR' ? step.titleKo : step.titleEn}
                                </h4>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleMyRoute({
                                      id: step.id || step.titleKo,
                                      titleKo: step.titleKo,
                                      titleEn: step.titleEn,
                                      categoryKo: '부산 식도락',
                                      categoryEn: 'Gourmet',
                                      addressRoadKo: ktoDetail?.addressRoadKo || step.stationInfoKo,
                                      stationInfoKo: step.stationInfoKo,
                                      stationInfoEn: step.stationInfoEn,
                                      descKo: step.descKo,
                                      descEn: step.descEn,
                                      firstImage: ktoDetail?.firstImage,
                                      latitude: ktoDetail?.latitude,
                                      longitude: ktoDetail?.longitude,
                                    });
                                  }}
                                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold shrink-0 ${
                                    isSaved
                                      ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 shadow-2xs'
                                      : 'bg-white text-slate-500 border-slate-200 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50/40'
                                  }`}
                                  title={isSaved ? (language === 'KR' ? '루트에서 제거' : 'Remove from My Route') : (language === 'KR' ? '루트(지도)에 담기' : 'Add to My Route')}
                                >
                                  <Star className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-500' : ''}`} />
                                  <span>{isSaved ? (language === 'KR' ? '루트 담김' : 'In Route') : (language === 'KR' ? '루트 추가' : 'Add')}</span>
                                </button>
                              </div>

                              {/* 식당 설명문 (주소 중복 노출 방지: 설명이 주소인 경우 생략하여 하단에만 1회 표시) */}
                              {(() => {
                                const rawDesc = (language === 'KR' ? step.descKo : (step.descEn || step.descKo)) || '';
                                const cleanDesc = rawDesc.replace(/^📍\s*주소:?[^\n]+(\n|$)/i, '').trim();
                                const isPureAddress = /^부산\s+[가-힣]+[구|군]/i.test(cleanDesc) || cleanDesc.startsWith('부산 ');

                                if (!cleanDesc || isPureAddress) {
                                  return null;
                                }

                                return (
                                  <p className="text-[11.5px] sm:text-xs text-[#4A5568] font-normal leading-relaxed text-left whitespace-pre-line">
                                    {cleanDesc}
                                  </p>
                                );
                              })()}

                              {/* 다수 매장/프랜차이즈 지점별 주소 목록 & 네이버지도 / 구글맵 버튼 (접고 펼치기 지원) */}
                              {step.branches && step.branches.length > 0 && (() => {
                                const isExpanded = !!expandedBranches[step.titleKo];
                                const displayedBranches = isExpanded ? step.branches : [step.branches[0]];

                                return (
                                  <div className="mt-2.5 pt-2 border-t border-[#E5E2DC] space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[11px] font-bold text-[#11161B] flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-[#0A2540]" />
                                        <span>{language === 'KR' ? '지점별 매장 안내' : 'Branch Locations'}</span>
                                      </span>
                                    </div>

                                    <div className="space-y-1.5">
                                      {displayedBranches.map((branch, bIdx) => {
                                        const rawAddress = language === 'KR' ? branch.addressKo : (branch.addressEn || branch.addressKo);
                                        // 어디어디 인근 등 괄호 설명 제거하고 순수 주소만 표시
                                        const cleanAddress = (rawAddress || '').replace(/\s*\([^)]*\)/g, '').trim();

                                        return (
                                          <div 
                                            key={bIdx}
                                            className="bg-[#FBFBF9] hover:bg-[#F4EBE1]/40 p-2 sm:p-2.5 rounded-lg border border-[#E5E2DC] transition-colors flex flex-col gap-1"
                                          >
                                            <div className="flex items-center justify-between gap-1.5 flex-wrap">
                                              <span className="text-[11.5px] sm:text-xs font-bold text-[#11161B]">
                                                {language === 'KR' ? branch.nameKo : (branch.nameEn || branch.nameKo)}
                                              </span>
                                            </div>

                                            <div className="flex items-center justify-between gap-2">
                                              <p className="text-[11px] text-[#4A5568] flex items-start gap-1 leading-snug min-w-0 flex-1">
                                                <span className="shrink-0 text-slate-400">📍</span>
                                                <span className="break-all">{cleanAddress}</span>
                                              </p>

                                              <div className="flex items-center gap-1 shrink-0">
                                                {branch.naverMapUrl && (
                                                  <a
                                                    href={branch.naverMapUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-md bg-[#03C75A] hover:bg-[#02b350] flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
                                                    title={language === 'KR' ? `${branch.nameKo} 네이버 지도에서 위치 보기` : `View ${branch.nameEn || branch.nameKo} on Naver Map`}
                                                    aria-label="Naver Map"
                                                  >
                                                    <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">
                                                      <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
                                                    </svg>
                                                  </a>
                                                )}
                                                {branch.googleMapUrl && (
                                                  <a
                                                    href={branch.googleMapUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-md bg-white border border-[#E5E2DC] hover:border-[#4285F4]/40 flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
                                                    title={language === 'KR' ? `${branch.nameKo} 구글맵에서 위치 보기` : `View ${branch.nameEn || branch.nameKo} on Google Maps`}
                                                    aria-label="Google Maps"
                                                  >
                                                    <svg viewBox="0 0 92 135" className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none">
                                                      <path d="M46 0C20.596 0 0 20.596 0 46c0 34.5 46 89 46 89s46-54.5 46-89C92 20.596 71.404 0 46 0z" fill="#4285F4"/>
                                                      <path d="M46 0c-25.404 0-46 20.596-46 46 0 11.233 4.025 21.528 10.72 29.5L46 46V0z" fill="#EA4335"/>
                                                      <path d="M46 46l35.28 29.5C87.975 67.528 92 57.233 92 46c0-25.404-20.596-46-46-46v46z" fill="#FBBC04"/>
                                                      <path d="M46 46v89s24.62-29.215 37.8-57.5L46 46z" fill="#34A853"/>
                                                      <circle cx="46" cy="46" r="18" fill="#FFFFFF"/>
                                                    </svg>
                                                  </a>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {/* 펼치기/접기 바텀 토글 버튼 (매장이 2개 이상일 때) */}
                                    {step.branches.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setExpandedBranches(prev => ({ ...prev, [step.titleKo]: !isExpanded }));
                                        }}
                                        className="w-full py-1 sm:py-1.5 px-3 rounded-md bg-[#FBFBF9] hover:bg-[#F1EFEC] border border-[#E5E2DC] text-[11px] font-bold text-[#8EA85E] hover:text-[#768F48] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                                      >
                                        {isExpanded ? (
                                          <>
                                            <span>{language === 'KR' ? '지점 목록 접기' : 'Collapse branches'}</span>
                                            <ChevronUp className="w-3.5 h-3.5 text-[#8EA85E]" />
                                          </>
                                        ) : (
                                          <>
                                            <span>{language === 'KR' ? `다른 지점 ${step.branches.length - 1}곳 더보기` : `+${step.branches.length - 1} more branches`}</span>
                                            <ChevronDown className="w-3.5 h-3.5 text-[#8EA85E]" />
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </div>
                                );
                              })()}

                              {/* 단일 매장 전용 주소 (어디어디 인근 등 괄호 제거 & 네이버/구글 지도 바로가기 버튼) */}
                              {(!step.branches || step.branches.length === 0) && step.stationInfoKo && (() => {
                                const cleanAddr = (language === 'KR' ? step.stationInfoKo : (step.stationInfoEn || step.stationInfoKo)).replace(/\s*\([^)]*\)/g, '').trim();
                                const naverUrl = step.naverMapUrl || `https://map.naver.com/v5/search/${encodeURIComponent(step.titleKo + ' ' + cleanAddr)}`;
                                const googleUrl = step.googleMapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(step.titleKo + ' ' + cleanAddr)}`;

                                return (
                                  <div className="mt-2.5 pt-2 border-t border-[#E5E2DC] text-left">
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="text-[11px] sm:text-[11.5px] text-[#4A5568] flex items-start gap-1 leading-snug min-w-0 flex-1">
                                        <span className="shrink-0 text-slate-400">📍</span>
                                        <span className="break-all">{cleanAddr}</span>
                                      </p>

                                      <div className="flex items-center gap-1 shrink-0">
                                        <a
                                          href={naverUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-md bg-[#03C75A] hover:bg-[#02b350] flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
                                          title={language === 'KR' ? `${step.titleKo} 네이버 지도에서 위치 보기` : `View ${step.titleKo} on Naver Map`}
                                          aria-label="Naver Map"
                                        >
                                          <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">
                                            <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
                                          </svg>
                                        </a>
                                        <a
                                          href={googleUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-md bg-white border border-[#E5E2DC] hover:border-[#4285F4]/40 flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
                                          title={language === 'KR' ? `${step.titleKo} 구글맵에서 위치 보기` : `View ${step.titleKo} on Google Maps`}
                                          aria-label="Google Maps"
                                        >
                                          <svg viewBox="0 0 92 135" className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none">
                                            <path d="M46 0C20.596 0 0 20.596 0 46c0 34.5 46 89 46 89s46-54.5 46-89C92 20.596 71.404 0 46 0z" fill="#4285F4"/>
                                            <path d="M46 0c-25.404 0-46 20.596-46 46 0 11.233 4.025 21.528 10.72 29.5L46 46V0z" fill="#EA4335"/>
                                            <path d="M46 46l35.28 29.5C87.975 67.528 92 57.233 92 46c0-25.404-20.596-46-46-46v46z" fill="#FBBC04"/>
                                            <path d="M46 46v89s24.62-29.215 37.8-57.5L46 46z" fill="#34A853"/>
                                            <circle cx="46" cy="46" r="18" fill="#FFFFFF"/>
                                          </svg>
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Overall tip banner - 부산 현지인 팁! */}
                    <div className="bg-[#FBFBF9] p-4 sm:p-5 text-left flex items-start gap-3 rounded-xl border border-[#E5E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 shrink-0 mt-0.5 border border-amber-200/60">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 stroke-[2.2]" />
                      </div>
                      <div className="space-y-1 select-none text-left flex-1 min-w-0">
                        <span className="text-xs sm:text-[13px] font-bold text-[#0A2540] flex items-center gap-1.5">
                          <span>{language === 'KR' ? '부산 현지인 팁!' : 'Busan Local Tip!'}</span>
                        </span>
                        <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-normal">
                          {language === 'KR' ? course.overallTipKo : course.overallTipEn}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              // -------------------------------------------------------------
              // PAGE 7: EXPERIENCE (체험&박물관) - Editorial Travel Magazine
              // -------------------------------------------------------------
case 'EXPERIENCE': {
                const filteredExperienceSteps = course.steps
                  .filter(s => {
                    const matchTheme = selectedExperienceTheme === 'ALL' || s.categoryType === selectedExperienceTheme;
                    return matchTheme;
                  })
                  .slice()
                  .sort((a, b) => {
                    const nameA = language === 'KR' ? a.titleKo : (a.titleEn || a.titleKo);
                    const nameB = language === 'KR' ? b.titleKo : (b.titleEn || b.titleKo);
                    return nameA.localeCompare(nameB, language === 'KR' ? 'ko' : 'en');
                  });

                const getThemeStepCount = (themeId: string) => {
                  if (themeId === 'ALL') return course.steps.length;
                  return course.steps.filter(s => s.categoryType === themeId).length;
                };

                return (
                  <div className="space-y-6 animate-fade-in text-left">
                    {/* Header */}
                    <div className="space-y-2 border-b border-slate-200 pb-5 text-left">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Compass className="w-7 h-7 sm:w-8 sm:h-8 text-[#8EA85E] shrink-0" />
                        <span>{language === 'KR' ? '체험 & 박물관' : 'Museums & Experiences'}</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                        {language === 'KR'
                          ? '날씨에 구애받지 않고 편안하게 즐기는 다채로운 전시와 문화공간을 만나보세요.'
                          : 'Explore museums, art galleries, and cultural spaces with accessible routes.'}
                      </p>
                    </div>

                    {/* Category Pills directly without box wrapper */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      {EXPERIENCE_THEME_TABS.map((tab) => {
                        const count = getThemeStepCount(tab.id);
                        const isSelected = selectedExperienceTheme === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedExperienceTheme(tab.id);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                              isSelected
                                ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs'
                                : 'bg-[#FBFBF9] hover:bg-[#F1EFEC] text-[#11161B] border-[#E5E2DC]'
                            }`}
                          >
                            <span>{language === 'KR' ? tab.nameKo : tab.nameEn}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-[#E5E2DC] text-[#4A5568]'
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Spots Catalog Grid */}
                    {filteredExperienceSteps.length === 0 ? (
                      <div className="bg-white p-12 rounded-lg border border-[#E5E2DC] text-center space-y-2">
                        <p className="text-[#4A5568] font-bold text-xs">
                          {language === 'KR' ? '선택하신 조건의 체험 & 박물관 정보가 준비 중입니다.' : 'No museums found for selected criteria.'}
                        </p>
                        <button
                          onClick={() => {
                            setSelectedExperienceTheme('ALL');
                          }}
                          className="mt-2 px-4 py-2 bg-[#8EA85E] text-white text-xs font-bold rounded-md cursor-pointer hover:bg-[#8EA85E]/90 transition-colors"
                        >
                          {language === 'KR' ? '필터 초기화 (전체 보기)' : 'Reset Filters'}
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredExperienceSteps.map((step, idx) => {
                          const matchedSpotId = matchTourApiSpotId(step.titleKo);
                          const effectiveSpotId = resolvePlaceTargetId({
                            id: step.id,
                            contentId: step.contentId,
                            titleKo: step.titleKo,
                            titleEn: step.titleEn,
                          }) || matchedSpotId;
                          const ktoDetail = effectiveSpotId ? getKoreaTourApiPlaceDetail(effectiveSpotId) : null;
                          const imageUrl = ktoDetail?.firstImage || step.firstImage;
                          const isSaved = isBookmarked(step.id || step.titleKo);

                          const displayTitle = language === 'KR' ? step.titleKo : step.titleEn;
                          const isLongTitle = displayTitle.length > 11;

                          const renderRouteButton = () => (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMyRoute({
                                  id: step.id || step.titleKo,
                                  titleKo: step.titleKo,
                                  titleEn: step.titleEn,
                                  categoryKo: '체험/박물관',
                                  categoryEn: 'Experience',
                                  addressRoadKo: ktoDetail?.addressRoadKo || step.stationInfoKo,
                                  stationInfoKo: step.stationInfoKo,
                                  stationInfoEn: step.stationInfoEn,
                                  descKo: step.descKo,
                                  descEn: step.descEn,
                                  firstImage: imageUrl,
                                  latitude: ktoDetail?.latitude,
                                  longitude: ktoDetail?.longitude,
                                });
                              }}
                              className={`shrink-0 px-2 py-1 rounded-md border transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold ${
                                isSaved
                                  ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 shadow-2xs'
                                  : 'bg-white text-slate-500 border-slate-200 hover:text-amber-500 hover:border-amber-200 hover:bg-amber-50/40'
                              }`}
                              title={isSaved ? (language === 'KR' ? '루트에서 제거' : 'Remove from My Route') : (language === 'KR' ? '루트(지도)에 담기' : 'Add to My Route')}
                            >
                              <Star className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-500' : ''}`} />
                              <span>{isSaved ? (language === 'KR' ? '루트 담김' : 'In Route') : (language === 'KR' ? '루트 추가' : 'Add')}</span>
                            </button>
                          );

                          return (
                            <div 
                              key={idx} 
                              className="bg-white rounded-lg border border-[#E5E2DC] hover:border-[#8EA85E] transition-colors p-5 flex flex-col justify-between text-left space-y-4"
                            >
                              <div className="space-y-3 text-left">
                                {/* Small TourAPI image thumbnail (only when available) */}
                                {imageUrl && (
                                  <AttractionPhotoThumbnail
                                    src={imageUrl}
                                    alt={step.titleKo}
                                    className="w-full h-28 sm:h-32"
                                  />
                                )}

                                {/* Title & Route Button */}
                                {(() => {
                                  const isFree = typeof step.isFree === 'boolean'
                                    ? step.isFree
                                    : !['뮤지엄원', '아르떼뮤지엄', '영화체험박물관', '과학관', '허심청'].some(k => step.titleKo.includes(k));

                                  const feeText = (
                                    <span className={`text-xs sm:text-sm font-bold shrink-0 ${
                                      isFree
                                        ? 'text-emerald-600'
                                        : 'text-orange-600'
                                    }`}>
                                      {isFree ? (language === 'KR' ? '무료' : 'Free') : (language === 'KR' ? '유료' : 'Paid')}
                                    </span>
                                  );

                                  if (isLongTitle) {
                                    return (
                                      <div className="space-y-1.5">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <h4 className="text-base font-bold text-[#11161B] leading-snug">
                                            {displayTitle}
                                          </h4>
                                          {feeText}
                                        </div>
                                        <div className="flex justify-end pt-0.5">
                                          {renderRouteButton()}
                                        </div>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <h4 className="text-base font-bold text-[#11161B] leading-snug">
                                          {displayTitle}
                                        </h4>
                                        {feeText}
                                      </div>
                                      {renderRouteButton()}
                                    </div>
                                  );
                                })()}

                                {/* Description (Clean, concise, barrier-free boilerplate removed) */}
                                <p className="text-xs text-[#4A5568] font-normal leading-relaxed text-left">
                                  {language === 'KR' ? step.descKo : step.descEn}
                                </p>

                                {step.cityTourInfo && (
                                  <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200/80 space-y-2 text-left mt-2">
                                    <div className="flex items-center justify-between gap-1 border-b border-slate-200/60 pb-1.5">
                                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                                        <Bus className="w-3.5 h-3.5 text-[#8EA85E] shrink-0" />
                                        <span>{language === 'KR' ? '순환형 3개 노선 안내' : '3 Loop Lines Guide'}</span>
                                      </div>
                                      <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                                        {language === 'KR' ? step.cityTourInfo.closedDaysKo : step.cityTourInfo.closedDaysEn}
                                      </span>
                                    </div>

                                    {/* 3개 노선 리스트 */}
                                    <div className="space-y-1.5 text-xs">
                                      {step.cityTourInfo.routes?.map((rt, rIdx) => (
                                        <div key={rIdx} className="flex items-start gap-1.5 text-[11px] leading-tight">
                                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 border ${rt.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                                            {language === 'KR' ? rt.nameKo : rt.nameEn}
                                          </span>
                                          <span className="text-slate-700 font-medium pt-0.5">
                                            {language === 'KR' ? rt.routeKo : rt.routeEn}
                                          </span>
                                        </div>
                                      ))}
                                    </div>

                                    {/* 안내 팁 & 공식 홈페이지 링크 */}
                                    <div className="pt-1.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
                                      <p className="text-[10.5px] font-semibold text-emerald-700">
                                        💡 {language === 'KR' ? step.cityTourInfo.bookingTipKo : step.cityTourInfo.bookingTipEn}
                                      </p>
                                      {step.cityTourInfo.websiteUrl && (
                                        <a
                                          href={step.cityTourInfo.websiteUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8EA85E] hover:text-[#748c48] underline underline-offset-2 ml-auto cursor-pointer"
                                        >
                                          <span>{language === 'KR' ? '공식 예매 및 노선안내' : 'Official Booking & Info'}</span>
                                          <ExternalLink className="w-3 h-3" />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Bottom Transit & Station Info (Clean Address & Square Map Buttons) */}
                              <div className="pt-3 border-t border-[#E5E2DC] space-y-2 text-left">
                                {step.rentalStations && step.rentalStations.length > 0 ? (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A2540]">
                                      <Bike className="w-3.5 h-3.5 text-[#0A2540] shrink-0" />
                                      <span>{language === 'KR' ? '자전거 대여소 안내' : 'Bicycle Rental Stations'}</span>
                                    </div>
                                    <div className="space-y-2">
                                      {step.rentalStations.map((station, sIdx) => {
                                        const cleanStationDesc = (language === 'KR' ? station.descKo : (station.descEn || station.descKo)).replace(/\s*\([^)]*\)/g, '').trim();
                                        return (
                                          <div key={sIdx} className="bg-[#FBFBF9] p-2.5 rounded-lg border border-[#E5E2DC] text-left space-y-1.5">
                                            <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-[#E5E2DC]/60">
                                              <span className="font-bold text-xs text-[#11161B]">
                                                {language === 'KR' ? station.nameKo : (station.nameEn || station.nameKo)}
                                              </span>
                                              <div className="flex items-center gap-1 shrink-0">
                                                {station.naverMapUrl && (
                                                  <a
                                                    href={station.naverMapUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-6 h-6 rounded-md bg-[#03C75A] hover:bg-[#02b350] flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
                                                    title={language === 'KR' ? `${station.nameKo} 네이버 지도에서 보기` : `View ${station.nameKo} on Naver Map`}
                                                    aria-label="Naver Map"
                                                  >
                                                    <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">
                                                      <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
                                                    </svg>
                                                  </a>
                                                )}
                                                {station.googleMapUrl && (
                                                  <a
                                                    href={station.googleMapUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-6 h-6 rounded-md bg-white border border-[#E5E2DC] hover:border-[#4285F4]/40 flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
                                                    title={language === 'KR' ? `${station.nameKo} 구글맵에서 보기` : `View ${station.nameKo} on Google Maps`}
                                                    aria-label="Google Maps"
                                                  >
                                                    <svg viewBox="0 0 92 135" className="w-3 h-3" fill="none">
                                                      <path d="M46 0C20.596 0 0 20.596 0 46c0 34.5 46 89 46 89s46-54.5 46-89C92 20.596 71.404 0 46 0z" fill="#4285F4"/>
                                                      <path d="M46 0c-25.404 0-46 20.596-46 46 0 11.233 4.025 21.528 10.72 29.5L46 46V0z" fill="#EA4335"/>
                                                      <path d="M46 46l35.28 29.5C87.975 67.528 92 57.233 92 46c0-25.404-20.596-46-46-46v46z" fill="#FBBC04"/>
                                                      <path d="M46 46v89s24.62-29.215 37.8-57.5L46 46z" fill="#34A853"/>
                                                      <circle cx="46" cy="46" r="18" fill="#FFFFFF"/>
                                                    </svg>
                                                  </a>
                                                )}
                                              </div>
                                            </div>
                                            <p className="text-[11px] text-[#4A5568] leading-relaxed pl-0.5">
                                              {cleanStationDesc}
                                            </p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {step.stationInfoKo && (() => {
                                      const cleanAddr = (language === 'KR' ? step.stationInfoKo : (step.stationInfoEn || step.stationInfoKo)).replace(/\s*\([^)]*\)/g, '').trim();
                                      const naverUrl = (step.naverMapLinks && step.naverMapLinks[0]?.url) || `https://map.naver.com/v5/search/${encodeURIComponent(step.titleKo + ' ' + cleanAddr)}`;
                                      const googleUrl = step.googleMapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(step.titleKo + ' ' + cleanAddr)}`;

                                      return (
                                        <div className="flex items-center justify-between gap-2">
                                          <p className="text-[11px] text-[#4A5568] flex items-start gap-1 leading-relaxed min-w-0 flex-1">
                                            <span className="shrink-0 text-slate-400">📍</span>
                                            <span className="break-all">{cleanAddr}</span>
                                          </p>

                                          <div className="flex items-center gap-1 shrink-0">
                                            <a
                                              href={naverUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              onClick={(e) => e.stopPropagation()}
                                              className="w-6 h-6 rounded-md bg-[#03C75A] hover:bg-[#02b350] flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
                                              title={language === 'KR' ? `${step.titleKo} 네이버 지도에서 위치 보기` : `View ${step.titleEn || step.titleKo} on Naver Map`}
                                              aria-label="Naver Map"
                                            >
                                              <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">
                                                <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
                                              </svg>
                                            </a>
                                            <a
                                              href={googleUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              onClick={(e) => e.stopPropagation()}
                                              className="w-6 h-6 rounded-md bg-white border border-[#E5E2DC] hover:border-[#4285F4]/40 flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
                                              title={language === 'KR' ? `${step.titleKo} 구글맵에서 위치 보기` : `View ${step.titleEn || step.titleKo} on Google Maps`}
                                              aria-label="Google Maps"
                                            >
                                              <svg viewBox="0 0 92 135" className="w-3 h-3" fill="none">
                                                <path d="M46 0C20.596 0 0 20.596 0 46c0 34.5 46 89 46 89s46-54.5 46-89C92 20.596 71.404 0 46 0z" fill="#4285F4"/>
                                                <path d="M46 0c-25.404 0-46 20.596-46 46 0 11.233 4.025 21.528 10.72 29.5L46 46V0z" fill="#EA4335"/>
                                                <path d="M46 46l35.28 29.5C87.975 67.528 92 57.233 92 46c0-25.404-20.596-46-46-46v46z" fill="#FBBC04"/>
                                                <path d="M46 46v89s24.62-29.215 37.8-57.5L46 46z" fill="#34A853"/>
                                                <circle cx="46" cy="46" r="18" fill="#FFFFFF"/>
                                              </svg>
                                            </a>
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Overall tip block */}
                    <div className="bg-[#FBFBF9] p-5 sm:p-6 text-left flex items-start gap-3.5 rounded-lg border border-[#E5E2DC]">
                      <div className="p-2 rounded-md bg-[#8EA85E] text-white shrink-0 mt-0.5">
                        <Info className="w-4 h-4 text-white shrink-0" />
                      </div>
                      <div className="space-y-1 select-none text-left">
                        <span className="text-[11px] font-mono font-bold text-[#0A2540] uppercase tracking-wider">
                          {language === 'KR' ? '체험 & 박물관 방문 팁' : 'MUSEUM & EXPERIENCE TIP'}
                        </span>
                        <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-normal">
                          {language === 'KR' ? course.overallTipKo : course.overallTipEn}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              // -------------------------------------------------------------
              // PAGE: MARKET (전통시장 코스) - Editorial Travel Magazine
              // -------------------------------------------------------------
              case 'MARKET': {
                const marketSteps = course.steps || [];
                const sortedMarketSteps = [...marketSteps].sort((a, b) => 
                  (a.titleKo || '').localeCompare(b.titleKo || '', 'ko')
                );

                const isFiveDayMarket = (step: ItineraryStep): boolean => {
                  return (
                    step.marketCategory === 'FIVE_DAY' ||
                    (step.titleKo || '').includes('구포시장') ||
                    Boolean(step.marketDayKo && step.marketDayKo !== '상설 (매일)' && !step.marketDayKo.includes('상설'))
                  );
                };

                const filteredMarketSteps = sortedMarketSteps.filter((step) => {
                  if (selectedMarketCat === 'FIVE_DAY') {
                    return isFiveDayMarket(step);
                  }
                  return true;
                });

                const getMarketCategoryCount = (catId: 'ALL' | 'FIVE_DAY'): number => {
                  if (catId === 'ALL') return marketSteps.length;
                  if (catId === 'FIVE_DAY') return marketSteps.filter(isFiveDayMarket).length;
                  return 0;
                };

                const MARKET_CATEGORY_TABS = [
                  { id: 'ALL' as const, nameKo: '전체', nameEn: 'All' },
                  { id: 'FIVE_DAY' as const, nameKo: '오일장', nameEn: '5-Day Market' },
                ];

                return (
                  <div className="space-y-6 animate-fade-in text-left">
                    {/* Header */}
                    <div className="space-y-2 border-b border-slate-200 pb-5 text-left">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Store className="w-7 h-7 sm:w-8 sm:h-8 text-[#8EA85E] shrink-0" />
                        <span>{language === 'KR' ? '부산 전통시장' : 'Busan Traditional Markets'}</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                        {language === 'KR'
                          ? '전통시장에는 정해진 날짜에 열리는 ‘장날’이 있으며, 5일장은 5일에 한 번(특정 날짜 끝자리) 더 큰 장터가 열립니다. 시장마다 열리는 장날이 다르니 미리 확인하고 방문하시면 더욱 활기차고 재미있게 즐기실 수 있습니다.'
                          : 'Traditional markets feature special market days (\'Jangnal\'), such as 5-day periodic markets opening every 5 days on specific ending calendar dates. Schedules vary by market, so check the dates in advance for the liveliest experience!'}
                      </p>
                    </div>

                    {/* Category Filter Pills: 전체 / 오일장 */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      {MARKET_CATEGORY_TABS.map((tab) => {
                        const isSelected = selectedMarketCat === tab.id;
                        const count = getMarketCategoryCount(tab.id);

                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMarketCat(tab.id);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                              isSelected
                                ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs'
                                : 'bg-[#FBFBF9] hover:bg-[#F1EFEC] text-[#11161B] border-[#E5E2DC]'
                            }`}
                          >
                            <span>{language === 'KR' ? tab.nameKo : tab.nameEn}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-[#E5E2DC] text-[#4A5568]'
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Market Cards Grid - Matching Gourmet 3-column Catalog */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                      {filteredMarketSteps.map((step, idx) => {
                        const matchedSpotId = matchTourApiSpotId(step.titleKo);
                        const effectiveSpotId = resolvePlaceTargetId({
                          id: step.id,
                          contentId: step.contentId,
                          titleKo: step.titleKo,
                          titleEn: step.titleEn,
                        }) || matchedSpotId || 'spot-101';
                        const ktoDetail = effectiveSpotId ? getKoreaTourApiPlaceDetail(effectiveSpotId) : null;
                        const imageUrl = step.firstImage || ktoDetail?.firstImage;
                        const isSaved = isBookmarked(step.id || step.titleKo);

                        const rawAddressKo = ktoDetail?.addressRoadKo || step.stationInfoKo || '';
                        const cleanAddressKo = rawAddressKo.replace(/\s*\([^)]*\)/g, '').trim();
                        const rawAddressEn = ktoDetail?.addressRoadEn || step.stationInfoEn || '';
                        const cleanAddressEn = rawAddressEn.replace(/\s*\([^)]*\)/g, '').trim();
                        const cleanAddr = language === 'KR' ? cleanAddressKo : (cleanAddressEn || cleanAddressKo);

                        const naverUrl = step.naverMapUrl || `https://map.naver.com/v5/search/${encodeURIComponent(step.titleKo + ' ' + cleanAddressKo)}`;
                        const googleUrl = step.googleMapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((step.titleEn || step.titleKo) + ' ' + (cleanAddressEn || cleanAddressKo || 'Busan'))}`;

                        const rawDesc = (language === 'KR' ? step.descKo : (step.descEn || step.descKo)) || '';
                        const cleanDesc = rawDesc.replace(/^📍\s*주소:?[^\n]+(\n|$)/i, '').trim();

                        return (
                          <div
                            key={idx}
                            className="bg-white rounded-lg border border-[#E5E2DC] hover:border-[#8EA85E] transition-colors p-3.5 sm:p-4 flex flex-col justify-between text-left space-y-2"
                          >
                            <div className="space-y-1.5 text-left">
                              {/* TourAPI Image Thumbnail (When available) */}
                              {imageUrl && (
                                <AttractionPhotoThumbnail
                                  src={imageUrl}
                                  alt={step.titleKo}
                                  className="w-full h-32 sm:h-36 mb-2"
                                />
                              )}
                              {/* Header: Title & Route Button on the SAME line */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                  <h4 className="text-[15px] sm:text-base font-bold text-[#11161B] leading-snug">
                                    {language === 'KR' ? step.titleKo : step.titleEn}
                                  </h4>
                                  {isFiveDayMarket(step) && (
                                    <span className="text-[10px] sm:text-[10.5px] font-bold text-[#2D6A4F] bg-[#E8F5E9] border border-[#2D6A4F]/25 px-1.5 py-0.2 rounded shrink-0">
                                      {language === 'KR' ? '오일장' : '5-Day Market'}
                                    </span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleMyRoute({
                                      id: step.id || step.titleKo,
                                      titleKo: step.titleKo,
                                      titleEn: step.titleEn,
                                      categoryKo: '전통시장',
                                      categoryEn: 'Market',
                                      addressRoadKo: cleanAddressKo,
                                      stationInfoKo: cleanAddressKo,
                                      stationInfoEn: cleanAddressEn,
                                      descKo: step.descKo,
                                      descEn: step.descEn,
                                      firstImage: ktoDetail?.firstImage,
                                      latitude: ktoDetail?.latitude,
                                      longitude: ktoDetail?.longitude,
                                    });
                                  }}
                                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold shrink-0 ${
                                    isSaved
                                      ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 shadow-2xs'
                                      : 'bg-white text-slate-500 border-slate-200 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50/40'
                                  }`}
                                  title={isSaved ? (language === 'KR' ? '루트에서 제거' : 'Remove from My Route') : (language === 'KR' ? '루트(지도)에 담기' : 'Add to My Route')}
                                >
                                  <Star className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-500' : ''}`} />
                                  <span>{isSaved ? (language === 'KR' ? '루트 담김' : 'In Route') : (language === 'KR' ? '루트 추가' : 'Add')}</span>
                                </button>
                              </div>

                              {/* Market Day (장날) - 5일장에만 표시, 상설시장은 표시 생략 */}
                              {isFiveDayMarket(step) && (step.marketDayKo || step.marketDayEn) && (
                                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-left">
                                  <span className="font-semibold text-slate-500">
                                    {language === 'KR' ? '장날' : 'Market Day'}
                                  </span>
                                  <span className="text-slate-300">·</span>
                                  <span className="font-bold text-[#2D6A4F] bg-[#E8F5E9] px-1.5 py-0.5 rounded text-[10.5px] sm:text-[11px] border border-[#2D6A4F]/20">
                                    {language === 'KR' ? (step.marketDayKo || '5일장') : (step.marketDayEn || '5-Day Market')}
                                  </span>
                                </div>
                              )}

                              {/* Description: 1 simple clean line */}
                              {cleanDesc && (
                                <p className="text-[11.5px] sm:text-xs text-[#4A5568] font-normal leading-relaxed text-left">
                                  {cleanDesc}
                                </p>
                              )}
                            </div>

                            {/* Bottom: Address + Naver & Google Maps square icon buttons (Exact match to Gourmet page) */}
                            {cleanAddr && (
                              <div className="mt-2.5 pt-2 border-t border-[#E5E2DC] text-left">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-[11px] sm:text-[11.5px] text-[#4A5568] flex items-center gap-1 leading-snug min-w-0 flex-1">
                                    <span className="shrink-0 text-slate-400">📍</span>
                                    <span className="truncate">{cleanAddr}</span>
                                  </p>

                                  <div className="flex items-center gap-1 shrink-0">
                                    {/* Naver Map Button */}
                                    <a
                                      href={naverUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-md bg-[#03C75A] hover:bg-[#02b350] flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
                                      title={language === 'KR' ? `${step.titleKo} 네이버 지도에서 위치 보기` : `View ${step.titleKo} on Naver Map`}
                                      aria-label="Naver Map"
                                    >
                                      <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">
                                        <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
                                      </svg>
                                    </a>

                                    {/* Google Maps Button */}
                                    <a
                                      href={googleUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-md bg-white border border-[#E5E2DC] hover:border-[#4285F4]/40 flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
                                      title={language === 'KR' ? `${step.titleKo} 구글맵에서 위치 보기` : `View ${step.titleKo} on Google Maps`}
                                      aria-label="Google Maps"
                                    >
                                      <svg viewBox="0 0 92 135" className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none">
                                        <path d="M46 0C20.596 0 0 20.596 0 46c0 34.5 46 89 46 89s46-54.5 46-89C92 20.596 71.404 0 46 0z" fill="#4285F4"/>
                                        <path d="M46 0c-25.404 0-46 20.596-46 46 0 11.233 4.025 21.528 10.72 29.5L46 46V0z" fill="#EA4335"/>
                                        <path d="M46 46l35.28 29.5C87.975 67.528 92 57.233 92 46c0-25.404-20.596-46-46-46v46z" fill="#FBBC04"/>
                                        <path d="M46 46v89s24.62-29.215 37.8-57.5L46 46z" fill="#34A853"/>
                                        <circle cx="46" cy="46" r="18" fill="#FFFFFF"/>
                                      </svg>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Overall tip block */}
                    <div className="bg-[#FBFBF9] p-5 sm:p-6 text-left flex items-start gap-3.5 rounded-lg border border-[#E5E2DC]">
                      <div className="p-2 rounded-md bg-[#8EA85E] text-white shrink-0 mt-0.5">
                        <Info className="w-4 h-4 text-white shrink-0" />
                      </div>
                      <div className="space-y-1 select-none text-left">
                        <span className="text-[11px] font-mono font-bold text-[#0A2540] uppercase tracking-wider">
                          {language === 'KR' ? '전통시장 방문 여행 팁' : 'TRADITIONAL MARKET VISIT TIP'}
                        </span>
                        <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-normal">
                          {language === 'KR' ? course.overallTipKo : course.overallTipEn}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              // -------------------------------------------------------------
              // PAGE 8: SUBWAY (부산 도시철도 코스) - Editorial Travel Magazine
              // -------------------------------------------------------------
              case 'SUBWAY': {
                const currentLine = activeRegionPage === 'LINE2' ? 'LINE2' : 'LINE1';

                const LINE1_GROUPS_CONFIG = [
                  {
                    id: 'LINE1_BEOMEOSA',
                    nameKo: '범어사역',
                    nameEn: 'Beomeosa Station',
                    badgeKo: '천년 고찰 & 피톤치드 힐링',
                    badgeEn: 'Ancient Sanctuary & Pine Forest',
                  },
                  {
                    id: 'LINE1_ONCHEONJANG',
                    nameKo: '온천장역',
                    nameEn: 'Oncheonjang Station',
                    badgeKo: '온천 힐링 & 벚꽃 산책',
                    badgeEn: 'Hot Springs & Cherry Blossoms',
                  },
                  {
                    id: 'LINE1_SEOMYEON_BUJEON',
                    nameKo: '서면역 · 부전역',
                    nameEn: 'Seomyeon & Bujeon Stations',
                    badgeKo: '전통시장 & 중심 번화가',
                    badgeEn: 'Traditional Market & Downtown',
                  },
                  {
                    id: 'LINE1_BUSAN_STN',
                    nameKo: '부산역',
                    nameEn: 'Busan Station',
                    badgeKo: '부산의 관문 & 북항 친수공원',
                    badgeEn: 'Gateway of Busan & North Port',
                  },
                  {
                    id: 'LINE1_JUNGANG_NAMPO_JAGALCHI',
                    nameKo: '중앙역 · 남포역 · 자갈치역',
                    nameEn: 'Jungang · Nampo · Jagalchi',
                    badgeKo: '지하상가 연결 코스',
                    badgeEn: 'Underground Concourse Walk',
                  },
                  {
                    id: 'LINE1_DADAEPO',
                    nameKo: '다대포해수욕장역',
                    nameEn: 'Dadaepo Beach Station',
                    badgeKo: '일몰 낙조 & 생태 산책로',
                    badgeEn: 'Sunset & Wetland Boardwalk',
                  },
                ];

                const LINE2_GROUPS_CONFIG = [
                  {
                    id: 'LINE2_HWAMYEONG',
                    nameKo: '화명역',
                    nameEn: 'Hwamyeong Station',
                    badgeKo: '생태 공원 & 장미 힐링',
                    badgeEn: 'Eco Park & Rose Gardens',
                  },
                  {
                    id: 'LINE2_DEOKCHEON',
                    nameKo: '덕천역',
                    nameEn: 'Deokcheon Station',
                    badgeKo: '환승 거점 & 전통 구포시장',
                    badgeEn: 'Transfer Hub & Gupo Market',
                  },
                  {
                    id: 'LINE2_JEONPO',
                    nameKo: '전포역',
                    nameEn: 'Jeonpo Station',
                    badgeKo: '감성 카페거리 & 소품샵',
                    badgeEn: 'Cafe Street & Boutique Alleys',
                  },
                  {
                    id: 'LINE2_GEUMRYEONSAN_GWANGALLI',
                    nameKo: '금련산역 · 광안리역',
                    nameEn: 'Geumryeonsan · Gwangalli',
                    badgeKo: '광안대교 오션뷰 & 드론쇼',
                    badgeEn: 'Gwangandaegyo View & Drone Show',
                  },
                  {
                    id: 'LINE2_CENTUM_CITY',
                    nameKo: '센텀시티역',
                    nameEn: 'Centum City Station',
                    badgeKo: '세계 최대 백화점 & 영화의전당',
                    badgeEn: 'World Record Mall & Cinema Center',
                  },
                  {
                    id: 'LINE2_HAEUNDAE_DONGBAEK',
                    nameKo: '해운대역 · 동백역',
                    nameEn: 'Haeundae · Dongbaek',
                    badgeKo: '해운대 해변 & 블루라인파크',
                    badgeEn: 'Haeundae Beach & Blueline Park',
                  },
                ];

                const currentRegion = REGION_RECOMMENDATIONS.find(r => r.id === currentLine);
                const allLandmarks = currentRegion?.landmarks || [];
                const groupsToRender = (currentLine === 'LINE1' ? LINE1_GROUPS_CONFIG : LINE2_GROUPS_CONFIG)
                  .filter(g => selectedStationGroup === 'ALL' || g.id === selectedStationGroup);

                return (
                  <div className="space-y-6 animate-fade-in text-left">
                    {/* Header with Line Icon */}
                    <div className="space-y-2 border-b border-slate-200 pb-5 text-left">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Train className="w-7 h-7 sm:w-8 sm:h-8 text-[#8EA85E] shrink-0 stroke-[2.2]" />
                        <span>{language === 'KR' ? '부산 도시철도 코스' : 'Busan Metro Course'}</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                        {language === 'KR'
                          ? '지하철 1·2호선 노선축을 따라 역세권 명소와 맛집을 한눈에 둘러보는 코스입니다.'
                          : 'Explore top attractions and local food conveniently connected along Metro Lines 1 & 2.'}
                      </p>
                    </div>

                    {/* Line Switcher & Filter Controller */}
                    <div className="space-y-4 pt-1 text-left">
                      {/* 1호선 / 2호선 Line Tabs with Soft Eye-friendly Pastel Colors - Borderless */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (setActiveRegionPage) {
                              setActiveRegionPage('LINE1');
                            } else {
                              setLocalActiveRegionPage('LINE1');
                            }
                            setSelectedStationGroup('ALL');
                          }}
                          className={`p-4 rounded-xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 ${
                            currentLine === 'LINE1'
                              ? 'bg-[#FFF7ED] text-[#9A3412] shadow-2xs'
                              : 'bg-orange-50/40 hover:bg-[#FFF7ED]/70 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 w-full">
                            <div className="flex items-center gap-1.5">
                              <span className="text-lg sm:text-xl font-black text-[#EA580C] tracking-tight">
                                {language === 'KR' ? '1호선' : 'Line 1'}
                              </span>
                              <span className="text-xs sm:text-sm font-bold text-[#EA580C]/80">
                                {language === 'KR' ? '(Line 1)' : ''}
                              </span>
                            </div>
                            {currentLine === 'LINE1' && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#EA580C]">
                                ✓ {language === 'KR' ? '선택됨' : 'Selected'}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-600 font-normal leading-relaxed">
                            <span className="font-bold text-slate-900">
                              {language === 'KR' ? '노포역 ↔ 다대포해수욕장역' : 'Nopo Stn ↔ Dadaepo Beach Stn'}
                            </span>
                            <span className="text-orange-300 mx-1.5 font-bold">|</span>
                            <span>
                              {language === 'KR'
                                ? '총 40개 역 (39.9km) · 원도심, 동래, 남포, 부산역 축'
                                : '40 stations (39.9km) · Old Downtown, Dongnae, Nampo, Busan Stn'}
                            </span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (setActiveRegionPage) {
                              setActiveRegionPage('LINE2');
                            } else {
                              setLocalActiveRegionPage('LINE2');
                            }
                            setSelectedStationGroup('ALL');
                          }}
                          className={`p-4 rounded-xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 ${
                            currentLine === 'LINE2'
                              ? 'bg-[#F0FDF4] text-[#166534] shadow-2xs'
                              : 'bg-emerald-50/40 hover:bg-[#F0FDF4]/70 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 w-full">
                            <div className="flex items-center gap-1.5">
                              <span className="text-lg sm:text-xl font-black text-[#16A34A] tracking-tight">
                                {language === 'KR' ? '2호선' : 'Line 2'}
                              </span>
                              <span className="text-xs sm:text-sm font-bold text-[#16A34A]/80">
                                {language === 'KR' ? '(Line 2)' : ''}
                              </span>
                            </div>
                            {currentLine === 'LINE2' && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#16A34A]">
                                ✓ {language === 'KR' ? '선택됨' : 'Selected'}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-600 font-normal leading-relaxed">
                            <span className="font-bold text-slate-900">
                              {language === 'KR' ? '장산역 ↔ 양산역' : 'Jangsan Stn ↔ Yangsan Stn'}
                            </span>
                            <span className="text-emerald-300 mx-1.5 font-bold">|</span>
                            <span>
                              {language === 'KR'
                                ? '총 43개 역 (45.2km) · 해운대, 센텀, 광안리, 서면 축'
                                : '43 stations (45.2km) · Haeundae, Centum, Gwangalli, Seomyeon'}
                            </span>
                          </div>
                        </button>
                      </div>

                      {/* Station Filter Cards (Subway Station Exit Style matching App.tsx) */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${currentLine === 'LINE1' ? 'bg-[#EA580C]' : 'bg-[#16A34A]'}`} />
                            <h3 className="font-bold text-sm sm:text-base text-slate-800">
                              {language === 'KR'
                                ? (currentLine === 'LINE1' ? '1호선 지하철역 선택' : '2호선 지하철역 선택')
                                : (currentLine === 'LINE1' ? 'Select Line 1 Station' : 'Select Line 2 Station')}
                            </h3>
                          </div>
                          {selectedStationGroup !== 'ALL' && (
                            <button
                              type="button"
                              onClick={() => setSelectedStationGroup('ALL')}
                              className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline underline-offset-2 cursor-pointer"
                            >
                              {language === 'KR' ? '전체 역 보기' : 'Show All Stations'}
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5">
                          {(currentLine === 'LINE1' ? LINE1_STATION_TABS : LINE2_STATION_TABS).map((tab) => {
                            const isActive = selectedStationGroup === tab.id;
                            return (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStationGroup(isActive && tab.id !== 'ALL' ? 'ALL' : tab.id);
                                }}
                                className={`px-1.5 py-2.5 sm:px-2 sm:py-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-center items-center gap-1 active:scale-95 shadow-2xs min-h-[66px] sm:min-h-[72px] ${
                                  isActive
                                    ? (currentLine === 'LINE1'
                                        ? 'bg-[#EA580C] border-[#EA580C] text-white shadow-sm ring-2 ring-[#EA580C]/20'
                                        : 'bg-[#16A34A] border-[#16A34A] text-white shadow-sm ring-2 ring-[#16A34A]/20')
                                    : 'bg-white border-slate-300 hover:border-[#8EA85E] hover:bg-slate-50 text-slate-800'
                                }`}
                              >
                                <span className={`font-bold text-xs sm:text-[13px] font-heading leading-tight break-keep text-center select-none ${isActive ? 'text-white' : 'text-slate-800'}`}>
                                  {language === 'KR' ? tab.nameKo : tab.nameEn}
                                </span>
                                <span className={`text-[9.5px] sm:text-[10px] font-mono uppercase font-semibold tracking-tight text-center leading-tight break-words select-none ${isActive ? (currentLine === 'LINE1' ? 'text-orange-100' : 'text-emerald-100') : 'text-slate-400'}`}>
                                  {tab.englishName || tab.nameEn}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Stations and Nearby Places List (3 Columns Grid) */}
                      <div className="space-y-8 pt-4">
                        {groupsToRender.map((group) => {
                          const placesInGroup = allLandmarks.filter(item => item.stationGroup === group.id);

                          return (
                            <div key={group.id} className="space-y-4 animate-fade-in">
                              {/* Station Group Header */}
                              <div className="pb-2.5 border-b border-slate-200">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`w-2.5 h-2.5 rounded-full ${currentLine === 'LINE1' ? 'bg-[#EA580C]' : 'bg-[#16A34A]'} shrink-0`} />
                                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                                    {language === 'KR' ? group.nameKo : group.nameEn}
                                  </h3>
                                </div>
                              </div>

                              {/* Places Grid under this station - 3 Columns */}
                              {placesInGroup.length === 0 ? (
                                <div className="text-center py-6 text-slate-400 text-xs font-medium">
                                  {language === 'KR' ? '추천 장소 정보가 준비 중입니다.' : 'Places coming soon.'}
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {placesInGroup.map((item, idx) => {
                                    const isSaved = isBookmarked(item.nameKo);
                                    const cleanAddress = (language === 'KR' ? item.addressKo : (item.addressEn || item.addressKo || '')).replace(/\s*\([^)]*\)/g, '').trim();
                                    const naverUrl = `https://map.naver.com/v5/search/${encodeURIComponent(item.nameKo + ' ' + cleanAddress)}`;
                                    const googleUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((item.nameEn || item.nameKo) + ' ' + cleanAddress)}`;

                                    const isPaid = ['영화체험박물관', '허심청', '뮤지엄 원', '뮤지엄원', '블루라인파크'].some(k => item.nameKo.includes(k));
                                    const isFree = !isPaid;

                                    const feeText = (
                                      <span className={`text-xs sm:text-sm font-bold shrink-0 ${
                                        isFree
                                          ? 'text-emerald-600'
                                          : 'text-orange-600'
                                      }`}>
                                        {isFree ? (language === 'KR' ? '무료' : 'Free') : (language === 'KR' ? '유료' : 'Paid')}
                                      </span>
                                    );

                                    const displayTitle = language === 'KR' ? item.nameKo : item.nameEn;
                                    const isLongTitle = displayTitle.length > 12;

                                    const renderRouteButton = () => (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleMyRoute({
                                            id: item.nameKo,
                                            titleKo: item.nameKo,
                                            titleEn: item.nameEn,
                                            categoryKo: item.stationGroupNameKo || '도시철도 명소',
                                            categoryEn: item.stationGroupNameEn || 'Subway Landmark',
                                            addressRoadKo: item.addressKo,
                                            stationInfoKo: item.tagKo,
                                            stationInfoEn: item.tagEn,
                                            descKo: item.descKo,
                                            descEn: item.descEn,
                                            firstImage: item.imageUrl,
                                          });
                                        }}
                                        className={`shrink-0 px-2 py-1 rounded-md border transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold ${
                                          isSaved
                                            ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 shadow-2xs'
                                            : 'bg-white text-slate-500 border-slate-200 hover:text-amber-500 hover:border-amber-200 hover:bg-amber-50/40'
                                        }`}
                                        title={isSaved ? (language === 'KR' ? '루트에서 제거' : 'Remove from My Route') : (language === 'KR' ? '루트(지도)에 담기' : 'Add to My Route')}
                                      >
                                        <Star className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-500' : ''}`} />
                                        <span>{isSaved ? (language === 'KR' ? '루트 담김' : 'In Route') : (language === 'KR' ? '루트 추가' : 'Add')}</span>
                                      </button>
                                    );

                                    return (
                                      <div
                                        key={idx}
                                        className="bg-white rounded-lg border border-[#E5E2DC] hover:border-[#8EA85E] transition-colors p-5 flex flex-col justify-between text-left space-y-4 shadow-xs"
                                      >
                                        <div className="space-y-3 text-left">
                                          {/* TourAPI Image Thumbnail */}
                                          {item.imageUrl && (
                                            <AttractionPhotoThumbnail
                                              src={item.imageUrl}
                                              alt={displayTitle}
                                              className="w-full h-32 sm:h-36"
                                            />
                                          )}

                                          {/* Title & Route Button */}
                                          {isLongTitle ? (
                                            <div className="space-y-1.5">
                                              <div className="flex items-center gap-1.5 flex-wrap">
                                                <h4 className="text-base font-bold text-[#11161B] leading-snug">
                                                  {displayTitle}
                                                </h4>
                                                {feeText}
                                              </div>
                                              <div className="flex justify-end pt-0.5">
                                                {renderRouteButton()}
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
                                              <div className="flex items-center gap-1.5 flex-wrap">
                                                <h4 className="text-base font-bold text-[#11161B] leading-snug">
                                                  {displayTitle}
                                                </h4>
                                                {feeText}
                                              </div>
                                              {renderRouteButton()}
                                            </div>
                                          )}

                                          {/* Description */}
                                          <p className="text-xs text-[#4A5568] font-normal leading-relaxed text-left">
                                            {language === 'KR' ? item.descKo : item.descEn}
                                          </p>
                                        </div>

                                        {/* Bottom Address + MapAppIcons */}
                                        <div className="pt-3 border-t border-[#E5E2DC] text-left">
                                          <div className="flex items-center justify-between gap-2">
                                            <p className="text-[11px] sm:text-[11.5px] text-[#4A5568] flex items-center gap-1 leading-snug min-w-0 flex-1">
                                              <span className="shrink-0 text-slate-400">📍</span>
                                              <span className="truncate">{cleanAddress}</span>
                                            </p>

                                            <MapAppIcons
                                              naverUrl={naverUrl}
                                              googleUrl={googleUrl}
                                              title={item.nameKo}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              // -------------------------------------------------------------
              // PAGE: ATTRACTION (명소 코스) - 부산 핵심 랜드마크 & 명소
              // -------------------------------------------------------------
              case 'ATTRACTION': {
                const attractionSteps = course.steps || [];

                return (
                  <div className="space-y-6 animate-fade-in text-left">
                    {/* Header with Landmark Icon */}
                    <div className="space-y-2 border-b border-slate-200 pb-5 text-left">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Landmark className="w-7 h-7 sm:w-8 sm:h-8 text-[#8EA85E] shrink-0" />
                        <span>{language === 'KR' ? '부산 명소' : 'Busan Attractions'}</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                        {language === 'KR'
                          ? '해동 용궁사, 이기대 해안산책로, 태종대, 황령산전망대, 부산용두산공원, 영도대교 등 부산을 대표하는 핵심 명소를 만나보세요.'
                          : 'Explore iconic scenic landmarks including Haedong Yonggungsa, Igidae, Taejongdae, Hwangnyeongsan, Yongdusan, and Yeongdodaegyo.'}
                      </p>
                    </div>

                    {/* Attraction Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
                      {attractionSteps.map((step, idx) => {
                        const matchedSpotId = matchTourApiSpotId(step.titleKo);
                        const effectiveSpotId = resolvePlaceTargetId({
                          id: step.id,
                          contentId: step.contentId,
                          titleKo: step.titleKo,
                          titleEn: step.titleEn,
                        }) || matchedSpotId || 'spot-101';
                        const ktoDetail = effectiveSpotId ? getKoreaTourApiPlaceDetail(effectiveSpotId) : null;
                        const isSaved = isBookmarked(step.id || step.titleKo);

                        // Clean title & address - strictly strip any parentheses
                        const cleanTitleKo = (step.titleKo || '').replace(/\s*\([^)]*\)/g, '').trim();
                        const cleanTitleEn = (step.titleEn || '').replace(/\s*\([^)]*\)/g, '').trim();

                        const rawAddrKo = ktoDetail?.addressRoadKo || step.stationInfoKo || '';
                        const cleanAddrKo = rawAddrKo.replace(/\s*\([^)]*\)/g, '').trim();
                        const rawAddrEn = ktoDetail?.addressRoadEn || step.stationInfoEn || '';
                        const cleanAddrEn = rawAddrEn.replace(/\s*\([^)]*\)/g, '').trim();

                        const displayAddress = language === 'KR' ? cleanAddrKo : (cleanAddrEn || cleanAddrKo);

                        const naverUrl = (step as { naverMapUrl?: string }).naverMapUrl || 
                          `https://map.naver.com/v5/search/${encodeURIComponent(cleanTitleKo + ' ' + cleanAddrKo)}`;
                        const googleUrl = (step as { googleMapUrl?: string }).googleMapUrl || 
                          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((cleanTitleEn || cleanTitleKo) + ' ' + cleanAddrKo)}`;

                        return (
                          <div
                            key={idx}
                            className="bg-white rounded-lg border border-[#E5E2DC] hover:border-[#8EA85E] transition-colors p-3.5 sm:p-4 flex flex-col justify-between text-left space-y-2 shadow-xs"
                          >
                            <div className="space-y-2 text-left">
                              {/* Photo thumbnail */}
                              {(ktoDetail?.firstImage || step.firstImage) && (
                                <AttractionPhotoThumbnail 
                                  src={ktoDetail?.firstImage || step.firstImage || ''} 
                                  alt={cleanTitleKo} 
                                  className="w-full h-36 sm:h-44 mb-1"
                                />
                              )}

                              {/* Header: Title & Route bookmark Button on the same line */}
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-[15px] sm:text-base font-bold text-[#11161B] leading-snug">
                                  {language === 'KR' ? cleanTitleKo : cleanTitleEn}
                                </h4>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleMyRoute({
                                      id: step.id || step.titleKo,
                                      titleKo: cleanTitleKo,
                                      titleEn: cleanTitleEn,
                                      categoryKo: '부산 명소',
                                      categoryEn: 'Attraction',
                                      addressRoadKo: cleanAddrKo,
                                      stationInfoKo: cleanAddrKo,
                                      stationInfoEn: cleanAddrEn,
                                      descKo: step.descKo,
                                      descEn: step.descEn,
                                      firstImage: ktoDetail?.firstImage || step.firstImage,
                                      latitude: ktoDetail?.latitude,
                                      longitude: ktoDetail?.longitude,
                                    });
                                  }}
                                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold shrink-0 ${
                                    isSaved
                                      ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 shadow-2xs'
                                      : 'bg-white text-slate-500 border-slate-200 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50/40'
                                  }`}
                                  title={isSaved ? (language === 'KR' ? '루트에서 제거' : 'Remove from My Route') : (language === 'KR' ? '루트(지도)에 담기' : 'Add to My Route')}
                                >
                                  <Star className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-500' : ''}`} />
                                  <span>{isSaved ? (language === 'KR' ? '루트 담김' : 'In Route') : (language === 'KR' ? '루트 추가' : 'Add')}</span>
                                </button>
                              </div>

                              {/* Description */}
                              {step.descKo && (
                                <p className="text-[11.5px] sm:text-xs text-[#4A5568] font-normal leading-relaxed whitespace-pre-line text-left">
                                  {language === 'KR' ? step.descKo : step.descEn}
                                </p>
                              )}

                              {/* Local Tip Box (부산 현지인 팁) */}
                              {(step.tipKo || step.tipEn) && (
                                <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E5E2DC] text-xs mt-2 text-left space-y-1">
                                  <div className="flex items-center gap-1.5 font-bold text-[#0A2540] text-[11.5px]">
                                    <Lightbulb className="w-3.5 h-3.5 text-[#8EA85E] shrink-0" />
                                    <span>{language === 'KR' ? '부산 현지인 팁' : 'Busan Local Tip'}</span>
                                  </div>
                                  <p className="font-medium text-[#4A5568] text-[11.5px] sm:text-xs leading-relaxed break-keep pl-5">
                                    {language === 'KR' ? step.tipKo : step.tipEn}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Bottom: Address + Naver & Google Maps square icon buttons (Clean & consistent) */}
                            {cleanAddrKo && (
                              <div className="mt-2.5 pt-2 border-t border-[#E5E2DC] text-left">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-[11px] sm:text-[11.5px] text-[#4A5568] flex items-center gap-1.5 leading-snug min-w-0 flex-1">
                                    <MapPin className="w-3.5 h-3.5 text-[#0A2540] shrink-0" />
                                    <span className="truncate">{displayAddress}</span>
                                  </p>

                                  <div className="flex items-center gap-1 shrink-0">
                                    {/* Naver Map Button */}
                                    <a
                                      href={naverUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-md bg-[#03C75A] hover:bg-[#02b350] flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
                                      title={language === 'KR' ? `${cleanTitleKo} 네이버 지도에서 위치 보기` : `View ${cleanTitleKo} on Naver Map`}
                                      aria-label="Naver Map"
                                    >
                                      <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">
                                        <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
                                      </svg>
                                    </a>

                                    {/* Google Maps Button */}
                                    <a
                                      href={googleUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-md bg-white border border-[#E5E2DC] hover:border-[#4285F4]/40 flex items-center justify-center transition-all shadow-2xs hover:scale-105 shrink-0 cursor-pointer"
                                      title={language === 'KR' ? `${cleanTitleKo} 구글맵에서 위치 보기` : `View ${cleanTitleKo} on Google Maps`}
                                      aria-label="Google Maps"
                                    >
                                      <svg viewBox="0 0 92 135" className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none">
                                        <path d="M46 0C20.596 0 0 20.596 0 46c0 34.5 46 89 46 89s46-54.5 46-89C92 20.596 71.404 0 46 0z" fill="#4285F4"/>
                                        <path d="M46 0c-25.404 0-46 20.596-46 46 0 11.233 4.025 21.528 10.72 29.5L46 46V0z" fill="#EA4335"/>
                                        <path d="M46 46l35.28 29.5C87.975 67.528 92 57.233 92 46c0-25.404-20.596-46-46-46v46z" fill="#FBBC04"/>
                                        <path d="M46 46v89s24.62-29.215 37.8-57.5L46 46z" fill="#34A853"/>
                                        <circle cx="46" cy="46" r="18" fill="#FFFFFF"/>
                                      </svg>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Overall tip block */}
                    <div className="bg-[#FBFBF9] p-5 sm:p-6 text-left flex items-start gap-3.5 rounded-lg border border-[#E5E2DC]">
                      <div className="p-2 rounded-md bg-[#8EA85E] text-white shrink-0 mt-0.5">
                        <Info className="w-4 h-4 text-white shrink-0" />
                      </div>
                      <div className="space-y-1 select-none text-left">
                        <span className="text-[11px] font-mono font-bold text-[#0A2540] uppercase tracking-wider">
                          {language === 'KR' ? '부산 명소 여행 꿀팁' : 'BUSAN ATTRACTIONS TRAVEL TIP'}
                        </span>
                        <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-normal">
                          {language === 'KR' ? course.overallTipKo : course.overallTipEn}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              default:
                return null;
            }
          })()}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: PUBLIC TRANSIT TIPS VIEW                                         */}
      {/* ========================================================================= */}
      {activeSection === 'TRANSIT_TIPS' && (
        <div className="space-y-6 sm:space-y-8 animate-fade-in text-left">
          {/* Header Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.01)] space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-3">
              <h2 className="text-lg sm:text-xl font-heading font-extrabold text-slate-800 flex items-center gap-2 shrink-0">
                <span>🚇</span>
                <span>{language === 'KR' ? '부산 대중교통 이용 팁' : 'Busan Public Transit Guide'}</span>
              </h2>
              <p className="text-xs text-slate-500 font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                {language === 'KR' 
                  ? '현지인이 전수하는 최신 대중교통 할인 정책과 무료 환승 완전 정복 가이드입니다.' 
                  : 'The latest public transit discount policies and free transfer guides, straight from Busan locals.'}
              </p>
            </div>
            
            {/* Verification Info - Clean single line on the row below */}
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 whitespace-nowrap overflow-x-auto max-w-full scrollbar-none">
              <span className="font-bold text-[#8EA85E] flex items-center gap-1 shrink-0">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8EA85E] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#8EA85E]"></span>
                </span>
                <span>{language === 'KR' ? '검증 정보' : 'Verified Info'}</span>
              </span>
              <span className="text-slate-300 shrink-0">|</span>
              <span className="shrink-0">{language === 'KR' ? '조사자: 플로레르' : 'Inspector: Florair'}</span>
              <span className="text-slate-300 shrink-0">|</span>
              <span className="shrink-0">
                {language === 'KR' ? '최근 조사일:' : 'Audited:'}{' '}
                <strong className="text-slate-800 font-semibold">{getTodayDate(language)}</strong>{' '}
                <span className="text-blue-600 font-normal">{language === 'KR' ? '기준 (매일 자동 업데이트)' : '(Updated Daily)'}</span>
              </span>
              <span className="text-slate-300 shrink-0">|</span>
              <span className="shrink-0">
                {language === 'KR' ? '공식 출처:' : 'Source:'}{' '}
                <a 
                  href="https://www.busan.go.kr" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-700 hover:text-blue-600 underline font-semibold"
                >
                  {language === 'KR' ? '부산광역시청 홈페이지' : 'Busan City Portal'}
                </a>
              </span>
            </div>
          </div>

          {transitSection === 'SUBMENU' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              {/* SPECIAL BENEFITS / TRANSIT TIPS HEADER SECTION (Style 1: Centered Brand Title) */}
              <div className="text-center py-4 sm:py-6 max-w-3xl mx-auto space-y-2 overflow-hidden">
                <h1 className="text-base xs:text-lg min-[410px]:text-xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading leading-tight whitespace-nowrap">
                  {language === 'KR' 
                    ? '부산 대중교통 및 택시 이용 혜택과 주요 수칙' 
                    : 'Busan Public Transit & Taxi Guide'}
                </h1>
              </div>

              {/* CARD GRID (Style 1: Minimalist outline illustrations with numbers) */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-3.5 xl:gap-4">
                {/* CARD 01: 어린이 대중교통 요금 무료 */}
                <div
                  onClick={() => navigateToSubPage('child-free')}
                  className="relative group bg-white p-3 sm:p-5 lg:p-4 xl:p-6 rounded-2xl sm:rounded-3xl border-2 border-slate-900 hover:border-[#004481] cursor-pointer shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,68,129,1)] transition-all duration-300 text-center flex flex-col justify-between min-h-[235px] sm:min-h-[380px]"
                >
                  <div>
                    {/* Number Badge */}
                    <div className="relative sm:absolute mx-auto sm:mx-0 sm:top-4 sm:left-4 w-5.5 h-5.5 sm:w-7 sm:h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-[11px] sm:text-xs font-black tracking-tight mb-1.5 sm:mb-0 shrink-0">
                      01
                    </div>

                    {/* Title */}
                    <div className="mt-0 sm:mt-4">
                      <h3 className="text-[12px] min-[370px]:text-[13px] sm:text-base lg:text-sm xl:text-lg font-black text-slate-900 tracking-tight leading-tight">
                        {language === 'KR' ? (
                          <>
                            <span className="sm:hidden">어린이 요금 무료</span>
                            <span className="hidden sm:inline">모든 어린이 무료 혜택</span>
                          </>
                        ) : (
                          <>
                            <span className="sm:hidden">Free Child Fare</span>
                            <span className="hidden sm:inline">All Children Free Benefit</span>
                          </>
                        )}
                      </h3>
                    </div>
                  </div>

                  {/* Minimalist Line-Art Illustration */}
                  <div className="my-2 sm:my-6 flex justify-center items-center">
                    <div className="p-2 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                      <svg className="w-10 h-10 sm:w-20 sm:h-20 lg:w-16 lg:h-16 xl:w-20 xl:h-20 text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="50" cy="45" r="22" />
                        <path d="M28 45c0-10 10-18 22-18s22 8 22 18" />
                        <path d="M50 27v-5M44 22h12" />
                        <circle cx="42" cy="42" r="2" fill="currentColor" />
                        <circle cx="58" cy="42" r="2" fill="currentColor" />
                        <path d="M44 51c2 4 10 4 12 0" />
                        <circle cx="36" cy="48" r="1.5" fill="currentColor" opacity="0.5" />
                        <circle cx="64" cy="48" r="1.5" fill="currentColor" opacity="0.5" />
                        <path d="M25 80c5-12 12-13 25-13s20 1 25 13" />
                        <path d="M18 25l2 2m0-2l-2 2M82 25l2 2m0-2l-2 2" strokeWidth="1" />
                        <path d="M50 12l1 3h3l-2.5 2 1 3-2.5-2-2.5 2 1-3-2.5-2h3z" strokeWidth="1" fill="currentColor" />
                      </svg>
                    </div>
                  </div>

                  {/* Subtext */}
                  <div className="space-y-2 sm:space-y-4">
                    <p className="text-[10px] min-[370px]:text-[11px] sm:text-xs xl:text-sm text-slate-500 font-bold leading-tight sm:leading-relaxed">
                      {language === 'KR' ? (
                        <>
                          <span className="sm:hidden">만 6~12세 0원<br />(카드 등록 필수)</span>
                          <span className="hidden sm:inline">만 6세~12세 요금 0원 무료 혜택 등록 및 교통카드 사용법 상세 안내</span>
                        </>
                      ) : (
                        <>
                          <span className="sm:hidden">Ages 6-12 Free<br />(Card required)</span>
                          <span className="hidden sm:inline">Registering for ₩0 fares & using transit cards for kids aged 6 to 12.</span>
                        </>
                      )}
                    </p>
                    <div className="inline-flex items-center justify-center gap-1 sm:gap-2 w-full bg-[#8EA85E] hover:bg-[#7b944f] text-white border-2 border-slate-900 text-[11px] sm:text-xs xl:text-sm font-black py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] sm:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all duration-200 group-hover:scale-[1.02]">
                      <span>
                        {language === 'KR' ? (
                          <>
                            <span className="sm:hidden">상세 정보</span>
                            <span className="hidden sm:inline">상세 가이드 보기</span>
                          </>
                        ) : (
                          <>
                            <span className="sm:hidden">Guide</span>
                            <span className="hidden sm:inline">View Full Guide</span>
                          </>
                        )}
                      </span>
                      <span className="text-xs sm:text-sm">➔</span>
                    </div>
                  </div>
                </div>

                {/* CARD 02: 부산 시내버스 모바일 QR 간편결제 (Zero Pay 글로벌 연동) */}
                <div
                  id="card-bus-qr"
                  onClick={() => navigateToSubPage('bus-qr')}
                  className="relative group bg-white p-3 sm:p-5 lg:p-4 xl:p-6 rounded-2xl sm:rounded-3xl border-2 border-slate-900 hover:border-[#004481] cursor-pointer shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,68,129,1)] transition-all duration-300 text-center flex flex-col justify-between min-h-[235px] sm:min-h-[380px]"
                >
                  <div>
                    {/* Number Badge */}
                    <div className="relative sm:absolute mx-auto sm:mx-0 sm:top-4 sm:left-4 w-5.5 h-5.5 sm:w-7 sm:h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-[11px] sm:text-xs font-black tracking-tight mb-1.5 sm:mb-0 shrink-0">
                      02
                    </div>

                    {/* Title */}
                    <div className="mt-0 sm:mt-4">
                      <h3 className="text-[12px] min-[370px]:text-[13px] sm:text-base lg:text-sm xl:text-lg font-black text-slate-900 tracking-tight leading-tight">
                        {language === 'KR' ? (
                          <>
                            <span className="sm:hidden">버스 QR 간편결제</span>
                            <span className="hidden sm:inline">부산 버스 QR 간편결제</span>
                          </>
                        ) : (
                          <>
                            <span className="sm:hidden">Bus QR Pay</span>
                            <span className="hidden sm:inline">Busan Bus QR Pay</span>
                          </>
                        )}
                      </h3>
                    </div>
                  </div>

                  {/* Minimalist Line-Art Illustration (Smartphone QR scanner) */}
                  <div className="my-2 sm:my-6 flex justify-center items-center">
                    <div className="p-2 sm:p-4 bg-sky-50/70 rounded-xl sm:rounded-2xl border border-sky-200 group-hover:bg-sky-100/80 transition-colors">
                      <svg className="w-10 h-10 sm:w-20 sm:h-20 lg:w-16 lg:h-16 xl:w-20 xl:h-20 text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        {/* Smartphone body */}
                        <rect x="28" y="14" width="44" height="72" rx="8" strokeWidth="2" />
                        <line x1="44" y1="20" x2="56" y2="20" strokeWidth="1.5" />
                        <circle cx="50" cy="79" r="2.5" fill="currentColor" />
                        {/* Screen */}
                        <rect x="33" y="25" width="34" height="48" rx="3" fill="#ffffff" strokeWidth="1" stroke="#cbd5e1" />
                        {/* QR Code finder corners */}
                        <rect x="37" y="29" width="10" height="10" rx="1.5" strokeWidth="1.5" stroke="#004481" />
                        <rect x="40" y="32" width="4" height="4" fill="#004481" />
                        <rect x="53" y="29" width="10" height="10" rx="1.5" strokeWidth="1.5" stroke="#004481" />
                        <rect x="56" y="32" width="4" height="4" fill="#004481" />
                        <rect x="37" y="45" width="10" height="10" rx="1.5" strokeWidth="1.5" stroke="#004481" />
                        <rect x="40" y="48" width="4" height="4" fill="#004481" />
                        {/* QR code data bits */}
                        <rect x="53" y="45" width="3" height="3" fill="#004481" />
                        <rect x="60" y="45" width="3" height="3" fill="#004481" />
                        <rect x="56" y="52" width="7" height="3" fill="#004481" />
                        {/* Scan laser line */}
                        <line x1="31" y1="41" x2="69" y2="41" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 1.5" />
                        {/* Signal waves on top right */}
                        <path d="M76 34c3 3 3 8 0 11" stroke="#004481" strokeWidth="1.5" />
                        <path d="M81 30c5 5 5 16 0 21" stroke="#004481" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Subtext */}
                  <div className="space-y-2 sm:space-y-4">
                    <p className="text-[10px] min-[370px]:text-[11px] sm:text-xs xl:text-sm text-slate-500 font-bold leading-tight sm:leading-relaxed">
                      {language === 'KR' ? (
                        <>
                          <span className="sm:hidden">현금·카드 없이 탑승<br />차내 제로페이 QR 스캔 (1,700원)</span>
                          <span className="hidden sm:inline">현금·카드 없이 알리·위챗·제로페이 등 차내 QR 스캔으로 1,700원 간편 결제</span>
                        </>
                      ) : (
                        <>
                          <span className="sm:hidden">No cash, no card<br />Scan Zero Pay QR (₩1,700)</span>
                          <span className="hidden sm:inline">No cash or card needed: Scan Zero Pay QR with Alipay, WeChat Pay, PayPay (₩1,700)</span>
                        </>
                      )}
                    </p>
                    <div className="inline-flex items-center justify-center gap-1 sm:gap-2 w-full bg-[#8EA85E] hover:bg-[#7b944f] text-white border-2 border-slate-900 text-[11px] sm:text-xs xl:text-sm font-black py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] sm:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all duration-200 group-hover:scale-[1.02]">
                      <span>
                        {language === 'KR' ? (
                          <>
                            <span className="sm:hidden">상세 정보</span>
                            <span className="hidden sm:inline">상세 가이드 보기</span>
                          </>
                        ) : (
                          <>
                            <span className="sm:hidden">Guide</span>
                            <span className="hidden sm:inline">View Full Guide</span>
                          </>
                        )}
                      </span>
                      <span className="text-xs sm:text-sm">➔</span>
                    </div>
                  </div>
                </div>

                {/* CARD 03: 부산 지하철 & 무료 환승 제도 (기존 CARD 02) */}
                <div
                  className="relative group bg-white p-3 sm:p-5 lg:p-4 xl:p-6 rounded-2xl sm:rounded-3xl border-2 border-slate-900 hover:border-[#004481] shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all duration-300 text-center flex flex-col justify-between min-h-[235px] sm:min-h-[380px]"
                >
                  <div>
                    {/* Number Badge */}
                    <div className="relative sm:absolute mx-auto sm:mx-0 sm:top-4 sm:left-4 w-5.5 h-5.5 sm:w-7 sm:h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-[11px] sm:text-xs font-black tracking-tight mb-1.5 sm:mb-0 shrink-0">
                      03
                    </div>

                    {/* Title */}
                    <div className="mt-0 sm:mt-4">
                      <h3 className="text-[12px] min-[370px]:text-[13px] sm:text-base lg:text-sm xl:text-lg font-black text-slate-900 tracking-tight leading-tight">
                        {language === 'KR' ? (
                          <>
                            <span className="sm:hidden">대중교통 무료 환승</span>
                            <span className="hidden sm:inline">부산 대중교통 환승 혜택</span>
                          </>
                        ) : (
                          <>
                            <span className="sm:hidden">Free Transfer</span>
                            <span className="hidden sm:inline">Busan Transit Transfer Benefits</span>
                          </>
                        )}
                      </h3>
                    </div>
                  </div>

                  {/* Minimalist Line-Art Illustration */}
                  <div className="my-2 sm:my-6 flex justify-center items-center">
                    <div className="p-2 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200 transition-colors">
                      <svg className="w-10 h-10 sm:w-20 sm:h-20 lg:w-16 lg:h-16 xl:w-20 xl:h-20 text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 80V40c0-20 15-30 35-30s35 10 35 30v40" strokeDasharray="2 2" stroke="#cbd5e1" />
                        <rect x="25" y="30" width="50" height="42" rx="10" />
                        <rect x="30" y="36" width="40" height="18" rx="4" />
                        <circle cx="37" cy="62" r="3" fill="currentColor" />
                        <circle cx="63" cy="62" r="3" fill="currentColor" />
                        <path d="M10 88h80M25 88l-5 6M75 88l5 6" />
                        <path d="M45 62h10" />
                        <path d="M50 30V18m-10 0h20" />
                      </svg>
                    </div>
                  </div>

                  {/* Subtext */}
                  <div>
                    <p className="text-[10px] min-[370px]:text-[11px] sm:text-xs xl:text-sm text-slate-500 font-bold leading-tight sm:leading-relaxed mb-2 sm:mb-4">
                      {language === 'KR' ? (
                        <>
                          <span className="sm:hidden">30분 내 무료 환승<br />(최대 3회 적용)</span>
                          <span className="hidden sm:inline">30분 이내 무료 환승 및 4대 지하철 노선 거점 주요 수칙 가이드</span>
                        </>
                      ) : (
                        <>
                          <span className="sm:hidden">Within 30 mins<br />(Max 3 transfers)</span>
                          <span className="hidden sm:inline">Free transfers within 30 minutes & key stations overview for 4 lines.</span>
                        </>
                      )}
                    </p>
                    <span className="text-[9.5px] sm:text-[10px] bg-slate-100 text-slate-600 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-black uppercase">
                      {language === 'KR' ? (
                        <>
                          <span className="sm:hidden">상세 정보</span>
                          <span className="hidden sm:inline">아래 상세 안내 포함</span>
                        </>
                      ) : (
                        <>
                          <span className="sm:hidden">Details</span>
                          <span className="hidden sm:inline">Detailed below</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* CARD 04: 버스 휴대품 반입 기준 (기존 CARD 03) */}
                <div
                  className="relative group bg-white p-3 sm:p-5 lg:p-4 xl:p-6 rounded-2xl sm:rounded-3xl border-2 border-slate-900 hover:border-[#004481] shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all duration-300 text-center flex flex-col justify-between min-h-[235px] sm:min-h-[380px]"
                >
                  <div>
                    {/* Number Badge */}
                    <div className="relative sm:absolute mx-auto sm:mx-0 sm:top-4 sm:left-4 w-5.5 h-5.5 sm:w-7 sm:h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-[11px] sm:text-xs font-black tracking-tight mb-1.5 sm:mb-0 shrink-0">
                      04
                    </div>

                    {/* Title */}
                    <div className="mt-0 sm:mt-4">
                      <h3 className="text-[12px] min-[370px]:text-[13px] sm:text-base lg:text-sm xl:text-lg font-black text-slate-900 tracking-tight leading-tight">
                        {language === 'KR' ? (
                          <>
                            <span className="sm:hidden">버스 휴대품 기준</span>
                            <span className="hidden sm:inline">버스 휴대품 반입 기준</span>
                          </>
                        ) : (
                          <>
                            <span className="sm:hidden">Bus Carry-on Limits</span>
                            <span className="hidden sm:inline">Bus Carry-on Limits</span>
                          </>
                        )}
                      </h3>
                    </div>
                  </div>

                  {/* Minimalist Line-Art Illustration */}
                  <div className="my-2 sm:my-6 flex justify-center items-center">
                    <div className="p-2 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200 transition-colors">
                      <svg className="w-10 h-10 sm:w-20 sm:h-20 lg:w-16 lg:h-16 xl:w-20 xl:h-20 text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="28" y="32" width="44" height="48" rx="6" />
                        <path d="M42 32V20h16v12" />
                        <path d="M34 44h32M34 54h32M34 64h32" strokeWidth="1" strokeDasharray="1 1" />
                        <circle cx="36" cy="83" r="3" />
                        <circle cx="64" cy="83" r="3" />
                        <path d="M64 40l6 10-4 2-6-10z" fill="currentColor" opacity="0.1" />
                        <path d="M18 32v48M14 32h8M14 80h8" strokeWidth="1" stroke="#94a3b8" />
                        <text x="8" y="60" fontSize="8" fill="#64748b" fontWeight="bold" stroke="none" fontFamily="monospace">H</text>
                        <path d="M28 90h44M28 86v8M72 86v8" strokeWidth="1" stroke="#94a3b8" />
                        <text x="46" y="98" fontSize="8" fill="#64748b" fontWeight="bold" stroke="none" fontFamily="monospace">W</text>
                      </svg>
                    </div>
                  </div>

                  {/* Subtext */}
                  <div>
                    <p className="text-[10px] min-[370px]:text-[11px] sm:text-xs xl:text-sm text-slate-500 font-bold leading-tight sm:leading-relaxed mb-2 sm:mb-4">
                      {language === 'KR' ? (
                        <>
                          <span className="sm:hidden">20kg 미만 제한<br />50×40×20cm 규격</span>
                          <span className="hidden sm:inline">시내버스 내 20kg 미만, 50×40×20cm 규격 등 승차 허용 수하물 상세</span>
                        </>
                      ) : (
                        <>
                          <span className="sm:hidden">Under 20kg Limit<br />50×40×20cm Size</span>
                          <span className="hidden sm:inline">Allowed carry-on bag sizes (under 20kg, 50x40x20cm) guidelines.</span>
                        </>
                      )}
                    </p>
                    <span className="text-[9.5px] sm:text-[10px] bg-slate-100 text-slate-600 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-black uppercase">
                      {language === 'KR' ? (
                        <>
                          <span className="sm:hidden">상세 정보</span>
                          <span className="hidden sm:inline">아래 상세 안내 포함</span>
                        </>
                      ) : (
                        <>
                          <span className="sm:hidden">Details</span>
                          <span className="hidden sm:inline">Detailed below</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* CARD 05: 부산 택시 이용 팁 & 호출 앱 (기존 CARD 04, 모바일에서는 하단 2열 전폭 배치로 최적화) */}
                <div
                  onClick={() => navigateToSubPage('taxi')}
                  className="col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-1 relative group bg-white p-3 sm:p-5 lg:p-4 xl:p-6 rounded-2xl sm:rounded-3xl border-2 border-slate-900 hover:border-[#004481] cursor-pointer shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,68,129,1)] transition-all duration-300 text-center flex flex-col justify-between min-h-[190px] sm:min-h-[380px]"
                >
                  <div>
                    {/* Number Badge */}
                    <div className="relative sm:absolute mx-auto sm:mx-0 sm:top-4 sm:left-4 w-5.5 h-5.5 sm:w-7 sm:h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-[11px] sm:text-xs font-black tracking-tight mb-1.5 sm:mb-0 shrink-0">
                      05
                    </div>

                    {/* Title */}
                    <div className="mt-0 sm:mt-4">
                      <h3 className="text-[12px] min-[370px]:text-[13px] sm:text-base lg:text-sm xl:text-lg font-black text-slate-900 tracking-tight leading-tight">
                        {language === 'KR' ? (
                          <>
                            <span className="sm:hidden">부산 택시 이용 팁</span>
                            <span className="hidden sm:inline">부산 택시 이용 & 호출 팁</span>
                          </>
                        ) : (
                          <>
                            <span className="sm:hidden">Busan Taxi Tips</span>
                            <span className="hidden sm:inline">Busan Taxi & Calling Apps</span>
                          </>
                        )}
                      </h3>
                    </div>
                  </div>

                  {/* Minimalist Line-Art Illustration */}
                  <div className="my-2 sm:my-6 flex justify-center items-center">
                    <div className="p-2 sm:p-4 bg-amber-50/60 rounded-xl sm:rounded-2xl border border-amber-200 group-hover:bg-amber-100/80 transition-colors">
                      <svg className="w-10 h-10 sm:w-20 sm:h-20 lg:w-16 lg:h-16 xl:w-20 xl:h-20 text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M42 22h16v6H42z" fill="#f59e0b" stroke="#1e293b" strokeWidth="1.5" />
                        <text x="44" y="27" fontSize="5" fontWeight="bold" fill="#1e293b" stroke="none">TAXI</text>
                        <path d="M25 45l8-14h34l8 14" strokeWidth="2" />
                        <rect x="18" y="45" width="64" height="28" rx="6" fill="#fef3c7" stroke="#1e293b" strokeWidth="2" />
                        <rect x="30" y="34" width="40" height="11" rx="2" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
                        <circle cx="26" cy="58" r="4" fill="#fbbf24" stroke="#1e293b" strokeWidth="1.5" />
                        <circle cx="74" cy="58" r="4" fill="#fbbf24" stroke="#1e293b" strokeWidth="1.5" />
                        <path d="M38 58h24M38 62h24" stroke="#1e293b" strokeWidth="1.5" />
                        <circle cx="28" cy="73" r="5" fill="#1e293b" />
                        <circle cx="72" cy="73" r="5" fill="#1e293b" />
                      </svg>
                    </div>
                  </div>

                  {/* Subtext */}
                  <div className="space-y-2 sm:space-y-4">
                    <p className="text-[10px] min-[370px]:text-[11px] sm:text-xs xl:text-sm text-slate-500 font-bold leading-tight sm:leading-relaxed">
                      {language === 'KR' ? (
                        <>
                          <span className="sm:hidden">기본요금 4,800원<br />k.ride · 우버 · 카카오T</span>
                          <span className="hidden sm:inline">기본요금 4,800원, 카카오T/k.ride/우버 호출, 대형 수하물 및 영수증 팁</span>
                        </>
                      ) : (
                        <>
                          <span className="sm:hidden">Base Fare ₩4,800<br />k.ride · Uber · Kakao T</span>
                          <span className="hidden sm:inline">Base fare ₩4,800, Kakao T/k.ride/Uber apps, luggage & receipt safety.</span>
                        </>
                      )}
                    </p>
                    <div className="inline-flex items-center justify-center gap-1 sm:gap-2 w-full bg-[#8EA85E] hover:bg-[#7b944f] text-white border-2 border-slate-900 text-[11px] sm:text-xs xl:text-sm font-black py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] sm:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all duration-200 group-hover:scale-[1.02]">
                      <span>
                        {language === 'KR' ? (
                          <>
                            <span className="sm:hidden">상세 정보</span>
                            <span className="hidden sm:inline">상세 가이드 보기</span>
                          </>
                        ) : (
                          <>
                            <span className="sm:hidden">Guide</span>
                            <span className="hidden sm:inline">View Full Guide</span>
                          </>
                        )}
                      </span>
                      <span className="text-xs sm:text-sm">➔</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* HIGH-VISIBILITY DETAIL PANELS (Style 2: Layout like the brochure flyers in image 2) */}
              <div className="space-y-8 pt-8 border-t border-slate-100">
                {/* Sub-panel 1: High-contrast split scorecard for transfer guidelines */}
                <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
                  <div className="p-6 sm:p-8 bg-[#8EA85E]/10 border-b border-slate-100 flex items-center gap-2.5">
                    <span className="text-xl">🔄</span>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-800">
                        {language === 'KR' ? '부산 대중교통 무료 환승 기준 안내' : 'Busan Public Transit Free Transfer Guide'}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        {language === 'KR' ? '버스, 지하철 간 무료 환승을 위해 탑승 전 반드시 숙지하세요.' : 'Important rules for hassle-free free transit connection.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-150">
                    {/* Left: Allowed transfers (Green highlights) */}
                    <div className="p-6 sm:p-8 space-y-4">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <p className="text-sm font-black uppercase tracking-wider">{language === 'KR' ? '무료 환승 적용 가능 수칙' : 'Allowed / Applies to'}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3.5 bg-emerald-50/40 rounded-2xl border border-emerald-100/50">
                          <span className="text-xl text-emerald-600 shrink-0">✓</span>
                          <div className="space-y-0.5">
                            <h4 className="text-xs sm:text-sm font-black text-slate-800">{language === 'KR' ? '하차 태그 후 30분 이내 승차' : 'Tap off within 30 Minutes'}</h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                              {language === 'KR' 
                                ? '교통카드 하차 접촉 후 30분 이내에 환승 수단에 승차해야 정상 적용됩니다.' 
                                : 'You must tap card on departure and board next transit within 30 mins.'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3.5 bg-emerald-50/40 rounded-2xl border border-emerald-100/50">
                          <span className="text-xl text-emerald-600 shrink-0">✓</span>
                          <div className="space-y-0.5">
                            <h4 className="text-xs sm:text-sm font-black text-slate-800">{language === 'KR' ? '최대 2회 (총 3대 수단) 지원' : 'Up to 2 consecutive transfers'}</h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                              {language === 'KR' 
                                ? '버스 ➔ 버스, 버스 ➔ 지하철 등 상이한 노선 및 교통수단 간 최대 2회 연계 혜택을 줍니다.' 
                                : 'Supports up to 2 transfers across different routes/means (e.g. Bus ➔ Subway).'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Excluded transfers (Red highlights) */}
                    <div className="p-6 sm:p-8 space-y-4">
                      <div className="flex items-center gap-2 text-rose-800">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                        <p className="text-sm font-black uppercase tracking-wider">{language === 'KR' ? '환승 적용 예외 및 불가 기준' : 'Exclusions / Disallowed'}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3.5 bg-rose-50/40 rounded-2xl border border-rose-100/50">
                          <span className="text-xl text-rose-600 shrink-0">✗</span>
                          <div className="space-y-0.5">
                            <h4 className="text-xs sm:text-sm font-black text-slate-800">{language === 'KR' ? '동일 번호 버스 노선 간 환승 불가' : 'Same Bus Route Number'}</h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                              {language === 'KR' 
                                ? '동일 노선(예: 100번 버스에서 내린 뒤 같은 번호인 100번 승차)은 환승 할인이 적용되지 않습니다.' 
                                : 'Transfer discount is bypassed if boarding the exact same bus route number.'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3.5 bg-rose-50/40 rounded-2xl border border-rose-100/50">
                          <span className="text-xl text-rose-600 shrink-0">✗</span>
                          <div className="space-y-0.5">
                            <h4 className="text-xs sm:text-sm font-black text-slate-800">{language === 'KR' ? '지하철 개찰구 외부 이용 간 환승 불가' : 'Subway to Subway (Exit/Re-enter)'}</h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                              {language === 'KR' 
                                ? '개찰구 밖으로 나갔다가 지하철을 다시 탑승할 경우 환승으로 인정되지 않고 기본요금이 새로 청구됩니다.' 
                                : 'Exiting a subway turnstile and re-entering does not count as a transfer.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-panel 3: Illustrated luggage & food allowance comparison block based on provided regulations */}
                <div className="bg-[#fcfcfd] p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🚌</span>
                      <h3 className="text-base sm:text-lg font-black text-slate-800">
                        {language === 'KR' ? '부산 시내버스 휴대품 및 음식물 반입 기준' : 'Busan City Bus Luggage & Food Regulations'}
                      </h3>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100 uppercase self-start sm:self-auto">
                      {language === 'KR' ? '탑승 전 확인 필수' : 'Check before boarding'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* LEFT: Personal Belongings Regulations (휴대품 반입 규정) */}
                    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/70 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🧳</span>
                        <div>
                          <h4 className="text-sm sm:text-base font-black text-slate-800">
                            {language === 'KR' ? '휴대품 반입 규정' : 'Restrictions on Personal Belongings'}
                          </h4>
                          <p className="text-[10px] sm:text-xs text-rose-600 font-extrabold mt-0.5">
                            {language === 'KR' ? '부피가 큰 거대물품 등을 들고 타지 맙시다.' : 'No Bulky Belongings Allowed.'}
                          </p>
                        </div>
                      </div>

                      {/* Interactive Visual Illustration Board */}
                      <div className="grid grid-cols-2 gap-4 py-4 px-3 bg-slate-50 rounded-2xl border border-slate-100">
                        {/* Allowed (Green) */}
                        <div className="flex flex-col items-center justify-between p-3 bg-white rounded-xl border border-emerald-100 shadow-3xs text-center space-y-2">
                          <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                            {language === 'KR' ? '반입 가능' : 'ALLOWED'}
                          </span>
                          <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 border-emerald-500 bg-emerald-50/20 shadow-inner">
                            <svg width="72" height="72" viewBox="0 0 100 100" className="w-18 h-18">
                              <g transform="translate(10, 5)">
                                {/* Dimensions indicator lines */}
                                <line x1="8" y1="20" x2="8" y2="72" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                                <text x="1" y="48" fill="#047857" fontSize="8" fontWeight="black">50cm</text>
                                
                                <line x1="20" y1="78" x2="60" y2="78" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                                <text x="32" y="86" fill="#047857" fontSize="8" fontWeight="black">40cm</text>

                                <line x1="64" y1="20" x2="74" y2="10" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                                <text x="70" y="22" fill="#047857" fontSize="8" fontWeight="black">20cm</text>

                                {/* Handle */}
                                <rect x="30" y="5" width="20" height="15" rx="2" fill="none" stroke="#1e293b" strokeWidth="3" />
                                <line x1="30" y1="15" x2="30" y2="20" stroke="#1e293b" strokeWidth="3" />
                                <line x1="50" y1="15" x2="50" y2="20" stroke="#1e293b" strokeWidth="3" />
                                {/* Main body */}
                                <rect x="20" y="20" width="40" height="52" rx="6" fill="#3b82f6" stroke="#1e293b" strokeWidth="3" />
                                {/* Front design / pocket */}
                                <rect x="26" y="28" width="28" height="36" rx="4" fill="#60a5fa" stroke="#1e293b" strokeWidth="2" />
                                {/* Wheels */}
                                <circle cx="28" cy="75" r="4" fill="#1e293b" />
                                <circle cx="52" cy="75" r="4" fill="#1e293b" />
                              </g>
                            </svg>
                          </div>
                          <span className="text-[10px] font-black text-slate-700">
                            {language === 'KR' ? '기내용 20인치 이하' : 'Under 20" Carry-on'}
                          </span>
                        </div>

                        {/* Prohibited (Red) */}
                        <div className="flex flex-col items-center justify-between p-3 bg-white rounded-xl border border-rose-100 shadow-3xs text-center space-y-2">
                          <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                            {language === 'KR' ? '반입 불가' : 'PROHIBITED'}
                          </span>
                          <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 border-rose-500 bg-rose-50/20 shadow-inner overflow-hidden">
                            <svg width="72" height="72" viewBox="0 0 100 100" className="w-18 h-18 opacity-80">
                              <g transform="translate(15, 10)">
                                {/* Handle */}
                                <rect x="25" y="2" width="20" height="12" rx="2" fill="none" stroke="#1e293b" strokeWidth="3" />
                                {/* Main body */}
                                <rect x="12" y="14" width="46" height="58" rx="6" fill="#f59e0b" stroke="#1e293b" strokeWidth="3" />
                                {/* Front pocket */}
                                <rect x="18" y="22" width="34" height="42" rx="4" fill="#fbbf24" stroke="#1e293b" strokeWidth="2" />
                                {/* Wheels */}
                                <circle cx="22" cy="75" r="4" fill="#1e293b" />
                                <circle cx="48" cy="75" r="4" fill="#1e293b" />
                              </g>
                            </svg>
                            {/* Prohibited diagonal cross-bar overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <svg width="80" height="80" viewBox="0 0 100 100" className="w-full h-full text-rose-500 stroke-rose-500">
                                <line x1="15" y1="15" x2="85" y2="85" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                              </svg>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-rose-600">
                            {language === 'KR' ? '20인치 초과 캐리어' : 'Over 20" Luggage'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* Not Allowed Section */}
                        <div className="p-3.5 bg-rose-50/30 rounded-xl border border-rose-100/50 space-y-2">
                          <div className="flex items-center gap-1.5 text-rose-700 text-xs font-black">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                            <span>{language === 'KR' ? '반입 불가 (Prohibited)' : 'Prohibited Items'}</span>
                          </div>
                          <ul className="text-xs text-slate-600 font-bold space-y-1.5 list-disc pl-4 leading-relaxed">
                            <li>
                              {language === 'KR' 
                                ? '1인당 2개 이상의 캐리어를 들고 탑승하려는 경우' 
                                : 'Carrying 2 or more suitcases per person'}
                            </li>
                            <li>
                              {language === 'KR' 
                                ? '항공기내 반입용 20인치 여행가방 규격(50×40×20cm)을 초과하는 물품' 
                                : 'Items exceeding the standard 20-inch flight carry-on suitcase size'}
                            </li>
                            <li>
                              {language === 'KR' 
                                ? '차량의 통로 및 승·하차문을 막을 염려가 있는 물품' 
                                : 'Items likely to block aisles or entry/exit doors'}
                            </li>
                          </ul>
                        </div>

                        {/* Allowed Section */}
                        <div className="p-3.5 bg-emerald-50/30 rounded-xl border border-emerald-100/50 space-y-2">
                          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-black">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                            <span>{language === 'KR' ? '반입 가능 (Allowed)' : 'Allowed Items'}</span>
                          </div>
                          <ul className="text-xs text-slate-600 font-bold space-y-1.5 list-disc pl-4 leading-relaxed">
                            <li>
                              {language === 'KR' 
                                ? '중량 20kg 미만, 부피 50 × 40 × 20cm 미만의 허용 규격 내 물품' 
                                : 'Weight under 20kg, dimensions under 50 × 40 × 20cm'}
                            </li>
                            <li>
                              {language === 'KR' 
                                ? '항공기내 반입용 20인치 여행가방 규격 이내의 물품' 
                                : 'Items within standard 20-inch flight carry-on suitcase specifications'}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: Food & Drinks Regulations (음식물 반입 규정) */}
                    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/70 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🥤</span>
                        <div>
                          <h4 className="text-sm sm:text-base font-black text-slate-800">
                            {language === 'KR' ? '음식물 반입 규정' : 'Restrictions on Food and Drinks'}
                          </h4>
                          <p className="text-[10px] sm:text-xs text-rose-600 font-extrabold mt-0.5">
                            {language === 'KR' ? '커피 등 음식물을 들고 타지 맙시다.' : 'No Food And Drinks Allowed.'}
                          </p>
                        </div>
                      </div>

                      {/* Interactive Visual Illustration Board */}
                      <div className="grid grid-cols-2 gap-4 py-4 px-3 bg-slate-50 rounded-2xl border border-slate-100">
                        {/* Allowed (Green) */}
                        <div className="flex flex-col items-center justify-between p-3 bg-white rounded-xl border border-emerald-100 shadow-3xs text-center space-y-2">
                          <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                            {language === 'KR' ? '반입 가능' : 'ALLOWED'}
                          </span>
                          <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 border-emerald-500 bg-emerald-50/20 shadow-inner">
                            <svg width="72" height="72" viewBox="0 0 100 100" className="w-18 h-18">
                              <g transform="translate(25, 8)">
                                {/* Cap */}
                                <rect x="18" y="5" width="14" height="8" rx="1.5" fill="#3b82f6" stroke="#1e293b" strokeWidth="3" />
                                {/* Neck */}
                                <rect x="21" y="13" width="8" height="6" fill="#e2e8f0" stroke="#1e293b" strokeWidth="3" />
                                {/* Main plastic bottle body with ridges */}
                                <path d="M12 19 C12 19, 10 24, 10 28 L10 70 C10 73, 13 75, 16 75 L34 75 C37 75, 40 73, 40 70 L40 28 C40 24, 38 19, 38 19 Z" fill="#93c5fd" stroke="#1e293b" strokeWidth="3" />
                                {/* Horizontal ridges */}
                                <line x1="14" y1="32" x2="36" y2="32" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                                <line x1="14" y1="44" x2="36" y2="44" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                                <line x1="14" y1="56" x2="36" y2="56" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                              </g>
                            </svg>
                          </div>
                          <span className="text-[10px] font-black text-slate-700">
                            {language === 'KR' ? '뚜껑이 닫힌 생수/음료' : 'Sealed Water Bottles'}
                          </span>
                        </div>

                        {/* Prohibited (Red) */}
                        <div className="flex flex-col items-center justify-between p-3 bg-white rounded-xl border border-rose-100 shadow-3xs text-center space-y-2">
                          <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                            {language === 'KR' ? '반입 불가' : 'PROHIBITED'}
                          </span>
                          <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 border-rose-500 bg-rose-50/20 shadow-inner overflow-hidden">
                            <svg width="72" height="72" viewBox="0 0 100 100" className="w-18 h-18 opacity-80">
                              <g transform="translate(20, 8)">
                                {/* Straw */}
                                <path d="M42 5 L42 22 L32 22" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                {/* Lid */}
                                <ellipse cx="30" cy="24" rx="20" ry="6" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
                                <rect x="20" y="24" width="20" height="3" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
                                {/* Cup body */}
                                <path d="M13 28 L18 72 C18 74, 20 76, 22 76 L38 76 C40 76, 42 74, 43 72 L47 28 Z" fill="#fcd34d" stroke="#1e293b" strokeWidth="3" />
                                {/* Coffee sleeve */}
                                <path d="M15 40 L17 56 L43 56 L45 40 Z" fill="#b45309" stroke="#1e293b" strokeWidth="2" />
                                {/* Coffee icon emblem on sleeve */}
                                <circle cx="30" cy="48" r="4" fill="#78350f" />
                              </g>
                            </svg>
                            {/* Prohibited diagonal cross-bar overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <svg width="80" height="80" viewBox="0 0 100 100" className="w-full h-full text-rose-500 stroke-rose-500">
                                <line x1="15" y1="15" x2="85" y2="85" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                              </svg>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-rose-600">
                            {language === 'KR' ? '일회용 테이크아웃 컵' : 'Disposable Cups & Drinks'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* Not Allowed Section */}
                        <div className="p-3.5 bg-rose-50/30 rounded-xl border border-rose-100/50 space-y-2">
                          <div className="flex items-center gap-1.5 text-rose-700 text-xs font-black">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                            <span>{language === 'KR' ? '반입 불가 (Prohibited)' : 'Prohibited Food/Drinks'}</span>
                          </div>
                          <ul className="text-xs text-slate-600 font-bold space-y-1.5 list-disc pl-4 leading-relaxed">
                            <li>
                              {language === 'KR' 
                                ? '가벼운 충격에도 쏟아질 우려가 있는 일회용 용기(일명 \'테이크아웃 컵\') 등에 담긴 음식물 및 음료' 
                                : 'Food and drinks in disposable containers/cups (e.g., takeout cups) prone to spilling upon light impact'}
                            </li>
                          </ul>
                        </div>

                        {/* Allowed Section */}
                        <div className="p-3.5 bg-emerald-50/30 rounded-xl border border-emerald-100/50 space-y-2">
                          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-black">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                            <span>{language === 'KR' ? '반입 가능 (Allowed)' : 'Allowed Food/Drinks'}</span>
                          </div>
                          <ul className="text-xs text-slate-600 font-bold space-y-1.5 list-disc pl-4 leading-relaxed">
                            <li>
                              {language === 'KR' 
                                ? '차내에서 취식할 목적이 아닌 단순히 운반하기 위해 소지하고 타는 완전히 포장된 음식물 또는 식재료 등' 
                                : 'Fully packaged food or raw ingredients carried simply for transport purposes and not for in-transit consumption'}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {transitSection === 'CHILD_FREE' && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* BRAND HEADER TITLE */}
              <div className="text-center py-4 sm:py-6 max-w-2xl mx-auto space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-heading">
                  {language === 'KR' ? '어린이 대중교통 무료 요금 안내' : 'Children Public Transit Free Fare Guide'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-bold">
                  {language === 'KR' 
                    ? '부산 대중교통 어린이 무료 정책의 대상 설정과 올바른 충전카드 등록 요령입니다' 
                    : 'Target group definition and child transit card registration methods'}
                </p>
              </div>

              {/* CARD GRID (Style 1: Minimalist outline illustrations matching first image) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {/* SUB-CARD 01: Eligibility */}
                <div className="relative bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between text-center min-h-[340px]">
                  <div className="absolute top-4 left-4 w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black tracking-tight">
                    01
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight">
                      {language === 'KR' ? '지원 대상 연령' : 'Target Age Group'}
                    </h3>
                  </div>

                  <div className="my-4 flex justify-center items-center">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <svg className="w-16 h-16 text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="50" cy="45" r="22" />
                        <path d="M28 45c0-10 10-18 22-18s22 8 22 18" />
                        <path d="M50 27v-5M44 22h12" />
                        <circle cx="42" cy="42" r="2" fill="currentColor" />
                        <circle cx="58" cy="42" r="2" fill="currentColor" />
                        <path d="M44 51c2 4 10 4 12 0" />
                        <circle cx="36" cy="48" r="1.5" fill="currentColor" opacity="0.5" />
                        <circle cx="64" cy="48" r="1.5" fill="currentColor" opacity="0.5" />
                        <path d="M25 80c5-12 12-13 25-13s20 1 25 13" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-500 font-bold leading-relaxed">
                    {language === 'KR' 
                      ? '만 6세 ~ 12세 어린이 전원 대상 (타 지역 거주어린이 및 해외 관광객 포함)' 
                      : 'All kids aged 6 to 12 (includes foreign visitors and domestic travellers).'}
                  </p>
                </div>

                {/* SUB-CARD 02: Benefit */}
                <div className="relative bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between text-center min-h-[340px]">
                  <div className="absolute top-4 left-4 w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black tracking-tight">
                    02
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight">
                      {language === 'KR' ? '부과 요금 및 혜택' : 'Transit Fare / Fares'}
                    </h3>
                  </div>

                  <div className="my-4 flex justify-center items-center">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <svg className="w-16 h-16 text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="50" cy="42" r="22" />
                        <circle cx="50" cy="42" r="18" strokeDasharray="3 3" />
                        <path d="M42 61v18l8-6 8 6V61" />
                        <path d="M50 32l3.5 7h7.5l-6 5.5 2 7.5-7-5.5-7 5.5 2-7.5-6-5.5h7.5z" fill="currentColor" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-emerald-600 font-black text-xs block">{language === 'KR' ? '교통카드 접촉 시 0원' : '₩0 with card tap'}</span>
                    <p className="text-xs sm:text-[13px] text-slate-500 font-bold leading-relaxed">
                      {language === 'KR' 
                        ? '※ 단, 현금으로 탑승 결제할 경우 일반 어린이 요금이 그대로 부과됩니다.' 
                        : 'Regular cash fares apply if boarding without tapping a card.'}
                    </p>
                  </div>
                </div>

                {/* SUB-CARD 03: Register */}
                <div className="relative bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between text-center min-h-[340px]">
                  <div className="absolute top-4 left-4 w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black tracking-tight">
                    03
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight">
                      {language === 'KR' ? '교통카드 등록요령' : 'How to Enroll'}
                    </h3>
                  </div>

                  <div className="my-4 flex justify-center items-center">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <svg className="w-16 h-16 text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="34" y="20" width="32" height="60" rx="6" />
                        <rect x="38" y="26" width="24" height="42" rx="2" />
                        <circle cx="50" cy="74" r="2.5" />
                        <circle cx="50" cy="44" r="10" strokeDasharray="2 2" />
                        <path d="M45 44l3 3 7-7" strokeWidth="2" stroke="#10b981" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-500 font-bold leading-relaxed">
                    {language === 'KR' 
                      ? '일반 교통카드 구매 후 편의점 계산대에서 직접 생년월일을 등록하거나 앱을 통해 활성화' 
                      : 'Purchase a card at convenience stores and request date-of-birth registration.'}
                  </p>
                </div>

                {/* SUB-CARD 04: Exclusions */}
                <div className="relative bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between text-center min-h-[340px]">
                  <div className="absolute top-4 left-4 w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black tracking-tight">
                    04
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight">
                      {language === 'KR' ? '이용범위 및 예외' : 'Exclusions'}
                    </h3>
                  </div>

                  <div className="my-4 flex justify-center items-center">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <svg className="w-16 h-16 text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M50 18L18 74h64L50 18z" />
                        <path d="M50 38v18" strokeWidth="2.5" />
                        <circle cx="50" cy="64" r="2.5" fill="currentColor" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-500 font-bold leading-relaxed">
                    {language === 'KR' 
                      ? '시내버스, 마을버스, 지하철 1~4호선 해당. (광역급행 2000번 버스 및 코레일 동해선은 무료 대상에서 제외)' 
                      : 'Applies to buses and subways. Excludes Express No. 2000 & Donghae Line.'}
                  </p>
                </div>
              </div>

              {/* DETAIL PAMPHLET CALLOUT (Style 2: High-visibility layout from image 2) */}
              <div className="space-y-6 pt-6 border-t border-slate-150">
                {/* Voice guide terminal box */}
                <div className="bg-gradient-to-br from-[#004481]/5 via-white to-blue-50/10 p-6 rounded-3xl border border-blue-100 shadow-3xs flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-3xl shrink-0 shadow-3xs">
                    🔊
                  </div>
                  <div className="space-y-1.5 text-left">
                    <span className="text-[10px] bg-blue-600 text-white px-2 rounded-full font-black uppercase tracking-wider block w-max">
                      Voice Announcement Alert
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-slate-800">
                      {language === 'KR' ? '📢 교통카드 접촉 단말기 안내 음성 주의' : '📢 Voice Announcement at Terminal Reader'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                      {language === 'KR' 
                        ? '등록된 어린이 카드를 접촉하면 "어린이입니다"라는 음성 안내가 단말기에서 송출됩니다. 타인의 교통카드를 무단 사용할 경우 관련 규정에 따라 기본요금 30배 가량의 무거운 부가금(벌금)이 징수될 수 있으니 주의 바랍니다.' 
                        : 'Tapping a child card triggers "어린이입니다" (It\'s a child). Severe fines apply to unauthorized users of child/youth transit cards.'}
                    </p>
                  </div>
                </div>

                {/* Infographic with sleek frame border */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <p className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#8EA85E] rounded-full inline-block"></span>
                    <span>{language === 'KR' ? '어린이 대중교통 무료화 등록 방법 안내서' : 'Official Enrollment Guide Infographic'}</span>
                  </p>
                  
                  <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 flex flex-col items-center p-3 shadow-3xs">
                    <img 
                      src={CHILD_TRANSPORT_INFOGRAPHIC_BASE64} 
                      alt={language === 'KR' ? '부산 대중교통 어린이 무료 정책 안내문 (How to Enroll)' : 'How to Enroll in the Free Fare Program Infographic'} 
                      className="w-full h-auto object-contain rounded-xl max-h-[800px]"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <a 
                      href="https://www.busan.go.kr/depart/childtransport" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-black transition-colors hover:underline"
                    >
                      <span>{language === 'KR' ? '출처: 부산광역시 대표포털' : 'Source: Busan Metropolitan City Portal'}</span>
                      <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                    </a>
                  </div>
                </div>

                {/* Bottom Back Button */}
                <div className="pt-4 pb-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      navigateToSubPage('transit');
                      try {
                        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                      } catch {
                        window.scrollTo(0, 0);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#004481] hover:bg-[#003366] text-white font-black text-xs sm:text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>
                      {language === 'KR' ? '대중교통 이용 팁으로 돌아가기' : 'Back to Public Transit Tips'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {transitSection === 'BUS_QR' && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* BRAND HEADER TITLE */}
              <div className="text-center py-4 sm:py-6 max-w-2xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-[#004481] text-xs font-black tracking-wide mb-1">
                  <span>📱</span>
                  <span>{language === 'KR' ? 'Zero Pay 글로벌 연동 서비스' : 'Powered by Zero Pay Global Network'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-heading">
                  {language === 'KR' ? '부산 시내버스 모바일 QR 간편결제 가이드' : 'Busan City Bus QR Code Payment Guide'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-bold">
                  {language === 'KR' 
                    ? 'No cash, no card, no problem: 현금도 실물 카드도 없이 스마트폰 앱 QR로 간편 탑승' 
                    : 'No cash, no card, no problem: Busan buses now accept mobile QR payment.'}
                </p>
              </div>

              {/* Main Content Card */}
              <div className="bg-white rounded-3xl border-2 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                {/* Header Banner */}
                <div className="p-5 sm:p-8 bg-sky-500/10 border-b-2 border-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#004481] text-white flex items-center justify-center text-2xl sm:text-3xl shadow-md shrink-0">
                      📱
                    </div>
                    <div>
                      <h2 className="text-base sm:text-xl font-black text-slate-900">
                        {language === 'KR' 
                          ? '부산 시내버스 전 노선 모바일 QR 결제 서비스 도입' 
                          : 'No cash, no card, no problem: Busan buses accept QR payment'}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 font-bold mt-0.5">
                        {language === 'KR'
                          ? '외국인 관광객 및 국내 여행객을 위한 제로페이(Zero Pay) QR코드 결제'
                          : 'Zero Pay mobile QR payment for international & domestic travelers'}
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto text-xs font-black px-3.5 py-1.5 rounded-full bg-[#004481] text-white tracking-wide shrink-0 shadow-xs">
                    {language === 'KR' ? '부산 시내버스 전 노선 적용' : 'All Busan City Buses'}
                  </span>
                </div>

                <div className="p-5 sm:p-8 space-y-7">
                  {/* Announcement Context Overview */}
                  <div className="p-4 sm:p-6 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-2.5">
                    <div className="flex items-center gap-2 text-[#004481] font-black text-sm">
                      <span className="text-lg">🌐</span>
                      <span>{language === 'KR' ? '공식 안내문 (Overview)' : 'Official Announcement'}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed space-y-2">
                      {language === 'KR' ? (
                        <>
                          <p>
                            부산 관광 붐에 발맞추어 외국인 방문객 및 여행객들이 보다 편리하게 시내버스를 이용할 수 있도록, 부산 시내버스 전 노선에서 <strong>제로페이(Zero Pay) QR코드</strong>를 스캔해 요금을 결제할 수 있습니다.
                          </p>
                          <p>
                            제로페이의 글로벌 결제망과 연동되어 중국의 <strong>알리페이(Alipay) · 위챗페이(WeChat Pay) · 유니온페이(UnionPay)</strong>, 일본의 <strong>페이페이(PayPay)</strong> 등 전 세계 수십 종의 해외 간편결제 앱과 제로페이를 평소 사용하던 스마트폰 그대로 이용할 수 있습니다.
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            <strong>Getting around Busan just got easier for international visitors.</strong> Travelers can pay bus fares by scanning a Zero Pay QR code with their own mobile payment app.
                          </p>
                          <p>
                            The move comes amid Busan's international tourism boom. Foreign visitors to the city are projected to top 4 million this year, with more than 60% coming from Asian markets including China, Taiwan, Hong Kong, and the Philippines. Demand has grown for a way to use familiar apps on Busan's public transit.
                          </p>
                          <p>
                            The new QR service answers that call, linking into Zero Pay’s global network to support dozens of overseas payment apps — including <strong>Alipay, WeChat Pay, and UnionPay</strong> from China, and <strong>PayPay</strong> from Japan.
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* How It Works (3 Steps) */}
                  <div className="space-y-4">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#004481]"></span>
                      <span>{language === 'KR' ? '이용 방법 3단계 (How it works)' : 'How it works (3 Easy Steps)'}</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Step 1 */}
                      <div className="p-5 bg-slate-50/90 rounded-2xl border-2 border-slate-900/10 flex flex-col justify-between space-y-3.5 hover:border-slate-900/30 transition-colors">
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black px-2.5 py-1 rounded-md bg-[#004481] text-white">STEP 01</span>
                            <span className="text-xl">📷</span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900">
                            {language === 'KR' ? '1. 탑승 후 차내 QR 스캔' : '1. Scan In-Bus QR Code'}
                          </h4>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">
                            {language === 'KR' ? (
                              <>
                                버스 탑승 후, 본인이 사용하는 결제 앱을 실행하고 <strong>차량 내부에 부착된 제로페이 QR코드</strong>를 스캔합니다.
                              </>
                            ) : (
                              <>
                                After boarding, open a supported payment app and scan the QR code posted inside the bus.
                              </>
                            )}
                          </p>
                        </div>
                        <div className="text-[11px] text-sky-800 bg-sky-100/70 px-2.5 py-1.5 rounded-lg font-bold">
                          {language === 'KR' ? '※ 버스 차내 부착된 제로페이 QR 스캔' : '※ Scan the Zero Pay QR code posted inside'}
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="p-5 bg-slate-50/90 rounded-2xl border-2 border-slate-900/10 flex flex-col justify-between space-y-3.5 hover:border-slate-900/30 transition-colors">
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black px-2.5 py-1 rounded-md bg-[#004481] text-white">STEP 02</span>
                            <span className="text-xl">💱</span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900">
                            {language === 'KR' ? '2. 결제 옵션 선택 & 자동 환전' : '2. Select Payment Option'}
                          </h4>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">
                            {language === 'KR' ? (
                              <>
                                결제 옵션을 선택하면 요금이 <strong>탑승객의 본국 현지 통화로 자동 환전</strong> 계산되어 화면에 표시됩니다.
                              </>
                            ) : (
                              <>
                                Select the payment option — the fare converts automatically to the rider's home currency.
                              </>
                            )}
                          </p>
                        </div>
                        <div className="text-[11px] text-emerald-800 bg-emerald-100/70 px-2.5 py-1.5 rounded-lg font-bold">
                          {language === 'KR' ? '※ 탑승객 본국 통화로 자동 계산' : '※ Automatic currency conversion'}
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="p-5 bg-slate-50/90 rounded-2xl border-2 border-slate-900/10 flex flex-col justify-between space-y-3.5 hover:border-slate-900/30 transition-colors">
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black px-2.5 py-1 rounded-md bg-[#004481] text-white">STEP 03</span>
                            <span className="text-xl">✅</span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900">
                            {language === 'KR' ? '3. 기사님께 완료 화면 제시' : '3. Show Screen to Driver'}
                          </h4>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">
                            {language === 'KR' ? (
                              <>
                                스마트폰에 표시된 <strong>결제 완료 확인 화면을 버스 운전기사님께 보여주시면</strong> 탑승이 정상 완료됩니다.
                              </>
                            ) : (
                              <>
                                Show the payment confirmation screen to the driver to complete your boarding.
                              </>
                            )}
                          </p>
                        </div>
                        <div className="text-[11px] text-indigo-800 bg-indigo-100/70 px-2.5 py-1.5 rounded-lg font-bold">
                          {language === 'KR' ? '※ 결제 완료 확인 후 자리로 이동' : '※ Show confirmation before taking a seat'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Fare & Payment Policy */}
                  <div className="p-5 sm:p-6 bg-amber-50/80 border-2 border-amber-300 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-amber-950 text-sm font-black">
                      <span className="text-lg">⚠️</span>
                      <span>{language === 'KR' ? '요금 규정 및 필수 수칙 안내' : 'Fare Policy & Key Rules'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="p-4 bg-white rounded-xl border border-amber-200 space-y-1.5 shadow-xs">
                        <div className="font-black text-slate-900 text-xs sm:text-sm">
                          {language === 'KR' ? '1인당 균일 1,700원' : 'Flat ₩1,700 Per Person'}
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">
                          {language === 'KR' 
                            ? '성인 시내버스 현금 요금과 동일한 1인당 1,700원 균일 요금 (어린이 및 청소년도 동일 요금 적용)' 
                            : 'The QR fare is a flat 1,700 won per person, matching the standard adult cash fare — the same rate applies to children and teens.'}
                        </p>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-amber-200 space-y-1.5 shadow-xs">
                        <div className="font-black text-slate-900 text-xs sm:text-sm">
                          {language === 'KR' ? '개별 결제 원칙' : 'Individual Payments'}
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">
                          {language === 'KR' 
                            ? '단체 여행객의 경우 한 번에 결제할 수 없으며, 각자 본인의 스마트폰 앱으로 1인씩 개별 결제해야 합니다.' 
                            : 'Group travelers should each pay separately using their own mobile device and payment app.'}
                        </p>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-amber-200 space-y-1.5 shadow-xs">
                        <div className="font-black text-slate-900 text-xs sm:text-sm">
                          {language === 'KR' ? '환승 할인 미적용' : 'No Transfer Discounts'}
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">
                          {language === 'KR' 
                            ? '교통카드가 아닌 현금을 대체하는 간편결제 서비스이므로 버스·지하철 간 환승 할인은 적용되지 않습니다.' 
                            : 'Since the service replaces cash rather than a transit card, transfer discounts do not apply.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Supported Services Badges & Multilingual Guidance Info */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-slate-900 text-xs sm:text-sm shrink-0">
                          {language === 'KR' ? '지원 글로벌 결제 앱:' : 'Supported Global Apps:'}
                        </span>
                        <div className="flex flex-wrap gap-1.5 text-xs font-bold text-slate-800">
                          <span className="px-2 py-0.5 bg-white border border-slate-300 rounded-md">Alipay (알리페이)</span>
                          <span className="px-2 py-0.5 bg-white border border-slate-300 rounded-md">WeChat Pay (위챗페이)</span>
                          <span className="px-2 py-0.5 bg-white border border-slate-300 rounded-md">UnionPay (유니온페이)</span>
                          <span className="px-2 py-0.5 bg-white border border-slate-300 rounded-md">PayPay (페이페이)</span>
                          <span className="px-2 py-0.5 bg-white border border-slate-300 rounded-md">Zero Pay (제로페이)</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {language === 'KR' 
                          ? '모든 시내버스 차내에 다국어 안내문이 부착되어 있으며, 부산역, 부산항, 주요 관광안내소에 홍보물이 비치되어 있습니다.' 
                          : 'QR codes and multilingual instructions are up on every city bus, with guidance posted at stops, information centers, Busan Station, and Busan Port.'}
                      </p>
                    </div>
                    <span className="text-xs font-black px-3 py-1.5 rounded-lg bg-[#004481] text-white self-start sm:self-auto shrink-0 shadow-xs">
                      {language === 'KR' ? '제로페이 글로벌 연동' : 'Zero Pay Global Network'}
                    </span>
                  </div>
                </div>

                {/* Bottom Back Button */}
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      navigateToSubPage('transit');
                      try {
                        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                      } catch {
                        window.scrollTo(0, 0);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#004481] hover:bg-[#003366] text-white font-black text-xs sm:text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>
                      {language === 'KR' ? '대중교통 이용 팁으로 돌아가기' : 'Back to Public Transit Tips'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {transitSection === 'TAXI' && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* BRAND HEADER TITLE */}
              <div className="text-center py-4 sm:py-6 max-w-2xl mx-auto space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-heading">
                  {language === 'KR' ? '부산 택시 이용법 & 호출 앱 가이드' : 'Busan Taxi Usage & Calling App Guide'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-bold">
                  {language === 'KR' 
                    ? '기본 요금 체계부터 카카오T / k.ride / 우버 호출 앱 활용법, 대형 캐리어 적재 및 분실물 예방 영수증 팁까지 상세 안내' 
                    : 'Practical guide covering base fares, Kakao T / k.ride / Uber app usage, luggage loading, and receipt safety tips'}
                </p>
              </div>

              {/* CARD GRID (Style 1: Minimalist outline illustrations matching flat card design) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {/* SUB-CARD 01: Fares & Payments */}
                <div className="relative bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between text-center min-h-[340px]">
                  <div className="absolute top-4 left-4 w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black tracking-tight">
                    01
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight">
                      {language === 'KR' ? '기본 요금 & 결제 수단' : 'Base Fare & Payments'}
                    </h3>
                  </div>

                  <div className="my-4 flex justify-center items-center">
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                      <svg className="w-16 h-16 text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M42 22h16v6H42z" fill="#f59e0b" stroke="#1e293b" strokeWidth="1.5" />
                        <text x="44" y="27" fontSize="5" fontWeight="bold" fill="#1e293b" stroke="none">TAXI</text>
                        <path d="M25 45l8-14h34l8 14" strokeWidth="2" />
                        <rect x="18" y="45" width="64" height="28" rx="6" fill="#fef3c7" stroke="#1e293b" strokeWidth="2" />
                        <rect x="30" y="34" width="40" height="11" rx="2" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
                        <circle cx="26" cy="58" r="4" fill="#fbbf24" stroke="#1e293b" strokeWidth="1.5" />
                        <circle cx="74" cy="58" r="4" fill="#fbbf24" stroke="#1e293b" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-amber-700 font-black text-xs block">{language === 'KR' ? '기본요금 4,800원 (2km)' : 'Base fare ₩4,800 (2km)'}</span>
                    <p className="text-xs sm:text-[13px] text-slate-500 font-bold leading-relaxed">
                      {language === 'KR' 
                        ? '신용/체크카드, 교통카드(티머니 등), 삼성페이, 현금 결제 완비. (심야할증 23~02시 20%, 02~04시 30%)' 
                        : 'Credit cards, T-money, Samsung Pay & cash accepted. Late night surcharge applies.'}
                    </p>
                  </div>
                </div>

                {/* SUB-CARD 02: Calling Apps */}
                <div className="relative bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between text-center min-h-[340px]">
                  <div className="absolute top-4 left-4 w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black tracking-tight">
                    02
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight">
                      {language === 'KR' ? '택시 호출 스마트 앱' : 'Taxi Calling Apps'}
                    </h3>
                  </div>

                  <div className="my-4 flex justify-center items-center">
                    <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
                      <svg className="w-16 h-16 text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="30" y="20" width="40" height="64" rx="8" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
                        <rect x="34" y="26" width="32" height="42" rx="3" fill="#e0f2fe" stroke="#1e293b" strokeWidth="1" />
                        <path d="M50 34c-4 0-7 3-7 7 0 5 7 12 7 12s7-7 7-12c0-4-3-7-7-7z" fill="#0284c7" stroke="#1e293b" strokeWidth="1" />
                        <circle cx="50" cy="41" r="2" fill="#ffffff" />
                        <circle cx="50" cy="74" r="3" fill="#1e293b" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-blue-700 font-black text-xs block">{language === 'KR' ? '카카오T / k.ride / 우버 / 동백' : 'Kakao T / k.ride / Uber / Dongbaek'}</span>
                    <p className="text-xs sm:text-[13px] text-slate-500 font-bold leading-relaxed">
                      {language === 'KR' 
                        ? '길거리 손잡기보다 앱 호출 시 위치 지정, 해외 카드 결제 및 예상 요금 확인이 가능해 편리' 
                        : 'Calling via app allows accurate pickup pin, foreign card payments, and fare estimates.'}
                    </p>
                  </div>
                </div>

                {/* SUB-CARD 03: Luggage & Vehicles */}
                <div className="relative bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between text-center min-h-[340px]">
                  <div className="absolute top-4 left-4 w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black tracking-tight">
                    03
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight">
                      {language === 'KR' ? '수하물 적재 & 차종' : 'Luggage & Vehicle Types'}
                    </h3>
                  </div>

                  <div className="my-4 flex justify-center items-center">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <svg className="w-16 h-16 text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="28" y="32" width="44" height="48" rx="6" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2" />
                        <path d="M42 32V20h16v12" stroke="#1e293b" strokeWidth="2" />
                        <line x1="34" y1="44" x2="66" y2="44" stroke="#1e293b" strokeWidth="1.5" />
                        <line x1="34" y1="54" x2="66" y2="54" stroke="#1e293b" strokeWidth="1.5" />
                        <circle cx="36" cy="83" r="3" fill="#1e293b" />
                        <circle cx="64" cy="83" r="3" fill="#1e293b" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-emerald-700 font-black text-xs block">{language === 'KR' ? '대형 캐리어 트렁크 무상 적재' : 'Free Trunk Luggage Space'}</span>
                    <p className="text-xs sm:text-[13px] text-slate-500 font-bold leading-relaxed">
                      {language === 'KR' 
                        ? '28인치 캐리어도 트렁크에 무상 적재 가능하나 차량 구조(LPG 탱크 등)에 따라 공간이 상이할 수 있으므로, 짐이 많을 땐 대형 밴을 추천합니다.' 
                        : 'Suitcases & strollers fit in trunk without extra fees. Consider large vans for large luggage.'}
                    </p>
                  </div>
                </div>

                {/* SUB-CARD 04: Safety & Receipts */}
                <div className="relative bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between text-center min-h-[340px]">
                  <div className="absolute top-4 left-4 w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black tracking-tight">
                    04
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight">
                      {language === 'KR' ? '안전 이용 & 영수증' : 'Safety & Receipt Tips'}
                    </h3>
                  </div>

                  <div className="my-4 flex justify-center items-center">
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                      <svg className="w-16 h-16 text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M30 20h40v60l-6-4-6 4-8-4-8 4-6-4-6 4V20z" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
                        <line x1="38" y1="32" x2="62" y2="32" stroke="#1e293b" strokeWidth="2" />
                        <line x1="38" y1="42" x2="62" y2="42" stroke="#1e293b" strokeWidth="1.5" />
                        <line x1="38" y1="52" x2="54" y2="52" stroke="#1e293b" strokeWidth="1.5" />
                        <circle cx="58" cy="60" r="8" fill="#10b981" />
                        <path d="M55 60l2 2 4-4" stroke="#ffffff" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-800 font-black text-xs block">{language === 'KR' ? '하차 시 영수증 꼭 보관' : 'Always Take Receipt'}</span>
                    <p className="text-xs sm:text-[13px] text-slate-500 font-bold leading-relaxed">
                      {language === 'KR' 
                        ? '분실물(휴대폰, 가방) 발생 시 차량번호와 기사 연락처 확인의 결정적 열쇠. 유료도로 통행료는 정산에 자동 합산' 
                        : 'Receipts contain driver contact & license plate info for lost item recovery.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* DETAILED GUIDES & APP TUTORIALS */}
              <div className="space-y-6 pt-6 border-t border-slate-150">
                {/* 1. Kakao T & k.ride Calling App Tutorial Callouts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Kakao T Domestic */}
                  <div className="bg-gradient-to-br from-amber-500/10 via-white to-amber-50/20 p-6 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-amber-200/50 pb-3 gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">🟡</span>
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900">
                            {language === 'KR' ? '카카오 T (Kakao T)' : 'Kakao T App'}
                          </h3>
                          <p className="text-xs text-slate-500 font-bold">
                            {language === 'KR' ? '국내 1위 이동 플랫폼' : 'Korea\'s No.1 Mobility App'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-amber-400 text-slate-900 font-black px-2.5 py-1 rounded-full uppercase border border-amber-500/30">
                        {language === 'KR' ? '국내 대표' : 'Domestic'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="bg-white p-3.5 rounded-2xl border border-amber-200/60 space-y-1">
                        <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md inline-block">STEP 01</span>
                        <h4 className="text-xs font-black text-slate-900">{language === 'KR' ? '앱 실행 후 [택시] 선택' : 'Select [Taxi]'}</h4>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                          {language === 'KR' ? '홈 화면에서 황색 [택시] 아이콘을 터치합니다.' : 'Tap yellow [Taxi] icon on home screen.'}
                        </p>
                      </div>

                      <div className="bg-white p-3.5 rounded-2xl border border-amber-200/60 space-y-1">
                        <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md inline-block">STEP 02</span>
                        <h4 className="text-xs font-black text-slate-900">{language === 'KR' ? '출발지/목적지 검색' : 'Set Route'}</h4>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                          {language === 'KR' ? 'GPS 위치 확인 및 도착할 건물/명소를 검색합니다.' : 'GPS sets pickup pin, search destination name.'}
                        </p>
                      </div>

                      <div className="bg-white p-3.5 rounded-2xl border border-amber-200/60 space-y-1">
                        <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md inline-block">STEP 03</span>
                        <h4 className="text-xs font-black text-slate-900">{language === 'KR' ? '차종 및 예상요금 확인' : 'Check Fare'}</h4>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                          {language === 'KR' ? '일반/벤티/블랙 중 선택하여 예상 금액을 확인합니다.' : 'Choose Regular or Venti van & review fare.'}
                        </p>
                      </div>

                      <div className="bg-white p-3.5 rounded-2xl border border-amber-200/60 space-y-1">
                        <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md inline-block">STEP 04</span>
                        <h4 className="text-xs font-black text-slate-900">{language === 'KR' ? '호출 및 실시간 경로 추적' : 'Call & Track'}</h4>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                          {language === 'KR' ? '배차 후 차량 번호와 실시간 위치를 확인하고 탑승합니다.' : 'Track taxi arrival & license plate number.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* k.ride Foreigner Global App */}
                  <div className="bg-gradient-to-br from-purple-500/10 via-white to-purple-50/30 p-6 rounded-3xl border border-purple-200 shadow-xs space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-purple-200/60 pb-3 gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">🌐</span>
                          <div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900">
                              {language === 'KR' ? 'k.ride (외국인 전용 카카오T 전용 앱)' : 'k.ride (Kakao T for Foreign Tourists)'}
                            </h3>
                            <p className="text-xs text-slate-500 font-bold">
                              {language === 'KR' ? '카카오모빌리티 출시 글로벌 택시 호출 플랫폼' : 'Official Global Taxi App by Kakao Mobility'}
                            </p>
                          </div>
                        </div>
                        <a
                          href="https://www.kakaomobility.com/k-ride"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-purple-600 hover:bg-purple-700 text-white font-black px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1 shrink-0"
                        >
                          <span>{language === 'KR' ? 'k.ride 공식 사이트' : 'k.ride Official'}</span>
                          <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                        </a>
                      </div>

                      <div className="mt-3.5 space-y-2.5 text-xs text-slate-700 font-medium leading-relaxed">
                        <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-purple-100">
                          <span className="text-purple-600 font-bold shrink-0">✔</span>
                          <span>
                            <strong className="text-slate-900 font-bold">{language === 'KR' ? '해외 신용카드 자동 결제:' : 'Foreign Cards Supported:'}</strong> {language === 'KR' ? 'Visa, Mastercard, AMEX, JCB 등 해외 신용카드가 앱에 간편 등록되어 자동 정산' : 'Registers foreign cards directly for seamless auto-payment.'}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-purple-100">
                          <span className="text-purple-600 font-bold shrink-0">✔</span>
                          <span>
                            <strong className="text-slate-900 font-bold">{language === 'KR' ? '해외 휴대폰 번호 가입:' : 'Foreign Phone Registration:'}</strong> {language === 'KR' ? '전 세계 100여 개국 전화번호로 한국 본인인증 없이 손쉽게 계정 생성' : 'Sign up easily with foreign mobile numbers from 100+ countries.'}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-purple-100">
                          <span className="text-purple-600 font-bold shrink-0">✔</span>
                          <span>
                            <strong className="text-slate-900 font-bold">{language === 'KR' ? '10개국 언어 지원 & 실시간 번역:' : '10 Languages & Auto-Translation:'}</strong> {language === 'KR' ? '영어, 중국어, 일본어 등 10개 언어 앱 UI 및 기사와 한글 실시간 자동번역 메신저' : 'Supports English, Chinese, Japanese, etc., with real-time chat translation.'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <a
                        href="https://www.kakaomobility.com/k-ride"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-purple-900 hover:bg-slate-900 text-white font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <span>{language === 'KR' ? 'k.ride 서비스 자세히 보기 (kakaomobility.com/k-ride)' : 'Learn more about k.ride (kakaomobility.com/k-ride)'}</span>
                        <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* 2. Foreigner & Local App Feature Comparison Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Uber Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-300 shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">⚫</span>
                        <h4 className="text-sm sm:text-base font-black text-slate-900">
                          {language === 'KR' ? '우버 (Uber) - 글로벌 관광객 추천' : 'Uber — Recommended for Global Tourists'}
                        </h4>
                      </div>
                      <span className="text-[10px] bg-slate-900 text-white font-black px-2 py-0.5 rounded uppercase">Global Uber</span>
                    </div>
                    <ul className="text-xs text-slate-600 font-medium space-y-2.5 leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="text-slate-900 font-bold shrink-0">✔</span>
                        <span>
                          <strong className="text-slate-800 font-bold">{language === 'KR' ? '글로벌 우버 계정 그대로 이용:' : 'Global Uber Account:'}</strong> {language === 'KR' ? '해외에서 쓰던 우버(Uber) 앱과 결제 정보를 한국 부산에서도 변경 없이 바로 사용' : 'Use your existing global Uber app and registered cards in Busan directly.'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-slate-900 font-bold shrink-0">✔</span>
                        <span>
                          <strong className="text-slate-800 font-bold">{language === 'KR' ? '해외 신용카드 자동 결제:' : 'Foreign Credit Cards:'}</strong> {language === 'KR' ? 'Visa, Mastercard, AMEX 등 앱에 연결된 카드로 승차 후 자동 정산' : 'Automatic billing via your Uber account connected credit cards.'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-slate-900 font-bold shrink-0">✔</span>
                        <span>
                          <strong className="text-slate-800 font-bold">{language === 'KR' ? '인앱 메시지 자동 번역:' : 'Auto Translation:'}</strong> {language === 'KR' ? '기사님과의 인앱 채팅 대화가 한국어와 사용자의 언어로 자동 번역됨' : 'In-app messaging translates automatically between Korean and English.'}
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Dongbaek Taxi Card */}
                  <div className="bg-white p-6 rounded-3xl border border-emerald-200/80 shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between border-b border-emerald-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔵</span>
                        <h4 className="text-sm sm:text-base font-black text-slate-900">
                          {language === 'KR' ? '동백전 택시 - 부산 시민 & 장기 여행자 혜택' : 'Dongbaek Taxi — Local Currency Discounts'}
                        </h4>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded uppercase">Cashback</span>
                    </div>
                    <ul className="text-xs text-slate-600 font-medium space-y-2.5 leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold shrink-0">✔</span>
                        <span>
                          <strong className="text-slate-800 font-bold">{language === 'KR' ? '동백전 결제 캐시백:' : 'Local Cashback:'}</strong> {language === 'KR' ? '부산 지역화폐 동백전 카드로 정산 시 즉시 캐시백 할인 적용' : 'Earn immediate local currency cashback when paying with Dongbaekjeon card.'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold shrink-0">✔</span>
                        <span>
                          <strong className="text-slate-800 font-bold">{language === 'KR' ? '호출 수수료 무료:' : 'Zero Call Fee:'}</strong> {language === 'KR' ? '별도의 호출 수수료 없이 시내 정규 승차 요금만 부과' : 'No extra call dispatch fees; pay strictly standard meter rates.'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold shrink-0">✔</span>
                        <span>
                          <strong className="text-slate-800 font-bold">{language === 'KR' ? '부산 지역 택시 친절 서비스:' : 'Friendly Local Drivers:'}</strong> {language === 'KR' ? '부산 관내 전용 가맹 택시로 빠른 현지 배차 제공' : 'Exclusively connected to local licensed Busan taxi drivers.'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 3. Key Taxi Stands & Emergency Contact Box */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-slate-900">
                    <span className="text-xl">📍</span>
                    <h4 className="text-sm sm:text-base font-black">
                      {language === 'KR' ? '부산 주요 거점 지정 택시 승강장 & 비상 연락처' : 'Major Taxi Stands & Emergency Contacts'}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                      <h5 className="font-black text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#8EA85E]"></span>
                        <span>{language === 'KR' ? '주요 지정 승강장 위치' : 'Key Taxi Stand Locations'}</span>
                      </h5>
                      <ul className="space-y-1.5 text-slate-600 font-medium">
                        <li>• <strong>부산역 (KTX):</strong> 1층 6번 출구 밖 택시 전용 승강장</li>
                        <li>• <strong>김해공항:</strong> 국내선/국제선 1층 게이트 앞 전용 탑승장</li>
                        <li>• <strong>해운대해수욕장:</strong> 이벤트 광장 및 조선호텔 입구 정류장</li>
                        <li>• <strong>서면역:</strong> 7번 출구 / 15번 출구 앞 도로변 승강장</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                      <h5 className="font-black text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <span>{language === 'KR' ? '분실물 & 불친절 신고 긴급 연락처' : 'Lost & Found / Complaints Helpline'}</span>
                      </h5>
                      <ul className="space-y-1.5 text-slate-600 font-medium">
                        <li>• <strong>부산시 120 콜센터:</strong> 051-120 (택시 분실물 및 승차거부 신고)</li>
                        <li>• <strong>외국인 관광 통역 안내:</strong> 1330 (24시간 영/중/일 통역 지원)</li>
                        <li>• <strong>개인택시 조합 분실물센터:</strong> 051-808-8181</li>
                        <li>• <strong>법인택시 조합 분실물센터:</strong> 051-500-8500</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bottom Back Button */}
                <div className="pt-4 pb-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      navigateToSubPage('transit');
                      try {
                        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                      } catch {
                        window.scrollTo(0, 0);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#004481] hover:bg-[#003366] text-white font-black text-xs sm:text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>
                      {language === 'KR' ? '대중교통 이용 팁으로 돌아가기' : 'Back to Public Transit Tips'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: BUSAN MAJOR EVENTS CALENDAR VIEW                                  */}
      {/* ========================================================================= */}
      {activeSection === 'SCHEDULE' && (
        <div className="space-y-1 animate-fade-in">
          <React.Suspense fallback={<div className="h-64 flex items-center justify-center text-slate-400 font-bold text-sm">부산 축제 & 행사 일정을 불러오는 중...</div>}>
            <BusanEventsCalendarView 
              language={language} 
              onSelectStation={onSelectStation}
            />
          </React.Suspense>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 5: LIVE BUSAN TRAVEL TIPS COMMUNITY                                 */}
      {/* ========================================================================= */}
      {activeSection === 'COMMUNITY' && (
        <div className="space-y-6 animate-fade-in text-left font-sans" id="community-section-container">
          {/* Main 2-Tab Switcher: [ 💬 기본 여행 팁 ] vs [ ✨ Stepless 여행안내 ] */}
          <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="community-tab-standard"
                onClick={() => setCommunityTab('STANDARD')}
                className={`py-3 px-3 sm:px-5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border min-h-[44px] ${
                  communityTab === 'STANDARD'
                    ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'KR' ? '💬 기본 여행 팁 & 커뮤니티' : '💬 Standard Community Tips'}</span>
              </button>

              <button
                type="button"
                id="community-tab-stepless-guide"
                onClick={() => setCommunityTab('STEPLESS_GUIDE')}
                className={`py-3 px-3 sm:px-5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border min-h-[44px] ${
                  communityTab === 'STEPLESS_GUIDE'
                    ? 'bg-[#8EA85E] text-white border-[#8EA85E] shadow-2xs ring-2 ring-blue-100'
                    : 'bg-gradient-to-r from-amber-50 to-blue-50 hover:from-amber-100 hover:to-blue-100 text-blue-950 border-amber-200/80 shadow-2xs'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${communityTab === 'STEPLESS_GUIDE' ? 'text-amber-300' : 'text-amber-600'}`} />
                <span className="font-extrabold">{language === 'KR' ? '✨ Stepless 큐레이션 여행안내' : '✨ Stepless Curated Guide'}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: STANDARD COMMUNITY VIEW */}
          {communityTab === 'STANDARD' && (
            <div className="bg-white border border-[#E5E2DC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs animate-fade-in">
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold tracking-widest text-[#0A2540] uppercase">
                  {language === 'KR' ? '실시간 커뮤니티' : 'LIVE TRAVEL COMMUNITY'}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#11161B] tracking-tight">
                  {language === 'KR' ? '실시간 부산 여행 팁 & Q&A' : 'Live Busan Travel Tips & Q&A'}
                </h2>
                <p className="text-sm text-[#4A5568] leading-relaxed max-w-2xl">
                  {language === 'KR'
                    ? '부산 현지 여행자와 주민들이 실시간으로 주고받는 질문과 답변, 이동 꿀팁 및 현장 상황을 확인해 보세요.'
                    : 'Explore real-time questions, local travel advice, and field updates shared by Busan travelers and locals.'}
                </p>
              </div>

              {/* Official Reddit Banner */}
              <div className="border border-[#E5E2DC] rounded-xl p-6 bg-[#FBFBF9] hover:border-[#8EA85E] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#11161B] text-base">
                      {language === 'KR' ? 'r/BusanTravelTips 레딧 커뮤니티' : 'r/BusanTravelTips Reddit Community'}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E5E2DC] text-[#0A2540]">
                      Official
                    </span>
                  </div>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    {language === 'KR'
                      ? '부산 지하철 엘리베이터 상태, 날씨별 추천 경로, 로컬 식도락 정보를 레딧 커뮤니티에서 자유롭게 이야기해 보세요.'
                      : 'Ask questions about station accessibility, weather routes, and local food spots in our Reddit forum.'}
                  </p>
                </div>

                <a
                  href="https://www.reddit.com/r/BusanTravelTips/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-[#11161B] hover:bg-[#8EA85E] text-white font-semibold text-xs transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 shadow-2xs"
                >
                  <span>{language === 'KR' ? '레딧 커뮤니티 방문하기' : 'Visit Reddit Community'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Live Tips Cards / Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#E5E2DC]">
                <div className="p-5 rounded-xl border border-[#E5E2DC] space-y-2 bg-white shadow-3xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#0A2540]">
                      {language === 'KR' ? '현장 이동 팁' : 'Transit Hack'}
                    </span>
                    <span className="text-[10px] text-[#718096]">Updated Today</span>
                  </div>
                  <h3 className="font-bold text-[#11161B] text-sm">
                    {language === 'KR' ? '서면역 환승 시 엘리베이터 직통 출구 활용법' : 'Seomyeon Station Elevator Transfer Direct Exit'}
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    {language === 'KR'
                      ? '1호선과 2호선 환승 구역 중앙 게이트 부근 와이드 개찰구를 이용하시면 유모차 및 대형 캐리어 소지자도 계단 없이 편리하게 이동할 수 있습니다.'
                      : 'Use the wide turnstiles near the central transfer gate for Lines 1 & 2 to move step-free with strollers and large suitcases.'}
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-[#E5E2DC] space-y-2 bg-white shadow-3xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#0A2540]">
                      {language === 'KR' ? '우천 시 팁' : 'Rainy Day Route'}
                    </span>
                    <span className="text-[10px] text-[#718096]">Local Favorite</span>
                  </div>
                  <h3 className="font-bold text-[#11161B] text-sm">
                    {language === 'KR' ? '비 오는 날 실내 무장애 코스' : 'Rainy Day Step-Free Indoor Experience'}
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    {language === 'KR'
                      ? '비가 오는 날은 센텀시티 지하철 직통 연결 몰이나 영도 국립해양박물관의 실내 엘리베이터 동선을 활용하면 쾌적하게 여행할 수 있습니다.'
                      : 'On rainy days, opt for Centum City direct subway mall connections or National Maritime Museum indoor elevators.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STEPLESS EXCLUSIVE CURATED TRAVEL GUIDE */}
          {communityTab === 'STEPLESS_GUIDE' && (
            <React.Suspense fallback={<div className="h-64 flex items-center justify-center text-slate-400 font-bold text-sm">큐레이션 여행안내를 불러오는 중...</div>}>
              <CommunityTravelGuideSection
                language={language}
                onSelectStation={(stationId) => {
                  if (onSelectStation) {
                    onSelectStation(stationId);
                  }
                }}
                onSwitchToStandard={() => setCommunityTab('STANDARD')}
              />
            </React.Suspense>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 6: BUSAN EXPLORATION (부산 탐구생활) - 핫이슈 & 실전 여행 꿀팁       */}
      {/* ========================================================================= */}
      {activeSection === 'EXPLORATION' && (
        <div className="space-y-6 animate-fade-in text-left font-sans" id="exploration-section-container">
          {/* Header Title Section (Unified with Stepless page style - clean line icon, no clunky boxes, no weird emojis) */}
          <div className="space-y-1.5 text-left pt-1">
            <div className="flex items-center gap-2.5">
              <Compass className="w-6 h-6 text-[#8EA85E] shrink-0 stroke-[2.2]" />
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
                {language === 'KR' ? '부산 탐구생활' : 'Busan Exploration'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {language === 'KR' ? '로컬만이 아는 꿀팁부터 요즘 핫한 부산 소식까지!' : 'Local hacks & trending Busan news'}
            </p>
          </div>

          {/* OVERVIEW: 2 Large Side-by-Side Boxes (부산 핫이슈 | 실전 여행 꿀팁) */}
          {!selectedExplorationItem && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch animate-fade-in">
              {/* Box 1: 부산 핫이슈 */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="pb-3 border-b border-slate-100">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      {language === 'KR' ? '부산 핫이슈' : 'Busan Hot Issues'}
                    </h2>
                  </div>

                  <div className="space-y-3 mt-3.5">
                    {/* Item 1: 부캉이 */}
                    <div
                      onClick={() => handleSelectExplorationItem('bootech')}
                      className="group p-4 rounded-xl border border-slate-100 hover:border-[#8EA85E] bg-[#FAF9F6] hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-[#0A2540] transition-colors leading-snug">
                          {language === 'KR' ? "전국적인 핫이슈! 북항 상어 '부캉이' 관찰 가이드" : 'Viral Sensation: North Port Shark "Bukangi" Guide'}
                        </h3>
                        <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-[#8EA85E] transition-colors shrink-0">
                          <span>{language === 'KR' ? '자세히 보기' : 'Details'}</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notice at bottom of Box 1 */}
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium leading-relaxed">
                  {language === 'KR'
                    ? '부산 핫이슈는 계속 업데이트되니 자주 확인해 주세요!'
                    : 'Busan hot issues are constantly updated. Check back often!'}
                </div>
              </div>

              {/* Box 2: 실전 여행 꿀팁 */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="pb-3 border-b border-slate-100">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      {language === 'KR' ? '실전 여행 꿀팁' : 'Practical Travel Tips'}
                    </h2>
                  </div>

                  <div className="space-y-3 mt-3.5">
                    {/* Item 1: 캐리어 보관 */}
                    <div
                      onClick={() => handleSelectExplorationItem('luggage')}
                      className="group p-4 rounded-xl border border-slate-100 hover:border-[#8EA85E] bg-[#FAF9F6] hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-[#0A2540] transition-colors leading-snug">
                          {language === 'KR' ? '부산 무료 짐보관소' : 'Free Luggage Storage in Busan'}
                        </h3>
                        <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-[#8EA85E] transition-colors shrink-0">
                          <span>{language === 'KR' ? '자세히 보기' : 'Details'}</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* Item 2: 유모차 & 휠체어 */}
                    <div
                      onClick={() => handleSelectExplorationItem('rental')}
                      className="group p-4 rounded-xl border border-slate-100 hover:border-[#8EA85E] bg-[#FAF9F6] hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-[#0A2540] transition-colors leading-snug">
                          {language === 'KR' ? '보행 약자 & 가족을 위한 유모차 / 휠체어 무료 대여소' : 'Free Stroller & Wheelchair Rental Locations'}
                        </h3>
                        <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-[#8EA85E] transition-colors shrink-0">
                          <span>{language === 'KR' ? '자세히 보기' : 'Details'}</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* Item 3: 5초 한국어 발음 치트키 */}
                    <div
                      onClick={() => handleSelectExplorationItem('korean-cheat-codes')}
                      className="group p-4 rounded-xl border border-slate-100 hover:border-[#8EA85E] bg-[#FAF9F6] hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-[#0A2540] transition-colors leading-snug">
                          {language === 'KR'
                            ? '5초 만에 끝내는 한국어 발음 치트키'
                            : '5-Second Korean Pronunciation Cheat Codes'}
                        </h3>
                        <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-[#8EA85E] transition-colors shrink-0">
                          <span>{language === 'KR' ? '자세히 보기' : 'Details'}</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DETAIL VIEW: Specific Topic Deep Dive */}
          {selectedExplorationItem && (
            <div className="space-y-5 animate-fade-in">
              {/* Back to Exploration List Top Bar */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleSelectExplorationItem(null)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer border border-slate-200"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === 'KR' ? '탐구생활 목록으로 돌아가기' : 'Back to Exploration List'}</span>
                </button>
              </div>

              {/* 1. 부캉이 DETAIL */}
              {selectedExplorationItem === 'bootech' && (
                <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5 sm:p-8 space-y-6 shadow-2xs">
                  {/* Header Title & Intro */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#8EA85E] shrink-0 stroke-[2.2]" />
                      <h3 className="text-xl sm:text-2xl font-black text-[#11161B] tracking-tight">
                        {language === 'KR'
                          ? "부산 북항 상어 '부캉이' 실전 관찰 가이드"
                          : 'Busan North Port Shark "Bukangi" Spotting Guide'}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                      {language === 'KR'
                        ? "부캉이는 지난 9월 18일 부산 북항 친수공원 인공수로에서 처음 발견된 암컷 상어예요. 한 달째 수로에 머무는 동안 전국적인 관심을 끌며 현재 한국에서 가장 핫한 화제의 주인공이랍니다. 부캉이를 만나러 가실 분들을 위해 보러 가는 방법과 명당 위치, 관찰 요령을 친근하게 정리해 드려요."
                        : 'First spotted on September 18 in the canal at Busan North Port Waterfront Park, this female shark dubbed "Bukangi" has stayed over a month, drawing nationwide attention as one of the hottest topics. Here is a friendly guide on how to get there, the best viewing spots, and tips for watching her.'}
                    </p>
                  </div>

                  {/* 수로 주소 + 네이버지도 / 구글맵 아이콘 */}
                  <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm py-2.5 px-3.5 bg-[#FAF9F6] rounded-xl border border-[#E5E2DC]">
                    <div className="flex items-center gap-1.5 text-slate-700 min-w-0">
                      <MapPin className="w-4 h-4 text-[#8EA85E] shrink-0" />
                      <span className="font-bold text-[#0A2540]">{language === 'KR' ? '부산항 북항 친수공원 인공수로' : 'Busan North Port Waterfront Park Canal'}:</span>
                      <span className="font-medium text-slate-600">{language === 'KR' ? '부산 동구 초량동 1185-1' : '1185-1, Choryang-dong, Dong-gu'}</span>
                    </div>
                    <MapAppIcons
                      naverUrl="https://map.naver.com/v5/search/%EB%B6%81%ED%95%AD%EC%B9%9C%EC%88%98%EA%B3%B5%EC%9B%90"
                      googleUrl="https://www.google.com/maps/search/?api=1&query=Busan+North+Port+Waterfront+Park"
                      title={language === 'KR' ? '부산항 북항 친수공원' : 'Busan North Port Waterfront Park'}
                    />
                  </div>

                  {/* Natural Flowing Content (No separate boxes, continuous reading down) */}
                  <div className="space-y-6 pt-1 text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                    {/* 1. 부캉이 정보 */}
                    <div className="space-y-2 border-b border-slate-100 pb-5">
                      <h4 className="font-extrabold text-base sm:text-lg text-[#0A2540] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#8EA85E] shrink-0" />
                        <span>{language === 'KR' ? '부캉이 정보' : 'About Bukangi'}</span>
                      </h4>
                      <ul className="space-y-2 pl-3.5 border-l-2 border-slate-200">
                        <li>
                          <strong className="text-slate-800">{language === 'KR' ? '종류' : 'Species'}:</strong>{' '}
                          {language === 'KR'
                            ? '3m 길이의 온순한 암컷 흑상어로 확인'
                            : 'Confirmed as a 3-meter female dusky shark'}
                        </li>
                        <li>
                          <strong className="text-slate-800">{language === 'KR' ? '위치 확인' : 'Live Status'}:</strong>{' '}
                          {language === 'KR'
                            ? "시민 제보 기반의 '부캉이 지금 있나' 웹사이트를 통해 실시간 위치 정보를 참고하실 수 있습니다."
                            : 'Check the citizen-powered "Is Bukangi there now?" website for real-time location updates.'}
                        </li>
                        <li className="pt-0.5">
                          <a
                            href="https://bukangi.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8EA85E] hover:bg-[#7D9650] text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                          >
                            <span>{language === 'KR' ? "'부캉이 지금 있나' 실시간 위치 확인" : 'Check "bukangi.com" Live Tracker'}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* 2. 부캉이 보러 가는 방법 */}
                    <div className="space-y-2 border-b border-slate-100 pb-5">
                      <h4 className="font-extrabold text-base sm:text-lg text-[#0A2540] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#8EA85E] shrink-0" />
                        <span>{language === 'KR' ? '부캉이 보러 가는 방법' : 'How to Get There'}</span>
                      </h4>
                      <ul className="space-y-2 pl-3.5 border-l-2 border-slate-200">
                        <li>
                          <strong className="text-slate-800">{language === 'KR' ? '대중교통' : 'Public Transit'}:</strong>{' '}
                          {language === 'KR'
                            ? 'KTX 부산역 하차 후 9번 또는 10번 출구로 나와서 북항 친수공원 방향 안내를 따라 도보로 약 10분 정도 이동'
                            : 'Exit 9 or 10 at KTX Busan Station, then follow pedestrian bridge signs toward North Port Waterfront Park for about a 10-minute walk.'}
                        </li>
                        <li>
                          <strong className="text-slate-800">{language === 'KR' ? '자가용' : 'By Car'}:</strong>{' '}
                            {language === 'KR'
                              ? '부산항 북항 친수공원으로 바로 이동, 인근 부산항 국제여객터미널 주차장이나 주변 유료주차장을 이용'
                              : 'Drive to Busan North Port Waterfront Park and use the nearby Busan Port International Passenger Terminal parking lot or neighboring paid lots.'}
                        </li>
                      </ul>
                    </div>

                    {/* 3. 명당 위치 & 관찰 요령 */}
                    <div className="space-y-2 border-b border-slate-100 pb-5">
                      <h4 className="font-extrabold text-base sm:text-lg text-[#0A2540] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#8EA85E] shrink-0" />
                        <span>{language === 'KR' ? '명당 위치 & 관찰 요령' : 'Best Viewing Spots & Tips'}</span>
                      </h4>
                      <ul className="space-y-2 pl-3.5 border-l-2 border-slate-200">
                        <li>
                          <strong className="text-slate-800">{language === 'KR' ? '명당 위치' : 'Best Spot'}:</strong>{' '}
                          {language === 'KR'
                            ? '제4보도교와 제5보도교 사이 수로 근처에서 기다리는 것이 관찰에 유리하다는 후기'
                            : 'Waiting near the canal between Footbridge 4 and Footbridge 5 offers the best chance of spotting her.'}
                        </li>
                        <li>
                          <strong className="text-slate-800">{language === 'KR' ? '관찰 요령' : 'Viewing Tips'}:</strong>{' '}
                          {language === 'KR'
                            ? '상어가 수로 벽 쪽을 따라 움직이는 경향이 있으므로, 수면 위 지느러미뿐 아니라 물속도 자세히 살피는 것이 좋음'
                            : 'The shark tends to move along the canal walls, so be sure to look into the water as well as keeping an eye out for dorsal fins on the surface.'}
                        </li>
                      </ul>
                    </div>

                    {/* 4. 주의사항 & 마무리 */}
                    <div className="pt-1 text-slate-600 font-medium">
                      <p>
                        {language === 'KR'
                          ? '부캉이는 소중한 야생 해양 생물이니 수로에 돌이나 먹이를 던지지 마시고, 난간 너머로 안전거리를 유지하며 따뜻한 시선으로 관찰해 주세요!'
                          : 'Bukangi is a wild marine animal. Please do not throw stones, food, or trash into the canal, and observe safely from the boardwalk railings!'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. 캐리어 보관 DETAIL */}
              {selectedExplorationItem === 'luggage' && (
                <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5 sm:p-7 space-y-5 shadow-2xs">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Luggage className="w-5 h-5 text-[#8EA85E] shrink-0 stroke-[2.2]" />
                      <h3 className="text-xl sm:text-2xl font-black text-[#11161B] tracking-tight">
                        {language === 'KR' ? '부산에서 무료로 짐 맡길 수 있는 곳이 있다고요?' : 'Free Luggage Storage in Busan?'}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                      {language === 'KR'
                        ? '부산 지하철역마다 유료 보관함이 있지만, 사실 무료로 짐을 맡아주거나 일정 시간 무료 혜택을 주는 고마운 곳들도 있어요! 무료로 운영되는 만큼 자리가 일찍 찰 수 있으니, 방문하시기 전에 미리 전화로 확인해보시는 걸 추천드려요.'
                        : 'Most subway stations in Busan have paid luggage lockers, but there are also a few places where you can store your luggage for free or enjoy free hours! Since these services can fill up quickly, I recommend calling ahead to check availability.'}
                    </p>
                  </div>

                  {/* 4 Free Luggage Storage Spots (2x2 Grid) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Spot 1: 부산트레블라운지 */}
                    <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-[#8EA85E] transition-colors">
                      <div className="space-y-2.5">
                        <div className="border-b border-slate-200/70 pb-2.5 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-extrabold text-base text-[#0A2540]">
                              {language === 'KR' ? '부산트레블라운지' : 'Busan Travel Lounge'}
                            </h4>
                            <span className="text-[11px] font-bold text-[#8EA85E] shrink-0">
                              {language === 'KR' ? '비용: 무료 (당일 보관 전용)' : 'Cost: Free (Same-day only)'}
                            </span>
                          </div>
                          {/* 주소 + 네이버지도 / 구글맵 아이콘 */}
                          <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
                            <div className="flex items-center gap-1 text-slate-600 min-w-0">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-medium text-slate-700">
                                {language === 'KR' ? '부산 동구 대영로243번길 38 (부산역 인근)' : '38, Daeyeong-ro 243beon-gil, Dong-gu'}
                              </span>
                            </div>
                            <MapAppIcons
                              naverUrl="https://naver.me/GWeyUeg3"
                              googleUrl="https://www.google.com/maps/search/?api=1&query=%EB%B6%80%EC%82%B0%ED%8A%B8%EB%9E%98%EB%B8%94%EB%9D%BC%EC%9A%B4%EC%A7%80"
                              title={language === 'KR' ? '부산트레블라운지' : 'Busan Travel Lounge'}
                            />
                          </div>
                        </div>

                        <ul className="text-xs text-[#4A5568] space-y-1.5 leading-relaxed pt-0.5">
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '운영 시간' : 'Hours'}:</strong>{' '}
                            10:00 ~ 16:50 / 17:00
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '크기 제한' : 'Size'}:</strong>{' '}
                            {language === 'KR' ? '제한 없음 (대형 캐리어 가능)' : 'No size limit — large suitcases accepted'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '점심시간' : 'Break Time'}:</strong>{' '}
                            {language === 'KR' ? '12:00 ~ 13:00 (보관 및 픽업 불가)' : '12:00–1:00 PM (no drop-off or pickup)'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '전화' : 'Phone'}:</strong>{' '}
                            <a href="tel:051-441-3121" className="text-slate-800 hover:text-[#0A2540] font-bold underline decoration-slate-300">
                              051-441-3121
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Spot 2: 롯데백화점 부산본점 (서면) */}
                    <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-[#8EA85E] transition-colors">
                      <div className="space-y-2.5">
                        <div className="border-b border-slate-200/70 pb-2.5 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-extrabold text-base text-[#0A2540]">
                              {language === 'KR' ? '롯데백화점 부산본점 물품보관소' : 'Lotte Dept Store Busan Main'}
                            </h4>
                            <span className="text-[11px] font-bold text-[#8EA85E] shrink-0">
                              {language === 'KR' ? '기본 3시간 무료' : 'First 3 hrs Free'}
                            </span>
                          </div>
                          {/* 주소 + 네이버지도 / 구글맵 아이콘 */}
                          <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
                            <div className="flex items-center gap-1 text-slate-600 min-w-0">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-medium text-slate-700">
                                {language === 'KR' ? '부산 부산진구 가야대로 772 (서면역 연결)' : '772, Gaya-daero, Busanjin-gu'}
                              </span>
                            </div>
                            <MapAppIcons
                              naverUrl="https://map.naver.com/v5/search/%EB%A1%AF%EB%8D%B0%EB%B0%B1%ED%99%94%EC%A0%90%20%EB%B6%80%EC%82%B0%EB%B3%B8%EC%A0%90"
                              googleUrl="https://www.google.com/maps/search/?api=1&query=Lotte+Department+Store+Busan+Main"
                              title={language === 'KR' ? '롯데백화점 부산본점' : 'Lotte Dept Store Busan Main'}
                            />
                          </div>
                        </div>

                        <ul className="text-xs text-[#4A5568] space-y-1.5 leading-relaxed pt-0.5">
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '이용 시간' : 'Hours'}:</strong>{' '}
                            {language === 'KR'
                              ? '당일 백화점 폐점 30분 전까지 (월~목 10:30~20:00 / 금~일 10:30~20:30)'
                              : 'Until 30 mins before closing (Mon–Thu 10:30–20:00 / Fri–Sun 10:30–20:30)'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '이용 요금' : 'Fee'}:</strong>{' '}
                            {language === 'KR' ? '기본 3시간 무료 (이후 시간당 1,000원, 당일 보관만 가능)' : 'First 3 hrs free, then 1,000 KRW/hr (same-day only)'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '보관 위치' : 'Location'}:</strong>{' '}
                            {language === 'KR' ? '지하 1층 및 지하 2층 무인물품보관소' : 'B1 & B2 Automated Lockers'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '보관 금지' : 'Prohibited'}:</strong>{' '}
                            {language === 'KR' ? '현금, 귀중품, 냉장·냉동 상품' : 'Cash, valuables, refrigerated/frozen items'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '전화' : 'Phone'}:</strong>{' '}
                            <a href="tel:051-810-2500" className="text-slate-800 hover:text-[#0A2540] font-bold underline decoration-slate-300">
                              051-810-2500
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Spot 3: 해운대 플랫폼 (구 해운대역) */}
                    <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-[#8EA85E] transition-colors">
                      <div className="space-y-2.5">
                        <div className="border-b border-slate-200/70 pb-2.5 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-extrabold text-base text-[#0A2540]">
                              {language === 'KR' ? '해운대 플랫폼 (구 해운대역)' : 'Haeundae Platform (Former Station)'}
                            </h4>
                            <span className="text-[11px] font-bold text-[#8EA85E] shrink-0">
                              {language === 'KR' ? '비용: 무료 (당일 보관 전용)' : 'Cost: Free (Same-day only)'}
                            </span>
                          </div>
                          {/* 주소 + 네이버지도 / 구글맵 아이콘 */}
                          <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
                            <div className="flex items-center gap-1 text-slate-600 min-w-0">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-medium text-slate-700">
                                {language === 'KR' ? '부산 해운대구 해운대로 626 (구 해운대역)' : '626, Haeundae-ro, Haeundae-gu'}
                              </span>
                            </div>
                            <MapAppIcons
                              naverUrl="https://naver.me/Fy2F6rJr"
                              googleUrl="https://www.google.com/maps/search/?api=1&query=%ED%95%B4%EC%9A%B4%EB%8C%80%ED%94%8C%EB%9E%AB%ED%8F%BC+%EA%B5%AC%ED%95%B4%EC%9A%B4%EB%8C%80%EC%97%AD"
                              title={language === 'KR' ? '해운대 플랫폼' : 'Haeundae Platform'}
                            />
                          </div>
                        </div>

                        <ul className="text-xs text-[#4A5568] space-y-1.5 leading-relaxed pt-0.5">
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '운영 시간' : 'Hours'}:</strong>{' '}
                            10:00 ~ 18:00
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '휴무' : 'Closed'}:</strong>{' '}
                            {language === 'KR' ? '매주 월요일' : 'Every Monday'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '이용 안내' : 'Info'}:</strong>{' '}
                            {language === 'KR' ? '관광객 대상 무료 짐 보관 서비스' : 'Free luggage storage available for tourists'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '전화' : 'Phone'}:</strong>{' '}
                            <a href="tel:051-746-9995" className="text-slate-800 hover:text-[#0A2540] font-bold underline decoration-slate-300">
                              051-746-9995
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Spot 4: 광안리 관광안내소 */}
                    <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-[#8EA85E] transition-colors">
                      <div className="space-y-2.5">
                        <div className="border-b border-slate-200/70 pb-2.5 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-extrabold text-base text-[#0A2540]">
                              {language === 'KR' ? '광안리 관광안내소' : 'Gwangalli Tourist Information'}
                            </h4>
                            <span className="text-[11px] font-bold text-[#8EA85E] shrink-0">
                              {language === 'KR' ? '비용: 무료 (당일 보관 전용)' : 'Cost: Free (Same-day only)'}
                            </span>
                          </div>
                          {/* 주소 + 네이버지도 / 구글맵 아이콘 */}
                          <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
                            <div className="flex items-center gap-1 text-slate-600 min-w-0">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-medium text-slate-700">
                                {language === 'KR' ? '부산 수영구 광안해변로 218 (광안리 해변)' : '218, Gwanganhaebyeon-ro, Suyeong-gu'}
                              </span>
                            </div>
                            <MapAppIcons
                              naverUrl="https://naver.me/xzxmTb5m"
                              googleUrl="https://www.google.com/maps/search/?api=1&query=%EA%B4%91%EC%95%88%EB%A6%AC%EA%B4%80%EA%B4%91%EC%95%88%EB%82%B4%EC%86%8C"
                              title={language === 'KR' ? '광안리 관광안내소' : 'Gwangalli Tourist Information'}
                            />
                          </div>
                        </div>

                        <ul className="text-xs text-[#4A5568] space-y-1.5 leading-relaxed pt-0.5">
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '운영 시간' : 'Hours'}:</strong>{' '}
                            {language === 'KR' ? '평시 10:00~18:00 / 성수기(7~8월) 10:00~21:00' : '10:00 AM–6:00 PM / Peak (Jul–Aug): 10:00 AM–9:00 PM'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '휴게시간' : 'Break Times'}:</strong>{' '}
                            13:00 ~ 14:00, 15:00 ~ 15:50
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '추가 편의' : 'Bonus'}:</strong>{' '}
                            {language === 'KR' ? '유모차 및 휠체어 대여 가능 (오전 중 조기 마감 주의)' : 'Strollers & wheelchairs available (often fills early)'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '전화' : 'Phone'}:</strong>{' '}
                            <a href="tel:051-610-4848" className="text-slate-800 hover:text-[#0A2540] font-bold underline decoration-slate-300">
                              051-610-4848
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Friendly Local Outro */}
                  <div className="text-xs sm:text-sm text-slate-600 font-medium pt-1 text-center sm:text-left">
                    {language === 'KR'
                      ? '캐리어 들고 다니시느라 힘 빼지 마시고, 가볍고 편안한 부산 여행 되세요!'
                      : 'Hope this helps if you’re traveling around Busan with a suitcase! Travel hands-free and enjoy Busan!'}
                  </div>
                </div>
              )}

              {/* 5. 유모차 & 휠체어 DETAIL */}
              {selectedExplorationItem === 'rental' && (
                <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5 sm:p-7 space-y-5 shadow-2xs">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#8EA85E] shrink-0 stroke-[2.2]" />
                      <h3 className="text-xl sm:text-2xl font-black text-[#11161B] tracking-tight">
                        {language === 'KR' ? '보행 약자 & 가족을 위한 유모차 / 휠체어 무료 대여소' : 'Free Stroller & Wheelchair Rental Locations'}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                      {language === 'KR'
                        ? '유모차나 휠체어 없이 부산에 오셨더라도 걱정하지 마세요! 광안리 해변 관광안내소, 태종대유원지, 시내 주요 백화점에서 신분증 확인 후 무료로 대여해 드리고 있어요. 대여 수량이 한정되어 있으니 방문 전 전화로 잔여 수량을 확인해 보시는 것을 추천드려요.'
                        : 'Traveling without a stroller or wheelchair? Popular scenic spots like Gwangalli Beach, Taejongdae, and major department stores offer complimentary rentals with a valid ID! Since quantities are limited, calling ahead is recommended.'}
                    </p>
                  </div>

                  {/* 4 Stroller & Wheelchair Rental Spots (2x2 Grid) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Spot 1: 태종대유원지 */}
                    <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-[#8EA85E] transition-colors">
                      <div className="space-y-2.5">
                        <div className="border-b border-slate-200/70 pb-2.5 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-extrabold text-base text-[#0A2540]">
                              {language === 'KR' ? '태종대유원지' : 'Taejongdae Resort Park'}
                            </h4>
                            <span className="text-[11px] font-bold text-[#8EA85E] shrink-0">
                              {language === 'KR' ? '비용: 무료 (신분증 필수)' : 'Cost: Free (ID Required)'}
                            </span>
                          </div>
                          {/* 주소 + 네이버지도 / 구글맵 아이콘 */}
                          <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
                            <div className="flex items-center gap-1 text-slate-600 min-w-0">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-medium text-slate-700">
                                {language === 'KR' ? '부산 영도구 전망로 24 (태종대 입구 관광안내소)' : '24, Jeonmang-ro, Yeongdo-gu (Taejongdae Entrance)'}
                              </span>
                            </div>
                            <MapAppIcons
                              naverUrl="https://map.naver.com/v5/search/%ED%83%9C%EC%A2%85%EB%8C%80%EC%9C%A0%EC%9B%90%EC%A7%80"
                              googleUrl="https://www.google.com/maps/search/?api=1&query=Taejongdae+Resort+Park+Busan"
                              title={language === 'KR' ? '태종대유원지' : 'Taejongdae Resort Park'}
                            />
                          </div>
                        </div>

                        <ul className="text-xs text-[#4A5568] space-y-1.5 leading-relaxed pt-0.5">
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '대여 시간' : 'Hours'}:</strong>{' '}
                            10:00 ~ 17:00
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '대여 품목' : 'Items'}:</strong>{' '}
                            {language === 'KR' ? '유모차, 휠체어 무료 대여' : 'Strollers & wheelchairs (complimentary)'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '대여 조건' : 'Requirement'}:</strong>{' '}
                            {language === 'KR' ? '신분증 제시 후 간단한 인적사항 기재 후 대여' : 'Present valid ID and fill out simple form'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '전화' : 'Phone'}:</strong>{' '}
                            <a href="tel:051-403-4685" className="text-slate-800 hover:text-[#0A2540] font-bold underline decoration-slate-300">
                              051-403-4685
                            </a>
                            <span className="mx-1 text-slate-400">,</span>
                            <a href="tel:051-860-7866" className="text-slate-800 hover:text-[#0A2540] font-bold underline decoration-slate-300">
                              051-860-7866
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Spot 2: 광안리 관광안내소 */}
                    <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-[#8EA85E] transition-colors">
                      <div className="space-y-2.5">
                        <div className="border-b border-slate-200/70 pb-2.5 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-extrabold text-base text-[#0A2540]">
                              {language === 'KR' ? '광안리 관광안내소' : 'Gwangalli Tourist Information'}
                            </h4>
                            <span className="text-[11px] font-bold text-[#8EA85E] shrink-0">
                              {language === 'KR' ? '비용: 무료 (신분증 필수)' : 'Cost: Free (ID Required)'}
                            </span>
                          </div>
                          {/* 주소 + 네이버지도 / 구글맵 아이콘 */}
                          <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
                            <div className="flex items-center gap-1 text-slate-600 min-w-0">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-medium text-slate-700">
                                {language === 'KR' ? '부산 수영구 광안해변로 218 (광안리 해변)' : '218, Gwanganhaebyeon-ro, Suyeong-gu'}
                              </span>
                            </div>
                            <MapAppIcons
                              naverUrl="https://naver.me/xzxmTb5m"
                              googleUrl="https://www.google.com/maps/search/?api=1&query=%EA%B4%91%EC%95%88%EB%A6%AC%EA%B4%80%EA%B4%91%EC%95%88%EB%82%B4%EC%86%8C"
                              title={language === 'KR' ? '광안리 관광안내소' : 'Gwangalli Tourist Information'}
                            />
                          </div>
                        </div>

                        <ul className="text-xs text-[#4A5568] space-y-1.5 leading-relaxed pt-0.5">
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '운영 시간' : 'Hours'}:</strong>{' '}
                            {language === 'KR' ? '평시 10:00~18:00 / 성수기(7~8월) 10:00~21:00' : '10:00 AM–6:00 PM / Peak (Jul–Aug): 10:00 AM–9:00 PM'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '대여 품목' : 'Items'}:</strong>{' '}
                            {language === 'KR' ? '일반 휠체어, 유모차 (오전 조기 마감 주의)' : 'Wheelchairs & strollers (often fills early in morning)'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '대여 조건' : 'Requirement'}:</strong>{' '}
                            {language === 'KR' ? '신분증 지참 필수 (당일 대여 및 반납)' : 'Valid ID required (Same-day only)'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '전화' : 'Phone'}:</strong>{' '}
                            <a href="tel:051-610-4848" className="text-slate-800 hover:text-[#0A2540] font-bold underline decoration-slate-300">
                              051-610-4848
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Spot 3: 신세계백화점 센텀시티점 */}
                    <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-[#8EA85E] transition-colors">
                      <div className="space-y-2.5">
                        <div className="border-b border-slate-200/70 pb-2.5 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-extrabold text-base text-[#0A2540]">
                              {language === 'KR' ? '신세계백화점 센텀시티점' : 'Shinsegae Centum City'}
                            </h4>
                            <span className="text-[11px] font-bold text-[#8EA85E] shrink-0">
                              {language === 'KR' ? '비용: 무료 (실내 이용)' : 'Cost: Free (Indoor Only)'}
                            </span>
                          </div>
                          {/* 주소 + 네이버지도 / 구글맵 아이콘 */}
                          <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
                            <div className="flex items-center gap-1 text-slate-600 min-w-0">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-medium text-slate-700">
                                {language === 'KR' ? '부산 해운대구 센텀남대로 35 (센텀시티역 연결)' : '35, Centumnam-daero, Haeundae-gu'}
                              </span>
                            </div>
                            <MapAppIcons
                              naverUrl="https://map.naver.com/v5/search/%EC%8B%A0%EC%84%B8%EA%B3%84%EB%B0%B1%ED%99%94%EC%A0%90%20%EC%84%BC%ED%85%80%EC%8B%9C%ED%8B%B0%EC%A0%90"
                              googleUrl="https://www.google.com/maps/search/?api=1&query=Shinsegae+Centum+City+Busan"
                              title={language === 'KR' ? '신세계백화점 센텀시티점' : 'Shinsegae Centum City'}
                            />
                          </div>
                        </div>

                        <ul className="text-xs text-[#4A5568] space-y-1.5 leading-relaxed pt-0.5">
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '이용 시간' : 'Hours'}:</strong>{' '}
                            {language === 'KR' ? '월~목 10:30~20:00 / 금~일 10:30~20:30' : 'Mon–Thu 10:30–20:00 / Fri–Sun 10:30–20:30'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '대여 위치' : 'Location'}:</strong>{' '}
                            {language === 'KR' ? '백화점 1층 안내데스크 및 몰 1층 컨시어지 데스크' : 'Dept Store 1F Info Desk & Mall 1F Concierge'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '대여 품목' : 'Items'}:</strong>{' '}
                            {language === 'KR' ? '유모차(생후 24개월 이하), 휠체어 무료 대여' : 'Strollers (under 24 mos) & wheelchairs'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '전화' : 'Phone'}:</strong>{' '}
                            <a href="tel:1588-1234" className="text-slate-800 hover:text-[#0A2540] font-bold underline decoration-slate-300">
                              1588-1234
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Spot 4: 롯데백화점 부산본점 */}
                    <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-[#8EA85E] transition-colors">
                      <div className="space-y-2.5">
                        <div className="border-b border-slate-200/70 pb-2.5 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-extrabold text-base text-[#0A2540]">
                              {language === 'KR' ? '롯데백화점 부산본점' : 'Lotte Dept Store Busan Main'}
                            </h4>
                            <span className="text-[11px] font-bold text-[#8EA85E] shrink-0">
                              {language === 'KR' ? '비용: 무료 (실내 이용)' : 'Cost: Free (Indoor Only)'}
                            </span>
                          </div>
                          {/* 주소 + 네이버지도 / 구글맵 아이콘 */}
                          <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
                            <div className="flex items-center gap-1 text-slate-600 min-w-0">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-medium text-slate-700">
                                {language === 'KR' ? '부산 부산진구 가야대로 772 (서면역 연결)' : '772, Gaya-daero, Busanjin-gu'}
                              </span>
                            </div>
                            <MapAppIcons
                              naverUrl="https://map.naver.com/v5/search/%EB%A1%AF%EB%8D%B0%EB%B0%B1%ED%99%94%EC%A0%90%20%EB%B6%80%EC%82%B0%EB%B3%B8%EC%A0%90"
                              googleUrl="https://www.google.com/maps/search/?api=1&query=Lotte+Department+Store+Busan+Main"
                              title={language === 'KR' ? '롯데백화점 부산본점' : 'Lotte Dept Store Busan Main'}
                            />
                          </div>
                        </div>

                        <ul className="text-xs text-[#4A5568] space-y-1.5 leading-relaxed pt-0.5">
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '이용 시간' : 'Hours'}:</strong>{' '}
                            {language === 'KR' ? '월~목 10:30~20:00 / 금~일 10:30~20:30' : 'Mon–Thu 10:30–20:00 / Fri–Sun 10:30–20:30'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '대여 위치' : 'Location'}:</strong>{' '}
                            {language === 'KR' ? '1층 고객서비스센터 / 안내데스크' : '1F Customer Service Desk'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '대여 품목' : 'Items'}:</strong>{' '}
                            {language === 'KR' ? '유모차, 휠체어 무료 대여 (신분증 또는 앱 확인)' : 'Strollers & wheelchairs with ID/app'}
                          </li>
                          <li>
                            <strong className="text-slate-800">{language === 'KR' ? '전화' : 'Phone'}:</strong>{' '}
                            <a href="tel:051-810-2500" className="text-slate-800 hover:text-[#0A2540] font-bold underline decoration-slate-300">
                              051-810-2500
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Friendly Local Outro */}
                  <div className="text-xs sm:text-sm text-slate-600 font-medium pt-1 text-center sm:text-left">
                    {language === 'KR'
                      ? '유모차와 휠체어는 대여 수량이 한정되어 있으니, 방문하시기 전 전화로 잔여 수량을 미리 확인해 보시는 것을 추천드려요!'
                      : 'Strollers and wheelchairs have limited availability, so we recommend calling ahead to check before visiting!'}
                  </div>
                </div>
              )}

              {/* 3. 5초 한국어 발음 치트키 DETAIL */}
              {(selectedExplorationItem === 'korean-cheat-codes' || selectedExplorationItem === 'metro-reentry') && (
                <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5 sm:p-7 space-y-6 shadow-2xs">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#8EA85E] shrink-0 stroke-[2.2]" />
                      <h3 className="text-xl sm:text-2xl font-black text-[#11161B] tracking-tight">
                        {language === 'KR'
                          ? '5초 만에 끝내는 한국어 발음 치트키 😂'
                          : 'How I teach Korean to my American friends in 5 seconds!! Korean pronunciation cheat codes 😂'}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                      {language === 'KR'
                        ? '외국인 친구들에게 기초 한국어를 알려주려다 발음 때문에 뒷목 잡고 😂 재미 삼아 만들어본 초간단 비공식 “초고속 한국어 발음 치트키”를 공개합니다!'
                        : 'I was trying to teach my American friends some basic Korean, but their pronunciation was driving me crazy 😂 So I came up with this completely unofficial “speed-learning” method:'}
                    </p>
                  </div>

                  {/* 12 Cheat Codes Cards (Grid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {KOREAN_CHEAT_CODES.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl p-3.5 space-y-2 hover:border-[#8EA85E] transition-colors"
                      >
                        <div className="flex items-baseline justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                          <span className="font-black text-base text-[#0A2540]">{item.kr}</span>
                          <span className="text-xs font-semibold text-slate-500">{item.en}</span>
                        </div>
                        <div className="space-y-1 pt-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pronounce</span>
                            <span className="font-extrabold text-[#8EA85E] text-xs sm:text-sm bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                              "{item.sound}"
                            </span>
                          </div>
                          {item.action && (
                            <div className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5 pt-1">
                              <span className="text-[#8EA85E] font-extrabold text-sm shrink-0">👉</span>
                              <span>{item.action}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Friendly Local Outro (No Box) */}
                  <div className="pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-1 text-center sm:text-left">
                    <p className="font-extrabold text-slate-800">
                      {language === 'KR'
                        ? '정석 한국어 공부법이냐고요? 절대 아니죠. 😂'
                        : 'Is this how you’re supposed to learn Korean? Absolutely not. 😂'}
                    </p>
                    <p className="font-medium text-slate-600">
                      {language === 'KR'
                        ? '하지만 외국인 친구들이 이 단어들을 기억해서 바로 써먹었냐고요? 신기하게도, 네! 효과 만점이었습니다.'
                        : 'Did my friends remember the words? Somehow, yes.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Back to Exploration List Bottom Bar */}
              <div className="pt-3 flex justify-center">
                <button
                  type="button"
                  onClick={() => handleSelectExplorationItem(null)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#8EA85E] text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{language === 'KR' ? '탐구생활 목록으로 돌아가기' : 'Back to Exploration List'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
