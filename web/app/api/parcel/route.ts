import { type NextRequest, NextResponse } from "next/server"
import type { Parcel, ParcelListResponse } from "@/lib/types"

// Extended Mock data with more customer parcels
const mockParcels: Parcel[] = [
  {
    id: "1",
    parcelRef: "P2024001",
    receiveDate: "2024-01-15",
    customerCode: "C001",
    shipment: "SH2024001",
    estimate: 1500,
    status: "shipped",
    cnTracking: "CN123456789",
    volume: 0.5,
    weight: 2.5,
    freight: 300,
    deliveryMethod: "pickup",
    thTracking: "TH987654321",
    paymentStatus: "paid",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    parcelRef: "P2024002",
    receiveDate: "2024-01-16",
    customerCode: "C001",
    shipment: "SH2024002",
    estimate: 2200,
    status: "pending",
    cnTracking: "CN987654321",
    volume: 0.8,
    weight: 3.2,
    freight: 450,
    deliveryMethod: "delivery",
    paymentStatus: "unpaid",
    createdAt: "2024-01-16T09:30:00Z",
    updatedAt: "2024-01-16T09:30:00Z",
  },
  {
    id: "3",
    parcelRef: "P2024003",
    receiveDate: "2024-01-17",
    customerCode: "C001",
    shipment: "SH2024003",
    estimate: 3200,
    status: "delivered",
    cnTracking: "CN456789123",
    volume: 1.2,
    weight: 4.8,
    freight: 650,
    deliveryMethod: "express",
    thTracking: "TH123456789",
    paymentStatus: "paid",
    createdAt: "2024-01-17T11:15:00Z",
    updatedAt: "2024-01-17T11:15:00Z",
  },
  {
    id: "4",
    parcelRef: "P2024004",
    receiveDate: "2024-01-18",
    customerCode: "C001",
    shipment: "SH2024004",
    estimate: 1800,
    status: "pending",
    cnTracking: "CN789123456",
    volume: 0.6,
    weight: 2.8,
    freight: 380,
    deliveryMethod: "pickup",
    paymentStatus: "partial",
    createdAt: "2024-01-18T14:20:00Z",
    updatedAt: "2024-01-18T14:20:00Z",
  },
  {
    id: "5",
    parcelRef: "P2024005",
    receiveDate: "2024-01-19",
    customerCode: "C001",
    shipment: "SH2024005",
    estimate: 2800,
    status: "shipped",
    cnTracking: "CN321654987",
    volume: 1.0,
    weight: 4.2,
    freight: 580,
    deliveryMethod: "delivery",
    thTracking: "TH456789123",
    paymentStatus: "paid",
    createdAt: "2024-01-19T09:45:00Z",
    updatedAt: "2024-01-19T09:45:00Z",
  },
  {
    id: "6",
    parcelRef: "P2024006",
    receiveDate: "2024-01-20",
    customerCode: "C001",
    shipment: "SH2024006",
    estimate: 4200,
    status: "cancelled",
    cnTracking: "CN654987321",
    volume: 1.5,
    weight: 6.0,
    freight: 750,
    deliveryMethod: "express",
    paymentStatus: "unpaid",
    createdAt: "2024-01-20T16:30:00Z",
    updatedAt: "2024-01-20T16:30:00Z",
  },
  {
    id: "7",
    parcelRef: "P2024007",
    receiveDate: "2024-01-21",
    customerCode: "C001",
    shipment: "SH2024007",
    estimate: 1950,
    status: "shipped",
    cnTracking: "CN147258369",
    volume: 0.7,
    weight: 3.1,
    freight: 420,
    deliveryMethod: "pickup",
    thTracking: "TH789123456",
    paymentStatus: "paid",
    createdAt: "2024-01-21T11:10:00Z",
    updatedAt: "2024-01-21T11:10:00Z",
  },
  {
    id: "8",
    parcelRef: "P2024008",
    receiveDate: "2024-01-22",
    customerCode: "C001",
    shipment: "SH2024008",
    estimate: 3600,
    status: "delivered",
    cnTracking: "CN963852741",
    volume: 1.3,
    weight: 5.2,
    freight: 680,
    deliveryMethod: "delivery",
    thTracking: "TH852963741",
    paymentStatus: "paid",
    createdAt: "2024-01-22T13:25:00Z",
    updatedAt: "2024-01-22T13:25:00Z",
  },
  {
    id: "9",
    parcelRef: "P2024009",
    receiveDate: "2024-01-23",
    customerCode: "C001",
    shipment: "SH2024009",
    estimate: 2400,
    status: "pending",
    cnTracking: "CN741852963",
    volume: 0.9,
    weight: 3.8,
    freight: 520,
    deliveryMethod: "express",
    paymentStatus: "unpaid",
    createdAt: "2024-01-23T08:15:00Z",
    updatedAt: "2024-01-23T08:15:00Z",
  },
  {
    id: "10",
    parcelRef: "P2024010",
    receiveDate: "2024-01-24",
    customerCode: "C001",
    shipment: "SH2024010",
    estimate: 5200,
    status: "shipped",
    cnTracking: "CN159753486",
    volume: 2.1,
    weight: 7.5,
    freight: 920,
    deliveryMethod: "delivery",
    thTracking: "TH159753486",
    paymentStatus: "partial",
    createdAt: "2024-01-24T15:40:00Z",
    updatedAt: "2024-01-24T15:40:00Z",
  },
  // Additional customer parcels for better UI testing
  {
    id: "11",
    parcelRef: "P2024011",
    receiveDate: "2024-01-25",
    customerCode: "C001",
    shipment: "SH2024011",
    estimate: 1200,
    status: "pending",
    cnTracking: "CN111222333",
    volume: 0.4,
    weight: 1.8,
    freight: 250,
    deliveryMethod: "pickup",
    paymentStatus: "unpaid",
    createdAt: "2024-01-25T09:00:00Z",
    updatedAt: "2024-01-25T09:00:00Z",
  },
  {
    id: "12",
    parcelRef: "P2024012",
    receiveDate: "2024-01-26",
    customerCode: "C001",
    shipment: "SH2024012",
    estimate: 3800,
    status: "shipped",
    cnTracking: "CN444555666",
    volume: 1.4,
    weight: 5.5,
    freight: 720,
    deliveryMethod: "express",
    thTracking: "TH444555666",
    paymentStatus: "paid",
    createdAt: "2024-01-26T14:30:00Z",
    updatedAt: "2024-01-26T14:30:00Z",
  },
  {
    id: "13",
    parcelRef: "P2024013",
    receiveDate: "2024-01-27",
    customerCode: "C001",
    shipment: "SH2024013",
    estimate: 2600,
    status: "delivered",
    cnTracking: "CN777888999",
    volume: 0.9,
    weight: 3.6,
    freight: 480,
    deliveryMethod: "delivery",
    thTracking: "TH777888999",
    paymentStatus: "paid",
    createdAt: "2024-01-27T11:45:00Z",
    updatedAt: "2024-01-27T11:45:00Z",
  },
  {
    id: "14",
    parcelRef: "P2024014",
    receiveDate: "2024-01-28",
    customerCode: "C001",
    shipment: "SH2024014",
    estimate: 4500,
    status: "pending",
    cnTracking: "CN101112131",
    volume: 1.8,
    weight: 6.8,
    freight: 850,
    deliveryMethod: "express",
    paymentStatus: "partial",
    createdAt: "2024-01-28T16:20:00Z",
    updatedAt: "2024-01-28T16:20:00Z",
  },
  {
    id: "15",
    parcelRef: "P2024015",
    receiveDate: "2024-01-29",
    customerCode: "C001",
    shipment: "SH2024015",
    estimate: 1750,
    status: "shipped",
    cnTracking: "CN141516171",
    volume: 0.6,
    weight: 2.9,
    freight: 350,
    deliveryMethod: "pickup",
    thTracking: "TH141516171",
    paymentStatus: "paid",
    createdAt: "2024-01-29T10:15:00Z",
    updatedAt: "2024-01-29T10:15:00Z",
  },
  // Other customers' parcels
  {
    id: "16",
    parcelRef: "P2024016",
    receiveDate: "2024-01-20",
    customerCode: "C002",
    shipment: "SH2024016",
    estimate: 2100,
    status: "delivered",
    cnTracking: "CN181920212",
    volume: 0.8,
    weight: 3.4,
    freight: 420,
    deliveryMethod: "delivery",
    thTracking: "TH181920212",
    paymentStatus: "paid",
    createdAt: "2024-01-20T12:30:00Z",
    updatedAt: "2024-01-20T12:30:00Z",
  },
  {
    id: "17",
    parcelRef: "P2024017",
    receiveDate: "2024-01-21",
    customerCode: "C003",
    shipment: "SH2024017",
    estimate: 3300,
    status: "pending",
    cnTracking: "CN222324252",
    volume: 1.1,
    weight: 4.5,
    freight: 650,
    deliveryMethod: "express",
    paymentStatus: "unpaid",
    createdAt: "2024-01-21T15:45:00Z",
    updatedAt: "2024-01-21T15:45:00Z",
  },
  {
    id: "18",
    parcelRef: "P2024018",
    receiveDate: "2024-01-22",
    customerCode: "C004",
    shipment: "SH2024018",
    estimate: 1900,
    status: "shipped",
    cnTracking: "CN262728293",
    volume: 0.7,
    weight: 3.0,
    freight: 380,
    deliveryMethod: "pickup",
    thTracking: "TH262728293",
    paymentStatus: "paid",
    createdAt: "2024-01-22T09:20:00Z",
    updatedAt: "2024-01-22T09:20:00Z",
  },
  {
    id: "19",
    parcelRef: "P2024019",
    receiveDate: "2024-01-23",
    customerCode: "C005",
    shipment: "SH2024019",
    estimate: 4100,
    status: "delivered",
    cnTracking: "CN303132333",
    volume: 1.6,
    weight: 6.2,
    freight: 780,
    deliveryMethod: "delivery",
    thTracking: "TH303132333",
    paymentStatus: "paid",
    createdAt: "2024-01-23T13:10:00Z",
    updatedAt: "2024-01-23T13:10:00Z",
  },
  {
    id: "20",
    parcelRef: "P2024020",
    receiveDate: "2024-01-24",
    customerCode: "C002",
    shipment: "SH2024020",
    estimate: 2750,
    status: "cancelled",
    cnTracking: "CN343536373",
    volume: 1.0,
    weight: 4.1,
    freight: 520,
    deliveryMethod: "express",
    paymentStatus: "unpaid",
    createdAt: "2024-01-24T11:55:00Z",
    updatedAt: "2024-01-24T11:55:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")
    const status = searchParams.get("status")
    const paymentStatus = searchParams.get("paymentStatus")
    const trackingNo = searchParams.get("trackingNo")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const customerCode = searchParams.get("customerCode")

    console.log("API Params:", { page, pageSize, status, paymentStatus, trackingNo, dateFrom, dateTo, customerCode })

    // Filter mock data based on query parameters
    let filteredParcels = [...mockParcels]

    // Filter by customerCode if provided (for customer role)
    if (customerCode && customerCode !== "") {
      filteredParcels = filteredParcels.filter((p) => p.customerCode === customerCode)
      console.log("Filtered by customerCode:", filteredParcels.length)
    }

    if (status && status !== "" && status !== "all") {
      filteredParcels = filteredParcels.filter((p) => p.status === status)
      console.log("Filtered by status:", filteredParcels.length)
    }

    if (paymentStatus && paymentStatus !== "" && paymentStatus !== "all") {
      filteredParcels = filteredParcels.filter((p) => p.paymentStatus === paymentStatus)
      console.log("Filtered by paymentStatus:", filteredParcels.length)
    }

    if (trackingNo && trackingNo !== "") {
      filteredParcels = filteredParcels.filter(
        (p) =>
          p.cnTracking.toLowerCase().includes(trackingNo.toLowerCase()) ||
          (p.thTracking && p.thTracking.toLowerCase().includes(trackingNo.toLowerCase())) ||
          p.parcelRef.toLowerCase().includes(trackingNo.toLowerCase()),
      )
      console.log("Filtered by trackingNo:", filteredParcels.length)
    }

    if (dateFrom && dateTo) {
      filteredParcels = filteredParcels.filter((p) => {
        const receiveDate = new Date(p.receiveDate)
        const fromDate = new Date(dateFrom)
        const toDate = new Date(dateTo)
        return receiveDate >= fromDate && receiveDate <= toDate
      })
      console.log("Filtered by date range:", filteredParcels.length)
    }

    // Pagination
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedParcels = filteredParcels.slice(startIndex, endIndex)

    console.log("Final result:", { total: filteredParcels.length, returned: paginatedParcels.length })

    const response: ParcelListResponse = {
      parcels: paginatedParcels,
      total: filteredParcels.length,
      page,
      pageSize,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
