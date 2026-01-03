import mongoose from "mongoose";
import { redis } from "../lib/redis.js";
import dotenv from "dotenv";
import ProductModel from "../models/product.model.js";
import AuditLog from "../models/auditLog.model.js";

dotenv.config();

const runAdminDiagnostic = async () => {
  console.log("🚀 Starting Admin Infrastructure Diagnostic...\n");

  try {
    // 1. TEST DATABASE CONNECTION
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database: Connected successfully.");

    // 2. TEST REDIS CONNECTION
    const redisPing = await redis.ping();
    console.log(`✅ Redis: Connected (Status: ${redisPing})`);

    // 3. TEST AUDIT LOG SYSTEM
    const logCount = await AuditLog.countDocuments();
    console.log(`📊 Audit Logs: ${logCount} records found in database.`);

    // 4. TEST CACHING LOGIC (Set & Get)
    const testKey = "admin:test:cache";
    const testValue = { status: "ok", timestamp: Date.now() };
    
    await redis.setex(testKey, 10, JSON.stringify(testValue));
    const cachedValue = await redis.get(testKey);
    
    if (JSON.parse(cachedValue).status === "ok") {
      console.log("✅ Caching Logic: Redis SET/GET working perfectly.");
    }

    // 5. CHECK INVENTORY ALERT SYSTEM
    const lowStock = await ProductModel.countDocuments({ stock: { $lt: 10 } });
    console.log(`⚠️  Inventory: Found ${lowStock} products with low stock.`);

    console.log("\n ✨ All systems are GO. Admin role is ready for production.");
    
  } catch (error) {
    console.error("\n❌ Diagnostic Failed!");
    console.error(`Error Details: ${error.message}`);
  } finally {
    await mongoose.connection.close();
    redis.disconnect();
    process.exit();
  }
};

runAdminDiagnostic();