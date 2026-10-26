import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Compass, Clock, CheckCircle2, FileText, Cpu, Check, Wrench } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: Compass,
      title: 'Integrated Engineering Expertise',
      desc: 'Seamless convergence across surveillance security, solar energy systems, and industrial fluid hydraulics with dedicated subject-matter specialists.',
      highlight: 'Multi-Discipline Synergy'
    },
    {
      icon: ShieldAlert,
      title: 'Industrial Safety Standards',
      desc: 'Strict adherence to electrical safety, structural wind-load tolerances for solar arrays, and high-pressure hydraulic containment protocols.',
      highlight: 'Zero Compromise'
    },
    {
      icon: Cpu,
      title: 'Original Industrial-Grade Hardware',
      desc: 'We procure exclusively from certified manufacturers: Tier-1 solar modules, enterprise-grade IP cameras, and precision hydraulic components.',
      highlight: 'Verified Sourcing'
    },
    {
      icon: Clock,
      title: 'Reliable Troubleshooting & Support',
      desc: 'Dedicated technical response team located in Pavoorchatram, Tenkasi, ensuring prompt on-site diagnostics, scheduled servicing, and minimal downtime.',
      highlight: 'Regional Dispatch'
    },
    {
      icon: FileText,
      title: 'Official Compliance & Transparent Billing',
      desc: 'Complete transparency with GST-compliant invoicing, UDYAM registration, manufacturer warranty records, and utility approval documentation.',
      highlight: 'Government Compliant'
    },
    {
      icon: Wrench,
      title: 'Custom Engineering & Precision Sizing',
      desc: 'No one-size-fits-all packages. Every security coverage map, solar kW capacity, and hydraulic flow loop is tailored to your actual operational demand.',
      highlight: 'Tailored Execution'
    }
  ];

  return (
    <section id="why-us" className="py-24 bg-brand-midnight relative overflow-hidden">
      {/* Circuit and blueprint backdrop */}
      <div className="absolute inset-0 tech-dot-bg opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-navy rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-brand-orange font-mono text-xs uppercase tracking-widest">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange" />
            Engineering Discipline & Integrity
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
            WHY ARAN INTEGRATED <br />
            <span className="orange-gradient-text">IS BUILT DIFFERENT.</span>
          </h2>
          <p className="text-brand-gray-300 text-base sm:text-lg">
            Engineering reliability isn't a marketing slogan — it is our operational benchmark. 
            We build sustainable, secure, and resilient infrastructure.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative p-7 rounded-2xl bg-brand-navy/60 border border-white/10 hover:border-brand-orange/40 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-brand-orange/10 flex flex-col justify-between"
              >
                {/* Tech Bracket Indicator */}
                <div className="absolute top-3 right-3 text-[10px] font-mono text-brand-gray-400 group-hover:text-brand-orange transition-colors">
                  PILLAR // 0{idx + 1}
                </div>

                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 group-hover:border-brand-orange/50 group-hover:bg-brand-orange/10 flex items-center justify-center text-brand-orange transition-colors">
                    <IconComponent className="w-6 h-6 transition-transform group-hover:scale-110" />
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-brand-orange font-semibold uppercase tracking-wider block mb-1">
                      {pillar.highlight}
                    </span>
                    <h3 className="text-lg font-bold text-white font-heading">
                      {pillar.title}
                    </h3>
                  </div>

                  <p className="text-sm text-brand-gray-300 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-brand-gray-400 group-hover:text-brand-gray-200 transition-colors">
                  <Check className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Verified Standard</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
