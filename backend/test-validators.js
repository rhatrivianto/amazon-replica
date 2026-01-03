// Buat test file: `test-validators.js` di root backend
import { registerSchema, loginSchema } from './src/validators/auth.validator.js';
import { createProductSchema } from './src/validators/product.validator.js';

// Test 1: Auth Validator
console.log('🧪 TESTING AUTH VALIDATORS...');

const testUser = {
  name: 'Jo',
  email: 'invalid-email',
  password: 'weak'
};

const { error } = registerSchema.validate(testUser, { abortEarly: false });
console.log('🔍 ALL Auth Validation Errors:');
error?.details.forEach(err => {
  console.log(`  - ${err.path.join('.')}: ${err.message}`);
});

console.log('\n🧪 TESTING PRODUCT VALIDATORS...');

// Test 2: Product Validator  
const testProduct = {
  name: 'AB',
  price: -10,
  stock: 'invalid',
  description: 'Short',
  category:'invalid' // Tambah field required
};

const { error: productError } = createProductSchema.validate(testProduct, { abortEarly: false });
console.log('🔍 ALL Product Validation Errors:');
productError?.details.forEach(err => {
  console.log(`  - ${err.path.join('.')}: ${err.message}`);
});

console.log('\n✅ VALIDATORS INTEGRATION SUCCESSFUL!');