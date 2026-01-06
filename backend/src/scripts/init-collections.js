import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import * as models from '../models/index.js'; // Import semua model

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env dari root backend
dotenv.config({ path: path.join(__dirname, '../../.env') });

const initCollections = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGO_URI tidak ditemukan di .env');
    }

    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('✅ Connected!');

    const modelNames = Object.keys(models);
    console.log(`📦 Found ${modelNames.length} models to initialize: ${modelNames.join(', ')}`);

    for (const modelName of modelNames) {
      const Model = models[modelName];
      // Cek apakah ini Model Mongoose valid
      if (Model && Model.createCollection) {
        try {
          await Model.createCollection();
          console.log(`✅ Collection created: ${modelName} -> ${Model.collection.name}`);
        } catch (error) {
          // Error code 48 = Collection already exists (Abaikan)
          if (error.code !== 48) console.error(`❌ Failed: ${modelName}`, error.message);
        }
      }
    }

    console.log('🎉 All collections initialized in Atlas!');
    process.exit(0);
  } catch (error) {
    console.error('🔥 Error:', error);
    process.exit(1);
  }
};

initCollections();