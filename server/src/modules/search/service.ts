import { Op } from 'sequelize';
import { Athlete, Competition, Match, Team } from '../../models.js';

export class SearchService {
  async search(tenantId: string, query: string) {
    if (query.length < 2) return [];
    const like = { [Op.like]: `%${query}%` };
    const [athletes, teams, competitions, matches] = await Promise.all([
      Athlete.findAll({ where: { tenantId, [Op.or]: [{ firstName: like }, { lastName: like }, { teamName: like }] }, limit: 5 }),
      Team.findAll({ where: { tenantId, [Op.or]: [{ name: like }, { coach: like }] }, limit: 5 }),
      Competition.findAll({ where: { tenantId, name: like }, limit: 5 }),
      Match.findAll({ where: { tenantId, [Op.or]: [{ homeTeam: like }, { awayTeam: like }, { competitionName: like }] }, limit: 5 }),
    ]);
    return [...athletes.map((r) => ({ id: r.get('id'), section: 'athletes', label: `${r.get('firstName')} ${r.get('lastName')}`, detail: `Deportista · ${r.get('category')}` })), ...teams.map((r) => ({ id: r.get('id'), section: 'teams', label: r.get('name'), detail: `Equipo · ${r.get('category')}` })), ...competitions.map((r) => ({ id: r.get('id'), section: 'competitions', label: r.get('name'), detail: `Campeonato · ${r.get('category')}` })), ...matches.map((r) => ({ id: r.get('id'), section: 'matches', label: `${r.get('homeTeam')} vs ${r.get('awayTeam')}`, detail: `Partido · ${r.get('competitionName')}` }))].slice(0, 10);
  }
}
