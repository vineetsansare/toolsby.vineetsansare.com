import React from 'react';
import { ArrowLeft, Wrench, Sun, Moon, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ToolPageHeaderProps {
  title: string;
  category: string;
  badge?: string;
}

export const ToolPageHeader: React.FC<ToolPageHeaderProps> = ({ title, category, badge = '100% Client-Side • Private' }) => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="site-header" style={{ marginBottom: '1.5rem' }}>
      <div className="container header-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a 
            href="/" 
            className="nav-link" 
            style={{ paddingLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}
            title="Back to Tools by Vineet Directory"
          >
            <ArrowLeft size={16} />
            <span>Directory</span>
          </a>

          <div className="nav-divider" aria-hidden="true" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="brand-icon-wrapper" style={{ width: '2rem', height: '2rem' }}>
              <Wrench size={15} strokeWidth={2.5} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="brand-title" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {title}
                </span>
                <span className="category-tag">{category}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="header-nav">
          <div className="hero-meta-item" style={{ fontSize: '0.8rem', color: 'var(--status-available-text)' }}>
            <ShieldCheck size={14} />
            <span style={{ display: 'inline' }}>{badge}</span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
