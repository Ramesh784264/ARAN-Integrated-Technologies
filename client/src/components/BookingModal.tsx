import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import confetti from 'canvas-confetti';
import { X, Calendar, Clock, MapPin, CheckCircle, Copy, Check, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { submitBooking } from '../services/api';

const bookingSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[0-9+\s\-()]{10,20}$/, 'Please enter a valid 10-digit phone number'),
  service_category: z.enum(['CCTV Surveillance', 'Solar Power', 'Hydraulic Systems', 'General Consultation']),
  service_type: z.string().min(2, 'Please select a specific service type'),
  preferred_date: z.string().refine((dateStr) => {
    const selected = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !isNaN(selected.getTime()) && selected >= today;
  }, { message: 'Date cannot be in the past' }),
  preferred_time_slot: z.string().min(2, 'Please select a preferred time slot'),
  service_address: z.string().min(5, 'Please provide the installation or service address'),
  project_description: z.string().min(10, 'Please describe your requirements (min 10 characters)'),
  budget_range: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must consent to be contacted regarding this request'
  })
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCategory?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedCategory = 'CCTV Surveillance'
}) => {
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Minimum date for the datepicker: today in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const subServiceOptions: Record<string, string[]> = {
    'CCTV Surveillance': [
      'CCTV camera installation',
      'Security system upgrades',
      'Remote monitoring setup',
      'Maintenance and troubleshooting',
      'PTZ & 360-degree cameras',
      'Commercial NVR setup'
    ],
    'Solar Power': [
      'Solar panel installation (Rooftop/Plant)',
      'Solar system consultation & feasibility',
      'Installation maintenance & panel cleaning',
      'System inspection and troubleshooting',
      'On-Grid Net-Metering Setup',
      'Agricultural Solar Pump Drive'
    ],
    'Hydraulic Systems': [
      'Hydraulic system installation',
      'Hydraulic equipment servicing & overhaul',
      'Automation solutions & PLC integration',
      'Maintenance and technical support',
      'Cylinder rod re-chroming & seal replacement',
      'Custom Hydraulic Power Unit (HPU) Build'
    ],
    'General Consultation': [
      'Comprehensive Multi-System Site Audit',
      'Industrial Facility Automation Feasibility',
      'Emergency Breakdown Diagnostic Support'
    ]
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customer_name: '',
      email: '',
      phone: '',
      service_category: 'CCTV Surveillance',
      service_type: 'CCTV camera installation',
      preferred_date: todayStr,
      preferred_time_slot: 'Morning (09:00 AM - 12:00 PM)',
      service_address: '',
      project_description: '',
      budget_range: '',
      consent: true
    }
  });

  const selectedCategory = watch('service_category');

  // Update preselected category when modal opens
  useEffect(() => {
    if (isOpen && preselectedCategory) {
      const validCategories: Array<'CCTV Surveillance' | 'Solar Power' | 'Hydraulic Systems' | 'General Consultation'> = [
        'CCTV Surveillance',
        'Solar Power',
        'Hydraulic Systems',
        'General Consultation'
      ];
      const match = validCategories.find(c => c.toLowerCase().includes(preselectedCategory.toLowerCase()));
      if (match) {
        setValue('service_category', match);
        const sub = subServiceOptions[match]?.[0];
        if (sub) setValue('service_type', sub);
      }
    }
  }, [isOpen, preselectedCategory, setValue]);

  // When category changes, reset sub-service type to first choice
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCat = e.target.value as any;
    setValue('service_category', newCat);
    const sub = subServiceOptions[newCat]?.[0];
    if (sub) setValue('service_type', sub);
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const res = await submitBooking(data);
      setSubmittedRef(res.booking_ref);
      setSuccessMessage(res.message);
      
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore if confetti fails
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (submittedRef) {
      navigator.clipboard.writeText(submittedRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setSubmittedRef(null);
    setSuccessMessage(null);
    setApiError(null);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-brand-navy border border-white/20 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-left">
        
        {/* Modal Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-brand-gray-300 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Confirmation Screen */}
        {submittedRef ? (
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="h-20 w-20 mx-auto rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-brand-orange font-bold">
                Consultation Request Logged
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Request Submitted Successfully!
              </h3>
              <p className="text-sm text-brand-gray-300 max-w-md mx-auto leading-relaxed">
                {successMessage}
              </p>
            </div>

            {/* Generated Reference Code Box */}
            <div className="p-5 rounded-2xl bg-brand-midnight/90 border border-brand-orange/40 max-w-md mx-auto text-center space-y-2">
              <div className="text-xs font-mono text-brand-gray-400 uppercase">
                Your Unique Tracking Reference
              </div>
              <div className="text-2xl font-mono font-black text-brand-orange tracking-wider">
                {submittedRef}
              </div>
              <button
                onClick={handleCopyRef}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white/10 hover:bg-white/15 text-xs text-white cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Reference Code'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-brand-gray-300 text-left space-y-1.5 max-w-md mx-auto">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-orange" />
                What happens next?
              </div>
              <p>
                1. An engineering specialist will review your project parameters.<br />
                2. We will contact you via phone/WhatsApp to confirm scheduling and answer questions.<br />
                3. You can track this request at any time using your reference code.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="px-8 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-lg shadow-brand-orange/25 cursor-pointer"
            >
              Done & Return to Website
            </button>
          </div>
        ) : (
          /* Booking Form */
          <div className="p-6 sm:p-10 space-y-6">
            
            {/* Header */}
            <div className="border-b border-white/10 pb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-orange/15 text-brand-orange font-mono text-xs uppercase tracking-wider mb-2 font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                Engineering Consultation Request
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Book a Service or Site Survey
              </h3>
              <p className="text-xs sm:text-sm text-brand-gray-300 mt-1">
                Provide your requirements below. Preferred appointment dates and times are scheduling requests confirmed directly by our team.
              </p>
            </div>

            {apiError && (
              <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Category & Service Type Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1.5 uppercase font-semibold">
                    Service Category *
                  </label>
                  <select
                    {...register('service_category')}
                    onChange={handleCategoryChange}
                    className="w-full px-3.5 py-3 rounded-xl bg-brand-midnight border border-white/15 text-white text-sm focus:outline-none focus:border-brand-orange"
                  >
                    <option value="CCTV Surveillance">CCTV Surveillance & Security</option>
                    <option value="Solar Power">Solar Power Solutions</option>
                    <option value="Hydraulic Systems">Hydraulic Systems & Automation</option>
                    <option value="General Consultation">General Engineering Consultation</option>
                  </select>
                  {errors.service_category && (
                    <span className="text-rose-400 text-[11px] mt-1 block">{errors.service_category.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1.5 uppercase font-semibold">
                    Specific Service Type *
                  </label>
                  <select
                    {...register('service_type')}
                    className="w-full px-3.5 py-3 rounded-xl bg-brand-midnight border border-white/15 text-white text-sm focus:outline-none focus:border-brand-orange"
                  >
                    {subServiceOptions[selectedCategory]?.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {errors.service_type && (
                    <span className="text-rose-400 text-[11px] mt-1 block">{errors.service_type.message}</span>
                  )}
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1.5 uppercase font-semibold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('customer_name')}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-brand-gray-500 text-sm focus:outline-none focus:border-brand-orange"
                  />
                  {errors.customer_name && (
                    <span className="text-rose-400 text-[11px] mt-1 block">{errors.customer_name.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1.5 uppercase font-semibold">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="e.g. 9025672856"
                    className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-brand-gray-500 text-sm focus:outline-none focus:border-brand-orange"
                  />
                  {errors.phone && (
                    <span className="text-rose-400 text-[11px] mt-1 block">{errors.phone.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1.5 uppercase font-semibold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="e.g. client@example.com"
                    className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-brand-gray-500 text-sm focus:outline-none focus:border-brand-orange"
                  />
                  {errors.email && (
                    <span className="text-rose-400 text-[11px] mt-1 block">{errors.email.message}</span>
                  )}
                </div>
              </div>

              {/* Preferred Date & Time Window */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1.5 uppercase font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                    Preferred Date (Cannot be past) *
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    {...register('preferred_date')}
                    className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-orange"
                  />
                  {errors.preferred_date && (
                    <span className="text-rose-400 text-[11px] mt-1 block">{errors.preferred_date.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1.5 uppercase font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-orange" />
                    Preferred Time Slot *
                  </label>
                  <select
                    {...register('preferred_time_slot')}
                    className="w-full px-3.5 py-3 rounded-xl bg-brand-midnight border border-white/15 text-white text-sm focus:outline-none focus:border-brand-orange"
                  >
                    <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                    <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                    <option value="Evening (04:00 PM - 07:00 PM)">Evening (04:00 PM - 07:00 PM)</option>
                  </select>
                  {errors.preferred_time_slot && (
                    <span className="text-rose-400 text-[11px] mt-1 block">{errors.preferred_time_slot.message}</span>
                  )}
                </div>
              </div>

              {/* Service Address */}
              <div>
                <label className="block text-xs font-mono text-brand-gray-300 mb-1.5 uppercase font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                  Site / Installation Address *
                </label>
                <input
                  type="text"
                  {...register('service_address')}
                  placeholder="e.g. Kamaraj Nagar, Pavoorchatram, Tenkasi"
                  className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-brand-gray-500 text-sm focus:outline-none focus:border-brand-orange"
                />
                {errors.service_address && (
                  <span className="text-rose-400 text-[11px] mt-1 block">{errors.service_address.message}</span>
                )}
              </div>

              {/* Project Description & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1.5 uppercase font-semibold">
                    Project Requirements Description *
                  </label>
                  <textarea
                    rows={3}
                    {...register('project_description')}
                    placeholder="Describe cameras needed, kW solar scale, cylinder bore size, or issue details..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-brand-gray-500 text-sm focus:outline-none focus:border-brand-orange resize-none"
                  />
                  {errors.project_description && (
                    <span className="text-rose-400 text-[11px] mt-1 block">{errors.project_description.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1.5 uppercase font-semibold">
                    Estimated Budget (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('budget_range')}
                    placeholder="e.g. ₹50,000 - ₹2 Lakhs"
                    className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-brand-gray-500 text-sm focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer text-xs text-brand-gray-300">
                  <input
                    type="checkbox"
                    {...register('consent')}
                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-brand-orange focus:ring-brand-orange"
                  />
                  <span>
                    I confirm this is a service consultation inquiry and consent to ARAN Integrated Technologies contacting me via call or WhatsApp regarding scheduling. *
                  </span>
                </label>
                {errors.consent && (
                  <span className="text-rose-400 text-[11px] mt-1 block">{errors.consent.message}</span>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-brand-gray-300 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-lg shadow-brand-orange/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Registering Booking...' : 'Confirm Consultation Request'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
