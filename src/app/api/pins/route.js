import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const pins = await prisma.pin.findMany({
      orderBy: { role: 'asc' }
    });
    return NextResponse.json({ success: true, pins });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { role, name, pin } = await request.json();
    if (!pin || pin.length !== 4) return NextResponse.json({ error: "PIN harus 4 digit angka" }, { status: 400 });

    const newPin = await prisma.pin.create({
      data: { role, name, pin }
    });
    return NextResponse.json({ success: true, pin: newPin });
  } catch (error) {
    if (error.code === 'P2002') return NextResponse.json({ error: "PIN ini sudah digunakan" }, { status: 400 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const dataList = await request.json(); // We'll receive the entire list of pins
    
    // Simplest CRUD for Prisma with lists: Delete all and recreate, or update one by one.
    // For safety, let's update one by one if it's an array, but actually it's safer to clear and recreate if ID is not strict, 
    // OR we can just accept an array and do a transaction.
    
    await prisma.$transaction(async (tx) => {
      // Get existing
      const existing = await tx.pin.findMany();
      const incomingIds = dataList.map(p => p.id).filter(Boolean);
      
      // Delete missing
      for (const e of existing) {
        if (!incomingIds.includes(e.id)) {
          await tx.pin.delete({ where: { id: e.id } });
        }
      }
      
      // Upsert incoming
      for (const p of dataList) {
        if (p.id && existing.some(e => e.id === p.id)) {
          await tx.pin.update({
            where: { id: p.id },
            data: { role: p.role, name: p.name, pin: p.pin }
          });
        } else {
          await tx.pin.create({
            data: { role: p.role, name: p.name, pin: p.pin }
          });
        }
      }
    });

    const updatedPins = await prisma.pin.findMany({ orderBy: { role: 'asc' } });
    return NextResponse.json({ success: true, pins: updatedPins });
  } catch (error) {
    if (error.code === 'P2002') return NextResponse.json({ error: "Ada PIN duplikat yang dimasukkan" }, { status: 400 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
