import { Op } from 'sequelize';
import { Athlete, Charge, Competition, Match, Team, Venue } from '../../models.js';

export class DashboardService {
  async get(tenantId: string) {
    const [athletes, teams, venues, competitions, liveMatches, pendingCharges, paidCharges, matches] = await Promise.all([
      Athlete.count({ where: { tenantId, status: 'ACTIVE' } }), Team.count({ where: { tenantId, status: 'ACTIVE' } }),
      Venue.count({ where: { tenantId } }), Competition.count({ where: { tenantId, status: { [Op.ne]: 'FINISHED' } } }),
      Match.count({ where: { tenantId, status: 'LIVE' } }), Charge.sum('amount', { where: { tenantId, status: { [Op.in]: ['PENDING', 'PARTIAL', 'OVERDUE'] } } }),
      Charge.sum('paidAmount', { where: { tenantId } }), Match.findAll({ where: { tenantId }, limit: 6, order: [['scheduledAt', 'ASC']] }),
    ]);
    return { metrics: { athletes, teams, venues, competitions, liveMatches, pendingCharges: Number(pendingCharges || 0), collected: Number(paidCharges || 0) }, matches };
  }
}
