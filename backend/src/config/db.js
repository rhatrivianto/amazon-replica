import mongoose from 'mongoose';
console.log("Model yang terdaftar di Mongoose:", mongoose.modelNames());

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Skala Amazon: Memastikan database bisa menangani banyak request
      maxPoolSize: 10, 
      serverSelectionTimeoutMS: 30000, // Increased for WSL/slow networks
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });

    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Stop server jika DB gagal
  }
};

export default connectDB;