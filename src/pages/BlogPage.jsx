import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, BookOpen, ChevronRight, GraduationCap } from 'lucide-react';
import { blogPosts, authors } from '../data/blogData';
import logoImg from '../assets/small logo.svg';
import smallLogo from '../assets/small logo.svg';
import FreeTrialSection from '../components/FreeTrialSection';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Efficiency', 'Productivity', 'Collaboration', 'Task Management'];

  // Filter posts based on search query and category
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const featuredPosts = blogPosts.filter((p) => p.featured);

  return (
    <div className="bg-black text-white min-h-screen pt-24 sm:pt-32 md:pt-36 pb-16 overflow-hidden relative">

      {/* Background Dot Grid (matching Home Hero) */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top Studio Spotlights & Ambient Glows (matching Home Page) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-purple-600/[0.07] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/[0.05] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-600/[0.05] rounded-full blur-[140px] pointer-events-none" />

      {/* ==================== 1. HERO & SEARCH HEADER ==================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20 md:mb-24 text-center">

        {/* Top Suprema Shield Graphic with Float & Blur Entrance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)', y: -15 }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative mx-auto w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 flex items-center justify-center mb-5 sm:mb-6"
        >
          {/* Background Ambient Spotlight behind Shield */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 sm:w-48 h-36 sm:h-48 bg-white/15 rounded-full blur-2xl pointer-events-none" />

          {/* Dot Grid around Shield */}
          <div
            className="absolute -inset-6 sm:-inset-10 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
              backgroundSize: '14px 14px',
              maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)'
            }}
          />

          {/* Center Suprema Moon Inside Shield with floating animation */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img src={smallLogo} alt="Suprema Shield" className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain" />
          </motion.div>
        </motion.div>

        {/* Top Badge Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          whileHover={{ scale: 1.04 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs sm:text-sm font-semibold text-purple-400 mb-4 sm:mb-5 shadow-sm backdrop-blur-md cursor-default"
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
          <span>Our Blogs</span>
        </motion.div>

        {/* Main Title with Ambient Blur */}
        <div className="relative max-w-4xl mx-auto mb-4 sm:mb-6 px-2">
          {/* Subtle Ambient Glow behind Title */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] sm:max-w-[480px] h-[70px] sm:h-[100px] bg-white/[0.08] rounded-full blur-3xl pointer-events-none" />

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-tight leading-[1.12] sm:leading-[1.1] relative z-10"
          >
            News, insights and more
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-xs sm:text-sm md:text-base text-zinc-400 max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed font-normal px-4"
        >
          Dive into our blog for expert insights, tips, and industry trends to elevate your project management journey.
        </motion.p>

        {/* Search & Category Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="max-w-2xl mx-auto flex flex-col gap-3.5 sm:gap-4 items-center w-full px-2"
        >
          {/* Search Box */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for updates, topics, or authors..."
              className="w-full bg-[#0a0b0e]/90 border border-white/10 rounded-full pl-10 sm:pl-11 pr-14 sm:pr-16 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30 transition-all shadow-xl backdrop-blur-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white px-1.5 py-0.5 rounded bg-zinc-800/80 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills (Mobile friendly horizontal scroll with micro-interactions) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar max-w-full py-1 px-1 justify-start sm:justify-center">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 backdrop-blur-md ${selectedCategory === cat
                    ? 'bg-white text-black shadow-md'
                    : 'bg-zinc-900/80 border border-white/10 text-zinc-400 hover:text-white hover:border-white/25'
                  }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>


      {/* ==================== 2. FEATURED BLOGS SECTION ==================== */}
      {selectedCategory === 'All' && !searchQuery && (
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20 md:mb-24">

          {/* Horizontal Ambient Light Beam (matching Home Section Dividers) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* Centered Divider with Text */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="relative max-w-2xl mx-auto my-8 sm:my-10 flex items-center justify-center"
          >
            <div className="w-full border-t border-white/10" />
            <span className="absolute px-3 sm:px-4 bg-black text-xs sm:text-sm text-zinc-400 font-medium whitespace-nowrap">
              Our Featured Blogs
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {featuredPosts.map((blog, idx) => (
              <motion.article
                key={blog.slug}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="bg-[#08080a] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between group hover:border-white/25 transition-all shadow-2xl backdrop-blur-xl relative overflow-hidden"
              >
                {/* Subtle Arc Light Reflection Top Right */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-white/10 to-transparent blur-2xl pointer-events-none rounded-full" />

                <Link to={`/blog/${blog.slug}`} className="block flex-1 flex flex-col relative z-10">
                  {/* Banner Graphic Card */}
                  <div className="h-44 sm:h-48 md:h-48 lg:h-56 bg-gradient-to-b from-[#181920] via-[#0d0d12] to-[#070709] rounded-xl sm:rounded-2xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center text-center p-4 sm:p-6 mb-4 sm:mb-5 group-hover:border-white/25 transition-all shadow-inner flex-shrink-0">
                    {/* Top Spotlight Beam */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-gradient-to-b from-white/20 via-white/5 to-transparent blur-xl pointer-events-none" />

                    {/* Subtle Dot Pattern */}
                    <div
                      className="absolute inset-0 opacity-15 pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
                        backgroundSize: '16px 16px',
                      }}
                    />

                    {/* Logo Icon with Hover Scale */}
                    <div className="flex items-center justify-center text-white mb-2.5 sm:mb-3 relative z-10 group-hover:scale-110 transition-transform">
                      <img src={logoImg} alt="Suprema Logo" className="h-9 sm:h-10 lg:h-11 w-auto object-contain" />
                    </div>

                    {/* Banner Title */}
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight leading-tight relative z-10 font-tight whitespace-pre-line px-2">
                      {blog.bannerTitle}
                    </h3>
                  </div>

                  {/* Meta Category & Date */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm mb-2.5 px-1">
                    <span className={`font-semibold ${blog.categoryColor}`}>
                      {blog.category}
                    </span>
                    <span className="text-zinc-700">•</span>
                    <span className="text-zinc-400 font-semibold">{blog.date}</span>
                  </div>

                  {/* Article Title */}
                  <h4 className="text-base sm:text-lg font-semibold text-white leading-snug mb-3 px-1 group-hover:text-zinc-200 transition-colors line-clamp-2">
                    {blog.title}
                  </h4>
                </Link>

                {/* Read Full Blog Link */}
                <div className="pt-3 px-1 border-t border-white/5 mt-auto relative z-10">
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-400 group-hover:text-white transition-colors"
                  >
                    <span>Read Full Blog</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      )}


      {/* ==================== 3. ALL BLOGS COLLECTION (HORIZONTAL CARDS) ==================== */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-24 md:mb-32">

        {/* Section Header with Blur Entrance */}
        <div className="mb-8 sm:mb-12 text-center">

          {/* Top Pill Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm font-semibold text-amber-300 mb-4 sm:mb-5 shadow-sm"
          >
            <span>★</span>
            <span>All Blogs</span>
          </motion.div>

          {/* Main Title with Blur Animation */}
          <motion.h2
            initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white font-tight"
          >
            Discover Our Blog Collection
          </motion.h2>

          {(selectedCategory !== 'All' || searchQuery) && (
            <motion.p
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              className="text-xs sm:text-sm text-zinc-400 mt-2"
            >
              Showing results {selectedCategory !== 'All' ? `for "${selectedCategory}"` : ''} {searchQuery ? `matching "${searchQuery}"` : ''} ({filteredPosts.length})
            </motion.p>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            className="text-center py-16 sm:py-20 bg-zinc-950/60 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-xl"
          >
            <p className="text-base sm:text-lg text-zinc-400 mb-4">No articles found matching your search.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-5 py-2.5 bg-white text-black text-xs sm:text-sm font-semibold rounded-xl hover:bg-zinc-200 transition-colors cursor-pointer shadow-lg"
            >
              Reset Filters
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredPosts.map((blog, idx) => (
              <motion.article
                key={blog.slug}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
                whileHover={{ y: -3, transition: { duration: 0.25 } }}
                className="bg-[#08080a] border border-white/10 hover:border-white/25 rounded-2xl sm:rounded-3xl p-4 sm:p-5 transition-all shadow-xl hover:shadow-2xl group backdrop-blur-xl relative overflow-hidden"
              >
                {/* Subtle Arc Glow Top Right */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-white/5 to-transparent blur-2xl pointer-events-none rounded-full" />

                <Link
                  to={`/blog/${blog.slug}`}
                  className="flex flex-col md:flex-row items-stretch gap-4 sm:gap-6 md:gap-8 relative z-10"
                >
                  {/* Left Side: Wide Banner Thumbnail */}
                  <div className="w-full md:w-[300px] lg:w-[360px] h-44 sm:h-48 md:h-auto min-h-[160px] md:min-h-[190px] bg-gradient-to-b from-[#181920] via-[#0d0d12] to-[#070709] rounded-xl sm:rounded-2xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center text-center p-4 sm:p-6 flex-shrink-0 group-hover:border-white/25 transition-all shadow-inner">
                    {/* Top Spotlight Beam */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-gradient-to-b from-white/20 via-white/5 to-transparent blur-xl pointer-events-none" />

                    {/* Subtle Dot Grid Pattern */}
                    <div
                      className="absolute inset-0 opacity-15 pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
                        backgroundSize: '16px 16px',
                      }}
                    />

                    {/* Shield Logo Badge */}
                    <div className="flex items-center justify-center text-white mb-2.5 sm:mb-3 relative z-10 group-hover:scale-110 transition-transform">
                      <img src={logoImg} alt="Suprema Logo" className="h-9 sm:h-10 md:h-11 w-auto object-contain" />
                    </div>

                    {/* Banner Title */}
                    <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-white tracking-tight leading-tight relative z-10 font-tight whitespace-pre-line px-2">
                      {blog.bannerTitle}
                    </h3>
                  </div>

                  {/* Right Side: Article Details & Link */}
                  <div className="flex-1 flex flex-col justify-center py-1 sm:py-2 text-left w-full min-w-0">
                    {/* Category & Date */}
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mb-2">
                      <span className={`font-semibold ${blog.categoryColor}`}>
                        {blog.category}
                      </span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-zinc-400 font-normal">
                        {blog.date}
                      </span>
                      {blog.readTime && (
                        <>
                          <span className="text-zinc-600">·</span>
                          <span className="text-zinc-400 font-normal">{blog.readTime}</span>
                        </>
                      )}
                    </div>

                    {/* Article Title */}
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white leading-snug mb-2 group-hover:text-zinc-200 transition-colors font-tight">
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    {blog.excerpt && (
                      <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-3 sm:mb-4 font-normal">
                        {blog.excerpt}
                      </p>
                    )}

                    {/* Bottom Row: Author + Read Action */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-3 mt-auto">
                      {blog.author && (
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={blog.author.avatar}
                            alt={blog.author.name}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover flex-shrink-0"
                          />
                          <span className="text-xs text-zinc-400 truncate">
                            {blog.author.name}
                          </span>
                        </div>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-zinc-400 group-hover:text-white transition-colors flex-shrink-0 ml-auto">
                        <span>Read Full Blog</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>


      {/* ==================== 4. OUR AUTHORS SECTION ==================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-24 md:mb-32 pt-6">

        {/* Horizontal Light Beam at top of section */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        {/* Section Header with Blur Entrance */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 md:mb-16">

          {/* Top Pill Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm font-semibold text-emerald-400 mb-4 sm:mb-5 shadow-sm backdrop-blur-md"
          >
            <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
            <span>Our Authors</span>
          </motion.div>

          {/* Main Title with Blur Entrance */}
          <motion.h2
            initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white font-tight"
          >
            Meet Our Expert Authors
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {authors.map((author, idx) => (
            <motion.div
              key={author.id}
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="bg-[#08080a] border border-white/10 hover:border-white/25 rounded-2xl p-5 sm:p-6 transition-all shadow-xl flex flex-col justify-between group relative backdrop-blur-xl overflow-hidden"
            >
              {/* Top Right Arc Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-transparent blur-xl pointer-events-none rounded-full" />

              {/* Top Card Accent Tab */}
              <div className="w-10 h-[2px] bg-white/10 rounded-full mx-auto -mt-5 sm:-mt-6 mb-4 sm:mb-5 group-hover:bg-white/20 transition-colors relative z-10" />

              <div className="relative z-10">
                {/* Header: Avatar + Info */}
                <div className="flex items-center gap-3 sm:gap-3.5 mb-3.5 sm:mb-4">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-white/15 group-hover:scale-105 transition-transform flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-white font-tight truncate">{author.name}</h3>
                    <p className="text-xs sm:text-sm text-zinc-500 truncate">{author.role}</p>
                  </div>
                </div>

                {/* Bio text */}
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-5 sm:mb-6 font-normal">
                  {author.bio}
                </p>
              </div>

              {/* Bottom: Twitter/X Pill */}
              <div className="pt-1 mt-auto relative z-10">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`https://x.com/${author.handle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 hover:border-white/25 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm group-hover:bg-zinc-800"
                >
                  <span className="font-bold text-sm text-white">𝕏</span>
                  <span className="font-semibold text-xs sm:text-sm text-zinc-400">{author.handle}</span>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* ==================== 5. FREE TRIAL CTA SECTION ==================== */}
      <FreeTrialSection />

    </div>
  );
}
