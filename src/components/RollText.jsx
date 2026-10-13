import React from 'react';

/**
 * Vertical "text roll" hover effect, matching the marketing site.
 *
 * On hover the visible label slides up and out while an identical copy slides
 * up from below into its place. The parent element must carry the `group`
 * class (Tailwind) for the `group-hover:` variants to fire.
 *
 * The static first copy defines the box height/width; the second is absolutely
 * positioned one line below and is clipped until hover.
 */
export default function RollText({ children, className = '' }) {
  return (
    <span className={`relative inline-flex overflow-hidden ${className}`}>
      <span className="block whitespace-nowrap leading-[1.5] transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full motion-reduce:transition-none">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute left-0 top-full block whitespace-nowrap leading-[1.5] transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full motion-reduce:hidden"
      >
        {children}
      </span>
    </span>
  );
}
