import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'investpro.db');
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Database reset successfully');
} else {
  console.log('No database file found, nothing to reset');
}
