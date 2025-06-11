import { type NextRequest, NextResponse } from 'next/server';
import type { CustomerListResponse } from '@/lib/types';
import { getCustomerListResponse } from '../utils';
import { ApiResponse } from '@/lib/apiTypes';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');
    const name = searchParams.get('name') || undefined;
    const email = searchParams.get('email') || undefined;
    const status = searchParams.get('status') || undefined;

    const response: ApiResponse<CustomerListResponse> = getCustomerListResponse({
      page,
      limit,
      name,
      email,
      status: status as any,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
