# Phase 6: Mobile & PWA

**Duration**: 2-3 weeks
**Status**: Not Started
**Dependencies**: Phase 1 (Foundation), Phase 2 (Game Logic), Phase 5 (Multiplayer)

---

## Overview

Deploy Marbble as native mobile applications (iOS and Android) using Capacitor, and implement Progressive Web App features for offline play and improved mobile web experience. This replaces the legacy Cordova setup with modern web-to-native tooling.

---

## Goals

- [ ] Native iOS and Android apps built with Capacitor
- [ ] PWA with offline functionality
- [ ] App store submissions (Google Play, Apple App Store)
- [ ] Push notifications for game events
- [ ] Optimized mobile UX

---

## Tasks

### 1. Cordova to Capacitor Migration (Week 1)

**Source**: Current Cordova setup in `config.xml`, `platforms/`, `plugins/`

#### 1.1 Capacitor Initialization
- [ ] **1.1.1** Initialize Capacitor (already done in Phase 1)
  ```bash
  cd marbble-frontend
  npm install @capacitor/core @capacitor/cli
  npx cap init
  ```

- [ ] **1.1.2** Configure `capacitor.config.ts`
  ```typescript
  import { CapacitorConfig } from '@capacitor/cli';

  const config: CapacitorConfig = {
    appId: 'com.marbble.app',
    appName: 'Marbble',
    webDir: 'build',
    server: {
      androidScheme: 'https',
      iosScheme: 'https'
    },
    plugins: {
      SplashScreen: {
        launchShowDuration: 2000,
        backgroundColor: '#1e293b',
        showSpinner: false
      },
      StatusBar: {
        style: 'dark',
        backgroundColor: '#1e293b'
      }
    }
  };

  export default config;
  ```

#### 1.2 Plugin Migration
- [ ] **1.2.1** Map Cordova plugins to Capacitor equivalents

  | Cordova Plugin | Capacitor Plugin |
  |----------------|------------------|
  | `cordova-plugin-file` | `@capacitor/filesystem` |
  | `cordova-plugin-globalization` | `@capacitor/device` |
  | `cordova-plugin-inappbrowser` | `@capacitor/browser` |
  | `cordova-plugin-splashscreen` | `@capacitor/splash-screen` |
  | `cordova-plugin-statusbar` | `@capacitor/status-bar` |
  | `cordova-plugin-screen-orientation` | `@capacitor/screen-orientation` |

- [ ] **1.2.2** Install Capacitor plugins
  ```bash
  npm install @capacitor/filesystem
  npm install @capacitor/device
  npm install @capacitor/browser
  npm install @capacitor/splash-screen
  npm install @capacitor/status-bar
  npm install @capacitor/screen-orientation
  npm install @capacitor/app
  npm install @capacitor/network
  npm install @capacitor/haptics
  npm install @capacitor/share
  ```

- [ ] **1.2.3** Migrate plugin usage in code
  ```typescript
  // Old Cordova:
  // navigator.globalization.getPreferredLanguage(...)

  // New Capacitor:
  import { Device } from '@capacitor/device';

  const info = await Device.getLanguageCode();
  ```

#### 1.3 Platform Configuration
- [ ] **1.3.1** Add Android platform
  ```bash
  npm install @capacitor/android
  npx cap add android
  ```

  - Open `android/app/build.gradle`
  - Set `minSdkVersion 22` (Android 5.1+)
  - Set `targetSdkVersion 34` (Android 14)
  - Configure app permissions in `AndroidManifest.xml`

- [ ] **1.3.2** Add iOS platform
  ```bash
  npm install @capacitor/ios
  npx cap add ios
  ```

  - Open `ios/App/App.xcworkspace` in Xcode
  - Set deployment target: iOS 13.0+
  - Configure Info.plist permissions
  - Set bundle identifier: `com.marbble.app`

### 2. Mobile UI/UX Optimization (Week 1)

#### 2.1 Responsive Design
- [ ] **2.1.1** Optimize game board for mobile
  - Touch-friendly tile size (min 44x44 points)
  - Scalable board based on screen size
  - Pinch-to-zoom support (optional)
  - Portrait and landscape modes

- [ ] **2.1.2** Mobile-first navigation
  - Bottom tab bar or hamburger menu
  - Swipe gestures for navigation
  - Full-screen game view
  - Minimize UI chrome during gameplay

- [ ] **2.1.3** Touch interactions
  - Tap to select tile from rack
  - Tap board cell to place tile
  - Long-press for tile details
  - Drag-and-drop optimization for touch

#### 2.2 Mobile Components
- [ ] **2.2.1** Create mobile-specific components
  - `MobileGameBoard.svelte` (optimized layout)
  - `MobileTileRack.svelte` (larger touch targets)
  - `MobileMenu.svelte` (mobile navigation)
  - `MobileKeyboard.svelte` (optional virtual keyboard)

- [ ] **2.2.2** Platform-specific styling
  ```typescript
  import { Capacitor } from '@capacitor/core';

  const isMobile = Capacitor.isNativePlatform();
  const isIOS = Capacitor.getPlatform() === 'ios';
  const isAndroid = Capacitor.getPlatform() === 'android';

  // Apply platform-specific styles
  <div class:mobile={isMobile} class:ios={isIOS} class:android={isAndroid}>
    <!-- content -->
  </div>
  ```

#### 2.3 Performance Optimization
- [ ] **2.3.1** Optimize bundle size
  - Code splitting by route
  - Lazy load heavy components
  - Tree-shake unused code
  - Compress assets

- [ ] **2.3.2** Optimize rendering
  - Virtual scrolling for long lists
  - Debounce/throttle animations
  - Use CSS transforms for animations
  - Reduce re-renders with Svelte's reactivity

- [ ] **2.3.3** Memory management
  - Clean up subscriptions on component destroy
  - Limit cached data
  - Release large objects when not needed

### 3. Progressive Web App (PWA) (Week 1-2)

#### 3.1 Service Worker Setup
- [ ] **3.1.1** Configure SvelteKit for PWA
  ```bash
  npm install -D @vite-pwa/sveltekit
  ```

  ```typescript
  // vite.config.ts
  import { sveltekit } from '@sveltejs/kit/vite';
  import { SvelteKitPWA } from '@vite-pwa/sveltekit';

  export default {
    plugins: [
      sveltekit(),
      SvelteKitPWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Marbble',
          short_name: 'Marbble',
          description: 'Free multilingual word game',
          theme_color: '#1e293b',
          background_color: '#1e293b',
          display: 'standalone',
          orientation: 'any',
          icons: [
            {
              src: '/icon-192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.marbble\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 // 1 hour
                }
              }
            }
          ]
        }
      })
    ]
  };
  ```

- [ ] **3.1.2** Create web manifest
  - App name, description, icons
  - Theme color, background color
  - Display mode: standalone
  - Start URL, scope

#### 3.2 Offline Functionality
- [ ] **3.2.1** Cache game assets
  - HTML, CSS, JavaScript bundles
  - Images, fonts
  - Game sounds
  - Wordlist data (partial)

- [ ] **3.2.2** Offline game state
  ```typescript
  // Use IndexedDB for offline storage
  import { openDB } from 'idb';

  const db = await openDB('marbble-offline', 1, {
    upgrade(db) {
      db.createObjectStore('games', { keyPath: 'id' });
      db.createObjectStore('moves', { keyPath: 'id' });
    }
  });

  // Save game offline
  async function saveGameOffline(game: Game) {
    await db.put('games', game);
  }

  // Load game offline
  async function loadGameOffline(gameId: string) {
    return await db.get('games', gameId);
  }
  ```

- [ ] **3.2.3** Background sync for moves
  ```typescript
  // Queue moves when offline
  async function submitMoveOffline(move: Move) {
    await db.put('pending_moves', move);

    // Register background sync
    if ('sync' in navigator.serviceWorker) {
      await navigator.serviceWorker.ready;
      await (navigator.serviceWorker as any).sync.register('sync-moves');
    }
  }

  // Service worker: sync moves when online
  self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-moves') {
      event.waitUntil(syncPendingMoves());
    }
  });

  async function syncPendingMoves() {
    const moves = await db.getAll('pending_moves');
    for (const move of moves) {
      try {
        await fetch('/api/games/moves', {
          method: 'POST',
          body: JSON.stringify(move)
        });
        await db.delete('pending_moves', move.id);
      } catch (err) {
        // Keep in queue, will retry later
      }
    }
  }
  ```

- [ ] **3.2.4** Offline UI indicators
  - Show "offline" badge
  - Disable multiplayer features when offline
  - Allow solo play against AI (if implemented)
  - Queue actions for later sync

#### 3.3 Install Prompt
- [ ] **3.3.1** Implement "Add to Home Screen" prompt
  ```typescript
  let deferredPrompt: BeforeInstallPromptEvent;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallPrompt = true;
  });

  async function installApp() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User installed app');
    }

    deferredPrompt = null;
    showInstallPrompt = false;
  }
  ```

### 4. Push Notifications (Week 2)

#### 4.1 Capacitor Push Notifications
- [ ] **4.1.1** Install and configure plugin
  ```bash
  npm install @capacitor/push-notifications
  ```

- [ ] **4.1.2** Request permissions
  ```typescript
  import { PushNotifications } from '@capacitor/push-notifications';

  async function initPushNotifications() {
    // Request permission
    const permission = await PushNotifications.requestPermissions();

    if (permission.receive === 'granted') {
      await PushNotifications.register();
    }

    // Get registration token
    PushNotifications.addListener('registration', async (token) => {
      console.log('Push token:', token.value);

      // Send token to backend
      await api.registerPushToken(token.value);
    });

    // Handle notification received
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Notification:', notification);
      showInAppNotification(notification);
    });

    // Handle notification tapped
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      const data = action.notification.data;

      if (data.gameId) {
        // Navigate to game
        goto(`/game/${data.gameId}`);
      }
    });
  }
  ```

#### 4.2 Backend Integration
- [ ] **4.2.1** Store push tokens
  ```sql
  CREATE TABLE push_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    token TEXT NOT NULL,
    platform VARCHAR(10) NOT NULL, -- 'ios', 'android', 'web'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```

- [ ] **4.2.2** Send notifications from backend
  ```typescript
  // Use Firebase Cloud Messaging (FCM)
  import * as admin from 'firebase-admin';

  async function sendPushNotification(userId: string, notification: Notification) {
    const tokens = await db.query(
      'SELECT token FROM push_tokens WHERE user_id = $1',
      [userId]
    );

    const messages = tokens.rows.map(t => ({
      token: t.token,
      notification: {
        title: notification.title,
        body: notification.body
      },
      data: notification.data
    }));

    await admin.messaging().sendAll(messages);
  }

  // Example: Notify player of their turn
  async function notifyPlayerTurn(playerId: string, gameId: string) {
    await sendPushNotification(playerId, {
      title: 'Your turn!',
      body: 'It\'s your turn in Marbble',
      data: { gameId }
    });
  }
  ```

#### 4.3 Notification Types
- [ ] **4.3.1** Implement notification scenarios
  - Turn notifications: "Your turn!"
  - Game invites: "John invited you to a game"
  - Move responses: "John played 'WORD' for 45 points"
  - Game ended: "Game finished - You won!"
  - Friend requests

### 5. Platform-Specific Features (Week 2)

#### 5.1 iOS-Specific
- [ ] **5.1.1** Configure iOS app
  - Set app icons (all required sizes)
  - Splash screen (storyboard)
  - Privacy descriptions in Info.plist
  - Sign with Apple (optional)

- [ ] **5.1.2** iOS permissions
  ```xml
  <!-- Info.plist -->
  <key>NSPhotoLibraryUsageDescription</key>
  <string>To save game screenshots</string>

  <key>NSCameraUsageDescription</key>
  <string>To take game screenshots</string>
  ```

- [ ] **5.1.3** iOS-specific plugins
  ```bash
  npm install @capacitor/haptics  # Haptic feedback
  npm install @capacitor/share    # Native share sheet
  ```

  ```typescript
  import { Haptics, ImpactStyle } from '@capacitor/haptics';
  import { Share } from '@capacitor/share';

  // Haptic feedback on tile placement
  await Haptics.impact({ style: ImpactStyle.Light });

  // Share game result
  await Share.share({
    title: 'Marbble Game Result',
    text: 'I scored 250 points!',
    url: 'https://marbble.com/game/123',
    dialogTitle: 'Share your score'
  });
  ```

#### 5.2 Android-Specific
- [ ] **5.2.1** Configure Android app
  - App icons (mipmap densities)
  - Splash screen (res/drawable)
  - Permissions in AndroidManifest.xml
  - Signing key for release

- [ ] **5.2.2** Android permissions
  ```xml
  <!-- AndroidManifest.xml -->
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.VIBRATE" />
  <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
  ```

- [ ] **5.2.3** Handle Android back button
  ```typescript
  import { App } from '@capacitor/app';

  App.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      // On root page, show exit confirmation
      showExitConfirmation();
    } else {
      // Navigate back
      window.history.back();
    }
  });
  ```

### 6. App Store Preparation (Week 3)

#### 6.1 iOS App Store
- [ ] **6.1.1** Create app in App Store Connect
  - Bundle ID: `com.marbble.app`
  - App name: "Marbble - Multilingual Word Game"
  - Primary language: English
  - SKU, category (Games > Word)

- [ ] **6.1.2** Prepare app assets
  - App icon (1024x1024)
  - Screenshots (iPhone, iPad - various sizes)
  - App preview video (optional)
  - Privacy policy URL
  - Support URL

- [ ] **6.1.3** App metadata
  - Description (4000 chars max)
  - Keywords (100 chars max)
  - Promotional text (170 chars)
  - Version release notes

- [ ] **6.1.4** Build and submit
  ```bash
  # Build iOS app
  npm run build
  npx cap sync ios
  npx cap open ios

  # In Xcode:
  # - Archive app (Product > Archive)
  # - Validate app
  # - Distribute to App Store
  ```

- [ ] **6.1.5** App Review
  - Test account credentials
  - Demo video (if complex)
  - Review notes
  - Submit for review

#### 6.2 Google Play Store
- [ ] **6.2.1** Create app in Google Play Console
  - Package name: `com.marbble.app`
  - App name: "Marbble - Multilingual Word Game"
  - Category: Word
  - Content rating questionnaire

- [ ] **6.2.2** Prepare app assets
  - App icon (512x512)
  - Feature graphic (1024x500)
  - Screenshots (phone, tablet, 7-inch tablet)
  - Privacy policy URL

- [ ] **6.2.3** App metadata
  - Short description (80 chars)
  - Full description (4000 chars)
  - Version release notes

- [ ] **6.2.4** Build and submit
  ```bash
  # Build Android app (release)
  npm run build
  npx cap sync android
  cd android
  ./gradlew bundleRelease

  # Sign APK/AAB
  # Upload to Google Play Console (Internal testing → Production)
  ```

- [ ] **6.2.5** Release rollout
  - Internal testing (optional)
  - Closed testing (optional)
  - Open testing / Beta (optional)
  - Production release

### 7. Testing on Devices (Week 3)

#### 7.1 iOS Testing
- [ ] **7.1.1** Test on iOS Simulator
  - Multiple device sizes (iPhone SE, iPhone 15, iPad)
  - Different iOS versions (13.0+)
  - Rotation, gestures, accessibility

- [ ] **7.1.2** Test on physical iOS devices
  - Install via Xcode or TestFlight
  - Test touch interactions
  - Test notifications
  - Performance profiling

#### 7.2 Android Testing
- [ ] **7.2.1** Test on Android Emulator
  - Multiple screen sizes (phone, tablet)
  - Different Android versions (5.1+)
  - Test back button, app lifecycle

- [ ] **7.2.2** Test on physical Android devices
  - Install APK directly or via Google Play (internal track)
  - Test various manufacturers (Samsung, Pixel, etc.)
  - Performance on low-end devices

#### 7.3 PWA Testing
- [ ] **7.3.1** Test PWA on mobile browsers
  - Chrome (Android)
  - Safari (iOS)
  - Firefox (Android)

- [ ] **7.3.2** Test offline functionality
  - Load app while offline
  - Play game offline
  - Sync when back online

- [ ] **7.3.3** Test installation
  - Add to home screen (Android)
  - Add to home screen (iOS)
  - Standalone mode

---

## Deliverables

### Native Apps
- [ ] iOS app ready for App Store submission
- [ ] Android app ready for Google Play submission
- [ ] All Capacitor plugins working correctly
- [ ] Platform-specific features implemented

### PWA
- [ ] Service worker caching assets
- [ ] Offline gameplay functional
- [ ] Background sync for moves
- [ ] Install prompt implemented

### Push Notifications
- [ ] Push notifications working on iOS
- [ ] Push notifications working on Android
- [ ] Notification types implemented (turn, invite, etc.)

### App Store Assets
- [ ] App icons (all sizes)
- [ ] Screenshots (all required sizes)
- [ ] App descriptions and metadata
- [ ] Privacy policy and support pages

---

## Acceptance Criteria

- [ ] iOS app runs smoothly on iOS 13+ devices
- [ ] Android app runs smoothly on Android 5.1+ devices
- [ ] PWA installs and works offline
- [ ] Push notifications delivered reliably
- [ ] Touch interactions feel native
- [ ] Performance: 60 FPS on mid-range devices
- [ ] App passes App Store and Play Store review
- [ ] All Capacitor plugins tested and functional
- [ ] No crashes or major bugs on target devices

---

## Resources

### Capacitor
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
- [Capacitor iOS Configuration](https://capacitorjs.com/docs/ios/configuration)
- [Capacitor Android Configuration](https://capacitorjs.com/docs/android/configuration)

### PWA
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

### App Stores
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Google Play Console](https://play.google.com/console)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)

### Push Notifications
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Capacitor Push Notifications](https://capacitorjs.com/docs/apis/push-notifications)

---

## Notes

- **Testing Early**: Test on physical devices early and often
- **Performance**: Profile on low-end devices to ensure smooth experience
- **App Review**: Allow 1-2 weeks for app store review process
- **Privacy**: Ensure compliance with App Store and Play Store privacy requirements
- **Updates**: Plan for Over-The-Air (OTA) updates via Capacitor or CodePush
- **Analytics**: Consider adding mobile analytics (Firebase Analytics, Mixpanel)

---

## Next Phase

Once Phase 6 is complete, proceed to [Phase 7: Testing & Polish](phase-7-testing.md).
