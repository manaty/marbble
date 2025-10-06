# Phase 5: Multiplayer & Realtime

**Duration**: 3-4 weeks
**Status**: Not Started
**Dependencies**: Phase 1 (Foundation), Phase 2 (Game Logic), Phase 3 (Backend)

---

## Overview

Implement real-time multiplayer functionality using Supabase Realtime and WebSockets. This phase replaces the peer-to-peer WebRTC system with a server-authoritative architecture for better reliability and cheat prevention.

---

## Goals

- [ ] Real-time game updates via Supabase Realtime
- [ ] WebSocket communication for live events
- [ ] Matchmaking and game discovery system
- [ ] Player presence and notifications
- [ ] Network resilience and reconnection logic

---

## Tasks

### 1. Architecture Decision (Week 1)

#### 1.1 Choose Multiplayer Approach
- [ ] **1.1.1** Evaluate options

  **Option A: Server-Authoritative (Recommended)**
  - All game state on server (Supabase)
  - Moves validated server-side
  - Supabase Realtime for state sync
  - Pros: Secure, easier to implement, scales well
  - Cons: Higher latency, server costs

  **Option B: Hybrid P2P**
  - WebRTC for move transmission (low latency)
  - Server validates and resolves conflicts
  - NestJS WebSocket for signaling
  - Pros: Lower latency, reduced server load
  - Cons: Complex, NAT/firewall issues

  **Option C: Full P2P (Current Legacy)**
  - Direct peer connections
  - Server only for signaling
  - Pros: Minimal server load
  - Cons: Cheat risks, connectivity issues

- [ ] **1.1.2** Make decision and document
  - Create ADR (Architecture Decision Record)
  - Justify choice based on:
    - Security requirements
    - Latency tolerance
    - Development complexity
    - Scalability needs
    - Cost considerations

**Recommendation**: Go with **Server-Authoritative** for better security and simpler implementation.

---

### 2. Supabase Realtime Integration (Week 1-2)

**Source**: Current P2P in `www/js/misc/peerMisc.js`, WebRTC signaling in `java/Signaling.java`

#### 2.1 Realtime Setup
- [ ] **2.1.1** Enable Realtime in Supabase
  - Enable Realtime for tables: `games`, `game_moves`, `game_players`
  - Configure Realtime policies
  - Set up broadcast and presence

- [ ] **2.1.2** Create Realtime service in frontend
  ```typescript
  // src/lib/services/RealtimeService.ts
  import { createClient, RealtimeChannel } from '@supabase/supabase-js';

  export class RealtimeService {
    private channel: RealtimeChannel | null = null;

    async subscribeToGame(gameId: string, callbacks: GameCallbacks) {
      this.channel = supabase.channel(`game:${gameId}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`
        }, (payload) => {
          callbacks.onGameUpdate(payload.new);
        })
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'game_moves',
          filter: `game_id=eq.${gameId}`
        }, (payload) => {
          callbacks.onNewMove(payload.new);
        })
        .subscribe();
    }

    async unsubscribe() {
      await this.channel?.unsubscribe();
    }
  }
  ```

#### 2.2 Game State Synchronization
- [ ] **2.2.1** Subscribe to game updates
  - Listen to `games` table changes
  - Update local game state store
  - Handle concurrent updates

- [ ] **2.2.2** Subscribe to move inserts
  - Listen to `game_moves` table inserts
  - Animate new moves on board
  - Update scores and turn indicators

- [ ] **2.2.3** Subscribe to player changes
  - Listen to `game_players` table updates
  - Detect player join/leave
  - Update player list UI

- [ ] **2.2.4** Implement optimistic updates
  ```typescript
  async function submitMove(move: Move) {
    // 1. Optimistic update (local UI)
    gameStore.update(state => ({
      ...state,
      board: applyMoveLocally(state.board, move)
    }));

    try {
      // 2. Send to server
      const result = await api.submitMove(move);

      // 3. Server validates and broadcasts update via Realtime
      // (handled by subscription callback)

    } catch (error) {
      // 4. Rollback on error
      gameStore.update(state => ({
        ...state,
        board: rollbackMove(state.board, move)
      }));
    }
  }
  ```

#### 2.3 Presence Tracking
- [ ] **2.3.1** Track online players
  ```typescript
  const channel = supabase.channel(`game:${gameId}`)
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const onlinePlayers = Object.keys(state);
      updatePresenceUI(onlinePlayers);
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }) => {
      showNotification(`${key} joined the game`);
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      showNotification(`${key} left the game`);
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user: currentUser.id,
          online_at: new Date().toISOString()
        });
      }
    });
  ```

- [ ] **2.3.2** Handle player disconnect
  - Detect when player goes offline
  - Pause game or allow timeout
  - Resume on reconnect

- [ ] **2.3.3** Show online/offline indicators
  - Green dot for online
  - Gray dot for offline
  - "Away" status for inactive

### 3. WebSocket Events (Week 2)

**Backend**: NestJS WebSocket Gateway (from Phase 3)

#### 3.1 Client-Server Events
- [ ] **3.1.1** Implement client event handlers (Frontend)
  ```typescript
  // src/lib/services/WebSocketService.ts
  import { io, Socket } from 'socket.io-client';

  export class WebSocketService {
    private socket: Socket;

    connect(gameId: string) {
      this.socket = io('ws://backend-url/multiplayer', {
        auth: { token: getAuthToken() }
      });

      this.socket.on('connect', () => {
        this.socket.emit('game:join', { gameId });
      });

      this.socket.on('game:updated', (game) => {
        gameStore.set(game);
      });

      this.socket.on('move:made', (move) => {
        animateMove(move);
      });

      this.socket.on('turn:changed', (playerId) => {
        updateCurrentTurn(playerId);
      });

      this.socket.on('player:joined', (player) => {
        addPlayerToUI(player);
      });

      this.socket.on('player:left', (playerId) => {
        removePlayerFromUI(playerId);
      });
    }

    submitMove(move: Move) {
      this.socket.emit('game:move', move);
    }

    disconnect() {
      this.socket.disconnect();
    }
  }
  ```

- [ ] **3.1.2** Handle server events
  - `game:updated` - Full game state sync
  - `move:made` - New move notification
  - `turn:changed` - Turn progression
  - `player:joined` - Player joined game
  - `player:left` - Player left game
  - `game:ended` - Game finished
  - `error` - Error notifications

#### 3.2 Event Validation
- [ ] **3.2.1** Validate events server-side
  ```typescript
  // Backend: multiplayer.gateway.ts
  @SubscribeMessage('game:move')
  async handleMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MoveDto
  ) {
    // 1. Validate player is in game
    // 2. Validate it's player's turn
    // 3. Validate move legality
    // 4. Apply move to database
    // 5. Broadcast to all players in game
    this.server.to(data.gameId).emit('move:made', validatedMove);
  }
  ```

- [ ] **3.2.2** Prevent cheating
  - Server validates all moves
  - Rate limiting per player
  - Check turn order
  - Verify tile ownership

#### 3.3 Chat/Messaging (Optional)
- [ ] **3.3.1** Implement game chat
  ```typescript
  // Client
  socket.emit('chat:message', { gameId, message: 'Good game!' });

  socket.on('chat:new', ({ from, message, timestamp }) => {
    addChatMessage(from, message, timestamp);
  });
  ```

- [ ] **3.3.2** Add chat moderation
  - Profanity filter
  - Spam prevention
  - Mute/block players

### 4. Matchmaking System (Week 2-3)

#### 4.1 Game Discovery
- [ ] **4.1.1** List available games
  ```typescript
  // GET /api/games?status=waiting&mode=marbble
  async function findGames(filters: GameFilters): Promise<Game[]> {
    const { data } = await supabase
      .from('games')
      .select('*, game_players(*)')
      .eq('status', GameStatus.WAITING)
      .lt('game_players.count', 'max_players');

    return data;
  }
  ```

- [ ] **4.1.2** Create game browser UI
  - List of open games
  - Filter by mode, language, players
  - Quick join button
  - Create new game button

- [ ] **4.1.3** Real-time game list updates
  ```typescript
  supabase.channel('game-lobby')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'games',
      filter: 'status=eq.0' // STATUS_WAITING
    }, (payload) => {
      if (payload.eventType === 'INSERT') {
        addGameToList(payload.new);
      } else if (payload.eventType === 'UPDATE') {
        updateGameInList(payload.new);
      } else if (payload.eventType === 'DELETE') {
        removeGameFromList(payload.old.id);
      }
    })
    .subscribe();
  ```

#### 4.2 Matchmaking Logic
- [ ] **4.2.1** Implement quick match
  ```typescript
  async function quickMatch(player: Player): Promise<Game> {
    // 1. Find suitable game (same language for Classic, any for Marbble)
    let game = await findOpenGame(player.language, player.mode);

    // 2. If no game found, create new one
    if (!game) {
      game = await createGame({
        mode: player.mode,
        language: player.language,
        maxPlayers: 2
      });
    }

    // 3. Join the game
    await joinGame(game.id, player);

    return game;
  }
  ```

- [ ] **4.2.2** Skill-based matchmaking (Optional)
  - Track player ratings (ELO)
  - Match players of similar skill
  - Expand search range over time

- [ ] **4.2.3** Private game creation
  ```typescript
  async function createPrivateGame(settings: GameSettings): Promise<{ game: Game, joinCode: string }> {
    const joinCode = generateRandomCode(6); // e.g., "ABC123"

    const game = await supabase
      .from('games')
      .insert({
        ...settings,
        is_private: true,
        join_code: joinCode
      })
      .single();

    return { game, joinCode };
  }

  async function joinPrivateGame(joinCode: string, player: Player): Promise<Game> {
    const { data } = await supabase
      .from('games')
      .select()
      .eq('join_code', joinCode)
      .single();

    if (!data) throw new Error('Game not found');

    await joinGame(data.id, player);
    return data;
  }
  ```

#### 4.3 Invitations
- [ ] **4.3.1** Implement friend invites
  ```typescript
  async function inviteFriend(gameId: string, friendId: string) {
    await supabase.from('game_invitations').insert({
      game_id: gameId,
      inviter_id: currentUser.id,
      invitee_id: friendId,
      status: 'pending'
    });

    // Send notification via WebSocket or email
    socket.emit('invite:send', { to: friendId, gameId });
  }
  ```

- [ ] **4.3.2** Handle invite responses
  ```typescript
  socket.on('invite:received', (invite) => {
    showInviteNotification(invite);
  });

  async function acceptInvite(inviteId: string) {
    const invite = await getInvite(inviteId);
    await joinGame(invite.game_id, currentUser);
    await updateInviteStatus(inviteId, 'accepted');
  }
  ```

### 5. Network Resilience (Week 3)

#### 5.1 Reconnection Logic
- [ ] **5.1.1** Detect disconnections
  ```typescript
  socket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      // Server disconnected, try to reconnect
      showReconnectingUI();
    } else if (reason === 'transport close') {
      // Network issue
      attemptReconnect();
    }
  });
  ```

- [ ] **5.1.2** Auto-reconnect with exponential backoff
  ```typescript
  let reconnectAttempts = 0;
  const maxAttempts = 5;

  async function attemptReconnect() {
    if (reconnectAttempts >= maxAttempts) {
      showErrorUI('Could not reconnect. Please refresh.');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
    await sleep(delay);

    try {
      await socket.connect();
      reconnectAttempts = 0;
      hideReconnectingUI();
    } catch {
      reconnectAttempts++;
      attemptReconnect();
    }
  }
  ```

- [ ] **5.1.3** Sync state after reconnect
  ```typescript
  socket.on('connect', async () => {
    const latestGameState = await api.getGame(gameId);
    gameStore.set(latestGameState);
  });
  ```

#### 5.2 Conflict Resolution
- [ ] **5.2.1** Handle concurrent moves
  ```typescript
  // Server-side: use database transactions
  async function submitMove(gameId: string, playerId: string, move: Move) {
    const { data, error } = await supabase.rpc('submit_move', {
      p_game_id: gameId,
      p_player_id: playerId,
      p_move: move
    });

    if (error?.code === 'P0001') {
      // Custom error: not player's turn
      throw new NotYourTurnException();
    }

    return data;
  }

  // Database function (Postgres)
  CREATE OR REPLACE FUNCTION submit_move(
    p_game_id UUID,
    p_player_id UUID,
    p_move JSONB
  ) RETURNS JSONB AS $$
  DECLARE
    v_current_turn UUID;
  BEGIN
    -- Lock the game row
    SELECT current_turn INTO v_current_turn
    FROM games
    WHERE id = p_game_id
    FOR UPDATE;

    -- Check if it's player's turn
    IF v_current_turn != p_player_id THEN
      RAISE EXCEPTION 'Not your turn' USING ERRCODE = 'P0001';
    END IF;

    -- Insert move
    -- Update game state
    -- ...
    RETURN jsonb_build_object('success', true);
  END;
  $$ LANGUAGE plpgsql;
  ```

- [ ] **5.2.2** Handle version conflicts
  - Use optimistic locking (version numbers)
  - Detect stale state
  - Force refresh if needed

#### 5.3 Timeout Handling
- [ ] **5.3.1** Turn timer
  ```typescript
  // Start timer when turn begins
  let turnTimer: NodeJS.Timeout;

  function startTurnTimer(duration: number) {
    turnTimer = setTimeout(() => {
      // Auto-pass turn on timeout
      socket.emit('game:pass', { gameId });
    }, duration);
  }

  // Cancel timer when move is made
  function cancelTurnTimer() {
    clearTimeout(turnTimer);
  }
  ```

- [ ] **5.3.2** Idle detection
  ```typescript
  let idleTimer: NodeJS.Timeout;

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      // Mark player as away
      channel.track({ status: 'away' });
    }, 60000); // 1 minute
  }

  // Reset on user activity
  window.addEventListener('mousemove', resetIdleTimer);
  window.addEventListener('keypress', resetIdleTimer);
  ```

### 6. Notifications (Week 3-4)

#### 6.1 In-App Notifications
- [ ] **6.1.1** Toast notifications
  ```typescript
  function showNotification(message: string, type: 'info' | 'success' | 'error') {
    notificationStore.update(n => [...n, { message, type, id: uuid() }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      notificationStore.update(n => n.filter(x => x.id !== id));
    }, 5000);
  }

  // Usage
  socket.on('turn:changed', (playerId) => {
    if (playerId === currentUser.id) {
      showNotification('Your turn!', 'info');
    }
  });
  ```

- [ ] **6.1.2** Visual/audio alerts
  - Sound effect on turn change
  - Desktop notification (if permitted)
  - Badge on browser tab

#### 6.2 Push Notifications (Optional)
- [ ] **6.2.1** Set up push notifications (Capacitor)
  ```typescript
  import { PushNotifications } from '@capacitor/push-notifications';

  async function registerPushNotifications() {
    const permission = await PushNotifications.requestPermissions();

    if (permission.receive === 'granted') {
      await PushNotifications.register();
    }

    PushNotifications.addListener('registration', (token) => {
      // Send token to backend
      api.registerPushToken(token.value);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      showNotification(notification.body, 'info');
    });
  }
  ```

- [ ] **6.2.2** Send notifications from backend
  ```typescript
  // Use Firebase Cloud Messaging or similar
  import * as admin from 'firebase-admin';

  async function notifyPlayerTurn(playerId: string, gameId: string) {
    const user = await getUserById(playerId);

    if (user.pushToken) {
      await admin.messaging().send({
        token: user.pushToken,
        notification: {
          title: 'Your turn!',
          body: 'It\'s your turn in Marbble'
        },
        data: {
          gameId: gameId
        }
      });
    }
  }
  ```

### 7. Testing Multiplayer (Week 4)

#### 7.1 Integration Tests
- [ ] **7.1.1** Test real-time sync
  ```typescript
  describe('Realtime Synchronization', () => {
    it('should update all clients when a move is made', async () => {
      const game = await createTestGame();
      const player1Client = await connectClient(game.id, player1);
      const player2Client = await connectClient(game.id, player2);

      // Player 1 makes move
      await player1Client.submitMove(testMove);

      // Player 2 should receive update
      await waitFor(() => {
        expect(player2Client.gameState.board).toEqual(expectedBoard);
      });
    });
  });
  ```

- [ ] **7.1.2** Test presence tracking
  ```typescript
  it('should detect when player goes offline', async () => {
    const client = await connectClient(gameId, player);

    client.disconnect();

    await waitFor(() => {
      const presence = getPresenceState(gameId);
      expect(presence[player.id]).toBeUndefined();
    });
  });
  ```

- [ ] **7.1.3** Test reconnection
  ```typescript
  it('should reconnect and sync state', async () => {
    const client = await connectClient(gameId, player);

    // Simulate network interruption
    client.socket.disconnect();

    // Make a move while client is offline
    await otherPlayer.submitMove(move);

    // Reconnect
    client.socket.connect();

    await waitFor(() => {
      expect(client.gameState.moves).toContain(move);
    });
  });
  ```

#### 7.2 Load Testing
- [ ] **7.2.1** Simulate multiple concurrent games
  ```typescript
  // Using Socket.IO client
  import { io } from 'socket.io-client';

  async function loadTest() {
    const clients = [];

    for (let i = 0; i < 100; i++) {
      const socket = io('ws://backend-url/multiplayer');
      socket.emit('game:join', { gameId: testGameId });
      clients.push(socket);
    }

    // Simulate moves
    await Promise.all(clients.map(c => c.emit('game:move', randomMove())));

    // Measure latency
  }
  ```

- [ ] **7.2.2** Measure performance metrics
  - Message latency (client → server → clients)
  - Connection capacity (max concurrent connections)
  - Database query performance under load
  - Memory usage

#### 7.3 Edge Case Testing
- [ ] **7.3.1** Test edge cases
  - All players disconnect simultaneously
  - Rapid successive moves
  - Game ended while player is offline
  - Invalid moves from malicious client
  - Network partition (split brain)

---

## Deliverables

### Real-time Features
- [ ] Supabase Realtime subscriptions working
- [ ] WebSocket events for all game actions
- [ ] Player presence tracking
- [ ] Live game state synchronization

### Matchmaking
- [ ] Game browser with filters
- [ ] Quick match functionality
- [ ] Private games with join codes
- [ ] Friend invitation system

### Network Resilience
- [ ] Auto-reconnect logic
- [ ] State sync after reconnect
- [ ] Conflict resolution
- [ ] Timeout handling

### Notifications
- [ ] In-app toast notifications
- [ ] Visual/audio alerts
- [ ] (Optional) Push notifications

### Tests
- [ ] Integration tests for real-time features
- [ ] Load tests for concurrent games
- [ ] Edge case coverage

---

## Acceptance Criteria

- [ ] Players can join games in real-time
- [ ] Moves appear instantly for all players (< 500ms)
- [ ] Presence accurately reflects online/offline status
- [ ] Reconnection works seamlessly
- [ ] No duplicate moves or state conflicts
- [ ] Matchmaking finds or creates games correctly
- [ ] Private games work with join codes
- [ ] Notifications appear at appropriate times
- [ ] Supports 100+ concurrent games
- [ ] All tests pass

---

## Resources

### Supabase Realtime
- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Realtime Broadcast](https://supabase.com/docs/guides/realtime/broadcast)
- [Realtime Presence](https://supabase.com/docs/guides/realtime/presence)

### WebSockets
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [NestJS WebSockets](https://docs.nestjs.com/websockets/gateways)

### Push Notifications
- [Capacitor Push Notifications](https://capacitorjs.com/docs/apis/push-notifications)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)

---

## Notes

- **Server-Authoritative**: Recommended for better security and simpler implementation
- **Latency**: Aim for < 500ms move propagation in same region
- **Scalability**: Supabase Realtime supports 100K+ concurrent connections
- **Cost**: Monitor Supabase usage (database reads, bandwidth)
- **Fallback**: Consider implementing offline mode with AI opponent as fallback

---

## Next Phase

Once Phase 5 is complete, proceed to [Phase 6: Mobile & PWA](phase-6-mobile-pwa.md).
