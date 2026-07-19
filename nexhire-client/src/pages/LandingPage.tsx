import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, Sparkles, Target, Users, Zap, CheckCircle, BarChart3, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Smooth navbar animation on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Platform', href: '#platform' },
    { name: 'Analytics', href: '#analytics' },
    { name: 'Integrations', href: '#integrations' },
    { name: 'Security', href: '#security' },
  ];

  const features = [
    {
      icon: Users,
      title: 'Candidate Sourcing',
      description: 'Aggregate talent pools into a single, unified pipeline. Automatically parse resumes and extract key technical skills.',
    },
    {
      icon: Target,
      title: 'Structured Interviewing',
      description: 'Standardize rubrics so every candidate is evaluated fairly. Generate real-time scorecards for your hiring committees.',
    },
    {
      icon: BarChart3,
      title: 'Actionable Analytics',
      description: 'Identify bottlenecks in your hiring process with deep data insights, time-to-hire metrics, and diversity reporting.',
    }
  ];

  return (
    <div className="min-h-screen bg-bg-app flex flex-col selection:bg-brand-primary/20 scroll-smooth">
      
      {/* Animated Navigation */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg-surface/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="text-2xl font-bold text-brand-primary tracking-tight hover:scale-105 transition-transform">
              NexHire
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-sm font-medium text-text-muted hover:text-brand-primary transition-colors relative group">
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link to="/login" className="text-sm font-medium bg-brand-primary text-white px-5 py-2.5 rounded-full hover:bg-brand-secondary hover:shadow-md hover:-translate-y-0.5 transition-all">
              Explore Board
            </Link>
          </div>

          <button 
            className="md:hidden p-2 text-text-main hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full border-t border-gray-100 bg-bg-surface px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-base font-medium text-text-muted hover:text-brand-primary transition-colors py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
            <hr className="border-gray-100" />
            <div className="flex flex-col gap-3 pt-2">
              <Link to="/login" className="w-full text-center font-medium text-text-main border border-gray-200 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                Sign In
              </Link>
              <Link to="/login" className="w-full text-center font-medium bg-brand-primary text-white py-2.5 rounded-xl hover:bg-brand-secondary transition-colors">
                Explore Board
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section (Padding adjusted for fixed navbar) */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-16 md:pt-40 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold tracking-wide uppercase">
            <Sparkles size={14} /> Modern Pipeline Control
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-text-main tracking-tight leading-[1.1]">
            The <span className="italic text-brand-primary font-normal">thoughtful</span> hiring platform built for teams
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Manage applicants cleanly, schedule interviews transparently, and streamline your entire evaluation workflow without the clutter of legacy systems.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link to="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary text-white font-medium rounded-full hover:bg-brand-secondary transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 group cursor-pointer">
              Get Started Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 relative flex justify-center">
          <div className="bg-bg-surface w-full max-w-sm rounded-2xl border border-gray-200/60 p-6 shadow-xl relative z-10 space-y-6 transform transition-transform duration-500 hover:scale-[1.02]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-semibold text-text-main">Active Candidates</h3>
                <p className="text-xs text-text-muted">Engineering Department</p>
              </div>
              <span className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full border border-green-100">
                3 New Today
              </span>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Sarah Jenkins', stage: 'Technical Review', initial: 'SJ', bg: 'bg-brand-primary' },
                { name: 'Alex Rivera', stage: 'Interviewing', initial: 'AR', bg: 'bg-brand-secondary' },
                { name: 'Emma Watson', stage: 'Offer Pending', initial: 'EW', bg: 'bg-emerald-600' }
              ].map((cand, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-white hover:border-gray-100 transition-all shadow-sm hover:shadow-md cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${cand.bg} text-white text-xs font-bold flex items-center justify-center`}>
                      {cand.initial}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-main">{cand.name}</p>
                      <p className="text-xs text-text-muted">{cand.stage}</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl -z-10 animate-pulse" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-secondary/10 rounded-full blur-2xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </section>

      {/* Platform Section */}
      <section id="platform" className="bg-bg-surface py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-serif text-text-main tracking-tight mb-4">Everything you need to scale your team</h2>
            <p className="text-text-muted">NexHire replaces scattered spreadsheets and disjointed emails with a single, unified source of truth for your recruitment process.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="p-8 rounded-2xl bg-bg-app border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-6">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-text-main mb-3">{feature.title}</h3>
                  <p className="text-text-muted leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer id="security" className="bg-bg-surface border-t border-gray-200 pt-16 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-brand-primary tracking-tight">
              NexHire
            </Link>
            <p className="text-text-muted mt-4 max-w-sm leading-relaxed">
              The modern Applicant Tracking System engineered for fast-moving technical teams. Built with React, Node, and PostgreSQL.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-brand-primary" />
            <span>© 2026 NexHire Systems. All rights reserved.</span>
          </div>
          <div className="font-medium text-text-main">
            Engineered by Somnath Pandit · B.Tech CSE, University of Kalyani
          </div>
        </div>
      </footer>
    </div>
  );
}