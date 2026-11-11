import assert from 'node:assert/strict';

const cases = [
  ['athletes', { firstName: 'E2E', lastName: 'Deportista', sport: 'FOOTBALL', category: 'Sub 15' }, 'firstName', 'E2E'],
  ['teams', { name: 'Equipo E2E', sport: 'BASKETBALL', category: 'Sub 16' }, 'name', 'Equipo E2E'],
  ['venues', { name: 'Sede E2E', address: 'Dirección E2E', courtCount: 2 }, 'name', 'Sede E2E'],
  ['competitions', { name: 'Copa E2E', sport: 'VOLLEYBALL', format: 'GROUPS', category: 'Sub 17', startDate: '2026-11-10' }, 'name', 'Copa E2E'],
  ['charges', { athleteName: 'E2E Deportista', concept: 'Mensualidad E2E', amount: 25, dueDate: '2026-11-30' }, 'concept', 'Mensualidad E2E'],
];

export async function verifyCatalog(client, cleanup) {
  await client.post('/api/athletes', { firstName: 'Incompleto' }, 400);
  for (const [resource, payload, field, expected] of cases) {
    const created = await client.post(`/api/${resource}`, payload);
    cleanup.push(() => client.delete(`/api/${resource}/${created.id}`));
    const rows = await client.get(`/api/${resource}?q=${encodeURIComponent(expected)}`);
    assert(rows.some((row) => row.id === created.id));
    const updated = await client.put(`/api/${resource}/${created.id}`, { [field]: expected });
    assert.equal(updated[field], expected);
  }
}
