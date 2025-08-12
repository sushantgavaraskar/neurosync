import { s3, s3Bucket } from '../config/s3.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export async function uploadFile(req, res) {
  if (!req.file) return res.status(400).json({ error: 'missing_file' });
  const key = `uploads/${Date.now()}_${req.file.originalname}`;
  try {
    await s3.send(new PutObjectCommand({
      Bucket: s3Bucket,
      Key: key,
      ContentType: req.file.mimetype,
      Body: req.file.buffer
    }));
    return res.json({ key });
  } catch (err) {
    return res.status(500).json({ error: 'upload_failed', details: err?.message });
  }
}

