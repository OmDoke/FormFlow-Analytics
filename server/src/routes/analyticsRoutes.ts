/**
 * README: Analytics Routes
 * This file defines the API endpoints for form analytics.
 * Mount point: /api/analytics
 */

import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController';

const router = Router();

// Get analytics for a specific form
router.get('/:formId', analyticsController.getAnalytics);

export default router;
