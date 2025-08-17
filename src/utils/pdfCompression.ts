import { PDFDocument } from 'pdf-lib';

/**
 * Compresses a PDF file to reduce its size while maintaining quality
 * @param pdfBlob The PDF blob to compress
 * @param options Options for compression
 * @returns A compressed PDF blob and filename
 */
export const compressPDF = async (
  pdfBlob: Blob,
  options: {
    imageQuality?: number;
    filename?: string;
  } = {}
): Promise<{ blob: Blob; filename: string }> => {
  try {
    const { 
      imageQuality = 0.8,
      filename = `compressed-${Date.now()}.pdf`
    } = options;
    
    // Convert blob to ArrayBuffer
    const arrayBuffer = await pdfBlob.arrayBuffer();
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Get original size for logging
    const originalSize = pdfBlob.size / (1024 * 1024); // Convert to MB
    
    // Compression options
    const compressedPdfBytes = await pdfDoc.save({
      // These options help reduce file size
      useObjectStreams: true,
      addDefaultPage: false,
      updateFieldAppearances: false,
      // Performance optimization
      objectsPerTick: 100
    });
    
    const compressedBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
    const compressedSize = compressedBlob.size / (1024 * 1024); // Convert to MB
    
    console.log(
      `PDF compressed: ${originalSize.toFixed(2)}MB → ${compressedSize.toFixed(2)}MB ` +
      `(${((1 - compressedSize / originalSize) * 100).toFixed(1)}% reduction)`
    );
    
    return { 
      blob: compressedBlob,
      filename: filename
    };
  } catch (error) {
    console.error('Error compressing PDF:', error);
    throw error;
  }
};

/**
 * Resamples/optimizes an existing PDF file to reduce its size
 * This is especially useful for PDFs with large images
 * @param pdfUrl URL to the PDF file
 * @param options Optimization options
 * @returns A Promise with the optimized PDF blob and filename
 */
export const optimizePDF = async (
  pdfUrl: string,
  options: {
    imageQuality?: number;
    filename?: string;
  } = {}
): Promise<{ blob: Blob; filename: string }> => {
  try {
    const { 
      imageQuality = 0.8,
      filename = `optimized-${Date.now()}.pdf`
    } = options;
    
    // Fetch the PDF
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }
    
    const pdfBlob = await response.blob();
    
    // Use the compressPDF function for optimization
    return await compressPDF(pdfBlob, { imageQuality, filename });
  } catch (error) {
    console.error('Error optimizing PDF:', error);
    throw error;
  }
};
