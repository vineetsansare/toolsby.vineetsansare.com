import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

export interface JsonValidationError {
  isValid: boolean;
  error?: string;
  line?: number;
  column?: number;
}

/**
 * Validates JSON string and extracts line/column if syntax error occurs.
 */
export function validateJson(input: string): JsonValidationError {
  if (!input.trim()) {
    return { isValid: true };
  }
  try {
    JSON.parse(input);
    return { isValid: true };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    
    // Attempt line and column extraction from V8 error message
    let line: number | undefined;
    let column: number | undefined;
    
    const posMatch = errorMessage.match(/at position (\d+)/i);
    if (posMatch && posMatch[1]) {
      const position = parseInt(posMatch[1], 10);
      const lines = input.substring(0, position).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    } else {
      const lineColMatch = errorMessage.match(/line (\d+) column (\d+)/i);
      if (lineColMatch) {
        line = parseInt(lineColMatch[1], 10);
        column = parseInt(lineColMatch[2], 10);
      }
    }

    return {
      isValid: false,
      error: errorMessage,
      line,
      column
    };
  }
}

/**
 * Prettifies JSON with specified indentation space.
 */
export function prettifyJson(input: string, indent: number | string = 2): string {
  if (!input.trim()) return '';
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, indent);
}

/**
 * Minifies JSON to a single compact line.
 */
export function minifyJson(input: string): string {
  if (!input.trim()) return '';
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

/**
 * Attempts to repair common malformed JSON errors:
 * - Trailing commas in objects & arrays
 * - Single quotes instead of double quotes
 * - Unquoted key names
 * - JS-style comments (// and /* ... *\/)
 */
export function repairJson(input: string): string {
  if (!input.trim()) return '';
  
  let repaired = input;

  // Remove single line comments // ...
  repaired = repaired.replace(/\/\/[^\n]*/g, '');
  
  // Remove multi-line comments /* ... */
  repaired = repaired.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Replace single quotes around keys/values with double quotes (basic heuristics)
  repaired = repaired.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '"$1"');
  
  // Fix unquoted property names e.g. { foo: "bar" } -> { "foo": "bar" }
  repaired = repaired.replace(/([{,]\s*)([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":');
  
  // Remove trailing commas in objects and arrays e.g. { "a": 1, } -> { "a": 1 }
  repaired = repaired.replace(/,\s*([}\]])/g, '$1');

  // Verify repair succeeded by parsing
  const parsed = JSON.parse(repaired);
  return JSON.stringify(parsed, null, 2);
}

/**
 * Converts JSON string to YAML format.
 */
export function jsonToYaml(input: string): string {
  if (!input.trim()) return '';
  const parsed = JSON.parse(input);
  return stringifyYaml(parsed);
}

/**
 * Converts YAML string to JSON format.
 */
export function yamlToJson(input: string, indent: number = 2): string {
  if (!input.trim()) return '';
  const parsed = parseYaml(input);
  return JSON.stringify(parsed, null, indent);
}

/**
 * Converts JSON array of objects to CSV string format.
 */
export function jsonToCsv(input: string): string {
  if (!input.trim()) return '';
  const parsed = JSON.parse(input);
  
  const array = Array.isArray(parsed) ? parsed : [parsed];
  if (array.length === 0) return '';
  
  // Flatten headers
  const headers = Array.from(
    new Set(array.flatMap(item => (typeof item === 'object' && item !== null ? Object.keys(item) : ['value'])))
  );

  const escapeField = (val: unknown) => {
    if (val === null || val === undefined) return '';
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvRows = [
    headers.join(','),
    ...array.map(row => {
      if (typeof row === 'object' && row !== null) {
        return headers.map(header => escapeField((row as Record<string, unknown>)[header])).join(',');
      }
      return escapeField(row);
    })
  ];

  return csvRows.join('\n');
}

/**
 * Sample JSON templates for quick testing.
 */
export const SAMPLE_JSON_TEMPLATES = {
  userProfile: {
    id: 'user_9841',
    name: 'Vineet Sansare',
    role: 'Tech Lead & Senior Software Engineer',
    active: true,
    skills: ['React', 'TypeScript', 'SwiftUI', 'AI Automations'],
    metrics: {
      projectsCompleted: 14,
      rating: 4.95
    },
    socials: {
      github: 'https://github.com/vineetsansare',
      portfolio: 'https://vineetsansare.com'
    }
  },
  apiResponse: {
    status: 200,
    message: 'Success',
    data: {
      total: 3,
      tools: [
        { id: 'jd2cv', name: 'JD2CV', category: 'Career / AI', status: 'available' },
        { id: 'jsonStudio', name: 'JSON Studio', category: 'Developer Tools', status: 'available' },
        { id: 'pdfhub', name: 'PDFHub', category: 'Utilities', status: 'available' }
      ]
    },
    meta: {
      timestamp: '2026-08-23T01:25:00Z',
      cached: false
    }
  }
};
