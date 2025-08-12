import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import pinoHttp from 'pino-http';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import authRoutes from './routes/auth.routes.js';
import filesRoutes from './routes/files.routes.js';
import searchRoutes from './routes/search.routes.js';
import qaRoutes from './routes/qa.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(pinoHttp({ logger }));

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'NeuroSync API', version: '1.0.0' }
  },
  apis: []
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ask', qaRoutes);
app.use('/api/admin', adminRoutes);

export default app;

