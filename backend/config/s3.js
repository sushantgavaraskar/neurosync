import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { config } from './index.js';

export const s3 = new S3Client({
	endpoint: config.s3.endpoint || undefined,
	region: config.s3.region,
	forcePathStyle: !!config.s3.endpoint,
	credentials: config.s3.accessKeyId && config.s3.secretAccessKey ? {
		accessKeyId: config.s3.accessKeyId,
		secretAccessKey: config.s3.secretAccessKey
	} : undefined
});

export async function putObject({ key, contentType, body }) {
	if (!config.s3.bucket) throw new Error('S3 bucket not configured');
	await s3.send(new PutObjectCommand({ Bucket: config.s3.bucket, Key: key, ContentType: contentType, Body: body }));
	return { key };
}


