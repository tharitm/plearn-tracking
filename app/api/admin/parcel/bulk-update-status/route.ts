import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { parcelIds } = await request.json();

    // Input Validation
    if (!Array.isArray(parcelIds) || parcelIds.length === 0) {
      return NextResponse.json({ message: "Invalid input: parcelIds must be a non-empty array" }, { status: 400 });
    }

    // Simulate Database Update
    console.log("API: Bulk updating status to 'delivered' for parcel IDs:", parcelIds);

    // Placeholder for actual database logic
    // For example, you would typically interact with your database service here:
    // await db.parcels.updateMany({
    //   where: { id: { in: parcelIds } },
    //   data: { status: 'delivered' },
    // });

    parcelIds.forEach((id: string) => {
      console.log(`Parcel ${id} status updated to delivered.`);
    });

    // Return Success Response
    return NextResponse.json({ message: "Bulk status update successful", updatedIds: parcelIds }, { status: 200 });

  } catch (error) {
    console.error("Error in bulk-update-status API:", error);
    return NextResponse.json({ message: "Error updating parcel statuses", error: (error as Error).message }, { status: 500 });
  }
}
