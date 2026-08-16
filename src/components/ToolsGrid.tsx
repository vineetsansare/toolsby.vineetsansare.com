import React, { useState, useMemo } from 'react';
import { Search, PackageSearch } from 'lucide-react';
import { Tool, ToolCategory } from '../types/tool';
import { TOOL_CATEGORIES } from '../data/tools';
import { ToolCard } from './ToolCard';

interface ToolsGridProps {
  tools: Tool[];
  onOpenDetails?: (tool: Tool) => void;
}

export const ToolsGrid: React.FC<ToolsGridProps> = ({ tools, onOpenDetails }) => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = 
        selectedCategory === 'All' || tool.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        tool.name.toLowerCase().includes(query) ||
        tool.shortDescription.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(query)));

      return matchesCategory && matchesSearch;
    });
  }, [tools, selectedCategory, searchQuery]);

  return (
    <section id="tools" className="tools-section">
      <div className="tools-controls">
        <div className="category-filters" role="tablist" aria-label="Tool Categories">
          {TOOL_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selectedCategory === category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category as ToolCategory)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search tools by name, category or tag"
          />
        </div>
      </div>

      {filteredTools.length > 0 ? (
        <div className="tools-grid">
          {filteredTools.map((tool) => (
            <ToolCard 
              key={tool.id} 
              tool={tool} 
              onOpenDetails={onOpenDetails} 
            />
          ))}
        </div>
      ) : (
        <div className="tool-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div 
            className="tool-icon-box" 
            style={{ margin: '0 auto 1rem', width: '3.5rem', height: '3.5rem' }}
          >
            <PackageSearch size={28} />
          </div>
          <h3 className="tool-name" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            No matching tools found
          </h3>
          <p className="tool-description">
            Try adjusting your search criteria or category filter to discover available tools.
          </p>
        </div>
      )}
    </section>
  );
};
