import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getDashboardStats
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateUserUpsert } from '../middleware/validate.js';

const router = express.Router();

// Stats route (Must go before /:id)
router.get('/stats', protect, authorize('Admin', 'Manager'), getDashboardStats);

// General CRUD
router.get('/', protect, authorize('Admin', 'Manager'), getUsers);
router.post('/', protect, authorize('Admin'), validateUserUpsert, createUser);

router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorize('Admin'), deleteUser);

export default router;
