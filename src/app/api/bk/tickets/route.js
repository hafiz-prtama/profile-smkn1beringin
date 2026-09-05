import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const adminRole = request.headers.get('x-admin-role');
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId'); // Anonymous client ID

    const isAdmin = adminRole === 'admin_bk' || adminRole === 'super_admin';

    if (isAdmin) {
      // Fetch all tickets
      const tickets = await prisma.consultationTicket.findMany({
        orderBy: { createdAt: 'desc' }
      });

      // Expire old pending tickets (72 hours logic)
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - (72 * 60 * 60 * 1000));
      
      const mapped = tickets.map(t => {
        // Auto-close if pending > 72 hours
        if (t.status === 'PENDING' && new Date(t.createdAt) < threeDaysAgo) {
          t.status = 'CLOSED';
        }
        
        return {
          id: t.id,
          pseudoId: t.pseudoId,
          userType: t.userType,
          categories: t.categories,
          complaint: t.complaint,
          status: t.status,
          isUnmasked: t.isUnmasked,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt
        };
      });

      return NextResponse.json({ success: true, tickets: mapped });
    } else {
      // Fetch only anonymous user's tickets
      if (!userId) {
        return NextResponse.json({ success: true, tickets: [] });
      }

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
    const { userId, userType, categories, complaint } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized / Missing User ID" }, { status: 403 });
    }

    // Max 3 categories
    const catArray = Array.isArray(categories) ? categories : JSON.parse(categories || "[]");
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

    // Generate pseudo ID
    const typeLabel = userType === 'orang_tua' ? 'Ortu' : 'Siswa';
    const pseudoId = `${typeLabel}-${Math.floor(Math.random() * 9000) + 1000}`;

    const newTicket = await prisma.consultationTicket.create({
      data: {
        userId,
        userType: userType === 'orang_tua' ? 'orang_tua' : 'siswa',
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
