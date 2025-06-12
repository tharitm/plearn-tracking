import { type NextRequest, NextResponse } from "next/server";
import type { ParcelListResponse } from "@/lib/types";
import { getParcelListResponse } from "../utils";
import { ApiResponse } from "@/lib/apiTypes";

// This route returns mock parcel data using helpers from ../utils
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10");
    const status = searchParams.get("status") || undefined;
    const paymentStatus = searchParams.get("paymentStatus") || undefined;
    const trackingNo = searchParams.get("trackingNo") || undefined;
    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;
    const customerCode = searchParams.get("customerCode") || undefined;

    const response: ApiResponse<ParcelListResponse> = getParcelListResponse({
      page,
      pageSize,
      status,
      paymentStatus,
      trackingNo,
      dateFrom,
      dateTo,
      customerCode,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
