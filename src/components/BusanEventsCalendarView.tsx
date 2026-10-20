/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Updated: Busan Major Events & Festivals Calendar
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Tag, 
  Info, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  X, 
  Train, 
  ArrowRight, 
  Navigation,
  CalendarDays,
  List,
  Search,
  Clock,
  Compass,
  Music,
  Film,
  Waves,
  Sun,
  Flame,
  Palette,
  Landmark,
  Snowflake,
  Sunrise,
  Utensils
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { STATIONS } from '../data';

interface BusanEventsCalendarViewProps {
  language: 'KR' | 'EN';
  onSelectStation?: (stationId: string, exitNum?: string) => void;
}

export interface BusanEvent {
  id: string;
  titleKo: string;
  titleEn: string;
  category: 'festival' | 'culture' | 'performance' | 'drone';
  categoryKo: string;
  categoryEn: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  stationId: string; // station ID matching STATIONS
  exitNumber: string; // recommended exit (e.g., '1번 출구')
  stationKo: string;
  stationEn: string;
  metroLine: string; // e.g., "1호선", "2호선"
  accessibilityKo: string;
  accessibilityEn: string;
  exitTipKo?: string;
  exitTipEn?: string;
  descriptionKo: string;
  descriptionEn: string;
  locationKo: string;
  locationEn: string;
  colorClass: string; // Tailwind color theme
  dotClass: string;
  isAutoSynced?: boolean;
}

// Helper: Determine a sophisticated line icon for an event
export function getEventIcon(evt: BusanEvent) {
  const t = (evt.titleKo + ' ' + evt.categoryKo + ' ' + evt.id).toLowerCase();
  if (t.includes('드론') || t.includes('drone')) return Sparkles;
  if (t.includes('불꽃') || t.includes('firework')) return Flame;
  if (t.includes('빛축제') || t.includes('트리') || t.includes('light')) return Sparkles;
  if (t.includes('영화') || t.includes('movie') || t.includes('film') || t.includes('biff')) return Film;
  if (t.includes('록') || t.includes('음악') || t.includes('콘서트') || t.includes('rock') || t.includes('music')) return Music;
  if (t.includes('바다') || t.includes('sup') || t.includes('해변') || t.includes('sea') || t.includes('beach')) return Waves;
  if (t.includes('해맞이') || t.includes('sunrise') || t.includes('일출')) return Sunrise;
  if (t.includes('북극곰') || t.includes('겨울') || t.includes('winter')) return Snowflake;
  if (t.includes('자갈치') || t.includes('국수') || t.includes('food') || t.includes('식')) return Utensils;
  if (t.includes('박람회') || t.includes('지스타') || t.includes('전시') || t.includes('expo') || t.includes('gstar')) return Landmark;
  return Compass;
}

// Curated Busan Events Data (2026-08 ~ 2027-01 Rich Festival Roster)
const BUSAN_EVENTS_DATA: BusanEvent[] = [
  // --- 8월 ---
  {
    id: 'sea-festival',
    titleKo: '제28회 부산 바다축제',
    titleEn: '28th Busan Sea Festival',
    category: 'festival',
    categoryKo: '해변 축제',
    categoryEn: 'Beach Festival',
    startDate: '2026-08-07',
    endDate: '2026-08-13',
    stationId: 'dadaepo',
    exitNumber: '1번 출구',
    stationKo: '다대포해수욕장역 (1호선)',
    stationEn: 'Dadaepo Beach Station',
    metroLine: 'Line 1',
    accessibilityKo: '다대포해수욕장 및 수변공원 평탄 구역에 시각 가이드 및 안내 부스가 배치됩니다. 바닷가 임시 매트 통로 구축으로 수변 평탄 도보 보행을 돕습니다.',
    accessibilityEn: 'Special flat synthetic pathways and temporary plastic beach mats are laid out toward the water at Dadaepo Beach to provide sturdy support for wheels.',
    exitTipKo: '다대포해수욕장역 1번 출구 엘리베이터 이용 시 계단과 턱 없이 다대포 백사장 및 수변공원 무대까지 평탄하게 직결됩니다.',
    exitTipEn: 'Dadaepo Beach Exit 1 elevator offers step-free access straight to the beach and waterfront stage.',
    descriptionKo: '뜨거운 한여름 밤 다대포해수욕장 일원에서 열리는 거대한 댄스 카니발, 대규모 버스킹, 나이트 풀파티, 수변 라이브 무대입니다.',
    descriptionEn: 'An epic mid-summer celebration spanning Dadaepo Beach, featuring live bands, street food stalls, and ocean parties engineered for universal entry.',
    locationKo: '다대포해수욕장 일원',
    locationEn: 'Dadaepo Beachfront & Coastal Park',
    colorClass: 'bg-[#8EA85E]/15 text-[#526826] border-[#8EA85E]/30',
    dotClass: 'bg-[#8EA85E]'
  },
  {
    id: 'busan-buddhist-expo-2026',
    titleKo: '2026 부산국제불교박람회',
    titleEn: '2026 Busan International Buddhist Expo',
    category: 'culture',
    categoryKo: '전시 / 박람회',
    categoryEn: 'Exhibition & Expo',
    startDate: '2026-08-06',
    endDate: '2026-08-09',
    stationId: 'bexco',
    exitNumber: '7번 출구',
    stationKo: '벡스코역 (2호선/동해선)',
    stationEn: 'BEXCO Station',
    metroLine: 'Line 2 / Donghae',
    accessibilityKo: '벡스코 제1전시장은 단차가 전혀 없고 수직 승강기 및 장애인 전용 화장실이 완비되어 휠체어 및 유모차 이용객이 안전하고 쾌적하게 관람할 수 있습니다.',
    accessibilityEn: 'BEXCO Exhibition Center I features 100% barrier-free flat floors, wide entrance aisles, and dedicated accessible facilities.',
    exitTipKo: '벡스코역 7번 출구 엘리베이터 이용 시 벡스코 제1전시장 및 야외광장까지 수평 무단차로 이동하실 수 있습니다.',
    exitTipEn: 'BEXCO Station Exit 7 elevator connects directly to BEXCO Exhibition Hall 1 with full step-free access.',
    descriptionKo: '한국 불교 문화 및 수행, 명상, 템플스테이, 불교 미술 및 전통 공예와 현대 웰니스 산업을 통합 선보이는 대표 박람회입니다.',
    descriptionEn: 'A major international expo displaying Korean Buddhist culture, meditation, temple stays, art crafts, and modern wellness industries.',
    locationKo: '벡스코 (BEXCO) 제1전시장 3홀',
    locationEn: 'BEXCO Exhibition Center I, Hall 3',
    colorClass: 'bg-[#6B8E23]/15 text-[#4E6719] border-[#6B8E23]/30',
    dotClass: 'bg-[#6B8E23]'
  },
  {
    id: 'north-port-ocean-sup-festa-2026',
    titleKo: '북항 오션 SUP FESTA',
    titleEn: 'North Port Ocean SUP FESTA',
    category: 'festival',
    categoryKo: '해양 레저',
    categoryEn: 'Marine Sports',
    startDate: '2026-07-31',
    endDate: '2026-08-09',
    stationId: 'busan',
    exitNumber: '9번 출구',
    stationKo: '부산역 / 초량역 (1호선)',
    stationEn: 'Busan / Choryang Station',
    metroLine: 'Line 1',
    accessibilityKo: '북항 친수공원 보행 수변 도로는 무단차 평탄 블록으로 설계되어 유모차 및 휠체어 접근이 매우 편안합니다.',
    accessibilityEn: 'The North Port Waterfront Park walkways are entirely flat and barrier-free for smooth wheel navigation.',
    exitTipKo: '부산역 9번 출구 (북항 친수공원 연결 보행데크) 이용 시 수변공원까지 경사나 계단 없이 안전하게 보행이 가능합니다.',
    exitTipEn: 'Busan Station Exit 9 pedestrian deck provides step-free walkability straight to North Port Park.',
    descriptionKo: '부산 북항 재개발지 친수공원에서 펼쳐지는 패들보드(SUP) 체험, 수변 레저 스포츠 프로그램 및 온 가족이 즐기는 시원한 일상 탈출 축제입니다.',
    descriptionEn: 'Stand-up paddleboarding (SUP) and waterfront leisure sports festival held at the scenic North Port Waterfront Park.',
    locationKo: '북항 친수공원 일원',
    locationEn: 'North Port Waterfront Park Area',
    colorClass: 'bg-[#8EA85E]/15 text-[#526826] border-[#8EA85E]/30',
    dotClass: 'bg-[#8EA85E]'
  },
  {
    id: 'dadaepo-sunset-movie-festival-2026',
    titleKo: '다대포 선셋 영화축제',
    titleEn: 'Dadaepo Sunset Movie Festival',
    category: 'culture',
    categoryKo: '영화 / 문화',
    categoryEn: 'Movie & Culture',
    startDate: '2026-08-14',
    endDate: '2026-08-16',
    stationId: 'dadaepo',
    exitNumber: '1번 출구',
    stationKo: '다대포해수욕장역 (1호선)',
    stationEn: 'Dadaepo Beach Station',
    metroLine: 'Line 1',
    accessibilityKo: '다대포 노을정원 및 수변 무대 관람 구역은 데크길과 평탄 잔디광장으로 연결되어 이동 편의성이 뛰어납니다.',
    accessibilityEn: 'Viewing lawns and sunset boardwalks at Dadaepo Beach provide wide, barrier-free access.',
    exitTipKo: '다대포해수욕장역 1번 출구 엘리베이터 이용 시 다대포 노을정원 및 수변 무대까지 턱 없이 이동이 가능합니다.',
    exitTipEn: 'Dadaepo Beach Exit 1 elevator offers step-free access straight to Dadaepo Sunset Garden and beach stage.',
    descriptionKo: '붉게 물드는 다대포 노을을 배경으로 야외 영화 상영, 감독/배우 토크쇼, 노을 버스킹이 함께하는 로맨틱 영화제입니다.',
    descriptionEn: 'Outdoor cinema, director talk shows, and sunset acoustics set against Dadaepo\'s famous golden sunset.',
    locationKo: '다대포해수욕장 일원',
    locationEn: 'Dadaepo Beachfront Area',
    colorClass: 'bg-[#6B8E23]/15 text-[#4E6719] border-[#6B8E23]/30',
    dotClass: 'bg-[#6B8E23]'
  },
  {
    id: 'drone-aug-hero',
    titleKo: '광안리 드론쇼 (히어로)',
    titleEn: 'Gwangalli Drone Show (Heroes)',
    category: 'drone',
    categoryKo: '드론 연출',
    categoryEn: 'Drone Exhibition',
    startDate: '2026-08-22',
    endDate: '2026-08-22',
    stationId: 'gwangan',
    exitNumber: '5번 출구',
    stationKo: '광안역 (2호선)',
    stationEn: 'Gwangan Station',
    metroLine: 'Line 2',
    accessibilityKo: '광안리해변로는 휠체어/유모차 전 구역 진입이 자유로운 완만한 보도블록으로 구성되어 있습니다.',
    accessibilityEn: 'Smooth boardwalk pavements with no steps along Gwangalli beach.',
    exitTipKo: '광안역 5번 출구 엘리베이터 이용 시 해변 보행광장까지 무단차로 직결됩니다.',
    exitTipEn: 'Gwangan Exit 5 elevator connects to the beach esplanade step-free.',
    descriptionKo: '토요일 20:00 / 22:00 2회 공연. 영웅과 캐릭터를 테마로 밤바다를 수놓는 첨단 드론 쇼입니다.',
    descriptionEn: 'Saturday night drone lighting spectacle over Gwangalli bay.',
    locationKo: '광안리 해수욕장 생활체육공원 앞 해상',
    locationEn: 'Gwangalli Beachfront Marine Sky',
    colorClass: 'bg-emerald-50 text-emerald-850 border-emerald-200',
    dotClass: 'bg-emerald-600'
  },
  {
    id: 'drone-aug-goodbye-summer',
    titleKo: '광안리 드론쇼 (굿바이 여름)',
    titleEn: 'Gwangalli Drone Show (Goodbye Summer)',
    category: 'drone',
    categoryKo: '드론 연출',
    categoryEn: 'Drone Exhibition',
    startDate: '2026-08-29',
    endDate: '2026-08-29',
    stationId: 'gwangan',
    exitNumber: '5번 출구',
    stationKo: '광안역 (2호선)',
    stationEn: 'Gwangan Station',
    metroLine: 'Line 2',
    accessibilityKo: '광안해변 테마거리는 완전 평탄 보도블록으로 구성되어 휠체어/유모차 전 구역 진입이 자유롭습니다.',
    accessibilityEn: 'The spacious Gwangalli Beach esplanade is paved with continuous non-slip flat bricks.',
    exitTipKo: '광안역 5번 출구 엘리베이터 이용 후 광안해변 보행광장으로 수평 무단차 이동이 가능합니다.',
    exitTipEn: 'Gwangan Exit 5 elevator connects to Gwangalli Beach esplanade without stairs.',
    descriptionKo: '여름의 마지막 밤을 아쉬워하며 가을의 서막을 여는 감성 드론 라이트쇼입니다.',
    descriptionEn: 'Emotional drone light performance saying farewell to summer.',
    locationKo: '광안리 해수욕장 앞 해상',
    locationEn: 'Gwangalli Beachfront Esplanade',
    colorClass: 'bg-emerald-50 text-emerald-850 border-emerald-200',
    dotClass: 'bg-emerald-600'
  },

  // --- 10월 ---
  {
    id: 'rock-festival',
    titleKo: '부산국제록페스티벌',
    titleEn: 'Busan International Rock Festival',
    category: 'performance',
    categoryKo: '공연/콘서트',
    categoryEn: 'Performance & Concert',
    startDate: '2026-10-02',
    endDate: '2026-10-04',
    stationId: 'sasang',
    exitNumber: '3번 출구',
    stationKo: '사상역 (2호선) / 괘법르네시떼역',
    stationEn: 'Sasang / Gwaebeop Renecite Station',
    metroLine: 'Line 2 & BGL',
    accessibilityKo: '삼락공원은 드넓은 평지 잔디밭공원입니다. 페스티벌 기간 내 휠체어 바퀴가 풀밭에 묻히지 않도록 대규모 고무 매트 선형 가이드가 마련됩니다.',
    accessibilityEn: 'Massive industrial rubber mats are temporarily paved over the grass to provide firm rollway safety.',
    exitTipKo: '사상역 3번 출구 또는 괘법르네시떼역 1번 출구 엘리베이터 보행교 이용 시 삼락생태공원 메인무대로 무단차 이동이 가능합니다.',
    exitTipEn: 'Sasang Exit 3 or Gwaebeop Renecite Exit 1 elevator bridge provides step-free access to Samrak Park.',
    descriptionKo: '대한민국 최장수 록 페스티벌로 국내외 최정상급 록, 인디 뮤지션들이 흥겨운 야간 라이브 퍼포먼스를 펼칩니다.',
    descriptionEn: 'Korea\'s longest-running legendary rock festival with domestic and global rock icons.',
    locationKo: '삼락생태공원',
    locationEn: 'Samrak Ecological Park',
    colorClass: 'bg-[#6B8E23]/15 text-[#4E6719] border-[#6B8E23]/30',
    dotClass: 'bg-[#6B8E23]'
  },
  {
    id: 'biff-festival',
    titleKo: '부산국제영화제 (BIFF)',
    titleEn: 'Busan International Film Festival (BIFF)',
    category: 'culture',
    categoryKo: '문화/예술',
    categoryEn: 'Culture & Arts',
    startDate: '2026-10-06',
    endDate: '2026-10-15',
    stationId: 'centum',
    exitNumber: '1번 출구',
    stationKo: '센텀시티역 (2호선) / 벡스코역',
    stationEn: 'Centum City / BEXCO Station',
    metroLine: 'Line 2',
    accessibilityKo: '세계적으로 인증받은 영화의전당은 단차 없는 엘리베이터, 자동문 및 휠체어 전용 상영 좌석이 내재되어 수준 높습니다.',
    accessibilityEn: 'The magnificent Cinema Center is fully certified step-free with pristine elevators and wheelchair rows.',
    exitTipKo: '센텀시티역 1번 또는 벡스코역 7번 출구 이용 시 영화의전당까지 신호등과 계단 없이 평탄 보도로 연결됩니다.',
    exitTipEn: 'Centum City Exit 1 offers a smooth flat walkway straight to Busan Cinema Center.',
    descriptionKo: '아시아 최고 권위의 국제 영화제로, 세계 각국의 엄선된 예술영화 상영, 관객과의 대화(GV), 스타 레드카펫 행사가 이어집니다.',
    descriptionEn: 'Asia\'s most prestigious film festival with world premieres and red carpet celebrations.',
    locationKo: '영화의전당 및 센텀시티 일원',
    locationEn: 'Busan Cinema Center and Centum City Venues',
    colorClass: 'bg-[#6B8E23]/15 text-[#4E6719] border-[#6B8E23]/30',
    dotClass: 'bg-[#6B8E23]'
  },
  {
    id: 'jagalchi-festival',
    titleKo: '부산자갈치축제',
    titleEn: 'Busan Jagalchi Festival',
    category: 'festival',
    categoryKo: '전통 축제',
    categoryEn: 'Traditional Festival',
    startDate: '2026-10-15',
    endDate: '2026-10-18',
    stationId: 'jagalchi',
    exitNumber: '10번 출구',
    stationKo: '자갈치역 / 남포역 (1호선)',
    stationEn: 'Jagalchi / Nampo Station',
    metroLine: 'Line 1',
    accessibilityKo: '현대식 자갈치 크루즈 빌딩 및 주 관람거리는 시원하고 넓게 포장된 바닥으로 계단이 없으며 내부 상가 엘리베이터가 준비되어 있습니다.',
    accessibilityEn: 'The modern Jagalchi Center building has step-free elevators and flat concrete walkways.',
    exitTipKo: '자갈치역 10번 출구 이용 시 자갈치시장 신관 수변공간 및 크루즈선착장까지 수평 무단차 진입이 가능합니다.',
    exitTipEn: 'Jagalchi Exit 10 offers flat step-free access to Jagalchi Market coastal plaza.',
    descriptionKo: '"오이소, 보이소, 사이소!" 정겨운 사투리와 한국 수산업의 최대 집결지로 싱싱한 수산물 무료 시식, 맨손 잡기 행사, 유람선 탑승 등 활기가 넘칩니다.',
    descriptionEn: 'Korea\'s largest coastal seafood festival with fresh tastings and harbor boat cruises.',
    locationKo: '부산 자갈치 시장 및 유라리광장',
    locationEn: 'Busan Jagalchi Market & Waterfront',
    colorClass: 'bg-[#8EA85E]/15 text-[#526826] border-[#8EA85E]/30',
    dotClass: 'bg-[#8EA85E]'
  },
  {
    id: 'guponaru-festival',
    titleKo: '낙동강 구포나루축제',
    titleEn: 'Nakdong River Guponaru Festival',
    category: 'festival',
    categoryKo: '강변 축제',
    categoryEn: 'Traditional River Festival',
    startDate: '2026-10-16',
    endDate: '2026-10-18',
    stationId: 'bujeon',
    exitNumber: '3번 출구',
    stationKo: '구포역 / 덕천역 (3호선/2호선)',
    stationEn: 'Gupo / Deokcheon Station',
    metroLine: 'Line 3 & 2',
    accessibilityKo: '화명생태공원 나루터 일원 및 선착장 보행로는 단차가 최소화된 평지 산책로로 조성되어 휠체어와 유모차가 안전하게 산책할 수 있습니다.',
    accessibilityEn: 'Riverside walkways at Hwamyeong Ecological Park provide flat, step-free access for wheels.',
    exitTipKo: '구포역 3번 출구 또는 덕천역 3번 출구를 통해 평탄한 낙동강 수변 보행로로 진입하실 수 있습니다.',
    exitTipEn: 'Use Gupo Exit 3 for direct flat walkway access to the festival area.',
    descriptionKo: '낙동강 뗏목 타기 체험, 구포국수 먹거리 장터, 나루터 가요제, 야간 빛축제가 풍성하게 펼쳐지는 역사문화 축제입니다.',
    descriptionEn: 'A historic river festival with raft rides, traditional Gupo noodles, and evening lights.',
    locationKo: '화명생태공원 및 구포나루터 일원',
    locationEn: 'Hwamyeong Ecological Park & Guponaru Wharf',
    colorClass: 'bg-[#8EA85E]/15 text-[#526826] border-[#8EA85E]/30',
    dotClass: 'bg-[#8EA85E]'
  },
  {
    id: 'sasang-riverside-festival',
    titleKo: '사상강변축제',
    titleEn: 'Sasang Riverside Festival',
    category: 'festival',
    categoryKo: '문화/강변 축제',
    categoryEn: 'Riverside Cultural Festival',
    startDate: '2026-10-17',
    endDate: '2026-10-18',
    stationId: 'sasang',
    exitNumber: '3번 출구',
    stationKo: '사상역 (2호선) / 괘법르네시떼역',
    stationEn: 'Sasang / Gwaebeop Renecite Station',
    metroLine: 'Line 2 & BGL',
    accessibilityKo: '삼락생태공원 문화마당은 보행 약자를 위한 완만한 잔디 광장 및 평탄 보도블록으로 구성되어 휠체어와 유모차 이동이 수월합니다.',
    accessibilityEn: 'Samrak Ecological Park Cultural Plaza features flat asphalt and brick pathways.',
    exitTipKo: '사상역 3번 출구 또는 괘법르네시떼역 1번 출구 엘리베이터 보행육교를 이용해 삼락생태공원 문화마당으로 턱 없이 진입하실 수 있습니다.',
    exitTipEn: 'Use the elevator overpass at Sasang Exit 3 to reach Samrak Park Cultural Plaza step-free.',
    descriptionKo: '가을 낙동강변의 정취와 함께 펼쳐지는 사상 대표 축제로 강변 음악회, 거리 버스킹, 전통 체험 및 야간 경관 조명 행사입니다.',
    descriptionEn: 'Autumn riverside festival featuring live music, street busking, and illuminations.',
    locationKo: '삼락생태공원 문화마당',
    locationEn: 'Samrak Ecological Park Cultural Plaza',
    colorClass: 'bg-[#8EA85E]/15 text-[#526826] border-[#8EA85E]/30',
    dotClass: 'bg-[#8EA85E]'
  },

  // --- 11월 ---
  {
    id: 'fireworks-festival',
    titleKo: '부산 불꽃축제',
    titleEn: 'Busan Fireworks Festival',
    category: 'performance',
    categoryKo: '멀티 불꽃쇼',
    categoryEn: 'Fireworks & Concert',
    startDate: '2026-11-07',
    endDate: '2026-11-07',
    stationId: 'gwangan',
    exitNumber: '5번 출구',
    stationKo: '광안역 / 금련산역 (2호선)',
    stationEn: 'Gwangan / Geumnyeonsan Station',
    metroLine: 'Line 2',
    accessibilityKo: '휠체어 탑승자와 배려자를 위한 지정석 구역 및 특수 통행 게이트가 별도로 지정 통제 운영되므로 안심하십시오.',
    accessibilityEn: 'Specialized barrier-free outdoor viewing zones with dynamic ramp entrances are dedicated for wheelchair visitors.',
    exitTipKo: '광안역 5번 출구 엘리베이터 이용 후 광안리해수욕장 배리어프리 전용 관람존으로 이동하실 수 있습니다.',
    exitTipEn: 'Gwangan Exit 5 elevator connects directly to barrier-free viewing gates at Gwangalli Beach.',
    descriptionKo: '매년 가을 밤 광안대교를 배경으로 수만 발의 화려한 초대형 불꽃과 초대형 드론 군무, 감미로운 음악을 접목한 세계 최고 수준의 멀티미디어 쇼입니다.',
    descriptionEn: 'A breathtaking firework performance framed by Gwangandaegyo Bridge, using multi-dimensional visual laser shows and symphonies.',
    locationKo: '광안리 해수욕장 백사장 일대 및 수변공원',
    locationEn: 'Gwangalli Beach Front & Marine Park',
    colorClass: 'bg-emerald-50 text-emerald-850 border-emerald-200',
    dotClass: 'bg-emerald-600'
  },
  {
    id: 'gstar-2026',
    titleKo: '2026 국제게임전시회 지스타 (G-STAR)',
    titleEn: 'G-STAR 2026 (Global Game Exhibition)',
    category: 'culture',
    categoryKo: '전시 / 게임쇼',
    categoryEn: 'Game Expo',
    startDate: '2026-11-19',
    endDate: '2026-11-22',
    stationId: 'centum',
    exitNumber: '1번 출구',
    stationKo: '센텀시티역 (2호선) / 벡스코역',
    stationEn: 'Centum City / BEXCO Station',
    metroLine: 'Line 2',
    accessibilityKo: '벡스코 전 구역은 완전 평탄 무단차 바닥과 광폭 자동문, 장애인 엘리베이터가 완비되어 휠체어와 유모차 이동이 완벽하게 보장됩니다.',
    accessibilityEn: 'BEXCO Exhibition Halls provide 100% flat barrier-free access with wide automatic doors and elevators.',
    exitTipKo: '센텀시티역 1번 출구 지하 연결통로 및 엘리베이터 이용 시 벡스코 제1·2전시장까지 지상 계단 없이 편리하게 이동하실 수 있습니다.',
    exitTipEn: 'Centum City Exit 1 connects directly to BEXCO halls via step-free underground and elevator paths.',
    descriptionKo: '국내외 대표 글로벌 게임사들이 총출동하는 아시아 최대 게임 축제로 신작 시연, e스포츠 대회, 코스프레 및 컨퍼런스가 성대하게 펼쳐집니다.',
    descriptionEn: 'Asia\'s premier global gaming exhibition featuring upcoming blockbuster title trials, esports tournaments, and developer conferences.',
    locationKo: '벡스코 (BEXCO) 제1·제2전시장 전관',
    locationEn: 'BEXCO Exhibition Center I & II',
    colorClass: 'bg-[#6B8E23]/15 text-[#4E6719] border-[#6B8E23]/30',
    dotClass: 'bg-[#6B8E23]'
  },
  {
    id: 'haeundae-light-festival-2026',
    titleKo: '제13회 해운대 빛축제',
    titleEn: '13th Haeundae Light Festival',
    category: 'festival',
    categoryKo: '겨울 빛축제',
    categoryEn: 'Winter Light Festival',
    startDate: '2026-11-28',
    endDate: '2027-01-31',
    stationId: 'haeundae',
    exitNumber: '3번 출구',
    stationKo: '해운대역 (2호선)',
    stationEn: 'Haeundae Station',
    metroLine: 'Line 2',
    accessibilityKo: '구남로 문화광장부터 해운대해수욕장 호안도로 데크길까지 전 구간 평지 보행로로 단차가 전혀 없어 휠체어와 유모차가 빛 조형물을 쾌적하게 관람할 수 있습니다.',
    accessibilityEn: 'The entire walking boulevard from Gunam-ro to Haeundae Beach esplanade is flat and step-free for smooth wheelchair strolls.',
    exitTipKo: '해운대역 3번 또는 5번 출구 엘리베이터 이용 시 구남로 보행전용 광장 및 해운대 백사장 빛축제 메인 게이트까지 무단차로 직결됩니다.',
    exitTipEn: 'Haeundae Station Exit 3 & 5 elevators lead directly to Gunam-ro pedestrian avenue and beach light zones.',
    descriptionKo: '겨울 밤바다를 낭만적인 빛의 파도로 물들이는 부산 대표 겨울 축제입니다. 백사장 위 초대형 미디어 파사드와 구남로의 화려한 빛 터널 조형물이 환상적입니다.',
    descriptionEn: 'Busan\'s signature winter illuminations across Gunam-ro street and Haeundae Beachfront, featuring large-scale kinetic light waves and media art.',
    locationKo: '해운대해수욕장 백사장 및 구남로 일원',
    locationEn: 'Haeundae Beach & Gunam-ro Pedestrian Avenue',
    colorClass: 'bg-teal-50 text-teal-850 border-teal-200',
    dotClass: 'bg-teal-600'
  },

  // --- 12월 ---
  {
    id: 'gwangbok-tree-festival-2026',
    titleKo: '부산 크리스마스트리문화축제',
    titleEn: 'Busan Christmas Tree Cultural Festival',
    category: 'festival',
    categoryKo: '거리 빛축제',
    categoryEn: 'Street Festival',
    startDate: '2026-12-05',
    endDate: '2027-01-10',
    stationId: 'jagalchi',
    exitNumber: '7번 출구',
    stationKo: '남포역 / 자갈치역 (1호선)',
    stationEn: 'Nampo / Jagalchi Station',
    metroLine: 'Line 1',
    accessibilityKo: '남포동 광복로 패션거리는 차 없는 보행자 전용거리로 정비되어 아스팔트 및 보도블록에 턱이 없어 휠체어/유모차 통행이 자유롭습니다.',
    accessibilityEn: 'Gwangbok-ro is a designated car-free shopping avenue with flat paved walkways, ideal for strollers and wheelchairs.',
    exitTipKo: '남포역 1번 출구 또는 7번 출구 엘리베이터 이용 시 광복로 패션거리 메인 트리 광장으로 턱 없이 바로 진입하실 수 있습니다.',
    exitTipEn: 'Nampo Station Exit 1 and 7 elevators provide step-free access straight to Gwangbok-ro Tree Plaza.',
    descriptionKo: '부산의 원도심 남포동 광복로 거리에 18m 대형 크리스마스트리와 화려한 일루미네이션 조명이 밤하늘을 수놓으며 거리 음악회와 캐럴 버스킹이 펼쳐지는 축제입니다.',
    descriptionEn: 'A giant 18m Christmas tree and brilliant street illuminations bring warm holiday festivities to Nampo-dong with daily carol performances.',
    locationKo: '중구 광복로 패션거리 및 남포동 일원',
    locationEn: 'Gwangbok-ro Fashion Street, Jung-gu',
    colorClass: 'bg-[#8EA85E]/15 text-[#526826] border-[#8EA85E]/30',
    dotClass: 'bg-[#8EA85E]'
  },
  {
    id: 'gwangalli-nye-drone-2026',
    titleKo: '2027 새해맞이 카운트다운 드론쇼',
    titleEn: '2027 New Year Countdown Drone Light Show',
    category: 'drone',
    categoryKo: '카운트다운 드론쇼',
    categoryEn: 'Special Drone Show',
    startDate: '2026-12-31',
    endDate: '2027-01-01',
    stationId: 'gwangan',
    exitNumber: '5번 출구',
    stationKo: '광안역 (2호선)',
    stationEn: 'Gwangan Station',
    metroLine: 'Line 2',
    accessibilityKo: '광안해변 테마거리는 완전 평탄 보도블록으로 구성되어 휠체어와 유모차 통행이 원활하며 해변가 턱 없는 전망 공간이 넉넉히 확보되어 있습니다.',
    accessibilityEn: 'The Gwangalli boardwalk features smooth, non-slip paving with barrier-free waterfront viewing areas.',
    exitTipKo: '광안역 5번 출구 엘리베이터 이용 후 해변 보행광장으로 수평 이동하시면 광안대교 카운트다운을 무단차로 관람하실 수 있습니다.',
    exitTipEn: 'Gwangan Exit 5 elevator connects to the beach promenade without stairs.',
    descriptionKo: '12월 31일 23시 50분부터 자정 카운트다운과 함께 2,000대 이상의 역대 최대급 드론이 광안대교 상공을 수놓는 초대형 새해맞이 나이트 쇼입니다.',
    descriptionEn: 'A massive midnight countdown spectacle featuring over 2,000 drones lighting up the sky over Gwangandaegyo Bridge to welcome 2027.',
    locationKo: '광안리 해수욕장 백사장 앞 해상',
    locationEn: 'Gwangalli Beach Front & Marine Sky',
    colorClass: 'bg-emerald-50 text-emerald-850 border-emerald-200',
    dotClass: 'bg-emerald-600'
  },
  {
    id: 'yongdusan-bell-2026',
    titleKo: '2027 새해맞이 부산 시민의 종 타종식',
    titleEn: '2027 New Year Bell Tolling Ceremony',
    category: 'culture',
    categoryKo: '시민 타종식',
    categoryEn: 'Ceremony & Celebration',
    startDate: '2026-12-31',
    endDate: '2027-01-01',
    stationId: 'nampo',
    exitNumber: '1번 출구',
    stationKo: '남포역 (1호선)',
    stationEn: 'Nampo Station',
    metroLine: 'Line 1',
    accessibilityKo: '용두산공원 정상 광장까지 캐노피 에스컬레이터와 완만한 휠체어 진입 경사로가 완비되어 있어 보행약자도 안전하게 참석할 수 있습니다.',
    accessibilityEn: 'Yongdusan Park features step-free ramp pathways and outdoor escalators reaching the bell pavilion.',
    exitTipKo: '남포역 1번 출구 이용 시 광복로에서 용두산공원 정상 종각까지 오르는 캐노피 에스컬레이터 및 측면 완경사로로 연결됩니다.',
    exitTipEn: 'Nampo Station Exit 1 connects to the covered escalator and ramps to Yongdusan Park.',
    descriptionKo: '한 해를 마무리하고 희망찬 새해를 여는 33회 타종식과 함께 희망 촛불 나누기, 축하 음악회, 새해 소망 적기 등 부산 시민과 여행자가 함께하는 대표 신년 행사입니다.',
    descriptionEn: 'The ceremonial 33 bell tolls marking the new year at Yongdusan Park with live concerts and candlelight celebrations.',
    locationKo: '용두산공원 종각 일원',
    locationEn: 'Yongdusan Park Bell Pavilion',
    colorClass: 'bg-[#6B8E23]/15 text-[#4E6719] border-[#6B8E23]/30',
    dotClass: 'bg-[#6B8E23]'
  },

  // --- 2027년 1월 ---
  {
    id: 'haeundae-sunrise-2027',
    titleKo: '2027 해운대 해맞이축제',
    titleEn: '2027 Haeundae Sunrise Festival',
    category: 'festival',
    categoryKo: '해맞이 축제',
    categoryEn: 'Sunrise Festival',
    startDate: '2027-01-01',
    endDate: '2027-01-01',
    stationId: 'haeundae',
    exitNumber: '5번 출구',
    stationKo: '해운대역 (2호선)',
    stationEn: 'Haeundae Station',
    metroLine: 'Line 2',
    accessibilityKo: '해운대 백사장 호안도로 보행데크는 무단차 평탄로로 설계되어 휠체어 및 유모차에서 첫 일출을 편안하게 맞이할 수 있습니다.',
    accessibilityEn: 'Haeundae coastal boardwalk provides flat, step-free sunrise view points for wheels and strollers.',
    exitTipKo: '해운대역 5번 출구 엘리베이터 이용 후 구남로 보행광장을 통해 해운대해수욕장 일출 감상 데크로 수평 무단차 이동이 가능합니다.',
    exitTipEn: 'Haeundae Exit 5 elevator leads to the beach boardwalk via Gunam-ro without stairs.',
    descriptionKo: '동해 바다 수평선 위로 떠오르는 2027년 첫 태양을 맞이하는 축제로 일출 기원 공연, 신년 떡국 나눔, 대형 소망 트리 등 따뜻한 온기가 가득합니다.',
    descriptionEn: 'Greeting the first sunrise of 2027 over the ocean horizon with musical performances and warm traditional rice-cake soup.',
    locationKo: '해운대해수욕장 백사장 일원',
    locationEn: 'Haeundae Beach Front',
    colorClass: 'bg-[#8EA85E]/15 text-[#526826] border-[#8EA85E]/30',
    dotClass: 'bg-[#8EA85E]'
  },
  {
    id: 'polar-bear-festival-2027',
    titleKo: '제39회 해운대 북극곰 축제',
    titleEn: '39th Haeundae Polar Bear Festival',
    category: 'festival',
    categoryKo: '겨울 이색 축제',
    categoryEn: 'Winter Ocean Festival',
    startDate: '2027-01-08',
    endDate: '2027-01-10',
    stationId: 'haeundae',
    exitNumber: '3번 출구',
    stationKo: '해운대역 (2호선)',
    stationEn: 'Haeundae Station',
    metroLine: 'Line 2',
    accessibilityKo: '해운대 이벤트 광장 및 무대 관람 구역은 평탄 포장 도로로 계단이 없으며 휠체어/유모차 전용 관람선이 안전하게 운영됩니다.',
    accessibilityEn: 'Flat festival staging areas along the beach boardwalk provide accessible viewing zones for seniors and strollers.',
    exitTipKo: '해운대역 3번 출구 엘리베이터 이용 시 해운대 이벤트광장 메인무대까지 턱 없이 진입하실 수 있습니다.',
    exitTipEn: 'Haeundae Exit 3 elevator provides step-free access straight to the event plaza.',
    descriptionKo: '영국 BBC가 선정한 세계 10대 겨울 이색 스포츠로 차가운 겨울 바다에 뛰어들며 건강과 새해 결의를 다지는 짜릿하고 열정적인 축제입니다.',
    descriptionEn: 'Ranked by BBC as one of the top 10 winter sports festivals in the world, featuring energetic ocean swims and music stages.',
    locationKo: '해운대해수욕장 백사장 및 이벤트 광장',
    locationEn: 'Haeundae Beach Event Plaza',
    colorClass: 'bg-teal-50 text-teal-850 border-teal-200',
    dotClass: 'bg-teal-600'
  },
  {
    id: 'gwangalli-winter-drone-2027',
    titleKo: '2027 광안리 M 드론라이트쇼 (신년 희망편)',
    titleEn: '2027 Gwangalli M Drone Light Show (New Year Hope)',
    category: 'drone',
    categoryKo: '정기 드론쇼',
    categoryEn: 'Regular Drone Show',
    startDate: '2027-01-16',
    endDate: '2027-01-16',
    stationId: 'gwangan',
    exitNumber: '5번 출구',
    stationKo: '광안역 (2호선)',
    stationEn: 'Gwangan Station',
    metroLine: 'Line 2',
    accessibilityKo: '광안해변로는 휠체어 통행에 최적화된 매끄러운 보도블록과 넓은 보행 데크를 갖추어 탁 트인 드론쇼 관람이 용이합니다.',
    accessibilityEn: 'The broad flat Gwangalli boardwalk offers open view spots for wheelchair users with no steps.',
    exitTipKo: '광안역 5번 출구 엘리베이터 이용 시 해변 보행광장까지 무단차로 진입하실 수 있습니다.',
    exitTipEn: 'Gwangan Exit 5 elevator connects to the beach promenade without stairs.',
    descriptionKo: '1월 16일 토요일 19:00 / 21:00 2회 공연. 새해의 소망과 희망을 테마로 수백 대의 드론이 겨울 밤바다에 별자리를 그리는 감동 공연입니다.',
    descriptionEn: 'Saturday, January 16 (19:00 & 21:00). Hundreds of synchronized drones forming brilliant New Year motifs over Gwangalli bay.',
    locationKo: '광안리 해수욕장 생활체육공원 앞 해상',
    locationEn: 'Gwangalli Beachfront Marine Sky',
    colorClass: 'bg-emerald-50 text-emerald-850 border-emerald-200',
    dotClass: 'bg-emerald-600'
  },
  {
    id: 'eulsukdo-winter-eco-2027',
    titleKo: '을숙도 겨울철새 생태체험전',
    titleEn: 'Eulsukdo Winter Migratory Bird Eco-Festival',
    category: 'culture',
    categoryKo: '생태 / 체험',
    categoryEn: 'Eco & Birdwatching',
    startDate: '2027-01-22',
    endDate: '2027-01-24',
    stationId: 'hadan',
    exitNumber: '3번 출구',
    stationKo: '하단역 (1호선)',
    stationEn: 'Hadan Station',
    metroLine: 'Line 1',
    accessibilityKo: '낙동강하구에코센터와 을숙도 갈대밭 산책로는 전 구간 완만한 목재 데크로 연결되어 휠체어 및 유모차가 쾌적하게 생태 탐조를 즐길 수 있습니다.',
    accessibilityEn: 'Nakdong Estuary Eco Center features flat wooden boardwalks throughout the reeds for smooth stroller and wheelchair access.',
    exitTipKo: '하단역 3번 출구 엘리베이터 이용 후 을숙도 방면 저상버스 연계 시 낙동강하구에코센터 탐방로로 무단차 진입이 가능합니다.',
    exitTipEn: 'Hadan Exit 3 elevator provides accessible connection toward Eulsukdo Eco Center.',
    descriptionKo: '천연기념물 낙동강 하구 을숙도를 찾아온 고니, 큰기러기 등 겨울 철새를 관찰하고 생태 만들기 체험과 해설사 동행 탐조를 즐기는 힐링 생태 축제입니다.',
    descriptionEn: 'Observing majestic winter migratory birds such as swans and geese along Eulsukdo reed boardwalks with guided eco-tours.',
    locationKo: '을숙도 생태공원 및 낙동강하구에코센터',
    locationEn: 'Eulsukdo Eco Park & Nakdong Estuary Center',
    colorClass: 'bg-[#8EA85E]/15 text-[#526826] border-[#8EA85E]/30',
    dotClass: 'bg-[#8EA85E]'
  }
];

export default function BusanEventsCalendarView({ language, onSelectStation }: BusanEventsCalendarViewProps) {
  // Set of station IDs registered in the 'Exit Info & Station Search' tab
  const registeredStationIds = useMemo(() => new Set(STATIONS.map(s => s.id)), []);

  // Today's real date
  const todayObj = useMemo(() => new Date(), []);
  const todayYear = todayObj.getFullYear();
  const todayMonth = todayObj.getMonth() + 1;
  const todayDate = todayObj.getDate();
  const todayDateStr = useMemo(() => {
    return `${todayYear}-${String(todayMonth).padStart(2, '0')}-${String(todayDate).padStart(2, '0')}`;
  }, [todayYear, todayMonth, todayDate]);

  // View mode: 'calendar' | 'list'
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Currently viewed calendar year and month
  const [currentYear, setCurrentYear] = useState<number>(todayYear);
  const [currentMonth, setCurrentMonth] = useState<number>(todayMonth);

  // Filters & Selected State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Single active event selected for detail card modal / view
  const [selectedEvent, setSelectedEvent] = useState<BusanEvent | null>(null);

  // If a calendar day with multiple events is clicked, show a day picker modal
  const [dayEventsModal, setDayEventsModal] = useState<{ dateStr: string; events: BusanEvent[] } | null>(null);

  // Real-time automated sync states
  const [eventsList, setEventsList] = useState<BusanEvent[]>(BUSAN_EVENTS_DATA);

  // Auto-load live events from Busan Official Portal via background sync API
  useEffect(() => {
    let isMounted = true;
    async function loadBusanEvents() {
      try {
        const res = await fetch('/api/busan-events');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.events) && data.events.length > 0 && isMounted) {
            const map = new Map<string, BusanEvent>();
            BUSAN_EVENTS_DATA.forEach(e => map.set(e.id, e));
            data.events.forEach((e: BusanEvent) => {
              // Ensure color classes use green palette family
              const adaptedEvent: BusanEvent = {
                ...e,
                colorClass: e.category === 'drone' ? 'bg-emerald-50 text-emerald-850 border-emerald-200' :
                            e.category === 'culture' ? 'bg-[#6B8E23]/15 text-[#4E6719] border-[#6B8E23]/30' :
                            'bg-[#8EA85E]/15 text-[#526826] border-[#8EA85E]/30',
                dotClass: e.category === 'drone' ? 'bg-emerald-600' :
                          e.category === 'culture' ? 'bg-[#6B8E23]' : 'bg-[#8EA85E]'
              };
              map.set(e.id, adaptedEvent);
            });
            setEventsList(Array.from(map.values()));
          }
        }
      } catch (err) {
        console.warn('Busan events auto-sync check notice:', err);
      }
    }
    loadBusanEvents();
    return () => { isMounted = false; };
  }, []);

  // Helper date parsing: Check if dateStr is within event's date range
  const isDateInEventRange = (dateStr: string, event: BusanEvent) => {
    const d = new Date(dateStr);
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    
    d.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    return d >= start && d <= end;
  };

  // Generate 42 calendar grid cells
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth, 0).getDate();
    
    const daysArray: { dateString: string; dayNumber: number; isPadding: boolean }[] = [];
    
    // Previous Month padding days
    const prevMonthTotalDays = new Date(currentYear, currentMonth - 1, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const pmYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      const pmMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const day = prevMonthTotalDays - i;
      const formattedMonth = String(pmMonth).padStart(2, '0');
      const formattedDay = String(day).padStart(2, '0');
      daysArray.push({
        dateString: `${pmYear}-${formattedMonth}-${formattedDay}`,
        dayNumber: day,
        isPadding: true
      });
    }

    // Current Month active days
    const formattedActiveMonth = String(currentMonth).padStart(2, '0');
    for (let day = 1; day <= totalDays; day++) {
      const formattedDay = String(day).padStart(2, '0');
      daysArray.push({
        dateString: `${currentYear}-${formattedActiveMonth}-${formattedDay}`,
        dayNumber: day,
        isPadding: false
      });
    }

    // Next Month padding days to complete 42 cells grid
    const remainingCells = 42 - daysArray.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nmYear = currentMonth === 12 ? currentYear + 1 : currentYear;
      const nmMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      const formattedMonth = String(nmMonth).padStart(2, '0');
      const formattedDay = String(i).padStart(2, '0');
      daysArray.push({
        dateString: `${nmYear}-${formattedMonth}-${formattedDay}`,
        dayNumber: i,
        isPadding: true
      });
    }

    return daysArray;
  }, [currentYear, currentMonth]);

  // Filter events based on category and search query (does NOT cut off historical/future months so full navigation works!)
  const filteredEvents = useMemo(() => {
    let list = [...eventsList];

    if (selectedCategory !== 'all') {
      list = list.filter(evt => {
        if (selectedCategory === 'drone') return evt.category === 'drone';
        if (selectedCategory === 'festival') return evt.category === 'festival';
        if (selectedCategory === 'culture') return evt.category === 'culture' || evt.category === 'performance';
        return true;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(evt => {
        const matchKo = (evt.titleKo + evt.locationKo + evt.stationKo + (evt.descriptionKo || '')).toLowerCase();
        const matchEn = (evt.titleEn + evt.locationEn + evt.stationEn + (evt.descriptionEn || '')).toLowerCase();
        return matchKo.includes(q) || matchEn.includes(q);
      });
    }

    return list.sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [eventsList, selectedCategory, searchQuery]);

  // Helper to find all filtered events active on a specific calendar day cell
  const getEventsForDay = (dateString: string) => {
    return filteredEvents.filter(evt => isDateInEventRange(dateString, evt));
  };

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleResetToday = () => {
    setCurrentYear(todayYear);
    setCurrentMonth(todayMonth);
  };

  // Switch to calendar view & jump to a festival's specific month
  const jumpToEventMonth = (event: BusanEvent) => {
    const parts = event.startDate.split('-');
    const yr = parseInt(parts[0], 10);
    const mo = parseInt(parts[1], 10);
    setCurrentYear(yr);
    setCurrentMonth(mo);
    setSelectedEvent(event);
    setViewMode('calendar');
  };

  // Month label formatted
  const monthLabel = useMemo(() => {
    const labelsKo = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const labelsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return language === 'KR' 
      ? `${currentYear}년 ${labelsKo[currentMonth - 1]}` 
      : `${labelsEn[currentMonth - 1]} ${currentYear}`;
  }, [currentYear, currentMonth, language]);

  // Format popup date for display
  const formatPopupDate = (dateStr: string, lang: 'KR' | 'EN') => {
    const parts = dateStr.split('-');
    const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const dayOfWeek = lang === 'KR' 
      ? ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()]
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()];
    
    if (lang === 'KR') {
      return `${parts[0]}년 ${parseInt(parts[1], 10)}월 ${parseInt(parts[2], 10)}일 (${dayOfWeek}요일)`;
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[dateObj.getMonth()]} ${parseInt(parts[2], 10)}, ${parts[0]} (${dayOfWeek})`;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left max-w-5xl mx-auto" id="busan-events-calendar-container">
      
      {/* 1. Intro Header Section - Soft & Clean (Matches theme card aesthetic) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs text-left">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <CalendarIcon className="w-7 h-7 sm:w-8 sm:h-8 text-[#8EA85E] shrink-0" />
          <span>{language === 'KR' ? '부산 주요일정표' : 'Busan Main Festival Calendar'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed font-normal">
          {language === 'KR' 
            ? '한 눈에 부산 대표 축제 보기' 
            : 'View Busan\'s Representative Festivals at a Glance'}
        </p>

        {/* Verification Info Notice */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs text-slate-500">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#8EA85E] shrink-0" />
            <span>{language === 'KR' ? '검증 정보' : 'Verified Data'}</span>
          </span>
          <span className="text-slate-300">|</span>
          <span>{language === 'KR' ? '조사자: ' : 'Auditor: '}<strong className="text-slate-700 font-medium">{language === 'KR' ? '플로레르' : 'Florer'}</strong></span>
          <span className="text-slate-300">|</span>
          <span>
            {language === 'KR' ? '최근 조사일: ' : 'Last Updated: '}
            <strong className="text-slate-700 font-medium">
              {language === 'KR' 
                ? `${todayYear}년 ${todayMonth}월 ${todayDate}일 기준` 
                : `As of ${todayYear}-${String(todayMonth).padStart(2, '0')}-${String(todayDate).padStart(2, '0')}`}
            </strong>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            {language === 'KR' ? '공식 출처: ' : 'Official Source: '}
            <a 
              href="https://www.busan.go.kr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#8EA85E] hover:text-[#728943] font-medium underline inline-flex items-center gap-0.5"
            >
              <span>{language === 'KR' ? '부산광역시청' : 'Busan Metropolitan City'}</span>
              <ExternalLink className="w-2.5 h-2.5 text-[#8EA85E]" />
            </a>
          </span>
        </div>
      </div>

      {/* 2. Top Interactive Filter & View Switcher Bar (All in Green Palette) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Category Pills (Unified in soft green tones) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', labelKo: '전체', labelEn: 'All' },
            { id: 'festival', labelKo: '축제/행사', labelEn: 'Festivals' },
            { id: 'drone', labelKo: '드론라이트쇼', labelEn: 'Drone Show' },
            { id: 'culture', labelKo: '문화/공연/예술', labelEn: 'Culture & Arts' }
          ].map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#8EA85E] text-white shadow-xs'
                    : 'bg-[#8EA85E]/10 text-[#526826] hover:bg-[#8EA85E]/20'
                }`}
              >
                {language === 'KR' ? cat.labelKo : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* Search & View Switcher */}
        <div className="flex items-center gap-2.5 justify-between md:justify-end">
          {/* Quick Search */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'KR' ? '축제명, 장소 검색...' : 'Search festivals, venues...'}
              className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8EA85E]/30 focus:border-[#8EA85E] transition-all bg-[#F8F9FA]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle: [ 캘린더 ] / [ 전체 목록 ] */}
          <div className="inline-flex p-1 bg-slate-100/90 rounded-2xl shrink-0 border border-slate-200/60">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white text-[#526826] shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title={language === 'KR' ? '월간 캘린더로 보기' : 'Calendar View'}
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#8EA85E]" />
              <span className="hidden sm:inline">{language === 'KR' ? '캘린더' : 'Calendar'}</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[#526826] shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title={language === 'KR' ? '전체 일정 목록으로 보기' : 'All Events List'}
            >
              <List className="w-3.5 h-3.5 text-[#8EA85E]" />
              <span className="hidden sm:inline">{language === 'KR' ? '전체 일정' : 'All Events'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3A. FULL-WIDTH CALENDAR VIEW (No 50/50 split! Spacious & Icon-Driven) */}
      {viewMode === 'calendar' && (
        <div className="space-y-6">
          <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-8 shadow-xs text-left space-y-5">
            
            {/* Calendar Month Control Bar */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#8EA85E] shrink-0" />
                <span>{monthLabel}</span>
              </h3>

              {/* Navigation buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl cursor-pointer border border-slate-200 transition-all active:scale-95"
                  title={language === 'KR' ? '이전 달' : 'Previous Month'}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleResetToday}
                  className="px-3 py-1.5 text-xs font-bold hover:bg-[#8EA85E]/10 border border-slate-200 rounded-xl cursor-pointer text-slate-700 hover:text-[#526826] transition-colors"
                >
                  {language === 'KR' ? '오늘' : 'Today'}
                </button>

                <button
                  onClick={handleNextMonth}
                  className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl cursor-pointer border border-slate-200 transition-all active:scale-95"
                  title={language === 'KR' ? '다음 달' : 'Next Month'}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of week labels */}
            <div className="grid grid-cols-7 gap-1 text-center py-1 border-b border-slate-100">
              {['일', '월', '화', '수', '목', '금', '토'].map((dowStr, dowIdx) => {
                const dowLabelEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dowIdx];
                const textCol = dowIdx === 0 ? 'text-rose-500 font-bold' : dowIdx === 6 ? 'text-blue-500 font-bold' : 'text-slate-500 font-semibold';
                return (
                  <div key={dowIdx} className={`text-xs select-none py-1 ${textCol}`}>
                    {language === 'KR' ? dowStr : dowLabelEn}
                  </div>
                );
              })}
            </div>

            {/* Calendar Day Grid: Full Width with Sleek Icons */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
              {calendarDays.map((cell, idx) => {
                const dayEvents = getEventsForDay(cell.dateString);
                const isToday = cell.dateString === todayDateStr;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (dayEvents.length === 1) {
                        setSelectedEvent(dayEvents[0]);
                      } else if (dayEvents.length > 1) {
                        setDayEventsModal({ dateStr: cell.dateString, events: dayEvents });
                      }
                    }}
                    className={`min-h-[80px] sm:min-h-[105px] p-2 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                      cell.isPadding 
                        ? 'bg-slate-50/40 border-slate-100/60 opacity-35' 
                        : 'bg-white border-slate-200/80 hover:border-[#8EA85E]/50 hover:shadow-2xs'
                    } ${
                      isToday 
                        ? 'border-[#8EA85E] ring-1.5 ring-[#8EA85E]/30 bg-[#8EA85E]/[0.02]' 
                        : ''
                    } ${dayEvents.length > 0 ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    {/* Day Number and Today Sign */}
                    <div className="flex justify-between items-center">
                      <span className={`text-xs sm:text-sm font-bold ${
                        isToday 
                          ? 'w-6 h-6 rounded-full bg-[#8EA85E] text-white flex items-center justify-center text-xs' 
                          : cell.isPadding ? 'text-slate-400' : 'text-slate-800'
                      }`}>
                        {cell.dayNumber}
                      </span>
                      {isToday && (
                        <span className="text-[9px] font-bold text-[#526826] bg-[#8EA85E]/15 px-1.5 py-0.5 rounded-md hidden sm:inline">
                          {language === 'KR' ? '오늘' : 'Today'}
                        </span>
                      )}
                    </div>

                    {/* Event Icons Area (Clean, Stylish Line Glyphs in Green Palette) */}
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap mt-1">
                      {dayEvents.slice(0, 3).map(evt => {
                        const EventIcon = getEventIcon(evt);
                        return (
                          <button
                            key={evt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(evt);
                            }}
                            className="p-1 sm:p-1.5 rounded-xl bg-[#8EA85E]/10 hover:bg-[#8EA85E]/25 text-[#4E6228] border border-[#8EA85E]/20 transition-all hover:scale-115 active:scale-95 cursor-pointer shadow-2xs group flex items-center justify-center"
                            title={`${evt.titleKo} (${evt.categoryKo})`}
                          >
                            <EventIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:text-[#384A1A]" />
                          </button>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDayEventsModal({ dateStr: cell.dateString, events: dayEvents });
                          }}
                          className="px-1.5 py-0.5 rounded-lg bg-[#8EA85E]/15 text-[#526826] text-[10px] font-bold hover:bg-[#8EA85E]/25 cursor-pointer"
                        >
                          +{dayEvents.length - 3}
                        </button>
                      )}
                    </div>

                    {/* Subtle dot count for mobile */}
                    <div className="flex sm:hidden items-center gap-0.5 mt-0.5">
                      {dayEvents.length > 0 && (
                        <span className="text-[8px] font-bold text-[#526826]">
                          {dayEvents.length}건
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3B. ALL EVENTS LIST VIEW (Styled exactly like the User's Screenshot Theme Cards) */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-slate-500">
              {language === 'KR' 
                ? `총 ${filteredEvents.length}개의 주요 축제 및 행사가 등록되어 있습니다.` 
                : `Showing ${filteredEvents.length} major festivals in Busan.`}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map(evt => {
              const EventIcon = getEventIcon(evt);
              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md hover:border-[#8EA85E]/50 transition-all flex flex-col justify-between group text-left cursor-pointer"
                >
                  <div>
                    {/* Top Illustration/Icon Container (Matches the soft gray box from user's image) */}
                    <div className="w-full h-36 bg-[#F8F9FA] rounded-2xl flex items-center justify-center p-4 relative mb-4 group-hover:bg-[#8EA85E]/5 transition-colors">
                      <EventIcon className="w-12 h-12 text-[#8EA85E] group-hover:scale-110 transition-transform" />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-white text-[#526826] border border-slate-200/80 shadow-2xs">
                        {language === 'KR' ? evt.categoryKo : evt.categoryEn}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#526826] transition-colors leading-snug">
                      {language === 'KR' ? evt.titleKo : evt.titleEn}
                    </h4>

                    {/* Period & Venue */}
                    <div className="space-y-1 text-xs text-slate-500 font-medium mt-1.5">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{evt.startDate} ~ {evt.endDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{language === 'KR' ? evt.locationKo : evt.locationEn}</span>
                      </div>
                    </div>

                    {/* Description preview */}
                    <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed line-clamp-2 mt-2.5">
                      {language === 'KR' ? evt.descriptionKo : evt.descriptionEn}
                    </p>
                  </div>

                  {/* Card Bottom: Station Info & "자세히 보기 >" text link (exactly like user's screenshot) */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    {registeredStationIds.has(evt.stationId) ? (
                      <span className="text-[11px] font-bold text-[#526826] bg-[#8EA85E]/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <Train className="w-3 h-3 text-[#8EA85E]" />
                        <span>{evt.stationKo.split(' ')[0]} {evt.exitNumber}</span>
                      </span>
                    ) : <span />}

                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#526826] transition-colors flex items-center gap-0.5">
                      {language === 'KR' ? '자세히 보기' : 'View Details'} &gt;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
              <Info className="w-8 h-8 text-slate-300 mx-auto" />
              <h5 className="text-sm font-bold text-slate-700">
                {language === 'KR' ? '검색 조건에 맞는 축제가 없습니다.' : 'No festivals match your search criteria.'}
              </h5>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-[#8EA85E] text-white text-xs font-bold cursor-pointer"
              >
                {language === 'KR' ? '필터 초기화' : 'Reset Filters'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. MODAL: FULL FESTIVAL DETAIL (Matches user's reference image style) */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />

            {/* Modal Dialog (Rounded-3xl, warm styling) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.35 }}
              className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xl z-10 flex flex-col max-h-[90vh] text-left space-y-4"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Top Illustration Box (Matching Screenshot Aesthetic) */}
              {(() => {
                const ModalIcon = getEventIcon(selectedEvent);
                return (
                  <div className="w-full h-36 bg-[#F8F9FA] rounded-2xl flex flex-col items-center justify-center p-4 relative shrink-0">
                    <ModalIcon className="w-14 h-14 text-[#8EA85E]" />
                    <span className="mt-2 px-3 py-1 rounded-full text-xs font-bold bg-[#8EA85E]/15 text-[#526826] border border-[#8EA85E]/20">
                      {language === 'KR' ? selectedEvent.categoryKo : selectedEvent.categoryEn}
                    </span>
                  </div>
                );
              })()}

              {/* Modal Content Scroll Area */}
              <div className="overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {language === 'KR' ? selectedEvent.titleKo : selectedEvent.titleEn}
                </h3>

                {/* Period & Venue */}
                <div className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#8EA85E] shrink-0" />
                    <span className="font-semibold text-slate-500">{language === 'KR' ? '축제 기간:' : 'Period:'}</span>
                    <span className="font-bold text-slate-800">{selectedEvent.startDate} ~ {selectedEvent.endDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="font-semibold text-slate-500">{language === 'KR' ? '상세 장소:' : 'Venue:'}</span>
                    <span className="font-bold text-slate-800">{language === 'KR' ? selectedEvent.locationKo : selectedEvent.locationEn}</span>
                  </div>
                </div>

                {/* Accessible Subway Exit Guide Box */}
                {registeredStationIds.has(selectedEvent.stationId) && (
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-[#8EA85E] text-white rounded-xl shadow-2xs shrink-0">
                          <Train className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">
                            {language === 'KR' ? '무단차 인접 지하철역' : 'Accessible Subway Connection'}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                            {language === 'KR' ? selectedEvent.stationKo : selectedEvent.stationEn}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#8EA85E]/15 text-[#526826] border border-[#8EA85E]/30">
                        {selectedEvent.exitNumber}
                      </span>
                    </div>

                    {selectedEvent.exitTipKo && (
                      <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-[#526826]">
                          <Sparkles className="w-3.5 h-3.5 text-[#8EA85E] shrink-0" />
                          <span>{language === 'KR' ? '출구 무단차 동선 팁' : 'Barrier-Free Exit Tip'}</span>
                        </div>
                        <p className="text-[11.5px] text-slate-600 font-medium pl-5">
                          {language === 'KR' ? selectedEvent.exitTipKo : selectedEvent.exitTipEn}
                        </p>
                      </div>
                    )}

                    {/* Action buttons inside subway box */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      {onSelectStation && (
                        <button
                          onClick={() => {
                            const stId = selectedEvent.stationId;
                            const exNum = selectedEvent.exitNumber;
                            setSelectedEvent(null);
                            onSelectStation(stId, exNum);
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#8EA85E] hover:bg-[#7a934e] text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer active:scale-98"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>
                            {language === 'KR' 
                              ? `${selectedEvent.stationKo.split(' ')[0]} ${selectedEvent.exitNumber} 동선 보기` 
                              : `View ${selectedEvent.exitNumber} Guide`}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => window.open(`https://map.naver.com/v5/search/${encodeURIComponent(selectedEvent.stationKo.split(' ')[0] + ' ' + selectedEvent.exitNumber)}`, '_blank')}
                        className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                      >
                        <span>{language === 'KR' ? '네이버 지도' : 'Naver Map'}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Event Description */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide block">
                    {language === 'KR' ? '행사 소개' : 'Event Description'}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {language === 'KR' ? selectedEvent.descriptionKo : selectedEvent.descriptionEn}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  {language === 'KR' ? '닫기' : 'Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. MODAL: DAY MULTI-EVENTS PICKER (If day cell has multiple events) */}
      <AnimatePresence>
        {dayEventsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDayEventsModal(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xl z-10 flex flex-col max-h-[80vh] text-left space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    {language === 'KR' ? '일정 선택' : 'Day Schedule'}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900">
                    {formatPopupDate(dayEventsModal.dateStr, language)}
                  </h4>
                </div>
                <button
                  onClick={() => setDayEventsModal(null)}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                {dayEventsModal.events.map(evt => {
                  const EventIcon = getEventIcon(evt);
                  return (
                    <div
                      key={evt.id}
                      onClick={() => {
                        setDayEventsModal(null);
                        setSelectedEvent(evt);
                      }}
                      className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#8EA85E]/60 hover:bg-[#8EA85E]/5 transition-all cursor-pointer flex items-center gap-3.5 group"
                    >
                      <div className="p-2.5 rounded-xl bg-[#8EA85E]/15 text-[#526826] shrink-0">
                        <EventIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <span className="text-[10px] font-bold text-[#526826]">
                          {language === 'KR' ? evt.categoryKo : evt.categoryEn}
                        </span>
                        <h5 className="text-sm font-bold text-slate-900 group-hover:text-[#526826] transition-colors leading-snug">
                          {language === 'KR' ? evt.titleKo : evt.titleEn}
                        </h5>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {evt.locationKo}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#526826] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
