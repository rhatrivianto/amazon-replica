// Import secara eksplisit
import * as authController from './auth.controller.js';
import * as userController from './user.controller.js';
import * as productController from './product.controller.js';
import * as cartController from './cart.controller.js';
import * as orderController from './order.controller.js';
import * as categoryController from './category.controller.js';
import * as brandController from './brand.controller.js';
import * as reviewController from './review.controller.js';
import * as wishlistController from './wishlist.controller.js';
import * as searchController from './search.controller.js';
import * as paymentController from './payment.controller.js';
import * as checkoutController from './checkout.controller.js';
import * as shippingController from './shipping.controller.js';
import * as couponController from './coupon.controller.js';
import * as voucherController from './voucher.controller.js';
import * as inventoryController from './inventory.controller.js';
import * as adminController from './admin.controller.js';
import * as analyticsController from './analytics.controller.js';
import * as uploadController from './upload.controller.js';
import * as addressController from './address.controller.js';
import * as notificationController from './notification.controller.js';
import * as tokenController from './token.controller.js';
import * as emailController from './email.controller.js';
import * as discountController from './discount.controller.js';
import * as aiController from './ai.controller.js';
import * as chatController from './chat.controller.js';
import * as websocketController from './websocket.controller.js';
import * as databaseController from './database.controller.js';
import * as pageSectionController from './pageSection.controller.js';

// Export kembali untuk digunakan di Routes
export {
  authController,
  userController,
  productController,
  cartController,
  orderController,
  categoryController,
  brandController,
  reviewController,
  wishlistController,
  searchController,
  paymentController,
  checkoutController,
  shippingController,
  couponController,
  voucherController,
  inventoryController,
  adminController,
  analyticsController,
  uploadController,
  addressController,
  notificationController,
  tokenController,
  emailController,
  discountController,
  aiController,
  chatController,
  websocketController,
  databaseController,
  pageSectionController
};