import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Calendar, Share2, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { blogPosts } from '../data/blogData';
import api from '../utils/api';
import { withLineBreaks } from '../utils/text';
import logoImg from '../assets/logo.png';
import FreeTrialSection from '../components/FreeTrialSection';

export default function BlogPost() {
  const { slug } = useParams();
  const initialPost = blogPosts.find((p) => p.slug === slug) || null;
  const [post, setPost] = useState(initialPost);
  const [loading, setLoading] = useState(!initialPost);

  useEffect(() => {
    let active = true;
    api.get(`/blogs/${slug}`)
      .then((data) => {
        if (active && data.blog) {
          setPost(data.blog);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [slug]);

  if (!loading && !post) {
    return <Navigate to="/blogs" replace />;
  }

  if (!post) {
    return null;
  }

  const similarPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="bg-black text-white min-h-screen pt-28 sm:pt-36 pb-16 overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900/80 border border-white/10 rounded-full px-4 py-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to blogs</span>
          </Link>
        </div>

        {/* Category & Meta Line */}
        <div className="flex flex-wrap items-center gap-3 text-xs mb-4">
          <span className={`px-3 py-1 rounded-full font-semibold ${post.categoryBg} ${post.categoryColor}`}>
            {post.category}
          </span>
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            {post.date}
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            {post.readTime}
          </span>
        </div>

        {/* Article Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-8 font-tight leading-[1.12]">
          {post.title}
        </h1>

        {/* Author Bio Header */}
        <div className="flex items-center justify-between pb-8 mb-10 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <img
              src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={post.author?.name || 'Author'}
              className="w-12 h-12 rounded-2xl object-cover border border-white/20"
            />
            <div>
              <h3 className="text-sm font-bold text-white">{post.author?.name || post.author_name || 'Suprema Team'}</h3>
              <p className="text-xs text-zinc-400">{post.author?.role || post.author_role || 'Contributor'} <span className="text-zinc-600">•</span> {post.author?.handle || post.author_handle || '@suprema'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: post.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors"
              title="Share article"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Graphic Card Banner */}
        <div className="h-64 sm:h-80 md:h-96 bg-gradient-to-b from-[#1c1d24] via-[#0e0f14] to-[#070709] rounded-3xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center text-center p-8 mb-12 shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-40 bg-gradient-to-b from-white/20 via-white/5 to-transparent blur-2xl pointer-events-none" />
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          />
          <img src={logoImg} alt="Suprema Logo" className="h-16 w-auto object-contain mb-6 relative z-10" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight relative z-10 font-tight whitespace-pre-line">
            {withLineBreaks(post.bannerTitle || post.banner_title || post.title)}
          </h2>
        </div>

        {/* Article Excerpt */}
        <p className="text-lg sm:text-xl text-zinc-200 leading-relaxed font-medium mb-12 border-l-2 border-purple-500 pl-6 py-1">
          {post.excerpt}
        </p>

        {/* Content Sections */}
        <div className="space-y-10 text-zinc-300 text-base sm:text-lg leading-relaxed">
          {(Array.isArray(post.sections) ? post.sections : []).map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-tight">
                {section.heading}
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        {/* Newsletter Box in Post */}
        <div className="mt-16 p-8 rounded-3xl bg-[#0c0d12] border border-white/10 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-bold text-white mb-1 font-tight">Be the first to read our articles</h4>
            <p className="text-xs text-zinc-400">Get the latest insights on agile development and task management.</p>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30"
            />
            <button className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-zinc-200 transition-colors whitespace-nowrap">
              Submit
            </button>
          </div>
        </div>

      </article>

      {/* ==================== SIMILAR BLOGS SECTION ==================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 border-t border-white/10 pt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Related Insights</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-tight">Similar Blogs</h2>
          </div>
          <Link
            to="/blogs"
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>View All Blogs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {similarPosts.map((blog) => (
            <article
              key={blog.slug}
              className="bg-[#08080a] border border-white/10 rounded-3xl p-5 flex flex-col justify-between group hover:border-white/25 transition-all shadow-2xl"
            >
              <Link to={`/blog/${blog.slug}`} className="block">
                <div className="h-44 bg-gradient-to-b from-[#181920] via-[#0d0d12] to-[#070709] rounded-2xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center text-center p-4 mb-4 group-hover:border-white/25 transition-all">
                  <img src={logoImg} alt="Suprema Logo" className="h-8 w-auto object-contain mb-2" />
                  <h3 className="text-base font-bold text-white tracking-tight leading-tight font-tight whitespace-pre-line">
                    {withLineBreaks(blog.bannerTitle)}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs mb-2">
                  <span className={`font-semibold ${blog.categoryColor}`}>{blog.category}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400">{blog.date}</span>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug mb-3 group-hover:text-zinc-200 transition-colors">
                  {blog.title}
                </h4>
              </Link>

              <div className="pt-2 border-t border-white/5">
                <Link
                  to={`/blog/${blog.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors"
                >
                  <span>Read Full Blog</span>
                  <ChevronRight className="w-3 h-3 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Free Trial Section */}
      <FreeTrialSection />

    </div>
  );
}
