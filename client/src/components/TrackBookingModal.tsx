import React, { useState } from 'react';
import { X, Search, Calendar, Clock, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { trackBooking } from '../services/api';
import { Booking } from '../types';

interface TrackBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackBookingModal: React.FC<TrackBookingModalProps> = ({ isOpen, onClose }) => {
  const [refInput, setRefInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<Booking | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refInput.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setBookingData(null);

    try {
      const data = await trackBooking(refInput.trim(), phoneInput.trim() || undefined);
      setBookingData(data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Booking reference not found. Please verify the code.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Contacted':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Completed':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'Cancelled':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-brand-navy border border-white/20 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-left">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-brand-gray-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-brand-orange font-mono text-xs uppercase tracking-wider">
            <Search className="w-3.5 h-3.5" />
            Live Status Tracker
          </div>
          <h3 className="text-2xl font-bold text-white font-heading">
            Track Booking Request
          </h3>
          <p className="text-xs text-brand-gray-300">
            Enter your unique reference code (e.g. <strong className="text-brand-orange font-mono">ARAN-20251024-8742</strong>) to verify scheduling status.
          </p>
        </div>

        <form onSubmit={handleTrack} className="space-y-3">
          <div>
            <label className="block text-xs font-mono text-brand-gray-300 mb-1 uppercase font-semibold">
              Reference Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ARAN-20251024-1234"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-brand-gray-500 font-mono text-sm focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-brand-gray-300 mb-1 uppercase font-semibold">
              Registered Phone (Optional)
            </label>
            <input
              type="tel"
              placeholder="e.g. 9025672856"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-brand-gray-500 font-mono text-sm focus:outline-none focus:border-brand-orange"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-lg shadow-brand-orange/25 transition-all cursor-pointer disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Searching MySQL Database...' : 'Look Up Status'}</span>
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {bookingData && (
          <div className="p-5 rounded-2xl bg-brand-midnight/90 border border-white/15 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-brand-gray-400">STATUS</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${getStatusColor(bookingData.status)}`}>
                ● {bookingData.status.toUpperCase()}
              </span>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-brand-gray-400">Reference:</span>
                <span className="font-mono font-bold text-white">{bookingData.booking_ref}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray-400">Division:</span>
                <span className="font-semibold text-white">{bookingData.service_category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray-400">Service:</span>
                <span className="text-brand-gray-200">{bookingData.service_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray-400">Preferred Date:</span>
                <span className="text-white font-mono">{new Date(bookingData.preferred_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray-400">Time Window:</span>
                <span className="text-brand-orange font-semibold">{bookingData.preferred_time_slot}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-[11px] text-brand-gray-300">
              💡 Need immediate rescheduling? Call <a href="tel:+919025672856" className="text-brand-orange font-semibold hover:underline">+91 90256 72856</a> with reference code.
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
