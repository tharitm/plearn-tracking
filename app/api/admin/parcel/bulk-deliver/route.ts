import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { ids } = await request.json() as { ids: string[] };
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: 'Array of parcel IDs is required' }, { status: 400 });
    }
    // In a real app, you'd update the status for each ID in the database to 'delivered'
    console.log('Bulk marking parcels as delivered for IDs:', ids);
    // Simulate update for each ID
    const results = ids.map(id => ({ id, status: 'delivered', message: `Parcel ${id} marked as delivered.` }));

    return NextResponse.json({
      message: `${ids.length} parcels processed for delivery.`,
      results
    }, { status: 200 });
  } catch (error) {
    console.error('Error in bulk delivering parcels:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error in bulk delivering parcels' }, { status: 500 });
  }
}
