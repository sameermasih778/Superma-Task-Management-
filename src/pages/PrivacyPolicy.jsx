import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Shield } from 'lucide-react';
import smallLogo from '../assets/small logo.svg';
import AnimatedText from '../components/AnimatedText';

const sections = [
  {
    title: ' Information We Collect',
    body: 'We collect information you provide directly, such as your name, email address, company name, and messages submitted through our contact, waitlist, and trial forms. We may also collect technical data such as browser type, device information, and pages visited to keep Suprema reliable and secure.',
  },
  {
    title: ' How We Use Your Information',
    body: 'We use your information to operate and improve Suprema, respond to inquiries, send product updates you request, personalize your experience, and protect against fraud or abuse. We do not sell your personal information.',
  },

  {
    title: ' Data Security',
    body: 'We take data security seriously and employ industry-standard measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    title: ' Third-Party Disclosure',
    body: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required by law or as necessary to provide our services. We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you, provided that they agree to keep your information confidential.',
  },
  {
    title: ' Cookies',
    body: 'Our website may use cookies to enhance your browsing experience and collect information about how you interact with our site. You can adjust your browser settings to refuse cookies or alert you when cookies are being sent, but some features of the site may not function properly without cookies.'
  },
  {
    title: ' Changes to this Privacy Policy',
    body: 'We reserve the right to update or change this Privacy Policy at any time. Any changes will be posted on this page, and the effective date will be updated accordingly. We encourage you to review this Privacy Policy periodically for any updates.',
  },

  {
    title: ' Contact us',
    body: 'If you have questions about this Privacy Policy or how we handle your data, email hello@suprema.com or reach our team through the Contact page.',
  },
];

export default function PrivacyPolicy() {
  const reduce = useReducedMotion();

  return (
    <div className="bg-black text-white min-h-screen pt-24 sm:pt-32 md:pt-36 pb-16 overflow-hidden relative font-sans">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-purple-600/[0.07] rounded-full blur-[160px] pointer-events-none" />

      <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 sm:mb-16">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: reduce ? 0 : Infinity, duration: 8.5, ease: 'easeInOut' }}
          className="relative mx-auto w-16 h-20 flex items-center justify-center mb-5"
        >
          <img src={smallLogo} alt="Suprema" className="w-8 h-8 object-contain" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.0, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm font-semibold text-emerald-400 mb-5"
        >
          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          <span>Privacy Policy</span>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-tight mb-4">
          <AnimatedText 
            text="Privacy Policy" 
            delay={0.25} 
            duration={1.25} 
            stagger={0.038} 
            blurAmount={20} 
            className="inline-block" 
          />
        </h1>
        <motion.p 
          initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.25, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm text-zinc-400 leading-relaxed"
        >
          Last updated: November 30, 2024. This policy explains how Suprema collects, uses, and protects your information.
        </motion.p>
      </section>

      <article className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
        {sections.map((section) => (
          <section
            key={section.title}
            className="bg-[#08080a] border border-white/10 rounded-2xl p-6 sm:p-8 text-left"
          >
            <h2 className="text-lg sm:text-xl font-bold text-white font-tight mb-3">
              {section.title}
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              {section.body}
            </p>
          </section>
        ))}
      </article>
    </div>
  );
}
