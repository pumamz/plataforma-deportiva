import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { config } from './config.js';
import type { Role } from '../models.js';

export type AuthPayload = { id: string; tenantId: string; role: Role; username: string };
export type AuthRequest = Request & { auth?: AuthPayload };
export const asyncRoute = (handler: (req: AuthRequest, res: Response, next: NextFunction) => Promise<unknown>) => (req: AuthRequest, res: Response, next: NextFunction) => void handler(req, res, next).catch(next);
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => { const token = req.headers.authorization?.replace(/^Bearer\s+/i, ''); if (!token) return res.status(401).json({ message: 'Autenticación requerida' }); try { req.auth = jwt.verify(token, config.JWT_SECRET) as AuthPayload; next(); } catch { return res.status(401).json({ message: 'Sesión inválida o vencida' }); } };
export const requireRoles = (...roles: Role[]) => (req: AuthRequest, res: Response, next: NextFunction) => { if (!req.auth || !roles.includes(req.auth.role)) return res.status(403).json({ message: 'Permiso insuficiente' }); next(); };
export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => { if (error instanceof ZodError) return res.status(400).json({ message: 'Datos inválidos', issues: error.flatten().fieldErrors }); console.error(error); return res.status(500).json({ message: 'Error interno del servidor' }); };
