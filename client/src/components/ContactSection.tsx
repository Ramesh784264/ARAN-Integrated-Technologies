import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, MessageCircle, Clock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitContact } from '../services/api';
import { BusinessSettings } from '../types';

interface ContactSectionProps {
  settings?: BusinessSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const phone = settings?.phone || '+91 90256 72856';
  const email = settings?.email || 'aranidts@gmail.com';
  const address = settings?.address || '10/264 A3, Kamaraj Nagar North, Pavoorchatram, Tenkasi District, Tamil Nadu 627808.';
  const gstin = settings?.gstin || '33AABPX4889K3ZY';
  const udyam = settings?.udyam || 'TN-37-0063266';
  const hours = settings?.business_hours || 'Monday - Saturday: 9:00 AM - 7:00 PM';
  const whatsappNumber = settings?.whatsapp_number || '919025672856';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await submitContact(formData);
      setSuccessMsg(res.message);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to send inquiry. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-brand-midnight relative overflow-hidden">
      <div className="absolute inset-0 tech-grid-bg opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-orange/10 border border-brand-orange/30 text-brand-orange font-mono text-xs uppercase tracking-widest">
            <Mail className="w-3.5 h-3.5" />
            Official Contact & Field Headquarters
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
            CONNECT WITH OUR <br />
            <span className="orange-gradient-text">ENGINEERING TEAM.</span>
          </h2>
          <p className="text-brand-gray-300 text-base sm:text-lg">
            Have a project consultation or technical requirement? Reach us through direct telephone, WhatsApp, email, or visit our office in Pavoorchatram.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Official Contact Directory & Map */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Action Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Click to Call */}
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="p-5 rounded-2xl bg-brand-navy/70 border border-white/10 hover:border-brand-orange/40 transition-all group block shadow-lg"
              >
                <div className="h-10 w-10 rounded-xl bg-brand-orange/15 text-brand-orange flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono text-brand-gray-400 uppercase">Direct Telephone</div>
                <div className="text-sm font-bold text-white mt-0.5 group-hover:text-brand-orange transition-colors">
                  {phone}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1 font-mono">● Mon-Sat 9AM-7PM</div>
              </a>

              {/* WhatsApp Link */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello%20ARAN%20Integrated%20Technologies,%20I%20would%20like%20to%20enquire%20about%20your%20services.`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-brand-navy/70 border border-white/10 hover:border-emerald-500/40 transition-all group block shadow-lg"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono text-brand-gray-400 uppercase">Instant WhatsApp</div>
                <div className="text-sm font-bold text-white mt-0.5 group-hover:text-emerald-400 transition-colors">
                  Chat With Engineer
                </div>
                <div className="text-[11px] text-brand-gray-400 mt-1 font-mono">Quick Response</div>
              </a>

            </div>

            {/* Email & Address Details */}
            <div className="p-6 rounded-2xl bg-brand-navy/70 border border-white/10 space-y-4 shadow-xl">
              
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-white/5 text-brand-orange mt-0.5 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-brand-gray-400 uppercase">Official Email</div>
                  <a href={`mailto:${email}`} className="text-sm font-bold text-white hover:text-brand-orange transition-colors">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-white/5">
                <div className="p-2.5 rounded-lg bg-white/5 text-brand-orange mt-0.5 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-brand-gray-400 uppercase">Field Headquarters</div>
                  <p className="text-sm text-brand-gray-200 mt-0.5 leading-relaxed font-medium">
                    {address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-white/5">
                <div className="p-2.5 rounded-lg bg-white/5 text-brand-orange mt-0.5 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-brand-gray-400 uppercase">Operating Hours</div>
                  <p className="text-sm text-brand-gray-200 mt-0.5 font-medium">
                    {hours}
                  </p>
                </div>
              </div>

              {/* Compliance Credentials */}
              <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs font-mono text-brand-gray-300">
                <div className="p-2 rounded bg-white/5">
                  <span className="text-[10px] text-brand-gray-400 block uppercase">GSTIN</span>
                  <span className="font-bold text-white text-[11px]">{gstin}</span>
                </div>
                <div className="p-2 rounded bg-white/5">
                  <span className="text-[10px] text-brand-gray-400 block uppercase">UDYAM</span>
                  <span className="font-bold text-white text-[11px]">{udyam}</span>
                </div>
              </div>

            </div>

            {/* Embedded Location Map */}
            <div className="rounded-2xl overflow-hidden border border-white/10 h-52 relative shadow-xl">
              <iframe
                title="ARAN Integrated Technologies Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941.042571764619!2d77.37895237482329!3d8.953531991090334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0428509c118671%3A0xe2dae6e76cf40be!2sPavoorchatram%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-brand-midnight/90 backdrop-blur-md p-2 rounded-lg text-[11px] font-mono text-brand-gray-300 flex items-center justify-between border border-white/10 pointer-events-none">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                  Pavoorchatram, Tenkasi District
                </span>
                <span className="text-brand-orange font-semibold">Tamil Nadu 627808</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Working Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-brand-navy/80 border border-white/15 backdrop-blur-xl shadow-2xl space-y-6">
              
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-brand-orange font-semibold">
                  Fast Response Protocol
                </span>
                <h3 className="text-2xl font-bold text-white font-heading mt-1">
                  Send an Engineering Inquiry
                </h3>
                <p className="text-xs sm:text-sm text-brand-gray-300 mt-1">
                  Fill in your details below and our team will get back to you promptly with technical feasibility and advice.
                </p>
              </div>

              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Inquiry Sent Successfully: </span>
                    {successMsg}
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs sm:text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-brand-gray-300 mb-1.5 uppercase">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-brand-gray-400 focus:outline-none focus:border-brand-orange text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-brand-gray-300 mb-1.5 uppercase">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-brand-gray-400 focus:outline-none focus:border-brand-orange text-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-brand-gray-300 mb-1.5 uppercase">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. client@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-brand-gray-400 focus:outline-none focus:border-brand-orange text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-brand-gray-300 mb-1.5 uppercase">
                      Subject / Service Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. CCTV Camera Installation for Warehouse"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-brand-gray-400 focus:outline-none focus:border-brand-orange text-sm transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1.5 uppercase">
                    Detailed Message & Site Location *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your equipment, site specifications, or service requirements..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-brand-gray-400 focus:outline-none focus:border-brand-orange text-sm transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-lg shadow-brand-orange/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Transmitting Request...' : 'Send Message to Engineering Lead'}</span>
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
