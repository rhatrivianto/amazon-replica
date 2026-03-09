import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { 
  addAddress, 
  getMyAddresses, 
  updateAddress, 
  deleteAddress 
} from '../controllers/address.controller.js';

const router = express.Router();

// Semua route di bawah ini butuh Login
router.use(protect);

router.route('/').post(addAddress).get(getMyAddresses);
router.route('/:id').patch(updateAddress).delete(deleteAddress);

export default router;