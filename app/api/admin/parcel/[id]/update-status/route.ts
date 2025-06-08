import { NextResponse } from 'next/server';

const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const parcelId = params.id;
    const { status: newStatus } = await request.json();

    // Input Validation
    if (!parcelId) {
      // This case should ideally be handled by Next.js routing if the folder structure is correct
      return NextResponse.json({ message: "Invalid input: Parcel ID is required" }, { status: 400 });
    }

    if (!newStatus || !validStatuses.includes(newStatus)) {
      return NextResponse.json({ message: `Invalid input: newStatus is required and must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
    }

    // Simulate Database Update
    console.log(`API: Updating parcel ${parcelId} to status '${newStatus}'`);

    // Placeholder for actual database logic
    // For example, you would typically interact with your database service here:
    // const updatedParcel = await db.parcel.update({
    //   where: { id: parcelId },
    //   data: { status: newStatus },
    // });
    // if (!updatedParcel) {
    //   return NextResponse.json({ message: "Parcel not found" }, { status: 404 });
    // }

    // Return Success Response
    return NextResponse.json({ message: "Parcel status updated successfully", parcelId, newStatus }, { status: 200 });

  } catch (error) {
    console.error(`Error in parcel [${params.id}] update-status API:`, error);
    return NextResponse.json({ message: "Error updating parcel status", error: (error as Error).message }, { status: 500 });
  }
}
