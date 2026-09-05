import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { action } = await request.json();
    const sessionId = (await params).id;

    if (!action || !sessionId) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    if (!session) return NextResponse.json({ success: false, message: "Session not found" }, { status: 404 });

    if (action === 'ACCEPT') {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 72); // Perpanjang jadi 72 jam jika di-ACC
      
      const updated = await prisma.chatSession.update({
        where: { id: sessionId },
        data: { status: 'ACTIVE', expiresAt }
      });
      return NextResponse.json({ success: true, session: updated });
    } 
    else if (action === 'REJECT' || action === 'END') {
      // Hapus sesi dari database secara langsung agar kereset di sisi user (dan tidak memenuhi db)
      await prisma.chatSession.delete({
        where: { id: sessionId }
      });
      return NextResponse.json({ success: true, deleted: true });
    }
    
    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
