# Deck Steakhouse

Site do Deck Steakhouse, restaurante em Jacobina, Bahia. "A alegria está aqui."

Site estático em HTML, CSS e JavaScript puros, sem framework e sem etapa de build.

## Estrutura

| Caminho | O que é |
|---|---|
| `deck-site/` | O site pronto para publicar. É esta pasta que vai para a hospedagem. |
| `deck-site/index.html` | Página principal, com o topo animado pelo scroll, seções, perguntas frequentes e a seção "Venha para o Deck" (sem reserva: é só chegar). |
| `deck-site/carnes-em-jacobina/`, `hamburguer-em-jacobina/`, `cardapio/`, `o-que-fazer-em-jacobina-a-noite/` | Páginas internas, geradas pelo `gerar-paginas.js`. |
| `deck-site/assets/` | Fotos, vídeo, logotipo e o estilo das páginas internas. |
| `deck-site/robots.txt`, `deck-site/sitemap.xml` | Arquivos para os buscadores. |
| `gerar-paginas.js` | Gera as páginas internas a partir do cardápio. Rode de novo depois de mudar algo nele. |
| `ver-site.js` | Mostra o site no seu computador antes de publicar. |
| `otimizar-imagens.js` | Cria as versões WebP das fotos (tela cheia e 800px para celular) e aplica nas páginas. Precisa do ffmpeg. |

## Ver o site no computador

```bash
node ver-site.js
```

Abre em http://localhost:8090/. Deixe a janela aberta enquanto olha; Ctrl+C desliga.

## Atualizar as páginas internas

```bash
node gerar-paginas.js
```

Ele já roda o `otimizar-imagens.js` no final. Se trocar ou adicionar uma foto em `deck-site/assets`, rode `node otimizar-imagens.js` para gerar o WebP dela.

## Publicar

Suba o conteúdo de `deck-site/` para a raiz pública da hospedagem. O site está preparado para o domínio `https://www.decksteakhouse.com.br` (endereço canônico, sitemap e prévias de link).

## Medição de visitas e cliques

O site usa o Web Analytics da Vercel (sem cookies). Os botões de WhatsApp, pedido e "Como chegar" passam por páginas de passagem, que contam o clique e seguem na hora para o destino:

| Página | Conta | Leva para |
|---|---|---|
| `/ir/whatsapp/` | cliques no WhatsApp | conversa com o Deck |
| `/ir/mapa/` | cliques em como chegar | ficha do Deck no Google Maps |
| `/ir/pedido/` | cliques em fazer pedido | cardápio online (Anota AI) |

No painel da Vercel, em Analytics, essas três páginas mostram quantas vezes cada botão foi usado. Elas ficam fora do Google (`noindex` e `robots.txt`).
