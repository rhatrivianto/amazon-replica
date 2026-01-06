// File ini khusus untuk menyimpan data dummy produk
// Edit file ini untuk menambah/mengubah produk yang akan di-seed

export const productsToSeed = [
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
  }
];
