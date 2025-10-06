# Phase 3: Backend Services

**Duration**: 3-4 weeks
**Status**: Not Started
**Dependencies**: Phase 1 (Foundation), Phase 2 (Game Logic)

---

## Overview

Build the NestJS backend to replace the Java JAX-RS services. This phase creates REST APIs, WebSocket support for real-time features, and integrates with Supabase for data persistence and authentication.

---

## Goals

- [ ] Complete REST API for game operations
- [ ] WebSocket gateway for real-time multiplayer
- [ ] Authentication and authorization system
- [ ] Word validation and dictionary services
- [ ] API documentation with Swagger

---

## Tasks

### 1. NestJS Module Structure (Week 1)

**Source**: `java/MarbbleRestService.java`, `marbble/src/main/java/com/marbble/*.java`

#### 1.1 Core Modules
- [ ] **1.1.1** Create Game Module
  ```bash
  nest g module game
  nest g controller game
  nest g service game
  ```
  - CRUD operations for games
  - Move submission and validation
  - Game state management

- [ ] **1.1.2** Create Wordlist Module
  ```bash
  nest g module wordlist
  nest g controller wordlist
  nest g service wordlist
  ```
  - Word validation service
  - Wordlist caching
  - Language-specific lookup

- [ ] **1.1.3** Create Dictionary Module
  ```bash
  nest g module dictionary
  nest g controller dictionary
  nest g service dictionary
  ```
  - Word translation lookup
  - Definition retrieval
  - Cross-language support

- [ ] **1.1.4** Create Multiplayer Module
  ```bash
  nest g module multiplayer
  nest g gateway multiplayer
  ```
  - WebSocket gateway
  - Real-time game events
  - Player presence

- [ ] **1.1.5** Create Auth Module
  ```bash
  nest g module auth
  nest g controller auth
  nest g service auth
  ```
  - Supabase authentication integration
  - JWT validation
  - User session management

#### 1.2 Shared Module
- [ ] **1.2.1** Create Common Module
  - Shared utilities
  - Error handling
  - Response interceptors
  - Validation pipes

- [ ] **1.2.2** Create Config Module
  - Environment configuration
  - Supabase client setup
  - Constants and enums

### 2. Game API Endpoints (Week 1-2)

#### 2.1 Game CRUD Operations
- [ ] **2.1.1** `POST /api/games` - Create new game
  ```typescript
  interface CreateGameDto {
    mode: GameMode; // CLASSIC or MARBBLE
    language?: string; // For Classic mode
    isPrivate: boolean;
    maxPlayers: number; // 2-4
  }

  Response: { gameId: string, joinCode: string }
  ```

- [ ] **2.1.2** `GET /api/games/:id` - Get game state
  ```typescript
  Response: {
    id: string;
    mode: GameMode;
    status: GameStatus;
    board: Cell[];
    players: Player[];
    currentTurn: string;
    moves: Move[];
  }
  ```

- [ ] **2.1.3** `POST /api/games/:id/join` - Join game
  ```typescript
  interface JoinGameDto {
    playerId: string;
    language: string; // For Marbble mode
    joinCode?: string; // For private games
  }

  Response: { success: boolean, playerSlot: number }
  ```

- [ ] **2.1.4** `DELETE /api/games/:id/leave` - Leave game
  ```typescript
  Response: { success: boolean }
  ```

- [ ] **2.1.5** `GET /api/games` - List games
  ```typescript
  Query params: status, mode, language, page, limit
  Response: { games: Game[], total: number }
  ```

#### 2.2 Move Operations
- [ ] **2.2.1** `POST /api/games/:id/moves` - Submit move
  ```typescript
  interface SubmitMoveDto {
    playerId: string;
    tiles: { letter: string; position: number }[];
  }

  Response: {
    valid: boolean;
    score?: number;
    words?: string[];
    errors?: string[];
  }
  ```

- [ ] **2.2.2** `POST /api/games/:id/validate` - Validate word
  ```typescript
  interface ValidateWordDto {
    word: string;
    language: string;
  }

  Response: { valid: boolean, definition?: string }
  ```

- [ ] **2.2.3** `POST /api/games/:id/exchange` - Exchange tiles
  ```typescript
  interface ExchangeTilesDto {
    playerId: string;
    tiles: string[]; // Letters to exchange
  }

  Response: { newTiles: Tile[] }
  ```

- [ ] **2.2.4** `POST /api/games/:id/pass` - Pass turn
  ```typescript
  Response: { nextPlayer: string }
  ```

- [ ] **2.2.5** `GET /api/games/:id/moves` - Get move history
  ```typescript
  Response: { moves: Move[] }
  ```

#### 2.3 Game Management
- [ ] **2.3.1** `POST /api/games/:id/start` - Start game
  ```typescript
  Response: { success: boolean, firstPlayer: string }
  ```

- [ ] **2.3.2** `POST /api/games/:id/end` - End game
  ```typescript
  interface EndGameDto {
    reason: 'completed' | 'forfeit' | 'timeout';
  }

  Response: { finalScores: PlayerScore[] }
  ```

- [ ] **2.3.3** `POST /api/games/:id/forfeit` - Forfeit game
  ```typescript
  Response: { winner: string }
  ```

### 3. Word Validation Service (Week 2)

**Source**: Wordlist lookup logic from Java backend

#### 3.1 Wordlist Service
- [ ] **3.1.1** Create `wordlist.service.ts`
  - Load wordlists from Supabase on startup
  - Cache in memory (Map<language, Set<string>>)
  - Fast O(1) lookup for word validation
  - Periodic cache refresh

- [ ] **3.1.2** Implement validation methods
  ```typescript
  async validateWord(word: string, language: string): Promise<boolean>
  async validateMultipleWords(words: string[], language: string): Promise<boolean[]>
  async findWordsStartingWith(prefix: string, language: string): Promise<string[]>
  ```

- [ ] **3.1.3** Query optimization
  - Use Supabase GIN index for fast lookup
  - Implement caching layer (Redis or in-memory)
  - Batch validation for multiple words
  - Handle uppercase/lowercase normalization

- [ ] **3.1.4** Wordlist management endpoints
  - `GET /api/wordlists/:language/stats` - Word count, etc.
  - `POST /api/wordlists/:language/check` - Batch word check
  - `GET /api/wordlists/:language/random` - Random words (for hints)

#### 3.2 Dictionary Service
**Source**: `dictool/` Java processor, `www/js/dic/` files

- [ ] **3.2.1** Create `dictionary.service.ts`
  - Lookup translations between languages
  - Get word definitions
  - Find synonyms/related words

- [ ] **3.2.2** Implement dictionary endpoints
  ```typescript
  // GET /api/dictionary/translate/:word
  async translate(word: string, fromLang: string, toLang: string): Promise<Translation[]>

  // GET /api/dictionary/define/:word
  async define(word: string, language: string): Promise<Definition>
  ```

- [ ] **3.2.3** Dictionary caching
  - Cache frequent translations
  - LRU cache for definitions
  - Preload common words

### 4. WebSocket Gateway for Multiplayer (Week 2-3)

**Source**: `java/Signaling.java`, `www/js/misc/peerMisc.js`

#### 4.1 WebSocket Setup
- [ ] **4.1.1** Configure Socket.IO gateway
  ```typescript
  @WebSocketGateway({
    namespace: '/multiplayer',
    cors: { origin: '*' }
  })
  export class MultiplayerGateway { }
  ```

- [ ] **4.1.2** Implement connection handling
  - Handle client connect/disconnect
  - Authenticate WebSocket connections (JWT)
  - Assign players to game rooms
  - Track online/offline status

#### 4.2 Real-time Events
- [ ] **4.2.1** Game events
  ```typescript
  // Server → Client events
  @SubscribeMessage('game:move')
  handleMove(client: Socket, data: MoveData)

  @SubscribeMessage('game:join')
  handleJoin(client: Socket, data: JoinData)

  @SubscribeMessage('game:leave')
  handleLeave(client: Socket)

  // Client ← Server events
  server.to(gameId).emit('game:updated', gameState)
  server.to(gameId).emit('player:joined', player)
  server.to(gameId).emit('turn:changed', nextPlayer)
  server.to(gameId).emit('move:made', move)
  ```

- [ ] **4.2.2** Player presence
  ```typescript
  @SubscribeMessage('presence:online')
  handleOnline(client: Socket)

  server.to(gameId).emit('presence:status', { playerId, status: 'online' })
  ```

- [ ] **4.2.3** Chat/messaging (optional)
  ```typescript
  @SubscribeMessage('chat:message')
  handleChatMessage(client: Socket, message: string)

  server.to(gameId).emit('chat:new', { from, message, timestamp })
  ```

#### 4.3 WebRTC Signaling (P2P option)
**Source**: `java/Signaling.java`, `java/PeerMisc.java`

- [ ] **4.3.1** Implement signaling server (if P2P needed)
  ```typescript
  @SubscribeMessage('webrtc:offer')
  handleOffer(client: Socket, offer: RTCSessionDescription)

  @SubscribeMessage('webrtc:answer')
  handleAnswer(client: Socket, answer: RTCSessionDescription)

  @SubscribeMessage('webrtc:ice-candidate')
  handleIceCandidate(client: Socket, candidate: RTCIceCandidate)
  ```

- [ ] **4.3.2** Peer connection management
  - Facilitate peer discovery
  - Relay SDP and ICE candidates
  - Handle connection failures
  - Fallback to server relay

#### 4.4 Room Management
- [ ] **4.4.1** Game room logic
  - Create/join/leave rooms
  - Room capacity limits (2-4 players)
  - Private vs public rooms
  - Room cleanup on empty

- [ ] **4.4.2** State synchronization
  - Broadcast game state updates
  - Handle concurrent move attempts
  - Conflict resolution (server authoritative)
  - Ensure all clients have consistent state

### 5. Authentication & Authorization (Week 3)

#### 5.1 Supabase Auth Integration
- [ ] **5.1.1** Set up Supabase client
  ```typescript
  import { createClient } from '@supabase/supabase-js';

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
  ```

- [ ] **5.1.2** JWT validation middleware
  ```typescript
  @Injectable()
  export class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const token = context.switchToHttp().getRequest().headers.authorization;
      const { data, error } = await supabase.auth.getUser(token);
      return !error;
    }
  }
  ```

- [ ] **5.1.3** User context decorator
  ```typescript
  export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    },
  );

  // Usage: async createGame(@CurrentUser() user: User) { }
  ```

#### 5.2 Authorization Rules
- [ ] **5.2.1** Implement guards
  - `IsGamePlayer` - Check if user is in game
  - `IsGameHost` - Check if user is game host
  - `IsPlayerTurn` - Check if it's player's turn

- [ ] **5.2.2** Apply guards to endpoints
  ```typescript
  @UseGuards(AuthGuard, IsGamePlayer)
  @Post(':id/moves')
  async submitMove(@Param('id') gameId: string, @Body() dto: SubmitMoveDto) { }
  ```

#### 5.3 Guest Support
- [ ] **5.3.1** Anonymous authentication
  - Generate anonymous user IDs
  - Limited game access (public games only)
  - Convert to registered user option

### 6. Supabase Integration (Week 3)

#### 6.1 Database Operations
- [ ] **6.1.1** Create Prisma schema (or use Supabase client)
  ```prisma
  model Game {
    id        String   @id @default(uuid())
    mode      Int
    status    Int
    language  String?
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    players   GamePlayer[]
    moves     GameMove[]
  }
  ```

- [ ] **6.1.2** Implement repository pattern
  ```typescript
  @Injectable()
  export class GameRepository {
    async create(data: CreateGameDto): Promise<Game>
    async findById(id: string): Promise<Game>
    async update(id: string, data: Partial<Game>): Promise<Game>
    async delete(id: string): Promise<void>
  }
  ```

#### 6.2 Real-time Subscriptions
- [ ] **6.2.1** Subscribe to game updates
  ```typescript
  supabase
    .channel(`game:${gameId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'games' },
      (payload) => {
        // Broadcast to WebSocket clients
        this.server.to(gameId).emit('game:updated', payload.new);
      }
    )
    .subscribe();
  ```

- [ ] **6.2.2** Subscribe to move inserts
  - Listen to `game_moves` table
  - Broadcast new moves to players
  - Update game state

### 7. API Documentation (Week 4)

#### 7.1 Swagger/OpenAPI Setup
- [ ] **7.1.1** Configure Swagger module
  ```typescript
  const config = new DocumentBuilder()
    .setTitle('Marbble API')
    .setDescription('Multiplayer word game API')
    .setVersion('2.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  ```

- [ ] **7.1.2** Add API decorators
  ```typescript
  @ApiTags('games')
  @ApiBearerAuth()
  export class GameController {
    @ApiOperation({ summary: 'Create new game' })
    @ApiResponse({ status: 201, description: 'Game created', type: Game })
    @Post()
    async create(@Body() dto: CreateGameDto) { }
  }
  ```

#### 7.2 Documentation Content
- [ ] **7.2.1** Document all endpoints
  - Request/response schemas
  - Authentication requirements
  - Error responses
  - Example requests

- [ ] **7.2.2** Add schema descriptions
  ```typescript
  export class CreateGameDto {
    @ApiProperty({ description: 'Game mode', enum: GameMode })
    mode: GameMode;

    @ApiProperty({ description: 'Language for Classic mode', required: false })
    language?: string;
  }
  ```

- [ ] **7.2.3** WebSocket event documentation
  - Document all events (client → server, server → client)
  - Payload schemas
  - Connection flow

### 8. Error Handling & Validation (Week 4)

#### 8.1 Global Exception Filter
- [ ] **8.1.1** Create custom exception filter
  ```typescript
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      // Log error
      // Format error response
      // Return consistent error structure
    }
  }
  ```

- [ ] **8.1.2** Define error types
  - `GameNotFoundException`
  - `InvalidMoveException`
  - `NotPlayerTurnException`
  - `WordNotValidException`

#### 8.2 Request Validation
- [ ] **8.2.1** Use class-validator
  ```typescript
  export class SubmitMoveDto {
    @IsUUID()
    playerId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TilePlacement)
    tiles: TilePlacement[];
  }
  ```

- [ ] **8.2.2** Enable global validation pipe
  ```typescript
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  ```

### 9. Integration Testing (Week 4)

#### 9.1 API Tests
- [ ] **9.1.1** Test game endpoints
  ```typescript
  describe('GameController', () => {
    it('POST /api/games - creates new game', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/games')
        .send({ mode: GameMode.CLASSIC, language: 'en' })
        .expect(201);

      expect(response.body).toHaveProperty('gameId');
    });
  });
  ```

- [ ] **9.1.2** Test move submission
- [ ] **9.1.3** Test word validation
- [ ] **9.1.4** Test authentication

#### 9.2 WebSocket Tests
- [ ] **9.2.1** Test connection
- [ ] **9.2.2** Test game events
- [ ] **9.2.3** Test room joining/leaving

#### 9.3 Service Tests
- [ ] **9.3.1** Test `GameService`
- [ ] **9.3.2** Test `WordlistService`
- [ ] **9.3.3** Test `DictionaryService`

---

## Deliverables

### API
- [ ] REST API with all game endpoints
- [ ] WebSocket gateway for real-time features
- [ ] Authentication and authorization system
- [ ] Comprehensive error handling

### Services
- [ ] Word validation service with caching
- [ ] Dictionary lookup service
- [ ] Game state management
- [ ] Move validation logic

### Documentation
- [ ] Swagger/OpenAPI documentation
- [ ] WebSocket event documentation
- [ ] API usage examples
- [ ] Postman collection

### Tests
- [ ] 80%+ code coverage
- [ ] Integration tests for all endpoints
- [ ] WebSocket tests
- [ ] Service unit tests

---

## Acceptance Criteria

- [ ] All REST endpoints functional and documented
- [ ] WebSocket real-time updates working
- [ ] Authentication via Supabase integrated
- [ ] Word validation returns correct results
- [ ] API response time < 100ms (p95)
- [ ] All tests pass
- [ ] Swagger docs accessible at `/api/docs`
- [ ] Can create and join games via API
- [ ] Moves validated and scored correctly

---

## Resources

### NestJS
- [NestJS Controllers](https://docs.nestjs.com/controllers)
- [NestJS WebSockets](https://docs.nestjs.com/websockets/gateways)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [NestJS Swagger](https://docs.nestjs.com/openapi/introduction)

### Supabase
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

### Testing
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Supertest](https://github.com/visionmedia/supertest)

---

## Notes

- **Database Queries**: Use Supabase RLS policies to secure data access
- **Caching**: Implement Redis for wordlist and dictionary caching if performance is critical
- **Rate Limiting**: Add rate limiting to prevent abuse (e.g., @nestjs/throttler)
- **Logging**: Use NestJS Logger or integrate with external service (Sentry, LogRocket)
- **Monitoring**: Set up health checks and metrics endpoints

---

## Next Phase

Once Phase 3 is complete, proceed to [Phase 4: Dictionary & Wordlist Migration](phase-4-dictionaries.md).
