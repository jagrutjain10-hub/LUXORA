'use client';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] min-h-screen">
        <div className="bg-obsidian py-24 section-px text-center">
          <div className="label-gold text-champagne-400 mb-4">Get In Touch</div>
          <h1 className="font-display text-display-lg text-ivory font-light">Contact Us</h1>
          <div className="w-12 h-px bg-champagne-500 mx-auto mt-8" />
        </div>
        <div className="bg-ivory-50">
          <div className="container-luxury py-20">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <div className="label-gold mb-4">Reach Us</div>
                <h2 className="font-display text-display-sm text-obsidian font-light mb-8">We&apos;d Love to Hear From You</h2>
                <div className="space-y-6">
                  {[
                    { icon: Mail, label: 'Email', value: 'hello@luxora.in' },
                    { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
                    { icon: MapPin, label: 'Address', value: 'Mumbai, Maharashtra, India' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-obsidian flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-champagne-400" />
                      </div>
                      <div>
                        <div className="label-gold text-obsidian/40 mb-1">{label}</div>
                        <div className="font-body text-obsidian">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                {submitted ? (
                  <div className="text-center py-16 bg-white border border-sand-200 p-8">
                    <div className="font-display text-4xl text-champagne-500 mb-4">✓</div>
                    <h3 className="font-display text-2xl text-obsidian font-light mb-2">Message Sent</h3>
                    <p className="font-body text-obsidian/50">We&apos;ll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6 bg-white border border-sand-200 p-8">
                    {['Name', 'Email', 'Subject'].map(field => (
                      <div key={field}>
                        <label className="label-gold text-obsidian/40 block mb-3">{field}</label>
                        <input
                          type={field === 'Email' ? 'email' : 'text'}
                          required
                          className="w-full bg-transparent border-0 border-b border-sand-300 pb-3 font-body text-obsidian focus:outline-none focus:border-champagne-500 transition-colors"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="label-gold text-obsidian/40 block mb-3">Message</label>
                      <textarea required rows={4} className="w-full bg-transparent border-0 border-b border-sand-300 pb-3 font-body text-obsidian focus:outline-none focus:border-champagne-500 transition-colors resize-none" />
                    </div>
                    <button type="submit" className="btn-primary w-full justify-center">Send Message</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
