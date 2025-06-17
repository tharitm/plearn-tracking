"use client"

import { useEffect, useState } from "react"
import { useParcelStore } from "@/stores/parcel-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StatusBadge } from "@/components/ui/status-badge"
import { Separator } from "@/components/ui/separator"
import { Truck, Package, CheckCircle, XCircle } from "lucide-react"

interface TrackingEvent {
  date: string
  status: string
  description: string
  location?: string
}

export function ParcelDetailModal() {
  const { selectedParcel, setSelectedParcel } = useParcelStore()
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedParcel) {
      fetchTrackingDetails(selectedParcel.id)
    }
  }, [selectedParcel])

  const fetchTrackingDetails = async (parcelId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/parcel/${parcelId}`)
      const data = await response.json()
      setTrackingEvents(data.trackingEvents || [])
    } catch (error) {
      console.error("Failed to fetch tracking details:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  if (!selectedParcel) return null

  return (
    <Dialog open={!!selectedParcel} onOpenChange={() => setSelectedParcel(null)}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>รายละเอียดพัสดุ: {selectedParcel.parcelRef}</span>
          </DialogTitle>
        </DialogHeader>

        {selectedParcel.images && selectedParcel.images.length > 0 && (
          <div className="flex gap-2 pb-4 overflow-x-auto">
            {selectedParcel.images.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`parcel image ${idx}`}
                className="h-24 w-24 object-cover rounded-md"
              />
            ))}
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">ข้อมูลพื้นฐาน</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">เลขที่รับพัสดุ:</span>
                  <span className="font-medium">{selectedParcel.parcelRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">วันที่รับ:</span>
                  <span>{new Date(selectedParcel.receiveDate).toLocaleDateString("en-CA")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">รหัสลูกค้า:</span>
                  <span>{selectedParcel.customerCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipment:</span>
                  <span>{selectedParcel.shipment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">สถานะ:</span>
                  <StatusBadge status={selectedParcel.status} type="parcel" />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">สถานะชำระเงิน:</span>
                  <StatusBadge status={selectedParcel.paymentStatus} type="payment" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">ข้อมูลการขนส่ง</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">TRACKING จีน:</span>
                  <span className="font-mono">{selectedParcel.cnTracking}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TRACKING ไทย:</span>
                  <span className="font-mono">{selectedParcel.thTracking || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ขนาด (ซม.):</span>
                  <span>
                    {selectedParcel.width} x {selectedParcel.length} x {selectedParcel.height}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ปริมาณ (CBM):</span>
                  <span>
                    {(
                      (selectedParcel.width * selectedParcel.length * selectedParcel.height) /
                      1_000_000
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">น้ำหนัก (KG):</span>
                  <span>{selectedParcel.weight.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">วิธีการจัดส่ง:</span>
                  <span>{selectedParcel.deliveryMethod}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Financial Information */}
          <div>
            <h3 className="font-semibold mb-2">ข้อมูลการเงิน</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ประมาณการ:</span>
                <span className="font-medium">฿{selectedParcel.estimate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ค่าขนส่ง:</span>
                <span className="font-medium">฿{selectedParcel.freight.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tracking Timeline */}
          <div>
            <h3 className="font-semibold mb-4">Timeline การติดตาม</h3>
            {loading ? (
              <div className="text-center py-4 text-gray-500">กำลังโหลด...</div>
            ) : trackingEvents.length > 0 ? (
              <div className="space-y-4">
                {trackingEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {getStatusIcon(event.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{event.description}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {event.location && <p className="text-sm text-gray-600">{event.location}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">ไม่มีข้อมูล Timeline</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
