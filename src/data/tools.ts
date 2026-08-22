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
    longDescription: 'JSON Studio & Formatter is an offline-first JSON utility allowing developer workflows for formatting, minifying, auto-repairing malformed JSON, interactive tree inspection, and converting between JSON, YAML, and CSV.',
    category: 'Developer Tools',
    status: 'available',
    url: 'https://toolsby.vineetsansare.com/jsonStudio/',
    isExternal: true,
    iconName: 'Code2',
    featured: true,
    tags: ['JSON', 'Formatter', 'Developer Tools', 'Client-side'],
    version: 'v1.0',
    accentColor: '#10B981'
  },
  {
    id: 'pdf-toolkit',
    name: 'PDF Utility Suite',
    shortDescription: 'Fast, client-side PDF merger, page extractor, rotator, and image-to-PDF converter with zero server data upload.',
    longDescription: 'PDFHub is a 100% private, client-side PDF toolkit inspired by ilovepdf. Combine multiple PDFs, extract page ranges, rotate pages, or convert JPG/PNG images to PDF without uploading files to any external server.',
    category: 'Utilities',
    status: 'available',
    url: 'https://toolsby.vineetsansare.com/pdfhub/',
    isExternal: true,
    iconName: 'FileSpreadsheet',
    featured: true,
    tags: ['PDF', 'Document Tools', 'Client-side', 'Merge & Split'],
    version: 'v1.0',
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
