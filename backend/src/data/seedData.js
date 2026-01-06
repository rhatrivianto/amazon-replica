// File ini khusus untuk menyimpan data dummy produk
// Edit file ini untuk menambah/mengubah produk yang akan di-seed

export const productsToSeed = [
  // 1. ELECTRONICS - AUDIO
  {
    name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    brandName: "Sony",
    categoryHierarchy: ["Electronics", "Headphones, Earbuds & Accessories", "Headphones", "Over-Ear Headphones", "Noise Cancelling Headphones"],
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
    categoryHierarchy: ["Electronics", "Computers & Accessories", "Computers & Tablets", "Laptops", "Traditional Laptops"],
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
    categoryHierarchy: ["Electronics", "Camera & Photo", "Digital Cameras", "Mirrorless Cameras", "Full Frame Cameras"],
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
    categoryHierarchy: ["Home & Kitchen", "Kitchen & Dining", "Coffee, Tea & Espresso", "Coffee Makers", "Single-Serve Brewers"],
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
    categoryHierarchy: ["Home & Kitchen", "Kitchen & Dining", "Small Appliances", "Specialty Appliances", "Pressure Cookers"],
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
    categoryHierarchy: ["Electronics", "Computers & Accessories", "Monitors", "Gaming Monitors", "Curved Monitors"],
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
    categoryHierarchy: ["Clothing, Shoes & Jewelry", "Men", "Accessories", "Sunglasses & Eyewear", "Sunglasses"],
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
    categoryHierarchy: ["Home & Kitchen", "Furniture", "Home Office Furniture", "Chairs & Sofas", "Desk Chairs"],
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
    categoryHierarchy: ["Video Games", "Nintendo Switch", "Consoles", "Handheld Game Systems"],
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
    categoryHierarchy: ["Clothing, Shoes & Jewelry", "Men", "Clothing", "Jeans", "Regular Fit"],
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
  // --- NEW ITEMS (MORE NESTED) ---
  // 11. TABLET
  {
    name: "Apple iPad Pro 12.9-inch (6th Gen)",
    brandName: "Apple",
    categoryHierarchy: ["Electronics", "Computers & Accessories", "Computers & Tablets", "Tablets", "iPad"],
    price: 1099.00,
    stock: 75,
    description: "Brilliant 12.9-inch Liquid Retina XDR display with ProMotion, True Tone, and P3 wide color. M2 chip with 8-core CPU and 10-core GPU.",
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "M2 chip with 8-core CPU and 10-core GPU",
      "12.9-inch Liquid Retina XDR display",
      "Face ID for secure authentication"
    ],
    specifications: [
      { key: "Storage", value: "128GB" },
      { key: "Connectivity", value: "Wi-Fi 6E" }
    ],
    asin: "B0BJLEZ6M",
    modelNumber: "MNXP3LL/A"
  },
  // 12. MOUSE
  {
    name: "Logitech MX Master 3S Performance Wireless Mouse",
    brandName: "Logitech",
    categoryHierarchy: ["Electronics", "Computers & Accessories", "Computer Accessories & Peripherals", "Keyboards, Mice & Accessories", "Mice"],
    price: 99.99,
    stock: 200,
    description: "Meet MX Master 3S – an iconic mouse remastered. Feel every moment of your workflow with even more precision, tactility, and performance.",
    images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "Any-surface tracking - 8K DPI",
      "Quiet Clicks",
      "Magspeed Scrolling"
    ],
    specifications: [
      { key: "Color", value: "Graphite" },
      { key: "Connectivity", value: "Bluetooth & USB Receiver" }
    ],
    asin: "B09HM94VDS",
    modelNumber: "910-006550"
  },
  // 13. E-READER
  {
    name: "Amazon Kindle Paperwhite (16 GB)",
    brandName: "Amazon",
    categoryHierarchy: ["Electronics", "eBook Readers & Accessories", "eBook Readers", "Kindle E-readers"],
    price: 149.99,
    stock: 500,
    description: "Now with a 6.8” display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.",
    images: ["https://images.unsplash.com/photo-1592496001020-d31bd830651f?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "Purpose-built for reading",
      "Adjustable warm light",
      "Waterproof (IPX8)"
    ],
    specifications: [
      { key: "Storage", value: "16 GB" },
      { key: "Screen Size", value: "6.8 Inches" }
    ],
    asin: "B09TMN58KL",
    modelNumber: "M2L3EK"
  },
  // 14. VACUUM
  {
    name: "Dyson V15 Detect Cordless Vacuum Cleaner",
    brandName: "Dyson",
    categoryHierarchy: ["Home & Kitchen", "Vacuums & Floor Care", "Vacuums", "Stick Vacuums & Electric Brooms", "Cordless Vacuums"],
    price: 749.99,
    stock: 30,
    description: "Dyson's most powerful, intelligent cordless vacuum. Laser reveals microscopic dust. Automatically adapts suction power.",
    images: ["https://images.unsplash.com/photo-1558317379-178478193274?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "Laser reveals microscopic dust",
      "Piezo sensor counts dust particles",
      "Up to 60 minutes of run time"
    ],
    specifications: [
      { key: "Weight", value: "6.8 lbs" },
      { key: "Bin Volume", value: "0.2 Gallons" }
    ],
    asin: "B0964H2H8",
    modelNumber: "V15-DETECT"
  },
  // 15. TOYS - LEGO
  {
    name: "LEGO Star Wars Millennium Falcon",
    brandName: "LEGO",
    categoryHierarchy: ["Toys & Games", "Building Toys", "Building Sets", "Star Wars Sets"],
    price: 169.99,
    stock: 80,
    description: "Inspire memories of Star Wars: The Rise of Skywalker with this cool LEGO Star Wars Millennium Falcon building toy.",
    images: ["https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "Features rotating top and bottom gun turrets",
      "Includes 7 LEGO Star Wars characters",
      "1,351 pieces"
    ],
    specifications: [
      { key: "Age Range", value: "9+" },
      { key: "Material", value: "Plastic" }
    ],
    asin: "B07ND62H5",
    modelNumber: "75257"
  },
  // 16. SHOES - RUNNING
  {
    name: "Adidas Men's Ultraboost Light Running Shoe",
    brandName: "Adidas",
    categoryHierarchy: ["Clothing, Shoes & Jewelry", "Men", "Shoes", "Athletic", "Running", "Road Running"],
    price: 190.00,
    stock: 100,
    description: "Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever.",
    images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "Light BOOST midsole",
      "Primeknit+ textile upper",
      "Continental Rubber outsole"
    ],
    specifications: [
      { key: "Color", value: "Core Black" },
      { key: "Size", value: "10 US" }
    ],
    asin: "B0B6W5J9K",
    modelNumber: "HQ6339"
  },
  // 17. BEAUTY - SKINCARE
  {
    name: "CeraVe Moisturizing Cream",
    brandName: "CeraVe",
    categoryHierarchy: ["Beauty & Personal Care", "Skin Care", "Body", "Moisturizers", "Creams"],
    price: 17.78,
    stock: 400,
    description: "Developed with dermatologists, CeraVe Moisturizing Cream has a unique formula that provides 24-hour hydration.",
    images: ["https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "Hyaluronic Acid & Ceramides",
      "Oil Free & Fragrance Free",
      "Gentle on Skin"
    ],
    specifications: [
      { key: "Size", value: "19 Ounce" },
      { key: "Skin Type", value: "Dry" }
    ],
    asin: "B00TTD9BRC",
    modelNumber: "Moisturizing-Cream-19oz"
  },
  // 18. SPORTS - TRACKER
  {
    name: "Fitbit Charge 6 Fitness Tracker",
    brandName: "Fitbit",
    categoryHierarchy: ["Sports & Outdoors", "Sports Technology", "Activity Trackers", "Fitness Trackers"],
    price: 159.95,
    stock: 150,
    description: "Give your routine a boost with Fitbit Charge 6, the only tracker with Google built in.",
    images: ["https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "Heart Rate on Equipment",
      "Google Maps & Wallet",
      "7 Days Battery Life"
    ],
    specifications: [
      { key: "Color", value: "Obsidian" },
      { key: "Water Resistance", value: "50m" }
    ],
    asin: "B0CC6789",
    modelNumber: "GA05183-NA"
  },
  // 19. OUTDOOR - TUMBLER
  {
    name: "YETI Rambler 20 oz Tumbler",
    brandName: "YETI",
    categoryHierarchy: ["Sports & Outdoors", "Outdoor Recreation", "Camping & Hiking", "Hydration", "Flasks"],
    price: 35.00,
    stock: 250,
    description: "The Rambler 20 oz. is made from durable stainless steel with double-wall vacuum insulation to protect your hot or cold beverage at all costs.",
    images: ["https://images.unsplash.com/photo-1595348020949-87cdfbb44174?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "18/8 Stainless Steel",
      "Double-Wall Vacuum Insulation",
      "Dishwasher Safe"
    ],
    specifications: [
      { key: "Color", value: "Navy" },
      { key: "Capacity", value: "20 Fluid Ounces" }
    ],
    asin: "B01HGR789",
    modelNumber: "21070060046"
  },
  // 20. AUDIO - SPEAKER
  {
    name: "Bose SoundLink Flex Bluetooth Portable Speaker",
    brandName: "Bose",
    categoryHierarchy: ["Electronics", "Portable Audio & Video", "Portable Speakers & Docks", "Portable Bluetooth Speakers"],
    price: 149.00,
    stock: 90,
    description: "State-of-the-art design – SoundLink Flex outdoor speaker is packed with exclusive technologies and a custom-engineered transducer.",
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "Waterproof and dustproof (IP67)",
      "Rugged design",
      "Up to 12 hours per charge"
    ],
    specifications: [
      { key: "Color", value: "Stone Blue" },
      { key: "Connectivity", value: "Bluetooth" }
    ],
    asin: "B099TJGJ9",
    modelNumber: "865983-0200"
  },
  // 21. KITCHEN - MIXER
  {
    name: "KitchenAid Artisan Series 5-Qt. Stand Mixer",
    brandName: "KitchenAid",
    categoryHierarchy: ["Home & Kitchen", "Kitchen & Dining", "Small Appliances", "Mixers", "Stand Mixers"],
    price: 449.99,
    stock: 40,
    description: "Make up to 9 dozen cookies in a single batch with the KitchenAid Artisan Series 5 Quart Tilt-Head Stand Mixer.",
    images: ["https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "10 Speeds",
      "5 Quart Stainless Steel Bowl",
      "Tilt-Head Design"
    ],
    specifications: [
      { key: "Color", value: "Empire Red" },
      { key: "Material", value: "Zinc" }
    ],
    asin: "B00005UP2P",
    modelNumber: "KSM150PSER"
  },
  // 22. SMART HOME
  {
    name: "Philips Hue White and Color Ambiance Smart Bulb",
    brandName: "Philips Hue",
    categoryHierarchy: ["Tools & Home Improvement", "Light Bulbs", "LED Bulbs", "Smart Bulbs"],
    price: 49.99,
    stock: 300,
    description: "Go bright, go smart. With the Philips Hue White and Color Ambiance bulb, you can play with 16 million colors.",
    images: ["https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "16 million colors",
      "Voice control with Alexa/Google",
      "Bluetooth & Zigbee compatible"
    ],
    specifications: [
      { key: "Wattage", value: "9 watts" },
      { key: "Brightness", value: "800 Lumen" }
    ],
    asin: "B07Q15X9",
    modelNumber: "548483"
  },
  // 23. LUGGAGE
  {
    name: "Samsonite Omni PC Hardside Expandable Luggage",
    brandName: "Samsonite",
    categoryHierarchy: ["Clothing, Shoes & Jewelry", "Luggage & Travel Gear", "Luggage", "Carry-Ons"],
    price: 129.99,
    stock: 65,
    description: "Omni PC combines scratch-resistant textures with the lightest 100% polycarbonate construction.",
    images: ["https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "Micro-diamond polycarbonate texture",
      "TSA locks",
      "Four, multi-directional spinner wheels"
    ],
    specifications: [
      { key: "Color", value: "Black" },
      { key: "Size", value: "20-Inch" }
    ],
    asin: "B013WFOB",
    modelNumber: "68308-1041"
  },
  // 24. ACTION CAMERA
  {
    name: "GoPro HERO12 Black",
    brandName: "GoPro",
    categoryHierarchy: ["Electronics", "Camera & Photo", "Video", "Action Cameras"],
    price: 399.99,
    stock: 55,
    description: "Incredible image quality, even better HyperSmooth video stabilization and a huge boost in battery life.",
    images: ["https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "High Dynamic Range (HDR) Video",
      "HyperSmooth 6.0 Stabilization",
      "Waterproof to 33ft"
    ],
    specifications: [
      { key: "Video Resolution", value: "5.3K60" },
      { key: "Photo Resolution", value: "27MP" }
    ],
    asin: "B0CCLW7",
    modelNumber: "CHDHX-121-CN"
  },
  // 25. GAMING LAPTOP
  {
    name: "ASUS ROG Zephyrus G14 Gaming Laptop",
    brandName: "ASUS",
    categoryHierarchy: ["Electronics", "Computers & Accessories", "Computers & Tablets", "Laptops", "Gaming Laptops"],
    price: 1599.99,
    stock: 25,
    description: "Power through games and content creation with the AMD Ryzen 9 processor and NVIDIA GeForce RTX 4060.",
    images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "NVIDIA GeForce RTX 4060",
      "14-inch 165Hz QHD Display",
      "16GB DDR5 RAM"
    ],
    specifications: [
      { key: "Processor", value: "AMD Ryzen 9" },
      { key: "Storage", value: "512GB SSD" }
    ],
    asin: "B0BVN28",
    modelNumber: "GA402XV"
  },
  // 26. UNDERWEAR
  {
    name: "Calvin Klein Men's Cotton Stretch Boxer Briefs",
    brandName: "Calvin Klein",
    categoryHierarchy: ["Clothing, Shoes & Jewelry", "Men", "Clothing", "Underwear", "Boxer Briefs"],
    price: 42.50,
    stock: 300,
    description: "Classic designs and everyday style cut from soft cotton with enough stretch to ensure a superior fit.",
    images: ["https://images.unsplash.com/photo-1598528739666-83c9273f55b9?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "Cotton Stretch fabric",
      "Moisture wicking",
      "Classic logo waistband"
    ],
    specifications: [
      { key: "Material", value: "95% Cotton, 5% Elastane" },
      { key: "Pack Count", value: "3 Pack" }
    ],
    asin: "B00JQSZ",
    modelNumber: "NU2666"
  },
  // 27. ORAL CARE
  {
    name: "Oral-B Genius X Limited Electric Toothbrush",
    brandName: "Oral-B",
    categoryHierarchy: ["Beauty & Personal Care", "Oral Care", "Toothbrushes & Accessories", "Powered Toothbrushes", "Rotating"],
    price: 199.99,
    stock: 70,
    description: "Oral-B Genius X Limited with Artificial Intelligence has learned from thousands of human brushing behaviors.",
    images: ["https://images.unsplash.com/photo-1559599238-308793637427?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "Artificial Intelligence Brushing Recognition",
      "6 Cleaning Modes",
      "Pressure Sensor"
    ],
    specifications: [
      { key: "Color", value: "Black" },
      { key: "Power Source", value: "Rechargeable Battery" }
    ],
    asin: "B07W66",
    modelNumber: "GeniusX-Black"
  },
  // 28. ESPRESSO MACHINE
  {
    name: "De'Longhi Dedica Arte Espresso Machine",
    brandName: "De'Longhi",
    categoryHierarchy: ["Home & Kitchen", "Kitchen & Dining", "Coffee, Tea & Espresso", "Espresso Machines", "Semi-Automatic"],
    price: 299.95,
    stock: 45,
    description: "The Dedica Arte provides the perfect balance of performance and convenience in a sleek, compact design.",
    images: ["https://images.unsplash.com/photo-1570554863620-65893f252756?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "Compact 6-inch width",
      "Professional Steam Wand",
      "15-bar professional pressure"
    ],
    specifications: [
      { key: "Material", value: "Stainless Steel" },
      { key: "Color", value: "Metal" }
    ],
    asin: "B09J56",
    modelNumber: "EC885M"
  },
  // 29. POWER BANK
  {
    name: "Anker PowerCore 10000 Portable Charger",
    brandName: "Anker",
    categoryHierarchy: ["Cell Phones & Accessories", "Accessories", "Chargers & Power Adapters", "Power Banks"],
    price: 21.99,
    stock: 600,
    description: "One of the smallest and lightest 10000mAh portable chargers. Provides almost three-and-a-half iPhone 8 charges.",
    images: ["https://images.unsplash.com/photo-1609592424339-b5343f894912?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "High-Speed Charging",
      "Ultra-Compact",
      "MultiProtect Safety System"
    ],
    specifications: [
      { key: "Capacity", value: "10000mAh" },
      { key: "Color", value: "Black" }
    ],
    asin: "B0194WD",
    modelNumber: "A1263"
  },
  // 30. BOOKS - FANTASY
  {
    name: "Harry Potter Paperback Box Set (Books 1-7)",
    brandName: "Scholastic",
    categoryHierarchy: ["Books", "Children's Books", "Science Fiction & Fantasy", "Fantasy & Magic"],
    price: 50.99,
    stock: 120,
    description: "Now for the first time ever, J.K. Rowling’s seven bestselling Harry Potter books are available in a stunning paperback boxed set.",
    images: ["https://images.unsplash.com/photo-1610882648335-ced8fc8fa6b6?auto=format&fit=crop&w=800&q=80"],
    bulletPoints: [
      "Includes all 7 books",
      "Special Edition Box",
      "Perfect for collectors"
    ],
    specifications: [
      { key: "Format", value: "Paperback" },
      { key: "Language", value: "English" }
    ],
    asin: "B0018O",
    modelNumber: "978-0545162074"
  }
];
