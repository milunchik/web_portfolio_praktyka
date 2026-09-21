const ANONYMOUS_VISITOR_STORAGE_KEY = 'portfolio_anonymous_visitor_id';

export function getOrCreateAnonymousVisitorId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    let visitorId = localStorage.getItem(ANONYMOUS_VISITOR_STORAGE_KEY);
    if (!visitorId) {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        visitorId = crypto.randomUUID();
      } else {
        // Fallback random UUID v4 generator
        visitorId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }
      localStorage.setItem(ANONYMOUS_VISITOR_STORAGE_KEY, visitorId);
    }
    return visitorId;
  } catch {
    // Return a temporary UUID if localStorage is disabled/restricted
    return 'anon-' + Math.random().toString(36).substring(2, 15);
  }
}
