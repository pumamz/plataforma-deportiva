import { ApiClient } from './lib/client.mjs';
import { verifyAuth } from './specs/auth.mjs';
import { verifyCatalog } from './specs/catalog.mjs';
import { verifyPlatform } from './specs/platform.mjs';
import { verifyRealtime } from './specs/realtime.mjs';

const client = new ApiClient();
const cleanup = [];
try {
  const login = await verifyAuth(client);
  await verifyCatalog(client, cleanup);
  await verifyPlatform(client, login);
  await verifyRealtime(client, cleanup);
  console.log('✓ E2E empresarial: auth, readiness, 6 recursos, tenant, búsqueda y WebSocket multi-cliente');
} finally {
  for (const remove of cleanup.reverse()) try { await remove(); } catch (error) { console.error(`Limpieza incompleta: ${error.message}`); }
}
