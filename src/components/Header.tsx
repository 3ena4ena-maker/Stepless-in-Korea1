/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, X, Compass, Train, Bus, Map, Calendar, Sparkles, Info, Globe, ChevronDown, Check } from 'lucide-react';
import { DICTIONARY, Language, LANGUAGE_OPTIONS } from '../i18n/dictionary';

interface HeaderProps {
  currentTab: string;
  tipsSubPage?: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  toggleLanguage: () => void;
  onSelectLanguage?: (lang: Language) => void;
  onToggleAdminMode?: () => void;
  isAdminMode?: boolean;
}

export default function Header({
  currentTab,
  tipsSubPage,
  setCurrentTab,
  language,
  toggleLanguage,
  onSelectLanguage,
  onToggleAdminMode,
  isAdminMode,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);
  const langMenuRef = React.useRef<HTMLDivElement>(null);
  const clickCountRef = React.useRef(0);
  const clickTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const d = DICTIONARY[language] || DICTIONARY.KR;
  const currentLangOption = LANGUAGE_OPTIONS.find((opt) => opt.code === language) || LANGUAGE_OPTIONS[0];

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLangChange = (target: Language) => {
    setLangMenuOpen(false);
    if (onSelectLanguage) {
      onSelectLanguage(target);
    } else if (target !== language) {
      toggleLanguage();
    }
  };

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
        <div className="flex justify-between items-center h-16 sm:h-20 gap-2">
          {/* Logo */}
          <a 
            href="/"
            onClick={handleLogoClick} 
            className="flex items-center gap-2 cursor-pointer group select-none py-1 no-underline shrink-0"
            id="header-logo-container"
            title="STEPLESS IN BUSAN"
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
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#8EA85E]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Language Dropdown & Mobile Hamburger */}
          <div className="flex items-center gap-2 shrink-0" ref={langMenuRef} aria-label="Language switcher">
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen((prev) => !prev)}
                aria-expanded={langMenuOpen}
                aria-haspopup="listbox"
                title="Select Language"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white hover:bg-[#F1EFEC] border border-[#E5E2DC] shadow-2xs text-xs sm:text-[13px] font-bold text-[#11161B] transition-all cursor-pointer select-none"
              >
                <Globe className="w-3.5 h-3.5 text-[#6B853E] shrink-0" />
                <span>{currentLangOption.label}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                    langMenuOpen ? 'rotate-180 text-[#6B853E]' : ''
                  }`}
                />
              </button>

              {langMenuOpen && (
                <div
                  role="listbox"
                  aria-label="Select Language"
                  className="absolute right-0 mt-2 w-44 rounded-xl bg-white border border-[#E5E2DC] shadow-lg py-1.5 z-50 animate-fade-in"
                >
                  {LANGUAGE_OPTIONS.map((opt) => {
                    const isSelected = language === opt.code;
                    return (
                      <button
                        key={opt.code}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleLangChange(opt.code)}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs sm:text-[13px] transition-colors cursor-pointer text-left ${
                          isSelected
                            ? 'bg-[#EDF4E3] text-[#4D6328] font-extrabold'
                            : 'text-slate-700 hover:bg-[#F8F7F4] font-medium'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm leading-none">{opt.flag}</span>
                          <span>{opt.label}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#6B853E] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-[#11161B] hover:bg-[#F1EFEC] transition-all flex items-center justify-center cursor-pointer"
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
