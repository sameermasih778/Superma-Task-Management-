import { useEffect } from 'react';
import Lenis from 'lenis';
import { registerLenis } from '../lib/smoothScroll';

/**
 * Inertia/smooth scrolling for public marketing pages.
 *
 * Rationale: we only want Lenis on the marketing shell (not on the dashboard
 * and not on admin login) to avoid interfering with internal scroll containers
 * and body overflow locks on modals/drawers. Reduced motion disables it.
 *
 * Lenis v1 options: duration + easing are valid. The CSS below prevents scroll
 * behaviour from the browser interfering.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    const lenis = new Lenis({
      duration: 1.06,
      // easeOutCubic: t -> 1 - (1-t)^3, settles cleanly with no visible overshoot
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.6,
      syncTouch: false,
    });

    registerLenis(lenis);

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      registerLenis(null);
      try {
        lenis.destroy();
      } catch {
        // ignore
      }
    };
  }, []);

  return null;
}
