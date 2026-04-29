import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController';

const router = Router();

router.get('/:formId', analyticsController.getAnalytics);

export default router;
