import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquarePlus, CheckCircle, ShieldCheck, UserCheck, Calendar } from 'lucide-react';
import { ReviewItem } from '../types';

interface CustomerReviewsProps {
  reviews: ReviewItem[];
  onOpenReviewModal: () => void;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ reviews, onOpenReviewModal }) => {
  return (
    <section id="reviews" className="py-24 bg-brand-navy/50 relative overflow-hidden border-t border-b border-white/5">
      <div className="absolute inset-0 tech-grid-bg opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-orange/10 border border-brand-orange/30 text-brand-orange font-mono text-xs uppercase tracking-widest">
              <MessageSquarePlus className="w-3.5 h-3.5" />
              Customer Feedback & Moderation
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
              GENUINE CLIENT <br />
              <span className="orange-gradient-text">EXPERIENCES.</span>
            </h2>
            <p className="text-brand-gray-300 text-base">
              We uphold genuine transparency. All published reviews reflect real customer submissions verified by our administrative team.
            </p>
          </div>

          <button
            onClick={onOpenReviewModal}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-lg shadow-brand-orange/25 transition-all cursor-pointer self-start md:self-auto"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Share Your Experience</span>
          </button>
        </div>

        {/* Reviews List or Honest Initial Empty State */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-7 rounded-2xl bg-brand-midnight/90 border border-white/10 hover:border-brand-orange/30 transition-all shadow-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Rating Stars & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`}
                        />
                      ))}
                    </div>
                    {rev.is_verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" />
                        Verified Client
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white font-heading">
                      {rev.review_title}
                    </h3>
                    <span className="text-xs font-mono text-brand-orange font-medium">
                      Service: {rev.service_received}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-brand-gray-300 leading-relaxed italic">
                    "{rev.written_feedback}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-brand-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center font-bold text-brand-orange">
                      {rev.customer_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-white">{rev.customer_name}</span>
                  </div>
                  <span className="font-mono text-[11px]">
                    {new Date(rev.created_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Transparent Initial State (Prompt forbids fake reviews!) */
          <div className="p-10 sm:p-14 rounded-3xl bg-brand-midnight/80 border border-white/10 text-center space-y-6 max-w-2xl mx-auto shadow-2xl">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center">
              <UserCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white font-heading">
                Zero Fabricated Reviews. Genuine Customer Voices.
              </h3>
              <p className="text-sm text-brand-gray-300 leading-relaxed max-w-lg mx-auto">
                Unlike ordinary templates, we never display fake testimonials or invented star counts. 
                Have you worked with ARAN Integrated Technologies on your CCTV, Solar, or Hydraulics project? 
                Submit your honest review below.
              </p>
            </div>

            <button
              onClick={onOpenReviewModal}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-lg shadow-brand-orange/25 transition-all cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Submit the First Review</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
