import React, { useState, useMemo } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Wrench, 
  Code2, 
  FileText, 
  FileCode, 
  Trash2, 
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ListTree
} from 'lucide-react';
import { ToolPageHeader } from '../../ToolPageHeader';
import { JsonTreeViewer } from './JsonTreeViewer';
import { 
  validateJson, 
  prettifyJson, 
  minifyJson, 
  repairJson, 
  jsonToYaml, 
  jsonToCsv, 
  SAMPLE_JSON_TEMPLATES 
} from '../../../utils/jsonUtils';

type ActiveTab = 'editor' | 'tree' | 'yaml' | 'csv';

export const JsonStudio: React.FC = () => {
  const [inputJson, setInputJson] = useState<string>(
    JSON.stringify(SAMPLE_JSON_TEMPLATES.userProfile, null, 2)
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>('editor');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Validate JSON on the fly
  const validation = useMemo(() => {
    return validateJson(inputJson);
  }, [inputJson]);

  // Formatted JSON string
  const formattedJson = useMemo(() => {
    if (!validation.isValid || !inputJson.trim()) return '';
    try {
      return prettifyJson(inputJson, indentSize);
    } catch {
      return '';
    }
  }, [inputJson, indentSize, validation.isValid]);

  // Parsed Object for Tree View
  const parsedData = useMemo(() => {
    if (!validation.isValid || !inputJson.trim()) return null;
    try {
      return JSON.parse(inputJson);
    } catch {
      return null;
    }
  }, [inputJson, validation.isValid]);

  // Converted YAML
  const yamlOutput = useMemo(() => {
    if (!validation.isValid || !inputJson.trim()) return '';
    try {
      return jsonToYaml(inputJson);
    } catch {
      return '';
    }
  }, [inputJson, validation.isValid]);

  // Converted CSV
  const csvOutput = useMemo(() => {
    if (!validation.isValid || !inputJson.trim()) return '';
    try {
      return jsonToCsv(inputJson);
    } catch {
      return '';
    }
  }, [inputJson, validation.isValid]);

  const handlePrettify = () => {
    if (!validation.isValid) return;
    try {
      const output = prettifyJson(inputJson, indentSize);
      setInputJson(output);
      setStatusMessage('JSON formatted successfully!');
      setTimeout(() => setStatusMessage(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMinify = () => {
    if (!validation.isValid) return;
    try {
      const output = minifyJson(inputJson);
      setInputJson(output);
      setStatusMessage('JSON minified!');
      setTimeout(() => setStatusMessage(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRepair = () => {
    try {
      const repaired = repairJson(inputJson);
      setInputJson(repaired);
      setStatusMessage('JSON syntax repaired!');
      setTimeout(() => setStatusMessage(null), 2000);
    } catch {
      setStatusMessage('Could not repair JSON syntax. Check for major syntax flaws.');
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleCopy = (contentToCopy: string) => {
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadSample = (templateKey: keyof typeof SAMPLE_JSON_TEMPLATES) => {
    setInputJson(JSON.stringify(SAMPLE_JSON_TEMPLATES[templateKey], null, 2));
    setStatusMessage(`Loaded ${templateKey} sample`);
    setTimeout(() => setStatusMessage(null), 2000);
  };

  return (
    <>
      <ToolPageHeader title="JSON Studio & Formatter" category="Developer Tools" />

      <main className="container" style={{ paddingBottom: '3rem' }}>
        {/* Controls Toolbar */}
        <div className="tools-controls" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`filter-btn ${activeTab === 'editor' ? 'active' : ''}`}
              onClick={() => setActiveTab('editor')}
            >
              <Code2 size={15} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} />
              Formatter & Editor
            </button>

            <button
              type="button"
              className={`filter-btn ${activeTab === 'tree' ? 'active' : ''}`}
              onClick={() => setActiveTab('tree')}
              disabled={!validation.isValid}
            >
              <ListTree size={15} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} />
              Tree Inspector
            </button>

            <button
              type="button"
              className={`filter-btn ${activeTab === 'yaml' ? 'active' : ''}`}
              onClick={() => setActiveTab('yaml')}
              disabled={!validation.isValid}
            >
              <FileCode size={15} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} />
              JSON → YAML
            </button>

            <button
              type="button"
              className={`filter-btn ${activeTab === 'csv' ? 'active' : ''}`}
              onClick={() => setActiveTab('csv')}
              disabled={!validation.isValid}
            >
              <FileText size={15} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} />
              JSON → CSV
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="cta-button primary"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
              onClick={handlePrettify}
              disabled={!validation.isValid}
            >
              <Sparkles size={14} />
              Format
            </button>

            <button
              type="button"
              className="secondary-action"
              style={{ border: '1px solid var(--border-subtle)' }}
              onClick={handleMinify}
              disabled={!validation.isValid}
            >
              Minify
            </button>

            <button
              type="button"
              className="secondary-action"
              style={{ border: '1px solid var(--border-subtle)', color: 'var(--brand-primary)' }}
              onClick={handleRepair}
              title="Fix trailing commas, single quotes, unquoted keys"
            >
              <Wrench size={14} />
              Auto-Repair
            </button>
          </div>
        </div>

        {/* Status Alert Banner */}
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            {validation.isValid ? (
              <div className="status-badge available" style={{ fontSize: '0.825rem' }}>
                <CheckCircle2 size={14} />
                <span>Valid JSON Syntax</span>
              </div>
            ) : (
              <div className="status-badge coming-soon" style={{ fontSize: '0.825rem', backgroundColor: 'rgba(244, 63, 94, 0.12)', color: '#F43F5E', borderColor: 'rgba(244, 63, 94, 0.25)' }}>
                <AlertTriangle size={14} />
                <span>
                  Syntax Error {validation.line ? `at line ${validation.line}, col ${validation.column}` : ''}: {validation.error}
                </span>
              </div>
            )}
          </div>

          {statusMessage && (
            <span style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
              {statusMessage}
            </span>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Samples:</span>
            <button type="button" className="tag-pill" onClick={() => loadSample('userProfile')}>
              User Profile
            </button>
            <button type="button" className="tag-pill" onClick={() => loadSample('apiResponse')}>
              API Response
            </button>
          </div>
        </div>

        {/* Active View */}
        {activeTab === 'editor' && (
          <div className="tools-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
            {/* Left Pane: Input Editor */}
            <div className="tool-card" style={{ padding: '1.25rem', height: '620px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Input JSON
                </span>
                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => setInputJson('')}
                  title="Clear input"
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                >
                  <Trash2 size={13} />
                  Clear
                </button>
              </div>

              <textarea
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
                placeholder="Paste or type JSON here..."
                style={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  padding: '1rem',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </div>

            {/* Right Pane: Formatted Output */}
            <div className="tool-card" style={{ padding: '1.25rem', height: '620px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Formatted Preview
                  </span>
                  <select
                    value={indentSize}
                    onChange={(e) => setIndentSize(Number(e.target.value))}
                    style={{
                      backgroundColor: 'var(--bg-pill)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.15rem 0.4rem',
                      fontSize: '0.75rem',
                      fontFamily: 'inherit'
                    }}
                  >
                    <option value={2}>2 Spaces</option>
                    <option value={4}>4 Spaces</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="secondary-action"
                    onClick={() => handleCopy(formattedJson)}
                    disabled={!validation.isValid}
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                  >
                    {copied ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>

                  <button
                    type="button"
                    className="secondary-action"
                    onClick={() => handleDownload(formattedJson, 'formatted.json', 'application/json')}
                    disabled={!validation.isValid}
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                  >
                    <Download size={13} />
                    Save
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                value={formattedJson}
                placeholder="Formatted JSON will appear here..."
                style={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  padding: '1rem',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'tree' && (
          <div>
            {parsedData ? (
              <JsonTreeViewer data={parsedData} />
            ) : (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem' }}>
                Please provide valid JSON input to view the interactive tree structure.
              </p>
            )}
          </div>
        )}

        {activeTab === 'yaml' && (
          <div className="tool-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Converted YAML Output</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => handleCopy(yamlOutput)}
                >
                  {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                  Copy YAML
                </button>
                <button
                  type="button"
                  className="cta-button primary"
                  onClick={() => handleDownload(yamlOutput, 'data.yaml', 'text/yaml')}
                >
                  <Download size={14} />
                  Download .yaml
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={yamlOutput}
              style={{
                width: '100%',
                height: '450px',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                padding: '1rem'
              }}
            />
          </div>
        )}

        {activeTab === 'csv' && (
          <div className="tool-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Converted CSV Output</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => handleCopy(csvOutput)}
                >
                  {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                  Copy CSV
                </button>
                <button
                  type="button"
                  className="cta-button primary"
                  onClick={() => handleDownload(csvOutput, 'data.csv', 'text/csv')}
                >
                  <Download size={14} />
                  Download .csv
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={csvOutput}
              style={{
                width: '100%',
                height: '450px',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                padding: '1rem'
              }}
            />
          </div>
        )}
      </main>
    </>
  );
};

export default JsonStudio;
