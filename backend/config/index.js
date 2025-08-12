import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  postgresUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/neurosync',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  s3: {
    endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
    region: process.env.S3_REGION || 'us-east-1',
    bucket: process.env.S3_BUCKET || 'neurosync',
    accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin'
  },
  openaiApiKey: process.env.OPENAI_API_KEY || '',
};

