

import DatabaseBackup from './backupScript.js';
import DatabaseHealthCheck from './databaseHealthCheck.js';
import MigrationHelper from '../utils/migrationHelper.js';
import DatabaseLogger from '../utils/databaseLogger.js';


class DatabaseOrchestrator {
  constructor() {
    console.log('🏰 Initializing Database Orchestrator...');
    
    // Initialize all systems
    this.backup = new DatabaseBackup();
    //this.health = new DatabaseHealthCheck();
    this.migration = new MigrationHelper();
    this.logger = new DatabaseLogger();
    
    this.setupCronJobs();
    console.log('✅ Database Orchestrator ready!');
  }

  setupCronJobs() {
    // Daily backup at 2 AM
    this.dailyInterval = setInterval(() => {
      this.dailyMaintenance();
    }, 24 * 60 * 60 * 1000);

    // Health check every 5 minutes
    this.healthInterval = setInterval(() => {
    //  this.healthCheck();
    }, 5 * 60 * 1000);

    // Performance analysis every hour
    this.performanceInterval = setInterval(() => {
      this.analyzePerformance();
    }, 60 * 60 * 1000);

    console.log('⏰ Cron jobs initialized: daily, 5-min health, hourly performance');
  }

  async dailyMaintenance() {
    console.log('🌅 Starting daily database maintenance');
    
    try {
      // 1. Create backup first (safety first!)
      const backupFile = await this.backup.createBackup();
      
      // 2. Run comprehensive health check
      const healthReport = await this.health.runFullHealthCheck();
      
      // 3. Analyze performance from logs
      const performanceReport = this.logger.analyzePerformance();
      
      // 4. Log maintenance completion
      this.logMaintenance({
        backup: backupFile,
        health: healthReport.status,
        performance: performanceReport.slowQueryRate
      });

      console.log('✅ Daily maintenance completed successfully');
      return { 
        backup: backupFile, 
        health: healthReport, 
        performance: performanceReport 
      };
    } catch (error) {
      console.error('❌ Daily maintenance failed:', error);
      this.logger.writeLog({
        timestamp: new Date().toISOString(),
        type: 'maintenance_error',
        error: error.message,
        severity: 'HIGH'
      });
    }
  }

  // async healthCheck() {
  //   try {
  //     const report = await this.health.runFullHealthCheck();
      
  //     if (report.status !== 'healthy') {
  //       console.warn('🚨 Database health degraded:', {
  //         status: report.status,
  //         checks: Object.keys(report.checks).filter(key => !report.checks[key].healthy)
  //       });
        
  //       // Log the issue for monitoring
  //       this.logger.writeLog({
  //         timestamp: new Date().toISOString(),
  //         type: 'health_alert',
  //         status: report.status,
  //         failedChecks: Object.keys(report.checks).filter(key => !report.checks[key].healthy),
  //         severity: 'MEDIUM'
  //       });
  //     }
      
  //     return report;
  //   } catch (error) {
  //     console.error('❌ Health check failed:', error);
  //     this.logger.writeLog({
  //       timestamp: new Date().toISOString(),
  //       type: 'health_check_error',
  //       error: error.message,
  //       severity: 'HIGH'
  //     });
  //   }
  // }

  async analyzePerformance() {
    try {
      const report = this.logger.analyzePerformance();
      
      if (report.slowQueryRate > 10) { // More than 10% slow queries
        console.warn(`🚨 High slow query rate: ${report.slowQueryRate}%`);
        
        this.logger.writeLog({
          timestamp: new Date().toISOString(),
          type: 'performance_alert',
          slowQueryRate: report.slowQueryRate,
          totalSlowQueries: report.slowQueries,
          severity: 'LOW'
        });
      }
      
      // Identify worst performing collections
      const worstCollection = report.byCollection.reduce((worst, current) => 
        current.avgDuration > (worst?.avgDuration || 0) ? current : worst, null
      );
      
      if (worstCollection && worstCollection.avgDuration > 200) {
        console.warn(`🐌 Slow collection detected: ${worstCollection.collection} (${worstCollection.avgDuration}ms avg)`);
      }
      
      return report;
    } catch (error) {
      console.error('❌ Performance analysis failed:', error);
    }
  }

  async deployWithSafety(targetVersion = '1.2.0') {
    console.log('🚀 Starting SAFE deployment procedure...');
    
    try {
      // 1. Pre-deployment backup (safety net)
      console.log('📦 Step 1: Pre-deployment backup');
      const backupFile = await this.backup.createBackup();
      
      // 2. Pre-deployment health check
      console.log('❤️ Step 2: Pre-deployment health check');
      const preHealth = await this.healthCheck();
      
      if (preHealth.status !== 'healthy') {
        throw new Error('Cannot deploy: pre-deployment health check failed');
      }
      
      // 3. Run migrations
      console.log('🔄 Step 3: Running migrations');
      await this.migration.runMigrations(targetVersion);
      
      // 4. Post-deployment health check
      console.log('❤️ Step 4: Post-deployment health check');
      const postHealth = await this.healthCheck();
      
      // 5. Log successful deployment
      this.logger.writeLog({
        timestamp: new Date().toISOString(),
        type: 'deployment_success',
        version: targetVersion,
        backup: backupFile,
        preHealth: preHealth.status,
        postHealth: postHealth.status
      });

      console.log('✅ Deployment completed safely!');
      return { 
        backup: backupFile, 
        preHealth, 
        postHealth 
      };
    } catch (error) {
      console.error('❌ Deployment failed:', error);
      
      // Log deployment failure
      this.logger.writeLog({
        timestamp: new Date().toISOString(),
        type: 'deployment_failed',
        error: error.message,
        severity: 'CRITICAL'
      });
      
      throw error;
    }
  }

  async emergencyRollback() {
    console.log('🆘 EMERGENCY ROLLBACK INITIATED!');
    
    try {
      // Get latest backup
      const backups = await this.backup.listBackups();
      if (backups.length === 0) {
        throw new Error('No backups available for rollback');
      }
      
      const latestBackup = backups[0];
      console.log(`🔄 Restoring from backup: ${latestBackup.name}`);
      
      await this.backup.restoreBackup(
        `./backups/${latestBackup.name}`
      );
      
      console.log('✅ Emergency rollback completed');
    } catch (error) {
      console.error('❌ Emergency rollback failed:', error);
      throw error;
    }
  }

  logMaintenance(results) {
    this.logger.writeLog({
      timestamp: new Date().toISOString(),
      type: 'maintenance_completed',
      results: {
        backup: results.backup,
        health: results.health,
        performance: results.performance
      }
    });
  }

  // Graceful shutdown
  async shutdown() {
    console.log('🛑 Shutting down Database Orchestrator...');
    
    clearInterval(this.dailyInterval);
    clearInterval(this.healthInterval);
    clearInterval(this.performanceInterval);
    
    console.log('✅ Database Orchestrator shut down gracefully');
  }

  // Get system status
  async getSystemStatus() {
    const health = await this.healthCheck();
    const performance = this.analyzePerformance();
    const backups = await this.backup.listBackups();
    
    return {
      timestamp: new Date().toISOString(),
      health: health.status,
      backups: backups.length,
      performance: performance.slowQueryRate,
      system: 'operational'
    };
  }
}

// Create and export singleton instance
const databaseOrchestrator = new DatabaseOrchestrator();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await databaseOrchestrator.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await databaseOrchestrator.shutdown();
  process.exit(0);
});

export default databaseOrchestrator;