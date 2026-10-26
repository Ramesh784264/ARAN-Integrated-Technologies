import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, MessageCircle, Calendar } from 'lucide-react';

interface CTASectionProps {
  onOpenBooking: () => void;
  phone?: string;
  whatsapp?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  onOpenBooking,
  phone = '+91 90256 72856',
  whatsapp = '919025672856'
}) => {
  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-brand-midnight via-brand-navy to-[#083061] border-t border-white/10">
      {/* Background Blueprint grid */}
      <div className="absolute inset-0 tech-grid-bg opacity-30 pointer-events-none" />
      
      {/* Glowing Orange Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-64 bg-brand-orange rounded-full blur-[160px] opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-brand-orange/40 text-brand-orange font-mono text-xs uppercase tracking-widest backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-brand-orange animate-ping" />
          Ready to Upgrade Your Infrastructure?
        </div>

        {/* Mandatory Exact Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-heading tracking-tight leading-tight max-w-4xl mx-auto">
          LET'S BUILD YOUR NEXT <br />
          <span className="orange-gradient-text">SMART SOLUTION.</span>
        </h2>

        <p className="text-brand-gray-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          From high-definition multi-point CCTV networks and turnkey solar power plants to heavy industrial hydraulic automation — our engineers are ready to deploy.
        </p>

        {/* Action Triggers */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onOpenBooking}
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-base font-bold shadow-2xl shadow-brand-orange/30 hover:shadow-brand-orange/50 transition-all cursor-pointer"
          >
            <Calendar className="w-5 h-5" />
            <span>Book a Consultation</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href={`https://wa.me/${whatsapp}?text=Hello%20ARAN%20Integrated%20Technologies,%20I%20would%20like%20to%20consult%20on%20a%20project.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-base font-semibold border border-white/20 backdrop-blur-md transition-all cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 text-emerald-400" />
            <span>WhatsApp Enquiry</span>
          </a>

          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-transparent hover:bg-white/5 text-brand-gray-300 hover:text-white text-base font-semibold border border-white/10 transition-all cursor-pointer"
          >
            <Phone className="w-5 h-5 text-brand-orange" />
            <span>Call: {phone}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
