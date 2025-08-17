
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText, 
  Calendar,
  MapPin,
  TrendingUp
} from "lucide-react";

const ApprovalQueue = () => {
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [approvalNote, setApprovalNote] = useState("");

  const pendingInspections = [
    {
      id: "INS-001",
      name: "ร้านอาหารสวนสน",
      license: "อย.123/2567",
      inspector: "นายสมชาย ใจดี",
      date: "25/05/2567",
      score: 85,
      location: "เขตปทุมวัน กรุงเทพฯ",
      categories: [
        { name: "อาคารและสิ่งปลูกสร้าง", score: 90 },
        { name: "เครื่องมือเครื่องใช้", score: 82 },
        { name: "สุขอนามัยและความสะอาด", score: 88 },
        { name: "บุคลากร", score: 80 },
        { name: "กระบวนการผลิต", score: 85 }
      ],
      issues: [
        "พบรอยรั่วซึมเล็กน้อยที่เพดาน ห้องครัว",
        "ควรปรับปรุงระบบการจัดเก็บอุปกรณ์ทำความสะอาด"
      ]
    },
    {
      id: "INS-002",
      name: "โรงงานขนมกรุงเทพ",
      license: "อย.124/2567",
      inspector: "นางสาวมาลี สวยงาม",
      date: "24/05/2567",
      score: 92,
      location: "เขตมีนบุรี กรุงเทพฯ",
      categories: [
        { name: "อาคารและสิ่งปลูกสร้าง", score: 95 },
        { name: "เครื่องมือเครื่องใช้", score: 90 },
        { name: "สุขอนามัยและความสะอาด", score: 94 },
        { name: "บุคลากร", score: 88 },
        { name: "กระบวนการผลิต", score: 93 }
      ],
      issues: []
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 80) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const handleApprove = (inspectionId: string) => {
    console.log(`อนุมัติรายงาน ${inspectionId} หมายเหตุ: ${approvalNote}`);
    setApprovalNote("");
  };

  const handleReject = (inspectionId: string) => {
    console.log(`ไม่อนุมัติรายงาน ${inspectionId} หมายเหตุ: ${approvalNote}`);
    setApprovalNote("");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <Clock className="w-6 h-6 mr-3" />
            คิวรออนุมัติ ({pendingInspections.length} รายการ)
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inspection List */}
        <div className="space-y-4">
          {pendingInspections.map((inspection) => (
            <Card 
              key={inspection.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedInspection?.id === inspection.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedInspection(inspection)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{inspection.name}</h3>
                    <p className="text-sm text-gray-600">รหัส: {inspection.id}</p>
                  </div>
                  <Badge className={getScoreBadge(inspection.score)}>
                    {inspection.score}%
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    <span>ใบอนุญาต: {inspection.license}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>วันที่ตรวจ: {inspection.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{inspection.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">เจ้าหน้าที่:</span>
                    <span>{inspection.inspector}</span>
                  </div>
                </div>

                {inspection.issues.length > 0 && (
                  <div className="mt-3 p-2 bg-orange-50 rounded border border-orange-200">
                    <p className="text-xs font-medium text-orange-800">ข้อสังเกต:</p>
                    <p className="text-xs text-orange-700">{inspection.issues[0]}</p>
                    {inspection.issues.length > 1 && (
                      <p className="text-xs text-orange-600">และอีก {inspection.issues.length - 1} ข้อ</p>
                    )}
                  </div>
                )}

                <div className="flex justify-end mt-3">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    ดูรายละเอียด
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Inspection Details */}
        {selectedInspection && (
          <div className="lg:sticky lg:top-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  รายละเอียดการตรวจ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">{selectedInspection.name}</h4>
                  <p className="text-gray-600">{selectedInspection.license}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">เจ้าหน้าที่:</span>
                    <p className="font-medium">{selectedInspection.inspector}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">วันที่ตรวจ:</span>
                    <p className="font-medium">{selectedInspection.date}</p>
                  </div>
                </div>

                {/* Category Scores */}
                <div>
                  <h5 className="font-medium mb-2">คะแนนรายหมวด</h5>
                  <div className="space-y-2">
                    {selectedInspection.categories.map((category, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{category.name}</span>
                        <span className={`font-medium ${getScoreColor(category.score)}`}>
                          {category.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Issues */}
                {selectedInspection.issues.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2">ข้อสังเกต</h5>
                    <ul className="space-y-1">
                      {selectedInspection.issues.map((issue, index) => (
                        <li key={index} className="text-sm text-orange-700 bg-orange-50 p-2 rounded">
                          • {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Approval Section */}
                <div className="border-t pt-4">
                  <Label htmlFor="approval-note" className="text-sm font-medium">
                    หมายเหตุการอนุมัติ
                  </Label>
                  <Textarea
                    id="approval-note"
                    placeholder="ระบุหมายเหตุ (หากไม่อนุมัติต้องระบุเหตุผล)"
                    value={approvalNote}
                    onChange={(e) => setApprovalNote(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    onClick={() => handleApprove(selectedInspection.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    อนุมัติ
                  </Button>
                  <Button
                    onClick={() => handleReject(selectedInspection.id)}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    ไม่อนุมัติ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalQueue;
