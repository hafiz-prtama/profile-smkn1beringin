import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const res = await fetch(new URL('/api/maintenance/status', request.url));
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ enabled: false }, { status: 500 });
  }
}
