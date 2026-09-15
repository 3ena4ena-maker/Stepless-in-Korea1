// Shared crosswalk points data for stations
export interface CrosswalkPoint {
  lat: number;
  lng: number;
  nameKr: string;
  nameEn: string;
}

export function getStationCrosswalkPoints(stationId: string): CrosswalkPoint[] {
  if (stationId === 'beomeosa') {
    return [
      { lat: 35.272596, lng: 129.092851, nameKr: '범어사역 부근 횡단보도 1', nameEn: 'Beomeosa Station Crosswalk 1' }
    ];
  } else if (stationId === 'jungang') {
    return [
      { lat: 35.105193, lng: 129.036551, nameKr: '중앙역 부근 횡단보도 1', nameEn: 'Jung-ang Station Crosswalk 1' },
      { lat: 35.105015, lng: 129.036294, nameKr: '중앙역 부근 횡단보도 2', nameEn: 'Jung-ang Station Crosswalk 2' },
      { lat: 35.104127, lng: 129.036360, nameKr: '중앙역 부근 횡단보도 3', nameEn: 'Jung-ang Station Crosswalk 3' },
      { lat: 35.103130, lng: 129.036403, nameKr: '중앙역 부근 횡단보도 4', nameEn: 'Jung-ang Station Crosswalk 4' },
      { lat: 35.102924, lng: 129.036744, nameKr: '중앙역 부근 횡단보도 5', nameEn: 'Jung-ang Station Crosswalk 5' },
      { lat: 35.102885, lng: 129.036176, nameKr: '중앙역 부근 횡단보도 6', nameEn: 'Jung-ang Station Crosswalk 6' }
    ];
  } else if (stationId === 'seomyeon') {
    return [
      { lat: 35.156981, lng: 129.057776, nameKr: '서면역 부근 횡단보도 1', nameEn: 'Seomyeon Station Crosswalk 1' },
      { lat: 35.157765, lng: 129.060084, nameKr: '서면역 부근 횡단보도 2', nameEn: 'Seomyeon Station Crosswalk 2' }
    ];
  } else if (stationId === 'bujeon') {
    return [
      { lat: 35.160072, lng: 129.060950, nameKr: '부전역 부근 횡단보도 1', nameEn: 'Bujeon Station Crosswalk 1' },
      { lat: 35.162038, lng: 129.062340, nameKr: '부전역 부근 횡단보도 2', nameEn: 'Bujeon Station Crosswalk 2' },
      { lat: 35.162808, lng: 129.063141, nameKr: '부전역 부근 횡단보도 3', nameEn: 'Bujeon Station Crosswalk 3' },
      { lat: 35.163751, lng: 129.064201, nameKr: '부전역 부근 횡단보도 4', nameEn: 'Bujeon Station Crosswalk 4' }
    ];
  } else if (stationId === 'gwangan') {
    return [
      { lat: 35.157177, lng: 129.112880, nameKr: '광안역 부근 횡단보도 1', nameEn: 'Gwangan Station Crosswalk 1' },
      { lat: 35.157072, lng: 129.113787, nameKr: '광안역 부근 횡단보도 2', nameEn: 'Gwangan Station Crosswalk 2' }
    ];
  } else if (stationId === 'suyeong') {
    return [
      { lat: 35.164779, lng: 129.114637, nameKr: '수영역 부근 횡단보도 1', nameEn: 'Suyeong Station Crosswalk 1' },
      { lat: 35.168071, lng: 129.114190, nameKr: '수영역 부근 횡단보도 2', nameEn: 'Suyeong Station Crosswalk 2' },
      { lat: 35.167906, lng: 129.116710, nameKr: '수영역 부근 횡단보도 3', nameEn: 'Suyeong Station Crosswalk 3' }
    ];
  } else if (stationId === 'haeundae') {
    return [
      { lat: 35.163103, lng: 129.159348, nameKr: '해운대역 부근 횡단보도 1', nameEn: 'Haeundae Station Crosswalk 1' },
      { lat: 35.163592, lng: 129.159008, nameKr: '해운대역 부근 횡단보도 2', nameEn: 'Haeundae Station Crosswalk 2' },
      { lat: 35.163422, lng: 129.158462, nameKr: '해운대역 부근 횡단보도 3', nameEn: 'Haeundae Station Crosswalk 3' }
    ];
  } else if (stationId === 'jagalchi') {
    return [
      { lat: 35.097792, lng: 129.028350, nameKr: '자갈치역 부근 횡단보도 1', nameEn: 'Jagalchi Station Crosswalk 1' },
      { lat: 35.097107, lng: 129.025660, nameKr: '자갈치역 부근 횡단보도 2', nameEn: 'Jagalchi Station Crosswalk 2' },
      { lat: 35.098024, lng: 129.029357, nameKr: '자갈치역 부근 횡단보도 3', nameEn: 'Jagalchi Station Crosswalk 3' }
    ];
  } else if (stationId === 'nampo') {
    return [
      { lat: 35.097890, lng: 129.032372, nameKr: '남포역 부근 횡단보도 1', nameEn: 'Nampo Station Crosswalk 1' },
      { lat: 35.098062, lng: 129.035629, nameKr: '남포역 부근 횡단보도 2', nameEn: 'Nampo Station Crosswalk 2' },
      { lat: 35.098347, lng: 129.035651, nameKr: '남포역 부근 횡단보도 3', nameEn: 'Nampo Station Crosswalk 3' },
      { lat: 35.098099, lng: 129.035297, nameKr: '남포역 부근 횡단보도 4', nameEn: 'Nampo Station Crosswalk 4' }
    ];
  } else if (stationId === 'jeonpo') {
    return [
      { lat: 35.154631, lng: 129.065389, nameKr: '전포역 부근 횡단보도 1', nameEn: 'Jeonpo Station Crosswalk 1' }
    ];
  } else if (stationId === 'busan') {
    return [
      { lat: 35.114853, lng: 129.039498, nameKr: '부산역 부근 횡단보도 1', nameEn: 'Busan Station Crosswalk 1' },
      { lat: 35.115799, lng: 129.039960, nameKr: '부산역 부근 횡단보도 2', nameEn: 'Busan Station Crosswalk 2' }
    ];
  } else if (stationId === 'geumnyeonsan') {
    return [
      { lat: 35.150313, lng: 129.111266, nameKr: '금련산역 부근 횡단보도 1', nameEn: 'Geumnyeonsan Station Crosswalk 1' },
      { lat: 35.150413, lng: 129.110984, nameKr: '금련산역 부근 횡단보도 2', nameEn: 'Geumnyeonsan Station Crosswalk 2' }
    ];
  } else if (stationId === 'dongbaek') {
    return [
      { lat: 35.161513, lng: 129.147828, nameKr: '동백역 부근 횡단보도', nameEn: 'Dongbaek Station Crosswalk' }
    ];
  } else if (stationId === 'bexco') {
    return [
      { lat: 35.168088, lng: 129.137516, nameKr: '벡스코역 서측 횡단보도', nameEn: 'Bexco Station West Crosswalk' },
      { lat: 35.168937, lng: 129.138359, nameKr: '벡스코역 7번 출구 방면 횡단보도', nameEn: 'Bexco Station Exit 7 Crosswalk' },
      { lat: 35.168538, lng: 129.138828, nameKr: '벡스코역 남측 올림픽교차로 횡단보도', nameEn: 'Bexco Station South Intersection Crosswalk' },
      { lat: 35.168988, lng: 129.139266, nameKr: '벡스코역 2·4번 출구 삼거리 횡단보도', nameEn: 'Bexco Station Exit 2/4 Intersection Crosswalk' },
      { lat: 35.169338, lng: 129.138922, nameKr: '올림픽교차로 북측 횡단보도', nameEn: 'Olympic Intersection North Crosswalk' }
    ];
  }
  return [];
}
