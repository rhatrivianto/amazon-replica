import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execAsync = promisify(exec);

class DatabaseBackup {
  constructor() {
    this.backupDir = path.join(__dirname, '../backups');
    this.maxBackups = 30; // Keep last 30 backups
    this.ensureBackupDir();
  }

  ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(this.backupDir, `backup-${timestamp}.gz`);
    
    try {
      console.log(`🔄 Creating database backup: ${backupFile}`);
      
      const { stdout, stderr } = await execAsync(
        `mongodump --uri="${process.env.MONGODB_URI}" --archive="${backupFile}" --gzip`
      );

      console.log('✅ Backup created successfully');
      await this.cleanupOldBackups();
      return backupFile;
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
      throw error;
    }
  }

  async restoreBackup(backupFile) {
    try {
      console.log(`🔄 Restoring from backup: ${backupFile}`);
      
      const { stdout, stderr } = await execAsync(
        `mongorestore --uri="${process.env.MONGODB_URI}" --archive="${backupFile}" --gzip --drop`
      );

      console.log('✅ Database restored successfully');
    } catch (error) {
      console.error('❌ Restore failed:', error.message);
      throw error;
    }
  }

  async cleanupOldBackups() {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(f => f.startsWith('backup-') && f.endsWith('.gz'))
        .map(f => ({
          name: f,
          time: fs.statSync(path.join(this.backupDir, f)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);

      // Keep only the newest maxBackups files
      for (let i = this.maxBackups; i < files.length; i++) {
        fs.unlinkSync(path.join(this.backupDir, files[i].name));
        console.log(`🗑️ Deleted old backup: ${files[i].name}`);
      }
    } catch (error) {
      console.error('❌ Backup cleanup failed:', error.message);
    }
  }

  async listBackups() {
    const files = fs.readdirSync(this.backupDir)
      .filter(f => f.startsWith('backup-') && f.endsWith('.gz'))
      .map(f => ({
        name: f,
        size: fs.statSync(path.join(this.backupDir, f)).size,
        modified: fs.statSync(path.join(this.backupDir, f)).mtime
      }))
      .sort((a, b) => b.modified - a.modified);

    return files;
  }
}

// Auto-backup if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const backup = new DatabaseBackup();
  backup.createBackup().catch(console.error);
}

export default DatabaseBackup;