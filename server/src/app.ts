import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { randomUUID } from 'node:crypto';
import { config } from './core/config.js';
import { errorHandler } from './core/http.js';
import { authRouter, sessionRouter } from './modules/auth/router.js';
import { catalogRouter } from './modules/catalog/router.js';
import { dashboardRouter } from './modules/dashboard/router.js';
import { healthRouter } from './modules/health/router.js';
import { publicRouter } from './modules/public/router.js';
import { searchRouter } from './modules/search/router.js';
import { tenancyRouter } from './modules/tenancy/router.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: config.FRONTEND_ORIGIN }));
  app.use(express.json({ limit: '2mb' }));
  app.use((req, res, next) => { res.setHeader('x-request-id', req.header('x-request-id') || randomUUID()); next(); });
  app.use('/api/auth', rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: true, legacyHeaders: false }), authRouter());
  app.use('/api', sessionRouter());
  app.use('/api/health', healthRouter());
  app.use('/api/dashboard', dashboardRouter());
  app.use('/api/search', searchRouter());
  app.use('/api/public', publicRouter());
  app.use('/api', tenancyRouter());
  app.use('/api', catalogRouter());
  app.use(errorHandler);
  return app;
}
