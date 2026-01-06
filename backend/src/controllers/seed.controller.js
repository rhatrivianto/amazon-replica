import slugify from 'slugify';
import Product from '../models/product.model.js';
import Category from '../models/category.model.js';
import Brand from '../models/brand.model.js';
import asyncHandler from '../utils/asyncHandler.js'; // Pastikan utils ini ada, atau gunakan try-catch biasa
import { productsToSeed } from '../data/seedData.js';

export const seedProducts = async (req, res) => {
  try {
    console.log('🌱 Starting Seeding Process from Server...');
    const results = [];

    for (const item of productsToSeed) {
      // 1. Handle Category Hierarchy
      let currentParentId = null;
      let finalCategory = null;
      const categories = item.categoryHierarchy || [item.categoryName];

      for (let i = 0; i < categories.length; i++) {
        const catName = categories[i];
        let category = await Category.findOne({ name: catName });
        
        if (!category) {
          category = await Category.create({ 
            name: catName, 
            slug: slugify(catName, { lower: true }),
            parent: currentParentId,
            level: i
          });
        }
        currentParentId = category._id;
        finalCategory = category;
      }

      // 2. Handle Brand
      let brand = await Brand.findOne({ name: item.brandName });
      if (!brand) {
        brand = await Brand.create({ 
          name: item.brandName, 
          slug: slugify(item.brandName, { lower: true }), 
          logo: `https://via.placeholder.com/150?text=${item.brandName}` 
        });
      }

      // 3. Handle Product
      const slug = slugify(item.name, { lower: true, strict: true });
      const productData = {
        name: item.name,
        slug: slug,
        brand: brand._id,
        category: finalCategory._id,
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

      const product = await Product.findOneAndUpdate(
        { slug: slug }, 
        productData, 
        { upsert: true, new: true }
      );
      results.push(product.name);
    }

    res.status(200).json({
      success: true,
      message: `Successfully seeded ${results.length} products!`,
      products: results
    });

  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    res.status(500).json({
      success: false,
      message: 'Seeding failed',
      error: error.message
    });
  }
};