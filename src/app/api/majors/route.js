import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const majors = await prisma.major.findMany();
    return NextResponse.json(majors);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    
    // Simplest way to "bulk replace" is delete all and insert
    await prisma.major.deleteMany();
    
    if (data.length > 0) {
      await prisma.major.createMany({
        data: data.map(m => ({
          id: m.id || undefined,
          short: m.short,
          name: m.name,
          description: m.description,
          skills: m.skills,
          career: m.career,
          image: m.image,
        }))
      });
    }
    
    const majors = await prisma.major.findMany();
    return NextResponse.json(majors);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
