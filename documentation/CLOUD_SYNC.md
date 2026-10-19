# Cloud Sync — Briefing de abertura

Prompt para iniciar a conversa dedicada à implementação de salvamento de partida, login e sincronização na nuvem. Decisões tomadas em 2026-10-18.

---

Vamos implementar salvamento de partida, login e sincronização de progresso na nuvem no **Chronos** (`C:\Users\Usuário\Desktop\Personal\Outros\Game\chronos`). Converse comigo em português.

## Contexto do projeto

- Jogo educativo de linha do tempo, **PWA em JavaScript puro**, sem build, sem frameworks e sem npm. Publicado pelo **GitHub Pages** (`Szyfman/chronos`), que eu uso como "aplicativo" no celular.
- Todo o progresso vive hoje no `localStorage` (chaves `chronos_*`). O `sw.js` faz o cache offline e sua versão (`chronos-vN`) precisa subir a cada mudança de arquivo.
- Leia antes de propor qualquer coisa: `documentation/CLAUDE.md`, `documentation/REPOSITORY_SUMMARY.md`, `src/state.js`, `src/progression.js` e a parte de diário e fim de partida de `src/game.js`.
- **Atenção:** o `CLAUDE.md` diz "sem backend, sem contas, sem sync". Essa regra **mudou por decisão minha**. Atualize essas seções como parte do trabalho, mantendo o jogo **offline-first**: o `localStorage` continua sendo a fonte da verdade, e a nuvem é uma cópia sincronizada.

## Como vamos trabalhar

1. **Não comece a implementar antes da minha aprovação.** Primeiro analise o código e escreva uma especificação em `documentation/` (no estilo de `REVIEW_MODE.md`) com o desenho e as decisões em aberto. Eu aprovo e só então começamos.
2. Cada parte (A, B, C) é uma **fase isolada**, com seus próprios testes e commits.
3. **Fluxo:** branch a partir da `main` → teste no navegador do computador → subir a versão do `sw.js` → merge na `main` → eu testo no celular. Se não ficar bom no celular, revertemos o commit, sempre subindo a versão do `sw.js` para frente.
4. Todo texto de interface é bilíngue (en e pt), com paridade total.

## Arquitetura: módulos dedicados

O trabalho fica isolado em módulos próprios, seguindo o padrão do projeto (um arquivo por responsabilidade, com cabeçalho dizendo do que depende):

- **`src/runsave.js`** (parte A): salva e restaura a partida em andamento. Só usa o `localStorage` e não sabe que existe nuvem.
- **`src/sync.js`** (parte B): login, sessão e sincronização com o Supabase. É **o único arquivo do jogo que acessa a rede**. Fica fora dele:
  - a lógica de jogo: o `sync.js` não conhece regras do jogo;
  - qualquer referência ao Supabase em outros arquivos: o resto do jogo continua lendo e escrevendo o `localStorage` como hoje.

  O `sync.js` lê as chaves `chronos_*`, mescla, grava de volta e avisa o jogo para recarregar o estado em memória.
- A interface de login e o status da sincronização ficam em `ui.js`, chamando funções do `sync.js`, como já acontece hoje entre `ui.js` e `progression.js`.
- O esquema do banco, as políticas RLS e as Edge Functions ficam versionados no repositório (por exemplo `supabase/`), para que o servidor nunca tenha configuração que só exista no painel.
- Novos arquivos entram na lista de cache do `sw.js`. As chamadas à API do Supabase **nunca** são cacheadas pelo service worker.

## Segurança (obrigatório)

- **RLS ativo em todas as tabelas**, com cada usuário lendo e escrevendo só as próprias linhas. Nenhuma tabela fica sem política.
- **Chaves:** a `anon` (pública) pode ir para o repositório; a `service_role` nunca vai para o cliente nem para o git.
- **Dado vindo da nuvem é dado, não código.** Valide tipo e formato antes de gravar no `localStorage`, nunca insira por `innerHTML` (o nome do jogador já usa `.value`) e limite os tamanhos.
- **Sessão:** documente onde o token de login fica guardado e o risco disso (XSS). Por isso o jogo não pode ter nenhum caminho que execute HTML ou script vindo de fora.
- Se o `supabase-js` for carregado por CDN, use versão fixa com integridade (SRI) ou hospede uma cópia local.
- Ranking (parte C): a pontuação nunca é aceita direto do cliente.
- As regras de segurança acima entram no `documentation/CLAUDE.md`, que deixa de proibir backend e sync e passa a dizer **como** fazê-los com segurança. Revise todos os trechos que hoje entram em conflito:
  - "No external API calls during gameplay" e "Don't add external API calls" (em DO e DON'T);
  - a tabela "File Responsibilities" (entram `runsave.js` e `sync.js`);
  - a nota "No database or server-side state" em "Rollback Procedure";
  - os FAQs "Can I add a backend server?" e "Should I add user accounts / cloud sync?".

## Parte A — Não perder a partida em andamento (fazer primeiro, sem servidor)

**Problema:** a partida se perde quando o jogador minimiza o app, quando o sistema mata o app em segundo plano ou quando o jogador fecha o app com a partida rodando.

- Salvar o estado da partida no aparelho (baralho, linha do tempo, carta atual, pontos, sequência, vidas, dicas, pulos, modo, filtro de eras, flags da partida) a cada carta colocada e em `visibilitychange`/`pagehide`.
- Ao reabrir, oferecer "Continuar partida?" (ou retomar direto; proponha).
- A partida retomada não pode contar em dobro nada do que é contado no fim de partida (`runsPlayed`, recordes, XP, troféus, `cardStats`).
- **Diário:** fechar o app não pode virar um jeito de ganhar uma tentativa extra ou de trocar as cartas. Se proteger o diário for complexo demais, a primeira versão pode deixá-lo de fora, desde que isso seja explícito e o comportamento atual do diário não piore. Analise o comportamento atual (`_saveDailyResult`, `_dailyCommitted`, recuperação de dias passados, `chronos_recover_*`).

## Parte B — Login e sincronização entre celulares (Supabase)

**Objetivo:** fazer login em outro celular e recuperar todo o meu progresso; jogar na mesma conta em mais de um aparelho.

**Plataforma:** Supabase, no plano grátis. Confirme na documentação atual os limites do plano grátis e **como recuperar um projeto pausado** depois de 7 dias sem uso (até quando dá para restaurar, se os dados são mantidos, se existe backup). Enquanto o projeto estiver pausado ou offline, o jogo precisa continuar funcionando normalmente; a sincronização só tenta de novo depois, em silêncio.

> Lista viva das chaves, com formato e regra de mescla de cada uma: `documentation/PERSISTENCE.md`. A lista abaixo é a do briefing original (2026-10-18); desde então entrou `chronos_custom_known` (união, nunca remover), `chronos_mode_records` ganhou `bestStreak` (maior valor) e `chronos_tp_open` foi removida.

**Dados a sincronizar:** todo o progresso:
- `chronos_xp`, `chronos_trophies`, `chronos_discovered`, `chronos_card_stats`, `chronos_mode_records`, `chronos_history`, `chronos_runs_played`, `chronos_best_streak`, `chronos_custom`, `chronos_player_name`, `chronos_review_history`;
- todas as chaves `chronos_daily_*` (são a sequência do diário) e `chronos_recover_*`.

Respeite a poda feita por `chronos_prune_mark`. Preferências do aparelho (volume e mudo de música e efeitos, `chronos_placed_trivia`) ficam de fora. Proponha o que fazer com `chronos_theme` e `chronos_lang`. Confira se existe alguma chave que eu não listei.

**Mesclagem:** quando a mesma conta jogou em aparelhos diferentes (inclusive offline), os dados são **mesclados com regras por tipo de dado**, nunca "o último sobrescreve tudo". Exemplos: união de troféus, cartas descobertas e dias do diário; maior valor nos recordes. **Cuidado com contadores** (XP, `ok`/`miss` do `cardStats`, partidas jogadas): somar duplica a base comum e pegar o máximo perde progresso. Proponha uma solução correta, por exemplo contribuições por aparelho ou deltas. Cubra também:
- primeiro login num aparelho que já tem progresso local, numa conta que também já tem progresso;
- logout (o que acontece com os dados locais);
- dois aparelhos sincronizando ao mesmo tempo.

**Decisões em aberto, para propor na especificação:**
- método de login (Google, link mágico por e-mail ou ambos);
- usar `supabase-js` por CDN com versão fixa e cache no `sw.js`, ou chamar as APIs REST direto com `fetch` (sem dependência);
- quando sincronizar (fim de partida, abertura do app, voltar a ficar online);
- onde ficam o login e o status de sincronização na interface.

## Parte C — Ranking geral (futuro, não implementar agora)

O esquema do banco da parte B não pode bloquear um ranking futuro. Pontuações enviadas pelo cliente podem ser falsificadas, então o ranking vai precisar de validação no servidor (Edge Functions). Registre na especificação como a parte B deixa o caminho pronto para isso.
