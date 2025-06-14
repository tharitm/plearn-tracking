import { NextResponse } from "next/server";
import type { Parcel } from "@/lib/types";
import { mockParcels } from "../../utils";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const formData = await request.formData();
  const parcelJson = formData.get("parcel") as string | null;
  const images = formData.getAll("images") as File[];
  const index = mockParcels.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ success: false, message: "Parcel not found" }, { status: 404 });
  }
  const existing = mockParcels[index];
  const imageUrls = images.map((f) => `/uploads/${f.name}`);
  const updateData = parcelJson ? JSON.parse(parcelJson) : {};
  const updated: Parcel = {
    ...existing,
    ...updateData,
    images: imageUrls.length > 0 ? [...(existing.images || []), ...imageUrls] : existing.images,
    updatedAt: new Date().toISOString(),
  };
  mockParcels[index] = updated;
  return NextResponse.json({ success: true, parcel: updated });
}
