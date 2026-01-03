import mongoose from "mongoose";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";

class MigrationHelper {
  constructor() {
    this.migrations = new Map();
    this.setupMigrations();
  }

  setupMigrations() {
    // Add new migrations here with version numbers
    this.migrations.set("1.0.0", this.addProductDiscountField);
    this.migrations.set("1.1.0", this.addUserPreferences);
    this.migrations.set("1.2.0", this.optimizeOrderIndexes);
  }

  async runMigrations(targetVersion = "1.2.0") {
    const currentVersion = await this.getCurrentVersion();
    console.log(
      `🔄 Running migrations from ${currentVersion} to ${targetVersion}`
    );

    const versions = Array.from(this.migrations.keys())
      .sort()
      .filter((v) => v > currentVersion && v <= targetVersion);

    for (const version of versions) {
      console.log(`📦 Running migration: ${version}`);
      try {
        await this.migrations.get(version)();
        await this.setCurrentVersion(version);
        console.log(`✅ Migration ${version} completed`);
      } catch (error) {
        console.error(`❌ Migration ${version} failed:`, error.message);
        throw error;
      }
    }

    console.log("🎉 All migrations completed successfully");
  }

  async addProductDiscountField() {
    // Add discountPrice field to all products
    const result = await Product.updateMany(
      { discountPrice: { $exists: false } },
      { $set: { discountPrice: null } }
    );
    console.log(`✅ Added discountPrice to ${result.modifiedCount} products`);
  }

  async addUserPreferences() {
    // Add preferences field to users
    const result = await User.updateMany(
      { preferences: { $exists: false } },
      {
        $set: {
          preferences: {
            emailNotifications: true,
            smsNotifications: false,
            newsletter: true,
          },
        },
      }
    );
    console.log(`✅ Added preferences to ${result.modifiedCount} users`);
  }

  async optimizeOrderIndexes() {
    // Create compound indexes for better order queries
    const orderCollection = mongoose.connection.collection("orders");

    await orderCollection.createIndex({ userId: 1, status: 1 });
    await orderCollection.createIndex({ createdAt: -1, status: 1 });

    console.log("✅ Order indexes optimized");
  }

  async getCurrentVersion() {
    // Store version in a dedicated collection
    const Version = mongoose.model(
      "Version",
      new mongoose.Schema({
        key: String,
        value: String,
      })
    );

    const doc = await Version.findOne({ key: "database_version" });
    return doc ? doc.value : "0.0.0";
  }

  async setCurrentVersion(version) {
    const Version = mongoose.model("Version");
    await Version.findOneAndUpdate(
      { key: "database_version" },
      { value: version },
      { upsert: true }
    );
  }

  async rollbackMigration(version) {
    console.log(`🔄 Rolling back to version: ${version}`);
    // Implement rollback logic for each migration
    // This is complex - usually backup/restore is better
    throw new Error("Rollback not implemented - use backup restore instead");
  }
}

// Run migrations if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const migration = new MigrationHelper();
  migration.runMigrations().catch(console.error);
}

export default MigrationHelper;
