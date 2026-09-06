import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Download, 
  Sparkles, 
  ZoomIn, 
  Palette, 
  RefreshCw, 
  Sliders, 
  Image as ImageIcon 
} from 'lucide-react';
import { ToolPageHeader } from '../../ToolPageHeader';
import { 
  drawProfileFrame, 
  FrameOptions, 
  PRESET_BADGES, 
  GRADIENT_PRESETS 
} from '../../../utils/frameCanvasUtils';

export const DisplayPicFrameMaker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Frame Customization Options State
  const [options, setOptions] = useState<FrameOptions>({
    arcText: '#OPENTOWORK',
    arcColor: '#10B981',
    textColor: '#FFFFFF',
    badgeStyle: 'gradient',
    gradientPreset: 'Emerald',
    zoom: 1.0,
    offsetX: 0,
    offsetY: 0,
    borderWidth: 4,
    borderColor: '#10B981',
    showOuterRing: true
  });

  // Re-render canvas whenever options or image change
  useEffect(() => {
    if (canvasRef.current) {
      drawProfileFrame(canvasRef.current, imageObj, options, 800);
    }
  }, [imageObj, options]);

  // Handle Photo Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Calculate initial zoom to fit cover
        const minDim = Math.min(img.width, img.height);
        const initialZoom = 400 / minDim;
        setImageObj(img);
        setOptions(prev => ({
          ...prev,
          zoom: parseFloat(initialZoom.toFixed(2)),
          offsetX: 0,
          offsetY: 0
        }));
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle High-Res PNG Download
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `profile_frame_${options.arcText.replace(/[^a-zA-Z0-9]/g, '_') || 'custom'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Reset zoom & pan
  const handleResetPosition = () => {
    if (!imageObj) {
      setOptions(prev => ({ ...prev, zoom: 1.0, offsetX: 0, offsetY: 0 }));
      return;
    }
    const minDim = Math.min(imageObj.width, imageObj.height);
    const initialZoom = 400 / minDim;
    setOptions(prev => ({
      ...prev,
      zoom: parseFloat(initialZoom.toFixed(2)),
      offsetX: 0,
      offsetY: 0
    }));
  };

  return (
    <>
      <ToolPageHeader title="Display Picture Frame Maker" category="Utilities" />

      <main className="container" style={{ paddingBottom: '3rem' }}>
        
        {/* Preset Badge Chips Bar */}
        <div className="tools-controls" style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={16} color="var(--brand-primary)" />
            <span>Preset Badges:</span>
          </span>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {PRESET_BADGES.map(badge => (
              <button
                key={badge}
                type="button"
                className={`filter-btn ${options.arcText === badge ? 'active' : ''}`}
                onClick={() => setOptions(prev => ({ ...prev, arcText: badge }))}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
              >
                {badge}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Controls Left | Live Canvas Preview Right */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)', gap: '1.5rem' }}>
          
          {/* LEFT COLUMN: Customization Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* 1. Upload Photo Card */}
            <div className="tool-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ImageIcon size={18} color="var(--brand-primary)" />
                  <span>1. Upload Profile Photo</span>
                </h3>

                {fileName && (
                  <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                    Loaded
                  </span>
                )}
              </div>

              <div style={{
                position: 'relative',
                border: '2px dashed var(--border-card-hover)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem 1rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-pill)',
                cursor: 'pointer'
              }}>
                <Upload size={28} style={{ color: 'var(--brand-primary)', marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                  {fileName ? fileName : 'Click to Upload Profile Photo'}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  Supports PNG, JPG, WebP up to 10MB
                </p>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageUpload}
                  style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', top: 0, left: 0, cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* 2. Arc Badge & Text Settings */}
            <div className="tool-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Palette size={18} color="var(--brand-primary)" />
                <span>2. Arc Badge & Text Customization</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Arc Text Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Badge Text (Curved Arc Text):
                  </label>
                  <input
                    type="text"
                    className="search-input"
                    value={options.arcText}
                    onChange={e => setOptions(prev => ({ ...prev, arcText: e.target.value }))}
                    placeholder="e.g. #OPENTOWORK, #HIRING..."
                    style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '0.75rem' }}
                  />
                </div>

                {/* Badge Style Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Badge Fill Style:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                    {(['gradient', 'solid', 'outline'] as const).map(style => (
                      <button
                        key={style}
                        type="button"
                        className={`filter-btn ${options.badgeStyle === style ? 'active' : ''}`}
                        onClick={() => setOptions(prev => ({ ...prev, badgeStyle: style }))}
                        style={{ padding: '0.35rem 0.2rem', fontSize: '0.78rem', textTransform: 'capitalize' }}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gradient Preset Selection */}
                {options.badgeStyle === 'gradient' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Gradient Preset:
                    </label>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {GRADIENT_PRESETS.map(g => (
                        <button
                          key={g.name}
                          type="button"
                          className={`filter-btn ${options.gradientPreset === g.name ? 'active' : ''}`}
                          onClick={() => setOptions(prev => ({ ...prev, gradientPreset: g.name }))}
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        >
                          {g.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Solid Colors */}
                {options.badgeStyle === 'solid' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                        Badge Color:
                      </label>
                      <input
                        type="color"
                        value={options.arcColor}
                        onChange={e => setOptions(prev => ({ ...prev, arcColor: e.target.value }))}
                        style={{ width: '100%', height: '36px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                        Text Color:
                      </label>
                      <input
                        type="color"
                        value={options.textColor}
                        onChange={e => setOptions(prev => ({ ...prev, textColor: e.target.value }))}
                        style={{ width: '100%', height: '36px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
                      />
                    </div>
                  </div>
                )}

                {/* Outer Ring Border */}
                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                      Show Outer Ring Border
                    </label>
                    <input
                      type="checkbox"
                      checked={options.showOuterRing}
                      onChange={e => setOptions(prev => ({ ...prev, showOuterRing: e.target.checked }))}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>

                  {options.showOuterRing && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                          Border Width: {options.borderWidth}px
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="12"
                          value={options.borderWidth}
                          onChange={e => setOptions(prev => ({ ...prev, borderWidth: parseInt(e.target.value) }))}
                          style={{ width: '100%', cursor: 'pointer' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                          Border Color:
                        </label>
                        <input
                          type="color"
                          value={options.borderColor}
                          onChange={e => setOptions(prev => ({ ...prev, borderColor: e.target.value }))}
                          style={{ width: '100%', height: '30px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* 3. Photo Zoom & Alignment */}
            <div className="tool-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sliders size={18} color="var(--brand-primary)" />
                  <span>3. Image Zoom & Alignment</span>
                </h3>

                <button
                  type="button"
                  className="secondary-action"
                  onClick={handleResetPosition}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  <RefreshCw size={13} />
                  <span>Reset</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Zoom Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <ZoomIn size={14} color="var(--brand-primary)" />
                      <span>Zoom Level:</span>
                    </span>
                    <span>{options.zoom.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="4.0"
                    step="0.05"
                    value={options.zoom}
                    onChange={e => setOptions(prev => ({ ...prev, zoom: parseFloat(e.target.value) }))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>

                {/* X & Y Offsets */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem', color: 'var(--text-secondary)' }}>
                      Horizontal Pan (X): {options.offsetX}px
                    </label>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={options.offsetX}
                      onChange={e => setOptions(prev => ({ ...prev, offsetX: parseInt(e.target.value) }))}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem', color: 'var(--text-secondary)' }}>
                      Vertical Pan (Y): {options.offsetY}px
                    </label>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={options.offsetY}
                      onChange={e => setOptions(prev => ({ ...prev, offsetY: parseInt(e.target.value) }))}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Live Canvas Preview & Download */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div className="tool-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Live Profile Frame Preview
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  High-res HTML5 Canvas Preview (800x800 px)
                </p>
              </div>

              {/* Canvas Container */}
              <div style={{
                display: 'inline-block',
                padding: '1rem',
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                marginBottom: '1.5rem'
              }}>
                <canvas
                  ref={canvasRef}
                  style={{
                    width: '320px',
                    height: '320px',
                    borderRadius: '50%',
                    display: 'block',
                    backgroundColor: '#E5E7EB'
                  }}
                />
              </div>

              {/* High-Res Download Button */}
              <button
                type="button"
                className="cta-button primary"
                onClick={handleDownload}
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
              >
                <Download size={20} />
                <span>Download High-Res Profile Frame (800x800 PNG)</span>
              </button>
            </div>

            {/* Platform Usage Info */}
            <div className="tool-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--brand-primary)' }}>
                ✨ Perfect for All Professional Platforms
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Download your square PNG and set it directly as your profile picture on <strong>LinkedIn</strong>, <strong>Twitter/X</strong>, <strong>WhatsApp</strong>, <strong>GitHub</strong>, and <strong>Slack</strong>. The circular arc badge aligns perfectly within circular avatar viewports!
              </p>
            </div>

          </div>

        </div>
      </main>
    </>
  );
};

export default DisplayPicFrameMaker;
