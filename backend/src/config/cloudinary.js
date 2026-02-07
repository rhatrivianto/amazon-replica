import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Tambahkan ini untuk mengecek di terminal saat server jalan
console.log("Cloudinary Config Check:");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "EXISTS" : "MISSING");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
