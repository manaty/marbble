# Marbble Rewrite Roadmap

## Project Overview

Complete migration of Marbble from legacy technologies to a modern, scalable stack.

### Migration Summary

**From:**
- Vanilla JavaScript + Cordova
- Java JAX-RS backend
- LocalStorage + file-based data

**To:**
- SvelteKit + TypeScript
- NestJS backend
- Supabase (PostgreSQL + Auth + Realtime)
- Capacitor for mobile

---

## Timeline

**Total Duration**: 18-26 weeks (4.5-6.5 months)

| Phase | Duration | Focus | Details |
|-------|----------|-------|---------|
| **Phase 1** | 2-3 weeks | Foundation & Setup | [→ Tasks](.tasks/phase-1-foundation.md) |
| **Phase 2** | 4-6 weeks | Core Game Logic Migration | [→ Tasks](.tasks/phase-2-game-logic.md) |
| **Phase 3** | 3-4 weeks | Backend Services | [→ Tasks](.tasks/phase-3-backend.md) |
| **Phase 4** | 2-3 weeks | Dictionary & Wordlist Migration | [→ Tasks](.tasks/phase-4-dictionaries.md) |
| **Phase 5** | 3-4 weeks | Multiplayer & Realtime | [→ Tasks](.tasks/phase-5-multiplayer.md) |
| **Phase 6** | 2-3 weeks | Mobile & PWA | [→ Tasks](.tasks/phase-6-mobile-pwa.md) |
| **Phase 7** | 2-3 weeks | Testing & Polish | [→ Tasks](.tasks/phase-7-testing.md) |

> **📁 Detailed Tasks**: See [.tasks/](.tasks/) directory for comprehensive task breakdowns, code examples, and acceptance criteria for each phase.

---

## Architecture

### System Diagram

```
┌─────────────────────────────────────┐
│   SvelteKit Frontend (TypeScript)   │
│   • Svelte Components               │
│   • Stores (State Management)       │
│   • Services (Business Logic)       │
└──────────────┬──────────────────────┘
               │ REST + WebSocket
┌──────────────▼──────────────────────┐
│   NestJS Backend (TypeScript)       │
│   • Game/Wordlist/Auth Modules      │
│   • WebSocket Gateway               │
│   • Caching Layer                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Supabase                          │
│   • PostgreSQL Database             │
│   • Authentication (JWT)            │
│   • Realtime Subscriptions          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   Mobile: iOS & Android (Capacitor) │
└─────────────────────────────────────┘
```

### Database Schema

```sql
-- Core tables
games           -- Game instances (mode, status, players)
game_players    -- Player participation (language, score, tiles)
game_moves      -- Move history (tiles, words, score)
wordlists       -- Word validation (language → words[])
dictionaries    -- Translations (from_lang, to_lang, word → translations)

-- Features
- Row Level Security (RLS) for access control
- GIN indexes for fast word lookup
- Real-time subscriptions for live updates
```

**Full schema**: See [Phase 1 tasks](.tasks/phase-1-foundation.md#database-schema)

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | SvelteKit | 2.x |
| | TypeScript | 5.x |
| | TailwindCSS | 3.x |
| **Backend** | NestJS | 10.x |
| | Node.js | 20.x LTS |
| **Database** | Supabase PostgreSQL | Latest |
| **Mobile** | Capacitor | 5.x |
| **DevOps** | GitHub Actions / Vercel / Railway | - |

**Full stack details**: See [ROADMAP Technology Stack](#technology-stack-details)

---

## Key Migration Mappings

### Frontend
```
www/js/gui/gameComponent.js  →  src/lib/components/GameBoard.svelte
www/js/model/game.js         →  src/lib/stores/gameStore.ts
www/js/controler/*.js        →  src/lib/services/*.ts
```

### Backend
```
java/MarbbleRestService.java →  NestJS Game/Multiplayer modules
www/js/wordlist/*.js         →  Supabase wordlists table
www/js/dic/*.js             →  Supabase dictionaries table
```

### Mobile
```
Cordova plugins             →  Capacitor equivalents
config.xml                  →  capacitor.config.ts
```

---

## Success Criteria

### Technical Metrics
- ✅ 80%+ test coverage
- ✅ Lighthouse score: 90+ (all categories)
- ✅ API response: < 100ms (p95)
- ✅ Word validation: < 10ms
- ✅ Support 1000+ concurrent users

### User Metrics
- ✅ Zero data loss during migration
- ✅ Maintain/improve app store ratings
- ✅ Positive feedback on new UX

### Business Goals
- ✅ Deploy to production within 6 months
- ✅ Migrate 95%+ of active users
- ✅ Enable new features not possible before

---

## Key Benefits

| Benefit | Description |
|---------|-------------|
| **Performance** | SSR, code splitting, optimized bundles → faster loads |
| **Developer Experience** | TypeScript, HMR, better tooling → faster development |
| **Scalability** | Supabase auto-scaling, row-level security → secure & scalable |
| **User Experience** | Native feel, offline support, PWA → better engagement |
| **Maintainability** | Type safety, clear architecture → easier to maintain |
| **Future-Proof** | Modern stack, active communities → long-term viability |

---

## Risk Mitigation

| Risk | Mitigation Strategy |
|------|---------------------|
| **Learning Curve** | Training, POCs, comprehensive docs |
| **Data Migration** | Thorough testing, rollback plans |
| **Performance Issues** | Benchmarking, profiling, optimization |
| **User Disruption** | Phased rollout, parallel deployment |

---

## Architecture Decisions

### ADR-001: Frontend Framework
**Decision**: SvelteKit
**Why**: Smaller bundles, better performance, simpler state management, SSR built-in

### ADR-002: Backend Framework
**Decision**: NestJS
**Why**: TypeScript-first, modular, excellent DI, great docs

### ADR-003: Database & Auth
**Decision**: Supabase
**Why**: Open-source, PostgreSQL, real-time built-in, row-level security

### ADR-004: Mobile Framework
**Decision**: Capacitor
**Why**: Cordova successor, minimal migration, official plugins

### ADR-005: Multiplayer Architecture
**Decision**: Server-authoritative with Supabase Realtime
**Why**: Better security, simpler implementation, easier to scale

---

## Getting Started

### Phase 1 Quick Start

```bash
# Frontend
npm create svelte@latest marbble-frontend
cd marbble-frontend && npm install

# Backend
nest new marbble-backend
cd marbble-backend && npm install

# Supabase
# Visit https://supabase.com and create new project
```

### Resources

**Documentation**
- [SvelteKit](https://kit.svelte.dev/docs)
- [NestJS](https://docs.nestjs.com)
- [Supabase](https://supabase.com/docs)
- [Capacitor](https://capacitorjs.com/docs)

**Learning**
- [SvelteKit Tutorial](https://learn.svelte.dev)
- [NestJS Fundamentals](https://www.youtube.com/watch?v=GHTA143_b-s)
- [Supabase Course](https://www.youtube.com/watch?v=7uKQBl9uZ00)

**Community**
- [Svelte Discord](https://svelte.dev/chat)
- [NestJS Discord](https://discord.gg/nestjs)
- [Supabase Discord](https://discord.supabase.com)

---

## Next Steps

1. ✅ **Review & Approve**: Stakeholder sign-off on timeline and approach
2. 📋 **Team Formation**: Assign developers to phases/modules
3. 🔧 **Environment Setup**: Create Supabase projects (dev/staging/prod)
4. 🚀 **Kickoff Phase 1**: Begin foundation setup → [Phase 1 Tasks](.tasks/phase-1-foundation.md)
5. 📊 **Regular Reviews**: Weekly progress meetings, bi-weekly demos

---

**Status**: Planning Phase
**Last Updated**: 2025-10-06
**Maintainer**: Development Team

> 📖 **For detailed task breakdowns**, see the [.tasks/](.tasks/) directory
