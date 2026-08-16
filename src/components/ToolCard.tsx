import React from 'react';
import { 
  FileText, 
  Code2, 
  FileSpreadsheet, 
  Sparkles, 
  Wrench, 
  ExternalLink, 
  ArrowRight, 
  Clock,
  Info
} from 'lucide-react';
import { Tool } from '../types/tool';

interface ToolCardProps {
  tool: Tool;
  onOpenDetails?: (tool: Tool) => void;
}

const getIcon = (iconName: string) => {
  const size = 26;
  switch (iconName) {
    case 'FileText':
      return <FileText size={size} />;
    case 'Code2':
      return <Code2 size={size} />;
    case 'FileSpreadsheet':
      return <FileSpreadsheet size={size} />;
    case 'Sparkles':
      return <Sparkles size={size} />;
    default:
      return <Wrench size={size} />;
  }
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onOpenDetails }) => {
  const isAvailable = tool.status === 'available';

  return (
    <article className={`tool-card ${tool.featured ? 'featured' : ''}`}>
      <div className="tool-card-top">
        <div 
          className="tool-icon-box"
          style={tool.accentColor ? { color: tool.accentColor } : undefined}
        >
          {getIcon(tool.iconName)}
        </div>

        <div className={`status-badge ${tool.status}`}>
          <span className="status-indicator" />
          {tool.status === 'available' ? 'LIVE' : 'Work in progress'}
        </div>
      </div>

      <div className="tool-card-body">
        <div className="tool-header-row">
          <h2 className="tool-name">{tool.name}</h2>
          <span className="category-tag">{tool.category}</span>
          {tool.version && (
            <span className="category-tag" style={{ fontFamily: 'var(--font-mono)' }}>
              {tool.version}
            </span>
          )}
        </div>

        <p className="tool-description">{tool.shortDescription}</p>

        {tool.tags && tool.tags.length > 0 && (
          <div className="tool-tags-row">
            {tool.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="tool-card-footer">
        {isAvailable ? (
          <a
            href={tool.url}
            target={tool.isExternal ? '_blank' : '_self'}
            rel={tool.isExternal ? 'noopener noreferrer' : undefined}
            className="cta-button primary"
            title={`Open ${tool.name}`}
          >
            <span>Open {tool.name}</span>
            {tool.isExternal ? <ExternalLink size={15} /> : <ArrowRight size={15} />}
          </a>
        ) : (
          <button type="button" className="cta-button disabled" disabled>
            <Clock size={15} />
            <span>Work in progress</span>
          </button>
        )}

        {tool.longDescription && onOpenDetails && (
          <button
            type="button"
            className="secondary-action"
            onClick={() => onOpenDetails(tool)}
            title="View tool details"
          >
            <Info size={14} />
            <span>Details</span>
          </button>
        )}
      </div>
    </article>
  );
};
