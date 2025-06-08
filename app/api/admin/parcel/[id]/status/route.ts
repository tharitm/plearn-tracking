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

    // For simulation, we'll create a mock parcel object with the updated status:
    const mockUpdatedParcel: Partial<Parcel> = {
      id: parcelId,
      status: status,
      // Add other fields with placeholder values if they are expected by the frontend
      parcelRef: "SIMULATED_REF", // Placeholder
      receiveDate: new Date().toISOString(), // Placeholder
      customerCode: "SIM_CUSTOMER", // Placeholder
      shipment: "SIM_SHIPMENT", // Placeholder
      estimate: 0, // Placeholder
      // Ensure all fields from Parcel type are present if needed, or use a fetched original object
      // For example, if these were part of Parcel type and required:
      name: "Simulated Parcel",
      address: "123 Simulated St",
      city: "Simulation City",
      country: "Simuland",
      phone: "555-SIMULATE",
      paymentStatus: "paid", // default or fetched
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingNo: `SIM-${parcelId.substring(0, 8)}`,
      weight: 1.0, // Placeholder
      dimensions: "10x10x10", // Placeholder
      notes: "Simulated update", // Placeholder
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
