import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Crown,
  Info,
  Users,
  Smartphone,
  ShieldCheck,
  Clock,
  Cloud,
  Star,
  Lock,
  Zap
} from 'lucide-react';
import api from '../utils/api';

/**
 * Bundled fallback plans, used only if GET /pricing is unreachable.
 * Kept in sync with the pricing_plans table (migration 006).
 */
const FALLBACK_PLANS = [
  {
    id: 'free', name: 'Free Plan', price: '$0', priceMonthly: 0, priceYearly: null,
    period: 'per user / month', subtext: 'Free for everyone', popular: false, hasToggle: false,
    btnVariant: 'dark', btnText: 'Get Started',
    features: [
      { name: 'Task Management', included: true },
      { name: 'Data Encryption', included: true },
      { name: 'Deadline Alerts', included: true },
      { name: 'Collaboration Tools', included: false },
      { name: 'Custom Workflows', included: false },
      { name: 'Real-Time Sync', included: false },
    ],
  },
  {
    id: 'pro', name: 'Pro Plan', price: '$12', priceMonthly: 12, priceYearly: 10,
    period: 'per user / month', subtext: null, popularBadge: 'Most Popular', popular: true,
    hasToggle: true, btnVariant: 'white', btnText: 'Get Started',
    features: [
      { name: 'Task Management', included: true },
      { name: 'Data Encryption', included: true },
      { name: 'Deadline Alerts', included: true },
      { name: 'Collaboration Tools', included: true },
      { name: 'Custom Workflows', included: false },
      { name: 'Real-Time Sync', included: false },
    ],
  },
  {
    id: 'advanced', name: 'Advanced Plan', price: '$19', priceMonthly: 19, priceYearly: 15,
    period: 'per user / month', subtext: null, popular: false, hasToggle: true,
    btnVariant: 'dark', btnText: 'Get Started',
    features: [
      { name: 'Task Management', included: true },
      { name: 'Data Encryption', included: true },
      { name: 'Deadline Alerts', included: true },
      { name: 'Collaboration Tools', included: true },
      { name: 'Custom Workflows', included: true },
      { name: 'Real-Time Sync', included: true },
    ],
  },
];

/**
 * Price string for a plan under the current billing toggle.
 *
 * Plans carry both prices (pricing_plans.price_monthly / price_yearly). If a
 * plan has no yearly price - the free tier - the monthly price is shown either
 * way, so the toggle can never render a blank price.
 */
function displayPrice(plan, billedYearly) {
  const yearly = billedYearly ? plan.priceYearly : null;
  const value = yearly !== null && yearly !== undefined ? yearly : plan.priceMonthly;

  if (value === null || value === undefined) return plan.price ?? '';
  return `$${value}`;
}

export default function Pricing() {
  const [billedYearly, setBilledYearly] = useState(true);

  /**
   * Plans come from the API (GET /pricing). The hardcoded array below stays as
   * the fallback so the pricing section always renders, even if the backend is
   * unreachable - a public sales page must never go blank.
   *
   * The yearly toggle used to be decorative: it flipped a switch and the price
   * never changed. priceMonthly / priceYearly come from the database, so the
   * displayed price is now genuinely different when billing yearly.
   */
  const [plans, setPlans] = useState(FALLBACK_PLANS);

  useEffect(() => {
    let cancelled = false;

    api.get('/pricing')
      .then((res) => {
        if (!cancelled && Array.isArray(res.plans) && res.plans.length > 0) {
          setPlans(res.plans);
        }
      })
      .catch((err) => {
        console.warn('[Pricing] Falling back to bundled plans:', err.message);
      });

    return () => { cancelled = true; };
  }, []);

  const allPlansFeatures = [
    { icon: Users, label: 'Collaboration Tools' },
    { icon: Smartphone, label: 'Mobile Access' },
    { icon: ShieldCheck, label: 'Data Security' },
    { icon: Clock, label: '24/7 Support' },
    { icon: Cloud, label: 'Cloud Storage' },
    { icon: Star, label: 'User Roles' },
    { icon: Lock, label: 'SOC2 Security' },
    { icon: Zap, label: 'Automated Workflows' },
  ];

  return (
    <section id="pricing" className="py-24 md:py-32 bg-black text-white relative overflow-hidden border-t border-white/10">
      
      {/* Background Top Ambient Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          
          {/* Crown Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-4"
          >
            <Crown className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>Pricing</span>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4 font-tight"
          >
            Affordable Pricing Plans
          </motion.h2>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`bg-[#050505] border rounded-3xl p-7 flex flex-col justify-between relative shadow-2xl transition-all ${
                plan.popular
                  ? 'border-white/20 shadow-white/5 bg-[#08080a]'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Subtle Arc Light Reflection Top Right */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-white/10 to-transparent blur-2xl pointer-events-none rounded-full" />

              <div>
                {/* Header Row: Title & Optional Badge */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {plan.name}
                  </h3>
                  {plan.popularBadge && (
                    <span className="text-[11px] font-semibold text-zinc-300 bg-zinc-900 border border-white/15 px-2.5 py-0.5 rounded-full">
                      {plan.popularBadge}
                    </span>
                  )}
                </div>

                {/* Price Display - yearly billing now actually changes the price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-tight">
                    {displayPrice(plan, billedYearly)}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">
                    {plan.period}
                  </span>
                </div>

                {/* Subtext or Yearly Toggle */}
                <div className="mb-6 h-8 flex items-center">
                  {plan.hasToggle ? (
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                      <button
                        onClick={() => setBilledYearly(!billedYearly)}
                        className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors ${
                          billedYearly ? 'bg-zinc-700' : 'bg-zinc-900 border border-white/10'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                            billedYearly ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span>Billed yearly</span>
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-400">{plan.subtext}</span>
                  )}
                </div>

                {/* CTA Button */}
                <Link
                  to="/contact"
                  className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 cursor-pointer mb-3 inline-flex items-center justify-center ${
                    plan.btnVariant === 'white'
                      ? 'bg-white text-black hover:bg-zinc-200 shadow-white/10'
                      : 'bg-zinc-900 text-white border border-white/15 hover:bg-zinc-800'
                  }`}
                >
                  {plan.btnText}
                </Link>

                {/* 7-Day Trial Disclaimer */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 mb-8 font-normal">
                  <Info className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Get your free 7-day trial today!</span>
                </div>

                {/* Features List Section */}
                <div className="border-t border-white/5 pt-6">
                  <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-wider">
                    What's Included
                  </h4>

                  <ul className="space-y-3">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3 text-xs font-medium">
                        {feat.included ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-600 flex-shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-zinc-600" />
                          </div>
                        )}
                        <span className={feat.included ? 'text-zinc-200' : 'text-zinc-600'}>
                          {feat.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </motion.div>
          ))}
        </div>


        {/* ==================== ALL PLANS INCLUDE SECTION (Screenshot 2) ==================== */}
        <div className="pt-8">
          
          {/* Header Line Divider with Side Accent Dots */}
          <div className="flex items-center justify-center gap-4 text-xs font-bold text-white mb-10">
            <div className="h-[1px] w-24 sm:w-36 md:w-48 bg-gradient-to-r from-transparent via-white/30 to-white/60 relative">
              <div className="w-1.5 h-1.5 rounded-full bg-white absolute right-0 -top-[2px]" />
            </div>
            <span className="tracking-wide">All Plans Include</span>
            <div className="h-[1px] w-24 sm:w-36 md:w-48 bg-gradient-to-l from-transparent via-white/30 to-white/60 relative">
              <div className="w-1.5 h-1.5 rounded-full bg-white absolute left-0 -top-[2px]" />
            </div>
          </div>

          {/* Continuous Smooth Horizontal Marquee Ticker Bar */}
          <div className="relative overflow-hidden w-full py-4 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="flex items-center gap-8 w-max animate-marquee">
              {[...allPlansFeatures, ...allPlansFeatures, ...allPlansFeatures].map((item, idx) => {
                const IconComp = item.icon;

                return (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-zinc-400 whitespace-nowrap">
                    <IconComp className="w-4 h-4 text-zinc-300" />
                    <span className="text-zinc-300">{item.label}</span>
                    <span className="text-zinc-600 ml-5">â€¢</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
