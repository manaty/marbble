# Phase 7: Testing & Polish

**Duration**: 2-3 weeks
**Status**: Not Started
**Dependencies**: All previous phases (1-6)

---

## Overview

Comprehensive testing, performance optimization, and production readiness. This final phase ensures the application is polished, secure, accessible, and ready for launch.

---

## Goals

- [ ] 80%+ test coverage across frontend and backend
- [ ] Performance benchmarks met (Lighthouse score 90+)
- [ ] Security audit passed with no critical issues
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Production deployment successful

---

## Tasks

### 1. Unit Testing (Week 1)

#### 1.1 Frontend Unit Tests (Vitest)
- [ ] **1.1.1** Component tests
  ```typescript
  // GameBoard.test.ts
  import { render, screen } from '@testing-library/svelte';
  import GameBoard from '$lib/components/GameBoard.svelte';

  describe('GameBoard', () => {
    it('renders 15x15 grid (225 cells)', () => {
      render(GameBoard, { props: { board: emptyBoard } });
      const cells = screen.getAllByRole('button');
      expect(cells).toHaveLength(225);
    });

    it('displays placed tiles correctly', () => {
      const board = boardWithTiles;
      render(GameBoard, { props: { board } });
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument(); // point value
    });

    it('highlights valid drop zones on drag', async () => {
      const { component } = render(GameBoard);
      await component.$set({ dragging: true, draggedTile: { letter: 'A' } });
      const validCells = screen.getAllByTestId('valid-drop-zone');
      expect(validCells.length).toBeGreaterThan(0);
    });
  });
  ```

- [ ] **1.1.2** Store tests
  ```typescript
  // gameStore.test.ts
  import { get } from 'svelte/store';
  import { gameStore, makeMove } from '$lib/stores/gameStore';

  describe('gameStore', () => {
    it('initializes with empty board', () => {
      const state = get(gameStore);
      expect(state.board).toHaveLength(225);
      expect(state.board.every(cell => cell === null)).toBe(true);
    });

    it('updates board on move', () => {
      makeMove({ tiles: [{ letter: 'A', position: 112 }] });
      const state = get(gameStore);
      expect(state.board[112]).toEqual({ letter: 'A', value: 1 });
    });
  });
  ```

- [ ] **1.1.3** Service tests
  ```typescript
  // MoveValidator.test.ts
  import { MoveValidator } from '$lib/services/MoveValidator';

  describe('MoveValidator', () => {
    it('accepts valid horizontal word', () => {
      const move = { tiles: [
        { letter: 'C', position: 112 },
        { letter: 'A', position: 113 },
        { letter: 'T', position: 114 }
      ]};
      const result = validator.validate(move, emptyBoard);
      expect(result.valid).toBe(true);
      expect(result.words).toContain('CAT');
    });

    it('rejects tiles not in a line', () => {
      const move = { tiles: [
        { letter: 'A', position: 112 },
        { letter: 'B', position: 127 },
        { letter: 'C', position: 100 }
      ]};
      const result = validator.validate(move, emptyBoard);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Tiles must be in a line');
    });

    it('requires first move to use center cell', () => {
      const move = { tiles: [
        { letter: 'C', position: 100 },
        { letter: 'A', position: 101 }
      ]};
      const result = validator.validate(move, emptyBoard);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('First move must use center cell');
    });
  });
  ```

- [ ] **1.1.4** Run tests and measure coverage
  ```bash
  npm run test:unit
  npm run test:coverage

  # Target: 80%+ coverage
  ```

#### 1.2 Backend Unit Tests (Jest)
- [ ] **1.2.1** Controller tests
  ```typescript
  // game.controller.spec.ts
  describe('GameController', () => {
    it('POST /games - creates new game', async () => {
      const dto = { mode: GameMode.CLASSIC, language: 'en' };
      const result = await controller.create(dto);

      expect(result).toHaveProperty('id');
      expect(result.mode).toBe(GameMode.CLASSIC);
    });

    it('POST /games/:id/moves - validates move', async () => {
      const move = { tiles: [{ letter: 'A', position: 112 }] };

      await expect(
        controller.submitMove('invalid-game-id', move)
      ).rejects.toThrow('Game not found');
    });
  });
  ```

- [ ] **1.2.2** Service tests
  ```typescript
  // wordlist.service.spec.ts
  describe('WordlistService', () => {
    it('validates English word correctly', async () => {
      const result = await service.validateWord('cat', 'en');
      expect(result).toBe(true);
    });

    it('rejects invalid word', async () => {
      const result = await service.validateWord('xyz123', 'en');
      expect(result).toBe(false);
    });

    it('caches validation results', async () => {
      await service.validateWord('cat', 'en');
      const spy = jest.spyOn(supabase, 'from');

      await service.validateWord('cat', 'en');
      expect(spy).not.toHaveBeenCalled(); // Should use cache
    });
  });
  ```

- [ ] **1.2.3** Run backend tests
  ```bash
  npm run test
  npm run test:cov

  # Target: 80%+ coverage
  ```

### 2. Integration Testing (Week 1)

#### 2.1 API Integration Tests
- [ ] **2.1.1** Test full game flow
  ```typescript
  describe('Game Flow Integration', () => {
    it('completes full game turn cycle', async () => {
      // 1. Create game
      const game = await request(app)
        .post('/api/games')
        .send({ mode: GameMode.CLASSIC, language: 'en' })
        .expect(201);

      // 2. Join game
      await request(app)
        .post(`/api/games/${game.body.id}/join`)
        .send({ playerId: 'player1', language: 'en' })
        .expect(200);

      // 3. Submit move
      const move = await request(app)
        .post(`/api/games/${game.body.id}/moves`)
        .send({ playerId: 'player1', tiles: [{ letter: 'C', position: 112 }] })
        .expect(201);

      expect(move.body.valid).toBe(true);

      // 4. Verify game state updated
      const updated = await request(app)
        .get(`/api/games/${game.body.id}`)
        .expect(200);

      expect(updated.body.moves).toHaveLength(1);
    });
  });
  ```

- [ ] **2.1.2** Test authentication flow
  ```typescript
  describe('Authentication', () => {
    it('requires auth token for protected routes', async () => {
      await request(app)
        .post('/api/games')
        .send({ mode: GameMode.CLASSIC })
        .expect(401);
    });

    it('accepts valid JWT token', async () => {
      const token = await getAuthToken();

      await request(app)
        .post('/api/games')
        .set('Authorization', `Bearer ${token}`)
        .send({ mode: GameMode.CLASSIC, language: 'en' })
        .expect(201);
    });
  });
  ```

#### 2.2 WebSocket Integration Tests
- [ ] **2.2.1** Test real-time events
  ```typescript
  describe('WebSocket Integration', () => {
    it('broadcasts move to all players', async () => {
      const socket1 = io('ws://localhost:3000/multiplayer');
      const socket2 = io('ws://localhost:3000/multiplayer');

      socket1.emit('game:join', { gameId: testGameId });
      socket2.emit('game:join', { gameId: testGameId });

      const movePromise = new Promise(resolve => {
        socket2.on('move:made', resolve);
      });

      socket1.emit('game:move', testMove);

      const receivedMove = await movePromise;
      expect(receivedMove).toMatchObject(testMove);
    });
  });
  ```

#### 2.3 Database Integration Tests
- [ ] **2.3.1** Test Supabase operations
  ```typescript
  describe('Database Operations', () => {
    it('enforces Row Level Security', async () => {
      const user1Client = createClient(url, anonKey, { auth: { user: user1 } });
      const user2Client = createClient(url, anonKey, { auth: { user: user2 } });

      // User 1 creates game
      const { data: game } = await user1Client
        .from('games')
        .insert({ mode: 0, language: 'en' })
        .single();

      // User 2 cannot access game (not a player)
      const { data, error } = await user2Client
        .from('games')
        .select()
        .eq('id', game.id);

      expect(data).toHaveLength(0);
    });
  });
  ```

### 3. End-to-End Testing (Week 1-2)

#### 3.1 Playwright E2E Tests
- [ ] **3.1.1** Set up Playwright
  ```bash
  npm create playwright@latest
  ```

- [ ] **3.1.2** Critical user flows
  ```typescript
  // tests/e2e/game-flow.spec.ts
  import { test, expect } from '@playwright/test';

  test('user can create and play game', async ({ page }) => {
    // 1. Navigate to app
    await page.goto('/');

    // 2. Click "New Game"
    await page.click('text=New Game');

    // 3. Select Classic mode
    await page.click('text=Classic Mode');
    await page.selectOption('#language', 'en');
    await page.click('text=Start Game');

    // 4. Wait for game board
    await expect(page.locator('.game-board')).toBeVisible();

    // 5. Drag tile from rack to board
    await page.dragAndDrop('.tile-rack .tile:first-child', '.cell-112');

    // 6. Submit move
    await page.click('text=Submit Move');

    // 7. Verify score updated
    await expect(page.locator('.score')).toContainText(/[0-9]+/);
  });

  test('multiplayer game with 2 players', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Player 1 creates game
    await page1.goto('/');
    await page1.click('text=New Game');
    await page1.click('text=Marbble Mode');

    const gameUrl = page1.url();

    // Player 2 joins game
    await page2.goto(gameUrl);
    await page2.click('text=Join Game');

    // Verify both players see each other
    await expect(page1.locator('.player-list')).toContainText('Player 2');
    await expect(page2.locator('.player-list')).toContainText('Player 1');
  });
  ```

- [ ] **3.1.3** Mobile E2E tests
  ```typescript
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('mobile game experience', async ({ page }) => {
    await page.goto('/');

    // Test touch interactions
    await page.tap('text=New Game');

    // Test responsive layout
    const board = page.locator('.game-board');
    const box = await board.boundingBox();
    expect(box.width).toBeLessThanOrEqual(375);
  });
  ```

- [ ] **3.1.4** Cross-browser testing
  ```typescript
  // playwright.config.ts
  export default {
    projects: [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit', use: { ...devices['Desktop Safari'] } },
      { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
      { name: 'mobile-safari', use: { ...devices['iPhone 12'] } }
    ]
  };
  ```

### 4. Performance Testing (Week 2)

#### 4.1 Lighthouse Audits
- [ ] **4.1.1** Run Lighthouse CI
  ```bash
  npm install -g @lhci/cli

  # lighthouse.config.js
  module.exports = {
    ci: {
      collect: {
        url: ['http://localhost:3000/'],
        numberOfRuns: 3
      },
      assert: {
        assertions: {
          'categories:performance': ['error', { minScore: 0.9 }],
          'categories:accessibility': ['error', { minScore: 0.9 }],
          'categories:best-practices': ['error', { minScore: 0.9 }],
          'categories:seo': ['error', { minScore: 0.9 }]
        }
      }
    }
  };

  lhci autorun
  ```

- [ ] **4.1.2** Optimize based on Lighthouse recommendations
  - Reduce bundle size (code splitting, tree shaking)
  - Optimize images (WebP, lazy loading)
  - Minimize CSS/JS
  - Enable compression (Brotli, gzip)
  - Use CDN for static assets

#### 4.2 Load Testing
- [ ] **4.2.1** API load tests with Artillery
  ```yaml
  # load-test.yml
  config:
    target: 'https://api.marbble.com'
    phases:
      - duration: 60
        arrivalRate: 10  # 10 users/sec
      - duration: 120
        arrivalRate: 50  # Ramp to 50 users/sec

  scenarios:
    - name: 'Create and play game'
      flow:
        - post:
            url: '/api/games'
            json:
              mode: 0
              language: 'en'
        - post:
            url: '/api/games/{{ id }}/moves'
            json:
              tiles: [{ letter: 'A', position: 112 }]
  ```

  ```bash
  artillery run load-test.yml
  ```

- [ ] **4.2.2** WebSocket load test
  ```typescript
  // ws-load-test.ts
  import { io } from 'socket.io-client';

  async function loadTest() {
    const sockets = [];

    // Create 1000 concurrent connections
    for (let i = 0; i < 1000; i++) {
      const socket = io('ws://api.marbble.com/multiplayer');
      socket.emit('game:join', { gameId: 'test-game' });
      sockets.push(socket);
    }

    // Measure latency
    const start = Date.now();
    sockets[0].emit('game:move', testMove);

    await new Promise(resolve => {
      sockets[999].on('move:made', () => {
        const latency = Date.now() - start;
        console.log(`Latency: ${latency}ms`);
        resolve(null);
      });
    });
  }
  ```

#### 4.3 Database Performance
- [ ] **4.3.1** Query optimization
  ```sql
  -- Analyze slow queries
  SELECT
    query,
    mean_exec_time,
    calls
  FROM pg_stat_statements
  ORDER BY mean_exec_time DESC
  LIMIT 10;

  -- Add missing indexes
  CREATE INDEX IF NOT EXISTS idx_game_moves_game_id ON game_moves(game_id);
  CREATE INDEX IF NOT EXISTS idx_game_players_user_id ON game_players(user_id);
  ```

- [ ] **4.3.2** Connection pooling
  ```typescript
  // Ensure Supabase connection pooling is configured
  const supabase = createClient(url, key, {
    db: {
      schema: 'public',
    },
    auth: {
      persistSession: false
    },
    global: {
      headers: { 'x-connection-pooling': 'true' }
    }
  });
  ```

### 5. Security Audit (Week 2)

#### 5.1 Dependency Scanning
- [ ] **5.1.1** Run security audits
  ```bash
  npm audit
  npm audit fix

  # Use Snyk for deeper scanning
  npx snyk test
  npx snyk monitor
  ```

- [ ] **5.1.2** Update vulnerable packages
  - Review `npm audit` report
  - Update dependencies to patched versions
  - Document any unfixable vulnerabilities

#### 5.2 OWASP Security Testing
- [ ] **5.2.1** SQL Injection testing
  - Test all API endpoints with malicious input
  - Verify parameterized queries used
  - Check Supabase RLS policies

- [ ] **5.2.2** XSS (Cross-Site Scripting) testing
  - Test input fields with script tags
  - Verify proper output escaping (Svelte does this by default)
  - Check user-generated content rendering

- [ ] **5.2.3** CSRF protection
  - Verify CSRF tokens on state-changing operations
  - Check SameSite cookie attributes
  - Test with CSRF attack vectors

- [ ] **5.2.4** Authentication testing
  - Test JWT expiration and refresh
  - Verify session invalidation on logout
  - Test password reset flow for vulnerabilities

#### 5.3 Penetration Testing
- [ ] **5.3.1** Use OWASP ZAP
  ```bash
  docker run -t owasp/zap2docker-stable zap-baseline.py -t https://marbble.com
  ```

- [ ] **5.3.2** Manual security review
  - Review all authentication flows
  - Check authorization on all endpoints
  - Test rate limiting
  - Verify sensitive data encryption

### 6. Accessibility (Week 2)

#### 6.1 WCAG 2.1 AA Compliance
- [ ] **6.1.1** Automated accessibility testing
  ```bash
  npm install -D @axe-core/playwright

  # In E2E tests:
  import { injectAxe, checkA11y } from 'axe-playwright';

  test('has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
    await checkA11y(page);
  });
  ```

- [ ] **6.1.2** Keyboard navigation
  - Tab through all interactive elements
  - Test keyboard shortcuts (arrow keys for tile movement)
  - Ensure focus indicators visible
  - Test Escape to close modals

- [ ] **6.1.3** Screen reader testing
  - Test with NVDA (Windows)
  - Test with VoiceOver (macOS/iOS)
  - Test with TalkBack (Android)
  - Ensure proper ARIA labels

- [ ] **6.1.4** Color contrast
  - Verify 4.5:1 contrast for text
  - Verify 3:1 contrast for UI components
  - Test in high contrast mode
  - Ensure no reliance on color alone

#### 6.2 Accessibility Fixes
- [ ] **6.2.1** Semantic HTML
  ```svelte
  <!-- Use proper landmarks -->
  <nav aria-label="Main navigation">...</nav>
  <main>...</main>
  <aside aria-label="Player list">...</aside>

  <!-- Proper heading hierarchy -->
  <h1>Marbble</h1>
  <h2>Game Board</h2>
  <h3>Player 1</h3>
  ```

- [ ] **6.2.2** ARIA attributes
  ```svelte
  <button
    aria-label="Place tile A at position 112"
    aria-pressed={isPlaced}
  >
    A
  </button>

  <div
    role="grid"
    aria-label="Game board, 15 by 15"
  >
    <!-- cells -->
  </div>
  ```

- [ ] **6.2.3** Focus management
  ```typescript
  // Move focus to new element after action
  function submitMove() {
    // ... submit logic
    document.getElementById('next-turn-player')?.focus();
  }
  ```

### 7. Production Deployment (Week 3)

#### 7.1 Frontend Deployment (Vercel/Netlify)
- [ ] **7.1.1** Configure build
  ```json
  // vercel.json
  {
    "buildCommand": "npm run build",
    "outputDirectory": "build",
    "framework": "sveltekit",
    "env": {
      "PUBLIC_SUPABASE_URL": "@supabase-url",
      "PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
    }
  }
  ```

- [ ] **7.1.2** Set up custom domain
  - Configure DNS records
  - Enable HTTPS/SSL
  - Set up CDN

- [ ] **7.1.3** Environment variables
  - Production Supabase URL and keys
  - API endpoints
  - Analytics keys

#### 7.2 Backend Deployment (Railway/Render/Fly.io)
- [ ] **7.2.1** Containerize backend
  ```dockerfile
  # Dockerfile
  FROM node:20-alpine

  WORKDIR /app

  COPY package*.json ./
  RUN npm ci --only=production

  COPY . .

  RUN npm run build

  EXPOSE 3000

  CMD ["node", "dist/main.js"]
  ```

- [ ] **7.2.2** Deploy to hosting platform
  ```bash
  # Example: Railway
  railway login
  railway init
  railway up

  # Or: Render
  # Connect GitHub repo, configure build & start commands
  ```

- [ ] **7.2.3** Configure environment variables
  - Supabase service key
  - Database connection string
  - JWT secret
  - External API keys

#### 7.3 Monitoring & Logging
- [ ] **7.3.1** Set up error tracking (Sentry)
  ```bash
  npm install @sentry/sveltekit @sentry/node

  # hooks.client.ts
  import * as Sentry from '@sentry/sveltekit';

  Sentry.init({
    dsn: 'your-dsn',
    environment: 'production',
    tracesSampleRate: 1.0
  });
  ```

- [ ] **7.3.2** Set up logging
  ```typescript
  // Backend: use Winston or Pino
  import { Logger } from '@nestjs/common';

  const logger = new Logger('GameService');
  logger.log('Game created', { gameId });
  logger.error('Move validation failed', { error, gameId });
  ```

- [ ] **7.3.3** Set up analytics (Plausible/PostHog)
  ```svelte
  <!-- In app.html -->
  <script defer data-domain="marbble.com" src="https://plausible.io/js/script.js"></script>
  ```

- [ ] **7.3.4** Health checks and uptime monitoring
  ```typescript
  // GET /health
  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }

  // Use UptimeRobot or similar for monitoring
  ```

### 8. Documentation & Launch Prep (Week 3)

#### 8.1 User Documentation
- [ ] **8.1.1** In-app help/tutorial
  - First-time user onboarding
  - Interactive tutorial
  - Rules explanation
  - Tips and strategies

- [ ] **8.1.2** FAQ page
  - How to play
  - Multilingual mode explanation
  - Troubleshooting
  - Account management

#### 8.2 Developer Documentation
- [ ] **8.2.1** API documentation (complete)
  - All endpoints documented
  - Example requests/responses
  - Authentication guide
  - WebSocket events

- [ ] **8.2.2** Deployment guide
  - How to deploy frontend
  - How to deploy backend
  - Environment configuration
  - Database migrations

- [ ] **8.2.3** Contributing guide
  - Development setup
  - Code standards
  - Pull request process
  - Testing requirements

#### 8.3 Launch Checklist
- [ ] **8.3.1** Pre-launch verification
  - [ ] All tests passing (unit, integration, E2E)
  - [ ] Performance benchmarks met
  - [ ] Security audit passed
  - [ ] Accessibility compliance verified
  - [ ] Mobile apps submitted to stores
  - [ ] Production deployment successful
  - [ ] Monitoring and logging active
  - [ ] Backup and disaster recovery plan
  - [ ] Terms of Service and Privacy Policy published
  - [ ] Support email configured

- [ ] **8.3.2** Soft launch
  - Beta testing with limited users
  - Monitor for issues
  - Gather feedback
  - Iterate and fix

- [ ] **8.3.3** Public launch
  - Marketing materials ready
  - Social media announcement
  - Press release (optional)
  - Monitor traffic and errors
  - Be ready for hotfixes

---

## Deliverables

### Testing
- [ ] 80%+ unit test coverage (frontend and backend)
- [ ] Integration test suite
- [ ] E2E test suite with critical flows
- [ ] Load test reports

### Performance
- [ ] Lighthouse score 90+ (all categories)
- [ ] Bundle size optimized
- [ ] Database queries optimized
- [ ] Load test results documented

### Security
- [ ] Security audit report
- [ ] All critical vulnerabilities fixed
- [ ] Penetration test results

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Screen reader compatibility
- [ ] Keyboard navigation support

### Production
- [ ] Frontend deployed to production
- [ ] Backend deployed to production
- [ ] Monitoring and logging configured
- [ ] Documentation complete

---

## Acceptance Criteria

- [ ] All automated tests passing
- [ ] Test coverage ≥ 80%
- [ ] Lighthouse score ≥ 90 (Performance, Accessibility, Best Practices, SEO)
- [ ] No critical security vulnerabilities
- [ ] WCAG 2.1 AA compliant
- [ ] Load tested for 1000+ concurrent users
- [ ] Production deployment stable
- [ ] Monitoring dashboards active
- [ ] Documentation complete and accurate
- [ ] Mobile apps approved in app stores
- [ ] Ready for public launch

---

## Resources

### Testing
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Artillery](https://www.artillery.io/)

### Performance
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [WebPageTest](https://www.webpagetest.org/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP ZAP](https://www.zaproxy.org/)
- [Snyk](https://snyk.io/)

### Accessibility
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)

---

## Notes

- **Continuous Testing**: Run tests in CI/CD pipeline on every commit
- **Performance Budget**: Set and enforce performance budgets
- **Security First**: Address security issues immediately
- **Accessibility from Start**: Don't treat accessibility as an afterthought
- **Monitor Production**: Set up alerts for errors, performance degradation, and downtime
- **Iterate**: Launch is not the end - continue testing, monitoring, and improving

---

## Project Completion

Once Phase 7 is complete:
- [ ] Marbble rewrite is production-ready
- [ ] All deliverables from Phases 1-7 completed
- [ ] Successfully migrated from legacy stack to modern stack
- [ ] Ready for public launch and user onboarding

**Congratulations on completing the Marbble rewrite! 🎉**
