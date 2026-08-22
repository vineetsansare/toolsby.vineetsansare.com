import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-react';

interface JsonTreeViewerProps {
  data: unknown;
  label?: string;
  isLast?: boolean;
  defaultExpandedDepth?: number;
  currentDepth?: number;
}

export const JsonTreeNode: React.FC<JsonTreeViewerProps> = ({
  data,
  label,
  isLast = true,
  defaultExpandedDepth = 2,
  currentDepth = 0
}) => {
  const [expanded, setExpanded] = useState<boolean>(currentDepth < defaultExpandedDepth);
  const [copied, setCopied] = useState(false);

  const handleCopyNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getType = (val: unknown): string => {
    if (val === null) return 'null';
    if (Array.isArray(val)) return 'array';
    return typeof val;
  };

  const dataType = getType(data);

  const renderValue = (val: unknown) => {
    if (val === null) {
      return <span style={{ color: '#F43F5E', fontWeight: 600 }}>null</span>;
    }
    if (typeof val === 'boolean') {
      return <span style={{ color: '#EAB308', fontWeight: 600 }}>{val ? 'true' : 'false'}</span>;
    }
    if (typeof val === 'number') {
      return <span style={{ color: '#3B82F6', fontWeight: 600 }}>{val}</span>;
    }
    if (typeof val === 'string') {
      return <span style={{ color: '#10B981' }}>"{val}"</span>;
    }
    return String(val);
  };

  if (dataType === 'object' || dataType === 'array') {
    const keys = Object.keys(data as object);
    const count = keys.length;
    const isArray = dataType === 'array';
    const openBrace = isArray ? '[' : '{';
    const closeBrace = isArray ? ']' : '}';

    return (
      <div style={{ marginLeft: currentDepth > 0 ? '1.25rem' : 0, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
        <div 
          onClick={() => setExpanded(!expanded)}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.35rem', 
            cursor: 'pointer', 
            userSelect: 'none',
            padding: '0.15rem 0.35rem',
            borderRadius: '4px',
            transition: 'background-color 0.15s'
          }}
          className="tree-node-row"
        >
          <button type="button" style={{ color: 'var(--text-tertiary)', padding: 0 }}>
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {label && (
            <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
              {label}:
            </span>
          )}

          <span style={{ color: 'var(--text-secondary)' }}>{openBrace}</span>

          {!expanded && (
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', fontStyle: 'italic', margin: '0 0.3rem' }}>
              {count} {isArray ? 'items' : 'keys'}
            </span>
          )}

          {!expanded && <span style={{ color: 'var(--text-secondary)' }}>{closeBrace}</span>}

          {!isLast && !expanded && <span style={{ color: 'var(--text-tertiary)' }}>,</span>}

          <button
            type="button"
            onClick={handleCopyNode}
            style={{ opacity: 0.6, marginLeft: '0.5rem', padding: '0.1rem' }}
            title="Copy branch JSON"
          >
            {copied ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
          </button>
        </div>

        {expanded && (
          <div>
            {keys.map((key, idx) => (
              <JsonTreeNode
                key={key}
                label={isArray ? undefined : key}
                data={(data as Record<string, unknown>)[key]}
                isLast={idx === keys.length - 1}
                defaultExpandedDepth={defaultExpandedDepth}
                currentDepth={currentDepth + 1}
              />
            ))}
            <div style={{ marginLeft: '1.25rem', color: 'var(--text-secondary)' }}>
              {closeBrace}{!isLast && <span style={{ color: 'var(--text-tertiary)' }}>,</span>}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ marginLeft: currentDepth > 0 ? '1.25rem' : 0, fontFamily: 'var(--font-mono)', fontSize: '0.85rem', padding: '0.1rem 0' }}>
      {label && (
        <span style={{ color: 'var(--brand-primary)', fontWeight: 600, marginRight: '0.35rem' }}>
          {label}:
        </span>
      )}
      {renderValue(data)}
      {!isLast && <span style={{ color: 'var(--text-tertiary)' }}>,</span>}
    </div>
  );
};

export const JsonTreeViewer: React.FC<{ data: unknown }> = ({ data }) => {
  return (
    <div style={{ 
      backgroundColor: 'var(--bg-elevated)', 
      border: '1px solid var(--border-subtle)', 
      borderRadius: 'var(--radius-md)', 
      padding: '1.25rem',
      overflowX: 'auto',
      maxHeight: '650px'
    }}>
      <JsonTreeNode data={data} defaultExpandedDepth={3} />
    </div>
  );
};
