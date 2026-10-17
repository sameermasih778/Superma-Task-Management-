import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function LogoStrip() {
  const logos = [
    { name: 'Imprintify', font: 'font-serif text-base font-bold' },
    { name: 'Signet', icon: '●', font: 'font-sans font-extrabold text-lg tracking-tight' },
    { name: 'Grapherz', icon: '⬡', font: 'font-mono text-base font-semibold' },
    { name: 'Artistry', icon: '◐', font: 'font-sans text-lg font-light tracking-wide' },
    { name: 'PRELUDE', icon: '◬', font: 'font-mono text-sm font-bold tracking-widest' },
    { name: 'Emblem', icon: '▌▌', font: 'font-sans text-lg font-bold tracking-tighter' },
  ];
  const reduce = useReducedMotion();

  return (
    <div className="pt-4 pb-2 border-t border-white/10 overflow-hidden relative z-10 w-full">
      <div className="text-center mb-3">
        <p className="text-xs font-medium text-zinc-400">
          Trusted by 50,000+ businesses for innovative design and growth.
        </p>
      </div>

      <div className="flex overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <motion.div
          animate={reduce ? undefined : { x: ['0%', '-50%'] }}
          transition={reduce ? undefined : { duration: 30, ease: 'linear', repeat: Infinity }}
          className="flex items-center gap-12 whitespace-nowrap min-w-full justify-around"
        >
          {[...logos, ...logos].map((logo, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer ${logo.font}`}
            >
              {logo.icon && <span className="text-zinc-400 text-xs">{logo.icon}</span>}
              <span>{logo.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
