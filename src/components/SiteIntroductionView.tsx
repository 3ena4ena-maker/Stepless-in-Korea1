import React, { useState } from 'react';
import { UserCheck, Shield, FileText, Mail, Database, ExternalLink, CheckCircle2, Send, Heart, AlertCircle, Phone } from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';
import { AdSenseUnit } from './AdSenseManager';

interface SiteIntroductionViewProps {
  language?: 'KR' | 'EN';
  initialPage?: 'about' | 'privacy' | 'terms' | 'contact' | 'data-source';
  onSubTabChange?: (subTab: 'about' | 'privacy' | 'terms' | 'contact' | 'data-source') => void;
}

export function SiteIntroductionView({ 
  language = 'KR', 
  initialPage = 'about',
  onSubTabChange
}: SiteIntroductionViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'about' | 'privacy' | 'terms' | 'contact' | 'data-source'>(initialPage);

  React.useEffect(() => {
    setActiveSubTab(initialPage);
  }, [initialPage]);

  // Copy feedback state
  const [copiedEmail, setCopiedEmail] = useState(false);

  const officialEmail = 'floreur88@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(officialEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const subTabs = [
    { id: 'about', label: language === 'KR' ? '👤 운영자 소개' : '👤 About Operator', icon: UserCheck },
    { id: 'contact', label: language === 'KR' ? '✉️ 정보 제보 및 문의' : '✉️ Contact & Feedback', icon: Mail },
    { id: 'privacy', label: language === 'KR' ? '🔒 개인정보처리방침' : '🔒 Privacy Policy', icon: Shield },
    { id: 'terms', label: language === 'KR' ? '📄 이용약관' : '📄 Terms of Service', icon: FileText },
    { id: 'data-source', label: language === 'KR' ? '📊 데이터 출처' : '📊 Data Sources', icon: Database },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 text-left animate-fade-in" id="site-intro-container">
      
      {/* 5 Pages Navigation Header */}
      <div className="bg-white p-2.5 sm:p-4 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2">
          {subTabs.map(tab => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`site-intro-tab-${tab.id}`}
                onClick={() => {
                  const newSub = tab.id as 'about' | 'privacy' | 'terms' | 'contact' | 'data-source';
                  setActiveSubTab(newSub);
                  onSubTabChange?.(newSub);
                }}
                className={`px-2.5 py-2.5 sm:px-3 sm:py-3 rounded-2xl text-[11px] sm:text-sm font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer min-h-[44px] text-center ${
                  isActive
                    ? 'bg-[#004481] text-white border-[#004481] shadow-md ring-2 ring-blue-100'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PAGE 1: 운영자 소개 (Operator Intro) */}
      {activeSubTab === 'about' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3 space-y-4">
              <span className="inline-block px-3 py-1 bg-blue-50 text-[#004481] border border-blue-100 rounded-full text-xs font-black">
                {language === 'KR' ? '로컬 에디터 & 서비스 운영자' : 'Local Editor & Publisher'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {language === 'KR' ? '플로레르 (Florer)' : 'Florer'}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                {language === 'KR'
                  ? '본 플랫폼은 매일 출퇴근길에 무거운 큰 캐리어와 유모차를 들고 계단으로 힘들게 오르내리는 관광객들을 우연히 마주하면서 시작되었습니다.'
                  : 'Stepless in Korea began after noticing travelers struggling with heavy luggage and baby strollers on steep subway stairs across Busan.'}
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                {language === 'KR'
                  ? '바로 옆 출구에 편리한 엘리베이터가 이미 마련되어 있음에도, 명확한 안내 정보가 없어 이용하지 못하는 안타까운 상황을 개선하고자 현장 보행 동선을 직접 점검하고 기획·제작했습니다.'
                  : 'Despite nearby step-free vertical elevators, lacking navigation often forces detours. We review accessible routes, map key exits, and publish practical step-free transit guides.'}
              </p>

              {/* Explicit Plain-Text Contact Box on About Page for E-E-A-T */}
              <div className="pt-2">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      {language === 'KR' ? '운영자 공식 이메일' : 'Official Operator Email'}
                    </span>
                    <a 
                      href={`mailto:${officialEmail}`}
                      className="text-sm sm:text-base font-black text-[#004481] hover:underline font-mono"
                    >
                      {officialEmail}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {copiedEmail ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">{language === 'KR' ? '복사됨' : 'Copied'}</span>
                      </>
                    ) : (
                      <span>{language === 'KR' ? '이메일 복사' : 'Copy Email'}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                <img 
                  src="/images/busan_travelers_about_1782566089566.jpg" 
                  alt="Florer Operator Busan Transit"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              {language === 'KR' ? '운영 철학 및 현장 중심 가이드 원칙' : 'Publishing Philosophy & Field-Oriented Standard'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-2">
                <h4 className="font-extrabold text-[#004481] text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'KR' ? '현장 중심 동선 큐레이션' : 'Field-Oriented Route Curation'}</span>
                </h4>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {language === 'KR'
                    ? '공공 데이터 기본 정보에 머무르지 않고, 로컬 에디터 플로레르(Florer)가 부산 주요 거점 역을 직접 탐방하여 보도 단차, 횡단보도 유무, 엘리베이터 동선을 종합적으로 확인하고 안내합니다.'
                    : 'We do not rely solely on raw open data. We review major Busan transit hubs on-site to understand pedestrian paths, curb ramps, and vertical elevator connections.'}
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-2">
                <h4 className="font-extrabold text-[#004481] text-sm flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>{language === 'KR' ? '전면 무료 공익 서비스' : '100% Free Public Guide'}</span>
                </h4>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {language === 'KR'
                    ? '휠체어 이용 장애인, 유모차 동반 부모, 무거운 짐을 가진 여행객 모두가 조건 없이 무료로 이용할 수 있는 열린 배리어프리 플랫폼을 지향합니다.'
                    : 'Stepless is a completely free, open community resource dedicated to accessible mobility for wheelchair users, stroller parents, and luggage travelers alike.'}
                </p>
              </div>
            </div>
          </div>

          <VerificationBadge language={language} variant="card" />

          {/* AdSense Allowed on Publisher Author Story */}
          <AdSenseUnit currentParams={{ currentTab: 'about', siteSubPage: 'about' }} />
        </div>
      )}

      {/* PAGE 2: 정보 오류 요청 제보 및 문의 (Inquiry & Data Corrections) */}
      {activeSubTab === 'contact' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fade-in max-w-3xl mx-auto google-anno-skip" data-ad-exclude="true">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="p-2.5 rounded-xl bg-blue-50 text-[#004481]">
              <Mail className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                {language === 'KR' ? '✉️ 정보 오류 요청 제보 및 공식 문의' : '✉️ Inquiries & Field Feedback'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {language === 'KR'
                  ? '부산 지하철역 엘리베이터 위치, 출구 정정, 시설 공사 정보 제보 및 서비스 공식 문의 창구'
                  : 'Official contact channel for elevator maintenance feedback, exit corrections, and service inquiries.'}
              </p>
            </div>
          </div>

          {/* Simple Direct Email Card */}
          <div className="bg-slate-50/80 p-6 sm:p-8 rounded-3xl border border-slate-200/90 space-y-5">
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#004481]" />
                <span>{language === 'KR' ? '공식 대표 이메일 안내' : 'Official Operator Email Channel'}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {language === 'KR'
                  ? '부산 지하철 배리어프리 정보 정정 요청, 공사 제보 및 제휴·광고 정책 문의는 아래 공식 이메일로 보내주시면 운영자 플로레르가 신속히 확인 후 답변 드립니다.'
                  : 'For transit corrections, out-of-order elevator alerts, or privacy inquiries, contact the operator directly via our verified email below.'}
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-white rounded-2xl border border-blue-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-2xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">
                  {language === 'KR' ? '공식 대표 이메일' : 'Official Email Address'}
                </p>
                <a 
                  href={`mailto:${officialEmail}?subject=${encodeURIComponent(language === 'KR' ? '[스탭리스] 정보 오류 제보 및 문의' : '[Stepless] Inquiry & Feedback')}`}
                  className="text-base sm:text-lg font-black text-[#004481] hover:underline font-mono"
                >
                  {officialEmail}
                </a>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  {copiedEmail ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">{language === 'KR' ? '복사됨!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <span>{language === 'KR' ? '주소 복사' : 'Copy'}</span>
                  )}
                </button>

                <a
                  href={`mailto:${officialEmail}?subject=${encodeURIComponent(language === 'KR' ? '[스탭리스] 정보 오류 제보 및 문의' : '[Stepless] Feedback & Inquiry')}&body=${encodeURIComponent(language === 'KR' ? '[스탭리스 정보 오류 제보 및 문의]\n\n- 역명/출구:\n- 오류/의견 내용:\n\n* 플로레르 대표 이메일(floreur88@gmail.com)로 발송됩니다.' : '[Stepless Inquiry & Report]\n\n- Station / Exit:\n- Details:\n\n* Directly routed to publisher (floreur88@gmail.com).')}`}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-[#004481] hover:bg-blue-900 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'KR' ? '메일 보내기' : 'Send Mail'}</span>
                </a>
              </div>
            </div>

            <div className="pt-1 text-2xs sm:text-xs text-slate-500 space-y-1 font-medium bg-blue-50/50 p-3.5 rounded-xl border border-blue-100/80">
              <p className="font-bold text-[#004481] flex items-center gap-1">
                💡 {language === 'KR' ? '손쉬운 제보 안내' : 'Direct Email Assistance'}
              </p>
              <p className="leading-relaxed">
                {language === 'KR'
                  ? '<strong>[메일 보내기]</strong>를 클릭하시면 스마트폰이나 PC의 기본 이메일 앱(Gmail, Apple Mail 등)이 바로 열립니다. 메일 앱이 연결되지 않는 환경에서는 <strong>[주소 복사]</strong> 버튼을 이용해 주십시오.'
                  : 'Clicking <strong>[Send Mail]</strong> connects to your default email client (Gmail, Apple Mail). If an email client is not configured, please copy the address above.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 3: 개인정보처리방침 (Privacy Policy) */}
      {activeSubTab === 'privacy' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed animate-fade-in google-anno-skip" data-ad-exclude="true">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="p-2.5 rounded-xl bg-blue-50 text-[#004481]">
              <Shield className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                {language === 'KR' ? '🔒 개인정보처리방침 (Privacy Policy)' : '🔒 Privacy Policy'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'KR'
                  ? '쿠키·광고·분석·위치·제보 데이터 처리 수칙 및 프라이버시 보호 안내'
                  : 'Cookie disclosure, personalized advertising, geolocation data, and privacy protection guidelines.'}
              </p>
            </div>
          </div>

          <div className="bg-sky-50 p-4 border border-sky-100 rounded-2xl text-sky-900 font-medium">
            {language === 'KR'
              ? '📢 Stepless는 회원가입, 로그인, 주민등록번호 수집 등 직접 식별이 가능한 개인정보를 일절 저장하거나 요구하지 않는 프라이버시 보호 중심 서비스입니다.'
              : '📢 Stepless is a privacy-first service that does not collect, store, or require personal identifiers like logins, phone numbers, or national identification numbers.'}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#004481]"></span>
                <span>{language === 'KR' ? '1. 위치정보(Geolocation) 처리 안내' : '1. Geolocation Data Handling'}</span>
              </h3>
              <p className="font-medium text-slate-600 leading-relaxed pl-3.5">
                {language === 'KR'
                  ? '\'내 주변 역 및 출구 검색\' 기능을 사용할 때 이용자의 위치 정보(GPS 및 네트워크 좌표)는 사용자의 브라우저 동의 하에 단말기 내부에서 일회성 거리 계산 용도로만 활용됩니다. 해당 위치 데이터는 외부 서버로 전송되거나 저장되지 않으며 연산 즉시 파기됩니다.'
                  : 'When using nearby station search, your GPS/network coordinates are processed strictly inside your device browser session for one-time distance calculation. No location history is transmitted to or stored on remote servers.'}
              </p>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#004481]"></span>
                <span>{language === 'KR' ? '2. 쿠키(Cookie) 수집 및 이용 목적' : '2. Cookies & Purpose of Collection'}</span>
              </h3>
              <p className="font-medium text-slate-600 leading-relaxed pl-3.5">
                {language === 'KR'
                  ? '쿠키는 웹사이트 이용 시 이용자의 브라우저에 저장되는 소규모 텍스트 파일입니다. 본 서비스는 사용자 환경설정(언어 선택 등) 유지, 접속 품질 향상, 그리고 서비스의 지속적인 데이터 업데이트 운영을 위한 타사 서비스 연동 시 쿠키를 활용할 수 있습니다.'
                  : 'Cookies are small text files stored in your browser. We use cookies to remember preferences (such as language), optimize performance, and support third-party integrations essential for maintaining data updates.'}
              </p>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#004481]"></span>
                <span>{language === 'KR' ? '3. 웹/앱 서비스 사용 분석(Analytics)' : '3. Anonymous Web Analytics'}</span>
              </h3>
              <p className="font-medium text-slate-600 leading-relaxed pl-3.5">
                {language === 'KR'
                  ? '본 웹사이트는 이용자의 방문 패턴, 검색 빈도가 높은 주요 역, 접속 기기 유형 등 익명의 통계성 데이터(Analytics)를 수집 및 분석할 수 있습니다. 수집된 통계 데이터는 오직 서비스 기능 개선 및 보행자 동선 가이드 품질 향상 목적으로만 활용되며 개인을 식별하지 않습니다.'
                  : 'We may process anonymous analytics regarding aggregate visit frequency and device types. This anonymous statistical data is used solely to improve navigation guide quality and does not identify individuals.'}
              </p>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#004481]"></span>
                <span>{language === 'KR' ? '4. 구글 맞춤형 광고 및 쿠키 거부(Opt-out) 수칙' : '4. Google Personalized Advertising & Opt-out'}</span>
              </h3>
              <div className="pl-3.5 space-y-2 text-slate-600 font-medium">
                <p>
                  {language === 'KR'
                    ? '1) 본 서비스는 공익적인 무료 데이터 서비스 유지 및 지속 관리를 위해 구글 애드센스(Google AdSense) 등 제3자 광고 사업자의 광고를 게재할 수 있습니다.'
                    : '1) To maintain continuous free field audits and service availability, we may display third-party advertisements via Google AdSense.'}
                </p>
                <p>
                  {language === 'KR'
                    ? '2) 구글 등 제3자 광고업체는 이용자의 웹사이트 방문 기록을 기반으로 유용한 맞춤형 광고를 제공하기 위해 쿠키 기술을 활용할 수 있습니다.'
                    : '2) Third-party vendors, including Google, use cookies to serve ads based on prior visits to this or other websites.'}
                </p>
                <p>
                  {language === 'KR'
                    ? '3) 이용자는 언제든지 아래의 공식 설정 링크를 통해 개인 맞춤형 광고 수신을 해제하거나 차단할 수 있습니다:'
                    : '3) Users may opt out of personalized advertising by visiting the following links:'}
                </p>
                <ul className="list-disc pl-5 space-y-1.5 font-bold text-blue-600 pt-1">
                  <li>
                    <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center gap-1">
                      <span>{language === 'KR' ? '구글 개인 맞춤형 광고 설정 관리' : 'Google Ads Settings'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center gap-1">
                      <span>{language === 'KR' ? '디지털광고협회(DAA) 맞춤형 광고 차단 센터' : 'Digital Advertising Alliance (aboutads.info)'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#004481]"></span>
                <span>{language === 'KR' ? '5. 정보 오류 제보 및 문의 데이터 처리 방침' : '5. Handling of Inquiries & Feedback'}</span>
              </h3>
              <p className="font-medium text-slate-600 leading-relaxed pl-3.5">
                {language === 'KR'
                  ? `이용자가 대표 이메일(${officialEmail})을 통해 정보 오류 제보, 정정 요청, 일반 문의를 전송하는 경우, 수신된 작성 내용 및 이메일 주소는 오직 제보 내용의 현장 검증, 데이터 정정, 문의 답변 목적으로만 한정하여 이용됩니다. 해당 문의 처리 및 검증 목적이 달성된 후에는 수신된 이메일 데이터를 즉시 파기하거나 안전하게 관리합니다.`
                  : `When users submit feedback or inquiries to ${officialEmail}, the provided message and sender email address are used strictly for auditing transit data and replying to user requests, after which they are securely managed or discarded.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 4: 이용약관 (Terms of Service) */}
      {activeSubTab === 'terms' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed animate-fade-in google-anno-skip" data-ad-exclude="true">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
              <FileText className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                {language === 'KR' ? '📄 서비스 이용약관 및 면책사항 (Terms of Service)' : '📄 Terms of Service & Disclaimer'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'KR'
                  ? '실시간 시설 변동 가능성, 안전 가이드라인 및 면책 기준'
                  : 'Facility variability, safety guidelines, and limitation of liability.'}
              </p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 border border-amber-200/80 rounded-2xl text-amber-950 font-medium">
            {language === 'KR'
              ? '⚠️ 본 서비스는 부산 지하철 이용자의 편의를 돕기 위한 보행 가이드 플랫폼입니다. 이동 시 현장의 실시간 안내 표지판과 안전 규정을 항상 최우선으로 준수해 주시기 바랍니다.'
              : '⚠️ Stepless is an informational pedestrian guide. Please prioritize on-site transit station signs, staff directions, and local street safety regulations at all times.'}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5">
                {language === 'KR' ? '제 1 조 (목적)' : 'Article 1 (Purpose)'}
              </h3>
              <p className="font-medium text-slate-600 leading-relaxed">
                {language === 'KR'
                  ? '본 약관은 Stepless(이하 "서비스")가 제공하는 부산 지하철 배리어프리, 엘리베이터 위치, 출구 안내 및 관련 정보 서비스의 이용 조건과 절차, 이용자의 주의사항을 규정함을 목적으로 합니다.'
                  : 'These Terms govern the use of the Stepless barrier-free transit navigation and accessibility guide for Busan metro stations and tourist itineraries.'}
              </p>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5">
                {language === 'KR' ? '제 2 조 (실시간 시설 변동 가능성 및 정보의 한계)' : 'Article 2 (Facility Variability & Disclaimer)'}
              </h3>
              <div className="space-y-2 font-medium text-slate-600 leading-relaxed">
                <p>
                  {language === 'KR'
                    ? '1. 본 서비스에서 제공하는 승강기(엘리베이터 및 에스컬레이터) 위치, 출구 번호, 휠체어 리프트 및 노선 가이드는 현장 조사, 공식 공공데이터 및 이용자 제보를 바탕으로 정기 수집·검증됩니다.'
                    : '1. Station elevator locations, exit numbers, and barrier-free routes are compiled via physical site audits, public open data, and verified user feedback.'}
                </p>
                <p>
                  {language === 'KR'
                    ? '2. 실시간 변동성 안내: 부산교통공사, 한국철도공사 등 역사를 관리하는 기관의 긴급 시설 점검, 갑작스러운 기계 고장, 보수 공사, 기상 악화, 임시 출구 통제 등에 의해 현장의 실시간 시설 상태와 서비스 안내 내용 간 일시적 불일치가 발생할 수 있습니다.'
                    : '2. Unannounced maintenance, sudden machinery failure, construction, or bad weather managed by transit authorities may cause temporary discrepancies.'}
                </p>
                <p>
                  {language === 'KR'
                    ? '3. 본 서비스는 정보의 최신화를 위해 최선을 다하나, 현장의 모든 실시간 물리적 상황에 대한 법적·완벽한 정합성을 직접 보증하지는 않으므로 참고 자료로 활용하시기 바랍니다.'
                    : '3. While we strive for accuracy, Stepless provides information on an "as-is" basis as a navigational reference and disclaims absolute warranty.'}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5">
                {language === 'KR' ? '제 3 조 (현장 안전 수칙 및 이용자 주의 의무)' : 'Article 3 (Safety Rules & User Responsibility)'}
              </h3>
              <div className="space-y-2 font-medium text-slate-600 leading-relaxed">
                <p>
                  {language === 'KR'
                    ? '1. 현장 수칙 우선: 휠체어, 유모차, 보행 보조기 이용자, 노약자 및 모든 통행자는 이동 중 역 내부의 실시간 안내 방송, 안전 요원의 지시, 횡단보도 신호등, 현장 안내 표지판을 항상 최우선으로 따라야 합니다.'
                    : '1. Pedestrians must prioritize station announcements, traffic lights, and on-duty personnel directions over digital suggestions.'}
                </p>
                <p>
                  {language === 'KR'
                    ? '2. 안전 이용 수칙: 엘리베이터 승하차 시 문 열림/닫힘 및 승강장 단차 주의, 에스컬레이터 손잡이 잡기, 무리한 탑승 금지 등 표준 이동약자 안전 수칙을 반드시 준수하여야 합니다.'
                    : '2. Standard accessibility safety practices (caution with elevator doors, gap vigilance, escalator handrails) must be strictly observed.'}
                </p>
                <p>
                  {language === 'KR'
                    ? '3. 자기 책임 원칙: 본 서비스의 안내를 참조하여 이동하는 과정에서 이용자 본인의 주의 의무 소홀, 현장 규정 미준수 또는 예외적인 현장 상황으로 발생한 안전사고 및 손해에 대해 서비스 운영자는 법적 책임을 지지 않습니다.'
                    : '3. Users navigate at their own discretion; the operator is not liable for accidents caused by non-compliance with station safety rules.'}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5">
                {language === 'KR' ? '제 4 조 (서비스의 변경 및 문의)' : 'Article 4 (Updates & Contact)'}
              </h3>
              <p className="font-medium text-slate-600 leading-relaxed">
                {language === 'KR'
                  ? `운영자는 이용자에게 보다 안전하고 정확한 이동 정보를 제공하기 위해 사전 통지 없이 서비스의 일부 또는 전부를 수정·업데이트할 수 있으며, 데이터 오류 제보는 대표 이메일 창구(${officialEmail})를 통해 상시 접수받습니다.`
                  : `Service features may be updated without prior notice to enhance transit accuracy. Data corrections and inquiries are accepted at ${officialEmail}.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 5: 데이터 출처 (Data Sources) */}
      {activeSubTab === 'data-source' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8 animate-fade-in google-anno-skip" data-ad-exclude="true">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
              <Database className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                {language === 'KR' ? '📊 데이터 출처 (Data Sources)' : '📊 Verified Data Sources'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'KR'
                  ? '공식 지도, 공공데이터 및 대중교통 데이터 출처 명시'
                  : 'Official transit authorities and open government data credentials.'}
              </p>
            </div>
          </div>

          {/* Section 1: Official Data Sources */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h3 className="font-black text-slate-900 text-base">
              {language === 'KR' ? '공식 연계 데이터 출처' : 'Official Data Providers'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-1">
                <div className="font-extrabold text-blue-600 flex items-center justify-between">
                  <span>네이버지도 (Naver Map)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
                <p className="text-slate-500 text-2xs font-medium">
                  {language === 'KR' ? '실시간 위치 및 역별 공식 출처 연계' : 'Real-time location & exit reference'}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-1">
                <div className="font-extrabold text-emerald-600 flex items-center justify-between">
                  <span>부산교통공사 (Humetro)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
                <p className="text-slate-500 text-2xs font-medium">
                  {language === 'KR' ? '도시철도 역 구조도 및 출구 규격' : 'Subway blueprints & exit specifications'}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-1">
                <div className="font-extrabold text-slate-800 flex items-center justify-between">
                  <span>공공데이터포털 / TourAPI</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
                <p className="text-slate-500 text-2xs font-medium">
                  {language === 'KR' ? '전국 도시철도 승강기 및 무장애 관광 정보' : 'Korea Tourism Organization Barrier-Free TourAPI'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
