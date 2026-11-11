import { Router } from 'express';
import { asyncRoute } from '../../core/http.js';
import { Match, Tenant } from '../../models.js';

export function publicRouter() {
  const router = Router();
  router.get('/:slug/matches', asyncRoute(async (req, res) => {
    const tenant = await Tenant.findOne({ where: { slug: req.params.slug } });
    if (!tenant) return res.status(404).json({ message: 'Organización no encontrada' });
    const matches = await Match.findAll({ where: { tenantId: tenant.id }, order: [['scheduledAt', 'ASC']] });
    return res.json({ tenant, matches });
  }));
  return router;
}
