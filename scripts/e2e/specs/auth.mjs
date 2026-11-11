import assert from 'node:assert/strict';

export async function verifyAuth(client) {
  assert.equal((await client.get('/api/health')).ok, true);
  assert.equal((await client.get('/api/health/ready')).database, 'ready');
  await client.get('/api/dashboard', 401);
  await client.request('/api/auth/login', { method: 'POST', body: JSON.stringify({ username: 'admin', password: 'incorrecta', tenant: 'demo-academy' }) }, 401);
  const login = await client.request('/api/auth/login', { method: 'POST', body: JSON.stringify({ username: 'admin', password: 'admin123', tenant: 'demo-academy' }) });
  client.token = login.token;
  assert.equal(login.user.role, 'ORG_ADMIN');
  assert.equal((await client.get('/api/me')).user.username, 'admin');
  return login;
}
