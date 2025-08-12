import { S3Client, HeadBucketCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import { config } from './index.js';

export const s3 = new S3Client({
  endpoint: config.s3.endpoint,
  region: config.s3.region,
  forcePathStyle: true,
  credentials: {
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey
  }
});

export const s3Bucket = config.s3.bucket;

export async function ensureBucketExists() {
  if (!s3Bucket) return;
  try {
    await s3.send(new HeadBucketCommand({ Bucket: s3Bucket }));
  } catch {
    try {
      await s3.send(new CreateBucketCommand({ Bucket: s3Bucket }));
    } catch {
      // ignore
    }
  }
}

