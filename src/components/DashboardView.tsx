
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardCheck, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Plus,
  TrendingUp,
  Calendar
} from "lucide-react";

interface DashboardViewProps {
  onNavigate: (view: string) => void;
}

const DashboardView = ({ onNavigate }: DashboardViewProps) => {
  const stats = [
    { title: "แบบตรวจรอดำเนินการ", value: "3", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "รอการอนุมัติ", value: "7", icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50" },
    { title: "อนุมัติแล้วเดือนนี้", value: "24", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { title: "รายงานทั้งหมด", value: "156", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  const recentInspections = [
    { id: "INS-001", name: "ร้านอาหารสวนสน", license: "อย.123/2567", status: "รออนุมัติ", score: 85, date: "25/05/2567" },
    { id: "INS-002", name: "โรงงานขนมกรุงเทพ", license: "อย.124/2567", status: "อนุมัติแล้ว", score: 92, date: "24/05/2567" },
    { id: "INS-003", name: "ร้านกาแฟดอยตุง", license: "อย.125/2567", status: "แบบร่าง", score: 78, date: "24/05/2567" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "รออนุมัติ":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">รออนุมัติ</Badge>;
      case "อนุมัติแล้ว":
        return <Badge className="bg-green-100 text-green-800 border-green-200">อนุมัติแล้ว</Badge>;
      case "แบบร่าง":
        return <Badge variant="outline" className="bg-gray-50">แบบร่าง</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">เริ่มการตรวจใหม่</h3>
            <p className="text-gray-600 mb-4">สร้างแบบตรวจสถานที่ผลิตอาหารใหม่</p>
            <Button 
              onClick={() => onNavigate("inspection")}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              สร้างแบบตรวจใหม่
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Inspections */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <ClipboardCheck className="w-5 h-5 mr-2 text-blue-600" />
              การตรวจล่าสุด
            </CardTitle>
            <Button variant="outline" onClick={() => onNavigate("reports")}>
              <FileText className="w-4 h-4 mr-2" />
              ดูทั้งหมด
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInspections.map((inspection) => (
              <div
                key={inspection.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-gray-900">{inspection.name}</h4>
                    {getStatusBadge(inspection.status)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">เลขที่ใบอนุญาต: {inspection.license}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {inspection.date}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className={`text-lg font-bold ${getScoreColor(inspection.score)}`}>
                      {inspection.score}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">คะแนนรวม</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardView;
