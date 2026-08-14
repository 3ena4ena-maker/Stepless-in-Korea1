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
 *
 * STRICTLY EXCLUDED (Returns false):
 * - Utility / Tool screens: Station search tab ('search'), exit lookup, Naver map view, bento grid station picker
 * - Policy / Legal screens: Privacy policy ('privacy'), Terms of service ('terms')
 * - Form / Input screens: Contact inquiry ('contact'), Error/Data report form ('data-source')
 * - Modal overlays: Privacy modal, Terms modal, confirmation dialogs
 * - System / Loading / Error states: Report submitting, geolocation loading, offline/error screens
 *
 * APPROVED CONTENT (Returns true):
 * - Home overview editorial guide ('home' / HomeOverviewSection)
 * - Curated travel tips & subway guide articles ('tips')
 * - Busan major festival & events magazine calendar ('schedule')
 * - Barrier-free curated tourism spots ('tourapi')
 * - Operator / Author introduction story ('about' tab with siteSubPage === 'about')
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

  // 4. Approved rich content tabs
  if (
    params.currentTab === 'home' ||
    params.currentTab === 'tips' ||
    params.currentTab === 'schedule' ||
    params.currentTab === 'tourapi' ||
    params.currentTab.startsWith('itinerary-')
  ) {
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
 * Renders an ad unit ONLY when the active screen is verified as an eligible content page.
 * If the current view is a utility/policy/form/modal/loading screen, it returns null
 * and completely prevents ad requests.
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

    // Attempt to push ad only once when mounted on an eligible content screen
    if (!isPushedRef.current && adRef.current) {
      try {
        if (typeof window !== 'undefined') {
          // Initialize window.adsbygoogle safely
          const adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || [];
          (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = adsbygoogle;
          
          // Request ad rendering for this verified container
          adsbygoogle.push({});
          isPushedRef.current = true;
        }
      } catch (err) {
        // Suppress benign iframe or duplicate push errors in dev/preview
        console.warn('[AdSenseUnit] Safely handled ad push lifecycle:', err);
      }
    }
  }, [isEligible, currentParams.currentTab, currentParams.tipsSubPage, currentParams.siteSubPage]);

  // If not eligible, strictly do NOT render any ad tags or markup
  if (!isEligible) {
    return null;
  }

  return (
    <div 
      className={`adsense-content-container my-6 text-center overflow-hidden transition-all ${className}`}
      data-ad-eligible="true"
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          minHeight: '90px',
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
