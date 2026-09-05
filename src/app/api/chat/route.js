import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Fungsi untuk membersihkan sesi yang kedaluwarsa atau ditolak
async function cleanupSessions() {
  const now = new Date();
  
  // Hapus sesi PENDING yang usianya > 24 jam, atau ACTIVE yang > 72 jam
  // Atau yang statusnya REJECTED (langsung dihapus agar kereset di sisi user)
  await prisma.chatSession.deleteMany({
    where: {
      OR: [
        { status: 'REJECTED' },
        { expiresAt: { lt: now } }
      ]
    }
  });
}

// GET: Mengambil semua sesi aktif (Untuk Dashboard Admin)
export async function GET() {
  await cleanupSessions();
  
  try {
    const sessions = await prisma.chatSession.findMany({
      where: {
        status: { in: ['PENDING', 'ACTIVE'] }
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    
    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Mendapatkan sesi aktif untuk user tertentu (Untuk ChatBox User)
export async function POST(request) {
  await cleanupSessions();
  
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 });
    }
    
    // Cari sesi yang aktif atau pending
    let session = await prisma.chatSession.findFirst({
      where: {
        userId: userId,
        status: { in: ['PENDING', 'ACTIVE'] }
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    
    return NextResponse.json({ success: true, session });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
