import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { parcels } = await request.json()

    // Mock API - In real app, bulk insert to database
    console.log("Importing parcels from Excel:", parcels)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return NextResponse.json({
      success: true,
      message: `นำเข้าข้อมูล ${parcels.length} รายการสำเร็จ`,
      imported: parcels.length,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการนำเข้าข้อมูล",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
