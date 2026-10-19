# Supabase — Passo a passo fora do VS Code

Tudo o que precisa ser configurado em painéis web para a Parte B (login com Google e sincronização). Desenho e decisões: `CLOUD_SYNC_SPEC.md`. Feito em 2026-10 — os painéis mudam de visual com o tempo; se um botão tiver outro nome, procure pelo equivalente.

**Regra de ouro das chaves**
- Podem ir para o código e para o chat: a **Project URL** (`https://<ref>.supabase.co`), a **Publishable key** (`sb_publishable_…`) e o **Client ID** do Google (`….apps.googleusercontent.com`). São públicos por natureza; quem protege os dados são as políticas RLS.
- **Nunca** vão para o código, o git ou o chat: a **Secret key** (`sb_secret_…`), a antiga `service_role`, a **senha do banco** e o **Client secret** do Google. Guarde-os num gerenciador de senhas.

Onde aparece `<ref>` abaixo, use o identificador do seu projeto (a parte antes de `.supabase.co` na Project URL).

---

## Parte 0 — Antes de começar

- Endereço publicado do jogo: `https://szyfman.github.io/chronos/`.
- Endereço usado para testar no computador: _(anotar aqui — ex.: `http://localhost:5500/chronos/`)_. Ele entra nas listas de endereços permitidos do Google e do Supabase; abrir o `index.html` direto do disco (`file://`) não funciona com login.

## Parte 1 — Criar o projeto no Supabase

1. Abra <https://supabase.com/dashboard> e entre (recomendado: **Continue with GitHub**, com a conta `Szyfman`).
2. Se pedir uma organização: nome à escolha (ex.: `Chronos`), tipo **Personal**, plano **Free**.
3. **New project**:
   - **Name**: `chronos`
   - **Database Password**: clique em **Generate a password** e guarde no gerenciador de senhas (o jogo não usa; só serve para acesso direto ao banco).
   - **Region**: **South America (São Paulo)**.
   - Mantenha a **Data API** ligada, se a opção aparecer.
   - **Create new project** e espere 1–2 minutos.
4. Anote para o código (podem ir ao chat):
   - **Project URL** — em **Project Settings → Data API** (ou no botão **Connect**).
   - **Publishable key** — em **Project Settings → API Keys**. Se só aparecerem as chaves antigas (`anon` / `service_role`), clique para criar as novas chaves e use a **Publishable**.

## Parte 2 — Criar as tabelas

1. No menu do projeto, **SQL Editor → New query**.
2. Abra no VS Code o arquivo `supabase/migrations/0001_sync.sql`, copie todo o conteúdo e cole no editor.
3. **Run**. O esperado é *Success. No rows returned*.
4. Confira em **Table Editor**: aparecem `device_states` e `keepalive`, nenhuma marcada como **Unrestricted** (isso indicaria RLS desligado).
5. Confira em **Advisors → Security Advisor**: nenhum erro.

## Parte 3 — Login com Google

### 3.1 Google Cloud
1. Abra <https://console.cloud.google.com> com a sua conta Google.
2. No seletor de projetos (barra superior), **Novo projeto** → nome `Chronos` → **Criar** → selecione o projeto criado.
3. Menu → **Google Auth Platform** (em alguns painéis: **APIs e serviços → Tela de consentimento OAuth**) → **Primeiros passos**:
   - **Nome do app**: `Chronos`; **E-mail de suporte**: o seu.
   - **Público-alvo**: **Externo**.
   - **Informações de contato**: o seu e-mail. Aceite os termos e **Criar**.
4. **Acesso a dados** (escopos): adicione só `openid`, `…/auth/userinfo.email` e `…/auth/userinfo.profile` (não são sensíveis, não exigem verificação do Google). Salve.
5. **Público-alvo → Status de publicação → Publicar app** (fica *Em produção*). Sem isso, só e-mails cadastrados como *usuários de teste* conseguem entrar — seus amigos ficariam de fora.
6. **Clientes → Criar cliente**:
   - **Tipo de aplicativo**: **Aplicativo da Web**; nome `Chronos web`.
   - **Origens JavaScript autorizadas**: `https://szyfman.github.io` e a origem do teste local (ex.: `http://localhost:5500`).
   - **URIs de redirecionamento autorizados**: `https://<ref>.supabase.co/auth/v1/callback`.
   - **Criar**. Copie o **ID do cliente** (pode ir ao chat) e a **Chave secreta do cliente** (só para o passo 3.2; não vai ao chat).

### 3.2 Supabase
1. **Authentication → Sign In / Providers → Google** → ligue **Enable**.
2. Cole o **Client ID** e o **Client Secret** do passo anterior. Confira que a **Callback URL** mostrada é a mesma do passo 3.1.6. **Save**.
3. **Authentication → Sign In / Providers → Email** → desligue o provedor de e-mail (só Google entra; evita contas criadas por e-mail).
4. **Authentication → URL Configuration**:
   - **Site URL**: `https://szyfman.github.io/chronos/`
   - **Redirect URLs**: `https://szyfman.github.io/chronos/` e o endereço do teste local (ex.: `http://localhost:5500/chronos/`).

## Parte 4 — Despertador no GitHub (evita a pausa do projeto)

1. No repositório `Szyfman/chronos` no GitHub: **Settings → Secrets and variables → Actions → New repository secret**:
   - `SUPABASE_URL` = a Project URL
   - `SUPABASE_PUBLISHABLE_KEY` = a Publishable key
2. Depois que o workflow `.github/workflows/supabase-keepalive.yml` estiver na `main`: aba **Actions → Supabase keep-alive → Run workflow**. O esperado é um ✓ verde e, no log do passo *Touch the database*, a data e hora do ping.
3. Garanta o aviso por e-mail de falhas: no GitHub, sua foto → **Settings → Notifications → Actions** → **Email** marcado, com **Only notify for failed workflows**.

A partir daí ele roda sozinho todo dia às 08:23 (Brasília).

**Se um dia o projeto pausar** (e-mail do Supabase): dashboard → projeto → **Resume project**. Dá para restaurar com um clique por 90 dias; os dados voltam como estavam. Mesmo sem restaurar, o progresso continua inteiro em cada celular.

**Se o GitHub desligar o despertador** (60 dias sem commits no repositório): aba **Actions → Supabase keep-alive → Enable workflow**.

## Registro do que foi configurado

_(preencher conforme for feito — só informação pública)_

| Item | Valor |
|---|---|
| Project URL | |
| Região | |
| Publishable key criada em | |
| Google Client ID | |
| Endereço de teste local | |
| Despertador testado em | |
