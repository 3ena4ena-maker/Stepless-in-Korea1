import React, { useEffect, useRef } from 'react';

export const ADSENSE_CLIENT_ID = 'ca-pub-1023768343506419';

export interface AdEligibilityParams {
  currentTab: string;
  tipsSubPage?: string;
  siteSubPage?: string;
  showPrivacyModal?: boolean;
  showTermsModal?: boolean;
  submittingReport?: boolean;
  reportSuccess?: boolean;
  geoLoading?: boolean;
  isAdminMode?: boolean;
  searchQuery?: string;
}

/**
 * Pure predicate to determine if current screen qualifies as a rich publisher content page
 * for Google AdSense compliance.
 */
export function isAdEligibleScreen(params: AdEligibilityParams): boolean {
  // 1. If any modal or form submission/loading state is active, strictly NO ADS
  if (
    params.showPrivacyModal ||
    params.showTermsModal ||
    params.submittingReport ||
    params.reportSuccess ||
    params.geoLoading ||
    params.isAdminMode
  ) {
    return false;
  }

  // 2. Station Search / Exit Lookup / Naver Map tab -> Utility screen (Strictly NO ADS)
  if (params.currentTab === 'search') {
    return false;
  }

  // 3. About tab -> Policy and Form pages are strictly excluded
  if (params.currentTab === 'about') {
    if (
      params.siteSubPage === 'privacy' ||
      params.siteSubPage === 'terms' ||
      params.siteSubPage === 'contact' ||
      params.siteSubPage === 'data-source'
    ) {
      return false;
    }
    // Only operator background story has rich publisher text
    return params.siteSubPage === 'about' || !params.siteSubPage;
  }

  // 4. Approved rich content tabs (including refactored top-level tabs)
  if (
    params.currentTab === 'home' ||
    params.currentTab === 'transit' ||
    params.currentTab === 'courses' ||
    params.currentTab === 'exploration' ||
    params.currentTab === 'tips' ||
    params.currentTab === 'schedule' ||
    params.currentTab === 'tourapi' ||
    params.currentTab.startsWith('itinerary-')
  ) {
    // Exclude sparse navigation index hub with only 4 cards to prevent blank ad placeholder
    if (params.currentTab === 'tips' && (params.tipsSubPage === 'index' || !params.tipsSubPage)) {
      return false;
    }
    return true;
  }

  return false;
}

interface AdSenseUnitProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  currentParams: AdEligibilityParams;
}

/**
 * AdSenseUnit Component
 * Renders an ad unit ONLY when the active screen is verified as an eligible content page
 * and after the surrounding view has finished mounting (never during Suspense/loading fallbacks).
 */
export const AdSenseUnit: React.FC<AdSenseUnitProps> = ({
  slotId,
  format = 'auto',
  responsive = true,
  className = '',
  style = {},
  currentParams
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const isPushedRef = useRef<boolean>(false);

  const isEligible = isAdEligibleScreen(currentParams);

  useEffect(() => {
    if (!isEligible) {
      isPushedRef.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      // Never push ads if a loading fallback is currently visible in the DOM
      const activeLoader = document.querySelector('[data-loading-fallback="true"]');
      if (activeLoader) {
        return;
      }

      if (!isPushedRef.current && adRef.current) {
        try {
          if (typeof window !== 'undefined') {
            const adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || [];
            (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = adsbygoogle;
            adsbygoogle.push({});
            isPushedRef.current = true;
          }
        } catch (err) {
          console.warn('[AdSenseUnit] Safely handled ad push lifecycle:', err);
        }
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, [isEligible, currentParams.currentTab, currentParams.tipsSubPage, currentParams.siteSubPage]);

  // If not eligible, strictly do NOT render any ad tags or markup
  if (!isEligible) {
    return null;
  }

  return (
    <div 
      className={`adsense-content-container text-center overflow-hidden transition-all ${className}`}
      data-ad-eligible="true"
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style
        }}
        data-ad-client={ADSENSE_CLIENT_ID}
        {...(slotId ? { 'data-ad-slot': slotId } : {})}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};
