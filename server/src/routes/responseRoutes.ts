import { Router } from 'express';
import * as responseController from '../controllers/responseController';

const router = Router();

router.post('/', responseController.submitResponse);
router.get('/form/:formId', responseController.getResponsesByForm);

export default router;
