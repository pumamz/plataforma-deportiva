import 'dotenv/config';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { config } from './core/config.js';
import { sequelize } from './database.js';
import { seedDemo } from './infrastructure/demo-seed.js';
import { registerMatchRealtime } from './modules/matches/realtime.js';

await sequelize.authenticate();
if (config.ENABLE_SCHEMA_SYNC) await sequelize.sync();
if (config.SEED_DEMO) await seedDemo();

const server = createServer(createApp());
const io = new Server(server, { cors: { origin: config.FRONTEND_ORIGIN, methods: ['GET', 'POST', 'PUT', 'DELETE'] } });
const stopRealtime = registerMatchRealtime(io);

server.listen(config.PORT, '0.0.0.0', () => console.log(`Sports platform API running on http://localhost:${config.PORT}`));

async function shutdown(signal: string) {
  console.log(`${signal} received; closing HTTP, WebSocket and database connections`);
  stopRealtime();
  io.close();
  server.close(async () => { await sequelize.close(); process.exit(0); });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.once('SIGTERM', () => void shutdown('SIGTERM'));
process.once('SIGINT', () => void shutdown('SIGINT'));
