# Clean LinkedIn

Extensão para Chrome/Firefox que remove ruído do feed do LinkedIn.

## O que remove

- Posts patrocinados (Promoted/Patrocinado/Sponsorisé/Gesponsert)
- Widget "Today's puzzles" na sidebar
- Widget "Add to your feed" na sidebar

## Funcionalidades

- **Auto-expandir posts**: expande automaticamente posts com "ver mais" ao rolar o feed
- Toggle rápido via popup para habilitar/desabilitar tudo

## Instalação

1. Acesse `chrome://extensions/` (ou `edge://extensions/`)
2. Ative o **Modo do desenvolvedor**
3. Clique em **Carregar sem compactação**
4. Selecione a pasta do projeto

## Estrutura

```
manifest.json   # Configuração da extensão (MV3)
content.js      # Script injetado no linkedin.com
popup.html/js   # Interface do toggle
icons/          # Ícones da extensão
```
