import { Router } from 'express';
import { getSocialChannels, syncSocial } from '../controllers/socialController.js';
import { optionalAuthenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/channels', optionalAuthenticateToken, getSocialChannels);
router.post('/sync', optionalAuthenticateToken, syncSocial);

export default router;
