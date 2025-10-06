# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marbble is a free multilingual word game - the first of its kind - where players can compete across different languages (e.g., an English player vs a French player).

### Current Status: Migration in Progress

**⚠️ IMPORTANT**: This project is undergoing a complete rewrite to modern technologies. See [ROADMAP.md](ROADMAP.md) for the migration plan.

**Legacy Stack (Current):**
- Apache Cordova (hybrid mobile framework)
- Vanilla JavaScript (ES5/ES6) for frontend
- Java with JAX-RS/RESTEasy for backend
- Maven for Java builds
- Platforms: Android, iOS, Browser

**Target Stack (Migration):**
- SvelteKit + TypeScript (frontend)
- NestJS + TypeScript (backend)
- Supabase (PostgreSQL + Auth + Realtime)
- Capacitor (mobile)

📋 **Migration Details**: See [ROADMAP.md](ROADMAP.md) and [.tasks/](.tasks/) directory for detailed implementation plan.

## Architecture

### Frontend Structure (www/ and src/)

The frontend follows an MVC-like architecture split across multiple directories:

**Model** (`www/js/model/`):
- `game.js` - Core game logic, board state (225 cells), word validation
- `player.js` - Player data and state
- `tile.js` - Letter tiles with language-specific values
- `bag.js` - Letter bag management
- `application.js` - App-level state

**Controller** (`www/js/controler/`):
- `gameControler.js` - Main game flow, move validation, scoring
- `playerControler.js` - Player interactions and turns
- `bagControler.js` - Tile distribution logic
- `soundControler.js` - Audio feedback

**View/GUI** (`www/js/gui/`):
- `gameComponent.js` - Game board rendering (~2900 lines)
- `playerComponent.js` - Player UI elements
- `tileComponent.js` - Tile rendering and drag-drop

**Entry Points:**
- `www/index.html` - Landing page with language detection
- `www/html/game.html` or `src/index.html` - Main game interface
- `www/js/main.js` - Game initialization and menu system (~4400 lines)
- `www/js/marbble.js` - Game bootstrap logic

### Language & Dictionary System

**Word Lists** (`www/js/wordlist/`):
- Per-language word validation lists (en, fr, es, tl/Filipino, de, it, pt)
- Large wordlist files at root (e.g., `de_wordlist.js`, `de_cachelist.js`)

**Dictionaries** (`www/js/dic/`):
- Translation dictionaries between language pairs (e.g., `en_fr.js`, `fr_en.js`)
- Full dictionary files in `www/js/dic/full_*`

**Dictionary Tools** (`dictool/`):
- Java tool for processing dictionary files
- `DictProcessor.java` - Main processing logic
- `DictXMLHandler.java` - XML parsing

### Backend Components

**Java Backend** (`java/` and `marbble/`):
- `MarbbleRestService.java` - REST API endpoints
- `MarbbleApplication.java` - Application configuration
- `Signaling.java` - WebRTC signaling for peer-to-peer
- `PeerMisc.java` - Peer connection utilities
- Packaged as WAR file for deployment

**Build:** Maven-based (`pom.xml` in java/, marbble/, dictool/)

### Game Modes

1. **Marbble Mode** (TYPE_MARBBLE = 1): Multilingual - each player has language-specific tile bag
2. **Classic Mode** (TYPE_CLASSIC = 0): Monolingual - shared tile bag
3. **Open & Collaborative** (in development): Community-validated words

### Supporting Files

- `www/js/misc/` - Utility functions:
  - `gameSaveMisc.js` - Save/load game state
  - `definitionMisc.js` - Word definitions/translations
  - `peerMisc.js` - Peer-to-peer game logic
  - `misc.js` - General utilities

- `www/js/utils/` - Helper utilities:
  - `saveUtils.js` - LocalStorage operations
  - `dateUtils.js` - UUID generation, timestamps

## Common Commands

### Cordova Build & Development

```bash
# Add platform (if not already added)
cordova platform add android
cordova platform add ios
cordova platform add browser

# Build for specific platform
cordova build android
cordova build ios
cordova build browser

# Run in browser for testing
cordova run browser

# Build for production (Android)
cordova build android --release

# Emulate on device
cordova emulate android
cordova emulate ios
```

### Java Backend

```bash
# Build backend (from java/ or marbble/ directory)
cd marbble && mvn clean package
cd java && mvn clean package

# Build dictionary tool
cd dictool && mvn clean package

# Run tests
mvn test
```

### Cordova Plugins

The app uses several Cordova plugins (see `config.xml`):
- cordova-plugin-file
- cordova-plugin-globalization
- cordova-plugin-inappbrowser
- cordova-plugin-splashscreen
- cordova-plugin-statusbar
- cordova-plugin-screen-orientation

Install plugins: `cordova plugin add <plugin-name>`

## Development Notes

### Code Style
- Frontend uses ES5/ES6 JavaScript with Babel-style class transformations
- Uses `"use strict"` mode throughout
- Drag-and-drop implemented with Dragula library (`www/lib/dragula.js`)

### Game State Management
- Games saved to localStorage via `gameSaveMisc.js`
- Each game has unique UUID (`gameId`)
- Game status: STATUS_NEW (0), STATUS_ONGOING (1), STATUS_ENDED (2)
- Board is 15x15 grid (225 cells, array index 0-224)

### Word Validation Flow
1. Player places tiles on board
2. `gameControler.js` validates word formation (horizontal/vertical)
3. Checks against language-specific wordlist
4. Calculates score with multipliers (Double Letter, Triple Word, etc.)
5. Updates game state and switches turns

### Multiplayer Architecture
- WebRTC signaling server for peer-to-peer connections
- REST API endpoints in Java backend
- Peer communication via `peerMisc.js`

### Key Global Variables
- `gameControler` - Main game controller instance
- `tileDragula` - Dragula instance for drag-drop
- `sound` - Sound controller
- `g_wstr` - Word strings array
- `g_letscore` - Letter scoring object

### Language Support
Currently supported languages (LANG object in game.js):
- "en": English
- "fr": French
- "es": Spanish
- "tl": Filipino

In development: German, Italian, Portuguese

## File Organization

- `/www` - Web assets and main game code
- `/src` - Cordova source files (minimal HTML/CSS/JS)
- `/platforms` - Cordova platform-specific builds (android, ios)
- `/plugins` - Cordova plugins
- `/java` or `/marbble` - Java backend (JAX-RS REST service)
- `/dictool` - Dictionary processing tool
- `/jscrab` - Additional game variant/tool
- Root: Large wordlist/dictionary files for processing

---

## Testing Requirements

**🚨 CRITICAL: All code changes MUST pass comprehensive testing before commit.**

### Pre-Commit Testing Protocol

Before committing ANY code changes, you MUST run and pass ALL of the following tests:

#### 1. Unit Tests
```bash
# Frontend (Vitest)
npm run test:unit

# Backend (Jest)
npm run test

# Target: 80%+ coverage
# All tests must pass
```

#### 2. Integration Tests
```bash
# API integration tests
npm run test:integration

# Database integration tests
npm run test:db

# All endpoints and services must be tested
```

#### 3. End-to-End Tests
```bash
# E2E tests (Playwright)
npm run test:e2e

# Test critical user flows:
# - Game creation and joining
# - Tile placement and moves
# - Score calculation
# - Multiplayer sync
```

#### 4. Full UI Tests
```bash
# Component tests
npm run test:ui

# Visual regression tests (if configured)
npm run test:visual

# Accessibility tests
npm run test:a11y
```

#### 5. Performance Tests
```bash
# Lighthouse CI
npm run test:performance

# Bundle size check
npm run test:bundle

# Load time benchmarks
npm run test:load

# Targets:
# - Lighthouse score: 90+
# - Bundle size: < 200KB initial
# - API response: < 100ms (p95)
```

### Test Execution Order

1. **Unit tests** (fast, run first)
2. **Integration tests** (medium speed)
3. **E2E tests** (slower, comprehensive)
4. **UI/Visual tests** (visual validation)
5. **Performance tests** (final validation)

### Pre-Commit Checklist

Before running `git commit`:

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] All UI tests pass
- [ ] Performance benchmarks met
- [ ] No console errors or warnings
- [ ] Code coverage ≥ 80%
- [ ] TypeScript compilation successful (no errors)
- [ ] Linting passed (ESLint)
- [ ] Formatting applied (Prettier)

### Automated Testing (CI/CD)

All tests run automatically on:
- **Pre-commit hook** (Husky): Unit tests + linting
- **Pre-push hook**: Full test suite
- **Pull Request**: Complete test suite + coverage report
- **Main branch merge**: Full suite + deployment tests

### Test Failure Policy

**❌ If ANY test fails:**
1. DO NOT commit the code
2. Fix the failing test or code
3. Re-run the full test suite
4. Only commit when all tests pass

**⚠️ Never skip or disable tests to make commits pass.**

### Quick Test Commands

```bash
# Run all tests (comprehensive)
npm run test:all

# Run tests in watch mode (during development)
npm run test:watch

# Run specific test file
npm run test -- path/to/test.spec.ts

# Generate coverage report
npm run test:coverage
```

---

## Code Quality Standards

### Before Every Commit

1. **Write Tests First** (TDD recommended)
   - Write failing test
   - Implement feature
   - Ensure test passes
   - Refactor if needed

2. **Test Coverage**
   - Minimum 80% code coverage
   - 100% for critical game logic
   - Cover edge cases and error scenarios

3. **Performance**
   - Profile performance-critical code
   - Optimize before committing
   - Run performance tests

4. **Documentation**
   - Update relevant docs
   - Add JSDoc comments
   - Update ROADMAP/task files if applicable

### Example Pre-Commit Flow

```bash
# 1. Make code changes
# 2. Write/update tests
npm run test:watch  # Develop with tests

# 3. Run full test suite
npm run test:all

# 4. Check coverage
npm run test:coverage

# 5. Run linting and formatting
npm run lint
npm run format

# 6. Commit only if all pass
git add .
git commit -m "feat: add tile validation logic"
# (Husky pre-commit hook runs automatically)

# 7. Push (triggers pre-push tests)
git push
```

---

## Migration Development Guidelines

When working on the rewrite (see [ROADMAP.md](ROADMAP.md)):

1. **Follow Phase Order**: Implement features according to phase sequence
2. **Test Continuously**: Don't wait until Phase 7 to write tests
3. **Document Decisions**: Update ADRs (Architecture Decision Records) when making significant choices
4. **Update Task Files**: Check off completed tasks in `.tasks/` files
5. **Parallel Testing**: Run tests in parallel to save time during development

### Rewrite-Specific Tests

For migrated features:
- **Comparison tests**: Verify new implementation matches old behavior
- **Migration tests**: Test data migration scripts
- **Compatibility tests**: Ensure backward compatibility where needed

---
