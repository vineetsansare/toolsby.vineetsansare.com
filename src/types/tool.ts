export type ToolStatus = 'available' | 'coming-soon' | 'beta' | 'archived';

export type ToolCategory = 
  | 'All'
  | 'Career / AI'
  | 'Developer Tools'
  | 'Productivity'
  | 'Utilities';

export interface Tool {
  id: string;
  name: string;
  shortDescription: string;
  longDescription?: string;
  category: Exclude<ToolCategory, 'All'>;
  status: ToolStatus;
  url: string;
  isExternal: boolean;
  iconName: string; // Lucide icon identifier e.g., 'FileText', 'Sparkles', 'Code2', etc.
  featured?: boolean;
  tags?: string[];
  version?: string;
  secondaryUrl?: string;
  secondaryLabel?: string;
  accentColor?: string; // Optional custom color badge/border highlight
}
