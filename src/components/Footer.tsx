import React from 'react';
import { SITE_CONFIG } from '../config/siteConfig';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-left">
          <span className="footer-brand">{SITE_CONFIG.name}</span>
          <p className="footer-credit">
            Built by{' '}
            <a 
              href={SITE_CONFIG.portfolioUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Vineet Sansare
            </a>
            . Designed as an independent product directory.
          </p>
        </div>

        <div className="footer-right">
          <a 
            href={SITE_CONFIG.portfolioUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            Portfolio
          </a>

          <a 
            href={SITE_CONFIG.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub Profile
          </a>

          <span className="footer-link" style={{ color: 'var(--text-tertiary)' }}>
            © {currentYear}
          </span>
        </div>
      </div>
    </footer>
  );
};
