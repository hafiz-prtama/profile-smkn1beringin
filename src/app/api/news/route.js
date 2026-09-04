import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    
    // To support partial updates (e.g. from major representative vs admin)
    // Actually the frontend sends the full list of what they see?
    // Wait, if frontend is super_user, they only see their own news, and when they save, they send only their news.
    // If we deleteMany, we might delete other news!
    // We should only replace the news that they sent, OR we should upsert and delete the ones they deleted.
    // Given the simple array replacement logic in the frontend:
    // "updateNews(list)" updates the context with the full list.
    // In DataContext, updateNews replaces everything. But wait, `TabBerita` filters visible news before editing!
    
    // Let's implement upsert & delete for news instead of replace all.
    // We get the list of items to save, and a list of IDs to keep.
    
    // Since the frontend just sends `data` as the new array, if it's admin, they send ALL news.
    // If it's major, they send ONLY their news. We need a way to distinguish, or just use a standard API.
    // Let's modify the frontend `DataContext` to handle this, or let the API handle it by taking `uploader` param.
    // For now, let's just do a sync where we update existing, insert new, and we don't delete unless explicitly asked?
    // Actually, deleteMany with a condition `uploader = X` would work if we knew who is uploading.
    
    // Let's just pass `role` in the request header or body to know what to delete.
    const { news, role } = data; 
    // we need to modify DataContext to send { news: data, role: getRole() }
    
    if (role && role.type === 'major') {
      await prisma.news.deleteMany({ where: { uploaderType: 'major', uploader: role.name } });
    } else {
      await prisma.news.deleteMany();
    }
    
    if (news && news.length > 0) {
      await prisma.news.createMany({
        data: news.map(n => ({
          id: String(n.id),
          title: n.title,
          date: n.date,
          category: n.category,
          excerpt: n.excerpt,
          content: n.content,
          image: n.image,
          uploader: n.uploader || "Sekolah",
          uploaderType: n.uploaderType || "admin",
        }))
      });
    }
    
    const allNews = await prisma.news.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(allNews);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
