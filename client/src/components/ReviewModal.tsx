import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Star, MessageSquarePlus, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { submitReview } from '../services/api';

const reviewSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters').max(120),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  service_received: z.string().min(2, 'Please select the service received'),
  rating: z.number().int().min(1).max(5, 'Please select a rating between 1 and 5 stars'),
  review_title: z.string().min(3, 'Title must be at least 3 characters').max(150),
  written_feedback: z.string().min(10, 'Review feedback must be at least 10 characters').max(2000),
  consent: z.boolean().refine((val) => val === true, {
    message: 'Consent to publish review following moderation is required'
  })
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      customer_name: '',
      email: '',
      phone: '',
      service_received: 'CCTV Surveillance & Security',
      rating: 5,
      review_title: '',
      written_feedback: '',
      consent: true
    }
  });

  const currentRating = watch('rating');

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const res = await submitReview(data);
      setSuccessMsg(res.message);
      reset();
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccessMsg(null);
    setApiError(null);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-brand-navy border border-white/20 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-left max-h-[92vh] overflow-y-auto">
        
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-brand-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {successMsg ? (
          <div className="text-center py-6 space-y-5">
            <div className="h-16 w-16 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white font-heading">
                Thank You for Your Feedback!
              </h3>
              <p className="text-sm text-brand-gray-300 max-w-md mx-auto leading-relaxed">
                {successMsg}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-brand-gray-400 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <ShieldCheck className="w-4 h-4 text-brand-orange" />
                Moderation Policy
              </div>
              <p>
                To maintain authentic customer trust, all reviews undergo administrative verification before public appearance.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="px-7 py-3 rounded-xl bg-brand-orange text-white text-sm font-bold shadow-lg shadow-brand-orange/25"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-orange/15 text-brand-orange font-mono text-xs uppercase tracking-wider mb-2 font-semibold">
                <MessageSquarePlus className="w-3.5 h-3.5" />
                Verified Feedback
              </div>
              <h3 className="text-2xl font-bold text-white font-heading">
                Share Your Experience
              </h3>
              <p className="text-xs text-brand-gray-300 mt-1">
                Help us maintain exceptional engineering standards. Your feedback will be reviewed and published upon verification.
              </p>
            </div>

            {apiError && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Star Rating Picker */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-brand-gray-300 block">
                  Overall Service Rating *
                </span>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setValue('rating', star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating !== null ? star <= hoverRating : star <= currentRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-xs font-mono text-amber-400 font-semibold">
                  {currentRating === 5 && 'Outstanding (5/5)'}
                  {currentRating === 4 && 'Very Good (4/5)'}
                  {currentRating === 3 && 'Average (3/5)'}
                  {currentRating === 2 && 'Needs Improvement (2/5)'}
                  {currentRating === 1 && 'Unsatisfactory (1/5)'}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1 uppercase font-semibold">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    {...register('customer_name')}
                    placeholder="e.g. Anand Sundaram"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-brand-gray-500 text-sm focus:outline-none focus:border-brand-orange"
                  />
                  {errors.customer_name && (
                    <span className="text-rose-400 text-[11px] mt-1 block">{errors.customer_name.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1 uppercase font-semibold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="e.g. anand@company.in"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-brand-gray-500 text-sm focus:outline-none focus:border-brand-orange"
                  />
                  {errors.email && (
                    <span className="text-rose-400 text-[11px] mt-1 block">{errors.email.message}</span>
                  )}
                </div>
              </div>

              {/* Service Received & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1 uppercase font-semibold">
                    Service Received *
                  </label>
                  <select
                    {...register('service_received')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-midnight border border-white/15 text-white text-sm focus:outline-none focus:border-brand-orange"
                  >
                    <option value="CCTV Surveillance & Security">CCTV Surveillance & Security</option>
                    <option value="Solar Power Solutions">Solar Power Solutions</option>
                    <option value="Hydraulic Systems & Automation">Hydraulic Systems & Automation</option>
                    <option value="General Engineering Support">General Engineering Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1 uppercase font-semibold">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="For verification only"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-brand-gray-500 text-sm focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-xs font-mono text-brand-gray-300 mb-1 uppercase font-semibold">
                  Headline / Review Title *
                </label>
                <input
                  type="text"
                  {...register('review_title')}
                  placeholder="e.g. Robust IP CCTV installation for our manufacturing facility"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-brand-gray-500 text-sm focus:outline-none focus:border-brand-orange"
                />
                {errors.review_title && (
                  <span className="text-rose-400 text-[11px] mt-1 block">{errors.review_title.message}</span>
                )}
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block text-xs font-mono text-brand-gray-300 mb-1 uppercase font-semibold">
                  Detailed Feedback *
                </label>
                <textarea
                  rows={3}
                  {...register('written_feedback')}
                  placeholder="Share details regarding equipment quality, timeliness, and technician support..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-brand-gray-500 text-sm focus:outline-none focus:border-brand-orange resize-none"
                />
                {errors.written_feedback && (
                  <span className="text-rose-400 text-[11px] mt-1 block">{errors.written_feedback.message}</span>
                )}
              </div>

              {/* Consent */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-brand-gray-300">
                  <input
                    type="checkbox"
                    {...register('consent')}
                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-brand-orange focus:ring-brand-orange"
                  />
                  <span>
                    I certify that this review is based on genuine service received and consent to public display upon approval.
                  </span>
                </label>
                {errors.consent && (
                  <span className="text-rose-400 text-[11px] mt-1 block">{errors.consent.message}</span>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-brand-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-lg shadow-brand-orange/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
