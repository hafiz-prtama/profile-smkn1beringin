import fs from 'fs';
import path from 'path';

const maintenanceFilePath = path.join(process.cwd(), 'maintenance.json');

// Helper to get maintenance state
export function getMaintenanceStatus() {
  try {
    if (fs.existsSync(maintenanceFilePath)) {
      const raw = fs.readFileSync(maintenanceFilePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading maintenance file:', e);
  }
  return { enabled: false, secret: 'beringin-admin', message: '' };
}

// Helper to set maintenance state
export function setMaintenanceStatus(data) {
  try {
    fs.writeFileSync(maintenanceFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Error writing maintenance file:', e);
    return false;
  }
}
