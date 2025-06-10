import { type NextRequest, NextResponse } from "next/server"

interface TrackingEvent {
  date: string
  status: string
  description: string
  location?: string
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock tracking events
    const mockTrackingEvents: TrackingEvent[] = [
      {
        date: "2024-01-15T10:00:00Z",
        status: "received",
        description: "รับพัสดุที่โกดังจีน",
        location: "Guangzhou, China",
      },
      {
        date: "2024-01-16T14:30:00Z",
        status: "shipped",
        description: "ส่งออกจากจีน",
        location: "Guangzhou Port, China",
      },
      {
        date: "2024-01-18T09:15:00Z",
        status: "in_transit",
        description: "อยู่ระหว่างการขนส่ง",
        location: "ในเรือ",
      },
      {
        date: "2024-01-22T16:45:00Z",
        status: "arrived",
        description: "มาถึงประเทศไทย",
        location: "Laem Chabang Port, Thailand",
      },
    ]

    return NextResponse.json({
      success: true,
      trackingEvents: mockTrackingEvents,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการดึงข้อมูล tracking",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
