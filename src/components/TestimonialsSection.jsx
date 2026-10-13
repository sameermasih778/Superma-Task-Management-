import React from 'react';
import { motion } from 'framer-motion';
import { Smile } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 'alex-saunders',
      quote: "Suprema has customizable features that align perfectly with our team's needs!",
      author: 'Alex Saunders',
      role: 'Founder',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'david-lee',
      quote: 'Suprema has streamlined our processes, significantly improving communication and project outcomes.',
      author: 'David Lee',
      role: 'Senior Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'rachel-adams',
      quote: 'With Suprema, our team collaboration has never been smoother or more efficient.',
      author: 'Rachel Adams',
      role: 'Marketing Director',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'mark-johnson',
      quote: 'This tool has revolutionized our workflow, making project tracking incredibly easy.',
      author: 'Mark Johnson',
      role: 'Project Coordinator',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
  ];

  // Tripled testimonials list for seamless looping marquee
  const marqueeList = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-black text-white relative overflow-hidden border-t border-white/10">
      
      {/* Background Ambient Pink Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-pink-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top 3D Glowing Heart Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative w-48 h-36 sm:w-56 sm:h-40 mx-auto mb-6 flex items-center justify-center"
        >
          {/* Heart Arc Light Beam */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-28 bg-gradient-to-b from-pink-500/20 via-pink-500/5 to-transparent blur-xl pointer-events-none" />

          {/* Dotted Heart Graphic SVG */}
          <svg className="w-50 h-50 text-white/30 fill-none" viewBox="0 0 100 80">
            <path
              d="M50 70 C20 45 5 25 25 10 C35 2 45 12 50 20 C55 12 65 2 75 10 C95 25 80 45 50 70 Z"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.5"
              strokeDasharray="2 3"
            />
            <path
              d="M50 62 C26 40 12 24 28 12 C36 6 44 14 50 20 C56 14 64 6 72 12 C88 24 74 40 50 62 Z"
              stroke="rgba(244, 114, 182, 0.6)"
              strokeWidth="1"
              strokeDasharray="1 2"
            />
          </svg>

          {/* Overlapping Testimonials Badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-950 border border-pink-500/30 text-xs font-semibold text-pink-400 shadow-xl backdrop-blur-md">
              <Smile className="w-3.5 h-3.5 text-pink-400" />
              <span>Testimonials</span>
            </div>
          </div>
        </motion.div>

        {/* Section Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-16 font-tight pt-4"
        >
          What Our Users Say
        </motion.h2>

      </div>

      {/* Moving Marquee Outer Wrapper with Vignette Overlays & Mask */}
      <div className="relative w-full py-4 overflow-hidden">
        
        {/* Left Faded Overlay */}
        <div className="absolute top-0 left-0 w-32 sm:w-64 h-full bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none z-20" />
        
        {/* Right Faded Overlay */}
        <div className="absolute top-0 right-0 w-32 sm:w-64 h-full bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none z-20" />

        {/* Marquee Track with Gradient Alpha Mask */}
        <div className="relative overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)] z-10">
          <div className="flex items-center gap-6 w-max animate-marquee text-left">
            {marqueeList.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="w-[300px] sm:w-[350px] bg-[#050505] border border-white/10 rounded-2xl p-6 flex flex-col justify-between group hover:border-white/25 transition-all shadow-2xl min-h-[260px] flex-shrink-0"
              >
                <div>
                  {/* Double Quote Marks Header */}
                  <div className="text-zinc-500 font-serif text-3xl font-extrabold leading-none mb-3 opacity-60">
                    “
                  </div>

                  {/* Quote Text */}
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal mb-6">
                    {item.quote}
                  </p>
                </div>

                {/* Author Info & Avatar Footer */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug">
                      {item.author}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-normal mt-0.5">
                      {item.role}
                    </p>
                  </div>

                  {/* Rounded Square Avatar Thumbnail */}
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-md group-hover:scale-105 transition-transform flex-shrink-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}
