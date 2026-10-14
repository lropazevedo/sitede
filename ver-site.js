// Mostra o site do Deck no seu computador, antes de publicar.
// Uso: node ver-site.js   (deixe a janela aberta; Ctrl+C para desligar)
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const RAIZ = path.join(__dirname, 'deck-site');
const PORTA = 8090;
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml' };

const servidor = http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  let arq = path.normalize(path.join(RAIZ, rel));
  if (!arq.startsWith(RAIZ)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(arq) && fs.statSync(arq).isDirectory()) {
    if (!rel.endsWith('/')) { res.writeHead(301, { Location: rel + '/' }); return res.end(); }
    arq = path.join(arq, 'index.html');
  }
  if (!fs.existsSync(arq)) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Pagina nao encontrada'); }
  const tam = fs.statSync(arq).size;
  const cab = { 'Content-Type': TIPOS[path.extname(arq).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes' };
  const faixa = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
  if (faixa) {
    const ini = faixa[1] ? Number(faixa[1]) : 0, fim = faixa[2] ? Number(faixa[2]) : tam - 1;
    res.writeHead(206, Object.assign(cab, { 'Content-Range': 'bytes ' + ini + '-' + fim + '/' + tam, 'Content-Length': fim - ini + 1 }));
    return fs.createReadStream(arq, { start: ini, end: fim }).pipe(res);
  }
  res.writeHead(200, Object.assign(cab, { 'Content-Length': tam }));
  fs.createReadStream(arq).pipe(res);
});

servidor.on('error', e => {
  if (e.code === 'EADDRINUSE') console.log('\nA porta ' + PORTA + ' ja esta em uso. O site provavelmente ja esta aberto em http://localhost:' + PORTA + '/\n');
  else console.log('\nErro: ' + e.message + '\n');
  process.exit(1);
});
servidor.listen(PORTA, '127.0.0.1', () => {
  const url = 'http://localhost:' + PORTA + '/';
  console.log('\nSite no ar no seu computador: ' + url);
  console.log('Paginas: /carnes-em-jacobina/  /hamburguer-em-jacobina/  /cardapio/  /o-que-fazer-em-jacobina-a-noite/');
  console.log('Deixe esta janela aberta. Para desligar, aperte Ctrl+C.\n');
  if (process.platform === 'win32' && !process.argv.includes('--sem-abrir')) exec('start "" "' + url + '"');
});
