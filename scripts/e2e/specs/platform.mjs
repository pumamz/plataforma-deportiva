import assert from 'node:assert/strict';

export async function verifyPlatform(client, login) {
  const dashboard = await client.get('/api/dashboard');
  for (const key of ['athletes', 'teams', 'venues', 'competitions', 'liveMatches', 'pendingCharges', 'collected']) assert.equal(typeof dashboard.metrics[key], 'number');
  const results = await client.get('/api/search?q=Halcones');
  assert(results.length > 0);
  const settings = await client.put('/api/settings', { name: login.tenant.name, primaryColor: login.tenant.primaryColor });
  assert.equal(settings.name, login.tenant.name);
  await client.put('/api/settings', { name: login.tenant.name, primaryColor: 'azul' }, 400);
  assert.equal((await client.get('/api/public/demo-academy/matches')).tenant.slug, 'demo-academy');
}
