import { Tool } from '../types/tool';
import { SITE_CONFIG } from '../config/siteConfig';

export const TOOLS_REGISTRY: Tool[] = [
  {
    id: 'jd2cv',
    name: 'JD2CV',
    shortDescription: 'AI-powered CV tailoring that transforms job descriptions into tailored, ATS-friendly CVs highlighting your most relevant experience.',
    longDescription: 'JD2CV is an AI career tool designed to analyze job descriptions and optimize your resume to pass Applicant Tracking Systems (ATS) while highlighting the skills recruiters look for most.',
    category: 'Career / AI',
    status: 'available',
    url: SITE_CONFIG.jd2cvUrl,
    isExternal: true,
    iconName: 'FileText',
    featured: true,
    tags: ['AI', 'ATS Optimizer', 'Career', 'Resume Builder'],
    version: 'v1.0',
    accentColor: '#6366F1'
  },
  {
    id: 'json-formatter',
    name: 'JSON Studio & Formatter',
    shortDescription: 'High-performance offline JSON validator, formatter, schema checker, and tree inspector built for modern web workflows.',
    category: 'Developer Tools',
    status: 'coming-soon',
    url: '/tools/json-formatter',
    isExternal: false,
    iconName: 'Code2',
    featured: false,
    tags: ['JSON', 'Formatter', 'Developer Tools'],
    accentColor: '#10B981'
  },
  {
    id: 'pdf-toolkit',
    name: 'PDF Utility Suite',
    shortDescription: 'Fast, client-side PDF merger, page extractor, and document compressor with zero server data upload.',
    category: 'Utilities',
    status: 'coming-soon',
    url: '/tools/pdf-toolkit',
    isExternal: false,
    iconName: 'FileSpreadsheet',
    featured: false,
    tags: ['PDF', 'Document Tools', 'Client-side'],
    accentColor: '#EC4899'
  },
  {
    id: 'prompt-studio',
    name: 'LLM Prompt Craft',
    shortDescription: 'Interactive workbench for crafting, testing, and versioning structured prompts across multiple LLM providers.',
    category: 'Productivity',
    status: 'coming-soon',
    url: '/tools/prompt-studio',
    isExternal: false,
    iconName: 'Sparkles',
    featured: false,
    tags: ['AI', 'Prompts', 'Productivity'],
    accentColor: '#8B5CF6'
  }
];

export const TOOL_CATEGORIES = [
  'All',
  'Career / AI',
  'Developer Tools',
  'Productivity',
  'Utilities'
] as const;
