/**
 * README: Response Routes
 * This file defines the API endpoints for form response operations.
 * Mount point: /api/responses
 */

import { Router } from 'express';
import * as responseController from '../controllers/responseController';

const router = Router();

// Submit a new response
router.post('/', responseController.submitResponse);

// Get all responses for a specific form
router.get('/form/:formId', responseController.getResponsesByForm);

export default router;
