const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.pin.deleteMany({
    where: { role: { in: ['admin', 'super_admin', 'admin_bk'] } }
  });

  await prisma.pin.create({ data: { role: 'admin', name: 'Tata Usaha', pin: '1111' } });
  await prisma.pin.create({ data: { role: 'super_admin', name: 'Super Admin', pin: '2323' } });
  await prisma.pin.create({ data: { role: 'admin_bk', name: 'Guru BK', pin: '0909' } });
  
  console.log('PINs updated successfully.');
}
main().catch(console.error).finally(() => prisma.$disconnect());
