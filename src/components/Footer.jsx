import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, ChevronRight } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Footer() {
  const location = useLocation();

  // Handle smooth scrolling to hash sections when navigating from footer links
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // Small delay to ensure the DOM has rendered after navigation
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <footer className="bg-black text-white relative pt-16 pb-12 overflow-hidden border-t border-black/80 font-sans">
      
      {/* Main Footer Container Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Frame Container with Side Accents */}
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 sm:p-12 md:p-14 shadow-2xl relative overflow-hidden">
          
          {/* Side Curved/Glow Panels */}
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black/5 via-black/[0.02] to-transparent border-r border-black/5 pointer-events-none" />
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black/5 via-black/[0.02] to-transparent border-l border-black/5 pointer-events-none" />

          {/* 4 Column Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start relative z-10">
            
            {/* Column 1: Brand Info */}
            <div className="md:col-span-5 space-y-4">
              {/* Suprema Logo */}
              <Link to="/" className="flex items-center gap-2 group inline-flex">
                <div className="flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
                  <img src={logoImg} alt="Suprema Logo" className="h-8 sm:h-10 w-auto object-contain" />
                </div>
              </Link>

              {/* Tagline */}
              <p className="text-sm text-zinc-400 font-normal leading-relaxed max-w-xs">
                Plan and navigate from idea to launch.
              </p>

              {/* Email Link */}
              <div>
                <a
                  href="mailto:hello@suprema.com"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors group"
                >
                  <Mail className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                  <span>hello@suprema.com</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-1 transition-all" />
                </a>
              </div>

              {/* All Systems Operational Pill */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 text-xs text-zinc-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                  <span>All Systems Operational</span>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Navigation */}
            <div className="md:col-span-3">
              <h3 className="text-sm font-bold text-white mb-4 tracking-tight">
                Quick Navigation
              </h3>
              <ul className="space-y-3 text-sm text-zinc-400 font-normal">
                <li><Link to="/#product-overview" className="hover:text-white transition-colors">Product Overview</Link></li>
                <li><Link to="/#features-showcase" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/#testimonials" className="hover:text-white transition-colors">Testimonials</Link></li>
                <li><Link to="/#faq" className="hover:text-white transition-colors">FAQ's</Link></li>
              </ul>
            </div>

            {/* Column 3: All Pages */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-bold text-white mb-4 tracking-tight">
                All Pages
              </h3>
              <ul className="space-y-3 text-sm text-zinc-400 font-normal">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/waitlist" className="hover:text-white transition-colors">Waitlist</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/blogs" className="hover:text-white transition-colors">Blogs</Link></li>
                <li><Link to="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/404" className="hover:text-white transition-colors">404</Link></li>
              </ul>
            </div>

            {/* Column 4: Social Handles */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-bold text-white mb-4 tracking-tight">
                Social Handles
              </h3>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white text-xs font-bold hover:bg-white hover:text-black transition-all shadow-md"
                  aria-label="LinkedIn"
                >
                  in
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white text-xs font-bold hover:bg-white hover:text-black transition-all shadow-md"
                  aria-label="X"
                >
                  𝕏
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-md"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Divider Line & Copyright Row */}
          <div className="border-t border-white/10 pt-6 mt-10 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-normal gap-4 relative z-10">
            <div className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors">
              © 2024 All rights reserved.
            </div>

            <div>
              <Link to="/privacy" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}

