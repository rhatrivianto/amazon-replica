import databaseOrchestrator from '../scripts/databaseOrchestrator.js';
import AppError from '../utils/AppError.js';

/**
 * Mendapatkan status kesehatan sistem database secara real-time
 */
export const getHealthStatus = async () => {
  const status = await databaseOrchestrator.getSystemStatus();
  if (!status) {
    throw new AppError('Database health check failed', 500);
  }
  return status;
};

/**
 * Mendapatkan daftar riwayat backup yang tersedia
 */
export const getBackupList = async () => {
  const backups = await databaseOrchestrator.backup.listBackups();
  return backups;
};

/**
 * Memicu proses backup database secara manual
 */
export const triggerManualBackup = async () => {
  const backupFile = await databaseOrchestrator.backup.createBackup();
  if (!backupFile) {
    throw new AppError('Failed to create manual backup', 500);
  }
  return {
    file: backupFile,
    timestamp: new Date()
  };
};

/**
 * Menganalisis metrik performa database (Query lambat, penggunaan memori, dll)
 */
export const analyzePerformance = async () => {
  const metrics = databaseOrchestrator.logger.analyzePerformance();
  return metrics;
};