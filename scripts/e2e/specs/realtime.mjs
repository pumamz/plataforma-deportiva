import assert from 'node:assert/strict';
import { verifyRealtimeFanout } from '../lib/realtime.mjs';

export async function verifyRealtime(client, cleanup) {
  const match = await client.post('/api/matches', { competitionName: 'Realtime E2E', sport: 'BASKETBALL', homeTeam: 'Socket A', awayTeam: 'Socket B', scheduledAt: new Date(Date.now() + 86_400_000).toISOString(), venue: 'Cancha E2E', period: 'Q1' });
  cleanup.push(() => client.delete(`/api/matches/${match.id}`));
  const event = await verifyRealtimeFanout({ baseUrl: client.baseUrl, token: client.token, matchId: match.id });
  assert.equal(event.version, 1);
  assert.equal((await client.get('/api/matches?q=Socket A'))[0].homeScore, 1);
}
