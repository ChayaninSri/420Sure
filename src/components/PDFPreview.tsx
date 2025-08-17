import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Mail, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PDFReport from "./PDFReport";
import { generatePDFBlob } from "@/utils/pdfExport";
import { compressPDF } from "@/utils/pdfCompression";

interface PDFPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportData: any;
  onEmailSend?: () => void;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({
  open,
  onOpenChange,
  reportData,
  onEmailSend
}) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const PDF_GENERATION_ELEMENT_ID = "pdf-report-for-generation";

  useEffect(() => {
    let objectUrl: string | null = null;

    const generatePreview = async () => {
      if (open && reportData) {
        setIsPreviewLoading(true);
        setPdfPreviewUrl(null); // Clear previous preview
        try {
          // Ensure the hidden PDFReport element is rendered before capturing
          await new Promise(resolve => setTimeout(resolve, 200));

          const blob = await generatePDFBlob(PDF_GENERATION_ELEMENT_ID, {
            quality: 1.5, // Match download quality
            format: 'a4',
          });
          objectUrl = URL.createObjectURL(blob);
          setPdfPreviewUrl(objectUrl);
        } catch (err) {
          console.error("Error generating PDF preview:", err);
          toast({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถสร้างตัวอย่าง PDF ได้",
            variant: "destructive",
          });
        } finally {
          setIsPreviewLoading(false);
        }
      }
    };

    if (open) {
      generatePreview();
    } else {
      // Clean up when dialog is closed
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
        setPdfPreviewUrl(null);
      }
    }

    return () => {
      // Cleanup on component unmount or if open/reportData changes causing re-run before previous cleanup
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      if (pdfPreviewUrl && !open) { // Ensure cleanup if dialog was closed externally
        URL.revokeObjectURL(pdfPreviewUrl);
        setPdfPreviewUrl(null);
      }
    };
  }, [open, reportData, toast]); // Removed pdfPreviewUrl from deps to avoid loop, manage cleanup explicitly

  const handleDownloadPDF = async () => {
    try {
      setIsExporting(true);
      const filename = `รายงานการตรวจ-${reportData.facilityName}-${reportData.id}.pdf`;
      
      console.log('Starting PDF export with compression...');
      
      // Wait for the dialog content to fully render (especially the hidden one)
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
      // Step 1: Generate the PDF blob
      const pdfBlob = await generatePDFBlob(PDF_GENERATION_ELEMENT_ID, {
        quality: 1.5, 
        format: 'a4'
      });
      
      // Step 2: Compress the PDF
      console.log(`Compressing PDF (original size: ${(pdfBlob.size / (1024 * 1024)).toFixed(2)}MB)...`);
      const { blob: compressedBlob, filename: compressedFilename } = await compressPDF(pdfBlob, { 
        filename,
        imageQuality: 0.85 // Balance between quality and file size
      });
      
      // Step 3: Download the compressed PDF
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(compressedBlob);
      downloadLink.download = compressedFilename;
      downloadLink.click();
      
      // Clean up
      URL.revokeObjectURL(downloadLink.href);
      downloadLink.remove();

      toast({
        title: "ดาวน์โหลดสำเร็จ",
        description: "ไฟล์ PDF ได้รับการดาวน์โหลดแล้ว",
      });
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดาวน์โหลดไฟล์ PDF ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            ตัวอย่างรายงาน PDF - {reportData?.facilityName}
          </DialogTitle>
          <DialogDescription>
            ตรวจสอบรายงานก่อนดาวน์โหลดหรือส่งอีเมล (รูปแบบตามข้อกำหนดของกฎหมาย)
          </DialogDescription>
        </DialogHeader>

        {/* Hidden div for PDF generation source */}
        <div 
          id={PDF_GENERATION_ELEMENT_ID}
          style={{
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            width: '210mm', // A4 width for html2canvas consistency
            height: '297mm', // A4 height
            backgroundColor: 'white', // Ensure a background for canvas
          }}
        >
          {reportData && <PDFReport reportData={reportData} />}
        </div>
        
        <div className="overflow-auto max-h-[60vh] min-h-[400px] bg-gray-100 p-1 rounded flex justify-center items-center">
          {isPreviewLoading && <p>กำลังโหลดตัวอย่าง PDF...</p>}
          {!isPreviewLoading && pdfPreviewUrl && (
            <object
              data={pdfPreviewUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              style={{ minHeight: 'inherit' }} // Inherit min-height from parent
            >
              <p>เบราว์เซอร์ของคุณไม่รองรับการแสดง PDF โดยตรง 
                <a href={pdfPreviewUrl} download={`preview-${reportData?.facilityName || 'report'}.pdf`}>
                  คลิกที่นี่เพื่อดาวน์โหลดตัวอย่าง
                </a>
              </p>
            </object>
          )}
          {!isPreviewLoading && !pdfPreviewUrl && open && reportData && (
            <p>ไม่สามารถสร้างตัวอย่าง PDF ได้ กรุณาลองดาวน์โหลดโดยตรง</p>
          )}
        </div>
        
        <DialogFooter className="gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            ปิด
          </Button>
          {onEmailSend && (
            <Button variant="outline" onClick={onEmailSend}>
              <Mail className="w-4 h-4 mr-2" />
              ส่งอีเมล
            </Button>
          )}
          <Button 
            onClick={handleDownloadPDF} 
            disabled={isExporting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? "กำลังสร้าง PDF..." : "ดาวน์โหลด PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PDFPreview;
