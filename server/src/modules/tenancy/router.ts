import { Router } from 'express';
import { z } from 'zod';
import { asyncRoute, authenticate, requireRoles } from '../../core/http.js';
import { Tenant } from '../../models.js';

const settingsSchema = z.object({ name: z.string().trim().min(1), primaryColor: z.string().regex(/^#[0-9a-f]{6}$/i) });
export function tenancyRouter() {
  const router = Router();
  router.put('/settings', authenticate, requireRoles('PROVIDER_ADMIN', 'ORG_ADMIN'), asyncRoute(async (req, res) => {
    const tenant = await Tenant.findByPk(req.auth!.tenantId);
    if (!tenant) return res.status(404).json({ message: 'Organización no encontrada' });
    return res.json(await tenant.update(settingsSchema.parse(req.body)));
  }));
  return router;
}
