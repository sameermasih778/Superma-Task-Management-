import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Headset, Phone, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import smallLogo from '../assets/small logo.svg';
import ContactForm from '../components/ContactForm';
import FAQSection from '../components/FAQSection';
import AnimatedText from '../components/AnimatedText';

const supportPills = ['24/7 support', 'Live Chat Support', 'Email Support'];

const contactCards = [
  {
    icon: Mail,
    title: 'Sales',
    description: 'Reach out to our sales team for pricing and plan details.',
    cta: 'Talk to sales',
    href: 'mailto:hello@suprema.com',
  },
  {
    icon: Headset,
    title: 'Help & support',
    description: 'Contact support for any issues or assistance with using Suprema.',
    cta: 'Contact Support',
    href: 'mailto:hello@suprema.com',
  },
  {
    icon: Phone,
    title: 'Give Us a Call',
    description: 'Speak directly with our team for quick answers and personalized help.',
    cta: 'Talk to sales',
    href: 'mailto:hello@suprema.com',
  },
];

export default function Contact() {
  const reduce = useReducedMotion();
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Contact Us | Get in Touch with Us';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="bg-black text-white min-h-screen pt-24 sm:pt-32 md:pt-36 pb-16 overflow-hidden relative font-sans">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-purple-600/[0.07] rounded-full blur-[160px] pointer-events-none" />

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)', y: -15 }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative mx-auto w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 flex items-center justify-center mb-5 sm:mb-6"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 sm:w-48 h-36 sm:h-48 bg-white/15 rounded-full blur-2xl pointer-events-none" />
          <div
            className="absolute -inset-6 sm:-inset-10 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
              backgroundSize: '14px 14px',
              maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
            }}
          />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: reduce ? 0 : Infinity, duration: 8.5, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img src={smallLogo} alt="Suprema Shield" className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.0, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm font-semibold text-emerald-400 mb-4 sm:mb-5 shadow-sm backdrop-blur-md"
        >
          <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          <span>Contact Us</span>
        </motion.div>

        <div className="relative max-w-4xl mx-auto mb-4 sm:mb-6 px-2">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[480px] h-[80px] bg-white/[0.08] rounded-full blur-3xl pointer-events-none" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-tight leading-[1.12] relative z-10">
            <AnimatedText 
              text="Get in Touch with Us" 
              delay={0.25} 
              duration={1.25} 
              stagger={0.038} 
              blurAmount={20} 
              className="inline-block" 
            />
          </h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.25, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm md:text-base text-zinc-400 max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed font-normal px-4"
        >
          Reach out to us for inquiries, support, or partnership opportunities. We&apos;re here to assist you!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-12"
        >
          {supportPills.map((label) => (
            <div
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-white/10 text-xs sm:text-sm font-medium text-zinc-300"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>

        <ContactForm />
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {contactCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="bg-[#08080a] border border-white/10 hover:border-white/25 rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-left flex flex-col shadow-xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/8 to-transparent blur-2xl pointer-events-none rounded-full" />
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white mb-5 relative z-10">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white font-tight mb-2 relative z-10">{card.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-1 relative z-10">
                  {card.description}
                </p>
                <a
                  href={card.href}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-sm font-semibold text-white hover:bg-white hover:text-black hover:border-white transition-all relative z-10"
                >
                  {card.cta}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </motion.article>
            );
          })}
        </div>
      </section>

      <FAQSection />
    </div>
  );
}
