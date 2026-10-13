import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Plus, Minus } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqsColumn1 = [
    {
      q: 'What is Suprema?',
      a: 'Suprema is an all-in-one AI-powered project management platform built to streamline task assignment, track velocity, and align product teams.',
    },
    {
      q: 'How does task assigning work?',
      a: 'Suprema uses workload intelligence algorithms to match tasks with developer capacity and skill sets automatically.',
    },
    {
      q: 'Can I customize my dashboard?',
      a: 'Yes, you can fully customize views, filters, widgets, and priority rules to fit your team workflow.',
    },
    {
      q: 'Is there mobile access?',
      a: 'Suprema provides responsive web and mobile access so you can track progress anywhere, anytime.',
    },
    {
      q: 'What kind of support do you offer?',
      a: 'We offer 24/7 dedicated email, chat, and priority support depending on your plan tier.',
    },
  ];

  const faqsColumn2 = [
    {
      q: 'How secure is my data?',
      a: 'Your data is protected with bank-grade SOC2 Type II compliance, end-to-end encryption, and strict RBAC controls.',
    },
    {
      q: 'Can I integrate with other tools?',
      a: 'Suprema seamlessly connects with GitHub, Figma, Slack, Jira, Notion, and Stripe.',
    },
    {
      q: 'What pricing plans are available?',
      a: 'We offer Free, Pro ($12/mo), and Advanced ($19/mo) plans tailored to teams of all sizes.',
    },
    {
      q: 'Is there a free trial available?',
      a: 'Yes, we offer a 7-day free trial on all paid plans with zero credit card required.',
    },
    {
      q: 'How do I provide feedback?',
      a: 'You can submit feedback directly within the app workspace or via our customer support portal.',
    },
  ];

  const toggleFAQ = (globalIdx) => {
    setOpenIndex(openIndex === globalIdx ? null : globalIdx);
  };

  return (
    <section id="faq" className="py-24 md:py-32 bg-black text-white relative overflow-hidden border-t border-white/10">
      
      {/* Background Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          
          {/* Top Pill Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 mb-4"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>FAQ's</span>
          </motion.div>

          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-tight"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        {/* 2-Column Accordion Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Column 1 */}
          <div className="space-y-4">
            {faqsColumn1.map((item, idx) => {
              const globalIdx = idx;
              const isOpen = openIndex === globalIdx;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  onClick={() => toggleFAQ(globalIdx)}
                  className="bg-[#09090b] border border-white/10 rounded-2xl p-4 sm:p-5 cursor-pointer hover:border-white/20 transition-all shadow-lg"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-base sm:text-lg font-semibold text-white tracking-tight">
                      {item.q}
                    </span>
                    <button
                      className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors flex-shrink-0"
                      // Icon-only control: without this a screen reader
                      // announces an anonymous "button" and the plus/minus
                      // glyph carries no meaning.
                      aria-label={isOpen ? 'Hide the answer' : 'Show the answer'}
                      aria-expanded={isOpen}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal pt-3 border-t border-white/5 mt-3">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            {faqsColumn2.map((item, idx) => {
              const globalIdx = idx + 5;
              const isOpen = openIndex === globalIdx;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  onClick={() => toggleFAQ(globalIdx)}
                  className="bg-[#09090b] border border-white/10 rounded-2xl p-4 sm:p-5 cursor-pointer hover:border-white/20 transition-all shadow-lg"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-base sm:text-lg font-semibold text-white tracking-tight">
                      {item.q}
                    </span>
                    <button
                      className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors flex-shrink-0"
                      // Icon-only control: without this a screen reader
                      // announces an anonymous "button" and the plus/minus
                      // glyph carries no meaning.
                      aria-label={isOpen ? 'Hide the answer' : 'Show the answer'}
                      aria-expanded={isOpen}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal pt-3 border-t border-white/5 mt-3">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
