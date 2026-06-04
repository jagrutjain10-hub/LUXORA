'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/wishlist.store';
import { reviewApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  rating: number;
  title?: string;
  body: string;
  createdAt: string;
  user: { firstName: string; lastName: string; avatarUrl?: string };
  isVerified: boolean;
}

interface ReviewsSectionProps {
  productId: string;
  reviews: Review[];
}

export function ReviewsSection({ productId, reviews }: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuthStore();
  const { register, handleSubmit, reset } = useForm<{ title: string; body: string }>();

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: reviews.filter(rev => rev.rating === r).length,
    pct: reviews.length ? (reviews.filter(rev => rev.rating === r).length / reviews.length) * 100 : 0,
  }));

  const onSubmitReview = async (data: { title: string; body: string }) => {
    if (!user) { toast.error('Please sign in to leave a review'); return; }
    setSubmitting(true);
    try {
      await reviewApi.create(productId, { ...data, rating: selectedRating });
      toast.success('Review submitted! It will appear after approval.');
      setShowForm(false);
      reset();
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pt-16 border-t border-sand-200">
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Rating Summary */}
        <div>
          <div className="label-gold mb-4">Customer Reviews</div>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-display text-6xl text-obsidian font-light">{avgRating.toFixed(1)}</span>
            <span className="text-obsidian/40 font-body">/ 5</span>
          </div>
          <div className="flex gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className={cn(i < Math.round(avgRating) ? 'text-champagne-500 fill-champagne-500' : 'text-sand-300 fill-sand-200')} />
            ))}
          </div>
          <div className="text-sm text-obsidian/40 font-body mb-6">Based on {reviews.length} reviews</div>

          <div className="space-y-2">
            {ratingDist.map(({ rating, count, pct }) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-xs font-mono text-obsidian/60 w-4">{rating}</span>
                <div className="flex-1 h-1.5 bg-sand-200">
                  <div className="h-full bg-champagne-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-mono text-obsidian/40 w-5">{count}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-secondary w-full justify-center mt-8"
          >
            Write a Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Write Review Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-ivory-50 border border-sand-200 p-6 mb-8"
            >
              <h3 className="font-display text-lg text-obsidian mb-5">Your Review</h3>

              {/* Star rating */}
              <div className="flex gap-2 mb-5">
                {[1, 2, 3, 4, 5].map(r => (
                  <button
                    key={r}
                    type="button"
                    onMouseEnter={() => setHoverRating(r)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setSelectedRating(r)}
                  >
                    <Star
                      size={24}
                      className={cn(
                        'transition-colors cursor-pointer',
                        r <= (hoverRating || selectedRating) ? 'text-champagne-500 fill-champagne-500' : 'text-sand-300 fill-sand-200'
                      )}
                    />
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-obsidian/50 mb-2">Review Title</label>
                  <input {...register('title')} className="input-luxury w-full" placeholder="Summarise your experience" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-obsidian/50 mb-2">Review *</label>
                  <textarea
                    {...register('body', { required: true })}
                    rows={4}
                    className="input-luxury w-full resize-none"
                    placeholder="Share your honest thoughts about this product..."
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" disabled={submitting} className="btn-primary flex-1">
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star size={32} className="text-sand-300 mx-auto mb-3" />
              <p className="text-sm font-body text-obsidian/40">No reviews yet. Be the first to review this product.</p>
            </div>
          ) : (
            reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="pb-6 border-b border-sand-100 last:border-0"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-champagne-100 rounded-full flex items-center justify-center text-champagne-700 font-display text-sm">
                      {review.user.firstName[0]}
                    </div>
                    <div>
                      <div className="text-sm font-body font-medium text-obsidian">
                        {review.user.firstName} {review.user.lastName[0]}.
                      </div>
                      {review.isVerified && (
                        <div className="text-xs text-green-600 font-body">Verified Purchase</div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={12} className={cn(j < review.rating ? 'text-champagne-500 fill-champagne-500' : 'text-sand-200 fill-sand-200')} />
                    ))}
                  </div>
                </div>

                {review.title && (
                  <h4 className="font-body font-medium text-obsidian text-sm mb-2">{review.title}</h4>
                )}
                <p className="text-sm font-body text-obsidian/70 leading-relaxed">{review.body}</p>

                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs font-mono text-obsidian/30">
                    {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <button className="flex items-center gap-1.5 text-xs text-obsidian/40 hover:text-obsidian transition-colors font-body">
                    <ThumbsUp size={11} /> Helpful
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
