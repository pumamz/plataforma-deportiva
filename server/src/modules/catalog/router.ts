import { Router } from 'express';
import { Op, type Model, type ModelStatic } from 'sequelize';
import { z } from 'zod';
import { asyncRoute, authenticate, requireRoles } from '../../core/http.js';
import { Athlete, Charge, Competition, Match, Team, Venue } from '../../models.js';

type Resource = { path: string; model: ModelStatic<Model>; searchable: string[]; schema: z.ZodObject<z.ZodRawShape> };
const sport = z.enum(['FOOTBALL', 'BASKETBALL', 'VOLLEYBALL']);
const resources: Resource[] = [
  { path: 'athletes', model: Athlete, searchable: ['firstName', 'lastName', 'teamName', 'category'], schema: z.object({ firstName: z.string().min(1), lastName: z.string().min(1), birthDate: z.string().optional().nullable(), sport, category: z.string().min(1), teamName: z.string().optional().nullable(), guardianName: z.string().optional().nullable(), phone: z.string().optional().nullable(), status: z.enum(['ACTIVE', 'INACTIVE']).optional() }) },
  { path: 'teams', model: Team, searchable: ['name', 'category', 'coach'], schema: z.object({ name: z.string().min(1), sport, category: z.string().min(1), coach: z.string().optional().nullable(), playerCount: z.coerce.number().int().nonnegative().optional(), status: z.enum(['ACTIVE', 'INACTIVE']).optional() }) },
  { path: 'venues', model: Venue, searchable: ['name', 'address'], schema: z.object({ name: z.string().min(1), address: z.string().min(1), courtCount: z.coerce.number().int().positive().optional(), sports: z.array(sport).optional(), status: z.enum(['AVAILABLE', 'MAINTENANCE', 'CLOSED']).optional() }) },
  { path: 'competitions', model: Competition, searchable: ['name', 'category'], schema: z.object({ name: z.string().min(1), sport, format: z.enum(['LEAGUE', 'GROUPS', 'KNOCKOUT']), category: z.string().min(1), startDate: z.string().min(1), endDate: z.string().optional().nullable(), status: z.enum(['DRAFT', 'ACTIVE', 'FINISHED']).optional() }) },
  { path: 'matches', model: Match, searchable: ['homeTeam', 'awayTeam', 'competitionName', 'venue'], schema: z.object({ competitionName: z.string().min(1), sport, homeTeam: z.string().min(1), awayTeam: z.string().min(1), scheduledAt: z.string().min(1), venue: z.string().min(1), status: z.enum(['SCHEDULED', 'LIVE', 'PAUSED', 'FINISHED']).optional(), period: z.string().optional(), homeScore: z.coerce.number().int().nonnegative().optional(), awayScore: z.coerce.number().int().nonnegative().optional() }) },
  { path: 'charges', model: Charge, searchable: ['athleteName', 'concept', 'reference'], schema: z.object({ athleteName: z.string().min(1), concept: z.string().min(1), amount: z.coerce.number().nonnegative(), dueDate: z.string().min(1), status: z.enum(['PENDING', 'PARTIAL', 'PAID', 'OVERDUE']).optional(), paidAmount: z.coerce.number().nonnegative().optional(), method: z.enum(['CASH', 'TRANSFER', 'OTHER']).optional().nullable(), reference: z.string().optional().nullable() }) },
];

export function catalogRouter() {
  const router = Router();
  for (const resource of resources) {
    router.get(`/${resource.path}`, authenticate, asyncRoute(async (req, res) => { const query = String(req.query.q || '').trim(); const where: Record<PropertyKey, unknown> = { tenantId: req.auth!.tenantId }; if (query) where[Op.or] = resource.searchable.map((field) => ({ [field]: { [Op.like]: `%${query}%` } })); return res.json(await resource.model.findAll({ where, order: [['createdAt', 'DESC']] })); }));
    router.post(`/${resource.path}`, authenticate, requireRoles('PROVIDER_ADMIN', 'ORG_ADMIN', 'STAFF'), asyncRoute(async (req, res) => res.status(201).json(await resource.model.create({ ...resource.schema.parse(req.body), tenantId: req.auth!.tenantId }))));
    router.put(`/${resource.path}/:id`, authenticate, requireRoles('PROVIDER_ADMIN', 'ORG_ADMIN', 'STAFF'), asyncRoute(async (req, res) => { const row = await resource.model.findOne({ where: { id: req.params.id, tenantId: req.auth!.tenantId } }); if (!row) return res.status(404).json({ message: 'Registro no encontrado' }); return res.json(await row.update(resource.schema.partial().parse(req.body))); }));
    router.delete(`/${resource.path}/:id`, authenticate, requireRoles('PROVIDER_ADMIN', 'ORG_ADMIN'), asyncRoute(async (req, res) => { const deleted = await resource.model.destroy({ where: { id: req.params.id, tenantId: req.auth!.tenantId } }); return deleted ? res.sendStatus(204) : res.status(404).json({ message: 'Registro no encontrado' }); }));
  }
  return router;
}
