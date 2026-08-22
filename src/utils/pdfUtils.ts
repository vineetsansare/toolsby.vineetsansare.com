import { PDFDocument, degrees } from 'pdf-lib';

export type CompressionLevel = 'extreme' | 'recommended' | 'less';

export interface CompressPdfResult {
  data: Uint8Array;
  originalSize: number;
  compressedSize: number;
  savingsPercentage: number;
}

/**
 * Merges multiple PDF ArrayBuffers into a single compiled PDF Uint8Array.
 */
export async function mergePdfs(pdfBuffers: ArrayBuffer[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const buffer of pdfBuffers) {
    const pdf = await PDFDocument.load(buffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach(page => mergedPdf.addPage(page));
  }

  return await mergedPdf.save({ useObjectStreams: true });
}

/**
 * Extracts specified 0-indexed page indices into a new PDF document.
 */
export async function extractPdfPages(
  pdfBuffer: ArrayBuffer, 
  pageIndices: number[]
): Promise<Uint8Array> {
  const srcPdf = await PDFDocument.load(pdfBuffer);
  const newPdf = await PDFDocument.create();

  const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
  copiedPages.forEach(page => newPdf.addPage(page));

  return await newPdf.save({ useObjectStreams: true });
}

/**
 * Rotates pages by specified degrees (90, 180, 270).
 */
export async function rotatePdfPages(
  pdfBuffer: ArrayBuffer, 
  rotationAngle: number,
  pageIndices?: number[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pages = pdfDoc.getPages();

  const targetIndices = pageIndices || pages.map((_, i) => i);

  targetIndices.forEach(idx => {
    if (pages[idx]) {
      const currentRotation = pages[idx].getRotation().angle;
      pages[idx].setRotation(degrees((currentRotation + rotationAngle) % 360));
    }
  });

  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * Converts multiple JPG / PNG image buffers into a compiled PDF.
 */
export async function imagesToPdf(
  images: { data: ArrayBuffer; type: 'png' | 'jpeg' }[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const imgItem of images) {
    let embeddedImg;
    if (imgItem.type === 'png') {
      embeddedImg = await pdfDoc.embedPng(imgItem.data);
    } else {
      embeddedImg = await pdfDoc.embedJpg(imgItem.data);
    }

    const page = pdfDoc.addPage([embeddedImg.width, embeddedImg.height]);
    page.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: embeddedImg.width,
      height: embeddedImg.height
    });
  }

  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * Compresses a PDF document client-side using object stream optimization
 * and structural overhead stripping.
 */
export async function compressPdf(
  pdfBuffer: ArrayBuffer,
  level: CompressionLevel = 'recommended'
): Promise<CompressPdfResult> {
  const originalSize = pdfBuffer.byteLength;
  const srcDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });

  const compressedDoc = await PDFDocument.create();

  if (level === 'extreme' || level === 'recommended') {
    compressedDoc.setTitle('');
    compressedDoc.setAuthor('');
    compressedDoc.setSubject('');
    compressedDoc.setKeywords([]);
    compressedDoc.setProducer('Tools by Vineet — PDFHub');
    compressedDoc.setCreator('PDFHub Client-Side Compressor');
  }

  const pageIndices = srcDoc.getPageIndices();
  const copiedPages = await compressedDoc.copyPages(srcDoc, pageIndices);
  copiedPages.forEach(page => compressedDoc.addPage(page));

  const compressedBytes = await compressedDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 50
  });

  const compressedSize = compressedBytes.byteLength;
  let savingsPercentage = 0;

  if (originalSize > 0) {
    const rawSavings = ((originalSize - compressedSize) / originalSize) * 100;
    savingsPercentage = Math.max(0, Math.round(rawSavings));
  }

  return {
    data: compressedBytes,
    originalSize,
    compressedSize,
    savingsPercentage
  };
}

/**
 * Returns total page count of a PDF ArrayBuffer.
 */
export async function getPdfPageCount(pdfBuffer: ArrayBuffer): Promise<number> {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  return pdfDoc.getPageCount();
}
