import React from 'react';

/**
 * Robust lazy loader with automatic reload / retry mechanism
 * to recover from network hiccups, stale cached chunk hashes after deploys,
 * and dev-server module resolution errors.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T } | any>
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    const pageHasBeenForceRefreshed = window.sessionStorage.getItem('lazy_retry_refreshed');

    try {
      const module = await componentImport();
      // Reset flag if module successfully loaded
      window.sessionStorage.removeItem('lazy_retry_refreshed');
      
      if (module && module.default) {
        return { default: module.default };
      }
      return module;
    } catch (error: any) {
      console.warn('[lazyWithRetry] Dynamic import failed, checking retry strategy:', error);

      // If we haven't refreshed yet, try reloading page once to fetch latest build chunks
      if (!pageHasBeenForceRefreshed) {
        window.sessionStorage.setItem('lazy_retry_refreshed', 'true');
        window.location.reload();
        return new Promise(() => {}); // Halt rejection while page reloads
      }

      // If we already refreshed, retry import once more with small delay
      try {
        await new Promise(res => setTimeout(res, 800));
        const retryModule = await componentImport();
        window.sessionStorage.removeItem('lazy_retry_refreshed');
        if (retryModule && retryModule.default) {
          return { default: retryModule.default };
        }
        return retryModule;
      } catch (retryError) {
        window.sessionStorage.removeItem('lazy_retry_refreshed');
        throw retryError;
      }
    }
  });
}
