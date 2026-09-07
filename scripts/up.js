import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'maintenance.json');

const maintenanceData = {
  enabled: false,
  secret: 'beringin-admin',
  message: '',
  stoppedAt: new Date().toISOString()
};

fs.writeFileSync(filePath, JSON.stringify(maintenanceData, null, 2), 'utf8');

console.log('\n======================================================');
console.log('🚀 [MAINTENANCE MODE] TELAH DIMATIKAN — WEBSITE SUDAH UP!');
console.log('======================================================');
console.log('🌐 Seluruh pengunjung kini dapat mengakses website secara normal.\n');
