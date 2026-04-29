import { Router } from 'express';
import * as formController from '../controllers/formController';

const router = Router();

router.post('/', formController.createForm);
router.get('/', formController.getAllForms);
router.get('/share/:shareableId', formController.getFormByShareableId);
router.get('/:id', formController.getFormById);

export default router;
