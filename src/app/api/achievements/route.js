import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(achievements);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    
    await prisma.achievement.deleteMany();
    
    if (data.length > 0) {
      await prisma.achievement.createMany({
        data: data.map(a => ({
          id: String(a.id),
          title: a.title,
          category: a.category,
          year: String(a.year),
          description: a.description,
          image: a.image,
        }))
      });
    }
    
    const achievements = await prisma.achievement.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(achievements);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
