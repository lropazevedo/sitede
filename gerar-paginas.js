// Gera as paginas internas do site do Deck dentro de deck-site/.
// Uso: node gerar-paginas.js   (rode de novo sempre que mudar algo aqui)
const fs = require('fs');
const path = require('path');

const SITE = path.join(__dirname, 'deck-site');
const DOMINIO = 'https://www.decksteakhouse.com.br';
const PEDIDO = 'https://pedido.anota.ai/loja/deck-steakhouse';
const WHATS = 'https://wa.me/5574988712181';
const INSTA = 'https://www.instagram.com/decksteakhouse/';
const HOJE = '2026-10-13';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const id = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* ---------- cardapio (nomes e descricoes da loja online do Deck) ---------- */
const VERSOES = 'Nas versões Chili Beans (carne), Fajitas de Frango, Pulled Pork ou Brócolis (vegetariano).';
const CARDAPIO = [
  { nome: 'Steaks & Chicken', sub: 'Os cortes da casa, servidos no ferro quente.', itens: [
    ['Picanha Grill', 'O corte favorito dos brasileiros, com sabor e coloração inigualáveis.', 'aprox. 600g'],
    ['Bife Ancho', 'Corte nobre portenho, retirado da costela, com alto grau de marmoreio.', 'aprox. 520g'],
    ['Baby Beef (Angus)', 'Corte especial retirado do miolo da alcatra, com pouca gordura e sabor delicado.', 'aprox. 600g'],
    ['Maminha Especial (Angus)', 'Bastante popular no Brasil, é a parte mais macia da alcatra.', 'aprox. 540g'],
    ['Frango Atropelado', 'Corte especial com a coxa e a sobrecoxa do frango, marinado por 24 horas.', 'aprox. 750g'],
  ]},
  { nome: 'A Aclamada', sub: 'A costelinha suína da casa.', itens: [
    ['Ribbs BBQ', 'A nossa costelinha suína, marinada por 24 horas e assada lentamente. Coberta com barbecue e servida com fritas lemon pepper e cebola crispy.', 'aprox. 800g'],
  ]},
  { nome: "Deck's Burgers", sub: 'Hambúrgueres smash e de 160g, no pão brioche, australiano ou de batata.', itens: [
    ['Burguer Brasil', '2 smash burgers, queijo prato fatiado, queijo coalho selado na chapa, fatias de banana frita e mel.'],
    ['Burguer EUA', '2 smash burgers, cheddar fatiado, bacon fatiado, alface, tomate, picles e cebola caramelizada.'],
    ['Burguer Tex Mex', '2 smash burgers, duplo cheddar fatiado, nachos crocantes, guacamole, sour cream e pimenta jalapeño no pão brioche.'],
    ['Deluxe Smash Burger', '2 smash burgers, nacho cheese, bacon crispy e cebola roxa no pão brioche.'],
    ['Texas Crunch', 'Burger de 160g, bacon rústico, disco empanado de queijos especiais, rúcula e molho sweet chilli no pão brioche.'],
    ['Brave Smash Burger', '2 smash burgers, duplo cheddar fatiado, cream cheese, cebola crispy e molho chipotle no pão brioche.'],
    ['Bacon Hunters', 'Burger de 160g, duplo cheddar fatiado, pó de bacon, bacon empanado e crocante, cebola roxa e baconnese no pão brioche.'],
    ['Cheese & Salad Smash Burger', '2 smash burgers, duplo cheddar fatiado, tomate, cebola roxa, picles, alface americana e maionese defumada no pão brioche.'],
    ['Special Rings', 'Burger de 160g, bacon rústico, rodela de cebola empanada na panko e o nosso fondue de cheese mix caprichado no pão australiano.'],
    ['Crispy and Cheese Ultra Smash', '2 ultra smash, queijo coalho, bacon crispy e molho barbecue no pão de batata.'],
    ['Onion Bacon Ultra Smash', '2 ultra smash, bacon, cheddar fatiado, cebola caramelizada e molho baconese no pão de batata.'],
  ]},
  { nome: 'Seleções do Deck', sub: 'Três combos, um para cada bandeira da casa.', itens: [
    ['Combo Brasil', 'Burguer Brasil com Fritas Brasil.'],
    ['Combo Estados Unidos', 'Burguer Estados Unidos com Fritas Estados Unidos.'],
    ['Combo México', 'Tex Mex Smash Burguer com Nachos Cheese e Chili.'],
  ]},
  { nome: 'Petiscos & Entradas', sub: 'Para o meio da mesa.', itens: [
    ['Deck Mix', '4 pedaços de Ribbs BBQ, meia porção de Croquetas Locas, 4 unidades de Mozzarella Sticks, fritas lemon pepper, nachos e molhos barbecue, ranch e chipotle.'],
    ['Nachos com Chilli Beans', 'Tortillas chips com tempero mexicano cobertas de chili beans, nacho cheese, sour cream, guacamole, jalapeño e molho pico de gallo.'],
    ['Fritas & Chili Beans', 'Nossas fritas com um toque de lemon pepper cobertas com chili beans, nacho cheese, sour cream, guacamole, jalapeño e molho pico de gallo.'],
    ['Fritas Sour & Ribs', 'Nossas fritas com um toque de lemon pepper cobertas com sour cream, a nossa costelinha suína desfiada e cebolinha verde.'],
    ['Croquetas Locas', 'Sequinhas e crocantes, elaboradas com pulled pork (carne suína desfiada e especiarias). Servidas com molho chipotle.', '6 unidades'],
    ['Ribs Pop', 'O nosso picolé crocante elaborado com costelinha, batata e tempero ao estilo de Nova York. Servido com molho barbecue.', '4 unidades'],
    ['Mozzarella Sticks', 'Palitos de mozzarella de búfala, empanados em farinha temperada e crocante, finalizados com páprica. Servidos com molho sweet chilli.', '7 unidades'],
    ['Spicy Rainbow', 'Nachos coloridos com molho supreme picante de tomate, carne moída e queijo gratinado.'],
    ['Deck Crispy', 'Tirinhas de frango supercrocantes, acompanhadas do molho de sua escolha.', '200g'],
    ['Pasteizinhos de Costela com Cream Cheese', 'Pasteizinhos de costela suína desfiada com cream cheese, crocantes e saborosos, acompanhados do molho de sua escolha.', '6 unidades'],
  ]},
  { nome: 'Tacos & Burritos', sub: 'O lado mexicano do Deck.', itens: [
    ['Taco Deck', 'Tortilla crocante de milho recheada com cheddar fatiado, sour cream, guacamole e cebola roxa picadinha. ' + VERSOES],
    ['Taco Soft', 'Tortilla macia de trigo, cheddar fatiado, frijoles e alface americana. ' + VERSOES],
    ['Burrito Clássico', 'Tortilla macia, cheddar fatiado, jalapeño, sour cream, guacamole, cebola roxa picadinha e alface americana. ' + VERSOES],
    ['Burrito Ranchero', 'Tortilla macia, nacho cheese, bacon crispy, fritas lemon pepper e molho ranch. ' + VERSOES],
    ['Burrito Guaca & Sour', 'Tortilla macia, cheddar fatiado, sour cream, guacamole e frijoles. ' + VERSOES],
    ['Burrito Croc', 'O burrito frito. Tortilla recheada com pulled pork, fondue de cheese mix, cream cheese, cebola roxa, tempero mexicano e um toque de pimenta sriracha.'],
  ]},
  { nome: 'Quesadillas', sub: 'Tortilla dobrada e tostada na chapa.', itens: [
    ['Chili & Cheese', 'Recheada com mozzarella de búfala, chili beans (carne), nacho cheese e molho pico de gallo.'],
    ['Pork & Frijoles', 'Recheada com cheddar fatiado, carne suína desfiada com especiarias, frijoles, bacon crispy, cream cheese e molho chipotle.'],
    ['Fajitas & Cream Cheese', 'Recheada com cheddar fatiado, fajitas de frango (tiras de frango com cebola e pimentões), cream cheese e jalapeño.'],
  ]},
  { nome: 'Sanduíches Autorais', sub: '', itens: [
    ['Fajitas Sub', 'Fajitas de frango (tiras de frango com cebola e pimentões), sour cream, molho pico de gallo e alface americana na baguete soft.'],
    ['Red Neck', 'Pulled pork (carne suína desfiada com especiarias) ao barbecue, nacho cheese, cebola crispy e molho chipotle no pão soft.'],
  ]},
  { nome: 'Saladas', sub: '', itens: [
    ['Chicken Caesar', 'Alface americana, parmesão, bacon crispy, croutons, tirinhas de peito de frango com um toque de lemon pepper e molho Caesar.'],
    ['Salada Verde', 'Mix de folhas, palmito, tomate cereja, mini discos empanados de queijos especiais, lâminas de cebola roxa e molho Honey & Mustard.'],
  ]},
  { nome: 'Acompanhamentos', sub: 'Para montar o prato do seu jeito.', itens: [
    ['Arroz Philadelphia', 'Arroz cremoso elaborado com creme de leite, parmesão, cream cheese, cogumelos frescos e salsa.'],
    ['Mix de Vegetais', 'Batata-doce, cogumelos frescos, palmito e brócolis na chapa.'],
    ['Fritas Lemon Pepper', 'Fritas extrafinas temperadas com lemon pepper.'],
    ['Garlic Bread', 'Pão soft tostado na grelha, recheado com creme artesanal de alho.'],
    ['Fettuccine Alfredo', 'Massa ao molho elaborado com creme de leite, parmesão, salsa e bacon.'],
    ['Purê de Batatas', 'Receita com um toque de Garlic & Onion e parmesão.'],
    ['Farofa de Banana', 'Receita elaborada com bacon, banana e farinha biju.'],
    ['Arroz Branco e Feijão Preto', 'O clássico da mesa brasileira.'],
    ['Caesar Salad', 'Alface americana, parmesão, bacon crispy, croutons e molho Caesar.'],
    ['Mini Salada Verde', 'Mix de folhas, palmito, tomate cereja, mini discos empanados de queijos especiais, cebola roxa e molho Honey & Mustard.'],
    ['Nachos Crocantes', 'Triângulos crocantes de tortilla de milho temperados.'],
    ['Chili Beans', 'Carne moída ao estilo mexicano, elaborada com molho de tomate, feijão e coentro. Levemente picante.'],
    ['Guacamole da Casa', 'Purê de abacate temperado com limão, coentro, cebola e tomate.'],
    ['Nacho Cheese', 'Queijo cremoso artesanal temperado ao estilo mexicano.'],
    ['Sour Cream', 'Creme de leite aerado com toque cítrico.'],
    ['Frijoles Temperado', 'Purê de feijão temperado com alho e coentro.'],
  ]},
  { nome: 'Menu Kids', sub: 'Para os pequenos, que também têm o Espaço Kids para brincar.', itens: [
    ['Kids Smash Burger', 'Smash burger e cheddar fatiado no pão brioche.'],
    ['Chicken & Pasta', 'Tirinhas de filé de frango com fettuccine na manteiga.'],
    ['Dobradilla Kids', 'Tortilla kids dobrada com mix de queijos.'],
  ]},
  { nome: 'Para Adoçar', sub: '', itens: [
    ['El Churritos', 'Churros fininhos e artesanais, fritos na hora com toque de açúcar e canela. Servidos com doce de leite e Nutella.'],
    ['Dobradilla de Nutella', 'Duas tortillas macias recheadas com Nutella. Servidas com sorvete de flocos, creme de chocolate, farofinha de amendoim, calda e chantilly.'],
  ]},
  { nome: 'Do Bar', sub: 'Drinks servidos no salão. Consulte a carta completa na casa.', itens: [
    ['Gin Tônica de Morango', ''], ['Gin Tônica', ''], ['Caipirinha de Maracujá', ''], ['Blue Margarita', ''], ['Milkshake de chocolate', ''],
  ]},
];
const secao = nome => CARDAPIO.find(s => s.nome === nome);

/* ---------- pecas comuns ---------- */
const PAGINAS = [
  { slug: 'carnes-em-jacobina', menu: 'Carnes', titulo: 'Carnes em Jacobina', resumo: 'Picanha, Bife Ancho, Baby Beef e a Ribbs BBQ.' },
  { slug: 'hamburguer-em-jacobina', menu: 'Hambúrguer', titulo: 'Hambúrguer em Jacobina', resumo: 'Onze hambúrgueres, do smash ao de 160g.' },
  { slug: 'cardapio', menu: 'Cardápio', titulo: 'Cardápio completo', resumo: 'Tudo o que a casa serve, em um lugar só.' },
  { slug: 'o-que-fazer-em-jacobina-a-noite', menu: 'Noite em Jacobina', titulo: 'O que fazer em Jacobina à noite', resumo: 'Um roteiro para aproveitar a cidade depois que o sol se põe.' },
];
const WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.500 20.500l1.300-4.100A8.500 8.500 0 1 1 8 19.400z" fill="none" stroke="currentColor" stroke-width="1.700" stroke-linejoin="round"/><path transform="translate(7.400 6.900) scale(.400)" fill="currentColor" d="M22 16.920v3a2 2 0 0 1-2.180 2 19.790 19.790 0 0 1-8.630-3.070 19.500 19.500 0 0 1-6-6 19.790 19.790 0 0 1-3.070-8.670A2 2 0 0 1 4.110 2h3a2 2 0 0 1 2 1.720 12.840 12.840 0 0 0 .700 2.810 2 2 0 0 1-.450 2.110L8.090 9.910a16 16 0 0 0 6 6l1.270-1.270a2 2 0 0 1 2.110-.450 12.840 12.840 0 0 0 2.810.700A2 2 0 0 1 22 16.920z"/></svg>';

function listaItens(itens) {
  return '<ul class="itens">\n' + itens.map(([n, d, q]) =>
    '        <li><h3>' + esc(n) + (q ? ' <small>' + esc(q) + '</small>' : '') + '</h3>' + (d ? '<p>' + esc(d) + '</p>' : '') + '</li>').join('\n') + '\n      </ul>';
}
function fotos(lista) {
  return '<div class="fotos">\n' + lista.map(([arq, alt, leg]) =>
    '        <figure><img src="/assets/' + arq + '" width="1200" height="800" loading="lazy" alt="' + esc(alt) + '"><figcaption>' + esc(leg) + '</figcaption></figure>').join('\n') + '\n      </div>';
}
function chamada(titulo, texto) {
  return '<section class="chamada">\n        <div><h2 class="display">' + titulo + '</h2><p>' + esc(texto) + '</p></div>\n' +
    '        <div class="cta-row"><a class="btn" href="' + WHATS + '" target="_blank" rel="noopener">Reservar pelo WhatsApp</a><a class="btn ghost" href="' + PEDIDO + '" target="_blank" rel="noopener">Fazer pedido</a></div>\n      </section>';
}
function mais(atual) {
  const cards = PAGINAS.filter(p => p.slug !== atual).map(p => '        <a href="/' + p.slug + '/"><strong>' + esc(p.titulo) + '</strong><span>' + esc(p.resumo) + '</span></a>');
  cards.push('        <a href="/"><strong>Conheça o Deck</strong><span>A casa, a mesa e a reserva.</span></a>');
  return '<section class="bloco">\n      <h2 class="display">Continue por aqui</h2>\n      <div class="mais">\n' + cards.join('\n') + '\n      </div>\n    </section>';
}

function pagina(p) {
  const url = DOMINIO + '/' + p.slug + '/';
  const ld = [{
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Deck Steakhouse', item: DOMINIO + '/' },
      { '@type': 'ListItem', position: 2, name: p.migalha, item: url }]
  }].concat(p.ld || []);
  const links = PAGINAS.map(x => '<a href="/' + x.slug + '/"' + (x.slug === p.slug ? ' aria-current="page"' : '') + '>' + esc(x.menu) + '</a>');
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0b0908">
<meta property="og:type" content="${p.ogtype || 'website'}">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Deck Steakhouse">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:image" content="${DOMINIO}/assets/${p.ogimg || 'og.jpg'}">
<meta property="og:url" content="${url}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%230b0908'/%3E%3Ctext x='32' y='45' font-family='Georgia,serif' font-size='40' font-weight='700' text-anchor='middle' fill='%23D2A54A'%3ED%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:ital,wght@1,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/paginas.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<a class="skip" href="#main">Pular para o conteúdo</a>
<nav class="nav" aria-label="Principal">
  <a class="logo" href="/" aria-label="Deck Steakhouse, início"><img src="/assets/logo-deck.png" width="820" height="550" alt="Deck Steakhouse"></a>
  <ul>
    ${links.map(l => '<li>' + l + '</li>').join('\n    ')}
  </ul>
  <div class="nav-cta">
    <a class="wa" href="${WHATS}" target="_blank" rel="noopener" aria-label="Falar com o Deck no WhatsApp">${WA_ICON}</a>
    <a class="btn ghost" href="${PEDIDO}" target="_blank" rel="noopener">Fazer pedido</a>
    <a class="btn" href="/#reserva">Reservar</a>
  </div>
</nav>
<div class="subnav" aria-label="Páginas">
  <a href="/">Início</a>
  ${links.join('\n  ')}
</div>

<main id="main" tabindex="-1">
  <div class="wrap">
    <ol class="crumbs"><li><a href="/">Deck Steakhouse</a></li><li>${esc(p.migalha)}</li></ol>
    <header class="topo">
      <div>
        <p class="eyebrow">${esc(p.eyebrow)}</p>
        <h1 class="display">${p.h1}</h1>
        <p class="lede">${esc(p.lede)}</p>
        <div class="cta-row"><a class="btn" href="${p.cta1[1]}"${/^http/.test(p.cta1[1]) ? ' target="_blank" rel="noopener"' : ''}>${esc(p.cta1[0])}</a><a class="btn ghost" href="${p.cta2[1]}"${/^http/.test(p.cta2[1]) ? ' target="_blank" rel="noopener"' : ''}>${esc(p.cta2[0])}</a></div>
      </div>
      <figure><img src="/assets/${p.foto[0]}" width="1600" height="1066" alt="${esc(p.foto[1])}" fetchpriority="high"></figure>
    </header>
    ${p.corpo}
    ${mais(p.slug)}
  </div>
</main>

<footer>
  <div class="wrap">
    <div>
      <img src="/assets/logo-deck.png" width="820" height="550" loading="lazy" alt="Deck Steakhouse">
      <p class="tag">A alegria está aqui.</p>
    </div>
    <address>
      <strong>Deck Steakhouse</strong><br>
      R. José Prado Alves, 1, Félix Tomaz<br>
      Jacobina, Bahia<br>
      Todos os dias, das 18h à meia-noite<br>
      WhatsApp <a href="${WHATS}" target="_blank" rel="noopener">(74) 98871-2181</a><br>
      <a href="${INSTA}" target="_blank" rel="noopener">@decksteakhouse</a>
    </address>
    <nav aria-label="Páginas do site">
      <a href="/">Início</a>
      ${PAGINAS.map(x => '<a href="/' + x.slug + '/">' + esc(x.titulo) + '</a>').join('\n      ')}
      <a href="${PEDIDO}" target="_blank" rel="noopener">Pedido online</a>
    </nav>
    <small>© ${HOJE.slice(0, 4)} Deck Steakhouse. Todos os direitos reservados.</small>
  </div>
</footer>
</body>
</html>
`;
}

/* ---------- conteudo de cada pagina ---------- */
const steaks = secao('Steaks & Chicken'), ribs = secao('A Aclamada'), burgers = secao("Deck's Burgers"), combos = secao('Seleções do Deck'), kids = secao('Menu Kids'), lados = secao('Acompanhamentos');

const paginas = [];

paginas.push({
  slug: 'carnes-em-jacobina', migalha: 'Carnes',
  title: 'Carnes em Jacobina: Picanha, Bife Ancho e Angus | Deck Steakhouse',
  description: 'Steakhouse em Jacobina, BA. Picanha Grill, Bife Ancho de 520g, Baby Beef e Maminha Angus, mais a Ribbs BBQ assada lentamente. Reserve sua mesa pelo WhatsApp.',
  eyebrow: 'Steakhouse em Jacobina, Bahia', h1: 'Carnes em Jacobina, <em>no ponto que você pedir.</em>',
  lede: 'O Deck é uma steakhouse em Jacobina, Bahia. Cortes nobres preparados na grelha, servidos no ferro quente e pensados para dividir com a mesa inteira.',
  cta1: ['Reservar pelo WhatsApp', WHATS], cta2: ['Ver cardápio completo', '/cardapio/'],
  foto: ['bife-ancho.jpg', 'Bife Ancho fatiado na chapa de ferro, com fritas e pão de alho ao fundo'], ogimg: 'og.jpg',
  corpo: `<section class="bloco">
      <h2 class="display">Os cortes da casa</h2>
      <p class="sub">Cinco opções entre carne bovina e frango. Cada uma chega com o peso aproximado indicado e no ponto escolhido por você: mal passada, ao ponto, ao ponto para bem ou bem passada.</p>
      ${listaItens(steaks.itens)}
      ${fotos([['picanha.jpg', 'Picanha Grill fatiada com sal grosso na chapa de ferro', 'Picanha Grill'], ['bife-ancho-poster.jpg', 'Bife Ancho servido com Arroz Philadelphia e mix de vegetais', 'Bife Ancho']])}
    </section>
    <section class="bloco">
      <h2 class="display">A Aclamada: Ribbs BBQ</h2>
      <p class="sub">A costelinha suína do Deck não vai para a grelha. Ela é marinada por 24 horas e assada lentamente, até soltar do osso.</p>
      ${listaItens(ribs.itens)}
      ${fotos([['ribs.jpg', 'Ribbs BBQ coberta de molho barbecue com fritas e cebola crispy', 'Ribbs BBQ']])}
    </section>
    <section class="bloco">
      <h2 class="display">Para acompanhar</h2>
      <p class="sub">Monte a mesa com os acompanhamentos da casa. O Arroz Philadelphia e o Mix de Vegetais combinam bem com os cortes.</p>
      ${listaItens(lados.itens.slice(0, 8))}
    </section>
    <section class="bloco prosa">
      <h2 class="display">Como é comer carne no Deck</h2>
      <p>A casa junta a tradição das steakhouses americanas com o jeito baiano de receber. A carne vem fatiada no ferro quente, para a mesa inteira se servir, e os acompanhamentos chegam em volta.</p>
      <p>O Deck fica na R. José Prado Alves, 1, no bairro Félix Tomaz, em Jacobina, e abre todos os dias, das 18h à meia-noite. Para grupos e comemorações, vale reservar pelo WhatsApp com antecedência. Quem vem com criança conta com o Espaço Kids e com o Menu Kids.</p>
      <p>Prefere um lanche? Veja os <a href="/hamburguer-em-jacobina/">hambúrgueres do Deck</a> ou o <a href="/cardapio/">cardápio completo</a>.</p>
    </section>
    ${chamada('Sua mesa <em>está posta.</em>', 'Reservas das 18h30 às 23h pelo WhatsApp. Se preferir comer em casa, peça pelo cardápio online.')}`,
});

paginas.push({
  slug: 'hamburguer-em-jacobina', migalha: 'Hambúrguer',
  title: 'Hambúrguer em Jacobina: smash e burgers de 160g | Deck Steakhouse',
  description: 'Onze hambúrgueres em Jacobina, BA: smash burgers, burgers de 160g, bacon, cheddar e nacho cheese no pão brioche. Coma no Deck Steakhouse ou peça online.',
  eyebrow: 'Hamburgueria e steakhouse em Jacobina', h1: 'Hambúrguer em Jacobina, <em>do smash ao de 160g.</em>',
  lede: 'Os Deck\'s Burgers são onze receitas da casa, com smash burgers selados na chapa, queijos que escorrem e pães brioche, australiano e de batata.',
  cta1: ['Pedir hambúrguer online', PEDIDO], cta2: ['Reservar mesa', WHATS],
  foto: ['cheeseburger.jpg', 'Deluxe Smash Burger com dois smash burgers, nacho cheese e bacon crispy no pão brioche'], ogimg: 'cheeseburger.jpg',
  corpo: `<section class="bloco">
      <h2 class="display">Deck's Burgers</h2>
      <p class="sub">Todos os hambúrgueres do cardápio. Os smash vêm com duas carnes finas e bem seladas. Os de 160g são mais altos e suculentos.</p>
      ${listaItens(burgers.itens)}
    </section>
    <section class="bloco">
      <h2 class="display">Combos das três bandeiras</h2>
      <p class="sub">Brasil, Estados Unidos e México, as três cozinhas que inspiram o Deck, cada uma com seu hambúrguer e seu acompanhamento.</p>
      ${listaItens(combos.itens)}
    </section>
    <section class="bloco">
      <h2 class="display">Para comer junto</h2>
      <p class="sub">Fritas, nachos e o hambúrguer das crianças.</p>
      ${listaItens([lados.itens[2], secao('Petiscos & Entradas').itens[2], secao('Petiscos & Entradas').itens[1], kids.itens[0]])}
      ${fotos([['fritas.jpg', 'Fritas servidas em cestinha de metal', 'Fritas'], ['nachos.jpg', 'Nachos com chili beans, nacho cheese, sour cream e guacamole', 'Nachos com Chilli Beans']])}
    </section>
    <section class="bloco prosa">
      <h2 class="display">Onde comer hambúrguer em Jacobina</h2>
      <p>O Deck Steakhouse fica na R. José Prado Alves, 1, no bairro Félix Tomaz, e abre todos os dias, das 18h à meia-noite. Dá para comer no salão, na varanda ou pedir pelo cardápio online.</p>
      <p>Para a turma, o hambúrguer combina com uma porção de nachos no meio da mesa e uma rodada de drinks. Para a família, tem Espaço Kids e o Kids Smash Burger no Menu Kids.</p>
      <p>Quer algo além do hambúrguer? Conheça as <a href="/carnes-em-jacobina/">carnes do Deck</a> ou veja o <a href="/cardapio/">cardápio completo</a>.</p>
    </section>
    ${chamada('Bateu a fome <em>de hambúrguer?</em>', 'Peça online ou venha comer no Deck. Reservas das 18h30 às 23h pelo WhatsApp.')}`,
});

paginas.push({
  slug: 'cardapio', migalha: 'Cardápio',
  title: 'Cardápio do Deck Steakhouse | Restaurante em Jacobina, BA',
  description: 'Cardápio completo do Deck Steakhouse, restaurante em Jacobina: carnes, hambúrgueres, tacos, burritos, quesadillas, petiscos, menu kids, sobremesas e drinks.',
  eyebrow: 'Restaurante em Jacobina, Bahia', h1: 'Cardápio <em>do Deck.</em>',
  lede: 'Tudo o que a casa serve: steaks, hambúrgueres, comida mexicana, petiscos para dividir, menu kids, sobremesas e drinks. Os preços e o pedido ficam no cardápio online.',
  cta1: ['Ver preços e pedir', PEDIDO], cta2: ['Reservar mesa', WHATS],
  foto: ['nachos.jpg', 'Nachos com chili beans, nacho cheese, sour cream, guacamole e jalapeño'], ogimg: 'og.jpg',
  ld: [{
    '@context': 'https://schema.org', '@type': 'Menu', name: 'Cardápio do Deck Steakhouse', url: DOMINIO + '/cardapio/', inLanguage: 'pt-BR',
    hasMenuSection: CARDAPIO.map(s => ({ '@type': 'MenuSection', name: s.nome, hasMenuItem: s.itens.map(([n, d]) => Object.assign({ '@type': 'MenuItem', name: n }, d ? { description: d } : {})) }))
  }],
  corpo: `<section class="bloco">
      <h2 class="display">Vá direto ao que quer</h2>
      <div class="indice">
        ${CARDAPIO.map(s => '<a href="#' + id(s.nome) + '">' + esc(s.nome) + '</a>').join('\n        ')}
      </div>
    </section>
    ${CARDAPIO.map(s => `<section class="bloco" id="${id(s.nome)}">
      <h2 class="display">${esc(s.nome)}</h2>
      ${s.sub ? '<p class="sub">' + esc(s.sub) + '</p>' : ''}
      ${listaItens(s.itens)}
    </section>`).join('\n    ')}
    ${chamada('Escolheu? <em>Agora é pedir.</em>', 'Os preços atualizados estão no cardápio online. Para comer na casa, reserve pelo WhatsApp das 18h30 às 23h.')}`,
});

paginas.push({
  slug: 'o-que-fazer-em-jacobina-a-noite', migalha: 'O que fazer em Jacobina à noite', ogtype: 'article',
  title: 'O que fazer em Jacobina à noite: roteiro para sair | Deck Steakhouse',
  description: 'O que fazer em Jacobina, BA: do pôr do sol no Alto do Cruzeiro ao jantar com drinks. Um roteiro para a noite em Jacobina, a dois, em família ou com amigos.',
  eyebrow: 'Guia da noite em Jacobina', h1: 'O que fazer em Jacobina <em>à noite.</em>',
  lede: 'Jacobina é conhecida pelas serras e cachoeiras. Quando o sol se põe, a cidade troca a trilha pela mesa. Este é um roteiro simples para aproveitar a noite, feito por quem vive a noite da cidade.',
  cta1: ['Reservar mesa no Deck', WHATS], cta2: ['Ver cardápio', '/cardapio/'],
  foto: ['brinde.jpg', 'Amigas brindando com chope e milkshake em uma mesa do Deck, em Jacobina'], ogimg: 'brinde.jpg',
  ld: [{
    '@context': 'https://schema.org', '@type': 'Article', headline: 'O que fazer em Jacobina à noite', inLanguage: 'pt-BR',
    datePublished: HOJE, dateModified: HOJE, image: DOMINIO + '/assets/brinde.jpg', mainEntityOfPage: DOMINIO + '/o-que-fazer-em-jacobina-a-noite/',
    author: { '@type': 'Organization', name: 'Deck Steakhouse', url: DOMINIO + '/' }, publisher: { '@type': 'Organization', name: 'Deck Steakhouse', logo: { '@type': 'ImageObject', url: DOMINIO + '/assets/logo-deck.png' } }
  }],
  corpo: `<section class="bloco prosa">
      <h2 class="display">Comece pelo fim da tarde</h2>
      <p>Jacobina, no interior da Bahia, é chamada de Cidade do Ouro e é cercada de serras e cachoeiras. Quem passa o dia nas cachoeiras, como a Cachoeira dos Amores, perto do centro, ou as do distrito de Itaitu, costuma voltar para a cidade no fim da tarde.</p>
      <p>Um bom jeito de fechar o dia é subir ao Alto do Cruzeiro, o mirante da cidade, e ver o pôr do sol sobre os vales. De lá, é descer, tomar um banho e sair para jantar.</p>
      <div class="fotos altas">
        <figure><img src="/assets/cachoeira.jpg" width="768" height="1024" loading="lazy" alt="Cachoeira alta caindo entre paredões de pedra em Jacobina"><figcaption>Cachoeiras da região</figcaption></figure>
        <figure><img src="/assets/jacobina-vista.jpg" width="662" height="813" loading="lazy" alt="Vista aérea de Jacobina entre as serras, com o sol atravessando as nuvens no fim da tarde"><figcaption>Jacobina vista do alto</figcaption></figure>
        <figure><img src="/assets/alto-do-cruzeiro.jpg" width="640" height="480" loading="lazy" alt="Morro do Alto do Cruzeiro, com a escadaria até o cruzeiro no topo, em Jacobina"><figcaption>Alto do Cruzeiro</figcaption></figure>
      </div>
      <h3>Jantar sem pressa</h3>
      <p>A noite em Jacobina gira em torno da mesa. No Deck Steakhouse, o jantar começa às 18h e vai até a meia-noite, com <a href="/carnes-em-jacobina/">carnes servidas no ferro quente</a>, <a href="/hamburguer-em-jacobina/">hambúrgueres</a>, tacos, burritos e petiscos para dividir.</p>
      <p>Para quem passou o dia em trilha, uma boa pedida é um corte para a mesa inteira, como a Picanha Grill ou o Bife Ancho, com Arroz Philadelphia e Mix de Vegetais.</p>
      <h3>Drinks na varanda</h3>
      <p>Quem quer só beber e conversar encontra a varanda do Deck, ao ar livre. Entre os drinks da casa estão a Gin Tônica de Morango, a Caipirinha de Maracujá e a Blue Margarita. Para acompanhar, nachos ou uma porção de Croquetas Locas.</p>
    </section>
    <section class="bloco">
      <h2 class="display">Um roteiro para cada companhia</h2>
      <p class="sub">A mesma noite muda conforme quem senta com você.</p>
      ${listaItens([
        ['A dois', 'Um corte para dividir e uma sobremesa no final, como a Dobradilla de Nutella.'],
        ['Em família', 'Chegue cedo. As crianças têm o Espaço Kids para brincar e o Menu Kids, e os adultos jantam com calma.'],
        ['Com os amigos', 'Hambúrguer, Deck Mix no meio da mesa e uma rodada de drinks. Ninguém olha o relógio.'],
        ['Para comemorar', 'Aniversário ou reencontro pedem reserva. Avise pelo WhatsApp quantos vêm e o horário.'],
      ])}
      ${fotos([['varanda.jpg', 'Amigas conversando com drinks na varanda do Deck à noite, em Jacobina', 'Varanda'], ['familia.jpg', 'Pai e filho pequeno no Deck', 'Em família'], ['gin-morango.jpg', 'Gin Tônica de Morango com hortelã', 'Gin Tônica de Morango']])}
    </section>
    <section class="bloco prosa">
      <h2 class="display">Informações para planejar</h2>
      <p>O Deck Steakhouse fica na R. José Prado Alves, 1, no bairro Félix Tomaz. Abre todos os dias, das 18h à meia-noite. As reservas são feitas pelo WhatsApp (74) 98871-2181, para horários entre 18h30 e 23h.</p>
      <figure class="fachada"><img src="/assets/fachada.jpg" width="1600" height="900" loading="lazy" alt="Fachada do Deck Steakhouse à noite, com a varanda de madeira iluminada"><figcaption>A fachada do Deck à noite, na R. José Prado Alves, 1</figcaption></figure>
      <p>Se a noite pedir sofá, o <a href="${PEDIDO}" target="_blank" rel="noopener">cardápio online</a> recebe pedidos, e o <a href="/cardapio/">cardápio completo</a> está aqui no site.</p>
    </section>
    ${chamada('A noite em Jacobina <em>começa aqui.</em>', 'Reserve sua mesa pelo WhatsApp e chegue com fome.')}`,
});

/* ---------- gravacao ---------- */
for (const p of paginas) {
  const dir = path.join(SITE, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), pagina(p), 'utf8');
  console.log('pagina  /' + p.slug + '/');
}
fs.writeFileSync(path.join(SITE, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: ' + DOMINIO + '/sitemap.xml\n', 'utf8');
const urls = ['/'].concat(paginas.map(p => '/' + p.slug + '/'));
fs.writeFileSync(path.join(SITE, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(u => '  <url><loc>' + DOMINIO + u + '</loc><lastmod>' + HOJE + '</lastmod></url>').join('\n') + '\n</urlset>\n', 'utf8');
console.log('robots.txt e sitemap.xml com ' + urls.length + ' enderecos');
