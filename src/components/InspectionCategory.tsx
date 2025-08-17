import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface InspectionCategoryProps {
  category: {
    id: string;
    title: string;
    description: string;
    icon: any;
    items: string[];
  };
  onScoreUpdate: (scoreData: any) => void;
}

const InspectionCategory = ({ category, onScoreUpdate }: InspectionCategoryProps) => {
  const [itemScores, setItemScores] = useState<{[key: number]: number}>({});
  const [itemNotes, setItemNotes] = useState<{[key: number]: string}>({});
  const [excludedItems, setExcludedItems] = useState<{[key: number]: boolean}>({});
  const [photos, setPhotos] = useState<{[key: number]: string[]}>({});

  const IconComponent = category.icon;

  useEffect(() => {
    calculateScore();
  }, [itemScores, excludedItems]);

  const calculateScore = () => {
    const totalItems = category.items.length;
    const excludedCount = Object.values(excludedItems).filter(Boolean).length;
    const validItems = totalItems - excludedCount;
    
    if (validItems === 0) {
      onScoreUpdate({ percentage: 100, details: { totalItems, excludedCount, validItems, maxScore: 0, actualScore: 0 } });
      return;
    }

    const maxScore = validItems * 2; // Maximum 2 points per item
    const actualScore = Object.entries(itemScores)
      .filter(([index]) => !excludedItems[parseInt(index)])
      .reduce((sum, [_, score]) => sum + score, 0);

    const percentage = Math.round((actualScore / maxScore) * 100);
    
    onScoreUpdate({ 
      percentage, 
      details: { totalItems, excludedCount, validItems, maxScore, actualScore } 
    });
  };

  const handleScoreChange = (itemIndex: number, score: number) => {
    setItemScores(prev => ({
      ...prev,
      [itemIndex]: score
    }));
  };

  const handleNoteChange = (itemIndex: number, note: string) => {
    setItemNotes(prev => ({
      ...prev,
      [itemIndex]: note
    }));
  };

  const handleExcludeChange = (itemIndex: number, excluded: boolean) => {
    setExcludedItems(prev => ({
      ...prev,
      [itemIndex]: excluded
    }));
  };

  const getScoreButton = (itemIndex: number, score: number) => {
    const isSelected = itemScores[itemIndex] === score;
    const isExcluded = excludedItems[itemIndex];
    
    let variant: "default" | "outline" | "destructive" = "outline";
    let icon = null;
    
    if (isExcluded) {
      variant = "outline";
    } else if (isSelected) {
      if (score === 2) {
        variant = "default";
        icon = <CheckCircle className="w-4 h-4" />;
      } else if (score === 1) {
        variant = "default";  
        icon = <AlertTriangle className="w-4 h-4" />;
      } else {
        variant = "destructive";
        icon = <XCircle className="w-4 h-4" />;
      }
    }

    const getScoreText = () => {
      switch (score) {
        case 2: return "ดี";
        case 1: return "พอใช้";
        case 0: return "ปรับปรุง"; // Changed from "ไม่ดี" to "ปรับปรุง"
        default: return score.toString();
      }
    };

    const getScoreColor = () => {
      if (isExcluded) return "";
      if (!isSelected) return "";
      
      switch (score) {
        case 2: return "bg-green-600 hover:bg-green-700";
        case 1: return "bg-yellow-600 hover:bg-yellow-700";
        case 0: return "bg-red-600 hover:bg-red-700";
        default: return "";
      }
    };

    return (
      <Button
        key={score}
        variant={variant}
        size="sm"
        onClick={() => handleScoreChange(itemIndex, score)}
        disabled={isExcluded}
        className={`${getScoreColor()} ${isSelected ? 'text-white' : ''}`}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {getScoreText()} ({score})
      </Button>
    );
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardTitle className="flex items-center">
          <IconComponent className="w-6 h-6 mr-3 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
            <p className="text-sm text-gray-600 font-normal">{category.description}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {category.items.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item}</p>
                </div>
                <Badge variant="outline" className="ml-2">
                  ข้อ {index + 1}
                </Badge>
              </div>

              {/* Scoring Buttons */}
              <div className="flex flex-wrap gap-2 mb-3">
                {[2, 1, 0].map(score => getScoreButton(index, score))}
              </div>

              {/* Exclude Checkbox */}
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id={`exclude-${index}`}
                  checked={excludedItems[index] || false}
                  onCheckedChange={(checked) => handleExcludeChange(index, !!checked)}
                />
                <Label htmlFor={`exclude-${index}`} className="text-sm text-gray-600">
                  ตัดฐานคะแนน (ไม่นำข้อนี้มาคำนวณ)
                </Label>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">หมายเหตุ</Label>
                <Textarea
                  placeholder="ระบุรายละเอียดเพิ่มเติม..."
                  value={itemNotes[index] || ""}
                  onChange={(e) => handleNoteChange(index, e.target.value)}
                  className="min-h-[60px]"
                />
              </div>

              {/* Removed Camera Button - no action buttons needed */}
            </div>
          ))}
        </div>

        {/* Category Summary */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-2">สรุปคะแนนหมวดนี้</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">ข้อทั้งหมด:</span>
              <span className="ml-1 font-medium">{category.items.length}</span>
            </div>
            <div>
              <span className="text-gray-600">ข้อที่ตรวจ:</span>
              <span className="ml-1 font-medium">{category.items.length - Object.values(excludedItems).filter(Boolean).length}</span>
            </div>
            <div>
              <span className="text-gray-600">คะแนนที่ได้:</span>
              <span className="ml-1 font-medium">
                {Object.entries(itemScores)
                  .filter(([index]) => !excludedItems[parseInt(index)])
                  .reduce((sum, [_, score]) => sum + score, 0)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">คะแนนเต็ม:</span>
              <span className="ml-1 font-medium">
                {(category.items.length - Object.values(excludedItems).filter(Boolean).length) * 2}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InspectionCategory;
