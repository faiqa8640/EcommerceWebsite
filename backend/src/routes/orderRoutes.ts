
import { Router } from 'express';
import { 
  createOrder, 
  getMyOrders, 
  getOrderById, 
  updateOrderAddress,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,


} from '../controllers/orderController';
// import { protect } from '../middleware/authMiddleware';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

// ─── Core Order Placement ────────────────────────────────────
// @route   POST /api/orders
// @desc    Place a new checkout order mapping relational products and static snapshot data
router.post('/', protect, createOrder);

// ─── User Profile Order History ──────────────────────────────
// @route   GET /api/orders/my-orders
// @desc    Retrieve all past order transaction files belonging to the logged-in account
router.get('/my-orders', protect, getMyOrders);

// Admin route — get ALL orders with populated user info
router.get('/all', protect, adminOnly, getAllOrders);

// ─── Single Order Verification Lookup ────────────────────────
// @route   GET /api/orders/:id
// @desc    Fetch a singular detailed transaction statement by its MongoDB ObjectId sequence
router.get('/:id', protect, getOrderById);

// ─── Shipping Modification Safeguard ─────────────────────────
// @route   PUT /api/orders/:id/address
// @desc    Modify shipping markers prior to strict administrative fulfillment locks
router.put('/:id/address', protect, updateOrderAddress);


// ADMIN ROUTES 
// ------------------



router.delete('/:id', deleteOrder);

router.patch('/:orderId/status', protect, adminOnly, updateOrderStatus);
export default router;