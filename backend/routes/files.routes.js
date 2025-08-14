import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { putObject } from '../config/s3.js';
import { config } from '../config/index.js';
import { indexDocument } from '../services/indexer.service.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
	if (!req.file) return res.status(400).json({ error: 'missing_file' });
	const key = `uploads/${Date.now()}_${req.file.originalname}`;
	try {
		// Optional object storage: if S3 bucket not configured, skip upload silently
		if (config.s3.bucket) {
			await putObject({ key, contentType: req.file.mimetype, body: req.file.buffer });
		}
        const id = `doc_${Date.now()}`;
        const workspaceId = req.user?.workspaceId || process.env.TENANT_DEFAULT || 'local';
		let indexed = true;
		try {
        	await indexDocument({
            	id,
            	workspaceId,
            	title: req.file.originalname,
            	text: '<uploaded file>',
            	sourceType: 'upload',
            	sourceId: key,
            	metadata: { key }
        	});
		} catch (_e) {
			indexed = false;
		}
        return res.json({ key, documentId: id, indexed });
	} catch (e) {
    		return res.status(500).json({ error: 'upload_failed', details: e?.message });
	}
});

export default router;

