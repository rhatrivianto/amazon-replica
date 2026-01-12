import mongoose from 'mongoose';
import dotenv from 'dotenv';
import slugify from 'slugify';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Models
import Product from '../models/product.model.js';
import Category from '../models/category.model.js';
import Brand from '../models/brand.model.js';
import User from '../models/user.model.js'; // Import User Model

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env dari root backend
dotenv.config({ path: path.join(__dirname, '../../.env') });

// --- DATA DUMMY (10 PRODUK LENGKAP) ---
const productsToSeed = [
  // 1. ELECTRONICS - AUDIO
  {
    name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    brandName: "Sony",
    categoryHierarchy: ["Electronics", "Headphones, Earbuds & Accessories", "Headphones", "Over-Ear Headphones"],
    price: 348.00,
    stock: 120,
    description: "The Sony WH-1000XM5 headphones rewrite the rules for distraction-free listening. Two processors control 8 microphones for unprecedented noise cancellation and exceptional call quality.",
    images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "Industry-leading noise cancellation optimized to you",
      "Magnificent Sound, engineered to perfection",
      "Up to 30-hour battery life with quick charging"
    ],
    specifications: [
      { key: "Color", value: "Black" },
      { key: "Connectivity", value: "Bluetooth 5.2" },
      { key: "Form Factor", value: "Over Ear" }
    ],
    asin: "B09XS7JWHH",
    modelNumber: "WH1000XM5/B"
  },
  // 2. ELECTRONICS - LAPTOP
  {
    name: "Apple MacBook Air 15-inch Laptop - M2 Chip",
    brandName: "Apple",
    categoryHierarchy: ["Electronics", "Computers & Accessories", "Computers & Tablets", "Laptops"],
    price: 1299.00,
    stock: 45,
    description: "The 15-inch MacBook Air is impossibly thin and has a stunning Liquid Retina display. Supercharged by the M2 chip—and with up to 18 hours of battery life.",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "IMPRESSIVELY BIG, IMPOSSIBLY THIN design",
      "SUPERCHARGED BY M2 chip",
      "UP TO 18 HOURS OF BATTERY LIFE"
    ],
    specifications: [
      { key: "Processor", value: "Apple M2" },
      { key: "RAM", value: "8GB Unified" },
      { key: "Storage", value: "256GB SSD" }
    ],
    asin: "B0C7662P45",
    modelNumber: "MQKW3LL/A"
  },
  // 3. ELECTRONICS - CAMERA
  {
    name: "Canon EOS R6 Full-Frame Mirrorless Camera",
    brandName: "Canon",
    categoryHierarchy: ["Electronics", "Camera & Photo", "Digital Cameras", "Mirrorless Cameras"],
    price: 2499.00,
    stock: 15,
    description: "Capture high-quality images with the Canon EOS R6. Featuring a 20MP Full-Frame CMOS sensor, DIGIC X image processor, and 4K video recording.",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "High Image Quality 20 MP Full-frame CMOS Sensor",
      "High-speed continuous shooting up to 12 fps",
      "4K 60p video recording"
    ],
    specifications: [
      { key: "Sensor", value: "Full Frame CMOS" },
      { key: "Resolution", value: "20 MP" },
      { key: "Video", value: "4K 60p" }
    ],
    asin: "B08BVT9C26",
    modelNumber: "4082C002"
  },
  // 4. HOME - KITCHEN
  {
    name: "Nespresso Vertuo Coffee and Espresso Machine",
    brandName: "Nespresso",
    categoryHierarchy: ["Home & Kitchen", "Kitchen & Dining", "Coffee, Tea & Espresso", "Coffee Makers"],
    price: 199.00,
    stock: 85,
    description: "Nespresso introduces the Vertuo for the ultimate brewing experience. Offering freshly brewed Coffee with crema as well as delicious, authentic Espresso.",
    images: ["https://images.unsplash.com/photo-1517080319627-889c685b8436?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "VERSATILE AUTOMATIC COFFEE MAKER",
      "BREW DIFFERENT SIZES: 5 cup sizes",
      "ONE-TOUCH BREWING system"
    ],
    specifications: [
      { key: "Capacity", value: "40 oz" },
      { key: "Color", value: "Matte Black" }
    ],
    asin: "B01N1QO123",
    modelNumber: "ENV135B"
  },
  // 5. HOME - APPLIANCE
  {
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    brandName: "Instant Pot",
    categoryHierarchy: ["Home & Kitchen", "Kitchen & Dining", "Small Appliances", "Pressure Cookers"],
    price: 89.99,
    stock: 200,
    description: "Instant Pot Duo is the one that started it all. It replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and warmer.",
    images: ["https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "7-IN-1 FUNCTIONALITY",
      "QUICK ONE-TOUCH COOKING",
      "STAINLESS STEEL INNER POT"
    ],
    specifications: [
      { key: "Capacity", value: "6 Quarts" },
      { key: "Material", value: "Stainless Steel" }
    ],
    asin: "B00FLYWNYQ",
    modelNumber: "IP-DUO60"
  },
  // 6. GAMING
  {
    name: "Samsung Odyssey G9 Gaming Monitor",
    brandName: "Samsung",
    categoryHierarchy: ["Electronics", "Computers & Accessories", "Monitors", "Gaming Monitors"],
    price: 1399.99,
    stock: 10,
    description: "The monitor that changes the game. Discover the groundbreaking 49-inch super ultra-wide 32:9 monitor with new metal core lighting technology.",
    images: ["https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "49 INCH SUPER ULTRAWIDE 32:9 CURVED",
      "QLED TECHNOLOGY with 240Hz refresh rate",
      "G-SYNC AND FREESYNC PREMIUM PRO"
    ],
    specifications: [
      { key: "Screen Size", value: "49 Inches" },
      { key: "Resolution", value: "5120 x 1440" },
      { key: "Refresh Rate", value: "240 Hz" }
    ],
    asin: "B088HH6LW5",
    modelNumber: "LC49G95TSSNXZA"
  },
  // 7. FASHION - SUNGLASSES
  {
    name: "Ray-Ban Classic Aviator Sunglasses",
    brandName: "Ray-Ban",
    categoryHierarchy: ["Clothing, Shoes & Jewelry", "Men", "Accessories", "Sunglasses & Eyewear"],
    price: 163.00,
    stock: 300,
    description: "Ray-Ban Aviator sunglasses are the brand's most iconic style. Originally designed for U.S. aviators in 1937.",
    images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "CLASSIC AVIATOR STYLE",
      "100% UV PROTECTION",
      "POLARIZED LENSES available"
    ],
    specifications: [
      { key: "Frame Material", value: "Metal" },
      { key: "Lens Color", value: "Green G-15" }
    ],
    asin: "B00080FK2U",
    modelNumber: "RB3025"
  },
  // 8. FURNITURE
  {
    name: "Herman Miller Aeron Ergonomic Chair",
    brandName: "Herman Miller",
    categoryHierarchy: ["Home & Kitchen", "Furniture", "Home Office Furniture", "Office Chairs"],
    price: 1445.00,
    stock: 20,
    description: "The Aeron Chair combines a deep knowledge of human-centered design with cutting-edge technology. The most famous ergonomic chair in history.",
    images: ["https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "POSTUREFIT SL BACK SUPPORT",
      "BREATHABLE PELLICLE SUSPENSION",
      "FULLY ADJUSTABLE ARMS"
    ],
    specifications: [
      { key: "Color", value: "Graphite" },
      { key: "Size", value: "B (Medium)" }
    ],
    asin: "B01N0Z8Q2P",
    modelNumber: "AER1B23DW"
  },
  // 9. GAMING - CONSOLE
  {
    name: "Nintendo Switch - OLED Model",
    brandName: "Nintendo",
    categoryHierarchy: ["Video Games", "Nintendo Switch", "Consoles"],
    price: 349.99,
    stock: 60,
    description: "Play at home on the TV or on-the-go with a vibrant 7-inch OLED screen with the Nintendo Switch – OLED Model system.",
    images: ["https://images.unsplash.com/photo-1629426958509-270b24d94434?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "7-inch OLED screen",
      "Wide adjustable stand",
      "Wired LAN port",
      "64 GB internal storage"
    ],
    specifications: [
      { key: "Storage", value: "64GB" },
      { key: "Color", value: "White Joy-Con" }
    ],
    asin: "B098RKWHHZ",
    modelNumber: "HEGSKAAAA"
  },
  // 10. FASHION - JEANS
  {
    name: "Levi's Men's 501 Original Fit Jeans",
    brandName: "Levi's",
    categoryHierarchy: ["Clothing, Shoes & Jewelry", "Men", "Clothing", "Jeans"],
    price: 69.50,
    stock: 150,
    description: "The original blue jean since 1873. The original straight fit jean. All-American style. A blank canvas for self-expression.",
    images: ["https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "Original Straight Fit",
      "Button Fly",
      "100% Cotton"
    ],
    specifications: [
      { key: "Material", value: "Cotton" },
      { key: "Fit", value: "Regular" }
    ],
    asin: "B0018OR118",
    modelNumber: "501-0000"
  },
  // --- NEW 50 PRODUCTS (DEEP NESTING / BREADCRUMBS) ---
  // 11. ELECTRONICS - NETWORKING
  {
    name: "TP-Link AX1800 WiFi 6 Router (Archer AX21)",
    brandName: "TP-Link",
    categoryHierarchy: ["Electronics", "Computers & Accessories", "Networking Products", "Routers"],
    price: 74.99,
    stock: 50,
    description: "Dual-Band WiFi 6 Internet Router: Gigabit Router, 4 GB ports, Works with Alexa.",
    images: ["https://images.unsplash.com/photo-1610465299993-e6675c9f9efa?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["JD Power Award-Highest in customer satisfaction", "Certified for Humans", "Dual-Band WiFi 6"],
    specifications: [{ key: "Speed", value: "1.8 Gbps" }, { key: "Standard", value: "WiFi 6" }],
    asin: "B08H8ZLKKK",
    modelNumber: "AX21"
  },
  // 12. ELECTRONICS - WEBCAM
  {
    name: "Logitech C920x HD Pro Webcam",
    brandName: "Logitech",
    categoryHierarchy: ["Electronics", "Computers & Accessories", "Computer Accessories", "Webcams"],
    price: 59.99,
    stock: 100,
    description: "Full HD 1080p/30fps Video Calling, Clear Stereo Audio, HD Light Correction.",
    images: ["https://images.unsplash.com/photo-1587826534690-164764af7202?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Full HD 1080p video calling", "Automatic low-light correction", "Stereo audio with dual mics"],
    specifications: [{ key: "Resolution", value: "1080p" }, { key: "Connection", value: "USB-A" }],
    asin: "B085TFF7M1",
    modelNumber: "C920x"
  },
  // 13. ELECTRONICS - STORAGE
  {
    name: "Seagate Portable 2TB External Hard Drive",
    brandName: "Seagate",
    categoryHierarchy: ["Electronics", "Computers & Accessories", "Data Storage", "External Hard Drives"],
    price: 61.99,
    stock: 200,
    description: "Portable HDD, USB 3.0 for PC, Mac, PS4 & Xbox.",
    images: ["https://images.unsplash.com/photo-1531492343372-8ce696e7db9c?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Easy-to-use", "Drag-and-drop file saving", "USB powered"],
    specifications: [{ key: "Capacity", value: "2TB" }, { key: "Interface", value: "USB 3.0" }],
    asin: "B07CRG94G3",
    modelNumber: "STGX2000400"
  },
  // 14. ELECTRONICS - STREAMING
  {
    name: "Roku Express 4K+",
    brandName: "Roku",
    categoryHierarchy: ["Electronics", "Television & Video", "Streaming Media Players"],
    price: 39.00,
    stock: 80,
    description: "Brilliant 4K/HDR/HD streaming and Roku Voice Remote with TV controls.",
    images: ["https://images.unsplash.com/photo-1544829126-471475b410dd?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Brilliant 4K picture quality", "Smooth wireless streaming", "Voice remote"],
    specifications: [{ key: "Resolution", value: "4K HDR" }, { key: "Wireless", value: "Dual-band" }],
    asin: "B0916RDGMD",
    modelNumber: "3941R"
  },
  // 15. ELECTRONICS - AUDIO
  {
    name: "Bose SoundLink Flex Bluetooth Speaker",
    brandName: "Bose",
    categoryHierarchy: ["Electronics", "Audio", "Speakers", "Portable Bluetooth Speakers"],
    price: 149.00,
    stock: 45,
    description: "Portable wireless speaker for outdoor travel, waterproof and dustproof.",
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["State-of-the-art design", "Waterproof and dustproof (IP67)", "12 hours battery life"],
    specifications: [{ key: "Color", value: "Black" }, { key: "Battery", value: "12 Hours" }],
    asin: "B099TJGJ91",
    modelNumber: "865983-0100"
  },
  // 16. ELECTRONICS - WEARABLE
  {
    name: "Fitbit Charge 6 Fitness Tracker",
    brandName: "Fitbit",
    categoryHierarchy: ["Electronics", "Wearable Technology", "Activity Trackers"],
    price: 159.95,
    stock: 60,
    description: "Google apps, heart rate on gym equipment, 6-months Premium membership included.",
    images: ["https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["More accurate heart rate", "Google Maps & Wallet", "7-day battery life"],
    specifications: [{ key: "Color", value: "Obsidian" }, { key: "GPS", value: "Built-in" }],
    asin: "B0CC676B7T",
    modelNumber: "GA05183-NA"
  },
  // 17. ELECTRONICS - E-READER
  {
    name: "Kindle Paperwhite (16 GB)",
    brandName: "Amazon",
    categoryHierarchy: ["Electronics", "eBook Readers & Accessories", "eBook Readers"],
    price: 149.99,
    stock: 150,
    description: "Now with a 6.8” display and adjustable warm light.",
    images: ["https://images.unsplash.com/photo-1592496001020-d31bd830651f?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["6.8” display", "Adjustable warm light", "Up to 10 weeks of battery life"],
    specifications: [{ key: "Storage", value: "16 GB" }, { key: "Waterproof", value: "IPX8" }],
    asin: "B09TMN5M5X",
    modelNumber: "M2L3EK"
  },
  // 18. ELECTRONICS - POWER
  {
    name: "Anker 737 Power Bank (PowerCore 24K)",
    brandName: "Anker",
    categoryHierarchy: ["Electronics", "Cell Phones & Accessories", "Accessories", "Chargers & Power Adapters"],
    price: 149.99,
    stock: 30,
    description: "24,000mAh 3-Port Portable Charger with 140W Output, Smart Digital Display.",
    images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Ultra-Powerful Two-Way Charging", "Smart Digital Display", "Huge Capacity"],
    specifications: [{ key: "Capacity", value: "24000mAh" }, { key: "Output", value: "140W" }],
    asin: "B09VPHVT2Z",
    modelNumber: "A1289"
  },
  // 19. ELECTRONICS - ACTION CAM
  {
    name: "GoPro HERO12 Black",
    brandName: "GoPro",
    categoryHierarchy: ["Electronics", "Camera & Photo", "Video Cameras", "Action Cameras"],
    price: 399.00,
    stock: 25,
    description: "Waterproof Action Camera with 5.3K60 Ultra HD Video, 27MP Photos, HDR.",
    images: ["https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Incredible Image Quality", "HyperSmooth 6.0 Stabilization", "Rugged + Waterproof"],
    specifications: [{ key: "Video", value: "5.3K60" }, { key: "Photo", value: "27MP" }],
    asin: "B0CCLW7516",
    modelNumber: "CHDHX-121-CN"
  },
  // 20. ELECTRONICS - DRONE
  {
    name: "DJI Mini 3 Drone",
    brandName: "DJI",
    categoryHierarchy: ["Electronics", "Camera & Photo", "Drones", "Camera Drones"],
    price: 559.00,
    stock: 15,
    description: "Lightweight and Foldable Mini Camera Drone with 4K HDR Video, 38-min Flight Time.",
    images: ["https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Under 249 g", "Extended Battery Life", "4K HDR Video"],
    specifications: [{ key: "Weight", value: "<249g" }, { key: "Flight Time", value: "38 mins" }],
    asin: "B0BQ2T2TH9",
    modelNumber: "CP.MA.00000584.01"
  },
  // 21. HOME - VACUUM
  {
    name: "Dyson V15 Detect Cordless Vacuum",
    brandName: "Dyson",
    categoryHierarchy: ["Home & Kitchen", "Vacuums & Floor Care", "Vacuums", "Stick Vacuums"],
    price: 749.99,
    stock: 20,
    description: "Dyson's most powerful, intelligent cordless vacuum. Laser reveals microscopic dust.",
    images: ["https://images.unsplash.com/photo-1558317374-a354d5f6d4da?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Laser reveals microscopic dust", "Intelligently optimizes suction", "Scientific proof of a deep clean"],
    specifications: [{ key: "Run time", value: "60 mins" }, { key: "Weight", value: "6.8 lbs" }],
    asin: "B098W62L6N",
    modelNumber: "V15 Detect"
  },
  // 22. HOME - MIXER
  {
    name: "KitchenAid Artisan Series 5-Qt Stand Mixer",
    brandName: "KitchenAid",
    categoryHierarchy: ["Home & Kitchen", "Kitchen & Dining", "Small Appliances", "Mixers", "Stand Mixers"],
    price: 449.99,
    stock: 40,
    description: "Make up to 9 dozen cookies in a single batch with the KitchenAid Artisan Series 5 Quart Tilt-Head Stand Mixer.",
    images: ["https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Built to take it all on", "10 Speeds", "5 Quart Stainless Steel Bowl"],
    specifications: [{ key: "Color", value: "Empire Red" }, { key: "Capacity", value: "5 Quarts" }],
    asin: "B00005UP2P",
    modelNumber: "KSM150PSER"
  },
  // 23. HOME - LIGHTING
  {
    name: "Philips Hue White and Color Ambiance Smart Bulb",
    brandName: "Philips Hue",
    categoryHierarchy: ["Home & Kitchen", "Lighting & Ceiling Fans", "Light Bulbs", "LED Bulbs"],
    price: 49.99,
    stock: 100,
    description: "Go bright, go dark, go colorful. Sync with music, TV, and games.",
    images: ["https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["16 million colors", "Works with Alexa & Google Assistant", "Bluetooth & Zigbee"],
    specifications: [{ key: "Wattage", value: "75W Equivalent" }, { key: "Fitting", value: "E26" }],
    asin: "B095KQ5F86",
    modelNumber: "562701"
  },
  // 24. HOME - VACUUM 2
  {
    name: "Shark NV360 Navigator Lift-Away Deluxe",
    brandName: "Shark",
    categoryHierarchy: ["Home & Kitchen", "Vacuums & Floor Care", "Vacuums", "Upright Vacuums"],
    price: 199.99,
    stock: 55,
    description: "Easy-to-use, upright vacuum with Lift-Away technology for portable cleaning.",
    images: ["https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Lift-Away functionality", "Anti-Allergen Complete Seal", "Swivel Steering"],
    specifications: [{ key: "Color", value: "Blue" }, { key: "Cord Length", value: "25 ft" }],
    asin: "B004Q4DRJW",
    modelNumber: "NV360"
  },
  // 25. HOME - COFFEE
  {
    name: "Keurig K-Elite Coffee Maker",
    brandName: "Keurig",
    categoryHierarchy: ["Home & Kitchen", "Kitchen & Dining", "Coffee, Tea & Espresso", "Coffee Makers", "Single-Serve Brewers"],
    price: 189.99,
    stock: 70,
    description: "The Keurig K-Elite brewer blends a premium finish and programmable features.",
    images: ["https://images.unsplash.com/photo-1621763736923-2860950d3e8d?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Strong Brew button", "Iced setting", "Large 75oz water reservoir"],
    specifications: [{ key: "Color", value: "Brushed Silver" }, { key: "Cup Sizes", value: "4, 6, 8, 10, 12oz" }],
    asin: "B078N32F14",
    modelNumber: "K-Elite"
  },
  // 26. HOME - COOKWARE
  {
    name: "Lodge 10.25 Inch Cast Iron Skillet",
    brandName: "Lodge",
    categoryHierarchy: ["Home & Kitchen", "Kitchen & Dining", "Cookware", "Skillets"],
    price: 19.90,
    stock: 300,
    description: "The Lodge Cast Iron Skillet is a multi-functional cookware that works wonders with slow-cooking recipes.",
    images: ["https://images.unsplash.com/photo-1584947897620-4e58639a9b92?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Pre-seasoned with 100% natural vegetable oil", "Unparalleled heat retention", "Made in the USA"],
    specifications: [{ key: "Material", value: "Cast Iron" }, { key: "Size", value: "10.25 Inch" }],
    asin: "B00006JSUA",
    modelNumber: "L8SK3"
  },
  // 27. HOME - APPLIANCE
  {
    name: "Cosori Air Fryer Pro LE 5-Qt",
    brandName: "Cosori",
    categoryHierarchy: ["Home & Kitchen", "Kitchen & Dining", "Small Appliances", "Fryers", "Air Fryers"],
    price: 99.99,
    stock: 120,
    description: "Enjoy crispy textures with up to 85% less oil. The Air Fryer Pro LE has 9 one-touch cooking functions.",
    images: ["https://images.unsplash.com/photo-1626163306616-e7a71b369929?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Compact & Quiet", "9 Cooking Functions", "Dishwasher Safe"],
    specifications: [{ key: "Capacity", value: "5 Quarts" }, { key: "Max Temp", value: "450°F" }],
    asin: "B0936FGLQS",
    modelNumber: "CAF-L501-KUS"
  },
  // 28. HOME - BEDDING
  {
    name: "Beckham Hotel Collection Bed Pillows",
    brandName: "Beckham Luxury Linens",
    categoryHierarchy: ["Home & Kitchen", "Bedding", "Pillows", "Bed Pillows"],
    price: 49.99,
    stock: 250,
    description: "Luxury Gel Pillow - Dust Mite Resistant & Hypoallergenic.",
    images: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Superior comfort", "Cooling gel fiber", "Fade & Stain Resistant"],
    specifications: [{ key: "Size", value: "Queen" }, { key: "Set", value: "2 Pack" }],
    asin: "B01LYNW421",
    modelNumber: "BLL-PLW-Q-2"
  },
  // 29. HOME - SHEETS
  {
    name: "Utopia Bedding Queen Bed Sheets",
    brandName: "Utopia Bedding",
    categoryHierarchy: ["Home & Kitchen", "Bedding", "Bed Sheets", "Sheet Sets"],
    price: 24.95,
    stock: 300,
    description: "Soft Brushed Microfiber 4 Piece Queen Bed Sheets Set.",
    images: ["https://images.unsplash.com/photo-1522771753035-0a15df6f1805?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Soft Microfiber", "Shrink and Fade Resistant", "Easy Care"],
    specifications: [{ key: "Size", value: "Queen" }, { key: "Color", value: "Grey" }],
    asin: "B00NLLUP4C",
    modelNumber: "UB001"
  },
  // 30. SPORTS - BOTTLE
  {
    name: "Hydro Flask Wide Mouth Bottle",
    brandName: "Hydro Flask",
    categoryHierarchy: ["Sports & Outdoors", "Sports & Fitness", "Accessories", "Water Bottles"],
    price: 44.95,
    stock: 150,
    description: "TempShield insulation keeps beverages cold up to 24 hours and hot up to 12 hours.",
    images: ["https://images.unsplash.com/photo-1602143407151-01114192003b?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["TempShield insulation", "Durable 18/8 Pro-Grade Stainless Steel", "BPA-Free"],
    specifications: [{ key: "Capacity", value: "32 oz" }, { key: "Color", value: "Pacific" }],
    asin: "B01ACAX65C",
    modelNumber: "W32TS415"
  },
  // 31. SPORTS - YOGA
  {
    name: "Manduka PRO Yoga Mat",
    brandName: "Manduka",
    categoryHierarchy: ["Sports & Outdoors", "Sports & Fitness", "Yoga", "Mats"],
    price: 129.00,
    stock: 40,
    description: "Ultra-dense cushioning provides superior support, stability and joint protection.",
    images: ["https://images.unsplash.com/photo-1592432678016-e910b452f9a9?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["High Density Cushion", "Closed-Cell Surface", "Lifetime Guarantee"],
    specifications: [{ key: "Length", value: "71 inch" }, { key: "Thickness", value: "6mm" }],
    asin: "B00067E4T8",
    modelNumber: "PRO71-BLACK"
  },
  // 32. SPORTS - WEIGHTS
  {
    name: "Bowflex SelectTech 552 Adjustable Dumbbells",
    brandName: "Bowflex",
    categoryHierarchy: ["Sports & Outdoors", "Sports & Fitness", "Strength Training", "Dumbbells"],
    price: 429.00,
    stock: 15,
    description: "Adjusts from 5 to 52.5 lbs in 2.5 lb increments up to the first 25 lbs.",
    images: ["https://images.unsplash.com/photo-1586401100388-615819623806?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Replaces 15 sets of weights", "Selection dials", "Durable molding"],
    specifications: [{ key: "Weight Range", value: "5-52.5 lbs" }, { key: "Sold As", value: "Pair" }],
    asin: "B001ARYU58",
    modelNumber: "100131"
  },
  // 33. SPORTS - FOOTBALL
  {
    name: "Wilson NFL 'The Duke' Football",
    brandName: "Wilson",
    categoryHierarchy: ["Sports & Outdoors", "Sports & Fitness", "Team Sports", "Football", "Balls"],
    price: 119.95,
    stock: 60,
    description: "The official ball of the NFL. Made from 100% exclusive Horween leather.",
    images: ["https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Official NFL Ball", "Made in USA", "Horween Leather"],
    specifications: [{ key: "Size", value: "Official" }, { key: "Material", value: "Leather" }],
    asin: "B00005LL1K",
    modelNumber: "WTF1100"
  },
  // 34. SPORTS - CAMPING
  {
    name: "Coleman Sundome Camping Tent",
    brandName: "Coleman",
    categoryHierarchy: ["Sports & Outdoors", "Outdoor Recreation", "Camping & Hiking", "Tents"],
    price: 69.99,
    stock: 80,
    description: "Dome tent with sturdy frame that withstands 35+ mph winds.",
    images: ["https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["WeatherTec system", "Easy setup in 10 mins", "Good ventilation"],
    specifications: [{ key: "Capacity", value: "4 Person" }, { key: "Color", value: "Green" }],
    asin: "B004J2GUOU",
    modelNumber: "2000024582"
  },
  // 35. SPORTS - COOLER
  {
    name: "Yeti Tundra 45 Cooler",
    brandName: "YETI",
    categoryHierarchy: ["Sports & Outdoors", "Outdoor Recreation", "Camping & Hiking", "Camp Kitchen", "Coolers"],
    price: 325.00,
    stock: 25,
    description: "The Tundra 45 combines versatility with durability. Holds 26 cans with recommended 2:1 ice-to-contents ratio.",
    images: ["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["PermaFrost Insulation", "Rotomolded Construction", "Bear Resistant"],
    specifications: [{ key: "Color", value: "White" }, { key: "Weight", value: "23 lbs" }],
    asin: "B004YIBW2M",
    modelNumber: "YT45W"
  },
  // 36. SPORTS - BASKETBALL
  {
    name: "Spalding NBA Street Outdoor Basketball",
    brandName: "Spalding",
    categoryHierarchy: ["Sports & Outdoors", "Sports & Fitness", "Team Sports", "Basketball", "Balls"],
    price: 24.99,
    stock: 100,
    description: "Designed for outdoor play with a durable rubber cover.",
    images: ["https://images.unsplash.com/photo-1519861531473-92002639313e?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Performance outdoor rubber cover", "Deep channel design", "Official size"],
    specifications: [{ key: "Size", value: "Size 7 (29.5\")" }, { key: "Material", value: "Rubber" }],
    asin: "B00091QJCC",
    modelNumber: "73-449Z"
  },
  // 37. TOYS - LEGO
  {
    name: "LEGO Star Wars Millennium Falcon",
    brandName: "LEGO",
    categoryHierarchy: ["Toys & Games", "Building Toys", "Building Sets"],
    price: 169.99,
    stock: 30,
    description: "Build the iconic Millennium Falcon with this 1,351-piece LEGO Star Wars set.",
    images: ["https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Includes 7 characters", "Opening cockpit", "Spring-loaded shooters"],
    specifications: [{ key: "Pieces", value: "1351" }, { key: "Age", value: "9+" }],
    asin: "B07Q2N3585",
    modelNumber: "75257"
  },
  // 38. TOYS - BARBIE
  {
    name: "Barbie Dreamhouse 2023",
    brandName: "Barbie",
    categoryHierarchy: ["Toys & Games", "Dolls & Accessories", "Dollhouses"],
    price: 199.00,
    stock: 20,
    description: "3-story dollhouse with pool, slide, elevator, lights and sounds.",
    images: ["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["75+ pieces", "3 stories", "Wheelchair accessible elevator"],
    specifications: [{ key: "Height", value: "43 inches" }, { key: "Width", value: "41 inches" }],
    asin: "B0B625L3F1",
    modelNumber: "HCD50"
  },
  // 39. TOYS - HOT WHEELS
  {
    name: "Hot Wheels 10-Car Pack",
    brandName: "Hot Wheels",
    categoryHierarchy: ["Toys & Games", "Vehicles", "Toy Cars"],
    price: 12.99,
    stock: 200,
    description: "Speed into an instant Hot Wheels collection with a race-ready pack that features 10 highly detailed vehicles.",
    images: ["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["1:64 scale", "Authentic details", "Great gift for kids"],
    specifications: [{ key: "Scale", value: "1:64" }, { key: "Material", value: "Die-cast" }],
    asin: "B0007R4J30",
    modelNumber: "54886"
  },
  // 40. BEAUTY - SKINCARE
  {
    name: "CeraVe Moisturizing Cream",
    brandName: "CeraVe",
    categoryHierarchy: ["Beauty & Personal Care", "Skin Care", "Body", "Creams"],
    price: 19.49,
    stock: 300,
    description: "Body and Face Moisturizer for Dry Skin with Hyaluronic Acid and Ceramides.",
    images: ["https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["With ceramides 1, 3 and 6-II", "Hyaluronic acid", "Fragrance free"],
    specifications: [{ key: "Size", value: "19 oz" }, { key: "Skin Type", value: "Dry" }],
    asin: "B00TTD9BRC",
    modelNumber: "Moisturizing Cream"
  },
  // 41. BEAUTY - FACE
  {
    name: "La Roche-Posay Toleriane Double Repair Face Moisturizer",
    brandName: "La Roche-Posay",
    categoryHierarchy: ["Beauty & Personal Care", "Skin Care", "Face", "Creams & Moisturizers"],
    price: 22.99,
    stock: 150,
    description: "Daily Face Moisturizer with Ceramide and Niacinamide for All Skin Types.",
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Restores healthy skin barrier", "Up to 48hr hydration", "Oil-free"],
    specifications: [{ key: "Size", value: "2.5 oz" }, { key: "SPF", value: "None" }],
    asin: "B01NCWV3KM",
    modelNumber: "3337875545792"
  },
  // 42. BEAUTY - ORAL
  {
    name: "Oral-B Pro 1000 Rechargeable Electric Toothbrush",
    brandName: "Oral-B",
    categoryHierarchy: ["Beauty & Personal Care", "Oral Care", "Toothbrushes", "Electric Toothbrushes"],
    price: 49.94,
    stock: 80,
    description: "Clinically proven superior 3D Cleaning Action oscillates, rotates and pulsates to break up and remove plaque.",
    images: ["https://images.unsplash.com/photo-1559676813-26c99b803625?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Removes 300% more plaque", "Pressure sensor", "2 minute timer"],
    specifications: [{ key: "Color", value: "White" }, { key: "Power", value: "Rechargeable" }],
    asin: "B003UKM9CO",
    modelNumber: "Pro 1000"
  },
  // 43. BEAUTY - SHAVE
  {
    name: "Philips Norelco Multigroomer All-in-One Trimmer",
    brandName: "Philips Norelco",
    categoryHierarchy: ["Beauty & Personal Care", "Shave & Hair Removal", "Men's", "Beard Trimmers"],
    price: 19.96,
    stock: 200,
    description: "13 piece mens grooming kit for beard, face, nose, and ear hair trimming.",
    images: ["https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["DualCut technology", "No oil needed", "Washable attachments"],
    specifications: [{ key: "Pieces", value: "13" }, { key: "Battery", value: "60 mins" }],
    asin: "B01K1HPA60",
    modelNumber: "MG3750/60"
  },
  // 44. BEAUTY - HAIR
  {
    name: "Revlon One-Step Volumizer",
    brandName: "Revlon",
    categoryHierarchy: ["Beauty & Personal Care", "Hair Care", "Styling Tools", "Hot-Air Brushes"],
    price: 39.87,
    stock: 120,
    description: "The same Brush designed with Nylon Pin & Tufted Bristles for detangling, improved volume and control.",
    images: ["https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Style, Dry & Volumize", "Ionic Technology", "Ceramic Coating"],
    specifications: [{ key: "Color", value: "Black" }, { key: "Wattage", value: "1100W" }],
    asin: "B01LSUQSB0",
    modelNumber: "RVDR5222"
  },
  // 45. BEAUTY - OIL
  {
    name: "Olaplex No. 7 Bonding Oil",
    brandName: "Olaplex",
    categoryHierarchy: ["Beauty & Personal Care", "Hair Care", "Hair Treatments", "Oils"],
    price: 30.00,
    stock: 90,
    description: "A highly-concentrated, weightless reparative styling oil.",
    images: ["https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Repairs damaged hair", "Strengthens and protects", "Restores healthy appearance"],
    specifications: [{ key: "Size", value: "1 fl oz" }, { key: "Hair Type", value: "All" }],
    asin: "B07V2B5W85",
    modelNumber: "20140616"
  },
  // 46. BOOKS - FICTION
  {
    name: "The Alchemist",
    brandName: "HarperOne",
    categoryHierarchy: ["Books", "Literature & Fiction", "Contemporary"],
    price: 14.99,
    stock: 500,
    description: "A special 25th anniversary edition of the extraordinary international bestseller.",
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["International Bestseller", "Inspiring story", "Modern Classic"],
    specifications: [{ key: "Author", value: "Paulo Coelho" }, { key: "Pages", value: "208" }],
    asin: "0062315005",
    modelNumber: "978-0062315007"
  },
  // 47. BOOKS - SELF HELP
  {
    name: "Atomic Habits",
    brandName: "Avery",
    categoryHierarchy: ["Books", "Self-Help", "Personal Transformation"],
    price: 13.79,
    stock: 400,
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
    images: ["https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["#1 New York Times Bestseller", "Practical strategies", "Transform your life"],
    specifications: [{ key: "Author", value: "James Clear" }, { key: "Pages", value: "320" }],
    asin: "0735211299",
    modelNumber: "978-0735211292"
  },
  // 48. BOOKS - FANTASY
  {
    name: "Harry Potter and the Sorcerer's Stone",
    brandName: "Scholastic",
    categoryHierarchy: ["Books", "Children's Books", "Science Fiction & Fantasy", "Fantasy & Magic"],
    price: 10.99,
    stock: 600,
    description: "The first book in the Harry Potter series.",
    images: ["https://images.unsplash.com/photo-1618666012174-83b441c0bc76?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Beloved classic", "Start of the journey", "Magical world"],
    specifications: [{ key: "Author", value: "J.K. Rowling" }, { key: "Pages", value: "309" }],
    asin: "059035342X",
    modelNumber: "978-0590353427"
  },
  // 49. BOOKS - SCI FI
  {
    name: "Project Hail Mary",
    brandName: "Ballantine Books",
    categoryHierarchy: ["Books", "Science Fiction & Fantasy", "Science Fiction", "Hard Science Fiction"],
    price: 16.99,
    stock: 200,
    description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller.",
    images: ["https://images.unsplash.com/photo-1614544048536-0d28caf77f41?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["From author of The Martian", "Gripping story", "Scientific accuracy"],
    specifications: [{ key: "Author", value: "Andy Weir" }, { key: "Pages", value: "496" }],
    asin: "0593135202",
    modelNumber: "978-0593135204"
  },
  // 50. FASHION - SHOES
  {
    name: "Adidas Men's Ultraboost Light Running Shoes",
    brandName: "Adidas",
    categoryHierarchy: ["Clothing, Shoes & Jewelry", "Men", "Shoes", "Athletic", "Running"],
    price: 190.00,
    stock: 60,
    description: "Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever.",
    images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Light BOOST midsole", "Primeknit+ textile upper", "Continental Rubber outsole"],
    specifications: [{ key: "Color", value: "Core Black" }, { key: "Material", value: "Textile" }],
    asin: "B0B8Q8Q8Q8",
    modelNumber: "HQ6339"
  },
  // 51. FASHION - HOODIE
  {
    name: "Nike Men's Sportswear Club Fleece Hoodie",
    brandName: "Nike",
    categoryHierarchy: ["Clothing, Shoes & Jewelry", "Men", "Clothing", "Hoodies & Sweatshirts"],
    price: 55.00,
    stock: 150,
    description: "A closet staple, the Nike Sportswear Club Fleece Pullover Hoodie combines classic style with soft comfort.",
    images: ["https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Soft comfort", "Adjustable hood", "Kangaroo pocket"],
    specifications: [{ key: "Material", value: "80% Cotton" }, { key: "Fit", value: "Standard" }],
    asin: "B07J5L5L5L",
    modelNumber: "BV2654"
  },
  // 52. FASHION - WOMEN
  {
    name: "Calvin Klein Women's Modern Cotton Bralette",
    brandName: "Calvin Klein",
    categoryHierarchy: ["Clothing, Shoes & Jewelry", "Women", "Clothing", "Lingerie, Sleep & Lounge", "Bras"],
    price: 28.00,
    stock: 200,
    description: "Modern cotton blend unlined bralette with racerback design.",
    images: ["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Cotton modal blend", "Soft flexible band", "Racerback"],
    specifications: [{ key: "Color", value: "Grey Heather" }, { key: "Material", value: "53% Cotton" }],
    asin: "B00K6K6K6K",
    modelNumber: "QF1061"
  },
  // 53. FASHION - CLOGS
  {
    name: "Crocs Unisex-Adult Classic Clogs",
    brandName: "Crocs",
    categoryHierarchy: ["Clothing, Shoes & Jewelry", "Women", "Shoes", "Mules & Clogs"],
    price: 49.99,
    stock: 300,
    description: "The irreverent go-to comfort shoe that you're sure to fall deeper in love with day after day.",
    images: ["https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Lightweight", "Water-friendly", "Ventilation ports"],
    specifications: [{ key: "Color", value: "Black" }, { key: "Material", value: "Croslite" }],
    asin: "B0014C2N2K",
    modelNumber: "10001"
  },
  // 54. FASHION - BEANIE
  {
    name: "Carhartt Men's Knit Cuffed Beanie",
    brandName: "Carhartt",
    categoryHierarchy: ["Clothing, Shoes & Jewelry", "Men", "Accessories", "Hats & Caps", "Skullies & Beanies"],
    price: 19.99,
    stock: 400,
    description: "Keep your head warm with this classic knit beanie.",
    images: ["https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["100% Acrylic", "Stretchable rib-knit", "Carhartt label"],
    specifications: [{ key: "Color", value: "Carhartt Brown" }, { key: "Size", value: "One Size" }],
    asin: "B002G9U7Y0",
    modelNumber: "A18"
  },
  // 55. FASHION - LUGGAGE
  {
    name: "Samsonite Omni PC Hardside Expandable Luggage",
    brandName: "Samsonite",
    categoryHierarchy: ["Clothing, Shoes & Jewelry", "Luggage & Travel Gear", "Luggage", "Carry-Ons"],
    price: 129.00,
    stock: 40,
    description: "Omni PC combines scratch-resistant textures with the lightest 100% polycarbonate construction.",
    images: ["https://images.unsplash.com/photo-1565026057447-bc27e38c4330?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Micro-diamond texture", "Spinner wheels", "TSA locks"],
    specifications: [{ key: "Size", value: "20 Inch" }, { key: "Color", value: "Black" }],
    asin: "B013WFOB76",
    modelNumber: "68308-1041"
  },
  // 56. ELECTRONICS - WATCH
  {
    name: "Apple Watch Series 9",
    brandName: "Apple",
    categoryHierarchy: ["Electronics", "Wearable Technology", "Smartwatches"],
    price: 399.00,
    stock: 50,
    description: "Smarter, brighter, and mightier. Series 9 helps you stay connected, active, healthy, and safe.",
    images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["S9 SiP", "Double tap gesture", "Brighter display"],
    specifications: [{ key: "Case", value: "41mm" }, { key: "Material", value: "Aluminum" }],
    asin: "B0CHX3X3X3",
    modelNumber: "MR993LL/A"
  },
  // 57. ELECTRONICS - TABLET
  {
    name: "Samsung Galaxy Tab S9",
    brandName: "Samsung",
    categoryHierarchy: ["Electronics", "Computers & Accessories", "Computers & Tablets", "Tablets"],
    price: 799.99,
    stock: 35,
    description: "The new standard for premium tablets. Dynamic AMOLED 2X display.",
    images: ["https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Snapdragon 8 Gen 2", "IP68 water resistant", "S Pen included"],
    specifications: [{ key: "Storage", value: "128GB" }, { key: "Color", value: "Graphite" }],
    asin: "B0C4X4X4X4",
    modelNumber: "SM-X710"
  },
  // 58. ELECTRONICS - MOUSE
  {
    name: "Logitech MX Master 3S Mouse",
    brandName: "Logitech",
    categoryHierarchy: ["Electronics", "Computers & Accessories", "Computer Accessories", "Keyboards, Mice & Accessories", "Mice"],
    price: 99.99,
    stock: 80,
    description: "Performance Wireless Mouse with Ultra-fast Scrolling, Ergo Design, 8K DPI.",
    images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Quiet Clicks", "8K DPI Track-on-glass", "MagSpeed scrolling"],
    specifications: [{ key: "Connectivity", value: "Bluetooth/USB" }, { key: "Color", value: "Graphite" }],
    asin: "B09HM94VDS",
    modelNumber: "910-006550"
  },
  // 59. ELECTRONICS - KEYBOARD
  {
    name: "Keychron K2 Wireless Mechanical Keyboard",
    brandName: "Keychron",
    categoryHierarchy: ["Electronics", "Computers & Accessories", "Computer Accessories", "Keyboards, Mice & Accessories", "Keyboards"],
    price: 79.99,
    stock: 60,
    description: "75% Layout Compact Wireless Mechanical Keyboard for Mac and Windows.",
    images: ["https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["Bluetooth 5.1", "Gateron Switches", "Mac Layout"],
    specifications: [{ key: "Switch", value: "Brown" }, { key: "Backlight", value: "RGB" }],
    asin: "B07Q2N3586",
    modelNumber: "K2-C2"
  },
  // 60. ELECTRONICS - GAMING LAPTOP
  {
    name: "ASUS ROG Zephyrus G14 Gaming Laptop",
    brandName: "ASUS",
    categoryHierarchy: ["Electronics", "Computers & Accessories", "Computers & Tablets", "Laptops", "Gaming Laptops"],
    price: 1499.99,
    stock: 25,
    description: "World's most powerful 14-inch gaming laptop. AMD Ryzen 9, RTX 4060.",
    images: ["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: ["AniMe Matrix display", "Nebula Display", "Liquid Metal Cooling"],
    specifications: [{ key: "Processor", value: "Ryzen 9" }, { key: "GPU", value: "RTX 4060" }],
    asin: "B0BV7XQ9V9",
    modelNumber: "GA402XV"
  }
];

// --- MOCK DATA KHUSUS SELLER (10 Produk Per Seller) ---
const sellerMockData = {
  umar: [ // Umar Store (Fokus: Aksesoris Komputer & Gadget)
    { name: "UmarTech RGB Gaming Mouse", category: "Mice", price: 25.99, stock: 50, brand: "UmarTech" },
    { name: "UmarTech Mechanical Keyboard Blue Switch", category: "Keyboards", price: 45.50, stock: 30, brand: "UmarTech" },
    { name: "UmarTech USB-C Hub 7-in-1", category: "Computer Accessories", price: 35.00, stock: 100, brand: "UmarTech" },
    { name: "UmarTech Laptop Cooling Pad", category: "Computer Accessories", price: 20.00, stock: 40, brand: "UmarTech" },
    { name: "UmarTech 1080p Webcam", category: "Webcams", price: 29.99, stock: 60, brand: "UmarTech" },
    { name: "UmarTech Large Desk Mat", category: "Computer Accessories", price: 15.00, stock: 150, brand: "UmarTech" },
    { name: "UmarTech Bluetooth 5.0 Dongle", category: "Computer Accessories", price: 9.99, stock: 200, brand: "UmarTech" },
    { name: "UmarTech HDMI Cable 4K 2m", category: "Computer Accessories", price: 8.50, stock: 300, brand: "UmarTech" },
    { name: "UmarTech Cable Organizer Clips", category: "Computer Accessories", price: 5.99, stock: 500, brand: "UmarTech" },
    { name: "UmarTech Screen Cleaning Kit", category: "Computer Accessories", price: 6.99, stock: 100, brand: "UmarTech" }
  ],
  musa: [ // Musa Store (Fokus: Peralatan Rumah & Dapur)
    { name: "MusaHome Ceramic Coffee Mug Set", category: "Kitchen & Dining", price: 22.00, stock: 40, brand: "MusaHome" },
    { name: "MusaHome Stainless Steel Water Bottle", category: "Kitchen & Dining", price: 18.50, stock: 80, brand: "MusaHome" },
    { name: "MusaHome Bamboo Cutting Board", category: "Kitchen & Dining", price: 15.99, stock: 60, brand: "MusaHome" },
    { name: "MusaHome Silicone Spatula Set", category: "Kitchen & Dining", price: 12.00, stock: 100, brand: "MusaHome" },
    { name: "MusaHome Digital Kitchen Scale", category: "Kitchen & Dining", price: 14.50, stock: 50, brand: "MusaHome" },
    { name: "MusaHome Oven Mitts Heat Resistant", category: "Kitchen & Dining", price: 9.99, stock: 120, brand: "MusaHome" },
    { name: "MusaHome Airtight Food Containers", category: "Kitchen & Dining", price: 28.00, stock: 35, brand: "MusaHome" },
    { name: "MusaHome Handheld Milk Frother", category: "Kitchen & Dining", price: 11.00, stock: 90, brand: "MusaHome" },
    { name: "MusaHome Reusable Metal Straws", category: "Kitchen & Dining", price: 5.50, stock: 200, brand: "MusaHome" },
    { name: "MusaHome Dish Drying Mat", category: "Kitchen & Dining", price: 7.99, stock: 150, brand: "MusaHome" }
  ],
  luth: [ // Luth Store (Fokus: Olahraga & Fashion)
    { name: "LuthSport Men's Cotton T-Shirt", category: "Clothing", price: 12.99, stock: 200, brand: "LuthSport" },
    { name: "LuthSport Athletic Running Socks", category: "Clothing", price: 8.99, stock: 300, brand: "LuthSport" },
    { name: "LuthSport Yoga Mat with Strap", category: "Sports & Fitness", price: 25.00, stock: 50, brand: "LuthSport" },
    { name: "LuthSport Resistance Bands Set", category: "Sports & Fitness", price: 15.50, stock: 100, brand: "LuthSport" },
    { name: "LuthSport Sports Headband", category: "Clothing", price: 6.00, stock: 150, brand: "LuthSport" },
    { name: "LuthSport Gym Duffel Bag", category: "Sports & Fitness", price: 35.00, stock: 40, brand: "LuthSport" },
    { name: "LuthSport Baseball Cap", category: "Clothing", price: 14.00, stock: 80, brand: "LuthSport" },
    { name: "LuthSport Polarized Sunglasses", category: "Accessories", price: 19.99, stock: 60, brand: "LuthSport" },
    { name: "LuthSport Running Armband", category: "Sports & Fitness", price: 10.00, stock: 120, brand: "LuthSport" },
    { name: "LuthSport Compression Shorts", category: "Clothing", price: 18.00, stock: 90, brand: "LuthSport" }
  ]
};

const seedProducts = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGO_URI or MONGODB_URI is missing in .env');
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected!');

    // 0. Cari Admin User untuk dijadikan pemilik produk seed (Amazon Official)
    const adminUser = await User.findOne({ role: 'admin' });
    
    // 0.1 Cari Seller Users (Umar, Musa, Luth)
    const umarUser = await User.findOne({ email: 'umar@rully.com' });
    const musaUser = await User.findOne({ email: 'musa@rully.com' });
    const luthUser = await User.findOne({ email: 'luth@rully.com' });

    // --- SEED AMAZON OFFICIAL PRODUCTS ---
    console.log('📦 Seeding Amazon Official Products...');
    for (const item of productsToSeed) {
      // 1. Handle Category Hierarchy (Recursive Creation)
      let currentParentId = null;
      let finalCategory = null;
      
      // Gunakan hierarchy jika ada, jika tidak fallback ke categoryName (untuk backward compatibility)
      const categories = item.categoryHierarchy || [item.categoryName];

      for (let i = 0; i < categories.length; i++) {
        const catName = categories[i];
        let category = await Category.findOne({ name: catName });
        
        if (!category) {
          category = await Category.create({ 
            name: catName, 
            slug: slugify(catName, { lower: true }),
            parent: currentParentId, // Link ke parent sebelumnya
            level: i // Set level kedalaman
          });
          console.log(`📁 Created Category: ${catName} (Level ${i})`);
        }
        
        // Update parent untuk iterasi berikutnya
        currentParentId = category._id;
        finalCategory = category;
      }

      // 2. Handle Brand
      let brand = await Brand.findOne({ name: item.brandName });
      if (!brand) {
        brand = await Brand.create({ name: item.brandName, slug: slugify(item.brandName, { lower: true }), logo: `https://via.placeholder.com/150?text=${item.brandName}` });
        console.log(`🏷️ Created Brand: ${item.brandName}`);
      }

      // 3. Handle Product
      const slug = slugify(item.name, { lower: true, strict: true });
      
      // Data yang akan disimpan
      const productData = {
        name: item.name,
        slug: slug,
        seller: adminUser?._id, // Assign produk ke Admin (jika ada)
        brand: brand._id,
        category: finalCategory._id, // Gunakan kategori terakhir (paling spesifik)
        price: item.price,
        stock: item.stock,
        description: item.description,
        images: item.images,
        bulletPoints: item.bulletPoints,
        specifications: item.specifications,
        asin: item.asin,
        modelNumber: item.modelNumber,
        shippingInfo: {
          weight: "1kg",
          dimensions: "10x10x10 cm",
          shipsFrom: "Amazon",
          soldBy: "Amazon Official"
        },
        isPrime: true,
        isSmallBusiness: false,
        ratingsAverage: 4.5,
        numReviews: Math.floor(Math.random() * 500)
      };

      await Product.findOneAndUpdate({ slug: slug }, productData, { upsert: true, new: true });
      console.log(`📦 Processed: ${item.name}`);
    }

    // --- SEED SELLER PRODUCTS (Umar, Musa, Luth) ---
    const sellers = [
      { user: umarUser, data: sellerMockData.umar, store: "Umar Store" },
      { user: musaUser, data: sellerMockData.musa, store: "Musa Store" },
      { user: luthUser, data: sellerMockData.luth, store: "Luth Store" }
    ];

    for (const seller of sellers) {
      if (!seller.user) {
        console.log(`⚠️ Skipping ${seller.store}: User not found in DB.`);
        continue;
      }

      console.log(`\n🛍️ Seeding products for ${seller.store}...`);
      
      for (const item of seller.data) {
        // Simple Category Logic for Mock Sellers (Find or Create Root Category)
        let category = await Category.findOne({ name: item.category });
        if (!category) {
          category = await Category.create({ 
            name: item.category, 
            slug: slugify(item.category, { lower: true }) 
          });
        }

        // Simple Brand Logic
        let brand = await Brand.findOne({ name: item.brand });
        if (!brand) {
          brand = await Brand.create({ 
            name: item.brand, 
            slug: slugify(item.brand, { lower: true }),
            logo: `https://via.placeholder.com/150?text=${item.brand}`
          });
        }

        const slug = slugify(item.name, { lower: true, strict: true });
        
        const productData = {
          name: item.name,
          slug: slug,
          seller: seller.user._id, // LINK KE SELLER
          brand: brand._id,
          category: category._id,
          price: item.price,
          stock: item.stock,
          description: `Original product from ${seller.store}. High quality ${item.name}.`,
          images: [`https://via.placeholder.com/500?text=${item.name.replace(/ /g, '+')}`],
          bulletPoints: ["High Quality", "Fast Shipping", `Sold by ${seller.store}`],
          specifications: [{ key: "Brand", value: item.brand }],
          shippingInfo: {
            shipsFrom: seller.store,
            soldBy: seller.store // TAMPIL DI FRONTEND SEBAGAI NAMA TOKO
          },
          ratingsAverage: 4.8,
          numReviews: Math.floor(Math.random() * 50)
        };

        await Product.findOneAndUpdate({ slug: slug }, productData, { upsert: true, new: true });
        console.log(`   -> Added: ${item.name}`);
      }
    }

    console.log('🎉 Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    process.exit(1);
  }
};

seedProducts();