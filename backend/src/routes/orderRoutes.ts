// BACKEND/src/routes/orderRoutes.ts
import { Router } from 'express';
import { createOrder, getUserOrders } from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware'; // Adjust name based on your file

const router = Router();

// Protect routes so only logged-in users can check out or see their history
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);

export default router;