import { Router } from 'express';
import { ask } from '../controllers/qa.controller.js';

const router = Router();
router.post('/', ask);
export default router;

