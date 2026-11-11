import jwt from 'jsonwebtoken';
import type { Server, Socket } from 'socket.io';
import { z } from 'zod';
import { config } from '../../core/config.js';
import type { AuthPayload } from '../../core/http.js';
import { Match } from '../../models.js';

const commandSchema = z.object({
  commandId: z.string().min(1).max(100).optional(),
  matchId: z.string().uuid(),
  action: z.enum(['HOME_PLUS', 'AWAY_PLUS', 'HOME_MINUS', 'AWAY_MINUS', 'START', 'PAUSE', 'FINISH']),
});
type Acknowledge = (result: { ok: boolean; commandId?: string; message?: string }) => void;

async function publishMatches(io: Server, tenantId: string) {
  const matches = await Match.findAll({ where: { tenantId }, order: [['scheduledAt', 'ASC']] });
  io.to(`tenant:${tenantId}`).emit('matches:v1:update', { version: 1, tenantId, occurredAt: new Date().toISOString(), matches });
}

function authenticateSocket(socket: Socket): AuthPayload {
  const token = socket.handshake.auth?.token;
  if (!token) throw new Error('Autenticación requerida');
  return jwt.verify(token, config.JWT_SECRET) as AuthPayload;
}

export function registerMatchRealtime(io: Server) {
  io.use((socket, next) => { try { socket.data.auth = authenticateSocket(socket); next(); } catch { next(new Error('Sesión inválida')); } });
  io.on('connection', (socket) => {
    const auth = socket.data.auth as AuthPayload;
    socket.join(`tenant:${auth.tenantId}`);
    void publishMatches(io, auth.tenantId);

    socket.on('matches:v1:command', async (raw: unknown, acknowledge?: Acknowledge) => {
      const parsed = commandSchema.safeParse(raw);
      if (!parsed.success) return acknowledge?.({ ok: false, message: 'Comando inválido' });
      const { matchId, action, commandId } = parsed.data;
      if (!['PROVIDER_ADMIN', 'ORG_ADMIN', 'SCOREKEEPER'].includes(auth.role)) return acknowledge?.({ ok: false, commandId, message: 'Permiso insuficiente' });
      const match = await Match.findOne({ where: { id: matchId, tenantId: auth.tenantId } });
      if (!match) return acknowledge?.({ ok: false, commandId, message: 'Partido no encontrado' });
      if (action === 'HOME_PLUS') match.homeScore += 1;
      if (action === 'AWAY_PLUS') match.awayScore += 1;
      if (action === 'HOME_MINUS') match.homeScore = Math.max(0, match.homeScore - 1);
      if (action === 'AWAY_MINUS') match.awayScore = Math.max(0, match.awayScore - 1);
      if (action === 'START') match.status = 'LIVE';
      if (action === 'PAUSE') match.status = 'PAUSED';
      if (action === 'FINISH') match.status = 'FINISHED';
      await match.save();
      await publishMatches(io, auth.tenantId);
      acknowledge?.({ ok: true, commandId });
    });
  });

  const clock = setInterval(async () => {
    const liveMatches = await Match.findAll({ where: { status: 'LIVE' } });
    const tenants = new Set<string>();
    for (const match of liveMatches) {
      const limit = match.sport === 'FOOTBALL' ? 5400 : match.sport === 'BASKETBALL' ? 2400 : 10800;
      match.clockSeconds = Math.min(limit, match.clockSeconds + 1);
      if (match.clockSeconds >= limit) match.status = 'FINISHED';
      await match.save({ fields: ['clockSeconds', 'status'], logging: false });
      tenants.add(match.tenantId);
    }
    await Promise.all([...tenants].map((tenantId) => publishMatches(io, tenantId)));
  }, 1000);
  return () => clearInterval(clock);
}
