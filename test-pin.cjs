const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const pins = await prisma.pin.findMany();
  console.log('ALL PINS IN DB:');
  console.log(JSON.stringify(pins, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
