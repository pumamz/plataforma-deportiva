import { Router } from 'express';
import { z } from 'zod';
import { asyncRoute, authenticate } from '../../core/http.js';
import { AuthService } from './service.js';

const loginSchema = z.object({ username: z.string().min(1), password: z.string().min(1), tenant: z.string().min(1).default('demo-academy') });

export function authRouter(service = new AuthService()) {
  const router = Router();
  router.post('/login', asyncRoute(async (req, res) => {
    const result = await service.login(loginSchema.parse(req.body));
    return result ? res.json(result) : res.status(401).json({ message: 'Credenciales inválidas' });
  }));
  return router;
}

export function sessionRouter(service = new AuthService()) {
  const router = Router();
  router.get('/me', authenticate, asyncRoute(async (req, res) => res.json(await service.session(req.auth!))));
  return router;
}
