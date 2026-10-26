import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, PhoneCall, CalendarCheck, ArrowRight, ShieldCheck } from 'lucide-react';

interface HowItWorksProps {
  onOpenBooking: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenBooking }) => {
  const steps = [
    {
      step: '01',
      icon: ClipboardList,
      title: 'Submit Your Service Request',
      description: 'Select your service division (CCTV, Solar, or Hydraulics), choose your preferred date & time window, and share your project site details through our structured booking form.',
      tag: 'Instant Reference Code'
    },
    {
      step: '02',
      icon: PhoneCall,
      title: 'Receive Engineering Consultation',
      description: 'Our technical team in Pavoorchatram reviews your requirements, validates site feasibility, and contacts you via phone or WhatsApp to finalize scope and transparent pricing.',
      tag: 'Expert Verification'
    },
    {
      step: '03',
      icon: CalendarCheck,
      title: 'Confirmed Schedule & Execution',
      description: 'Once agreed, your appointment is confirmed. Certified technicians arrive on site equipped with calibrated tools and genuine parts to perform precision installation or diagnostics.',
      tag: 'Guaranteed Standards'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-brand-midnight relative overflow-hidden">
      <div className="absolute inset-0 tech-dot-bg opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-brand-orange font-mono text-xs uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
            Clear Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
            HOW THE SERVICE <br />
            <span className="orange-gradient-text">PROCESS WORKS.</span>
          </h2>
          <p className="text-brand-gray-300 text-base sm:text-lg">
            A transparent, three-step journey designed for industrial precision, clear communication, and zero surprises.
          </p>
        </div>

        {/* 3 Step Cards with Connecting Line */}
        <div className="relative">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-16 right-16 h-0.5 bg-gradient-to-r from-brand-orange/20 via-brand-orange/60 to-brand-orange/20 -translate-y-8 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="relative p-8 rounded-2xl bg-brand-navy/70 border border-white/10 hover:border-brand-orange/40 backdrop-blur-xl transition-all duration-300 shadow-xl flex flex-col justify-between group"
                >
                  <div className="space-y-5">
                    {/* Step Number & Icon */}
                    <div className="flex items-center justify-between">
                      <div className="h-14 w-14 rounded-2xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center group-hover:scale-105 group-hover:bg-brand-orange group-hover:text-white transition-all shadow-lg shadow-brand-orange/10">
                        <IconComp className="w-7 h-7" />
                      </div>
                      <span className="text-3xl font-extrabold text-white/15 font-mono group-hover:text-brand-orange/30 transition-colors">
                        {item.step}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-mono text-brand-orange font-semibold uppercase tracking-wider block mb-1">
                        {item.tag}
                      </span>
                      <h3 className="text-xl font-bold text-white font-heading">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-sm text-brand-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between text-xs text-brand-gray-400 font-mono">
                    <span>STEP {item.step} OF 03</span>
                    <span className="text-brand-orange font-semibold">ARAN PROTOCOL</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Process Confirmation Notice & CTA */}
        <div className="mt-14 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <span className="h-2 w-2 rounded-full bg-brand-orange" />
              Note on Appointment Confirmations
            </h4>
            <p className="text-xs text-brand-gray-300">
              Preferred appointment dates and time windows are scheduling requests. Our engineering team confirms exact arrival times following technical review.
            </p>
          </div>

          <button
            onClick={onOpenBooking}
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-lg shadow-brand-orange/20 cursor-pointer"
          >
            <span>Start Your Request</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
