import { Router } from 'express';
import { asyncRoute, authenticate } from '../../core/http.js';
import { DashboardService } from './service.js';

export function dashboardRouter(service = new DashboardService()) { const router = Router(); router.get('/', authenticate, asyncRoute(async (req, res) => res.json(await service.get(req.auth!.tenantId)))); return router; }
