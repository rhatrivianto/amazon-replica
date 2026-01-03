import Joi from 'joi';

const mongoId = Joi.string().hex().length(24).messages({
  'string.length': 'ID tidak valid (Harus 24 karakter)'
});

export const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(500).required(),
  description: Joi.string().min(10).required(),
  price: Joi.number().min(0).precision(2).required(),
  category: mongoId.required(),
  brand: mongoId.required(),
  stock: Joi.number().integer().min(0).required(),
  images: Joi.array().items(Joi.any()).optional(), // images diproses setelah upload
  
  // AMAZON FIELDS
  asin: Joi.string().max(20).optional(),
  modelNumber: Joi.string().optional(),
  bulletPoints: Joi.array().items(Joi.string()).optional(),
  specifications: Joi.array().items(Joi.object({
    key: Joi.string().required(),
    value: Joi.string().required()
  })).optional(),
  
  isPrime: Joi.boolean().default(false),
  isSmallBusiness: Joi.boolean().default(false),
  
  shippingInfo: Joi.object({
    weight: Joi.string().optional(),
    dimensions: Joi.string().optional(),
    shipsFrom: Joi.string().default('Amazon'),
    soldBy: Joi.string().required()
  }).required(),

  tags: Joi.array().items(Joi.string().max(30)).optional(),
  isActive: Joi.boolean().default(true)
});

export const updateProductSchema = createProductSchema.fork(
  ['name', 'description', 'price', 'category', 'brand', 'stock', 'shippingInfo'], 
  (schema) => schema.optional()
).min(1);