export const ListParcelsQuerySchema = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1, default: 1, description: "หมายเลขหน้าสำหรับการแบ่งหน้า" },
    pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 10, description: "จำนวนรายการต่อหน้า" },
    status: {
      type: 'string',
      enum: ['pending', 'shipped', 'delivered', 'cancelled', 'all'],
      description: "กรองพัสดุตามสถานะ ('all' เพื่อดึงทุกสถานะ)"
    },
    paymentStatus: {
      type: 'string',
      enum: ['unpaid', 'paid', 'partial', 'all'],
      description: "กรองพัสดุตามสถานะการชำระเงิน ('all' เพื่อดึงทุกสถานะ)"
    },
    trackingNo: { type: 'string', description: "กรองพัสดุตามหมายเลขติดตาม" },
    dateFrom: { type: 'string', format: 'date', description: "กรองพัสดุที่สร้างตั้งแต่วันที่นี้ (YYYY-MM-DD)" },
    dateTo: { type: 'string', format: 'date', description: "กรองพัสดุที่สร้างถึงวันที่นี้ (YYYY-MM-DD)" },
    customerCode: { type: 'string', description: "กรองพัสดุตามรหัสลูกค้า" },
  },
};

const ParcelCoreSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', description: "รหัสเฉพาะของพัสดุ (UUID)" },
    parcelRef: { type: 'string', description: "หมายเลขอ้างอิงพัสดุ" },
    receiveDate: { type: 'string', format: 'date-time', description: "วันที่และเวลารับพัสดุ" },
    customerCode: { type: 'string', description: "รหัสลูกค้าที่เกี่ยวข้อง" },
    shipment: { type: 'string', description: "รายละเอียดการจัดส่งหรือตัวระบุ" },
    estimate: { type: 'number', description: "ค่าประมาณหรือมูลค่า" },
    status: {
      type: 'string',
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      description: "สถานะปัจจุบันของพัสดุ"
    },
    cnTracking: { type: 'string', description: "หมายเลขติดตามของจีน" },
    volume: { type: 'number', description: "ปริมาตรของพัสดุ (เช่น ลูกบาศก์เมตร)" },
    weight: { type: 'number', description: "น้ำหนักของพัสดุ (เช่น กิโลกรัม)" },
    freight: { type: 'number', description: "ค่าขนส่ง" },
    deliveryMethod: { type: 'string', description: "วิธีการจัดส่ง" },
    thTracking: { type: 'string', description: "หมายเลขติดตามของไทย" },
    paymentStatus: {
      type: 'string',
      enum: ['unpaid', 'paid', 'partial'],
      description: "สถานะการชำระเงินของพัสดุ"
    },
    createdAt: { type: 'string', format: 'date-time', description: "เวลาที่สร้างข้อมูลพัสดุ" },
    updatedAt: { type: 'string', format: 'date-time', description: "เวลาที่อัปเดตข้อมูลพัสดุล่าสุด" },
  },
  required: [
    'id',
    'parcelRef',
    'receiveDate',
    'customerCode',
    'shipment',
    'estimate',
    'status',
    'cnTracking',
    'volume',
    'weight',
    'freight',
    'deliveryMethod',
    'paymentStatus',
    'createdAt',
    'updatedAt',
  ],
};

export const ListParcelsResponseSchema = {
  type: 'object',
  properties: {
    resultCode: { type: 'integer', description: "รหัสผลลัพธ์มาตรฐาน" },
    resultStatus: { type: 'string', description: "ข้อความสถานะผลลัพธ์มาตรฐาน" },
    developerMessage: { type: 'string', description: "ข้อความสำหรับนักพัฒนาหรือรายละเอียดข้อผิดพลาด" },
    resultData: {
      type: 'object',
      properties: {
        parcels: {
          type: 'array',
          items: ParcelCoreSchema,
          description: "รายการอ็อบเจ็กต์พัสดุ"
        },
        total: { type: 'integer', description: "จำนวนพัสดุทั้งหมดที่ตรงกับเงื่อนไข" },
        page: { type: 'integer', description: "หมายเลขหน้าปัจจุบัน" },
        pageSize: { type: 'integer', description: "จำนวนรายการต่อหน้า" },
      },
      required: ['parcels', 'total', 'page', 'pageSize'],
    },
  },
  required: ['resultCode', 'resultStatus', 'developerMessage', 'resultData'],
};

export const GetParcelByIdParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', description: "รหัสเฉพาะของพัสดุที่ต้องการดึงข้อมูล (UUID)" },
  },
  required: ['id'],
};

export const GetParcelByIdResponseSchema = {
  type: 'object',
  properties: {
    resultCode: { type: 'integer', description: "รหัสผลลัพธ์มาตรฐาน" },
    resultStatus: { type: 'string', description: "ข้อความสถานะผลลัพธ์มาตรฐาน" },
    developerMessage: { type: 'string', description: "ข้อความสำหรับนักพัฒนาหรือรายละเอียดข้อผิดพลาด" },
    resultData: ParcelCoreSchema, // ParcelCoreSchema properties are already described
  },
  required: ['resultCode', 'resultStatus', 'developerMessage', 'resultData'],
};

export const UpdateParcelStatusParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', description: "รหัสเฉพาะของพัสดุที่ต้องการอัปเดต (UUID)" },
  },
  required: ['id'],
};

export const UpdateParcelStatusBodySchema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      description: "สถานะใหม่สำหรับพัสดุ"
    },
    notify: { type: 'boolean', default: false, description: "แจ้งเตือนลูกค้าเกี่ยวกับการอัปเดตสถานะหรือไม่ (ค่าเริ่มต้นคือ false)" },
  },
  required: ['status'],
};

export const UpdateParcelStatusResponseSchema = {
  type: 'object',
  properties: {
    resultCode: { type: 'integer', description: "รหัสผลลัพธ์มาตรฐาน" },
    resultStatus: { type: 'string', description: "ข้อความสถานะผลลัพธ์มาตรฐาน" },
    developerMessage: { type: 'string', description: "ข้อความสำหรับนักพัฒนาหรือรายละเอียดข้อผิดพลาด" },
    resultData: ParcelCoreSchema, // ParcelCoreSchema properties are already described
  },
  required: ['resultCode', 'resultStatus', 'developerMessage', 'resultData'],
};

export const ErrorSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'integer', description: "รหัสสถานะ HTTP ของข้อผิดพลาด" },
    error: { type: 'string', description: "คำอธิบายข้อผิดพลาดสั้นๆ (เช่น 'Bad Request')" },
    message: { type: 'string', description: "ข้อความแสดงข้อผิดพลาดโดยละเอียด" },
  },
  required: ['statusCode', 'error', 'message'],
};
