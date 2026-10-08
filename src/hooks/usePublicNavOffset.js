import { useState, useLayoutEffect } from 'react';

/**
 * Returns the bottom edge (in px) of the public Navbar, or 0 when it is absent.
 *
 * The public Navbar is `position: fixed`, so it floats over whatever renders
 * beneath it. Anything that needs to sit below it therefore has to clear its
 * real height. That height is NOT a constant - it changes with viewport width
 * (the navbar switches padding at the sm/md breakpoints and its inner card
 * reflows), so hardcoding a Tailwind value such as `pt-24` is only correct at
 * one breakpoint and overlaps at others.
 *
 * Returns 0 when there is no public navbar - i.e. on /admin-login and on staff
 * dashboards, where App.jsx deliberately renders nothing. Callers can then
 * safely fall back to their existing zero-offset behaviour, which is what
 * keeps the admin/developer layout unchanged.
 *
 * Uses useLayoutEffect so the offset is applied before paint, avoiding a flash
 * of mis-positioned content on first render.
 */
export default function usePublicNavOffset() {
  const [offset, setOffset] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const navbar = document.querySelector('[data-public-navbar]');
      const next = navbar
        ? Math.round(navbar.getBoundingClientRect().bottom)
        : 0;

      // Only re-render when the value actually changed, otherwise every
      // scroll/resize would push a new state value through the tree.
      setOffset((prev) => (prev === next ? prev : next));
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return offset;
}