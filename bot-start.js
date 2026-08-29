const http = require('http');
const { client } = require('./bot');

const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN) {
  console.error('[Discord] FEHLER: Keine Umgebungsvariable DISCORD_TOKEN gesetzt.');
  console.error('Setze sie im Hosting-Dashboard (z.B. Render): Environment -> DISCORD_TOKEN');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot laeuft');
  })
  .listen(PORT, () => {
    console.log(`[HTTP] Health-Check-Server auf Port ${PORT}`);
  });

client.login(TOKEN).catch((err) => {
  console.error('[Discord] Login fehlgeschlagen:', err.message);
});

process.on('SIGINT', () => client.destroy());
process.on('SIGTERM', () => client.destroy());
