# Phase 2: Core Game Logic Migration

**Duration**: 4-6 weeks
**Status**: Not Started
**Dependencies**: Phase 1 (Foundation & Setup)

---

## Overview

Migrate the core game mechanics from vanilla JavaScript to Svelte components and TypeScript services. This phase focuses on translating the existing game logic (~6300 lines in gameComponent.js and gameControler.js) into a modern, type-safe architecture.

---

## Goals

- [ ] Functional game board rendering in Svelte
- [ ] Working tile placement and drag-drop system
- [ ] Complete move validation logic
- [ ] Accurate scoring engine with multipliers
- [ ] Comprehensive unit test coverage (80%+)

---

## Tasks

### 1. Svelte Component Architecture (Week 1)

#### 1.1 Game Board Component
**Source**: `www/js/gui/gameComponent.js` (~2900 lines)

- [ ] **1.1.1** Create `GameBoard.svelte`
  - Render 15x15 grid (225 cells)
  - Cell types: normal, DL, TL, DW, TW, center
  - Apply cell styling with TailwindCSS
  - Handle cell click events

- [ ] **1.1.2** Create `Cell.svelte` subcomponent
  - Display cell multiplier labels
  - Show placed tiles
  - Highlight valid drop zones
  - Cell state: empty, occupied, preview

- [ ] **1.1.3** Implement board state rendering
  - Read from game store
  - Update reactively on moves
  - Optimize rendering (avoid re-rendering all cells)
  - Add animations for tile placement

- [ ] **1.1.4** Add responsive design
  - Scale board for different screen sizes
  - Mobile: full-screen board view
  - Desktop: board + player panels side-by-side

#### 1.2 Tile Components
**Source**: `www/js/gui/tileComponent.js`

- [ ] **1.2.1** Create `Tile.svelte`
  - Display letter and point value
  - Show blank tile indicator
  - Tile states: in-rack, on-board, dragging
  - Language-specific styling

- [ ] **1.2.2** Create `TileRack.svelte`
  - Display 7 tiles per player
  - Tile selection interaction
  - Visual feedback for selected tiles
  - Reordering tiles in rack

- [ ] **1.2.3** Create `TileBag.svelte` (info display)
  - Show remaining tiles count
  - Language-specific tile distribution
  - Visual indicator for low tiles

#### 1.3 Player Components
**Source**: `www/js/gui/playerComponent.js`

- [ ] **1.3.1** Create `PlayerPanel.svelte`
  - Display player info (name, language, score)
  - Current turn indicator
  - Timer display (if applicable)
  - Player avatar

- [ ] **1.3.2** Create `ScorePanel.svelte`
  - Real-time score updates
  - Move history display
  - Best word highlight
  - Score breakdown on hover

- [ ] **1.3.3** Create `GameHeader.svelte`
  - Game mode display (Marbble vs Classic)
  - Settings button
  - Exit/forfeit option
  - Help/rules link

### 2. Drag-and-Drop System (Week 1-2)

**Current**: Dragula library (`www/lib/dragula.js`)
**New**: @neodrag/svelte or svelte-dnd-action

- [ ] **2.1** Install and configure drag-drop library
  ```bash
  npm install @neodrag/svelte
  # or
  npm install svelte-dnd-action
  ```

- [ ] **2.2** Implement tile dragging
  - Drag from tile rack
  - Visual feedback during drag
  - Snap to grid on board
  - Return to rack on invalid drop

- [ ] **2.3** Implement drop zones
  - Valid drop: empty cells or recall to rack
  - Invalid drop: occupied cells
  - Preview tile placement
  - Multi-tile placement in single turn

- [ ] **2.4** Mobile touch support
  - Touch drag for mobile devices
  - Long-press to pick up tile
  - Tap to select, tap cell to place (alternative)

- [ ] **2.5** Keyboard accessibility
  - Tab navigation between tiles
  - Arrow keys to move selected tile
  - Enter to place, Esc to cancel
  - Screen reader support

### 3. Game State Management (Week 2)

**Source**: `www/js/model/*.js`

#### 3.1 Svelte Stores
- [ ] **3.1.1** Create `src/lib/stores/gameStore.ts`
  - Game ID, mode, status
  - Board state (225 cells array)
  - Current turn player
  - Move history

  ```typescript
  interface GameState {
    id: string;
    mode: GameMode; // CLASSIC or MARBBLE
    status: GameStatus; // NEW, ONGOING, ENDED
    board: (Tile | null)[]; // 225 cells
    currentTurn: string; // player ID
    moves: Move[];
  }
  ```

- [ ] **3.1.2** Create `src/lib/stores/playerStore.ts`
  - Player list
  - Current player info
  - Tile racks per player
  - Scores

  ```typescript
  interface Player {
    id: string;
    name: string;
    language: string;
    score: number;
    tileRack: Tile[];
    isCurrentPlayer: boolean;
  }
  ```

- [ ] **3.1.3** Create `src/lib/stores/bagStore.ts`
  - Tile bag contents
  - Language-specific tile distribution
  - Draw tile logic
  - Remaining tiles count

- [ ] **3.1.4** Create `src/lib/stores/uiStore.ts`
  - Selected tiles
  - Highlighted cells
  - Modal states (settings, rules, etc.)
  - Toast notifications

#### 3.2 Store Actions
- [ ] **3.2.1** Implement game actions
  - `startGame()`
  - `makeMove(tiles, positions)`
  - `endTurn()`
  - `forfeitGame()`

- [ ] **3.2.2** Implement player actions
  - `drawTiles(count)`
  - `exchangeTiles(tiles)`
  - `passTurn()`

- [ ] **3.2.3** Implement board actions
  - `placeTile(tile, position)`
  - `removeTile(position)`
  - `recallTiles()` (return to rack)

### 4. Game Controller Logic (Week 3)

**Source**: `www/js/controler/gameControler.js` (~1800 lines)

#### 4.1 Move Validation Service
- [ ] **4.1.1** Create `src/lib/services/MoveValidator.ts`
  - Validate tile placement rules
  - Check word formation (horizontal/vertical)
  - Ensure connectivity to existing words
  - Validate first move (must use center cell)

- [ ] **4.1.2** Implement word formation logic
  - Detect all formed words (main + cross words)
  - Extract word strings from board
  - Handle blank tiles (wildcard)

- [ ] **4.1.3** Word validation against dictionary
  - Query Supabase wordlist table
  - Use GIN index for fast lookup
  - Cache validation results
  - Handle multi-language validation (Marbble mode)

- [ ] **4.1.4** Move legality checks
  - At least one tile must be placed
  - All tiles must be in one line
  - Must form valid words
  - Must connect to existing words (except first move)

#### 4.2 Scoring Engine Service
- [ ] **4.2.1** Create `src/lib/services/ScoringEngine.ts`
  - Calculate base word score
  - Apply letter multipliers (DL, TL)
  - Apply word multipliers (DW, TW)
  - Bonus for using all 7 tiles (50 points)

- [ ] **4.2.2** Implement multiplier logic
  - DL (Double Letter): 2x letter value
  - TL (Triple Letter): 3x letter value
  - DW (Double Word): 2x word score
  - TW (Triple Word): 3x word score
  - Multipliers only apply once

- [ ] **4.2.3** Score calculation for multiple words
  - Main word score
  - Cross words score (perpendicular)
  - Multipliers apply to all words using new tiles
  - Total move score

- [ ] **4.2.4** Language-specific tile values
  - Load letter scores from config
  - Different values per language (en, fr, es, tl, de, it, pt)
  - Blank tiles: 0 points

#### 4.3 Game Flow Service
- [ ] **4.3.1** Create `src/lib/services/GameService.ts`
  - Initialize new game
  - Handle turn progression
  - Detect game end conditions
  - Calculate final scores

- [ ] **4.3.2** Turn management
  - Validate move before submission
  - Update board state
  - Draw new tiles
  - Switch to next player
  - Save move to history

- [ ] **4.3.3** Game end detection
  - Tile bag empty + player has no tiles
  - All players pass consecutively
  - Player forfeits
  - Calculate final scores (subtract remaining tile values)

- [ ] **4.3.4** Error handling
  - Invalid move errors
  - Network errors
  - State recovery on errors
  - User-friendly error messages

### 5. Tile Bag Logic (Week 3)

**Source**: `www/js/controler/bagControler.js`, `www/js/model/bag.js`

- [ ] **5.1** Create `src/lib/services/BagService.ts`
  - Initialize bag with language-specific tiles
  - Draw random tiles
  - Exchange tiles functionality
  - Track remaining tiles

- [ ] **5.2** Language-specific tile distributions
  - Load from config or database
  - English: 100 tiles (E=12, A=9, I=9, etc.)
  - French: 102 tiles (E=15, A=9, etc.)
  - Spanish: 100 tiles
  - Filipino: 100 tiles
  - German, Italian, Portuguese (to be added)

- [ ] **5.3** Tile drawing logic
  - Random draw from bag
  - Ensure fair distribution
  - Handle empty bag scenario
  - Replenish player rack to 7 tiles

- [ ] **5.4** Tile exchange
  - Return selected tiles to bag
  - Draw same number of new tiles
  - Shuffle bag after exchange
  - Count as a turn (no score)

### 6. Sound Controller (Week 4)

**Source**: `www/js/controler/soundControler.js`

- [ ] **6.1** Create `src/lib/services/SoundService.ts`
  - Play tile placement sound
  - Play move submission sound
  - Play invalid move sound
  - Play turn change sound
  - Play game end sound

- [ ] **6.2** Implement audio management
  - Load audio files
  - Volume control
  - Mute/unmute toggle
  - Persistent settings (localStorage)

- [ ] **6.3** Integrate with game events
  - Tile drag/drop sounds
  - Move validation feedback
  - Turn notifications
  - Score animations with sounds

### 7. TypeScript Type Definitions (Week 4)

- [ ] **7.1** Create `src/lib/types/game.ts`
  ```typescript
  enum GameMode { CLASSIC = 0, MARBBLE = 1 }
  enum GameStatus { NEW = 0, ONGOING = 1, ENDED = 2 }
  enum CellType { NORMAL, DL, TL, DW, TW, CENTER }

  interface Tile {
    letter: string;
    value: number;
    language: string;
    isBlank: boolean;
  }

  interface Cell {
    position: number; // 0-224
    type: CellType;
    tile: Tile | null;
  }

  interface Move {
    playerId: string;
    tiles: { tile: Tile; position: number }[];
    words: string[];
    score: number;
    timestamp: Date;
  }
  ```

- [ ] **7.2** Create `src/lib/types/player.ts`
- [ ] **7.3** Create `src/lib/types/dictionary.ts`
- [ ] **7.4** Export all types from `src/lib/types/index.ts`

### 8. Unit Testing (Week 5-6)

**Framework**: Vitest + Testing Library

#### 8.1 Component Tests
- [ ] **8.1.1** Test `GameBoard.svelte`
  - Renders 15x15 grid
  - Displays tiles correctly
  - Handles cell clicks
  - Updates on state changes

- [ ] **8.1.2** Test `Tile.svelte` and `TileRack.svelte`
  - Displays tile letter and value
  - Drag-drop interactions
  - Selection states

- [ ] **8.1.3** Test `PlayerPanel.svelte`
  - Displays player info
  - Updates score
  - Shows turn indicator

#### 8.2 Service Tests
- [ ] **8.2.1** Test `MoveValidator.ts`
  - Valid moves accepted
  - Invalid moves rejected
  - Word formation detection
  - Connectivity checks

- [ ] **8.2.2** Test `ScoringEngine.ts`
  - Correct base scores
  - Multiplier application
  - Bonus calculations
  - Multi-word scoring

- [ ] **8.2.3** Test `GameService.ts`
  - Game initialization
  - Turn progression
  - Game end detection
  - State management

- [ ] **8.2.4** Test `BagService.ts`
  - Tile distribution
  - Random draw
  - Exchange logic
  - Empty bag handling

#### 8.3 Store Tests
- [ ] **8.3.1** Test `gameStore.ts`
  - State updates
  - Action dispatch
  - Derived stores
  - Persistence

- [ ] **8.3.2** Test `playerStore.ts`
- [ ] **8.3.3** Test `bagStore.ts`

#### 8.4 Integration Tests
- [ ] **8.4.1** Full game flow
  - Start game → place tiles → validate → score → next turn
  - Multiple moves sequence
  - Game end scenarios

- [ ] **8.4.2** Edge cases
  - Empty board first move
  - Using all 7 tiles (bingo)
  - Invalid word placement
  - Tile exchange

---

## Migration Mapping

| Legacy File | New Implementation |
|-------------|-------------------|
| `www/js/gui/gameComponent.js` | `src/lib/components/GameBoard.svelte` |
| `www/js/gui/playerComponent.js` | `src/lib/components/PlayerPanel.svelte` |
| `www/js/gui/tileComponent.js` | `src/lib/components/TileRack.svelte` |
| `www/js/model/game.js` | `src/lib/stores/gameStore.ts` |
| `www/js/model/player.js` | `src/lib/stores/playerStore.ts` |
| `www/js/model/tile.js` | `src/lib/types/game.ts` (Tile interface) |
| `www/js/model/bag.js` | `src/lib/stores/bagStore.ts` |
| `www/js/controler/gameControler.js` | `src/lib/services/GameService.ts` |
| `www/js/controler/bagControler.js` | `src/lib/services/BagService.ts` |
| `www/js/controler/soundControler.js` | `src/lib/services/SoundService.ts` |

---

## Deliverables

### Components
- [ ] Fully functional game board with 15x15 grid
- [ ] Tile rack with drag-and-drop
- [ ] Player panels with live score updates
- [ ] Responsive design for mobile and desktop

### Services
- [ ] Move validation service (all rules implemented)
- [ ] Scoring engine (accurate calculation)
- [ ] Game flow service (turn management)
- [ ] Tile bag service (drawing and exchange)
- [ ] Sound service (audio feedback)

### State Management
- [ ] Svelte stores for game, player, bag, UI state
- [ ] Store actions for all game operations
- [ ] Reactive updates across components

### Tests
- [ ] 80%+ code coverage
- [ ] Unit tests for all components
- [ ] Unit tests for all services
- [ ] Integration tests for game flow

---

## Acceptance Criteria

- [ ] Can start a new game (Classic or Marbble mode)
- [ ] Can drag and drop tiles from rack to board
- [ ] Move validation works correctly (all rules)
- [ ] Score calculation is accurate (including multipliers)
- [ ] Can complete a full game turn cycle
- [ ] UI is responsive on mobile and desktop
- [ ] All unit tests pass
- [ ] No TypeScript errors
- [ ] Performance: < 100ms for move validation

---

## Resources

### Svelte & State Management
- [Svelte Stores Tutorial](https://svelte.dev/tutorial/writable-stores)
- [Advanced Svelte Stores](https://learn.svelte.dev/tutorial/writable-stores)
- [Svelte Component Communication](https://svelte.dev/docs/svelte-components)

### Drag & Drop
- [@neodrag/svelte Docs](https://www.neodrag.dev/docs/svelte)
- [svelte-dnd-action](https://github.com/isaacHagoel/svelte-dnd-action)

### Testing
- [Vitest Guide](https://vitest.dev/guide/)
- [Svelte Testing Library](https://testing-library.com/docs/svelte-testing-library/intro)
- [Testing Svelte Components](https://testing-library.com/docs/svelte-testing-library/example)

---

## Notes

- **Code Reuse**: Extract reusable logic (e.g., board position calculations) into utility functions
- **Performance**: Use Svelte's reactive statements efficiently; avoid unnecessary re-renders
- **Accessibility**: Ensure keyboard navigation and screen reader support
- **Mobile First**: Design components with mobile UX in mind, then scale up for desktop
- **Incremental Migration**: Build one component at a time, test thoroughly before moving on

---

## Next Phase

Once Phase 2 is complete, proceed to [Phase 3: Backend Services](phase-3-backend.md).
