import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get('bk_token')?.value;
    // We will also accept a simple header for admin since admin is PIN based in the prototype
    const adminRole = request.headers.get('x-admin-role'); 
    
    let userId = null;
    let userRole = null;

    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        userId = payload.id;
        userRole = payload.role;
      }
    }

    const isAdmin = adminRole === 'admin_bk' || adminRole === 'super_admin';

    if (!isAdmin && userRole !== 'user') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (isAdmin) {
      // Fetch all tickets
      const tickets = await prisma.consultationTicket.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      });

      // Expire old pending tickets (2-3 days logic -> let's say 3 days)
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
      
      const mapped = tickets.map(t => {
        // Auto-close if pending > 3 days
        if (t.status === 'PENDING' && new Date(t.createdAt) < threeDaysAgo) {
          t.status = 'CLOSED'; // In a real app we'd save this to DB here
        }
        
        return {
          id: t.id,
          pseudoId: t.pseudoId,
          categories: t.categories,
          complaint: t.complaint,
          status: t.status,
          isUnmasked: t.isUnmasked,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
          // Only show real user data if unmasked
          user: t.isUnmasked ? { nisn: t.user.nisn, name: t.user.name } : null
        };
      });

      return NextResponse.json({ success: true, tickets: mapped });
    } else {
      // Fetch only user's tickets
      const tickets = await prisma.consultationTicket.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json({ success: true, tickets });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get('bk_token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'user') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const userId = payload.id;
    const { categories, complaint } = await request.json();

    // Max 3 categories
    const catArray = Array.isArray(categories) ? categories : JSON.parse(categories);
    if (catArray.length === 0 || catArray.length > 3) {
      return NextResponse.json({ error: "Pilih 1 hingga 3 kategori" }, { status: 400 });
    }

    // Check limit
    const activeCount = await prisma.consultationTicket.count({
      where: {
        userId,
        status: { in: ['PENDING', 'ACTIVE'] }
      }
    });

    if (activeCount >= 2) {
      return NextResponse.json({ error: "Maksimal 2 tiket aktif tercapai" }, { status: 429 });
    }

    const pseudoId = `Siswa-${Math.floor(Math.random() * 9000) + 1000}`;

    const newTicket = await prisma.consultationTicket.create({
      data: {
        userId,
        pseudoId,
        categories: JSON.stringify(catArray),
        complaint
      }
    });

    return NextResponse.json({ success: true, ticket: newTicket });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
