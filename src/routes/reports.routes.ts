// @ts-nocheck
import { Router } from 'express';
import { createReport, getReports, getReportById, updateReportStatus } from '../api/controllers/reports/reportController.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', createReport);

router.get('/', authMiddleware, getReports);
router.get('/:id', authMiddleware, getReportById);
router.patch('/:id/status', authMiddleware, updateReportStatus);

export default router; 