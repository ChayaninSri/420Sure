
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PDFDocument } from 'pdf-lib';

interface ExportOptions {
  filename?: string;
  quality?: number;
  format?: 'a4' | 'letter';
}

export const exportToPDF = async (
  elementId: string, 
  options: ExportOptions = {}
): Promise<void> => {
  try {
    const {
      filename = `inspection-report-${Date.now()}.pdf`,
      quality = 1.0,
      format = 'a4'
    } = options;

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Ensure fonts are loaded before capturing
    await document.fonts.ready;

    // Wait for images to load
    const images = element.querySelectorAll('img');
    await Promise.all(Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        setTimeout(reject, 10000);
      });
    }));

    // Additional wait to ensure proper rendering
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create canvas from HTML element with higher quality for multi-page content
    const canvas = await html2canvas(element, {
      scale: quality,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 20000,
      removeContainer: false,
      height: element.scrollHeight, // Capture full height for multi-page
      windowWidth: 1200,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Apply font styling to prevent overlapping
          clonedElement.style.fontFamily = '"TH Sarabun New", sans-serif';
          clonedElement.style.fontSize = '14px';
          clonedElement.style.lineHeight = '1.4';
          clonedElement.style.letterSpacing = '0.3px';
          clonedElement.style.wordSpacing = '0.5px';
          
          // Apply to all elements
          const allElements = clonedElement.querySelectorAll('*');
          allElements.forEach(el => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.fontFamily = '"TH Sarabun New", sans-serif';
            htmlEl.style.textRendering = 'optimizeLegibility';
            htmlEl.style.letterSpacing = '0.3px';
            htmlEl.style.wordSpacing = '0.5px';
            htmlEl.style.lineHeight = '1.4';
            (htmlEl.style as any).webkitFontSmoothing = 'antialiased';
            (htmlEl.style as any).mozOsxFontSmoothing = 'grayscale';
          });
        }
      }
    });

    // Check if canvas is valid
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Failed to create canvas from element');
    }

    // Create PDF with proper A4 dimensions
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;
    
    // Calculate how many pages we need based on canvas height
    const pageHeight = (canvas.height * pdfWidth) / canvas.width;
    const totalPages = Math.ceil(pageHeight / pdfHeight);
    
    // Add pages to PDF
    for (let i = 0; i < totalPages; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      
      const yOffset = -(i * pdfHeight);
      pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, pageHeight);
    }
    
    // Save the PDF
    pdf.save(filename);
    
    console.log('PDF exported successfully with', totalPages, 'pages');
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};

export const generatePDFBlob = async (
  elementId: string,
  options: ExportOptions = {}
): Promise<Blob> => {
  try {
    const {
      quality = 1.0,
      format = 'a4'
    } = options;

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Ensure fonts are loaded
    await document.fonts.ready;

    // Wait for images to load
    const images = element.querySelectorAll('img');
    await Promise.all(Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        setTimeout(reject, 10000);
      });
    }));

    // Additional wait for proper rendering
    await new Promise(resolve => setTimeout(resolve, 1000));

    const canvas = await html2canvas(element, {
      scale: quality,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 20000,
      height: element.scrollHeight, // Capture full height for multi-page
      windowWidth: 1200,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.fontFamily = '"TH Sarabun New", sans-serif';
          clonedElement.style.fontSize = '14px';
          clonedElement.style.lineHeight = '1.4';
          clonedElement.style.letterSpacing = '0.3px';
          clonedElement.style.wordSpacing = '0.5px';
          
          const allElements = clonedElement.querySelectorAll('*');
          allElements.forEach(el => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.fontFamily = '"TH Sarabun New", sans-serif';
            htmlEl.style.textRendering = 'optimizeLegibility';
            htmlEl.style.letterSpacing = '0.3px';
            htmlEl.style.wordSpacing = '0.5px';
            htmlEl.style.lineHeight = '1.4';
            (htmlEl.style as any).webkitFontSmoothing = 'antialiased';
            (htmlEl.style as any).mozOsxFontSmoothing = 'grayscale';
          });
        }
      }
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Failed to create canvas from element');
    }

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = 210;
    const pdfHeight = 297;
    
    // Calculate multi-page layout
    const pageHeight = (canvas.height * pdfWidth) / canvas.width;
    const totalPages = Math.ceil(pageHeight / pdfHeight);
    
    // Add pages to PDF
    for (let i = 0; i < totalPages; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      
      const yOffset = -(i * pdfHeight);
      pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, pageHeight);
    }
    
    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    throw error;
  }
};
