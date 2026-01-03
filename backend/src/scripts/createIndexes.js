// Dependency: models/*, db.js
import mongoose from "mongoose";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";

export const createDatabaseIndexes = async () => {
  console.log("🔄 Creating database indexes...");

  // Product indexes
  await Product.collection.createIndex({ category: 1 });
  await Product.collection.createIndex({ price: 1 });
  await Product.collection.createIndex({ createdAt: -1 });

  // User indexes
  await User.collection.createIndex({ email: 1 }, { unique: true });

  // Order indexes
  await Order.collection.createIndex({ userId: 1 });
  await Order.collection.createIndex({ status: 1 });
  await Order.collection.createIndex({ createdAt: -1 });

  console.log("✅ Database indexes created successfully");
};
