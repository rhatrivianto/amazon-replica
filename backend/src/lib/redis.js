import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// ✅ Better Redis configuration dengan fallback
const redisConfig = process.env.UPSTASH_REDIS_URL
  ? {
      // Untuk Upstash Redis (cloud)
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 1, // ✅ Reduce dari 3 ke 1
      enableReadyCheck: false,
      connectTimeout: 5000, // ✅ Reduce timeout
      lazyConnect: true,
    }
  : {
      // Untuk local Redis
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || 6379,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      lazyConnect: true,
    };

    export const cacheProduct = async (productId, data) => {
  try {
    // Simpan data produk di cache selama 1 jam
    await redis.set(`product:${productId}`, JSON.stringify(data), "EX", 3600);
  } catch (error) {
    console.log("⚠️ Redis Cache Error:", error.message);
  }
};

export const redis = new Redis(process.env.UPSTASH_REDIS_URL, redisConfig);

// ✅ Better error handling
redis.on("error", (error) => {
  console.error("❌ Redis connection error:", error.message);
  // Jangan crash aplikasi, hanya log error
});

redis.on("connect", () => {
  console.log("✅ Connected to Redis successfully");
});

// ✅ Safe Redis operations dengan fallback
export const storeRefreshToken = async (userId, token) => {
  try {
    await redis.set(`refresh_token:${userId}`, token, "EX", 7 * 24 * 60 * 60);
    return true;
  } catch (error) {
    console.log("⚠️ Cannot store refresh token in Redis:", error.message);
    return false; // Return false instead of throwing error
  }
};

export const getStoredRefreshToken = async (userId) => {
  try {
    return await redis.get(`refresh_token:${userId}`);
  } catch (error) {
    console.log("⚠️ Cannot get refresh token from Redis:", error.message);
    return null;
  }
};

export const removeRefreshToken = async (userId) => {
  try {
    await redis.del(`refresh_token:${userId}`);
    return true;
  } catch (error) {
    console.log("⚠️ Cannot remove refresh token from Redis:", error.message);
    return false;
  }
};

// ✅ Test connection dengan timeout
export const testRedisConnection = async () => {
  try {
    await redis.ping();
    console.log("✅ Redis connection test: OK");
    return true;
  } catch (error) {
    console.log("❌ Redis connection test failed - running without Redis");
    return false;
  }
};
