import { NextResponse } from 'next/server';
import type { Parcel } from '@/lib/types'; // Assuming Parcel type is available

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const parcelId = params.id;
    if (!parcelId) {
      return NextResponse.json({ message: 'Parcel ID is required' }, { status: 400 });
    }
    const body = await request.json();
    // In a real app, you'd validate body and update the database
    console.log(`Updating parcel ${parcelId} with data:`, body);
    // Simulate update
    const updatedParcel: Partial<Parcel> = { id: parcelId, ...body };
    return NextResponse.json(updatedParcel, { status: 200 });
  } catch (error) {
    console.error('Error updating parcel:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error updating parcel' }, { status: 500 });
  }
}
