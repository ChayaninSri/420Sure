import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  MapPin, 
  Camera, 
  Save, 
  Send, 
  Building, 
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import InspectionCategory from "@/components/InspectionCategory";
import SignatureCapture from "@/components/SignatureCapture";

const InspectionForm = () => {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [facilityInfo, setFacilityInfo] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<{[key: string]: {percentage: number}}>({});
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState("");
  const [showSignature, setShowSignature] = useState(false);

  const categories = [
    {
      id: "building",
      title: "หมวดที่ 1 สถานที่ตั้ง อาคารผลิต การทำความสะอาด และการบำรุงรักษา",
      description: "การตรวจสอบโครงสร้างอาคาร พื้นที่ การระบายอากาศ",
      icon: Building,
      items: [
        "ข้อ 1.1 ทำเลที่ตั้งต้องห่างจากแหล่งที่ก่อให้เกิดการปนเปื้อน เช่น สิ่งปฏิกูล วัตถุอันตราย คอกสัตว์ ฝุ่นควัน น้ำท่วมขัง",
        "ข้อ 1.2 บริเวณโดยรอบอาคารผลิตและภายในอาคารผลิต ไม่มีการสะสมสิ่งของไม่ใช้แล้ว หรือไม่เกี่ยวข้องกับการผลิตอาหาร",
        "ข้อ 1.3 ภายนอกและภายในอาคารผลิต มีท่อหรือทางระบายน้ำที่เหมาะสม ลาดเอียงเพียงพอ ไม่อุดตัน ไม่ทำให้เกิดน้ำขังแฉะและสกปรก มีการออกแบบที่เหมาะสมกับทิศทางการระบายน้ำ",
        "ข้อ 1.4.1 พื้น ใช้วัสดุคงทน เรียบ ทำความสะอาดง่าย มีความลาดเอียงเพียงพอลงสู่ทางระบายน้ำ สภาพสะอาด ไม่ชำรุด",
        "ข้อ 1.4.2 ผนัง ใช้วัสดุคงทน เรียบ ทำความสะอาดง่าย สภาพ สะอาด ไม่ชำรุด",
        "ข้อ 1.4.3 เพดาน ใช้วัสดุคงทน เรียบ ทำความสะอาดง่าย รวมทั้งอุปกรณ์ที่ยึดติดด้านบน ไม่ก่อให้เกิดการปนเปื้อน สภาพสะอาด ไม่ชำรุด",
        "ข้อ 1.5 อาคารผลิตสามารถป้องกันสัตว์และแมลงเข้าสู่บริเวณผลิต หรือป้องกันสัตว์และแมลงสัมผัสอาหาร",
        "ข้อ 1.6 อาคารผลิตมีพื้นที่ในการผลิตเพียงพอ แยกพื้นที่การผลิตอาหารออกจากที่พักอาศัย และการผลิตผลิตภัณฑ์อื่นที่มิใช่อาหารตาม พระราชบัญญัติอาหาร รวมทั้งบริเวณรับประทานอาหาร",
        "ข้อ 1.7 อาคารผลิตมีพื้นที่ในการผลิตเป็นสัดเป็นส่วน และเป็นไปตามสายงานการผลิต ไม่ก่อให้เกิดการปนเปื้อนข้าม",
        "ข้อ 1.8 อาคารผลิตมีห้องบรรจุ หรือมีมาตรการจัดการพื้นที่บรรจุ เพื่อป้องกันการปนเปื้อนซ้ำหลังการฆ่าเชื้อผลิตภัณฑ์แล้ว (M)",
        "ข้อ 1.9 อาคารผลิตมีระบบระบายอากาศที่ควบคุมทิศทางการไหลของอากาศไม่ให้เกิดการปนเปื้อน และมีระบบระบายอากาศที่เพียงพอ เพื่อป้องกันการเกิดเชื้อรา และปฏิบัติงานสะดวก",
        "ข้อ 1.10 อาคารผลิตมีแสงสว่างเพียงพอ"
      ]
    },
    {
      id: "equipment",
      title: "หมวดที่ 2 เครื่องมือ เครื่องจักร อุปกรณ์การผลิต การทำความสะอาด และการบำรุงรักษา",
      description: "การตรวจสอบอุปกรณ์การผลิต เครื่องมือ การบำรุงรักษา",
      icon: FileText,
      items: [
        "ข้อ 2.1 เครื่องมือ เครื่องจักร และอุปกรณ์การผลิตที่สัมผัสกับอาหาร มีการออกแบบที่ถูกสุขลักษณะ วัสดุเหมาะสม ง่ายต่อการทำความสะอาด ไม่มีซอกมุมหรือรอยเชื่อมต่อที่ล้างไม่ทั่วถึง",
        "ข้อ 2.2 เครื่องมือ เครื่องจักร และอุปกรณ์การผลิต ติดตั้งในตำแหน่งเหมาะสม เป็นไปตามสายงานการผลิต ง่ายต่อการทำความสะอาด ปฏิบัติงานสะดวก",
        "ข้อ 2.3 เครื่องมือ เครื่องจักร และอุปกรณ์การผลิต มีความสัมพันธ์กับชนิดของอาหารที่ผลิต กรรมวิธีการผลิต และมีจำนวนเพียงพอ",
        "ข้อ 2.4 โต๊ะหรือพื้นผิวปฏิบัติงานที่สัมผัสกับอาหารโดยตรง ออกแบบถูกสุขลักษณะ พื้นผิวเรียบ วัสดุเหมาะสม ไม่เป็นสนิม ทำความสะอาดง่าย สูงจากพื้นอย่างน้อย 60 ซม. หรือในระดับที่สามารถป้องกันการปนเปื้อนจากพื้นขณะปฏิบัติงาน",
        "ข้อ 2.5 กรณีใช้ระบบท่อในการลำเลียงอาหาร พื้นผิวภายในท่อ รวมทั้งปั๊ม ข้อต่อ ปะเก็น วาล์วต่าง ๆ ที่สัมผัสอาหาร ต้องออกแบบอย่างถูกสุขลักษณะ ไม่มีจุดอับและซอกมุม สามารถทำความสะอาดได้ทั่วถึง มีอุปกรณ์ปิดปลายท่อที่ยังไม่ใช้งาน",
        "ข้อ 2.6 เครื่องมือ เครื่องจักร และอุปกรณ์การผลิต ต้องมีการทำความสะอาดอย่างสม่ำเสมอ กรณีที่ใช้สัมผัสกับอาหารที่พร้อมสำหรับการบริโภค (ready to eat) ต้องมีการฆ่าเชื้อก่อนการใช้งาน มีการจัดเก็บอุปกรณ์ที่ทำความสะอาดแล้วเป็นสัดเป็นส่วน ถูกสุขลักษณะ ป้องกันการปนเปื้อน",
        "ข้อ 2.7 เครื่องมือ เครื่องจักร และอุปกรณ์การผลิต ต้องบำรุงรักษาให้อยู่ในสภาพที่ดี ใช้งานได้ ไม่ปนเปื้อน กรณีอุปกรณ์มีอายุการใช้งาน ต้องจดบันทึกอายุการใช้งาน และเปลี่ยนเมื่อครบกำหนด",
        "ข้อ 2.8 อุปกรณ์การชั่งตวงวัด มีความเหมาะสม เพียงพอ มีความเที่ยงตรงแม่นยำ มีการสอบเทียบอย่างน้อยปีละ 1 ครั้ง"
      ]
    },
    {
      id: "process",
      title: "หมวดที่ 3 การควบคุมกระบวนการผลิต",
      description: "การตรวจสอบขั้นตอนการผลิต การเก็บรักษา การควบคุมคุณภาพ",
      icon: CheckCircle,
      items: [
        "ข้อ 3.1 วัตถุดิบ ส่วนผสม และวัตถุเจือปนอาหาร",
        "ข้อ 3.1.1 มีการคัดเลือกวัตถุดิบ ส่วนผสม และวัตถุเจือปนอาหาร ที่มีคุณภาพ ความปลอดภัย และมีข้อมูลความปลอดภัยตามประเภทของวัตถุดิบ",
        "ข้อ 3.1.2 มีการเก็บรักษาบนชั้นหรือยกพื้น ป้องกันการปนเปื้อน แยกเป็นสัดเป็นส่วน ไม่ปะปนกับวัตถุอันตรายหรือวัตถุดิบอื่นที่ไม่ใช่อาหาร กรณีผลิตอาหารที่ไม่มีสารก่อภูมิแพ้ ต้องเก็บแยกจากวัตถุดิบที่มีสารก่อภูมิแพ้ มีระบบการนำไปใช้อย่างมีประสิทธิภาพ",
        "ข้อ 3.1.3 มีวิธีการลดการปนเปื้อนเบื้องต้นจากอันตรายที่มากับวัตถุดิบหรือส่วนผสมตามความจำเป็น เช่น ล้างทำความสะอาด ตัดแต่ง คัดแยก ลวก กรอง ลดอุณหภูมิ ฆ่าเชื้อ",
        "ข้อ 3.2 ภาชนะบรรจุ",
        "ข้อ 3.2.1 มีการคัดเลือกภาชนะบรรจุที่มีคุณภาพความปลอดภัย เหมาะสมตามวัตถุประสงค์การใช้ และมีการตรวจสอบสภาพและความสมบูรณ์ของภาชนะบรรจุ",
        "ข้อ 3.2.2 มีการเก็บรักษา ขนย้าย และนำไปใช้อย่างเหมาะสม ไม่ปนเปื้อน มีระบบการนำไปใช้ตามลำดับก่อนหลัง",
        "ข้อ 3.2.3 มีการทำความสะอาดหรือฆ่าเชื้อก่อนการใช้งานตามความจำเป็น ขนย้ายภาชนะบรรจุที่ทำความสะอาดแล้ว โดยไม่ก่อให้เกิดการปนเปื้อนซ้ำ หากไม่ใช้งานทันทีต้องมีระบบการป้องกันการปนเปื้อน",
        "ข้อ 3.3 การผสม",
        "ข้อ 3.3.1 กรณีใช้วัตถุเจือปนอาหาร ต้องใช้ตามที่กฎหมายกำหนด ชั่งตวงด้วยอุปกรณ์ที่เหมาะสม ผสมให้เข้ากันอย่างทั่วถึง มีบันทึกผล หรือการใช้สารช่วยในการผลิต ต้องใช้ตามข้อมูลความปลอดภัย และมีมาตรการกำจัดออกให้อยู่ในระดับที่ปลอดภัย (M)",
        "ข้อ 3.3.2 ส่วนผสมอื่น ๆ มีการตรวจสอบอัตราส่วนการผสมให้เป็นไปตามสูตรที่แสดงบนฉลาก หรือที่ได้รับอนุญาตไว้ และการผสมมีความสม่ำเสมอเพื่อควบคุมคุณภาพ",
        "ข้อ 3.3.3 น้ำ และน้ำแข็ง ที่เป็นส่วนผสม หรือที่สัมผัสกับอาหารที่พร้อมสำหรับการบริโภค มีคุณภาพหรือมาตรฐานตามประกาศกระทรวงสาธารณสุข มีผลการตรวจวิเคราะห์อย่างน้อยปีละ 1 ครั้ง และมีการจัดเก็บในลักษณะที่ไม่ก่อให้เกิดการปนเปื้อน (M)",
        "ข้อ 3.3.4 ระหว่างกระบวนการผลิต มีการเก็บรักษาส่วนผสมที่ผสมแล้วภายใต้สภาวะที่ป้องกันการเสื่อมเสียจากจุลินทรีย์และการปนเปื้อนข้าม และนำไปใช้อย่างมีประสิทธิภาพ",
        "ข้อ 3.4 มีการควบคุมกระบวนการลดและขจัดอันตรายด้านจุลินทรีย์ให้อยู่ในระดับที่ปลอดภัยต่อการบริโภค และมีการตรวจสอบอย่างสม่ำเสมอ และบันทึกผล (M)",
        "ข้อ 3.5 กรณีการผลิตที่ไม่มีกระบวนการลดและขจัดอันตรายด้านจุลินทรีย์ เช่น การผสมส่วนผสมแห้งหรือของเหลวที่เป็นน้ำมัน การแบ่งบรรจุอาหารแห้ง การตัดแต่งผักผลไม้สด การบรรจุอาหารสด ต้องมีการควบคุมการปนเปื้อนตลอดกระบวนการผลิตอย่างเข้มงวด (M)",
        "ข้อ 3.6 การบรรจุและปิดผนึก",
        "ข้อ 3.6.1 บรรจุและปิดผนึกอย่างเหมาะสม ดำเนินการรวดเร็ว ควบคุมอุณหภูมิเพื่อป้องกันการเจริญของเชื้อจุลินทรีย์ มีมาตรการป้องกันการปนเปื้อนซ้ำ กรณีใช้วัตถุรักษาคุณภาพอาหารต้องใช้อย่างถูกต้อง",
        "ข้อ 3.6.2 ตรวจสอบความสมบูรณ์ของการปิดผนึก",
        "ข้อ 3.6.3 สภาพฉลากสมบูรณ์ มีข้อมูลเพียงพอ เพื่อให้ผู้บริโภคสามารถบริโภคได้อย่างปลอดภัย",
        "ข้อ 3.7 ในกระบวนการผลิต มีการขนย้ายวัตถุดิบ ส่วนผสม วัตถุเจือปนอาหาร และผลิตภัณฑ์สุดท้าย ในลักษณะที่ไม่เกิดการปนเปื้อนข้าม (M)",
        "ข้อ 3.8 มีข้อมูลที่จำเป็นเพื่อบ่งชี้สำหรับการตามสอบย้อนกลับ เช่น ชนิด รุ่นการผลิตและแหล่งที่มาของวัตถุดิบ ส่วนผสม วัตถุเจือปนอาหาร ภาชนะบรรจุ ผลิตภัณฑ์สุดท้าย ผลิตภัณฑ์ที่ไม่ได้มาตรฐาน",
        "ข้อ 3.9 ผลิตภัณฑ์สุดท้าย",
        "ข้อ 3.9.1 ผลิตภัณฑ์สุดท้ายมีคุณภาพหรือมาตรฐานตามประกาศกระทรวงสาธารณสุขที่เกี่ยวข้อง โดยมีผลวิเคราะห์อย่างน้อยปีละ 1 ครั้ง (M)",
        "ข้อ 3.9.2 มีการเก็บรักษาและขนส่งผลิตภัณฑ์สุดท้ายเพื่อจำหน่ายอย่างเหมาะสม สามารถรักษาคุณภาพ ล้างทำความสะอาด และป้องกันการปนเปื้อนข้าม จากพาหนะขนส่ง ผู้ปฏิบัติงาน และสิ่งแวดล้อมได้",
        "ข้อ 3.10 มีบันทึกเกี่ยวกับชนิด ปริมาณการผลิต และข้อมูลการจำหน่าย รวมทั้งมีวิธีการเรียกคืนสินค้า",
        "ข้อ 3.10.1 กรณีผลิตผลิตภัณฑ์เสริมอาหาร (M)",
        "ข้อ 3.10.2 กรณีผลิตอาหารอื่นนอกเหนือจากผลิตภัณฑ์เสริม",
        "ข้อ 3.11 มีการจัดการผลิตภัณฑ์ที่ไม่ได้มาตรฐานอย่างเหมาะสม โดยการคัดแยกหรือทำลาย",
        "ข้อ 3.12 มีการเก็บรักษาบันทึกและรายงาน หลังจากพ้นระยะเวลาการวางจำหน่ายที่แสดงในฉลากผลิตภัณฑ์อย่างน้อย 1 ปี",
        "ข้อ 3.13 มีการตรวจประเมินตนเองโดยหน่วยงานภายในหรือหน่วยงานภายนอก ตามประกาศฯ ฉบับนี้ อย่างน้อยปีละ 1 ครั้ง และดำเนินการโดยผู้ที่มีความรู้ความเข้าใจ กรณีพบข้อบกพร่องต้องมีมาตรการแก้ไข"
      ]
    },
    {
      id: "sanitation",
      title: "หมวดที่ 4 สุขลักษณะของน้ำ สิ่งอำนวยความสะดวก และการจัดการสิ่งแวดล้อม",
      description: "การตรวจสอบความสะอาด การล้างมือ ห้องน้ำ",
      icon: AlertCircle,
      items: [
        "ข้อ 4.1 น้ำที่ใช้ ต้องเป็นน้ำสะอาด ที่เหมาะสมตามวัตถุประสงค์ที่ใช้",
        "ข้อ 4.2 ห้องส้วม และอ่างล้างมือหน้าห้องส้วม มีจำนวนเพียงพอ ใช้งานได้ ถูกสุขลักษณะ มีสบู่เหลว อุปกรณ์ทำให้มือแห้ง หรือสารฆ่าเชื้อโรค แยกจากบริเวณผลิตหรือไม่เปิดสู่บริเวณผลิตโดยตรง",
        "ข้อ 4.3 มีสิ่งอำนวยความสะดวกสำหรับเปลี่ยนเสื้อผ้า เก็บของใช้ส่วนตัวของผู้ปฏิบัติงาน เพียงพอและเหมาะสม อยู่ในตำแหน่งที่สะดวกต่อการใช้งาน ไม่ก่อให้เกิดการปนเปื้อน",
        "ข้อ 4.4 มีอ่างล้างมือบริเวณผลิต จำนวนเพียงพอ ใช้งานได้ ตำแหน่งเหมาะสม มีสบู่เหลว มีอุปกรณ์ทำให้มือแห้งหรือสารฆ่าเชื้อโรค",
        "ข้อ 4.5 มีมาตรการควบคุมและกำจัดสัตว์และแมลงอย่างมีประสิทธิภาพ",
        "ข้อ 4.6 มีการจัดการขยะที่เหมาะสม ไม่ก่อให้เกิดการปนเปื้อน ภาชนะใส่ขยะเหมาะสม ตำแหน่งที่ตั้งภาชนะใส่ขยะหรือศูนย์รวมขยะเหมาะสม วิธีการและความถี่ในการกำจัดขยะและการขนย้ายลำเลียง ไม่ก่อให้เกิดการปนเปื้อน",
        "ข้อ 4.7 มีมาตรการจัดการสารเคมี มีข้อมูลสารเคมี นำไปใช้อย่างปลอดภัยตามวิธีการใช้ที่กำหนด ไม่ปนเปื้อน จัดเก็บแยกเป็นสัดเป็นส่วนจากบริเวณผลิต และมีป้ายบ่งชี้ มีมาตรการป้องกันผู้ไม่เกี่ยวข้องนำสารเคมีอันตรายไปใช้โดยไม่ได้รับอนุญาต",
        "ข้อ 4.8 มีมาตรการจัดการกับอุปกรณ์ที่เกี่ยวข้องกับการกำจัดสัตว์และแมลง การทำความสะอาดและฆ่าเชื้อ และการซ่อมบำรุงในลักษณะไม่ก่อให้เกิดการปนเปื้อน"
      ]
    },
    {
      id: "personnel",
      title: "หมวดที่ 5 สุขลักษณะและความปลอดภัยของผู้ปฏิบัติงาน",
      description: "การตรวจสอบความรู้ สุขภาพ การแต่งกายของพนักงาน",
      icon: FileText,
      items: [
        "ข้อ 5.1 ผู้ปฏิบัติงานและบุคลากรในบริเวณผลิต",
        "ข้อ 5.1.1 ไม่เป็นโรคหรือพาหะของโรคตามกฎกระทรวง ฉบับที่ 1 ไม่มีบาดแผล และมีมาตรการสำหรับผู้ปฏิบัติงานที่มีอาการของโรค",
        "ข้อ 5.1.2 รักษาความสะอาดของร่างกาย เช่น เล็บสั้น ไม่ทาสีเล็บ",
        "ข้อ 5.1.3 ล้างมือให้สะอาดทุกครั้งก่อนเริ่มปฏิบัติงาน และภายหลังจากสัมผัสสิ่งที่ก่อให้เกิดการปนเปื้อน รวมถึงกรณีสวมถุงมือ ต้องล้างมือให้สะอาดทุกครั้งก่อนสวมถุงมือ",
        "ข้อ 5.1.4 กรณีสวมถุงมือที่สัมผัสอาหาร ถุงมือต้องอยู่ในสภาพสมบูรณ์ สะอาด ถูกสุขลักษณะ ทำด้วยวัสดุที่สัมผัสอาหารได้ โดยไม่ก่อให้เกิดการปนเปื้อนกับอาหาร",
        "ข้อ 5.1.5 สวมหมวกคลุมผม หรือผ้าคลุมผม ชุดหรือผ้ากันเปื้อน และรองเท้าที่สะอาดขณะปฏิบัติงาน รวมทั้งสวมผ้าปิดปากตามความจำเป็น",
        "ข้อ 5.1.6 ไม่บริโภคอาหาร ไม่สูบบุหรี่ ในขณะปฏิบัติงาน และไม่นำของใช้ส่วนตัวเข้าไปในบริเวณผลิต เช่น เครื่องประดับ นาฬิกา และไม่มีพฤติกรรมที่อาจทำให้เกิดการปนเปื้อนสู่อาหาร",
        "ข้อ 5.1.7 ผู้ปฏิบัติงานผ่านการฝึกอบรมแต่ละระดับอย่างเหมาะสมและมีหลักฐานการฝึกอบรม รวมทั้งปฏิบัติตามป้ายคำเตือนด้านสุขลักษณะอย่างเคร่งครัด",
        "ข้อ 5.2 มีวิธีการหรือข้อปฏิบัติสำหรับผู้ไม่เกี่ยวข้องกับการผลิตที่มีความจำเป็นต้องเข้าไปในบริเวณผลิตเพื่อป้องกันการปนเปื้อน"
      ]
    }
  ];

  const searchFacility = () => {
    // Simulate Google Sheet lookup
    if (licenseNumber) {
      setFacilityInfo({
        name: "ร้านอาหารสวนสน",
        address: "123 ถนนพระราม 4 เขตปทุมวัน กรุงเทพฯ 10330",
        type: "ร้านอาหาร",
        owner: "นางสาวสมใจ ใจดี"
      });
    }
  };

  const getCurrentLocation = () => {
    setLocationError("");
    
    if (!navigator.geolocation) {
      setLocationError("เบราว์เซอร์ไม่รองรับการระบุตำแหน่ง");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("ผู้ใช้ปฏิเสธการขอใช้ตำแหน่ง");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("ไม่สามารถระบุตำแหน่งได้");
            break;
          case error.TIMEOUT:
            setLocationError("หมดเวลาการขอตำแหน่ง");
            break;
          default:
            setLocationError("เกิดข้อผิดพลาดในการระบุตำแหน่ง");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const calculateTotalScore = () => {
    const categoryScores = Object.values(scores);
    if (categoryScores.length === 0) return 0;
    
    const total = categoryScores.reduce((sum, score) => {
      const percentage = typeof score.percentage === 'number' ? score.percentage : 0;
      return sum + percentage;
    }, 0);
    return Math.round(total / categoryScores.length);
  };

  const handleCategoryScore = (categoryId: string, scoreData: any) => {
    setScores(prev => ({
      ...prev,
      [categoryId]: scoreData
    }));
  };

  const totalScore = calculateTotalScore();

  const handleSignaturesComplete = (signatures: any) => {
    console.log("Signatures completed:", signatures);
    // Here you would typically save the report with signatures
    // For now, we'll just show a success message
    alert("รายงานถูกส่งเพื่ออนุมัติเรียบร้อยแล้ว");
    // Reset form or navigate back
  };

  if (showSignature) {
    return (
      <SignatureCapture
        facilityInfo={facilityInfo}
        totalScore={totalScore}
        onSignaturesComplete={handleSignaturesComplete}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <FileText className="w-6 h-6 mr-3" />
            แบบตรวจสถานที่ผลิตอาหาร
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="license">เลขที่ใบอนุญาต</Label>
              <div className="flex space-x-2">
                <Input
                  id="license"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="อย.123/2567"
                  className="flex-1"
                />
                <Button onClick={searchFacility} variant="outline">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label>วันที่ตรวจ</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{new Date().toLocaleDateString('th-TH')}</span>
              </div>
            </div>
          </div>

          {facilityInfo && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{facilityInfo.name}</h4>
                  <p className="text-sm text-gray-600">{facilityInfo.address}</p>
                </div>
                <div>
                  <p className="text-sm"><span className="font-medium">ประเภท:</span> {facilityInfo.type}</p>
                  <p className="text-sm"><span className="font-medium">ผู้ประกอบการ:</span> {facilityInfo.owner}</p>
                </div>
              </div>
              
              {/* Location Section */}
              <Separator className="my-4" />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">ตำแหน่งสถานที่ตรวจ</Label>
                  <Button 
                    onClick={getCurrentLocation} 
                    variant="outline" 
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>บันทึกตำแหน่ง</span>
                  </Button>
                </div>
                
                {location && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">บันทึกตำแหน่งแล้ว</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                    </p>
                  </div>
                )}
                
                {locationError && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2 text-red-700">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{locationError}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-2">
          {categories.map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? "bg-gradient-to-r from-blue-600 to-green-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              {index < categories.length - 1 && (
                <div className={`w-8 h-1 mx-1 ${index < currentStep ? "bg-gradient-to-r from-blue-600 to-green-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <Button
              key={category.id}
              variant={currentStep === index ? "default" : "outline"}
              onClick={() => setCurrentStep(index)}
              className={`${
                currentStep === index
                  ? "bg-gradient-to-r from-blue-600 to-green-600 text-white"
                  : "hover:bg-blue-50"
              }`}
              size="sm"
            >
              <IconComponent className="w-4 h-4 mr-2" />
              หมวด {index + 1}
            </Button>
          );
        })}
      </div>

      {/* Current Category */}
      <InspectionCategory
        category={categories[currentStep]}
        onScoreUpdate={(scoreData) => handleCategoryScore(categories[currentStep].id, scoreData)}
      />

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          ย้อนกลับ
        </Button>

        <div className="text-center">
          <div className="text-sm text-gray-600">คะแนนรวมปัจจุบัน</div>
          <div className={`text-2xl font-bold ${totalScore >= 80 ? 'text-green-600' : totalScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {totalScore}%
          </div>
        </div>

        {currentStep < categories.length - 1 ? (
          <Button
            onClick={() => setCurrentStep(Math.min(categories.length - 1, currentStep + 1))}
            className="bg-gradient-to-r from-blue-600 to-green-600"
          >
            ถัดไป
          </Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              บันทึกร่าง
            </Button>
            <Button 
              onClick={() => setShowSignature(true)}
              className="bg-gradient-to-r from-blue-600 to-green-600"
            >
              <Send className="w-4 h-4 mr-2" />
              ดำเนินการลงนาม
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectionForm;
