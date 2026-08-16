import React from 'react';
import { Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

export const Hero: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-badge">
        <Sparkles size={14} />
        <span>Product Directory</span>
      </div>

      <h1 className="hero-title">
        Tools I <span className="hero-title-gradient">actually use.</span>
      </h1>

      <p className="hero-subtitle">
        {SITE_CONFIG.tagline} Designed with a focus on visual polish, performance, and practical utility.
      </p>

      <div className="hero-meta">
        <div className="hero-meta-item">
          <span className="hero-meta-dot" />
          <span>JD2CV Live</span>
        </div>

        <div className="hero-meta-item">
          <Layers size={14} />
          <span>Growing Suite</span>
        </div>

        <div className="hero-meta-item">
          <ShieldCheck size={14} />
          <span>Production Ready</span>
        </div>
      </div>
    </section>
  );
};
