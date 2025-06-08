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
      const allowedStatuses: Parcel['status'][] = ["pending", "shipped", "delivered", "cancelled"];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json({ message: `Invalid status value. Must be one of: ${allowedStatuses.join(", ")}` }, { status: 400 });
      }
      return NextResponse.json({ message: 'Status is required' }, { status: 400 });
    }
    console.log(`Updating status for parcel ${parcelId} to: ${status}`);

    // For simulation, we'll create a mock parcel object with the updated status:
    const mockUpdatedParcel: Partial<Parcel> = {
      id: parcelId,
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
    };
    return NextResponse.json(mockUpdatedParcel, { status: 200 });
  } catch (error) {
    console.error('Error updating parcel status:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error updating parcel status' }, { status: 500 });
  }
}
