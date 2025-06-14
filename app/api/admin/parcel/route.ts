import { NextResponse } from "next/server";
import type { Parcel } from "@/lib/types";
import { mockParcels } from "../utils";

export async function POST(request: Request) {
  const formData = await request.formData();
  const parcelJson = formData.get("parcel") as string | null;
  if (!parcelJson) {
    return NextResponse.json({ success: false, message: "Missing parcel data" }, { status: 400 });
  }
  const parcelData = JSON.parse(parcelJson) as Omit<Parcel, "id" | "createdAt" | "updatedAt">;
  const images = formData.getAll("images") as File[];
  const imageUrls = images.map((f) => `/uploads/${f.name}`);
  const newParcel: Parcel = {
    ...parcelData,
    id: String(mockParcels.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "pending",
    paymentStatus: "unpaid",
    images: imageUrls,
  };
  mockParcels.push(newParcel);
  return NextResponse.json({ success: true, parcel: newParcel });
}
