/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Updated: 2026-08 August Busan Events & Calendar
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
  Compass
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
  stationId: string; // station ID matching STATIONS (e.g., 'dadaepo', 'centum', 'busan', 'gwangan', 'sasang', 'jagalchi')
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

// Curated Busan Events Data (Active & Upcoming as of August 2026)
const BUSAN_EVENTS_DATA: BusanEvent[] = [
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
    colorClass: 'bg-sky-50 text-sky-850 border-sky-100',
    dotClass: 'bg-sky-500'
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
    colorClass: 'bg-amber-50 text-amber-850 border-amber-100',
    dotClass: 'bg-amber-500'
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
    colorClass: 'bg-indigo-50 text-indigo-850 border-indigo-100',
    dotClass: 'bg-indigo-500'
  },
  {
    id: 'dadaepo-sunset-movie-festival-2026',
    titleKo: '다대포 선셋 영화축제',
    titleEn: 'Dadaepo Sunset Movie Festival',
    category: 'performance',
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
    descriptionKo: '13:00~22:00 운영 (*부산 바다축제와 연계). 붉게 물드는 다대포 노을을 배경으로 야외 영화 상영, 감독/배우 토크쇼, 노을 버스킹이 함께하는 로맨틱 영화제입니다.',
    descriptionEn: 'Operating 13:00~22:00 in connection with Busan Sea Festival. Outdoor cinema, director talk shows, and sunset acoustics set against Dadaepo\'s famous golden sunset.',
    locationKo: '다대포해수욕장 일원',
    locationEn: 'Dadaepo Beachfront Area',
    colorClass: 'bg-rose-50 text-rose-850 border-rose-100',
    dotClass: 'bg-rose-500'
  },
  {
    id: 'night-sup-festival-2026',
    titleKo: '2026 광안리 나이트 SUP & 해양레저 축제',
    titleEn: '2026 Gwangalli Night SUP & Marine Leisure Festival',
    category: 'festival',
    categoryKo: '해양 레저',
    categoryEn: 'Marine Sports',
    startDate: '2026-08-07',
    endDate: '2026-08-09',
    stationId: 'gwangan',
    exitNumber: '5번 출구',
    stationKo: '광안역 / 금련산역 (2호선)',
    stationEn: 'Gwangan / Geumnyeonsan Station',
    metroLine: 'Line 2',
    accessibilityKo: '광안리 해변 데크 통로 및 평탄 수변 공원에 무단차 관람 보도블록이 완비되어 휠체어 및 유모차로 안심 관람이 가능합니다.',
    accessibilityEn: 'Gwangalli seaside deck and flat waterfront park walkways provide smooth, barrier-free viewing locations.',
    exitTipKo: '광안역 5번 출구 배리어프리 엘리베이터 이용 후 광안리 해변 방면으로 완만한 평탄 보도를 따라 진입할 수 있습니다.',
    exitTipEn: 'Gwangan Station Exit 5 elevator leads to smooth level sidewalks heading straight to Gwangalli Beach.',
    descriptionKo: 'LED 조명을 밝힌 패들보드(SUP)와 윈드서핑이 광안대교 야경을 배경으로 수놓는 이색 해양 스포츠 축제 및 수변 라이브 버스킹 무대입니다.',
    descriptionEn: 'Unique night marine sports festival featuring LED paddleboards (SUP) and windsurfing against the backdrop of Gwangandaegyo Bridge.',
    locationKo: '광안리 해수욕장 및 수변 스탠드',
    locationEn: 'Gwangalli Beachfront & Marine Park',
    colorClass: 'bg-cyan-50 text-cyan-850 border-cyan-100',
    dotClass: 'bg-cyan-500'
  },
  {
    id: 'drone-show-aug-08',
    titleKo: '「광안리 M 드론라이트쇼」 한여름 밤의 클래식',
    titleEn: 'Gwangalli M Drone Light Show (Midsummer Night Classic)',
    category: 'drone',
    categoryKo: '드론 연출',
    categoryEn: 'Drone Exhibition',
    startDate: '2026-08-08',
    endDate: '2026-08-08',
    stationId: 'gwangan',
    exitNumber: '5번 출구',
    stationKo: '광안역 (2호선)',
    stationEn: 'Gwangan Station',
    metroLine: 'Line 2',
    accessibilityKo: '광안해변 테마거리는 보행 장애물이 없는 완전 평탄 보도블록으로 구성되어 휠체어/유모차 전 구역 진입이 자유롭습니다.',
    accessibilityEn: 'The spacious Gwangalli Beach esplanade is paved with continuous non-slip flat bricks, allowing wheels and strollers to claim spectacular view spots easily.',
    exitTipKo: '광안역 5번 출구 엘리베이터 이용 시 광안해변 테마거리 드론 관람구역까지 무단차 수평 연결됩니다.',
    exitTipEn: 'Gwangan Exit 5 elevator provides step-free access to Gwangalli Beach drone view points.',
    descriptionKo: '8월 8일 토요일 (20:00 / 22:00 2회 공연) 진행. 클래식 명곡의 웅장한 선율에 맞춰 조율되는 빛의 오케스트라 퍼포먼스입니다.',
    descriptionEn: 'Saturday, August 8 (Two flights: 20:00 & 22:00). Light orchestra performance synchronized with grand classical music melodies.',
    locationKo: '광안리 해수욕장 생활체육공원 앞 해상',
    locationEn: 'Gwangalli Beachfront Esplanade',
    colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    dotClass: 'bg-emerald-500'
  },
  {
    id: 'craft-beer-festival-2026',
    titleKo: '2026 부산 수제맥주 페스티벌',
    titleEn: '2026 Busan Craft Beer Festival',
    category: 'festival',
    categoryKo: '수제맥주 / 푸드',
    categoryEn: 'Craft Beer & Food',
    startDate: '2026-08-13',
    endDate: '2026-08-17',
    stationId: 'bexco',
    exitNumber: '7번 출구',
    stationKo: '벡스코역 (2호선/동해선)',
    stationEn: 'BEXCO Station',
    metroLine: 'Line 2 / Donghae',
    accessibilityKo: '벡스코 야외광장은 단차가 전혀 없는 완벽한 평탄 우레탄 바닥으로, 휠체어와 유모차가 야외 테이블 및 부스를 수월하게 이용할 수 있습니다.',
    accessibilityEn: 'The outdoor BEXCO plaza is paved completely flat, accommodating wheelchair users and stroller families with dedicated open tables.',
    exitTipKo: '벡스코역 7번 출구 엘리베이터를 통해 지상 벡스코 야외광장 축제 무대로 턱 없이 직결됩니다.',
    exitTipEn: 'BEXCO Station Exit 7 elevator connects directly to BEXCO Outdoor Beer Festival Plaza.',
    descriptionKo: '전국 유명 수제맥주 브루어리와 부산 대표 맛집 푸드트럭, 시원한 야외 라이브 버스킹 공연이 어우러지는 한여름 밤 야외 맥주 축제입니다.',
    descriptionEn: 'A midsummer outdoor beer festival combining renowned Korean craft breweries, gourmet food trucks, and live acoustic music under the stars.',
    locationKo: '벡스코 (BEXCO) 야외광장',
    locationEn: 'BEXCO Outdoor Plaza, Centum City',
    colorClass: 'bg-amber-50 text-amber-850 border-amber-100',
    dotClass: 'bg-amber-500'
  },
  {
    id: 'drone-show-aug-15',
    titleKo: '「광안리 M 드론라이트쇼」 빛나는 광복의 밤',
    titleEn: 'Gwangalli M Drone Light Show (Shining Liberation Night)',
    category: 'drone',
    categoryKo: '드론 연출',
    categoryEn: 'Drone Exhibition',
    startDate: '2026-08-15',
    endDate: '2026-08-15',
    stationId: 'gwangan',
    exitNumber: '5번 출구',
    stationKo: '광안역 (2호선)',
    stationEn: 'Gwangan Station',
    metroLine: 'Line 2',
    accessibilityKo: '광안해변 테마거리는 보행 장애물이 없는 완전 평탄 보도블록으로 구성되어 휠체어/유모차 전 구역 진입이 자유롭습니다.',
    accessibilityEn: 'The spacious Gwangalli Beach esplanade is paved with continuous non-slip flat bricks, allowing wheels and strollers to claim spectacular view spots easily.',
    exitTipKo: '광안역 5번 출구 엘리베이터 이용 후 광안해변 테마거리 관람 구역까지 무단차 평탄 보도로 진입하실 수 있습니다.',
    exitTipEn: 'Gwangan Exit 5 elevator provides direct level access to Gwangalli Beach promenade.',
    descriptionKo: '8월 15일 토요일 (20:00 / 22:00 2회 공연) 진행. 광복절 81주년을 기념하여 태극기와 빛의 서사시를 드론 아트워크로 연출하는 특별 라이트쇼입니다.',
    descriptionEn: 'Saturday, August 15 (Two flights: 20:00 & 22:00). Special Liberation Day commemorative light show featuring Taegeukgi flag patterns.',
    locationKo: '광안리 해수욕장 생활체육공원 앞 해상',
    locationEn: 'Gwangalli Beachfront Esplanade',
    colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    dotClass: 'bg-emerald-500'
  },
  {
    id: 'comedy-festival-2026',
    titleKo: '제14회 부산 국제코미디페스티벌 (BICF)',
    titleEn: '14th Busan International Comedy Festival (BICF)',
    category: 'performance',
    categoryKo: '코미디 / 공연',
    categoryEn: 'Comedy & Performance',
    startDate: '2026-08-21',
    endDate: '2026-08-30',
    stationId: 'bexco',
    exitNumber: '7번 출구',
    stationKo: '벡스코역 (2호선/동해선)',
    stationEn: 'BEXCO Station',
    metroLine: 'Line 2 / Donghae',
    accessibilityKo: '영화의전당 및 주요 공연장은 휠체어 전용 관람석 및 수직 승강기, 전용 화장실이 완비되어 교통약자의 접근성이 매우 우수합니다.',
    accessibilityEn: 'Venues including Busan Cinema Center feature elevators and accessible seating zones for smooth mobility access.',
    exitTipKo: '벡스코역 7번 출구 이용 시 영화의전당 야외극장 및 실내 상영관으로 무단차 직결 진입이 가능합니다.',
    exitTipEn: 'BEXCO Exit 7 provides direct step-free entrance to Busan Cinema Center.',
    descriptionKo: '아시아 최초이자 최대의 국제 코미디 페스티벌로, 국내외 최정상 코미디언들의 웃음 폭탄 스탠드업 코미디, 마임, 넌버벌 퍼포먼스가 펼쳐집니다.',
    descriptionEn: 'Asia\'s largest comedy festival bringing top international comedians, stand-up, mime, and non-verbal shows to Busan.',
    locationKo: '영화의전당, 부산시민회관, 봉오리 아트홀 등',
    locationEn: 'Busan Cinema Center & Citizens\' Hall',
    colorClass: 'bg-purple-50 text-purple-850 border-purple-100',
    dotClass: 'bg-purple-500'
  },
  {
    id: 'drone-show-aug-22',
    titleKo: '「광안리 M 드론라이트쇼」 히어로즈 하모니',
    titleEn: 'Gwangalli M Drone Light Show (Heroes Harmony)',
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
    accessibilityKo: '광안해변 테마거리는 보행 장애물이 없는 완전 평탄 보도블록으로 구성되어 휠체어/유모차 전 구역 진입이 자유롭습니다.',
    accessibilityEn: 'The spacious Gwangalli Beach esplanade is paved with continuous non-slip flat bricks, allowing wheels and strollers to claim spectacular view spots easily.',
    exitTipKo: '광안역 5번 출구 엘리베이터 이용 시 휠체어/유모차 전용 관람구역으로 턱 없이 안전 이동이 가능합니다.',
    exitTipEn: 'Gwangan Exit 5 elevator leads smoothly to reserved stroller and wheelchair viewing zones.',
    descriptionKo: '8월 22일 토요일 (20:00 / 22:00 2회 공연) 진행. 신화 속 히어로와 현대 아이콘들이 결합된 역동적 시각 스펙터클 연출입니다.',
    descriptionEn: 'Saturday, August 22 (Two flights: 20:00 & 22:00). Dynamic spectacle merging mythical heroes and modern pop-culture icons.',
    locationKo: '광안리 해수욕장 생활체육공원 앞 해상',
    locationEn: 'Gwangalli Beachfront Esplanade',
    colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    dotClass: 'bg-emerald-500'
  },
  {
    id: 'drone-show-aug-29',
    titleKo: '「광안리 M 드론라이트쇼」 굿바이 썸머 나이트',
    titleEn: 'Gwangalli M Drone Light Show (Goodbye Summer Night)',
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
    accessibilityKo: '광안해변 테마거리는 보행 장애물이 없는 완전 평탄 보도블록으로 구성되어 휠체어/유모차 전 구역 진입이 자유롭습니다.',
    accessibilityEn: 'The spacious Gwangalli Beach esplanade is paved with continuous non-slip flat bricks, allowing wheels and strollers to claim spectacular view spots easily.',
    exitTipKo: '광안역 5번 출구 엘리베이터 이용 후 광안해변 보행광장으로 수평 무단차 이동이 가능합니다.',
    exitTipEn: 'Gwangan Exit 5 elevator connects to Gwangalli Beach esplanade without stairs.',
    descriptionKo: '8월 29일 토요일 (20:00 / 22:00 2회 공연) 진행. 여름의 마지막 밤을 아쉬워하며 가을의 서막을 여는 감성 드론 라이트쇼입니다.',
    descriptionEn: 'Saturday, August 29 (Two flights: 20:00 & 22:00). Emotional drone light performance saying farewell to summer and welcoming autumn.',
    locationKo: '광안리 해수욕장 생활체육공원 앞 해상',
    locationEn: 'Gwangalli Beachfront Esplanade',
    colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    dotClass: 'bg-emerald-500'
  },
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
    accessibilityEn: 'Set inside the grand Samrak Park. Massive industrial rubber mats are temporarily paved over the grass path logic to provide firm rollway safety.',
    exitTipKo: '사상역 3번 출구 또는 괘법르네시떼역 1번 출구 엘리베이터 보행교 이용 시 삼락생태공원 메인무대로 무단차 이동이 가능합니다.',
    exitTipEn: 'Sasang Exit 3 or Gwaebeop Renecite Exit 1 elevator bridge provides step-free access to Samrak Park.',
    descriptionKo: '대한민국 최장수 록 페스티벌로, 국내외 최정상급 록, 인디 뮤지션들이 거대하고 흥겨운 스테이지들을 가르고 야간 라이브 퍼포먼스를 펼칩니다.',
    descriptionEn: 'Korea\'s longest-running legendary rock festival with domestic and global rock icons, indie bands, and energetic outdoor stages.',
    locationKo: '삼락생태공원',
    locationEn: 'Samrak Ecological Park',
    colorClass: 'bg-indigo-50 text-indigo-850 border-indigo-100',
    dotClass: 'bg-indigo-600'
  },
  {
    id: 'biff-festival',
    titleKo: '부산국제영화제',
    titleEn: 'Busan International Film Festival (BIFF)',
    category: 'culture',
    categoryKo: '문화/예술',
    categoryEn: 'Culture & Arts',
    startDate: '2026-10-06',
    endDate: '2026-10-15',
    stationId: 'bexco',
    exitNumber: '7번 출구',
    stationKo: '벡스코역 (2호선/동해선)',
    stationEn: 'BEXCO Station',
    metroLine: 'Line 2 / Donghae',
    accessibilityKo: '세계적으로 인증받은 "영화의전당"은 보행 친화적 공간입니다. 전체 상영 전당에 점자 안내판, 단차 없는 엘리베이터, 자동문 및 휠체어 전용 상영 좌석이 내재되어 수준 높습니다.',
    accessibilityEn: 'The magnificent Cinema Center is fully certified step-free, featuring pristine elevators, wheelchair-only indoor theater rows, and digital helper pads.',
    exitTipKo: '벡스코역 7번 출구 이용 시 영화의전당까지 신호등과 계단 없이 평탄 보도로 연결됩니다.',
    exitTipEn: 'BEXCO Exit 7 offers a smooth 5-min flat walkway straight to Busan Cinema Center.',
    descriptionKo: '아시아 최고 권위의 국제 영화제로, 세계 각국의 엄선된 예술영화, 감독 전작 무비 상영 및 관객과의 대화(GV), 스타 야간 레드카펫 행사가 풍성하게 이어집니다.',
    descriptionEn: 'Asia\'s most prestigious films and red carpet spectacles. The Cinema Center is seamlessly connected to Centum City Subway Station via flat underpass paths.',
    locationKo: '영화의 전당 등',
    locationEn: 'Busan Cinema Center and Centum City Venues',
    colorClass: 'bg-rose-50 text-rose-850 border-rose-100',
    dotClass: 'bg-rose-600'
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
    accessibilityKo: '새롭게 개조된 현대식 자갈치 크루즈 빌딩 및 주 관람거리는 시원하고 넓게 포장된 바닥으로 계단이 없으며, 내부 상가 엘리베이터 및 편의 화장실이 준비되어 있습니다.',
    accessibilityEn: 'The modern Jagalchi Center building has step-free elevators and dedicated handicap companion restrooms. Market pathways are flat concrete.',
    exitTipKo: '자갈치역 10번 출구 이용 시 자갈치시장 신관 수변공간 및 크루즈선착장까지 수평 무단차 진입이 가능합니다.',
    exitTipEn: 'Jagalchi Exit 10 offers flat step-free access to Jagalchi Market coastal plaza.',
    descriptionKo: '"오이소, 보이소, 사이소!" 정겨운 사투리와 한국 수산업의 최대 집결지로 싱싱한 수산물 무료 시식, 수산물 맨손 잡기 행사, 유람선 탑승 등 활기가 넘칩니다.',
    descriptionEn: 'Korea\'s largest coastal seafood festival. Fully flat modern market complex structures ensure Senior companions and wheelchair users dine safely.',
    locationKo: '부산 자갈치 시장',
    locationEn: 'Busan Jagalchi Market & Coastal Waterfront',
    colorClass: 'bg-violet-50 text-violet-850 border-violet-100',
    dotClass: 'bg-violet-500'
  },
  {
    id: 'guponaru-festival',
    titleKo: '낙동강 구포나루축제',
    titleEn: 'Nakdong River Guponaru Festival',
    category: 'festival',
    categoryKo: '전통/역사 축제',
    categoryEn: 'Traditional River Festival',
    startDate: '2026-10-16',
    endDate: '2026-10-18',
    stationId: 'bujeon',
    exitNumber: '3번 출구',
    stationKo: '구포역 / 덕천역 (3호선/2호선)',
    stationEn: 'Gupo / Deokcheon Station',
    metroLine: 'Line 3 & 2',
    accessibilityKo: '화명생태공원 나루터 일원 및 선착장 보행로는 단차가 최소화된 평지 산책로로 조성되어 휠체어와 유모차가 안전하게 산책할 수 있습니다.',
    accessibilityEn: 'Riverside walkways at Hwamyeong Ecological Park provide flat, step-free access for strollers and wheelchairs along the river.',
    exitTipKo: '구포역 3번 출구 또는 덕천역 3번 출구를 통해 평탄한 낙동강 수변 보행로로 진입하실 수 있습니다.',
    exitTipEn: 'Use Gupo Exit 3 or Deokcheon Exit 3 for direct flat walkway access to the festival area.',
    descriptionKo: '조선시대 영남 3대 나루터였던 구포나루의 역사와 문화를 기리는 축제로, 낙동강 뗏목 타기 체험, 구포국수 먹거리 장터, 나루터 가요제, 야간 빛축제가 풍성하게 펼쳐집니다.',
    descriptionEn: 'A historic festival celebrating the ancient Gupo ferry port with river raft rides, traditional Gupo noodle food markets, music contests, and night light shows along the Nakdong River.',
    locationKo: '화명생태공원 및 구포나루터 선착장 일원',
    locationEn: 'Hwamyeong Ecological Park & Guponaru Wharf',
    colorClass: 'bg-amber-50 text-amber-850 border-amber-100',
    dotClass: 'bg-amber-500'
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
    accessibilityEn: 'Samrak Ecological Park Cultural Plaza features flat asphalt and brick pathways providing smooth access for wheelchair and stroller users.',
    exitTipKo: '사상역 3번 출구 또는 괘법르네시떼역 1번 출구 엘리베이터 보행육교를 이용해 삼락생태공원 문화마당으로 턱 없이 진입하실 수 있습니다.',
    exitTipEn: 'Use the elevator pedestrian overpass at Sasang Exit 3 or Gwaebeop Renecite Exit 1 to reach Samrak Park Cultural Plaza step-free.',
    descriptionKo: '가을 낙동강변의 정취와 함께 펼쳐지는 사상 대표 축제로 삼락생태공원 문화마당에서 열리는 강변 음악회, 거리 버스킹, 전통 체험 및 야간 경관 조명 행사입니다.',
    descriptionEn: 'A representative autumn riverside festival at Samrak Park featuring acoustic concerts, street performances, traditional craft workshops, and riverbank illuminations.',
    locationKo: '삼락생태공원 문화마당',
    locationEn: 'Samrak Ecological Park Cultural Plaza',
    colorClass: 'bg-emerald-50 text-emerald-850 border-emerald-100',
    dotClass: 'bg-emerald-500'
  },
  {
    id: 'fireworks-festival',
    titleKo: '부산 불꽃축제',
    titleEn: 'Busan Fireworks Festival',
    category: 'performance',
    categoryKo: '공연/콘서트',
    categoryEn: 'Performance & Concert',
    startDate: '2026-11-07',
    endDate: '2026-11-07',
    stationId: 'gwangan',
    exitNumber: '5번 출구',
    stationKo: '광안역 / 금련산역 (2호선)',
    stationEn: 'Gwangan / Geumnyeonsan Station',
    metroLine: 'Line 2',
    accessibilityKo: '매우 붐비기 때문에 교통 정리가 이루어집니다. 휠체어 탑승자와 배려자분을 위한 지정석 구역 및 특수 통행 게이트가 별도로 지정 통제 운영되므로 안심하십시오.',
    accessibilityEn: 'Due to large crowds, specialized barrier-free outdoor viewing zones with dynamic ramp entrances are dedicated for senior and disabled visitors.',
    exitTipKo: '광안역 5번 출구 엘리베이터 이용 후 광안리해수욕장 배리어프리 전용 관람존으로 이동하실 수 있습니다.',
    exitTipEn: 'Gwangan Exit 5 elevator connects directly to barrier-free viewing gates at Gwangalli Beach.',
    descriptionKo: '매년 가을 밤 광안대교를 배경으로 수만 발의 화려한 초대형 불꽃과 초대형 드론 군무, 감미로운 음악을 접목한 세계 최고 수준의 영상 불꽃 멀티미디어 쇼입니다.',
    descriptionEn: 'A breathtaking autumn night firework performance framed by Gwangandaegyo Bridge, using multi-dimensional visual laser shows and symphonies.',
    locationKo: '광안리 해수욕장 백사장 일대 및 수변공원',
    locationEn: 'Gwangalli Beach Front & Marine Park',
    colorClass: 'bg-fuchsia-50 text-fuchsia-850 border-fuchsia-100',
    dotClass: 'bg-fuchsia-500'
  }
];

export default function BusanEventsCalendarView({ language, onSelectStation }: BusanEventsCalendarViewProps) {
  // Set of station IDs registered in the 'Exit Info & Station Search' tab
  const registeredStationIds = useMemo(() => new Set(STATIONS.map(s => s.id)), []);

  // Calculate today's date dynamically
  const todayObj = useMemo(() => new Date(), []);
  const todayYear = todayObj.getFullYear();
  const todayMonth = todayObj.getMonth() + 1;
  const todayDate = todayObj.getDate();
  const todayDateStr = useMemo(() => {
    return `${todayYear}-${String(todayMonth).padStart(2, '0')}-${String(todayDate).padStart(2, '0')}`;
  }, [todayYear, todayMonth, todayDate]);

  // View mode: 'calendar' | 'list'
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Present Year and Month (initialize to current real year and month)
  const [currentYear, setCurrentYear] = useState<number>(todayYear);
  const [currentMonth, setCurrentMonth] = useState<number>(todayMonth);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [quickDetailModal, setQuickDetailModal] = useState<BusanEvent | null>(null);
  
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
              map.set(e.id, e);
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

  // Filter events based on category, search query, and exclude past events
  const filteredEvents = useMemo(() => {
    let list = eventsList.filter(evt => evt.endDate >= todayDateStr);

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
  }, [eventsList, todayDateStr, selectedCategory, searchQuery]);

  // Helper to find all filtered events active on a specific calendar day cell
  const getEventsForDay = (dateString: string) => {
    return filteredEvents.filter(evt => isDateInEventRange(dateString, evt));
  };

  // Events active during the currently selected month
  const thisMonthEvents = useMemo(() => {
    const ym = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    return filteredEvents.filter(evt => {
      const sYm = evt.startDate.slice(0, 7);
      const eYm = evt.endDate.slice(0, 7);
      return (sYm <= ym && ym <= eYm);
    });
  }, [filteredEvents, currentYear, currentMonth]);

  // Events for specifically selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return filteredEvents.filter(evt => isDateInEventRange(selectedDate, evt));
  }, [filteredEvents, selectedDate]);

  // Selected event metadata lookup
  const activeEventDetail = useMemo(() => {
    return eventsList.find(evt => evt.id === selectedEventId) || null;
  }, [selectedEventId, eventsList]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
    setSelectedDate(null);
  };

  const handleResetToday = () => {
    setCurrentYear(todayYear);
    setCurrentMonth(todayMonth);
    setSelectedDate(todayDateStr);
  };

  // Jump specifically to a targeted event's month
  const jumpToEventMonth = (event: BusanEvent) => {
    const parts = event.startDate.split('-');
    const yr = parseInt(parts[0], 10);
    const mo = parseInt(parts[1], 10);
    setCurrentYear(yr);
    setCurrentMonth(mo);
    setSelectedEventId(event.id);
    setSelectedDate(event.startDate);
    setViewMode('calendar');

    setTimeout(() => {
      const targetElement = document.getElementById('selected-event-details-section');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 120);
  };

  // Month label formatted
  const monthLabel = useMemo(() => {
    const labelsKo = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const labelsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return language === 'KR' 
      ? `${currentYear}년 ${labelsKo[currentMonth - 1]}` 
      : `${labelsEn[currentMonth - 1]} ${currentYear}`;
  }, [currentYear, currentMonth, language]);

  // Compact label for calendar badges (no emoji)
  const formatBadgeTitle = (evt: BusanEvent, lang: 'KR' | 'EN') => {
    if (lang === 'KR') {
      let text = evt.titleKo;
      if (text.includes('」')) {
        text = text.split('」')[1].trim();
      }
      text = text.replace('드론라이트쇼', '드론쇼');
      if (text.length > 11) {
        return text.substring(0, 10) + '..';
      }
      return text;
    } else {
      let text = evt.titleEn;
      if (text.includes('(')) {
        text = text.split('(')[1].replace(')', '').trim();
      }
      if (text.length > 11) {
        return text.substring(0, 10) + '..';
      }
      return text;
    }
  };

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
      
      {/* 1. Intro Header Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] text-left">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <CalendarIcon className="w-7 h-7 sm:w-8 sm:h-8 text-[#8EA85E] shrink-0" />
          <span>{language === 'KR' ? '부산 주요일정표' : 'Busan Main Festival Calendar'}</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mt-2 leading-relaxed font-semibold">
          {language === 'KR' 
            ? '한 눈에 부산 대표 축제 보기' 
            : 'View Busan\'s Representative Festivals at a Glance'}
        </p>

        {/* Verification Info Notice */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs text-slate-500">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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
              className="text-blue-600 hover:text-blue-800 font-medium underline inline-flex items-center gap-0.5"
            >
              <span>{language === 'KR' ? '부산광역시청' : 'Busan Metropolitan City'}</span>
              <ExternalLink className="w-2.5 h-2.5 text-blue-600" />
            </a>
          </span>
        </div>
      </div>

      {/* 2. Top Interactive Filter & View Switcher Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-150 shadow-2xs">
        {/* Category Pills */}
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
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedEventId(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#004481] text-white shadow-xs'
                    : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
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
              className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004481]/30 focus:border-[#004481] transition-all"
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
          <div className="inline-flex p-1 bg-slate-100 rounded-xl shrink-0 border border-slate-200/60">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white text-[#004481] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title={language === 'KR' ? '월간 캘린더로 보기' : 'Calendar View'}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'KR' ? '캘린더' : 'Calendar'}</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[#004481] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title={language === 'KR' ? '전체 일정 목록으로 보기' : 'All Events List'}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'KR' ? '전체 일정' : 'All Events'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3A. CALENDAR VIEW MODE */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: The Interactive Calendar Grid (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-150 p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-4">
            
            {/* Calendar header control pane */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-800 flex items-center gap-2 font-heading">
                <CalendarIcon className="w-4 h-4 text-[#004481] shrink-0" />
                <span>{monthLabel}</span>
              </h3>

              {/* Navigation buttons */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg cursor-pointer border border-slate-200 transition-all active:scale-95"
                  title={language === 'KR' ? '이전 달' : 'Previous Month'}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleResetToday}
                  className="px-2.5 py-1 text-xs font-bold hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {language === 'KR' ? '오늘' : 'Today'}
                </button>

                <button
                  onClick={handleNextMonth}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg cursor-pointer border border-slate-200 transition-all active:scale-95"
                  title={language === 'KR' ? '다음 달' : 'Next Month'}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of week labels */}
            <div className="grid grid-cols-7 gap-1 text-center py-1">
              {['일', '월', '화', '수', '목', '금', '토'].map((dowStr, dowIdx) => {
                const dowLabelEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dowIdx];
                const textCol = dowIdx === 0 ? 'text-rose-500 font-bold' : dowIdx === 6 ? 'text-blue-500 font-bold' : 'text-slate-500 font-medium';
                return (
                  <div key={dowIdx} className={`text-xs select-none ${textCol}`}>
                    {language === 'KR' ? dowStr : dowLabelEn}
                  </div>
                );
              })}
            </div>

            {/* Calendar Day grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
              {calendarDays.map((cell, idx) => {
                const dayEvents = getEventsForDay(cell.dateString);
                const isToday = cell.dateString === todayDateStr;
                const isSelectedDate = selectedDate === cell.dateString;
                const isFocusEventDay = selectedEventId ? dayEvents.some(e => e.id === selectedEventId) : false;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedDate(cell.dateString);
                      if (dayEvents.length === 1) {
                        setSelectedEventId(dayEvents[0].id);
                      } else {
                        setSelectedEventId(null);
                      }
                    }}
                    className={`min-h-[64px] sm:min-h-[88px] p-1 sm:p-1.5 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                      cell.isPadding 
                        ? 'bg-slate-50/40 border-slate-100/60 opacity-35' 
                        : 'bg-white border-slate-200/80 hover:border-[#004481]/50 hover:shadow-2xs'
                    } ${
                      isSelectedDate 
                        ? 'ring-2 ring-[#004481] bg-sky-50/50 border-sky-300 shadow-xs' 
                        : ''
                    } ${
                      isFocusEventDay && !isSelectedDate 
                        ? 'ring-1.5 ring-blue-300 bg-blue-50/20' 
                        : ''
                    }`}
                  >
                    {/* Day Number and Today Sign */}
                    <div className="flex justify-between items-center">
                      <span className={`text-[11px] sm:text-xs font-bold ${
                        isToday 
                          ? 'w-5 h-5 rounded-full bg-[#004481] text-white flex items-center justify-center text-[10px]' 
                          : cell.isPadding ? 'text-slate-400' : 'text-slate-700'
                      }`}>
                        {cell.dayNumber}
                      </span>
                      {isToday && (
                        <span className="text-[8px] sm:text-[9px] font-bold text-[#004481] hidden sm:inline">
                          {language === 'KR' ? '오늘' : 'Today'}
                        </span>
                      )}
                    </div>

                    {/* Desktop Layout - Render clean pills without emoji */}
                    <div className="hidden sm:flex flex-col gap-1 mt-1">
                      {dayEvents.slice(0, 2).map(evt => {
                        const isSelectedEvt = selectedEventId === evt.id;
                        return (
                          <div
                            key={evt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEventId(evt.id);
                              setSelectedDate(cell.dateString);
                            }}
                            className={`text-[9.5px] leading-tight px-1.5 py-0.5 rounded-md truncate font-medium flex items-center gap-1 transition-all ${
                              isSelectedEvt
                                ? 'bg-[#004481] text-white font-bold shadow-2xs'
                                : `${evt.colorClass} border border-slate-200/60 hover:opacity-85`
                            }`}
                            title={language === 'KR' ? evt.titleKo : evt.titleEn}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelectedEvt ? 'bg-white' : evt.dotClass}`} />
                            <span className="truncate">{formatBadgeTitle(evt, language)}</span>
                          </div>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <div className="text-[9px] font-bold text-slate-500 px-1 text-right">
                          +{dayEvents.length - 2}
                        </div>
                      )}
                    </div>

                    {/* Mobile Layout - Render clean colored dots */}
                    <div className="flex sm:hidden items-center justify-center gap-1 mt-1">
                      {dayEvents.slice(0, 3).map(evt => (
                        <span key={evt.id} className={`w-1.5 h-1.5 rounded-full ${evt.dotClass}`} />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[8px] font-bold text-slate-400">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Selected Event / Day Schedule Browser (lg:col-span-5) */}
          <div id="selected-event-details-section" className="lg:col-span-5 space-y-4 scroll-mt-20">
            <AnimatePresence mode="wait">
              {activeEventDetail ? (
                /* 1. Full Event Detail Card */
                <motion.div
                  key={activeEventDetail.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-3xl border border-slate-150 p-5 sm:p-6 shadow-sm text-left space-y-4"
                >
                  {/* Top Bar with Back Button */}
                  <div className="flex justify-between items-start gap-3 border-b border-slate-100 pb-3">
                    <button
                      onClick={() => setSelectedEventId(null)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>{language === 'KR' ? '목록으로' : 'Back to list'}</span>
                    </button>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold ${activeEventDetail.colorClass} border border-slate-200/70`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${activeEventDetail.dotClass}`} />
                      <span>{language === 'KR' ? activeEventDetail.categoryKo : activeEventDetail.categoryEn}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {language === 'KR' ? activeEventDetail.titleKo : activeEventDetail.titleEn}
                  </h4>

                  {/* Core Meta: Date, Location */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-[#004481] shrink-0" />
                      <span className="font-semibold text-slate-500">{language === 'KR' ? '행사 기간:' : 'Period:'}</span>
                      <span className="font-bold text-slate-800">{activeEventDetail.startDate} ~ {activeEventDetail.endDate}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="font-semibold text-slate-500">{language === 'KR' ? '행사 장소:' : 'Venue:'}</span>
                      <span className="font-bold text-slate-800">{language === 'KR' ? activeEventDetail.locationKo : activeEventDetail.locationEn}</span>
                    </div>
                  </div>

                  {/* Accessible Subway Station Exit Box */}
                  {registeredStationIds.has(activeEventDetail.stationId) && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-[#004481] text-white rounded-lg shadow-2xs shrink-0">
                            <Train className="w-3.5 h-3.5" />
                          </span>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">
                              {language === 'KR' ? '무단차 인접 지하철역' : 'Accessible Subway Connection'}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {language === 'KR' ? activeEventDetail.stationKo : activeEventDetail.stationEn}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {activeEventDetail.exitNumber}
                        </span>
                      </div>

                      {activeEventDetail.exitTipKo && (
                        <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                            <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{language === 'KR' ? '출구 무단차 동선 팁' : 'Barrier-Free Exit Tip'}</span>
                          </div>
                          <p className="text-[11.5px] text-slate-600 font-medium pl-4">
                            {language === 'KR' ? activeEventDetail.exitTipKo : activeEventDetail.exitTipEn}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-1">
                        {onSelectStation && (
                          <button
                            onClick={() => onSelectStation(activeEventDetail.stationId, activeEventDetail.exitNumber)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#004481] hover:bg-[#003366] text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer active:scale-98"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>
                              {language === 'KR' 
                                ? `${activeEventDetail.stationKo.split(' ')[0]} ${activeEventDetail.exitNumber} 동선 보기` 
                                : `View ${activeEventDetail.exitNumber} Guide`}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => window.open(`https://map.naver.com/v5/search/${encodeURIComponent(activeEventDetail.stationKo.split(' ')[0] + ' ' + activeEventDetail.exitNumber)}`, '_blank')}
                          className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                        >
                          <span>{language === 'KR' ? '네이버 지도' : 'Naver Map'}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide block">
                      {language === 'KR' ? '행사 소개' : 'Event Description'}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-normal">
                      {language === 'KR' ? activeEventDetail.descriptionKo : activeEventDetail.descriptionEn}
                    </p>
                  </div>
                </motion.div>
              ) : selectedDate ? (
                /* 2. Specific Selected Date Schedule List */
                <motion.div
                  key="selected-date-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-3xl border border-slate-150 p-5 sm:p-6 shadow-sm text-left space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                        {language === 'KR' ? '선택한 날짜' : 'Selected Date'}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        {formatPopupDate(selectedDate, language)}
                      </h4>
                    </div>
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="text-xs font-bold text-[#004481] hover:underline cursor-pointer"
                    >
                      {language === 'KR' ? '전체 보기' : 'Show All'}
                    </button>
                  </div>

                  <div className="max-h-[460px] overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                    {selectedDateEvents.map(evt => (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEventId(evt.id)}
                        className="p-3.5 rounded-2xl border border-slate-200 hover:border-[#004481]/50 hover:bg-slate-50/70 transition-all cursor-pointer flex justify-between items-center gap-3 group"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${evt.colorClass} border border-slate-200/60`}>
                              {language === 'KR' ? evt.categoryKo : evt.categoryEn}
                            </span>
                            {registeredStationIds.has(evt.stationId) && (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                                <Train className="w-3 h-3 text-emerald-600" />
                                <span>{evt.stationKo.split(' ')[0]} {evt.exitNumber}</span>
                              </span>
                            )}
                          </div>
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#004481] transition-colors leading-snug">
                            {language === 'KR' ? evt.titleKo : evt.titleEn}
                          </h5>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {evt.startDate} ~ {evt.endDate}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#004481] transition-transform group-hover:translate-x-0.5 shrink-0" />
                      </div>
                    ))}

                    {selectedDateEvents.length === 0 && (
                      <div className="text-center py-10 space-y-2">
                        <Info className="w-6 h-6 text-slate-300 mx-auto" />
                        <p className="text-xs font-medium text-slate-500">
                          {language === 'KR' ? '선택하신 날짜에 예정된 축제 일정이 없습니다.' : 'No festivals scheduled on this selected date.'}
                        </p>
                        <button
                          onClick={() => setSelectedDate(null)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                        >
                          {language === 'KR' ? '이번 달 전체 축제 보기' : 'View This Month\'s Festivals'}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* 3. Default: This Month Festival Index */
                <motion.div
                  key="month-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-3xl border border-slate-150 p-5 sm:p-6 shadow-sm text-left space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#004481]" />
                      <span>{language === 'KR' ? `${currentMonth}월 주요 축제 & 행사` : `Festivals in ${monthLabel}`}</span>
                    </h4>
                    <span className="text-xs font-bold text-slate-400">
                      {language === 'KR' ? `총 ${thisMonthEvents.length}개` : `${thisMonthEvents.length} events`}
                    </span>
                  </div>

                  <div className="max-h-[460px] overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                    {thisMonthEvents.map(evt => (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEventId(evt.id)}
                        className="p-3.5 rounded-2xl border border-slate-200 hover:border-[#004481]/50 hover:bg-slate-50/70 transition-all cursor-pointer flex justify-between items-center gap-3 group"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${evt.colorClass} border border-slate-200/60`}>
                              {language === 'KR' ? evt.categoryKo : evt.categoryEn}
                            </span>
                            {registeredStationIds.has(evt.stationId) && (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                                <Train className="w-3 h-3 text-emerald-600" />
                                <span>{evt.stationKo.split(' ')[0]} {evt.exitNumber}</span>
                              </span>
                            )}
                          </div>
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#004481] transition-colors leading-snug">
                            {language === 'KR' ? evt.titleKo : evt.titleEn}
                          </h5>
                          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{evt.startDate} ~ {evt.endDate}</span>
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#004481] transition-transform group-hover:translate-x-0.5 shrink-0" />
                      </div>
                    ))}

                    {thisMonthEvents.length === 0 && (
                      <div className="text-center py-10 space-y-2">
                        <Info className="w-6 h-6 text-slate-300 mx-auto" />
                        <p className="text-xs font-medium text-slate-500">
                          {language === 'KR' ? '선택하신 월에 예정된 축제 일정이 없습니다.' : 'No festivals scheduled in this month.'}
                        </p>
                        <button
                          onClick={() => setViewMode('list')}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                        >
                          {language === 'KR' ? '부산 전체 축제 목록 보기' : 'View All Busan Festivals'}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 3B. ALL EVENTS LIST VIEW MODE */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-slate-500">
              {language === 'KR' 
                ? `총 ${filteredEvents.length}개의 주요 축제 및 행사가 등록되어 있습니다.` 
                : `Showing ${filteredEvents.length} major festivals in Busan.`}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredEvents.map(evt => (
              <div
                key={evt.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#004481]/40 transition-all p-5 flex flex-col justify-between group text-left"
              >
                <div className="space-y-3">
                  {/* Top Bar: Category & Station */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${evt.colorClass} border border-slate-200/60`}>
                      {language === 'KR' ? evt.categoryKo : evt.categoryEn}
                    </span>
                    {registeredStationIds.has(evt.stationId) && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100 flex items-center gap-1">
                        <Train className="w-3 h-3 text-emerald-600" />
                        <span>{evt.stationKo.split(' ')[0]} {evt.exitNumber}</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-[#004481] transition-colors leading-snug line-clamp-1">
                    {language === 'KR' ? evt.titleKo : evt.titleEn}
                  </h4>

                  {/* Period & Venue */}
                  <div className="space-y-1.5 text-xs text-slate-600 font-medium">
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
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {language === 'KR' ? evt.descriptionKo : evt.descriptionEn}
                  </p>

                  {/* Barrier-Free Tip Preview */}
                  {(evt.exitTipKo || evt.accessibilityKo) && (
                    <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100/80 text-[11px] text-emerald-900 font-medium flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        {language === 'KR' ? (evt.exitTipKo || evt.accessibilityKo) : (evt.exitTipEn || evt.accessibilityEn)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setQuickDetailModal(evt)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    {language === 'KR' ? '상세 가이드' : 'Details'}
                  </button>

                  <button
                    onClick={() => jumpToEventMonth(evt)}
                    className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#004481] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    title={language === 'KR' ? '캘린더에서 해당 일정 확인' : 'View in Calendar'}
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>{language === 'KR' ? '달력' : 'Calendar'}</span>
                  </button>

                  {registeredStationIds.has(evt.stationId) && onSelectStation && (
                    <button
                      onClick={() => onSelectStation(evt.stationId, evt.exitNumber)}
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
                      title={language === 'KR' ? '지하철역 출구 안내 바로가기' : 'View Station Exit Guide'}
                    >
                      <Navigation className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-150 p-12 text-center space-y-3">
              <Info className="w-8 h-8 text-slate-300 mx-auto" />
              <h5 className="text-sm font-bold text-slate-700">
                {language === 'KR' ? '검색 조건에 맞는 축제가 없습니다.' : 'No festivals match your search criteria.'}
              </h5>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-[#004481] text-white text-xs font-bold cursor-pointer"
              >
                {language === 'KR' ? '필터 초기화' : 'Reset Filters'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. Quick Detail Modal (from list view) */}
      <AnimatePresence>
        {quickDetailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickDetailModal(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-150 p-6 shadow-2xl z-10 flex flex-col max-h-[85vh] text-left space-y-4"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold ${quickDetailModal.colorClass} border border-slate-200/60`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${quickDetailModal.dotClass}`} />
                    <span>{language === 'KR' ? quickDetailModal.categoryKo : quickDetailModal.categoryEn}</span>
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 leading-snug">
                    {language === 'KR' ? quickDetailModal.titleKo : quickDetailModal.titleEn}
                  </h4>
                </div>
                <button
                  onClick={() => setQuickDetailModal(null)}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                {/* Meta: Period, Venue */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-[#004481] shrink-0" />
                    <span className="font-semibold text-slate-500">{language === 'KR' ? '행사 기간:' : 'Period:'}</span>
                    <span className="font-bold text-slate-800">{quickDetailModal.startDate} ~ {quickDetailModal.endDate}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="font-semibold text-slate-500">{language === 'KR' ? '행사 장소:' : 'Venue:'}</span>
                    <span className="font-bold text-slate-800">{language === 'KR' ? quickDetailModal.locationKo : quickDetailModal.locationEn}</span>
                  </div>
                </div>

                {/* Subway Exit Guide Box */}
                {registeredStationIds.has(quickDetailModal.stationId) && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-[#004481] text-white rounded-lg shadow-2xs shrink-0">
                          <Train className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">
                            {language === 'KR' ? '인접 지하철역 출구' : 'Subway Connection'}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {language === 'KR' ? quickDetailModal.stationKo : quickDetailModal.stationEn}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {quickDetailModal.exitNumber}
                      </span>
                    </div>

                    {quickDetailModal.exitTipKo && (
                      <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                          <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{language === 'KR' ? '출구 무단차 동선 팁' : 'Barrier-Free Exit Tip'}</span>
                        </div>
                        <p className="text-[11.5px] text-slate-600 font-medium pl-4">
                          {language === 'KR' ? quickDetailModal.exitTipKo : quickDetailModal.exitTipEn}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide block">
                    {language === 'KR' ? '행사 소개' : 'Event Description'}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-normal">
                    {language === 'KR' ? quickDetailModal.descriptionKo : quickDetailModal.descriptionEn}
                  </p>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                {registeredStationIds.has(quickDetailModal.stationId) && onSelectStation && (
                  <button
                    onClick={() => {
                      const stationId = quickDetailModal.stationId;
                      const exitNum = quickDetailModal.exitNumber;
                      setQuickDetailModal(null);
                      onSelectStation(stationId, exitNum);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#004481] hover:bg-[#003366] text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>
                      {language === 'KR' 
                        ? `${quickDetailModal.stationKo.split(' ')[0]} ${quickDetailModal.exitNumber} 동선 보기` 
                        : `View ${quickDetailModal.exitNumber} Guide`}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => {
                    const evt = quickDetailModal;
                    setQuickDetailModal(null);
                    jumpToEventMonth(evt);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#004481] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>{language === 'KR' ? '캘린더에서 보기' : 'View in Calendar'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
