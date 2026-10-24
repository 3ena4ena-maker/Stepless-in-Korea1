/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, X, Compass, Train, Bus, Map, Calendar, Sparkles, Info } from 'lucide-react';
import { DICTIONARY, Language } from '../i18n/dictionary';

interface HeaderProps {
  currentTab: string;
  tipsSubPage?: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  toggleLanguage: () => void;
  onToggleAdminMode?: () => void;
  isAdminMode?: boolean;
}

export default function Header({ currentTab, tipsSubPage, setCurrentTab, language, toggleLanguage, onToggleAdminMode, isAdminMode }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const clickCountRef = React.useRef(0);
  const clickTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const d = DICTIONARY[language];

  const menuItems = [
    { id: 'home', href: '/', label: d.nav.home, icon: Compass },
    { id: 'search', href: '/search', label: d.nav.search, icon: Train },
    { id: 'transit', href: '/tips/transit', label: d.nav.transit, icon: Bus },
    { id: 'courses', href: '/tips/courses', label: d.nav.courses, icon: Map },
    { id: 'schedule', href: '/schedule', label: d.nav.schedule, icon: Calendar },
    { id: 'exploration', href: '/tips/exploration', label: d.nav.exploration, icon: Sparkles },
    { id: 'about', href: '/about', label: d.nav.about, icon: Info },
  ];

  const isItemActive = (id: string) => {
    if (currentTab === id) return true;
    if (id === 'transit' && (currentTab === 'transit' || (currentTab === 'tips' && ['transit', 'child-free', 'bus-qr', 'transfer', 'taxi'].includes(tipsSubPage || '')))) return true;
    if (id === 'courses' && (currentTab === 'courses' || currentTab === 'tourapi' || currentTab.startsWith('itinerary-') || (currentTab === 'tips' && ['courses', 'index'].includes(tipsSubPage || '')))) return true;
    if (id === 'schedule' && (currentTab === 'schedule' || (currentTab === 'tips' && tipsSubPage === 'schedule'))) return true;
    if (id === 'exploration' && (currentTab === 'exploration' || (currentTab === 'tips' && ['exploration', 'community'].includes(tipsSubPage || '')))) return true;
    return false;
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setCurrentTab('home');

    clickCountRef.current += 1;
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      if (onToggleAdminMode) {
        onToggleAdminMode();
      }
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 2000);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FBFBF9]/95 backdrop-blur-md border-b border-[#E5E2DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <a 
            href="/"
            onClick={handleLogoClick} 
            className="flex items-center gap-2 cursor-pointer group select-none py-1 no-underline"
            id="header-logo-container"
            title="STEPLESS IN BUSAN 홈으로 이동"
          >
            <div className="flex items-center gap-2">
              <div className="flex flex-col text-left leading-[0.92]">
                <span className="text-sm sm:text-base font-black font-heading tracking-tight text-[#11161B] group-hover:text-[#8EA85E] transition-colors">
                  STEPLESS
                </span>
                <span className="text-sm sm:text-base font-black font-heading tracking-tight text-[#11161B] group-hover:text-[#8EA85E] transition-colors">
                  IN BUSAN
                </span>
              </div>
              {isAdminMode && (
                <span className="text-[10px] bg-rose-600 text-white font-mono px-1.5 py-0.5 rounded-sm font-bold animate-pulse">
                  ADMIN
                </span>
              )}
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5" aria-label="Global Navigation">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isItemActive(item.id);
              return (
                <a
                  key={item.id}
                  href={item.href}
                  id={`nav-btn-${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                    setCurrentTab(item.id);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-md text-xs lg:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap no-underline ${
                    isActive
                      ? 'text-[#8EA85E] bg-[#F1EFEC] font-bold'
                      : 'text-[#4A5568] hover:text-[#11161B] hover:bg-[#F1EFEC]/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 ${isActive ? 'text-[#8EA85E]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Language Switcher - Minimalist Text Toggle */}
          <div className="hidden md:flex items-center gap-3 border-l border-[#E5E2DC] pl-5">
            <div className="flex items-center text-xs font-mono tracking-wider select-none">
              <button
                type="button"
                onClick={() => { if (language !== 'KR') toggleLanguage(); }}
                className={`transition-colors cursor-pointer px-1.5 py-1 ${
                  language === 'KR' 
                    ? 'font-bold text-[#8EA85E] underline underline-offset-4 decoration-2' 
                    : 'text-slate-400 hover:text-[#11161B]'
                }`}
              >
                한국어
              </button>
              <span className="text-slate-300 mx-0.5">|</span>
              <button
                type="button"
                onClick={() => { if (language !== 'EN') toggleLanguage(); }}
                className={`transition-colors cursor-pointer px-1.5 py-1 ${
                  language === 'EN' 
                    ? 'font-bold text-[#8EA85E] underline underline-offset-4 decoration-2' 
                    : 'text-slate-400 hover:text-[#11161B]'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Mobile Menu & Language Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <div className="flex items-center text-xs font-mono select-none">
              <button
                type="button"
                onClick={toggleLanguage}
                className="px-2 py-1 text-xs font-semibold text-[#8EA85E] bg-[#F1EFEC] rounded-md border border-[#E5E2DC]"
              >
                {language === 'KR' ? '한국어' : 'English'}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#11161B] hover:bg-[#F1EFEC] transition-all flex items-center justify-center cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FBFBF9] border-b border-[#E5E2DC] shadow-md animate-fade-in">
          <div className="px-4 pt-3 pb-5 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isItemActive(item.id);
              return (
                <a
                  key={item.id}
                  href={item.href}
                  id={`mobile-nav-btn-${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-md text-sm font-semibold transition-all cursor-pointer no-underline ${
                    isActive
                      ? 'text-[#8EA85E] bg-[#F1EFEC] font-bold'
                      : 'text-[#4A5568] hover:bg-[#F1EFEC]/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#8EA85E]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
