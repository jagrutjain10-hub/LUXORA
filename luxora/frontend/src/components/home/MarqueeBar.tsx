'use client';

export function MarqueeBar() {
  const items = [
    'Free Shipping Over Rs.2,999',
    'Artisan Crafted',
    'Premium Packaging',
    'Hassle-Free Returns',
    'Authenticity Guaranteed',
    'Curated Luxury',
  ];
  const doubled = [...items, ...items];

  return (
    <div style={{ background: '#0a0a0a', padding: '16px 0', overflow: 'hidden', borderTop: '1px solid #2d1f0e', borderBottom: '1px solid #2d1f0e' }}>
      <div style={{ display: 'flex', animation: 'marquee 25s linear infinite', whiteSpace: 'nowrap' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', margin: '0 32px', color: '#c9a96e', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            {item}
            <span style={{ color: '#5a3a1a' }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
