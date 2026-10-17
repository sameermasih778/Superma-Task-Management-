/**
 * Shared motion tokens and helpers.
 *
 * The goal is a single source of truth for timing and easing so the site feels
 * consistent - especially the signature blur-reveal. Reduced motion is honoured
 * explicitly here (useReveal / AnimatedText etc). The global MotionConfig is
 * intentionally NOT used; instead we guard infinite/looping animations per
 * component to avoid the "instant + repeat: Infinity" flicker edge case.
 */

import { useReducedMotion } from 'framer-motion';

export const EASE = {
  /** The site's signature ease-out (matches existing ad-hoc usage: [0.21,0.47,0.32,0.98]). */
  out: [0.21, 0.47, 0.32, 0.98],
  /** Sharper UI ease: menus, drawers, toasts. */
  ui: [0.16, 1, 0.3, 1],
  linear: 'linear',
};

export const DURATION = {
  instant: 0.15,
  fast: 0.24,
  base: 0.35,
  slow: 0.8,
};

export const SPRING = {
  /** Soft settle for larger surfaces (modals, drawers). */
  soft: { type: 'spring', stiffness: 200, damping: 25 },
  /** Snappy feedback (pills, buttons, toasts). */
  snappy: { type: 'spring', stiffness: 420, damping: 32 },
  /** Gentle scroll-linked/ambient motion. */
  gentle: { type: 'spring', stiffness: 100, damping: 30 },
};

/** Standard in-view trigger: play once, start slightly before element is centred. */
export const VIEWPORT = { once: true, margin: '-60px' };

/**
 * Scroll reveal (signature): rise + sharpen.
 */
export const reveal = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

export const revealReduced = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

/** Stagger containers/items */
export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

export const staggerItem = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

/** Common hover/tap micro-interactions */
export const hoverLift = { y: -6, transition: { duration: DURATION.fast, ease: EASE.out } };
export const hoverGrow = { scale: 1.04, transition: { duration: DURATION.fast, ease: EASE.out } };
export const tapPress = { scale: 0.97 };

/**
 * Hook to get standard scroll-reveal props for a `motion.*` element.
 *
 * Notes:
 * - Honours prefers-reduced-motion via `useReducedMotion()`.
 * - Swaps to fade-only variant for reduced motion (and drops blur).
 * - The element-level `transition` applies to the `show` state when the variant
 *   does not specify its own transition.
 */
export const useReveal = ({ delay = 0, duration = DURATION.slow } = {}) => {
  const reduce = useReducedMotion();
  return {
    variants: reduce ? revealReduced : reveal,
    initial: 'hidden',
    whileInView: 'show',
    viewport: VIEWPORT,
    transition: { duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease: EASE.out },
  };
};

/**
 * Per-character/word helpers for a "typewriter-like" headline reveal.
 */
export const charContainer = (stagger = 0.028, delayChildren = 0.1) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

export const charItem = {
  hidden: { opacity: 0, y: '0.5em', filter: 'blur(8px)' },
  show: { opacity: 1, y: '0em', filter: 'blur(0px)' },
};
