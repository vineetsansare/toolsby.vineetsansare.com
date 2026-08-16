import React, { useEffect } from 'react';
import { X, ExternalLink, ArrowRight, Tag } from 'lucide-react';
import { Tool } from '../types/tool';

interface ToolDetailModalProps {
  tool: Tool | null;
  onClose: () => void;
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({ tool, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (tool) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [tool, onClose]);

  if (!tool) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="tool-card-top" style={{ marginBottom: 0 }}>
          <div className="tool-header-row">
            <h2 className="tool-name" style={{ fontSize: '1.6rem' }}>{tool.name}</h2>
            <span className="category-tag">{tool.category}</span>
          </div>
        </div>

        <div className={`status-badge ${tool.status}`} style={{ alignSelf: 'flex-start' }}>
          <span className="status-indicator" />
          {tool.status === 'available' ? 'LIVE' : 'Work in progress'}
        </div>

        <p className="tool-description" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
          {tool.longDescription || tool.shortDescription}
        </p>

        {tool.tags && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Tag size={14} style={{ color: 'var(--text-tertiary)' }} />
            {tool.tags.map(tag => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="tool-card-footer" style={{ marginTop: '1rem', paddingTop: '1.25rem' }}>
          {tool.status === 'available' ? (
            <a
              href={tool.url}
              target={tool.isExternal ? '_blank' : '_self'}
              rel={tool.isExternal ? 'noopener noreferrer' : undefined}
              className="cta-button primary"
              style={{ width: '100%' }}
            >
              <span>Open {tool.name}</span>
              {tool.isExternal ? <ExternalLink size={16} /> : <ArrowRight size={16} />}
            </a>
          ) : (
            <button 
              type="button" 
              className="cta-button disabled" 
              style={{ width: '100%' }} 
              disabled
            >
              Work in progress
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
