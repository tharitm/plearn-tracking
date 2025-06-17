"use client"

import { useEffect, useState } from "react"
import { useParcelStore } from "@/stores/parcel-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Truck, Package, CheckCircle, XCircle } from "lucide-react"
import { StatusBadge } from "../ui/status-badge"

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

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Description:</span>
                  <span>{selectedParcel.description || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pack:</span>
                  <span>{selectedParcel.pack || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">น้ำหนัก (KG):</span>
                  <span>{selectedParcel.weight?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ความยาว (CM):</span>
                  <span>{selectedParcel.length || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ความกว้าง (CM):</span>
                  <span>{selectedParcel.width || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ความสูง (CM):</span>
                  <span>{selectedParcel.height || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ปริมาตร (CBM):</span>
                  <span>{(((selectedParcel.width || 0) * (selectedParcel.length || 0) * (selectedParcel.height || 0)) / 1_000_000).toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ค่าขนส่ง:</span>
                  <span>฿{selectedParcel.freight?.toLocaleString() || "0"}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">รายละเอียดการขนส่ง</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">เลขรับสินค้า:</span>
                  <span>{selectedParcel.parcelRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Warehouse:</span>
                  <span>{selectedParcel.warehouse || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ขนส่งโดย:</span>
                  <span>{selectedParcel.deliveryMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipment:</span>
                  <span>{selectedParcel.shipment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ประมาณการ:</span>
                  <span>{selectedParcel.estimate || "-"}</span>
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
          </div>

          <Separator />

          {/* Financial Information */}
          {/* <div>
            <h3 className="font-semibold mb-2">ข้อมูลการเงิน</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">วันที่คาดว่าจะได้รับ (Estimate):</span>
                <span className="font-medium">{selectedParcel.estimate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ค่าขนส่ง:</span>
                <span className="font-medium">฿{selectedParcel.freight.toLocaleString()}</span>
              </div>
            </div>
          </div> */}

          {/* <Separator /> */}

          {/* Images */}
          <div>
            <h3 className="font-semibold mb-2">รูปภาพสินค้า</h3>
            {selectedParcel.images && selectedParcel.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {selectedParcel.images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Parcel image ${index + 1}`}
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No images available.</div>
            )}
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
