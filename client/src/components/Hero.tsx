import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sun, Cpu, ArrowRight, CheckCircle2, Award, Zap, Activity } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onExplore }) => {
  return (
    <section id="home" className="relative min-h-[92vh] flex items-center overflow-hidden bg-brand-midnight pt-8 pb-16 lg:py-20">
      {/* Precision Blueprint Grid & Geometric Accents Background */}
      <div className="absolute inset-0 tech-grid-bg opacity-40 pointer-events-none" />
      
      {/* Ambient Gradient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-navy rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-brand-orange rounded-full blur-[140px] opacity-15 pointer-events-none" />

      {/* Decorative Blueprint Corner Markings */}
      <div className="absolute top-6 left-8 text-[11px] font-mono text-white/20 tracking-widest hidden xl:block">
        ARAN-SYS // COORD: 8.9535° N, 77.3828° E // PAVOORCHATRAM
      </div>
      <div className="absolute bottom-6 left-8 text-[11px] font-mono text-white/20 tracking-widest hidden xl:block">
        INTEGRATED ENGINEERING ARCHITECTURE // 2025
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-brand-orange/30 backdrop-blur-md shadow-[0_0_15px_rgba(255,138,0,0.15)]"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
              </span>
              <span className="text-xs font-mono font-medium tracking-wide text-brand-gray-200">
                Tamil Nadu's Trusted Engineering Integrator
              </span>
            </motion.div>

            {/* Oversized Cinematic Headline */}
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-heading"
              >
                ENGINEERING <br />
                <span className="orange-gradient-text">SMARTER.</span> <br />
                POWERING TOMORROW.
              </motion.h1>

              {/* Supporting Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="text-lg sm:text-xl text-brand-gray-300 max-w-2xl leading-relaxed pt-2 font-normal"
              >
                Integrated security, solar energy, and hydraulic solutions engineered for reliability. 
                Delivering commercial and industrial-grade installations built to endure.
              </motion.p>
            </div>

            {/* Core Capability Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1"
            >
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-brand-orange/40 transition-colors">
                <Shield className="w-4 h-4 text-brand-orange shrink-0" />
                <span className="text-xs font-semibold text-brand-gray-200">CCTV Surveillance</span>
              </div>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-brand-orange/40 transition-colors">
                <Sun className="w-4 h-4 text-brand-orange shrink-0" />
                <span className="text-xs font-semibold text-brand-gray-200">Solar Power Plants</span>
              </div>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-brand-orange/40 transition-colors">
                <Cpu className="w-4 h-4 text-brand-orange shrink-0" />
                <span className="text-xs font-semibold text-brand-gray-200">Hydraulic Systems</span>
              </div>
            </motion.div>

            {/* Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <button
                onClick={onOpenBooking}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-orange to-[#FF6200] text-white text-base font-bold shadow-xl shadow-brand-orange/25 hover:shadow-brand-orange/50 hover:brightness-110 transition-all duration-200 cursor-pointer"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
              </button>

              <button
                onClick={onExplore}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-brand-gray-200 hover:text-white text-base font-semibold border border-white/15 hover:border-white/30 backdrop-blur-md transition-all duration-200 cursor-pointer"
              >
                <span>Explore Our Solutions</span>
              </button>
            </motion.div>

            {/* Official Business Verification Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-mono text-brand-gray-400"
            >
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-brand-orange" />
                <span>GST Registered: <strong className="text-brand-gray-200 font-semibold">33AABPX4889K3ZY</strong></span>
              </div>
              <span className="text-white/20 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>UDYAM: <strong className="text-brand-gray-200 font-semibold">TN-37-0063266</strong></span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Layered Interactive Engineering Composition */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative mx-auto max-w-lg lg:max-w-none"
            >
              {/* Outer Glow Halo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/20 via-brand-navy to-brand-navy/60 rounded-3xl blur-2xl transform -rotate-1 scale-105 pointer-events-none" />

              {/* Main Engineering Showcase Card */}
              <div className="relative rounded-2xl bg-brand-navy/90 border border-white/15 backdrop-blur-xl overflow-hidden shadow-2xl corner-bracket-tl corner-bracket-br">
                
                {/* Visual Imagery Preview */}
                <div className="relative h-64 sm:h-72 overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
                    alt="Precision Technology & Automation Architecture"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
                  
                  {/* Dynamic Technical Circuit Lines Overlay */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-brand-orange flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 animate-pulse text-brand-orange" />
                    <span>SYSTEM ONLINE // 24/7 OPERATION</span>
                  </div>

                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/80">
                    PRECISION SPECS
                  </div>
                </div>

                {/* Technical Metric Feed */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-brand-gray-400">Integrated Division</span>
                    <span className="text-xs font-mono text-brand-orange font-semibold">Core Focus</span>
                  </div>

                  {/* Division 1: CCTV */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-brand-orange/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-brand-orange/10 text-brand-orange">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">CCTV & Surveillance</div>
                        <div className="text-xs text-brand-gray-400">4K AI Detection & Remote Cloud Setup</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      Active
                    </span>
                  </div>

                  {/* Division 2: Solar */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-brand-orange/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-brand-orange/10 text-brand-orange">
                        <Sun className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Solar Power Solutions</div>
                        <div className="text-xs text-brand-gray-400">On-Grid / Off-Grid Hybrid Systems</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-brand-orange px-2 py-0.5 rounded bg-brand-orange/10 border border-brand-orange/20">
                      Tier-1 PV
                    </span>
                  </div>

                  {/* Division 3: Hydraulics */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-brand-orange/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-brand-orange/10 text-brand-orange">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Hydraulic Systems & Automation</div>
                        <div className="text-xs text-brand-gray-400">Heavy HPUs, Servicing & Automation</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                      350+ Bar
                    </span>
                  </div>

                  {/* Bottom Quick Call */}
                  <div className="pt-2 flex items-center justify-between text-xs text-brand-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-brand-orange" />
                      Fast Site Survey & Engineering Assessment
                    </span>
                    <a
                      href="tel:+919025672856"
                      className="font-mono text-brand-orange hover:underline font-semibold"
                    >
                      Call Lead Engineer
                    </a>
                  </div>
                </div>
              </div>

              {/* Floating Decorative Badge */}
              <div className="absolute -bottom-5 -left-5 bg-brand-midnight/95 border border-brand-orange/40 rounded-xl p-3 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange font-bold">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Zero Compromise Standards</div>
                  <div className="text-[11px] text-brand-gray-400">Certified industrial components</div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
