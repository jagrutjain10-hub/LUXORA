export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ivory-50">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="font-display text-4xl text-obsidian font-light mb-2">Privacy Policy</h1>
        <p className="text-xs text-obsidian/40 font-body mb-10">Last updated: June 2026</p>
        <div className="space-y-8 font-body text-obsidian/70 leading-relaxed text-sm">
          {[
            ['Information We Collect', 'We collect information you provide directly — name, email, phone, and shipping address — as well as browsing and purchase data to improve your experience.'],
            ['How We Use Your Information', 'Your information is used to process orders, send transactional emails, and improve our platform. We do not sell your personal data to third parties.'],
            ['Data Security', 'We use industry-standard encryption (TLS) to protect your data in transit and at rest. Passwords are hashed using bcrypt and never stored in plain text.'],
            ['Cookies', 'We use cookies for session management and analytics. You can disable cookies in your browser settings, but some features may not function correctly.'],
            ['Third-Party Services', 'We use Razorpay for payment processing and Resend for email delivery. These services have their own privacy policies.'],
            ['Your Rights', 'You may request access to, correction of, or deletion of your personal data by contacting hello@luxora.in.'],
          ].map(([title, body]) => (
            <div key={title}>
              <h2 className="font-display text-lg text-obsidian mb-2">{title}</h2>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}