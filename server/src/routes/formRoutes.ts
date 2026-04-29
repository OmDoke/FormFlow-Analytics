/**
 * README: Form Routes
 * This file defines the API endpoints for form operations.
 * Mount point: /api/forms
 */

import { Router } from 'express';
import * as formController from '../controllers/formController';

const router = Router();

// Create a new form
router.post('/', formController.createForm);

// Get all forms
router.get('/', formController.getAllForms);

// Get form by public shareable ID (must be before :id to avoid conflict if shareableId looks like ObjectId)
router.get('/share/:shareableId', formController.getFormByShareableId);

// Get form by internal ID
router.get('/:id', formController.getFormById);

export default router;
