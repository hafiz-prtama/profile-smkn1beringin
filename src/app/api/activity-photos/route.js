import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const photos = await prisma.activityPhoto.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(photos);
  } catch (error) {
    console.error("GET activity-photos error:", error);
    return NextResponse.json({ error: "Gagal mengambil foto kegiatan" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { image } = await req.json();
    if (!image) {
      return NextResponse.json({ error: "Gambar wajib diisi" }, { status: 400 });
    }

    // Check count to limit to 10 photos
    const currentCount = await prisma.activityPhoto.count();
    if (currentCount >= 10) {
      return NextResponse.json({ error: "Maksimal 10 foto kegiatan yang diizinkan" }, { status: 400 });
    }

    // Determine new order
    const lastPhoto = await prisma.activityPhoto.findFirst({
      orderBy: { order: 'desc' },
    });
    const newOrder = lastPhoto ? lastPhoto.order + 1 : 0;

    const newPhoto = await prisma.activityPhoto.create({
      data: {
        image,
        order: newOrder,
      },
    });
    return NextResponse.json(newPhoto);
  } catch (error) {
    console.error("POST activity-photos error:", error);
    return NextResponse.json({ error: "Gagal menambahkan foto kegiatan" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
    }

    await prisma.activityPhoto.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE activity-photos error:", error);
    return NextResponse.json({ error: "Gagal menghapus foto kegiatan" }, { status: 500 });
  }
}
