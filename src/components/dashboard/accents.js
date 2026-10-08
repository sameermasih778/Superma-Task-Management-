/**
 * Per-role accent palettes for the dashboards.
 *
 * Kept out of the component file so that module only exports components
 * (React Fast Refresh stays working), and so a role's entire colour identity
 * can be changed from one place.
 */
export const ACCENTS = {
  member: {
    label: 'Workspace',
    accent: '#818cf8',
    soft: 'rgba(129, 140, 248, 0.12)',
    ring: 'rgba(129, 140, 248, 0.32)',
    glow: 'rgba(129, 140, 248, 0.10)',
    gradient: 'linear-gradient(120deg, #1e1b4b 0%, #09090b 55%, #000000 100%)',
  },
  developer: {
    label: 'Engineering',
    accent: '#34d399',
    soft: 'rgba(52, 211, 153, 0.12)',
    ring: 'rgba(52, 211, 153, 0.32)',
    glow: 'rgba(52, 211, 153, 0.10)',
    gradient: 'linear-gradient(120deg, #052e2b 0%, #09090b 55%, #000000 100%)',
  },
  admin: {
    label: 'Administration',
    accent: '#fbbf24',
    soft: 'rgba(251, 191, 36, 0.12)',
    ring: 'rgba(251, 191, 36, 0.32)',
    glow: 'rgba(251, 191, 36, 0.10)',
    gradient: 'linear-gradient(120deg, #3b2f0b 0%, #09090b 55%, #000000 100%)',
  },
};

/** Spread the accent tokens onto an element as CSS custom properties. */
export function accentVars(tier) {
  const a = ACCENTS[tier] || ACCENTS.member;
  return {
    '--accent': a.accent,
    '--accent-soft': a.soft,
    '--accent-ring': a.ring,
    '--accent-glow': a.glow,
    '--accent-gradient': a.gradient,
  };
}