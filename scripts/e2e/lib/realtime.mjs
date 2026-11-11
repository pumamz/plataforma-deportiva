import { io } from 'socket.io-client';

export function verifyRealtimeFanout({ baseUrl, token, matchId }) {
  return new Promise((resolve, reject) => {
    const observer = io(baseUrl, { auth: { token }, transports: ['websocket'] });
    const commander = io(baseUrl, { auth: { token }, transports: ['websocket'] });
    const close = () => { observer.disconnect(); commander.disconnect(); };
    const timeout = setTimeout(() => { close(); reject(new Error('Realtime fanout timeout')); }, 7000);
    observer.on('connect_error', reject); commander.on('connect_error', reject);
    observer.on('matches:v1:update', (event) => { if (event.matches.some((match) => match.id === matchId && match.homeScore === 1)) { clearTimeout(timeout); close(); resolve(event); } });
    commander.on('connect', async () => { try { const result = await commander.timeout(3000).emitWithAck('matches:v1:command', { commandId: `e2e-${Date.now()}`, matchId, action: 'HOME_PLUS' }); if (!result?.ok) throw new Error(result?.message || 'Comando rechazado'); } catch (error) { clearTimeout(timeout); close(); reject(error); } });
  });
}
