import fs from 'fs';
import path from 'path';

// Parse arguments: node scripts/down.js --secret="xyz" --message="Perbaikan sistem"
const args = process.argv.slice(2);
let secret = 'beringin-admin';
let message = 'Sistem sedang dalam proses pemeliharaan berkala untuk peningkatan kualitas layanan digital SMKN 1 Beringin.';

args.forEach(arg => {
  if (arg.startsWith('--secret=')) {
    secret = arg.split('=')[1].replace(/^["']|["']$/g, '');
  } else if (arg.startsWith('--message=')) {
    message = arg.split('=')[1].replace(/^["']|["']$/g, '');
  }
});

const filePath = path.join(process.cwd(), 'maintenance.json');
const maintenanceData = {
  enabled: true,
  secret: secret,
  message: message,
  startedAt: new Date().toISOString()
};

fs.writeFileSync(filePath, JSON.stringify(maintenanceData, null, 2), 'utf8');

console.log('\n======================================================');
console.log('🛑 [MAINTENANCE MODE] TELAH DIAKTIFKAN');
console.log('======================================================');
console.log(`📌 Secret Bypass Code : "${secret}"`);
console.log(`🌐 URL Bypass Domain  : https://www.tiksmkn1beringin.my.id/${secret}`);
console.log(`📡 URL Bypass IP      : http://10.200.0.17:3000/${secret}`);
console.log(`💻 URL Bypass Local   : http://localhost:3000/${secret}`);
console.log(`💬 Pesan Tampilan     : ${message}`);
console.log('======================================================');
console.log('💡 Pengunjung biasa akan melihat halaman Maintenance.');
console.log('💡 Klik salah satu URL Bypass di atas untuk membuka web.\n');
