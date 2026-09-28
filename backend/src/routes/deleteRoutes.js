import { Router } from 'express';
import { deleteUserRecord } from '../controllers/deleteController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Matches DELETE /api/:kind/:id with strict user ownership validation
router.delete('/:kind/:id', authenticateToken, deleteUserRecord);

export default router;
