const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.pin.create({ data: { role: 'admin_bk', name: 'Guru BK', pin: '9999' } });
  await prisma.pin.create({ data: { role: 'super_admin', name: 'Super Admin', pin: '1111' } });
  console.log('PINs added successfully.');
}
main().catch(console.error).finally(() => prisma.$disconnect());
