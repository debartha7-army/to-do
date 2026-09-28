import { Router } from 'express';
import { getReports, createReport, generateTodayReport } from '../controllers/reportsController.js';
import { authenticateToken, optionalAuthenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuthenticateToken, getReports);
router.post('/', authenticateToken, createReport);
router.post('/generate-today', authenticateToken, generateTodayReport);

export default router;
