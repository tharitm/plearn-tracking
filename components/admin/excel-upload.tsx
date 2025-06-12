"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, Check, X } from "lucide-react"
import type { Parcel } from "@/lib/types"

interface ExcelUploadProps {
  onImport: (data: Partial<Parcel>[]) => void
}

export function ExcelUpload({ onImport }: ExcelUploadProps) {
  const [previewData, setPreviewData] = useState<Partial<Parcel>[]>([])
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
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        // Map Excel columns to our data structure
        const mappedData = jsonData.slice(0, 5).map((row: any) => ({
          parcelRef: row["เลขที่รับพัสดุ"] || row["parcelRef"] || "",
          customerCode: row["รหัสลูกค้า"] || row["customerCode"] || "",
          cnTracking: row["TRACKING จีน"] || row["cnTracking"] || "",
          weight: Number.parseFloat(row["น้ำหนัก"] || row["weight"] || "0"),
          volume: Number.parseFloat(row["ปริมาณ"] || row["volume"] || "0"),
          freight: Number.parseFloat(row["ค่าขนส่ง"] || row["freight"] || "0"),
          estimate: Number.parseFloat(row["ประมาณการ"] || row["estimate"] || "0"),
          shipment: row["Shipment"] || row["shipment"] || "",
          deliveryMethod: row["วิธีการจัดส่ง"] || row["deliveryMethod"] || "pickup",
          status: "pending" as const,
          paymentStatus: "unpaid" as const,
          receiveDate: new Date().toISOString().split("T")[0],
        }))

        setPreviewData(mappedData)
      } catch (error) {
        console.error("Error reading Excel file:", error)
        alert("เกิดข้อผิดพลาดในการอ่านไฟล์ Excel")
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
      onImport(previewData)
      setPreviewData([])
      setFileName("")
      alert("นำเข้าข้อมูลสำเร็จ!")
    } catch (error) {
      console.error("Import failed:", error)
      alert("เกิดข้อผิดพลาดในการนำเข้าข้อมูล")
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
                  size="sm"
                  className="h-8 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-soft-sm hover:shadow-soft-md transition-all duration-300"
                >
                  <Check className="h-4 w-4 mr-1.5" />
                  <span className="text-sm">{uploading ? "กำลังนำเข้า..." : "นำเข้า"}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={uploading}
                  size="sm"
                  className="h-8 px-3 bg-gray-50 hover:bg-gray-100 border-0 rounded-xl shadow-soft-sm hover:shadow-soft-md transition-all duration-300"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* Preview Table */}
            <div className="bg-gray-50/50 rounded-xl overflow-hidden border border-gray-100/50">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100/50">
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">เลขที่รับพัสดุ</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">รหัสลูกค้า</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">TRACKING จีน</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">น้ำหนัก</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">ปริมาณ</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">ค่าขนส่ง</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">ประมาณการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {previewData.map((row, index) => (
                      <tr key={index} className="hover:bg-white/60 transition-colors duration-200">
                        <td className="px-3 py-2.5 text-sm text-gray-800 font-medium">{row.parcelRef}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700">{row.customerCode}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700 font-mono">{row.cnTracking}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700">{row.weight?.toFixed(2)}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700">{row.volume?.toFixed(2)}</td>
                        <td className="px-3 py-2.5 text-sm text-emerald-600 font-medium">฿{row.freight?.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-sm text-blue-600 font-medium">฿{row.estimate?.toLocaleString()}</td>
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
