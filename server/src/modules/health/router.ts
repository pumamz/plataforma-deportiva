import { Router } from 'express';
import { asyncRoute } from '../../core/http.js';
import { sequelize } from '../../database.js';
export function healthRouter() { const router = Router(); router.get('/', (_req, res) => res.json({ ok: true, product: 'Plataforma Deportiva' })); router.get('/ready', asyncRoute(async (_req, res) => { await sequelize.authenticate(); return res.json({ ok: true, database: 'ready', realtime: 'ready' }); })); return router; }
