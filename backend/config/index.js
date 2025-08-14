import dotenv from 'dotenv';
dotenv.config();

export const config = {
	env: process.env.NODE_ENV || 'development',
	port: Number(process.env.PORT || 4000),
	jwtSecret: process.env.JWT_SECRET || 'change-me',
	openaiApiKey: process.env.OPENAI_API_KEY || '',
	embeddingModel: process.env.EMBEDDING_MODEL || 'Xenova/all-MiniLM-L6-v2',
	s3: {
		endpoint: process.env.S3_ENDPOINT || '',
		region: process.env.S3_REGION || 'us-east-1',
		bucket: process.env.S3_BUCKET || '',
		accessKeyId: process.env.S3_ACCESS_KEY || '',
		secretAccessKey: process.env.S3_SECRET_KEY || ''
	}
};


