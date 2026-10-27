import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.mp3':'audio/mpeg','.md':'text/plain; charset=utf-8'};
const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
  try {
    const url = new URL(request.url, 'http://localhost');
    let relative = decodeURIComponent(url.pathname);
    if (relative.includes('\0') || relative.includes('\\')) throw new Error('Invalid path');
    if (relative === '/') relative = '/index.html';
    const target = path.resolve(root, '.' + relative);
    if (!target.startsWith(root + path.sep) || path.relative(root, target).split(path.sep).some(p => p.startsWith('.'))) { response.writeHead(403); response.end('Accès refusé'); return; }
    const info = await stat(target);
    if (!info.isFile()) throw new Error('Not a file');
    response.writeHead(200, {'Content-Type':types[path.extname(target)] || 'application/octet-stream','Content-Length':info.size,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    if (request.method === 'HEAD') response.end(); else createReadStream(target).pipe(response);
  } catch { response.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); response.end('Fichier introuvable'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Impact Frame : http://127.0.0.1:${port}\nCtrl+C pour arrêter. Le site peut aussi être ouvert directement avec index.html.`));
server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `Le port ${port} est occupé. Ouvrez index.html ou choisissez un autre PORT.` : error.message); process.exitCode = 1; });
