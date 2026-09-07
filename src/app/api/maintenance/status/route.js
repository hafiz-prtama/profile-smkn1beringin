import { NextResponse } from 'next/server';
import { getMaintenanceStatus, setMaintenanceStatus } from '@/lib/maintenance';

export async function GET() {
  const status = getMaintenanceStatus();
  return NextResponse.json(status);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const current = getMaintenanceStatus();

    const updated = {
      ...current,
      ...body,
      updatedAt: new Date().toISOString()
    };

    setMaintenanceStatus(updated);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
