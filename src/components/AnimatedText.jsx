import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from '../lib/motion';

/**
 * AnimatedText reveals text smoothly with a signature focus blur effect.
 * Supports character-by-character, word-by-word, or whole line transitions.
 * Uses Framer Motion variants so delay and stagger work reliably across lines.
 *
 * Accessibility: renders the full text for screen readers (sr-only), and animates
 * only the decorative spans (aria-hidden). When prefers-reduced-motion is active,
 * returns plain text instantly.
 */
const SILK_EASE = [0.16, 1, 0.3, 1];

export default function AnimatedText({
  text,
  className = '',
  delay = 0,
  stagger = 0.035,
  duration = 1.15,
  blurAmount = 18,
  yOffset = '0.35em',
  ease = SILK_EASE,
  mode = 'char', // 'char' | 'word' | 'line'
}) {
  const reduce = useReducedMotion();
  const words = useMemo(() => String(text || '').split(' '), [text]);

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: mode === 'line' ? 0 : stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: yOffset,
      filter: `blur(${blurAmount}px)`,
    },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration,
        ease,
      },
    },
  };

  if (mode === 'line') {
    return (
      <motion.span
        className={className}
        initial={{ opacity: 0, y: yOffset, filter: `blur(${blurAmount}px)` }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration, delay, ease }}
      >
        {text}
      </motion.span>
    );
  }

  let charIndex = 0;

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {mode === 'word' ? (
              <motion.span
                className="inline-block"
                variants={itemVariants}
              >
                {word}
              </motion.span>
            ) : (
              Array.from(word).map((ch) => {
                charIndex += 1;
                return (
                  <motion.span
                    key={charIndex}
                    className="inline-block"
                    variants={itemVariants}
                  >
                    {ch}
                  </motion.span>
                );
              })
            )}
            {wi < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </span>
    </motion.span>
  );
}

