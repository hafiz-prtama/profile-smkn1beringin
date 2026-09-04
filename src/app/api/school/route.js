import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let school = await prisma.school.findFirst();
    if (!school) {
      school = await prisma.school.create({ data: { name: "Sekolah Default", location: "", tagline: "", description: "" } });
    }
    // format to match context shape
    const formatted = {
      ...school,
      principal: {
        name: school.principalName,
        photo: school.principalPhoto,
        greeting: school.principalGreeting,
      },
      vicePrincipal: {
        name: school.vicePrincipalName,
        photo: school.vicePrincipalPhoto,
      }
    };
    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const school = await prisma.school.findFirst();
    
    await prisma.school.update({
      where: { id: school.id },
      data: {
        name: data.name,
        location: data.location,
        tagline: data.tagline,
        description: data.description,
        studentCount: data.studentCount,
        teacherCount: data.teacherCount,
        achievementCount: data.achievementCount,
        majorCount: data.majorCount,
        coverPhoto: data.coverPhoto,
        principalName: data.principal?.name,
        principalPhoto: data.principal?.photo,
        principalGreeting: data.principal?.greeting,
        vicePrincipalName: data.vicePrincipal?.name,
        vicePrincipalPhoto: data.vicePrincipal?.photo,
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
