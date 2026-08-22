import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  RotateCw, 
  Scissors, 
  Layers, 
  Image as ImageIcon, 
  Trash2, 
  FileText
} from 'lucide-react';
import { ToolPageHeader } from '../../ToolPageHeader';
import { 
  mergePdfs, 
  extractPdfPages, 
  rotatePdfPages, 
  imagesToPdf, 
  getPdfPageCount 
} from '../../../utils/pdfUtils';

type PdfToolTab = 'merge' | 'split' | 'rotate' | 'imgToPdf';

interface PdfFileItem {
  id: string;
  file: File;
  pageCount?: number;
  buffer?: ArrayBuffer;
}

export const PdfHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PdfToolTab>('merge');
  
  // Merge State
  const [mergeFiles, setMergeFiles] = useState<PdfFileItem[]>([]);
  
  // Split State
  const [splitFile, setSplitFile] = useState<PdfFileItem | null>(null);
  const [pageRange, setPageRange] = useState<string>('1');

  // Rotate State
  const [rotateFile, setRotateFile] = useState<PdfFileItem | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(90);

  // Images to PDF State
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // Processing & Status State
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Helper to trigger browser download
  const downloadBlob = (data: Uint8Array, filename: string) => {
    const blob = new Blob([data as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- Handlers for Merge PDF ---
  const handleMergeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    
    const newItems: PdfFileItem[] = [];
    for (const file of selectedFiles) {
      const buffer = await file.arrayBuffer();
      const pageCount = await getPdfPageCount(buffer);
      newItems.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        buffer,
        pageCount
      });
    }
    setMergeFiles(prev => [...prev, ...newItems]);
  };

  const handleExecuteMerge = async () => {
    if (mergeFiles.length < 2) return;
    setIsProcessing(true);
    try {
      const buffers = mergeFiles.map(item => item.buffer!).filter(Boolean);
      const mergedBytes = await mergePdfs(buffers);
      downloadBlob(mergedBytes, 'merged_document.pdf');
      setStatusMessage('PDFs merged successfully!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setStatusMessage('Failed to merge PDFs. Please verify files are valid PDFs.');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Handlers for Split / Extract ---
  const handleSplitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const buffer = await file.arrayBuffer();
    const pageCount = await getPdfPageCount(buffer);
    setSplitFile({
      id: 'split_pdf',
      file,
      buffer,
      pageCount
    });
    setPageRange(`1-${Math.min(pageCount, 3)}`);
  };

  const handleExecuteSplit = async () => {
    if (!splitFile || !splitFile.buffer) return;
    setIsProcessing(true);
    try {
      const pageIndices: number[] = [];
      const totalPages = splitFile.pageCount || 1;
      
      const parts = pageRange.split(',');
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
          const [start, end] = trimmed.split('-').map(Number);
          if (start && end) {
            for (let p = Math.max(1, start); p <= Math.min(totalPages, end); p++) {
              pageIndices.push(p - 1);
            }
          }
        } else {
          const pageNum = Number(trimmed);
          if (pageNum >= 1 && pageNum <= totalPages) {
            pageIndices.push(pageNum - 1);
          }
        }
      }

      const uniqueIndices = Array.from(new Set(pageIndices)).sort((a, b) => a - b);
      if (uniqueIndices.length === 0) {
        setStatusMessage('Invalid page range specified.');
        setIsProcessing(false);
        return;
      }

      const extractedBytes = await extractPdfPages(splitFile.buffer, uniqueIndices);
      downloadBlob(extractedBytes, `extracted_pages_${pageRange.replace(/[\s,]+/g, '_')}.pdf`);
      setStatusMessage('Pages extracted successfully!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setStatusMessage('Error extracting PDF pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Handlers for Rotate ---
  const handleRotateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const buffer = await file.arrayBuffer();
    const pageCount = await getPdfPageCount(buffer);
    setRotateFile({
      id: 'rotate_pdf',
      file,
      buffer,
      pageCount
    });
  };

  const handleExecuteRotate = async () => {
    if (!rotateFile || !rotateFile.buffer) return;
    setIsProcessing(true);
    try {
      const rotatedBytes = await rotatePdfPages(rotateFile.buffer, rotationAngle);
      downloadBlob(rotatedBytes, `rotated_${rotationAngle}deg_${rotateFile.file.name}`);
      setStatusMessage('PDF rotated successfully!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setStatusMessage('Failed to rotate PDF pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Handlers for Images to PDF ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleExecuteImagesToPdf = async () => {
    if (imageFiles.length === 0) return;
    setIsProcessing(true);
    try {
      const imgItems = [];
      for (const file of imageFiles) {
        const buffer = await file.arrayBuffer();
        const type = file.type.includes('png') ? ('png' as const) : ('jpeg' as const);
        imgItems.push({ data: buffer, type });
      }

      const pdfBytes = await imagesToPdf(imgItems);
      downloadBlob(pdfBytes, 'converted_images.pdf');
      setStatusMessage('Images converted to PDF!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setStatusMessage('Failed to convert images to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <ToolPageHeader title="PDFHub — PDF Utility Suite" category="Utilities" />

      <main className="container" style={{ paddingBottom: '3rem' }}>
        <div className="tools-controls" style={{ marginBottom: '1.5rem' }}>
          <div className="category-filters">
            <button
              type="button"
              className={`filter-btn ${activeTab === 'merge' ? 'active' : ''}`}
              onClick={() => setActiveTab('merge')}
            >
              <Layers size={15} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} />
              Merge PDF
            </button>

            <button
              type="button"
              className={`filter-btn ${activeTab === 'split' ? 'active' : ''}`}
              onClick={() => setActiveTab('split')}
            >
              <Scissors size={15} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} />
              Split & Extract
            </button>

            <button
              type="button"
              className={`filter-btn ${activeTab === 'rotate' ? 'active' : ''}`}
              onClick={() => setActiveTab('rotate')}
            >
              <RotateCw size={15} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} />
              Rotate Pages
            </button>

            <button
              type="button"
              className={`filter-btn ${activeTab === 'imgToPdf' ? 'active' : ''}`}
              onClick={() => setActiveTab('imgToPdf')}
            >
              <ImageIcon size={15} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} />
              Images to PDF
            </button>
          </div>

          {statusMessage && (
            <span style={{ fontSize: '0.875rem', color: '#10B981', fontWeight: 600 }}>
              {statusMessage}
            </span>
          )}
        </div>

        {activeTab === 'merge' && (
          <div className="tool-card" style={{ padding: '1.75rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Merge Multiple PDF Files
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Combine two or more PDF documents into a single compiled PDF file.
              </p>
            </div>

            <div style={{
              position: 'relative',
              border: '2px dashed var(--border-card-hover)',
              borderRadius: 'var(--radius-md)',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-pill)',
              marginBottom: '1.5rem'
            }}>
              <Upload size={32} style={{ color: 'var(--brand-primary)', marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                Click to upload PDF files
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                Select multiple PDFs to merge
              </p>
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleMergeUpload}
                style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', top: 0, left: 0, cursor: 'pointer' }}
              />
            </div>

            {mergeFiles.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Selected Files ({mergeFiles.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {mergeFiles.map((item, index) => (
                    <div 
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FileText size={18} style={{ color: 'var(--brand-primary)' }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                          {index + 1}. {item.file.name}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                          ({item.pageCount} pages)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMergeFiles(prev => prev.filter(i => i.id !== item.id))}
                        style={{ color: '#F43F5E', padding: '0.25rem' }}
                        title="Remove file"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              className="cta-button primary"
              onClick={handleExecuteMerge}
              disabled={mergeFiles.length < 2 || isProcessing}
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <Layers size={18} />
              <span>{isProcessing ? 'Merging PDFs...' : 'Merge PDFs & Download'}</span>
            </button>
          </div>
        )}

        {activeTab === 'split' && (
          <div className="tool-card" style={{ padding: '1.75rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Split PDF / Extract Pages
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Extract specific page numbers or page ranges into a new PDF document.
              </p>
            </div>

            {!splitFile ? (
              <div style={{
                position: 'relative',
                border: '2px dashed var(--border-card-hover)',
                borderRadius: 'var(--radius-md)',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-pill)'
              }}>
                <Upload size={32} style={{ color: 'var(--brand-primary)', marginBottom: '0.75rem' }} />
                <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Upload a PDF to Extract Pages
                </p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleSplitUpload}
                  style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', top: 0, left: 0, cursor: 'pointer' }}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileSpreadsheet size={24} style={{ color: 'var(--brand-primary)' }} />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{splitFile.file.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Total Pages: {splitFile.pageCount}</p>
                    </div>
                  </div>
                  <button type="button" className="secondary-action" onClick={() => setSplitFile(null)}>
                    Choose different file
                  </button>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Pages to Extract (e.g. 1-3, 5):
                  </label>
                  <input
                    type="text"
                    className="search-input"
                    value={pageRange}
                    onChange={e => setPageRange(e.target.value)}
                    placeholder="e.g. 1-3, 5"
                    style={{ borderRadius: 'var(--radius-sm)', paddingLeft: '1rem' }}
                  />
                </div>

                <button
                  type="button"
                  className="cta-button primary"
                  onClick={handleExecuteSplit}
                  disabled={isProcessing}
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  <Scissors size={18} />
                  <span>{isProcessing ? 'Extracting Pages...' : 'Extract & Download PDF'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'rotate' && (
          <div className="tool-card" style={{ padding: '1.75rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Rotate PDF Pages
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Rotate document pages by 90°, 180°, or 270° degrees.
              </p>
            </div>

            {!rotateFile ? (
              <div style={{
                position: 'relative',
                border: '2px dashed var(--border-card-hover)',
                borderRadius: 'var(--radius-md)',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-pill)'
              }}>
                <Upload size={32} style={{ color: 'var(--brand-primary)', marginBottom: '0.75rem' }} />
                <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Upload PDF to Rotate
                </p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleRotateUpload}
                  style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', top: 0, left: 0, cursor: 'pointer' }}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={24} style={{ color: 'var(--brand-primary)' }} />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rotateFile.file.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Total Pages: {rotateFile.pageCount}</p>
                    </div>
                  </div>
                  <button type="button" className="secondary-action" onClick={() => setRotateFile(null)}>
                    Choose different file
                  </button>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Rotation Angle:
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[90, 180, 270].map(angle => (
                      <button
                        key={angle}
                        type="button"
                        className={`filter-btn ${rotationAngle === angle ? 'active' : ''}`}
                        onClick={() => setRotationAngle(angle)}
                      >
                        {angle}° Right
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="cta-button primary"
                  onClick={handleExecuteRotate}
                  disabled={isProcessing}
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  <RotateCw size={18} />
                  <span>{isProcessing ? 'Rotating PDF...' : `Rotate ${rotationAngle}° & Download`}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'imgToPdf' && (
          <div className="tool-card" style={{ padding: '1.75rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Images to PDF Converter
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Convert JPG and PNG images into a single PDF document.
              </p>
            </div>

            <div style={{
              position: 'relative',
              border: '2px dashed var(--border-card-hover)',
              borderRadius: 'var(--radius-md)',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-pill)',
              marginBottom: '1.5rem'
            }}>
              <ImageIcon size={32} style={{ color: 'var(--brand-primary)', marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                Upload Images (JPG, PNG)
              </p>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                multiple
                onChange={handleImageUpload}
                style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', top: 0, left: 0, cursor: 'pointer' }}
              />
            </div>

            {imageFiles.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Images to Include ({imageFiles.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {imageFiles.map((file, idx) => (
                    <div 
                      key={file.name + idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ImageIcon size={18} style={{ color: 'var(--brand-primary)' }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{file.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setImageFiles(prev => prev.filter((_, i) => i !== idx))}
                        style={{ color: '#F43F5E' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              className="cta-button primary"
              onClick={handleExecuteImagesToPdf}
              disabled={imageFiles.length === 0 || isProcessing}
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <Download size={18} />
              <span>{isProcessing ? 'Converting to PDF...' : 'Convert Images to PDF & Download'}</span>
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default PdfHub;
