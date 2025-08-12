import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/files.controller.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/upload', upload.single('file'), uploadFile);

export default router;

