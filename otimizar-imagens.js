// Deixa as fotos do site mais leves.
// 1. Cria versoes WebP de cada .jpg em deck-site/assets (e uma de 800px para celular, quando a foto for maior).
// 2. Troca cada <img> de foto nas paginas por um <picture> que entrega o WebP do tamanho certo,
//    mantendo o .jpg original para navegadores antigos.
// Uso: node otimizar-imagens.js   (o gerar-paginas.js ja chama este script no final)
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const SITE = path.join(__dirname, 'deck-site');
const ASSETS = path.join(SITE, 'assets');
const CELULAR = 800;
const QUALIDADE = '78';

function acharFfmpeg() {
  if (spawnSync('ffmpeg', ['-version']).status === 0) return 'ffmpeg';
  const base = path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages');
  if (fs.existsSync(base)) {
    for (const d of fs.readdirSync(base).filter(n => /FFmpeg/i.test(n))) {
      const raiz = path.join(base, d);
      for (const sub of fs.readdirSync(raiz)) {
        const exe = path.join(raiz, sub, 'bin', 'ffmpeg.exe');
        if (fs.existsSync(exe)) return exe;
      }
    }
  }
  console.error('Nao achei o ffmpeg. Instale com: winget install ffmpeg');
  process.exit(1);
}
const FF = acharFfmpeg();

function largura(arq) {
  const r = spawnSync(FF, ['-hide_banner', '-i', arq], { encoding: 'utf8' });
  const m = /, (\d{2,5})x(\d{2,5})/.exec(r.stderr || '');
  return m ? [Number(m[1]), Number(m[2])] : [0, 0];
}
function webp(origem, destino, larg) {
  if (fs.existsSync(destino) && fs.statSync(destino).mtimeMs >= fs.statSync(origem).mtimeMs) return;
  const args = ['-y', '-loglevel', 'error', '-i', origem];
  if (larg) args.push('-vf', 'scale=' + larg + ':-2');
  args.push('-c:v', 'libwebp', '-quality', QUALIDADE, '-compression_level', '6', destino);
  const r = spawnSync(FF, args, { encoding: 'utf8' });
  if (r.status !== 0) { console.error('Falhou: ' + path.basename(destino) + ' ' + r.stderr); process.exit(1); }
}

// 1. versoes WebP
const medidas = {};
let antes = 0, depois = 0;
for (const nome of fs.readdirSync(ASSETS).filter(n => /\.jpg$/i.test(n) && !/^og\.jpg$/i.test(n))) {
  const jpg = path.join(ASSETS, nome), base = nome.replace(/\.jpg$/i, '');
  const [w, h] = largura(jpg);
  medidas[base] = { w, h, celular: w > CELULAR + 100 };
  webp(jpg, path.join(ASSETS, base + '.webp'));
  if (medidas[base].celular) webp(jpg, path.join(ASSETS, base + '-' + CELULAR + '.webp'), CELULAR);
  antes += fs.statSync(jpg).size;
  depois += fs.statSync(path.join(ASSETS, base + '.webp')).size;
}
console.log('Fotos: ' + Object.keys(medidas).length + ' | JPG ' + Math.round(antes / 1024) + ' KB -> WebP ' + Math.round(depois / 1024) + ' KB (versoes de tela cheia)');

// 2. <img> -> <picture>
const SIZES = '(max-width: 860px) 92vw, 60vw';
function paginas(dir) {
  let out = [];
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory() && d.name !== 'assets') out = out.concat(paginas(p));
    else if (d.name === 'index.html') out.push(p);
  }
  return out;
}
for (const arq of paginas(SITE)) {
  let html = fs.readFileSync(arq, 'utf8'), trocas = 0;
  html = html.replace(/(<picture[\s>][\s\S]*?<\/picture>)|<img ([^>]*?)src="((?:\/)?assets\/)([a-z0-9-]+)\.jpg"([^>]*)>/g, (todo, jaPicture, a1, pasta, base, a2) => {
    if (jaPicture) return jaPicture;
    const m = medidas[base];
    if (!m) return todo;
    const fontes = (m.celular ? pasta + base + '-' + CELULAR + '.webp ' + CELULAR + 'w, ' : '') + pasta + base + '.webp ' + m.w + 'w';
    trocas++;
    return '<picture><source type="image/webp" srcset="' + fontes + '" sizes="' + SIZES + '"><img ' + a1 + 'src="' + pasta + base + '.jpg"' + a2 + '></picture>';
  });
  fs.writeFileSync(arq, html, 'utf8');
  console.log(path.relative(SITE, arq) + ': ' + trocas + ' foto(s) com WebP');
}
