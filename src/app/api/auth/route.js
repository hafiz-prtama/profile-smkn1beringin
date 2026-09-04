import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { pin } = await request.json();
    
    // Check pin in DB
    const foundPin = await prisma.pin.findUnique({
      where: { pin: pin }
    });

    if (foundPin) {
      return NextResponse.json({
        success: true,
        role: {
          type: foundPin.role,
          name: foundPin.name
        }
      });
    }

    return NextResponse.json({ success: false, message: "PIN salah" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
