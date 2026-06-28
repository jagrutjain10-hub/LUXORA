'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function CookiesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] min-h-screen">
        <div className="bg-obsidian py-24 section-px text-center">
          <div className="label-gold text-champagne-400 mb-4">Legal</div>
          <h1 className="font-display text-display-lg text-ivory font-light">Cookie Policy</h1>
          <div className="w-12 h-px bg-champagne-500 mx-auto mt-8" />
        </div>
        <div className="bg-ivory-50">
          <div className="container-luxury py-20 max-w-3xl mx-auto">
            <p className="font-body text-obsidian/50 mb-12 text-sm">Last updated: June 2026</p>
            <div className="space-y-8 font-body text-obsidian/70 leading-relaxed">
              <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By continuing to use our site, you consent to our use of cookies.</p>
              <div>
                <h2 className="font-display text-xl text-obsidian font-light mb-4">Types of Cookies We Use</h2>
                <div className="space-y-4">
                  {[
                    ['Essential Cookies', 'Required for the website to function. These cannot be disabled.'],
                    ['Analytics Cookies', 'Help us understand how visitors interact with our website.'],
                    ['Preference Cookies', 'Remember your settings and preferences for a better experience.'],
                    ['Marketing Cookies', 'Used to deliver relevant advertisements to you.'],
                  ].map(([type, desc]) => (
                    <div key={type} className="p-5 bg-white border border-sand-200">
                      <div className="font-body font-medium text-obsidian mb-1">{type}</div>
                      <div className="text-sm">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <p>You can control cookies through your browser settings. Note that disabling certain cookies may affect the functionality of our website.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
