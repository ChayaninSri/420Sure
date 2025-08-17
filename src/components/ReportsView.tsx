import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  FileText, 
  Mail, 
  Check, 
  X, 
  Download, 
  Eye, 
  Calendar,
  MapPin,
  User,
  Filter,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PDFPreview from "./PDFPreview";

const ReportsView = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  // Mock data with enhanced structure for PDF export
  const reports = [
    {
      id: "RPT-001",
      facilityName: "ร้านอาหารสวนสน",
      license: "อย.123/2567",
      inspector: "นายสมชาย ใจดี",
      inspectionDate: "25/05/2567",
      status: "รออนุมัติ",
      totalScore: 85,
      categories: [
        { 
          name: "สิ่งแวดล้อมทั่วไป", 
          score: 18, 
          maxScore: 20,
          items: [
            { id: "1.1", score: 2, maxScore: 2, notes: "ทดสอบข้อความยาวๆว่าเป็นอย่างไร" },
            { id: "1.2", score: 1, maxScore: 2, notes: "ไม่มีการใช้" },
            { id: "1.7", score: 2, maxScore: 2, notes: "ดี" }
          ]
        },
        { 
          name: "แหล่งน้ำและระบบสุขาภิบาล", 
          score: 16, 
          maxScore: 18,
          items: [
            { id: "4.1", text: "น้ำที่ใช้ ต้องเป็นน้ำสะอาด ที่เหมาะสมตามวัตถุประสงค์ที่ใช้", score: 2, maxScore: 2, notes: "ผ่านเกณฑ์" }
          ]
        },
        { 
          name: "การจัดการขยะและสิ่งปฏิกูล", 
          score: 14, 
          maxScore: 16,
          items: [
            { id: "4.6", text: "มีการจัดการขยะที่เหมาะสม ไม่ก่อให้เกิดการปนเปื้อน", score: 1, maxScore: 2, notes: "ควรปรับปรุง" }
          ]
        },
        { 
          name: "การควบคุมแมลงและสัตว์พาหะ", 
          score: 12, 
          maxScore: 14,
          items: []
        },
        { 
          name: "บุคลากรและสุขลักษณะส่วนบุคคล", 
          score: 15, 
          maxScore: 18,
          items: []
        }
      ],
      location: "13.7563° N, 100.5018° E",
      notes: "สถานที่สะอาด มีการจัดการที่ดี แต่ควรปรับปรุงระบบระบายน้ำ และการจัดการขยะให้ดีขึ้น เพื่อป้องกันการปนเปื้อน",
      signature: null
    },
    {
      id: "RPT-002", 
      facilityName: "โรงงานขนมกรุงเทพ",
      license: "อย.124/2567",
      inspector: "นางสาวสุดา รักษ์ดี",
      inspectionDate: "24/05/2567", 
      status: "อนุมัติแล้ว",
      totalScore: 92,
      categories: [
        { name: "สิ่งแวดล้อมทั่วไป", score: 20, maxScore: 20, items: [] },
        { name: "แหล่งน้ำและระบบสุขาภิบาล", score: 18, maxScore: 18, items: [] },
        { name: "การจัดการขยะและสิ่งปฏิกูล", score: 16, maxScore: 16, items: [] },
        { name: "การควบคุมแมลงและสัตว์พาหะ", score: 14, maxScore: 14, items: [] },
        { name: "บุคลากรและสุขลักษณะส่วนบุคคล", score: 17, maxScore: 18, items: [] }
      ],
      location: "13.7563° N, 100.5018° E",
      notes: "ผ่านเกณฑ์ทุกข้อ มีมาตรฐานสูง",
      signature: null
    },
    {
      id: "RPT-003",
      facilityName: "ร้านกาแฟดอยตุง", 
      license: "อย.125/2567",
      inspector: "นายประเสริฐ ตั้งใจดี",
      inspectionDate: "23/05/2567",
      status: "แบบร่าง",
      totalScore: 78,
      categories: [
        { name: "สิ่งแวดล้อมทั่วไป", score: 16, maxScore: 20, items: [] },
        { name: "แหล่งน้ำและระบบสุขาภิบาล", score: 14, maxScore: 18, items: [] },
        { name: "การจัดการขยะและสิ่งปฏิกูล", score: 14, maxScore: 16, items: [] },
        { name: "การควบคุมแมลงและสัตว์พาหะ", score: 12, maxScore: 14, items: [] },
        { name: "บุคลากรและสุขลักษณะส่วนบุคคล", score: 15, maxScore: 18, items: [] }
      ],
      location: "13.7563° N, 100.5018° E", 
      notes: "ต้องปรับปรุงในหลายจุด",
      signature: null
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "รออนุมัติ":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">รออนุมัติ</Badge>;
      case "อนุมัติแล้ว":
        return <Badge className="bg-green-100 text-green-800 border-green-200">อนุมัติแล้ว</Badge>;
      case "แบบร่าง":
        return <Badge variant="outline" className="bg-gray-50">แบบร่าง</Badge>;
      case "ไม่อนุมัติ":
        return <Badge className="bg-red-100 text-red-800 border-red-200">ไม่อนุมัติ</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.license.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.inspector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendEmail = () => {
    if (!recipientEmail) {
      toast({
        title: "กรุณากรอกอีเมล",
        description: "โปรดระบุอีเมลผู้รับ",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "ส่งอีเมลสำเร็จ",
      description: `ส่งรายงาน PDF ไปยัง ${recipientEmail} แล้ว`,
    });
    
    setEmailDialogOpen(false);
    setRecipientEmail("");
    setEmailMessage("");
  };

  const handleApprove = (reportId: string) => {
    toast({
      title: "อนุมัติรายงานสำเร็จ",
      description: `รายงาน ${reportId} ได้รับการอนุมัติแล้ว`,
    });
  };

  const handleReject = (reportId: string) => {
    if (!rejectReason.trim()) {
      toast({
        title: "กรุณาระบุเหตุผล",
        description: "โปรดระบุเหตุผลในการไม่อนุมัติ",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "ไม่อนุมัติรายงาน",
      description: `รายงาน ${reportId} ไม่ได้รับการอนุมัติ`,
      variant: "destructive",
    });
    setRejectReason("");
  };

  const handlePDFPreview = (report: any) => {
    setSelectedReport(report);
    setPdfPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">รายงานการตรวจ</h2>
          <p className="text-gray-600">จัดการและตรวจสอบรายงานการตรวจสถานที่ผลิตอาหาร</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">ค้นหา</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="ชื่อสถานที่, เลขที่ใบอนุญาต, เจ้าหน้าที่..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">สถานะ</Label>
              <select
                id="status"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">ทั้งหมด</option>
                <option value="แบบร่าง">แบบร่าง</option>
                <option value="รออนุมัติ">รออนุมัติ</option>
                <option value="อนุมัติแล้ว">อนุมัติแล้ว</option>
                <option value="ไม่อนุมัติ">ไม่อนุมัติ</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                กรองข้อมูล
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            รายการรายงาน ({filteredReports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัสรายงาน</TableHead>
                  <TableHead>ชื่อสถานที่</TableHead>
                  <TableHead>เลขที่ใบอนุญาต</TableHead>
                  <TableHead>เจ้าหน้าที่ตรวจ</TableHead>
                  <TableHead>วันที่ตรวจ</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>คะแนน</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.facilityName}</TableCell>
                    <TableCell>{report.license}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1 text-gray-400" />
                        {report.inspector}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {report.inspectionDate}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <span className={`font-bold ${getScoreColor(report.totalScore)}`}>
                        {report.totalScore}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {/* View Report Dialog */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>รายงานการตรวจ - {report.facilityName}</DialogTitle>
                              <DialogDescription>
                                รหัสรายงาน: {report.id} | วันที่ตรวจ: {report.inspectionDate}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedReport && (
                              <div className="space-y-4">
                                {/* Report Details */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>ชื่อสถานที่</Label>
                                    <p className="font-medium">{selectedReport.facilityName}</p>
                                  </div>
                                  <div>
                                    <Label>เลขที่ใบอนุญาต</Label>
                                    <p className="font-medium">{selectedReport.license}</p>
                                  </div>
                                  <div>
                                    <Label>เจ้าหน้าที่ตรวจ</Label>
                                    <p className="font-medium">{selectedReport.inspector}</p>
                                  </div>
                                  <div>
                                    <Label>ตำแหน่ง GPS</Label>
                                    <p className="font-medium flex items-center">
                                      <MapPin className="w-4 h-4 mr-1" />
                                      {selectedReport.location}
                                    </p>
                                  </div>
                                </div>

                                {/* Score Summary */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <h4 className="font-semibold mb-3">สรุปคะแนนการตรวจ</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {selectedReport.categories.map((category: any, index: number) => (
                                      <div key={index} className="flex justify-between items-center">
                                        <span className="text-sm">{category.name}</span>
                                        <span className="font-medium">
                                          {category.score}/{category.maxScore}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                      <span className="font-semibold">คะแนนรวม</span>
                                      <span className={`text-xl font-bold ${getScoreColor(selectedReport.totalScore)}`}>
                                        {selectedReport.totalScore}%
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Notes */}
                                <div>
                                  <Label>หมายเหตุ</Label>
                                  <p className="text-sm text-gray-600 mt-1">{selectedReport.notes}</p>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => handlePDFPreview(report)}>
                                <Download className="w-4 h-4 mr-2" />
                                ดาวน์โหลด PDF
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* PDF Download Button */}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handlePDFPreview(report)}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          <Download className="w-4 h-4" />
                        </Button>

                        {/* Send Email */}
                        <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                              <Mail className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>ส่งรายงานทางอีเมล</DialogTitle>
                              <DialogDescription>
                                ส่งรายงาน PDF ไปยังผู้ประกอบการ
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="email">อีเมลผู้รับ</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="example@company.com"
                                  value={recipientEmail}
                                  onChange={(e) => setRecipientEmail(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="message">ข้อความเพิ่มเติม (ไม่บังคับ)</Label>
                                <Textarea
                                  id="message"
                                  placeholder="ระบุข้อความที่ต้องการส่งพร้อมรายงาน..."
                                  value={emailMessage}
                                  onChange={(e) => setEmailMessage(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
                                ยกเลิก
                              </Button>
                              <Button onClick={handleSendEmail}>
                                <Mail className="w-4 h-4 mr-2" />
                                ส่งอีเมล
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Approval Actions */}
                        {report.status === "รออนุมัติ" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleApprove(report.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>ไม่อนุมัติรายงาน</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    กรุณาระบุเหตุผลในการไม่อนุมัติรายงานนี้
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="my-4">
                                  <Textarea
                                    placeholder="ระบุเหตุผลในการไม่อนุมัติ..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                  />
                                </div>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleReject(report.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    ไม่อนุมัติ
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* PDF Preview Dialog */}
      <PDFPreview
        open={pdfPreviewOpen}
        onOpenChange={setPdfPreviewOpen}
        reportData={selectedReport}
        onEmailSend={() => {
          setPdfPreviewOpen(false);
          setEmailDialogOpen(true);
        }}
      />
    </div>
  );
};

export default ReportsView;
