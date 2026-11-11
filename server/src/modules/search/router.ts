import { Router } from 'express';
import { asyncRoute, authenticate } from '../../core/http.js';
import { SearchService } from './service.js';
export function searchRouter(service = new SearchService()) { const router = Router(); router.get('/', authenticate, asyncRoute(async (req, res) => res.json(await service.search(req.auth!.tenantId, String(req.query.q || '').trim())))); return router; }
