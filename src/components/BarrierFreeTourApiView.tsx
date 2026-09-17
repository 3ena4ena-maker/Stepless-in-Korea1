/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 부산 무장애 관광 통합 뷰 (모달 완전 제거 및 다단계 페이지 라우팅)
 * - 1단계: 무장애 메인 (/barrier-free)
 * - 2단계: 추천 코스 상세 (/barrier-free/course/:courseId)
 * - 3단계: 관광지 상세 (/barrier-free/place/:placeId)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { UserType } from '../data/barrierFreeData';
import BarrierFreeMainView from './BarrierFreeMainView';
import BarrierFreeCourseDetailView from './BarrierFreeCourseDetailView';
import BarrierFreePlaceDetailView from './BarrierFreePlaceDetailView';

interface BarrierFreeTourApiViewProps {
  language: 'KR' | 'EN';
  initialCourseId?: string | null;
  initialPlaceId?: string | null;
  onSelectStation?: (stationId: string, exitNum?: string) => void;
  onNavigateHome?: () => void;
}

type BarrierFreeSubPage = 'main' | 'course' | 'place';

export default function BarrierFreeTourApiView({
  language,
  initialCourseId = null,
  initialPlaceId = null,
  onSelectStation,
  onNavigateHome,
}: BarrierFreeTourApiViewProps) {
  // 1. 여행자 유형 상태 (기본값: 휠체어 이용자)
  const [selectedUserType, setSelectedUserType] = useState<UserType>('wheelchair');

  // 2. 서브 페이지 및 타겟 ID 상태
  const [currentView, setCurrentView] = useState<BarrierFreeSubPage>(() => {
    if (initialPlaceId) return 'place';
    if (initialCourseId) return 'course';

    // URL path 체크 (/place/:id 및 /barrier-free/place/:id 모두 지원)
    const path = window.location.pathname;
    if (path.includes('/barrier-free/course/')) return 'course';
    if (path.includes('/place/') || path.includes('/barrier-free/place/')) return 'place';
    return 'main';
  });

  const [activeCourseId, setActiveCourseId] = useState<string | null>(() => {
    if (initialCourseId) return initialCourseId;
    const path = window.location.pathname;
    if (path.includes('/barrier-free/course/')) {
      const parts = path.split('/barrier-free/course/');
      return parts[1] ? parts[1].split('/')[0] : 'course-haeundae-ocean';
    }
    return 'course-haeundae-ocean';
  });

  const [activePlaceId, setActivePlaceId] = useState<string | null>(() => {
    if (initialPlaceId) return initialPlaceId;
    const path = window.location.pathname;
    if (path.includes('/place/')) {
      const parts = path.split('/place/');
      return parts[1] ? parts[1].split('/')[0] : 'spot-101';
    }
    if (path.includes('/barrier-free/place/')) {
      const parts = path.split('/barrier-free/place/');
      return parts[1] ? parts[1].split('/')[0] : 'spot-101';
    }
    return 'spot-101';
  });

  // 이전 탐색 경로 스택 (코스에서 왔는지, 메인에서 왔는지 추적)
  const [navHistory, setNavHistory] = useState<string[]>([]);

  // 3. 브라우저 URL 동기화 및 뒤로 가기/앞으로 가기 처리
  const syncUrl = useCallback((path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({ barrierFreePath: path }, '', path);
    }
  }, []);

  // 네비게이션: 코스 상세 페이지로 이동
  const handleNavigateToCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    setCurrentView('course');
    setNavHistory((prev) => [...prev, 'main']);
    syncUrl(`/barrier-free/course/${courseId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 네비게이션: 개별 관광지 상세 페이지로 이동 (/place/:placeId 로 직관적인 상세 URL 라우팅)
  const handleNavigateToPlace = (placeId: string) => {
    setActivePlaceId(placeId);
    setNavHistory((prev) => [...prev, currentView]);
    setCurrentView('place');
    syncUrl(`/place/${placeId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 네비게이션: 뒤로 가기
  const handleBack = () => {
    if (currentView === 'place') {
      const previous = navHistory[navHistory.length - 1];
      if (previous === 'course' && activeCourseId) {
        setCurrentView('course');
        setNavHistory((prev) => prev.slice(0, -1));
        syncUrl(`/barrier-free/course/${activeCourseId}`);
      } else {
        setCurrentView('main');
        setNavHistory([]);
        syncUrl('/barrier-free');
      }
    } else if (currentView === 'course') {
      setCurrentView('main');
      setNavHistory([]);
      syncUrl('/barrier-free');
    } else {
      if (onNavigateHome) onNavigateHome();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // popstate 이벤트 (브라우저 뒤로 가기 / 앞으로 가기 감지)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/barrier-free/course/')) {
        const parts = path.split('/barrier-free/course/');
        const cId = parts[1]?.split('/')[0];
        if (cId) {
          setActiveCourseId(cId);
          setCurrentView('course');
        }
      } else if (path.startsWith('/place/')) {
        const parts = path.split('/place/');
        const pId = parts[1]?.split('/')[0];
        if (pId) {
          setActivePlaceId(pId);
          setCurrentView('place');
        }
      } else if (path.startsWith('/barrier-free/place/')) {
        const parts = path.split('/barrier-free/place/');
        const pId = parts[1]?.split('/')[0];
        if (pId) {
          setActivePlaceId(pId);
          setCurrentView('place');
        }
      } else if (path === '/barrier-free' || path.startsWith('/barrier-free')) {
        setCurrentView('main');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // initialCourseId나 initialPlaceId prop이 바뀔 때 반영
  useEffect(() => {
    if (initialPlaceId) {
      setActivePlaceId(initialPlaceId);
      setCurrentView('place');
    } else if (initialCourseId) {
      setActiveCourseId(initialCourseId);
      setCurrentView('course');
    }
  }, [initialPlaceId, initialCourseId]);

  return (
    <div className="w-full bg-[#FBFBF9] min-h-screen">
      {currentView === 'main' && (
        <BarrierFreeMainView
          selectedUserType={selectedUserType}
          onSelectUserType={(type) => setSelectedUserType(type)}
          language={language}
          onNavigateToCourse={handleNavigateToCourse}
          onNavigateToPlace={handleNavigateToPlace}
        />
      )}

      {currentView === 'course' && activeCourseId && (
        <BarrierFreeCourseDetailView
          courseId={activeCourseId}
          selectedUserType={selectedUserType}
          language={language}
          onNavigateToPlace={handleNavigateToPlace}
          onBackToCourseList={handleBack}
        />
      )}

      {currentView === 'place' && activePlaceId && (
        <BarrierFreePlaceDetailView
          placeId={activePlaceId}
          selectedUserType={selectedUserType}
          language={language}
          onBack={handleBack}
          onSelectStation={onSelectStation}
          onSelectUserType={(type) => setSelectedUserType(type)}
        />
      )}
    </div>
  );
}
