import React from 'react';

export interface LockerCount {
  small: number;
  med?: number;
  large?: number;
  xlarge?: number;
}

export const STATION_LOCKER_DATA: Record<string, Record<string, LockerCount> | LockerCount> = {
  seomyeon: {
    '1': { small: 38, med: 64, large: 14, xlarge: 46 },
    '2': { small: 58, large: 22, xlarge: 30 }
  },
  suyeong: {
    '2': { small: 10, large: 4, xlarge: 2 },
    '3': { small: 10, large: 6, xlarge: 4 }
  },
  bujeon: {
    '1': { small: 10, med: 12, xlarge: 4 }
  },
  jeonpo: { small: 32, large: 26, xlarge: 14 },
  haeundae: { small: 85, large: 40, xlarge: 29 },
  gwangan: { small: 50, large: 20, xlarge: 10 },
  nampo: { small: 33, med: 46, xlarge: 42 },
  busan: { small: 18, med: 52, large: 6, xlarge: 36 },
  jagalchi: { small: 34, med: 42, large: 4, xlarge: 27 },
  geumnyeonsan: { small: 18, large: 8, xlarge: 4 },
  dongbaek: { small: 12, large: 6, xlarge: 2 },
  bexco: {
    '2': { small: 32, large: 16, xlarge: 12 },
    '동해': { small: 10, large: 4, xlarge: 4 }
  },
  jungang: { small: 24, med: 30, large: 8, xlarge: 16 },
  dadaepo: { small: 30, med: 20, large: 12, xlarge: 18 },
  beomeosa: { small: 16, med: 12, xlarge: 6 },
  'centum-city': { small: 42, med: 24, large: 18, xlarge: 16 },
  sasang: {
    '2': { small: 36, med: 24, large: 14, xlarge: 20 },
    '김해': { small: 20, large: 10, xlarge: 10 }
  },
  toseong: { small: 18, med: 10, large: 6, xlarge: 6 },
  osiria: { small: 24, med: 12, large: 10, xlarge: 8 },
  songjeong: { small: 14, med: 8, large: 6, xlarge: 4 },
  namcheon: { small: 16, med: 8, large: 6, xlarge: 4 },
  oncheonjang: { small: 20, med: 12, large: 6, xlarge: 6 }
};

export const formatLockerCount = (data: LockerCount, lang: 'KR' | 'EN'): string => {
  const parts: string[] = [];
  if (lang === 'KR') {
    if (data.small) parts.push(`소 ${data.small}`);
    if (data.med) parts.push(`중 ${data.med}`);
    if (data.large) parts.push(`대 ${data.large}`);
    if (data.xlarge) parts.push(`특대 ${data.xlarge}`);
  } else {
    if (data.small) parts.push(`S ${data.small}`);
    if (data.med) parts.push(`M ${data.med}`);
    if (data.large) parts.push(`L ${data.large}`);
    if (data.xlarge) parts.push(`XL ${data.xlarge}`);
  }
  return parts.join(' ');
};

export const getLockerInfoText = (stationId: string, language: 'KR' | 'EN'): string => {
  const data = STATION_LOCKER_DATA[stationId];
  if (!data) return language === 'KR' ? '있음' : 'Available';

  const isMultiLine = '1' in data || '2' in data || '3' in data || '동해' in data || '김해' in data;
  if (isMultiLine) {
    const multi = data as Record<string, LockerCount>;
    return Object.entries(multi)
      .map(([line, counts]) => {
        const lineStr = language === 'KR'
          ? (line === '동해' ? '동해선' : line === '김해' ? '김해경전철' : `${line}호선`)
          : (line === '동해' ? 'Donghae' : line === '김해' ? 'Gimhae LRT' : `Line ${line}`);
        return `${lineStr}: ${formatLockerCount(counts, language)}`;
      })
      .join(' / ');
  } else {
    return formatLockerCount(data as LockerCount, language);
  }
};

export const getLineColor = (line: string): string => {
  switch (line) {
    case '1':
      return '#F06A00'; // 부산 1호선 주황
    case '2':
      return '#2DA643'; // 부산 2호선 초록
    case '3':
      return '#BB8C00'; // 부산 3호선 황갈색
    case '4':
      return '#005BAB'; // 부산 4호선 파랑
    case '동해':
      return '#004960'; // 동해선 짙은 파랑
    case '김해':
    case '부산김해':
      return '#6B4BA3'; // 부산김해경전철 보라
    default:
      return '#004481';
  }
};

export const renderLockerBadges = (data: LockerCount, lang: 'KR' | 'EN'): React.ReactNode => {
  const categories = [
    { 
      key: 'small', 
      labelKR: '소형', 
      labelEN: 'S', 
      badgeClass: 'bg-[#F2F8F4] border-[#D4EAD9]', 
      numClass: 'text-[#1B5E20]',
      labelClass: 'text-[#2D7344]'
    },
    { 
      key: 'med', 
      labelKR: '중형', 
      labelEN: 'M', 
      badgeClass: 'bg-[#F1F6FB] border-[#D3E3F2]', 
      numClass: 'text-[#1E4976]',
      labelClass: 'text-[#2B6094]'
    },
    { 
      key: 'large', 
      labelKR: '대형', 
      labelEN: 'L', 
      badgeClass: 'bg-[#FDF7EE] border-[#F5E5C9]', 
      numClass: 'text-[#7A450A]',
      labelClass: 'text-[#9A5B13]'
    },
    { 
      key: 'xlarge', 
      labelKR: '특대', 
      labelEN: 'XL', 
      badgeClass: 'bg-[#FDF2F4] border-[#F7D3D9]', 
      numClass: 'text-[#931D38]',
      labelClass: 'text-[#B8324F]'
    },
  ] as const;

  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 justify-start">
      {categories.map(({ key, labelKR, labelEN, badgeClass, numClass, labelClass }) => {
        const val = data[key];
        if (!val) return null;
        const label = lang === 'KR' ? labelKR : labelEN;
        return (
          <span 
            key={key} 
            className={`inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-lg text-xs font-bold border ${badgeClass} shadow-2xs whitespace-nowrap`}
          >
            <span className={`font-semibold text-[11px] ${labelClass}`}>{label}</span>
            <span className={`font-black text-xs sm:text-sm tracking-tight ${numClass}`}>{val}</span>
          </span>
        );
      })}
    </div>
  );
};

export const renderLockerInfo = (stationId: string, language: 'KR' | 'EN'): React.ReactNode => {
  const data = STATION_LOCKER_DATA[stationId];
  if (!data) {
    return (
      <div className="flex items-center py-1 text-slate-400 font-medium text-xs">
        {language === 'KR' ? '역내 보관함 정보 미비 / 현장 확인 필요' : 'No locker data available'}
      </div>
    );
  }

  const isMultiLine = '1' in data || '2' in data || '3' in data || '동해' in data || '김해' in data;
  if (isMultiLine) {
    const multi = data as Record<string, LockerCount>;
    return (
      <div className="flex flex-col gap-2 w-full">
        {Object.entries(multi).map(([line, counts]) => {
          const lineStr = language === 'KR' 
            ? (line === '동해' ? '동해선' : line === '김해' ? '김해경전철' : `${line}호선`) 
            : (line === '동해' ? 'Donghae' : line === '김해' ? 'Gimhae LRT' : `Line ${line}`);
          return (
            <div key={line} className="flex flex-wrap sm:flex-nowrap items-center justify-start gap-2 sm:gap-3 w-full pb-1.5 last:pb-0 border-b border-dashed border-slate-200/60 last:border-0">
              <span 
                className="text-xs sm:text-[13px] font-black shrink-0 whitespace-nowrap self-start sm:self-center tracking-tight"
                style={{ color: getLineColor(line) }}
              >
                {lineStr}
              </span>
              {renderLockerBadges(counts, language)}
            </div>
          );
        })}
      </div>
    );
  } else {
    return (
      <div className="flex justify-start w-full">
        {renderLockerBadges(data as LockerCount, language)}
      </div>
    );
  }
};
