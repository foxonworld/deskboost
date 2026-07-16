type AnalyticsCommand = [command: string, ...parameters: unknown[]];
type AnalyticsQueueEntry = IArguments | Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: AnalyticsQueueEntry[];
    gtag?: (...args: AnalyticsCommand) => void;
  }
}

const GA4_SCRIPT_ID = 'deskboost-ga4';
const measurementIdPattern = /^G-[A-Z0-9]+$/i;

let initialized = false;

const getMeasurementId = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  return measurementId && measurementIdPattern.test(measurementId) ? measurementId : null;
};

const canUseAnalytics = () => (
  typeof window !== 'undefined'
  && typeof document !== 'undefined'
  && import.meta.env.VITE_MOBILE_APP !== 'true'
  && Boolean(getMeasurementId())
);

export const isAnalyticsEnabled = () => canUseAnalytics();

export const initAnalytics = () => {
  if (initialized || !canUseAnalytics()) {
    if (
      import.meta.env.DEV
      && import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()
      && !getMeasurementId()
    ) {
      console.warn('GA4 is disabled because the Measurement ID format is invalid.');
    }
    return;
  }

  const measurementId = getMeasurementId();
  if (!measurementId) return;

  try {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer?.push(arguments);
    };

    if (!document.getElementById(GA4_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = GA4_SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
    }

    window.gtag('js', new Date());
    window.gtag('config', measurementId);
    initialized = true;
  } catch {
    // Analytics failures, including blocked scripts, must never affect the app.
  }
};

export const trackEvent = (eventName: string, parameters: Record<string, unknown>) => {
  if (!initialized || !canUseAnalytics() || !window.gtag) return;

  try {
    window.gtag('event', eventName, parameters);
  } catch {
    // Keep analytics optional when a browser extension interferes with it.
  }
};
