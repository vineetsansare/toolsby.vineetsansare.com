import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Play, 
  Copy, 
  Check, 
  Settings, 
  Code, 
  BookOpen, 
  Key, 
  Save, 
  Trash2, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ToolPageHeader } from '../../ToolPageHeader';
import { 
  PRESET_TEMPLATES, 
  PromptTemplate, 
  PromptExecutionConfig, 
  ExecutionResult, 
  extractVariables, 
  substituteVariables, 
  generateCodeSnippet, 
  executePrompt 
} from '../../../utils/promptUtils';

export const PromptCraft: React.FC = () => {
  // Guide Panel Collapsible State
  const [showGuide, setShowGuide] = useState(true);

  // Template State
  const [selectedPresetId, setSelectedPresetId] = useState<string>('code-reviewer');
  const [systemInstruction, setSystemInstruction] = useState<string>(PRESET_TEMPLATES[0].systemInstruction);
  const [userTemplate, setUserTemplate] = useState<string>(PRESET_TEMPLATES[0].userPromptTemplate);
  const [variables, setVariables] = useState<Record<string, string>>(PRESET_TEMPLATES[0].defaultVariables);

  // Model & Execution Config State
  const [config, setConfig] = useState<PromptExecutionConfig>({
    provider: 'demo',
    model: 'gemini-1.5-flash',
    apiKey: '',
    temperature: 0.7,
    maxTokens: 1024
  });

  // Show API Key Toggle
  const [showApiKey, setShowApiKey] = useState(false);

  // Execution & Output State
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Code Snippet Export State
  const [activeCodeTab, setActiveCodeTab] = useState<'python' | 'typescript' | 'curl'>('python');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Saved Prompts Library
  const [savedPrompts, setSavedPrompts] = useState<PromptTemplate[]>([]);
  const [savePromptName, setSavePromptName] = useState('');

  // Auto-detect variables whenever template changes
  const detectedVarNames = extractVariables(userTemplate);

  // Update variables record when detected variables change
  useEffect(() => {
    setVariables(prev => {
      const next: Record<string, string> = {};
      detectedVarNames.forEach(name => {
        next[name] = prev[name] !== undefined ? prev[name] : '';
      });
      return next;
    });
  }, [userTemplate]);

  // Load saved prompts from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('toolsby_prompt_craft_saved');
      if (stored) {
        setSavedPrompts(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved prompts', e);
    }
  }, []);

  // Handle Preset Select
  const handlePresetSelect = (id: string) => {
    setSelectedPresetId(id);
    const preset = PRESET_TEMPLATES.find(p => p.id === id);
    if (preset) {
      setSystemInstruction(preset.systemInstruction);
      setUserTemplate(preset.userPromptTemplate);
      setVariables({ ...preset.defaultVariables });
      setExecutionResult(null);
    }
  };

  // Handle Variable Change
  const handleVariableChange = (name: string, val: string) => {
    setVariables(prev => ({ ...prev, [name]: val }));
  };

  // Compute final substituted prompt
  const finalSubstitutedPrompt = substituteVariables(userTemplate, variables);

  // Handle Prompt Execution
  const handleRunPrompt = async () => {
    setIsExecuting(true);
    setErrorMessage(null);
    try {
      const result = await executePrompt(config, systemInstruction, finalSubstitutedPrompt);
      setExecutionResult(result);
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : 'Execution failed.');
    } finally {
      setIsExecuting(false);
    }
  };

  // Copy helper
  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Save prompt to local library
  const handleSavePrompt = () => {
    if (!savePromptName.trim()) return;
    const newPrompt: PromptTemplate = {
      id: 'custom_' + Date.now(),
      name: savePromptName.trim(),
      category: 'Custom Saved',
      description: 'Custom user prompt template',
      systemInstruction,
      userPromptTemplate: userTemplate,
      defaultVariables: { ...variables }
    };
    const updated = [newPrompt, ...savedPrompts];
    setSavedPrompts(updated);
    localStorage.setItem('toolsby_prompt_craft_saved', JSON.stringify(updated));
    setSavePromptName('');
  };

  // Delete saved prompt
  const handleDeleteSavedPrompt = (id: string) => {
    const updated = savedPrompts.filter(p => p.id !== id);
    setSavedPrompts(updated);
    localStorage.setItem('toolsby_prompt_craft_saved', JSON.stringify(updated));
  };

  const codeSnippet = generateCodeSnippet(activeCodeTab, config, systemInstruction, finalSubstitutedPrompt);

  return (
    <>
      <ToolPageHeader title="LLM Prompt Craft" category="Productivity" />

      <main className="container" style={{ paddingBottom: '3rem' }}>
        {/* Quick Start Info Guide Section */}
        <div className="tool-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', border: '1px solid var(--border-card-hover)', backgroundColor: 'var(--bg-pill)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setShowGuide(!showGuide)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <BookOpen size={20} color="var(--brand-primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                🚀 Quick Start Guide — How to Use LLM Prompt Craft
              </h3>
            </div>
            <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              {showGuide ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {showGuide && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Step 1: Write Templates & Variables
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: '1.45' }}>
                  Use <code style={{ backgroundColor: 'var(--bg-elevated)', padding: '0.15rem 0.35rem', borderRadius: '4px' }}>{"{{variable_name}}"}</code> placeholders in your prompt template. Dynamic input fields auto-generate below!
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Step 2: Choose Model & BYOK
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: '1.45' }}>
                  Select <strong>Gemini</strong> or <strong>OpenAI</strong> and add your API key, or test instantly in <strong>Demo Sandbox Mode</strong> without an API key!
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Step 3: Run & Export Code
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: '1.45' }}>
                  Click <strong>Run Prompt</strong> to inspect real-time outputs and export 1-click production code snippets in Python, TypeScript, or cURL.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Main Grid: Left Column Editor | Right Column Config & Output */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
          
          {/* LEFT COLUMN: Prompt Editor Workspace */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Template Presets Picker */}
            <div className="tool-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={16} color="var(--brand-primary)" />
                  <span>Preset Templates</span>
                </label>
              </div>

              <select
                className="search-input"
                value={selectedPresetId}
                onChange={e => handlePresetSelect(e.target.value)}
                style={{ width: '100%', borderRadius: 'var(--radius-sm)', paddingLeft: '0.85rem' }}
              >
                {PRESET_TEMPLATES.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* System Instructions */}
            <div className="tool-card" style={{ padding: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                System Instruction (Role & Persona)
              </label>
              <textarea
                className="search-input"
                rows={3}
                value={systemInstruction}
                onChange={e => setSystemInstruction(e.target.value)}
                placeholder="e.g. You are a senior tech lead reviewing code for performance and security..."
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}
              />
            </div>

            {/* User Prompt Template */}
            <div className="tool-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                  User Prompt Template
                </label>
                {detectedVarNames.length > 0 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                    Detected Variables: {detectedVarNames.map(v => `{{${v}}}`).join(', ')}
                  </span>
                )}
              </div>
              <textarea
                className="search-input"
                rows={7}
                value={userTemplate}
                onChange={e => setUserTemplate(e.target.value)}
                placeholder="Write your prompt template here. Use {{variable_name}} for dynamic inputs..."
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}
              />
            </div>

            {/* Dynamic Variable Values Form */}
            {detectedVarNames.length > 0 && (
              <div className="tool-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--brand-primary)' }}>
                  Template Variable Inputs
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {detectedVarNames.map(varName => (
                    <div key={varName}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                        <code style={{ color: 'var(--brand-primary)' }}>{"{{"}{varName}{"}}"}</code>
                      </label>
                      <textarea
                        className="search-input"
                        rows={2}
                        value={variables[varName] || ''}
                        onChange={e => handleVariableChange(varName, e.target.value)}
                        placeholder={`Enter value for ${varName}...`}
                        style={{ width: '100%', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Prompt Section */}
            <div className="tool-card" style={{ padding: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Save Template to Local Library
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="search-input"
                  value={savePromptName}
                  onChange={e => setSavePromptName(e.target.value)}
                  placeholder="Custom template name..."
                  style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '0.75rem' }}
                />
                <button
                  type="button"
                  className="cta-button primary"
                  onClick={handleSavePrompt}
                  disabled={!savePromptName.trim()}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  <Save size={15} />
                  <span>Save</span>
                </button>
              </div>

              {savedPrompts.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>Saved Library ({savedPrompts.length})</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.5rem' }}>
                    {savedPrompts.map(sp => (
                      <div key={sp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.6rem', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                        <span 
                          onClick={() => {
                            setSystemInstruction(sp.systemInstruction);
                            setUserTemplate(sp.userPromptTemplate);
                            setVariables({ ...sp.defaultVariables });
                          }}
                          style={{ cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-primary)' }}
                        >
                          {sp.name}
                        </span>
                        <button type="button" onClick={() => handleDeleteSavedPrompt(sp.id)} style={{ color: '#F43F5E', background: 'none', border: 'none', cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Execution Config & Results Window */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Model & Provider Settings */}
            <div className="tool-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Settings size={18} color="var(--brand-primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Model & Provider Settings</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Provider Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Execution Provider:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                    <button
                      type="button"
                      className={`filter-btn ${config.provider === 'demo' ? 'active' : ''}`}
                      onClick={() => setConfig(prev => ({ ...prev, provider: 'demo' }))}
                      style={{ padding: '0.4rem 0.2rem', fontSize: '0.78rem' }}
                    >
                      Demo Sandbox
                    </button>

                    <button
                      type="button"
                      className={`filter-btn ${config.provider === 'gemini' ? 'active' : ''}`}
                      onClick={() => setConfig(prev => ({ ...prev, provider: 'gemini', model: 'gemini-1.5-flash' }))}
                      style={{ padding: '0.4rem 0.2rem', fontSize: '0.78rem' }}
                    >
                      Gemini API
                    </button>

                    <button
                      type="button"
                      className={`filter-btn ${config.provider === 'openai' ? 'active' : ''}`}
                      onClick={() => setConfig(prev => ({ ...prev, provider: 'openai', model: 'gpt-4o-mini' }))}
                      style={{ padding: '0.4rem 0.2rem', fontSize: '0.78rem' }}
                    >
                      OpenAI API
                    </button>
                  </div>
                </div>

                {/* API Key Input (if Gemini or OpenAI) */}
                {config.provider !== 'demo' && (
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      <Key size={14} color="var(--brand-primary)" />
                      <span>{config.provider === 'gemini' ? 'Gemini' : 'OpenAI'} API Key (BYOK):</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        className="search-input"
                        value={config.apiKey || ''}
                        onChange={e => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                        placeholder={`Enter your ${config.provider === 'gemini' ? 'AIza...' : 'sk-...'} key...`}
                        style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '0.75rem', paddingRight: '4.5rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        style={{
                          position: 'absolute',
                          right: '0.5rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '0.75rem',
                          background: 'none',
                          border: 'none',
                          color: 'var(--brand-primary)',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        {showApiKey ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Model Selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Model:
                  </label>
                  <select
                    className="search-input"
                    value={config.model}
                    onChange={e => setConfig(prev => ({ ...prev, model: e.target.value }))}
                    style={{ width: '100%', borderRadius: 'var(--radius-sm)', paddingLeft: '0.75rem' }}
                  >
                    {config.provider === 'openai' ? (
                      <>
                        <option value="gpt-4o-mini">gpt-4o-mini (Fast & Cheap)</option>
                        <option value="gpt-4o">gpt-4o (High Intelligence)</option>
                      </>
                    ) : (
                      <>
                        <option value="gemini-1.5-flash">gemini-1.5-flash (Fast & Versatile)</option>
                        <option value="gemini-1.5-pro">gemini-1.5-pro (Deep Reasoning)</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Temperature Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    <span>Temperature: {config.temperature}</span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                      {config.temperature < 0.3 ? 'Deterministic' : config.temperature > 0.7 ? 'Creative' : 'Balanced'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={config.temperature}
                    onChange={e => setConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Execution Action Button */}
              <button
                type="button"
                className="cta-button primary"
                onClick={handleRunPrompt}
                disabled={isExecuting}
                style={{ width: '100%', padding: '0.85rem', marginTop: '1.25rem', fontSize: '0.95rem' }}
              >
                <Play size={18} />
                <span>{isExecuting ? 'Running Prompt...' : 'Run Prompt'}</span>
              </button>

              {errorMessage && (
                <p style={{ color: '#F43F5E', fontSize: '0.8rem', marginTop: '0.75rem', fontWeight: 600 }}>
                  {errorMessage}
                </p>
              )}
            </div>

            {/* Execution Result Output */}
            {executionResult && (
              <div className="tool-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Check size={18} />
                    <span>Response Output</span>
                  </h3>

                  <button
                    type="button"
                    className="secondary-action"
                    onClick={() => handleCopyText(executionResult.output, 'output')}
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                  >
                    {copiedType === 'output' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedType === 'output' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Metrics Bar */}
                <div style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>Latency: <strong>{executionResult.latencyMs} ms</strong></span>
                  <span>Tokens: <strong>{executionResult.totalTokens}</strong> ({executionResult.promptTokens} in / {executionResult.completionTokens} out)</span>
                </div>

                {/* Response Text Display */}
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-pill)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {executionResult.output}
                </div>
              </div>
            )}

            {/* Code Snippet Exporter */}
            <div className="tool-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Code size={18} color="var(--brand-primary)" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Code Exporter</h3>
                </div>

                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => handleCopyText(codeSnippet, 'code')}
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                >
                  {copiedType === 'code' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedType === 'code' ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {(['python', 'typescript', 'curl'] as const).map(lang => (
                  <button
                    key={lang}
                    type="button"
                    className={`filter-btn ${activeCodeTab === lang ? 'active' : ''}`}
                    onClick={() => setActiveCodeTab(lang)}
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', textTransform: 'capitalize' }}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <pre style={{
                padding: '0.85rem',
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.78rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                lineHeight: '1.45'
              }}>
                {codeSnippet}
              </pre>
            </div>

          </div>

        </div>
      </main>
    </>
  );
};

export default PromptCraft;
