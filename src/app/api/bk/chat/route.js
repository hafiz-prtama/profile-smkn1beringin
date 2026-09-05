import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const ticketId = url.searchParams.get('ticketId');
    if (!ticketId) return NextResponse.json({ error: "No ticketId" }, { status: 400 });

    const messages = await prisma.consultationMessage.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get('bk_token')?.value;
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

    const { ticketId, text, isAction, actionType } = await request.json();
    if (!ticketId) return NextResponse.json({ error: "No ticketId" }, { status: 400 });

    const ticket = await prisma.consultationTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Handle Unmasking Action Confirmation from User
    if (userRole === 'user' && actionType === 'AGREE_UNMASK') {
      await prisma.consultationTicket.update({
        where: { id: ticketId },
        data: { isUnmasked: true }
      });
      // System message
      await prisma.consultationMessage.create({
        data: {
          ticketId,
          sender: "SYSTEM",
          text: "Siswa telah menyetujui sesi offline. Identitas telah dibuka kepada Guru BK."
        }
      });
      return NextResponse.json({ success: true });
    }

    // Handle Accepting Ticket by Admin
    if (isAdmin && actionType === 'ACCEPT_TICKET') {
      await prisma.consultationTicket.update({
        where: { id: ticketId },
        data: { status: 'ACTIVE' }
      });
      return NextResponse.json({ success: true });
    }

    // Normal message logic
    const sender = isAdmin ? "ADMIN_BK" : "USER";

    const newMessage = await prisma.consultationMessage.create({
      data: {
        ticketId,
        sender,
        text,
        isAction: isAction || false
      }
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
