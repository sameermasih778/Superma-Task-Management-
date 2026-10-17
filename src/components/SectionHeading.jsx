import React from 'react';
import { motion } from 'framer-motion';
import { useReveal } from '../lib/motion';

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className = ''
}) {
  const alignmentClass = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center mx-auto';
  const reveal = useReveal({ duration: 0.7 });

  return (
    <motion.div
      {...reveal}
      className={`max-w-3xl mb-16 ${alignmentClass} ${className}`}
    >
      {eyebrow && (
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-grey-5 uppercase bg-white/5 rounded-full border border-white/10">
          {eyebrow}
        </span>
      )}
      {title && (
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 leading-[1.15]">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-base sm:text-lg text-grey-4 font-normal leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
