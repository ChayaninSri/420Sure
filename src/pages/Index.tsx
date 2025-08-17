import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, FileText, Users, Settings, BarChart3, MapPin } from "lucide-react";
import InspectionForm from "@/components/InspectionForm";
import DashboardView from "@/components/DashboardView";
import ApprovalQueue from "@/components/ApprovalQueue";
import ReportsView from "@/components/ReportsView";

const Index = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [userRole] = useState("inspector"); // inspector, manager, admin

  const navigationItems = [
    { id: "dashboard", label: "แดชบอร์ด", icon: BarChart3 },
    { id: "inspection", label: "แบบตรวจ", icon: ClipboardCheck },
    { id: "reports", label: "รายงาน", icon: FileText },
    { id: "approval", label: "อนุมัติ", icon: Users, roles: ["manager", "admin"] },
    { id: "settings", label: "ตั้งค่า", icon: Settings, roles: ["admin"] },
  ];

  const filteredNavigation = navigationItems.filter(
    item => !item.roles || item.roles.includes(userRole)
  );

  const renderContent = () => {
    switch (currentView) {
      case "inspection":
        return <InspectionForm />;
      case "reports":
        return <ReportsView />;
      case "approval":
        return <ApprovalQueue />;
      case "dashboard":
      default:
        return <DashboardView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FoodCheckPro</h1>
                <p className="text-xs text-gray-500">ระบบตรวจสถานที่ผลิตอาหาร</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <MapPin className="w-3 h-3 mr-1" />
                ออนไลน์
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">เจ้าหน้าที่ตรวจ</p>
                <p className="text-xs text-gray-500">กรมอนามัย</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation */}
        <nav className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {filteredNavigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "outline"}
                  onClick={() => setCurrentView(item.id)}
                  className={`whitespace-nowrap ${
                    currentView === item.id
                      ? "bg-gradient-to-r from-blue-600 to-green-600 text-white"
                      : "hover:bg-blue-50"
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main>{renderContent()}</main>
      </div>
    </div>
  );
};

export default Index;
