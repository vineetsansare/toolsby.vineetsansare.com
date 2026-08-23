export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  systemInstruction: string;
  userPromptTemplate: string;
  defaultVariables: Record<string, string>;
}

export interface PromptExecutionConfig {
  provider: 'gemini' | 'openai' | 'demo';
  model: string;
  apiKey?: string;
  temperature: number;
  maxTokens: number;
}

export interface ExecutionResult {
  output: string;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/**
 * Extracts unique {{variable_name}} tokens from prompt templates.
 */
export function extractVariables(template: string): string[] {
  const regex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
  const matches = new Set<string>();
  let match;
  while ((match = regex.exec(template)) !== null) {
    if (match[1]) {
      matches.add(match[1]);
    }
  }
  return Array.from(matches);
}

/**
 * Replaces {{variable_name}} with provided values.
 */
export function substituteVariables(
  template: string, 
  variables: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    result = result.replace(regex, value || '');
  }
  return result;
}

/**
 * Preset Prompt Templates
 */
export const PRESET_TEMPLATES: PromptTemplate[] = [
  {
    id: 'code-reviewer',
    name: '💻 Senior Code Reviewer & Refactoring Specialist',
    category: 'Engineering',
    description: 'Perform a comprehensive code review focusing on performance, security, and edge cases.',
    systemInstruction: 'You are a Principal Software Engineer and Staff Security Auditor. Review code strictly and constructively.',
    userPromptTemplate: `Please review the following {{language}} code snippet:

\`\`\`{{language}}
{{code_snippet}}
\`\`\`

Focus area: {{focus_area}} (e.g. Memory leaks, Security, Readability, Performance).
Provide actionable refactored code and a breakdown of identified issues.`,
    defaultVariables: {
      language: 'typescript',
      code_snippet: `async function fetchData(url) {\n  const res = await fetch(url);\n  const data = await res.json();\n  return data;\n}`,
      focus_area: 'Error Handling, Resilience & Type Safety'
    }
  },
  {
    id: 'resume-architect',
    name: '📝 Executive Resume & Cover Letter Architect',
    category: 'Career',
    description: 'Rewrite resume bullet points into Google XYZ Formula accomplishments tailored to a target Job Description.',
    systemInstruction: 'You are an executive talent acquisition director. Weave keywords naturally using the XYZ accomplishment formula.',
    userPromptTemplate: `Target Role: {{target_role}}

Job Description Highlights:
{{job_description}}

Raw Career Bullet Point:
{{raw_bullet}}

Transform this raw experience bullet into 3 high-impact, ATS-optimized accomplishment bullets for a {{target_role}} resume.`,
    defaultVariables: {
      target_role: 'Senior Staff Engineer',
      job_description: 'Looking for experience in distributed systems, micro-frontends, high concurrency, and team leadership.',
      raw_bullet: 'Built a web application for internal team tracking and fixed bugs in frontend code.'
    }
  },
  {
    id: 'json-schema-enforcer',
    name: '📊 Structured JSON Generator & Schema Enforcer',
    category: 'Data Engineering',
    description: 'Extract structured data from unstructured text in guaranteed valid JSON format.',
    systemInstruction: 'You are a precise data extraction engine. Return ONLY valid JSON matching the user specified JSON schema.',
    userPromptTemplate: `Unstructured Text:
"{{unstructured_text}}"

Extract the data into a JSON object matching this schema structure:
{{expected_schema}}`,
    defaultVariables: {
      unstructured_text: 'Vineet Sansare is a Tech Lead & Senior Software Engineer based in Dubai with 8+ years experience in React, TypeScript, and AI integrations. Email: contact@vineetsansare.com.',
      expected_schema: `{\n  "name": "string",\n  "title": "string",\n  "location": "string",\n  "skills": ["string"],\n  "contact": { "email": "string" }\n}`
    }
  },
  {
    id: 'social-copywriter',
    name: '📣 Technical Product Launch & Social Copywriter',
    category: 'Marketing',
    description: 'Craft viral, highly engaging product launch posts for Twitter/X and LinkedIn.',
    systemInstruction: 'You are a veteran tech copywriter who writes engaging, non-cringey developer product launches.',
    userPromptTemplate: `Product Name: {{product_name}}
Key Benefit: {{key_benefit}}
Target Audience: {{target_audience}}

Generate 2 engaging launch posts:
1. Short Twitter/X thread starter (max 280 chars)
2. Professional LinkedIn post with bullet highlights.`,
    defaultVariables: {
      product_name: 'Tools by Vineet',
      key_benefit: '100% free, client-side, zero-server privacy developer utilities including JD2CV, JSON Studio, and PDF Hub',
      target_audience: 'Software Engineers, Technical Recruiters, and Product Creators'
    }
  }
];

/**
 * Generates copyable production code snippets (Python, TypeScript, cURL).
 */
export function generateCodeSnippet(
  language: 'python' | 'typescript' | 'curl',
  config: PromptExecutionConfig,
  systemInstruction: string,
  fullPrompt: string
): string {
  if (language === 'python') {
    if (config.provider === 'openai') {
      return `import os
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

response = client.chat.completions.create(
    model="${config.model || 'gpt-4o-mini'}",
    temperature=${config.temperature},
    max_tokens=${config.maxTokens},
    messages=[
        {"role": "system", "content": """${systemInstruction}"""},
        {"role": "user", "content": """${fullPrompt}"""}
    ]
)

print(response.choices[0].message.content)`;
    } else {
      return `import os
import google.generativeai as genai

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

model = genai.GenerativeModel(
    model_name="${config.model || 'gemini-1.5-flash'}",
    system_instruction="""${systemInstruction}"""
)

response = model.generate_content(
    """${fullPrompt}""",
    generation_config={
        "temperature": ${config.temperature},
        "max_output_tokens": ${config.maxTokens}
    }
)

print(response.text)`;
    }
  }

  if (language === 'typescript') {
    if (config.provider === 'openai') {
      return `async function runPrompt() {
  const apiKey = process.env.OPENAI_API_KEY;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": \`Bearer \${apiKey}\`
    },
    body: JSON.stringify({
      model: "${config.model || 'gpt-4o-mini'}",
      temperature: ${config.temperature},
      max_tokens: ${config.maxTokens},
      messages: [
        { role: "system", content: ${JSON.stringify(systemInstruction)} },
        { role: "user", content: ${JSON.stringify(fullPrompt)} }
      ]
    })
  });

  const data = await response.json();
  console.log(data.choices[0].message.content);
}`;
    } else {
      return `async function runPrompt() {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = "${config.model || 'gemini-1.5-flash'}";
  const url = \`https://generativelanguage.googleapis.com/v1beta/models/\${model}:generateContent?key=\${apiKey}\`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: ${JSON.stringify(systemInstruction)} }] },
      contents: [{ role: "user", parts: [{ text: ${JSON.stringify(fullPrompt)} }] }],
      generationConfig: {
        temperature: ${config.temperature},
        maxOutputTokens: ${config.maxTokens}
      }
    })
  });

  const data = await response.json();
  console.log(data.candidates[0].content.parts[0].text);
}`;
    }
  }

  // cURL
  if (config.provider === 'openai') {
    return `curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -d '{
    "model": "${config.model || 'gpt-4o-mini'}",
    "temperature": ${config.temperature},
    "messages": [
      {"role": "system", "content": ${JSON.stringify(systemInstruction)}},
      {"role": "user", "content": ${JSON.stringify(fullPrompt)}}
    ]
  }'`;
  }

  return `curl "https://generativelanguage.googleapis.com/v1beta/models/${config.model || 'gemini-1.5-flash'}:generateContent?key=$GEMINI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "system_instruction": {"parts": [{"text": ${JSON.stringify(systemInstruction)}}]},
    "contents": [{"role": "user", "parts": [{"text": ${JSON.stringify(fullPrompt)}}]}],
    "generationConfig": { "temperature": ${config.temperature} }
  }'`;
}

/**
 * Executes the prompt client-side via Gemini API, OpenAI API, or instant Demo Simulation.
 */
export async function executePrompt(
  config: PromptExecutionConfig,
  systemInstruction: string,
  fullPrompt: string
): Promise<ExecutionResult> {
  const startTime = Date.now();

  // 1. OpenAI API
  if (config.provider === 'openai' && config.apiKey) {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o-mini',
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: fullPrompt }
        ]
      })
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error?.message || `OpenAI API error: ${resp.statusText}`);
    }

    const data = await resp.json();
    const output = data.choices[0]?.message?.content || '';
    const latencyMs = Date.now() - startTime;
    const usage = data.usage || {};

    return {
      output,
      latencyMs,
      promptTokens: usage.prompt_tokens || Math.round(fullPrompt.length / 4),
      completionTokens: usage.completion_tokens || Math.round(output.length / 4),
      totalTokens: usage.total_tokens || Math.round((fullPrompt.length + output.length) / 4)
    };
  }

  // 2. Gemini API
  if (config.provider === 'gemini' && config.apiKey) {
    const modelName = config.model || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.apiKey}`;
    
    const body: Record<string, unknown> = {
      contents: [
        { role: 'user', parts: [{ text: `${systemInstruction ? `SYSTEM INSTRUCTION:\n${systemInstruction}\n\n` : ''}${fullPrompt}` }] }
      ],
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens
      }
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini API error: ${resp.statusText}`);
    }

    const data = await resp.json();
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const latencyMs = Date.now() - startTime;
    const promptTokens = Math.round(fullPrompt.length / 4);
    const completionTokens = Math.round(output.length / 4);

    return {
      output,
      latencyMs,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens
    };
  }

  // 3. Demo Simulation Mode (when no API key is provided)
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate realistic network delay
  const latencyMs = Date.now() - startTime;

  let simulatedOutput = '';
  if (fullPrompt.toLowerCase().includes('review') || fullPrompt.toLowerCase().includes('code')) {
    simulatedOutput = `### 🔍 Code Review & Optimization Summary

#### 1. Identified Issues:
- **Missing Error Handling**: Network failures in \`fetch()\` are not caught, which could crash caller routines.
- **Type Safety Warning**: Parameter \`url\` lacks TypeScript type annotation.
- **Unchecked HTTP Status**: \`fetch\` does not throw on 404/500 HTTP status codes unless checked via \`res.ok\`.

#### 2. Optimized Production Refactor:
\`\`\`typescript
interface FetchResponse<T> {
  data: T | null;
  error: string | null;
}

export async function fetchData<T>(url: string): Promise<FetchResponse<T>> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
    }
    const data = (await res.json()) as T;
    return { data, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown network error';
    return { data: null, error: errorMessage };
  }
}
\`\`\``;
  } else if (fullPrompt.toLowerCase().includes('json') || fullPrompt.toLowerCase().includes('schema')) {
    simulatedOutput = `{\n  "name": "Vineet Sansare",\n  "title": "Tech Lead & Senior Software Engineer",\n  "location": "Dubai, UAE",\n  "skills": ["React", "TypeScript", "Node.js", "AI Integrations", "Swift"],\n  "contact": {\n    "email": "contact@vineetsansare.com"\n  }\n}`;
  } else {
    simulatedOutput = `### 🌟 Generated Output Response

Here is the structured optimization based on your system instructions and target variable inputs:

1. **Core Insight**: The provided prompt template effectively isolates key intent parameters.
2. **Action Item**: Verify system instruction alignment against target audience domain knowledge.
3. **Execution Quality**: High coherence, clear formatting, and 100% adherence to specified response parameters.

*(Note: Operating in Demo Playground Mode. Add your Gemini or OpenAI API Key in settings for live API generation!)*`;
  }

  const promptTokens = Math.round((systemInstruction.length + fullPrompt.length) / 4);
  const completionTokens = Math.round(simulatedOutput.length / 4);

  return {
    output: simulatedOutput,
    latencyMs,
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens
  };
}
