import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Phone, Calendar, Menu, X, ShieldCheck, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onOpenBooking: (category?: string) => void;
  onOpenTracker: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenTracker }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      // Section spy
      const sections = ['home', 'services', 'why-us', 'projects', 'how-it-works', 'reviews', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Services', id: 'services' },
    { name: 'Why Us', id: 'why-us' },
    { name: 'Projects', id: 'projects' },
    { name: 'Process', id: 'how-it-works' },
    { name: 'Reviews', id: 'reviews' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <>
      {/* Top Engineering Micro-Bar */}
      <div className="bg-brand-navy border-b border-white/5 py-1.5 px-4 text-xs font-mono text-brand-gray-300 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-brand-orange">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Direct Support: <a href="tel:+919025672856" className="font-semibold text-white hover:text-brand-orange transition-colors">+91 90256 72856</a>
            </span>
            <span className="text-white/30">|</span>
            <span>Pavoorchatram, Tenkasi District, Tamil Nadu</span>
          </div>

          <div className="flex items-center gap-5">
            <span className="text-brand-gray-400">GSTIN: <span className="text-white">33AABPX4889K3ZY</span></span>
            <span className="text-white/30">|</span>
            <button
              onClick={onOpenTracker}
              className="text-brand-gray-300 hover:text-brand-orange flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Request</span>
            </button>
            <span className="text-white/30">|</span>
            <Link
              to="/admin"
              className="text-brand-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-brand-midnight/95 backdrop-blur-md shadow-xl border-b border-white/10 py-3'
            : 'bg-brand-midnight/70 backdrop-blur-sm py-4 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('home');
              }}
              className="cursor-pointer"
            >
              <Logo size="md" />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative cursor-pointer ${
                      isActive
                        ? 'text-brand-orange bg-white/5 font-semibold'
                        : 'text-brand-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-orange rounded-full shadow-[0_0_8px_#FF8A00]" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Desktop Right Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={onOpenTracker}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium text-brand-gray-300 hover:text-brand-orange border border-white/10 hover:border-brand-orange/40 rounded-lg transition-all cursor-pointer bg-white/5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track Booking</span>
              </button>

              <button
                onClick={() => onOpenBooking()}
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/40 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <Calendar className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Book a Service</span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => onOpenBooking()}
                className="px-3 py-1.5 rounded-md bg-brand-orange text-white text-xs font-bold"
              >
                Book
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-white/5 text-brand-gray-200 hover:text-white hover:bg-white/10 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-brand-navy/98 backdrop-blur-xl border-b border-white/10 px-4 pt-3 pb-6 mt-3 space-y-2 animate-fadeIn">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                    activeSection === link.id
                      ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30 font-semibold'
                      : 'text-brand-gray-200 hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-brand-orange text-white font-bold shadow-lg shadow-brand-orange/25"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Service</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTracker();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/15 bg-white/5 text-brand-gray-200 text-sm font-medium"
              >
                <Search className="w-4 h-4 text-brand-orange" />
                <span>Track Booking Status</span>
              </button>

              <div className="pt-2 flex items-center justify-between text-xs text-brand-gray-400 font-mono">
                <a href="tel:+919025672856" className="flex items-center gap-1.5 text-white">
                  <Phone className="w-3.5 h-3.5 text-brand-orange" />
                  <span>+91 90256 72856</span>
                </a>
                <Link to="/admin" className="text-brand-orange underline">
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
