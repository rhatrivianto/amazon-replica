import express from 'express';
import { protect } from '../middlewares/auth.middleware.js'; // Pastikan middleware auth sudah ada
import { getMyAddresses, addAddress, deleteAddress } from '../controllers/address.controller.js';

const router = express.Router();

router.use(protect); // Semua endpoint di bawah ini butuh login

router.route('/')
  .get(getMyAddresses)
  .post(addAddress);

router.route('/:id')
  .delete(deleteAddress);

export default router;
