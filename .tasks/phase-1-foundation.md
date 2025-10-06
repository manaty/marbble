# Phase 1: Foundation & Setup

**Duration**: 2-3 weeks
**Status**: Not Started
**Dependencies**: None

---

## Overview

Set up the modern development environment and infrastructure for the Marbble rewrite. This phase establishes the foundation for all subsequent development work.

---

## Goals

- [ ] Complete development environment setup
- [ ] Supabase project configured with database schema
- [ ] CI/CD pipelines operational
- [ ] Documentation structure in place

---

## Tasks

### 1. Frontend Setup (3-4 days)

- [ ] **1.1** Initialize SvelteKit project
  ```bash
  npm create svelte@latest marbble-frontend
  cd marbble-frontend
  npm install
  ```
  - Choose: Skeleton project, TypeScript, ESLint, Prettier, Playwright, Vitest

- [ ] **1.2** Configure TypeScript
  - Update `tsconfig.json` with strict mode
  - Add path aliases (`$lib`, `$components`, `$stores`)

- [ ] **1.3** Install core dependencies
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npm install @supabase/supabase-js
  npm install @neodrag/svelte
  npm install socket.io-client
  ```

- [ ] **1.4** Configure TailwindCSS
  - Initialize Tailwind config
  - Add custom game theme colors (board, tiles)
  - Set up typography plugin

- [ ] **1.5** Set up project structure
  ```
  src/
  ├── lib/
  │   ├── components/     # Svelte components
  │   ├── stores/         # Svelte stores
  │   ├── services/       # Business logic
  │   ├── types/          # TypeScript types
  │   └── utils/          # Helper functions
  ├── routes/             # SvelteKit routes
  └── app.html            # HTML template
  ```

### 2. Backend Setup (3-4 days)

- [ ] **2.1** Create NestJS project
  ```bash
  npm i -g @nestjs/cli
  nest new marbble-backend
  cd marbble-backend
  ```

- [ ] **2.2** Set up monorepo structure (optional)
  - Consider Nx or Turborepo for shared code
  - Configure workspace with frontend + backend

- [ ] **2.3** Install NestJS dependencies
  ```bash
  npm install @nestjs/websockets @nestjs/platform-socket.io
  npm install @supabase/supabase-js
  npm install @nestjs/config
  npm install class-validator class-transformer
  npm install @nestjs/swagger
  ```

- [ ] **2.4** Create module structure
  ```
  src/
  ├── game/               # Game module
  ├── wordlist/           # Wordlist module
  ├── dictionary/         # Dictionary module
  ├── multiplayer/        # Multiplayer module
  ├── auth/               # Auth module
  └── common/             # Shared utilities
  ```

- [ ] **2.5** Configure environment variables
  - Create `.env.example`
  - Set up `@nestjs/config` with validation
  - Add Supabase credentials

### 3. Supabase Configuration (2-3 days)

- [ ] **3.1** Create Supabase project
  - Sign up at [supabase.com](https://supabase.com)
  - Create project: `marbble-dev`
  - Note: API URL, anon key, service_role key

- [ ] **3.2** Set up environments
  - Development project
  - Staging project (optional)
  - Production project (for later)

- [ ] **3.3** Configure database schema
  - Run SQL migration scripts
  - Create tables: `games`, `game_players`, `game_moves`
  - Create tables: `wordlists`, `dictionaries`
  - Set up indexes (GIN for word arrays)

- [ ] **3.4** Configure Row Level Security (RLS)
  - Enable RLS on all tables
  - Create policies for user access
  - Test policies with different user roles

- [ ] **3.5** Set up Supabase Auth
  - Configure email/password authentication
  - Enable magic link authentication
  - Configure OAuth providers (Google, Apple - optional)
  - Set up email templates

- [ ] **3.6** Configure Supabase Storage
  - Create buckets for: avatars, game-assets
  - Set up storage policies
  - Configure CDN settings

### 4. Database Schema Implementation (2 days)

- [ ] **4.1** Create migration file: `001_initial_schema.sql`
  ```sql
  -- See ROADMAP.md for full schema
  ```

- [ ] **4.2** Implement core tables
  - `games` table with status and mode
  - `game_players` with language support
  - `game_moves` with move history

- [ ] **4.3** Implement dictionary tables
  - `wordlists` with GIN indexed arrays
  - `dictionaries` with translation mappings

- [ ] **4.4** Create database functions
  - `validate_word(language, word)` → boolean
  - `get_player_score(game_id, player_id)` → integer
  - `get_board_state(game_id)` → jsonb

- [ ] **4.5** Add triggers
  - Update `updated_at` timestamp on row changes
  - Validate move before insert
  - Update game status after move

### 5. Capacitor Setup (1-2 days)

- [ ] **5.1** Initialize Capacitor in frontend
  ```bash
  cd marbble-frontend
  npm install @capacitor/core @capacitor/cli
  npx cap init
  ```

- [ ] **5.2** Add platforms
  ```bash
  npm install @capacitor/android @capacitor/ios
  npx cap add android
  npx cap add ios
  ```

- [ ] **5.3** Install Capacitor plugins
  ```bash
  npm install @capacitor/filesystem
  npm install @capacitor/device
  npm install @capacitor/browser
  npm install @capacitor/splash-screen
  npm install @capacitor/status-bar
  npm install @capacitor/screen-orientation
  ```

- [ ] **5.4** Configure capacitor.config.ts
  - Set app ID, name, web dir
  - Configure server URL for development

- [ ] **5.5** Test on device/emulator
  ```bash
  npm run build
  npx cap sync
  npx cap open android  # or ios
  ```

### 6. CI/CD Pipeline (2-3 days)

- [ ] **6.1** Create GitHub Actions workflows
  - `.github/workflows/frontend-ci.yml`
  - `.github/workflows/backend-ci.yml`

- [ ] **6.2** Frontend CI pipeline
  - Checkout code
  - Install dependencies
  - Run linting (ESLint)
  - Run type checking (tsc)
  - Run unit tests (Vitest)
  - Build application

- [ ] **6.3** Backend CI pipeline
  - Checkout code
  - Install dependencies
  - Run linting (ESLint)
  - Run unit tests (Jest)
  - Build application

- [ ] **6.4** Configure deployment
  - Frontend: Vercel or Netlify
  - Backend: Railway, Render, or Fly.io
  - Set up environment variables
  - Configure preview deployments

- [ ] **6.5** Add code quality checks
  - Code coverage reporting (Codecov)
  - Dependency scanning (Dependabot)
  - Security scanning (Snyk)

### 7. Development Tooling (1-2 days)

- [ ] **7.1** Configure ESLint
  - Shared ESLint config for frontend/backend
  - TypeScript rules
  - Svelte plugin for frontend
  - Prettier integration

- [ ] **7.2** Configure Prettier
  - Consistent code formatting rules
  - Integrate with ESLint
  - Add pre-commit hook

- [ ] **7.3** Set up Git hooks with Husky
  ```bash
  npm install -D husky lint-staged
  npx husky init
  ```
  - Pre-commit: Run linting and formatting
  - Pre-push: Run tests

- [ ] **7.4** Configure VS Code workspace
  - Create `.vscode/settings.json`
  - Recommended extensions list
  - Debug configurations

- [ ] **7.5** Set up Docker for local development (optional)
  - `Dockerfile` for frontend
  - `Dockerfile` for backend
  - `docker-compose.yml` for full stack
  - PostgreSQL container (alternative to Supabase)

### 8. Documentation Setup (1 day)

- [ ] **8.1** Create documentation structure
  ```
  docs/
  ├── architecture/
  ├── api/
  ├── development/
  ├── deployment/
  └── user-guide/
  ```

- [ ] **8.2** Write development guide
  - Environment setup instructions
  - How to run locally
  - How to run tests
  - Code contribution guidelines

- [ ] **8.3** Set up API documentation
  - Configure Swagger/OpenAPI in NestJS
  - Add JSDoc comments to endpoints
  - Generate API docs automatically

- [ ] **8.4** Create project README
  - Project overview
  - Tech stack
  - Quick start guide
  - Links to detailed docs

---

## Deliverables

### Code
- [ ] SvelteKit frontend boilerplate with TypeScript
- [ ] NestJS backend boilerplate with modules
- [ ] Capacitor configuration for iOS/Android
- [ ] Database schema in Supabase

### Infrastructure
- [ ] Supabase projects (dev/staging/prod)
- [ ] CI/CD pipelines configured
- [ ] Development environment automated setup

### Documentation
- [ ] Development setup guide
- [ ] Architecture documentation
- [ ] API documentation foundation
- [ ] Updated project README

---

## Acceptance Criteria

- [ ] Frontend runs locally with `npm run dev`
- [ ] Backend runs locally with `npm run start:dev`
- [ ] Can authenticate with Supabase
- [ ] Can query database from frontend/backend
- [ ] CI pipeline passes for both frontend and backend
- [ ] Can build for Android/iOS with Capacitor
- [ ] All environment variables documented
- [ ] Team members can set up locally in < 30 minutes

---

## Resources

### Documentation
- [SvelteKit Setup](https://kit.svelte.dev/docs/creating-a-project)
- [NestJS First Steps](https://docs.nestjs.com/first-steps)
- [Supabase Quickstart](https://supabase.com/docs/guides/getting-started)
- [Capacitor Setup](https://capacitorjs.com/docs/getting-started)

### Tools
- [SvelteKit CLI](https://kit.svelte.dev/docs/cli)
- [NestJS CLI](https://docs.nestjs.com/cli/overview)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Capacitor CLI](https://capacitorjs.com/docs/cli)

---

## Notes

- **Database Choice**: Using Supabase for managed PostgreSQL. Can switch to self-hosted if needed.
- **Monorepo**: Consider Nx or Turborepo if shared code between frontend/backend grows.
- **Mobile Testing**: Set up Android Studio and Xcode early for device testing.
- **Environment Parity**: Keep dev, staging, and production environments as similar as possible.

---

## Next Phase

Once Phase 1 is complete, proceed to [Phase 2: Core Game Logic Migration](.tasks/phase-2-game-logic.md).
