import { Router } from 'express';
import { getDiscoveries, createDiscovery, syncFeeds } from '../controllers/discoveriesController.js';
import { authenticateToken, optionalAuthenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuthenticateToken, getDiscoveries);
router.post('/', authenticateToken, createDiscovery);
router.post('/sync', optionalAuthenticateToken, syncFeeds);

export default router;
