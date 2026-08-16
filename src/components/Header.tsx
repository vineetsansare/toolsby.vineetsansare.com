import React from 'react';
import { Sun, Moon, Github, ExternalLink, Wrench } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SITE_CONFIG } from '../config/siteConfig';

export const Header: React.FC = () => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="site-header">
      <div className="container header-content">
        <a href="/" className="brand-link" aria-label="Tools by Vineet Home">
          <div className="brand-icon-wrapper">
            <Wrench size={18} strokeWidth={2.5} />
          </div>
          <span className="brand-title">
            Tools<span className="brand-accent">by Vineet</span>
          </span>
        </a>

        <nav className="header-nav" aria-label="Main Navigation">
          <a href="#tools" className="nav-link">
            Tools
          </a>

          <a 
            href={SITE_CONFIG.portfolioUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="nav-link"
            title="Visit Vineet's main portfolio website"
          >
            Portfolio
            <ExternalLink size={13} style={{ opacity: 0.7 }} />
          </a>

          <a 
            href={SITE_CONFIG.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="nav-link"
            title="View Vineet's GitHub profile"
          >
            <Github size={16} />
            GitHub
          </a>

          <div className="nav-divider" aria-hidden="true" />

          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {resolvedTheme === 'dark' ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
