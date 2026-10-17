let lenis = null;

export const registerLenis = (instance) => {
  lenis = instance || null;
};

export const getLenis = () => lenis;

/**
 * Scroll to top, routed through Lenis if it's active. That avoids fighting
 * the inertial scroll and keeps UX consistent.
 */
export const scrollToTop = ({ immediate = true } = {}) => {
  // Both calls are needed:
  //
  // 1. Lenis owns its own animated/target scroll state. Telling it to jump
  //    first keeps its rAF loop from pulling the page back to where it was
  //    (which would undo the reset) when it is mid-inertia.
  //    `force` bypasses Lenis's stopped/locked guards.
  // 2. Lenis's scrollTo() returns early when its cached target already equals
  //    the requested target - which happens whenever the browser clamped the
  //    scroll for us because the new page is shorter than the old one. The
  //    native call then guarantees the page really is at the top.
  if (lenis) {
    try {
      lenis.scrollTo(0, { immediate, force: true });
    } catch {
      // ignore
    }
  }
  try {
    window.scrollTo(0, 0);
  } catch {
    // ignore
  }
};
