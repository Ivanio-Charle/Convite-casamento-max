# Convite Digital de Casamento — Daniel & Sofia

> **Projecto Demonstrativo Oficial — Charle Convites**  
> Experiência digital interactiva, editorial e responsiva para convites de casamento de segmento *premium*.

---

## 1. Descrição do Projecto

Este website apresenta o convite digital demonstrativo do casamento de **Daniel António & Sofia Martins** (**19 de Dezembro de 2026**, Beira, Moçambique), concebido para representar o padrão visual, técnico e interactivo da marca **Charle Convites**.

Principais funcionalidades implementadas:

- **Abertura com Envelope Digital 3D**: Envelope interactivo com selo de lacre dourado e monograma **D & S**, animação suave de abertura e revelação progressiva do convite.
- **Hero Editorial & Narrativa Romântica**: Fotografia em grande destaque, tipografia serifada clássica (*Cormorant Garamond*) conjugada com *Montserrat*, mensagem principal e história do casal.
- **Contagem Decrescente Real**: *Countdown* sincronizado com o fuso horário de Moçambique (`Africa/Maputo`, `UTC+02:00`) até **19 de Dezembro de 2026 às 14h30**, incluindo mensagem celebrativa automática quando a data é atingida.
- **Programação & Como Chegar**: Cartões elegantes para a **Cerimónia** (*Catedral da Beira*, 14h30) e **Recepção** (*Jardim das Acácias*, 17h00), com mapa interactivo incorporado e atalhos de pesquisa nominal no Google Maps (identificados como locais demonstrativos, sem coordenadas inventadas).
- **Álbum Editorial com Lightbox**: Galeria *"Os nossos momentos"* utilizando exclusivamente as fotografias disponibilizadas no projecto, com proporções variadas, navegação por teclado (`←`, `→`, `Esc`), gestos tácteis (*swipe*) em telemóveis e fecho rápido.
- **Leitor de Música Discreto**: Botão flutuante com indicador sonoro animado, reprodução/pausa e controlo de volume contínuo durante toda a navegação, sem reprodução automática forçada antes da interacção do convidado.
- **Confirmação de Presença (RSVP) com PostgreSQL + Prisma ORM**: Validação rigorosa no cliente e no servidor (*Zod*), campos dinâmicos de acompanhantes, protecção contra submissões duplicadas (chave de idempotência + normalização de números de Moçambique `+258`), persistência relacional (`Rsvp` + `Guest`) compatível com **Neon PostgreSQL** e **Cloudflare Workers**.

---

## 2. Tecnologias Utilizadas

- **Framework**: Next.js 15 (App Router) + React 19
- **Linguagem**: TypeScript (modo estrito)
- **Estilização**: Tailwind CSS 3.4 + CSS Custom Properties + Google Fonts (`Cormorant Garamond` & `Montserrat`)
- **ORM & Base de Dados**: Prisma ORM 6 + `@prisma/adapter-neon` (`@neondatabase/serverless`) + `@prisma/adapter-pg` (`pg`)
- **Validação & Segurança**: Zod, *rate-limiting* por IP, *honeypot* anti-spam e autenticação por *token* (`timingSafeEqual`) na consulta administrativa
- **Ícones & Ornamentos**: Lucide React + ilustrações botânicas e monogramas vectoriais em SVG
- **Publicação Edge**: Preparado para Cloudflare Workers via `@opennextjs/cloudflare` e `wrangler.jsonc`

---

## 3. Estrutura do Projecto

```text
public/
  audio/                  # Ficheiro de música oficial do casal (detectado automaticamente)
  icons/                  # Monograma SVG (favicon)
  images/
    couple/               # Fotografias optimizadas de alta resolução do casal
prisma/
  schema.prisma           # Modelos relacionais Rsvp e Guest (PostgreSQL)
src/
  app/
    api/
      health/route.ts     # Verificação de estado dos serviços configurados
      rsvp/route.ts       # API REST (POST público validado / GET administrativo protegido)
    marca/page.tsx        # Página institucional placeholder da Charle Convites
    globals.css           # Estilos globais e textura editorial
    layout.tsx            # Tipografia, SEO e metadados OpenGraph (WhatsApp)
    page.tsx              # Página principal (descoberta de áudio e estado da BD)
  components/
    invitation/           # Componentes independentes de cada secção do convite
    ornaments/            # Elementos florais minimalistas, divisores e selo de lacre
  lib/
    validations/rsvp.ts   # Esquemas Zod partilhados e normalização telefónica (+258)
    audio-discovery.ts    # Detecção automática do ficheiro de áudio fornecido
    prisma.ts             # Cliente Prisma com suporte Neon Serverless e PostgreSQL standard
    rate-limit.ts         # Limitação de pedidos por IP
    wedding-data.ts       # Textos, datas, locais e catálogo fotográfico
  services/
    rsvp-service.ts       # Lógica transaccional de criação e listagem de confirmações
  types/
    wedding.ts            # Interfaces TypeScript do domínio
```

---

## 4. Instalação e Execução Local

### Pré-requisitos

- **Node.js** `>= 20.x`
- **npm** `>= 10.x`

### Passos

1. Instale as dependências do projecto:

   ```bash
   npm install
   ```

2. Gere o cliente Prisma:

   ```bash
   npm run db:generate
   ```

3. Copie o ficheiro de exemplo de variáveis de ambiente (caso `.env` ainda não exista):

   ```bash
   cp .env.example .env
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Abra `http://localhost:3000` no navegador (ou teste em modo móvel nas ferramentas de programador).

---

## 5. Como Adicionar ou Actualizar Fotografias

1. Coloque as fotografias optimizadas (`.jpg`, `.webp` ou `.avif`, recomendado até `2000px` no lado maior para carregamento rápido via WhatsApp) na pasta:

   ```text
   public/images/couple/
   ```

2. Registe ou actualize os caminhos, dimensões (`width`, `height`) e legendas em `src/lib/wedding-data.ts` (`WEDDING_DATA.heroPhoto`, `WEDDING_DATA.storyPhoto` e `GALLERY_PHOTOS`).

---

## 6. Como Adicionar Música de Fundo

O leitor de música foi concebido para utilizar **exclusivamente o ficheiro fornecido pelo cliente**, sem substituir por músicas aleatórias.

1. Copie o ficheiro de áudio (formatos suportados: `.mp3`, `.m4a`, `.ogg`, `.wav`, `.aac` ou `.webm`) para a pasta:

   ```text
   public/audio/
   ```
   *(Exemplo: `public/audio/musica-casamento.mp3`)*

2. Em execução local/Node.js, a aplicação detecta automaticamente o ficheiro colocado em `public/audio/`.
3. Para ambientes *edge* (como **Cloudflare Workers**), defina também o caminho público no `.env`:

   ```env
   NEXT_PUBLIC_AUDIO_URL="/audio/musica-casamento.mp3"
   ```

---

## 7. Configurar PostgreSQL / Neon PostgreSQL e Migrações Prisma

A aplicação **nunca simula confirmações guardadas** em memória ou `localStorage`. Enquanto `DATABASE_URL` não estiver configurada, o formulário informa de forma transparente que a base de dados aguarda configuração.

### Ligar ao Neon PostgreSQL (Recomendado)

1. Crie uma conta gratuita em [https://neon.tech](https://neon.tech) e crie um novo projecto PostgreSQL.
2. No painel do Neon, copie a **Connection String** (com `sslmode=require`).
3. Abra o ficheiro `.env` na raiz do projecto e preencha:

   ```env
   DATABASE_URL="postgresql://utilizador:password@ep-exemplo-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require"
   RSVP_ADMIN_TOKEN="gere-aqui-um-token-secreto-forte-com-pelo-menos-32-caracteres"
   ```

4. Execute a migração inicial do Prisma para criar as tabelas `rsvps` e `guests`:

   ```bash
   npm run db:migrate -- --name init_rsvp
   ```

   Em ambientes de produção/CI, utilize:

   ```bash
   npm run db:deploy
   ```

5. *(Opcional)* Para visualizar os dados numa interface gráfica local:

   ```bash
   npm run db:studio
   ```

### Consultar Confirmações via API (`GET /api/rsvp`)

A rota de leitura encontra-se protegida por `RSVP_ADMIN_TOKEN` para salvaguardar a privacidade dos convidados:

```bash
curl -H "Authorization: Bearer SEU_RSVP_ADMIN_TOKEN" http://localhost:3000/api/rsvp
```

---

## 8. Preparação e Publicação no Cloudflare Workers

O projecto está estruturado com `wrangler.jsonc` (`nodejs_compat`) e `@prisma/adapter-neon` (comunicação serverless sobre HTTPS/WebSockets compatível com o runtime do Cloudflare Workers):

1. Certifique-se de que `CLOUDFLARE_WORKERS="true"` está definido nas variáveis de `wrangler.jsonc` (já pré-configurado).
2. Registe os segredos de produção no Cloudflare Workers:

   ```bash
   npx wrangler secret put DATABASE_URL
   npx wrangler secret put RSVP_ADMIN_TOKEN
   ```

3. Gere a compilação OpenNext para Cloudflare Workers:

   ```bash
   npm run cf:build
   ```

4. Pré-visualize localmente no runtime `workerd` ou publique:

   ```bash
   npm run cf:preview
   # ou para publicar na sua conta Cloudflare:
   npm run cf:deploy
   ```

---

## 9. Estado Actual de Credenciais e Ficheiros Externos

Para total transparência técnica:

| Recurso | Estado Actual | Como Activar |
| :--- | :--- | :--- |
| **Fotografias do Casal** | Activo (7 fotografias reais optimizadas em `public/images/couple/`) | Pronto a utilizar |
| **Base de Dados (Neon / PostgreSQL)** | Arquitectura Prisma + rotas API concluídas; aguarda `DATABASE_URL` real | Preencher `DATABASE_URL` no `.env` e correr `npm run db:migrate` |
| **Consulta Admin (`GET /api/rsvp`)** | Protegida; aguarda `RSVP_ADMIN_TOKEN` | Definir `RSVP_ADMIN_TOKEN` no `.env` |
| **Música de Fundo** | Leitor e controlos concluídos; aguarda ficheiro `.mp3` em `public/audio/` | Colocar o ficheiro de áudio oficial em `public/audio/` |
| **Página Institucional Charle Convites** | Placeholder activo em `/marca` | Opcionalmente definir `NEXT_PUBLIC_CHARLE_CONVITES_URL` no `.env` |
