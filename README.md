# 🕰️ Chronos - Historical Timeline Game

[![Play Now](https://img.shields.io/badge/Play-Now-gold?style=for-the-badge)](.) [![Offline PWA](https://img.shields.io/badge/PWA-Offline-blue?style=for-the-badge)](.) [![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-yellow?style=for-the-badge)](.)

## 🌍 English | 🇧🇷 Português

---

## English

### About

Chronos is an educational timeline game where you place historical events and figures in chronological order. Learn world history through gameplay, from ancient civilizations to modern times.

- **1200+ historical cards** spanning 9 eras
- **6 game modes**: Classic, Empires, Characters, Biblical, Greco-Roman, Eastern
- **21 unlockable trophies** with historical trivia
- **Fully bilingual**: English and Portuguese
- **Offline-first PWA**: Install and play without internet
- **Zero build tools**: Pure vanilla JavaScript

🎮 **[Play Chronos](.)** | 📖 **[View Documentation](docs/CLAUDE.md)**

---

### Quick Start - Players

1. **Open the game** - Simply open `index.html` in your browser
2. **Select a game mode** (Classic recommended for beginners)
3. **Place cards** in chronological order to build your timeline
4. **Unlock trophies** by achieving specific milestones
5. **Install as PWA** (optional) for offline play from your home screen

---

### Quick Start - Developers

```bash
# Clone the repository
git clone [repo-url]
cd chronos

# Open in browser - that's it!
open index.html
# or on Windows: start index.html
# or just double-click index.html

# No npm install, no build, no transpilation needed
```

**Requirements:** Modern web browser (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)

---

### Project Structure

```
chronos/
├── index.html          # Main HTML file (PWA entry point)
├── sw.js              # Service worker (offline caching)
├── README.md          # This file
├── src/               # JavaScript source files
│   ├── state.js       # Global state variables
│   ├── game.js        # Game logic (22KB)
│   ├── ui.js          # UI rendering (63KB)
│   ├── i18n.js        # Translations (19KB)
│   ├── cards.js       # Historical content (727KB, 1200+ cards)
│   ├── trophies.js    # Trophy definitions (41KB)
│   ├── sfx.js         # Sound effects engine (8KB)
│   └── bgm.js         # Background music (1.3MB, base64 encoded)
├── assets/            # Static assets
│   ├── manifest.json  # PWA manifest
│   └── *.png         # App icons (192px, 512px, 1024px, Apple)
└── docs/             # Documentation
    ├── CLAUDE.md            # Comprehensive guide for AI agents
    └── REPOSITORY_SUMMARY.md # Architecture overview
```

---

### How to Play

1. **Choose a mode**: Select from 6 different historical themes
   - **Classic**: All of history (Ancient to Contemporary)
   - **Empires**: Great civilizations and empires
   - **Characters**: Historical figures and leaders
   - **Biblical**: Events from Abrahamic religious texts
   - **Greco-Roman**: Mediterranean classical antiquity
   - **Eastern**: Asian civilizations and history

2. **Select difficulty**: Lives mode (3 mistakes allowed) or Free mode (unlimited)

3. **Draw cards**: A random historical event or figure appears

4. **Place it correctly**: Drag to the timeline where it belongs chronologically

5. **Build streaks**: Consecutive correct placements increase your score

6. **Use hints**: Spend points to reveal clues about the card's date

7. **Unlock trophies**: Achieve milestones to reveal fascinating historical trivia

**Scoring:**
- Base points: 10 per card (intervals: 10-30 based on duration)
- Streak bonus: +2 points per consecutive correct placement
- Hint penalty: -5 points per clue revealed

---

### Technology Stack

**Core Philosophy: Simplicity & Portability**

- **HTML5** - Semantic, accessible markup
- **CSS3** - Custom styles, no frameworks (dark/light themes)
- **Vanilla JavaScript (ES6+)** - Zero frameworks, zero build tools
- **Progressive Web App** - Service worker, offline support, installable
- **Base64 assets** - All audio/images embedded for offline use

**Why Vanilla JS?**

This project intentionally avoids frameworks, bundlers, and npm dependencies to:
- ✅ Maximize simplicity and readability
- ✅ Eliminate build complexity
- ✅ Ensure long-term maintainability
- ✅ Make it runnable by opening index.html
- ✅ Serve as an educational example of "framework-free" development

**No build step means:**
- No watching for changes
- No waiting for compilation
- No dependency vulnerabilities
- No obsolescence from framework updates
- Just open and run

---

### Content Scale

- **1200+ historical cards** (events and people)
- **9 historical eras**: Ancient, Classical, Medieval, Renaissance, Enlightenment, Industrial, Modern, Contemporary, Biblical
- **6 game modes** with unique focuses
- **21 unlockable trophies**: Each reveals unique historical trivia
- **2 languages**: English and Portuguese (equal treatment, full translation)
- **Daily challenges**: Seeded puzzles for consistent experience across players

---

### Features

- 🎯 **Educational gameplay** - Learn history through interactive placement
- 🌐 **Fully bilingual** - Seamless English/Portuguese switching
- 📱 **Progressive Web App** - Install on desktop and mobile
- 🔌 **Offline-first** - Play without internet connection
- 🏆 **Trophy system** - Unlock historical trivia by achieving milestones
- 🎨 **Dark/Light themes** - Comfortable viewing in any environment
- 🎵 **Optional audio** - Background music and sound effects
- 📊 **Statistics tracking** - Game history and performance metrics
- ⚡ **Fast performance** - Vanilla JS, no framework overhead
- 🎲 **Daily challenges** - New seeded puzzle each day

---

### Contributing

Want to add historical cards, fix bugs, or improve gameplay?

1. **Read the guidelines**: See [docs/CLAUDE.md](docs/CLAUDE.md) for detailed contribution guide
2. **Follow the philosophy**: Maintain vanilla JS approach, no frameworks
3. **Test thoroughly**: All game modes, both languages, Lives/Free modes
4. **Ensure offline works**: Increment service worker cache version
5. **Write good history**: Fact-check dates, write engaging content

**Key principles:**
- ✅ DO: Maintain bilingual equality (both EN and PT)
- ✅ DO: Preserve offline functionality
- ✅ DO: Follow existing code patterns
- ✅ DO: Test in multiple browsers
- ❌ DON'T: Add build tools, frameworks, or npm packages
- ❌ DON'T: Break PWA offline-first capability
- ❌ DON'T: Hardcode English-only strings

**Adding Historical Cards:**

See [docs/CLAUDE.md - Adding a New Historical Card](docs/CLAUDE.md#adding-a-new-historical-card) for the complete guide. Quick overview:

```javascript
// In cards.js - CARDS array
{
  name: 'English Name',
  name_pt: 'Nome em Português',
  year: 1492,  // Negative for BCE
  cat: 'Events',
  cat_pt: 'Eventos',
  era: 'Renaissance',
  hint: 'Brief description...',
  hint_pt: 'Descrição breve...',
  facts: ['Interesting fact 1', 'Interesting fact 2', 'Interesting fact 3'],
  facts_pt: ['Fato interessante 1', 'Fato interessante 2', 'Fato interessante 3'],
  clues: ['Vague clue', 'More specific', 'Very specific'],
  clues_pt: ['Pista vaga', 'Mais específica', 'Muito específica']
}
```

---

### Further Reading

- **[CLAUDE.md](docs/CLAUDE.md)** - Comprehensive guide for AI agents working on this codebase (70KB, very detailed)
- **[REPOSITORY_SUMMARY.md](docs/REPOSITORY_SUMMARY.md)** - Architecture overview and design decisions
- **Game Modes** - See in-game descriptions for each mode's focus
- **Historical Sources** - Cards are fact-checked against Britannica, academic sources, and peer-reviewed content

---

### Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 80+ | ✅ Fully Supported |
| Firefox | 75+ | ✅ Fully Supported |
| Safari | 13+ | ✅ Fully Supported |
| Edge | 80+ | ✅ Fully Supported |
| Chrome Mobile | Latest | ✅ Fully Supported |
| Safari iOS | 13+ | ✅ Fully Supported |
| Samsung Internet | Latest | ⚠️ Mostly Supported |
| Opera | Latest | ✅ Fully Supported |

**Note:** Service worker support required for offline functionality.

---

### License

[Specify license here - e.g., MIT, GPL-3.0, Apache-2.0]

---

### Acknowledgments

- Historical data sources: Britannica, Wikipedia (verified), academic sources
- Fonts: Google Fonts (Playfair Display, Inter, Crimson Pro)
- Built with passion for history and education

---

## 🇧🇷 Português

### Sobre

Chronos é um jogo educativo de linha do tempo onde você coloca eventos e figuras históricas em ordem cronológica. Aprenda história mundial através de jogabilidade, desde civilizações antigas até os tempos modernos.

- **1200+ cartas históricas** abrangendo 9 eras
- **6 modos de jogo**: Clássico, Impérios, Personagens, Bíblico, Greco-Romano, Oriental
- **21 troféus desbloqueáveis** com curiosidades históricas
- **Totalmente bilíngue**: Inglês e Português
- **PWA offline-first**: Instale e jogue sem internet
- **Zero ferramentas de build**: JavaScript vanilla puro

🎮 **[Jogar Chronos](.)** | 📖 **[Ver Documentação](docs/CLAUDE.md)**

---

### Início Rápido - Jogadores

1. **Abra o jogo** - Simplesmente abra `index.html` no seu navegador
2. **Selecione um modo de jogo** (Clássico recomendado para iniciantes)
3. **Coloque cartas** em ordem cronológica para construir sua linha do tempo
4. **Desbloqueie troféus** alcançando marcos específicos
5. **Instale como PWA** (opcional) para jogar offline da sua tela inicial

---

### Início Rápido - Desenvolvedores

```bash
# Clone o repositório
git clone [repo-url]
cd chronos

# Abra no navegador - é só isso!
open index.html
# ou no Windows: start index.html
# ou apenas clique duas vezes em index.html

# Sem npm install, sem build, sem transpilação necessária
```

**Requisitos:** Navegador web moderno (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)

---

### Estrutura do Projeto

```
chronos/
├── index.html          # Arquivo HTML principal (ponto de entrada PWA)
├── sw.js              # Service worker (cache offline)
├── README.md          # Este arquivo
├── src/               # Arquivos JavaScript fonte
│   ├── state.js       # Variáveis de estado global
│   ├── game.js        # Lógica do jogo (22KB)
│   ├── ui.js          # Renderização de UI (63KB)
│   ├── i18n.js        # Traduções (19KB)
│   ├── cards.js       # Conteúdo histórico (727KB, 1200+ cartas)
│   ├── trophies.js    # Definições de troféus (41KB)
│   ├── sfx.js         # Motor de efeitos sonoros (8KB)
│   └── bgm.js         # Música de fundo (1.3MB, codificado em base64)
├── assets/            # Assets estáticos
│   ├── manifest.json  # Manifest PWA
│   └── *.png         # Ícones do app (192px, 512px, 1024px, Apple)
└── docs/             # Documentação
    ├── CLAUDE.md            # Guia abrangente para agentes de IA
    └── REPOSITORY_SUMMARY.md # Visão geral da arquitetura
```

---

### Como Jogar

1. **Escolha um modo**: Selecione entre 6 temas históricos diferentes
   - **Clássico**: Toda a história (Antiga à Contemporânea)
   - **Impérios**: Grandes civilizações e impérios
   - **Personagens**: Figuras históricas e líderes
   - **Bíblico**: Eventos de textos religiosos abraâmicos
   - **Greco-Romano**: Antiguidade clássica mediterrânea
   - **Oriental**: Civilizações e história asiáticas

2. **Selecione dificuldade**: Modo Vidas (3 erros permitidos) ou Modo Livre (ilimitado)

3. **Compre cartas**: Um evento ou figura histórica aleatória aparece

4. **Coloque corretamente**: Arraste para a linha do tempo onde pertence cronologicamente

5. **Construa sequências**: Colocações corretas consecutivas aumentam sua pontuação

6. **Use dicas**: Gaste pontos para revelar pistas sobre a data da carta

7. **Desbloqueie troféus**: Alcance marcos para revelar curiosidades históricas fascinantes

**Pontuação:**
- Pontos base: 10 por carta (intervalos: 10-30 baseado na duração)
- Bônus de sequência: +2 pontos por colocação correta consecutiva
- Penalidade de dica: -5 pontos por pista revelada

---

### Stack Tecnológica

**Filosofia Central: Simplicidade & Portabilidade**

- **HTML5** - Marcação semântica e acessível
- **CSS3** - Estilos customizados, sem frameworks (temas claro/escuro)
- **JavaScript Vanilla (ES6+)** - Zero frameworks, zero ferramentas de build
- **Progressive Web App** - Service worker, suporte offline, instalável
- **Assets Base64** - Todo áudio/imagens embutidos para uso offline

**Por que Vanilla JS?**

Este projeto intencionalmente evita frameworks, bundlers e dependências npm para:
- ✅ Maximizar simplicidade e legibilidade
- ✅ Eliminar complexidade de build
- ✅ Garantir manutenibilidade a longo prazo
- ✅ Torná-lo executável abrindo index.html
- ✅ Servir como exemplo educacional de desenvolvimento "sem frameworks"

**Sem etapa de build significa:**
- Sem observar mudanças
- Sem esperar compilação
- Sem vulnerabilidades de dependências
- Sem obsolescência de atualizações de framework
- Apenas abrir e executar

---

### Escala de Conteúdo

- **1200+ cartas históricas** (eventos e pessoas)
- **9 eras históricas**: Antiga, Clássica, Medieval, Renascimento, Iluminismo, Industrial, Moderna, Contemporânea, Bíblica
- **6 modos de jogo** com focos únicos
- **21 troféus desbloqueáveis**: Cada um revela curiosidades históricas únicas
- **2 idiomas**: Inglês e Português (tratamento igual, tradução completa)
- **Desafios diários**: Quebra-cabeças com seed para experiência consistente entre jogadores

---

### Funcionalidades

- 🎯 **Gameplay educacional** - Aprenda história através de colocação interativa
- 🌐 **Totalmente bilíngue** - Troca perfeita entre Inglês/Português
- 📱 **Progressive Web App** - Instale em desktop e mobile
- 🔌 **Offline-first** - Jogue sem conexão à internet
- 🏆 **Sistema de troféus** - Desbloqueie curiosidades históricas alcançando marcos
- 🎨 **Temas Claro/Escuro** - Visualização confortável em qualquer ambiente
- 🎵 **Áudio opcional** - Música de fundo e efeitos sonoros
- 📊 **Rastreamento de estatísticas** - Histórico de jogos e métricas de desempenho
- ⚡ **Performance rápida** - Vanilla JS, sem overhead de framework
- 🎲 **Desafios diários** - Novo quebra-cabeça com seed a cada dia

---

### Contribuindo

Quer adicionar cartas históricas, corrigir bugs ou melhorar a jogabilidade?

1. **Leia as diretrizes**: Veja [docs/CLAUDE.md](docs/CLAUDE.md) para guia detalhado de contribuição
2. **Siga a filosofia**: Mantenha a abordagem vanilla JS, sem frameworks
3. **Teste minuciosamente**: Todos os modos de jogo, ambos idiomas, modos Vidas/Livre
4. **Garanta offline**: Incremente a versão do cache do service worker
5. **Escreva boa história**: Verifique datas, escreva conteúdo envolvente

**Princípios-chave:**
- ✅ FAÇA: Mantenha igualdade bilíngue (tanto EN quanto PT)
- ✅ FAÇA: Preserve funcionalidade offline
- ✅ FAÇA: Siga padrões de código existentes
- ✅ FAÇA: Teste em múltiplos navegadores
- ❌ NÃO FAÇA: Adicione ferramentas de build, frameworks ou pacotes npm
- ❌ NÃO FAÇA: Quebre capacidade offline-first da PWA
- ❌ NÃO FAÇA: Hardcode strings somente em inglês

**Adicionando Cartas Históricas:**

Veja [docs/CLAUDE.md - Adding a New Historical Card](docs/CLAUDE.md#adding-a-new-historical-card) para o guia completo. Visão rápida:

```javascript
// Em cards.js - array CARDS
{
  name: 'English Name',
  name_pt: 'Nome em Português',
  year: 1492,  // Negativo para a.C.
  cat: 'Events',
  cat_pt: 'Eventos',
  era: 'Renaissance',
  hint: 'Brief description...',
  hint_pt: 'Descrição breve...',
  facts: ['Interesting fact 1', 'Interesting fact 2', 'Interesting fact 3'],
  facts_pt: ['Fato interessante 1', 'Fato interessante 2', 'Fato interessante 3'],
  clues: ['Vague clue', 'More specific', 'Very specific'],
  clues_pt: ['Pista vaga', 'Mais específica', 'Muito específica']
}
```

---

### Leitura Adicional

- **[CLAUDE.md](docs/CLAUDE.md)** - Guia abrangente para agentes de IA trabalhando nesta base de código (70KB, muito detalhado)
- **[REPOSITORY_SUMMARY.md](docs/REPOSITORY_SUMMARY.md)** - Visão geral da arquitetura e decisões de design
- **Modos de Jogo** - Veja descrições no jogo para o foco de cada modo
- **Fontes Históricas** - Cartas são verificadas contra Britannica, fontes acadêmicas e conteúdo revisado por pares

---

### Suporte de Navegadores

| Navegador | Versão | Status |
|-----------|--------|--------|
| Chrome | 80+ | ✅ Totalmente Suportado |
| Firefox | 75+ | ✅ Totalmente Suportado |
| Safari | 13+ | ✅ Totalmente Suportado |
| Edge | 80+ | ✅ Totalmente Suportado |
| Chrome Mobile | Mais Recente | ✅ Totalmente Suportado |
| Safari iOS | 13+ | ✅ Totalmente Suportado |
| Samsung Internet | Mais Recente | ⚠️ Maiormente Suportado |
| Opera | Mais Recente | ✅ Totalmente Suportado |

**Nota:** Suporte a service worker necessário para funcionalidade offline.

---

### Licença

[Especificar licença aqui - ex: MIT, GPL-3.0, Apache-2.0]

---

### Agradecimentos

- Fontes de dados históricos: Britannica, Wikipedia (verificado), fontes acadêmicas
- Fontes: Google Fonts (Playfair Display, Inter, Crimson Pro)
- Construído com paixão por história e educação

---

**Made with 🕰️ and ❤️**

*Chronos - Where history comes alive through gameplay*
*Chronos - Onde a história ganha vida através da jogabilidade*
