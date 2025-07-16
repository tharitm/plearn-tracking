"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, Check, X } from "lucide-react"
import moment from 'moment'
import { showToast } from "@/lib/toast-utils"
import type { CreateOrderPayload } from "@/services/parcelService"

// Add status mapping
const STATUS_MAPPING: { [key: string]: string } = {
  "ถึงโกดังจีน": "arrived_cn_warehouse",
  "ปิดตู้แล้ว": "container_closed",
  "สินค้าอยู่ระหว่างเดินทางมาไทย": "ready_to_ship_to_customer",
  "ถึงโกดังไทย": "arrived_th_warehouse",
  "ลูกค้าเข้ารับสินค้าเรียบร้อย": "shipped_to_customer",
  "จัดส่งสินค้าเรียบร้อย": "delivered_to_customer",
  "สินค้าค้างโกดัง": "warehouse_pending",
}

// Function to map Thai status to enum value
const mapStatus = (thaiStatus: string): string => {
  return STATUS_MAPPING[thaiStatus] || "";  // Return empty string if no mapping found
}

interface PreviewData extends Omit<CreateOrderPayload, 'status'> {
  status: string | null;
}

interface ExcelUploadProps {
  onImport: (data: CreateOrderPayload[]) => void
}

export function ExcelUpload({ onImport }: ExcelUploadProps) {
  const [previewData, setPreviewData] = useState<PreviewData[]>([])
  const [fileName, setFileName] = useState<string>("")
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array", cellDates: true })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: '' })
        console.log('jsonData', jsonData)
        // Map Excel columns to our data structure
        const mappedData = jsonData.map((row: any) => {
          const thaiStatus = row['สถานะ'] || ''  // เก็บค่าภาษาไทย
          return {
            orderNo: row['PO'] || '',
            orderDate: row['DATE'] ? moment(row['DATE'], 'YYYY-MM-DD').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
            customerName: row['Customer ID'] || '',
            description: row['Description'] || '',
            pack: Number.parseInt(row['pack'] || '0'),
            weight: Number.parseFloat(row['น้ำหนัก (kg)'] || row['น้ำหนัก'] || '0'),
            length: Number.parseFloat(row['ยาว'] || '0'),
            width: Number.parseFloat(row['กว้าง'] || '0'),
            height: Number.parseFloat(row['สูง'] || '0'),
            cbm: Number.parseFloat(row['CBM'] || '0'),
            transportation: row['Shipment'] || row['__EMPTY'] || '',
            tracking: row['Tracking'] != null
              ? (typeof row['Tracking'] === 'number'
                ? row['Tracking'].toFixed(0)
                : String(row['Tracking'])
              )
              : '',
            cabinetCode: row['รหัสตู้'] || '',
            estimate: row['ประมาณการ']
              ? moment(row['ประมาณการ']).format('YYYY-MM-DD')
              : moment().format('YYYY-MM-DD'),
            status: thaiStatus,  // เก็บค่าภาษาไทยสำหรับ preview
            trackingTh: null,
            receiptNumber: null,
            shippingCost: null,
            shippingRates: null,
            picture: null,
          }
        })
        setPreviewData(mappedData)
      } catch (error) {
        console.error("Error reading Excel file:", error)
        showToast("เกิดข้อผิดพลาดในการอ่านไฟล์ Excel")
      }
    }

    reader.readAsArrayBuffer(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  })

  const handleImport = async () => {
    setUploading(true)
    try {
      // Convert preview data to CreateOrderPayload format and map status to enum
      const importData: CreateOrderPayload[] = previewData.map(data => ({
        ...data,
        status: mapStatus(data.status || '') || null // แปลงเป็น enum ตอนส่ง API
      }))
      onImport(importData)
      setPreviewData([])
      setFileName("")
      showToast("นำเข้าข้อมูลสำเร็จ!")
    } catch (error) {
      console.error("Import failed:", error)
      showToast("เกิดข้อผิดพลาดในการนำเข้าข้อมูล")
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    setPreviewData([])
    setFileName("")
  }


  return (
    <div className="bg-white rounded-2xl shadow-soft-lg border border-gray-100/50 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-xl">
            <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-base">นำเข้าข้อมูลจาก Excel</h3>
            <p className="text-sm text-gray-500 mt-0.5">อัปโหลดไฟล์ Excel (.xlsx, .xls) เพื่อนำเข้าข้อมูลพัสดุ</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {previewData.length === 0 ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${isDragActive
              ? "border-emerald-400 bg-emerald-50/50"
              : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30"
              }`}
          >
            <input {...getInputProps()} />
            <div className={`p-3 rounded-2xl w-fit mx-auto mb-3 ${isDragActive ? "bg-emerald-100" : "bg-gray-100"
              }`}>
              <Upload className={`h-8 w-8 ${isDragActive ? "text-emerald-600" : "text-gray-500"
                }`} />
            </div>
            {isDragActive ? (
              <p className="text-emerald-600 font-medium">วางไฟล์ที่นี่...</p>
            ) : (
              <div className="space-y-1">
                <p className="text-gray-700 font-medium">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
                <p className="text-sm text-gray-500">รองรับไฟล์ .xlsx และ .xls เท่านั้น</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">ตัวอย่างข้อมูล (5 แถวแรก)</h4>
                  <p className="text-sm text-gray-500">{fileName}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleImport}
                  disabled={uploading}
                  size="lg"
                  className="px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-soft-sm hover:shadow-soft-md transition-all duration-300"
                >
                  <Check className="h-5 w-5 mr-2" />
                  <span className="text-base font-medium">{uploading ? "กำลังนำเข้า..." : "นำเข้าข้อมูล"}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={uploading}
                  size="lg"
                  className="px-6 bg-gray-50 hover:bg-gray-100 border-0 rounded-xl shadow-soft-sm hover:shadow-soft-md transition-all duration-300"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* Preview Table */}
            <div className="bg-gray-50/50 rounded-xl overflow-hidden border border-gray-100/50">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100/50">
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">PO</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">DATE</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">ลูกค้า</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">คำอธิบาย</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">แพ็ค</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">น้ำหนัก (kg)</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">ความยาว</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">กว้าง</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">สูง</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">CBM</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Shipment</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Tracking</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">รหัสตู้</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">ประมาณการ</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {previewData.slice(0, 5).map((row, index) => (
                      <tr key={index} className="hover:bg-white/60 transition-colors duration-200">
                        <td className="px-3 py-2.5 text-sm text-gray-800 font-medium">{row.orderNo}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700">{row.orderDate}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700">{row.customerName}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700">{row.description}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700">{row.pack}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700">{row.weight?.toFixed(2)}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700">{row.length?.toFixed(2)}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700">{row.width?.toFixed(2)}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700">{row.height?.toFixed(2)}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700">{row.cbm?.toFixed(4)}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700">{row.transportation}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700">{row.tracking}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700">{row.cabinetCode}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700">{row.estimate}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
