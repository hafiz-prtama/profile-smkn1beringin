import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const facilities = await prisma.facility.findMany();
    return NextResponse.json(facilities);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    
    await prisma.facility.deleteMany();
    
    if (data.length > 0) {
      await prisma.facility.createMany({
        data: data.map(f => ({
          id: String(f.id),
          name: f.name,
          description: f.description,
          image: f.image,
        }))
      });
    }
    
    const facilities = await prisma.facility.findMany();
    return NextResponse.json(facilities);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
