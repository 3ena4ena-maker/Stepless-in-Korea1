/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, X, Compass, Train, HelpCircle, Info } from 'lucide-react';
import { DICTIONARY, Language } from '../i18n/dictionary';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  toggleLanguage: () => void;
  onToggleAdminMode?: () => void;
  isAdminMode?: boolean;
}

export default function Header({ currentTab, setCurrentTab, language, toggleLanguage, onToggleAdminMode, isAdminMode }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const clickCountRef = React.useRef(0);
  const clickTimerRef = React.useRef<any>(null);

  const d = DICTIONARY[language];

  const menuItems = [
    { id: 'home', label: d.nav.home, icon: Compass },
    { id: 'search', label: d.nav.search, icon: Train },
    { id: 'tips', label: d.nav.tips, icon: HelpCircle },
    { id: 'about', label: d.nav.about, icon: Info },
  ];

  const handleLogoClick = () => {
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
          <div 
            onClick={handleLogoClick} 
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="header-logo-container"
          >
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black font-heading tracking-tight text-[#11161B] group-hover:text-[#0A2540] transition-colors">
                {d.brand}
                {isAdminMode && (
                  <span className="ml-2 text-[10px] bg-rose-600 text-white font-mono px-1.5 py-0.5 rounded-sm font-bold animate-pulse">
                    ADMIN
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Global Navigation">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id || (item.id === 'tips' && currentTab.startsWith('itinerary-'));
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                    setCurrentTab(item.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'text-[#0A2540] bg-[#F1EFEC] font-bold border-b-2 border-[#0A2540]'
                      : 'text-[#4A5568] hover:text-[#11161B] hover:bg-[#F1EFEC]/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0A2540]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Language Switcher - Minimalist Text Toggle */}
          <div className="hidden md:flex items-center gap-3 border-l border-[#E5E2DC] pl-5">
            <div className="flex items-center text-xs font-mono tracking-wider select-none">
              <button
                onClick={() => { if (language !== 'KR') toggleLanguage(); }}
                className={`transition-colors cursor-pointer px-1.5 py-1 ${
                  language === 'KR' 
                    ? 'font-bold text-[#0A2540] underline underline-offset-4 decoration-2' 
                    : 'text-slate-400 hover:text-[#11161B]'
                }`}
              >
                한국어
              </button>
              <span className="text-slate-300 mx-0.5">|</span>
              <button
                onClick={() => { if (language !== 'EN') toggleLanguage(); }}
                className={`transition-colors cursor-pointer px-1.5 py-1 ${
                  language === 'EN' 
                    ? 'font-bold text-[#0A2540] underline underline-offset-4 decoration-2' 
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
                onClick={toggleLanguage}
                className="px-2 py-1 text-xs font-semibold text-[#0A2540] bg-[#F1EFEC] rounded-md border border-[#E5E2DC]"
              >
                {language === 'KR' ? '한국어' : 'English'}
              </button>
            </div>
            <button
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
              const isActive = currentTab === item.id || (item.id === 'tips' && currentTab.startsWith('itinerary-'));
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-btn-${item.id}`}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-md text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'text-[#0A2540] bg-[#F1EFEC] font-bold border-l-4 border-[#0A2540]'
                      : 'text-[#4A5568] hover:bg-[#F1EFEC]/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0A2540]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
