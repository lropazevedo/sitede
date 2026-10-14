// Gera o cartao de mesa "Avalie o Deck no Google" com QR Code.
// Uso: node impressos/gerar-cartao.js
// Saidas em impressos/: cartao-avaliacao-grafica.pdf (10x15 cm com sangria) e cartao-avaliacao-a4.pdf (4 cartoes por folha A4)
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const AQUI = __dirname;
const QR_SVG = fs.readFileSync(path.join(AQUI, 'qr-avaliar.svg'), 'utf8').replace(/<svg /, '<svg class="qr" role="img" aria-label="QR Code para avaliar o Deck no Google" ');
const LOGO = 'data:image/png;base64,' + fs.readFileSync(path.join(AQUI, '..', 'deck-site', 'assets', 'logo-deck.png')).toString('base64');
const ESTRELA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.900 6.100 6.600.800-4.900 4.600 1.300 6.600L12 17.400 6.100 20.700l1.300-6.600L2.500 9.500l6.600-.800z" fill="currentColor"/></svg>';

function cartao() {
  return `<div class="cartao">
    <div class="moldura">
      <img class="logo" src="${LOGO}" alt="Deck Steakhouse">
      <div class="meio">
        <p class="olho">Gostou da noite?</p>
        <h1>Conte pra gente <em>no Google.</em></h1>
        <div class="estrelas">${ESTRELA.repeat(5)}</div>
        <div class="painel">${QR_SVG}</div>
        <p class="instrucao">Aponte a câmera do celular para o código<br>e deixe sua avaliação. Leva menos de um minuto.</p>
      </div>
      <div class="rodape">
        <p class="slogan">A alegria está aqui.</p>
        <p class="contato">@decksteakhouse · decksteakhouse.com.br</p>
      </div>
    </div>
  </div>`;
}

// fontes embutidas no arquivo, para o PDF sair igual em qualquer computador
const fonte = (familia, arq, peso, estilo) => `@font-face{font-family:'${familia}';src:url(data:font/woff2;base64,${fs.readFileSync(path.join(AQUI, 'fontes', arq)).toString('base64')}) format('woff2');font-weight:${peso};font-style:${estilo};font-display:block}`;
const CSS = `
${fonte('Cinzel', 'cinzel.woff2', '400 900', 'normal')}
${fonte('Cormorant Garamond', 'cormorant-italic.woff2', '500', 'italic')}
${fonte('Inter', 'inter.woff2', '100 900', 'normal')}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#0b0908;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.cartao{width:var(--w);height:var(--h);padding:var(--sangria);background:#0b0908;
  background-image:radial-gradient(ellipse 80% 45% at 50% 0%,rgba(74,46,31,.75),transparent 70%),radial-gradient(ellipse 70% 40% at 50% 100%,rgba(74,46,31,.45),transparent 70%);
  color:#F4EFE6;font-family:Inter,sans-serif;overflow:hidden;position:relative}
.moldura{position:absolute;inset:calc(var(--sangria) + 5mm);border:.35mm solid rgba(210,165,74,.55);border-radius:2mm;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:7mm 5mm 5.5mm;text-align:center}
.logo{width:34mm;height:auto}
.meio{display:flex;flex-direction:column;align-items:center}
.olho{font-family:Cinzel,serif;font-weight:600;font-size:7.2pt;letter-spacing:.32em;text-transform:uppercase;color:#D2A54A}
h1{font-family:Cinzel,serif;font-weight:600;font-size:15pt;line-height:1.1;letter-spacing:.04em;text-transform:uppercase;margin-top:2.2mm}
h1 em{display:block;font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:500;text-transform:none;letter-spacing:0;font-size:19pt;color:#E5D3B3;margin-top:.6mm}
.estrelas{display:flex;gap:1.4mm;margin:3.4mm 0 3mm;color:#D2A54A}
.estrelas svg{width:4.2mm;height:4.2mm}
.painel{background:#F4EFE6;border-radius:2.4mm;padding:3.2mm;box-shadow:0 0 0 .5mm rgba(210,165,74,.6)}
.qr{display:block;width:var(--qr);height:var(--qr)}
.instrucao{font-size:7pt;line-height:1.45;color:#E5D3B3;margin-top:3mm}
.slogan{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:500;font-size:12pt;color:#E5D3B3}
.contato{font-size:6.4pt;letter-spacing:.06em;color:#BDB09B;margin-top:.8mm}
`;

function pagina(tipo) {
  if (tipo === 'grafica') {
    // 10 x 15 cm de corte + 3 mm de sangria em cada lado
    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Cartão de avaliação Deck (gráfica)</title><style>
@page{size:106mm 156mm;margin:0}
${CSS}
.cartao{--w:106mm;--h:156mm;--sangria:3mm;--qr:44mm}
</style></head><body>${cartao()}</body></html>`;
  }
  // A4 com 4 cartoes de 105 x 148,5 mm e linhas de corte
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Cartão de avaliação Deck (A4)</title><style>
@page{size:210mm 297mm;margin:0}
${CSS}
.folha{width:210mm;height:297mm;display:grid;grid-template-columns:105mm 105mm;grid-template-rows:148.5mm 148.5mm;position:relative}
.cartao{--w:105mm;--h:148.5mm;--sangria:0mm;--qr:42mm}
.folha::before,.folha::after{content:"";position:absolute;z-index:2;border:0 dashed #8a8a8a}
.folha::before{left:105mm;top:0;bottom:0;border-left-width:.2mm}
.folha::after{top:148.5mm;left:0;right:0;border-top-width:.2mm}
</style></head><body><div class="folha">${cartao().repeat(4)}</div></body></html>`;
}

function acharChrome() {
  const op = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'];
  const c = op.find(p => fs.existsSync(p));
  if (!c) { console.error('Nao achei o Chrome nem o Edge para gerar o PDF.'); process.exit(1); }
  return c;
}
const CHROME = acharChrome();

for (const tipo of ['grafica', 'a4']) {
  const html = path.join(AQUI, 'cartao-avaliacao-' + tipo + '.html');
  const pdf = path.join(AQUI, 'cartao-avaliacao-' + tipo + '.pdf');
  fs.writeFileSync(html, pagina(tipo), 'utf8');
  const perfil = path.join(require('os').tmpdir(), 'deck-cartao-chrome');
  const r = spawnSync(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--user-data-dir=' + perfil, '--no-pdf-header-footer',
    '--virtual-time-budget=8000', '--print-to-pdf=' + pdf, 'file:///' + html.replace(/\\/g, '/')], { encoding: 'utf8', timeout: 90000 });
  if (!fs.existsSync(pdf)) { console.error('Falhou o PDF ' + tipo + ': ' + (r.stderr || r.error)); process.exit(1); }
  console.log('ok  ' + path.basename(pdf) + '  (' + Math.round(fs.statSync(pdf).size / 1024) + ' KB)');
}
