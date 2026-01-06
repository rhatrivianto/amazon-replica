import mongoose from "mongoose";
import { performance } from "perf_hooks";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";

class DatabaseHealthCheck {
  constructor() {
    this.thresholds = {
      queryTime: 100,
      connectionPool: 0.8,
      memoryUsage: 0.9,
    };
  }

  async runFullHealthCheck() {
    const report = {
      timestamp: new Date(),
      status: "healthy",
      checks: {},
    };

    try {
      report.checks.connection = await this.checkConnectionHealth();
      report.checks.queries = await this.checkQueryPerformance();
      report.checks.indexes = await this.checkIndexHealth();
      report.checks.memory = await this.checkMemoryUsage();
      report.checks.collections = await this.checkCollectionStats();

      const failed = Object.values(report.checks).filter((c) => !c.healthy);
      report.status = failed.length > 0 ? "degraded" : "healthy";

      return report;
    } catch (error) {
      return { status: "error", error: error.message, checks: {} };
    }
  }

  async checkConnectionHealth() {
    let serverStatus = {};
    try {
      const adminDb = mongoose.connection.db.admin();
      serverStatus = await adminDb.serverStatus();
    } catch (e) {
      return { healthy: false, error: "serverStatus not supported" };
    }

    const connections = serverStatus.connections || {};
    const current = connections.current ?? 0;
    const available = connections.available ?? 100;

    const usage = available === 0 ? 0 : current / available;

    return {
      healthy: usage < this.thresholds.connectionPool,
      current,
      available,
      usage: Math.round(usage * 100),
    };
  }

  async checkQueryPerformance() {
    const tests = [
      {
        name: "Product by category",
        query: () => Product.find({ category: "electronics" }).limit(10),
      },
      {
        name: "User by email",
        query: () => User.findOne({ email: "test@example.com" }),
      },
      {
        name: "Recent orders",
        query: () => Order.find().sort({ createdAt: -1 }).limit(5),
      },
    ];

    const results = [];
    for (const test of tests) {
      const start = performance.now();
      try {
        await test.query();
      } catch (e) {}
      const duration = performance.now() - start;

      results.push({
        name: test.name,
        duration: Math.round(duration),
        healthy: duration < this.thresholds.queryTime,
      });
    }

    return {
      healthy: results.every((r) => r.healthy),
      queries: results,
    };
  }

  async checkIndexHealth() {
    const collections = ["products", "users", "orders", "reviews", "carts", "coupons", "vouchers", "notifications", "chats", "pageSections", "payments", "shippings", "inventoryLogs", "auditLogs", "emailLogs", "addresses", "sellerContents","wishlist", "brands", "categories"];
    const results = [];

    for (const name of collections) {
      try {
        const collection = mongoose.connection.collection(name);
        const stats = await collection.stats();

        results.push({
          collection: name,
          size: stats.size ?? 0,
          count: stats.count ?? 0,
          avgObjSize: stats.avgObjSize ?? 0,
          indexes: stats.nindexes ?? 0,
          healthy: (stats.size ?? 0) < 100000000,
        });
      } catch (e) {
        results.push({
          collection: name,
          healthy: false,
          error: "stats() not permitted",
        });
      }
    }

    return {
      healthy: results.every((r) => r.healthy),
      collections: results,
    };
  }

  async checkMemoryUsage() {
    let mem = {};
    try {
      const adminDb = mongoose.connection.db.admin();
      const serverStatus = await adminDb.serverStatus();
      mem = serverStatus.mem || {};
    } catch (e) {
      return { healthy: false, error: "mem usage unsupported" };
    }

    const resident = mem.resident ?? 1;
    const virtual = mem.virtual ?? 1;
    const usage = resident / virtual;

    return {
      healthy: usage < this.thresholds.memoryUsage,
      residentMB: Math.round(resident),
      virtualMB: Math.round(virtual),
      usage: Math.round(usage * 100),
    };
  }

  async checkCollectionStats() {
    const stats = {
      products: await Product.countDocuments(),
      users: await User.countDocuments(),
      orders: await Order.countDocuments(),
      lowStock: await Product.countDocuments({ stock: { $lt: 10 } }),
    };

    return {
      healthy: stats.lowStock < 50,
      stats,
    };
  }
}

export default DatabaseHealthCheck;
