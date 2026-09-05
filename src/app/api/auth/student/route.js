import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { nisn, password } = await request.json();
    
    // Simplification for prototype: password might just be checked against NISN or basic rule
    // In production, use bcrypt
    let user = await prisma.user.findUnique({ where: { nisn } });

    // Auto-create user for prototype if doesn't exist (just to make testing easy)
    if (!user) {
      if (password === '123456') { // Dummy password rule
        user = await prisma.user.create({
          data: {
            nisn,
            name: `Siswa ${nisn}`,
            password: 'hashed_password_dummy',
            role: 'user'
          }
        });
      } else {
        return NextResponse.json({ success: false, message: "Kredensial tidak valid" }, { status: 401 });
      }
    }

    // Assign Token
    const token = await signToken({ id: user.id, nisn: user.nisn, role: user.role });
    
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, nisn: user.nisn, name: user.name, role: user.role }
    });

    response.cookies.set({
      name: 'bk_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
