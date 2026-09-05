import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { userId, text, sender = "USER" } = await request.json();
    
    if (!userId || !text) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }
    
    // Cari sesi yang aktif/pending
    let session = await prisma.chatSession.findFirst({
      where: {
        userId: userId,
        status: { in: ['PENDING', 'ACTIVE'] }
      }
    });
    
    // Jika tidak ada, buat baru
    if (!session) {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // Default: 24 jam untuk PENDING
      
      session = await prisma.chatSession.create({
        data: {
          userId,
          status: 'PENDING',
          expiresAt
        }
      });
    }
    
    // Simpan pesan
    const message = await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender,
        text
      }
    });
    
    return NextResponse.json({ success: true, message, session });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
