import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sun, Cpu, Check, ArrowRight, ExternalLink, Zap, Wrench, Eye, Activity, X } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  services: ServiceItem[];
  onBookService: (category: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onBookService }) => {
  const [activeTab, setActiveTab] = useState<'cctv' | 'solar' | 'hydraulics'>('cctv');
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);

  // Fallback defaults if services array is loading
  const defaultServices: Record<'cctv' | 'solar' | 'hydraulics', Partial<ServiceItem>> = {
    cctv: {
      category: 'cctv',
      title: 'CCTV Surveillance & Security',
      tagline: 'High-definition AI-powered surveillance and 24/7 remote monitoring architecture.',
      description: 'End-to-end electronic security solutions for industrial warehouses, commercial establishments, and luxury residences. We deploy ultra-HD cameras with night color vision, motion analytics, remote multi-device access, and reliable local/cloud NVR arrays.',
      features: [
        'CCTV camera installation',
        'Security system upgrades',
        'Remote monitoring setup',
        'Maintenance and troubleshooting',
        'PTZ & 360-degree panoramic coverage',
        'Intelligent intrusion & line-crossing alerts'
      ],
      specs: {
        'Clarity': '4K UHD / Starlight Night Vision',
        'Monitoring': 'Encrypted Cloud & Mobile Live-Feed',
        'Storage': 'High-Endurance NVR with RAID Support',
        'Uptime': '99.9% Continuous Recording Guarantee'
      },
      image_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
      icon_name: 'Shield'
    },
    solar: {
      category: 'solar',
      title: 'Solar Power Solutions',
      tagline: 'High-efficiency photovoltaic systems delivering sustainable, resilient energy.',
      description: 'Turnkey solar engineering from technical site feasibility study to grid synchronization. We design and install rooftop on-grid, off-grid hybrid, and agricultural water pumping solar infrastructure designed to drastically slash utility tariffs.',
      features: [
        'Solar panel installation',
        'Solar system consultation',
        'Installation maintenance',
        'System inspection and troubleshooting',
        'Net-metering & EB approvals facilitation',
        'Smart hybrid inverters with battery backup'
      ],
      specs: {
        'Panels': 'Tier-1 Mono PERC (>21.5% Efficiency)',
        'Inverters': 'Smart MPPT with Dual Tracking',
        'Warranty': '25-Year Linear Performance Warranty',
        'Payback': 'Estimated 3 to 4 Years ROI'
      },
      image_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
      icon_name: 'Sun'
    },
    hydraulics: {
      category: 'hydraulics',
      title: 'Hydraulic Systems & Automation',
      tagline: 'Heavy-duty industrial hydraulic engineering, precision fluid power, and factory automation.',
      description: 'Comprehensive fluid power engineering. We construct custom hydraulic power packs (HPUs), overhaul heavy hydraulic cylinders, integrate proportional directional valves, and engineer PLC-controlled electro-hydraulic automation for zero downtime.',
      features: [
        'Hydraulic system installation',
        'Hydraulic equipment servicing',
        'Automation solutions',
        'Maintenance and technical support',
        'Precision cylinder resealing & rod honing',
        'High-pressure fluid filtration & testing'
      ],
      specs: {
        'Pressure': 'Rated Up to 350+ Bar Heavy Duty',
        'Valves': 'Proportional & Direct Directional Control',
        'Standards': 'ISO 4406 Fluid Cleanliness Verified',
        'Automation': 'Integrated PLC Electro-Hydraulic Loops'
      },
      image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      icon_name: 'Cpu'
    }
  };

  const getServiceData = (cat: 'cctv' | 'solar' | 'hydraulics'): ServiceItem => {
    const found = services.find(s => s.category === cat);
    if (found) {
      return {
        ...found,
        features: typeof found.features === 'string' ? JSON.parse(found.features) : found.features,
        specs: typeof found.specs === 'string' ? JSON.parse(found.specs) : found.specs
      };
    }
    return defaultServices[cat] as ServiceItem;
  };

  const currentService = getServiceData(activeTab);

  const getCategoryDisplayName = (cat: string) => {
    if (cat === 'cctv') return 'CCTV Surveillance';
    if (cat === 'solar') return 'Solar Power';
    return 'Hydraulic Systems';
  };

  return (
    <section id="services" className="py-24 bg-brand-navy/60 relative overflow-hidden border-t border-b border-white/5">
      {/* Background blueprint details */}
      <div className="absolute inset-0 tech-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-orange/10 border border-brand-orange/30 text-brand-orange font-mono text-xs uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5" />
              Specialized Engineering Divisions
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
              PRECISION SOLUTIONS. <br />
              <span className="orange-gradient-text">CUSTOM ENGINEERED.</span>
            </h2>
            <p className="text-brand-gray-300 text-base sm:text-lg">
              Each division operates with dedicated engineering leads, specialized equipment, and stringent quality protocols.
            </p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-brand-midnight/90 border border-white/10 backdrop-blur-md self-start md:self-auto">
            <button
              onClick={() => setActiveTab('cctv')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'cctv'
                  ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30'
                  : 'text-brand-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>CCTV Security</span>
            </button>

            <button
              onClick={() => setActiveTab('solar')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'solar'
                  ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30'
                  : 'text-brand-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Solar Energy</span>
            </button>

            <button
              onClick={() => setActiveTab('hydraulics')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'hydraulics'
                  ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30'
                  : 'text-brand-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Hydraulic Systems</span>
            </button>
          </div>
        </div>

        {/* Featured Asymmetric Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl bg-brand-midnight/80 border border-white/15 backdrop-blur-xl overflow-hidden shadow-2xl corner-bracket-tl corner-bracket-br"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Left Column: Visual Imagery with Interactive Overlays */}
              <div className="lg:col-span-6 relative min-h-[340px] sm:min-h-[420px] lg:min-h-full overflow-hidden group">
                <img
                  src={currentService.image_url}
                  alt={currentService.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-brand-midnight/40 to-brand-midnight" />
                
                {/* Floating Division Badge */}
                <div className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-brand-midnight/90 border border-white/20 backdrop-blur-md flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-brand-orange text-white">
                    {activeTab === 'cctv' && <Shield className="w-5 h-5" />}
                    {activeTab === 'solar' && <Sun className="w-5 h-5" />}
                    {activeTab === 'hydraulics' && <Cpu className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-xs font-mono text-brand-orange font-semibold tracking-wider uppercase">DIVISION // 0{activeTab === 'cctv' ? '1' : activeTab === 'solar' ? '2' : '3'}</div>
                    <div className="text-sm font-bold text-white">{currentService.title}</div>
                  </div>
                </div>

                {/* Quick Inspection Tag */}
                <div className="absolute bottom-6 left-6 right-6 lg:right-auto bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-3.5 text-xs font-mono text-brand-gray-300 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                    Field Verified Deployments
                  </span>
                  <span className="text-brand-orange font-semibold">Tenkasi & South TN</span>
                </div>
              </div>

              {/* Right Column: Service Deep Dive */}
              <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between text-left space-y-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                      {currentService.title}
                    </h3>
                    <p className="text-brand-orange font-medium text-sm sm:text-base mt-1">
                      {currentService.tagline}
                    </p>
                  </div>

                  <p className="text-brand-gray-300 text-sm sm:text-base leading-relaxed">
                    {currentService.description}
                  </p>

                  {/* Capabilities List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-brand-gray-400 font-semibold">
                      Key Services & Deliverables:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {Array.isArray(currentService.features) && currentService.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-gray-200">
                          <div className="h-5 w-5 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-brand-orange" />
                          </div>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical Spec Matrix */}
                  {currentService.specs && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 grid grid-cols-2 gap-4">
                      {Object.entries(currentService.specs).map(([key, val], idx) => (
                        <div key={idx} className="space-y-0.5">
                          <span className="text-[11px] font-mono uppercase text-brand-gray-400 tracking-wider">{key}</span>
                          <div className="text-xs sm:text-sm font-semibold text-white truncate">{String(val)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => onBookService(getCategoryDisplayName(activeTab))}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-lg shadow-brand-orange/25 transition-all cursor-pointer"
                  >
                    <span>Book This Service</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setSelectedServiceModal(currentService)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-brand-gray-200 hover:text-white text-sm font-semibold border border-white/10 transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-brand-orange" />
                    <span>View Full Specs</span>
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Triple Service Quick Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
          
          {/* Card 1: CCTV */}
          <div
            onClick={() => setActiveTab('cctv')}
            className={`p-6 rounded-2xl border transition-all cursor-pointer glass-card glass-card-hover ${
              activeTab === 'cctv' ? 'border-brand-orange shadow-orange-glow' : 'border-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-brand-orange/15 text-brand-orange">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-brand-gray-400">01 // SECURITY</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2 font-heading">CCTV Surveillance</h4>
            <p className="text-xs text-brand-gray-300 line-clamp-2 mb-4">
              Camera installation, security upgrades, remote monitoring setup, and troubleshooting.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-semibold text-brand-orange">
              <span>Explore Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Solar */}
          <div
            onClick={() => setActiveTab('solar')}
            className={`p-6 rounded-2xl border transition-all cursor-pointer glass-card glass-card-hover ${
              activeTab === 'solar' ? 'border-brand-orange shadow-orange-glow' : 'border-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-brand-orange/15 text-brand-orange">
                <Sun className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-brand-gray-400">02 // ENERGY</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2 font-heading">Solar Power Solutions</h4>
            <p className="text-xs text-brand-gray-300 line-clamp-2 mb-4">
              Solar panel installation, system consultation, inspection, and maintenance.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-semibold text-brand-orange">
              <span>Explore Energy Systems</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Hydraulics */}
          <div
            onClick={() => setActiveTab('hydraulics')}
            className={`p-6 rounded-2xl border transition-all cursor-pointer glass-card glass-card-hover ${
              activeTab === 'hydraulics' ? 'border-brand-orange shadow-orange-glow' : 'border-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-brand-orange/15 text-brand-orange">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-brand-gray-400">03 // POWER</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2 font-heading">Hydraulic Systems & Automation</h4>
            <p className="text-xs text-brand-gray-300 line-clamp-2 mb-4">
              Hydraulic equipment servicing, system installation, automation, and technical support.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-semibold text-brand-orange">
              <span>Explore Hydraulics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

      </div>

      {/* Technical Details Modal */}
      {selectedServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-brand-navy border border-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-left relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setSelectedServiceModal(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-brand-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-orange text-white">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-brand-orange">Technical Blueprint Specs</span>
                <h3 className="text-2xl font-bold text-white">{selectedServiceModal.title}</h3>
              </div>
            </div>

            <p className="text-brand-gray-300 text-sm leading-relaxed">
              {selectedServiceModal.description}
            </p>

            {/* Features */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-brand-gray-400 font-semibold">
                Scope of Work & Capabilities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Array.isArray(selectedServiceModal.features) && selectedServiceModal.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-brand-gray-200 p-2 rounded bg-white/5">
                    <Check className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specs */}
            {selectedServiceModal.specs && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-widest text-brand-gray-400 font-semibold">
                  Engineering Specifications
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedServiceModal.specs).map(([k, v], idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-[10px] font-mono uppercase text-brand-gray-400">{k}</div>
                      <div className="text-sm font-semibold text-white mt-0.5">{String(v)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setSelectedServiceModal(null)}
                className="px-5 py-2.5 rounded-xl bg-white/5 text-brand-gray-200 text-sm hover:bg-white/10"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const cat = selectedServiceModal.category === 'cctv' ? 'CCTV Surveillance' : selectedServiceModal.category === 'solar' ? 'Solar Power' : 'Hydraulic Systems';
                  setSelectedServiceModal(null);
                  onBookService(cat);
                }}
                className="px-6 py-2.5 rounded-xl bg-brand-orange text-white text-sm font-bold shadow-lg shadow-brand-orange/30 hover:bg-brand-orange-hover"
              >
                Book This Service
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
