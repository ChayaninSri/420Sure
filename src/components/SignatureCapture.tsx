
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  PenTool, 
  RotateCcw, 
  Check, 
  User, 
  ClipboardCheck,
  AlertCircle,
  FileText,
  UserPlus,
  Trash2
} from "lucide-react";

interface Inspector {
  id: string;
  name: string;
  signed: boolean;
}

interface SignatureData {
  inspectors: { name: string; signature: string }[];
  businessOwnerName: string;
  businessOwnerSignature: string;
  signatureDate: string;
}

interface SignatureCaptureProps {
  facilityInfo?: any;
  totalScore: number;
  onSignaturesComplete: (signatures: SignatureData) => void;
}

const SignatureCapture = ({ facilityInfo, totalScore, onSignaturesComplete }: SignatureCaptureProps) => {
  const [inspectors, setInspectors] = useState<Inspector[]>([
    { id: "1", name: "เจ้าหน้าที่ตรวจ", signed: false }
  ]);
  const [businessOwnerName, setBusinessOwnerName] = useState(facilityInfo?.owner || "");
  const [businessOwnerSigned, setBusinessOwnerSigned] = useState(false);
  const [currentSigner, setCurrentSigner] = useState<{ type: "inspector" | "owner"; id?: string } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return "ผ่าน";
    if (score >= 60) return "ผ่านเงื่อนไข";
    return "ไม่ผ่าน";
  };

  const addInspector = () => {
    const newInspector: Inspector = {
      id: Date.now().toString(),
      name: `เจ้าหน้าที่ตรวจ ${inspectors.length + 1}`,
      signed: false
    };
    setInspectors([...inspectors, newInspector]);
  };

  const removeInspector = (id: string) => {
    if (inspectors.length <= 1) return; // Keep at least one inspector
    setInspectors(inspectors.filter(inspector => inspector.id !== id));
  };

  const updateInspectorName = (id: string, name: string) => {
    setInspectors(inspectors.map(inspector => 
      inspector.id === id ? { ...inspector, name } : inspector
    ));
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentSigner) return;
    
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentSigner) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentSigner) return;

    const signatureData = canvas.toDataURL();
    
    if (currentSigner.type === "inspector" && currentSigner.id) {
      setInspectors(inspectors.map(inspector => 
        inspector.id === currentSigner.id ? { ...inspector, signed: true } : inspector
      ));
    } else if (currentSigner.type === "owner") {
      setBusinessOwnerSigned(true);
    }

    setCurrentSigner(null);
    clearSignature();
  };

  const startSigning = (type: "inspector" | "owner", id?: string) => {
    setCurrentSigner({ type, id });
    clearSignature();
  };

  const allInspectorsSigned = inspectors.every(inspector => inspector.signed);
  const allSignaturesComplete = allInspectorsSigned && businessOwnerSigned;

  const handleComplete = () => {
    if (!allSignaturesComplete) return;

    const signatures: SignatureData = {
      inspectors: inspectors.map(inspector => ({
        name: inspector.name,
        signature: "signed" // In real app, this would be the actual signature data
      })),
      businessOwnerName,
      businessOwnerSignature: "signed",
      signatureDate: new Date().toISOString()
    };

    onSignaturesComplete(signatures);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <FileText className="w-6 h-6 mr-3" />
            สรุปผลการตรวจ
          </CardTitle>
        </CardHeader>
        <CardContent>
          {facilityInfo && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{facilityInfo.name}</h4>
                  <p className="text-sm text-gray-600">{facilityInfo.address}</p>
                </div>
                <div>
                  <p className="text-sm"><span className="font-medium">ประเภท:</span> {facilityInfo.type}</p>
                  <p className="text-sm"><span className="font-medium">วันที่ตรวจ:</span> {new Date().toLocaleDateString('th-TH')}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-center">
                <div className="mb-2">
                  <span className="text-lg font-medium text-gray-700">คะแนนรวม</span>
                </div>
                <div className={`inline-flex items-center px-6 py-3 rounded-lg border-2 ${getScoreColor(totalScore)}`}>
                  <span className="text-3xl font-bold mr-3">{totalScore}%</span>
                  <span className="text-lg font-medium">{getScoreStatus(totalScore)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signature Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <PenTool className="w-6 h-6 mr-3" />
            ลงนามรับทราบผลการตรวจ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Inspectors Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <ClipboardCheck className="w-5 h-5 text-blue-600 mr-2" />
                เจ้าหน้าที่ผู้ตรวจ
              </h3>
              <Button 
                onClick={addInspector}
                variant="outline" 
                size="sm"
                className="bg-blue-50 hover:bg-blue-100"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                เพิ่มเจ้าหน้าที่
              </Button>
            </div>

            <div className="space-y-4">
              {inspectors.map((inspector, index) => (
                <div key={inspector.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">เจ้าหน้าที่คนที่ {index + 1}</span>
                      {inspector.signed && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Check className="w-3 h-3 mr-1" />
                          เซ็นแล้ว
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {!inspector.signed && (
                        <Button 
                          onClick={() => startSigning("inspector", inspector.id)}
                          variant="outline" 
                          size="sm"
                          disabled={currentSigner?.type === "owner" || (currentSigner?.type === "inspector" && currentSigner?.id !== inspector.id)}
                        >
                          <PenTool className="w-4 h-4 mr-2" />
                          เซ็นชื่อ
                        </Button>
                      )}
                      {inspectors.length > 1 && (
                        <Button 
                          onClick={() => removeInspector(inspector.id)}
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={inspector.signed}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`inspector-${inspector.id}`}>ชื่อเจ้าหน้าที่</Label>
                    <Input
                      id={`inspector-${inspector.id}`}
                      value={inspector.name}
                      onChange={(e) => updateInspectorName(inspector.id, e.target.value)}
                      className="mt-1"
                      disabled={inspector.signed}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Business Owner Signature */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-green-600" />
                <span className="font-medium">ลายเซ็นผู้ประกอบการ</span>
                {businessOwnerSigned && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Check className="w-3 h-3 mr-1" />
                    เซ็นแล้ว
                  </Badge>
                )}
              </div>
              {!businessOwnerSigned && (
                <Button 
                  onClick={() => startSigning("owner")}
                  variant="outline" 
                  size="sm"
                  disabled={currentSigner?.type === "inspector"}
                >
                  <PenTool className="w-4 h-4 mr-2" />
                  เซ็นชื่อ
                </Button>
              )}
            </div>
            
            <div className="mb-3">
              <Label htmlFor="ownerName">ชื่อผู้ประกอบการ</Label>
              <Input
                id="ownerName"
                value={businessOwnerName}
                onChange={(e) => setBusinessOwnerName(e.target.value)}
                className="mt-1"
                disabled={businessOwnerSigned}
              />
            </div>
          </div>

          {/* Signature Canvas */}
          {currentSigner && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {currentSigner.type === "inspector" 
                      ? `กรุณาเซ็นชื่อ (${inspectors.find(i => i.id === currentSigner.id)?.name})` 
                      : "กรุณาเซ็นชื่อ (ผู้ประกอบการ)"}
                  </span>
                  <div className="space-x-2">
                    <Button onClick={clearSignature} variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      ล้าง
                    </Button>
                    <Button onClick={saveSignature} size="sm" className="bg-gradient-to-r from-blue-600 to-green-600">
                      <Check className="w-4 h-4 mr-2" />
                      บันทึก
                    </Button>
                  </div>
                </div>
              </div>
              
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="w-full h-48 bg-white border border-gray-200 rounded cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              
              <p className="text-xs text-gray-500 mt-2">
                ใช้เมาส์หรือนิ้วในการเซ็นชื่อในกรอบข้างต้น
              </p>
            </div>
          )}

          {/* Completion */}
          {allSignaturesComplete && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">ลงนามครบถ้วนแล้ว</span>
              </div>
              <p className="text-sm text-green-700 mb-4">
                เจ้าหน้าที่ทั้งหมด ({inspectors.length} คน) และผู้ประกอบการได้ลงนามรับทราบผลการตรวจแล้ว
              </p>
              <Button 
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600"
              >
                <FileText className="w-4 h-4 mr-2" />
                ส่งรายงานเพื่ออนุมัติ
              </Button>
            </div>
          )}

          {/* Warning if not complete */}
          {!allSignaturesComplete && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  กรุณาให้เจ้าหน้าที่ทั้งหมดและผู้ประกอบการลงนามก่อนส่งรายงาน
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignatureCapture;
