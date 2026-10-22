/**
 * The Dispatch — Central Motion Design Tokens & Utilities
 * Animate only transform and opacity.
 */

export const MOTION = {
  duration: {
    fast: 150,     // 150ms for buttons, micro-interactions
    medium: 250,   // 250ms for panels, drawers, modals
    slow: 500,     // 500ms for spatial movements, hero transitions
  },
  easing: {
    standard: 'cubic-bezier(0.16, 1, 0.3, 1)',   // fluid ease-out
    editorial: 'cubic-bezier(0.25, 1, 0.5, 1)',  // dignified ease-in-out
    linear: 'linear',
  },
} as const;

/**
 * Checks if the reader has requested reduced motion
 */
export function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Helper to compute reading time from text in minutes (approx. 220 words per minute)
 */
export function calculateReadingTimeMinutes(text: string): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 225));
}
