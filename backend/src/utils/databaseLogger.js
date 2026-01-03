import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class DatabaseLogger {
  constructor() {
    this.logFile = path.join(__dirname, '../logs/database-performance.log');
    this.slowQueryThreshold = 100; // ms
    this.ensureLogDir();
    this.setupQueryLogging();
  }

  ensureLogDir() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  setupQueryLogging() {
    // Monitor all Mongoose queries
    mongoose.set('debug', (collectionName, method, query, doc) => {
      this.logQuery(collectionName, method, query, doc);
    });

    // Monitor query execution time
    const originalExec = mongoose.Query.prototype.exec;
    
    mongoose.Query.prototype.exec = async function() {
      const start = Date.now();
      const result = await originalExec.apply(this, arguments);
      const duration = Date.now() - start;

      if (duration > this.slowQueryThreshold) {
        DatabaseLogger.logSlowQuery({
          collection: this.model.collection.name,
          operation: this.op,
          duration,
          query: this.getFilter(),
          options: this.getOptions()
        });
      }

      return result;
    };
  }

  logQuery(collectionName, method, query, doc) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      collection: collectionName,
      method,
      query,
      doc,
      type: 'debug'
    };

    this.writeLog(logEntry);
  }

  static logSlowQuery(details) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'slow_query',
      ...details
    };

    const logger = new DatabaseLogger();
    logger.writeLog(logEntry);
    
    // Also console warn for immediate attention
    console.warn(`🚨 SLOW QUERY: ${details.collection}.${details.operation} took ${details.duration}ms`);
  }

  writeLog(entry) {
    const logLine = JSON.stringify(entry) + '\n';
    
    fs.appendFile(this.logFile, logLine, (err) => {
      if (err) console.error('❌ Failed to write database log:', err);
    });

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 DB Log:', entry);
    }
  }

  analyzePerformance() {
    try {
      if (!fs.existsSync(this.logFile)) {
        return { error: 'No log file found' };
      }

      const logs = fs.readFileSync(this.logFile, 'utf8')
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line));

      const slowQueries = logs.filter(log => log.type === 'slow_query');
      const byCollection = {};
      
      slowQueries.forEach(query => {
        const collection = query.collection;
        if (!byCollection[collection]) {
          byCollection[collection] = [];
        }
        byCollection[collection].push(query);
      });

      const report = {
        totalQueries: logs.length,
        slowQueries: slowQueries.length,
        slowQueryRate: (slowQueries.length / logs.length * 100).toFixed(2),
        byCollection: Object.keys(byCollection).map(collection => ({
          collection,
          slowQueries: byCollection[collection].length,
          avgDuration: Math.round(
            byCollection[collection].reduce((sum, q) => sum + q.duration, 0) / 
            byCollection[collection].length
          ),
          queries: byCollection[collection].slice(0, 5) // Top 5 slowest
        }))
      };

      return report;
    } catch (error) {
      return { error: error.message };
    }
  }

  clearLogs() {
    if (fs.existsSync(this.logFile)) {
      fs.unlinkSync(this.logFile);
      console.log('✅ Database logs cleared');
    }
  }
}



export default DatabaseLogger;