import { Router } from 'express';
import { getEvents, createEvent } from '../controllers/eventsController.js';
import { authenticateToken, optionalAuthenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuthenticateToken, getEvents);
router.post('/', authenticateToken, createEvent);

export default router;
