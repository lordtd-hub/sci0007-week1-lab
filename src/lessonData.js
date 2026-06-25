export const groups = [
  {
    id: "math",
    label: "69312.041 คณิตศาสตร์",
    detail: "จำนวน 32 คน",
  },
  {
    id: "biology",
    label: "69314.041 ชีววิทยา",
    detail: "จำนวน 27 คน",
  },
];

export const stations = [
  {
    id: "course",
    number: 1,
    title: "รู้จักรายวิชา",
    short: "รายวิชา",
    clo: "CLO1-CLO5",
    outcome: "เข้าใจภาพรวมงาน คะแนน และหลักฐานที่ต้องเก็บตลอดรายวิชา",
  },
  {
    id: "policy",
    number: 2,
    title: "นโยบายการใช้ AI",
    short: "AI policy",
    clo: "CLO4",
    outcome: "แยกแยะการใช้ AI เพื่อเรียนรู้กับการให้ AI ทำงานแทน",
  },
  {
    id: "diagnostic",
    number: 3,
    title: "Diagnostic",
    short: "สำรวจพื้นฐาน",
    clo: "CLO2, CLO4",
    outcome: "สำรวจความพร้อมด้าน Google tools, AI use และ source checking",
  },
  {
    id: "portfolio",
    number: 4,
    title: "ตั้งค่า Portfolio",
    short: "Drive folder",
    clo: "CLO2, CLO3",
    outcome: "สร้างแฟ้มหลักฐานการเรียนรู้และ workflow ส่งงาน",
  },
  {
    id: "reflection",
    number: 5,
    title: "Reflection",
    short: "สะท้อนคิด",
    clo: "CLO4, CLO5",
    outcome: "เขียนแนวทางใช้ AI อย่างรับผิดชอบในภาษาของตนเอง",
  },
];

export const timeline = [
  ["0:00-0:20", "ปฐมนิเทศรายวิชาและเปิดเว็บ"],
  ["0:20-1:10", "สถานี 1-2: CLO + AI policy scenario"],
  ["1:10-1:50", "สถานี 3: Diagnostic"],
  ["1:50-2:40", "สถานี 4: ตั้งค่า Google Drive portfolio"],
  ["2:40-3:20", "สถานี 5: Reflection และตรวจ summary"],
  ["3:20-4:00", "ส่ง Google Form, ตรวจหลักฐาน, ถามตอบท้ายคาบ"],
];

export const scenarios = [
  {
    id: "homework",
    title: "สถานการณ์ที่ 1: งาน reflection ท้ายคาบ",
    prompt:
      "เพื่อนส่ง prompt ให้ AI เขียน reflection ทั้งหมด แล้วตั้งใจคัดลอกไปส่งโดยไม่แก้และไม่เปิดเผยการใช้ AI",
    options: [
      {
        id: "copy",
        label: "ทำได้ เพราะใช้ AI ช่วยประหยัดเวลา",
        correct: false,
        feedback:
          "ยังไม่เหมาะสม เพราะ AI ทำงานแทนการเรียนรู้ และไม่มีการเปิดเผยการใช้ AI",
      },
      {
        id: "revise",
        label:
          "ใช้ AI ช่วยตั้งคำถามหรือจัดโครง แล้วเขียนคำตอบด้วยภาษาตนเองพร้อม disclosure",
        correct: true,
        feedback:
          "เหมาะสม เพราะ AI เป็นเครื่องมือช่วยเรียนรู้ แต่นักศึกษายังตรวจสอบและรับผิดชอบคำตอบเอง",
      },
      {
        id: "hide",
        label: "ใช้ได้ถ้าไม่มีใครตรวจพบ",
        correct: false,
        feedback:
          "ไม่เหมาะสม เพราะขัดกับจริยธรรมรายวิชาและทำให้หลักฐานการเรียนรู้ไม่น่าเชื่อถือ",
      },
    ],
  },
  {
    id: "source",
    title: "สถานการณ์ที่ 2: AI ให้ข้อมูล PM2.5 พร้อมแหล่งอ้างอิง",
    prompt:
      "AI สรุปสาเหตุ PM2.5 และให้ลิงก์อ้างอิง 3 แหล่ง แต่นักศึกษายังไม่ได้เปิดตรวจแหล่งข้อมูล",
    options: [
      {
        id: "trust",
        label: "ใช้สรุปได้ทันที เพราะ AI มีลิงก์อ้างอิงให้แล้ว",
        correct: false,
        feedback:
          "ยังไม่พอ ต้องตรวจว่าแหล่งข้อมูลมีอยู่จริง น่าเชื่อถือ และสนับสนุนข้อสรุปนั้นจริง",
      },
      {
        id: "verify",
        label: "เปิดตรวจแหล่งข้อมูล เปรียบเทียบหลักฐาน แล้วแก้ข้อสรุปก่อนส่ง",
        correct: true,
        feedback:
          "ถูกต้อง นี่คือพฤติกรรมที่ตอบ CLO4: ตรวจสอบ ประเมิน และปรับปรุงผลลัพธ์จาก AI",
      },
      {
        id: "delete",
        label: "ลบแหล่งอ้างอิงออกเพื่อให้รายงานสั้นลง",
        correct: false,
        feedback:
          "ไม่เหมาะสม เพราะรายงานวิทยาศาสตร์ต้องมีหลักฐานและแหล่งข้อมูลตรวจสอบได้",
      },
    ],
  },
];

export const diagnosticQuestions = [
  {
    id: "drive",
    label: "Google Drive / Docs / Slides",
    question: "ฉันจัดโฟลเดอร์ แชร์ลิงก์ และตั้งสิทธิ์ไฟล์ได้",
  },
  {
    id: "sheets",
    label: "Google Sheets",
    question: "ฉันกรอกข้อมูล สร้างตาราง และสร้างกราฟพื้นฐานได้",
  },
  {
    id: "ai",
    label: "AI chat / Gemini",
    question: "ฉันเคยใช้ AI เพื่อถาม อธิบาย หรือช่วยจัดโครงคำตอบ",
  },
  {
    id: "sources",
    label: "Source checking",
    question: "ฉันรู้วิธีตรวจว่าแหล่งข้อมูลน่าเชื่อถือและมีอยู่จริง",
  },
];

export const evidenceItems = [
  {
    id: "driveFolder",
    label: "สร้างโฟลเดอร์หลักใน Google Drive",
    hint: "ตั้งชื่อ SCI0007_รหัสนักศึกษา_ชื่อ",
  },
  {
    id: "subFolders",
    label: "สร้างโฟลเดอร์ย่อย lab, prompt-log, reflection, project",
    hint: "ใช้ชื่ออังกฤษสั้น ๆ เพื่อเปิดหาได้ง่าย",
  },
  {
    id: "diagnostic",
    label: "ทำ diagnostic และเตรียมส่งคำตอบใน Google Form",
    hint: "ตรวจ summary ก่อนกดส่ง",
  },
  {
    id: "disclosure",
    label: "บันทึก AI use disclosure ตัวอย่างแรก",
    hint: "ระบุว่าใช้ AI ทำอะไร ตรวจสอบอย่างไร และแก้อะไรเอง",
  },
];

export const readinessLevels = [
  "ยังไม่เคย / ต้องการให้สาธิต",
  "เคยบ้าง / ทำตามขั้นตอนได้",
  "ทำได้เอง / ช่วยเพื่อนได้",
];
