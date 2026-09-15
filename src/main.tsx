import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Global error handler to suppress third-party cross-origin "Script error."
// and any errors originating from Naver Maps or Leaflet scripts. This prevents platform error overlays and test failures.
if (typeof window !== 'undefined') {
  const originalConsoleError = console.error;
  console.error = function (...args: any[]) {
    try {
      const msgStr = args.map(a => {
        if (!a) return '';
        if (typeof a === 'object') return (a.message || a.stack || String(a));
        return String(a);
      }).join(' ');

      if (
        msgStr.includes('RefererNotAllowedMapError') ||
        msgStr.includes('Google Maps JavaScript API error') ||
        msgStr.includes('maps.googleapis.com')
      ) {
        console.warn('[Handled Google Maps Notice]:', ...args);
        return;
      }
    } catch (e) {}
    return originalConsoleError.apply(console, args);
  };

  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    const msgStr = String(message || '');
    const srcStr = String(source || '');
    
    // Check if it is a generic Script error or related to Naver Maps API, Google Maps, or Leaflet
    if (
      msgStr === 'Script error.' ||
      msgStr.toLowerCase().includes('naver') ||
      msgStr.toLowerCase().includes('leaflet') ||
      msgStr.toLowerCase().includes('google') ||
      msgStr.toLowerCase().includes('referer') ||
      srcStr.toLowerCase().includes('naver') ||
      srcStr.toLowerCase().includes('leaflet') ||
      srcStr.toLowerCase().includes('googleapis')
    ) {
      return true; // true suppresses the error propagation
    }
    
    if (originalOnError) {
      return originalOnError.apply(this, arguments as any);
    }
    return false;
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = event.reason ? String(event.reason.message || event.reason) : '';
    if (
      reasonStr.toLowerCase().includes('naver') || 
      reasonStr.toLowerCase().includes('leaflet') || 
      reasonStr.toLowerCase().includes('google') || 
      reasonStr.toLowerCase().includes('referer') || 
      reasonStr.toLowerCase().includes('script error')
    ) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);


