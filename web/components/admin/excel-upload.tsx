"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileSpreadsheet className="h-5 w-5" />
          <span>นำเข้าข้อมูลจาก Excel</span>
        </CardTitle>
        <CardDescription>อัปโหลดไฟล์ Excel (.xlsx, .xls) เพื่อนำเข้าข้อมูลพัสดุจำนวนมาก</CardDescription>
      </CardHeader>
      <CardContent>
        {previewData.length === 0 ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">วางไฟล์ที่นี่...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
                <p className="text-sm text-gray-500">รองรับไฟล์ .xlsx และ .xls เท่านั้น</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">ตัวอย่างข้อมูล (5 แถวแรก)</h3>
                <p className="text-sm text-gray-600">ไฟล์: {fileName}</p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleImport} disabled={uploading} className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>{uploading ? "กำลังนำเข้า..." : "นำเข้าข้อมูล"}</span>
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={uploading}>
                  <X className="h-4 w-4" />
                  <span>ยกเลิก</span>
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">เลขที่รับพัสดุ</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">รหัสลูกค้า</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">TRACKING จีน</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">น้ำหนัก</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">ปริมาณ</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">ค่าขนส่ง</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">ประมาณการ</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{row.parcelRef}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.customerCode}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.cnTracking}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.weight?.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.volume?.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2">฿{row.freight?.toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2">฿{row.estimate?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
