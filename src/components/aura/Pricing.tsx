import React, { useState } from 'react';

export const Pricing: React.FC = () => {
  const [yearly, setYearly] = useState(false);

  const plans = [
    {
      tier: 'Free',
      price: 'Free',
      desc: 'For creators taking their first steps with Forma.',
      features: [
        'Up to 3 projects in the cloud',
        'Image export up to 1080p',
        'Basic editing tools',
        'Free templates and icons',
        'Access via web and mobile app'
      ],
      isPro: false
    },
    {
      tier: 'Standard',
      price: yearly ? '$99,99/y' : '$9,99/m',
      desc: 'For freelancers and small teams who need more freedom and flexibility.',
      features: [
        'Up to 50 projects in the cloud',
        'Export up to 4K',
        'Advanced editing toolkit',
        'Team collaboration (up to 5 members)',
        'Access to premium template library'
      ],
      isPro: false
    },
    {
      tier: 'Pro',
      price: yearly ? '$199,99/y' : '$19,99/m',
      desc: 'For studios, agencies, and professional creators working with brands.',
      features: [
        'Unlimited projects',
        'Export up to 8K + animations',
        'AI-powered content generation tools',
        'Unlimited team members',
        'Brand customization'
      ],
      isPro: true
    }
  ];

  return (
    <section className="c3-pricing-section" id="pricing">
      {/* Pricing specific SVG Noise Filter */}
      <svg className="sr-only" aria-hidden="true" width="0" height="0">
        <defs>
          <filter id="c3-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.075" />
            </feComponentTransfer>
            <feComposite in2="SourceGraphic" operator="in" result="noise" />
            <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
          </filter>
        </defs>
      </svg>

      {/* Watermark */}
      <div className="c3-watermark-container">
        <div className="c3-watermark-main">
          <span className="c3-watermark-line-1">Your email.</span>
          <span className="c3-watermark-line-2">Revitalized</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="c3-grid">
        {plans.map((p) => (
          <div
            key={p.tier}
            className={`c3-card ${p.isPro ? 'c3-card-pro' : ''}`}
          >
            <div className="c3-tier-small">{p.tier}</div>
            <div className="c3-tier-large">{p.price}</div>
            <div className="c3-desc">{p.desc}</div>

            <ul className="c3-list">
              {p.features.map((feat, i) => (
                <li key={i}>
                  <span className="c3-check">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button className="c3-btn">Choose Plan</button>
          </div>
        ))}
      </div>

      {/* Yearly Toggle */}
      <div className="c3-toggle-wrap">
        <span className="text-sm text-white/70 font-medium">Yearly</span>
        <button
          onClick={() => setYearly(!yearly)}
          className={`c3-toggle ${yearly ? 'active' : ''}`}
          aria-label="Toggle yearly billing"
        >
          <span className="c3-toggle-knob" />
        </button>
      </div>
    </section>
  );
};
