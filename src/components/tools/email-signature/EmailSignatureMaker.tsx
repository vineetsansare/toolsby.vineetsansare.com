import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  User, 
  Image as ImageIcon, 
  Share2, 
  Palette, 
  Zap, 
  Code, 
  HelpCircle
} from 'lucide-react';
import { ToolPageHeader } from '../../ToolPageHeader';
import { 
  SignatureData, 
  DEFAULT_SIGNATURE_DATA, 
  TEMPLATE_PRESETS, 
  FONT_OPTIONS, 
  THEME_COLOR_SWATCHES, 
  generateSignatureHtml 
} from '../../../utils/signatureTemplates';

export const EmailSignatureMaker: React.FC = () => {
  const [data, setData] = useState<SignatureData>(DEFAULT_SIGNATURE_DATA);
  const [activeTab, setActiveTab] = useState<'personal' | 'images' | 'social' | 'style' | 'extras'>('personal');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [showHtmlCode, setShowHtmlCode] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const signatureHtml = generateSignatureHtml(data);

  // Copy Formatted Signature (Rich Text for Gmail / Outlook)
  const handleCopyRichText = async () => {
    try {
      const blobHtml = new Blob([signatureHtml], { type: 'text/html' });
      const blobText = new Blob([previewRef.current?.innerText || signatureHtml], { type: 'text/plain' });
      const clipboardItem = new ClipboardItem({
        'text/html': blobHtml,
        'text/plain': blobText
      });
      await navigator.clipboard.write([clipboardItem]);
      setCopiedType('rich');
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      console.error('Rich text copy failed, falling back to plain HTML', err);
      navigator.clipboard.writeText(signatureHtml);
      setCopiedType('rich');
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  // Copy Raw HTML Code
  const handleCopyHtml = () => {
    navigator.clipboard.writeText(signatureHtml);
    setCopiedType('html');
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Download HTML File
  const handleDownloadHtml = () => {
    const blob = new Blob([signatureHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email_signature_${data.fullName.toLowerCase().replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setData(prev => ({ ...prev, avatarUrl: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <ToolPageHeader title="Email Signature Maker" category="Utilities" />

      <main className="container" style={{ paddingBottom: '3rem' }}>
        
        {/* Preset Templates Selector Bar */}
        <div className="tools-controls" style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={16} style={{ color: 'var(--brand-primary)' }} />
            <span>Signature Templates:</span>
          </span>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {TEMPLATE_PRESETS.map(preset => (
              <button
                key={preset.id}
                type="button"
                className={`filter-btn ${data.templateId === preset.id ? 'active' : ''}`}
                onClick={() => setData(prev => ({ ...prev, templateId: preset.id as any }))}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main 2-Column Responsive Layout */}
        <div className="frame-maker-layout">
          
          {/* LEFT COLUMN: Editor Tabbed Panels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div className="tool-card" style={{ padding: '1.25rem' }}>
              {/* Category Navigation Tabs */}
              <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  className={`filter-btn ${activeTab === 'personal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('personal')}
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem', whiteSpace: 'nowrap' }}
                >
                  <User size={13} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
                  Personal Info
                </button>

                <button
                  type="button"
                  className={`filter-btn ${activeTab === 'images' ? 'active' : ''}`}
                  onClick={() => setActiveTab('images')}
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem', whiteSpace: 'nowrap' }}
                >
                  <ImageIcon size={13} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
                  Photo & Avatar
                </button>

                <button
                  type="button"
                  className={`filter-btn ${activeTab === 'social' ? 'active' : ''}`}
                  onClick={() => setActiveTab('social')}
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem', whiteSpace: 'nowrap' }}
                >
                  <Share2 size={13} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
                  Social Links
                </button>

                <button
                  type="button"
                  className={`filter-btn ${activeTab === 'style' ? 'active' : ''}`}
                  onClick={() => setActiveTab('style')}
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem', whiteSpace: 'nowrap' }}
                >
                  <Palette size={13} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
                  Style & Colors
                </button>

                <button
                  type="button"
                  className={`filter-btn ${activeTab === 'extras' ? 'active' : ''}`}
                  onClick={() => setActiveTab('extras')}
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem', whiteSpace: 'nowrap' }}
                >
                  <Zap size={13} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
                  CTA & Legal
                </button>
              </div>

              {/* TAB 1: Personal Info */}
              {activeTab === 'personal' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Full Name:
                      </label>
                      <input
                        type="text"
                        className="search-input"
                        value={data.fullName}
                        onChange={e => setData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="e.g. Jane Doe"
                        style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '0.65rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Job Title:
                      </label>
                      <input
                        type="text"
                        className="search-input"
                        value={data.jobTitle}
                        onChange={e => setData(prev => ({ ...prev, jobTitle: e.target.value }))}
                        placeholder="e.g. Lead Designer"
                        style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '0.65rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Company Name:
                      </label>
                      <input
                        type="text"
                        className="search-input"
                        value={data.companyName}
                        onChange={e => setData(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="e.g. Acme Corp"
                        style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '0.65rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Department:
                      </label>
                      <input
                        type="text"
                        className="search-input"
                        value={data.department}
                        onChange={e => setData(prev => ({ ...prev, department: e.target.value }))}
                        placeholder="e.g. Engineering"
                        style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '0.65rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Email Address:
                      </label>
                      <input
                        type="email"
                        className="search-input"
                        value={data.email}
                        onChange={e => setData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="e.g. jane@acme.com"
                        style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '0.65rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Phone Number:
                      </label>
                      <input
                        type="text"
                        className="search-input"
                        value={data.phone}
                        onChange={e => setData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="e.g. +1 (555) 019-2834"
                        style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '0.65rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Website URL:
                      </label>
                      <input
                        type="text"
                        className="search-input"
                        value={data.website}
                        onChange={e => setData(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://example.com"
                        style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '0.65rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Location / Address:
                      </label>
                      <input
                        type="text"
                        className="search-input"
                        value={data.address}
                        onChange={e => setData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="e.g. San Francisco, CA"
                        style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '0.65rem' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Photo & Avatar */}
              {activeTab === 'images' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Profile Photo / Avatar Image:
                    </label>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        className="search-input"
                        value={data.avatarUrl}
                        onChange={e => setData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                        placeholder="Paste image URL (https://...)"
                        style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '0.65rem', flex: 1 }}
                      />

                      <label className="secondary-action" style={{ cursor: 'pointer', fontSize: '0.75rem', padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <ImageIcon size={14} />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Avatar Shape:
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
                        {(['circle', 'rounded', 'square'] as const).map(shape => (
                          <button
                            key={shape}
                            type="button"
                            className={`filter-btn ${data.avatarShape === shape ? 'active' : ''}`}
                            onClick={() => setData(prev => ({ ...prev, avatarShape: shape }))}
                            style={{ padding: '0.3rem 0.2rem', fontSize: '0.75rem', textTransform: 'capitalize' }}
                          >
                            {shape}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Avatar Size ({data.avatarSize}px):
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="140"
                        value={data.avatarSize}
                        onChange={e => setData(prev => ({ ...prev, avatarSize: parseInt(e.target.value) }))}
                        style={{ width: '100%', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Social Links */}
              {activeTab === 'social' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      LinkedIn Profile URL:
                    </label>
                    <input
                      type="text"
                      className="search-input"
                      value={data.linkedin}
                      onChange={e => setData(prev => ({ ...prev, linkedin: e.target.value }))}
                      placeholder="https://linkedin.com/in/username"
                      style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '0.65rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      X (Twitter) Profile URL:
                    </label>
                    <input
                      type="text"
                      className="search-input"
                      value={data.twitter}
                      onChange={e => setData(prev => ({ ...prev, twitter: e.target.value }))}
                      placeholder="https://x.com/username"
                      style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '0.65rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      GitHub Profile URL:
                    </label>
                    <input
                      type="text"
                      className="search-input"
                      value={data.github}
                      onChange={e => setData(prev => ({ ...prev, github: e.target.value }))}
                      placeholder="https://github.com/username"
                      style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '0.65rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      Instagram Profile URL:
                    </label>
                    <input
                      type="text"
                      className="search-input"
                      value={data.instagram}
                      onChange={e => setData(prev => ({ ...prev, instagram: e.target.value }))}
                      placeholder="https://instagram.com/username"
                      style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '0.65rem' }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: Styles & Colors */}
              {activeTab === 'style' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Primary Brand Color:
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        {THEME_COLOR_SWATCHES.map(color => (
                          <div
                            key={color}
                            onClick={() => setData(prev => ({ ...prev, themeColor: color }))}
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              backgroundColor: color,
                              cursor: 'pointer',
                              border: data.themeColor === color ? '2px solid var(--text-primary)' : '2px solid transparent'
                            }}
                          />
                        ))}
                      </div>

                      <input
                        type="color"
                        value={data.themeColor}
                        onChange={e => setData(prev => ({ ...prev, themeColor: e.target.value }))}
                        style={{ width: '36px', height: '28px', borderRadius: '4px', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Font Family:
                      </label>
                      <select
                        className="search-input"
                        value={data.fontFamily}
                        onChange={e => setData(prev => ({ ...prev, fontFamily: e.target.value }))}
                        style={{ width: '100%', borderRadius: 'var(--radius-sm)', paddingLeft: '0.65rem' }}
                      >
                        {FONT_OPTIONS.map(f => (
                          <option key={f.value} value={f.value}>{f.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Font Size:
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
                        {(['small', 'normal', 'large'] as const).map(size => (
                          <button
                            key={size}
                            type="button"
                            className={`filter-btn ${data.fontSize === size ? 'active' : ''}`}
                            onClick={() => setData(prev => ({ ...prev, fontSize: size }))}
                            style={{ padding: '0.3rem 0.2rem', fontSize: '0.75rem', textTransform: 'capitalize' }}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: CTA & Legal Disclaimer */}
              {activeTab === 'extras' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      Call-To-Action (CTA) Button Text:
                    </label>
                    <input
                      type="text"
                      className="search-input"
                      value={data.ctaText}
                      onChange={e => setData(prev => ({ ...prev, ctaText: e.target.value }))}
                      placeholder="e.g. 📅 Schedule a Meeting"
                      style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '0.65rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      CTA Button Link URL:
                    </label>
                    <input
                      type="text"
                      className="search-input"
                      value={data.ctaUrl}
                      onChange={e => setData(prev => ({ ...prev, ctaUrl: e.target.value }))}
                      placeholder="https://calendly.com/your-name"
                      style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '0.65rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      Legal Confidentiality Disclaimer:
                    </label>
                    <textarea
                      className="search-input"
                      rows={3}
                      value={data.disclaimer}
                      onChange={e => setData(prev => ({ ...prev, disclaimer: e.target.value }))}
                      placeholder="Enter legal disclaimer or confidentiality notice..."
                      style={{ width: '100%', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.65rem' }}
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Live Formatted Signature Preview & 1-Click Copy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
            
            <div className="tool-card" style={{ padding: '1.5rem', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Live Email Signature Preview
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                    Rich Text Output Ready for Gmail, Outlook, & Apple Mail
                  </p>
                </div>

                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => setShowHtmlCode(!showHtmlCode)}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Code size={14} />
                  <span>{showHtmlCode ? 'Show Visual' : 'View HTML'}</span>
                </button>
              </div>

              {/* Live Render Container */}
              {!showHtmlCode ? (
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  minHeight: '160px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  marginBottom: '1.25rem',
                  overflowX: 'auto'
                }}>
                  <div ref={previewRef} dangerouslySetInnerHTML={{ __html: signatureHtml }} />
                </div>
              ) : (
                <pre style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.78rem',
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                  lineHeight: '1.45',
                  maxHeight: '260px',
                  marginBottom: '1.25rem'
                }}>
                  {signatureHtml}
                </pre>
              )}

              {/* Action Buttons: Copy Formatted Signature (Primary) | Copy HTML | Download */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <button
                  type="button"
                  className="cta-button primary"
                  onClick={handleCopyRichText}
                  style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
                >
                  {copiedType === 'rich' ? <Check size={18} /> : <Copy size={18} />}
                  <span>{copiedType === 'rich' ? 'Copied Formatted Signature! Paste in Gmail/Outlook' : 'Copy Formatted Signature (1-Click Paste)'}</span>
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <button
                    type="button"
                    className="secondary-action"
                    onClick={handleCopyHtml}
                    style={{ fontSize: '0.8rem', padding: '0.6rem', justifyContent: 'center' }}
                  >
                    {copiedType === 'html' ? <Check size={15} /> : <Code size={15} />}
                    <span>{copiedType === 'html' ? 'Copied HTML' : 'Copy Raw HTML'}</span>
                  </button>

                  <button
                    type="button"
                    className="secondary-action"
                    onClick={handleDownloadHtml}
                    style={{ fontSize: '0.8rem', padding: '0.6rem', justifyContent: 'center' }}
                  >
                    <Download size={15} />
                    <span>Download .html</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Gmail / Outlook Setup Instructions Card */}
            <div className="tool-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <HelpCircle size={16} />
                <span>How to Add to Gmail or Outlook</span>
              </h4>
              <ol style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', paddingLeft: '1.1rem', lineHeight: '1.55' }}>
                <li>Click <strong>Copy Formatted Signature</strong> above.</li>
                <li>Open <strong>Gmail Settings</strong> $\rightarrow$ <em>See all settings</em> $\rightarrow$ <em>Signature</em> (or Outlook Settings).</li>
                <li>Press <kbd style={{ backgroundColor: 'var(--bg-elevated)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>Cmd + V</kbd> or <kbd style={{ backgroundColor: 'var(--bg-elevated)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>Ctrl + V</kbd> to paste directly!</li>
                <li>Click <strong>Save Changes</strong>. Your signature is live!</li>
              </ol>
            </div>

          </div>

        </div>
      </main>
    </>
  );
};

export default EmailSignatureMaker;
