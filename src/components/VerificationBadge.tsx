import React, { useState } from 'react';
import { CheckCircle2, ExternalLink, UserCheck, Calendar, AlertCircle, Send, Check } from 'lucide-react';
import { getTodayDate } from '../utils';

interface VerificationBadgeProps {
  language?: 'KR' | 'EN';
  className?: string;
  stationName?: string;
  variant?: 'card' | 'inline' | 'compact';
  onOpenReportModal?: () => void;
}

export function VerificationBadge({ 
  language = 'KR', 
  className = '', 
  stationName,
  variant = 'card',
  onOpenReportModal
}: VerificationBadgeProps) {
  const todayStr = getTodayDate(language);
  const [showQuickReportModal, setShowQuickReportModal] = useState(false);
  const [reportText, setReportText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const naverSearchUrl = stationName 
    ? `https://map.naver.com/v5/search/${encodeURIComponent(stationName)}`
    : 'https://map.naver.com';

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setShowQuickReportModal(false);
      setReportText('');
    }, 2000);
  };

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs text-slate-500 ${className}`}>
        <span className="font-bold text-slate-700 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{language === 'KR' ? '현장 중심 안내' : 'Field-Oriented Guide'}</span>
        </span>
        <span className="text-slate-300">|</span>
        <span>{language === 'KR' ? '에디터:' : 'Editor:'} <strong className="text-slate-700 font-medium">{language === 'KR' ? 'Florer (로컬 에디터)' : 'Florer (Local Editor)'}</strong></span>
        <span className="text-slate-300">|</span>
        <span>{language === 'KR' ? '점검 기준:' : 'Review Standard:'} <strong className="text-slate-700 font-medium">2026.08</strong></span>
        <span className="text-slate-300">|</span>
        <span>{language === 'KR' ? '현행화:' : 'Sync:'} <strong className="text-slate-700 font-medium">{language === 'KR' ? '정기 검토' : 'Regular Review'}</strong></span>
        <span className="text-slate-300">|</span>
        <span>
          {language === 'KR' ? '출처:' : 'Source:'}{' '}
          <a 
            href={naverSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium underline inline-flex items-center gap-0.5"
          >
            <span>{language === 'KR' ? '부산교통공사·네이버' : 'Humetro·Naver'}</span>
            <ExternalLink className="w-2.5 h-2.5 text-blue-600" />
          </a>
        </span>
        <span className="text-slate-300">|</span>
        <button
          onClick={() => onOpenReportModal ? onOpenReportModal() : setShowQuickReportModal(true)}
          className="text-amber-700 hover:text-amber-900 font-bold underline cursor-pointer inline-flex items-center gap-0.5"
        >
          <AlertCircle className="w-3 h-3 text-amber-600" />
          <span>{language === 'KR' ? '오류 제보' : 'Report Error'}</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-gradient-to-r from-emerald-50/90 via-slate-50 to-blue-50/80 border border-emerald-200/80 rounded-2xl p-3.5 sm:p-4 text-xs text-slate-700 shadow-xs ${className}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 font-extrabold text-emerald-900 bg-emerald-100/90 px-3 py-1 rounded-xl border border-emerald-300/80 shadow-2xs text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{language === 'KR' ? '현장 중심 동선 가이드' : 'Field-Oriented Route Guide'}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-slate-700">
            <span className="inline-flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{language === 'KR' ? '에디터:' : 'Editor:'} <strong className="text-slate-900 font-bold">{language === 'KR' ? 'Florer' : 'Florer'}</strong></span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{language === 'KR' ? '점검 기준:' : 'Review Basis:'} <strong className="text-slate-900 font-bold">2026.08</strong></span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="inline-flex items-center gap-1">
              <span>{language === 'KR' ? '운영 관리:' : 'Management:'} <strong className="text-slate-900 font-bold">{language === 'KR' ? '정기 현행화' : 'Periodic Review'}</strong></span>
              <span className="text-2xs text-[#004481] font-bold">{language === 'KR' ? '(상시 검토)' : '(Active)'}</span>
            </span>
            <span className="text-slate-300">|</span>
            <span>
              {language === 'KR' ? '공식 출처:' : 'Source:'} {' '}
              <a
                href={naverSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-bold underline inline-flex items-center gap-0.5"
              >
                <span>{language === 'KR' ? '부산교통공사·네이버지도' : 'Humetro / Naver Map'}</span>
                <ExternalLink className="w-3 h-3 text-blue-600" />
              </a>
            </span>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => onOpenReportModal ? onOpenReportModal() : setShowQuickReportModal(true)}
              className="inline-flex items-center gap-1 text-amber-800 bg-amber-100/90 hover:bg-amber-200 border border-amber-300/80 px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'KR' ? '🚨 오류 제보' : '🚨 Report Error'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Report Modal */}
      {showQuickReportModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4 animate-scale-up text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <AlertCircle className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {language === 'KR' ? `${stationName || '해당 역'} 정보 오류 제보` : `Report Error for ${stationName || 'Station'}`}
                </h3>
              </div>
              <button 
                onClick={() => setShowQuickReportModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  {language === 'KR' ? '오류 제보가 정상적으로 접수되었습니다!' : 'Report successfully submitted!'}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'KR' ? '소중한 의견 감사드립니다. 확인 후 신속히 반영하겠습니다.' : 'Thank you for your feedback. We will verify and update as soon as possible.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'KR' ? '오류 내용 및 수정요청 사항' : 'Error details & Request'}
                  </label>
                  <textarea
                    rows={3}
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder={language === 'KR' ? '예: 5번 출구 엘리베이터 공사 중 / 출구 번호 오기재 등' : 'e.g. Exit 5 elevator under maintenance'}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="bg-slate-50 p-3 rounded-xl text-2xs text-slate-500 space-y-1">
                  <p>• {language === 'KR' ? '이메일 문의:' : 'Email Contact:'} <strong className="text-slate-800">floreur88@gmail.com</strong></p>
                  <p>• {language === 'KR' ? '접수된 내용은 운영자 확인 후 24시간 이내 반영됩니다.' : 'Reports will be reviewed and updated within 24 hours.'}</p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowQuickReportModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    {language === 'KR' ? '취소' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{language === 'KR' ? '제보하기' : 'Submit Report'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

