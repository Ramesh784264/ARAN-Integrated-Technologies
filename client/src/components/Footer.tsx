import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, ShieldCheck, ArrowUp, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BusinessSettings } from '../types';

interface FooterProps {
  settings?: BusinessSettings;
  onOpenBooking: (category?: string) => void;
  onOpenTracker: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenBooking, onOpenTracker }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const phone = settings?.phone || '+91 90256 72856';
  const email = settings?.email || 'aranidts@gmail.com';
  const address = settings?.address || '10/264 A3, Kamaraj Nagar North, Pavoorchatram, Tenkasi District, Tamil Nadu 627808.';
  const gstin = settings?.gstin || '33AABPX4889K3ZY';
  const udyam = settings?.udyam || 'TN-37-0063266';

  return (
    <footer className="bg-brand-midnight text-brand-gray-300 border-t border-white/10 relative overflow-hidden text-left">
      <div className="absolute inset-0 tech-grid-bg opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info & Mission (Col 1-2) */}
          <div className="lg:col-span-2 space-y-5">
            <Logo size="lg" />
            <p className="text-sm text-brand-gray-300 leading-relaxed max-w-sm">
              ARAN Integrated Technologies is a multidisciplinary engineering company delivering precision electronic security surveillance, turnkey solar power systems, and heavy-duty industrial hydraulic automation.
            </p>

            <div className="space-y-2 pt-2 text-xs font-mono text-brand-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-brand-orange font-semibold">GSTIN:</span>
                <span className="text-white">{gstin}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-semibold">UDYAM:</span>
                <span className="text-white">{udyam}</span>
              </div>
            </div>
          </div>

          {/* Quick Links (Col 3) */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              Engineering Divisions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onOpenBooking('CCTV Surveillance')}
                  className="hover:text-brand-orange transition-colors cursor-pointer text-left"
                >
                  CCTV Surveillance & Security
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('Solar Power')}
                  className="hover:text-brand-orange transition-colors cursor-pointer text-left"
                >
                  Solar Power Solutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('Hydraulic Systems')}
                  className="hover:text-brand-orange transition-colors cursor-pointer text-left"
                >
                  Hydraulic Systems & Automation
                </button>
              </li>
              <li>
                <a href="#projects" className="hover:text-brand-orange transition-colors">
                  Field Project Portfolio
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-brand-orange transition-colors">
                  Verified Client Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Tools (Col 4) */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              Client Tools & Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onOpenBooking()}
                  className="text-brand-orange font-semibold hover:underline cursor-pointer"
                >
                  Book a Consultation
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTracker}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Track Booking Request</span>
                </button>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  Service Process & SLA
                </a>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-brand-gray-400 hover:text-brand-orange transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Secure Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Contact Details (Col 5) */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              Headquarters
            </h4>
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                <span className="text-brand-gray-300">{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-white hover:text-brand-orange font-semibold font-mono">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a href={`mailto:${email}`} className="text-white hover:text-brand-orange font-mono">
                  {email}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-brand-gray-400">
          <p>© {new Date().getFullYear()} ARAN Integrated Technologies. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <span>Engineering Excellence in Tamil Nadu</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer flex items-center gap-1"
              title="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5 text-brand-orange" />
              <span className="text-[11px]">Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
