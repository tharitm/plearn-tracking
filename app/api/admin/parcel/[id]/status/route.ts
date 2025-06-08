import { NextResponse } from 'next/server';
import type { Parcel } from '@/lib/types';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const parcelId = params.id;
    if (!parcelId) {
      return NextResponse.json({ message: 'Parcel ID is required' }, { status: 400 });
    }
    const { status } = await request.json() as { status: Parcel['status'] };
    if (!status) {
      // Basic validation for allowed status values
      const allowedStatuses: Parcel['status'][] = ["pending", "shipped", "delivered", "cancelled"];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json({ message: `Invalid status value. Must be one of: ${allowedStatuses.join(", ")}` }, { status: 400 });
      }
      return NextResponse.json({ message: 'Status is required' }, { status: 400 });
    }
    // In a real app, you'd validate status and update the database
    console.log(`Updating status for parcel ${parcelId} to: ${status}`);
    // Simulate update
    return NextResponse.json({ message: `Parcel ${parcelId} status updated to ${status}` }, { status: 200 });
  } catch (error) {
    console.error('Error updating parcel status:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error updating parcel status' }, { status: 500 });
  }
}
