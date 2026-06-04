'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // Simulate API call
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="relative overflow-hidden bg-obsidian py-24 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-noise opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-champagne-700/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-champagne-700/30 to-transparent" />

      {/* Decorative circles */}
      <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-champagne-900/20" />
      <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-champagne-900/15" />

      <div className="container-luxury relative">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="label-gold text-champagne-400 mb-4">The LUXORA Circle</div>
            <h2 className="font-display text-display-md text-ivory font-light mb-4">
              Join Our World of Luxury
            </h2>
            <div className="w-12 h-px bg-champagne-600 mx-auto mb-6" />
            <p className="text-ivory/50 font-body mb-10 leading-relaxed">
              Exclusive previews of new arrivals, styling inspiration, and private sale access — delivered with the same care as our products.
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-14 h-14 bg-champagne-900/40 rounded-full flex items-center justify-center">
                    <Check size={24} className="text-champagne-400" />
                  </div>
                  <p className="text-ivory font-body">
                    Welcome to the LUXORA Circle. Expect elegance in your inbox.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="flex-1 bg-transparent border border-champagne-800/50 px-5 py-3.5
                               text-ivory placeholder:text-ivory/30 font-body text-sm
                               focus:outline-none focus:border-champagne-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-ghost whitespace-nowrap flex items-center gap-2 justify-center disabled:opacity-60"
                  >
                    {loading ? 'Joining...' : (
                      <>Subscribe <ArrowRight size={14} /></>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="text-ivory/20 text-xs font-body mt-5">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
